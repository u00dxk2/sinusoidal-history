import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import type { ConfidenceLevel, Cycle, DataSeries } from "@/data/types";
import { DEFAULT_YEAR_RANGE, SITE_NAME, SITE_URL } from "@/lib/siteConfig";

/**
 * Static per-cycle routes.
 *
 * The eight cycles previously existed only as query-param states of `/`
 * (`/?focus=<id>`), which gives search and answer engines nothing to index —
 * in particular the `reference_peak_rationale` prose, which is the most
 * substantive per-cycle text the project holds. `/cycles/<slug>` is the
 * indexable surface for that content; it links back into the interactive
 * chart rather than replacing it.
 *
 * Everything in this module is derived from `cycles.json` / `series.json`.
 * No historical claims are authored here — the prose that ships on these
 * pages is the fact-checked prose already in the data files.
 */

/**
 * Cycle ids use underscores (`strauss_howe`); URLs use hyphens, which search
 * engines treat as word separators. The mapping is unambiguous because no
 * cycle id contains a hyphen.
 */
export function cycleSlug(cycle: Cycle): string {
  return cycle.id.replace(/_/g, "-");
}

export function cycleRoutePath(cycle: Cycle): string {
  return `/cycles/${cycleSlug(cycle)}`;
}

/**
 * Deep link into the interactive chart, focused on this cycle.
 * Mirrors the `focus` URL param read by `useFocusState`.
 */
export function cycleChartPath(cycle: Cycle): string {
  return `/?focus=${encodeURIComponent(cycle.id)}`;
}

/**
 * Resolves a route segment to a cycle. Normalizes hyphens to underscores so
 * internal callers can pass either form — but note the route itself sets
 * `dynamicParams = false`, so only the hyphenated slugs are live URLs;
 * `/cycles/strauss_howe` 404s rather than aliasing.
 */
export function findCycleBySlug(slug: string): Cycle | undefined {
  const normalized = slug.toLowerCase().replace(/-/g, "_");
  return cycles.find((c) => c.id === normalized);
}

export function seriesForCycle(cycle: Cycle): DataSeries | undefined {
  return dataSeries.find((s) => s.associated_cycle_id === cycle.id);
}

/**
 * The theorist half of a cycle name — "Ibn Khaldun — dynastic cycle" reads as
 * "Ibn Khaldun". Names without an em dash are returned whole.
 */
export function cycleTheorist(cycle: Cycle): string {
  const [head] = cycle.name.split("—");
  return head?.trim() || cycle.name;
}

/**
 * Shared display label for `confidence_level`. Also used by the poster.
 */
export function confidenceLabel(level: ConfidenceLevel | string): string {
  switch (level) {
    case "quantitative":
      return "Quantitative";
    case "empirical":
      return "Empirical";
    case "empirical-contested":
      return "Empirical · contested";
    case "narrative":
      return "Narrative";
    default:
      return level;
  }
}

/**
 * One-line reader-facing definition of each confidence tier. The labels were
 * used as mastheads on every cycle page without being defined anywhere on the
 * site (journey-walk 2026-08-24, J8). These describe this site's own rough
 * grading of each theory's evidence base — not a claim about the theories.
 */
export function confidenceGloss(level: ConfidenceLevel | string): string {
  switch (level) {
    case "quantitative":
      return "the period comes from statistical work on historical data";
    case "empirical":
      return "an empirical literature supports the period";
    case "empirical-contested":
      return "an empirical literature exists on the claim, and it is disputed";
    case "narrative":
      return "an interpretive reading of history — no statistical fitting behind the period";
    default:
      return "";
  }
}

export function cycleMetaTitle(cycle: Cycle): string {
  return `${cycle.name} · ${cycle.period_years}-year period`;
}

export function cycleMetaDescription(cycle: Cycle): string {
  const series = seriesForCycle(cycle);
  const paired = series
    ? `Paired with ${series.legend_short ?? series.name}.`
    : "No paired data series in this version.";
  return `${cycle.name}: ${indefiniteArticle(cycle.period_years)} ${cycle.period_years}-year sinusoid anchored to a ${cycle.reference_peak_year} reference peak, with the source citation and peak-calibration rationale. ${paired}`;
}

/** "an 84-year", "a 54-year" — spoken form, so 8/11/18-leading numbers take "an". */
function indefiniteArticle(n: number): string {
  const digits = String(Math.abs(Math.trunc(n)));
  if (digits.startsWith("8")) return "an";
  if (digits.length > 1 && (digits.startsWith("11") || digits.startsWith("18"))) {
    return "an";
  }
  return "a";
}

/**
 * Peak years this cycle plots inside a year range, computed from the same
 * `reference_peak_year` + `period_years` the curve is drawn from — so these
 * are correct by construction rather than by assertion. (See AGENTS.md on
 * year-claims in prose: this is why they are derived, never written.)
 */
export function peakYearsInRange(
  cycle: Cycle,
  start: number = DEFAULT_YEAR_RANGE.start,
  end: number = DEFAULT_YEAR_RANGE.end
): number[] {
  return extremaInRange(cycle, start, end, 0);
}

/** Trough years, i.e. peaks offset by half a period. */
export function troughYearsInRange(
  cycle: Cycle,
  start: number = DEFAULT_YEAR_RANGE.start,
  end: number = DEFAULT_YEAR_RANGE.end
): number[] {
  return extremaInRange(cycle, start, end, cycle.period_years / 2);
}

function extremaInRange(
  cycle: Cycle,
  start: number,
  end: number,
  offset: number
): number[] {
  const anchor = cycle.reference_peak_year + offset;
  const first = Math.ceil((start - anchor) / cycle.period_years);
  const out: number[] = [];
  for (let k = first; ; k += 1) {
    const year = anchor + k * cycle.period_years;
    if (year > end) break;
    out.push(Math.round(year));
  }
  return out;
}

/**
 * JSON-LD for a cycle page. Emits a WebPage + BreadcrumbList + DefinedTerm,
 * plus a Dataset node for the paired series so the underlying CSV is
 * discoverable as data (the "<theory> data" query class) and not just prose.
 */
export function cycleJsonLd(cycle: Cycle): Record<string, unknown> {
  const url = `${SITE_URL}${cycleRoutePath(cycle)}`;
  const series = seriesForCycle(cycle);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: cycleMetaTitle(cycle),
      description: cycleMetaDescription(cycle),
      isPartOf: {
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      about: { "@id": `${url}#term` },
      ...(series ? { mentions: { "@id": `${url}#dataset` } } : {}),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cycles",
          item: `${SITE_URL}/cycles`,
        },
        { "@type": "ListItem", position: 3, name: cycle.name, item: url },
      ],
    },
    {
      "@type": "DefinedTerm",
      "@id": `${url}#term`,
      name: cycle.name,
      alternateName: cycleTheorist(cycle),
      description: cycle.short_description,
      url,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        "@id": `${SITE_URL}/cycles#termset`,
        name: "Long-wave theories of history",
        url: `${SITE_URL}/cycles`,
      },
    },
  ];

  if (series) {
    graph.push({
      "@type": "Dataset",
      "@id": `${url}#dataset`,
      name: series.name,
      description: series.short_description,
      license: series.license,
      url: series.source_url,
      isAccessibleForFree: true,
      creator: { "@type": "Organization", name: series.source },
      distribution: {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${SITE_URL}${series.data_file}`,
      },
      variableMeasured: {
        "@type": "PropertyValue",
        name: series.value_column,
        unitText: series.value_units,
      },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
