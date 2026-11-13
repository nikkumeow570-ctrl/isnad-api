package app.thowheed.namaz;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** After a restart or an app update, put the saved Adhan alarms back. */
public class AthanBoot extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent i) {
        AthanPlugin.rescheduleStored(c);
    }
}
