import { PRIMARY_NAV } from "@/lib/nav";
import { sectionHrefs } from "./nav-active";

/**
 * What the header bar and the phone sheet need from the primary nav: labels
 * and hrefs, nothing else. lib/nav.ts pulls in the memberships, research,
 * resource and community content for the mega menu's descriptions and
 * photographs; building this on the server keeps all of that out of the
 * header's first-screen JavaScript (Lighthouse, PR #6). The mega menu, which
 * loads later, reads lib/nav.ts itself.
 */
export type NavBarItem = {
  label: string;
  href: string;
  /** Present when the entry opens a menu; the links the phone sheet lists. */
  children?: { label: string; href: string }[];
  /** Every href inside the section, for marking the page the reader is on. */
  hrefs: string[];
};

export const NAV_BAR: NavBarItem[] = PRIMARY_NAV.map((item) => ({
  label: item.label,
  href: item.href,
  children: item.children?.map((c) => ({ label: c.label, href: c.href })),
  hrefs: sectionHrefs(item),
}));
