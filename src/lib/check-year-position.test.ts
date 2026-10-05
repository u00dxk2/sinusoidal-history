import { spawn } from "node:child_process";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// scripts/check-year-position.mjs runs at import (top-level await + a browser),
// so it is SPAWNED, never imported. Bad input must end in a stated refusal
// (exit 2), never in an uncaught stack (exit 1) a reader could mistake for a
// page FAIL (exit 3) — security review 2026-10-05, self-audit smallest move.
const script = path.resolve(__dirname, "../../scripts/check-year-position.mjs");
// Async on purpose: spawnSync would block this process, and with it the fake
// origin below, so the child's fetch would never be answered.
const run = (...args: string[]) =>
  new Promise<{ status: number | null; stdout: string }>((resolve) => {
    const child = spawn(process.execPath, [script, ...args]);
    let stdout = "";
    child.stdout.on("data", (d) => (stdout += d));
    const timer = setTimeout(() => child.kill(), 60000);
    child.on("close", (status) => {
      clearTimeout(timer);
      resolve({ status, stdout });
    });
  });

let server: Server;
let origin = "";
beforeAll(async () => {
  // An origin whose /api/v1/state answers with the wrong shape.
  server = createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    res.end(req.url === "/api/v1/state" ? "{}" : "not json");
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => server.close());

describe("check-year-position.mjs", () => {
  it("its own selftest passes (the red arms)", async () => {
    const r = await run("--selftest");
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/selftest: (\d+)\/\1 PASS/);
  }, 60000);

  it("refuses an origin that is not an http(s) URL", async () => {
    const r = await run("not a url");
    expect(r.status).toBe(2);
    expect(r.stdout).toMatch(/^REFUSED/m);
  }, 60000);

  it("refuses an API answer with no cycles list", async () => {
    const r = await run(origin);
    expect(r.status).toBe(2);
    expect(r.stdout).toMatch(/^REFUSED/m);
  }, 60000);
});
