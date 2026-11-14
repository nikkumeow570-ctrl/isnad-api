/* ISNAD accessibility + robustness helpers (WCAG 2.1 AA oriented). */
function a11yApply() {
  const d = document;
  d.documentElement.lang = (typeof S !== 'undefined' && S.lang === 'ta') ? 'ta' : 'en';
  d.body.style.zoom = (S && S.fs) ? String(S.fs) : '';
  /* Arabic text: declare language and direction for screen readers and correct shaping */
  d.querySelectorAll('.arq,.ar,.arh').forEach((e) => { if (!e.lang) { e.lang = 'ar'; e.dir = 'rtl'; } });
  /* tabs and navigation */
  const nav = d.querySelector('nav'); if (nav) nav.setAttribute('aria-label', 'Main');
  d.querySelectorAll('#nav button').forEach((b) => {
    const lb = b.querySelector('.lb'); if (lb) b.setAttribute('aria-label', lb.textContent);
    b.setAttribute('aria-current', b.classList.contains('on') ? 'page' : 'false');
    const ic = b.querySelector('.ic'); if (ic) ic.setAttribute('aria-hidden', 'true');
  });
  /* decorative emoji icons in list rows */
  d.querySelectorAll('.lrow .li,.hn .ic').forEach((e) => e.setAttribute('aria-hidden', 'true'));
  /* every button needs a name */
  d.querySelectorAll('button').forEach((b) => {
    if (!b.getAttribute('aria-label') && !b.textContent.trim()) b.setAttribute('aria-label', b.title || 'Button');
  });
  d.querySelectorAll('.seg').forEach((s) => { s.setAttribute('role', 'group'); s.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.classList.contains('on') ? 'true' : 'false')); });
  d.querySelectorAll('details.acc > summary').forEach((s) => { s.setAttribute('role', 'button'); });
  const t = d.getElementById('toast'); if (t) { t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); }
  const m = d.getElementById('main'); if (m) m.setAttribute('tabindex', '-1');
}
/* A crash in one screen must not leave a blank app: show a message and keep the nav usable. */
window.addEventListener('error', (e) => {
  try { localStorage.setItem('isnad_last_error', JSON.stringify({ t: Date.now(), m: String(e.message), f: e.filename, l: e.lineno })); } catch (x) {}
  try { const t = document.getElementById('toast'); if (t) { t.textContent = 'Something went wrong. Please go back and try again.'; t.classList.remove('hidden'); setTimeout(() => t.classList.add('hidden'), 3500); } } catch (x) {}
});
window.addEventListener('unhandledrejection', (e) => { try { localStorage.setItem('isnad_last_error', JSON.stringify({ t: Date.now(), m: String(e.reason) })); } catch (x) {} });
