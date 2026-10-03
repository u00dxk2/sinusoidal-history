// Tap the confidence tags the way a phone reader does, and say where each tap lands.
//
//   node scripts/check-confidence-tag-taps.mjs [origin] [landed-frame.png]
//
// origin defaults to https://sinusoidalhistory.com. Touch taps at 390x664. Exit 0 all PASS, 3 any FAIL.
// Seven legs: the /cycles tag is a link and lands on #confidence-tags in view; the description and
// the metadata line still open the cycle page (the stretched name link); "The longer story" still
// toggles; no <a> nests inside another; a cycle page's masthead tag lands on #confidence.
// Written for W-002 (2026-09-27, commit 8e144cb). Production read 7/7 that day, and 2 of 7 before
// the deploy (the two tag legs), which is the red arm.
// It checks where taps LAND, not whether a reader understands what they land on. The second
// question is a cold read of the landed frame (W-003).
// Waits for "load", not "networkidle" (2026-10-03): the router's prefetches of the cycle pages
// stay open on /cycles, so networkidle timed out at 30s on 2 of 2 production runs that day while
// the server answered each of those requests in under half a second. Every tap here is on a
// plain link or a <details>, which work before hydration.
import { chromium } from "playwright";

const origin = (process.argv[2] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const frameOut = process.argv[3];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
const results = [];
const check = (name, ok, detail) => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);

const first = "header + ul > li:first-child";

// 1. Tap the tag.
await page.goto(origin + "/cycles", { waitUntil: "load" });
const tag = page.locator(`${first} a[href="#confidence-tags"]`);
const tagCount = await tag.count();
check("tag is a link, labelled", tagCount === 1, tagCount ? await tag.textContent() : "no tag link");
if (tagCount) await tag.tap();
await page.waitForTimeout(800);
const inView = await page.evaluate(() => {
  const r = document.getElementById("confidence-tags").getBoundingClientRect();
  return { top: Math.round(r.top), vh: innerHeight };
});
check("tap tag -> #confidence-tags in view", page.url().endsWith("/cycles#confidence-tags") && inView.top >= 0 && inView.top < inView.vh, `${page.url()} top=${inView.top}`);
if (frameOut) await page.screenshot({ path: frameOut });

// 2. Tap the description (the stretched overlay, not the name itself).
await page.goto(origin + "/cycles", { waitUntil: "load" });
const desc = await page.locator(`${first} p`).first().boundingBox();
await page.touchscreen.tap(desc.x + desc.width / 2, desc.y + desc.height / 2);
await page.waitForURL(/\/cycles\/[a-z-]+$/, { timeout: 8000 }).catch(() => {});
check("tap description -> cycle page", /\/cycles\/schlesinger-jr$/.test(page.url()), page.url());

// 3. Tap the metadata line to the LEFT of the tag ("30y · peak 1970 ·").
await page.goto(origin + "/cycles", { waitUntil: "load" });
const meta = await page.locator(`${first} span.font-mono`).boundingBox();
await page.touchscreen.tap(meta.x + 5, meta.y + meta.height / 2);
await page.waitForURL(/\/cycles\/[a-z-]+$/, { timeout: 8000 }).catch(() => {});
check("tap '30y · peak' -> cycle page", /\/cycles\/schlesinger-jr$/.test(page.url()), page.url());

// 4. "The longer story" still toggles.
await page.goto(origin + "/cycles", { waitUntil: "load" });
const summary = page.locator(`${first} details > summary`);
await summary.tap();
await page.waitForTimeout(300);
const open = await page.locator(`${first} details`).evaluate((d) => d.open);
check("tap 'The longer story' -> opens, stays on /cycles", open && page.url().endsWith("/cycles"), `open=${open} ${page.url()}`);

// 5. No nested anchors in the live DOM.
const nested = await page.evaluate(() => document.querySelectorAll("a a").length);
check("no <a> inside <a>", nested === 0, `${nested}`);

// 6. Sibling: a cycle page's masthead tag jumps to its own classification.
await page.goto(origin + "/cycles/schlesinger-jr", { waitUntil: "load" });
const mast = page.locator('header a[href="#confidence"]');
if (await mast.count()) {
  await mast.tap();
  await page.waitForTimeout(800);
  const top = await page.evaluate(() => Math.round(document.getElementById("confidence").getBoundingClientRect().top));
  check("cycle page: tap masthead tag -> #confidence in view", page.url().endsWith("#confidence") && top >= 0 && top < 664, `top=${top}`);
} else check("cycle page: tap masthead tag -> #confidence in view", false, "no masthead tag link");

await browser.close();
console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 3 : 0);
