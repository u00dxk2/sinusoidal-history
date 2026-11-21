import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      {
        // Permanent 301s onto the canonical domain: the legacy subdomain
        // (the proven GPTBot channel — redirects stay forever), the .org
        // twin, and www variants. Render terminates TLS for all these
        // hosts on this service; the app picks the canonical one.
        source: "/:path*",
        has: [
          {
            type: "host",
            value:
              "(sinusoidal-history\\.skylarkcreations\\.com|www\\.sinusoidalhistory\\.com|sinusoidalhistory\\.org|www\\.sinusoidalhistory\\.org|sinusoidal-history\\.onrender\\.com)",
            // sinusoidal-history.onrender.com joined 2026-11-21 (search day): it answered 200 with
            // the apex canonical, a second copy of the whole site. Safe for Render's health check:
            // that check sends one of the service's verified custom domains as its Host, and counts
            // a 3xx as healthy (render.com/docs/health-checks, read 2026-11-21). This only redirects
            // requests that ask for the onrender host by name; the subdomain itself is a Render
            // setting and stays on.
          },
        ],
        destination: "https://sinusoidalhistory.com/:path*",
        permanent: true,
      },
      {
        // The yearly /state/<year> readings, retired 2026-10-21 (I-061, David:
        // "retire the yearly state pages"). Existing links land on the cycles
        // list. The frozen data file public/data/state-2026.csv stays, marked.
        source: "/state/:year*",
        destination: "/cycles",
        permanent: true,
      },
      {
        source: "/state",
        destination: "/cycles",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Allow /embed/* routes to be iframed cross-origin.
        source: "/embed/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "X-Frame-Options", value: "" },
        ],
      },
      {
        source: "/embed",
        headers: [
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
          { key: "X-Frame-Options", value: "" },
        ],
      },
      {
        // Make data files (CSVs, provenance markdown) fetchable cross-
        // origin so external agents and notebooks can pull them directly.
        source: "/data/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Range, Content-Type" },
        ],
      },
      {
        // Plain-text content mirrors for LLM/agent consumption.
        source: "/llms.txt",
        headers: [
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/:slug(about|methods|colophon).md",
        headers: [
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      // Each mirror names its HTML page as the canonical (2026-11-21, search day), so a search
      // engine that fetches the .md reads it as a copy of that page, not a second page.
      ...(["about", "methods", "colophon"] as const).map((slug) => ({
        source: `/${slug}.md`,
        headers: [{ key: "Link", value: `<https://sinusoidalhistory.com/${slug}>; rel="canonical"` }],
      })),
    ];
  },
};

export default nextConfig;
