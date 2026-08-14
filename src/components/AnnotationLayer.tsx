"use client";

import { useMemo, useState } from "react";
import type { Annotation } from "@/data/types";
import { cn } from "@/lib/utils";

interface AnnotationLayerProps {
  annotations: Annotation[];
  startYear: number;
  endYear: number;
  xScale: (year: number) => number;
  height: number;
  /** vertical position of the label ribbon within the layer, 0 = top */
  labelBandTop?: number;
  /** total visual width of the axis (used for collision detection) */
  width?: number;
  /** number of stagger lanes; defaults to 3 */
  laneCount?: number;
}

// Higher = more important and more likely to keep its lane when crowded.
const TYPE_PRIORITY: Record<string, number> = {
  war: 5,
  geopolitical: 4,
  political: 4,
  economic: 3,
  cultural: 2,
  health: 2,
  event: 1,
};

/**
 * Renders compact labels for curated historical events with prioritized
 * stagger lanes. When labels collide horizontally, lower-priority events
 * fall to a deeper lane; if all lanes are occupied within the gap, the
 * lowest-priority event drops out entirely (preserving readability over
 * completeness).
 */
export default function AnnotationLayer({
  annotations,
  startYear,
  endYear,
  xScale,
  height,
  labelBandTop = 2,
  width,
  laneCount = 3,
}: AnnotationLayerProps) {
  const visible = useMemo(
    () => annotations.filter((a) => a.year >= startYear && a.year <= endYear),
    [annotations, startYear, endYear]
  );

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const layout = useMemo(() => {
    type LaidOut = { ann: Annotation; x: number; lane: number };
    const MIN_GAP = 38;
    // Sort by priority desc — higher priority claims lanes first.
    const sorted = [...visible].sort((a, b) => {
      const pa = TYPE_PRIORITY[a.type] ?? 0;
      const pb = TYPE_PRIORITY[b.type] ?? 0;
      if (pb !== pa) return pb - pa;
      return a.year - b.year;
    });
    const placed: LaidOut[] = [];
    for (const a of sorted) {
      const x = xScale(a.year);
      let lane = -1;
      for (let i = 0; i < laneCount; i++) {
        const conflict = placed.some(
          (p) => p.lane === i && Math.abs(p.x - x) < MIN_GAP
        );
        if (!conflict) {
          lane = i;
          break;
        }
      }
      if (lane === -1) continue; // dropped — too crowded
      placed.push({ ann: a, x, lane });
    }
    return placed;
  }, [visible, xScale, laneCount]);

  return (
    <g aria-label="Historical annotations">
      {layout.map(({ ann, x, lane }) => {
        const labelY = labelBandTop + 10 + lane * 12;
        const isHovered = hoveredId === ann.id;
        return (
          <g
            key={ann.id}
            onMouseEnter={() => setHoveredId(ann.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(ann.id)}
            onBlur={() => setHoveredId(null)}
            tabIndex={0}
            style={{ cursor: "help", outline: "none" }}
          >
            <title>{`${ann.year} — ${ann.label}: ${ann.description}`}</title>
            <line
              x1={x}
              x2={x}
              y1={labelY + 2}
              y2={height}
              stroke="currentColor"
              strokeOpacity={isHovered ? 0.5 : 0.18}
              strokeWidth={isHovered ? 1.25 : 1}
              strokeDasharray="1 3"
            />
            <rect
              x={x - 22}
              y={labelY - 8}
              width={44}
              height={12}
              rx={3}
              fill="currentColor"
              fillOpacity={isHovered ? 0.08 : 0.03}
            />
            <text
              x={x}
              y={labelY + 1}
              textAnchor="middle"
              className={cn(
                // 0.6 composited ink-on-paper measured 4.48:1 — under AA by a
                // rounding margin. 0.68 clears it (~5.2:1) without making the
                // annotations compete with the curves. Canon R30.
                "text-[11px] font-mono fill-current",
                isHovered ? "opacity-90" : "opacity-[0.68]"
              )}
            >
              {ann.label}
            </text>
          </g>
        );
      })}
      {/* width prop intentionally accepted but unused — reserved for future
          right-edge label clipping; documented in props for caller stability. */}
      {width !== undefined && null}
    </g>
  );
}
