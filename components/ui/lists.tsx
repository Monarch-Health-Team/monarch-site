import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Tick items: 22px #FBE4D8 circle with a #D94000 check; Inter 16 blue, line-height 145%. */
export function TickList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3.5", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[16px] leading-[1.45] text-navy">
          <span aria-hidden="true" className="mt-px inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-tint text-accent">
            <Check className="size-3.5" strokeWidth={2.25} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Bullet items: 8px #D94000 dot; Inter 16 body colour. */
export function BulletList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-4", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-4 text-[16px] leading-[1.55]">
          <span aria-hidden="true" className="mt-[0.6em] size-2 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
