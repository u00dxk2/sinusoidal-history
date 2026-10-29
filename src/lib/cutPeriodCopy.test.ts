import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import CyclePage from "@/app/(app)/cycles/[id]/page";
import { cycles } from "@/data/cycles";
import { periodCutAtToday } from "@/lib/cycleMath";

// I-065 (2026-10-29): a period that has not ended is cut at today, so a cycle page must not
// call Turchin's drawing "one period"; a whole period keeps the words. Date pinned so the
// cut is the 2026 one (Turchin 1945-2095 cut; Strauss-Howe 1913-1997 whole).
async function html(id: string) {
  const el = await CyclePage({ params: Promise.resolve({ id }) });
  return renderToStaticMarkup(el as Parameters<typeof renderToStaticMarkup>[0]).replace(/<!-- -->/g, "");
}

describe("cycle page copy for a cut period (I-065)", () => {
  beforeAll(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-29T12:00:00Z"));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  it("Turchin: the figure label and the extrema line say the period is cut at today", async () => {
    const page = await html("turchin");
    expect(page).toMatch(/aria-label="Peter Turchin[^"]*: part of one 150-year period of a sinusoid, drawn from 1945 to 2026/);
    expect(page).toContain("over the part of its one period this site draws, up to today (1945–2026; the period has not ended yet).");
    expect(page).not.toContain("over the one period this site draws");
  });

  it("Strauss-Howe: a whole period keeps 'one period'", async () => {
    const page = await html("strauss-howe");
    expect(page).toMatch(/aria-label="Strauss[^"]*: one 84-year period of a sinusoid/);
    expect(page).toContain("over the one period this site draws (1913–1997).");
  });

  // The rule, not a phrase list (Codex r2: an exact-substring check let "is drawn as a single
  // period" through). On a cut page, every "one period" / "single period" must be qualified as
  // "at most one" or "part of (its | the) one"; strip those and nothing whole-period may remain.
  it("a cut page carries no unqualified whole-period wording; no page credits every period to the theory", async () => {
    let cutPages = 0;
    for (const c of cycles) {
      const page = await html(c.id.replace(/_/g, "-"));
      expect(page).not.toContain("the theory&#x27;s stated period");
      if (!periodCutAtToday(c, 2026)) continue;
      cutPages++;
      const rest = page.replace(/\b(at most one|part of (its |the )?one)\b/gi, "");
      const hit = rest.match(/.{0,80}\b(single|one)( full)?( \d+-year)? period\b.{0,40}/i);
      expect(hit?.[0] ?? null, c.id).toBeNull();
    }
    expect(cutPages).toBe(2);
  });
});
