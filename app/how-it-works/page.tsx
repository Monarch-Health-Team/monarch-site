import type { Metadata } from "next";
import { CredentialsBand } from "@/components/sections/credentials";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { EditorialCard } from "@/components/ui/card";
import { FaqList, type Faq } from "@/components/ui/faq";
import { Section, SectionHeading } from "@/components/ui/layout";
import { TickList } from "@/components/ui/lists";
import { IMAGES } from "@/lib/images";
import { ROUTES, SITE } from "@/lib/site";

/*
 * How it works v2, including the FAQ (Figma 57:302 desktop, 57:624 mobile).
 * Copy: v2 copy deck, section 10, with all six FAQ answers. "See all
 * questions" stays hidden until a full FAQ page exists (v2 build note).
 */
export const metadata: Metadata = {
  title: { absolute: "How It Works: Assess, Plan, Act, Review | Monarch Health" },
  description:
    "From the first call to the six-month review: how Monarch assesses, plans, acts, monitors and reassesses, and what your family can expect. FAQ included.",
};

const START = [
  { image: IMAGES.howItWorks.start1, title: "1. A conversation", body: "Call or book online. Tell us what is happening, with no obligation to continue." },
  { image: IMAGES.howItWorks.start2, title: "2. An assessment at home", body: "Health, function, home safety and what matters most, reviewed where you actually live." },
  { image: IMAGES.howItWorks.start3, title: "3. A written plan and quote", body: "Your plan, what is included, and the fees, all in writing before anything begins." },
];

const STEPS = [
  { n: "01", title: "Assess", body: "We get to know your health, home and goals: medical history, medications, strength, balance, memory, mood and day-to-day function." },
  { n: "02", title: "Plan", body: "Goals set in terms of activities and independence. A written plan you can keep and share." },
  { n: "03", title: "Act", body: "You and your care team put the plan into action: falls prevention, medication review, home care and nursing where needed." },
  { n: "04", title: "Monitor", body: "Monthly contact, observations passed to the physician, and family kept informed with your consent." },
  { n: "05", title: "Reassess", body: "A functional review every six months and whenever something changes, so decline is noticed while there is still time to act." },
];

const YEAR = [
  { when: "Month 0", what: "Full health and function assessment" },
  { when: "Monthly", what: "Contact at home" },
  { when: "Month 6", what: "Functional review" },
  { when: "Month 12", what: "Full reassessment" },
  { when: "Any time", what: "Review when something changes" },
];

const FAQS: Faq[] = [
  {
    q: "Who is Ageing in Place for?",
    a: "Typically adults aged 65 and over, or younger when support is needed, who want to stay in their own home. It is also for the family members who help them. It begins when care starts to feel complicated, not at a particular birthday.",
  },
  {
    q: "Do I need a referral from my family doctor?",
    a: "You can contact us yourself, or a family member can contact us on your behalf. Clinicians can also refer a patient using the same form. With your consent, we keep your family physician informed.",
  },
  {
    q: "Does this replace my family doctor or public home care?",
    a: "No. Monarch works alongside your family doctor and the public system, not in place of them. Publicly funded home and community care stays available to you, and where you are eligible, we help you access it.",
  },
  {
    q: "How much does it cost?",
    a: "Fees depend on what you need, so we do not publish a price list. After a first conversation we send a clear written quote, with no obligation, and every included service is itemized before you begin. Monarch does not bill MSP; our fees cover uninsured services only.",
  },
  {
    q: "Can family members be involved?",
    a: "Yes, as much as the person wants. With their consent, family receive plain-language updates, join planning conversations and have someone on the care team they can call with a question.",
  },
  {
    q: "What areas do you serve?",
    a: "Greater Victoria and Vancouver Island. Our clinic and care team are based at 1823 Fort St in Victoria. If you live elsewhere on the Island, call us and we will talk through what is possible where you live.",
  },
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
        image={IMAGES.howItWorks.hero}
      />
      <CredentialsBand />

      {/* Getting started */}
      <Section tone="white" labelledBy="start-heading">
        <SectionHeading id="start-heading" eyebrow="Getting started" title="The first three steps" />
        <ul className="mt-10 grid gap-10 md:grid-cols-3 lg:mt-14">
          {START.map((s) => (
            <EditorialCard key={s.title} image={s.image} title={s.title} body={s.body} titleSize="lg" />
          ))}
        </ul>
      </Section>

      {/* The pathway */}
      <Section tone="cream" id="pathway" labelledBy="pathway-heading">
        <SectionHeading id="pathway-heading" eyebrow="The pathway" title="Assess. Plan. Act. Monitor. Reassess." />
        <ol className="mt-10 lg:mt-14">
          {STEPS.map((s) => (
            <li key={s.n} className="grid gap-2 border-t border-navy py-7 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[120px_280px_minmax(0,620px)] lg:gap-x-12">
              <span aria-hidden="true" className="font-serif text-[40px] leading-none font-extralight tracking-[-0.02em] text-navy lg:text-[56px]">
                {s.n}
              </span>
              <h3 className="type-h3 text-[24px] lg:text-[30px] lg:leading-[1.2]">
                <span className="sr-only">Step {s.n}: </span>
                {s.title}
              </h3>
              <p className="text-[17px] leading-[1.6] text-body sm:col-start-2 lg:col-start-3 lg:row-start-1">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Over a year */}
      <Section tone="white" labelledBy="year-heading">
        <SectionHeading id="year-heading" eyebrow="Over a year" title="What a typical year looks like" />
        <ol className="mt-10 flex flex-col gap-6 border-l border-navy pl-6 lg:mt-14 lg:grid lg:grid-cols-5 lg:border-l-0 lg:pl-0">
          {YEAR.map((y) => (
            <li key={y.when} className="relative flex flex-col gap-2 lg:gap-3.5">
              <span aria-hidden="true" className="absolute top-2 -left-[30.5px] size-3 rounded-full bg-navy lg:static lg:flex lg:w-full lg:items-center lg:bg-transparent">
                <span className="hidden size-3 shrink-0 rounded-full bg-navy lg:block" />
                <span className="hidden h-px flex-1 bg-navy lg:block" />
              </span>
              <p className="font-serif text-[26px] leading-[1.1] font-extralight text-navy lg:text-[30px]">{y.when}</p>
              <p className="text-[16px] leading-[1.5] text-body">{y.what}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* What your family can expect */}
      <Section tone="cream" labelledBy="family-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_minmax(0,640px)] lg:justify-between lg:gap-24">
          <SectionHeading id="family-heading" eyebrow="For families" title="What your family can expect" />
          <TickList
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

      {/* FAQ (the page's one sand section) */}
      <Section tone="sand" id="faq" labelledBy="faq-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,760px)] lg:justify-between lg:gap-24">
          <div className="flex flex-col gap-5">
            <SectionHeading id="faq-heading" eyebrow="Questions" title="Frequently asked questions" />
            <p className="text-[16px] leading-[1.6] text-body">
              Still unsure? Call{" "}
              <a href={SITE.phoneHref} className="font-semibold text-action underline-offset-4 hover:text-action-hover hover:underline">
                {SITE.phoneDisplay}
              </a>{" "}
              and a member of the care team will talk it through.
            </p>
          </div>
          <FaqList items={FAQS} />
        </div>
      </Section>

      <CtaBand
        headline="Don’t wait for a crisis to become the care plan."
        body="Start with a conversation. We will listen, explain how Ageing in Place works for your situation, and send a clear written quote, with no obligation."
      />
    </>
  );
}
