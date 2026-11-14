# Production / Play Store checklist

## A. Done in code
- Release signing + versioning in the GitHub workflow (Release APK) (signed AAB + APK when the secrets exist; debug APK otherwise)
- No third-party network calls (GPS town name is now offline); privacy policy page; About/credits screen
- Offline-first, notifications as native alarms, Tamil/English, dark mode, text sizes, store listing text and graphics

## B. You must do (cannot be done from code)
1. Play Console developer account (one-time fee, identity verification).
2. Create the upload keystore ONCE and keep a backup (losing it = cannot update the app):
   keytool -genkeypair -v -keystore release.jks -alias thowheed -keyalg RSA -keysize 2048 -validity 10000
   base64 -w0 release.jks   -> GitHub repo Settings > Secrets > Actions:
   KEYSTORE_B64 (that text), KEYSTORE_PASSWORD, KEY_ALIAS (thowheed), KEY_PASSWORD
3. Put your email in privacy-policy.html (FILL_IN_YOUR_EMAIL), host it (GitHub Pages) and paste the URL in Play Console.
4. The app now includes the Quran (Arabic + Tamil/English translations), hadith and TNTJ course text. Get written permission from the translation/course publishers (TNTJ and others) before a Play Store release.
5. Adhan audio you have the right to use (current pack is unverified, see adhan/SOURCE.txt). Replace every file in adhan/.
6. Fill Data safety (no data collected), content rating, target audience, permission declarations (exact alarm, location). See store-listing.md.
7. New personal accounts: run a closed test with the required number of testers for the required days before production (check the current numbers in Play Console).
8. Real-phone test of: reminders firing at the minute with app closed, Adhan sound, compass, Android 13/14/15 permission prompts.

## C. Known risks
- Prayer times are astronomical calculations; say so (done in About and store text).
- Aqeedah page contains a firm position against some practices; Play does not forbid it, but keep wording factual.
- targetSdk comes from Capacitor 7 (API 35). If Play Console asks for a higher target, upgrade Capacitor.

## Quality, accessibility and security (what is in place)
- CI (`.github/workflows/ci.yml`) on every push: JS syntax, API tests, hadith-reference check (every Bukhari number and Muslim `(API n)` must exist in the data; only Bukhari/Muslim may be cited), JSON validity.
- Accessibility: Text size setting (normal / large / extra large), light/dark/auto theme, 44 px touch targets, visible keyboard/TalkBack focus, labels on all buttons and tabs, Arabic text marked `lang="ar" dir="rtl"`, reduced-motion support, text contrast at least 4.5:1 (checked in a browser audit), read-aloud on every screen.
- Security: Content-Security-Policy in `index.html` (scripts and data only from the app; media only from everyayah.com), cloud backup off, cleartext HTTP off, no account, no analytics, no ads, no third-party SDKs.
- Robustness: a crash in one screen shows a message instead of a blank app; the last error is kept on the phone only.

## Play Store "Data safety" answers
- Data collected: none. Data shared: none. Data encrypted in transit: yes (the only network use is HTTPS audio streaming from everyayah.com when the user taps play).
- Location: used on the phone only, only when the user taps "Use my location"; never sent anywhere.
- Permissions used: notifications, exact alarms, full-screen intent (Adhan alarm screen), boot completed (reschedule alarms), vibrate, foreground service for media playback (Adhan), wake lock. Declare the full-screen intent and exact alarm use in Play Console.
- Still to do before publishing: fill the contact email in `privacy-policy.html`, replace the Adhan recordings with ones you may distribute, keep the TNTJ permission letter on file, sign the release (keystore secrets).
