import { describe, expect, it } from "vitest";
import { createRenderGate } from "./renderGate";

// SIN-R1 (Astra review 2026-10-05): every valid /og override rendered a fresh
// ~2.5 s card, unbounded. The gate memoizes a bounded set of variants and
// refuses renders past a concurrency cap and a per-window budget.
const okRender = (tag: string) => () =>
  new Response(new TextEncoder().encode(tag));

const body = async (res: Response) => Buffer.from(await res.arrayBuffer()).toString();

describe("createRenderGate", () => {
  it("renders a repeated variant once", async () => {
    const gate = createRenderGate({ maxEntries: 4, maxInFlight: 2, maxPerWindow: 10, windowMs: 60_000 });
    let calls = 0;
    const render = () => {
      calls += 1;
      return okRender("a")();
    };
    await gate.serve("a", render, {});
    const res = await gate.serve("a", render, {});
    expect(calls).toBe(1);
    expect(await body(res)).toBe("a");
  });

  it("refuses with 429 past the per-window budget, without calling the renderer", async () => {
    let t = 0;
    const gate = createRenderGate({ maxEntries: 100, maxInFlight: 10, maxPerWindow: 3, windowMs: 60_000, now: () => t });
    let calls = 0;
    const render = (k: string) => () => {
      calls += 1;
      return okRender(k)();
    };
    const statuses: number[] = [];
    for (const k of ["a", "b", "c", "d", "e"]) {
      statuses.push((await gate.serve(k, render(k), {})).status);
    }
    expect(statuses).toEqual([200, 200, 200, 429, 429]);
    expect(calls).toBe(3);
    // A cached variant is still served while the budget is spent.
    expect((await gate.serve("a", render("a"), {})).status).toBe(200);
    expect(calls).toBe(3);
    // The budget refills once the window passes.
    t = 60_001;
    expect((await gate.serve("f", render("f"), {})).status).toBe(200);
    expect(calls).toBe(4);
  });

  it("refuses with 429 past the concurrency cap", async () => {
    const gate = createRenderGate({ maxEntries: 100, maxInFlight: 1, maxPerWindow: 100, windowMs: 60_000 });
    let release!: () => void;
    const slow = () =>
      new Response(
        new ReadableStream({
          start(ctrl) {
            release = () => {
              ctrl.enqueue(new TextEncoder().encode("slow"));
              ctrl.close();
            };
          },
        })
      );
    const first = gate.serve("slow", slow, {});
    const second = await gate.serve("other", okRender("other"), {});
    expect(second.status).toBe(429);
    release();
    expect((await first).status).toBe(200);
    expect((await gate.serve("other", okRender("other"), {})).status).toBe(200);
  });

  it("evicts the least recently used variant past maxEntries", async () => {
    const gate = createRenderGate({ maxEntries: 2, maxInFlight: 5, maxPerWindow: 100, windowMs: 60_000 });
    let calls = 0;
    const render = (k: string) => () => {
      calls += 1;
      return okRender(k)();
    };
    await gate.serve("a", render("a"), {});
    await gate.serve("b", render("b"), {});
    await gate.serve("a", render("a"), {}); // a is now most recent
    await gate.serve("c", render("c"), {}); // evicts b
    expect(gate.size()).toBe(2);
    await gate.serve("a", render("a"), {});
    expect(calls).toBe(3);
    await gate.serve("b", render("b"), {});
    expect(calls).toBe(4);
  });

  // Codex r1 (2026-10-05): a pending render sat in the LRU, so eviction could
  // drop it and a repeat request for the same URL rendered it a second time.
  it("never evicts a pending render; a repeat request joins it", async () => {
    const gate = createRenderGate({ maxEntries: 1, maxInFlight: 2, maxPerWindow: 100, windowMs: 60_000 });
    const releases: (() => void)[] = [];
    let aCalls = 0;
    const slowA = () => {
      aCalls += 1;
      return new Response(
        new ReadableStream({
          start(ctrl) {
            releases.push(() => {
              ctrl.enqueue(new TextEncoder().encode("A"));
              ctrl.close();
            });
          },
        })
      );
    };
    await gate.serve("x", okRender("x"), {});
    const first = gate.serve("A", slowA, {});
    await gate.serve("B", okRender("B"), {}); // fills the one LRU slot
    const repeat = gate.serve("A", slowA, {});
    for (const r of releases) r();
    expect(await body(await first)).toBe("A");
    expect(await body(await repeat)).toBe("A");
    expect(aCalls).toBe(1);
  });

  it("renders a variant again once it is older than maxAgeMs", async () => {
    let t = 0;
    const gate = createRenderGate({ maxEntries: 4, maxInFlight: 2, maxPerWindow: 10, windowMs: 1, maxAgeMs: 1000, now: () => t });
    let calls = 0;
    const render = () => {
      calls += 1;
      return okRender("a")();
    };
    await gate.serve("a", render, {});
    t = 1000;
    await gate.serve("a", render, {});
    expect(calls).toBe(1);
    t = 1001;
    await gate.serve("a", render, {});
    expect(calls).toBe(2);
  });

  it("serves an expired copy instead of 429 when the budget is spent", async () => {
    let t = 0;
    const gate = createRenderGate({ maxEntries: 4, maxInFlight: 2, maxPerWindow: 1, windowMs: 10_000, maxAgeMs: 1000, now: () => t });
    let calls = 0;
    const render = () => {
      calls += 1;
      return okRender("a")();
    };
    await gate.serve("a", render, {});
    t = 2000; // expired, and the one render in this window is spent
    const res = await gate.serve("a", render, {});
    expect(res.status).toBe(200);
    expect(await body(res)).toBe("a");
    expect(calls).toBe(1);
  });

  it("does not keep a failed render", async () => {
    const gate = createRenderGate({ maxEntries: 4, maxInFlight: 2, maxPerWindow: 10, windowMs: 60_000 });
    const bad = () =>
      new Response(
        new ReadableStream({
          start(ctrl) {
            ctrl.error(new Error("boom"));
          },
        })
      );
    await expect(gate.serve("x", bad, {})).rejects.toThrow();
    expect(gate.size()).toBe(0);
  });
});
