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
import { holdsUpAlt, holdsUpCard } from "@/lib/holdsUp";
import { testedSeriesNote } from "@/lib/testedSeries";

type Row = { cycle_id?: string; series_id: string; cycles_covered: number; eligible: boolean };
const primary: Row[] = JSON.parse(
  readFileSync(join(process.cwd(), "public", "data", "spectral", "verdicts.json"), "utf8"),
).primary;

async function boxText(slug: string): Promise<string> {
  const element = await CyclePage({ params: Promise.resolve({ id: slug }) });
  const html = renderToStaticMarkup(element as Parameters<typeof renderToStaticMarkup>[0])
    .replace(/<!-- -->/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
  const box = html.match(/<section id="does-it-hold-up"[\s\S]*?<\/section>/);
  expect(box, `${slug}: no Does-it-hold-up box`).not.toBeNull();
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
    expect(box).toContain(n);
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
