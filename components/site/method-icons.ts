/**
 * A mark for each thing the method touches.
 *
 * Keyed by the exact piece string in content/method.ts, so a rename
 * there drops the mark rather than showing the wrong one. The drawer in
 * components/site/method-steps.tsx renders the label with or without a
 * mark, so an unmapped piece degrades to text.
 *
 * MEASURE'S TEN ARE ALREADY DRAWN. The ten modifiable drivers at
 * playbook 13.4 are the same ten things /images/doodles was drawn for,
 * one for one, in the same order. Nothing new was needed and nothing new
 * should be made for them.
 *
 * The doodles are the vocabulary for this set rather than the twelve
 * pillar drawings: at 36px the pillar art, which carries scene detail,
 * goes muddy, where a doodle is one bold object and stays legible.
 */
export const PIECE_ICONS: Record<string, string> = {
  // Measure: playbook 13.4, the ten things that can still be changed.
  "Exercise & fitness": "/images/doodles/exercise.svg",
  Nutrition: "/images/doodles/nutrition.svg",
  Sleep: "/images/doodles/sleep.svg",
  "Cardiometabolic health": "/images/doodles/cardiometabolic.svg",
  "Brain health": "/images/doodles/brain.svg",
  "Muscle, bone & balance": "/images/doodles/muscle.svg",
  "Substances & exposures": "/images/doodles/substances.svg",
  "Social connection": "/images/doodles/social.svg",
  "Preventive screening": "/images/doodles/screening.svg",
  "Home & environment": "/images/doodles/home.svg",

  /*
   * Act: the twelve clinical programmes. Three of them are the same
   * subject as something already drawn, so they share the drawing -
   * Early Detection is the screening magnifier, and Brain Health and
   * Sleep & Recovery are that brain and that moon. The other nine were
   * drawn for this set in /images/method-icons, in the doodles' idiom:
   * one bold object, navy stroke, a single orange accent.
   */
  "Executive Health": "/images/method-icons/executive-health.svg",
  "Early Detection": "/images/doodles/screening.svg",
  "Longevity Medicine": "/images/method-icons/longevity-medicine.svg",
  "Menopause & Perimenopause": "/images/method-icons/menopause.svg",
  // Keyed by the renamed piece (D12); must equal content/method.ts exactly.
  "Men's Health": "/images/method-icons/mens-health.svg",
  "Weight Optimization": "/images/method-icons/weight.svg",
  "Metabolic Health": "/images/method-icons/metabolic.svg",
  "Brain Health": "/images/doodles/brain.svg",
  "Cardiovascular Prevention": "/images/method-icons/cardiovascular.svg",
  "Frailty Prevention": "/images/method-icons/frailty.svg",
  // Keyed by the renamed piece (D18); must equal content/method.ts exactly.
  "Sleep & Recovery": "/images/doodles/sleep.svg",
  "Functional Assessments": "/images/method-icons/functional.svg",

  /*
   * Evaluate: the eight systems read again. Four of them are the same
   * subject as something already drawn and share it - the heart, the
   * flame, that brain, that bone. The other four were drawn for this
   * set. The immune mark is a cell rather than a shield, because
   * Men's Health has the shield and two shields in one method would be
   * one idea wearing two labels.
   */
  Cardiovascular: "/images/method-icons/cardiovascular.svg",
  Metabolic: "/images/method-icons/metabolic.svg",
  Brain: "/images/doodles/brain.svg",
  "Muscle & bone": "/images/doodles/muscle.svg",
  "Immune & inflammatory": "/images/method-icons/immune.svg",
  Kidney: "/images/method-icons/kidney.svg",
  Lung: "/images/method-icons/lung.svg",
  "Vision & hearing": "/images/method-icons/senses.svg",

  /*
   * Reassess: the six outcomes it all protects. Independence is a key
   * rather than a house - Measure already uses the house for Home &
   * environment, and what is being protected here is the ability to let
   * yourself in, not the building.
   */
  Independence: "/images/method-icons/independence.svg",
  Mobility: "/images/method-icons/mobility.svg",
  Cognition: "/images/doodles/brain.svg",
  "Physical performance": "/images/doodles/exercise.svg",
  Participation: "/images/doodles/social.svg",
  "Quality of life": "/images/method-icons/quality-of-life.svg",
};
