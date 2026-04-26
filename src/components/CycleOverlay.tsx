"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { scaleLinear } from "d3-scale";
import { line as d3Line, curveCatmullRom, curveMonotoneX } from "d3-shape";
import type { Cycle, DataSeries, PhasePosition } from "@/data/types";
import { sineAtYear, phasePosition } from "@/lib/cycleMath";
import { normalizeSeries, type SeriesPoint } from "@/lib/seriesMath";
import { useCsvSeries } from "@/lib/useCsvSeries";
import { DEFAULT_YEAR_RANGE } from "@/lib/siteConfig";
import { useContainerWidth } from "@/lib/hooks";

export interface CycleOverride {
  period_years?: number;
  reference_peak_year?: number;
}

interface CycleOverlayProps {
  cycles: Cycle[];
  dataSeries?: DataSeries[];
  cycleOverrides?: Record<string, CycleOverride>;
  currentYear?: number;
  startYear?: number;
  endYear?: number;
}

const DEFAULT_HEIGHT = 500;
const MARGIN = { top: 24, right: 24, bottom: 44, left: 24 };
const SAMPLE_STEP = 0.5;

function phaseLabel(p: PhasePosition): string {
  return p;
}

function applyOverride(c: Cycle, ov?: CycleOverride): Cycle {
  if (!ov) return c;
  return {
    ...c,
    period_years: ov.period_years ?? c.period_years,
    reference_peak_year: ov.reference_peak_year ?? c.reference_peak_year,
  };
}

export default function CycleOverlay({
  cycles,
  dataSeries = [],
  cycleOverrides = {},
  currentYear = new Date().getFullYear(),
  startYear = DEFAULT_YEAR_RANGE.start,
  endYear = DEFAULT_YEAR_RANGE.end,
}: CycleOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef);
  const height = DEFAULT_HEIGHT;

  const effectiveCycles = useMemo(
    () => cycles.map((c) => applyOverride(c, cycleOverrides[c.id])),
    [cycles, cycleOverrides]
  );

  const [activeCycleIds, setActiveCycleIds] = useState<Set<string>>(
    () => new Set(cycles.map((c) => c.id))
  );
  const [activeSeriesIds, setActiveSeriesIds] = useState<Set<string>>(
    () => new Set(dataSeries.map((s) => s.id))
  );
  const [hoveredCycleId, setHoveredCycleId] = useState<string | null>(null);
  const [hoveredSeriesId, setHoveredSeriesId] = useState<string | null>(null);
  const [seriesHoverPoint, setSeriesHoverPoint] = useState<{
    seriesId: string;
    year: number;
    raw: number;
  } | null>(null);
  const [pinnedYear, setPinnedYear] = useState<number | null>(null);

  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(
    () => scaleLinear().domain([startYear, endYear]).range([0, innerWidth]),
    [startYear, endYear, innerWidth]
  );

  const yScale = useMemo(
    () => scaleLinear().domain([-1.2, 1.2]).range([innerHeight, 0]),
    [innerHeight]
  );

  const cyclePaths = useMemo(() => {
    const lineGen = d3Line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    return effectiveCycles.map((cycle) => {
      const points: { year: number; value: number }[] = [];
      for (let y = startYear; y <= endYear; y += SAMPLE_STEP) {
        points.push({ year: y, value: sineAtYear(cycle, y) });
      }
      return { cycle, d: lineGen(points) ?? "" };
    });
  }, [effectiveCycles, xScale, yScale, startYear, endYear]);

  const tickYears = useMemo(() => {
    const ticks: number[] = [];
    const step = innerWidth < 500 ? 100 : 50;
    for (let y = startYear; y <= endYear; y += step) ticks.push(y);
    return ticks;
  }, [startYear, endYear, innerWidth]);

  const toggleCycle = useCallback((id: string) => {
    setActiveCycleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSeries = useCallback((id: string) => {
    setActiveSeriesIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAxisClick = useCallback(
    (e: React.MouseEvent<SVGRectElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const year = Math.round(xScale.invert(x));
      if (year < startYear || year > endYear) return;
      setPinnedYear((prev) => (prev === year ? null : year));
    },
    [xScale, startYear, endYear]
  );

  const hoveredCycle = hoveredCycleId !== null;

  return (
    <div ref={containerRef} className="w-full">
      <CycleLegend
        cycles={cycles}
        activeIds={activeCycleIds}
        hoveredId={hoveredCycleId}
        onToggle={toggleCycle}
        onHover={setHoveredCycleId}
      />

      <svg
        role="img"
        aria-label="Overlay of historical cycle theories and data series from 1600 to 2050"
        width={width}
        height={height}
        className="block"
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          <line
            x1={0}
            x2={innerWidth}
            y1={yScale(0)}
            y2={yScale(0)}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeDasharray="4 4"
          />

          {tickYears.map((y) => (
            <g key={y} transform={`translate(${xScale(y)},0)`}>
              <line
                y1={0}
                y2={innerHeight}
                stroke="currentColor"
                strokeOpacity={0.06}
              />
              <text
                y={innerHeight + 22}
                textAnchor="middle"
                className="fill-current text-[11px] opacity-60 font-mono"
              >
                {y}
              </text>
            </g>
          ))}

          {cyclePaths.map(({ cycle, d }) => {
            if (!activeCycleIds.has(cycle.id)) return null;
            const isHovered = hoveredCycleId === cycle.id;
            const opacity = hoveredCycle ? (isHovered ? 1 : 0.15) : 0.7;
            const strokeWidth = isHovered ? 3.5 : 2.5;
            return (
              <g key={cycle.id}>
                <title>{`${cycle.name} (period ${cycle.period_years}y)`}</title>
                <path
                  d={d}
                  fill="none"
                  stroke={cycle.color}
                  strokeWidth={strokeWidth}
                  strokeOpacity={opacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  onMouseEnter={() => setHoveredCycleId(cycle.id)}
                  onMouseLeave={() => setHoveredCycleId(null)}
                  onFocus={() => setHoveredCycleId(cycle.id)}
                  onBlur={() => setHoveredCycleId(null)}
                  tabIndex={0}
                  style={{ cursor: "pointer", outline: "none" }}
                  aria-label={`${cycle.name} curve`}
                />
              </g>
            );
          })}

          {dataSeries.map((series) => (
            <DataSeriesPath
              key={series.id}
              series={series}
              active={activeSeriesIds.has(series.id)}
              hovered={hoveredSeriesId === series.id}
              anyHovered={hoveredSeriesId !== null}
              xScale={xScale}
              yScale={yScale}
              startYear={startYear}
              endYear={endYear}
              onHoverPoint={(year, raw) =>
                setSeriesHoverPoint({ seriesId: series.id, year, raw })
              }
              onHover={(h) => {
                setHoveredSeriesId(h ? series.id : null);
                if (!h) setSeriesHoverPoint(null);
              }}
            />
          ))}

          <line
            x1={xScale(currentYear)}
            x2={xScale(currentYear)}
            y1={0}
            y2={innerHeight}
            stroke="#e11d48"
            strokeWidth={1.5}
            strokeOpacity={0.8}
          />
          <text
            x={xScale(currentYear)}
            y={-6}
            textAnchor="middle"
            className="fill-[#e11d48] text-[11px] font-medium font-mono"
          >
            now · {currentYear}
          </text>

          {pinnedYear !== null && (
            <line
              x1={xScale(pinnedYear)}
              x2={xScale(pinnedYear)}
              y1={0}
              y2={innerHeight}
              stroke="currentColor"
              strokeWidth={1}
              strokeOpacity={0.6}
              strokeDasharray="2 3"
            />
          )}

          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onClick={handleAxisClick}
            style={{ cursor: "crosshair" }}
            aria-label="Click any year to pin an info panel"
          />
        </g>
      </svg>

      {dataSeries.length > 0 && (
        <SeriesLegend
          series={dataSeries}
          activeIds={activeSeriesIds}
          hoveredId={hoveredSeriesId}
          onToggle={toggleSeries}
          onHover={setHoveredSeriesId}
        />
      )}

      {hoveredCycleId !== null && (
        <HoverInfo
          cycle={effectiveCycles.find((c) => c.id === hoveredCycleId)!}
          originalCycle={cycles.find((c) => c.id === hoveredCycleId)!}
          currentYear={currentYear}
        />
      )}

      {seriesHoverPoint && hoveredSeriesId && (
        <SeriesHoverInfo
          series={dataSeries.find((s) => s.id === hoveredSeriesId)!}
          year={seriesHoverPoint.year}
          raw={seriesHoverPoint.raw}
        />
      )}

      {pinnedYear !== null && (
        <PinnedYearPanel
          year={pinnedYear}
          cycles={effectiveCycles.filter((c) => activeCycleIds.has(c.id))}
          onClose={() => setPinnedYear(null)}
        />
      )}
    </div>
  );
}

interface DataSeriesPathProps {
  series: DataSeries;
  active: boolean;
  hovered: boolean;
  anyHovered: boolean;
  xScale: (y: number) => number;
  yScale: (v: number) => number;
  startYear: number;
  endYear: number;
  onHoverPoint: (year: number, raw: number) => void;
  onHover: (hovered: boolean) => void;
}

function DataSeriesPath({
  series,
  active,
  hovered,
  anyHovered,
  xScale,
  yScale,
  startYear,
  endYear,
  onHoverPoint,
  onHover,
}: DataSeriesPathProps) {
  const { points, loading, error } = useCsvSeries(
    series.data_file,
    series.year_column,
    series.value_column,
    series.transform
  );

  const visiblePoints = useMemo(
    () => points.filter((p) => p.year >= startYear && p.year <= endYear),
    [points, startYear, endYear]
  );

  const normalized = useMemo(
    () => normalizeSeries(visiblePoints),
    [visiblePoints]
  );

  const pathD = useMemo(() => {
    const lineGen = d3Line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(curveMonotoneX);
    return lineGen(normalized) ?? "";
  }, [normalized, xScale, yScale]);

  if (!active || loading || error || normalized.length === 0) return null;

  const opacity = anyHovered ? (hovered ? 0.95 : 0.15) : 0.6;
  const strokeWidth = hovered ? 2.2 : 1.5;

  return (
    <g>
      <title>{series.name}</title>
      <path
        d={pathD}
        fill="none"
        stroke={series.color}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        style={{ cursor: "pointer" }}
        aria-label={`${series.name} data`}
      />
      {hovered &&
        normalized.map((p) => (
          <circle
            key={p.year}
            cx={xScale(p.year)}
            cy={yScale(p.value)}
            r={2.5}
            fill={series.color}
            fillOpacity={0.6}
            onMouseEnter={() => onHoverPoint(p.year, p.raw)}
          />
        ))}
    </g>
  );
}

interface CycleLegendProps {
  cycles: Cycle[];
  activeIds: Set<string>;
  hoveredId: string | null;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
}

function CycleLegend({
  cycles,
  activeIds,
  hoveredId,
  onToggle,
  onHover,
}: CycleLegendProps) {
  return (
    <div
      className="flex flex-wrap gap-2 mb-3"
      role="group"
      aria-label="Cycle toggles"
    >
      <span className="text-xs font-medium text-foreground/50 self-center mr-1 uppercase tracking-wide">
        Cycles
      </span>
      {cycles.map((cycle) => {
        const active = activeIds.has(cycle.id);
        const highlighted = hoveredId === cycle.id;
        return (
          <button
            key={cycle.id}
            type="button"
            onClick={() => onToggle(cycle.id)}
            onMouseEnter={() => active && onHover(cycle.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => active && onHover(cycle.id)}
            onBlur={() => onHover(null)}
            aria-pressed={active}
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition ${
              active
                ? "border-foreground/20 bg-foreground/5"
                : "border-foreground/10 text-foreground/40 bg-transparent"
            } ${highlighted ? "ring-2 ring-foreground/30" : ""}`}
          >
            <span
              aria-hidden
              className="inline-block w-3 h-3 rounded-sm"
              style={{
                backgroundColor: active ? cycle.color : "transparent",
                border: `1.5px solid ${cycle.color}`,
              }}
            />
            <span className="font-medium">{cycle.name}</span>
            <span className="text-foreground/50 font-mono text-xs">
              {cycle.period_years}y
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface SeriesLegendProps {
  series: DataSeries[];
  activeIds: Set<string>;
  hoveredId: string | null;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
}

function SeriesLegend({
  series,
  activeIds,
  hoveredId,
  onToggle,
  onHover,
}: SeriesLegendProps) {
  return (
    <div
      className="mt-3 flex flex-wrap gap-2"
      role="group"
      aria-label="Data series toggles"
    >
      <span className="text-xs font-medium text-foreground/50 self-center mr-1 uppercase tracking-wide">
        Data
      </span>
      {series.map((s) => (
        <SeriesLegendItem
          key={s.id}
          series={s}
          active={activeIds.has(s.id)}
          highlighted={hoveredId === s.id}
          onToggle={() => onToggle(s.id)}
          onHover={(h) => onHover(h ? s.id : null)}
        />
      ))}
    </div>
  );
}

function SeriesLegendItem({
  series,
  active,
  highlighted,
  onToggle,
  onHover,
}: {
  series: DataSeries;
  active: boolean;
  highlighted: boolean;
  onToggle: () => void;
  onHover: (h: boolean) => void;
}) {
  const { loading, error } = useCsvSeries(
    series.data_file,
    series.year_column,
    series.value_column,
    series.transform
  );
  const unavailable = !loading && error !== null;
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={() => active && !unavailable && onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => active && !unavailable && onHover(true)}
      onBlur={() => onHover(false)}
      aria-pressed={active}
      aria-disabled={unavailable}
      disabled={unavailable}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition ${
        active && !unavailable
          ? "border-foreground/20 bg-foreground/5"
          : "border-foreground/10 text-foreground/40 bg-transparent"
      } ${highlighted ? "ring-2 ring-foreground/30" : ""} ${
        unavailable ? "cursor-not-allowed" : ""
      }`}
      title={unavailable ? `data unavailable: ${error}` : series.source}
    >
      <span
        aria-hidden
        className="inline-block w-3 h-0.5 rounded-sm"
        style={{ backgroundColor: series.color, height: "2px" }}
      />
      <span className="font-medium">{series.name}</span>
      {loading && (
        <span className="text-foreground/40 text-xs">loading…</span>
      )}
      {unavailable && (
        <span className="text-amber-600 text-xs">data unavailable</span>
      )}
    </button>
  );
}

function HoverInfo({
  cycle,
  originalCycle,
  currentYear,
}: {
  cycle: Cycle;
  originalCycle: Cycle;
  currentYear: number;
}) {
  const pos = phasePosition(cycle, currentYear);
  const overridden =
    cycle.period_years !== originalCycle.period_years ||
    cycle.reference_peak_year !== originalCycle.reference_peak_year;
  return (
    <div
      role="status"
      className="mt-3 rounded-md border border-foreground/10 bg-foreground/[0.03] p-3 text-sm"
    >
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          aria-hidden
          className="inline-block w-2.5 h-2.5 rounded-sm"
          style={{ backgroundColor: cycle.color }}
        />
        <span className="font-semibold">{cycle.name}</span>
        <span className="text-foreground/60 font-mono text-xs">
          period {cycle.period_years}y · currently {phaseLabel(pos)}
          {overridden ? " · calibrated" : ""}
        </span>
      </div>
      <p className="mt-1 text-foreground/80">{cycle.short_description}</p>
      <p className="mt-1 text-foreground/50 text-xs italic">{cycle.source}</p>
    </div>
  );
}

function SeriesHoverInfo({
  series,
  year,
  raw,
}: {
  series: DataSeries;
  year: number;
  raw: number;
}) {
  return (
    <div
      role="status"
      className="mt-3 rounded-md border border-foreground/10 bg-foreground/[0.03] p-3 text-sm font-mono"
    >
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          aria-hidden
          className="inline-block w-2.5 h-2.5 rounded-sm"
          style={{ backgroundColor: series.color }}
        />
        <span className="font-semibold">{series.name}</span>
        <span>{year}</span>
        <span>
          {raw.toFixed(3)} {series.value_units}
        </span>
      </div>
    </div>
  );
}

function PinnedYearPanel({
  year,
  cycles,
  onClose,
}: {
  year: number;
  cycles: Cycle[];
  onClose: () => void;
}) {
  return (
    <div className="mt-4 rounded-lg border border-foreground/15 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold font-mono">{year}</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-foreground/60 hover:text-foreground underline underline-offset-2"
          aria-label="Close pinned year panel"
        >
          close
        </button>
      </div>
      {cycles.length === 0 ? (
        <p className="mt-2 text-sm text-foreground/60">
          No cycles are currently active — toggle at least one in the legend
          above.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {cycles.map((cycle) => {
            const pos = phasePosition(cycle, year);
            const value = sineAtYear(cycle, year);
            return (
              <li key={cycle.id} className="text-sm">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    aria-hidden
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: cycle.color }}
                  />
                  <span className="font-semibold">{cycle.name}</span>
                  <span className="text-foreground/60 font-mono text-xs">
                    {phaseLabel(pos)} (amplitude {value.toFixed(2)})
                  </span>
                </div>
                <p className="mt-0.5 text-foreground/70 pl-4">
                  {cycle.short_description}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Re-export for tests / external use.
export type { SeriesPoint };
