/* Clinical claims: see #24 (F1–F6, X1–X2 for Foundation; R1–R7, X1–X2 for Preserve). Keep wording in sync with the checklist. */

export type ProgrammeCard = { icon: string; title: string; text: string };

export type Programme = {
  slug: "foundation" | "preserve";
  name: string;
  short: "Foundation" | "Preserve";
  items: string;
  background: "bgMethod" | "bgTrust";
  heroPhoto: "membershipFoundation" | "membershipExecutive";
  checkPhoto: "assessmentFoundation" | "assessmentExecutive";
  lead: string;
  body: string;
  suits: string;
  includesTitle: string;
  includes: ProgrammeCard[];
  includesCols: 3 | 4;
  includesNote: string;
  checkIntro: string;
  checks: string[];
  howOften: string;
  betweenCards: ProgrammeCard[];
  betweenCols: 3 | 4;
  talkTitle: string;
};

export const PROGRAMME_COMMON = {
  checkTitle: "What we check, and how often",
  howOftenTitle: "How often",
  betweenTitle: "Between your assessments",
  knowTitle: "Good to know before you start",
  know: [
    "Monarch works alongside your family doctor and does not replace them. Your MSP coverage stays exactly the same. Membership does not give you faster access to MSP-covered tests, scans or specialist referrals.",
    "Our fees are only for services that MSP does not cover. You get a written quote, and every service is listed in writing before you begin.",
    "We do not provide emergency care. If you have a medical emergency, call 911 immediately.",
  ],
  compareTitle: "Compare with our other programmes",
  compareBody:
    "No programme is considered better than another. The programmes differ in how often we see you and how much support you receive.",
  compareAll: "Compare all programmes",
  talkBody:
    "Talk with us about your health, your circumstances and your goals. A first conversation is a relaxed opportunity to ask questions and understand your options, with no pressure to join.",
  button: "Arrange a Conversation",
};

export const PROGRAMMES: Programme[] = [
  {
    slug: "foundation",
    name: "Monarch Foundation",
    short: "Foundation",
    items: "F1–F6, X1–X2",
    background: "bgMethod",
    heroPhoto: "membershipFoundation",
    checkPhoto: "assessmentFoundation",
    lead: "Know your starting point.",
    body: "Foundation is designed for adults who feel well today and want to protect that. A yearly assessment records your health while very little is wrong, so that gradual changes are easier to recognise later. Think of it as the first page of your long-term health record.",
    suits:
      "typically up to age 40. Age is a helpful guide rather than a strict rule.",
    includesTitle: "What Foundation includes",
    includesCols: 4,
    includes: [
      {
        icon: "clipboard-check",
        title: "A yearly health assessment",
        text: "A careful look at your health, daily habits, risk factors and goals, with your physician involved where it helps.",
      },
      {
        icon: "flask-conical",
        title: "Lab tests compared over time",
        text: "Where appropriate, your assessment may include lab tests. We compare your results with your own earlier years, not only with an average.",
      },
      {
        icon: "phone-call",
        title: "A nurse check-in four times a year",
        text: "A nurse who has read your file contacts you four times a year, so your questions do not have to wait until next year.",
      },
      {
        icon: "life-buoy",
        title: "Support when something changes",
        text: "A care team that knows your history helps you understand what needs attention and arranges the appropriate next steps.",
      },
    ],
    includesNote:
      "Your membership includes the services listed here. Additional services are discussed and priced separately before they are provided. Any test that MSP does not cover is explained and agreed with you in advance.",
    checkIntro:
      "Your assessment is designed to be compared with next year's, rather than to find a problem today.",
    checks: [
      "Your personal, family and work history",
      "Your daily habits: sleep, movement, food, alcohol and stress",
      "Lab tests, where appropriate",
      "A physical exam and basic body measures",
    ],
    howOften: "Once a year, with a nurse check-in four times a year in between.",
    betweenCols: 3,
    betweenCards: [
      {
        icon: "message-circle",
        title: "Results explained clearly",
        text: "Every result comes with a plain explanation of what it means and what, if anything, should happen next.",
      },
      {
        icon: "file-text",
        title: "A record that starts now",
        text: "Each year is kept beside the last one, which is the main reason for beginning early.",
      },
      {
        icon: "user-round-check",
        title: "Someone who knows you",
        text: "A care team that knows your history helps you decide what needs attention and what can safely wait.",
      },
    ],
    talkTitle: "Is Foundation right for you?",
  },
  {
    slug: "preserve",
    name: "Monarch Preserve",
    short: "Preserve",
    items: "R1–R7, X1–X2",
    background: "bgTrust",
    heroPhoto: "membershipExecutive",
    checkPhoto: "assessmentExecutive",
    lead: "Protect your health and strength.",
    body: "Preserve is designed for the middle and later decades, when health risks build up quietly. Blood pressure, weight, sleep and strength can change so slowly that nobody notices. Preserve focuses on steady follow-through, so that small changes are caught while they are still easy to address.",
    suits:
      "typically age 40 to 65, or older if you are very independent. Age is a helpful guide rather than a strict rule.",
    includesTitle: "What Preserve includes",
    includesCols: 3,
    includes: [
      {
        icon: "clipboard-check",
        title: "A yearly assessment that grows with you",
        text: "It starts as a baseline and becomes more detailed as the years add risk, covering lab tests, body measures and fitness.",
      },
      {
        icon: "scan-search",
        title: "Screening based on your risk",
        text: "Cancer, heart and genetic screening when it is right for you, with imaging where needed. Any privately paid test is discussed with you first, and membership does not speed up publicly funded tests.",
      },
      {
        icon: "stethoscope",
        title: "Unhurried time with your physician",
        text: "A relaxed conversation about what your assessment found, what it means, and what deserves your attention now.",
      },
      {
        icon: "list-checks",
        title: "A short written plan",
        text: "A small number of specific steps, chosen because they matter most at your stage, rather than a list of thirty.",
      },
      {
        icon: "activity",
        title: "Re-checks during the year",
        text: "When we are working on something together, we measure it again during the year instead of waiting for your next assessment.",
      },
      {
        icon: "route",
        title: "Help coordinating your care",
        text: "With your permission, a care coordinator organises your health information and keeps follow-up on track. This does not give you priority access to public services.",
      },
    ],
    includesNote:
      "Your membership includes the services listed here. Additional services are discussed and priced separately before they are provided.",
    checkIntro:
      "Your assessment starts as a baseline and grows more detailed with age. During the year, we measure again anything we are actively working on.",
    checks: [
      "Your personal, family and work history",
      "Your daily habits: sleep, movement, food, alcohol and stress",
      "Lab tests, including heart and blood sugar markers as you get older",
      "Body composition, blood pressure and fitness",
      "Memory, mood and social connection",
      "Screening and imaging when they are right for you",
    ],
    howOften:
      "Once a year, with extra measurements during the year for anything we are actively managing.",
    betweenCols: 4,
    betweenCards: [
      {
        icon: "message-circle",
        title: "Results explained clearly",
        text: "Every result comes with a plain explanation of what it means and what, if anything, should happen next.",
      },
      {
        icon: "salad",
        title: "Help with daily habits",
        text: "Practical support with sleep, movement, food and stress, reviewed again whenever your circumstances change.",
      },
      {
        // Open question: JJ may remove this card later.
        icon: "smartphone",
        title: "Your plan in one place",
        text: "Your plan, results and messages are kept together in the member app, with support from your care team between assessments.",
      },
      {
        icon: "watch",
        title: "Wearable data, if you use one",
        text: "Sleep and activity information from a wearable device can add to the picture your care team works from.",
      },
    ],
    talkTitle: "Is Preserve right for you?",
  },
];
