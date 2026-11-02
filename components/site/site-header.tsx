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

/** Global header (Figma 20:3): white, 1px #E2D6C2 bottom rule, 92px tall. */
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
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12 xl:h-[92px] xl:px-[120px]">
        <Link href={ROUTES.home} className="shrink-0 rounded-md" aria-label="Monarch Health home" onClick={() => setOpen(false)}>
          <LogoLockup />
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-[30px]">
            {PRIMARY_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-[15px] text-navy underline-offset-[6px] hover:underline",
                      active ? "font-semibold underline decoration-[1.5px]" : "font-medium",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-4 xl:gap-5">
          <a href={SITE.phoneHref} className="hidden items-center gap-2 text-[15px] font-medium text-navy hover:underline underline-offset-4 lg:inline-flex">
            <Phone aria-hidden="true" className="size-4" strokeWidth={1.75} />
            <span>{SITE.phoneDisplay}</span>
          </a>
          <div className="hidden sm:block">
            <ButtonLink href={ROUTES.book}>Book an assessment</ButtonLink>
          </div>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-[10px] border border-line text-navy xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Primary" hidden={!open} className="border-t border-line bg-white xl:hidden">
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
                    "block border-b border-line py-3.5 text-[17px] text-navy",
                    active ? "font-semibold underline underline-offset-[6px]" : "font-medium",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="flex flex-col gap-3 pt-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2 py-2 text-[16px] font-medium text-navy">
              <Phone aria-hidden="true" className="size-4" strokeWidth={1.75} />
              <span>{SITE.phoneDisplay}</span>
            </a>
            <div className="sm:hidden">
              <ButtonLink href={ROUTES.book} className="w-full">
                Book an assessment
              </ButtonLink>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
