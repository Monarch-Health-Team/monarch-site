import { test, expect } from "@playwright/test";

for (const vp of [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  test(`no horizontal scroll at ${vp.width}px`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("below xl only the top bar stays pinned", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const cta = page.getByRole("banner").getByRole("link", { name: "Arrange a Conversation" });
  const menu = page.getByRole("button", { name: "Menu" });
  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect(menu).toBeInViewport();
  await expect(cta).not.toBeInViewport();
  const box = await menu.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
});

test("at 1440 both header rows stay pinned", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 1500));
  await expect(page.getByRole("link", { name: "Sign in" }).first()).toBeInViewport();
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Arrange a Conversation" }),
  ).toBeInViewport();
});

test("a focused footer link is not covered by the header", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("contentinfo").getByRole("link").first();
  await link.focus();
  const covered = await link.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!top && !el.contains(top) && !!top.closest("header");
  });
  expect(covered).toBe(false);
});
