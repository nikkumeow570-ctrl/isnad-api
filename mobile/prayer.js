/* Offline prayer-time + Qibla calculator (no network needed). */
(function (root) {
  const METHODS = {
    // Default: Fajr 18, Isha 18, Asar 1x shadow (set in the app), Dhuhr = solar noon + 1 min, Maghrib at sunset.
    Fajr18: { name: 'Fajr 18°, Isha 18°, Dhuhr +1 min', fajr: 18, isha: 18, dhuhr: 1 },
    MWL: { name: 'Muslim World League', fajr: 18, isha: 17 },
    Karachi: { name: 'Karachi (Univ. of Islamic Sciences)', fajr: 18, isha: 18 },
    ISNA: { name: 'ISNA (North America)', fajr: 15, isha: 15 },
    Egypt: { name: 'Egyptian General Authority', fajr: 19.5, isha: 17.5 },
    UmmAlQura: { name: 'Umm al-Qura (Makkah) - Isha 90 min after Maghrib', fajr: 18.5, isha: 0, ishaMin: 90 },
    Dubai: { name: 'UAE (Dubai)', fajr: 18.2, isha: 18.2 },
    Qatar: { name: 'Qatar - Isha 90 min after Maghrib', fajr: 18, isha: 0, ishaMin: 90 },
    Kuwait: { name: 'Kuwait', fajr: 18, isha: 17.5 },
    Singapore: { name: 'Singapore / Malaysia (MUIS, JAKIM)', fajr: 20, isha: 18 },
    Turkey: { name: 'Turkey (Diyanet)', fajr: 18, isha: 17 }
  };
  const rad = (d) => (d * Math.PI) / 180;
  const deg = (r) => (r * 180) / Math.PI;
  const sin = (d) => Math.sin(rad(d));
  const cos = (d) => Math.cos(rad(d));
  const tan = (d) => Math.tan(rad(d));
  const asin = (x) => deg(Math.asin(x));
  const acos = (x) => deg(Math.acos(x));
  const atan2 = (y, x) => deg(Math.atan2(y, x));
  const arccot = (x) => deg(Math.atan(1 / x));
  const fix = (a, b) => a - b * Math.floor(a / b);

  /* Solar position and times follow Jean Meeus, "Astronomical Algorithms" (the same method used by the
     open-source Adhan libraries): apparent solar longitude, nutation, sidereal time, and interpolation of
     the sun's position across the day. Results are rounded to the nearest minute. */
  const unwind = (a) => fix(a, 360);
  const norm1 = (v) => fix(v, 1);
  const closest = (a) => (a < -180 ? a + 360 : a > 180 ? a - 360 : a);

  function solarCoords(jd) {
    const T = (jd - 2451545.0) / 36525;
    const L0 = unwind(280.4664567 + 36000.76983 * T + 0.0003032 * T * T);
    const Lp = unwind(218.3165 + 481267.8813 * T);
    const Om = unwind(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000);
    const M = unwind(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) + (0.019993 - 0.000101 * T) * sin(2 * M) + 0.000289 * sin(3 * M);
    const lam = unwind(L0 + C - 0.00569 - 0.00478 * sin(125.04 - 1934.136 * T));
    const th0 = unwind(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000);
    const dPsi = (-17.2 / 3600) * sin(Om) + (1.32 / 3600) * sin(2 * L0) - (0.23 / 3600) * sin(2 * Lp) + (0.21 / 3600) * sin(2 * Om);
    const dEps = (9.2 / 3600) * cos(Om) + (0.57 / 3600) * cos(2 * L0) + (0.1 / 3600) * cos(2 * Lp) - (0.09 / 3600) * cos(2 * Om);
    const eps0 = 23.439291 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;
    const eps = eps0 + dEps;
    return {
      decl: asin(sin(eps) * sin(lam)),
      ra: unwind(atan2(cos(eps) * sin(lam), cos(lam))),
      sid: unwind(th0 + (dPsi * 3600 * cos(eps0 + dEps)) / 3600)
    };
  }
  const interp = (y2, y1, y3, n) => { const a = y2 - y1, b = y3 - y2, c = b - a; return y2 + (n / 2) * (a + b + n * c); };
  const interpAng = (y2, y1, y3, n) => { const a = unwind(y2 - y1), b = unwind(y3 - y2), c = b - a; return y2 + (n / 2) * (a + b + n * c); };

  /** Returns Date objects (or null when the sun never reaches that angle). */
  function computeTimes(date, lat, lng, methodKey, asrFactor) {
    const m = METHODS[methodKey] || METHODS.MWL;
    const y = date.getFullYear(), mo = date.getMonth(), d = date.getDate();
    const jd = Date.UTC(y, mo, d) / 86400000 + 2440587.5; // 0h UT of that calendar date
    const s2 = solarCoords(jd), s1 = solarCoords(jd - 1), s3 = solarCoords(jd + 1);
    const Lw = -lng;
    const m0 = norm1((s2.ra + Lw - s2.sid) / 360);
    const transit = (() => {
      const th = unwind(s2.sid + 360.985647 * m0);
      const ra = interpAng(s2.ra, s1.ra, s3.ra, m0);
      const H = closest(th - Lw - ra);
      return (m0 - H / 360) * 24;
    })();
    const hourTime = (angle, after) => {
      const t1 = sin(angle) - sin(lat) * sin(s2.decl), t2 = cos(lat) * cos(s2.decl), q = t1 / t2;
      if (q > 1 || q < -1) return NaN;
      const H0 = acos(q);
      const mm = after ? m0 + H0 / 360 : m0 - H0 / 360;
      const th = unwind(s2.sid + 360.985647 * mm);
      const ra = interpAng(s2.ra, s1.ra, s3.ra, mm);
      const dc = interp(s2.decl, s1.decl, s3.decl, mm);
      const H = th - Lw - ra;
      const h = asin(sin(lat) * sin(dc) + cos(lat) * cos(dc) * cos(H));
      const dm = (h - angle) / (360 * cos(dc) * cos(lat) * sin(H));
      return (mm + dm) * 24;
    };
    const asrAngle = arccot(asrFactor + tan(Math.abs(lat - s2.decl)));
    const base = Date.UTC(y, mo, d);
    const toDate = (h) => (isNaN(h) ? null : new Date(Math.round((base + h * 3600000) / 60000) * 60000));
    return {
      Fajr: toDate(hourTime(-m.fajr, false)),
      Sunrise: toDate(hourTime(-50 / 60, false)),
      Dhuhr: toDate(transit + (m.dhuhr || 0) / 60), // solar noon (+ method offset in minutes)
      Asr: toDate(hourTime(asrAngle, true)),
      Maghrib: toDate(hourTime(-50 / 60, true)),
      Isha: m.ishaMin ? (() => { const mg = toDate(hourTime(-50 / 60, true)); return mg ? new Date(mg.getTime() + m.ishaMin * 60000) : null; })() : toDate(hourTime(-m.isha, true))
    };
  }

  function qibla(lat, lng) {
    const kLat = 21.4225, kLng = 39.8262;
    const dL = kLng - lng;
    return fix(atan2(sin(dL), cos(lat) * tan(kLat) - sin(lat) * cos(dL)), 360);
  }

  const api = { METHODS, computeTimes, qibla };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Prayer = api;
})(typeof self !== 'undefined' ? self : this);
