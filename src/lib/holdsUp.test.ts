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
  CYCLES_INDEX_TITLE,
  cyclesIndexDescription,
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
    // A cycle with no paired series has no verdict, so the detail cannot say "each cycle's page".
    expect(overallAnswer(10, 3).detail).toBe("Each paired cycle's page gives its verdict.");
  });

  it("the home and /cycles og:image alt carry the same answer", () => {
    const alt = holdsUpOverallAlt(cycles);
    const { headline, detail } = holdsUpOverall(cycles);
    expect(alt).toContain(`${headline}. ${detail}`);
    expect(alt).toContain("cut at today");
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

  it("the og route draws the answer from the helper, at the stored periods", () => {
    expect(route.includes("holdsUpOverall(cycles)")).toBe(true);
    // A calibrated copy would let a period override contradict the frozen verdicts.
    expect(route.includes("holdsUpOverall(effective)")).toBe(false);
    expect(/Not yet: none of/.test(route)).toBe(false);
  });

  it("the answer line renders at 30px or more", () => {
    const block = route.match(/fontSize: (\d+),[^<]*?>\s*\{answer\.headline\}\./);
    expect(block, "no div rendering {answer.headline}. with its own fontSize").not.toBeNull();
    expect(Number(block![1])).toBeGreaterThanOrEqual(30);
  });

  it("a calibrated card says its verdicts are for the stored periods", () => {
    expect(route.includes("snapshotCard(effective, true)")).toBe(true);
    expect(/calibrated\s*\?\s*CALIBRATED_CARD_NOTE\s*:\s*`\$\{answer\.detail\}/.test(route)).toBe(true);
    expect(CALIBRATED_CARD_NOTE).toContain("the verdicts are for the stored ones");
  });
});

// W-005 (2026-11-04): the /cycles search result asks the reader's question and answers it.
// Budgets are Google's truncation points, measured on the RENDERED title (the layout's template
// appends " · Sinusoidal History", read from layout.tsx source because vitest cannot load
// next/font). Ceiling: a character count, not the pixel width Google actually truncates at.
describe("W-005: the /cycles search result asks and answers", () => {
  const layout = readFileSync(join(process.cwd(), "src", "app", "layout.tsx"), "utf8");
  const suffix = layout.match(/template: `%s(.*?)\$\{SITE_NAME\}`/);
  const siteName = readFileSync(join(process.cwd(), "src", "lib", "siteConfig.ts"), "utf8").match(
    /SITE_NAME = "([^"]+)"/,
  );

  it("the rendered title asks the question in 60 characters or fewer", () => {
    expect(suffix, "layout title template not found").not.toBeNull();
    expect(siteName, "SITE_NAME not found").not.toBeNull();
    const rendered = `${CYCLES_INDEX_TITLE}${suffix![1]}${siteName![1]}`;
    expect(rendered).toBe("Do history's cycles hold up? · Sinusoidal History");
    expect(rendered.length).toBeLessThanOrEqual(60);
    expect(cyclesMetadata.title).toBe(CYCLES_INDEX_TITLE);
  });

  it("the description names three theorists, gives the overall answer, and fits 160", () => {
    const d = cyclesIndexDescription(cycles);
    expect(d).toBe(
      "Dalio, Strauss-Howe, Turchin: do the cycles hold up? Not yet: none of the ten is testable on the record that exists. Each with its period, peak and source.",
    );
    expect(d).toContain(`${holdsUpOverall(cycles).headline}.`);
    expect(d.length).toBeLessThanOrEqual(160);
    // Every theorist it names is a cycle on this site.
    for (const name of ["Dalio", "Strauss-Howe", "Turchin"]) {
      expect(cycles.some((c) => c.name.includes(name)), name).toBe(true);
    }
  });

  it("the answer moves with the verdicts and stays inside 160 at the longest headline", () => {
    // The longest headline overallAnswer can give for ten cycles is the "Not yet" one; a
    // testable count shortens it. Built from a stand-in so the budget holds once one is testable.
    for (const testable of [0, 1, 3, 10]) {
      const headline = overallAnswer(cycles.length, testable).headline;
      const d = cyclesIndexDescription(cycles).replace(holdsUpOverall(cycles).headline, headline);
      expect(d.length, `${testable} testable`).toBeLessThanOrEqual(160);
    }
  });

  it("og:, twitter: and the JSON-LD carry the same text", () => {
    const d = cyclesIndexDescription(cycles);
    expect(cyclesMetadata.description).toBe(d);
    expect(cyclesMetadata.openGraph?.description).toBe(d);
    expect(cyclesMetadata.openGraph?.title).toBe(CYCLES_INDEX_TITLE);
    expect(cyclesMetadata.twitter?.description).toBe(d);
    const page = readFileSync(join(process.cwd(), "src", "app", "(app)", "cycles", "page.tsx"), "utf8");
    expect(page).toMatch(/"@type": "DefinedTermSet",[\s\S]*?description: DESCRIPTION,/);
    // The H1 keeps the index's name (a longer H1 moves the phone fold).
    expect(page).toContain("{H1}");
    expect(page).not.toMatch(/Not yet: none of|Do history's cycles/);
  });
});
