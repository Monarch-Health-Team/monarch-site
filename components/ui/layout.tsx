import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** 1200px content width with a 120px inset at the 1440 canvas. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-[120px]", className)}>{children}</div>;
}

/*
 * Section rhythm (v2 P1-12): cream base, white for editorial sections, sand
 * at most once per page, navy once. 120px padding desktop, 72px mobile.
 */
const TONES = {
  cream: "bg-cream",
  white: "bg-white",
  sand: "bg-sand",
  navy: "on-navy bg-navy text-on-navy",
} as const;

export type Tone = keyof typeof TONES;

const SPACING = {
  default: "py-[72px] lg:py-[120px]",
  navy: "py-[72px] lg:py-[112px]",
  compact: "py-[72px] lg:py-24",
  /* Directly under the mobile credentials band, which already has bottom room. */
  "after-band": "pt-4 pb-[72px] lg:py-[120px]",
} as const;

export function Section({
  tone,
  spacing,
  id,
  labelledBy,
  ariaLabel,
  className,
  containerClassName,
  children,
}: {
  tone: Tone;
  spacing?: keyof typeof SPACING;
  id?: string;
  labelledBy?: string;
  ariaLabel?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      className={cn(TONES[tone], SPACING[spacing ?? (tone === "navy" ? "navy" : "default")], className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/** Eyebrow: 28px rule, 12px gap, Inter Semi Bold 12 caps, tracking 0.16em. Navy, or #C8D1E6 on navy. */
export function Eyebrow({ children, onNavy = false, className }: { children: ReactNode; onNavy?: boolean; className?: string }) {
  return (
    <p className={cn("type-eyebrow flex items-center gap-3", onNavy ? "text-on-navy" : "text-navy", className)}>
      <span aria-hidden="true" className={cn("h-px w-7 shrink-0", onNavy ? "bg-on-navy" : "bg-navy")} />
      <span>{children}</span>
    </p>
  );
}

/** Section heading block: eyebrow, H2 (Light 48) and an optional 18px lead. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  onNavy = false,
  size = "h2",
  className,
  titleClassName,
}: {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  onNavy?: boolean;
  size?: "h2" | "band";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {eyebrow ? <Eyebrow onNavy={onNavy}>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className={cn(size === "band" ? "type-h2-band" : "type-h2", onNavy && "text-white", "max-w-[760px]", titleClassName)}>
        {title}
      </h2>
      {lead ? <p className={cn("type-lead max-w-[640px]", onNavy ? "text-on-navy" : "text-body")}>{lead}</p> : null}
    </div>
  );
}
