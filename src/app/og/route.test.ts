import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { cardRenderCount, customRenderCount } from "@/lib/ogCardCache";
import { GET } from "./route";

// SIN-S1 (security review 2026-10-05): /og read `peak.<id>` / `period.<id>`
// with a bare Number(), so `abc` became NaN and `0` divided by zero — a
// broken bar on a public share card. The page clamps the same params to the
// calibration sliders' bounds (urlState.ts); the card now does the same, so
// one URL draws one picture on both.
const id = cycles[0].id;
const png = async (query: string) => {
  const res = await GET(new Request(`https://sinusoidalhistory.com/og${query}`));
  return { res, bytes: Buffer.from(await res.arrayBuffer()) };
};

describe("/og overrides are a trust boundary", () => {
  it("a non-numeric peak falls back to the cycle default", async () => {
    const base = await png("");
    const bad = await png(`?peak.${id}=abc`);
    expect(bad.bytes.equals(base.bytes)).toBe(true);
  }, 30000);

  it("period 0 is clamped to the slider minimum, as the page does", async () => {
    const min = Math.round(cycles[0].period_years * 0.75);
    const zero = await png(`?period.${id}=0`);
    const floor = await png(`?period.${id}=${min}`);
    expect(zero.bytes.equals(floor.bytes)).toBe(true);
  }, 30000);

  it("the default card is publicly cacheable", async () => {
    const { res } = await png("");
    expect(res.headers.get("cache-control")).toMatch(/public.*s-maxage=\d+/);
    expect(res.headers.get("content-type")).toBe("image/png");
  }, 30000);
});

describe("/og renders a card without overrides once, not per request", () => {
  it("repeat requests, junk params included, render the cycle card once", async () => {
    const slug = cycles[1].id.replace(/_/g, "-");
    const before = cardRenderCount();
    const a = await png(`?cycle=${slug}`);
    const b = await png(`?cycle=${slug}&utm_source=x`);
    const c = await png(`?cycle=${slug}&peak.${id}=zzz`);
    expect(cardRenderCount() - before).toBe(1);
    expect(b.bytes.equals(a.bytes) && c.bytes.equals(a.bytes)).toBe(true);
  }, 30000);

  it("a valid override renders fresh and leaves the cache alone", async () => {
    const base = await png("");
    const before = cardRenderCount();
    const moved = await png(`?peak.${id}=${cycles[0].reference_peak_year + 10}`);
    expect(moved.bytes.equals(base.bytes)).toBe(false);
    expect(cardRenderCount() - before).toBe(0);
  }, 30000);
});

// SIN-R1 (Astra review 2026-10-05): an override equal to the default still
// bypassed the memo, and every custom URL rendered afresh without limit.
describe("/og custom overrides are bounded", () => {
  it("a default-equivalent override is served as the plain snapshot", async () => {
    const base = await png("");
    const before = cardRenderCount() + customRenderCount();
    const same = await png(
      `?peak.${id}=${cycles[0].reference_peak_year}&period.${id}=${cycles[0].period_years}`
    );
    expect(same.bytes.equals(base.bytes)).toBe(true);
    expect(cardRenderCount() + customRenderCount() - before).toBe(0);
  }, 30000);

  it("a repeated custom override renders once", async () => {
    const before = customRenderCount();
    const q = `?peak.${id}=${cycles[0].reference_peak_year - 7}`;
    const a = await png(q);
    const b = await png(`${q}&utm_source=x`);
    expect(a.res.status).toBe(200);
    expect(b.bytes.equals(a.bytes)).toBe(true);
    expect(customRenderCount() - before).toBe(1);
  }, 30000);
});
