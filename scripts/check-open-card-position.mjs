// Does the opened Ray Dalio card, or the "State of the cycles" panel under it, give a cycle's
// curve a position in the current year, on a phone?
//
// I-054. Walks C1/C2 (2026-10-17, docs/walks/2026-10-17-i048-closed-card.md) opened the Dalio
// card and read "Where the drawn curve sits in 2026: peaking", over a crest at a dotted
// current-year line, as the site briefly agreeing with the theory; the panel further down listed
// "Ray Dalio 75y PEAKING" with no verdict beside it. On /?tab=facets&focus=dalio this counts,
// for the opened card (its [data-facet-id] plus the year axis that sits directly under it):
//
//   tag        — any [data-phase-position] in the card
//   phase word — any block (p, li, div) whose rendered text names a phase label as a word (rising,
//                peaking, falling, troughing, crossing) AND the current year: a position, not the
//                theory's own description ("rising → top → declining → reset" names no year)
//   now-line   — any vertical svg <line> (x1 == x2) in the card's chart (its svg[role=img], not the axis)
//   year label — any rendered text node naming the current year as a word, in the card or its axis
//
// and, for the panel (section[aria-label="State of the cycles summary"]):
//
//   phase word — in a rendered text node, or in a row button's accessible name (aria-label: the
//                manager review's control, because both walkers read the panel from page text)
//   no verdict — a row that does not carry its cycle's "Does it hold up?" headline
//
// The same card legs are read a second time on /?tab=calibrate&focus=dalio, which renders the
// same expanded card with its own axis (Codex r1, 2026-10-18: that axis kept "now · 2026").
//
// It checks that the card opened (it carries the full [data-holds-up] line), that its chart draws a curve and that
// the panel has one row per cycle, so a page that failed to render cannot read as clean. It
// claims DOM presence and text only, never paint or what a reader takes from it; that is the walk's.
//
//   node scripts/check-open-card-position.mjs [origin] [--width N --height N]
//   node scripts/check-open-card-position.mjs --selftest
//
// Without --width/--height it reads both phone viewports, 390x664 and 320x568. Exit 0 nothing
// counted · 1 at least one mark · 2 the card did not open, draws no curve, or the panel is short.
// NOT caught: a position given some other way (a colour, a <circle> or <rect> mark, a filled bar,
// which the panel draws only from 640px up); any opened card but Dalio's; the embed pages;
// /state/<year> and the share card (separate surfaces); anything wider than a phone.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const CYCLES = JSON.parse(readFileSync(join(import.meta.dirname, "../src/data/cycles.json"), "utf8"));
const CYCLE_COUNT = CYCLES.length;
const FOCUS = "dalio";

export const VIEWPORTS = [
  { width: 390, height: 664 },
  { width: 320, height: 568 },
];

// The five labels phasePositionLabel can return (src/lib/cycleMath.ts), written out here so the
// check shares no code with the component it reads.
export const PHASE_WORDS = ["rising", "peaking", "falling", "troughing", "crossing"];

// The verdict headlines the panel must carry (src/lib/holdsUp.ts states them; written out here).
export const VERDICTS = ["Not tested", "Not testable on the record that exists"];

export function phaseIn(text) {
  return new RegExp(`\\b(${PHASE_WORDS.join("|")})\\b`, "i").test(text);
}

export function yearIn(text, year) {
  return new RegExp(`(^|\\D)${year}(\\D|$)`).test(text);
}

// One viewport's verdict from what the page reported.
export function judge(read, expectedRows = CYCLE_COUNT) {
  for (const [where, c] of [["Facets", read.card], ["Calibrate", read.calCard]]) {
    if (!c) return { state: "MISSING", why: `the ${FOCUS} card is not on the ${where} tab` };
    if (!c.open) return { state: "MISSING", why: `the ${FOCUS} card did not open on the ${where} tab` };
    if (!c.drawn) return { state: "MISSING", why: `the opened ${FOCUS} card draws no curve on the ${where} tab` };
  }
  if (read.panel.rows !== expectedRows)
    return { state: "MISSING", why: `the panel has ${read.panel.rows} of ${expectedRows} rows` };
  const both = (k) => read.card[k] + read.calCard[k];
  const totals = {
    cardTag: both("tag"),
    cardPhase: both("phase"),
    cardLine: both("line"),
    cardYear: both("year"),
    panelPhase: read.panel.phase,
    panelNamePhase: read.panel.namePhase,
    panelNoVerdict: read.panel.noVerdict,
  };
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  return { state: total > 0 ? "MARKED" : "CLEAN", totals, total };
}

export function summary(results) {
  const clean = results.filter((r) => r.state === "CLEAN").length;
  const exit = results.some((r) => r.state === "MISSING") ? 2 : results.some((r) => r.state === "MARKED") ? 1 : 0;
  return {
    line: `${clean} of ${results.length} viewports show no current-year position on the opened ${FOCUS} card or the State of the cycles panel`,
    exit,
  };
}

function selftest() {
  const card = (over = {}) => ({ open: true, drawn: true, tag: 0, phase: 0, line: 0, year: 0, ...over });
  const panel = (over = {}) => ({ rows: 10, phase: 0, namePhase: 0, noVerdict: 0, ...over });
  const page = (c = card(), p = panel(), cal = card()) => ({ card: c, panel: p, calCard: cal });
  // The 10-17 production page: a tag and its sentence, a now-line, "now · 2026" on the axis, and
  // ten panel rows each carrying a phase word, a phase in its accessible name and no verdict.
  const before = judge(page(card({ tag: 1, phase: 1, line: 1, year: 1 }), panel({ phase: 10, namePhase: 10, noVerdict: 10 })), 10);
  const checks = [
    ["a bare opened card and a verdict-carrying panel are CLEAN", judge(page(), 10).state === "CLEAN"],
    ["the 10-17 page is MARKED 34", before.state === "MARKED" && before.total === 34],
    ["a card tag alone is MARKED", judge(page(card({ tag: 1 })), 10).state === "MARKED"],
    ["a card phase word alone is MARKED", judge(page(card({ phase: 1 })), 10).state === "MARKED"],
    ["a card now-line alone is MARKED", judge(page(card({ line: 1 })), 10).state === "MARKED"],
    ["a current-year label alone is MARKED", judge(page(card({ year: 1 })), 10).state === "MARKED"],
    ["a panel phase word alone is MARKED", judge(page(card(), panel({ phase: 1 })), 10).state === "MARKED"],
    ["a phase in a row's accessible name alone is MARKED", judge(page(card(), panel({ namePhase: 1 })), 10).state === "MARKED"],
    ["a row with no verdict alone is MARKED", judge(page(card(), panel({ noVerdict: 1 })), 10).state === "MARKED"],
    ["a current-year label on the Calibrate tab's card alone is MARKED", judge(page(card(), panel(), card({ year: 1 })), 10).state === "MARKED"],
    ["no card is MISSING, never CLEAN", judge({ card: null, panel: panel(), calCard: card() }, 10).state === "MISSING"],
    ["no Calibrate card is MISSING, never CLEAN", judge({ card: card(), panel: panel(), calCard: null }, 10).state === "MISSING"],
    ["a card that did not open is MISSING", judge(page(card({ open: false })), 10).state === "MISSING"],
    ["a card with no curve is MISSING", judge(page(card({ drawn: false })), 10).state === "MISSING"],
    ["an empty panel is MISSING, never CLEAN", judge(page(card(), panel({ rows: 0 })), 10).state === "MISSING"],
    ["the phase matcher finds a label as a word, any case", phaseIn("Where the drawn curve sits in 2026: peaking") && phaseIn("PEAKING") && phaseIn("currently rising, select")],
    ["the phase matcher ignores other words that contain a label", !phaseIn("uprising") && !phaseIn("crossings counted") && !phaseIn("Not testable on the record that exists")],
    ["the year matcher finds a year inside other text", yearIn("now · 2026", "2026") && yearIn("2026", "2026")],
    ["the year matcher ignores a longer number and other years", !yearIn("20260", "2026") && !yearIn("2000", "2026")],
    ["the verdict list holds both headlines no row may lack", VERDICTS.length === 2],
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
    const readTab = async (tab) => {
    await page.goto(`${origin}/?tab=${tab}&focus=${FOCUS}`, { waitUntil: "networkidle" });
    await page.locator('section[aria-label="State of the cycles summary"]').first().waitFor({ timeout: 15000 }).catch(() => {});
    return page.evaluate(({ focus, yearInSrc, phaseInSrc, verdicts }) => {
      const yearIn = new Function(`return (${yearInSrc})`)();
      const phaseIn = new Function(`return (${phaseInSrc})`)();
      const shown = (el) => {
        const r = el.getBoundingClientRect();
        return el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && r.width + r.height > 0;
      };
      const texts = (root) => {
        const out = [];
        const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let n = walk.nextNode(); n; n = walk.nextNode())
          if ((n.textContent ?? "").trim() && n.parentElement && shown(n.parentElement)) out.push(n);
        return out;
      };
      const year = String(new Date().getFullYear());
      const card = document.querySelector(`[data-facet-id="${focus}"]`);
      let cardRead = null;
      if (card) {
        // The year axis FacetView draws directly under an opened card.
        const next = card.nextElementSibling;
        const axis = next && !next.hasAttribute("data-facet-id") ? next : null;
        const scoped = [...texts(card), ...(axis ? texts(axis) : [])];
        cardRead = {
          // Expanded = the card carries the full [data-holds-up] verdict line (a closed card carries
          // [data-holds-up-closed]). Not aria-expanded: the Calibrate tab's header is an "open in the
          // facets view" button with no aria-expanded at all.
          open: !!card.querySelector("[data-holds-up]"),
          drawn: [...card.querySelectorAll('svg path[data-curve="theory"]')].some((p) => (p.getAttribute("d") ?? "").length > 0 && shown(p)),
          tag: [...card.querySelectorAll("[data-phase-position]")].filter(shown).length,
          phase: new Set(
            texts(card)
              .filter((n) => phaseIn(n.textContent ?? ""))
              .map((n) => n.parentElement.closest("p, li, div"))
              .filter((b) => b && yearIn(b.innerText ?? "", year)),
          ).size,
          // The chart's own svg only: on the Calibrate tab the year axis sits INSIDE the card and its
          // tick marks are vertical lines too (6 of them, measured 2026-10-18). The axis's "now"
          // mark is caught by the year-label leg.
          line: [...card.querySelectorAll('svg[role="img"] line')].filter((l) => shown(l) && l.getAttribute("x1") === l.getAttribute("x2")).length,
          year: new Set(scoped.filter((n) => yearIn(n.textContent ?? "", year)).map((n) => n.parentElement)).size,
        };
      }
      const panel = document.querySelector('section[aria-label="State of the cycles summary"]');
      const rows = panel ? [...panel.querySelectorAll("li")] : [];
      const flat = (el) => (el.innerText ?? "").replace(/\s+/g, " ").trim();
      return {
        card: cardRead,
        panel: {
          rows: rows.length,
          phase: panel ? new Set(texts(panel).filter((n) => phaseIn(n.textContent ?? "")).map((n) => n.parentElement)).size : 0,
          namePhase: rows.filter((li) => [...li.querySelectorAll("[aria-label]")].some((e) => phaseIn(e.getAttribute("aria-label") ?? ""))).length,
          noVerdict: rows.filter((li) => !verdicts.some((v) => flat(li).toLowerCase().includes(v.toLowerCase()))).length,
        },
      };
    }, { focus: FOCUS, yearInSrc: yearIn.toString(), phaseInSrc: `(text) => new RegExp("\\\\b(${PHASE_WORDS.join("|")})\\\\b", "i").test(text)`, verdicts: VERDICTS });
    };
    const read = await readTab("facets");
    read.calCard = (await readTab("calibrate")).card;
    await page.close();
    const v = judge(read);
    results.push(v);
    const t = v.totals;
    const detail =
      v.state === "MISSING"
        ? v.why
        : `cards (Facets + Calibrate): tags ${t.cardTag} · phase words ${t.cardPhase} · now-lines ${t.cardLine} · current-year labels ${t.cardYear} | panel: phase words ${t.panelPhase} · in row names ${t.panelNamePhase} · rows with no verdict ${t.panelNoVerdict} of ${read.panel.rows}`;
    console.log(`  ${v.state.padEnd(7)} ${origin}/?tab=facets|calibrate&focus=${FOCUS} @ ${vp.width}x${vp.height}  ${detail}`);
  }
  await browser.close();
  const s = summary(results);
  console.log(s.exit === 0 ? `OK: ${s.line}` : `RED: ${s.line}`);
  return s.exit;
}

const args = process.argv.slice(2);
process.exit(args.includes("--selftest") ? selftest() : await run(args));
