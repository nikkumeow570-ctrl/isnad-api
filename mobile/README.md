# ISNAD

Static PWA (works in any browser) and an Android APK (Capacitor) with native prayer reminders and Adhan.

## Files
- `index.html`, `app.js`, `prayer.js` - the app (prayer times are calculated offline)
- `fonts/` - Amiri Arabic font (SIL OFL)
- `adhan/` - Adhan recordings (rights unverified, see `adhan/SOURCE.txt`; replace with ones you may distribute)
- `sw.js`, `manifest.json`, `icons/` - PWA install + offline
- `capacitor.config.json`, `package.json`, `android-*` - APK build; the workflow is `.github/workflows/release-apk.yml` at the repo root

## Screens
Three tabs: Today (prayer times), Services (prayer guide, Quran, Hadith, Duas, Qibla, Courses, prayer log, Jumma, Eid, Janazah, Aqeedah) and Settings. The Quran (Arabic + Tamil, optional English), six hadith books and the courses are packed in `data/` and work offline. To rebuild `data/` from the isnad-api repo: `python3 tools/pack_data.py /path/to/isnad-api`. Screens are in `content.js` (new) and `app.js`; the prayer engine, alarms, widget and build are unchanged.

## Full-screen Adhan alarm (v31)
At each prayer time the app starts an exact alarm that plays the Adhan and opens a full-screen screen over the lock screen (prayer name, time, "Hurry to the prayer", Stop button), like a normal alarm app. Code: `android-athan/` (Java, copied into the Android project by the build workflow). Settings > Adhan has a switch, a 10-second test button and shortcuts to the Android permissions (full-screen notifications on Android 14+, "Alarms & reminders"). If this part fails to compile, the workflow builds without it and the app falls back to normal Adhan notifications. The Adhan plays at notification volume, so silent mode mutes it. Play Store: full-screen notifications are meant for alarm and calling apps; declare the use in Play Console.

## Android APK (built on GitHub, no Android Studio needed)
1. GitHub > Actions > "Release APK" > Run workflow (enter a version, e.g. 1.0.0).
2. When it finishes, open the repo's Releases page and download `ISNAD-<version>-debug.apk` (or the signed APK/AAB if the keystore secrets exist).
3. Install on the phone (allow "install unknown apps").
4. Open the app > Settings > allow notifications and "Alarms & reminders".
5. Phone settings > Apps > ISNAD > Battery > Unrestricted.

Reminders and the Adhan are scheduled as Android alarms for the next 7 days each time the app is opened or settings change. Open the app about once a week.

## Prayer calculation
Asar when the shadow equals the object. Default method: Fajr 18°, Isha 18°, Dhuhr = solar noon + 1 minute, Maghrib at sunset. The default method is named TNTJ / JAQH in Settings; other methods (MWL, Karachi, ISNA, Egypt, Umm al-Qura, Dubai, Qatar, Kuwait, Singapore, Turkey) and Asr Shafi'i/Hanafi are chosen in Settings. Per-prayer minute adjustments are also there. Sun position uses the Jean Meeus astronomical algorithms (the same method as the open-source Adhan libraries) and times are rounded to the nearest minute; this matches the TNTJ Tarjuma app's table for Coimbatore. Elevation is not used.

## Adhan
Every `adhan/*.mp3` is bundled. `adhan.mp3` and `adhan-fajr.mp3` are the defaults; `voices.json` lists the choices. Use recordings you are allowed to distribute.


## Privacy
No network calls: all data is bundled in the app and read locally. Location stays on the device; the town name is the nearest listed city. See privacy-policy.html.

## Language, text size, location
- EN / த button in the header switches the whole app between Tamil and English (strings in i18n.js).
- Aa button cycles three text sizes (normal, large, extra large).
- There is no built-in location: the first screen asks for GPS or a city.
- Adhan: choose a voice or your own file in Settings > Adhan.
