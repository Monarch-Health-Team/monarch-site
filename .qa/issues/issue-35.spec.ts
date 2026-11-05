import { test, expect } from "@playwright/test";

const SHEET = [
  "Arrange a Conversation",
  "Call (250) 818-4425",
  "Our Approach",
  "Care Programmes",
  "For Families",
  "Resources",
  "About",
  "Contact",
  "Sign in",
];

for (const width of [1280, 1366, 1440]) {
  test(`one line, no overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const bar = page.getByRole("banner");
    const items = [
      bar.getByRole("link", { name: /Monarch Health/ }).first(),
      bar.getByRole("link", { name: "Our Approach", exact: true }),
      bar.getByRole("button", { name: "Care Programmes" }),
      bar.getByRole("link", { name: "For Families", exact: true }),
      bar.getByRole("link", { name: "Resources", exact: true }),
      bar.getByRole("button", { name: "About", exact: true }),
      bar.getByRole("link", { name: "Sign in", exact: true }),
      bar.getByRole("link", { name: "Arrange a Conversation" }),
    ];
    const tops: number[] = [];
    for (const item of items) {
      await expect(item).toBeVisible();
      tops.push((await item.boundingBox())!.y);
    }
    // Items differ in height, so compare their vertical centres.
    const centres: number[] = [];
    for (const item of items) {
      const b = (await item.boundingBox())!;
      centres.push(b.y + b.height / 2);
    }
    expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(2);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    const cta = (await items[7].boundingBox())!;
    expect(cta.x + cta.width).toBeLessThanOrEqual(width - 24);
  });
}

for (const width of [1279, 1024, 390]) {
  test(`phone menu below 1280 at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    const bar = page.getByRole("banner");
    const menu = bar.getByRole("button", { name: "Menu" });
    await expect(menu).toBeVisible();
    for (const name of ["Our Approach", "For Families", "Resources", "Sign in", "Arrange a Conversation"]) {
      await expect(bar.getByRole("link", { name })).toBeHidden();
    }
    await expect(bar.getByRole("button", { name: "Care Programmes" })).toBeHidden();
    await expect(bar.getByRole("button", { name: "About", exact: true })).toBeHidden();
    await menu.click();
    const dialog = page.getByRole("dialog");
    const items = (await dialog.locator("a, button").allInnerTexts())
      .map((t) => t.trim())
      .filter((t) => t && t !== "Close");
    expect(items).toEqual(SHEET);
  });
}

test("About dropdown works from the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const about = page.getByRole("banner").getByRole("button", { name: "About", exact: true });
  await about.focus();
  await page.keyboard.press("Enter");
  await expect(about).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("list", { name: "About menu" });
  await expect(menu.getByRole("link", { name: "About Monarch" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(menu.getByRole("link", { name: "Contact" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(about).toHaveAttribute("aria-expanded", "false");
  await expect(about).toBeFocused();

  await page.goto("/contact");
  await expect(
    page.getByRole("banner").getByRole("button", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "true");
});

test("Our Team and The 12 Health Categories are not in the header or sheet", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const banner = page.getByRole("banner");
  for (const name of ["Our Team", "The 12 Health Categories"]) {
    await expect(banner.getByRole("link", { name, exact: true })).toHaveCount(0);
  }
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Our Team", exact: true })).toHaveCount(1);
  await expect(
    footer.getByRole("link", { name: "The 12 Health Categories", exact: true }),
  ).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await banner.getByRole("button", { name: "Menu" }).click();
  const dialog = page.getByRole("dialog");
  for (const name of ["Our Team", "The 12 Health Categories"]) {
    await expect(dialog.getByRole("link", { name, exact: true })).toHaveCount(0);
  }
});

for (const width of [320, 1024, 1280, 1440]) {
  test(`banner height equals --header-h at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const { h, token } = await page.evaluate(() => {
      const probe = document.createElement("div");
      probe.style.height = "var(--header-h)";
      document.body.appendChild(probe);
      const token = probe.getBoundingClientRect().height;
      probe.remove();
      return { h: document.querySelector("header")!.getBoundingClientRect().height, token };
    });
    expect(Math.abs(h - token)).toBeLessThanOrEqual(2);
  });
}
