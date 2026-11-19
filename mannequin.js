// THE MANNEQUIN (object MQ): Christian drawn in code from first principles. No pictures, nothing traced, nothing stretched.
// 1. A SKELETON (hip, spine, head, legs, arms, the burden). A skeleton pose is 17 numbers:
//      0,1 the hip's place   2 the body's lean   3 the head's nod
//      4..7 far leg: (unused), thigh angle, knee bend, foot pitch (toe up +)   8..11 near leg
//      12,13 far arm: shoulder, elbow   14,15 near arm   16 the burden's tilt
//    Angles: 0 hangs straight down, + swings forward. Units: his walk pack's pixels (he is about 283 tall).
// 2. HOW HE WALKS: classic() builds the walk from the animators' four positions (contact, down, passing, up) and the
//    gait laboratories' measures; fromTrack() plays a walk measured from frames on the same bones (tools/mannequin/).
// 3. HOW CLOTH MOVES (clothStep): cloth hangs at rest; the legs push it out and it cannot pass through them; left alone
//    it swings back like a weight on a string, late, the hem latest (follow-through, overlapping action); going
//    forward the air holds it back (drag); the burden sags a beat after the body.
// 4. THE CLOTHES are simple shapes built on the joints each frame (figure()): robe, cloak flap, hood, burden, hose, shoes;
//    folds are drawn lines: pipe folds hanging from the waist, tension folds from the knee that pushes the cloth.
const MQ = (() => {
  const K = { ax: 93, ground: 295, hip: [82, 150], neck: [94, 56], head: [104, 31], shoulder: [87, 68],
    thigh: 66, shin: 60, upper: 46, fore: 40, hand: 12, heel: [-9, 20], ball: [22, 20] };
  const ANIMS = {}, LEGS = [['F', 4], ['N', 8]], DEG = 180 / Math.PI, TAU = 2 * Math.PI;
  const grey = t => { const v = Math.round(Math.max(0, Math.min(1, t)) * 255); return 'rgb(' + v + ',' + v + ',' + v + ')'; };
  const cl1 = v => Math.max(-1, Math.min(1, v)), frac = v => v - Math.floor(v), lerp = (a, b, t) => a + (b - a) * t;
  const R = (v, th) => { const s = Math.sin(th), c = Math.cos(th); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
  const dirv = (a, L) => [Math.sin(a) * L, Math.cos(a) * L];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
  const pitched = (v, p) => { const s = Math.sin(p), c = Math.cos(p); return [v[0] * c + v[1] * s, -v[0] * s + v[1] * c]; };      // a foot's point with the toe lifted by p

  // ---------------------------------------------------------------- the skeleton
  function ik(hip, ank) {      // two bones from hip to ankle, the knee forward: the thigh's and the shin's angles
    const L1 = K.thigh, L2 = K.shin, dx = ank[0] - hip[0], dy = ank[1] - hip[1], D = Math.min(Math.hypot(dx, dy), L1 + L2 - .01), base = Math.atan2(dx, dy);
    return [base + Math.acos(cl1((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D))), base - Math.acos(cl1((L2 * L2 + D * D - L1 * L1) / (2 * L2 * D)))];
  }
  function joints(S) {
    const c = [S[0], S[1]], lean = S[2], J = { hip: c, lean };
    J.neck = add(c, R(sub(K.neck, K.hip), lean)); J.nod = lean + S[3]; J.head = add(J.neck, R(sub(K.head, K.neck), J.nod));
    J.shoulder = add(c, R(sub(K.shoulder, K.hip), lean));
    [['F', 12], ['N', 14]].forEach(([k, o]) => {
      const a = lean + S[o], b = a + S[o + 1], el = add(J.shoulder, dirv(a, K.upper)), wr = add(el, dirv(b, K.fore));
      J['arm' + k] = { sh: J.shoulder, el, wr, hand: add(wr, dirv(b, K.hand)), a, b };
    });
    LEGS.forEach(([k, so]) => {
      const at = S[so + 1], as = at - S[so + 2], knee = add(c, dirv(at, K.thigh)), ank = add(knee, dirv(as, K.shin)), p = S[so + 3];
      J['leg' + k] = { hip: c, knee, ank, as, p, heel: add(ank, pitched(K.heel, p)), ball: add(ank, pitched(K.ball, p)) };
    });
    return J;
  }
  // a skeleton pose from the hip, the lean and where each foot is (ankle x, ankle y, pitch)
  function pose(hip, lean, nod, feet, tilt) {
    const S = new Array(17).fill(0); S[0] = hip[0]; S[1] = hip[1]; S[2] = lean; S[3] = nod; S[16] = tilt || 0;
    LEGS.forEach(([k, so], i) => { const a = ik(hip, feet[i]); S[so + 1] = a[0]; S[so + 2] = a[0] - a[1]; S[so + 3] = feet[i][2]; });
    S[12] = S[14] = .04; S[13] = S[15] = .32;
    return S;
  }
  // a measured frame (tools/mannequin/anims.py) on these bones; his frames show his arms held still
  const fromTrack = t => pose([K.hip[0] + t[0], K.hip[1] + t[1]], t[2], t[3], [[K.hip[0] + t[4], t[5], t[6]], [K.hip[0] + t[7], t[8], t[9]]], t[10]);

  // ---------------------------------------------------------------- the classic walk
  // Richard Williams (The Animator's Survival Kit): every step is CONTACT, DOWN (the weight comes onto the front leg, the
  // body at its lowest), PASSING POSITION, UP (the push off, the body at its highest); a slow or heavy walk takes 16
  // frames a step or more (his takes 19). Gait laboratories: each foot is on the ground about 60% of a stride; the heel
  // strikes with the toe up, the foot rolls flat, the heel rises and it rolls over the ball of the foot; the arms swing
  // against the legs. A man under a load leans into it, keeps his knees a little bent and swings his arms little.
  // u: 0..1 round one stride (two steps), the far heel striking at 0. A foot's touching point never slides.
  const PITCH = [[0, 15], [.07, 0], [.34, 0], [.48, -16], [.58, -42], [.68, -58], [.8, -28], [.92, 3], [1, 15]];
  function key(g, keys) { for (let i = 1; i < keys.length; i++) if (g <= keys[i][0]) { const a = keys[i - 1], b = keys[i], t = (g - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (1 - Math.cos(Math.PI * t)) / 2; } return keys[keys.length - 1][1]; }
  function classic(u, o) {
    o = Object.assign({ step: 93, lift: 8, bob: 3.4, sink: 4, arm: .13, stance: .58, strike: 46, lean: .035 }, o);
    const gy = K.ground;
    const planted = (g) => {      // on the ground: the belt carries the touching point straight back; the foot turns on its heel, lies flat, then turns on the ball
      const p = key(g, PITCH) / DEG, flat = o.strike - 2 * o.step * g, pv = p > 0 ? K.heel : K.ball, r = pitched(pv, p);
      return [K.hip[0] + flat + pv[0] - r[0], gy - Math.max(pitched(K.heel, p)[1], pitched(K.ball, p)[1]), p];
    };
    const feet = LEGS.map(([k]) => {
      const g = frac(u + (k === 'N' ? .5 : 0));
      if (g <= o.stance) return planted(g);
      const s = (g - o.stance) / (1 - o.stance), a = planted(o.stance), b = planted(0), p = key(g, PITCH) / DEG, e = (1 - Math.cos(Math.PI * s)) / 2;
      return [a[0] + (b[0] - a[0]) * e, gy - Math.max(pitched(K.heel, p)[1], pitched(K.ball, p)[1]) - o.lift * Math.sin(Math.PI * s), p];
    });
    const hip = [K.hip[0] + 1.2 * Math.cos(TAU * (2 * u - .6)), K.hip[1] + o.sink + o.bob + o.bob * Math.cos(TAU * (2 * u - .21))];
    const L = K.thigh + K.shin - 1.2;      // the hip sinks as far as the legs need to reach their feet
    feet.forEach(f => { const dx = f[0] - hip[0]; if (Math.abs(dx) < L) hip[1] = Math.max(hip[1], f[1] - Math.sqrt(L * L - dx * dx)); });
    const lean = o.lean + .012 * Math.cos(TAU * (2 * u - .1)), S = pose(hip, lean, -.5 * (lean - o.lean) + .03, feet, 0);
    const sw = o.arm * Math.cos(TAU * u);
    S[12] = .04 - sw; S[14] = .04 + sw; S[13] = .3 + .5 * Math.max(0, -sw); S[15] = .3 + .5 * Math.max(0, sw);
    return S;
  }

  // ---------------------------------------------------------------- how cloth moves
  const CL = {
    d: [24, 48, 72, 96],      // four heights down the skirt, below the hip; the last is the hem
    rf: [24, 26, 25, 22], rb: [-20, -23, -25, -24],      // where its front and back edge hang at rest, from the hip
    pf: [15, 14, 15, 12], pb: [13, 12, 10, -4],      // how far the cloth stands off a leg (the calf of the back leg shows behind the hem)
    hz: [3.2, 2.5, 2.0, 1.7], zeta: .55,      // how fast each height swings back by itself (the hem slowest), and how soon it settles
    drag: [.1, .3, .6, .9],      // how far the air holds each height back, per pixel of his speed
    fd: [36, 62, 86], fr: [-27, -31, -32], fhz: [2.1, 1.6, 1.3], fzeta: .3, fdrag: [.5, 1.3, 2.2]      // the cloak's back flap: looser, so it flies and settles later
  };
  const crossX = (L, y) => {      // where a leg crosses a height (a leg lifted above it counts at its lowest point)
    for (const [p, q] of [[L.hip, L.knee], [L.knee, L.ank]]) if ((p[1] - y) * (q[1] - y) <= 0 && p[1] !== q[1]) return p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1]);
    return L.ank[1] >= L.knee[1] ? L.ank[0] : L.knee[0];
  };
  function clothNew() { return { f: CL.rf.slice(), b: CL.rb.slice(), fv: [0, 0, 0, 0], bv: [0, 0, 0, 0], fl: CL.fr.slice(), flv: [0, 0, 0], lift: 0, liftV: 0, by: 0, byV: 0, h1: null, h2: null }; }
  // a skirt edge at any depth below the hip (above the first height it runs into the waist)
  function edgeAt(e, rest, d) {
    if (d <= CL.d[0]) return lerp(rest[0] * .92, e[0], Math.max(0, d / CL.d[0]));
    for (let j = 1; j < 4; j++) if (d <= CL.d[j]) return lerp(e[j - 1], e[j], (d - CL.d[j - 1]) / (CL.d[j] - CL.d[j - 1]));
    return e[3];
  }
  // one step of time (n frames of a 24th of a second) for the cloth and the burden; vx is his speed over the ground (pixels a frame)
  function clothStep(E, S, J, n, vx) {
    n = n || 1; vx = vx || 0; let ax = 0, ay = 0;
    if (E.h1 && E.h2) { ax = (S[0] - 2 * E.h1[0] + E.h2[0]) / (n * n); ay = (S[1] - 2 * E.h1[1] + E.h2[1]) / (n * n); }
    E.h2 = E.h1; E.h1 = [S[0], S[1]];
    // the legs hold the cloth out: at each height, the foremost leg in front, the hindmost behind; cloth held out above falls nearly straight down
    const pF = [], pB = [];
    for (let j = 0; j < 4; j++) {
      const y = S[1] + CL.d[j], a = crossX(J.legF, y) - S[0], b = crossX(J.legN, y) - S[0];
      pF[j] = Math.max(a, b) + CL.pf[j]; pB[j] = Math.min(a, b) - CL.pb[j];
      if (j) { pF[j] = Math.max(pF[j], pF[j - 1] - 3); pB[j] = Math.min(pB[j], pB[j - 1] + 3); }
    }
    const sub_ = Math.max(1, Math.round(n * 2)), dt = n / sub_;
    const spring = (x, v, target, hz, zeta, push) => { const w = TAU * hz / 24; v += (w * w * (target - x) - 2 * zeta * w * v + push) * dt; return [x + v * dt, v]; };
    for (let s = 0; s < sub_; s++) {
      for (let j = 0; j < 4; j++) {
        const sway = -ax * (.3 + .7 * j / 3);      // when he speeds up the cloth is left behind; when he stops it swings on
        let r = spring(E.f[j], E.fv[j], CL.rf[j] - CL.drag[j] * vx, CL.hz[j], CL.zeta, sway); E.f[j] = r[0]; E.fv[j] = r[1];
        if (E.f[j] < pF[j]) { E.f[j] = pF[j]; if (E.fv[j] < 0) E.fv[j] = 0; }
        r = spring(E.b[j], E.bv[j], CL.rb[j] - CL.drag[j] * vx, CL.hz[j], CL.zeta, sway); E.b[j] = r[0]; E.bv[j] = r[1];
        if (E.b[j] > pB[j]) { E.b[j] = pB[j]; if (E.bv[j] > 0) E.bv[j] = 0; }
      }
      for (let i = 0; i < 3; i++) {      // the flap lies outside the skirt's back and is pushed by it
        const r = spring(E.fl[i], E.flv[i], CL.fr[i] - CL.fdrag[i] * vx, CL.fhz[i], CL.fzeta, -ax * (.5 + .5 * i / 2)); E.fl[i] = r[0]; E.flv[i] = r[1];
        const lim = edgeAt(E.b, CL.rb, CL.fd[i]) - 3; if (E.fl[i] > lim) { E.fl[i] = lim; if (E.flv[i] > 0) E.flv[i] = 0; }
      }
      let r = spring(E.lift, E.liftV, 0, 2.6, .4, ay * .7); E.lift = r[0]; E.liftV = r[1];      // the hem lifts a little as the body drops
      r = spring(E.by, E.byV, 0, 3, .45, -ay * .6); E.by = r[0]; E.byV = r[1];      // the burden sags a beat after the body rises
    }
    return E;
  }
  const clothPose = E => [...E.f, ...E.b, ...E.fl, E.lift, E.by];
  // dress every pose of a movement once (three times round a loop, so the cloth has settled into its swing)
  function bake(name) {
    const A = ANIMS[name], n = A.skel.length, E = clothNew(); A.cloth = new Array(n);
    for (let pass = 0; pass < (A.loop ? 3 : 1); pass++) for (let i = 0; i < n; i++) { clothStep(E, A.skel[i], joints(A.skel[i]), 1, A.vpx || 0); A.cloth[i] = clothPose(E); }
  }

  // ---------------------------------------------------------------- loading and playing
  function add_(name, A) { ANIMS[name] = A; if (A.track) A.skel = A.track.map(fromTrack); bake(name); return A; }
  async function load(url) {
    const n = 38; add_('classic', { label: 'A walk built from the principles', loop: true, fps: 24, vpx: 2 * 93 / n, skel: Array.from({ length: n }, (_, i) => classic(i / n)) });
    try { const d = await (await fetch(url || 'assets/mannequin.json')).json(); for (const k in d.anims) add_(k, Object.assign({ label: 'The walk measured from his frames' }, d.anims[k])); } catch (e) { }
    return ANIMS;
  }
  function at(list, loop, f) {      // between two frames the pose is blended, so a movement plays at any speed without steps
    const n = list.length; let i = Math.floor(f), u = f - i, j;
    if (loop) { i = ((i % n) + n) % n; j = (i + 1) % n; } else { i = Math.max(0, Math.min(n - 1, i)); j = Math.min(n - 1, i + 1); }
    const A = list[i], B = list[j], P = new Array(A.length);
    for (let k = 0; k < A.length; k++) P[k] = A[k] + (B[k] - A[k]) * u;
    return P;
  }
  const skelAt = (name, f) => at(ANIMS[name].skel, ANIMS[name].loop, f), clothAt = (name, f) => at(ANIMS[name].cloth, ANIMS[name].loop, f);

  // ---------------------------------------------------------------- drawing
  // a smooth line through points (a point marked [x, y, 1] is a corner)
  function curve(ctx, pts, closed, cont) {
    const n = pts.length, P = i => closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    if (!cont) ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = p1[2] ? p1 : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = p2[2] ? p2 : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      ctx.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]);
    }
    if (closed) ctx.closePath();
  }
  // a drawn line that swells and thins: w(t) gives its half width along its length
  function stroke(ctx, pts, w, col) {
    const n = pts.length, L = [], Rr = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / l, ny = (b[0] - a[0]) / l, h = w(i / (n - 1));
      L.push([pts[i][0] + nx * h, pts[i][1] + ny * h]); Rr.push([pts[i][0] - nx * h, pts[i][1] - ny * h]);
    }
    ctx.fillStyle = col; ctx.beginPath(); curve(ctx, L); ctx.lineTo(Rr[n - 1][0], Rr[n - 1][1]); curve(ctx, Rr.reverse(), false, true); ctx.closePath(); ctx.fill();
  }
  const leaf = m => t => m * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, t))), .7);      // thin at both ends
  const TONE = { robe: .6, robeSh: .51, robeDk: .42, robeLt: .66, flap: .55, hose: .3, hoseFar: .25, shoe: .6, shoeFar: .42, sack: .49, sackSh: .4, sackLt: .56, patch: .63, strap: .34, hood: .58, hoodSh: .48, faceDk: .34, face: .47, hand: .55, sleeve: .63 };

  // the clothed figure. (x, y) is the ground under him, face 1 right / -1 left, Kk the size; shade(tone) gives each tone's colour
  function figure(ctx, S, Q, x, y, face, Kk, shade) {
    shade = shade || grey; const J = joints(S), T = k => shade(TONE[k]);
    Q = Q || clothPose(clothNew());
    const f = Q.slice(0, 4), b = Q.slice(4, 8), fl = Q.slice(8, 11), lift = Q[11], by = Q[12], h = J.hip, n = J.neck;
    ctx.save(); ctx.translate(x, y); ctx.scale((face || 1) * Kk, Kk); ctx.translate(-K.ax, -K.ground); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const sl = Math.hypot(h[0] - n[0], h[1] - n[1]), sd = [(h[0] - n[0]) / sl, (h[1] - n[1]) / sl], st = (t, off) => [n[0] + (h[0] - n[0]) * t + sd[1] * off, n[1] + (h[1] - n[1]) * t - sd[0] * off];
    const fill = (pts, col, closed) => { ctx.fillStyle = col; ctx.beginPath(); curve(ctx, pts, closed !== false); ctx.fill(); };

    // --- legs: hose and soft shoes (drawn first: they show below the hem)
    const leg = (L, far) => {
      const tube = (a, bb, r1, r2) => { const dx = bb[0] - a[0], dy = bb[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; ctx.beginPath(); ctx.moveTo(a[0] + nx * r1, a[1] + ny * r1); ctx.lineTo(bb[0] + nx * r2, bb[1] + ny * r2); ctx.lineTo(bb[0] - nx * r2, bb[1] - ny * r2); ctx.lineTo(a[0] - nx * r1, a[1] - ny * r1); ctx.fill(); ctx.beginPath(); ctx.arc(a[0], a[1], r1, 0, 7); ctx.arc(bb[0], bb[1], r2, 0, 7); ctx.fill(); };
      ctx.fillStyle = T(far ? 'hoseFar' : 'hose'); tube(L.hip, L.knee, 10.5, 8); tube(L.knee, L.ank, 7.6, 5.2);
      // the shoe bends at the ball of the foot: while the ball is on the ground the toes stay flat
      const hinge = L.p < 0 && L.ball[1] > K.ground - 3, sp = v => { if (hinge && v[0] > K.ball[0]) return [L.ball[0] + v[0] - K.ball[0], L.ball[1] + v[1] - K.ball[1]]; return add(L.ank, pitched(v, L.p)); };
      fill([[-7, 1], [-10.5, 12], [-9, 20, 1], [10, 20], [22, 20], [33, 19.5, 1], [30, 14], [21, 10.5], [10, 5], [6.5, -2]].map(v => { const q = sp(v); return v[2] ? [q[0], q[1], 1] : q; }), T(far ? 'shoeFar' : 'shoe'));
    };
    leg(J.legF, true); leg(J.legN, false);

    // --- an arm in its sleeve
    const sleeve = (A, col, edge) => {
      stroke(ctx, [add(A.sh, [0, -2]), A.el, A.wr, add(A.wr, dirv(A.b, 4))], t => lerp(8.5, 7.2, t), col);
      if (edge) stroke(ctx, [A.sh, A.el, A.wr].map((p, i) => add(p, R([-(8 - i), 0], i ? A.b : A.a))), leaf(1.1), edge);
      ctx.fillStyle = T('hand'); ctx.beginPath(); ctx.ellipse(A.hand[0], A.hand[1], 4.2, 5.4, -A.b, 0, 7); ctx.fill();
    };
    sleeve(J.armF, T('robeSh'));

    // --- the robe: one shape from the shoulders to the hem; below the waist its edges are the cloth's
    const yr = j => h[1] + CL.d[j], hemY = h[1] + CL.d[3] - lift;
    const yF = hemY - .12 * Math.max(0, f[3] - CL.rf[3]), yB = hemY - .1 * Math.max(0, CL.rb[3] - b[3]);
    const front = [st(.03, 8), st(.25, 19), st(.5, 23), st(.78, 24), [h[0] + f[0], yr(0)], [h[0] + f[1], yr(1)], [h[0] + f[2], yr(2)], [h[0] + f[3], yF, 1]];
    const back = [[h[0] + b[3], yB, 1], [h[0] + b[2], yr(2)], [h[0] + b[1], yr(1)], [h[0] + b[0], yr(0)], st(.78, -19), st(.5, -18), st(.25, -17), st(.03, -10)];
    const hem = []; for (let i = 1; i < 7; i++) { const u = 1 - i / 7; hem.push([h[0] + lerp(b[3], f[3], u), lerp(yB, yF, u) + 2.4 * Math.sin(Math.PI * u) + 1.2 * Math.sin(u * 15.7 + 1)]); }
    const robe = () => { ctx.beginPath(); curve(ctx, front.concat(hem, back), true); };
    ctx.fillStyle = T('robe'); robe(); ctx.fill();
    ctx.save(); robe(); ctx.clip();
    const edge = (pts, wd, col) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); curve(ctx, pts); ctx.stroke(); };
    edge(back, 17, T('robeSh')); edge([front[7]].concat(hem, [back[0]]), 6, T('robeSh')); edge(front.slice(1, 6), 9, T('robeLt'));      // the shaded back, the hem's weight, the lit front
    // pipe folds: cloth hanging from the waist falls in soft tubes; they spread as the skirt opens
    const across = (u, j) => [h[0] + lerp(b[j], f[j], u), yr(j)];
    [[.3, 1.3, 'robeSh'], [.53, 1.1, 'robeSh'], [.75, .9, 'robeSh']].forEach(([u, wd, tn]) => stroke(ctx, [[h[0] + lerp(-18, 22, u), h[1] + 4], across(u, 0), across(u, 1), across(u, 2), [across(u, 3)[0], lerp(yB, yF, u) + 2]], t => wd * Math.min(1, t * 2.2), T(tn)));
    // tension folds: where a knee pushes the cloth, folds run from the knee back to where the cloth is held (the other hip, the back of the hem)
    const lead = J.legF.knee[0] > J.legN.knee[0] ? J.legF : J.legN, pull = Math.max(0, Math.min(1, (f[2] - CL.rf[2]) / 15));
    if (pull > .12) {
      const kp = [Math.min(lead.knee[0] + 8, h[0] + f[2] - 4), Math.min(lead.knee[1], yr(3) - 14)], a1 = [h[0] + b[3] + 9, yB - 9], a2 = [h[0] + b[0] + 7, yr(0) - 8];
      stroke(ctx, [kp, add(mix(kp, a1, .5), [0, 8 * pull]), a1], leaf(1.7 * pull), T('robeDk'));
      stroke(ctx, [add(kp, [-2, -3]), add(mix(kp, a2, .5), [3, 4 * pull]), a2], leaf(1.1 * pull), T('robeSh'));
    }
    ctx.restore();

    // --- the cloak's back flap: a loose panel hanging down his back, outside the skirt
    const inX = d => h[0] + lerp(edgeAt(b, CL.rb, d), edgeAt(f, CL.rf, d), .3), o0 = [h[0] + fl[0], h[1] + CL.fd[0]], o1 = [h[0] + fl[1], h[1] + CL.fd[1]], o2 = [h[0] + fl[2], h[1] + CL.fd[2], 1], ib = [inX(80), h[1] + 80, 1];
    fill([st(.62, -3), st(.6, -20), [h[0] + Math.min(b[0] - 2, fl[0] + 3), h[1] + 12], o0, o1, o2, [lerp(o2[0], ib[0], .3), o2[1] - 5, 1], [lerp(o2[0], ib[0], .55), o2[1] + 1, 1], [lerp(o2[0], ib[0], .78), ib[1] - 4, 1], ib, [inX(54), h[1] + 54], [inX(26), h[1] + 26]], T('flap'));
    stroke(ctx, [st(.66, -4), [inX(26), h[1] + 26], [inX(54), h[1] + 54], [ib[0], ib[1]]], t => 1.9 * Math.min(1, 3 * t) * (1 - .4 * t), T('robeDk'));      // the dark fold where it lies on the skirt

    // --- the burden: a heavy sack with a rolled bundle on top, hung from the shoulders; it sags a beat after the body
    const tilt = J.lean + S[16] + by * .004, bc = add(add(h, R([-39, -57], tilt)), [0, by]), sq = 1 + .012 * Math.max(-3, Math.min(4, by));
    const sp = v => add(bc, R([v[0] * sq, v[1] / sq], tilt + .1));
    fill([[6, -37], [9, -47], [20, -52], [30, -46], [29, -36], [18, -31]].map(sp), T('sackLt'));      // the gathered mouth of the sack above its tie
    const sack = [[5, -35], [19, -25], [26, -1], [23, 24], [5, 38], [-17, 33], [-29, 9], [-25, -15], [-11, -30]].map(sp);
    fill(sack, T('sack'));
    ctx.save(); ctx.beginPath(); curve(ctx, sack, true); ctx.clip();
    fill([[-36, 0], [-24, 17], [-2, 27], [22, 22], [34, 30], [30, 46], [-38, 46]].map(sp), T('sackSh'));      // its underside in shade
    stroke(ctx, [sp([-22, -12]), sp([-6, -20]), sp([10, -22])], leaf(1.2), T('sackSh'));      // a crease where the weight pulls from the tie
    const pt = sp([-11, -3]); ctx.translate(pt[0], pt[1]); ctx.rotate(tilt + .35); ctx.fillStyle = T('patch'); ctx.fillRect(-7, -2.6, 14, 5.2); ctx.fillRect(-2.6, -7, 5.2, 14);      // the patch
    ctx.restore();
    stroke(ctx, [sp([3, -35]), sp([12, -32]), sp([20, -26])], leaf(1.9), T('strap'));      // the tie
    const sh = J.shoulder; ctx.strokeStyle = T('strap'); ctx.lineWidth = 3.6; ctx.beginPath(); curve(ctx, [sp([15, -30]), add(sh, [1, -9]), add(sh, [11, 2]), add(sh, [6, 16]), sp([21, 20])]); ctx.stroke();      // the strap over his shoulder and under his arm

    // --- near arm, then the hood over all
    sleeve(J.armN, T('sleeve'), T('robeSh'));
    const hp = v => add(J.head, R(v, J.nod)), hood = [[14, 19], [16, 3], [15, -12], [7, -22], [-3, -27, 1], [-13, -20], [-21, -7], [-24, 9], [-27, 22], [-22, 31], [-6, 34], [9, 32], [15, 26]].map(v => { const q = hp(v); return v[2] ? [q[0], q[1], 1] : q; });
    fill(hood, T('hood'));
    ctx.save(); ctx.beginPath(); curve(ctx, hood, true); ctx.clip();
    fill([[18, 22], [17, 3], [16, -12], [9, -19], [3, -12], [1, 2], [2, 14], [6, 22]].map(hp), T('faceDk'));      // the hood's deep opening
    fill([[7, -9], [10.5, -5], [14.5, 1.5], [11.5, 4], [12.5, 6.5], [11, 12.5], [6, 14.5], [4.5, 2]].map(hp), T('face'));      // his profile in it: brow, nose, chin (no eyes, no mouth)
    stroke(ctx, [hp([-6, -24]), hp([-17, -8]), hp([-21, 9]), hp([-24, 24])], t => 4.5 * t + 1, T('hoodSh'));      // the back of the hood in shade
    stroke(ctx, [hp([-20, 24]), hp([-6, 29]), hp([10, 26])], leaf(1.5), T('hoodSh'));      // the cowl lying on his shoulders
    ctx.restore();
    ctx.restore();
  }

  // the bare mannequin (an artist's lay figure), to see the skeleton at work
  function body(ctx, S, x, y, face, Kk, o) {
    o = o || {}; const J = joints(S), far = o.far || '#8b8478', near = o.near || '#b9b2a3', mid = o.mid || '#a39c8e', jc = o.joint || '#6d675d';
    ctx.save(); ctx.translate(x, y); ctx.scale((face || 1) * Kk, Kk); ctx.translate(-K.ax, -K.ground);
    const limb = (a, b, r1, r2, col) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l; ctx.fillStyle = col; ctx.beginPath();
      ctx.moveTo(a[0] + nx * r1, a[1] + ny * r1); ctx.lineTo(b[0] + nx * r2, b[1] + ny * r2); ctx.lineTo(b[0] - nx * r2, b[1] - ny * r2); ctx.lineTo(a[0] - nx * r1, a[1] - ny * r1); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(a[0], a[1], r1, 0, 7); ctx.arc(b[0], b[1], r2, 0, 7); ctx.fill();
    };
    const oval = (c, rx, ry, th, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(c[0], c[1], rx, ry, th, 0, 7); ctx.fill(); };
    const dot = (c, r) => { ctx.fillStyle = jc; ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, 7); ctx.fill(); };
    const arm = (A, col) => { limb(A.sh, A.el, 6.5, 5.2, col); limb(A.el, A.wr, 5, 4, col); limb(A.wr, A.hand, 4.2, 3.4, col); dot(A.el, 2.6); dot(A.wr, 2.2); };
    const leg = (L, col) => {
      limb(L.hip, L.knee, 11, 8.2, col); limb(L.knee, L.ank, 7.8, 5.4, col);
      const hinge = L.p < 0 && L.ball[1] > K.ground - 3, toe = hinge ? add(L.ball, [11, -.5]) : add(L.ank, pitched([33, 19.5], L.p)), top = add(L.ank, pitched([8, 3], L.p)), bk = add(L.ank, pitched([-6, 4], L.p));
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(bk[0], bk[1]); ctx.lineTo(top[0], top[1]); ctx.lineTo(toe[0], toe[1] - 4); ctx.lineTo(toe[0], toe[1]); ctx.lineTo(L.ball[0], L.ball[1]); ctx.lineTo(L.heel[0], L.heel[1]); ctx.closePath(); ctx.fill();
      dot(L.knee, 3.4); dot(L.ank, 2.6);
    };
    const spine = Math.atan2(K.neck[0] - K.hip[0], K.hip[1] - K.neck[1]) + J.lean, up = t => mix(J.hip, J.neck, t);
    arm(J.armF, far); leg(J.legF, far);
    oval(up(.04), 16, 14, spine, mid); limb(up(.2), up(.5), 12, 14, mid); oval(up(.66), 17.5, 29, spine, mid);
    limb(J.neck, add(J.neck, R([4, -9], J.nod)), 6, 5.5, mid); oval(J.head, 12.5, 16, J.nod + .12, mid);
    leg(J.legN, near); arm(J.armN, near); dot(J.shoulder, 3); dot(J.hip, 3.6);
    ctx.restore();
  }
  return { K, CL, TONE, load, figure, body, joints, pose, fromTrack, classic, ik, clothNew, clothStep, clothPose, bake, add: add_, skelAt, clothAt, anims: ANIMS };
})();
