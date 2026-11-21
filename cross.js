// ============================================================
// LEVEL 5, THE CROSS (book {92} to {94}). Loaded by index.html after rooms.js and run by the same engine (talk, captions,
// the tray). Everything of its own is inside CR.
//
// THE PICTURE (owner, after Caspar David Friedrich; settled in concept/level5-cross-sketch.jpg): one LONG SLOPE rising
// left to right to a rounded crown, ONE small plain cross on it against the sky, pale far ridges in haze behind, the slope
// itself dark. Before dawn first (cold blue-grey); the burden falls by itself as he comes up with the cross ({93}), tumbles
// all the way back down the slope he climbed and into the sepulchre at its foot ("a little below, in the bottom"); a silence;
// then the sun rises exactly behind where the beams cross, colour comes back from the light outward, and Amazing Grace is
// played whole and in tune for the first time in the game. Then the three Shining Ones, figures of light ({94}); his new
// clothes, the mark, the sealed roll; three leaps for joy; he goes on.
//
// His standing, the burden slipping off, and his standing tall with his head lifted are ONE free clip (Modal, the clips
// branch: christian-burden-falls), cut into assets/christian-cross.pack (81 frames at 16 a second; frames 41 on are his
// body alone) and assets/cross-burden.webp (the bundle as it lands, which the code then rolls down the slope).
// ============================================================
const CR = (() => {
  const SO = 'The Shining Ones', S1 = 'The first Shining One', S3 = 'The third Shining One';
  // ---------- the land (world units: x along the way, h up from the foot of the slope) ----------
  const START = 480, WALL_END = 860, TOMB_X = 4100, SLOPE0 = 1180, CREST0 = 4080, CROSS_X = 4260, CREST1 = 4480, FALL1 = 5400, H_TOP = 860;
  // the hill twice as high but the slope about as gentle as before, so it is longer (owner: "Not necessarily twice as steep - I like the old slope (maybe a tad steeper is ok)")
  // the cross and the hill larger beside him (owner: "cross needs to be bigger, relative to Christian, hill too"): he is about 150 units tall
  const CROSS_H = 340, CROSS_BY = CROSS_H * .74;
  // THE CLIMB TOLD BY A CUT (owner: "zoom in on Christian climbing and then fade slightly then unfade and zoom out and he's at top"):
  // past CLOSE0 the camera comes in close on him climbing; at CUT_X the picture dips softly toward dark, he is set near the top
  // (SKIP_TO), and it comes up again on a wide look down the hill from the top; then the camera comes back down to him
  const CLOSE0 = SLOPE0 + 40, CUT_X = SLOPE0 + 300, SKIP_TO = CROSS_X - 640;
  // where he stands when the burden falls: just short of the cross, facing it, as he came up (owner: "I'm not sure about
  // switching his orientation, walking past cross is strange, maybe sepulcher can be below him and a little to the left and
  // then burden can roll down and down"): it falls off behind him and rolls back down the slope he climbed, into the
  // sepulchre in a hollow of the hillside below ("a little below, in the bottom, a sepulchre", {93})
  const STOP_X = CROSS_X - 300;
  const sm = (a, b, x) => smooth(a, b, x);
  function gh(x) {
    let h = H_TOP * Math.pow(sm(SLOPE0, CREST0, x), 1.15);
    h += 10 * Math.sin(Math.PI * clamp((x - CREST0 + 200) / 600)) * sm(SLOPE0, CREST0, x);
    h -= (H_TOP - 70) * sm(CREST1, FALL1, x);      // the far side falls to a hollow 70 above the near foot, where the sepulchre is
    h += (3 * Math.sin(x * .011) + 1.6 * Math.sin(x * .031 + 1)) * sm(SLOPE0, SLOPE0 + 300, x) * (1 - sm(CREST0 - 100, CREST0, x));
    return h;
  }
  // ---------- the words (Bunyan's, shortened and made plain) ----------
  const OPEN = [[N, 'Up the highway between its walls Christian ran, but not without great difficulty, because of the load on his back.']];      // {92}
  const ASCEND = [[N, 'He came to a place somewhat ascending, and upon that place stood a cross, and a little below, a sepulchre.']];      // {93}
  const LOOSED = [[N, 'Just as Christian came up with the cross, his burden loosed from off his shoulders, and fell from off his back.']];      // {93}
  const TUMBLE = [[N, 'It began to tumble, and so continued, till it came to the mouth of the sepulchre, where it fell in, and I saw it no more.']];      // {93}
  const GLAD = [[C, 'He hath given me rest by his sorrow, and life by his death.']];      // {94}
  const LOOKED = [[N, 'He stood still to wonder, that the sight of the cross should ease him of his burden.'], [N, 'He looked, and looked again, till the tears ran down his cheeks.']];      // {94}
  const SHINE = [      // {94}
    [SO, 'Peace be unto thee.'],
    [S1, 'Thy sins be forgiven thee.'],
    [N, 'The second took off his rags, and clothed him with new clothes.', 0, () => { robeTo = 1; chime([74, 79, 83], .03); }],
    [N, 'The third set a mark on his forehead, and gave him a roll with a seal upon it.', 0, () => { markTo = 1; rollShow = 1; }],
    [TIP, 'Touch the roll.', 'roll'],
    [S3, 'Look on it as you run, and give it in at the Celestial Gate.'],
    [N, 'So they went their way.', 0, () => { goneTo = 1; }],
  ];
  const LEAPS = [
    [N, 'Then Christian gave three leaps for joy, and went on singing.'],
    [TIP, 'Touch Christian to leap for joy.', 'leap'],
    [C, 'Blest cross! Blest sepulchre! Blest rather be the Man that there was put to shame for me!'],      // vision chat: his song ({94})
  ];
  const ALL = [...OPEN, ...ASCEND, ...LOOSED, ...TUMBLE, ...GLAD, ...LOOKED, ...SHINE, ...LEAPS];

  // ---------- pictures ----------
  const CLIP = [], CLIP_META = { ax: 182.5, ground: 299, frames: 81 }, SWAP = 41, BALL = { ax: 31, w: 99, h: 118 };
  let BURDEN = null, loaded = false;
  function preload() {
    if (loaded) return; loaded = true;
    loadPack('christian-cross', CLIP).catch(() => {});
    loadImg('cross-burden.webp').then(im => { BURDEN = im; }).catch(() => {});
  }

  // ---------- state ----------
  let ph = '', t = 0, cam = { cx: 0, z: 1, wl: 420 }, wideK = 0, wideTo = 0;
  const Ch = { x: START, anim: 12, sd: null, cf: -1, cfd: 1, hop: 0, hops: 0, lastV: 0, fade: 0, face: 1, tv: null };
  let bur = null, dawn = 0, gold = 0, goldTo = 0, sun = 0, robe = 0, robeTo = 0, mark = 0, markTo = 0, rollShow = 0, rollGone = 0, shine = 0, shineTo = 0, gone = 0, goneTo = 0;
  let closeK = 0, topK = 0, topTo = 0, veil = 0, climb = null;
  let rollFly = null, rollAt = null; const ROLL_FLY = 80;
  let said = {}, hymn = null, silenceT = 0, tombT = 0, leapsLeft = 3, endT = 0, quietPad = 0;
  const frameOf = a => ((Math.floor(a) % CHR.length) + CHR.length) % CHR.length;

  // ---------- sound ----------
  const PAD = []; let padOn = false, padV = 0;
  function padStart() {
    if (!audio() || padOn) return; padOn = true;
    for (const [m, ty, v] of [[38, 'sine', .5], [45, 'sine', .35], [50, 'triangle', .18], [53, 'sine', .14]]) {
      const o = AC.createOscillator(), b = AC.createBiquadFilter(), g = AC.createGain();
      o.type = ty; o.frequency.value = hz(m); o.detune.value = (Math.random() - .5) * 8; b.type = 'lowpass'; b.frequency.value = 600; g.gain.value = 0;
      o.connect(b); b.connect(g); g.connect(CLEAR); o.start(); PAD.push({ o, g, v });
    }
  }
  function padStop() { if (!padOn) return; padOn = false; const n = AC.currentTime; for (const p of PAD) { p.g.gain.setTargetAtTime(0, n, .6); p.o.stop(n + 4); } PAD.length = 0; }
  function padTick(target) {
    if (!padOn) return; padV += (target - padV) * .02;
    const n = AC.currentTime, k = padV * (G.state === 'dialog' || saying() ? .5 : 1);
    for (const p of PAD) p.g.gain.setTargetAtTime(p.v * k * .05, n, .3);
  }
  function chime(ms, v = .035) { ms.forEach((m, i) => note(m, v, 3.4, i * .18)); }
  function thump(k = 1) { if (!audio()) return; hiss(90, .8, .14 * k, .35); hiss(200, 1, .06 * k, .2); }

  // THE HYMN, WHOLE AND IN TUNE (saved for this moment: owner, builds 374 to 376): the tune of Level 1's lights (TUNE, in
  // index.html), slower than at the city gate, with a low note under each bar and a soft chord on the first beat of each
  const CHORDS = [[55, 59, 62], [55, 59, 62], [60, 64, 67], [55, 59, 62], [55, 59, 62], [55, 59, 62], [50, 54, 57], [50, 54, 57], [55, 59, 62], [55, 59, 62], [60, 64, 67], [55, 59, 62], [55, 59, 62], [50, 54, 57], [55, 59, 62], [55, 59, 62]];
  const BEATT = 34;
  function hymnTick() {
    if (!hymn) return; hymn.t++;
    while (hymn.i < TUNE.length && hymn.t >= TUNE[hymn.i][0] * BEATT) { note(TUNE[hymn.i][1], .075, 3.6); hymn.i++; }
    while (hymn.b < BASS.length && hymn.t >= hymn.b * 3 * BEATT) { note(BASS[hymn.b] - 12, .05, 4.5, 0, false); (CHORDS[hymn.b] || []).forEach((m, i) => note(m - 12, .018, 4.2, .03 * i, false)); hymn.b++; }
  }
  const hymnDone = () => hymn && hymn.i >= TUNE.length && hymn.t > 48 * BEATT;

  // ---------- camera ----------
  const sx = x => (x - cam.cx) * cam.z + VW / 2, sy = h => cam.wl - h * cam.z;
  const FOOTY = 418, HY = 322;
  function camTick(snap) {
    const near = { cx: Ch.x + lerp(250, 110, closeK), z: lerp(.8, 1.25, closeK) };
    if (ph === 'cross' || ph === 'after' || ph === 'shine' || ph === 'leaps' || ph === 'end') { near.cx = CROSS_X - 130; near.z = .86; }
    const open = ph === 'look', fitT = (FOOTY - 30) / (gh(CROSS_X) + CROSS_H - tombSill() + 40);
    const wide = open ? { cx: (START + CROSS_X) / 2 + 420, z: Math.min(VW / (CROSS_X - START + 900), (FOOTY - 40) / (H_TOP + CROSS_H + 40)) } : { cx: CROSS_X - 60, z: Math.min(VW / 1500, fitT) };
    let tcx = lerp(near.cx, wide.cx, wideK), tz = Math.exp(lerp(Math.log(near.z), Math.log(wide.z), wideK));
    const wh = open ? 40 : tombSill() - 14, fh = lerp(gh(Ch.x), wh, wideK);
    let twl = FOOTY + fh * tz + (open ? 28 : 0) * wideK;
    // the look from the top after the cut: wide, he and the cross high in the picture, the hill falling away below
    if (topK > .001) { const z2 = .4, wl2 = 250 + gh(Ch.x) * z2; tcx = lerp(tcx, Ch.x - 40, topK); twl = lerp(twl, wl2, topK); tz = Math.exp(lerp(Math.log(tz), Math.log(z2), topK)); }
    const e = snap ? 1 : .045; cam.cx += (tcx - cam.cx) * e; cam.z += (tz - cam.z) * e; cam.wl += (twl - cam.wl) * e;
  }

  // ---------- Christian ----------
  function walk(v) {
    const fr0 = frameOf(Ch.anim);
    if (v) { if (Ch.sd != null) { Ch.sd = null; Ch.anim = 1; } }
    else if (Ch.sd == null) { if (fr0 === 28 || fr0 === 1 || !STD.length) Ch.sd = fr0 === 28 ? 0 : STAND_FROM_1; else v = .45; }
    Ch.x += v; Ch.lastV = v; Ch.anim = stepAnim(Ch.anim, v, CHR_STEP, CHR_META);
    const fr1 = frameOf(Ch.anim);
    if (v && fr1 !== fr0 && CHR_META.rest.includes(fr1) && audio()) sfx.step(false, ph === 'walk' ? 1.4 : .9);
    return v;
  }
  const tintNow = () => {
    const pre = [58, 58, 72], dw = [70, 62, 66], gd = [96, 78, 64], robeC = [150, 128, 100];
    let c = mix(pre, dw, dawn); c = mix(c, gd, gold); return mix(c, robeC, robe * .6);
  };
  const figC = mk(8, 8);
  function figure(c, im, meta, x, h, face, alpha, tint, rim) {
    if (!im || alpha <= .004) return;
    im = solidOf(im);
    const W = im.width, H = im.height; if (figC.width !== W || figC.height !== H) { figC.width = W; figC.height = H; }
    const f = figC.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, W, H); f.drawImage(im, 0, 0);
    f.globalCompositeOperation = 'multiply'; f.fillStyle = css(tint); f.fillRect(0, 0, W, H);
    if (rim > .01) { const g = f.createLinearGradient(face > 0 ? 0 : W, 0, face > 0 ? W : 0, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, css([255, 210, 150], .35 * rim)); f.globalCompositeOperation = 'source-atop'; f.fillStyle = g; f.fillRect(0, 0, W, H); }
    f.globalCompositeOperation = 'destination-in'; f.drawImage(im, 0, 0); f.globalCompositeOperation = 'source-over';
    const K = CHR_K;
    c.save(); c.translate(x, -h + 3); c.scale(face, 1); c.globalAlpha = alpha;
    c.drawImage(figC, -meta.ax * K, -meta.ground * K, W * K, H * K); c.restore();
  }
  function contact(c, x, h, a = 1, rx = 34) { const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, 'rgba(6,6,12,.5)'); g.addColorStop(.6, 'rgba(6,6,12,.24)'); g.addColorStop(1, 'rgba(6,6,12,0)'); c.save(); c.translate(x, -h + 3); c.scale(rx, 5); c.globalAlpha = a; c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore(); }
  function drawChr(c) {
    const tint = tintNow(), rim = gold * (1 - wideK), x = Ch.x, h = gh(x) + Ch.hop;
    contact(c, x, gh(x), 1 - Math.min(1, Ch.hop / 40) * .6);
    const useClip = Ch.cf >= 0 && CLIP.ready, fc = Ch.face;
    if (Ch.tv && TURN.length) { const f0 = clamp(Math.round(Ch.tv.t), 0, TURN.length - 1); figure(c, TURN[f0], TURN_META, x, h, 1, 1, tint, rim); return; }
    if (useClip) {
      const f0 = clamp(Math.round(Ch.cf), 0, CLIP.length - 1);
      if (Ch.fade < 1 && STD.length) figure(c, STD[atTime(STD_META, breathT(Ch.sd || 0))], STD_META, x, h, fc, 1 - Ch.fade, tint, rim);
      figure(c, CLIP[f0], CLIP_META, x, h, fc, Ch.fade < 1 ? Ch.fade : 1, tint, rim);
      if (mark > .01) { const hx = x + 14 * fc, hy = -h - 138; const g = c.createRadialGradient(hx, hy, 0, hx, hy, 9); g.addColorStop(0, css([255, 244, 214], .8 * mark)); g.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = g; c.fillRect(hx - 10, hy - 10, 20, 20); }
    } else if (Ch.sd != null && STD.length) figure(c, STD[atTime(STD_META, breathT(Ch.sd))], STD_META, x, h, fc, 1, tint, rim);
    else figure(c, CHR[frameOf(Ch.anim)], CHR_META, x, h, 1, 1, tint, rim);
  }
  // the burden on its own, rolling back down the slope he climbed
  function drawBurden(c) {
    if (!bur || !BURDEN || bur.a <= 0) return;
    const K = CHR_K, w = BALL.w * K * bur.k, hh = BALL.h * K * bur.k, h = bur.H != null ? bur.H : gh(bur.x) + bur.y;
    
    c.save(); c.translate(bur.x, -h - hh / 2 + 2); c.rotate(bur.r); c.globalAlpha = bur.a;
    const tint = tintNow(), W = BURDEN.width, H = BURDEN.height;
    if (figC.width !== W || figC.height !== H) { figC.width = W; figC.height = H; }
    const f = figC.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, W, H); f.drawImage(BURDEN, 0, 0); f.globalCompositeOperation = 'multiply'; f.fillStyle = css(mix(mix(tint, [150, 140, 146], bur.H != null ? .4 : 0), [20, 18, 22], bur.dk));       f.fillRect(0, 0, W, H); f.globalCompositeOperation = 'destination-in'; f.drawImage(BURDEN, 0, 0); f.globalCompositeOperation = 'source-over';
    c.drawImage(figC, -w / 2, -hh / 2, w, hh); c.restore();
  }
  function burdenTick() {
    if (!bur) return;
    if (bur.st === 'roll') {
      // it tumbles down the hill's face toward us, faster and faster, bouncing, to the door at its foot
      if (bur.x0 == null) { bur.x0 = bur.x; bur.H0 = gh(bur.x); }
      bur.t++; const T = 230, u = Math.min(1, bur.t / T), f = Math.pow(u, 1.5), n = 6;
      bur.x = lerp(bur.x0, TOMB_X, sm(0, 1, u));
      const b = Math.abs(Math.sin(Math.PI * n * f)), bb = 46 * Math.pow(1 - f, 1.2);
      bur.H = lerp(bur.H0, tombSill() + 6, f) + b * bb;
      const hop = Math.floor(n * f); if (hop !== bur.hop) { bur.hop = hop; if (bur.t > 4) thump(Math.min(1, .45 + f * .6)); }
      bur.r -= .045 + .06 * f; bur.k = 1 + .14 * f;
      if (u >= 1) { bur.st = 'in'; bur.t = 0; bur.x0 = bur.x; }
    } else if (bur.st === 'in') {
      // into the mouth of the sepulchre, into the dark, then gone
      bur.t++; bur.H = tombSill() + 6; bur.r -= .02 * (1 - bur.t / 54); bur.k = 1.14 - .5 * sm(0, 44, bur.t); bur.dk = sm(4, 34, bur.t); bur.a = 1 - sm(24, 50, bur.t);
      if (bur.t === 26) { thump(1.3); if (audio()) hiss(70, .6, .12, 1.6); }
      if (bur.t > 54) { bur.st = 'gone'; tombT = t; }
    }
  }

  // ---------- painting the land ----------
  function rgen(seed) { let s = seed >>> 0 || 1; return () => { s = s + 0x6D2B79F5 | 0; let q = Math.imul(s ^ s >>> 15, 1 | s); q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296; }; }
  const RIDGES = [1, 2].map(seed => { const r = rgen(seed * 31 + 7); return [1, 2, 3, 4, 5].map(k => [r() * 6.28, k]); });
  const ridgeY = (i, X, base, amp) => { let y = base; for (const [p, k] of RIDGES[i]) y += amp / k * Math.sin(X * k * k * .0011 + p); return y; };
  function sky(c) {
    const pre = [[26, 30, 44], [60, 66, 84], [118, 112, 120]], dw = [[30, 34, 50], [78, 74, 92], [168, 140, 134]], gd = [[84, 100, 132], [206, 172, 146], [246, 214, 164]];
    const st = [0, 1, 2].map(i => mix(mix(pre[i], dw[i], dawn), gd[i], gold));
    const g = c.createLinearGradient(0, 0, 0, HY + 40); g.addColorStop(0, css(st[0])); g.addColorStop(.6, css(st[1])); g.addColorStop(1, css(st[2]));
    c.fillStyle = g; c.fillRect(0, 0, VW, VH);
    // the far light, low behind the crown before dawn; the sun rising behind where the beams cross after
    const cxs = sx(CROSS_X), top = sy(gh(CROSS_X) + CROSS_BY + 4), y0 = sy(gh(CROSS_X)) + 40, sY = lerp(y0, top, sm(0, 1, sun));
    const glowR = 260 + 200 * gold, gg = c.createRadialGradient(cxs, sY, 0, cxs, sY, glowR);
    gg.addColorStop(0, css([255, 226, 170], .18 + .5 * gold + .1 * dawn)); gg.addColorStop(.4, css([250, 196, 140], .08 + .22 * gold)); gg.addColorStop(1, 'rgba(250,190,140,0)');
    c.fillStyle = gg; c.fillRect(0, 0, VW, VH);
    if (sun > .01) { const R = 15 + 4 * cam.z, d = c.createRadialGradient(cxs, sY, 0, cxs, sY, R * 2.2); d.addColorStop(0, css([255, 252, 236], .95 * sun)); d.addColorStop(.45, css([255, 240, 200], .85 * sun)); d.addColorStop(.5, css([255, 226, 170], .35 * sun)); d.addColorStop(1, 'rgba(255,220,160,0)'); c.fillStyle = d; c.fillRect(cxs - R * 3, sY - R * 3, R * 6, R * 6); }
    // a few long thin clouds, lit from beneath after dawn
    for (const [y, w, a, p] of [[.16, .9, .1, .05], [.27, .7, .08, .02], [.36, 1.1, .07, .08]]) {
      const yy = y * VH, xx = VW * (.5 + .25 * Math.sin(p * 9)) - (cam.cx * .02) % 300, cl = mix([70, 74, 92], [255, 214, 170], gold);
      c.save(); c.translate(xx, yy); c.scale(VW * w / 2, 7); const q = c.createRadialGradient(0, 0, 0, 0, 0, 1); q.addColorStop(0, css(cl, a + .08 * gold)); q.addColorStop(1, css(cl, 0)); c.fillStyle = q; c.fillRect(-1, -1, 2, 2); c.restore();
    }
  }
  function far(c) {
    const L = [[HY - 6, 10, .06, [92, 94, 110], [214, 190, 170], [120, 118, 132], [246, 216, 172]], [HY + 26, 14, .14, [74, 74, 90], [188, 162, 146], [104, 102, 118], [240, 206, 164]]];
    L.forEach(([base, amp, p, c0, c1, h0, h1], i) => {
      const col = mix(mix(c0, mix(c0, c1, .4), dawn), c1, gold), hz0 = mix(mix(h0, mix(h0, h1, .4), dawn), h1, gold);
      c.beginPath(); c.moveTo(0, VH);
      for (let X = 0; X <= VW + 8; X += 8) c.lineTo(X, ridgeY(i, X + cam.cx * p * 6, base, amp));
      c.lineTo(VW, VH); c.closePath(); c.fillStyle = css(col); c.fill();
      const g = c.createLinearGradient(0, base - 18, 0, base + 30); g.addColorStop(0, css(hz0, 0)); g.addColorStop(.5, css(hz0, .45)); g.addColorStop(1, css(hz0, 0)); c.fillStyle = g; c.fillRect(0, base - 18, VW, 48);
    });
  }
  // the land in world units (the transform is set by the caller)
  // the hill's rock (owner: "maybe give the hill more rock texture (with layers of different shades - subtle but
  // beautiful)"): baked once at half the world's size and drawn stretched, clipped to the land: bands of rock lying under
  // the hill's outline, each a shade lighter or darker than the next, their edges wandering, a faint lit ledge along the
  // top of some and a dark seam under it, and a fine grain over all; all in light and dark alpha, so it takes the hill's
  // own colour as the dawn comes
  let ROCK = null;
  function rockTex() {
    if (ROCK) return ROCK;
    const X0 = START - 700, X1 = FALL1 + 900, Y0 = -H_TOP - 40, Y1 = 700, k = .5;
    const cv = document.createElement('canvas'); cv.width = Math.ceil((X1 - X0) * k); cv.height = Math.ceil((Y1 - Y0) * k); const q = cv.getContext('2d');
    q.scale(k, k); q.translate(-X0, -Y0);
    const r = rgen(77), bands = []; let d = 26 + r() * 20;
    while (d < H_TOP + 200) { bands.push({ d, a: (r() - .5) * .09, p: [r() * 6.3, r() * 6.3, r() * 6.3], amp: 6 + r() * 14, lit: r() < .55 }); d += 34 + r() * 70; }
    // value noise on cells of 26 and 9 units, so each edge breaks in small steps and chips, as rock does
    const VN = (x, c, seed) => { const i = Math.floor(x / c), f = x / c - i, h = n => { const t = Math.sin((n + seed * 101) * 127.1) * 43758.5; return t - Math.floor(t) - .5; }; return h(i) + (h(i + 1) - h(i)) * (f * f * (3 - 2 * f)); };
    const yAt = (b, x) => -(gh(x) - b.d) + b.amp * (.6 * Math.sin(x * .004 + b.p[0]) + .3 * Math.sin(x * .011 + b.p[1]) + .1 * Math.sin(x * .037 + b.p[2])) + 9 * VN(x, 26, b.d) + 4 * VN(x, 9, b.d + 3);
    for (let i = 0; i < bands.length; i++) {
      const b = bands[i], n = bands[i + 1];
      q.beginPath(); for (let x = X0; x <= X1; x += 4) q.lineTo(x, yAt(b, x));
      if (n) for (let x = X1; x >= X0; x -= 4) q.lineTo(x, yAt(n, x)); else { q.lineTo(X1, Y1); q.lineTo(X0, Y1); }
      q.closePath(); q.fillStyle = b.a > 0 ? css([170, 164, 176], b.a) : css([0, 0, 0], -b.a * 1.3); q.fill();
      // the ledge: a dark seam with a faint lit lip above it, broken along its length
      q.lineWidth = 2.2; for (let x = X0; x < X1; x += 90 + r() * 160) { const L = 60 + r() * 260; if (r() < .35) continue;
        q.strokeStyle = css([0, 0, 0], .08); q.beginPath(); for (let u = x; u <= x + L; u += 4) q.lineTo(u, yAt(b, u) + 1.5); q.stroke();
        if (b.lit) { q.strokeStyle = css([190, 182, 196], .04); q.beginPath(); for (let u = x; u <= x + L; u += 4) q.lineTo(u, yAt(b, u) - 1.2); q.stroke(); } }
      // joints across the band and a few blocks a shade off its tone, so it reads as broken rock, not a stripe
      if (n) for (let x = X0 + r() * 120; x < X1; x += 70 + r() * 220) { const y1 = yAt(b, x), y2 = yAt(n, x + (r() - .5) * 20); if (y2 - y1 < 14) continue;
        q.strokeStyle = css([0, 0, 0], .05 + r() * .05); q.lineWidth = 1.4; q.beginPath(); q.moveTo(x, y1 + 2); q.lineTo(x + (r() - .5) * 18, lerp(y1, y2, .5) + (r() - .5) * 6); q.lineTo(x + (r() - .5) * 26, y2 - 2); q.stroke();
        if (r() < .4) { const w = 30 + r() * 80, yy = lerp(y1, y2, .2 + r() * .5), hh = Math.min(26, (y2 - y1) * .5);
          q.fillStyle = css([0, 0, 0], .03); q.beginPath(); q.moveTo(x + 4, yy); q.lineTo(x + w * .5, yy - 3 - r() * 4); q.lineTo(x + w, yy + 2); q.lineTo(x + w - 6, yy + hh); q.lineTo(x + 8, yy + hh - 2); q.closePath(); q.fill(); } }
    }
    // a fine grain of rock
    for (let i = 0; i < 26000; i++) { const x = X0 + r() * (X1 - X0), y = Y0 + r() * (Y1 - Y0), w = 2 + r() * 6;
      q.fillStyle = r() < .5 ? css([0, 0, 0], .05 + r() * .05) : css([180, 172, 186], .025 + r() * .03); q.fillRect(x, y, w, 1.6 + r() * 2); }
    return (ROCK = { c: cv, x: X0, y: Y0, w: X1 - X0, h: Y1 - Y0 });
  }
  function land(c) {
    const x0 = cam.cx - VW / 2 / cam.z - 40, x1 = cam.cx + VW / 2 / cam.z + 40, step = Math.max(4, 6 / cam.z);
    const hc = mix(mix([30, 30, 38], [36, 32, 36], dawn), [44, 34, 30], gold);
    c.beginPath(); c.moveTo(x0, 2000);
    for (let x = x0; x <= x1; x += step) c.lineTo(x, -gh(x));
    c.lineTo(x1, 2000); c.closePath(); c.fillStyle = css(hc); c.fill();
    // a breath of form (owner: "shade hill a slight bit to get sense of its 3d"): the hill a touch lighter just under its
    // outline, darker toward its foot, and its rock in layers (rockTex)
    c.save(); c.clip();
    const lite = mix(hc, [150, 146, 160], .5), dark = mix(hc, [6, 5, 8], .6);
    let g = c.createLinearGradient(0, -H_TOP, 0, 40);
    g.addColorStop(0, css(lite, .06)); g.addColorStop(.35, css(lite, 0)); g.addColorStop(.7, css(dark, 0)); g.addColorStop(1, css(dark, .5));
    c.fillStyle = g; c.fillRect(x0, -H_TOP - 60, x1 - x0, H_TOP + 2100);
    const R = rockTex(); c.drawImage(R.c, R.x, R.y, R.w, R.h);
    c.restore();
    // a thin edge of light along the crown, toward the sun (after dawn)
    if (gold > .01) {
      // one stroke with its strength along a gradient (short overlapping strokes with round caps showed as beads)
      c.save(); c.lineWidth = 2.4 / cam.z; c.lineCap = 'butt'; c.lineJoin = 'round';
      const ga = Math.max(x0, CROSS_X - 900), gb = Math.min(x1, CROSS_X + 900);
      if (gb > ga) { const g = c.createLinearGradient(CROSS_X - 900, 0, CROSS_X + 900, 0);
        for (let i = 0; i <= 12; i++) { const u = i / 12, k = Math.exp(-Math.pow((u - .5) * 1800 / 420, 2)) * gold; g.addColorStop(u, css([255, 214, 160], .7 * k)); }
        c.strokeStyle = g; c.beginPath(); for (let x = ga; x <= gb; x += step) c.lineTo(x, -gh(x) + .6 / cam.z); c.stroke(); }
      c.restore();
    }
  }
  // the wall of Salvation: a low coursed wall behind the way, ending where the land opens
  function wall(c) {
    const r = rgen(9), col = mix(mix([36, 36, 46], [42, 38, 44], dawn), [52, 42, 38], gold), WH = 64;
    c.beginPath(); c.moveTo(-600, 6); let x = -600;
    while (x < WALL_END) { const w = 14 + r() * 12, hh = r() * 2.5; c.lineTo(x, -WH - hh); c.lineTo(Math.min(WALL_END, x + w - 1), -WH - hh); x += w; }
    c.lineTo(WALL_END, -WH + 4); c.lineTo(WALL_END + 3, 6); c.closePath(); c.fillStyle = css(col); c.fill();
    c.strokeStyle = css(mix(col, [0, 0, 0], .18)); c.lineWidth = 1;
    for (let q = 1; q < 5; q++) { c.beginPath(); c.moveTo(-600, -WH + q * 13); c.lineTo(WALL_END, -WH + q * 13); c.stroke(); }
    // the coping catches a little of the sky
    c.fillStyle = css(mix(col, [200, 190, 190], .08 + .12 * gold)); c.fillRect(-600, -WH - 3, WALL_END + 600, 2);
  }
  // the sepulchre, cut into the body of the hill (owner: "down on the ground like in the body of hill"): in the flat side
  // view the dark mass under the slope's outline is the hill's face toward us, and the tomb is hewn into it, below the
  // surface: a rough cut face a breath lighter than the hill, a round-headed doorway dark within, a worn sill and a
  // narrow ledge before it, and the great round stone rolled aside on the ledge; the burden rolls down the slope above
  // and drops down the cut face into the door
  const DOOR_W = 38, DOOR_H = 104;
  // at the level of the plain, cut into the foot of the hill just left of the point under the cross (owner: "At bottom of
  // hill not on slope but on ground level below cross - when zoomed out it should be pretty much below cross (maybe to the
  // left of the point on the zoomed out ground at the base of the cross)")
  const tombSill = () => 6;
  // the sepulchre: a cave in the hill's foot (owner: "more like a cave and more integrated into hill side and base (which
  // is darker color) (very subtle but beautiful)"): an uneven dark mouth with a soft deeper shadow round it, the rock's
  // brow over it catching a faint light, and the round stone half sunk beside it in the hill's own tone
  const MOUTH = (() => { const r = rgen(31), P = []; for (let i = 0; i <= 28; i++) { const u = i / 28, a = Math.PI * (1 - u);
    P.push([Math.cos(a) * (60 + (r() - .5) * 10) * (1 + .12 * Math.pow(1 - Math.sin(a), 2)) + 3 * Math.sin(u * 7), -Math.pow(Math.sin(a), .7) * (DOOR_H - 18 + (r() - .5) * 9) * (1 + .05 * Math.sin(u * 5 + 1))]); } return P; })();
  function tomb(c) {
    const x = TOMB_X, sill = tombSill(), col = mix(mix([30, 30, 38], [36, 32, 36], dawn), [44, 34, 30], gold);
    c.save(); c.translate(x, -sill + 6);
    // a soft recess round the mouth, darker than the hill
    c.save(); c.scale(1.3, .85);
    let g = c.createRadialGradient(0, -70, 10, 0, -70, 150); g.addColorStop(0, css([6, 5, 8], .5)); g.addColorStop(.5, css([6, 5, 8], .2)); g.addColorStop(1, 'rgba(6,5,8,0)');
    c.fillStyle = g; c.fillRect(-160, -230, 320, 320); c.restore();
    // the mouth itself, deepest toward its top
    // the mouth: dark at its heart, its edge melting into the rock (laid a few times, each larger and fainter)
    const mouth = s => { c.beginPath(); MOUTH.forEach(([px, py], i) => i ? c.lineTo(px * s, py * s) : c.moveTo(px * s, py * s)); c.closePath(); };
    for (const [sc, a] of [[1.16, .12], [1.08, .2], [1, .45]]) { mouth(sc); c.fillStyle = css([5, 4, 7], a); c.fill(); }
    mouth(1); g = c.createRadialGradient(0, -38, 6, 0, -38, 78); g.addColorStop(0, css([3, 3, 5], .8)); g.addColorStop(1, css([3, 3, 5], .15)); c.fillStyle = g; c.fill();
    // the brow of rock over it: its edge catches a little light from the sky, faint
    c.strokeStyle = css(mix(col, [160, 150, 160], .35 + .2 * gold), .2); c.lineWidth = 1.4; c.lineCap = 'round';
    c.beginPath(); MOUTH.slice(5, 24).forEach(([px, py], i) => i ? c.lineTo(px, py - 1.5) : c.moveTo(px, py - 1.5)); c.stroke();
    // the great round stone, rolled aside and half sunk at the mouth's left, in the hill's own tone
    const rx = -104, rr = 46;
    c.save(); c.beginPath(); c.rect(-200, -300, 400, 300); c.clip();
    c.fillStyle = css(mix(col, [6, 5, 8], .3), .7); c.beginPath(); c.ellipse(rx, -rr + 10, rr * .9, rr, 0, 0, 7); c.fill();
    c.strokeStyle = css(mix(col, [160, 150, 160], .3), .15); c.lineWidth = 1.4; c.beginPath(); c.ellipse(rx, -rr + 10, rr * .9, rr, 0, Math.PI * 1.05, Math.PI * 1.75); c.stroke();
    c.restore();
    c.restore();
  }

  function cross(c) {
    const x = CROSS_X, h = gh(x), col = mix(mix([20, 20, 27], [22, 20, 24], dawn), [30, 22, 20], gold), H = CROSS_H, T = 14, bw = 186, by = CROSS_BY;
    c.save(); c.translate(x, -h + 4); c.fillStyle = css(col);
    // edges very slightly uneven, as a hand-hewn beam's are (owner: "ever slight variation to the straight edges to make it
    // look slightly (very slightly) more wooden"): a slow wander along each edge, a fine roughness, a hair of taper, ends
    // sawn a touch out of true; still two plain dark bars
    const r = rgen(5), wav = (s, u) => .25 * Math.sin(u * 7.3 + s) + .16 * Math.sin(u * 17.1 + s * 2.3) + (r() - .5) * .18;
    const UL = [], UR = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40; UL.push([-T / 2 * (1 - .04 * u) + wav(1, u), -H * u - (i === 40 ? .8 : 0)]); }
    for (let i = 0; i <= 40; i++) { const u = i / 40; UR.push([T / 2 * (1 - .04 * u) + wav(4, u), -H * u + (i === 40 ? .6 : 0)]); }
    c.beginPath(); UL.forEach(([px, py]) => c.lineTo(px, py)); for (let i = 40; i >= 0; i--) c.lineTo(UR[i][0], UR[i][1]); c.closePath(); c.fill();
    c.beginPath();
    for (let i = 0; i <= 30; i++) { const u = i / 30; c.lineTo(-bw / 2 + bw * u + (i === 0 ? .6 : i === 30 ? -.4 : 0), -by - T / 2 + u + wav(7, u)); }
    for (let i = 30; i >= 0; i--) { const u = i / 30; c.lineTo(-bw / 2 + bw * u + (i === 0 ? -.5 : i === 30 ? .7 : 0), -by + T / 2 + u - 1 + wav(9, u)); }
    c.closePath(); c.fill();
    // the low sun behind it: a thin gold edge down the upright's own sides and over its top, not across the beam
    if (gold > .01) {
      c.globalCompositeOperation = 'lighter'; c.strokeStyle = css([255, 220, 160], .35 * gold); c.lineWidth = 1.2; c.beginPath();
      for (const side of [UL, UR]) { let pen = false; side.forEach(([px, py]) => { const inBeam = py < -by + T / 2 + 1 && py > -by - T / 2 - 1; if (inBeam || py > -2) { pen = false; return; } pen ? c.lineTo(px, py) : c.moveTo(px, py); pen = true; }); }
      c.moveTo(UL[40][0], UL[40][1]); c.lineTo(UR[40][0], UR[40][1]); c.stroke(); c.globalCompositeOperation = 'source-over';
    }
    c.restore();
  }
  // the three Shining Ones: tall soft figures of light ("their faces shone as the light"), drawn with light, not paint
  const SH = [[CROSS_X - 92, 172, 3.1], [CROSS_X - 146, 186, 1.7], [CROSS_X - 204, 176, 0]];
  // a human shape of light, baked once: head, shoulders, a long robe to the ground, arms at the sides (the third holds
  // one arm out, the roll in his hand); drawn white, then blurred by shrinking and enlarging (no ctx.filter on iPhone)
  const SHF = {};
  function shineFig(reach) {
    const key = reach ? 'r' : 'n'; if (SHF[key]) return SHF[key];
    const W = 160, Hh = 400, s = mk(W, Hh), q = s.getContext('2d'), cx = 70;
    q.fillStyle = '#fff';
    q.beginPath(); q.ellipse(cx, 52, 17, 21, 0, 0, 7); q.fill();
    q.beginPath(); q.moveTo(cx - 9, 66); q.lineTo(cx + 9, 66); q.lineTo(cx + 11, 84); q.lineTo(cx - 11, 84); q.fill();
    q.beginPath(); q.moveTo(cx - 28, 96); q.quadraticCurveTo(cx, 78, cx + 28, 96); q.lineTo(cx + 30, 200); q.quadraticCurveTo(cx + 34, 300, cx + 42, 396);
    q.lineTo(cx - 42, 396); q.quadraticCurveTo(cx - 34, 300, cx - 30, 200); q.closePath(); q.fill();
    q.lineCap = 'round'; q.strokeStyle = '#fff'; q.lineWidth = 12;
    q.beginPath(); q.moveTo(cx - 32, 100); q.quadraticCurveTo(cx - 48, 160, cx - 44, 214); q.stroke();
    q.beginPath(); q.moveTo(cx + 32, 100);
    if (reach) q.quadraticCurveTo(cx + 54, 160, cx + 82, 192); else q.quadraticCurveTo(cx + 48, 160, cx + 44, 214);
    q.stroke();
    // blur by halving the picture several times and doubling it back step by step (smooth, no blocks)
    const blur = n => { let src = s, w = W, h = Hh; const st = []; for (let k = 0; k < n; k++) { w = Math.ceil(w / 2); h = Math.ceil(h / 2); const a = mk(w, h); a.getContext('2d').drawImage(src, 0, 0, w, h); src = a; st.push([w, h]); } for (let k = n - 2; k >= -1; k--) { const [w2, h2] = k >= 0 ? st[k] : [W, Hh]; const b = mk(w2, h2); b.getContext('2d').drawImage(src, 0, 0, w2, h2); src = b; } return src; };
    const tint = (im, col) => { const o = mk(W, Hh), x = o.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; const g = x.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, css(col[0])); g.addColorStop(1, css(col[1])); x.fillStyle = g; x.fillRect(0, 0, W, Hh);
      x.globalCompositeOperation = 'destination-in'; const f = x.createLinearGradient(0, 0, 0, Hh); f.addColorStop(0, 'rgba(0,0,0,1)'); f.addColorStop(.55, 'rgba(0,0,0,.8)'); f.addColorStop(1, 'rgba(0,0,0,.12)'); x.fillStyle = f; x.fillRect(0, 0, W, Hh); return o; };
    return (SHF[key] = { w: W, h: Hh, soft: tint(blur(4), [[255, 250, 232], [255, 226, 176]]), wide: tint(blur(5), [[255, 238, 200], [255, 214, 160]]) });
  }
  function shining(c) {
    const a = shine * (1 - gone); if (a <= .01) return;
    c.save(); c.globalCompositeOperation = 'lighter';
    SH.forEach(([x, H, p], i) => {
      const k = clamp(shine * 3 - i * .6), up = (1 - sm(0, 1, k)) * 120 + 140 * gone, hh = gh(x) + up, al = a * sm(0, 1, k);
      if (al < .01) return;
      const br = 1 + .06 * Math.sin(t / 40 + p);
      c.save(); c.translate(x, -hh);
      // a soft wide glow, then the figure itself: a very diffuse human shape of light (owner: "The shining ones need very diffuse human shape")
      let g = c.createRadialGradient(0, -H * .5, 0, 0, -H * .5, H * .9); g.addColorStop(0, css([255, 236, 196], .1 * al)); g.addColorStop(1, 'rgba(255,230,190,0)'); c.fillStyle = g; c.fillRect(-H, -H * 1.45, H * 2, H * 1.6);
      const F = shineFig(i === 2), w = H * F.w / F.h * br; if (i === 2) c.scale(-1, 1);
      c.globalCompositeOperation = 'screen'; c.globalAlpha = .7 * al; c.drawImage(F.wide, -w / 2, -H * 1.04, w, H * 1.08);
      c.globalAlpha = .6 * al; c.drawImage(F.soft, -w / 2, -H * 1.04, w, H * 1.08);
      c.globalAlpha = 1; c.globalCompositeOperation = 'lighter';
      c.restore();
    });
    // the change of raiment: light wraps him for a moment
    if (robe > 0 && robe < 1) { const x = Ch.x, h = gh(x), g = c.createRadialGradient(x, -h - 75, 0, x, -h - 75, 110); g.addColorStop(0, css([255, 236, 200], .45 * Math.sin(Math.PI * robe))); g.addColorStop(1, 'rgba(255,230,190,0)'); c.fillStyle = g; c.fillRect(x - 120, -h - 200, 240, 220); }
    c.restore();
    // the sealed roll: a soft glowing light in the third one's hand, diffuse like the Shining Ones (owner: "How about the
    // scroll be glowing too and be diffuse until it's handed to Christian"); touched, it is carried to him, its glow
    // drawing in and its shape coming clear as it reaches his hands, then it goes into the tray
    if (rollShow > .01 && rollGone < 1) {
      const [x, H] = SH[2], hx = x - 22, hy = -gh(x) - H * .52 + Math.sin(t / 30) * 2;
      const u = rollFly ? smooth(0, 1, rollFly.t / ROLL_FLY) : 0, cxr = Ch.x + 24, cyr = -gh(Ch.x) - 72;
      const rx = lerp(hx, cxr, u), ry = lerp(hy, cyr, u) - Math.sin(Math.PI * u) * 26, a2 = rollShow * (1 - rollGone), sh = smooth(.45, 1, u), df = 1 - sh;
      c.save(); c.translate(rx, ry);
      c.globalCompositeOperation = 'screen';
      const br = 1 + .08 * Math.sin(t / 22);
      let g = c.createRadialGradient(0, 0, 0, 0, 0, 60 * br); g.addColorStop(0, css([255, 244, 214], a2 * (.85 * df + .25))); g.addColorStop(1, 'rgba(255,236,200,0)'); c.fillStyle = g; c.fillRect(-62, -62, 124, 124);
      if (df > .01) { c.save(); c.scale(2.3, 1); g = c.createRadialGradient(0, 0, 0, 0, 0, 16 * br); g.addColorStop(0, css([255, 252, 238], a2 * df)); g.addColorStop(.5, css([255, 240, 206], .5 * a2 * df)); g.addColorStop(1, 'rgba(255,236,200,0)'); c.fillStyle = g; c.fillRect(-17, -17, 34, 34); c.restore(); }
      if (df > .01) { c.globalCompositeOperation = 'source-over'; const pu = .75 + .25 * Math.sin(t / 18); g = c.createRadialGradient(0, 0, 0, 0, 0, 30); g.addColorStop(0, css([255, 200, 120], .95 * a2 * df * pu)); g.addColorStop(.45, css([255, 214, 150], .4 * a2 * df * pu)); g.addColorStop(1, 'rgba(255,214,140,0)'); c.save(); c.scale(1.7, 1); c.fillStyle = g; c.fillRect(-30, -30, 60, 60); c.restore(); c.globalCompositeOperation = 'screen'; g = c.createRadialGradient(0, 0, 0, 0, 0, 9); g.addColorStop(0, css([255, 255, 248], a2 * df)); g.addColorStop(1, 'rgba(255,250,230,0)'); c.save(); c.scale(2, 1); c.fillStyle = g; c.fillRect(-9, -9, 18, 18); c.restore(); }
      c.globalCompositeOperation = 'source-over';
      if (sh > .01) { c.globalAlpha = a2 * sh; c.scale(1.6, 1.6); c.fillStyle = 'rgb(236,222,190)'; c.fillRect(-9, -3.5, 18, 7); c.fillStyle = 'rgb(214,198,160)'; c.fillRect(-11, -4.5, 3, 9); c.fillRect(8, -4.5, 3, 9);
        c.fillStyle = 'rgb(150,24,26)'; c.beginPath(); c.arc(0, 4, 3, 0, 6.29); c.fill(); }
      c.restore();
      rollAt = [rx, ry];
    }
  }
  const rollPt = () => { const [x, H] = SH[2]; return [sx(x - 22), sy(gh(x) + H * .52)]; };
  const chrPt = () => [sx(Ch.x), sy(gh(Ch.x) + 80)];

  // ---------- the story ----------
  function reset0() {
    Object.assign(Ch, { x: START, anim: 12, sd: QUIET[0], cf: -1, hop: 0, hops: 0, lastV: 0, fade: 0, hv: 0, face: 1, tv: null });
    bur = null; dawn = gold = goldTo = sun = robe = robeTo = mark = markTo = rollShow = rollGone = shine = shineTo = gone = goneTo = 0; wideK = 1; wideTo = 1;
    said = {}; hymn = null; silenceT = 0; tombT = 0; leapsLeft = 3; endT = 0; quietPad = 0; t = 0; rollFly = rollAt = null; closeK = topK = topTo = veil = 0; climb = null;
  }
  function start() {
    CR.on = true; SL.on = SL.show = false; HL.on = HL.show = false; RM.on = false; RM.stop(); preload();
    document.getElementById('title').style.display = 'none';
    document.getElementById('endc').className = 'card';
    document.body.classList.add('playing', 'slough'); G.opening = null; hush();
    Object.assign(G, { t: 0, capQ: [], cap: 0, hint: null, act: null, actT: 0, ring: null, auto: null, guard: 0, autoT: 0, taps: [], roll: { t: 999, x: 0, y: 0 }, ended: false, calm: 0 });
    downs.clear(); keys.r = keys.push = false;
    reset0(); ph = 'look';
    const at = new URLSearchParams(location.search).get('at');
    if (at === 'cross') { ph = 'walk'; Ch.x = STOP_X - 260; Ch.sd = null; wideK = wideTo = 0; said.open = said.ascend = said.cut = true; dawn = .6; }
    camTick(true);
    if (audio()) { AC.resume(); if (rainG) rainG.gain.setTargetAtTime(0, AC.currentTime, .8); padStart(); }
    G.state = 'wait';
    if (at) setTimeout(() => { if (CR.on && G.state === 'wait') { G.state = 'play'; G.calm = G.t; } }, 600);
  }
  function finish() {
    padStop();
    G.state = 'end'; G.ended = false;
    const e = document.getElementById('endc');
    e.querySelector('h1').textContent = 'The Cross';
    e.querySelectorAll('p')[0].textContent = 'His burden fell from his back, and he went on his way singing.';
    e.querySelectorAll('p')[1].textContent = 'Next: the Hill Difficulty (not yet built)';
    document.getElementById('on2').style.display = 'none';
  }
  function touch(px, py) {
    if (G.act === 'roll') { const [x, y] = rollPt(); if (Math.hypot(px - x, py - y) < 70) takeRoll(); else G.actT = Math.max(G.actT, 89); return; }
    if (G.act === 'leap') { const [x, y] = chrPt(); if (Math.abs(px - x) < 90 && Math.abs(py - y) < 120) leap(); else G.actT = Math.max(G.actT, 89); return; }
  }
  function key() { if (G.act === 'roll') takeRoll(); else if (G.act === 'leap') leap(); }
  function takeRoll() {
    if (G.act !== 'roll') return; G.ring = null;
    if (rollFly) return;
    rollFly = { t: 0 }; note(79, .04, 2.6); note(86, .025, 2.6, .15);
  }
  // THREE LEAPS FOR JOY: a hop of his standing picture, a rising note each time (G, B, D: no hymn)
  function leap() {
    if (G.act !== 'leap' || Ch.hv || Ch.hop > 0) return;
    Ch.hv = 3.4; note([67, 71, 74][3 - leapsLeft], .05, 2.2); leapsLeft--;
    if (!leapsLeft) { G.ring = null; G.act = null; setTimeout(() => { if (CR.on) next(true); }, 900); }
  }

  function update() {
    G.t++; t++;
    if (G.act) G.actT++;
    if (G.roll) G.roll.t++;
    if (rollFly && ++rollFly.t >= ROLL_FLY + 20) {
      rollFly = null; const [x, y] = rollAt || [Ch.x, -gh(Ch.x) - 72]; G.roll = { t: 0, x: sx(x), y: cam.wl + y * cam.z, sealed: true }; rollGone = 1; next(true);
    }
    const want = G.state === 'play' && (keys.r || held());
    if (Ch.sd != null) Ch.sd += .4;
    // the hop of a leap
    if (Ch.hv || Ch.hop > 0) { Ch.hop += Ch.hv; Ch.hv -= .2; if (Ch.hop <= 0) { Ch.hop = 0; Ch.hv = 0; if (audio()) sfx.step(false, .8); } }
    dawn += ((ph === 'walk' || ph === 'look' ? .55 * sm(SLOPE0 - 400, CREST0, Ch.x) : .7) - dawn) * .01;
    gold += (goldTo - gold) * .006; robe = Math.min(1, robe + (robeTo > robe ? .01 : 0)); mark += (markTo - mark) * .03; shine += (shineTo - shine) * .012; gone += (goneTo - gone) * .012;
    if (goldTo > 0) sun = Math.min(1, sun + .0028);
    wideK += (wideTo - wideK) * .02;
    if (!climb) topK += (topTo - topK) * .022;
    hymnTick();
    padTick(ph === 'fall' || ph === 'tumble' || ph === 'gone' ? 0 : gold > .1 ? 0 : 1);

    if (ph === 'look') {
      // a first wide look: the long slope, the cross small on its crown against the sky; then down to him
      if (t > 230) wideTo = 0;
      if (t === 60 && !said.open) { said.open = true; caption(OPEN); }
      if (G.state === 'wait' && t > 330) { G.state = 'play'; G.calm = G.t; }
      if (G.state === 'play') ph = 'walk';
    } else if (ph === 'walk') {
      if (!said.open) { said.open = true; caption(OPEN); }
      if (climb) { climbTick(); return camTick(climb && climb.snap); }
      if (!said.ascend && Ch.x > CREST0 - 900 && !saying()) { said.ascend = true; caption(ASCEND); }
      closeK += ((Ch.x > CLOSE0 && Ch.x < CUT_X + 200 ? 1 : 0) - closeK) * .03;
      if (topTo && topK > .9 && !saying() && G.t - (said.topT || 0) > 150) topTo = 0;
      if (!said.cut && Ch.x >= CUT_X) { said.cut = true; climb = { t: 0 }; G.state = 'auto'; return camTick(false); }
      let v = want ? MAXV * .9 : 0;
      if (Ch.x + v > STOP_X) v = Math.max(0, STOP_X - Ch.x);
      walk(v);
      if (Ch.x >= STOP_X - .5 && Ch.sd != null && !saying()) { ph = 'cross'; G.state = 'auto'; t = 0; }
    } else if (ph === 'cross') {
      // he stands before the cross; the standing picture gives way to the clip and the burden loosens by itself and falls behind him
      if (Ch.cf < 0) { Ch.cf = 0; Ch.fade = 0; }
      Ch.fade = Math.min(1, Ch.fade + .05);
      if (t === 40) { caption(LOOSED); if (audio()) { hiss(300, 3, .03, 1.2); } }
      if (Ch.fade >= 1 && t > 50) Ch.cf = Math.min(SWAP, Ch.cf + 16 / 60);
      if (Ch.cf >= SWAP) {
        ph = 'tumble'; t = 0; thump(1.1);
        bur = { st: 'roll', x: STOP_X + (BALL.ax - CLIP_META.ax) * CHR_K, y: 0, vy: 0, v: .9, r: 0, k: 1, a: 1, dk: 0, t: 0 };
        wideTo = 1;
      }
    } else if (ph === 'tumble') {
      // he stands tall, lighter, his head lifted (the clip's frames 41 to 70, played on, then back and forth)
      clipHold();
      if (t === 50) caption(TUMBLE);
      burdenTick();
      if (bur.st === 'gone') { ph = 'gone'; t = 0; }
    } else if (ph === 'gone') {
      clipHold();
      // a silence; then the light comes up behind the cross, and the colour comes back from it outward
      if (t === 150) { goldTo = 1; wideTo = .35; }
      if (t === 210) hymn = { t: 0, i: 0, b: 0 };
      if (hymn && hymn.t === 9 * BEATT) caption(GLAD);
      if (hymn && hymn.t === 25 * BEATT) caption(LOOKED);
      if (hymn && hymn.t > 20 * BEATT) wideTo = 0;
      if (hymnDone() && !saying()) { ph = 'shine'; t = 0; shineTo = 1; hymn = null; chime([79, 83, 86], .025); }
    } else if (ph === 'shine') {
      clipHold();
      if (t === 150) talk(SHINE, () => { ph = 'leaps'; t = 0; });
    } else if (ph === 'leaps') {
      clipHold(true);
      if (t === 40) talk(LEAPS, () => { ph = 'end'; t = 0; });
    } else if (ph === 'end') {
      clipHold(true);
      if (t === 30) { [67, 71, 74, 79].forEach((m, i) => note(m, .04, 3.6, i * .3)); }
      if (t > 200 && G.state !== 'end') finish();
    }
    if (G.act === 'roll' && !rollFly && !G.ring && G.actT >= 90) G.ring = rollPt;
    if (G.act === 'leap' && !G.ring && G.actT >= 90) G.ring = chrPt;
    camTick(false);
  }
  // the cut over the climb: he keeps climbing while the picture dips softly toward dark (never fully), then he stands
  // near the top, the camera is wide from the top, and the picture comes up again; the child walks the last steps
  function climbTick() {
    const k = climb; k.t++; k.snap = false;
    if (k.t <= 50) { walk(MAXV * .9); veil = .86 * smooth(0, 50, k.t); return; }
    if (k.t === 51) { Ch.x = SKIP_TO; Ch.sd = 0; Ch.anim = 12; closeK = 0; topK = topTo = 1; k.snap = true; said.ascend = true; return; }
    if (k.t === 70) { caption(ASCEND); said.topT = G.t; }
    veil = .86 * (1 - smooth(52, 120, k.t));
    if (k.t >= 120) { veil = 0; climb = null; G.state = 'play'; G.calm = G.t; }
  }
  // the clip after the burden is gone: on to frame 52, then back and forth between 52 and 70 at the video's own pace,
  // eased at each end, so he stands looking up and never jumps
  function clipHold(still) {
    if (Ch.cf < 52) { Ch.cf += 16 / 60; return; }
    if (still && Ch.hop > 0) return;
    Ch.cf += Ch.cfd * (16 / 60) * (.25 + .75 * Math.sin(Math.PI * clamp((Ch.cf - 52) / 18)));
    if (Ch.cf >= 70) { Ch.cf = 70; Ch.cfd = -1; } if (Ch.cf <= 52) { Ch.cf = 52; Ch.cfd = 1; }
  }

  function draw() {
    const c = ctx; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    sky(c); far(c);
    c.setTransform(DPR * cam.z, 0, 0, DPR * cam.z, DPR * (VW / 2 - cam.cx * cam.z), DPR * cam.wl);
    wall(c); land(c); tomb(c); cross(c);
    shining(c);
    drawBurden(c); drawChr(c);
    // the nearest ground, a dark band along the foot of the picture, under the words
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    const g = c.createLinearGradient(0, FOOTY + 20, 0, VH); g.addColorStop(0, 'rgba(12,10,12,0)'); g.addColorStop(.5, css(mix([16, 15, 20], [26, 20, 18], gold), .7)); g.addColorStop(1, css(mix([12, 11, 16], [20, 15, 13], gold), .92)); c.fillStyle = g; c.fillRect(0, FOOTY + 20, VW, VH);
    if (veil > .005) { c.fillStyle = css(mix([14, 14, 20], [24, 20, 26], dawn), veil); c.fillRect(0, 0, VW, VH); }
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2; for (const q0 of [0, .5]) { const q = (G.t / 80 + q0) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, 14 + q * 40, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    drawItems();
  }

  return { on: false, start, update, draw, touch, key, preload, lines: ALL, stop: () => padStop(), _pt: { roll: rollPt, chr: chrPt }, _turning: () => !!Ch.tv,
    peek: () => ({ ph, t, fly: rollFly ? rollFly.t : -1, x: Math.round(Ch.x), cf: +Ch.cf.toFixed(1), bur: bur ? { st: bur.st, x: Math.round(bur.x) } : null, gold: +gold.toFixed(2), shine: +shine.toFixed(2), leaps: leapsLeft, closeK: +closeK.toFixed(2), topK: +topK.toFixed(2), veil: +veil.toFixed(2) }) };
})();
