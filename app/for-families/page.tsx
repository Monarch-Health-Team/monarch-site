import type { Metadata } from "next";
import { Activity, ClipboardCheck, ShieldCheck } from "lucide-react";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { ButtonLink, TextLink } from "@/components/ui/actions";
import { Card, IconBadge } from "@/components/ui/card";
import { ImagePlaceholder, type Tint } from "@/components/ui/image-placeholder";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { TickList } from "@/components/ui/lists";
import { PENDING, ROUTES, type Href } from "@/lib/site";

// For families · Figma frame 20:1314. Copy exactly as in design-handoff.md.

export const metadata: Metadata = {
  title: "For families",
  description: "For the family arranging care: free planning tools, guides, forms and caregiver support.",
};

const SITUATIONS: { title: string; body: string; image: string; tint: Tint; href: Href }[] = [
  {
    title: "After a fall",
    body: "Balance, strength, medications and the home reviewed quickly, so it does not happen again.",
    image: "After a fall: family and older adult at home",
    tint: "blue",
    href: `${ROUTES.ageingInPlace}#what-it-includes`,
  },
  {
    title: "After a hospital discharge",
    body: "The weeks when readmission is most likely, covered by someone with the discharge summary.",
    image: "After a hospital discharge: family and older adult at home",
    tint: "warm",
    href: `${ROUTES.careAtHome}#after-hospital`,
  },
  {
    title: "A gradual realization",
    body: "Things are no longer quite manageable, and nobody is sure what to do first.",
    image: "A gradual realization: family and older adult at home",
    tint: "sand",
    href: ROUTES.howItWorks,
  },
];

const TOOLS = [
  {
    audience: "For families assessing an older parent",
    title: "Daily Living Assessment",
    body: "14 questions on the daily tasks that matter most for staying safe at home.",
    time: "About 10 minutes",
  },
  {
    audience: "For families noticing changes",
    title: "Memory Concerns Check",
    body: "8 short questions answered by a family member about someone they care for.",
    time: "About 4 minutes",
  },
  {
    audience: "For adults over 60",
    title: "Mood Check for Older Adults",
    body: "A short 15-question check for low mood.",
    time: "About 5 minutes",
  },
  {
    audience: "For family caregivers",
    title: "Caregiver Strain Index",
    body: "13 questions about how caregiving is affecting you.",
    time: "About 5 minutes",
  },
];

const TOOLKIT = [
  { icon: ClipboardCheck, title: "Monarch guides", body: "Practical aids for the moments families get stuck." },
  { icon: Activity, title: "Forms & applications", body: "Direct links to the official BC and Canadian forms families most often need." },
  {
    icon: ShieldCheck,
    title: "Resource library",
    body: "Organizations and services across BC, most free and publicly funded, with why we trust each.",
  },
];

export default function ForFamiliesPage() {
  return (
    <>
      <Hero
        breadcrumb="For families"
        eyebrow="For families"
        title="For the family arranging care"
        body="Most of our conversations start with a son, daughter or spouse. Caring for someone is a job most people take on with no training, no handover and no end date. You do not have to hold it all together alone."
        actions={[
          { label: "Book an assessment", href: ROUTES.book, variant: "primary" },
          { label: "Try a free planning tool", href: "#tools", variant: "secondary" },
        ]}
        imageLabel="adult child with older parent, outdoors · subject right of centre, left third of frame kept clear"
      />

      {/* When families usually call */}
      <Section tone="sand" labelledBy="when-heading">
        <SectionHeading id="when-heading" eyebrow="Where it starts" title="When families usually call" />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {SITUATIONS.map((s) => (
            <Card as="li" key={s.title} className="gap-4">
              <ImagePlaceholder label={s.image} tint={s.tint} className="aspect-[16/9] w-full" />
              <h3 className="type-h3 pt-1 text-[22px]">{s.title}</h3>
              <p className="text-[15px]">{s.body}</p>
              <TextLink href={s.href} className="mt-auto">
                What we do
              </TextLink>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Free planning tools (handoff note 4: answers must never leave the browser) */}
      <Section tone="cream" id="tools" labelledBy="tools-heading">
        <SectionHeading
          id="tools-heading"
          eyebrow="Free planning tools"
          title="Established checks clinicians use, free for anyone."
          intro="Each one scores in your browser, explains the result in plain words, and says what to do next. Your answers are never sent to us. These are screening tools, not diagnoses."
          introClassName="max-w-[640px]"
          action={<TextLink href={PENDING}>All tools</TextLink>}
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" data-compliance="free-tools">
          {TOOLS.map((t) => (
            <Card as="li" key={t.title} className="gap-2.5 sm:p-6">
              <Eyebrow>{t.audience}</Eyebrow>
              <h3 className="type-h3 text-[21px]">{t.title}</h3>
              <p className="text-[15px]">{t.body}</p>
              <p className="text-[14px] text-muted">{t.time}</p>
              <div className="mt-auto pt-2">
                <ButtonLink href={PENDING} variant="secondary">
                  Start this check
                </ButtonLink>
              </div>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Guides, forms, resource library */}
      <Section tone="sand" id="toolkit" labelledBy="toolkit-heading">
        <SectionHeading id="toolkit-heading" eyebrow="The rest of the toolkit" title="Guides, forms and trusted services" />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {TOOLKIT.map((t) => (
            <Card as="li" key={t.title} className="sm:p-6">
              <IconBadge icon={t.icon} />
              <h3 className="type-h3 pt-1 text-[21px]">{t.title}</h3>
              <p className="text-[15px]">{t.body}</p>
              <TextLink href={PENDING} className="mt-auto">
                Open
              </TextLink>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Caregiver support */}
      <Section tone="cream" id="caregiver-support" labelledBy="caregiver-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <ImagePlaceholder label="two family members talking, warm light" tint="blue" className="aspect-[4/3] w-full lg:aspect-auto lg:h-[380px]" />
          <div className="flex flex-col gap-4">
            <Eyebrow>Caregiver support</Eyebrow>
            <h2 id="caregiver-heading" className="type-h2-sm">
              Looking after yourself while caregiving
            </h2>
            <p className="text-[17px]">
              Getting a parent assessed when they do not want to be. Navigating home support and what is actually covered. Siblings who do not agree. Looking after yourself while doing this. The practical questions are answerable.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
              <ButtonLink href={PENDING} variant="secondary">
                Join the caregiver community
              </ButtonLink>
              <TextLink href={PENDING}>Home changes to stay independent</TextLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Family in the loop (consent: handoff note 5) */}
      <Section tone="sand" labelledBy="loop-heading">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <SectionHeading id="loop-heading" eyebrow="With consent" title="Family kept in the loop, on the person’s terms" className="max-w-[460px]" />
          <TickList
            className="lg:pt-6"
            items={[
              "Plain-language updates on what has changed",
              "Planning conversations held early, while everyone is calm",
              "One named coordinator, so you are not the one coordinating",
              "A written summary after every review",
            ]}
          />
        </div>
      </Section>

      <CtaBand
        headline="Arranging care for someone you love?"
        body="Start with a conversation. We will help you understand the options, including publicly funded services they may be eligible for."
      />
    </>
  );
}
