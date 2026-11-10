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
| `GET /api/hadith/bukhari` | Bukhari chapter index |
| `GET /api/hadith/bukhari/:number` | A single hadith |
| `GET /api/search?q=text` | Search Tamil text (max 50 results) |

### Data
- **Quran:** all 114 surahs (6,236 ayahs), Tamil translation by P. Jainul Abideen (TNTJ), extracted from `TamilQuran-PJ.pdf`.
  The translator sometimes translates several ayahs as one passage. Those entries carry `ayah` and `ayah_end`
  (e.g. 114:1-4), and `GET /api/quran/114/3` returns that block with `requested_ayah: 3`.
  Al-Fatiha uses the standard numbering (bismillah = ayah 1, 7 ayahs).
- **Hadith (Bukhari):** only hadith 1 so far (sample). Add files as `hadith/bukhari/N.json`; the API picks them up automatically.

## Deploy
Any Node host works (Render, Railway, Fly.io). Build: none. Start command: `npm start`. The `PORT` env var is respected.

## Tools
- `tools/pj_quran_extract.py` + `tools/build_quran_json.py` rebuild the Quran JSON from the PDF
  (`python3 -I tools/pj_quran_extract.py TamilQuran-PJ.pdf out && python3 -I tools/build_quran_json.py out/raw_extract.json .`; needs `pdfplumber`).
  The PDF uses the legacy KavipPriya font; the character table in the script was read from that PDF's own embedded glyphs.
- `tools/kavippriya_converter.py` is the original generic converter (its table is incomplete; not used for the Quran data).

## Licence note
The translation text belongs to its publisher (TNTJ). Check their terms before publishing it in a public app or API.
