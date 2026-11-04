"use client";

import type { RefObject } from "react";
import Link from "@/components/site/live-link";
import { cn } from "@/lib/utils";
import { pathOf } from "./nav-active";
import type { NavBarItem } from "./nav-bar-data";

/**
 * The desktop Care Programmes panel: names only. The four programmes, a
 * divider, then "Compare all programmes". No descriptions, photographs,
 * numbers or badges. Rows are 48px; the arrow keys move between them
 * (the open/close and Escape handling lives in the header, on the wrapper).
 */
export default function MegaMenu({
  id,
  item,
  pathname,
  panelRef,
}: {
  id: string;
  item: NavBarItem;
  pathname: string;
  panelRef: RefObject<HTMLUListElement | null>;
}) {
  const links = [...(item.children ?? [])];
  const footer = item.childrenFooter;

  function onKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    const items = [
      ...e.currentTarget.querySelectorAll<HTMLAnchorElement>("a[href]"),
    ];
    const at = items.indexOf(document.activeElement as HTMLAnchorElement);
    let next = -1;
    if (e.key === "ArrowDown") next = (at + 1) % items.length;
    else if (e.key === "ArrowUp") next = (at <= 0 ? items.length : at) - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    if (next >= 0) {
      e.preventDefault();
      items[next]?.focus();
    }
  }

  const row = (link: { label: string; href: string }) => {
    const here = pathname === pathOf(link.href);
    return (
      <li key={link.href}>
        <Link
          href={link.href}
          aria-current={here ? "page" : undefined}
          className={cn(
            "flex min-h-12 items-center rounded-md px-4 text-base text-navy-900 hover:bg-orange-50 hover:text-orange-700",
            here &&
              "bg-orange-50 font-bold shadow-[inset_3px_0_0_var(--color-orange-600)]",
          )}
        >
          {link.label}
        </Link>
      </li>
    );
  };

  return (
    <ul
      id={id}
      ref={panelRef}
      aria-label={`${item.label} menu`}
      onKeyDown={onKeyDown}
      className="absolute top-full left-0 z-50 mt-0 w-72 rounded-b-lg border border-t-0 border-neutral-200 bg-white p-2 shadow-lg"
    >
      {links.map(row)}
      {footer && (
        <>
          <li aria-hidden="true" className="my-2 h-px bg-neutral-200" />
          {row(footer)}
        </>
      )}
    </ul>
  );
}
