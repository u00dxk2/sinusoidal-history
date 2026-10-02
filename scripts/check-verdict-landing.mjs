// After a reader opens a cycle from the /cycles verdict list, does the screen they land on say
// which cycle it is? And does the list itself state its result where the header link lands?
//
//   node scripts/check-verdict-landing.mjs [origin] [--fails-only]
//        [--mutate hide-name|wrong-sentence|dead-link|flat-figure|clip-figure|lose-place|literal-case|restore-always]
//
// Round 2 (2026-10-02, cold walk docs/walks/2026-10-02-r1 findings 1-2) added the figure legs,
// on each of the nine paired pages: the visible download controls are DRAWN in one case (all
// sizes); and at the three touch sizes, from where the box's link lands: the figure's smallest
// (10-unit) labels draw at >=10px and its "target:" label at >=11px (font size in the SVG times
// the smaller of the img's two axis scales; the img must be loaded and visible); every part of
// the figure can be brought on screen (it fits, or its clipping ancestor is a swipeable
// overflow-x auto/scroll); a tap opens an image/svg+xml document at the figure's address; and
// Back from it keeps both the page's scrollY and the figure's sideways scrollLeft (set to 200
// first), still equal 600ms later. Mutations: flat-figure (squeezed, untappable, PNG mixed-case),
// clip-figure (900px but overflow-x hidden), lose-place (scrollLeft reset after Back).
// The result sentence now counts its records and names the unpaired row(s).
// Round 3 (2026-10-02, I-018, cold walk r2 finding 1) added three return legs per paired page at
// the touch sizes: an in-app Back keeps the sideways place (300); a fresh visit by the /cycles
// list link, and a typed URL in the same tab, start the figure at scrollLeft 0. Red arm:
// production before the change (sessionStorage restore on every mount) fails both fresh legs.
// Mutation restore-always puts the old restore back on the fresh arrivals; lose-place also
// drops the in-app Back place. Codex r3-1 added a fourth: Back to an in-page hash-jump entry
// (swipe, then the box's HashLink, then leave and come Back) keeps the place; and every return
// read waits for the scroller's data-place-ready mark, not just the DOM. NOT seen: a Back
// pressed within the scroller's 250ms save debounce (the last swipe is dropped by design);
// router.refresh() (clears the place; the site never calls it); real iOS Safari's bfcache.
// CEILING, declared after two review rounds found the same class (Codex r1 #1, r2 #1-#2): the
// size and reachability legs are geometric PROXIES for "the reader can see and swipe to every
// label", and contrived CSS can fool them — padding or object-fit inside a 900x500 img box
// (the drawing is smaller than the box), or an inner overflow ancestor with no scroll range
// hiding an outer overflow:hidden (only the nearest clipping ancestor is read). They catch the
// regressions that have happened (the figure shrunk to the column; the swipe taken away); they
// do not prove readability. The proof of "can read it" is a person: W-003's walk question.
// NOT seen by the figure legs: real gestures (a swipe, pinch), keyboard activation, ancestor
// clipping above the nearest clipping box, CSS-set or inherited SVG font sizes (the frozen SVGs
// set every size inline), real iOS Safari.
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
      : `${headline.eligible_primary} of the ${headline.total_primary} paired theories ${headline.eligible_primary === 1 ? "has" : "have"} a record long enough to test.`) +
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
    const [, vbW, vbH] = svg.match(/viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"/);
    const vb = Number(vbW);
    const sizes = [...svg.matchAll(/<text[^>]*font-size="([\d.]+)"[^>]*>([^<]*)</g)].map((t) => ({ size: Number(t[1]), text: t[2] }));
    svgFonts.set(src, {
      vb,
      vbH: Number(vbH),
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
  if (mutate === "clip-figure") {
    // Keeps the figure 900px wide but takes the swipe away: the size legs alone would stay green.
    await page.addStyleTag({ content: '#spectral-verdict [role="region"] { overflow-x: hidden !important }' });
  }
  if (mutate === "literal-case") {
    // Codex r2 #3's case: the button's text typed in capitals with text-transform none. Drawn
    // text matches; the computed text-transform does not.
    await page.evaluate(() => {
      for (const b of document.querySelectorAll("#spectral-verdict button")) {
        b.textContent = b.textContent.toUpperCase();
        b.style.setProperty("text-transform", "none", "important");
      }
    });
  }
  // Case as DRAWN: innerText reflects text-transform, on the control and anything inside it, so a
  // normal-case span inside an uppercase button still reads as mixed case (Codex r1 #4). Only the
  // download controls a reader can see are read.
  const downloads = await page.evaluate(() => {
    const ul = [...document.querySelectorAll("#spectral-verdict a[download]")].find((a) => a.checkVisibility())?.closest("ul");
    return ul
      ? [...ul.querySelectorAll("a, button")]
          .filter((el) => el.checkVisibility({ opacityProperty: true, visibilityProperty: true }))
          .map((el) => ({ text: el.innerText.trim(), tt: getComputedStyle(el).textTransform }))
      : [];
  });
  // Both: the acceptance names the computed text-transform (Codex r2 #3), and the drawn text
  // catches a differently-cased child inside an uppercase control (r1 #4).
  check(
    `${s.name}: ${path} figure download controls are drawn in one case`,
    downloads.length >= 2 && new Set(downloads.map((d) => d.tt)).size === 1 && downloads.every((d) => d.text === d.text.toUpperCase()),
    downloads.map((d) => `"${d.text}" (${d.tt})`).join(" / ") || "no visible download controls",
  );
  if (!s.touch) return;

  // The reader's path: tap the box's link forward. Under --mutate dead-link that link cannot be
  // tapped, which the landing legs already record; say so once and stop here (Codex r1 #5).
  const reached = await page
    .locator('#does-it-hold-up a[href="#spectral-verdict"]')
    .tap({ timeout: 5000 })
    .then(() => page.waitForFunction(() => location.hash === "#spectral-verdict", null, { timeout: 5000 }))
    .then(() => true, () => false);
  if (!reached) {
    check(`${s.name}: ${path} the box link reaches the figure`, false, "the box link could not be tapped");
    return;
  }
  const img = page.locator('#spectral-verdict figure img[src^="/data/spectral/"]');
  const src = await img.getAttribute("src");
  const f = await fontsOf(src);
  await img.scrollIntoViewIfNeeded();
  await page.waitForFunction((el) => el.complete && el.naturalWidth > 0, await img.elementHandle(), { timeout: 10000 }).catch(() => {});
  const g = await img.evaluate((el) => {
    const b = el.getBoundingClientRect();
    // The nearest ancestor that clips sideways, and whether a reader can swipe it (Codex r1 #1:
    // overflow hidden still lets a script set scrollLeft, so the computed style decides).
    let clip = null;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const ox = getComputedStyle(a).overflowX;
      if (ox !== "visible") { clip = a; break; }
    }
    const fits = b.left >= -1 && b.right <= innerWidth + 1;
    const swipeable = Boolean(clip && ["auto", "scroll"].includes(getComputedStyle(clip).overflowX) && clip.scrollWidth >= b.width - 1);
    return {
      w: b.width,
      h: b.height,
      loaded: el.complete && el.naturalWidth > 0,
      visible: el.checkVisibility({ opacityProperty: true, visibilityProperty: true }),
      reachable: fits || swipeable,
      clipOverflow: clip ? getComputedStyle(clip).overflowX : "none",
    };
  });
  // Width alone could be fooled by a capped height letterboxing the drawing inside a wide box, so
  // the drawn size is the smaller of the two axis scales (Codex r1 #1).
  const scale = Math.min(g.w / f.vb, g.h / f.vbH);
  const minPx = f.min * scale;
  const targetPx = f.target === null ? null : f.target * scale;
  const drawn = g.loaded && g.visible;
  check(
    `${s.name}: ${path} figure's smallest labels render at ≥10px`,
    drawn && minPx >= 10,
    `${f.min}-unit text at ${minPx.toFixed(1)}px (figure ${Math.round(g.w)}x${Math.round(g.h)}px${drawn ? "" : ", NOT DRAWN"})`,
  );
  check(
    `${s.name}: ${path} figure's "target:" label renders at ≥11px`,
    drawn && targetPx !== null && targetPx >= 11,
    targetPx === null ? "no target: label in the SVG" : `${f.target}-unit text at ${targetPx.toFixed(1)}px`,
  );
  check(
    `${s.name}: ${path} every part of the figure can be brought on screen`,
    g.reachable,
    g.reachable ? `clip ${g.clipOverflow}` : `wider than the screen and its clip is overflow-x: ${g.clipOverflow}`,
  );

  // Swipe partway first, so Back is asked to keep the sideways place as well as the page's
  // (Codex r1 #3).
  const before = await page.evaluate(() => {
    const r = document.querySelector('#spectral-verdict [role="region"]');
    if (r && r.scrollWidth > r.clientWidth) r.scrollLeft = 200;
    return { y: scrollY, x: r ? r.scrollLeft : 0 };
  });
  const tapAt = await img.evaluate((el) => {
    const b = el.getBoundingClientRect();
    const l = Math.max(b.left, 0), r = Math.min(b.right, innerWidth);
    const t = Math.max(b.top, 0), btm = Math.min(b.bottom, innerHeight);
    return { x: (l + r) / 2, y: (t + btm) / 2 };
  });
  await page.touchscreen.tap(tapAt.x, tapAt.y);
  // Opened means the browser is showing an SVG document at the figure's address, not an error
  // page or a pushed history entry at the same path (Codex r1 #2).
  const opened = await page
    .waitForFunction(
      (src) => location.pathname === src && document.contentType === "image/svg+xml" && document.documentElement.localName === "svg",
      src,
      { timeout: 5000 },
    )
    .then(() => true, () => false);
  check(`${s.name}: ${path} a tap on the figure opens it on its own`, opened, opened ? `${src} (image/svg+xml)` : "the tap did not open the SVG");
  if (!opened) {
    check(`${s.name}: ${path} Back from the opened figure keeps the reader's place`, false, "nothing to go back from");
    return;
  }
  await page.goBack();
  await page.waitForFunction((p) => location.pathname === p && Boolean(document.getElementById("spectral-verdict")), path, { timeout: 20000 });
  // Settled = the same place across two frames AND again 600ms later (Codex r1 #3: a late
  // scroll after two quiet frames would otherwise pass).
  const place = () =>
    page.evaluate(() => {
      const r = document.querySelector('#spectral-verdict [role="region"]');
      return { y: scrollY, x: r ? r.scrollLeft : 0 };
    });
  await page.waitForFunction(() => new Promise((r) => { const y = scrollY; requestAnimationFrame(() => requestAnimationFrame(() => r(scrollY === y))); }), null, { timeout: 5000 });
  const first = await place();
  await page.waitForTimeout(600);
  if (mutate === "lose-place") {
    await page.evaluate(() => {
      const r = document.querySelector('#spectral-verdict [role="region"]');
      if (r) r.scrollLeft = 0;
    });
  }
  const after = await place();
  check(
    `${s.name}: ${path} Back from the opened figure keeps the reader's place`,
    Math.abs(after.y - before.y) <= 2 && Math.abs(after.x - before.x) <= 2 && Math.abs(after.y - first.y) <= 2,
    `scrollY ${Math.round(before.y)} → ${Math.round(after.y)} · figure scrollLeft ${Math.round(before.x)} → ${Math.round(after.x)}`,
  );

  // Round 3 (I-018; cold walk 2026-10-02 r2, finding 1): the place is kept for a RETURN only.
  // This page was just reached by a document Back, so its navigation entry reads back_forward,
  // which is the case a navigation-type test gets wrong (tmp/measure-restore-navtypes, prod).
  const left = () => page.evaluate(() => document.querySelector('#spectral-verdict [role="region"]')?.scrollLeft ?? -1);
  const swipeTo = async (x) => {
    await page.locator('#spectral-verdict [role="region"]').scrollIntoViewIfNeeded();
    await page.evaluate((x) => { document.querySelector('#spectral-verdict [role="region"]').scrollLeft = x; }, x);
    await page.waitForTimeout(400);
  };
  // Settled = the scroller's own effect has run (data-place-ready, set after its restore
  // decision), not merely the DOM present: a server-rendered region reads 0 before hydration,
  // and a late restore would otherwise escape the read (Codex r3-1 #3).
  const arrive = async (p) => {
    await page.waitForFunction(
      (p) => location.pathname === p && document.querySelector('#spectral-verdict [role="region"]')?.dataset.placeReady === "1",
      p,
      { timeout: 20000 },
    );
    await page.waitForTimeout(600);
  };
  const toCyclesInApp = async () => {
    await page.locator('main a[href="/cycles"]:visible').first().tap();
    await page.waitForFunction(() => location.pathname === "/cycles" && Boolean(document.getElementById("does-any-hold-up")), null, { timeout: 20000 });
  };
  // restore-always puts back round 2's behaviour (the saved place on every arrival); every
  // fresh-arrival leg must FAIL under it. lose-place also drops the in-app Back place.
  const mutateFresh = async () => {
    if (mutate === "restore-always") await page.evaluate(() => { document.querySelector('#spectral-verdict [role="region"]').scrollLeft = 300; });
  };

  await swipeTo(300);
  await toCyclesInApp();
  await page.goBack();
  await arrive(path);
  if (mutate === "lose-place") await page.evaluate(() => { document.querySelector('#spectral-verdict [role="region"]').scrollLeft = 0; });
  const inAppBack = await left();
  check(`${s.name}: ${path} an in-app Back keeps the figure's sideways place`, Math.abs(inAppBack - 300) <= 2, `scrollLeft 300 → ${Math.round(inAppBack)}`);

  // Codex r3-1 #1: swipe, THEN an in-page hash jump (the box's own HashLink pushes a new entry
  // that carries no place), then leave and come Back to that entry without swiping again.
  // The URL already carries #spectral-verdict from the box tap above, and HashLink pushes
  // nothing when the hash already matches (Codex r3-2), so drop the hash from this entry first
  // (keeping its state), and then require that the tap really made a NEW entry carrying no place.
  // A probe marker on the pre-jump entry tells a NEW entry from the same one (history.length
  // cannot: the in-app Back above left a forward entry, which the push truncates).
  await page.evaluate(() => history.replaceState({ ...history.state, landingProbe: 1 }, "", location.pathname));
  await swipeTo(250);
  await page.locator('#does-it-hold-up a[href="#spectral-verdict"]').tap();
  await page.waitForFunction(() => location.hash === "#spectral-verdict", null, { timeout: 5000 });
  const hashEntry = await page.evaluate(() => ({ probe: history.state?.landingProbe ?? null, place: history.state?.figureScroll ?? null }));
  const madeBareEntry = hashEntry.probe === null && hashEntry.place === null;
  await toCyclesInApp();
  await page.goBack();
  await arrive(path);
  if (mutate === "lose-place") await page.evaluate(() => { document.querySelector('#spectral-verdict [role="region"]').scrollLeft = 0; });
  const afterHash = await left();
  check(
    `${s.name}: ${path} Back to a hash-jump entry keeps the figure's sideways place`,
    madeBareEntry && Math.abs(afterHash - 250) <= 2,
    `${madeBareEntry ? "the jump pushed an entry with no place" : `the jump did NOT push a bare entry (probe ${hashEntry.probe}, place ${JSON.stringify(hashEntry.place)})`} · scrollLeft 250 → ${Math.round(afterHash)}`,
  );

  await toCyclesInApp();
  await page.locator(`#does-any-hold-up a[href^="${path}"]:visible`).first().tap();
  await arrive(path);
  await mutateFresh();
  const viaList = await left();
  check(`${s.name}: ${path} a fresh visit by the /cycles list starts the figure at its left edge`, viaList === 0, `swiped to 300, then scrollLeft ${Math.round(viaList)}`);

  await swipeTo(300);
  await page.goto(`${origin}${path}`, { waitUntil: "load", timeout: 60000 });
  await arrive(path);
  await mutateFresh();
  const typed = await left();
  check(`${s.name}: ${path} a typed visit in the same tab starts the figure at its left edge`, typed === 0, `swiped to 300, then scrollLeft ${Math.round(typed)}`);
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
