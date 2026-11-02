"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "@/components/site/live-link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  PRIMARY_NAV,
  type NavSection,
  type NavLink,
} from "@/lib/nav";
import { Logo } from "./logo";
import { HeaderSearchLink } from "./header-search-link";
import { cn } from "@/lib/utils";
import { SOFT_LAUNCH_ON } from "@/lib/soft-launch";

/**
 * One style for every primary link, so the bar reads as a single row rather
 * than five separately tuned items. Active is bold orange; the rest are quiet
 * and go orange on hover. `overlay` swaps the palette for the transparent bar
 * over the hero.
 */
/** The path part of a nav href: no #fragment, no ?query. */
const pathOf = (href: string) => href.split("#")[0].split("?")[0] || "/";

/** How well a nav href matches the current path: 0 for not at all, else the length of the match. */
function matchLength(pathname: string, href: string): number {
  const p = pathOf(href);
  if (p === "/") return pathname === "/" ? 1 : 0;
  return pathname === p || pathname.startsWith(`${p}/`) ? p.length : 0;
}

/**
 * Which entry inside a section is the page the reader is on: the one whose
 * href is the longest match for the current path, so "/healthspan/nutrition"
 * lights its own entry rather than the "all topics" entry above it.
 * Null when the reader is not on any of them.
 */
function activeHrefIn(item: NavSection, pathname: string): string | null {
  if (!item.children) return null;
  const all: string[] = [];
  for (const c of item.children) {
    all.push(c.href);
    for (const sb of c.sub ?? []) all.push(sb.href);
  }
  for (const l of item.secondary?.links ?? []) all.push(l.href);
  let best: string | null = null;
  let bestLen = 0;
  for (const href of all) {
    const len = matchLength(pathname, href);
    if (len > bestLen) {
      best = href;
      bestLen = len;
    }
  }
  return best;
}

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
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    if (openItem && contentRef.current) {
      setPanelHeight(Math.max(280, contentRef.current.offsetHeight));
    } else {
      setPanelHeight(undefined);
    }
  }, [openItem]);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

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
      {/* Warm the menu photographs on load so the first open and every
          switch crossfade between images already decoded. */}
      <div aria-hidden className="sr-only">
        {MENU_SECTIONS.map((section) => (
          <Image
            key={section.label}
            src={section.image.src}
            alt=""
            width={320}
            height={280}
            priority
          />
        ))}
      </div>
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
          three quarters the list in two columns. */}
      {openItem && openItem.children && (
        <div
          ref={panelRef}
          role="region"
          aria-label={`${openItem.label} menu`}
          onKeyDown={onPanelKeyDown}
          className="absolute inset-x-0 top-full z-0 hidden xl:block"
        >
          <div className="container-page">
            <div
              className={cn(
                "animate-menu-in overflow-hidden rounded-b-lg shadow-lg transition-[height,background-color,color] duration-media ease-out [text-shadow:none]",
                // Solid white, matching the bar (client request, 18 Sep
                // 2026, after trying it as frosted glass). No border on the
                // white state (client request, 19 Sep 2026: no grey lines) —
                // the shadow alone separates it from the page. The navy-glass
                // variant keeps its border for definition against video; it
                // is retired today (see `overlay`) but kept working.
                overlay
                  ? "border border-t-0 border-white/20 bg-[rgba(0,20,77,0.62)] backdrop-blur-2xl backdrop-saturate-150"
                  : "bg-white",
              )}
              style={{ height: panelHeight }}
            >
              <div className={cn("grid", openItem.splitHalf ? "grid-cols-2" : "grid-cols-4")}>
                {/* One image cell for every section, photos stacked and
                    crossfaded by opacity, so a switch never waits on a
                    load and never cuts. */}
                <div className="relative col-span-1 min-h-[280px]">
                  {MENU_SECTIONS.map((section) => (
                    <Image
                      key={section.label}
                      src={section.image.src}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(min-width: 1024px) 50vw, 320px"
                      className={cn(
                        "object-cover transition-opacity duration-dissolve ease-in-out",
                        section.label === openItem.label
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                      style={{ objectPosition: section.image.focal }}
                    />
                  ))}
                  {/* Where a section has a film, it plays over its photograph
                      while that section is open. Muted, played once, no
                      controls; it is scenery. Hidden for anyone who has asked
                      for reduced motion, who sees the photograph instead.
                      Mounted only while its section is open, so nothing
                      downloads until the menu is actually used, and keyed so
                      every opening is a fresh play under the same cap. */}
                  {openItem.image?.video && (
                    <MenuFilm
                      key={openItem.label}
                      src={openItem.image.video}
                      poster={openItem.image.src}
                      focal={openItem.image.focal}
                    />
                  )}
                </div>
                <div className={cn("relative", openItem.splitHalf ? "col-span-1" : "col-span-3")}>
                  {prevItem && prevItem.children && (
                    // Inert as well as hidden: the outgoing list is only
                    // scenery for the fade, so its links must never take
                    // focus, or focus would be lost when it unmounts.
                    <div
                      aria-hidden
                      inert
                      className="pointer-events-none absolute inset-0 animate-menu-fade-out"
                    >
                      <MenuList item={prevItem} onDark={overlay} />
                    </div>
                  )}
                  <div
                    ref={contentRef}
                    className={prevItem ? "animate-menu-fade-in" : undefined}
                  >
                    <MenuList item={openItem} onDark={overlay} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

/**
 * How long a menu film may move, from the moment its section opens.
 *
 * WCAG 2.2.2: motion that runs longer than five seconds needs a way to stop
 * it, and the menu has no control (product owner, 26 Sep 2026: play once,
 * five seconds or less, then rest on a still). The films are 5.04s long, so
 * dropping `loop` alone would overrun, and a slow start would push it
 * further. 4.8s leaves a margin inside the limit.
 */
const MENU_FILM_MS = 4800;

/**
 * A section's film: plays once, then holds the frame it reached.
 *
 * It stops at whichever comes first, 4.8s of playback or 4.8s after it was
 * mounted (the section opening), so a film that starts late still stops in
 * time. It rests on the frame it stopped on rather than going back to the
 * poster: each film is a slow push-in, and a jump back out to the first
 * frame would be a second movement after the first had ended. If the film
 * never starts, the poster and the photograph under it show, as before.
 */
function MenuFilm({
  src,
  poster,
  focal,
}: {
  src: string;
  poster: string;
  focal?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = () => el.pause();
    const timer = window.setTimeout(stop, MENU_FILM_MS);
    const onTime = () => {
      if (el.currentTime * 1000 >= MENU_FILM_MS) stop();
    };
    el.addEventListener("timeupdate", onTime);
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("timeupdate", onTime);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      disablePictureInPicture
      aria-hidden
      className="absolute inset-0 size-full object-cover motion-reduce:hidden"
      style={{ objectPosition: focal }}
    />
  );
}

/** Every section that opens a menu, for preloading and the stacked image cell. */
const MENU_SECTIONS = PRIMARY_NAV.filter(
  (i): i is Extract<NavSection, { children: NavLink[] }> => Boolean(i.children),
);

/**
 * One section's list, two columns. `onDark` is the navy glass variant over the
 * home page video.
 */
function MenuList({
  item,
  onDark = false,
}: {
  item: NavSection;
  onDark?: boolean;
}) {
  const pathname = usePathname();
  if (!item.children) return null;
  const items = item.children;
  /* The entry for the page the reader is on is shown selected. */
  const activeHref = activeHrefIn(item, pathname);
  const firstCol = Math.ceil(items.length / 2);
  const secondary = item.secondary;
  const secondFirstCol = secondary ? Math.ceil(secondary.links.length / 2) : 0;
  return (
    <div className="p-6">
      {/* A line saying what the section is, where the name alone does not
          carry it. Spans the full width of the panel rather than sitting in
          the first column, so it reads as an introduction to the whole list
          (client request, 19 Sep 2026). Padded to the same gutter as the
          labels below so the left edges line up. */}
      {item.intro && (
        <p
          className={cn(
            "mb-4 px-4 text-body-sm",
            onDark ? "text-white/85" : "text-neutral-700",
          )}
        >
          {item.intro}
        </p>
      )}
      <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
        {items.map((child, i) => (
          <li
            key={child.href}
            className={i < firstCol ? "col-start-1" : "col-start-2"}
            style={{ gridRow: i < firstCol ? i + 1 : i - firstCol + 1 }}
          >
            <Link
              href={child.href}
              aria-current={child.href === activeHref ? "page" : undefined}
              className={cn(
                "block rounded-md px-4 py-3 transition-colors duration-media",
                (child.sub || child.subEmpty) && "pb-2",
                onDark ? "hover:bg-white/15" : "hover:bg-orange-50",
                child.href === activeHref &&
                  (onDark
                    ? "bg-white/15"
                    : "bg-orange-50 shadow-[inset_3px_0_0_var(--color-orange-600)]"),
              )}
            >
              <span
                className={cn(
                  "block font-semibold transition-colors duration-media",
                  onDark
                    ? "text-white"
                    : child.accent || child.href === activeHref
                      ? "text-orange-700"
                      : "text-navy-900",
                )}
              >
                {child.label}
              </span>
              {child.description && (
                <span
                  className={cn(
                    // One line, always: the copy is written to fit, and this
                    // keeps it so if a longer label ever slips in.
                    "mt-0.5 block truncate text-body-sm transition-colors duration-media",
                    onDark ? "text-white/85" : "text-neutral-700",
                  )}
                >
                  {child.description}
                </span>
              )}
            </Link>

            {/* What is inside the section, named. Outside the link above
                rather than within it: these are links of their own, and an
                anchor cannot hold another anchor.

                Two by two, so four fit in the height one description used
                to take. "More" only appears where there is more - see
                TOOL_SUB_MORE. */}
            {child.sub && (
              <div className="px-4 pb-3">
                <ul
                  className={cn(
                    "grid gap-x-3 gap-y-1.5",
                    child.subStacked ? "grid-cols-1" : "grid-cols-2",
                  )}
                >
                  {child.sub.map((s) => (
                    <li key={`${s.href}${s.label}`} className="min-w-0">
                      <Link
                        href={s.href}
                        aria-current={s.href === activeHref ? "page" : undefined}
                        className={cn(
                          "block transition-colors duration-media",
                          onDark
                            ? "text-white/70 hover:text-white"
                            : "text-neutral-700 hover:text-orange-700",
                          s.href === activeHref &&
                            "font-semibold text-orange-700 underline underline-offset-4",
                        )}
                      >
                        <span
                          className={cn(
                            "block truncate text-body-sm",
                            child.subAccent &&
                              (onDark ? "text-orange-300" : "text-orange-700"),
                          )}
                        >
                          {s.label}
                        </span>
                        {/* When, or where. Muted, because the thing
                            itself is the line above it. */}
                        {s.note && (
                          <span
                            className={cn(
                              "block truncate text-label-sm",
                              onDark ? "text-white/50" : "text-neutral-600",
                            )}
                          >
                            {s.note}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
                {child.subMore && (
                  <Link
                    href={child.subMore}
                    className={cn(
                      "mt-1 inline-block text-label-sm font-semibold transition-colors duration-media",
                      onDark
                        ? "text-orange-300 hover:text-orange-200"
                        : "text-orange-700 hover:text-orange-800",
                    )}
                  >
                    More
                  </Link>
                )}
              </div>
            )}
            {/* One plain line where the sub-items would be, for an entry
                whose list is empty on purpose (the events, D22). Same
                wrapper and padding as the sub block, so it sits under the
                description with no gap. A <p>, not a link: nothing to go
                to, so nothing to focus. */}
            {child.subEmpty && !child.sub && (
              <div className="px-4 pb-3">
                <p
                  className={cn(
                    "text-body-sm",
                    onDark ? "text-white/70" : "text-neutral-600",
                  )}
                >
                  {child.subEmpty}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* The denser second block. Labels only: these are names, and a name
          is its own description. Kept in reading order down each column, as
          above, so the two blocks scan the same way.

          No rule above the label: the client rejected the rule-above-a-
          small-caps-label treatment on 19 Sep 2026. Space separates the two
          blocks instead. The gap is tuned so the Research panel lands on the
          same height as Learn, which is the taller list and sets the measure;
          both are content-driven, so re-check after copy edits. */}
      {secondary && (
        <div className="mt-[30px]">
          <p
            className={cn(
              "label-mono px-4",
              onDark ? "text-orange-400" : "text-orange-700",
            )}
          >
            {secondary.label}
          </p>
          <ul className="mt-1.5 grid grid-cols-2 gap-x-8">
            {secondary.links.map((link, i) => (
              <li
                key={link.href}
                className={i < secondFirstCol ? "col-start-1" : "col-start-2"}
                style={{
                  gridRow: i < secondFirstCol ? i + 1 : i - secondFirstCol + 1,
                }}
              >
                <Link
                  href={link.href}
                  aria-current={link.href === activeHref ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-4 py-[7px] text-body-sm transition-colors duration-media",
                    onDark
                      ? "text-white/85 hover:bg-white/15 hover:text-white"
                      : "text-neutral-700 hover:bg-orange-50 hover:text-orange-700",
                    link.href === activeHref &&
                      (onDark
                        ? "bg-white/15"
                        : "bg-orange-50 font-semibold text-orange-700 shadow-[inset_3px_0_0_var(--color-orange-600)]"),
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
