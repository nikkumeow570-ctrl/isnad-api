// Offline prayer times + qibla. No dependencies. Works in Node and in the browser (window.PrayerTimes).
// Times follow the Tholugai guide's rules: Fajr from true dawn to sunrise; Dhuhr from the sun passing noon until a
// shadow equals the object's length; Asr from then (Shafi'i/Jumhur: 1x, Hanafi: 2x) until sunset; Maghrib from sunset
// until the red twilight ends (Isha start); Isha until the middle of the night.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(); else root.PrayerTimes = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const sin = (d) => Math.sin(d * D2R), cos = (d) => Math.cos(d * D2R), tan = (d) => Math.tan(d * D2R);
  const asin = (x) => Math.asin(x) * R2D, acos = (x) => Math.acos(x) * R2D, atan2 = (y, x) => Math.atan2(y, x) * R2D;
  const acot = (x) => Math.atan(1 / x) * R2D;
  const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };

  // Fajr angle, Isha angle (or {isha_minutes} after Maghrib). The exact local angles are a choice; check against your local timetable.
  const METHODS = {
    mwl:     { name: 'Muslim World League', fajr: 18, isha: 17 },
    karachi: { name: 'Univ. of Islamic Sciences, Karachi', fajr: 18, isha: 18 },
    isna:    { name: 'ISNA (North America)', fajr: 15, isha: 15 },
    egypt:   { name: 'Egyptian General Authority', fajr: 19.5, isha: 17.5 },
    makkah:  { name: 'Umm al-Qura (Makkah)', fajr: 18.5, isha_minutes: 90 },
  };

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function sunPosition(jd) {
    const D = jd - 2451545.0;
    const g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
    const L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360);
    const e = 23.439 - 0.00000036 * D;
    const RA = fix(atan2(cos(e) * sin(L), cos(L)) / 15, 24);
    return { decl: asin(sin(e) * sin(L)), eqt: q / 15 - RA + (q / 15 - RA < -12 ? 24 : 0) - (q / 15 - RA > 12 ? 24 : 0) };
  }

  function compute(year, month, day, lat, lng, tz, opts) {
    opts = opts || {};
    const m = METHODS[opts.method || 'karachi'] || METHODS.karachi;
    const fajrA = opts.fajrAngle != null ? opts.fajrAngle : m.fajr;
    const ishaA = opts.ishaAngle != null ? opts.ishaAngle : m.isha;
    const ishaMin = opts.ishaAngle != null ? null : m.isha_minutes;
    const asrFactor = opts.asr === 'hanafi' ? 2 : 1;       // default = Shafi'i/Jumhur = the Tholugai guide (shadow = object)
    const elev = opts.elevation || 0;
    const riseSet = 0.833 + 0.0347 * Math.sqrt(Math.max(0, elev));
    const jd = julian(year, month, day) - lng / (15 * 24);
    const midDay = (t) => fix(12 - sunPosition(jd + t).eqt, 24);
    const angleTime = (angle, t, ccw) => {
      const decl = sunPosition(jd + t).decl;
      const v = (-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat));
      if (v < -1 || v > 1) return NaN;
      return midDay(t) + (ccw ? -1 : 1) * acos(v) / 15;
    };
    const asrTime = (t) => {
      const decl = sunPosition(jd + t).decl;
      const angle = -acot(asrFactor + tan(Math.abs(lat - decl)));
      return angleTime(angle, t, false);
    };
    let t = { fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, isha: 18 };
    for (let i = 0; i < 3; i++) {
      const p = {}; for (const k in t) p[k] = t[k] / 24;
      t = {
        fajr: angleTime(fajrA, p.fajr, true), sunrise: angleTime(riseSet, p.sunrise, true), dhuhr: midDay(p.dhuhr),
        asr: asrTime(p.asr), sunset: angleTime(riseSet, p.sunset, false),
        isha: ishaMin == null ? angleTime(ishaA, p.isha, false) : NaN,
      };
    }
    const adj = tz - lng / 15;
    const r = {};
    for (const k in t) r[k] = t[k] + adj;
    r.dhuhr += (opts.dhuhrMinutes != null ? opts.dhuhrMinutes : 0) / 60;
    r.maghrib = r.sunset;
    if (ishaMin != null) r.isha = r.maghrib + ishaMin / 60;
    const nightLen = fix(r.fajr + 24 - r.sunset, 24);
    r.midnight = r.sunset + nightLen / 2;                     // end of Isha per the Tholugai guide
    const manual = opts.adjust || {};
    for (const k in manual) if (r[k] != null) r[k] += manual[k] / 60;   // per-prayer minute offsets
    return r;
  }

  function hhmm(h, use12) {
    if (!isFinite(h)) return null;
    h = fix(h, 24); let mins = Math.round(h * 60); const dayCarry = mins >= 1440; mins %= 1440;
    let H = Math.floor(mins / 60); const M = mins % 60;
    if (use12) { const ap = H >= 12 ? 'PM' : 'AM'; H = H % 12 || 12; return `${H}:${String(M).padStart(2, '0')} ${ap}`; }
    return `${String(H).padStart(2, '0')}:${String(M).padStart(2, '0')}`;
  }

  // Structured result with the five prayers and their windows.
  function day(year, month, dayN, lat, lng, tz, opts) {
    const r = compute(year, month, dayN, lat, lng, tz, opts);
    const f = (h) => hhmm(h);
    return {
      date: `${year}-${String(month).padStart(2, '0')}-${String(dayN).padStart(2, '0')}`,
      settings: { method: (opts && opts.method) || 'karachi', asr: (opts && opts.asr) === 'hanafi' ? 'hanafi' : 'shafi', tz },
      prayers: {
        fajr:    { start: f(r.fajr),    end: f(r.sunrise) },
        sunrise: { start: f(r.sunrise) },
        dhuhr:   { start: f(r.dhuhr),   end: f(r.asr) },
        asr:     { start: f(r.asr),     end: f(r.sunset) },
        maghrib: { start: f(r.maghrib), end: f(r.isha) },
        isha:    { start: f(r.isha),    end: f(r.midnight) },
      },
      midnight: f(r.midnight),
      raw: r,
    };
  }

  // Direction of the Kaaba in degrees clockwise from true north.
  function qibla(lat, lng) {
    const kLat = 21.422487, kLng = 39.826206, dl = (kLng - lng) * D2R;
    const y = Math.sin(dl), x = Math.cos(lat * D2R) * Math.tan(kLat * D2R) - Math.sin(lat * D2R) * Math.cos(dl);
    return fix(Math.atan2(y, x) * R2D, 360);
  }
  return { METHODS, compute, day, qibla, hhmm };
});
