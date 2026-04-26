import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";

/**
 * Open to everyone, including LLM crawlers (GPTBot, ClaudeBot,
 * PerplexityBot, Google-Extended, etc.). Wildcard `*` rule covers them
 * all; per-bot rules would only matter if we wanted differentiated
 * access. The site is meant to be read and quoted.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
