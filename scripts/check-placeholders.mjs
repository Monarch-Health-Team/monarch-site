#!/usr/bin/env node
/*
 * Placeholder guard (v2 P0-1). Runs after `next build` as part of
 * `pnpm check` and fails if any prerendered page shows bracketed
 * placeholder text, a "Julia" / "to come" note, a draft tag or a
 * data-placeholder marker.
 *
 * It reads the static HTML in .next/server/app, removes <script>, <style>
 * and <template> blocks (the RSC payload repeats the copy inside JSON
 * arrays) and the tags themselves, then scans the visible text.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(process.cwd(), ".next", "server", "app");

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const RULES = [
  // Any bracketed text with letters in it, e.g. "[Answer to come]" or "[Julia to finalize wording]".
  { name: "bracketed text", re: /\[[^\]\n]*[A-Za-z][^\]\n]*\]/g },
  { name: "“to come” note", re: /\bto come\s*[:.\]]/gi },
  { name: "Julia note or draft tag", re: /\bJulia\b|Draft,|\bDRAFT\b|Copy pending|to confirm\)/g },
  { name: "unwritten role line", re: /Short line on their role/g },
];

let files;
try {
  files = htmlFiles(ROOT);
} catch {
  console.error(`check-placeholders: ${relative(process.cwd(), ROOT)} not found. Run \`next build\` first.`);
  process.exit(1);
}
if (files.length === 0) {
  console.error("check-placeholders: no prerendered HTML found.");
  process.exit(1);
}

const problems = [];
for (const file of files) {
  const raw = readFileSync(file, "utf8");
  if (/data-placeholder=/.test(raw)) problems.push([file, "data-placeholder attribute", "data-placeholder"]);
  const text = decode(
    raw
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<template\b[\s\S]*?<\/template>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  ).replace(/\s+/g, " ");
  for (const { name, re } of RULES) {
    for (const m of text.matchAll(re)) {
      const at = m.index ?? 0;
      problems.push([file, name, text.slice(Math.max(0, at - 40), at + m[0].length + 40).trim()]);
    }
  }
}

if (problems.length > 0) {
  console.error(`check-placeholders: ${problems.length} placeholder(s) found in rendered pages:`);
  for (const [file, name, snippet] of problems) {
    console.error(`  ${relative(process.cwd(), file)}: ${name}: “${snippet}”`);
  }
  process.exit(1);
}
console.log(`check-placeholders: ${files.length} pages scanned, no placeholder text.`);
