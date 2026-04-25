"use client";

import type { Cycle } from "@/data/types";
import {
  phasePositionLabel,
  phaseProgressPercent,
  type PhasePositionLabel,
} from "@/lib/cycleMath";

interface NowSummaryPanelProps {
  cycles: Cycle[];
  currentYear: number;
  onSelectCycle: (id: string) => void;
}

function labelDescription(label: PhasePositionLabel): string {
  return label;
}

export default function NowSummaryPanel({
  cycles,
  currentYear,
  onSelectCycle,
}: NowSummaryPanelProps) {
  return (
    <section
      aria-label="State of the cycles summary"
      className="rounded-lg border border-foreground/15 bg-background p-3 sm:p-4 print:border-foreground/40"
    >
      <header className="mb-3 flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
          State of the cycles · {currentYear}
        </h2>
        <span className="hidden sm:inline text-xs text-foreground/45">
          tap a row to focus + calibrate
        </span>
      </header>
      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-1">
        {cycles.map((cycle) => {
          const label = phasePositionLabel(cycle, currentYear);
          const progress = phaseProgressPercent(cycle, currentYear);
          return (
            <li key={cycle.id}>
              <button
                type="button"
                onClick={() => onSelectCycle(cycle.id)}
                aria-label={`${cycle.name} — currently ${labelDescription(label)}, click to focus and calibrate`}
                className="group w-full flex items-center gap-2.5 sm:gap-3 rounded px-1.5 py-1.5 hover:bg-foreground/5 focus:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20 text-left transition-colors"
              >
                <span
                  aria-hidden
                  className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: cycle.color }}
                />
                <span className="text-sm font-medium flex-1 truncate min-w-0">
                  {cycle.name}
                </span>
                <PhaseGaugeBar
                  percent={progress}
                  color={cycle.color}
                />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wide text-foreground/70 flex-shrink-0 w-[5rem] sm:w-[5.5rem] text-right">
                  {labelDescription(label)}
                </span>
                <span
                  aria-hidden
                  className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded text-foreground/35 group-hover:text-foreground/85 group-focus:text-foreground/85 transition-colors"
                  title="open + calibrate"
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="8" cy="8" r="2" />
                    <path d="M8 1v3M8 12v3M1 8h3M12 8h3M3.5 3.5l2 2M10.5 10.5l2 2M3.5 12.5l2-2M10.5 5.5l2-2" />
                  </svg>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PhaseGaugeBar({
  percent,
  color,
}: {
  percent: number;
  color: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <span
      aria-hidden
      className="hidden sm:block relative h-1.5 w-20 lg:w-24 rounded-full bg-foreground/10 flex-shrink-0 overflow-hidden"
    >
      <span
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
      <span
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-px bg-foreground/30"
      />
    </span>
  );
}
