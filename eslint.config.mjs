import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // An in-page jump is a <HashLink href="#…"> (src/components/HashLink.tsx), never a plain
  // <a href="#…"> and never a <Link href="#…">. A plain anchor pushes a history entry with no
  // router state, and the App Router ignores a popstate without state, so Back from a page the
  // reader opened next changed the URL and left that page on screen (cold walk 2026-10-01, six
  // siblings swept the same day). next/link fixed Back but kept focus at the link and would not
  // repeat a jump to the hash already in the URL (Codex review r1, both reproduced).
  // NOT seen: an href held in a variable, built by a function or passed by spread; .ts/.js/.mdx;
  // HTML strings. Those still need a reader.
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/**/*.test.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...["a", "Link"].flatMap((el) => [
          {
            selector: `JSXOpeningElement[name.name='${el}'] > JSXAttribute[name.name='href'] Literal[value=/^#/]`,
            message: `Use <HashLink href="#…"> for an in-page jump: <${el} href="#…"> breaks Back, keyboard focus or a repeat jump (see HashLink.tsx).`,
          },
          {
            selector: `JSXOpeningElement[name.name='${el}'] > JSXAttribute[name.name='href'] TemplateLiteral[quasis.0.value.raw=/^#/]`,
            message: `Use <HashLink href={\`#…\`}> for an in-page jump: <${el} href={\`#…\`}> breaks Back, keyboard focus or a repeat jump (see HashLink.tsx).`,
          },
        ]),
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
