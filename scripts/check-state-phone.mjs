// Does /state/<year> answer on a phone without a sideways swipe? Held against /api/v1/state.
//
//   node scripts/check-state-phone.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// Written 2026-09-29 (round 3). A cold walk that day found the page's table 576px wide inside a
// 353px sideways scroller on an iPhone 15: PHASE cut to "RIS / FAL / PEA", NEXT PEAK and NEXT
// TROUGH off-screen, and nothing saying the table scrolls. At 320 wide even cos was cut.
//
// Legs, at the iPhone 15 preset (coarse pointer proven, not assumed) and at 320x568 with touch:
// for each of the API's cycles, the page's entry shows the phase word, the next peak year and
// the next trough year, each equal to the API's value, each visible, and each wholly inside the
// viewport; nothing on the page scrolls sideways; the cycle's link is at least 44px tall.
// At 1440x900 the table still shows its 7 columns and one row per cycle, and the phone list
// is not shown. The API is the independent side (force-dynamic, cycleStateAtYear); the page's
// fields are read from where they actually render, never from the page's own data.
// Red arm: production before this change has no phone list, so every per-cycle leg fails.
import { chromium, devices } from "playwright";

const origin = (process.argv[2] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const state = await (await fetch(`${origin}/api/v1/state`)).json();
const year = state.year;
const url = `${origin}/state/${year}`;
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
      const item = document.querySelector(`[data-state-id="${id}"]`);
      if (!item || !item.checkVisibility()) return null;
      const vw = window.innerWidth;
      const field = (name) => {
        const el = item.querySelector(`[data-field="${name}"]`);
        if (!el || !el.checkVisibility()) return null;
        const r = el.getBoundingClientRect();
        return { text: el.textContent.trim(), inside: r.left >= 0 && r.right <= vw + 0.5 && r.width > 0 };
      };
      const link = item.querySelector("a");
      return {
        phase: field("phase"),
        peak: field("next-peak"),
        trough: field("next-trough"),
        linkH: link ? Math.round(link.getBoundingClientRect().height) : 0,
      };
    }, e.id);
    const tag = `${label}: ${e.id}`;
    if (!got) {
      check(`${tag} entry shown`, false, "no visible [data-state-id]");
      continue;
    }
    const leg = (name, f, want) =>
      check(
        `${tag} ${name}`,
        !!f && f.text.toLowerCase() === String(want).toLowerCase() && f.inside,
        f ? `"${f.text}" (API ${want})${f.inside ? "" : " — OUTSIDE the viewport"}` : "missing"
      );
    leg("phase", got.phase, e.phase);
    leg("next peak", got.peak, e.next_peak_year);
    leg("next trough", got.trough, e.next_trough_year);
    check(`${tag} link ≥44px`, got.linkH >= 44, `${got.linkH}px`);
  }
  await ctx.close();
}

// Desktop: the table is unchanged and the phone list stays out of sight.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const d = await page.evaluate(() => {
    const table = document.querySelector("table");
    const shown = !!table && table.checkVisibility();
    return {
      shown,
      heads: shown ? [...table.querySelectorAll("thead th")].map((th) => th.textContent.trim()) : [],
      rows: shown ? table.querySelectorAll("tbody tr").length : 0,
      cells: shown ? table.querySelectorAll("tbody td").length : 0,
      listShown: [...document.querySelectorAll("[data-state-id]")].some((el) => el.checkVisibility()),
    };
  });
  const n = state.cycles.length;
  check("1440: table shown", d.shown);
  check("1440: 7 column headers", d.heads.length === 7, d.heads.join(" | "));
  check(`1440: ${n} rows, ${n * 7} cells`, d.rows === n && d.cells === n * 7, `${d.rows} rows, ${d.cells} cells`);
  check("1440: phone list hidden", !d.listShown);
  await ctx.close();
}

await browser.close();
const bad = results.filter((ok) => !ok).length;
console.log(`${results.length - bad}/${results.length} ${bad ? "FAIL" : "PASS"}  (${url})`);
process.exit(bad ? 3 : 0);
