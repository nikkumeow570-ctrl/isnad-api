package app.thowheed.namaz;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AthanPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
