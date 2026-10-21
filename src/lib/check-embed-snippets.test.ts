import { spawn } from "node:child_process";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// scripts/check-embed-snippets.mjs runs at import (top-level await + a browser), so it is
// SPAWNED, never imported — the shape of the retired (2026-10-21) check-year-position.test.ts. Async spawn on purpose: a
// sync one would block the fake origin below and the child's fetch would never be answered.
const script = path.resolve(__dirname, "../../scripts/check-embed-snippets.mjs");
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
  // An origin whose docs page carries no snippet at all.
  server = createServer((req, res) => {
    if (req.url === "/api/v1/cycles") {
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify([{ id: "huntington", period_years: 60, reference_peak_year: 1968 }]));
      return;
    }
    res.setHeader("content-type", "text/html");
    res.end("<html><body><p>no snippets here</p></body></html>");
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => server.close());

describe("check-embed-snippets.mjs", () => {
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

  it("refuses a docs page with no snippets, rather than passing an empty population", async () => {
    const r = await run(origin);
    expect(r.status).toBe(2);
    expect(r.stdout).toMatch(/^REFUSED.*no parseable iframe snippets/m);
  }, 60000);
});
