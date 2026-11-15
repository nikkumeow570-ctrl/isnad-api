/* ISNAD voice: (1) read-aloud of any screen with the phone's own text-to-speech (offline, free);
   (2) Quran recitation streamed ayah by ayah from everyayah.com (only when you press play; nothing is bundled). */
const VO = { on: false, q: [], i: 0, audio: null, play: null, rate: 0.9, reciter: 'Alafasy_128kbps' };
try { const r = parseFloat(localStorage.getItem('isnad_voice_rate')); if (r) VO.rate = r; } catch (e) {}
/* Native Android text-to-speech (plugin "Speak") is preferred; the browser's speechSynthesis is the fallback. */
const NTTS = (typeof window !== 'undefined' && window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Speak) || null;
const ttsOk = () => !!NTTS || (typeof speechSynthesis !== 'undefined');
const ttsStop = () => { try { if (NTTS) NTTS.stop(); else if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel(); } catch (e) {} };
/* resolves 'ok' when finished, 'nolang' when that language voice is missing, 'stopped' when cancelled, or 'error' */
function ttsSay(text, lang, rate) {
  if (NTTS) return NTTS.speak({ text, lang, rate }).then(() => 'ok', (e) => (e && e.message) || 'error');
  return new Promise((res) => {
    const s = speechSynthesis, u = new SpeechSynthesisUtterance(text), base = lang.slice(0, 2);
    const v = s.getVoices().find((x) => x.lang.replace('_', '-').toLowerCase().startsWith(base));
    if (v) { u.voice = v; u.lang = v.lang; } else if (base === 'ar') { res('nolang'); return; } else u.lang = lang;
    u.rate = rate; u.onend = () => res('ok'); u.onerror = () => res('error'); s.speak(u);
  });
}
const TTS = () => (typeof speechSynthesis !== 'undefined' ? speechSynthesis : null);
const isAr = (t) => ((t.match(/[؀-ۿ]/g) || []).length > t.length * 0.3);
const isTa = (t) => /[஀-௿]/.test(t);

function voicePick(lang) {
  const s = TTS(); if (!s) return null;
  const vs = s.getVoices();
  return vs.find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang)) || null;
}
function voiceBlocks(root) {
  const groups = new Map();
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) {
    const t = w.currentNode, p = t.parentElement;
    if (!p || p.closest('button,a.aref,.chip,.backbar,.filters,input,select,textarea,script,style,.arq,.ar,.arh,.vbtn,details:not([open]) > :not(summary)')) continue;
    const el = p.closest('p,li,h1,h2,h3,h4,td,.tq,.en,.mute,summary,.hn') || p;
    groups.set(el, (groups.get(el) || '') + ' ' + t.nodeValue);
  }
  const out = [];
  groups.forEach((txt) => {
    txt = txt.replace(/(Bukhari|Muslim|புகாரி|முஸ்லிம்)[\d,\s()API]*/g, ' ').replace(/\s+/g, ' ').trim();
    if (txt.length < 2 || isAr(txt)) return;
    (txt.match(/[^.!?।]+[.!?।]?/g) || [txt]).forEach((s) => {
      s = s.trim(); while (s.length > 220) { const k = s.lastIndexOf(' ', 200); out.push(s.slice(0, k)); s = s.slice(k).trim(); }
      if (s.length > 1) out.push(s);
    });
  });
  return out;
}
function voiceStop() {
  VO.on = false; VO.q = []; ttsStop();
  if (VO.audio) { VO.audio.pause(); VO.audio = null; } VO.play = null; voiceUi();
}
function voiceNext() {
  if (!VO.on || VO.i >= VO.q.length) { VO.on = false; voiceUi(); return; }
  const txt = VO.q[VO.i++];
  ttsSay(txt, isTa(txt) ? 'ta-IN' : 'en-IN', VO.rate).then((r) => {
    if (!VO.on) return;
    if (r === 'nolang' && !VO.warned) { VO.warned = true; toast(tx('No Tamil voice installed. Phone Settings > Text-to-speech > Google > install Tamil.', 'தமிழ் குரல் நிறுவப்படவில்லை. போன் அமைப்புகள் > Text-to-speech > Google இல் தமிழை நிறுவவும்.')); VO.on = false; voiceUi(); return; }
    voiceNext();
  });
}
function voiceRead() {
  if (!ttsOk()) { toast(tx('This phone has no text-to-speech', 'இந்த போனில் குரல் வாசிப்பு இல்லை')); return; }
  if (VO.on) { voiceStop(); return; }
  VO.q = voiceBlocks($('main')); VO.i = 0; VO.warned = false;
  if (!VO.q.length) { toast(tx('Nothing to read here', 'இங்கே வாசிக்க ஏதுமில்லை')); return; }
  VO.on = true; ttsStop(); voiceNext(); voiceUi();
}
/* Quran audio: surah n, from ayah a to the last ayah of the surah (or just one ayah when once=true) */
const p3 = (x) => String(x).padStart(3, '0');
function quranPlay(n, a, last, once) {
  voiceStop();
  VO.play = { n, a, last, once };
  const go = () => {
    const P = VO.play; if (!P) return;
    const au = VO.audio = new Audio(`https://everyayah.com/data/${(typeof S !== 'undefined' && S.rec) || VO.reciter}/${p3(P.n)}${p3(P.a)}.mp3`);
    document.querySelectorAll('.ay.playing').forEach((e) => e.classList.remove('playing'));
    const row = document.querySelector(`.ay[data-a="${P.a}"]`); if (row) { row.classList.add('playing'); row.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    au.onended = () => { if (!VO.play) return; if (P.once || P.a >= P.last) { voiceStop(); return; } P.a++; go(); };
    au.onerror = () => { toast(tx('Could not load the recitation (internet needed)', 'ஓதலை ஏற்ற முடியவில்லை (இணையம் தேவை)')); voiceStop(); };
    au.play().catch(() => au.onerror());
    voiceUi();
  };
  go();
}
function voiceUi() {
  let b = document.getElementById('vfab');
  if (!b) {
    b = document.createElement('button'); b.id = 'vfab'; b.className = 'vbtn'; b.dataset.act = 'vread'; document.body.appendChild(b);
  }
  try { document.body.classList.toggle('fabless', document.querySelectorAll('main .lrow').length >= 3 && !VO.play && !VO.on); } catch (e) {}
  const busy = VO.on || VO.play;
  b.textContent = busy ? '⏹' : '🔊';
  b.setAttribute('aria-label', busy ? 'Stop' : 'Read aloud');
}
/* adds a play button to every Quran ayah row after each render */
function voiceDecorate() {
  voiceUi();
  document.querySelectorAll('.ay').forEach((row) => {
    if (row.querySelector('.vplay')) return;
    const chip = row.querySelector('.chip'); if (!chip) return;
    const m = chip.textContent.match(/(\d+):(\d+)/); if (!m) return;
    row.dataset.n = m[1]; row.dataset.a = m[2];
    const b = document.createElement('button'); b.className = 'vplay vbtn'; b.dataset.act = 'qplay'; b.dataset.n = m[1]; b.dataset.a = m[2]; b.textContent = '▶'; b.setAttribute('aria-label', 'Play recitation');
    chip.after(b);
  });
}
function voiceAct(act, a) {
  if (act === 'vread') { if (VO.play) voiceStop(); else voiceRead(); return true; }
  if (act === 'qplay') {
    const row = a.closest('.ay'), n = +a.dataset.n, st = +a.dataset.a;
    const all = [...document.querySelectorAll('.ay')].map((e) => +e.dataset.a);
    if (VO.play && VO.play.a === st && VO.play.n === n) { voiceStop(); return true; }
    quranPlay(n, st, Math.max(...all), false); return true;
  }
  return false;
}
