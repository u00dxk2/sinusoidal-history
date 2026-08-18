import Link from "next/link";
import { statePath, stateYears } from "@/lib/stateOfCycles";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b border-rule/30 bg-paper">
        {/* flex-wrap, not nowrap: at 390px the logo + 5 nav links are wider
            than the viewport, which pushed the whole page into horizontal
            scroll and clipped "About" off the right edge. Wrapping drops the
            nav to its own line instead. Canon R29. */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-5 pb-4 sm:pt-7 sm:pb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <Link href="/" className="group block">
            <span className="block text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
              Skylark Creations
            </span>
            <span className="font-display block text-[22px] sm:text-[28px] leading-none mt-1.5 text-ink group-hover:text-ink-soft transition-colors">
              Sinusoidal History
            </span>
          </Link>
          <nav
            aria-label="Primary"
            /* [&>a]: the 44px tap-target floor applied once here rather than
               repeated on five links. -my-3 keeps the taller hit area from
               changing the header's visual rhythm. Canon R28. */
            className="flex flex-wrap gap-x-3 sm:gap-x-6 text-[12px] sm:text-[13px] uppercase tracking-[0.18em] text-ink-soft -my-3 [&>a]:inline-flex [&>a]:items-center [&>a]:min-h-11"
          >
            <Link href="/" className="hover:text-ink transition-colors">
              Overlay
            </Link>
            <Link href="/cycles" className="hover:text-ink transition-colors">
              Cycles
            </Link>
            <Link href="/poster" className="hover:text-ink transition-colors">
              Poster
            </Link>
            <Link
              href="/methods"
              /* was `hidden xs:inline` — but `xs` is not a configured
                 breakpoint here, so the variant never applied and this link
                 was hidden at EVERY width. Now that the nav wraps, it does
                 not need hiding at all. */
              className="hover:text-ink transition-colors"
            >
              Methods
            </Link>
            <Link href="/about" className="hover:text-ink transition-colors">
              About
            </Link>
          </nav>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="editorial-rule" />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-12 border-t border-rule/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex flex-wrap gap-x-6 gap-y-2 items-baseline text-[11px] tracking-wide text-ink-soft">
          <span className="font-display-italic text-[13px] text-ink/70">
            Cycles are contested. Data is messy. This is a comparison tool —
            not prophecy.
          </span>
          <span className="ml-auto flex gap-4 uppercase tracking-[0.18em] -my-2 [&>a]:inline-flex [&>a]:items-center [&>a]:min-h-11">
            {/* Latest published annual reading — build-time year, so this
                never links ahead of what the route will serve. */}
            <Link
              href={statePath(stateYears().at(-1)!)}
              className="hover:text-ink transition-colors"
            >
              State {stateYears().at(-1)}
            </Link>
            <Link
              href="/methods"
              className="hover:text-ink transition-colors"
            >
              Methods
            </Link>
            <Link
              href="/colophon"
              className="hover:text-ink transition-colors"
            >
              Colophon
            </Link>
            <Link
              href="/embed/docs"
              className="hover:text-ink transition-colors"
            >
              Embed
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
