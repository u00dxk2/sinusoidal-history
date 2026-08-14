import type { Metadata } from "next";
import Link from "next/link";
import { cycles } from "@/data/cycles";
import {
  confidenceLabel,
  cycleRoutePath,
  seriesForCycle,
} from "@/lib/cycleRoutes";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

const TITLE = "The eight cycles";
const DESCRIPTION =
  "Eight long-wave theories of history — Schlesinger Jr., Kondratiev, Perez, Huntington, Dalio, Strauss-Howe, Khaldun, Turchin — each with its period, reference peak, sourcing, and paired data series.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/cycles" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/cycles",
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: "/og", width: 1200, height: 630, alt: "State of the cycles snapshot" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og"],
  },
};

const byPeriod = [...cycles].sort((a, b) => a.period_years - b.period_years);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": `${SITE_URL}/cycles#termset`,
  name: "Long-wave theories of history",
  description: DESCRIPTION,
  url: `${SITE_URL}/cycles`,
  hasDefinedTerm: byPeriod.map((cycle) => ({
    "@type": "DefinedTerm",
    "@id": `${SITE_URL}${cycleRoutePath(cycle)}#term`,
    name: cycle.name,
    description: cycle.short_description,
    url: `${SITE_URL}${cycleRoutePath(cycle)}`,
  })),
};

export default function CyclesIndex() {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8">
        <p className="text-[11px] sm:text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
          Index · By ascending period
        </p>
        <h1
          className="font-display mt-3 text-ink leading-[0.98] tracking-[-0.015em]"
          style={{ fontSize: "clamp(40px, 6vw, 56px)" }}
        >
          {TITLE}
        </h1>
        <div className="editorial-rule mt-6" />
        <p className="mt-6 text-[16px] leading-[1.65] text-ink/85">
          Each theory is drawn as a pure sinusoid from its own stated period and
          a single documented reference peak. Seven of the eight are paired with
          a real long-run data series. Follow a cycle for its calibration
          rationale, sourcing, and provenance — or see all eight together on{" "}
          <Link
            href="/"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            one axis
          </Link>
          .
        </p>
      </header>

      <ul className="mt-10">
        {byPeriod.map((cycle) => {
          const series = seriesForCycle(cycle);
          return (
            <li
              key={cycle.id}
              className="border-t border-rule/30 py-5 first:border-t-0 first:pt-0"
            >
              <Link href={cycleRoutePath(cycle)} className="group block">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    aria-hidden
                    className="inline-block w-[3px] h-5 self-stretch rounded-full"
                    style={{ backgroundColor: cycle.color }}
                  />
                  <h2 className="font-display text-[20px] tracking-tight text-ink font-medium group-hover:text-ink-soft transition-colors">
                    {cycle.name}
                  </h2>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/85">
                    {cycle.period_years}y · peak {cycle.reference_peak_year} ·{" "}
                    {confidenceLabel(cycle.confidence_level)}
                  </span>
                </div>
                <p className="mt-2 text-[15px] leading-snug text-ink/85">
                  {cycle.short_description}
                </p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft font-mono">
                  {series
                    ? `Paired data — ${series.name}`
                    : "No paired data series this round"}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <footer className="mt-10 pt-4 border-t border-rule/30 text-[13px] text-ink-soft">
        <Link
          href="/methods"
          className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
        >
          Methods and provenance
        </Link>
        {" · "}
        <Link
          href="/about"
          className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
        >
          What this is
        </Link>
      </footer>
    </div>
  );
}
