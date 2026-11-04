import Link from "@/components/site/live-link";
import { Mail } from "lucide-react";
import { COMPLIANCE } from "@/lib/compliance";
import { FOOTER_NAV, LEGAL_NAV } from "@/lib/nav";
import { SITE } from "@/lib/site";
import { Container } from "@/components/primitives";
import { Logo } from "./logo";
import { StandardsDisclosure } from "./standards-disclosure";

/**
 * Site footer.
 *
 * Carries the five notices that must appear on every page (R4.1 / TC-1.1):
 * regulation, nurse regulation, fees, enrollment and transparency. All five
 * render verbatim from lib/compliance.ts. It also names the licensee
 * responsible for site content, per CPSBC §2.5–2.6 (TC-1.11).
 *
 * The notices are rendered in the document on every page but folded behind
 * a toggle by default (decided 9 Sep 2026, to shrink the footer). They are
 * still in the DOM, so search engines and screen readers reach them; a
 * sighted reader clicks the centred heading to open them.
 */
/**
 * Brand marks. Lucide v1 removed its brand icon set, so these are inline.
 * All three are decorative — the accessible name lives on the anchor.
 */
function InstagramIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-11h4v1.5A5 5 0 0 1 16 8z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

/** Facebook's "f", drawn in the same outline style as the two above. */
function FacebookIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/**
 * One nav column's heading + list. Extracted so it can be used on its own
 * (Learn) or stacked two-to-a-slot (everything else) without repeating the
 * markup.
 */
function FooterNavGroup({
  heading,
  id = `footer-${heading}`,
  links,
  className,
  continued = false,
}: {
  heading: string;
  /** Needed when the heading has a space: aria-labelledby reads a list of ids. */
  id?: string;
  links: { label: string; href: string }[];
  className?: string;
  /** The second half of a list that is split in two (Learn, Jeffrey, 20 Oct
      2026): no visible heading, but the first row lines up with the first
      half's. It is named for screen readers instead. */
  continued?: boolean;
}) {
  return (
    <nav
      aria-labelledby={continued ? undefined : id}
      aria-label={continued ? `${heading}, continued` : undefined}
      className={className}
    >
      {/* Orange, not navy (client request, 19 Sep 2026: every footer title
          in orange) — the one deliberate exception to Rule 01 here, since
          these are labels rather than controls, and it is what makes six
          short lists read as six distinct sections against a solid navy
          field. */}
      {continued ? (
        <span aria-hidden className="label-mono hidden lg:invisible lg:block">
          {heading}
        </span>
      ) : (
        <h2 id={id} className="label-mono text-orange-400">
          {heading}
        </h2>
      )}
      {/* 17px links in 48px rows (v4): adjacent targets do not overlap. */}
      <ul className="mt-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex min-h-12 items-center justify-center text-[17px] leading-6 text-navy-100 md:justify-start transition-colors duration-brand hover:text-orange-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-navy border-t-[3px] border-orange-600 bg-navy-950 text-white">
      {/* pb-[39px], not pt-16's 64px: reduced by 25px below the closing
          copyright row on 19 Sep 2026 — the row itself already carries
          visual weight, so it did not need the same 64px the top of the
          footer does. */}
      <Container className="pt-8 pb-[20px]">
        {/* Content-sized columns spaced with justify-between, not four equal
            grid tracks (client request, 19 Sep 2026): an equal-fr grid gave
            Membership/Research the same width as Learn, so it sat well
            short of the right edge with a wide dead gap before it, and
            Practice/Company had the same problem in the middle. Each column
            below is only as wide as it needs to be, the brand block anchors
            the left edge, Membership/Research now anchors the right edge,
            and justify-between spaces Learn and Practice/Company evenly
            between the two. Widths are fixed rather than content-driven, so
            the shape holds however the lists grow.

            Learn (13 links, 594px at 1280) must stay the tallest column.
            Practice + Company is 5 + 5 = 10 links (504px), Membership +
            Research 5 + 6 = 11 (548px), For organisations 2 links plus the
            land acknowledgment (359px; 9 lines at 192px wide), and the
            brand block 288px (27 Sep 2026). A label that wraps does not
            add height, because a two-line link still fits the 44px row.
            The five `lg` widths (240, 192, 128, 160, 192) add up to 912px,
            which fits the 928px row at 1024. Re-measure whenever a list
            gains an entry: stacking For organisations under any other group
            makes that column taller than Learn. */}
        <div className="flex flex-col gap-5 text-center md:grid md:grid-cols-2 md:text-left md:gap-x-5 md:gap-y-6 lg:flex lg:flex-row lg:flex-wrap lg:items-start lg:justify-between lg:gap-x-0 lg:gap-y-5">
          {/* lg:gap-x-0 cancels the base gap-10's horizontal contribution:
              `gap` sets a floor that justify-between must add space on top
              of, and the base 40px floor was enough, on top of the five
              fixed widths above, to force an early wrap around 1024–1150px
              — well before the columns actually ran out of room. With no
              floor, justify-between alone decides the horizontal spacing,
              down to the real fit-or-wrap point. */}
          {/* lg:self-center (client request, 27 Sep 2026): from lg the
              brand group sits vertically centred against the row, whose
              height is set by its tallest column, Learn. Below lg it stacks
              as before. */}
          <div className="lg:w-60 lg:self-start">
            <div className="flex justify-center md:justify-start">
              <Logo
                variant="reversed"
                width={260}
                mobileWidth={232}
                desktopFrom="md"
                tagline={SITE.tagline}
              />
            </div>
            <p className="mt-2 text-body-sm text-navy-200 measure-tight max-md:mx-auto">
              {SITE.region}
            </p>
            <div className="mt-6 flex justify-center gap-2 md:justify-start">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-md border border-white/25 text-white transition-colors duration-brand hover:border-orange-500 hover:text-orange-400"
                aria-label="Monarch Health on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-md border border-white/25 text-white transition-colors duration-brand hover:border-orange-500 hover:text-orange-400"
                aria-label="Monarch Health on LinkedIn"
              >
                <LinkedinIcon />
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-md border border-white/25 text-white transition-colors duration-brand hover:border-orange-500 hover:text-orange-400"
                aria-label="Monarch Health on Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex size-11 items-center justify-center rounded-md border border-white/25 text-white transition-colors duration-brand hover:border-orange-500 hover:text-orange-400"
                aria-label={`Email Monarch Health at ${SITE.email}`}
              >
                <Mail aria-hidden className="size-5" />
              </a>
            </div>

            {/* Land acknowledgment, under the logo, tagline and icons (Jeffrey,
                19 Oct 2026; it stood in its own column to the right before). */}
            <div className="mt-6 text-center md:text-left">
              <h2 className="label-mono text-orange-400">
                Land acknowledgment
              </h2>
              <p className="mt-1.5 text-body-sm leading-relaxed text-navy-200">
                Monarch Health operates on the traditional, ancestral and
                unceded territories of the lək̓ʷəŋən-speaking peoples, today
                known as the Songhees and Esquimalt Nations, and of the W̱SÁNEĆ
                peoples whose relationships with this land continue to this day.
              </p>
            </div>

            {/* Responsible licensee (CPSBC §2.5–2.6) removed from the
                footer 2 Oct 2026 at Jeffrey's request, while he clarifies
                the name/credentials with Dr. Sundren. SITE.responsibleLicensee
                is left in lib/site.ts so this can go back in one place once
                confirmed. The site is not yet publicly live (DNS not
                pointed), so this gap does not currently reach a real
                visitor. */}
          </div>

          {/* The nav columns sit together, centred in the space beside the
              brand block, with equal space round each column (Jeffrey,
              20 Oct 2026). Below lg the wrapper vanishes and the groups
              stack as before. */}
          <div className="contents lg:flex lg:flex-1 lg:items-start lg:justify-evenly">
            <FooterNavGroup
              heading="EXPLORE"
              id="footer-explore"
              links={FOOTER_NAV.EXPLORE}
              className="lg:w-56"
            />
            <FooterNavGroup
              heading="CARE PROGRAMMES"
              id="footer-care-programmes"
              links={FOOTER_NAV["CARE PROGRAMMES"]}
              className="lg:w-52"
            />
            <FooterNavGroup
              heading="POLICIES & INFORMATION"
              id="footer-policies"
              links={FOOTER_NAV["POLICIES & INFORMATION"]}
              className="lg:w-60"
            />
          </div>
        </div>

        {/* ---- Mandatory regulatory notices. Verbatim, every page. ----
            The toggle for these now lives in the bottom line below, and
            the notices open upward out of it, so the footer carries one
            row where it used to carry two. See standards-disclosure. */}
        <StandardsDisclosure
          fees={
            /* The one fee and insured-care statement, on every page
               (Jeffrey, 21 Oct 2026), folded like the notices. The approved
               D41 wording, from lib/compliance. */
            <p className="mx-auto max-w-4xl text-center">
              <span className="font-semibold text-white">
                {COMPLIANCE.feeBlock.slice(0, COMPLIANCE.feeBlock.indexOf(":") + 1)}
              </span>
              {COMPLIANCE.feeBlock.slice(COMPLIANCE.feeBlock.indexOf(":") + 1)}
            </p>
          }
          notices={
            /* Columns rather than one stretched line: the notices fill
               the width, and no line runs past the measure. */
            <div className="text-columns space-y-4">
              {/* The five notices were replaced by one statement on
                  8 Oct 2026 (for legal review). The photography notice
                  stays: it is required wherever illustrative imagery is
                  used. */}
              <p>{COMPLIANCE.transparencyStatement}</p>
              <p>{COMPLIANCE.modelPhotoDisclaimer}</p>
            </div>
          }
          trailing={
            /* 44px here too. These sat at 16px, the shortest targets on
               the page - a line of text with nothing around it. They run
               horizontally on a 24px gap, so height costs nothing but
               the row's own height. min-w-11 as well, because "Terms" is
               only 38px of text and a target is two dimensions. */
            <ul className="flex flex-wrap justify-center gap-x-6">
              {LEGAL_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex min-h-11 min-w-11 items-center justify-center transition-colors duration-brand hover:text-orange-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          }
        >
          <p className="shrink-0">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </StandardsDisclosure>
      </Container>
    </footer>
  );
}
