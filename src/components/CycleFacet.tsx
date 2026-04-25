"use client";

import { useMemo, useRef } from "react";
import { line as d3Line, curveCatmullRom, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Cycle, DataSeries } from "@/data/types";
import {
  phasePosition,
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
        "relative w-full rounded-md border transition-[opacity,padding] duration-150",
        FACET_MIN_HEIGHT_CLASS[mode],
        mode === "expanded"
          ? "border-foreground/30 bg-foreground/[0.04] p-3"
          : mode === "collapsed"
            ? "border-foreground/5 px-2 py-0.5 opacity-70"
            : "border-foreground/10 bg-foreground/[0.015] p-2"
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
  return (
    <div className="flex items-center justify-between gap-3 min-w-0">
      <button
        type="button"
        onClick={mode === "expanded" ? onBlur : onFocus}
        aria-expanded={mode === "expanded"}
        className="flex items-center gap-2 min-w-0 flex-1 text-left rounded px-1 py-0.5 hover:bg-foreground/5 focus:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20"
      >
        <span
          aria-hidden
          className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
          style={{ backgroundColor: cycle.color }}
        />
        <span
          className={cn(
            "font-semibold truncate",
            mode === "collapsed" ? "text-xs" : "text-sm"
          )}
        >
          {cycle.name}
        </span>
        {mode !== "collapsed" && (
          <span className="hidden sm:inline text-xs text-foreground/50 font-mono whitespace-nowrap">
            {effective.period_years}y · peak {effective.reference_peak_year}
            {overridden && " · cal"}
          </span>
        )}
      </button>
      <span
        className={cn(
          "text-xs font-mono uppercase tracking-wide whitespace-nowrap",
          mode === "collapsed" ? "text-foreground/40" : "text-foreground/60"
        )}
        aria-label={`Phase position: ${phaseLabel}`}
      >
        {phaseLabel}
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
    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="space-y-3">
        <div>
          <p className="text-foreground/70">{cycle.short_description}</p>
          <p className="mt-2 text-foreground/55 italic text-xs">
            Peak calibration: {cycle.reference_peak_rationale}
          </p>
          {cycle.caveat && (
            <p className="mt-2 text-amber-700 dark:text-amber-400 text-xs">
              <strong>Caveat:</strong> {cycle.caveat}
            </p>
          )}
          <p className="mt-2 text-foreground/45 text-xs">{cycle.source}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wide text-foreground/55 font-medium">
            Calibrate
          </span>
          <button
            type="button"
            onClick={onReset}
            disabled={!overridden}
            className="text-xs text-foreground/70 hover:text-foreground underline underline-offset-2 disabled:text-foreground/30 disabled:no-underline"
          >
            reset
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
          className="flex items-baseline gap-2 text-xs text-foreground/65"
        >
          <span>Pearson r vs. {series.name}:</span>
          <span className="font-mono text-foreground text-sm font-semibold">
            {csv.loading
              ? "…"
              : csv.error
                ? "n/a"
                : correlation !== null
                  ? correlation.toFixed(3)
                  : "—"}
          </span>
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
        <span className="text-foreground/80">{label}</span>
        <span className="font-mono text-foreground">
          {formatValue(value)}
          {value !== published && (
            <span className="ml-1 text-foreground/45 text-xs">
              (published: {formatValue(published)})
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
      <div className="flex justify-between text-xs text-foreground/40 font-mono">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </label>
  );
}

// Re-export for tests / external use
export { phasePosition };
