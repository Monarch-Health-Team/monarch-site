import { ButtonLink } from "@/components/ui/actions";
import { Container } from "@/components/ui/layout";
import { ROUTES, SITE } from "@/lib/site";

/*
 * Closing CTA v2: cream, a 1px hairline above, centred. Navy Light headline
 * (52–56px desktop), 18px body ink, orange actions (v2 P1-1).
 */
export function CtaBand({ headline, body }: { headline: string; body: string }) {
  return (
    <section aria-labelledby="cta-heading" className="bg-cream pb-[72px] lg:pb-[120px]">
      <Container>
        <div className="flex flex-col items-center gap-7 border-t border-line pt-[72px] text-center">
          <h2 id="cta-heading" className="type-cta max-w-[820px]">
            {headline}
          </h2>
          <p className="type-lead max-w-[620px] text-body">{body}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2 sm:gap-4">
            <ButtonLink href={ROUTES.book}>Book an assessment</ButtonLink>
            <ButtonLink href={SITE.phoneHref} variant="secondary">
              Call {SITE.phoneDisplay}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
