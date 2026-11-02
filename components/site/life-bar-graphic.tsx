import { LIFE_BAR_SVG } from "@/components/site/life-bar-svg";

/**
 * The life bar picture beside the lifespan and healthspan copy (client
 * request, 15 Oct 2026). Decorative: the words beside it say all of it. The
 * markup is static and ours (components/site/life-bar-svg.ts), set inline
 * rather than as an image so its two labels use the site's own type.
 */
export function LifeBarGraphic({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`${className ?? ""} [&>svg]:block [&>svg]:h-auto [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: LIFE_BAR_SVG }}
    />
  );
}
