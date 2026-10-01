// Can a reader get from /cycles' headline to each cycle's verdict in one tap? (I-015)
//
//   node scripts/check-verdict-reach.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// Written 2026-10-01. Measured on production that morning: the /cycles header states the
// headline ("0 of the 9 paired theories have a record long enough…") and links only to
// /methods#spectral-testing, off the page. The per-cycle verdicts (#does-any-hold-up) start
// 3103px down at 390x664 (4.7 screens), 3418px at 320x568, 2312px at 1440, and NOTHING on the
// site links to them (cold walk 2026-09-30, finding 2).
//
// Legs, at the iPhone 15 preset at 390x664 (coarse pointer proven), 360x560 and 320x568 with
// touch, and 1440x900: at the top of /cycles, a link whose href targets #does-any-hold-up is
// visible, one box (not wrapped), and wholly inside the first screen; on a touch size its HIT box
// (the client rect, padding included) is at least 44px tall and elementFromPoint at its top and
// bottom edges returns the link (manager review 2026-10-01: measure the hit box, not the text);
// tapping (or clicking) it puts the "Does any of them hold up?" heading inside the viewport with
// at least CLEARANCE px above it;
// and the section still offers a visible link to /methods#spectral-testing, so moving the
// header's link did not strand the method.
// Red arm: production before this change has no link to #does-any-hold-up, so the first leg
// fails at every size and the tap leg cannot run.
// Review round 1 (fresh-context Claude, 2026-10-01, Codex probe RED) tightened four legs:
// the edge hit-test runs at every size, visibility uses checkVisibility() so an ancestor's
// opacity/visibility counts, the heading must land between CLEARANCE and LAND_MAX px (not just
// "in view"), and the href is matched exactly.
// Round 2 (2026-10-01, cold walk finding 1) added a Back leg: from the verdicts open a cycle,
// press Back once, and /cycles must be on screen (path AND h1), not just in the address bar.
// Red on production with the plain <a href="#…">: 24/28, every Back leg showing the cycle page
// under the URL /cycles#does-any-hold-up. Where /cycles lands after Back is printed, not judged.
// NOT seen: whether a reader notices the link (that is W-003's cold walk); occlusion anywhere
// but the two hit-test points on the link's vertical centre line; clipping by an ancestor's
// overflow; colour contrast; large text scaling; how far the method link sits below the
// landing (on phones it is under all ten verdict entries: one scroll, then one tap); and widths
// between the four measured.
import { chromium, devices, webkit } from "playwright";

// --webkit runs every leg in Playwright's WebKit instead of Chromium: closer to iOS Safari than
// Chromium, still not a real iPhone.
const engine = process.argv.includes("--webkit") ? webkit : chromium;
const origin = (process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

// Pixels the heading must clear below the viewport's top edge after the tap, and the most it
// may sit below it (scroll-mt-6 is 24px; a heading far down the screen means the anchor broke).
const CLEARANCE = 12;
const LAND_MAX = 48;
const TARGET = 'a[href="#does-any-hold-up"]';

const SIZES = [
  { name: "iPhone 15 390x664", ctx: { ...devices["iPhone 15"], viewport: { width: 390, height: 664 } }, touch: true },
  { name: "360x560", ctx: { viewport: { width: 360, height: 560 }, hasTouch: true, isMobile: true }, touch: true },
  { name: "320x568", ctx: { viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true }, touch: true },
  { name: "1440x900", ctx: { viewport: { width: 1440, height: 900 } }, touch: false },
];

const browser = await engine.launch();
try {
  for (const s of SIZES) {
    const ctx = await browser.newContext(s.ctx);
    const page = await ctx.newPage();
    await page.goto(`${origin}/cycles`, { waitUntil: "networkidle" });
    if (s.touch && s.name.startsWith("iPhone")) {
      const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
      check(`${s.name}: coarse pointer`, coarse, `(pointer: coarse) = ${coarse}`);
    }
    // The first-screen link: visible, nonzero, wholly inside the viewport at scroll 0.
    const found = await page.evaluate((target) => {
      const vh = innerHeight;
      const vw = innerWidth;
      const all = [...document.querySelectorAll(target)];
      const rows = all.map((a, i) => {
        // The HIT box, not the text box: an inline link's padding is in its client rect and
        // in hit-testing without changing the line. One fragment only — a link that wraps
        // is two short boxes, and the first one is what a thumb meets.
        const rects = [...a.getClientRects()];
        const b = rects[0] ?? a.getBoundingClientRect();
        // checkVisibility walks ancestors: an opacity:0 or visibility:hidden parent fails it.
        const visible = b.width > 0 && b.height > 0 && a.checkVisibility({ opacityProperty: true, visibilityProperty: true });
        const inside = b.top >= 0 && b.bottom <= vh && b.left >= 0 && b.right <= vw;
        // Prove the box is really tappable at its top and bottom edges: whatever the browser
        // hit-tests there must be this link (or inside it), not the line above or below.
        const cx = b.left + b.width / 2;
        const hits = [b.top + 2, b.bottom - 2].map((y) => {
          const el = document.elementFromPoint(cx, y);
          return Boolean(el && (el === a || a.contains(el)));
        });
        return { i, text: a.textContent.trim(), top: Math.round(b.top), bottom: Math.round(b.bottom), h: b.height, fragments: rects.length, hitEdges: hits.every(Boolean), visible, inside };
      });
      return { count: all.length, vh, rows };
    }, TARGET);
    const first = found.rows.find((r) => r.visible && r.inside);
    check(
      `${s.name}: a link to the verdicts sits on the first screen`,
      Boolean(first),
      first
        ? `"${first.text}" at ${first.top}-${first.bottom}px of ${found.vh}`
        : `${found.count} link(s) to #does-any-hold-up; none visible inside 0-${found.vh}px`,
    );
    if (!first) {
      await ctx.close();
      continue;
    }
    check(`${s.name}: that link is one box`, first.fragments === 1, `${first.fragments} fragment(s)`);
    check(
      `${s.name}: it hit-tests as the link at its top and bottom edges`,
      first.hitEdges,
      first.hitEdges ? "both edges hit the link" : "an edge hits something else",
    );
    if (s.touch) {
      check(`${s.name}: its tap box is ≥44px tall`, first.h >= 44, `${first.h.toFixed(2)}px`);
    }
    // Tap it and read where the heading lands.
    const link = page.locator(TARGET).nth(first.i);
    if (s.touch) await link.tap();
    else await link.click();
    await page.waitForTimeout(900);
    const landed = await page.evaluate(() => {
      const h = document.getElementById("does-any-hold-up-heading");
      if (!h) return null;
      const b = h.getBoundingClientRect();
      return { text: h.textContent.trim(), top: Math.round(b.top), bottom: Math.round(b.bottom), vh: innerHeight, hash: location.hash };
    });
    // Clearance, not just "in view": a heading flush against the top edge reads as cut off.
    check(
      `${s.name}: the tap lands on "Does any of them hold up?" ${CLEARANCE}-${LAND_MAX}px below the top`,
      Boolean(landed) && landed.text === "Does any of them hold up?" && landed.top >= CLEARANCE && landed.top <= LAND_MAX,
      landed ? `"${landed.text}" at ${landed.top}-${landed.bottom}px of ${landed.vh}, hash ${landed.hash}` : "no #does-any-hold-up-heading",
    );
    // The method is still linked from the verdict section (under the list, not beside the heading).
    const method = await page.evaluate(() => {
      const sec = document.getElementById("does-any-hold-up");
      const a = sec?.querySelector('a[href="/methods#spectral-testing"]');
      if (!a) return null;
      const b = a.getBoundingClientRect();
      return { text: a.textContent.trim(), visible: b.width > 0 && b.height > 0 && a.checkVisibility({ opacityProperty: true, visibilityProperty: true }) };
    });
    check(
      `${s.name}: the verdict section links to the method`,
      Boolean(method?.visible),
      method ? `"${method.text}"` : "no /methods#spectral-testing link inside #does-any-hold-up",
    );
    // Back must come home (cold walk 2026-10-01, finding 1): open a cycle from the verdicts,
    // press Back once, and /cycles must be on screen again — not just in the address bar. A
    // native #hash jump pushes a null-state history entry, and the App Router ignores a popstate
    // with no state (next/dist/client/components/app-router.js onPopState), so the URL changed
    // and the cycle page stayed. The control trip (scroll, no link) always came back.
    const cycle = page.locator('#does-any-hold-up a[href^="/cycles/"]:visible').first();
    const cycleHref = await cycle.getAttribute("href");
    if (s.touch) await cycle.tap();
    else await cycle.click();
    await page.waitForURL((u) => u.pathname !== "/cycles", { timeout: 10000 });
    await page.waitForTimeout(800);
    await page.goBack();
    await page.waitForTimeout(1500);
    const back = await page.evaluate(() => {
      const h = document.getElementById("does-any-hold-up-heading");
      return {
        path: location.pathname,
        hash: location.hash,
        h1: document.querySelector("h1")?.textContent.trim(),
        scrollY: Math.round(scrollY),
        headingTop: h ? Math.round(h.getBoundingClientRect().top) : null,
      };
    });
    // Where it lands is RECORDED, not judged: the reader came from the verdict list, and the
    // detail says whether Back put them there (heading near the top) or at the page top.
    check(
      `${s.name}: one Back from a cycle opened there shows /cycles again`,
      back.path === "/cycles" && back.h1 === "The ten cycles",
      `opened ${cycleHref}; after Back: url ${back.path}${back.hash} · h1 "${back.h1}" · scrollY ${back.scrollY} · verdict heading at ${back.headingTop}px`,
    );
    await ctx.close();
  }
} finally {
  await browser.close();
}

const pass = results.filter(Boolean).length;
console.log(`\n${pass}/${results.length} ${pass === results.length ? "PASS" : "FAIL"}  (${origin}, ${engine.name()})`);
process.exit(pass === results.length ? 0 : 3);
