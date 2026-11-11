#!/usr/bin/env python3
"""
Turn the three pre-extracted dua/article JSON files into dua/*.json.

Usage: python3 -I import_dua_json.py REPO_DIR THOGUPU.json IRAIVNIDAM.json DUA2.json

  thogupu-adab / thogupu-nabimozhi / thogupu-quran   FRTJ "Duakkalin Thogupu" (Arabic, Tamil, French)
  duas-authentic        "Dua-2": 75 sections of authentic prophetic and Quranic duas (Tamil, with references)
  iraivnidam-kaiyenthungal   an article on supplication, in 18 sections (not a list of duas)
"""
import json, os, re, sys

REF_ALL = re.compile(r"ஆதாரம்\s*:[^\n]*")


def save(repo, cid, doc):
    os.makedirs(os.path.join(repo, "dua"), exist_ok=True)
    with open(os.path.join(repo, "dua", cid + ".json"), "w", encoding="utf8") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2); f.write("\n")
    return {"id": cid, "title": doc["title"], "kind": doc["kind"], "count": len(doc["items"]), "path": f"dua/{cid}.json"}


def thogupu(repo, d):
    base = {"source": "FRTJ - Duakkalin Thogupu (Arabic / French / Tamil)"}
    out = [save(repo, "thogupu-adab", {**base, "id": "thogupu-adab", "title": "பிரார்த்தனை செய்யும் ஒழுக்கங்கள்", "kind": "etiquette",
        "introduction": d["introduction_on_dua"].strip(),
        "items": [{"number": e["number"], "tamil": e["text"].strip()} for e in d["etiquettes_of_dua"]],
        "accepted_times": [{"number": e["number"], "tamil": e["text"].strip()} for e in d["times_dua_is_accepted"]]})]
    items = []
    for x in d["prophetic_duas"]:
        lines = [l.strip() for l in x["lines"] if l.strip() and l.strip() != "துஆக்களின் தொகுப்பு"]   # drop the running page header
        text = "\n".join(lines)
        items.append({"number": x["dua_number"], "title": x["title_tamil"].strip(), "title_french": x["title_french"].strip(),
                      "arabic": x["arabic"].strip(), "text": text, "references": REF_ALL.findall(text), "page": x["pdf_page"]})
    out.append(save(repo, "thogupu-nabimozhi", {**base, "id": "thogupu-nabimozhi", "title": "நபிமொழி துஆக்கள்", "kind": "dua", "items": items}))
    items = []
    for x in d["quranic_duas"]:
        m = re.sub(r"^துஆக்களின் தொகுப்பு\s*", "", x["meaning_tamil"]).strip()      # running header leaked into the first entry
        items.append({"number": x["index"], "reference": x["quran_reference"].strip(), "arabic": x["arabic"].strip(),
                      "transliteration_latin": x["transliteration_latin"].strip(), "tamil": m, "french": x["meaning_french"].strip()})
    out.append(save(repo, "thogupu-quran", {**base, "id": "thogupu-quran", "title": "திருக்குர்ஆன் துஆக்கள்", "kind": "dua", "items": items}))
    return out


def dua2(repo, d):
    items = [{"number": s["section_number"], "title": s["title"].strip(), "tamil": s["text"].strip(), "references": s["references"],
              "page": s["start_page"]} for s in d["sections"]]
    return [save(repo, "duas-authentic", {"id": "duas-authentic", "title": "ஆதாரப்பூர்வமான நபிமொழி மற்றும் திருக்குர்ஆன் துஆக்கள்", "kind": "dua",
        "source": "Dua-2: Compilation of authentic prophetic and Quranic duas (Tamil)", "introduction": d["introduction"].strip(),
        "note": "Each entry is Tamil transliteration plus Tamil meaning; the Arabic script is not in the source.", "items": items})]


def iraivnidam(repo, d):
    items = [{"number": s["section_number"], "title": s["title"].strip(), "tamil": s["text"].strip(),
              "quran_references": s["quran_references"], "hadith_references": s["hadith_references"], "page": s["start_page"]} for s in d["sections"]]
    return [save(repo, "iraivnidam-kaiyenthungal", {"id": "iraivnidam-kaiyenthungal", "title": "இறைவனிடம் கையேந்துங்கள்!", "kind": "article",
        "source": "Iraivnidam Kaiyenthungal (Supplicate to Allah alone)", "introduction": d["introduction"].strip(), "items": items})]


if __name__ == "__main__":
    repo, a, b, c = sys.argv[1:5]
    L = lambda p: json.load(open(p, encoding="utf8"))
    idx = thogupu(repo, L(a)) + dua2(repo, L(c)) + iraivnidam(repo, L(b))
    with open(os.path.join(repo, "dua", "index.json"), "w", encoding="utf8") as f:
        json.dump({"collections": idx}, f, ensure_ascii=False, indent=2); f.write("\n")
    for i in idx: print(i["id"], i["count"])
