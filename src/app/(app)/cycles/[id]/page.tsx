import type { Metadata } from "next";
import Link from "next/link";
import HashLink from "@/components/HashLink";
import { notFound } from "next/navigation";
import { cycles } from "@/data/cycles";
import type { Cycle, DataSeries } from "@/data/types";
import { sineAtYear } from "@/lib/cycleMath";
import {
  confidenceGloss,
  confidenceLabel,
  cycleCalibratePath,
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
import { CopyAttribution, FigureDownloads } from "@/components/ReusePacket";
import FigureScroller from "@/components/FigureScroller";
import { DEFAULT_YEAR_RANGE, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import {
  statePath,
  yearPosition,
  yearPositionSentence,
} from "@/lib/stateOfCycles";
import {
  SPECTRAL_STATE_LABELS,
  spectralDraws,
  spectralHeadline,
  spectralVerdictForCycle,
} from "@/lib/spectral";
import { testedSeriesNote } from "@/lib/testedSeries";

type Params = { params: Promise<{ id: string }> };

/** One prerendered route per cycle; anything else is a 404, not a render. */
export const dynamicParams = false;

/**
 * Re-render once a day. The page states where its curve puts the current year
 * (yearPosition), and a prerender alone would freeze that year at build time —
 * a page built in December would say the old year all of January. Daily ISR
 * keeps it within a day of /state/<year>, which is force-dynamic.
 */
export const revalidate = 86400;

export function generateStaticParams() {
  return cycles.map((cycle) => ({ id: cycleSlug(cycle) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const cycle = findCycleBySlug(id);
  if (!cycle) return { title: "Cycle not found" };

  const path = cycleRoutePath(cycle);
  const title = cycleMetaTitle(cycle);
  const description = cycleMetaDescription(cycle);
  const ogImage = `/og?cycle=${cycle.id}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${cycle.name} — period ${cycle.period_years} years, reference peak ${cycle.reference_peak_year}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CyclePage({ params }: Params) {
  const { id } = await params;
  const cycle = findCycleBySlug(id);
  if (!cycle) notFound();

  const series = seriesForCycle(cycle);
  const verdict = spectralVerdictForCycle(cycle.id);
  // Only when the judged cut differs from the drawn series: a note on a matching
  // pair would explain a difference that is not there (Codex r1, 2026-10-06).
  const tested =
    verdict && series?.id !== verdict.series_id
      ? testedSeriesNote(verdict.series_id)
      : undefined;
  const index = cycles.findIndex((c) => c.id === cycle.id);
  const peaks = peakYearsInRange(cycle);
  const troughs = troughYearsInRange(cycle);
  const provenanceHref = series
    ? series.data_file.replace(/\.csv$/, ".source.md")
    : null;
  const year = new Date().getUTCFullYear();
  const positionSentence = yearPositionSentence(cycle, year);

  return (
    // [&_p]: the article stays 3xl because the curve, the extrema table, and
    // the series card all want that width — but running prose at 15px hit ~94
    // chars per line there, and the mono citation ~128. Constraining only the
    // paragraphs keeps the layout and fixes the measure. Canon R5.
    // Below sm, everything above the verdict is tighter than at sm and up — the
    // spacing, the H1 and the description's type — so the answer clears a phone's
    // first screen. On 2026-09-25 check-entry-folds.mjs read /cycles/turchin's
    // answer 37px below 390x664, and at 360x560 ten of the ten cycle pages were
    // cut by 4-142px. Every value here has an sm: twin that restores the desktop
    // layout exactly. Re-run the script at BOTH sizes after any edit above the
    // verdict:
    //   node scripts/check-entry-folds.mjs
    //   node scripts/check-entry-folds.mjs --width 360 --height 560
    //
    // max-[360px] (width < 360) tightens it once more for a 320x568 screen, where
    // Turchin's answer — the longest description on the roster — was 28px below
    // on 2026-09-26: a 16px gutter like the site header's, a smaller H1, and less
    // space between the breadcrumb, header and verdict. 360 and up are unchanged.
    //   node scripts/check-entry-folds.mjs --width 320 --height 568
    <article className="max-w-3xl mx-auto px-5 max-[360px]:px-4 sm:px-8 pt-4 max-[360px]:pt-3 pb-10 sm:py-14 [&_p]:max-w-[68ch]">
      <script
        type="application/ld+json"
        // JSON-LD is generated from cycles.json / series.json, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cycleJsonLd(cycle)) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="text-[11px] sm:text-[11px] tracking-[0.2em] uppercase text-ink-soft/80 font-mono"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {/* inline-flex min-h-11 -my-3: breadcrumb links measured 14px tall
              on a phone — the same 44px tap floor applied in the header nav.
              Canon R28; journey-walk 2026-08-24, J13. */}
          <li>
            <Link
              href="/"
              className="inline-flex items-center min-h-11 -my-3 hover:text-ink transition-colors"
            >
              Chart
            </Link>
          </li>
          <li aria-hidden className="text-ink-soft/40">
            /
          </li>
          <li>
            <Link
              href="/cycles"
              className="inline-flex items-center min-h-11 -my-3 hover:text-ink transition-colors"
            >
              Cycles
            </Link>
          </li>
          {/* Below sm the current page's crumb is hidden: it repeats the H1 one
              line below, and on a phone a long name wrapped the breadcrumb onto a
              second line, pushing the verdict down ~20px (2026-09-25). */}
          <li aria-hidden className="hidden sm:list-item text-ink-soft/40">
            /
          </li>
          {/* Matches the BreadcrumbList in this page's JSON-LD. */}
          <li aria-current="page" className="hidden sm:list-item text-ink/70">
            {cycle.name}
          </li>
        </ol>
      </nav>

      <header className="mt-3 max-[360px]:mt-2 sm:mt-6">
        <p className="text-[11px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
          Cycle No. {String(index + 1).padStart(2, "0")} ·{" "}
          {/* A link to the classification's definition at the foot of the
              page — the same defect W-002 found on /cycles (2026-09-27): a
              bare tag that reads as a fact about the cycle and does nothing
              on touch. */}
          <HashLink
            href="#confidence"
            aria-label={`${confidenceLabel(cycle.confidence_level)}: what this confidence tag means`}
            className="underline decoration-dotted decoration-ink-soft/60 underline-offset-[3px] hover:text-ink hover:decoration-ink transition-colors"
          >
            {confidenceLabel(cycle.confidence_level)}
          </HashLink>
        </p>
        <h1 className="font-display mt-2 sm:mt-3 text-ink leading-[0.98] tracking-[-0.015em] text-[30px] max-[360px]:text-[28px] sm:text-[clamp(34px,5.2vw,52px)]">
          {cycle.name}
        </h1>
        <div
          aria-hidden
          className="mt-3 sm:mt-5 h-[3px] w-16"
          style={{ backgroundColor: cycle.color }}
        />
        <p className="mt-3 sm:mt-6 text-[15px] leading-[1.55] sm:text-[17px] sm:leading-[1.6] text-ink/85">
          {cycle.short_description}
        </p>
      </header>

      {/* The question a stranger arrives with is "is this real, and how would I
          know?" — and until 2026-09-16 the answer sat ~4 sections down, after the
          curve, the calibration and the extrema table. This is that answer, up
          front, every number derived from the frozen verdicts.json. Same shape as
          the J6 fix on the section below: plain English before the figure. */}
      {verdict && (
        <section
          id="does-it-hold-up"
          aria-label="Does this cycle hold up"
          className="mt-4 max-[360px]:mt-3 sm:mt-8 border border-rule/40 bg-ink/[0.02] px-4 py-3 sm:px-6 sm:py-5"
        >
          <BoxLabel name={cycleTheorist(cycle)} />
          <p className="mt-2 sm:mt-2.5 text-[16px] sm:text-[17px] leading-[1.5] text-ink">
            {verdict.eligible
              ? `Tested — ${SPECTRAL_STATE_LABELS[verdict.state]}.`
              : "Not testable on the record that exists — and that is the finding, not a dodge."}
          </p>
          <p className="mt-2.5 text-[15px] leading-[1.6] text-ink/85">
            {/* Name the series ONLY when the tested record IS the displayed one:
                inference runs on unsmoothed / span-limited cuts (Kondratiev's annual
                TFP, Turchin's 1913+ wealth), and calling those by the chart's label
                would contradict the verdict paragraph below. Shortfall is computed
                from the exact span, never from the rounded cycles_covered — that
                rounding overstates it by a year on four of the nine rows.
                A cut with a testedSeriesNote is named here outright (I-024). */}
            {series && series.id === verdict.series_id
              ? `The paired record (${series.name}) runs ${verdict.span_years} years: `
              : tested
                ? `The record this verdict is judged on, ${tested.name}, runs ${verdict.span_years} years: `
                : `The record this verdict tests — a different cut of the paired series from the one drawn on the chart, named in the verdict below — runs ${verdict.span_years} years: `}
            {`${verdict.cycles_covered.toFixed(1)} of the 3.0 full periods this site requires before it will run a test on a ${verdict.period_years}-year claim.`}
            {!verdict.eligible &&
              ` Roughly ${Math.max(0, Math.ceil(3 * verdict.period_years - verdict.span_years))} more years of that measurement would reach the floor.`}
          </p>
          <p className="mt-2.5 text-[15px] leading-[1.6] text-ink/85">
            {`This is not a verdict about this theory in particular: ${spectralHeadline.eligible_primary} of the ${spectralHeadline.total_primary} paired constructions on this site clear that floor. Long-cycle claims are hard to test because the records are short, not because the theorists are careless.`}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
            {/* min-h-11: this was a 17px-tall target on phones, and it is the
                only way forward from the box (cold walk 2026-10-02, finding 3).
                It sits below the answer sentence, so the first-screen fold
                does not move. */}
            <HashLink
              href="#spectral-verdict"
              className="inline-flex items-center min-h-11 underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
            >
              The full verdict, the figure and the protocol →
            </HashLink>
          </p>
        </section>
      )}

      {/* A cycle with no paired series has no verdict, and until 2026-09-25 its
          page simply skipped the question — the fathers-and-sons page opened on
          the curve with no word on whether it had been tested, the one page of
          ten where a reader's first question went unanswered. Same id, so the
          entry-fold roster reads it like the other nine. */}
      {!verdict && !series && (
        <section
          id="does-it-hold-up"
          aria-label="Does this cycle hold up"
          className="mt-4 max-[360px]:mt-3 sm:mt-8 border border-rule/40 bg-ink/[0.02] px-4 py-3 sm:px-6 sm:py-5"
        >
          <BoxLabel name={cycleTheorist(cycle)} />
          <p className="mt-2 sm:mt-2.5 text-[16px] sm:text-[17px] leading-[1.5] text-ink">
            Not tested — this cycle has no paired data series on this site, so
            there is no record to test it against.
          </p>
          {cycle.caveat && (
            <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
              <HashLink
                href="#caveat"
                className="inline-flex items-center min-h-11 underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
              >
                Why there is none, in the caveat →
              </HashLink>
            </p>
          )}
        </section>
      )}

      {/* "Where are we now?" — the question a searcher who lands here on the
          theorist's name arrives with. Until 2026-09-29 the page never said it:
          the reader had to find the current decade in the extrema row further
          down. Derived (yearPosition → cycleStateAtYear), so it matches
          /state/<year> and /api/v1/state. It sits BELOW the verdict on purpose:
          the verdict is each page's first-screen answer, and /cycles/turchin
          had 12px to spare at 320x568 before this line existed. */}
      <p
        id="where-now"
        className="mt-4 max-[360px]:mt-3 sm:mt-6 text-[15px] leading-[1.6] sm:text-[17px] text-ink/85"
      >
        {`${positionSentence} That is a position of this construction, not the theorist's forecast.`}{" "}
        <Link
          href={statePath(year)}
          className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
        >
          {`Every cycle in ${year} →`}
        </Link>
      </p>

      {/* Period / reference peak / paired series sat directly under the H1
          until 2026-09-19, which pushed the verdict's answer sentence 17px
          below a real phone's visible viewport (390x664 — an iPhone 14 in
          Safari, not the 844px CSS viewport, which cleared it and hid the
          problem). It is reference data a stranger reads AFTER deciding the
          page is worth reading, and it belongs against the curve that plots
          it. Measured: tmp/measure-fold.mjs, and the committed 390 frames. */}
      <dl className="mt-8 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
        <div className="flex gap-2">
          <dt className="text-ink-soft/70">Period</dt>
          <dd className="text-ink">{cycle.period_years} years</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-soft/70">Reference peak</dt>
          <dd className="text-ink">{cycle.reference_peak_year}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink-soft/70">Paired data</dt>
          <dd className="text-ink">
            {series ? (series.legend_short ?? series.name) : "None this round"}
          </dd>
        </div>
      </dl>

      <CurveFigure cycle={cycle} year={year} />

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Peak calibration
        </h2>
        {/* Under the heading, not at the section's end: the end sat 3.3 to
            4.95 screens down at 320x568, the heading at most 2.6 (measured
            2026-10-04). The only way in used to be "Open in the chart" at
            the page's foot, 7.6 screens down at 390x664, landing on the
            Facets tab (cold walk 2026-10-03, its single worst thing; I-022).
            This opens Calibrate on this cycle, and the chart scrolls its
            curve and r into one screen (Viz.tsx). Gate:
            scripts/check-calibrate-tab.mjs. */}
        {series && (
          <p className="-mt-1">
            <Link
              href={cycleCalibratePath(cycle)}
              className="inline-flex items-center min-h-11 font-mono text-[12px] uppercase tracking-[0.16em] text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
            >
              Move the peak yourself: calibrate this cycle →
            </Link>
          </p>
        )}
        <p>{cycle.reference_peak_rationale}</p>
        {cycle.caveat && (
          <p
            id="caveat"
            className="scroll-mt-6 border-l-2 border-ink/40 pl-3.5 text-[15px] leading-relaxed"
          >
            <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft mr-1.5 font-mono">
              Caveat
            </span>
            <span className="font-display-italic">{cycle.caveat}</span>
          </p>
        )}
        <p id="confidence" className="scroll-mt-6 text-[13px] leading-relaxed text-ink-soft">
          Confidence classification:{" "}
          <strong className="font-medium text-ink/80">
            {confidenceLabel(cycle.confidence_level)}
          </strong>
          {" — "}
          {confidenceGloss(cycle.confidence_level)}. It grades the
          theorist&apos;s own evidence for the period; a paired data series is
          a separate comparison this site added. Every cycle on this site
          is a pure sinusoid built from the
          theory&apos;s stated period and one documented reference peak — a
          deliberately naïve construction, so that disagreement between
          theories rather than parameter fitting is what you see. See{" "}
          <Link
            href="/about"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            about
          </Link>{" "}
          for why nearly every cycle peaks near the present.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-3">
          Where this curve plots its extrema
        </h2>
        <p className="text-[14px] leading-relaxed text-ink-soft mb-4">
          Computed from period {cycle.period_years} and reference peak{" "}
          {cycle.reference_peak_year}, across the site&apos;s default window
          ({DEFAULT_YEAR_RANGE.start}–{DEFAULT_YEAR_RANGE.end}). These are
          positions of{" "}<em>this construction</em>, not dates claimed by the
          theorist.
        </p>
        <dl className="space-y-3 border-t border-rule/30 pt-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 w-20">
              Peaks
            </dt>
            <dd className="font-mono text-[13px] text-ink/85">
              {peaks.join(" · ")}
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80 w-20">
              Troughs
            </dt>
            <dd className="font-mono text-[13px] text-ink/85">
              {troughs.join(" · ")}
            </dd>
          </div>
        </dl>
      </section>

      {series && (
        <section className="mt-10">
          <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
            Paired data series
          </h2>
          <div className="border-t border-rule/30 pt-4">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                aria-hidden
                className="inline-block w-[3px] h-5 self-stretch rounded-full"
                style={{ backgroundColor: series.color }}
              />
              <h3 className="font-display text-[19px] tracking-tight text-ink font-medium">
                {series.name}
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/85">
                {series.value_units}
              </span>
            </div>
            <p className="mt-2.5 text-[15px] leading-[1.6] text-ink/85">
              {series.short_description}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
              <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft/80 mr-1.5 font-mono">
                Why this pairing
              </span>
              {series.association_note}
            </p>
            {series.transform === "log1p" && (
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                Values are log1p-transformed at load time — natural log of
                (1 + value).
              </p>
            )}
            <dl className="mt-4 space-y-1.5 text-[12px] leading-relaxed text-ink-soft font-mono">
              <div className="flex gap-2 flex-wrap">
                <dt className="text-ink-soft/70">Source</dt>
                <dd className="text-ink/80 flex-1 min-w-[12rem]">
                  {series.source}
                </dd>
              </div>
              <div className="flex gap-2 flex-wrap">
                <dt className="text-ink-soft/70">License</dt>
                <dd className="text-ink/80 flex-1 min-w-[12rem]">
                  {series.license}
                </dd>
              </div>
            </dl>
            {/* [&_a]: the reuse row measured 46×16px tap targets on a phone —
                the 44px floor via the same inline-flex pattern as the header
                nav. Canon R28; journey-walk 2026-08-24, J13. */}
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-0 text-[12px] uppercase tracking-[0.16em] font-mono [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11">
              <li>
                <a
                  href={series.source_url}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                  className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
                >
                  Upstream source ↗
                </a>
              </li>
              <li>
                <a
                  href={series.data_file}
                  download
                  className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
                >
                  CSV ↓
                </a>
              </li>
              {provenanceHref && (
                <li>
                  <a
                    href={provenanceHref}
                    className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
                  >
                    Provenance
                  </a>
                </li>
              )}
            </ul>
          </div>
        </section>
      )}

      {!series && (
        <section className="mt-10">
          <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
            Paired data series
          </h2>
          <p className="border-t border-rule/30 pt-4 text-[15px] leading-[1.6] text-ink-soft">
            None in this version. {cycleTheoristSentence(cycle)}{" "}The curve can
            still be overlaid against any of the other series in the
            interactive chart, but it has no dedicated empirical pairing to be
            stress-tested against.
          </p>
        </section>
      )}

      {verdict && (
        <section id="spectral-verdict" className="mt-10">
          <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
            Spectral verdict
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft mb-3">
            {SPECTRAL_STATE_LABELS[verdict.state]}
            {!verdict.eligible &&
              ` · ${verdict.cycles_covered.toFixed(1)} of 3.0 required periods`}
          </p>
          {/* Plain English BEFORE the multitaper figure: cold readers on both
              viewports hit the verdict string and the hardest figure on the
              site ~500px before the paragraph that decodes them.
              Journey-walk 2026-08-24, J6. */}
          <p className="text-[15px] leading-[1.6] text-ink/85 mb-3">
            {verdict.lay_text}
          </p>
          {tested && (
            <p className="text-[15px] leading-[1.6] text-ink/85 mb-3">
              {tested.whyTwoLabels}
            </p>
          )}
          {!verdict.eligible && (
            <p className="text-[13px] leading-relaxed text-ink-soft mb-4">
              &ldquo;Insufficient data&rdquo; is an eligibility outcome under the
              site&apos;s pre-registered 3.0-period rule - the test is
              declined, not failed - and is not evidence for or against the
              theory.
            </p>
          )}
          {/* The figure is drawn at its native 900px at every width, because
              that is the size its 10-unit axis labels read at (10px). Below lg
              it sits in a sideways scroller: shrunk to a phone's width the
              labels drew at ~4px (cold walk 2026-10-02 r1, finding 1). From lg
              up it breaks out of the 704px text column by 98px a side: held to
              the column the labels drew at 7.8px (I-019).
              With a mouse a click opens the SVG on its own, at native size or
              larger. With a coarse pointer (phones, tablets) the figure is not
              a link at all: a phone browser opened the bare SVG in a 980px
              layout and zoomed it out to 0.36-0.43x, smaller than the inline
              copy, on a page with no way back (I-020; cold walk 2026-10-03
              P12). The SVG and PNG downloads below stay for every pointer.
              The hidden copy is display:none and lazy, so it is not fetched. */}
          <figure className="border-t border-rule/30 pt-4">
            <p className="lg:hidden font-mono text-[12px] text-ink-soft mb-2">
              Swipe sideways for the whole figure
            </p>
            <FigureScroller
              storageKey={cycle.id}
              label="Spectral-verdict figure, scrolls sideways"
              className="overflow-x-auto lg:overflow-visible lg:-mx-[98px]"
            >
              <a
                href={`/data/spectral/${cycle.id}.svg`}
                className="block w-max pointer-coarse:hidden"
              >
                <SpectralFigureImg cycle={cycle} state={verdict.state} />
              </a>
              <div className="hidden w-max pointer-coarse:block">
                <SpectralFigureImg cycle={cycle} state={verdict.state} />
              </div>
            </FigureScroller>
          </figure>
          <FigureDownloads
            svgHref={`/data/spectral/${cycle.id}.svg`}
            slug={cycleSlug(cycle)}
          />
          <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
            Pre-registered harmonic-regression test at the exact stated period
            against an AR(1) red-noise null ({spectralDraws.toLocaleString("en-US")}{" "}
            bootstrap draws), gated on the record covering at least 3.0 full
            periods. Read the protocol under{" "}
            <Link
              href="/methods#spectral-testing"
              className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
            >
              spectral testing on the methods page
            </Link>
            , or fetch the machine-readable{" "}
            <a
              href="/data/spectral/verdicts.json"
              className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
            >
              verdicts.json
            </a>
            .
          </p>
        </section>
      )}

      <section className="mt-10">
        <CopyAttribution citation={attributionFor(cycle, series)} />
      </section>

      <section className="mt-10 border-t border-rule/30 pt-5">
        <p className="text-[15px] leading-[1.6] text-ink/85">
          Open this cycle in the interactive chart to calibrate its peak and
          period against the data, or compare it with the other nine on one
          axis.
        </p>
        <p className="mt-3">
          <Link
            href={cycleChartPath(cycle)}
            className="inline-block font-mono text-[12px] uppercase tracking-[0.18em] text-ink border border-rule/50 px-4 py-2.5 hover:bg-paper-deep transition-colors"
          >
            Open in the chart →
          </Link>
        </p>
      </section>

      <footer className="mt-10 pt-4 border-t border-rule/30 space-y-3">
        <p className="text-[11px] leading-relaxed tracking-wide text-ink-soft/80 font-mono">
          {cycle.source}
        </p>
        {/* [&_a] min-h-11: footer links measured 17px tall on a phone.
            Canon R28; journey-walk 2026-08-24, J13. */}
        <p className="text-[13px] text-ink-soft [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_a]:-my-3">
          <Link
            href="/cycles"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            All ten cycles
          </Link>
          {" · "}
          <Link
            href="/methods"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            Methods and provenance
          </Link>
          {" · "}
          <Link
            href="/about"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            What this is
          </Link>
        </p>
      </footer>
    </article>
  );
}

/**
 * One copy-pasteable credit line: the project (with its concept DOI), the
 * specific page reused, and the upstream series when the cycle has a pairing.
 */
function attributionFor(cycle: Cycle, series: DataSeries | undefined): string {
  const page = `${SITE_URL}${cycleRoutePath(cycle)}`;
  const base =
    `Kooi, D. (2026). ${SITE_NAME}: ${cycle.name}. ` +
    `${page} · DOI 10.5281/zenodo.21998618`;
  if (!series) return `${base}.`;
  // series.source runs to a paragraph of provenance on some series; a credit
  // line wants the publisher clause only. Full text stays on the page above.
  const publisher = series.source.split(". ")[0]!.trim();
  return (
    `${base}. Paired data series: ${series.name} ` +
    `(${publisher}), ${series.license}.`
  );
}

/**
 * The verdict box's label. It names the cycle because the verdict lists on
 * /cycles and /methods land a reader on #does-it-hold-up with the H1 above the
 * screen (165-280px up on a phone), and the box said "Does it hold up?" and
 * "a 54-year claim" without saying whose (cold walk 2026-10-02, finding 1).
 * The name is the short form the reader tapped in that list (cycleTheorist),
 * set BESIDE the question rather than inside it: "Does Peter Turchin hold up?"
 * reads as a verdict on a person, and the box goes on to say it is not one.
 */
function BoxLabel({ name }: { name: string }) {
  return (
    <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] max-[380px]:tracking-[0.08em] text-ink-soft font-medium">
      <span className="text-ink">{name}</span>
      {" · Does it hold up?"}
    </h2>
  );
}

/**
 * The spectral-verdict figure, drawn once as a link (fine pointers) and once
 * plain (coarse pointers); see the comment where it is placed (I-020).
 */
function SpectralFigureImg({
  cycle,
  state,
}: {
  cycle: Cycle;
  state: keyof typeof SPECTRAL_STATE_LABELS;
}) {
  return (
    <>
      {/* Static committed output of scripts/spectral_verdict.py; next/image
          adds nothing to a same-origin SVG. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/data/spectral/${cycle.id}.svg`}
        alt={`Spectral-verdict figure for ${cycle.name}: the paired series with the reference cosine, and its multitaper spectrum with a marker at the ${cycle.period_years}-year target period. Verdict: ${SPECTRAL_STATE_LABELS[state]}.`}
        width={900}
        height={500}
        loading="lazy"
        className="block w-[900px] max-w-none h-auto"
      />
    </>
  );
}

function cycleTheoristSentence(cycle: Cycle): string {
  return `No long-run series in this project maps cleanly onto ${cycle.name.split("—")[0]?.trim() ?? cycle.name}'s construct.`;
}

/**
 * Static rendering of the cycle's sinusoid across the default window. Drawn
 * from the same `sineAtYear` the interactive chart uses, so the figure can't
 * drift from the curve it illustrates.
 */
function CurveFigure({ cycle, year }: { cycle: Cycle; year: number }) {
  const { start, end } = DEFAULT_YEAR_RANGE;
  const width = 900;
  const height = 150;
  const padY = 14;

  const x = (year: number) => ((year - start) / (end - start)) * width;
  const y = (value: number) =>
    height / 2 - value * (height / 2 - padY);

  const points: string[] = [];
  for (let year = start; year <= end; year += 1) {
    points.push(`${x(year).toFixed(2)},${y(sineAtYear(cycle, year)).toFixed(2)}`);
  }

  const centuryTicks: number[] = [];
  for (let year = Math.ceil(start / 100) * 100; year <= end; year += 100) {
    centuryTicks.push(year);
  }

  const peakX = x(cycle.reference_peak_year);
  const showPeakMarker =
    cycle.reference_peak_year >= start && cycle.reference_peak_year <= end;

  // "Now" on the curve. Until 2026-09-29 the only marked point was the
  // reference peak, so on /cycles/dalio the one dot said 1950 while the
  // sentence above said 2026 is at a peak. Same look as the home chart's
  // now-line (a thin ink rule, a dot in the cycle's colour, "now · <year>").
  // The dot and label are HTML over the SVG, not SVG marks: the 900-wide
  // viewBox scales to ~0.39 on a phone, which shrinks an SVG dot to ~1.5px
  // and 11px SVG text to ~4px. Same sineAtYear as the curve and the sentence.
  const showNow = year >= start && year <= end;
  const nowPct = (x(year) / width) * 100;
  const nowTopPct = (y(sineAtYear(cycle, year)) / height) * 100;
  // End-anchor the label near the right edge (2026 sits at ~95% of the
  // window) so it never runs off a 320px screen; start-anchor near the left.
  const nowLabelShift =
    nowPct > 80 ? "-translate-x-full" : nowPct < 20 ? "" : "-translate-x-1/2";

  return (
    // mt-4, not mt-8: the metadata list now sits directly above and reads as
    // this figure's lead-in rather than as a free-floating block.
    <figure className="mt-4">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          // The peak clause is gated on the same condition as the marker it
          // describes: naming a marker that is not drawn is the 2026-09-22
          // overview defect, latent here only because every peak year currently
          // falls inside the window. The now clause is gated the same way.
          aria-label={`${cycle.name}: a ${cycle.period_years}-year sinusoid across ${start} to ${end}${showPeakMarker ? `, with its reference peak at ${cycle.reference_peak_year}` : ""}${showNow ? `, and ${year} marked ${yearPosition(cycle, year).where}` : ""}.`}
          className="block w-full h-auto"
        >
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-rule"
            opacity="0.2"
          />
          {centuryTicks.map((tick) => (
            <line
              key={tick}
              x1={x(tick)}
              y1={padY / 2}
              x2={x(tick)}
              y2={height - padY / 2}
              stroke="currentColor"
              strokeWidth="1"
              className="text-rule"
              opacity="0.12"
            />
          ))}
          {showPeakMarker && (
            <>
              <line
                x1={peakX}
                y1={padY / 2}
                x2={peakX}
                y2={height - padY / 2}
                stroke={cycle.color}
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />
            </>
          )}
          {showNow && (
            <line
              data-mark="now-line"
              x1={x(year)}
              y1={0}
              x2={x(year)}
              y2={height}
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.55"
              vectorEffect="non-scaling-stroke"
              className="text-ink"
            />
          )}
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke={cycle.color}
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {showNow && (
          <span
            aria-hidden
            data-mark="now"
            data-year={year}
            className="absolute block w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-paper"
            style={{
              left: `${nowPct}%`,
              top: `${nowTopPct}%`,
              backgroundColor: cycle.color,
            }}
          />
        )}
        {/* The reference peak: a hollow ring, painted AFTER the filled now-dot.
            It was an SVG circle (r 3.5 in the viewBox), which a phone drew at
            ~1.2px radius, and on /cycles/turchin (peak 2020, now 2026) the
            now-dot sat ~4px away and covered it whole (Codex review,
            2026-09-29). Hollow and on top, its outer arc stays visible
            wherever the two meet. */}
        {showPeakMarker && (
          <span
            aria-hidden
            data-mark="ref-peak"
            className="absolute block w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
            style={{
              left: `${(peakX / width) * 100}%`,
              top: `${(y(1) / height) * 100}%`,
              borderColor: cycle.color,
            }}
          />
        )}
      </div>
      {showNow && (
        <div aria-hidden className="relative h-4 mt-1">
          <span
            data-mark="now-label"
            className={`absolute top-0 ${nowLabelShift} whitespace-nowrap font-mono text-[11px] leading-4 tabular-nums font-medium text-ink`}
            style={{ left: `${nowPct}%` }}
          >
            {`now · ${year}`}
          </span>
        </div>
      )}
      <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/75">
        <span>{start}</span>
        <span className="normal-case tracking-normal text-[11px] font-sans italic">
          {/* The key for the reference-peak ring, so it is not read as "now"
              (the filled now-dot is labelled above). */}
          <span
            aria-hidden
            className="inline-block w-2 h-2 rounded-full border-[1.5px] mr-1.5 align-[-1px]"
            style={{ borderColor: cycle.color }}
          />
          Reference peak {cycle.reference_peak_year} · period{" "}
          {cycle.period_years}{" "}years
        </span>
        <span>{end}</span>
      </figcaption>
    </figure>
  );
}
