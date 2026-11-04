import { test, expect } from "@playwright/test";

test("Our Approach page has its title, h1 and the main sections", async ({ page }) => {
  await page.goto("/our-approach");
  await expect(page).toHaveTitle(/^Our Approach · Monarch Health/);
  await expect(page.getByRole("heading", { level: 1, name: "Our Approach" })).toBeVisible();
  for (const name of [
    "It starts with what matters to you",
    "How our care works",
    "Support at home with Continuum",
    "Your family is part of the team",
    "Four programmes, one approach",
    "Good to know before you start",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(page.getByText("call 911 right away")).toBeVisible();
});

test("frailty section follows the flag and shows no scale numbers", async ({ page }) => {
  await page.goto("/our-approach");
  const heading = page.getByRole("heading", { name: "Your frailty assessment" });
  const scale = page.getByText(/Clinical Frailty Scale/);
  if (await heading.count()) {
    await expect(heading).toBeVisible();
    await expect(scale).toBeVisible();
    await expect(page.getByText(/\bCFS\b|level [1-9]\b/i)).toHaveCount(0);
  } else {
    await expect(scale).toHaveCount(0);
  }
});

test("pages have no horizontal scroll and unique photos", async ({ page }) => {
  for (const path of ["/", "/our-approach"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const alts = await page
      .locator("main img[alt]:not([alt=''])")
      .evaluateAll((imgs) => imgs.map((i) => i.getAttribute("alt")));
    expect(new Set(alts).size).toBe(alts.length);
  }
});

test("home: four programmes in order, no ranking, old names gone", async ({ page }) => {
  await page.goto("/");
  const main = page.getByRole("main");
  const names = main.locator("h3", {
    hasText: /^Monarch (Foundation|Preserve|Continuum|Signature)$/,
  });
  await expect(names).toHaveText([
    "Monarch Foundation",
    "Monarch Preserve",
    "Monarch Continuum",
    "Monarch Signature",
  ]);
  await expect(main.getByRole("heading", { level: 2, name: "Continuum", exact: true })).toBeVisible();
  await expect(main.getByRole("link", { name: "Learn about Continuum" })).toBeVisible();
  for (const text of [/flagship/i, /most requested/i, /recommended/i, /Executive Wellness/, /Monarch Proactive/, /Ageing in Place/]) {
    await expect(main.getByText(text)).toHaveCount(0);
  }
});

test("home: Talk to Monarch and the other secondary actions are links", async ({ page }) => {
  await page.goto("/");
  const main = page.getByRole("main");
  for (const name of ["Talk to Monarch", "Read Our Method in full", "How Monarch works with MSP"]) {
    await expect(main.getByRole("link", { name })).toBeVisible();
  }
  await expect(page.getByRole("contentinfo")).toContainText(/generated|illustrative|model/i);
});
