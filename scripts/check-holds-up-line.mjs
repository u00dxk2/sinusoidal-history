// Does the chart say, where it draws a cycle over its data, whether the record can test it?
//
//   node scripts/check-holds-up-line.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL, 2 any leg UNREAD.
// Legs, at 1280x900 and 390x664, for every cycle in src/data/cycles.json: the expanded card at
// /?tab=facets&focus=<id>, and the single-cycle embed /embed?cycles=<id>. Each must carry exactly
// one [data-holds-up] line whose rendered text has "Does it hold up?", whose link lands on
// /cycles/<slug>#does-it-hold-up. Plus one positive control: /cycles/dalio's own box is read by the
// same text match, so a match that can never succeed reads UNREAD, not RED.
// Written for I-045 (2026-10-14). Red arm: production on 9d66ef96, before the change, read 0/40
// with 0 UNREAD and the control true.
// Three traps this guards, each measured that evening: `/?focus=<id>` alone does NOT expand the
// card (only the Facets tab does), so an "expanded" leg is judged by aria-expanded="true", never
// by tail text (the unpaired cycle expands with no tail); and innerText applies CSS
// text-transform, so the uppercase label reads "DOES IT HOLD UP?" and is matched lower-cased.
// It checks the words are there, not that a reader understands them; that is the cold walk's job.
import { readFileSync } from "node:fs";
import { chromium } from "playwright";

const origin = (process.argv[2] ?? "https://sinusoidalhistory.com").replace(/\/$/, "");
const cycles = JSON.parse(
  readFileSync(new URL("../src/data/cycles.json", import.meta.url), "utf8")
);
const NEEDLE = "does it hold up?";
let fail = 0;
let unread = 0;
let pass = 0;

const browser = await chromium.launch();
for (const [w, h] of [[1280, 900], [390, 664]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const c of cycles) {
    const slug = c.id.replace(/_/g, "-");
    for (const [kind, path, scope] of [
      ["card ", `/?tab=facets&focus=${c.id}`, `[data-facet-id="${c.id}"]`],
      ["embed", `/embed?cycles=${c.id}`, "body"],
    ]) {
      const tag = `${w}x${h} ${kind} ${c.id}`;
      try {
        await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
        const el = page.locator(scope).first();
        await el.waitFor({ timeout: 10000 });
        if (kind === "card " && (await el.locator('button[aria-expanded="true"]').count()) === 0) {
          unread++;
          console.log(`UNREAD ${tag} — the card did not expand`);
          continue;
        }
        const lines = el.locator(`[data-holds-up="${c.id}"]`);
        const n = await lines.count();
        const text = n ? (await lines.first().innerText()).replace(/\s+/g, " ") : "";
        const href = n ? await lines.first().locator("a").getAttribute("href") : null;
        const ok =
          n === 1 &&
          text.toLowerCase().includes(NEEDLE) &&
          href === `/cycles/${slug}#does-it-hold-up`;
        if (ok) pass++;
        else fail++;
        console.log(`${ok ? "PASS" : "FAIL"}  ${tag}  — ${n} line(s) "${text}" -> ${href}`);
      } catch {
        unread++;
        console.log(`UNREAD ${tag} — ${scope} not found`);
      }
    }
  }
  await page.close();
}
{
  const page = await browser.newPage();
  await page.goto(`${origin}/cycles/dalio`, { waitUntil: "networkidle" });
  const ok = (await page.locator("body").innerText()).toLowerCase().includes(NEEDLE);
  if (!ok) unread++;
  console.log(`${ok ? "PASS" : "UNREAD"}  control: /cycles/dalio's own box matches the needle`);
  await page.close();
}
await browser.close();
const total = pass + fail;
console.log(
  `population: ${cycles.length} cycles x {expanded card, single-cycle embed} x {1280x900, 390x664} at ${origin}`
);
console.log(`RESULT: ${pass}/${total} PASS · ${fail} FAIL · ${unread} UNREAD`);
process.exit(unread ? 2 : fail ? 3 : 0);
