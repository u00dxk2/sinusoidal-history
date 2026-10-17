// Does a closed cycle card on the home page give its curve a position, or cut
// its cycle's name short, on a phone?
//
// I-048 (closed-card half) and I-050. Walks B2/B3 (2026-10-16,
// docs/walks/2026-10-16-i052-i048.md) scrolled to the closed Dalio card and read
// its "CURVE · PEAKING" tag together with its chart's crest at the dashed
// current-year line as "peaking now". At 320px the same tag, which never
// shrinks, pushes the name into an ellipsis ("Ray Dalio — …"). Per closed card
// (a [data-facet-id] holding a [data-holds-up-closed] verdict) this counts:
//
//   tag        — any [data-phase-position] inside the card (the header's phase word)
//   now-line   — any vertical svg <line> (x1 == x2) in the card (the dashed
//                current-year line; the horizontal zero line is not counted)
//   truncated  — the name's box is narrower than its text (scrollWidth >
//                clientWidth on the header's .truncate span)
//
// and, once for the stack of closed cards (their shared parent, which holds the
// one year axis under them — the manager review's hypothesis 2, measured true on
// 2026-10-17: it printed "now · 2026"):
//
//   year label — any rendered text node naming the current year as a word
//
// It checks that every cycle has a closed card, each card's chart draws a curve,
// and the shared axis prints at least one year tick, so a page that failed to
// render cannot read as clean. It claims
// GEOMETRY and DOM presence only, never paint or what a reader takes from it;
// that is the walk's (10-16 retro Q6: the glance checker grew two rounds of
// matchers before it was narrowed to this shape).
//
//   node scripts/check-closed-card-header.mjs [origin] [--width N --height N]
//   node scripts/check-closed-card-header.mjs --selftest
//
// Without --width/--height it reads both phone viewports, 390x664 and 320x568.
// Exit 0 no tag, now-line or cut name on any closed card · 1 at least one · 2 a
// closed card is missing or draws no curve. NOT caught: a phase given some other
// way (a word in prose, a colour, a <circle> or <rect> mark); the expanded card,
// which keeps its phase line under the answer on purpose (I-047); the embed
// pages; anything wider than a phone.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const CYCLE_COUNT = JSON.parse(
  readFileSync(join(import.meta.dirname, "../src/data/cycles.json"), "utf8"),
).length;

export const VIEWPORTS = [
  { width: 390, height: 664 },
  { width: 320, height: 568 },
];

// One viewport's verdict from what the page reported.
export function judge(read, expectedCards = CYCLE_COUNT) {
  if (read.cards.length !== expectedCards)
    return { state: "MISSING", why: `${read.cards.length} of ${expectedCards} closed cards` };
  const blank = read.cards.filter((c) => !c.drawn).map((c) => c.id);
  if (blank.length) return { state: "MISSING", why: `no curve drawn: ${blank.join(", ")}` };
  if (!(read.axisTicks > 0)) return { state: "MISSING", why: "the shared year axis prints no year tick" };
  const count = (k) => read.cards.reduce((n, c) => n + c[k], 0);
  const totals = {
    tag: count("tag"),
    line: count("line"),
    truncated: read.cards.filter((c) => c.truncated).length,
    year: read.yearLabels,
  };
  const total = totals.tag + totals.line + totals.truncated + totals.year;
  return { state: total > 0 ? "MARKED" : "CLEAN", totals };
}

export function summary(results) {
  const clean = results.filter((r) => r.state === "CLEAN").length;
  const exit = results.some((r) => r.state === "MISSING")
    ? 2
    : results.some((r) => r.state === "MARKED")
      ? 1
      : 0;
  return { line: `${clean} of ${results.length} viewports show no phase tag, now-line, current-year label or cut name on the closed cards`, exit };
}

function selftest() {
  const card = (id, over = {}) => ({ id, drawn: true, tag: 0, line: 0, truncated: false, ...over });
  const ten = (over = {}) => Array.from({ length: 10 }, (_, i) => card(`c${i}`, over));
  const page = (cards, over = {}) => ({ cards, yearLabels: 0, axisTicks: 5, ...over });
  const marked = judge(page(ten({ tag: 1, line: 1 }), { yearLabels: 1 }), 10);
  const checks = [
    ["ten bare closed cards are CLEAN", judge(page(ten()), 10).state === "CLEAN"],
    // The red arms: the 10-16 page, and each leg alone.
    ["the 10-16 page (a tag and a now-line per card, now · 2026 on the axis) is MARKED 21", marked.totals.tag + marked.totals.line + marked.totals.year === 21],
    ["a tag alone is MARKED", judge(page([...ten().slice(1), card("x", { tag: 1 })]), 10).state === "MARKED"],
    ["a now-line alone is MARKED", judge(page([...ten().slice(1), card("x", { line: 1 })]), 10).state === "MARKED"],
    ["a cut name alone is MARKED", judge(page([...ten().slice(1), card("x", { truncated: true })]), 10).state === "MARKED"],
    ["a current-year label alone is MARKED", judge(page(ten(), { yearLabels: 1 }), 10).state === "MARKED"],
    ["no closed cards is MISSING, never CLEAN", judge(page([]), 10).state === "MISSING"],
    ["one card short is MISSING", judge(page(ten().slice(1)), 10).state === "MISSING"],
    ["a card with no curve is MISSING, never CLEAN", judge(page([...ten().slice(1), card("x", { drawn: false })]), 10).state === "MISSING"],
    ["an axis with no year ticks is MISSING, never CLEAN", judge(page(ten(), { axisTicks: 0 }), 10).state === "MISSING"],
    ["the year matcher finds a year inside other text", yearIn("now · 2026", "2026") && yearIn("2026", "2026")],
    ["the year matcher ignores a longer number and other years", !yearIn("20260", "2026") && !yearIn("2000", "2026")],
    ["one marked viewport makes the run exit 1", summary([{ state: "CLEAN" }, { state: "MARKED" }]).exit === 1],
    ["a missing card outranks a mark: exit 2", summary([{ state: "MARKED" }, { state: "MISSING" }]).exit === 2],
    ["the count names its denominator", summary([{ state: "CLEAN" }, { state: "CLEAN" }]).line.startsWith("2 of 2 ")],
    ["both phone viewports are read by default", VIEWPORTS.length === 2 && VIEWPORTS.some((v) => v.width === 320 && v.height === 568)],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  const failed = checks.filter(([, ok]) => !ok).length;
  console.log(failed ? `selftest: ${failed} FAILED` : `selftest: ${checks.length} passed`);
  return failed ? 1 : 0;
}

// The current year as a whole word in a piece of text (the rule check-glance-now-mark states).
// Passed to the page as source text, so the selftest exercises the rule the browser runs.
export function yearIn(text, year) {
  return new RegExp(`(^|\\D)${year}(\\D|$)`).test(text);
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
    const page = await browser.newPage({ viewport: vp, isMobile: true, hasTouch: true });
    await page.goto(origin + "/", { waitUntil: "networkidle" });
    const read = await page.evaluate(({ yearInSrc }) => {
      const yearIn = new Function(`return (${yearInSrc})`)();
      const shown = (el) => {
        const r = el.getBoundingClientRect();
        return el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && r.width + r.height > 0;
      };
      const cards = [...document.querySelectorAll("[data-facet-id]")].filter((f) => f.querySelector("[data-holds-up-closed]"));
      // The stack's text nodes, once each (cards and the shared axis under them).
      const stack = cards[0]?.parentElement;
      const texts = [];
      if (stack) {
        const walk = document.createTreeWalker(stack, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode()) if (n.parentElement && shown(n.parentElement)) texts.push(n);
      }
      const year = String(new Date().getFullYear());
      const outsideCards = (n) => !cards.some((c) => c.contains(n));
      return {
        yearLabels: new Set(texts.filter((n) => yearIn(n.textContent ?? "", year)).map((n) => n.parentElement)).size,
        axisTicks: texts.filter((n) => outsideCards(n) && /^\s*\d{4}\s*$/.test(n.textContent ?? "")).length,
        cards: cards.map((f) => {
          const name = f.querySelector(".truncate");
          return {
            id: f.getAttribute("data-facet-id"),
            // Curve geometry, not paint (header).
            drawn: [...f.querySelectorAll('svg path[data-curve="theory"]')].some((p) => (p.getAttribute("d") ?? "").length > 0 && shown(p)),
            tag: [...f.querySelectorAll("[data-phase-position]")].filter(shown).length,
            line: [...f.querySelectorAll("svg line")].filter((l) => shown(l) && l.getAttribute("x1") === l.getAttribute("x2")).length,
            truncated: !!name && name.scrollWidth > name.clientWidth,
          };
        }),
      };
    }, { yearInSrc: yearIn.toString() });
    await page.close();
    const v = judge(read);
    results.push(v);
    const cut = read.cards.filter((c) => c.truncated).map((c) => c.id);
    const detail =
      v.state === "MISSING" ? v.why
      : `tags ${v.totals.tag} · now-lines ${v.totals.line} · current-year labels ${v.totals.year} · cut names ${v.totals.truncated}${cut.length ? ` (${cut.join(", ")})` : ""} · of ${read.cards.length} cards, ${read.axisTicks} axis ticks`;
    console.log(`  ${v.state.padEnd(7)} ${origin}/ @ ${vp.width}x${vp.height}  ${detail}`);
  }
  await browser.close();
  const s = summary(results);
  console.log(s.exit === 0 ? `OK: ${s.line}` : `RED: ${s.line}`);
  return s.exit;
}

const args = process.argv.slice(2);
process.exit(args.includes("--selftest") ? selftest() : await run(args));
