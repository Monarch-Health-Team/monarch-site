/**
 * The soft-launch switch (soft-launch-switch, technical design section 2).
 *
 * NEXT_PUBLIC_SOFT_LAUNCH: exactly "on" turns the deployment into a preview
 * on whatever address it has: every page noindex, nofollow; robots.txt
 * disallowing everything whatever VERCEL_ENV says; a one-line preview
 * banner above the header on every page. Unset, empty, "off" or any other
 * value is the reviewed site as it is; a typo fails towards normal, never
 * towards the preview. Fixed at build time (a change on Vercel needs a
 * redeploy).
 *
 * Independent of NEXT_PUBLIC_FREE_TIER, NEXT_PUBLIC_COUNSEL and VERCEL_ENV.
 * It changes nothing else: no wording, no redirect, no sitemap, no canonical.
 *
 * Read only here. Everything else imports SOFT_LAUNCH_ON.
 */
export const SOFT_LAUNCH_ON = process.env.NEXT_PUBLIC_SOFT_LAUNCH === "on";

/** PENDING Jeffrey (t91): the banner wording. One paragraph, hyphens only, no link. */
export const PREVIEW_BANNER_TEXT =
  "Preview of the new Monarch Health website. Some details are still being confirmed.";
