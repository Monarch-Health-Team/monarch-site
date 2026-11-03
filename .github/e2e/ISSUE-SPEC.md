# Writing the issue test (for Claude)

During a `claude-build` run you write ONE Playwright test file for the issue's acceptance criteria:

    .qa/issues/issue-<N>.spec.ts        (N = the issue number)

QA runs it after the base checks, twice: `desktop` (1280x900) and `mobile` (375x812, touch). You cannot
run it yourself; QA does, and failures come back to you in the fix round.

Rules
- Import only from `@playwright/test`. No other packages, no imports from the app or from `.github/`.
- Use relative URLs: `await page.goto("/contact")`. The base URL is set for you.
- Prefer `getByRole` / `getByText` / `getByLabel`; avoid CSS classes and fixed waits (`waitForTimeout`).
- Test what the issue asks for, nothing else. 1-6 small tests is normal.
- For something that only applies on one viewport, use
  `test.skip(testInfo.project.name !== "mobile", "mobile only")`.
- Don't compare screenshots (`toHaveScreenshot`); visual diffs are done by Argos on the base screenshots.
- No network calls to other sites, no secrets, no writing files.
- In QA-driven fix rounds this file is locked (your edits are reverted): fix the app, not the test.
  It may only change when the owner's `/claude fix` request changes what the issue asks for.

Example

```ts
import { test, expect } from "@playwright/test";

test("Contact in the nav opens the contact page", async ({ page }, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") await page.getByRole("button", { name: /menu/i }).click();
  await page.getByRole("link", { name: "Contact" }).first().click();
  await expect(page).toHaveURL(/\/contact\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```
