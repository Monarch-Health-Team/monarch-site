import type { CSSProperties } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Photography.
 *
 * Every photograph on this site is generated illustrative imagery, not a
 * Monarch Health patient. CPSBC's advertising standard requires that to be
 * disclosed wherever such imagery is used, so `COMPLIANCE.modelPhotoDisclaimer`
 * renders in the site footer on every page — see components/site/site-footer.tsx.
 * Routing it through this one component keeps the two facts together: if you
 * are adding a photograph, you are using this, and the disclosure is already
 * handled.
 *
 * Alt text must describe what is depicted without implying a care outcome or
 * a real patient. "A nurse steadying a woman using a walking frame" is fine;
 * "a Monarch member regaining her mobility" is not.
 *
 * `aspect` crops an image for its slot rather than letterboxing, and
 * `position` moves the crop focus where a face would otherwise be cut.
 */

const ASPECTS = {
  portrait: "aspect-[3/4]",
  tall: "aspect-[2/3]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  banner: "aspect-[21/9]",
} as const;

const ASPECT_RATIOS: Record<keyof typeof ASPECTS, number> = {
  portrait: 3 / 4,
  tall: 2 / 3,
  square: 1,
  landscape: 4 / 3,
  wide: 16 / 9,
  banner: 21 / 9,
};

/** Clear space kept above the head, as a fraction of the source height. */
const HEADROOM = 0.08;

/**
 * object-position for a cover crop that keeps the head in frame.
 *
 * When the slot is wider than the source, the source is scaled to the
 * slot's width and only a band of its height shows. `y` chooses which
 * band: the one whose top edge sits HEADROOM above the head, clamped to
 * the image. When the slot is taller than the source, the whole height
 * shows and only the horizontal centre matters.
 */
export function cropPosition(
  aspect: keyof typeof ASPECTS,
  headTop: number,
  ratio: number,
  subjectX = 0.5,
): string {
  const box = ASPECT_RATIOS[aspect];
  const x = Math.round(subjectX * 100);
  if (ratio >= box) return `${x}% 50%`;
  const visible = ratio / box;
  const room = 1 - visible;
  if (room <= 0.01) return `${x}% 50%`;
  const top = Math.min(room, Math.max(0, headTop - HEADROOM));
  return `${x}% ${Math.round((top / room) * 100)}%`;
}

export function Photo({
  src,
  alt,
  focal,
  aspect = "portrait",
  className,
  position,
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  rounded = true,
  imgClassName,
  imgStyle,
  unoptimized = false,
  headTop,
  ratio,
  subjectX,
}: {
  src: string;
  alt: string;
  /**
   * Where the faces are, as an object-position. Carried on each entry in
   * PHOTOS and spread in with it, so every crop of a given photograph lands
   * on the same point instead of each call site guessing.
   *
   * Every source image is portrait, so a banner or landscape crop discards
   * most of the height — get this wrong and the crop takes the foreheads.
   * The values were read off a percentage grid laid over each image.
   */
  focal?: string;
  aspect?: keyof typeof ASPECTS;
  className?: string;
  /** Overrides `focal` for a one-off crop. */
  position?: string;
  /**
   * Where the top of the subject's head sits, as a fraction of the source
   * height, and the source's own width/height ratio. When both are known
   * the crop is computed so the head keeps HEADROOM of clear space above
   * it at any aspect, instead of trusting a hand-set focal point.
   */
  headTop?: number;
  ratio?: number;
  /** Horizontal centre of the subject, as a fraction, for portrait crops. */
  subjectX?: number;
  priority?: boolean;
  sizes?: string;
  rounded?: boolean;
  /** Extra classes on the <img> itself — hover scale on a card, for instance. */
  imgClassName?: string;
  /** Extra style on the <img> itself, for a crop a class cannot express —
      see the CROP map in components/site/services-timeline.tsx. */
  imgStyle?: CSSProperties;
  /** For a remote source not in the image allow-list. Local files never need it. */
  unoptimized?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-100",
        rounded && "rounded-lg",
        ASPECTS[aspect],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        className={cn("object-cover", imgClassName)}
        style={{
          objectPosition:
            position ??
            (headTop !== undefined && ratio !== undefined
              ? cropPosition(aspect, headTop, ratio, subjectX)
              : (focal ?? "center")),
          ...imgStyle,
        }}
      />
    </div>
  );
}

/**
 * Generated illustrative imagery (Magnific, Seedream 5 Pro, 9 Sep 2026).
 * Chosen to show the whole audience, not only its oldest members: the
 * topics and the two doctor-led services carry people in their twenties to
 * forties; the home services keep the older adults they actually serve.
 * Covered by the illustrative-imagery line in COMPLIANCE.modelPhotoDisclaimer.
 * All landscape 4:3 unless noted. `headTop` is where the top of the
 * highest head sits as a fraction of the source height, read off a 10%
 * grid; with `ratio` it lets <Photo> compute a crop that keeps the head in
 * frame with clear space above it. `focal` remains for the backgrounds.
 *
 * The five service photographs were replaced on 20 Sep 2026 and their
 * headTop values re-read off a decile grid laid over the new files — the
 * old numbers described where heads were in pictures that no longer
 * exist, which a banner crop would have taken the foreheads off.
 */
export const GENERATED = {
  metabolic: {
    src: "/images/gen/metabolic.jpg",
    alt: "A woman in her thirties preparing a colourful breakfast in a bright kitchen.",
    focal: "center 45%",
    headTop: 0.01,
    ratio: 1.325,
  },
  heart: {
    src: "/images/gen/heart.jpg",
    alt: "A man in his forties cycling along a coastal road at sunrise.",
    focal: "center 50%",
    headTop: 0.05,
    ratio: 1.325,
  },
  brain: {
    src: "/images/gen/brain-puzzle.jpg",
    alt: "A woman in her fifties absorbed in a jigsaw puzzle at her kitchen table.",
    focal: "center 40%",
    headTop: 0.08,
    ratio: 1.325,
  },
  earlyDetection: {
    src: "/images/gen/early-detection-v2.jpg",
    alt: "A woman in her thirties talking with a physician in a bright consulting room.",
    focal: "center 40%",
    headTop: 0.17,
    ratio: 1.339,
  },
  hormoneHealth: {
    src: "/images/gen/hormone-health.jpg",
    alt: "A woman in her late forties walking a forest trail among tall cedars.",
    focal: "center 40%",
    headTop: 0.12,
    ratio: 1.325,
  },
  nutrition: {
    src: "/images/gen/nutrition.jpg",
    alt: "A couple in their fifties cooking together at a kitchen counter with fresh vegetables and salmon.",
    focal: "center 45%",
    headTop: 0.08,
    ratio: 1.325,
  },
  sleep: {
    src: "/images/gen/sleep.jpg",
    alt: "A man in his forties asleep in a calm bedroom at dawn.",
    focal: "center 50%",
    headTop: 0.55,
    ratio: 1.325,
  },
  mood: {
    src: "/images/gen/mood.jpg",
    alt: "A woman in her forties sitting on a driftwood log on a beach at golden hour, looking out at the water.",
    focal: "center 45%",
    headTop: 0.17,
    ratio: 1.325,
  },
  connection: {
    src: "/images/gen/connection.jpg",
    alt: "Three friends in their sixties and seventies laughing over coffee in a bright café.",
    focal: "center 45%",
    headTop: 0.12,
    ratio: 1.325,
  },
  senses: {
    src: "/images/gen/senses.jpg",
    alt: "A man in his sixties in a clinic room while an audiologist fits a small hearing aid.",
    focal: "center 40%",
    headTop: 0.0,
    ratio: 1.325,
  },
  medications: {
    src: "/images/gen/medications.jpg",
    alt: "A woman in her seventies at her kitchen table reviewing prescription bottles with a physician who is making notes.",
    focal: "center 45%",
    headTop: 0.17,
    ratio: 1.325,
  },
  /** Portrait 9:16, for the Research menu's image cell. */
  menuResearch: {
    src: "/images/gen/menu-research.jpg",
    alt: "A researcher in her thirties reading a printed paper at a desk, laptop open beside her.",
    focal: "center 35%",
    headTop: 0.15,
    ratio: 0.5625,
  },
  /** Portrait 9:16, for the Membership menu's image cell. */
  menuMembership: {
    src: "/images/gen/menu-membership.jpg",
    alt: "An adviser showing a client an open printed brochure at a small table.",
    focal: "center 35%",
    /*
     * 0.05, not the 0.18 recorded before. Read off a decile grid on 21 Sep
     * 2026 when this photograph started carrying Preserve's square card:
     * the man's head begins at about 5% and the woman's at about 8%, so
     * 0.18 was cropping the tops off both. It never showed in the nav
     * menu, where the slot matches the source's own 9:16 and nothing is
     * cropped at all.
     */
    headTop: 0.05,
    ratio: 0.5625,
  },
  /** Portrait 9:16, for the Events menu's image cell. */
  menuEvents: {
    src: "/images/gen/menu-events.jpg",
    alt: "A speaker presenting to a seated audience in a bright hall.",
    focal: "center 35%",
    headTop: 0.22,
    ratio: 0.5625,
  },
  /**
   * Executive membership, in place of the placeholder adviser photograph
   * (the man in that one was cut off by its own frame, 21 Oct 2026). A
   * woman and a man looking through a health summary, both fully in frame.
   */
  membershipExecutiveOffice: {
    src: "/images/gen/membership-executive-office.jpg",
    alt: "A woman in a navy blazer and a man in his fifties looking through a health summary booklet together in a bright office.",
    focal: "center 40%",
    headTop: 0.4,
    ratio: 0.755,
  },
  /** The Community page's photograph: a woman smiling at her laptop, fully in frame. */
  communityTable: {
    src: "/images/gen/community-table.jpg",
    alt: "A woman at her kitchen table smiling at her laptop with a cup of tea.",
    focal: "center 40%",
    headTop: 0.26,
    ratio: 0.755,
  },
  /** Portrait 9:16, for the Community menu's image cell. */
  menuCommunity: {
    src: "/images/gen/menu-community.jpg",
    alt: "A woman at her kitchen table reading a discussion forum on her laptop.",
    focal: "center 45%",
    headTop: 0.05,
    ratio: 0.5625,
  },
  /** Portrait 9:16, for the Healthspan Tools menu's image cell. */
  menuTools: {
    src: "/images/gen/menu-tools.jpg",
    alt: "A woman and her mother looking at a tablet together at a dining table.",
    focal: "center 40%",
    headTop: 0.3,
    ratio: 0.5625,
  },
  /** Portrait 9:16, for the Learn menu's image cell. */
  menuLearn: {
    src: "/images/gen/menu-learn.jpg",
    alt: "A couple in their late sixties laughing together on a coastal walking path.",
    focal: "center 40%",
    headTop: 0.2,
    ratio: 0.5625,
  },
  mobility: {
    src: "/images/gen/mobility.jpg",
    alt: "A couple in their sixties hiking a coastal trail with walking poles.",
    focal: "center 45%",
    headTop: 0.14,
    ratio: 1.325,
  },
  executiveHealth: {
    src: "/images/gen/executive-health-v2.jpg",
    alt: "A man in his thirties having results explained by a physician in a clinic room.",
    focal: "center 40%",
    headTop: 0.26,
    ratio: 1.325,
  },
  familyMedicine: {
    src: "/images/gen/family-medicine.jpg",
    alt: "A young family with two children in a family medicine clinic with a physician.",
    focal: "center 45%",
    headTop: 0.04,
    ratio: 1.325,
  },
  ageingInPlace: {
    src: "/images/gen/ageing-in-place.jpg",
    alt: "A woman in her seventies tending garden beds outside her home while a nurse chats with her.",
    focal: "center 45%",
    headTop: 0.04,
    ratio: 1.325,
  },
  homeCare: {
    src: "/images/gen/home-care.jpg",
    alt: "A care worker and a man in his eighties sharing tea at his kitchen table.",
    focal: "center 45%",
    headTop: 0.17,
    ratio: 1.325,
  },
  nursing: {
    src: "/images/gen/nursing.jpg",
    alt: "A community nurse taking a woman's blood pressure in her living room.",
    focal: "center 45%",
    headTop: 0.03,
    ratio: 1.325,
  },
  /**
   * One picture for each membership's "What we measure" section (Jeffrey,
   * 20 Oct 2026: they all used the same nursing photo). Portrait, so they sit
   * beside the card. Keyed by membership slug; see ASSESSMENT_PHOTOS.
   */
  assessmentFoundation: {
    src: "/images/gen/assessment-foundation.jpg",
    alt: "A young woman having a routine blood draw from a phlebotomist in a bright clinic.",
    focal: "center 45%",
  },
  assessmentExecutive: {
    src: "/images/gen/assessment-executive-bodycomp.jpg",
    alt: "A young professional woman standing on a body composition analyzer in a bright clinic while a clinician reads the result on a tablet.",
    focal: "65% 45%",
  },
  assessmentAgeingInPlace: {
    src: "/images/gen/assessment-ageing-in-place.jpg",
    alt: "A nurse steadying an older woman as she walks across her living room during a balance check.",
    focal: "center 45%",
  },
  assessmentSignature: {
    src: "/images/gen/assessment-signature-final.jpg",
    alt: "A man walking on a treadmill, looking ahead at its display, during a fitness test in a bright clinic with a clinician beside him.",
    focal: "45% 50%",
  },
  /**
   * Wide openings for the three pages that set their intro on a photograph
   * (Jeffrey, 21 Oct 2026): the people sit in the right third so the white
   * wash behind the words on the left does not wash them out.
   */
  heroPrograms: {
    src: "/images/gen/hero-programs-v2.jpg",
    alt: "",
    focal: "center 45%",
  },
  heroAgeingInPlace: {
    src: "/images/gen/hero-ageing-in-place.jpg",
    alt: "",
    focal: "center 50%",
  },
  heroHomeCare: {
    src: "/images/gen/hero-home-care.jpg",
    alt: "",
    focal: "center 55%",
  },
  /**
   * The tall picture beside "How it is arranged" on the two care pages and
   * beside the closing section of Clinical programs (Jeffrey, 21 Oct 2026):
   * it takes the 30 percent column that the shared blood-pressure banner
   * used to run across, one new picture per page.
   */
  arrangedAgeingInPlace: {
    src: "/images/gen/arranged-ageing-in-place.jpg",
    alt: "A care coordinator showing a plan on a tablet to an older couple at their kitchen table.",
    focal: "center 45%",
  },
  arrangedHomeCare: {
    src: "/images/gen/arranged-home-care.jpg",
    alt: "A care worker walking beside an older woman with a cane along a sunny path by her house.",
    focal: "center 50%",
  },
  arrangedPrograms: {
    src: "/images/gen/arranged-programs-centred.jpg",
    alt: "A physician and a man in his fifties sitting across a desk in a bright consulting room, the physician pointing to a plan on a tablet.",
    focal: "center 45%",
  },
  /** The opening of the Healthspan hub (Jeffrey, 21 Oct 2026): family on the right. */
  heroHealthspan: {
    src: "/images/gen/hero-healthspan.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** Research hub opening (Jeffrey, 21 Oct 2026): evidence on the desk, people on the right. */
  heroResearch: {
    src: "/images/gen/research-hero-evidence.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** Resources library opening: a guide helping a visitor find information, people on the right. */
  heroLibrary: {
    src: "/images/gen/library-hero-help.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** Healthspan Tools hub opening: people on the right, room for words on the left. */
  heroTools: {
    src: "/images/gen/hero-tools-table.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** Monarch guides opening: people on the right, room for words on the left. */
  heroGuides: {
    src: "/images/gen/hero-guides-sofa.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** Forms and applications opening: people on the right, room for words on the left. */
  heroForms: {
    src: "/images/gen/hero-forms-table.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** Retirement partnership outcomes band: people on the left, room for words on the right. */
  heroOutcomes: {
    src: "/images/gen/hero-outcomes-tablet.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** Retirement communities partnership opening: nurse and residents on the right. */
  heroRetirement: {
    src: "/images/gen/hero-retirement-lounge.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** About Us menu panel: a bright concierge-style reception, no signage. */
  menuAbout: {
    src: "/images/gen/about-reception-bright.jpg",
    alt: "A bright, calm clinic reception with a welcoming host at a wooden desk, soft chairs and plants by tall windows.",
    focal: "center 55%",
  },
  /** 21:9 backgrounds, decorative only — always rendered aria-hidden. */
  /**
   * A vista over the Salish Sea at first light: firs in the foreground,
   * fog lying in the valleys, forested islands and the mainland range
   * beyond. (The note that stood here described five hikers at a summit,
   * which is not what the file holds; the image was replaced at some
   * point and the comment was not.)
   */
  bgMethod: {
    src: "/images/gen/bg-method-landscape.jpg",
    alt: "",
    focal: "center 55%",
  },
  /**
   * Signature's block on the home page. Shot for that slot: 21:9, the
   * only photograph in the set that is not a portrait of a member.
   *
   * Two goes at it. The membership's own 3:4 portrait of the couple at
   * the helm cannot survive a 9:2 strip - it shows a band across their
   * foreheads and nothing else (client, 21 Sep 2026). The island vista
   * that replaced it was legible but wrong: "showing serenity rather
   * than premium and the elite", which is fair, and is what any wide
   * landscape of this coast will say. So the subject is an object
   * rather than a view - a varnished sloop at a private mooring, empty,
   * lit by the last of the sun against blue hour. Nobody in it, and no
   * boat name, so it stands for the arrangement and not for a member.
   *
   * 72%, not centred: at 9:2 only 52% of the height survives, and the
   * band that holds the hull, the deck and the reflection together
   * starts a third of the way down. Centred, it cuts at the waterline.
   */
  signatureSloop: {
    src: "/images/gen/signature-sloop.jpg",
    alt: "A varnished wooden sloop lying at a private mooring at dusk, its deck empty and its reflection unbroken on still water.",
    focal: "center 72%",
  },
  /**
   * The hero. An open headland with a path running out toward the water,
   * islands and mountains beyond, and sky over most of the frame — the
   * client asked the hero to read as freedom and independence, and the
   * open view does that without putting a person in it. The middle of the
   * frame is deliberately plain sky: the hero's title, line and buttons
   * are centred over it.
   */
  bgHero: {
    src: "/images/gen/bg-hero.jpg",
    alt: "",
    focal: "center 60%",
  },
  bgTrust: {
    src: "/images/gen/bg-trust.jpg",
    alt: "",
    focal: "center 55%",
  },
  bgInsights: {
    src: "/images/gen/bg-insights.jpg",
    alt: "",
    focal: "center 50%",
  },
  /** 3:4 portraits, member-focused, one per membership. */
  /**
   * Foundation's own, shot for it on 22 Sep 2026. The couple it replaced
   * read as forties, and Foundation is the under-forty tier (client:
   * "that's for below 40 years ... I want a younger one").
   *
   * That leaves membershipExecutive below referenced by nothing. Left in
   * place rather than deleted: the file is still on disk and the entry
   * is the only record of what it holds.
   */
  // Changed 16 Oct 2026 (Jeffrey): Foundation is for the whole family, so the
  // photograph is a family of four rather than a couple. The couple's photo
  // (membership-foundation.jpg) is still on disk.
  membershipFoundation: {
    src: "/images/gen/membership-foundation-family.jpg",
    alt: "A family of four, two parents and two children, jogging together along a seaside path at sunset, laughing.",
    focal: "center 40%",
    headTop: 0.25,
    ratio: 0.7545,
  },
  membershipExecutive: {
    src: "/images/gen/membership-executive.jpg",
    alt: "A woman in her thirties and a man in his forties walking briskly along a seafront path, laughing.",
    focal: "center 35%",
    headTop: 0.17,
    ratio: 0.755,
  },
  membershipPreserve: {
    src: "/images/gen/membership-preserve.jpg",
    alt: "A woman in her seventies walking her dog on a pebble beach at low tide.",
    focal: "center 35%",
    headTop: 0.11,
    ratio: 0.755,
  },
  membershipSignature: {
    src: "/images/gen/membership-signature.jpg",
    alt: "A couple in their fifties at the helm of a small sailboat on a bright afternoon.",
    focal: "center 35%",
    headTop: 0.2,
    ratio: 0.755,
  },
  clinicExterior: {
    src: "/images/gen/clinic-exterior.jpg",
    alt: "A converted heritage building housing a medical practice on a tree-lined Victoria street at dusk.",
    focal: "center 55%",
  },
} as const;

/**
 * Photograph per membership.
 *
 * One place to swap — the hub cards and the detail pages both read from
 * here, so they cannot drift. Each is member-focused and matched to the
 * stage the membership serves.
 */
export const MEMBERSHIP_PHOTOS = {
  /*
   * Each photograph is matched to the age its membership serves, not to
   * the name the file happens to carry. The file names are two remappings
   * out of date and are now actively misleading; renaming them is a
   * separate job.
   *
   * Reset again 22 Sep 2026, when Executive and Preserve traded places:
   * Executive is the middle tier now and Preserve the oldest, so the
   * adviser and the woman with the dog swapped with them.
   */
  // under forty
  foundation: GENERATED.membershipFoundation,
  /*
   * PLACEHOLDER. An adviser and a client at a table: a photograph of a
   * transaction rather than of a life stage, and the odd one out in a set
   * of four. Wants a commissioned image of someone in their forties or
   * fifties.
   */
  // forty to sixty-five
  executive: GENERATED.membershipExecutiveOffice,
  // sixty-five and over
  "ageing-in-place": GENERATED.membershipPreserve,
  // fifties
  signature: GENERATED.membershipSignature,
} as const;

/**
 * The twelve topics no longer have photographs.
 *
 * FOCUS_AREA_PHOTOS and PILLAR_PHOTOS both lived here and both are gone
 * (client, 20 Sep 2026): the home page cards, the healthspan hub and
 * each topic's own page all draw /images/pillars/<slug>.svg now. Twelve
 * photographs of twelve abstractions — "functional reserve", "early
 * detection" — were always going to be pictures of something adjacent
 * to the subject rather than of it.
 *
 * Their source JPEGs are still in public/images/gen/ and are now
 * referenced by nothing; the maps are in the git history if the
 * photographs are ever wanted back.
 */

/**
 * Photograph per running service, for the "what we already do" cards. Same
 * rule: one place to swap.
 */
export const SERVICE_PHOTOS = {
  "executive-health": GENERATED.executiveHealth,
  "ageing-in-place": GENERATED.ageingInPlace,
  "home-care": GENERATED.homeCare,
  "family-medicine": GENERATED.familyMedicine,
  nursing: GENERATED.nursing,
} as const;

/** The "What we measure" picture for each membership. */
export const ASSESSMENT_PHOTOS = {
  foundation: GENERATED.assessmentFoundation,
  executive: GENERATED.assessmentExecutive,
  "ageing-in-place": GENERATED.assessmentAgeingInPlace,
  signature: GENERATED.assessmentSignature,
} as const;

/**
 * The wide opening photograph for each of the twelve pillar pages (Jeffrey,
 * 21 Oct 2026), generated for this site (Magnific) after the clinical review.
 * The people sit in the right third so the white wash behind the words on the
 * left does not cover them. Decorative, so no alt text. The homepage cards
 * keep the client's drawings.
 */
const PILLAR_EXTENDED = new Set([
  "metabolic-resilience",
  "cardio-respiratory-health",
  "nutrition",
]);

/**
 * Where the people sit across each pillar photograph, as an object-position
 * x for the portrait card crop, so the subjects are centred in the card
 * (Jeffrey, 21 Oct 2026). Read off the photographs: the pair is in the right
 * third of each, and a single constant left some half out of frame.
 */
export const PILLAR_CARD_X: Record<string, string> = {
  "metabolic-resilience": "100%",
  "cardio-respiratory-health": "97%",
  "brain-cognitive-health": "97%",
  "early-detection": "92%",
  "hormonal-health": "98%",
  "functional-reserve": "87%",
  "nutrition": "100%",
  "sleep-recovery": "97%",
  "mood-stress-mental-health": "93%",
  "connection-purpose": "87%",
  "hearing-vision-senses": "83%",
  "medications-supplements": "97%",
};

export const PILLAR_HERO_PHOTOS: Record<string, { src: string; focal: string }> = Object.fromEntries(
  [
    "metabolic-resilience",
    "cardio-respiratory-health",
    "brain-cognitive-health",
    "early-detection",
    "hormonal-health",
    "functional-reserve",
    "nutrition",
    "sleep-recovery",
    "mood-stress-mental-health",
    "connection-purpose",
    "hearing-vision-senses",
    "medications-supplements",
  ].map((slug) => [
    slug,
    PILLAR_EXTENDED.has(slug)
      ? {
          // Extended with room above the heads (21 Oct 2026): the first
          // version had the subjects' heads touching the top edge, so any
          // crop took the tops off. Looked at from the top.
          src: `/images/gen/hero-pillar-${slug}-v2.jpg`,
          focal: "center 28%",
        }
      : { src: `/images/gen/hero-pillar-${slug}.jpg`, focal: "center 50%" },
  ]),
);
