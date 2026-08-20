import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cycles } from "@/data/cycles";
import type { Cycle, DataSeries } from "@/data/types";
import { sineAtYear } from "@/lib/cycleMath";
import {
  confidenceLabel,
  cycleChartPath,
  cycleJsonLd,
  cycleMetaDescription,
  cycleMetaTitle,
  cycleRoutePath,
  cycleSlug,
  findCycleBySlug,
  peakYearsInRange,
  seriesForCycle,
  troughYearsInRange,
} from "@/lib/cycleRoutes";
import { CopyAttribution, FigureDownloads } from "@/components/ReusePacket";
import { DEFAULT_YEAR_RANGE, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import {
  SPECTRAL_STATE_LABELS,
  spectralDraws,
  spectralVerdictForCycle,
} from "@/lib/spectral";

type Params = { params: Promise<{ id: string }> };

/** One prerendered route per cycle; anything else is a 404, not a render. */
export const dynamicParams = false;

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
  const index = cycles.findIndex((c) => c.id === cycle.id);
  const peaks = peakYearsInRange(cycle);
  const troughs = troughYearsInRange(cycle);
  const provenanceHref = series
    ? series.data_file.replace(/\.csv$/, ".source.md")
    : null;

  return (
    // [&_p]: the article stays 3xl because the curve, the extrema table, and
    // the series card all want that width — but running prose at 15px hit ~94
    // chars per line there, and the mono citation ~128. Constraining only the
    // paragraphs keeps the layout and fixes the measure. Canon R5.
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14 [&_p]:max-w-[68ch]">
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
          <li>
            <Link href="/" className="hover:text-ink transition-colors">
              Overlay
            </Link>
          </li>
          <li aria-hidden className="text-ink-soft/40">
            /
          </li>
          <li>
            <Link href="/cycles" className="hover:text-ink transition-colors">
              Cycles
            </Link>
          </li>
          <li aria-hidden className="text-ink-soft/40">
            /
          </li>
          {/* Matches the BreadcrumbList in this page's JSON-LD. */}
          <li aria-current="page" className="text-ink/70">
            {cycle.name}
          </li>
        </ol>
      </nav>

      <header className="mt-6">
        <p className="text-[11px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
          Cycle No. {String(index + 1).padStart(2, "0")} ·{" "}
          {confidenceLabel(cycle.confidence_level)}
        </p>
        <h1
          className="font-display mt-3 text-ink leading-[0.98] tracking-[-0.015em]"
          style={{ fontSize: "clamp(34px, 5.2vw, 52px)" }}
        >
          {cycle.name}
        </h1>
        <div
          aria-hidden
          className="mt-5 h-[3px] w-16"
          style={{ backgroundColor: cycle.color }}
        />
        <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">
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
        <p className="mt-6 text-[17px] leading-[1.6] text-ink/85">
          {cycle.short_description}
        </p>
      </header>

      <CurveFigure cycle={cycle} />

      <section className="mt-10 space-y-3.5 text-[16px] leading-[1.65] text-ink/85">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Peak calibration
        </h2>
        <p>{cycle.reference_peak_rationale}</p>
        {cycle.caveat && (
          <p className="border-l-2 border-ink/40 pl-3.5 text-[15px] leading-relaxed">
            <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft mr-1.5 font-mono">
              Caveat
            </span>
            <span className="font-display-italic">{cycle.caveat}</span>
          </p>
        )}
        <p className="text-[13px] leading-relaxed text-ink-soft">
          Confidence classification:{" "}
          <strong className="font-medium text-ink/80">
            {confidenceLabel(cycle.confidence_level)}
          </strong>
          . Every cycle on this site is a pure sinusoid built from the
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
          positions of <em>this construction</em>, not dates claimed by the
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
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] uppercase tracking-[0.16em] font-mono">
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
            None in this version. {cycleTheoristSentence(cycle)} The curve can
            still be overlaid against any of the other series in the
            interactive chart, but it has no dedicated empirical pairing to be
            stress-tested against.
          </p>
        </section>
      )}

      {verdict && (
        <section className="mt-10">
          <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
            Spectral verdict
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft mb-4">
            {SPECTRAL_STATE_LABELS[verdict.state]}
            {!verdict.eligible &&
              ` · ${verdict.cycles_covered.toFixed(1)} of 3.0 required periods`}
          </p>
          <figure className="border-t border-rule/30 pt-4">
            {/* Static committed output of scripts/spectral_verdict.py; next/image
                adds nothing to a same-origin SVG. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/data/spectral/${cycle.id}.svg`}
              alt={`Spectral-verdict figure for ${cycle.name}: the paired series with the reference cosine, and its multitaper spectrum with a marker at the ${cycle.period_years}-year target period. Verdict: ${SPECTRAL_STATE_LABELS[verdict.state]}.`}
              width={900}
              height={500}
              loading="lazy"
              className="w-full h-auto"
            />
          </figure>
          <FigureDownloads
            svgHref={`/data/spectral/${cycle.id}.svg`}
            slug={cycleSlug(cycle)}
          />
          <p className="mt-4 text-[15px] leading-[1.6] text-ink/85">
            {verdict.lay_text}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
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
          period against the data, or compare it with the other seven on one
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
        <p className="text-[13px] text-ink-soft">
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

function cycleTheoristSentence(cycle: Cycle): string {
  return `No long-run series in this project maps cleanly onto ${cycle.name.split("—")[0]?.trim() ?? cycle.name}'s construct.`;
}

/**
 * Static rendering of the cycle's sinusoid across the default window. Drawn
 * from the same `sineAtYear` the interactive chart uses, so the figure can't
 * drift from the curve it illustrates.
 */
function CurveFigure({ cycle }: { cycle: Cycle }) {
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

  return (
    <figure className="mt-8">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${cycle.name}: a ${cycle.period_years}-year sinusoid across ${start} to ${end}, with its reference peak at ${cycle.reference_peak_year}.`}
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
        {centuryTicks.map((year) => (
          <line
            key={year}
            x1={x(year)}
            y1={padY / 2}
            x2={x(year)}
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
            <circle cx={peakX} cy={y(1)} r="3.5" fill={cycle.color} />
          </>
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
      <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/75">
        <span>{start}</span>
        <span className="normal-case tracking-normal text-[11px] font-sans italic">
          Reference peak {cycle.reference_peak_year} · period{" "}
          {cycle.period_years} years
        </span>
        <span>{end}</span>
      </figcaption>
    </figure>
  );
}
