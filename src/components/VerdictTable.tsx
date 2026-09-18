import Link from "next/link";
import { cycles } from "@/data/cycles";
import { cycleRoutePath, cycleTheorist } from "@/lib/cycleRoutes";
import { spectralPrimary } from "@/lib/spectral";

// One row per primary verdict, in verdicts.json order (ascending period). Every value is
// read from the frozen verdicts.json; the shortfall uses the exact span, never the rounded
// cycles_covered — the same arithmetic as each cycle page's "Does it hold up?" block.
const VERDICT_ROWS = spectralPrimary.map((v) => ({
  v,
  cycle: cycles.find((c) => c.id === v.cycle_id)!,
  yearsShort: v.eligible ? 0 : Math.max(0, Math.ceil(3 * v.period_years - v.span_years)),
}));
const UNPAIRED = cycles.filter((c) => !spectralPrimary.some((v) => v.cycle_id === c.id));

// Shared by /methods (#spectral-testing) and the /cycles index. Each row lands on that
// cycle page's answer block (#does-it-hold-up). public/methods.md mirrors these rows and
// src/lib/spectral.test.ts fails if the mirror drifts.
export default function VerdictTable() {
  return (
    <>
      <div className="overflow-x-auto border-t border-rule/30">
        <table className="w-full text-left border-collapse min-w-[36rem]">
          <caption className="sr-only">Spectral verdict for each cycle–series pairing</caption>
          <thead>
            <tr className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/80">
              <th scope="col" className="py-3 pr-3 font-medium sticky left-0 bg-paper">
                Cycle
              </th>
              <th scope="col" className="py-3 pr-3 font-medium text-right">
                Period
              </th>
              <th scope="col" className="py-3 pr-3 font-medium text-right">
                Record
              </th>
              <th scope="col" className="py-3 pr-3 font-medium text-right">
                Periods of 3.0
              </th>
              <th scope="col" className="py-3 pr-3 font-medium text-right">
                Years short
              </th>
              <th scope="col" className="py-3 font-medium">
                Verdict
              </th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {VERDICT_ROWS.map(({ v, cycle, yearsShort }) => (
              <tr key={v.cycle_id} className="border-t border-rule/20">
                <td className="py-3 pr-3 sticky left-0 bg-paper">
                  <Link
                    href={`${cycleRoutePath(cycle)}#does-it-hold-up`}
                    className="font-display text-[16px] tracking-tight font-medium text-ink underline decoration-ink/25 underline-offset-[3px] hover:decoration-ink transition-colors"
                  >
                    {cycleTheorist(cycle)}
                  </Link>
                </td>
                <td className="py-3 pr-3 text-right font-mono text-[13px] text-ink/85 tabular-nums">
                  {`${v.period_years}y`}
                </td>
                <td className="py-3 pr-3 text-right font-mono text-[13px] text-ink/85 tabular-nums">
                  {`${v.span_years}y`}
                </td>
                <td className="py-3 pr-3 text-right font-mono text-[13px] text-ink/85 tabular-nums">
                  {v.cycles_covered.toFixed(1)}
                </td>
                <td className="py-3 pr-3 text-right font-mono text-[13px] text-ink/85 tabular-nums">
                  {yearsShort > 0 ? `+${yearsShort}` : "—"}
                </td>
                <td className="py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/80">
                  {v.state}
                </td>
              </tr>
            ))}
            {UNPAIRED.map((cycle) => (
              <tr key={cycle.id} className="border-t border-rule/20">
                <td className="py-3 pr-3 sticky left-0 bg-paper">
                  <Link
                    href={cycleRoutePath(cycle)}
                    className="font-display text-[16px] tracking-tight font-medium text-ink-soft underline decoration-ink/25 underline-offset-[3px] hover:decoration-ink transition-colors"
                  >
                    {cycleTheorist(cycle)}
                  </Link>
                </td>
                <td className="py-3 pr-3 text-right font-mono text-[13px] text-ink-soft tabular-nums">
                  {`${cycle.period_years}y`}
                </td>
                <td colSpan={4} className="py-3 text-[13px] italic text-ink-soft">
                  Not tested — no paired series
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[13px] leading-relaxed text-ink-soft">
        {`Record is the span of the series each verdict actually tests — for some pairings a different cut from the one drawn on the chart, named on that cycle's page. Years short is how much longer that record would need to be to reach three periods.`}
      </p>
    </>
  );
}
