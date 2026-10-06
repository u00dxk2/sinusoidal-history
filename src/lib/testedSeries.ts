// Some verdicts are judged on a different cut of the paired series from the one the
// chart draws: Kondratiev's on the annual, unsmoothed TFP figures while the chart shows
// their 5-year rolling average. A cold reader met both labels on one page and "could
// not tell from the page which series was tested" (W-003 D2, 2026-10-03; I-024).
//
// An entry here names the judged series in the "Does it hold up?" box and says, under
// the verdict, why the page carries two labels. Keyed by the verdict's series_id. A
// verdict with no entry (Turchin's 1913+ wealth cut today) keeps the generic sentence.
//
// No test was run on Kondratiev (its record covers 1.4 of the 3.0 periods), so this copy
// must never say one was: the site MEASURES the record on these figures and WOULD run a
// test on them. The reason is us_tfp_growth.source.md:19-22, in plain words.

export type TestedSeriesNote = {
  /** The judged series' name, exactly as the verdict's own lay_text spells it. */
  name: string;
  /** One paragraph: why the chart and the verdict carry different labels. */
  whyTwoLabels: string;
};

const NOTES: Record<string, TestedSeriesNote> = {
  us_tfp_growth_annual: {
    name: "US TFP growth (annual, unsmoothed)",
    whyTwoLabels:
      "Why two labels: the curve earlier on this page, its paired-data note and the citation at the end use the 5-year rolling average of this series, which is easier to read. The site measures the record's length on the annual figures, and would run any test on them, because a rolling average makes neighbouring years move together and would distort the background-noise model a test compares against.",
  },
};

export function testedSeriesNote(seriesId: string): TestedSeriesNote | undefined {
  return Object.hasOwn(NOTES, seriesId) ? NOTES[seriesId] : undefined;
}
