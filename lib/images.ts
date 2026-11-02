/*
 * Site imagery. Source of truth: details/images/manifest.md (slot, Figma node,
 * Magnific ID, licence, alt text). Files are the manifest's `<slot>.web.jpg`
 * copies (the full-size masters are not shipped). Alt text is the manifest's,
 * verbatim. Licence: Magnific Premium+ account, commercial use, no attribution
 * required (see /workspace/monarch-new/images-licence-notes.md).
 *
 * `position` is the object-position for the cover crop. In v2 the hero
 * photos are framed beside the copy (no text over a photo); positions and
 * mirroring follow Jenny's Decision 1 and the v2 build hints.
 */
export type SiteImage = {
  src: string;
  alt: string;
  /** object-position of the cover crop (desktop, and mobile unless mobilePosition is set). */
  position?: string;
  /** object-position below 768px. */
  mobilePosition?: string;
  /** Flip horizontally (v2 Decision 1). */
  mirror?: boolean;
};

const img = (src: string, alt: string, position?: string, extra?: Pick<SiteImage, "mobilePosition" | "mirror">): SiteImage => ({
  src: `/images/${src}.web.jpg`,
  alt,
  position,
  ...extra,
});

export const IMAGES = {
  home: {
    hero: img("home/hero", "Older couple walking together along a sandy beach on a calm day.", "60% 50%"),
    intro: img("home/intro-ageing-in-place", "Older couple embracing at a sunny window at home, holding coffee mugs."),
    careAgeing: img("home/care-card-ageing-in-place", "Older woman walking confidently through her home with a cane."),
    careHome: img("home/care-card-home-care", "Caregiver and older woman preparing a healthy meal together in the kitchen."),
    careNursing: img("home/care-card-nursing", "Nurse taking an older woman's blood pressure with a digital monitor."),
    landscape: img("home/landscape-band", "Older couple standing together by the sea."),
    // v2 P1-8: the BC Legislature map-slot photo is removed (it is not the clinic); no map image in v2.
    // Journal images are not shipped: the Journal section is hidden until two real articles are live (v2 build note).
  },
  ageing: {
    // Mirrored per v2 Decision 1.
    hero: img("ageing-in-place/hero", "Older man holding a cup and looking out of a window at home.", "50% 30%", { mirror: true }),
    // Already mirrored in the source file (replaces the earlier "-flipped" note).
    strengthBalance: img("ageing-in-place/program-strength-balance", "Physiotherapist guiding an older couple through exercises at home."),
    gaitGrip: img("ageing-in-place/program-gait-grip", "Older woman doing a hand and grip exercise with a therapist."),
  },
  careAtHome: {
    // v2 Decision 1: replacement hero (Magnific 380614896) at object-position 60% 50%.
    hero: {
      src: "/images/for-families/after-hospital-discharge.web.jpg",
      alt: "Nurse helping an older man walk with a walking frame at home.",
      position: "60% 50%",
    },
    homeCare: img("care-at-home/home-care", "Caregiver helping an older man during a home visit."),
    nursing: img("care-at-home/nursing", "Caregiver assisting an older woman at home."),
  },
  howItWorks: {
    // Mirrored per v2 Decision 1.
    hero: img("how-it-works/hero", "Doctor explaining medicines to an older woman during a home visit.", "50% 30%", { mirror: true }),
    start1: img("how-it-works/getting-started-1-conversation", "Older woman smiling while using a laptop at home."),
    start2: img("how-it-works/getting-started-2-assessment-at-home", "Older couple sharing photos with a visiting doctor at home."),
    start3: img("how-it-works/getting-started-3-written-plan", "Older couple reading a document together."),
  },
  families: {
    // v2 build hint: 75% 30% desktop, 70% 30% mobile.
    hero: img("for-families/hero", "Adult daughter spending time outdoors with her older mother.", "75% 30%", { mobilePosition: "70% 30%" }),
    afterFall: img("for-families/after-a-fall", "Adult daughter caring for her older mother at home."),
    // v2 Decision 1: the former Care at Home hero (Magnific 25776933) moves to this card.
    afterDischarge: img("care-at-home/hero", "Healthcare worker reviewing test results with an older couple at home."),
    gradual: img("for-families/a-gradual-realization", "Adult daughter gently stroking her older mother's hair at breakfast."),
    caregiverSupport: img("for-families/caregiver-support", "Illustration of two family caregivers sharing tea and a supportive talk on a porch."),
  },
  about: {
    hero: img("about/hero", "Illustration of a quiet, leafy Victoria street of heritage houses with autumn maples and the ocean beyond.", "70% 60%"),
    landAck: img("about/land-acknowledgment-landscape", "A humpback whale's back and fin above the water in Sutil Channel, near Quadra Island, BC.", "50% 92%"),
  },
} as const;
