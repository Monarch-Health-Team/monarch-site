import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { TextLink } from "@/components/ui/actions";
import { Card } from "@/components/ui/card";
import { FaqList } from "@/components/ui/faq";
import { ImagePlaceholder, type Tint } from "@/components/ui/image-placeholder";
import { Section, SectionHeading } from "@/components/ui/layout";
import { TickList } from "@/components/ui/lists";
import { PENDING, ROUTES } from "@/lib/site";

// How it works · Figma frame 20:1043. Copy exactly as in design-handoff.md.

export const metadata: Metadata = {
  title: "How it works",
  description: "A simple, coordinated process: assess, plan, act, monitor and reassess.",
};

const FIRST_STEPS: { title: string; body: string; tint: Tint }[] = [
  { title: "1. A conversation", body: "Call or book online. Tell us what is happening, with no obligation to continue.", tint: "blue" },
  { title: "2. An assessment at home", body: "Health, function, home safety and what matters most, reviewed where you actually live.", tint: "warm" },
  { title: "3. A written plan and quote", body: "Your plan, what is included, and the fees, all in writing before anything begins.", tint: "sand" },
];

const PATHWAY: { n: string; title: string; body: string; tint: Tint }[] = [
  {
    n: "01",
    title: "Assess",
    body: "We get to know your health, home and goals: medical history, medications, strength, balance, memory, mood and day-to-day function.",
    tint: "blue",
  },
  { n: "02", title: "Plan", body: "Goals set in terms of activities and independence. A written plan you can keep and share.", tint: "warm" },
  {
    n: "03",
    title: "Act",
    body: "You and your care team put the plan into action: falls prevention, medication review, home care and nursing where needed.",
    tint: "sand",
  },
  {
    n: "04",
    title: "Monitor",
    body: "Monthly contact, observations passed to the physician, and family kept informed with your consent.",
    tint: "blue",
  },
  {
    n: "05",
    title: "Reassess",
    body: "A functional review every six months and whenever something changes, so decline is noticed while there is still time to act.",
    tint: "warm",
  },
];

const YEAR = [
  { when: "Month 0", what: "Full health and function assessment" },
  { when: "Monthly", what: "Contact at home" },
  { when: "Month 6", what: "Functional review" },
  { when: "Month 12", what: "Full reassessment" },
  { when: "Any time", what: "Review when something changes" },
];

export default function HowItWorksPage() {
  return (
    <>
      <Hero
        breadcrumb="How it works"
        eyebrow="How Monarch works"
        title="A simple, coordinated process."
        body="From the first phone call to the review six months later, you always know what happens next, and who is responsible for it."
        actions={[
          { label: "Book an assessment", href: ROUTES.book, variant: "primary" },
          { label: "Read the FAQ", href: "#faq", variant: "secondary" },
        ]}
        imageLabel="care team member with older adult and family member at kitchen table · subject right of centre, left third of frame kept clear"
      />

      {/* Getting started */}
      <Section tone="sand" labelledBy="start-heading">
        <SectionHeading id="start-heading" eyebrow="Getting started" title="The first three steps" />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {FIRST_STEPS.map((s) => (
            <Card as="li" key={s.title} className="gap-4">
              <ImagePlaceholder label="Illustration / photo" tint={s.tint} className="aspect-[16/8] w-full" />
              <h3 className="type-h3 pt-1 text-[22px]">{s.title}</h3>
              <p className="text-[15px]">{s.body}</p>
            </Card>
          ))}
        </ol>
      </Section>

      {/* The five steps */}
      <Section tone="cream" id="pathway" labelledBy="pathway-heading">
        <SectionHeading id="pathway-heading" eyebrow="The pathway" title="Assess. Plan. Act. Monitor. Reassess." />
        <ol className="mt-8 border-t border-line">
          {PATHWAY.map((s) => (
            <li key={s.n} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 gap-y-4 border-b border-line py-6 md:grid-cols-[64px_minmax(0,1fr)_220px] md:gap-x-6">
              <span className="font-serif text-[32px] leading-none text-body md:text-[40px]" aria-hidden="true">
                {s.n}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="type-h3 text-[24px] md:text-[26px]">
                  <span className="sr-only">{s.n}. </span>
                  {s.title}
                </h3>
                <p className="text-[17px]">{s.body}</p>
              </div>
              <ImagePlaceholder label="Small photo" tint={s.tint} className="col-span-2 aspect-[16/7] w-full md:col-span-1 md:aspect-[11/7]" />
            </li>
          ))}
        </ol>
      </Section>

      {/* Review cadence */}
      <Section tone="sand" labelledBy="year-heading">
        <SectionHeading id="year-heading" eyebrow="Over a year" title="What a typical year looks like" />
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {YEAR.map((y) => (
            <li key={y.when} className="flex flex-col gap-1.5">
              <div className="mb-2 flex items-center" aria-hidden="true">
                <span className="size-3 shrink-0 rounded-full bg-navy" />
                <span className="ml-2 h-px flex-1 bg-line" />
              </div>
              <span className="text-[16px] font-semibold text-navy">{y.when}</span>
              <span className="text-[14px]">{y.what}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* What your family can expect (consent: handoff note 5) */}
      <Section tone="cream" labelledBy="family-heading">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <SectionHeading id="family-heading" eyebrow="For families" title="What your family can expect" className="max-w-[440px]" />
          <TickList
            className="lg:pt-6"
            items={[
              "Plain-language updates on what has changed and what is being done",
              "Planning conversations held early, while everyone is calm",
              "Someone on the care team who can answer a question",
              "A written summary after every review",
              "All of it with the person’s consent, on their terms",
            ]}
          />
        </div>
      </Section>

      {/* FAQ (answers not written yet: handoff note 8) */}
      <Section tone="sand" id="faq" labelledBy="faq-heading">
        <SectionHeading id="faq-heading" eyebrow="Questions" title="Frequently asked questions" />
        <div className="mt-8">
          <FaqList
            questions={[
              "Who is Ageing in Place for?",
              "Do I need a referral from my family doctor?",
              "Does this replace my family doctor or public home care?",
              "How much does it cost?",
              "Can family members be involved?",
              "What areas do you serve?",
            ]}
          />
        </div>
        <div className="mt-8">
          <TextLink href={PENDING}>See all questions</TextLink>
        </div>
      </Section>

      <CtaBand
        headline="Don’t wait for a crisis to become the care plan."
        body="Start with a conversation. We will listen, explain how Ageing in Place works for your situation, and send a clear written quote, with no obligation."
      />
    </>
  );
}
