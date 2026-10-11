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
//   - 1440x900: the cue block is hidden (the figure is drawn whole there), and no edge arrow.
//   - 900x900 (I-031, 2026-10-11): both edge arrows are on screen while the figure overflows; the
//     one with nothing beyond it is aria-disabled and does nothing. The available one moves the
//     figure and leaves the URL alone. Pressing it to the end by keyboard keeps focus on it.
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
// I-031 (2026-10-11): a plain wheel moves the page, not the figure, so the mouse cue names the
// arrows at the figure's edges instead of "scroll". The edge legs below check those arrows.
const MOUSE = "Wider than this window: use the arrows at its edges to see the rest, or click it to open it full size";

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

    // I-031 edge cue. While the figure overflows, BOTH arrows are on screen; the one with nothing
    // beyond it is aria-disabled and does nothing (Codex r3, 2026-10-11: the arrows used to be
    // removed at their edge, and three rounds found a focus defect in that shape). An arrow that
    // is missing is a FAIL of its leg, never a crash of the run.
    const region = p900.locator("#spectral-verdict [role=region]");
    await region.scrollIntoViewIfNeeded();
    const right = p900.locator('[data-edge-cue="right"]');
    const left = p900.locator('[data-edge-cue="left"]');
    const place = () => region.evaluate((el) => ({ left: el.scrollLeft, max: el.scrollWidth - el.clientWidth }));
    const off = async (arrow) => (await arrow.isVisible()) && (await arrow.getAttribute("aria-disabled")) === "true";
    const on = async (arrow) => (await arrow.isVisible()) && (await arrow.getAttribute("aria-disabled")) !== "true";
    const urlBefore = p900.url();

    check(`900 mouse ${slug}: on arrival the right arrow is available and the left is shown disabled`, (await on(right)) && (await off(left)));
    // Codex r5: the disabled arrow's border must actually read dimmer than the available one's.
    const borders = await Promise.all([left, right].map((a) => a.evaluate((el) => getComputedStyle(el).borderTopColor)));
    check(`900 mouse ${slug}: the disabled arrow's border is dimmer than the available one's`, borders[0] !== borders[1], `disabled ${borders[0]} · available ${borders[1]}`);

    // A disabled arrow does nothing, and does not leave the page. Codex r4: an unchanged scrollLeft
    // cannot prove that at 0, because the browser clamps a negative scroll there anyway. So count
    // the region's scrollBy calls: a disabled arrow must make none.
    await region.evaluate((el) => {
      el.__scrollCalls = 0;
      const orig = el.scrollBy.bind(el);
      el.scrollBy = (...a) => {
        el.__scrollCalls++;
        return orig(...a);
      };
    });
    const calls = () => region.evaluate((el) => el.__scrollCalls);
    // force: Playwright will not click an aria-disabled element on its own, but a reader's mouse
    // does, and that click is what this leg is about.
    if (await left.isVisible()) await left.click({ force: true });
    await p900.waitForTimeout(300);
    const afterDisabled = await place();
    const disabledCalls = await calls();
    check(
      `900 mouse ${slug}: the disabled left arrow does nothing`,
      (await left.isVisible()) && disabledCalls === 0 && afterDisabled.left === 0 && p900.url() === urlBefore,
      `scrollBy calls ${disabledCalls}; scrollLeft ${afterDisabled.left}; url ${p900.url() === urlBefore ? "unchanged" : p900.url()}`,
    );

    const rightOn = await on(right);
    if (rightOn) {
      await right.click();
      await p900.waitForTimeout(700);
    }
    const moved = await place();
    check(
      `900 mouse ${slug}: right arrow moves the figure, not the page`,
      rightOn && moved.left > 0 && p900.url() === urlBefore,
      rightOn ? `scrollLeft 0 → ${moved.left}; url ${p900.url() === urlBefore ? "unchanged" : p900.url()}` : "no available right arrow",
    );

    await region.evaluate((el) => (el.scrollLeft = el.scrollWidth));
    await p900.waitForTimeout(300);
    const leftOn = await on(left);
    check(`900 mouse ${slug}: at the right end the right arrow is disabled and the left available`, (await off(right)) && leftOn);
    const end = await place();
    if (leftOn) {
      await left.click();
      await p900.waitForTimeout(700);
    }
    const back = await place();
    check(`900 mouse ${slug}: left arrow moves the figure back`, leftOn && back.left < end.left, `scrollLeft ${end.left} → ${back.left}`);

    // Keyboard: press the right arrow to the end. The figure must reach its right end, the right
    // arrow must read disabled, and focus must still be on that same arrow (Codex r2: judge the
    // END, so parking focus somewhere without scrolling cannot pass).
    await region.evaluate((el) => (el.scrollLeft = 0));
    await p900.waitForTimeout(300);
    let focusKept = false;
    let focusNote = "no available right arrow to focus";
    if (await on(right)) {
      await right.focus();
      for (let i = 0; i < 4 && (await on(right)); i++) {
        await p900.keyboard.press("Enter");
        await p900.waitForTimeout(700);
      }
      const s = await place();
      const where = await p900.evaluate(() => {
        const a = document.activeElement;
        return a ? a.getAttribute("data-edge-cue") ?? a.getAttribute("role") ?? a.tagName : "none";
      });
      const atEnd = s.left >= s.max - 1;
      const rightOff = await off(right);
      focusKept = atEnd && rightOff && where === "right";
      focusNote = `scrollLeft ${s.left} of ${s.max}; right arrow ${rightOff ? "disabled" : "not disabled"}; focus on ${where}`;
    }
    check(`900 keyboard ${slug}: at the end focus is still on the arrow that was pressed`, focusKept, focusNote);
    // Codex r4: activate the now-disabled arrow by keyboard too. It must make no scrollBy call.
    let kbNote = "the right arrow is not focused and disabled";
    let kbInert = false;
    if (focusKept) {
      const before = await calls();
      await p900.keyboard.press("Enter");
      await p900.keyboard.press(" ");
      await p900.waitForTimeout(300);
      const after = await calls();
      kbInert = after === before;
      kbNote = `scrollBy calls ${before} → ${after}`;
    }
    check(`900 keyboard ${slug}: Enter and Space on the disabled arrow do nothing`, kbInert, kbNote);
    // Focus visibility (Codex r4): the disabled, focused arrow's outline is drawn at full opacity.
    let ringNote = "no focused disabled arrow";
    let ringOk = false;
    if (focusKept) {
      const st = await right.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { opacity: cs.opacity, outline: cs.outlineStyle, width: cs.outlineWidth };
      });
      ringOk = st.opacity === "1" && st.outline !== "none" && st.width !== "0px";
      ringNote = `button opacity ${st.opacity}; outline ${st.outline} ${st.width}`;
    }
    check(`900 keyboard ${slug}: the focused disabled arrow keeps a full-strength focus ring`, ringOk, ringNote);

    const caption = t900.find((t) => t.includes("Read the protocol under")) ?? "";
    if (v.eligible) {
      check(`caption ${slug} (eligible): keeps the test description`, caption.startsWith("Pre-registered harmonic-regression test"), caption.slice(0, 80));
    } else {
      const want = `No test was run: this record covers ${v.cycles_covered.toFixed(1)} of the 3.0 full periods`;
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
      // Codex r2: judge the TEXT boxes, every one of them, on both edges, and refuse an empty
      // or zero-sized set (font-size:0 keeps the paragraph's box and its innerText).
      const rects = [...range.getClientRects()];
      const sized = rects.length > 0 && rects.every((r) => r.width > 0 && r.height > 0);
      const inside = rects.every((r) => r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= fr.top);
      const rows = new Set(rects.map((r) => Math.round(r.top))).size;
      return { sized, inside, lineTop: Math.round(pr.top), lineBottom: Math.round(pr.bottom), rows, figTop: Math.round(fr.top), vw: innerWidth };
    }, line);
    check(
      `390 touch ${slug}: on arrival at the figure the whole line is on screen above it`,
      !!geo && geo.sized && geo.inside,
      geo ? `line ${geo.lineTop}-${geo.lineBottom}px in ${geo.rows} row(s) of ${geo.vw} wide; text sized ${geo.sized}, inside ${geo.inside}; figure top ${geo.figTop}` : "line or figure missing",
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
    check(
      `1440 mouse ${slug}: no edge arrows (the figure is drawn whole)`,
      (await p1440.locator("[data-edge-cue]").count()) === 0,
    );
    await p1440.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((ok) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} ${failed ? "FAIL" : "PASS"}  (${origin}, chromium)`);
process.exit(failed ? 3 : 0);
