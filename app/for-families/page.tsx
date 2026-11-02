import type { Metadata } from "next";
import { ClipboardCheck, FileText, ShieldCheck } from "lucide-react";
import { CredentialsBand } from "@/components/sections/credentials";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { ButtonLink, TextLink } from "@/components/ui/actions";
import { EditorialCard, ToolCard } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/layout";
import { HairlineGrid, TickList } from "@/components/ui/lists";
import { Photo } from "@/components/ui/photo";
import { IMAGES } from "@/lib/images";
import { PENDING, ROUTES } from "@/lib/site";

/*
 * For families v2 (Figma 58:382 desktop, 58:722 mobile). Copy: v2 copy
 * deck, section 10. Tool pages, guides, BC forms, the resource library and
 * the caregiver community do not exist yet, so "All tools", "Start this
 * check", "Open", "Join the caregiver community" and "Home changes to stay
 * independent" are not rendered (v2 build notes, P0-2).
 */
export const metadata: Metadata = {
  title: { absolute: "Help for Families Arranging Care | Monarch Health" },
  description:
    "For the son, daughter or spouse arranging care: free planning tools, guides, BC forms and caregiver support, with family kept informed by consent.",
};

const SITUATIONS = [
  {
    title: "After a fall",
    body: "Balance, strength, medications and the home reviewed quickly, so it does not happen again.",
    photo: IMAGES.families.afterFall,
    href: `${ROUTES.ageingInPlace}#what-it-includes`,
  },
  {
    title: "After a hospital discharge",
    body: "The weeks when readmission is most likely, covered by someone with the discharge summary.",
    photo: IMAGES.families.afterDischarge,
    href: `${ROUTES.careAtHome}#after-hospital`,
  },
  {
    title: "A gradual realization",
    body: "Things are no longer quite manageable, and nobody is sure what to do first.",
    photo: IMAGES.families.gradual,
    href: ROUTES.howItWorks,
  },
];

const TOOLS = [
  { badge: "For families assessing an older parent", title: "Daily Living Assessment", body: "14 questions on the daily tasks that matter most for staying safe at home.", time: "About 10 minutes" },
  { badge: "For families noticing changes", title: "Memory Concerns Check", body: "8 short questions answered by a family member about someone they care for.", time: "About 4 minutes" },
  { badge: "For adults over 60", title: "Mood Check for Older Adults", body: "A short 15-question check for low mood.", time: "About 5 minutes" },
  { badge: "For family caregivers", title: "Caregiver Strain Index", body: "13 questions about how caregiving is affecting you.", time: "About 5 minutes" },
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
        image={IMAGES.families.hero}
      />
      <CredentialsBand />

      {/* When families usually call */}
      <Section tone="white" labelledBy="when-heading">
        <SectionHeading id="when-heading" eyebrow="Where it starts" title="When families usually call" />
        <ul className="mt-10 grid gap-10 md:grid-cols-3 lg:mt-14">
          {SITUATIONS.map((s) => (
            <EditorialCard key={s.title} image={s.photo} title={s.title} body={s.body} titleSize="lg" action={<TextLink href={s.href}>What we do</TextLink>} />
          ))}
        </ul>
      </Section>

      {/* Free planning tools */}
      <Section tone="cream" id="tools" labelledBy="tools-heading">
        <SectionHeading
          id="tools-heading"
          eyebrow="Free planning tools"
          title="Established checks clinicians use, free for anyone."
          lead="Each one scores in your browser, explains the result in plain words, and says what to do next. Your answers are never sent to us. These are screening tools, not diagnoses."
        />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {TOOLS.map((t) => (
            <ToolCard
              key={t.title}
              {...t}
              action={
                <ButtonLink href={PENDING} variant="secondary">
                  Start this check
                </ButtonLink>
              }
            />
          ))}
        </ul>
      </Section>

      {/* The rest of the toolkit */}
      <Section tone="white" id="toolkit" labelledBy="toolkit-heading">
        <SectionHeading id="toolkit-heading" eyebrow="The rest of the toolkit" title="Guides, forms and trusted services" />
        <HairlineGrid
          columns={3}
          titleSize="lg"
          className="mt-10 lg:mt-14"
          items={[
            { icon: ClipboardCheck, title: "Monarch guides", body: "Practical aids for the moments families get stuck." },
            { icon: FileText, title: "Forms & applications", body: "Direct links to the official BC and Canadian forms families most often need." },
            { icon: ShieldCheck, title: "Resource library", body: "Organizations and services across BC, most free and publicly funded, with why we trust each." },
          ]}
        />
      </Section>

      {/* Caregiver support (the page's one sand section) */}
      <Section tone="sand" id="caregiver-support" labelledBy="caregiver-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-center lg:gap-16 xl:gap-24">
          <Photo image={IMAGES.families.caregiverSupport} sizes="(min-width: 1440px) 520px, (min-width: 1024px) 40vw, 100vw" className="aspect-[4/3] w-full lg:aspect-auto lg:h-[390px]" />
          <SectionHeading
            id="caregiver-heading"
            eyebrow="Caregiver support"
            title="Looking after yourself while caregiving"
            lead="Getting a parent assessed when they do not want to be. Navigating home support and what is actually covered. Siblings who do not agree. Looking after yourself while doing this. The practical questions are answerable."
          />
        </div>
      </Section>

      {/* Family in the loop */}
      <Section tone="cream" labelledBy="loop-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,460px)_minmax(0,640px)] lg:justify-between lg:gap-24">
          <SectionHeading id="loop-heading" eyebrow="With consent" title="Family kept in the loop, on the person’s terms" />
          <TickList
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
