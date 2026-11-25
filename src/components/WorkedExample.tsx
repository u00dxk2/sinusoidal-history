import type { Cycle } from "@/data/types";
import { cycles } from "@/data/cycles";
import type { NormalizedPoint } from "@/lib/seriesMath";
import {
  curveRows,
  plain,
  recordWorking,
  scaleFormula,
  signed,
} from "@/lib/workedExample";

/**
 * "Worked example": this page's arithmetic with this cycle's own numbers (2026-11-21).
 * Server-rendered, so it is in the HTML a crawler or a reader without JavaScript gets.
 * The numbers come from src/lib/workedExample.ts; the words are claims-checked
 * (docs/claims/2026-11-21-worked-example-codex-claims.md).
 */
export default function WorkedExample({
  cycle,
  year,
  overlay,
  recordName,
  transform,
  periodsRequired,
}: {
  cycle: Cycle;
  year: number;
  /** The points the page figure draws (chartLinePoints), already scaled. */
  overlay: readonly NormalizedPoint[];
  /** The judged record's full name, or null on an unpaired cycle. */
  recordName: string | null;
  transform: string | undefined;
  periodsRequired: number;
}) {
  const rows = curveRows(cycle, year);
  const record = recordName ? recordWorking(overlay, transform) : null;
  const log = transform === "log1p";
  const peak = cycle.reference_peak_year;
  const period = cycle.period_years;
  const amp = cycle.amplitude_normalized;
  const allUnit = cycles.every((c) => c.amplitude_normalized === 1);
  const th = "py-1.5 pr-4 text-left font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft/80";
  const td = "py-1.5 pr-4 font-mono text-[13px] text-ink/85 tabular-nums";

  return (
    <section className="mt-10" id="worked-example">
      <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
        Worked example
      </h2>
      <p className="text-[14px] leading-relaxed text-ink-soft mb-4">
        How this page&apos;s curve{record ? " and record line are" : " is"} computed, with this cycle&apos;s own numbers.
      </p>

      <h3 className="font-display text-[18px] tracking-tight text-ink mb-2">The curve</h3>
      <p className="font-mono text-[13px] text-ink/85 mb-2">
        {`curve height = ${amp === 1 ? "" : `${amp} × `}cos(2π × (year − ${peak}) ÷ ${period})`}
      </p>
      <p className="text-[14px] leading-relaxed text-ink-soft mb-3">
        {`${peak} is the reference peak and ${period} is the period in years this site uses for the theory.`}
        {amp === 1 && allUnit
          ? " The code also multiplies by an amplitude, which is 1 for every cycle on this site, so it changes nothing."
          : ""}
        {" "}A quarter of a period separates each peak or low from the midline. The rows step through the stretch this page draws a quarter of a period at a time, counted from the reference peak.
      </p>
      {/* No year column (2026-11-25): David's I-090 yes covers years from the historical record,
          not the construction's own quarter-period years, so this table names none (Codex diff
          review finding 2; the primer's prepared shape). The record block below keeps its years. */}
      <table className="mb-6 border-t border-rule/30">
        <thead>
          <tr>
            <th scope="col" className={th}>(year − peak) ÷ period</th>
            <th scope="col" className={th}>Curve height</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.fraction} className="border-t border-rule/20">
              <td className={td}>{signed(r.fraction, 2)}</td>
              <td className={td}>{signed(r.height, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {record && recordName && (
        <>
          <h3 className="font-display text-[18px] tracking-tight text-ink mb-2">The record line</h3>
          <p className="text-[14px] leading-relaxed text-ink-soft mb-2">
            {`The line drawn below the curve is ${recordName}, ${record.first}–${record.last}, on its own scale.`}
            {log ? " Each value is first replaced by ln(1 + value)." : ""}
            {` Its lowest ${log ? "working " : ""}value, first reached in ${record.low.year}, is drawn at −1 and its highest, first reached in ${record.high.year}, at +1. Every other value is scaled in proportion between those two. The scale is set by the whole record, not only the years the curve covers.`}
          </p>
          <p className="font-mono text-[13px] text-ink/85 mb-3">
            {log
              ? scaleFormula("ln(1 + value)", Number(record.low.working.toFixed(3)), Number(record.high.working.toFixed(3)), true)
              : scaleFormula("value", record.low.raw, record.high.raw, false)}
          </p>
          <table className="mb-4 border-t border-rule/30">
            <thead>
              <tr>
                <th scope="col" className={th}>Year</th>
                <th scope="col" className={th}>Value</th>
                {log && <th scope="col" className={th}>ln(1 + value)</th>}
                <th scope="col" className={th}>Plotted height</th>
              </tr>
            </thead>
            <tbody>
              {record.rows.map((r) => (
                <tr key={r.year} className="border-t border-rule/20">
                  <td className={td}>{r.year}</td>
                  <td className={td}>{plain(r.raw)}</td>
                  {log && <td className={td}>{plain(Number(r.working.toFixed(3)))}</td>}
                  <td className={td}>{signed(r.plotted, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[14px] leading-relaxed text-ink-soft">
            {`Years covered: ${record.last} − ${record.first} = ${record.span}. Divided by the period, ${record.span} ÷ ${period} = ${(record.span / period).toFixed(2)} periods. This site requires ${periodsRequired.toFixed(1)} before it will run a test; the verdict above gives the figure to one decimal.`}
          </p>
        </>
      )}
    </section>
  );
}
