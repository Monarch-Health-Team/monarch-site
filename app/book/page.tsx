import type { Metadata } from "next";
import { CircleAlert, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/sections/breadcrumb";
import { DirectionsLink } from "@/components/ui/actions";
import { Container, Eyebrow } from "@/components/ui/layout";
import { SITE } from "@/lib/site";
import { BookingForm } from "./booking-form";

/*
 * Book an assessment v2 (Figma 42:82 desktop, 60:556 mobile; v2 P1-11).
 * Form column on the left; "What happens next", the navy "Prefer to talk?"
 * card and the urgent Alert beside it. Copy: v2 copy deck, section 10.
 */
export const metadata: Metadata = {
  title: { absolute: "Book an Assessment | Monarch Health, Victoria BC" },
  description:
    "Start a conversation about Ageing in Place or care at home. Tell us who the care is for and we will contact you. No obligation. Call (250) 818-4425.",
};

const NEXT_STEPS = [
  { n: "01", title: "A conversation", body: "Call or book online. Tell us what is happening, with no obligation to continue." },
  { n: "02", title: "An assessment at home", body: "Health, function, home safety and what matters most, reviewed where you actually live." },
  { n: "03", title: "A written plan and quote", body: "Your plan, what is included, and the fees, all in writing before anything begins." },
];

export default function BookPage() {
  return (
    <section aria-labelledby="page-title" className="bg-cream pt-7 lg:pt-[72px] lg:pb-[120px]">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,680px)_minmax(0,1fr)] xl:gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 lg:gap-5">
            <Breadcrumb current="Book an assessment" />
            <Eyebrow>Book an assessment</Eyebrow>
            <h1 id="page-title" className="type-h1-page">
              Start a conversation
            </h1>
            <p className="type-lead max-w-[560px] text-body">
              Tell us a little about who the care is for and what is happening. Someone from our care team will contact you to talk it through. There is no obligation.
            </p>
          </div>
          <div className="-mx-1 rounded-[12px] border border-line bg-white px-5 py-6 sm:mx-0 sm:p-8 lg:rounded-[16px] lg:p-10">
            <BookingForm />
          </div>
        </div>

        <aside
          aria-label="What happens next and other ways to reach us"
          className="-mx-5 mt-4 flex flex-col gap-8 bg-white px-5 pt-16 pb-14 sm:-mx-8 sm:px-8 lg:mx-0 lg:mt-0 lg:gap-6 lg:bg-transparent lg:px-0 lg:pt-[150px] lg:pb-0"
        >
          <div>
            <h2 className="type-h3 text-[24px] lg:text-[28px]">What happens next</h2>
            <ol className="mt-4">
              {NEXT_STEPS.map((s) => (
                <li key={s.n} className="flex gap-4 border-t border-navy py-4 last:border-b lg:border-line lg:py-5 lg:last:border-b-0">
                  <span aria-hidden="true" className="w-11 shrink-0 font-serif text-[32px] leading-none font-extralight text-navy">
                    {s.n}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[16px] font-semibold leading-[1.4] text-navy">
                      <span className="sr-only">Step {s.n}: </span>
                      {s.title}
                    </h3>
                    <p className="text-[16px] leading-[1.55] text-body">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="on-navy flex flex-col gap-3 rounded-[12px] bg-navy p-6 text-on-navy lg:p-7">
            <h2 className="font-serif text-[24px] leading-[1.3] text-white">Prefer to talk?</h2>
            <a href={SITE.phoneHref} className="inline-flex min-h-11 items-center gap-2.5 self-start text-[22px] font-semibold text-white hover:underline underline-offset-4">
              <Phone aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
              {SITE.phoneDisplay}
            </a>
            <p className="text-[16px] leading-[1.65]">
              <a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center break-all text-white hover:underline underline-offset-4">
                {SITE.email}
              </a>
              <br />
              {SITE.address}
            </p>
            <DirectionsLink onNavy className="-mt-2 self-start" />
          </div>

          <div role="note" aria-labelledby="urgent-heading" className="flex items-start gap-3.5 rounded-[12px] border border-error bg-error-tint px-5 py-[18px]">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-[22px] shrink-0 text-error" strokeWidth={1.75} />
            <div className="flex flex-col gap-1 text-[16px] leading-[1.5]">
              <h2 id="urgent-heading" className="text-[16px] font-semibold text-error">
                If this is urgent
              </h2>
              <p className="text-body">Please don’t use this form for anything urgent.</p>
              <p className="font-semibold text-body">
                In an emergency, call{" "}
                <a href="tel:911" className="text-error underline underline-offset-4">
                  911
                </a>
                .
              </p>
            </div>
          </div>
        </aside>
      </Container>
    </section>
  );
}
