import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { SITE, type Href } from "@/lib/site";
import { cn } from "@/lib/cn";

/*
 * Buttons and text links (v2 Design system, 43:102).
 * Orange #B23400 only for things you can click; hover #962C00.
 * Buttons: Inter Semi Bold 16, 48px tall at natural width (16px top and
 * bottom, 24px sides), radius 8. Header size: 40px tall, 15px text.
 *
 * Only colours transition (never outline), so the focus ring appears at
 * once instead of fading in (v2 P0-4).
 */
export const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-[8px] font-semibold leading-none whitespace-nowrap transition-[color,background-color,border-color,text-decoration-color] duration-150 focus-visible:transition-none motion-reduce:transition-none";

const BUTTON_SIZES = {
  default: "h-12 px-6 text-[16px]",
  /* Header button: 40px tall, 12.5px / 20px padding, 15px text. */
  header: "h-10 px-5 text-[15px]",
} as const;

const BUTTON_VARIANTS = {
  primary: "border-[1.25px] border-action bg-action text-white hover:border-action-hover hover:bg-action-hover",
  secondary: "border-[1.25px] border-action bg-transparent text-action hover:border-action-hover hover:text-action-hover hover:bg-white/60",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "default") {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size]);
}

function isExternal(href: string) {
  return /^(tel:|mailto:|https?:)/.test(href);
}

/**
 * A link, or plain text when the destination page does not exist yet
 * (href === null). Used for plain-text items such as footer entries; it
 * never looks clickable (no orange, no arrow). Buttons and text links with
 * a pending destination are not rendered at all (v2 P0-2).
 */
function SmartLink({
  href,
  className,
  children,
  ariaLabel,
  newTab,
}: {
  href: Href;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  /** Open in a new tab (external links only): target=_blank, rel=noopener noreferrer. */
  newTab?: boolean;
}) {
  if (href === null) {
    return <span className={className}>{children}</span>;
  }
  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

const Arrow = () => (
  <ArrowRight
    aria-hidden="true"
    className="size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
    strokeWidth={2}
  />
);

/** Button-styled link. Hidden while its destination page does not exist. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "default",
  arrow,
  className,
  children,
  ariaLabel,
}: {
  href: Href;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Primary buttons carry an arrow by default (v2 Design system). */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  if (href === null) return null;
  const showArrow = arrow ?? (variant === "primary" && size === "default");
  return (
    <SmartLink href={href} ariaLabel={ariaLabel} className={cn("group", buttonClasses(variant, size), className)}>
      {children}
      {showArrow ? <Arrow /> : null}
    </SmartLink>
  );
}

/**
 * Text link: orange Semi Bold 16 with a trailing arrow; hover underline 1px,
 * offset 4. 44px tall hit area (v2 P2-3). On navy the link is white (orange
 * fails contrast there), matching the other links in the navy band. Hidden
 * while its destination page does not exist.
 */
export function TextLink({
  href,
  className,
  children,
  onNavy = false,
  newTab = false,
}: {
  href: Href;
  className?: string;
  children: ReactNode;
  onNavy?: boolean;
  /** External link opened in a new tab; announces it to screen readers. */
  newTab?: boolean;
}) {
  if (href === null) return null;
  return (
    <SmartLink
      href={href}
      newTab={newTab}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-[16px] font-semibold leading-[1.4] decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:underline focus-visible:transition-none motion-reduce:transition-none",
        onNavy ? "text-white" : "text-action hover:text-action-hover",
        className,
      )}
    >
      <span>
        {children}
        {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </span>
      <Arrow />
    </SmartLink>
  );
}

/**
 * "Get directions" to the clinic (Jenny's Doc §13 Decision 1): shown under
 * the address wherever it appears. Google Maps search for 1823 Fort St
 * (no API key), new tab. Orange on light backgrounds, white on navy.
 */
export function DirectionsLink({ onNavy = false, className }: { onNavy?: boolean; className?: string }) {
  return (
    <TextLink href={SITE.directionsHref} onNavy={onNavy} newTab className={className}>
      Get directions
    </TextLink>
  );
}

/**
 * The clinic phone number as plain-looking text with a tel: link (Jenny,
 * Nov 2): it keeps the surrounding colour and weight; underline on hover.
 */
export function PhoneLink({ className }: { className?: string }) {
  return (
    <a
      href={SITE.phoneHref}
      className={cn("whitespace-nowrap text-inherit decoration-1 underline-offset-4 hover:underline", className)}
    >
      {SITE.phoneDisplay}
    </a>
  );
}

export { SmartLink };
