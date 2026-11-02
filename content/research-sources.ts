/**
 * The bodies whose work this practice reads.
 *
 * Ten pages, each about something a named institution published, and what it
 * changes here. Approved 19 Sep 2026: the client asked for the Research tab
 * to carry the names that carry weight in healthspan.
 *
 * TWO RULES, and they are not negotiable.
 *
 *  1. A page is about what the body PUBLISHED, never about Monarch's
 *     relationship with it. There is no relationship. Every page carries
 *     `noAffiliation` verbatim, because CPSBC §2.12 and the advertising
 *     rules do not permit implying an endorsement, and because it is true.
 *  2. The finding is reported as the body reported it. Where we add our own
 *     reading it sits under "What this changes here" and is labelled as ours.
 *
 * DRAFT. The lists and dates below are drawn from the published sources cited
 * on each entry and need a clinician's check before launch — particularly the
 * dementia risk factors, which are the most consequential and the most often
 * misquoted.
 */

import type { FocusAreaSlug } from "@/content/healthspan";

export const NO_AFFILIATION =
  "Monarch Health has no affiliation with this organization and it has not reviewed or endorsed anything on this page. We link to its work because we read it.";

export type EvidenceSource = {
  slug: string;
  /** Page heading. Carries the name. */
  title: string;
  /** Menu label. Shorter, still carries the name. */
  menuLabel: string;
  /** Menu line, under 60 characters. */
  menuLine: string;
  /** Who published it. */
  institution: string;
  /** What it is and when, one line, under the heading. */
  what: string;
  /** The opening. About the work, not about us. */
  lead: string;
  /** The finding itself, where it is a list. */
  list?: { caption: string; items: string[] };
  /** Our reading. Always labelled as ours. */
  here: string;
  /** Where to read the original. */
  source: { label: string; href: string };
  /** Topics this bears on. */
  topics: FocusAreaSlug[];
};

export const EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    slug: "lancet-dementia-risk",
    title: "The Lancet on dementia risk",
    menuLabel: "The Lancet on dementia risk",
    menuLine: "Fourteen risks, and which of them you can change.",
    institution: "The Lancet Commission on dementia prevention, intervention and care",
    what: "Standing commission, most recently reported in 2024.",
    lead:
      "Every few years a standing commission of dementia researchers reviews the evidence and publishes the list of risk factors that are modifiable - the ones a person, or a health service, could in principle do something about. The 2024 report names fourteen, and estimates that acting on all of them across a population could prevent or delay a large share of cases. That is a population estimate rather than a promise to any individual, and the commission is careful to say so.",
    list: {
      caption: "The fourteen, as the 2024 report names them",
      items: [
        "Less education in early life",
        "Hearing loss",
        "High LDL cholesterol",
        "Depression",
        "Traumatic brain injury",
        "Physical inactivity",
        "Diabetes",
        "Smoking",
        "High blood pressure",
        "Obesity",
        "Excessive alcohol",
        "Social isolation",
        "Air pollution",
        "Untreated vision loss",
      ],
    },
    here:
      "This list is the single clearest argument for the way we organize our topics. Four of the fourteen - hearing, vision, social isolation and depression - are the ones a service menu usually leaves out, and they are why Hearing, Vision & the Senses, Connection & Purpose, and Mood, Stress & Mental Health are topics here rather than footnotes. The rest sit inside cardiovascular and metabolic care, which is the same work seen from another angle.",
    source: {
      label: "The Lancet Commission, 2024 report",
      href: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(24)01296-0/fulltext",
    },
    topics: [
      "brain-cognitive-health",
      "hearing-vision-senses",
      "connection-purpose",
      "mood-stress-mental-health",
      "cardio-respiratory-health",
    ],
  },
  {
    slug: "who-healthy-ageing",
    title: "The World Health Organization on healthy ageing",
    menuLabel: "WHO on healthy ageing",
    menuLine: "Five capacities, and why function is the measure.",
    institution: "World Health Organization",
    what: "Its healthy ageing framework, in guidance since 2017.",
    lead:
      "The WHO defines healthy ageing not as the absence of disease but as keeping the ability to do the things you value. It measures that through five capacities which together describe what a person can actually do. The framework matters because it moved the question from what someone has been diagnosed with to what they are still able to do, which are not the same thing and often diverge - a person with three diagnoses may be walking, cooking and seeing friends, and a person with none may not be.",
    list: {
      caption: "The five capacities it measures",
      items: [
        "Locomotion - walking, balance, getting about",
        "Vitality - nutrition and energy",
        "Cognition - memory and thinking",
        "Psychological - mood and outlook",
        "Sensory - hearing and vision",
      ],
    },
    here:
      "This is the framework behind our functional assessments. It is also the reason we measure the senses and mood alongside strength and memory rather than treating them as someone else's department. Our twelve topics are a longer list than the WHO's five, because ours include the risks to prevent as well as the capacities to keep, but the five sit inside them.",
    source: {
      label: "WHO, Healthy Ageing and integrated care for older people",
      href: "https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing/ageing-and-health",
    },
    topics: [
      "functional-reserve",
      "hearing-vision-senses",
      "brain-cognitive-health",
      "mood-stress-mental-health",
      "nutrition",
    ],
  },
  {
    slug: "stanford-new-map-of-life",
    title: "Stanford's New Map of Life",
    menuLabel: "Stanford's New Map of Life",
    menuLine: "Ten principles for a hundred-year life.",
    institution: "Stanford Center on Longevity",
    what: "A program of work begun in 2021, still running.",
    lead:
      "Stanford's centre on longevity started from an observation rather than a treatment: many people alive today will live to a hundred, and almost every institution around them - school, career, retirement, housing - was designed for a life about thirty years shorter. Its New Map of Life sets out ten principles for what has to change. Most are social rather than medical, and one of them is the argument this practice exists to make.",
    list: {
      caption: "The ten principles",
      items: [
        "Make the most of the hundred-year opportunity",
        "Invest in future centenarians",
        "Align healthspans to lifespans",
        "Prepare to be amazed by the future of ageing",
        "Life transitions are a feature, not a bug",
        "Learn throughout life",
        "Work more years, with more flexibility",
        "Build financial security from the start",
        "Age diversity is a net positive",
        "Build longevity-ready communities",
      ],
    },
    here:
      "The third principle is our whole thesis in four words. The others are a useful corrective to a field that talks as though healthspan were only a clinical problem: learning, work, money and community decide a great deal of how later life goes, and a practice that pretended otherwise would be selling a smaller thing than it claimed.",
    source: {
      label: "Stanford Center on Longevity, The New Map of Life",
      href: "https://longevity.stanford.edu/the-new-map-of-life-initiative/",
    },
    topics: ["connection-purpose", "functional-reserve", "brain-cognitive-health"],
  },
  {
    slug: "harvard-reading-a-claim",
    title: "Harvard on telling evidence from hype",
    menuLabel: "Harvard on reading a claim",
    menuLine: "Five questions to ask of any health claim.",
    institution: "Harvard T.H. Chan School of Public Health",
    what: "From its longevity science course, which devotes a module to evaluating claims.",
    lead:
      "Harvard's public course on longevity science describes its own purpose as teaching what is known, what is not, and how to tell a credible intervention from hype. It gives a module to that last part alone: the hierarchy of evidence, the difference between a statistically real result and one large enough to matter, and how to read a conflict of interest. We think that is the most useful thing anyone can hand a reader in this field, so the five questions below are our version of it, together with the words you need to use them.",
    here:
      "You should be able to check our work, and these questions are how. Every claim discussed on this site also carries one of five plain phrases for how strong the evidence behind it is, which is the answer to the first question given in advance. The glossary below covers the words we use, the words research uses, and the words the market uses.",
    source: {
      label: "Harvard T.H. Chan, Fundamentals of Longevity Science",
      href: "https://hsph.harvard.edu/ala/fundamentals-of-longevity-science/",
    },
    topics: ["medications-supplements", "early-detection"],
  },
  {
    slug: "cochrane-plain-language",
    title: "Cochrane's plain-language rule",
    menuLabel: "Cochrane's plain-language rule",
    menuLine: "Why our briefs always say where evidence is weak.",
    institution: "Cochrane",
    what: "The plain-language summary standard, applied to thousands of reviews.",
    lead:
      "Cochrane produces systematic reviews - structured searches for every study on a question, with the results combined where that is sensible - and writes a plain-language summary of each one. What makes those summaries unusual is that the headings never change, and one of them is a question most health writing quietly omits: what are the limitations of the evidence? Because the heading is always there, a weak result cannot be presented as a strong one by leaving the caveat out.",
    list: {
      caption: "The headings Cochrane uses, and so do we",
      items: [
        "Key messages",
        "What did we want to find out?",
        "What did we do?",
        "What did we find?",
        "What are the limitations of the evidence?",
        "How up to date is this evidence?",
      ],
    },
    here:
      "Our evidence briefs are written under these headings, with one addition: a bottom line that names how strong the evidence is in one of five phrases and says what, if anything, it changes here. Cochrane also bans jargon from its summaries, including the word it uses for certainty, on the grounds that a reader should not have to learn a vocabulary to be told how confident to be. We have tried to follow that.",
    source: {
      label: "Cochrane, plain language summaries",
      href: "https://www.cochrane.org/about-us/our-evidence",
    },
    topics: [],
  },
  {
    slug: "mcmaster-rated-evidence",
    title: "McMaster's rated evidence, for Canadians",
    menuLabel: "McMaster's rated evidence",
    menuLine: "Canada's evidence portal for ageing well.",
    institution: "McMaster University, Optimal Aging Portal",
    what: "A free public portal, running since 2014.",
    lead:
      "McMaster runs a public portal that does something almost nobody else does: it separates its own writing from its summaries of other people's research, and it rates outside resources. Evidence summaries are drawn from systematic reviews that have already been appraised for quality. Web resource ratings score other websites on three things - whether they are evidence-based, how transparent they are about who is behind them, and how usable they are - with two staff rating each one independently. It is free, it is Canadian, and it is aimed at the public rather than at clinicians.",
    here:
      "Two things here are taken directly from McMaster. The first is keeping our own writing, our reading of other people's research, and other people's resources in three visibly separate places, which is how this whole section is arranged. The second is the note on each entry in our library explaining why we trust it. We would send anyone to the portal before sending them to most of what a search returns.",
    source: {
      label: "McMaster Optimal Aging Portal",
      href: "https://www.mcmasteroptimalaging.org/",
    },
    topics: [],
  },
  {
    slug: "lifestyle-medicine-pillars",
    title: "The six pillars of lifestyle medicine",
    menuLabel: "The six pillars of lifestyle medicine",
    menuLine: "The six things the evidence keeps returning to.",
    institution: "American College of Lifestyle Medicine",
    what: "The specialty's founding framework.",
    lead:
      "Lifestyle medicine is a recognized specialty, not a wellness category, and it rests on six pillars. What is striking about the list is how short it is, and how little it has changed as the evidence has accumulated. Nothing on it is novel or proprietary. All of it is difficult to do consistently, which is the actual problem and the reason having a physician and a plan makes a difference.",
    list: {
      caption: "The six pillars",
      items: [
        "Optimal nutrition",
        "Physical activity",
        "Restorative sleep",
        "Stress management",
        "Positive social connection",
        "Avoidance of risky substances",
      ],
    },
    here:
      "Five of the six are topics here by name, and the sixth, avoiding risky substances, sits inside Medications & Supplements and the conversations that happen in an assessment. When a popular longevity claim is set beside this list, the question is usually not whether the new thing works but whether it would add anything on top of six things already known to.",
    source: {
      label: "American College of Lifestyle Medicine",
      href: "https://lifestylemedicine.org/overview/",
    },
    topics: [
      "nutrition",
      "functional-reserve",
      "sleep-recovery",
      "mood-stress-mental-health",
      "connection-purpose",
      "medications-supplements",
    ],
  },
  {
    slug: "clsa-canadians",
    title: "Fifty thousand Canadians, followed for twenty years",
    menuLabel: "The Canadian study of 50,000",
    menuLine: "What the national ageing study is finding.",
    institution: "Canadian Longitudinal Study on Aging",
    what: "A national study following roughly 50,000 people aged 45 to 85 since 2010.",
    lead:
      "Most of what is known about ageing comes from studies run elsewhere, on populations that do not look much like this one. The Canadian Longitudinal Study on Aging is the exception: tens of thousands of people across the country, assessed repeatedly over two decades, with physical measurements as well as questionnaires. It has produced hundreds of published papers on everything from hearing loss and social isolation to medication use and mobility.",
    here:
      "When we can cite a Canadian finding on a Canadian population, we do. The study also recruits, and taking part is a real contribution: the reason we can say anything useful about ageing in this country in twenty years is that people are being followed now.",
    source: {
      label: "Canadian Longitudinal Study on Aging",
      href: "https://www.clsa-elcv.ca/",
    },
    topics: ["hearing-vision-senses", "connection-purpose", "medications-supplements", "functional-reserve"],
  },
  {
    slug: "twelve-hallmarks",
    title: "The twelve hallmarks of ageing",
    menuLabel: "The twelve hallmarks of ageing",
    menuLine: "The cell biology under the longevity claims.",
    institution: "López-Otín and colleagues, published in Cell",
    what: "First set out in 2013, revised to twelve in 2023.",
    lead:
      "A group of biologists proposed a framework for what actually changes in cells as an organism ages. It has become the map the whole field uses, and the 2023 revision lists twelve processes. Almost every molecule marketed as an anti-ageing treatment claims to act on one of them. That is worth understanding, because it is also the source of the most common error in this field: a mechanism is not a treatment, and something that alters a process in a dish or a mouse has not been shown to help a person.",
    list: {
      caption: "The twelve, in the 2023 revision",
      items: [
        "Genomic instability",
        "Telomere attrition",
        "Epigenetic alterations",
        "Loss of proteostasis",
        "Disabled macroautophagy",
        "Deregulated nutrient sensing",
        "Mitochondrial dysfunction",
        "Cellular senescence",
        "Stem cell exhaustion",
        "Altered intercellular communication",
        "Chronic inflammation",
        "Dysbiosis",
      ],
    },
    here:
      "This is genuine science and it is why the field is worth following. It is also, in the wrong hands, the most effective sales tool in healthspan: name a hallmark, name a compound that touches it, and the leap to a person's health is made in the reader's head rather than in a trial. When we write about one of these, we say which step has been demonstrated and in what - cells, mice or people.",
    source: {
      label: "Hallmarks of aging: an expanding universe, Cell, 2023",
      href: "https://www.cell.com/cell/fulltext/S0092-8674(22)01377-0",
    },
    topics: ["medications-supplements", "metabolic-resilience"],
  },
  {
    slug: "frailty-network-avoid",
    title: "The frailty network's five actions",
    menuLabel: "The frailty network's five actions",
    menuLine: "Five things that hold off frailty, from AVOID.",
    institution: "Canadian Frailty Network",
    what: "The AVOID Frailty program, a national public-health initiative.",
    lead:
      "Frailty is a state of reduced reserve across several systems at once, so that a small setback has a large effect - a minor infection leading to a hospital stay, a stumble leading to a lost year. It is common, it is measurable well before it shows, and it is substantially preventable. Canada's frailty network reduced the evidence to five actions and an acronym, aimed at people rather than at clinicians.",
    list: {
      caption: "AVOID",
      items: [
        "Activity - keep moving, including strength work",
        "Vaccinate - against influenza, pneumococcus, shingles and the rest",
        "Optimize medications - review the whole list, not one drug at a time",
        "Interact - keep people around you",
        "Diet - enough protein and enough food, which is not the usual advice",
      ],
    },
    here:
      "Three of these five - medications, interaction and diet - are the ones most often left out of a preventive assessment, and all three are topics here. The fourth, vaccination, is ordinary family medicine and easy to let slip. This list is close to a summary of what our home services have been doing for years, which is why we point at it rather than writing our own version.",
    source: {
      label: "Canadian Frailty Network, AVOID Frailty",
      href: "https://www.cfn-nce.ca/frailty-matters/avoid-frailty/",
    },
    topics: [
      "functional-reserve",
      "medications-supplements",
      "connection-purpose",
      "nutrition",
    ],
  },
];

export function getEvidenceSource(slug: string): EvidenceSource | undefined {
  return EVIDENCE_SOURCES.find((s) => s.slug === slug);
}
