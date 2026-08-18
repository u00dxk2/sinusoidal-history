"use client";

import { useMemo, useRef } from "react";
import { line as d3Line, curveCatmullRom, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Cycle, DataSeries } from "@/data/types";
import {
  phasePositionLabel,
  type PhasePositionLabel,
} from "@/lib/cycleMath";
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
      className={cn(
        "relative w-full rounded-sm border transition-[opacity,padding] duration-150",
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
        overridden={overridden}
        onFocus={onFocus}
        onBlur={onBlur}
      />

      {mode !== "collapsed" && series && (
        <FacetLegend cycle={cycle} series={series} />
      )}

      {mode !== "collapsed" && (
        <FacetChart
          cycle={effective}
          series={series}
          width={width}
          height={mode === "expanded" ? 220 : width < 640 ? 60 : 84}
          startYear={startYear}
          endYear={endYear}
          currentYear={currentYear}
          interactive={mode === "expanded"}
        />
      )}

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
  overridden,
  onFocus,
  onBlur,
}: {
  cycle: Cycle;
  effective: Cycle;
  mode: FacetMode;
  phaseLabel: PhasePositionLabel;
  overridden: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  // For mobile readability, take the bit before the em-dash if the name is
  // long. Khaldun → "Ibn Khaldun"; Carlota Perez → "Carlota Perez"; etc.
  const shortName =
    cycle.name.length > 22 && cycle.name.includes("—")
      ? cycle.name.split("—")[0].trim()
      : cycle.name;
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
      <button
        type="button"
        onClick={mode === "expanded" ? onBlur : onFocus}
        aria-expanded={mode === "expanded"}
        className="flex items-center gap-2.5 min-w-0 flex-1 text-left rounded-sm px-1 py-0.5 min-h-11 hover:bg-ink/[0.04] focus-visible:bg-ink/[0.04]"
      >
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
      </button>
      <span
        className={cn(
          "text-[11px] sm:text-[11px] font-mono uppercase tracking-[0.18em] whitespace-nowrap flex-shrink-0",
          mode === "collapsed" ? "opacity-60" : ""
        )}
        style={{ color: cycle.color }}
        aria-label={`Phase position: ${phaseLabel}`}
      >
        {phaseLabel}
      </span>
    </div>
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
}: {
  cycle: Cycle;
  series: DataSeries | undefined;
  width: number;
  height: number;
  startYear: number;
  endYear: number;
  currentYear: number;
  interactive: boolean;
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
}: {
  cycle: Cycle;
  effective: Cycle;
  series: DataSeries;
  override: { period_years?: number; reference_peak_year?: number };
  onChange: (
    o: { period_years?: number; reference_peak_year?: number }
  ) => void;
  onReset: () => void;
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

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 text-sm border-t border-rule/30 pt-4">
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
      </div>
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
