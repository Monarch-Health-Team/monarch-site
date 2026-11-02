"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
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
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const travel = reduce ? 0 : (strength * 100) / 2;
  const y = useTransform(scrollYProgress, [0, 1], [`${-travel}%`, `${travel}%`]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <motion.div style={{ y }} className="absolute inset-x-0 -inset-y-[12%]">
        <Image
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          className={cn("object-cover", imgClassName)}
          style={{ objectPosition: focal }}
        />
      </motion.div>
    </div>
  );
}
