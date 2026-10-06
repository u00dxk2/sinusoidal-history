// The /og cards without overrides — the home snapshot and the per-cycle
// /cycles/<slug> cards — are rendered once per process per UTC day and served
// from memory. Their Cache-Control already says public, but the edge in front
// of Render does not cache that extensionless route (cf-cache-status:
// DYNAMIC), so each request cost a ~2.5 s render on the single Starter
// instance (SIN-S1, security review 2026-10-05). Junk query params do not
// bust this. Valid overrides go through `customCard` instead: a bounded memo
// with a render budget that answers 429 when spent (SIN-R1, renderGate.ts).

import { createRenderGate } from "./renderGate";

export const CARD_HEADERS = {
  "Content-Type": "image/png",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
};

const cache = new Map<string, Promise<ArrayBuffer>>();
let cacheDay = "";
let misses = 0;

/** How many times this process has rendered a memoized card (test hook). */
export function cardRenderCount(): number {
  return misses;
}

const customGate = createRenderGate({
  maxEntries: 32,
  maxInFlight: 2,
  maxPerWindow: 20,
  windowMs: 60_000,
  maxAgeMs: 60 * 60_000,
});

/** How many custom-override cards this process has rendered (test hook). */
export function customRenderCount(): number {
  return customGate.renderCount();
}

export function customCard(
  key: string,
  render: () => Response
): Promise<Response> {
  return customGate.serve(key, render, CARD_HEADERS);
}

export async function memoCard(
  variant: string,
  render: () => Response
): Promise<Response> {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== cacheDay) {
    cache.clear();
    cacheDay = day;
  }
  let bytes = cache.get(variant);
  if (!bytes) {
    misses += 1;
    bytes = render().arrayBuffer();
    cache.set(variant, bytes);
    // A failed render must not be served from memory for the rest of the day.
    bytes.catch(() => cache.delete(variant));
  }
  return new Response(await bytes, { headers: CARD_HEADERS });
}
