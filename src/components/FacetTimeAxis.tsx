"use client";

import { useMemo, useRef } from "react";
import type { Annotation } from "@/data/types";
import AnnotationLayer from "./AnnotationLayer";
import { useContainerWidth, useTimeScale } from "@/lib/hooks";

// The year axis under the facet stack and single-cycle charts. It marks no
// current year (I-061, David 2026-10-21): no surface says where the present
// sits on a cycle. It printed "now · <year>" with a bolder tick until then
// (off under the home cards since I-048, still on in the single-cycle embed).

interface FacetTimeAxisProps {
  startYear: number;
  endYear: number;
  annotations?: Annotation[];
}

export default function FacetTimeAxis({
  startYear,
  endYear,
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
            // rendered as "600", "2050" vanished): clamp the end anchors.
            // Journey-walk 2026-08-24, J3.
            const anchor =
              x < 16 ? "start" : x > innerWidth - 16 ? "end" : "middle";
            return (
              <g key={y} transform={`translate(${x},${axisBaseY})`}>
                <line y1={0} y2={6} stroke="currentColor" strokeOpacity={0.3} />
                <text
                  y={20}
                  textAnchor={anchor}
                  className="fill-current text-[11px] opacity-[0.68] font-mono"
                >
                  {y}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
