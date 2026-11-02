"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "@/components/site/live-link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { PRIMARY_NAV, type NavSection } from "@/lib/nav";
import { Logo } from "./logo";
import { activeHrefIn, pathOf } from "./nav-active";
import { HeaderSearchLink } from "./header-search-link";
import { cn } from "@/lib/utils";
import { SOFT_LAUNCH_ON } from "@/lib/soft-launch";

/* The mega menu is only ever needed after the reader reaches for a trigger,
   so it is its own chunk, fetched shortly after load (see below) or on
   the first pointer or focus near the bar. ssr: false because it is never
   open in the server HTML. */
const loadMegaMenu = () => import("./mega-menu");
const MegaMenu = dynamic(loadMegaMenu, { ssr: false });

/**
 * One style for every primary link, so the bar reads as a single row rather
 * than five separately tuned items. Active is bold orange; the rest are quiet
 * and go orange on hover. `overlay` swaps the palette for the transparent bar
 * over the hero.
 */
function navLinkClass(active: boolean, overlay: boolean) {
  return cn(
    "flex target-min items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-label transition-colors duration-brand",
    active
      ? overlay
        ? "font-bold text-orange-400"
        : "font-bold text-orange-700"
      : overlay
        ? "text-white hover:text-orange-400"
        : "text-neutral-700 hover:text-orange-700",
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  /*
   * One header everywhere: the light glass bar, over the hero as much as
   * over the rest of the site (client request, 18 Sep 2026). The bar used
   * to be transparent with white copy on the first screen of the home page
   * and turn solid on scroll. That navy-glass variant is still wired through
   * `overlay` so it can be turned back on; today it is never true.
   */
  const isHome = pathname === "/";
  const overlay: boolean = false;
  const openItem = PRIMARY_NAV.find((i) => i.label === openMenu && i.children);

  /*
   * Moving from one menu to the next: the panel stays mounted, its height
   * eases to the new content, and the outgoing section dissolves over the
   * incoming one. `prevItem` is the section on its way out, kept for the
   * length of the fade.
   */
  const [prevItem, setPrevItem] = useState<NavSection | null>(null);
  const lastOpenRef = useRef<NavSection | null>(null);
  useEffect(() => {
    const last = lastOpenRef.current;
    lastOpenRef.current = openItem ?? null;
    if (openItem && last && last !== openItem) {
      setPrevItem(last);
      const t = window.setTimeout(() => setPrevItem(null), 400);
      return () => window.clearTimeout(t);
    }
    if (!openItem) setPrevItem(null);
  }, [openItem]);
  const contentRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  // Fetch the menu chunk once the page has settled, so the first open is
  // instant but nothing competes with the first screen.
  useEffect(() => {
    const id = window.setTimeout(() => void loadMegaMenu(), 1500);
    return () => window.clearTimeout(id);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Escape closes whichever surface is open, and returns focus to its trigger
  // rather than dropping it to the document (TC-3.9).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (mobileOpen) {
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
      }
      setOpenMenu(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Dismiss the desktop mega-menu when focus leaves the header entirely.
  // The panel sits outside the <nav>, so the test has to be the header, or
  // tabbing into the panel would close it (found by the 10 Sep audit).
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onFocusIn(e: FocusEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, []);

  /**
   * Keyboard path into the panel. Tab goes from an open trigger into its
   * panel (onHeaderKeyDown, below); ArrowDown (or Enter on an already-open
   * trigger) also jumps to the first link in the panel. Escape inside the
   * panel closes it and returns focus to the trigger that opened it.
   */
  const triggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  function onTriggerKeyDown(e: React.KeyboardEvent, label: string) {
    /* The menu opens on Down Arrow or Space, or Enter once it is open (by
       the pointer): focus alone no longer opens it, so tabbing along the bar
       is five stops, not five stops plus every link in every menu. Enter on
       a closed trigger follows its link to the section page. */
    if (
      e.key === "ArrowDown" ||
      e.key === " " ||
      (e.key === "Enter" && openMenu === label)
    ) {
      e.preventDefault();
      setOpenMenu(label);
      window.requestAnimationFrame(() => {
        panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      });
    }
  }
  /**
   * Tab order for the desktop menus (WAI-ARIA disclosure navigation). The
   * panel sits after the whole bar in the DOM, so left to the browser its
   * links would come after "Sign in" rather than after their own trigger.
   * While a panel is open, Tab and Shift+Tab walk the bar with that panel's
   * links spliced in straight after its trigger, and Tab from the last link
   * goes on to the next control in the bar. Read from the DOM, not from
   * state, so a key pressed before a re-render still sees the menu that is
   * open.
   */
  function onHeaderKeyDown(e: React.KeyboardEvent) {
    onMobileTab(e);
    if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) return;
    const header = headerRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;
    const trigger = navRef.current?.querySelector<HTMLElement>(
      '[data-menu-trigger][aria-expanded="true"]',
    );
    if (!header || !panel || !content || !trigger) return;
    const tabbable = [
      ...header.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((el) => !el.closest("[inert]") && el.getClientRects().length > 0);
    const links = tabbable.filter((el) => content.contains(el));
    if (links.length === 0) return;
    const bar = tabbable.filter((el) => !panel.contains(el));
    const at = bar.indexOf(trigger);
    if (at === -1) return;
    const order = [...bar.slice(0, at + 1), ...links, ...bar.slice(at + 1)];
    const i = order.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    const next = order[i + (e.shiftKey ? -1 : 1)];
    if (next) {
      e.preventDefault();
      next.focus();
    } else if (!e.shiftKey) {
      // Leaving the header forwards: the browser's own Tab would go into
      // the panel next, so take it out of the order. The focus moving out
      // then closes the menu (onFocusIn above), which unmounts the panel;
      // the reset only matters if focus left for the browser's own UI.
      panel.inert = true;
      window.setTimeout(() => {
        panel.inert = false;
      });
    }
  }
  function onPanelKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && openMenu) {
      e.stopPropagation();
      const trigger = triggerRefs.current[openMenu];
      setOpenMenu(null);
      trigger?.focus();
    }
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // The sheet must end at the viewport bottom, wherever the bar sits. Its
  // class caps it at 100dvh minus a nominal bar height, which assumes the bar
  // is at the top of the window; at scroll 0 with the soft-launch banner
  // above the sticky bar (docs/changes/soft-launch-switch) that left the last
  // items cut off, and from `sm` the real bar is already taller than the
  // nominal one. So the sheet's own measured top is used, set before paint;
  // the page cannot scroll while it is open, and a resize re-measures.
  const mobileNavRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const sheet = mobileNavRef.current;
    if (!mobileOpen || !sheet) return;
    const fit = () => {
      const top = Math.max(0, sheet.getBoundingClientRect().top);
      sheet.style.maxHeight = `calc(100dvh - ${top}px)`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [mobileOpen]);

  /* The mobile sheet is a modal surface: focus moves into it when it opens
     and Tab cycles within it and its button (TC-3.9 says focus is trapped).
     Escape, above, closes it and returns focus to the button. */
  useEffect(() => {
    if (!mobileOpen) return;
    const t = window.setTimeout(() => {
      /* The first section link, not the sign-in control above it: that one
         is redrawn once the session loads, which would drop focus. */
      mobileNavRef.current?.querySelector<HTMLElement>("ul a[href]")?.focus();
    }, 30);
    return () => window.clearTimeout(t);
  }, [mobileOpen]);
  function onMobileTab(e: React.KeyboardEvent) {
    if (!mobileOpen || e.key !== "Tab") return;
    const sheet = mobileNavRef.current;
    const trigger = mobileTriggerRef.current;
    if (!sheet || !trigger) return;
    const items = [
      trigger,
      ...sheet.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ];
    const first = items[0];
    const last = items[items.length - 1];
    const at = document.activeElement;
    if (e.shiftKey && at === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && at === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  /* A section is selected when the reader is on its own page or on any page
     listed in its menu, so a sub page keeps its parent selected too. */
  const isSectionActive = (item: NavSection) =>
    isActive(item.href) || activeHrefIn(item, pathname) !== null;

  return (
    <header
      ref={headerRef}
      data-overlay={overlay}
      onMouseLeave={() => setOpenMenu(null)}
      onKeyDown={onHeaderKeyDown}
      className={cn(
        "top-0 z-50 transition-[background-color,border-color,box-shadow] duration-media ease-in-out",
        // Fixed on the home page so the hero runs to the top of the viewport
        // and the header floats over it; in normal flow everywhere else.
        // Always visible: the bar used to auto-hide on scroll and idle, and
        // the client asked for it to stay put (18 Sep 2026). While the
        // soft-launch banner is on, the home bar is sticky too, so the banner
        // sits above it; the hero pulls up under it by --header-h.
        isHome && !SOFT_LAUNCH_ON ? "fixed inset-x-0" : "sticky",
        // Lifts the nav off the video without a scrim behind it. Scoped so
        // it never reaches a dropdown or the mobile sheet — see the
        // [text-shadow:none] resets on those panels.
        overlay &&
          "[text-shadow:0_1px_2px_rgb(0_0_0/0.85),0_2px_10px_rgb(0_0_0/0.6)]",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-orange-600 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <p id="nav-menu-hint" className="sr-only">
        Press Down Arrow or Space to open this section&apos;s menu. Enter goes
        to the section page.
      </p>

      {/* The bar. It owns the background so the mega menu can slide out
          from behind it. Tight vertical padding: the lockup's own artwork
          carries the breathing room, and the client asked for a bar 40px
          shorter than the 111px it had (18 Sep 2026). */}
      <div
        className={cn(
          "relative z-10 transition-colors duration-brand",
          overlay
            ? // Fully transparent: the landing view belongs to the video. The
              // header turns solid white on scroll, which is where the reliable
              // contrast comes from.
              "border-b border-transparent bg-transparent"
            : // Solid white with a hairline rule (client request, 18 Sep
              // 2026, after trying the bar as glass).
              "border-b border-neutral-200 bg-white",
        )}
      >
        <div className="container-page flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-1.5">
          <Logo
            priority
            variant={overlay ? "reversed" : "primary"}
            className="md:!py-0"
            tagline="Professional Healthspan Management"
          />

          {/* Everything but the logo sits on the right as one group (client
            request, 18 Sep 2026): the tabs, then the text-size control, then
            the menu button on narrow screens. */}
          <div className="flex min-w-0 items-center gap-4">
            <nav
              ref={navRef}
              aria-label="Primary"
              className="hidden min-w-0 xl:flex xl:flex-wrap xl:items-center xl:gap-1"
            >
              {PRIMARY_NAV.map((item) =>
                item.children ? (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.label)}
                  >
                    <Link
                      href={item.href}
                      ref={(el) => {
                        triggerRefs.current[item.label] = el;
                      }}
                      aria-expanded={openMenu === item.label}
                      data-menu-trigger=""
                      aria-describedby="nav-menu-hint"
                      onKeyDown={(e) => onTriggerKeyDown(e, item.label)}
                      aria-current={
                        isSectionActive(item)
                          ? pathname === pathOf(item.href)
                            ? "page"
                            : "true"
                          : undefined
                      }
                      className={navLinkClass(isSectionActive(item), overlay)}
                    >
                      {item.label}
                      <ChevronDown aria-hidden className="size-4" />
                    </Link>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={navLinkClass(isActive(item.href), overlay)}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex min-w-0 items-center gap-3">
              {/* The text-size control was removed from the bar on 19 Sep 2026
              at the client's request. The type scale is relative, so the
              reader's own browser or system text size still applies, and
              /accessibility says so rather than promising a control. The
              component is kept in components/site/font-size-control.tsx,
              unmounted, in case it is wanted back. */}
              {/* The door for existing members (back by client request, 18 Sep
              2026). Drawn like the text-size control beside it — same height,
              same hairline — so the right of the bar is one set of quiet
              controls. 46px, not 44: the control is 44px buttons inside a 1px
              border, and the two must sit flush. Free tier (26 Sep 2026):
              "Sign in", or "Your account" and "Sign out" when signed in
              ("Your account" alone from xl, design 12.5), or nothing while
              the free tier is off. */}
              {/* Search (Jeffrey, 28 Oct 2026): the orange icon, left of Sign in. */}
              <HeaderSearchLink overlay={overlay} />
              <button
                ref={mobileTriggerRef}
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                className={cn(
                  "flex size-11 items-center justify-center rounded-md border xl:hidden",
                  overlay
                    ? "border-white/50 text-white"
                    : "border-neutral-600 text-navy-900",
                )}
              >
                {mobileOpen ? (
                  <X aria-hidden className="size-5" />
                ) : (
                  <Menu aria-hidden className="size-5" />
                )}
                <span className="sr-only">
                  {mobileOpen ? "Close menu" : "Open menu"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mega menu: the width of the bar's content, sliding down from behind
          it so the two edges meet. A quarter is a photograph for the section,
          three quarters the list in two columns. Its own chunk, fetched when
          the browser is idle or the pointer first nears a trigger; nothing
          here is needed for the first screen. */}
      {openItem && openItem.children && (
        <MegaMenu
          openItem={openItem}
          prevItem={prevItem}
          overlay={overlay}
          panelRef={panelRef}
          contentRef={contentRef}
          onKeyDown={onPanelKeyDown}
        />
      )}

      {mobileOpen && (
        <div
          id="mobile-nav"
          ref={mobileNavRef}
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-neutral-200 bg-white [text-shadow:none] xl:hidden"
        >
          <nav aria-label="Primary mobile" className="container-page py-6">
            {/* Sign in first: a returning member should not scroll past five
                sections of reading to reach their own information. */}
            <ul className="space-y-1">
              {PRIMARY_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={
                      isSectionActive(item)
                        ? pathname === pathOf(item.href)
                          ? "page"
                          : "true"
                        : undefined
                    }
                    className={cn(
                      "block rounded-md px-3 py-3 text-heading-5 hover:bg-orange-50",
                      isSectionActive(item)
                        ? "bg-orange-50 text-orange-700 shadow-[inset_3px_0_0_var(--color-orange-600)]"
                        : "text-navy-900",
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="ml-3 border-l border-neutral-200 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={
                              child.href === activeHrefIn(item, pathname)
                                ? "page"
                                : undefined
                            }
                            className={cn(
                              "block rounded-md px-3 py-2.5 hover:bg-orange-50 hover:text-orange-700",
                              child.href === activeHrefIn(item, pathname)
                                ? "bg-orange-50 font-semibold text-orange-700 shadow-[inset_3px_0_0_var(--color-orange-600)]"
                                : "text-neutral-700",
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
