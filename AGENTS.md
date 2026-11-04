# Review guidelines for Codex (monarch-site)

Monarch Health marketing site: Next.js + Tailwind, pnpm, on Vercel. Build rules for coding
agents are in `CLAUDE.md`; QA checks are in `QA.md`. Page copy lives in `content/*.ts`, and
new pages must be added to `tests/pages.ts`.

## How to review

- Review the PR against its linked issue. Flag anything the issue asked for that is missing,
  and any change outside the issue's scope.
- Flag only real problems: bugs, broken behaviour, accessibility failures, performance risks,
  security issues, or clear breaks of the rules below. Skip style nitpicks and personal preferences.
- Mark each finding P1 (must fix before merge) or P2 (should fix). Say what to change and where.
- If there is nothing serious, say so briefly.

## What to check

- **Accessibility:** WCAG 2.2 AA. Visible keyboard focus that is not hidden by a sticky header,
  labels on form fields, alt text on meaningful images, colour contrast, one h1 per page,
  correct heading order.
- **Mobile first:** layouts must work at 320, 375 and 390 px wide and at 1440 px desktop.
  No sideways scrolling; tap targets at least 24 px.
- **Performance:** Lighthouse performance must stay at 85 or higher. Flag new client
  components (`"use client"`) on static sections, animation libraries, new web fonts,
  and large images not using `next/image`.
- **Design system:** reuse existing components, Tailwind tokens (no hard-coded colours or
  spacing), shadcn and Lucide icons where the repo uses them.
- **Dependencies:** new packages need a reason in the PR description.
- **Security and privacy:** no secrets, API keys or personal data in code, logs or commits.
- **SEO basics:** each page has a title and meta description; links are not broken.
