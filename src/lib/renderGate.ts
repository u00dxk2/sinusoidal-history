// A bounded memo in front of an expensive renderer (SIN-R1, Astra review
// 2026-10-05). Custom /og override cards are ~2.5 s renders on one Starter
// instance and the override space is far too large to memoize whole, so:
// keep the most recent `maxEntries` variants, and refuse a fresh render with
// 429 when `maxInFlight` are already running or `maxPerWindow` have started in
// the last `windowMs`. A cached variant is always served, budget or not.

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
  const cache = new Map<string, { bytes: Promise<ArrayBuffer>; at: number }>();
  let starts: number[] = [];
  let inFlight = 0;
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
        return new Response(await hit.bytes, { headers });
      }

      starts = starts.filter((s) => t - s < opts.windowMs);
      if (inFlight >= opts.maxInFlight || starts.length >= opts.maxPerWindow) {
        // Out of budget: a stale copy beats a refusal.
        return hit ? new Response(await hit.bytes, { headers }) : refuse();
      }

      starts.push(t);
      inFlight += 1;
      renders += 1;
      let entry: { bytes: Promise<ArrayBuffer>; at: number };
      try {
        entry = { bytes: render().arrayBuffer(), at: t };
      } catch (err) {
        inFlight -= 1;
        throw err;
      }
      cache.delete(key);
      cache.set(key, entry);
      while (cache.size > opts.maxEntries) {
        cache.delete(cache.keys().next().value as string);
      }
      try {
        return new Response(await entry.bytes, { headers });
      } catch (err) {
        // A failed render must not be served from memory.
        if (cache.get(key) === entry) cache.delete(key);
        throw err;
      } finally {
        inFlight -= 1;
      }
    },
  };
}
