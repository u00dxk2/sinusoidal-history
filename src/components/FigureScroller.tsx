"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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

/**
 * Which edges of a sideways scroller have more figure beyond them. A pixel of slack absorbs
 * sub-pixel scroll positions (a zoomed page can stop at scrollLeft 195.6 of 196). No overflow
 * at all, as at lg+ where the figure is drawn whole, means no edge cue anywhere.
 */
export function hiddenEdges(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
): { left: boolean; right: boolean } {
  const slack = 1;
  const max = scrollWidth - clientWidth;
  if (max <= slack) return { left: false, right: false };
  return { left: scrollLeft > slack, right: scrollLeft < max - slack };
}

type Edges = { left: boolean; right: boolean; bar: number };

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
  // The edge cue (I-031, 2026-10-11). At 900px with a mouse the figure was cut 196px with
  // nothing marking the cut, and a plain wheel moves the page, not the figure (W-004 walk
  // 2026-10-09; headed read 2026-10-11: a 15px scrollbar IS drawn, but ~480px below the cut).
  // So each clipped side gets a fade and a button a mouse can click, placed near the top where
  // the cut legend is. They sit OUTSIDE the scroller, so they do not scroll away, and outside
  // the figure's link, so a click on them never opens the SVG. Driven by measured overflow,
  // not a breakpoint: from lg up the figure is drawn whole and nothing shows.
  const [edges, setEdges] = useState<Edges>({ left: false, right: false, bar: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const next = hiddenEdges(el.scrollLeft, el.scrollWidth, el.clientWidth);
      const bar = el.offsetHeight - el.clientHeight;
      setEdges((prev) =>
        prev.left === next.left && prev.right === next.right && prev.bar === bar
          ? prev
          : { ...next, bar },
      );
    };
    measure();
    // The image may not have its width at mount, and the window can change size.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  };

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

  const button =
    "absolute top-2 z-10 flex items-center justify-center w-11 h-11 rounded-full border border-rule/50 bg-paper/95 text-ink text-[18px] leading-none shadow-sm hover:border-ink/60 focus-visible:outline-2 focus-visible:outline-ink";

  return (
    <div className="relative">
      <div ref={ref} tabIndex={0} role="region" aria-label={label} className={className}>
        {children}
      </div>
      {edges.left && (
        <>
          <div
            aria-hidden
            data-edge-fade="left"
            className="pointer-events-none absolute left-0 top-0 w-12 bg-gradient-to-r from-paper to-transparent"
            style={{ bottom: edges.bar }}
          />
          <button
            type="button"
            data-edge-cue="left"
            aria-label="Show the left part of the figure"
            onClick={() => step(-1)}
            className={`${button} left-1`}
          >
            <span aria-hidden>←</span>
          </button>
        </>
      )}
      {edges.right && (
        <>
          <div
            aria-hidden
            data-edge-fade="right"
            className="pointer-events-none absolute right-0 top-0 w-12 bg-gradient-to-l from-paper to-transparent"
            style={{ bottom: edges.bar }}
          />
          <button
            type="button"
            data-edge-cue="right"
            aria-label="Show the right part of the figure"
            onClick={() => step(1)}
            className={`${button} right-1`}
          >
            <span aria-hidden>→</span>
          </button>
        </>
      )}
    </div>
  );
}
