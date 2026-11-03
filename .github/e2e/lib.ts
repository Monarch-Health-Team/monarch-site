// Shared helpers for the generic QA browser checks (qa.sh e2e).
// Nothing here is repo-specific: routes come from a crawl of "/", and the nav, footer and drawer
// are found with generic selectors. A repo tunes it with the "e2e" key of .github/qa.config.json
// (qa.sh extracts it to $QA_E2E_CONFIG).
import fs from "node:fs";
import path from "node:path";
import type { Page, APIRequestContext, Locator } from "@playwright/test";

export const REPO_ROOT = path.resolve(process.env.QA_REPO_ROOT || process.cwd());
export const OUT = path.resolve(process.env.QA_E2E_OUT || path.join(REPO_ROOT, "qa-artifacts/e2e"));

export type ExpectLink = { name: string; href: string; in?: "nav" | "footer" | "drawer" | "any" };
export type E2EConfig = {
  startPaths: string[];          // where the crawl starts
  maxDepth: number;              // link hops from a start path
  maxRoutes: number;             // hard cap on crawled pages
  exclude: string[];             // regexes on the path; matching routes are not crawled or screenshotted
  ignoreLinks: string[];         // regexes on the href; matching nav/footer links are not checked
  navSelector: string;
  footerSelector: string;
  widths: number[];              // screenshot widths
  screenshotMaxRoutes: number;
  failOnPageError: boolean;      // uncaught JS exceptions on any route fail the run
  failOnConsoleError: boolean;   // console.error messages on any route fail the run
  ignoreConsole: string[];       // regexes; matching console errors are ignored (e.g. a third-party widget)
  expectLinks: ExpectLink[];     // e.g. { "name": "Contact", "href": "/contact", "in": "nav" }
  drawer: {
    path: string;
    width: number;
    required: boolean;           // fail when no drawer toggle is found at the mobile width
    toggle?: string;
    panel?: string;
    close?: string;
    side?: "left" | "right" | "top" | "bottom";
  };
};

const DEFAULTS: E2EConfig = {
  startPaths: ["/"],
  maxDepth: 2,
  maxRoutes: 30,
  exclude: ["^/api/", "^/_next/", "\\.(pdf|png|jpe?g|gif|webp|avif|svg|ico|xml|txt|json|zip|mp4|webm)$"],
  ignoreLinks: [],
  navSelector: "header nav a[href], header a[href]",
  footerSelector: "footer a[href]",
  widths: [375, 1280],
  screenshotMaxRoutes: 20,
  failOnPageError: true,
  failOnConsoleError: true,
  ignoreConsole: ["Download the React DevTools", "\\[Fast Refresh\\]"],
  expectLinks: [],
  drawer: { path: "/", width: 375, required: false },
};

let cached: E2EConfig | undefined;
export function loadConfig(): E2EConfig {
  if (cached) return cached;
  const file = process.env.QA_E2E_CONFIG || path.join(REPO_ROOT, ".github/qa.e2e.json"); // qa.sh always sets QA_E2E_CONFIG
  let user: Partial<E2EConfig> = {};
  if (fs.existsSync(file)) user = JSON.parse(fs.readFileSync(file, "utf8"));
  cached = { ...DEFAULTS, ...user, drawer: { ...DEFAULTS.drawer, ...(user.drawer || {}) } };
  return cached;
}

// ---- problem reporting: one file per check group, read back by qa.sh ----
export class Report {
  problems: string[] = [];
  warnings: string[] = [];
  constructor(private group: string) {}
  fail(msg: string) { this.problems.push(msg); }
  warn(msg: string) { this.warnings.push(msg); }
  write() {
    for (const [dir, list] of [["problems", this.problems], ["warnings", this.warnings]] as const) {
      fs.mkdirSync(path.join(OUT, dir), { recursive: true });
      const f = path.join(OUT, dir, `${this.group}.txt`);
      const uniq = [...new Set(list)];
      if (uniq.length) fs.writeFileSync(f, uniq.map((m) => `- [${this.group}] ${m}`).join("\n") + "\n");
      else if (fs.existsSync(f)) fs.rmSync(f);
    }
  }
}

// ---- routes from global-setup's crawl ----
export type Route = { path: string; status: number; depth: number; from: string };
export function routes(): Route[] {
  const f = path.join(OUT, "routes.json");
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")).routes as Route[]) : [{ path: "/", status: 0, depth: 0, from: "" }];
}
export const okRoutes = () => routes().filter((r) => r.status === 200);

export function slug(p: string) {
  const s = p.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9._-]+/g, "_");
  return s || "home";
}

export const matchesAny = (s: string, res: string[]) => res.some((r) => new RegExp(r, "i").test(s));

// ---- link classification and checking ----
export type LinkInfo = { href: string; text: string; where: string; page: string };

export async function collectLinks(scope: Locator | Page, selector: string, where: string, pagePath: string): Promise<LinkInfo[]> {
  return scope.locator(selector).evaluateAll(
    (els, meta) =>
      els.map((a) => ({
        href: a.getAttribute("href") ?? "",
        text: ((a as HTMLElement).innerText || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim(),
        where: meta.where,
        page: meta.page,
      })),
    { where, page: pagePath },
  );
}

export class LinkChecker {
  private status = new Map<string, number | string>();
  private anchors = new Map<string, { found: boolean; count: number }>();
  constructor(private baseURL: string, private request: APIRequestContext, private page: Page, private rep: Report) {}

  async check(l: LinkInfo) {
    const cfg = loadConfig();
    const label = `${l.where} link "${l.text || "(no text)"}" (href="${l.href}") on ${l.page}`;
    if (matchesAny(l.href, cfg.ignoreLinks)) return;
    const raw = l.href.trim();
    if (raw === "" || raw === "#") return this.rep.fail(`${label} is empty or "#", so it goes nowhere.`);
    if (/^javascript:/i.test(raw)) return this.rep.fail(`${label} uses javascript:, not a real link.`);
    if (/^(mailto|tel|sms):/i.test(raw)) {
      if (raw.split(":")[1].trim() === "") this.rep.fail(`${label} has no address after the scheme.`);
      return;
    }
    let url: URL;
    try { url = new URL(raw, new URL(l.page, this.baseURL)); } catch { return this.rep.fail(`${label} is not a valid URL.`); }
    const base = new URL(this.baseURL);
    if (url.origin !== base.origin) {
      if (!/^https?:$/.test(url.protocol)) this.rep.warn(`${label} uses an unusual scheme ${url.protocol}`);
      return; // external links are not fetched: no network flakiness, no new secrets.
    }
    const target = url.pathname + url.search;
    const st = await this.fetchStatus(target);
    if (st !== 200) return this.rep.fail(`${label} -> ${target} returned ${st}, expected 200.`);
    if (url.hash && url.hash !== "#") {
      const id = decodeURIComponent(url.hash.slice(1));
      const a = await this.anchor(url.pathname, id);
      if (!a.found) this.rep.fail(`${label} -> anchor #${id} does not exist on ${url.pathname}.`);
      else if (a.count > 1) this.rep.warn(`${label} -> #${id} appears ${a.count} times on ${url.pathname} (duplicate id).`);
    }
  }

  private async fetchStatus(target: string) {
    if (!this.status.has(target)) {
      try {
        const r = await this.request.get(new URL(target, this.baseURL).toString(), { maxRedirects: 5, timeout: 20_000 });
        this.status.set(target, r.status());
      } catch (e) {
        this.status.set(target, `error ${(e as Error).message.split("\n")[0]}`);
      }
    }
    return this.status.get(target)!;
  }

  // Anchor targets are checked in a real browser (client-rendered ids count), on a separate tab.
  private async anchor(pathname: string, id: string) {
    const key = `${pathname}#${id}`;
    if (!this.anchors.has(key)) {
      const tab = await this.page.context().newPage();
      try {
        await tab.goto(new URL(pathname, this.baseURL).toString(), { waitUntil: "load" });
        const count = await tab.evaluate(
          (id) => document.querySelectorAll(`[id="${CSS.escape(id)}"]`).length + document.getElementsByName(id).length,
          id,
        );
        this.anchors.set(key, { found: count > 0, count });
      } finally {
        await tab.close();
      }
    }
    return this.anchors.get(key)!;
  }
}

// expectLinks from the e2e settings (.github/qa.config.json): a named link must point where the owner says it should.
export function checkExpected(all: LinkInfo[], baseURL: string, rep: Report, where: LinkInfo["where"][]) {
  for (const exp of loadConfig().expectLinks) {
    const scope = exp.in && exp.in !== "any" ? [exp.in] : where;
    if (!scope.some((w) => where.includes(w))) continue;
    const cands = all.filter((l) => scope.includes(l.where) && l.text.toLowerCase() === exp.name.toLowerCase());
    if (!cands.length) { rep.fail(`expected a ${scope.join("/")} link named "${exp.name}", none found.`); continue; }
    const want = new URL(exp.href, baseURL);
    const wrong = new Map<string, string[]>(); // "where|got" -> pages
    for (const c of cands) {
      const got = new URL(c.href, new URL(c.page, baseURL));
      if (got.pathname === want.pathname && got.hash === want.hash) continue;
      const k = `${c.where}|${got.pathname}${got.hash}`;
      wrong.set(k, [...(wrong.get(k) || []), c.page]);
    }
    for (const [k, pages] of wrong) {
      const [where, got] = k.split("|");
      rep.fail(`${where} link "${exp.name}" goes to ${got}, but .github/qa.config.json (e2e) expects ${want.pathname}${want.hash} (on ${pages.join(", ")}).`);
    }
  }
}

// Lazy images and scroll-triggered sections: scroll to the bottom and back before a full-page shot.
export async function settle(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => {});
  await page.evaluate(() => Promise.all(Array.from(document.images).filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 3000); }))));
}
