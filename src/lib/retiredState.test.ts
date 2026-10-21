import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/v1/state/route";
import { dataSeries as series } from "@/data/series";

// The yearly state readings were retired on 2026-10-21 (I-061, David: "one wave per
// cycle, stop at today, retire the yearly state pages"). What stays is pinned here.

describe("/api/v1/state is retired, with a reason", () => {
  it("answers 410 Gone, says why, and points at what remains", async () => {
    const res = await GET();
    expect(res.status).toBe(410);
    const body = await res.json();
    expect(body.error).toBe("gone");
    expect(body.note).toMatch(/no longer states where a year sits/);
    expect(body.see.some((u: string) => u.endsWith("/api/v1/cycles"))).toBe(true);
    // It must not carry a position: no cycles array, no cos, no phase.
    expect(body.cycles).toBeUndefined();
    expect(JSON.stringify(body)).not.toMatch(/peaking|rising|falling|troughing|"cos"/);
  });
});

describe("the frozen 2026 edition stays as an archived file", () => {
  it("public/data/state-2026.csv is the edition as frozen (sha256, LF-normalised)", () => {
    const csv = readFileSync(join(process.cwd(), "public", "data", "state-2026.csv"), "utf8");
    const sha = createHash("sha256").update(csv.replace(/\r\n/g, "\n")).digest("hex");
    expect(sha).toBe("092db81290a44f4dfadcee2024cc89dee6d6d7f37ad4786c6ab326562cdb6e92");
  });

  it("its provenance file says it is retired", () => {
    const md = readFileSync(join(process.cwd(), "public", "data", "state-2026.source.md"), "utf8");
    expect(md).toMatch(/Retired 2026-10-21/);
  });
});

describe("series.json reader-facing text", () => {
  it("carries no backslash (a JSON `\\\\$` renders as a literal `\\$`)", () => {
    for (const s of series) {
      expect(s.short_description).not.toContain("\\");
      expect(s.name).not.toContain("\\");
    }
  });
});
