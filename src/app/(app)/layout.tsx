import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b border-rule/30 bg-paper">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-5 pb-4 sm:pt-7 sm:pb-5 flex items-end justify-between gap-4">
          <Link href="/" className="group block">
            <span className="block text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
              Skylark Creations
            </span>
            <span className="font-display block text-[22px] sm:text-[28px] leading-none mt-1.5 text-ink group-hover:text-ink-soft transition-colors">
              Sinusoidal History
            </span>
          </Link>
          <nav
            aria-label="Primary"
            className="flex gap-4 sm:gap-6 text-[12px] sm:text-[13px] uppercase tracking-[0.18em] text-ink-soft pb-1"
          >
            <Link href="/" className="hover:text-ink transition-colors">
              Overlay
            </Link>
            <Link href="/poster" className="hover:text-ink transition-colors">
              Poster
            </Link>
            <Link
              href="/methods"
              className="hidden xs:inline hover:text-ink transition-colors"
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
          <span className="ml-auto flex gap-4 uppercase tracking-[0.18em]">
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
