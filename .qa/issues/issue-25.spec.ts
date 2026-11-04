import { test, expect } from "@playwright/test";

test("care programmes page has one h1, review marker and breadcrumb", async ({ page }) => {
  await page.goto("/care-programmes");
  await expect(page.getByRole("heading", { level: 1, name: "Care Programmes" })).toHaveCount(1);
  await expect(page.locator("[data-clinical-review]")).toHaveAttribute(
    "data-clinical-items",
    "P1–P12, X1–X2",
  );
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }).getByText("Care Programmes"),
  ).toHaveAttribute("aria-current", "page");
});

test("four programme cards are listed", async ({ page }) => {
  await page.goto("/care-programmes");
  for (const name of ["Foundation", "Preserve", "Continuum", "Signature"]) {
    await expect(page.getByRole("heading", { level: 3, name: `Monarch ${name}` })).toBeVisible();
    await expect(page.getByText(`About ${name}`)).toBeVisible();
  }
});

test("comparison table has row headers and text labels", async ({ page }) => {
  await page.goto("/care-programmes");
  const table = page.getByRole("table", { name: "How the four Monarch care programmes compare" });
  await expect(table.getByRole("rowheader", { name: "Care in your home" })).toBeVisible();
  await expect(table.getByText("Not included").first()).toBeVisible();
  await expect(table.getByText("Included", { exact: true }).first()).toBeVisible();
});

test("no horizontal page scroll", async ({ page }) => {
  await page.goto("/care-programmes");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("home and our approach carry review markers", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-clinical-items='H1–H10']")).toHaveCount(1);
  await page.goto("/our-approach");
  await expect(page.locator("[data-clinical-items='A1–A10']")).toHaveCount(1);
});
