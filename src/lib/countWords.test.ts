// I-006 (2026-10-11): the main share card's count derives from the data, the way
// siteConfig.test.ts pins SITE_DESCRIPTION. The route file itself is read too, so a literal
// count typed back into it fails here.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { countWord, ogMainStandfirst } from "@/lib/countWords";

describe("countWord", () => {
  it("spells twelve and under, and falls back to digits", () => {
    expect(countWord(10)).toBe("Ten");
    expect(countWord(11)).toBe("Eleven");
    expect(countWord(12)).toBe("Twelve");
    expect(countWord(13)).toBe("13");
    expect(countWord(2.5)).toBe("2.5");
  });
});

describe("the main og card's standfirst", () => {
  it("counts the cycles the site ships", () => {
    expect(cycles.length).toBe(10);
    expect(ogMainStandfirst(cycles.length)).toBe("Ten long-wave cycles of history, on one shared axis.");
    expect(ogMainStandfirst(cycles.length + 1).startsWith("Eleven ")).toBe(true);
  });

  it("the og route draws it from the data, not a typed count", () => {
    const source = readFileSync(join(process.cwd(), "src", "app", "og", "route.tsx"), "utf8");
    expect(source).toContain("ogMainStandfirst(cycles.length)");
    expect(source).not.toMatch(/\b(Eight|Nine|Ten|Eleven|Twelve) long-wave cycles/);
  });
});
