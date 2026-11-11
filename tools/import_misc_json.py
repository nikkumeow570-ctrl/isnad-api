#!/usr/bin/env python3
"""
Import the Al-Lu'lu' wal-Marjan sample and the Sariyana/Thavarana Hadith article.

Usage: python3 -I import_misc_json.py REPO_DIR LULU.json SARIYANA.json

  hadith/lulu/N.json     the 18 hadith present in the source JSON (the book has 1,906), with Bukhari/Muslim cross-references
  articles/hadith-classification.json   P. Jainul Abideen's article on sahih / da'if / mawdu' (a reference text, not a list of graded hadith)
"""
import json, os, sys


def lulu(repo, d):
    out = os.path.join(repo, "hadith", "lulu"); os.makedirs(out, exist_ok=True)
    for f in os.listdir(out):
        if f.endswith(".json"): os.remove(os.path.join(out, f))
    kit = {k["kitab_number"]: k for k in d["books_kitabs"]}
    docs = {}
    for h in d["representative_muttafaqun_alayhi_hadiths"]:
        k = kit.get(h["kitab_number"], {})
        docs[h["lulu_number"]] = {"number": h["lulu_number"], "book": "அல்லுஃலுவு வல்மர்ஜான்", "chapter": h["kitab_number"],
            "chapter_title": k.get("tamil", ""), "section": h["chapter_tamil"], "narrator": h["narrator_tamil"],
            "arabic": h["arabic"], "tamil": h["tamil"], "grade": "muttafaqun_alayhi", "grade_tamil": h["grade"],
            "bukhari_number": h["bukhari_number"], "muslim_number": h["muslim_number"]}
    for n, doc in docs.items():
        with open(os.path.join(out, f"{n}.json"), "w", encoding="utf8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2); f.write("\n")
    have = {}
    for doc in docs.values(): have.setdefault(doc["chapter"], []).append(doc["number"])
    m = d["metadata"]
    index = {"book": "அல்லுஃலுவு வல்மர்ஜான்", "title_arabic": m["title_arabic"], "title_english": m["title_english"],
             "source": "IslamKalvi.com; translators " + m["tamil_translators"], "partial": True,
             "note": "Only 18 of the 1,906 hadith are in this data so far. Every hadith in this book is agreed upon by both Bukhari and Muslim (muttafaqun alayhi), the highest grade of authenticity.",
             "total_hadiths": 1906, "available": len(docs),
             "kitabs": [{"kitab": k["kitab_number"], "arabic": k["arabic"], "title": k["tamil"], "hadith_range": k["hadith_range"],
                         "available": sorted(have.get(k["kitab_number"], []))} for k in d["books_kitabs"]],
             "chapters": [{"chapter": c, "title": kit[c]["tamil"], "start": min(ns), "end": max(ns), "count": len(ns)} for c, ns in sorted(have.items())]}
    with open(os.path.join(out, "index.json"), "w", encoding="utf8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2); f.write("\n")
    return len(docs)


def article(repo, d):
    out = os.path.join(repo, "articles"); os.makedirs(out, exist_ok=True)
    m = d["metadata"]
    doc = {"id": "hadith-classification", "title": m["title_tamil"], "title_arabic": m["title_arabic"], "title_english": m["title_english"],
           "author": m["author_tamil"], "kind": "article", "sections": d["sections"]}
    with open(os.path.join(out, "hadith-classification.json"), "w", encoding="utf8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2); f.write("\n")
    with open(os.path.join(out, "index.json"), "w", encoding="utf8") as f:
        json.dump({"articles": [{"id": doc["id"], "title": doc["title"], "title_english": doc["title_english"], "author": doc["author"],
                                 "sections": len(doc["sections"]), "path": "articles/hadith-classification.json"}]}, f, ensure_ascii=False, indent=2); f.write("\n")


if __name__ == "__main__":
    repo, a, b = sys.argv[1:4]
    L = lambda p: json.load(open(p, encoding="utf8"))
    article(repo, L(b))      # the full Lu'lu' now comes from tools/lulu_extract.py; lulu() above is only the 18-hadith sample import
    for book in ("bukhari", "muslim"):                    # both are Sahih collections
        p = os.path.join(repo, "hadith", book, "index.json"); idx = json.load(open(p, encoding="utf8"))
        idx["grade_default"] = "sahih"
        json.dump(idx, open(p, "w", encoding="utf8"), ensure_ascii=False, indent=2)
