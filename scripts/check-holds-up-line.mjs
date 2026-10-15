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
// whether a reader understands it. Also NOT SEEN, by declaration (I-047 Codex r2, the third round
// of matcher gaps, so a ceiling rather than another matcher): text drawn by CSS (::before/::after
// `content:`), which innerText and the text-node walk cannot see. The site's styles add no such
// content to these elements; a change that does is reviewed, not caught here. Likewise NOT SEEN
// (I-047 Codex r3, the colour leg's third round): the site-wide ink token itself drifting to a
// near-transparent colour, which canvas bytes cannot tell from a transparent curve colour. That
// drift would fade every grey label on the site, not this line alone; review catches it.
// Written for I-045 (2026-10-14). Red arm: production on 9d66ef96, before the change, read 0/40
// with 0 UNREAD and the control true.
// Three traps this guards, each measured that evening: `/?focus=<id>` alone does NOT expand the
// card (only the Facets tab does), so an "expanded" leg is judged by aria-expanded="true", never
// by tail text (the unpaired cycle expands with no tail); and innerText applies CSS
// text-transform, so the uppercase label reads "DOES IT HOLD UP?" and is matched lower-cased.
// It checks the words are there, not that a reader understands them; that is the cold walk's job.
//
// I-047 (2026-10-15) changed what the line must be, because the 10-14 and 10-15 cold walks read
// "PEAKING" and the curve as confirmation before reaching it. Every leg now also requires:
//   - the line comes BEFORE the chart (DOM order against the card's svg[role=img]);
//   - its [data-holds-up-headline] reads exactly the headline;
//   - the phase word is not drawn in the cycle's own colour (the curve's colour), so it stops
//     reading as part of the theory's claim.
// The expanded CARD carries the full form: the headline is plain text, not a link, so no arrow
// follows the answer; the reason is [data-holds-up-why], EXACTLY the share card's detail sentence,
// from a stated rule over verdicts.json and series.json, with the judged-record names written out
// by hand below; and one link to the verdict box. The EMBED keeps the compact one-line form
// "Does it hold up? <headline> →", because its 540px frame has no height to spare; only its
// order changes.
// I-047's second lever (2026-10-15 evening): the 840a39f walk still read the header's "PEAKING"
// as a badge above the answer. On the CARD the phase word now comes AFTER the verdict line, in
// DOM order, and outside it, so the whole-line rule above is unchanged. A position test, not a
// text matcher. The embed keeps the word in its header (no height to spare). Red arm: production
// at 573ff609, where the word sits in the header, reads the card legs FAIL.
// NOT SEEN (I-047 Codex r2, declared, not a new matcher): a phase word hidden by an ancestor
// clipped to zero height (height:0 + overflow:hidden) while its own box is non-zero; and whether
// the word carries the text-ink-soft class itself or inherits it (the leg compares the painted
// colour, which is what a reader sees, on purpose).
// I-048 (2026-10-15 evening): the closed card's "Does it hold up? <headline>" line
// ([data-holds-up-closed]) and the glance figure's caption are NOT judged here; the cold walk
// judges them, and the line's words come from holdsUpCard, which holdsUp.test.ts pins.
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
const seriesList = readJson("../src/data/series.json");
const pairedIds = new Set(seriesList.map((s) => s.associated_cycle_id));

// The headline a cycle's line must carry, or null where this rule does not decide (refuse).
function expectedHeadline(id) {
  const row = primary.find((r) => r.cycle_id === id);
  if (!row) return pairedIds.has(id) ? null : "Not tested";
  return row.eligible ? null : "Not testable on the record that exists";
}

// The judged records whose verdict row is not the drawn series, named by hand (an oracle that
// shares no code with src/lib/testedSeries.ts). A judged series missing here refuses.
const JUDGED_NAMES = {
  us_tfp_growth_annual: "US TFP growth (annual, unsmoothed)",
  wid_top1_wealth_1913: "US top 1% wealth share (1913 onward)",
};

// The card's reason, the share card's detail sentence, or null where this rule does not decide.
function expectedWhy(id) {
  const row = primary.find((r) => r.cycle_id === id);
  if (!row) {
    return pairedIds.has(id)
      ? null
      : "This cycle has no paired data series on this site, so there is no record to test it against.";
  }
  if (row.eligible) return null;
  const covered = `${row.cycles_covered.toFixed(1)} of the 3.0 full periods this site requires before testing.`;
  const drawn = seriesList.find((s) => s.associated_cycle_id === id);
  if (drawn && drawn.id === row.series_id) return `Its paired record covers ${covered}`;
  const name = JUDGED_NAMES[row.series_id];
  return name ? `Judged on ${name}: ${covered}` : null;
}

// Two "r,g,b,a" byte strings from the page's canvas: the same colour if every RGB channel is
// within 3. Alpha is ignored on purpose.
function nearRgb(a, b) {
  const x = a.split(",").map(Number);
  const y = b.split(",").map(Number);
  return [0, 1, 2].every((i) => Math.abs(x[i] - y[i]) <= 3);
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
        const text = n ? (await line.first().innerText()).replace(/\s+/g, " ").trim() : "";
        const links = n ? line.first().locator("a") : null;
        const href = n && (await links.count()) === 1 ? await links.getAttribute("href") : null;
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
        const why = expectedWhy(c.id);
        if (expected === null || why === null) {
          unread++;
          console.log(`UNREAD ${tag} — no stated headline/why rule for this cycle's verdict row; refusing`);
          continue;
        }
        // The pinned parts, read in the page itself (I-047).
        const parts = n
          ? await line.first().evaluate((node, curveHex) => {
              const facet = node.closest("[data-facet-id]") ?? document;
              const chart = facet.querySelector('svg[role="img"]');
              const head = node.querySelectorAll("[data-holds-up-headline]");
              const whyEl = node.querySelectorAll("[data-holds-up-why]");
              // data-phase-position since I-048 (was aria-label^="Phase position", which on a
              // plain span is no reliable name and, where honoured, hid the visible "curve ·").
              const phase = facet.querySelector("[data-phase-position]");
              // The ink token resolved on this page: a probe with the same utility class
              // (Codex r1: a string compare against one opaque rgb() let rgba(curve, 0.85) pass).
              const probe = document.createElement("span");
              probe.className = "text-ink-soft";
              (phase?.parentElement ?? document.body).appendChild(probe);
              const ink = getComputedStyle(probe).color;
              probe.remove();
              // Any CSS colour (rgb, rgba, color(srgb …), oklch …) to the bytes the browser paints,
              // through its own canvas, so no string form is compared (Codex r2: color(srgb …) for
              // the curve's own gold read as "different" from rgb(160, 118, 40)).
              const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
              const bytes = (css) => {
                ctx.clearRect(0, 0, 1, 1);
                ctx.fillStyle = "#000";
                ctx.fillStyle = css;
                ctx.fillRect(0, 0, 1, 1);
                return Array.from(ctx.getImageData(0, 0, 1, 1).data).join(",");
              };
              const flat = (e) => e.innerText.replace(/\s+/g, " ").trim();
              return {
                beforeChart: !!chart && !!(node.compareDocumentPosition(chart) & Node.DOCUMENT_POSITION_FOLLOWING),
                heads: head.length,
                headText: head.length === 1 ? flat(head[0]) : null,
                headLinked: head.length === 1 ? !!head[0].closest("a") : null,
                whys: whyEl.length,
                whyText: whyEl.length === 1 ? flat(whyEl[0]) : null,
                phaseColor: phase ? bytes(getComputedStyle(phase).color) : null,
                // DOM order, the same test as beforeChart: the phase word follows the verdict
                // line and is not inside it.
                // Painted too, by the same test as the line (Codex r1 LOW, I-047 r2: DOM order
                // alone passed a hidden word).
                phaseAfter:
                  !!phase &&
                  !node.contains(phase) &&
                  !!(node.compareDocumentPosition(phase) & Node.DOCUMENT_POSITION_FOLLOWING) &&
                  (() => {
                    const r = phase.getBoundingClientRect();
                    if (r.width === 0 || r.height === 0) return false;
                    for (let e = phase; e; e = e.parentElement) {
                      const s = getComputedStyle(e);
                      if (s.visibility === "hidden" || s.display === "none" || +s.opacity === 0) return false;
                    }
                    return true;
                  })(),
                ink: bytes(ink),
                curve: bytes(curveHex),
              };
            }, c.color)
          : null;
        const label = text.slice(0, NEEDLE.length).toLowerCase() === NEEDLE;
        const headOk = !!parts && parts.heads === 1 && parts.headText === expected;
        // The phase word IS the ink token, and is not the curve's colour (both, so a token that
        // drifted to the cycle colour still fails).
        const phaseOk =
          !!parts &&
          parts.phaseColor !== null &&
          parts.phaseColor === parts.ink &&
          // RGB only, within 3 per channel: an alpha-reduced curve colour is still the curve's
          // colour (Codex r1), and the canvas can round an alpha colour's channels by one.
          !nearRgb(parts.phaseColor, parts.curve);
        // The WHOLE line, exactly, per form: the marked parts alone let extra text (a new claim,
        // an arrow beside the headline) ride along (Codex r1 MED; the second appearance of the
        // partial-match class from 10-14 r2, so the rule is the full composition, not more marks).
        const rest = text.slice(NEEDLE.length);
        const formOk =
          kind === "card "
            ? !!parts &&
              parts.phaseAfter === true &&
              parts.headLinked === false &&
              parts.whys === 1 &&
              parts.whyText === why &&
              rest === ` ${expected} ${why} Details →`
            : rest === ` ${expected} →`;
        const ok =
          nAll === 1 &&
          n === 1 &&
          painted &&
          label &&
          headOk &&
          !!parts?.beforeChart &&
          phaseOk &&
          formOk &&
          href === `/cycles/${slug}#does-it-hold-up`;
        if (ok) pass++;
        else fail++;
        console.log(
          `${ok ? "PASS" : "FAIL"}  ${tag}  — ${n}/${nAll} line(s) -> ${href} · painted ${painted}` +
            ` · headline ${headOk} · before chart ${!!parts?.beforeChart} · phase not curve colour ${phaseOk}` +
            ` · ${kind === "card " ? "why exact, headline unlinked, phase after answer" : "compact form exact"} ${formOk}`
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
