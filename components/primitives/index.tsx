import { cn } from "@/lib/utils";
import type { ReactNode, ElementType } from "react";
import Link from "@/components/site/live-link";

/**
 * Primitives, built to the Monarch Health Brand & Design System v1.0.
 *
 * Rule 01 governs colour throughout: navy owns structure, orange owns
 * interaction. Every interactive primitive below is orange; every structural
 * one is navy or ink. Nothing here picks a colour for decoration.
 */


/**
 * Type scale, as a static lookup rather than an interpolated class name.
 *
 * Tailwind scans source text for complete class names, so `text-${size}` is
 * invisible to it and the utility never gets generated — the heading silently
 * falls back to body size. Every size a component can take has to appear
 * literally somewhere in the source.
 */
const HEADING_SIZES = {
  "display-2xl": "text-display-2xl",
  "display-xl": "text-display-xl",
  "display-lg": "text-display-lg",
  "heading-1": "text-heading-1",
  "heading-2": "text-heading-2",
  "heading-3": "text-heading-3",
  "heading-4": "text-heading-4",
  "heading-5": "text-heading-5",
} as const;

export type HeadingSize = keyof typeof HEADING_SIZES;

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  tone = "white",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "wash" | "navy-wash" | "navy";
  id?: string;
  labelledBy?: string;
}) {
  const tones = {
    white: "bg-white",
    wash: "bg-neutral-50",
    "navy-wash": "bg-navy-50",
    navy: "bg-navy-950 text-white on-navy",
  } as const;
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-10 md:py-14", tones[tone], className)}
    >
      {children}
    </section>
  );
}

/**
 * Section heading with a mono index.
 *
 * NO RULE ABOVE THE TEXT. This carried a 2px rule above the label until
 * 19 Sep 2026, when the client asked for that treatment to be removed
 * everywhere and not reintroduced. The same went for the rules above the
 * footer's land acknowledgment, the legend rows, the framed compliance
 * notice and every bordered list. Separate blocks with space, or with a
 * hairline BETWEEN items; never with a line above a heading, an eyebrow or
 * the first row of a list.
 */
export function SectionRule({
  index,
  children,
  id,
  as: Tag = "h2",
  size = "heading-2",
  description,
  onNavy = false,
}: {
  index?: string;
  children: ReactNode;
  id?: string;
  as?: ElementType;
  size?: HeadingSize;
  description?: ReactNode;
  onNavy?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] items-start gap-x-5",
      )}
    >
      <span
        className={cn(
          "label-mono pt-2",
          onNavy ? "text-orange-400" : "text-orange-600",
        )}
        aria-hidden
      >
        {index ?? ""}
      </span>
      <div>
        <Tag
          id={id}
          className={cn(
            HEADING_SIZES[size],
            onNavy ? "!text-white" : "text-navy-900",
          )}
        >
          {children}
        </Tag>
        {description && (
          <p
            className={cn(
              "mt-2 max-w-[60ch] text-body-lg",
              onNavy ? "text-navy-200" : "text-neutral-700",
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * The orange mono eyebrow above a heading. Switched off sitewide (Jeffrey,
 * 21 Oct 2026: "remove all the orange eyebrows"). Every call site still
 * passes its label, so this one function brings them all back if wanted.
 */
export function Eyebrow(props: {
  children: ReactNode;
  className?: string;
  onNavy?: boolean;
}) {
  void props;
  return null;
}

export function Heading({
  as: Tag = "h2",
  size = "heading-2",
  children,
  className,
  id,
}: {
  as?: ElementType;
  size?: HeadingSize;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={cn(HEADING_SIZES[size], className)}>
      {children}
    </Tag>
  );
}

/**
 * Lead paragraph. Light 300 is permitted here because the size is 18px and up
 * — the brand forbids Light below 18px, on navy, and in clinical documents.
 */
export function Lead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-body-lg font-normal text-neutral-700",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Buttons.
 *
 * Four variants, exactly as specified. Primary and secondary are both orange
 * — that is what "orange owns interaction" means in practice. Ghost carries a
 * border for the same reason: an unbordered word beside two bordered controls
 * reads as a caption, not a control, and is the most commonly missed cancel
 * affordance in healthcare forms.
 */
const buttonBase =
  "btn inline-flex items-center justify-center gap-2 rounded-md border font-semibold text-label transition-colors duration-brand ease-out";

const buttonVariants = {
  /** The one action the page exists for. orange-600 on white, 4.57:1. */
  primary:
    "border-transparent bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800",
  /** The alternative to the primary action. orange-700 text, 7.02:1. */
  secondary:
    "border-[1.5px] border-orange-600 bg-transparent text-orange-700 hover:bg-orange-50 active:bg-orange-100",
  /** Dismiss and cancel. Bordered so it reads as a control. */
  ghost:
    "border-neutral-600 bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200",
  /** Only where orange cannot sit: navy panels, print, one-colour output. */
  structural: "border-transparent bg-navy-950 text-white hover:bg-navy-800 active:bg-navy-900",
  /** Reversed, for use inside a navy section. */
  onNavy:
    "border-[1.5px] border-white/45 bg-transparent text-white hover:border-white hover:bg-white/10 active:bg-white/20",
} as const;

const buttonSizes = {
  sm: "h-9 px-3 text-body-sm",
  md: "h-11 px-5",
  lg: "h-[52px] px-6 text-[0.9375rem]",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        buttonBase,
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        buttonBase,
        buttonVariants[variant],
        buttonSizes[size],
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Card. 12px radius, hairline border, navy-tinted shadow. The mono kicker is
 * orange only because it labels a category, not because it is decorative —
 * headings above 18px, labels and emphasis are the accent's permitted homes.
 */
export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        "relative flex flex-col rounded-lg border border-neutral-200 bg-white p-5 text-neutral-700 shadow-sm transition-shadow has-[.card-hit]:hover:shadow-md",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * A card's call to action, pinned to the foot of the card.
 *
 * `mt-auto` pushes it to the foot of the card, so every card in a row lands
 * its action in the same place however much copy sits above it. Cards in a
 * grid stretch to equal height, so the actions line up across the row.
 *
 * Alignment follows the site rule for actions (Jeffrey, 26 Sep 2026;
 * docs/changes/button-alignment/design-spec.md): right-aligned when the block
 * sits beside another block, centred when it spans a single column, and
 * always centred below 40rem. So a card link is centred, except in a
 * `card-row-2` from 48rem (md) or a `card-row-3` from 40rem (sm), the widths
 * at which those rows have columns. If a row's column breakpoint changes in
 * app/globals.css, change the matching variant here; a `card-row-4` would
 * need `in-[.card-row-4]:sm:self-end`.
 *
 * Buttons and button rows follow the same rule with one of four patterns:
 *   P1  single column at every width: `flex justify-center` on the wrapper
 *   P2  a block that becomes a column at lg: `justify-center lg:justify-end`
 *   P3  a lone button that is a direct child of a flex-column card:
 *       `self-center` on the button (centred, at its natural width)
 *   C   this class, for card links
 *
 * Exported as a class string rather than a component so it can be dropped
 * into an existing <Link> without restructuring the card.
 */
export const cardCta =
  "mt-auto self-center in-[.card-row-2]:md:self-end in-[.card-row-3]:sm:self-end inline-flex target-min items-center gap-2 pt-6 text-label font-semibold text-orange-700 hover:underline";

/**
 * Makes a card's own link cover the whole card, so the card is the button
 * (Jeffrey, 20 Oct 2026: "the whole card has to be a button"). Put it on the
 * one link that leads off the card, inside a <Card> (which is `relative`).
 * The link's ::after fills the card; the text stays selectable only where it
 * sits above the link, and the card gets a lift on hover. Never put it on a
 * link outside a card: it would stretch to the nearest positioned ancestor.
 */
export const cardHit =
  "card-hit after:absolute after:inset-0 after:rounded-[inherit] after:content-['']";

export function CardKicker({ children }: { children: ReactNode }) {
  return <p className="label-mono text-orange-700">{children}</p>;
}

/**
 * Callout rule — 3px orange bar with a mono label. The navy variant is for
 * structural asides; orange is for anything the reader should act on.
 */
export function Callout({
  label,
  children,
  tone = "orange",
  className,
}: {
  label?: string;
  children: ReactNode;
  tone?: "orange" | "navy";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-l-[3px] px-[18px] py-4 text-neutral-700",
        tone === "orange"
          ? "border-orange-600 bg-orange-50"
          : "border-navy-900 bg-navy-50",
        className,
      )}
    >
      {label && (
        <p
          className={cn(
            "label-mono mb-1.5",
            tone === "orange" ? "text-orange-700" : "text-navy-900",
          )}
        >
          {label}
        </p>
      )}
      <div className="text-body-sm text-neutral-700">{children}</div>
    </div>
  );
}

/** Badge. Always carries a word — colour is never the only signal. */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "error" | "info" | "neutral" | "orange";
  className?: string;
}) {
  const tones = {
    success: "text-success-700",
    warning: "text-warning-700",
    error: "text-error-700",
    info: "text-info-700",
    neutral: "text-neutral-700",
    orange: "text-orange-700",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border border-current px-2.5 font-mono text-[10px] font-bold tracking-widest uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose max-w-none",
        "prose-headings:text-navy-900 prose-headings:font-bold",
        "prose-p:text-neutral-700 prose-li:text-neutral-700",
        "prose-a:text-orange-700 prose-a:underline prose-a:underline-offset-2",
        "prose-strong:text-neutral-950",
        className,
      )}
    >
      {children}
    </div>
  );
}
