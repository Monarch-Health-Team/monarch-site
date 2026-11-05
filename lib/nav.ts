import { MEMBERSHIPS } from "@/content/memberships";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  /** Sets the label in the brand orange rather than navy. */
  accent?: boolean;
};

/**
 * One entry in the header bar. The order of PRIMARY_NAV is the order of the
 * desktop bar, left to right; the phone sheet uses the same order.
 */
export type NavSection = {
  label: string;
  href: string;
  /** Names only: no descriptions, photographs, numbers or badges. */
  children?: NavLink[];
  /** The link after the divider at the foot of the children. */
  childrenFooter?: NavLink;
  /**
   * The phone sheet shows this entry as plain links, not a group: the label
   * itself (to `href`), then each child whose href differs.
   */
  sheetFlat?: boolean;
};

/**
 * The membership pages' own links, in the order of MEMBERSHIPS, so anything
 * that lists them cannot drift from the content.
 */
export const MEMBERSHIP_LINKS: NavLink[] = MEMBERSHIPS.map((m) => ({
  label: m.name,
  href: `/memberships/${m.slug}`,
  description: `${m.stage} · ${m.navPromise}`,
  accent: true,
}));

export const CARE_PROGRAMMES_COMPARE: NavLink = {
  label: "Compare all programmes",
  href: "/care-programmes",
};

export const CARE_PROGRAMME_LINKS: NavLink[] = [
  { label: "Foundation", href: "/care-programmes/foundation" },
  { label: "Preserve", href: "/care-programmes/preserve" },
  { label: "Continuum", href: "/care-programmes/continuum" },
  { label: "Signature", href: "/care-programmes/signature" },
];

/**
 * The header bar, left to right. The phone sheet lists the same entries in
 * this order.
 */
export const PRIMARY_NAV: NavSection[] = [
  { label: "Our Approach", href: "/our-approach" },
  {
    label: "Care Programmes",
    href: "/care-programmes",
    children: CARE_PROGRAMME_LINKS,
    childrenFooter: CARE_PROGRAMMES_COMPARE,
  },
  { label: "For Families", href: "/for-families" },
  { label: "Resources", href: "/resources" },
  {
    label: "About",
    href: "/about",
    sheetFlat: true,
    children: [
      { label: "About Monarch", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

/** The one solid call to action, everywhere. */
export const CTA_LINK: NavLink = {
  label: "Arrange a Conversation",
  href: "/contact",
};

/**
 * Membership is the one transaction; Sign in is the door to the website's own
 * free accounts, shown only while the free tier is on (lib/free-tier.ts).
 */
export const MEMBERSHIP_LINK: NavLink = {
  label: "Membership",
  href: "/memberships",
};
export const SIGN_IN_HREF = "/sign-in";
export const ACCOUNT_HREF = "/account";
/** Sign-up for a free account on this website (free tier, 26 Sep 2026). */
export const FREE_ACCOUNT_HREF = "/free-account";

export const FOOTER_NAV: Record<string, NavLink[]> = {
  EXPLORE: [
    { label: "Home", href: "/" },
    { label: "Our Approach", href: "/our-approach" },
    { label: "The 12 Health Categories", href: "/health-categories" },
    { label: "Our Team", href: "/our-team" },
    { label: "For Families", href: "/for-families" },
    { label: "Resources", href: "/resources" },
    { label: "About Monarch", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  "CARE PROGRAMMES": [...CARE_PROGRAMME_LINKS, CARE_PROGRAMMES_COMPARE],
  "POLICIES & INFORMATION": [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Membership Agreement", href: "/membership-agreement" },
    { label: "MSP and Physician Services", href: "/msp" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
};

export const LEGAL_NAV: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];
