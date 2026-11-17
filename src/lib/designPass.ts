// The design and copy pass of 2026-11-17 (docs/DESIGN.md, docs/PRODUCT.md).
//
// Everything it adds is behind ONE build-time flag, and the flag is OFF unless set:
//
//   NEXT_PUBLIC_DESIGN_PASS_VARIANT = a | b | c   the home first screen uses that variant, and the
//                                                 cycle page, the 404 and the error screen use the
//                                                 pass's restyle and words.
//   (unset, or any other value)                   today's site, unchanged.
//
// NEXT_PUBLIC_ because src/app/error.tsx is a client component and must read the same switch.
// Rollback: leave it unset. No data, route or stored state depends on it.
//
// DESIGN_PASS_PREVIEW=1 (build time, never set on Render) additionally prerenders
// /design-pass/a, /b and /c, so one local build can frame all three variants side by side.
// Without it those routes do not exist (404).
//
// It stays off in production until David picks on the review page AND the I-077 / I-078 reads
// (2026-11-19) are taken: every variant leaves the phone glance caption, height label and
// verdict line exactly as the unflagged site draws them, so those reads judge those words alone.

export type DesignVariant = "a" | "b" | "c";

export const DESIGN_VARIANTS: readonly DesignVariant[] = ["a", "b", "c"];

export function parseDesignVariant(value: string | undefined | null): DesignVariant | null {
  return value === "a" || value === "b" || value === "c" ? value : null;
}

/** The variant the build was made with, or null for today's site. */
export function designVariant(): DesignVariant | null {
  return parseDesignVariant(process.env.NEXT_PUBLIC_DESIGN_PASS_VARIANT);
}

/** Whether this build prerenders the three preview routes. */
export function designPassPreview(): boolean {
  return process.env.DESIGN_PASS_PREVIEW === "1";
}
