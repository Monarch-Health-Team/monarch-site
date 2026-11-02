import { Phone } from "lucide-react";
import { Breadcrumb } from "@/components/sections/breadcrumb";
import { ButtonLink, PhoneLink, TextLink, type ButtonVariant } from "@/components/ui/actions";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Photo } from "@/components/ui/photo";
import type { SiteImage } from "@/lib/images";
import type { Href } from "@/lib/site";
import { cn } from "@/lib/cn";

export type HeroAction = {
  label: string;
  href: Href;
  /** Button variant, or "link" for a text link with an arrow. */
  variant: ButtonVariant | "link";
};

/*
 * Hero v2 (split, framed photo, nothing written over it; v2 P1-2).
 * Desktop: text column 540 on the left, framed photo 580 × 660 (Home) or
 * 580 × 600 (inner pages) on the right, radius 12, gap 80, cream.
 * Mobile: 4:3 photo with radius 12 on top, then the copy; buttons wrap at
 * natural width, 48px tall. `data-hero` lets the sticky mobile Book bar
 * appear once the hero has scrolled away.
 */
export function Hero({
  eyebrow,
  title,
  tagline,
  body,
  actions,
  image,
  breadcrumb,
  home = false,
  reassurance = true,
}: {
  eyebrow: string;
  title: string;
  /** Italic navy line under the H1 (v2 Decision 2). */
  tagline?: string;
  body: string;
  actions: HeroAction[];
  image: SiteImage;
  /** Current page label for the breadcrumb (inner pages). */
  breadcrumb?: string;
  /** Home uses the 68px H1 and the taller photo. */
  home?: boolean;
  /** "Prefer to talk first? Call …" line under the actions. */
  reassurance?: boolean;
}) {
  return (
    <section data-hero aria-labelledby="page-title" className="bg-cream pt-5 pb-14 lg:pt-14 lg:pb-24 xl:pt-[56px]">
      <Container className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,540px)_minmax(0,580px)] lg:items-center lg:justify-between lg:gap-12 xl:gap-20">
        <div className="flex flex-col gap-[18px] pt-3 lg:gap-6 lg:pt-0">
          {breadcrumb ? <Breadcrumb current={breadcrumb} /> : null}
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 id="page-title" className={home ? "type-h1" : "type-h1-page"}>
            {title}
          </h1>
          {tagline ? <p className="type-tagline">{tagline}</p> : null}
          <p className="type-lead max-w-[540px] text-body">{body}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2 sm:gap-4">
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
          {reassurance ? (
            <p className="flex items-center gap-2.5 text-[15px] leading-[1.4] text-muted">
              <Phone aria-hidden="true" className="size-4 shrink-0 text-navy" strokeWidth={1.75} />
              <span>Prefer to talk first? Call <PhoneLink />.</span>
            </p>
          ) : null}
        </div>
        <Photo
          image={image}
          priority
          sizes="(min-width: 1440px) 580px, (min-width: 1024px) 46vw, 100vw"
          className={cn("order-first aspect-[4/3] w-full lg:order-none lg:aspect-auto lg:h-[560px]", home ? "xl:h-[660px]" : "xl:h-[600px]")}
        />
      </Container>
    </section>
  );
}
