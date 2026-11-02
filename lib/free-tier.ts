/**
 * The free tier hide switch (technical design section 8).
 *
 * NEXT_PUBLIC_FREE_TIER empty, unset or "on" shows the free tier, which is
 * the default (c.136); "off" hides it everywhere. The value is fixed at
 * build time, so changing it on Vercel needs a redeploy.
 *
 * Read only here. Everything else imports FREE_TIER_ON.
 */
export const FREE_TIER_ON = process.env.NEXT_PUBLIC_FREE_TIER !== "off";
