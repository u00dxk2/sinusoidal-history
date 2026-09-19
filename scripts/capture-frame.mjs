// Capture what a reader actually sees without scrolling.
//
//   node scripts/capture-frame.mjs <url> <out.png> [width] [height]
//
// fullPage is FALSE on purpose and must stay that way. A full-page screenshot
// stretches to the document height, so the fold — the thing these frames exist
// to show — is not in the image at all. On 2026-09-19 the before/after pair at
// 390x664 is the whole evidence that a cycle page's verdict was cut mid-sentence
// and then was not; captured full-page, both frames would have looked fine.
//
// Defaults are an iPhone 14 in Safari: 390x664 VISIBLE, not the 390x844 the
// device reports. See scripts/measure-fold.mjs for why that distinction is the
// whole point.
import { chromium } from "playwright";

const [url, out] = process.argv.slice(2);
const width = Number(process.argv[4] ?? 390);
const height = Number(process.argv[5] ?? 664);

if (!url || !out) {
  console.error("usage: node scripts/capture-frame.mjs <url> <out.png> [width] [height]");
  process.exit(2);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: 2,
});
await page.goto(url, { waitUntil: "networkidle" });
// CSV fetches and chart rendering settle; the same beat scripts/inspect.mjs uses.
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: false });
console.log(`${out}  <-  ${url} @ ${width}x${height} (viewport, not fullPage)`);
await browser.close();
