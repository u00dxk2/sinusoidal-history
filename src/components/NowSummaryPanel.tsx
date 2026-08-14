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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthYear(year: number): string {
  // We render server-side too, so use the passed-in year and a fresh Date
  // for the month. Stable enough for this masthead.
  const m = new Date().getMonth();
  return `${MONTH_NAMES[m]} ${year}`;
}

function labelDescription(label: PhasePositionLabel): string {
  return label;
}

/**
 * Editorial short-form name. The State panel is a snapshot, not an
 * encyclopedia: we display the byline (author surname or short title),
 * not the full descriptive name.
 */
function bylineName(name: string): string {
  if (!name.includes("—")) return name;
  return name.split("—")[0].trim();
}

export default function NowSummaryPanel({
  cycles,
  currentYear,
  onSelectCycle,
}: NowSummaryPanelProps) {
  return (
    <section
      aria-label="State of the cycles summary"
      className="relative bg-paper border border-rule/30 rounded-sm shadow-[0_1px_0_rgba(0,0,0,0.04)] overflow-hidden print:border-rule"
    >
      <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-4">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
              No. {String(cycles.length).padStart(2, "0")} · A reckoning
            </p>
            <h2 className="font-display text-[30px] sm:text-[42px] leading-[1.0] tracking-tight mt-1.5 text-ink">
              State of the cycles
            </h2>
          </div>
          <div className="text-right">
            <p className="font-mono text-[11px] sm:text-[11px] tracking-widest uppercase text-ink-soft">
              {monthYear(currentYear)}
            </p>
            <p className="hidden sm:block mt-1 text-[11px] text-ink-soft italic font-display-italic">
              tap a row to focus + calibrate
            </p>
          </div>
        </header>
      </div>

      <div className="editorial-rule mx-5 sm:mx-8" />

      <ul className="px-2 sm:px-4 py-3 grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-0">
        {cycles.map((cycle, idx) => {
          const label = phasePositionLabel(cycle, currentYear);
          const progress = phaseProgressPercent(cycle, currentYear);
          return (
            <li key={cycle.id}>
              <button
                type="button"
                onClick={() => onSelectCycle(cycle.id)}
                aria-label={`${cycle.name} — currently ${labelDescription(label)}, click to focus and calibrate`}
                // min-h-11: py-2.5 landed these rows at 43px, one under the
                // 44px floor. outline-none + a 30%-opacity ring is dropped in
                // favour of the global :focus-visible rule in globals.css —
                // it was the one place focus was effectively invisible.
                // Canon R28, R30.
                className="group w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 min-h-11 rounded-sm hover:bg-ink/[0.04] focus-visible:bg-ink/[0.04] text-left transition-colors"
              >
                <span
                  aria-hidden
                  className="font-mono text-[11px] text-ink-soft/70 tabular-nums w-4 text-right flex-shrink-0"
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="self-stretch w-[3px] flex-shrink-0 rounded-full"
                  style={{ backgroundColor: cycle.color }}
                />
                <span className="font-display text-[15px] sm:text-[18px] tracking-tight font-medium flex-1 truncate min-w-0 text-ink">
                  {bylineName(cycle.name)}
                </span>
                <PhaseGaugeBar
                  percent={progress}
                  color={cycle.color}
                />
                <span
                  className="text-[11px] sm:text-[11px] font-mono uppercase tracking-[0.18em] flex-shrink-0 w-[5.5rem] sm:w-[6rem] text-right transition-colors"
                  style={{ color: cycle.color }}
                >
                  {labelDescription(label)}
                </span>
                <span
                  aria-hidden
                  className="hidden sm:inline-flex items-center justify-center w-5 h-5 rounded text-ink-soft/30 group-hover:text-ink/70 group-focus:text-ink/70 transition-colors"
                  title="open + calibrate"
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 3 L11 8 L5 13" />
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
      className="hidden sm:block relative h-[3px] w-24 lg:w-32 rounded-full bg-ink/[0.08] flex-shrink-0 overflow-visible"
    >
      <span
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
      <span
        aria-hidden
        className="absolute -top-1 bottom-[-4px] left-1/2 w-px bg-ink/20"
      />
    </span>
  );
}
