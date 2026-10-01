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
// NOT seen: whether a reader notices the link (that is W-003's cold walk), occlusion by a
// later-painted element, colour contrast, and widths between the four measured.
import { chromium, devices } from "playwright";

const origin = (process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

// Pixels the heading must clear below the viewport's top edge after the tap.
const CLEARANCE = 12;

const SIZES = [
  { name: "iPhone 15 390x664", ctx: { ...devices["iPhone 15"], viewport: { width: 390, height: 664 } }, touch: true },
  { name: "360x560", ctx: { viewport: { width: 360, height: 560 }, hasTouch: true, isMobile: true }, touch: true },
  { name: "320x568", ctx: { viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true }, touch: true },
  { name: "1440x900", ctx: { viewport: { width: 1440, height: 900 } }, touch: false },
];

const browser = await chromium.launch();
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
    const found = await page.evaluate(() => {
      const vh = innerHeight;
      const vw = innerWidth;
      const all = [...document.querySelectorAll('a[href$="#does-any-hold-up"]')];
      const rows = all.map((a, i) => {
        // The HIT box, not the text box: an inline link's padding is in its client rect and
        // in hit-testing without changing the line. One fragment only — a link that wraps
        // is two short boxes, and the first one is what a thumb meets.
        const rects = [...a.getClientRects()];
        const b = rects[0] ?? a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        const visible = b.width > 0 && b.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0;
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
    });
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
    if (s.touch) {
      check(
        `${s.name}: its tap box is ≥44px tall and hit-tests as the link at both edges`,
        first.h >= 44 && first.hitEdges,
        `${first.h.toFixed(2)}px, edges ${first.hitEdges ? "hit the link" : "hit something else"}`,
      );
    }
    // Tap it and read where the heading lands.
    const link = page.locator('a[href$="#does-any-hold-up"]').nth(first.i);
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
      `${s.name}: the tap lands on "Does any of them hold up?" with ≥${CLEARANCE}px above it`,
      Boolean(landed) && landed.text === "Does any of them hold up?" && landed.top >= CLEARANCE && landed.bottom <= landed.vh,
      landed ? `"${landed.text}" at ${landed.top}-${landed.bottom}px of ${landed.vh}, hash ${landed.hash}` : "no #does-any-hold-up-heading",
    );
    // The method stays one tap away from the verdicts.
    const method = await page.evaluate(() => {
      const sec = document.getElementById("does-any-hold-up");
      const a = sec?.querySelector('a[href="/methods#spectral-testing"]');
      if (!a) return null;
      const b = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      return { text: a.textContent.trim(), visible: b.width > 0 && b.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" };
    });
    check(
      `${s.name}: the verdict section links to the method`,
      Boolean(method?.visible),
      method ? `"${method.text}"` : "no /methods#spectral-testing link inside #does-any-hold-up",
    );
    await ctx.close();
  }
} finally {
  await browser.close();
}

const pass = results.filter(Boolean).length;
console.log(`\n${pass}/${results.length} ${pass === results.length ? "PASS" : "FAIL"}  (${origin})`);
process.exit(pass === results.length ? 0 : 3);
