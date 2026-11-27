// check-glyph-source.mjs (I-092, 2026-11-27): which font actually DRAWS each probed character a
// page shows: ← → ≈ ≥ ↗ ✓ π, the characters the Plex subsets were rebuilt to carry.
//
//   node scripts/check-glyph-source.mjs <origin> [--paths /,/cycles/dalio] [--json <file>]
//
// The computed font-family of "Details →" reads Plex whether or not the Plex file has the arrow,
// because CSS resolves a family list per element, and the browser falls back per GLYPH. So this
// asks Chromium (CDP CSS.getPlatformFontsForNode) for the fonts it used for each character: every
// visible probed character is wrapped in its own span, then each span's platform fonts are read.
// A character passes only when every font that drew it is a web font (isCustomFont) whose family
// name starts with --expect-family (default "IBM Plex"). The family test matters: isCustomFont is
// also true for another web font, and for a system face exposed through a CSS local() rule (Codex
// r1 on 2180e42), and next/font's generated fallback faces are local() faces.
//
// Exits: 0 PASS · 1 FAIL (a character drawn by anything else; a page that failed to load, landed
// on another path, or showed no probed character; a home page whose chart did not mount) ·
// 2 CANNOT JUDGE ("/" is not in --paths or not serving the design pass: data-design-variant is on
// the home masthead only, so the flag is judged there).
//
// Blind to: characters in states it does not open (tabs, a brushed range, hover, "Copied ✓"),
// characters outside its fixed list, SVG <text> (judged whole, so a system-font neighbour can fail
// a Plex arrow), browsers other than Chromium, and whether a face is the RIGHT one for the element
// (DESIGN.md, by hand), and whether a character's glyph is the RIGHT glyph (an → mapped to the ←
// outline still reads Plex: scripts/build_plex_subsets.py --check owns that). Wrapping a character in a span can change its shaping context (a new flex
// item inside a flex link; no kerning across the span edge); the Plex files have no kerning or
// substitution on the probed characters, so today that does not change which font draws them.
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const argv = process.argv.slice(2);
const origin = argv.find((a) => /^https?:\/\//.test(a));
const opt = (name) => {
  const i = argv.indexOf(name);
  return i > -1 ? argv[i + 1] : null;
};
if (!origin) {
  console.log("usage: node scripts/check-glyph-source.mjs <origin> [--paths /,/cycles/dalio] [--json <file>]");
  process.exit(2);
}
// /cycles/turchin carries ≈ in its rationale; /methods carries ≥ and the font-mono Δφ (not probed).
// "/?focus=dalio" opens the expanded facet, the only home state that shows "Details →".
const PATHS = (opt("--paths") ?? "/,/?focus=dalio,/cycles/dalio,/cycles/turchin,/cycles,/methods").split(",");
const EXPECT = opt("--expect-family") ?? "IBM Plex";
// Git Bash rewrites an argument that starts with "/" into a Windows path ("/" became
// "C:/Program Files/Git/" on 2026-11-27). Refuse rather than probe a host that does not exist.
const badPath = PATHS.find((p) => !p.startsWith("/") || /^[A-Za-z]:/.test(p));
if (badPath) {
  console.log(`RESULT: CANNOT JUDGE — path ${JSON.stringify(badPath)} is not a site path (a shell rewrote it? from Git Bash, set MSYS_NO_PATHCONV=1 or run from PowerShell) (exit 2)`);
  process.exit(2);
}
const VIEWPORTS = [
  [1280, 900],
  [390, 664],
];

// Runs in the page: wrap every visible probed character in its own span; return what was wrapped.
function wrapArrows() {
  const ARROW = /[←→≈≥↗✓π]/;
  const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || skip.has(el.tagName) || !ARROW.test(n.data)) continue;
    if (!el.getClientRects().length || !el.checkVisibility({ visibilityProperty: true, opacityProperty: false })) continue;
    nodes.push(n);
  }
  const out = [];
  for (const n of nodes) {
    const el = n.parentElement;
    const context = (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 60);
    // The element's own first family: a system font under a Plex element is a missing glyph in
    // the subset; under a Geist element it is a face that page has not moved into the pass yet.
    const face = getComputedStyle(el).fontFamily.split(",")[0].trim();
    if (el.namespaceURI === "http://www.w3.org/2000/svg") {
      el.setAttribute("data-arrow-probe", String(out.length));
      out.push({ context, face, svgWhole: true });
      continue;
    }
    let node = n;
    for (;;) {
      const i = node.data.search(ARROW);
      if (i < 0) break;
      const arrowNode = node.splitText(i);
      node = arrowNode.splitText(1);
      const span = document.createElement("span");
      span.setAttribute("data-arrow-probe", String(out.length));
      arrowNode.replaceWith(span);
      span.appendChild(arrowNode);
      out.push({ context, face, char: arrowNode.data, svgWhole: false });
    }
  }
  return out;
}

const report = { origin, at: new Date().toISOString(), pages: [] };
let failed = 0;
let probed = 0;
let notPass = 0;
const browser = await chromium.launch();
try {
  for (const [w, h] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    for (const path of PATHS) {
      const page = await ctx.newPage();
      const key = `${w}x${h} ${path}`;
      try {
        const res = await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
        if (!res || !res.ok()) throw new Error(`HTTP ${res ? res.status() : "no response"}`);
        // A redirect would measure another page under this one's label (Codex r2).
        const wanted = new URL(path, origin).pathname;
        const landed = new URL(page.url()).pathname;
        if (landed !== wanted) throw new Error(`landed on ${landed}, not ${wanted}`);
        const isHome = wanted === "/";
        // The home chart (and its "← drag to zoom →") renders client-side; on "/" a chart that
        // never mounts is a failure, not a quiet page with fewer characters.
        // One selector per viewport, as run-home-chart.mjs does: a comma list waits on the FIRST
        // match in document order, which at desktop width is the hidden phone overview.
        const chart = w < 640 ? "[data-overview-id] svg" : "[data-facet-id] svg";
        const mounted = await page
          .waitForSelector(chart, { timeout: isHome ? 20000 : 8000 })
          .then(() => true, () => false);
        if (isHome && !mounted) throw new Error("the home chart did not mount");
        await page.evaluate(() => document.fonts.ready);
        const variant = await page.evaluate(() => document.querySelector("[data-design-variant]")?.getAttribute("data-design-variant") ?? null);
        // The flag's served marker is on the home masthead only, so "/" is where it is judged.
        if (isHome && variant !== "a") notPass += 1;
        const wrapped = await page.evaluate(wrapArrows);
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("DOM.enable");
        await cdp.send("CSS.enable");
        const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
        const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "[data-arrow-probe]" });
        const arrows = [];
        for (const nodeId of nodeIds) {
          const attrs = (await cdp.send("DOM.getAttributes", { nodeId })).attributes;
          const idx = Number(attrs[attrs.indexOf("data-arrow-probe") + 1]);
          const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
          const ok = fonts.length > 0 && fonts.every((f) => f.isCustomFont && f.familyName.startsWith(EXPECT));
          if (!ok) failed += 1;
          probed += 1;
          arrows.push({ ...wrapped[idx], ok, fonts: fonts.map((f) => `${f.familyName}${f.isCustomFont ? " (web)" : " (SYSTEM)"} x${f.glyphCount}`) });
        }
        // Every requested page must show at least one probed character: a path is asked for
        // because it carries some, so an empty page is a page that did not render (Codex r2).
        if (arrows.length === 0) {
          failed += 1;
          console.log(`${key}: BAD no probed character on this page`);
        }
        report.pages.push({ key, variant, arrows });
        console.log(`${key}: variant ${JSON.stringify(variant)}, ${arrows.length} arrow(s)`);
        for (const a of arrows) console.log(`  ${a.ok ? "OK  " : "BAD "} ${JSON.stringify(a.char ?? "svg")} in "${a.context}" [element face ${a.face}] <- ${a.fonts.join(", ") || "no font reported"}`);
      } catch (e) {
        failed += 1;
        report.pages.push({ key, error: String(e.message ?? e) });
        console.log(`${key}: BAD ${e.message ?? e}`);
      } finally {
        await page.close();
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
const jsonOut = opt("--json");
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(report, null, 2));
console.log(`population: ${PATHS.length} path(s) x ${VIEWPORTS.length} viewport(s) on ${origin}; ${probed} visible arrow(s) probed`);
if (failed) {
  console.log(`RESULT: FAIL — ${failed} character(s) or page(s) not drawn by a "${EXPECT}" web font (exit 1)`);
  process.exit(1);
}
if (!probed || notPass || !PATHS.includes("/")) {
  console.log(`RESULT: CANNOT JUDGE — ${probed} character(s) probed; "/" ${PATHS.includes("/") ? `not serving variant "a" on ${notPass} viewport(s)` : "not in --paths, so the flag was not judged"} (exit 2)`);
  process.exit(2);
}
console.log(`RESULT: PASS — ${probed} character(s), every one drawn by a "${EXPECT}" web font (exit 0)`);
