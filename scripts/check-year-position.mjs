// Read every /cycles/<slug> page's "where this year sits" sentence and hold it against /api/v1/state.
//
//   node scripts/check-year-position.mjs [origin]
//
//   node scripts/check-year-position.mjs --selftest   (red arms, no network)
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// The API is the independent side: its cos, phase and next peak/trough come from cycleStateAtYear
// on a force-dynamic route, and the page's sentence is a prerender (revalidated daily). Legs per
// cycle: the page's sentence equals the one rebuilt here from the API's raw fields, word for word
// (year, phase wording and crossing direction, the peak/low's own year, cos, both next extrema,
// the construction caveat); its link goes to /state/<year>; and the page's visible text carries
// no "\$" (series.json once
// held `\\$`, which a reader saw as a backslash). At 390x664 it also PRINTS, without judging, how
// far below the first screen the sentence starts — that is W-003's question, not a pass/fail.
// Written for I-009 (2026-09-29). Red arm: the production build before this change has no
// #where-now element, so the first leg fails on all ten pages.
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const origin = (process.argv[2] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
const fmtCos = (v) => (v > 0 ? `+${v.toFixed(2)}` : v < 0 ? `−${Math.abs(v).toFixed(2)}` : "0.00");

// The WHOLE sentence a page should print, rebuilt here from the API's raw fields (period, reference
// peak, phase, next peak/trough) — never by importing the site's own helper, so a bug there cannot
// pass itself. Codex review 2026-09-29: an earlier version checked fragments and passed a sentence
// with the wrong crossing direction, a peak "in 1900" and a trough "in 9999".
function expectedSentence(e, year) {
  const nearest = (offset) => {
    const anchor = e.reference_peak_year + offset;
    return Math.round(anchor + Math.round((year - anchor) / e.period_years) * e.period_years);
  };
  const cos = fmtCos(e.cos);
  const peakFirst = e.next_peak_year < e.next_trough_year;
  const both = peakFirst
    ? `The next high falls around ${e.next_peak_year}, and the next low around ${e.next_trough_year}.`
    : `The next low falls around ${e.next_trough_year}, and the next high around ${e.next_peak_year}.`;
  const lead = `By this page's curve, ${year} sits`;
  switch (e.phase) {
    case "peaking":
      return `${lead} at a peak (the curve tops out in ${nearest(0)}; cos ${cos}). The next low falls around ${e.next_trough_year}.`;
    case "troughing":
      return `${lead} at a low (the curve bottoms out in ${nearest(e.period_years / 2)}; cos ${cos}). The next high falls around ${e.next_peak_year}.`;
    case "rising":
      return `${lead} on the rising arm (cos ${cos}). ${both}`;
    case "falling":
      return `${lead} on the falling arm (cos ${cos}). ${both}`;
    case "crossing":
      return `${lead} at the midline, on the way ${peakFirst ? "up" : "down"} (cos ${cos}). ${both}`;
    default:
      return `unknown phase ${e.phase}`;
  }
}

/** The page's text is the expected sentence, then the construction caveat and the link. */
const matches = (text, e, year) => text.startsWith(`${expectedSentence(e, year)} That is a position`);

if (process.argv.includes("--selftest")) {
  const tail = " That is a position of this construction, not the theorist's forecast. Every cycle in 2026 →";
  const modelski = { period_years: 110, reference_peak_year: 1945, cos: -0.09, phase: "crossing", next_peak_year: 2055, next_trough_year: 2110 };
  const dalio = { period_years: 75, reference_peak_year: 1950, cos: 1, phase: "peaking", next_peak_year: 2100, next_trough_year: 2063 };
  const m = `By this page's curve, 2026 sits at the midline, on the way up (cos −0.09). The next high falls around 2055, and the next low around 2110.${tail}`;
  const d = `By this page's curve, 2026 sits at a peak (the curve tops out in 2025; cos +1.00). The next low falls around 2063.${tail}`;
  const cases = [
    ["modelski as printed", m, modelski, true],
    ["dalio as printed", d, dalio, true],
    ["crossing direction flipped", m.replace("on the way up", "on the way down"), modelski, false],
    ["second extremum wrong", m.replace("2110", "9999"), modelski, false],
    ["peak year wrong", d.replace("2025", "1900"), dalio, false],
    ["cos sign wrong", m.replace("−0.09", "+0.09"), modelski, false],
    ["caveat missing", m.replace(tail, ""), modelski, false],
  ];
  let bad = 0;
  for (const [name, text, e, want] of cases) {
    const got = matches(text, e, 2026);
    if (got !== want) bad += 1;
    console.log(`${got === want ? "PASS" : "FAIL"}  selftest ${name} → ${got ? "match" : "no match"}`);
  }
  console.log(`selftest: ${cases.length - bad}/${cases.length} ${bad ? "FAIL" : "PASS"}`);
  process.exit(bad ? 3 : 0);
}

const state = await (await fetch(`${origin}/api/v1/state`)).json();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 664 } });

for (const entry of state.cycles) {
  const path = new URL(entry.page).pathname;
  const tag = path.replace("/cycles/", "");
  await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
  const el = page.locator("#where-now");
  if ((await el.count()) === 0) {
    check(`${tag} sentence present`, false, "no #where-now");
    continue;
  }
  const text = (await el.innerText()).replace(/\s+/g, " ").trim();
  check(
    `${tag} sentence = API ${state.year} (${entry.phase}, cos ${fmtCos(entry.cos)})`,
    matches(text, entry, state.year),
    matches(text, entry, state.year) ? "" : `got "${text.slice(0, 140)}" want "${expectedSentence(entry, state.year).slice(0, 140)}"`
  );
  const href = await el.locator("a").getAttribute("href");
  check(`${tag} links /state/${state.year}`, href === `/state/${state.year}`, href ?? "no link");
  const body = await page.locator("body").innerText();
  check(`${tag} no "\\$" on the page`, !body.includes("\\$"));
  const box = await el.boundingBox();
  console.log(`      ${tag} at 390x664: sentence top ${Math.round(box.y)}px (first screen ends at 664)`);
}

await browser.close();
// The roster is the API's; a page that silently dropped out of it would shrink the denominator.
const roster = JSON.parse(readFileSync(new URL("../src/data/cycles.json", import.meta.url), "utf8")).length;
check(`roster: API served ${state.cycles.length} of cycles.json's ${roster}`, state.cycles.length === roster);
const pass = results.filter(Boolean).length;
console.log(`${pass}/${results.length} ${pass === results.length ? "PASS" : "FAIL"}`);
process.exit(pass === results.length ? 0 : 3);
