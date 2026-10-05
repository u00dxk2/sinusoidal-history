import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// SIN-S2 (security review 2026-10-05): the live service deploys only after CI
// passes (autoDeployTrigger: checksPass, set 2026-10-05, I-026), but
// render.yaml still said `autoDeploy: true`. A blueprint re-sync would have
// put deploys back on every push, CI or not. Pin the blueprint to the live
// setting. Text-level on purpose: the repo has no YAML parser, and the file
// is flat enough that each service is one `- type:` block.
const text = readFileSync(path.resolve(__dirname, "../../render.yaml"), "utf8");
const services = text
  .split(/\n(?=\s*- type:)/)
  .filter((block) => /^\s*- type:/m.test(block));

describe("render.yaml deploy trigger", () => {
  it("declares at least one service", () => {
    expect(services.length).toBeGreaterThan(0);
  });

  it.each(services.map((s) => [s.match(/name:\s*(\S+)/)?.[1] ?? "?", s]))(
    "%s deploys only after checks pass",
    (_name, block) => {
      expect(block).toMatch(/^\s*autoDeployTrigger:\s*checksPass\s*$/m);
      // The deprecated boolean must not sit beside it and contradict it.
      expect(block).not.toMatch(/^\s*autoDeploy:/m);
    }
  );
});
