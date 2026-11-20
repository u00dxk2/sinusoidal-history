// I-087 /methods re-budget probe (2026-11-20). No build: it reads PRODUCTION /methods (flag a is on
// there, so the pass's fonts are loaded on <html>), puts data-dp on the article the way the new
// tree does, and measures the fold answer (check-entry-folds' /methods selector) under candidate
// CSS. The baseline row must reproduce the flag-on local build's reading (2026-11-20 run-i088:
// 320x568 CUT 20px, 360x560 CUT 7px); if it does not, the probe is not measuring the same page and
// every candidate row is UNREAD.
//
//   node docs/claims/probe-methods-fold.mjs
import { chromium } from "playwright";

const URL = "https://sinusoidalhistory.com/methods";
const ANSWER = 'section[aria-label="In brief"] > p:nth-of-type(2)';
const LEDE = "article > header > p:nth-of-type(2)";
// The new tree's lede rule (globals.css, 2849895), which production does not serve yet. Run 1 of
// this probe left it out: its baseline read 1px spare at 320x568 against the build's CUT 20px with
// the lede in dpDisplay, i.e. it measured a different page. Every candidate now carries it.
const TREE = `[data-dp] header > p.font-display-italic { font-family: var(--dp-text); font-weight: 400; font-style: normal; font-variation-settings: normal; font-feature-settings: "kern" on; letter-spacing: normal; }`;
// Each candidate: CSS applied below sm (the classes it would become are noted beside it).
const CANDIDATES = {
  baseline: "",
  // header mb-5 -> mb-3 (and mb-4 -> mb-2 under 360); rule mt-4 -> mt-3 (mt-3 -> mt-2 under 360)
  spacing: `
    article[data-dp] > header { margin-bottom: 12px !important; }
    article[data-dp] > header > .editorial-rule { margin-top: 12px !important; }
    @media (max-width: 359.98px) {
      article[data-dp] > header { margin-bottom: 8px !important; }
      article[data-dp] > header > .editorial-rule { margin-top: 8px !important; }
    }`,
  // lede 15px -> 14px below sm
  lede14: `article[data-dp] > header > p:nth-of-type(2) { font-size: 14px !important; }`,
  both: "",
};
CANDIDATES.both = CANDIDATES.spacing + CANDIDATES.lede14;
// lede 13px under 360 only, with the spacing and 14px from 360 to sm
CANDIDATES.both13 = CANDIDATES.both + `@media (max-width: 359.98px) { article[data-dp] > header > p:nth-of-type(2) { font-size: 13px !important; } }`;
for (const k of Object.keys(CANDIDATES)) CANDIDATES[k] = TREE + CANDIDATES[k];

const browser = await chromium.launch();
let problems = 0;
try {
  for (const [w, h] of [[320, 568], [360, 560]]) {
    for (const [name, css] of Object.entries(CANDIDATES)) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.goto(URL, { waitUntil: "load" });
      const r = await page.evaluate(
        async ({ css, answer, lede }) => {
          const a = document.querySelector("article");
          a.setAttribute("data-dp", "");
          {
            const s = document.createElement("style");
            s.textContent = css;
            document.head.appendChild(s);
          }
          await document.fonts.ready;
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          const lines = (el) => {
            const range = document.createRange();
            range.selectNodeContents(el);
            return new Set([...range.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size;
          };
          const ans = document.querySelector(answer).getBoundingClientRect();
          const l = document.querySelector(lede);
          return {
            bottom: Math.round(ans.bottom + scrollY),
            ledeLines: lines(l),
            ledeFace: getComputedStyle(l).fontFamily.split(",")[0],
          };
        },
        { css, answer: ANSWER, lede: LEDE },
      );
      const room = h - r.bottom;
      console.log(`${w}x${h} ${name.padEnd(9)} answer bottom ${r.bottom} -> ${room >= 0 ? `${room}px spare` : `CUT ${-room}px`} · lede ${r.ledeLines} line(s) in ${r.ledeFace}`);
      await page.close();
    }
  }
} catch (e) {
  problems += 1;
  console.log(`probe error: ${e.message}`);
} finally {
  await browser.close();
}
process.exit(problems ? 1 : 0);
