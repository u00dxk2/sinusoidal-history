// Does /state/<year> answer on a phone without a sideways swipe? Held against /api/v1/state.
//
//   node scripts/check-state-phone.mjs [origin] [--year YYYY]
//
// origin defaults to https://sinusoidalhistory.com; --year defaults to the API's current year.
// Exit 0 all PASS, 3 any FAIL.
// Written 2026-09-29 (round 3). A cold walk that day found the page's table 576px wide inside a
// 353px sideways scroller on an iPhone 15: PHASE cut to "RIS / FAL / PEA", NEXT PEAK and NEXT
// TROUGH off-screen, and nothing saying the table scrolls. At 320 wide even cos was cut.
//
// Legs, at the iPhone 15 preset (coarse pointer proven, not assumed) and at 320x568 with touch:
// for each of the API's cycles, the page's entry shows the phase word, "peak <next peak year>"
// and "trough <next trough year>" (the label rides with the year, so a swapped label fails),
// each equal to the API's value, each visible (visibility and opacity included), each wholly
// inside the viewport and not clipped by any ancestor; nothing on the page scrolls sideways; the
// cycle's link is at least 44px tall, unrounded. At 1440x900 the table shows its 7 headers by
// name and, per cycle, the API's phase, next peak and next trough; the phone list is hidden.
// Both widths also hold each entry's reason line near a turning point (see expectedReason).
// The API is the independent side (force-dynamic, cycleStateAtYear); the page's fields are read
// from where they actually render, never from the page's own data.
// Red arm: production before this change has no phone list, so every per-cycle leg fails.
// NOT seen: occlusion by a later-painted element, colour contrast, and whether the reader can
// scroll DOWN to the list (a root `overflow: hidden` would pass; html/body are not treated as
// clipping ancestors). The table's whole text is proven by the rendered-text multiset, not here.
// Codex round 2 (2026-09-29) found the scroll case; it is the second blind-spot finding in two
// rounds, so the check names it here instead of growing another leg.
import { chromium, devices } from "playwright";

const argv = process.argv.slice(2);
const yearAt = argv.indexOf("--year");
const yearArg = yearAt >= 0 ? argv[yearAt + 1] : null;
const positional = argv.filter((a, i) => !a.startsWith("--") && !(yearAt >= 0 && i === yearAt + 1));
const origin = (positional[0] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

// --year is refused unless it is four digits: a missing or bad value must never fall back to
// the current year and read GREEN on the wrong page.
if (yearAt >= 0 && !/^\d{4}$/.test(yearArg ?? "")) {
  console.log(`REFUSED  --year needs a four-digit year, got ${JSON.stringify(yearArg ?? null)}`);
  process.exit(2);
}
const res = await fetch(`${origin}/api/v1/state${yearArg ? `?year=${yearArg}` : ""}`);
const state = res.ok ? await res.json() : null;
if (!state || !Array.isArray(state.cycles) || !state.year) {
  console.log(`FAIL  /api/v1/state answered HTTP ${res.status} with no cycles — nothing to hold the page against`);
  process.exit(3);
}
const year = state.year;
const url = `${origin}/state/${year}`;

// The reason line (I-013, added 2026-10-03; David: keep the band, make the line say why). Recomputed
// here from the API's period and reference peak, sharing no code with src/lib/stateOfCycles.ts:
// near a peak or trough (the word is peaking/troughing, or |cos| >= 0.9) the entry says how far the
// year is from that turning point and how wide its band is in years; elsewhere it says nothing.
const fmt = (v) => String(Math.round(v * 100) / 100);
function expectedReason(e) {
  const raw = (year - e.reference_peak_year) / e.period_years;
  const f = raw - Math.floor(raw);
  const cos = Math.cos(2 * Math.PI * f);
  const turning = e.phase === "peaking" || e.phase === "troughing";
  if (!turning && Math.abs(cos) < 0.9) return null;
  const peak = cos > 0;
  const off = peak ? (f > 0.5 ? f - 1 : f) : f - 0.5;
  const d = fmt(Math.abs(off) * e.period_years);
  const kind = peak ? "peak" : "trough";
  // A turning point between whole years: say where it is, and, if it is ahead, what the
  // row's rounded next-turn year shows (the API's own next_peak_year / next_trough_year).
  const at = e.reference_peak_year + (peak ? 0 : e.period_years / 2) + Math.round((year - e.reference_peak_year - (peak ? 0 : e.period_years / 2)) / e.period_years) * e.period_years;
  const atS = fmt(at);
  const shown = peak ? e.next_peak_year : e.next_trough_year;
  const where = !atS.includes(".") ? "" : off < 0 ? ` at ${atS} (shown as ${shown})` : ` at ${atS}`;
  const lead = d === "0" ? `At its ${kind}` : `${d} ${d === "1" ? "year" : "years"} ${off < 0 ? "before" : "after"} its ${kind}${where}`;
  // inside/outside follows the API's own label.
  return `${lead}, ${turning ? "inside" : "outside"} the ${peak ? "peaking" : "troughing"} band: ${fmt(0.03 * e.period_years)} ${fmt(0.03 * e.period_years) === "1" ? "year" : "years"} either side, 3% of a ${e.period_years}-year cycle.`;
}
const browser = await chromium.launch();

const phones = [
  ["iPhone 15", devices["iPhone 15"]],
  ["320x568", { viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true }],
];

for (const [label, opts] of phones) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const env = await page.evaluate(() => {
    // Any visible element that scrolls sideways, the page itself included.
    const scrollers = [...document.querySelectorAll("*")].filter((el) => {
      const cs = getComputedStyle(el);
      return (
        el.checkVisibility() &&
        /auto|scroll/.test(cs.overflowX) &&
        el.scrollWidth > el.clientWidth + 1
      );
    });
    return {
      coarse: matchMedia("(pointer: coarse)").matches,
      vw: window.innerWidth,
      pageScrollW: document.documentElement.scrollWidth,
      scrollers: scrollers.map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 60)),
    };
  });
  check(`${label}: coarse pointer`, env.coarse, `(pointer: coarse) = ${env.coarse}`);
  check(`${label}: no page scroll sideways`, env.pageScrollW <= env.vw, `scrollWidth ${env.pageScrollW} vs ${env.vw}`);
  check(`${label}: no sideways scroller on the page`, env.scrollers.length === 0, env.scrollers.join(", ") || "none");

  for (const e of state.cycles) {
    const got = await page.evaluate((id) => {
      const seen = { visibilityProperty: true, opacityProperty: true };
      const item = document.querySelector(`[data-state-id="${id}"]`);
      if (!item || !item.checkVisibility(seen)) return null;
      const vw = window.innerWidth;
      const field = (name) => {
        const el = item.querySelector(`[data-field="${name}"]`);
        if (!el || !el.checkVisibility(seen)) return null;
        const r = el.getBoundingClientRect();
        let inside = r.left >= 0 && r.right <= vw + 0.5 && r.width > 0;
        // Any ancestor that clips (overflow other than visible) must contain the field whole.
        for (let a = el.parentElement; a && inside; a = a.parentElement) {
          const cs = getComputedStyle(a);
          if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
            const b = a.getBoundingClientRect();
            if (a !== document.documentElement && a !== document.body)
              inside = r.left >= b.left - 0.5 && r.right <= b.right + 0.5 && r.top >= b.top - 0.5 && r.bottom <= b.bottom + 0.5;
          }
        }
        return { text: el.textContent.replace(/\s+/g, " ").trim(), inside };
      };
      const link = item.querySelector("a");
      return {
        phase: field("phase"),
        peak: field("next-peak"),
        trough: field("next-trough"),
        reason: field("phase-reason"),
        reasonCount: item.querySelectorAll('[data-field="phase-reason"]').length,
        linkH: link ? link.getBoundingClientRect().height : 0,
      };
    }, e.id);
    const tag = `${label}: ${e.id}`;
    if (!got) {
      check(`${tag} entry shown`, false, "no visible [data-state-id]");
      continue;
    }
    const leg = (name, f, want, from = "API") =>
      check(
        `${tag} ${name}`,
        !!f && f.text.toLowerCase() === String(want).toLowerCase() && f.inside,
        f ? `"${f.text}" (${from} ${want})${f.inside ? "" : " — OUTSIDE the viewport or clipped"}` : "missing"
      );
    leg("phase", got.phase, e.phase);
    leg("next peak", got.peak, `peak ${e.next_peak_year}`);
    leg("next trough", got.trough, `trough ${e.next_trough_year}`);
    const why = expectedReason(e);
    if (why) {
      leg("reason", got.reason, why, "want");
      // Exactly one: a second, contradicting line must not ride behind a correct first (Codex r1-4).
      check(`${tag} one reason line`, got.reasonCount === 1, `${got.reasonCount} reason line(s)`);
    }
    else check(`${tag} no reason away from a turning point`, got.reasonCount === 0, `${got.reasonCount} reason line(s)`);
    check(`${tag} link ≥44px`, got.linkH >= 44, `${got.linkH.toFixed(2)}px`);
  }
  await ctx.close();
}

// Desktop: the table still answers, by header name and by value, and the phone list is hidden.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const d = await page.evaluate(() => {
    const table = document.querySelector("table");
    const shown = !!table && table.checkVisibility({ visibilityProperty: true, opacityProperty: true });
    return {
      shown,
      heads: shown ? [...table.querySelectorAll("thead th")].map((th) => th.textContent.replace(/\s+/g, " ").trim()) : [],
      rows: shown
        ? [...table.querySelectorAll("tbody tr")].map((tr) => ({
            href: tr.querySelector("a")?.getAttribute("href") ?? "",
            cells: [...tr.querySelectorAll("td")].map((td) => td.textContent.trim()),
            // The phase cell holds the word and, near a turning point, the reason under it.
            phase: tr.querySelector('[data-field="phase"]')?.textContent.trim() ?? null,
            reasons: [...tr.querySelectorAll('[data-field="phase-reason"]')].map((el) => ({
              text: el.textContent.replace(/\s+/g, " ").trim(),
              seen: el.checkVisibility({ visibilityProperty: true, opacityProperty: true }),
            })),
          }))
        : [],
      listShown: [...document.querySelectorAll("[data-state-id]")].some((el) => el.checkVisibility()),
    };
  });
  const want = ["Cycle", "Period", "Ref. peak", `cos in ${year}`, "Phase", "Next peak", "Next trough"];
  check("1440: table shown", d.shown);
  check("1440: headers by name", d.heads.join("|") === want.join("|"), d.heads.join(" | "));
  check(`1440: ${state.cycles.length} rows`, d.rows.length === state.cycles.length, `${d.rows.length} rows`);
  for (const e of state.cycles) {
    const slug = new URL(e.page).pathname;
    const row = d.rows.find((r) => r.href === slug);
    const c = row?.cells ?? [];
    const ok = !!row && row.phase?.toLowerCase() === e.phase && c[5] === String(e.next_peak_year) && c[6] === String(e.next_trough_year);
    check(`1440: ${e.id} phase/next peak/next trough`, ok, row ? `${row.phase} ${c[5]} ${c[6]} (API ${e.phase} ${e.next_peak_year} ${e.next_trough_year})` : `no row for ${slug}`);
    const why = expectedReason(e);
    const rs = row?.reasons ?? [];
    const rOk = why ? rs.length === 1 && rs[0].seen && rs[0].text === why : rs.length === 0;
    check(`1440: ${e.id} reason`, !!row && rOk, why ? `${rs[0] ? `"${rs[0].text}"` : "missing"} (want "${why}")` : `${rs.length} reason line(s), want none`);
  }
  check("1440: phone list hidden", !d.listShown);
  await ctx.close();
}

await browser.close();
const bad = results.filter((ok) => !ok).length;
console.log(`${results.length - bad}/${results.length} ${bad ? "FAIL" : "PASS"}  (${url})`);
process.exit(bad ? 3 : 0);
