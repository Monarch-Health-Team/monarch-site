import { Check, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Tick list (v2): hairline rows, 18px navy check, Inter 16 body ink. Optional two columns. */
export function TickList({ items, columns = 1, className }: { items: ReactNode[]; columns?: 1 | 2; className?: string }) {
  return (
    <ul className={cn("grid border-t border-line", columns === 2 && "sm:grid-cols-2 sm:gap-x-8", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3.5 border-b border-line py-4 text-[16px] leading-[1.5] text-body">
          <Check aria-hidden="true" className="mt-[3px] size-[18px] shrink-0 text-navy" strokeWidth={2} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type GridItem = { title: string; body?: string; icon?: LucideIcon };

/**
 * Hairline grid (v2): items with a 1px top rule, optional 26–28px navy
 * icon, a serif label and an optional 16px body. No boxes or shadows.
 */
export function HairlineGrid({
  items,
  columns = 4,
  titleSize = "md",
  rule = "line",
  headingLevel = "h3",
  iconSize = "md",
  className,
}: {
  items: GridItem[];
  columns?: 2 | 3 | 4;
  titleSize?: "md" | "lg" | "xl";
  rule?: "line" | "navy";
  headingLevel?: "h3" | "p";
  /** md 26px; lg 28px for the Home "What we measure" grid (P1-7, Figma 37:32). */
  iconSize?: "md" | "lg";
  className?: string;
}) {
  const Title = headingLevel;
  return (
    <ul
      className={cn(
        "grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:gap-y-12",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        columns === 2 && "lg:gap-x-16",
        className,
      )}
    >
      {items.map(({ title, body, icon: Icon }) => (
        <li key={title} className={cn("flex flex-col gap-3.5 border-t pt-6", rule === "navy" ? "border-navy" : "border-line")}>
          {Icon ? <Icon aria-hidden="true" className={cn(iconSize === "lg" ? "size-7" : "size-[26px]", "text-navy")} strokeWidth={1.5} /> : null}
          <Title
            className={cn(
              "type-h3 text-navy",
              titleSize === "md" && "text-[20px] lg:text-[22px]",
              titleSize === "lg" && "text-[22px] lg:text-[26px]",
              titleSize === "xl" && "text-[24px] lg:text-[28px]",
            )}
          >
            {title}
          </Title>
          {body ? <p className="text-[16px] leading-[1.6] text-body">{body}</p> : null}
        </li>
      ))}
    </ul>
  );
}

/** Feature list (v2, Care at Home): hairline rows with a 22px navy icon, 20px serif title and body. */
export function FeatureList({ items }: { items: (GridItem & { body: string })[] }) {
  return (
    <ul className="border-t border-line">
      {items.map(({ title, body, icon: Icon }) => (
        <li key={title} className="flex items-start gap-[18px] border-b border-line py-[18px]">
          {Icon ? <Icon aria-hidden="true" className="mt-0.5 size-[22px] shrink-0 text-navy" strokeWidth={1.5} /> : null}
          <div className="flex flex-col gap-1">
            <h3 className="type-h3 text-[20px] leading-[1.25]">{title}</h3>
            <p className="text-[16px] leading-[1.55] text-body">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Marker list on navy (boundaries): #2A4689 hairline rows, 12px #C8D1E6 marker bar, 17px text. */
export function MarkerList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("border-t border-navy-line", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 border-b border-navy-line py-[18px] text-[17px] leading-[1.55] text-on-navy lg:py-5">
          <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-on-navy" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
