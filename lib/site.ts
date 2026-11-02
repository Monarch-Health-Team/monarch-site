/**
 * Site-wide facts and navigation. Wording from the hi-fi handoff and the v2
 * copy deck (Jenny's v2 spec, section 10; Figma page 33-2).
 */

export const SITE = {
  name: "Monarch Health",
  description:
    "Physician-led Ageing in Place and care at home. Greater Victoria and Vancouver Island, British Columbia.",
  phoneDisplay: "(250) 818-4425",
  phoneHref: "tel:+12508184425",
  /** Google Maps search for the clinic address (no API key). */
  directionsHref: "https://www.google.com/maps/dir/?api=1&destination=1823%20Fort%20St%2C%20Victoria%2C%20BC",
  email: "info@getmonarchhealth.com",
  address: "1823 Fort St, Victoria, BC",
} as const;

/**
 * A link destination. `null` means the destination page does not exist yet
 * (e.g. the free tools, Privacy). Buttons and text links to a pending page
 * are not rendered (v2 P0-2) and are listed in the build report.
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
      { label: "Guides and forms", href: `${ROUTES.forFamilies}#toolkit` },
      { label: "Caregiver support", href: `${ROUTES.forFamilies}#caregiver-support` },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: ROUTES.about },
      { label: "Our care team", href: `${ROUTES.about}#care-team` },
      { label: "FAQ", href: `${ROUTES.howItWorks}#faq` },
      { label: "Book an assessment", href: ROUTES.book },
    ],
  },
];

/*
 * Footer legal links. Privacy, Terms and Accessibility need real pages
 * before launch, and there is no approved copy for them yet; Cookie
 * settings has nothing to manage (the site sets no cookies). All four stay
 * hidden until their pages exist (v2 P0-2): set an href to show one.
 */
export const LEGAL_LINKS: FooterLink[] = [
  { label: "Privacy", href: PENDING },
  { label: "Terms", href: PENDING },
  { label: "Accessibility", href: PENDING },
];

/** Credentials band under every hero (v2 P1-4). */
export const CREDENTIALS = [
  { icon: "shield", label: "CPSBC-registered physicians", detail: "College of Physicians and Surgeons of BC" },
  { icon: "stethoscope", label: "BCCNM-registered nurses", detail: "BC College of Nurses and Midwives" },
  { icon: "pin", label: "1823 Fort St, Victoria", detail: "Our clinic and care team base", directions: true },
  { icon: "home", label: "Greater Victoria & Vancouver Island", detail: "Care delivered where you live" },
] as const;
