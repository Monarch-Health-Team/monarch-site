# Monarch Health — website

Physician-led preventative healthcare in Greater Victoria. Iteration 2, built
around the five memberships.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4.

## Running it

```bash
pnpm install
pnpm dev
```

## Before you commit

```bash
pnpm check
```

Runs the content compliance lint, the contrast audit, the instrument scoring
tests, a typecheck and a production build. **The content lint is a regulatory
gate, not a style check** — see below.

## What is unusual about this codebase

**Copy is regulated.** Every public string has to satisfy the CPSBC
_Advertising and Communication with the Public_ standard and BC's _Medicare
Protection Act_. That has three consequences you will run into:

1. **All public copy lives in `content/`**, never inline in a component. This is
   what makes the compliance lint possible.
2. **Disclosures come from `lib/compliance.ts` verbatim.** Do not paraphrase,
   shorten or reword a notice — the exact wording is what a regulator reads, and
   `tests/p0.mjs` asserts exact-string presence.
3. **`pnpm lint:content` fails the build** on superlatives, guarantees,
   inducements, self-applied specialist titles, internal framework vocabulary,
   and the gated scoring language. If you hit a genuine false positive, append
   `lint-content-ok` to the line with a comment explaining why. Do not weaken a
   rule to make it pass.

**No membership may be visually preferred.** No "most popular" badge, no
featured column, no dominant styling on one tier. This is CPSBC §2.12, not a
design opinion, and `TC-4.3` enforces it.

**The design system is the brand book, and it is enforced.** Colour, type,
spacing, radii and motion all come from the Monarch Health Brand & Design
System v1.0, implemented in `app/globals.css`. The governing rule is *navy
owns structure, orange owns interaction — if it can be clicked it is orange*.
`pnpm test:brand` checks that on every page, along with the retirement of
`#FF4F00`. See [`docs/BRAND-IMPLEMENTATION.md`](docs/BRAND-IMPLEMENTATION.md)
for the three places we deviate from the book, and why.

**Pricing is placeholder.** Every figure renders behind a non-dismissible
pending-confirmation banner until the fees are confirmed. See
[`docs/BUILD-REPORT.md`](docs/BUILD-REPORT.md) for the full list of what is
still pending.

**The site handles no health information.** The contact form deliberately does
not ask for it, and the assessment tools compute entirely in the browser —
nothing is stored, nothing is transmitted.

## Layout

```
app/              routes
components/
  compliance/     disclosure + pending-banner rendering
  primitives/     design system building blocks
  sections/       page-specific composition
  site/           header, footer, logo, text-size control
content/          all public copy, typed
  memberships.ts  the five memberships — the product
  programs.ts     twelve clinical programs
  care.ts         Ageing in Place, Home Care
  resources.ts    seven screening instruments
  journal/        MDX articles
lib/
  compliance.ts   canonical disclosure strings — edit with care
scripts/
  lint-content.ts the compliance gate
tests/            see tests/README.md
docs/             requirements, test scenarios, build report
```

## Documentation

- [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) — the approved requirements
- [`docs/TEST-SCENARIOS.md`](docs/TEST-SCENARIOS.md) — 82 scenarios, traced to requirements
- [`docs/BUILD-REPORT.md`](docs/BUILD-REPORT.md) — what was built, what passed, what is outstanding
- [`docs/BRAND-IMPLEMENTATION.md`](docs/BRAND-IMPLEMENTATION.md) — how the brand system is implemented, and where it is deviated from
- [`tests/README.md`](tests/README.md) — how to run the suites
