// Full-page screenshots of every crawled route at each width (default 375 and 1280), saved to
// qa-artifacts/e2e/screenshots/<width>/<route>.png inside the normal QA artifact.
// Also fails on uncaught page errors and console errors (see failOnConsoleError / ignoreConsole),
// and warns on sideways scrolling at mobile widths. These PNGs are what Argos compares against main.
import { test, expect } from "@playwright/test";
import path from "node:path";
import { loadConfig, matchesAny, okRoutes, OUT, Report, settle, slug } from "./lib";

for (const width of loadConfig().widths) {
  test(`full-page screenshots @${width}`, async ({ page }) => {
    const cfg = loadConfig();
    const rep = new Report(`screens-${width}`);
    const errors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message.split("\n")[0]));
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const t = m.text().split("\n")[0].slice(0, 200);
      if (!matchesAny(t, cfg.ignoreConsole)) consoleErrors.push(t);
    });
    await page.setViewportSize({ width, height: width < 768 ? 812 : 900 });
    const list = okRoutes();
    if (list.length > cfg.screenshotMaxRoutes) rep.warn(`${list.length} routes found; screenshots limited to the first ${cfg.screenshotMaxRoutes}.`);
    for (const r of list.slice(0, cfg.screenshotMaxRoutes)) {
      errors.length = 0;
      consoleErrors.length = 0;
      await page.goto(r.path, { waitUntil: "load" });
      await settle(page);
      await page.screenshot({ path: path.join(OUT, "screenshots", String(width), `${slug(r.path)}.png`), fullPage: true, animations: "disabled" });
      if (width < 768) {
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (over > 1) rep.warn(`${r.path} scrolls sideways by ${over}px at ${width}px wide.`);
      }
      for (const e of errors) (cfg.failOnPageError ? rep.fail : rep.warn).call(rep, `${r.path} threw an uncaught error at ${width}px: ${e}`);
      for (const e of [...new Set(consoleErrors)]) (cfg.failOnConsoleError ? rep.fail : rep.warn).call(rep, `${r.path} logged a console error at ${width}px: ${e}`);
    }
    rep.write();
    expect(rep.problems, rep.problems.join("\n")).toEqual([]);
  });
}
