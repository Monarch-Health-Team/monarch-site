"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { ButterflyMark } from "@/components/site/butterfly-mark";
import { InfoTooltip } from "@/components/site/info-tooltip";

/**
 * Lifespan, healthspan, Monarch — three words on one track.
 *
 * Sixth pass, and the shortest (client, 20 Sep 2026: "only three pieces
 * of information there ... a much simpler, cleaner way ... do not expand
 * this band"). Designed through the Epic Infographics workflow; the
 * study render is docs/infographics/spans-band.png.
 *
 *   LIFESPAN ⓘ  [▓▓▓ Healthspan ⓘ ▶] 🦋 ·············· ⓘ
 *
 * The track is the life. The filled part is the healthspan, and the
 * arrow is on that end, because the healthspan is the thing Monarch
 * moves. The butterfly follows the point. What is left is the gap.
 *
 * Three words became one word and three icons (client, 20 Sep 2026).
 * The orange block labelled "Monarch pushes this further" is gone: two
 * filled quantities side by side read as two measurements, where one
 * quantity with a point on it reads as a direction, which is what
 * Monarch actually supplies. What each part means now lives behind an
 * information icon, and the icon is the point — a tooltip nobody knows
 * is there is a tooltip nobody reads.
 *
 * The hover is an enhancement, never the only copy. Every one of those
 * notes is also in the figcaption, which is always in the DOM and
 * always announced, so the band still says what it means to a reader
 * who never hovers, never taps and never sees it at all.
 *
 * Pastel fills, navy ink (client, same day). The ink stays navy-900
 * because it is the only value at which labels this small clear AA on
 * pastel grounds: 11.8:1 on the track and 8.2:1 on the fill.
 *
 * Earlier attempts — two stacked bars, one bar with the spans labelled
 * underneath, the boxed frame — are all in the git history.
 */

/** How much of the life is drawn as the healthy part. */
const HEALTHSPAN = 60;

/**
 * Where the drawing stops short of a claim.
 *
 * The bar carries no axis, no scale and no numbers, and the split is
 * illustrative. A stated length would be a claim about how many years
 * Monarch adds, and there is no cleared source for one. Put a figure
 * anywhere near this track and it needs that source and an illustrative
 * caveat with it (playbook §13.12, CPSBC §2.13).
 */

/** The chevron's point, in px, cut out of the healthy part's right end. */
const NIB = 16;

/**
 * The chevron, drawn once and used by both bars.
 *
 * A function rather than a constant because the nib is a px value and
 * the shape has to be identical on the static bar and the moving one -
 * a pixel of difference between them shows as a seam when the moving
 * one dissolves away.
 */
const CHEVRON = `polygon(0 0, calc(100% - ${NIB}px) 0, 100% 50%, calc(100% - ${NIB}px) 100%, 0 100%)`;

export function SpansBand() {
  const reduce = useReducedMotion();
  const tug = reduce
    ? {}
    : {
        animate: { x: [0, 7, 0], y: [0, -3, 0], rotate: [0, -5, 0] },
        transition: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <figure>
      {/* The lifespan bar runs the full width of the container and holds
          everything, its own label included (client, 21 Sep 2026). Inside
          it: one light track, with the healthspan laid over the left of
          it rather than sitting beside it, so the lighter bar reads as
          continuing behind. The outer bar keeps the height the old track
          had and the inner one is shortened to sit within it, so the band
          is no taller than it was: 9 outside, 5 inside. */}
      <div className="flex h-9 items-center gap-3 rounded-md bg-navy-100 px-1.5 sm:h-10 sm:gap-4">
        <div className="relative h-5 min-w-0 flex-1 rounded-sm bg-navy-50 sm:h-6">
          {/* The gap explains itself and drives nothing: the reach runs
              on its own now, so this is only a tooltip. It sits above
              the bar that sweeps across it (z-20) so hovering the gap
              works at every moment of the loop, and the bars below carry
              pointer-events-none so they cannot take the pointer off it
              mid-sweep. */}
          <div
            className="absolute inset-y-0 right-0 z-20"
            style={{ left: `${HEALTHSPAN}%` }}
          >
            {/* The gap named on the drawing itself (client brief, 10 Oct
                2026: clear without extensive text), in the same small caps
                as the word Lifespan. Decoration for the tooltip below,
                which carries the meaning. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-[0.625rem] leading-none tracking-[0.13em] text-navy-900 uppercase sm:text-label-sm"
            >
              The gap
            </span>
            <InfoTooltip
              label="What this gap means"
              side="bottom"
              align="right"
              bare
              className="absolute inset-0"
            >
              This is the difference between the two, the years lived unwell.
              Monarch&rsquo;s work aims to narrow it, supporting more of your
              years in good health.
            </InfoTooltip>
          </div>

          {/* Two healthy parts, one behind the other.
              The back one never moves: it is what the reader is left
              looking at when the front one dissolves, so the drawing
              never appears to lose ground. The front one grows, carries
              the butterfly at its point, and fades out at the far end.
              Both are decoration - the label above them is the content
              and the target. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 rounded-l-sm bg-navy-300"
            style={{ width: `${HEALTHSPAN}%`, clipPath: CHEVRON }}
          />
          <div
            aria-hidden
            className="animate-span-reach pointer-events-none absolute inset-y-0 left-0 rounded-l-sm bg-navy-300"
            style={{ width: `${HEALTHSPAN}%`, clipPath: CHEVRON }}
          />

          {/* The word sits above both bars (z-10) and stays where the
              static one ends, so it neither travels with the reach nor
              disappears with it. It is also the only thing here a
              pointer can reach besides the gap. */}
          <div
            className="absolute inset-y-0 left-0 z-10"
            style={{ width: `${HEALTHSPAN}%` }}
          >
            <InfoTooltip
              label="What healthspan means"
              side="bottom"
              className="absolute inset-0"
              triggerClassName="size-full justify-center gap-1.5 rounded-none pr-4 pl-2 text-navy-900 hover:text-navy-700"
              trigger={
                <span
                  aria-hidden
                  className="truncate text-[0.625rem] leading-tight font-semibold sm:text-[0.8125rem]"
                >
                  Healthspan
                </span>
              }
            >
              Healthspan is the period of life spent in good health, with the
              physical, cognitive and functional capacity to remain independent
              and engaged in the things that matter most.
            </InfoTooltip>
          </div>

          {/* Two spans, not one: the outer carries the position and the
              fade, which is the keyframe's business, and the inner
              carries the tug, which framer writes as a transform. One
              element cannot do both - framer's inline transform would
              take the centring with it.

              The keyframe is the reach's twin, so the butterfly is
              always at the point of the bar it is pulling. */}
          <span
            aria-hidden
            className="animate-span-butterfly pointer-events-none absolute top-1/2 block -translate-y-1/2"
          >
            <motion.span {...tug} className="block">
              <ButterflyMark className="h-4 w-auto sm:h-5" />
            </motion.span>
          </span>
        </div>

        {/* The word and its icon are one target, and only that corner
            of the bar - the rest of the lifespan bar is the track. */}
        <InfoTooltip
          label="What lifespan means"
          side="bottom"
          align="right"
          // Sized to the sentence, and pushed out by the bar's 6px
          // padding so its right edge lines up with the bar's.
          noteClassName="w-max max-w-[min(22rem,calc(100vw-2rem))] -mr-1.5"
          className="shrink-0"
          triggerClassName="gap-1.5 rounded-sm px-1 py-1 text-neutral-700 hover:text-navy-900"
          trigger={
            <span
              aria-hidden
              className="text-label-sm tracking-[0.13em] uppercase"
            >
              Lifespan
            </span>
          }
        >
          Lifespan is how long you live.
        </InfoTooltip>
      </div>

      {/* The marks are a drawing, not a sentence, so the reading of it
          lives here and does not depend on anyone hovering. */}
      <figcaption className="sr-only">
        One bar stands for a whole life: that is the lifespan. The filled part
        inside it is the healthspan, the years lived in good health. The
        remainder is the years lived unwell, and Monarch&rsquo;s work aims to
        narrow it, supporting more of your years in good health. Proportions
        are illustrative.
      </figcaption>
    </figure>
  );
}
