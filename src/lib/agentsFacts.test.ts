import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { cycleSlug } from "@/lib/cycleRoutes";

// Overnight repair 2026-11-04/05: facts AGENTS.md states whose going stale would mislead the next
// agent, each checked against the file that defines it. Text-level on purpose. The deploy trigger
// (renderBlueprint.test.ts) and the action pins (workflowPins.test.ts) already have their own tests.
const root = path.resolve(__dirname, "../..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
const agents = read("AGENTS.md");

describe("what AGENTS.md says matches the file that defines it", () => {
  it.each(["AGENTS.md", "README.md"])("%s names exactly the cycles that are claim pages", (file) => {
    const listed = read(file).match(/\(([^()]+) today\)/)?.[1];
    expect(listed, `${file}: no "(… today)" claim-page list`).toBeTruthy();
    const named = listed!.split(/,| and /).map((s) => s.trim().toLowerCase()).sort();
    const actual = cycles
      .filter((c) => c.question)
      .map((c) => cycleSlug(c))
      .sort();
    expect(named).toEqual(actual);
  });

  it("CI runs the audit before npm ci, then lint, typecheck, test, build", () => {
    const steps = [...read(".github/workflows/ci.yml").matchAll(/^\s*(?:- )?run: (.+)$/gm)].map((m) => m[1].trim());
    expect(steps).toEqual([
      "npm audit --omit=dev --audit-level=critical",
      "npm ci",
      "npm run lint",
      "npm run typecheck",
      "npm test",
      "npm run build",
    ]);
    expect(agents).toContain("npm audit --omit=dev\n--audit-level=critical");
  });

  it("test files leave the build tsconfig and come back through npm run typecheck", () => {
    const tsconfig = read("tsconfig.json");
    for (const entry of ["**/*.test.ts", "**/*.test.tsx", "vitest.config.ts"]) {
      expect(tsconfig).toContain(`"${entry}"`);
    }
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.scripts.typecheck).toContain("tsconfig.test.json");
    expect(existsSync(path.join(root, "tsconfig.test.json"))).toBe(true);
  });

  it("the pre-commit hook is armed by prepare, runs the scanner, and stays LF", () => {
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.scripts.prepare).toContain("core.hooksPath .githooks");
    expect(read(".githooks/pre-commit")).toMatch(/^exec node scripts\/check-staged-secrets\.mjs\s*$/m);
    expect(read(".gitattributes")).toMatch(/^\.githooks\/\* text eol=lf\s*$/m);
  });

  it("sampleDrawnPeriod is exported from the file AGENTS.md names", () => {
    expect(agents).toContain("`sampleDrawnPeriod` in `src/lib/cycleMath.ts`");
    expect(read("src/lib/cycleMath.ts")).toMatch(/^export function sampleDrawnPeriod\(/m);
  });

  it("/state redirects permanently to /cycles and the state API answers 410", () => {
    const config = read("next.config.ts");
    for (const source of ["/state/:year*", "/state"]) {
      const at = config.indexOf(`source: "${source}"`);
      expect(at, source).toBeGreaterThan(-1);
      expect(config.slice(at, at + 120)).toMatch(/destination: "\/cycles",\s*permanent: true/);
    }
    expect(read("src/app/api/v1/state/route.ts")).toContain("status: 410");
  });

  it("every prose mirror pair AGENTS.md lists exists on both sides", () => {
    const pairs = [...agents.matchAll(/^- `(src\/app\/[^`]+\/page\.tsx)` ↔ `(public\/[^`]+\.md)`$/gm)];
    expect(pairs.map((m) => m[2])).toEqual(["public/about.md", "public/methods.md", "public/colophon.md"]);
    for (const [, page, mirror] of pairs) {
      expect(existsSync(path.join(root, page)), page).toBe(true);
      expect(existsSync(path.join(root, mirror)), mirror).toBe(true);
    }
  });

  it("the two sections moved out on 2026-11-04 still resolve from their pointers", () => {
    // spectral_verdict.py and testedSeries.test.ts send readers to "AGENTS.md invariant".
    expect(read("scripts/spectral_verdict.py")).toContain("AGENTS.md");
    expect(agents).toContain("`docs/data-pipeline.md`");
    expect(read("docs/data-pipeline.md")).toContain("scripts/spectral_verdict.py");
    expect(agents).toContain("`docs/rendered-text-gate.md`");
    expect(read("docs/rendered-text-gate.md")).toContain("check-rendered-text");
  });

  it("slugs are the id with underscores swapped for hyphens", () => {
    expect(agents).toContain("`strauss_howe` → `/cycles/strauss-howe`");
    const straussHowe = cycles.find((c) => c.id === "strauss_howe");
    expect(straussHowe).toBeDefined();
    expect(cycleSlug(straussHowe!)).toBe("strauss-howe");
  });

  it("the commands AGENTS.md tells agents to run exist with the flag it names", () => {
    for (const script of [
      "scripts/crawl-read.mjs",
      "scripts/read-render-deploy-trigger.mjs",
      "scripts/check-rendered-text.mjs",
      "scripts/audit_cycle_rationales.py",
    ]) {
      expect(agents).toContain(script);
      expect(existsSync(path.join(root, script)), script).toBe(true);
    }
    expect(agents).toContain("scripts/gsc-read.mjs --start");
    expect(read("scripts/gsc-read.mjs")).toContain("--start");
  });
});
