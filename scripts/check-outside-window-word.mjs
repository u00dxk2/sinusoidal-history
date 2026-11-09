// Does every zoomed facet card and the desktop overlay SAY when a line is not drawn? (I-074)
//
// I-069 gave the glance rows a word when the window holds none of a cycle's one drawn wave. Its
// siblings drew an empty curve with no word: on production at ?range=1801-1951 (live 66962f4a,
// 2026-11-09) Schlesinger Jr. and Perez showed blank theory curves on the facet cards and the
// overlay, and Schlesinger Jr.'s paired Policy Mood (from 1952) was missing too. This reads every
// facet card (normal, open, collapsed, the Calibrate tab, an embed) and the overlay, and asks:
//   - every theory line (and, on an open or normal paired card, the data line) is drawn or blank
//     exactly as the oracle says, so a right word beside a wrong line is caught (Codex r1);
//   - a card or overlay cycle whose line is missing carries the expected word;
//   - a card whose lines are all drawn carries no word;
//   - each word reads at 4.5:1 or better against the nearest opaque background.
//
//   node scripts/check-outside-window-word.mjs [origin]
//   node scripts/check-outside-window-word.mjs --selftest
//
// The expected words come from THIS script's own oracle (cycles.json and the CSVs the origin
// serves), never from the site's src/lib, so a shared bug cannot agree with itself.
// Exit 0 every case clean · 1 a defect · 2 a page or element missing.
// NOT read: paint (a word could be drawn off the visible plot), touch, dark mode, calibration,
// the CSV loading and error states (unit-tested in src/lib/outsideWindow.test.ts), and the
// overlay's DATA lines (they toggle separately; a data series with no points in the window is not
// judged there). Contrast ignores semi-transparent layers between the text and the first opaque
// background, and multiplies ancestor opacity into the text colour.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const REPO = join(import.meta.dirname, "..");
const cycles = JSON.parse(readFileSync(join(REPO, "src/data/cycles.json"), "utf8"));
const series = JSON.parse(readFileSync(join(REPO, "src/data/series.json"), "utf8"));
const YEAR = new Date().getUTCFullYear();
const NONE = "none drawn in these years";

// ---- oracle (independent of src/lib) ---------------------------------------------------------

export function theorySide(c, start, end, year = YEAR) {
  const from = c.reference_peak_year - c.period_years / 2;
  const to = Math.min(c.reference_peak_year + c.period_years / 2, year);
  if (Math.max(start, from) < Math.min(end, to)) return null;
  if (to <= start) return "before";
  if (from >= end) return "after";
  return null;
}

export function dataSide(years, start, end) {
  if (!years || years.length === 0) return null;
  if (years.filter((y) => y >= start && y <= end).length >= 2) return null;
  if (years.every((y) => y >= end)) return "after";
  if (years.every((y) => y <= start)) return "before";
  return null;
}

const arrow = (w, side) => (side === "after" ? `${w} →` : side === "before" ? `← ${w}` : w);

/** The words a facet card should carry; null when it should carry none. */
export function expectedFacetWord(theory, data, paired, collapsed) {
  if (collapsed || !paired) return theory ? arrow(NONE, theory) : null;
  if (theory && data) return theory === data ? arrow(`theory and data: ${NONE}`, theory) : `theory and data: ${NONE}`;
  if (theory) return arrow(`theory: ${NONE}`, theory);
  if (data) return arrow(`data: ${NONE}`, data);
  return null;
}

/**
 * A path draws a line only with a segment after its first move ("Mx,yZ" alone draws nothing), and
 * only when every coordinate is a finite number: d3 writes "NaN" for a non-finite coordinate, and
 * its "a" once read as an arc command (Codex r2). Stated rule, not a matcher: any non-finite
 * token makes the path read as blank.
 */
export function drawsLine(d) {
  if (typeof d !== "string" || /NaN|Infinity/.test(d)) return false;
  return /[LCHVQSA]/i.test(d.slice(1));
}

/**
 * Judge one facet card's reading against the oracle. The lines are judged too (Codex r1): a word
 * that matches the oracle is still wrong if the page drew the line it says is missing, or left
 * blank a line the oracle says is drawn. `oracle.theory` / `oracle.data` are the sides (null =
 * drawn); `card.dataBlank` is undefined where no data line is read (collapsed, unpaired).
 */
export function judgeCard(card, expected, oracle = {}) {
  const words = card.words.map((w) => w.trim());
  if ("theory" in oracle && Boolean(oracle.theory) !== card.theoryBlank)
    return { kind: oracle.theory ? "line-drawn-against-oracle" : "line-blank-against-oracle", detail: "theory" };
  if ("data" in oracle && card.dataBlank !== undefined && Boolean(oracle.data) !== card.dataBlank)
    return { kind: oracle.data ? "line-drawn-against-oracle" : "line-blank-against-oracle", detail: "data" };
  if (expected === null) {
    if (words.length > 0) return { kind: "word-on-drawn", detail: words.join(" | ") };
    if (card.theoryBlank) return { kind: "blank-without-word" };
    return null;
  }
  if (words.length === 0) return { kind: "blank-without-word", detail: `expected "${expected}"` };
  if (words.length !== 1 || words[0] !== expected) return { kind: "wrong-word", detail: `got "${words.join(" | ")}", expected "${expected}"` };
  return null;
}

export function contrast(fg, bg) {
  const lum = ([r, g, b]) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

export function blend(fg, bg, alpha) {
  return fg.map((v, i) => v * alpha + bg[i] * (1 - alpha));
}

// ---- cases -------------------------------------------------------------------------------------

const CASES = [
  { name: "facets 1801-1951 @390", path: "/?range=1801-1951&tab=facets", w: 390, h: 664, start: 1801, end: 1951, kind: "facets" },
  { name: "facets 1801-1951 open Schlesinger Jr. @390", path: "/?range=1801-1951&tab=facets&focus=schlesinger_jr", w: 390, h: 664, start: 1801, end: 1951, kind: "facets", focus: "schlesinger_jr" },
  { name: "facets 1801-1951 open Perez @390", path: "/?range=1801-1951&tab=facets&focus=perez", w: 390, h: 664, start: 1801, end: 1951, kind: "facets", focus: "perez" },
  { name: "calibrate 1801-1951 Schlesinger Jr. @390", path: "/?range=1801-1951&tab=calibrate&focus=schlesinger_jr", w: 390, h: 664, start: 1801, end: 1951, kind: "facets", focus: "schlesinger_jr", only: "schlesinger_jr" },
  { name: "facets 1801-1951 @1280", path: "/?range=1801-1951&tab=facets", w: 1280, h: 800, start: 1801, end: 1951, kind: "facets" },
  { name: "facets 1900-2050 @390", path: "/?range=1900-2050&tab=facets", w: 390, h: 664, start: 1900, end: 2050, kind: "facets" },
  { name: "overlay 1801-1951 @1280", path: "/?range=1801-1951&tab=overlay", w: 1280, h: 800, start: 1801, end: 1951, kind: "overlay" },
  { name: "embed facets modern @680", path: "/embed?view=facets&range=modern", w: 680, h: 900, start: 1900, end: 2050, kind: "facets" },
  { name: "embed overlay modern @680x1070", path: "/embed?view=overlay&range=modern", w: 680, h: 1070, start: 1900, end: 2050, kind: "overlay", frame: 1070 },
];

async function run(origin) {
  const { chromium } = await import("playwright");
  const csvYears = {};
  for (const s of series) {
    const res = await fetch(new URL(s.data_file, origin));
    if (!res.ok) { console.log(`MISSING ${s.data_file}: HTTP ${res.status}`); return 2; }
    const lines = (await res.text()).trim().split(/\r?\n/);
    const head = lines[0].split(",");
    const yi = head.indexOf(s.year_column), vi = head.indexOf(s.value_column);
    // Same keep rule as the site's parseCsvSeries: Number(year) and Number(value) both finite, so an
    // empty value counts (Number("") is 0) and a missing column does not (Codex r1). No quoted
    // fields are handled: the year and value columns of these CSVs carry none (declared).
    csvYears[s.associated_cycle_id] = lines.slice(1).filter((l) => l.trim() !== "").map((l) => l.split(","))
      .filter((r) => Number.isFinite(Number(r[yi])) && Number.isFinite(Number(r[vi])))
      .map((r) => Number(r[yi]));
  }
  const browser = await chromium.launch();
  let worst = 0;
  try {
    for (const c of CASES) {
      const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h } });
      const page = await ctx.newPage();
      await page.goto(new URL(c.path, origin).href, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1200);
      const read = await page.evaluate(() => {
        const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 4).map(Number);
        const style = (el) => {
          let alpha = 1, node = el, bg = null;
          while (node && node.nodeType === 1) {
            const cs = getComputedStyle(node);
            alpha *= Number(cs.opacity);
            const b = rgb(cs.backgroundColor);
            if (!bg && b.length >= 3 && (b.length < 4 || b[3] === 1)) bg = b.slice(0, 3);
            node = node.parentElement;
          }
          return { fg: rgb(getComputedStyle(el).fill).slice(0, 3), alpha, bg: bg || [255, 255, 255] };
        };
        const words = (root) => [...root.querySelectorAll("[data-outside-word]")].map((el) => ({ text: el.textContent, id: el.getAttribute("data-outside-id"), ...style(el) }));
        const cards = [...document.querySelectorAll("[data-facet-id]")].filter((el) => el.getBoundingClientRect().height > 0).map((el) => ({
          id: el.getAttribute("data-facet-id"),
          theoryDs: [...el.querySelectorAll('path[data-curve="theory"]')].map((p) => p.getAttribute("d") || ""),
          dataDs: [...el.querySelectorAll('path[data-curve="data"]')].map((p) => p.getAttribute("d") || ""),
          words: words(el),
        }));
        const svg = document.querySelector('svg[aria-label^="Overlay of historical"]');
        const overlayDs = svg ? Object.fromEntries([...svg.querySelectorAll('path[data-curve="theory"]')].map((p) => [p.getAttribute("data-cycle-id"), p.getAttribute("d") || ""])) : null;
        return { cards, overlay: svg ? words(svg) : null, overlayDs, docHeight: document.documentElement.scrollHeight };
      });
      const defects = [];
      let minContrast = Infinity, judged = 0;
      const allWords = c.kind === "overlay" ? read.overlay ?? [] : read.cards.flatMap((k) => k.words);
      for (const w of allWords) {
        const ratio = contrast(blend(w.fg, w.bg, w.alpha), w.bg);
        minContrast = Math.min(minContrast, ratio);
        if (ratio < 4.5) defects.push(`low-contrast ${ratio.toFixed(2)}:1 "${w.text}"`);
      }
      if (c.kind === "facets") {
        const expectN = c.only ? 1 : cycles.length;
        const cards = c.only ? read.cards.filter((k) => k.id === c.only) : read.cards;
        if (cards.length !== expectN || cards.some((k) => k.theoryDs.length === 0)) {
          console.log(`${c.name}: MISSING — ${cards.length} of ${expectN} cards, or a card with no theory path`);
          worst = Math.max(worst, 2); await ctx.close(); continue;
        }
        for (const card of cards) {
          const cy = cycles.find((x) => x.id === card.id);
          const paired = series.some((s) => s.associated_cycle_id === card.id);
          const collapsed = c.focus !== undefined && c.focus !== card.id;
          const tSide = theorySide(cy, c.start, c.end);
          const dSide = paired ? dataSide(csvYears[card.id], c.start, c.end) : null;
          const exp = expectedFacetWord(tSide, dSide, paired, collapsed);
          // A collapsed card draws no data line, and an unpaired one has none: judge data only where it is drawn.
          const judgeData = paired && !collapsed;
          const v = judgeCard(
            {
              theoryBlank: !card.theoryDs.some(drawsLine),
              dataBlank: judgeData ? !card.dataDs.some(drawsLine) : undefined,
              words: card.words.map((w) => w.text),
            },
            exp,
            judgeData ? { theory: tSide, data: dSide } : { theory: tSide },
          );
          judged++;
          if (v) defects.push(`${v.kind} ${card.id}${v.detail ? ` (${v.detail})` : ""}`);
        }
      } else {
        if (!read.overlay) { console.log(`${c.name}: MISSING — no overlay svg`); worst = Math.max(worst, 2); await ctx.close(); continue; }
        const want = cycles.map((cy) => [cy, theorySide(cy, c.start, c.end)]).filter(([, s]) => s);
        const got = new Map(read.overlay.map((w) => [w.id, w.text.trim()]));
        for (const cy of cycles) {
          const d = read.overlayDs?.[cy.id];
          if (d === undefined) { defects.push(`missing theory path ${cy.id}`); continue; }
          const outside = want.some(([w]) => w.id === cy.id);
          if (outside === drawsLine(d)) defects.push(`${outside ? "line-drawn-against-oracle" : "line-blank-against-oracle"} theory ${cy.id}`);
        }
        for (const [cy, side] of want) {
          judged++;
          const exp = arrow(`${cy.name.split("—")[0].trim()} theory: ${NONE}`, side);
          if (!got.has(cy.id)) defects.push(`blank-without-word ${cy.id} (expected "${exp}")`);
          else if (got.get(cy.id) !== exp) defects.push(`wrong-word ${cy.id} (got "${got.get(cy.id)}", expected "${exp}")`);
        }
        for (const id of got.keys()) if (!want.some(([cy]) => cy.id === id)) defects.push(`word-on-drawn ${id}`);
        if (c.frame && read.docHeight > c.frame) defects.push(`frame ${read.docHeight}px > ${c.frame}px`);
      }
      const words = allWords.length;
      console.log(`${c.name}: ${defects.length === 0 ? "OK" : "DEFECT"} — judged ${judged} · words ${words} · min contrast ${words ? minContrast.toFixed(2) + ":1" : "n/a"}${c.frame ? ` · page ${read.docHeight}px of ${c.frame}` : ""}`);
      for (const d of defects) console.log(`  ${d}`);
      if (defects.length) worst = Math.max(worst, 1);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`RESULT: ${worst === 0 ? "PASS" : worst === 1 ? "FAIL" : "MISSING"} (exit ${worst})`);
  return worst;
}

function selftest() {
  const sj = cycles.find((c) => c.id === "schlesinger_jr");
  const kh = cycles.find((c) => c.id === "khaldun");
  const checks = [
    ["Schlesinger Jr. is after 1801-1951", theorySide(sj, 1801, 1951, 2026) === "after"],
    ["an edge touch is outside (drawn from 1955, window to 1955)", theorySide(sj, 1805, 1955, 2026) === "after"],
    ["Ibn Khaldun is before 1900-2050", theorySide(kh, 1900, 2050, 2026) === "before"],
    ["Policy Mood from 1952 is after 1801-1951", dataSide([1952, 1953, 2024], 1801, 1951) === "after"],
    ["one point inside draws no line", dataSide([1951, 1952], 1801, 1951) === "after"],
    ["two points inside draw", dataSide([1950, 1951], 1801, 1951) === null],
    ["no points is not judged", dataSide([], 1801, 1951) === null],
    ["paired, both missing, one side", expectedFacetWord("after", "after", true, false) === "theory and data: none drawn in these years →"],
    ["paired, theory missing only", expectedFacetWord("after", null, true, false) === "theory: none drawn in these years →"],
    ["collapsed uses the glance word", expectedFacetWord("before", "after", true, true) === "← none drawn in these years"],
    ["all drawn: no word", expectedFacetWord(null, null, true, false) === null],
    // The red arms: the production state before I-074, and a word left on a drawn card.
    ["a blank card with no word is a defect", judgeCard({ theoryBlank: true, words: [] }, "theory: none drawn in these years →")?.kind === "blank-without-word"],
    ["a blank card with no word and no oracle word is still a defect", judgeCard({ theoryBlank: true, words: [] }, null)?.kind === "blank-without-word"],
    ["a word on a drawn card is a defect", judgeCard({ theoryBlank: false, words: ["none drawn in these years →"] }, null)?.kind === "word-on-drawn"],
    ["a bare word beside a drawn data line is the wrong word", judgeCard({ theoryBlank: true, words: ["none drawn in these years →"] }, "theory: none drawn in these years →")?.kind === "wrong-word"],
    ["the right word passes", judgeCard({ theoryBlank: true, words: ["theory: none drawn in these years →"] }, "theory: none drawn in these years →") === null],
    // Codex r1 red arms: the right word beside a line the page drew, or a line it left blank.
    ["the right word beside a drawn theory curve is a defect", judgeCard({ theoryBlank: false, words: ["theory: none drawn in these years →"] }, "theory: none drawn in these years →", { theory: "after" })?.kind === "line-drawn-against-oracle"],
    ["a data word beside a drawn data line is a defect", judgeCard({ theoryBlank: false, dataBlank: false, words: ["data: none drawn in these years →"] }, "data: none drawn in these years →", { theory: null, data: "after" })?.kind === "line-drawn-against-oracle"],
    ["a blank data line the oracle says is drawn is a defect", judgeCard({ theoryBlank: false, dataBlank: true, words: [] }, null, { theory: null, data: null })?.kind === "line-blank-against-oracle"],
    ["lines and word as the oracle says pass", judgeCard({ theoryBlank: true, dataBlank: true, words: ["theory and data: none drawn in these years →"] }, "theory and data: none drawn in these years →", { theory: "after", data: "after" }) === null],
    ["a lone move draws no line", !drawsLine("M10,20Z") && !drawsLine("") && drawsLine("M10,20L30,40")],
    ["a non-finite coordinate draws no line (Codex r2)", !drawsLine("M10,NaNZ") && !drawsLine("M10,20L30,NaN") && !drawsLine("M0,0LInfinity,1")],
    ["ink-soft at 65% on paper fails 4.5:1", contrast(blend([0x4a, 0x4a, 0x48], [0xfa, 0xfa, 0xf6], 0.65), [0xfa, 0xfa, 0xf6]) < 4.5],
    ["ink at 65% on paper passes 4.5:1", contrast(blend([0x1a, 0x1a, 0x1a], [0xfa, 0xfa, 0xf6], 0.65), [0xfa, 0xfa, 0xf6]) >= 4.5],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  const failed = checks.filter(([, ok]) => !ok).length;
  console.log(`selftest: ${checks.length - failed} of ${checks.length} passed`);
  return failed ? 1 : 0;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop())) {
  const args = process.argv.slice(2);
  process.exitCode = args.includes("--selftest") ? selftest() : await run(args.find((a) => !a.startsWith("--")) ?? "https://sinusoidalhistory.com");
}
