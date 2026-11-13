# ISNAD

Static PWA (works in any browser) and an Android APK (Capacitor) with native prayer reminders and Adhan.

## Files
- `index.html`, `app.js`, `prayer.js` - the app (prayer times are calculated offline)
- `fonts/` - Amiri Arabic font (SIL OFL)
- `adhan/` - put your Adhan recording here (see `adhan/README.txt`)
- `sw.js`, `manifest.json`, `icons/` - PWA install + offline
- `capacitor.config.json`, `package.json`, `.github/workflows/build-apk.yml` - APK build

## v30 screens
Three tabs: Today (prayer times), Services (prayer guide, Quran, Hadith, Duas, Qibla, Courses, prayer log, Jumma, Eid, Janazah, Aqeedah) and Settings. The Quran (Arabic + Tamil, optional English), six hadith books and the courses are packed in `data/` and work offline. To rebuild `data/` from the isnad-api repo: `python3 tools/pack_data.py /path/to/isnad-api`. Screens are in `content.js` (new) and `app.js`; the prayer engine, alarms, widget and build are unchanged.

## Full-screen Adhan alarm (v31)
At each prayer time the app starts an exact alarm that plays the Adhan and opens a full-screen screen over the lock screen (prayer name, time, "Hurry to the prayer", Stop button), like a normal alarm app. Code: `android-athan/` (Java, copied into the Android project by the build workflow). Settings > Adhan has a switch, a 10-second test button and shortcuts to the Android permissions (full-screen notifications on Android 14+, "Alarms & reminders"). If this part fails to compile, the workflow builds without it and the app falls back to normal Adhan notifications. The Adhan plays at notification volume, so silent mode mutes it. Play Store: full-screen notifications are meant for alarm and calling apps; declare the use in Play Console.

## Web (PWA)

## Android APK (built on GitHub, no Android Studio needed)
1. Create a GitHub repo and push this folder to the `main` branch.
2. GitHub > Actions > "Build APK" > run it (it also runs on every push).
3. When it finishes, open the run and download the `thowheed-namaz-apk` artifact (zip containing `app-debug.apk`).
4. Unzip, install the APK on the phone (allow "install unknown apps").
5. Open the app > Times tab > "Enable reminders", allow notifications and "Alarms & reminders".
6. Phone settings > Apps > ISNAD > Battery > Unrestricted.

Reminders and the Adhan are scheduled as Android alarms for the next 7 days each time the app is opened or settings change. Open the app about once a week.

## Prayer calculation
Asar when the shadow equals the object. Default method: Fajr 18°, Isha 18°, Dhuhr = solar noon + 1 minute, Maghrib at sunset. Other methods (MWL, Karachi, ISNA, Egypt) can be chosen on the Times tab. Per-prayer fixed mosque times / minute adjustments are also on the Times tab. Sun position uses the Jean Meeus astronomical algorithms (the same method as the open-source Adhan libraries) and times are rounded to the nearest minute; this matches the TNTJ Tarjuma app's table for Coimbatore. Elevation is not used.

## Adhan
Add `adhan/adhan.mp3` (and optionally `adhan/adhan-fajr.mp3`). Without a file the app plays a soft chime. Use a recording you are allowed to distribute.


## Privacy
No network calls. Location stays on the device; the town name is the nearest listed city. See privacy-policy.html.

## Language, text size, location
- EN / த button in the header switches the whole app between Tamil and English (strings in i18n.js).
- Aa button cycles three text sizes (normal, large, extra large).
- There is no built-in location: the first screen asks for GPS or a city.
- Adhan: put adhan/adhan.mp3 (and optionally adhan/adhan-fajr.mp3) in the repo, or pick your own files in Settings > Adhan (plays while the app is open).
