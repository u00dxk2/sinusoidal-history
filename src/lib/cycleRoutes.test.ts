import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { sineAtYear } from "@/lib/cycleMath";
import {
  confidenceLabel,
  cycleChartPath,
  cycleJsonLd,
  cycleMetaDescription,
  cycleMetaTitle,
  cycleRoutePath,
  cycleSlug,
  cycleTheorist,
  findCycleBySlug,
  peakYearsInRange,
  seriesForCycle,
  troughYearsInRange,
} from "@/lib/cycleRoutes";
import { DEFAULT_YEAR_RANGE, SITE_URL } from "@/lib/siteConfig";

describe("cycle route slugs", () => {
  it("gives every cycle a unique, URL-safe slug", () => {
    const slugs = cycles.map(cycleSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, `${slug} is lowercase alphanumeric + hyphens`).toMatch(
        /^[a-z0-9]+(-[a-z0-9]+)*$/
      );
      expect(encodeURIComponent(slug)).toBe(slug);
    }
  });

  it("round-trips slug -> cycle for every cycle", () => {
    for (const cycle of cycles) {
      expect(findCycleBySlug(cycleSlug(cycle))?.id).toBe(cycle.id);
    }
  });

  it("also resolves the raw underscored id", () => {
    expect(findCycleBySlug("strauss_howe")?.id).toBe("strauss_howe");
    expect(findCycleBySlug("STRAUSS-HOWE")?.id).toBe("strauss_howe");
  });

  it("returns undefined for unknown slugs", () => {
    expect(findCycleBySlug("not-a-cycle")).toBeUndefined();
    expect(findCycleBySlug("")).toBeUndefined();
  });

  it("routes to /cycles/<slug> and deep-links the chart by raw id", () => {
    const kondratiev = cycles.find((c) => c.id === "kondratiev")!;
    expect(cycleRoutePath(kondratiev)).toBe("/cycles/kondratiev");
    expect(cycleChartPath(kondratiev)).toBe("/?focus=kondratiev");

    const strauss = cycles.find((c) => c.id === "strauss_howe")!;
    expect(cycleRoutePath(strauss)).toBe("/cycles/strauss-howe");
    // The chart's `focus` param keys on the cycle id, not the URL slug.
    expect(cycleChartPath(strauss)).toBe("/?focus=strauss_howe");
  });
});

describe("cycle route metadata", () => {
  it("produces a unique, non-empty title per cycle", () => {
    const titles = cycles.map(cycleMetaTitle);
    expect(new Set(titles).size).toBe(titles.length);
    for (const title of titles) {
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(70);
    }
  });

  it("produces a unique, search-sized description per cycle", () => {
    const descriptions = cycles.map(cycleMetaDescription);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const description of descriptions) {
      expect(description.length).toBeGreaterThan(80);
      expect(description.length).toBeLessThanOrEqual(200);
    }
  });

  it("agrees the indefinite article with the spoken period", () => {
    const strauss = cycles.find((c) => c.id === "strauss_howe")!;
    expect(cycleMetaDescription(strauss)).toContain("an 84-year sinusoid");
    const kondratiev = cycles.find((c) => c.id === "kondratiev")!;
    expect(cycleMetaDescription(kondratiev)).toContain("a 54-year sinusoid");
    const khaldun = cycles.find((c) => c.id === "khaldun")!;
    expect(cycleMetaDescription(khaldun)).toContain("a 120-year sinusoid");
  });

  it("names the paired series when there is one", () => {
    const turchin = cycles.find((c) => c.id === "turchin")!;
    expect(cycleMetaDescription(turchin)).toContain("Top 1% wealth share");

    const perez = cycles.find((c) => c.id === "perez")!;
    expect(seriesForCycle(perez)).toBeUndefined();
    expect(cycleMetaDescription(perez)).toContain("No paired data series");
  });

  it("resolves the paired series for the seven cycles that have one", () => {
    const paired = cycles.filter((c) => seriesForCycle(c));
    expect(paired.length).toBe(dataSeries.length);
    for (const cycle of paired) {
      expect(seriesForCycle(cycle)!.associated_cycle_id).toBe(cycle.id);
    }
  });

  it("extracts the theorist from names with and without an em dash", () => {
    expect(cycleTheorist(cycles.find((c) => c.id === "khaldun")!)).toBe(
      "Ibn Khaldun"
    );
    expect(cycleTheorist(cycles.find((c) => c.id === "kondratiev")!)).toBe(
      "Kondratiev wave"
    );
  });

  it("labels every confidence level in the data", () => {
    for (const cycle of cycles) {
      const label = confidenceLabel(cycle.confidence_level);
      expect(label).not.toBe(cycle.confidence_level);
      expect(label[0]).toBe(label[0]?.toUpperCase());
    }
  });
});

describe("derived extrema", () => {
  it("puts every reported peak at cos = +1 and every trough at cos = -1", () => {
    for (const cycle of cycles) {
      const peaks = peakYearsInRange(cycle);
      const troughs = troughYearsInRange(cycle);
      expect(peaks.length, `${cycle.id} has peaks in range`).toBeGreaterThan(0);
      expect(troughs.length, `${cycle.id} has troughs in range`).toBeGreaterThan(
        0
      );
      for (const year of peaks) {
        // Rounding to whole years shifts the sample off the exact extremum by
        // at most half a year, so allow the corresponding cosine slack.
        expect(sineAtYear(cycle, year), `${cycle.id} peak ${year}`).toBeCloseTo(
          1,
          2
        );
      }
      for (const year of troughs) {
        expect(
          sineAtYear(cycle, year),
          `${cycle.id} trough ${year}`
        ).toBeCloseTo(-1, 2);
      }
    }
  });

  it("stays inside the requested range and includes the reference peak", () => {
    for (const cycle of cycles) {
      const peaks = peakYearsInRange(cycle);
      for (const year of peaks) {
        expect(year).toBeGreaterThanOrEqual(DEFAULT_YEAR_RANGE.start);
        expect(year).toBeLessThanOrEqual(DEFAULT_YEAR_RANGE.end);
      }
      expect(peaks).toContain(cycle.reference_peak_year);
    }
  });

  it("spaces successive peaks one period apart", () => {
    const kondratiev = cycles.find((c) => c.id === "kondratiev")!;
    const peaks = peakYearsInRange(kondratiev, 1900, 2050);
    expect(peaks).toEqual([1919, 1973, 2027]);
    expect(troughYearsInRange(kondratiev, 1900, 2050)).toEqual([1946, 2000]);
  });
});

describe("cycle JSON-LD", () => {
  it("emits a WebPage, BreadcrumbList and DefinedTerm for every cycle", () => {
    for (const cycle of cycles) {
      const ld = cycleJsonLd(cycle) as {
        "@context": string;
        "@graph": { "@type": string }[];
      };
      expect(ld["@context"]).toBe("https://schema.org");
      const types = ld["@graph"].map((node) => node["@type"]);
      expect(types).toContain("WebPage");
      expect(types).toContain("BreadcrumbList");
      expect(types).toContain("DefinedTerm");
      expect(types).toContain(seriesForCycle(cycle) ? "Dataset" : "WebPage");
      // Serializable without cycles or undefined leaks.
      expect(() => JSON.stringify(ld)).not.toThrow();
      expect(JSON.stringify(ld)).not.toContain("undefined");
    }
  });

  it("adds a Dataset node only where a paired series exists", () => {
    const withDataset = cycles.filter((cycle) => {
      const graph = (cycleJsonLd(cycle) as { "@graph": { "@type": string }[] })[
        "@graph"
      ];
      return graph.some((node) => node["@type"] === "Dataset");
    });
    expect(withDataset.map((c) => c.id).sort()).toEqual(
      dataSeries.map((s) => s.associated_cycle_id).sort()
    );
  });

  it("points the Dataset download at the site-hosted CSV", () => {
    const turchin = cycles.find((c) => c.id === "turchin")!;
    const graph = (cycleJsonLd(turchin) as { "@graph": Record<string, never>[] })[
      "@graph"
    ];
    const dataset = graph.find((node) => node["@type"] === "Dataset") as unknown as {
      distribution: { contentUrl: string };
      license: string;
    };
    expect(dataset.distribution.contentUrl).toBe(
      `${SITE_URL}/data/wid_top1_wealth.csv`
    );
    expect(dataset.license).toBe("CC BY 4.0");
  });
});

describe("sitemap", () => {
  it("lists the cycles index and all eight per-cycle routes", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/cycles`);
    for (const cycle of cycles) {
      expect(urls).toContain(`${SITE_URL}${cycleRoutePath(cycle)}`);
    }
    expect(new Set(urls).size).toBe(urls.length);
  });
});
