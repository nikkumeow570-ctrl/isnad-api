package app.thowheed.namaz;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;

import androidx.core.app.NotificationCompat;

/** Plays the Adhan and shows the full-screen Adhan screen (over the lock screen) until the person taps Stop. */
public class AthanService extends Service {
    static final String ACTION_STOP = "app.thowheed.namaz.ATHAN_STOP";
    static final String CHANNEL = "athan_screen_v1";
    static final int NID = 4242;
    static volatile boolean running = false;

    private MediaPlayer mp;
    private PowerManager.WakeLock wl;
    private final Handler h = new Handler(Looper.getMainLooper());
    private final Runnable autoStop = new Runnable() { @Override public void run() { stopAll(); } };

    @Override
    public IBinder onBind(Intent i) { return null; }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            stopAll();
            return START_NOT_STICKY;
        }
        running = true;
        String title = intent != null ? intent.getStringExtra("title") : "";
        String time = intent != null ? intent.getStringExtra("time") : "";
        String tagline = intent != null ? intent.getStringExtra("tagline") : "";
        String sound = intent != null ? intent.getStringExtra("sound") : "";
        String stopLabel = intent != null ? intent.getStringExtra("stop") : "Stop";
        if (stopLabel == null || stopLabel.isEmpty()) stopLabel = "Stop";

        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26 && nm != null) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Adhan screen", NotificationManager.IMPORTANCE_HIGH);
            ch.setSound(null, null);
            ch.enableVibration(false);
            ch.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            nm.createNotificationChannel(ch);
        }

        int pf = PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        Intent act = new Intent(this, AthanActivity.class);
        act.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        act.putExtra("title", title);
        act.putExtra("time", time);
        act.putExtra("tagline", tagline);
        act.putExtra("stop", stopLabel);
        PendingIntent fs = PendingIntent.getActivity(this, 1, act, pf);
        PendingIntent stopPi = PendingIntent.getService(this, 2, new Intent(this, AthanService.class).setAction(ACTION_STOP), pf);

        NotificationCompat.Builder b = new NotificationCompat.Builder(this, CHANNEL)
                .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
                .setContentTitle(title)
                .setContentText(time + (tagline != null && !tagline.isEmpty() ? "  •  " + tagline : ""))
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOngoing(true)
                .setAutoCancel(false)
                .setContentIntent(fs)
                .setFullScreenIntent(fs, true)
                .addAction(0, stopLabel, stopPi);
        Notification n = b.build();
        if (Build.VERSION.SDK_INT >= 29) startForeground(NID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        else startForeground(NID, n);

        try {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                if (wl != null && wl.isHeld()) wl.release();
                wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "isnad:athan");
                wl.acquire(110000L);
            }
        } catch (Exception ignored) { }

        play(sound);
        h.removeCallbacks(autoStop);
        h.postDelayed(autoStop, 100000L);
        return START_NOT_STICKY;
    }

    private void play(String sound) {
        releasePlayer();
        try {
            int res = (sound == null || sound.isEmpty()) ? 0 : getResources().getIdentifier(sound, "raw", getPackageName());
            Uri uri = res != 0 ? Uri.parse("android.resource://" + getPackageName() + "/" + res)
                    : RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            mp = new MediaPlayer();
            mp.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build());
            mp.setDataSource(this, uri);
            mp.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override public void onCompletion(MediaPlayer m) { stopAll(); }
            });
            mp.setOnErrorListener(new MediaPlayer.OnErrorListener() {
                @Override public boolean onError(MediaPlayer m, int w, int e) { stopAll(); return true; }
            });
            mp.prepare();
            mp.start();
        } catch (Exception e) {
            // keep the screen up for a few seconds even if the sound could not play
        }
    }

    private void releasePlayer() {
        if (mp != null) {
            try { mp.stop(); } catch (Exception ignored) { }
            try { mp.release(); } catch (Exception ignored) { }
            mp = null;
        }
    }

    private void stopAll() {
        running = false;
        h.removeCallbacks(autoStop);
        releasePlayer();
        try { if (wl != null && wl.isHeld()) wl.release(); } catch (Exception ignored) { }
        stopForeground(true);
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(NID);
        stopSelf();
    }

    @Override
    public void onDestroy() {
        running = false;
        releasePlayer();
        super.onDestroy();
    }
}
