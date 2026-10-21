"use client";

import type { Cycle } from "@/data/types";
import { holdsUpCard } from "@/lib/holdsUp";

// The verdict panel. It was "State of the cycles" with this month's dateline
// and an "annual permalink →" to /state/<year> until I-061 (David
// 2026-10-21): no surface frames the cycles as a reading of the present, and
// the yearly state pages are retired. Its rows already carried verdicts only.

interface NowSummaryPanelProps {
  cycles: Cycle[];
  onSelectCycle?: (id: string) => void;
  /** False in embeds: rows render as plain rows (no buttons, no "tap a row"
      hint) because the embed discards selection events. */
  interactive?: boolean;
}

/**
 * Editorial short-form name: the byline (author surname or short title),
 * not the full descriptive name.
 */
function bylineName(name: string): string {
  if (!name.includes("—")) return name;
  return name.split("—")[0].trim();
}

/**
 * Each row carries its cycle's "Does it hold up?" headline, and no phase word
 * or position bar (I-054, 2026-10-18): the rows read "Ray Dalio 75y PEAKING"
 * with no verdict beside it, and the 10-17 cold walks took that as the site
 * agreeing. The words are the closed card's (holdsUpCard), unchanged. On a
 * phone the verdict takes its own line under the name, so the long headline is
 * never cut; from 640px it sits beside the name, so the State embed still fits
 * its published 700px frame (check-embed-snippets).
 */
function RowBody({ cycle }: { cycle: Cycle }) {
  const verdict = holdsUpCard(cycle)?.headline;
  return (
    <span className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
      <span className="flex items-baseline gap-2 min-w-0 sm:flex-1">
        <span className="font-display text-[15px] sm:text-[18px] leading-tight tracking-tight font-medium flex-1 truncate min-w-0 text-ink">
          {bylineName(cycle.name)}
        </span>
        {/* Mobile hides the facet subtitle, so no period number appeared
            anywhere on the phone home page — and "Peter Turchin" (150y) vs
            "Turchin" (50y) were indistinguishable. Journey-walk 2026-08-24,
            J15. */}
        <span
          aria-hidden
          className="sm:hidden font-mono text-[11px] text-ink-soft/70 tabular-nums flex-shrink-0"
        >
          {cycle.period_years}y
        </span>
      </span>
      {verdict && (
        <span
          data-panel-verdict={cycle.id}
          className="block text-[12px] leading-tight text-ink-soft sm:text-right sm:flex-shrink-0"
        >
          {verdict}
        </span>
      )}
    </span>
  );
}

export default function NowSummaryPanel({
  cycles,
  onSelectCycle,
  interactive = true,
}: NowSummaryPanelProps) {
  return (
    <section
      aria-label="Does each cycle hold up? Summary"
      className="relative bg-paper border border-rule/30 rounded-sm shadow-[0_1px_0_rgba(0,0,0,0.04)] overflow-hidden print:border-rule"
    >
      <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-4">
        <header className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
              No. {String(cycles.length).padStart(2, "0")}{" "}· A reckoning
            </p>
            <h2 className="font-display text-[30px] sm:text-[42px] leading-[1.0] tracking-tight mt-1.5 text-ink">
              Does each cycle hold up?
            </h2>
          </div>
          <div className="text-right">
            {interactive && (
              <p className="hidden sm:block mt-1 text-[11px] text-ink-soft italic font-display-italic">
                select a row to focus + calibrate
              </p>
            )}
          </div>
        </header>
      </div>

      <div className="editorial-rule mx-5 sm:mx-8" />

      <ul className="px-2 sm:px-4 py-3 grid grid-cols-1 lg:grid-cols-2 gap-x-2 gap-y-0">
        {cycles.map((cycle, idx) => {
          const verdict = holdsUpCard(cycle)?.headline;
          if (!interactive) {
            return (
              <li key={cycle.id}>
                <div className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-1.5 sm:py-2.5 min-h-11 rounded-sm">
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
                  <RowBody cycle={cycle} />
                </div>
              </li>
            );
          }
          return (
            <li key={cycle.id}>
              <button
                type="button"
                onClick={() => onSelectCycle?.(cycle.id)}
                aria-label={`${cycle.name} — does it hold up? ${verdict ?? "no verdict"}. Select to focus and calibrate`}
                // min-h-11: py-2.5 landed these rows at 43px, one under the
                // 44px floor. outline-none + a 30%-opacity ring is dropped in
                // favour of the global :focus-visible rule in globals.css —
                // it was the one place focus was effectively invisible.
                // Canon R28, R30.
                className="group w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-1.5 sm:py-2.5 min-h-11 rounded-sm hover:bg-ink/[0.04] focus-visible:bg-ink/[0.04] text-left transition-colors"
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
                <RowBody cycle={cycle} />
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
