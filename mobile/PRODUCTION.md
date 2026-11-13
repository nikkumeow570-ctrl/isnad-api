# Production / Play Store checklist

## A. Done in code
- Release signing + versioning in the GitHub workflow (signed AAB + APK when the secrets exist; debug APK otherwise)
- No third-party network calls (GPS town name is now offline); privacy policy page; About/credits screen
- Offline-first, notifications as native alarms, Tamil/English, dark mode, text sizes, store listing text and graphics

## B. You must do (cannot be done from code)
1. Play Console developer account (one-time fee, identity verification).
2. Create the upload keystore ONCE and keep a backup (losing it = cannot update the app):
   keytool -genkeypair -v -keystore release.jks -alias thowheed -keyalg RSA -keysize 2048 -validity 10000
   base64 -w0 release.jks   -> GitHub repo Settings > Secrets > Actions:
   KEYSTORE_B64 (that text), KEYSTORE_PASSWORD, KEY_ALIAS (thowheed), KEY_PASSWORD
3. Put your email in privacy-policy.html (FILL_IN_YOUR_EMAIL), host it (GitHub Pages) and paste the URL in Play Console.
4. (Removed in v25) The Quran section was taken out, so no TNTJ/Tanzil permission is needed any more.
5. Adhan audio you have the right to use (current pack is unverified). Replace adhan/adhan.mp3 and adhan-fajr.mp3.
6. Fill Data safety (no data collected), content rating, target audience, permission declarations (exact alarm, location). See store-listing.md.
7. New personal accounts: run a closed test with the required number of testers for the required days before production (check the current numbers in Play Console).
8. Real-phone test of: reminders firing at the minute with app closed, Adhan sound, compass, Android 13/14/15 permission prompts.

## C. Known risks
- Prayer times are astronomical calculations; say so (done in About and store text).
- Aqeedah page contains a firm position against some practices; Play does not forbid it, but keep wording factual.
- targetSdk comes from Capacitor 7 (API 35). If Play Console asks for a higher target, upgrade Capacitor.
