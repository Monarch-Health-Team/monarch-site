"use client";

/**
 * ============================================================================
 * Brand Butterfly — Monarch Health
 * ============================================================================
 *
 * A subtle on-brand butterfly that flies in when the reader pauses on a
 * section heading, lingers + dances above it, and flies away to the
 * opposite side. One visit per section per page-load; one butterfly on
 * screen at a time.
 *
 * Flight script for each visit:
 *
 *   1. Entry      — slides in from the left OR the right edge of the
 *                   viewport along a gentle, near-horizontal curve.
 *                   The direction alternates per section: section 1
 *                   enters from the left, section 2 from the right,
 *                   section 3 from the left again, and so on.
 *   2. Rest       — lands beside the heading and flaps slowly for at
 *                   least 2 seconds.
 *   3. Jump       — a short hop upward (~40–70px).
 *   4. Wander     — a few seconds of random gentle up/down drift in the
 *                   landing zone.
 *   5. Exit       — flies out the OPPOSITE edge from where it entered.
 *
 * If the user scrolls at any point, the butterfly skips straight to its
 * exit from its current position — never an abrupt disappear.
 *
 * ---------------------------------------------------------------------------
 * Tunable constants
 * ---------------------------------------------------------------------------
 *
 * Movement
 *   • PAUSE_BEFORE_APPEAR_MS — how long the section must be in view and
 *     the user must be still before we queue an entry.
 *   • ENTRY_DURATION_RANGE / WANDER_DURATION_RANGE / EXIT_DURATION_RANGE
 *     — every flight randomises within these so no two visits are
 *     identical. Numbers are intentionally slow to keep things calm.
 *   • REST_DURATION_RANGE — minimum 2 seconds. The butterfly always
 *     pauses long enough for the reader to register it.
 *   • JUMP_DURATION_MS / JUMP_HEIGHT_RANGE_PX — the short upward hop
 *     between rest and wander.
 *   • ENTRY_VERTICAL_AMPLITUDE_PX — caps how much the entry path can
 *     curve up/down. Smaller value = flatter, more horizontal entry.
 *   • WANDER_RADIUS_PX — how far the butterfly can drift during wander.
 *
 * Wings
 *   • FRONT_WING_ROTATION_DEGREES — peak rotation of the dominant wing.
 *   • BACK_WING_ROTATION_DEGREES — kept at ~70% of front for depth.
 *   • BACK_WING_DELAY_MS — back wing trails front; sells 3D depth.
 *   • WING_SCALE_MIN — small scale dip at the top of each flap gives
 *     the asymmetric illustration an organic, breathing motion.
 *   • FLAP_RATE_FLYING / FLAP_RATE_RESTING — flaps per second. Both
 *     intentionally slow so the wings read as graceful, not frantic.
 *
 * Pivots
 *   • FRONT_WING_PIVOT / BACK_WING_PIVOT — the SVG-space points each
 *     wing rotates around. EXPECT TO NUDGE THESE — see below.
 *
 * ---------------------------------------------------------------------------
 * Nudging pivot points
 * ---------------------------------------------------------------------------
 *
 * If a wing looks like it's flapping from the wrong point (e.g. shearing
 * through the body, or hinging at the wing tip instead of the wing
 * root), open the SVG in a vector editor and find the imagined "wing
 * attachment" — the point closest to the body where the wing meets it.
 * Plug those numbers into FRONT_WING_PIVOT / BACK_WING_PIVOT (SVG
 * coordinate space, viewBox 0 0 153 140).
 *
 *   Wing tip stays still, root swings   → pivot is at the wing tip;
 *                                          move it toward the body.
 *   Wing visibly detaches from body     → pivot is too far out; pull it
 *                                          in toward the body centerline.
 *   Whole svg rotates                   → transform-origin landed on
 *                                          the svg root instead of the
 *                                          <g> — check transformBox.
 *
 * ============================================================================
 */

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

// ---------------------------------------------------------------------------
// Page allowlist / denylist
// ---------------------------------------------------------------------------
// Explicit list of routes where the butterfly is welcome. Anything not in
// either list (e.g. someone hitting an unknown URL → 404) falls through to
// the default which is "enabled" — the user wants the butterfly on the
// 404 page too.
const ALLOWED_EXACT_PATHS = new Set<string>([
  "/",
  "/about",
  "/approach",
  "/contact",
  "/memberships",
  "/memberships/executive",
  "/memberships/executive",
  "/memberships/ageing-in-place",
  "/memberships/ageing-in-place",
  "/memberships/signature",
  "/programs",
  "/care",
  "/care/ageing-in-place",
  "/care/home-care",
  "/journal", // hub only, articles are denied below
  "/resources", // hub only, tools + library are denied below
  "/referrals",
]);

// Known routes where the butterfly should NOT appear. Anything matched
// here wins over "default enabled" so unknown URLs (treated as 404) still
// get a butterfly.
const DENIED_EXACT_PATHS = new Set<string>([
  "/faq",
  "/careers",
  "/resources/library",
  "/resources/gds-15",
  "/resources/mood-energy-check",
  "/resources/anxiety-check",
  "/resources/memory-concerns-check",
  "/resources/daily-living",
  "/resources/caregiver-strain",
  "/resources/in-home-care-fit",
  "/privacy",
  "/terms",
  "/accessibility",
]);
// Subtree denies — any journal article and any careers posting.
const DENIED_PATH_PREFIXES = ["/journal/", "/careers/", "/programs/"];

function isPathAllowed(rawPathname: string | null): boolean {
  if (!rawPathname) return false;
  // Strip trailing slash so "/about/" and "/about" both match.
  const pathname =
    rawPathname.length > 1 && rawPathname.endsWith("/")
      ? rawPathname.slice(0, -1)
      : rawPathname;
  if (ALLOWED_EXACT_PATHS.has(pathname)) return true;
  if (DENIED_EXACT_PATHS.has(pathname)) return false;
  if (DENIED_PATH_PREFIXES.some((p) => pathname.startsWith(p))) return false;
  // Unknown path — likely a 404 — defaults to enabled per the spec.
  return true;
}

// ---------------------------------------------------------------------------
// TUNING
// ---------------------------------------------------------------------------
const PAUSE_BEFORE_APPEAR_MS = 3000;

const REST_DURATION_RANGE: readonly [number, number] = [2000, 6000];
// VELOCITY-based pacing for EXIT: the exit always crosses most of the
// viewport (it leaves the OPPOSITE edge from where it entered), so a
// velocity-based duration gives a calm, naturally slow fly-away.
const FLIGHT_VELOCITY_PX_PER_SEC: readonly [number, number] = [200, 280];
// Floor for ENTRY duration. When the butterfly enters from the same
// side the heading sits on (e.g. left-aligned heading + entry from
// left), the horizontal distance to landing can be tiny — pure
// distance/velocity then yields a sub-second entry that feels zappy.
// This floor keeps short-distance entries taking the same gentle time
// as long-distance ones. Exit isn't floored because exit distance is
// always large (it crosses the viewport).
const MIN_ENTRY_DURATION_MS = 3000;

// Width of the smooth slow-in (entry) / slow-out (exit) zone in
// PIXELS of horizontal travel. The butterfly cruises at constant
// velocity through the rest of the flight, then linearly decelerates
// over this distance at the end of entry (or accelerates over it at
// the start of exit). 30px gives a clearly visible smoothing without
// stretching into the cruise portion of the flight.
const SLOWDOWN_DISTANCE_PX = 30;

const ENTRY_VERTICAL_AMPLITUDE_PX = 40;
// How far above OR below the viewport's vertical centre the entry/exit
// edge can land. With this set to 150, the butterfly can enter
// anywhere across the middle 300px-tall band of the viewport — so some
// flights arrive from upper-left and descend, some arrive low and rise,
// some come in nearly level. Same range applies to the exit edge.
const ENTRY_EXIT_Y_RANGE_PX = 150;
// Amplitude of the up/down wobble layered on top of each flight bezier.
// Tweak up for a more frantic, butterfly-er vibe; down for a calm glide.
const WOBBLE_AMPLITUDE_RANGE: readonly [number, number] = [12, 22];
// Wobble FREQUENCY in cycles per second (Hz). Previously this was
// "cycles per total path duration" which buzzed badly on short
// exits — a 0.8s exit got 3+ cycles crammed in, making the wobble
// jitter. With Hz, a calm vertical bob happens at the same temporal
// rate regardless of how long the segment runs.
const WOBBLE_HZ_RANGE: readonly [number, number] = [0.5, 0.9];
// (Previously: SCROLL_TERMINATE_PX gated when the active sequence got
// killed early. We removed it — the butterfly now lives entirely in
// document space, so scrolling naturally moves it out of the viewport;
// the sequence finishes its own animation, then unmounts on its own.)

// Flying flap rate — bumped +20% from the original [1.6, 2.2] tuning
// so the wings feel a touch more energetic during flight without
// reading as frantic.
const FLAP_RATE_FLYING: readonly [number, number] = [1.92, 2.64]; // Hz
// Resting flap is set explicitly here (NOT derived from flying any
// more) so the two ranges can be tuned independently. Matches the
// drowsy ~2-second-cycle perched feel the user dialled in.
const FLAP_RATE_RESTING: readonly [number, number] = [0.4, 0.55]; // Hz

const FRONT_WING_ROTATION_DEGREES = 15;
const BACK_WING_ROTATION_DEGREES = 10;
const BACK_WING_DELAY_MS = 60;
const WING_SCALE_MIN = 0.96;

const BUTTERFLY_OPACITY = 0.88;
const BUTTERFLY_SIZE_PX = 80;
// Fill colour for every path of the animated butterfly. Single source of
// truth — change here to recolour the whole creature. Set to Monarch Orange
// (orange-600, #D64000), the brand's interaction colour and the colour of the
// "Health" wordmark in the lockup, so the creature reads as the mark come
// loose rather than as decoration.
const BUTTERFLY_FILL = "#D64000";
// The butterfly's body sits in the lower-right of its 80×80 box (the
// front wing dominates the left side of the SVG). These anchor pixels
// are where the body's BOTTOM-CENTER is, measured from the motion.div's
// top-left corner. When facingLeft (scaleX(-1)) is applied, the X
// flips because the body visually appears on the opposite side.
//
// Numbers come from the SVG body path bounds (roughly 66–148, 79–134
// in viewBox 0 0 153 140), translated into the rendered 80px box.
const BODY_ANCHOR_X = 56; // body center x when facing right
const BODY_ANCHOR_X_MIRRORED = BUTTERFLY_SIZE_PX - BODY_ANCHOR_X; // when facing left
const BODY_ANCHOR_BOTTOM_Y = 70; // body bottom y (where it perches)
const FRONT_WING_PIVOT = { x: -88, y: -20 };
const BACK_WING_PIVOT = { x: -64, y: -33 };
const VIEWPORT_MIN_WIDTH = 768;
const SCROLL_IDLE_MS = 250;

// DEV: flip to true to render visible crosshair markers at the two
// wing pivots. The wings will visibly rotate AROUND these markers, so
// you can eyeball where the pivot actually is in SVG-viewBox space.
// Tweak FRONT_WING_PIVOT / BACK_WING_PIVOT until the markers sit where
// the wing should hinge from. Flip back to false before shipping.
const SHOW_PIVOTS = false;
const SVG_VIEWBOX_W = 153;
const SVG_VIEWBOX_H = 140;
// Padding added around the native viewBox so the wings have somewhere
// to swing during the flap without getting clipped by the SVG bounds.
// Raise this if you bump FRONT_WING_ROTATION_DEGREES; ~30% of the
// rotation magnitude per side is a good rule of thumb.
const SVG_PAD = 40;
// z-index above section content but below the fixed header (z-50).
const BUTTERFLY_Z_INDEX = 30;
const BEZIER_SAMPLES = 28;

// ---------------------------------------------------------------------------
// Module-level direction counter — alternates L↔R per visited section.
// Resets when the page changes (see route-change effect below).
// ---------------------------------------------------------------------------
let directionCounter = 0;
function nextEntryFromLeft(): boolean {
  const fromLeft = directionCounter % 2 === 0;
  directionCounter += 1;
  return fromLeft;
}
function resetDirectionCounter() {
  directionCounter = 0;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const range = (pair: readonly [number, number]) => rand(pair[0], pair[1]);

type Point = { x: number; y: number };

// ---------------------------------------------------------------------------
// Sequence planning — produces a fully-deterministic flight plan that the
// runner executes in order. Each "phase" is a self-contained animation
// segment.
// ---------------------------------------------------------------------------
interface Sequence {
  fromLeft: boolean;
  // All coordinates are in DOCUMENT space (i.e. landing.y already
  // includes window.scrollY at trigger time). The host container uses
  // position: absolute so these values map directly to on-page
  // positions that scroll with the rest of the document.
  start: Point;
  landing: Point;
  end: Point;
  entryControl1: Point;
  entryControl2: Point;
  exitControl1: Point;
  exitControl2: Point;
  entryDuration: number;
  restDuration: number;
  exitDuration: number;
  // The vertical scroll position at the moment of triggering. Used by
  // the scroll handler to decide when the user has scrolled "past"
  // this butterfly so the slot can free up.
  triggerScrollY: number;
}

/**
 * Get the bounding rect of the visible text glyphs on the FIRST line
 * of a heading. The heading element's own bounding rect spans the full
 * content width (including empty space after wrapped text) — that was
 * letting the butterfly land in blank canvas. Range.getClientRects()
 * returns one rect per line of actual text, so [0] is the first line's
 * true text extent.
 */
function firstLineTextRect(heading: HTMLElement): DOMRect | null {
  const textNode = Array.from(heading.childNodes).find(
    (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim() !== "",
  ) as Text | undefined;
  if (!textNode || !textNode.textContent) return null;
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.textContent.length);
  const rects = range.getClientRects();
  if (rects.length === 0) return null;
  return rects[0];
}

/**
 * Build a flight plan in DOCUMENT-SPACE coordinates. Once planned, the
 * sequence is "baked" — it doesn't change as the user scrolls. The
 * butterfly's host is position:absolute so the planned doc-space
 * coordinates scroll naturally with the rest of the page.
 */
function planSequence(
  heading: HTMLElement,
  scrollX: number,
  scrollY: number,
  vw: number,
  vh: number,
): Sequence {
  const fromLeft = nextEntryFromLeft();

  // Precise first-line text bounds — the actual glyph rectangle of
  // the section TITLE (h1/h2/h3), not the full element box. This is
  // what the butterfly visually perches on.
  const lineRect = firstLineTextRect(heading) ?? heading.getBoundingClientRect();

  // The corner of the visible heading text where the butterfly's body
  // bottom-center should land. fromLeft → top-LEFT corner of the first
  // letter; fromRight → top-RIGHT corner of the last visible letter on
  // the first line. Small jitter so it isn't pixel-locked.
  const cornerX = fromLeft
    ? lineRect.left + scrollX + rand(-4, 18)
    : lineRect.right + scrollX + rand(-18, 4);
  const cornerY = lineRect.top + scrollY + rand(-2, 8);

  // Translate the desired body-anchor position into the motion.div's
  // top-left coordinate. When facingLeft (sequence.fromLeft = false),
  // the body visually appears on the opposite side of the box, so we
  // use the mirrored anchor X.
  const bodyAnchorX = fromLeft ? BODY_ANCHOR_X : BODY_ANCHOR_X_MIRRORED;
  const target: Point = {
    x: cornerX - bodyAnchorX,
    y: cornerY - BODY_ANCHOR_BOTTOM_Y,
  };

  // Entry start — at the viewport edge at trigger time, with a Y that
  // is randomised across a wide vertical band centred on the viewport
  // middle. This is what makes the entry trajectory diagonal rather
  // than nearly level with the heading: the butterfly can come in from
  // upper-left and descend toward the heading, or from lower-left and
  // rise to it, or anywhere in between.
  const viewportMidYDoc = scrollY + vh / 2;
  const startY =
    viewportMidYDoc + rand(-ENTRY_EXIT_Y_RANGE_PX, ENTRY_EXIT_Y_RANGE_PX);
  const start: Point = fromLeft
    ? { x: scrollX - BUTTERFLY_SIZE_PX, y: startY }
    : { x: scrollX + vw + BUTTERFLY_SIZE_PX, y: startY };

  // Entry control points — gentle horizontal arc with capped vertical
  // amplitude. Wobble is added at animate-time on top of this.
  const eMidX = (start.x + target.x) / 2;
  const eMidY = (start.y + target.y) / 2;
  const entryControl1: Point = {
    x: eMidX + rand(-80, 80),
    y: eMidY + rand(-ENTRY_VERTICAL_AMPLITUDE_PX, ENTRY_VERTICAL_AMPLITUDE_PX),
  };
  const entryControl2: Point = {
    x: eMidX + rand(-40, 40),
    y:
      eMidY +
      rand(-ENTRY_VERTICAL_AMPLITUDE_PX, ENTRY_VERTICAL_AMPLITUDE_PX * 0.5),
  };

  // Exit — leaves the OPPOSITE viewport edge from where it entered,
  // at a fresh random Y from the same wide band around the viewport
  // middle. Independent from start.y so a flight that came in from
  // the top can exit toward the bottom (and vice versa), producing
  // the diagonal-up / diagonal-down / nearly-level variety we want.
  const endY =
    viewportMidYDoc + rand(-ENTRY_EXIT_Y_RANGE_PX, ENTRY_EXIT_Y_RANGE_PX);
  const end: Point = fromLeft
    ? { x: scrollX + vw + BUTTERFLY_SIZE_PX, y: endY }
    : { x: scrollX - BUTTERFLY_SIZE_PX, y: endY };

  const xMidX = (target.x + end.x) / 2;
  const xMidY = (target.y + end.y) / 2;
  const exitControl1: Point = {
    x: xMidX + rand(-80, 80),
    y:
      xMidY +
      rand(-ENTRY_VERTICAL_AMPLITUDE_PX, ENTRY_VERTICAL_AMPLITUDE_PX * 0.5),
  };
  const exitControl2: Point = {
    x: xMidX + rand(-40, 40),
    y: xMidY + rand(-ENTRY_VERTICAL_AMPLITUDE_PX, ENTRY_VERTICAL_AMPLITUDE_PX),
  };

  // Pacing: entry has a duration floor so short-distance entries don't
  // zap to the landing point; exit uses pure velocity-based duration
  // because it always traverses most of the viewport (opposite edge)
  // and looks naturally slow at the chosen velocity.
  const velocity = range(FLIGHT_VELOCITY_PX_PER_SEC);
  const entryDistX = Math.abs(target.x - start.x);
  const exitDistX = Math.abs(end.x - target.x);
  const entryDuration = Math.max(
    MIN_ENTRY_DURATION_MS,
    (entryDistX / velocity) * 1000,
  );
  const exitDuration = (exitDistX / velocity) * 1000;

  return {
    fromLeft,
    start,
    landing: target,
    end,
    entryControl1,
    entryControl2,
    exitControl1,
    exitControl2,
    entryDuration,
    restDuration: range(REST_DURATION_RANGE),
    exitDuration,
    triggerScrollY: scrollY,
  };
}

// ---------------------------------------------------------------------------
// Piecewise easing factories
// ---------------------------------------------------------------------------
// These produce a function (t: 0..1) → eased progress 0..1, where:
//   • Linear cruise for most of the flight (constant velocity)
//   • Precisely SLOWDOWN_DISTANCE_PX of real horizontal travel is
//     devoted to the smooth slow-in / slow-out at the relevant end
//   • Cruise velocity is slightly above "1 unit of progress per unit
//     of time" to compensate for the lower velocity during easing,
//     so the total path still completes in `duration`
// Math: with linear deceleration from vCruise to 0 over time portion
// sTP, the slowdown covers (vCruise/2)*sTP of progress. For this to
// equal SLOWDOWN_DISTANCE_PX / totalDistance, we solve:
//   sTP = 2 * SDP / (D + SDP)
// where D is the segment's total distance.

type EaseFn = (t: number) => number;

function makeEntryLandingEase(totalDistancePx: number): EaseFn {
  const sTP = Math.min(
    0.5,
    (2 * SLOWDOWN_DISTANCE_PX) / (totalDistancePx + SLOWDOWN_DISTANCE_PX),
  );
  const linearEnd = 1 - sTP;
  const vCruise = 1 / (1 - sTP / 2);
  const linearDist = vCruise * linearEnd;
  return (t: number) => {
    if (t <= linearEnd) return vCruise * t;
    const u = t - linearEnd;
    return linearDist + vCruise * u - (vCruise * u * u) / (2 * sTP);
  };
}

function makeExitTakeoffEase(totalDistancePx: number): EaseFn {
  const sTP = Math.min(
    0.5,
    (2 * SLOWDOWN_DISTANCE_PX) / (totalDistancePx + SLOWDOWN_DISTANCE_PX),
  );
  const vCruise = 1 / (1 - sTP / 2);
  const rampUpDist = (vCruise * sTP) / 2;
  return (t: number) => {
    if (t < sTP) return (vCruise * t * t) / (2 * sTP);
    return rampUpDist + vCruise * (t - sTP);
  };
}

// ---------------------------------------------------------------------------
// BrandButterfly — outer gate (reduced-motion + viewport width).
// ---------------------------------------------------------------------------
export function BrandButterfly() {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;
    const mq = window.matchMedia(`(min-width: ${VIEWPORT_MIN_WIDTH}px)`);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduceMotion]);

  // Page-level gate (allowlist + denylist + 404 default). Comes BEFORE
  // viewport / reduced-motion checks so unmounting on route change is
  // immediate — no flicker of a sequence in-progress.
  if (!isPathAllowed(pathname)) return null;
  if (reduceMotion || !enabled) return null;
  return <BrandButterflyImpl />;
}

// ---------------------------------------------------------------------------
// BrandButterflyImpl — orchestrates section detection + flight launches.
// ---------------------------------------------------------------------------
function BrandButterflyImpl() {
  const pathname = usePathname();
  const visitedSections = React.useRef<WeakSet<Element>>(new WeakSet());
  const pendingTimerRef = React.useRef<number | null>(null);
  const pendingSectionRef = React.useRef<Element | null>(null);

  const isScrollingRef = React.useRef(false);
  const scrollIdleTimerRef = React.useRef<number | null>(null);

  const [activeSequence, setActiveSequence] = React.useState<Sequence | null>(
    null,
  );

  // ---- Route-change reset --------------------------------------------------
  // We previously monkeypatched `history.pushState` / `history.replaceState`
  // to detect Next.js App Router client navigations and reset our visited-
  // section state. That worked but had a sharp edge: Next 16 itself
  // patches those methods for client navigation interception, and our
  // cleanup restored the *original native* methods — not Next's patched
  // versions — risking router corruption on unmount. (See dev §5.2.)
  //
  // The idiomatic Next 16 approach is `usePathname()` — it updates after
  // every client-side navigation completes, so resetting state in an
  // effect keyed on `pathname` accomplishes the same thing without
  // touching the History prototype. We still keep a `popstate` listener
  // for the edge case where the back/forward button is held and the
  // route reset needs to fire pre-React.
  const resetButterflyState = React.useCallback(() => {
    visitedSections.current = new WeakSet();
    pendingSectionRef.current = null;
    resetDirectionCounter();
    if (pendingTimerRef.current !== null) {
      window.clearTimeout(pendingTimerRef.current);
      pendingTimerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    // Fires on every client-side route change (App Router) including
    // hard navigations after hydration. Does NOT fire on the very first
    // mount when pathname is just being initialised — but on first
    // mount the visited-sections WeakSet is already empty, so nothing
    // needs resetting.
    resetButterflyState();
  }, [pathname, resetButterflyState]);

  React.useEffect(() => {
    // Belt-and-braces: covers the back/forward edge case where the
    // popstate event may fire before React re-renders with the new
    // pathname. usePathname() catches the bulk; popstate covers the
    // remainder. Both call the same idempotent reset.
    const handler = () => resetButterflyState();
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [resetButterflyState]);

  // ---- Scroll tracking -----------------------------------------------------
  // We track which sections are currently in view via the IntersectionObserver
  // below. When scroll stops we sweep that set so a section already on screen
  // when the user goes idle still gets queued — the observer itself only fires
  // on threshold crossings, so the post-scroll "I'm sitting here now" state
  // would otherwise never trigger an entry.
  const visibleSectionsRef = React.useRef<Set<Element>>(new Set());

  /**
   * Heading must be visible in the viewport AND have enough room
   * ABOVE it for the butterfly to perch on the top edge. Without
   * this guard, if the user has scrolled past the heading and is
   * reading mid-section content, the butterfly tries to land at a
   * negative-y position in document space — which looks exactly
   * like "flies into the top corner, exits at the top, never comes
   * down to sit." We need at least BUTTERFLY_SIZE_PX of space
   * between the viewport top and the heading top, and the heading
   * must be in the viewport (top below 60px from the bottom).
   */
  const headingIsPerchable = React.useCallback((heading: HTMLElement) => {
    const hr = heading.getBoundingClientRect();
    const vh = window.innerHeight;
    if (hr.top < BUTTERFLY_SIZE_PX) return false; // no room above
    if (hr.top > vh - 60) return false; // heading off the bottom
    return true;
  }, []);

  const queueSectionEntry = React.useCallback(
    (section: Element) => {
      if (visitedSections.current.has(section)) return;
      if (pendingSectionRef.current === section) return;
      // Per-section opt-out: any <section data-no-butterfly="true">
      // gets skipped. Used on the home hero (video background) so the
      // butterfly doesn't fly over the playing video.
      if ((section as HTMLElement).dataset?.noButterfly === "true") return;
      const heading = section.querySelector<HTMLElement>("h1, h2, h3");
      if (!heading) return;
      // Skip if heading isn't in a perch-able position right now. The
      // section isn't marked visited so the user can scroll the heading
      // into view and trigger it later.
      if (!headingIsPerchable(heading)) return;

      if (pendingTimerRef.current !== null) {
        window.clearTimeout(pendingTimerRef.current);
      }
      pendingSectionRef.current = section;
      pendingTimerRef.current = window.setTimeout(() => {
        pendingTimerRef.current = null;
        const pending = pendingSectionRef.current;
        pendingSectionRef.current = null;
        if (!pending) return;
        if (isScrollingRef.current) return;
        if (visitedSections.current.has(pending)) return;
        const h = pending.querySelector<HTMLElement>("h1, h2, h3");
        if (!h) return;
        // Re-check at fire time — even though scroll cancels the timer,
        // dynamic content (lazy-loaded images, layout shifts) could
        // have moved the heading between queue and fire.
        if (!headingIsPerchable(h)) return;

        visitedSections.current.add(pending);
        const seq = planSequence(
          h,
          window.scrollX,
          window.scrollY,
          window.innerWidth,
          window.innerHeight,
        );
        setActiveSequence(seq);
      }, PAUSE_BEFORE_APPEAR_MS);
    },
    [headingIsPerchable],
  );

  React.useEffect(() => {
    const onScroll = () => {
      isScrollingRef.current = true;

      // Cancel any pending entry — user is no longer paused.
      if (pendingTimerRef.current !== null) {
        window.clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
        pendingSectionRef.current = null;
      }

      // The butterfly does NOT terminate on scroll any more. It's
      // anchored in document space and will fly through its full
      // entry → rest → exit sequence regardless of where the user
      // scrolls. When the user has scrolled past it, the butterfly
      // is simply outside their viewport — still animating, just
      // invisible — until onComplete fires and unmounts it.

      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
      scrollIdleTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;

        // Scroll-stop sweep — pick the most-visible section that has
        // a heading and isn't already visited, then queue it.
        if (activeSequence) return;
        let best: Element | null = null;
        let bestArea = 0;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        visibleSectionsRef.current.forEach((section) => {
          if (visitedSections.current.has(section)) return;
          if (!section.querySelector("h1, h2, h3")) return;
          const r = (section as HTMLElement).getBoundingClientRect();
          const visW = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
          const visH = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
          const area = visW * visH;
          if (area > bestArea) {
            bestArea = area;
            best = section;
          }
        });
        if (best) queueSectionEntry(best);
      }, SCROLL_IDLE_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
    };
  }, [activeSequence, queueSectionEntry]);

  // ---- Intersection observer ----------------------------------------------
  // Two responsibilities:
  //   1. Maintain `visibleSectionsRef` so the scroll-stop sweep above knows
  //      which sections are eligible.
  //   2. Queue an entry the moment a section becomes visible AND the user
  //      isn't already scrolling (e.g. when they navigate directly to a
  //      page mid-section via a hash link).
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSectionsRef.current.add(entry.target);
          } else {
            visibleSectionsRef.current.delete(entry.target);
          }
        }

        if (activeSequence) return; // one at a time
        if (isScrollingRef.current) return;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          queueSectionEntry(entry.target);
        }
      },
      // Lower threshold (5%) + no shrinking root margin so any section
      // that's even partially on screen is considered "in view". The
      // scroll-stop sweep picks the most-visible one when there are
      // multiple candidates, so being generous here is safe.
      { threshold: 0.05 },
    );

    const observeAll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((s) => observer.observe(s));
    };
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
      if (pendingTimerRef.current !== null) {
        window.clearTimeout(pendingTimerRef.current);
      }
    };
  }, [activeSequence, queueSectionEntry]);

  const handleSequenceComplete = React.useCallback(() => {
    setActiveSequence(null);
  }, []);

  // Host container — position: absolute (NOT fixed). It sits at the
  // top-left of the document, and its absolutely-positioned child
  // butterfly scrolls naturally with the rest of the page in document
  // space. overflow:visible so the butterfly can fly past the document
  // edges without being clipped.
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 0, // 0-height layer so it never interferes with layout
        pointerEvents: "none",
        zIndex: BUTTERFLY_Z_INDEX,
        overflow: "visible",
      }}
    >
      <AnimatePresence>
        {activeSequence ? (
          <FlightRunner
            key={`${activeSequence.start.x}-${activeSequence.start.y}-${activeSequence.entryDuration}`}
            sequence={activeSequence}
            onComplete={handleSequenceComplete}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// FlightRunner — executes entry → rest → jump → wander → exit in order,
// or skips to exit if interrupted by scroll.
// ---------------------------------------------------------------------------
function FlightRunner({
  sequence,
  onComplete,
}: {
  sequence: Sequence;
  onComplete: () => void;
}) {
  const [scope, animate] = useAnimate();
  const [phase, setPhase] = React.useState<"flying" | "resting">("flying");

  React.useEffect(() => {
    let cancelled = false;

    /** Constant-horizontal-speed flight from p0 → p3.
     *
     *  X is a strict linear interpolation between start and end — same
     *  amount of pixels per unit time, no acceleration anywhere. That
     *  removes the "sprint near the edges" that easeInOut was causing.
     *
     *  Y starts as a linear interpolation between start and end, with
     *  a low-frequency sine wobble + faster detail oscillation + tiny
     *  jitter layered on top (tapered to zero at the endpoints so the
     *  landing is still exact). That gives the natural bobbing motion
     *  while keeping X velocity constant.
     *
     *  The animate() itself uses ease: "linear" so the time-rate of the
     *  keyframe progression is also constant. (Combined with linear xs,
     *  that's truly constant horizontal speed.)
     *
     *  The c1/c2 control-point arguments are kept for API parity but
     *  ignored — they used to shape the path but linear is cleaner. */
    const flyBezier = async (
      p0: Point,
      _c1: Point,
      _c2: Point,
      p3: Point,
      duration: number,
      easeFn: EaseFn,
    ) => {
      const xs: number[] = [];
      const ys: number[] = [];
      const wobbleAmp = range(WOBBLE_AMPLITUDE_RANGE);
      const wobblePhase = Math.random() * Math.PI * 2;
      // Convert Hz into "cycles over this segment's duration" so short
      // and long flights all bob at the same temporal rate. Without
      // this, short exits crammed all the cycles into < 1 second and
      // looked like jitter.
      const wobbleHz = range(WOBBLE_HZ_RANGE);
      const durationSec = duration / 1000;
      const cycles = wobbleHz * durationSec;
      const detailAmp = wobbleAmp * 0.35;
      const detailCycles = cycles * 2.3;
      const detailPhase = Math.random() * Math.PI * 2;
      for (let i = 0; i <= BEZIER_SAMPLES; i++) {
        const t = i / BEZIER_SAMPLES;
        // Bake the piecewise easing into the keyframe POSITIONS so
        // framer can interpolate linearly between them. This gives
        // us precise control over the ease shape (linear cruise +
        // 30px slow-in/out window).
        const easedT = easeFn(t);
        const taper = 1 - Math.abs(2 * t - 1); // 0 at ends, 1 at middle
        xs.push(p0.x + (p3.x - p0.x) * easedT);
        let y = p0.y + (p3.y - p0.y) * easedT;
        // Wobble uses LINEAR t so the bob frequency feels constant
        // even as horizontal velocity changes through the easing
        // window.
        y += Math.sin(t * cycles * Math.PI * 2 + wobblePhase) * wobbleAmp * taper;
        y +=
          Math.sin(t * detailCycles * Math.PI * 2 + detailPhase) *
          detailAmp *
          taper;
        y += rand(-1.5, 1.5) * taper;
        ys.push(y);
      }
      const times = xs.map((_, i, a) => i / (a.length - 1));
      await animate(
        scope.current,
        { x: xs, y: ys },
        {
          duration: duration / 1000,
          ease: "linear", // easing already baked into keyframes
          times,
        },
      );
    };

    (async () => {
      // ---- Entry ----
      // Build a per-flight easing function: linear cruise for the
      // bulk of the distance, then SLOWDOWN_DISTANCE_PX of smooth
      // deceleration into the landing point.
      setPhase("flying");
      const entryDistance = Math.abs(sequence.landing.x - sequence.start.x);
      await flyBezier(
        sequence.start,
        sequence.entryControl1,
        sequence.entryControl2,
        sequence.landing,
        sequence.entryDuration,
        makeEntryLandingEase(entryDistance),
      );
      if (cancelled) return;

      // ---- Rest ----
      setPhase("resting");
      await new Promise<void>((resolve) => {
        // Shared cleanup closure ensures both the timeout AND the
        // bail-out interval are cleared on every exit path — the
        // normal-completion `setTimeout` callback as well as the
        // cancellation branch. Previously the interval kept ticking
        // during the exit phase on normal completion (FIND-009).
        let done = false;
        const cleanup = () => {
          if (done) return;
          done = true;
          window.clearTimeout(t);
          window.clearInterval(checker);
        };
        const t = window.setTimeout(() => {
          cleanup();
          resolve();
        }, sequence.restDuration);
        // Bail-out checker — let cancellation finish the rest early.
        const checker = window.setInterval(() => {
          if (cancelled) {
            cleanup();
            resolve();
          }
        }, 50);
      });
      if (cancelled) return;

      // ---- Exit ----
      // Straight from the landing point to the opposite viewport edge
      // (in document space). Same near-constant horizontal speed as
      // entry across the middle, with SLOWDOWN_DISTANCE_PX of smooth
      // acceleration at the takeoff so it doesn't lurch into motion.
      setPhase("flying");
      const exitDistance = Math.abs(sequence.end.x - sequence.landing.x);
      await flyBezier(
        sequence.landing,
        sequence.exitControl1,
        sequence.exitControl2,
        sequence.end,
        sequence.exitDuration,
        makeExitTakeoffEase(exitDistance),
      );
      if (!cancelled) onComplete();
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence]);

  return (
    <motion.div
      ref={scope}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: BUTTERFLY_SIZE_PX,
        height: BUTTERFLY_SIZE_PX,
        x: sequence.start.x,
        y: sequence.start.y,
        opacity: BUTTERFLY_OPACITY,
        willChange: "transform",
      }}
    >
      <ButterflyArt phase={phase} facingLeft={!sequence.fromLeft} />
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// ButterflyArt — inline SVG with animated wings + static body.
// ---------------------------------------------------------------------------
function ButterflyArt({
  phase,
  facingLeft,
}: {
  phase: "flying" | "resting";
  facingLeft: boolean;
}) {
  // Per-mount randomised flap rate so two butterflies in the same
  // session don't beat in perfect lockstep.
  const flapHz = React.useMemo(
    () => range(phase === "flying" ? FLAP_RATE_FLYING : FLAP_RATE_RESTING),
    [phase],
  );

  // ---- Continuous-phase wing driver ----------------------------------
  // The wings used to be driven by keyframe animations with
  // repeat: Infinity. Framer caches the duration for those, so we had
  // to remount via key={phase} to pick up the new rate — which reset
  // the wing back to the start of its keyframe array each time the
  // butterfly landed or took off, producing the visible jolt.
  //
  // Now we accumulate a phase angle in a ref, advanced every animation
  // frame by 2π × flapHz × dt. The current rotation is the sine of the
  // phase angle, the scale is the cosine-squared of the same. When the
  // phase prop flips, only the rate at which the angle accumulates
  // changes — the angle itself is continuous, so the wing position
  // visually transitions without any reset.
  const frontRotMV = useMotionValue(0);
  const frontScaleMV = useMotionValue(1);
  const backRotMV = useMotionValue(0);
  const backScaleMV = useMotionValue(1);

  // Start at 0 — the very first frame randomises so multiple butterfly
  // visits aren't perfectly in sync.
  const phaseAngleRef = React.useRef(0);
  const initialisedRef = React.useRef(false);

  React.useEffect(() => {
    if (!initialisedRef.current) {
      phaseAngleRef.current = Math.random() * Math.PI * 2;
      initialisedRef.current = true;
    }
    let raf = 0;
    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      // Cap dt so a tab that just regained focus doesn't fast-forward
      // the wings through dozens of cycles in one frame.
      const cappedDt = Math.min(dt, 0.05);
      phaseAngleRef.current += 2 * Math.PI * flapHz * cappedDt;

      const phi = phaseAngleRef.current;
      // Back wing trails the front by BACK_WING_DELAY_MS converted
      // into a phase offset at the current rate. Note: the absolute
      // phase offset (in radians) shifts when flapHz changes; the
      // resulting back-wing-position discontinuity is small enough
      // (max ~5° at the resting↔flying transition) that it reads as
      // a brief "settling" of the back wing rather than a jump.
      const backPhi =
        phi - 2 * Math.PI * (BACK_WING_DELAY_MS / 1000) * flapHz;

      frontRotMV.set(FRONT_WING_ROTATION_DEGREES * Math.sin(phi));
      backRotMV.set(BACK_WING_ROTATION_DEGREES * Math.sin(backPhi));

      // Scale flexes minimum at the extremes of rotation and back to
      // 1 at the centerline. cos²(phi) gives 1 at phi=0 (center), 0
      // at phi=π/2 (extreme). Mapped to [WING_SCALE_MIN, 1].
      const scaleFront =
        WING_SCALE_MIN + (1 - WING_SCALE_MIN) * Math.cos(phi) ** 2;
      const scaleBack =
        WING_SCALE_MIN + (1 - WING_SCALE_MIN) * Math.cos(backPhi) ** 2;
      frontScaleMV.set(scaleFront);
      backScaleMV.set(scaleBack);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [flapHz, frontRotMV, frontScaleMV, backRotMV, backScaleMV]);

  return (
    <svg
      viewBox={`${-SVG_PAD} ${-SVG_PAD} ${SVG_VIEWBOX_W + SVG_PAD * 2} ${SVG_VIEWBOX_H + SVG_PAD * 2}`}
      width={
        BUTTERFLY_SIZE_PX * ((SVG_VIEWBOX_W + SVG_PAD * 2) / SVG_VIEWBOX_W)
      }
      height={
        BUTTERFLY_SIZE_PX *
        ((SVG_VIEWBOX_H + SVG_PAD * 2) / SVG_VIEWBOX_W)
      }
      style={{
        display: "block",
        // Horizontal mirror when the butterfly is flying right→left so
        // the head leads and the wings trail in the direction of motion.
        // The internal animation works the same in both orientations
        // because the pivot points are in SVG-local coordinates.
        transform: facingLeft ? "scaleX(-1)" : undefined,
        // Shift the SVG up-left so the butterfly artwork (which now sits
        // inside a padded viewBox) appears at roughly the same location
        // the parent positioning expects.
        marginLeft: -SVG_PAD * (BUTTERFLY_SIZE_PX / SVG_VIEWBOX_W),
        marginTop: -SVG_PAD * (BUTTERFLY_SIZE_PX / SVG_VIEWBOX_W),
        filter: "drop-shadow(0 4px 8px rgba(31, 42, 55, 0.18))",
      }}
      fill="none"
      aria-hidden
    >
      {/* Back wing, renders first, sits behind body. Trails front wing
          by BACK_WING_DELAY_MS, smaller magnitude. Driven by motion
          values (not keyframes) so the wing position is continuous
          across phase changes, no remount, no reset, no jolt. */}
      <motion.g
        id="back-wing"
        style={{
          transformBox: "view-box",
          transformOrigin: `${BACK_WING_PIVOT.x}px ${BACK_WING_PIVOT.y}px`,
          willChange: "transform",
          rotate: backRotMV,
          scale: backScaleMV,
        }}
      >
        <path
          d="M141.237 54.4618C142.837 29.2618 126.903 34.9618 118.737 40.9618C115.737 42.9231 112.737 42.4618 115.737 37.4618C118.737 29.4618 146.737 8.46182 152.237 40.9618C157.737 73.4618 122.737 95.9618 107.237 104.962C136.737 81.4618 140.237 63.9618 141.237 54.4618Z"
          fill={BUTTERFLY_FILL}
        />
      </motion.g>

      {/* Body, never animates. */}
      <g id="body">
        <path
          d="M144.237 88.4618C137.437 104.862 123.403 110.295 117.237 110.962C113.237 112.962 117.57 112.462 120.237 111.962C137.737 106.592 147.737 95.4618 148.237 89.9618C149.737 79.4618 146.237 83.9618 144.237 88.4618Z"
          fill={BUTTERFLY_FILL}
        />
        <path
          d="M143.237 106.962C139.237 114.962 121.237 115.295 112.737 114.462C108.237 114.462 112.737 115.962 114.737 116.222C138.237 118.496 145.737 110.462 146.737 108.962C150.237 101.701 144.237 104.962 143.237 106.962Z"
          fill={BUTTERFLY_FILL}
        />
        <path
          d="M97.2367 111.462C98.7367 107.962 106.237 109.462 105.237 112.962C102.933 120.258 98.908 118.307 96.9678 116.222C93.1989 116.482 76.2367 132.462 71.2367 133.462C66.2367 134.462 64.7367 132.962 66.2367 131.462C81.2367 115.962 94.7367 112.962 97.2367 111.462Z"
          fill={BUTTERFLY_FILL}
        />
      </g>

      {/* Front wing, dominant heart-shape + lower swoop animate as one
          group on top of the body. Same continuous-phase driver as the
          back wing, no remount on phase change. */}
      <motion.g
        id="front-wing"
        style={{
          transformBox: "view-box",
          transformOrigin: `${FRONT_WING_PIVOT.x}px ${FRONT_WING_PIVOT.y}px`,
          willChange: "transform",
          rotate: frontRotMV,
          scale: frontScaleMV,
        }}
      >
        <path
          d="M62.2367 52.9618C27.4367 39.7618 56.07 87.7952 74.7367 113.462C68.2367 110.462 46.7367 81.4618 40.7367 67.9618C27.7367 38.4618 39.2367 33.4618 53.7367 33.4618C63.7367 -32.5382 98.2367 14.4618 111.737 43.9618C122.537 67.5618 113.737 99.9935 93.2367 112.962C90.8002 114.503 86.7367 116.462 86.7367 116.462C117.237 85.9618 103.237 48.4618 89.7367 35.9618C76.2367 23.4618 65.7367 38.4618 62.2367 52.9618Z"
          fill={BUTTERFLY_FILL}
        />
        <path
          d="M20.7367 113.462C14.7367 84.2618 53.2367 103.295 73.2367 116.462C21.2367 90.4618 31.2367 111.962 32.7367 117.962C4.9515 130.407 32.7367 134.933 40.2367 134.462C59.7367 134.462 79.8944 119.883 80.7367 119.462C82.3367 118.662 83.4033 119.128 83.7367 119.462C73.7367 127.462 46.4367 142.562 17.2367 138.962C-19.2633 134.462 12.2367 116.962 20.7367 113.462Z"
          fill={BUTTERFLY_FILL}
        />
      </motion.g>

      {/* Pivot-point overlay (DEV only). Sits above everything and is
          NOT inside either rotating <g>, so the markers stay still while
          the wings rotate around them. */}
      {SHOW_PIVOTS ? (
        <>
          <PivotMarker
            x={FRONT_WING_PIVOT.x}
            y={FRONT_WING_PIVOT.y}
            color="#e11d48"
            label="F"
          />
          <PivotMarker
            x={BACK_WING_PIVOT.x}
            y={BACK_WING_PIVOT.y}
            color="#0ea5e9"
            label="B"
          />
        </>
      ) : null}
    </svg>
  );
}

/**
 * Crosshair marker rendered in SVG-viewBox space at the wing's current
 * pivot. The wing physically rotates around this point, so what you see
 * is the truth — if a marker isn't where you want the wing to hinge,
 * the numbers need to change.
 */
function PivotMarker({
  x,
  y,
  color,
  label,
}: {
  x: number;
  y: number;
  color: string;
  label: string;
}) {
  return (
    <g pointerEvents="none">
      {/* Crosshair lines extending ±12 units. Stroke thickness is tiny
          so it doesn't visually dominate the butterfly. */}
      <line x1={x - 12} y1={y} x2={x + 12} y2={y} stroke={color} strokeWidth={1.2} />
      <line x1={x} y1={y - 12} x2={x} y2={y + 12} stroke={color} strokeWidth={1.2} />
      <circle cx={x} cy={y} r={2.5} fill={color} />
      <text
        x={x + 5}
        y={y - 5}
        fill={color}
        fontSize={7}
        fontFamily="sans-serif"
        fontWeight={700}
      >
        {label}
      </text>
    </g>
  );
}
