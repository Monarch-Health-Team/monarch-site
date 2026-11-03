// Crawl from the start paths (same origin, depth-limited) and write routes.json for the specs.
import fs from "node:fs";
import path from "node:path";
import { chromium, type FullConfig } from "@playwright/test";
import { loadConfig, matchesAny, OUT, Report, type Route } from "./lib";

export default async function globalSetup(config: FullConfig) {
  const cfg = loadConfig();
  const baseURL = String(config.projects[0].use.baseURL);
  const origin = new URL(baseURL).origin;
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const rep = new Report("crawl");
  const browser = await chromium.launch({ channel: config.projects[0].use.channel });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const seen = new Map<string, Route>();
  const queue: Route[] = cfg.startPaths.map((p) => ({ path: p, status: 0, depth: 0, from: "(start)" }));
  let truncated = false;
  while (queue.length) {
    const r = queue.shift()!;
    if (seen.has(r.path)) continue;
    if (seen.size >= cfg.maxRoutes) { truncated = true; break; }
    seen.set(r.path, r);
    try {
      const resp = await page.goto(origin + r.path, { waitUntil: "load", timeout: 30_000 });
      r.status = resp?.status() ?? 0;
    } catch (e) {
      r.status = 0;
      rep.fail(`${r.path} (linked from ${r.from}) did not load: ${(e as Error).message.split("\n")[0]}`);
      continue;
    }
    if (r.status !== 200) { rep.fail(`${r.path} (linked from ${r.from}) returned ${r.status}, expected 200.`); continue; }
    if (r.depth >= cfg.maxDepth) continue;
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const h of hrefs) {
      let u: URL;
      try { u = new URL(h); } catch { continue; }
      if (u.origin !== origin) continue;
      const p = u.pathname.replace(/(.)\/$/, "$1");
      if (matchesAny(p, cfg.exclude) || seen.has(p) || queue.some((q) => q.path === p)) continue;
      queue.push({ path: p, status: 0, depth: r.depth + 1, from: r.path });
    }
  }
  await browser.close();
  if (truncated) rep.warn(`crawl stopped at maxRoutes=${cfg.maxRoutes}; raise e2e.maxRoutes in .github/qa.config.json if pages are missing.`);
  fs.writeFileSync(path.join(OUT, "routes.json"), JSON.stringify({ baseURL, truncated, routes: [...seen.values()] }, null, 2));
  rep.write();
}
