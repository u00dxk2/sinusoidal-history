import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// SIN-R3 (Astra review 2026-10-05): CI ran actions through mutable tags
// (`actions/checkout@v5`), so a moved upstream tag changed the code CI
// executes with no change in this repo. Every external action is pinned to a
// full commit SHA; the trailing `# vX.Y.Z` comment is for readers only.
const dir = path.resolve(__dirname, "../../.github/workflows");
const files = readdirSync(dir).filter((f) => /\.ya?ml$/.test(f));

const usesRefs = files.flatMap((f) =>
  readFileSync(path.join(dir, f), "utf8")
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*-?\s*uses:\s*["']?([^\s"'#]+)/)?.[1])
    .filter((ref): ref is string => !!ref)
    .map((ref) => ({ file: f, ref }))
);

describe("workflow actions are pinned", () => {
  it("finds the workflows and their uses: lines (the search space is not empty)", () => {
    expect(files.length).toBeGreaterThan(0);
    expect(usesRefs.length).toBeGreaterThan(0);
  });

  it("every external uses: names a 40-hex commit SHA", () => {
    const unpinned = usesRefs.filter(
      ({ ref }) =>
        !ref.startsWith("./") &&
        !ref.startsWith("docker://") &&
        !/@[0-9a-f]{40}$/.test(ref)
    );
    expect(unpinned).toEqual([]);
  });
});
