"use client";

import { useMemo, useRef, type ReactNode } from "react";
import Link from "next/link";
import { line as d3Line, curveCatmullRom, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Cycle, DataSeries } from "@/data/types";
import {
  phasePositionLabel,
  type PhasePositionLabel,
} from "@/lib/cycleMath";
import { cycleRoutePath } from "@/lib/cycleRoutes";
import { holdsUpCard } from "@/lib/holdsUp";
import { normalizeSeries, pearsonCorrelation } from "@/lib/seriesMath";
import { useCsvSeries } from "@/lib/useCsvSeries";
import {
  useCycleValues,
  useTimeScale,
  useVisibleData,
  useContainerWidth,
} from "@/lib/hooks";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export type FacetMode = "normal" | "expanded" | "collapsed";

interface CycleFacetProps {
  cycle: Cycle;
  series: DataSeries | undefined;
  mode: FacetMode;
  startYear: number;
  endYear: number;
  currentYear: number;
  override: { period_years?: number; reference_peak_year?: number };
  onChangeOverride: (
    next: { period_years?: number; reference_peak_year?: number }
  ) => void;
  onResetOverride: () => void;
  onFocus: () => void;
  onBlur: () => void;
  /** Set when the facet is hosted outside the facet stack (the Calibrate
      tab): the header then opens the cycle in the Facets view instead of
      toggling, since there is nothing here to collapse back into. */
  onOpenInFacets?: () => void;
  /** A year axis drawn directly under the chart. FacetView draws its own
      axis beside the stack; a facet hosted alone (the Calibrate tab) has
      none unless it is passed here. */
  timeAxis?: ReactNode;
  /** Embeds: the header is a label, not a button. In an iframe there is no
      focus state to toggle, so a full-width button there did nothing when
      tapped (manager review 2026-10-11 round 4, I-037). */
  readOnly?: boolean;
  /** Chart height in px, overriding the mode's default. The single-cycle
      embed uses it: "normal" mode draws a 60px curve on a phone, too small
      to argue a claim with. */
  chartHeight?: number;
  /** Draw the "Does it hold up?" line under the chart outside expanded mode.
      The single-cycle embed sets it: it is a "normal" facet, and it argues a
      claim with a curve over data, so it owes the verdict too (I-045). */
  verdictLine?: boolean;
}

// Min-height in px per mode. Normal mode is shorter on mobile.
const FACET_MIN_HEIGHT_CLASS: Record<FacetMode, string> = {
  collapsed: "min-h-[36px]",
  normal: "min-h-[100px] sm:min-h-[140px]",
  expanded: "min-h-[420px]",
};

export default function CycleFacet({
  cycle,
  series,
  mode,
  startYear,
  endYear,
  currentYear,
  override,
  onChangeOverride,
  onResetOverride,
  onFocus,
  onBlur,
  onOpenInFacets,
  timeAxis,
  readOnly = false,
  chartHeight,
  verdictLine = false,
}: CycleFacetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef, 800);

  const effective: Cycle = {
    ...cycle,
    period_years: override.period_years ?? cycle.period_years,
    reference_peak_year:
      override.reference_peak_year ?? cycle.reference_peak_year,
  };

  const overridden =
    effective.period_years !== cycle.period_years ||
    effective.reference_peak_year !== cycle.reference_peak_year;

  const phaseLabel = phasePositionLabel(effective, currentYear);

  return (
    <div
      ref={containerRef}
      data-facet-id={cycle.id}
      className={cn(
        // scroll-mt-3: breathing room when FacetView scrolls a newly-focused
        // facet into view (journey-walk 2026-08-24, J1).
        "relative w-full rounded-sm border transition-[opacity,padding] duration-150 scroll-mt-3",
        FACET_MIN_HEIGHT_CLASS[mode],
        mode === "expanded"
          ? "border-rule/40 bg-paper-deep/30 p-3 sm:p-4"
          : mode === "collapsed"
            ? "border-transparent px-2 py-0.5 opacity-65"
            : "border-rule/20 bg-paper p-2 sm:p-3 hover:border-rule/35 transition-colors"
      )}
    >
      <FacetHeader
        cycle={cycle}
        effective={effective}
        mode={mode}
        phaseLabel={phaseLabel}
        showPhaseTag={mode !== "expanded" && verdictLine}
        overridden={overridden}
        onFocus={onFocus}
        onBlur={onBlur}
        onOpenInFacets={onOpenInFacets}
        readOnly={readOnly}
      />

      {/* Before the legend and the chart (I-047): the 10-14 and 10-15 cold walks
          read "PEAKING" and a curve laid over its data as confirmation before
          they reached the verdict under the chart. Outside the `series` gate
          below on purpose: the unpaired cycle says "Not tested" too. */}
      {(mode === "expanded" || verdictLine) && (
        <HoldsUpLine
          cycle={cycle}
          newTab={readOnly}
          compact={mode !== "expanded"}
        />
      )}

      {/* The closed card's verdict (I-048): before any tap, the cold walks
          read the closed card as confirmation with nothing beside it saying
          the cycle is untested. Plain text, not a link, so the card keeps one
          tap target; the single-cycle embed carries its own compact line. */}
      {mode === "normal" && !verdictLine && <ClosedVerdict cycle={cycle} />}

      {/* No phase line on the expanded card (I-054, 2026-10-18): "Where the
          drawn curve sits in 2026: peaking", over a crest at the now-line,
          still read briefly as the site agreeing (walks C1/C2, 10-17), after
          moving it under the answer (I-047) had not been enough. The
          /cycles/<slug> page says where this year sits, below its verdict. */}

      {mode !== "collapsed" && series && (
        <FacetLegend cycle={cycle} series={series} />
      )}

      {mode !== "collapsed" && (
        <FacetChart
          cycle={effective}
          series={series}
          width={width}
          height={
            chartHeight ?? (mode === "expanded" ? 220 : width < 640 ? 60 : 84)
          }
          startYear={startYear}
          endYear={endYear}
          currentYear={currentYear}
          interactive={mode === "expanded"}
          markNow={verdictLine}
        />
      )}

      {mode !== "collapsed" && timeAxis}

      {mode === "collapsed" && (
        <CollapsedSparkline
          cycle={effective}
          width={width}
          startYear={startYear}
          endYear={endYear}
        />
      )}

      {mode === "expanded" && series && (
        <ExpandedTail
          cycle={cycle}
          effective={effective}
          series={series}
          override={override}
          onChange={onChangeOverride}
          onReset={onResetOverride}
          controlsFirst={onOpenInFacets !== undefined}
        />
      )}
    </div>
  );
}

function FacetHeader({
  cycle,
  effective,
  mode,
  phaseLabel,
  showPhaseTag,
  overridden,
  onFocus,
  onBlur,
  onOpenInFacets,
  readOnly,
}: {
  cycle: Cycle;
  effective: Cycle;
  mode: FacetMode;
  phaseLabel: PhasePositionLabel;
  showPhaseTag: boolean;
  overridden: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onOpenInFacets?: () => void;
  readOnly: boolean;
}) {
  // For mobile readability, take the bit before the em-dash if the name is
  // long. Khaldun → "Ibn Khaldun"; Carlota Perez → "Carlota Perez"; etc.
  const shortName =
    cycle.name.length > 22 && cycle.name.includes("—")
      ? cycle.name.split("—")[0].trim()
      : cycle.name;
  const label = (
    <>
        <span
          aria-hidden
          className="inline-block self-stretch w-[3px] flex-shrink-0 rounded-full"
          style={{ backgroundColor: cycle.color, minHeight: 14 }}
        />
        <span
          className={cn(
            "font-display tracking-tight truncate text-ink",
            mode === "collapsed"
              ? "text-[12px]"
              : "text-[15px] sm:text-[17px] font-medium"
          )}
        >
          <span className="hidden sm:inline">{cycle.name}</span>
          <span className="sm:hidden">{shortName}</span>
        </span>
        {mode !== "collapsed" && (
          <span className="hidden md:inline text-[11px] text-ink-soft/80 font-mono tracking-wide whitespace-nowrap">
            {effective.period_years}y · peak {effective.reference_peak_year}
            {overridden && (
              <span
                className="ml-1.5 inline-block px-1 py-px rounded-sm bg-ink/10 text-ink text-[11px] uppercase tracking-widest"
                aria-label="calibrated"
              >
                cal
              </span>
            )}
          </span>
        )}
    </>
  );
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
      {readOnly ? (
        <div className="flex items-center gap-2.5 min-w-0 flex-1 px-1 py-0.5 min-h-11">
          {label}
        </div>
      ) : (
        <button
          type="button"
          onClick={
            onOpenInFacets ?? (mode === "expanded" ? onBlur : onFocus)
          }
          aria-expanded={onOpenInFacets ? undefined : mode === "expanded"}
          title={onOpenInFacets ? "Open in the facets view" : undefined}
          className="flex items-center gap-2.5 min-w-0 flex-1 text-left rounded-sm px-1 py-0.5 min-h-11 hover:bg-ink/[0.04] focus-visible:bg-ink/[0.04]"
        >
          {label}
        </button>
      )}
      {/* In ink, not the cycle's colour (I-047): drawn in the curve's own
          colour, the phase word read as part of the theory's claim, and the
          cold walks took "PEAKING" as confirmation. The colour bar beside the
          name still ties the card to its curve. Not in the expanded header:
          there it moved below the answer (see CycleFacet). */}
      {/* "curve ·" (I-048): a bare "PEAKING" on the closed card read as the
          site agreeing with the theory before the card was opened. Even with
          "curve ·", walks B2/B3 (2026-10-16) read "CURVE · PEAKING" on the
          closed Dalio card as "peaking now", and the tag, which never
          shrinks, cut the name short at 320px (I-050). So the home page's
          closed and collapsed cards carry no phase word at all (2026-10-17);
          the embed keeps it (its own verdict line sits above the chart, and
          check-holds-up-line reads it there). */}
      {showPhaseTag && (
        <span
          className={cn(
            "text-[11px] sm:text-[11px] font-mono uppercase tracking-[0.18em] whitespace-nowrap flex-shrink-0 text-ink-soft",
            mode === "collapsed" ? "opacity-60" : ""
          )}
          data-phase-position={phaseLabel}
        >
          curve · {phaseLabel}
        </span>
      )}
    </div>
  );
}

/**
 * The cycle page's "Does it hold up?" answer, above the curve. The card draws
 * a theory over a measured series with a phase word, which reads as a match;
 * until I-045 nothing on it said whether the record can test that, and until
 * I-047 the answer sat under the chart, where the walks met it last. The words
 * come from holdsUpCard, so the card, the page box and the share card cannot
 * drift. It is the PUBLISHED cycle's verdict even while the curve is
 * calibrated. Nothing renders for a paired cycle with no verdict row (none
 * today), rather than an empty question.
 *
 * Two forms. The expanded card states the answer as plain text (no arrow on
 * it: the walk read an arrowed answer as "the answer is elsewhere"), then its
 * reason, the share card's detail sentence, then one link to the page's box.
 * The single-cycle embed keeps the compact one-line link, because its 540px
 * snippet frame has no height to spare (check-embed-snippets).
 */
function HoldsUpLine({
  cycle,
  newTab,
  compact,
}: {
  cycle: Cycle;
  newTab: boolean;
  compact: boolean;
}) {
  const card = holdsUpCard(cycle);
  if (!card) return null;
  const href = `${cycleRoutePath(cycle)}#does-it-hold-up`;
  const label = (
    <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft/80">
      Does it hold up?
    </span>
  );
  // An embed is an iframe: open the site in a new tab, as its footer does.
  const anchor = (className: string, children: ReactNode, ariaLabel?: string) =>
    newTab ? (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={className}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    ) : (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );

  if (compact) {
    // One link for the whole line: the label and the headline wrap together
    // inside one 44px tap box. As a label above a separate 44px link it took
    // 59px on a phone and pushed the 500px snippet's attribution out of its
    // frame (check-embed-snippets, 2026-10-14).
    return (
      <p data-holds-up={cycle.id} className="mt-1.5">
        {anchor(
          "flex flex-wrap items-center gap-x-2 min-h-11 text-[13px] leading-snug text-ink",
          <>
            {label}
            <span className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors">
              <span data-holds-up-headline>{card.headline}</span> →
            </span>
          </>
        )}
      </p>
    );
  }

  return (
    <div data-holds-up={cycle.id} className="mt-2 mb-1">
      <p className="flex flex-wrap items-baseline gap-x-2">
        {label}
        <span data-holds-up-headline className="text-[15px] font-medium text-ink">
          {card.headline}
        </span>
      </p>
      <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">
        <span data-holds-up-why>{card.detail}</span>{" "}
        {/* Inline padding, not min-h-11: an inline-flex 44px box opened a gap
            in the middle of the reason sentence. py-[13px] makes a ~45px tap box
            with no layout cost (the I-015 /cycles header link). */}
        {anchor(
          "py-[13px] whitespace-nowrap underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors text-ink",
          "Details →",
          // A link list reads "Details" alone otherwise (Codex r1 LOW).
          `Does ${cycle.name} hold up? Details on its page`
        )}
      </p>
    </div>
  );
}

/** The closed card's one-line answer: the label and holdsUpCard's headline,
    unlinked. Nothing renders where there is no verdict row (none today). */
function ClosedVerdict({ cycle }: { cycle: Cycle }) {
  const card = holdsUpCard(cycle);
  if (!card) return null;
  return (
    <p
      data-holds-up-closed={cycle.id}
      className="mt-0.5 px-1 flex flex-wrap items-baseline gap-x-2 text-[12px] leading-snug text-ink"
    >
      <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft/80">
        Does it hold up?
      </span>
      <span>{card.headline}</span>
    </p>
  );
}

function FacetLegend({
  cycle,
  series,
}: {
  cycle: Cycle;
  series: DataSeries;
}) {
  return (
    <div
      aria-hidden
      className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] sm:text-[11px] tracking-[0.18em] uppercase text-ink-soft/85 font-mono"
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className="block w-3.5 h-[2px] rounded-full"
          style={{ backgroundColor: cycle.color }}
        />
        <span>theory</span>
      </span>
      <span className="text-ink-soft/35">·</span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="block w-3.5 h-[2px] rounded-full"
          style={{ backgroundColor: series.color }}
        />
        <span>{series.legend_short ?? series.name}</span>
      </span>
    </div>
  );
}

function FacetChart({
  cycle,
  series,
  width,
  height,
  startYear,
  endYear,
  currentYear,
  interactive,
  markNow,
}: {
  cycle: Cycle;
  series: DataSeries | undefined;
  width: number;
  height: number;
  startYear: number;
  endYear: number;
  currentYear: number;
  interactive: boolean;
  /** Draw the dashed current-year line. Off on the home page's closed card
   *  (I-048, 2026-10-17): its crest at that line read as "peaking now". */
  markNow: boolean;
}) {
  const innerWidth = Math.max(0, width - 8);
  const xScale = useTimeScale(startYear, endYear, innerWidth);
  const yScale = useMemo(
    () => scaleLinear().domain([-1.2, 1.2]).range([height - 8, 4]),
    [height]
  );

  const cyclePoints = useCycleValues(cycle, startYear, endYear);

  const cyclePath = useMemo(() => {
    const lineGen = d3Line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));
    return lineGen(cyclePoints) ?? "";
  }, [cyclePoints, xScale, yScale]);

  const csv = useCsvSeries(
    series?.data_file ?? "",
    series?.year_column ?? "year",
    series?.value_column ?? "value",
    series?.transform
  );
  const visiblePoints = useVisibleData(csv.points, startYear, endYear);
  const normalized = useMemo(() => normalizeSeries(visiblePoints), [visiblePoints]);
  const seriesPath = useMemo(() => {
    if (!series || normalized.length === 0) return "";
    const lineGen = d3Line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(curveMonotoneX);
    return lineGen(normalized) ?? "";
  }, [series, normalized, xScale, yScale]);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label={`${cycle.name} curve from ${startYear} to ${endYear}`}
      className="block mt-1"
    >
      <line
        x1={4}
        x2={innerWidth + 4}
        y1={yScale(0)}
        y2={yScale(0)}
        stroke="currentColor"
        strokeOpacity={0.12}
        strokeDasharray="3 4"
      />
      <g transform="translate(4,0)">
        <path
          data-curve="theory"
          d={cyclePath}
          fill="none"
          stroke={cycle.color}
          strokeWidth={interactive ? 2.5 : 2}
          strokeOpacity={0.85}
          strokeLinecap="round"
        />
        {seriesPath && series && (
          <path
            d={seriesPath}
            fill="none"
            stroke={series.color}
            strokeWidth={1.5}
            strokeOpacity={0.65}
            strokeLinecap="round"
          />
        )}
        {markNow && (
          <line
            x1={xScale(currentYear)}
            x2={xScale(currentYear)}
            y1={0}
            y2={height}
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.35}
            strokeDasharray="2 3"
          />
        )}
      </g>
    </svg>
  );
}

function CollapsedSparkline({
  cycle,
  width,
  startYear,
  endYear,
}: {
  cycle: Cycle;
  width: number;
  startYear: number;
  endYear: number;
}) {
  const innerWidth = Math.max(0, width - 8);
  const height = 18;
  const xScale = useTimeScale(startYear, endYear, innerWidth);
  const yScale = useMemo(
    () => scaleLinear().domain([-1, 1]).range([height - 1, 1]),
    []
  );
  const points = useCycleValues(cycle, startYear, endYear, 1);
  const path = useMemo(() => {
    const lineGen = d3Line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));
    return lineGen(points) ?? "";
  }, [points, xScale, yScale]);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label={`${cycle.name} sparkline`}
      className="block"
    >
      <g transform="translate(4,0)">
        <path
          d={path}
          fill="none"
          stroke={cycle.color}
          strokeWidth={1}
          strokeOpacity={0.7}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function ExpandedTail({
  cycle,
  effective,
  series,
  override,
  onChange,
  onReset,
  controlsFirst = false,
}: {
  cycle: Cycle;
  effective: Cycle;
  series: DataSeries;
  override: { period_years?: number; reference_peak_year?: number };
  onChange: (
    o: { period_years?: number; reference_peak_year?: number }
  ) => void;
  onReset: () => void;
  /** Calibrate tab: the sliders come before the rationale, so on a phone
      they sit right under the chart and the curve stays in view while
      dragging. With the rationale first, the peak slider sat ~700px below
      the chart's top at 390x664. At md+ the sliders take the left column. */
  controlsFirst?: boolean;
}) {
  const peakMin = cycle.reference_peak_year - 30;
  const peakMax = cycle.reference_peak_year + 30;
  const periodMin = Math.round(cycle.period_years * 0.75);
  const periodMax = Math.round(cycle.period_years * 1.25);

  const csv = useCsvSeries(
    series.data_file,
    series.year_column,
    series.value_column,
    series.transform
  );
  const correlation = useMemo(() => {
    if (csv.points.length < 2) return null;
    const seriesVals = csv.points.map((p) => p.value);
    const cycleVals = csv.points.map(
      (p) =>
        Math.cos(
          (2 * Math.PI * (p.year - effective.reference_peak_year)) /
            effective.period_years
        )
    );
    return pearsonCorrelation(seriesVals, cycleVals);
  }, [csv.points, effective]);

  const overridden =
    effective.period_years !== cycle.period_years ||
    effective.reference_peak_year !== cycle.reference_peak_year;

  const about = (
    <div className="space-y-2.5">
      <p className="font-display-italic text-[16px] leading-snug text-ink/85">
        {cycle.short_description}
      </p>
      <p className="text-[12px] leading-relaxed text-ink-soft">
        <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft/80 mr-1">
          Peak calibration —
        </span>
        {cycle.reference_peak_rationale}
      </p>
      {cycle.caveat && (
        <p className="text-[12px] leading-relaxed text-ink/85 border-l-2 border-ink/40 pl-2.5 mt-1.5">
          <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft mr-1">
            Caveat —
          </span>
          <span className="font-display-italic">{cycle.caveat}</span>
        </p>
      )}
      <p className="text-[11px] tracking-wide text-ink-soft/75 font-mono pt-1">
        {cycle.source}
      </p>
      {/* The focused facet is where a reader actually reads the rationale
          and caveat, and it had no way through to /cycles/<slug> — the
          page with the extrema, paired-series provenance, spectral verdict
          and reuse packet. The only other in-chart link was buried in the
          calibration drawer. */}
      <p className="pt-1">
        <Link
          href={cycleRoutePath(cycle)}
          className="text-[12px] uppercase tracking-[0.16em] font-mono text-ink underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
        >
          Full page →
        </Link>
      </p>
    </div>
  );

  const controls = (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-[0.28em] text-ink-soft font-medium">
          Calibrate
        </span>
        <button
          type="button"
          onClick={onReset}
          disabled={!overridden}
          className="text-[11px] text-ink-soft hover:text-ink underline decoration-ink-soft/40 underline-offset-[3px] disabled:text-ink-soft/30 disabled:no-underline transition-colors"
        >
          reset to published
        </button>
      </div>
      <SliderRow
        label="Reference peak year"
        value={effective.reference_peak_year}
        published={cycle.reference_peak_year}
        min={peakMin}
        max={peakMax}
        step={1}
        formatValue={(v) => String(v)}
        onChange={(v) =>
          onChange({ ...override, reference_peak_year: v })
        }
      />
      <SliderRow
        label="Period (years)"
        value={effective.period_years}
        published={cycle.period_years}
        min={periodMin}
        max={periodMax}
        step={1}
        formatValue={(v) => `${v}y`}
        onChange={(v) => onChange({ ...override, period_years: v })}
      />
      <div
        aria-live="polite"
        className="border-t border-rule/25 pt-2.5 mt-1"
      >
        <div className="flex items-baseline justify-between gap-2 text-[11px]">
          <span className="text-ink-soft uppercase tracking-[0.18em]">
            Pearson r · vs. {series.name}
          </span>
          <span
            className="font-display text-[20px] tabular-nums tracking-tight"
            style={{ color: cycle.color }}
          >
            {csv.loading
              ? "…"
              : csv.error
                ? "n/a"
                : correlation !== null
                  ? correlation.toFixed(3)
                  : "—"}
          </span>
        </div>
        {/* r always uses every row of the series, not the brushed window the
            chart shows — say so, or a narrowed chart reads as r's scope.
            The deleted CalibrationPanel carried this; restored 2026-09-28
            on Codex review. */}
        {csv.points.length > 0 && (
          <p className="mt-1 text-[11px] text-ink-soft/80 font-mono tabular-nums">
            {`full record ${csv.points[0].year}–${
              csv.points[csv.points.length - 1].year
            } · n=${csv.points.length}`}
          </p>
        )}
        <p className="mt-1 text-[11px] text-ink-soft/70 italic">
          Diagnostic, not a test statistic. See{" "}
          <a
            href="/methods"
            className="underline decoration-ink-soft/40 underline-offset-[2px] hover:decoration-ink-soft"
          >
            methods
          </a>
          .
        </p>
      </div>
    </div>
  );

  // Moved in the DOM, not with CSS `order`, so focus and reading order match
  // what is seen (same rule as Viz's chart-first move, 2026-09-21).
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 text-sm border-t border-rule/30 pt-4">
      {controlsFirst ? controls : about}
      {controlsFirst ? about : controls}
    </div>
  );
}

function SliderRow({
  label,
  value,
  published,
  min,
  max,
  step,
  formatValue,
  onChange,
}: {
  label: string;
  value: number;
  published: number;
  min: number;
  max: number;
  step: number;
  formatValue: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft font-medium">
          {label}
        </span>
        <span className="font-display text-[20px] tabular-nums text-ink leading-none">
          {formatValue(value)}
          {value !== published && (
            <span className="ml-1.5 text-ink-soft/65 text-[11px] font-mono">
              published {formatValue(published)}
            </span>
          )}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        aria-label={label}
      />
      <div className="flex justify-between text-[11px] text-ink-soft/55 font-mono">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </label>
  );
}
