package app.thowheed.namaz;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Build;
import android.os.SystemClock;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Map;

/**
 * ISNAD home-screen widget: live phone clock + date, next prayer with countdown and a progress bar,
 * and the five prayer times with the next one highlighted.
 * Prayer data comes from the web app (SharedPreferences key thw_widget, written through @capacitor/preferences).
 * The clock is a system TextClock, so it is never empty even before the app has written any data.
 */
public class PrayerWidget extends AppWidgetProvider {
    static final String ACTION = "app.thowheed.namaz.WIDGET_TICK";
    static final String[] KEYS = {"Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"};
    static final String[] FARD = {"Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"};
    static final int[] COL = {R.id.w_c0, R.id.w_c1, R.id.w_c2, R.id.w_c3, R.id.w_c4};
    static final int[] NAME = {R.id.w_n0, R.id.w_n1, R.id.w_n2, R.id.w_n3, R.id.w_n4};
    static final int[] TIME = {R.id.w_t0, R.id.w_t1, R.id.w_t2, R.id.w_t3, R.id.w_t4};
    static final int WHITE = Color.WHITE;
    static final int DIM = Color.argb(120, 255, 255, 255);

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        long[] nextAt = new long[1];
        for (int id : ids) {
            m.updateAppWidget(id, build(c, nextAt));
        }
        schedule(c, nextAt[0]);
    }

    @Override
    public void onEnabled(Context c) {
        super.onEnabled(c);
        schedule(c, 0);
    }

    @Override
    public void onDisabled(Context c) {
        super.onDisabled(c);
        try {
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            am.cancel(pending(c));
        } catch (Exception e) {
            // nothing to cancel
        }
    }

    @Override
    public void onReceive(Context c, Intent i) {
        super.onReceive(c, i);
        String a = i != null ? i.getAction() : null;
        if (a == null) return;
        if (ACTION.equals(a) || Intent.ACTION_TIME_CHANGED.equals(a) || Intent.ACTION_TIMEZONE_CHANGED.equals(a) || Intent.ACTION_BOOT_COMPLETED.equals(a)) {
            AppWidgetManager m = AppWidgetManager.getInstance(c);
            int[] ids = m.getAppWidgetIds(new ComponentName(c, PrayerWidget.class));
            if (ids != null && ids.length > 0) {
                onUpdate(c, m, ids);
            }
        }
    }

    static String read(Context c) {
        SharedPreferences sp = c.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        for (Map.Entry<String, ?> e : sp.getAll().entrySet()) {
            if (e.getKey().endsWith("thw_widget") && e.getValue() instanceof String) {
                return (String) e.getValue();
            }
        }
        return null;
    }

    static RemoteViews build(Context c, long[] nextAt) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_prayer);
        Intent launch = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
        if (launch != null) {
            PendingIntent pi = PendingIntent.getActivity(c, 0, launch, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            v.setOnClickPendingIntent(R.id.w_root, pi);
        }
        try {
            String raw = read(c);
            if (raw == null) throw new Exception("no data");
            JSONObject o = new JSONObject(raw);
            JSONObject names = o.optJSONObject("names");
            JSONArray days = o.getJSONArray("days");
            long now = System.currentTimeMillis();

            // previous and next prayer over all stored days
            long prevTime = 0, nextTime = 0;
            String nextKey = null;
            int nextDay = 0;
            for (int d = 0; d < days.length(); d++) {
                JSONObject t = days.getJSONObject(d);
                for (String k : KEYS) {
                    if (!t.has(k)) continue;
                    long ms = t.getLong(k);
                    if (ms <= now) {
                        if (ms > prevTime) prevTime = ms;
                    } else if (nextKey == null || ms < nextTime) {
                        nextKey = k; nextTime = ms; nextDay = d;
                    }
                }
            }
            if (nextKey == null) throw new Exception("stale");

            // today's entry (for the Hijri date); the columns show the day of the next prayer
            int today = nextDay;
            for (int d = 0; d < days.length(); d++) {
                long m0 = days.getJSONObject(d).optLong("m", 0);
                if (m0 > 0 && now >= m0 && now < m0 + 86400000L) { today = d; break; }
            }
            SimpleDateFormat f = new SimpleDateFormat("h:mm a", Locale.ENGLISH);
            String nm = names != null ? names.optString(nextKey, nextKey) : nextKey;
            String place = o.optString("place", "");
            String hijri = days.getJSONObject(today).optString("h", "");
            String sub = hijri.length() > 0 && place.length() > 0 ? hijri + " • " + place : hijri + place;
            v.setTextViewText(R.id.w_hijri, sub);
            v.setTextViewText(R.id.w_next, o.optString("nextLabel", "NEXT").toUpperCase(Locale.ENGLISH));
            v.setTextViewText(R.id.w_name, nm);
            v.setTextViewText(R.id.w_time, f.format(new Date(nextTime)));

            int pct = 0;
            if (prevTime > 0 && nextTime > prevTime) pct = (int) Math.max(0, Math.min(100, (now - prevTime) * 100 / (nextTime - prevTime)));
            v.setProgressBar(R.id.w_prog, 100, pct, false);

            JSONObject day = days.getJSONObject(nextDay);
            for (int i = 0; i < 5; i++) {
                String k = FARD[i];
                v.setTextViewText(NAME[i], names != null ? names.optString(k, k) : k);
                if (day.has(k)) {
                    long ms = day.getLong(k);
                    v.setTextViewText(TIME[i], f.format(new Date(ms)).replace(" AM", "a").replace(" PM", "p"));
                    boolean isNext = k.equals(nextKey);
                    boolean past = ms <= now;
                    if (isNext) v.setInt(COL[i], "setBackgroundResource", R.drawable.widget_hl);
                    else v.setInt(COL[i], "setBackgroundColor", Color.TRANSPARENT);
                    v.setTextColor(NAME[i], past ? DIM : WHITE);
                    v.setTextColor(TIME[i], past ? DIM : WHITE);
                } else {
                    v.setTextViewText(TIME[i], "--");
                    v.setInt(COL[i], "setBackgroundColor", Color.TRANSPARENT);
                }
            }
            if (Build.VERSION.SDK_INT >= 24) {
                v.setViewVisibility(R.id.w_chrono, View.VISIBLE);
                v.setChronometerCountDown(R.id.w_chrono, true);
                v.setChronometer(R.id.w_chrono, SystemClock.elapsedRealtime() + (nextTime - now), null, true);
            } else {
                v.setViewVisibility(R.id.w_chrono, View.GONE);
            }
            nextAt[0] = nextTime;
        } catch (Exception e) {
            // No data yet: keep the clock, ask the person to open the app. The widget retries every minute.
            v.setTextViewText(R.id.w_hijri, "Open ISNAD once to load prayer times");
            v.setTextViewText(R.id.w_next, "");
            v.setTextViewText(R.id.w_name, "ISNAD");
            v.setTextViewText(R.id.w_time, "");
            v.setProgressBar(R.id.w_prog, 100, 0, false);
            v.setViewVisibility(R.id.w_chrono, View.GONE);
            for (int i = 0; i < 5; i++) {
                v.setTextViewText(NAME[i], "");
                v.setTextViewText(TIME[i], "");
                v.setInt(COL[i], "setBackgroundColor", Color.TRANSPARENT);
            }
        }
        return v;
    }

    static PendingIntent pending(Context c) {
        Intent i = new Intent(c, PrayerWidget.class);
        i.setAction(ACTION);
        return PendingIntent.getBroadcast(c, 1, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Refresh at the next prayer, but at least every 10 minutes (progress bar); every minute while there is no data. */
    static void schedule(Context c, long nextPrayerAt) {
        try {
            long now = System.currentTimeMillis();
            long when = nextPrayerAt > 0 ? Math.min(nextPrayerAt + 2000, now + 10 * 60 * 1000) : now + 60 * 1000;
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            am.set(AlarmManager.RTC, when, pending(c));
        } catch (Exception e) {
            // the 30-minute system refresh still keeps the widget current
        }
    }
}
