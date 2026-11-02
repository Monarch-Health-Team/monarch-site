export const SITE = {
  name: "Monarch Health",
  legalName: "Monarch Health",
  // Title suffix. Was "Your healthspan, managed." (Dr. Sundren D1, 27 Sep 2026); changed 4 Oct 2026 by Jeffrey to match the logo tagline.
  tagline: "Professional Healthspan Management",
  // Approved wording, Dr. Sundren 27 Sep 2026: D1. Q2: the place name
  // (Greater Victoria / Vancouver Island) is dropped; add one back for local
  // search only if Jeffrey or Dr. Sundren asks.
  description:
    "Monarch Health is a physician-led healthspan management company focused on helping people measure, improve and preserve health and independence over time.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://getmonarchhealth.com",
  region: "Greater Victoria & Vancouver Island, British Columbia",
  email: "info@getmonarchhealth.com",
  /** Published on the previous site and in its FAQ. */
  phone: "(250) 818-4425",
  phoneHref: "tel:+12508184425",
  address: "1823 Fort St, Victoria, BC",
  social: {
    instagram: "https://www.instagram.com/getmonarchhealth/",
    linkedin: "https://www.linkedin.com/company/monarchhealthsolutions/",
    facebook: "https://www.facebook.com/getmonarchhealth/",
  },
  /**
   * CPSBC Advertising 2026 §2.5–2.6 requires a named licensee to be
   * identifiable as responsible for public content. Rendered in the footer
   * and on /about.
   */
  responsibleLicensee: {
    /*
     * Named 21 Sep 2026 (client). Jeffrey confirmed 1 Oct 2026 and asked
     * for the pending badge removed; `credentials` was never rendered
     * (grep before changing this) and is left as a reminder the CPSBC
     * register wording itself is still outstanding, separate from the name.
     */
    name: "Dr. Sundren Govender",
    credentials: "TODO - CPSBC-verified credentials",
    placeholder: false,
  },
} as const;

/** Set once real content clears review; gates the site-wide placeholder banner. */
export const CONTENT_REVIEW_COMPLETE = false;
