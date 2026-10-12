// A reader page never prints a bare "cos <number>" (I-036, 2026-10-11 round 3). The cycle
// pages say "curve height −0.99, from −1 at a low to +1 at a peak" since 0196b40; this
// guard holds every other reader surface to the same rule. /state and /api/v1/state keep
// "cos" on purpose, with a footnote: their numbers come from a template (`{"cos "}` +
// formatCos), so no source line here matches them and they need no allowlist.
// Blind to: text built at runtime from a template, and anything outside the roots below.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

/** "cos", optionally "≈" or "=", then a signed number: the shape a reader cannot read. */
const BARE_COS = /\bcos\s*[≈=]?\s*[−+-]?\d/u;

function walk(dir: string, keep: (f: string) => boolean): string[] {
  return readdirSync(join(root, dir), { recursive: true, encoding: "utf8" })
    .map((f) => join(dir, f))
    .filter((f) => keep(f) && !/\.test\.tsx?$/.test(f));
}

const readerSources = [
  join("src", "data", "cycles.json"),
  ...walk(join("src", "app"), (f) => f.endsWith(".tsx")),
  ...walk(join("src", "components"), (f) => f.endsWith(".tsx")),
  ...walk("public", (f) => f.endsWith(".md") || f.endsWith(".txt")),
];

describe("no reader surface prints a bare cos number", () => {
  it("the pattern catches the shapes that shipped, and passes the ones that should", () => {
    for (const bad of ["(cos ≈ +0.91 at 1860)", "(cos ≈ −0.81 at 1780)", "cos −0.99", "cos = +1"]) {
      expect(BARE_COS.test(bad), bad).toBe(true);
    }
    for (const ok of [
      "(curve height ≈ +0.15, on a scale from −1 at a low to +1 at a peak)",
      "r reduces to cos(Δφ)",
      "the cos value, phase label",
      "Math.cos(",
    ]) {
      expect(BARE_COS.test(ok), ok).toBe(false);
    }
  });

  it("searched a named population, not nothing", () => {
    const rel = readerSources.map((f) => f.replace(/\\/g, "/"));
    for (const must of [
      "src/data/cycles.json",
      "src/app/(app)/about/page.tsx",
      "src/app/(app)/cycles/[id]/page.tsx",
      "public/about.md",
      "public/llms.txt",
      "public/data/vdem_libdem.source.md",
    ]) {
      expect(rel, must).toContain(must);
    }
  });

  it("no file in it has one", () => {
    const hits: string[] = [];
    for (const f of readerSources) {
      readFileSync(join(root, f), "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (BARE_COS.test(line)) hits.push(`${relative(root, join(root, f))}:${i + 1}`);
        });
    }
    expect(hits).toEqual([]);
  });
});
