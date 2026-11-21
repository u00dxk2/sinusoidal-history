import type { Cycle } from "@/data/types";
import { countWord } from "@/lib/countWords";
import { cycleRoutePath } from "@/lib/cycleRoutes";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/siteConfig";

/**
 * The home page's link to each cycle's page, and the JSON-LD that describes that same list.
 *
 * Added 2026-11-21 (the search day). Before it, the served home HTML named all ten cycles in the
 * chart but linked none of them: its links were /cycles, /poster, /methods, /about, /colophon and
 * /embed/docs (live GET, 2026-11-21). A crawler reading `/` reached a cycle's page only through
 * /cycles. Both the visible list and the ItemList are built from this one function, so the
 * structured data cannot describe a list the page does not show.
 */
export interface HomeIndexEntry {
  name: string;
  path: string;
  period_years: number;
  reference_peak_year: number;
}

export function homeIndex(cycles: readonly Cycle[]): HomeIndexEntry[] {
  return cycles.map((c) => ({
    name: c.name,
    path: cycleRoutePath(c),
    period_years: c.period_years,
    reference_peak_year: c.reference_peak_year,
  }));
}

/**
 * The home page's title segment; the root template appends " · Sinusoidal History". The count is
 * derived (SITE_DESCRIPTION's hand-typed "Eight" once undercounted the site for a whole window).
 */
export function homeTitle(count: number): string {
  return `${countWord(count)} long-wave theories of history, one time axis`;
}

export function homeJsonLd(cycles: readonly Cycle[]) {
  const entries = homeIndex(cycles);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        // The same @id the cycle pages' JSON-LD uses (cycleRoutes.ts), so both name one site.
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/#cycles`,
        name: "The cycles on this chart, one page each",
        numberOfItems: entries.length,
        itemListElement: entries.map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: e.name,
          url: `${SITE_URL}${e.path}`,
        })),
      },
    ],
  };
}
