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
    [s, j] = await get(base, '/api/quran/2');
    assert.strictEqual(s, 200); assert.strictEqual(j.verses[j.verses.length - 1].ayah, 286);
    [s, j] = await get(base, '/api/quran/2/255');
    assert.strictEqual(s, 200); assert.ok(j.tamil.includes('வேறு யாருமில்லை'));
    [s, j] = await get(base, '/api/quran/114/3');   // inside a merged 1-4 block
    assert.strictEqual(s, 200); assert.strictEqual(j.ayah, 1); assert.strictEqual(j.ayah_end, 4); assert.strictEqual(j.requested_ayah, 3);
    for (let n = 1; n <= 114; n++) assert.strictEqual((await get(base, '/api/quran/' + n))[0], 200, 'surah ' + n);
    [s, j] = await get(base, '/api/quran/1/2');
    assert.strictEqual(s, 200); assert.strictEqual(j.ayah, 2);
    assert.strictEqual((await get(base, '/api/quran/1/99'))[0], 404);
    assert.strictEqual((await get(base, '/api/quran/200'))[0], 400);
    assert.strictEqual((await get(base, '/api/quran/../server.js'))[0] >= 400, true);
    assert.strictEqual((await get(base, '/api/hadith/bukhari'))[1].total_hadiths, 7563);
    [s, j] = await get(base, '/api/hadith/bukhari/1');
    assert.strictEqual(s, 200); assert.strictEqual(j.number, 1);
    assert.strictEqual((await get(base, '/api/hadith/bukhari/abc'))[0], 400);
    [s, j] = await get(base, '/api/quran/1/1');
    assert.strictEqual(s, 200); assert.ok(j.arabic.includes('بِسْمِ')); assert.ok(j.english.pickthall.includes('Allah'));
    [s, j] = await get(base, '/api/quran/1/english'); assert.strictEqual(s, 200); assert.strictEqual(j.translations.yusufali.verses.length, 7);
    [s, j] = await get(base, '/api/quran/1/1');
    [s, j] = await get(base, '/api/quran/114/arabic');
    assert.strictEqual(s, 200); assert.strictEqual(j.verses.length, 6);
    assert.strictEqual((await get(base, '/api/hadith'))[1].books.length, 6);
    assert.strictEqual((await get(base, '/api/hadith/muslim'))[1].total_hadiths, 5771);
    [s, j] = await get(base, '/api/hadith/muslim/1442');
    assert.strictEqual(s, 200); assert.strictEqual(j.chapter, 7);
    [s, j] = await get(base, '/api/hadith/muslim/intro/1');
    assert.strictEqual(s, 200); assert.strictEqual(j.part, 'introduction');
    assert.strictEqual((await get(base, '/api/hadith/muslim/3545'))[0], 404);
    assert.strictEqual((await get(base, '/api/hadith/nope'))[0], 404);
    [s, j] = await get(base, '/api/hadith/lulu/1');
    assert.strictEqual(s, 200); assert.strictEqual(j.grade, 'muttafaqun_alayhi'); assert.ok(j.bukhari_number > 0);
    assert.strictEqual((await get(base, '/api/hadith/lulu'))[1].available > 1800, true);
    assert.strictEqual((await get(base, '/api/hadith/lulu/60'))[0], 404);
    [s, j] = await get(base, '/api/articles/hadith-classification');
    assert.strictEqual(s, 200); assert.strictEqual(j.sections.length, 8);
    assert.strictEqual((await get(base, '/api/articles/nope'))[0], 404);
    [s, j] = await get(base, '/api/articles/orirai-kolgai');
    assert.strictEqual(s, 200); assert.strictEqual(j.sections.length, 100); assert.ok(j.sections[0].verses.length > 5);
    assert.strictEqual((await get(base, '/api/articles'))[1].articles.length, 8);
    [s, j] = await get(base, '/api/articles/tholugai-sattam');
    assert.strictEqual(s, 200); assert.ok(j.sections.length > 200);
    [s, j] = await get(base, '/api/search?q=' + encodeURIComponent('உளூ'));
    assert.ok(j.results.some((r) => r.type === 'article'));
    assert.strictEqual((await get(base, '/api/dua'))[1].collections.length, 5);
    [s, j] = await get(base, '/api/dua/thogupu-nabimozhi/1');
    assert.strictEqual(s, 200); assert.ok(j.arabic.length > 5);
    [s, j] = await get(base, '/api/dua/duas-authentic/1');
    assert.strictEqual(s, 200); assert.ok(j.references.length > 0);
    assert.strictEqual((await get(base, '/api/dua/nope'))[0], 404);
    assert.strictEqual((await get(base, '/api/dua/thogupu-quran/999'))[0], 404);
    [s, j] = await get(base, '/api/hadith/abudawud/220');
    assert.strictEqual(s, 200); assert.strictEqual(j.chapter, 86);
    assert.strictEqual((await get(base, '/api/hadith/abudawud/277'))[0], 404);
    [s, j] = await get(base, '/api/hadith/riyadussalihin/13');
    assert.strictEqual(s, 200); assert.deepStrictEqual(j.shared_with, [14]);
    [s, j] = await get(base, '/api/hadith/shamail/331');
    assert.strictEqual(s, 200); assert.ok(j.english.length > 20);
    [s, j] = await get(base, '/api/search?q=' + encodeURIComponent('அல்லாஹ்'));
    assert.strictEqual(s, 200); assert.ok(j.count > 0);
    [s, j] = await get(base, '/api/articles/tafseer');
    assert.strictEqual(s, 200); assert.strictEqual(j.sections.length, 30);
    [s, j] = await get(base, '/api/articles/sarf-tamil');
    assert.strictEqual(s, 200); assert.ok(j.sections.some((x) => x.text_pdf && x.text_pdf.includes('வேண்டும்')));
    [s, j] = await get(base, '/api/articles/tajweed-rules');
    assert.ok(j.sections[0].image.endsWith('/01.png'));
    console.log('All tests passed');
    process.exit(0);
  } catch (e) { console.error(e); process.exit(1); }
});
