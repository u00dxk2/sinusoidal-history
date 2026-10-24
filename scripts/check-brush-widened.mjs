// I-062 drag read: drag 2000->2030 on the range strip and read what the strip says (2026-10-22).
// Usage: node scripts/check-brush-widened.mjs <origin> [WxH] [--preset-return]
// Exit 0 PASS, 3 RED. Red arm on record: production 5274fce7 read "0 of 2" (before the note shipped).
// I-064 (2026-10-24) adds, with --preset-return: the status under the strip names the Modern
// window after a short drag, the strip's page top moves 0px, and a pan inside the box says it moved.
import { chromium } from "file:///C:/dev/skylark/sinusoidal-cycles/node_modules/playwright/index.mjs";

const origin = process.argv[2] || "https://sinusoidalhistory.com";
const [vw, vh] = (process.argv[3] || "390x664").split("x").map(Number);
const browser = await chromium.launch();
const out = [];
try {
  for (const mode of ["mouse", "touch"]) {
    const ctx = await browser.newContext({
      viewport: { width: vw, height: vh },
      deviceScaleFactor: 2,
      isMobile: mode === "touch",
      hasTouch: mode === "touch",
    });
    const page = await ctx.newPage();
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    const svg = page.locator('svg[aria-label^="Time range selector"]');
    await svg.scrollIntoViewIfNeeded();
    const box = await svg.boundingBox();
    // I-064: the strip's top in PAGE coordinates, so a scroll is not read as a shift.
    const pageTop = () => svg.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const top0 = await pageTop();
    const inner = box.width - 8;
    const xOf = (y) => box.x + 4 + ((y - 1600) / 450) * inner;
    const yMid = box.y + box.height / 2;
    if (mode === "mouse") {
      await page.mouse.move(xOf(2000), yMid);
      await page.mouse.down();
      await page.mouse.move(xOf(2015), yMid, { steps: 5 });
      await page.mouse.move(xOf(2030), yMid, { steps: 5 });
      await page.mouse.up();
    } else {
      const cdp = await ctx.newCDPSession(page);
      const pt = (x) => [{ x, y: yMid, id: 1 }];
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: pt(xOf(2000)) });
      for (const y of [2005, 2010, 2015, 2020, 2025, 2030]) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pt(xOf(y)) });
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    }
    await page.waitForTimeout(600);
    const showing = (await page.locator("text=showing").first().innerText()).trim();
    const noteLoc = page.locator("[data-brush-widened]");
    const note = (await noteLoc.count()) ? (await noteLoc.first().innerText()).trim() : null;
    const visible = note ? await noteLoc.first().isVisible() : false;
    const statusLoc = page.locator("[data-brush-status]");
    const status = (await statusLoc.count()) ? (await statusLoc.first().innerText()).trim() : null;
    const shift = Math.round((await pageTop()) - top0);
    await page.screenshot({ path: `C:/dev/skylark/sinusoidal-cycles/tmp/i062-${mode}-${vw}.png`, clip: { x: 0, y: Math.max(0, box.y - 120), width: vw, height: 260 } });
    out.push({ mode, showing, note, visible, status, shift });
    if (mode === "mouse" && process.argv[4] === "--preset-return") {
      // r2: a press inside the selection that moves nothing must leave the note standing.
      // Re-measure: the note's own line moved the strip down after the first drag.
      const b2 = await svg.boundingBox();
      const pressX = b2.x + 4 + ((1975 - 1600) / 450) * (b2.width - 8);
      const pressY = b2.y + b2.height / 2;
      const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.getAttribute("class") || document.elementFromPoint(x, y)?.tagName, [pressX, pressY]);
      out.push({ mode: "noop-press-target", hit });
      await page.mouse.move(pressX, pressY);
      await page.mouse.down();
      await page.mouse.up();
      await page.waitForTimeout(400);
      const kept = (await noteLoc.count()) && (await noteLoc.first().isVisible()) ? (await noteLoc.first().innerText()).trim() : null;
      out.push({ mode: "noop-press", showing: (await page.locator("text=showing").first().innerText()).trim(), keptNote: kept });
      // I-064 Codex r1: a still press on the LEFT handle (at 1900) must keep the note too.
      const hx = b2.x + 4 + ((1900 - 1600) / 450) * (b2.width - 8) + 1;
      const handleHit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.getAttribute("class"), [hx, pressY]);
      await page.mouse.move(hx, pressY);
      await page.mouse.down();
      await page.mouse.up();
      await page.waitForTimeout(400);
      const keptH = (await noteLoc.count()) && (await noteLoc.first().isVisible()) ? (await noteLoc.first().innerText()).trim() : null;
      out.push({ mode: "noop-press", hit: handleHit, showing: (await page.locator("text=showing").first().innerText()).trim(), keptNote: keptH });
      await page.getByRole("button", { name: /Industrial/ }).click();
      await page.getByRole("button", { name: /Modern/ }).click();
      await page.waitForTimeout(400);
      const back = (await noteLoc.count()) && (await noteLoc.first().isVisible()) ? (await noteLoc.first().innerText()).trim() : null;
      out.push({ mode: "preset-return", showing: (await page.locator("text=showing").first().innerText()).trim(), staleNote: back });
      // I-064: a drag that starts inside the Modern selection (1900-2050) pans it 50 years back.
      const b3 = await svg.boundingBox();
      const xAt = (y) => b3.x + 4 + ((y - 1600) / 450) * (b3.width - 8);
      const yAt = b3.y + b3.height / 2;
      await page.mouse.move(xAt(1975), yAt);
      await page.mouse.down();
      await page.mouse.move(xAt(1950), yAt, { steps: 5 });
      await page.mouse.move(xAt(1925), yAt, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(400);
      const panStatus = (await statusLoc.count()) ? (await statusLoc.first().innerText()).trim() : null;
      out.push({ mode: "pan", showing: (await page.locator("text=showing").first().innerText()).trim(), status: panStatus, widenedNote: (await noteLoc.count()) ? (await noteLoc.first().innerText()).trim() : null });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(out));
const drags = out.filter((r) => r.mode === "mouse" || r.mode === "touch");
const stale = out.filter((r) => r.mode === "preset-return" && r.staleNote);
const lost = out.filter((r) => r.mode === "noop-press" && !r.keptNote);
// I-064 legs: a short drag names the Modern window, moves the strip 0px, and a pan says it moved.
const named = drags.filter((r) => r.status === "Chart now shows 1900–2050, the same as Modern.");
const shifted = drags.filter((r) => r.shift !== 0);
const pans = out.filter((r) => r.mode === "pan");
const panOk = pans.filter((r) => r.showing === "showing 1850–2000" && r.status === "Moved the selection; drag outside it to pick new years. Chart now shows 1850–2000." && !r.widenedNote);
const i064 = process.argv[4] === "--preset-return" ? named.length === drags.length && shifted.length === 0 && pans.length === 1 && panOk.length === 1 : true;
const ok = drags.every((r) => r.note && r.visible && r.showing === "showing 1900–2050" && /^Widened to 150 years, the shortest view this chart draws\.$/.test(r.note)) && stale.length === 0 && lost.length === 0 && i064;
console.log(`RESULT: ${ok ? "PASS" : "RED"} — ${drags.filter((r) => r.note && r.visible).length} of ${drags.length} drags show a visible widening reason; ${stale.length} stale note(s) after a preset return; ${lost.length} note(s) erased by a no-op press; I-064: ${named.length} of ${drags.length} name the Modern window, ${shifted.length} moved the strip, ${panOk.length} of ${pans.length} pans say they moved (${origin})`);
process.exit(ok ? 0 : 3);
