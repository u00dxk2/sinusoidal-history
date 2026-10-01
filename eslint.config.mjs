import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // An in-page jump is a <Link href="#…">, never a plain <a href="#…">. A native #hash jump
  // pushes a history entry with no router state, and the App Router ignores a popstate without
  // state (next/dist/client/components/app-router.js onPopState), so Back into that entry from a
  // page the reader opened next changes the URL and leaves the other page on screen. Found by
  // the 2026-10-01 cold walk on /cycles; six siblings swept the same day.
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/**/*.test.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name='a'] > JSXAttribute[name.name='href'] Literal[value=/^#/]",
          message: "Use <Link href=\"#…\"> for an in-page jump: a plain <a href=\"#…\"> breaks Back (the App Router ignores a stateless popstate).",
        },
        {
          selector: "JSXOpeningElement[name.name='a'] > JSXAttribute[name.name='href'] TemplateLiteral[quasis.0.value.raw=/^#/]",
          message: "Use <Link href={`#…`}> for an in-page jump: a plain <a href={`#…`}> breaks Back (the App Router ignores a stateless popstate).",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
