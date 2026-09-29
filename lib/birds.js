/* eslint-disable */
// Hero wordmark made of birds. They fly in as a flock, settle into the name, and swirl away from the cursor/finger.
// Synced from the Claude Design project (birds.js). Local additions, all invisible at full quality:
// a ~60fps cap, a pixel-density cap, and a runtime quality drop only when frames actually run long.
function glyph(p, P, s, flap, st) {
  const M = (a, b) => { const q = P(a, b); p.moveTo(q[0], q[1]); }, L = (a, b) => { const q = P(a, b); p.lineTo(q[0], q[1]); }, Q = (a, b, c, d) => { const q = P(a, b), r = P(c, d); p.quadraticCurveTo(q[0], q[1], r[0], r[1]); };
  if (st === 'songbird') {
    const b = flap * 0.15, h = P(s * 0.42, -s * 0.5 + b);
    p.moveTo(h[0] + s * 0.3, h[1]); p.arc(h[0], h[1], s * 0.3, 0, Math.PI * 2);
    M(s * 0.7, -s * 0.58 + b); L(s * 1.02, -s * 0.44 + b); L(s * 0.68, -s * 0.34 + b);
    // Wing: the tip sweeps through a wide arc while the mid-wing control point follows
    // at half the amplitude, so the wing bends like a real downstroke/upstroke.
    const w = flap * 2.2, tipX = -s * (1.0 - Math.min(Math.abs(w) / s, 1) * 0.28);
    M(s * 0.14, -s * 0.46 + b); Q(-s * 0.35, -s * 0.05 + b - w * 0.5, tipX, s * 0.42 + b - w); L(-s * 0.1, s * 0.46 + b - w * 0.18); Q(s * 0.8, s * 0.46 + b, s * 0.7, -s * 0.28 + b);
    M(-s * 0.5, s * 0.2 + b - w * 0.55); Q(-s * 0.05, -s * 0.02 + b - w * 0.2, s * 0.28, s * 0.12 + b);
  }
  else if (st === 'flapper') {
    // Body + two hinged wings (the three.js "birds" recipe): each wing is a leaf whose
    // tip swings on the flap sine while the mid-wing lags at half amplitude.
    const w = flap * 2.4, tip = s * (1.15 - Math.min(Math.abs(w) / s, 1) * 0.22);
    for (const d of [-1, 1]) {
      M(0, -s * 0.12); Q(d * s * 0.5, -s * 0.34 - w * 0.5, d * tip, -s * 0.06 - w);
      Q(d * s * 0.62, s * 0.2 - w * 0.4, 0, s * 0.16);
    }
    const h = P(0, -s * 0.5); p.moveTo(h[0] + s * 0.15, h[1]); p.arc(h[0], h[1], s * 0.15, 0, Math.PI * 2);
    M(0, s * 0.16); L(0, s * 0.7);
  }
  else if (st === 'swallow') { M(-s, s * 0.35 + flap); Q(-s * 0.4, -s * 0.35, 0, -s * 0.15); Q(s * 0.4, -s * 0.35, s, s * 0.35 + flap); M(0, -s * 0.45); L(0, s * 0.5); M(-s * 0.32, s * 1.05); L(0, s * 0.5); L(s * 0.32, s * 1.05); }
  else if (st === 'swift') { M(-s * 1.15, s * 0.55 + flap * 0.7); Q(0, -s * 0.95, s * 1.15, s * 0.55 + flap * 0.7); M(0, -s * 0.3); L(0, s * 0.25); }
  else if (st === 'crow') { M(-s * 1.05, flap); L(-s * 0.55, -s * 0.4); L(0, s * 0.15); L(s * 0.55, -s * 0.4); L(s * 1.05, flap); }
  else if (st === 'starling') { M(0, -s * 0.6); L(-s * 0.75, s * 0.3 + flap * 0.4); L(0, s * 0.05); L(s * 0.75, s * 0.3 + flap * 0.4); p.closePath(); }
  else { M(-s, -s * 0.2 + flap); Q(-s * 0.45, -s * 0.8, 0, s * 0.3); Q(s * 0.45, -s * 0.8, s, -s * 0.2 + flap); }
}
const STYLES = ['flapper', 'songbird', 'gull', 'swallow', 'swift', 'crow', 'starling'];
export async function mountBirds(canvas, { dark = true, reduceMotion = false, lines = ['Harshavardhan', 'Khamkar'], style = 'songbird' } = {}) {
  let bstyle = style;
  const pick = (o) => bstyle === 'mixed' ? (o.st ??= STYLES[Math.floor(Math.random() * STYLES.length)]) : bstyle;
  const ctx = canvas.getContext('2d', { alpha: true });
  // Full quality by default; only genuinely constrained devices start lighter.
  const cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const veryLow = saveData || cores <= 2 || mem <= 1;
  let quality = veryLow ? 0.5 : 1;
  const maxDpr = veryLow ? 1.5 : 2;
  try { await document.fonts.load('700 100px Geist'); } catch (e) {}
  let ghost = null, settle = 0;
  let W = 0, H = 0, dpr = 1, birds = [], colors = [], size = 3, R = 90;
  let pointer = { x: -9999, y: -9999, on: false }, scroll = 0, t0 = performance.now(), burstAt = -1e9, burstX = 0, burstY = 0;

  function setTheme(isDark) { colors = isDark ? ['#F2F2F2', '#00FF41'] : ['#0D0E0D', '#0A7A28']; }
  setTheme(dark);

  function layoutTargets() {
    const wide = W >= 700;
    const rows = lines;
    const oc = document.createElement('canvas'); oc.width = W; oc.height = H;
    const o = oc.getContext('2d', { willReadFrequently: true });
    const maxW = wide ? Math.min(W - 96, 1100) : W - 36;
    o.font = '700 100px Geist, sans-serif';
    const fs = Math.min(wide ? Math.min(210, H * 0.2) : 72, 100 * maxW / Math.max(...rows.map(r => o.measureText(r).width)));
    o.font = `700 ${fs}px Geist, sans-serif`;
    try { o.letterSpacing = `${Math.round(fs * 0.03)}px`; } catch (e) {}
    ghost = { fs, rows, x: wide ? W / 2 : 20, align: wide ? 'center' : 'left', top: 0, lh: 0, ls: Math.round(fs * 0.03) };
    o.textBaseline = 'middle';
    o.textAlign = wide ? 'center' : 'left';
    const lh = fs * 1.02, cy = H * (wide ? 0.36 : 0.34), top = cy - (lh * (rows.length - 1)) / 2;
    ghost.top = top; ghost.lh = lh;
    // Line 1 = colour 0, line 2 (or the surname part on one line) = colour 1
    const zones = [];
    rows.forEach((r, i) => {
      const y = top + i * lh, x = wide ? W / 2 : 20;
      o.fillStyle = '#fff'; o.fillText(r, x, y);
      zones.push({ y0: y - lh / 2, y1: y + lh / 2, splitX: i === 0 ? Infinity : -Infinity });
    });
    const data = o.getImageData(0, 0, W, H).data;
    let area = 0;
    for (let i = 3; i < data.length; i += 4 * 2) if (data[i] > 128) area += 2;
    const target = (W < 700 ? 1100 : 2300) * quality;
    const step = Math.max(2.4, Math.sqrt(area / target));
    size = step * 0.56; R = wide ? 130 : 80;
    const pts = [];
    for (let y = 0; y < H; y += step) {
      const row = Math.round(y / step) % 2;
      for (let x = row * step / 2; x < W; x += step) {
        const jx = x + (Math.random() - 0.5) * step * 0.12, jy = y + (Math.random() - 0.5) * step * 0.12;
        const ix = Math.round(jx), iy = Math.round(jy);
        if (ix < 0 || iy < 0 || ix >= W || iy >= H || data[(iy * W + ix) * 4 + 3] < 128) continue;
        const z = zones.find(z => jy >= z.y0 && jy <= z.y1) || zones[0];
        pts.push({ x: jx, y: jy, c: jx >= z.splitX ? 1 : 0 });
      }
    }
    return pts;
  }

  function build() {
    const pts = layoutTargets();
    const old = birds;
    birds = pts.map((p, i) => {
      const b = old[i];
      if (b) { b.tx = p.x; b.ty = p.y; b.c = p.c; return b; }
      // Start as one flock off-screen left, released left-to-right so the name "writes" itself.
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 70;
      return {
        x: -120 + Math.cos(a) * r, y: H * 0.7 + Math.sin(a) * r * 0.6, vx: 0, vy: 0,
        ox: Math.cos(a) * r, oy: Math.sin(a) * r * 0.6,
        tx: p.x, ty: p.y, c: p.c, ph: Math.random() * 6.28, ang: -Math.PI / 2,
        rel: reduceMotion ? 0 : 0.5 + (p.x / W) * 1.6 + Math.random() * 0.5,
      };
    });
    if (reduceMotion) birds.forEach(b => { b.x = b.tx; b.y = b.ty; });
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    if (Math.abs(w - W) < 2 && Math.abs(h - H) < 2) return;
    W = w; H = h; dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    canvas.width = W * dpr; canvas.height = H * dpr;
    build();
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const toLocal = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, r]; };
  const onMove = e => {
    const [x, y, r] = toLocal(e);
    pointer.on = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    pointer.x = x; pointer.y = y;
  };
  const onLeave = () => { pointer.on = false; };
  const onDown = e => { const [x, y] = toLocal(e); burstAt = performance.now(); burstX = x; burstY = y; onMove(e); };
  const onUp = e => { if (e.pointerType !== 'mouse') pointer.on = false; };
  window.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);

  const wanderers = []; let nextSpawn = 2.5;
  function spawn(t) {
    const n = 1 + Math.floor(Math.random() * 4), ltr = Math.random() < 0.6;
    const y0 = H * (0.12 + Math.random() * 0.6), speed = (W < 700 ? 1.3 : 1.9) * (0.8 + Math.random() * 0.5);
    const sz = size * (1.5 + Math.random() * 0.9), rise = (Math.random() - 0.5) * 0.35;
    for (let i = 0; i < n; i++) wanderers.push({
      x: ltr ? -40 - i * (18 + Math.random() * 14) : W + 40 + i * (18 + Math.random() * 14),
      y: y0 + (Math.random() - 0.5) * 36 + i * 6, vx: ltr ? speed : -speed, rise, s: sz * (0.85 + Math.random() * 0.3),
      ph: Math.random() * 6.28, wob: Math.random() * 6.28, c: Math.random() < 0.3 ? 1 : 0,
    });
    nextSpawn = t + 3 + Math.random() * 4;
  }
  let visible = true, raf;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(canvas);

  // Physics is per-frame, so cap at ~60fps: 120Hz screens neither speed the flock
  // up nor double the work. Quality only drops if frames actually run long.
  let lastFrame = 0, slow = 0, lastRebuild = 0;

  // ── Life cycle: settle → (10–15s) → startled ripple → flock flees → away → returns from the
  // opposite side and re-forms the name → repeat. Settled birds also hop and a gust ripples through.
  let cyc = 'intro', cycAt = 0, nextFlee = 0, awayHold = 2, parked = 0;
  let leaderT0 = 0, entry = 'left', fleeSide = 1, fleeX = 0, fleeY = -0.45;
  let waveX = -1e9, nextWave = 8;
  const rnd = (a, b) => a + Math.random() * (b - a);
  function startFlee(t) {
    cyc = 'fleeing'; cycAt = t; parked = 0;
    fleeSide = Math.random() < 0.5 ? -1 : 1;
    const len = Math.hypot(1, 0.45); fleeX = fleeSide / len; fleeY = -0.45 / len;
    // Startle ripples outward from a random spot on the name (~700px/s).
    const ex = W * rnd(0.2, 0.8), ey = H * (W >= 700 ? 0.36 : 0.34);
    for (const b of birds) {
      b.st = 1; b.kick = 0; b.spd ??= Math.random() * 0.25;
      b.fleeAt = t + Math.hypot(b.x - ex, b.y - ey) / 700 + Math.random() * 0.15;
    }
  }
  function startReturn(t) {
    cyc = 'returning'; cycAt = t; leaderT0 = t;
    entry = fleeSide > 0 ? 'left' : 'right';   // come back from the other side
    for (const b of birds) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 70;
      b.ox = Math.cos(a) * r; b.oy = Math.sin(a) * r * 0.6;
      b.x = (entry === 'left' ? -120 : W + 120) + b.ox; b.y = H * 0.7 + b.oy; b.vx = 0; b.vy = 0;
      b.st = 0; b.kick = 0; b.rest = 0;
      const frac = entry === 'left' ? b.tx / W : 1 - b.tx / W;
      b.rel = 0.5 + frac * 1.6 + Math.random() * 0.5;
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible || !W) { lastFrame = 0; return; }
    const dt = now - lastFrame;
    if (lastFrame && dt < 14) return;
    if (lastFrame && dt < 250) {
      slow = dt > 26 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 45 && quality > 0.3 && now - lastRebuild > 3000) {
        quality *= 0.65; slow = 0; lastRebuild = now; build();
      }
    }
    lastFrame = now;
    const t = (now - t0) / 1000;
    // Flock leader path (intro and every return): a lazy S-curve sweeping in from one side.
    const tl = t - leaderT0, lk = Math.min(1, tl / 2.2);
    const lx = entry === 'left' ? -120 + lk * (W * 0.55) : W + 120 - lk * (W * 0.55), ly = H * (0.7 - Math.sin(lk * Math.PI) * 0.35);
    if (!reduceMotion) {
      if (cyc === 'intro' && tl > 3.5) { cyc = 'settled'; nextFlee = t + rnd(10, 15); }
      else if (cyc === 'settled' && t > nextFlee && scroll < 0.25) startFlee(t);
      else if (cyc === 'fleeing' && (parked >= birds.length || t > cycAt + 9)) {
        birds.forEach(b => { b.st = 2; }); cyc = 'away'; cycAt = t; awayHold = rnd(1.4, 3);
      }
      else if (cyc === 'away' && t > cycAt + awayHold) startReturn(t);
      else if (cyc === 'returning' && tl > 6) { cyc = 'settled'; nextFlee = t + rnd(12, 18); }
      if (cyc === 'settled') {
        // Tiny hops so the wordmark shimmers, plus an occasional gust rippling left→right.
        if (birds.length && Math.random() < 0.4) { const hb = birds[(Math.random() * birds.length) | 0]; hb.vy -= rnd(1.4, 3); hb.vx += rnd(-0.6, 0.6); }
        if (t > nextWave && waveX < -1e8) { waveX = -60; nextWave = t + rnd(6, 10); }
      }
      if (waveX > -1e8) { waveX += 9; if (waveX > W + 60) waveX = -1e9; }
    }
    const sinceBurst = (now - burstAt) / 1000;
    const drift = scroll * 260;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // (The faint ghost copy of the name that used to be drawn under the birds is removed.)
    const paths = [new Path2D(), new Path2D()];
    for (let i = 0; i < birds.length; i++) {
      const b = birds[i];
      let ax = 0, ay = 0;
      if (b.st === 2) continue;                       // parked off-screen while the flock is away
      if (b.st === 1 && t >= b.fleeAt) {
        // Startled: burst away with a kick, then stream off with swirling turbulence.
        if (!b.kick) { b.kick = 1; b.vx += fleeX * 3 + rnd(-1.5, 1.5); b.vy += fleeY * 3 - rnd(1, 3); }
        const tt = t * 0.9 + b.ph, pace = 0.42 + b.spd;
        ax = fleeX * pace + Math.sin(tt * 2.1 + b.y * 0.012) * 0.16;
        ay = fleeY * pace + Math.cos(tt * 1.7 + b.x * 0.012) * 0.16;
        if (b.x < -160 || b.x > W + 160 || b.y < -160) { b.st = 2; parked++; continue; }
      } else if (tl < b.rel) {
        const sw = t * 1.6 + b.ph;
        const gx = lx + b.ox * (1 + 0.25 * Math.sin(sw)) + Math.sin(t * 2 + b.oy * 0.05) * 14;
        const gy = ly + b.oy * (1 + 0.25 * Math.cos(sw));
        ax = (gx - b.x) * 0.06; ay = (gy - b.y) * 0.06;
      } else {
        const ty = b.ty - drift * (0.6 + (b.ph % 1) * 0.8), tx = b.tx + Math.sin(b.ph * 3) * drift * 0.4;
        const dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy);
        const k = d > 60 ? 0.01 : 0.018;
        ax = dx * k; ay = dy * k;
        if (d > 30) { ax += Math.sin(b.y * 0.01 + t * 0.8) * 0.12; ay += Math.cos(b.x * 0.01 + t * 0.7) * 0.12; }
        b.near = d < 6;
        if (b.st === 1) { ax += (Math.random() - 0.5) * 0.7; ay += (Math.random() - 0.5) * 0.7; }   // alert flutter before the ripple reaches it
        if (waveX > -1e8) { const dw = b.tx - waveX; if (dw > -50 && dw < 50) ay -= 0.6 * (1 - Math.abs(dw) / 50) * (1 + (b.ph % 1)); }
      }
      if (pointer.on) {
        const px = b.x - pointer.x, py = b.y - pointer.y, d2 = px * px + py * py;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, f = (1 - d / R);
          // push out + swirl around the cursor
          ax += (px / d) * f * 3.2 + (-py / d) * f * 2.2;
          ay += (py / d) * f * 3.2 + (px / d) * f * 2.2;
        }
      }
      if (sinceBurst < 0.25) {
        const px = b.x - burstX, py = b.y - burstY, d = Math.hypot(px, py) || 1;
        if (d < R * 2.4) { const f = (1 - d / (R * 2.4)) * 9; ax += (px / d) * f; ay += (py / d) * f - f * 0.3; }
      }
      const damp = b.near ? 0.78 : 0.9;
      b.vx = (b.vx + ax) * damp; b.vy = (b.vy + ay) * damp;
      b.x += b.vx; b.y += b.vy;
      const sp = Math.hypot(b.vx, b.vy);
      const moving = sp > 0.9;
      const want = moving ? Math.atan2(b.vy, b.vx) : -Math.PI / 2;
      let da = want - b.ang; da = Math.atan2(Math.sin(da), Math.cos(da));
      b.ang += da * (moving ? 0.12 : 0.04);
      b.rest = (b.rest ?? 0) + ((moving ? 0 : 1) - (b.rest ?? 0)) * 0.03;
      b.ph += 0.035 + Math.min(sp, 6) * 0.03;
      const s = size * (1 + Math.min(sp, 4) * 0.05), flap = Math.sin(b.ph) * s * (0.5 - b.rest * 0.38);
      b.tilt = (b.tilt ?? 0) + (Math.max(-0.45, Math.min(0.45, b.vx * 0.07)) * (1 - b.rest) - (b.tilt ?? 0)) * 0.15;
      const c = Math.cos(b.tilt), sn = Math.sin(b.tilt);
      const P = (lx2, ly2) => [b.x + lx2 * c - ly2 * sn, b.y + lx2 * sn + ly2 * c];
      if (Math.abs(b.vx) > 0.6) b.dir = Math.sign(b.vx); const bd = b.dir || 1;
      glyph(paths[b.c], (a, q) => P(a * bd, q), s * 1.25, flap, pick(b));
    }
    if (!reduceMotion && quality > 0.5 && t > nextSpawn && wanderers.length < 14) spawn(t);
    const wp = [new Path2D(), new Path2D()];
    for (let i = wanderers.length - 1; i >= 0; i--) {
      const w = wanderers[i];
      w.x += w.vx; w.y += w.rise + Math.sin(t * 1.4 + w.wob) * 0.35; w.ph += 0.16;
      if (pointer.on) { const px = w.x - pointer.x, py = w.y - pointer.y, d = Math.hypot(px, py); if (d < R) w.y += (py / (d || 1)) * (1 - d / R) * 4; }
      if (w.x < -120 || w.x > W + 120) { wanderers.splice(i, 1); continue; }
      const tilt = Math.sign(w.vx) * (w.rise * 0.6 + Math.sin(t * 1.4 + w.wob) * 0.08), s = w.s, flap = Math.sin(w.ph) * s * 0.6;
      const c = Math.cos(tilt), sn = Math.sin(tilt);
      const P = (a, b2) => [w.x + a * c - b2 * sn, w.y + a * sn + b2 * c];
      const wd = Math.sign(w.vx) || 1; glyph(wp[w.c], (a, q) => P(a * wd, q), s * 1.25, flap, pick(w));
    }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(1.4, size * 0.5);
    ctx.globalAlpha = 0.75 * Math.max(0, 1 - scroll);
    ctx.strokeStyle = colors[0]; ctx.stroke(wp[0]);
    ctx.strokeStyle = colors[1]; ctx.stroke(wp[1]);
    ctx.lineWidth = Math.max(1.2, size * 0.34); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalAlpha = Math.max(0, 1 - scroll * 0.9);
    ctx.strokeStyle = colors[0]; ctx.stroke(paths[0]);
    ctx.strokeStyle = colors[1]; ctx.stroke(paths[1]);
  }
  raf = requestAnimationFrame(frame);

  return {
    setTheme,
    setStyle(v) { bstyle = v || 'flapper'; },
    setScroll(p) { scroll = Math.max(0, Math.min(1, p)); },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    }
  };
}
