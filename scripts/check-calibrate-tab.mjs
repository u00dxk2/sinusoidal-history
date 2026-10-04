// Drive the chart's Calibrate tab the way a reader does, and say what each drag did.
//
//   node scripts/check-calibrate-tab.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Runs at 390x664, 1440x900 and 320x568.
// Exit 0 all PASS, 3 any FAIL. Legs per size: one facet mounted in the tab (the Facets tab's copy
// is unmounted, so data-facet-id stays unique); the chart svg is there; r carries its "full record
// START–END · n=N" scope; a year axis sits inside the facet; the chart's top and the peak slider fit
// one screen; one peak-slider drag changes the drawn path AND r; reset restores the path; the
// picker switches cycle; the header opens that cycle in the Facets view with focus on it.
// Written for I-008 (2026-09-28, commit cdc1e4c). Production read 30/30 after that deploy. The red
// arm is the P1 baseline on the old build: measure-fold found no `[data-facet-id] svg[role=img]` in
// the tab at all (exit 2), which here fails the first two legs at every size.
// 2026-10-03 (cold walk, W-003): two more legs per size. Arriving at /?focus=<id> and opening the
// tab, the facet and the pressed chip are that cycle. Red arm: production before the change opens
// on the picker's first cycle whatever the focus is.
// 2026-10-04 (I-022): six more legs per cycle page and size: a Calibrate link within 3 screens;
// one tap onto its chip; curve top and a LOADED r on screen; then, once per arrival, no second
// scroll on a reload after a slider move, on Back from another page, or on reopening the tab by
// hand. Plus one per focused cycle: opening the tab by hand does not scroll. Red arm: production
// on 10-04 (no link: 36/42).
// It checks that the drag is VISIBLE, not that a reader understands it; that is W-003's cold walk.
import { chromium } from "playwright";

const origin = (process.argv[2] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const browser = await chromium.launch();
for (const [w, h] of [[390, 664], [1440, 900], [320, 568]]) {
  const tag = `${w}x${h}`;
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(`${origin}/?tab=calibrate`, { waitUntil: "networkidle" });
  const facets = page.locator("[data-facet-id]");
  const svg = page.locator('[data-facet-id] svg[role="img"]');
  await svg.first().waitFor({ timeout: 10000 }).catch(() => {});
  const nFacets = await facets.count();
  check(`${tag} exactly one facet mounted in Calibrate tab`, nFacets === 1, `count=${nFacets}`);
  check(`${tag} chart svg present`, (await svg.count()) >= 1);
  if (nFacets !== 1 || (await svg.count()) === 0) {
    await page.close();
    continue;
  }
  // Let the paired series' CSV load before comparing drawn paths.
  await page.waitForTimeout(800);
  const firstId = await facets.first().getAttribute("data-facet-id");
  const facetText = await facets.first().innerText();
  check(
    `${tag} r states its scope`,
    /full record \d{4}–\d{4} · n=\d+/.test(facetText),
    (facetText.match(/full record[^\n]*/) ?? [""])[0]
  );
  const axisTicks = await facets.first().locator('svg[role="presentation"] text').count();
  check(`${tag} year axis inside the facet`, axisTicks >= 3, `labels=${axisTicks}`);

  const paths = async () =>
    (await svg.first().locator("path").evaluateAll((ps) => ps.map((p) => p.getAttribute("d") ?? ""))).join("|");
  const rText = async () =>
    (await page.locator('[data-facet-id] [aria-live="polite"]').first().innerText()).replace(/\s+/g, " ");
  const slider = page.locator('[data-facet-id] [role="slider"]').first();
  const sb = await svg.first().boundingBox();
  const lb = await slider.boundingBox();
  const span = Math.round(lb.y + lb.height - sb.y);
  check(`${tag} chart top + peak slider fit one screen`, span <= h, `span=${span}px of ${h}`);

  const d0 = await paths();
  const r0 = await rText();
  await slider.focus();
  for (let i = 0; i < 8; i++) await slider.press("ArrowRight");
  await page.waitForTimeout(300);
  check(`${tag} peak drag moves the drawn curve`, (await paths()) !== d0);
  check(`${tag} r changes with it`, (await rText()) !== r0);

  await page.getByRole("button", { name: "reset to published" }).click();
  await page.waitForTimeout(300);
  check(`${tag} reset restores the curve`, (await paths()) === d0);

  await page.locator("button[aria-pressed]").nth(1).click();
  await page.waitForTimeout(300);
  const secondId = await facets.first().getAttribute("data-facet-id");
  check(`${tag} picker switches the facet`, secondId !== firstId, `${firstId} -> ${secondId}`);

  await page.locator("[data-facet-id] button").first().click();
  await page.waitForTimeout(500);
  const focusedIn = await page.evaluate(
    () => document.activeElement?.closest("[data-facet-id]")?.getAttribute("data-facet-id") ?? null
  );
  const facetsSelected = await page.getByRole("tab", { name: "Facets" }).getAttribute("aria-selected");
  check(
    `${tag} header opens Facets on that cycle`,
    facetsSelected === "true" && focusedIn === secondId,
    `focus=${focusedIn}`
  );

  // The reader's path from a cycle page: "Open in the chart" arrives at /?focus=<id>, and the
  // Calibrate tab must open on THAT cycle. Two ids, so at least one is not the picker's first.
  for (const id of ["schlesinger_jr", "kondratiev"]) {
    await page.goto(`${origin}/?focus=${id}`, { waitUntil: "load" });
    const tab = page.getByRole("tab", { name: "Calibrate" });
    await tab.waitFor({ timeout: 10000 });
    await page.waitForTimeout(800);
    // A reader scrolls up to the tab before tapping it; so does Playwright's click, which would
    // otherwise move the page itself and fail the "by hand" leg below (it did, 936 -> 348, on the
    // first run of that leg). Bring the tab into view first, then take the before reading.
    await tab.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const yBeforeTab = await page.evaluate(() => Math.round(window.scrollY));
    await tab.click();
    await svg.first().waitFor({ timeout: 10000 }).catch(() => {});
    const opened = (await facets.count()) === 1 ? await facets.first().getAttribute("data-facet-id") : null;
    // The picker's chips carry data-chip-id. Exactly one is pressed, and it is this cycle's
    // (Codex r2 #1: the first version read the chip for the detail line only, so a wrong chip
    // could not fail the leg). A build without the attribute reads "none" and fails.
    const pressed = await page.locator('button[data-chip-id][aria-pressed="true"]').evaluateAll((bs) => bs.map((b) => b.getAttribute("data-chip-id")));
    check(
      `${tag} Calibrate opens on the focused cycle (${id})`,
      opened === id && pressed.length === 1 && pressed[0] === id,
      `facet=${opened} · chip pressed: ${pressed.join(", ") || "none"}`,
    );
    // I-022: the arrival scroll is for a page that ARRIVES on Calibrate. Opening the tab by hand
    // must not scroll, beyond any clamp the browser applies if the shorter Calibrate content
    // leaves the page shorter than the reading. So the expected scrollY is min(before, new max).
    await page.waitForTimeout(600);
    const after = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      max: Math.max(0, Math.round(document.documentElement.scrollHeight - window.innerHeight)),
    }));
    const expectedY = Math.min(yBeforeTab, after.max);
    check(
      `${tag} opening Calibrate by hand does not scroll (${id})`,
      Math.abs(after.y - expectedY) <= 2,
      `scrollY ${yBeforeTab} -> ${after.y} (clamp ${after.max}, expected ${expectedY})`,
    );
  }

  // I-022 (2026-10-04): the way in FROM a cycle page. On 10-04 production had no such link; the
  // only one ("Open in the chart") sat 7.6 screens down a 390x664 page and landed on Facets, with
  // the curve 1,096px below the screen. Three legs per cycle: the link is within the first three
  // screens; one tap lands on that cycle's chip; the curve's top and r's bottom are both on screen.
  // The on-screen leg reads the viewport against two boxes in the landed facet. It never reads a
  // scroll target the page computes for itself, so a landing aimed at the wrong element fails.
  for (const slug of ["schlesinger-jr", "kondratiev"]) {
    const id = slug.replace(/-/g, "_");
    await page.goto(`${origin}/cycles/${slug}`, { waitUntil: "load" });
    const link = page.locator('a[href*="tab=calibrate"]').first();
    const linkY = (await link.count())
      ? await link.evaluate((a) => Math.round(a.getBoundingClientRect().top + window.scrollY))
      : null;
    check(
      `${tag} ${slug}: a Calibrate link within 3 screens`,
      linkY !== null && linkY <= 3 * h,
      linkY === null ? "no link" : `at ${linkY}px (${(linkY / h).toFixed(1)} screens)`,
    );
    if (linkY === null) continue;
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await page.waitForURL(/tab=calibrate/, { timeout: 10000 }).catch(() => {});
    await svg.first().waitFor({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const pressed = await page.locator('button[data-chip-id][aria-pressed="true"]').evaluateAll((bs) => bs.map((b) => b.getAttribute("data-chip-id")));
    check(
      `${tag} ${slug}: one tap lands on its Calibrate chip`,
      pressed.length === 1 && pressed[0] === id,
      `chip pressed: ${pressed.join(", ") || "none"}`,
    );
    // r must be a LOADED number, not "…" or "n/a": a box on screen holding a placeholder is not
    // "r on screen" (Codex r1, 2026-10-04).
    const boxes = await page.evaluate(() => {
      const facet = document.querySelector("[data-facet-id]");
      const chart = facet?.querySelector('svg[role="img"]')?.getBoundingClientRect();
      const rEl = facet?.querySelector('[aria-live="polite"]');
      const r = rEl?.getBoundingClientRect();
      return chart && r
        ? { top: Math.round(chart.top), bottom: Math.round(r.bottom), y: Math.round(window.scrollY), text: rEl.innerText }
        : null;
    });
    const rValue = boxes ? (boxes.text.match(/[−-]?\d\.\d{3}/) ?? [null])[0] : null;
    check(
      `${tag} ${slug}: curve and a loaded r on one screen after the tap`,
      boxes !== null && boxes.top >= 0 && boxes.bottom <= h && rValue !== null,
      boxes ? `curve top ${boxes.top}, r bottom ${boxes.bottom} of ${h}, r=${rValue ?? "not loaded"}` : "no facet",
    );
    if (!boxes) continue;
    const landedUrl = page.url();
    check(
      `${tag} ${slug}: the one-shot arrive param is gone after the tap`,
      /tab=calibrate/.test(landedUrl) && !/[?&]arrive=/.test(landedUrl),
      landedUrl.replace(origin, ""),
    );
    // Once per arrival, by decision (2026-10-04, manager review). Codex r1 found the first version
    // re-scrolled after a slider move (nuqs's replaceState wiped a history.state marker), and that
    // the legs only reloaded from scrollY 0 with nothing touched. So: move the slider (a URL
    // write), park at a mid position that is NOT the landing, then reload, then Back from another
    // page, then reopen the tab by hand. None may scroll the reader back to the curve.
    const slider = page.locator('[data-facet-id] [role="slider"]').first();
    await slider.focus();
    for (let i = 0; i < 3; i++) await slider.press("ArrowRight");
    await page.waitForTimeout(400);
    const park = 200;
    const parked = async () => {
      await page.evaluate((y) => window.scrollTo(0, y), park);
      await page.waitForTimeout(400);
    };
    const settledY = async () => {
      await svg.first().waitFor({ timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1200);
      return page.evaluate(() => Math.round(window.scrollY));
    };
    await parked();
    await page.reload({ waitUntil: "load" });
    const yReload = await settledY();
    check(
      `${tag} ${slug}: a reload after a slider move does not scroll again`,
      // Kept at the park, not merely "not far down": a reset to 0 is a different bug (Codex r2).
      Math.abs(yReload - park) <= 50,
      `parked at ${park}, after reload ${yReload} (the landing was ${boxes.y})`,
    );
    await parked();
    await page.goto(`${origin}/about`, { waitUntil: "load" });
    await page.goBack({ waitUntil: "load" });
    const yBack = await settledY();
    check(
      `${tag} ${slug}: Back to the chart does not scroll again`,
      Math.abs(yBack - park) <= 50,
      `parked at ${park}, after Back ${yBack} (the landing was ${boxes.y})`,
    );
    await page.getByRole("tab", { name: "Facets" }).click();
    await page.waitForTimeout(600);
    const calTab = page.getByRole("tab", { name: "Calibrate" });
    await calTab.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const yHand = await page.evaluate(() => Math.round(window.scrollY));
    await calTab.click();
    await page.waitForTimeout(800);
    const afterHand = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      max: Math.max(0, Math.round(document.documentElement.scrollHeight - window.innerHeight)),
    }));
    const expectedHand = Math.min(yHand, afterHand.max);
    check(
      `${tag} ${slug}: reopening Calibrate by hand after the arrival does not scroll`,
      Math.abs(afterHand.y - expectedHand) <= 2,
      `scrollY ${yHand} -> ${afterHand.y} (expected ${expectedHand})`,
    );
  }

  // Codex r2 (2026-10-04): an arrival that never reaches its scroll must still be spent. Two
  // ways in, both ending in "open Calibrate by hand; it must not scroll":
  //  (a) a URL carrying arrive=1 while on Facets (crafted, or left behind by any path);
  //  (b) the real cancellation: tap the link and switch to Facets the instant the Calibrate facet
  //      mounts, before any animation frame (a MutationObserver callback runs as a microtask).
  const handOpenAfter = async (p, label) => {
    const calTab = p.getByRole("tab", { name: "Calibrate" });
    await calTab.waitFor({ timeout: 10000 });
    await p.waitForTimeout(800);
    await calTab.scrollIntoViewIfNeeded();
    await p.waitForTimeout(200);
    const y0 = await p.evaluate(() => Math.round(window.scrollY));
    await calTab.click();
    await p.waitForTimeout(1000);
    const a = await p.evaluate(() => ({
      y: Math.round(window.scrollY),
      max: Math.max(0, Math.round(document.documentElement.scrollHeight - window.innerHeight)),
      url: location.search,
    }));
    const want = Math.min(y0, a.max);
    check(`${tag} ${label}`, Math.abs(a.y - want) <= 2, `scrollY ${y0} -> ${a.y} (expected ${want}) · ${a.url}`);
  };
  await page.goto(`${origin}/?tab=facets&focus=kondratiev&arrive=1`, { waitUntil: "load" });
  await handOpenAfter(page, "a stray arrive=1 on Facets never scrolls a hand-opened Calibrate");

  const racer = await browser.newPage({ viewport: { width: w, height: h } });
  await racer.addInitScript(() => {
    if (!/[?&]arrive=/.test(location.search)) return;
    const mo = new MutationObserver(() => {
      if (!document.querySelector("[data-facet-id] svg[role=img]")) return;
      const facetsTab = [...document.querySelectorAll('[role="tab"]')].find((t) => t.textContent.trim() === "Facets");
      if (!facetsTab) return;
      mo.disconnect();
      // Radix tabs activate on mousedown; fire the full sequence.
      for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup", "click"]) {
        facetsTab.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, button: 0 }));
      }
      window.__arrivalCancelled = true;
    });
    mo.observe(document, { childList: true, subtree: true });
  });
  await racer.goto(`${origin}/?tab=calibrate&focus=kondratiev&arrive=1`, { waitUntil: "load" });
  await racer.waitForTimeout(1200);
  const cancelled = await racer.evaluate(() => ({
    fired: window.__arrivalCancelled === true,
    tab: document.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim(),
  }));
  check(
    `${tag} the race harness cancelled the arrival before its scroll`,
    cancelled.fired && cancelled.tab === "Facets",
    `observer fired=${cancelled.fired} · selected tab=${cancelled.tab}`,
  );
  await handOpenAfter(racer, "a cancelled arrival never scrolls a hand-opened Calibrate later");
  await racer.close();
  await page.close();
}
await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(`${results.length - failed}/${results.length} PASS`);
process.exit(failed ? 3 : 0);
