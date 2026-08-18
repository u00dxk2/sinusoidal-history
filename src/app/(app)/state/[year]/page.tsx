import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  STATE_FIRST_YEAR,
  statePath,
  stateOfCycles,
  stateYears,
} from "@/lib/stateOfCycles";
import { SITE_MAKER, SITE_NAME, SITE_URL } from "@/lib/siteConfig";

type Params = { params: Promise<{ year: string }> };

/**
 * The annual reading, one page per year since 2026. Every number on this
 * page is derived from period + reference peak via the chart's own cosine —
 * no year-phase claim is authored by hand (KP-001). Years render on demand
 * as the clock advances, so there is no annual editorial chore; years
 * before STATE_FIRST_YEAR or after the current year 404.
 */
export const dynamicParams = true;

export function generateStaticParams() {
  return stateYears().map((year) => ({ year: String(year) }));
}

function parseYear(param: string): number | null {
  if (!/^\d{4}$/.test(param)) return null;
  const year = Number(param);
  if (year < STATE_FIRST_YEAR) return null;
  if (year > new Date().getUTCFullYear()) return null;
  return year;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { year: raw } = await params;
  const year = parseYear(raw);
  if (year === null) return { title: "Not found" };

  const title = `State of the Cycles ${year}`;
  const description = `Where each of the eight long-wave constructions sits in ${year}, with the next peak and trough each one implies — computed, dated, and frozen for citation.`;
  return {
    title,
    description,
    alternates: { canonical: statePath(year) },
    openGraph: {
      title,
      description,
      url: statePath(year),
      siteName: SITE_NAME,
      type: "article",
    },
  };
}

function formatCos(v: number): string {
  if (v > 0) return `+${v.toFixed(2)}`;
  if (v < 0) return `−${Math.abs(v).toFixed(2)}`;
  return "0.00";
}

function stateJsonLd(year: number): Record<string, unknown> {
  const url = `${SITE_URL}${statePath(year)}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `State of the Cycles ${year}`,
        description: `The ${year} annual reading of the eight long-wave constructions on ${SITE_NAME}.`,
        isPartOf: {
          "@type": "WebSite",
          "@id": `${SITE_URL}#website`,
          name: SITE_NAME,
          url: SITE_URL,
        },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: `State of the Cycles ${year}`,
            item: url,
          },
        ],
      },
    ],
  };
}

export default async function StatePage({ params }: Params) {
  const { year: raw } = await params;
  const year = parseYear(raw);
  if (year === null) notFound();

  const state = stateOfCycles(year);
  const years = stateYears();

  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14 [&_p]:max-w-[68ch]">
      <script
        type="application/ld+json"
        // JSON-LD is generated from cycles.json-derived values, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stateJsonLd(year)) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="text-[11px] tracking-[0.2em] uppercase text-ink-soft/80 font-mono"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-ink transition-colors">
              Overlay
            </Link>
          </li>
          <li aria-hidden className="text-ink-soft/40">
            /
          </li>
          <li aria-current="page" className="text-ink/70">
            State {year}
          </li>
        </ol>
      </nav>

      <header className="mt-6">
        <p className="text-[11px] tracking-[0.32em] uppercase text-ink-soft font-medium">
          Annual reading · frozen for citation
        </p>
        <h1
          className="font-display mt-3 text-ink leading-[0.98] tracking-[-0.015em]"
          style={{ fontSize: "clamp(34px, 5.2vw, 52px)" }}
        >
          State of the Cycles {year}
        </h1>
        <p className="mt-6 text-[17px] leading-[1.6] text-ink/85">
          For each of the eight constructions — a theory&apos;s stated period,
          pinned to one documented reference peak — this page records where the
          curve sits in {year} and the next turning points it implies.
          Everything here is computed from the same cosine the chart draws;
          nothing is asserted by hand.
        </p>
        <p className="mt-4 text-[15px] leading-[1.65] text-ink/85">
          This is not a forecast. Each &ldquo;next peak&rdquo; is what a fixed
          sinusoid implies, written down so it can be checked when the year
          arrives. The theories are contested in different ways, and most of
          them peak near the present for reasons that say more about theorists
          than about history — see{" "}
          <Link
            href="/about"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            the selection-effect note
          </Link>
          .
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-3">
          The reading
        </h2>
        <div className="overflow-x-auto border-t border-rule/30">
          <table className="w-full text-left border-collapse min-w-[36rem]">
            <thead>
              <tr className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft/80">
                <th scope="col" className="py-3 pr-3 font-medium">
                  Cycle
                </th>
                <th scope="col" className="py-3 pr-3 font-medium text-right">
                  Period
                </th>
                <th scope="col" className="py-3 pr-3 font-medium text-right">
                  cos in {year}
                </th>
                <th scope="col" className="py-3 pr-3 font-medium">
                  Phase
                </th>
                <th scope="col" className="py-3 pr-3 font-medium text-right">
                  Next peak
                </th>
                <th scope="col" className="py-3 font-medium text-right">
                  Next trough
                </th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {state.map((entry) => (
                <tr key={entry.id} className="border-t border-rule/20">
                  <td className="py-3 pr-3">
                    <Link
                      href={`/cycles/${entry.id.replace(/_/g, "-")}`}
                      className="font-display text-[16px] tracking-tight font-medium text-ink hover:text-ink-soft transition-colors"
                    >
                      {entry.name.split("—")[0]?.trim() ?? entry.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 text-right font-mono text-[13px] text-ink/85 tabular-nums">
                    {entry.period_years}y
                  </td>
                  <td className="py-3 pr-3 text-right font-mono text-[13px] text-ink/85 tabular-nums">
                    {formatCos(entry.cos)}
                  </td>
                  <td className="py-3 pr-3 font-mono text-[12px] uppercase tracking-[0.14em] text-ink/80">
                    {entry.phase}
                  </td>
                  <td className="py-3 pr-3 text-right font-mono text-[13px] text-ink/85 tabular-nums">
                    {entry.next_peak_year}
                  </td>
                  <td className="py-3 text-right font-mono text-[13px] text-ink/85 tabular-nums">
                    {entry.next_trough_year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
          cos values run from +1.00 (at a peak of the construction) to −1.00
          (at a trough), from cos(2π · (year − reference peak) / period).
          Phase labels use the same narrow bands as the chart, so
          &ldquo;peaking&rdquo; means near the peak, not somewhere in the top
          third. Next peak and trough are rounded to whole years. See{" "}
          <Link
            href="/methods"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            methods
          </Link>{" "}
          for the caveats that apply to everything on this site.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Citing this page
        </h2>
        <p className="border-t border-rule/30 pt-4 text-[14px] leading-[1.65] text-ink/85">
          This page is a dated permalink: the {year} reading stays at this URL
          as later years are added. Suggested citation:
        </p>
        <p className="mt-3 font-mono text-[12px] leading-relaxed text-ink/80 border-l-2 border-ink/40 pl-3.5">
          Kooi, D. ({year}). &ldquo;State of the Cycles {year}.&rdquo;{" "}
          {SITE_NAME}, {SITE_MAKER}. {SITE_URL}
          {statePath(year)}
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
          Machine-readable:{" "}
          <a
            href={`/api/v1/state?year=${year}`}
            className="font-mono underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            /api/v1/state?year={year}
          </a>{" "}
          returns this table as JSON, CORS-open. Cycle and series definitions
          are at{" "}
          <a
            href="/api/v1/cycles"
            className="font-mono underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            /api/v1/cycles
          </a>{" "}
          and{" "}
          <a
            href="/api/v1/series"
            className="font-mono underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            /api/v1/series
          </a>
          .
        </p>
      </section>

      <footer className="mt-10 pt-4 border-t border-rule/30">
        <p className="text-[13px] text-ink-soft">
          {years.length > 1 && (
            <>
              <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft/80 mr-2 font-mono">
                All readings
              </span>
              {years.map((y, i) => (
                <span key={y}>
                  {i > 0 && " · "}
                  {y === year ? (
                    <span className="text-ink/70">{y}</span>
                  ) : (
                    <Link
                      href={statePath(y)}
                      className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
                    >
                      {y}
                    </Link>
                  )}
                </span>
              ))}
              {" — "}
            </>
          )}
          <Link
            href="/"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            Open the interactive chart
          </Link>
          {" · "}
          <Link
            href="/cycles"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            All eight cycles
          </Link>
        </p>
      </footer>
    </article>
  );
}
