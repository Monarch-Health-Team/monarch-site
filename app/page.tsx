import {
  Activity,
  Calendar,
  ClipboardCheck,
  Eye,
  Heart,
  House,
  Lightbulb,
  MessageSquare,
  Phone,
  Pill,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Boundaries } from "@/components/sections/boundaries";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { ButtonLink, TextLink } from "@/components/ui/actions";
import { Card, IconBadge } from "@/components/ui/card";
import { ImagePlaceholder, type Tint } from "@/components/ui/image-placeholder";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { TickList } from "@/components/ui/lists";
import { PENDING, ROUTES, SITE } from "@/lib/site";

// Home · Figma frame 20:2. Copy exactly as in design-handoff.md.

const TRUST = [
  { icon: ClipboardCheck, text: "Physicians registered with CPSBC" },
  { icon: Activity, text: "Nurses registered with BCCNM" },
  { icon: ShieldCheck, text: "1823 Fort St, Victoria" },
  { icon: Heart, text: "Greater Victoria & Vancouver Island" },
];

const CARE_CARDS: { title: string; body: string; link: string; href: string; image: string; tint: Tint }[] = [
  {
    title: "Ageing in Place",
    body: "A clinical strategy to preserve independence.",
    link: "Explore Ageing in Place",
    href: ROUTES.ageingInPlace,
    image: "Older adult walking at home with a cane, daylight",
    tint: "warm",
  },
  {
    title: "Home Care",
    body: "Hands-on support when assistance is required, integrated into your clinical plan.",
    link: "About Home Care",
    href: `${ROUTES.careAtHome}#home-care`,
    image: "Carer helping an older adult in the kitchen",
    tint: "sand",
  },
  {
    title: "Nursing",
    body: "Clinical care delivered where someone lives, by registered nurses working from the same plan as everyone else on the team.",
    link: "About Nursing",
    href: `${ROUTES.careAtHome}#nursing`,
    image: "Registered nurse checking blood pressure at home",
    tint: "blue",
  },
];

const STEPS = [
  { n: "01", icon: Pill, title: "Assess", body: "We get to know your health, home and goals." },
  { n: "02", icon: Users, title: "Plan", body: "Your personalized care plan, written down." },
  { n: "03", icon: House, title: "Act", body: "You and your care team put the plan into action." },
  { n: "04", icon: Calendar, title: "Monitor", body: "We track progress and adjust as needed." },
  { n: "05", icon: Lightbulb, title: "Reassess", body: "We plan for what’s next, on a schedule and whenever things change." },
];

const MEASURES = [
  { icon: Eye, text: "Strength, balance & gait" },
  { icon: MessageSquare, text: "Memory, thinking & mood" },
  { icon: Phone, text: "Day-to-day function at home" },
  { icon: ClipboardCheck, text: "Home safety & environment" },
  { icon: Activity, text: "Medications, reviewed together" },
  { icon: ShieldCheck, text: "Hearing, vision & the senses" },
  { icon: Heart, text: "Nutrition & protein" },
  { icon: Pill, text: "Connection & purpose" },
];

const TOOLS = [
  {
    title: "Daily Living Assessment",
    body: "14 questions on the daily tasks that matter most for staying safe at home.",
    time: "About 10 minutes",
  },
  {
    title: "Memory Concerns Check",
    body: "8 short questions answered by a family member, to surface early change.",
    time: "About 4 minutes",
  },
  {
    title: "Caregiver Strain Index",
    body: "13 questions about how caregiving is affecting you.",
    time: "About 5 minutes",
  },
];

const ARTICLES: { title: string; excerpt: string; date: string; tint: Tint; placeholder?: boolean }[] = [
  {
    title: "Muscle is the reserve you spend later",
    excerpt: "Strength is rarely what brings someone to a doctor, and it is often what decides how the next twenty years go.",
    date: "May 4, 2026",
    tint: "blue",
  },
  {
    title: "What proactive care actually looks like at home",
    excerpt: "Most home care responds to crises. Here’s how a proactive model anticipates them, month to month.",
    date: "April 22, 2026",
    tint: "warm",
  },
  {
    // Placeholder card kept as marked in the frame (handoff note 7).
    title: "[New article: e.g. Planning conversations, held early]",
    excerpt: "Placeholder for a third Ageing Well post.",
    date: "TBC",
    tint: "sand",
    placeholder: true,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Ageing in Place · Greater Victoria"
        title="Independence is a plan, not a hope."
        body="Physician-led care that helps you stay strong, capable and independent at home, with proactive assessments, a personalized plan, home care and nursing, and one team that stays with you."
        actions={[
          { label: "Book an assessment", href: ROUTES.book, variant: "primary" },
          { label: "Explore Ageing in Place", href: ROUTES.ageingInPlace, variant: "secondary" },
        ]}
        imageLabel="Older adult outdoors in warm coastal Vancouver Island light · subject right of centre, left third of frame kept clear"
        tagline={
          <>
            More than healthcare.
            <br />
            A plan for your tomorrow.
          </>
        }
      />

      {/* Trust strip */}
      <section aria-label="Credentials and location" className="bg-sand py-7">
        <Container>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {TRUST.map((t) => (
              <li key={t.text} className="flex items-center gap-3 text-[15px] font-medium leading-snug text-navy">
                <IconBadge icon={t.icon} size="sm" />
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Intro: Ageing in Place */}
      <Section tone="cream" labelledBy="intro-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
          <ImagePlaceholder label="older couple at home or outdoors, warm and candid" tint="blue" className="aspect-[4/3] w-full xl:aspect-auto xl:h-[340px]" />
          <div className="flex flex-col gap-4">
            <Eyebrow>The Ageing in Place pathway</Eyebrow>
            <h2 id="intro-heading" className="type-h2-sm">
              More support when you need it. Before you need it.
            </h2>
            <p className="text-[17px]">
              Ageing in Place is a clinical strategy to preserve independence: assessing what is actually manageable, addressing the risks that tend to end independence suddenly, and adjusting as things change. We identify changing needs early and act before a crisis occurs.
            </p>
            <TextLink href={ROUTES.ageingInPlace}>Learn more about Ageing in Place</TextLink>
          </div>
          <TickList
            className="lg:col-start-2 xl:col-start-auto xl:border-l xl:border-line xl:pl-8"
            items={[
              "Annual health & function assessment",
              "Functional review twice a year",
              "Falls & mobility planning",
              "Medication review",
              "Home care & nursing",
              "A named care coordinator",
            ]}
          />
        </div>
      </Section>

      {/* Care at home */}
      <Section tone="sand" labelledBy="care-heading">
        <SectionHeading
          id="care-heading"
          eyebrow="Care at home"
          title="When care needs to come to you"
          intro="Assessment, hands-on support and clinical care, delivered where you live and held together by one plan."
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CARE_CARDS.map((c) => (
            <Card as="li" key={c.title} className="gap-4">
              <ImagePlaceholder label={c.image} tint={c.tint} className="aspect-[16/10] w-full" />
              <h3 className="type-h3 pt-1 text-[24px] lg:text-[26px]">{c.title}</h3>
              <p className="text-[17px]">{c.body}</p>
              <TextLink href={c.href}>{c.link}</TextLink>
            </Card>
          ))}
        </ul>
      </Section>

      {/* How Monarch works */}
      <Section tone="cream" labelledBy="process-heading">
        <SectionHeading
          id="process-heading"
          eyebrow="How Monarch works"
          title="A simple, coordinated process."
          action={<TextLink href={ROUTES.howItWorks}>See how it works</TextLink>}
        />
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <IconBadge icon={s.icon} />
                <span className="text-[14px] font-semibold text-body">{s.n}</span>
              </div>
              <h3 className="type-h3 text-[24px]">{s.title}</h3>
              <p className="text-[15px]">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Pathway, not a birthday */}
      <Section tone="sand" labelledBy="pathway-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-4">
            <Eyebrow>When to start</Eyebrow>
            <h2 id="pathway-heading" className="type-h2-lg">
              A pathway, not a birthday.
            </h2>
            <p className="max-w-[520px] text-[17px]">
              Typically for people aged 65 and over, or earlier when support is needed. It is entered at the point where care is becoming complicated, not at a particular age, and the earlier you start, the more independence there is to protect.
            </p>
            <div className="pt-2">
              <ButtonLink href={ROUTES.book} variant="secondary">
                Talk to us about timing
              </ButtonLink>
            </div>
          </div>
          <ImagePlaceholder
            label="Landscape photo band: older couple outdoors, mountains / water. Italic pull line: “The earlier you start, the longer you may preserve your independence.”"
            tint="warm"
            className="aspect-[3/2] w-full lg:aspect-auto lg:h-[420px]"
          />
        </div>
      </Section>

      {/* What we keep an eye on */}
      <Section tone="cream" labelledBy="measure-heading">
        <SectionHeading
          id="measure-heading"
          eyebrow="What we measure"
          title="What independence rests on"
          intro="Measured at your annual assessment and at a functional review every six months, and again whenever there is a meaningful change."
        />
        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {MEASURES.map((m) => (
            <Card as="li" key={m.text} className="gap-4 shadow-none sm:p-6">
              <IconBadge icon={m.icon} />
              <p className="text-[17px] font-medium leading-snug text-navy">{m.text}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* For families */}
      <Section tone="sand" labelledBy="families-heading">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] xl:gap-12">
          <div className="flex max-w-[640px] flex-col gap-4">
            <Eyebrow>For families</Eyebrow>
            <h2 id="families-heading" className="type-h2">
              Arranging care for a parent?
            </h2>
            <p className="text-[17px]">
              Most of our conversations start with a son, daughter or spouse. With the person’s consent, family stays in the loop: clear updates, planning conversations held early, and someone on the care team who can answer a question.
            </p>
            <TextLink href={ROUTES.forFamilies}>Support for families</TextLink>
          </div>
          {/* Free tools: answers must stay in the browser (handoff note 4). */}
          <ul className="grid gap-5 sm:grid-cols-3" data-compliance="free-tools">
            {TOOLS.map((t) => (
              <Card as="li" key={t.title} className="gap-2.5 sm:p-5">
                <Eyebrow>Free tool</Eyebrow>
                <h3 className="type-h3 text-[20px]">{t.title}</h3>
                <p className="text-[15px]">{t.body}</p>
                <p className="text-[14px] text-muted">{t.time}</p>
                <TextLink href={PENDING} className="mt-auto">
                  Start this check
                </TextLink>
              </Card>
            ))}
          </ul>
        </div>
      </Section>

      {/* Honest boundaries (compliance; follows Julia's final wording, handoff note 1) */}
      <Boundaries
        tone="cream"
        size="sm"
        items={[
          "Not a substitute for publicly funded home and community care. Where someone is eligible, we help them access it.",
          "Not long-term or residential care, and not 24-hour supervision.",
          "No faster access to MSP-covered tests or specialist referrals. Monarch does not bill MSP.",
          "Not emergency care. In an emergency, call 911.",
        ]}
      />

      {/* Who we're answerable to */}
      <Section tone="sand" labelledBy="accountable-heading">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-8">
          <div className="flex flex-col gap-4 lg:pr-4">
            <Eyebrow>Accountable care</Eyebrow>
            <h2 id="accountable-heading" className="type-h2-sm">
              Who we’re answerable to
            </h2>
            <p className="text-[17px]">
              Our physicians are registered with the College of Physicians and Surgeons of British Columbia. Our nurses are registered with the BC College of Nurses and Midwives. Ultimately, we are accountable to the people we care for and the families who trust us with their care.
            </p>
          </div>
          <Card className="gap-0">
            <dl className="flex flex-col gap-3">
              <div>
                <dt className="text-[14px] font-semibold text-navy">Where we are</dt>
                <dd className="mt-1 text-[17px]">{SITE.address}</dd>
              </div>
              <div>
                <dt className="text-[14px] font-semibold text-navy">Speak to someone</dt>
                <dd className="mt-1 text-[17px]">
                  <a href={SITE.phoneHref} className="hover:text-navy hover:underline underline-offset-4">
                    {SITE.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[14px] font-semibold text-navy">Who we serve</dt>
                <dd className="mt-1 text-[17px]">Greater Victoria &amp; Vancouver Island</dd>
              </div>
            </dl>
          </Card>
          <ImagePlaceholder label="Map / clinic exterior photo" tint="sand" className="aspect-[4/3] w-full lg:aspect-auto lg:h-[280px]" />
        </div>
      </Section>

      {/* From the journal */}
      <Section tone="cream" labelledBy="journal-heading">
        <SectionHeading
          id="journal-heading"
          eyebrow="Ageing well"
          title="From the journal"
          action={<TextLink href={PENDING}>Show all articles</TextLink>}
        />
        <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {ARTICLES.map((a) => (
            <li key={a.title} className="flex flex-col gap-3" data-placeholder={a.placeholder ? "copy" : undefined}>
              <ImagePlaceholder label="Article image" tint={a.tint} className="aspect-[16/9] w-full" />
              <Eyebrow className="pt-2">Ageing well</Eyebrow>
              <h3 className="type-h3 text-[22px]">{a.title}</h3>
              <p className="text-[15px]">{a.excerpt}</p>
              <p className="text-[14px] text-muted">{a.date}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        headline="Don’t wait for a crisis to become the care plan."
        body="Start with a conversation. We will listen, explain how Ageing in Place works for your situation, and send a clear written quote, with no obligation."
      />
    </>
  );
}
