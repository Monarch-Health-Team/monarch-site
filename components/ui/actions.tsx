import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Href } from "@/lib/site";
import { cn } from "@/lib/cn";

/*
 * Buttons and text links (handoff "Buttons").
 * All buttons: 15px x 26px padding, 12px radius, Inter Semi Bold 15.
 */
const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-[12px] px-[26px] py-[15px] text-[15px] font-semibold leading-none whitespace-nowrap transition-colors";

const BUTTON_VARIANTS = {
  primary: "border-[1.5px] border-navy bg-navy text-white hover:bg-[#001a54] hover:border-[#001a54]",
  secondary: "border-[1.5px] border-navy bg-white text-navy hover:bg-cream",
  /* Bottom CTA bands only. */
  cta: "border-[1.5px] border-accent-text bg-accent-text text-white hover:bg-[#962c00] hover:border-[#962c00]",
  "cta-secondary": "border-[1.5px] border-accent-text bg-white text-accent-text hover:bg-tint",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

function isExternal(href: string) {
  return /^(tel:|mailto:|https?:)/.test(href);
}

/**
 * Renders a link, or plain text when the destination page is not built yet
 * (href === null). Pending destinations are listed in the build report.
 */
function SmartLink({
  href,
  className,
  children,
  ariaLabel,
}: {
  href: Href;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  if (href === null) {
    return (
      <span className={className} data-pending-link="true" title="Page not built yet">
        {children}
      </span>
    );
  }
  if (isExternal(href)) {
    return (
      <a href={href} className={className} aria-label={ariaLabel}>
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

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ariaLabel,
}: {
  href: Href;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <SmartLink
      href={href}
      ariaLabel={ariaLabel}
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], href === null && "cursor-default", className)}
    >
      {children}
    </SmartLink>
  );
}

/** Text link: #B23400 Inter Semi Bold 15 with a trailing arrow. */
export function TextLink({
  href,
  className,
  children,
}: {
  href: Href;
  className?: string;
  children: ReactNode;
}) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 text-[15px] font-semibold leading-snug text-accent-text",
        href !== null && "hover:underline underline-offset-4",
        className,
      )}
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
    </SmartLink>
  );
}

export { SmartLink };
