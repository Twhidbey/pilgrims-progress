// THE MANNEQUIN (object MQ): Christian drawn in code, no pictures. A jointed figure in parts (hood, burden, robe,
// shins, feet), each part a stack of traced tone shapes; a pose moves the parts, and the poses of each animation
// were measured frame by frame from his own frame packs (tools/mannequin/; the pose's numbers are listed in rig.py).
// Units are the walk pack's pixels.
const MQ = (() => {
  let C = null, PARTS = [], ready = false;
  const ANIMS = {}, NLEG = { F: 9, N: 13 }, FLAP = 17, SWAY = 19, LIFT = 27;
  const grey = t => { const v = Math.round(t * 255); return 'rgb(' + v + ',' + v + ',' + v + ')'; };

  // the robe's cloth: each of its points knows how far across (u) and how far down (v) the skirt it lies
  function uv(x, y) {
    const n = C.xl.length, yy = Math.max(0, Math.min(n - 1.001, y)), i = Math.floor(yy), f = yy - i, j = Math.min(i + 1, n - 1);
    const L = C.xl[i] * (1 - f) + C.xl[j] * f, R = C.xr[i] * (1 - f) + C.xr[j] * f;
    return [Math.max(0, Math.min(1, (x - L) / Math.max(R - L, 1))), Math.max(0, Math.min(1, (y - C.waist) / (C.hem - C.waist)))];
  }
  function rowW(v) {      // the weight of each row's displacement at v: a smooth curve down the skirt (Catmull-Rom), no bend at the waist, straight on past the hem
    const R = C.rows, t = Math.max(0, Math.min(1, v)) * R, i = Math.min(Math.floor(t), R - 1), s = t - i, w = new Array(R + 2).fill(0);
    const c = [(-s * s * s + 2 * s * s - s) / 2, (3 * s * s * s - 5 * s * s + 2) / 2, (-3 * s * s * s + 4 * s * s + s) / 2, (s * s * s - s * s) / 2];
    for (let n = 0; n < 4; n++) { const k = i - 1 + n; if (k === -1) w[1] += c[n]; else if (k === R + 1) { w[R] += 2 * c[n]; w[R - 1] -= c[n]; } else w[k] += c[n]; }
    return w.slice(1, R + 1);
  }
  function prep(c) {
    C = c; PARTS = c.parts.map(p => {
      const q = { name: p.name, kind: p.kind, leg: p.leg, seg: p.seg, layers: [] };
      for (const l of p.layers) {
        const L = { t: l.t, paths: l.paths.map(a => Float32Array.from(a, v => v / 10)) };
        if (p.kind === 'robe') {
          L.w = L.paths.map(a => {      // per point: u, then the row weights
            const w = new Float32Array(a.length / 2 * (1 + C.rows));
            for (let i = 0, k = 0; i < a.length; i += 2) { const [u, v] = uv(a[i], a[i + 1]), rw = rowW(v); w[k++] = u; for (let j = 0; j < C.rows; j++) w[k++] = rw[j]; }
            return w;
          });
        } else if (p.kind === 'flap') {
          L.w = L.paths.map(a => {      // per point: how far the swing and the curl turn it
            const w = new Float32Array(a.length);
            for (let i = 0; i < a.length; i += 2) { const s = Math.max(0, Math.min(1, (a[i + 1] - C.flapTop) / C.flapLen)), e = Math.min(1, s / .35); w[i] = e * e * (3 - 2 * e); w[i + 1] = s * s; }
            return w;
          });
        } else {
          L.path = new Path2D();
          for (const a of L.paths) { L.path.moveTo(a[0], a[1]); for (let i = 2; i < a.length; i += 2) L.path.lineTo(a[i], a[i + 1]); L.path.closePath(); }
        }
        q.layers.push(L);
      }
      return q;
    });
    ready = true;
  }
  async function load(url) {
    const d = await (await fetch(url || 'assets/mannequin.json')).json();
    prep(d.costume); Object.assign(ANIMS, d.anims); return d;
  }
  // the pose at a (fractional) frame of an animation: between two measured frames the pose is blended
  function poseAt(name, f) {
    const a = ANIMS[name], n = a.frames.length;
    let i = Math.floor(f), u = f - i, j;
    if (a.loop) { i = ((i % n) + n) % n; j = (i + 1) % n; } else { i = Math.max(0, Math.min(n - 1, i)); j = Math.min(n - 1, i + 1); }
    const A = a.frames[i], B = a.frames[j], P = new Array(A.length);
    for (let k = 0; k < A.length; k++) P[k] = A[k] + (B[k] - A[k]) * u;
    return P;
  }
  const about = (ctx, piv, dx, dy, th) => { ctx.translate(piv[0] + dx, piv[1] + dy); ctx.rotate(th); ctx.translate(-piv[0], -piv[1]); };
  // draw the figure: (x, y) is the ground under him, face 1 right / -1 left, K the size; shade(tone) gives each tone's colour
  function draw(ctx, P, x, y, face, K, shade) {
    if (!ready) return;
    shade = shade || grey;
    ctx.save(); ctx.translate(x, y); ctx.scale((face || 1) * K, K); ctx.translate(-C.ax, -C.ground);
    for (const p of PARTS) {
      ctx.save();
      if (p.kind === 'leg') { const o = NLEG[p.leg]; about(ctx, C.piv['leg' + p.leg], P[o], P[o + 1], P[o + 2 + p.seg]); }
      else {
        about(ctx, C.piv.torso, P[0], P[1], P[2]);
        if (p.kind === 'hood') about(ctx, C.piv.hood, P[3], P[4], P[5]);
        if (p.kind === 'burden') about(ctx, C.piv.burden, P[6], P[7], P[8]);
      }
      for (const L of p.layers) {
        ctx.fillStyle = shade(L.t);
        if (L.path) { ctx.fill(L.path, 'evenodd'); continue; }
        ctx.beginPath();
        const R = C.rows, S = 1 + R, fp = C.piv.flap;
        for (let n = 0; n < L.paths.length; n++) {
          const a = L.paths[n], w = L.w[n];
          for (let i = 0, k = 0; i < a.length; i += 2, k += S) {
            let X, Y;
            if (p.kind === 'flap') {      // the flap swings about its top, turning further toward its free end
              const ph = P[FLAP] * w[i] + P[FLAP + 1] * w[i + 1], s = Math.sin(ph), co = Math.cos(ph), dx = a[i] - fp[0], dy = a[i + 1] - fp[1];
              X = dx * co - dy * s + fp[0]; Y = dx * s + dy * co + fp[1];
            } else {      // the skirt sways sideways at each height; the hem lifts
              const u = w[k]; let dx = 0;
              for (let j = 0; j < R; j++) { const bj = w[k + 1 + j]; if (bj) dx += bj * ((1 - u) * P[SWAY + 2 * j] + u * P[SWAY + 2 * j + 1]); }
              X = a[i] + dx; Y = a[i + 1] + w[k + R] * ((1 - u) * P[LIFT] + u * P[LIFT + 1]);
            }
            if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
          }
          ctx.closePath();
        }
        ctx.fill('evenodd');
      }
      ctx.restore();
    }
    ctx.restore();
  }
  // the bones under the cloth (pack pixels, for showing and for later animation by joints)
  function bones(P) {
    const rot = (p, c, th, d) => { const s = Math.sin(th), co = Math.cos(th), x = p[0] - c[0], y = p[1] - c[1]; return [x * co - y * s + c[0] + d[0], x * s + y * co + c[1] + d[1]]; };
    const T = p => rot(p, C.piv.torso, P[2], [P[0], P[1]]);
    const leg = (k, knee) => { const o = NLEG[k], pv = C.piv['leg' + k], d = [P[o], P[o + 1]]; return { hip: T(C.hip), knee: rot(knee, pv, P[o + 2], d), ankle: rot(pv, pv, 0, d), toe: rot([pv[0] + C.toe[k][0], pv[1] + C.toe[k][1]], pv, P[o + 3], d) }; };
    return { pelvis: T(C.hip), neck: T(C.piv.hood), head: T(rot([C.piv.hood[0] + 10, C.piv.hood[1] - 34], C.piv.hood, P[5], [P[3], P[4]])), F: leg('F', C.kneeF), N: leg('N', C.kneeN) };
  }
  return { load, prep, draw, poseAt, bones, anims: ANIMS, get costume() { return C; }, get ready() { return ready; } };
})();
