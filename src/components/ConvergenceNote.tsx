export default function ConvergenceNote() {
  return (
    <aside
      role="note"
      aria-label="Editor's note on apparent convergence"
      className="relative grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 px-1 py-1"
    >
      <div className="self-stretch w-[2px] bg-ink/25" aria-hidden />
      <div className="py-1">
        <p className="font-display-italic text-[20px] sm:text-[24px] leading-[1.25] text-ink">
          Notice how the cycles tend to peak near the present.
        </p>
        <p className="mt-2.5 text-[13px] sm:text-[14px] leading-relaxed text-ink-soft max-w-2xl">
          That is not convergence - it is a selection effect. Theorists
          writing today anchor their forecasts to the world they live in,
          and we read them precisely because their climaxes happen to land
          in our era. Drag the time-range below or click any cycle to see
          how much the peak-year choice is doing.
        </p>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.28em] text-ink-soft/70 font-medium">
          Editor&apos;s note
        </p>
      </div>
    </aside>
  );
}
