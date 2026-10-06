// A bounded memo in front of an expensive renderer (SIN-R1, Astra review
// 2026-10-05). Custom /og override cards are ~2.5 s renders on one Starter
// instance and the override space is far too large to memoize whole, so:
// keep the most recent `maxEntries` finished variants, and refuse a fresh
// render with 429 when `maxInFlight` are already running or `maxPerWindow`
// have started in the last `windowMs`. A cached variant is always served,
// budget or not, and a request for a variant already rendering joins it.
//
// Renders in progress live in `pending`, never in the LRU, so eviction cannot
// drop one and let the same URL render twice (Codex r1, 2026-10-05). The
// pending map is bounded by `maxInFlight`, the LRU by `maxEntries`.

export function createRenderGate(opts: {
  maxEntries: number;
  maxInFlight: number;
  maxPerWindow: number;
  windowMs: number;
  /** A cached variant older than this renders again (the card dates itself). */
  maxAgeMs?: number;
  now?: () => number;
}) {
  const now = opts.now ?? Date.now;
  const maxAgeMs = opts.maxAgeMs ?? Infinity;
  const cache = new Map<string, { bytes: ArrayBuffer; at: number }>();
  const pending = new Map<string, Promise<ArrayBuffer>>();
  let starts: number[] = [];
  let renders = 0;

  const refuse = () =>
    new Response("Too many custom card renders; retry shortly.", {
      status: 429,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-store",
        "Retry-After": String(Math.ceil(opts.windowMs / 1000)),
      },
    });

  return {
    renderCount: () => renders,
    size: () => cache.size,
    async serve(
      key: string,
      render: () => Response,
      headers: HeadersInit
    ): Promise<Response> {
      const t = now();
      const hit = cache.get(key);
      if (hit && t - hit.at <= maxAgeMs) {
        // Refresh recency: Map iteration order is insertion order.
        cache.delete(key);
        cache.set(key, hit);
        return new Response(hit.bytes, { headers });
      }

      const running = pending.get(key);
      if (running) return new Response(await running, { headers });

      starts = starts.filter((s) => t - s < opts.windowMs);
      if (pending.size >= opts.maxInFlight || starts.length >= opts.maxPerWindow) {
        // Out of budget: a stale copy beats a refusal.
        return hit ? new Response(hit.bytes, { headers }) : refuse();
      }

      starts.push(t);
      renders += 1;
      // A synchronous throw here leaves nothing to undo: nothing is pending yet.
      const job = render().arrayBuffer();
      pending.set(key, job);
      try {
        const bytes = await job;
        cache.delete(key);
        cache.set(key, { bytes, at: t });
        while (cache.size > opts.maxEntries) {
          cache.delete(cache.keys().next().value as string);
        }
        return new Response(bytes, { headers });
      } finally {
        // A failed render is never cached; the next request may try again.
        pending.delete(key);
      }
    },
  };
}
