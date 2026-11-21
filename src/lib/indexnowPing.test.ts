import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Spawned, not imported: scripts/*.mjs are not in the TypeScript project. --dry-run never
// touches the network.
const SCRIPT = join(process.cwd(), "scripts", "indexnow-ping.mjs");
const run = (...args: string[]) =>
  spawnSync(process.execPath, [SCRIPT, "--dry-run", ...args], { encoding: "utf8" });

describe("indexnow-ping (dry run)", () => {
  it("builds the body for canonical-host URLs (positive control)", () => {
    const r = run("https://sinusoidalhistory.com/cycles/dalio", "https://sinusoidalhistory.com/");
    expect(r.status).toBe(0);
    const body = JSON.parse(r.stdout);
    expect(body.host).toBe("sinusoidalhistory.com");
    expect(body.keyLocation).toBe(`https://sinusoidalhistory.com/${body.key}.txt`);
    expect(body.urlList).toHaveLength(2);
  });

  it.each([
    "https://sinusoidal-history.onrender.com/cycles/dalio",
    "http://sinusoidalhistory.com/",
    "https://www.sinusoidalhistory.com/",
    "not a url",
  ])("refuses %s", (url) => {
    const r = run("https://sinusoidalhistory.com/", url);
    expect(r.status).toBe(1);
    expect(r.stdout).toBe("");
  });

  it("sends each URL as parsed, not as typed", () => {
    const r = run("https://sinusoidalhistory.com/about me", "https://SinusoidalHistory.com/cycles");
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout).urlList).toEqual([
      "https://sinusoidalhistory.com/about%20me",
      "https://sinusoidalhistory.com/cycles",
    ]);
  });

  it("refuses an empty list", () => {
    expect(run().status).toBe(1);
  });
});
