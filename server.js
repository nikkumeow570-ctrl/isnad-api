'use strict';
// ISNAD API - zero-dependency Node server serving the JSON files in /quran and /hadith.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

function readJson(...parts) {
  const file = path.join(ROOT, ...parts);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
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
        'GET /api/hadith/bukhari',
        'GET /api/hadith/bukhari/:number',
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
    const verse = (surah.verses || []).find((v) => v.ayah === +b);
    if (!verse) return [404, { error: `Ayah ${b} not found in surah ${a}` }];
    return [200, { surah: surah.surah, name: surah.name, source: surah.source, ...verse }];
  }

  if (kind === 'hadith' && a === 'bukhari') {
    if (!b) {
      const idx = readJson('hadith', 'bukhari', 'index.json');
      return idx ? [200, idx] : [500, { error: 'Hadith index missing' }];
    }
    if (!isPosInt(b)) return [400, { error: 'hadith number must be a positive integer' }];
    const h = readJson('hadith', 'bukhari', `${b}.json`);
    if (!h) return [404, { error: `Hadith ${b} is not available yet` }];
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
        if (v.tamil && v.tamil.includes(q)) results.push({ type: 'quran', surah: s.surah, ayah: v.ayah, tamil: v.tamil });
      }
    }
    const hDir = path.join(ROOT, 'hadith', 'bukhari');
    for (const f of fs.existsSync(hDir) ? fs.readdirSync(hDir) : []) {
      if (f === 'index.json') continue;
      const h = readJson('hadith', 'bukhari', f);
      if (h && h.tamil && h.tamil.includes(q)) results.push({ type: 'hadith', book: h.book, number: h.number, narrator: h.narrator, tamil: h.tamil });
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
