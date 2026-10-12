// Paste every /embed/docs snippet into a page on ANOTHER origin and judge what a writer's reader sees.
//
//   node scripts/check-embed-snippets.mjs [origin]
//
//   node scripts/check-embed-snippets.mjs --selftest   (red arms, no network)
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 2 REFUSED, 3 any FAIL.
// Flow 3 (docs/key-user-flows.md), written for I-037 (2026-10-11 round 4). The snippets are copied
// off the served docs page, byte for byte, the way a writer copies them; their src host is pointed
// at the origin under test so a local build can be judged before it ships. Each is pasted into a
// blank page served from 127.0.0.1 and rendered at 390x844 (touch) and 1440x900. Stated rules, per
// snippet and width — none of them is a pixel count measured today:
//   1. the src answers 200 with frame-ancestors * and no X-Frame-Options value, and the frame loads;
//   2. no horizontal overflow inside the frame;
//   3. FIT: a frame that is not a multi-cycle facet stack shows its whole document, so its own
//      attribution link ("via Sinusoidal History") is inside the visible frame. A multi-cycle facet
//      stack is the one declared scroller (ten charts do not fit a paragraph's worth of page), and
//      the overlay is declared wide-only: in a frame under 640px its legend stacks above the chart,
//      so it may scroll there, and the docs page must say so (its own leg);
//   4. a single-cycle embed draws its curve at least 180px tall, wholly inside the visible frame;
//   5. a snippet with a peak./period. override calibrates something (the value differs from the
//      published one in /api/v1/cycles), and the frame says so in visible text that names the
//      override and the published value;
//   6. no tap target does nothing: every enabled button in the frame changes the frame's DOM when
//      clicked, and every link has a real href.
// Red arm: production before I-037 fails 3 on state-only, Huntington and the overlay at 1440 (and
// the overlay's docs note is absent), 4 on Huntington (a 60px curve), 5 on Huntington (1968 IS the
// published peak, so the "calibration" example calibrated nothing) and 6 on every facet header.
// Blind to: snippets a writer composes by hand from the query-param list (only the four served
// snippets are pasted), widths other than the two named, and real hosts' CSS (the paste page is
// bare, like a Substack body).
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
    src, height, view, ids, overrides,
    single: view === "facets" && ids.length === 1,
    scroller: view === "facets" && ids.length !== 1,
    wideOnly: view === "overlay",
  };
};
const frameHeaders = (status, csp, xfo) =>
  status === 200 && /frame-ancestors \*/.test(csp ?? "") && !(xfo ?? "").trim();
const fits = (m) => m.sh <= m.ch + 1 && m.footerVisible;
const curveOk = (c) => !!c && c.h >= MIN_CURVE_PX && c.top >= 0 && c.bottom <= c.frameH + 1;
const overrideCalibrates = (ov, published) =>
  published !== undefined && ov.value !== (ov.kind === "peak" ? published.reference_peak_year : published.period_years);
const disclosed = (text, ov, published) => {
  if (!text) return false;
  const want = ov.kind === "peak" ? published.reference_peak_year : published.period_years;
  return text.includes(String(ov.value)) && text.includes(String(want));
};

if (process.argv.includes("--selftest")) {
  let bad = 0;
  let total = 0;
  const t = (name, got, want) => {
    total += 1;
    if (got !== want) bad += 1;
    console.log(`${got === want ? "PASS" : "FAIL"}  selftest ${name} → ${got}`);
  };
  const pre = (src, h) => `<pre class="x">&lt;iframe\n  src=&quot;${src}&quot;\n  height=&quot;${h}&quot;\n&gt;&lt;/iframe&gt;</pre>`;
  const docs = `<p>x</p>${pre(`${PROD}/embed?view=state-only`, 360)}${pre(`${PROD}/embed?view=facets&amp;cycles=huntington&amp;peak.huntington=1968`, 280)}<pre>not a snippet</pre>`;
  const sn = snippetsFrom(docs);
  t("two snippets parsed off docs HTML", sn.length, 2);
  const hun = parseSnippet(sn[1]);
  t("huntington is single", hun.single, true);
  t("huntington override parsed", `${hun.overrides[0]?.kind}.${hun.overrides[0]?.id}=${hun.overrides[0]?.value}`, "peak.huntington=1968");
  t("state-only is not a scroller", parseSnippet(sn[0]).scroller, false);
  t("all-cycle facets is a scroller", parseSnippet(`<iframe src="${PROD}/embed?view=facets&range=modern" height="900">`).scroller, true);
  t("overlay is not a scroller", parseSnippet(`<iframe src="${PROD}/embed?view=overlay" height="620">`).scroller, false);
  t("overlay is wide-only", parseSnippet(`<iframe src="${PROD}/embed?view=overlay" height="620">`).wideOnly, true);
  t("single-cycle is not wide-only", hun.wideOnly, false);
  t("headers ok", frameHeaders(200, "frame-ancestors *", ""), true);
  t("headers: XFO set → red", frameHeaders(200, "frame-ancestors *", "DENY"), false);
  t("headers: no CSP → red", frameHeaders(200, null, null), false);
  t("headers: 404 → red", frameHeaders(404, "frame-ancestors *", ""), false);
  t("fit: production state-only (666 in 360) → red", fits({ sh: 666, ch: 360, footerVisible: false }), false);
  t("fit: content inside, footer seen → green", fits({ sh: 700, ch: 700, footerVisible: true }), true);
  t("fit: content fits but footer hidden → red", fits({ sh: 700, ch: 700, footerVisible: false }), false);
  t("curve: production 60px → red", curveOk({ h: 60, top: 200, bottom: 260, frameH: 280 }), false);
  t("curve: 200px inside → green", curveOk({ h: 200, top: 90, bottom: 290, frameH: 480 }), true);
  t("curve: 200px but cut by the frame → red", curveOk({ h: 200, top: 200, bottom: 400, frameH: 280 }), false);
  t("curve: none drawn → red", curveOk(null), false);
  const pub = { reference_peak_year: 1968, period_years: 60 };
  t("override 1968 = published → red", overrideCalibrates({ kind: "peak", value: 1968 }, pub), false);
  t("override 1972 → green", overrideCalibrates({ kind: "peak", value: 1972 }, pub), true);
  t("override for unknown cycle → red", overrideCalibrates({ kind: "peak", value: 1972 }, undefined), false);
  t("disclosed names both → green", disclosed("peak 1972 (the site's reference peak is 1968)", { kind: "peak", value: 1972 }, pub), true);
  t("disclosed missing published → red", disclosed("peak 1972", { kind: "peak", value: 1972 }, pub), false);
  t("no disclosure line → red", disclosed(null, { kind: "peak", value: 1972 }, pub), false);
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
// The overlay's exemption below 640px is only honest if the writer is told before pasting it.
if (snippets.some((s) => s.wideOnly)) {
  check("docs tell the writer the overlay wants a column wider than 640px", /wider than 640px/.test(docsHtml));
}

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
// The writer's page: a bare essay column, the snippet pasted between two paragraphs.
const pageFor = (s) =>
  `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>a writer's page</title><style>body{font-family:Georgia,serif;max-width:680px;margin:0 auto;padding:16px}</style></head><body><p>Before the chart.</p><iframe src="${s.src}" width="100%" height="${s.height}" style="border:1px solid #e5e7eb;border-radius:8px"></iframe><p>After the chart.</p></body></html>`;

const browser = await chromium.launch();
try {
  for (const vp of [{ w: 390, h: 844, mobile: true }, { w: 1440, h: 900, mobile: false }]) {
    for (const s of snippets) {
      const tag = `${vp.w} ${s.src.replace(origin, "")}`;
      current = pageFor(s);
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.mobile, hasTouch: vp.mobile });
      const page = await ctx.newPage();
      await page.goto(host, { waitUntil: "load" });
      await page.locator("iframe").scrollIntoViewIfNeeded();
      const frame = page.frames().find((f) => f.url().startsWith(origin));
      if (!frame) {
        check(`${tag} frame loads`, false, "no frame document");
        await ctx.close();
        continue;
      }
      // Hydrated: the Suspense fallback is gone and every chart has measured its width.
      await frame.waitForFunction(() => !/loading…/.test(document.body.innerText) && document.querySelector("footer"), null, { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const m = await frame.evaluate(() => {
        const d = document.documentElement;
        const vh = window.innerHeight;
        const via = [...document.querySelectorAll("footer a")].find((a) => /Sinusoidal History/.test(a.textContent));
        const vb = via?.getBoundingClientRect();
        const curves = [...document.querySelectorAll('svg[role="img"]')]
          .filter((n) => /curve from/.test(n.getAttribute("aria-label") ?? ""))
          .map((n) => n.getBoundingClientRect());
        const big = curves.sort((a, b) => b.height - a.height)[0];
        const cal = document.querySelector("[data-embed-calibration]");
        const cb = cal?.getBoundingClientRect();
        return {
          sw: d.scrollWidth, cw: d.clientWidth, sh: d.scrollHeight, ch: vh,
          footerVisible: !!vb && vb.top >= 0 && vb.bottom <= vh + 1,
          curve: big ? { h: Math.round(big.height), top: Math.round(big.top), bottom: Math.round(big.bottom), frameH: vh } : null,
          calText: cal && cb.top >= 0 && cb.bottom <= vh + 1 && cb.height > 0 ? cal.textContent : null,
        };
      });
      check(`${tag} frame loads`, true);
      check(`${tag} no horizontal overflow`, m.sw <= m.cw, `scrollWidth ${m.sw} / ${m.cw}`);
      if (s.wideOnly && m.cw < 640) {
        console.log(`      ${tag}: declared wide-only (the docs say so), content ${m.sh}px in ${m.ch}px`);
      } else if (!s.scroller) {
        check(`${tag} fits its frame, attribution visible`, fits(m), `content ${m.sh}px in ${m.ch}px, footer ${m.footerVisible ? "seen" : "hidden"}`);
      } else {
        console.log(`      ${tag}: declared scroller, content ${m.sh}px in ${m.ch}px`);
      }
      if (s.single) {
        check(`${tag} curve ≥${MIN_CURVE_PX}px and in view`, curveOk(m.curve), m.curve ? `${m.curve.h}px, ${m.curve.top}-${m.curve.bottom} of ${m.curve.frameH}` : "no curve");
      }
      for (const ov of s.overrides) {
        const pub = byId[ov.id];
        check(`${tag} discloses ${ov.kind}.${ov.id}=${ov.value} beside the published value`, !!pub && disclosed(m.calText, ov, pub),
          m.calText ? `"${m.calText.slice(0, 120)}"` : "no visible calibration line");
      }
      // Rule 6: every enabled button changes the frame's DOM when clicked; every link has a real href.
      const dead = await frame.evaluate(async () => {
        const out = [];
        for (const a of document.querySelectorAll("a")) {
          const h = a.getAttribute("href");
          if (!h || h === "#" || h.startsWith("javascript:")) out.push(`link "${a.textContent.trim().slice(0, 30)}" has no href`);
        }
        const buttons = [...document.querySelectorAll('button, [role="button"]')].filter((b) => !b.disabled);
        for (const b of buttons) {
          const before = document.body.innerHTML;
          b.click();
          await new Promise((r) => setTimeout(r, 150));
          if (document.body.innerHTML === before) out.push(`button "${(b.textContent || b.getAttribute("aria-label") || "").trim().slice(0, 40)}" does nothing`);
        }
        return { out, buttons: buttons.length };
      });
      check(`${tag} no dead tap targets (${dead.buttons} buttons)`, dead.out.length === 0, dead.out.slice(0, 3).join("; "));
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
