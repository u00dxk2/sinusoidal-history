import Link from "next/link";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b border-foreground/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-semibold tracking-tight text-sm sm:text-base"
          >
            Sinusoidal History
          </Link>
          <nav
            aria-label="Primary"
            className="flex gap-3 sm:gap-4 text-xs sm:text-sm text-foreground/70"
          >
            <Link href="/" className="hover:text-foreground">
              Overlay
            </Link>
            <Link href="/poster" className="hover:text-foreground">
              Poster
            </Link>
            <Link
              href="/methods"
              className="hidden xs:inline hover:text-foreground"
            >
              Methods
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-foreground/10 text-xs text-foreground/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap gap-x-4 gap-y-1 items-center">
          <span>
            Phase 4 · cycles are contested, data is messy, this is a comparison
            tool not prophecy
          </span>
          <Link
            href="/methods"
            className="ml-auto underline underline-offset-2 hover:text-foreground/80"
          >
            methods
          </Link>
          <Link
            href="/embed/docs"
            className="underline underline-offset-2 hover:text-foreground/80"
          >
            embed
          </Link>
        </div>
      </footer>
    </>
  );
}
