// Does every entry page answer its question on a phone's first screen?
//
// measure-fold.mjs reads one surface per run, so the entry pages used to get
// read on different days and a shared change (the header, a global style) could
// push another page's answer below the fold with nothing catching it. This walks
// the whole roster in one browser and prints one count: legs that answer, out of
// legs walked. The roster is one table; each row states its QUESTION first, so a
// reviewer can judge whether the selector is aimed at the answer rather than at a
// container (the /methods lesson, 2026-09-22: the container read RED at 98px while
// the answer itself was visible with 57px to spare).
//
//   node scripts/check-entry-folds.mjs [origin] [--width N] [--height N]
//   node scripts/check-entry-folds.mjs --selftest
//
// origin defaults to https://sinusoidalhistory.com; the viewport to 390x664, the
// real visible area of an iPhone 14 in Safari (see measure-fold.mjs).
// Exit 0 every leg answers · 1 at least one is cut · 2 at least one is missing
// or hidden (display:none, visibility:hidden, opacity 0 — on the answer or an
// ancestor). NOT caught: an answer clipped by an overflow:hidden ancestor, which
// measure-fold.mjs cannot see either. The roster is PHONE-layout: at 640px and up the home leg's overview
// is hidden by design and reads HIDDEN, which is correct, not a defect.
import { readFileSync } from "node:fs";
import { join } from "node:path";

const CYCLES = JSON.parse(
  readFileSync(join(import.meta.dirname, "../src/data/cycles.json"), "utf8"),
);

// A cycle page's URL is its id with underscores swapped for hyphens (AGENTS.md).
const slugOf = (id) => id.replace(/_/g, "-");

export function roster(cycles) {
  return [
    {
      question: "Does the last of the ten overview rows reach the first screen, so all ten cycles are visible?",
      path: "/",
      selector: '[data-overview-id="turchin_fathers_sons"] svg',
    },
    {
      question: "Does the first cycle in the index — its name and one-line description — reach the first screen?",
      path: "/cycles",
      selector: "header + ul > li:first-child a > p",
    },
    {
      question: "Does the in-brief answer to 'is any of this real?' reach the first screen?",
      path: "/methods",
      selector: 'section[aria-label="In brief"] > p:nth-of-type(2)',
    },
    ...cycles.map((c) => ({
      question: `Does the "Does it hold up?" verdict for ${c.name} reach the first screen?`,
      path: `/cycles/${slugOf(c.id)}`,
      selector: "#does-it-hold-up p",
    })),
  ];
}

// One leg's verdict from its measured box. `box` is null when nothing matched.
// A zero-area box is HIDDEN, never OK: a display:none answer (the home overview
// under `sm:hidden` at 640px and up) reports bottom 0, which would otherwise read
// as the whole viewport to spare (Codex review, 2026-09-25).
export function verdict(box, height) {
  if (!box) return { state: "MISSING" };
  if (box.hidden) return { state: "HIDDEN" };
  const cut = box.bottom - height;
  return cut > 0 ? { state: "CUT", px: cut } : { state: "OK", px: -cut };
}

export function summary(results) {
  const ok = results.filter((r) => r.state === "OK").length;
  const exit = results.some((r) => r.state === "MISSING" || r.state === "HIDDEN")
    ? 2
    : results.some((r) => r.state === "CUT")
      ? 1
      : 0;
  return { line: `${ok} of ${results.length} entry-page legs answer on the first screen`, exit };
}

function selftest() {
  const legs = roster(CYCLES);
  const cyclePaths = legs.filter((l) => l.path.startsWith("/cycles/")).map((l) => l.path);
  const verdicts = [verdict({ bottom: 600 }, 664), verdict({ bottom: 700 }, 664), verdict(null, 664)];
  const checks = [
    ["the roster is the three fixed pages plus one leg per cycle", legs.length === 3 + CYCLES.length],
    ["every cycle in cycles.json has a leg", CYCLES.every((c) => cyclePaths.includes(`/cycles/${slugOf(c.id)}`))],
    ["slugs swap underscores for hyphens", cyclePaths.includes("/cycles/turchin-fathers-sons") && !cyclePaths.some((p) => p.includes("_"))],
    ["every leg states its question first", legs.every((l) => Object.keys(l)[0] === "question" && l.question.endsWith("?"))],
    ["no leg uses measure-fold's implicit default", legs.every((l) => l.selector.length > 0)],
    ["an answer above the fold is OK with its room", verdicts[0].state === "OK" && verdicts[0].px === 64],
    // The red arms: a cut answer and a missing element both fail the run.
    ["an answer below the fold is CUT by its overflow", verdicts[1].state === "CUT" && verdicts[1].px === 36],
    ["a missing element is MISSING, not OK", verdicts[2].state === "MISSING"],
    ["a zero-area (hidden) element is HIDDEN, not OK", verdict({ bottom: 0, hidden: true }, 664).state === "HIDDEN"],
    ["a hidden leg makes the run exit 2", summary([verdicts[0], verdict({ bottom: 0, hidden: true }, 664)]).exit === 2],
    ["one cut leg makes the run exit 1", summary([verdicts[0], verdicts[1]]).exit === 1],
    ["a missing leg outranks a cut one: exit 2", summary(verdicts).exit === 2],
    ["the count names its denominator", summary([verdicts[0], verdicts[0]]).line.startsWith("2 of 2 ")],
  ];
  for (const [name, ok] of checks) console.log(`${ok ? "ok  " : "FAIL"} ${name}`);
  const failed = checks.filter(([, ok]) => !ok).length;
  console.log(failed ? `selftest: ${failed} FAILED` : `selftest: ${checks.length} passed`);
  return failed ? 1 : 0;
}

function flag(args, name, fallback) {
  const i = args.indexOf(name);
  return i === -1 ? fallback : Number(args[i + 1]);
}

async function run(args) {
  const origin = (args.find((a) => !a.startsWith("--") && !/^\d+$/.test(a)) ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
  const width = flag(args, "--width", 390);
  const height = flag(args, "--height", 664);
  // Loaded here, not at the top, so --selftest runs where no browser is installed.
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  const results = [];
  console.log(`${origin} @ ${width}x${height}`);
  for (const leg of roster(CYCLES)) {
    await page.goto(origin + leg.path, { waitUntil: "networkidle" });
    const box = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      // checkVisibility covers display:none, visibility:hidden and opacity 0 on
      // the answer or any ancestor. Clipping by an overflow:hidden ancestor is NOT
      // covered — the same blindness measure-fold.mjs has.
      const visible = el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
      return { bottom: Math.round(r.bottom + window.scrollY), hidden: !visible || r.width === 0 || r.height === 0 };
    }, leg.selector);
    const v = verdict(box, height);
    results.push(v);
    const detail =
      v.state === "OK" ? `${v.px}px spare`
      : v.state === "CUT" ? `${v.px}px below the fold`
      : v.state === "HIDDEN" ? `${leg.selector} matched but renders zero-size`
      : `no ${leg.selector}`;
    console.log(`  ${v.state.padEnd(7)} ${leg.path.padEnd(32)} ${detail}`);
  }
  await browser.close();
  const s = summary(results);
  console.log(s.exit === 0 ? `OK: ${s.line}` : `RED: ${s.line}`);
  return s.exit;
}

const args = process.argv.slice(2);
process.exit(args.includes("--selftest") ? selftest() : await run(args));
