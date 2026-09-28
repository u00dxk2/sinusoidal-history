// Read every year axis on the chart and say whether any two labels print on top of each other.
//
//   node scripts/check-axis-labels.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Widths 320, 360, 390 and 1440; views: the
// Calibrate tab, a focused facet (?focus=khaldun) and the default page. Exit 0 all OK, 3 any OVERLAP.
// An overlap is two <text> boxes in one FacetTimeAxis svg (role=presentation) on the same baseline
// whose horizontal extents intersect, measured from the rendered boxes, not estimated.
// Written for I-008 (2026-09-28, commit cdc1e4c). The red arm is production before that deploy:
// 6 of 12 legs OVERLAP ("1920 x now · 2026" at 320 and 360, "2050 x now · 2026" at 1440, on the
// default view and the focused facet). After the deploy, 12 of 12 OK.
import { chromium } from "playwright";

const origin = (process.argv[2] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const browser = await chromium.launch();
let bad = 0;
for (const w of [320, 360, 390, 1440]) {
  for (const q of ["?tab=calibrate", "?focus=khaldun", ""]) {
    const page = await browser.newPage({ viewport: { width: w, height: 800 } });
    await page.goto(`${origin}/${q}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const res = await page.evaluate(() => {
      const hits = [];
      const axes = document.querySelectorAll('svg[role="presentation"]');
      for (const svg of axes) {
        const ts = [...svg.querySelectorAll("text")]
          .map((t) => ({ s: t.textContent, r: t.getBoundingClientRect() }))
          .filter((t) => t.r.width > 0);
        for (let i = 0; i < ts.length; i++)
          for (let j = i + 1; j < ts.length; j++) {
            const a = ts[i].r;
            const c = ts[j].r;
            if (Math.abs(a.top - c.top) < 4 && a.left < c.right && c.left < a.right)
              hits.push(`${ts[i].s} x ${ts[j].s}`);
          }
      }
      return { axes: axes.length, hits };
    });
    const ok = res.axes > 0 && res.hits.length === 0;
    if (!ok) bad++;
    const verdict = res.axes === 0 ? "NO-AXIS" : ok ? "OK     " : "OVERLAP";
    console.log(`${verdict} ${w} ${q || "/"} axes=${res.axes} ${res.hits.join("; ")}`);
    await page.close();
  }
}
await browser.close();
process.exit(bad ? 3 : 0);
