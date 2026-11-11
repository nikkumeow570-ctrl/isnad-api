#!/usr/bin/env python3
"""
Extract the Tamil Sahih Muslim PDF (Unicode "Latha" text layer) into hadith/muslim/N.json + index.json.

Usage:  python3 -I muslim_extract.py MUSLIM.pdf REPO_DIR
Needs:  pdfplumber

Quirks of this PDF (all verified):
  * text is Unicode, but the vowel signs  ெ ே ை  are stored in visual order (before the consonant)
    -> they are moved behind their consonant and ெ+ா / ே+ா are recomposed to ொ / ோ
  * pdfplumber's own extract_text() sorts by x and scrambles ீ / ூ, so characters are read in stream order
  * a hadith starts with its number glued to the first line ("1442ஆயிஷா (ரலி) ...")
  * every page has a running header "அத்தியாயம் : 07 - <title>" and a footer "பக்கம் | N"
"""
import collections, json, os, re, sys
import pdfplumber

TOTAL_PAGES_START = 6
MAC_QUOTES = str.maketrans({"Ô": "\u2018", "Õ": "\u2019", "Ò": "\u201c", "Ó": "\u201d", "Ð": "\u2013"})
VOWEL_PRE = re.compile("([ெேை])([க-ஹ])")
CH_HEAD = re.compile(r"^\s*அத்தியாயம்\s*:\s*(\d{1,3})\s*[‐-―\-–—‐]*\s*(.*?)\s*$")
HADITH = re.compile(r"^\s*(\d{1,4})\s*(?=[஀-௿(\"'“‘])(.*)$")
BAB = re.compile(r"^\s*பாடம்\s*:\s*(\d{1,3})\s*(.*)$")


def fix_tamil(t):
    t = t.replace("\xa0", " ").translate(MAC_QUOTES)          # Mac-Roman leftovers: Ô Õ Ò Ó Ð are the curly quotes / dash
    t = VOWEL_PRE.sub(r"\2\1", t)
    t = t.replace("ொ", "ொ").replace("ோ", "ோ").replace("ெள", "ௌ")
    return t


def page_lines(page):
    lines, cur, px = [], [], None
    for c in page.chars:                                  # stream order
        if cur and (c["x0"] < px - 8 or abs(c["top"] - cur[-1]["top"]) > 9):
            lines.append(cur); cur = []
        cur.append(c); px = c["x0"]
    if cur: lines.append(cur)
    out = []
    for l in lines:
        t = fix_tamil("".join(c["text"] for c in l))
        if t.strip(): out.append((round(l[0]["top"]), t.strip()))
    return out


def _work(args):
    path, a, b = args
    with pdfplumber.open(path) as pdf:
        return {pn: page_lines(pdf.pages[pn - 1]) for pn in range(a, b)}


def read_pdf(path, procs=2):
    from multiprocessing import Pool
    with pdfplumber.open(path) as pdf: n = len(pdf.pages)
    jobs = [(path, a, min(a + 40, n + 1)) for a in range(TOTAL_PAGES_START, n + 1, 40)]
    out = {}
    with Pool(procs) as pool:
        for part in pool.imap_unordered(_work, jobs):
            out.update(part); print("pages done:", len(out), "/", n - TOTAL_PAGES_START + 1, flush=True)
    return out


def _diff_digits(a, b):
    a, b = str(a), str(b)
    return len(a) == len(b) and sum(x != y for x, y in zip(a, b)) <= 2


def parse(pages):
    """Chapter 1 (the introduction) is numbered on its own from 1; chapters 2.. share one running number."""
    body = []
    for pn in sorted(pages):
        for top, s in pages[pn]:
            if top < 60:
                m = CH_HEAD.match(s)
                if m: body.append(("chapter", pn, int(m.group(1)), re.sub(r"\s+", " ", m.group(2)).strip()))
                continue
            if top > 715 or re.match(r"^பக்கம்\s*\|", s): continue
            m = HADITH.match(s)
            if m and not BAB.match(s) and not re.match(r"ஆவ", m.group(2)):
                body.append(("num", pn, int(m.group(1)), m.group(2).strip()))
            else:
                body.append(("line", pn, 0, s))
    nums = [i for i, b in enumerate(body) if b[0] == "num"]
    nxt = {i: (body[nums[k + 1]][2] if k + 1 < len(nums) else None) for k, i in enumerate(nums)}

    intro, main = collections.OrderedDict(), collections.OrderedDict()
    chapters, notes = collections.OrderedDict(), collections.Counter()
    st = dict(cur=None, expect=1, chapter=None, section=None, in_head=False)
    for i, (kind, pn, n, s) in enumerate(body):
        if kind == "chapter":
            if n != st["chapter"]:
                st.update(chapter=n, cur=None, section=None, in_head=False)
                if n == 2: st["expect"] = 1
                chapters.setdefault(n, s.replace("Ð", "-"))
            continue
        if kind == "line":
            m = BAB.match(s)
            if m: st.update(section=[s], in_head=True, cur=None)
            elif st["in_head"] and st["section"] is not None: st["section"].append(s)
            elif st["cur"] is not None: st["cur"]["text"].append(s)
            continue
        e = st["expect"]; use = None
        if n == e: use = n
        elif e < n <= e + 15 and nxt[i] in (n + 1, n + 2): use = n; notes["numbers absent from this edition"] += n - e
        elif _diff_digits(n, e) and nxt[i] in (e + 1, n + 1, None): use = e; notes["misprinted number corrected"] += 1
        if use is None:
            notes["number-like line kept as text"] += 1
            if st["in_head"] and st["section"] is not None: st["section"].append("%d %s" % (n, s))
            elif st["cur"] is not None: st["cur"]["text"].append("%d %s" % (n, s))
            continue
        d = {"number": use, "chapter": st["chapter"], "section": " ".join(st["section"] or []), "text": [s], "page": pn}
        (intro if st["chapter"] == 1 else main)[use] = d
        st.update(cur=d, expect=use + 1, in_head=False)
    return intro, main, chapters, notes


NARR = re.compile(r"^(?P<name>.{2,120}?)\s+(?:அவர்கள்\s+)?(?:கூறியதாவது|கூறினார்கள்|கூறினார்|அறிவித்தார்கள்|அறிவித்தார்|அறிவிக்கிறார்கள்|அறிவிக்கிறார்)\s*[:.]?\s*$")


def narrator_of(first):
    m = NARR.match(first.strip())
    if not m: return ""
    name = re.sub(r"\s+அவர்கள்$", "", m.group("name")).strip()
    return name if re.search(r"\((ரலி|ரஹ்|ரஹி)[^)]*\)", name) else ""


def clean(t):
    t = re.sub(r"[ \t]+", " ", t)
    return re.sub(r" *\n *", "\n", t).strip()


def _dump(out_dir, n, d, book):
    lines = [x for x in d["text"] if x]
    doc = {"number": n, "book": "முஸ்லிம்", "chapter": d["chapter"]}
    if book == "intro": doc["part"] = "introduction"
    if d["section"]: doc["section"] = clean(d["section"])
    doc["narrator"] = narrator_of(lines[0]) if lines else ""
    doc["tamil"] = clean("\n".join(lines))
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, f"{n}.json"), "w", encoding="utf8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2); f.write("\n")


def write(intro, main, chapters, repo):
    base = os.path.join(repo, "hadith", "muslim")
    for d in (base, os.path.join(base, "intro")):
        if os.path.isdir(d):
            for f in os.listdir(d):
                if f.endswith(".json"): os.remove(os.path.join(d, f))
    by_ch = collections.defaultdict(list)
    for n, d in main.items(): _dump(base, n, d, "main"); by_ch[d["chapter"]].append(n)
    for n, d in intro.items(): _dump(os.path.join(base, "intro"), n, d, "intro")
    index = {"book": "முஸ்லிம்", "total_hadiths": max(main), "available": len(main),
             "introduction": {"title": chapters.get(1, ""), "count": len(intro), "start": min(intro), "end": max(intro), "path": "hadith/muslim/intro/{number}.json"},
             "chapters": []}
    for ch, title in chapters.items():
        ns = sorted(by_ch.get(ch, []))
        if ns: index["chapters"].append({"chapter": ch, "title": title, "start": ns[0], "end": ns[-1], "count": len(ns)})
    with open(os.path.join(base, "index.json"), "w", encoding="utf8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2); f.write("\n")
    return index


def main(pdf, repo, cache=None):
    if cache and os.path.exists(cache):
        import pickle; pages = pickle.load(open(cache, "rb"))
        pages = {pn: [(t, x.translate(MAC_QUOTES)) for t, x in ls] for pn, ls in pages.items()}
    else:
        pages = read_pdf(pdf)
    intro, main_, chapters, notes = parse(pages)
    index = write(intro, main_, chapters, repo)
    missing = [n for n in range(1, max(main_) + 1) if n not in main_]
    print("main hadith:", len(main_), "max number:", max(main_), "| intro hadith:", len(intro), "| chapters:", len(index["chapters"]))
    print("notes:", dict(notes))
    print("absent (%d):" % len(missing), missing[:100])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
