import type { Metadata } from "next";
import { cycles } from "@/data/cycles";
import { holdsUpOverallAlt } from "@/lib/holdsUp";
import { SITE_NAME } from "@/lib/siteConfig";

/**
 * The OpenGraph and Twitter blocks for one page, naming THAT page.
 *
 * Next does not merge `openGraph` between a layout and a page: a page that sets none
 * inherits the root layout's whole block, url included. Until 2026-11-21, /methods,
 * /about, /colophon, /poster and /embed/docs all served `og:url` = the home page, and
 * the site's own title and description as their share preview (live GET, 2026-11-21).
 * A page that sets its own block must repeat the image, so this builds the whole block.
 *
 * `title` is the bare segment the root template turns into "<title> · Sinusoidal History";
 * the share preview carries that same full string.
 */
export function pageSocial(path: string, title: string, description: string): Pick<Metadata, "openGraph" | "twitter"> {
  const full = `${title} · ${SITE_NAME}`;
  return {
    openGraph: {
      title: full,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: "/og", width: 1200, height: 630, alt: holdsUpOverallAlt(cycles) }],
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: ["/og"],
    },
  };
}
