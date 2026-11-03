// Mobile drawer at 375px: opens and is on screen, has an opaque panel, traps focus,
// and closes with Escape, the close button and a click on the overlay. Its links are checked too.
import { test, expect, type Locator, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { checkExpected, collectLinks, LinkChecker, loadConfig, OUT, Report } from "./lib";

const TOGGLE = "header button[aria-controls], header button[aria-expanded], button[aria-controls][aria-expanded]";
const CLOSE = 'button[aria-label*="close" i], button:has-text("Close"), [data-drawer-close]';

async function onScreenRatio(page: Page, el: Locator) {
  const box = await el.boundingBox().catch(() => null);
  if (!box || box.width === 0 || box.height === 0) return 0;
  const vp = page.viewportSize()!;
  const w = Math.max(0, Math.min(box.x + box.width, vp.width) - Math.max(box.x, 0));
  const h = Math.max(0, Math.min(box.y + box.height, vp.height) - Math.max(box.y, 0));
  return (w * h) / Math.min(box.width * box.height, vp.width * vp.height);
}

async function waitClosed(page: Page, panel: Locator, ms = 1500) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (!(await panel.isVisible().catch(() => false)) || (await onScreenRatio(page, panel)) < 0.05) return true;
    await page.waitForTimeout(100);
  }
  return false;
}

test("mobile drawer opens, is opaque, traps focus and closes @375", async ({ page, request, baseURL }) => {
  const cfg = loadConfig();
  const d = cfg.drawer;
  const rep = new Report("drawer");
  await page.setViewportSize({ width: d.width, height: 812 });
  await page.goto(d.path, { waitUntil: "load" });

  const toggle = page.locator(d.toggle || TOGGLE).filter({ visible: true }).first();
  if ((await toggle.count()) === 0) {
    if (d.required) rep.fail(`no visible menu button at ${d.width}px on ${d.path} (selector: ${d.toggle || TOGGLE}).`);
    else rep.warn(`no menu button found at ${d.width}px on ${d.path}; drawer checks skipped. Set e2e.drawer.required in .github/qa.config.json to make this a failure.`);
    rep.write();
    expect(rep.problems, rep.problems.join("\n")).toEqual([]);
    return;
  }

  const controls = await toggle.getAttribute("aria-controls");
  const panelFor = () =>
    d.panel ? page.locator(d.panel).first()
    : controls ? page.locator(`[id="${controls}"]`)
    : page.locator('[role="dialog"], [aria-modal="true"]').filter({ visible: true }).first();

  const open = async (why: string) => {
    await toggle.click();
    const panel = panelFor();
    try { await panel.waitFor({ state: "visible", timeout: 2000 }); } catch {
      rep.fail(`clicking the menu button (${why}) did not show the drawer${controls ? ` #${controls}` : ""}.`);
      return null;
    }
    await page.waitForTimeout(500); // let slide-in transitions finish
    return panel;
  };

  // 1. Opens, on screen, expanded state.
  const panel = await open("first open");
  if (!panel) { rep.write(); expect(rep.problems, rep.problems.join("\n")).toEqual([]); return; }
  const ratio = await onScreenRatio(page, panel);
  if (ratio < 0.9) rep.fail(`drawer opened but only ${Math.round(ratio * 100)}% of it is on screen at ${d.width}px (it may slide in from the wrong side or off-screen).`);
  if ((await toggle.getAttribute("aria-expanded")) === "false") rep.fail(`menu button still says aria-expanded="false" while the drawer is open.`);
  const box = (await panel.boundingBox())!;
  const vw = d.width;
  const side = box.width >= vw - 2 ? "full width" : box.x <= 2 ? "left" : box.x + box.width >= vw - 2 ? "right" : "middle";
  if (d.side && d.side !== side && !(side === "full width" && (d.side === "top" || d.side === "bottom")))
    rep.fail(`drawer is anchored ${side}, but .github/qa.config.json (e2e) expects ${d.side}.`);

  // 2. Opaque panel: the panel, or a child covering >=90% of it, needs a fully opaque background.
  const bg = await panel.evaluate((el) => {
    const alpha = (c: string) => {
      if (c === "transparent") return 0;
      const m = c.match(/rgba?\(([^)]+)\)/) || c.match(/color\(srgb ([^)]+)\)/);
      if (!m) return 1;
      const parts = m[1].split(/[\s,\/]+/).filter(Boolean);
      return parts.length >= 4 ? parseFloat(parts[3]) : 1;
    };
    const r = el.getBoundingClientRect();
    const cands = [el, ...Array.from(el.querySelectorAll<HTMLElement>("*")).slice(0, 50)];
    for (const c of cands) {
      const cr = c.getBoundingClientRect();
      if (cr.width * cr.height < 0.9 * r.width * r.height) continue;
      const cs = getComputedStyle(c);
      if (alpha(cs.backgroundColor) >= 0.99 || (cs.backgroundImage !== "none" && !cs.backgroundImage.includes("rgba"))) return { ok: true, color: cs.backgroundColor };
    }
    return { ok: false, color: getComputedStyle(el).backgroundColor };
  });
  if (!bg.ok) rep.fail(`drawer panel background is not opaque (computed ${bg.color}); page content shows through.`);

  // 2b. Content must sit inside the panel's own box. If the panel collapses (for example a position:fixed
  // drawer inside a header with backdrop-filter or transform, which becomes its containing block), the links
  // spill out over the page with no background behind them even though the panel colour itself is opaque.
  const spill = await panel.evaluate((el) => {
    const r = el.getBoundingClientRect();
    let bottom = r.bottom, right = r.right, left = r.left;
    for (const c of Array.from(el.querySelectorAll<HTMLElement>("a, button, li, p, h2, h3, img, svg"))) {
      const cr = c.getBoundingClientRect();
      if (cr.width === 0 || cr.height === 0) continue;
      bottom = Math.max(bottom, cr.bottom); right = Math.max(right, cr.right); left = Math.min(left, cr.left);
    }
    const anc: string[] = [];
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.transform !== "none" || cs.backdropFilter !== "none" || cs.filter !== "none" || /paint|layout|strict|content/.test(cs.contain))
        anc.push(`<${a.tagName.toLowerCase()}> (${cs.backdropFilter !== "none" ? "backdrop-filter" : cs.transform !== "none" ? "transform" : cs.filter !== "none" ? "filter" : "contain"})`);
    }
    return { w: Math.round(r.width), h: Math.round(r.height), over: Math.round(Math.max(bottom - r.bottom, right - r.right, r.left - left)), anc };
  });
  if (spill.over > 4)
    rep.fail(`drawer panel is only ${spill.w}x${spill.h}px but its content runs ${spill.over}px past it, so the menu shows over the page with no background` +
      (spill.anc.length ? `. Likely cause: ${spill.anc.join(", ")} is an ancestor, which traps position:fixed inside it; render the drawer outside it (e.g. a portal to <body>) or drop that style.` : "."));
  else if ((side === "left" || side === "right") && spill.h < 0.9 * 812)
    rep.warn(`side drawer is only ${spill.h}px tall on an 812px screen.`);

  // Screenshot of the open drawer for the reviewer.
  const shots = path.join(OUT, "screenshots", String(d.width));
  fs.mkdirSync(shots, { recursive: true });
  await page.screenshot({ path: path.join(shots, "_drawer-open.png") });

  // 3. Focus trap: Tab and Shift+Tab never leave the panel.
  const inPanel = () => panel.evaluate((el) => el.contains(document.activeElement));
  const n = await panel.locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').count();
  if (!(await inPanel())) rep.warn(`focus did not move into the drawer when it opened.`);
  let escaped = "";
  for (const key of ["Tab", "Shift+Tab"]) {
    for (let i = 0; i < n + 2 && !escaped; i++) {
      await page.keyboard.press(key);
      if (!(await inPanel())) {
        escaped = `${key} #${i + 1} moved focus to ${await page.evaluate(() => { const a = document.activeElement as HTMLElement | null; return a ? `${a.tagName.toLowerCase()}${a.id ? "#" + a.id : ""} "${(a.innerText || a.getAttribute("aria-label") || "").trim().slice(0, 40)}"` : "nothing"; })}`;
      }
    }
  }
  if (escaped) rep.fail(`focus is not trapped in the open drawer: ${escaped}.`);

  // 4. Links inside the drawer.
  const drawerLinks = await collectLinks(panel, "a[href]", "drawer", d.path);
  const checker = new LinkChecker(baseURL!, request, page, rep);
  for (const l of drawerLinks) await checker.check(l);
  checkExpected(drawerLinks, baseURL!, rep, ["drawer"]);

  // 5. Escape closes it, and focus goes back to the menu button.
  await page.keyboard.press("Escape");
  if (!(await waitClosed(page, panel))) rep.fail(`Escape does not close the drawer.`);
  else if (!(await toggle.evaluate((el) => el === document.activeElement))) rep.warn(`after Escape, focus did not return to the menu button.`);
  if (!(await waitClosed(page, panel, 100))) { await page.reload(); }

  // 6. Close button closes it.
  const p2 = await open("for close button");
  if (p2) {
    const closeBtn = p2.locator(d.close || CLOSE).filter({ visible: true }).first();
    if ((await closeBtn.count()) === 0) rep.fail(`no visible close button inside the drawer (selector: ${d.close || CLOSE}).`);
    else {
      await closeBtn.click();
      if (!(await waitClosed(page, p2))) rep.fail(`the drawer's close button does not close it.`);
    }
    if (!(await waitClosed(page, p2, 100))) await page.reload();
  }

  // 7. A click on the overlay (outside the panel) closes it.
  const p3 = await open("for overlay click");
  if (p3) {
    const b = (await p3.boundingBox())!;
    const vh = 812;
    const pt = b.x + b.width < vw - 24 ? { x: vw - 12, y: vh / 2 }
      : b.x > 24 ? { x: 12, y: vh / 2 }
      : b.y + b.height < vh - 24 ? { x: vw / 2, y: vh - 12 } : null;
    if (!pt) rep.warn(`drawer covers the whole screen, so there is no overlay to click; overlay check skipped.`);
    else {
      await page.mouse.click(pt.x, pt.y);
      if (!(await waitClosed(page, p3))) rep.fail(`clicking the overlay at (${pt.x}, ${pt.y}) outside the drawer does not close it.`);
    }
  }

  rep.write();
  expect(rep.problems, rep.problems.join("\n")).toEqual([]);
});
