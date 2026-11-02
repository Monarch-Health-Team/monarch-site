import { chromium } from "@playwright/test";
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
for (const w of [375, 768, 1024, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto("http://127.0.0.1:3200/");
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, h1: document.querySelectorAll("h1").length, h1h: document.querySelector("h1").getBoundingClientRect().height }));
  console.log(w, JSON.stringify(r));
  await p.screenshot({ path: `/tmp/s${w}.png`, clip: { x: 0, y: 0, width: w, height: 2400 }, fullPage: true });
}
await b.close();
