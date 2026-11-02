import type { Metadata } from "next";
import {
  Activity,
  CalendarDays,
  ClipboardCheck,
  Eye,
  FileText,
  Heart,
  House,
  Lightbulb,
  MessageSquare,
  Pill,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Boundaries } from "@/components/sections/boundaries";
import { CredentialsBand } from "@/components/sections/credentials";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { ButtonLink } from "@/components/ui/actions";
import { EditorialCard } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/layout";
import { HairlineGrid, TickList } from "@/components/ui/lists";
import { IMAGES } from "@/lib/images";
import { ROUTES } from "@/lib/site";

/*
 * Ageing in Place v2 (Figma 55:142 desktop, 56:182 mobile). Copy: v2 copy
 * deck, section 10. The program "Learn more" links stay hidden until the
 * program pages exist (v2 build note).
 */
export const metadata: Metadata = {
  title: { absolute: "Ageing in Place in Victoria, BC | Monarch Health" },
  description:
    "A clinical plan to help older adults stay independent at home: an annual assessment, functional reviews, falls planning and a named care coordinator.",
};

const INCLUDES = [
  { icon: ClipboardCheck, title: "An annual health and function assessment", body: "Medical review plus direct measurement of strength, balance, walking speed and memory. At home where that is more useful." },
  { icon: Activity, title: "Functional review twice a year", body: "Function can change faster than bloodwork, so it is measured more often, and again on any change." },
  { icon: ShieldCheck, title: "Falls and mobility planning", body: "Balance, strength and the home environment, before a fall rather than after one." },
  { icon: Heart, title: "Support when something changes", body: "A care team that knows your history and coordinates the next steps." },
  { icon: Pill, title: "Medication review", body: "A regular look at everything you take together, often where the easiest gains are." },
  { icon: Users, title: "A named care coordinator", body: "One person who holds the moving parts together when care becomes complicated." },
  { icon: House, title: "Home care and nursing", body: "Hands-on support and clinical care at home, from the same plan." },
  { icon: CalendarDays, title: "Support for the family", body: "Clear communication, planning conversations and someone who can answer a question." },
];

const CADENCE = [
  { when: "Year 1", what: "Full assessment" },
  { when: "+6 months", what: "Functional review" },
  { when: "Any change", what: "Reassessment" },
];

const MEASURED = [
  "Medical and medication history, reviewed together",
  "Laboratory assessment and vitals",
  "Strength, balance, gait speed and mobility",
  "Memory, thinking and mood",
  "Purpose and social connection",
  "Day-to-day function at home, and what help is needed",
  "Home safety and the home environment",
  "What matters most to the person, and to the family",
];

const BETWEEN = [
  { icon: Lightbulb, title: "A plan built around what you want to keep doing", body: "Goals set in terms of activities and independence." },
  { icon: Eye, title: "A named point of contact", body: "A care team member who knows your plan, not a directory." },
  { icon: MessageSquare, title: "Family kept in the loop", body: "On your terms and with your consent." },
  { icon: FileText, title: "A written summary after every review", body: "Something you can keep and share with whoever you choose." },
];

export default function AgeingInPlacePage() {
  return (
    <>
      <Hero
        breadcrumb="Ageing in Place"
        eyebrow="Ageing in Place"
        title="Ageing in Place"
        tagline="A clinical strategy to preserve independence."
        body="For many people, staying at home is the preferred option. Ageing in Place assesses what is actually manageable, addresses the risks that tend to end independence suddenly, and adjusts as things change."
        actions={[
          { label: "Book an assessment", href: ROUTES.book, variant: "primary" },
          { label: "Try our free planning tools", href: `${ROUTES.forFamilies}#tools`, variant: "secondary" },
        ]}
        image={IMAGES.ageing.hero}
      />
      <CredentialsBand />

      {/* Who it's for */}
      <Section tone="white" labelledBy="who-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-24">
          <SectionHeading id="who-heading" eyebrow="Who it’s for" title="A pathway, not a birthday." />
          <div className="flex flex-col gap-5">
            <p className="type-lead text-body">
              Typically age 65 and over, or earlier when support is needed. For adults in the years when staying well and staying independent become the same project, and for the families who help them.
            </p>
            <p className="type-lead text-body">
              It is entered at the point where care is becoming complicated, not at a particular birthday. The emphasis moves from finding disease toward keeping the strength, balance, thinking and confidence that independence rests on.
            </p>
            <aside className="mt-2 flex flex-col gap-1.5 border-l-2 border-navy py-1 pl-5 text-[16px]">
              <p className="font-semibold leading-[1.4] text-navy">Written for the family member arranging care</p>
              <p className="leading-[1.55] text-body">If you are arranging it for yourself, everything here applies in the same way.</p>
            </aside>
          </div>
        </div>
      </Section>

      {/* What it includes */}
      <Section tone="cream" id="what-it-includes" labelledBy="includes-heading">
        <SectionHeading id="includes-heading" eyebrow="What it includes" title="Everything in one arrangement" />
        <HairlineGrid items={INCLUDES} columns={4} className="mt-10 lg:mt-14" />
      </Section>

      {/* What we measure, and how often */}
      <Section tone="white" id="measures" labelledBy="measures-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-24">
          <div className="flex flex-col gap-10">
            <SectionHeading id="measures-heading" eyebrow="What we measure" title="What we measure, and how often" />
            <div>
              <h3 className="text-[13px] font-semibold uppercase leading-[1.3] tracking-[0.1em] text-muted">Review cadence</h3>
              <ol className="mt-3">
                {CADENCE.map((c) => (
                  <li key={c.when} className="flex items-baseline gap-6 border-t border-navy py-[18px]">
                    <span className="w-[150px] shrink-0 font-serif text-[28px] leading-[1.1] font-extralight text-navy sm:w-[180px] lg:text-[32px]">{c.when}</span>
                    <span className="text-[17px] leading-[1.4] text-body">{c.what}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <TickList items={MEASURED} className="lg:mt-2" />
        </div>
      </Section>

      {/* How change is noticed */}
      <Section tone="cream" labelledBy="change-heading">
        <SectionHeading id="change-heading" eyebrow="Staying ahead" title="How change is noticed, and what happens next" />
        <HairlineGrid
          columns={2}
          rule="navy"
          titleSize="xl"
          className="mt-10 lg:mt-14"
          items={[
            {
              title: "How change is identified",
              body: "Strength, balance, walking speed and memory are measured at your annual assessment, at a functional review every six months, and whenever there is a meaningful change in condition.",
            },
            {
              title: "When a concern arises",
              body: "Your care team reviews what has changed and, with your consent, involves your family physician and others in your care so the next steps are coordinated.",
            },
          ]}
        />
      </Section>

      {/* Between assessments (the page's one sand section) */}
      <Section tone="sand" labelledBy="between-heading">
        <SectionHeading
          id="between-heading"
          eyebrow="Between assessments"
          title="An assessment once or twice a year is not a relationship."
          lead="These are the things that keep Monarch present in between."
        />
        <HairlineGrid items={BETWEEN} columns={4} className="mt-10 lg:mt-14" />
      </Section>

      {/* Clinical programs */}
      <Section tone="white" labelledBy="programs-heading">
        <SectionHeading
          id="programs-heading"
          eyebrow="Clinical programs"
          title="What the pathway draws on"
          lead="Which ones apply depends on what your assessment finds and what you and your physician decide to work on."
        />
        <ul className="mt-10 grid gap-10 md:grid-cols-2 lg:mt-14">
          <EditorialCard
            image={IMAGES.ageing.strengthBalance}
            title="Frailty Prevention"
            body="Strength, mobility and balance: the practical basis of independence."
            titleSize="lg"
            aspect="aspect-[29/20]"
            sizes="(min-width: 1440px) 580px, (min-width: 768px) 45vw, 100vw"
          />
          <EditorialCard
            image={IMAGES.ageing.gaitGrip}
            title="Functional Assessments"
            body="Measuring the everyday capability independence depends on."
            titleSize="lg"
            aspect="aspect-[29/20]"
            sizes="(min-width: 1440px) 580px, (min-width: 768px) 45vw, 100vw"
          />
        </ul>
      </Section>

      <Boundaries
        items={[
          "Not a substitute for publicly funded home and community care. Where someone is eligible, we help them access it.",
          "Not long-term or residential care, and not 24-hour supervision.",
          "No faster access to MSP-covered tests or specialist referrals.",
          "Not emergency care. In an emergency, call 911.",
        ]}
      />

      {/* Fees */}
      <Section tone="cream" id="fees" labelledBy="fees-heading">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
          <SectionHeading
            id="fees-heading"
            eyebrow="Fees"
            title="Let’s find the right fit, then put a number on it."
            lead="Fees are tailored to you. Tell us a little about you or your family and we will send a clear written quote, with no obligation. Every included service is itemized in writing before you begin."
          />
          <div className="flex shrink-0 flex-wrap gap-3 sm:gap-4">
            <ButtonLink href={ROUTES.book}>Book an assessment</ButtonLink>
            <ButtonLink href={ROUTES.book} variant="secondary">
              Request a quote
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* Public system and consent (compliance wording, v2 copy deck) */}
      <Section tone="white" spacing="compact" labelledBy="public-heading">
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16" data-compliance="msp-wording">
          <div className="flex flex-col gap-4 border-t border-navy pt-7">
            <h2 id="public-heading" className="type-h3 text-[24px] lg:text-[28px]">
              How this works with the public system
            </h2>
            <p className="text-[16px] leading-[1.65] text-body">
              Publicly insured services remain publicly insured. Monarch does not bill the Medical Services Plan (MSP). Monarch’s fees cover uninsured services only: assessment, planning, functional review, coordination, monitoring and family support.
            </p>
          </div>
          <div className="flex flex-col gap-4 border-t border-navy pt-7">
            <h2 className="type-h3 text-[24px] lg:text-[28px]">Your information, your care team</h2>
            <p className="text-[16px] leading-[1.65] text-body">
              With your consent, Monarch can exchange relevant health information with your physicians and other providers, only as authorized and in line with privacy requirements.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        headline="Start with a conversation about staying at home."
        body="Start with a conversation. We will listen, explain how Ageing in Place works for your situation, and send a clear written quote, with no obligation."
      />
    </>
  );
}
