#!/usr/bin/env python3
"""
Extract the Tamil Sahih al-Bukhari (7-volume PDF, legacy "Sarukesi" Bamini-layout font) into
hadith/bukhari/N.json + hadith/bukhari/index.json.

Usage:  python3 -I bukhari_extract.py BUKHARI.pdf REPO_DIR
Needs:  pdfplumber  (and bamini_decode.py next to this file)

What the script has to cope with (all verified against this PDF):
  * Tamil is stored in the legacy font -> bamini_decode.decode()
  * hadith numbers are set in a separate Helvetica run, sometimes on a row 1-3pt off the text row
  * most hadith start with "ஹதீஸ் N." but consecutive ones in a section are just "N."
  * a few numbers are misprinted (e.g. 114 for 1114, 5393 for 5293), repeated, or printed as ranges
  * some numbers do not exist in this edition at all (the API answers 404 for them)
"""
import collections, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pdfplumber
import bamini_decode as D

TAMIL_FONTS = ("T_Sarukesi", "SarukesiRegular")
PLAIN_FONTS = ("Arial", "TimesNewRoman", "CourierNew", "Cauvery", "ArialBold,Bold", "CourierNewBold,Bold")
TOTAL = 7563
FIRST_BODY_PAGE = 10


# ------------------------------------------------------------------ PDF -> decoded lines
DIGITS_ONLY = re.compile(r"^\s*\d[\d\s,.\-–]*\s*$")


def page_lines(page):
    """Yield (top, size, text) for each visual line of a page, in reading order."""
    rows = collections.OrderedDict()
    for c in page.chars:                                   # stream order keeps pulli marks next to their letter
        rows.setdefault(round(c["top"] / 2), []).append(c)
    merged, numrows = [], []
    for key in sorted(rows):
        cs = rows[key]; top = round(key * 2); x = cs[0]["x0"]
        if all(c["fontname"].split("+")[-1] == "Helvetica" for c in cs) and DIGITS_ONLY.match("".join(c["text"] for c in cs)):
            numrows.append((top, "".join(c["text"] for c in cs).strip())); continue      # a hadith number on its own row
        if merged and top - merged[-1][0] <= 3 and x > merged[-1][1]:                    # row split by a small font offset
            merged[-1][2] += cs
        else:
            merged.append([top, x, list(cs)])
    lines = []
    for top, x, cs in merged:
        segs = []
        for c in cs:
            f = c["fontname"].split("+")[-1]
            if segs and segs[-1][0] == f: segs[-1][1] += c["text"]
            else: segs.append([f, c["text"], c["size"]])
        parts = []
        for f, t, s in segs:
            if f in TAMIL_FONTS: parts.append(D.decode(t)[0])
            elif f in PLAIN_FONTS: parts.append(t)
            elif f == "Helvetica" and t.strip() and re.fullmatch(r"[\d\s,.\-–]+", t): parts.append(t)   # hadith numbers
            elif not t.strip(): parts.append(" ")
        text = "".join(parts)
        size = max((s for f, t, s in segs if f in TAMIL_FONTS), default=0)
        if text.strip(): lines.append([top, round(size, 1), text])
    for top, num in numrows:                               # put the number back into "ஹதீஸ் . ..." (or ". ...")
        cand = [l for l in lines if abs(l[0] - top) <= 4 and (re.match(r"\s*ஹதீஸ்(?!\s*\d)", l[2]) or re.match(r"\s*[.,]", l[2]))]
        if not cand: continue
        l = min(cand, key=lambda l: abs(l[0] - top))
        if re.match(r"\s*ஹதீஸ்", l[2]):
            rest = l[2].split("ஹதீஸ்", 1)[1].lstrip()
            l[2] = "ஹதீஸ் " + num + (rest if rest.startswith(".") else ". " + rest)
        else:
            l[2] = num + l[2].lstrip()
    for l in lines: yield tuple(l)


def _work(args):
    path, a, b = args
    with pdfplumber.open(path) as pdf:
        return {pn: list(page_lines(pdf.pages[pn - 1])) for pn in range(a, b)}


def read_pdf(path, last=None, procs=2):
    from multiprocessing import Pool
    with pdfplumber.open(path) as pdf:
        n = len(pdf.pages) if last is None else last
    jobs = [(path, a, min(a + 40, n + 1)) for a in range(FIRST_BODY_PAGE, n + 1, 40)]
    out = {}
    with Pool(procs) as pool:
        for part in pool.imap_unordered(_work, jobs):
            out.update(part); print("pages done:", len(out), "/", n - FIRST_BODY_PAGE + 1, flush=True)
    return out


# ------------------------------------------------------------------ lines -> hadith
CH = re.compile(r"^\s*அத்தியாயம்[\s;:\-்]*(\d{1,2})[\s;:\-்.]*(.*)$")
STRONG = re.compile(r"^\s*(?:ஹதீஸ்\s*)+(\d{1,4})((?:(?:\s*(?:[,\-–ு]|ஹதீஸ்))+\s*\d{1,4})*)\s*(?:-\s*\(([அ-ஹ])\))?\s*[.,]?\s*(.*)$")
WEAK = re.compile(r"^\s*(\d{1,4})\s*[.]\s*(.*)$")
DONE = re.compile(r"முற்றிற்று|முற்றியது")


def parse(pages):
    def body():
        for pn in sorted(pages):
            for top, size, t in pages[pn]:
                s = t.strip()
                if not s or (size == 12.0 and top < 60) or size == 10.1: continue
                yield pn, top, size, s
    strong_nums = [int(STRONG.match(s).group(1)) for pn, top, size, s in body() if size == 13.0 and STRONG.match(s)]

    hadiths, chapters, notes = collections.OrderedDict(), [], collections.Counter()
    st = dict(cur=None, expect=1, sidx=-1, skipping=False, chapter=None, head=None)
    section = []

    def new(nums, rest, pn):
        d = {"numbers": nums, "text": [rest] if rest else [], "page": pn, "chapter": st["chapter"], "section": " ".join(section).strip()}
        for n in nums: hadiths[n] = d
        st["cur"], st["expect"] = d, max(nums) + 1

    for pn, top, size, s in body():
        if size in (25.9, 30.2, 24.0, 67.4) and not CH.match(s): continue
        if size == 13.0 and s.startswith("அளவற்ற அருளாளன்") and "பெயரால்" in s: continue
        if size >= 18 and DONE.search(s): st["cur"] = None; continue
        m = CH.match(s) if size >= 18.0 else None
        if m:
            st.update(cur=None, skipping=False, chapter=int(m.group(1)), head=("chapter", pn, top))
            chapters.append({"chapter": st["chapter"], "title": re.sub(r"[;\s]+$", "", m.group(2)).strip(" -:;"), "page": pn})
            section.clear(); continue
        if size >= 18.0:                                                      # wrapped chapter title
            h = st["head"]
            if h and h[0] == "chapter" and h[1] == pn and top - h[2] <= 40:
                chapters[-1]["title"] = (chapters[-1]["title"] + " " + re.sub(r"[;\s]+$", "", s)).strip()
                st["head"] = ("chapter", pn, top)
            continue
        if size >= 13.9:                                                      # section (bab) heading
            if st["cur"] is not None or st["head"] is None or st["head"][0] != "sec":
                st["cur"], st["skipping"] = None, False; section.clear()
            section.append(s); st["head"] = ("sec", pn, top); continue

        expect = st["expect"]; mk = None; m = STRONG.match(s)
        if m:
            st["sidx"] += 1
            mk = ([int(m.group(1))] + [int(x) for x in re.findall(r"\d+", m.group(2))], m.group(4), m.group(3), True)
        else:
            w = WEAK.match(s)
            if w and int(w.group(1)) == expect and not re.match(r"^\d", w.group(2)):
                mk = ([int(w.group(1))], w.group(2), None, False)
        if not mk:
            if not st["skipping"] and st["cur"] is not None: st["cur"]["text"].append(s)
            continue
        nums, rest, label, strong = mk
        n0 = nums[0]; st["skipping"] = False
        nxt = strong_nums[st["sidx"] + 1] if strong and st["sidx"] + 1 < len(strong_nums) else None
        if strong and n0 != expect:
            prev = hadiths.get(n0)
            if label or n0 == expect - 1:
                if prev is not None and " ".join(prev["text"])[:25] == rest[:25]:
                    notes["duplicate page repeat skipped"] += 1; st["skipping"] = True; continue
                if not label and nxt == expect + 1 and prev is not None and prev["text"]:
                    notes["misprinted number corrected"] += 1; nums = [expect]
                elif prev is not None:                                        # a 2nd narration filed under the same number
                    notes["extra narration merged"] += 1
                    st["cur"] = prev; prev["text"].append("\n" + ("(%s) " % label if label else "") + rest); continue
            elif n0 > expect and nxt is not None and n0 < nxt <= n0 + 3:
                notes["numbers absent from this edition"] += 1
            elif (nxt is not None and nxt == expect + 1) or (n0 < expect and str(expect).endswith(str(n0))):
                notes["misprinted number corrected"] += 1; nums = [expect]
            elif n0 > expect and (nxt is None or nxt > n0):
                notes["numbers absent from this edition"] += 1
            else:
                notes["unplaced marker kept as text"] += 1
                if st["cur"] is not None: st["cur"]["text"].append(s)
                continue
        if len(nums) > 1 and nums == sorted(nums) and nums[-1] - nums[0] < 6: nums = list(range(nums[0], nums[-1] + 1))
        elif len(nums) > 1: nums = nums[:1]
        new(nums, rest, pn); st["head"] = None
    return hadiths, chapters, notes


# ------------------------------------------------------------------ output
VERB = r"(?:கூறினார்(?:கள்)?|அறிவித்தார்(?:கள்)?|அறிவிக்கிறார்(?:கள்)?|கூறியதாவது|குறிப்பிட்டார்(?:கள்)?|தெரிவித்தார்(?:கள்)?|கூறுகிறார்)"
NARR = re.compile(r"^\s*(?P<name>[^.:;!?]{2,80}?)\s+(?:அவர்கள்\s+)?" + VERB + r"\s*[.:]")


def narrator_of(text):
    """Best effort: the leading 'X (ரலி) அறிவித்தார்.' sentence. Many hadith name the narrator elsewhere; those get ''."""
    m = NARR.match(text)
    if not m: return ""
    name = re.sub(r"\s+அவர்கள்$", "", m.group("name")).strip()
    if not re.search(r"\((ரலி|ரஹ்|ரஹி)[^)]*\)", name): return ""
    if re.match(r"^(நபி|இறைத்தூதர்)\s*\(ஸல்\)", name): return ""
    return name


def clean(text):
    text = re.sub(r"[ \t]+", " ", text)
    return re.sub(r" *\n *", "\n", text).strip()


def write(hadiths, chapters, repo):
    out_dir = os.path.join(repo, "hadith", "bukhari")
    os.makedirs(out_dir, exist_ok=True)
    for f in os.listdir(out_dir): os.remove(os.path.join(out_dir, f)) if f.endswith(".json") else None
    for n, d in hadiths.items():
        text = clean(" ".join(d["text"]))
        doc = {"number": n, "book": "புகாரி", "chapter": d["chapter"]}
        if d["section"]: doc["section"] = clean(d["section"])
        doc["narrator"] = narrator_of(text)
        doc["tamil"] = text
        if len(d["numbers"]) > 1: doc["shared_with"] = d["numbers"]       # one passage printed under several numbers
        with open(os.path.join(out_dir, f"{n}.json"), "w", encoding="utf8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2); f.write("\n")
    by_ch = collections.defaultdict(list)
    for n, d in hadiths.items(): by_ch[d["chapter"]].append(n)
    titles = collections.OrderedDict()
    for c in chapters: titles.setdefault(c["chapter"], c["title"])      # "(தொடர்ச்சி)" repeats keep the first title
    index = {"book": "புகாரி", "total_hadiths": TOTAL, "available": len(hadiths), "chapters": []}
    for ch, title in titles.items():
        ns = sorted(by_ch.get(ch, []))
        if ns: index["chapters"].append({"chapter": ch, "title": title, "start": ns[0], "end": ns[-1], "count": len(ns)})
    with open(os.path.join(out_dir, "index.json"), "w", encoding="utf8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2); f.write("\n")
    return index


def main(pdf, repo, last=None):
    pages = read_pdf(pdf, last)
    hadiths, chapters, notes = parse(pages)
    index = write(hadiths, chapters, repo)
    missing = [n for n in range(1, TOTAL + 1) if n not in hadiths]
    print("hadith numbers written:", len(hadiths), "of", TOTAL, "| chapters:", len(index["chapters"]))
    print("notes:", dict(notes))
    print("absent numbers (%d):" % len(missing), missing)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else None)
