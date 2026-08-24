import Link from "next/link";
import { cycles } from "@/data/cycles";
import { SITE_URL } from "@/lib/siteConfig";

export const metadata = {
  title: "Embed · Sinusoidal History",
  alternates: { canonical: "/embed/docs" },
};

const SNIPPETS: ReadonlyArray<{
  title: string;
  description: string;
  src: string;
  height: number;
}> = [
  {
    title: "State of the cycles (most embeddable)",
    description:
      "Just the summary panel. Small, scannable, shareable. Ideal for inline Substack embeds.",
    src: "/embed?view=state-only",
    height: 360,
  },
  {
    title: "Full facets, modern window",
    description:
      "The facet stack zoomed to 1900+. Interactive where the iframe allows.",
    src: "/embed?view=facets&range=modern",
    height: 900,
  },
  {
    title: "Huntington only, with calibration",
    description:
      "Filter to a single cycle and override its peak year — useful for arguing a specific claim in prose.",
    src: "/embed?view=facets&cycles=huntington&peak.huntington=1968",
    height: 280,
  },
  {
    title: "Classic overlay",
    description: "Phase 1 single-SVG view with every cycle and data series.",
    src: "/embed?view=overlay&range=modern",
    height: 620,
  },
];

export default function EmbedDocs() {
  return (
    /* w-full: this div is a DIRECT flex item of <body class="flex flex-col">
       (no (app) <main> wrapper on /embed routes), and mx-auto suppresses the
       flex cross-axis stretch — the page sized to fit-content (~750px) on a
       390px phone, clipping prose mid-sentence. Journey-walk 2026-08-24, J9. */
    <div className="w-full max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Embed Sinusoidal History
      </h1>
      <p className="mt-2 text-foreground/70">
        The <code>/embed</code>{" "}routes are iframe-safe and URL-driven. Set the
        view, range, cycle filter, and any calibration overrides via query
        string. All embeds link back to the main site and to{" "}
        <Link
          href="/methods"
          className="underline underline-offset-2 hover:text-foreground"
        >
          methods
        </Link>
        .
      </p>

      <section className="mt-8 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">Query params</h2>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li>
            <code className="font-mono">view</code> —{" "}
            <code>facets</code> (default), <code>overlay</code>, or{" "}
            <code>state-only</code>. State-only is the single summary panel.
          </li>
          <li>
            <code className="font-mono">range</code>{" "}— preset name (
            <code>all</code>, <code>industrial</code>, <code>modern</code>,{" "}
            <code>living</code>, <code>now</code>) or explicit{" "}
            <code>1900-2050</code>.
          </li>
          <li>
            <code className="font-mono">cycles</code>{" "}— comma-separated cycle
            ids (e.g.{" "}<code>cycles=turchin,dalio</code>). Omit for all.
          </li>
          <li>
            <code className="font-mono">peak.&lt;id&gt;</code> and{" "}
            <code className="font-mono">period.&lt;id&gt;</code>{" "}— per-cycle
            calibration overrides. E.g.{" "}
            <code>peak.huntington=1968&amp;period.huntington=58</code>.
          </li>
        </ul>
        <p className="text-xs text-foreground/55">
          Available cycle ids:{" "}
          {cycles.map((c, i) => (
            <span key={c.id}>
              <code className="font-mono">{c.id}</code>
              {i < cycles.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </section>

      <section className="mt-10 space-y-8">
        <h2 className="text-lg font-semibold">Copy-paste snippets</h2>
        {SNIPPETS.map((snippet) => {
          const src = `${SITE_URL}${snippet.src}`;
          const code = `<iframe\n  src="${src}"\n  width="100%"\n  height="${snippet.height}"\n  style="border:1px solid #e5e7eb;border-radius:8px"\n  loading="lazy"\n></iframe>`;
          return (
            <div key={snippet.src} className="space-y-2">
              <h3 className="font-semibold">{snippet.title}</h3>
              <p className="text-sm text-foreground/70">
                {snippet.description}
              </p>
              <pre className="text-xs overflow-x-auto rounded-md border border-foreground/15 bg-foreground/[0.03] p-3 font-mono whitespace-pre">
                {code}
              </pre>
              <p className="text-xs text-foreground/55 font-mono break-all">
                preview:{" "}
                <Link
                  href={snippet.src}
                  className="underline underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  {snippet.src}
                </Link>
              </p>
            </div>
          );
        })}
      </section>

      <section className="mt-10 space-y-3 text-foreground/80">
        <h2 className="text-lg font-semibold text-foreground">Cross-origin</h2>
        <p className="text-sm">
          The app sets{" "}
          <code className="font-mono">
            Content-Security-Policy: frame-ancestors *
          </code>{" "}
          and omits <code className="font-mono">X-Frame-Options</code> on{" "}
          <code>/embed/*</code>{" "}routes. You can embed from any origin.
        </p>
      </section>
    </div>
  );
}
