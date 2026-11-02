import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/sections/breadcrumb";
import { ButtonLink, TextLink, type ButtonVariant } from "@/components/ui/actions";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import type { Href } from "@/lib/site";

export type HeroAction = {
  label: string;
  href: Href;
  /** Button variant, or "link" for a text link with an arrow. */
  variant: ButtonVariant | "link";
};

/*
 * Hero · 30/70 treatment (handoff "Hero"), desktop ≥1024px:
 * - 640px tall, cream, directly under the header.
 * - Content column = left 30%; image = right 70%, full height, no radius.
 * - Overlay gradient over the image's left clear zone (x432–734 at 1440,
 *   i.e. 30% → 50.97%): cream 97% → 70% at 55% → 0%.
 * - Content block starts at the 120px inset, max 560 wide, vertically
 *   centred, 22px gaps, overlapping the clear zone.
 * Below 1024px (handoff: "to confirm at mockup"): the image stacks above
 * the content and the overlay becomes a bottom-up fade.
 */
export function Hero({
  eyebrow,
  title,
  subhead,
  body,
  actions,
  imageLabel,
  breadcrumb,
  tagline,
}: {
  eyebrow: string;
  title: string;
  subhead?: string;
  body: string;
  actions: HeroAction[];
  imageLabel: string;
  /** Current page label for inner pages; omitted on Home. */
  breadcrumb?: string;
  /** Home only: italic tagline set over the photo. */
  tagline?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-title" className="relative overflow-hidden bg-cream lg:min-h-[640px]">
      {/* Image (70%) */}
      <div className="relative h-[280px] sm:h-[380px] md:h-[440px] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[30%] lg:h-auto">
        <ImagePlaceholder
          label={imageLabel}
          tint="sand"
          rounded={false}
          className="h-full w-full justify-end pb-20 lg:pr-8 lg:pb-7"
          chipClassName="lg:max-w-[400px] xl:max-w-[420px]"
        />
        {/* Mobile/tablet: bottom-up fade into the content below. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-[linear-gradient(0deg,rgba(243,235,221,.97)_0%,rgba(243,235,221,.70)_45%,rgba(243,235,221,0)_100%)] lg:hidden"
        />
        {/* Desktop: left → right clear-zone overlay, 302px of 1008 (29.96% of the image). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[29.96%] bg-[linear-gradient(90deg,rgba(243,235,221,.97)_0%,rgba(243,235,221,.70)_55%,rgba(243,235,221,0)_100%)] lg:block"
        />
        {tagline ? (
          <p className="absolute top-5 right-5 max-w-[60%] font-serif text-[20px] leading-[1.25] text-white italic sm:text-[22px] lg:top-[39%] lg:right-auto lg:left-[65.3%] lg:w-[260px] lg:max-w-none lg:text-[26px]">
            {tagline}
          </p>
        ) : null}
      </div>

      {/* Content (30% column, overlapping the clear zone) */}
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:flex lg:min-h-[640px] lg:items-center lg:px-12 xl:px-[120px]">
        <div className="flex flex-col gap-[18px] pt-4 pb-14 sm:pb-16 lg:max-w-[440px] lg:gap-[22px] lg:py-16 xl:max-w-[560px]">
          {breadcrumb ? <Breadcrumb current={breadcrumb} /> : null}
          <p className="type-eyebrow">{eyebrow}</p>
          <h1 id="page-title" className="type-h1">
            {title}
          </h1>
          {subhead ? <p className="font-serif text-[20px] leading-[1.35] text-navy italic lg:text-[22px]">{subhead}</p> : null}
          <p className="max-w-[470px] text-[17px] leading-[1.55] lg:text-[18px]">{body}</p>
          <div className="flex flex-wrap items-center gap-[14px] pt-1">
            {actions.map((a) =>
              a.variant === "link" ? (
                <TextLink key={a.label} href={a.href}>
                  {a.label}
                </TextLink>
              ) : (
                <ButtonLink key={a.label} href={a.href} variant={a.variant}>
                  {a.label}
                </ButtonLink>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
