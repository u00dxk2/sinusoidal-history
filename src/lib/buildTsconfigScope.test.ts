import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

// The build tsconfig must leave out every file that imports a devDependency, because Render
// prunes devDependencies before `next build` and this Next type-checks everything in scope
// (KP-120, AGENTS.md "Test files are excluded from the BUILD tsconfig"). agentsFacts.test.ts
// pins the exclude STRINGS; this resolves the file list tsc actually builds, which is what
// the property is about (refactor retro 2026-11-07 item 3: the string pin was theatre).
//
// Red proof: with `"**/*.test.ts"` or `"vitest.config.mts"` removed from tsconfig.json's
// exclude, the first test fails and names the files that came back in.

const root = path.resolve(__dirname, "../..");

function buildScope(): string[] {
  const configPath = path.join(root, "tsconfig.json");
  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  if (read.error) throw new Error(ts.flattenDiagnosticMessageText(read.error.messageText, "\n"));
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, root);
  return parsed.fileNames
    .map((f) => path.relative(root, f).split(path.sep).join("/"))
    .filter((f) => !f.startsWith(".next/"));
}

describe("build tsconfig scope", () => {
  it("contains no test file and no vitest config", () => {
    const leaked = buildScope().filter((f) => /\.test\.tsx?$/.test(f) || /(^|\/)vitest\.config\./.test(f));
    expect(leaked).toEqual([]);
  });

  it("still contains the app (the scope is not vacuous)", () => {
    const scope = buildScope();
    expect(scope).toContain("src/app/(app)/page.tsx");
    expect(scope).toContain("src/lib/cycleMath.ts");
    expect(scope.length).toBeGreaterThan(50);
  });
});
