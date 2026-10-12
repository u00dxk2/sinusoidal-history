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
// Round 2 (2026-09-29) added the figure's now-mark legs: the dot, read back from pixels at 1280
// wide, lands on the API's year and cos; and the "now · <year>" label is ≥11px and fully on
// screen at 390 and 320 wide. Red arm: production before it has no [data-mark="now"].
// Round 3 (2026-10-11, I-036) added the bare-cos legs: no cycle page's visible text, nor /about's,
// nor the served about.md, llms.txt and vdem_libdem.source.md, prints "cos <number>". Red arm:
// production before it printed "cos ≈ …" on turchin, strauss-howe, /about and all three files.
// Blind to: the home chart's Calibrate tab (client-rendered behind a tab, never opened here) and
// every page not named above. src/lib/bareCos.test.ts reads the sources and covers that surface.
// /state keeps "cos" on purpose, with its footnote, and is not read.
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
      return `${lead} at a peak (the curve tops out in ${nearest(0)}; curve height ${cos}, from −1 at a low to +1 at a peak). The next low falls around ${e.next_trough_year}.`;
    case "troughing":
      return `${lead} at a low (the curve bottoms out in ${nearest(e.period_years / 2)}; curve height ${cos}, from −1 at a low to +1 at a peak). The next high falls around ${e.next_peak_year}.`;
    case "rising":
      return `${lead} on the rising arm (curve height ${cos}, from −1 at a low to +1 at a peak). ${both}`;
    case "falling":
      return `${lead} on the falling arm (curve height ${cos}, from −1 at a low to +1 at a peak). ${both}`;
    case "crossing":
      return `${lead} at the midline, on the way ${peakFirst ? "up" : "down"} (curve height ${cos}, from −1 at a low to +1 at a peak). ${both}`;
    default:
      return `unknown phase ${e.phase}`;
  }
}

/** The page's text is the expected sentence, then the construction caveat and the link. */
const matches = (text, e, year) => text.startsWith(`${expectedSentence(e, year)} That is a position`);

// The figure's "now" dot, read back from pixels into (year, value) — the inverse of the page's
// x()/y() in CurveFigure, so the page's own numbers are never trusted: only where the dot actually
// landed on the drawn SVG. start/end come from the figcaption's first and last labels. Added
// 2026-09-29 (round 2): until then the only marked point on the curve was the reference peak.
//
// Since I-033 shape (a) (2026-10-12) the curve has two geometries, chosen by the drawn SVG's
// viewBox height: a page with no record keeps one 150-unit band (padY 14); a page with a record
// draws a 164-unit figure whose curve band is the top 104 units (padY 10), the record in a
// strip below. Written out here so this script stands alone. An unknown viewBox reads NaN, which
// never agrees: a new geometry is a refusal to judge, not a guess.
const CURVE_GEOMETRY = { 150: { band: 150, pad: 14 }, 164: { band: 104, pad: 10 } };
function dotReading(svg, dot, start, end, viewBoxHeight) {
  const g = CURVE_GEOMETRY[viewBoxHeight];
  const cx = dot.x + dot.width / 2 - svg.x;
  const cy = dot.y + dot.height / 2 - svg.y;
  const scale = svg.height / viewBoxHeight;
  const band = g ? g.band * scale : NaN;
  const pad = g ? g.pad * scale : NaN;
  return {
    year: start + (cx / svg.width) * (end - start),
    value: (band / 2 - cy) / (band / 2 - pad),
  };
}
// At 1280 wide the figure is ~700px across: ~0.6 years and ~0.02 of cos per pixel.
const dotAgrees = (r, year, cos) => Math.abs(r.year - year) <= 1 && Math.abs(r.value - cos) <= 0.03;

// "cos", optionally "≈" or "=", then a signed number: the shape a reader cannot read. The same
// rule as src/lib/bareCos.test.ts, written out here so this script stands alone.
const BARE_COS = /\bcos\s*[≈=]?\s*[−+-]?\d/u;
const bareCosAt = (text) => text.match(new RegExp(`.{0,40}${BARE_COS.source}.{0,20}`, "u"))?.[0];
// A surface passes only if it answered 2xx, carries no bare cos, AND carries the reworded
// "curve height ≈", so an empty body or an error page cannot pass for clean prose (Codex
// review of 62b69f1).
function bareCosVerdict(status, text) {
  if (status < 200 || status > 299) return { ok: false, detail: `HTTP ${status}` };
  const hit = bareCosAt(text);
  if (hit) return { ok: false, detail: `"${hit}"` };
  if (!text.includes("curve height ≈")) return { ok: false, detail: `no "curve height ≈" in ${text.length} chars — not the prose this leg reads` };
  return { ok: true, detail: "" };
}

if (process.argv.includes("--selftest")) {
  const tail = " That is a position of this construction, not the theorist's forecast. Every cycle in 2026 →";
  const modelski = { period_years: 110, reference_peak_year: 1945, cos: -0.09, phase: "crossing", next_peak_year: 2055, next_trough_year: 2110 };
  const dalio = { period_years: 75, reference_peak_year: 1950, cos: 1, phase: "peaking", next_peak_year: 2100, next_trough_year: 2063 };
  const m = `By this page's curve, 2026 sits at the midline, on the way up (curve height −0.09, from −1 at a low to +1 at a peak). The next high falls around 2055, and the next low around 2110.${tail}`;
  const d = `By this page's curve, 2026 sits at a peak (the curve tops out in 2025; curve height +1.00, from −1 at a low to +1 at a peak). The next low falls around 2063.${tail}`;
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
  // Dot arms, window 1600-2050. Dalio 2026 (cos +1.00) sits at x = 426/450·700 = 662.7, at the
  // top of the curve band (y = pad); a 10px dot is centred there. Unpaired: a 700x116.67 svg,
  // pad 14·(700/900) = 10.89. Paired: a 700x127.56 svg, pad 10·(700/900) = 7.78, curve band
  // 104·(700/900) = 80.89 tall, so its midline is 40.44 — NOT the svg's own middle.
  const at = (cx, cy) => ({ x: cx - 5, y: cy - 5, width: 10, height: 10 });
  const s = 700 / 900;
  const one = { x: 0, y: 0, width: 700, height: 150 * s };
  const two = { x: 0, y: 0, width: 700, height: 164 * s };
  const dots = [
    ["unpaired: dot on dalio 2026", one, 150, at(662.7, 14 * s), true],
    ["unpaired: dot 4px right (a later year)", one, 150, at(666.7, 14 * s), false],
    ["unpaired: dot on the midline (cos 0)", one, 150, at(662.7, one.height / 2), false],
    ["unpaired: dot at the reference peak 1950", one, 150, at((350 / 450) * 700, 14 * s), false],
    ["paired: dot on dalio 2026", two, 164, at(662.7, 10 * s), true],
    ["paired: dot on the curve band's midline (cos 0)", two, 164, at(662.7, 52 * s), false],
    ["paired: read with the unpaired geometry", two, 150, at(662.7, 10 * s), false],
    ["unknown viewBox height", two, 170, at(662.7, 10 * s), false],
  ];
  for (const [name, svg, vbh, dot, want] of dots) {
    const got = dotAgrees(dotReading(svg, dot, 1600, 2050, vbh), 2026, 1);
    if (got !== want) bad += 1;
    console.log(`${got === want ? "PASS" : "FAIL"}  selftest ${name} → ${got ? "agrees" : "disagrees"}`);
  }
  const prose = [
    ["bare cos ≈ in a rationale", "near a trough (cos ≈ −0.81 at 1780)", true],
    ["bare cos in a sentence", "on the rising arm (cos +0.67)", true],
    ["curve height with its scale", "(curve height ≈ +0.15, on a scale from −1 at a low to +1 at a peak)", false],
    ["a formula", "r reduces to cos(Δφ)", false],
  ];
  for (const [name, text, want] of prose) {
    const got = Boolean(bareCosAt(text));
    if (got !== want) bad += 1;
    console.log(`${got === want ? "PASS" : "FAIL"}  selftest ${name} → ${got ? "bare cos" : "clean"}`);
  }
  const surfaces = [
    ["reworded prose, 200", 200, "climax of ~1860 (curve height ≈ +0.91 at 1860, on a scale …)", true],
    ["empty body, 200", 200, "", false],
    ["error page, 503", 503, "Service Unavailable", false],
    ["bare cos, 200", 200, "curve height ≈ +0.91 … near a trough (cos ≈ −0.81 at 1780)", false],
  ];
  for (const [name, status, text, want] of surfaces) {
    const got = bareCosVerdict(status, text).ok;
    if (got !== want) bad += 1;
    console.log(`${got === want ? "PASS" : "FAIL"}  selftest surface ${name} → ${got ? "pass" : "fail"}`);
  }
  const total = cases.length + dots.length + prose.length + surfaces.length;
  console.log(`selftest: ${total - bad}/${total} ${bad ? "FAIL" : "PASS"}`);
  process.exit(bad ? 3 : 0);
}

// Bad input is a stated refusal (exit 2), checked BEFORE the browser starts: an unchecked `{}`
// from the API used to throw inside the page loop with Chromium already up, and the process
// hung instead of exiting (src/lib/check-year-position.test.ts, 2026-10-05).
const refuse = (why) => {
  console.log(`REFUSED  ${why}`);
  process.exit(2);
};
if (!/^https?:\/\/[^/\s]+$/.test(origin)) refuse(`origin must be an http(s) URL with no path, got "${origin}"`);
let state;
try {
  const res = await fetch(`${origin}/api/v1/state`);
  if (!res.ok) refuse(`${origin}/api/v1/state answered HTTP ${res.status}`);
  state = await res.json();
} catch {
  refuse(`${origin}/api/v1/state could not be read as JSON`);
}
if (!Number.isInteger(state?.year) || !Array.isArray(state?.cycles) || state.cycles.length === 0) {
  refuse(`${origin}/api/v1/state has no year and cycles list`);
}
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
  const cosHit = bareCosAt(body);
  check(`${tag} no bare "cos <number>" on the page`, !cosHit, cosHit ? `"${cosHit}"` : "");
  const box = await el.boundingBox();
  console.log(`      ${tag} at 390x664: sentence top ${Math.round(box.y)}px (first screen ends at 664)`);
}

// The same rule on /about (it repeats two rationales and the Strauss-Howe claim) and on the
// three served text files that carried a bare cos before round 3.
const bareCosLeg = (name, status, text) => {
  const v = bareCosVerdict(status, text);
  check(`${name} no bare "cos <number>"`, v.ok, v.detail);
};
const aboutRes = await page.goto(`${origin}/about`, { waitUntil: "domcontentloaded" });
bareCosLeg("/about", aboutRes?.status() ?? 0, await page.locator("body").innerText());
for (const file of ["/about.md", "/llms.txt", "/data/vdem_libdem.source.md"]) {
  const res = await fetch(`${origin}${file}`);
  bareCosLeg(file, res.status, res.ok ? await res.text() : "");
}

// The figure's now-mark. Geometry at 1280 wide (finest pixels); the label at the two phone
// widths the fold gate reads, where an end-of-window label is most likely to run off-screen.
const wide = await browser.newPage({ viewport: { width: 1280, height: 900 } });
for (const entry of state.cycles) {
  const path = new URL(entry.page).pathname;
  const tag = path.replace("/cycles/", "");
  await wide.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
  const dot = wide.locator('[data-mark="now"]');
  if ((await dot.count()) !== 1) {
    check(`${tag} figure marks ${state.year}`, false, `${await dot.count()} now-marks`);
    continue;
  }
  const fig = wide.locator("figure", { has: dot });
  const svgEl = fig.locator("svg").first();
  const svgBox = await svgEl.boundingBox();
  const viewBoxHeight = Number((await svgEl.getAttribute("viewBox"))?.split(/\s+/)[3]);
  const caps = await fig.locator("figcaption > span").allInnerTexts();
  const start = Number(caps[0]);
  const end = Number(caps[caps.length - 1]);
  const r = dotReading(svgBox, await dot.boundingBox(), start, end, viewBoxHeight);
  check(
    `${tag} figure's dot = API ${state.year} (cos ${fmtCos(entry.cos)})`,
    dotAgrees(r, state.year, entry.cos),
    `read year ${r.year.toFixed(1)}, value ${r.value.toFixed(2)} (window ${start}-${end}, viewBox height ${viewBoxHeight})`
  );
  // How close the now-line sits to the reference-peak marker (Turchin: 2020 vs 2026).
  const peak = await fig.locator('[data-mark="ref-peak"]').boundingBox();
  if (peak) {
    const gap = Math.abs(peak.x + peak.width / 2 - (svgBox.x + ((state.year - start) / (end - start)) * svgBox.width));
    console.log(`      ${tag} at 1280: now-line ${Math.round(gap)}px from the reference-peak dot`);
  }
}
await wide.close();

for (const [w, h] of [[390, 664], [320, 568]]) {
  const phone = await browser.newPage({ viewport: { width: w, height: h } });
  for (const entry of state.cycles) {
    const path = new URL(entry.page).pathname;
    const tag = path.replace("/cycles/", "");
    await phone.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
    const label = phone.locator('[data-mark="now-label"]');
    if ((await label.count()) !== 1) {
      check(`${tag} at ${w}: now label present`, false, `${await label.count()} labels`);
      continue;
    }
    const text = (await label.innerText()).trim();
    const size = await label.evaluate((n) => parseFloat(getComputedStyle(n).fontSize));
    const lb = await label.boundingBox();
    const ok = text === `now · ${state.year}` && size >= 11 && lb.x >= 0 && lb.x + lb.width <= w;
    check(
      `${tag} at ${w}: label "now · ${state.year}", ≥11px, on screen`,
      ok,
      `"${text}" ${size}px, x ${Math.round(lb.x)}-${Math.round(lb.x + lb.width)} of ${w}`
    );
    // Both points stay visible where they meet (Codex review 2026-09-29: on Turchin at phone
    // width the now-dot covered the reference dot whole). Hit-test the reference ring's edge on
    // the side AWAY from the now-dot: the topmost element there must be the ring itself.
    const seen = await phone.evaluate(() => {
      const ref = document.querySelector('[data-mark="ref-peak"]');
      const now = document.querySelector('[data-mark="now"]');
      if (!ref || !now) return { ok: false, why: "missing mark" };
      ref.scrollIntoView({ block: "center" });
      const r = ref.getBoundingClientRect();
      const n = now.getBoundingClientRect();
      const rc = [r.x + r.width / 2, r.y + r.height / 2];
      const nc = [n.x + n.width / 2, n.y + n.height / 2];
      let dx = rc[0] - nc[0];
      let dy = rc[1] - nc[1];
      const len = Math.hypot(dx, dy) || 1;
      if (Math.hypot(dx, dy) === 0) dx = -1;
      dx /= len; dy /= len;
      const edge = r.width / 2 - 1;
      const hit = document.elementFromPoint(rc[0] + dx * edge, rc[1] + dy * edge);
      return { ok: hit === ref, why: `${Math.round(Math.hypot(rc[0] - nc[0], rc[1] - nc[1]))}px apart, edge hit ${hit?.dataset?.mark ?? hit?.tagName}` };
    });
    check(`${tag} at ${w}: reference-peak ring visible beside the now-dot`, seen.ok, seen.why);
  }
  await phone.close();
}

await browser.close();
// The roster is the API's; a page that silently dropped out of it would shrink the denominator.
const roster = JSON.parse(readFileSync(new URL("../src/data/cycles.json", import.meta.url), "utf8")).length;
check(`roster: API served ${state.cycles.length} of cycles.json's ${roster}`, state.cycles.length === roster);
const pass = results.filter(Boolean).length;
console.log(`${pass}/${results.length} ${pass === results.length ? "PASS" : "FAIL"}`);
process.exit(pass === results.length ? 0 : 3);
