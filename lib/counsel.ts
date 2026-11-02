/**
 * The legal-counsel switch (sundren-review-round1, technical design 2.1).
 *
 * NEXT_PUBLIC_COUNSEL: three values, fixed at build time (a change on
 * Vercel needs a redeploy).
 *   unset / "off"  today's wording everywhere. The default until counsel
 *                  signs (t82).
 *   "review"       the wording counsel is reviewing (D41 fee block, D48
 *                  memberships section, D26.3 FAQ entry), with the
 *                  "pending legal counsel" chip on /memberships. For the
 *                  preview deployment counsel reads.
 *   "on"           the same wording, no chip. Set once counsel has signed.
 *
 * Read only here. Everything else imports the two booleans.
 */
const state = process.env.NEXT_PUBLIC_COUNSEL;
export const COUNSEL_WORDING = state === "review" || state === "on";
export const COUNSEL_CHIP = state === "review";
