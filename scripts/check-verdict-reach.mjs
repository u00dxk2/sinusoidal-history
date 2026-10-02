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
// under the URL /cycles#does-any-hold-up. Since Codex r2 the landing is judged too: Back must put
// the verdict heading on the upper half of the screen, and the forward page must prove itself a
// cycle page (h1 + #does-it-hold-up) before Back is pressed.
// Codex review r1 (2026-10-01) found that the first fix, next/link, broke two native behaviours,
// and both reproduced; two legs now watch them: a second tap from the top jumps again (every
// size), and at 1440 Enter-then-Tab puts focus inside the verdicts.
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
    // A second use of the same link jumps again (Codex review r1, finding 2: next/link left the
    // reader at the header when the hash was already in the URL). Scroll home, tap again.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    if (s.touch) await link.tap();
    else await link.click();
    await page.waitForTimeout(900);
    const again = await page.evaluate(() => Math.round(document.getElementById("does-any-hold-up-heading").getBoundingClientRect().top));
    check(
      `${s.name}: a second tap on it, from the top, jumps again (${CLEARANCE}-${LAND_MAX}px)`,
      again >= CLEARANCE && again <= LAND_MAX,
      `heading at ${again}px`,
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
    // Wait for the cycle page to RENDER, not just for the URL (Codex r1: a Back pressed before
    // the forward render lands is a different trip; on 2026-10-01 a local WebKit forward render
    // once took >10s and a fixed 800ms wait read that as a Back failure).
    // A cycle page is proven by its own content: an h1 AND its #does-it-hold-up box (every cycle
    // page has one; the link targets it). Codex r2: "h1 is not the index's" also accepted no h1,
    // or the error boundary's. A page that never renders times out here and fails the leg.
    const rendered = await page
      .waitForFunction(() => Boolean(document.querySelector("h1") && document.getElementById("does-it-hold-up")), null, { timeout: 20000 })
      .then(() => true, () => false);
    await page.waitForTimeout(300);
    await page.goBack();
    // Poll for the restore (5s) rather than sleeping a fixed time; a stuck Back never arrives.
    await page.waitForFunction(() => document.querySelector("h1")?.textContent.trim() === "The ten cycles", null, { timeout: 5000 }).catch(() => {});    const back = await page.evaluate(() => {
      const h = document.getElementById("does-any-hold-up-heading");
      return {
        path: location.pathname,
        hash: location.hash,
        h1: document.querySelector("h1")?.textContent.trim(),
        scrollY: Math.round(scrollY),
        headingTop: h ? Math.round(h.getBoundingClientRect().top) : null,
      };
    });
    check(
      `${s.name}: one Back from a cycle opened there shows /cycles again`,
      rendered && back.path === "/cycles" && back.h1 === "The ten cycles",
      `opened ${cycleHref}${rendered ? "" : " (it never rendered as a cycle page)"}; after Back: url ${back.path}${back.hash} · h1 "${back.h1}" · scrollY ${back.scrollY} · verdict heading at ${back.headingTop}px`,
    );
    // ...and lands back AT the verdict list, not the page top (the manager review's "great
    // version": open the next cycle and compare). Judged since Codex r2: the heading is on the
    // upper half of the screen.
    const vh = await page.evaluate(() => innerHeight);
    check(
      `${s.name}: that Back lands at the verdict list`,
      back.headingTop !== null && back.headingTop >= 0 && back.headingTop <= vh / 2,
      `verdict heading at ${back.headingTop}px of ${vh}`,
    );
    // Keyboard (Codex review r1, finding 1: next/link kept focus at the link, so the next Tab
    // walked the ten entries above the verdicts). Fresh load, focus the link, Enter, Tab once:
    // focus must land inside the verdict section, as a native #hash jump puts it.
    // Chromium only: WebKit's Tab skips links by default, so this leg reads BODY there even for
    // a native <a href="#…"> (measured on production 2026-10-01) and would say nothing.
    if (!s.touch && engine === webkit) {
      console.log(`SKIP  ${s.name}: keyboard leg — WebKit's Tab skips links by default`);
    } else if (!s.touch) {
      await page.goto(`${origin}/cycles`, { waitUntil: "networkidle" });
      await page.locator(TARGET).first().focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(900);
      await page.keyboard.press("Tab");
      const kb = await page.evaluate(() => {
        const a = document.activeElement;
        return { inside: Boolean(document.getElementById("does-any-hold-up")?.contains(a)), what: `${a?.tagName} ${a?.getAttribute("href") ?? ""} "${(a?.textContent ?? "").trim().slice(0, 30)}"` };
      });
      check(`${s.name}: Enter on it, then Tab, focuses inside the verdicts`, kb.inside, `focus on ${kb.what}`);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}

const pass = results.filter(Boolean).length;
console.log(`\n${pass}/${results.length} ${pass === results.length ? "PASS" : "FAIL"}  (${origin}, ${engine.name()})`);
process.exit(pass === results.length ? 0 : 3);
