"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * An information icon that reveals a note.
 *
 * Client request, 20 Sep 2026, for the MSP notice beside "What we do"
 * and for the three parts of the spans band. The icon is the point: a
 * tooltip nobody knows is there is a tooltip nobody reads, so every
 * caller shows the mark rather than relying on the reader discovering a
 * hover target.
 *
 * Opens on hover, on focus and on tap. Hover alone would put the content
 * out of reach of every phone and every keyboard — `@media (hover:hover)`
 * is not a thing you can rely on to carry a compliance notice. So this
 * is a real <button>: it toggles on click, opens on pointer-enter where
 * a pointer exists, and closes on Escape or on blur.
 *
 * Not `title=""`: that cannot be styled, cannot be reached by touch, and
 * is announced inconsistently.
 *
 * The note is positioned, not portalled, so any ancestor with
 * `overflow-hidden` will clip it — the spans band had exactly that and
 * swallowed all three of its tooltips whole. Check the section before
 * adding one, and use `side="bottom"` anywhere sitting under the fixed
 * header, or it opens underneath it.
 */
export function InfoTooltip({
  label,
  children,
  align = "left",
  side = "top",
  bare = false,
  trigger,
  className,
  style,
  triggerClassName,
  noteClassName,
}: {
  /** What the icon is about, for screen readers and the button's name. */
  label: string;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  /** Which way it opens. "bottom" for anything near the fixed header. */
  side?: "top" | "bottom";
  /**
   * No icon: the trigger becomes an invisible button filling whatever it
   * is placed in, so a whole region can be the hover target. It still has
   * to be a button — a bare <div> with a pointer handler is reachable by
   * mouse and by nothing else.
   */
  bare?: boolean;
  /**
   * Content placed inside the button, before the icon. Given one, the
   * whole thing becomes the hover target rather than the icon alone -
   * which is usually what you want when the icon is sitting on a label
   * or inside a shape that reads as one object.
   */
  trigger?: React.ReactNode;
  /** Positioning for a bare region trigger that a class cannot express. */
  style?: React.CSSProperties;
  className?: string;
  triggerClassName?: string;
  /** Extra classes for the note itself, to size or nudge it. */
  noteClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const wrap = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onDown(e: PointerEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <span
      ref={wrap}
      /* items-center, not the default stretch: the button carries a 44px
         minimum target from globals.css, so in a container shorter than
         that it is taller than its box. Stretched it sits at the top and
         its label lands below centre — which is how "Healthspan" fell out
         of its own bar. Centred, the target overhangs equally and the
         label stays on the centre line. */
      className={cn(
        "relative inline-flex items-center align-middle",
        className,
      )}
      style={style}
      /* Anything that is not a finger gets hover. Testing for "mouse"
         exactly missed pens, and missed synthetic events entirely; the
         only pointer that must NOT open on enter is touch, where the
         same tap would open and immediately re-close it. */
      onPointerEnter={(e) => e.pointerType !== "touch" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType !== "touch" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center transition-colors duration-brand",
          bare
            ? "size-full"
            : "min-w-6 rounded-full text-orange-700 hover:text-orange-800",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
          triggerClassName,
        )}
      >
        <span className="sr-only">{label}</span>
        {trigger}
        {!bare && <Info aria-hidden className="size-4 shrink-0" />}
      </button>

      {/* Always in the DOM and always announced — only its visibility is
          conditional. A note that exists only while a pointer is resting
          on an icon is a note that was never published. */}
      <span
        id={id}
        role="note"
        className={cn(
          "absolute z-30 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-neutral-200 bg-white p-3 text-left text-body-sm leading-snug text-neutral-700 shadow-lg",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          align === "left" && "left-0",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "right" && "right-0",
          open ? "block" : "hidden",
          noteClassName,
        )}
      >
        {children}
      </span>
    </span>
  );
}
