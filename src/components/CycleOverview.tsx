"use client";

import { useCallback, useMemo, useRef } from "react";
import { line as d3Line, curveCatmullRom } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Cycle } from "@/data/types";
import { cycleTheorist } from "@/lib/cycleRoutes";
import { glanceVerdictLine, overviewRowReading } from "@/lib/overviewReading";
import {
  useContainerWidth,
  useCycleValues,
  useTimeScale,
  type LinearScale,
} from "@/lib/hooks";

// All ten cycles, one thin row each, on the same time axis as the facets —
// the picture the H1 names, sized to a phone's first screen. At 390x664 a
// facet card is ~148px tall, so the facets alone put one curve above the
// fold; ten 24px rows put all ten there. Gate, one row at a time:
// `node scripts/measure-fold.mjs <url> 390 664 '[data-overview-id="<id>"] svg'`.
// 2026-09-22.
//
// Each row is a button that opens that cycle's card (I-046, 2026-10-21). The
// rows were a figure, not controls, because a 24px row cannot meet the 44px
// house tap floor (canon R28) — but the I-045 walk tapped "Ray Dalio" first
// and got nothing, and the caption under the figure says "tap one". A
// full-width 24px row meets WCAG 2.2 AA's 24x24 minimum (2.5.8), and a
// mis-tap opens the neighbouring cycle's card, which names itself, so the
// dead tap was the worse failure. Gate: `node scripts/check-glance-tap.mjs`.
//
// The figure marks NO current year: no now-line, no ring, no bold year on the
// axis (I-048, 2026-10-16 evening). Walk B read the ring on Dalio's crest at
// the 2026 line as "peaking now" beside two visible verdicts, and walks A4/A5
// read the same drawn position on the claim page as agreement. The rows are
// theory shapes; the verdict line under the axis does the talking. Gate:
// `node scripts/check-glance-now-mark.mjs <origin>`.

const NAME_COL = 104;
const ROW_H = 24;
// Horizontal inset so the curve's stroke is not clipped at either end of the
// row.
const PAD = 3;
// Half the rendered width of a four-digit year label at 11px mono — keeps a
// label centred on an edge tick from overflowing the page.
const LABEL_HALF = 16;

interface CycleOverviewProps {
  cycles: Cycle[];
  startYear: number;
  endYear: number;
  /** False when the facets are not the open tab, so "each in detail below"
      would point at nothing. */
  detailBelow: boolean;
  /** Opens a cycle's card (switches to the facets tab if needed). */
  onSelect: (id: string) => void;
}

export default function CycleOverview({
  cycles,
  startYear,
  endYear,
  detailBelow,
  onSelect,
}: CycleOverviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(ref, 358);
  const chartWidth = Math.max(0, width - NAME_COL);
  const innerWidth = Math.max(0, chartWidth - PAD * 2);
  const xScale = useTimeScale(startYear, endYear, innerWidth);

  const place = useCallback(
    (x: number) => Math.min(Math.max(x, LABEL_HALF), chartWidth - LABEL_HALF),
    [chartWidth]
  );

  // Spacing is judged on PLACED positions: an edge label clamped inward can
  // land on its neighbour even when the raw ticks are far apart (320px phone,
  // default range: "16001700"). Each tick survives only if it clears every
  // label already kept.
  const ticks = useMemo(() => {
    const kept: number[] = [];
    const out: { year: number; x: number }[] = [];
    for (const year of xScale.ticks(4).filter((t) => Number.isInteger(t))) {
      const x = place(xScale(year) + PAD);
      if (kept.every((k) => Math.abs(x - k) >= LABEL_HALF * 2)) {
        kept.push(x);
        out.push({ year, x });
      }
    }
    return out;
  }, [xScale, place]);
  const verdictLine = useMemo(() => glanceVerdictLine(cycles), [cycles]);

  return (
    <figure ref={ref} aria-labelledby="cycle-overview-title" className="m-0">
      <figcaption
        id="cycle-overview-title"
        className="text-[11px] uppercase tracking-[0.18em] font-mono text-ink-soft mb-2"
      >
        {/* Was "Every cycle, at a glance" (I-048): the cold walks read ten
            curves with dots on the current year as the site agreeing that the
            cycles are where their curves say. One line either way: the last
            row has 12px to spare at 320x568 (check-entry-folds). Since
            2026-10-16 it carries the verdict too, the only place a verdict
            fits a 320x568 first screen; it falls back to the old words the
            moment the line below has nothing it may state. */}
        {verdictLine ? "Theory shapes · none confirmed" : "Theory shapes, not findings"}
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
            onSelect={onSelect}
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
      </div>
      {/* I-048: the verdict, VISIBLE, under the curves it answers. The 10-15
          walk read Dalio's dot on its crest as the site agreeing, and the
          per-row verdict was screen-reader text only. Below the axis on
          purpose: anything above the rows breaks the last row's 12px at
          320x568 (check-entry-folds). */}
      {verdictLine && (
        <p
          data-glance-verdict
          className="mt-2 text-[13px] leading-snug text-ink"
        >
          {verdictLine}
        </p>
      )}
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
  onSelect,
}: {
  cycle: Cycle;
  chartWidth: number;
  xScale: LinearScale;
  startYear: number;
  endYear: number;
  onSelect: (id: string) => void;
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

  return (
    <li data-overview-id={cycle.id} style={{ height: ROW_H }}>
      {/* The visible name is the button's name; the reading the curve shows
          follows it as sr-only text. */}
      <button
        type="button"
        onClick={() => onSelect(cycle.id)}
        className="flex items-center w-full h-full p-0 m-0 bg-transparent border-0 text-left cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
      >
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
          {/* No position, because the row draws none (overviewReading.ts). */}
          <span className="sr-only">{overviewRowReading(cycle)} Opens its card.</span>
        </span>
      </span>
      <svg
        aria-hidden
        width={chartWidth}
        height={ROW_H}
        className="block flex-shrink-0"
      >
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
      </svg>
      </button>
    </li>
  );
}
