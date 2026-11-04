// I-032 (2026-10-10): each cycle's share card says whether the cycle holds up, in the page's own
// words. The expected numbers come from verdicts.json read straight off disk, not through the
// helper under test, and the card is compared with the SERVER-RENDERED page box, so a drift on
// either side fails here.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CyclePage, { generateMetadata } from "@/app/(app)/cycles/[id]/page";
import { cycles } from "@/data/cycles";
import { cycleSlug, seriesForCycle } from "@/lib/cycleRoutes";
import { metadata as cyclesMetadata } from "@/app/(app)/cycles/page";
import {
  CALIBRATED_CARD_NOTE,
  CYCLES_INDEX_DESCRIPTION,
  CYCLES_INDEX_TITLE,
  holdsUpAlt,
  holdsUpCard,
  holdsUpOverallAlt,
  MAIN_CARD_EYEBROW,
} from "@/lib/holdsUp";
import { testedSeriesNote } from "@/lib/testedSeries";

type Row = { cycle_id?: string; series_id: string; cycles_covered: number; eligible: boolean };
const primary: Row[] = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data", "spectral", "verdicts.json"), "utf8"),
).primary;

async function boxText(slug: string, id = "does-it-hold-up"): Promise<string> {
  const element = await CyclePage({ params: Promise.resolve({ id: slug }) });
  const html = renderToStaticMarkup(element as Parameters<typeof renderToStaticMarkup>[0])
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
  const box = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
  expect(box, `${slug}: no #${id} section`).not.toBeNull();
  return box![0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

describe("I-032: the share card carries the page's verdict", () => {
  it("every cycle gets a card line (nine verdict rows and one no-series cycle today)", () => {
    expect(cycles.length).toBe(10);
    expect(cycles.filter((c) => holdsUpCard(c)).length).toBe(10);
  });

  it.each(cycles.map((c) => [cycleSlug(c), c] as const))("%s", async (slug, cycle) => {
    const card = holdsUpCard(cycle)!;
    const box = await boxText(slug);
    const row = primary.find((r) => r.cycle_id === cycle.id);

    // The card's headline opens the page box's answer sentence (an eligible headline ends
    // the sentence there; the others run on into a dash clause).
    expect(box).toContain(row?.eligible ? `${card.headline}.` : `${card.headline} — `);

    if (!row) {
      expect(seriesForCycle(cycle)).toBeUndefined();
      expect(card.detail).toContain("no paired data series");
      return;
    }
    // The page's one-decimal number, from the raw row, on both surfaces.
    const n = `${row.cycles_covered.toFixed(1)} of the 3.0 full periods`;
    expect(card.detail).toContain(n);
    // A claim page keeps the whole box on a phone's first screen, so the record paragraph that
    // carries this number follows the curve in #why-not-tested instead (I-053).
    if (cycle.question) {
      expect(box).not.toContain(n);
      expect(await boxText(slug, "why-not-tested")).toContain(n);
    } else {
      expect(box).toContain(n);
    }
    if (!row.eligible) expect(card.headline).toBe("Not testable on the record that exists");

    // Correction 4: where the judged cut is not the drawn series, the card names the judged
    // record and never credits the number to the drawn one.
    const series = seriesForCycle(cycle)!;
    if (series.id === row.series_id) {
      expect(card.detail.startsWith("Its paired record covers")).toBe(true);
    } else {
      expect(card.detail.startsWith(`Judged on ${testedSeriesNote(row.series_id)!.name}: `)).toBe(true);
      expect(card.detail).not.toContain(series.legend_short ?? series.name);
      expect(card.detail).not.toContain("Its paired record");
    }
  });

  it("the judged-cut cases exist, so the branch above is exercised", () => {
    const differing = primary.filter(
      (r) => seriesForCycle(cycles.find((c) => c.id === r.cycle_id)!)?.id !== r.series_id,
    );
    expect(differing.map((r) => r.cycle_id).sort()).toEqual(["kondratiev", "turchin"]);
  });

  it.each(cycles.map((c) => [cycleSlug(c), c] as const))(
    "%s: the og:image alt carries the same clause",
    async (slug, cycle) => {
      const meta = await generateMetadata({ params: Promise.resolve({ id: slug }) });
      const images = meta.openGraph?.images as { alt: string }[];
      expect(images[0].alt).toContain(holdsUpAlt(cycle));
      expect(holdsUpAlt(cycle)).toContain(holdsUpCard(cycle)!.detail);
    },
  );
});

// I-056 (2026-10-23) put a counted answer under the main card's "Do the cycles hold up?";
// I-079 (2026-11-04) took it out: "none of the ten is testable" counted the unpaired cycle, and
// "No record covers the 3.0 full periods" is false for cross-grid records that clear the gate.
// The card now says what it draws. Verdict states come from verdicts.json off disk.
type AnyRow = { state: string; eligible: boolean };
const verdictFile: { primary: AnyRow[]; cross_grid: AnyRow[] } = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data", "spectral", "verdicts.json"), "utf8"),
);
// The vocabulary a testability claim needs (as in the W-005 snippet leg). Ceiling: a word ban.
const TESTABILITY = /testab|record|gate|full periods|not yet|\bof the\b/i;

describe("I-079: the main share card makes no testability claim", () => {
  it("the eyebrow's 'None confirmed' holds: no verdict on file confirms a cycle", () => {
    expect(MAIN_CARD_EYEBROW).toBe("None confirmed");
    const all = [...verdictFile.primary, ...verdictFile.cross_grid];
    expect(all.length).toBeGreaterThan(0);
    // Every eligible row (a test that ran) found no power; the rest never ran.
    for (const r of all) {
      if (r.eligible) expect(r.state).toBe("NO_SIGNIFICANT_TARGET_POWER");
      else expect(r.state).toBe("INSUFFICIENT_DATA");
    }
    // Positive control: some tests did run, so "none confirmed" is a reading, not a default.
    expect(all.some((r) => r.eligible)).toBe(true);
  });

  it("the home and /cycles og:image alt describe the card, with no testability claim", () => {
    const alt = holdsUpOverallAlt(cycles);
    expect(alt).toBe(
      "None confirmed. Do the cycles hold up? Ten long-wave cycles of history, on one shared axis. Each cycle drawn as at most one period around its reference peak, cut at today",
    );
    expect(alt).not.toMatch(TESTABILITY);
    const images = cyclesMetadata.openGraph?.images as { url: string; alt: string }[];
    expect(images[0].url).toBe("/og");
    expect(images[0].alt).toBe(alt);
    // The root layout loads next/font, which vitest cannot run, so its metadata is read as source.
    const layout = readFileSync(join(process.cwd(), "src", "app", "layout.tsx"), "utf8");
    expect(layout).toContain("alt: holdsUpOverallAlt(cycles)");
    expect(layout).not.toContain('alt: "Do the cycles hold up?');
  });

  // The card is a PNG, so these read the route's source. Codex r1 (MED): a bare token check
  // passed with the large answer block deleted, so the answer's font size is read too.
  const route = readFileSync(join(process.cwd(), "src", "app", "og", "route.tsx"), "utf8");

  it("the og route draws no testability claim and no removed helper", () => {
    // The source carries comments about the removed sentence, so it is read for the helpers and
    // the sentences themselves, not the whole vocabulary.
    expect(route).not.toMatch(/holdsUpOverall\(|overallAnswer\(|answer\.headline|answer\.detail/);
    expect(route).not.toMatch(/is testable on the record|No record covers/);
    expect(route.includes("{MAIN_CARD_EYEBROW}")).toBe(true);
    expect(route.includes("const standfirst = ogMainStandfirst(cycles.length);")).toBe(true);
  });

  it("the line under the question renders at 30px or more", () => {
    const block = route.match(/fontSize: (\d+),[^<]*?>\s*\{standfirst\}/);
    expect(block, "no div rendering {standfirst} with its own fontSize").not.toBeNull();
    expect(Number(block![1])).toBeGreaterThanOrEqual(30);
  });

  it("a calibrated card says its verdicts are for the stored periods, and only it", () => {
    expect(route.includes("snapshotCard(effective, true)")).toBe(true);
    expect(/\{calibrated \? \([\s\S]*?\{CALIBRATED_CARD_NOTE\}[\s\S]*?\) : null\}/.test(route)).toBe(true);
    expect(CALIBRATED_CARD_NOTE).toContain("the verdicts are for the stored ones");
  });
});

// W-005 (2026-11-04): the /cycles search result asks the reader's question and says the page answers it.
// Budgets are Google's truncation points, measured on the RENDERED title (the layout's template
// appends " · Sinusoidal History", read from layout.tsx source because vitest cannot load
// next/font). Ceiling: a character count, not the pixel width Google actually truncates at.
describe("W-005: the /cycles search result asks and answers", () => {
  const layout = readFileSync(join(process.cwd(), "src", "app", "layout.tsx"), "utf8");
  // The WHOLE template literal, so trailing text after ${SITE_NAME} counts (Codex r1, LOW).
  const template = layout.match(/template: `([^`]*)`/);
  const siteName = readFileSync(join(process.cwd(), "src", "lib", "siteConfig.ts"), "utf8").match(
    /SITE_NAME = "([^"]+)"/,
  );
  it("the rendered title asks the question in 60 characters or fewer", () => {
    expect(template, "layout title template not found").not.toBeNull();
    expect(siteName, "SITE_NAME not found").not.toBeNull();
    const rendered = template![1].replace("%s", CYCLES_INDEX_TITLE).replace("${SITE_NAME}", siteName![1]);
    expect(rendered, "template has an expression this test does not resolve").not.toContain("${");
    expect(rendered).toBe("Do history's cycles hold up? · Sinusoidal History");
    expect(rendered.length).toBeLessThanOrEqual(60);
    expect(cyclesMetadata.title).toBe(CYCLES_INDEX_TITLE);
  });

  it("the description names three theorists, asks the question, and fits 160", () => {
    const d = CYCLES_INDEX_DESCRIPTION;
    expect(d).toBe("Dalio, Strauss-Howe, Turchin: do the cycles hold up? Each one's period, peak and source.");
    expect(d.length).toBeLessThanOrEqual(160);
    for (const name of ["Dalio", "Strauss-Howe", "Turchin"]) {
      expect(cycles.some((c) => c.name.includes(name)), name).toBe(true);
    }
  });

  // Codex r1-r3 each refuted a testability claim (an unpaired cycle; cross-grid records that do
  // clear the gate; a page that judges only primary pairings). The snippet makes none; this leg
  // refuses the VOCABULARY such a claim needs, rather than trying to recognise a quantifier
  // (r3 LOW: "Most", "Both", "Nine theories" slipped a quantifier regex). Ceiling: a vocabulary
  // ban, so a testability claim in words it does not list still passes; the exact pin above is
  // the other half.
  it("makes no testability or verdict claim", () => {
    expect(CYCLES_INDEX_DESCRIPTION).not.toMatch(
      /test|record|data|series|pair|gate|verdict|confirm|evidence|check|none|not yet|\d/i,
    );
  });

  it("og:, twitter: and the JSON-LD carry the same text", () => {
    const d = CYCLES_INDEX_DESCRIPTION;
    expect(cyclesMetadata.description).toBe(d);
    expect(cyclesMetadata.openGraph?.description).toBe(d);
    expect(cyclesMetadata.openGraph?.title).toBe(CYCLES_INDEX_TITLE);
    expect(cyclesMetadata.twitter?.description).toBe(d);
    expect(cyclesMetadata.twitter?.title).toBe(CYCLES_INDEX_TITLE);
    const page = readFileSync(join(process.cwd(), "src", "app", "(app)", "cycles", "page.tsx"), "utf8");
    expect(page).toMatch(/"@type": "DefinedTermSet",[\s\S]*?description: DESCRIPTION,/);
    // The H1 keeps the index's name (a longer H1 moves the phone fold).
    expect(page).toContain("{H1}");
    expect(page).not.toMatch(/whether this site's data is long enough|Do history's cycles/);
  });
});
