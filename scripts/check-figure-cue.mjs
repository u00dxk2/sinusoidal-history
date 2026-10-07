// Read the words around each /cycles/<slug> spectral figure: the cue, the target/band line and the
// protocol caption, at the widths and pointers a reader brings.
//
//   node scripts/check-figure-cue.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL.
// Written for I-021 (2026-10-07). Legs, per paired cycle:
//   - 900x900, mouse: the cue does not say "Swipe"; it says scroll sideways or click to open full
//     size. A mouse at 768-1023 was told to swipe (cold walk 2026-10-07, step 2).
//   - 390x664, touch (iPhone 15): the cue says swipe; the mouse wording is hidden.
//   - both: the target/band line is visible and reads the verdict's own period, state and periods
//     covered, rebuilt here from the served verdicts.json (never from the site's helper). At 390 it
//     sits on the same screen as the figure's top.
//   - 1440x900: the cue block is hidden (the figure is drawn whole there).
//   - the caption: on a record too short to test it says no test was run on this record and does
//     not open with the test's description; on an eligible record it keeps that description.
// Red arm: production before I-021 shows "Swipe sideways" to a mouse at 900, has no target/band
// line, and opens every caption with "Pre-registered harmonic-regression test".
import { chromium, devices } from "playwright";

const origin = (process.argv[2] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

// An independent copy of the state wording, so a change to the site's map cannot pass itself.
const LABELS = {
  INSUFFICIENT_DATA: "Insufficient data — no test possible",
  NO_SIGNIFICANT_TARGET_POWER: "No significant target power",
  MODEL_SENSITIVE: "Model-sensitive — no verdict",
  SIGNIFICANT_TARGET_POWER: "Significant target power",
};
const slugOf = (id) => id.replaceAll("_", "-");
const expectedLine = (v) =>
  `Target period ${v.period_years} years · ${LABELS[v.state]}` +
  (v.eligible ? "" : ` · ${v.cycles_covered.toFixed(1)} of 3.0 required periods`);

const verdicts = await (await fetch(`${origin}/data/spectral/verdicts.json`)).json();
const rows = verdicts.primary;
console.log(`${rows.length} paired verdicts (${rows.filter((r) => r.eligible).length} eligible) from ${origin}`);

const SWIPE = "Swipe sideways for the whole figure";
const MOUSE = "Scroll sideways for the whole figure, or click it to open it full size";

// Visible <p> texts inside the verdict section, in order.
async function visibleTexts(page) {
  return page.$$eval("#spectral-verdict p", (ps) =>
    ps
      .filter((p) => {
        const r = p.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(p).visibility !== "hidden";
      })
      .map((p) => p.innerText.replace(/\s+/g, " ").trim()),
  );
}

const browser = await chromium.launch();
try {
  const mouse900 = await browser.newContext({ viewport: { width: 900, height: 900 } });
  const mouse1440 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const phone = await browser.newContext({ ...devices["iPhone 15"], viewport: { width: 390, height: 664 } });

  for (const v of rows) {
    const slug = slugOf(v.cycle_id);
    const url = `${origin}/cycles/${slug}`;
    const line = expectedLine(v);

    const p900 = await mouse900.newPage();
    await p900.goto(url, { waitUntil: "networkidle" });
    const t900 = await visibleTexts(p900);
    check(`900 mouse ${slug}: no "Swipe" cue`, !t900.some((t) => t.includes("Swipe")), t900.find((t) => t.includes("Swipe")) ?? "");
    check(`900 mouse ${slug}: mouse cue shown`, t900.includes(MOUSE));
    check(`900 mouse ${slug}: target/band line`, t900.includes(line), line);

    const caption = t900.find((t) => t.includes("Read the protocol under")) ?? "";
    if (v.eligible) {
      check(`caption ${slug} (eligible): keeps the test description`, caption.startsWith("Pre-registered harmonic-regression test"), caption.slice(0, 80));
    } else {
      const want = `No test was run on this record: it covers ${v.cycles_covered.toFixed(1)} of the 3.0 full periods`;
      check(`caption ${slug} (ineligible): says no test was run`, caption.startsWith(want), caption.slice(0, 90));
      check(`caption ${slug} (ineligible): does not open as a test`, !!caption && !caption.startsWith("Pre-registered"));
    }
    const draws = `(${verdicts.draws.toLocaleString("en-US")} bootstrap draws)`;
    check(`caption ${slug}: draw count matches verdicts.json`, caption.includes(draws), draws);
    await p900.close();

    const pp = await phone.newPage();
    await pp.goto(url, { waitUntil: "networkidle" });
    const tp = await visibleTexts(pp);
    check(`390 touch ${slug}: swipe cue shown`, tp.includes(SWIPE));
    check(`390 touch ${slug}: mouse cue hidden`, !tp.includes(MOUSE));
    check(`390 touch ${slug}: target/band line`, tp.includes(line));
    // Arrival, not a manufactured position: scroll as a reader does until the figure's top sits
    // 300px down the screen (the figure has just come into view), then ask whether the whole line
    // is on screen above it. Codex r1 (2026-10-07): an earlier version scrolled the LINE to the top
    // first, which passed by construction. The line may wrap; its row count is printed, not judged,
    // and every row must sit inside the viewport's width.
    const geo = await pp.evaluate((want) => {
      const p = [...document.querySelectorAll("#spectral-verdict p")].find(
        (el) => el.innerText.replace(/\s+/g, " ").trim() === want,
      );
      const fig = document.querySelector("#spectral-verdict [role=region]");
      if (!p || !fig) return null;
      window.scrollTo(0, fig.getBoundingClientRect().top + window.scrollY - 300);
      const pr = p.getBoundingClientRect();
      const fr = fig.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(p);
      const rects = [...range.getClientRects()];
      const rows = new Set(rects.map((r) => Math.round(r.top))).size;
      const right = Math.max(...rects.map((r) => r.right));
      return { lineTop: Math.round(pr.top), lineBottom: Math.round(pr.bottom), right: Math.round(right), rows, figTop: Math.round(fr.top), vw: innerWidth };
    }, line);
    check(
      `390 touch ${slug}: on arrival at the figure the whole line is on screen above it`,
      !!geo && geo.lineTop >= 0 && geo.lineBottom <= geo.figTop && geo.right <= geo.vw,
      geo ? `line ${geo.lineTop}-${geo.lineBottom}px in ${geo.rows} row(s), right edge ${geo.right} of ${geo.vw}; figure top ${geo.figTop}` : "line or figure missing",
    );
    await pp.close();

    const p1440 = await mouse1440.newPage();
    await p1440.goto(url, { waitUntil: "networkidle" });
    const t1440 = await visibleTexts(p1440);
    check(
      `1440 mouse ${slug}: cue block hidden, caption still shown`,
      !t1440.includes(MOUSE) && !t1440.includes(SWIPE) && !t1440.includes(line) &&
        t1440.some((t) => t.includes("Read the protocol under")),
    );
    await p1440.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((ok) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} ${failed ? "FAIL" : "PASS"}  (${origin}, chromium)`);
process.exit(failed ? 3 : 0);
