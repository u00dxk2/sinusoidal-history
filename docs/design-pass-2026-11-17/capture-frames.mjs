// Design and copy pass, 2026-11-17 (round 2): every frame for one step, in ONE browser run.
//
//   node docs/design-pass-2026-11-17/capture-frames.mjs <before|after> [--base <origin>] [--query <string>]
//
// One heavy-gate admit per step (the brief's capacity amendments), so this takes all of a
// step's frames at once. Frames are the FIRST VIEWPORT (fullPage false), as PNG, at the
// brief's two sizes: 1440x900 and 390x844. Before and after use this same script, so the
// viewport, the scale and the settle wait cannot differ between them.
//
// Note 390x844 is the size the brief sets for every lane. This repo's own fold checks use
// 390x664 (what an iPhone 14 shows in Safari, see scripts/measure-fold.mjs); those stay the
// gate for anything about the fold. These frames are for the before/after comparison only.
//
// --query appends a query string to every page URL (the P3 variant flag, for "after").
// Logged out by construction: the site has no sign-in.
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const step = args[0];
// before        the live site, taken at P1 (the record)
// before-local  the SAME local build path as `after`, with the flag off: the like-for-like
//               partner of `after` for a side-by-side review
// after         the local build with the selected variant's flag on
// live          production after the rollout turned the flag on (round 3)
if (step !== "before" && step !== "before-local" && step !== "after" && step !== "live") {
  console.error("usage: capture-frames.mjs <before|after> [--base <origin>] [--query <string>]");
  process.exit(2);
}
const flag = (name, fallback) => {
  const at = args.indexOf(name);
  return at >= 0 && args[at + 1] ? args[at + 1] : fallback;
};
const base = flag("--base", "https://sinusoidalhistory.com").replace(/\/+$/, "");
const query = flag("--query", "");

// The four frames the brief requires come first; the last two pages are the flow's
// empty state (a cycle with no paired record) and the site's error state (a 404).
const PAGES = [
  { name: "home", path: "/" },
  { name: "flow-cycle-dalio", path: "/cycles/dalio" },
  { name: "empty-cycle-no-record", path: "/cycles/turchin-fathers-sons" },
  { name: "error-not-found", path: "/cycles/no-such-cycle" },
];
const SIZES = [
  { name: "1440", width: 1440, height: 900, scale: 1 },
  { name: "390", width: 390, height: 844, scale: 2 },
];

const outDir = join(here, step);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
let failed = 0;
try {
  for (const size of SIZES) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: size.scale,
    });
    const page = await context.newPage();
    for (const target of PAGES) {
      const url = `${base}${target.path}${query ? `?${query.replace(/^\?/, "")}` : ""}`;
      const out = join(outDir, `${target.name}-${size.name}.png`);
      try {
        const response = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
        // CSV fetches and the client chart settle; the same beat scripts/capture-frame.mjs uses.
        await page.waitForTimeout(800);
        await page.screenshot({ path: out, fullPage: false });
        console.log(`OK   ${target.name}-${size.name}.png  <-  ${url}  (HTTP ${response?.status() ?? "?"}, ${size.width}x${size.height})`);
      } catch (error) {
        failed += 1;
        console.log(`FAIL ${target.name}-${size.name}.png  <-  ${url}  (${error instanceof Error ? error.name : "error"})`);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`RESULT: ${failed === 0 ? "PASS" : "FAIL"} — ${PAGES.length * SIZES.length - failed} of ${PAGES.length * SIZES.length} frames written to ${outDir}`);
process.exit(failed === 0 ? 0 : 1);
