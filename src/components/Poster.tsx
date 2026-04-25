"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Cycle } from "@/data/types";
import {
  phasePositionLabel,
  phaseProgressPercent,
  type PhasePositionLabel,
} from "@/lib/cycleMath";
import { useOverridesState } from "@/lib/urlState";

interface PosterProps {
  cycles: Cycle[];
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

function formatHeadline(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function labelWord(l: PhasePositionLabel): string {
  return l.toUpperCase();
}

function confidenceTag(level: string): string {
  switch (level) {
    case "quantitative":
      return "Quantitative";
    case "empirical":
      return "Empirical";
    case "empirical-contested":
      return "Empirical · contested";
    case "narrative":
      return "Narrative";
    default:
      return level;
  }
}

export default function Poster({ cycles }: PosterProps) {
  const [overrides] = useOverridesState(cycles);
  const effectiveCycles = useMemo(
    () =>
      cycles.map((c) => {
        const ov = overrides[c.id];
        if (!ov) return c;
        return {
          ...c,
          period_years: ov.period_years ?? c.period_years,
          reference_peak_year:
            ov.reference_peak_year ?? c.reference_peak_year,
        };
      }),
    [cycles, overrides]
  );

  const now = new Date();
  const currentYear = now.getFullYear();
  const headline = formatHeadline(now);

  const posterRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#fafaf6",
      });
      const link = document.createElement("a");
      link.download = `sinusoidal-history-${currentYear}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Poster download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink/[0.04] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1240px] mb-5 flex items-baseline justify-end gap-4 print:hidden">
        <Link
          href="/"
          className="text-[12px] text-ink-soft hover:text-ink transition-colors uppercase tracking-[0.18em]"
        >
          ← back to interactive
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-sm border border-ink/40 bg-paper px-4 py-1.5 text-[12px] uppercase tracking-[0.18em] font-medium text-ink hover:bg-ink hover:text-paper transition-colors disabled:opacity-50 disabled:hover:bg-paper disabled:hover:text-ink"
        >
          {downloading ? "Rendering…" : "Download PNG"}
        </button>
      </div>

      <div
        ref={posterRef}
        style={{ width: 1200, minHeight: 800 }}
        className="bg-paper text-ink flex flex-col px-16 py-14 shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-rule/40 relative"
      >
        {/* Top corner-band: dateline + masthead. Asymmetric. */}
        <header className="grid grid-cols-12 gap-8 mb-2">
          <div className="col-span-8">
            <p className="text-[11px] tracking-[0.36em] uppercase text-ink-soft font-medium">
              Sinusoidal History · No. 01 · A reckoning
            </p>
            <h1
              className="font-display mt-3 text-ink leading-[0.94] tracking-[-0.02em]"
              style={{ fontSize: 92 }}
            >
              State of <br />
              <span
                className="font-display-italic text-ink-soft"
                style={{ fontStyle: "italic" }}
              >
                the cycles
              </span>
            </h1>
          </div>
          <div className="col-span-4 flex flex-col items-end justify-between text-right pt-1">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-soft">
                Dateline
              </p>
              <p
                className="font-display text-ink mt-0.5"
                style={{ fontSize: 26, lineHeight: 1.1 }}
              >
                {headline}
              </p>
            </div>
            <div className="text-[10px] font-mono leading-[1.5] tracking-wide text-ink-soft">
              sinusoidal-history.skylarkcreations.com
              <br />
              <span className="italic font-display-italic text-[12px] text-ink/70">
                by Skylark Creations
              </span>
            </div>
          </div>
        </header>

        {/* Editorial standfirst */}
        <div className="grid grid-cols-12 gap-8 mt-1 mb-7">
          <div className="col-span-8 col-start-1 border-t border-ink/30 pt-3">
            <p
              className="font-display-italic text-ink/80 leading-snug"
              style={{ fontSize: 19 }}
            >
              Seven long-wave theories of history, each calibrated to a single
              documented peak. Drawn together to ask whose curve fits whose
              century — and where every cycle&apos;s reach exceeds its grasp.
            </p>
          </div>
        </div>

        {/* Cycle rows */}
        <div className="flex-1 flex flex-col gap-3.5">
          {effectiveCycles.map((cycle, idx) => {
            const label = phasePositionLabel(cycle, currentYear);
            const progress = phaseProgressPercent(cycle, currentYear);
            return (
              <PosterRow
                key={cycle.id}
                cycle={cycle}
                idx={idx}
                label={label}
                progressPercent={progress}
              />
            );
          })}
        </div>

        {/* Footer with editorial colophon */}
        <footer className="mt-10 pt-4 border-t border-ink/30 grid grid-cols-12 gap-8 items-baseline">
          <div className="col-span-8 text-[11px] tracking-[0.18em] uppercase text-ink-soft">
            <span className="font-display-italic normal-case tracking-normal text-[14px] text-ink/85">
              Drawn from
            </span>{" "}
            Khaldun · Kondratiev · Huntington · Perez · Turchin · Dalio ·
            Strauss-Howe
          </div>
          <div className="col-span-4 text-right text-[11px] font-mono uppercase tracking-[0.2em] text-ink-soft">
            cycles are contested ·
            <br />
            a comparison tool, not prophecy
          </div>
        </footer>
      </div>
    </div>
  );
}

function PosterRow({
  cycle,
  idx,
  label,
  progressPercent,
}: {
  cycle: Cycle;
  idx: number;
  label: PhasePositionLabel;
  progressPercent: number;
}) {
  return (
    <div className="grid grid-cols-12 gap-5 items-center border-t border-rule/40 pt-3.5">
      {/* Numerical eyebrow column */}
      <div className="col-span-1 flex items-start gap-2">
        <span className="font-mono text-[11px] text-ink-soft/70 tabular-nums tracking-wider">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <span
          aria-hidden
          className="block w-[3px] self-stretch rounded-full"
          style={{ backgroundColor: cycle.color, minHeight: 56 }}
        />
      </div>
      {/* Title + standfirst column */}
      <div className="col-span-6 min-w-0">
        <h3
          className="font-display tracking-tight text-ink"
          style={{ fontSize: 24, lineHeight: 1.05 }}
        >
          {cycle.name}
        </h3>
        <p
          className="text-ink-soft mt-1 leading-snug max-w-[640px] truncate"
          style={{ fontSize: 13 }}
        >
          {cycle.short_description}
        </p>
        <div className="flex items-baseline gap-3 mt-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/85">
            Period {cycle.period_years}y
          </span>
          <span className="text-ink-soft/40">·</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/85">
            Peak {cycle.reference_peak_year}
          </span>
          <span className="text-ink-soft/40">·</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft/85">
            {confidenceTag(cycle.confidence_level)}
          </span>
        </div>
      </div>
      {/* Phase gauge */}
      <div className="col-span-3">
        <PhaseGauge percent={progressPercent} color={cycle.color} />
      </div>
      {/* Phase label */}
      <div
        className="col-span-2 text-right font-display"
        style={{
          fontSize: 30,
          letterSpacing: "-0.02em",
          color: cycle.color,
        }}
      >
        <span style={{ fontStyle: "italic" }}>{labelWord(label).toLowerCase()}</span>
      </div>
    </div>
  );
}

function PhaseGauge({
  percent,
  color,
}: {
  percent: number;
  color: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="space-y-1.5">
      <div className="relative h-[3px] bg-ink/15 overflow-visible">
        <div
          className="absolute inset-y-0 left-0"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
        <div
          aria-hidden
          className="absolute -top-1 bottom-[-4px] left-1/2 w-px bg-ink/35"
        />
      </div>
      <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-ink-soft/65">
        <span>trough</span>
        <span>peak</span>
        <span>trough</span>
      </div>
    </div>
  );
}
