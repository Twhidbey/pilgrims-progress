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
  const START = 480, WALL_END = 860, TOMB_X = 5480, SLOPE0 = 1180, CREST0 = 4080, CROSS_X = 4260, CREST1 = 4480, FALL1 = 5400, H_TOP = 860;
  // the hill twice as high but the slope about as gentle as before, so it is longer (owner: "Not necessarily twice as steep - I like the old slope (maybe a tad steeper is ok)")
  // the cross and the hill larger beside him (owner: "cross needs to be bigger, relative to Christian, hill too"): he is about 150 units tall
  const CROSS_H = 340, CROSS_BY = CROSS_H * .74;
  // THE CLIMB TOLD BY A CUT (owner: "zoom in on Christian climbing and then fade slightly then unfade and zoom out and he's at top"):
  // past CLOSE0 the camera comes in close on him climbing; at CUT_X the picture dips softly toward dark, he is set near the top
  // (SKIP_TO), and it comes up again on a wide look down the hill from the top; then the camera comes back down to him
  const CLOSE0 = SLOPE0 + 40, CUT_X = SLOPE0 + 300, SKIP_TO = CROSS_X - 300;
  const STOP_X = CROSS_X + 112;      // where he stands when the burden falls: just past the cross, turned round to face it,
  // so the burden falls off behind him down the far slope into the sepulchre in the hollow (owner: "Why not on other side like in initial sketch?" ... "Yes!")
  const sm = (a, b, x) => smooth(a, b, x);
  function gh(x) {
    let h = H_TOP * Math.pow(sm(SLOPE0, CREST0, x), 1.15);
    h += 10 * Math.sin(Math.PI * clamp((x - CREST0 + 200) / 600)) * sm(SLOPE0, CREST0, x);
    h -= (H_TOP - 70) * sm(CREST1, FALL1, x);      // the far side falls to a hollow 70 above the near foot, where the sepulchre is
    h += 26 * sm(TOMB_X + 260, TOMB_X + 900, x);
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
    if (ph === 'cross' || ph === 'after' || ph === 'shine' || ph === 'leaps' || ph === 'end') { near.cx = CROSS_X + 60; near.z = .86; }
    const open = ph === 'look', fitT = (FOOTY - 30) / (gh(CROSS_X) + CROSS_H - gh(TOMB_X) + 90);
    const wide = open ? { cx: (START + CROSS_X) / 2 + 420, z: Math.min(VW / (CROSS_X - START + 900), (FOOTY - 40) / (H_TOP + CROSS_H + 40)) } : { cx: (TOMB_X + CROSS_X) / 2 - 40, z: Math.min(VW / 1900, fitT) };
    let tcx = lerp(near.cx, wide.cx, wideK), tz = Math.exp(lerp(Math.log(near.z), Math.log(wide.z), wideK));
    const wh = open ? 40 : gh(TOMB_X) - 90, fh = lerp(gh(Ch.x), wh, wideK);
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
    const K = CHR_K, w = BALL.w * K * bur.k, hh = BALL.h * K * bur.k, h = gh(bur.x) + bur.y;
    contact(c, bur.x, gh(bur.x), bur.a * .7 * (1 - Math.min(1, bur.y / 40)), 24 * bur.k);
    c.save(); c.translate(bur.x, -h - hh / 2 + 2); c.rotate(bur.r); c.globalAlpha = bur.a;
    const tint = tintNow(), W = BURDEN.width, H = BURDEN.height;
    if (figC.width !== W || figC.height !== H) { figC.width = W; figC.height = H; }
    const f = figC.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, W, H); f.drawImage(BURDEN, 0, 0); f.globalCompositeOperation = 'multiply'; f.fillStyle = css(mix(tint, [20, 18, 22], bur.dk)); f.fillRect(0, 0, W, H); f.globalCompositeOperation = 'destination-in'; f.drawImage(BURDEN, 0, 0); f.globalCompositeOperation = 'source-over';
    c.drawImage(figC, -w / 2, -hh / 2, w, hh); c.restore();
  }
  function burdenTick() {
    if (!bur) return;
    if (bur.st === 'roll') {
      const slope = (gh(bur.x - 4) - gh(bur.x + 4)) / 8;      // > 0 where the ground falls toward the right
      bur.v = Math.min(5.2, Math.max(.4, bur.v + slope * .12 - .002));
      bur.x += bur.v; bur.r += bur.v / (BALL.h * CHR_K * .5);
      // it tumbles: now and then it bounces off a hump
      bur.vy -= .32; bur.y += bur.vy; if (bur.y <= 0) { bur.y = 0; if (bur.vy < -1.2) thump(Math.min(1, -bur.vy / 5)); bur.vy = bur.v > 1.6 && Math.random() < .045 ? 1.6 + Math.random() * 2.2 : 0; }
      if (bur.x >= TOMB_X - 52) { bur.st = 'in'; bur.t = 0; }
    } else if (bur.st === 'in') {
      // into the mouth of the sepulchre: a last tumble down into the dark, then gone
      bur.t++; bur.x += Math.max(.5, bur.v * (1 - bur.t / 40)); bur.r += .05; bur.k = 1 - .35 * sm(0, 40, bur.t); bur.dk = sm(0, 30, bur.t); bur.y = -10 * sm(0, 40, bur.t); bur.a = 1 - sm(24, 46, bur.t);
      if (bur.t === 30) { thump(1.3); if (audio()) hiss(70, .6, .12, 1.6); }
      if (bur.t > 48) { bur.st = 'gone'; tombT = t; }
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
  function land(c) {
    const x0 = cam.cx - VW / 2 / cam.z - 40, x1 = cam.cx + VW / 2 / cam.z + 40, step = Math.max(4, 6 / cam.z);
    const hc = mix(mix([30, 30, 38], [36, 32, 36], dawn), [44, 34, 30], gold);
    c.beginPath(); c.moveTo(x0, 2000);
    for (let x = x0; x <= x1; x += step) c.lineTo(x, -gh(x));
    c.lineTo(x1, 2000); c.closePath(); c.fillStyle = css(hc); c.fill();
    // a thin edge of light along the crown, toward the sun (after dawn)
    if (gold > .01) {
      c.save(); c.lineWidth = 2.4 / cam.z; c.lineCap = 'round';
      for (let x = Math.max(x0, CROSS_X - 900); x <= Math.min(x1, CROSS_X + 900); x += step) { const k = Math.exp(-Math.pow((x - CROSS_X) / 420, 2)) * gold; if (k < .02) continue; c.strokeStyle = css([255, 214, 160], .7 * k); c.beginPath(); c.moveTo(x, -gh(x) + .6 / cam.z); c.lineTo(x + step, -gh(x + step) + .6 / cam.z); c.stroke(); }
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
  function tomb(c) {
    const x = TOMB_X, h = gh(x), col = mix(mix([28, 28, 36], [34, 30, 34], dawn), [48, 38, 33], gold);
    c.save(); c.translate(x, -h); c.scale(-1, 1);
    c.beginPath(); c.moveTo(-58, 5); c.lineTo(-52, -22); c.lineTo(-30, -44); c.lineTo(8, -54); c.lineTo(40, -48); c.lineTo(62, -30); c.lineTo(78, -6); c.lineTo(84, 5); c.closePath(); c.fillStyle = css(col); c.fill();
    // its mouth, opening toward the slope
    c.beginPath(); c.moveTo(40, 5); c.lineTo(42, -16); c.quadraticCurveTo(52, -32, 64, -18); c.lineTo(66, 5); c.closePath(); c.fillStyle = 'rgb(8,7,8)'; c.fill();
    c.restore();
  }
  function cross(c) {
    const x = CROSS_X, h = gh(x), col = mix(mix([20, 20, 27], [22, 20, 24], dawn), [30, 22, 20], gold), H = CROSS_H, T = 14, bw = 186, by = CROSS_BY;
    c.save(); c.translate(x, -h + 4); c.fillStyle = css(col);
    const r = rgen(5);
    c.beginPath(); for (let i = 0; i <= 10; i++) c.lineTo(-T / 2 + (r() - .5) * 1.2, -H * i / 10); for (let i = 10; i >= 0; i--) c.lineTo(T / 2 + (r() - .5) * 1.2, -H * i / 10); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-bw / 2, -by - T / 2); c.lineTo(bw / 2, -by - T / 2 + 1); c.lineTo(bw / 2, -by + T / 2); c.lineTo(-bw / 2, -by + T / 2 - 1); c.closePath(); c.fill();
    if (gold > .01) { c.globalCompositeOperation = 'lighter'; c.strokeStyle = css([255, 220, 160], .35 * gold); c.lineWidth = 1.2; c.strokeRect(-T / 2, -H, T, H); c.globalCompositeOperation = 'source-over'; }
    c.restore();
  }
  // the three Shining Ones: tall soft figures of light ("their faces shone as the light"), drawn with light, not paint
  const SH = [[CROSS_X - 212, 172, 3.1], [CROSS_X - 158, 186, 1.7], [CROSS_X - 104, 176, 0]];
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
      const F = shineFig(i === 2), w = H * F.w / F.h * br;
      c.globalCompositeOperation = 'screen'; c.globalAlpha = .7 * al; c.drawImage(F.wide, -w / 2, -H * 1.04, w, H * 1.08);
      c.globalAlpha = .6 * al; c.drawImage(F.soft, -w / 2, -H * 1.04, w, H * 1.08);
      c.globalAlpha = 1; c.globalCompositeOperation = 'lighter';
      c.restore();
    });
    // the change of raiment: light wraps him for a moment
    if (robe > 0 && robe < 1) { const x = Ch.x, h = gh(x), g = c.createRadialGradient(x, -h - 75, 0, x, -h - 75, 110); g.addColorStop(0, css([255, 236, 200], .45 * Math.sin(Math.PI * robe))); g.addColorStop(1, 'rgba(255,230,190,0)'); c.fillStyle = g; c.fillRect(x - 120, -h - 200, 240, 220); }
    c.restore();
    // the sealed roll in the third one's hands, waiting for a touch
    if (rollShow > .01 && rollGone < 1) {
      const [x, H] = SH[2], rx = x + 22, ry = -gh(x) - H * .52 + Math.sin(t / 30) * 2, a2 = rollShow * (1 - rollGone);
      c.save(); c.translate(rx, ry); c.globalAlpha = a2; { const g = c.createRadialGradient(0, 0, 0, 0, 0, 26); g.addColorStop(0, 'rgba(255,240,200,.5)'); g.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = g; c.fillRect(-26, -26, 52, 52); } c.scale(1.6, 1.6); c.fillStyle = 'rgb(236,222,190)'; c.fillRect(-9, -3.5, 18, 7); c.fillStyle = 'rgb(214,198,160)'; c.fillRect(-11, -4.5, 3, 9); c.fillRect(8, -4.5, 3, 9);
      c.fillStyle = 'rgb(150,24,26)'; c.beginPath(); c.arc(0, 4, 3, 0, 6.29); c.fill(); c.restore();
    }
  }
  const rollPt = () => { const [x, H] = SH[2]; return [sx(x + 22), sy(gh(x) + H * .52)]; };
  const chrPt = () => [sx(Ch.x), sy(gh(Ch.x) + 80)];

  // ---------- the story ----------
  function reset0() {
    Object.assign(Ch, { x: START, anim: 12, sd: QUIET[0], cf: -1, hop: 0, hops: 0, lastV: 0, fade: 0, hv: 0, face: 1, tv: null });
    bur = null; dawn = gold = goldTo = sun = robe = robeTo = mark = markTo = rollShow = rollGone = shine = shineTo = gone = goneTo = 0; wideK = 1; wideTo = 1;
    said = {}; hymn = null; silenceT = 0; tombT = 0; leapsLeft = 3; endT = 0; quietPad = 0; t = 0; closeK = topK = topTo = veil = 0; climb = null;
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
    const [x, y] = rollPt(); G.roll = { t: 0, x, y, sealed: true }; rollGone = 1; note(79, .04, 2.6); note(86, .025, 2.6, .15);
    next(true);
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
      if (Ch.x >= STOP_X - .5 && Ch.sd != null && !saying()) { ph = 'cross'; G.state = 'auto'; t = 0; Ch.tv = TURN.length ? { t: TURN.length - 1 } : null; if (!Ch.tv) Ch.face = -1; }
    } else if (ph === 'cross') {
      // he has walked up past the cross; he turns round to face it (his turn played back, quickly, eased), then the
      // standing picture gives way to the clip, mirrored, and the burden loosens by itself and falls behind him
      if (Ch.tv) { Ch.tv.t -= (TURN.length - 1) / 70 * (.35 + .65 * Math.sin(Math.PI * clamp(Ch.tv.t / (TURN.length - 1)))); if (Ch.tv.t <= 0) { Ch.tv = null; Ch.face = -1; Ch.cf = 0; Ch.fade = 0; t = 0; } return camTick(false); }
      if (Ch.cf < 0) { Ch.cf = 0; Ch.fade = 0; }
      Ch.fade = Math.min(1, Ch.fade + .05);
      if (t === 40) { caption(LOOSED); if (audio()) { hiss(300, 3, .03, 1.2); } }
      if (Ch.fade >= 1 && t > 50) Ch.cf = Math.min(SWAP, Ch.cf + 16 / 60);
      if (Ch.cf >= SWAP) {
        ph = 'tumble'; t = 0; thump(1.1);
        bur = { st: 'roll', x: STOP_X - (BALL.ax - CLIP_META.ax) * CHR_K, y: 0, vy: 0, v: .9, r: 0, k: 1, a: 1, dk: 0, t: 0 };
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
    if (G.act === 'roll' && !G.ring && G.actT >= 90) G.ring = rollPt;
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
    wall(c); tomb(c); land(c); cross(c);
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
    peek: () => ({ ph, t, x: Math.round(Ch.x), cf: +Ch.cf.toFixed(1), bur: bur ? { st: bur.st, x: Math.round(bur.x) } : null, gold: +gold.toFixed(2), shine: +shine.toFixed(2), leaps: leapsLeft, closeK: +closeK.toFixed(2), topK: +topK.toFixed(2), veil: +veil.toFixed(2) }) };
})();
