/**
 * Source of truth for Resources-page interactive screening tools.
 *
 * v1 ships with three instruments, all in the public domain and
 * safely reproducible without licensing:
 *
 *  - GDS-15: Geriatric Depression Scale, short form
 *              (Yesavage et al. 1986; Stanford public domain)
 *  - Lawton IADL + Katz ADL: combined "Daily Living Assessment"
 *              (Lawton & Brody 1969; Katz et al. 1963; public domain)
 *  - CSI: Caregiver Strain Index
 *              (Robinson 1983; public domain)
 *
 * IMPORTANT compliance notes:
 *  - These are SCREENING TOOLS, not diagnostic instruments. Every
 *    tool page renders a disclaimer to that effect and routes users
 *    to a clinical conversation (phone / book a consultation).
 *  - Answers are scored client side only and never sent to any server.
 *    With the free tier on, a check in progress is kept in this tab's
 *    sessionStorage, and a result is sent only when the visitor saves it
 *    to a free account (assessment-runner.tsx). No PII is collected.
 *  - Per CPSBC Advertising standard, results never promise a clinical
 *    outcome and never compare against another provider. Results
 *    describe what the score suggests and recommend a next step.
 */

import { FREE_TIER_ON } from "@/lib/free-tier";

export type AssessmentToneKey =
  | "low"        // best / least concerning
  | "moderate"   // mid range, worth a conversation
  | "high";      // most concerning, a clear action signal

export type AssessmentOption = {
  label: string;
  /** Numeric score contributed if this option is selected. */
  score: number;
};

export type AssessmentQuestion = {
  id: string;
  text: string;
  /** Optional context shown beneath the question. */
  hint?: string;
  options: AssessmentOption[];
};

export type AssessmentInterpretation = {
  /** Short label, e.g. "Mild depressive symptoms". */
  category: string;
  /** Tone band drives the result-panel colour. */
  tone: AssessmentToneKey;
  /** 1 to 2 paragraphs explaining what the score suggests. */
  summary: string;
  /** Recommended next step. */
  recommendation: string;
};

/**
 * Score-to-interpretation lookup band. Tools list their bands in
 * ascending order. The runner picks the first band whose range
 * contains the user's score. Plain data (no functions) so the whole
 * Assessment object is serialisable across the RSC boundary.
 */
export type ScoreBand = {
  minScore: number;
  maxScore: number;
  interpretation: AssessmentInterpretation;
};

export type AssessmentSubscale = {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
  /** Highest possible total for the subscale. */
  maxScore: number;
  bands: ScoreBand[];
};

export type AssessmentSlug =
  | "gds-15"
  | "daily-living"
  | "caregiver-strain"
  | "mood-energy-check"
  | "anxiety-check"
  | "memory-concerns-check"
  | "in-home-care-fit";

export type Assessment = {
  slug: AssessmentSlug;
  name: string;
  shortName: string;
  /** Audience label, e.g. "For older adults", "For family caregivers". */
  audience: string;
  /** Concise summary used on the hub card. */
  tagline: string;
  /** Longer description shown above the runner. */
  description: string;
  /** Estimated time in minutes. */
  estimatedMinutes: number;
  /** Original instrument reference / citation. */
  citation: string;
  /** Plain text reminder that this isn't a diagnosis. */
  scopeNote: string;
  questions: AssessmentQuestion[];
  maxScore: number;
  /**
   * Single-scale interpretation bands. Tools with subscales (Lawton +
   * Katz) leave this undefined and provide `subscales` instead.
   */
  bands?: ScoreBand[];
  subscales?: AssessmentSubscale[];
  /**
   * A single item that must surface crisis resources on its own, whatever the
   * total score says.
   *
   * PHQ-9 item 9 asks about thoughts of self-harm. Someone can answer it
   * positively and still total under the threshold for a "high" band — which
   * would silently route them to a mild-symptoms message. Banding by total
   * score alone is the wrong safety model for that item, so the runner checks
   * this independently and renders crisis resources whenever the selected
   * option scores at or above `threshold` (R3.17 / TC-6.2).
   */
  criticalItem?: {
    questionId: string;
    threshold: number;
    heading: string;
    body: string;
  };
};

/**
 * Pick the interpretation band for a score. Used by the assessment
 * runner client component.
 */
export function interpretScore(
  score: number,
  bands: ScoreBand[],
): AssessmentInterpretation {
  const match = bands.find((b) => score >= b.minScore && score <= b.maxScore);
  // Shouldn't happen if bands cover the full range, but fall back gracefully.
  return match?.interpretation ?? bands[bands.length - 1].interpretation;
}

// =============================================================================
// GDS-15: Geriatric Depression Scale, Short Form
// =============================================================================
// Each question has a "depressed direction" (yes or no). If the user
// answers in that direction, score 1. Otherwise score 0. Total 0–15.

type GDSDir = "yes" | "no";

const gdsQ = (
  id: string,
  text: string,
  depressedAnswer: GDSDir,
): AssessmentQuestion => ({
  id,
  text,
  options: [
    { label: "Yes", score: depressedAnswer === "yes" ? 1 : 0 },
    { label: "No", score: depressedAnswer === "no" ? 1 : 0 },
  ],
});

export const GDS_15: Assessment = {
  slug: "gds-15",
  name: "Mood Check for Older Adults",
  shortName: "Mood Check (60+)",
  audience: "For older adults",
  tagline:
    "A short 15 question check that screens for low mood and depressive symptoms in adults over 60.",
  description:
    "A widely used screening for depressive symptoms specifically validated for older adults. There are no right or wrong answers; just answer honestly, based on how you've felt over the past week.",
  estimatedMinutes: 5,
  citation:
    "Geriatric Depression Scale, short form (Yesavage et al. 1986). Stanford GDS resources; public domain.",
  scopeNote:
    "Screening only, not a diagnosis. Talk with your physician about any score that concerns you.",
  questions: [
    gdsQ("g1", "Are you basically satisfied with your life?", "no"),
    gdsQ("g2", "Have you dropped many of your activities and interests?", "yes"),
    gdsQ("g3", "Do you feel that your life is empty?", "yes"),
    gdsQ("g4", "Do you often get bored?", "yes"),
    gdsQ("g5", "Are you in good spirits most of the time?", "no"),
    gdsQ(
      "g6",
      "Are you afraid that something bad is going to happen to you?",
      "yes",
    ),
    gdsQ("g7", "Do you feel happy most of the time?", "no"),
    gdsQ("g8", "Do you often feel helpless?", "yes"),
    gdsQ(
      "g9",
      "Do you prefer to stay at home, rather than going out and doing new things?",
      "yes",
    ),
    gdsQ(
      "g10",
      "Do you feel you have more problems with memory than most?",
      "yes",
    ),
    gdsQ("g11", "Do you think it is wonderful to be alive now?", "no"),
    gdsQ("g12", "Do you feel pretty worthless the way you are now?", "yes"),
    gdsQ("g13", "Do you feel full of energy?", "no"),
    gdsQ("g14", "Do you feel that your situation is hopeless?", "yes"),
    gdsQ(
      "g15",
      "Do you think that most people are better off than you are?",
      "yes",
    ),
  ],
  maxScore: 15,
  bands: [
    {
      minScore: 0,
      maxScore: 4,
      interpretation: {
        category: "Within the normal range",
        tone: "low",
        summary:
          "A score of 0 to 4 falls within the range generally considered normal for older adults. The screen didn't flag depressive symptoms today.",
        recommendation:
          "If something else has prompted you to take this screen, such as a change in mood, sleep, or energy, it is worth raising with your physician. Otherwise, no action is suggested from this score alone.",
      },
    },
    {
      minScore: 5,
      maxScore: 9,
      interpretation: {
        category: "Mild depressive symptoms",
        tone: "moderate",
        summary:
          "A score of 5 to 9 suggests mild depressive symptoms. This is a common pattern in later life and is worth talking about; small changes in routine, sleep, activity, and social contact can make a real difference.",
        recommendation:
          "Consider booking time with your family doctor, or reach out to us for a conversation about what's been going on. Mild symptoms often respond well to early, simple support.",
      },
    },
    {
      minScore: 10,
      maxScore: 15,
      interpretation: {
        category: "Suggestive of moderate to severe depression",
        tone: "high",
        summary:
          "A score of 10 or higher suggests moderate to severe depressive symptoms. This isn't a diagnosis, but it is a clear signal that professional support would be valuable.",
        recommendation:
          "We strongly recommend speaking with your family doctor soon. If you're having thoughts of harming yourself or feel you can't cope, please call 911 or contact the BC Mental Health Crisis Line at 310 6789 (no area code needed) right away.",
      },
    },
  ],
};

// =============================================================================
// Daily Living Assessment: Lawton IADL + Katz ADL combined
// =============================================================================
// Per question: "Yes, independently" = 1 point. Anything less = 0.

const dl3 = (
  id: string,
  text: string,
  hint?: string,
): AssessmentQuestion => ({
  id,
  text,
  hint,
  options: [
    { label: "Yes, independently", score: 1 },
    { label: "Needs some help", score: 0 },
    { label: "Cannot do at all", score: 0 },
  ],
});

const lawtonQuestions: AssessmentQuestion[] = [
  dl3(
    "iadl-1",
    "Can they use the telephone, including looking up numbers and dialling, on their own?",
  ),
  dl3(
    "iadl-2",
    "Can they manage shopping for groceries and household items on their own?",
  ),
  dl3(
    "iadl-3",
    "Can they plan, prepare, and serve adequate meals on their own?",
  ),
  dl3(
    "iadl-4",
    "Can they keep house, such as doing light cleaning, tidying, or basic maintenance, alone or with occasional help?",
  ),
  dl3(
    "iadl-5",
    "Can they do their own laundry?",
  ),
  dl3(
    "iadl-6",
    "Can they get around, whether driving, taking the bus, or arranging rides, on their own?",
  ),
  dl3(
    "iadl-7",
    "Can they manage their medications, taking the right dose at the right time, on their own?",
  ),
  dl3(
    "iadl-8",
    "Can they manage their finances, including paying bills, banking, or tracking expenses, on their own?",
  ),
];

const katzQuestions: AssessmentQuestion[] = [
  dl3(
    "adl-1",
    "Can they bathe themselves with no help (or help with only one body part)?",
  ),
  dl3(
    "adl-2",
    "Can they dress themselves, selecting clothes and putting them on, without help (except tying shoes)?",
  ),
  dl3(
    "adl-3",
    "Can they use the toilet on their own, including getting on and off, adjusting clothing, or cleaning themselves?",
  ),
  dl3(
    "adl-4",
    "Can they get in and out of bed and chairs on their own?",
  ),
  dl3(
    "adl-5",
    "Do they have complete control over their bladder and bowels?",
  ),
  dl3(
    "adl-6",
    "Can they feed themselves without help (food may be prepared by someone else)?",
  ),
];

export const DAILY_LIVING: Assessment = {
  slug: "daily-living",
  name: "Daily Living Assessment (Lawton IADL + Katz ADL)",
  shortName: "Daily Living",
  audience: "For families assessing an older parent or relative",
  tagline:
    "A 14 question functional check covering the daily tasks that matter most for staying safe at home.",
  description:
    "This assessment combines two long standing clinical tools: Lawton's Instrumental ADLs (the higher order tasks that slip first) and Katz's basic ADLs (the fundamentals that decline later). Answer for the person you're caring for. Use your best honest read; there are no wrong answers.",
  estimatedMinutes: 10,
  citation:
    "Lawton, M.P. & Brody, E.M. (1969). Assessment of older people: Self maintaining and instrumental activities of daily living. Katz, S. et al. (1963). Studies of illness in the aged. Both public domain.",
  scopeNote:
    "Screening only, not a diagnosis. Use it to start a conversation with us or with your family physician.",
  questions: [...lawtonQuestions, ...katzQuestions],
  maxScore: 14,
  subscales: [
    {
      id: "iadl",
      name: "Instrumental ADLs (Lawton)",
      description:
        "Higher order daily tasks, including managing finances, medications, transport, meals, and shopping. These slip first.",
      questionIds: lawtonQuestions.map((q) => q.id),
      maxScore: 8,
      bands: [
        {
          minScore: 0,
          maxScore: 2,
          interpretation: {
            category: "Significant IADL impairment",
            tone: "high",
            summary:
              "Most or all instrumental tasks require help. Independence at home with no support is unlikely to be sustainable.",
            recommendation:
              "Please reach out, as this is likely a candidate for Home Care or a combination of Home Care + Ageing in Place oversight. Earlier coordination keeps more options open.",
          },
        },
        {
          minScore: 3,
          maxScore: 5,
          interpretation: {
            category: "Moderate IADL impairment",
            tone: "moderate",
            summary:
              "Several instrumental tasks now need help. Without support in place, this pattern tends to escalate into more frequent crises.",
            recommendation:
              "Talk to us about Ageing in Place and how we coordinate care across the household. If physical safety tasks are also affected, Home Care may be the better fit.",
          },
        },
        {
          minScore: 6,
          maxScore: 7,
          interpretation: {
            category: "Mostly independent, with some IADL support emerging",
            tone: "moderate",
            summary:
              "One or two instrumental tasks are slipping. This is exactly the window where proactive home support tends to make the biggest difference.",
            recommendation:
              "This is a typical fit for Monarch's Ageing in Place program. A consultation can map which supports actually move the needle.",
          },
        },
        {
          minScore: 8,
          maxScore: 8,
          interpretation: {
            category: "Independent across all IADLs",
            tone: "low",
            summary:
              "All eight instrumental activities of daily living are reported as fully independent.",
            recommendation:
              "No functional flags from this scale today. Recheck periodically; IADL changes are often the first early signal.",
          },
        },
      ],
    },
    {
      id: "adl",
      name: "Basic ADLs (Katz)",
      description:
        "Fundamental self care tasks: bathing, dressing, toileting, transfers, continence, and feeding. These decline later.",
      questionIds: katzQuestions.map((q) => q.id),
      maxScore: 6,
      bands: [
        {
          minScore: 0,
          maxScore: 3,
          interpretation: {
            category: "Significant basic ADL impairment",
            tone: "high",
            summary:
              "Multiple fundamental self care tasks require help. Family caregivers carrying this load alone are at high risk of burnout.",
            recommendation:
              "Please reach out. This usually indicates Home Care, often with multi shift or 24/7 coverage, is the right shape. We'll be honest with you about whether home is still safe.",
          },
        },
        {
          minScore: 4,
          maxScore: 5,
          interpretation: {
            category: "Some basic ADL support needed",
            tone: "moderate",
            summary:
              "One or two fundamental self care tasks now need help. This is a meaningful turning point; basic ADL slips tend to indicate more than just ageing.",
            recommendation:
              "A clinical home assessment is worth scheduling. Monarch's Home Care can staff hands on support; Ageing in Place provides the planning layer.",
          },
        },
        {
          minScore: 6,
          maxScore: 6,
          interpretation: {
            category: "Independent across all basic ADLs",
            tone: "low",
            summary:
              "Bathing, dressing, toileting, transfers, continence, and feeding are all reported as fully independent.",
            recommendation:
              "No basic ADL flags today. Even with high IADL needs, full basic ADL independence usually means home is still the right base.",
          },
        },
      ],
    },
  ],
};

// =============================================================================
// Caregiver Strain Index (CSI)
// =============================================================================
// 13 yes/no questions. Each "yes" = 1 point. ≥7 indicates high strain.

const csiQ = (id: string, text: string): AssessmentQuestion => ({
  id,
  text,
  options: [
    { label: "Yes", score: 1 },
    { label: "No", score: 0 },
  ],
});

export const CAREGIVER_STRAIN: Assessment = {
  slug: "caregiver-strain",
  name: "Caregiver Strain Index (CSI)",
  shortName: "Caregiver Strain",
  audience: "For family caregivers",
  tagline:
    "13 questions about how caregiving is affecting you, not the person you care for.",
  description:
    "This screen is about you. It surfaces the kinds of strain that build quietly across weeks and months: sleep, finances, emotional reserve, work, relationships, and is worth taking even if you'd describe yourself as 'managing fine.' Most caregivers underestimate how much they're carrying.",
  estimatedMinutes: 5,
  citation:
    "Robinson, B.C. (1983). Validation of a caregiver strain index. Journal of Gerontology. Public domain.",
  scopeNote:
    "Screening only. A high score doesn't mean you're failing; it means support would help.",
  questions: [
    csiQ("csi-1", "My sleep is disturbed."),
    csiQ(
      "csi-2",
      "Caregiving is inconvenient: it takes a lot of time, or there's a long drive over to help.",
    ),
    csiQ(
      "csi-3",
      "Caregiving is physically straining: lifting, transferring, or sustained concentration.",
    ),
    csiQ(
      "csi-4",
      "Caregiving is confining: it limits my free time or prevents me from visiting others.",
    ),
    csiQ(
      "csi-5",
      "There have been family adjustments: caregiving has disrupted routines or removed privacy.",
    ),
    csiQ(
      "csi-6",
      "There have been changes in personal plans: turning down a job, missing a vacation, and similar changes.",
    ),
    csiQ(
      "csi-7",
      "There have been other competing demands on my time, from other family members.",
    ),
    csiQ(
      "csi-8",
      "There have been emotional adjustments, including arguments, because of caregiving.",
    ),
    csiQ(
      "csi-9",
      "Some of the care recipient's behaviour is upsetting: memory issues, incontinence, or accusations.",
    ),
    csiQ(
      "csi-10",
      "It is upsetting to find that the care recipient has changed so much from their former self.",
    ),
    csiQ(
      "csi-11",
      "There have been work adjustments: needing to take time off or reduce hours.",
    ),
    csiQ("csi-12", "Caregiving is a financial strain."),
    csiQ(
      "csi-13",
      "I feel completely overwhelmed by worry, or by the question of how I'll keep managing.",
    ),
  ],
  maxScore: 13,
  bands: [
    {
      minScore: 0,
      maxScore: 3,
      interpretation: {
        category: "Low strain today",
        tone: "low",
        summary:
          "You're describing relatively low caregiver strain right now. That's a real accomplishment; most family caregivers carrying long term responsibility score higher than this.",
        recommendation:
          "Keep the supports that are working. Caregiver strain often climbs gradually; recheck in a few months, or sooner if the situation changes.",
      },
    },
    {
      minScore: 4,
      maxScore: 6,
      interpretation: {
        category: "Moderate strain",
        tone: "moderate",
        summary:
          "You're carrying moderate strain. Several dimensions of life are being affected: that's a normal pattern for engaged family caregivers, and it's also a pattern that wears people down if it continues unchanged.",
        recommendation:
          "This is the right time to put coordinated support in place: Ageing in Place or Home Care depending on the household. Even a few hours a week of structured help often shifts the picture.",
      },
    },
    {
      minScore: 7,
      maxScore: 13,
      interpretation: {
        category: "High strain, caregiver support is recommended",
        tone: "high",
        summary:
          "A score of 7 or higher indicates high caregiver strain. Research consistently shows this level is associated with caregiver health decline if left unaddressed. The most useful thing you can do now is bring in support for the person you're caring for, and for you.",
        recommendation:
          "Please reach out. Monarch's Home Care includes options designed specifically to give family caregivers room to recover: overnight cover, respite shifts, or full 24/7 staffing. The first conversation is free.",
      },
    },
  ],
};

// =============================================================================
// PHQ-9 — Mood & Energy Check (Patient Health Questionnaire 9-item)
// =============================================================================
// Each question: "Over the last 2 weeks, how often have you been bothered by…"
// Options scored 0 to 3. Total 0 to 27.

const phqOptions: AssessmentOption[] = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 },
];

const phqQ = (id: string, text: string): AssessmentQuestion => ({
  id,
  text,
  options: phqOptions,
});

export const MOOD_ENERGY_CHECK: Assessment = {
  slug: "mood-energy-check",
  name: "Mood & Energy Check",
  shortName: "Mood & Energy",
  audience: "For adults",
  tagline:
    "A 9 question screen for low mood, motivation, and energy over the last two weeks.",
  // PENDING Dr. Sundren (auto-save consent): W16a (tier on; tier off unchanged).
  description: FREE_TIER_ON
    ? "The PHQ 9 is one of the most widely used screens for depressive symptoms in adults. Answer based on the past two weeks. Your answers stay on your device and are not sent to us."
    : "The PHQ 9 is one of the most widely used screens for depressive symptoms in adults. Answer based on the past two weeks. Your answers stay on your device unless you choose to share them with us.",
  estimatedMinutes: 5,
  citation:
    "Patient Health Questionnaire-9 (Spitzer, Kroenke & Williams 1999). Pfizer; public domain, free to reproduce and distribute.",
  scopeNote:
    "Screening only, not a diagnosis. If anything in your answers concerns you, please talk with your physician.",
  questions: [
    phqQ(
      "phq-1",
      "Over the last 2 weeks, have you felt little interest or pleasure in doing things?",
    ),
    phqQ(
      "phq-2",
      "Felt down, depressed, or hopeless?",
    ),
    phqQ(
      "phq-3",
      "Had trouble falling asleep, staying asleep, or sleeping too much?",
    ),
    phqQ("phq-4", "Felt tired or had little energy?"),
    phqQ("phq-5", "Had poor appetite or been overeating?"),
    phqQ(
      "phq-6",
      "Felt bad about yourself, that you're a failure, or have let yourself or your family down?",
    ),
    phqQ(
      "phq-7",
      "Had trouble concentrating on things, such as reading the newspaper or watching television?",
    ),
    phqQ(
      "phq-8",
      "Moved or spoken so slowly that other people could have noticed, or the opposite, been so fidgety or restless that you've been moving around a lot more than usual?",
    ),
    phqQ(
      "phq-9",
      "Had thoughts that you'd be better off dead, or of hurting yourself in some way?",
      // Q9 is the suicidal-ideation item. The interpretation below ramps
      // up the urgency of the recommendation if total score is moderate
      // or higher; the BC crisis line is mentioned at the top tier.
    ),
  ],
  maxScore: 27,
  criticalItem: {
    questionId: "phq-9",
    threshold: 1,
    heading: "Please read this before anything else",
    body:
      "You indicated thoughts of being better off dead, or of hurting yourself. That matters more than any score on this page, and support is available right now.",
  },
  bands: [
    {
      minScore: 0,
      maxScore: 4,
      interpretation: {
        category: "Minimal, within the normal range",
        tone: "low",
        summary:
          "A score in this range doesn't flag depressive symptoms today.",
        recommendation:
          "If you've taken this screen because something prompted you, keep paying attention to those signals, but no action is suggested from this score alone.",
      },
    },
    {
      minScore: 5,
      maxScore: 9,
      interpretation: {
        category: "Mild, worth a conversation",
        tone: "moderate",
        summary:
          "A score of 5 to 9 suggests mild depressive symptoms. This is a common pattern and often responds well to small, early adjustments: sleep, activity, social contact, and someone to talk to.",
        recommendation:
          "Worth raising with your family physician at the next visit, or with us for a conversation about what's been going on.",
      },
    },
    {
      minScore: 10,
      maxScore: 14,
      interpretation: {
        category: "Moderate, clinical support is recommended",
        tone: "moderate",
        summary:
          "A score of 10 to 14 suggests moderate depressive symptoms. This is a clear signal that professional support would likely help.",
        recommendation:
          "Please book time with your family physician soon. If you'd like to talk with us first, the consultation is free.",
      },
    },
    {
      minScore: 15,
      maxScore: 27,
      interpretation: {
        category: "Moderately severe to severe, please reach out",
        tone: "high",
        summary:
          "A score of 15 or higher indicates substantial depressive symptoms. This isn't a diagnosis, but it is a clear signal that getting clinical support soon will help.",
        recommendation:
          "Please contact your family physician or call us. If you're having thoughts of harming yourself, please call 911 or the BC Mental Health Crisis Line at 310 6789 (no area code needed) right away.",
      },
    },
  ],
};

// =============================================================================
// GAD-7 — Anxiety Check
// =============================================================================

const gadOptions: AssessmentOption[] = [
  { label: "Not at all", score: 0 },
  { label: "Several days", score: 1 },
  { label: "More than half the days", score: 2 },
  { label: "Nearly every day", score: 3 },
];

const gadQ = (id: string, text: string): AssessmentQuestion => ({
  id,
  text,
  options: gadOptions,
});

export const ANXIETY_CHECK: Assessment = {
  slug: "anxiety-check",
  name: "Anxiety Check",
  shortName: "Anxiety Check",
  audience: "For adults",
  tagline:
    "A 7 question screen for anxiety symptoms over the last two weeks.",
  // PENDING Dr. Sundren (auto-save consent): W16b (tier on; tier off unchanged).
  description: FREE_TIER_ON
    ? "The GAD 7 is a widely used screen for generalized anxiety. Answer based on the past two weeks. Your answers stay on your device and are not sent to us."
    : "The GAD 7 is a widely used screen for generalized anxiety. Answer based on the past two weeks. Your answers stay on your device unless you choose to share them with us.",
  estimatedMinutes: 4,
  citation:
    "Generalized Anxiety Disorder 7-item (Spitzer, Kroenke, Williams & Löwe 2006). Pfizer; public domain.",
  scopeNote:
    "Screening only, not a diagnosis. Talk to your physician if something here concerns you.",
  questions: [
    gadQ(
      "gad-1",
      "Over the last 2 weeks, have you felt nervous, anxious, or on edge?",
    ),
    gadQ("gad-2", "Found yourself unable to stop or control worrying?"),
    gadQ("gad-3", "Worried too much about different things?"),
    gadQ("gad-4", "Had trouble relaxing?"),
    gadQ(
      "gad-5",
      "Been so restless that it's been hard to sit still?",
    ),
    gadQ("gad-6", "Become easily annoyed or irritable?"),
    gadQ(
      "gad-7",
      "Felt afraid as if something awful might happen?",
    ),
  ],
  maxScore: 21,
  bands: [
    {
      minScore: 0,
      maxScore: 4,
      interpretation: {
        category: "Minimal anxiety",
        tone: "low",
        summary:
          "A score of 0 to 4 doesn't flag anxiety symptoms today.",
        recommendation:
          "If something specific prompted you to take this, keep paying attention, but no action is suggested from this score alone.",
      },
    },
    {
      minScore: 5,
      maxScore: 9,
      interpretation: {
        category: "Mild anxiety",
        tone: "moderate",
        summary:
          "A score of 5 to 9 suggests mild anxiety symptoms. Many people in this range benefit from small lifestyle shifts and someone to talk to.",
        recommendation:
          "Worth raising with your physician at your next visit, or starting with a conversation with us.",
      },
    },
    {
      minScore: 10,
      maxScore: 14,
      interpretation: {
        category: "Moderate anxiety",
        tone: "moderate",
        summary:
          "A score of 10 to 14 suggests moderate anxiety. This is the level where structured support tends to make a noticeable difference.",
        recommendation:
          "Please book time with your family physician soon to discuss next steps.",
      },
    },
    {
      minScore: 15,
      maxScore: 21,
      interpretation: {
        category: "Severe anxiety, please reach out",
        tone: "high",
        summary:
          "A score of 15 or higher indicates severe anxiety. This isn't a diagnosis, but it's a strong signal that clinical support would help.",
        recommendation:
          "Please contact your family physician or call us. If anxiety is making it hard to function day to day, you don't have to wait.",
      },
    },
  ],
};

// =============================================================================
// AD-8 — Memory Concerns Check (for Families)
// =============================================================================
// An *informant* screen — the FAMILY MEMBER answers about the person
// they're worried about. Eight yes/no items. ≥2 "yes" suggests
// cognitive change worth investigating.

const ad8Options: AssessmentOption[] = [
  { label: "Yes, a change", score: 1 },
  { label: "No, no change", score: 0 },
  { label: "Don't know", score: 0 },
];

const ad8Q = (id: string, text: string): AssessmentQuestion => ({
  id,
  text,
  options: ad8Options,
});

export const MEMORY_CONCERNS_CHECK: Assessment = {
  slug: "memory-concerns-check",
  name: "Memory Concerns Check (for Families)",
  shortName: "Memory Concerns",
  audience: "For families noticing changes in a loved one",
  tagline:
    "Eight short questions answered by a family member about someone they're caring for. Designed to surface early cognitive change.",
  description:
    "The AD 8 is an informant based screen, meaning you, the family member, answer about the person you're concerned about. Compare them now to the way they were a few years ago. Mark each item as a change, no change, or don't know.",
  estimatedMinutes: 4,
  citation:
    "Ascertain Dementia 8-item informant interview, AD 8 (Galvin et al. 2005). Public domain.",
  scopeNote:
    "Screening only, not a diagnosis. A positive screen is a reason to talk with a clinician, not a verdict.",
  questions: [
    ad8Q(
      "ad8-1",
      "Problems with judgment? (e.g., struggling with decisions, falling for scams, unwise financial choices)",
    ),
    ad8Q(
      "ad8-2",
      "Reduced interest in hobbies or activities they used to enjoy?",
    ),
    ad8Q(
      "ad8-3",
      "Repeats the same questions, stories, or statements?",
    ),
    ad8Q(
      "ad8-4",
      "Trouble learning how to use a tool, appliance, or gadget? (e.g., the TV remote, the microwave, a phone)",
    ),
    ad8Q("ad8-5", "Forgets the correct month or year?"),
    ad8Q(
      "ad8-6",
      "Trouble handling complicated financial matters? (e.g., paying bills, balancing the chequebook, taxes)",
    ),
    ad8Q(
      "ad8-7",
      "Trouble remembering scheduled appointments?",
    ),
    ad8Q(
      "ad8-8",
      "Consistent, daily problems with thinking and/or memory?",
    ),
  ],
  maxScore: 8,
  bands: [
    {
      minScore: 0,
      maxScore: 1,
      interpretation: {
        category: "Likely within the normal range",
        tone: "low",
        summary:
          "Zero or one change reported. This is below the threshold most clinicians use to investigate further.",
        recommendation:
          "Retake this any time you notice new changes. Mild forgetfulness alone (without functional impact) is common with age.",
      },
    },
    {
      minScore: 2,
      maxScore: 4,
      interpretation: {
        category: "Worth investigating, early signs",
        tone: "moderate",
        summary:
          "Two to four reported changes suggests early cognitive change worth a clinical conversation. The AD 8 is sensitive, it picks up shifts before they become obvious.",
        recommendation:
          "Talk to your loved one's family doctor about a formal cognitive assessment. We can also help coordinate the conversation, many families find it easier to raise these things through us first.",
      },
    },
    {
      minScore: 5,
      maxScore: 8,
      interpretation: {
        category: "Significant changes, please reach out",
        tone: "high",
        summary:
          "Five or more changes reported. At this level, getting a proper clinical assessment and putting structured support in place tends to change outcomes meaningfully.",
        recommendation:
          "Please contact your loved one's family doctor as soon as possible for a cognitive assessment. We're also a good first call: Monarch's Ageing in Place and Home Care programs are designed for exactly this stage.",
      },
    },
  ],
};

// =============================================================================
// "Is in home care right for us?" — Monarch decision aid
// =============================================================================
// Not a clinical instrument. Asks 7 questions and recommends one of
// the three Monarch service lines (or "not yet"). Tones are kept to
// "low" / "moderate" only — never "high" — because the result is a
// service recommendation, not a clinical warning.

const fitOption = (label: string, score: number): AssessmentOption => ({
  label,
  score,
});

const fitQuestions: AssessmentQuestion[] = [
  {
    id: "fit-1",
    text: "Who is care being considered for?",
    options: [
      fitOption("An older parent or relative", 2),
      fitOption("My spouse / partner", 2),
      fitOption("Myself (I'm over 60)", 2),
      fitOption("Myself (I'm a busy adult / executive)", 5),
    ],
  },
  {
    id: "fit-2",
    text: "What's the main reason you're looking?",
    hint: "Pick the closest match, most households are a mix.",
    options: [
      fitOption(
        "Getting ahead of changes: preventive, proactive care",
        1,
      ),
      fitOption(
        "Daily help is needed (meals, mobility, companionship)",
        4,
      ),
      fitOption(
        "Recent hospital discharge or new diagnosis",
        3,
      ),
      fitOption("Dementia or memory care", 4),
      fitOption("Preventive medicine, executive physicals", 5),
    ],
  },
  {
    id: "fit-3",
    text: "How much help with daily living tasks is needed?",
    options: [
      fitOption("None, fully independent", 1),
      fitOption("Some help with errands, meds, transport", 2),
      fitOption("Daily help with personal care (bathing, dressing)", 4),
      fitOption("Round the clock support", 4),
    ],
  },
  {
    id: "fit-4",
    text: "Is dementia or significant memory change part of the picture?",
    options: [
      fitOption("Yes, dementia is diagnosed or strongly suspected", 4),
      fitOption("Some changes, but not formally assessed", 2),
      fitOption("No", 1),
    ],
  },
  {
    id: "fit-5",
    text: "How often would you like a clinician involved?",
    options: [
      fitOption("Monthly or quarterly check ins", 1),
      fitOption("Weekly or more, active oversight", 3),
      fitOption("Just once a year, annual review", 5),
    ],
  },
  {
    id: "fit-6",
    text: "Where will the work mostly happen?",
    options: [
      fitOption("In the home, that's the point", 2),
      fitOption("At the home or my office, whichever is easier", 5),
      fitOption("Not sure yet", 2),
    ],
  },
  {
    id: "fit-7",
    text: "How would you describe your timeline?",
    options: [
      fitOption("Exploring, no rush", 1),
      fitOption("Want something in place in the next month", 2),
      fitOption("Crisis or near crisis, needed soon", 4),
    ],
  },
];

export const IN_HOME_CARE_FIT: Assessment = {
  slug: "in-home-care-fit",
  name: "Is in home care right for us?",
  shortName: "In home care fit",
  audience: "For anyone considering home based care",
  tagline:
    "Seven quick questions that map your situation to one of Monarch's three service lines.",
  description:
    "Not a clinical screen: a planning aid. The questions help us point you toward the most likely fit (Ageing in Place, Executive Health, or Home Care) and give you a starting vocabulary for the conversation.",
  estimatedMinutes: 3,
  citation: "Monarch Health internal decision aid.",
  scopeNote:
    "This recommends a starting point, not a diagnosis or treatment plan. The real fit gets decided in conversation.",
  questions: fitQuestions,
  maxScore: fitQuestions.reduce(
    (acc, q) => acc + Math.max(...q.options.map((o) => o.score)),
    0,
  ),
  bands: [
    {
      minScore: 0,
      maxScore: 9,
      interpretation: {
        category: "Probably not yet, keep watching",
        tone: "low",
        summary:
          "Your answers suggest you're in an exploratory stage rather than at a clear point of need. Most of what you'd buy today isn't yet what you need.",
        recommendation:
          "If things change, we're a free phone call away. In the meantime, our Journal and the assessment tools on this page are designed for households just like yours.",
      },
    },
    {
      minScore: 10,
      maxScore: 16,
      interpretation: {
        category: "Monarch Ageing in Place is likely the right fit",
        tone: "moderate",
        summary:
          "Your situation lines up with Monarch's Ageing in Place program, offering clinical home support that is proactive rather than crisis driven, with monthly or quarterly visits and one coordinator for the family.",
        recommendation:
          "Have a look at the Ageing in Place page for the full picture. A consultation is the next step, where we will be honest with you about whether this is actually the right shape.",
      },
    },
    {
      minScore: 17,
      maxScore: 22,
      interpretation: {
        category: "Monarch Home Care is likely the right fit",
        tone: "moderate",
        summary:
          "Your answers point toward hands on Home Care, providing daily living support, possibly with dementia informed care or overnight / 24/7 coverage. Monarch's clinical layer (physician + nurse oversight) wraps around the caregiving team.",
        recommendation:
          "See the Home Care page for the staffing model and overnight options. The first conversation is free and the most useful thing is for us to understand the household first.",
      },
    },
    {
      minScore: 23,
      maxScore: 100,
      interpretation: {
        category: "Monarch Executive Health is likely the right fit",
        tone: "moderate",
        summary:
          "Your situation matches Monarch's Executive Health membership, which provides preventive care for executives, founders, and busy professionals.",
        recommendation:
          "Read the Executive Health page for what's included. The annual review can happen at your office, in your home, or at our Victoria clinic, based on your preference.",
      },
    },
  ],
};

// =============================================================================
// Aggregate
// =============================================================================

export const ASSESSMENTS: Record<AssessmentSlug, Assessment> = {
  "gds-15": GDS_15,
  "daily-living": DAILY_LIVING,
  "caregiver-strain": CAREGIVER_STRAIN,
  "mood-energy-check": MOOD_ENERGY_CHECK,
  "anxiety-check": ANXIETY_CHECK,
  "memory-concerns-check": MEMORY_CONCERNS_CHECK,
  "in-home-care-fit": IN_HOME_CARE_FIT,
};

/**
 * Validated clinical screens — public domain, scored against
 * published interpretation bands.
 */
export const VALIDATED_TOOLS: Assessment[] = [
  GDS_15,
  MOOD_ENERGY_CHECK,
  ANXIETY_CHECK,
  MEMORY_CONCERNS_CHECK,
  DAILY_LIVING,
  CAREGIVER_STRAIN,
];

/**
 * Monarch-branded decision aids — internal recommendations, not
 * clinical screens. Tones never escalate to "high".
 */
export const MONARCH_GUIDES: Assessment[] = [IN_HOME_CARE_FIT];

export const ASSESSMENT_LIST: Assessment[] = [
  ...VALIDATED_TOOLS,
  ...MONARCH_GUIDES,
];

export const ASSESSMENT_SLUGS: AssessmentSlug[] = ASSESSMENT_LIST.map(
  (a) => a.slug,
);

/**
 * Hub page intro copy. Kept here so editing reads naturally alongside
 * the assessment data.
 */
export const RESOURCES_INTRO = {
  hero: {
    eyebrow: "Resources",
    title: "Tools that help you start the conversation.",
    description:
      "A small set of validated, public domain screening tools, designed to help families and seniors recognize patterns early, without needing a clinical appointment to start.",
  },
  /*
   * With the free tier on, a signed-out result is kept on the device for
   * the visit, so "never stored" would no longer be true (design 6.4, Gate
   * 2). One string for signed in and signed out. With the tier off, today's
   * wording stands (c.137). PLACEHOLDER (OQ-17): for Dr. Sundren's review.
   */
  disclaimer: FREE_TIER_ON
    ? // PENDING Dr. Sundren (auto-save consent): W7a.
      "Every tool here is a screening instrument, not a diagnosis. Your answers stay on this device. So does your result, unless you are signed in to a free account: then it is saved to your account automatically, and you can remove it. If anything you see concerns you, please talk it through with your family physician or with us."
    : "Every tool here is a screening instrument, not a diagnosis. Your answers stay in your browser - they are never sent to Monarch Health and never stored. If anything you see concerns you, please talk it through with your family physician or with us.",
};

/**
 * The four things under Healthspan Tools, each with its own page from
 * 19 Sep 2026. Defined here so the menu, the hub and each page's "where to
 * go next" all read from one list and cannot drift apart.
 */
export type ToolSection = {
  slug: string;
  label: string;
  href: string;
  /** Menu line, under 55 characters. */
  menuLine: string;
  /** One sentence, for the hub card. */
  summary: string;
};

export const TOOL_SECTIONS: ToolSection[] = [
  {
    slug: "self-assessments",
    label: "Self-assessment tools",
    href: "/resources/self-assessments",
    menuLine: "Established checks that score in your browser.",
    // Tier on and off, as the disclaimer above (design 6.4).
    summary: FREE_TIER_ON
      ? // PENDING Dr. Sundren (auto-save consent): W7b.
        "Established, publicly available screening checks. Each runs in your browser and scores instantly. Your answers are never sent to us; if you are signed in to a free account, your result is saved to it."
      : "Established, publicly available screening checks. Each runs in your browser, scores instantly, and sends nothing to us.",
  },
  {
    slug: "guides",
    label: "Monarch guides",
    href: "/resources/guides",
    menuLine: "Plain-language guides written by us.",
    summary:
      "Written here rather than borrowed. Practical aids for the moments families get stuck, and not clinical instruments.",
  },
  {
    slug: "forms",
    label: "Forms & applications",
    href: "/resources/forms",
    menuLine: "The BC and Canadian paperwork, in one place.",
    summary:
      "Direct links to the official BC and Canadian forms and applications families most often need, with what each one is for.",
  },
  {
    slug: "library",
    label: "Resource library",
    href: "/resources/library",
    menuLine: "Organizations worth knowing about, in BC.",
    summary:
      "Organizations and services across British Columbia, most of them free and publicly funded, with a note on why we trust each.",
  },
];

export type OfficialForm = {
  title: string;
  description: string;
  href: string;
  /**
   * What the reader is actually doing with it. Added 19 Sep 2026 so the
   * forms page can group them: an application you submit and wait on is a
   * different errand from an order a physician signs, and both differ from
   * something you sit down and read.
   */
  kind: "application" | "form" | "guide";
};

export const OFFICIAL_FORMS: OfficialForm[] = [
  {
    title: "CRA Disability Tax Credit Certificate (Form T2201)",
    kind: "application",
    description: "Apply for the federal disability tax credit (DTC) to help reduce income tax for individuals with severe and prolonged impairments.",
    href: "https://www.canada.ca/content/dam/cra-arc/formspubs/pbg/t2201/t2201-23e.pdf",
  },
  {
    title: "BC HLTH 302: No CPR Medical Order",
    kind: "form",
    description: "An official medical order completed by a doctor or nurse practitioner instructing healthcare providers and first responders not to initiate CPR.",
    href: "https://www2.gov.bc.ca/assets/gov/health/forms/302fil.pdf",
  },
  {
    title: "SPARC BC Parking Permit Application",
    kind: "application",
    description: "Apply for an accessible parking permit for individuals with mobility limitations that meet SPARC BC criteria.",
    href: "https://www.sparc.bc.ca/wp-content/uploads/2025/01/2025-SPARC-Permit-Application_Fillable.pdf",
  },
  {
    title: "Island Health MOST Form (Scope of Treatment)",
    kind: "form",
    description: "An Island Health medical order that outlines the specific level of medical intervention and treatment goals a patient wishes to receive.",
    href: "https://www.islandhealth.ca/sites/default/files/MOST/documents/most-form.pdf",
  },
  {
    title: "BC HLTH 1632: Request for Medical Assistance in Dying (MAiD)",
    kind: "form",
    description: "The official form to submit a written request for medical assistance in dying in British Columbia.",
    href: "https://www2.gov.bc.ca/assets/gov/health/forms/1632fil.pdf",
  },
  {
    title: "BC My Voice: Advance Care Planning Guide",
    kind: "guide",
    description: "A comprehensive guide from the BC Government to help you think about, discuss, and document your future healthcare wishes.",
    href: "https://www2.gov.bc.ca/assets/gov/people/seniors/health-safety/pdf/myvoice-advancecareplanningguide.pdf",
  },
  {
    title: "BC HLTH 3987: Notification of Expected Death in the Home",
    kind: "form",
    description: "Completed in advance to allow transfer of the deceased from home without requiring an emergency call or immediate professional pronouncement.",
    href: "https://www2.gov.bc.ca/assets/gov/health/forms/3987fil.pdf",
  },
  {
    title: "BC HLTH 349: Palliative Care Benefits Registration",
    kind: "application",
    description: "Completed by a physician or nurse practitioner to register an eligible patient for the BC Palliative Care Benefits program.",
    href: "https://www2.gov.bc.ca/assets/gov/health/forms/349fil.pdf",
  },
];
