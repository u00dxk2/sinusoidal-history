"use client";

import { useMemo, useRef } from "react";
import type { Annotation, Cycle, DataSeries } from "@/data/types";
import CycleFacet, { type FacetMode } from "./CycleFacet";
import FacetTimeAxis from "./FacetTimeAxis";
import { useEscapeKey } from "@/lib/hooks";
import type { CycleOverride } from "./CycleOverlay";

interface FacetViewProps {
  cycles: Cycle[];
  dataSeries: DataSeries[];
  currentYear: number;
  startYear: number;
  endYear: number;
  focusedCycleId: string | null;
  onChangeFocus: (id: string | null) => void;
  overrides: Record<string, CycleOverride>;
  onChangeOverrides: (
    next: Record<string, CycleOverride>
  ) => void;
  annotations?: Annotation[];
}

export default function FacetView({
  cycles,
  dataSeries,
  currentYear,
  startYear,
  endYear,
  focusedCycleId,
  onChangeFocus,
  overrides,
  onChangeOverrides,
  annotations,
}: FacetViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEscapeKey(() => onChangeFocus(null), focusedCycleId !== null);

  const seriesByCycle = useMemo(() => {
    const map = new Map<string, DataSeries>();
    for (const s of dataSeries) {
      if (!map.has(s.associated_cycle_id)) {
        map.set(s.associated_cycle_id, s);
      }
    }
    return map;
  }, [dataSeries]);

  // Click-outside-to-exit removed in Phase 4: ESC and clicking the focused
  // cycle's header are the explicit dismiss paths. The previous click-outside
  // behaviour misfired on slider tracks and gap whitespace.

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      {cycles.map((cycle) => {
        const mode: FacetMode =
          focusedCycleId === null
            ? "normal"
            : focusedCycleId === cycle.id
              ? "expanded"
              : "collapsed";
        return (
          <CycleFacet
            key={cycle.id}
            cycle={cycle}
            series={seriesByCycle.get(cycle.id)}
            mode={mode}
            startYear={startYear}
            endYear={endYear}
            currentYear={currentYear}
            override={overrides[cycle.id] ?? {}}
            onChangeOverride={(next) =>
              onChangeOverrides({ ...overrides, [cycle.id]: next })
            }
            onResetOverride={() => {
              const next = { ...overrides };
              delete next[cycle.id];
              onChangeOverrides(next);
            }}
            onFocus={() => onChangeFocus(cycle.id)}
            onBlur={() => onChangeFocus(null)}
          />
        );
      })}
      <FacetTimeAxis
        startYear={startYear}
        endYear={endYear}
        currentYear={currentYear}
        annotations={annotations}
      />
    </div>
  );
}
