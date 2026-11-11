# ISNAD API

Read-only JSON API for Tamil Quran (TNTJ) and Hadith (Bukhari), served from the JSON files in this repo.
No dependencies; Node 18+.

## Run
```
npm start          # http://localhost:3000
npm test
```

## Endpoints
| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /api/quran` | Surah index |
| `GET /api/quran/:surah` | One surah with all verses |
| `GET /api/quran/:surah/:ayah` | A single verse |
| `GET /api/dua`, `/api/dua/:collection`, `/api/dua/:collection/:number` | Duas and supplication articles |
| `GET /api/hadith` | List of available hadith books |
| `GET /api/hadith/:book` | Chapter index (`bukhari`, `muslim`) |
| `GET /api/hadith/:book/:number` | A single hadith |
| `GET /api/hadith/muslim/intro/:number` | Muslim's introduction (numbered separately, 1-95) |
| `GET /api/search?q=text` | Search Tamil text (max 50 results) |

### Data
- **Quran:** all 114 surahs (6,236 ayahs), Tamil translation by P. Jainul Abideen (TNTJ), extracted from `TamilQuran-PJ.pdf`.
  The translator sometimes translates several ayahs as one passage. Those entries carry `ayah` and `ayah_end`
  (e.g. 114:1-4), and `GET /api/quran/114/3` returns that block with `requested_ayah: 3`.
  Al-Fatiha uses the standard numbering (bismillah = ayah 1, 7 ayahs).
- **Quran (Arabic):** all 6,236 verses in Uthmani and plain script from the open Tanzil text (CC BY 3.0, copied verbatim, so it must not be edited), in `quran/arabic/`. `/api/quran/:surah/:ayah` now returns `arabic` and `arabic_simple` next to the Tamil.
- **Quran (English):** Pickthall (1930) and Yusuf Ali (1934), both public domain, in `quran/english/`. `/api/quran/:surah/:ayah` returns them as `english.pickthall` and `english.yusufali`.
- **Hadith (Bukhari):** 7,493 of the 7,563 numbered hadith (97 chapters), extracted from the 7-volume Tamil Sahih al-Bukhari PDF with `tools/bukhari_extract.py`. About 70 numbers (e.g. 441, 2315, 3327) are not present in that edition and return 404; a few passages printed under several numbers carry `shared_with`. The `narrator` field is best-effort and is empty when the narrator is not named in the opening sentence.
- **Hadith (Muslim):** 5,759 of the numbers 1-5771 (54 chapters) plus the 95-hadith introduction, extracted from the Tamil Sahih Muslim PDF with `tools/muslim_extract.py`. Numbers 1324-1325 and 3545-3554 do not exist in that edition and return 404. `narrator` is best-effort.
- **Hadith (Abu Dawud, partial):** 368 hadith of numbers 1-390. A partial Tamil translation; 151, 220-fix, 268 and 277-296 are missing in the source (the second "210" in the source is stored as 220).
- **Hadith (Riyad as-Salihin, Part 1 only):** 57 hadith (1-56 and 60) with explanations. Hadith printed together carry `shared_with`.
- **Hadith (Shama'il at-Tirmidhi):** 388 hadith. This is the Shama'il, not Jami' at-Tirmidhi. Its Tamil is machine-translated from English and often unreadable, so each record also has `english`, `commentary_english` and `tamil_is_machine_translated: true`.
- **Duas:** `/api/dua` lists 5 collections in `dua/`: the FRTJ Duakkalin Thogupu split into etiquettes (23), prophetic duas (19, with Arabic) and Quranic duas (16, Arabic, Tamil, French); 75 authentic duas with references; and the article *Iraivnidam Kaiyenthungal* (18 sections). In the 75-dua collection the source has Tamil transliteration and meaning but no Arabic script.
- **Tools:** `tools/import_dua_json.py`, `tools/import_json_books.py`, `tools/muslim_extract.py`, `tools/bamini_decode.py` (legacy Tamil font decoder), `tools/bukhari_extract.py`, `tools/pj_quran_extract.py`, `tools/build_quran_json.py`.
- **Copyright:** the translations belong to their publishers (TNTJ and the Bukhari translators). Check licensing before redistributing or deploying publicly.

## Deploy
Any Node host works (Render, Railway, Fly.io). Build: none. Start command: `npm start`. The `PORT` env var is respected.

## Tools
- `tools/pj_quran_extract.py` + `tools/build_quran_json.py` rebuild the Quran JSON from the PDF
  (`python3 -I tools/pj_quran_extract.py TamilQuran-PJ.pdf out && python3 -I tools/build_quran_json.py out/raw_extract.json .`; needs `pdfplumber`).
  The PDF uses the legacy KavipPriya font; the character table in the script was read from that PDF's own embedded glyphs.
- `tools/kavippriya_converter.py` is the original generic converter (its table is incomplete; not used for the Quran data).

## Licence note
The translation text belongs to its publisher (TNTJ). Check their terms before publishing it in a public app or API.
