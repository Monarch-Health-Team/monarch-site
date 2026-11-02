import type { Metadata } from "next";
import { Activity, Apple, Heart, House, Lightbulb, Pill, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { CredentialsBand } from "@/components/sections/credentials";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { HairlineGrid } from "@/components/ui/lists";
import { Photo } from "@/components/ui/photo";
import { IMAGES } from "@/lib/images";

/*
 * About v2 (Figma 59:462 desktop, 59:744 mobile). Copy: v2 copy deck,
 * section 10. No team or founder photos (client wish): discipline icons
 * only. "Read our story" stays hidden until the story page exists.
 */
export const metadata: Metadata = {
  title: { absolute: "About Us: Physician-Led Care in Victoria | Monarch Health" },
  description:
    "A physician-led practice on Vancouver Island. Physicians, nurses and allied health professionals work from one plan so people can stay well at home.",
};

const TEAM = [
  { icon: Stethoscope, title: "Physicians", body: "Lead each assessment and plan, and keep your family physician informed, with your consent." },
  { icon: Heart, title: "Registered nurses", body: "Provide clinical care at home and pass observations to the physician between visits." },
  { icon: Pill, title: "Pharmacists", body: "Review everything a person takes, together, to keep medications safe and as simple as possible." },
  { icon: Activity, title: "Physiotherapists", body: "Work on strength, balance and mobility, the practical basis of staying independent." },
  { icon: House, title: "Occupational therapists", body: "Look at daily routines and the home itself, so everyday tasks stay safe and manageable." },
  { icon: Apple, title: "Dietitians", body: "Help with eating well to keep up strength and energy, planned around real meals and routines." },
];

const VALUES = [
  { icon: Users, title: "Respect", body: "Every person treated with dignity, kindness and compassion." },
  { icon: ShieldCheck, title: "Integrity", body: "Honesty, accountability and transparency, including about what we do not know." },
  { icon: Lightbulb, title: "Innovation", body: "Curiosity, evidence and continuous learning, not novelty for its own sake." },
  { icon: Heart, title: "Professional pride", body: "High standards of care, held consistently." },
];

const REGULATION = [
  { term: "Physicians", detail: "Licensed and regulated by the College of Physicians and Surgeons of British Columbia (CPSBC)." },
  { term: "Nurses", detail: "Licensed and regulated by the BC College of Nurses and Midwives (BCCNM)." },
  // Compliance wording from the v2 copy deck (Julia's sign-off pending before launch).
  { term: "Uninsured services", detail: "Provided in line with CPSBC standards. Monarch does not bill MSP. Fees are disclosed in writing before any service begins." },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        breadcrumb="About"
        eyebrow="About Monarch Health"
        title="A physician-led practice on Vancouver Island"
        body="Physicians, nurses and allied health professionals working together so that people can stay well, and stay at home, for longer."
        actions={[
          { label: "Meet the care team", href: "#care-team", variant: "secondary" },
          { label: "Our story", href: "#our-story", variant: "link" },
        ]}
        reassurance={false}
        image={IMAGES.about.hero}
      />
      <CredentialsBand />

      {/* A message from Monarch Health */}
      <Section tone="white" labelledBy="message-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:gap-24">
          <div className="flex flex-col gap-7">
            <Eyebrow>
              <span id="message-heading">A message from Monarch Health</span>
            </Eyebrow>
            <blockquote>
              <p className="font-serif text-[30px] leading-[1.22] font-light tracking-[-0.01em] text-navy italic lg:text-[40px]">
                “Living longer is an achievement. Living better is our purpose.”
              </p>
            </blockquote>
          </div>
          <div className="flex flex-col gap-5 lg:pt-9">
            <p className="type-lead leading-[1.65] text-body">
              Most of us have lived through a version of this: a parent or grandparent slowly loses strength, memory or confidence, and a family sees how much of life rests on abilities we take for granted.
            </p>
            <p className="type-lead leading-[1.65] text-body">
              Much of the healthcare system is built to respond to illness, not to preserve independence. Monarch brings physicians, nurses and allied health together so that staying well at home gets the time and attention it deserves. We build on family medicine and on Canada’s public healthcare system.
            </p>
            <p className="text-[14px] font-semibold leading-[1.4] text-navy">The Monarch Health team · More Life in Every Year</p>
          </div>
        </div>
      </Section>

      {/* Care team: discipline icons, no photos */}
      <Section tone="cream" id="care-team" labelledBy="team-heading">
        <SectionHeading id="team-heading" eyebrow="Our care team" title="One team, working from one plan" />
        <HairlineGrid items={TEAM} columns={3} titleSize="xl" className="mt-10 lg:mt-14" />
      </Section>

      {/* Values */}
      <Section tone="white" labelledBy="values-heading">
        <SectionHeading id="values-heading" eyebrow="What we stand for" title="Our values" />
        <HairlineGrid items={VALUES} columns={4} className="mt-10 lg:mt-14" />
      </Section>

      {/* Regulation and responsibility (navy) */}
      <Section tone="navy" labelledBy="regulation-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-24" data-compliance="regulation">
          <SectionHeading id="regulation-heading" eyebrow="Accountable care" title="Regulation and responsibility" onNavy size="band" />
          <dl className="border-t border-navy-line">
            {REGULATION.map((r) => (
              <div key={r.term} className="flex flex-col gap-2 border-b border-navy-line py-[22px] sm:flex-row sm:gap-8">
                <dt className="font-serif text-[22px] leading-[1.25] text-white sm:w-[200px] sm:shrink-0">{r.term}</dt>
                <dd className="max-w-[400px] text-[17px] leading-[1.55] text-on-navy">{r.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Our story and land acknowledgment */}
      <Section tone="cream" id="our-story" ariaLabel="Our story and land acknowledgment">
        <div className="grid gap-12 md:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4 border-t border-navy pt-7">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="font-serif text-[32px] leading-[1.15] font-light lg:text-[40px]">Our story</h2>
            <p className="type-lead text-body">Why a group of family physicians built Monarch Health.</p>
          </div>
          <div className="flex flex-col gap-4">
            <Photo image={IMAGES.about.landAck} radius="md" sizes="(min-width: 1440px) 568px, (min-width: 768px) 45vw, 100vw" className="aspect-[568/300] w-full" />
            <h2 className="type-h3 pt-1 text-[24px] lg:text-[28px]">Land acknowledgment</h2>
            <p className="text-[16px] leading-[1.65] text-body">
              Monarch Health operates on the traditional, ancestral and unceded territories of the lək̓ʷəŋən-speaking peoples and the W̱SÁNEĆ peoples.
            </p>
          </div>
        </div>
      </Section>

      <CtaBand
        headline="Don’t wait for a crisis to become the care plan."
        body="Start with a conversation. We will listen, explain how Ageing in Place works for your situation, and send a clear written quote, with no obligation."
      />
    </>
  );
}
