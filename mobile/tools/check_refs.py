"""Fails if any hadith reference shown in the app does not exist in the API data.
Checks every Bukhari number and every Muslim "(API n)" number in app.js / content.js against ../hadith."""
import re, os, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
src = ''.join(open(os.path.join(root, 'mobile', f), encoding='utf8').read() for f in ('app.js', 'content.js'))
bad = []
for m in re.finditer(r'(?:Bukhari|புகாரி) (\d+(?:, \d+)*)', src):
    for n in re.findall(r'\d+', m.group(1)):
        if not os.path.exists(os.path.join(root, 'hadith', 'bukhari', n + '.json')): bad.append('bukhari ' + n)
for n in set(re.findall(r'\(API (\d+)\)', src)):
    if not os.path.exists(os.path.join(root, 'hadith', 'muslim', n + '.json')): bad.append('muslim API ' + n)
banned = re.findall(r'(Abu Dawud|Tirmidhi|Nasai|Ibn Majah|அபூதாவூத்|திர்மிதீ|நஸாயீ|இப்னுமாஜா)', src)
if banned: bad.append('non-API book cited: ' + ', '.join(sorted(set(banned))))
if bad: print('FAIL', bad); sys.exit(1)
print('refs ok')
