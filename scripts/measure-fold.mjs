// Does a cycle page's "Does it hold up?" answer reach a reader without a scroll?
//
// The site's one differentiating claim is the verdict block; on a phone it is
// worth nothing if it lands below the fold. Measure the real visible viewport,
// not the CSS one: an iPhone 14 reports 390x844 but Safari's chrome leaves
// ~664px, and on 2026-09-19 the answer cleared 844 while being cut at 664 —
// which is exactly how the defect stayed invisible.
//
//   node scripts/measure-fold.mjs <url> [width] [height] [selector]
//
// A selector measures the first element matching it instead of the verdict —
// the home page's first cycle curve is `[data-facet-id] svg[role="img"]`.
//
// Exit 0 the answer is fully visible · 1 it is cut · 2 the section is missing.
import { chromium } from "playwright";

const url = process.argv[2];
const width = Number(process.argv[3] ?? 390);
const height = Number(process.argv[4] ?? 664);
const selector = process.argv[5];

if (!url) {
  console.error(
    "usage: node scripts/measure-fold.mjs <url> [width] [height] [selector]",
  );
  process.exit(2);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url, { waitUntil: "networkidle" });

const m = await page.evaluate((sel) => {
  const box = document.querySelector(sel ?? "#does-it-hold-up");
  if (!box) return null;
  const answer = sel ? box : box.querySelector("p");
  const top = (el) => Math.round(el.getBoundingClientRect().top + window.scrollY);
  return {
    sectionTop: top(box),
    answerTop: top(answer),
    answerBottom: Math.round(
      answer.getBoundingClientRect().bottom + window.scrollY,
    ),
  };
}, selector ?? null);
await browser.close();

if (!m) {
  console.log(`FAIL no ${selector ?? "#does-it-hold-up section"} on ${url}`);
  process.exit(2);
}

const what = selector ?? "the verdict";
const cut = m.answerBottom - height;
console.log(`${url} @ ${width}x${height}`);
if (!selector) console.log(`  section top   ${m.sectionTop}px`);
console.log(`  ${selector ? "top   " : "answer top"}    ${m.answerTop}px`);
console.log(
  `  ${selector ? "bottom" : "answer bottom"} ${m.answerBottom}px  (fold ${height}px)`,
);
if (cut > 0) {
  console.log(`  RED: ${what} is cut — ${cut}px below the fold`);
  process.exit(1);
}
console.log(`  OK: ${what} is fully visible, ${-cut}px of room to spare`);
