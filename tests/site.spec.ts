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

test.describe("shared chrome (v4)", () => {
  const texts = async (loc: import("@playwright/test").Locator) =>
    (await loc.allInnerTexts()).map((t) => t.trim());

  test("desktop nav labels and order", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop only");
    await open(page, "/");
    await expect(page.getByRole("navigation", { name: "Secondary", exact: true })).toHaveCount(0);
    const primary = page.getByRole("navigation", { name: "Primary", exact: true });
    expect(await texts(primary.locator("a, button"))).toEqual([
      "Our Approach",
      "Care Programmes",
      "For Families",
      "Resources",
      "About",
    ]);
    const banner = page.getByRole("banner");
    await expect(banner.getByRole("link", { name: "Sign in", exact: true })).toHaveCount(1);
    await expect(banner.getByRole("link", { name: "Arrange a Conversation" })).toHaveCount(1);
    await expect(banner.getByRole("link", { name: "Arrange a Conversation" })).toBeVisible();
    for (const name of ["Our Team", "The 12 Health Categories", "Contact"]) {
      await expect(banner.getByRole("link", { name, exact: true })).toHaveCount(0);
    }
    await expect(
      page.getByRole("link", { name: "Monarch Health – Continuous care for life" }).first(),
    ).toBeVisible();
  });

  test("Care Programmes panel shows 5 items, arrows move, Esc closes", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop only");
    await open(page, "/");
    const trigger = page.getByRole("button", { name: "Care Programmes" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = page.getByRole("list", { name: "Care Programmes menu" });
    expect(await texts(panel.getByRole("link"))).toEqual([
      "Foundation",
      "Preserve",
      "Continuum",
      "Signature",
      "Compare all programmes",
    ]);
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(panel.getByRole("link", { name: "Foundation" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(panel.getByRole("link", { name: "Preserve" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("About menu lists About Monarch and Contact, arrows move, Esc closes and returns focus", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop only");
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, "/");
    const trigger = page.getByRole("button", { name: "About", exact: true });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = page.getByRole("list", { name: "About menu" });
    expect(await texts(panel.getByRole("link"))).toEqual(["About Monarch", "Contact"]);
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    await expect(panel.getByRole("link", { name: "About Monarch" })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(panel.getByRole("link", { name: "Contact" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  for (const vp of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    test(`aria-current marks the logo on / at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await open(page, "/");
      await expect(
        page
          .getByRole("banner")
          .getByRole("link", { name: "Monarch Health – Continuous care for life" })
          .first(),
      ).toHaveAttribute("aria-current", "page");
    });
  }

  test("below 1280px the menu opens, closes, returns focus and obeys Esc", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "mobile only");
    await open(page, "/");
    const menu = page.getByRole("button", { name: "Menu" });
    await menu.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const items = (await texts(dialog.locator("a, button"))).filter(
      (t) => t && t !== "Close",
    );
    expect(items).toEqual([
      "Arrange a Conversation",
      "Call (250) 818-4425",
      "Our Approach",
      "Care Programmes",
      "For Families",
      "Resources",
      "About",
      "Contact",
      "Sign in",
    ]);
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(menu).toBeFocused();
    await menu.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(menu).toBeFocused();
  });

  for (const width of [320, 360]) {
    test(`at ${width}px the bar has only the logo and Menu; Call is in the sheet; no horizontal scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await open(page, "/");
      const banner = page.getByRole("banner");
      await expect(banner.getByRole("button", { name: "Menu" })).toBeVisible();
      await expect(banner.getByRole("link", { name: /^Call/ })).toHaveCount(0);
      await expect(banner.getByRole("link", { name: "Sign in" })).toBeHidden();
      await expect(banner.getByRole("link", { name: "Arrange a Conversation" })).toBeHidden();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
      await banner.getByRole("button", { name: "Menu" }).click();
      await expect(
        page.getByRole("dialog").getByRole("link", { name: "Call (250) 818-4425" }),
      ).toBeVisible();
    });
  }

  for (const vp of [
    { width: 320, height: 640 },
    { width: 1279, height: 800 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    test(`sticky header matches --header-h and never covers focus at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await open(page, "/");
      await page.evaluate(() => window.scrollTo(0, 1500));
      const { h, token } = await page.evaluate(() => {
        const header = document.querySelector("header")!;
        const probe = document.createElement("div");
        probe.style.height = "var(--header-h)";
        document.body.appendChild(probe);
        const token = probe.getBoundingClientRect().height;
        probe.remove();
        return { h: header.getBoundingClientRect().height, token };
      });
      expect(Math.abs(h - token)).toBeLessThanOrEqual(2);

      const link = page.locator("footer a:visible").first();
      await link.focus();
      const box = await link.boundingBox();
      const bottom = await page.evaluate(() => {
        const bar = document.querySelector("header")!;
        const els = [...bar.querySelectorAll<HTMLElement>("*")];
        return Math.max(
          0,
          ...els
            .filter((e) => getComputedStyle(e).position === "sticky" || e === bar)
            .map((e) => e.getBoundingClientRect().bottom),
        );
      });
      expect(box!.y).toBeGreaterThanOrEqual(bottom - 1);
    });
  }

  test("footer columns match the lists", async ({ page }) => {
    await open(page, "/");
    const col = (name: string) => page.getByRole("navigation", { name, exact: true });
    expect(await texts(col("EXPLORE").getByRole("link"))).toEqual([
      "Home",
      "Our Approach",
      "The 12 Health Categories",
      "Our Team",
      "For Families",
      "Resources",
      "About Monarch",
      "Contact",
    ]);
    expect(await texts(col("CARE PROGRAMMES").getByRole("link"))).toEqual([
      "Foundation",
      "Preserve",
      "Continuum",
      "Signature",
      "Compare all programmes",
    ]);
    expect(await texts(col("POLICIES & INFORMATION").getByRole("link"))).toEqual([
      "Privacy Policy",
      "Terms of Service",
      "Membership Agreement",
      "MSP and Physician Services",
      "Accessibility",
      "Careers",
      "Contact",
    ]);
  });
});
