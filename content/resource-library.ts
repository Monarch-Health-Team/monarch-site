/**
 * Curated external resources surfaced on /resources/library.
 *
 * Edit this list to add / remove links. Each entry surfaces as a
 * card with a short description and the canonical URL.
 */

export type ResourceLink = {
  name: string;
  href: string;
  description: string;
  audience: string;
  /** Optional bullets visible on the card. */
  highlights?: string[];
  /**
   * One line on why we trust it: how it handles evidence, how transparent
   * it is about who is behind it, how usable it is. After McMaster's Optimal
   * Aging Portal ratings, in prose rather than stars. Optional while the
   * notes are being written; the card says nothing when absent.
   */
  note?: string;
};

export type ResourceGroup = {
  name: string;
  description: string;
  links: ResourceLink[];
};

export const RESOURCE_LIBRARY: ResourceGroup[] = [
  {
    name: "BC specific seniors' resources",
    description:
      "Provincial bodies, advocacy, and the public sector services families turn to most often in Greater Victoria.",
    links: [
      {
        name: "Office of the Seniors Advocate BC",
        href: "https://www.seniorsadvocatebc.ca/",
        description:
          "BC's independent office monitoring services and policies affecting seniors. Useful first stop for systemic issues and rights questions.",
        audience: "All BC seniors and families",
      },
      {
        name: "Family Caregivers of British Columbia",
        href: "https://www.familycaregiversbc.ca/",
        description:
          "Province wide support for unpaid family caregivers, providing phone line, support groups, education, and a respite library.",
        audience: "Family caregivers",
        highlights: [
          "Caregiver Support Line: 1 877 520 3267",
          "Free webinars and learning library",
        ],
      },
      {
        name: "BC Centre for Elder Advocacy & Support",
        href: "https://bcceas.ca/",
        description:
          "Legal advocacy and information for seniors facing elder abuse, financial issues, or rights questions in BC.",
        audience: "All BC seniors and families",
      },
      {
        name: "SafeCare BC",
        href: "https://www.safecarebc.ca/",
        description:
          "Continuing care safety education with practical guides families and caregivers can use.",
        audience: "Family caregivers and home care workers",
      },
    ],
  },
  {
    name: "Dementia & cognitive health",
    description:
      "Reliable, ad free starting points for families navigating dementia or early cognitive change.",
    links: [
      {
        name: "Alzheimer Society of B.C.",
        href: "https://alzheimer.ca/bc/en",
        description:
          "Information, support groups, First Link® early diagnosis program, and education across BC.",
        audience: "Families navigating dementia",
        highlights: [
          "First Link® dementia helpline: 1 800 936 6033",
          "Free First Link Learning Series",
        ],
      },
      {
        name: "Canadian Frailty Network",
        href: "https://www.cfn-nce.ca/",
        description:
          "Public facing resources on frailty, covering what it is, why it matters, and how families can respond.",
        audience: "Families and clinicians",
      },
      {
        name: "Brain Health PRO (Baycrest)",
        href: "https://brainhealthpro.ca/",
        description:
          "Free online program with evidence based brain health strategies, risk factor identification, and lifestyle recommendations.",
        audience: "Older adults and families",
      },
    ],
  },
  {
    name: "Planning ahead",
    description:
      "Free, reputable resources for the conversations that are easier to have early than late.",
    links: [
      {
        name: "My Voice: BC's advance care planning guide",
        href: "https://www2.gov.bc.ca/gov/content/family-social-supports/seniors/health-safety/advance-care-planning",
        description:
          "Province of BC's free advance care planning workbook. Helps families capture wishes for future medical decisions.",
        audience: "All adults, the earlier the better",
      },
      {
        name: "Speak Up Canada",
        href: "https://www.advancecareplanning.ca/",
        description:
          "National advance care planning hub with workbooks, conversation guides, and provincial resource links.",
        audience: "All adults",
      },
    ],
  },
  {
    name: "Falls prevention",
    description:
      "Practical, evidence based programs and checklists for older adults concerned about falling at home.",
    links: [
      {
        name: "BC Injury Prevention Unit: STABL",
        href: "https://www.injuryresearch.bc.ca/",
        description:
          "A free strength and balance program for older adults at risk of falling. Three progressive levels, designed for home use.",
        audience: "Older adults concerned about falls",
      },
      {
        name: "CDC, Check for Safety home checklist",
        href: "https://www.cdc.gov/falls/about/index.html",
        description:
          "US Centers for Disease Control's room by room home fall prevention checklist. Free, printable, no account needed.",
        audience: "Families and older adults",
      },
    ],
  },
];
