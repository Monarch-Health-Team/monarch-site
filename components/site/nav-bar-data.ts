import { PRIMARY_NAV } from "@/lib/nav";

/**
 * What the header needs from the primary nav: labels and hrefs. Built on the
 * server and passed down as a prop.
 */
export type NavBarItem = {
  label: string;
  href: string;
  /** Present when the entry opens a menu: names only. */
  children?: { label: string; href: string }[];
  /** The link after the divider ("Compare all programmes"). */
  childrenFooter?: { label: string; href: string };
  /** The phone sheet lists this entry as plain links, not a group. */
  sheetFlat?: boolean;
};

export const NAV_BAR: NavBarItem[] = PRIMARY_NAV.map((item) => ({
  label: item.label,
  href: item.href,
  children: item.children?.map((c) => ({ label: c.label, href: c.href })),
  childrenFooter: item.childrenFooter,
  sheetFlat: item.sheetFlat,
}));
