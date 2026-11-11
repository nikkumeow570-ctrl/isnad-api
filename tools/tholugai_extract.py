#!/usr/bin/env python3
"""
Extract "Tholugaiyin Sattangal" (the rules of the prayer, onlinepj.com PDF) into articles/tholugai-sattam.json.

Usage: python3 -I tholugai_extract.py TholugaiSattam1.pdf REPO_DIR

The Tamil is a TrueType "Latha" subset. Most glyphs have a ToUnicode entry, but 49 consonant+vowel glyphs do not
and come out as (cid:N). Their meaning was read off the embedded glyph outlines and confirmed on real words
(CID table below). Like the Muslim PDF, the vowel signs ெ ே ை sit before their consonant and are reordered.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pdfplumber
from muslim_extract import fix_tamil

CID = {117:"ங்",118:"ச்",119:"ஜ",120:"ஞ்",121:"ட்",122:"ண்",123:"த்",124:"ந்",126:"ப்",130:"ற்",133:"ழ்",134:"வ்",135:"ஷ்",137:"ஹ்",
 143:"ி",145:"ீ",146:"ீ",147:"ீ",148:"கு",149:"கூ",152:"சு",153:"சூ",156:"டி",157:"டீ",158:"டு",160:"ணு",162:"து",163:"தூ",164:"நு",165:"நூ",
 167:"னு",168:"னூ",169:"பு",170:"பூ",171:"மு",172:"மூ",173:"யு",174:"யூ",175:"ரு",176:"ரூ",178:"று",180:"லு",181:"லூ",182:"ளு",183:"ளூ",
 184:"ழு",186:"வு",187:"வூ",190:"ரி"}
REFLINE = re.compile(r"^(அறிவிப்பவர்|அறிவிப்பாளர்|நூல்|நூல்கள்|அல்குர்ஆன்)\s*[:\d]")


def txt(c):
    m = re.fullmatch(r"\(cid:(\d+)\)", c["text"])
    if m:
        if int(m.group(1)) not in CID: raise SystemExit("unmapped glyph cid:%s" % m.group(1))
        return CID[int(m.group(1))]
    return c["text"]


def page_lines(pg):
    L, cur, px = [], [], None
    for c in pg.chars:                                    # stream order
        if cur and (c["x0"] < px - 8 or abs(c["top"] - cur[-1]["top"]) > 9): L.append(cur); cur = []
        cur.append(c); px = c["x0"]
    if cur: L.append(cur)
    out = []
    for l in L:
        t = fix_tamil("".join(txt(c) for c in l)).strip()
        top = round(l[0]["top"])
        if t and top < 720: out.append((top, t))          # drop the "PDF file from www.onlinepj.com" footer
    return out


def build(pages):
    # flatten with gaps: a gap > 20pt is a paragraph break, ~15pt is the next line of the same paragraph
    flat = []
    for pn, ls in pages:
        for i, (top, t) in enumerate(ls):
            flat.append({"page": pn, "top": top, "text": t, "gap_before": 99 if i == 0 else top - ls[i - 1][0]})
    for i, x in enumerate(flat):
        x["gap_after"] = flat[i + 1]["gap_before"] if i + 1 < len(flat) and flat[i + 1]["page"] == x["page"] else 99
    sections, cur = [], None
    para = []

    def flush():
        nonlocal para
        if para and cur is not None:
            text = " ".join(para)
            cur["blocks"].append({"type": "reference" if REFLINE.match(text) else "text", "text": text})
        para = []

    for x in flat:
        t = x["text"]
        is_head = (x["gap_before"] > 20 and x["gap_after"] > 20 and len(t) < 70 and not REFLINE.match(t)
                   and not re.search(r"[.:?!'\"’”]$", t) and not t[0] in "('\"‘“")
        if is_head:
            flush(); cur = {"heading": t, "page": x["page"], "blocks": []}; sections.append(cur); continue
        if cur is None: cur = {"heading": "", "page": x["page"], "blocks": []}; sections.append(cur)
        if para and x["gap_before"] > 20: flush()
        para.append(t)
    flush()
    return sections


def main(pdf, repo):
    with pdfplumber.open(pdf) as p:
        pages = [(i + 1, page_lines(pg)) for i, pg in enumerate(p.pages)]
    sections = build(pages)
    sections = [dict(s, number=i + 1) for i, s in enumerate(sections) if s["blocks"] or s["heading"]]
    doc = {"id": "tholugai-sattam", "title": "தொழுகையின் சட்டங்கள்", "kind": "article", "source": "onlinepj.com - Tholugaiyin Sattangal (rules of the prayer)",
           "note": "Hadith references are printed as in the book (for example, 'நூல்கள்: புகாரீ 8, முஸ்லிம் 21').", "sections": sections}
    os.makedirs(os.path.join(repo, "articles"), exist_ok=True)
    json.dump(doc, open(os.path.join(repo, "articles", "tholugai-sattam.json"), "w", encoding="utf8"), ensure_ascii=False, indent=2)
    ip = os.path.join(repo, "articles", "index.json")
    idx = json.load(open(ip, encoding="utf8")) if os.path.exists(ip) else {"articles": []}
    idx["articles"] = [a for a in idx["articles"] if a["id"] != doc["id"]] + [{"id": doc["id"], "title": doc["title"], "title_english": "Rules of the Prayer (Tholugai Sattam)",
        "author": "onlinepj.com", "sections": len(sections), "path": "articles/tholugai-sattam.json"}]
    json.dump(idx, open(ip, "w", encoding="utf8"), ensure_ascii=False, indent=2)
    print("sections:", len(sections), "| blocks:", sum(len(s["blocks"]) for s in sections), "| pages:", len(pages))
    return sections


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
