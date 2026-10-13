"use client";

import { useEffect } from "react";

// Opens the <details id={id}> when the page loads or is navigated to at #id (a hard load, or a
// next/link from another page), and on a native hashchange. Cycle pages link to
// /methods#cross-grid; both cold walkers (2026-10-13, I-041) landed on a closed box with the
// cells one more tap away. NOT covered: a router.push / history.pushState to #id while this
// page stays mounted fires no hashchange (Codex r2); no link on /methods does that today.
// Renders nothing; without JS the box simply stays closed.
export default function OpenOnHash({ id }: { id: string }) {
  useEffect(() => {
    const open = () => {
      if (window.location.hash !== `#${id}`) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) el.open = true;
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, [id]);
  return null;
}
