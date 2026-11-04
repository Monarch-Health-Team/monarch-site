import { test, expect } from "@playwright/test";

const LOGO_NAME = "Monarch Health – Continuous care for life";

test("tagline is Continuous care for life in the title, header and footer", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/^Monarch Health - Continuous care for life/);
  await expect(page.getByRole("banner").getByRole("link", { name: LOGO_NAME }).first()).toBeAttached();
  await expect(page.getByRole("contentinfo").getByRole("link", { name: LOGO_NAME })).toBeVisible();
  await expect(page.getByText(/Professional Healthspan/)).toHaveCount(0);
});

test("desktop header: one row with the right links and one CTA", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header.getByRole("link", { name: /^Call/ })).toHaveCount(0);
  for (const name of ["Our Approach", "For Families", "Resources", "Sign in"]) {
    await expect(header.getByRole("link", { name, exact: true })).toBeVisible();
  }
  for (const name of ["Care Programmes", "About"]) {
    await expect(header.getByRole("button", { name, exact: true })).toBeVisible();
  }
  for (const name of ["Our Team", "The 12 Health Categories"]) {
    await expect(header.getByRole("link", { name, exact: true })).toHaveCount(0);
  }
  await expect(header.getByRole("link", { name: "Arrange a Conversation" })).toHaveCount(1);
  await expect(header.getByRole("link", { name: LOGO_NAME }).first()).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(header.getByRole("link", { name: "Search the website" })).toHaveCount(0);
});

test("Care Programmes panel lists names only and closes on Escape", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop only");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Care Programmes" });
  await trigger.click();
  const panel = page.getByRole("list", { name: "Care Programmes menu" });
  await expect(panel.getByRole("link")).toHaveText([
    "Foundation",
    "Preserve",
    "Continuum",
    "Signature",
    "Compare all programmes",
  ]);
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
});

test("mobile menu opens, lists the pages, and returns focus on close", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile only");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("link", { name: "Arrange a Conversation" })).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Call (250) 818-4425" })).toBeVisible();
  const items = (await dialog.locator("a, button").allInnerTexts())
    .map((t) => t.trim())
    .filter((t) => t && t !== "Close" && !t.startsWith("Arrange") && !t.startsWith("Call"));
  expect(items).toEqual([
    "Our Approach",
    "Care Programmes",
    "For Families",
    "Resources",
    "About",
    "Contact",
    "Sign in",
  ]);
  await dialog.getByRole("button", { name: "Care Programmes" }).click();
  await expect(dialog.getByRole("link", { name: "Compare all programmes" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(menu).toBeFocused();
});

test("footer has the three new columns and no horizontal scroll", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  for (const heading of ["EXPLORE", "CARE PROGRAMMES", "POLICIES & INFORMATION"]) {
    await expect(footer.getByRole("heading", { name: heading })).toBeVisible();
  }
  for (const name of ["Membership Agreement", "MSP and Physician Services", "Careers"]) {
    await expect(footer.getByRole("link", { name })).toBeVisible();
  }
  await expect(footer.getByRole("heading", { name: "Research" })).toHaveCount(0);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
