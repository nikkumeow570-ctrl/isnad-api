'use strict';
// ISNAD API - zero-dependency Node server serving the JSON files in /quran and /hadith.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const cache = new Map();
function readJson(...parts) {
  const file = path.join(ROOT, ...parts);
  if (cache.has(file)) return cache.get(file);
  let data = null;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    data = null;
  }
  if (data) cache.set(file, data);
  return data;
}

function send(res, status, body) {
  const data = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=300',
  });
  res.end(data);
}

const prayer = require('./prayer/prayertimes.js');
const isPosInt = (s) => /^[1-9]\d{0,5}$/.test(s);

function route(url) {
  const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);

  if (parts.length === 0) {
    return [200, {
      name: 'ISNAD API',
      version: '1.0.0',
      endpoints: [
        'GET /health',
        'GET /api/quran',
        'GET /api/quran/:surah',
        'GET /api/quran/:surah/:ayah      (Tamil + Arabic)',
        'GET /api/quran/:surah/arabic     (whole surah, Uthmani + simple)',
        'GET /api/quran/:surah/english    (Pickthall + Yusuf Ali)',
        'GET /api/hadith',
        'GET /api/hadith/:book            (bukhari, muslim, abudawud, riyadussalihin, shamail, lulu)',
        'GET /api/hadith/:book/:number',
        'GET /api/hadith/muslim/intro/:number',
        'GET /api/dua                     (collections of duas and a supplication article)',
        'GET /api/dua/:collection',
        'GET /api/dua/:collection/:number',
        'GET /api/articles                (reference articles, e.g. hadith classification)',
        'GET /api/articles/:id',
        'GET /api/prayer?lat=&lng=&tz=5.5&date=YYYY-MM-DD&method=mwl|karachi|isna|egypt|makkah&asr=shafi|hanafi  (prayer times + qibla)',
        'GET /api/search?q=<text>',
      ],
    }];
  }
  if (parts[0] === 'health') return [200, { status: 'ok' }];
  if (parts[0] !== 'api') return [404, { error: 'Not found' }];

  const [, kind, a, b] = parts;

  if (kind === 'quran') {
    if (!a) {
      const idx = readJson('quran', 'index.json');
      return idx ? [200, idx] : [500, { error: 'Quran index missing' }];
    }
    if (!isPosInt(a) || +a > 114) return [400, { error: 'surah must be 1-114' }];
    const surah = readJson('quran', 'surah', `${a}.json`);
    if (!surah) return [404, { error: `Surah ${a} is not available yet` }];
    if (!b) return [200, surah];
    if (b === 'arabic') {
      const ar = readJson('quran', 'arabic', `${a}.json`);
      return ar ? [200, ar] : [404, { error: `Arabic text for surah ${a} is not available` }];
    }
    if (b === 'english') {
      const en = readJson('quran', 'english', `${a}.json`);
      return en ? [200, en] : [404, { error: `English text for surah ${a} is not available` }];
    }
    if (!isPosInt(b)) return [400, { error: 'ayah must be a positive integer' }];
    // The TNTJ/PJ translation sometimes translates several ayahs as one block (ayah..ayah_end).
    const n = +b;
    const verse = (surah.verses || []).find((v) => v.ayah <= n && n <= (v.ayah_end || v.ayah));
    if (!verse) return [404, { error: `Ayah ${b} not found in surah ${a}` }];
    const ar = readJson('quran', 'arabic', `${a}.json`);
    const av = ar && ar.verses.find((v) => v.ayah === n);
    const en = readJson('quran', 'english', `${a}.json`);
    const english = {};
    for (const [k, t] of Object.entries((en && en.translations) || {})) { const ev = t.verses.find((v) => v.ayah === n); if (ev) english[k] = ev.text; }
    return [200, { surah: surah.surah, name: surah.name, source: surah.source, requested_ayah: n, ...(av ? { arabic: av.uthmani, arabic_simple: av.simple } : {}), english, ...verse }];
  }

  if (kind === 'hadith') {
    const books = fs.readdirSync(path.join(ROOT, 'hadith'), { withFileTypes: true })
      .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, 'hadith', d.name, 'index.json'))).map((d) => d.name);
    if (!a) return [200, { books: books.map((id) => { const i = readJson('hadith', id, 'index.json'); return { id, book: i.book, total_hadiths: i.total_hadiths, available: i.available }; }) }];
    if (!books.includes(a)) return [404, { error: `Unknown hadith book '${a}'`, books }];
    if (!b) return [200, readJson('hadith', a, 'index.json')];
    // an introduction/ side series that is numbered separately (Muslim's muqaddima)
    const sub = b === 'intro' ? 'intro' : null;
    const num = sub ? parts[4] : b;
    if (sub && !num) return [400, { error: 'give an introduction hadith number, e.g. /api/hadith/muslim/intro/1' }];
    if (!isPosInt(num)) return [400, { error: 'hadith number must be a positive integer' }];
    const h = sub ? readJson('hadith', a, 'intro', `${num}.json`) : readJson('hadith', a, `${num}.json`);
    if (!h) return [404, { error: `Hadith ${num} is not available in ${a}${sub ? ' introduction' : ''}` }];
    return [200, h];
  }

  if (kind === 'dua') {
    const idx = readJson('dua', 'index.json');
    if (!idx) return [500, { error: 'Dua index missing' }];
    if (!a) return [200, idx];
    if (!idx.collections.some((c) => c.id === a)) return [404, { error: `Unknown dua collection '${a}'`, collections: idx.collections.map((c) => c.id) }];
    const col = readJson('dua', `${a}.json`);
    if (!b) return [200, col];
    if (!isPosInt(b)) return [400, { error: 'item number must be a positive integer' }];
    const item = col.items.find((x) => x.number === +b);
    return item ? [200, { collection: a, collection_title: col.title, ...item }] : [404, { error: `Item ${b} not found in ${a}` }];
  }

  if (kind === 'articles') {
    const idx = readJson('articles', 'index.json');
    if (!a) return [200, idx];
    if (!idx.articles.some((x) => x.id === a)) return [404, { error: `Unknown article '${a}'`, articles: idx.articles.map((x) => x.id) }];
    return [200, readJson('articles', `${a}.json`)];
  }

  if (kind === 'prayer') {
    const q = url.searchParams, num = (k, d) => (q.get(k) == null || q.get(k) === '' ? d : Number(q.get(k)));
    const lat = num('lat'), lng = num('lng'), tz = num('tz', 5.5);
    if (![lat, lng, tz].every(Number.isFinite) || Math.abs(lat) > 66 || Math.abs(lng) > 180 || Math.abs(tz) > 14)
      return [400, { error: 'lat (-66..66) and lng (-180..180) are required; tz is hours from UTC (default 5.5)' }];
    const ds = q.get('date') || new Date(Date.now() + tz * 3600e3).toISOString().slice(0, 10);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ds);
    if (!m) return [400, { error: 'date must be YYYY-MM-DD' }];
    const method = q.get('method') || 'mwl', asr = q.get('asr') || 'shafi';
    if (!prayer.METHODS[method]) return [400, { error: 'method must be one of ' + Object.keys(prayer.METHODS).join(', ') }];
    if (!['shafi', 'hanafi'].includes(asr)) return [400, { error: 'asr must be shafi or hanafi' }];
    const opts = { method, asr, fajrAngle: q.get('fajr') != null ? num('fajr') : undefined, ishaAngle: q.get('isha') != null ? num('isha') : undefined };
    const r = prayer.day(+m[1], +m[2], +m[3], lat, lng, tz, opts);
    delete r.raw;
    return [200, { ...r, qibla_degrees: Math.round(prayer.qibla(lat, lng) * 10) / 10, methods: prayer.METHODS }];
  }

  if (kind === 'search') {
    const q = (url.searchParams.get('q') || '').trim();
    if (q.length < 2) return [400, { error: 'q must be at least 2 characters' }];
    const results = [];
    const surahDir = path.join(ROOT, 'quran', 'surah');
    for (const f of fs.existsSync(surahDir) ? fs.readdirSync(surahDir) : []) {
      const s = readJson('quran', 'surah', f);
      for (const v of (s && s.verses) || []) {
        if (v.tamil && v.tamil.includes(q)) results.push({ type: 'quran', surah: s.surah, ayah: v.ayah, ayah_end: v.ayah_end, tamil: v.tamil });
      }
    }
    for (const bk of fs.readdirSync(path.join(ROOT, 'hadith'))) {
      const hDir = path.join(ROOT, 'hadith', bk);
      for (const f of fs.existsSync(hDir) ? fs.readdirSync(hDir) : []) {
        if (f === 'index.json' || !f.endsWith('.json')) continue;
        const h = readJson('hadith', bk, f);
        if (h && h.tamil && h.tamil.includes(q)) results.push({ type: 'hadith', book_id: bk, book: h.book, number: h.number, narrator: h.narrator, tamil: h.tamil });
      }
    }
    const aIdx = readJson('articles', 'index.json');
    for (const ar of (aIdx && aIdx.articles) || []) {
      const doc = readJson('articles', `${ar.id}.json`);
      for (const sec of doc.sections) {
        const title = sec.heading || sec.title || sec.title_tamil || '';
        const hit = (sec.blocks || []).find((b) => b.text.includes(q));
        const text = sec.text || '';
        const at = text.indexOf(q);
        if (title.includes(q) || hit || at >= 0 || JSON.stringify(sec).includes(q)) {
          const snippet = hit ? hit.text : at >= 0 ? text.slice(Math.max(0, at - 60), at + 140) : undefined;
          results.push({ type: 'article', article: ar.id, section: sec.number || sec.section_id, title, tamil: snippet });
        }
      }
    }
    const dIdx = readJson('dua', 'index.json');
    for (const c of (dIdx && dIdx.collections) || []) {
      const col = readJson('dua', `${c.id}.json`);
      for (const it of col.items) {
        const body = [it.title, it.tamil, it.text].filter(Boolean).join('\n');
        if (body.includes(q)) results.push({ type: 'dua', collection: c.id, number: it.number, title: it.title, tamil: it.tamil || it.text });
      }
    }
    const counts = {}; const shown = {};
    for (const r of results) counts[r.type] = (counts[r.type] || 0) + 1;
    const limited = results.filter((r) => (shown[r.type] = (shown[r.type] || 0) + 1) <= 20);      // at most 20 per type so every type is visible
    return [200, { query: q, count: results.length, counts, results: limited }];
  }

  return [404, { error: 'Not found' }];
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    });
    return res.end();
  }
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/live' || url.pathname === '/live/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      return fs.createReadStream(path.join(ROOT, 'live', 'index.html')).pipe(res);
    }
    const img = /^\/api\/articles\/images\/([a-z0-9-]+)\/(\d{2})\.png$/.exec(url.pathname);
    if (img) {
      const f = path.join(ROOT, 'articles', 'images', img[1], img[2] + '.png');
      if (!fs.existsSync(f)) return send(res, 404, { error: 'Image not found' });
      res.writeHead(200, { 'Content-Type': 'image/png', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=86400' });
      return fs.createReadStream(f).pipe(res);
    }
    const [status, body] = route(url);
    send(res, status, body);
  } catch (e) {
    send(res, 500, { error: 'Internal server error' });
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`ISNAD API listening on :${PORT}`));
}
module.exports = server;
