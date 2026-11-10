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

Add more data by dropping files into `quran/surah/N.json` and `hadith/bukhari/N.json`; the API picks them up automatically.
Currently included: surah 1 and hadith 1 (sample data).

## Deploy
Any Node host works (Render, Railway, Fly.io). Build: none. Start command: `npm start`. The `PORT` env var is respected.

## Tools
`tools/kavippriya_converter.py` converts legacy KavipPriya/STMZH-encoded text to Tamil Unicode.
