/**
 * The Communities.
 *
 * Ten groups, named by us on 19 Sep 2026 at the client's request. Every name
 * ends in "Community" so a reader knows at a glance that these are groups to
 * join rather than another set of articles, and the general one leads. They are
 * deliberately NOT the twelve healthspan topics restated: a clinical domain
 * makes a good article and a poor conversation. These are organised around
 * what people actually want to talk to each other about, which is a mixture
 * of a stage of life, a problem in the house, and a thing they are trying.
 *
 * NOTHING IS OPEN YET. The forums need somewhere to live and someone to
 * moderate them, and neither exists today. Every page says so rather than
 * showing an empty board. When they do open:
 *
 *  1. They need a named moderator with clinical backup. An unmoderated
 *     health forum becomes a place where people swap prescriptions.
 *  2. Nothing here is medical advice and the pages have to keep saying it.
 *  3. Members and non-members both. A forum only members can read is a
 *     support channel, not a community.
 */

/**
 * Labels set 19 Sep 2026 from discussion-prompt-style questions the client
 * supplied, one per existing community (order and slugs unchanged), then
 * compressed the same day into single-line topic names once the full
 * questions made the dropdown panel too tall. Only the label changed —
 * menuLine, summary, lead and examples are as they were.
 */
export type ForumTopic = {
  slug: string;
  label: string;
  /** Menu line, under 55 characters. */
  menuLine: string;
  /** One sentence, for the hub card. */
  summary: string;
  /** The opening of the topic page. */
  lead: string;
  /** Three or four things people would actually post about. */
  examples: string[];
  /** A mark for the topic. Decoration beside the name, never the name. */
  emoji: string;
};

export const FORUM_TOPICS: ForumTopic[] = [
  {
    slug: "general-healthspan",
    label: "Staying capable into your 80s",
    menuLine: "The main room. Anything that fits nowhere else.",
    summary:
      "The main room, and the place to start. Anything about living well for longer that does not belong in one of the others.",
    lead: "Every community needs a front door, and this is it. Introductions, first questions, things you have read and wondered about, and anything that spans several of the groups below. If you are not sure where something belongs, it belongs here.",
    examples: [
      "I am fifty and healthy. What would you actually look at first?",
      "Something I read this week that I cannot make sense of.",
      "What has actually made a difference for you this year?",
      "Introduce yourself and what brought you here.",
    ],
    emoji: "💬",
  },
  {
    slug: "movement-and-strength",
    label: "Walking, strength and balance",
    menuLine: "Training, walking, balance and getting stronger.",
    summary:
      "For people training, walking, lifting or starting again: what is working and what is not.",
    lead: "Of everything discussed in healthspan, this is the part with the strongest evidence and the widest gap between knowing and doing. The difficulty is rarely the science. It is the first six weeks, the bad knee, and the question of what to do on the days you cannot face it.",
    examples: [
      "Restarting strength training at sixty-eight after a long gap.",
      "What people actually do for balance, and whether it helped.",
      "Managing a training plan around arthritis.",
      "Walking groups on the Island.",
    ],
    emoji: "🏃",
  },
  {
    slug: "nutrition",
    label: "Eating habits that actually stick",
    menuLine: "What people eat, and what actually stuck.",
    summary:
      "Meals, protein, appetite and the practical side of eating well, whether cooking for one or for a household.",
    lead: "Nutrition attracts more confident advice than almost any other subject here, and the confidence rarely matches the evidence. What tends to be genuinely useful is far more practical: what people cook on a Tuesday, how to get enough protein without it becoming a project, and what to do when someone stops wanting to eat.",
    examples: [
      "Getting enough protein without living on shakes.",
      "Cooking for one after a bereavement.",
      "What to do when a parent has lost interest in food.",
      "Recipes that survived contact with real life.",
    ],
    emoji: "🥗",
  },
  {
    slug: "sleep",
    label: "Waking at night as you get older",
    menuLine: "What worked, what did not, and what helped.",
    summary:
      "For people sleeping badly, sleeping less, or trying to work out whether what has changed is normal.",
    lead: "Sleep changes with age in ways that are normal and in ways that are not, and telling the two apart is genuinely hard from the inside. It is also the subject where people try the most things and compare notes the least.",
    examples: [
      "Waking at three and not getting back to sleep.",
      "Has anyone here actually been assessed for sleep apnoea?",
      "Whether the tracking devices helped or just added worry.",
      "Sleep after a change in hormones.",
    ],
    emoji: "🌙",
  },
  {
    slug: "metabolic-and-weight",
    label: "Measuring health beyond the scales",
    menuLine: "Weight, blood sugar and the new medications.",
    summary:
      "Weight, blood sugar and the medications now in wide use, discussed by the people taking them.",
    lead: "This is the area that has changed fastest, and where the gap between what is being marketed and what is understood is widest. People taking these medications have questions that are practical rather than theoretical, and other people taking them often give a more candid answer than a brochure.",
    examples: [
      "What the first three months on a GLP-1 were actually like.",
      "Holding on to muscle while losing weight.",
      "Blood sugar creeping up with no symptoms.",
      "What happens when you stop.",
    ],
    emoji: "📊",
  },
  {
    slug: "menopause",
    label: "Bone and heart health after menopause",
    menuLine: "The transition, and the advice that has changed.",
    summary:
      "Menopause and perimenopause: a transition many people navigate alone, on advice that has moved considerably.",
    lead: "The evidence on this moved substantially over the last ten years and the advice being given has not entirely caught up. Meanwhile a great deal of it is treatable, and a great deal of what people are told is simply age is not.",
    examples: [
      "Symptoms nobody warned me about.",
      "Being told it was stress for three years.",
      "Sleep, joints and mood, all at once.",
      "Questions worth asking at an appointment.",
    ],
    emoji: "🌸",
  },
  {
    slug: "mens-health",
    label: "Sexual health and ageing",
    menuLine: "The changes men tend not to raise.",
    summary:
      "Energy, strength, mood and the changes men are least likely to bring up with anyone.",
    lead: "Men present later, ask less and are screened less consistently, and the changes that arrive in the forties and fifties tend to be put down to work or age. Plenty of it is worth looking at properly.",
    examples: [
      "Energy and motivation dropping off in the fifties.",
      "What a testosterone result does and does not mean.",
      "Prostate screening, and making sense of the arguments.",
      "Getting a man in your life to go and get checked.",
    ],
    emoji: "🗣",
  },
  {
    slug: "brain-and-memory",
    label: "Everyday habits for brain health",
    menuLine: "Protecting memory, and early worries.",
    summary:
      "Memory, concentration, and the worry that comes with noticing a change in yourself or someone close.",
    lead: "Almost everyone past fifty has had the moment of losing a word and wondering. Most of the time that is nothing. Sometimes it is worth acting on, and the difference is hard to judge alone, which is exactly why people want to talk about it.",
    examples: [
      "Noticing a change in a parent, and what to do next.",
      "Which of the things sold for brain health are worth anything.",
      "Hearing aids and whether they made a difference.",
      "Living well after a diagnosis.",
    ],
    emoji: "🧠",
  },
  {
    slug: "caregivers",
    label: "Looking after yourself while caregiving",
    menuLine: "For the people doing the caring.",
    summary:
      "For anyone caring for a parent or partner: the logistics, the systems, and the parts nobody prepares you for.",
    lead: "Caring for someone is a job most people take on with no training, no handover and no end date, while holding down everything else. The practical questions are answerable and the hard ones are at least survivable in company.",
    examples: [
      "Getting a parent assessed when they do not want to be.",
      "Navigating home support and what is actually covered.",
      "Siblings who do not agree.",
      "Looking after yourself while doing this.",
    ],
    emoji: "🤝",
  },
  {
    slug: "ageing-at-home",
    label: "Home changes to stay independent",
    menuLine: "Staying put, safely and for longer.",
    summary:
      "Staying in your own home: the adaptations, the near misses, and the decisions that get put off.",
    lead: "Most people want to stay where they are, and most of what makes that possible is unglamorous and cheap: a rail, a light, a different shoe, a conversation had a year earlier than felt necessary.",
    examples: [
      "The adaptations that made the most difference.",
      "After a fall: what changed and what we wish we had done sooner.",
      "Talking about driving.",
      "Deciding when a home no longer works.",
    ],
    emoji: "🏡",
  },
];

export function getForumTopic(slug: string): ForumTopic | undefined {
  return FORUM_TOPICS.find((t) => t.slug === slug);
}

/**
 * What the Community is, in two lines. Shown at the top of the dropdown and
 * on the hub, because "Community" alone does not tell anyone what they would
 * be joining (client request, 19 Sep 2026).
 */
export const COMMUNITY_INTRO =
  "Communities you can join to follow people working on the same things and share what you have learned. Each one is moderated by Monarch staff.";

/** Said on every community page until moderation and a home exist. */
export const FORUM_NOT_OPEN =
  "The forums are not open yet. They need a named moderator with clinical backup before they are, because an unmoderated health forum quickly becomes a place where people pass on each other's prescriptions. Tell us which of these you would use and it moves up the list.";
