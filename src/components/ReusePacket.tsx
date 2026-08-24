"use client";

import { useState } from "react";

const LINK_CLASS =
  "underline decoration-ink/30 underline-offset-[3px] hover:decoration-ink transition-colors";

/** Rasterise a same-origin SVG through a canvas and hand it back as a PNG. */
async function svgToPngBlob(svgUrl: string, scale = 2): Promise<Blob> {
  const svgText = await fetch(svgUrl).then((r) => r.text());
  const blobUrl = URL.createObjectURL(
    new Blob([svgText], { type: "image/svg+xml" })
  );
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("figure failed to load"));
      img.src = blobUrl;
    });
    // ponytail: the committed figures are all 900x500; fall back to that when a
    // browser reports no intrinsic size for an SVG without width/height attrs.
    const canvas = document.createElement("canvas");
    canvas.width = (img.naturalWidth || 900) * scale;
    canvas.height = (img.naturalHeight || 500) * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("canvas encode failed"))),
        "image/png"
      )
    );
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function FigureDownloads({
  svgHref,
  slug,
}: {
  svgHref: string;
  slug: string;
}) {
  const [pngState, setPngState] = useState<"idle" | "working" | "failed">(
    "idle"
  );

  async function downloadPng() {
    setPngState("working");
    try {
      saveBlob(await svgToPngBlob(svgHref), `${slug}-spectral.png`);
      setPngState("idle");
    } catch {
      setPngState("failed");
    }
  }

  // min-h-11 via [&_a]/[&_button]: these measured 109×16px on a phone.
  // Canon R28; journey-walk 2026-08-24, J13.
  return (
    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-0 text-[12px] uppercase tracking-[0.16em] font-mono [&_a]:inline-flex [&_a]:items-center [&_a]:min-h-11 [&_button]:inline-flex [&_button]:items-center [&_button]:min-h-11">
      <li>
        <a href={svgHref} download={`${slug}-spectral.svg`} className={LINK_CLASS}>
          Figure SVG ↓
        </a>
      </li>
      <li>
        <button type="button" onClick={downloadPng} className={LINK_CLASS}>
          {pngState === "working" ? "Rendering…" : "Figure PNG ↓"}
        </button>
        {pngState === "failed" && (
          <span className="ml-2 normal-case tracking-normal text-ink-soft">
            PNG export failed — the SVG link still works.
          </span>
        )}
      </li>
    </ul>
  );
}

export function CopyAttribution({ citation }: { citation: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, permissions) — the text is
      // selectable in the block above, so there is nothing to recover from.
    }
  }

  return (
    <div className="mt-4 border-t border-rule/30 pt-4">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/80">
          Reuse this
        </h3>
        <button
          type="button"
          onClick={copy}
          className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink border border-rule/50 px-3 py-1.5 hover:bg-paper-deep transition-colors"
        >
          {copied ? "Copied ✓" : "Copy attribution"}
        </button>
      </div>
      <p className="mt-3 text-[13px] leading-[1.7] text-ink-soft select-all">
        {citation}
      </p>
      <p className="mt-3 text-[12px] leading-relaxed text-ink-soft/85">
        Our code and the original chart files are MIT-licensed as our own
        work. The plotted data stay under their upstream terms, listed above:
        CC BY series carry their attribution requirement with them, and a
        series with no explicit license is shown here without any grant we
        can pass on. Reuse our figures and code with attribution; honour the
        data terms for the plotted series.
      </p>
    </div>
  );
}
