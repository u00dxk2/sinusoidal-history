"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { brushX, type D3BrushEvent } from "d3-brush";
import { select } from "d3-selection";
import { line as d3Line, curveMonotoneX } from "d3-shape";
import { scaleLinear } from "d3-scale";
import type { Cycle } from "@/data/types";
import { sineAtYear } from "@/lib/cycleMath";
import { useContainerWidth, useTimeScale } from "@/lib/hooks";
import { RANGE_PRESET_OPTIONS } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

interface TimeRangeBrushProps {
  cycles: Cycle[];
  fullStartYear: number;
  fullEndYear: number;
  visibleStartYear: number;
  visibleEndYear: number;
  onChange: (start: number, end: number) => void;
}

const HEIGHT = 78;
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
      .range([HEIGHT - 14, 14]);
    const lineGen = d3Line<{ year: number; value: number }>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value))
      .curve(curveMonotoneX);
    return lineGen(points) ?? "";
  }, [cycles, xScale, innerWidth, fullStartYear, fullEndYear]);

  // Decade tick marks for the brush track. Editorial measure.
  const trackTicks = useMemo(() => {
    const out: number[] = [];
    for (let y = Math.ceil(fullStartYear / 50) * 50; y <= fullEndYear; y += 50) {
      out.push(y);
    }
    return out;
  }, [fullStartYear, fullEndYear]);

  useEffect(() => {
    const node = brushGroupRef.current;
    if (!node || innerWidth <= 0) return;
    const sel = select(node as SVGGElement);
    const brush = brushX<unknown>()
      .extent([
        [0, 6],
        [innerWidth, HEIGHT - 6],
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
      // Even at "all-range", show a subtle indicator the whole strip is the
      // current selection — not a blank slate.
      sel.call(brush.move, null);
    } else {
      sel.call(brush.move, [x0, x1]);
    }

    // Editorial brush styling.
    sel
      .selectAll(".selection")
      .attr("fill", "var(--ink)")
      .attr("fill-opacity", 0.06)
      .attr("stroke", "var(--ink)")
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 1)
      .attr("shape-rendering", "crispEdges");
    sel
      .selectAll<SVGRectElement, unknown>(".handle")
      .attr("fill", "var(--paper)")
      .attr("stroke", "var(--ink)")
      .attr("stroke-opacity", 0.85)
      .attr("stroke-width", 1)
      .attr("width", 8)
      .attr("rx", 1);
    sel.selectAll(".overlay").attr("cursor", "crosshair");

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
    <div className="space-y-3" ref={containerRef}>
      <div className="flex flex-wrap gap-x-1 gap-y-2 items-baseline">
        <span className="text-[10px] uppercase tracking-[0.28em] text-ink-soft font-medium mr-3 self-center">
          Range
        </span>
        <div className="flex flex-wrap gap-1">
          {RANGE_PRESET_OPTIONS.map((preset) => {
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
                  "rounded-sm px-2.5 py-1 text-[12px] transition border",
                  active
                    ? "border-ink/60 bg-ink text-paper font-medium"
                    : "border-rule/35 text-ink-soft hover:bg-ink/5 hover:text-ink hover:border-ink/30",
                )}
              >
                {preset.label}
                <span className="ml-1.5 font-mono text-[10px] opacity-60">
                  {preset.short}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-[11px] text-ink-soft ml-auto font-mono tabular-nums">
          showing <span className="text-ink">{range}</span>
        </span>
      </div>
      <div className="relative">
        <div className="relative rounded-sm border border-rule/35 bg-paper-deep/50 overflow-hidden">
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label="Time range selector — drag to zoom to a subrange, or click outside the selection to reset to the full range"
            className="block cursor-crosshair"
          >
            <g transform="translate(4,0)">
              {/* Decade ticks running through the strip */}
              {trackTicks.map((y) => (
                <line
                  key={y}
                  x1={xScale(y)}
                  x2={xScale(y)}
                  y1={6}
                  y2={HEIGHT - 6}
                  stroke="var(--ink)"
                  strokeOpacity={0.05}
                />
              ))}
              {/* Mid-line zero reference */}
              <line
                x1={0}
                x2={innerWidth}
                y1={HEIGHT / 2}
                y2={HEIGHT / 2}
                stroke="var(--ink)"
                strokeOpacity={0.08}
                strokeDasharray="1 4"
              />
              {/* Cycle convergence overview */}
              <path
                d={overviewPath}
                fill="none"
                stroke="var(--ink)"
                strokeOpacity={0.65}
                strokeWidth={1.25}
                strokeLinejoin="round"
              />
              {/* Decade labels at endpoints */}
              <text
                x={2}
                y={HEIGHT - 3}
                className="fill-ink-soft font-mono text-[9px]"
                style={{ opacity: 0.55 }}
              >
                {fullStartYear}
              </text>
              <text
                x={innerWidth - 2}
                y={HEIGHT - 3}
                textAnchor="end"
                className="fill-ink-soft font-mono text-[9px]"
                style={{ opacity: 0.55 }}
              >
                {fullEndYear}
              </text>
              <g ref={brushGroupRef} />
            </g>
          </svg>
          {hintVisible && isFullRange && innerWidth > 100 && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="rounded-sm bg-ink text-paper px-3 py-1 text-[11px] tracking-[0.18em] uppercase shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
                ← drag to zoom →
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
