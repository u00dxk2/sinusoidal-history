"use client";

import { useMemo, useRef } from "react";
import type { Annotation } from "@/data/types";
import AnnotationLayer from "./AnnotationLayer";
import { useContainerWidth, useTimeScale } from "@/lib/hooks";

interface FacetTimeAxisProps {
  startYear: number;
  endYear: number;
  currentYear: number;
  annotations?: Annotation[];
}

export default function FacetTimeAxis({
  startYear,
  endYear,
  currentYear,
  annotations = [],
}: FacetTimeAxisProps) {
  const ref = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(ref, 800);
  const innerWidth = Math.max(0, width - 8);
  const xScale = useTimeScale(startYear, endYear, innerWidth);
  const isMobile = innerWidth < 640;

  const tickYears = useMemo(() => {
    const span = endYear - startYear;
    const step = isMobile
      ? Math.max(50, Math.round(span / 6 / 10) * 10)
      : 50;
    const ticks: number[] = [];
    let y = Math.ceil(startYear / step) * step;
    while (y <= endYear) {
      ticks.push(y);
      y += step;
    }
    return ticks;
  }, [startYear, endYear, isMobile]);

  // Hide annotation labels on small viewports — they crowd unreadably.
  const showAnnotationLabels = annotations.length > 0 && !isMobile;
  const annotationBandHeight = showAnnotationLabels ? 38 : 0;
  const axisBaseY = annotationBandHeight + 2;
  const height = axisBaseY + 26;

  return (
    <div ref={ref} className="w-full">
      <svg
        width={width}
        height={height}
        role="presentation"
        className="block"
      >
        <g transform="translate(4,0)">
          {showAnnotationLabels && (
            <AnnotationLayer
              annotations={annotations}
              startYear={startYear}
              endYear={endYear}
              xScale={xScale}
              height={annotationBandHeight}
              labelBandTop={2}
              width={innerWidth}
              laneCount={3}
            />
          )}
          <line
            x1={0}
            x2={innerWidth}
            y1={axisBaseY}
            y2={axisBaseY}
            stroke="currentColor"
            strokeOpacity={0.2}
          />
          {tickYears.map((y) => {
            const x = xScale(y);
            // Centre-anchored labels clipped at both SVG edges ("1600"
            // rendered as "600", "2050" vanished), and on mobile the "2000"
            // label mashed into "now · 2026". Clamp the end anchors and drop
            // any tick label that would collide with the now label.
            // Journey-walk 2026-08-24, J3.
            const anchor =
              x < 16 ? "start" : x > innerWidth - 16 ? "end" : "middle";
            const collidesWithNow =
              currentYear >= startYear &&
              currentYear <= endYear &&
              Math.abs(x - xScale(currentYear)) < 50;
            return (
              <g key={y} transform={`translate(${x},${axisBaseY})`}>
                <line y1={0} y2={6} stroke="currentColor" strokeOpacity={0.3} />
                {!collidesWithNow && (
                  <text
                    y={20}
                    textAnchor={anchor}
                    className="fill-current text-[11px] opacity-[0.68] font-mono"
                  >
                    {y}
                  </text>
                )}
              </g>
            );
          })}
          {currentYear >= startYear && currentYear <= endYear && (
            <g transform={`translate(${xScale(currentYear)},${axisBaseY})`}>
              <line
                y1={0}
                y2={6}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeOpacity={0.7}
              />
              <text
                y={20}
                textAnchor={
                  xScale(currentYear) > innerWidth - 40 ? "end" : "middle"
                }
                className="fill-current text-[11px] font-medium font-mono"
                style={{ opacity: 0.85 }}
              >
                now · {currentYear}
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}
