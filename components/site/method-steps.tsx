"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { MethodStepContent } from "@/content/method";
import { PIECE_ICONS } from "@/components/site/method-icons";
import { cn } from "@/lib/utils";

/**
 * The method, as four cards that give way to one.
 *
 * Rebuilt a sixth time (client, 24 Sep 2026). The fifth build moved the
 * cards on every step and stuttered doing it; this one moves them once.
 *
 * THE MODEL. One card is the anchor: the one the pointer first landed
 * on. It slides into the first column, the other three dissolve, and the
 * pane dissolves in over the space they left. From then until the
 * pointer leaves, NOTHING MOVES. Stepping to the next step does not hand
 * the stage to another card - it changes the words inside the anchor and
 * inside the pane, and nothing else. That is the whole of the client's
 * note: "every other card disappears and stays disappeared. They only
 * appear back when the hover effect is stopped ... I don't want the pane
 * to disappear and come back. I just want the elements in the pane to
 * disappear and the new elements to come back."
 *
 * WHY THAT KILLS THE STUTTER. The fifth build made each step the active
 * card in turn, so on every step one card faded out while another faded
 * in and slid - three animations fighting over the same 500ms. Here a
 * step is a content swap behind a shell that never moves.
 *
 * WHY THE SLIDE IS A TRANSLATE. Changing an item's grid-column cannot be
 * animated; it teleports. Every card stays in its own column and the
 * anchor is translated by however many columns it sits from the first:
 * `-i * (100% + gap)`, where 100% is the card's own width. That needs no
 * measurement and survives any column width.
 *
 * The transition names `translate`, and that is not a typo for
 * `transform`. Tailwind v4 compiles translate-x-* to the standalone
 * `translate` property, so `transition-[transform,...]` transitions
 * nothing here and the card arrives without ever having travelled - the
 * exact bug the client reported on 24 Sep 2026.
 *
 * WHY THE GUTTER ARROW IS NOT INSIDE THE CARD'S MOVING PART. The three
 * arrows between the cards have to outlive the cards they sit beside -
 * the first one stays put while everything around it dissolves (client,
 * same day: "The left arrow should always appear in every instance"). So
 * the `li` holds two things: a wrapper that slides and fades, and the
 * arrow, which does neither.
 *
 * All of the above is lg-only, where the four columns exist. Below it the
 * cards stack, nothing hides, nothing slides, and the pane simply opens
 * under the one that was tapped.
 */

/** How long a pointer resting on an arrow waits before it steps again. */
const CYCLE_MS = 2000;

/** Half a content swap: the old words out, then the new words in. */
const SWAP_MS = 220;

/**
 * Written out, not built from the index.
 *
 * Tailwind reads the source as text, so `lg:col-start-${i + 1}` is a
 * class it never sees and never emits - the cards would all land in
 * column 1 and stack on top of each other. Four literals it can find.
 */
const COLUMN = [
  "lg:col-start-1",
  "lg:col-start-2",
  "lg:col-start-3",
  "lg:col-start-4",
];

export function MethodSteps({
  steps,
  cta,
}: {
  steps: MethodStepContent[];
  cta?: React.ReactNode;
}) {
  /** Which card element holds the stage. Null when nothing is open. */
  const [anchor, setAnchor] = React.useState<number | null>(null);
  /** Which step's words belong in it. */
  const [current, setCurrent] = React.useState(0);
  /** Which step's words are painted, and whether they are lit. */
  const [shown, setShown] = React.useState(0);
  const [lit, setLit] = React.useState(true);
  const [onArrow, setOnArrow] = React.useState<-1 | 1 | null>(null);
  const paneId = React.useId();

  const open = (i: number) => {
    setAnchor(i);
    setCurrent(i);
    setShown(i);
    setLit(true);
  };

  const close = () => {
    setAnchor(null);
    setOnArrow(null);
  };

  const move = React.useCallback(
    (dir: -1 | 1) => setCurrent((c) => (c + dir + steps.length) % steps.length),
    [steps.length],
  );

  /*
   * The swap, in two halves: take the words out, exchange them while
   * nobody can see them, put the new ones in. Both the card and the pane
   * read `lit`, so they dissolve together.
   */
  React.useEffect(() => {
    if (current === shown) return;
    setLit(false);
    const t = setTimeout(() => {
      setShown(current);
      setLit(true);
    }, SWAP_MS);
    return () => clearTimeout(t);
  }, [current, shown]);

  /*
   * Holding on an arrow keeps stepping. `current` is a dependency on
   * purpose: each step restarts the wait, so the dwell is measured from
   * the words arriving rather than from the pointer landing.
   */
  React.useEffect(() => {
    if (onArrow === null || anchor === null) return;
    const t = setTimeout(() => move(onArrow), CYCLE_MS);
    return () => clearTimeout(t);
  }, [onArrow, current, anchor, move]);

  return (
    <div onPointerLeave={(e) => e.pointerType !== "touch" && close()}>
      <ol className="grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const isAnchor = anchor === i;
          const gone = anchor !== null && !isAnchor;
          /* The anchor wears whichever step is being read; the rest wear
             their own, so they are correct the moment they come back. */
          const at = isAnchor ? shown : i;
          const step = steps[at];
          const last = i === steps.length - 1;

          return (
            <li
              key={s.word}
              className={cn("relative lg:row-start-1", COLUMN[i])}
            >
              <div
                style={
                  {
                    "--slide": `calc(${-i} * (100% + 1.75rem))`,
                  } as React.CSSProperties
                }
                className={cn(
                  /* `translate`, not `transform`: Tailwind v4 compiles
                     translate-x-* to the standalone `translate` property,
                     so a transition list naming `transform` covers
                     nothing and the card teleports into column 1. */
                  "relative flex h-full transition-[translate,opacity] duration-500 ease-out motion-reduce:transition-none",
                  isAnchor && "z-20 lg:translate-x-(--slide)",
                  /* Only where there is a row to clear. Below lg the cards
                     are stacked, so fading three of them leaves three card
                     sized holes in the page and the one being read floating
                     in the middle of them. */
                  gone && "lg:pointer-events-none lg:opacity-0",
                )}
              >
                <button
                  type="button"
                  aria-expanded={isAnchor}
                  aria-controls={paneId}
                  onPointerEnter={(e) =>
                    e.pointerType !== "touch" && anchor === null && open(i)
                  }
                  /* Focus always re-anchors, where hover only opens from
                     idle: a keyboard can reach a card that has dissolved,
                     and it has to become the visible one when it does. */
                  onFocus={() => open(i)}
                  onClick={() => (isAnchor ? close() : open(i))}
                  className={cn(
                    "flex h-full w-full cursor-pointer flex-col rounded-2xl border bg-white px-4 py-4 text-center transition-colors duration-brand",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
                    isAnchor
                      ? "border-orange-300 shadow-md"
                      : "border-neutral-200 shadow-sm",
                  )}
                >
                  {/* The shell stays; only what is written on it changes. */}
                  <span
                    className={cn(
                      "flex flex-col transition-opacity ease-out motion-reduce:transition-none [transition-duration:220ms]",
                      isAnchor && !lit ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {/* Centred, not ranged left (client, 23 Sep 2026). */}
                    <span className="text-label-sm text-center tracking-[0.16em] text-neutral-700 uppercase">
                      Step {at + 1}
                    </span>

                    <span className="flex items-center justify-center py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element --
                          SVG; see the note on the pillar grid. */}
                      <img
                        src={`/images/method/${step.word.toLowerCase()}.svg`}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="size-24 object-contain"
                      />
                    </span>

                    <span className="block text-center text-heading-2 text-orange-700">
                      {step.label ?? step.word}
                    </span>
                    <span className="mt-2 block text-body leading-relaxed text-neutral-700">
                      {step.line}
                    </span>
                  </span>
                </button>

                {/* The two ways along the row, in the card's top corners
                    and drawn as the gutter arrows are drawn - the bare
                    glyph, no ring around it (client, 24 Sep 2026). */}
                {isAnchor && (
                  <>
                    <CardArrow
                      dir={-1}
                      onEnter={setOnArrow}
                      onLeave={setOnArrow}
                      onMove={move}
                    />
                    <CardArrow
                      dir={1}
                      onEnter={setOnArrow}
                      onLeave={setOnArrow}
                      onMove={move}
                    />
                  </>
                )}
              </div>

              {/* The arrow in the gutter after this card. Outside the
                  wrapper above, so it neither slides nor fades with the
                  card it follows. The first one survives the open - it is
                  the one pointing from the card being read into the pane;
                  the other two would be pointing at the middle of the
                  pane, so they go. */}
              {!last && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-1/2 -right-6 z-10 hidden -translate-y-1/2 text-orange-600 transition-opacity duration-500 ease-out motion-reduce:transition-none lg:block",
                    i > 0 && anchor !== null && "opacity-0",
                  )}
                >
                  <ArrowRight className="size-6" strokeWidth={2.75} />
                </span>
              )}
            </li>
          );
        })}

        {/* The pane. Column 2 spanning 3 at lg, so the grid gives it the
            width of the three cards it replaces and the same gutters;
            full width below, where it simply follows the open card.

            It is one box for the whole of an open run: stepping changes
            what is written in it, never whether it is there. */}
        <li
          id={paneId}
          className={cn(
            "transition-opacity duration-500 ease-out motion-reduce:transition-none",
            "lg:col-start-2 lg:col-span-3 lg:row-start-1",
            /* At lg it is always laid out and only fades, because it has
               a cell of its own to sit in and dissolving is the point.
               Below lg it is in normal flow after the cards, so when it
               is shut it has to be display:none or it reserves a card of
               empty space at the foot of the list. */
            anchor !== null
              ? "block opacity-100 lg:delay-200"
              : "hidden opacity-0 lg:pointer-events-none lg:block",
          )}
        >
          <Pane step={steps[shown]} lit={lit} />
        </li>
      </ol>

      {/* The loop: the fourth step carried back to the first. Restored
          from 9026b40 unchanged (client, 24 Sep 2026) - it went missing
          in the rebuild, and without it the row is a list with a full
          stop rather than a cycle. Only where the row is horizontal;
          stacked at one and two columns it would be drawing a line
          between two cards that are not side by side. */}
      <svg
        aria-hidden
        viewBox="0 0 1000 34"
        preserveAspectRatio="none"
        className="mt-8 hidden h-8 w-full lg:block"
      >
        <defs>
          <marker
            id="method-loop-head"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <path
          d="M994 2 V20 Q994 30 984 30 H16 Q6 30 6 20 V8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          markerEnd="url(#method-loop-head)"
          className="text-orange-600"
        />
      </svg>

      {cta && <div className="mt-10 flex justify-center">{cta}</div>}
    </div>
  );
}

/**
 * A way along the row, sitting in the card's own top corner.
 *
 * The same glyph and weight as the arrows in the gutters, with nothing
 * drawn around it. The padding is not decoration: it is what gives a
 * 24px icon a target big enough to hit (WCAG 2.5.8).
 */
function CardArrow({
  dir,
  onEnter,
  onLeave,
  onMove,
}: {
  dir: -1 | 1;
  onEnter: (d: -1 | 1) => void;
  onLeave: (d: null) => void;
  onMove: (d: -1 | 1) => void;
}) {
  const Icon = dir === 1 ? ArrowRight : ArrowLeft;
  return (
    <button
      type="button"
      aria-label={dir === 1 ? "Next step" : "Previous step"}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        onMove(dir);
        onEnter(dir);
      }}
      onPointerLeave={() => onLeave(null)}
      onClick={() => onMove(dir)}
      className={cn(
        "absolute top-2 z-30 cursor-pointer p-1.5 text-orange-600 transition-colors duration-brand",
        "hover:text-orange-800",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
        dir === 1 ? "right-2" : "left-2",
      )}
    >
      <Icon className="size-6" strokeWidth={2.75} />
    </button>
  );
}

/**
 * What the open step touches, each piece with its own mark.
 *
 * Four columns at lg: the pane is three cards wide there, and twelve
 * pieces over four columns is three rows, which fits inside the height
 * of the card beside it. More columns and the labels start to break.
 *
 * `lit` fades the contents and not the box, so a step can be exchanged
 * without the pane itself blinking out from under the reader.
 */
function Pane({ step, lit }: { step: MethodStepContent; lit: boolean }) {
  return (
    <div className="h-full rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm sm:px-6">
      <div
        className={cn(
          "transition-opacity ease-out motion-reduce:transition-none [transition-duration:220ms]",
          lit ? "opacity-100" : "opacity-0",
        )}
      >
        <p className="text-label-sm text-center tracking-[0.16em] text-neutral-700 uppercase">
          {step.pieceLabel}
        </p>
        <ul className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {step.pieces.map((piece) => {
            const icon = PIECE_ICONS[piece];
            return (
              <li key={piece} className="flex items-center gap-2.5">
                {icon && (
                  /* eslint-disable-next-line @next/next/no-img-element --
                     SVG; see the note on the pillar grid. */
                  <img
                    src={icon}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="size-8 shrink-0 object-contain"
                  />
                )}
                <span className="text-body leading-snug text-neutral-800">
                  {piece}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
