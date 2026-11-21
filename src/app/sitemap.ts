import type { MetadataRoute } from "next";
import { cycles } from "@/data/cycles";
import { cycleRoutePath } from "@/lib/cycleRoutes";
import { SITE_URL } from "@/lib/siteConfig";

/**
 * HTML pages only, and no `lastModified` (2026-11-21, the search day).
 *
 * Before: every URL carried `new Date()`, so all 21 shared one lastmod, the build time, and it
 * moved on every deploy whether or not the page did. A lastmod that always says "just now" is
 * one a search engine learns to ignore. With no per-page record of when each page's content last
 * changed, the honest value is none.
 *
 * The plain-text mirrors (`/llms.txt`, `/about.md`, `/methods.md`, `/colophon.md`) left the
 * sitemap the same day. Each `.md` repeats an HTML page that is listed here, and carries a
 * `Link: rel="canonical"` header naming that page (next.config.ts). The files are still served
 * and still linked; crawlers fetch them already (crawl read 2026-09-08).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/cycles`, changeFrequency: "monthly", priority: 0.9 },
    // One static route per cycle — the indexable home of each theory's
    // period, reference peak, calibration rationale, and paired series.
    ...cycles.map((cycle) => ({
      url: `${SITE_URL}${cycleRoutePath(cycle)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/poster`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/methods`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/colophon`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/embed/docs`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
