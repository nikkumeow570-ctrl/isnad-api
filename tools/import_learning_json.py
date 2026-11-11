#!/usr/bin/env python3
"""
Import the five learning books (pre-extracted JSON) as articles/<id>.json.

Usage: python3 -I import_learning_json.py REPO_DIR SARF.json TAJWEED.json ORIRAI.json ODHIDA.json ILAKKANAM.json
"""
import json, os, sys


def sec(number, title, text, **extra):
    d = {"number": number, "title": title}
    d.update({k: v for k, v in extra.items() if v not in (None, "", [], {})})
    d["text"] = (text or "").strip()
    return d


def build(a):
    sarf, taj, ori, odh, ilak = a
    m = sarf["metadata"]
    out = [{"id": "sarf-tamil", "title": m["title_tamil"], "title_english": m["title_english"], "kind": "course", "language": m["language"],
            "quality_note": "The Arabic examples were extracted from the PDF with reversed or scrambled letter order, so use the Tamil explanation and check the Arabic against the PDF.",
            "introduction": sarf["introduction"].strip(),
            "sections": [sec(l["lesson_number"], l["title_tamil"], l["text"], title_arabic=l.get("title_arabic"), summary=l.get("summary_tamil"), page_start=l["start_page"], page_end=l["end_page"]) for l in sarf["lessons"]]}]
    m = taj["metadata"]
    out.append({"id": "tajweed-rules", "title": m["title_tamil"], "title_english": m["title_english"], "kind": "course", "language": m["language"], "author": m["author"].split(",")[0],
                "quality_note": "These are slides with flowcharts and tables. The text was read in scattered order and contains stray characters, so each slide is only a rough guide to the PDF.",
                "introduction": taj["preface"].strip(), "references": taj["references"],
                "sections": [sec(s["slide_number"], s["title_tamil"], s["text"], title_arabic=s.get("title_arabic")) for s in taj["slides"]]})
    m = ori["metadata"]
    out.append({"id": "orirai-kolgai", "title": m["title_tamil"], "title_english": m["title_english"], "kind": "book", "author": m["author_tamil"], "language": "Tamil",
                "source": "onlinepj.com", "introduction": ori["introduction"].strip(), "contents": ori["table_of_contents"],
                "sections": [sec(s["section_number"], s["title_tamil"], s["text"], verses=s.get("verses"), page_start=s["start_page"], page_end=s["end_page"]) for s in ori["sections"]]})
    m = odh["metadata"]
    secs = [sec(s["section_id"], s["title_tamil"], s["text"], page_range=s.get("page_range")) for s in odh["supplementary_sections"]]
    lessons = [sec(l["lesson_number"], l["title_tamil"], l["text"], arabic_letter=l.get("arabic_letter"), articulation_rules=l.get("articulation_rules"), page_start=l["start_page"], page_end=l["end_page"]) for l in odh["lessons"]]
    out.append({"id": "quran-reading-easily", "title": m["title_tamil"], "title_english": m["title_english"], "kind": "course", "author": m["compiler_tamil"], "language": m["language"],
                "introduction": odh["introduction"].strip(), "sections": lessons, "supplementary": secs, "common_mistakes_table": odh["critical_places_table"]})
    m = ilak["metadata"]
    out.append({"id": "quran-ilakkanam", "title": m["title_tamil"], "title_english": m["title_english"], "kind": "course", "author": m["author_tamil"], "language": m["language"],
                "quality_note": "Arabic words in this course were extracted with reversed letter order (for example 'ميحرلا' for 'الرحيم'). Use the Tamil text and check the Arabic against the PDF.",
                "front_matter": [sec(f["section_id"], f["title_tamil"], f["text"], page_range=f.get("page_range")) for f in ilak["front_matter"]],
                "sections": [sec(l["lesson_number"], l["title_tamil"], l["text"], grammar_topic=l.get("grammar_topic_tamil"), grammar=l.get("grammar_section"), exercises=l.get("workbook_exercises"), page_start=l["start_page"], page_end=l["end_page"]) for l in ilak["lessons"]]})
    return out


if __name__ == "__main__":
    repo = sys.argv[1]
    arts = build([json.load(open(p, encoding="utf8")) for p in sys.argv[2:7]])
    d = os.path.join(repo, "articles"); os.makedirs(d, exist_ok=True)
    ip = os.path.join(d, "index.json")
    idx = json.load(open(ip, encoding="utf8")) if os.path.exists(ip) else {"articles": []}
    for art in arts:
        json.dump(art, open(os.path.join(d, art["id"] + ".json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
        idx["articles"] = [x for x in idx["articles"] if x["id"] != art["id"]] + [{"id": art["id"], "title": art["title"], "title_english": art.get("title_english", ""),
            "kind": art["kind"], "author": art.get("author", ""), "sections": len(art["sections"]), "path": f"articles/{art['id']}.json",
            **({"quality_note": art["quality_note"]} if art.get("quality_note") else {})}]
        print(art["id"], len(art["sections"]))
    json.dump(idx, open(ip, "w", encoding="utf8"), ensure_ascii=False, indent=2)
