"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The sideways scroller the spectral figure sits in below md, which keeps the
 * reader's sideways place when they come BACK to the page, and starts at the
 * left edge whenever they arrive fresh.
 *
 * The browser restores the page's own scroll on Back but not an inner
 * scroller's (measured 2026-10-02: scrollLeft 200 → 0 on 27 of 27 phone
 * landings), so the place has to be kept somewhere. Round 2 kept it in
 * sessionStorage and restored it on every mount, which reopened the figure
 * mid-way on a fresh visit by a link too (I-018; cold walk 2026-10-02 r2,
 * finding 1). A navigation-type test cannot fix that: an in-app Back reads
 * "navigate", and after a Back from the opened SVG every later in-app arrival
 * reads "back_forward" (measured on production, tmp/measure-restore-navtypes).
 *
 * So the place is kept ON THE HISTORY ENTRY it belongs to. A link creates a
 * new entry with no saved place, so it starts at 0. Back or Forward returns to
 * the entry, and its state comes back with it: the App Router preserves custom
 * history state on a traverse, and the browser restores it on a document Back
 * (from the opened SVG). Saving is debounced, because Safari throttles
 * replaceState; history access can throw, and then the scroller simply starts
 * at the left.
 */
const STATE_KEY = "figureScroll";

function savedPlace(key: string): number {
  try {
    const saved = (window.history.state?.[STATE_KEY] as Record<string, number> | undefined)?.[key];
    return typeof saved === "number" && saved > 0 ? saved : 0;
  } catch {
    return 0;
  }
}

function savePlace(key: string, left: number) {
  try {
    const state = window.history.state ?? {};
    const places = { ...(state[STATE_KEY] as Record<string, number> | undefined), [key]: left };
    window.history.replaceState({ ...state, [STATE_KEY]: places }, "");
  } catch {}
}

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
    const saved = savedPlace(storageKey);
    if (saved > 0) el.scrollLeft = saved;
    // Read by check-verdict-landing: the restore (or the decision not to) has
    // run, so a scrollLeft read after this is the settled answer.
    el.dataset.placeReady = "1";
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pendingFor = "";
    const write = () => savePlace(storageKey, Math.round(el.scrollLeft));
    const save = () => {
      clearTimeout(timer);
      pendingFor = location.href;
      timer = setTimeout(() => {
        timer = undefined;
        // A browser Back inside the debounce has already moved history to
        // another entry; writing now would put this place on THAT entry
        // (Codex r3-1 #2). The last <250ms of swiping before such a Back is
        // lost instead: a declared limit, not a bug.
        if (location.href === pendingFor) write();
      }, 250);
    };
    // Any click may be the one that leaves (the figure's own link, an in-app
    // link). Write the current place onto the CURRENT entry at the click,
    // before the router pushes the next one, and do it even with no save
    // pending: an in-page hash jump (HashLink) pushes an entry that carries no
    // place, and the reader may then leave from it without swiping again
    // (Codex r3-1 #1).
    const flush = () => {
      clearTimeout(timer);
      timer = undefined;
      write();
    };
    el.addEventListener("scroll", save, { passive: true });
    document.addEventListener("click", flush, true);
    window.addEventListener("pagehide", flush);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", save);
      document.removeEventListener("click", flush, true);
      window.removeEventListener("pagehide", flush);
    };
  }, [storageKey]);

  return (
    <div ref={ref} tabIndex={0} role="region" aria-label={label} className={className}>
      {children}
    </div>
  );
}
