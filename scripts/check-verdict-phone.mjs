// Does the spectral verdict table answer on a phone without a sideways swipe? (I-012)
//
//   node scripts/check-verdict-phone.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// Written 2026-09-30. Measured on production that morning: VerdictTable (/cycles and /methods)
// is a 576px table inside a 353px sideways scroller on a 393-wide phone. The VERDICT column sat
// wholly off-screen at 393 and at 320, "Years short" was cut at 393 and hidden at 320, and
// nothing said the table scrolls. The same shape I-011 replaced on /state (check-state-phone).
//
// Legs, on /cycles and /methods, at the iPhone 15 preset (coarse pointer proven) and 320x568
// with touch: for each primary verdict in /data/spectral/verdicts.json, the page's entry
// ([data-verdict-id]) shows the verdict in words (the state's reader label, not its code),
// "<P>y period", "<S>y record", "<C> of 3.0 periods" and "needs <N> more years" (or "long
// enough") — each equal to the JSON, each visible, each wholly inside the viewport and
// unclipped by any ancestor; each unpaired cycle's entry says "Not tested"; nothing on the page
// scrolls sideways; each cycle link is at least 44px tall. At 1440x900 the table shows its 6
// headers by name, one row per entry, each verdict cell equal to the JSON; the phone list is hidden.
// The independent side is the frozen verdicts.json fetched from the origin, never the page's own
// data. The shortfall is recomputed here as ceil(3 x period - span) for ineligible rows — the
// same arithmetic the component states, written out again so a slip there does not pass itself.
// Red arm: production before this change has no [data-verdict-id], so every per-row leg fails.
// NOT seen (named, as check-state-phone names them): occlusion by a later-painted element,
// colour contrast, and whether the reader can scroll DOWN to the list.
import { chromium, devices } from "playwright";

const origin = (process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const [vRes, cRes] = await Promise.all([fetch(`${origin}/data/spectral/verdicts.json`), fetch(`${origin}/api/v1/cycles`)]);
const verdicts = vRes.ok ? await vRes.json() : null;
const cyclesApi = cRes.ok ? await cRes.json() : null;
const primary = verdicts?.primary;
const allCycles = Array.isArray(cyclesApi) ? cyclesApi : cyclesApi?.cycles;
if (!Array.isArray(primary) || primary.length === 0 || !Array.isArray(allCycles)) {
  console.log(`FAIL  verdicts.json HTTP ${vRes.status} / /api/v1/cycles HTTP ${cRes.status} — nothing to hold the page against`);
  process.exit(3);
}
// The reader-facing words for each state, written out here rather than imported from
// src/lib/spectral.ts, so the check states what a reader should see independently of the site.
const LABELS = {
  INSUFFICIENT_DATA: "Insufficient data — no test possible",
  NO_SIGNIFICANT_TARGET_POWER: "No significant target power",
  MODEL_SENSITIVE: "Model-sensitive — no verdict",
  SIGNIFICANT_TARGET_POWER: "Significant target power",
};
const unknownState = primary.find((v) => !LABELS[v.state]);
if (unknownState) {
  console.log(`FAIL  verdicts.json state "${unknownState.state}" has no reader label in this check — add it before reading GREEN`);
  process.exit(3);
}
const want = primary.map((v) => {
  const short = v.eligible ? 0 : Math.max(0, Math.ceil(3 * v.period_years - v.span_years));
  return {
    id: v.cycle_id,
    state: v.state,
    verdict: LABELS[v.state],
    period: `${v.period_years}y period`,
    record: `${v.span_years}y record`,
    periods: `${v.cycles_covered.toFixed(1)} of 3.0 periods`,
    short: short > 0 ? `needs ${short} more years` : "long enough",
  };
});
const unpaired = allCycles.map((c) => c.id).filter((id) => !primary.some((v) => v.cycle_id === id));
const browser = await chromium.launch();

const phones = [
  ["iPhone 15", devices["iPhone 15"]],
  ["320x568", { viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true }],
];

// Reads one [data-verdict-id] entry where it actually renders.
function readEntry(id) {
  const seen = { visibilityProperty: true, opacityProperty: true };
  const item = document.querySelector(`[data-verdict-id="${id}"]`);
  if (!item || !item.checkVisibility(seen)) return null;
  const vw = window.innerWidth;
  const field = (name) => {
    const el = item.querySelector(`[data-field="${name}"]`);
    if (!el || !el.checkVisibility(seen)) return null;
    const r = el.getBoundingClientRect();
    let inside = r.left >= 0 && r.right <= vw + 0.5 && r.width > 0;
    for (let a = el.parentElement; a && inside; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if ((cs.overflowX !== "visible" || cs.overflowY !== "visible") && a !== document.documentElement && a !== document.body) {
        const b = a.getBoundingClientRect();
        inside = r.left >= b.left - 0.5 && r.right <= b.right + 0.5 && r.top >= b.top - 0.5 && r.bottom <= b.bottom + 0.5;
      }
    }
    return { text: el.textContent.replace(/\s+/g, " ").trim(), inside };
  };
  const link = item.querySelector("a");
  return {
    fields: Object.fromEntries(["verdict", "period", "record", "periods", "short", "untested"].map((n) => [n, field(n)])),
    linkH: link ? link.getBoundingClientRect().height : 0,
  };
}

for (const path of ["/cycles", "/methods"]) {
  const url = origin + path;
  for (const [label, opts] of phones) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const env = await page.evaluate(() => {
      const scrollers = [...document.querySelectorAll("*")].filter((el) => {
        const cs = getComputedStyle(el);
        return el.checkVisibility() && /auto|scroll/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 1;
      });
      return {
        coarse: matchMedia("(pointer: coarse)").matches,
        vw: window.innerWidth,
        pageScrollW: document.documentElement.scrollWidth,
        scrollers: scrollers.map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 60)),
      };
    });
    const at = `${path} ${label}`;
    check(`${at}: coarse pointer`, env.coarse, `(pointer: coarse) = ${env.coarse}`);
    check(`${at}: no page scroll sideways`, env.pageScrollW <= env.vw, `scrollWidth ${env.pageScrollW} vs ${env.vw}`);
    check(`${at}: no sideways scroller on the page`, env.scrollers.length === 0, env.scrollers.join(", ") || "none");

    for (const w of want) {
      const got = await page.evaluate(readEntry, w.id);
      const tag = `${at}: ${w.id}`;
      if (!got) {
        check(`${tag} entry shown`, false, "no visible [data-verdict-id]");
        continue;
      }
      for (const name of ["verdict", "period", "record", "periods", "short"]) {
        const f = got.fields[name];
        check(
          `${tag} ${name}`,
          !!f && f.text.toLowerCase() === w[name].toLowerCase() && f.inside,
          f ? `"${f.text}" (JSON ${w[name]})${f.inside ? "" : " — OUTSIDE the viewport or clipped"}` : "missing"
        );
      }
      check(`${tag} link ≥44px`, got.linkH >= 44, `${got.linkH.toFixed(2)}px`);
    }
    for (const id of unpaired) {
      const got = await page.evaluate(readEntry, id);
      const f = got?.fields.untested;
      check(`${at}: ${id} says not tested`, !!f && /^not tested/i.test(f.text) && f.inside, f ? `"${f.text}"` : "no visible entry");
    }
    await ctx.close();
  }

  // Desktop: the table still answers, by header and by verdict, and the phone list is hidden.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const d = await page.evaluate(() => {
    const table = [...document.querySelectorAll("table")].find((t) => /Spectral verdict/.test(t.caption?.textContent ?? ""));
    const shown = !!table && table.checkVisibility({ visibilityProperty: true, opacityProperty: true });
    return {
      shown,
      heads: shown ? [...table.querySelectorAll("thead th")].map((th) => th.textContent.replace(/\s+/g, " ").trim()) : [],
      rows: shown ? [...table.querySelectorAll("tbody tr")].map((tr) => [...tr.querySelectorAll("td")].map((td) => td.textContent.trim())) : [],
      listShown: [...document.querySelectorAll("[data-verdict-id]")].some((el) => el.checkVisibility()),
    };
  });
  const heads = ["Cycle", "Period", "Record", "Periods of 3.0", "Years short", "Verdict"];
  check(`${path} 1440: table shown`, d.shown);
  check(`${path} 1440: headers by name`, d.heads.join("|") === heads.join("|"), d.heads.join(" | "));
  check(`${path} 1440: ${want.length + unpaired.length} rows`, d.rows.length === want.length + unpaired.length, `${d.rows.length} rows`);
  const verdictCells = d.rows.filter((c) => c.length === 6).map((c) => c[5]);
  check(
    `${path} 1440: verdict cells equal the JSON, in order`,
    verdictCells.join("|") === want.map((w) => w.state).join("|"),
    verdictCells.join(" ")
  );
  check(`${path} 1440: phone list hidden`, !d.listShown);
  await ctx.close();
}

await browser.close();
const bad = results.filter((ok) => !ok).length;
console.log(`${results.length - bad}/${results.length} ${bad ? "FAIL" : "PASS"}  (${origin})`);
process.exit(bad ? 3 : 0);
