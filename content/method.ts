/**
 * The four steps of the method, and what each one actually touches.
 *
 * Source: Monarch Health Corporate Playbook v1.2 — Part VI ("The Monarch
 * Healthspan Model") and Part II ("Clinical Programs"). The four public
 * steps are the member-facing view of the clinical loop at §13.8, whose
 * seven internal steps (assess, interpret, prioritize, intervene, monitor,
 * adapt, predict) collapse into these four for anyone outside the clinic.
 * Each step's list is the part of the model that step works on:
 *
 *   Measure   §13.4 — the ten modifiable health drivers, the part of the
 *             picture that can actually be changed
 *   Act       Part II — the twelve clinical programs, which is what acting
 *             is done with
 *   Evaluate  §13.5 — the eight biological systems, re-read on a cadence,
 *             which is where a change either shows or does not
 *   Reassess  §13.7 — the six outcomes the whole thing exists to protect,
 *             and the ones whose priority moves with life stage
 *
 * TWO RULES APPLIED THROUGHOUT.
 *
 * Nothing gated appears. §13.12 holds the scores, the reserve and
 * resilience measures, attributed-years figures and forward projections
 * behind clinical validation and named sign-off. So this names what is
 * looked at and never what any of it scores — "Cardiovascular" is a system
 * someone reads, not a number shown to a member.
 *
 * No internal vocabulary (R3.6). The playbook's layer numbering, its
 * engine naming and its scoring terms stay inside the playbook; these are
 * the member-facing names for the same things.
 */

export interface MethodStepContent {
  word: string;
  /** What the home page tile shows instead of `word`, when they differ. */
  label?: string;
  /** The step in one line. */
  line: string;
  /** Heading for the list, so a cloud of words says what it is a list of. */
  pieceLabel: string;
  /**
   * The same list in three or four words, for the one number the home
   * page shows per step. Phrased to sit after a numeral: "10 things that
   * can be changed". The count is always `pieces.length`, never written
   * out, so the two cannot drift.
   */
  countLabel: string;
  pieces: string[];
}

export const METHOD_STEPS: MethodStepContent[] = [
  {
    word: "Measure",
    line: "Establish your baseline.",
    pieceLabel: "What is measured",
    countLabel: "things that can be changed",
    pieces: [
      "Exercise & fitness",
      "Nutrition",
      "Sleep",
      "Cardiometabolic health",
      "Brain health",
      "Muscle, bone & balance",
      "Substances & exposures",
      "Social connection",
      "Preventive screening",
      "Home & environment",
    ],
  },
  {
    word: "Act",
    line: "Turn findings into priorities.",
    pieceLabel: "What we act with",
    countLabel: "programs to act with",
    pieces: [
      "Executive Health",
      "Early Detection",
      "Longevity Medicine",
      "Menopause & Perimenopause",
      // Approved wording, Dr. Sundren 27 Sep 2026: D12.
      "Men's Health",
      "Weight Optimization",
      "Metabolic Health",
      "Brain Health",
      "Cardiovascular Prevention",
      "Frailty Prevention",
      // Approved wording, Dr. Sundren 27 Sep 2026: D18.
      "Sleep & Recovery",
      "Functional Assessments",
    ],
  },
  {
    // Approved wording, Dr. Sundren 27 Sep 2026: D43.
    word: "Evaluate",
    // Home-page tile only (Jeffrey, 7 Oct 2026). `word` stays "Evaluate": it
    // names the icon file and the /method page.
    label: "Review",
    // Held: D24 (C5, Q22).
    line: "Check whether the plan is working.",
    pieceLabel: "Where a change shows",
    countLabel: "systems, read again",
    pieces: [
      "Cardiovascular",
      "Metabolic",
      "Brain",
      "Muscle & bone",
      "Immune & inflammatory",
      "Kidney",
      "Lung",
      "Vision & hearing",
    ],
  },
  {
    word: "Reassess",
    line: "Adapt as you change.",
    pieceLabel: "What it is all measured against",
    countLabel: "outcomes it protects",
    pieces: [
      "Independence",
      "Mobility",
      "Cognition",
      "Physical performance",
      "Participation",
      "Quality of life",
    ],
  },
];
