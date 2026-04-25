"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { brushX, type D3BrushEvent } from "d3-brush";
import { select } from "d3-selection";
import { line as d3Line, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Cycle } from "@/data/types";
import { sineAtYear } from "@/lib/cycleMath";
import { useContainerWidth, useTimeScale } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface TimeRangeBrushProps {
  cycles: Cycle[];
  fullStartYear: number;
  fullEndYear: number;
  visibleStartYear: number;
  visibleEndYear: number;
  onChange: (start: number, end: number) => void;
}

const PRESETS: ReadonlyArray<{
  label: string;
  start: number;
  end: number;
}> = [
  { label: "All (1600–2050)", start: 1600, end: 2050 },
  { label: "Industrial (1750+)", start: 1750, end: 2050 },
  { label: "Modern (1900+)", start: 1900, end: 2050 },
  { label: "Living memory (1950+)", start: 1950, end: 2050 },
  { label: "Now (2000+)", start: 2000, end: 2050 },
];

const HEIGHT = 64;
const HINT_STORAGE_KEY = "sh.brushHintSeen";

export default function TimeRangeBrush({
  cycles,
  fullStartYear,
  fullEndYear,
  visibleStartYear,
  visibleEndYear,
  onChange,
}: TimeRangeBrushProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef, 800);
  const brushGroupRef = useRef<SVGGElement | null>(null);

  // Hint visibility starts off; after hydration, check localStorage in a
  // microtask so the setState isn't synchronous inside the effect body.
  const [hintVisible, setHintVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.requestAnimationFrame(() => {
      if (!window.localStorage.getItem(HINT_STORAGE_KEY)) {
        setHintVisible(true);
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, []);
  const dismissHint = () => {
    setHintVisible(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HINT_STORAGE_KEY, "1");
    }
  };

  const innerWidth = Math.max(0, width - 8);
  const xScale = useTimeScale(fullStartYear, fullEndYear, innerWidth);

  const overviewPath = useMemo(() => {
    if (cycles.length === 0 || innerWidth === 0) return "";
    const points: { year: number; value: number }[] = [];
    for (let y = fullStartYear; y <= fullEndYear; y += 1) {
      let sum = 0;
      for (const c of cycles) sum += sineAtYear(c, y);
      points.push({ year: y, value: sum / cycles.length });
    }
    const yScale = scaleLinear()
      .domain([-1.05, 1.05])
      .range([HEIGHT - 10, 8]);
    const lineGen = d3Line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(curveMonotoneX);
    return lineGen(points) ?? "";
  }, [cycles, xScale, innerWidth, fullStartYear, fullEndYear]);

  // Imperative d3-brush wiring.
  useEffect(() => {
    const node = brushGroupRef.current;
    if (!node || innerWidth <= 0) return;
    const sel = select(node as SVGGElement);
    const brush = brushX<unknown>()
      .extent([
        [0, 4],
        [innerWidth, HEIGHT - 4],
      ])
      .on("start", () => {
        if (hintVisible) dismissHint();
      })
      .on("end", (event: D3BrushEvent<unknown>) => {
        if (!event.sourceEvent) return;
        const sel2 = event.selection as [number, number] | null;
        if (!sel2) {
          onChange(fullStartYear, fullEndYear);
          return;
        }
        const [x0, x1] = sel2;
        const y0 = Math.round(xScale.invert(x0));
        const y1 = Math.round(xScale.invert(x1));
        const lo = Math.min(y0, y1);
        const hi = Math.max(y0, y1);
        if (hi - lo < 5) {
          onChange(fullStartYear, fullEndYear);
          return;
        }
        onChange(lo, hi);
      });

    sel.call(brush);

    const x0 = xScale(visibleStartYear);
    const x1 = xScale(visibleEndYear);
    if (
      visibleStartYear === fullStartYear &&
      visibleEndYear === fullEndYear
    ) {
      sel.call(brush.move, null);
    } else {
      sel.call(brush.move, [x0, x1]);
    }

    // Style the brush elements for visibility.
    sel
      .selectAll(".selection")
      .attr("fill", "currentColor")
      .attr("fill-opacity", 0.08)
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);
    sel
      .selectAll<SVGRectElement, unknown>(".handle")
      .attr("fill", "currentColor")
      .attr("fill-opacity", 0.6)
      .attr("width", 6)
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.9)
      .attr("rx", 2);

    return () => {
      sel.on(".brush", null);
    };
  }, [
    innerWidth,
    xScale,
    visibleStartYear,
    visibleEndYear,
    fullStartYear,
    fullEndYear,
    onChange,
    hintVisible,
  ]);

  const range = `${visibleStartYear}–${visibleEndYear}`;
  const isFullRange =
    visibleStartYear === fullStartYear && visibleEndYear === fullEndYear;

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs uppercase tracking-wide text-foreground/55 font-medium mr-1">
          Range
        </span>
        {PRESETS.map((preset) => {
          const active =
            preset.start === visibleStartYear &&
            preset.end === visibleEndYear;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.start, preset.end)}
              aria-pressed={active}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition",
                active
                  ? "border-foreground/40 bg-foreground/10 font-medium"
                  : "border-foreground/15 hover:bg-foreground/5"
              )}
            >
              {preset.label}
            </button>
          );
        })}
        <span className="text-xs text-foreground/60 ml-auto font-mono">
          showing {range}
        </span>
      </div>
      <div className="relative">
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label="Time range selector — drag to zoom to a subrange, or click outside the selection to reset to the full range"
          className="block cursor-crosshair"
        >
          <g transform="translate(4,0)">
            <rect
              x={0}
              y={0}
              width={innerWidth}
              height={HEIGHT}
              fill="currentColor"
              fillOpacity={0.025}
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth={1}
              rx={3}
            />
            <line
              x1={0}
              x2={innerWidth}
              y1={HEIGHT / 2}
              y2={HEIGHT / 2}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeDasharray="2 4"
            />
            <path
              d={overviewPath}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.55}
              strokeWidth={1}
            />
            <g ref={brushGroupRef} />
          </g>
        </svg>
        {hintVisible && isFullRange && innerWidth > 100 && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="rounded-full bg-foreground/70 text-background px-3 py-1 text-[11px] font-medium tracking-wide shadow-sm">
              ← drag to zoom →
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
