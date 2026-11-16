// The focused cycle card on the Facets tab: can a phone reader see the curve move while dragging?
//
//   node scripts/check-focused-calibrate.mjs [origin] [--frames <dir>]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// For each paired cycle at /?focus=<id> (Facets tab), at 390x664, 320x568 and 1280x800:
//   1. order: the Calibrate block comes BEFORE the "Peak calibration" text in the DOM (the block is
//      moved in the DOM, never with CSS order, so reading and focus order match what is seen);
//   2. span: the chart's top and the peak slider's bottom fit one screen (the measure
//      check-calibrate-tab.mjs takes on the Calibrate tab);
//   3. drag: with the slider scrolled into view and a real pointer held down mid-drag, the chart's
//      top is still inside the viewport AND the drawn curve differs from before the drag.
// --frames <dir> saves a before and a mid-drag screenshot per cycle and size, for a person to read.
// Written 2026-11-16 (the 11-15 journey walk's top finding). Red arm: production 697d6d0f/980737c,
// where the description and a ~20-line peak-calibration paragraph sat between chart and sliders
// (phone spans 686-1071px, measured at P1). It checks that the drag is VISIBLE; whether a reader
// understands it is a walk's job. Not seen: touch events (a mouse pointer drives the drag), and
// the Calibrate tab (check-calibrate-tab.mjs covers it).
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const fi = args.indexOf("--frames");
const framesDir = fi >= 0 ? args[fi + 1] : null;
const origin = (args.find((a, i) => !a.startsWith("--") && i !== fi + 1) ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
if (framesDir) mkdirSync(framesDir, { recursive: true });

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cycles = JSON.parse(readFileSync(join(root, "src/data/cycles.json"), "utf8"));
const series = JSON.parse(readFileSync(join(root, "src/data/series.json"), "utf8"));
const pairedIds = new Set(series.map((s) => s.associated_cycle_id));
const paired = cycles.filter((c) => pairedIds.has(c.id)).map((c) => c.id);
if (paired.length === 0) {
  console.log("FAIL  no paired cycles found in src/data — nothing to check");
  process.exit(3);
}

const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const browser = await chromium.launch();
for (const [w, h] of [[390, 664], [320, 568], [1280, 800]]) {
  const tag = `${w}x${h}`;
  for (const id of paired) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto(`${origin}/?focus=${id}`, { waitUntil: "load" });
    const facet = page.locator(`[data-facet-id="${id}"]`).first();
    const svg = facet.locator('svg[role="img"]').first();
    const slider = facet.locator('[role="slider"]').first();
    try {
      await svg.waitFor({ timeout: 15000 });
      await slider.waitFor({ timeout: 15000 });
    } catch {
      check(`${tag} ${id}: focused card rendered`, false, "chart or slider never appeared");
      await page.close();
      continue;
    }
    await page.waitForTimeout(800); // the paired CSV

    const order = await facet.evaluate((el) => {
      const find = (re) => [...el.querySelectorAll("span")].find((s) => re.test(s.textContent.trim()));
      const cal = find(/^Calibrate$/i);
      const peak = find(/^Peak calibration/i);
      if (!cal || !peak) return `missing ${!cal ? "Calibrate" : ""} ${!peak ? "Peak calibration" : ""}`.trim();
      return cal.compareDocumentPosition(peak) & Node.DOCUMENT_POSITION_FOLLOWING ? "calibrate-first" : "text-first";
    });
    check(`${tag} ${id}: Calibrate precedes the peak-calibration text in the DOM`, order === "calibrate-first", order);

    const sb = await svg.boundingBox();
    const lb = await slider.boundingBox();
    const span = Math.round(lb.y + lb.height - sb.y);
    check(`${tag} ${id}: chart top + peak slider fit one screen`, span <= h, `span=${span}px of ${h}`);

    // A reader scrolls until the slider is reachable, then drags it. Put the chart's top at the
    // top of the screen (as far as the page allows), which is the most favourable reading.
    await svg.evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(300);
    const paths = async () =>
      (await svg.locator("path").evaluateAll((ps) => ps.map((p) => p.getAttribute("d") ?? ""))).join("|");
    const d0 = await paths();
    if (framesDir) await page.screenshot({ path: join(framesDir, `${tag}-${id}-before.png`) });
    const thumb = await slider.boundingBox();
    const track = await facet.locator('[data-slot="slider-track"]').first().boundingBox();
    track.right = track.x + track.width;
    const cx = thumb.x + thumb.width / 2;
    const cy = thumb.y + thumb.height / 2;
    const tx = Math.min(track.right - 2, cx + (track.right - cx) * 0.6);
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(tx, cy, { steps: 8 });
    await page.waitForTimeout(250);
    const mid = await svg.boundingBox();
    const moved = (await paths()) !== d0;
    if (framesDir) await page.screenshot({ path: join(framesDir, `${tag}-${id}-mid-drag.png`) });
    await page.mouse.up();
    const thumbMid = await slider.boundingBox();
    check(
      `${tag} ${id}: mid-drag, the curve is on screen and has moved`,
      // -1px: scrollIntoView can leave the chart's top a sub-pixel above 0 (it read -0.x on 4 of
      // 81 legs locally); a pixel is not "off screen".
      moved && mid.y >= -1 && mid.y < h && thumbMid.y + thumbMid.height <= h,
      `chart top ${mid.y.toFixed(2)}, slider bottom ${Math.round(thumbMid.y + thumbMid.height)} of ${h}, curve ${moved ? "moved" : "unchanged"}`,
    );
    await page.close();
  }
}
await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(`${results.length - failed}/${results.length} PASS (${paired.length} paired cycles)`);
process.exit(failed ? 3 : 0);
