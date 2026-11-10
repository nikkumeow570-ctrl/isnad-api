'use strict';
const assert = require('assert');
const server = require('./server');

async function get(base, p) {
  const r = await fetch(base + p);
  return [r.status, await r.json()];
}

server.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  try {
    assert.strictEqual((await get(base, '/health'))[0], 200);
    let [s, j] = await get(base, '/api/quran');
    assert.strictEqual(s, 200); assert.strictEqual(j.total_surahs, 114);
    [s, j] = await get(base, '/api/quran/1');
    assert.strictEqual(s, 200); assert.strictEqual(j.verses.length, 7);
    [s, j] = await get(base, '/api/quran/1/2');
    assert.strictEqual(s, 200); assert.strictEqual(j.ayah, 2);
    assert.strictEqual((await get(base, '/api/quran/1/99'))[0], 404);
    assert.strictEqual((await get(base, '/api/quran/200'))[0], 400);
    assert.strictEqual((await get(base, '/api/quran/../server.js'))[0] >= 400, true);
    assert.strictEqual((await get(base, '/api/hadith/bukhari'))[1].total_hadiths, 7563);
    [s, j] = await get(base, '/api/hadith/bukhari/1');
    assert.strictEqual(s, 200); assert.strictEqual(j.number, 1);
    assert.strictEqual((await get(base, '/api/hadith/bukhari/abc'))[0], 400);
    [s, j] = await get(base, '/api/search?q=' + encodeURIComponent('அல்லாஹ்'));
    assert.strictEqual(s, 200); assert.ok(j.count > 0);
    console.log('All tests passed');
    process.exit(0);
  } catch (e) { console.error(e); process.exit(1); }
});
