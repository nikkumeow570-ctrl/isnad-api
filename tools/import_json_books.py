#!/usr/bin/env python3
"""
Turn the three pre-extracted JSON books into hadith/<book>/N.json + index.json.

Usage: python3 -I import_json_books.py REPO_DIR RIYAD.json ABUDAWUD.json SHAMAIL.json

  riyadussalihin  Riyad as-Salihin, Part 1 only (hadith 1-56 and 60; 57-59 are missing in the source PDF)
  abudawud        Sunan Abu Dawud, a partial Tamil selection (368 hadith out of 390 numbers)
  shamail         Shama'il at-Tirmidhi (NOT Jami' at-Tirmidhi). Its Tamil text is machine-translated from
                  English and is often unreadable, so the English text is kept next to it.
"""
import collections, json, os, re, sys


def dump(repo, book_id, n, doc):
    d = os.path.join(repo, "hadith", book_id); os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, f"{n}.json"), "w", encoding="utf8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2); f.write("\n")


def finish(repo, book_id, book, docs, chapters, extra):
    d = os.path.join(repo, "hadith", book_id)
    os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        if f.endswith(".json"): os.remove(os.path.join(d, f))
    by_ch = collections.defaultdict(list)
    for n, doc in sorted(docs.items()):
        dump(repo, book_id, n, doc); by_ch[doc["chapter"]].append(n)
    index = {"book": book, **extra, "total_hadiths": max(docs), "available": len(docs), "chapters": []}
    for ch, title in chapters.items():
        ns = by_ch.get(ch)
        if ns: index["chapters"].append({"chapter": ch, "title": title, "start": min(ns), "end": max(ns), "count": len(ns)})
    with open(os.path.join(d, "index.json"), "w", encoding="utf8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2); f.write("\n")
    print(book_id, "written:", len(docs), "max:", max(docs), "absent in 1..max:", [n for n in range(1, max(docs) + 1) if n not in docs])


def riyad(repo, src):
    docs, chapters = {}, {}
    for ch in src["chapters"]:
        chapters[ch["chapter_number"]] = ch["chapter_title"]
        for s in ch["hadith_sections"]:
            nums = s["hadith_numbers"]
            for n in nums:
                doc = {"number": n, "book": "ரியாளுஸ் ஸாலிஹீன்", "chapter": ch["chapter_number"], "chapter_title": ch["chapter_title"]}
                if s.get("title"): doc["title"] = s["title"]
                doc["narrator"] = ""
                doc["tamil"] = s["hadith_text"].strip()
                if len(nums) > 1: doc["shared_with"] = [x for x in nums if x != n]
                if s.get("explanation"): doc["explanation"] = s["explanation"].strip()
                if s.get("narrator_biography"): doc["narrator_biography"] = s["narrator_biography"].strip()
                doc["page"] = s["pdf_page"]
                docs[n] = doc
    finish(repo, "riyadussalihin", "ரியாளுஸ் ஸாலிஹீன்", docs, chapters,
           {"source": "Tamil translation by K.J. Masthan Ali Baqavi (Part 1 only)", "partial": True,
            "note": "Only Part 1 (hadith 1-56 and 60). Hadith 57-59 are missing in the source PDF."})


def abudawud(repo, src):
    docs, chapters, seen = {}, {}, set()
    for ch in src["chapters"]:
        chapters[ch["chapter_number"]] = ch["chapter_title"]
        for h in ch["hadiths"]:
            n = h["hadith_number"]; fixed = False
            if n in seen and n == 210 and ch["chapter_number"] == 86: n, fixed = 220, True   # printed twice; sits between 219 and 221
            seen.add(n)
            doc = {"number": n, "book": "அபூதாவூது", "chapter": ch["chapter_number"], "chapter_title": ch["chapter_title"],
                   "narrator": h.get("narrator", "") or "", "tamil": h["text"].strip()}
            if h.get("notes"): doc["notes"] = h["notes"]
            if fixed: doc["number_note"] = "Printed as 210 in the source; renumbered 220 because it sits between 219 and 221."
            doc["page"] = h["pdf_page"]
            docs[n] = doc
    finish(repo, "abudawud", "அபூதாவூது", docs, chapters,
           {"source": "Tamil translation by Shamsulluha Rahmani", "partial": True,
            "note": "A partial translation. Numbers 151, 268 and 277-296 are missing in the source; chapters 109-112 are omitted."})


def shamail(repo, src):
    docs, chapters, seen = {}, {}, set()
    for ch in src["chapters"]:
        for h in ch["hadiths"]:
            nums = h["hadith_numbers"]
            fixed = False
            if tuple(nums) == (313,) and (313,) in seen: nums, fixed = [331], True   # misprinted '(313)' between 330 and 332
            if tuple(nums) in seen: continue               # chapter 29 is printed twice in the source
            seen.add(tuple(nums)); chapters.setdefault(ch["chapter_number"], ch["chapter_title_ta"]); 
            for n in nums:
                doc = {"number": n, "book": "ஷமாயிலுத் திர்மிதி", "chapter": ch["chapter_number"],
                       "chapter_title": ch["chapter_title_ta"], "chapter_title_en": ch["chapter_title_en"],
                       "narrator": h.get("narrator_ta", ""), "narrator_en": h.get("narrator_en", ""),
                       "tamil": h["hadith_text_ta"].strip(), "english": h["hadith_text_en"].strip(),
                       "commentary_tamil": h.get("commentary_ta", "").strip(), "commentary_english": h.get("commentary_en", "").strip(),
                       "tamil_is_machine_translated": True}
                if len(nums) > 1: doc["shared_with"] = [x for x in nums if x != n]
                if fixed: doc["number_note"] = "Printed as 313 in the source; renumbered 331 because it sits between 330 and 332."
                doc["page"] = h["pdf_page"]
                docs[n] = doc
    finish(repo, "shamail", "ஷமாயிலுத் திர்மிதி", docs, chapters,
           {"source": "Shama'il at-Tirmidhi with Shaykh Zakariyya's commentary (Tamil and English)", "partial": True,
            "note": "This is the Shama'il, not Jami' at-Tirmidhi. The Tamil text was machine-translated from the English and is often unreadable; use the english field as the reference. Numbers 36-43 and 126 are missing in the source."})


if __name__ == "__main__":
    repo, r, a, s = sys.argv[1:5]
    L = lambda p: json.load(open(p, encoding="utf8"))
    riyad(repo, L(r)); abudawud(repo, L(a)); shamail(repo, L(s))
