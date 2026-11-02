import type { Metadata } from "next";
import { Activity, Apple, Eye, House, Lightbulb, MapPin, Phone, Pill, ShieldCheck, Users } from "lucide-react";
import { Boundaries } from "@/components/sections/boundaries";
import { CredentialsBand } from "@/components/sections/credentials";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { ButtonLink, DirectionsLink, TextLink } from "@/components/ui/actions";
import { EditorialCard, ToolCard } from "@/components/ui/card";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { HairlineGrid, TickList } from "@/components/ui/lists";
import { Photo } from "@/components/ui/photo";
import { IMAGES } from "@/lib/images";
import { PENDING, ROUTES, SITE } from "@/lib/site";

/*
 * Home v2 (Figma 34:44 desktop, 40:42 mobile). Copy: v2 copy deck, section
 * 10. The Journal section is not rendered until two real articles are live,
 * and the free tool links stay hidden until the tool pages exist (v2 P0-2).
 */
export const metadata: Metadata = {
  title: { absolute: "Ageing in Place and Home Care in Victoria | Monarch Health" },
  description:
    "Physician-led Ageing in Place, home care and nursing for older adults in Greater Victoria and on Vancouver Island. One plan, one team. Book an assessment.",
};

const PATHWAY = [
  "Annual health and function assessment",
  "Functional review twice a year",
  "Falls and mobility planning",
  "Medication review",
  "Home care and nursing",
  "A named care coordinator",
];

const CARE_CARDS = [
  { title: "Ageing in Place", body: "A clinical strategy to preserve independence.", link: "Explore Ageing in Place", href: ROUTES.ageingInPlace, photo: IMAGES.home.careAgeing },
  {
    title: "Home Care",
    body: "Hands-on support when assistance is required, integrated into your clinical plan.",
    link: "About Home Care",
    href: `${ROUTES.careAtHome}#home-care`,
    photo: IMAGES.home.careHome,
  },
  {
    title: "Nursing",
    body: "Clinical care delivered where someone lives, by registered nurses working from the same plan as everyone else on the team.",
    link: "About Nursing",
    href: `${ROUTES.careAtHome}#nursing`,
    photo: IMAGES.home.careNursing,
  },
];

const STEPS = [
  { n: "01", title: "Assess", body: "We get to know your health, home and goals." },
  { n: "02", title: "Plan", body: "Your personalized care plan, written down." },
  { n: "03", title: "Act", body: "You and your care team put the plan into action." },
  { n: "04", title: "Monitor", body: "We track progress and adjust as needed." },
  { n: "05", title: "Reassess", body: "We plan for what’s next, on a schedule and whenever things change." },
];

const MEASURES = [
  { icon: Activity, title: "Strength, balance and gait" },
  { icon: Lightbulb, title: "Memory, thinking and mood" },
  { icon: House, title: "Day-to-day function at home" },
  { icon: ShieldCheck, title: "Home safety and environment" },
  { icon: Pill, title: "Medications, reviewed together" },
  { icon: Eye, title: "Hearing, vision and the senses" },
  { icon: Apple, title: "Nutrition and protein" },
  { icon: Users, title: "Connection and purpose" },
];

const TOOLS = [
  { title: "Daily Living Assessment", body: "14 questions on the daily tasks that matter most for staying safe at home.", time: "About 10 minutes" },
  { title: "Memory Concerns Check", body: "8 short questions answered by a family member, to surface early change.", time: "About 4 minutes" },
  { title: "Caregiver Strain Index", body: "13 questions about how caregiving is affecting you.", time: "About 5 minutes" },
];

export default function HomePage() {
  return (
    <>
      <Hero
        home
        eyebrow="Ageing in Place · Greater Victoria"
        title="Independence is a plan, not a hope."
        tagline="More than healthcare. A plan for your tomorrow."
        body="Physician-led care that helps you stay strong, capable and independent at home, with proactive assessments, a personalized plan, home care and nursing, and one team that stays with you."
        actions={[
          { label: "Book an assessment", href: ROUTES.book, variant: "primary" },
          { label: "Explore Ageing in Place", href: ROUTES.ageingInPlace, variant: "secondary" },
        ]}
        image={IMAGES.home.hero}
      />
      <CredentialsBand />

      {/* The Ageing in Place pathway */}
      <Section tone="cream" spacing="after-band" labelledBy="intro-heading">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:gap-24">
          <Photo image={IMAGES.home.intro} sizes="(min-width: 1440px) 500px, (min-width: 1024px) 40vw, 100vw" className="aspect-[6/5] w-full lg:aspect-auto lg:h-[600px]" />
          <div className="flex flex-col gap-7">
            <SectionHeading
              id="intro-heading"
              eyebrow="The Ageing in Place pathway"
              title="More support when you need it. Before you need it."
              lead="Ageing in Place is a clinical strategy to preserve independence: assessing what is actually manageable, addressing the risks that tend to end independence suddenly, and adjusting as things change. We identify changing needs early and act before a crisis occurs."
            />
            <TickList items={PATHWAY} columns={2} />
            <div>
              <TextLink href={ROUTES.ageingInPlace}>Learn more about Ageing in Place</TextLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Care at home */}
      <Section tone="white" labelledBy="care-heading">
        <SectionHeading
          id="care-heading"
          eyebrow="Care at home"
          title="When care needs to come to you"
          lead="Assessment, hands-on support and clinical care, delivered where you live and held together by one plan."
        />
        <ul className="mt-10 grid gap-10 md:grid-cols-3 lg:mt-14">
          {CARE_CARDS.map((c) => (
            <EditorialCard key={c.title} image={c.photo} title={c.title} body={c.body} action={<TextLink href={c.href}>{c.link}</TextLink>} />
          ))}
        </ul>
      </Section>

      {/* How Monarch works */}
      <Section tone="cream" labelledBy="steps-heading">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="steps-heading" eyebrow="How Monarch works" title="A simple, coordinated process." />
          <div className="hidden lg:block">
            <TextLink href={ROUTES.howItWorks}>See how it works</TextLink>
          </div>
        </div>
        <ol className="mt-10 flex flex-col gap-6 border-l border-navy pl-6 lg:mt-14 lg:grid lg:grid-cols-5 lg:gap-8 lg:border-t lg:border-l-0 lg:pt-8 lg:pl-0">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-4 lg:flex-col lg:gap-3.5">
              <span aria-hidden="true" className="w-12 shrink-0 font-serif text-[36px] leading-none font-extralight tracking-[-0.02em] text-navy lg:w-auto lg:text-[56px]">
                {s.n}
              </span>
              <div className="flex flex-col gap-1.5 lg:gap-3.5">
                <h3 className="type-h3 text-[22px] lg:text-[26px]">
                  <span className="sr-only">Step {s.n}: </span>
                  {s.title}
                </h3>
                <p className="text-[16px] leading-[1.55] text-body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-6 lg:hidden">
          <TextLink href={ROUTES.howItWorks}>See how it works</TextLink>
        </div>
      </Section>

      {/* When to start: image + white panel */}
      <section aria-labelledby="pathway-heading" className="bg-cream pb-[72px] lg:pb-[120px]">
        <Container>
          <div className="grid overflow-hidden rounded-[12px] bg-white lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)]">
            <Photo image={IMAGES.home.landscape} radius="none" sizes="(min-width: 1440px) 640px, (min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] w-full lg:aspect-auto lg:h-[480px]" />
            <div className="flex flex-col justify-center gap-6 p-7 sm:p-10 lg:px-16 lg:py-12">
              <Eyebrow>When to start</Eyebrow>
              <h2 id="pathway-heading" className="type-h2-band">
                A pathway, not a birthday.
              </h2>
              <p className="text-[17px] leading-[1.6] text-body">
                Typically for people aged 65 and over, or earlier when support is needed. It is entered at the point where care is becoming complicated, not at a particular age, and the earlier you start, the more independence there is to protect.
              </p>
              <div>
                <ButtonLink href={ROUTES.book} variant="secondary">
                  Talk to us about timing
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What we measure */}
      <Section tone="white" labelledBy="measure-heading">
        <SectionHeading
          id="measure-heading"
          eyebrow="What we measure"
          title="What independence rests on"
          lead="Measured at your annual assessment and at a functional review every six months, and again whenever there is a meaningful change."
        />
        <HairlineGrid items={MEASURES} columns={4} titleSize="md" iconSize="lg" className="mt-10 lg:mt-14 lg:gap-x-8" />
      </Section>

      {/* Navy authority band: who we answer to + what this is not */}
      <Boundaries
        items={[
          "Not a substitute for publicly funded home and community care. Where someone is eligible, we help them access it.",
          "Not long-term or residential care, and not 24-hour supervision.",
          "No faster access to MSP-covered tests or specialist referrals. Monarch does not bill MSP.",
          "Not emergency care. In an emergency, call 911.",
        ]}
        answerable={
          <div className="flex flex-col gap-7">
            <SectionHeading id="answerable-heading" eyebrow="Accountable care" title="Who we’re answerable to" onNavy />
            <p className="text-[17px] leading-[1.65] text-on-navy">
              Our physicians are registered with the College of Physicians and Surgeons of British Columbia. Our nurses are registered with the BC College of Nurses and Midwives. Ultimately, we are accountable to the people we care for and the families who trust us with their care.
            </p>
            <dl className="border-t border-navy-line">
              {[
                {
                  icon: MapPin,
                  term: "Where we are",
                  value: (
                    <span className="flex flex-col items-start gap-0.5">
                      <span>{SITE.address}</span>
                      <DirectionsLink onNavy />
                    </span>
                  ),
                },
                { icon: Phone, term: "Speak to someone", value: <a href={SITE.phoneHref} className="inline-flex min-h-11 items-center text-white hover:underline underline-offset-4">{SITE.phoneDisplay}</a> },
                { icon: House, term: "Who we serve", value: "Greater Victoria and Vancouver Island" },
              ].map(({ icon: Icon, term, value }) => (
                <div key={term} className="flex items-center gap-4 border-b border-navy-line py-3 sm:py-4">
                  <Icon aria-hidden="true" className="size-5 shrink-0 text-on-navy" strokeWidth={1.5} />
                  <dt className="w-[130px] shrink-0 text-[14px] leading-[1.4] text-on-navy-muted sm:w-[160px]">{term}</dt>
                  <dd className="text-[16px] font-medium leading-[1.4] text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      {/* For families */}
      <Section tone="cream" labelledBy="families-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col gap-6">
            <SectionHeading id="families-heading" eyebrow="For families" title="Arranging care for a parent?" size="band" />
            <p className="text-[17px] leading-[1.6] text-body">
              Most of our conversations start with a son, daughter or spouse. With the person’s consent, family stays in the loop: clear updates, planning conversations held early, and someone on the care team who can answer a question.
            </p>
            <div>
              <TextLink href={ROUTES.forFamilies}>Support for families</TextLink>
            </div>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {TOOLS.map((t) => (
              // "Start this check" stays hidden until the tool pages exist (v2 P0-2).
              <ToolCard key={t.title} badge="Free tool" title={t.title} body={t.body} time={t.time} action={<TextLink href={PENDING}>Start this check</TextLink>} />
            ))}
          </ul>
        </div>
      </Section>

      {/* From the journal: hidden until at least two real articles are live (v2 build note). */}

      <CtaBand
        headline="Don’t wait for a crisis to become the care plan."
        body="Start with a conversation. We will listen, explain how Ageing in Place works for your situation, and send a clear written quote, with no obligation."
      />
    </>
  );
}
