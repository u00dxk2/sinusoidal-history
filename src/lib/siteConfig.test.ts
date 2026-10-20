import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import {
  MIN_VISIBLE_SPAN,
  PRESET_RANGES,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/siteConfig";

/**
 * Guards for the two SERP-snippet defects found in the first Search Console
 * window (59 impressions, 0 clicks, average position 16 — orchestrator read
 * of David's screenshots, card ef5842ec, 2026-09-09). Both had been live
 * since before the 08-20 domain cutover and neither is visible from inside
 * the app: a snippet is only wrong on the results page.
 */

const NUMBER_WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
];

describe("SITE_DESCRIPTION", () => {
  it("counts the cycles the site actually ships", () => {
    // Shipped "Eight historical cycle theories" while cycles.json held ten.
    // This is the home page's whole snippet body and the OG description on
    // every card, so the undercount rode every impression the site got.
    const expected = NUMBER_WORDS[cycles.length];
    expect(expected).toBeDefined();
    expect(SITE_DESCRIPTION.startsWith(`${expected} `)).toBe(true);
  });
});

describe("the narrowest window", () => {
  // I-060 (2026-10-20): "Now" (2000–2050) drew 7 of 10 cycles as a single crest near the
  // present, and two cold walkers read the opened Dalio card's one dome as "peaking right
  // now". A window at least one full period long cannot show any cycle as a lone crest.
  const longest = Math.max(...cycles.map((c) => c.period_years));

  it("MIN_VISIBLE_SPAN is at least the longest cycle's period", () => {
    expect(MIN_VISIBLE_SPAN).toBeGreaterThanOrEqual(longest);
  });

  it("no preset is narrower than MIN_VISIBLE_SPAN", () => {
    const short = Object.entries(PRESET_RANGES)
      .filter(([, p]) => p.end - p.start < MIN_VISIBLE_SPAN)
      .map(([name, p]) => `${name} ${p.start}-${p.end}`);
    expect(short).toEqual([]);
  });
});

describe("route title segments", () => {
  /** Every `page.tsx` under src/app, recursively. */
  function pageFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return pageFiles(full);
      return entry.name === "page.tsx" ? [full] : [];
    });
  }

  it("never spells the site name inside a page title", () => {
    // The root layout sets `template: "%s · Sinusoidal History"`, which Next
    // applies to any child title given as a plain string. Three pages also
    // spelled the suffix themselves and shipped it twice:
    // "Methods · Sinusoidal History · Sinusoidal History" (live 2026-09-09).
    const offenders: string[] = [];
    for (const file of pageFiles(join(process.cwd(), "src", "app"))) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/\btitle:\s*"([^"]*)"/g)) {
        if (match[1].includes(SITE_NAME)) offenders.push(`${file}: ${match[1]}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
