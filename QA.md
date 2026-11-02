# QA

Automated checks run on every pull request and on manual dispatch (`.github/workflows/qa.yml`).

## What runs

1. Lint (`pnpm lint`) and build (`pnpm build`). Lint is non-blocking for now because of existing errors.
2. Playwright (Chromium) at mobile 390x844 and desktop 1440x900, for every page in `tests/pages.ts`:
   HTTP 200 and no console errors; internal links resolve; nav renders and any form's required
   fields validate (non-GET requests are aborted, nothing is submitted); full-page screenshots.
3. axe (`@axe-core/playwright`), WCAG 2.2 AA: fails on serious or critical violations.
4. Lighthouse CI (`lighthouserc.json`): performance >= 85, accessibility >= 95,
   best-practices >= 90, SEO >= 90. The `is-crawlable` audit is skipped because the site is noindex on purpose.

Artifacts (`qa-artifacts`): Playwright HTML report, screenshots, Lighthouse results.

## Run locally

```bash
pnpm install
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e            # starts `next start` on :3100 itself
pnpm test:lighthouse     # starts `next start` on :3200 itself
pnpm exec playwright show-report qa-artifacts/playwright-report
```

When a page is added to the site, add its path to `tests/pages.ts`
(and to `lighthouserc.json` `collect.url` if it is a main page).

The repo is locked with pnpm, so the workflow uses `pnpm install --frozen-lockfile` in place of `npm ci`.
