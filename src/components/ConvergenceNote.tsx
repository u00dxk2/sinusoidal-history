// No display type, and the correction comes first (I-055, 2026-10-20). Two rewordings of a
// 20-24px display line failed cold walks (D1/D2 10-18, E1/E2 10-19): each walker lifted the
// line's opening clause, the pattern, as the site agreeing before the correction landed, and E2
// read the line as the site's headline because the label sat under it. So the shape changed
// instead of the words: the label leads, everything is body size, and the first sentence names
// the correction, not the pattern. Pinned by convergenceShape.test.ts.
export default function ConvergenceNote() {
  return (
    <aside
      role="note"
      aria-label="Editor's note on apparent convergence"
      className="relative grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 px-1 py-1"
    >
      <div className="self-stretch w-[2px] bg-ink/25" aria-hidden />
      <div className="py-1">
        <p className="text-[11px] uppercase tracking-[0.28em] text-ink-soft/70 font-medium">
          Editor&apos;s note
        </p>
        <p className="mt-1.5 text-[14px] sm:text-[15px] leading-relaxed text-ink-soft max-w-2xl">
          <span className="font-medium text-ink">A selection effect, not convergence.</span>{" "}
          Theorists writing today anchor their forecasts to the world they live in, and we read
          them precisely because their climaxes happen to land in our era. That is why nine of
          the ten peak years here fall between 1945 and 2020, and why this site draws each cycle
          as at most one period around its peak, cut at today, rather than a wave repeating into
          the present. Drag the range strip or select any cycle to see how much the peak-year
          choice is doing.
        </p>
      </div>
    </aside>
  );
}
