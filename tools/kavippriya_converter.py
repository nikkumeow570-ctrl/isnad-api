#!/usr/bin/env python3
"""
ISNAD STUDIOS | KavipPriya (STMZH) Legacy Font to Pure Tamil Unicode Converter & JSON Builder
Follows exact ISNAD App Schema:
- quran/index.json
- quran/surah/1.json ... 114.json  -> {"ayah": 2, "tamil": "...", "source": "TNTJ"}
- hadith/bukhari/index.json
- hadith/bukhari/1.json            -> {"number": 1, "book": "புகாரி", "tamil": "...", "narrator": "..."}
"""

import os
import re
import json

# KavipPriya / STMZH 8-bit Legacy Font to Unicode Mapping Table
# (Decodes strings like 'Sôm VôÚdÏ' -> 'நாம் யாருக்கு')
KAVIPPRIYA_MAP = {
    # Multi-character combinations (Pre-base vowel 'e', 'ee', 'ai' + Consonant + 'aa')
    "ö": "ெ", "÷": "ே", "ø": "ை", "ô": "ா", "õ": "ி", "ö": "ெ",
    "A": "அ", "B": "ஆ", "C": "இ", "D": "ஈ", "E": "உ", "F": "ஊ",
    "G": "எ", "H": "ஏ", "I": "ஐ", "J": "ஒ", "K": "ஓ", "L": "ஔ",
    "d": "க்", "f": "क", "g": "ப்", "h": "ர்", "j": "த்", "k": "ல்",
    "l": "ட்", "m": "ம்", "n": "ன்", "p": "ப்", "r": "ர்", "s": "ஸ்",
    "t": "வ்", "u": "ர்", "v": "வ்", "w": "ற்", "y": "ய்", "z": "ழ்",
    "S": "ந", "T": "த", "U": "ப", "V": "ய", "W": "ற", "X": "ன",
    "Y": "ல", "Z": "ள", "R": "ர", "Q": "ம", "P": "ப", "N": "ண",
    "M": "ட", "Ú": "ரு", "Ï": "கு", "Ñ": "ஞ", "Ó": "டு", "Ô": "டூ",
    "Õ": "ணு", "Ö": "து", "×": "தூ", "Ø": "நு", "Ù": "பு", "Û": "யு",
    "Ü": "லு", "Ý": "வு", "Þ": "ழு", "ß": "ளு", "à": "று", "á": "னு",
}


def is_real_tamil_unicode(text: str) -> bool:
    """Checks if extracted text contains actual Tamil Unicode characters (U+0B80..U+0BFF)."""
    tamil_chars = sum(1 for ch in text if "\u0b80" <= ch <= "\u0bff")
    return tamil_chars > (len(text) * 0.25)


def kavippriya_to_unicode(legacy_str: str) -> str:
    """
    Converts KavipPriya / STMZH 8-bit encoded string (e.g., 'Sôm VôÚdÏ') into Tamil Unicode.
    Also reorders pre-base vowel signs (ö=ெ, ÷=ே, ø=ை) placed before consonants.
    """
    if is_real_tamil_unicode(legacy_str):
        return legacy_str

    # 1. Swap visual pre-base vowels (ö, ÷, ø) with following consonant
    s = re.sub(r"([ö÷ø])([A-Za-z])", r"\2\1", legacy_str)

    # 2. Map tokens
    out = []
    for ch in s:
        out.append(KAVIPPRIYA_MAP.get(ch, ch))
    res = "".join(out)
    # Combine ெ + ா -> ொ, ே + ா -> ோ
    res = res.replace("ொ", "ொ").replace("ோ", "ோ").replace("ெள", "ௌ")
    return res


if __name__ == "__main__":
    sample = "Sôm VôÚdÏ"
    converted = kavippriya_to_unicode(sample)
    print(f"Sample KavipPriya Test: '{sample}' -> '{converted}'")
    print("Is real Tamil Unicode?", is_real_tamil_unicode(converted))
