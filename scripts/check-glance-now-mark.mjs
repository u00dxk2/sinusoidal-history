// Does the home page's glance figure mark where any curve sits "now" on a
// phone's first screen?
//
// I-048. Walk B (2026-10-16, docs/walks/2026-10-16-i052-i048.md) read the ring
// on Dalio's crest at the bold 2026 line as "peaking now", with two visible
// verdicts beside it; walks A4/A5 read the same drawn position on the claim page
// as agreement. A mark on the drawing at the current year is read as the site's
// answer, whatever the words say. This counts those marks inside the glance
// figure that start above the fold:
//
//   ring   — any svg <circle> anywhere in the figure (the now-ring)
//   line   — any svg <line> anywhere in the figure (the dashed now-line)
//   label  — any rendered leaf element whose text names the current year as a
//            word ("2026", "now · 2026"); sr-only text counts, because it is
//            read to a screen-reader user on the same first screen
//
// and checks that the figure, every row's drawn curve and the visible verdict
// line are there, so a figure that failed to render (or rendered empty rows)
// cannot read as clean. Codex r11 found both of those holes in the first cut.
//
//   node scripts/check-glance-now-mark.mjs [origin] [--width N --height N]
//   node scripts/check-glance-now-mark.mjs --selftest
//
// Without --width/--height it reads both phone viewports, 390x664 and 320x568.
// Exit 0 no mark on the first screen · 1 at least one mark · 2 the figure or its
// verdict line is missing or hidden, or fewer rows draw a curve than there are
// cycles. NOT caught: a now-mark drawn anywhere OUTSIDE the glance figure (a
// facet card, the brush); a mark drawn as some other primitive (a <rect>, a
// <path> marker, a CSS pseudo-element); a brushed range other than the default
// (the run loads plain /). It cannot tell an ordinary axis tick that happens to
// equal the current year from a now label: the default range's ticks do not
// include it, and a brush that does would read MARKED (declared, not patched).
// The walk is the instrument for what a reader takes from the picture.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const FIGURE = 'figure[aria-labelledby="cycle-overview-title"]';
const CYCLE_COUNT = JSON.parse(
  readFileSync(join(import.meta.dirname, "../src/data/cycles.json"), "utf8"),
).length;

export const VIEWPORTS = [
  { width: 390, height: 664 },
  { width: 320, height: 568 },
];

// One viewport's verdict from what the page reported.
export function judge(read, expectedRows = CYCLE_COUNT) {
  if (!read.figure) return { state: "MISSING", why: `no visible ${FIGURE}` };
  if (!read.verdictLine) return { state: "MISSING", why: "no visible [data-glance-verdict] line" };
  if (read.drawnRows !== expectedRows)
    return { state: "MISSING", why: `${read.drawnRows} of ${expectedRows} rows draw a curve` };
  const total = read.marks.ring + read.marks.line + read.marks.label;
  return total > 0 ? { state: "MARKED", total } : { state: "CLEAN", total: 0 };
}

export function summary(results) {
  const clean = results.filter((r) => r.state === "CLEAN").length;
  const exit = results.some((r) => r.state === "MISSING")
    ? 2
    : results.some((r) => r.state === "MARKED")
      ? 1
      : 0;
  return { line: `${clean} of ${results.length} viewports show no now-mark on the glance figure's first screen`, exit };
}

function selftest() {
  const none = { ring: 0, line: 0, label: 0 };
  const shipped = { ring: 10, line: 10, label: 1 };
  const ok = { figure: true, verdictLine: true, drawnRows: 10 };
  const checks = [
    ["a figure with no marks is CLEAN", judge({ ...ok, marks: none }, 10).state === "CLEAN"],
    // The red arms: the shipped figure, and each kind of mark alone.
    ["the 10-16 figure (10 rings, 10 lines, a bold year) is MARKED", judge({ ...ok, marks: shipped }, 10).total === 21],
    ["a ring alone is MARKED", judge({ ...ok, marks: { ...none, ring: 1 } }, 10).state === "MARKED"],
    ["a now-line alone is MARKED", judge({ ...ok, marks: { ...none, line: 1 } }, 10).state === "MARKED"],
    ["a current-year label alone is MARKED", judge({ ...ok, marks: { ...none, label: 1 } }, 10).state === "MARKED"],
    ["a missing figure is MISSING, never CLEAN", judge({ figure: false, verdictLine: false, drawnRows: 0, marks: none }, 10).state === "MISSING"],
    ["a dropped verdict line is MISSING, never CLEAN", judge({ ...ok, verdictLine: false, marks: none }, 10).state === "MISSING"],
    // Codex r11: a figure whose rows did not draw had nothing to count and read CLEAN.
    ["empty rows are MISSING, never CLEAN", judge({ ...ok, drawnRows: 0, marks: none }, 10).state === "MISSING"],
    ["one row short is MISSING", judge({ ...ok, drawnRows: 9, marks: none }, 10).state === "MISSING"],
    ["the year matcher finds a year inside other text", yearIn("now · 2026", "2026") && yearIn("2026", "2026")],
    ["the year matcher ignores a longer number and other years", !yearIn("20260", "2026") && !yearIn("75-year cycle", "2026") && !yearIn("2000", "2026")],
    ["one marked viewport makes the run exit 1", summary([{ state: "CLEAN" }, { state: "MARKED" }]).exit === 1],
    ["a missing figure outranks a mark: exit 2", summary([{ state: "MARKED" }, { state: "MISSING" }]).exit === 2],
    ["the count names its denominator", summary([{ state: "CLEAN" }, { state: "CLEAN" }]).line.startsWith("2 of 2 ")],
    ["both phone viewports are read by default", VIEWPORTS.length === 2 && VIEWPORTS.some((v) => v.width === 320 && v.height === 568)],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  const failed = checks.filter(([, ok]) => !ok).length;
  console.log(failed ? `selftest: ${failed} FAILED` : `selftest: ${checks.length} passed`);
  return failed ? 1 : 0;
}

// The current year as a whole word in a piece of text. Shared with the in-page read as source
// text, so the selftest exercises the same rule the browser runs.
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
    const read = await page.evaluate(({ sel, yearInSrc }) => {
      const yearIn = new Function(`return (${yearInSrc})`)();
      const fold = window.innerHeight;
      const shown = (el) => {
        const r = el.getBoundingClientRect();
        return el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && r.width + r.height > 0;
      };
      const above = (el) => shown(el) && el.getBoundingClientRect().top + window.scrollY < fold;
      const fig = document.querySelector(sel);
      if (!fig || !shown(fig)) return { figure: false, verdictLine: false, drawnRows: 0, marks: { ring: 0, line: 0, label: 0 } };
      const verdict = fig.querySelector("[data-glance-verdict]");
      const year = String(new Date().getFullYear());
      // A row draws when its svg holds a path with a non-empty d and a rendered box.
      const drawnRows = [...fig.querySelectorAll("li")].filter((li) =>
        [...li.querySelectorAll("svg path")].some((p) => (p.getAttribute("d") ?? "").length > 0 && shown(p)),
      ).length;
      return {
        figure: true,
        verdictLine: !!verdict && shown(verdict),
        drawnRows,
        marks: {
          ring: [...fig.querySelectorAll("svg circle")].filter(above).length,
          line: [...fig.querySelectorAll("svg line")].filter(above).length,
          label: [...fig.querySelectorAll("*")]
            .filter((el) => el.children.length === 0 && yearIn(el.textContent ?? "", year))
            .filter(above).length,
        },
      };
    }, { sel: FIGURE, yearInSrc: yearIn.toString() });
    await page.close();
    const v = judge(read);
    results.push(v);
    const detail =
      v.state === "MISSING" ? v.why
      : `rings ${read.marks.ring} · now-lines ${read.marks.line} · current-year labels ${read.marks.label}`;
    console.log(`  ${v.state.padEnd(7)} ${origin}/ @ ${vp.width}x${vp.height}  ${detail}`);
  }
  await browser.close();
  const s = summary(results);
  console.log(s.exit === 0 ? `OK: ${s.line}` : `RED: ${s.line}`);
  return s.exit;
}

const args = process.argv.slice(2);
process.exit(args.includes("--selftest") ? selftest() : await run(args));
