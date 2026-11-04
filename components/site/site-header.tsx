"use client";

import { useState, useEffect, useRef } from "react";
import Link from "@/components/site/live-link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  CircleUserRound,
  Menu,
  Phone,
  X,
} from "lucide-react";
import type { NavBarItem } from "./nav-bar-data";
import MegaMenu from "./mega-menu";
import { Logo } from "./logo";
import { isCurrent, pathOf } from "./nav-active";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

/* Not imported from lib/nav: that file pulls the memberships content into the
   header's JavaScript. These two are the same values as lib/nav's CTA_LINK and
   SIGN_IN_HREF. */
const CTA_LABEL = "Arrange a Conversation";
const CTA_HREF = "/contact";
const SIGN_IN_HREF = "/sign-in";
const CALL_LABEL = `Call ${SITE.phone}`;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** "page" on the page itself, "true" on a section that contains it. */
function currentOf(pathname: string, href: string) {
  if (pathname === pathOf(href)) return "page" as const;
  return isCurrent(pathname, href) ? ("true" as const) : undefined;
}

/**
 * One style for every desktop link. Current is bold navy plus a 3px orange
 * bar, so it never relies on colour alone. On the navy-50 row the quiet links
 * are orange-700 (7:1), not orange-600 (4.16:1 on that band).
 */
function deskLinkClass(active: boolean, band: "navy" | "white") {
  return cn(
    "relative flex min-h-12 items-center gap-1 whitespace-nowrap rounded-md px-3 transition-colors motion-reduce:transition-none",
    active
      ? "font-bold text-navy-900 after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-orange-600 after:content-['']"
      : band === "navy"
        ? "text-orange-700 hover:text-orange-800 hover:underline"
        : "text-navy-900 hover:text-orange-700",
  );
}

const ctaClass =
  "inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-orange-600 px-6 text-base font-bold whitespace-nowrap text-white transition-colors hover:bg-orange-700 motion-reduce:transition-none";

export function SiteHeader({ nav }: { nav: NavBarItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCare, setMobileCare] = useState(false);
  const [slidIn, setSlidIn] = useState(false);
  const [careOpen, setCareOpen] = useState(false);

  const utility = nav.filter((i) => i.row === "utility");
  const main = nav.filter((i) => i.row === "main");

  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const careWrapRef = useRef<HTMLLIElement>(null);
  const careTriggerRef = useRef<HTMLButtonElement>(null);
  const carePanelRef = useRef<HTMLUListElement>(null);
  const focusFirstRef = useRef(false);

  // Close everything on navigation, by resetting during render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setCareOpen(false);
  }

  /* The phone menu is a modal surface. Focus moves into it when it opens and
     back to the Menu button when it closes; Tab cycles inside it; Escape
     closes it. The page behind cannot scroll. */
  const wasOpen = useRef(false);
  useEffect(() => {
    if (mobileOpen) closeRef.current?.focus();
    else if (wasOpen.current) menuTriggerRef.current?.focus();
    wasOpen.current = mobileOpen;
    const id = window.requestAnimationFrame(() => setSlidIn(mobileOpen));
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      window.cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = [
        ...(sheetRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter((el) => el.getClientRects().length > 0);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const at = document.activeElement;
      const inside = sheetRef.current?.contains(at);
      if (!inside || (e.shiftKey && at === first)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (!e.shiftKey && at === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  /* Care Programmes panel: opens on click, Enter, Space or Down Arrow (Down
     also lands on the first row); closes on Escape (focus back on the
     button), on a click elsewhere, and when focus leaves it. */
  useEffect(() => {
    if (!careOpen) return;
    if (focusFirstRef.current) {
      focusFirstRef.current = false;
      carePanelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }
    function outside(e: Event) {
      if (!careWrapRef.current?.contains(e.target as Node)) setCareOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [careOpen]);

  function onCareKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && careOpen) {
      e.preventDefault();
      setCareOpen(false);
      careTriggerRef.current?.focus();
    } else if (
      e.key === "ArrowDown" &&
      e.target === careTriggerRef.current
    ) {
      e.preventDefault();
      if (careOpen) {
        carePanelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
      } else {
        focusFirstRef.current = true;
        setCareOpen(true);
      }
    }
  }

  const mobileLinkClass = (current: boolean) =>
    cn(
      "flex min-h-14 w-full items-center gap-3 px-5 text-left text-xl text-navy-900 hover:bg-orange-50",
      current &&
        "border-l-4 border-orange-600 bg-orange-50 pl-4 font-bold hover:bg-orange-50",
    );
  const hereMark = (
    <span aria-hidden className="ml-auto text-sm font-bold text-orange-700">
      You are here
    </span>
  );

  return (
    <header className="sticky top-0 z-50 bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-orange-600 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      {/* ------------------------------------------------ desktop, from xl */}
      <div className="hidden bg-navy-50 xl:block">
        <div className="container-page flex h-12 items-center justify-between text-[18px]">
          <a
            href={SITE.phoneHref}
            className="flex min-h-12 items-center gap-2 rounded-md font-semibold text-orange-700 hover:text-orange-800 hover:underline"
          >
            <Phone aria-hidden className="size-5" />
            {CALL_LABEL}
          </a>
          <nav aria-label="Secondary" className="flex items-center">
            <ul className="flex items-center">
              {utility.map((item) => {
                const cur = currentOf(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={cur}
                      className={deskLinkClass(Boolean(cur), "navy")}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li aria-hidden className="mx-2 h-6 w-px bg-navy-200" />
              <li>
                <Link
                  href={SIGN_IN_HREF}
                  aria-current={currentOf(pathname, SIGN_IN_HREF)}
                  className={cn(
                    deskLinkClass(
                      Boolean(currentOf(pathname, SIGN_IN_HREF)),
                      "navy",
                    ),
                    "gap-2 font-semibold",
                  )}
                >
                  <CircleUserRound aria-hidden className="size-5" />
                  Sign in
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="hidden h-[88px] border-b border-neutral-200 bg-white xl:block">
        <div className="container-page flex h-full items-center justify-between gap-4">
          <Logo
            priority
            tagline={SITE.tagline}
            width={240}
            mobileWidth={190}
            desktopFrom="xl"
          />
          <div className="flex h-full items-center gap-1">
            <nav aria-label="Primary" className="h-full">
              <ul className="flex h-full items-center">
                {main.map((item) => {
                  const cur = currentOf(pathname, item.href);
                  if (!item.children) {
                    return (
                      <li key={item.href} className="flex h-full items-center">
                        <Link
                          href={item.href}
                          aria-current={cur}
                          className={cn(
                            deskLinkClass(Boolean(cur), "white"),
                            "text-base",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li
                      key={item.href}
                      ref={careWrapRef}
                      onKeyDown={onCareKeyDown}
                      className="relative flex h-full items-center"
                    >
                      <button
                        ref={careTriggerRef}
                        type="button"
                        aria-expanded={careOpen}
                        aria-controls="care-programmes-menu"
                        aria-current={cur}
                        onClick={() => setCareOpen((v) => !v)}
                        className={cn(
                          deskLinkClass(Boolean(cur), "white"),
                          "text-base",
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "size-4 transition-transform motion-reduce:transition-none",
                            careOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {careOpen && (
                        <MegaMenu
                          id="care-programmes-menu"
                          item={item}
                          pathname={pathname}
                          panelRef={carePanelRef}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
            <Link href={CTA_HREF} className={cn(ctaClass, "ml-2")}>
              {CTA_LABEL}
              <ArrowRight aria-hidden className="size-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ below xl */}
      <div className="xl:hidden" inert={mobileOpen}>
        <div className="border-b border-neutral-200">
          <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between gap-1 px-4 sm:px-8">
            <Logo
              priority
              tagline={SITE.tagline}
              width={240}
              mobileWidth={190}
              desktopFrom="xl"
            />
            <div className="flex items-center gap-1">
              <a
                href={SITE.phoneHref}
                aria-label={CALL_LABEL}
                className="flex min-h-12 min-w-12 items-center justify-center gap-1 rounded-md px-1.5 text-sm font-bold text-orange-700 max-[379px]:hidden"
              >
                <Phone aria-hidden className="size-5" />
                Call
              </a>
              <button
                ref={menuTriggerRef}
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                className="flex min-h-12 min-w-12 items-center justify-center gap-1 rounded-md border border-navy-900 px-1.5 text-sm font-bold text-navy-900"
              >
                <Menu aria-hidden className="size-5" />
                Menu
              </button>
            </div>
          </div>
        </div>
        <div className="bg-navy-50">
          <div className="mx-auto flex h-12 w-full max-w-[1280px] items-center justify-end px-4 sm:px-8">
            <a
              href={SITE.phoneHref}
              aria-label={CALL_LABEL}
              className="mr-auto flex min-h-12 min-w-12 items-center gap-1 rounded-md px-1.5 text-base font-bold text-orange-700 min-[380px]:hidden"
            >
              <Phone aria-hidden className="size-5" />
              Call
            </a>
            <Link
              href={SIGN_IN_HREF}
              aria-current={currentOf(pathname, SIGN_IN_HREF)}
              className="flex min-h-12 items-center gap-2 rounded-md px-1.5 text-base font-bold text-orange-700"
            >
              <CircleUserRound aria-hidden className="size-5" />
              Sign in
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1280px] border-b border-neutral-200 px-4 py-3 sm:px-8">
          <Link href={CTA_HREF} className={cn(ctaClass, "w-full")}>
            {CTA_LABEL}
            <ArrowRight aria-hidden className="size-5" />
          </Link>
        </div>
      </div>

      {/* The full-screen menu, in from the right. */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={cn(
            "fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white transition-transform duration-300 ease-out motion-reduce:transition-none xl:hidden",
            slidIn ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-[72px] shrink-0 items-center justify-between gap-2 border-b border-neutral-200 px-4 sm:px-8">
            <Logo
              tagline={SITE.tagline}
              width={190}
              mobileWidth={190}
              desktopFrom="xl"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-12 min-w-12 items-center justify-center gap-1 rounded-md border border-navy-900 px-2 text-sm font-bold text-navy-900"
            >
              <X aria-hidden className="size-5" />
              Close
            </button>
          </div>

          <div className="space-y-3 px-5 pt-5 pb-3">
            <Link href={CTA_HREF} className={cn(ctaClass, "w-full")}>
              {CTA_LABEL}
              <ArrowRight aria-hidden className="size-5" />
            </Link>
            <a
              href={SITE.phoneHref}
              className="flex min-h-14 items-center justify-center gap-2 rounded-md text-xl font-bold text-orange-700"
            >
              <Phone aria-hidden className="size-6" />
              {CALL_LABEL}
            </a>
          </div>

          <nav aria-label="Primary mobile" className="flex-1">
            <ul>
              {nav.map((item) => {
                const cur = currentOf(pathname, item.href);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={cur}
                        className={mobileLinkClass(Boolean(cur))}
                      >
                        {item.label}
                        {cur === "page" && hereMark}
                      </Link>
                    </li>
                  );
                }
                const subs = [
                  ...item.children,
                  ...(item.childrenFooter ? [item.childrenFooter] : []),
                ];
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      aria-expanded={mobileCare}
                      aria-controls="mobile-care-programmes"
                      aria-current={cur}
                      onClick={() => setMobileCare((v) => !v)}
                      className={mobileLinkClass(Boolean(cur))}
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "ml-auto size-5 transition-transform motion-reduce:transition-none",
                          mobileCare && "rotate-180",
                        )}
                      />
                    </button>
                    {mobileCare && (
                      <ul id="mobile-care-programmes" className="bg-navy-50">
                        {subs.map((sub) => {
                          const here = pathname === pathOf(sub.href);
                          return (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                aria-current={here ? "page" : undefined}
                                className={cn(
                                  mobileLinkClass(here),
                                  "pl-9 text-xl",
                                  here && "pl-8",
                                )}
                              >
                                {sub.label}
                                {here && hereMark}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 border-t border-neutral-200 py-2">
            <Link
              href={SIGN_IN_HREF}
              aria-current={currentOf(pathname, SIGN_IN_HREF)}
              className={mobileLinkClass(false)}
            >
              <CircleUserRound aria-hidden className="size-6" />
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
