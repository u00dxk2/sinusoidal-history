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

  // The whole file, never line by line: JSX and Markdown wrap prose, and "cos" at a line's end
  // with its number on the next renders as one bare "cos +0.15" (Codex review of 62b69f1).
  const hitsIn = (text: string) =>
    [...text.matchAll(new RegExp(BARE_COS.source, "gu"))].map(
      (m) => text.slice(0, m.index).split("\n").length
    );

  it("finds one that wraps across a line break", () => {
    expect(hitsIn("sits on the rising arm (cos\n          ≈ +0.15), neither")).toEqual([1]);
    expect(hitsIn("one\ntwo (cos ≈ −0.81 at 1780)")).toEqual([2]);
  });

  it("no file in it has one", () => {
    const hits: string[] = [];
    for (const f of readerSources) {
      for (const line of hitsIn(readFileSync(join(root, f), "utf8"))) {
        hits.push(`${relative(root, join(root, f))}:${line}`);
      }
    }
    expect(hits).toEqual([]);
  });
});
