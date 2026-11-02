import Image from "next/image";
import { cn } from "@/lib/cn";

/*
 * Monarch Health primary lockup (butterfly mark + "Monarch Health" wordmark
 * + the "Care for Life" tagline, centred under the wordmark letters).
 *
 * Artwork: the original files from details/brand/public/brand, with only
 * the tagline <text> element and the root size changed per the v2 spec,
 * section 11 (JJ, Nov 2): "Care for Life", Louis George Cafe Bold (embedded
 * in the SVG), 160 units, viewBox 2048×550. The reversed (white) artwork is
 * used on navy. Never render narrower than 144px, so the tagline stays at
 * 11px or more (13.75px at 176px).
 *
 * The parent link carries the accessible name ("Monarch Health home"), so
 * the image itself is decorative here.
 */
const RATIO = 550 / 2048;

export function LogoLockup({ tone = "light" }: { tone?: "light" | "dark" }) {
  const reversed = tone === "dark";
  return (
    <Image
      src={reversed ? "/brand/monarch-health-logo-reversed.svg" : "/brand/monarch-health-logo.svg"}
      alt=""
      width={176}
      height={Math.round(176 * RATIO)}
      priority={!reversed}
      unoptimized
      className={cn("block h-auto", reversed ? "w-[168px]" : "w-[144px] sm:w-[160px] xl:w-[176px]")}
    />
  );
}
