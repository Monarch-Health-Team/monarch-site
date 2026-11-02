/**
 * Research — how Monarch reads evidence, and the six things the Research tab
 * holds. Approved 18 Sep 2026 after a survey of academic centres, evidence
 * institutions and the prominent voices in healthspan.
 *
 * The section is built on one discipline: keep our own writing (Insights),
 * our reading of other people's research (Evidence briefs, In the headlines,
 * Where we stand) and other people's resources (The wider library) visibly
 * separate, and put the same strength vocabulary on every claim.
 *
 * DRAFT COPY. The vocabulary, the brief template and the glossary are
 * methodological and can stand. Every position in WHERE_WE_STAND is a
 * clinical statement and needs a named clinician's sign-off before it is
 * anything other than a draft; the three seeded here restate positions the
 * healthspan hub already takes. Briefs and headlines start empty by design —
 * the pages say so rather than showing filler.
 */

import type { NavLink } from "@/lib/nav";

/**
 * The strength vocabulary. Five phrases, and only these five, on every claim
 * the Research section discusses. Mirrors the way NICE encodes strength in
 * verbs and GRADE in certainty, translated into plain words.
 */
export type StrengthKey =
  | "strong"
  | "promising"
  | "mixed"
  | "insufficient"
  | "not-offered";

export type Strength = {
  key: StrengthKey;
  label: string;
  meaning: string;
  /** Badge tone in components/primitives. Always paired with the word. */
  tone: "success" | "info" | "warning" | "neutral" | "error";
};

export const STRENGTH: Record<StrengthKey, Strength> = {
  strong: {
    key: "strong",
    label: "Strong and consistent",
    meaning:
      "Several good studies, in people, pointing the same way, with an effect large enough to matter to a person rather than a spreadsheet.",
    tone: "success",
  },
  promising: {
    key: "promising",
    label: "Promising but early",
    meaning:
      "Real signal, but from small studies, short follow-up, animal work or a single trial that has not yet been repeated.",
    tone: "info",
  },
  mixed: {
    key: "mixed",
    label: "Mixed",
    meaning:
      "Good studies disagree, or the effect appears in some groups and not others. Honest answer: it depends, and we say on what.",
    tone: "warning",
  },
  insufficient: {
    key: "insufficient",
    label: "Insufficient",
    meaning:
      "Too little research in people to say either way. Not the same as evidence of no effect; it means nobody has properly looked yet.",
    tone: "neutral",
  },
  "not-offered": {
    key: "not-offered",
    label: "Not something we offer",
    meaning:
      "We have looked, and either the evidence is against it or the risk is not justified by what it might do. We say which.",
    tone: "error",
  },
};

export const STRENGTH_LIST: Strength[] = Object.values(STRENGTH);

/** Study types, stated alongside every strength label. */
export const STUDY_TYPES = [
  "Randomized trial",
  "Cohort study",
  "Systematic review",
  "Animal or laboratory study",
  "Expert opinion",
] as const;

/**
 * The evidence brief template. Fixed headings, after the Cochrane
 * plain-language summary, so every brief can be read the same way and the
 * limitations are never optional.
 */
export const BRIEF_TEMPLATE = [
  {
    heading: "Key messages",
    note: "Two or three sentences a reader could repeat to a friend.",
  },
  {
    heading: "What we wanted to find out",
    note: "The question in plain words, and who it applies to.",
  },
  {
    heading: "What the research did",
    note: "Study type, how many people, for how long, compared with what.",
  },
  {
    heading: "What it found",
    note: "In absolute terms - how many people out of a hundred - never only as a percentage change.",
  },
  {
    heading: "Where the evidence is weak",
    note: "Always present. Small numbers, short follow-up, surrogate measures, who funded it.",
  },
  {
    heading: "How current this is",
    note: "When the literature was last searched, and when we last checked.",
  },
  {
    heading: "The bottom line",
    note: "One strength label, the study type, and what, if anything, it changes here.",
  },
] as const;

/**
 * Five questions to ask of any health claim. Lives here because it is used by
 * the page about Harvard's course on evaluating claims, and because it is the
 * practical companion to STRENGTH.
 */
export const EVIDENCE_QUESTIONS = [
  {
    q: "What kind of study was it?",
    a: "A trial that assigned people at random can show cause. A study that followed people who chose their own habits can show association, and people who do one healthy thing tend to do several. Work in mice or in cells says something may be worth testing in people; it does not say it works in people.",
  },
  {
    q: "How big was the effect, in people out of a hundred?",
    a: "A 40 percent reduction can mean going from five people in a hundred to three. Ask for the absolute numbers. If they are not given, that is usually why.",
  },
  {
    q: "Did it measure the thing that matters, or something standing in for it?",
    a: "Lowering a blood marker, shrinking a lesion on a scan or improving a score is not the same as fewer heart attacks, better memory or more years independent. Several large trials have moved the marker and not the outcome.",
  },
  {
    q: "Who paid, and who benefits?",
    a: "Not a reason to dismiss a study, but a reason to read the methods more carefully and to look for someone independent finding the same thing.",
  },
  {
    q: "Has anyone found it twice?",
    a: "One study is a data point. A finding that has been repeated by a different group, in different people, is a result. Most of what makes the news is still at the first stage.",
  },
] as const;

/** The six entries of the Research tab, in menu order. */
/** Menu copy: one line at menu width, under 50 characters. */
export const RESEARCH_SECTIONS: (NavLink & { menuLine: string })[] = [
  {
    label: "Insights",
    menuLine: "Our own writing, with author, reviewer and date.",
    href: "/journal",
    description:
      "What we have written ourselves, each piece with its author, its clinical reviewer and its date.",
  },
  {
    label: "Evidence briefs",
    menuLine: "One-page readings of the strongest research.",
    href: "/research/evidence-briefs",
    description:
      "One-page readings of the strongest reviews on a question, under fixed headings, ending in a bottom line.",
  },
  {
    label: "In the headlines",
    menuLine: "One news claim a month, against the research.",
    href: "/research/in-the-headlines",
    description:
      "One health claim from the news each month, and what the research actually says about it.",
  },
  // "Where we stand" hidden 1 Oct 2026 (pre-launch gating): its positions
  // are still drafts awaiting clinician sign-off. The page itself is
  // untouched and noindex; see docs/changes/pre-launch-gating/notes.md.
  {
    label: "Questions we are asked",
    menuLine: "What people ask us, answered in public.",
    href: "/research/questions",
    description:
      "The questions that come up most, answered plainly, with how strong the evidence behind each answer is.",
  },
  {
    label: "The wider library",
    menuLine: "Reading we trust, from outside Monarch.",
    href: "/resources/library",
    description: "Reading and organizations we trust, from outside Monarch.",
  },
];

/**
 * Questions we are asked.
 *
 * The answered set is deliberately limited to questions about how the
 * practice works. Those are answerable without a clinician and they restate
 * what the compliance notices and the membership pages already say. Every
 * clinical question waits for a clinician to answer it, and is listed by
 * name in the meantime so nobody thinks we are avoiding it.
 */
export type AskedQuestion = {
  slug: string;
  q: string;
  a: string;
  /** "practice" answers can stand; "clinical" ones need a clinician. */
  kind: "practice";
};

export const QUESTIONS_ANSWERED: AskedQuestion[] = [
  {
    slug: "msp",
    kind: "practice",
    q: "Does a membership replace my coverage under the provincial plan?",
    a: "No, and it cannot. Memberships cover uninsured services only. Anything covered by the BC Medical Services Plan continues to be billed to it, and access to insured physician services never depends on joining anything. A membership does not give faster access to publicly insured tests, imaging or specialist referrals either. The full wording is in the notices at the foot of every page, and you get a written record of what your membership includes before anything begins.",
  },
  {
    slug: "family-doctor",
    kind: "practice",
    q: "Do I have to leave my family doctor?",
    a: "No. A good deal of what we do sits alongside a family practice rather than replacing it, and for people who already have a family doctor the usual arrangement is that we work with them. If you do not have one, we should talk about what that means in practice, because a membership is not a substitute for primary care and we would rather say so plainly than let you find out later.",
  },
  {
    slug: "when-to-start",
    kind: "practice",
    q: "Am I too young, or too old, for this to be worth it?",
    a: "The honest answer is that the two ends are worth it for different reasons. Earlier, most of what shortens healthy life is still silent and the range of things that can be done about it is at its widest. Later, the work shifts toward holding function and independence, which is measurable and responds to being worked on well into the eighties. What changes with age is which of the twelve topics matter most, not whether the exercise is worth doing.",
  },
];

export const QUESTIONS_IN_PREPARATION = [
  "What does an assessment actually involve?",
  "Which tests do you run, and why those?",
  "How often should someone be reassessed?",
  "What do you do about a result that turns out to be nothing?",
  "Is there any point in testing if I feel fine?",
  "What do you make of the at-home blood-test services?",
  "Should I be tracking anything with a watch or a monitor?",
  "What would you want to know about my family history?",
] as const;

/**
 * Where we stand. Each is a clinical position and carries a strength label,
 * a study-type note and the date it was last reviewed.
 *
 * The three below restate what the healthspan hub already says. Everything
 * in POSITIONS_IN_PREPARATION is named so readers know it is coming, and
 * carries no position until a clinician has written one.
 */
export type Position = {
  slug: string;
  claim: string;
  strength: StrengthKey;
  basis: string;
  statement: string;
  reviewed: string;
};

export const POSITIONS: Position[] = [
  {
    slug: "single-number",
    claim: "A single number can tell you how well you are ageing",
    strength: "not-offered",
    basis: "Expert opinion and validation studies",
    statement:
      "No single score captures how well a person is ageing, and we do not publish one. Ageing shows up differently in the heart, the brain, the muscles and the mind, and a number that averages them hides exactly the thing that needs attention. We measure each area on its own and show you each.",
    reviewed: "2026-09-18",
  },
  {
    slug: "biological-age",
    claim: "Biological-age tests tell you how old your body really is",
    strength: "promising",
    basis: "Cohort studies; few randomized trials",
    statement:
      "The clocks built on DNA methylation are a genuine research advance and track with health in large groups. In one person, on one day, they are not yet reliable enough to base a decision on, and the same sample can return different ages from different clocks. Interesting to follow; not something we use to guide care.",
    reviewed: "2026-09-18",
  },
  {
    slug: "reversing-ageing",
    claim: "Ageing can be reversed",
    strength: "not-offered",
    basis: "Animal and laboratory studies",
    statement:
      "Nothing available today reverses ageing in people. Some of the laboratory work is real and some of it may one day matter. A service telling you otherwise is selling something. What is well supported is narrower and more useful: several things that shorten healthy life are measurable early, and several of them respond to being acted on.",
    reviewed: "2026-09-18",
  },
];

export const POSITIONS_IN_PREPARATION = [
  "Supplements marketed for longevity",
  "Peptides",
  "Rapamycin",
  "Metformin in people without diabetes",
  "NAD+ and its precursors",
  "Continuous glucose monitors for people without diabetes",
  "Whole-body MRI as screening",
  "Multi-cancer early detection blood tests",
] as const;

/**
 * The glossary. Terms a reader meets on this site and in the news, in the
 * order someone would need them: the words we use, then the words research
 * uses, then the words the market uses.
 */
export type GlossaryEntry = {
  term: string;
  definition: string;
  why: string;
};

export const GLOSSARY: { group: string; entries: GlossaryEntry[] }[] = [
  {
    group: "The words we use",
    entries: [
      {
        term: "Healthspan",
        definition:
          "How long you remain healthy, capable and independent, as distinct from how long you live.",
        why: "It is the thing this practice exists to extend, and the reason we measure function and not only disease.",
      },
      {
        term: "Lifespan",
        definition: "How long you live.",
        why: "Lifespan has lengthened for decades. Healthspan has not kept pace, and the gap between them is where most of the difficulty of later life sits.",
      },
      {
        term: "Functional reserve",
        definition:
          "The capacity you hold above what daily life demands: strength, balance, stamina, and the ability to recover.",
        why: "An illness, a fall or an operation draws reserve down. How much you had beforehand largely decides what happens afterwards.",
      },
      {
        term: "Frailty",
        definition:
          "A state of reduced reserve across several systems at once, so that a small setback has a large effect.",
        why: "It is measurable years before it changes what someone can do, and much of it is preventable.",
      },
      {
        term: "Cognitive reserve",
        definition:
          "The brain's ability to keep working well despite age or damage, built up over a lifetime of education, work, activity and social contact.",
        why: "It is why two people with similar changes on a brain scan can function very differently.",
      },
      {
        term: "VO₂ max",
        definition:
          "The most oxygen your body can use during hard effort; a measure of cardiorespiratory fitness.",
        why: "It is one of the better predictors of how long and how well people live, and it can be trained at any age.",
      },
      {
        term: "Polypharmacy",
        definition: "Taking several medicines at once, usually five or more.",
        why: "Common past sixty-five, rarely reviewed as a whole, and a frequent cause of falls, confusion and fatigue that gets blamed on age.",
      },
    ],
  },
  {
    group: "The words research uses",
    entries: [
      {
        term: "Randomized controlled trial",
        definition:
          "People are assigned by chance to receive a treatment or a comparison, so that the groups differ only in the treatment.",
        why: "The most reliable way to find out whether something works. Most claims in this field have never been through one.",
      },
      {
        term: "Cohort study",
        definition:
          "A group of people is followed over time and their habits or exposures compared with what happens to them.",
        why: "Good for spotting associations over decades; weak at proving cause, because people who do one healthy thing tend to do several.",
      },
      {
        term: "Systematic review and meta-analysis",
        definition:
          "A structured search for every study on a question, with the results combined where that is sensible.",
        why: "This is where our evidence briefs start. One study is a data point; a review is a body of evidence.",
      },
      {
        term: "Absolute and relative risk",
        definition:
          "Relative risk is the percentage change; absolute risk is how many people out of a hundred are actually affected.",
        why: "A 50 percent reduction sounds large and may mean two people in a hundred instead of four. We always give the absolute figure.",
      },
      {
        term: "Effect size",
        definition: "How big a difference the treatment made, not only whether it made one.",
        why: "A result can be statistically real and too small to matter to anyone.",
      },
      {
        term: "Statistical versus clinical significance",
        definition:
          "Statistical significance means the result is unlikely to be chance. Clinical significance means it is big enough to matter to a person.",
        why: "Headlines report the first. Decisions should rest on the second.",
      },
      {
        term: "Surrogate endpoint",
        definition:
          "A measurement that stands in for the outcome you care about: a blood marker instead of a heart attack, a scan instead of memory.",
        why: "Useful and often misleading. Several large trials have moved the marker and not the outcome.",
      },
      {
        term: "Preprint",
        definition: "A study published before other scientists have reviewed it.",
        why: "Fast, and unfiltered. We read them; we do not change practice on them.",
      },
      {
        term: "Conflict of interest",
        definition:
          "When the people running or reporting a study stand to gain from a particular result.",
        why: "Not a reason to dismiss a study, but a reason to read the methods more carefully and to look for independent confirmation.",
      },
    ],
  },
  {
    group: "The words the market uses",
    entries: [
      {
        term: "Biomarker",
        definition: "Anything measurable in the body that indicates a state or a risk: blood pressure, cholesterol, a gene, a scan.",
        why: "Everything we track is a biomarker. The question is always whether changing it changes what happens to you.",
      },
      {
        term: "Biological age", // lint-content-ok — a glossary entry explaining the term and why we do not use it to guide care; no score is shown or implied
        definition:
          "An estimate of how old the body is, usually from patterns of DNA methylation, as against age in years.",
        why: "A real research tool; not yet reliable enough in one person to guide a decision. See Where we stand.",
      },
      {
        term: "Hallmarks of ageing",
        definition:
          "A list of the cellular processes that change with age, twelve in the current version, from DNA damage to chronic inflammation.",
        why: "A useful map of the biology, and the source of most of the mechanisms marketed as longevity treatments. A mechanism is not a treatment.",
      },
      {
        term: "Longevity medicine",
        definition:
          "Care aimed at extending healthy life, with a wide range of evidence behind the things offered under the name.",
        why: "Some of it is prevention with strong evidence. Some of it is not. The strength label is how we tell you which.",
      },
    ],
  },
];
