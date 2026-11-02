"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import Link from "@/components/site/live-link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV, type NavSection, type NavLink } from "@/lib/nav";
import { activeHrefIn } from "./nav-active";
import { cn } from "@/lib/utils";

/**
 * The desktop mega menu: the panel, its photographs and films, and the link
 * lists. Split out of site-header.tsx so none of it ships in the first-screen
 * JavaScript; the header loads it with next/dynamic once the browser is idle
 * or the pointer nears a trigger (Lighthouse, PR #6).
 */

/** Every section that opens a menu, for the stacked image cell. */
const MENU_SECTIONS = PRIMARY_NAV.filter(
  (i): i is Extract<NavSection, { children: NavLink[] }> => Boolean(i.children),
);

export default function MegaMenu({
  openLabel,
  prevLabel,
  overlay,
  panelRef,
  contentRef,
  onKeyDown,
}: {
  openLabel: string;
  prevLabel: string | null;
  overlay: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const openItem = MENU_SECTIONS.find((s) => s.label === openLabel);
  const prevItem = MENU_SECTIONS.find((s) => s.label === prevLabel);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    if (contentRef.current) {
      setPanelHeight(Math.max(280, contentRef.current.offsetHeight));
    }
  }, [openLabel, contentRef]);

  /* The panel only exists from xl, inside the 1280px container: the photo
     cell is a quarter of the bar's content (about 300px), or a half (about
     600px) where the section splits the panel in two. */
  if (!openItem) return null;
  const imageSizes = openItem.splitHalf
    ? "(min-width: 1280px) 600px, 50vw"
    : "(min-width: 1280px) 300px, 25vw";

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label={`${openItem.label} menu`}
      onKeyDown={onKeyDown}
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
                  sizes={imageSizes}
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
