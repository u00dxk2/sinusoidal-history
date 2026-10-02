"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The sideways scroller the spectral figure sits in below md, which keeps the
 * reader's sideways place across a round trip to the opened SVG.
 *
 * The browser restores the page's own scroll on Back but not an inner
 * scroller's: measured 2026-10-02 on the local build, scrollY came back exact
 * and the figure's scrollLeft went 200 → 0 on 27 of 27 phone landings (Codex
 * review r1 #3 named the gap; check-verdict-landing's Back leg reads it). So the
 * position is kept in sessionStorage per page and put back on mount. Storage
 * can throw (private windows, blocked site data); then the scroller simply
 * starts at the left, as it did before.
 */
export default function FigureScroller({
  storageKey,
  label,
  className,
  children,
}: {
  storageKey: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const key = `figure-scroll:${storageKey}`;
    try {
      const saved = Number(sessionStorage.getItem(key));
      if (saved > 0) el.scrollLeft = saved;
    } catch {}
    let frame = 0;
    const save = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(key, String(Math.round(el.scrollLeft)));
        } catch {}
      });
    };
    el.addEventListener("scroll", save, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", save);
    };
  }, [storageKey]);

  return (
    <div ref={ref} tabIndex={0} role="region" aria-label={label} className={className}>
      {children}
    </div>
  );
}
