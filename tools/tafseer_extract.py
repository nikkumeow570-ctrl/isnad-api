"""Tafseer.pdf (Latha CID font + visual-order Arabic) -> articles/tafseer.json"""
import sys, re, json, unicodedata
sys.path.insert(0, __file__.rsplit('/', 1)[0])
import pdfplumber, tholugai_extract as T

AR = re.compile(r'[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]')

def fix_arabic_runs(s):
    out, run = [], []
    def flush():
        if run:
            t = unicodedata.normalize('NFKC', ''.join(run)).replace('ـ', '')
            out.append(t[::-1].strip()); run.clear()
    for ch in s:
        if AR.match(ch) or (run and ch in ' ،'):
            run.append(ch)
        else:
            flush(); out.append(ch)
    flush()
    return ''.join(out)

def page_lines(pg):
    L, cur, px = [], [], None
    for c in pg.chars:
        if cur and (c['x0'] < px - 8 or abs(c['top'] - cur[-1]['top']) > 9):
            L.append(cur); cur = []
        cur.append(c); px = c['x0']
    if cur: L.append(cur)
    res = []
    for l in L:
        t = ''.join(T.CID.get(int(re.findall(r'\d+', c['text'])[0]), '') if c['text'].startswith('(cid:') else c['text'] for c in l)
        t = fix_arabic_runs(T.fix_tamil(t))
        t = re.sub(r'\s+', ' ', t).strip()
        if t and not re.fullmatch(r'தஃப்ஸீர் \d+.*', t): res.append(t)
    return res

def main(pdf, repo):
    pages = []
    with pdfplumber.open(pdf) as p:
        for i, pg in enumerate(p.pages, 1):
            pages.append({'page': i, 'lines': page_lines(pg)})
    secs = [{'page': p['page'], 'text': '\n'.join(p['lines'])} for p in pages]
    art = {'id': 'tafseer', 'title': 'தஃப்ஸீர் – குர்ஆன் விரிவுரை (முன்னுரை)',
           'title_english': 'Tafseer – Quran Explanation Course (introduction and word meanings)',
           'kind': 'course', 'language': 'Tamil and Arabic',
           'quality_note': 'Extracted from a PDF with a legacy Tamil font; Tamil is decoded by glyph mapping and Arabic is re-ordered automatically. Some table rows may be out of order or contain small errors. Check against the PDF for critical use.',
           'sections': secs}
    json.dump(art, open(f'{repo}/articles/tafseer.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    ip = f'{repo}/articles/index.json'
    idx = json.load(open(ip, encoding='utf8'))
    idx['articles'] = [a for a in idx['articles'] if a['id'] != 'tafseer']
    idx['articles'].append({'id': 'tafseer', 'title': art['title'], 'title_english': art['title_english'], 'sections': len(secs), 'path': 'articles/tafseer.json'})
    json.dump(idx, open(ip, 'w', encoding='utf8'), ensure_ascii=False, indent=2)
    print(len(secs), 'pages')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
