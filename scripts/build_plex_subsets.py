"""Rebuild the three self-hosted Plex subsets in src/fonts with the characters they lacked added.

Why (I-092): the fontsource latin subsets carry U+2191/U+2193 but not U+2190/U+2192, so every
flag-on arrow ("Details ->", "<- drag to zoom ->") was drawn in a fallback system face. The same
held for five more characters the site renders; EXTRA lists them all.

Source: the Google Fonts TTFs that fontsource builds from (google/fonts, ofl/ibmplexsanscondensed
and ofl/ibmplexserif). Version 1.3 (Sans Condensed SemiBold) and 2.6 (Serif Regular, SemiBold),
the same versions as the pinned files. Licence: SIL OFL 1.1, which permits subsetting.

Recipe: keep exactly the code points the pinned file maps (read from that file, so this script
never re-derives fontsource's range), add EXTRA, and mirror the pinned file's options: the same
seven layout features, name IDs 0-6 and 14, hinting kept, WOFF2.

Modes:
  --control  subset with the pinned code points only (no extras) and run the same verify. It
             should pass with no extra code points, which shows the recipe reproduces what the
             pinned file renders. It is NOT byte-identical (measured 2026-11-27): fontsource's
             build keeps the full font's hhea/maxp extents and its code-page bits, while this one
             recomputes them from the subset. Neither affects layout: line metrics, outlines,
             advances, kerning and names are what verify compares.
  (default)  write the new files to --out-dir, then verify: the cmap is the pinned one plus EXTRA;
             every pinned code point keeps its advance width and outline; every kerning pair
             between pinned code points keeps its value; line metrics, layout feature tags and the
             name table are unchanged.

  --sweep    no build: list every non-ASCII character in src/app, src/components, src/lib and
             src/data (.ts/.tsx/.json, tests excluded) that the files in src/fonts do not map.
             Comments count too, so read each hit's file before adding it to EXTRA.

Usage: python -P scripts/build_plex_subsets.py --source-dir <dir with the 3 TTFs> --out-dir <dir> [--control]
       python -P scripts/build_plex_subsets.py --sweep
"""
import collections
import unicodedata
import argparse
import sys
from pathlib import Path

from fontTools import subset
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

REPO = Path(__file__).resolve().parent.parent
FONTS = REPO / "src" / "fonts"
PAIRS = [
    ("ibm-plex-sans-condensed-latin-600.woff2", "IBMPlexSansCondensed-SemiBold.ttf"),
    ("ibm-plex-serif-latin-400.woff2", "IBMPlexSerif-Regular.ttf"),
    ("ibm-plex-serif-latin-600.woff2", "IBMPlexSerif-SemiBold.ttf"),
]
# The arrows (I-092), then the siblings the same sweep found on rendered surfaces (2026-11-27,
# a static read of src/app, src/components, src/lib and src/data against the pinned cmaps) that
# upstream carries in all three faces. Not added because upstream lacks them: U+0394 and U+03C6
# (inside a font-mono code span on /methods) and U+25BE (the /cycles disclosure triangle).
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
NAME_IDS = [0, 1, 2, 3, 4, 5, 6, 14]
LINE_METRICS = [
    ("hhea", "ascent"), ("hhea", "descent"), ("hhea", "lineGap"),
    ("OS/2", "sTypoAscender"), ("OS/2", "sTypoDescender"), ("OS/2", "sTypoLineGap"),
    ("OS/2", "usWinAscent"), ("OS/2", "usWinDescent"), ("OS/2", "fsSelection"),
    ("head", "unitsPerEm"),
]


def build(src: Path, unicodes) -> TTFont:
    opts = subset.Options()
    opts.layout_features = FEATURES
    opts.name_IDs = NAME_IDS
    opts.name_languages = ["*"]
    opts.hinting = True
    opts.notdef_outline = True
    opts.glyph_names = True  # post format 2, as the pinned files have
    opts.drop_tables += ["DSIG", "meta"]
    opts.flavor = "woff2"
    font = TTFont(src)
    sub = subset.Subsetter(options=opts)
    sub.populate(unicodes=unicodes)
    sub.subset(font)
    font.flavor = "woff2"
    return font


def outline(font: TTFont, gname: str):
    gs = font.getGlyphSet()
    pen = DecomposingRecordingPen(gs)
    gs[gname].draw(pen)
    return pen.value


def kern_pairs(f: TTFont) -> dict:
    """Horizontal pair adjustments between mapped code points, keyed by (cp1, cp2)."""
    rev = {}
    for c, g in f.getBestCmap().items():
        rev.setdefault(g, c)
    out = {}
    for lk in f["GPOS"].table.LookupList.Lookup:
        for st in lk.SubTable:
            if lk.LookupType == 9:
                st = st.ExtSubTable
            if type(st).__name__ != "PairPos":
                continue
            if st.Format == 1:
                for i, g1 in enumerate(st.Coverage.glyphs):
                    for pvr in st.PairSet[i].PairValueRecord:
                        v = getattr(pvr.Value1, "XAdvance", 0) if pvr.Value1 else 0
                        if g1 in rev and pvr.SecondGlyph in rev:
                            out.setdefault((rev[g1], rev[pvr.SecondGlyph]), v)
            elif st.Format == 2:
                c1, c2 = st.ClassDef1.classDefs, st.ClassDef2.classDefs
                for g1 in st.Coverage.glyphs:
                    if g1 not in rev:
                        continue
                    for g2, cp2 in rev.items():
                        rec = st.Class1Record[c1.get(g1, 0)].Class2Record[c2.get(g2, 0)]
                        v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                        if v:
                            out.setdefault((rev[g1], cp2), v)
    return out


def verify(pinned: TTFont, new: TTFont, extra) -> list[str]:
    problems = []
    cp, cn = pinned.getBestCmap(), new.getBestCmap()
    want = set(cp) | set(extra)
    if set(cn) != want:
        problems.append(f"cmap: extra {sorted(hex(c) for c in set(cn) - want)}, missing {sorted(hex(c) for c in want - set(cn))}")
    for c, g in cp.items():
        if c not in cn:
            continue
        if pinned["hmtx"][g][0] != new["hmtx"][cn[c]][0]:
            problems.append(f"advance differs at {hex(c)}")
        if outline(pinned, g) != outline(new, cn[c]):
            problems.append(f"outline differs at {hex(c)}")
    for t in ("GSUB", "GPOS"):
        fp = sorted({r.FeatureTag for r in pinned[t].table.FeatureList.FeatureRecord})
        fn = sorted({r.FeatureTag for r in new[t].table.FeatureList.FeatureRecord})
        if fp != fn:
            problems.append(f"{t} features {fp} -> {fn}")
    np_ = {(n.nameID, n.platformID, n.langID): n.toUnicode() for n in pinned["name"].names}
    nn = {(n.nameID, n.platformID, n.langID): n.toUnicode() for n in new["name"].names}
    if np_ != nn:
        problems.append("name table differs")
    for tag, field in LINE_METRICS:
        if getattr(pinned[tag], field) != getattr(new[tag], field):
            problems.append(f"{tag}.{field} {getattr(pinned[tag], field)} -> {getattr(new[tag], field)}")
    kp, kn = kern_pairs(pinned), kern_pairs(new)
    shared = {k: v for k, v in kn.items() if k[0] in cp and k[1] in cp}
    if kp != shared:
        problems.append(f"kerning between pinned code points differs ({len(kp)} pairs pinned, {len(shared)} rebuilt)")
    if not kp:
        problems.append("kerning read returned 0 pairs; the comparison proves nothing")
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
    ap.add_argument("--source-dir", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--control", action="store_true")
    a = ap.parse_args()
    src_dir, out_dir = Path(a.source_dir), Path(a.out_dir)
    if out_dir.resolve() == FONTS.resolve():
        print("RESULT: FAIL — --out-dir is src/fonts: the verify would compare against the file it overwrites. Build elsewhere, then copy.")
        return 2
    out_dir.mkdir(parents=True, exist_ok=True)
    failed = False
    for pinned_name, src_name in PAIRS:
        pinned_path = FONTS / pinned_name
        pinned = TTFont(pinned_path)
        unicodes = sorted(pinned.getBestCmap())
        if not a.control:
            unicodes = sorted(set(unicodes) | set(EXTRA))
        new = build(src_dir / src_name, unicodes)
        out = out_dir / pinned_name
        new.save(out)
        new = TTFont(out)
        problems = verify(pinned, new, [] if a.control else EXTRA)
        label = ("control " if a.control else "") + f"cmap {len(pinned.getBestCmap())} -> {len(new.getBestCmap())}"
        size = f"{pinned_path.stat().st_size} -> {out.stat().st_size} bytes"
        print(f"{pinned_name}: {label}; {size}; {'OK' if not problems else 'PROBLEMS'}")
        for p in problems[:12]:
            print(f"  - {p}")
        if len(problems) > 12:
            print(f"  - ... and {len(problems) - 12} more")
        failed = failed or bool(problems)
    print("RESULT:", "FAIL" if failed else "PASS")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
