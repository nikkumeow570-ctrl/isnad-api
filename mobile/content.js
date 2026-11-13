/* ISNAD content: Quran, Hadith, Courses, Qibla. Data is packed in data/ (see tools/pack_data.py) and works offline. */
const CJ = {}, CERR = {};
const cesc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function cget(p) {
  if (CJ[p]) return CJ[p];
  if (!CERR[p] && !CJ['_l' + p]) {
    CJ['_l' + p] = 1;
    fetch(p).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { CJ[p] = d; render(); }).catch(() => { CERR[p] = 1; render(); });
  }
  return null;
}
const cwait = (p) => CERR[p] ? `<div class="card soft"><p>${tx('Could not load this part.', 'இந்தப் பகுதியை ஏற்ற முடியவில்லை.')}</p></div>` : `<div class="card soft"><p class="mute">${tx('Loading…', 'ஏற்றுகிறது…')}</p></div>`;
const Q = { s: null }, H = { b: null, n: 1 }, C = { id: null };

/* ---------- Services (home of everything except prayer times) ---------- */
function viewServices() {
  const T = [
    ['pray', 'tc1', '🕌', tx('Prayer guide', 'தொழுகை வழிகாட்டி')],
    ['quran', 'tc2', '📖', tx('Quran', 'குர்ஆன்')],
    ['hadith', 'tc3', '📜', tx('Hadith', 'ஹதீஸ்')],
    ['duas', 'tc4', '🤲', tx('Duas & Adhkar', 'துஆக்கள் & அதுகார்')],
    ['qibla', 'tc5', '🧭', tx('Qibla', 'கிப்லா')],
    ['courses', 'tc6', '🎓', tx('Courses', 'பாடங்கள்')],
    ['track', 'tc7', '📊', tx('Prayer log', 'தொழுகைப் பதிவு')],
    ['jumma', 'tc8', '🕋', tx('Jumma', 'ஜும்ஆ')],
    ['eid', 'tc1', '🌙', tx('Eid', 'பெருநாள்')],
    ['special', 'tc2', '⚰️', tx('Janazah & Taraweeh', 'ஜனாஸா & தராவீஹ்')],
    ['aqeedah', 'tc3', '☝️', tx('Aqeedah', 'அகீதா')]
  ];
  return `<div class="tiles">${T.map((x) => `<button class="tile ${x[1]}" data-act="svc" data-v="${x[0]}"><span class="ti">${x[2]}</span><span class="tn">${x[3]}</span></button>`).join('')}</div>`;
}

/* ---------- Quran ---------- */
function viewQuran() {
  if (Q.s) return viewSurah(Q.s);
  const ix = cget('data/quran/index.json');
  if (!ix) return backBar('moreback') + cwait('data/quran/index.json');
  return backBar('moreback') + `<label class="field"><input type="search" id="qsearch" placeholder="${tx('Search surah…', 'சூரா தேடு…')}" autocomplete="off"></label>
  <div class="card list" id="qlist">${ix.map((s) => `<button class="lrow" data-act="qopen" data-n="${s[0]}" data-name="${cesc((s[0] + ' ' + s[1] + ' ' + s[2]).toLowerCase())}"><span class="li num">${s[0]}</span><span class="lt"><b>${cesc(s[1])}</b><small>${cesc(s[2])} · ${s[3]} ${tx('verses', 'வசனங்கள்')}</small></span><span class="lc">›</span></button>`).join('')}</div>`;
}
function viewSurah(n) {
  const p = `data/quran/${n}.json`, d = cget(p);
  const nav = `<div class="pager">${n > 1 ? `<button class="sec" data-act="qopen" data-n="${n - 1}">‹ ${n - 1}</button>` : '<span></span>'}<button class="sec" data-act="qback">${tx('Surah list', 'சூரா பட்டியல்')}</button>${n < 114 ? `<button class="sec" data-act="qopen" data-n="${n + 1}">${n + 1} ›</button>` : '<span></span>'}</div>`;
  if (!d) return backBar('qback') + cwait(p);
  const en = !!S.qen;
  return backBar('qback') + `<div class="card hero small"><div class="hn">${n}. ${cesc(d.name)}</div><div class="arh">${cesc(d.ar)}</div>
    <label class="mute"><input type="checkbox" data-act="qen" ${en ? 'checked' : ''}> ${tx('Show English', 'ஆங்கிலமும் காட்டு')}</label></div>
  ${d.v.map((v) => `<div class="ay"><span class="chip">${n}:${v[0]}${v[3] ? '–' + v[3] : ''}</span><div class="arq">${cesc(v[1])}</div>${v[2] ? `<div class="tq">${cesc(v[2])}</div>` : ''}${en && v[4] ? `<div class="eq">${cesc(v[4])}</div>` : ''}</div>`).join('')}${nav}`;
}

/* ---------- Hadith ---------- */
function viewHadith() {
  const bx = cget('data/hadith/index.json');
  if (!bx) return backBar('moreback') + cwait('data/hadith/index.json');
  if (!H.b) return backBar('moreback') + `<div class="card list">${bx.map((b) => `<button class="lrow" data-act="hbook" data-id="${b.id}"><span class="li">📜</span><span class="lt"><b>${cesc(b.title)}</b><small>${b.have} ${tx('hadith', 'ஹதீஸ்கள்')}${b.have < b.total ? ' / ' + b.total : ''}</small></span><span class="lc">›</span></button>`).join('')}</div>
    <p class="mute" style="padding:0 6px">${tx('Numbers that are missing in a book are not in this edition.', 'ஒரு நூலில் இல்லாத எண்கள் இந்தப் பதிப்பில் இல்லை.')}</p>`;
  const b = bx.find((x) => x.id === H.b) || { title: H.b };
  const n = H.n, k = Math.floor((n - 1) / 100), cp = `data/hadith/${H.b}/${k}.json`, ch = cget(`data/hadith/${H.b}/ch.json`);
  const d = cget(cp);
  let body;
  if (!d && !CERR[cp]) body = cwait(cp);
  else {
    const h = d && d[n];
    body = h ? `<div class="card">${h.ch ? `<div class="mute">${cesc(h.ch)}</div>` : ''}${h.nr ? `<div class="mute">${cesc(h.nr)}</div>` : ''}${h.ar ? `<div class="arq">${cesc(h.ar)}</div>` : ''}<div class="tq" style="white-space:pre-line">${cesc(h.t)}</div>${h.en ? `<div class="eq">${cesc(h.en)}</div>` : ''}</div>`
      : `<div class="card soft"><p>${tx('This number is not in this edition.', 'இந்த எண் இந்தப் பதிப்பில் இல்லை.')}</p></div>`;
  }
  const chs = ch ? `<details class="card soft"><summary>${tx('Chapters', 'அத்தியாயங்கள்')}</summary><div class="list">${ch.map((c) => `<button class="lrow" data-act="hgo" data-n="${c[2]}"><span class="li num">${c[0]}</span><span class="lt"><b>${cesc(c[1])}</b><small>${c[2]}–${c[3]}</small></span></button>`).join('')}</div></details>` : '';
  return backBar('hback') + `<div class="card hero small"><div class="hn">${cesc(b.title)}</div><div class="ht">${n}</div></div>
  <div class="hnav"><button class="sec" data-act="hgo" data-n="${Math.max(1, n - 1)}">‹</button><input type="number" id="hn" min="1" inputmode="numeric" placeholder="${tx('Number', 'எண்')}"><button class="pri" data-act="hjump">${tx('Go', 'செல்')}</button><button class="sec" data-act="hgo" data-n="${n + 1}">›</button></div>
  ${body}${chs}`;
}

/* ---------- Courses ---------- */
function viewCourses() {
  if (C.id) return viewCourse(C.id);
  const ix = cget('data/articles/index.json');
  if (!ix) return backBar('moreback') + cwait('data/articles/index.json');
  return backBar('moreback') + `<div class="card list">${ix.articles.map((a) => `<button class="lrow" data-act="cour" data-id="${a.id}"><span class="li">🎓</span><span class="lt"><b>${cesc(a.title)}</b></span><span class="lc">›</span></button>`).join('')}</div>`;
}
function viewCourse(id) {
  const p = `data/articles/${id}.json`, d = cget(p);
  if (!d) return backBar('courback') + cwait(p);
  const secs = (d.sections || []).slice(0, 300);
  const body = (s) => s.blocks ? s.blocks.map((b) => b.type === 'image' ? '' : `<p>${cesc(b.text || '')}</p>`).join('') : `<p style="white-space:pre-line">${cesc(s.text_pdf || s.text || '')}</p>`;
  return backBar('courback') + `<div class="card"><h2>${cesc(d.title)}</h2>${d.quality_note ? `<p class="mute">${cesc(d.quality_note)}</p>` : ''}</div>
    ${secs.map((s) => `<div class="card">${s.heading || s.title ? `<h3>${cesc(s.heading || s.title)}</h3>` : ''}${s.image ? `<img class="slide" loading="lazy" src="data/articles/images/${id}/${String(s.image).split('/').pop()}" alt="">` : ''}${s.image ? '' : body(s)}</div>`).join('')}`;
}

/* ---------- Qibla ---------- */
function viewQibla() {
  if (!hasLoc()) return backBar('moreback') + `<div class="card soft"><p>${tx('Set your location first (Settings).', 'முதலில் இருப்பிடத்தை அமைக்கவும் (அமைப்புகள்).')}</p></div>`;
  const q = Prayer.qibla(S.lat, S.lng), dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], dir = dirs[Math.round(q / 45) % 8];
  return backBar('moreback') + `<div class="card dark" style="text-align:center">
    <div class="qwrap"><div class="qptr">▲</div><div class="qdial" id="qDial"><div class="qrose" id="qRose" style="transform:rotate(${compass.on && compass.h != null ? (-compass.h).toFixed(1) : 0}deg)">
      <span class="qd n">N</span><span class="qd e">E</span><span class="qd s">S</span><span class="qd w">W</span>
      <span class="qk" style="transform:rotate(${q.toFixed(1)}deg)"><i>🕋</i></span></div></div></div>
    <div style="font-size:22px;font-weight:700">${q.toFixed(1)}° ${dir}</div><div id="qStat" class="qstat">${compass.on ? (compass.h == null ? tx('Finding direction…', 'திசையைத் தேடுகிறது…') : '') : ''}</div>
    <div class="row" style="justify-content:center"><button class="pri" data-act="compass">${compass.on ? tx('Stop compass', 'திசைகாட்டியை நிறுத்து') : tx('Start compass', 'திசைகாட்டியைத் தொடங்கு')}</button></div>
    <p style="font-size:12px;opacity:.8;margin:8px 0 0">${tx('Hold the phone flat. Turn until the 🕋 arrow lines up with ▲.', 'போனை சமமாகப் பிடிக்கவும். 🕋 அம்புக்குறி ▲ உடன் ஒன்றாகும் வரை திருப்பவும்.')}</p></div>`;
}

/* ---------- actions (called first by the click handler; true = handled) ---------- */
function contentAct(act, a) {
  const go = () => { render(); window.scrollTo(0, 0); return true; };
  if (act === 'svc') {
    const v = a.dataset.v; setSub = null;
    if (v === 'pray') { tab = 'pray'; praySub = null; }
    else if (v === 'duas') { tab = 'duas'; duaOpen = null; akSet = null; }
    else { tab = 'more'; moreSub = v; }
    return go();
  }
  if (act === 'tosvc') { tab = 'more'; moreSub = null; return go(); }
  if (act === 'qopen') { Q.s = +a.dataset.n; return go(); }
  if (act === 'qback') { Q.s = null; return go(); }
  if (act === 'qen') { S.qen = a.checked; save(); render(); return true; }
  if (act === 'hbook') { H.b = a.dataset.id; H.n = 1; return go(); }
  if (act === 'hback') { H.b = null; return go(); }
  if (act === 'hgo') { H.n = Math.max(1, +a.dataset.n || 1); return go(); }
  if (act === 'hjump') { const v = +(document.getElementById('hn') || {}).value; if (v > 0) { H.n = v; return go(); } return true; }
  if (act === 'cour') { C.id = a.dataset.id; return go(); }
  if (act === 'courback') { C.id = null; return go(); }
  return false;
}
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'qsearch') {
    const f = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#qlist .lrow').forEach((r) => { r.style.display = !f || r.dataset.name.includes(f) ? '' : 'none'; });
  }
});
