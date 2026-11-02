import { ArrowRight } from "lucide-react";

import type { FocusArea } from "@/content/healthspan";
import { FlipCard } from "@/components/site/flip-card";

/**
 * The twelve pillars, as cards that turn over.
 *
 * The drawing is the front and the words are the back (client, 20 Sep
 * 2026), which is what let the card come down from 303px to 176px — the
 * illustration and the copy no longer have to stack. Clicking still goes
 * to the topic; only hovering turns the card.
 *
 * The photographs went on 20 Sep 2026 ("change the 12 pillars to
 * something else — vector designs, drawings, illustrations"). Generated
 * vector art instead (Magnific, Recraft v4 Pro Vector): one prompt style
 * across all twelve, navy linework with a burnt-orange accent, matched
 * stroke weight, flat. It suits this grid better than photography did —
 * twelve photographs of twelve abstractions ("functional reserve",
 * "early detection") were always going to be pictures of something
 * adjacent to the subject rather than of it.
 *
 * One height for all twelve (Jeffrey, 28 Oct 2026): 17rem (272px) at every
 * width, down from 320 to 384px. The tallest back text measures 199px on a
 * desktop (Cardio-Respiratory Health, Early Detection and Functional
 * Reserve) and 174px on a narrower screen, so 272px leaves about 36px above
 * and below it at the worst and 49px at the least. Re-measure if a summary
 * is lengthened.
 *
 * Card height and columns (7 Oct 2026): the back's summary is now 18px, the
 * same as body text, so the grid is one column on a phone, two to lg and
 * three to xl and four from there, and the cards are taller. The back text
 * was replaced with the longer assessment copy the same day, which is
 * what sets the heights (measured against the longest, Early Detection). At 12px
 * the grid was two, three and four columns at h-44.
 *
 * The name appears on the front only where the card cannot turn. See the
 * note in components/site/flip-card.tsx: `hover:` is gated behind
 * `@media (hover: hover)`, so on a phone the back never comes round and
 * an unlabelled drawing is all the reader would get. The summary is
 * genuinely desktop-only as a result — it is on the topic's own page,
 * which is where the tap goes.
 */
export function PillarsGrid({ areas }: { areas: FocusArea[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-3">
      {areas.map((area) => (
        <li
          key={area.slug}
          className="h-[17rem] w-full sm:w-[calc((100%-0.75rem)/2)] lg:w-[calc((100%-1.5rem)/3)] xl:w-[calc((100%-2.25rem)/4)]"
        >
          <FlipCard
            href={`/healthspan/${area.slug}`}
            front={
              <div className="relative size-full bg-navy-50">
                {/* The drawing is the front again (Jeffrey, 28 Oct 2026: the
                    photographs made the grid feel overloaded). The twelve
                    vector drawings in /images/pillars were never deleted.
                    pb-12 keeps the drawing clear of the name plate. */}
                <div className="flex size-full items-center justify-center p-4 pb-12">
                  {/* eslint-disable-next-line @next/next/no-img-element --
                      an SVG has nothing for the image optimiser to do, and
                      next/image would need dangerouslyAllowSVG set
                      site-wide to carry it. */}
                  <img
                    src={`/images/pillars/${area.slug}.svg`}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="h-full max-h-full w-auto max-w-full object-contain"
                  />
                </div>
                {/* The name on the front as well as the back (client,
                    20 Sep 2026): on a phone the card never turns, so the
                    front is the only face most readers see. Navy on a white
                    plate over the drawing's ground. aria-hidden: the back
                    carries the real heading. */}
                <div
                  aria-hidden
                  className="absolute inset-x-3 bottom-3 flex flex-col items-center text-center"
                >
                  <p className="rounded-xl bg-white/90 px-3 py-1.5 text-body leading-tight font-semibold text-navy-900 shadow-sm backdrop-blur-sm">
                    {area.name}
                  </p>
                </div>
              </div>
            }
            /* Centred in the face rather than stacked from the top
               (client, 20 Sep 2026). pb-9 keeps the centred block out of
               the corner the arrow is anchored in, so a long summary
               cannot grow into it. */
            back={
              <div className="relative flex size-full flex-col justify-center p-4">
                <h3 className="text-body leading-tight font-semibold text-navy-900">
                  {area.name}
                </h3>
                <p className="mt-1.5 text-body-lg leading-snug font-normal text-neutral-900">
                  {area.flip}
                </p>
                {/* In the flow under the text, not pinned to the corner, so the
                    block centres with the same space above and below it
                    (Jeffrey, 7 Oct 2026) and the arrow can never sit on the
                    last line. */}
                <span className="mt-2 inline-flex items-center gap-2 self-end text-label-sm font-semibold text-orange-700">
                  <span className="sr-only">More on {area.name}</span>
                  <ArrowRight aria-hidden className="size-4" />
                </span>
              </div>
            }
          />
        </li>
      ))}
    </ul>
  );
}
