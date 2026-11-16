// The focused cycle card on the Facets tab: can a phone reader see the curve move while dragging?
//
//   node scripts/check-focused-calibrate.mjs [origin] [--frames <dir>]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// For each paired cycle at /?focus=<id> (Facets tab), at 390x664, 320x568 and 1280x800:
//   1. order: both sliders come BEFORE the description and the "Peak calibration" text in the DOM,
//      and are painted above them (phone) or to their left (desktop), so reading and focus order
//      match what is seen (the block moves in the DOM, never with CSS order);
//   2. span: the chart's top and the peak slider's bottom fit one screen (the measure
//      check-calibrate-tab.mjs takes on the Calibrate tab);
//   3. drag: the "Reference peak year" slider (found by its label) is dragged with a real pointer;
//      while it is held, the chart's top and the slider are inside the viewport AND the theory
//      curve (data-curve="theory", never the late-loading data path) differs from before.
// Hardened after Codex r1 on 35b22e6 (6 findings, all in this checker and its test). Not seen:
// paint (a zero-opacity or clipped curve passes; the frames are the person's read), touch input.
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

// Codex r1 #1/#6: parse positionally so an origin alone is honoured, and refuse a bare --frames.
const args = process.argv.slice(2);
let framesDir = null;
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--frames") {
    framesDir = args[++i];
    if (!framesDir || framesDir.startsWith("--")) {
      console.error("check-focused-calibrate: --frames needs a directory");
      process.exit(2);
    }
  } else if (args[i].startsWith("--")) {
    console.error(`check-focused-calibrate: unknown flag ${args[i]}`);
    process.exit(2);
  } else positional.push(args[i]);
}
if (positional.length > 1) {
  console.error(`check-focused-calibrate: one origin only, got ${positional.join(" ")}`);
  process.exit(2);
}
const origin = (positional[0] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
console.log(`origin ${origin}${framesDir ? ` · frames ${framesDir}` : ""}`);
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
    // Codex r1 #3: the PEAK slider by its label, never "the first slider".
    const slider = facet.getByRole("slider", { name: "Reference peak year" });
    try {
      await svg.waitFor({ timeout: 15000 });
      await slider.waitFor({ timeout: 15000 });
    } catch {
      check(`${tag} ${id}: focused card rendered`, false, "chart or slider never appeared");
      await page.close();
      continue;
    }
    await page.waitForTimeout(800); // the paired CSV

    // Codex r1 #5: BOTH sliders must precede the rationale and the description, and the reading
    // order must match the painted order (a slider above the rationale on screen too).
    const order = await facet.evaluate((el) => {
      const sliders = [...el.querySelectorAll('[role="slider"]')];
      const peak = [...el.querySelectorAll("span")].find((s) => /^Peak calibration/i.test(s.textContent.trim()));
      const desc = el.querySelector("p.font-display-italic");
      if (sliders.length !== 2 || !peak || !desc) return `missing: sliders=${sliders.length} peak=${!!peak} desc=${!!desc}`;
      const before = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      const domOk = sliders.every((s) => before(s, peak) && before(s, desc));
      const lastSlider = sliders[1].getBoundingClientRect();
      const top = Math.min(peak.getBoundingClientRect().top, desc.getBoundingClientRect().top);
      // On a one-column phone the rationale is painted BELOW the sliders; in desktop's two columns
      // it sits beside them, to the right.
      const paintOk = lastSlider.bottom <= top || lastSlider.right <= desc.getBoundingClientRect().left;
      return domOk && paintOk ? "sliders-first" : `dom ${domOk ? "ok" : "rationale-first"} · paint ${paintOk ? "ok" : "rationale-first"}`;
    });
    check(`${tag} ${id}: both sliders precede the description and peak-calibration text (DOM and paint)`, order === "sliders-first", order);

    const sb = await svg.boundingBox();
    const lb = await slider.boundingBox();
    const span = Math.round(lb.y + lb.height - sb.y);
    check(`${tag} ${id}: chart top + peak slider fit one screen`, span <= h, `span=${span}px of ${h}`);

    // A reader scrolls until the slider is reachable, then drags it. Put the chart's top at the
    // top of the screen (as far as the page allows), which is the most favourable reading.
    await svg.evaluate((el) => el.scrollIntoView({ block: "start" }));
    await page.waitForTimeout(300);
    // Codex r1 #2: the THEORY curve only, so a late-loading data path cannot read as a move.
    const theory = svg.locator('[data-curve="theory"]');
    if ((await theory.count()) !== 1) {
      check(`${tag} ${id}: exactly one theory curve in the chart`, false, `count=${await theory.count()}`);
      await page.close();
      continue;
    }
    const paths = async () => (await theory.getAttribute("d")) ?? "";
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
    // Codex r1 #4: every box is read while the pointer is still down, in the captured state.
    const mid = await svg.boundingBox();
    const thumbMid = await slider.boundingBox();
    const moved = (await paths()) !== d0;
    if (framesDir) await page.screenshot({ path: join(framesDir, `${tag}-${id}-mid-drag.png`) });
    await page.mouse.up();
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
