import { SOFT_LAUNCH_ON, PREVIEW_BANNER_TEXT } from "@/lib/soft-launch";

/**
 * The soft-launch preview banner (docs/changes/soft-launch-switch). Rendered
 * by app/layout.tsx above the header; null unless NEXT_PUBLIC_SOFT_LAUNCH is
 * "on". One line of plain text: no link, button, icon or close control, no
 * state, not sticky, not a live region. It scrolls away with the page, so
 * the header's scroll-padding-top and tests/focus-obscured.mjs stay right.
 */
export function PreviewBanner() {
  if (!SOFT_LAUNCH_ON) return null;
  return (
    <aside
      id="preview-notice"
      aria-label="Preview notice"
      className="bg-navy-100 text-navy-900"
    >
      <p className="container-page py-2.5 text-center text-body">
        {PREVIEW_BANNER_TEXT}
      </p>
    </aside>
  );
}
