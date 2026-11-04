/**
 * Site-wide page switches (25 Oct 2026, Jeffrey: hide before the 8 PM launch).
 *
 * Code-level on purpose: these do not read .env, so they behave the same on
 * every deployment. Set a switch back to `true` to restore the page, every
 * link to it (header menu, mobile menu, home page, About page, breadcrumbs)
 * and its sitemap entry. Nothing was deleted while they were off.
 *
 * SHOW_TEAM_PAGE        /about/our-team
 * SHOW_COMMUNITIES_PAGE /community, the hub page only. The ten forums,
 *                       their new and thread pages, the guidelines, the
 *                       moderation page and /api/community/* stay up; only
 *                       the links to the hub (header tab, home page box,
 *                       the hub crumb on the sub-pages) go.
 *
 * While off, each route answers 404 (notFound()) and carries
 * robots noindex as a backstop.
 */
export const SHOW_TEAM_PAGE = false;
export const SHOW_COMMUNITIES_PAGE = false;

/**
 * SHOW_FRAILTY_SECTION: the "Your frailty assessment" section on
 * /our-approach. PENDING the lead doctor's clinical sign-off, so it must not
 * reach production until JJ confirms. Set SHOW_FRAILTY_SECTION=on (or off) in
 * the environment to force it either way; unset, it is off in production and
 * in local builds, and on in Vercel preview deployments.
 */
const FRAILTY_ENV = process.env.SHOW_FRAILTY_SECTION;
export const SHOW_FRAILTY_SECTION =
  FRAILTY_ENV === "on"
    ? true
    : FRAILTY_ENV === "off"
      ? false
      : process.env.VERCEL_ENV === "preview";
