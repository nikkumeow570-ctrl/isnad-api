package app.thowheed.namaz;

import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;
import java.util.Locale;

/** Read-aloud with the phone's own Android text-to-speech engine (some WebViews have no speechSynthesis). */
@CapacitorPlugin(name = "Speak")
public class SpeakPlugin extends Plugin {
    private TextToSpeech tts;
    private boolean ready = false, failed = false;
    private final ArrayList<Runnable> waiting = new ArrayList<>();
    private PluginCall current;

    private void init(Runnable then) {
        if (ready) { then.run(); return; }
        if (failed) { then.run(); return; }
        waiting.add(then);
        if (tts != null) return;
        tts = new TextToSpeech(getContext().getApplicationContext(), status -> {
            ready = status == TextToSpeech.SUCCESS;
            failed = !ready;
            if (ready) {
                tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) {}
                    @Override public void onDone(String id) { finish(id, null); }
                    @Override public void onError(String id) { finish(id, "error"); }
                });
            }
            ArrayList<Runnable> w = new ArrayList<>(waiting); waiting.clear();
            for (Runnable r : w) r.run();
        });
    }

    private synchronized void finish(String id, String err) {
        PluginCall c = current;
        if (c == null || !id.equals(c.getCallbackId())) return;
        current = null;
        if (err == null) c.resolve(); else c.reject(err);
    }

    @PluginMethod
    public void available(PluginCall call) {
        init(() -> {
            JSObject o = new JSObject();
            o.put("ok", ready);
            call.resolve(o);
        });
    }

    /** { lang: "ta-IN" | "en-IN" | "ar", text, rate }  resolves when finished; rejects "nolang" when that voice is not installed. */
    @PluginMethod
    public void speak(PluginCall call) {
        final String text = call.getString("text", "");
        final String lang = call.getString("lang", "en-IN");
        final float rate = call.getFloat("rate", 0.9f);
        init(() -> {
            if (!ready) { call.reject("none"); return; }
            Locale loc = Locale.forLanguageTag(lang);
            int r = tts.setLanguage(loc);
            if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) { call.reject("nolang"); return; }
            tts.setSpeechRate(rate);
            synchronized (SpeakPlugin.this) {
                if (current != null) { try { current.reject("stopped"); } catch (Exception e) {} }
                current = call;
            }
            int q = tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, call.getCallbackId());
            if (q != TextToSpeech.SUCCESS) { synchronized (SpeakPlugin.this) { current = null; } call.reject("error"); }
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (tts != null && ready) tts.stop();
        synchronized (this) {
            if (current != null) { try { current.reject("stopped"); } catch (Exception e) {} current = null; }
        }
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
    }
}
