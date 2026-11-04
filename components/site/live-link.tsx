import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * Home-only build (Nov 2026): only "/" exists yet. Every other internal
 * route is pointed at "#" so tabs, buttons and footer links stay visible
 * but never lead to a 404. Remove this wrapper as pages are rebuilt.
 */
export const LIVE_PATHS = new Set<string>(["/", "/our-approach", "/care-programmes",
  "/care-programmes/foundation",
  "/care-programmes/preserve",
]);

export function liveHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href; // #, http, mailto, tel
  const path = href.split(/[?#]/)[0] || "/";
  return LIVE_PATHS.has(path) ? href : "#";
}

type Props = ComponentProps<typeof NextLink>;

/**
 * Pages that are not built yet keep their label visible but render as inert
 * text (no anchor), so nothing points at "#" or a 404.
 */
export default function Link({ href, children, className, style, ...rest }: Props) {
  const path = typeof href === "string" ? href : (href.pathname ?? "/");
  const internal = path.startsWith("/") && !path.startsWith("//");
  if (internal && !LIVE_PATHS.has(path.split(/[?#]/)[0] || "/")) {
    return (
      <span className={className} style={style} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <NextLink href={href} className={className} style={style} {...rest}>
      {children}
    </NextLink>
  );
}
