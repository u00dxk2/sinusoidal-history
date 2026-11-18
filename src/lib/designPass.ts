// The design and copy pass of 2026-11-17 (docs/DESIGN.md, docs/PRODUCT.md).
//
// Everything it adds is behind ONE build-time flag, and the flag is OFF unless set:
//
//   NEXT_PUBLIC_DESIGN_PASS_VARIANT = a      the home first screen uses the recorder sheet
//                                            (variant a, the one picked), and the cycle page,
//                                            the 404 and the error screen use the pass's
//                                            restyle and words.
//   (unset, or any other value)              the site as it was before the pass.
//
// NEXT_PUBLIC_ because src/app/error.tsx is a client component and must read the same switch.
// A NEXT_PUBLIC_ value is inlined at build time, so changing it needs a rebuild (a Render
// deploy), not a restart.
// Rollback: unset it on Render and redeploy. No data, route or stored state depends on it.
//
// The variant leaves the phone glance caption, height label and verdict line exactly as the
// unflagged site draws them; I-077 and I-078 change those words after it, in their own order.
//
// The two variants that were not picked (b and c), their preview routes and the
// DESIGN_PASS_PREVIEW switch were removed at the rollout (2026-11-17, round 3). "b" and "c" now
// read as unset.

export type DesignVariant = "a";

export function parseDesignVariant(value: string | undefined | null): DesignVariant | null {
  return value === "a" ? value : null;
}

/** The variant the build was made with, or null for the site as it was before the pass. */
export function designVariant(): DesignVariant | null {
  return parseDesignVariant(process.env.NEXT_PUBLIC_DESIGN_PASS_VARIANT);
}
