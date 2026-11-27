// Eyes drawn in code from tracked shapes (EYES): lids, crease, iris, brows per frame, in units of the distance between
// the outer eye corners, origin between the inner corners. drawEyes(ctx, W, H, f, look) fills a wide band.
const LOOKS = {
  western: { dark: 1, skin: ['#b98a66', '#9a6c4c', '#6e4630'], white: '#e2d9cc', iris: ['#9a9c98', '#666c6e', '#272b2f'], line: '#1d130e', brow: '#3a2a1e', lid: 'rgba(70,35,22,', pink: '#9a7d70', shade: '9,4,3', mul: [.36, .25, .21], lit: '255,206,160', key: 1, eye: [.8, .7, .64], grain: .13 },
  dusk: { dark: 1, skin: ['#8d8378', '#6f665d', '#463f3a'], white: '#d6d0c6', iris: ['#a9b0b2', '#7b8589', '#3f484d'], line: '#1c1816', brow: '#2c2622', lid: 'rgba(40,32,28,', pink: '#857a74', shade: '8,7,8', mul: [.33, .31, .31], lit: '236,226,212', key: .55, eye: [.8, .78, .77], grain: .07 },
  natural: { skin: ['#dbb9a9', '#caa292', '#a27a6a'], white: '#d6cfca', iris: ['#a8aba7', '#737a7d', '#2d3236'], line: '#2e2019', brow: '#4a3a2c', lid: 'rgba(120,70,60,', pink: '#b39a90' },
  game: { skin: ['#8d8378', '#6f665d', '#463f3a'], white: '#d6d0c6', iris: ['#a9b0b2', '#7b8589', '#3f484d'], line: '#1c1816', brow: '#2c2622', lid: 'rgba(40,32,28,', pink: '#857a74' }
};
function rnd(s) { return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function pts(e, k, f) { const a = EYES[e + k], i = Math.floor(f), j = Math.min(EYES.n - 1, i + 1), u = f - i, A = a[i], B = a[j], o = []; for (let n = 0; n < A.length; n += 2) o.push([A[n] + (B[n] - A[n]) * u, A[n + 1] + (B[n + 1] - A[n + 1]) * u]); return o; }
// a smooth curve through points (Catmull-Rom as Beziers)
function curve(c, p, move) {
  if (move) c.moveTo(p[0][0], p[0][1]);
  for (let i = 0; i < p.length - 1; i++) { const a = p[Math.max(0, i - 1)], b = p[i], d = p[i + 1], e = p[Math.min(p.length - 1, i + 2)]; c.bezierCurveTo(b[0] + (d[0] - a[0]) / 6, b[1] + (d[1] - a[1]) / 6, d[0] - (e[0] - b[0]) / 6, d[1] - (e[1] - b[1]) / 6, d[0], d[1]); }
}
// ---- skin, folds and brows (part A) ----------------------------------------------------------------------------
function hexRGB(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
function sm(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
// points along a smooth curve through p (Catmull-Rom), n steps
function samp(p, n) {
  const o = [], m = p.length - 1;
  for (let k = 0; k <= n; k++) { const s = k / n * m, i = Math.min(m - 1, Math.floor(s)), u = s - i, a = p[Math.max(0, i - 1)], b = p[i], d = p[i + 1], e = p[Math.min(m, i + 2)], u2 = u * u, u3 = u2 * u, r = [0, 0];
    for (let j = 0; j < 2; j++) r[j] = .5 * (2 * b[j] + (d[j] - a[j]) * u + (2 * a[j] - 5 * b[j] + 4 * d[j] - e[j]) * u2 + (3 * b[j] - a[j] - 3 * d[j] + e[j]) * u3);
    o.push(r); }
  return o;
}
// a tapered sliver along sampled points q: width wf(t), shifted by (ox, oy); filled with the current fillStyle
function taper(c, q, wf, ox, oy) {
  const n = q.length - 1, L = [], Rr = []; ox = ox || 0; oy = oy || 0;
  for (let i = 0; i <= n; i++) { const a = q[Math.max(0, i - 1)], b = q[Math.min(n, i + 1)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1, h = wf(i / n) / 2; dx /= l; dy /= l; L.push([q[i][0] - dy * h + ox, q[i][1] + dx * h + oy]); Rr.push([q[i][0] + dy * h + ox, q[i][1] - dx * h + oy]); }
  c.beginPath(); c.moveTo(L[0][0], L[0][1]); for (let i = 1; i <= n; i++) c.lineTo(L[i][0], L[i][1]); for (let i = n; i >= 0; i--) c.lineTo(Rr[i][0], Rr[i][1]); c.closePath(); c.fill();
}
const PROF = t => Math.pow(Math.sin(Math.PI * t), .7);
// the still skin, baked once per size and look: the base wash, blotches of red, dark and light, pores and grain
function skinBake(W, H, K, name) {
  const key = name + W + 'x' + H; if (skinBake.k === key) return skinBake.c;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), S = W / 1.62, cx = W / 2, cy = H * (drawEyes.cyK || .56);
  let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, K.skin[1]); g.addColorStop(.45, K.skin[0]); g.addColorStop(1, K.skin[1]); c.fillStyle = g; c.fillRect(0, 0, W, H);
  g = c.createRadialGradient(cx, cy, S * .1, cx, cy, S * .95); g.addColorStop(0, 'rgba(255,240,225,.12)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(30,15,10,.45)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  const pink = hexRGB(K.pink), dark = K.lid.match(/\d+/g).map(Number), R = rnd(977);
  // blotches at three sizes (small pictures stretched up, so they are soft)
  for (const [sw, al] of [[14, .11], [44, .1], [130, .08]]) {
    const sh = Math.max(2, Math.round(sw * H / W)), t = document.createElement('canvas'); t.width = sw; t.height = sh; const tc = t.getContext('2d'), d = tc.createImageData(sw, sh);
    for (let i = 0; i < sw * sh; i++) { const r = R(), col = r < .5 ? pink : r < .85 ? dark : [255, 238, 220]; d.data[i * 4] = col[0]; d.data[i * 4 + 1] = col[1]; d.data[i * 4 + 2] = col[2]; d.data[i * 4 + 3] = 255 * al * R() * R() * 2; }
    tc.putImageData(d, 0, 0); c.imageSmoothingEnabled = true; c.drawImage(t, -W * .02, -H * .02, W * 1.04, H * 1.04);
  }
  // redder over the cheeks' tops and the nose's sides, as thin skin is
  for (const s of [-1, 1]) { g = c.createRadialGradient(cx + s * .33 * S, cy + .2 * S, 0, cx + s * .33 * S, cy + .2 * S, .3 * S); g.addColorStop(0, 'rgba(' + pink + ',.16)'); g.addColorStop(1, 'rgba(' + pink + ',0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  // pores: at half size (so each is about two pixels, soft), then a fine grain at full size
  { const pw = W >> 1, ph = H >> 1, t = document.createElement('canvas'); t.width = pw; t.height = ph; const tc = t.getContext('2d'), d = tc.createImageData(pw, ph);
    for (let i = 0; i < pw * ph; i++) { const r = R(); let col = dark, a; if (r < .045) a = 26 + R() * 46; else if (r < .08) { col = [255, 240, 225]; a = 14 + R() * 30; } else { if (R() < .5) col = [255, 240, 225]; a = R() * 9; } d.data[i * 4] = col[0]; d.data[i * 4 + 1] = col[1]; d.data[i * 4 + 2] = col[2]; d.data[i * 4 + 3] = a; }
    tc.putImageData(d, 0, 0); c.drawImage(t, 0, 0, W, H);
    const t2 = document.createElement('canvas'); t2.width = W; t2.height = H; const c2 = t2.getContext('2d'), d2 = c2.createImageData(W, H);
    for (let i = 0; i < W * H; i++) { const l = R() < .5; d2.data[i * 4] = l ? 255 : dark[0]; d2.data[i * 4 + 1] = l ? 240 : dark[1]; d2.data[i * 4 + 2] = l ? 225 : dark[2]; d2.data[i * 4 + 3] = R() * 13; }
    c2.putImageData(d2, 0, 0); c.drawImage(t2, 0, 0); }
  skinBake.k = key; skinBake.c = cv; return cv;
}
// the brow's hairs, made once: where each grows (t along from the nose outward, v across), how long, which way, which tone
function browHairs() {
  if (browHairs.h) return browHairs.h; const R = rnd(4242), B = [[], [], [], [], []];
  for (let i = 0; i < 1700; i++) {
    let t = Math.pow(R(), 1.25) * 1.1, v = (R() + R() + R()) / 1.5 - 1, stray = R() < .1, b;
    if (stray) { v *= 2.4; if (R() < .4) t = -R() * .13; }
    const edge = Math.min(1, Math.abs(v)), tail = sm(.55, 1.05, t), r = R();
    // tone: dark in the heart of the brow and low down, lighter at its top edge and toward the temple
    const lightness = edge * .5 + tail * .55 + (v < 0 ? .12 : 0) + (stray ? .35 : 0) + (r - .5) * .5;
    b = lightness < .22 ? 0 : lightness < .45 ? 1 : lightness < .7 ? 2 : lightness < .95 ? 3 : 4;
    B[b].push({ t, v, len: (.04 + R() * .04) * (stray ? .8 : 1) * (1 + .25 * sm(.2, .6, t)), ja: (R() - .5) * .5, bend: .25 + R() * .5 });
  }
  return browHairs.h = B;
}
function lashSet() {
  if (lashSet.h) return lashSet.h; const R = rnd(808), U = [[], []], Lo = [];
  for (let i = 0; i < 180; i++) U[R() < .5 ? 0 : 1].push({ t: .03 + Math.pow(R(), .85) * .86, len: .35 + R() * .85, ja: (R() - .5) * (R() < .2 ? 1.6 : .7), bend: (R() - .3) * .6 });
  for (let i = 0; i < 26; i++) Lo.push({ t: .08 + R() * .68, len: .5 + R() * .7, ja: (R() - .5) * .7 });
  return lashSet.h = { U, Lo };
}
function layer(i, W, H, k) { const L = layer.c || (layer.c = []); let cv = L[i]; const w = Math.ceil(W / k), h = Math.ceil(H / k); if (!cv || cv.width !== w || cv.height !== h) { cv = L[i] = document.createElement('canvas'); cv.width = w; cv.height = h; } const x = cv.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, w, h); return x; }
// a point on the smooth curve through P at t (0..1), the same Catmull-Rom as curve()
function crAt(P, t) {
  const n = Math.max(0, Math.min(.99999, t)) * (P.length - 1), i = Math.floor(n), u = n - i, a = P[Math.max(0, i - 1)], b = P[i], d = P[i + 1], e = P[Math.min(P.length - 1, i + 2)], u2 = u * u, u3 = u2 * u;
  const q = k => .5 * (2 * b[k] + (d[k] - a[k]) * u + (2 * a[k] - 5 * b[k] + 4 * d[k] - e[k]) * u2 + (3 * b[k] - a[k] - 3 * d[k] + e[k]) * u3);
  return [q(0), q(1)];
}
function hex3(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
// THE IRIS, baked once per look: polar texture (limbal ring, fibres, collarette, warm inner zone, crypts, furrows, soft pupil)
function irisTex(K) {
  const N = 288, cv = document.createElement('canvas'); cv.width = cv.height = N; const x = cv.getContext('2d'), im = x.createImageData(N, N), d = im.data;
  const L = hex3(K.iris[0]), M = hex3(K.iris[1]), D = hex3(K.iris[2]), R = rnd(4711), TAU = Math.PI * 2;
  const tab = n => { const a = []; for (let i = 0; i < n; i++) a.push(R()); return a; };
  const per = (T, v) => { const n = T.length, p = ((v % 1) + 1) % 1 * n, i = Math.floor(p), u = p - i, s = u * u * (3 - 2 * u); return T[i % n] + (T[(i + 1) % n] - T[i % n]) * s; };
  const T1 = tab(150), T2 = tab(61), T3 = tab(23), T4 = tab(9), T5 = tab(310), TL = tab(150), TC = tab(17), TW = tab(31), TF = tab(13);
  const crypt = []; for (let i = 0; i < 11; i++) crypt.push([R(), .5 + R() * .22, .012 + R() * .014, .03 + R() * .05, .25 + R() * .4]);
  const sm = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); }, PUP = .335, RO = N / 2 - 3;
  const hh = (ix, iy) => { const q = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453; return q - Math.floor(q); }, vn = (px, py) => { const ix = Math.floor(px), iy = Math.floor(py), fx = px - ix, fy = py - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy); return (hh(ix, iy) * (1 - ux) + hh(ix + 1, iy) * ux) * (1 - uy) + (hh(ix, iy + 1) * (1 - ux) + hh(ix + 1, iy + 1) * ux) * uy; };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const dx = (i + .5 - N / 2) / RO, dy = (j + .5 - N / 2) / RO, rho = Math.hypot(dx, dy), o = (j * N + i) * 4; if (rho > 1.03) { d[o + 3] = 0; continue; }
    let th = Math.atan2(dy, dx) / TAU + .5; th += (per(TW, th * 3 + rho * 1.7) - .5) * .012;
    const col = PUP + .15 + (per(TC, th) - .5) * .07 + (per(T2, th) - .5) * .03;
    // fibres: fine and coarse, each fibre with its own length (TL) so they end raggedly
    const fib = (per(T1, th) - .5) * .7 + (per(T5, th + rho * .01) - .5) * .8 + (per(T2, th) - .5) * .7 + (per(T3, th) - .5) * .6;
    const reach = .62 + per(TL, th) * .36, fk = sm(PUP + .02, col + .05, rho) * (1 - sm(reach - .12, reach + .04, rho) * .75);
    let v = .5 + (per(T4, th) - .5) * .16;
    v += ((vn(dx * 2.1 + 9, dy * 2.1 + 4) - .5) * .26 + (vn(dx * 5.3 + 2, dy * 5.3 + 7) - .5) * .16 + (vn(dx * 11 + 5, dy * 11 + 1) - .5) * .07) * sm(PUP + .03, .62, rho);
    v += fib * .15 * fk + (per(T3, th * 2 + rho * 2.5) - .5) * (per(TF, rho * 4 + th * 3) - .5) * .35;
    // inner (pupillary) zone a little paler with fine short rays; the collarette a pale broken ring
    const inner = 1 - sm(col - .05, col + .03, rho); v += inner * (.1 + (per(T1, th * 1.3) - .5) * .16);
    const cring = Math.exp(-Math.pow((rho - col) / .028, 2)); v += cring * (.13 + (per(T3, th * 2) - .5) * .12);
    // furrows: faint broken arcs in the outer zone
    v -= Math.exp(-Math.pow((rho - .78) / .012, 2)) * .08 * per(TF, th * 2) + Math.exp(-Math.pow((rho - .86) / .01, 2)) * .07 * per(TF, th * 3 + .4);
    for (const q of crypt) { let da = Math.abs(th - q[0]); da = Math.min(da, 1 - da); v -= q[4] * .28 * Math.exp(-(da * da) / (q[2] * q[2]) - Math.pow((rho - q[1]) / q[3], 2)); }
    // the limbal ring: soft and dark, a little uneven
    const lim = sm(.74 + (per(T4, th * 2) - .5) * .05, 1, rho); v -= lim * lim * .5;
    v = Math.max(0, Math.min(1, v));
    let r, g, b; if (v < .5) { const u = v * 2; r = D[0] + (M[0] - D[0]) * u; g = D[1] + (M[1] - D[1]) * u; b = D[2] + (M[2] - D[2]) * u; } else { const u = v * 2 - 1; r = M[0] + (L[0] - M[0]) * u; g = M[1] + (L[1] - M[1]) * u; b = M[2] + (L[2] - M[2]) * u; }
    // the warmer, yellower zone round the pupil
    const warm = (1 - sm(PUP, col + .1, rho)) * .55 + cring * .2; r += 20 * warm; g += 10 * warm; b -= 16 * warm;
    // pupil, soft-edged, not quite round
    const pe = PUP + (per(TC, th * 2 + .3) - .5) * .012, pk = 1 - sm(pe - .03, pe + .03, rho); r = r * (1 - pk) + 9 * pk; g = g * (1 - pk) + 8 * pk; b = b * (1 - pk) + 10 * pk;
    d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255 * (1 - sm(.95, 1.02, rho));
  }
  x.putImageData(im, 0, 0); return cv;
}
// lashes and veins, made once: places along the lid by parameter, so they move with it and never flicker
function eyeBits() {
  const R = rnd(977), up = [], lo = [], veins = [], wet = [];
  for (let k = 0; k < 40; k++) { const t0 = .03 + .82 * (k + R() * .8) / 40, n = 2 + Math.floor(R() * 3), lean = (R() - .5) * .35, big = .75 + R() * .5; for (let i = 0; i < n; i++) up.push({ t: t0 + (R() - .5) * .022, tip: (R() - .5) * .16, lean, len: big * (.8 + R() * .4), wd: .8 + R() * .7, bend: .12 + R() * .2, a: Math.floor(R() * 3) }); }
  for (let k = 0; k < 15; k++) { const t0 = .06 + .66 * (k + R() * .9) / 15, n = 1 + Math.floor(R() * 2.2), lean = (R() - .5) * .5; for (let i = 0; i < n; i++) lo.push({ t: t0 + (R() - .5) * .02, tip: (R() - .5) * .2, lean, len: .6 + R() * .7, wd: .6 + R() * .5, bend: .1 + R() * .2, a: Math.floor(R() * 3) }); }
  for (let k = 0; k < 9; k++) { const inner = k % 2, p = []; let u = inner ? .95 - R() * .05 : .03 + R() * .05, v = .25 + R() * .55; const n = 4 + Math.floor(R() * 3), du = (inner ? -1 : 1) * (.03 + R() * .035); for (let i = 0; i < n; i++) { p.push([u, v]); u += du * (.7 + R() * .6); v += (R() - .5) * .16; } veins.push({ p, a: .1 + R() * .14, w: .5 + R() * .5 }); }
  for (let k = 0; k < 9; k++) wet.push(.25 + R() * .75);
  return { up, lo, veins, wet };
}
// LOWER LID, OUTER END. Measured the same way on eleven real faces, the lower lid's outer quarter climbs about 20 degrees
// (sd 7) to the outer corner, which sits about 2.5 degrees above the inner one; the clip's own eyes measure 32 and 5, at
// the high end. LID_EASE takes the drawing part of the way toward the average: 0 = exactly the clip, 1 = the average eye.
const LID_EASE = .8;
const WIDE_AT = .112, WIDE_FULL = .15, WIDE_LIFT = .044;
function wideOf(open0) { const t = Math.max(0, Math.min(1, (open0 - WIDE_AT) / (WIDE_FULL - WIDE_AT))); return t * t * (3 - 2 * t); }
function widen(up, open0) { const k = wideOf(open0) * WIDE_LIFT, n = up.length - 1; if (k) for (let i = 1; i < n; i++) up[i] = [up[i][0], up[i][1] - k * Math.pow(Math.sin(Math.PI * i / n), .7)]; }
// the tracker's muscle readings at frame f, as change from the clip's rest: cheek = the squint of a smile or of strain (not
// a blink), inner = inner brows drawn up (sorrow, fear, pleading), down = brows pulled down, raise = brows lifted
function muscles(f) {
  if (!EYES.bs) return { cheek: 0, inner: 0, down: 0, raise: 0 };
  const i = Math.floor(f), j = Math.min(EYES.n - 1, i + 1), u = f - i, A = EYES.bs[i], B = EYES.bs[j], R = EYES.rest, v = k => A[k] + (B[k] - A[k]) * u, cl = x => Math.max(0, Math.min(1, x)), s = x => x * x * (3 - 2 * x);
  // the cheeks rise with the mouth's smile too (a broad smile or a grimace with the eyes still open), which the eye readings alone miss
  return { cheek: Math.max(s(cl((v(0) - R[0]) / .13)) * (1 - s(cl((v(5) - .4) / .16))), A.length > 6 ? s(cl((v(6) - R[6] - .08) / .62)) : 0), inner: s(cl((v(1) - R[1]) / .26)), down: s(cl((v(2) - R[2]) / .3)), raise: s(cl((v(3) - R[3]) / .55)) };
}
const WRINKLE = .62;
// A TEAR, after photographs of real ones: it gathers on the lower lid, creeps, then runs down the cheek in little starts,
// leaving a thin wet track that glints (a bright thread with a faint dark edge) and dries behind it; the bead at its end
// is a clear drop: dark at its lower rim, a sharp highlight above, a pale crescent of light inside below.
function tears(c, ED, list, px, K) {
  for (const T of list) { const D = ED.find(d => d.e === T.e); if (!D || !(T.t > 0)) continue;
    // it wells at the inner corner (where the lids drain) and spills over the lower lid there, then runs down beside the nose
    const lo = D.lo, k = T.at == null ? .84 : T.at, n = k * (lo.length - 1), i = Math.min(lo.length - 2, Math.floor(n)), u = n - i, p0 = [lo[i][0] + (lo[i + 1][0] - lo[i][0]) * u, lo[i][1] + (lo[i + 1][1] - lo[i][1]) * u + D.w * .004];
    const grow = Math.min(1, T.t / 1.2), t2 = Math.max(0, T.t - 1.2) * (T.speed || 1), creep = Math.min(t2, .8) * .02, run = Math.max(0, t2 - .8), dist = Math.min(T.max || .42, creep + .06 * Math.pow(run, 1.3) + .005 * Math.sin(run * 2.4) * Math.min(1, run));
    const X = s => p0[0] + D.sgn * (.05 * (1 - Math.exp(-s * 9)) - .02 * Math.min(1, s * 3)) + .004 * Math.sin(s * 23 + (T.e === 'R' ? 0 : 2)) * Math.min(1, s * 10), Y = s => p0[1] + s, N = Math.max(3, Math.ceil(dist / .006));
    const path = off => { c.beginPath(); for (let j = 0; j <= N; j++) { const s = dist * j / N; j ? c.lineTo(X(s) + off, Y(s)) : c.moveTo(X(s) + off, Y(s)); } };
    const wd = .0085 * (.6 + .4 * grow), fade = a => { const g = c.createLinearGradient(0, p0[1], 0, p0[1] + Math.max(.02, dist)); g.addColorStop(0, a(.55)); g.addColorStop(.5, a(.8)); g.addColorStop(1, a(1)); return g; };
    c.lineCap = 'round'; c.lineJoin = 'round'; c.save(); c.globalAlpha = T.a == null ? 1 : Math.max(0, Math.min(1, T.a));
    // the wet streak: skin seen darker through water, a bright edge where it catches the light, a fainter one on its other side
    path(0); c.strokeStyle = fade(a => 'rgba(96,52,46,' + (.2 * a).toFixed(3) + ')'); c.lineWidth = wd * 2.1; c.stroke();
    path(0); c.strokeStyle = fade(a => 'rgba(255,240,232,' + ((K.dark ? .1 : .16) * a).toFixed(3) + ')'); c.lineWidth = wd * 1.3; c.stroke();
    path(-wd * .55); c.strokeStyle = fade(a => 'rgba(255,253,250,' + ((K.dark ? .5 : .78) * a).toFixed(3) + ')'); c.lineWidth = wd * .42; c.stroke();
    path(wd * .7); c.strokeStyle = fade(a => 'rgba(255,250,246,' + (.22 * a).toFixed(3) + ')'); c.lineWidth = wd * .22; c.stroke();
    // the drop at its end: about a third of the iris across, clear, dark at its lower rim, a sharp window of light above, a pale crescent inside below
    const bx = X(dist), by = Y(dist), sp = run > 0 ? Math.min(1, run * .5) : 0, rx = .0185 * grow, ry = (.024 + .012 * sp) * grow;
    c.save(); c.translate(bx, by + ry * .25);
    const drop = () => { c.beginPath(); c.moveTo(0, -ry * 1.7); c.bezierCurveTo(rx * .35, -ry * .9, rx * 1.12, -ry * .1, rx, ry * .42); c.bezierCurveTo(rx * .85, ry * 1.12, -rx * .85, ry * 1.12, -rx, ry * .42); c.bezierCurveTo(-rx * 1.12, -ry * .1, -rx * .35, -ry * .9, 0, -ry * 1.7); };
    c.fillStyle = 'rgba(60,30,28,.22)'; c.save(); c.translate(rx * .12, ry * .16); drop(); c.fill(); c.restore();
    let g = c.createRadialGradient(-rx * .15, -ry * .1, rx * .1, 0, ry * .1, ry * 1.25); g.addColorStop(0, 'rgba(255,246,240,.2)'); g.addColorStop(.55, 'rgba(250,226,214,.2)'); g.addColorStop(.85, 'rgba(120,70,62,.34)'); g.addColorStop(1, 'rgba(70,36,32,.5)'); c.fillStyle = g; drop(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.34)'; c.beginPath(); c.ellipse(rx * .12, ry * .62, rx * .6, ry * .2, .1, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.ellipse(-rx * .36, -ry * .12, rx * .24, ry * .3, -.35, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(rx * .3, -ry * .5, rx * .09, 0, 7); c.fill();
    c.restore(); c.restore(); }
}
function canthus(up, lo) {
  const n = lo.length - 1, o = lo[0].slice(), i = lo[n], k = 1 - .37 * LID_EASE, drop = .017 * LID_EASE;
  // the lower lid's sag below its own corner line a little shallower
  for (let j = 1; j < n; j++) { const t = (lo[j][0] - o[0]) / ((i[0] - o[0]) || 1), base = o[1] + (i[1] - o[1]) * t; lo[j] = [lo[j][0], base + (lo[j][1] - base) * k]; }
  // the outer corner a touch lower (both lids, eased over the outer third)
  for (let j = 0; j < 3; j++) { const d = drop * (1 - j / 3); up[j] = [up[j][0], up[j][1] + d]; lo[j] = [lo[j][0], lo[j][1] + d]; }
}
function drawEyes(c, W, H, f, lookName) {
  const K = LOOKS[lookName] || LOOKS.western, EC = [], S = W / 1.62, cx = W / 2, cy = H * (drawEyes.cyK || .56);
  c.save(); c.clearRect(0, 0, W, H);
  c.drawImage(skinBake(W, H, K, LOOKS[lookName] ? lookName : 'western'), 0, 0);
  const px = 1 / S; let g;
  // FORM IS SHADED, NOT DRAWN: two small layers, painted with plain shapes and stretched up over the skin, so every
  // shade has a soft edge (s2 broad: sockets, bags; s1 closer: brow mass, the hood's shade, the hollows of folds)
  const K1 = 5, K2 = 13, s1 = layer(0, W, H, K1), s2 = layer(1, W, H, K2);
  s1.setTransform(S / K1, 0, 0, S / K1, cx / K1, cy / K1); s2.setTransform(S / K2, 0, 0, S / K2, cx / K2, cy / K2);
  const pinkRGB = hexRGB(K.pink).join(','), browRGB = hexRGB(K.brow), skinRGB = hexRGB(K.skin[0]);
  const dk = a => K.lid + Math.max(0, a).toFixed(3) + ')', dkRGB = K.lid.match(/\d+/g).map(v => Math.round(v * .32)).join(','), dk2 = a => 'rgba(' + dkRGB + ',' + Math.max(0, a).toFixed(3) + ')', lt = a => 'rgba(255,236,218,' + Math.max(0, a).toFixed(3) + ')', pk = a => 'rgba(' + pinkRGB + ',' + Math.max(0, a).toFixed(3) + ')';
  const hairCol = (m, a) => 'rgba(' + browRGB.map((v, i) => Math.round(v + (skinRGB[i] * 1.05 - v) * m)).join(',') + ',' + (+a).toFixed(3) + ')';
  const blob = (x, y, rx, ry, rot, col, t) => { t = t || s2; t.save(); t.translate(x, y); if (rot) t.rotate(rot); t.scale(rx, ry); const gg = t.createRadialGradient(0, 0, 0, 0, 0, 1); gg.addColorStop(0, col(1)); gg.addColorStop(.5, col(.55)); gg.addColorStop(1, col(0)); t.fillStyle = gg; t.fillRect(-1, -1, 2, 2); t.restore(); };
  const poly = (t, A, B, col) => { t.beginPath(); t.moveTo(A[0][0], A[0][1]); for (const p of A) t.lineTo(p[0], p[1]); for (let i = B.length - 1; i >= 0; i--) t.lineTo(B[i][0], B[i][1]); t.closePath(); t.fillStyle = col; t.fill(); };
  // a fold: its soft hollow and the lit ridge beside it go into the soft layer now; its fine tapering crease is kept for later
  const cores = [];
  const fold = (p, w, a, rx, ry, prof, n) => { if (a < .012) return; const q = samp(p, n || 18), pf = prof || PROF;
    s1.fillStyle = dk(a * .5); taper(s1, q, t => w * 4.2 * pf(t)); s1.fillStyle = dk(a * .45); taper(s1, q, t => w * 2 * pf(t));
    if (rx || ry) { s1.fillStyle = lt(a * .42 * Math.min(1, Math.hypot(rx, ry) * 3)); taper(s1, q, t => w * 3.4 * pf(t), rx * w * 3.4, ry * w * 3.4); }
    cores.push([q, w, a * .22, pf]); };
  const at = (P, t) => { const m = P.length - 1, n = t * m, i = Math.max(0, Math.min(m - 1, Math.floor(n))), u = n - i; return [P[i][0] + (P[i + 1][0] - P[i][0]) * u, P[i][1] + (P[i + 1][1] - P[i][1]) * u]; };
  const TH = [[-.13, -.004, .022], [0, .008, .038], [.25, .022, .042], [.5, .03, .037], [.75, .026, .025], [1.2, .006, .012]];
  const th = t => { let i = 0; while (i < TH.length - 2 && t > TH[i + 1][0]) i++; const a = TH[i], b = TH[i + 1], u = Math.max(0, Math.min(1, (t - a[0]) / (b[0] - a[0]))); return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; };
  const ED = [];
  const MU = muscles(f), FX = drawEyes.fx || {};
  // an asked-for feeling laid over the clip: sorrow lifts the inner brows, lets the outer lids hang and tightens the cheeks a little
  if (FX.sorrow) { MU.inner = Math.max(MU.inner, FX.sorrow); MU.cheek = Math.max(MU.cheek, .22 * FX.sorrow); }
  for (const e of ['R', 'L']) {
    const up = pts(e, 'up', f), lo = pts(e, 'lo', f), cr = pts(e, 'cr', f), ir = pts(e, 'ir', f), bu = pts(e, 'bu', f), bl = pts(e, 'bl', f), un = pts(e, 'un', f);
    // INNER BROWS: when they are drawn up, the brow's inner end lifts and its outer tail settles, so the brow slants (the
    // tracker's brow points hardly show it; its muscle reading does)
    { const k = MU.inner, lift = [.008, 0, -.004, -.017, -.034]; for (let i = 0; i < 5; i++) { bl[i] = [bl[i][0], bl[i][1] + lift[i] * k]; bu[i] = [bu[i][0], bu[i][1] + lift[i] * k * 1.1]; } }
    const open0 = lo[4][1] - up[4][1], kO = (t => t * t * (3 - 2 * t))(Math.max(0, Math.min(1, (open0 - .026) / .046))) * .88;
    for (let i = 0; i < up.length; i++) { up[i] = [up[i][0], lo[i][1] + (up[i][1] - lo[i][1]) * kO]; }
    widen(up, open0); const tip0 = up[0].slice(), wideK = wideOf(open0); canthus(up, lo);
    if (FX.sorrow) for (let i = 0; i < 5; i++) up[i] = [up[i][0], up[i][1] + FX.sorrow * (FX.droop == null ? .013 : FX.droop) * (1 - i / 5) * Math.min(1, open0 / .08)];
    const sgn = e === 'R' ? -1 : 1, outer = up[0], inner = up[up.length - 1], mid = [(outer[0] + inner[0]) / 2, (outer[1] + inner[1]) / 2], w = Math.abs(outer[0] - inner[0]);
    EC.push([mid[0], (up[4][1] + lo[4][1]) / 2, w]); const open = lo[4][1] - up[4][1], openK = Math.max(0, Math.min(1, open / .09));
    // how hard he squints: from the lids' opening and from how low the brow has come
    const sq = Math.max(MU.cheek, Math.max(0, Math.min(1, (.118 - open0) / .05))), bq = Math.max(0, Math.min(1, (bl[2][1] + .18) / .028)), wr = WRINKLE * Math.min(1, Math.max(.12 * sq + .95 * bq, .9 * MU.cheek)), shut = 1 - openK;
    // the brow's line, from the nose (t 0) outward (t 1) and a little beyond both ends
    const P = t => { const s = 1 - t; if (s >= 0 && s <= 1) return at(bl, s); return s < 0 ? [bl[0][0] + (bl[0][0] - bl[1][0]) * -s * 4, bl[0][1] + (bl[0][1] - bl[1][1]) * -s * 4 + s * s * .08] : [bl[4][0] + (bl[4][0] - bl[3][0]) * (s - 1) * 3.2, bl[4][1] + (bl[4][1] - bl[3][1]) * (s - 1) * 1.2]; };
    // the hood: his brow skin hangs low; its fold lies on the crease when the eye is open and lifts as the lid comes down
    const F = cr.map((p, i) => { const b = at(bl, i / 6), u = at(up, Math.min(1, Math.max(0, (i + .6) / 7.2))), k = Math.sin(Math.PI * (i + .5) / 7); return [p[0], p[1] + (b[1] - p[1]) * .3 * shut + Math.max(0, u[1] - p[1]) * .42 * openK * k]; });
    const Fq = samp(F, 20), upq = samp(up, 20), loq = samp(lo, 20);
    ED.push({ e, up, lo, cr, ir, bl, un, sgn, outer, inner, mid, w, open, openK, shut, wr, sq, P, F, Fq, upq, loq, wideK });
    // THE SOCKET: the hollow between the brow's head and the inner corner, the nose's side
    blob(inner[0] + sgn * .035, inner[1] - .068, .13, .06, sgn * .22, a => dk(a * .62));
    blob(inner[0] + sgn * .07, inner[1] - .075, .09, .035, sgn * .2, a => pk(a * .3));
    blob(inner[0] - sgn * .035, inner[1] - .015, .04, .11, -sgn * .12, a => dk(a * .34));
    blob(mid[0], mid[1] - .035, w * .8, .11, 0, a => dk(a * .2));
    // the brow's mass and, under it, its shade on the hooded skin down to the fold (deepest to the nose)
    const bt = [], bb = [], bc0 = [], bc1 = [];
    for (let i = 0; i <= 22; i++) { const t = -.1 + i / 22 * 1.22, p = P(t), d = th(t), k = Math.sin(Math.PI * Math.min(1, Math.max(0, (i + .5) / 23))) ** .5; bt.push([p[0], p[1] + d[0] - d[1] * k]); bb.push([p[0], p[1] + d[0] + d[1] * .85 * k]); if (t > -.02 && t < .8) { const k2 = Math.sin(Math.PI * (t + .02) / .82) ** .6; bc0.push([p[0], p[1] + d[0] - d[1] * .45 * k2]); bc1.push([p[0], p[1] + d[0] + d[1] * .5 * k2]); } }
    poly(s1, bt, bb, hairCol(.1, .22)); poly(s1, bc0, bc1, hairCol(0, .36));
    { const A = [], B = []; for (let i = 0; i <= 12; i++) { const u = i / 12, t = .92 - u * .9, p = P(t), d = th(t), fq = Fq[Math.round(u * 20)]; A.push([p[0], p[1] + d[0]]); B.push([fq[0], fq[1] + .006]); }
      g = s1.createLinearGradient(outer[0], 0, inner[0], 0); { const o = .25 + .75 * openK; g.addColorStop(0, dk2(0)); g.addColorStop(.12, dk2(.13 * o)); g.addColorStop(.45, dk2(.24 * o)); g.addColorStop(.62, dk2(.2 * o)); g.addColorStop(.78, dk2(.09 * o)); g.addColorStop(.92, dk2(.02 * o)); g.addColorStop(1, dk2(0)); } poly(s1, A, B, g); }
    // the lid between fold and lashes: in shade when open, a pale smooth dome when shut
    g = s1.createLinearGradient(inner[0], 0, outer[0], 0); g.addColorStop(0, dk2(.06 + .16 * openK)); g.addColorStop(.5, dk2(.03 + .16 * openK)); g.addColorStop(1, dk2(.03 + .18 * openK)); poly(s1, Fq, upq, g); poly(s1, Fq, upq, pk(.04 + .1 * shut));
    blob(mid[0] + sgn * .03, (F[3][1] + up[4][1]) / 2 + .006, w * .36, Math.max(.012, (up[4][1] - F[3][1]) * .55), 0, a => lt(a * (.02 + .34 * shut)), s1);
    // the hooded skin above the fold, full and lit toward the temple
    blob(outer[0] - sgn * .07, F[1][1] - .022, .09, .024, sgn * .4, a => lt(a * .2));
    blob(mid[0], mid[1] - .012, w * .8, w * .47, 0, a => dk(a * .27)); blob(inner[0] - sgn * .028, inner[1] - .022, .075, .115, 0, a => dk(a * .32)); blob(mid[0] + sgn * .02, lo[4][1] + .082, w * .5, .034, 0, a => dk(a * .17));
    // UNDER THE EYE: the bag (lit on its swell, shaded where it turns under), the tear trough from the inner corner
    const bagH = un[4][1] - lo[4][1];
    blob(mid[0] - sgn * .01, lo[4][1] + bagH * .5, w * .46, bagH * .4, 0, a => lt(a * (.1 + .08 * wr)));
    blob(inner[0] + sgn * .04, inner[1] + .05, .075, .035, sgn * .55, a => dk(a * .36));
    blob(inner[0] + sgn * .035, inner[1] + .04, .08, .035, sgn * .5, a => pk(a * .26));
    { const q = samp(un.slice(1), 16); s2.fillStyle = dk(.05 + .1 * wr); taper(s2, q, t => .05 * Math.sin(Math.PI * Math.min(1, .15 + t * .85)) ** .9 * (.2 + .8 * t), 0, -.004); s2.fillStyle = lt(.07); taper(s2, q, t => .05 * PROF(t), 0, .045); }
    fold(un.slice(4), .007, .1 + .2 * wr, 0, 1, t => Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.04)), .8) * (.15 + .85 * t * t), 18); fold(un.slice(1, 6), .0065, .26 * wr, 0, 1, t => Math.pow(Math.sin(Math.PI * t), 1.2));
    
    fold(lo.slice(1, 8).map((p, i) => [p[0] + sgn * .006, p[1] + .022 + .005 * Math.sin(i * 1.3)]), .0042, .1 + .22 * sq, 0, 1);
    fold(lo.slice(3, 7).map((p, i) => [p[0] + sgn * .02, p[1] + .045 + .004 * Math.cos(i * 1.7)]), .004, .03 + .22 * wr, 0, 1);
    // CROW'S FEET: long soft creases sweeping out and down from the outer corner; hardly there at rest, deep in a squint
    for (const [Q, k, w0] of [[[[.022, .012], [.1, .02], [.19, .046]], 1, .0065], [[[.03, .032], [.085, .056], [.15, .1]], .8, .006], [[[.04, -.004], [.09, -.014], [.15, -.012]], .45, .005], [[[.042, .055], [.066, .088], [.085, .13]], .5, .005], [[[.075, .03], [.13, .046], [.2, .08]], .55, .0045]])
      fold(Q.map(q => [outer[0] + sgn * q[0], outer[1] + q[1] - .006 * wr]), w0, k * (.03 + .42 * wr * wr + .1 * wr), 0, 1, t => Math.pow(Math.sin(Math.PI * Math.min(1, .1 + t * .9)), .9), 12);
    // the hood's fold: over the eye and on past the outer corner, where it hangs lowest; its shade on the lid below
    const Fl = [[inner[0] + sgn * .014, inner[1] - .028], ...F.slice().reverse().slice(1), [outer[0] + sgn * .06, outer[1] - .002 + .012 * shut], [outer[0] + sgn * .085, outer[1] + .03]];
    s1.fillStyle = dk(.2 + .12 * openK); taper(s1, samp(Fl, 26), t => .04 * Math.pow(Math.sin(Math.PI * t), .6), 0, .014); s1.fillStyle = dk2(.5 * openK); taper(s1, Fq, t => .04 * Math.pow(Math.sin(Math.PI * Math.min(1, .12 + t * .88)), .6), 0, -.008);
    fold(Fl, .0095, .42 + .2 * openK + .2 * wr, 0, -.45 * shut, t => Math.pow(Math.sin(Math.PI * Math.min(1, .03 + t * .97)), .7) * (.5 + .5 * Math.sin(Math.PI * Math.min(1, t * 1.2))), 28);
    blob(outer[0] + sgn * .03, outer[1] + .004, .05, .03, sgn * .5, a => dk(a * (.3 + .2 * wr)), s1);
  }
  // BETWEEN THE BROWS: upright frown lines that deepen as the brows come down and in, and a crease across the nose's root
  { const a = ED[0], b = ED[1], wr = Math.max(WRINKLE * MU.down, (a.wr + b.wr) / 2 * (1 - MU.cheek)), x0 = a.bl[4][0], x1 = b.bl[4][0], y0 = (a.bl[4][1] + b.bl[4][1]) / 2;
    // inner brows drawn up: two short creases slanting up and in from the brows' heads (the brow of sorrow and pleading)
    if (MU.inner > .02) for (const sx of [-1, 1]) { const x = sx < 0 ? x0 : x1; fold([[x - sx * .012, y0 - .012], [x - sx * .03, y0 - .045], [x - sx * .04, y0 - .085]], .0055, .2 * MU.inner, sx, 0, t => Math.pow(Math.sin(Math.PI * Math.min(1, .15 + t * .85)), 1.1), 10); }
    for (const [u, top, len, cv, k] of [[.33, -.1, .12, .004, 1], [.66, -.085, .085, -.003, .8], [.5, -.13, .06, .002, .4]]) { const x = x0 + (x1 - x0) * u, sx = u < .5 ? -1 : 1;
      fold([[x + cv, y0 + top], [x - cv * .6, y0 + top + len * .5], [x + cv * .4, y0 + top + len]], .006, k * (.03 + .2 * wr), sx, 0, t => Math.pow(Math.sin(Math.PI * t), 1.5), 10); }
    fold([[x0 * .45, y0 + .1], [0, y0 + .107], [x1 * .45, y0 + .1]], .005, .02 + .3 * wr * wr, 0, 1, null, 10);
    blob(0, y0 + .02, .09, .12, 0, a => lt(a * .1)); }
  c.imageSmoothingEnabled = true; c.drawImage(s2.canvas, 0, 0, s2.canvas.width * K2, s2.canvas.height * K2); c.drawImage(s1.canvas, 0, 0, s1.canvas.width * K1, s1.canvas.height * K1);
  c.translate(cx, cy); c.scale(S, S);
  // the folds' fine creases, thin and tapering to nothing
  for (const [q, w0, a, pf] of cores) { c.fillStyle = dk(a); taper(c, q, t => w0 * .8 * pf(t)); }
  for (const D of ED) {
    const { e, up, lo, cr, ir, bl, un, sgn, outer, inner, mid, w, open, openK, shut, wr, sq, P, F, Fq, upq, loq } = D;
    // the opening
    const BITS = drawEyes._bits || (drawEyes._bits = eyeBits()), TEX = (drawEyes._tex || (drawEyes._tex = {}))[lookName] || (drawEyes._tex[lookName] = irisTex(K));
    const sm = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
    const shutK = 1 - sm(.02, .3, openK), lashK = sm(.08, .5, openK), box = () => c.fillRect(mid[0] - w, mid[1] - w, 2 * w, 2 * w);
    const hole = () => { c.beginPath(); curve(c, up, true); curve(c, lo.slice().reverse(), false); c.closePath(); };
    // a point inside the opening: u along it (outer to inner corner), v from upper lid to lower
    const inEye = (u, v) => { const a = crAt(up, u), b = crAt(lo, u); return [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v]; };
    // the iris as in head shots: about .46 of the eye's width (the tracker's ring is too small), sitting on the lower lid, its top under the upper lid
    const CEN = .45, r = (Math.hypot(ir[1][0] - ir[0][0], ir[1][1] - ir[0][1]) + Math.hypot(ir[2][0] - ir[0][0], ir[2][1] - ir[0][1]) + Math.hypot(ir[3][0] - ir[0][0], ir[3][1] - ir[0][1]) + Math.hypot(ir[4][0] - ir[0][0], ir[4][1] - ir[0][1])) / 4 * 1.36, icy0 = ir[0][1] + ((up[4][1] + lo[4][1]) / 2 - .012 - ir[0][1]) * CEN * .5, ic = [ir[0][0] + (mid[0] - ir[0][0]) * CEN, icy0 + (lo[4][1] + r * .1 - r - icy0) * .7];
    if (open > .004) {
      c.save(); hole(); c.clip();
      c.fillStyle = K.white; box(); if (K.dark) { c.fillStyle = 'rgba(40,28,24,.3)'; box(); }
      // the ball is round: grey-blue falling away to both corners, from the iris outward
      g = c.createRadialGradient(ic[0], ic[1] + w * .03, w * .12, ic[0], ic[1] + w * .03, w * .56); g.addColorStop(0, 'rgba(84,90,112,0)'); g.addColorStop(.55, 'rgba(84,90,112,.2)'); g.addColorStop(1, 'rgba(70,70,92,.62)'); c.fillStyle = g; box();
      // warmer and a little pink toward the nose
      g = c.createRadialGradient(inner[0], inner[1], 0, inner[0], inner[1], w * .34); g.addColorStop(0, 'rgba(128,116,116,.34)'); g.addColorStop(.45, 'rgba(128,116,116,.13)'); g.addColorStop(1, 'rgba(128,116,116,0)'); c.fillStyle = g; box();
      // a few faint veins, wandering in from the corners
      c.lineCap = 'round'; if (0) for (const vn of BITS.veins) { c.beginPath(); curve(c, vn.p.map(q => inEye(q[0], q[1])), true); c.strokeStyle = 'rgba(168,74,70,' + vn.a + ')'; c.lineWidth = vn.w * px; c.stroke(); }
      // plica (the pale pink fold) and the caruncle (the small wet bump) in the inner corner
      { const cc = inEye(.925, .6), pl = inEye(.87, .5), a0 = sgn > 0 ? 0 : Math.PI;
        g = c.createRadialGradient(pl[0], pl[1], 0, pl[0], pl[1], w * .05); g.addColorStop(0, 'rgba(206,186,178,.4)'); g.addColorStop(1, 'rgba(206,186,178,0)'); c.fillStyle = g; box();
        c.beginPath(); c.ellipse(inner[0], cc[1], w * .105, w * .07, 0, a0 - 1.1, a0 + 1.1); c.strokeStyle = 'rgba(112,92,88,.24)'; c.lineWidth = 2.2 * px; c.stroke();
        g = c.createRadialGradient(cc[0] + sgn * w * .015, cc[1], 0, cc[0], cc[1], w * .075); g.addColorStop(0, K.pink); g.addColorStop(.55, K.pink); g.addColorStop(1, 'rgba(180,110,100,0)'); c.fillStyle = g; c.globalAlpha = .85; c.beginPath(); c.ellipse(cc[0], cc[1], w * .075, w * .055, 0, 0, 7); c.fill(); c.globalAlpha = 1;
        c.fillStyle = 'rgba(255,250,244,.75)'; c.beginPath(); c.ellipse(cc[0] + sgn * w * .004, cc[1] + w * .002, w * .02, w * .0065, -sgn * .4, 0, 7); c.fill();
        c.fillStyle = 'rgba(255,250,244,.4)'; c.beginPath(); c.ellipse(cc[0] + sgn * w * .038, cc[1] + w * .016, w * .008, w * .004, -sgn * .3, 0, 7); c.fill(); }
      // the iris: a soft contact shade on the white round it, then the baked texture (mirrored in the other eye)
      g = c.createRadialGradient(ic[0], ic[1], r * .9, ic[0], ic[1], r * 1.22); g.addColorStop(0, 'rgba(40,46,60,.3)'); g.addColorStop(1, 'rgba(40,46,60,0)'); c.fillStyle = g; c.beginPath(); c.arc(ic[0], ic[1], r * 1.22, 0, 7); c.fill();
      { const gx = c.createLinearGradient(outer[0], 0, inner[0], 0), sc = K.dark ? '40,30,34' : '104,74,78', pkc = K.dark ? '44,34,36' : '116,92,92'; gx.addColorStop(0, 'rgba(' + sc + ',.88)'); gx.addColorStop(.1, 'rgba(' + sc + ',.6)'); gx.addColorStop(.22, 'rgba(' + sc + ',.24)'); gx.addColorStop(.34, 'rgba(' + sc + ',0)'); gx.addColorStop(.66, 'rgba(' + pkc + ',0)'); gx.addColorStop(.78, 'rgba(' + pkc + ',.22)'); gx.addColorStop(.9, 'rgba(' + pkc + ',.6)'); gx.addColorStop(1, 'rgba(' + pkc + ',.9)'); c.fillStyle = gx; box(); }
      c.save(); c.translate(ic[0], ic[1]); c.scale(sgn, 1); c.drawImage(TEX, -r * 1.02, -r * 1.02, r * 2.04, r * 2.04); c.restore();
      // the cornea: light gathered on the side away from the window, a faint broad sheen above
      g = c.createRadialGradient(ic[0] - r * .34, ic[1] + r * .42, 0, ic[0] - r * .34, ic[1] + r * .42, r * .7); g.addColorStop(0, 'rgba(235,245,255,.17)'); g.addColorStop(1, 'rgba(235,245,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(ic[0], ic[1], r, 0, 7); c.fill();
      g = c.createLinearGradient(ic[0] - r, ic[1] - r, ic[0] + r * .4, ic[1] + r * .3); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.45, 'rgba(255,255,255,.07)'); g.addColorStop(.62, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(ic[0], ic[1], r * .97, 0, 7); c.fill();
      // the upper lid and its lashes shade the top of the ball, most on the iris
      const lidY = crAt(up, .5)[1];
      (drawEyes.geo = drawEyes.geo || {})[e] = { up: up.map(p => p.slice()), lo: lo.map(p => p.slice()), ic: ic.slice(), r };
      c.save(); c.beginPath(); c.arc(ic[0], ic[1], r * 1.02, 0, 7); c.clip(); g = c.createLinearGradient(0, lidY, 0, lidY + r * 1.15); g.addColorStop(0, 'rgba(8,10,16,' + (.62 - .4 * D.wideK) + ')'); g.addColorStop(.3, 'rgba(8,10,16,' + (.3 - .2 * D.wideK) + ')'); g.addColorStop(1, 'rgba(8,10,16,0)'); c.fillStyle = g; box(); c.restore();
      c.lineCap = 'butt'; // (one blurred stroke, thrown down from far above the picture: many thin passes showed as contour lines)
      { const OFF = 3000; c.save(); c.shadowColor = 'rgba(24,16,20,' + (.8 - .5 * D.wideK) + ')'; c.shadowBlur = w * S * .07; c.shadowOffsetY = OFF; c.beginPath(); curve(c, up.map(p => [p[0], p[1] - OFF * px]), true); c.strokeStyle = '#000'; c.lineWidth = w * .1; c.stroke(); c.restore(); }
      // the window, a real reflection: the same place in both eyes, across the pupil's edge; a dimmer second pane, a ghost low in the pupil
      { const hx = ic[0] + r * .2, hy = ic[1] - r * .23, q = (x0, y0, ww, hh, sk) => { c.beginPath(); c.moveTo(x0 - ww, y0 - hh + sk); c.quadraticCurveTo(x0, y0 - hh * 1.25, x0 + ww, y0 - hh - sk); c.lineTo(x0 + ww * .94, y0 + hh - sk); c.quadraticCurveTo(x0, y0 + hh * .8, x0 - ww * .94, y0 + hh + sk); c.closePath(); c.fill(); };
        g = c.createRadialGradient(hx, hy, 0, hx, hy, r * .3); g.addColorStop(0, 'rgba(225,238,255,.3)'); g.addColorStop(1, 'rgba(225,238,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(hx, hy, r * .3, 0, 7); c.fill();
        c.fillStyle = 'rgba(255,255,255,.3)'; q(hx, hy, r * .17, r * .075, r * .012); c.fillStyle = 'rgba(255,255,255,.93)'; q(hx, hy, r * .14, r * .05, r * .012);
        c.fillStyle = 'rgba(240,246,255,.42)'; c.beginPath(); c.ellipse(hx - r * .4, hy + r * .03, r * .045, r * .04, 0, 0, 7); c.fill(); c.fillStyle = 'rgba(240,246,255,.5)'; c.beginPath(); c.ellipse(hx + r * .23, hy + r * .1, r * .028, r * .034, 0, 0, 7); c.fill();
        g = c.createRadialGradient(ic[0] + r * .1, ic[1] + r * .13, 0, ic[0] + r * .1, ic[1] + r * .13, r * .13); g.addColorStop(0, 'rgba(170,190,215,.3)'); g.addColorStop(1, 'rgba(170,190,215,0)'); c.fillStyle = g; c.beginPath(); c.arc(ic[0] + r * .1, ic[1] + r * .13, r * .13, 0, 7); c.fill(); }
      if (FX.wet) {
        // tears standing along the lower lid: a bright rim of water, thickest toward the inner corner
        c.lineCap = 'round'; for (const [lw, al] of [[.03, .1], [.016, .2], [.007, .34]]) { c.beginPath(); curve(c, lo.slice(2, 8).map(p => [p[0], p[1] - w * .012]), true); c.strokeStyle = 'rgba(255,252,248,' + (al * FX.wet).toFixed(3) + ')'; c.lineWidth = w * lw; c.stroke(); } }
      // the wet line where the ball meets the lower lid: bright, thin and broken
      c.lineCap = 'round'; for (let i = 0; i < 9; i++) { const t0 = .1 + i * .092, P = [crAt(lo, t0), crAt(lo, t0 + .045), crAt(lo, t0 + .09)].map(p => [p[0], p[1] - 1.3 * px]); c.beginPath(); curve(c, P, true); c.strokeStyle = 'rgba(255,250,246,' + ((K.dark ? .1 : .2) * BITS.wet[i]).toFixed(3) + ')'; c.lineWidth = (1 + BITS.wet[i]) * px; c.stroke(); }
      c.strokeStyle = 'rgba(70,40,50,.022)'; for (let i = 0; i < 6; i++) { c.beginPath(); curve(c, lo, true); c.lineWidth = w * (.07 - i * .011); c.stroke(); }
      c.restore();
    }
    // the lower lid's thickness: a pale wet waterline between the ball and the lashes, widest in the middle
    const NS = 16, tK = .35 + .65 * sm(0, .6, openK), wl = t => w * (.004 + .02 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.06)), .7)) * tK, loA = [], loB = [];
    for (let i = 0; i <= NS; i++) { const t = i / NS, p = crAt(lo, t); loA.push(p); loB.push([p[0], p[1] + wl(t)]); }
    if (open > .004) {
      g = c.createLinearGradient(0, lo[4][1], 0, lo[4][1] + wl(.5)); g.addColorStop(0, 'rgba(240,205,192,' + (K.dark ? .05 : .1) + ')'); g.addColorStop(.55, 'rgba(236,190,176,' + (K.dark ? .03 : .06) + ')'); g.addColorStop(1, 'rgba(230,170,156,0)');
      for (const [a0, a1] of [[0, NS], [2, NS - 1], [4, NS - 3]]) { c.beginPath(); curve(c, loA.slice(a0, a1 + 1), true); curve(c, [loA[a1], ...loB.slice(a0, a1 + 1).reverse()], false); c.closePath(); c.fillStyle = g; c.fill(); }
    }
    // under the waterline the lash roots: a soft uneven shade, never a drawn line
    c.lineCap = 'round'; for (const [lw, al, a0, a1] of [[8, .05, 1, NS - 1], [4, .07, 2, NS - 3], [1.8, .09, 3, NS - 6]]) { c.beginPath(); curve(c, loB.slice(a0, a1), true); c.strokeStyle = K.lid + al + ')'; c.lineWidth = lw * px; c.stroke(); }
    // the upper lash line: a soft dark-brown band (the lid's edge and the lashes' roots seen end-on), thicker outward, no ink
    const band = (k, col, al) => { c.beginPath(); curve(c, up, true); const up2 = up.map((p, i) => { const t = i / (up.length - 1), th = w * (.004 + .034 * Math.pow(Math.sin(Math.PI * Math.pow(1 - t, .85)), .9) * (.35 + .65 * openK)) * k; return [p[0], p[1] - th]; }).reverse(); curve(c, [up[up.length - 1], ...up2], false); c.closePath(); c.fillStyle = col; c.globalAlpha = al; c.fill(); c.globalAlpha = 1; };
    for (let i = 0; i < 8; i++) band(2.2 - i * .17, K.brow, .075); band(.6, K.line, .32); band(.3, K.line, .3);
    { const so = Math.sign(up[0][0] - up[8][0]) || 1, T = [up[0][0] + so * w * .04, up[0][1] + w * .026], Cq = [up[0][0] + so * w * .02, up[0][1] + w * .007];
      const tail = (wd, dy, col, al) => { c.beginPath(); c.moveTo(up[1][0], up[1][1] + dy - wd * .5); c.quadraticCurveTo(up[0][0], up[0][1] + dy - wd, Cq[0], Cq[1] + dy - wd * .5); c.quadraticCurveTo((Cq[0] + T[0]) / 2, (Cq[1] + T[1]) / 2 + dy, T[0], T[1] + dy); c.quadraticCurveTo(Cq[0], Cq[1] + dy + wd * .6, up[0][0], up[0][1] + dy + wd * .5); c.lineTo(up[1][0], up[1][1] + dy + wd * .3); c.closePath(); c.fillStyle = col; c.globalAlpha = al; c.fill(); c.globalAlpha = 1; };
      for (let i = 0; i < 3; i++) tail(w * (.036 - i * .008), w * .012, K.lid + '1)', .045);
      tail(w * .012, w * .003, K.brow, .14);
      c.beginPath(); c.moveTo(up[1][0], up[1][1] - w * .018); c.quadraticCurveTo(up[0][0], up[0][1] - w * .022, T[0], T[1] - w * .012); c.strokeStyle = 'rgba(255,235,220,.1)'; c.lineWidth = w * .012; c.lineCap = 'round'; c.stroke(); }
    // shut: the lids meet in a soft fold, darker where the lashes root
    if (shutK > 0) { for (const [lw, al] of [[11, .06], [6, .1], [2.6, .2]]) { c.beginPath(); curve(c, lo, true); c.strokeStyle = K.lid + (al * shutK).toFixed(3) + ')'; c.lineWidth = lw * px; c.stroke(); }
      c.beginPath(); curve(c, lo.map(p => [p[0], p[1] - 5 * px]), true); c.strokeStyle = 'rgba(255,236,224,' + (.08 * shutK).toFixed(3) + ')'; c.lineWidth = 6 * px; c.stroke();
      c.strokeStyle = K.brow; c.lineCap = 'round'; for (const [dy, lw, al] of [[.012, .03, .1], [.02, .045, .07], [.03, .06, .05]]) { c.beginPath(); curve(c, [.1, .25, .4, .55, .7, .82].map(t => { const p = crAt(lo, t); return [p[0] + sgn * w * dy * .6, p[1] + w * dy]; }), true); c.globalAlpha = al * shutK; c.lineWidth = w * lw; c.stroke(); } c.globalAlpha = 1; }
    // lashes: fine tapering curved hairs in small clumps. Open, the upper ones come toward us and up and outward (short, foreshortened);
    // shut, they lie down over the lower lid, long
    const hair = (x0, y0, dx, dy, bend, wd) => { const l = Math.hypot(dx, dy) || 1, nx = -dy / l * wd * .5, ny = dx / l * wd * .5, mx = x0 + dx * .5, my = y0 + dy * .5 + bend * l; c.moveTo(x0 - nx, y0 - ny); c.quadraticCurveTo(mx - nx * .7, my - ny * .7, x0 + dx, y0 + dy); c.quadraticCurveTo(mx + nx * .7, my + ny * .7, x0 + nx, y0 + ny); c.closePath(); };
    for (let grp = 0; grp < 3; grp++) {
      c.beginPath();
      for (const h of BITS.up) { if (h.a !== grp) continue; const p = crAt(up, h.t), fade = Math.sin(Math.PI * Math.min(1, .1 + (1 - h.t) * 1.0)), sh = 1 - lashK;
        // open: outward and a little up, short; shut: down and outward, long
        const fx = (1.15 - 1.5 * h.t) * lashK + (.75 - .7 * h.t) * sh + h.lean + h.tip, oc = Math.max(0, 1 - h.t / .24), vy = (-(.55 + .25 * h.len) + oc * (.5 + .35 * h.len)) * lashK + 1 * sh, n = Math.hypot(fx, vy) || 1, len = w * (.11 * lashK * (.35 + .65 * (1 - h.t)) * (.7 + .6 * h.tip + .3 * h.len) + .125 * sh * (1 - .5 * h.t * h.t)) * h.len * (.4 + .6 * fade) * (1 + .55 * oc * lashK);
        hair(p[0], p[1] - w * .014 * openK, sgn * fx / n * len, vy / n * len, h.bend * (.5 + .7 * sh), h.wd * (1.15 + .7 * sh) * px); }
      c.fillStyle = grp === 0 ? K.line : K.brow; c.globalAlpha = [.62, .7, .5][grp] * (.85 + .15 * (1 - lashK)); c.fill();
      c.beginPath();
      for (const h of BITS.lo) { if (h.a !== grp) continue; const p = crAt(lo, h.t), fx = (.55 - .9 * h.t) + h.lean + h.tip, n = Math.hypot(fx, 1), len = w * .07 * h.len * (.6 + .4 * Math.sin(Math.PI * (1 - h.t)));
        hair(p[0], p[1] + wl(h.t) * .9, sgn * fx / n * len, len / n, -h.bend * .6, h.wd * 1.2 * px); }
      c.fillStyle = K.brow; c.globalAlpha = [.42, .32, .24][grp] * (.5 + .5 * lashK); c.fill();
    }
    c.globalAlpha = 1;
  }
  // BROWS: the hairs, tone by tone, over their soft mass; they rise from the nose, sweep outward along the brow (upper hairs
  // slanting down, lower ones up, meeting in a ridge) and thin away to the temple
  const HB = browHairs(), STY = [[0, .55, 1.25], [.1, .46, 1.15], [.24, .4, 1.1], [.42, .32, 1], [.62, .25, .9]]; c.lineCap = 'round';
  for (const { P, sgn } of ED) {
    for (let b = 4; b >= 0; b--) { c.beginPath();
      for (const h of HB[b]) { const p = P(h.t), p2 = P(h.t + .06), d = th(h.t); let tx = p2[0] - p[0], ty = p2[1] - p[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l; const ux = ty * sgn, uy = -tx * sgn;
        const hk = 1 - sm(.0, .3, h.t), am = (.3 * h.v + .03) * (1 - .45 * Math.min(1, h.t)), a = am + (.85 - .2 * h.v - am) * hk + h.ja * (.6 + .7 * hk), a2 = a * (1 - h.bend) - .1 * h.bend;
        const x = p[0], y = p[1] + d[0] + h.v * d[1], hl = h.len * .5, mx = x + (tx * Math.cos(a) + ux * Math.sin(a)) * hl, my = y + (ty * Math.cos(a) + uy * Math.sin(a)) * hl;
        c.moveTo(x, y); c.quadraticCurveTo(mx, my, mx + (tx * Math.cos(a2) + ux * Math.sin(a2)) * hl, my + (ty * Math.cos(a2) + uy * Math.sin(a2)) * hl); }
      c.strokeStyle = hairCol(STY[b][0], STY[b][1]); c.lineWidth = STY[b][2] * px; c.stroke(); }
  }
  if (!K.dark) for (const s of [-1, 1]) blobC(c, s * .11, .02, .06, .3, 0, K.lid.slice(5, -1), .13);
  if (FX.tears) tears(c, ED, FX.tears, px, K);
  c.restore();
  if (K.dark) shadeDark(c, W, H, f, K, S, cx, cy);
}
// THE LIGHT OF THE DARK LOOKS, after frames of 1960s westerns looked at and measured (ref/): hard low sun from the
// left under a hat. Lit skin is the bright thing; skin in the brim's shade is about .25 to .35 of it and red-brown,
// not black; the brim's edge is hard (a penumbra of 2 to 4% of the frame's height) and dips into the eye sockets;
// the whites sit under the lid's shadow, no brighter than the lit skin; the picture's edges go to black; fine grain.
// Every shade is a soft ellipse that ends inside its own rectangle, or a path with a narrow soft edge: no bands.
function blobC(c, x, y, rx, ry, rot, rgb, a) {
  c.save(); c.translate(x, y); if (rot) c.rotate(rot); c.scale(rx, ry); const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
  for (const [t, v] of [[0, 1], [.2, .9], [.4, .66], [.6, .36], [.8, .12], [1, 0]]) g.addColorStop(t, 'rgba(' + rgb + ',' + (a * v).toFixed(3) + ')');
  c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore();
}
let GRAIN = null;
function grain(W, H, amp) {
  if (GRAIN && GRAIN.W === W && GRAIN.H === H && GRAIN.amp === amp) return GRAIN.cv;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'), im = g.createImageData(W, H), d = im.data; let s = 90210;
  for (let i = 0; i < d.length; i += 4) { s = (s * 16807) % 2147483647; const a = (s & 1023) / 1023; s = (s * 16807) % 2147483647; const n = a + (s & 1023) / 1023 - 1, v = n > 0 ? 255 : 0; d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = Math.abs(n) * amp * 255; }
  g.putImageData(im, 0, 0); GRAIN = { W, H, amp, cv }; return cv;
}
function shadeDark(c, W, H, f, K, S, cx, cy) {
  const X = u => cx + u * S, Y = v => cy + v * S, P = a => a.map(p => [X(p[0]), Y(p[1])]), M = K.mul, key = K.key, lit = K.lit;
  const mulc = k => 'rgb(' + M.map(v => Math.round(255 * Math.pow(v, k))).join(',') + ')', mrgb = M.map(v => Math.round(255 * v)).join(',');
  const light = (u, v, ru, rv, rot, a) => blobC(c, X(u), Y(v), ru * S, rv * S, rot, lit, a * key);
  const dark = (u, v, ru, rv, rot, a) => { c.globalCompositeOperation = 'multiply'; blobC(c, X(u), Y(v), ru * S, rv * S, rot, mrgb, a); c.globalCompositeOperation = 'source-over'; };
  c.save();
  const E = {}; for (const e of ['R', 'L']) { const up = pts(e, 'up', f), lo = pts(e, 'lo', f), o0 = lo[4][1] - up[4][1], kO = (t => t * t * (3 - 2 * t))(Math.max(0, Math.min(1, (o0 - .026) / .046))) * .88; for (let i = 0; i < up.length; i++) up[i] = [up[i][0], lo[i][1] + (up[i][1] - lo[i][1]) * kO]; widen(up, o0); canthus(up, lo); E[e] = { up: P(up), lo: P(lo), cr: P(pts(e, 'cr', f)), un: P(pts(e, 'un', f).slice(1, 8)) }; }
  // 1 light on the forms that face the sun: cheekbone tops, the near flank of the nose, the near temple
  light(-.41, .185, .25, .055, .07, .3); light(.43, .19, .2, .045, -.07, .13);
  light(-.04, .04, .045, .25, .02, .24); light(-.02, .07, .035, .17, .02, .1);
  light(-.63, -.01, .1, .12, 0, .1);
  // 2 shade where the forms turn away: the socket's inner corners, the far side of the nose (hard along its ridge,
  //   soft toward the far eye's inner corner: one ellipse, narrow on the sun's side of the ridge and wide on the far side), the far temple and cheek
  dark(-.135, -.05, .075, .11, 0, .4); dark(.14, -.05, .07, .1, 0, .3);
  dark(.11, -.03, .15, .34, .04, .4); dark(.06, .0, .07, .3, .03, .22); dark(.2, .27, .3, .3, 0, .34);
  dark(.8, .0, .42, .5, 0, .7);
  for (const e of ['R', 'L']) {
    const { up, lo, cr, un } = E[e], near = e === 'R', w = Math.abs(up[0][0] - up[8][0]);
    // the lid as a rounded form: a highlight on its bulge, toward the sun, kept to the lid's own skin
    c.save(); c.beginPath(); curve(c, cr, true); c.lineTo(up[8][0], up[8][1]); curve(c, up.slice().reverse(), false); c.closePath(); c.clip();
    blobC(c, up[4][0] - .04 * S, (cr[3][1] + up[4][1]) / 2, .12 * S, Math.max(8, (up[4][1] - cr[3][1]) * .62), 0, lit, (near ? .3 : .2) * key); c.restore();
    // the bag under the eye: its top catches the sun, a soft shade lies under its fold
    { const m = un[3], sg = near ? 1 : -1; blobC(c, m[0] - .02 * S, m[1] - .04 * S, .17 * S, .032 * S, sg * .06, lit, (near ? .12 : .06) * key); c.globalCompositeOperation = 'multiply'; blobC(c, m[0], m[1] + .028 * S, .22 * S, .04 * S, sg * .05, mrgb, .3); c.globalCompositeOperation = 'source-over'; }
    // the ball: a sphere under the lid. The whites held under the lit skin, the lid's hard shadow across the top, the side away from the sun turning dark
    c.save(); c.beginPath(); curve(c, up, true); curve(c, lo.slice().reverse(), false); c.closePath(); c.clip(); c.globalCompositeOperation = 'multiply';
    c.fillStyle = 'rgb(' + K.eye.map(v => Math.round(255 * v)).join(',') + ')'; c.fillRect(up[0][0] - w, up[4][1] - w, 3 * w, 2 * w);
    c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const lw = .05 + i * .05, k = .045; c.beginPath(); curve(c, up, true); c.strokeStyle = mulc(k); c.lineWidth = lw * w; c.stroke(); }
    blobC(c, Math.max(up[0][0], up[8][0]) + .02 * w, (up[4][1] + lo[4][1]) / 2, .5 * w, .4 * w, 0, mrgb, .55);
    c.restore();
  }
  // 3 the hat brim's shadow: a hard edge that rides high over the brow ridge and the bridge and dips into each socket
  //   to the top of the lid, lower on the side away from the sun; deeper still toward the hat
  const B = P([[-.9, -.172], [-.6, -.158], [-.37, -.13], [-.17, -.152], [0, -.168], [.17, -.14], [.37, -.107], [.6, -.118], [.9, -.112]]);
  c.globalCompositeOperation = 'multiply';
  const brim = (dy, k) => { c.beginPath(); c.moveTo(-20, -20); c.lineTo(B[0][0], B[0][1] + dy); curve(c, B.map(p => [p[0], p[1] + dy]), false); c.lineTo(W + 20, -20); c.closePath(); c.fillStyle = mulc(k); c.fill(); };
  for (let i = 0; i < 6; i++) brim((i - 2.5) * .0024 * S, 1 / 6);
  for (let i = 0; i < 5; i++) brim(-(.05 + i * .016) * S, .1);
  c.globalCompositeOperation = 'source-over';
  // 4 the picture falls away to black round the eyes, sooner on the far side
  c.save(); if (drawEyes.cyK) { c.translate(X(-.18), Y(.03)); c.scale(1.04 * S, .5 * S); } else { c.translate(X(-.2), Y(-.02)); c.scale(1.04 * S, .42 * S); } const g = c.createRadialGradient(0, 0, 0, 0, 0, 1.5);
  for (const [t, v] of [[0, 0], [.22, 0], [.36, .12], [.5, .36], [.64, .64], [.8, .86], [1, .97], [1.5, 1]]) g.addColorStop(t / 1.5, 'rgba(' + K.shade + ',' + v + ')');
  c.fillStyle = g; c.fillRect(-5, -5, 10, 10); c.restore();
  // 5 film grain, baked once, still
  if (K.grain) c.drawImage(grain(W, H, K.grain), 0, 0);
  c.restore();
}
