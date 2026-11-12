"""Sarf / Ilakkanam PDFs: Sarukesi (Bamini layout) Tamil + Arabic presentation forms -> article sections."""
import sys, re, json, unicodedata
sys.path.insert(0, __file__.rsplit('/', 1)[0])
import pdfplumber
from bamini_decode import decode
AR = re.compile(r'[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]')

def arabic(s):
    t = unicodedata.normalize('NFKC', s).replace('ـ', '')
    return t[::-1]

def line_text(chars):
    parts, kind, buf = [], None, []
    def flush():
        if buf:
            s = ''.join(buf)
            parts.append(decode(s)[0] if kind == 'ta' else arabic(s) if kind == 'ar' else s)
            buf.clear()
    for c in chars:
        f = c['fontname']; t = c['text']
        k = 'ta' if ('Sarukesi' in f or 'Singari' in f) else 'ar' if ('Arabic' in f or 'Majidi' in f or AR.match(t)) else 'x'
        if k != kind: flush(); kind = k
        buf.append(t)
    flush()
    return re.sub(r'\s+', ' ', ' '.join(parts)).strip()

def pages(pdf):
    out = []
    with pdfplumber.open(pdf) as p:
        for i, pg in enumerate(p.pages, 1):
            L, cur, px = [], [], None
            for c in pg.chars:
                if cur and (c['x0'] < px - 8 or abs(c['top'] - cur[-1]['top']) > 9):
                    L.append(cur); cur = []
                cur.append(c); px = c['x0']
            if cur: L.append(cur)
            lines = [t for t in (line_text(l) for l in L) if t]
            out.append((i, lines))
    return out

if __name__ == '__main__':
    for i, ls in pages(sys.argv[1])[int(sys.argv[2]):int(sys.argv[3])]:
        print('=== page', i); print('\n'.join(ls[:30]))
