import Link from "@/components/site/live-link";
import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * The lockup.
 *
 * The brand book defines three: consumer (with "A Healthier Way Forward"),
 * partner (with "A Healthspan Management Company"), and primary (no tagline).
 * The artwork here is the PRIMARY lockup. On 19 Sep 2026 the client asked for
 * the partner tagline under the logo in the header, and it was first added as
 * live text overlaid beneath the mark rather than baked into the artwork —
 * the partner lockup was never extracted from the book. That meant
 * right-clicking the header logo and saving the image gave back artwork
 * without the tagline, since the tagline wasn't part of the image file
 * (reported 29 Sep 2026). A first fix baked the two into one raster (.webp)
 * image, which fixed the save but not two follow-on reports: the mark still
 * looked soft at the size people actually view a saved logo at (a raster
 * has a ceiling — this one's master is 560x120, since no vector master
 * exists yet; see docs/BRAND-IMPLEMENTATION.md), and the tagline's
 * descenders were clipped in one revision of that asset.
 *
 * The fix now in place (30 Sep 2026): `public/brand/lockup-*-tagline.svg`.
 * The mark and wordmark are vector paths (traced from the brand book's own
 * raster artwork, since no vector master exists — see the same doc), and the
 * tagline is real SVG `<text>` set in the actual brand font, positioned to
 * match the live CSS measurements exactly (see the render script this was
 * generated with, kept outside the repo). Both scale to any size with no
 * blur and no clipping. `TAGLINE_ASSETS` below maps the one tagline actually
 * in use in this codebase to its SVG pair; any other tagline string falls
 * back to the original live-text overlay, so the component stays usable if
 * the consumer tagline is ever wired up without its own baked asset. The
 * tagline is centred on the wordmark within the artwork (client request, 18
 * Sep 2026). The footer keeps the primary lockup so there is never more than
 * one tagline in a field of view.
 *
 * The traced mark is a reconstruction, not the brand book's authoritative
 * artwork — there isn't one to extract from. Worth swapping for a true
 * vector master if the book is ever revised to include one.
 *
 * Clear space is 8.3% of lockup width on all four sides; at the 168px used in
 * the header that is 14px, applied as padding on the link.
 */
const TAGLINE_ASSETS: Record<string, { primary: string; reversed: string }> = {
  "Professional Healthspan Management": {
    primary: "/brand/Monarch-Health logo.svg",
    reversed: "/brand/Monarch-Health logo (reversed).svg",
  },
};
// Aspect ratio of the composited SVGs (viewBox 2048x578).
const TAGLINE_ASSET_RATIO = 578 / 2048;
export function Logo({
  variant = "primary",
  className,
  width = 232,
  tagline,
}: {
  variant?: "primary" | "reversed";
  className?: string;
  /** Width at md and above. Below that the lockup scales down to fit. */
  width?: number;
  /** Optional line set beneath the mark, e.g. the partner tagline. */
  tagline?: string;
}) {
  const src =
    variant === "reversed"
      ? "/brand/lockup-reversed.webp"
      : "/brand/lockup-primary.webp";

  // Has a pre-composited image with this exact tagline baked in? Use it at
  // sm and above so the rendered <img> is the whole lockup, saveable as one
  // file. Below sm the tagline still doesn't show at all (unchanged from
  // before), so the plain, tagline-less lockup keeps rendering there.
  const taglineAsset = tagline ? TAGLINE_ASSETS[tagline] : undefined;
  const taglineSrc = taglineAsset
    ? variant === "reversed"
      ? taglineAsset.reversed
      : taglineAsset.primary
    : undefined;

  // Clear space is 8.3% of lockup width on all four sides, so it holds at
  // every size: 19px at the 232px desktop lockup, 12px at the 150px mobile
  // one. Applied as padding, so no element can enter the zone.
  const clearSpace = Math.round(width * 0.083);

  return (
    <Link
      href="/"
      /*
       * The clear-space padding sits inside the link, so the artwork started
       * one clear-space in from the container edge while everything else on
       * the row — nav, CTA — began at it. The negative margin cancels that on
       * the left only, so the lockup's left edge lines up with the text
       * column. Clear space is still honoured: the nearest element is the nav,
       * far beyond it, and the viewport edge is a full container gutter away.
       */
      className={`-ml-[8px] inline-flex shrink-0 flex-col items-start p-[8px] md:-ml-[var(--logo-pad)] md:p-[var(--logo-pad)] ${className ?? ""}`}
      style={
        {
          "--logo-pad": `${clearSpace}px`,
          "--logo-w": `${width}px`,
        } as React.CSSProperties
      }
      aria-label={`${SITE.name} - home`}
    >
      {/* Sized to the lockup so the tagline can be placed against the
          wordmark inside the artwork, not against the whole image. */}
      <span className="flex w-[160px] flex-col sm:w-[208px] md:w-[272px] xl:w-[var(--logo-w)]">
        <Image
          src={src}
          alt={SITE.name}
          width={width}
          height={Math.round((width / 560) * 120)}
          priority
          className={taglineSrc ? "h-auto w-full sm:hidden" : "h-auto w-full"}
        />
        {taglineSrc && (
          // The composited SVG (mark + wordmark + tagline, all one vector
          // file — see the block comment above) at sm and above, so what's
          // on screen and what a saved image contains are the same file,
          // and it scales to any size with no blur. `unoptimized` because
          // Next's image optimizer doesn't rasterize SVGs by default (and
          // shouldn't here — there's nothing to gain by rasterizing a
          // vector file), so this serves it as-is.
          <Image
            src={taglineSrc}
            alt={`${SITE.name} - ${tagline}`}
            width={width}
            height={Math.round(width * TAGLINE_ASSET_RATIO)}
            priority
            unoptimized
            className="hidden h-auto w-full sm:block"
          />
        )}
        {tagline && !taglineAsset && (
          /*
           * Fallback for a tagline with no baked asset yet: the tagline is
           * centred under the WORDMARK, not the lockup. In the artwork the
           * butterfly sits top-left and "Monarch Health" runs from 6% to 99%
           * of the image width (measured from the file: M stem at x=34,
           * final h at x=554, of 560). This box spans exactly that range,
           * and flex-centring keeps the text centred on it even when the
           * text is wider than the box at small lockup sizes, which
           * text-align cannot do once the line overflows.
           *
           * The negative top margin eats part of the artwork's own
           * transparent strip below the baseline (19 of 120 source px) so the
           * tagline sits close under the letters.
           */
          <span
            className="-mt-1 ml-[6%] hidden w-[93%] justify-center sm:flex"
          >
            <span
              className={`whitespace-nowrap text-[0.8125rem] leading-none font-semibold ${
                variant === "reversed" ? "text-white/85" : "text-navy-700"
              }`}
            >
              {tagline}
            </span>
          </span>
        )}
      </span>
    </Link>
  );
}
