import type { Metadata } from "next";
import { Activity, CalendarDays, ClipboardCheck, Eye, Heart, House, Lightbulb, MessageSquare, Phone, Pill, ShieldCheck, Users } from "lucide-react";
import { Boundaries } from "@/components/sections/boundaries";
import { CredentialsBand } from "@/components/sections/credentials";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/ui/layout";
import { FeatureList, HairlineGrid, TickList } from "@/components/ui/lists";
import { Photo } from "@/components/ui/photo";
import { IMAGES } from "@/lib/images";
import { ROUTES } from "@/lib/site";

/*
 * Care at Home v2 (Figma 56:567 desktop, 56:893 mobile). Copy: v2 copy
 * deck, section 10. Hero photo per Decision 1 (after-hospital-discharge at
 * object-position 60% 50%).
 */
export const metadata: Metadata = {
  title: { absolute: "Home Care and Nursing in Victoria, BC | Monarch Health" },
  description:
    "Home care and nursing by registered nurses, delivered as part of one clinical plan with one point of contact. Greater Victoria and Vancouver Island.",
};

const HOME_CARE = [
  { icon: Heart, title: "Support with daily living", body: "Personal care, bathing, dressing, mobility assistance, meals and medication reminders, at whatever level is genuinely needed." },
  { icon: Pill, title: "Nursing care at home", body: "Clinical care by registered nurses, including monitoring, wound care and medication management." },
  { icon: Users, title: "A named care coordinator", body: "One person who knows the situation and can be reached." },
  { icon: House, title: "Care that adjusts as needs change", body: "Reviewed regularly and changed with the situation." },
  { icon: CalendarDays, title: "Communication with the family", body: "Regular, plain-language updates, with the person’s consent." },
];

const NURSING = [
  { icon: Lightbulb, title: "A small nursing team who know the plan", body: "The same registered nurses wherever possible." },
  { icon: Eye, title: "Wound, catheter and ostomy care", body: "Routine clinical care done properly at home, on a schedule." },
  { icon: MessageSquare, title: "Medication management", body: "Reconciliation, administration where needed, and a check on what has actually been taken." },
  { icon: Phone, title: "Monitoring between appointments", body: "Observations recorded and passed to the physician." },
  { icon: ClipboardCheck, title: "The weeks after a hospital stay", body: "Covered by someone who has the discharge summary and can reach the physician." },
];

export default function CareAtHomePage() {
  return (
    <>
      <Hero
        breadcrumb="Care at Home"
        eyebrow="Care at Home"
        title="When care needs to come to you"
        body="Home care usually arrives abruptly: after a fall, a discharge, or a gradual realization that things are no longer manageable. What tends to go wrong is not the care but the coordination. Monarch delivers it as part of a single clinical plan, with one point of contact."
        actions={[
          { label: "Book an assessment", href: ROUTES.book, variant: "primary" },
          { label: "Speak with our team", href: ROUTES.book, variant: "secondary" },
        ]}
        image={IMAGES.careAtHome.hero}
      />
      <CredentialsBand />

      {/* One plan, one point of contact */}
      <Section tone="white" spacing="compact" ariaLabel="One plan, one point of contact">
        <HairlineGrid
          columns={3}
          titleSize="lg"
          headingLevel="p"
          items={[
            { icon: ClipboardCheck, title: "One clinical plan", body: "Assessment, home support and nursing work from the same plan." },
            { icon: Activity, title: "One named coordinator", body: "So the family is not the one doing the coordinating." },
            { icon: ShieldCheck, title: "Adjusts as needs change", body: "Reviewed regularly, not left fixed until something breaks." },
          ]}
        />
      </Section>

      {/* Home Care */}
      <Section tone="cream" id="home-care" labelledBy="home-care-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-start lg:gap-16 xl:gap-24">
          <div className="flex flex-col gap-8">
            <SectionHeading id="home-care-heading" eyebrow="Home Care" title="Home Care" lead="Hands-on support when assistance is required, integrated into your clinical plan." />
            <FeatureList items={HOME_CARE} />
          </div>
          <Photo image={IMAGES.careAtHome.homeCare} sizes="(min-width: 1440px) 520px, (min-width: 1024px) 40vw, 100vw" className="aspect-[4/3] w-full lg:aspect-auto lg:h-[640px]" />
        </div>
      </Section>

      {/* Nursing */}
      <Section tone="white" id="nursing" labelledBy="nursing-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-start lg:gap-16 xl:gap-24">
          <Photo image={IMAGES.careAtHome.nursing} sizes="(min-width: 1440px) 520px, (min-width: 1024px) 40vw, 100vw" className="aspect-[4/3] w-full lg:aspect-auto lg:h-[640px]" />
          <div className="flex flex-col gap-8">
            <SectionHeading
              id="nursing-heading"
              eyebrow="Nursing"
              title="Nursing"
              lead="Clinical care delivered where someone lives, by registered nurses working from the same plan as everyone else on the team."
            />
            <FeatureList items={NURSING} />
          </div>
        </div>
      </Section>

      {/* After a hospital stay (the page's one sand section) */}
      <Section tone="sand" id="after-hospital" labelledBy="hospital-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-24">
          <SectionHeading
            id="hospital-heading"
            eyebrow="Coming home from hospital"
            title="The weeks after a hospital stay"
            lead="This is when readmission is most likely. We plan the return home with the family, review medications, and arrange nursing and support from day one."
          />
          <TickList items={["Discharge summary reviewed", "Medications reconciled", "Home set up safely", "Nursing visits scheduled", "Physician kept informed"]} className="lg:mt-2" />
        </div>
      </Section>

      <Boundaries
        items={[
          "Not a substitute for publicly funded home and community care or nursing. We help families access those services where they are eligible.",
          "Not residential or long-term care, 24-hour care, or an emergency service.",
          "No faster access to MSP-covered tests, treatments or specialist referrals.",
        ]}
      />

      <CtaBand
        headline="Need support at home soon?"
        body="Tell us what is happening. We will explain what is possible, how quickly it can start, and send a written quote."
      />
    </>
  );
}
