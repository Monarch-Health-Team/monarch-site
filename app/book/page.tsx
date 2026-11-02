import type { Metadata } from "next";
import { Breadcrumb } from "@/components/sections/breadcrumb";
import { SmartLink, TextLink } from "@/components/ui/actions";
import { Card } from "@/components/ui/card";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Container, Section, SectionHeading } from "@/components/ui/layout";
import { PENDING, SITE } from "@/lib/site";
import { BookingForm } from "./booking-form";

/*
 * Book an assessment · lo-fi only (Figma page 2:2, frame 12:1460). Built
 * simply in the hi-fi style. Copy comes from the lo-fi frame and the handoff;
 * anything without copy is a bracketed, labelled placeholder.
 */

export const metadata: Metadata = {
  title: "Book an assessment",
  description: "Start a conversation with Monarch Health.",
};

// Reused from How it works, "The first three steps" (handoff copy); to confirm for this page.
const NEXT_STEPS = [
  { n: "01", title: "A conversation", body: "Call or book online. Tell us what is happening, with no obligation to continue." },
  { n: "02", title: "An assessment at home", body: "Health, function, home safety and what matters most, reviewed where you actually live." },
  { n: "03", title: "A written plan and quote", body: "Your plan, what is included, and the fees, all in writing before anything begins." },
];

export default function BookPage() {
  return (
    <>
      {/* Page title */}
      <section aria-labelledby="page-title" className="bg-cream pt-10 pb-12 lg:pt-12 lg:pb-16">
        <Container className="flex flex-col gap-4">
          <Breadcrumb current="Book an assessment" />
          <h1 id="page-title" className="type-h1 pt-4">
            Start a conversation
          </h1>
          <p className="max-w-[560px] text-[18px]" data-placeholder="copy">
            [Intro copy to come]
          </p>
        </Container>
      </section>

      {/* Form + contact panel */}
      <Section tone="sand" ariaLabel="Booking form and contact details">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
          <Card className="sm:p-8">
            <BookingForm />
          </Card>
          <div className="flex flex-col gap-5">
            <Card className="gap-2 sm:p-6">
              <h2 className="text-[16px] font-semibold text-navy">Monarch Health</h2>
              <address className="flex flex-col gap-1 text-[15px] not-italic">
                <span>{SITE.address}</span>
                <a href={SITE.phoneHref} className="text-navy hover:underline underline-offset-4">
                  {SITE.phoneDisplay}
                </a>
                <a href={`mailto:${SITE.email}`} className="text-navy hover:underline underline-offset-4">
                  {SITE.email}
                </a>
              </address>
            </Card>
            <ImagePlaceholder label="Map" tint="blue" className="aspect-[16/10] w-full" />
            <Card className="gap-2 sm:p-6">
              <h2 className="text-[16px] font-semibold text-navy" data-placeholder="copy">
                [Referrals card title to come]
              </h2>
              <p className="text-[15px] text-muted" data-placeholder="copy">
                [Referrals card copy to come]
              </p>
              <TextLink href={PENDING}>For clinicians: referrals</TextLink>
            </Card>
          </div>
        </div>
      </Section>

      {/* What happens next */}
      <Section tone="cream" labelledBy="next-heading">
        <SectionHeading id="next-heading" title="What happens next" />
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {NEXT_STEPS.map((s) => (
            <Card as="li" key={s.n} className="sm:p-6">
              <span className="font-serif text-[28px] leading-none text-body" aria-hidden="true">
                {s.n}
              </span>
              <h3 className="type-h3 text-[21px]">{s.title}</h3>
              <p className="text-[15px]">{s.body}</p>
            </Card>
          ))}
        </ol>
      </Section>

      {/* Urgent / 911 notice */}
      <section aria-labelledby="urgent-heading" className="bg-sand py-12 lg:py-16">
        <Container>
          <div className="rounded-[14px] border-[1.5px] border-navy bg-white p-6 sm:p-7">
            <h2 id="urgent-heading" className="text-[17px] font-semibold text-navy">
              If this is urgent
            </h2>
            <p className="mt-2 text-[15px]">
              <span data-placeholder="copy">[Urgent notice copy to come]</span> In an emergency, call{" "}
              <SmartLink href="tel:911" className="font-semibold text-navy underline underline-offset-4">
                911
              </SmartLink>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
