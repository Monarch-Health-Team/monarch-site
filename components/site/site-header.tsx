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
 * bar, so it never relies on colour alone.
 */
function deskLinkClass(active: boolean) {
  return cn(
    "relative flex min-h-12 items-center gap-1 whitespace-nowrap rounded-md px-3 text-base transition-colors motion-reduce:transition-none",
    active
      ? "font-bold text-navy-900 after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-orange-600 after:content-['']"
      : "text-navy-900 hover:text-orange-700",
  );
}

const ctaClass =
  "inline-flex h-14 items-center justify-center gap-2 rounded-[10px] bg-orange-600 px-6 text-base font-bold whitespace-nowrap text-white transition-colors hover:bg-orange-700 motion-reduce:transition-none";

type MenuId = "care" | "about";
const MENU_DOM_ID: Record<MenuId, string> = {
  care: "care-programmes-menu",
  about: "about-menu",
};

export function SiteHeader({ nav }: { nav: NavBarItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCare, setMobileCare] = useState(false);
  const [slidIn, setSlidIn] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);

  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const careWrapRef = useRef<HTMLLIElement>(null);
  const careTriggerRef = useRef<HTMLButtonElement>(null);
  const carePanelRef = useRef<HTMLUListElement>(null);
  const aboutWrapRef = useRef<HTMLLIElement>(null);
  const aboutTriggerRef = useRef<HTMLButtonElement>(null);
  const aboutPanelRef = useRef<HTMLUListElement>(null);
  const menuRefs = {
    care: { wrap: careWrapRef, trigger: careTriggerRef, panel: carePanelRef },
    about: {
      wrap: aboutWrapRef,
      trigger: aboutTriggerRef,
      panel: aboutPanelRef,
    },
  };
  const focusFirstRef = useRef(false);

  // Close everything on navigation, by resetting during render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
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

  /* The two dropdowns (Care Programmes, About), one open at a time. They open
     on click, Enter, Space or Down Arrow (a keyboard open lands on the first
     row); close on Escape (focus back on the button), on a click elsewhere,
     and when focus leaves. */
  useEffect(() => {
    if (!openMenu) return;
    const refs = {
      care: { wrap: careWrapRef, panel: carePanelRef },
      about: { wrap: aboutWrapRef, panel: aboutPanelRef },
    }[openMenu];
    if (focusFirstRef.current) {
      focusFirstRef.current = false;
      refs.panel.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }
    function outside(e: Event) {
      if (!refs.wrap.current?.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [openMenu]);

  function onMenuKeyDown(id: MenuId, e: React.KeyboardEvent) {
    const refs = menuRefs[id];
    const open = openMenu === id;
    if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpenMenu(null);
      refs.trigger.current?.focus();
    } else if (e.key === "ArrowDown" && e.target === refs.trigger.current) {
      e.preventDefault();
      if (open) {
        refs.panel.current?.querySelector<HTMLElement>("a[href]")?.focus();
      } else {
        focusFirstRef.current = true;
        setOpenMenu(id);
      }
    }
  }

  function onMenuClick(id: MenuId, e: React.MouseEvent) {
    // detail 0: the click came from Enter or Space, so land on the first row.
    if (openMenu !== id && e.detail === 0) focusFirstRef.current = true;
    setOpenMenu((v) => (v === id ? null : id));
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
  const signInCur = currentOf(pathname, SIGN_IN_HREF);

  function sheetLink(label: string, href: string) {
    const cur = currentOf(pathname, href);
    return (
      <li key={`${label}-${href}`}>
        <Link
          href={href}
          aria-current={cur === "page" ? "page" : undefined}
          className={mobileLinkClass(cur === "page")}
        >
          {label}
          {cur === "page" && hereMark}
        </Link>
      </li>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-orange-600 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      {/* One 80px bar at every width. Below hdr (80rem) it holds only the
          logo and Menu; everything else is in the phone sheet. */}
      <div inert={mobileOpen}>
        <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center gap-4 px-6">
          <Logo
            priority
            tagline={SITE.tagline}
            width={220}
            mobileWidth={190}
            desktopFrom="hdr"
            current={pathname === "/"}
          />

          <nav aria-label="Primary" className="ml-auto max-hdr:hidden">
            <ul className="flex items-center">
              {nav.map((item) => {
                const cur = currentOf(pathname, item.href);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={cur}
                        className={deskLinkClass(Boolean(cur))}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const id: MenuId = item.sheetFlat ? "about" : "care";
                const refs = menuRefs[id];
                const open = openMenu === id;
                // About is "true" on its own page and on Contact.
                const here = item.sheetFlat
                  ? item.children.some((c) => isCurrent(pathname, c.href))
                    ? ("true" as const)
                    : undefined
                  : cur;
                return (
                  <li
                    key={item.href}
                    ref={refs.wrap}
                    onKeyDown={(e) => onMenuKeyDown(id, e)}
                    className="relative flex items-center"
                  >
                    <button
                      ref={refs.trigger}
                      type="button"
                      aria-expanded={open}
                      aria-controls={MENU_DOM_ID[id]}
                      aria-current={here}
                      onClick={(e) => onMenuClick(id, e)}
                      className={deskLinkClass(Boolean(here))}
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-4 transition-transform motion-reduce:transition-none",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                    {open && (
                      <MegaMenu
                        id={MENU_DOM_ID[id]}
                        item={item}
                        pathname={pathname}
                        panelRef={refs.panel}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href={SIGN_IN_HREF}
            aria-current={signInCur}
            className={cn(
              "relative flex min-h-12 items-center gap-2 whitespace-nowrap rounded-md px-3 text-base font-bold text-navy-900 transition-colors hover:text-orange-700 motion-reduce:transition-none max-hdr:hidden",
              signInCur &&
                "after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-orange-600 after:content-['']",
            )}
          >
            <CircleUserRound aria-hidden className="size-5" />
            Sign in
          </Link>
          <Link href={CTA_HREF} className={cn(ctaClass, "max-hdr:hidden")}>
            {CTA_LABEL}
            <ArrowRight aria-hidden className="size-5" />
          </Link>

          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="ml-auto flex min-h-12 min-w-12 items-center justify-center gap-1 rounded-md border border-navy-900 px-1.5 text-sm font-bold text-navy-900 hdr:hidden"
          >
            <Menu aria-hidden className="size-5" />
            Menu
          </button>
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
            "fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white transition-transform duration-300 ease-out motion-reduce:transition-none hdr:hidden",
            slidIn ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-20 shrink-0 items-center justify-between gap-2 border-b border-neutral-200 px-6">
            <Logo
              tagline={SITE.tagline}
              width={190}
              mobileWidth={190}
              desktopFrom="hdr"
              current={pathname === "/"}
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
              className="flex min-h-12 items-center justify-center gap-2 rounded-md text-xl font-bold text-orange-700"
            >
              <Phone aria-hidden className="size-6" />
              {CALL_LABEL}
            </a>
          </div>

          <nav aria-label="Primary mobile" className="flex-1">
            <ul>
              {nav.map((item) => {
                if (item.sheetFlat) {
                  return [
                    sheetLink(item.label, item.href),
                    ...(item.children ?? [])
                      .filter((c) => pathOf(c.href) !== pathOf(item.href))
                      .map((c) => sheetLink(c.label, c.href)),
                  ];
                }
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
              aria-current={signInCur}
              className={mobileLinkClass(Boolean(signInCur))}
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
