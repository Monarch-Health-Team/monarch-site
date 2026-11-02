import Link from "next/link";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { LogoLockup } from "@/components/site/logo";
import { DirectionsLink } from "@/components/ui/actions";
import { Container } from "@/components/ui/layout";
import { FOOTER_COLUMNS, LEGAL_LINKS, ROUTES, SITE, type FooterLink } from "@/lib/site";

const LAND_ACK =
  "Monarch Health operates on the traditional, ancestral and unceded territories of the lək̓ʷəŋən-speaking peoples, today known as the Songhees and Esquimalt Nations, and of the W̱SÁNEĆ peoples whose relationships with this land continue to this day.";

// Compliance (handoff notes 1 and 3): follows Julia's final MSP wording once signed off.
const TRANSPARENCY =
  "Monarch does not bill the Medical Services Plan (MSP). Fees cover uninsured services only and are itemized in writing before you begin. Insured services remain available through MSP and are not scheduled on a priority basis. Our physicians and nurses are registered with CPSBC and BCCNM. In an emergency, call 911.";

/** Footer links: 15px, 44px tall hit areas (v2 P2-3). Pending destinations are not listed. */
function LinkList({ links }: { links: FooterLink[] }) {
  const live = links.filter((l): l is { label: string; href: string } => l.href !== null);
  return (
    <ul className="flex flex-col">
      {live.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="inline-flex min-h-11 items-center text-[15px] leading-[1.5] text-white/95 hover:text-white hover:underline underline-offset-4">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Mobile accordion group (v2 P1-9): 48px trigger on a #2A4689 hairline. */
function FoldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b border-navy-line">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3.5 text-[15px] font-semibold text-white [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <Plus aria-hidden="true" className="size-[18px] shrink-0 text-on-navy transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none" strokeWidth={1.75} />
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

/*
 * Global footer v2: navy, 96px top and 48px bottom padding at 1440. Brand
 * column 360px (blurb, address, phone, email), three link columns with
 * #AEB9D3 caps headings, a #2A4689 hairline, then the legal notes and the
 * bottom row. On mobile the link groups and legal notes fold into an
 * accordion, with extra bottom room for the sticky Book bar.
 */
export function SiteFooter() {
  const legal = LEGAL_LINKS.filter((l): l is { label: string; href: string } => l.href !== null);
  return (
    <footer className="on-navy bg-navy pt-[72px] pb-[112px] text-on-navy md:pb-12 lg:pt-24">
      <Container className="flex flex-col gap-7 md:gap-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-12">
          <div className="flex max-w-[360px] flex-col gap-5">
            <Link href={ROUTES.home} className="self-start rounded-md" aria-label="Monarch Health home">
              <LogoLockup tone="dark" />
            </Link>
            <p className="text-[15px] leading-[1.6]">{SITE.description}</p>
            <address className="flex flex-col text-[15px] leading-[1.7] not-italic">
              <span className="inline-flex min-h-11 items-center">{SITE.address}</span>
              <DirectionsLink onNavy className="-mt-2 self-start" />
              <a href={SITE.phoneHref} className="inline-flex min-h-11 items-center self-start text-white hover:underline underline-offset-4">
                {SITE.phoneDisplay}
              </a>
              <a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center self-start text-white hover:underline underline-offset-4">
                {SITE.email}
              </a>
            </address>
          </div>

          <div className="hidden gap-10 md:flex lg:gap-20">
            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={`Footer: ${col.title}`} className="flex flex-col gap-1.5">
                <h2 className="text-[12px] font-semibold uppercase leading-[1.3] tracking-[0.14em] text-on-navy-muted">{col.title}</h2>
                <LinkList links={col.links} />
              </nav>
            ))}
          </div>
        </div>

        {/* Mobile: link groups and legal notes as an accordion. */}
        <div className="border-t border-navy-line md:hidden">
          {FOOTER_COLUMNS.map((col) => (
            <FoldGroup key={col.title} title={col.title}>
              <nav aria-label={`Footer: ${col.title}`}>
                <LinkList links={col.links} />
              </nav>
            </FoldGroup>
          ))}
          <FoldGroup title="Transparency and care standards">
            <p className="text-[14px] leading-[1.65] text-on-navy-muted" data-compliance="msp-wording">
              {TRANSPARENCY}
            </p>
          </FoldGroup>
          <FoldGroup title="Land acknowledgment">
            <p className="text-[14px] leading-[1.65] text-on-navy-muted">{LAND_ACK}</p>
          </FoldGroup>
        </div>

        <div className="hidden grid-cols-2 gap-16 border-t border-navy-line pt-14 text-[13px] md:grid">
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold leading-[1.4] text-white">Land acknowledgment</h2>
            <p className="leading-[1.65] text-on-navy-muted">{LAND_ACK}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-semibold leading-[1.4] text-white">Transparency and care standards</h2>
            <p className="leading-[1.65] text-on-navy-muted" data-compliance="msp-wording">
              {TRANSPARENCY}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-[13px] leading-[1.5] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-on-navy-muted">© 2026 Monarch Health</p>
          {legal.length > 0 ? (
            <ul className="flex flex-wrap gap-x-7">
              {legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-on-navy hover:text-white hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
