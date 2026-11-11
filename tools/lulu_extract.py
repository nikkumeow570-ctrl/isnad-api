#!/usr/bin/env python3
"""
Extract Al-Lu'lu' wal-Marjan (Tamil, islamkalvi.com PDF, 808 pages) into hadith/lulu/N.json + index.json.

Usage: python3 -I lulu_extract.py LULU.pdf REPO_DIR
The text layer is Unicode (Latha) but with the old vowel order, and 'r' stands in for 'ரி' (for example 'புஹாr').
Hadith start with "N-", "N." or "N -" at the left margin in 11pt; topic headings are 14pt "N.title";
the reference line gives the narrator and the Bukhari / Muslim numbers.
"""
import collections, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pdfplumber
from muslim_extract import fix_tamil

FIRST_BODY_PAGE = 34   # earlier pages are the table of contents and the foreword (its numbered list is not hadith)
MARK = re.compile(r"^\s*(\d{1,4})(?:\s*[-–.]\s*|\s+)(.*)$")
TOPIC = re.compile(r"^\s*(\d{1,3})\s*\.\s*(.*)$")
REF = re.compile(r"(புஹாரி|புகாரி|முஸ்லிம்|அறிவிப்பவர்|நூல்)")
REFNUM = re.compile(r"(புஹாரி|புகாரி|முஸ்லிம்)\s*[-:]?\s*(\d+)")


SPECIAL = [("களிpருந்து", "களிலிருந்து"), ("உரிpமை", "உரிமை"), ("சிpறிதளவு", "சிறிதளவு"), ("புரிpந்து", "புரிந்து"), ("முத்தஸ்sர்", "முத்தஸ்ஸிர்"),
           ("நம்பிக்iயாளனாக", "நம்பிக்கையாளனாக"), ("கூறனிhர்", "கூறினார்"), ("அசரிரியாக", "அசரீரியாக")]


def latin_fix(t):
    """stray Latin letters stand for glyphs without a Unicode value: l = லி (after a pulli) or லீ, s = ஸீ"""
    for a, b in SPECIAL: t = t.replace(a, b)
    t = re.sub("(?<=\u0bcd)l", "லி", t)
    t = re.sub("(?<=[\u0b80-\u0bff])l(?=[\u0b80-\u0bff\\s.,:)])", "லீ", t)
    return re.sub("(?<=[\u0b80-\u0bff])s(?=[\u0b80-\u0bff])", "ஸீ", t)


def page_lines(pg):
    L, cur, px = [], [], None
    for c in pg.chars:
        if cur and (c["x0"] < px - 8 or abs(c["top"] - cur[-1]["top"]) > 9): L.append(cur); cur = []
        cur.append(c); px = c["x0"]
    if cur: L.append(cur)
    out = []
    for l in L:
        t = fix_tamil("".join(c["text"] for c in l))
        t = re.sub(r"(?<=[஀-௿])r", "ரி", t).strip()
        if t:
            f = collections.Counter(c["fontname"].split("+")[-1] for c in l).most_common(1)[0][0]
            out.append((round(l[0]["top"]), round(l[0]["x0"]), round(max(c["size"] for c in l), 1), f, t))
    return out


def _work(a):
    path, lo, hi = a
    with pdfplumber.open(path) as pdf: return {pn: page_lines(pdf.pages[pn - 1]) for pn in range(lo, hi)}


def read_pdf(path, procs=2):
    from multiprocessing import Pool
    with pdfplumber.open(path) as pdf: n = len(pdf.pages)
    out = {}
    with Pool(procs) as p:
        for r in p.imap_unordered(_work, [(path, a, min(a + 50, n + 1)) for a in range(FIRST_BODY_PAGE, n + 1, 50)]): out.update(r)
    return out


def is_ref(size, font, x, text):
    """a reference/narrator line: mentions a source book plus a number, or 'அறிவிப்பவர்', and is not 11pt body text"""
    if size >= 11 and font == "Latha" and x <= 54 and not text.startswith("("): return False
    return bool(REFNUM.search(text) or text.lstrip("( ").startswith(("அறிவிப்பவர்", "அறிவிப்பாளர்")))


def parse(pages):
    items = []                                           # flat stream of typed lines
    for pn in sorted(pages):
        for top, x, size, font, text in pages[pn]:
            if top > 760 or text.startswith("www.islam"): continue
            if size >= 14 and font != "TimesNewRomanPSMT":
                items.append(("topic", pn, text)); continue
            if is_ref(size, font, x, text): items.append(("ref", pn, text)); continue
            m = MARK.match(text)
            if m and x <= 60 and size in (10.0, 11.0, 11.5) and font.startswith("Latha") and "Bold" not in font:
                items.append(("mark", pn, (int(m.group(1)), m.group(2)))); continue
            items.append(("bold" if "Bold" in font else "line", pn, text))
    marks = [i for i, it in enumerate(items) if it[0] == "mark"]
    nxt = {i: (items[marks[k + 1]][2][0] if k + 1 < len(marks) else None) for k, i in enumerate(marks)}
    docs, notes = collections.OrderedDict(), collections.Counter()
    topic = dict(number=None, title="", gist=[]); cur = None; expect = 1; topic_open = False
    for i, (kind, pn, v) in enumerate(items):
        if kind == "topic":
            m = TOPIC.match(v)
            if m:
                topic = dict(number=int(m.group(1)), title=m.group(2).strip(), gist=[]); topic_open = True
            elif topic_open: topic["title"] = (topic["title"] + " " + v).strip()
            cur = None if m else cur
            continue
        if kind == "bold":
            topic_open = False
            if cur is None or not cur["text"]: topic["gist"].append(v)
            else: cur["text"].append(v)
            continue
        topic_open = False
        if kind == "mark":
            n, rest = v; use = None
            if n == expect: use = n
            elif expect < n <= expect + 30 and nxt[i] in (n + 1, n + 2): use = n; notes["numbers absent from this edition"] += n - expect
            elif len(str(n)) == len(str(expect)) and sum(a != b for a, b in zip(str(n), str(expect))) <= 2 and nxt[i] in (expect + 1, n + 1, None):
                use = expect; notes["misprinted number corrected"] += 1
            if use is not None:
                cur = {"number": use, "topic": topic["number"], "topic_title": topic["title"], "gist": " ".join(topic["gist"]), "text": [rest.strip()], "ref": [], "page": pn}
                docs[use] = cur; expect = use + 1; continue
            notes["number-like line kept as text"] += 1
            v = "%d %s" % (n, rest)
        if cur is None: continue
        if kind == "ref": cur["ref"].append(v)
        else: cur["text"].append(v) if isinstance(v, str) else None
    return docs, notes


NAME = re.compile(r"அறிவிப்பவர்\s*:?\s*(.*?)\s*(?:,|\s)\s*நூல்")


def refs(lines):
    t = " ".join(lines); out = {"narrator": "", "bukhari": None, "muslim": None}
    for book, num in REFNUM.findall(t):
        key = "muslim" if book == "முஸ்லிம்" else "bukhari"
        if out[key] is None: out[key] = int(num)
    m = NAME.search(t)
    if m: out["narrator"] = m.group(1).strip(" :,")
    else:
        m = re.search(r"(?:புஹாரி|புகாரி)\s*[-:]?\s*\d+\s*:?\s*([^()]*?\([^)]*\)[^,]*)", t)
        if m: out["narrator"] = m.group(1).strip(" :,.")
    return out


def main(pdf, repo, cache=None):
    if cache and os.path.exists(cache):
        import pickle; pages = pickle.load(open(cache, "rb"))
        pages = {pn: [(a, b, c, d, latin_fix(e)) for a, b, c, d, e in ls] for pn, ls in pages.items() if pn >= FIRST_BODY_PAGE}
    else:
        pages = read_pdf(pdf)
    docs, notes = parse(pages)
    out = os.path.join(repo, "hadith", "lulu"); os.makedirs(out, exist_ok=True)
    for f in os.listdir(out):
        if f.endswith(".json"): os.remove(os.path.join(out, f))
    by_topic = collections.OrderedDict()
    for n, d in docs.items():
        r = refs(d["ref"])
        doc = {"number": n, "book": "அல்லுஃலுவு வல்மர்ஜான்", "topic": d["topic"], "topic_title": d["topic_title"]}
        if d["gist"]: doc["topic_summary"] = d["gist"]
        doc.update(narrator=r["narrator"], tamil=re.sub(r"\s+", " ", " ".join(d["text"])).strip(), reference=" ".join(d["ref"]).strip(),
                   bukhari_number=r["bukhari"], muslim_number=r["muslim"], grade="muttafaqun_alayhi", page=d["page"])
        json.dump(doc, open(os.path.join(out, f"{n}.json"), "w", encoding="utf8"), ensure_ascii=False, indent=2)
        by_topic.setdefault(d["topic"], []).append(n)
    index = {"book": "அல்லுஃலுவு வல்மர்ஜான்", "title_arabic": "اللؤلؤ والمرجان فيما اتفق عليه الشيخان", "source": "IslamKalvi.com (Tamil translation)",
             "total_hadiths": max(docs), "available": len(docs), "grade_default": "muttafaqun_alayhi",
             "note": "Hadith agreed upon by both Bukhari and Muslim. Some entries cite only one of the two numbers in the printed reference.",
             "chapters": [{"chapter": t, "title": next(d["topic_title"] for k, d in docs.items() if d["topic"] == t), "start": min(ns), "end": max(ns), "count": len(ns)} for t, ns in by_topic.items() if t]}
    json.dump(index, open(os.path.join(out, "index.json"), "w", encoding="utf8"), ensure_ascii=False, indent=2)
    missing = [n for n in range(1, max(docs) + 1) if n not in docs]
    print("hadith:", len(docs), "max:", max(docs), "| topics:", len(index["chapters"]), "| notes:", dict(notes))
    print("with narrator:", sum(1 for n in docs if json.load(open(os.path.join(out, f"{n}.json"), encoding="utf8"))["narrator"]))
    print("absent (%d):" % len(missing), missing[:60])


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
