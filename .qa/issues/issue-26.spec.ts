import { test, expect } from "@playwright/test";

const CASES = [
  { slug: "foundation", name: "Monarch Foundation", short: "Foundation", items: "F1–F6, X1–X2", talk: "Is Foundation right for you?" },
  { slug: "preserve", name: "Monarch Preserve", short: "Preserve", items: "R1–R7, X1–X2", talk: "Is Preserve right for you?" },
];

for (const c of CASES) {
  test(`${c.slug}: heading, markers, breadcrumb and switcher`, async ({ page }) => {
    await page.goto(`/care-programmes/${c.slug}`);
    await expect(page.getByRole("heading", { level: 1, name: c.name })).toHaveCount(1);
    await expect(page.locator("[data-clinical-review]")).toHaveAttribute("data-clinical-items", c.items);
    const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(crumbs.getByRole("link", { name: "Care Programmes" })).toBeVisible();
    await expect(crumbs.getByText(c.short)).toHaveAttribute("aria-current", "page");
    await expect(
      page.getByRole("navigation", { name: "Programmes" }).getByRole("link", { name: c.short }),
    ).toHaveAttribute("aria-current", "page");
  });

  test(`${c.slug}: sections present`, async ({ page }) => {
    await page.goto(`/care-programmes/${c.slug}`);
    await expect(page.getByRole("heading", { level: 2, name: `What ${c.short} includes` })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "What we check, and how often" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Between your assessments" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Good to know before you start" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: c.talk })).toBeVisible();
    await expect(page.getByRole("link", { name: "Compare all programmes" })).toBeVisible();
  });

  test(`${c.slug}: no horizontal scroll`, async ({ page }) => {
    await page.goto(`/care-programmes/${c.slug}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("unknown programme slug is a 404", async ({ page }) => {
  const res = await page.goto("/care-programmes/not-a-programme");
  expect(res?.status()).toBe(404);
});
