import Link from "next/link";
import { LogoLockup } from "@/components/site/logo";
import { SmartLink } from "@/components/ui/actions";
import { Container } from "@/components/ui/layout";
import { FOOTER_COLUMNS, LEGAL_LINKS, ROUTES, SITE } from "@/lib/site";

/** Global footer (Figma 20:383): logo blue, 1px white-20% top rule, 72/48px padding. */
export function SiteFooter() {
  return (
    <footer className="on-navy border-t border-white/20 bg-navy pt-14 pb-10 text-on-navy lg:pt-[72px] lg:pb-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="flex max-w-[280px] flex-col gap-4">
            <Link href={ROUTES.home} className="self-start rounded-md" aria-label="Monarch Health home">
              <LogoLockup tone="dark" />
            </Link>
            <p className="text-[14px] leading-[1.55]">
              Physician-led Ageing in Place and care at home. Greater Victoria &amp; Vancouver Island, British Columbia.
            </p>
            <p className="text-[14px] leading-[1.55]">
              {SITE.address} ·{" "}
              <a href={SITE.phoneHref} className="hover:text-white hover:underline">
                {SITE.phoneDisplay}
              </a>{" "}
              ·{" "}
              <a href={`mailto:${SITE.email}`} className="hover:text-white hover:underline">
                {SITE.email}
              </a>
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={`Footer: ${col.title}`}>
              <h2 className="text-[14px] font-semibold text-white">{col.title}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink href={link.href} className={`text-[14px] ${link.href ? "hover:text-white hover:underline" : ""}`}>
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/15 pt-8 text-[13px] leading-[1.6]">
          <div>
            <h2 className="font-semibold text-white">Land acknowledgment</h2>
            <p className="mt-1.5 text-on-navy-muted">
              Monarch Health operates on the traditional, ancestral and unceded territories of the lək̓ʷəŋən-speaking peoples, today known as the Songhees and Esquimalt Nations, and of the W̱SÁNEĆ peoples whose relationships with this land continue to this day.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-white">Transparency &amp; care standards</h2>
            {/* Compliance (handoff note 1/3): follows Julia's final MSP wording once signed off. */}
            <p className="mt-1.5 text-on-navy-muted" data-compliance="msp-wording">
              Monarch does not bill the Medical Services Plan (MSP). Fees cover uninsured services only and are itemized in writing before you begin. Insured services remain available through MSP and are not scheduled on a priority basis. Our physicians and nurses are registered with CPSBC and BCCNM. In an emergency, call 911.
            </p>
          </div>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Monarch Health</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <SmartLink href={link.href}>{link.label}</SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
