#!/usr/bin/env python3
"""
Extract the Tamil Quran (PJ translation, TamilQuran-PJ.pdf) into Unicode JSON.

The PDF stores Tamil in the legacy 8-bit "KavipPriya" font. The byte -> Tamil
table below was read from the glyph outlines embedded in the PDF itself, so it is
exact for this document (it is NOT a generic KavipPriya table).

Usage:  python3 -I pj_quran_extract.py TamilQuran-PJ.pdf OUT_DIR
Needs:  pdfplumber
"""
import json, re, sys, os
from collections import Counter, defaultdict
import pdfplumber

# ---- legacy code -> Unicode (verified against the PDF's glyph shapes) -------
BASE = dict(zip("LMNOPQRSTUVWXYZ[\\]^_`a",
                ["க","ங","ச","ஞ","ட","ண","த","ந","ப","ம","ய","ர","ல","வ","ழ","ள","ற","ன","ஸ","ஜ","ஷ","ஹ"]))
PURE = dict(zip("defghijklmnopqrstuvwxy",
                ["க்","ங்","ச்","ஞ்","ட்","ண்","த்","ந்","ப்","ம்","ய்","ர்","ல்","வ்","ழ்","ள்","ற்","ன்","ஸ்","ஜ்","ஷ்","ஹ்"]))
VOWEL = dict(zip("@ABCDEFGHIJK", ["அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","ஃ"]))
CONS_ORDER = "கஙசஞடணதநபமயரலவழளறன" + "ஸஜஷஹ"  # series order used by the font
LIG = {}
def series(start_byte, sign, skip=()):
    """Consonant+vowel-sign ligature glyphs run in Tamil alphabet order from start_byte."""
    for i, c in enumerate("கஙசஞடணதநபமயரலவழளறன"):
        LIG[bytes([start_byte + i]).decode("cp1252")] = c + sign
series(0xA1, "ி")           # கி..னி   (0xAD hyphen == லி)
for b, c in zip(range(0xB3, 0xB7), "ஸஜஷஹ"): LIG[chr(b)] = c + "ி"
series(0xB8, "ீ")           # கீ..னீ
for b, c in zip(range(0xCA, 0xCE), "ஸஜஷஹ"): LIG[chr(b)] = c + "ீ"
series(0xCF, "ு")           # கு..னு
series(0xE1, "ூ")           # கூ..னூ
LIG["-"] = "லி"; LIG["\xad"] = "லி"
PRE = {"ù": "ெ", "ú": "ே", "û": "ை"}
POST = {"ô": "ா", "ý": "ு", "þ": "ூ"}   # ý/þ = u / uu sign on grantha letters
PUNCT = {" ": " ", "!": "!", "&": "&", "(": "(", ")": ")", ",": ",", ".": ".",
         ":": ":", ";": ";", "?": "?", "#": "–", "\n": " "}
for d in "0123456789": PUNCT[d] = d
PUNCT["\x1b"] = "8"; PUNCT["\x16"] = "3"   # digits from the 2-glyph font subset used once (verse 5:83)

def convert(s):
    out, i, pend, unknown = [], 0, None, Counter()
    s = s.replace('""', "“").replace("''", "”").replace('"', "‘").replace("'", "’")
    while i < len(s):
        ch = s[i]
        if ch in PRE:
            pend = PRE[ch]; i += 1; continue
        if ch in BASE:
            c = BASE[ch]
            if pend:
                nxt = s[i+1] if i + 1 < len(s) else ""
                if pend == "ெ" and nxt == "ô":   out.append(c + "ொ"); i += 2
                elif pend == "ே" and nxt == "ô": out.append(c + "ோ"); i += 2
                elif pend == "ெ" and nxt == "[":  out.append(c + "ௌ"); i += 2
                else: out.append(c + pend); i += 1
                pend = None
            else:
                out.append(c); i += 1
            continue
        if pend:  # sign with no following consonant -> keep, flag
            out.append(pend); unknown["dangling-sign"] += 1; pend = None
        if ch in PURE: out.append(PURE[ch])
        elif ch in LIG: out.append(LIG[ch])
        elif ch in VOWEL: out.append(VOWEL[ch])
        elif ch in POST: out.append(POST[ch])
        elif ch in PUNCT or ch in "“”‘’–": out.append(PUNCT.get(ch, ch))
        else: out.append(ch); unknown[ch] += 1
        i += 1
    return "".join(out), unknown

# ---- PDF -> lines -----------------------------------------------------------
def page_lines(page):
    rows = defaultdict(list)
    for c in page.chars:
        f = c["fontname"].split("+")[-1]
        kind = "T" if f == "KavipPriya" else "H" if f == "SarukesiRegular" else None
        if kind: rows[(round(c["top"]), kind)].append(c)
    for (top, kind), cs in sorted(rows.items()):
        cs.sort(key=lambda c: c["x0"])
        yield kind, "".join(c["text"] for c in cs)

HEAD = re.compile(r"mj;jpahak;\s*-\s*(\d+)\s+(.*?)\s+(?:nkhj;j\s+)?trdk;\s*-?\s*(\d+)")
BISM = "அளவற்ற அருளாளனும்"
# verse marker: "12." / "10, 11." / "18, 19" / "67–71." - may sit mid-line (short verses share a line)
INLINE = re.compile(r"(?<![\d஀-௿])(\d+(?:\s*[,–]\s*\d+)*)\.?\s*(?=\S)")
MARKER = re.compile(r"(?<![\d஀-௿])(\d+(?:\s*[,–]\s*\d+)*)(\.\s*|,\s+(?=\D)|\s+)(?=\S|$)")
FOOT = re.compile(r"(?<=[஀-௿.!?,;’”)])\d{1,3}(?:\s*&\s*\d{1,3})*(?!\d|:\d)")

TAIL_FOOT = re.compile(r"(?<=[.!?”’)])\s+\d{1,3}(?:\s*&\s*\d{1,3})*\s*$")     # footnote number after the last full stop
SPACED_FOOT = re.compile(r"(?<=[”’)])\s\d{1,3}(?:\s*&\s*\d{1,3})*(?=\s)|\s\d{1,3}(?:\s*&\s*\d{1,3})+(?=\s)|(?<=\s)\d{1,3}(?=[஀-௿])")

def clean(t):
    t = FOOT.sub("", t)
    t = TAIL_FOOT.sub("", t)
    t = SPACED_FOOT.sub("", t)
    t = re.sub(r"(?<=\s)\d{3}(?=\s)", "", t)   # 3-digit footnote numbers set off by spaces
    t = t.replace("ூு", "ூ")          # stray u-sign typed after a uu-ligature in the source (e.g. யூஸுஃப்)
    return re.sub(r"\s+", " ", t).strip()

def main(pdf_path, out_dir):
    surahs, cur, state = {}, None, None
    unknown, issues = Counter(), []
    with pdfplumber.open(pdf_path) as pdf:
        for pno, page in enumerate(pdf.pages, 1):
            for kind, raw in page_lines(page):
                if kind == "H":
                    m = HEAD.search(raw)
                    if m:
                        n = int(m.group(1))
                        cur = surahs[n] = {"surah": n, "total": int(m.group(3)), "page": pno, "verses": [], "intro": []}
                        state, expect = "intro", 1
                    continue
                if cur is None: continue
                text, unk = convert(raw); unknown.update(unk)
                if cur["surah"] == 9 and text.startswith(". (இது), நீங்கள் உடன்படிக்கை"):
                    text = "1" + text    # the "1" is a single Arial glyph (page 140) outside the Tamil font
                if state == "intro":
                    if BISM in text:
                        cur["bismillah"] = text; state = "verses"; continue
                    m0 = MARKER.match(text)
                    if m0 and [int(x) for x in re.findall(r"\d+", m0.group(1))][0] == 1 and "." in text[:m0.end()]:
                        state = "verses"          # surah without a bismillah line
                    else:
                        cur["intro"].append(text); continue
                # split the line at every marker that carries the next expected verse number
                last_end, openv = 0, cur["verses"][-1] if cur["verses"] else None
                for m in MARKER.finditer(text):
                    grp, sep = m.group(1), m.group(2)
                    nums = [int(x) for x in re.findall(r"\d+", grp)]
                    strong = "." in sep or "," in sep or len(nums) > 1       # a bare "12 " is not a marker
                    gap = nums[0] - expect
                    if not strong or gap < 0 or gap > 2: continue
                    if gap and openv is not None:                         # PJ prints "6." for a merged 6-7 block
                        if "." not in sep: continue
                        openv["ayah_end"] = nums[0] - 1
                    pre = text[last_end:m.start()]
                    if openv is not None and pre.strip(): openv["text"] += " " + pre
                    openv = {"ayah": nums[0], "ayah_end": max(nums), "text": "", "page": pno}
                    cur["verses"].append(openv)
                    expect = max(nums) + 1; last_end = m.end()
                tail = text[last_end:]
                if openv is not None: openv["text"] += " " + tail
                else: cur["intro"].append(tail)
    for n, s in surahs.items():
        for v in s["verses"]: v["text"] = clean(v["text"])
        merged = []                       # "57, 58, 59 60, 61." (typo in the PDF) leaves an empty block: fold it into the next one
        carry = None
        for v in s["verses"]:
            if not v["text"]:
                carry = v["ayah"] if carry is None else carry; continue
            if carry is not None: v["ayah"], carry = carry, None
            merged.append(v)
        s["verses"] = merged
    os.makedirs(out_dir, exist_ok=True)
    json.dump({"surahs": surahs, "unknown": dict(unknown), "issues": issues},
              open(os.path.join(out_dir, "raw_extract.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
    print("surahs:", len(surahs), "unknown chars:", dict(unknown), "issues:", len(issues))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
