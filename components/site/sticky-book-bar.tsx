"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { buttonClasses } from "@/components/ui/actions";
import { ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

/*
 * Sticky mobile action bar (v2 P1-9, Home Mobile 40:298): white, hairline
 * on top, a 48 × 48 call button and a full-width "Book an assessment".
 * Mobile only (< 768px). It appears once the page hero has scrolled away,
 * and never on the Book page itself. While hidden it is removed from the
 * accessibility tree and the tab order.
 */
export function StickyBookBar() {
  const pathname = usePathname() ?? "/";
  const [show, setShow] = useState(false);
  const onBook = pathname === ROUTES.book;

  useEffect(() => {
    if (onBook) return;
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      const onScroll = () => setShow(window.scrollY > 320);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, [onBook, pathname]);

  if (onBook) return null;

  return (
    <div
      hidden={!show}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 pt-3 pb-5 md:hidden"
      role="region"
      aria-label="Quick actions"
    >
      <div className="flex items-center gap-3">
        <a
          href={SITE.phoneHref}
          aria-label={`Call ${SITE.phoneDisplay}`}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-[8px] border-[1.25px] border-action text-action transition-[color,border-color] duration-150 hover:border-action-hover hover:text-action-hover focus-visible:transition-none"
        >
          <Phone aria-hidden="true" className="size-5" strokeWidth={1.75} />
        </a>
        <Link href={ROUTES.book} className={cn(buttonClasses("primary"), "flex-1")}>
          Book an assessment
        </Link>
      </div>
    </div>
  );
}
