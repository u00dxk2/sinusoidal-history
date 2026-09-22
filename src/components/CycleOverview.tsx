"use client";

import { useCallback, useMemo, useRef } from "react";
import { line as d3Line, curveCatmullRom } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Cycle } from "@/data/types";
import { phasePositionLabel, sineAtYear } from "@/lib/cycleMath";
import { cycleTheorist } from "@/lib/cycleRoutes";
import {
  useContainerWidth,
  useCycleValues,
  useTimeScale,
  type LinearScale,
} from "@/lib/hooks";

// All ten cycles, one thin row each, on the same time axis as the facets —
// the picture the H1 names, sized to a phone's first screen. At 390x664 a
// facet card is ~148px tall, so the facets alone put one curve above the
// fold; ten 24px rows put all ten there. The rows are a FIGURE, not
// controls: a 24px row cannot meet the 44px tap floor (canon R28), so the
// tap instruction lives in the caption beside the cards that take the tap.
// Gate, one row at a time: `node scripts/measure-fold.mjs <url> 390 664
// '[data-overview-id="<id>"] svg'`. 2026-09-22.

const NAME_COL = 104;
const ROW_H = 24;
// Horizontal inset so the now-dot and the curve's stroke are not clipped at
// either end of the row.
const PAD = 3;
// Half the rendered width of a four-digit year label at 11px mono — keeps a
// label centred on an edge tick from overflowing the page.
const LABEL_HALF = 16;

interface CycleOverviewProps {
  cycles: Cycle[];
  currentYear: number;
  startYear: number;
  endYear: number;
  /** False when the facets are not the open tab, so "each in detail below"
      would point at nothing. */
  detailBelow: boolean;
}

export default function CycleOverview({
  cycles,
  currentYear,
  startYear,
  endYear,
  detailBelow,
}: CycleOverviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(ref, 358);
  const chartWidth = Math.max(0, width - NAME_COL);
  const innerWidth = Math.max(0, chartWidth - PAD * 2);
  const xScale = useTimeScale(startYear, endYear, innerWidth);
  const nowVisible = currentYear >= startYear && currentYear <= endYear;
  const nowX = xScale(currentYear) + PAD;

  const place = useCallback(
    (x: number) => Math.min(Math.max(x, LABEL_HALF), chartWidth - LABEL_HALF),
    [chartWidth]
  );

  // Spacing is judged on PLACED positions: an edge label clamped inward can
  // land on its neighbour even when the raw ticks are far apart (320px phone,
  // default range: "16001700"). The now label is kept first; each tick after
  // it survives only if it clears every label already kept.
  const ticks = useMemo(() => {
    const kept: number[] = nowVisible ? [place(nowX)] : [];
    const out: { year: number; x: number }[] = [];
    for (const year of xScale.ticks(4).filter((t) => Number.isInteger(t))) {
      const x = place(xScale(year) + PAD);
      if (kept.every((k) => Math.abs(x - k) >= LABEL_HALF * 2)) {
        kept.push(x);
        out.push({ year, x });
      }
    }
    return out;
  }, [xScale, nowVisible, nowX, place]);

  return (
    <figure ref={ref} aria-labelledby="cycle-overview-title" className="m-0">
      <figcaption
        id="cycle-overview-title"
        className="text-[11px] uppercase tracking-[0.18em] font-mono text-ink-soft mb-2"
      >
        Every cycle, at a glance
      </figcaption>
      <ul className="list-none m-0 p-0">
        {cycles.map((cycle) => (
          <OverviewRow
            key={cycle.id}
            cycle={cycle}
            chartWidth={chartWidth}
            xScale={xScale}
            startYear={startYear}
            endYear={endYear}
            currentYear={currentYear}
            nowVisible={nowVisible}
            nowX={nowX}
          />
        ))}
      </ul>
      <div aria-hidden className="relative h-4 mt-1" style={{ marginLeft: NAME_COL }}>
        {ticks.map((t) => (
          <span
            key={t.year}
            className="absolute top-0 -translate-x-1/2 font-mono text-[11px] leading-4 tabular-nums text-ink-soft/80"
            style={{ left: t.x }}
          >
            {t.year}
          </span>
        ))}
        {nowVisible && (
          <span
            className="absolute top-0 -translate-x-1/2 font-mono text-[11px] leading-4 tabular-nums text-ink font-medium"
            style={{ left: place(nowX) }}
          >
            {currentYear}
          </span>
        )}
      </div>
      {detailBelow && (
        <p className="mt-2 text-[13px] leading-snug italic font-display-italic text-ink-soft">
          Each in detail below — tap one to focus and calibrate.
        </p>
      )}
    </figure>
  );
}

function OverviewRow({
  cycle,
  chartWidth,
  xScale,
  startYear,
  endYear,
  currentYear,
  nowVisible,
  nowX,
}: {
  cycle: Cycle;
  chartWidth: number;
  xScale: LinearScale;
  startYear: number;
  endYear: number;
  currentYear: number;
  nowVisible: boolean;
  nowX: number;
}) {
  const yScale = useMemo(
    () => scaleLinear().domain([-1, 1]).range([ROW_H - 4, 4]),
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

  const theorist = cycleTheorist(cycle);
  // The same function the path samples, so the dot sits on the drawn curve.
  const nowY = yScale(sineAtYear(cycle, currentYear));

  return (
    <li
      data-overview-id={cycle.id}
      className="flex items-center"
      style={{ height: ROW_H }}
    >
      {/* The visible name is the readable text, so a screen reader's
          explore-by-touch finds it; the reading the curve shows follows it
          as sr-only text. */}
      <span
        className="flex items-center gap-2 pr-2 min-w-0 flex-shrink-0 self-stretch"
        style={{ width: NAME_COL }}
      >
        <span
          aria-hidden
          className="block w-[3px] h-3.5 flex-shrink-0 rounded-full"
          style={{ backgroundColor: cycle.color }}
        />
        <span className="font-display text-[12px] leading-none tracking-tight text-ink truncate">
          {theorist}
          <span className="sr-only">
            {` (${cycle.period_years}-year cycle): ${phasePositionLabel(cycle, currentYear)} in ${currentYear}.`}
          </span>
        </span>
      </span>
      <svg
        aria-hidden
        width={chartWidth}
        height={ROW_H}
        className="block flex-shrink-0"
      >
        {nowVisible && (
          <line
            x1={nowX}
            x2={nowX}
            y1={0}
            y2={ROW_H}
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.35}
            strokeDasharray="2 3"
          />
        )}
        <g transform={`translate(${PAD},0)`}>
          <path
            d={path}
            fill="none"
            stroke={cycle.color}
            strokeWidth={1.5}
            strokeOpacity={0.85}
            strokeLinecap="round"
          />
        </g>
        {nowVisible && (
          <circle cx={nowX} cy={nowY} r={3} fill={cycle.color} />
        )}
      </svg>
    </li>
  );
}
