// THE MANNEQUIN (object MQ): Christian drawn in code from first principles. No pictures, nothing traced, nothing stretched.
// 1. A SKELETON (hip, spine, head, legs, arms, the burden), set up as the cut-out animators set up a figure: one root
//    (the hip), each part a child of the one before it, each turning about the middle of its joint, far limbs drawn
//    before near ones. A skeleton pose is 17 numbers:
//      0,1 the hip's place   2 the body's lean   3 the head's nod
//      4..7 far leg: (unused), thigh angle, knee bend, foot pitch (toe up +)   8..11 near leg
//      12,13 far arm: shoulder, elbow   14,15 near arm   16 the burden's tilt
//    Angles: 0 hangs straight down, + swings forward. Units: his walk pack's pixels (he is about 283 tall).
// 2. A BODY on the bones (BODY, body()), by the art schools' measures: seven and a half heads tall, the shoulders a head
//    and a half down, the hips at the middle, the knees two heads above the ground; each part has a real side profile
//    (chest, small of the back, buttock, thigh, calf, the thin ankle; brow, nose and chin).
// 3. HOW HE WALKS: classic() builds the walk from the animators' four positions (contact, down, passing, up) and the
//    gait laboratories' measures; fromTrack() plays a walk measured from frames on the same bones (tools/mannequin/).
// 4. HOW CLOTH MOVES (clothStep): cloth hangs at rest; the body's own surfaces push it out and it cannot pass through
//    them; left alone it swings back like a weight on a string, late, the hem latest (follow-through, overlapping
//    action); going forward the air holds it back (drag); the burden sags a beat after the body.
// 5. THE CLOTHES (figure()) lie on that body with a little ease: a belted robe, a hood with its short cape, a cloak's
//    back flap, the sack bound on his back, hose and soft shoes. Dark, quiet tones: he is a silhouette first.
const MQ = (() => {
  const K = { ax: 93, ground: 295, hip: [82, 150], neck: [94, 56], head: [104, 31], shoulder: [87, 68],
    thigh: 66, shin: 60, upper: 46, fore: 40, hand: 12, heel: [-9, 20], ball: [22, 20] };
  const ANIMS = {}, LEGS = [['F', 4], ['N', 8]], DEG = 180 / Math.PI, TAU = 2 * Math.PI;
  // the body's side profile: along each part (0 at its top joint, 1 at its lower), how far its front and its back stand from the bone
  const BODY = {
    thigh: [[0, 11, 13], [.25, 12, 12], [.55, 10.5, 10.5], [.85, 8.6, 8.4], [1, 8, 7.6]],
    shin: [[0, 7.6, 7.2], [.12, 6.8, 8.6], [.3, 6.2, 10], [.5, 5.4, 8.6], [.72, 4.6, 6], [.9, 4.2, 4.6], [1, 4.6, 5.2]],
    upper: [[0, 7.5, 7.5], [.4, 6.6, 7.2], [.8, 5.6, 6], [1, 5.4, 5.6]],
    fore: [[0, 5.6, 5.8], [.25, 6, 6], [.6, 4.8, 4.6], [1, 3.6, 3.4]],
    torso: [[0, 7, 9], [.08, 10.5, 13], [.18, 16, 17.5], [.3, 19.8, 19], [.42, 20, 17.5], [.55, 18.5, 14.5], [.68, 17, 12], [.8, 17.2, 12.8], [.9, 17, 15.5], [1, 15, 18.8], [1.08, 12.5, 18.5], [1.16, 9, 15], [1.22, 4.5, 9], [1.26, 1, 3]],
    skull: [[10.5, -13], [12.5, -8], [13.5, -5], [13, -3], [17, 2], [13.6, 4], [14.6, 6.2], [14, 8], [14.4, 9.6], [13.4, 13.6], [9, 16.2], [1, 13.5], [-6, 13], [-12.5, 6], [-14, -4], [-11.5, -13], [-3, -17.6], [5, -16.6]],
    foot: [[-6, 1], [-9.2, 11], [-9, 18.6], [-7, 20, 1], [10, 20], [22, 20], [34, 19.8, 1], [31.5, 17.5], [22, 14.2], [12, 8.6], [5.2, -1]]
  };
  const pr = (P, t) => {
    if (t <= P[0][0]) return [P[0][1], P[0][2]];
    for (let i = 1; i < P.length; i++) if (t <= P[i][0]) { const a = P[i - 1], b = P[i], u = (t - a[0]) / (b[0] - a[0]); return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
    const l = P[P.length - 1]; return [l[1], l[2]];
  };
  // the front and the back line of a part from a to b (ease: cloth lying on it stands off a little; t1: carry on past b)
  function sides(a, b, P, ease, t1, n) {
    n = n || 10; t1 = t1 || 1; ease = ease || 0; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, fx = dy / l, fy = -dx / l, F = [], Bk = [];
    for (let i = 0; i <= n; i++) { const t = t1 * i / n, o = pr(P, t), cx = a[0] + dx * t, cy = a[1] + dy * t; F.push([cx + fx * (o[0] + ease), cy + fy * (o[0] + ease)]); Bk.push([cx - fx * (o[1] + ease), cy - fy * (o[1] + ease)]); }
    return [F, Bk];
  }
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
    rf: [20.5, 20.5, 20, 19.5], rb: [-22, -22, -21.5, -21],      // where its front and back edge hang at rest: straight down from the belly and from the buttock
    ef: [4, 4.5, 5.5, 5], eb: [3, 3, 3, 2.5],      // how far heavy cloth stands off the leg that pushes it
    hz: [3.2, 2.5, 2.0, 1.7], zeta: .55,      // how fast each height swings back by itself (the hem slowest), and how soon it settles
    drag: [.1, .3, .6, .9],      // how far the air holds each height back, per pixel of his speed
    fd: [36, 62, 86], fr: [-26, -27, -27], fhz: [2.1, 1.6, 1.3], fzeta: .3, fdrag: [.5, 1.3, 2.2]      // the cloak's back flap: looser, so it flies and settles later
  };
  // a leg's front and back surface at a height (a leg lifted above it counts at its lowest joint)
  const legSurf = (L, y) => {
    for (const [p, q, P] of [[L.hip, L.knee, BODY.thigh], [L.knee, L.ank, BODY.shin]]) if ((p[1] - y) * (q[1] - y) <= 0 && p[1] !== q[1]) {
      const t = (y - p[1]) / (q[1] - p[1]), x = p[0] + (q[0] - p[0]) * t, o = pr(P, t), c = Math.max(.5, Math.abs(q[1] - p[1]) / Math.hypot(q[0] - p[0], q[1] - p[1]));
      return [x + o[0] / c, x - o[1] / c];
    }
    const low = L.ank[1] >= L.knee[1] ? L.ank : L.knee; return [low[0] + 6, low[0] - 6];
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
      const y = S[1] + CL.d[j], a = legSurf(J.legF, y), b = legSurf(J.legN, y);
      pF[j] = Math.max(a[0], b[0]) - S[0] + CL.ef[j]; pB[j] = Math.min(a[1], b[1]) - S[0] - CL.eb[j];
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
  // dark, quiet tones: a silhouette first, with only a trace of form inside it (LOOK.detail 0 = one flat tone)
  const TONE = { robe: .2, robeSh: .165, robeDk: .156, robeLt: .226, flap: .178, hose: .128, hoseFar: .104, shoe: .168, shoeFar: .128, sack: .176, sackSh: .146, sackLt: .2, strap: .118, hood: .206, hoodSh: .17, face: .262, hand: .25, sleeve: .222, sleeveFar: .15, belt: .12 };
  const LOOK = { detail: 1, base: .185 };
  const closed = (ctx, F, Bk) => { ctx.beginPath(); curve(ctx, F); const r = Bk.slice().reverse(); ctx.lineTo(r[0][0], r[0][1]); curve(ctx, r, false, true); ctx.closePath(); ctx.fill(); };
  const disc = (ctx, c, r) => { ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, 7); ctx.fill(); };
  const part = (ctx, a, b, P, ease) => { const sd = sides(a, b, P, ease); closed(ctx, sd[0], sd[1]); };
  // a foot (bare, or in its soft shoe): it bends at the ball; while the ball is on the ground the toes stay flat
  function foot(ctx, L) {
    const hinge = L.p < 0 && L.ball[1] > K.ground - 3, pts = BODY.foot.map(v => { const q = hinge && v[0] > K.ball[0] ? [L.ball[0] + v[0] - K.ball[0], L.ball[1] + v[1] - K.ball[1]] : add(L.ank, pitched(v, L.p)); return v[2] ? [q[0], q[1], 1] : q; });
    ctx.beginPath(); curve(ctx, pts, true); ctx.fill();
  }

  // the clothed figure. (x, y) is the ground under him, face 1 right / -1 left, Kk the size; shade(tone) gives each tone's colour
  function figure(ctx, S, Q, x, y, face, Kk, shade) {
    shade = shade || grey; const J = joints(S), T = k => shade(LOOK.base + (TONE[k] - LOOK.base) * LOOK.detail);
    Q = Q || clothPose(clothNew());
    const f = Q.slice(0, 4), b = Q.slice(4, 8), fl = Q.slice(8, 11), lift = Q[11], by = Q[12], h = J.hip, n = J.neck;
    ctx.save(); ctx.translate(x, y); ctx.scale((face || 1) * Kk, Kk); ctx.translate(-K.ax, -K.ground); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const sl = Math.hypot(h[0] - n[0], h[1] - n[1]), sd = [(h[0] - n[0]) / sl, (h[1] - n[1]) / sl], st = (t, off) => [n[0] + (h[0] - n[0]) * t + sd[1] * off, n[1] + (h[1] - n[1]) * t - sd[0] * off];
    const fill = (pts, col, cl) => { ctx.fillStyle = col; ctx.beginPath(); curve(ctx, pts, cl !== false); ctx.fill(); };
    const hp = v => add(J.head, R(v, J.nod)), np = v => add(n, R(v, J.lean));

    // --- an arm in its sleeve: the cloth lies on the upper arm, widens to the cuff and hangs a little below the wrist
    const arm = (A, tone) => {
      const d = dirv(A.b, 1), fr = [d[1], -d[0]], P = (k, m, dn) => [A.wr[0] + d[0] * k + fr[0] * m, A.wr[1] + d[1] * k + fr[1] * m + (dn || 0)];
      ctx.fillStyle = T('hand'); stroke(ctx, [P(0, 0), P(7, .4), P(12.5, 1.6)], t => 3.3 - 1.4 * t, T('hand')); disc(ctx, P(5, 3), 1.7);
      ctx.fillStyle = T(tone); part(ctx, A.sh, A.el, BODY.upper, 2.6); disc(ctx, A.el, 8.2);
      const sv = sides(A.el, A.wr, [[0, 8, 8.2], [.5, 7.6, 9], [1, 7, 10.5]], 0); closed(ctx, sv[0], sv[1]);
      ctx.beginPath(); curve(ctx, [P(0, 7), P(3.5, 5.5), P(4, -6, 3), P(1, -10.5, 5), P(-6, -10)], true); ctx.fill();
    };
    arm(J.armF, 'sleeveFar');

    // --- legs: hose on the body's own profile, and soft shoes (they show below the hem)
    const leg = (L, far) => {
      ctx.fillStyle = T(far ? 'hoseFar' : 'hose'); part(ctx, L.hip, L.knee, BODY.thigh, 0); part(ctx, L.knee, L.ank, BODY.shin, 0); disc(ctx, L.knee, 7.4); disc(ctx, L.ank, 4.7);
      ctx.fillStyle = T(far ? 'shoeFar' : 'shoe'); foot(ctx, L);
    };
    leg(J.legF, true); leg(J.legN, false);

    // --- the robe: it lies on the chest with a little ease, blouses over the cord at his waist, and below it falls as the cloth does
    const yr = j => h[1] + CL.d[j], hemY = h[1] + CL.d[3] - lift;
    const yF = hemY - .16 * Math.max(0, f[3] - CL.rf[3]), yB = hemY - .1 * Math.max(0, CL.rb[3] - b[3]);
    const front = [st(.03, 9), st(.14, 15.5), st(.3, 22.5), st(.5, 24), st(.67, 23), st(.78, 19.5), [h[0] + f[0], yr(0)], [h[0] + f[1], yr(1)], [h[0] + f[2], yr(2)], [h[0] + f[3], yF, 1]];
    const back = [[h[0] + b[3], yB, 1], [h[0] + b[2], yr(2)], [h[0] + b[1], yr(1)], [h[0] + b[0], yr(0)], st(.78, -15), st(.66, -17.5), st(.5, -20), st(.3, -22.5), st(.12, -19), st(.03, -11)];
    const hem = []; for (let i = 1; i < 7; i++) { const u = 1 - i / 7; hem.push([h[0] + lerp(b[3], f[3], u), lerp(yB, yF, u) + 2.2 * Math.sin(Math.PI * u) + .9 * Math.sin(u * 15.7 + 1)]); }
    const robe = () => { ctx.beginPath(); curve(ctx, front.concat(hem, back), true); };
    ctx.fillStyle = T('robe'); robe(); ctx.fill();
    ctx.save(); robe(); ctx.clip();
    const edge = (pts, wd, col) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); curve(ctx, pts); ctx.stroke(); };
    edge(back, 18, T('robeSh')); edge([front[9]].concat(hem, [back[0]]), 5, T('robeSh')); edge(front.slice(1, 9), 8, T('robeLt'));      // the shaded back, the hem's weight, the lit front
    // pipe folds: cloth gathered under the cord falls in soft tubes; they spread as the skirt opens
    const across = (u, j) => [h[0] + lerp(b[j], f[j], u), yr(j)], wa = st(.79, 0);
    [[.3, 1.2, 'robeSh'], [.53, 1, 'robeDk'], [.76, .9, 'robeSh']].forEach(([u, wd, tn]) => stroke(ctx, [[wa[0] + lerp(-13, 17, u), wa[1] + 2], across(u, 0), across(u, 1), across(u, 2), [across(u, 3)[0], lerp(yB, yF, u) + 2]], t => wd * Math.min(1, t * 2.4), T(tn)));
    // tension folds: where a knee pushes the cloth, a fold runs from the knee back to where the cloth is held
    const lead = J.legF.knee[0] > J.legN.knee[0] ? J.legF : J.legN, pull = Math.max(0, Math.min(1, (f[2] - CL.rf[2]) / 14));
    if (pull > .12) {
      const kp = [Math.min(lead.knee[0] + 8, h[0] + f[2] - 4), Math.min(lead.knee[1], yr(3) - 14)], a1 = [h[0] + b[3] + 9, yB - 9], a2 = [h[0] + b[0] + 7, yr(0) - 8];
      stroke(ctx, [kp, add(mix(kp, a1, .5), [0, 8 * pull]), a1], leaf(1.5 * pull), T('robeDk'));
      stroke(ctx, [add(kp, [-2, -3]), add(mix(kp, a2, .5), [3, 4 * pull]), a2], leaf(1 * pull), T('robeSh'));
    }
    ctx.restore();
    // the cord at his waist, its knot and ends, and the pouch hanging from it
    ctx.strokeStyle = T('belt'); ctx.lineWidth = 2; ctx.beginPath(); curve(ctx, [st(.775, 19.6), st(.8, 8), st(.79, -4), st(.775, -14.6)]); ctx.stroke();
    stroke(ctx, [st(.8, 10), st(.9, 11.5), st(1.02, 10.5)], t => 1.1 - .5 * t, T('belt')); stroke(ctx, [st(.8, 10), st(.92, 8.5), st(1.06, 8.2)], t => 1.1 - .5 * t, T('belt'));
    fill([st(.81, 0), st(.82, -7), st(.93, -8), st(.96, -3.5), st(.93, 1)], T('robeDk'));

    // --- the cloak's back flap: a loose panel hanging down his back, outside the skirt
    const inX = d => h[0] + lerp(edgeAt(b, CL.rb, d), edgeAt(f, CL.rf, d), .3), o0 = [h[0] + fl[0], h[1] + CL.fd[0]], o1 = [h[0] + fl[1], h[1] + CL.fd[1]], o2 = [h[0] + fl[2], h[1] + CL.fd[2], 1], ib = [inX(80), h[1] + 80, 1];
    fill([st(.62, -3), st(.6, -20), [h[0] + Math.min(b[0] - 2, fl[0] + 3), h[1] + 12], o0, o1, o2, [lerp(o2[0], ib[0], .35), o2[1] - 1.5], [lerp(o2[0], ib[0], .7), ib[1] + .5], ib, [inX(54), h[1] + 54], [inX(26), h[1] + 26]], T('flap'));
    stroke(ctx, [st(.66, -4), [inX(26), h[1] + 26], [inX(54), h[1] + 54], [ib[0], ib[1]]], t => 1.5 * Math.min(1, 3 * t) * (1 - .4 * t), T('robeDk'));      // the dark fold where it lies on the skirt

    // --- the burden: a heavy sack bound on his back. It hangs from its tie behind his shoulders, its weight low, its inner
    //     side flat against him; it sags a beat after the body and spreads a little as it does
    const tilt = J.lean + S[16] + .05 + by * .004, tie = add(st(.07, -15), [0, by]), sq = 1 + .012 * Math.max(-3, Math.min(4, by)), sp = v => add(tie, R([v[0] * sq, v[1] / sq], tilt));
    fill([[-2, -1], [-9, -9], [-6, -15], [1, -14], [5, -9], [4, -1]].map(sp), T('sackLt'));      // its gathered mouth above the tie
    const sack = [[3, 3], [6.5, 20], [7, 45], [3.5, 62], [-9, 73.5], [-27, 70.5], [-38, 57], [-36.5, 39], [-28.5, 20], [-17, 7], [-8, 2]].map(sp);
    fill(sack, T('sack'));
    ctx.save(); ctx.beginPath(); curve(ctx, sack, true); ctx.clip();
    fill([[-46, 38], [-37, 56], [-23, 65], [-5, 64], [8, 54], [12, 80], [-48, 80]].map(sp), T('sackSh'));      // its underside in shade
    stroke(ctx, [sp([-3, 5]), sp([-14, 18]), sp([-20, 36])], leaf(1.1), T('sackSh')); stroke(ctx, [sp([0, 6]), sp([-4, 24]), sp([-5, 44])], leaf(.9), T('sackSh'));      // creases where the weight pulls from the tie
    ctx.restore();
    stroke(ctx, [sp([-11, 3]), sp([-2, 1.5]), sp([5, 2.5])], leaf(1.7), T('strap'));      // the tie

    ctx.strokeStyle = T('strap'); ctx.lineWidth = 2.2; ctx.beginPath(); curve(ctx, [sp([3, 2]), add(J.shoulder, [3, -5]), add(J.shoulder, [12, 6]), add(J.shoulder, [9, 20]), sp([8, 36])]); ctx.stroke();      // the rope that binds it: over his shoulder, across his chest, under his arm
    // --- near arm; then his head, and the hood over it: the hood's edge stands back from his face, so brow, nose and chin show
    arm(J.armN, 'sleeve');
    ctx.fillStyle = T('face'); part(ctx, n, hp([-2, 11]), [[0, 6.5, 7], [1, 6, 6.5]], 0); fill(BODY.skull.map(hp), T('face'));
    const hood = [np([18, 21]), np([20.5, 9]), hp([10.5, 20]), hp([9.5, 16.5]), hp([7, 12]), hp([7.5, 2]), hp([9.5, -7]), hp([13.6, -13]), hp([11, -18.6]), hp([2, -21.5]), hp([-9, -21.4]), hp([-17.5, -14.5]), hp([-20.3, -3]), hp([-18.5, 9]), np([-11.5, 2]), np([-16, 10]), np([-15.5, 18.5]), np([-6, 24]), np([6, 25.5])];
    fill(hood, T('hood'));
    ctx.save(); ctx.beginPath(); curve(ctx, hood, true); ctx.clip();
    stroke(ctx, [hp([-7, -23]), hp([-18, -9]), hp([-19, 8]), np([-17, 14])], t => 4 * t + 1.5, T('hoodSh'));      // the back of the hood in shade
    stroke(ctx, [hp([8, 14]), hp([4, 4]), hp([8, -8])], leaf(2.2), T('hoodSh'));      // the shadow inside the opening
    ctx.restore();
    ctx.restore();
  }

  // the bare mannequin: the body the clothes are built on (the art schools' lay figure, in profile)
  function body(ctx, S, x, y, face, Kk, o) {
    o = o || {}; const J = joints(S), far = o.far || '#857e72', near = o.near || '#bab3a4', mid = o.mid || '#a39c8e', jc = o.joint || '#6d675d';
    ctx.save(); ctx.translate(x, y); ctx.scale((face || 1) * Kk, Kk); ctx.translate(-K.ax, -K.ground); ctx.lineJoin = 'round';
    const hp = v => add(J.head, R(v, J.nod)), dot = (c, r) => { ctx.fillStyle = jc; disc(ctx, c, r); };
    const arm = (A, col) => {
      const d = dirv(A.b, 1), fr = [d[1], -d[0]], P = (k, m) => [A.wr[0] + d[0] * k + fr[0] * m, A.wr[1] + d[1] * k + fr[1] * m];
      stroke(ctx, [P(0, 0), P(7, .4), P(12.5, 1.6)], t => 3.3 - 1.4 * t, col); ctx.fillStyle = col; disc(ctx, P(5, 3), 1.7);
      part(ctx, A.sh, A.el, BODY.upper, 0); part(ctx, A.el, A.wr, BODY.fore, 0); disc(ctx, A.el, 5.5); dot(A.el, 2.2); dot(A.wr, 1.8);
    };
    const leg = (L, col) => { ctx.fillStyle = col; disc(ctx, L.hip, 11.5); part(ctx, L.hip, L.knee, BODY.thigh, 0); part(ctx, L.knee, L.ank, BODY.shin, 0); disc(ctx, L.knee, 7.4); disc(ctx, L.ank, 4.7); foot(ctx, L); dot(L.knee, 3); dot(L.ank, 2.2); };
    arm(J.armF, far); leg(J.legF, far);
    ctx.fillStyle = mid; const t = sides(J.neck, J.hip, BODY.torso, 0, 1.26, 22); closed(ctx, t[0], t[1]);
    part(ctx, J.neck, hp([-2, 11]), [[0, 6.5, 7], [1, 6, 6.5]], 0); ctx.beginPath(); curve(ctx, BODY.skull.map(hp), true); ctx.fill();
    leg(J.legN, near); arm(J.armN, near); dot(J.shoulder, 2.8); dot(J.hip, 3.4);
    ctx.restore();
  }
  return { K, CL, TONE, LOOK, BODY, load, figure, body, joints, pose, fromTrack, classic, ik, clothNew, clothStep, clothPose, bake, add: add_, skelAt, clothAt, anims: ANIMS };
})();
