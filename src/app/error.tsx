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
        Most likely a CSV failed to load. The cycles themselves still draw
        without data — try reloading, or head back to the{" "}
        <Link
          href="/"
          className="underline underline-offset-2 hover:text-foreground"
        >
          overlay
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
