/* ISNAD icons: one line-icon family (24px grid, 1.8 stroke, round caps) that replaces emoji at render time.
   Emoji stay in the source strings as the fallback; iconize() swaps them for inline SVG after each render. */
const ICON_PATHS = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
  sliders: '<path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h11M19 18h1"/><circle cx="16" cy="6" r="2.2"/><circle cx="10" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15"/>',
  volume: '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5z"/><path d="M16.5 9a4.2 4.2 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.5" fill="currentColor"/>',
  pause: '<rect x="7" y="5.5" width="3.5" height="13" rx="1.2" fill="currentColor"/><rect x="13.5" y="5.5" width="3.5" height="13" rx="1.2" fill="currentColor"/>',
  pin: '<path d="M12 21s-6.5-5.4-6.5-10.8a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21z"/><circle cx="12" cy="10" r="2.4"/>',
  moon: '<path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2z"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 1.8H4.4z"/><path d="M10 21h4"/>',
  belloff: '<path d="M6 16.5V11a6 6 0 0 1 9-5.2M18 11v5.5l1.6 1.8H4.4"/><path d="M10 21h4M4 4l16 16"/>',
  mosque: '<path d="M3 20.5h18M5 20.5v-7.2a7 7 0 0 1 14 0v7.2"/><path d="M12 6.3V3M10 20.5v-4a2 2 0 0 1 4 0v4"/>',
  sunrise: '<path d="M3 19h18M7 19a5 5 0 0 1 10 0M12 6v3.5M5.2 11.2l1.6 1.6M18.8 11.2l-1.6 1.6"/>',
  beads: '<circle cx="12" cy="12" r="8.5" stroke-width="3.6" stroke-dasharray="0.1 4.3"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.6 8.4l-2 5.2-5.2 2 2-5.2z"/>',
  book: '<path d="M4.5 19A2.5 2.5 0 0 1 7 16.5h13V3.5H7A2.5 2.5 0 0 0 4.5 6z"/><path d="M4.5 19a2.5 2.5 0 0 0 2.5 2.5h13v-5"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><rect x="8" y="6" width="8" height="4" rx="1"/><path d="M8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.6 0 2.1-1.1 1.6-2.1s-.1-2.1 1.4-2.1h2A3 3 0 0 0 20 13.8 9 9 0 0 0 12 3z"/><path d="M7.5 11h.01M10 7.5h.01M14.5 7.5h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  leaf: '<path d="M5 19C5 10 10.5 5 20 5c0 9.5-5.5 15-13.5 15"/><path d="M5 19l7-7"/>',
  kaaba: '<path d="M4.5 8l7.5-3 7.5 3v10l-7.5 2.5L4.5 18z"/><path d="M4.5 8l7.5 3 7.5-3M12 11v9.5"/>',
  scroll: '<path d="M7 3h7.5L19 7.5V21H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
  cap: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6 11.7V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.3"/>',
  heart: '<path d="M12 20s-8-4.8-8-10.8A4.6 4.6 0 0 1 12 6.6 4.6 4.6 0 0 1 20 9.2C20 15.2 12 20 12 20z"/>',
  chart: '<path d="M5 20V11M12 20V4M19 20v-6"/>',
  tawheed: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/>',
  star: '<path d="M12 3.2l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3 -5.6 3 1.1-6.2L3 9.8l6.2-.9z" fill="currentColor"/>',
  starline: '<path d="M12 3.2l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.8l6.2-.9z"/>',
  checkc: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="M5.7 5.7l12.6 12.6"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18h2"/>'
};
const ICON_EMOJI = {
  '🕰': 'clock', '▦': 'grid', '⚙': 'sliders', '📋': 'copy', '🔊': 'volume', '📢': 'volume', '▶': 'play', '⏹': 'stop', '⏸': 'pause',
  '📍': 'pin', '🌙': 'moon', '🔔': 'bell', '🔕': 'belloff', '🕌': 'mosque', '🌅': 'sunrise', '📿': 'beads', '🔎': 'search',
  '🧭': 'compass', '📖': 'book', '🧮': 'calc', '🎨': 'palette', '☀': 'sun', '🌿': 'leaf', '🕋': 'kaaba', '📜': 'scroll',
  '🎓': 'cap', '🤲': 'heart', '📊': 'chart', '⚰': 'tawheed', '☝': 'tawheed', '★': 'star', '☆': 'starline', '✅': 'checkc', '⛔': 'ban', '📲': 'phone'
};
const ICON_RX = new RegExp('(' + Object.keys(ICON_EMOJI).join('|') + ')\\uFE0F?', 'g');
function icon(name, cls) {
  const p = ICON_PATHS[name]; if (!p) return '';
  return '<svg class="i' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
}
function iconize(root) {
  root = root || document.body; if (!root) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = [];
  while (w.nextNode()) {
    const t = w.currentNode, p = t.parentElement;
    if (!p || p.closest('script,style,textarea,input,select,option,svg,.toast')) continue;
    ICON_RX.lastIndex = 0; if (ICON_RX.test(t.nodeValue)) hits.push(t);
  }
  hits.forEach((t) => {
    const parts = t.nodeValue.split(ICON_RX), f = document.createDocumentFragment();
    parts.forEach((s, i) => {
      if (i % 2) { const k = ICON_EMOJI[s], tpl = document.createElement('template'); tpl.innerHTML = icon(k, 'i-' + k); f.appendChild(tpl.content); }
      else if (s) f.appendChild(document.createTextNode(s));
    });
    t.replaceWith(f);
  });
}
