// Every nav and footer link on every crawled route (desktop width): internal hrefs must answer 200,
// and #anchors must exist on the target page. Mobile-only (drawer) links are checked in drawer.spec.ts.
import { test, expect } from "@playwright/test";
import { checkExpected, collectLinks, LinkChecker, loadConfig, okRoutes, Report, type LinkInfo } from "./lib";

test("nav and footer links resolve @1280", async ({ page, request, baseURL }) => {
  const cfg = loadConfig();
  const rep = new Report("links");
  await page.setViewportSize({ width: 1280, height: 900 });
  const checker = new LinkChecker(baseURL!, request, page, rep);
  const all: LinkInfo[] = [];
  const done = new Set<string>();
  for (const r of okRoutes()) {
    await page.goto(r.path, { waitUntil: "load" });
    const nav = await collectLinks(page, cfg.navSelector, "nav", r.path);
    const footer = await collectLinks(page, cfg.footerSelector, "footer", r.path);
    if (r.path === "/" && nav.length === 0) rep.warn(`no links matched navSelector "${cfg.navSelector}" on /.`);
    if (r.path === "/" && footer.length === 0) rep.warn(`no links matched footerSelector "${cfg.footerSelector}" on /.`);
    // A link in the footer that also matches the nav selector is reported once, as footer.
    const footerHrefs = new Set(footer.map((l) => l.href + "|" + l.text));
    for (const l of [...nav.filter((l) => !footerHrefs.has(l.href + "|" + l.text)), ...footer]) {
      all.push(l);
      let key = `${l.where}|${l.href}|${r.path}`;
      try { key = `${l.where}|${new URL(l.href, new URL(r.path, baseURL)).href}`; } catch {}
      if (done.has(key)) continue; // the same resolved link (e.g. the shared header on every page) is checked once
      done.add(key);
      await checker.check(l);
    }
  }
  checkExpected(all, baseURL!, rep, ["nav", "footer"]);
  rep.write();
  expect(rep.problems, rep.problems.join("\n")).toEqual([]);
});
