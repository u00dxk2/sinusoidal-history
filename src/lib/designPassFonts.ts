// Self-hosted, latin-subset faces for the design pass (docs/DESIGN.md): IBM Plex Sans Condensed
// 600 for display, IBM Plex Serif 400 and 600 for text. SIL Open Font License; the files in
// src/fonts are the fontsource latin subsets. No build-time or run-time font fetch.
//
// preload is false on purpose: with the flag off no element uses these families, so no page
// should ask for the files. The classes only define CSS variables; src/app/globals.css maps
// them inside `.dp` and `[data-dp]`.
import localFont from "next/font/local";

export const dpDisplay = localFont({
  src: [{ path: "../fonts/ibm-plex-sans-condensed-latin-600.woff2", weight: "600", style: "normal" }],
  variable: "--font-dp-display",
  display: "swap",
  preload: false,
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

export const dpText = localFont({
  src: [
    { path: "../fonts/ibm-plex-serif-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ibm-plex-serif-latin-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-dp-text",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});

/**
 * The two variable classes. Applied ONLY in src/app/layout.tsx, on <html>: next/font cannot
 * run under vitest, and several tests import page modules, so no page or component may import
 * this file (the first variants run stopped on exactly that, 2026-11-17).
 */
export const dpFontVariables = `${dpDisplay.variable} ${dpText.variable}`;
