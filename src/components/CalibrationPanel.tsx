"use client";

import { useMemo } from "react";
import type { Cycle, DataSeries } from "@/data/types";
import { sineAtYear } from "@/lib/cycleMath";
import { pearsonCorrelation } from "@/lib/seriesMath";
import { useCsvSeries } from "@/lib/useCsvSeries";
import type { CycleOverride } from "./CycleOverlay";

interface CalibrationPanelProps {
  cycle: Cycle;
  series: DataSeries;
  override: CycleOverride;
  onChange: (override: CycleOverride) => void;
  onReset: () => void;
}

export default function CalibrationPanel({
  cycle,
  series,
  override,
  onChange,
  onReset,
}: CalibrationPanelProps) {
  const peak = override.reference_peak_year ?? cycle.reference_peak_year;
  const period = override.period_years ?? cycle.period_years;

  const peakMin = cycle.reference_peak_year - 30;
  const peakMax = cycle.reference_peak_year + 30;
  const periodMin = Math.round(cycle.period_years * 0.75);
  const periodMax = Math.round(cycle.period_years * 1.25);

  const { points, loading, error } = useCsvSeries(
    series.data_file,
    series.year_column,
    series.value_column,
    series.transform
  );

  const correlation = useMemo(() => {
    if (points.length < 2) return null;
    const effective: Cycle = {
      ...cycle,
      reference_peak_year: peak,
      period_years: period,
    };
    const seriesVals = points.map((p) => p.value);
    const cycleVals = points.map((p) => sineAtYear(effective, p.year));
    return pearsonCorrelation(seriesVals, cycleVals);
  }, [points, cycle, peak, period]);

  const overlapRange = useMemo(() => {
    if (points.length === 0) return null;
    return { start: points[0].year, end: points[points.length - 1].year };
  }, [points]);

  const overridden =
    peak !== cycle.reference_peak_year || period !== cycle.period_years;

  return (
    <div className="rounded-lg border border-foreground/15 p-4 bg-foreground/[0.02]">
      <div className="flex items-baseline justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-base font-semibold">
            Calibrate · {cycle.name}
          </h2>
          <p className="text-xs text-foreground/60 mt-0.5">
            vs. {series.name}
            {overlapRange &&
              ` · overlap ${overlapRange.start}–${overlapRange.end}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={!overridden}
          className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-2 disabled:text-foreground/30 disabled:no-underline"
        >
          reset to published
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <SliderRow
          label="Reference peak year"
          value={peak}
          min={peakMin}
          max={peakMax}
          step={1}
          onChange={(v) => onChange({ ...override, reference_peak_year: v })}
          formatValue={(v) => String(v)}
          publishedValue={cycle.reference_peak_year}
        />
        <SliderRow
          label="Period (years)"
          value={period}
          min={periodMin}
          max={periodMax}
          step={1}
          onChange={(v) => onChange({ ...override, period_years: v })}
          formatValue={(v) => `${v}y`}
          publishedValue={cycle.period_years}
        />
      </div>

      <div
        aria-live="polite"
        className="mt-4 flex items-baseline gap-3 flex-wrap"
      >
        <span className="text-sm text-foreground/70">
          Pearson r (cycle vs. series, deliberately crude):
        </span>
        <span
          className="font-mono text-lg font-semibold"
          title="Pearson correlation is the wrong tool for cyclic data. The point of exposing it is to let you see how much the calibration choice is doing, not to claim statistical validity. See /methods."
        >
          {loading && "—"}
          {error && "data unavailable"}
          {!loading && !error && correlation !== null && correlation.toFixed(3)}
          {!loading && !error && correlation === null && "n/a"}
        </span>
      </div>
      <p className="mt-1 text-xs text-foreground/50">
        Pearson is the wrong tool for cyclic data — see{" "}
        <a href="/methods" className="underline underline-offset-2">
          methods
        </a>
        . Treat this as a rough sensitivity lever, not a statistical test.
      </p>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  publishedValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  formatValue: (v: number) => string;
  publishedValue: number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-foreground/80">{label}</span>
        <span className="font-mono text-foreground">
          {formatValue(value)}
          {value !== publishedValue && (
            <span className="ml-1 text-foreground/50 text-xs">
              (published: {formatValue(publishedValue)})
            </span>
          )}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-foreground"
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-foreground/40 font-mono">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </label>
  );
}
