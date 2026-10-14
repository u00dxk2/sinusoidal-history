// Does the chart say, where it draws a cycle over its data, whether the record can test it?
//
//   node scripts/check-holds-up-line.mjs [origin]
//
// origin defaults to https://sinusoidalhistory.com. Exit 0 all PASS, 3 any FAIL, 2 any leg UNREAD.
// Legs, at 1280x900 and 390x664, for every cycle in src/data/cycles.json: the expanded card at
// /?tab=facets&focus=<id>, and the single-cycle embed /embed?cycles=<id>. Each page must carry
// exactly one [data-holds-up] line, this cycle's, painted (a box, no zero-opacity or hidden
// ancestor), reading "Does it hold up? <headline> →" where <headline> appears in that cycle
// page's own server-rendered #does-it-hold-up box, and linking to /cycles/<slug>#does-it-hold-up.
// Plus one positive control: /cycles/dalio's own box is read by the same text match, so a match
// that can never succeed reads UNREAD, not RED. The headline, paint and page-wide count legs were
// added after Codex r1 (2026-10-14) showed a wrong headline, an opacity-0 line and a second line
// would each have passed. NOT SEEN: contrast and font size, a line covered by another element,
// and whether a reader understands it.
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

// Each cycle page's server-rendered "Does it hold up?" box, lower-cased text, fetched once.
const boxCache = new Map();
async function pageBox(slug) {
  if (!boxCache.has(slug)) {
    const html = await (await fetch(`${origin}/cycles/${slug}`)).text();
    const m = html.match(/<section id="does-it-hold-up"[\s\S]*?<\/section>/);
    boxCache.set(
      slug,
      m
        ? m[0]
            .replace(/<[^>]+>/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&#x27;/g, "'")
            .replace(/\s+/g, " ")
            .toLowerCase()
        : null
    );
  }
  return boxCache.get(slug);
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
        // Painted, not just present: a box, and no zero-opacity or hidden ancestor (Codex r1 MED).
        const painted = n
          ? await line.first().evaluate((node) => {
              const r = node.getBoundingClientRect();
              if (r.width === 0 || r.height === 0) return false;
              for (let e = node; e; e = e.parentElement) {
                const s = getComputedStyle(e);
                if (s.visibility === "hidden" || s.display === "none" || +s.opacity === 0) return false;
              }
              return true;
            })
          : false;
        // The headline must be the one the cycle page's own box prints (Codex r1 MED): the
        // oracle is that page's server-rendered #does-it-hold-up section, not this card's code.
        const headline = text.replace(/^does it hold up\?\s*/i, "").replace(/\s*→\s*$/, "");
        const box = await pageBox(slug);
        const matchesPage = headline.length > 0 && box !== null && box.includes(headline.toLowerCase());
        const ok =
          nAll === 1 &&
          n === 1 &&
          painted &&
          matchesPage &&
          text.toLowerCase().startsWith(NEEDLE) &&
          href === `/cycles/${slug}#does-it-hold-up`;
        if (ok) pass++;
        else fail++;
        console.log(
          `${ok ? "PASS" : "FAIL"}  ${tag}  — ${n}/${nAll} line(s) "${text}" -> ${href}` +
            ` · painted ${painted} · headline in page box ${matchesPage}`
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
