import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to be told about the brand type scale.
 *
 * Out of the box it only knows Tailwind's default `text-*` sizes. Our scale
 * comes from the brand book — `text-heading-1`, `text-body-lg`, `text-label-mono`
 * and so on — and tailwind-merge cannot tell those from text COLOUR utilities,
 * which share the `text-` prefix. Left unconfigured it treats them as the same
 * group and keeps only the last one, so `cn("text-heading-1", "text-navy-900")`
 * silently drops the size and the heading renders at body size.
 *
 * Registering the scale as font-size classes keeps size and colour in separate
 * groups, which is what lets a component set both.
 */
const FONT_SIZES = [
  "display-2xl",
  "display-xl",
  "display-lg",
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "label-mono",
  "body-lg",
  "body-sm",
  "body",
  "label-sm",
  "label",
  "caption",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
