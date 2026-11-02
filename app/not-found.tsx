import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { ButtonLink, PhoneLink } from "@/components/ui/actions";
import { Container, Eyebrow } from "@/components/ui/layout";
import { PRIMARY_NAV, ROUTES } from "@/lib/site";

/* 404 v2 (Figma 60:741 desktop, 60:886 mobile). Copy: v2 copy deck; noindex. */
export const metadata: Metadata = {
  title: { absolute: "Page Not Found | Monarch Health" },
  description: "The page you were looking for could not be found. Return to the Monarch Health home page or call (250) 818-4425.",
  robots: { index: false, follow: false },
};

const LINKS = [...PRIMARY_NAV, { label: "Book an assessment", href: ROUTES.book }];

export default function NotFound() {
  return (
    <section aria-labelledby="page-title" className="bg-cream py-[72px] lg:py-[120px]">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-end lg:gap-20">
        <div className="flex flex-col gap-6">
          <Eyebrow>Error 404</Eyebrow>
          <p aria-hidden="true" className="font-serif text-[120px] leading-[0.9] font-extralight tracking-[-0.04em] text-navy lg:text-[200px]">
            404
          </p>
          <div className="flex flex-col gap-4">
            <h1 id="page-title" className="type-h2-band max-w-[520px]">
              We can’t find that page.
            </h1>
            <p className="type-lead max-w-[500px] text-body">The link may be out of date, or the page may have moved. Try one of these pages instead.</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2 sm:gap-4">
            <ButtonLink href={ROUTES.home}>Home</ButtonLink>
            <ButtonLink href={ROUTES.book} variant="secondary">
              Book an assessment
            </ButtonLink>
          </div>
          <p className="flex items-center gap-2.5 text-[15px] leading-[1.4] text-muted">
            <Phone aria-hidden="true" className="size-4 shrink-0 text-navy" strokeWidth={1.75} />
            <span>Prefer to talk first? Call <PhoneLink />.</span>
          </p>
        </div>
        <nav aria-label="Helpful pages">
          <ul className="border-t border-navy">
            {LINKS.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link href={l.href} className="group flex min-h-14 items-center justify-between gap-4 py-4 font-serif text-[22px] leading-[1.25] text-navy hover:text-action-hover">
                  <span className="decoration-1 underline-offset-4 group-hover:underline">{l.label}</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-[18px] shrink-0 text-action transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                    strokeWidth={2}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
