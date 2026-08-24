"use client";

import { Fragment, useEffect, useMemo, useRef } from "react";
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

  // The site's one imperative instruction ("tap/click a row to focus") used to
  // render its entire result ~800-1,200px below the fold with no viewport
  // change — cold readers on both form factors concluded the control was
  // broken. Scroll the focused facet into view unless it is already visible.
  // Journey-walk 2026-08-24, J1.
  useEffect(() => {
    if (!focusedCycleId) return;
    const scrollToFacet = () => {
      const el = containerRef.current?.querySelector<HTMLElement>(
        `[data-facet-id="${CSS.escape(focusedCycleId)}"]`
      );
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top >= 0 && top < window.innerHeight * 0.6) return;
      window.scrollTo(0, top + window.scrollY - 12);
    };
    // Instant manual scrollTo, asserted twice: at effect time the layout
    // above the facet is still settling (chart width measures, font swap,
    // the expanded tail's CSV), so a single scroll — scrollIntoView or
    // manual — lands ~700px short (verified live on mobile). The second
    // pass at 350ms is a no-op when the first landed inside the viewport.
    scrollToFacet();
    const t = window.setTimeout(scrollToFacet, 350);
    return () => window.clearTimeout(t);
  }, [focusedCycleId]);

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

  // A stale/garbage ?focus= id must not hide the shared axis entirely.
  const focusIsValid =
    focusedCycleId !== null && cycles.some((c) => c.id === focusedCycleId);

  return (
    <div ref={containerRef} className="flex flex-col gap-1.5">
      {cycles.map((cycle) => {
        const mode: FacetMode =
          !focusIsValid
            ? "normal"
            : focusedCycleId === cycle.id
              ? "expanded"
              : "collapsed";
        return (
          <Fragment key={cycle.id}>
          <CycleFacet
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
          {/* When a facet is focused, the year axis moves up to sit directly
              under the expanded chart — it used to exist only below all ten
              panels, so a focused reading had no year scale in view.
              Journey-walk 2026-08-24, J3. */}
          {mode === "expanded" && (
            <FacetTimeAxis
              startYear={startYear}
              endYear={endYear}
              currentYear={currentYear}
              annotations={annotations}
            />
          )}
          </Fragment>
        );
      })}
      {!focusIsValid && (
        <FacetTimeAxis
          startYear={startYear}
          endYear={endYear}
          currentYear={currentYear}
          annotations={annotations}
        />
      )}
    </div>
  );
}
