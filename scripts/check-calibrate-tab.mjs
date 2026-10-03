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
  }
  await page.close();
}
await browser.close();
const failed = results.filter((ok) => !ok).length;
console.log(`${results.length - failed}/${results.length} PASS`);
process.exit(failed ? 3 : 0);
