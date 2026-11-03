import { Heading } from "@/components/primitives";
import { cn } from "@/lib/utils";

/**
 * The hero's two titles.
 *
 * Client request, 20 Sep 2026: one piece per word, not one block (they used
 * to dissolve in word by word; see below for why they no longer do).
 * Headline changed 4 Oct 2026 by Jeffrey
 * to "Continuous Care for Life", with "Continuous" highlighted in navy (it
 * was "Your healthspan, managed." — Dr. Sundren's D1 wording, superseded).
 * Changed again 25 Oct 2026 by JJ: the h1 is now "Your healthspan journey
 * starts here", in navy with "healthspan" in orange, and "Continuous Care
 * for Life" stays, in black, as the second title directly beneath it.
 * Hero Option A (Nicole's mockup, 25 Oct 2026): both titles sit on the
 * left, the second line is set in sentence case, "Continuous care for life"
 * (JJ and Mia), at regular weight, 12px under the h1.
 * Hero tweak 2 (JJ, 25 Oct 2026): the second line moves down to sit with
 * the paragraph, 12px above it, and clear of the h1: 32px under it, 40px
 * from lg.
 *
 * No JavaScript and no entrance animation. The words are in the server
 * HTML at full opacity and paint with the first frame. The dissolve this
 * used to run (a CSS keyframe holding each word at opacity 0 for up to
 * 1.5s, and a framer version before it) kept the headline off the screen
 * during the Lighthouse LCP window (PR #6 QA failure, LCP 4.4s). An
 * entrance animation must not be the thing that makes the headline visible.
 */
const TITLE = [
  { text: "Your", className: "text-navy-900" },
  { text: "healthspan", className: "text-orange-700" },
  { text: "journey", className: "text-navy-900" },
  { text: "starts", className: "text-navy-900" },
  { text: "here", className: "text-navy-900" },
];

/** Ink (neutral-950), sentence case (JJ and Mia, 25 Oct 2026). */
const SECOND = [
  { text: "Continuous" },
  { text: "care" },
  { text: "for" },
  { text: "life" },
];

function Pieces({
  pieces,
}: {
  pieces: { text: string; className?: string }[];
}) {
  return pieces.map((piece, i) => (
    <span key={piece.text}>
      {/* A real space between the pieces, and one the line can still
          break at — inline-blocks butted together would run as a single
          unbreakable word. */}
      {i > 0 && " "}
      <span className={piece.className}>{piece.text}</span>
    </span>
  ));
}

export function HeroTitle({
  id,
  className,
  wrapperClassName,
}: {
  id?: string;
  /** On the h1: its measure. */
  className?: string;
  /** On the block holding both titles. */
  wrapperClassName?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start text-left", wrapperClassName)}>
      {/* Sizes set here rather than by the display token so the line
          lengths follow the mockup: 38/42 on a phone (40/44 until tweak 2,
          so "Your healthspan" still fits one line in the narrower phone
          block and the hero stays in the first screen at 375x667), 48/56
          from sm, 64/68 from lg. Weight and tracking restated because the arbitrary size
          replaces the token that carried them. */}
      <Heading
        as="h1"
        id={id}
        size="display-xl"
        className={cn(
          "text-[2.375rem]/[2.625rem] font-bold tracking-[-0.025em] text-balance sm:text-[3rem]/[3.5rem] lg:text-[4rem]/[4.25rem]",
          className,
        )}
      >
        <Pieces pieces={TITLE} />
      </Heading>
      {/* Clear of the h1 (32px, 40px from lg) and grouped with the
          paragraph, which sits 12px under it (tweak 2, JJ). */}
      <p className="mt-8 lg:mt-10 text-[1.5rem]/[2rem] font-normal text-balance text-neutral-950 lg:text-[1.875rem]/[2.375rem]">
        <Pieces pieces={SECOND} />
      </p>
    </div>
  );
}
