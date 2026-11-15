package app.thowheed.namaz;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Map;

/**
 * ISNAD "Daily Hadith" widget: today's hadith with its explanation (both from the API data, written by the
 * web app to SharedPreferences key thw_hadith through @capacitor/preferences). It changes at midnight.
 */
public class HadithWidget extends AppWidgetProvider {
    static final String ACTION = "app.thowheed.namaz.HADITH_TICK";

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        for (int id : ids) m.updateAppWidget(id, build(c));
        schedule(c);
    }

    @Override
    public void onEnabled(Context c) {
        super.onEnabled(c);
        schedule(c);
    }

    @Override
    public void onReceive(Context c, Intent i) {
        super.onReceive(c, i);
        String a = i != null ? i.getAction() : null;
        if (a == null) return;
        if (ACTION.equals(a) || Intent.ACTION_TIME_CHANGED.equals(a) || Intent.ACTION_TIMEZONE_CHANGED.equals(a) || Intent.ACTION_BOOT_COMPLETED.equals(a)) {
            AppWidgetManager m = AppWidgetManager.getInstance(c);
            int[] ids = m.getAppWidgetIds(new ComponentName(c, HadithWidget.class));
            if (ids != null && ids.length > 0) onUpdate(c, m, ids);
        }
    }

    static String read(Context c) {
        SharedPreferences sp = c.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        for (Map.Entry<String, ?> e : sp.getAll().entrySet()) {
            if (e.getKey().endsWith("thw_hadith") && e.getValue() instanceof String) return (String) e.getValue();
        }
        return null;
    }

    static RemoteViews build(Context c) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_hadith);
        Intent launch = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
        if (launch != null) {
            PendingIntent pi = PendingIntent.getActivity(c, 2, launch, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            v.setOnClickPendingIntent(R.id.h_root, pi);
        }
        try {
            String raw = read(c);
            if (raw == null) throw new Exception("no data");
            JSONObject o = new JSONObject(raw);
            JSONArray days = o.getJSONArray("days");
            long now = System.currentTimeMillis();
            JSONObject pick = null;
            for (int d = 0; d < days.length(); d++) {
                JSONObject x = days.getJSONObject(d);
                long m0 = x.optLong("m", 0);
                if (m0 > 0 && now >= m0 && now < m0 + 86400000L) { pick = x; break; }
            }
            if (pick == null) throw new Exception("stale");
            v.setTextViewText(R.id.h_title, o.optString("title", "Daily Hadith"));
            v.setTextViewText(R.id.h_text, pick.optString("h"));
            v.setTextViewText(R.id.h_expl_label, o.optString("expl", "Explanation"));
            v.setTextViewText(R.id.h_expl, pick.optString("e"));
            v.setTextViewText(R.id.h_ref, pick.optString("ref"));
        } catch (Exception e) {
            v.setTextViewText(R.id.h_title, "ISNAD");
            v.setTextViewText(R.id.h_text, "Open ISNAD once to load today's hadith");
            v.setTextViewText(R.id.h_expl_label, "");
            v.setTextViewText(R.id.h_expl, "");
            v.setTextViewText(R.id.h_ref, "");
        }
        return v;
    }

    static PendingIntent pending(Context c) {
        Intent i = new Intent(c, HadithWidget.class);
        i.setAction(ACTION);
        return PendingIntent.getBroadcast(c, 3, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** Refresh shortly after the next midnight (and in 30 minutes while there is no data yet). */
    static void schedule(Context c) {
        try {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.DAY_OF_YEAR, 1);
            cal.set(Calendar.HOUR_OF_DAY, 0); cal.set(Calendar.MINUTE, 0); cal.set(Calendar.SECOND, 5); cal.set(Calendar.MILLISECOND, 0);
            long when = Math.min(cal.getTimeInMillis(), System.currentTimeMillis() + 6 * 3600 * 1000L);
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            am.set(AlarmManager.RTC, when, pending(c));
        } catch (Exception e) {
            // the system will still refresh it every 30 minutes
        }
    }
}
