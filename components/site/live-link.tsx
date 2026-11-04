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

/** Pages that are not built yet keep a visible link, pointed at "#". */
export default function Link({ href, children, className, ...rest }: Props) {
  const target =
    typeof href === "string"
      ? liveHref(href)
      : !href.pathname || LIVE_PATHS.has(href.pathname)
        ? href
        : "#";
  return (
    <NextLink href={target} className={className} {...rest}>
      {children}
    </NextLink>
  );
}
