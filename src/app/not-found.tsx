import Link from "next/link";
import { designVariant } from "@/lib/designPass";
import { DP_CTA, DP_ERROR_HOME, DP_NOT_FOUND_BODY, DP_NOT_FOUND_HEADING } from "@/lib/designPassCopy";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
  // The design pass's 404 (docs/PRODUCT.md), only when its build-time flag is set: what
  // happened, then the next step.
  if (designVariant()) {
    return (
      <div data-dp="" className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-[30px] sm:text-[40px] leading-[1.05] text-ink">
          {DP_NOT_FOUND_HEADING}
        </h1>
        <p className="dp-text mt-4 text-[16px] leading-[1.6] text-ink/85 max-w-md">
          {DP_NOT_FOUND_BODY}
        </p>
        <p className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1">
          <Link href="/cycles" className="dp-cta">
            {DP_CTA}
          </Link>
          <Link href="/" className="dp-link">
            {DP_ERROR_HOME}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <p className="text-xs font-mono uppercase tracking-widest text-foreground/50">
        404
      </p>
      <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight">
        Off the time axis
      </h1>
      <p className="mt-4 text-foreground/70 max-w-md mx-auto">
        That page either never existed or fell off a cycle. Try the{" "}
        <Link
          href="/"
          className="underline underline-offset-2 hover:text-foreground"
        >
          overlay
        </Link>
        ,{" "}
        <Link
          href="/poster"
          className="underline underline-offset-2 hover:text-foreground"
        >
          poster
        </Link>
        , or{" "}
        <Link
          href="/methods"
          className="underline underline-offset-2 hover:text-foreground"
        >
          methods
        </Link>
        .
      </p>
    </div>
  );
}
