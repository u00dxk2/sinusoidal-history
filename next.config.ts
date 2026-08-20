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
              "(sinusoidal-history\\.skylarkcreations\\.com|www\\.sinusoidalhistory\\.com|sinusoidalhistory\\.org|www\\.sinusoidalhistory\\.org)",
          },
        ],
        destination: "https://sinusoidalhistory.com/:path*",
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
    ];
  },
};

export default nextConfig;
