# Team rules for coding agents

- Never push to or target `main`. Work only on your own branch and open a draft pull request.
- Stack: Next.js + Tailwind, mobile-first, WCAG 2.2 AA.
- Design specs come from Google Stitch HTML/Tailwind exports linked in the issue.
- Keep changes scoped to the issue. Do not add new dependencies without saying why in the PR.
- Never commit secrets, API keys, or client personal data.
- Run `npm run build` (and lint if configured) before finishing and report the result in the PR.

## When you run inside the `claude-build` GitHub workflow

You are started from an issue (`claude-build` label or `/claude build`) or a
`/claude fix ...` comment on a `cc/*` pull request. A separate, non-AI step
commits, pushes and opens the PR, so:

- Only edit files. You cannot run git, gh, or install packages, and edits to
  `.github/` or `pnpm-lock.yaml` are discarded. If the task truly needs a new
  dependency, make no change for it and say so in your summary instead.
- Commands you can run: `pnpm lint`, `pnpm typecheck`, `pnpm build`.
  Run lint and build before you finish.
- Keep the diff as small as the issue allows. Reuse what is in
  `components/primitives`, `components/site`, `content/` and `lib/`; page copy
  lives in `content/*.ts`.
- QA runs after you finish (`QA.md`): lint, build, Playwright + axe on every
  path in `tests/pages.ts` (mobile 390x844 and desktop 1440x900, no console
  errors, no serious/critical axe violations), and Lighthouse on `/`, median
  of 3 runs: performance >= 85, accessibility >= 95, best-practices >= 90,
  SEO >= 90. If QA fails you get the output back, at most twice.
- Protect performance (keep it >= 85). The home hero is server-rendered and
  static on purpose. Do not add client-side animation libraries, new web fonts,
  large images without `next/image`, or turn static sections into client
  components (`"use client"`) unless the issue requires it. A past change that
  turned a static block into an interactive flip card dropped the score to 74.
- If you add a page, add its path to `tests/pages.ts`.
- If the request is unclear, make no changes and explain what is missing.
- End with a 3-6 line plain-English summary of what you changed.
