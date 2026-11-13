package app.thowheed.namaz;

import android.app.AlarmManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONObject;

/** Schedules exact Adhan alarms. At the time, AthanReceiver starts AthanService (sound + full-screen screen). */
@CapacitorPlugin(name = "Athan")
public class AthanPlugin extends Plugin {
    static final String PREFS = "athan";
    static final String ACTION = "app.thowheed.namaz.ATHAN";

    static PendingIntent pending(Context c, JSONObject o) {
        Intent i = new Intent(c, AthanReceiver.class).setAction(ACTION);
        i.putExtra("id", o.optInt("id"));
        i.putExtra("title", o.optString("title"));
        i.putExtra("time", o.optString("time"));
        i.putExtra("tagline", o.optString("tagline"));
        i.putExtra("sound", o.optString("sound"));
        i.putExtra("stop", o.optString("stop", "Stop"));
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getBroadcast(c, o.optInt("id"), i, flags);
    }

    static void setAlarm(Context c, JSONObject o) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        long at = o.optLong("at");
        PendingIntent pi = pending(c, o);
        if (Build.VERSION.SDK_INT >= 31 && !am.canScheduleExactAlarms()) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        } else {
            am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        }
    }

    static void cancelStored(Context c) {
        try {
            AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
            String s = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("alarms", "[]");
            JSONArray a = new JSONArray(s);
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                if (am != null) am.cancel(pending(c, o));
            }
        } catch (Exception ignored) { }
    }

    static void rescheduleStored(Context c) {
        try {
            String s = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("alarms", "[]");
            JSONArray a = new JSONArray(s);
            long now = System.currentTimeMillis();
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                if (o.optLong("at") > now + 1000) setAlarm(c, o);
            }
        } catch (Exception ignored) { }
    }

    /** schedule({ alarms: [{ id, at (ms), title, time, tagline, sound, stop }] }) replaces all earlier Adhan alarms. */
    @PluginMethod
    public void schedule(PluginCall call) {
        try {
            Context c = getContext();
            JSArray arr = call.getArray("alarms");
            cancelStored(c);
            JSONArray keep = new JSONArray();
            long now = System.currentTimeMillis();
            int n = 0;
            if (arr != null) {
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject o = arr.getJSONObject(i);
                    if (o.optLong("at") <= now + 1000) continue;
                    setAlarm(c, o);
                    keep.put(o);
                    n++;
                }
            }
            c.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString("alarms", keep.toString()).apply();
            JSObject r = new JSObject();
            r.put("scheduled", n);
            call.resolve(r);
        } catch (Exception e) {
            call.reject(String.valueOf(e.getMessage()));
        }
    }

    /** test({ seconds, title, time, tagline, sound, stop }) rings once, without touching the saved schedule. */
    @PluginMethod
    public void test(PluginCall call) {
        try {
            JSONObject o = new JSONObject();
            o.put("id", 9999);
            o.put("at", System.currentTimeMillis() + 1000L * call.getInt("seconds", 10));
            o.put("title", call.getString("title", "Adhan"));
            o.put("time", call.getString("time", ""));
            o.put("tagline", call.getString("tagline", ""));
            o.put("sound", call.getString("sound", ""));
            o.put("stop", call.getString("stop", "Stop"));
            setAlarm(getContext(), o);
            call.resolve();
        } catch (Exception e) {
            call.reject(String.valueOf(e.getMessage()));
        }
    }

    @PluginMethod
    public void status(PluginCall call) {
        Context c = getContext();
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        JSObject r = new JSObject();
        r.put("exact", Build.VERSION.SDK_INT < 31 || (am != null && am.canScheduleExactAlarms()));
        r.put("fullScreen", Build.VERSION.SDK_INT < 34 || (nm != null && nm.canUseFullScreenIntent()));
        call.resolve(r);
    }

    @PluginMethod
    public void openSettings(PluginCall call) {
        try {
            String what = call.getString("what", "app");
            String pkg = "package:" + getContext().getPackageName();
            Intent i;
            if ("fullscreen".equals(what) && Build.VERSION.SDK_INT >= 34) {
                i = new Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT, Uri.parse(pkg));
            } else if ("exact".equals(what) && Build.VERSION.SDK_INT >= 31) {
                i = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM, Uri.parse(pkg));
            } else {
                i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse(pkg));
            }
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
            call.resolve();
        } catch (Exception e) {
            call.reject(String.valueOf(e.getMessage()));
        }
    }
}
