const HB_EN = { bukhari: 'Sahih al-Bukhari', muslim: 'Sahih Muslim', lulu: "Al-Lu'lu' wal-Marjan (hadith agreed upon by both)", abudawud: 'Sunan Abi Dawud (selection)', riyadussalihin: 'Riyad as-Salihin (selection)', shamail: "Shama'il at-Tirmidhi" };
const hbTitle = (b) => (S.lang === 'en' && HB_EN[b.id]) || b.title;
const SURAH_EN = [["Al-Fatihah", "The Opening"], ["Al-Baqarah", "The Cow"], ["Ali 'Imran", "The Family of Imran"], ["An-Nisa", "The Women"], ["Al-Ma'idah", "The Table Spread"], ["Al-An'am", "The Cattle"], ["Al-A'raf", "The Heights"], ["Al-Anfal", "The Spoils of War"], ["At-Tawbah", "The Repentance"], ["Yunus", "Jonah"], ["Hud", "Hud"], ["Yusuf", "Joseph"], ["Ar-Ra'd", "The Thunder"], ["Ibrahim", "Abraham"], ["Al-Hijr", "The Rocky Tract"], ["An-Nahl", "The Bee"], ["Al-Isra", "The Night Journey"], ["Al-Kahf", "The Cave"], ["Maryam", "Mary"], ["Ta-Ha", "Ta-Ha"], ["Al-Anbiya", "The Prophets"], ["Al-Hajj", "The Pilgrimage"], ["Al-Mu'minun", "The Believers"], ["An-Nur", "The Light"], ["Al-Furqan", "The Criterion"], ["Ash-Shu'ara", "The Poets"], ["An-Naml", "The Ant"], ["Al-Qasas", "The Stories"], ["Al-'Ankabut", "The Spider"], ["Ar-Rum", "The Romans"], ["Luqman", "Luqman"], ["As-Sajdah", "The Prostration"], ["Al-Ahzab", "The Combined Forces"], ["Saba", "Sheba"], ["Fatir", "The Originator"], ["Ya-Sin", "Ya-Sin"], ["As-Saffat", "Those Ranged in Ranks"], ["Sad", "Sad"], ["Az-Zumar", "The Groups"], ["Ghafir", "The Forgiver"], ["Fussilat", "Explained in Detail"], ["Ash-Shura", "The Consultation"], ["Az-Zukhruf", "The Gold Adornments"], ["Ad-Dukhan", "The Smoke"], ["Al-Jathiyah", "The Kneeling"], ["Al-Ahqaf", "The Wind-Curved Sandhills"], ["Muhammad", "Muhammad"], ["Al-Fath", "The Victory"], ["Al-Hujurat", "The Rooms"], ["Qaf", "Qaf"], ["Adh-Dhariyat", "The Winnowing Winds"], ["At-Tur", "The Mount"], ["An-Najm", "The Star"], ["Al-Qamar", "The Moon"], ["Ar-Rahman", "The Most Merciful"], ["Al-Waqi'ah", "The Inevitable"], ["Al-Hadid", "The Iron"], ["Al-Mujadilah", "The Pleading Woman"], ["Al-Hashr", "The Exile"], ["Al-Mumtahanah", "The Examined One"], ["As-Saff", "The Ranks"], ["Al-Jumu'ah", "The Congregation, Friday"], ["Al-Munafiqun", "The Hypocrites"], ["At-Taghabun", "The Mutual Disillusion"], ["At-Talaq", "The Divorce"], ["At-Tahrim", "The Prohibition"], ["Al-Mulk", "The Sovereignty"], ["Al-Qalam", "The Pen"], ["Al-Haqqah", "The Reality"], ["Al-Ma'arij", "The Ascending Stairways"], ["Nuh", "Noah"], ["Al-Jinn", "The Jinn"], ["Al-Muzzammil", "The Enshrouded One"], ["Al-Muddaththir", "The Cloaked One"], ["Al-Qiyamah", "The Resurrection"], ["Al-Insan", "The Human"], ["Al-Mursalat", "The Emissaries"], ["An-Naba", "The Tidings"], ["An-Nazi'at", "Those Who Drag Forth"], ["'Abasa", "He Frowned"], ["At-Takwir", "The Overthrowing"], ["Al-Infitar", "The Cleaving"], ["Al-Mutaffifin", "The Defrauding"], ["Al-Inshiqaq", "The Sundering"], ["Al-Buruj", "The Mansions of the Stars"], ["At-Tariq", "The Nightcomer"], ["Al-A'la", "The Most High"], ["Al-Ghashiyah", "The Overwhelming"], ["Al-Fajr", "The Dawn"], ["Al-Balad", "The City"], ["Ash-Shams", "The Sun"], ["Al-Layl", "The Night"], ["Ad-Duha", "The Morning Hours"], ["Ash-Sharh", "The Relief"], ["At-Tin", "The Fig"], ["Al-'Alaq", "The Clot"], ["Al-Qadr", "The Power"], ["Al-Bayyinah", "The Clear Proof"], ["Az-Zalzalah", "The Earthquake"], ["Al-'Adiyat", "The Courser"], ["Al-Qari'ah", "The Calamity"], ["At-Takathur", "The Rivalry in World Increase"], ["Al-'Asr", "The Declining Day"], ["Al-Humazah", "The Traducer"], ["Al-Fil", "The Elephant"], ["Quraysh", "Quraysh"], ["Al-Ma'un", "The Small Kindnesses"], ["Al-Kawthar", "The Abundance"], ["Al-Kafirun", "The Disbelievers"], ["An-Nasr", "The Divine Support"], ["Al-Masad", "The Palm Fiber"], ["Al-Ikhlas", "The Sincerity"], ["Al-Falaq", "The Daybreak"], ["An-Nas", "Mankind"]];
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
const Q = { s: null, bm: false, focus: null }, H = { b: null, n: 1 }, C = { id: null };

/* ---------- Services (home of everything except prayer times) ---------- */
function viewServices() {
  const T = [
    ['pray', 'tc1', '🕌', tx('Prayer guide', 'தொழுகை வழிகாட்டி')],
    ['duas', 'tc4', '🤲', tx('Duas & Adhkar', 'துஆக்கள் & அதுகார்')],
    ['qibla', 'tc5', '🧭', tx('Qibla', 'கிப்லா')],
    ['courses', 'tc6', '🎓', tx('Courses', 'பாடங்கள்')],
    ['track', 'tc7', '📊', tx('Prayer log', 'தொழுகைப் பதிவு')],
    ['jumma', 'tc8', '🕋', tx('Jumma', 'ஜும்ஆ')],
    ['eid', 'tc1', '🌙', tx('Eid', 'பெருநாள்')],
    ['special', 'tc2', '⚰️', tx('Janazah & Taraweeh', 'ஜனாஸா & தராவீஹ்')],
    ['aqeedah', 'tc3', '☝️', tx('Aqeedah', 'அகீதா')],
    ['settings', 'tc4', '⚙️', tx('Settings', 'அமைப்புகள்')]
  ];
  return `<div class="tiles">${T.map((x) => `<button class="tile ${x[1]}" data-act="svc" data-v="${x[0]}"><span class="ti">${x[2]}</span><span class="tn">${x[3]}</span></button>`).join('')}</div>`;
}

/* ---------- Quran ---------- */
const JUZ = [[1,1],[2,142],[2,253],[3,93],[4,24],[4,148],[5,82],[6,111],[7,88],[8,41],[9,93],[11,6],[12,53],[15,1],[17,1],[18,75],[21,1],[23,1],[25,21],[27,56],[29,46],[33,31],[36,28],[39,32],[41,47],[46,1],[51,31],[58,1],[67,1],[78,1]];
const RECITERS = [['Alafasy_128kbps', 'Mishary Alafasy'], ['Husary_128kbps', 'Mahmoud Khalil Al-Husary'], ['Abdul_Basit_Murattal_192kbps', 'Abdul Basit (Murattal)'], ['Abdurrahmaan_As-Sudais_192kbps', 'Abdur-Rahman As-Sudais'], ['Minshawy_Murattal_128kbps', 'Mohamed Siddiq Al-Minshawi']];
const ICO_STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-3-5.4 3 1.1-6L3.2 9.6l6.1-.8z"/></svg>';
const ICO_SHARE = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4"/></svg>';
const bmKey = (n, a) => n + ':' + a;
const bmHas = (n, a) => (S.bm || []).includes(bmKey(n, a));
const surahName = (n, ix) => S.lang === 'en' ? SURAH_EN[n - 1][0] : ((ix && ix[n - 1] && ix[n - 1][1]) || SURAH_EN[n - 1][0]);
function viewQuran() {
  if (Q.s) return viewSurah(Q.s);
  const ix = cget('data/quran/index.json');
  if (!ix) return backBar('moreback') + cwait('data/quran/index.json');
  if (Q.bm) return viewBookmarks(ix);
  const L = S.last && S.last.s ? S.last : null, nb = (S.bm || []).length;
  const cont = L ? `<button class="lrow qcont" data-act="qgo" data-n="${L.s}" data-a="${L.a}"><span class="li">📖</span><span class="lt"><b>${tx('Continue reading', 'தொடர்ந்து வாசிக்க')}</b><small>${cesc(surahName(L.s, ix))} ${L.s}:${L.a}</small></span><span class="lc">›</span></button>` : '';
  const bmr = `<button class="lrow" data-act="qbmview"><span class="li">★</span><span class="lt"><b>${tx('Bookmarks', 'குறிப்பான்கள்')}</b><small>${nb} ${tx('saved', 'சேமித்தவை')}</small></span><span class="lc">›</span></button>`;
  const juz = `<div class="juz" role="group" aria-label="Juz">${JUZ.map((x, k) => `<button class="sec" data-act="qgo" data-n="${x[0]}" data-a="${x[1]}">${tx('Juz', 'ஜுஸ்உ')} ${k + 1}</button>`).join('')}</div>`;
  return backBar('moreback') + `<div class="card list">${cont}${bmr}</div>
  <label class="field"><input type="search" id="qvs" placeholder="${tx('Search verses (Arabic, Tamil, English)…', 'வசனங்களைத் தேடு (அரபி, தமிழ், ஆங்கிலம்)…')}" autocomplete="off" enterkeyhint="search"></label>
  <div id="qres" aria-live="polite"></div>
  <label class="field"><input type="search" id="qsearch" placeholder="${tx('Search surah…', 'சூரா தேடு…')}" autocomplete="off"></label>
  <details class="ad"><summary>${tx('Go to Juz', 'ஜுஸ்உவுக்குச் செல்')}</summary>${juz}</details>
  <div class="card list" id="qlist">${ix.map((s) => `<button class="lrow" data-act="qopen" data-n="${s[0]}" data-name="${cesc((s[0] + ' ' + s[1] + ' ' + s[2] + ' ' + SURAH_EN[s[0] - 1].join(' ')).toLowerCase())}"><span class="li num">${s[0]}</span><span class="lt"><b>${cesc(S.lang === 'en' ? SURAH_EN[s[0] - 1][0] : s[1])}</b><small>${cesc(S.lang === 'en' ? SURAH_EN[s[0] - 1][1] : s[2])} · ${s[3]} ${tx('verses', 'வசனங்கள்')}</small></span><span class="lc">›</span></button>`).join('')}</div>`;
}
function ayText(d, a) { const v = d && d.v.find((x) => x[0] === a); return v || null; }
function viewBookmarks(ix) {
  const list = (S.bm || []).map((k) => k.split(':').map(Number)).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
  let body = list.length ? '' : `<div class="card soft"><p>${tx('No bookmarks yet. Tap ☆ beside a verse to save it.', 'குறிப்பான்கள் இன்னும் இல்லை. வசனத்தின் அருகிலுள்ள ☆ ஐத் தட்டி சேமிக்கவும்.')}</p></div>`;
  if (list.length) body = '<div class="card list">' + list.map(([n, a]) => {
    const d = cget('data/quran/' + n + '.json'), v = ayText(d, a);
    const sn = v ? (S.lang === 'en' ? (v[4] || v[2] || '') : (v[2] || v[4] || '')) : '';
    return `<button class="lrow" data-act="qgo" data-n="${n}" data-a="${a}"><span class="li">★</span><span class="lt"><b>${cesc(surahName(n, ix))} ${n}:${a}</b><small>${cesc(sn.slice(0, 110))}</small></span><span class="lc">›</span></button>`;
  }).join('') + '</div>';
  return `<div class="backbar"><button class="sec" data-act="qbmback">← ${tx('Back', 'பின்செல்')}</button></div><h3>★ ${tx('Bookmarks', 'குறிப்பான்கள்')}</h3>${body}`;
}
function qFocus(d) {
  if (Q.focus) { const a = Q.focus; Q.focus = null; setTimeout(() => { const r = document.querySelector('.ay[data-a="' + a + '"]'); if (r) { r.scrollIntoView({ block: 'start' }); r.classList.add('qflash'); setTimeout(() => r.classList.remove('qflash'), 1800); } }, 60); }
  return '';
}
function viewSurah(n) {
  const p = `data/quran/${n}.json`, d = cget(p);
  const nav = `<div class="pager">${n > 1 ? `<button class="sec" data-act="qopen" data-n="${n - 1}">‹ ${n - 1}</button>` : '<span></span>'}<button class="sec" data-act="qback">${tx('Surah list', 'சூரா பட்டியல்')}</button>${n < 114 ? `<button class="sec" data-act="qopen" data-n="${n + 1}">${n + 1} ›</button>` : '<span></span>'}</div>`;
  if (!d) return backBar('qback') + cwait(p);
  const en = S.lang === 'en' ? !S.qno : !!S.qen, ta = S.lang === 'en' ? !!S.qta : true;
  return backBar('qback') + `<div class="card hero small"><div class="hn">${n}. ${cesc(S.lang === 'en' ? SURAH_EN[n - 1][0] + ' - ' + SURAH_EN[n - 1][1] : d.name)}</div><div class="arh">${cesc(d.ar)}</div>
    <div class="qtools"><button class="sec" data-act="qplaysurah" data-n="${n}">▶ ${tx('Play surah', 'சூராவை ஓது')}</button><label class="field qrec"><span class="mute">${tx('Reciter', 'ஓதுபவர்')}</span><select id="qrec">${RECITERS.map((r) => `<option value="${r[0]}" ${(S.rec || 'Alafasy_128kbps') === r[0] ? 'selected' : ''}>${r[1]}</option>`).join('')}</select></label></div>
    <label class="mute"><input type="checkbox" data-act="${S.lang === 'en' ? 'qta' : 'qen'}" ${(S.lang === 'en' ? ta : en) ? 'checked' : ''}> ${tx('Also show Tamil translation', 'ஆங்கிலமும் காட்டு')}</label></div>
  ${d.v.map((v) => `<div class="ay" data-a="${v[0]}"><span class="chip">${n}:${v[0]}${v[3] ? '–' + v[3] : ''}</span><div class="arq">${cesc(v[1])}</div>${ta && v[2] ? `<div class="tq" lang="ta">${cesc(v[2])}</div>` : ''}${en && v[4] ? `<div class="eq">${cesc(v[4])}</div>` : ''}<div class="aacts"><button class="vbtn" data-act="qbm" data-n="${n}" data-a="${v[0]}" aria-pressed="${bmHas(n, v[0])}" aria-label="${tx('Bookmark', 'குறிப்பான்')}">${ICO_STAR}</button><button class="vbtn" data-act="qmore" data-n="${n}" data-a="${v[0]}" aria-label="${tx('More', 'மேலும்')}">${icon('more')}</button></div></div>`).join('')}${nav}${qFocus(d)}`;
}

/* ---------- Hadith ---------- */
function viewHadith() {
  const bx = cget('data/hadith/index.json');
  if (!bx) return backBar('moreback') + cwait('data/hadith/index.json');
  if (!H.b) return backBar('moreback') + `<div class="card list">${bx.map((b) => `<button class="lrow" data-act="hbook" data-id="${b.id}"><span class="li">📜</span><span class="lt"><b>${cesc(hbTitle(b))}</b><small>${b.have} ${tx('hadith', 'ஹதீஸ்கள்')}${b.have < b.total ? ' / ' + b.total : ''}</small></span><span class="lc">›</span></button>`).join('')}</div>
    ${S.lang === 'en' ? '<div class="card amber"><b>Hadith text is in Tamil.</b><br>The hadith in this app come from the Tamil editions (TNTJ). An English translation is not in our data yet. Use the hadith number to look it up in any English edition of Bukhari or Muslim.</div>' : ''}
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
  return backBar('hback') + `<div class="card hero small"><div class="hn">${cesc(hbTitle(b))}</div><div class="ht">${n}</div></div>
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
  if (act === 'qopen') { Q.s = +a.dataset.n; Q.focus = null; return go(); }
  if (act === 'qgo') { Q.s = +a.dataset.n; Q.focus = +a.dataset.a || null; Q.bm = false; render(); if (!Q.focus) window.scrollTo(0, 0); return true; }
  if (act === 'qbmview') { Q.bm = true; return go(); }
  if (act === 'qbmback') { Q.bm = false; return go(); }
  if (act === 'qbm') {
    const k = bmKey(+a.dataset.n, +a.dataset.a), L = S.bm || (S.bm = []), i = L.indexOf(k);
    if (i >= 0) L.splice(i, 1); else L.push(k);
    save(); a.setAttribute('aria-pressed', i < 0);
    if (i >= 0) toast(tx('Bookmark removed', 'குறிப்பான் நீக்கப்பட்டது'), { label: tx('Undo', 'திரும்பப் பெறு'), fn: () => { const l2 = S.bm || (S.bm = []); if (!l2.includes(k)) l2.push(k); save(); a.setAttribute('aria-pressed', 'true'); if (Q.bm) go(); } });
    else toast(tx('Bookmarked ✓', 'சேமிக்கப்பட்டது ✓'));
    return true;
  }
  if (act === 'qshare') { qShare(+a.dataset.n, +a.dataset.a); return true; }
  if (act === 'qmore') {
    const n = +a.dataset.n, v = +a.dataset.a;
    sheet(surahName(n) + ' ' + n + ':' + v, [
      { icon: 'share', label: tx('Share', 'பகிர்'), fn: () => qShare(n, v) },
      { icon: 'copy', label: tx('Copy verse', 'வசனத்தை நகலெடு'), fn: () => qCopy(n, v) },
      { icon: 'play', label: tx('Play from this verse', 'இந்த வசனத்திலிருந்து ஒலிக்கச் செய்'), fn: () => { if (typeof quranPlay === 'function') { const all = [...document.querySelectorAll('.ay')].map((e) => +e.dataset.a); quranPlay(n, v, Math.max(...all), false); } } }
    ]);
    return true;
  }
  if (act === 'qplaysurah') { if (typeof quranPlay === 'function') { const all = [...document.querySelectorAll('.ay')].map((e) => +e.dataset.a); quranPlay(+a.dataset.n, 1, Math.max(...all), false); } return true; }
  if (act === 'qback') { Q.s = null; return go(); }
  if (act === 'qen') { S.qen = a.checked; save(); render(); return true; }
  if (act === 'qta') { S.qta = a.checked; save(); render(); return true; }
  if (act === 'hbook') { H.b = a.dataset.id; H.n = 1; return go(); }
  if (act === 'hadref') {
    H.from = { tab, praySub, moreSub, duaOpen, akSet };
    H.b = a.dataset.b; H.n = +a.dataset.n; tab = 'more'; moreSub = 'hadith';
    return go();
  }
  if (act === 'hback') {
    H.b = null;
    if (H.from) { ({ tab, praySub, moreSub, duaOpen, akSet } = H.from); H.from = null; }
    return go();
  }
  if (act === 'hgo') { H.n = Math.max(1, +a.dataset.n || 1); return go(); }
  if (act === 'hjump') { const v = +(document.getElementById('hn') || {}).value; if (v > 0) { H.n = v; return go(); } return true; }
  if (act === 'cour') { C.id = a.dataset.id; return go(); }
  if (act === 'courback') { C.id = null; return go(); }
  return false;
}
/* share a verse: Arabic + translation + reference */
function qVerseText(n, a) {
  const d = CJ['data/quran/' + n + '.json'], v = ayText(d, a); if (!v) return '';
  const tr = S.lang === 'en' ? (v[4] || v[2]) : (v[2] || v[4]);
  return '\uFD3F' + v[1] + '\uFD3E\n' + (tr || '') + '\n- ' + tx('Quran', 'குர்ஆன்') + ' ' + n + ':' + a + ' (' + surahName(n) + ')\nISNAD';
}
function qCopy(n, a) {
  const txt = qVerseText(n, a); if (!txt) return;
  try { navigator.clipboard.writeText(txt).then(() => toast(tx('Copied ✓', 'நகலெடுக்கப்பட்டது ✓'))).catch(() => toast(tx('Could not copy', 'நகலெடுக்க முடியவில்லை'))); } catch (e) { toast(tx('Could not copy', 'நகலெடுக்க முடியவில்லை')); }
}
function qShare(n, a) {
  const txt = qVerseText(n, a); if (!txt) return;
  try { if (navigator.share) { navigator.share({ text: txt }).catch(() => {}); return; } } catch (e) {}
  try { navigator.clipboard.writeText(txt).then(() => toast(tx('Copied ✓', 'நகலெடுக்கப்பட்டது ✓'))).catch(() => toast(tx('Could not share', 'பகிர முடியவில்லை'))); } catch (e) { toast(tx('Could not share', 'பகிர முடியவில்லை')); }
}
/* verse search over all 114 surahs (packed data, works offline; loaded once on first search) */
const QS = { all: null, p: null, t: 0 };
const normAr = (s) => String(s || '').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '').replace(/[\u0671\u0622\u0623\u0625]/g, '\u0627').replace(/\u0649/g, '\u064A').toLowerCase();
function qLoadAll() {
  if (QS.p) return QS.p;
  QS.p = (async () => {
    const out = new Array(114);
    let next = 1;
    const worker = async () => { while (next <= 114) { const n = next++; try { const r = await fetch('data/quran/' + n + '.json'); out[n - 1] = await r.json(); } catch (e) { out[n - 1] = null; } } };
    await Promise.all([worker(), worker(), worker(), worker(), worker(), worker()]);
    QS.all = out; return out;
  })();
  return QS.p;
}
async function qSearch(q) {
  const box = document.getElementById('qres'); if (!box) return;
  q = normAr(q.trim());
  if (q.length < 3) { box.innerHTML = ''; return; }
  box.innerHTML = '<p class="mute">' + tx('Searching…', 'தேடுகிறது…') + '</p>';
  const all = await qLoadAll(), mine = ++QS.t, res = [];
  outer: for (let i = 0; i < 114; i++) { const d = all[i]; if (!d) continue; for (const v of d.v) {
    if (normAr(v[1]).includes(q) || normAr(v[2]).includes(q) || normAr(v[4]).includes(q)) { res.push([i + 1, v]); if (res.length >= 40) break outer; }
  } }
  if (mine !== QS.t || !document.getElementById('qres')) return;
  const ix = CJ['data/quran/index.json'];
  const sn = (v) => { const t = S.lang === 'en' ? (v[4] || v[2] || '') : (v[2] || v[4] || ''); return t.length > 130 ? t.slice(0, 127) + '...' : t; };
  document.getElementById('qres').innerHTML = res.length ? '<div class="card list">' + res.map(([n, v]) => `<button class="lrow" data-act="qgo" data-n="${n}" data-a="${v[0]}"><span class="li num">${n}:${v[0]}</span><span class="lt"><b>${cesc(surahName(n, ix))}</b><small>${cesc(sn(v))}</small></span><span class="lc">›</span></button>`).join('') + '</div>' + (res.length >= 40 ? '<p class="mute">' + tx('Showing the first 40 matches.', 'முதல் 40 முடிவுகள் காட்டப்படுகின்றன.') + '</p>' : '') : '<p class="mute">' + tx('No verses found.', 'வசனங்கள் எதுவும் இல்லை.') + '</p>';
}
document.addEventListener('change', (e) => { if (e.target && e.target.id === 'qrec') { S.rec = e.target.value; save(); if (typeof voiceStop === 'function') voiceStop(); } });
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'qvs') { clearTimeout(QS.d); const v = e.target.value; QS.d = setTimeout(() => qSearch(v), 350); }
  else if (e.target && e.target.id === 'qsearch') {
    const f = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#qlist .lrow').forEach((r) => { r.style.display = !f || r.dataset.name.includes(f) ? '' : 'none'; });
  }
});

/* Every Bukhari / Muslim reference in the text becomes a link that opens that hadith from the packed API data.
   Muslim is linked only where the Tamil-edition (API) number is given: "Muslim 598 (API 1049)". */
function linkRefs(root) {
  const re = /(Bukhari|புகாரி|Muslim|முஸ்லிம்)((?: \d+)?(?:, \d+)*)(?: \(API (\d+)\))?/g;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
  while (w.nextNode()) {
    const t = w.currentNode;
    if (!/(Bukhari|புகாரி|Muslim|முஸ்லிம்)/.test(t.nodeValue) || t.parentElement.closest('a,button,textarea,script,style,input,.ar,.arq')) continue;
    todo.push(t);
  }
  todo.forEach((t) => {
    const s = t.nodeValue; let last = 0, m, hit = false; const f = document.createDocumentFragment();
    const add = (x) => { if (x) f.appendChild(document.createTextNode(x)); };
    const link = (label, b, n) => { const a = document.createElement('a'); a.className = 'aref'; a.dataset.act = 'hadref'; a.dataset.b = b; a.dataset.n = n; a.textContent = label; f.appendChild(a); hit = true; };
    re.lastIndex = 0;
    while ((m = re.exec(s))) {
      add(s.slice(last, m.index)); last = re.lastIndex;
      const bk = /Bukhari|புகாரி/.test(m[1]);
      if (bk && m[2].trim()) {
        add(m[1] + ' ');
        m[2].trim().split(', ').forEach((n, i) => { if (i) add(', '); link(n, 'bukhari', n); });
      } else if (!bk && m[3]) {
        add(m[1] + (m[2] ? m[2] : '') + ' ');
        link('(API ' + m[3] + ')', 'muslim', m[3]);
      } else add(m[0]);
    }
    if (!hit) return;
    add(s.slice(last)); t.parentNode.replaceChild(f, t);
  });
}

/* remember where the person stopped reading (first verse near the top of the screen) */
let _lrT = 0;
window.addEventListener('scroll', () => {
  if (!Q.s) return; clearTimeout(_lrT);
  _lrT = setTimeout(() => {
    const rows = document.querySelectorAll('.ay[data-a]'); let best = null;
    rows.forEach((r) => { const t = r.getBoundingClientRect().top; if (!best && t >= 40) best = r; });
    if (best) { S.last = { s: Q.s, a: +best.dataset.a }; save(); }
  }, 500);
}, { passive: true });
