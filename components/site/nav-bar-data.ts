import { PRIMARY_NAV } from "@/lib/nav";

/**
 * What the header needs from the primary nav: labels, hrefs and which desktop
 * row each entry sits in. Built on the server and passed down as a prop.
 */
export type NavBarItem = {
  label: string;
  href: string;
  row: "utility" | "main";
  /** Present when the entry opens a menu: names only. */
  children?: { label: string; href: string }[];
  /** The link after the divider ("Compare all programmes"). */
  childrenFooter?: { label: string; href: string };
};

export const NAV_BAR: NavBarItem[] = PRIMARY_NAV.map((item) => ({
  label: item.label,
  href: item.href,
  row: item.row,
  children: item.children?.map((c) => ({ label: c.label, href: c.href })),
  childrenFooter: item.childrenFooter,
}));
