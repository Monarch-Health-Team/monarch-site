/**
 * The twelve topics of healthspan.
 *
 * Six domains (client copy, 13 Sep 2026: names and framing are theirs) and,
 * from 18 Sep 2026, six more that the client approved after a survey of the
 * field. The first six are the risks that shorten healthspan; the second six
 * are what keeps it. The longer leads are drafted here and need a
 * clinician's sign-off before publishing.
 *
 * The trademark symbol is deliberately absent — see the note in
 * docs/website-features.md. The names are used; the ™ claim waits on a search.
 *
 * `connects` carries the cross-domain argument: most healthcare is organised
 * around diseases and healthspan is not, so each topic names what it reaches
 * into. That argument is what earns the list rather than asserting it, and it
 * is the reason these are topics rather than a service menu.
 *
 * The clinical programmes are sections *within* a topic, never pages of their
 * own. A topic with no programme of its own (Nutrition, Connection & Purpose)
 * says what happens here in prose instead.
 */

export type FocusAreaSlug =
  | "metabolic-resilience"
  | "cardio-respiratory-health"
  | "brain-cognitive-health"
  | "early-detection"
  | "hormonal-health"
  | "functional-reserve"
  | "nutrition"
  | "sleep-recovery"
  | "mood-stress-mental-health"
  | "connection-purpose"
  | "hearing-vision-senses"
  | "medications-supplements";

export type FocusArea = {
  slug: FocusAreaSlug;
  /** Short label, used in navigation and on cards. */
  name: string;
  /** One line, for the home page grid and the pillar page. */
  summary: string;
  /**
   * The words on the back of the home page card (Jeffrey, 7 Oct 2026). Longer
   * than `summary`, which stays short because it is also the topic page's
   * meta description.
   */
  flip: string;
  /**
   * The fuller assessment sentence the card carried until 10 Oct 2026, when
   * the card was rewritten to lead with the domain (client brief: do not let
   * lists of investigations dominate the home page). Shown on the topic's own
   * page, which is where the detail belongs.
   */
  assessment: string;
  /**
   * "Why it matters", one sentence, from the clinical review of 21 Oct 2026.
   * Shown with "What we may assess" on the topic's own page.
   */
  matters: string;
  /**
   * Shorter still, for the Learn menu: one line at menu width, no wrap
   * (client request, 18 Sep 2026 — the two-line summaries made the panel
   * too tall). Under 55 characters.
   */
  menuLine: string;
  /**
   * The opening of the domain page. Written about the subject, never about
   * Monarch — Monarch is not mentioned until roughly two-thirds down.
   */
  lead: string;
  /** What this domain reaches into. The cross-domain argument, per domain. */
  connects: string;
  /** Slugs from content/programs.ts that sit inside this domain. */
  programmes: string[];
  /** Assessment slug from content/resources.ts, where one relates. */
  relatedTool?: string;
  /**
   * "Risk" for the six domains — what shortens healthspan. "Keep" for the six
   * that follow — what preserves it. Drives the two columns of the Learn menu
   * and the two halves of the topic grid.
   */
  group: "risk" | "keep";
};

export const FOCUS_AREAS: FocusArea[] = [
  {
    slug: "metabolic-resilience",
    group: "risk",
    name: "Metabolic Resilience",
    menuLine: "Blood sugar, weight and the risks they set up.",
    summary:
      "How effectively your body manages blood sugar, insulin, blood lipids and energy balance, and how these factors change over time.",
    flip:
      "How effectively your body manages blood sugar, insulin, blood lipids and energy balance, and how these factors change over time.",
    assessment:
      "Glucose regulation, HbA1c, lipid markers including ApoB and lipoprotein(a) where appropriate, weight trends, body composition and relevant liver or kidney markers. Kidney function (eGFR and the urine albumin-to-creatinine ratio) is included where relevant.",
    matters:
      "Understanding metabolic risk can help guide nutrition, physical activity, weight management and other preventive strategies.",
    lead:
      "Metabolic resilience is the least visible of the six and the one that moves the most other numbers. It changes slowly, over years, and the early stages have no symptoms at all - which is why it is usually found late, and why it is one of the domains where measuring early genuinely changes the options available.",
    connects:
      "Metabolic health reaches into cardiovascular risk, cognition and the capacity to build and hold muscle. Treating it as a single number on a single blood test misses most of what it does.",
    programmes: ["weight-optimization", "metabolic-health"],
  },
  {
    slug: "cardio-respiratory-health",
    group: "risk",
    name: "Cardio-Respiratory Health",
    menuLine: "Heart and lung health, and the risks around them.",
    summary:
      "Understand the factors that influence heart, vascular and lung health, including blood pressure, cholesterol, physical fitness, breathing and personal cardiovascular risk.",
    flip:
      "Understand the factors that influence heart, vascular and lung health, including blood pressure, cholesterol, physical fitness, breathing and personal cardiovascular risk.",
    assessment:
      "Blood pressure, lipid profile, cardiovascular risk factors, ECG when indicated, and selected investigations such as ambulatory blood pressure monitoring, coronary calcium scoring or other cardiac imaging when clinically appropriate. Lung function testing (spirometry) may be considered when symptoms, smoking history or other risk factors make it clinically appropriate. It is not offered as routine testing for everyone.",
    matters:
      "Identifying and managing modifiable risk factors can help reduce the likelihood of cardiovascular disease, and recognizing breathing problems early can guide further assessment.",
    lead:
      "Cardiovascular disease is the most studied area in medicine and still the one most commonly found too late. The gap is rarely knowledge; it is that the measurements which would have shown it were never taken, or were taken once and never repeated.",
    connects:
      "What is good for the heart is largely what is good for the brain - vascular health and cognition move together over decades, which is why this domain is never assessed on its own.",
    programmes: ["cardiovascular-prevention"],
  },
  {
    slug: "brain-cognitive-health",
    group: "risk",
    name: "Brain & Cognitive Health",
    menuLine: "Memory and thinking, and what protects them.",
    summary:
      "Assess memory, attention, thinking and other factors that contribute to cognitive performance and long-term brain health.",
    flip:
      "Assess memory, attention, thinking and other factors that contribute to cognitive performance and long-term brain health.",
    assessment:
      "Cognitive screening when appropriate, neurological history and examination, sleep, mood, hearing, vascular risk factors and relevant laboratory investigations. Advanced imaging may be considered when clinically indicated.",
    matters:
      "Recognizing changes and addressing contributing factors can help guide further assessment and support cognitive health.",
    lead:
      "Brain health is where the evidence is strong about a few things and genuinely uncertain about many others. Sleep, hearing, blood pressure and activity have real support behind them. A good deal else marketed for the brain does not, and being clear about which is which is more useful than being encouraging.",
    connects:
      "Sleep sits inside this domain and reaches outside it - into metabolic health, mood and recovery. Hearing belongs here too, because losing it withdraws people from conversation, and withdrawal is one of the better-established risks to cognition.",
    programmes: ["brain-health", "sleep-recovery"],
    relatedTool: "memory-concerns-check",
  },
  {
    slug: "early-detection",
    group: "risk",
    name: "Early Detection",
    menuLine: "What to screen for, when, and what it cannot tell you.",
    summary:
      "Take a structured, risk-based approach to identifying important health conditions before they cause significant harm, while avoiding unnecessary investigations.",
    flip:
      "Take a structured, risk-based approach to identifying important health conditions before they cause significant harm, while avoiding unnecessary investigations.",
    assessment:
      "Personal and family history, age-appropriate cancer screening, immunization status, relevant physical examinations and hereditary risk where indicated. Additional imaging or specialist assessment may be considered when appropriate.",
    matters:
      "Evidence-based screening and timely follow-up can help detect selected conditions at a stage when intervention may be more effective.",
    lead:
      "Screening is the domain where more is not automatically better. A test can find something that would never have caused harm, and the follow-up carries its own risk. Deciding what to screen for, and when, depends on the person rather than on what is available to order.",
    connects:
      "Early detection is the one domain defined by timing rather than by a system. It draws on family history, on what the other five domains show, and on what would actually change if something were found.",
    programmes: ["early-detection"],
  },
  {
    slug: "hormonal-health",
    group: "risk",
    name: "Hormonal Health",
    menuLine: "Menopause and andropause, treated as medicine.",
    summary:
      "Understand hormonal changes that may influence energy, sleep, reproductive and sexual health, body composition, bone health and wellbeing.",
    flip:
      "Understand hormonal changes that may influence energy, sleep, reproductive and sexual health, body composition, bone health and wellbeing.",
    assessment:
      "Symptoms, menstrual and reproductive history, menopause-related concerns, relevant thyroid function and targeted hormone testing based on the clinical presentation.",
    matters:
      "A focused assessment can help distinguish normal physiological changes from potentially treatable conditions and inform individualized management.",
    lead:
      "This is the domain where people are most often told that what they are experiencing is simply age. Much of it is treatable, the evidence has changed considerably over the last decade, and the change has not yet reached most of the advice being given.",
    connects:
      "Hormonal change reaches into bone, muscle, sleep, mood and cardiovascular risk at the same time. Treating the symptom that is loudest, on its own, is how the rest goes unnoticed.",
    programmes: ["menopause-perimenopause", "mens-health"],
  },
  {
    slug: "functional-reserve",
    group: "risk",
    name: "Functional Reserve",
    menuLine: "Strength and balance: the basis of independence.",
    summary:
      "Understand your physical capacity, strength, balance, mobility and aerobic fitness, including the reserves that help you recover from illness and maintain independence.",
    flip:
      "Understand your physical capacity, strength, balance, mobility and aerobic fitness, including the reserves that help you recover from illness and maintain independence.",
    assessment:
      "Gait speed, grip strength, sit-to-stand performance, balance, walking capacity, exercise tolerance and body composition where relevant.",
    matters:
      "Establishing a functional baseline helps identify opportunities to preserve strength, mobility, resilience and independence as you age.",
    lead:
      "Functional reserve is how much capacity you hold above what daily life demands. It declines predictably, and the decline is measurable years before it changes what someone can do. Reserve is what an illness, a fall or an operation draws down - and how much of it you had beforehand largely decides what happens afterwards.",
    connects:
      "Muscle affects independence directly, and nutrition affects muscle. This is the domain where Monarch has the longest experience, because preserving it is what the home services have been doing for years.",
    programmes: ["frailty-prevention", "functional-assessments"],
    relatedTool: "daily-living",
  },
  {
    slug: "nutrition",
    group: "keep",
    name: "Nutrition",
    menuLine: "What to eat, and where the evidence actually stands.",
    summary:
      "Examine how dietary patterns, nutrient adequacy and eating habits support metabolic health, muscle, bone health, recovery and everyday energy.",
    flip:
      "Examine how dietary patterns, nutrient adequacy and eating habits support metabolic health, muscle, bone health, recovery and everyday energy.",
    assessment:
      "Dietary intake, protein and fibre adequacy, appetite, weight trends, body composition and selected laboratory markers when clinically indicated.",
    matters:
      "Practical, individualized nutrition strategies can support healthy ageing, physical performance and the prevention or management of nutritional deficiencies.",
    lead:
      "Nutrition is the area with the most advice and the least agreement. A few things are well supported: enough protein to hold muscle as you age, a diet built mostly on plants, whole foods over processed ones, and not much alcohol. Beyond that the evidence thins quickly, and the confidence of the people selling a particular diet is not a guide to how strong it is.",
    connects:
      "Protein intake decides whether strength training builds anything. Eating patterns move blood sugar, blood pressure and weight together. And appetite falls with age, so under-eating quietly becomes as common a problem as over-eating in the people we look after at home.",
    programmes: [],
  },
  {
    slug: "sleep-recovery",
    group: "keep",
    name: "Sleep & Recovery",
    menuLine: "When the body repairs, and why poor sleep shows early.",
    summary:
      "Explore sleep quality, duration, regularity and recovery, and how sleep patterns may influence physical, metabolic, cognitive and emotional health.",
    flip:
      "Explore sleep quality, duration, regularity and recovery, and how sleep patterns may influence physical, metabolic, cognitive and emotional health.",
    assessment:
      "Sleep history, validated sleep questionnaires, daytime sleepiness, sleep schedules, possible sleep-disordered breathing and home or laboratory sleep studies when indicated.",
    matters:
      "Identifying sleep difficulties and treatable sleep disorders can improve daily functioning and support broader health goals.",
    lead:
      "Sleep is not time lost. It is when memory is consolidated, blood sugar is regulated and the brain clears what it accumulated during the day. Short or fragmented sleep shows up in metabolic and cognitive measures long before anyone calls it a problem, and much of it is treatable - sleep apnoea in particular is common, under-diagnosed, and one of the more fixable things in medicine.",
    connects:
      "Sleep reaches into every other topic: blood sugar the next morning, blood pressure overnight, mood, appetite, and the ability to concentrate. It is also one of the first things that hormonal change and pain disturb, which is why it is rarely assessed on its own.",
    programmes: ["sleep-recovery"],
  },
  {
    slug: "mood-stress-mental-health",
    group: "keep",
    name: "Mood, Stress & Mental Health",
    menuLine: "How you feel is a health measure in its own right.",
    summary:
      "Understand the emotional and psychological factors that influence wellbeing, relationships, decision-making, motivation and physical health.",
    flip:
      "Understand the emotional and psychological factors that influence wellbeing, relationships, decision-making, motivation and physical health.",
    assessment:
      "Mood, anxiety, stress, resilience, coping strategies, life satisfaction and relevant social or occupational pressures, using validated tools when appropriate.",
    matters:
      "Recognizing concerns early can help guide practical support, appropriate treatment and strategies for sustainable wellbeing.",
    lead:
      "Depression, anxiety and chronic stress shorten healthy life in ways that are measurable - through sleep, blood pressure, activity and the willingness to look after oneself. They are also under-recognized in older adults, where low mood is too often accepted as part of ageing. It is not, and it responds to treatment at every age.",
    connects:
      "Mood decides whether someone exercises, eats well, sleeps and keeps up with the people around them. Persistent low mood is on the short list of factors that raise dementia risk. And caring for someone else carries its own strain, which is why we measure that too.",
    programmes: [],
    relatedTool: "mood-energy-check",
  },
  {
    slug: "connection-purpose",
    group: "keep",
    name: "Connection & Purpose",
    menuLine: "Isolation shortens healthy life. It can be changed.",
    summary:
      "Explore the relationships, meaningful activities, community participation and sense of purpose that contribute to quality of life.",
    flip:
      "Explore the relationships, meaningful activities, community participation and sense of purpose that contribute to quality of life.",
    assessment:
      "Social engagement, loneliness, relationship support, meaningful activity, caregiving responsibilities and barriers to participation.",
    matters:
      "Understanding a person’s social environment and priorities helps shape a health plan that supports connection, belonging and a fulfilling life.",
    lead:
      "Social isolation sits alongside smoking, inactivity and high blood pressure on the list of things that shorten healthy life and raise the risk of dementia. Having people to see, somewhere to be and something that needs doing is not a soft benefit; it shows up in how long people stay independent. The places in the world where people live longest are organized around it.",
    connects:
      "Hearing loss withdraws people from conversation, and withdrawal from conversation is one of the better-established risks to cognition. Mobility decides whether someone can get to the people they know. Staying at home safely, which is the work of our home services, is in large part the work of staying connected.",
    programmes: [],
    relatedTool: "caregiver-strain",
  },
  {
    slug: "hearing-vision-senses",
    group: "keep",
    name: "Hearing, Vision & the Senses",
    menuLine: "Two treatable risks to the brain almost nobody lists.",
    summary:
      "Assess sensory health and the ways hearing, vision and related changes may affect communication, balance, safety and independence.",
    flip:
      "Assess sensory health and the ways hearing, vision and related changes may affect communication, balance, safety and independence.",
    assessment:
      "Hearing and vision history, functional difficulties, appropriate screening and referrals for comprehensive audiology, optometry or ophthalmology assessment.",
    matters:
      "Recognizing sensory changes can support timely intervention and help maintain communication, mobility and everyday participation.",
    lead:
      "Untreated hearing loss and vision loss are each on the short list of modifiable risks for dementia, and both are common, gradual and easy to test for. Hearing aids and cataract surgery are among the better-evidenced things a person can do for their brain in later life. Balance, taste and smell matter too - smell for what its loss can signal, balance for what a fall costs.",
    connects:
      "Hearing is the bridge between the senses and social connection, and through it to cognition. Vision decides whether someone can drive, read a label, or see a step. Losing either quietly narrows a life long before it is recorded as a medical problem.",
    programmes: [],
  },
  {
    slug: "medications-supplements",
    group: "keep",
    name: "Medications & Supplements",
    menuLine: "What you take, and what the evidence says about it.",
    summary:
      "Review the medicines and supplements you take to understand their purpose, benefits, risks and compatibility with your overall health plan.",
    flip:
      "Review the medicines and supplements you take to understand their purpose, benefits, risks and compatibility with your overall health plan.",
    assessment:
      "Medication reconciliation, potential interactions, duplication, side effects, adherence, supplement use and the appropriateness of ongoing treatment. Additional tools or pharmacogenetic testing may be considered in selected cases.",
    matters:
      "Regular, coordinated review can help reduce avoidable medication-related harm and ensure treatment remains appropriate as health needs change.",
    lead:
      "Past sixty-five, most people take several medicines, prescribed by several people, and the combination is rarely reviewed as a whole. Some of it is essential. Some of it is treating a side effect of something else. Reviewing the list is one of the higher-value things a physician can do. Supplements and the molecules sold as anti-ageing deserve the same scrutiny: a few have evidence in specific situations, most do not, and none reverse ageing.",
    connects:
      "Sedatives and blood-pressure drugs raise the risk of falls. Anticholinergic medicines affect memory. Interactions show up as fatigue, confusion or dizziness that gets attributed to age. Getting the list right reaches into strength, cognition and independence at once.",
    programmes: [],
  },
];

export function getFocusArea(slug: string): FocusArea | undefined {
  return FOCUS_AREAS.find((a) => a.slug === slug);
}
