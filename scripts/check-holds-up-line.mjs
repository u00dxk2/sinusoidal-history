// Does the chart say, where it draws a cycle over its data, whether the record can test it?
//
//   node scripts/check-holds-up-line.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL, 2 any leg UNREAD.
// Legs, at 1280x900 and 390x664, for every cycle in src/data/cycles.json: the expanded card at
// /?tab=facets&focus=<id>, and the single-cycle embed /embed?cycles=<id>. Each page must carry
// exactly one [data-holds-up] line, this cycle's, whose every text node is painted, reading
// EXACTLY "Does it hold up? <headline> →" and linking to /cycles/<slug>#does-it-hold-up.
// <headline> is a stated rule read from the frozen verdicts.json, sharing no code with the card:
// no primary row and no paired series → "Not tested"; an ineligible row → "Not testable on the
// record that exists". Anything else (an eligible row, or a paired series with no row) is a case
// this rule does not cover, and the leg REFUSES (UNREAD) rather than guessing. Plus one positive
// control: /cycles/dalio's own box carries the needle, so a needle that cannot match reads UNREAD.
// Shape history: Codex r1 showed a wrong headline, an opacity-0 line and a second line would each
// pass; r2 showed the substring oracle that fixed the first accepted reversals ("Tested" inside
// "not tested") and that paint was judged on the line, not its children. Second appearance of
// both classes, so the matcher became exact equality and paint became per text node.
// NOT SEEN: contrast and font size, a line covered by another element, multi-cycle embeds, and
// whether a reader understands it.
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

const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), "utf8"));
const primary = readJson("../public/data/spectral/verdicts.json").primary;
const pairedIds = new Set(readJson("../src/data/series.json").map((s) => s.associated_cycle_id));

// The headline a cycle's line must carry, or null where this rule does not decide (refuse).
function expectedHeadline(id) {
  const row = primary.find((r) => r.cycle_id === id);
  if (!row) return pairedIds.has(id) ? null : "Not tested";
  return row.eligible ? null : "Not testable on the record that exists";
}

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
        // Every verdict line on the PAGE, not just this cycle's in this scope: a second line
        // anywhere is a defect too (Codex r1 LOW).
        const all = page.locator("[data-holds-up]");
        const nAll = await all.count();
        const line = el.locator(`[data-holds-up="${c.id}"]`);
        const n = await line.count();
        const text = n ? (await line.first().innerText()).replace(/\s+/g, " ") : "";
        const href = n ? await line.first().locator("a").getAttribute("href") : null;
        // Painted, per TEXT NODE: each non-empty text node has a non-zero rect, and no element
        // from it up to the document is hidden, display:none or opacity 0 (Codex r1, r2).
        const painted = n
          ? await line.first().evaluate((node) => {
              const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
              let seen = 0;
              for (let t = walker.nextNode(); t; t = walker.nextNode()) {
                if (!t.textContent.trim()) continue;
                seen++;
                const range = document.createRange();
                range.selectNodeContents(t);
                const r = range.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) return false;
                for (let e = t.parentElement; e; e = e.parentElement) {
                  const s = getComputedStyle(e);
                  if (s.visibility === "hidden" || s.display === "none" || +s.opacity === 0) return false;
                }
              }
              return seen > 0;
            })
          : false;
        // Exact equality against the stated rule (Codex r2: a substring oracle accepted reversals).
        // The label is CSS-uppercased in innerText, so it alone is compared case-insensitively.
        const expected = expectedHeadline(c.id);
        if (expected === null) {
          unread++;
          console.log(`UNREAD ${tag} — no stated headline rule for this cycle's verdict row; refusing`);
          continue;
        }
        const exact =
          text.slice(0, NEEDLE.length).toLowerCase() === NEEDLE &&
          text.slice(NEEDLE.length) === ` ${expected} →`;
        const ok =
          nAll === 1 &&
          n === 1 &&
          painted &&
          exact &&
          href === `/cycles/${slug}#does-it-hold-up`;
        if (ok) pass++;
        else fail++;
        console.log(
          `${ok ? "PASS" : "FAIL"}  ${tag}  — ${n}/${nAll} line(s) "${text}" -> ${href}` +
            ` · painted ${painted} · exact "${expected}" ${exact}`
        );
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
