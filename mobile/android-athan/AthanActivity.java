package app.thowheed.namaz;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.TextView;

/** Full-screen Adhan screen: prayer name, big time, a line from the Adhan, and a Stop button. Shows over the lock screen. */
public class AthanActivity extends Activity {
    private final Handler h = new Handler(Looper.getMainLooper());
    private long started;
    private final Runnable check = new Runnable() {
        @Override public void run() {
            if (!AthanService.running && System.currentTimeMillis() - started > 3000) { finish(); return; }
            h.postDelayed(this, 700);
        }
    };

    private int dp(int v) { return (int) (v * getResources().getDisplayMetrics().density + 0.5f); }

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        started = System.currentTimeMillis();
        if (Build.VERSION.SDK_INT >= 27) { setShowWhenLocked(true); setTurnScreenOn(true); }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);

        Intent in = getIntent();
        String title = in.getStringExtra("title");
        String time = in.getStringExtra("time");
        String tagline = in.getStringExtra("tagline");
        String stopLabel = in.getStringExtra("stop");
        if (stopLabel == null || stopLabel.isEmpty()) stopLabel = "Stop";

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER_HORIZONTAL);
        root.setPadding(dp(24), dp(72), dp(24), dp(64));
        GradientDrawable bg = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, new int[]{0xFF0F5C4A, 0xFF0A3D31, 0xFF04160F});
        root.setBackground(bg);

        TextView app = new TextView(this);
        app.setText("ISNAD");
        app.setTextColor(Color.WHITE);
        app.setTextSize(18);
        app.setTypeface(Typeface.DEFAULT_BOLD);
        app.setLetterSpacing(0.15f);
        app.setPadding(dp(22), dp(8), dp(22), dp(8));
        GradientDrawable pill = new GradientDrawable();
        pill.setCornerRadius(dp(30));
        pill.setColor(0x33FFFFFF);
        app.setBackground(pill);
        root.addView(app, new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, LinearLayout.LayoutParams.WRAP_CONTENT));

        View sp1 = new View(this);
        root.addView(sp1, new LinearLayout.LayoutParams(1, 0, 1f));

        TextView name = new TextView(this);
        name.setText(title);
        name.setTextColor(Color.WHITE);
        name.setTextSize(30);
        name.setTypeface(Typeface.DEFAULT_BOLD);
        name.setGravity(Gravity.CENTER);
        root.addView(name);

        TextView t = new TextView(this);
        t.setText(time);
        t.setTextColor(Color.WHITE);
        t.setTextSize(78);
        t.setTypeface(Typeface.DEFAULT_BOLD);
        t.setGravity(Gravity.CENTER);
        t.setPadding(0, dp(8), 0, dp(8));
        root.addView(t);

        TextView tag = new TextView(this);
        tag.setText(tagline);
        tag.setTextColor(0xFFE8F5EE);
        tag.setTextSize(22);
        tag.setTypeface(Typeface.DEFAULT_BOLD);
        tag.setGravity(Gravity.CENTER);
        tag.setPadding(dp(8), dp(12), dp(8), 0);
        root.addView(tag);

        View sp2 = new View(this);
        root.addView(sp2, new LinearLayout.LayoutParams(1, 0, 1.4f));

        TextView stop = new TextView(this);
        stop.setText(stopLabel);
        stop.setTextColor(Color.WHITE);
        stop.setTextSize(22);
        stop.setTypeface(Typeface.DEFAULT_BOLD);
        stop.setGravity(Gravity.CENTER);
        GradientDrawable sb = new GradientDrawable();
        sb.setCornerRadius(dp(40));
        sb.setColor(0x44FFFFFF);
        sb.setStroke(dp(2), 0x88FFFFFF);
        stop.setBackground(sb);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dp(180), dp(76));
        root.addView(stop, lp);
        stop.setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) {
                startService(new Intent(AthanActivity.this, AthanService.class).setAction(AthanService.ACTION_STOP));
                finish();
            }
        });

        setContentView(root);
        h.postDelayed(check, 1500);
    }

    @Override
    protected void onDestroy() {
        h.removeCallbacks(check);
        super.onDestroy();
    }
}
