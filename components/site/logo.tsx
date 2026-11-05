import Link from "@/components/site/live-link";
import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * The lockup: mark, wordmark and the tagline, all one vector file, so a saved
 * image is the whole lockup and it scales with no blur.
 *
 * v4 (Nov 2026): the tagline is "Continuous care for life", drawn as outlined
 * paths (`#tagline-continuous` in orange, `#tagline-care-for-life` in navy),
 * centred under the wordmark. Two files: light, and reversed for navy grounds.
 *
 * The tagline is only legible from 190px wide. Below that the plain wordmark
 * (no tagline) is used instead, so a small lockup never carries unreadable
 * text.
 */
const TAGLINE_ASSETS: Record<string, { primary: string; reversed: string }> = {
  "Continuous care for life": {
    primary: "/brand/monarch-health-logo-tagline-split-v4.svg",
    reversed: "/brand/monarch-health-logo-reversed-tagline-split-v4.svg",
  },
};
// Aspect ratio of the composited SVGs (viewBox 2048x559).
const TAGLINE_ASSET_RATIO = 559 / 2048;
/** Narrowest width at which the tagline is shown. */
const TAGLINE_MIN_WIDTH = 190;

/** Full class names, so Tailwind can see them. */
const DESKTOP_WIDTH_CLASS = {
  md: "md:w-[var(--logo-w)]",
  hdr: "hdr:w-[var(--logo-w)]",
  xl: "xl:w-[var(--logo-w)]",
} as const;

export function Logo({
  variant = "primary",
  className,
  width = 240,
  mobileWidth = width,
  desktopFrom = "xl",
  tagline,
  priority = false,
  current = false,
}: {
  /** Marks the link as the current page (the logo is Home's link). */
  current?: boolean;
  variant?: "primary" | "reversed";
  className?: string;
  /** Width from `desktopFrom` up. */
  width?: number;
  /** Width below `desktopFrom`. */
  mobileWidth?: number;
  desktopFrom?: "md" | "hdr" | "xl";
  /** The line set beneath the mark. Needs an entry in TAGLINE_ASSETS. */
  tagline?: string;
  /** Preload the lockup: only the header's, which is in the first screen. */
  priority?: boolean;
}) {
  const taglineAsset = tagline ? TAGLINE_ASSETS[tagline] : undefined;
  const showTagline =
    Boolean(taglineAsset) && Math.min(width, mobileWidth) >= TAGLINE_MIN_WIDTH;
  const src = taglineAsset && showTagline
    ? variant === "reversed"
      ? taglineAsset.reversed
      : taglineAsset.primary
    : variant === "reversed"
      ? "/brand/lockup-reversed.webp"
      : "/brand/lockup-primary.webp";

  return (
    <Link
      href="/"
      aria-current={current ? "page" : undefined}
      className={`inline-flex min-h-12 shrink-0 items-center ${className ?? ""}`}
      style={
        {
          "--logo-w": `${width}px`,
          "--logo-mw": `${mobileWidth}px`,
        } as React.CSSProperties
      }
      aria-label={
        tagline ? `${SITE.name} – ${tagline}` : `${SITE.name} - home`
      }
    >
      <span
        className={`block w-[var(--logo-mw)] ${DESKTOP_WIDTH_CLASS[desktopFrom]}`}
      >
        <Image
          src={src}
          alt=""
          width={width}
          height={
            showTagline
              ? Math.round(width * TAGLINE_ASSET_RATIO)
              : Math.round((width / 560) * 120)
          }
          priority={priority}
          unoptimized={showTagline}
          className="h-auto w-full"
        />
      </span>
    </Link>
  );
}
