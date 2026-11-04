/* Clinical claims: see #24 (P1–P12, X1–X2). Keep wording in sync with the checklist. */

export const CP_HERO = {
  title: "Care Programmes",
  lead: "Four ways to get care that fits your life.",
  body: "Every Monarch programme follows the same approach: a physician leads your care, and a care coordinator who knows you by name supports you and your family. The programmes differ in how often we see you and how much support you receive.",
  button: "Compare all programmes",
};

export const CP_FOUR = {
  title: "Our four programmes",
  body: "They appear in the same order as our menu, and no programme is considered better than another. The right choice depends on your health, your circumstances and your personal goals.",
};

export const CP_PROGRAMMES = [
  {
    slug: "foundation",
    name: "Monarch Foundation",
    short: "Foundation",
    headline: "Know your starting point.",
    text: "A yearly assessment records your health while things are going well, and a nurse checks in with you four times a year. Because each year is compared with the last, gradual changes become easier to notice.",
    suits: "Often suits: typically up to age 40",
    link: "About Foundation",
    photo: "membershipFoundation",
  },
  {
    slug: "preserve",
    name: "Monarch Preserve",
    short: "Preserve",
    headline: "Protect your health and strength.",
    text: "A yearly assessment that adapts as your needs change. We look for risks early, agree on a short, practical plan, and measure again during the year whenever something needs attention.",
    suits:
      "Often suits: typically age 40 to 65, or older if you are very independent",
    link: "About Preserve",
    photo: "membershipExecutive",
  },
  {
    slug: "continuum",
    name: "Monarch Continuum",
    short: "Continuum",
    headline: "Stay safe and independent at home.",
    text: "Regular reviews of your strength, balance, walking and memory, every six months. It is the only programme that includes practical care in your own home.",
    suits:
      "Often suits: typically age 65 and over, or earlier when support is needed",
    link: "About Continuum",
    photo: "membershipPreserve",
  },
  {
    slug: "signature",
    name: "Monarch Signature",
    short: "Signature",
    headline: "Checked twice a year, followed closely.",
    text: "A complete assessment every six months. Between visits, your care team reviews information from a wearable device and helps coordinate your care, including care outside Canada.",
    suits: "Often suits: any age",
    link: "About Signature",
    photo: "membershipSignature",
  },
] as const;

export const CP_EVERY = {
  title: "What every programme gives you",
  cards: [
    {
      icon: "stethoscope",
      title: "A physician who leads your care",
      text: "Your physician looks at your overall health and decides which priorities matter most right now.",
    },
    {
      icon: "user-round-check",
      title: "One person to call",
      text: "A care coordinator who knows you, your family and your plan, so you always know who to call.",
    },
    {
      icon: "clipboard-list",
      title: "A short, clear plan",
      text: "A few important steps, each with a named person responsible and a date to review it.",
    },
    {
      icon: "users",
      title: "Your family kept informed",
      text: "With your permission, we keep your family and your family doctor informed and involved.",
    },
  ],
} as const;

export const CP_WHICH = {
  title: "Which programme is right for me?",
  p1: "At your first visit, your physician completes a frailty assessment, which looks at your strength, balance, walking speed, risk of falling and nutrition.",
  p2: "Based on your results and your personal goals, your physician will suggest the programme that fits you best. Age is a helpful guide rather than a strict rule, and the final choice is always yours. We explain everything before you decide.",
  link: "Read about the frailty assessment",
};

export type Cell = string | { yes: true; detail?: string } | { no: true };

export const CP_COMPARE = {
  title: "Compare all programmes",
  body: "The programmes differ in how often we see you and how much support you receive. They do not differ in the quality of MSP-covered medical care.",
  caption: "How the four Monarch care programmes compare",
  hint: "Scroll sideways to see all four programmes.",
  head: ["Foundation", "Preserve", "Continuum", "Signature"],
  rows: [
    {
      th: "Main focus",
      cells: [
        "Know your starting point",
        "Protect your health and strength",
        "Stay safe and independent at home",
        "Checked twice a year, followed closely",
      ],
    },
    {
      th: "Often suits",
      cells: [
        "Typically up to age 40",
        "Typically age 40 to 65, or older if very independent",
        "Typically age 65 and over, or earlier when support is needed",
        "Any age",
      ],
    },
    {
      th: "How often we assess you",
      cells: [
        "Once a year, with a nurse check-in four times a year",
        "Once a year, with extra checks for anything we are working on",
        "Once a year, a review every six months, and whenever your health changes",
        "Every six months, with wearable data reviewed in between",
      ],
    },
    {
      th: "Strength, balance and memory",
      cells: [
        "Basic physical checks each year. Memory is not checked as routine.",
        "Body measures, blood pressure and fitness each year, plus a review of memory and mood",
        "Strength, balance, walking speed, memory and mood, every six months",
        "Strength, balance, fitness and memory, every six months",
      ],
    },
    {
      th: "Care in your home",
      cells: [
        { no: true },
        { no: true },
        {
          yes: true,
          detail:
            "Home safety visit, help to prevent falls, help with daily living, nursing at home",
        },
        { no: true },
      ],
    },
    {
      th: "Care coordinator",
      cells: [{ yes: true }, { yes: true }, { yes: true }, { yes: true }],
    },
    {
      th: "Written updates",
      cells: [
        "Results explained after each assessment",
        "Results explained, and a written plan",
        "A written summary after every review",
        "A written summary every month",
      ],
    },
  ] as { th: string; cells: Cell[] }[],
  feesTh: "Fees",
  fees: "By written quote. Every service is listed in writing before you begin.",
};

export const CP_KNOW = {
  title: "Good to know before you start",
  paragraphs: [
    "We work alongside your family doctor, and we do not replace them. Your MSP coverage stays exactly the same. Membership does not give you faster access to MSP-covered tests, scans or specialist referrals.",
    "Our fees are only for services that MSP does not cover. We explain every fee clearly before any service begins.",
    "We do not provide emergency care. If you have a medical emergency, call 911 immediately.",
  ],
};

export const CP_TALK = {
  title: "Not sure which programme fits?",
  body: "Talk with us about your situation. A first conversation is a relaxed opportunity to ask questions and learn about your options, with no pressure to join.",
  button: "Arrange a Conversation",
};
