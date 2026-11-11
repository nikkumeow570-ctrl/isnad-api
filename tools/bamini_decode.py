"""
Decoder for the legacy "T_Sarukesi / SarukesiRegular" (Bamini-layout) Tamil font used in the
Sahih Bukhari Tamil 7-volume PDF.  The table was read from the glyph outlines embedded in that
PDF and confirmed on real words (e.g. 'E}W' = நூறு, 'g+kpapy;' = பூமியில், '`{iuuh' = ஹுரைரா).
"""
import re

CONS = dict(zip("fqrQlzjegkauytoswd[\\]`",
                ["க","ங","ச","ஞ","ட","ண","த","ந","ப","ம","ய","ர","ல","வ","ழ","ள","ற","ன","ஜ","ஷ","ஸ","ஹ"]))
# consonant + ு ligature glyphs
U = {"F":"கு","Z":"ணு","G":"பு","J":"து","K":"மு","L":"டு","R":"சு","T":"வு","U":"ரு","W":"று","Y":"லு",
     "E":"நு","D":"னு","A":"யு","S":"ளு","O":"ழு"}
# consonant + ூ glyphs and other ready-made ligatures
LIG = {"#":"சூ","$":"கூ","%":"மூ","&":"ரூ","@":"ளூ","B":"டீ","b":"டி","^":"டூ","\u00a1":"ணீ","\u00a5":"வூ",
       "\u00aa":"ஸீ","\u00bb":"ஷி","\u00e5":"யூ","H":"ர்"}
VOW = {",":"இ","<":"ஈ","c":"உ","C":"ஊ","m":"அ","M":"ஆ","v":"எ","V":"ஏ","I":"ஐ","x":"ஒ","X":"ஓ","/":"ஃ"}
POST = {"h":"\u0bbe","p":"\u0bbf","P":"\u0bc0"}   # ா ி ீ  follow the consonant
PRE = {"n":"\u0bc6","N":"\u0bc7","i":"\u0bc8"}     # ெ ே ை  are typed BEFORE the consonant
PUNCT = {">":",","'":"\u2018","!":"!","(":"(",")":")","-":"-",".":".",":":":","?":"?"," ":" "}
PASS = set("0123456789\u2018\u2019\u201c\u201d\u201e\u2013\u2020")

def decode(s):
    """Decode one run of legacy-font text. Returns (unicode, set_of_unknown_chars)."""
    out, unk, i, n, pre = [], set(), 0, len(s), None
    def put(t):
        nonlocal pre
        if pre: out.append(t[0] + pre + t[1:]); pre = None
        else: out.append(t)
    while i < n:
        ch = s[i]; i += 1
        if ch in PRE: pre = PRE[ch]
        elif ch in CONS:
            if i < n and s[i] == ";": put(CONS[ch] + "\u0bcd"); i += 1
            else: put(CONS[ch])
        elif ch in U: put(U[ch])
        elif ch in LIG: put(LIG[ch])
        elif ch == ";":                                        # pulli after a ligature; a 2nd ";" after a pulli is a real semicolon
            out.append(";" if out and out[-1].endswith("\u0bcd") else "\u0bcd")
        elif ch == "}":                                        # turns the previous ு-glyph into ூ
            if out and out[-1].endswith("\u0bc1"): out[-1] = out[-1][:-1] + "\u0bc2"
            else: out.append("\u0bc2")
        elif ch == "*": out.append("\u0bc1" if out and out[-1].endswith("\u0bb9") else "*")   # "*" after ஹ stands for ு; elsewhere a real asterisk
        elif ch in "+_": out.append("\u0bc2")
        elif ch == "{": out.append("\u0bc1")
        elif ch in VOW: out.append(VOW[ch])
        elif ch in POST: out.append(POST[ch])
        elif ch in PUNCT: out.append(PUNCT[ch])
        elif ch in PASS: out.append(ch)
        else: out.append(ch); unk.add(ch)
    text = "".join(out)
    text = re.sub("\u0bc1{2,}", "\u0bc1", text)
    # old-style spelling: ரி ரீ ர் ரு ரூ are typed as ா + sign (அவா்கள் = அவர்கள், தொிவித்து = தெரிவித்து)
    text = re.sub("\u0bbe(?=[\u0bbf\u0bc0\u0bcd\u0bc1\u0bc2])", "\u0bb0", text)
    text = text.replace("\u0bc6\u0bbe", "\u0bca").replace("\u0bc7\u0bbe", "\u0bcb")      # ெ+ா=ொ  ே+ா=ோ
    # ெ + C + ள  ->  ௌ, but only when that ள is not itself a letter (தெளிவு, வெள்ளி keep their ள)
    text = re.sub("(?<=[\u0b95-\u0bb9])\u0bc6\u0bb3(?![\u0bcd\u0bbe-\u0bcc\u0bc6-\u0bc8])", "\u0bcc", text)
    return text, unk
