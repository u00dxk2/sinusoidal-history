"use client";

import { useEffect } from "react";

// Opens the <details id={id}> when the URL arrives at (or changes to) #id. Cycle pages link to
// /methods#cross-grid; both cold walkers (2026-10-13, I-041) landed on a closed box with the
// cells one more tap away. Renders nothing; without JS the box simply stays closed.
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
