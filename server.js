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
        'GET /api/quran/:surah/:ayah',
        'GET /api/hadith',
        'GET /api/hadith/:book            (bukhari, muslim, abudawud, riyadussalihin, shamail)',
        'GET /api/hadith/:book/:number',
        'GET /api/hadith/muslim/intro/:number',
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
    if (!isPosInt(b)) return [400, { error: 'ayah must be a positive integer' }];
    // The TNTJ/PJ translation sometimes translates several ayahs as one block (ayah..ayah_end).
    const n = +b;
    const verse = (surah.verses || []).find((v) => v.ayah <= n && n <= (v.ayah_end || v.ayah));
    if (!verse) return [404, { error: `Ayah ${b} not found in surah ${a}` }];
    return [200, { surah: surah.surah, name: surah.name, source: surah.source, requested_ayah: n, ...verse }];
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
    return [200, { query: q, count: results.length, results: results.slice(0, 50) }];
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
