/**
 * Site-wide facts and navigation. All wording comes from the hi-fi handoff
 * (details/design-handoff.md, "Global header and footer").
 */

export const SITE = {
  name: "Monarch Health",
  description:
    "Physician-led Ageing in Place and care at home. Greater Victoria & Vancouver Island, British Columbia.",
  phoneDisplay: "(250) 818-4425",
  phoneHref: "tel:+12508184425",
  email: "info@getmonarchhealth.com",
  address: "1823 Fort St, Victoria, BC",
} as const;

/**
 * A link destination. `null` means the destination page is not part of this
 * build yet (e.g. Journal, Privacy). Those render as plain text, not as a
 * broken link, and are listed in the handoff report.
 */
export type Href = string | null;

export const ROUTES = {
  home: "/",
  ageingInPlace: "/ageing-in-place",
  careAtHome: "/care-at-home",
  howItWorks: "/how-it-works",
  forFamilies: "/for-families",
  about: "/about",
  book: "/book",
} as const;

/** Destinations named in the design that are not built in this pass. */
export const PENDING: Href = null;

export const PRIMARY_NAV = [
  { label: "Ageing in Place", href: ROUTES.ageingInPlace },
  { label: "Care at Home", href: ROUTES.careAtHome },
  { label: "How it works", href: ROUTES.howItWorks },
  { label: "For families", href: ROUTES.forFamilies },
  { label: "About", href: ROUTES.about },
] as const;

export type FooterLink = { label: string; href: Href };

export const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Care",
    links: [
      { label: "Ageing in Place", href: ROUTES.ageingInPlace },
      { label: "Home Care", href: `${ROUTES.careAtHome}#home-care` },
      { label: "Nursing", href: `${ROUTES.careAtHome}#nursing` },
      { label: "How it works", href: ROUTES.howItWorks },
    ],
  },
  {
    title: "Families",
    links: [
      { label: "Free planning tools", href: `${ROUTES.forFamilies}#tools` },
      { label: "Guides & forms", href: `${ROUTES.forFamilies}#toolkit` },
      { label: "Caregiver support", href: `${ROUTES.forFamilies}#caregiver-support` },
      { label: "Journal", href: PENDING },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: ROUTES.about },
      { label: "Our care team", href: `${ROUTES.about}#care-team` },
      { label: "For clinicians: referrals", href: PENDING },
      { label: "FAQ", href: `${ROUTES.howItWorks}#faq` },
      { label: "Book an assessment", href: ROUTES.book },
    ],
  },
];

export const LEGAL_LINKS: FooterLink[] = [
  { label: "Privacy", href: PENDING },
  { label: "Terms", href: PENDING },
  { label: "Accessibility", href: PENDING },
  { label: "Cookie settings", href: PENDING },
];
