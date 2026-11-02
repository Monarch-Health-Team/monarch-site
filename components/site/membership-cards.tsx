import Link from "@/components/site/live-link";
import { ArrowRight } from "lucide-react";

import {
  MEMBERSHIPS,
  getMembership,
  type Membership,
} from "@/content/memberships";
import { Photo, GENERATED, MEMBERSHIP_PHOTOS } from "@/components/site/photo";
import { FlipCard } from "@/components/site/flip-card";

/**
 * The memberships, on a continuum.
 *
 * Three cards in a row, then Signature as a wide block beneath them.
 * The three on the rail are the ones a life moves through; Signature is
 * not a stage, it is a depth, so it sits apart, running the full width of
 * the row at half its height.
 *
 * Order and stages were reset on 21 Sep 2026 against the product
 * architecture draft, which settles the tier ladder by fee: Foundation,
 * Preserve, Executive, Signature. Access folded into Foundation and
 * Continuum into Executive. The life stages were rewritten to ascend with
 * the ladder, which is a real change of positioning for Preserve and
 * Executive — both are flagged in content/memberships.ts as needing
 * sign-off, and Foundation's own page carries the pending banner.
 *
 * Nothing here hard-codes a name or a band: the order and the stages are
 * MEMBERSHIPS' own, so this, the nav dropdown and the hub cannot drift.
 *
 * Stages stay guidance and are never an age gate (R3.5), which is why
 * they read as a span of years on a rail rather than as a rule on a card.
 */

/**
 * The wash over every photograph.
 *
 * Was a gradient rising from the bottom edge only, with the name in
 * orange-300 on it; the client could not read the names against the
 * pictures (21 Sep 2026: "the current colour is getting too dull ...
 * maybe we can have the overlay in black and have the font colour in
 * white"). So the type is plain white, which is the brightest thing a
 * card can hold, and the wash sits where the type sits.
 *
 * Two bands, not a full-height wash (client, same day: "only on the top
 * and bottom"). The middle third carries no ink and so takes no wash -
 * the photograph is a photograph there. The stops are proportional
 * rather than a fixed number of pixels so the same wash serves the 4:5
 * cards and the 9:2 strip, whose type sits at the same fraction of
 * their very different heights.
 *
 * Each band holds most of its weight to about an eighth of the way in,
 * which is where a name's descenders land, and only then falls away. A
 * plain linear fade measured 0.28 under the name and lost it against a
 * bright frame. White on 62% black over the worst case - a blown-out
 * white photograph - measures 5.4:1.
 */
const SCRIM = "absolute inset-0";

/**
 * The words sit on small white plates, not on a wash over the photograph
 * (Jeffrey, 21 Oct 2026: the gradient hid too much of the picture).
 */
const PLATE =
  "mx-auto w-fit max-w-full rounded-xl bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm";

/** The three staged memberships, in order. Signature is not one of them. */
const STAGED = MEMBERSHIPS.filter((m) => m.slug !== "signature");

/**
 * What the home page card shows, which is not what the nav shows (Jeffrey,
 * 7 Oct 2026). The line at the foot of each card is the member's own
 * sentence rather than the nav promise. The back of each card carries the
 * membership's focus and profile (10 Oct 2026, client brief) instead of
 * `m.promise`. Home page only: `m.name` and `m.navPromise` stay as they are
 * everywhere else.
 */
const CARD_COPY: Record<string, { name?: string; line: string }> =
  {
    foundation: {
      line: "I’m healthy and I want to stay that way.",
    },
    executive: {
      line: "I want to protect my health and performance.",
    },
    "ageing-in-place": {
      line: "I want to stay strong, capable and independent.",
    },
  };

export function MembershipCards() {
  return (
    <div>
      <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {STAGED.map((m) => (
          /* 4:5, not square (client, 21 Sep 2026: zoomed out). The
             photographs are 9:16 and 3:4 portraits shown at full width,
             so the only lever on how much of one you see is the box's
             own height: square showed 56% of Preserve's photograph, 4:5
             shows 70%.
             Below lg there is no flip (Jeffrey, 7 Oct 2026): a touch
             screen gets one plain card with the back's words on its
             face. The flip card is from lg up, where a pointer exists. */
          <li key={m.slug} className="lg:aspect-[3/4]">
            <div className="lg:hidden">
              <StageCardStatic m={m} />
            </div>
            <div className="hidden size-full lg:block">
              <StageCard m={m} />
            </div>
          </li>
        ))}
      </ul>

      {/* Signature, the full width of the row above it. Not on the rail:
          it is offered at any age, so putting it at one end of a timeline
          would say the opposite of what it is. */}
      <div className="mt-5">
        <SignatureBlock />
      </div>
    </div>
  );
}

/**
 * The membership card without a flip, for screens below lg (Jeffrey, 7 Oct
 * 2026). The photograph with the name on it, then the card's own line and
 * the words that sit on the back of the flip card, with the age as the last
 * sentence. Beside the photograph from md, under it below that.
 */
function StageCardStatic({ m }: { m: Membership }) {
  const copy = CARD_COPY[m.slug];
  const name = copy?.name ?? m.name;
  return (
    <Link
      href={`/memberships/${m.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 md:flex-row"
    >
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[18rem] md:w-2/5 md:shrink-0">
        <Photo
          {...MEMBERSHIP_PHOTOS[m.slug]}
          aspect="square"
          rounded={false}
          className="size-full"
          sizes="(min-width: 48rem) 40vw, 92vw"
        />
        <h3 className={`absolute inset-x-4 top-4 text-center text-heading-4 leading-tight font-semibold text-navy-900 ${PLATE}`}>
          {name}
        </h3>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
        <p className="text-body-lg font-semibold text-navy-900">
          {copy?.line ?? m.navPromise}
        </p>
        <p className="mt-2 text-body-lg leading-snug font-normal text-neutral-900">
          <span className="font-semibold text-navy-900">{m.focus}.</span> {m.profile}{" "}
          {m.stage}.
        </p>
        <span className="mt-3 inline-flex items-center gap-2 text-label font-semibold text-orange-700">
          What it includes
          <ArrowRight aria-hidden className="size-4" />
        </span>
      </div>
    </Link>
  );
}

function StageCard({ m }: { m: Membership }) {
  const copy = CARD_COPY[m.slug];
  const name = copy?.name ?? m.name;
  return (
    <FlipCard
      href={`/memberships/${m.slug}`}
      front={
        <div className="relative size-full">
          <Photo
            {...MEMBERSHIP_PHOTOS[m.slug]}
            aspect="square"
            rounded={false}
            className="size-full"
            sizes="(min-width: 48rem) 34vw, 92vw"
          />
          {/* aria-hidden: the back carries the real heading, and a
              screen reader reads both faces. */}
          <div aria-hidden className="absolute inset-0">
            <div className={SCRIM} />
            <div className="relative flex size-full flex-col justify-between px-4 py-4 text-center">
              <div className={PLATE}>
                <p className="text-heading-4 leading-tight font-semibold text-navy-900">
                  {name}
                </p>
                {/* The band shows here too, because the rail above it is
                    desktop-only and a phone would otherwise lose it. */}
                <p className="text-label-sm mt-1 text-navy-900 md:hidden">
                  {m.stageShort}
                </p>
              </div>
              <p className={`text-body-lg leading-snug font-medium text-balance text-navy-900 ${PLATE}`}>
                {copy?.line ?? m.navPromise}
              </p>
            </div>
          </div>
        </div>
      }
      back={
        <div className="relative flex size-full flex-col justify-center p-5 pb-10">
          <h3 className="text-heading-4 leading-tight font-semibold text-orange-700">
            {name}
          </h3>
          <p className="mt-2 text-body-lg leading-snug font-normal text-neutral-900">
            <span className="font-semibold text-navy-900">{m.focus}.</span> {m.profile}{" "}
          {m.stage}.
          </p>
          <span className="absolute right-5 bottom-4 inline-flex items-center gap-2 text-label-sm font-semibold text-orange-700">
            <span className="sr-only">What {name} includes</span>
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </div>
      }
    />
  );
}

/**
 * The words on the back of the Signature card (Jeffrey, 7 Oct 2026), home
 * page only. `m.promise` stays as it is for the menu and the membership's
 * own pages.
 */

export function SignatureBlock({ flip = true }: { flip?: boolean } = {}) {
  const m = getMembership("signature");
  if (!m) return null;
  const front = (
          <div className="relative size-full">
            {/* Not MEMBERSHIP_PHOTOS[m.slug], which is the only place on
                the site where a membership's own photograph is not used:
                at 9:2 the 3:4 portrait of the couple at the helm showed a
                band across their foreheads and nothing else (client,
                21 Sep 2026). This one was shot for the strip. The hub
                card and the membership's own page still carry the couple,
                in the 3:4 and 4:3 boxes it was shot for. */}
            <Photo
              {...GENERATED.signatureSloop}
              aspect="banner"
              rounded={false}
              className="size-full"
              sizes="(min-width: 48rem) 100vw, 92vw"
            />
            <div aria-hidden className="absolute inset-0">
              <div className={SCRIM} />
              <div className="relative flex size-full flex-col justify-between px-6 py-4 text-center">
                <p className={`text-heading-3 leading-tight font-semibold text-navy-900 ${PLATE}`}>
                  {m.name}
                </p>
                <p className={`text-body-lg leading-snug font-medium text-balance text-navy-900 ${PLATE}`}>
                  {m.navPromise}
                </p>
              </div>
            </div>
          </div>
  );
  if (!flip) {
    // No turning (Jeffrey, 7 Oct 2026, Memberships page): the same wide
    // photograph and words as the home page, one face, the whole block a
    // link to the membership's page.
    return (
      <div className="aspect-[2/1] md:aspect-[9/2]">
        <Link
          href={`/memberships/${m.slug}`}
          className="group relative block size-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          {front}
        </Link>
      </div>
    );
  }
  const sigStatic = (
    <Link
      href={`/memberships/${m.slug}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
    >
      <div className="relative aspect-[2/1] sm:aspect-[3/1]">
        <Photo
          {...GENERATED.signatureSloop}
          aspect="banner"
          rounded={false}
          className="size-full"
          sizes="92vw"
        />
        <h3 className={`absolute inset-x-4 top-4 text-center text-heading-3 leading-tight font-semibold text-navy-900 ${PLATE}`}>
          {m.name}
        </h3>
      </div>
      <div className="flex flex-col items-center p-5 text-center">
        <p className="text-body-lg font-semibold text-navy-900">
          {m.navPromise}
        </p>
        <p className="mt-2 max-w-[60ch] text-body-lg leading-snug font-normal text-neutral-900">
          <span className="font-semibold text-navy-900">{m.focus}.</span> {m.profile}{" "}
          {m.stage}.
        </p>
        <span className="mt-3 inline-flex items-center gap-2 text-label font-semibold text-orange-700">
          What it includes
          <ArrowRight aria-hidden className="size-4" />
        </span>
      </div>
    </Link>
  );
  return (
    // 3:2, after 21:9 and then 16:9 (client, 21 Sep 2026, twice). The
    // source is a 3:4 portrait, so the block's ratio is what decides how
    // much of it survives: 21:9 showed a 32% band of the photograph's
    // height, 16:9 showed 42%, 3:2 shows 50%.
    // Half the height it had, running the full width of the container
    // (client, 21 Sep 2026). The old block was two thirds of the width at
    // 3:2; half of that height across the whole width is 9:2, which is
    // what it is set to. On a phone it was already full width, so the
    // same halving gives 2:1.
    <>
    <div className="lg:hidden">{sigStatic}</div>
    <div className="hidden lg:block lg:aspect-[9/2]">
      <FlipCard
        axis="x"
        href={`/memberships/${m.slug}`}
        front={front}
        back={
          <div className="relative flex size-full flex-col items-center justify-center px-6 py-5 text-center md:px-10">
            <h3 className="text-heading-4 leading-tight font-semibold text-orange-700">
              {m.name}
            </h3>
            <p className="mt-2 max-w-[60ch] text-body-lg leading-snug font-normal text-neutral-900">
              <span className="font-semibold text-navy-900">{m.focus}.</span> {m.profile}{" "}
          {m.stage}.
            </p>
            <span className="absolute right-6 bottom-4 inline-flex items-center gap-2 text-label-sm font-semibold text-orange-700">
              <span className="sr-only">What {m.name} includes</span>
              <ArrowRight aria-hidden className="size-4" />
            </span>
          </div>
        }
      />
    </div>
    </>
  );
}
