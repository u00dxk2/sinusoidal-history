import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, expect, it } from "vitest";

// ponytail: one spawn, asserting on the vendored scanner's own --selftest, rather
// than importing it — the script carries a `#!` shebang that Vite rejects at
// collection, and a plugin to strip it would be more config than this earns.
describe("vendored secret scanner", () => {
  it(
    "passes its own selftest",
    () => {
      const script = path.resolve(__dirname, "../../scripts/check-staged-secrets.mjs");
      const r = spawnSync(process.execPath, [script, "--history", "30", "--selftest"], {
        encoding: "utf8",
      });
      expect(r.stdout + r.stderr).toContain("PASS");
      expect(r.status).toBe(0);
    },
    // 180s, not 60s: on 2026-10-17 it ran 70.9s under host load and passed on
    // re-run at the same commit, so a 60s budget made a full gate a coin flip.
    180_000,
  );
});
