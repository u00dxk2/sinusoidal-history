// Does tapping a cycle's name in the home page's glance figure open that
// cycle's card?
//
// I-046. The I-045 walk (2026-10-14, docs/walks/2026-10-14-i045.md) tapped
// "Ray Dalio" in the glance figure at 390x664 and nothing happened: the URL
// stayed / and the scroll stayed 0. Since 2026-10-21 each row is a button that
// opens the card. For every cycle, at each phone viewport, this loads plain /,
// taps the row where a reader taps it (the name, 40px in from the row's left
// edge, vertically centred) with a touch tap, and reads:
//
//   opened  — that cycle's visible card has its toggle at aria-expanded="true"
//   others  — how many OTHER visible cards are expanded (a tap must not open
//             the wrong one)
//   inView  — the opened card's top edge is inside the viewport after the tap
//
//   node scripts/check-glance-tap.mjs [origin] [--width N --height N]
//   node scripts/check-glance-tap.mjs --selftest
//
// Exit 0 every tap opened its own card in view · 1 at least one tap was dead,
// opened the wrong card, or left the card off-screen · 2 the figure or a row is
// missing, or a card was already expanded before the tap. NOT caught: a mouse click or keyboard press (only touch is read); a
// tap on the curve part of the row (the name is tapped); a brushed range other
// than the default; whether a reader NOTICES the card opened (the walk is the
// instrument for that).
import { readFileSync } from "node:fs";
import { join } from "node:path";

const FIGURE = 'figure[aria-labelledby="cycle-overview-title"]';
const CYCLE_IDS = JSON.parse(
  readFileSync(join(import.meta.dirname, "../src/data/cycles.json"), "utf8"),
).map((c) => c.id);

export const VIEWPORTS = [
  { width: 390, height: 664 },
  { width: 320, height: 568 },
];

// One tap's verdict from what the page reported.
export function judge(read) {
  if (!read.row) return { state: "MISSING", why: "no visible row for this cycle in the glance figure" };
  // Codex r3 (LOW): post-tap state alone cannot tell "the tap opened it" from "it was open".
  if (read.preOpen > 0) return { state: "MISSING", why: `${read.preOpen} card(s) already expanded before the tap; cannot judge` };
  if (!read.opened) return { state: "DEAD", why: "the tap opened no card for this cycle" };
  if (read.others > 0) return { state: "WRONG", why: `${read.others} other card(s) expanded as well` };
  if (!read.inView) return { state: "OFFSCREEN", why: "the card opened but its top is outside the viewport" };
  return { state: "OPENS" };
}

export function summary(results) {
  const ok = results.filter((r) => r.state === "OPENS").length;
  const exit = results.some((r) => r.state === "MISSING") ? 2 : ok === results.length ? 0 : 1;
  return { line: `${ok} of ${results.length} glance-row taps opened their own card in view`, exit };
}

function selftest() {
  const good = { row: true, opened: true, others: 0, inView: true };
  const checks = [
    ["a tap that opens its own card in view OPENS", judge(good).state === "OPENS"],
    // The red arms: the shipped dead row (I-046), the wrong card, off-screen, a missing row.
    ["the 10-14 dead tap (nothing opened) is DEAD", judge({ ...good, opened: false }).state === "DEAD"],
    ["a tap that also opens another card is WRONG", judge({ ...good, others: 1 }).state === "WRONG"],
    ["a card opened below the fold is OFFSCREEN", judge({ ...good, inView: false }).state === "OFFSCREEN"],
    ["a missing row is MISSING, never OPENS", judge({ row: false, opened: false, others: 0, inView: false }).state === "MISSING"],
    ["a card already open before the tap is MISSING, never OPENS", judge({ ...good, preOpen: 1 }).state === "MISSING"],
    ["one dead tap makes the run exit 1", summary([{ state: "OPENS" }, { state: "DEAD" }]).exit === 1],
    ["a missing row outranks a dead tap: exit 2", summary([{ state: "DEAD" }, { state: "MISSING" }]).exit === 2],
    ["the count names its denominator", summary([{ state: "OPENS" }, { state: "OPENS" }]).line.startsWith("2 of 2 ")],
    ["every cycle in cycles.json is tapped", CYCLE_IDS.length >= 10],
    ["both phone viewports are read by default", VIEWPORTS.length === 2 && VIEWPORTS.some((v) => v.width === 320 && v.height === 568)],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  const failed = checks.filter(([, ok]) => !ok).length;
  console.log(failed ? `selftest: ${failed} FAILED` : `selftest: ${checks.length} passed`);
  return failed ? 1 : 0;
}

function flag(args, name) {
  const i = args.indexOf(name);
  return i === -1 ? undefined : Number(args[i + 1]);
}

async function run(args) {
  const origin = (args.find((a) => !a.startsWith("--") && !/^\d+$/.test(a)) ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
  const width = flag(args, "--width");
  const height = flag(args, "--height");
  const viewports = width && height ? [{ width, height }] : VIEWPORTS;
  // Loaded here, not at the top, so --selftest runs where no browser is installed.
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const results = [];
  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: true, hasTouch: true });
    for (const id of CYCLE_IDS) {
      const page = await ctx.newPage();
      await page.goto(origin + "/", { waitUntil: "networkidle" });
      const row = page.locator(`${FIGURE} [data-overview-id="${id}"]`);
      let read = { row: false, opened: false, others: 0, inView: false };
      if ((await row.count()) && (await row.isVisible())) {
        await row.scrollIntoViewIfNeeded();
        const preOpen = await page.locator('[data-facet-id]:visible button[aria-expanded="true"]').count();
        const box = await row.boundingBox();
        await page.touchscreen.tap(box.x + 40, box.y + box.height / 2);
        await page.waitForTimeout(800);
        read = await page.evaluate((cid) => {
          const visible = (el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
          const expanded = [...document.querySelectorAll("[data-facet-id]")]
            .filter(visible)
            .filter((card) => card.querySelector('button[aria-expanded="true"]'));
          const mine = expanded.find((card) => card.getAttribute("data-facet-id") === cid);
          const top = mine ? mine.getBoundingClientRect().top : NaN;
          return {
            row: true,
            opened: !!mine,
            others: expanded.filter((card) => card !== mine).length,
            inView: !!mine && top >= 0 && top < window.innerHeight,
          };
        }, id);
        read.preOpen = preOpen;
      }
      await page.close();
      const v = judge(read);
      results.push(v);
      console.log(`  ${v.state.padEnd(9)} ${vp.width}x${vp.height} ${id.padEnd(22)} ${v.why ?? ""}`);
    }
    await ctx.close();
  }
  await browser.close();
  const s = summary(results);
  console.log(s.exit === 0 ? `OK: ${s.line}` : `RED: ${s.line}`);
  return s.exit;
}

const args = process.argv.slice(2);
process.exit(args.includes("--selftest") ? selftest() : await run(args));
