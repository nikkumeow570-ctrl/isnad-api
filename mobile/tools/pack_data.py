"""Pack the isnad-api data (Quran, hadith, courses) into compact offline files under data/.
Usage: python3 tools/pack_data.py /path/to/isnad-api"""
import json, os, sys, shutil, glob
src = sys.argv[1]; out = 'data'
def rd(p): return json.load(open(os.path.join(src, p), encoding='utf8'))
def wr(p, o):
    p = os.path.join(out, p); os.makedirs(os.path.dirname(p), exist_ok=True)
    json.dump(o, open(p, 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
shutil.rmtree(out, ignore_errors=True)

# ---- Quran: one file per surah [ayah, arabic, tamil|null, ayah_end|0, english]
idx = []
for n in range(1, 115):
    t, a, e = rd(f'quran/surah/{n}.json'), rd(f'quran/arabic/{n}.json'), rd(f'quran/english/{n}.json')
    tm = {}
    for v in t['verses']: tm[v['ayah']] = v
    em = {v['ayah']: v['text'] for v in e['translations']['pickthall']['verses']}
    rows = []
    for v in a['verses']:
        x = tm.get(v['ayah'])
        rows.append([v['ayah'], v['uthmani'], x['tamil'] if x else None, (x.get('ayah_end') or 0) if x else 0, em.get(v['ayah'], '')])
    wr(f'quran/{n}.json', {'n': n, 'name': t.get('name', ''), 'ar': a['name_arabic'], 'v': rows})
qi = rd('quran/index.json')['surahs']
wr('quran/index.json', [[s['surah'], s['name'], s['meaning'], s['ayahs']] for s in qi])

# ---- Hadith: chunks of 100 numbers per file
books = []
for b in ['bukhari', 'muslim', 'lulu', 'abudawud', 'riyadussalihin', 'shamail']:
    ix = rd(f'hadith/{b}/index.json'); chunks = {}
    for f in glob.glob(os.path.join(src, f'hadith/{b}/*.json')):
        nm = os.path.basename(f)[:-5]
        if not nm.isdigit(): continue
        h = json.load(open(f, encoding='utf8')); n = int(nm)
        r = {'t': h.get('tamil', '')}
        if h.get('narrator'): r['nr'] = h['narrator']
        ch = h.get('chapter_title') or h.get('topic_title') or h.get('section') or ''
        if isinstance(ch, str) and ch: r['ch'] = ch
        if h.get('arabic'): r['ar'] = h['arabic']
        if h.get('english'): r['en'] = h['english']
        chunks.setdefault((n - 1) // 100, {})[n] = r
    for k, d in chunks.items(): wr(f'hadith/{b}/{k}.json', d)
    chs = [[c.get('chapter'), c.get('title') or c.get('topic_title') or '', c.get('start'), c.get('end')] for c in ix.get('chapters', [])]
    wr(f'hadith/{b}/ch.json', chs)
    books.append({'id': b, 'title': ix.get('book'), 'total': ix.get('total_hadiths'), 'have': ix.get('available')})
wr('hadith/index.json', books)

# ---- Courses (articles) + Tajweed slide images; drop duplicate whole-page dumps
ai = rd('articles/index.json'); wr('articles/index.json', ai)
for a in ai['articles']:
    d = rd(f"articles/{a['id']}.json"); d.pop('pages', None); wr(f"articles/{a['id']}.json", d)
shutil.copytree(os.path.join(src, 'articles/images'), os.path.join(out, 'articles/images'))
print('done')
