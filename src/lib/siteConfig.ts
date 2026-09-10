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
  living: {
    label: "Living memory",
    short: "1950–",
    start: 1950,
    end: DEFAULT_YEAR_RANGE.end,
  },
  now: {
    label: "Now",
    short: "2000–",
    start: 2000,
    end: DEFAULT_YEAR_RANGE.end,
  },
} as const;

export type RangePresetName = keyof typeof PRESET_RANGES;

export const RANGE_PRESET_OPTIONS = Object.entries(PRESET_RANGES).map(
  ([id, preset]) => ({
    id,
    ...preset,
  })
);
