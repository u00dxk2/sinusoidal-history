export const SITE_NAME = "Sinusoidal History";
export const SITE_MAKER = "Skylark Creations";
export const SITE_DOMAIN = "sinusoidalhistory.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;
// The leading count MUST match `cycles.json`. It said "Eight" for the whole
// first GSC window while the site shipped ten — the home page's own snippet
// undercounted its content on every impression. `siteConfig` deliberately
// imports no data (it is pulled in by the OG route and the root layout), so
// the count cannot be derived here; `siteConfig.test.ts` pins it instead.
export const SITE_DESCRIPTION =
  "Ten historical cycle theories on one shared time axis. A comparison tool — not prophecy.";

export const DEFAULT_YEAR_RANGE = {
  start: 1600,
  end: 2050,
} as const;

/**
 * The narrowest window the chart will draw, in years (I-060, 2026-10-20). Every theory is
 * anchored to a recent peak, so a short window ending near the present draws most cycles as
 * one crest there: 7 of 10 on 2000–2050, and two cold walkers read the opened Dalio card's
 * single dome as "peaking right now". At the longest cycle's period (Turchin, 150 years) no
 * cycle can be drawn as a lone crest. A shorter drag on the brush or an explicit URL range is
 * widened about its centre to this span. siteConfig.test.ts pins it to cycles.json.
 */
export const MIN_VISIBLE_SPAN = 150;

export const PRESET_RANGES = {
  all: {
    label: "All",
    short: "1600–",
    start: DEFAULT_YEAR_RANGE.start,
    end: DEFAULT_YEAR_RANGE.end,
  },
  industrial: {
    label: "Industrial",
    short: "1750–",
    start: 1750,
    end: DEFAULT_YEAR_RANGE.end,
  },
  modern: {
    label: "Modern",
    short: "1900–",
    start: 1900,
    end: DEFAULT_YEAR_RANGE.end,
  },
  // "Living memory" (1950–) and "Now" (2000–) were removed (I-060, 2026-10-20): both are
  // shorter than MIN_VISIBLE_SPAN. On "Now", 7 of 10 cycles drew as one crest near the
  // present; on "Living memory", Khaldun and Turchin did.
} as const;

export type RangePresetName = keyof typeof PRESET_RANGES;

export const RANGE_PRESET_OPTIONS = Object.entries(PRESET_RANGES).map(
  ([id, preset]) => ({
    id,
    ...preset,
  })
);
