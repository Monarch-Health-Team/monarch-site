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

/** Pages that are not built yet render as plain text, not as a dead "#" link. */
export default function Link({ href, children, className, ...rest }: Props) {
  const live =
    typeof href === "string"
      ? liveHref(href) === href
      : !href.pathname || LIVE_PATHS.has(href.pathname);
  if (!live) {
    return (
      <span className={className} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <NextLink href={href} className={className} {...rest}>
      {children}
    </NextLink>
  );
}
