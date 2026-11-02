import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
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
import { Card, IconBadge } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/layout";
import { TickList } from "@/components/ui/lists";
import { ROUTES } from "@/lib/site";

// Care at Home · Figma frame 20:770. Copy exactly as in design-handoff.md.

export const metadata: Metadata = {
  title: "Care at Home",
  description: "Home Care and Nursing delivered as part of a single clinical plan, with one point of contact.",
};

type Feature = { icon: LucideIcon; title: string; body: string };

const HOME_CARE: Feature[] = [
  {
    icon: Heart,
    title: "Support with daily living",
    body: "Personal care, bathing, dressing, mobility assistance, meals and medication reminders, at whatever level is genuinely needed.",
  },
  {
    icon: Pill,
    title: "Nursing care at home",
    body: "Clinical care by registered nurses, including monitoring, wound care and medication management.",
  },
  { icon: Users, title: "A named care coordinator", body: "One person who knows the situation and can be reached." },
  { icon: House, title: "Care that adjusts as needs change", body: "Reviewed regularly and changed with the situation." },
  { icon: Calendar, title: "Communication with the family", body: "Regular, plain-language updates, with the person’s consent." },
];

const NURSING: Feature[] = [
  { icon: Lightbulb, title: "A small nursing team who know the plan", body: "The same registered nurses wherever possible." },
  { icon: Eye, title: "Wound, catheter and ostomy care", body: "Routine clinical care done properly at home, on a schedule." },
  {
    icon: MessageSquare,
    title: "Medication management",
    body: "Reconciliation, administration where needed, and a check on what has actually been taken.",
  },
  { icon: Phone, title: "Monitoring between appointments", body: "Observations recorded and passed to the physician." },
  {
    icon: ClipboardCheck,
    title: "The weeks after a hospital stay",
    body: "Covered by someone who has the discharge summary and can reach the physician.",
  },
];

function FeatureList({ items }: { items: Feature[] }) {
  return (
    <ul className="flex flex-col gap-5">
      {items.map((f) => (
        <li key={f.title} className="flex items-start gap-4">
          <IconBadge icon={f.icon} size="sm" />
          <div>
            <h3 className="text-[17px] font-semibold leading-snug text-navy">{f.title}</h3>
            <p className="mt-1 text-[15px]">{f.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

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
        imageLabel="nurse or caregiver with older adult at home · subject right of centre, left third of frame kept clear"
      />

      {/* One plan, one point of contact (no heading in the frame) */}
      <Section tone="sand" ariaLabel="One plan, one point of contact">
        <ul className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ClipboardCheck, title: "One clinical plan", body: "Assessment, home support and nursing work from the same plan." },
            { icon: Activity, title: "One named coordinator", body: "So the family is not the one doing the coordinating." },
            { icon: ShieldCheck, title: "Adjusts as needs change", body: "Reviewed regularly, not left fixed until something breaks." },
          ].map((item) => (
            <Card as="li" key={item.title} className="sm:p-6">
              <IconBadge icon={item.icon} />
              <h2 className="type-h3 pt-1 text-[21px]">{item.title}</h2>
              <p className="text-[15px]">{item.body}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* Home Care */}
      <Section tone="cream" id="home-care" labelledBy="home-care-heading">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-6">
            <SectionHeading
              id="home-care-heading"
              eyebrow="Home Care"
              title="Home Care"
              intro="Hands-on support when assistance is required, integrated into your clinical plan."
            />
            <FeatureList items={HOME_CARE} />
          </div>
          <ImagePlaceholder label="Home Care at home, candid" tint="blue" className="aspect-[4/3] w-full lg:aspect-auto lg:h-[520px]" />
        </div>
      </Section>

      {/* Nursing */}
      <Section tone="sand" id="nursing" labelledBy="nursing-heading">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <ImagePlaceholder
            label="Nursing at home, candid"
            tint="warm"
            className="order-last aspect-[4/3] w-full lg:order-none lg:aspect-auto lg:h-[520px]"
          />
          <div className="flex flex-col gap-6">
            <SectionHeading
              id="nursing-heading"
              eyebrow="Nursing"
              title="Nursing"
              intro="Clinical care delivered where someone lives, by registered nurses working from the same plan as everyone else on the team."
            />
            <FeatureList items={NURSING} />
          </div>
        </div>
      </Section>

      {/* After a hospital stay */}
      <Section tone="cream" id="after-hospital" labelledBy="hospital-heading">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <div className="flex flex-col gap-4">
            <Eyebrow>Coming home from hospital</Eyebrow>
            <h2 id="hospital-heading" className="type-h2">
              The weeks after a hospital stay
            </h2>
            <p className="max-w-[560px] text-[17px]">
              This is when readmission is most likely. We plan the return home with the family, review medications, and arrange nursing and support from day one.
            </p>
          </div>
          <TickList
            className="lg:justify-self-end lg:pt-2"
            items={[
              "Discharge summary reviewed",
              "Medications reconciled",
              "Home set up safely",
              "Nursing visits scheduled",
              "Physician kept informed",
            ]}
          />
        </div>
      </Section>

      <Boundaries
        tone="sand"
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
