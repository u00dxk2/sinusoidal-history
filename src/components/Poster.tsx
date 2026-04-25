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
      return "quantitative";
    case "empirical":
      return "empirical";
    case "empirical-contested":
      return "empirical · contested";
    case "narrative":
      return "narrative";
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
        backgroundColor: "#ffffff",
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
    <div className="min-h-screen bg-foreground/[0.02] py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-[1240px] mb-4 flex items-baseline justify-end gap-3 print:hidden">
        <Link
          href="/"
          className="text-xs text-foreground/60 underline underline-offset-2"
        >
          ← back to interactive
        </Link>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-md border border-foreground/30 bg-background px-3 py-1.5 text-sm font-medium hover:bg-foreground/5 disabled:opacity-50"
        >
          {downloading ? "rendering…" : "download PNG"}
        </button>
      </div>

      <div
        ref={posterRef}
        style={{ width: 1200, minHeight: 800 }}
        className="bg-background text-foreground flex flex-col px-16 py-14 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-foreground/15"
      >
        <header className="mb-8 flex items-baseline justify-between gap-6">
          <div>
            <p className="text-[13px] tracking-[0.22em] uppercase text-foreground/50 font-medium">
              Sinusoidal History
            </p>
            <h1 className="mt-2 text-[40px] leading-[1.05] font-semibold tracking-tight">
              State of the cycles · {headline}
            </h1>
            <p className="mt-3 text-[15px] text-foreground/60 max-w-xl">
              Seven long-wave theories, each a pure sinusoid calibrated to a
              single documented peak. Where they agree, where they diverge.
            </p>
          </div>
          <div className="text-right text-xs text-foreground/55 font-mono leading-relaxed flex-shrink-0">
            sinusoidalhistory.skylarkcreations.com
            <br />
            by Skylark Creations
          </div>
        </header>

        <div className="flex-1 flex flex-col gap-4">
          {effectiveCycles.map((cycle) => {
            const label = phasePositionLabel(cycle, currentYear);
            const progress = phaseProgressPercent(cycle, currentYear);
            return (
              <PosterRow
                key={cycle.id}
                cycle={cycle}
                label={label}
                progressPercent={progress}
              />
            );
          })}
        </div>

        <footer className="mt-10 pt-5 border-t border-foreground/15 flex items-baseline justify-between text-[11px] text-foreground/55 font-mono">
          <div>
            drawn from Khaldun · Kondratiev · Huntington · Perez · Turchin ·
            Dalio · Strauss-Howe
          </div>
          <div>
            cycles are contested · a comparison tool, not prophecy
          </div>
        </footer>
      </div>
    </div>
  );
}

function PosterRow({
  cycle,
  label,
  progressPercent,
}: {
  cycle: Cycle;
  label: PhasePositionLabel;
  progressPercent: number;
}) {
  return (
    <div className="grid grid-cols-[1.5rem_1fr_280px_150px] items-center gap-5">
      <div
        aria-hidden
        className="h-12 w-2 rounded"
        style={{ backgroundColor: cycle.color }}
      />
      <div className="min-w-0">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-[22px] font-semibold tracking-tight">
            {cycle.name}
          </span>
          <span className="text-[11px] font-mono text-foreground/50">
            period {cycle.period_years}y · peak {cycle.reference_peak_year}
          </span>
        </div>
        <p className="mt-0.5 text-[13px] text-foreground/65 truncate max-w-[700px]">
          {cycle.short_description}
        </p>
        <p className="text-[10px] font-mono text-foreground/45 mt-0.5">
          confidence · {confidenceTag(cycle.confidence_level)}
        </p>
      </div>
      <PhaseGauge percent={progressPercent} color={cycle.color} />
      <div
        className="text-[30px] font-bold uppercase tracking-wide text-right"
        style={{ color: cycle.color }}
      >
        {labelWord(label)}
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
    <div className="relative h-4 rounded-full bg-foreground/10 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-[width]"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-px bg-foreground/30"
      />
      <div className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-mono uppercase tracking-wide text-foreground/50">
        <span>trough</span>
        <span>peak</span>
        <span>trough</span>
      </div>
    </div>
  );
}

