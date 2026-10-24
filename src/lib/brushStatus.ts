import { RANGE_PRESET_OPTIONS } from "@/lib/siteConfig";
import { widenToMinSpan } from "@/lib/urlState";

/**
 * What a gesture on the zoom strip did to the chart's window (I-064, 2026-10-24). Cold walkers
 * on 10-21 and 10-22 could not tell: a drag inside the selection moved it with no word, and every
 * short drag near the present landed on the Modern window ("a slow Modern button"). The strip now
 * names the outcome and the window the chart shows, never the years the reader dragged (I-062).
 */
export type BrushOutcome = "chosen" | "widened" | "moved" | "reset";

export interface BrushResult {
  outcome: BrushOutcome;
  start: number;
  end: number;
}

export interface BrushEnd {
  /** The d3-brush start event's mode: "drag" is a pan of the selection, "handle" a resize. */
  mode: string | undefined;
  /** The selection's edges in rounded years, or null when it was cleared. */
  lo: number | null;
  hi: number | null;
  visibleStart: number;
  visibleEnd: number;
  fullStart: number;
  fullEnd: number;
}

/** A selection narrower than this is read as a click, and shows every year. */
const CLICK_SPAN = 5;

export function resolveBrushEnd(e: BrushEnd): BrushResult {
  const reset: BrushResult = { outcome: "reset", start: e.fullStart, end: e.fullEnd };
  if (e.lo === null || e.hi === null) return reset;
  const lo = Math.min(e.lo, e.hi);
  const hi = Math.max(e.lo, e.hi);
  // A pan keeps the span it started with. Each edge is rounded on its own, so the span read back
  // can be off by a year, and a 150-year box would otherwise re-widen (manager review 704be81e).
  if (e.mode === "drag") {
    const span = e.visibleEnd - e.visibleStart;
    const start = Math.min(Math.max(lo, e.fullStart), e.fullEnd - span);
    return { outcome: "moved", start, end: start + span };
  }
  if (hi - lo < CLICK_SPAN) return reset;
  const wide = widenToMinSpan(lo, hi, e.fullStart, e.fullEnd);
  const widened = wide.start !== lo || wide.end !== hi;
  return { outcome: widened ? "widened" : "chosen", start: wide.start, end: wide.end };
}

/**
 * Which sentence the strip shows after a gesture. The status follows OUTCOMES, never pointer
 * events (I-062 r2): only a gesture that changed the window, or widened a drag, says anything.
 * Any other gesture leaves the line exactly as it was, including empty (Codex r1: a still press
 * on a handle erased the widening sentence; r2: a still press inside the box said "Moved").
 * The one exception: a widened drag always says so, even onto the window already shown (a short
 * drag at Modern, the 10-22 walk's "drags … did nothing").
 */
export function nextStatus(
  prev: BrushResult | null,
  r: BrushResult,
  visibleStart: number,
  visibleEnd: number,
): BrushResult | null {
  const unchanged = r.start === visibleStart && r.end === visibleEnd;
  if (!unchanged || r.outcome === "widened") return r;
  const shown = prev !== null && prev.start === visibleStart && prev.end === visibleEnd;
  return shown ? prev : null;
}

/**
 * What the strip says it did to the chart's window. Kept short of everything above and below it:
 * on a phone the chart is far above the strip, so it states the window rather than pointing.
 */
export function widenedNote(span: number): string {
  return `Widened to ${span} years, the shortest view this chart draws.`;
}

export function brushStatus(r: BrushResult): { widened: string | null; rest: string } {
  const preset = RANGE_PRESET_OPTIONS.find(
    (p) => p.id !== "all" && p.start === r.start && p.end === r.end,
  );
  const window =
    r.outcome === "reset"
      ? `Chart now shows every year, ${r.start}–${r.end}.`
      : `Chart now shows ${r.start}–${r.end}${preset ? `, the same as ${preset.label}` : ""}.`;
  return {
    widened: r.outcome === "widened" ? widenedNote(r.end - r.start) : null,
    rest:
      r.outcome === "moved"
        ? `Moved the selection; drag outside it to pick new years. ${window}`
        : window,
  };
}
