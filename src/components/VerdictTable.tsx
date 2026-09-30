import Link from "next/link";
import { cycles } from "@/data/cycles";
import { cycleRoutePath, cycleTheorist } from "@/lib/cycleRoutes";
import { SPECTRAL_STATE_LABELS, spectralPrimary } from "@/lib/spectral";

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
      {/* Phones get a stacked list: the table below is 36rem wide, and at 393px its Verdict
          column sat wholly off-screen behind an unmarked sideways scroll (I-012, measured
          2026-09-30). Same pattern as /state's list (I-011). The verdict leads, in words. */}
      {/* role="list": Safari drops list semantics once list-style is none (Tailwind Preflight). */}
      <ol role="list" className="sm:hidden border-t border-rule/30">
        {VERDICT_ROWS.map(({ v, cycle, yearsShort }) => (
          <li
            key={v.cycle_id}
            data-verdict-id={v.cycle_id}
            className="border-t border-rule/20 first:border-t-0 pb-3"
          >
            <Link
              href={`${cycleRoutePath(cycle)}#does-it-hold-up`}
              className="inline-flex items-center min-h-11 font-display text-[18px] tracking-tight font-medium text-ink underline decoration-ink/25 underline-offset-[3px] hover:decoration-ink transition-colors"
            >
              {cycleTheorist(cycle)}
            </Link>
            <p className="text-[16px] leading-snug text-ink">
              <span data-field="verdict" className="font-medium">
                {SPECTRAL_STATE_LABELS[v.state]}
              </span>
              {" · "}
              {/* The label rides inside each data-field span with its value, so a check
                  that reads "72y record" also catches a swapped label (as on /state). */}
              <span data-field="short" className="whitespace-nowrap tabular-nums">
                {yearsShort > 0 ? `needs ${yearsShort} more years` : "long enough"}
              </span>
            </p>
            <p className="mt-1 font-mono text-[12px] leading-relaxed text-ink-soft tabular-nums">
              <span data-field="period" className="whitespace-nowrap">
                {`${v.period_years}y period`}
              </span>
              {" · "}
              <span data-field="record" className="whitespace-nowrap">
                {`${v.span_years}y record`}
              </span>
              {" · "}
              <span data-field="periods" className="whitespace-nowrap">
                {`${v.cycles_covered.toFixed(1)} of 3.0 periods`}
              </span>
            </p>
          </li>
        ))}
        {UNPAIRED.map((cycle) => (
          <li
            key={cycle.id}
            data-verdict-id={cycle.id}
            className="border-t border-rule/20 pb-3"
          >
            <Link
              href={cycleRoutePath(cycle)}
              className="inline-flex items-center min-h-11 font-display text-[18px] tracking-tight font-medium text-ink-soft underline decoration-ink/25 underline-offset-[3px] hover:decoration-ink transition-colors"
            >
              {cycleTheorist(cycle)}
            </Link>
            <p className="text-[14px] italic text-ink-soft">
              <span data-field="untested">Not tested — no paired series</span>
              {" · "}
              <span data-field="period" className="whitespace-nowrap not-italic font-mono text-[12px] tabular-nums">
                {`${cycle.period_years}y period`}
              </span>
            </p>
          </li>
        ))}
      </ol>
      <div className="hidden sm:block overflow-x-auto border-t border-rule/30">
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
                {/* The same words the phone list leads with, not the raw state code (round 2,
                    2026-09-30). It wraps inside the cell rather than widening the table. */}
                <td className="py-3 text-[14px] leading-snug text-ink">
                  {SPECTRAL_STATE_LABELS[v.state]}
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
