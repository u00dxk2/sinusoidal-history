import type { Metadata } from "next";
import Link from "next/link";
import { cycles } from "@/data/cycles";
import {
  confidenceLabel,
  cycleRoutePath,
  seriesForCycle,
} from "@/lib/cycleRoutes";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

const TITLE = "The ten cycles";
const DESCRIPTION =
  "Ten long-wave cycles of history — Schlesinger Jr., Turchin's fathers-and-sons, Kondratiev, Perez, Huntington, Dalio, Strauss-Howe, Modelski, Khaldun, Turchin's secular cycle — each with its period, reference peak, sourcing, and paired data series.";

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

// The published "excluded and why" list. Hand-written by design: exclusion
// reasons are editorial judgments with citations, not derivable data. Every
// quote below was verified against the primary text 2026-08-18.
const EXCLUDED: { name: string; reason: string }[] = [
  {
    name: "Goldstein — war/hegemony waves (~50y)",
    reason:
      "Goldstein himself forecloses the sinusoid: \"The efforts to identify war cycles based on fixed periodicities are a self-proclaimed dead-end\" (Long Cycles: Prosperity and War in the Modern Age, 1988, p. 111; similarly p. 99), and he calls fixed-periodicity methodology \"inappropriate for social cycles\" (p. 244). He affirms non-periodic long waves in war — which is exactly what a fixed cosine cannot represent. His own data files also carry no explicit reuse license.",
  },
  {
    name: "Arrighi — systemic cycles of accumulation",
    reason:
      "No fixed period by design: his cycles overlap and shorten over time (Genoese → Dutch → British → American), so no single period_years exists to plot.",
  },
  {
    name: "Sornette — log-periodic power laws",
    reason:
      "Log-periodic means the oscillation interval shrinks toward a critical time; there is no constant year-period, so a fixed sinusoid misstates the mathematics.",
  },
  {
    name: "Toynbee, Spengler, Vico, Sorokin, Quigley, Tainter",
    reason:
      "Civilizational rise-and-fall narratives without a theorist-stated period in years. The bar requires their number, not one imposed on them.",
  },
  {
    name: "Namenwirth/Weber — cultural value cycles",
    reason:
      "The claimed ~152-year cycle was fitted on roughly 120 years of data — it never once repeated inside its own evidence — and the shorter cycle is a median of fits ranging widely. Replication failed on German data (Mohler 1987, Eur. J. Political Research 15) and the extraction method was shown to manufacture cycles from the filtering itself (Thome & Rahlf, \"Dubious cycles,\" Quality & Quantity 30(4), 1996). No machine-readable series exists.",
  },
  {
    name: "Forrester — System Dynamics long wave",
    reason:
      "A simulation model reproducing Kondratieff-like waves, not an independent historical periodization with its own anchor; cross-referenced under Kondratiev instead.",
  },
  {
    name: "Berry — long-wave rhythms (~56y)",
    reason:
      "A US-dated restatement of the Kondratieff rather than an independent construct; folded into the Kondratiev entry's literature rather than plotted twice.",
  },
];

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
          a single documented reference peak. Nine of the ten are paired with
          a real long-run data series. Follow a cycle for its calibration
          rationale, sourcing, and provenance — or see all ten together on{" "}
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

      <section className="mt-14">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Considered and excluded
        </h2>
        <p className="text-[14px] leading-relaxed text-ink-soft mb-5">
          A theory enters the roster only with an explicit period in years
          from the theorist&apos;s primary text, a defensible anchor peak, and
          a citable source. These famous candidates fail that bar — the
          reasons are as instructive as the roster itself.
        </p>
        <ul className="space-y-4 border-t border-rule/30 pt-5">
          {EXCLUDED.map((e) => (
            <li key={e.name} className="text-[14px] leading-[1.6]">
              <span className="font-display text-[16px] tracking-tight font-medium text-ink">
                {e.name}
              </span>{" "}
              <span className="text-ink/80">— {e.reason}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] leading-relaxed text-ink-soft border-l-2 border-ink/40 pl-3.5">
          <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft/80 mr-1.5 font-mono">
            Queued
          </span>
          Klingberg&apos;s foreign-policy mood cycle (~48y: phases later
          scholarship reports as averaging ~21 introvert + ~27 extrovert
          years; Klingberg 1952, <em>World Politics</em> 4(2)) passes the
          theory bar, but no candidate paired series clears this site&apos;s
          redistribution-license requirement yet. It ships when its data
          does.
        </p>
      </section>

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
