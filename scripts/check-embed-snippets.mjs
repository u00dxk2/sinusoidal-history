// Paste every /embed/docs snippet into a page on ANOTHER origin and judge what a writer's reader sees.
//
//   node scripts/check-embed-snippets.mjs [origin]
//
//   node scripts/check-embed-snippets.mjs --selftest   (red arms, no network)
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 2 REFUSED, 3 any FAIL.
// Flow 3 (docs/key-user-flows.md), written for I-037 (2026-10-11 round 4). Each snippet is the
// served <pre> text, decoded and pasted AS SERVED — only its production host is pointed at the
// origin under test, so a local build can be judged before it ships (Codex r1: an earlier version
// rebuilt the iframe and dropped the served attributes). It goes into a blank page served from
// 127.0.0.1 and is rendered at 390x844 (touch) and 1440x900. "Visible" below always means: every
// line box of the element lies inside the frame's viewport and a hit-test at its centre lands on the
// element (so clipping, covering, display/visibility/opacity and zero size all fail it). Codex r2
// found three round-1 defect classes again; the answer was this change of SHAPE — structural marks
// the components set (data-curve="theory", data-calibration-for) and hit-tests — not more matchers.
// Stated rules — none is a pixel count measured today:
//   0. POPULATION: the docs serve a state-only snippet and a single-cycle snippet that overrides
//      something. A rule cannot pass by its snippet being deleted.
//   1. the src answers 200 with frame-ancestors * and no X-Frame-Options value, and the frame
//      hydrates (leaves its "loading…" fallback and renders its footer) — else nothing more is judged;
//   2. no horizontal overflow inside the frame;
//   3. FIT: a frame that is not a multi-cycle facet stack shows its whole document and its own
//      attribution link ("via Sinusoidal History") is visible. The multi-cycle facet stack is the one
//      declared scroller; the overlay is declared wide-only (in a frame under 640px its legend stacks
//      above the chart, so it may scroll there), and the docs page must carry that note in the
//      overlay snippet's own block, not display/visibility/opacity-hidden. NARROWED after Codex r3:
//      that leg proves the note is PRESENT there, not that it is readable (ancestor clipping is not
//      judged on the docs page). A state-only frame shows every cycle's row (the API's count);
//   4. a single-cycle embed's chart is THAT cycle's (its aria-label names the cycle), at least 180px
//      tall and visible, and its marked path[data-curve="theory"] — never the data series beside
//      it — has a stroke colour, non-zero opacity and a geometry spanning at least half the chart.
//      NARROWED after Codex r3 (third appearance of the hidden-curve class): this leg does NOT
//      certify the line is painted — stroke width, dash and paint are not judged; a reviewer or a
//      frame owns "can a reader see the line";
//   5. a snippet with a peak./period. override calibrates something (the value differs from the
//      published one in /api/v1/cycles), and that cycle's own [data-calibration-for] clause, visible,
//      reads EXACTLY "<name>, <clauses>" as rebuilt here from the API — the override beside the
//      site's value, and the site's reference peak always named (the review's contract);
//   6. no tap target does nothing, stated structurally: an embed's only controls are toggles, so
//      every enabled button carries aria-pressed and a real pointer click flips it (a button
//      without aria-pressed fails by rule); every link has a real href.
// Red arm (measured 2026-10-12: 25/42 PASS, 17 legs FAIL): production before I-037 fails 3 on state-only, Huntington and the overlay at 1440 (and the
// overlay's docs note is absent), 4 on Huntington (a 60px curve), 5 on Huntington (1968 IS the
// published peak, so the "calibration" example calibrated nothing) and 6 on every facet header.
// Blind to (its ceiling, stated so nobody adds matchers to chase it): snippets a writer composes by
// hand from the query-param list; widths other than the two sampled (a 358px and a 680px column —
// nothing here proves a continuous range, and a column under 358px wraps text the fixed heights
// do not cover); real hosts' CSS (the paste page is bare, like a Substack body); whether a button
// does what its label says (rule 6 proves it does SOMETHING), and click targets that are not
// buttons (the overlay's pin-year area, removed with I-061 on 2026-10-21); the curve's shape
// against the math (the unit tests own that: drawnPeriod.test.ts).
import http from "node:http";
import { chromium } from "playwright";

const PROD = "https://sinusoidalhistory.com";
const MIN_CURVE_PX = 180;

// --- pure judges (the selftest drives these) ---
const decode = (s) =>
  s.replace(/<!-- -->/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
const snippetsFrom = (html) =>
  [...html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>/g)].map((m) => decode(m[1])).filter((s) => /<iframe/.test(s));
const parseSnippet = (code) => {
  const src = code.match(/src="([^"]+)"/)?.[1];
  const height = Number(code.match(/height="(\d+)"/)?.[1]);
  if (!src || !Number.isFinite(height)) return null;
  const u = new URL(src);
  const view = u.searchParams.get("view") ?? "facets";
  const ids = (u.searchParams.get("cycles") ?? "").split(",").filter(Boolean);
  const overrides = [];
  for (const [k, v] of u.searchParams) {
    const m = k.match(/^(peak|period)\.(.+)$/);
    if (m) overrides.push({ kind: m[1], id: m[2], value: Number(v) });
  }
  return {
    code, src, height, view, ids, overrides,
    single: view === "facets" && ids.length === 1,
    scroller: view === "facets" && ids.length !== 1,
    wideOnly: view === "overlay",
  };
};
const populationGaps = (snips) => {
  const gaps = [];
  if (!snips.some((s) => s.view === "state-only")) gaps.push("no state-only snippet");
  if (!snips.some((s) => s.single && s.overrides.length > 0)) gaps.push("no single-cycle snippet with an override");
  return gaps;
};
const frameHeaders = (status, csp, xfo) =>
  status === 200 && /frame-ancestors \*/.test(csp ?? "") && !(xfo ?? "").trim();
const fits = (m) => m.sh <= m.ch + 1 && m.footerVisible;
const curveOk = (c, name) =>
  !!c && c.label.startsWith(`${name} curve from`) && c.visible && c.h >= MIN_CURVE_PX && c.pathH >= c.h / 2;
const overrideCalibrates = (ov, published) =>
  published !== undefined && ov.value !== (ov.kind === "peak" ? published.reference_peak_year : published.period_years);
// Every override on one cycle, as the clauses the page must print — rebuilt from the API, never by
// importing src/lib/embedCalibration.ts, so a bug there cannot pass itself.
const expectedClauses = (ovs, pub) => {
  const peak = ovs.find((o) => o.kind === "peak" && o.value !== pub.reference_peak_year);
  const period = ovs.find((o) => o.kind === "period" && o.value !== pub.period_years);
  const out = [];
  if (peak) out.push(`peak ${peak.value} (the site's reference peak is ${pub.reference_peak_year})`);
  if (period) out.push(`period ${period.value}y (the site's is ${pub.period_years}y)`);
  if (!peak && period) out.push(`the site's reference peak ${pub.reference_peak_year}`);
  return out;
};
// Exact: the cycle's own marked clause span, as painted, equals the clause rebuilt here.
const disclosed = (text, pub, clauses) =>
  !!text && clauses.length > 0 && text === `${pub.name}, ${clauses.join(", ")}`;
// Rule 6, stated structurally (Codex r2: a DOM diff around a click also caught hover effects): the
// only controls an embed has are toggles, so every enabled button must carry aria-pressed and a
// pointer click must flip it. A button without aria-pressed fails by rule.
const toggleFlipped = (before, after) => (before === "true" || before === "false") && after !== before && (after === "true" || after === "false");

if (process.argv.includes("--selftest")) {
  let bad = 0;
  let total = 0;
  const t = (name, got, want) => {
    total += 1;
    if (got !== want) bad += 1;
    console.log(`${got === want ? "PASS" : "FAIL"}  selftest ${name} → ${got}`);
  };
  const pre = (src, h) => `<pre class="x">&lt;iframe\n  src=&quot;${src}&quot;\n  height=&quot;${h}&quot;\n  loading=&quot;lazy&quot;\n&gt;&lt;/iframe&gt;</pre>`;
  const docs = `<p>x</p>${pre(`${PROD}/embed?view=state-only`, 360)}${pre(`${PROD}/embed?view=facets&amp;cycles=huntington&amp;peak.huntington=1968`, 280)}<pre>not a snippet</pre>`;
  const sn = snippetsFrom(docs);
  t("two snippets parsed off docs HTML", sn.length, 2);
  const hun = parseSnippet(sn[1]);
  t("served attributes kept for the paste", /loading="lazy"/.test(hun.code), true);
  t("huntington is single", hun.single, true);
  t("huntington override parsed", `${hun.overrides[0]?.kind}.${hun.overrides[0]?.id}=${hun.overrides[0]?.value}`, "peak.huntington=1968");
  t("state-only is not a scroller", parseSnippet(sn[0]).scroller, false);
  t("all-cycle facets is a scroller", parseSnippet(`<iframe src="${PROD}/embed?view=facets&range=modern" height="900">`).scroller, true);
  t("overlay is wide-only", parseSnippet(`<iframe src="${PROD}/embed?view=overlay" height="620">`).wideOnly, true);
  t("single-cycle is not wide-only", hun.wideOnly, false);
  t("population: both present → no gap", populationGaps([parseSnippet(sn[0]), hun]).length, 0);
  t("population: huntington deleted → gap", populationGaps([parseSnippet(sn[0])]).join(), "no single-cycle snippet with an override");
  t("population: state-only deleted → gap", populationGaps([hun]).join(), "no state-only snippet");
  t("headers ok", frameHeaders(200, "frame-ancestors *", ""), true);
  t("headers: XFO set → red", frameHeaders(200, "frame-ancestors *", "DENY"), false);
  t("headers: no CSP → red", frameHeaders(200, null, null), false);
  t("headers: 404 → red", frameHeaders(404, "frame-ancestors *", ""), false);
  t("fit: production state-only (666 in 360) → red", fits({ sh: 666, ch: 360, footerVisible: false }), false);
  t("fit: content inside, footer seen → green", fits({ sh: 700, ch: 700, footerVisible: true }), true);
  t("fit: content fits but footer hidden → red", fits({ sh: 700, ch: 700, footerVisible: false }), false);
  const H = "Huntington — creedal passion";
  const curve = (o) => ({ label: `${H} curve from 1600 to 2050`, visible: true, h: 200, pathH: 160, ...o });
  t("curve: production 60px → red", curveOk(curve({ h: 60, pathH: 48 }), H), false);
  t("curve: 200px painted, visible → green", curveOk(curve(), H), true);
  t("curve: 200px but cut by the frame → red", curveOk(curve({ visible: false }), H), false);
  t("curve: empty svg (no painted path) → red", curveOk(curve({ pathH: 0 }), H), false);
  t("curve: another cycle's curve → red", curveOk(curve({ label: "Kondratiev wave curve from 1600 to 2050" }), H), false);
  t("curve: none drawn → red", curveOk(null, H), false);
  const pub = { name: H, reference_peak_year: 1968, period_years: 60 };
  t("override 1968 = published → red", overrideCalibrates({ kind: "peak", value: 1968 }, pub), false);
  t("override 1972 → green", overrideCalibrates({ kind: "peak", value: 1972 }, pub), true);
  t("override for unknown cycle → red", overrideCalibrates({ kind: "peak", value: 1972 }, undefined), false);
  const peakOnly = expectedClauses([{ kind: "peak", value: 1972 }], pub);
  const periodOnly = expectedClauses([{ kind: "period", value: 58 }], pub);
  t("period-only override still names the reference peak", periodOnly.join(", "), "period 58y (the site's is 60y), the site's reference peak 1968");
  t("disclosed: exact clause → green", disclosed(`${H}, peak 1972 (the site's reference peak is 1968)`, pub, peakOnly), true);
  t("disclosed: clause with extra words → red", disclosed(`${H}, peak 1972 (the site's reference peak is 1968) — not really`, pub, peakOnly), false);
  t("disclosed: period-only exact → green", disclosed(`${H}, period 58y (the site's is 60y), the site's reference peak 1968`, pub, periodOnly), true);
  t("toggle flips → green", toggleFlipped("true", "false"), true);
  t("toggle unchanged → red", toggleFlipped("true", "true"), false);
  t("not a toggle → red", toggleFlipped(null, null), false);
  t("disclosed: reversed attribution → red", disclosed(`${H}: the site's peak is 1972; this page uses 1968`, pub, peakOnly), false);
  t("disclosed: period without the reference peak → red", disclosed(`${H}, period 58y (the site's is 60y).`, pub, periodOnly), false);
  t("disclosed: no cycle name → red", disclosed("peak 1972 (the site's reference peak is 1968)", pub, peakOnly), false);
  t("no disclosure line → red", disclosed(null, pub, peakOnly), false);
  console.log(`selftest: ${total - bad}/${total} ${bad ? "FAIL" : "PASS"}`);
  process.exit(bad ? 3 : 0);
}

const refuse = (why) => {
  console.log(`REFUSED  ${why}`);
  process.exit(2);
};
const origin = (process.argv[2] ?? PROD).replace(/\/$/, "");
if (!/^https?:\/\/[^/\s]+$/.test(origin)) refuse(`origin must be an http(s) URL with no path, got "${origin}"`);

let docsHtml;
let published;
try {
  const d = await fetch(`${origin}/embed/docs`);
  if (!d.ok) refuse(`${origin}/embed/docs answered HTTP ${d.status}`);
  docsHtml = await d.text();
  const c = await fetch(`${origin}/api/v1/cycles`);
  if (!c.ok) refuse(`${origin}/api/v1/cycles answered HTTP ${c.status}`);
  published = await c.json();
} catch {
  refuse(`${origin} could not be read`);
}
if (!Array.isArray(published) || published.length === 0) refuse(`${origin}/api/v1/cycles has no cycles list`);
const byId = Object.fromEntries(published.map((c) => [c.id, c]));
// The served snippets name the production host (SITE_URL); judge them on the origin under test.
const snippets = snippetsFrom(docsHtml).map((code) => parseSnippet(code.split(PROD).join(origin)));
if (snippets.length === 0 || snippets.some((s) => !s)) refuse(`${origin}/embed/docs served no parseable iframe snippets`);

const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};
console.log(`${snippets.length} snippets on ${origin}/embed/docs`);
const gaps = populationGaps(snippets);
check("docs serve the state-only and the calibrated single-cycle snippet", gaps.length === 0, gaps.join("; "));

for (const s of snippets) {
  const tag = s.src.replace(origin, "");
  const r = await fetch(s.src);
  check(`${tag} frameable`, frameHeaders(r.status, r.headers.get("content-security-policy"), r.headers.get("x-frame-options")),
    `${r.status} csp=${r.headers.get("content-security-policy")} xfo=${JSON.stringify(r.headers.get("x-frame-options"))}`);
  for (const ov of s.overrides) {
    check(`${tag} ${ov.kind}.${ov.id}=${ov.value} calibrates something`, overrideCalibrates(ov, byId[ov.id]),
      byId[ov.id] ? `published ${ov.kind === "peak" ? byId[ov.id].reference_peak_year : byId[ov.id].period_years}` : "unknown cycle id");
  }
}

let current = "";
const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(current);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const host = `http://127.0.0.1:${server.address().port}/`;
// The writer's page: a bare essay column, the served snippet pasted between two paragraphs.
const pageFor = (s) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>a writer's page</title><style>body{font-family:Georgia,serif;max-width:680px;margin:0 auto;padding:16px}</style></head><body><p>Before the chart.</p>${s.code}<p>After the chart.</p></body></html>`;

const browser = await chromium.launch();
try {
  // Rule 3's overlay exemption is only honest if the writer can READ the note, in that snippet's block.
  if (snippets.some((s) => s.wideOnly)) {
    const docs = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await docs.goto(`${origin}/embed/docs`, { waitUntil: "load" });
    const note = await docs.evaluate(() => {
      const pre = [...document.querySelectorAll("pre")].find((p) => /view=overlay/.test(p.textContent));
      const block = pre?.parentElement;
      if (!block) return null;
      const p = [...block.querySelectorAll("p")].find((n) => /wider than 640px/.test(n.innerText));
      return !!p && p.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && p.getBoundingClientRect().height > 0;
    });
    check("docs carry the overlay's 'wider than 640px' note in its own block (presence, not readability)", note === true);
    await docs.close();
  }
  for (const vp of [{ w: 390, h: 844, mobile: true }, { w: 1440, h: 900, mobile: false }]) {
    for (const s of snippets) {
      const tag = `${vp.w} ${s.src.replace(origin, "")}`;
      current = pageFor(s);
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.mobile, hasTouch: vp.mobile });
      const page = await ctx.newPage();
      await page.goto(host, { waitUntil: "load" });
      await page.locator("iframe").scrollIntoViewIfNeeded();
      await page.waitForFunction((o) => [...document.querySelectorAll("iframe")].some((f) => f.src.startsWith(o)), origin);
      let frame = null;
      for (let i = 0; i < 40 && !frame; i++) {
        frame = page.frames().find((f) => f.url().startsWith(origin)) ?? null;
        if (!frame) await page.waitForTimeout(250);
      }
      if (!frame) {
        check(`${tag} frame loads`, false, "no frame document");
        await ctx.close();
        continue;
      }
      // Hydrated: the Suspense fallback is gone and the embed's footer exists. A frame stuck on its
      // fallback FAILS here and is judged no further (Codex r2: it used to pass as "loads").
      const hydrated = await frame.waitForFunction(() => !/loading…/.test(document.body.innerText) && document.querySelector("footer"), null, { timeout: 20000 }).then(() => true, () => false);
      if (!hydrated) {
        check(`${tag} frame loads`, false, "never left its loading fallback");
        await ctx.close();
        continue;
      }
      await page.waitForTimeout(1500);
      const single = s.single ? byId[s.ids[0]] : null;
      const m = await frame.evaluate((singleName) => {
        const d = document.documentElement;
        const vh = window.innerHeight;
        // Seen = painted where a reader looks: every line box of the element lies inside the frame and
        // a hit-test at its centre lands on the element itself. A hit-test answers clipping by an
        // overflow-hidden ancestor, covering, display/visibility and zero size in one question
        // (Codex r2: checkVisibility on the container missed clipped rows and hidden children).
        const seen = (el) => {
          if (!el || !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
          const rects = [...el.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
          return rects.length > 0 && rects.every((r) => {
            if (r.top < 0 || r.bottom > vh + 1) return false;
            const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            return !!hit && (hit === el || el.contains(hit));
          });
        };
        const via = [...document.querySelectorAll("footer a")].find((a) => /Sinusoidal History/.test(a.textContent));
        const rows = [...document.querySelectorAll('section[aria-label="Does each cycle hold up? Summary"] li')];
        let curve = null;
        if (singleName) {
          const svgs = [...document.querySelectorAll('svg[role="img"]')]
            .filter((n) => /curve from/.test(n.getAttribute("aria-label") ?? ""));
          const svg = svgs.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
          if (svg) {
            // The THEORY path only, as the component marks it — never the data series beside it
            // (Codex r2: the series path stood in for a deleted theory curve).
            const theory = svg.querySelector('path[data-curve="theory"]');
            const cs = theory ? getComputedStyle(theory) : null;
            const stroked = !!cs && cs.stroke !== "none" && Number(cs.strokeOpacity) > 0 && Number(cs.opacity) > 0 &&
              (theory.getAttribute("d") ?? "").length > 20;
            curve = {
              label: svg.getAttribute("aria-label") ?? "",
              visible: seen(svg),
              h: Math.round(svg.getBoundingClientRect().height),
              pathH: stroked ? Math.round(theory.getBoundingClientRect().height) : 0,
            };
          }
        }
        const calFor = {};
        for (const span of document.querySelectorAll("[data-calibration-for]")) {
          calFor[span.getAttribute("data-calibration-for")] = seen(span) ? span.innerText.replace(/\s+/g, " ").trim() : null;
        }
        return {
          sw: d.scrollWidth, cw: d.clientWidth, sh: d.scrollHeight, ch: vh,
          footerVisible: seen(via),
          rows: rows.length, rowsSeen: rows.filter(seen).length,
          curve,
          calFor,
        };
      }, single?.name ?? null);
      check(`${tag} frame loads`, true);
      check(`${tag} no horizontal overflow`, m.sw <= m.cw, `scrollWidth ${m.sw} / ${m.cw}`);
      if (s.wideOnly && m.cw < 640) {
        console.log(`      ${tag}: declared wide-only (the docs-note leg above judges whether the writer is told), content ${m.sh}px in ${m.ch}px`);
      } else if (!s.scroller) {
        check(`${tag} fits its frame, attribution visible`, fits(m), `content ${m.sh}px in ${m.ch}px, footer ${m.footerVisible ? "seen" : "hidden"}`);
      } else {
        console.log(`      ${tag}: declared scroller, content ${m.sh}px in ${m.ch}px`);
      }
      if (s.view === "state-only") {
        check(`${tag} shows every cycle's row`, m.rows === published.length && m.rowsSeen === published.length,
          `${m.rowsSeen} of ${m.rows} rows visible, the API has ${published.length}`);
      }
      if (single) {
        check(`${tag} ${single.id} chart ≥${MIN_CURVE_PX}px, visible, with its marked theory path (paint not judged)`, curveOk(m.curve, single.name),
          m.curve ? `${m.curve.h}px (path ${m.curve.pathH}px), ${m.curve.visible ? "visible" : "not visible"}, "${m.curve.label.slice(0, 50)}"` : "no curve");
      }
      const ids = [...new Set(s.overrides.map((o) => o.id))];
      for (const id of ids) {
        const pub = byId[id];
        const clauses = pub ? expectedClauses(s.overrides.filter((o) => o.id === id), pub) : [];
        const said = m.calFor[id] ?? null;
        check(`${tag} discloses ${id}'s calibration beside the site's reference peak`, !!pub && disclosed(said, pub, clauses),
          said ? `"${said.slice(0, 140)}"` : "no visible calibration clause for this cycle");
      }
      // Rule 6: every link has a real href; every enabled button, pointer-clicked, changes the DOM.
      const badLinks = await frame.evaluate(() =>
        [...document.querySelectorAll("a")]
          .filter((a) => { const h = a.getAttribute("href"); return !h || h === "#" || h.startsWith("javascript:"); })
          .map((a) => `link "${a.textContent.trim().slice(0, 30)}" has no href`));
      const buttons = frame.locator('button:not([disabled]), [role="button"]');
      const n = await buttons.count();
      const dead = [...badLinks];
      for (let i = 0; i < n; i++) {
        const b = buttons.nth(i);
        const label = ((await b.textContent()) || (await b.getAttribute("aria-label")) || "").trim().slice(0, 40);
        const before = await b.getAttribute("aria-pressed");
        if (before === null) {
          dead.push(`button "${label}" is not a toggle (no aria-pressed)`);
          continue;
        }
        const ok = await b.click({ timeout: 3000 }).then(() => true, () => false);
        await page.waitForTimeout(150);
        const after = await b.getAttribute("aria-pressed");
        if (!ok || !toggleFlipped(before, after)) {
          dead.push(`button "${label}" ${ok ? `click left aria-pressed=${after}` : "cannot be clicked"}`);
        }
      }
      check(`${tag} no dead tap targets (${n} buttons)`, dead.length === 0, dead.slice(0, 3).join("; "));
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}
const pass = results.filter(Boolean).length;
console.log(`${pass}/${results.length} ${pass === results.length ? "PASS" : "FAIL"}`);
process.exit(pass === results.length ? 0 : 3);
