import { Camera } from "lucide-react";
import { cn } from "@/lib/cn";

/*
 * Labelled image placeholder (handoff "Image placeholder"): tint gradient,
 * white 85% label chip with a camera icon. Replaced by photography later.
 * No real photos or stock images are used in this build.
 */
const TINTS = {
  sand: "from-[#e3d6c1] to-[#b9a585]",
  blue: "from-[#cfd6e3] to-[#8e9cb8]",
  warm: "from-[#e6d3bc] to-[#c0a07a]",
} as const;

export type Tint = keyof typeof TINTS;

export function ImagePlaceholder({
  label,
  tint = "sand",
  className,
  rounded = true,
  chipClassName,
}: {
  /** Photo description from the handoff's "Image placeholders" table. */
  label: string;
  tint?: Tint;
  className?: string;
  rounded?: boolean;
  chipClassName?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${label}`}
      data-placeholder="image"
      className={cn(
        "relative flex items-end overflow-hidden bg-gradient-to-r p-3 sm:p-4",
        TINTS[tint],
        rounded && "rounded-[14px]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex max-w-[min(100%,24rem)] items-start gap-2 rounded-[6px] bg-white/85 py-[7px] pr-3 pl-2.5 text-[12px] font-medium leading-snug text-navy",
          chipClassName,
        )}
      >
        <Camera className="mt-px size-3.5 shrink-0" strokeWidth={1.75} />
        <span>Photo: {label}</span>
      </span>
    </div>
  );
}
