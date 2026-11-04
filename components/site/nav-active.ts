/** The path part of a nav href: no #fragment, no ?query. */
export const pathOf = (href: string) => href.split("#")[0].split("?")[0] || "/";

/**
 * Is this nav href the page the reader is on, or a section containing it?
 * "/" matches only itself; "/care-programmes" also matches its sub pages.
 */
export function isCurrent(pathname: string, href: string): boolean {
  const p = pathOf(href);
  if (p === "/") return pathname === "/";
  return pathname === p || pathname.startsWith(`${p}/`);
}
