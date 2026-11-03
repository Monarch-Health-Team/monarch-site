"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A full-bleed photograph behind a section that drifts a little slower than
 * the page scrolls. Purely decorative: it is aria-hidden, and the section
 * that uses it must carry its own legible overlay and its own copy.
 *
 * The image is 24% taller than its box and moves at most ±(strength/2) of
 * that, so the edges never show. Under prefers-reduced-motion the drift is
 * zero and it behaves as a static background — the five duration tokens
 * collapse to 0ms site-wide for the same reason.
 *
 * The drift is a passive scroll listener writing one transform, rather than
 * an animation library: framer-motion was the largest piece of the
 * homepage's startup JS (Lighthouse, PR #6) for this one effect. The
 * progress maths is the one framer's useScroll gave with offset
 * ["start end", "end start"]: 0 as the box's top meets the viewport's
 * bottom, 1 as its bottom leaves the viewport's top.
 *
 * Wrap it in a parent with `relative isolate overflow-hidden`.
 */
export function ParallaxBackground({
  src,
  focal = "center",
  strength = 0.18,
  className,
  imgClassName,
  priority = false,
}: {
  src: string;
  /** object-position, from the PHOTOS entry. */
  focal?: string;
  /** Total travel as a fraction of the image height. 0 disables. */
  strength?: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    const mover = moverRef.current;
    if (!box || !mover || strength <= 0) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    const travel = (strength * 100) / 2;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = box.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (vh + rect.height);
      const progress = Math.min(1, Math.max(0, raw));
      const y = -travel + progress * 2 * travel;
      mover.style.transform = `translate3d(0, ${y}%, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div ref={moverRef} className="absolute inset-x-0 -inset-y-[12%]">
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          className={cn("object-cover", imgClassName)}
          style={{ objectPosition: focal }}
        />
      </div>
    </div>
  );
}
