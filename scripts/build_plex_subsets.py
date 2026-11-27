"""Rebuild the three self-hosted Plex subsets in src/fonts with the characters they lacked added.

Why (I-092): the fontsource latin subsets carry U+2191/U+2193 but not U+2190/U+2192, so every
arrow in an element set in Plex ("Details ->", "<- drag to zoom ->") was drawn in a fallback system
face. The same held for five more characters the site renders; EXTRA lists them all.

Source: the Google Fonts TTFs that fontsource builds from (google/fonts, ofl/ibmplexsanscondensed
and ofl/ibmplexserif). Version 1.3 (Sans Condensed SemiBold) and 2.6 (Serif Regular, SemiBold),
the same versions as the pinned files. Licence: SIL OFL 1.1, which permits subsetting.

Baseline: the fontsource files as committed at BASELINE_REF (read with `git show`, never from
src/fonts, which holds the rebuilt files once they are committed; Codex r1 on 2180e42).

Recipe: keep exactly the code points the baseline file maps, add EXTRA, and mirror the baseline's
options: the same seven layout features, name IDs 0-6 and 14, hinting kept, glyph names kept, WOFF2.

Verify (every mode that builds):
  - cmap: exactly the baseline's code points plus EXTRA (minus EXTRA under --control);
  - every baseline GLYPH, by name (so `fi`, fraction and mark glyphs too, not only mapped ones):
    the same outline, the same hmtx record, the same TrueType hinting program;
  - fpgm, prep, cvt and gasp byte-identical; line and design metrics (LINE_METRICS) identical;
  - shaping, through HarfBuzz, identical on a corpus: every ordered pair of baseline code points and
    every non-empty string literal under src/ (the text the site renders, comments included), each
    shaped with the browser's default features and again with each of frac, numr and dnom on. Glyph names, advances and
    offsets must match. Strings that hold an added character are counted and skipped: they are
    meant to change. This is how kerning, ligatures, contextual substitution and mark positioning
    are compared: by what they do, not by how the tables encode it;
  - the name table, keyed by (nameID, platformID, platEncID, langID);
  - size: each file grows by at most MAX_GROWTH bytes.
  - each ADDED code point draws the source font's own glyph for it (outline and advance), and the
    GSUB/GPOS feature tags are the baseline's (so no feature the shaping below never turns on).
  Blind to: shaping of sequences longer than two characters that the literal regex does not
  collect (JSX text spanning lines, template literals with ${...} unevaluated, JSON escapes left
  undecoded: a three-character contextual rule fired only there would pass), rendering at a
  particular size (hinting is compared as bytes, not run), any browser behaviour (see
  scripts/check-glyph-source.mjs), and a --baseline-ref the operator supplies that shares a
  regression (the guard refuses only a baseline that already maps an added code point).

Modes:
  --control  build with the baseline code points only (no extras); verify must pass. It is NOT
             byte-identical (measured 2026-11-27): fontsource's build keeps the full font's hhea/
             maxp extents and its code-page bits; this one recomputes them. Verify covers what lays
             text out, and those fields do not.
  (default)  build with EXTRA into --out-dir, then verify. Copy the files into src/fonts yourself;
             the script refuses src/fonts as --out-dir.
  --check    no build: verify the files committed in src/fonts (refused if the working tree
             differs from HEAD) against the baseline, with --source-dir for the added glyphs. This is
             the gate for what ships (a fresh build's WOFF2 size varies by a few dozen bytes from
             run to run, so verifying a build is not verifying the committed file).
  --sweep    no build: list every non-ASCII character in src/app, src/components, src/lib and
             src/data (.ts/.tsx/.json, tests excluded) that the files in src/fonts do not map.
             Comments count, so read each hit's file before adding it to EXTRA. Blind to characters
             written as JSX entities (&#x2605;) or escapes (\\u2605) and to generated text: an
             inventory, it exits 0 whatever it lists.

Usage: python -P scripts/build_plex_subsets.py --source-dir <dir with the 3 TTFs> --out-dir <dir> [--control] [--baseline-ref <git ref>]
       python -P scripts/build_plex_subsets.py --check --source-dir <dir with the 3 TTFs> [--baseline-ref <git ref>]
       python -P scripts/build_plex_subsets.py --sweep
"""
import argparse
import collections
import io
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

import uharfbuzz as hb
from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

REPO = Path(__file__).resolve().parent.parent
FONTS = REPO / "src" / "fonts"
# The last commit whose src/fonts are the untouched fontsource subsets (main before I-092).
BASELINE_REF = "943805111c1d30e32af3abe609e637fc9b5bdab6"
PAIRS = [
    ("ibm-plex-sans-condensed-latin-600.woff2", "IBMPlexSansCondensed-SemiBold.ttf"),
    ("ibm-plex-serif-latin-400.woff2", "IBMPlexSerif-Regular.ttf"),
    ("ibm-plex-serif-latin-600.woff2", "IBMPlexSerif-SemiBold.ttf"),
]
# The arrows (I-092), then the siblings the same sweep found on rendered surfaces (2026-11-27,
# a static read of src/app, src/components, src/lib and src/data against the baseline cmaps) that
# upstream carries in all three faces. Not added because upstream lacks them: U+0394 and U+03C6
# (/methods, in a code span and in prose) and U+25BE (the /cycles disclosure triangle).
EXTRA = [
    0x2190,  # LEFTWARDS ARROW
    0x2192,  # RIGHTWARDS ARROW
    0x2248,  # ALMOST EQUAL TO (rationale prose, the worked example's formula)
    0x2265,  # GREATER-THAN OR EQUAL TO (/methods, the Project Mars description)
    0x2197,  # NORTH EAST ARROW ("Upstream source")
    0x2713,  # CHECK MARK ("Copied")
    0x03C0,  # GREEK SMALL LETTER PI (the worked example's formula)
    0x2264,  # LESS-THAN OR EQUAL TO: not used on the site; the subsetter keeps it with U+2265
             # (glyph closure, measured 2026-11-27), so it is listed to keep the cmap check exact
]
FEATURES = ["ccmp", "dnom", "frac", "liga", "numr", "kern", "mark"]
NAME_IDS = [0, 1, 2, 3, 4, 5, 6, 14]  # what the baseline files carry (no ID 13 in any of them)
LINE_METRICS = [
    ("hhea", "ascent"), ("hhea", "descent"), ("hhea", "lineGap"),
    ("OS/2", "sTypoAscender"), ("OS/2", "sTypoDescender"), ("OS/2", "sTypoLineGap"),
    ("OS/2", "usWinAscent"), ("OS/2", "usWinDescent"), ("OS/2", "fsSelection"),
    ("OS/2", "sxHeight"), ("OS/2", "sCapHeight"), ("OS/2", "usWeightClass"),
    ("OS/2", "yStrikeoutPosition"), ("OS/2", "yStrikeoutSize"),
    ("post", "underlinePosition"), ("post", "underlineThickness"), ("post", "italicAngle"),
    ("head", "unitsPerEm"),
]
BYTE_TABLES = ["fpgm", "prep", "cvt ", "gasp"]
FEATURE_SETS = [{}, {"frac": True}, {"numr": True}, {"dnom": True}]
MAX_GROWTH = 1024  # bytes per file


def build(src: Path, unicodes) -> TTFont:
    opts = subset.Options()
    opts.layout_features = FEATURES
    opts.name_IDs = NAME_IDS
    opts.name_languages = ["*"]
    opts.hinting = True
    opts.notdef_outline = True
    opts.glyph_names = True  # post format 2, as the baseline files have
    opts.drop_tables += ["DSIG", "meta"]
    opts.flavor = "woff2"
    font = TTFont(src)
    sub = subset.Subsetter(options=opts)
    sub.populate(unicodes=unicodes)
    sub.subset(font)
    font.flavor = "woff2"
    return font


def baseline_bytes(ref: str, name: str) -> bytes:
    out = subprocess.run(["git", "-C", str(REPO), "show", f"{ref}:src/fonts/{name}"], capture_output=True)
    if out.returncode != 0 or not out.stdout:
        raise SystemExit(f"RESULT: FAIL — cannot read src/fonts/{name} at {ref}: {out.stderr.decode(errors='replace').strip()}")
    return out.stdout


def sfnt(font: TTFont) -> bytes:
    """The font as plain sfnt bytes (HarfBuzz does not read WOFF2)."""
    buf = io.BytesIO()
    flavor = font.flavor
    font.flavor = None
    font.save(buf)
    font.flavor = flavor
    return buf.getvalue()


def outline(font: TTFont, gname: str):
    gs = font.getGlyphSet()
    pen = DecomposingRecordingPen(gs)
    gs[gname].draw(pen)
    return pen.value


def corpus(codepoints) -> list[str]:
    """Every ordered pair of the baseline's code points, plus every string literal under src/."""
    chars = [chr(c) for c in sorted(codepoints) if c >= 0x20]
    texts = [a + b for a in chars for b in chars]
    lit = re.compile(r"\"((?:[^\"\\\n]|\\.){2,})\"|'((?:[^'\\\n]|\\.){2,})'|`([^`]{2,})`|>([^<>{}\n]{2,})<")
    for p in sorted((REPO / "src").rglob("*")):
        if p.suffix in {".ts", ".tsx", ".json"} and ".test." not in p.name:
            for m in lit.finditer(p.read_text(encoding="utf-8")):
                s = next(g for g in m.groups() if g)
                if s.strip():
                    texts.append(s)
    return texts


def shaper(font: TTFont):
    face = hb.Face(sfnt(font))
    hbfont = hb.Font(face)
    order = font.getGlyphOrder()

    def shape(text: str, feats: dict):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(hbfont, buf, feats)
        return tuple(
            (order[i.codepoint], p.x_advance, p.x_offset, p.y_offset)
            for i, p in zip(buf.glyph_infos, buf.glyph_positions)
        )

    return shape


def verify(base: TTFont, new: TTFont, extra, source: TTFont) -> list[str]:
    problems = []
    cb, cn = base.getBestCmap(), new.getBestCmap()
    want = set(cb) | set(extra)
    if set(cn) != want:
        problems.append(f"cmap: extra {sorted(hex(c) for c in set(cn) - want)}, missing {sorted(hex(c) for c in want - set(cn))}")
    for c in cb:
        if c in cn and cb[c] != cn[c]:
            problems.append(f"{hex(c)} maps to {cn[c]} (was {cb[c]})")
    # Each ADDED code point must draw the upstream font's own glyph for it: same outline, same
    # advance. Presence alone would pass a right arrow mapped to the left arrow's glyph (Codex r2).
    cs = source.getBestCmap()
    for c in extra:
        if c not in cn:
            continue
        if c not in cs:
            problems.append(f"{hex(c)} is not in the source font")
            continue
        if outline(source, cs[c]) != outline(new, cn[c]) or source["hmtx"][cs[c]][0] != new["hmtx"][cn[c]][0]:
            problems.append(f"{hex(c)} does not draw the source font's glyph for it ({cn[c]} vs source {cs[c]})")
    # The layout feature tags must be the baseline's: a feature the baseline lacks (tnum, say) is
    # never shaped below, so it must not appear at all.
    for t in ("GSUB", "GPOS"):
        fb = sorted({r.FeatureTag for r in base[t].table.FeatureList.FeatureRecord})
        fn = sorted({r.FeatureTag for r in new[t].table.FeatureList.FeatureRecord})
        if fb != fn:
            problems.append(f"{t} features {fb} -> {fn}")
    new_glyphs = set(new.getGlyphOrder())
    for g in base.getGlyphOrder():
        if g not in new_glyphs:
            problems.append(f"glyph {g} is gone")
            continue
        if base["hmtx"][g] != new["hmtx"][g]:
            problems.append(f"hmtx differs for {g}: {base['hmtx'][g]} -> {new['hmtx'][g]}")
        if outline(base, g) != outline(new, g):
            problems.append(f"outline differs for {g}")
        pb = getattr(base["glyf"][g], "program", None)
        pn = getattr(new["glyf"][g], "program", None)
        if (pb.getBytecode() if pb else b"") != (pn.getBytecode() if pn else b""):
            problems.append(f"hinting program differs for {g}")
    for tag in BYTE_TABLES:
        if (tag in base) != (tag in new) or (tag in base and base.getTableData(tag) != new.getTableData(tag)):
            problems.append(f"table {tag!r} differs")
    for tag, field in LINE_METRICS:
        if getattr(base[tag], field) != getattr(new[tag], field):
            problems.append(f"{tag}.{field} {getattr(base[tag], field)} -> {getattr(new[tag], field)}")
    key = lambda n: (n.nameID, n.platformID, n.platEncID, n.langID)  # noqa: E731
    nb = {key(n): n.toUnicode() for n in base["name"].names}
    nn = {key(n): n.toUnicode() for n in new["name"].names}
    if nb != nn:
        problems.append(f"name table differs: {sorted(set(nb) ^ set(nn))} or values")
    sb, sn = shaper(base), shaper(new)
    # A string holding an added character is SUPPOSED to shape differently (.notdef before, a glyph
    # after), and its neighbours may kern against the new glyph: those strings are counted, not
    # compared. Every other string must shape identically.
    added = {chr(c) for c in extra}
    all_texts = corpus(cb)
    texts = [t for t in all_texts if not (set(t) & added)]
    print(f"  corpus {len(all_texts)} strings; {len(all_texts) - len(texts)} hold an added character and are not compared")
    diffs = 0
    # Default features (ccmp, liga, kern, mark), then each optional GSUB feature the files keep on
    # its own: a lookup only an optional feature reaches is invisible to the default shaping
    # (red-armed 2026-11-27: a changed numr mapping passed when only default and frac were shaped).
    for feats in FEATURE_SETS:
        for t in texts:
            if sb(t, feats) != sn(t, feats):
                diffs += 1
                if diffs <= 5:
                    problems.append(f"shaping differs {feats or 'default'} for {t[:40]!r}: {sb(t, feats)[:4]} -> {sn(t, feats)[:4]}")
    if diffs > 5:
        problems.append(f"... shaping differs on {diffs} strings in all")
    print(f"  shaped {len(texts)} strings x {len(FEATURE_SETS)} feature sets; {diffs} differ")
    return problems


def sweep() -> int:
    covered = set.intersection(*(set(TTFont(FONTS / p).getBestCmap()) for p, _ in PAIRS))
    roots = [REPO / "src" / d for d in ("app", "components", "lib", "data")]
    hits, where, files = collections.Counter(), collections.defaultdict(set), 0
    for r in roots:
        for p in r.rglob("*"):
            if p.suffix not in {".ts", ".tsx", ".json"} or ".test." in p.name:
                continue
            files += 1
            for ch in p.read_text(encoding="utf-8"):
                if ord(ch) > 0x7E and ord(ch) not in covered:
                    hits[ch] += 1
                    where[ch].add(p.relative_to(REPO).as_posix())
    print(f"searched {files} files under src/app, src/components, src/lib, src/data (.ts/.tsx/.json, "
          f"tests excluded) against {len(covered)} code points mapped by all three src/fonts files")
    for ch, n in hits.most_common():
        print(f"  U+{ord(ch):04X} {unicodedata.name(ch, '?'):<38} x{n:<3} {sorted(where[ch])[:3]}")
    print(f"{len(hits)} distinct unmapped character(s)")
    return 0


def main() -> int:
    if "--sweep" in sys.argv:
        return sweep()
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--source-dir")
    ap.add_argument("--out-dir")
    ap.add_argument("--control", action="store_true")
    ap.add_argument("--baseline-ref", default=BASELINE_REF)
    a = ap.parse_args()
    if not a.source_dir:
        ap.error("--source-dir is required: the added glyphs are checked against the source font's own")
    if not a.check and not a.out_dir:
        ap.error("a build needs --out-dir (or pass --check)")
    if a.check and a.control:
        ap.error("--check verifies src/fonts with the extras; --control is a build mode")
    src_dir = Path(a.source_dir)
    if a.check:
        # --check certifies the COMMITTED files: refuse a working tree that differs from HEAD.
        git = lambda *args: subprocess.run(["git", "-C", str(REPO), *args], capture_output=True, text=True)  # noqa: E731
        dirty = git("status", "--porcelain", "--", "src/fonts").stdout.strip()
        if dirty:
            print(f"RESULT: FAIL — src/fonts differs from HEAD ({dirty!r}); --check certifies committed files only")
            return 2
        print(f"checking src/fonts as committed at HEAD {git('rev-parse', 'HEAD').stdout.strip()}")
    else:
        out_dir = Path(a.out_dir)
        if out_dir.resolve() == FONTS.resolve():
            print("RESULT: FAIL — --out-dir is src/fonts. Build elsewhere, then copy.")
            return 2
        out_dir.mkdir(parents=True, exist_ok=True)
    print(f"baseline: src/fonts at {a.baseline_ref}; {'checking src/fonts as it is' if a.check else 'building into ' + str(out_dir)}")
    failed = False
    for name, src_name in PAIRS:
        raw = baseline_bytes(a.baseline_ref, name)
        base = TTFont(io.BytesIO(raw))
        unicodes = set(base.getBestCmap())
        if unicodes & set(EXTRA):
            print(f"RESULT: FAIL — {name} at {a.baseline_ref} already maps {sorted(hex(c) for c in unicodes & set(EXTRA))}: "
                  "that is a rebuilt file, not the fontsource baseline, and comparing against it proves nothing")
            return 2
        if not a.control:
            unicodes |= set(EXTRA)
        if a.check:
            out = FONTS / name
        else:
            out = out_dir / name
            build(src_dir / src_name, sorted(unicodes)).save(out)
        new = TTFont(out)
        print(f"{name}:")
        problems = verify(base, new, [] if a.control else EXTRA, TTFont(src_dir / src_name))
        growth = out.stat().st_size - len(raw)
        if growth > MAX_GROWTH:
            problems.append(f"file grew {growth} bytes (budget {MAX_GROWTH})")
        label = ("control " if a.control else "") + f"cmap {len(base.getBestCmap())} -> {len(new.getBestCmap())}"
        print(f"  {label}; {len(raw)} -> {out.stat().st_size} bytes; {'OK' if not problems else 'PROBLEMS'}")
        for p in problems[:12]:
            print(f"  - {p}")
        if len(problems) > 12:
            print(f"  - ... and {len(problems) - 12} more")
        failed = failed or bool(problems)
    print("RESULT:", "FAIL" if failed else "PASS")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
