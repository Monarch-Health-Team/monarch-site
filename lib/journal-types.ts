/**
 * Shared (client-safe) journal types and constants. The fs-reading
 * helpers live in `lib/journal.ts` and are marked `server-only`; this
 * module is safe to import from client components for typing + the
 * category filter chips.
 */

export const JOURNAL_CATEGORIES = [
  "Ageing Well",
  "Executive Wellness",
  "Caregiver Tips",
  "Home Safety",
  "Industry News",
] as const;

export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number];

export type JournalAuthor = {
  name: string;
  role: string;
  /** Short author bio surfaced in the article footer. */
  bio: string;
};

/**
 * Who checked the piece clinically, and when. Optional in the frontmatter so
 * older articles still build; the article header says "awaiting clinical
 * review" when it is absent rather than implying a review that never
 * happened. Part of the Research discipline (18 Sep 2026): every piece of our
 * own writing carries its author, its reviewer and its date.
 */
export type JournalReview = {
  name: string;
  role?: string;
  /** ISO date. */
  date: string;
};

export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  author: JournalAuthor;
  review?: JournalReview;
  category: JournalCategory;
  tags: string[];
  coverImage: {
    src: string;
    alt: string;
    headTop?: number;
    ratio?: number;
    /** Photo hero: which side the words sit on (the subject is on the other), and the crop focal point. */
    heroSide?: "left" | "right";
    heroFocal?: string;
  };
  /** Raw MDX source body (frontmatter stripped). */
  content: string;
  /** Pre-formatted read time like "5 min read". */
  readTime: string;
  /** Read time in minutes for downstream sorting. */
  readMinutes: number;
};
