import type { MetadataRoute } from "next";
import { cycles } from "@/data/cycles";
import { cycleRoutePath } from "@/lib/cycleRoutes";
import { SITE_URL } from "@/lib/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/cycles`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // One static route per cycle — the indexable home of each theory's
    // period, reference peak, calibration rationale, and paired series.
    ...cycles.map((cycle) => ({
      url: `${SITE_URL}${cycleRoutePath(cycle)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/poster`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/methods`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/colophon`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/embed/docs`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    // Plain-markdown content mirrors for LLM/agent consumption.
    {
      url: `${SITE_URL}/llms.txt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about.md`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/methods.md`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/colophon.md`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
