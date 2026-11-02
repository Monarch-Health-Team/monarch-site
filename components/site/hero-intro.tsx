import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The homepage's supporting line and calls to action. The film was removed
 * (client, 4 Oct 2026), and the empty navy placeholder frame that stood in
 * for it was removed on 25 Oct 2026 (JJ), so the line now sits directly
 * above the actions.
 *
 * Hero Option A (Nicole's mockup, 25 Oct 2026): left-aligned, in
 * neutral-700 on the white scrim, 32px above the actions. Tweak 2 (JJ,
 * 25 Oct 2026): 12px under the second title, which now sits with it. No text shadow: the scrim carries the contrast.
 * `className` sets the line's measure.
 */
export function HeroIntro({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      <p
        className={cn(
          "mt-3 text-left text-[1.125rem]/[1.75rem] text-neutral-700 lg:text-[1.25rem]/[1.875rem]",
          className,
        )}
      >
        Physician-led healthspan management that helps you understand your
        health, manage risk and stay independent.
      </p>
      <div className="mt-8 flex w-full flex-col items-stretch sm:items-start">
        {children}
      </div>
    </>
  );
}
