package app.thowheed.namaz;

import android.os.Bundle;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AthanPlugin.class);
        registerPlugin(SpeakPlugin.class);
        super.onCreate(savedInstanceState);
        // Keep the app's bottom tab bar above the phone's navigation bar (3-button or gesture) and clear of side cut-outs.
        try {
            View content = findViewById(android.R.id.content);
            ViewCompat.setOnApplyWindowInsetsListener(content, (v, insets) -> {
                Insets nav = insets.getInsets(WindowInsetsCompat.Type.navigationBars() | WindowInsetsCompat.Type.displayCutout());
                v.setPadding(nav.left, 0, nav.right, nav.bottom);
                return insets;
            });
            ViewCompat.requestApplyInsets(content);
        } catch (Exception e) {
            // layout stays as before
        }
    }
}
