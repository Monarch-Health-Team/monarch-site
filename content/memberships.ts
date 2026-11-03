/**
 * The three public Monarch Health memberships — the product of this site.
 *
 * Source: Monarch Health Corporate Playbook v1.2, Part II ("The Membership
 * Ecosystem" and "Tiers and assessment depth"). The playbook describes five
 * internal tiers; on 9 Sep 2026 Jeffrey collapsed them to three public
 * packages: Access folds into Foundation, Continuum folds into Executive
 * as its coordinated-care pathway, and Signature stands alone. The five
 * tiers survive inside the Healthspan OS; the website shows three. lint-content-ok
 * — a comment explaining the boundary has to name the thing. Names
 * keep the "Monarch" prefix because the playbook carries it.
 *
 * Three rules govern everything in this file, and all three are testable:
 *
 *  1. NO INTERNAL VOCABULARY. The playbook describes assessment depth in
 *     layers. That internal shorthand is not member-facing language. Member
 *     -facing copy describes what is actually measured, in plain words.
 *     Enforced by scripts/lint-content.ts (TC-2.5).
 *  2. NO SCORES. The composite scores and the gap measure described in the
 *     playbook are gated behind clinical validation and named clinical
 *     sign-off (playbook §13.12). None of them appear here in any form,
 *     including as illustrative examples (TC-2.2, TC-2.3).
 *  3. NO TIER RANKING. No membership carries a "popular" or "recommended"
 *     flag, and no such field exists on the type — CPSBC §2.12 prohibits
 *     implying one option is superior (TC-4.3).
 *
 * Pricing: fees are deliberately not published on the site (Jeffrey, 23 Oct
 * 2026). Every pricing surface sends the visitor to a call or a quote request
 * (components/sections/quote-cta.tsx), so no fee figure lives in this file.
 */

export type MembershipSlug =
  "foundation" | "ageing-in-place" | "executive" | "signature";

export type Membership = {
  slug: MembershipSlug;
  name: string;
  /** Life stage, phrased as guidance. Never enforced as an age gate (R3.5). */
  stage: string;
  /** The same stage in a few words, for card overlines where the full form wraps. */
  stageShort: string;
  /** Short form used in nav dropdowns. */
  navPromise: string;
  /** The core promise, verbatim in spirit from Playbook Part II. */
  promise: string;
  /** What the membership is for, in a few words (client brief, 10 Oct 2026). */
  focus: string;
  /** Who it is for, by need and outcome rather than age (same brief). */
  profile: string;
  /** Who this is for — long form, opens the detail page. */
  audience: string;
  /**
   * Whether the page addresses the member or the family member arranging
   * care. Ageing in Place's coordinated pathway is frequently arranged by an adult child.
   * PENDING CONFIRMATION — see docs/REQUIREMENTS.md §9 question 3.
   */
  reader: "member" | "family";
  /** What the membership includes. */
  includes: { title: string; description: string }[];
  /** Assessment described in member-facing language (R3.6). */
  assessment: {
    summary: string;
    covers: string[];
    cadence: string;
  };
  /**
   * How the membership is delivered day to day. This is where the platform
   * appears — as a member benefit, subordinate to the membership itself
   * (R1.11 / D3). It never leads a page and never shows a score.
   */
  experience: { title: string; description: string }[];
  /** Programs from /programs that this membership draws on. */
  programs: string[];
  /** Relationship to the public system — required framing on every tier. */
  publicSystem: string;
  /** Ageing in Place only: the coordinated-care pathway inside it (R1.4). */
  pathwayNote?: string;
  /** How change is noticed and what happens next (client review, 10 Oct 2026). */
  howItWorks?: { title: string; text: string }[];
};

export const MEMBERSHIPS: Membership[] = [
  {
    slug: "foundation",
    name: "Monarch Foundation",
    stage: "Typically up to age 40",
    stageShort: "Typically up to age 40",
    navPromise: "Start the record early, while there is nothing to find",
    promise:
      "Start the record early. A yearly physical, core screening and a nurse who knows you, so that a change in your forties is visible as a change rather than as a new normal.",
    focus: "Establish your baseline",
    profile:
      "Establish your health baseline, understand your risks and build a personalized plan that can evolve with you.",
    audience:
      "Adults in the decades when very little is wrong yet, and when that is exactly the point. Almost nothing found in these years needs treating; what they are for is the first reading of everything, taken while it is normal. A baseline is only worth what it is compared against later, and it can only be taken now.",
    reader: "member",
    includes: [
      {
        title: "Annual healthspan assessment",
        description:
          "A structured assessment of your health, function, risk factors and goals, with physician involvement where appropriate.",
      },
      {
        title: "Healthspan laboratory assessment",
        description:
          "Where appropriate, your assessment may include laboratory testing, read against your own previous years rather than a population average. Publicly funded laboratory services remain subject to applicable MSP and public healthcare requirements. Any uninsured testing will be clearly identified and discussed with you in advance.",
      },
      {
        title: "Quarterly contact with a nurse",
        description:
          "Someone who has read your file, four times a year, so a question does not have to be saved for the annual assessment.",
      },
      {
        title: "Support when something changes",
        description:
          "A care team that knows your history and can help you understand what needs attention and coordinate the appropriate next steps.",
      },
      {
        // PENDING Dr. Sundren (review round 1): D42.1 (the title).
        title: "Services beyond this membership",
        // Approved wording, Dr. Sundren 27 Sep 2026: D42.
        description:
          "Your membership includes the services listed here. Additional services are discussed and priced separately before they are provided.",
      },
    ],
    assessment: {
      summary:
        "One assessment a year, built to be compared with the next one rather than to find something now.",
      covers: [
        "Personal, family and occupational history",
        "Lifestyle review - sleep, movement, nutrition, alcohol, stress",
        "Healthspan laboratory assessment",
        "Physical examination and basic physical measures",
      ],
      cadence: "Annually, with quarterly nurse contact in between.",
    },
    experience: [
      {
        title: "Results explained, not just delivered",
        description:
          "Every result is presented with what it means and what, if anything, follows from it.",
      },
      {
        title: "A record that starts now",
        description:
          "Each year is kept alongside the last, which is the whole reason for beginning this early.",
      },
      {
        title: "Support between assessments",
        description:
          "A care team that knows your history and can help you understand what needs attention and what can wait.",
      },
    ],
    programs: ["executive-health", "functional-assessments"],
    publicSystem:
      "Publicly insured services remain publicly insured. Where an independently practising physician provides an MSP-insured service, that service is separate from Monarch Health and is billed through MSP in accordance with applicable requirements. Membership fees do not cover or provide priority access to MSP-insured services. This membership covers uninsured services - assessment, prevention planning, coordination, monitoring and support. It does not replace your family physician or provide faster access to MSP-covered investigations.",
  },
  {
    slug: "executive",
    name: "Monarch Proactive",
    stage: "Typically age 40 to 65, or older if you are highly independent",
    stageShort: "Typically age 40 to 65",
    navPromise: "Hold the ground you have, through the decades that take it",
    promise:
      "Keep what you have through the decades when risk accumulates quietly - with a care team that knows your history, a practical plan, and follow-through on it.",
    focus: "Protect health and performance",
    profile:
      "Understand changing health risks, maintain physical and cognitive capacity, and turn findings into a practical plan with ongoing follow-through.",
    audience:
      "Adults in the middle decades, when almost everything that will matter later is being decided and almost none of it announces itself. Blood pressure, weight, sleep and strength move slowly enough to look like nothing; this is the stretch in which they are still cheap to change. The membership is built around follow-through rather than events, so that drift is caught while it is still drift.",
    reader: "member",
    includes: [
      {
        title: "An annual assessment, scaled to your stage",
        description:
          "A structured baseline in your twenties and thirties - history, family history, how you live, core laboratory assessment - growing into a full day of assessment covering detailed laboratory assessment, physical measures and fitness as the decades add risk.",
      },
      {
        title: "Risk-guided early detection",
        description:
          "Cancer, cardiovascular and genetic screening pathways where they are clinically appropriate for you, with imaging where indicated. Any privately paid, uninsured testing is identified and discussed with you in advance. Membership does not provide expedited access to publicly funded diagnostic testing.",
      },
      {
        title: "Physician-led interpretation",
        description:
          "An unhurried conversation about what the assessment found, what it means, what is worth attention now and what is worth watching.",
      },
      {
        title: "A written plan you can actually act on",
        description:
          "A small number of specific things to work on, chosen because they matter most at your stage - not a list of thirty.",
      },
      {
        title: "Targeted re-measurement during the year",
        description:
          "When something is being worked on, it is re-measured on a sensible interval rather than left until next year.",
      },
      {
        title: "Habit and lifestyle guidance",
        description:
          "Practical support on sleep, movement, nutrition and stress, revisited as your circumstances change.",
      },
      {
        title: "Coordination across your care",
        description:
          "With your consent, a care coordinator helps organize health information and keeps follow-up on track, so you are not the one chasing it. Coordination does not provide priority or preferential access to publicly insured services.",
      },
      {
        title: "Access to the member app and care team",
        description:
          "Your plan, results, record and messaging in one place, with support between assessments.",
      },
    ],
    assessment: {
      summary:
        "An annual assessment that starts as a baseline and deepens with your stage, with targeted re-measurement during the year where something is being actively managed.",
      covers: [
        "Personal, family and occupational history",
        "Lifestyle review - sleep, movement, nutrition, alcohol, stress",
        "Healthspan laboratory assessment, extending to cardiovascular and metabolic markers with age",
        "Physical measures - body composition, blood pressure, fitness",
        "Cognitive and mental wellbeing review, and social connection",
        "Risk-guided screening and imaging where clinically appropriate",
      ],
      cadence:
        "Annually, with interim re-measurement of anything under active management.",
    },
    experience: [
      {
        title: "Results explained, not just delivered",
        description:
          "Every result is presented with what it means and what, if anything, follows from it.",
      },
      {
        title: "Your plan and your record together",
        description:
          "What you agreed to work on, alongside the measurements it should move - held over years rather than scattered across visits.",
      },
      {
        title: "Support between assessments",
        description:
          "A care team that knows your history and can help you understand what needs attention and what can wait.",
      },
      {
        title: "Wearable data, if you use one",
        description:
          "Sleep and activity data can feed into the picture your care team works from.",
      },
    ],
    programs: [
      "executive-health",
      "early-detection",
      "cardiovascular-prevention",
      "metabolic-health",
      "mens-health",
      "menopause-perimenopause",
      "weight-optimization",
      "sleep-recovery",
    ],
    publicSystem:
      "Publicly insured services remain publicly insured. Where an independently practising physician provides an MSP-insured service, that service is separate from Monarch Health and is billed through MSP in accordance with applicable requirements. Membership fees do not cover or provide priority access to MSP-insured services. This membership covers uninsured services - assessment, prevention planning, coordination, monitoring and support. It does not replace your family physician or provide faster access to MSP-covered investigations.",
  },
  {
    slug: "ageing-in-place",
    name: "Monarch Ageing in Place",
    stage: "Typically age 65 and over, or earlier when support is needed",
    stageShort: "Typically age 65 and over",
    navPromise: "Comprehensive assessment, and care that comes to you",
    promise:
      "An annual assessment weighted to function and independence, monthly contact at home, and someone steering when care becomes several things at once - so that staying independent stays the plan.",
    focus: "Preserve function and independence",
    profile:
      "Follow mobility, cognition and everyday function over time, identify changing support needs and help members maintain independence at home.",
    audience:
      "Adults in the years when staying well and staying independent become the same project, and the families who help them. The emphasis moves from finding disease toward keeping the strength, balance, thinking and confidence that independence rests on - and toward coordination, because by this stage the difficulty is rarely one condition, it is four of them and nobody holding the thread.",
    reader: "family",
    pathwayNote:
      "Ageing in Place includes a coordinated-care pathway for members living with frailty or several conditions at once. It brings clinical care, home support and coordination into one arrangement, and it is entered at the point where care is becoming complicated - not at a particular birthday.",
    howItWorks: [
      {
        title: "How change is identified",
        text: "Strength, balance, walking speed and memory are measured at your annual assessment and at a functional review every six months, and again whenever there is a meaningful change in condition.",
      },
      {
        title: "When a concern arises",
        text: "Your care team reviews what has changed and, with your consent, involves your family physician and others in your care so the next steps are coordinated. Coordination does not provide priority or preferential access to publicly insured services.",
      },
    ],
    includes: [
      {
        title: "An annual health and function assessment",
        description:
          "The usual medical review, plus direct measurement of strength, balance, walking speed and memory - the things independence depends on. Reviewed at home where that is more useful.",
      },
      {
        title: "Functional review twice a year, or whenever things change",
        description:
          "Because function can change faster than bloodwork, it is measured more often than once a year - and again on any change in condition, not only by the calendar.",
      },
      {
        title: "Falls and mobility planning",
        description:
          "Practical work on balance, strength and the home environment, before a fall rather than after one.",
      },
      {
        // PENDING Dr. Sundren (review round 1): D30.1.
        title: "Support when something changes",
        // PENDING Dr. Sundren (review round 1): D30.2.
        description:
          "A care team that knows your history and can help you understand what needs attention and coordinate the appropriate next steps. Coordination does not provide priority or preferential access to publicly insured services.",
      },
      {
        title: "Medication review",
        description:
          "A regular look at everything you take together, which is often where the easiest gains are.",
      },
      {
        title: "A named care coordinator, when care becomes complicated",
        description:
          "One person who knows the situation and helps hold the moving parts together, with your consent - specialists, allied health and home support kept in step with the plan. Coordination does not provide priority or preferential access to publicly insured services.",
      },
      {
        title: "Home-based healthspan support",
        description:
          "Where appropriate, Monarch may provide or coordinate uninsured healthspan services in the home. Any MSP-insured physician services provided by an independent physician are separate from Monarch Health and are not included in the membership.",
      },
      {
        title: "Support for the family",
        description:
          "Clear communication, planning conversations, and someone on the care team who can answer a question - with the member's consent.",
      },
    ],
    assessment: {
      summary:
        "An annual assessment with a functional review every six months, weighted toward independence - and reassessed whenever the situation changes.",
      covers: [
        "Medical and medication history, reviewed together as a whole",
        "Laboratory assessment and vitals",
        "Strength, balance, gait speed and mobility",
        "Memory, thinking and mood",
        "Mood, purpose and social connection",
        "Day-to-day function at home, and what help is needed",
        "Home safety and the home environment",
        "What matters most to the person, and to the family",
      ],
      cadence:
        "Annual full assessment; functional review every six months, and again whenever there is a meaningful change in condition.",
    },
    experience: [
      {
        title: "A plan built around what you want to keep doing",
        description:
          "Goals are set in terms of activities and independence, not abstractions.",
      },
      {
        title: "A named point of contact",
        description:
          "A care team member who knows your plan, and a single coordinator, not a directory, when care is complicated.",
      },
      {
        title: "Family kept in the loop, with your permission",
        description:
          "Where you want family involved, they can be - on your terms and with your consent, working from the same plan as the clinical team.",
      },
      {
        title: "A written summary after every review",
        description:
          "Something you can keep, read later, and share with whoever you choose.",
      },
    ],
    programs: [
      "frailty-prevention",
      "brain-health",
      "cardiovascular-prevention",
      "functional-assessments",
      "sleep-recovery",
      "metabolic-health",
      "longevity-medicine",
    ],
    publicSystem:
      "Publicly insured services remain publicly insured. Where an independently practising physician provides an MSP-insured service, that service is separate from Monarch Health and is billed through MSP in accordance with applicable requirements. Membership fees do not cover or provide priority access to MSP-insured services. This membership covers uninsured services - assessment, prevention planning, functional review, care coordination, monitoring and family support. It does not replace your family physician or publicly funded home and community care, and it does not provide faster access to MSP-covered tests or specialist referrals.",
  },
  {
    slug: "signature",
    name: "Monarch Signature",
    stage: "Any age",
    stageShort: "Any age",
    // PENDING Dr. Sundren (review round 1): D6.2 (Q3: the menu-length line).
    navPromise: "Our most comprehensive membership",
    // Approved wording, Dr. Sundren 27 Sep 2026: D6.
    promise:
      "Our most comprehensive healthspan management membership, combining assessment, planning, monitoring and coordination.",
    // Q4 (sundren-review-round1): "fullest picture" flagged, unchanged.
    focus: "Comprehensive healthspan coordination",
    profile:
      "A more comprehensive, personalized healthspan service with enhanced assessment, monitoring and coordination, including international care coordination where appropriate.",
    audience:
      "Those who want the fullest picture available and the closest working relationship with a care team, regardless of life stage. The distinction is depth and frequency: more is measured, more often, and there is more time with the people interpreting it.",
    reader: "member",
    includes: [
      {
        title: "Comprehensive assessment across every area we measure",
        description:
          "History, biology, physical and cognitive function, resilience and day-to-day capability - the most extensive assessment rather than a subset.",
      },
      {
        title: "Reassessment twice a year",
        description:
          "Six-monthly reassessment, so change is caught within months rather than within years.",
      },
      {
        title: "Remote monitoring between assessments",
        description:
          "Wearable and remote monitoring data feeding into the record your care team works from, reviewed by your care team at scheduled points. This is not continuous clinical oversight and not an emergency service.",
      },
      {
        title: "Dedicated healthspan planning time",
        description:
          "Additional time for assessment, interpretation, prevention planning and healthspan management services included in your membership.",
      },
      {
        title: "Access to included healthspan programs",
        description:
          "Access to the uninsured healthspan programs included in your membership, based on your needs and goals.",
      },
      {
        title: "Care coordination",
        description:
          "With your consent, Monarch can coordinate relevant health information and follow-up across your healthcare team, including internationally when needed. Coordination does not provide priority access to publicly insured services.",
      },
    ],
    assessment: {
      summary:
        "Comprehensive assessment across every area we measure, twice a year, with remote monitoring reviewed by your care team in between.",
      covers: [
        "Full personal, family and genetic history where appropriate",
        "Most extensive biological panel",
        "Physical function, strength, balance and fitness",
        "Cognitive assessment",
        "Resilience and recovery measures",
        "Day-to-day capability and quality of life",
        "Wearable and remote monitoring, reviewed at scheduled points",
      ],
      cadence:
        "Every six months, with remote monitoring reviewed between assessments.",
    },
    experience: [
      {
        title: "A care team that knows your file",
        description:
          "Continuity with the same people, who do not need bringing up to speed.",
      },
      {
        title: "Everything in one record",
        description:
          "Assessments, monitoring, plans and correspondence held together over time.",
      },
      {
        title: "Monthly written summaries",
        description:
          "A regular account of what has changed and what is being worked on.",
      },
      {
        title: "Coordination support",
        description:
          "With your consent, the team handles the administrative work of organizing health information and follow-up. Coordination does not provide priority access to publicly insured services.",
      },
    ],
    programs: [
      "executive-health",
      "early-detection",
      "longevity-medicine",
      "cardiovascular-prevention",
      "brain-health",
      "metabolic-health",
      "frailty-prevention",
      "sleep-recovery",
      "functional-assessments",
      "weight-optimization",
      "menopause-perimenopause",
      "mens-health",
    ],
    publicSystem:
      "Publicly insured services remain publicly insured. Where an independently practising physician provides an MSP-insured service, that service is separate from Monarch Health and is billed through MSP in accordance with applicable requirements. Membership fees do not cover or provide priority access to MSP-insured services. This membership covers uninsured services only. It does not replace your family physician, and it does not provide faster access to MSP-covered investigations or specialist referrals.",
  },
];

export function getMembership(slug: string): Membership | undefined {
  return MEMBERSHIPS.find((m) => m.slug === slug);
}

/**
 * Comparison matrix rows.
 *
 * PLACEHOLDER CONTENT. Appendix C of the playbook defines this matrix but
 * ships with empty rows — the benefit-by-tier detail does not exist yet. The
 * rows below are inferred from Part II so the page can be built and reviewed;
 * every one of them needs confirmation before launch (dependency C2).
 */
export const COMPARISON_PLACEHOLDER = true;

export type ComparisonRow = {
  label: string;
  /** Per-membership value, keyed by slug. */
  values: Record<MembershipSlug, string>;
};

export type ComparisonGroup = {
  title: string;
  rows: ComparisonRow[];
};

function focusText(slug: MembershipSlug): string {
  return MEMBERSHIPS.find((x) => x.slug === slug)?.focus ?? "";
}

function assessmentText(slug: MembershipSlug): string {
  return MEMBERSHIPS.find((x) => x.slug === slug)?.assessment.summary ?? "";
}

function profileText(slug: MembershipSlug): string {
  return MEMBERSHIPS.find((x) => x.slug === slug)?.profile ?? "";
}

export const COMPARISON: ComparisonGroup[] = [
  {
    title: "Best suited for",
    rows: [
      {
        label: "Best suited for",
        values: {
          foundation: profileText("foundation"),
          executive: profileText("executive"),
          "ageing-in-place": profileText("ageing-in-place"),
          signature: profileText("signature"),
        },
      },
      {
        label: "Usually suits",
        values: {
          foundation: "Typically up to age 40",
          executive:
            "Typically age 40 to 65, and older members who are highly independent",
          "ageing-in-place":
            "Typically age 65 and over, or earlier when support with mobility, memory or daily living is needed",
          signature: "Any age",
        },
      },
      {
        label: "What sets it apart",
        values: {
          foundation: "A first structured baseline of your health and risks",
          executive:
            "Assessment compared with your own previous years, with ongoing follow-through",
          "ageing-in-place":
            "A focus on function and independence, with home-based support where appropriate",
          signature:
            "Six-monthly reassessment, remote monitoring, dedicated planning time and coordination across your care team, including internationally",
        },
      },
    ],
  },
  {
    title: "Assessment and follow-up",
    rows: [
      {
        label: "What is assessed",
        values: {
          foundation: assessmentText("foundation"),
          executive: assessmentText("executive"),
          "ageing-in-place": assessmentText("ageing-in-place"),
          signature: assessmentText("signature"),
        },
      },
      {
        label: "Functional and cognitive health",
        values: {
          foundation:
            "Physical examination and basic physical measures at each annual assessment. Memory and thinking are not routinely assessed.",
          executive:
            "Body composition, blood pressure and fitness at each annual assessment, plus a cognitive and mental wellbeing review.",
          "ageing-in-place":
            "Strength, balance, walking speed and mobility, and memory, thinking and mood, at the annual assessment and at a functional review every six months.",
          signature:
            "Physical function (strength, balance and fitness) and cognition, assessed every six months.",
        },
      },
      {
        label: "How often",
        values: {
          foundation: "Annual assessment, with quarterly nurse contact in between",
          executive:
            "Annual assessment, with re-measurement during the year of anything under active management",
          "ageing-in-place":
            "Annual assessment, a functional review every six months and on any change in condition, and monthly contact",
          signature:
            "Reassessment every six months, with remote monitoring reviewed between assessments",
        },
      },
    ],
  },
];

/**
 * Rows held back from the public table until the clinical team confirms them
 * (client review, 13 Oct 2026). Kept here so nothing is lost: each goes back
 * into COMPARISON, in plain language, as its facts are confirmed. See
 * docs/launch-plan/content-review/second-round-questions.md.
 */
export const HELD_COMPARISON: ComparisonGroup[] = [
  {
    title: "Who it is for",
    rows: [
      {
        label: "What it is for",
        values: {
          foundation: focusText("foundation"),
          "ageing-in-place": focusText("ageing-in-place"),
          executive: focusText("executive"),
          signature: focusText("signature"),
        },
      },
      {
        label: "What sets it apart",
        values: {
          foundation: "A first structured baseline of your health and risks",
          "ageing-in-place":
            "A focus on function and independence, with home-based support where appropriate",
          executive:
            "Assessment compared with your own previous years, with ongoing follow-through",
          signature:
            "Six-monthly reassessment, remote monitoring, dedicated planning time and coordination across your care team, including internationally",
        },
      },
      {
        label: "Usually suits",
        values: {
          foundation: "Typically up to age 40",
          "ageing-in-place":
            "Typically age 65 and over, or earlier when support with mobility, memory or daily living is needed",
          executive:
            "Typically age 40 to 65, and older members who are highly independent",
          signature: "Any age",
        },
      },
      {
        label: "Usually arranged by",
        values: {
          foundation: "The member",
          "ageing-in-place": "The member, or a family member",
          executive: "The member",
          signature: "The member",
        },
      },
    ],
  },
  {
    title: "Assessment",
    rows: [
      {
        label: "Depth of assessment",
        values: {
          foundation: "A first, structured baseline of your health and risks to build on",
          "ageing-in-place": "Comprehensive, weighted to function and independence",
          executive: "Comprehensive, and compared with your own previous years",
          signature: "Most extensive",
        },
      },
      {
        label: "How often",
        values: {
          foundation: "Annual, with quarterly nurse contact",
          "ageing-in-place": "Annual, plus functional review every six months and on any change in condition, and monthly contact",
          executive:
            "Annual, plus targeted re-measurement of anything under active management",
          signature: "Six-monthly, plus remote monitoring reviewed by your care team",
        },
      },
      {
        label: "Healthspan laboratory assessment",
        values: {
          foundation: "Core screening panel",
          "ageing-in-place": "Extended panel",
          executive: "Extended panel",
          signature: "Most extensive panel",
        },
      },
      {
        label: "Physical function measured",
        values: {
          foundation: "Basic measures",
          "ageing-in-place": "Detailed, twice yearly",
          executive: "Included",
          signature: "Detailed, twice yearly",
        },
      },
      {
        label: "Cognitive assessment",
        values: {
          foundation: "Not routinely",
          "ageing-in-place": "Included",
          executive: "Included",
          signature: "Detailed",
        },
      },
      {
        label: "Risk-guided screening and imaging",
        values: {
          foundation: "Where clinically appropriate",
          "ageing-in-place": "Where clinically appropriate",
          executive: "Where clinically appropriate",
          signature: "Where clinically appropriate",
        },
      },
    ],
  },
  {
    title: "Support and access",
    rows: [
      {
        label: "Care coordinator",
        values: {
          foundation: "Not included",
          "ageing-in-place": "Named coordinator",
          executive: "Included",
          signature: "Named coordinator",
        },
      },
      {
        label: "Care delivered at home",
        values: {
          foundation: "Not routinely",
          "ageing-in-place": "Core to the membership, monthly",
          executive: "Not routinely",
          signature: "Where appropriate",
        },
      },
      {
        label: "Messaging your care team",
        values: {
          foundation: "Nurse line",
          "ageing-in-place": "Included, family may be included with consent",
          executive: "Included",
          signature: "Included",
        },
      },
      {
        label: "Written summaries",
        values: {
          foundation: "After each assessment",
          "ageing-in-place": "After each assessment",
          executive: "A written plan after each assessment",
          signature: "Monthly",
        },
      },
      {
        label: "Wearable and remote monitoring",
        values: {
          foundation: "Optional",
          "ageing-in-place": "Optional, or where clinically useful",
          executive: "Optional",
          signature: "Included, reviewed at scheduled points",
        },
      },
      {
        label: "Medication review",
        values: {
          foundation: "At assessment",
          "ageing-in-place": "Regular, whole-of-list",
          executive: "At assessment",
          signature: "Regular",
        },
      },
    ],
  },
];

/**
 * The line under each tier's description. Fees are not published on the site
 * (Jeffrey, 23 Oct 2026): the line invites a conversation and a written quote
 * instead, and keeps the written-record statement.
 */
export function pricingLine(): string {
  return "Fees are tailored to you. Talk to us for a written quote; every included service is itemized in writing before you begin.";
}
