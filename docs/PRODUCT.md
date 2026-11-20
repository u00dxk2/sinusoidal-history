# PRODUCT.md — Sinusoidal History (sinusoidalhistory.com)

Written 2026-11-17 (MT) for the design and copy pass, round 2. Design decisions are in `docs/DESIGN.md`.

**How this file was made.** A helper listed 120 facts from source with file and line (round 0, `tmp/design-pass-round0-facts.md`, read at f478ebd). A reviewer from the other model family (Codex, model gpt-6.2-sol, read-only, banner workdir `C:\dev\skylark\sinusoidal-cycles`) then judged every line. The known list below holds only lines it marked HOLDS, or the narrower sentence it gave. Every product fact in the copy at the end is on that list. Nothing in this file is live.

## Who it is for, and the job

**HYPOTHESIS, not observed.** No reader has written to the site, and the reader evidence on record is Search Console impressions and synthetic walks (`docs/evangelism-bar.md:16,34`).

- **Who:** someone who has been told that history runs in cycles, by a book, a podcast or a friend quoting Dalio, Strauss-Howe or Turchin, and cannot tell whether it holds up or is only a good story (`docs/evangelism-bar.md:14`).
- **The job:** put the named theories on one time axis, set a measured record beside each one that has one, and say plainly whether that record is long enough for this site to test the claim.

## The bad alternative people use today

HYPOTHESIS, the site's own framing. The reader takes the theory's own chart on trust: one curve, drawn by the person selling the idea, usually with an arrow at the present. Or they dismiss the whole idea unread. Neither sets two theories on the same axis, and neither says how much record a claim like this would need.

## Voice

Three traits:

1. **Plain.** Short words, the reader's own question, jargon glossed where it first appears.
2. **Scoped.** A sentence claims exactly what the record supports and keeps its qualifier ("this site requires", "at most one period", "on this site"). A dropped qualifier is a new claim.
3. **Unhurried.** No urgency, no forecast, no superlative. The site would sooner say "not testable" than something exciting.

One tone rule for each state:

- **Error:** say what happened and the next step. State a cause only when it is known. Never a joke.
- **Empty:** say what is absent and why, then point to what is there.
- **Success:** state the result in the fewest words and stop ("Copied."). No exclamation mark.

## Three anti-references

This must not resemble:

1. **A forecast or market-timing page.** No countdown, no "where we are now" arrow, no red alarm colour, no sentence about what happens next.
2. **A software dashboard.** No tiles of big numbers, no stat banner, no gauges, no status colours.
3. **A template "editorial" landing page.** Cream paper with a soft display serif, one italic word in the headline, a small-caps kicker above it. Today's home page is close to this; `docs/DESIGN.md` lists what goes.

## Known (source proves it; ids are the round-0 lines)

What it is and draws
- The site holds ten cycles: Khaldun, Kondratiev, Huntington, Schlesinger Jr., Perez, Turchin (secular), Dalio, Strauss-Howe, Modelski, and Turchin's 50-year fathers-and-sons cycle (F1, F4). Two of the ten are Turchin constructions.
- Each has a stored period and reference peak year, for example Dalio 75 years and 1950, Turchin 150 and 2020, Strauss-Howe 84 and 1955 (F3).
- Several peaks and periods are this site's choices, documented on each cycle's page, and not dates the theorist gave. Dalio's 75 years is the top of his stated range of about 50 to 75 (F15, F60).
- The home chart's axis defaults to 1600 to 2050 and follows the window a reader selects (F6, narrowed).
- Each curve is a plain cosine of fixed height. The main charts draw at most one period, centred on the peak year, and no curve is drawn past today (F7, F8 narrowed). In 2026 two cycles are cut at today: Perez and Turchin's secular cycle (F10).
- The current charts state no position for the present on any cycle (F11, narrowed: a retired data file and rationale prose still discuss past phases).
- Nine of the ten reference peaks fall between 1945 and 2020. The site says this is not evidence the theories agree (F14).
- Nine of the ten cycles are paired with a measured data series. Turchin's fathers-and-sons cycle has none (F12).

What a visitor can do
- The home chart has three views: Facets (the default), Overlay (hidden on phones) and Calibrate (F20).
- A Range strip zooms the years shown, with presets All, Industrial and Modern. The chart draws no window narrower than 150 years (F21, F22 narrowed).
- Calibrate lists the nine paired cycles. Two sliders move a cycle's peak year and period, and a Pearson r against its paired series updates. The site labels that number "Diagnostic, not a test statistic", and moving a slider changes no published verdict (F29, F30, F31).
- Each cycle has its own page at `/cycles/<slug>`. The index at `/cycles` is titled "Do history's cycles hold up?" (F56, F58).
- Paired cycle pages offer the series as a CSV, its upstream source and a provenance note. Every cycle page offers "Open in the chart" and a copyable attribution (F34, narrowed).

The verdicts
- The site has nine primary pairings of a cycle with a proxy record. None reaches the 3.0 full periods **this site requires** before it will run a test: 0 of 9 (F43, F44).
- The 3.0-period floor is the site's own conservative rule, not a general requirement (F43).
- For those nine the page headline is "Not testable on the record that exists". For the unpaired cycle it is "Not tested" (F40, F41).
- No test was run on any primary pairing, and an ineligible verdict is not evidence for or against the theory (F53).
- Dalio's record (US share of world GDP) runs 152 years: 2.0 of the 3.0 periods this site requires for a 75-year claim, 73 years of coverage short (F61, F62).
- The analysis plan is a frozen manifest in the repository, dated 2026-08-19, and the pipeline checks against it (F52, narrowed). The registration is in this repository only.

Empty and error states
- The fathers-and-sons page shows "Not tested — this cycle has no paired data series on this site, so there is no record to test it against." and a link to its caveat (F73).
- The caveat gives the reason: In August 2026 the project found the underlying database on Turchin's site with no reuse licence stated on its page, so this site does not redistribute it (F13; dated by I-088, 2026-11-20).
- `src/app/error.tsx` shows "Something broke in this view." It used to say "Most likely a CSV failed to load." That cause was wrong: the chart catches its own data-file fetch failures. No specific cause can be stated there (F83, F85 narrowed, Codex question 3). Since 2026-11-17 (round 3, unflagged) it says "This view could not be displayed. Try it again, or go back to the chart." (Codex claims pass: HOLDS).
- The error screen's "chart" link (it read "overlay" before round 3) goes to `/`, whose default view is Facets (F83).
- The home page shows an empty 600px block with no text while the chart loads (F90).

Who stands behind it
- Made by Skylark Creations; cited as Kooi, D. (2026), DOI 10.5281/zenodo.21998618 (F94, F95 narrowed).
- The project's code and original chart files are MIT-licensed. The plotted data stay under their upstream terms, and three series carry no explicit reuse licence (F96, F97).

## Unknown — do not invent

- Whether any cycle "holds up", "fails" or is "debunked". No primary test ran (U7, U8).
- Where the present sits on any cycle, and whether anything is "peaking now" (U9).
- That a theorist endorses the period or peak the site uses (U2, U10).
- "Pre-registered" in the sense of an outside registry, or that the plan was written before any result was first produced (U5, U6).
- Any reader count, testimonial, share, "featured in" or search rank (U14 to U17).
- That the site is free, private, or makes no third-party requests. The repository shows no sign-in, payment, advertising or analytics code; that is all it shows (F98 as narrowed, U11, U12).
- That it is peer-reviewed or expert-reviewed (U13).
- How the chart feels to use, or that exports work in every browser (U3, U4).
- That motion respects a reduced-motion setting today (U19).

## Copy (proposed, not live)

### Five headlines, and which survive

Tests: a stranger reading only the headline knows what this is; can I picture it; could it be proven false; could no competitor say it.

| # | Headline | Kept? |
|---|---|---|
| 1 | Ten long-wave theories of history, each drawn once on one time axis. | **Kept.** Names the subject, the count and the picture. False if the count or the one-wave rule changed |
| 2 | Dalio, Turchin, Strauss-Howe and seven more: the cycles of history, one wave each, on one time axis. | **Kept.** Same claim, led by the names people search for |
| 3 | Ten theories of history's long cycles on one axis. Nine sit beside a measured record. By this site's rule, none of those records is long enough to test its cycle. | **Kept, with a flag.** The strongest and the most particular to this site. It is the home page's existing 0-of-9 sentence moved up. It needs its own claims pass at P3: short testability claims were refuted three times on the /cycles snippet (I-079) |
| 4 | Does history move in cycles? Ten theories and the records to check them against. | Cut. A question cannot be proven false, and only nine have a record |
| 5 | Ten cycles, one axis. (today's) | Cut. A stranger cannot tell cycles of what |

**What P3 built, after a second claims pass on the finished words (Codex r2, 2026-11-17).** None of the three kept headlines survived as written. Headline 1's "each drawn once" was refuted: the page draws each cycle in more than one figure, and two of the ten are cut at today. Headlines 2 and 3 were not offered (the P1 review questioned "one wave each"; headline 3's short testability claim is the class refuted on I-079). The built headline is the narrower one:

> **Ten long-wave theories of history on one time axis.**

It still names the subject, the count and the picture, and it is false if the count changes. The one-period rule moved into the subhead.

### Subhead

As built: "Each curve is at most one period of a plain wave around a peak year this site documents, and no curve is drawn past today. Nine of the ten have paired data, and each of those nine pages says whether the record its verdict uses is long enough for this site to test the cycle."

The second sentence was narrowed by the same pass: the unpaired cycle's page has no record to speak of, and two verdicts are judged on a different cut from the series the chart draws. Variant C adds one sentence, shown only while it is true: "None of the nine primary records covers the 3.0 full periods this site requires before testing."

### Call to action

**"Check a cycle against its record"**, to `/cycles`. It is the one accent-coloured action on the first screen. A second, plain link: "Move a peak yourself", to the Calibrate view.

### Error state (`src/app/error.tsx`)

- Heading: "This view hit an unexpected error."
- Body: "This view could not be displayed. Try it again, or go back to the chart." (Narrowed at P3: the boundary covers a view's children, not always the whole page.)
- Button: "Try again". Link: "Back to the chart" (to `/`).
- When a reference exists: "Reference: <digest>".

It states no cause, because none is known from that screen. Under the flag the button calls `retry()`, which this Next version documents as re-fetching and re-rendering; `reset()` would replay a failed server response (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`).

### The 404 (`src/app/not-found.tsx`)

- Heading: "There is no page at this address."
- Body: "It may have moved, or the address may be mistyped."
- The same two actions: "Check a cycle against its record" (to `/cycles`) and "Back to the chart".

### Empty state (`/cycles/turchin-fathers-sons`)

- Headline, unchanged: "Not tested" (the string is shared with the home verdict line's logic).
- Reason: "In August 2026 the project found the underlying database on Turchin's site with no reuse licence stated on its page, so this site does not redistribute it."
- Next step: "Open this curve in the chart".

"No data series of its own", not "no record": the methods page sets this cycle's period against other cycles' records. The reason string is shared with the share card and the chart's card, so P3 sweeps every copy.
