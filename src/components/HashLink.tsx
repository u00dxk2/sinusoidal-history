"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` };

/**
 * An in-page jump that behaves like a native #hash link AND survives Back.
 *
 * Why not the two obvious shapes (both measured 2026-10-01):
 * - A plain <a href="#…"> pushes a history entry with no router state, and the
 *   App Router ignores a popstate without state, so Back from a page opened next
 *   changed the URL and left that page on screen (cold walk 2026-10-01, finding 1).
 * - next/link with a hash fixed Back but dropped two native behaviours (Codex
 *   review r1, both reproduced): keyboard focus stayed at the link instead of
 *   moving to the target, and a second click on the same link did not jump again.
 *
 * So the jump is done by hand: history.pushState(null, …), which Next's patched
 * pushState stamps with its own state (next/dist/client/components/app-router.js
 * pushState), then scrollIntoView (honours scroll-margin), then focus on the
 * target so the next Tab continues from there. Modified clicks (new tab, etc.)
 * fall through to the browser; with no JavaScript it is still a native link.
 */
export default function HashLink({ href, onClick, children, ...rest }: Props) {
  function jump(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    e.preventDefault();
    // A native jump to the hash already in the URL scrolls again without a new entry.
    if (window.location.hash !== href) window.history.pushState(null, "", href);
    target.scrollIntoView();
    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
      // globals.css drops the focus ring on these: a native jump draws none.
      target.setAttribute("data-hash-target", "");
    }
    target.focus({ preventScroll: true });
  }
  return (
    <a href={href} onClick={jump} {...rest}>
      {children}
    </a>
  );
}
