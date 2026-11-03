import Link from "@/components/site/live-link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A card that turns over on hover and follows its link on click.
 *
 * Client request, 20 Sep 2026, for both the twelve pillars and the five
 * services: the picture on the front, the words on the back, and half the
 * height the stacked version needed.
 *
 * CSS only and a server component (no client JS to hydrate for the 17 cards on the home page) — a flip needs no state,
 * only `:hover` on the link and a rotation on the plane inside it. It also
 * turns on keyboard focus, or the back would be unreachable without a
 * mouse.
 *
 * Two things this costs, both worth knowing before reaching for it again:
 *
 * 1. Tailwind's `hover:` is gated behind `@media (hover: hover)`, so on a
 *    phone or tablet the card never turns and the back is unreachable.
 *    Anything on the back is therefore desktop-only content. Whatever
 *    names the card has to carry on the front as well — see the callers,
 *    which both do this.
 * 2. Both faces are in the DOM at once. That is what keeps the back
 *    readable to a screen reader and indexable, but it means the back's
 *    heading is announced whether or not it is showing, so the front must
 *    not repeat it as real text.
 *
 * The height comes from the caller: both faces are absolutely positioned,
 * so the card has nothing of its own to be as tall as.
 */
export function FlipCard({
  href,
  front,
  back,
  className,
  axis = "y",
}: {
  /** Null names a card with no page yet: it renders, it does not link. */
  href: string | null;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  /**
   * Which way it turns. "y" is the usual sideways turn; "x" turns it end
   * over end, top to bottom, which suits a wide, short card (the Signature
   * strip, 7 Oct 2026).
   */
  axis?: "x" | "y";
}) {
  const inner = (
    <div
      className={cn(
        "relative size-full transition-transform duration-500 ease-out",
        "[transform-style:preserve-3d]",
        /*
         * The turning part answers no pointer at all (client, 21 Sep
         * 2026: "it keeps randomly flickering and spinning" along a
         * card's edge).
         *
         * :hover resolves against every descendant, and these two faces
         * are 3D-transformed: their hit regions are re-projected every
         * frame of the turn, and near an edge the pointer can fall out
         * of them mid-rotation, which drops the hover, which reverses
         * the turn, which puts the pointer back inside. That loop is
         * what chatters. Sent through to the shell instead, the hover
         * region is the shell's own static box at every frame, so the
         * boundary cannot move while the card is moving.
         *
         * Nothing inside a face is interactive - the whole card is the
         * link - so nothing is lost by it. Keep it that way: an actual
         * control on a face would need its pointer events back, and the
         * chatter with them.
         */
        "pointer-events-none",
        axis === "x"
          ? "group-hover:[transform:rotateX(180deg)] group-focus-visible:[transform:rotateX(180deg)]"
          : "group-hover:[transform:rotateY(180deg)] group-focus-visible:[transform:rotateY(180deg)]",
        // A half-second barrel roll is exactly the kind of movement the
        // setting exists to stop. The card still turns, it just arrives.
        "motion-reduce:transition-none",
      )}
    >
      <Face>{front}</Face>
      <Face back axis={axis}>
        {back}
      </Face>
    </div>
  );

  const shell = cn(
    "group block size-full rounded-2xl [perspective:60rem]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600",
    className,
  );

  return href ? (
    <Link href={href} className={shell}>
      {inner}
    </Link>
  ) : (
    <div className={shell}>{inner}</div>
  );
}

function Face({
  children,
  back = false,
  axis = "y",
}: {
  children: ReactNode;
  back?: boolean;
  axis?: "x" | "y";
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm",
        "[backface-visibility:hidden]",
        // rotateY(0) on the front too: without a transform of its own the
        // front has no 3D context and Safari paints it through the back.
        back
          ? axis === "x"
            ? "[transform:rotateX(180deg)]"
            : "[transform:rotateY(180deg)]"
          : "[transform:rotateY(0deg)]",
      )}
    >
      {children}
    </div>
  );
}
