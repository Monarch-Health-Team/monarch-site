/**
 * Centralised compliance strings used in public-facing pages.
 *
 * These are the canonical disclaimers required by:
 *  - CPSBC Practice Standard "Advertising and Communication with the Public"
 *    (v8.0, 2026-04-01)
 *  - CPSBC Practice Standard "Virtual Care" (v9.3, 2026-04-08)
 *  - BC Medicare Protection Act + Medical and Health Care Services Regulation
 *
 * The narrative rationale and full checklist live in
 * `docs/CONTENT-COMPLIANCE.md`. Edit copy here, not in pages.
 */

import { COUNSEL_WORDING } from "./counsel";

/** Today's wording, kept verbatim while counsel reviews the fee block. */
const MSP_DISCLOSURE_LEGACY =
  "Monarch memberships provide privately paid, uninsured healthspan services. Services that are covered by the BC Medical Services Plan (MSP) are billed to MSP by the physician or provider who delivers them, not by Monarch. You will receive a written record of what your membership includes before any services begin.";

// PENDING legal counsel: D41.
// Approved wording, Dr. Sundren 27 Sep 2026: D41 (the standard fee block).
const FEE_BLOCK =
  "About fees and insured care: Monarch Health memberships cover defined uninsured services only. Medically necessary physician services covered by the BC Medical Services Plan continue to be billed to MSP. Membership is not a condition of receiving insured medical care and does not provide preferential or expedited access to MSP-insured tests, diagnostic investigations or specialist referrals. Fees for uninsured services are disclosed before the service is provided.";

export const COMPLIANCE = {
  regulationNotice:
    "Physicians and surgeons who work with Monarch Health are licensed and regulated by the College of Physicians and Surgeons of British Columbia (CPSBC).",

  nurseRegulationNotice:
    "Nurses practising at Monarch Health are licensed and regulated by the British Columbia College of Nurses and Midwives (BCCNM).",

  /** Required in the footer. */
  feesNotice:
    "Fees for Monarch programs apply strictly to uninsured components of care, including non-physician services. Insured physician visits, prescribed tests, and any other publicly insured services are billed to the provincial health insurance plan by the physician or provider who delivers them, and not by Monarch.",

  /** Required in the footer. */
  enrollmentNotice:
    "Provincial health insurance plans provide essential physician services in the areas of prevention and disease management. Enrolment in a Monarch Program is not a precondition for accessing insured physician services.",

  /**
   * Anywhere we discuss pricing, memberships, or executive packages.
   * The D41 fee block once counsel approves (lib/counsel.ts), today's
   * wording until then. Resolved here so every render site, including the
   * homepage tooltip, follows the switch without an edit.
   */
  mspDisclosure: COUNSEL_WORDING ? FEE_BLOCK : MSP_DISCLOSURE_LEGACY,

  /** The D41 text itself, for the FAQ entry (D26.3). Never retyped. */
  feeBlock: FEE_BLOCK,

  /**
   * Verbatim disclosure ported from the original getexechealth.ca site,
   * required wherever a private-pay membership runs alongside MSP-covered
   * care. Renders at the bottom of every service detail page so visitors
   * are clear that the membership doesn't replace their GP, can't expedite
   * MSP-covered referrals, and isn't a substitute for primary-care access.
   * Required reading under CPSBC §2.8 (accuracy / non-misleading) and BC
   * MSP rules on dual practice. Do not edit without compliance review.
   */
  mspBoundaryDisclosure:
    "This program does not guarantee access to or replace a General Practitioner, Family Physician, or any Medical Service Plan (MSP) insured primary care services. It also does not provide expedited access to MSP-covered laboratory tests, diagnostic investigations, or specialist referrals. Membership also does not result in priority or preferential scheduling of MSP-insured services.",

  /** Anywhere we promote virtual / telehealth visits. */
  virtualCareNotice:
    "Virtual care at Monarch Health is offered alongside, not instead of, in-person care. Your physician will arrange a timely in-person assessment when one is clinically appropriate. Virtual care is offered to patients located in British Columbia.",

  /**
   * Required wherever non-patient imagery is used. Covers stock and model
   * photography and, since 9 Sep 2026, generated illustrative imagery.
   */
  modelPhotoDisclaimer:
    "Photography depicts models or is illustrative imagery. It is not a representation of a real Monarch Health patient or care outcome.",

  outcomesDisclaimer: "",

  /** Placeholder marker — use this on testimonial cards while content is fake. */
  testimonialTodoMarker:
    "TODO: replace with a consented patient testimonial. See docs/CONTENT-COMPLIANCE.md §D.",

  /**
   * The footer's transparency statement since 8 Oct 2026 (MSP access
   * wording, DRAFT for legal review): replaces the five notices above in
   * the footer panel. They are kept here because the About page still
   * uses regulationNotice, nurseRegulationNotice and transparencyNotice.
   * Whether Monarch or its physicians bill MSP is still to be confirmed;
   * if they do, this must not say Monarch "does not offer insured services".
   */
  transparencyStatement:
    "Monarch Health is not a primary care practice. Membership fees cover uninsured services only, itemized before you begin. Insured physician services remain available through MSP regardless of membership, and membership does not result in priority or preferential scheduling of them. Our physicians and nurses are registered with CPSBC and BCCNM.",

  /** Transparency & Care Standards site-wide footer statement. */
  transparencyNotice:
    "Monarch Health provides uninsured services in accordance with the standards of the College of Physicians and Surgeons of British Columbia (CPSBC). Monarch does not bill the Medical Services Plan (MSP). Access to MSP-insured physician services is not dependent on participation in any uninsured program or service. Membership also does not result in priority or preferential scheduling of MSP-insured services. Where uninsured services are provided, fees are disclosed in advance and are consistent with applicable professional guidelines, including the Doctors of BC Uninsured Services Fee Guide where appropriate.",
} as const;

export type ComplianceKey = keyof typeof COMPLIANCE;

/**
 * Programmatic checklist that mirrors the markdown doc. Useful for surfacing
 * compliance state in admin/editor surfaces if we add one later. Each entry
 * maps to a section in docs/CONTENT-COMPLIANCE.md.
 */
export const COMPLIANCE_CHECKLIST = [
  {
    id: "responsible-licensee",
    section: "A",
    label: "Identifies the licensee(s) responsible for the content (legal name).",
  },
  {
    id: "verified-credentials",
    section: "A",
    label: "Credentials shown are CPSBC-verified for the licensee's class of licensure.",
  },
  {
    id: "msp-vs-private",
    section: "A/F",
    label: "Insured (MSP) vs. uninsured / private-pay services are clearly distinguished.",
  },
  {
    id: "regulation-notice",
    section: "C.1",
    label: "Regulation notice rendered in the footer.",
  },
  {
    id: "no-superlatives",
    section: "B",
    label: "No comparative or superlative claims ('best', 'leading', 'only', 'premier').",
  },
  {
    id: "no-guarantees",
    section: "B",
    label: "No guarantees, warranties, or unreasonable expectations of outcome.",
  },
  {
    id: "no-inducements",
    section: "B",
    label: "No discounts, points, time-limited offers, gifts, or prize draws.",
  },
  {
    id: "before-after-consent",
    section: "B",
    label: "Any before-and-after photography is backed by written patient consent on file.",
  },
  {
    id: "model-photo-disclaimer",
    section: "C.4",
    label: "Stock or model photography carries the model disclaimer.",
  },
  {
    id: "consented-testimonials",
    section: "D",
    label: "Testimonials are real, consented, and non-comparative - or marked TODO.",
  },
  {
    id: "virtual-in-person-backstop",
    section: "E",
    label: "Virtual-care marketing references the in-person backstop.",
  },
  {
    id: "pre-service-fee-disclosure",
    section: "F",
    label: "Fees are disclosed before services and accompanied by a written breakdown.",
  },
] as const;

export type ComplianceItem = (typeof COMPLIANCE_CHECKLIST)[number];
