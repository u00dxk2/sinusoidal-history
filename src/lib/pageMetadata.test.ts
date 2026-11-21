import { describe, expect, it } from "vitest";
import { metadata as methodsMeta } from "@/app/(app)/methods/page";
import { metadata as aboutMeta } from "@/app/(app)/about/page";
import { metadata as colophonMeta } from "@/app/(app)/colophon/page";
import { metadata as posterMeta } from "@/app/poster/page";
import { metadata as embedDocsMeta } from "@/app/embed/docs/page";

describe("og:url names each page (2026-11-21: five pages served the home URL)", () => {
  it.each([
    ["/methods", methodsMeta],
    ["/about", aboutMeta],
    ["/colophon", colophonMeta],
    ["/poster", posterMeta],
    ["/embed/docs", embedDocsMeta],
  ] as const)("%s", (path, meta) => {
    const m = meta as {
      title?: string;
      openGraph?: { url?: string; title?: string; images?: unknown[] };
      alternates?: { canonical?: string };
    };
    expect(m.openGraph?.url).toBe(path);
    expect(m.openGraph?.images?.length).toBe(1);
    expect(m.alternates?.canonical).toBe(path);
    // The share title is the page's own <title>, never new words.
    expect(m.openGraph?.title).toBe(`${m.title} · Sinusoidal History`);
  });
});
