import type { Metadata } from "next";
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
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { TickList } from "@/components/ui/lists";
import { PENDING, ROUTES } from "@/lib/site";

// Ageing in Place · Figma frame 20:427. Copy exactly as in design-handoff.md.

export const metadata: Metadata = {
  title: "Ageing in Place",
  description: "A clinical strategy to preserve independence.",
};

const INCLUDES = [
  {
    icon: ClipboardCheck,
    title: "An annual health and function assessment",
    body: "Medical review plus direct measurement of strength, balance, walking speed and memory. At home where that is more useful.",
  },
  {
    icon: Activity,
    title: "Functional review twice a year",
    body: "Function can change faster than bloodwork, so it is measured more often, and again on any change.",
  },
  {
    icon: ShieldCheck,
    title: "Falls and mobility planning",
    body: "Balance, strength and the home environment, before a fall rather than after one.",
  },
  {
    icon: Heart,
    title: "Support when something changes",
    body: "A care team that knows your history and coordinates the next steps.",
  },
  {
    icon: Pill,
    title: "Medication review",
    body: "A regular look at everything you take together, often where the easiest gains are.",
  },
  {
    icon: Users,
    title: "A named care coordinator",
    body: "One person who holds the moving parts together when care becomes complicated.",
  },
  {
    icon: House,
    title: "Home care and nursing",
    body: "Hands-on support and clinical care at home, from the same plan.",
  },
  {
    icon: Calendar,
    title: "Support for the family",
    body: "Clear communication, planning conversations and someone who can answer a question.",
  },
];

const CADENCE = [
  { when: "Year 1", what: "Full assessment" },
  { when: "+6 months", what: "Functional review" },
  { when: "Any change", what: "Reassessment" },
];

const BETWEEN = [
  { icon: Lightbulb, title: "A plan built around what you want to keep doing", body: "Goals set in terms of activities and independence." },
  { icon: Eye, title: "A named point of contact", body: "A care team member who knows your plan, not a directory." },
  { icon: MessageSquare, title: "Family kept in the loop", body: "On your terms and with your consent." },
  { icon: Phone, title: "A written summary after every review", body: "Something you can keep and share with whoever you choose." },
];

export default function AgeingInPlacePage() {
  return (
    <>
      <Hero
        breadcrumb="Ageing in Place"
        eyebrow="Ageing in Place"
        title="Ageing in Place"
        subhead="A clinical strategy to preserve independence."
        body="For many people, staying at home is the preferred option. Ageing in Place assesses what is actually manageable, addresses the risks that tend to end independence suddenly, and adjusts as things change."
        actions={[
          { label: "Book an assessment", href: ROUTES.book, variant: "primary" },
          { label: "Try our free planning tools", href: `${ROUTES.forFamilies}#tools`, variant: "secondary" },
        ]}
        imageLabel="older adult at home, natural light · subject right of centre, left third of frame kept clear"
      />

      {/* Who it's for */}
      <Section tone="sand" id="who-its-for" labelledBy="who-heading">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <SectionHeading id="who-heading" eyebrow="Who it’s for" title="A pathway, not a birthday." />
          <div className="flex flex-col gap-4 text-[17px]">
            <p>
              Typically age 65 and over, or earlier when support is needed. For adults in the years when staying well and staying independent become the same project, and for the families who help them.
            </p>
            <p>
              It is entered at the point where care is becoming complicated, not at a particular birthday. The emphasis moves from finding disease toward keeping the strength, balance, thinking and confidence that independence rests on.
            </p>
            <Card className="mt-2 gap-2 shadow-none sm:p-6">
              <p className="text-[15px] font-semibold text-navy">Written for the family member arranging care</p>
              <p className="text-[15px]">If you are arranging it for yourself, everything here applies in the same way.</p>
            </Card>
          </div>
        </div>
      </Section>

      {/* What it includes */}
      <Section tone="cream" id="what-it-includes" labelledBy="includes-heading">
        <SectionHeading id="includes-heading" eyebrow="What it includes" title="Everything in one arrangement" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {INCLUDES.map((item) => (
            <Card as="li" key={item.title} className="gap-3 sm:p-6">
              <IconBadge icon={item.icon} />
              <h3 className="type-h3 pt-1 text-[21px]">{item.title}</h3>
              <p className="text-[15px]">{item.body}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* What we measure + how often */}
      <Section tone="sand" labelledBy="measure-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-8">
            <SectionHeading id="measure-heading" eyebrow="What we measure" title="What we measure, and how often" />
            <Card className="gap-4 sm:p-6">
              <h3 className="text-[15px] font-semibold text-navy">Review cadence</h3>
              <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {CADENCE.map((c) => (
                  <li key={c.when} className="flex flex-col gap-1">
                    <span aria-hidden="true" className="mb-1 size-2.5 bg-navy" />
                    <span className="text-[14px] font-semibold text-navy">{c.when}</span>
                    <span className="text-[14px]">{c.what}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
          <TickList
            className="lg:pt-2"
            items={[
              "Medical and medication history, reviewed together",
              "Laboratory assessment and vitals",
              "Strength, balance, gait speed and mobility",
              "Memory, thinking and mood",
              "Purpose and social connection",
              "Day-to-day function at home, and what help is needed",
              "Home safety and the home environment",
              "What matters most to the person, and to the family",
            ]}
          />
        </div>
      </Section>

      {/* How change is noticed */}
      <Section tone="cream" labelledBy="change-heading">
        <SectionHeading id="change-heading" eyebrow="Staying ahead" title="How change is noticed, and what happens next" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="sm:p-6">
            <h3 className="type-h3 text-[22px]">How change is identified</h3>
            <p className="text-[17px]">
              Strength, balance, walking speed and memory are measured at your annual assessment, at a functional review every six months, and whenever there is a meaningful change in condition.
            </p>
          </Card>
          <Card className="sm:p-6">
            <h3 className="type-h3 text-[22px]">When a concern arises</h3>
            <p className="text-[17px]">
              Your care team reviews what has changed and, with your consent, involves your family physician and others in your care so the next steps are coordinated.
            </p>
          </Card>
        </div>
      </Section>

      {/* Between assessments */}
      <Section tone="sand" labelledBy="between-heading">
        <SectionHeading
          id="between-heading"
          eyebrow="Between assessments"
          title="An assessment once or twice a year is not a relationship."
          intro="These are the things that keep Monarch present in between."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {BETWEEN.map((item) => (
            <Card as="li" key={item.title} className="sm:p-6">
              <IconBadge icon={item.icon} />
              <h3 className="type-h3 pt-1 text-[21px]">{item.title}</h3>
              <p className="text-[15px]">{item.body}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Programs it draws on */}
      <Section tone="cream" labelledBy="programs-heading">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <SectionHeading
            id="programs-heading"
            eyebrow="Clinical programs"
            title="What the pathway draws on"
            intro="Which ones apply depends on what your assessment finds and what you and your physician decide to work on."
            className="max-w-[440px]"
          />
          <ul className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Frailty Prevention",
                body: "Strength, mobility and balance: the practical basis of independence.",
                image: "Strength and balance session with a physiotherapist",
                tint: "blue" as const,
              },
              {
                title: "Functional Assessments",
                body: "Measuring the everyday capability independence depends on.",
                image: "Gait and grip-strength assessment",
                tint: "warm" as const,
              },
            ].map((p) => (
              <Card as="li" key={p.title} className="sm:p-5">
                <ImagePlaceholder label={p.image} tint={p.tint} className="aspect-[4/3] w-full" />
                <h3 className="type-h3 pt-1 text-[22px]">{p.title}</h3>
                <p className="text-[15px]">{p.body}</p>
                <TextLink href={PENDING} className="mt-auto">
                  Learn more
                </TextLink>
              </Card>
            ))}
          </ul>
        </div>
      </Section>

      <Boundaries
        tone="sand"
        items={[
          "Not a substitute for publicly funded home and community care. Where someone is eligible, we help them access it.",
          "Not long-term or residential care, and not 24-hour supervision.",
          "No faster access to MSP-covered tests or specialist referrals.",
          "Not emergency care. In an emergency, call 911.",
        ]}
      />

      {/* Fees: written quote */}
      <Section tone="cream" id="fees" labelledBy="fees-heading">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex max-w-[620px] flex-col gap-4">
            <Eyebrow>Fees</Eyebrow>
            <h2 id="fees-heading" className="type-h2">
              Let’s find the right fit, then put a number on it.
            </h2>
            <p className="text-[17px]">
              Fees are tailored to you. Tell us a little about you or your family and we will send a clear written quote, with no obligation. Every included service is itemized in writing before you begin.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3.5">
            <ButtonLink href={ROUTES.book}>Book an assessment</ButtonLink>
            <ButtonLink href={ROUTES.book} variant="secondary">
              Request a quote
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Public system + consent (compliance) */}
      <Section tone="sand" ariaLabel="How this works with the public system, and your information">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="sm:p-6">
            <h2 id="public-heading" className="type-h3 text-[22px]">
              How this works with the public system
            </h2>
            {/* Julia's compliance placeholder kept exactly as marked (handoff note 1). */}
            <p className="text-[15px]" data-compliance="julia-placeholder">
              Publicly insured services remain publicly insured. Monarch does not bill the Medical Services Plan (MSP). This covers uninsured services only: assessment, planning, functional review, coordination, monitoring and family support. [Julia to finalize wording without “membership”.]
            </p>
          </Card>
          <Card className="sm:p-6">
            <h2 className="type-h3 text-[22px]">Your information, your care team</h2>
            <p className="text-[15px]" data-compliance="consent">
              With your consent, Monarch can exchange relevant health information with your physicians and other providers, only as authorized and in line with privacy requirements.
            </p>
          </Card>
        </div>
      </Section>

      <CtaBand
        headline="Start with a conversation about staying at home."
        body="Start with a conversation. We will listen, explain how Ageing in Place works for your situation, and send a clear written quote, with no obligation."
      />
    </>
  );
}
