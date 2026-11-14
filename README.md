<p align="center"><img src="branding/youtube-banner-16x9.jpg" alt="ISNAD Studios" width="720"></p>

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
- **Hadith (Al-Lu'lu' wal-Marjan):** 1,821 of the 1,906 numbers, extracted from the 808-page IslamKalvi PDF with `tools/lulu_extract.py`. Every hadith in this book is agreed upon by Bukhari and Muslim, so each has `grade: muttafaqun_alayhi`. Each has its topic, narrator, the printed reference and, where printed, `bukhari_number` and `muslim_number` (many entries cite only one of the two). About 85 numbers (such as 60-62 and 236-242) are not in this edition and return 404.
- **Articles:** `/api/articles/hadith-classification` is P. Jainul Abideen's *Sariyana Hadith Thavarana Hadith* (sahih, da'if, mawdu' and other terms). It explains grading but is not a list of graded hadith. Bukhari and Muslim indexes carry `grade_default: sahih`.
- **Articles (prayer):** `/api/articles/tholugai-sattam` is the onlinepj.com *Tholugaiyin Sattangal* (rules of the prayer, 122 pages) in 247 sections. It came as a PDF with 49 unmapped Tamil glyphs, decoded in `tools/tholugai_extract.py`. Headings are detected from the page layout, so a few may be wrong.
- **Learning books (articles):** `orirai-kolgai` (P. Jainul Abideen, 100 sections and 781 Quran verses on tawheed), `quran-reading-easily` (28 lessons on reading the Quran, plus a table of common mistakes), `sarf-tamil` (Arabic morphology), `quran-ilakkanam` (Arabic grammar from the Quran, 19 lessons) and `tajweed-rules` (26 slides). `sarf-tamil` and `quran-ilakkanam` now also carry the Tamil re-read from the original PDFs (`text_pdf` per lesson and `pages`), decoded with `tools/sarukesi_pdf_extract.py`; Tamil there is reliable, Arabic in tables may still have small errors. In `tajweed-rules` each slide has an `image` (served at `/api/articles/images/tajweed-rules/NN.png`); use the image, the text is only a rough guide.
- **Articles (Tafseer):** `/api/articles/tafseer` is a 30-page Tafseer course introduction with word meanings, decoded by `tools/tafseer_extract.py`. Tables may be out of order; it has a `quality_note`.
- **Tools:** `tools/import_learning_json.py`, `tools/tholugai_extract.py`, `tools/import_misc_json.py`, `tools/import_dua_json.py`, `tools/import_json_books.py`, `tools/muslim_extract.py`, `tools/bamini_decode.py` (legacy Tamil font decoder), `tools/bukhari_extract.py`, `tools/pj_quran_extract.py`, `tools/build_quran_json.py`.
- **Copyright:** the translations belong to their publishers (TNTJ and the Bukhari translators). Check licensing before redistributing or deploying publicly.

## Android app (APK)
The Android app is in `mobile/` (prayer times, full-screen Adhan alarm, Quran, Hadith, Duas, Courses; Tamil and English; offline; no ads or tracking). Its Quran, hadith and course data is packed from this repo's own JSON when it is built, so the app always matches the API.
To get the APK: GitHub > Actions > **Release APK** > Run workflow (set a version such as 1.0.0). When it finishes, open **Releases** on the repo page and download `ISNAD-...apk`. Add the secrets `KEYSTORE_B64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` for a signed release (see `mobile/PRODUCTION.md`); without them you get a debug APK that installs fine on a phone.

## Prayer times and Qibla
`GET /api/prayer?lat=13.08&lng=80.27&tz=5.5&date=2026-11-12&asr=shafi&method=mwl` returns the five prayers with start and end times, midnight and the Qibla bearing. `asr=hanafi` uses the 2x shadow. The windows follow the Tholugai guide: Fajr to sunrise, Dhuhr until the shadow equals the object (Asr start), Asr to sunset, Maghrib until the red twilight ends (Isha start), Isha until the middle of the night. The Fajr and Isha angles are chosen by `method` (or `fajr=` and `isha=` in degrees); the default `tntj` method (Fajr 18°, Isha 18°, Dhuhr +1 minute, Asr shadow ×1) matches the times shown in a TNTJ/JAQH prayer app for Coimbatore. The same code, `prayer/prayertimes.js`, runs offline in a browser or app with no server.

## The app (PWA)
Open `/app/` in a phone browser and choose "Add to Home screen". Screens: Today (prayer times, countdown, Hijri date), Services (Quran Arabic + Tamil + optional English, Qibla, Hadith, Duas, Courses) and Settings (language Tamil/English, location, Asr Shafi'i or Hanafi, Fajr/Isha method, Hijri date adjustment). Prayer times and Qibla are calculated on the phone and work offline; Quran, hadith and course pages are cached after you open them. There are no ads, accounts or tracking. The default method is TNTJ / JAQH (Fajr 18°, Isha 18°, Dhuhr +1 minute, Asr ×1), which reproduces the times in a TNTJ/JAQH prayer app for Coimbatore. Athan sound and alerts need the Android wrapper (next step), because a web page cannot ring at exact times in the background.

## Live stream page (Arabic + Tamil)
`/live` is a full-screen page for YouTube live (OBS "Browser Source", 1920x1080). It shows each ayah in Arabic with the Tamil translation (and English with `en=1`), advances automatically and loops. Examples: `/live?surah=18&sec=15&en=1`, `/live?surah=0` (all 114 surahs), `/live?surah=1&transparent=1` (transparent background for overlays). Options: `surah`, `from`, `to`, `sec` (minimum seconds per ayah), `en`, `loop`, `transparent`, `api` (API host if the page is hosted elsewhere). It does not play audio; add the recitation audio in OBS.

## Deploy
Any Node host works (Render, Railway, Fly.io). Build: none. Start command: `npm start`. The `PORT` env var is respected.

## Tools
- `tools/pj_quran_extract.py` + `tools/build_quran_json.py` rebuild the Quran JSON from the PDF
  (`python3 -I tools/pj_quran_extract.py TamilQuran-PJ.pdf out && python3 -I tools/build_quran_json.py out/raw_extract.json .`; needs `pdfplumber`).
  The PDF uses the legacy KavipPriya font; the character table in the script was read from that PDF's own embedded glyphs.
- `tools/kavippriya_converter.py` is the original generic converter (its table is incomplete; not used for the Quran data).

## Licence note
The translation text belongs to its publisher (TNTJ). Check their terms before publishing it in a public app or API.
