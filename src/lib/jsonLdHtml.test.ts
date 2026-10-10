import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { cycleJsonLd } from "@/lib/cycleRoutes";
import { jsonLdHtml } from "@/lib/jsonLdHtml";

// Inline JSON-LD goes through one helper that escapes <, >, & and
// U+2028/U+2029, because JSON.stringify alone lets a `</script>` inside any
// string close the tag.
//
// Red proof: with jsonLdHtml reduced to a bare `JSON.stringify(data)` the
// first two tests fail.
//
// Scope: this file proves the helper. It does not prove that the three pages
// call it. Two source-text call-site rules were tried and both were defeated
// in review (a parenthesised raw call beside a safe one, then a raw string
// concatenated after the helper call), so none ships. A call-site guard has
// to render the pages, not read their text.

const LINE_SEP = String.fromCharCode(0x2028);
const PARA_SEP = String.fromCharCode(0x2029);

describe("jsonLdHtml", () => {
  it("cannot emit a sequence that closes the script tag", () => {
    const payload = { name: "</script><script>alert(1)</script>" };
    const html = jsonLdHtml(payload);
    expect(html.toLowerCase()).not.toContain("</script");
    expect(html).not.toContain("<");
    expect(html).not.toContain(">");
    expect(JSON.parse(html)).toEqual(payload);
  });

  it("escapes &, U+2028 and U+2029 and round-trips them", () => {
    const payload = { a: "x & y", b: `line${LINE_SEP}sep`, c: `para${PARA_SEP}sep` };
    const html = jsonLdHtml(payload);
    expect(html).not.toContain("&");
    expect(html).not.toContain(LINE_SEP);
    expect(html).not.toContain(PARA_SEP);
    expect(JSON.parse(html)).toEqual(payload);
  });

  it("is byte-identical to JSON.stringify when none of the five characters is present", () => {
    const payload = { "@type": "Dataset", name: "Kondratiev", n: [1, 2.5, null], q: 'a "quoted" \\ word' };
    expect(jsonLdHtml(payload)).toBe(JSON.stringify(payload));
  });

  it("changes nothing but the escapes on every real cycle payload", () => {
    expect(cycles.length).toBeGreaterThan(0);
    for (const cycle of cycles) {
      const data = cycleJsonLd(cycle);
      const html = jsonLdHtml(data);
      expect(JSON.parse(html)).toEqual(JSON.parse(JSON.stringify(data)));
      const unescaped = html
        .replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">")
        .replace(/\\u0026/g, "&")
        .replace(/\\u2028/g, LINE_SEP)
        .replace(/\\u2029/g, PARA_SEP);
      expect(unescaped).toBe(JSON.stringify(data));
    }
  });
});
