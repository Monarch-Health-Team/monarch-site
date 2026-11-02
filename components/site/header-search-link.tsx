"use client";

import Link from "@/components/site/live-link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The search door in the header (Jeffrey, 28 Oct 2026): an orange magnifier,
 * icon only, immediately left of "Sign in". It opens /search, where the
 * results are. 44px square, so it is as easy to hit as the controls beside
 * it; orange-700 on white is 7:1, well over the 3:1 a graphic needs.
 * Always visible, including on a phone, where "Sign in" lives in the menu.
 */
export function HeaderSearchLink({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  return (
    <Link
      href="/search"
      aria-label="Search the website"
      aria-current={pathname === "/search" ? "page" : undefined}
      data-header-search
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-md transition-colors duration-brand",
        overlay
          ? "text-white hover:bg-white/20"
          : "text-orange-700 hover:bg-orange-50 hover:text-orange-800",
        pathname === "/search" && !overlay && "bg-orange-50",
      )}
    >
      <Search aria-hidden className="size-6" strokeWidth={2.25} />
    </Link>
  );
}
