"use client";

import Link from "next/link";
import { designVariant } from "@/lib/designPass";
import {
  DP_ERROR_BODY,
  DP_ERROR_HEADING,
  DP_ERROR_HOME,
  DP_ERROR_RETRY,
} from "@/lib/designPassCopy";

export default function GlobalError({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  retry: () => void;
}) {
  // The design pass's error screen (docs/PRODUCT.md), only when its build-time flag is set.
  // It names no cause: none can be known from this boundary.
  if (designVariant()) {
    return (
      <div data-dp="" className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-[30px] sm:text-[40px] leading-[1.05] text-ink">
          {DP_ERROR_HEADING}
        </h1>
        <p className="dp-text mt-4 text-[16px] leading-[1.6] text-ink/85 max-w-md">
          {DP_ERROR_BODY}
        </p>
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1">
          {/* retry, not reset: this Next re-fetches and re-renders on retry(), and reset()
              would replay a failed server response (its docs, file-conventions/error.md). */}
          <button type="button" onClick={() => retry()} className="dp-cta">
            {DP_ERROR_RETRY}
          </button>
          <Link href="/" className="dp-link">
            {DP_ERROR_HOME}
          </Link>
        </p>
        {error.digest && (
          <p className="dp-text mt-6 text-[16px] text-ink-soft">
            Reference:{" "}{error.digest}
          </p>
        )}
      </div>
    );
  }

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
