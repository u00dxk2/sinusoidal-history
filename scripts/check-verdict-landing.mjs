// After a reader opens a cycle from the /cycles verdict list, does the screen they land on say
// which cycle it is? And does the list itself state its result where the header link lands?
//
//   node scripts/check-verdict-landing.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// Written 2026-10-02 from the cold walk of that morning (skylark-site
// docs/walks/2026-10-02/sinusoidal-cycles.md, findings 1-3). Measured on production before the
// change, over every link in the list at four sizes: each list link lands on the cycle page's
// "Does it hold up?" box with the h1 136-288px above the screen, and the box's text never named
// the cycle, so 0 of the 9 paired cycles named themselves on the landing screen at any phone size
// (4 of 9 at 1440, by accident: the name appears further down the same screen). The list showed
// nine rows of one identical verdict with no sentence stating the result, and the box's one link
// forward was 17px tall on phones.
//
// Legs, at the iPhone 15 preset at 390x664, 360x560 and 320x568 with touch, and 1440x900:
// - after the header's "See which ones, and how short ↓", a sentence opening "None of the" (or
//   "N of the M") is visible on screen, inside #does-any-hold-up;
// - for EVERY cycle link in the list (all ten, not a sample): open it, and the #does-it-hold-up
//   box's text contains the exact text of the link that was tapped, and that text is inside the
//   viewport; on a touch size the box's own link (to #spectral-verdict, or #caveat on the one
//   unpaired cycle) has a hit box at least 44px tall.
// Red arm: production before 2026-10-02's change fails the result leg at every size and the
// naming leg on all ten cycles at every size (the box never carried a name).
// NOT seen: whether a reader notices the name (that is W-003's cold walk); entries into the box
// from anywhere but /cycles (the /methods table and markdown links land the same way and get the
// same box, but are not walked here); widths between the four measured; real iOS Safari.
import { chromium, devices } from "playwright";

const origin = (process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const SIZES = [
  { name: "iPhone 15 390x664", ctx: { ...devices["iPhone 15"], viewport: { width: 390, height: 664 } }, touch: true },
  { name: "360x560", ctx: { viewport: { width: 360, height: 560 }, hasTouch: true, isMobile: true }, touch: true },
  { name: "320x568", ctx: { viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true }, touch: true },
  { name: "1440x900", ctx: { viewport: { width: 1440, height: 900 } }, touch: false },
];

async function openList(page) {
  await page.goto(`${origin}/cycles`, { waitUntil: "load", timeout: 60000 });
  await page.waitForSelector("#does-any-hold-up");
  await page.locator('a[href="#does-any-hold-up"]').first().click();
  await page.waitForFunction(() => {
    const t = document.getElementById("does-any-hold-up-heading")?.getBoundingClientRect().top;
    return t !== undefined && t >= 0 && t < innerHeight / 2;
  }, null, { timeout: 10000 });
}

const browser = await chromium.launch();
try {
  for (const s of SIZES) {
    const ctx = await browser.newContext(s.ctx);
    const page = await ctx.newPage();
    await openList(page);

    const result = await page.evaluate(() => {
      const sec = document.getElementById("does-any-hold-up");
      const p = [...sec.querySelectorAll("p")].find((el) => /^(None of the|\d+ of the) \d+ paired/.test(el.textContent.trim()));
      if (!p) return { found: false };
      const b = p.getBoundingClientRect();
      return { found: true, text: p.textContent.trim().slice(0, 60), top: Math.round(b.top), inView: b.top >= 0 && b.bottom <= innerHeight };
    });
    check(
      `${s.name}: the verdict list states its result on the screen the header link lands on`,
      result.found && result.inView,
      result.found ? `"${result.text}…" at ${result.top}px` : "no result sentence in #does-any-hold-up",
    );

    const hrefs = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('#does-any-hold-up a[href^="/cycles/"]')].filter((a) => a.checkVisibility()).map((a) => a.getAttribute("href")))],
    );
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
      const m = await page.evaluate((tapped) => {
        const box = document.getElementById("does-it-hold-up");
        // The exact tapped text, as a rendered text node inside the box and inside the viewport.
        const w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
        let shown = false;
        for (let n = w.nextNode(); n; n = w.nextNode()) {
          if (n.textContent.trim() !== tapped) continue;
          const r = document.createRange();
          r.selectNodeContents(n);
          const b = r.getBoundingClientRect();
          if (b.width > 0 && b.top >= 0 && b.bottom <= innerHeight) shown = true;
        }
        const fwd = box.querySelector('a[href^="#"]');
        const fb = fwd?.getBoundingClientRect();
        return { shown, fwd: fwd?.getAttribute("href") ?? null, fwdH: fb ? Math.round(fb.height) : 0 };
      }, tapped);
      if (m.shown) named++;
      check(`${s.name}: ${path} names "${tapped}" in its box, on screen`, m.shown);
      if (s.touch) check(`${s.name}: ${path} box link ${m.fwd} is ≥44px tall`, m.fwdH >= 44, `${m.fwdH}px`);
    }
    console.log(`  ${s.name}: ${named} of ${hrefs.length} landings name the cycle`);
    await ctx.close();
  }
} finally {
  await browser.close();
}

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} ${passed === results.length ? "PASS" : "FAIL"}  (${origin}, chromium)`);
process.exit(passed === results.length ? 0 : 3);
