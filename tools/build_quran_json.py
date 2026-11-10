#!/usr/bin/env python3
"""Turn raw_extract.json (from pj_quran_extract.py) into quran/surah/N.json in the ISNAD schema.

Usage: python3 -I build_quran_json.py raw_extract.json REPO_DIR
"""
import json, os, sys

BISMILLAH = "அளவற்ற அருளாளனும், நிகரற்ற அன்புடையோனுமாகிய அல்லாஹ்வின் பெயரால்..."

def main(raw_path, repo):
    raw = json.load(open(raw_path, encoding="utf8"))["surahs"]
    index = json.load(open(os.path.join(repo, "quran", "index.json"), encoding="utf8"))
    names = {s["surah"]: s["name"] for s in index["surahs"]}
    counts = {s["surah"]: s["ayahs"] for s in index["surahs"]}
    out_dir = os.path.join(repo, "quran", "surah")
    os.makedirs(out_dir, exist_ok=True)
    for n in range(1, 115):
        src = raw[str(n)]["verses"]
        verses = []
        if n == 1:
            # PJ leaves the bismillah of Al-Fatiha unnumbered and numbers 1-5, "6, 7".
            # ISNAD (and the standard Hafs count) numbers it as verse 1, so shift by one.
            verses.append({"ayah": 1, "tamil": BISMILLAH})
            for v in src:
                a = v["ayah"] + 1
                end = min(v["ayah_end"] + 1, 7)
                verses.append({"ayah": a, "tamil": v["text"]} if a == end else {"ayah": a, "ayah_end": end, "tamil": v["text"]})
            # PJ's last block "6, 7" is the standard verse 7 alone
            last = verses[-1]
            if last["ayah"] == 7: last.pop("ayah_end", None)
        else:
            for v in src:
                e = {"ayah": v["ayah"]}
                if v["ayah_end"] > v["ayah"]: e["ayah_end"] = v["ayah_end"]
                e["tamil"] = v["text"]
                verses.append(e)
        last_ayah = verses[-1].get("ayah_end", verses[-1]["ayah"])
        assert last_ayah == counts[n], (n, last_ayah, counts[n])
        doc = {"surah": n, "name": names[n], "source": "TNTJ", "verses": verses}
        with open(os.path.join(out_dir, f"{n}.json"), "w", encoding="utf8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2); f.write("\n")
    print("wrote 114 surah files")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
