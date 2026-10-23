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
  holdsUpAlt,
  holdsUpCard,
  holdsUpOverall,
  holdsUpOverallAlt,
  overallAnswer,
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

// I-056 (2026-10-23): the main share card asks "Do the cycles hold up?" at headline size and
// answered only in its small eyebrow ("None confirmed"). A chat app shows it ~350px wide, so the
// answer moved under the masthead. Expected counts come from verdicts.json off disk.
describe("I-056: the main share card answers its own question", () => {
  const eligible = cycles.filter((c) => primary.find((r) => r.cycle_id === c.id)?.eligible);

  it("none of the ten is testable today, and no record reaches 3.0 periods", () => {
    expect(eligible.length).toBe(0);
    expect(Math.max(...primary.map((r) => r.cycles_covered))).toBeLessThan(3);
    expect(holdsUpOverall(cycles)).toEqual({
      headline: "Not yet: none of the ten is testable on the record that exists",
      detail: "No record covers the 3.0 full periods this site requires before testing.",
    });
  });

  it("the answer moves with the count, and stops saying 'not yet' once one is testable", () => {
    expect(overallAnswer(11, 0).headline).toBe(
      "Not yet: none of the eleven is testable on the record that exists",
    );
    expect(overallAnswer(10, 1).headline).toBe("One of the ten is testable on the record that exists");
    expect(overallAnswer(10, 3).headline).toBe("Three of the ten are testable on the record that exists");
    expect(overallAnswer(10, 3).headline).not.toContain("Not yet");
  });

  it("the home and /cycles og:image alt carry the same answer", () => {
    const alt = holdsUpOverallAlt(cycles);
    expect(alt).toContain(`${holdsUpOverall(cycles).headline}.`);
    const images = cyclesMetadata.openGraph?.images as { url: string; alt: string }[];
    expect(images[0].url).toBe("/og");
    expect(images[0].alt).toBe(alt);
    // The root layout loads next/font, which vitest cannot run, so its metadata is read as source.
    const layout = readFileSync(join(process.cwd(), "src", "app", "layout.tsx"), "utf8");
    expect(layout).toContain("alt: holdsUpOverallAlt(cycles)");
    expect(layout).not.toContain('alt: "Do the cycles hold up?');
  });

  it("the og route draws the answer from the helper, not typed text", () => {
    const source = readFileSync(join(process.cwd(), "src", "app", "og", "route.tsx"), "utf8");
    expect(source).toContain("holdsUpOverall(effective)");
    expect(source).not.toMatch(/Not yet: none of/);
  });
});
