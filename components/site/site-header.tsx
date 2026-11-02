"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { LogoLockup } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/actions";
import { PRIMARY_NAV, ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Global header v2: cream, 1px #E2D6C2 bottom rule, 24px vertical padding
 * at 1440. Nav Inter Medium 15 navy, 36px gaps; active item navy Semi Bold
 * with a 2px orange underline. Header button 40px. Mobile: logo, a 44px
 * call button and a 44px menu button. Nav targets are 44px tall (v2 P2-3).
 */
export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        // Return focus to the menu button instead of dropping it to <body>.
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12 xl:h-[96px] xl:px-[120px]">
        <Link href={ROUTES.home} className="shrink-0 rounded-md" aria-label="Monarch Health home" onClick={() => setOpen(false)}>
          <LogoLockup />
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-[36px]">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-11 items-center text-[15px] leading-[1.2] text-navy decoration-2 underline-offset-[10px] hover:underline hover:decoration-navy",
                      active ? "font-semibold underline decoration-action hover:decoration-action" : "font-medium",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-4 xl:gap-6">
          <a href={SITE.phoneHref} className="hidden min-h-11 items-center gap-2 text-[15px] font-medium text-navy hover:underline underline-offset-4 lg:inline-flex">
            <Phone aria-hidden="true" className="size-4" strokeWidth={1.75} />
            <span>{SITE.phoneDisplay}</span>
          </a>
          <div className="hidden sm:block">
            <ButtonLink href={ROUTES.book} size="header">
              Book an assessment
            </ButtonLink>
          </div>
          <a
            href={SITE.phoneHref}
            aria-label={`Call ${SITE.phoneDisplay}`}
            className="inline-flex size-11 items-center justify-center rounded-[8px] text-navy lg:hidden"
          >
            <Phone aria-hidden="true" className="size-5" strokeWidth={1.75} />
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[8px] border border-line text-navy xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Primary" hidden={!open} className="border-t border-line bg-cream xl:hidden">
        <ul className="mx-auto flex w-full max-w-[1440px] flex-col px-5 py-3 sm:px-8 lg:px-12">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-12 items-center border-b border-line py-3 text-[17px] text-navy",
                    active ? "font-semibold underline decoration-action decoration-2 underline-offset-[6px]" : "font-medium",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="flex flex-col gap-3 pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <a href={SITE.phoneHref} className="inline-flex min-h-11 items-center gap-2 text-[16px] font-medium text-navy">
              <Phone aria-hidden="true" className="size-4" strokeWidth={1.75} />
              <span>{SITE.phoneDisplay}</span>
            </a>
            <div className="sm:hidden">
              <ButtonLink href={ROUTES.book}>Book an assessment</ButtonLink>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
