// After a reader opens a cycle from the /cycles verdict list, does the screen they land on say
// which cycle it is? And does the list itself state its result where the header link lands?
//
//   node scripts/check-verdict-landing.mjs [origin] [--fails-only] [--mutate hide-name|wrong-sentence|dead-link|flat-figure]
//
// Round 2 (2026-10-02, cold walk docs/walks/2026-10-02-r1 findings 1-2) added the figure legs,
// on each of the nine paired pages: the download controls share one case (all sizes); and at the
// three touch sizes, from where the box's link lands, the figure's smallest (10-unit) labels
// render at >=10px and its "target:" label at >=11px, a tap on the figure opens the SVG on its
// own, and Back from it keeps the scroll position. Production before: 112/256 (every figure leg
// red: labels at 3.2-3.9px, the tap did nothing, PNG mixed-case). --mutate flat-figure squeezes
// the figure to the column, makes its link untappable and un-capitalises the PNG button.
// The result sentence now counts its records and names the unpaired row(s).
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// Written 2026-10-02 from the cold walk of that morning (skylark-site
// docs/walks/2026-10-02/sinusoidal-cycles.md, findings 1-3). Measured on production before the
// change, over every link in the list at four sizes: each list link lands on the cycle page's
// "Does it hold up?" box with the h1 136-288px above the screen, and the box's text never named
// the cycle, so 0 of the 10 landings named the cycle at any size. The list showed nine rows of
// one identical verdict with no sentence stating the result, and the box's one link forward was
// 17px tall on phones (38px at 320, where it wraps).
//
// Legs, at the iPhone 15 preset at 390x664, 360x560 and 320x568 with touch, and 1440x900:
// - after the header's "See which ones, and how short ↓", the result sentence is on screen
//   between the section's heading and its first verdict row, and its text is EXACTLY the
//   sentence that the origin's own /data/spectral/verdicts.json headline implies;
// - for EVERY cycle link in the list (all ten, not a sample): open it, and the #does-it-hold-up
//   box carries the exact text of the link that was tapped, as a text node that is visible
//   (checkVisibility with opacity and visibility), wholly inside the viewport, and on top at
//   its own centre (elementFromPoint); on a touch size the box's own link goes where it
//   should (#spectral-verdict, or #caveat on the one unpaired cycle), is at least 44px tall
//   unrounded, and hit-tests as that link at its top and bottom edges.
// Red arms. Production before 2026-10-02's change: 34/112 (only the "ten links" and "goes
// to the right anchor" legs pass). On the changed build, unmutated: 112/112.
// --mutate breaks the loaded page on purpose, so each predicate is shown to fail on a build
// where it otherwise passes (Codex review r1, 2026-10-02, found the first version of each leg
// could pass on a broken page): hide-name sets the name to visibility:hidden (every naming
// leg must FAIL), wrong-sentence rewrites the result sentence to a false count (the result
// legs must FAIL), dead-link puts pointer-events:none on the box's link (every tap leg must
// FAIL). A mutated run exits 3 by design.
// NOT seen: whether a reader notices the name (that is W-003's cold walk); the accessible
// name of the box (its aria-label is still the generic "Does this cycle hold up") and focus;
// entries into the box from anywhere but /cycles (the /methods table and markdown links land
// the same way and get the same box, but are not walked here); a hash landing on the unpaired
// cycle (its list link carries no fragment, so that leg reads the box from the page top);
// clipping by an ancestor's overflow; colour contrast; widths between the four measured; real
// iOS Safari. It does not re-run check-entry-folds, check-verdict-reach or the rendered-text
// gate: a label change must be read with those too.
import { chromium, devices } from "playwright";

const args = process.argv.slice(2);
const mi = args.indexOf("--mutate");
const mutate = mi === -1 ? null : args[mi + 1];
// --fails-only prints the FAIL lines, the per-size counts and the total: 112 PASS lines bury a red one.
const failsOnly = args.includes("--fails-only");
const origin = (args.find((a, i) => !a.startsWith("--") && (mi === -1 || i !== mi + 1)) ??"https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  if (ok && failsOnly) return;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const SIZES = [
  { name: "iPhone 15 390x664", ctx: { ...devices["iPhone 15"], viewport: { width: 390, height: 664 } }, touch: true },
  { name: "360x560", ctx: { viewport: { width: 360, height: 560 }, hasTouch: true, isMobile: true }, touch: true },
  { name: "320x568", ctx: { viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true }, touch: true },
  { name: "1440x900", ctx: { viewport: { width: 1440, height: 900 } }, touch: false },
];

// The sentence the page must show, rebuilt from the frozen verdicts the origin itself serves.
// It mirrors the two branches in src/app/(app)/cycles/page.tsx; if that copy changes, this
// leg goes red until the two agree again.
// The unpaired tail ("One cycle has no paired series…", round 2) counts the list's rows that
// carry no verdict: the visible cycle links minus the primary verdicts.
const verdicts = await (await fetch(`${origin}/data/spectral/verdicts.json`)).json();
const headline = verdicts.headline;
const expectedSentence = (rows) => {
  const unpaired = rows - verdicts.primary.length;
  return (
    (headline.eligible_primary === 0
      ? `None of the ${headline.total_primary} paired theories can be tested yet. Each of the ${headline.total_primary} records below is shorter than the three full periods a test needs; here is how far short.`
      : `${headline.eligible_primary} of the ${headline.total_primary} paired theories have a record long enough to test.`) +
    (unpaired === 1 ? " One cycle has no paired series, so there is nothing to test." : unpaired > 1 ? ` ${unpaired} cycles have no paired series, so there is nothing to test.` : "")
  );
};

async function openList(page) {
  await page.goto(`${origin}/cycles`, { waitUntil: "load", timeout: 60000 });
  await page.waitForSelector("#does-any-hold-up");
  await page.locator('a[href="#does-any-hold-up"]').first().click();
  await page.waitForFunction(() => {
    const t = document.getElementById("does-any-hold-up-heading")?.getBoundingClientRect().top;
    return t !== undefined && t >= 0 && t < innerHeight / 2;
  }, null, { timeout: 10000 });
}

// The figure the box's link promises ("the full verdict, the figure and the protocol"). Round-2
// cold walk (docs/walks/2026-10-02-r1, finding 1): on a phone it rendered ~350px wide, its
// 10-unit axis labels at ~4px, and a tap on it did nothing. Read from where the box link lands.
// Font sizes come from the SVG the page itself points at, scaled by the width it renders at,
// because an <img> exposes no text boxes. The smallest label must render at >= 10px and the
// "target: Ny" label at >= 11px.
const svgFonts = new Map();
async function fontsOf(src) {
  if (!svgFonts.has(src)) {
    const svg = await (await fetch(`${origin}${src}`)).text();
    const vb = Number(svg.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+)/)[1]);
    const sizes = [...svg.matchAll(/<text[^>]*font-size="([\d.]+)"[^>]*>([^<]*)</g)].map((t) => ({ size: Number(t[1]), text: t[2] }));
    svgFonts.set(src, {
      vb,
      min: Math.min(...sizes.map((t) => t.size)),
      target: sizes.find((t) => t.text.startsWith("target:"))?.size ?? null,
    });
  }
  return svgFonts.get(src);
}

async function checkFigure(page, s, path) {
  if (mutate === "flat-figure") {
    await page.addStyleTag({
      content: "#spectral-verdict figure img { width: 100% !important; max-width: 100% !important } #spectral-verdict figure a { pointer-events: none } #spectral-verdict button { text-transform: none !important }",
    });
  }
  const downloads = await page.evaluate(() => {
    const ul = document.querySelector("#spectral-verdict a[download]")?.closest("ul");
    return ul ? [...ul.querySelectorAll("a, button")].map((el) => getComputedStyle(el).textTransform) : [];
  });
  check(
    `${s.name}: ${path} figure download controls share one case`,
    downloads.length >= 2 && new Set(downloads).size === 1,
    downloads.join(" / ") || "no download controls",
  );
  if (!s.touch) return;

  // The reader's path: tap the box's link forward, as the landing leg above already proved it works.
  await page.locator('#does-it-hold-up a[href="#spectral-verdict"]').tap();
  await page.waitForFunction(() => location.hash === "#spectral-verdict", null, { timeout: 5000 });
  const img = page.locator('#spectral-verdict figure img[src^="/data/spectral/"]');
  const src = await img.getAttribute("src");
  const f = await fontsOf(src);
  await img.scrollIntoViewIfNeeded();
  const g = await img.evaluate((el) => {
    const b = el.getBoundingClientRect();
    // The tap point: the middle of the part of the figure that is on screen.
    const l = Math.max(b.left, 0), r = Math.min(b.right, innerWidth);
    const t = Math.max(b.top, 0), btm = Math.min(b.bottom, innerHeight);
    return { w: b.width, x: (l + r) / 2, y: (t + btm) / 2 };
  });
  const scale = g.w / f.vb;
  const minPx = f.min * scale;
  const targetPx = f.target === null ? null : f.target * scale;
  check(
    `${s.name}: ${path} figure's smallest labels render at ≥10px`,
    minPx >= 10,
    `${f.min}-unit text at ${minPx.toFixed(1)}px (figure ${Math.round(g.w)}px wide)`,
  );
  check(
    `${s.name}: ${path} figure's "target:" label renders at ≥11px`,
    targetPx !== null && targetPx >= 11,
    targetPx === null ? "no target: label in the SVG" : `${f.target}-unit text at ${targetPx.toFixed(1)}px`,
  );

  const yBefore = await page.evaluate(() => scrollY);
  await page.touchscreen.tap(g.x, g.y);
  const opened = await page
    .waitForFunction((src) => location.pathname === src, src, { timeout: 5000 })
    .then(() => true, () => false);
  check(`${s.name}: ${path} a tap on the figure opens it on its own`, opened, opened ? src : "the tap did nothing");
  if (!opened) {
    check(`${s.name}: ${path} Back from the opened figure keeps the scroll position`, false, "nothing to go back from");
    return;
  }
  await page.goBack();
  await page.waitForFunction((p) => location.pathname === p && Boolean(document.getElementById("spectral-verdict")), path, { timeout: 20000 });
  await page.waitForFunction(() => new Promise((r) => { const y = scrollY; requestAnimationFrame(() => requestAnimationFrame(() => r(scrollY === y))); }), null, { timeout: 5000 });
  const yAfter = await page.evaluate(() => scrollY);
  check(
    `${s.name}: ${path} Back from the opened figure keeps the scroll position`,
    Math.abs(yAfter - yBefore) <= 2,
    `scrollY ${Math.round(yBefore)} → ${Math.round(yAfter)}`,
  );
}

const browser = await chromium.launch();
try {
  for (const s of SIZES) {
    const ctx = await browser.newContext(s.ctx);
    const page = await ctx.newPage();
    await openList(page);

    if (mutate === "wrong-sentence") {
      await page.evaluate(() => {
        const p = document.querySelector("#does-any-hold-up-heading + p");
        if (p) p.textContent = "9 of the 9 paired theories have a record long enough to test.";
      });
    }
    const result = await page.evaluate(() => {
      const sec = document.getElementById("does-any-hold-up");
      const heading = document.getElementById("does-any-hold-up-heading");
      const firstRow = [...sec.querySelectorAll("[data-verdict-id], tbody tr")].find((el) => el.checkVisibility());
      // The paragraphs between the heading and the first visible verdict row, in document order.
      const between = [...sec.querySelectorAll("p")].filter(
        (p) =>
          heading.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING &&
          firstRow &&
          p.compareDocumentPosition(firstRow) & Node.DOCUMENT_POSITION_FOLLOWING &&
          !firstRow.contains(p),
      );
      return between.map((p) => {
        const b = p.getBoundingClientRect();
        return {
          text: p.textContent.replace(/\s+/g, " ").trim(),
          top: Math.round(b.top),
          shown:
            b.width > 0 && b.height > 0 &&
            p.checkVisibility({ opacityProperty: true, visibilityProperty: true }) &&
            b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth,
        };
      });
    });
    const hrefs = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('#does-any-hold-up a[href^="/cycles/"]')].filter((a) => a.checkVisibility()).map((a) => a.getAttribute("href")))],
    );
    const EXPECTED = expectedSentence(hrefs.length);
    const hit = result.find((r) => r.text === EXPECTED);
    check(
      `${s.name}: the verdict list states its result, as verdicts.json has it, between the heading and the first row`,
      Boolean(hit),
      hit ? `"${hit.text.slice(0, 48)}…"` : `wanted "${EXPECTED.slice(0, 48)}…", found ${JSON.stringify(result.map((r) => r.text.slice(0, 48)))}`,
    );
    check(`${s.name}: that sentence is visible on the screen the header link lands on`, Boolean(hit?.shown), hit ? `at ${hit.top}px` : "no such sentence");

    check(`${s.name}: the list carries ten cycle links`, hrefs.length === 10, `${hrefs.length} visible`);

    let named = 0;
    for (const [i, href] of hrefs.entries()) {
      if (i > 0) await openList(page);
      const link = page.locator(`#does-any-hold-up a[href="${href}"]:visible`).first();
      const tapped = (await link.textContent()).trim();
      if (s.touch) await link.tap();
      else await link.click();
      const path = href.split("#")[0];
      await page.waitForFunction((p) => location.pathname === p && Boolean(document.querySelector("h1") && document.getElementById("does-it-hold-up")), path, { timeout: 20000 });
      // Let the hash scroll settle: two consecutive frames at the same scrollY.
      await page.waitForFunction(() => new Promise((r) => { const y = scrollY; requestAnimationFrame(() => requestAnimationFrame(() => r(scrollY === y))); }), null, { timeout: 5000 });
      if (mutate === "hide-name") await page.addStyleTag({ content: "#does-it-hold-up h2 span { visibility: hidden }" });
      if (mutate === "dead-link") await page.addStyleTag({ content: '#does-it-hold-up a[href^="#"] { pointer-events: none }' });
      const m = await page.evaluate((tapped) => {
        const box = document.getElementById("does-it-hold-up");
        // The exact tapped text as a rendered text node inside the box: its element visible,
        // its rect wholly inside the viewport, and on top at its own centre.
        const w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
        let shown = false;
        let why = "no text node in the box equals the tapped text";
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          if (n.textContent.trim() !== tapped) continue;
          const el = n.parentElement;
          const r = document.createRange();
          r.selectNodeContents(n);
          const b = r.getBoundingClientRect();
          if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) why = "the name is in the box but hidden";
          else if (!(b.width > 0 && b.height > 0)) why = "the name renders zero-size";
          else if (!(b.top >= 0 && b.bottom <= innerHeight && b.left >= 0 && b.right <= innerWidth)) why = `the name is outside the screen (top ${Math.round(b.top)}, left ${Math.round(b.left)})`;
          else {
            const top = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
            if (top && (top === el || el.contains(top) || top.contains(el)) && box.contains(top)) shown = true;
            else why = "something else is painted over the name";
          }
        }
        // The naming read above is of the landing screen. The link can sit below it (at
        // 320x568 two boxes run past the fold), and elementFromPoint is null off-screen, so
        // bring the link into view before hit-testing it.
        const fwd = box.querySelector('a[href^="#"]');
        fwd?.scrollIntoView({ block: "center", behavior: "instant" });
        const fb = fwd?.getBoundingClientRect();
        const hits = (y) => {
          const t = fb && document.elementFromPoint(fb.left + fb.width / 2, y);
          return Boolean(t && (t === fwd || fwd.contains(t)));
        };
        return {
          shown,
          why,
          fwd: fwd?.getAttribute("href") ?? null,
          fwdH: fb ? fb.height : 0,
          fwdVisible: Boolean(fwd?.checkVisibility({ opacityProperty: true, visibilityProperty: true })),
          fwdHitTop: fb ? hits(fb.top + 1) : false,
          fwdHitBottom: fb ? hits(fb.bottom - 1) : false,
        };
      }, tapped);
      if (m.shown) named++;
      check(`${s.name}: ${path} names "${tapped}" in its box, readable on screen`, m.shown, m.shown ? "" : m.why);
      if (s.touch) {
        // A paired cycle's list link carries the #does-it-hold-up fragment; the unpaired one does not.
        const want = href.includes("#") ? "#spectral-verdict" : "#caveat";
        check(`${s.name}: ${path} box link goes to ${want}`, m.fwd === want, `${m.fwd}`);
        check(
          `${s.name}: ${path} box link is ≥44px tall and hit-tests as the link at both edges`,
          m.fwdVisible && m.fwdH >= 44 && m.fwdHitTop && m.fwdHitBottom,
          `${m.fwdH.toFixed(2)}px · top edge ${m.fwdHitTop ? "hits" : "misses"} · bottom edge ${m.fwdHitBottom ? "hits" : "misses"}`,
        );
      }
      if (href.includes("#")) await checkFigure(page, s, path);
    }
    console.log(`  ${s.name}: ${named} of ${hrefs.length} landings name the cycle`);
    await ctx.close();
  }
} finally {
  await browser.close();
}

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} ${passed === results.length ? "PASS" : "FAIL"}  (${origin}, chromium${mutate ? `, MUTATED: ${mutate}` : ""})`);
process.exit(passed === results.length ? 0 : 3);
