import { ButtonLink } from "@/components/ui/actions";
import { Container } from "@/components/ui/layout";
import { ROUTES, SITE } from "@/lib/site";

/*
 * Bottom CTA band (handoff "Bottom CTA band"): cream, 1px #E2D6C2 rules top
 * and bottom, 80px padding. Headline 40px #D94000 (large text only, 3.8:1),
 * body 17px #B23400. Text left, buttons right.
 */
export function CtaBand({ headline, body }: { headline: string; body: string }) {
  return (
    <section aria-labelledby="cta-heading" className="border-y border-line bg-cream py-16 lg:py-20">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="flex flex-col gap-4">
          {/* Never below 24px: #D94000 only passes contrast as large text. */}
          <h2 id="cta-heading" className="max-w-[640px] font-serif text-[30px] leading-[1.16] tracking-[-0.01em] text-accent sm:text-[34px] lg:text-[40px]">
            {headline}
          </h2>
          <p className="max-w-[560px] text-[17px] leading-[1.55] text-accent-text">{body}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3.5">
          <ButtonLink href={ROUTES.book} variant="cta">
            Book an assessment
          </ButtonLink>
          <ButtonLink href={SITE.phoneHref} variant="cta-secondary">
            Call {SITE.phoneDisplay}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
