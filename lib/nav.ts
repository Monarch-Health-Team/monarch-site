import { MEMBERSHIPS } from "@/content/memberships";
import { FOCUS_AREAS } from "@/content/healthspan";
import { GENERATED } from "@/components/site/photo";
import { RESEARCH_SECTIONS } from "@/content/research";
import { EVIDENCE_SOURCES } from "@/content/research-sources";
import {
  TOOL_SECTIONS,
  VALIDATED_TOOLS,
  MONARCH_GUIDES,
  OFFICIAL_FORMS,
} from "@/content/resources";
import { RESOURCE_LIBRARY } from "@/content/resource-library";
import { FORUM_TOPICS, COMMUNITY_INTRO } from "@/content/community";
import { SHOW_COMMUNITIES_PAGE, SHOW_TEAM_PAGE } from "@/content/site-flags";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  /** Sets the label in the brand orange rather than navy. */
  accent?: boolean;
  /**
   * What sits inside this entry, named rather than summarised (client,
   * 22 Sep 2026: "just show the subheadings ... in two rows, about four,
   * and then have a More button").
   *
   * Four at most, because they set in a two-by-two block and a fifth
   * makes the panel taller than the photograph beside it. `subMore` is
   * the way to the rest, and is only worth setting when there IS a rest.
   */
  sub?: { label: string; href: string; note?: string }[];
  subMore?: string;
  /**
   * One below the other rather than two by two. For sub-items that carry
   * a second line and a title long enough that two columns would truncate
   * both - which is the events, and so far only the events.
   */
  subStacked?: boolean;
  /** Sets the sub-item's own label in the brand orange. */
  subAccent?: boolean;
  /**
   * One plain line where the sub-items would be, for an entry whose list is
   * empty on purpose (the events, until a real one is agreed). Text, not a
   * link: there is nothing to go to that the entry itself does not go to.
   */
  subEmpty?: string;
};

export type NavSection =
  | {
      label: string;
      href: string;
      children?: never;
      image?: never;
      secondary?: never;
      intro?: never;
      splitHalf?: never;
    }
  | {
      label: string;
      href: string;
      children: NavLink[];
      /** Photograph shown in the dropdown's right quarter. */
      image: NavImage;
      /**
       * A second, denser block beneath the main list: labels only, no
       * descriptions, under a small heading. For a section whose main
       * entries are things we make and whose secondary entries are things
       * we point at — which is Research, and so far only Research.
       */
      secondary?: { label: string; links: NavLink[] };
      /**
       * Two lines above the list, saying what the section is. For a section
       * whose name does not explain itself, which is Online Communities.
       */
      intro?: string;
      /**
       * The photograph takes half the panel and the links stand in two
       * columns on the right (Jeffrey, 21 Oct 2026, About Us).
       */
      splitHalf?: boolean;
    };

export type NavImage = {
  src: string;
  alt: string;
  focal: string;
  /**
   * Optional short, silent, looping film shown in place of the photograph
   * when motion is welcome. The photograph stays underneath as the poster
   * and for anyone with reduced motion set. Portrait, a few seconds, small.
   */
  video?: string;
};

/**
 * Membership order follows the tier ladder, which since 21 Sep 2026 also
 * runs in life-stage order: Foundation, Preserve, Executive, Signature.
 * The two used to disagree — the previous note here warned against
 * sorting by price for exactly that reason — and the memberships were
 * re-staged so they no longer do. The order is MEMBERSHIPS' own, so the
 * dropdown, the hub and the home page cannot drift apart.
 *
 * `accent` marks the ones whose label is set in orange (client request,
 * 21 Sep 2026): these four are products being named, not sections being
 * described.
 */
export const MEMBERSHIP_LINKS: NavLink[] = MEMBERSHIPS.map((m) => ({
  label: m.name,
  href: `/memberships/${m.slug}`,
  description: `${m.stage} · ${m.navPromise}`,
  accent: true,
}));

/**
 * What is inside each of the four tool sections, for the dropdown.
 *
 * Read from the same arrays the pages render, so the menu cannot promise
 * a tool that is not there. Four at most each; where a section holds
 * more, TOOL_SUB_MORE carries the way to the rest.
 */
const TOOL_SUB: Record<string, { label: string; href: string }[]> = {
  "self-assessments": VALIDATED_TOOLS.slice(0, 4).map((a) => ({
    label: a.shortName,
    href: `/resources/${a.slug}`,
  })),
  guides: MONARCH_GUIDES.map((a) => ({
    label: a.shortName,
    href: `/resources/${a.slug}`,
  })),
  forms: OFFICIAL_FORMS.slice(0, 4).map((f) => ({
    // The official titles carry their form numbers, which are useful on
    // the page and far too long for a menu. Everything from the first
    // colon or bracket goes.
    label: f.title.split(/[:(]/)[0].trim(),
    href: "/resources/forms",
  })),
  library: RESOURCE_LIBRARY.slice(0, 4).map((g) => ({
    label: g.name,
    href: "/resources/library",
  })),
};

const TOOL_SUB_MORE: Record<string, string | undefined> = {
  "self-assessments":
    VALIDATED_TOOLS.length > 4 ? "/resources/self-assessments" : undefined,
  forms: OFFICIAL_FORMS.length > 4 ? "/resources/forms" : undefined,
};

/**
 * The bar: five tabs, named by the client on 18 Sep 2026 — Learn, Research,
 * Tools, Membership, Events. Anything that can live one level down does. A
 * section with one page has no dropdown.
 *
 *   Learn       what healthspan is: the twelve topics.
 *   Research    how we read evidence: our writing, briefs, headlines, positions, a glossary, the library.
 *   Healthspan Tools  the assessments, guides, forms and library.
 *   Membership  the memberships, and the clinical work delivered inside them.
 *   Events      webinars and in-person gatherings.
 *   Online Communities  ten groups, none open yet.
 *
 * About the practice and For clinicians moved out of the bar and live in the
 * footer.
 */
export const PRIMARY_NAV: NavSection[] = [
  {
    label: "Membership",
    href: "/memberships",
    // Portrait film of a consultation (client request, 19 Sep 2026), over
    // the matching still. The old landscape photograph cropped badly here.
    image: { ...GENERATED.menuMembership, video: "/video/menu-membership.mp4" },
    /*
     * The four memberships fill the left column and everything else the
     * right (client, 22 Sep 2026). The panel splits its list in half down
     * the middle, so the order here IS the layout: four products, then
     * four ways in. Adding a fifth entry to either half moves the split.
     */
    children: [
      ...MEMBERSHIP_LINKS,
      {
        label: "Compare memberships",
        href: "/memberships",
        description: "Four pathways, by life stage and intensity.",
      },
      {
        label: "Clinical programs",
        href: "/programs",
        description:
          "The areas our physicians work in, delivered inside a membership.",
      },
      {
        label: "Ageing in Place",
        href: "/care/ageing-in-place",
        description: "Staying safely and confidently at home.",
      },
      {
        label: "Home Care",
        href: "/care/home-care",
        description: "Hands-on support with daily living.",
      },
    ],
  },
  {
    label: "Learn",
    href: "/healthspan",
    // A portrait film of a couple on a coastal path (client request, 18 Sep
    // 2026), over the matching still as its poster.
    image: { ...GENERATED.menuLearn, video: "/video/menu-learn.mp4" },
    // The twelve topics, and nothing else: the tab itself opens the hub, and
    // the method is one click from the hub, the hero and the footer. Order is
    // the content order — six risks, then six keepers — which the two-column
    // panel renders as one column each.
    children: FOCUS_AREAS.map((a) => ({
      label: a.name,
      href: `/healthspan/${a.slug}`,
      description: a.menuLine,
    })),
  },
  {
    label: "Research",
    href: "/research",
    // A portrait film of a physician reading a paper (client request, 19 Sep
    // 2026), over the matching still as its poster.
    image: { ...GENERATED.menuResearch, video: "/video/menu-research.mp4" },
    // Six entries (client approval, 18 Sep 2026): our own writing, three
    // ways of reading other people's research, a guide to reading it
    // yourself, and the outside library. Defined once in content/research.
    children: RESEARCH_SECTIONS.map(({ label, href, menuLine }) => ({
      label,
      href,
      description: menuLine,
    })),
    // The ten bodies whose work we read (client request, 19 Sep 2026). Names
    // only in the menu; each page carries what they published and what we
    // make of it.
    secondary: {
      label: "Research we love",
      links: EVIDENCE_SOURCES.map((e) => ({
        label: e.menuLabel,
        href: `/research/sources/${e.slug}`,
      })),
    },
  },
  {
    label: "Healthspan Tools",
    href: "/resources",
    // A portrait film of two generations looking at a tablet together
    // (client request, 19 Sep 2026), over the matching still as its poster.
    image: { ...GENERATED.menuTools, video: "/video/menu-tools.mp4" },
    // Four sections, each with its own page from 19 Sep 2026 (client
    // request). Defined in content/resources so the menu and the pages
    // cannot drift apart.
    children: TOOL_SECTIONS.map(({ slug, label, href, menuLine }) => ({
      label,
      href,
      description: menuLine,
      sub: TOOL_SUB[slug],
      // Only where there is more than the four shown. Guides has one
      // thing in it and the library has exactly four groups, so neither
      // gets a way to "more" that would lead to the same four again.
      subMore: TOOL_SUB_MORE[slug],
    })),
  },
  // The whole Communities tab is hidden while SHOW_COMMUNITIES_PAGE is off
  // (content/site-flags.ts, 25 Oct 2026). Its Webinars and In-person events
  // entries go with it; /events and its pages stay up.
  ...(SHOW_COMMUNITIES_PAGE ? [{
    label: "Communities",
    href: "/community",
    // Portrait film of a group mid-conversation (client request, 19 Sep
    // 2026), over the matching still.
    image: { ...GENERATED.menuCommunity, video: "/video/menu-community.mp4" },
    // Two lines saying what these are, above the list: "Community" alone
    // does not tell anyone what they would be joining (client request,
    // 19 Sep 2026).
    intro: COMMUNITY_INTRO,
    // Ten groups, defined in content/community. Organised by what people
    // want to talk about, not by the twelve clinical topics.
    // No description line: none of these groups is open yet, so there is
    // nothing true to put under a name (26 Sep 2026). See the note at the
    // top of content/community.ts.
    children: [
      ...FORUM_TOPICS.map(({ label, slug, emoji }) => ({
        // The mark rides on the label so the dropdown needs no new field
        // for it.
        label: `${emoji}  ${label}`,
        href: `/community/${slug}`,
      })),
      // Events moved under Communities 4 Oct 2026 (Jeffrey). Nothing is
      // scheduled yet; the pages say so.
      { label: "Webinars", href: "/events/webinars" },
      { label: "In-person events", href: "/events/in-person" },
    ],
  } satisfies NavSection] : []),
  // About Us added 4 Oct 2026 (Jeffrey). Story and Team anchor into /about;
  // Our Partners points at a partnership page, both of which are hidden
  // site-wide (docs/changes/pre-launch-gating/notes.md) until Jeffrey says
  // otherwise.
  {
    label: "About Us",
    href: "/about",
    image: { ...GENERATED.menuAbout },
    splitHalf: true,
    children: [
      { label: "Our Story", href: "/about/our-story" },
      // Hidden while SHOW_TEAM_PAGE is off (content/site-flags.ts).
      ...(SHOW_TEAM_PAGE ? [{ label: "Our Team", href: "/about/our-team" }] : []),
      { label: "Our Affiliation", href: "/about/our-affiliation" },
      { label: "Our Partners", href: "/partnerships/retirement-communities" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

/**
 * The right side of the bar. Membership is the one transaction and takes
 * the filled button; Sign in is the door to the website's own free
 * accounts (free tier, 26 Sep 2026), shown only while the free tier is on
 * (lib/free-tier.ts). Signed in, the header shows "Your account" at
 * ACCOUNT_HREF instead.
 */
export const MEMBERSHIP_LINK: NavLink = {
  label: "Membership",
  href: "/memberships",
};
export const SIGN_IN_HREF = "/sign-in";
export const ACCOUNT_HREF = "/account";
/**
 * "Free Account" on the home hero (client request, 18 Sep 2026): sign-up
 * for a free account on this website (free tier, 26 Sep 2026). Not
 * rendered while the free tier is off.
 */
export const FREE_ACCOUNT_HREF = "/free-account";

export const FOOTER_NAV: Record<string, NavLink[]> = {
  Learn: [
    { label: "All twelve topics", href: "/healthspan" },
    ...FOCUS_AREAS.map((a) => ({
      label: a.name,
      href: `/healthspan/${a.slug}`,
    })),
  ],
  Practice: [
    { label: "Our method", href: "/method" },
    { label: "Clinical programs", href: "/programs" },
    { label: "Ageing in Place", href: "/care/ageing-in-place" },
    { label: "Home Care", href: "/care/home-care" },
    { label: "For clinicians", href: "/referrals" },
  ],
  Membership: [
    { label: "Compare memberships", href: "/memberships" },
    ...MEMBERSHIP_LINKS.map(({ label, href }) => ({ label, href })),
    { label: "How Monarch works with MSP", href: "/how-monarch-works-with-msp" },
  ],
  Research: RESEARCH_SECTIONS.map(({ label, href }) => ({ label, href })),
  // About, Careers and the "For organisations" partnership column are
  // hidden site-wide from 1 Oct 2026 (pre-launch gating): each page still
  // exists and is noindex, but carries no live link, same treatment as
  // Our approach / Family Medicine / Care at home hub / Nursing before it.
  // See docs/changes/pre-launch-gating/notes.md.
  Company: [
    { label: "Resources and tools", href: "/resources" },
    { label: "Questions", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};

export const LEGAL_NAV: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];
