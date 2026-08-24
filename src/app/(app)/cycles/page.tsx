import type { Metadata } from "next";
import Link from "next/link";
import { cycles } from "@/data/cycles";
import {
  confidenceGloss,
  confidenceLabel,
  cycleRoutePath,
  seriesForCycle,
} from "@/lib/cycleRoutes";
import { SITE_NAME, SITE_URL } from "@/lib/siteConfig";

const TITLE = "The ten cycles";
const DESCRIPTION =
  "Ten long-wave cycles of history - Schlesinger Jr., Turchin's fathers-and-sons, Kondratiev, Perez, Huntington, Dalio, Strauss-Howe, Modelski, Khaldun, Turchin's secular cycle - each with its period, reference peak, sourcing, and paired data series.";

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
    name: "Goldstein - war/price long wave (~50y)",
    reason:
      "Goldstein himself forecloses the sinusoid: \"The efforts to identify war cycles based on fixed periodicities are a self-proclaimed dead-end […]\" (Long Cycles: Prosperity and War in the Modern Age, 1988, p. 111; similarly p. 99), and he calls fixed-periodicity methodology \"inappropriate for social cycles\" (p. 244). He affirms non-periodic long waves in war - which is exactly what a fixed cosine cannot represent - and treats his ~150-year hegemony cycle as a separate construct, not tied to the 50-year wave. His own data files also carry no explicit reuse license.",
  },
  {
    name: "Arrighi - systemic cycles of accumulation",
    reason:
      "No fixed period by design: his cycles overlap and shorten over time (Genoese → Dutch → British → American), so no single period_years exists to plot.",
  },
  {
    name: "Sornette - log-periodic power laws",
    reason:
      "Log-periodic means the oscillation interval shrinks toward a critical time; there is no constant year-period, so a fixed sinusoid misstates the mathematics.",
  },
  {
    name: "Toynbee, Spengler, Vico, Sorokin, Quigley, Tainter",
    reason:
      "Civilizational rise-and-fall narratives without a theorist-stated period in years. The bar requires their number, not one imposed on them.",
  },
  {
    name: "Namenwirth/Weber - cultural value cycles",
    reason:
      "The claimed ~152-year cycle was fitted on roughly 120 years of data - it never once repeated inside its own evidence - and the shorter cycle is a median of fits ranging widely. Mohler's German comparison found no evidence of a general cyclical process of value change (Mohler 1987, Eur. J. Political Research 15) and the extraction method was shown to manufacture cycles from the filtering itself (Thome & Rahlf, \"Dubious cycles,\" Quality & Quantity 30(4), 1996). No machine-readable series exists.",
  },
  {
    name: "Forrester - System Dynamics long wave",
    reason:
      "A simulation model reproducing Kondratieff-like waves, not an independent historical periodization with its own anchor; cross-referenced under Kondratiev instead.",
  },
  {
    name: "Berry - long-wave rhythms (~55y)",
    reason:
      "A US-dated restatement of the Kondratieff rather than an independent construct; folded into the Kondratiev entry's literature rather than plotted twice.",
  },
];

// The longer story behind each row's disclosure arrow, with a verified link
// to the primary text where the cycle is defined. Hand-written editorial
// prose, like EXCLUDED above - every link checked live 2026-08-19.
const MORE: Record<
  string,
  { text: string; sourceLabel: string; sourceUrl: string }
> = {
  khaldun: {
    text: "Ibn Khaldun wrote the Muqaddimah in 1377 as the introduction to a universal history, and it reads like a theory of states built by watching them die. New dynasties rise from the desert edge on asabiyyah - solidarity forged by hardship - conquer the comfortable cities, and then spend about three generations losing exactly the quality that got them there. Luxury does the work: the founders' grandchildren collect taxes they didn't earn, backed by cohesion they no longer have, and a hungrier group is always waiting at the edge. He was describing Maghrebi dynasties six centuries ago. Putting his curve over the modern West is our experiment, not his claim.",
    sourceLabel:
      "The Muqaddimah (1377; Franz Rosenthal's translation, Princeton)",
    sourceUrl:
      "https://press.princeton.edu/books/paperback/9780691166285/the-muqaddimah",
  },
  kondratiev: {
    text: "Nikolai Kondratiev ran Moscow's Institute of Conjuncture in the 1920s and reported, in price, interest-rate, and production series reaching back to the 1780s, waves lasting roughly half a century. He proposed them cautiously; Schumpeter later named them K-waves and attached the technology story most people now mean by the term. The caution didn't save him - he was arrested in 1930 and shot in 1938, a casualty of arguing that capitalism renews itself instead of collapsing. Whether the wave actually exists is still not settled, ninety years on. It anchors this roster because every other long-wave theory answers to it, one way or another.",
    sourceLabel:
      "'The Long Waves in Economic Life,' The Review of Economic Statistics 17(6), 1935 (English abridgment of the 1925 paper)",
    sourceUrl: "https://doi.org/10.2307/1928486",
  },
  huntington: {
    text: "Samuel Huntington's American Politics: The Promise of Disharmony (1981) starts from a gap that never closes: Americans share one political creed - liberty, equality, distrust of authority - and no institution, including their own government, can live up to it. Most of the time the country lives with the hypocrisy. Roughly every third generation it can't, and a surge of 'creedal passion' erupts: the Revolution, the Jacksonian era, the Progressive era, the 1960s. Four surges, sixty-some years apart. Huntington never named a peak year; the 1968 anchor is our midpoint of the interval he did name, 1960 to 1975.",
    sourceLabel:
      "American Politics: The Promise of Disharmony (Belknap/Harvard, 1981)",
    sourceUrl: "https://www.hup.harvard.edu/books/9780674030213",
  },
  schlesinger_jr: {
    text: "Two Schlesingers, one idea. Arthur Sr., a Harvard historian, noticed American politics alternating between liberal and conservative moods in phases averaging about sixteen and a half years. His son formalized it in The Cycles of American History (1986): eras of 'public purpose' alternate with eras of 'private interest,' each exhausting itself and breeding its opposite, a full round trip about every thirty years. The wrinkle we keep on the record: Schlesinger Jr. expected a liberal turn shortly before or after 1990, while a strict thirty-year clock started at our 1970 midpoint says 2000. His own forecast and his own period disagree - which tells you how much play these numbers have in them.",
    sourceLabel: "The Cycles of American History (Houghton Mifflin, 1986)",
    sourceUrl: "https://archive.org/details/cyclesofamerican0000schl",
  },
  perez: {
    text: "Carlota Perez's Technological Revolutions and Financial Capital (2002) is the optimistic entry on this roster. Each technological revolution since 1771 - canals, railways, steel, mass production, computing - arrives the same way: an installation phase in which finance chases the new technology into a bubble, a crash at the turning point, then a deployment phase in which the technology finally spreads through the whole economy and the good years arrive. She dates the ICT turning point to the dot-com crash of 2000-2001. Two honesty notes from our side: her 'turning point' is not a peak (we map it to one for the math), and our paired diffusion series shows no local peak at 2000 at all.",
    sourceLabel:
      "Technological Revolutions and Financial Capital (Edward Elgar, 2002)",
    sourceUrl:
      "https://www.e-elgar.com/shop/usd/technological-revolutions-and-financial-capital-9781840649222.html",
  },
  turchin: {
    text: "Peter Turchin spent decades modeling animal population dynamics and then turned the same mathematics on human history. Ages of Discord (2016) applies his structural-demographic theory to the United States since 1780: when elite aspirants multiply faster than elite positions and ordinary incomes stagnate, competition curdles into political violence, and the state either weathers the storm or doesn't. His fitted American cycle runs about 150 years. In 2010 he put a forecast in Nature - instability peaking in the 2020s - which is both why this cycle gets the most attention here and why it deserves the most care: one realized oscillation is a case study, not a periodicity.",
    sourceLabel: "Ages of Discord (Beresta Books, 2016)",
    sourceUrl: "https://peterturchin.com/ages-of-discord/",
  },
  dalio: {
    text: "Ray Dalio founded Bridgewater, the world's largest hedge fund, and Principles for Dealing with the Changing World Order (2021) is his account of how reserve-currency powers rise and decay - the Dutch, the British, the Americans - told through debt cycles, internal disorder, and external rivals. It's the one cycle here built by an investor rather than a scholar, and it reads like risk management applied to empires. Our curve takes documented liberties: Dalio's stated debt-cycle range is 50 to 75 years (we use the top), and the 1950 anchor comes from a different construct of his - the ~250-year empire score - than the debt cycle it anchors here.",
    sourceLabel:
      "Principles for Dealing with the Changing World Order (2021)",
    sourceUrl: "https://www.economicprinciples.org/",
  },
  strauss_howe: {
    text: "William Strauss and Neil Howe invented pop generational theory - they coined the word 'Millennials' - and The Fourth Turning (1997) is its prophecy book. The claim: Anglo-American history moves in a saeculum, roughly one long human life, of four generational 'turnings' - a post-crisis High, an Awakening, an Unraveling, and a Crisis. The book found its largest audience decades after publication, among readers convinced the 2020s are the predicted Crisis. Academic historians mostly aren't buying, and a single sinusoid can't faithfully carry a four-phase model with two cultural highs per cycle - both caveats travel with this curve wherever it appears on the site.",
    sourceLabel: "The Fourth Turning (Broadway Books, 1997)",
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/174648/the-fourth-turning-by-william-strauss/",
  },
  modelski: {
    text: "George Modelski, a University of Washington political scientist, argued in Long Cycles in World Politics (1987) that since about 1500 world leadership has turned over in century-long cycles, each opened by a bout of global war and each led by the state that commands the oceans: Portugal, the Netherlands, Britain twice, the United States since 1945. Leadership, in his ledger, is countable - capital ships, and later global reach. He also warned that the long cycle 'does not connote strict cycles,' so our fixed 110-year sinusoid is a stylization he explicitly disclaimed. The paired data adds its own friction: measured by GDP share alone, the 1870s leader is Qing China, not Britain.",
    sourceLabel: "Long Cycles in World Politics (Macmillan, 1987)",
    sourceUrl: "https://doi.org/10.1007/978-1-349-09151-5",
  },
  turchin_fathers_sons: {
    text: "Same author as the 150-year secular cycle, a different construct, and the plainest empirical claim on the roster: Turchin's 2012 Journal of Peace Research paper reports US political violence spiking about every fifty years, with peaks around 1870, 1920, and 1970. The proposed mechanism is generational memory - the people who lived through one convulsion won't start another, and their grandchildren, who didn't, will. Two honesty notes: he describes the observed pattern as sharply peaked, not a smooth wave, so the cosine keeps only his interval; and the missing piece above is deliberate - no paired data series, because the violence database he posts carries no reuse license, so we don't redistribute it. And when this curve and his secular cycle both peak at 2020 on our chart, that's construction, not corroboration - though the 2012 paper does extend its own sequence to 'around 2020,' calling that a projection rather than a prediction.",
    sourceLabel:
      "'Dynamics of political instability in the United States, 1780–2010,' Journal of Peace Research 49(4), 2012",
    sourceUrl: "https://doi.org/10.1177/0022343312442078",
  },
};

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
          a real long-run data series. The arrow under each entry opens the
          longer story - what the theory actually claims, and the primary text
          where it&apos;s defined. Follow a cycle for its calibration
          rationale, sourcing, and provenance, or see all ten together on{" "}
          <Link
            href="/"
            className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors"
          >
            one axis
          </Link>
          .
        </p>
        {/* The three confidence tags appear on every entry and every cycle
            page and were defined nowhere on the site. Journey-walk
            2026-08-24, J8. */}
        <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
          The confidence tag on each entry is this site&apos;s rough grading
          of the theory&apos;s evidence base:{" "}
          <em>narrative</em>
          {" — "}
          {confidenceGloss("narrative")};{" "}
          <em>quantitative</em>
          {" — "}
          {confidenceGloss("quantitative")};{" "}
          <em>empirical · contested</em>
          {" — "}
          {confidenceGloss("empirical-contested")}.
        </p>
      </header>

      <ul className="mt-10">
        {byPeriod.map((cycle) => {
          const series = seriesForCycle(cycle);
          const more = MORE[cycle.id];
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
                  {/* Underline on hover/focus: these full-block links had no
                      visible link affordance at rest or on hover — cold
                      readers took the entries for headings. Journey-walk
                      2026-08-24, J11. */}
                  <h2 className="font-display text-[20px] tracking-tight text-ink font-medium group-hover:underline group-focus-visible:underline decoration-ink/30 underline-offset-[3px] transition-colors">
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
                    ? `Paired data - ${series.name}`
                    : "No paired data series this round"}
                </p>
              </Link>
              {more && (
                <details className="group/more mt-2.5">
                  <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft hover:text-ink transition-colors">
                    <span
                      aria-hidden
                      className="inline-block transition-transform group-open/more:rotate-180"
                    >
                      ▾
                    </span>
                    The longer story
                  </summary>
                  <div className="mt-3 pl-3.5 border-l-2 border-rule/40">
                    <p className="text-[15px] leading-[1.65] text-ink/85">
                      {more.text}
                    </p>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft">
                      Defined in{" "}
                      <a
                        href={more.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink hover:text-ink transition-colors"
                      >
                        {more.sourceLabel}
                      </a>
                      .
                    </p>
                  </div>
                </details>
              )}
            </li>
          );
        })}
      </ul>

      <section className="mt-14">
        <h2 className="font-display text-[24px] tracking-tight text-ink mb-2">
          Considered and excluded
        </h2>
        <p className="text-[14px] leading-relaxed text-ink-soft mb-5">
          A theory enters the roster only with an identifiable period - a
          single figure or a stated range - grounded in the theorist&apos;s
          primary text, a defensible anchor peak, and a citable source. Where
          the theorist gives a range or a phase structure rather than one
          number, we plot a stated midpoint and say so on the cycle&apos;s
          page. These famous candidates fail that bar - and the reasons are
          as instructive as the roster itself.
        </p>
        <ul className="space-y-4 border-t border-rule/30 pt-5">
          {EXCLUDED.map((e) => (
            <li key={e.name} className="text-[14px] leading-[1.6]">
              <span className="font-display text-[16px] tracking-tight font-medium text-ink">
                {e.name}
              </span>{" "}
              <span className="text-ink/80">- {e.reason}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[14px] leading-relaxed text-ink-soft border-l-2 border-ink/40 pl-3.5">
          <span className="uppercase tracking-[0.18em] text-[11px] font-medium text-ink-soft/80 mr-1.5 font-mono">
            Queued
          </span>
          Klingberg&apos;s foreign-policy mood cycle (~48y: phases Klingberg
          himself reported as averaging ~21 introvert + ~27 extrovert
          years; Klingberg 1952,{" "}<em>World Politics</em>{" "}4(2)) passes the
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
