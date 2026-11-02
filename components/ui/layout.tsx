import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** 1200px content width with a 120px inset at the 1440 canvas. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-[120px]", className)}>{children}</div>;
}

const TONES = {
  cream: "bg-cream",
  sand: "bg-sand",
} as const;

/** Page section: 96px top/bottom padding on desktop; cream and sand alternate. */
export function Section({
  tone,
  id,
  labelledBy,
  ariaLabel,
  className,
  containerClassName,
  children,
}: {
  tone: keyof typeof TONES;
  id?: string;
  labelledBy?: string;
  ariaLabel?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} aria-label={ariaLabel} className={cn(TONES[tone], "py-16 md:py-20 lg:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("type-eyebrow", className)}>{children}</p>;
}

const H2_SIZES = {
  sm: "type-h2-sm", // 36px
  md: "type-h2", // 40px
  lg: "type-h2-lg", // 44px
} as const;

/** Eyebrow + H2 + optional intro, with an optional action aligned right on desktop. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  size = "md",
  action,
  className,
  introClassName,
}: {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  size?: keyof typeof H2_SIZES;
  action?: ReactNode;
  className?: string;
  introClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:justify-between md:gap-10", action ? "md:items-end" : "md:items-start", className)}>
      <div className="flex max-w-[720px] flex-col gap-3">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 id={id} className={H2_SIZES[size]}>
          {title}
        </h2>
        {intro ? <p className={cn("max-w-[600px] text-[17px] leading-[1.55]", introClassName)}>{intro}</p> : null}
      </div>
      {action ? <div className="shrink-0 md:pb-1">{action}</div> : null}
    </div>
  );
}
