import Link from "@/components/site/live-link";
import { ArrowRight } from "lucide-react";

import {
  MEMBERSHIPS,
  type Membership,
  type MembershipSlug,
} from "@/content/memberships";
import { Photo, GENERATED } from "@/components/site/photo";

/**
 * The four programmes, side by side.
 *
 * Foundation, Preserve, Continuum, Signature: four white cards of the same
 * size and weight (1px border, 12px radius). No badge, no highlighted card,
 * no "most requested" or "recommended" (CPSBC §2.12; NO TIER RANKING in
 * content/memberships.ts). Static server markup: no flip, no client code.
 *
 * Slugs stay as they are in content/memberships.ts (executive = Preserve,
 * ageing-in-place = Continuum); only the home-page names are set here.
 * Photographs are the generated pictures of invented people, covered by
 * COMPLIANCE.modelPhotoDisclaimer in the footer.
 */

const ORDER: MembershipSlug[] = [
  "foundation",
  "executive",
  "ageing-in-place",
  "signature",
];

const CARDS = ORDER.map((slug) => MEMBERSHIPS.find((m) => m.slug === slug)).filter(
  (m): m is Membership => Boolean(m),
);

const CARD_COPY: Record<string, { name?: string; line?: string }> = {
  executive: {
    name: "Monarch Preserve",
    line: "I want to protect my health and performance.",
  },
  "ageing-in-place": {
    name: "Monarch Continuum",
    line: "I want to stay strong, capable and independent.",
  },
};

const CARD_PHOTOS = {
  foundation: GENERATED.membershipFoundation,
  executive: GENERATED.membershipExecutive,
  "ageing-in-place": GENERATED.membershipPreserve,
  signature: GENERATED.membershipSignature,
} as const;

export function MembershipCards() {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((m) => {
        const copy = CARD_COPY[m.slug];
        const name = copy?.name ?? m.name;
        return (
          <li key={m.slug} className="flex">
            <Link
              href={`/memberships/${m.slug}`}
              className="flex w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            >
              <Photo
                {...CARD_PHOTOS[m.slug]}
                aspect="landscape"
                rounded={false}
                className="w-full"
                sizes="(min-width: 64rem) 22vw, (min-width: 40rem) 45vw, 92vw"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-heading-4 leading-tight font-semibold text-navy-900">
                  {name}
                </h3>
                <p className="mt-2 text-body-lg font-semibold text-navy-900">
                  {copy?.line ?? m.navPromise}
                </p>
                <p className="mt-2 text-body-lg leading-snug font-normal text-neutral-900">
                  <span className="font-semibold text-navy-900">{m.focus}.</span>{" "}
                  {m.profile}
                </p>
                <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-body-lg font-semibold text-orange-700">
                  What it includes
                  <span className="sr-only"> in {name}</span>
                  <ArrowRight aria-hidden className="size-4" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
