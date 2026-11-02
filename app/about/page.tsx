import type { Metadata } from "next";
import { Activity, ClipboardCheck, Heart, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { TextLink } from "@/components/ui/actions";
import { Card, IconBadge } from "@/components/ui/card";
import { ImagePlaceholder, type Tint } from "@/components/ui/image-placeholder";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { PENDING } from "@/lib/site";

// About · Figma frame 20:1550. Copy exactly as in design-handoff.md.

export const metadata: Metadata = {
  title: "About",
  description: "A physician-led practice on Vancouver Island.",
};

// Role lines are placeholders in the frame (handoff note 6); kept as marked.
const ROLE_PLACEHOLDER = "Short line on their role in keeping people independent at home.";
const TEAM: { title: string; tint: Tint }[] = [
  { title: "Physicians", tint: "blue" },
  { title: "Registered nurses", tint: "warm" },
  { title: "Pharmacists", tint: "sand" },
  { title: "Physiotherapists", tint: "blue" },
  { title: "Occupational therapists", tint: "warm" },
  { title: "Dietitians", tint: "sand" },
];

const VALUES = [
  { icon: ClipboardCheck, title: "Respect", body: "Every person treated with dignity, kindness and compassion." },
  { icon: Activity, title: "Integrity", body: "Honesty, accountability and transparency, including about what we do not know." },
  { icon: ShieldCheck, title: "Innovation", body: "Curiosity, evidence and continuous learning, not novelty for its own sake." },
  { icon: Heart, title: "Professional pride", body: "High standards of care, held consistently." },
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
        imageLabel="care team portrait or clinic at 1823 Fort St · subject right of centre, left third of frame kept clear"
      />

      {/* Founders' message */}
      <Section tone="sand" labelledBy="message-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-12">
          <div className="flex flex-col gap-4">
            <Eyebrow>
              <span id="message-heading">A message from Monarch Health</span>
            </Eyebrow>
            <blockquote>
              <p className="font-serif text-[26px] leading-[1.3] text-navy italic lg:text-[32px]">
                “Living longer is an achievement. Living better is our purpose.”
              </p>
            </blockquote>
          </div>
          <div className="flex flex-col gap-4 text-[17px]">
            <p>
              Most of us have lived through a version of this: a parent or grandparent slowly loses strength, memory or confidence, and a family sees how much of life rests on abilities we take for granted.
            </p>
            <p>
              Much of the healthcare system is built to respond to illness, not to preserve independence. Monarch brings physicians, nurses and allied health together so that staying well at home gets the time and attention it deserves. We build on family medicine and on Canada’s public healthcare system.
            </p>
            <p className="text-[14px] text-muted">The Monarch Health team · More Life in Every Year</p>
          </div>
        </div>
      </Section>

      {/* Care team */}
      <Section tone="cream" id="care-team" labelledBy="team-heading">
        <SectionHeading id="team-heading" eyebrow="Our care team" title="One team, working from one plan" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((m) => (
            <Card as="li" key={m.title} className="gap-4">
              <ImagePlaceholder label="Headshot / team photo" tint={m.tint} className="aspect-[16/10] w-full" />
              <h3 className="type-h3 pt-1 text-[22px]">{m.title}</h3>
              <p className="text-[15px]" data-compliance="care-team-placeholder">
                {ROLE_PLACEHOLDER}
              </p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Values */}
      <Section tone="sand" labelledBy="values-heading">
        <SectionHeading id="values-heading" eyebrow="What we stand for" title="Our values" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {VALUES.map((v) => (
            <Card as="li" key={v.title} className="sm:p-6">
              <IconBadge icon={v.icon} />
              <h3 className="type-h3 pt-1 text-[21px]">{v.title}</h3>
              <p className="text-[15px]">{v.body}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Regulation and responsibility (compliance) */}
      <Section tone="cream" labelledBy="regulation-heading">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <SectionHeading id="regulation-heading" eyebrow="Accountable care" title="Regulation and responsibility" className="max-w-[440px]" />
          <ul className="flex flex-col gap-4">
            <Card as="li" className="gap-2 sm:p-6">
              <h3 className="text-[16px] font-semibold text-navy">Physicians</h3>
              <p className="text-[15px]">Licensed and regulated by the College of Physicians and Surgeons of British Columbia (CPSBC).</p>
            </Card>
            <Card as="li" className="gap-2 sm:p-6">
              <h3 className="text-[16px] font-semibold text-navy">Nurses</h3>
              <p className="text-[15px]">Licensed and regulated by the BC College of Nurses and Midwives (BCCNM).</p>
            </Card>
            <Card as="li" className="gap-2 sm:p-6">
              <h3 className="text-[16px] font-semibold text-navy">Uninsured services</h3>
              {/* Julia's compliance placeholder kept exactly as marked (handoff note 2). */}
              <p className="text-[15px]" data-compliance="julia-placeholder">
                Provided in line with CPSBC standards. Monarch does not bill MSP. Fees are disclosed in advance. [Julia to finalize wording]
              </p>
            </Card>
          </ul>
        </div>
      </Section>

      {/* Our story + land acknowledgment */}
      <Section tone="sand" id="our-story" ariaLabel="Our story and land acknowledgment">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="gap-4">
            <ImagePlaceholder label="Founding physicians, archival-style portrait" tint="blue" className="aspect-[16/7] w-full" />
            <h2 className="type-h3 pt-1 text-[22px]">Our story</h2>
            <p className="text-[15px]">Why a group of family physicians built Monarch Health.</p>
            <TextLink href={PENDING} className="mt-auto">
              Read our story
            </TextLink>
          </Card>
          <Card className="gap-4">
            <ImagePlaceholder label="Landscape photo" tint="warm" className="aspect-[16/7] w-full" />
            <h2 className="type-h3 pt-1 text-[22px]">Land acknowledgment</h2>
            <p className="text-[15px]">
              Monarch Health operates on the traditional, ancestral and unceded territories of the lək̓ʷəŋən-speaking peoples and the W̱SÁNEĆ peoples.
            </p>
          </Card>
        </div>
      </Section>

      <CtaBand
        headline="Don’t wait for a crisis to become the care plan."
        body="Start with a conversation. We will listen, explain how Ageing in Place works for your situation, and send a clear written quote, with no obligation."
      />
    </>
  );
}
