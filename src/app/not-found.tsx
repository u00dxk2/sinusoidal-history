import Link from "next/link";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
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
