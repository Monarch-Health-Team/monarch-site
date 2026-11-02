"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The footer's two fold-outs: the fee and insured-care statement, and the
 * transparency and care standards.
 *
 * Each is a title with its text beneath it (Jeffrey, 21 Oct 2026). Closed,
 * only the titles show, one under the other. Opening one slides its text
 * down from under its own title; the title stays where it is and whatever
 * is below it moves down. Both are closed on every page load.
 *
 * The text of both stays in the document while closed and in the
 * accessibility tree: these are mandatory notices, so what a screen reader
 * can reach must not depend on a click. The panel is not `hidden`; there is
 * nothing focusable inside to be trapped, the notices are plain paragraphs.
 */
function Accordion({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  /*
   * A measured height, not a 0fr-to-1fr grid track: the grid trick resolved
   * to zero at 375px while working at 1280, because `overflow: hidden` sets
   * the automatic minimum to zero. Measuring removes the question.
   */
  const body = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => setHeight(open ? el.offsetHeight : 0);
    measure();
    if (!open) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return (
    <div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="flex min-h-11 cursor-pointer items-center gap-x-3 text-navy-200 transition-colors duration-brand hover:text-white"
        >
          {/* White, not orange (client, 19 Sep 2026): the label sits beside
              the clickable text, and both in orange read as two competing
              controls. */}
          <span id={`${id}-label`} className="label-mono text-white">
            {label}
          </span>
          {/* Full orange-400 (accessibility review, 21 Oct 2026): at 80% it
              measured 4.97:1, passing with no margin; this is 7.3:1. */}
          <span className="inline-flex items-center gap-1.5 text-orange-400">
            {open ? "Hide" : "Show"}
            <ChevronDown
              aria-hidden
              className={cn(
                "size-4 transition-transform duration-brand",
                open && "rotate-180",
              )}
            />
          </span>
        </button>
      </div>
      <div
        id={id}
        role="region"
        aria-labelledby={`${id}-label`}
        style={{ height }}
        className="overflow-hidden transition-[height] duration-500 ease-out motion-reduce:transition-none"
      >
        {/* Padding, not a margin: a child's margin collapses out of the
            measured element and the panel would come up short. */}
        <div
          ref={body}
          className="pt-3 pb-6 text-body-sm leading-relaxed text-navy-200"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function StandardsDisclosure({
  notices,
  fees,
  children,
  trailing,
}: {
  /** The regulatory notices themselves. */
  notices: ReactNode;
  /** The fee and insured-care statement. */
  fees: ReactNode;
  /** The start of the bottom line: the copyright. */
  children: ReactNode;
  /** The end of it: the legal links. */
  trailing: ReactNode;
}) {
  return (
    <div className="mt-4">
      <Accordion id="fee-statement" label="About fees & insured care">
        {fees}
      </Accordion>
      <Accordion id="care-standards" label="Transparency & care standards">
        {notices}
      </Accordion>

      <div className="mt-2 flex flex-col items-center gap-2 text-body-sm text-navy-200 lg:flex-row lg:justify-between lg:gap-4">
        {children}
        {trailing}
      </div>
    </div>
  );
}
