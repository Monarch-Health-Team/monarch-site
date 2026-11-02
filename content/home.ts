/**
 * Homepage copy that is not inline in app/page.tsx.
 *
 * The hero's free account button (restored 24 Oct 2026). Its label is the
 * original one from git history: "Free Account" (commit 5898491, 18 Sep
 * 2026, "hero CTAs"), which the free tier's tests (free-account.mjs C1,
 * free-tier-ui.mjs c.62) and the launch fallbacks doc (A4) still name. It
 * was renamed "Sign Up" on 7 Oct (972b1d5) and replaced by "Explore Your
 * Care Pathway" on 10 Oct (309afbc). Rendered only while the free tier is
 * on (lib/free-tier.ts).
 *
 * Hero Option A (25 Oct 2026): the button became a text link, "New here?
 * Create a free account", copy by JJ and Mia. Only the label is the link;
 * the lead-in is plain text.
 */
export const HERO_FREE_ACCOUNT_LEAD = "New here?";
export const HERO_FREE_ACCOUNT_LABEL = "Create a free account";
