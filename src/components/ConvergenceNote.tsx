export default function ConvergenceNote() {
  return (
    <div
      role="note"
      className="rounded-md border border-foreground/15 bg-foreground/[0.02] p-3 sm:p-4 text-sm text-foreground/75"
    >
      <p className="font-medium text-foreground">
        Notice how cycles tend to peak near the present.
      </p>
      <p className="mt-1">
        That&apos;s not convergence — it&apos;s publication bias. Theorists
        calibrate against moments that matter to them. Drag the time-range
        below or click any cycle to see how much the peak-year choice is doing.
      </p>
    </div>
  );
}
