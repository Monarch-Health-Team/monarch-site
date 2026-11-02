import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PAGES } from "./pages";

const slug = (p: string) => (p === "/" ? "home" : p.replace(/^\/|\/$/g, "").replace(/\//g, "-"));

async function open(page: Page, path: string) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  const res = await page.goto(path, { waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  return { res, errors };
}

for (const path of PAGES) {
  test.describe(path, () => {
    test("loads with HTTP 200 and no console errors", async ({ page }) => {
      const { res, errors } = await open(page, path);
      expect(res?.status()).toBe(200);
      expect(errors).toEqual([]);
    });

    test("internal links resolve", async ({ page, request }) => {
      await open(page, path);
      const hrefs = await page.$$eval("a[href]", (as) =>
        as.map((a) => (a as HTMLAnchorElement).getAttribute("href") || ""),
      );
      const origin = new URL(page.url()).origin;
      const targets = new Set<string>();
      const anchors = new Set<string>();
      for (const h of hrefs) {
        if (!h || /^(mailto:|tel:|javascript:)/i.test(h)) continue;
        const url = new URL(h, page.url());
        if (url.origin !== origin) continue;
        if (url.hash && url.pathname === new URL(page.url()).pathname) {
          anchors.add(url.hash.slice(1));
        } else {
          targets.add(url.pathname + url.search);
        }
      }
      const broken: string[] = [];
      for (const t of targets) {
        const r = await request.get(t);
        if (r.status() >= 400) broken.push(`${t} -> ${r.status()}`);
      }
      for (const id of anchors) {
        if (id && (await page.locator(`[id="${id}"], [name="${id}"]`).count()) === 0) {
          broken.push(`#${id} -> no matching element`);
        }
      }
      expect(broken).toEqual([]);
    });

    test("nav renders and forms validate required fields", async ({ page }) => {
      await open(page, path);
      await expect(page.locator("header nav, nav").first()).toBeAttached();
      await expect(page.locator("header").first()).toBeVisible();

      // Never reach a real backend: abort anything that is not a GET.
      await page.route("**/*", (route) =>
        route.request().method() === "GET" || route.request().method() === "HEAD"
          ? route.continue()
          : route.abort(),
      );
      const forms = page.locator("form");
      for (let i = 0; i < (await forms.count()); i++) {
        const form = forms.nth(i);
        const required = form.locator(":is(input,select,textarea)[required]");
        if ((await required.count()) === 0) continue;
        const valid = await form.evaluate((f) => (f as HTMLFormElement).checkValidity());
        expect(valid, "empty required fields must make the form invalid").toBe(false);
      }
    });

    test("full-page screenshot", async ({ page }, info) => {
      // Reduced motion, and any finite animation allowed to finish, so the
      // screenshot never catches a word or a section mid-transition.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await open(page, path);
      await page.evaluate(() =>
        Promise.all(
          document
            .getAnimations()
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .map((a) => a.finished.catch(() => undefined)),
        ),
      );
      await page.screenshot({
        path: `qa-artifacts/screenshots/${slug(path)}-${info.project.name}.png`,
        fullPage: true,
      });
    });

    test("axe: no serious or critical WCAG 2.2 AA violations", async ({ page }) => {
      // Reduced motion settles entrance animations so contrast is measured on final colours.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await open(page, path);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const blocking = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(
        blocking.map((v) => `${v.impact}: ${v.id} (${v.nodes.length} nodes) ${v.helpUrl}`),
      ).toEqual([]);
    });
  });
}
