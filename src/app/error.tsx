"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">
        error
      </p>
      <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
        Something broke in this view.
      </h1>
      <p className="mt-4 text-foreground/70 max-w-md mx-auto">
        {/* It names no cause: the chart catches its own data-file fetch failures
            (useCsvSeries), and no single cause can be stated from this boundary (I-087). */}
        This view could not be displayed. Try it again, or go back to the{" "}
        <Link
          href="/"
          className="underline underline-offset-2 hover:text-foreground"
        >
          chart
        </Link>
        .
      </p>
      {error.digest && (
        <p className="mt-3 text-xs text-foreground/40 font-mono">
          ref · {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center rounded-md border border-foreground/30 px-3 py-1.5 text-sm hover:bg-foreground/5"
      >
        try again
      </button>
    </div>
  );
}
