import type { NavSection } from "@/lib/nav";

/** The path part of a nav href: no #fragment, no ?query. */
export const pathOf = (href: string) => href.split("#")[0].split("?")[0] || "/";

/** How well a nav href matches the current path: 0 for not at all, else the length of the match. */
function matchLength(pathname: string, href: string): number {
  const p = pathOf(href);
  if (p === "/") return pathname === "/" ? 1 : 0;
  return pathname === p || pathname.startsWith(`${p}/`) ? p.length : 0;
}

/**
 * Which entry inside a section is the page the reader is on: the one whose
 * href is the longest match for the current path, so "/healthspan/nutrition"
 * lights its own entry rather than the "all topics" entry above it.
 * Null when the reader is not on any of them.
 */
export function activeHrefIn(item: NavSection, pathname: string): string | null {
  if (!item.children) return null;
  const all: string[] = [];
  for (const c of item.children) {
    all.push(c.href);
    for (const sb of c.sub ?? []) all.push(sb.href);
  }
  for (const l of item.secondary?.links ?? []) all.push(l.href);
  let best: string | null = null;
  let bestLen = 0;
  for (const href of all) {
    const len = matchLength(pathname, href);
    if (len > bestLen) {
      best = href;
      bestLen = len;
    }
  }
  return best;
}
