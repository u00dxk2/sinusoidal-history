import { readFileSync } from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

// Every package a build-scope file imports must be listed in package.json `dependencies`.
// Render prunes devDependencies before `next build`, and a package that is not listed at all
// resolves only while something else happens to pull it in: on 2026-11-07 `d3-scale`,
// `d3-shape` and `d3-selection` were imported by five modules and listed nowhere, reachable
// only through the umbrella `d3` package that nothing imported (refactor retro 18532162 item 2).
//
// Red proof: on 93f2ad0 (before the d3 listing fix) this fails naming d3-scale, d3-selection
// and d3-shape.

const root = path.resolve(__dirname, "../..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const listed = new Set(Object.keys(pkg.dependencies ?? {}));
const builtins = new Set(builtinModules);

function buildScope(): string[] {
  const configPath = path.join(root, "tsconfig.json");
  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, root);
  return parsed.fileNames.filter((f) => !f.endsWith(".d.ts") && !path.relative(root, f).startsWith(".next"));
}

function packageOf(spec: string): string | null {
  if (spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("@/")) return null;
  if (spec.startsWith("node:") || builtins.has(spec.split("/")[0])) return null;
  const parts = spec.split("/");
  return spec.startsWith("@") ? `${parts[0]}/${parts[1]}` : parts[0];
}

describe("imports in the build scope", () => {
  it("name only packages listed in dependencies", () => {
    const unlisted = new Map<string, string[]>();
    const files = buildScope();
    expect(files.length).toBeGreaterThan(50);
    for (const file of files) {
      const info = ts.preProcessFile(readFileSync(file, "utf8"), true, true);
      for (const { fileName } of info.importedFiles) {
        const name = packageOf(fileName);
        if (name && !listed.has(name)) {
          const rel = path.relative(root, file).split(path.sep).join("/");
          unlisted.set(name, [...(unlisted.get(name) ?? []), rel]);
        }
      }
    }
    expect(Object.fromEntries(unlisted)).toEqual({});
  });
});
