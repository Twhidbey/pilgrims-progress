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
  const START = 480, WALL_END = 860, TOMB_X = 5010, SLOPE0 = 1180, CREST0 = 4080, CROSS_X = 4260, CREST1 = 4400, FALL1 = 5340, H_TOP = 860;
  // GOLGOTHA, AFTER THE OWNER'S SKETCH (build 545): a smooth swooping ramp up from the left that meets the top of a round
  // rocky knoll shaped like a skull's crown (SK_X its top, SK_L / SK_R how far its dome reaches left and right)
  const SK_X = 4380, SK_L = 1000, SK_R = FALL1 - 4380, SK_H = H_TOP + 30, RAMP1 = SK_X - 260;
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
  const WALK_X = STOP_X - 380;
  const sm = (a, b, x) => smooth(a, b, x);
  function dome(x) { const u = (x - SK_X) / (x < SK_X ? SK_L : SK_R); if (Math.abs(u) >= 1) return 0; return SK_H * Math.pow(1 - u * u, x < SK_X ? 1.1 : .55); }
  function gh(x) {
    // the ramp: a smooth swoop (concave, steepening a little as it climbs) that runs up into the skull's crown with the
    // dome's own slope where they meet, so there is no notch; past the crown, the skull's round dome falling to the plain
    let h;
    if (x <= RAMP1) { const u = clamp((x - SLOPE0) / (RAMP1 - SLOPE0)), m0 = .15, m1 = .82, u2 = u * u, u3 = u2 * u;
      h = dome(RAMP1) * ((u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) + (u3 - u2) * m1);
      h += (3 * Math.sin(x * .011) + 1.6 * Math.sin(x * .031 + 1)) * sm(SLOPE0, SLOPE0 + 300, x) * (1 - sm(RAMP1 - 400, RAMP1, x)); }
    else h = x <= SK_X ? dome(x) : skTop(x);
    return h;
  }
  // THE SKULL IN PROFILE AGAINST THE SKY (owner: "the skull should be a profile against the sky"): past the crown the
  // outline is a skull seen side-on, facing right: the round cranium, the forehead, the brow ridge, the notch at the root
  // of the nose, the nose, the upper jaw and teeth, the chin, and under the jaw its neck going down into the ground. It
  // overhangs (brow, nose, chin), so it is its own outline (SKO, world units [x, h]); gh() past the crown is its top
  // build 550 (owner: "the bottom of hill on right has too much swoop - should be natural, rugged almost face shape
  // crumbling to ground with sepulchre on right"): below the brow the face falls steeply in broken steps, then crumbles
  // to the ground in a rubble of ledges and fallen stones; the sepulchre in its foot on the right
  const SKP = [[0, 1], [.2, .98], [.32, .93], [.4, .85], [.45, .75], [.475, .66], [.465, .6], [.485, .555], [.52, .48],
    [.535, .42], [.56, .35], [.575, .3], [.6, .255], [.615, .215], [.65, .19], [.68, .165], [.7, .16], [.725, .135],
    [.75, .12], [.775, .1], [.8, .095], [.83, .07], [.86, .06], [.885, .04], [.91, .042], [.93, .025], [.95, .03],
    [.97, .012], [1, 0], [1.08, 0]];
  const RGS = rgen(550);
  const SKO = (() => { const P = SKP.map(([u, v]) => [SK_X + u * SK_H, v * SK_H]), O = [];
    for (let i = 0; i < P.length - 1; i++) { const a = P[Math.max(0, i - 1)], b = P[i], c2 = P[i + 1], d = P[Math.min(P.length - 1, i + 2)];
      for (let k = 0; k < 8; k++) { const t = k / 8, t2 = t * t, t3 = t2 * t, f = (p0, p1, p2, p3) => .5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
        const x = f(a[0], b[0], c2[0], d[0]), h = f(a[1], b[1], c2[1], d[1]), up = h / SK_H;
        // rugged: a broken jitter that grows down the face (the crown stays smooth)
        const rg = up > .02 && up < .95 ? 1 + 2 * smooth(.6, .1, up) : 0, rr = RGS();
        O.push([x + rg * (2.2 * Math.sin(h * .09) + 3.4 * (rr - .5)), Math.max(0, h + rg * (1.8 * Math.sin(x * .07 + h * .05) + 3 * (RGS() - .5)))]); } }
    O.push(P[P.length - 1]); return O; })();
  const SK_END = SKO[SKO.length - 1][0];
  const SKT = (() => { const T = []; for (let x = SK_X; x <= SK_END + 2; x += 2) { let m = 0;
      for (let i = 0; i < SKO.length - 1; i++) { const [x0, h0] = SKO[i], [x1, h1] = SKO[i + 1]; if ((x - x0) * (x - x1) <= 0 && x0 !== x1) m = Math.max(m, h0 + (h1 - h0) * (x - x0) / (x1 - x0)); }
      T.push(m); } return T; })();
  function skTop(x) { if (x >= SK_END) return 0; const f = (x - SK_X) / 2, i = Math.floor(f); return lerp(SKT[i], SKT[Math.min(SKT.length - 1, i + 1)], f - i); }
  // the land's whole outline from xa to xb, as [x, y] on the picture (y = -h): the height field up to the crown, the
  // skull's own outline past it, then the plain
  function outline(xa, xb, step) { const O = [];
    for (let x = xa; x <= Math.min(xb, SK_X); x += step) O.push([x, -gh(x)]);
    if (xb > SK_X) { for (const [x, h] of SKO) O.push([x, -h]); for (let x = SK_END + step; x <= xb; x += step) O.push([x, 0]); }
    return O; }
  // ---------- the words (Bunyan's, shortened and made plain) ----------
  const OPEN = [[N, 'Up the highway between its walls Christian ran, but not without great difficulty, because of the load on his back.']];      // {92}
  const ASCEND = [[N, 'He came to a place somewhat ascending, and upon that place stood a cross, and a little below, a sepulchre.']];      // {93}
  const LOOSED = [[N, 'Just as Christian came up with the cross, his burden loosed from off his shoulders, and fell from off his back.']];      // {93}
  const TUMBLE = [[N, 'It began to tumble, and so continued, till it came to the mouth of the sepulchre, where it fell in, and I saw it no more.']];      // {93}
  const GLAD = [[C, 'He hath given me rest by his sorrow, and life by his death.']];      // {94}
  const LOOKED = [[N, 'He stood still to wonder, that the sight of the cross should ease him of his burden.'], [N, 'He looked, and looked again, till the tears ran down his cheeks.']];      // {94}
  const SHINE = [      // {94}
    [N, 'As he stood looking and weeping, three Shining Ones came to him.'],
    [SO, 'Peace be unto thee.'],
    [S1, 'Thy sins be forgiven thee.'],
    [N, 'The second took off his rags, and clothed him with new clothes.', 0, () => { robeTo = 1; }],
    [N, 'The third set a mark on his forehead, and gave him a roll with a seal upon it.', 0, () => { markTo = 1; rollShow = 1; }],
    [TIP, 'Touch the roll.', 'roll'],
    [S3, 'Look on it as you run, and give it in at the Celestial Gate.'],
    [N, 'So they went their way.', 0, () => { goneTo = 1; }],
  ];
  const LEAPS = [
    [N, 'Then Christian gave three leaps for joy, and went on singing.'],
    [TIP, 'Touch Christian to leap for joy.', 'leap'],
    [C, 'Blest cross! Blest sepulchre! Blest rather be the Man that there was put to shame for me!', 0, () => { blest = 1; }],      // vision chat: his song ({94})
  ];
  const ALL = [...OPEN, ...ASCEND, ...LOOSED, ...TUMBLE, ...GLAD, ...LOOKED, ...SHINE, ...LEAPS];

  // ---------- pictures ----------
  // HE KNEELS IN THE SILENCE (awe study, owner: "yes 1-3 please"): once the burden is gone he steps in and sinks to one
  // knee, hands together (a free Modal clip from the cross clip's frame 70, christian-kneel-nb); about a third of the way
  // into the hymn he rises (the clip played backwards) and stands again before he speaks: Bunyan twice says he stood
  const KNC = [], KNC_META = { ax: 130, ground: 296, frames: 65 };
  const CLIP = [], CLIP_META = { ax: 182.5, ground: 299, frames: 81 }, SWAP = 41, BALL = { ax: 31, w: 99, h: 118 };
  // HIS NEW COAT (round 2, owner: "clothes can be swapped"): from the second Shining One's gift on he stands in the pale
  // coat with the leaf bands, the hood down, clean-shaven (concept/christian-coat-chosen.jpg); a free clip of him standing,
  // lifting his head to look up and settling back, played back and forth at its own pace
  const COAT = [], COAT_META = { ax: 63, ground: 300, frames: 49 };
  // the leap for joy and his walk on, in the new coat (free clips, build 543): the leap played once a touch at its own
  // pace (16 a second); the walk one whole stride that loops, its planted foot sliding 3.48 picture px a frame
  const LEAPC = [], LEAP_META = { ax: 77, ground: 339, frames: 49 }, CWALK = [], CWALK_META = { ax: 78, ground: 297, frames: 29, vpx: 3.48 };
  let BURDEN = null, RTEX = null, RPAT = null, loaded = false;
  const MLIFT = [], MIM = {};
  function preload() {
    if (loaded) return; loaded = true;
    loadPack('christian-cross', CLIP).catch(() => {});
    loadPack('christian-kneel-nb', KNC).catch(() => {});
    loadPack('christian-coat-stand', COAT).catch(() => {});
    loadPack('christian-coat-leap', LEAPC).catch(() => {});
    loadPack('christian-coat-walk', CWALK).catch(() => {});
    RUNP.ready || loadPack('christian-run-plain', RUNP).catch(() => {});
    // the memories after the burden falls: pictures the child has already seen
    EVA.ready || loadPack('evangelist', EVA).catch(() => {});
    KNEEL.ready || loadPack('christian-kneel', KNEEL).catch(() => {});
    loadPack('lift', MLIFT).catch(() => {});
    ['wife', 'goodwill-reach'].forEach(n => loadImg(n + '.webp').then(im => { MIM[n] = im; }).catch(() => {}));
    loadImg('cross-burden.webp').then(im => { BURDEN = im; }).catch(() => {});
    // the burning hill's own painted rock (Level 3), made a grey tile as hill.js makes it, laid over the hill in 'overlay'
    loadImg('hill-rock.webp').then(rock => { const sx = 720, sy = 540, w = 780, h = 600, t = document.createElement('canvas'); t.width = w; t.height = h; const q = t.getContext('2d'); q.drawImage(rock, sx, sy, w, h, 0, 0, w, h);
      const d = q.getImageData(0, 0, w, h), D = d.data; let m = 0; for (let i = 0; i < D.length; i += 4) m += D[i] * .3 + D[i + 1] * .59 + D[i + 2] * .11; m /= D.length / 4;
      for (let i = 0; i < D.length; i += 4) { const v = clamp(128 + (D[i] * .3 + D[i + 1] * .59 + D[i + 2] * .11 - m) * 1.15, 0, 255); D[i] = D[i + 1] = D[i + 2] = v; D[i + 3] = 255; } q.putImageData(d, 0, 0);
      const T = document.createElement('canvas'); T.width = 2 * w; T.height = 2 * h; const r = T.getContext('2d'); r.drawImage(t, 0, 0); r.save(); r.translate(2 * w, 0); r.scale(-1, 1); r.drawImage(t, 0, 0); r.restore(); r.save(); r.translate(0, 2 * h); r.scale(1, -1); r.drawImage(T, 0, 0, 2 * w, h, 0, 0, 2 * w, h); r.restore();
      RTEX = T; }).catch(() => {});
  }

  // ---------- state ----------
  let blest = 0, tumbleT = 0, pauseKey = null, qRun = 0, quietG = 0, sepT = -1, ph = '', t = 0, cam = { cx: 0, z: 1, wl: 420 }, wideK = 0, wideTo = 0;
  const Ch = { x: START, anim: 12, sd: null, cf: -1, cfd: 1, hop: 0, hops: 0, lastV: 0, fade: 0, face: 1, tv: null, run: 0, ranim: 0 };
  let bur = null, dawn = 0, gold = 0, goldTo = 0, sun = 0, robe = 0, robeTo = 0, mark = 0, markTo = 0, rollShow = 0, rollGone = 0, shine = 0, shineTo = 0, gone = 0, goneTo = 0;
  let closeK = 0, topK = 0, topTo = 0, veil = 0, climb = null, tearT = -1, looked = false;
  // his tears (owner, offered instead of eyes in the sky: "Sure!!"): on "He looked, and looked again, till the tears ran
  // down his cheeks" the camera comes in close, and a few small drops of light run from under his hood and fall,
  // catching the dawn behind the cross, fading before they reach the ground
  const TEARS = [0, 130, 260], TEAR_X = 7.5, TEAR_Y = 137;
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
    const near = { cx: Ch.x + lerp(250, 150, closeK), z: lerp(.8, 1.15, closeK) };
    if (ph === 'cross' || ph === 'after' || ph === 'shine' || ph === 'leaps' || ph === 'end') { near.cx = Math.max(CROSS_X - 130, Ch.x + 170); near.z = .86; }
    const open = ph === 'look', fitT = (FOOTY - 30) / (gh(CROSS_X) + CROSS_H - tombSill() + 40);
    const wide = open ? { cx: (START + CROSS_X) / 2 + 420, z: Math.min(VW / (CROSS_X - START + 900), (FOOTY - 40) / (H_TOP + CROSS_H + 40)) } : { cx: (STOP_X + TOMB_X) / 2 + 40, z: Math.min(VW / (TOMB_X - STOP_X + 760), fitT) };
    let tcx = lerp(near.cx, wide.cx, wideK), tz = Math.exp(lerp(Math.log(near.z), Math.log(wide.z), wideK));
    const wh = open ? 40 : tombSill() - 14, fh = lerp(gh(Ch.x), wh, wideK);
    let twl = FOOTY + fh * tz + (open ? 28 : 0) * wideK;
    // the look from the top after the cut: wide, he and the cross high in the picture, the hill falling away below
    if (topK > .001) { const z2 = .4, wl2 = 250 + gh(Ch.x) * z2; tcx = lerp(tcx, Ch.x - 40, topK); twl = lerp(twl, wl2, topK); tz = Math.exp(lerp(Math.log(tz), Math.log(z2), topK)); }
    const e = snap ? 1 : .045; cam.cx += (tcx - cam.cx) * e; cam.z += (tz - cam.z) * e; cam.wl += (twl - cam.wl) * e;
  }

  // ---------- Christian ----------
  function groundStep(v, heavy) {
    const surf = Ch.x < SLOPE0 ? 'dirt' : 'grass';
    if (typeof stepOn === 'function') stepOn(surf, v, heavy); else sfx.step(false, heavy || .8);
  }
  function walk(v) {
    const fr0 = frameOf(Ch.anim);
    if (v) { if (Ch.sd != null) { Ch.sd = null; Ch.anim = 1; } }
    else if (Ch.sd == null) { if (fr0 === 28 || fr0 === 1 || !STD.length) Ch.sd = fr0 === 28 ? 0 : STAND_FROM_1; else v = .45; }
    Ch.x += v; Ch.lastV = v; Ch.anim = stepAnim(Ch.anim, v, CHR_STEP, CHR_META);
    const fr1 = frameOf(Ch.anim);
    if (v && fr1 !== fr0 && CHR_META.rest.includes(fr1) && audio()) groundStep(1, ph === 'walk' ? 1.4 : .9);      // build 492: earth between the walls, grass on the hill
    return v;
  }
  // the book: "Up this way did burdened Christian run, but not without great difficulty" ({92}): up the highway and the
  // slope he runs, in his plain run at its video's own pace; after the climb he walks the last steps to the cross
  function run(go) {
    if (!RUNP.ready) return walk(go ? MAXV * .9 : 0);
    if (go) {
      const st = RUNP_META.vpx * CHR_K * .4; Ch.x += st; Ch.lastV = st; Ch.ranim += .4; Ch.run = Math.min(1, Ch.run + .14); Ch.sd = null;
      if (Math.floor(Ch.ranim) % 14 === 0 && Math.floor(Ch.ranim - .4) % 14 !== 0 && audio()) groundStep(typeof STEP_RUN === 'number' ? STEP_RUN : 1.2, 1.3);
      return st;
    }
    Ch.lastV = 0; Ch.run = Math.max(0, Ch.run - .14); if (Ch.sd == null) Ch.sd = QUIET[0];
    return 0;
  }
  const tintNow = () => {
    const pre = [58, 58, 72], dw = [70, 62, 66], gd = [96, 78, 64], robeC = [150, 128, 100];
    let c = mix(pre, dw, dawn); c = mix(c, gd, gold); return mix(c, robeC, robe * .6);
  };
  const figC = mk(8, 8);
  // running up the slope he leans a little back with the ground, so his feet land on it (owner: "tilt him ever so
  // slightly back so his feet land right as he runs up hill"): a part of the ground's own angle, about his feet
  let TILT = 0;
  const slopeTilt = x => -.6 * Math.atan((gh(x + 12) - gh(x - 12)) / 24);
  function figure(c, im, meta, x, h, face, alpha, tint, rim) {
    if (!im || alpha <= .004) return;
    im = solidOf(im);
    const W = im.width, H = im.height; if (figC.width !== W || figC.height !== H) { figC.width = W; figC.height = H; }
    const f = figC.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, W, H); f.drawImage(im, 0, 0);
    f.globalCompositeOperation = 'multiply'; f.fillStyle = css(tint); f.fillRect(0, 0, W, H);
    if (rim > .01) { const g = f.createLinearGradient(face > 0 ? 0 : W, 0, face > 0 ? W : 0, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, css([255, 210, 150], .35 * rim)); f.globalCompositeOperation = 'source-atop'; f.fillStyle = g; f.fillRect(0, 0, W, H); }
    f.globalCompositeOperation = 'destination-in'; f.drawImage(im, 0, 0); f.globalCompositeOperation = 'source-over';
    const K = CHR_K;
    c.save(); c.translate(x, -h + 3); if (TILT) c.rotate(TILT); c.scale(face, 1); c.globalAlpha = alpha;
    c.drawImage(figC, -meta.ax * K, -meta.ground * K, W * K, H * K); c.restore();
  }
  // the front (right) edge of a picture's figure, row by row, worked out once and kept on the picture
  function faceEdge(im) {
    if (!im) return null; if (im._edge) return im._edge;
    const w = im.width, hh = im.height, cv = document.createElement('canvas'); cv.width = w; cv.height = hh; const q = cv.getContext('2d'); q.drawImage(im, 0, 0);
    const D = q.getImageData(0, 0, w, hh).data, E = [];
    for (let y = 0; y < hh; y++) { let e = null; for (let x = w - 1; x >= 0; x--) if (D[(y * w + x) * 4 + 3] > 110) { e = x; break; } E.push(e); }
    return (im._edge = E);
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
      // the new clothes come at the height of the light that wraps him (robe .5): a clean swap, no double picture
      const coat = robe >= .5 && COAT.ready;
      if (coat) { const ct = mix(tint, [236, 226, 210], .55);
        if (Ch.lp != null && LEAPC.ready) figure(c, LEAPC[clamp(Math.round(Ch.lp), 0, LEAPC.length - 1)], LEAP_META, x, h, fc, 1, ct, rim);
        else if (Ch.wo != null && CWALK.ready) figure(c, CWALK[Math.floor(Ch.wa) % CWALK.length], CWALK_META, x, h, 1, 1, ct, rim);
        else { const k = (Ch.cc || 0) % 96, cf = clamp(Math.round(k < 48 ? k : 96 - k), 0, COAT.length - 1); figure(c, COAT[cf], COAT_META, x, h, fc, 1, ct, rim); Ch.coatF = cf; } }
      else if (Ch.kn != null && KNC.ready) figure(c, KNC[clamp(Math.round(Ch.kn), 0, KNC.length - 1)], KNC_META, x, h, fc, 1, tint, rim);
      else figure(c, CLIP[f0], CLIP_META, x, h, fc, Ch.fade < 1 ? Ch.fade : 1, tint, rim);
      if (tearT >= 0) { const E = faceEdge(CLIP[f0]); TEARS.forEach(t0 => {
        // (round 2, owner: "the tears need to be more realistic"): a small clear bead on his cheek, at the very edge of his
        // profile, that creeps down in little starts (as a tear does, catching and letting go), leaving a faint wet line,
        // then gathers at the jaw and drops; lit by the dawn behind the cross, no glow
        const lt = tearT - t0; if (lt < 0 || lt > 175 || !E) return;
        const ex = yy => { const r = Math.round(CLIP_META.ground - yy / CHR_K); const v = E[clamp(r, 0, E.length - 1)]; return v == null ? null : (v - CLIP_META.ax) * CHR_K; };
        const p = Math.min(1, lt / 115), st = p * 4, d = (Math.floor(st) + smooth(.55, 1, st % 1)) / 4, y0 = TEAR_Y, y1 = TEAR_Y - 9;
        const a = smooth(0, 18, lt) * (1 - smooth(150, 175, lt));
        let ty = lerp(y0, y1, Math.min(1, d)), tx = ex(ty); if (tx == null) return; tx -= .5;
        c.save(); c.translate(x, -h); c.scale(fc, 1);
        // the wet line it leaves
        c.strokeStyle = css([236, 220, 200], .2 * a); c.lineWidth = .45; c.beginPath();
        for (let yy = y0; yy >= ty; yy -= .8) { const xx = ex(yy); if (xx != null) yy === y0 ? c.moveTo(xx - .5, -yy) : c.lineTo(xx - .5, -yy); } c.stroke();
        // the drop: once at the jaw it falls, quicker and quicker, a little drawn out
        let ry = 1.05, rx = .82, fy = 0;
        if (lt > 115) { const ft = lt - 115; fy = .02 * ft * ft; tx += .02 * ft; ry = 1.2; rx = .65; }
        const by = -(ty - fy);
        c.fillStyle = css([226, 214, 204], .42 * a); c.beginPath(); c.ellipse(tx, by, rx, ry, 0, 0, 6.29); c.fill();
        c.strokeStyle = css([40, 28, 26], .32 * a); c.lineWidth = .22; c.beginPath(); c.ellipse(tx, by, rx, ry, 0, .3, 2.85); c.stroke();
        c.fillStyle = css([255, 248, 232], .95 * a); c.beginPath(); c.arc(tx + .28, by - .42, .3, 0, 6.29); c.fill();
        c.restore();
      }); }
      if (mark > .01 && !(coat && (Ch.lp != null || Ch.wo != null))) { let hx = x + 14 * fc, hy = -h - 138;
        if (coat) { const E = faceEdge(COAT[Ch.coatF]), r = Math.round(COAT_META.ground - 141 / CHR_K); if (E && E[r] != null) { hx = x + ((E[r] - COAT_META.ax) * CHR_K - 3) * fc; hy = -h - 141; } } const mr = coat ? 5 : 9, g = c.createRadialGradient(hx, hy, 0, hx, hy, mr); g.addColorStop(0, css([255, 244, 214], (coat ? .6 : .8) * mark)); g.addColorStop(1, 'rgba(255,240,200,0)'); c.fillStyle = g; c.fillRect(hx - 10, hy - 10, 20, 20); }
    } else if (Ch.run > 0 && RUNP.ready) {
      TILT = slopeTilt(x) * Ch.run;
      if (Ch.run < 1 && STD.length) figure(c, STD[atTime(STD_META, breathT(Ch.sd || 0))], STD_META, x, h, 1, 1 - Ch.run, tint, rim);
      figure(c, RUNP[((Math.floor(Ch.ranim) % RUNP.length) + RUNP.length) % RUNP.length], RUNP_META, x, h, 1, Ch.run < 1 ? Ch.run : 1, tint, rim);
      TILT = 0;
    } else if (Ch.sd != null && STD.length) figure(c, STD[atTime(STD_META, breathT(Ch.sd))], STD_META, x, h, fc, 1, tint, rim);
    else figure(c, CHR[frameOf(Ch.anim)], CHR_META, x, h, 1, 1, tint, rim);
  }
  // the burden on its own, rolling back down the slope he climbed
  function drawBurden(c) {
    if (!bur || !BURDEN) return;
    // dust thrown up at the mouth as it goes in
    if (bur.dust) for (const d of bur.dust) { if (d.a <= 0) continue; const g = c.createRadialGradient(d.x, -d.y, 0, d.x, -d.y, d.r); g.addColorStop(0, css(mix([70, 64, 66], [150, 124, 110], gold), .1 * d.a)); g.addColorStop(1, 'rgba(120,110,112,0)'); c.fillStyle = g; c.fillRect(d.x - d.r, -d.y - d.r, d.r * 2, d.r * 2); }
    if (bur.a <= 0) return;
    const K = CHR_K, w = BALL.w * K * bur.k, hh = BALL.h * K * bur.k, h = bur.H != null ? bur.H : gh(bur.x) + bur.y;
    // a soft light round it as it falls, so it can be followed down the dark hill (owner, build 460)
    // (round 2, owner: "the glow around burden is too intense - something more subtle would do"): a faint light only
    const gl = (bur.gl || 0) * bur.a;
    if (gl > .01) { const cx = bur.x, cy = -h - hh / 2, R = 42 * bur.k, g = c.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, css([255, 232, 196], .11 * gl)); g.addColorStop(.5, css([250, 214, 170], .04 * gl)); g.addColorStop(1, 'rgba(250,210,170,0)');
      c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = g; c.fillRect(cx - R, cy - R, R * 2, R * 2); c.restore(); }
    // its shadow on the face where it would touch: it stays on its track while it is in the air and fades with height,
    // so a bounce reads as a bounce, not as the sack floating up the hill
    if (bur.st === 'roll' && bur.z != null) { const z = bur.z || 0, gy = -(h - z) + 2, sa = .55 * (1 - Math.min(1, z / 50)) * bur.a, rx = w * (.42 + .25 * Math.min(1, z / 50));
      if (sa > .01) { c.save(); c.translate(bur.x, gy); c.scale(rx, rx * .22); const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, css([4, 3, 6], sa)); g.addColorStop(1, 'rgba(4,3,6,0)'); c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore(); } }
    const sq = clamp(bur.sq || 0, -.4, .25), cp = Math.cos(bur.ph || 0), fy = (cp < 0 ? -1 : 1) * (.58 + .42 * Math.abs(cp)), fx = 1 + .07 * (1 - Math.abs(cp));
    c.save(); c.translate(bur.x, -h - hh / 2 + 2 + hh * (sq < 0 ? -sq * .5 : 0)); c.scale((1 - sq * .7) * fx, (1 + sq) * fy); c.rotate(bur.r); c.globalAlpha = bur.a;
    const tint = tintNow(), W = BURDEN.width, H = BURDEN.height;
    if (figC.width !== W || figC.height !== H) { figC.width = W; figC.height = H; }
    const f = figC.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, W, H); f.drawImage(BURDEN, 0, 0); f.globalCompositeOperation = 'multiply'; f.fillStyle = css(mix(mix(tint, [176, 164, 162], bur.H != null ? .5 * (1 - bur.dk) + .2 * gl : 0), [8, 7, 10], bur.dk));       f.fillRect(0, 0, W, H); f.globalCompositeOperation = 'destination-in'; f.drawImage(BURDEN, 0, 0); f.globalCompositeOperation = 'source-over';
    c.drawImage(figC, -w / 2, -hh / 2, w, hh); c.restore();
  }
  // the tumble, by simple physics (owner: "need a natural fall - think about physics of fall, it's not too important the
  // path it takes so long as it is natural"): it runs down the hill's face toward us, gathering speed under gravity with a
  // little friction; the rough face kicks it up now and then (more often and higher the faster it goes); in the air it
  // falls under gravity and bounces back a part of its speed; each bounce knocks it a little sideways and changes its
  // spin; it is drawn larger as it comes nearer. A seeded random, so it falls the same way each time
  function burdenTick() {
    if (!bur) return;
    if (bur.dust) for (const d of bur.dust) { d.x += d.vx; d.y += d.vy; d.vx *= .97; d.vy *= .97; d.r += .35; d.a -= .006; }
    if (bur.st === 'roll') {
      if (bur.x0 == null) { Object.assign(bur, { x0: bur.x, H0: gh(bur.x), gl: 0, s: 0, vs: .6, z: 0, vz: 1.4, vx: .3, dx: 0, w: 0, ph: 0, pw: .05, sq: 0, sqa: 0, sqv: 0, rnd: rgen(77) }); }
      const R = bur.rnd, L = bur.H0 - tombSill() - 6, g = .16;
      bur.t++; bur.gl = Math.min(1, bur.gl + .02);
      // along the face: gravity less friction, a little slower while in the air
      // the face eases off at its foot, so it comes to the mouth slower
      const q0 = bur.s / L, ease = sm(.82, 1, q0);
      bur.vs = Math.max(.6, Math.min(3, bur.vs + (bur.z > 0 ? .006 : .016) - .03 * ease) * .998); bur.s = Math.min(L, bur.s + bur.vs);
      // up and down: a fall under gravity, a bounce that keeps part of its speed
      bur.vz -= g; bur.z += bur.vz;
      if (bur.z <= 0) {
        bur.z = 0;
        // a heavy soft sack: it keeps little of its speed when it lands (owner, round 2: "the falling burden needs work")
        if (bur.vz < -1.1) { const hit = -bur.vz; bur.vz = hit * (.22 + .1 * R()); thump(Math.min(1.1, .25 + hit * .14)); bur.vx += (R() - .5) * .3 * hit; bur.w += (R() - .5) * .03 * hit; bur.sqv -= Math.min(.4, hit * .08); }
        else bur.vz = 0;
        // the rough face: a bump throws it up again now and then, lower than a ball would go
        if (bur.vz === 0 && R() < (.01 + .012 * bur.vs) * (1 - ease)) bur.vz = .6 + bur.vs * (.5 + .9 * R());
      }
      // sideways: drifts, slowed by the ground; drawn toward the mouth as it nears the foot
      const q = bur.s / L; bur.vx *= bur.z > 0 ? .995 : .97; bur.vx -= bur.dx * .0015; bur.dx += bur.vx;
      bur.x = lerp(bur.x0, TOMB_X, sm(0, 1, q)) + bur.dx * (1 - sm(.8, 1, q));
      // spin: on the ground it rolls with its speed, in the air it keeps what the last bounce gave it
      // it turns one way only, as a thing rolling down toward us (owner, build 464: "make it rotate one direction")
      // coming down the hill's face TOWARD us it turns over end on end (about a line across the picture), not round
      // in the picture's plane as a wheel does: that turning is drawn as the sack's height flipping (ph, in drawBurden);
      // on the ground it turns with its speed (rolling: the turn = the distance / its radius, about 15 units), in the air
      // it keeps the turn the last touch gave it; in the picture's plane only a little lumpy rocking and what a bounce adds
      if (bur.z <= 0) bur.pw += (bur.vs / 15 - bur.pw) * .25; bur.ph += bur.pw;
      bur.w *= .985; bur.r = .16 * Math.sin(bur.ph * .5 + .7) + .06 * Math.sin(bur.ph * 1.3) + (bur.rr = ((bur.rr || 0) + bur.w) * .97);
      // a soft sack of loose things, not a ball (owner: "the burden can change shape as it falls"): it squashes as it
      // lands, wobbles back, and stretches a little as it flies
      bur.sqa += (-bur.sq) * .16; bur.sqa *= .8; bur.sq += bur.sqa + bur.sqv; bur.sqv = 0;
      if (bur.z > 0) bur.sq += (Math.min(.12, Math.abs(bur.vz) * .03) - bur.sq) * .05;
      bur.H = lerp(bur.H0, tombSill() + 6, q) + bur.z; bur.k = 1 + .3 * q;
      if (bur.s >= L && bur.z <= 0) { bur.st = 'in'; bur.t = 0; bur.x0 = bur.x; bur.v = Math.min(1.2, bur.vs * .5); bur.dust = []; }
    } else if (bur.st === 'in') {
      // the sepulchre: it rolls slowly up to the mouth, rocks on the lip, tips over into the dark, a dull fall inside, dust
      bur.t++; const tt = bur.t, sill = tombSill() + 6;
      if (tt <= 50) { bur.v *= .955; bur.x += bur.v * .35; bur.ph += bur.v * .05; bur.H = sill; }
      else if (tt <= 96 || bur.hold) { if (tt === 96) bur.hold = !(tumbleT && G.t - tumbleT > 330); else if (bur.hold && ((tumbleT && G.t - tumbleT > 330) || tt > 700)) { bur.hold = false; bur.t = 96; } const q = tt - 50; bur.r += .09 * Math.sin(q * .26) * Math.exp(-q * .045) * .6; bur.H = sill + .8 * Math.abs(Math.sin(q * .26)) * Math.exp(-q * .05); if (q === 1) thump(.3); }
      else {
        // over it goes, back into the dark: smaller as it goes deeper, darker, rising a little in the mouth (further in)
        const q = sm(96, 170, tt); bur.r -= .035 * (1 - q); bur.k = 1.3 - .58 * q; bur.H = sill + 24 * q; bur.x = bur.x0 + 10 + 6 * q; bur.dk = sm(100, 150, tt); bur.gl = 1 - sm(96, 140, tt);
        if (tt === 150) { thump(1.25); if (audio()) hiss(70, .6, .12, 1.6);
          for (let i = 0; i < 9; i++) bur.dust.push({ x: TOMB_X + (Math.random() - .5) * 90, y: sill + 4 + Math.random() * 14, vx: (Math.random() - .5) * 1.1, vy: .15 + Math.random() * .35, r: 14 + Math.random() * 14, a: .8 + Math.random() * .2 }); }
        bur.a = 1 - sm(156, 184, tt);
      }
      if (tt > 310) { bur.st = 'gone'; tombT = t; }
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
  // the hill's rock, as Level 3's crags are drawn (owner: "don't like that it looks like strata - should be gradient - light
  // to dark... I like the rock shape of the scenery around Christian in mt scene in level three"): no layers; the hill goes
  // from a little lighter under its outline to dark at its foot, and within it rise rock masses made as Level 3's crags
  // are (`crag`: rows of overlapping spurs, each a small breaking wave, a steep face on the left, a rounded brow, a long
  // fall to the right), each row set deeper in the hill and a shade darker than the one before, so the rock grows
  // darker as it comes down; baked once small and drawn stretched (soft), in dark alpha so it takes the hill's colour
  let ROCK = null;
  const ROCK_OPT = (new URLSearchParams(location.search).get('rock') || 'skull').toLowerCase();
  function rockTex() {
    if (ROCK) return ROCK;
    const X0 = START - 700, X1 = FALL1 + 900, Y0 = -H_TOP - 40, Y1 = 700, k = .8;
    const cv = document.createElement('canvas'); cv.width = Math.ceil((X1 - X0) * k); cv.height = Math.ceil((Y1 - Y0) * k); const q = cv.getContext('2d');
    q.scale(k, k); q.translate(-X0, -Y0);
    const hs = (j, n, sd) => { const v = Math.sin(j * 127.1 + sd * 311.7 + n * 74.7) * 43758.5453; return v - Math.floor(v); };
    const nz = (x, sd) => { const i = Math.floor(x), f = x - i; return hs(i, 9, sd) + (hs(i + 1, 9, sd) - hs(i, 9, sd)) * f * f * (3 - 2 * f); };
    const crag = (L, sd, seg) => { const i = Math.floor(L / seg); let H = .34 + .3 * nz(L * .0011, sd + 5);
      for (let j = i - 4; j <= i + 1; j++) { const xc = (j + .15 + .7 * hs(j, 0, sd)) * seg, h = (.42 + .5 * hs(j, 2, sd)) * (hs(j, 3, sd) < .14 ? 1.25 : 1), w = seg * (1.8 + 2.2 * hs(j, 1, sd)) * (.55 + .9 * h), u = (L - xc) / w;
        if (u < -.3 || u > 1) continue;
        const ld = .4 + .3 * hs(j, 4, sd), br = .14 + .14 * hs(j, 5, sd), f = u < 0 ? smooth(-.3, 0, u) : u < br ? 1 - .1 * (u / br) * (u / br) : .9 * Math.pow(1 - (u - br) / (1 - br), 1.2) - .07 * smooth(ld - .03, ld + .03, u) * (1 - u);
        H = Math.max(H, h * f); }
      return H + (nz(L * .012, sd) - .5) * .04 + (nz(L * .04, sd + 2) - .5) * .012; };
    // rows of rock: how far below the hill's outline each one's foot lies, how tall its spurs stand, their width, its shade
    const ROWS = [[150, 130, 140, .09], [380, 200, 190, .1], [620, 230, 240, .11], [880, 250, 300, .12]];
    // a TRIAL of other looks for the rock, only with ?rock=a|b|c|d (without it the hill is as before): a light layer
    // (`lv`, white, laid with 'screen' in land()) and, for some, a stronger dark
    const lv = document.createElement('canvas'); lv.width = cv.width; lv.height = cv.height; const l = lv.getContext('2d');
    l.scale(k, k); l.translate(-X0, -Y0);
    const O = ROCK_OPT;
    // (e) plain and smooth: no masses at all; (f) a few big rocks set into the hill's face, each lit softly on its upper
    // right, toward the sunrise behind the cross
    if (O === 'f') {
      // [centre x, how far below the outline its top lies, width, seed]; each an outcrop of broken rock: an angular outline
      // (flat-ish top, a few breaks), its upper planes turned to the sunrise a little lit, its lower left in shade, its foot
      // sunk into the hill (faded out)
      const RK = [[1900, 30, 260, 1, 1], [2760, 40, 340, 2, 1], [3460, 50, 420, 3, 1], [4760, 40, 320, 4, 1], [2330, 70, 210, 6, .5], [3110, 90, 250, 7, .5]];
      // the last two (owner: "two more subtle"): smaller, set a little deeper, at half strength
      for (const [cx, dep, w, sd, st] of RK) {
        const r = rgen(sd * 53 + 1), top = -(gh(cx) - dep), h = w * (.5 + .1 * r()), x0 = cx - w / 2, x1 = cx + w / 2;
        // the outline: up the left face in 2 breaks, across the top in 3, down the right in 2, then the buried foot
        const P = [[x0, top + h]], n = 7;
        const tops = []; for (let i = 0; i <= n; i++) { const u = i / n, x = x0 + w * u, bulge = Math.sin(Math.PI * Math.pow(u, .8)), y = top + h * (1 - Math.pow(bulge, .45)) + (r() - .5) * h * .12 * bulge; tops.push([x, Math.min(top + h, y)]); }
        tops[0][1] = top + h * .9; tops[n][1] = top + h * .85;
        P.push(...tops); P.push([x1, top + h]);
        const path = c2 => { c2.beginPath(); P.forEach(([x, y], i) => i ? c2.lineTo(x, y) : c2.moveTo(x, y)); c2.closePath(); };
        const fade = (c2, rgb, a0) => { const g = c2.createLinearGradient(0, top, 0, top + h); g.addColorStop(0, css(rgb, a0)); g.addColorStop(.6, css(rgb, a0 * .8)); g.addColorStop(1, css(rgb, 0)); return g; };
        path(q); q.fillStyle = fade(q, [0, 0, 0], .16 * st); q.fill();
        // planes: from each top vertex a crease runs down into the rock; the planes whose top edge faces right are lit
        q.save(); path(q); q.clip(); l.save(); path(l); l.clip();
        for (let i = 0; i < n; i++) { const [ax, ay] = tops[i], [bx, by] = tops[i + 1], slope = (by - ay) / (bx - ax);
          const lean = (r() - .3) * w * .12, poly = [[ax, ay], [bx, by], [bx + lean, top + h], [ax + lean * .6, top + h]];
          const pl = c2 => { c2.beginPath(); poly.forEach(([x, y], k) => k ? c2.lineTo(x, y) : c2.moveTo(x, y)); c2.closePath(); };
          const lit = Math.max(0, Math.min(1, slope * 1.6 + .25 + (i / n) * .3));
          pl(l); l.fillStyle = fade(l, [255, 255, 255], .13 * lit * st); l.fill();
          pl(q); q.fillStyle = fade(q, [0, 0, 0], .12 * (1 - lit) * st); q.fill();
        }
        // the top edge catches the sky, more toward the right
        l.lineJoin = 'round'; const eg = l.createLinearGradient(x0, 0, x1, 0); eg.addColorStop(0, css([255, 255, 255], .05 * st)); eg.addColorStop(1, css([255, 255, 255], .3 * st));
        l.strokeStyle = eg; l.lineWidth = 5; l.beginPath(); tops.forEach(([x, y], k) => k ? l.lineTo(x, y) : l.moveTo(x, y)); l.stroke();
        q.restore(); l.restore();
      }
    }
    // (g, the hill since build 480; owner: "I meant E with two subtle contours"): the plain hill of (e) with only two
    // broad rows of the rounded rock in it, faint, their edges softened by laying each a few times a little lower
    if (O === 'g') [[300, 170, 300, .1, 3], [640, 200, 380, .11, 5]].forEach(([D, Hh, seg, a, n]) => {
      for (let k2 = 0; k2 < 4; k2++) { q.beginPath(); q.moveTo(X0, Y1);
        for (let x = X0; x <= X1; x += 4) q.lineTo(x, -(gh(x) - D) - Hh * crag(x + n * 977, 11 + n * 7, seg) + k2 * 7);
        q.lineTo(X1, Y1); q.closePath(); q.fillStyle = css([0, 0, 0], a / 2.2); q.fill(); }
    });
    // (r) roundness, a trial: (1) the light follows the outline: brightest in a thin band just under the edge where the
    // hill turns away against the dawn sky, darkening steadily inward, so the mass reads as turning away from us; (2) the
    // two ridges are LEVEL lines round the hill: each meets the outline where the hill reaches its height on either side
    // and sags toward us between, as a line round a dome is seen from a little above
    if (O === 'r') {
      const OP = []; for (let x = X0; x <= X1; x += 4) OP.push([x, -gh(x)]);
      const below = (c2, dd) => { c2.beginPath(); c2.moveTo(X0, Y1); for (const [x, y] of OP) c2.lineTo(x, y + dd); c2.lineTo(X1, Y1); c2.closePath(); };
      // the light: the outline laid again and again, a little lower each time and fainter (smooth along its length)
      l.save(); below(l, 0); l.clip(); l.lineJoin = 'round'; l.lineWidth = 12;
      for (let dd = 0; dd < 190; dd += 5) { l.strokeStyle = css([255, 255, 255], .016 * Math.pow(1 - dd / 190, 1.5)); l.beginPath(); OP.forEach(([x, y], i) => i ? l.lineTo(x, y + dd) : l.moveTo(x, y + dd)); l.stroke(); }
      l.restore();
      // the dark: the hill below the outline darkened a little more at each step inward
      for (let dd = 120; dd < 760; dd += 40) { below(q, dd); q.fillStyle = css([0, 0, 0], .016); q.fill(); }
      for (const [h, a, n] of [[600, .1, 3], [300, .11, 5]]) {
        let xa = SLOPE0, xb = X1; for (let x = SLOPE0; x < X1; x += 2) if (gh(x) >= h) { xa = x; break; }
        for (let x = X1; x > xa; x -= 2) if (gh(x) >= h) { xb = x; break; }
        if (xb > X1 - 10) xb = X1;
        const w = xb - xa, sag = Math.min(.11 * w, h * .75);
        const cy = x => { const u = (x - xa) / w; return -h + sag * Math.pow(Math.sin(Math.PI * u), .9) - 40 * crag(x + n * 977, 11 + n * 7, 260) * Math.sin(Math.PI * u); };
        for (let k2 = 0; k2 < 4; k2++) { q.beginPath(); q.moveTo(X0, Y1); q.lineTo(X0, -3000); q.lineTo(xa, -3000); for (let x = xa; x <= xb; x += 4) q.lineTo(x, cy(x) + k2 * 7); q.lineTo(xb, -3000); q.lineTo(X1, -3000); q.lineTo(X1, Y1); q.closePath(); q.fillStyle = css([0, 0, 0], a / 2.2); q.fill(); }
      }
    }
    // THE SKULL (owner's sketch, build 545: "the smooth part (not drawn on) is like a swooped ramp on the left side of hill
    // and the rough part is shaped sort of like a skull on the right ... and there texture there"): the ramp is left plain;
    // only the round knoll is rock: a little darker, its dome's left flank a soft seam where it rises out of the ramp,
    // broken curved creases following the dome, and many short hatched cracks running down its face, thickest on the
    // right as in the sketch, each with a faint lit lip
    if (O === 'skull') {
      const r = rgen(545), xa = SK_X - SK_L, hh = x => x <= RAMP1 ? Math.min(gh(x) - 6, dome(x)) : gh(x);
      const path = c2 => { c2.beginPath(); c2.moveTo(xa, 60); for (let x = xa; x <= SK_X; x += 6) c2.lineTo(x, -hh(x)); for (const [x, h] of SKO) c2.lineTo(x, -h); c2.lineTo(SK_END, 60); c2.closePath(); };
      q.save(); path(q); q.clip(); l.save(); path(l); l.clip();
      let g = q.createLinearGradient(0, -SK_H, 0, 0); g.addColorStop(0, css([0, 0, 0], .05)); g.addColorStop(1, css([0, 0, 0], .16));
      q.fillStyle = g; q.fillRect(xa, -SK_H - 40, FALL1 - xa, SK_H + 100);
      // no hard upright edge where the skull's left foot meets the ramp's: the darkening is wiped away toward its left end
      q.globalCompositeOperation = 'destination-out'; g = q.createLinearGradient(xa, 0, xa + 520, 0); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      q.fillStyle = g; q.fillRect(xa, -SK_H - 40, 520, SK_H + 100); q.globalCompositeOperation = 'source-over';
      // the dome's left flank: a soft seam where the skull rises out of the smooth ramp
      for (const [w, a] of [[16, .05], [7, .08], [2.6, .2]]) { q.strokeStyle = css([0, 0, 0], a); q.lineWidth = w; q.beginPath(); let pen = false;
        for (let x = xa + 4; x <= RAMP1; x += 6) { const d = dome(x); if (d > gh(x) - 14) { pen = false; continue; } pen ? q.lineTo(x, -d) : q.moveTo(x, -d); pen = true; } q.stroke(); }
      // LAYERS OF SHADE FOR VOLUME (owner: "levels of different shades of darkness one on top of the other getting darker
      // and smaller to show shape of hill"): six copies of the skull's own outline, each smaller (drawn in toward the
      // middle of its foot) and laid one on another, so the hill darkens in steps toward its heart and reads as round;
      // each step's edge a little ragged, its upper edge with a faint lit lip; faded in from the ramp on the left
      const FULL = []; for (let x = xa; x < SK_X; x += 14) FULL.push([x, dome(x)]); for (const p of SKO) FULL.push(p);
      const cx0 = SK_X + .3 * SK_H;
      const fadeL = (c2, a) => { const g2 = c2.createLinearGradient(xa + 120, 0, xa + 700, 0); g2.addColorStop(0, css([0, 0, 0], 0)); g2.addColorStop(1, css([0, 0, 0], a)); return g2; };
      for (let n = 1; n <= 6; n++) { const sc = 1 - n * .13;
        // each layer's edge broken into spurs like the crags at the foot of Level 3's mountain (a steep face, a short brow,
        // a long fall), not a smooth line (owner: "do it more like the rocks layers in the foot of the mountain in level 3")
        const P = FULL.map(([x, h], i) => { const X = cx0 + (x - cx0) * (.25 + .75 * sc), H = h * sc; return [X, H - (90 + 14 * n) * (crag(X + n * 613, 31 + n * 5, 150 + 20 * n) - .45) * smooth(10, 90, H)]; });
        q.beginPath(); q.moveTo(P[0][0], 60); P.forEach(([x, h]) => q.lineTo(x, -h)); q.lineTo(P[P.length - 1][0], 60); q.closePath();
        q.fillStyle = fadeL(q, .1); q.fill();
        l.strokeStyle = css([255, 255, 255], .05); l.lineWidth = 1.6; l.beginPath(); let pen = false;
        P.forEach(([x, h], i) => { if (h < 20 || x < xa + 300) { pen = false; return; } pen ? l.lineTo(x, -h - 2) : l.moveTo(x, -h - 2); pen = true; }); l.stroke(); }
      // the hollow of the eye, only a faint shadow in the rock (it must not stare), and a faint shade under the cheekbone
      for (const [ux, uy, rx, ry, a] of []) { const ex = SK_X + ux * SK_H, ey = -uy * SK_H;
        q.save(); q.translate(ex, ey); q.scale(1, ry / rx); const g2 = q.createRadialGradient(0, 0, 0, 0, 0, rx * SK_H);
        g2.addColorStop(0, css([0, 0, 0], a)); g2.addColorStop(.55, css([0, 0, 0], a * .7)); g2.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = g2; q.fillRect(-rx * SK_H, -rx * SK_H, 2 * rx * SK_H, 2 * rx * SK_H); q.restore(); }
      q.restore(); l.restore();
    }
    if (O !== 'e' && O !== 'f' && O !== 'g' && O !== 'r' && O !== 'skull') ROWS.forEach(([D, Hh, seg, a], n) => {
      const top = x => -(gh(x) - D) - Hh * crag(x + n * 977, 11 + n * 7, seg);
      const pts = []; for (let x = X0; x <= X1; x += 4) pts.push([x, top(x)]);
      const shape = c2 => { c2.beginPath(); c2.moveTo(X0, Y1); for (const [x, y] of pts) c2.lineTo(x, y); c2.lineTo(X1, Y1); c2.closePath(); };
      shape(q); q.fillStyle = css([0, 0, 0], O === 'b' || O === 'd' ? a * 1.9 : a); q.fill();
      // (a) a thin edge of sky light along the top of every rock mass, stronger on its brow
      if (O === 'a' || O === 'd') {
        l.save(); shape(l); l.clip(); l.lineJoin = 'round';
        for (const [w, al] of [[16, .05], [8, .09], [3.5, .2]]) { l.lineWidth = w; l.strokeStyle = css([255, 255, 255], al * (1 - .15 * n)); l.beginPath(); pts.forEach(([x, y], i) => i ? l.lineTo(x, y) : l.moveTo(x, y)); l.stroke(); }
        l.restore();
      }
      // (b) mist lying in the hollow behind each mass: a pale band above its outline, fading up (the game's layered look)
      if (O === 'b' || O === 'd') {
        l.save(); l.beginPath(); l.moveTo(X0, Y0); for (const [x, y] of pts) l.lineTo(x, y); l.lineTo(X1, Y0); l.closePath(); l.clip();
        l.lineJoin = 'round';
        for (let dd = 0; dd < 90; dd += 6) { l.strokeStyle = css([255, 255, 255], .03 * Math.pow(1 - dd / 90, 1.6)); l.lineWidth = 12; l.beginPath(); pts.forEach(([x, y], i) => i ? l.lineTo(x, y - dd) : l.moveTo(x, y - dd)); l.stroke(); }
        l.restore();
      }
      // (c) the light from the right (the sun behind the cross): faces that fall away to the right lit, steep left faces in shade
      if (O === 'c') {
        l.save(); shape(l); l.clip();
        for (let i = 12; i < pts.length - 12; i++) { const [x, y] = pts[i]; let sl = 0; for (let j = -10; j <= 10; j++) sl += (pts[i + j + 1][1] - pts[i + j - 1][1]) / 8; sl /= 21; const lit = Math.max(0, Math.min(1, sl * 1.4)), sh = Math.max(0, Math.min(1, -sl * .9));
          if (lit > .02) { const g = l.createLinearGradient(0, y, 0, y + 110); g.addColorStop(0, css([255, 255, 255], .16 * lit)); g.addColorStop(1, css([255, 255, 255], 0)); l.fillStyle = g; l.fillRect(x - 2, y, 4.5, 110); }
          if (sh > .02) { const g = q.createLinearGradient(0, y, 0, y + 140); g.addColorStop(0, css([0, 0, 0], .2 * sh)); g.addColorStop(1, css([0, 0, 0], 0)); q.fillStyle = g; q.fillRect(x - 2, y, 4.5, 140); } }
        l.restore();
      }
    });
    return (ROCK = { c: cv, l: O && O !== 'g' ? lv : null, x: X0, y: Y0, w: X1 - X0, h: Y1 - Y0 });
  }
  function land(c) {
    const x0 = cam.cx - VW / 2 / cam.z - 40, x1 = cam.cx + VW / 2 / cam.z + 40, step = Math.max(4, 6 / cam.z);
    const hc = mix(mix([30, 30, 38], [36, 32, 36], dawn), [44, 34, 30], gold);
    c.beginPath(); c.moveTo(x0, 2000);
    for (const [x, y] of outline(x0, x1, step)) c.lineTo(x, y);
    c.lineTo(x1, 2000); c.closePath(); c.fillStyle = css(hc); c.fill();
    // a breath of form (owner: "shade hill a slight bit to get sense of its 3d"): the hill a touch lighter just under its
    // outline, darker toward its foot, and its rock in layers (rockTex)
    c.save(); c.clip();
    const lite = mix(hc, [150, 146, 160], .5), dark = mix(hc, [6, 5, 8], .6);
    let g = c.createLinearGradient(0, -H_TOP, 0, 40);
    g.addColorStop(0, css(lite, .1)); g.addColorStop(.3, css(lite, .03)); g.addColorStop(.6, css(dark, .05)); g.addColorStop(1, css(dark, .5));
    c.fillStyle = g; c.fillRect(x0, -H_TOP - 60, x1 - x0, H_TOP + 2100);
    const R = rockTex(); c.drawImage(R.c, R.x, R.y, R.w, R.h);
    if (R.l) { c.globalCompositeOperation = 'screen'; c.globalAlpha = .55 + .2 * dawn + .25 * gold; c.drawImage(R.l, R.x, R.y, R.w, R.h); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
    // the painted rock's grain over it all, as on Level 3's crags
    // the painted cliff texture from Level 3 is no longer laid on (owner, build 470: "there's lines on the hill now":
    // its upright cracks showed as stripes down the smooth hill)
    if (false && RTEX) {} if (RTEX && ROCK_OPT === 'skull') {
      // the painted rock's grain, only on the skull, as on Level 3's crags
      c.save(); c.beginPath(); c.moveTo(SK_X - SK_L, 60); for (let x = SK_X - SK_L; x <= SK_X; x += 8) c.lineTo(x, -Math.min(gh(x), dome(x))); for (const [x, h] of SKO) c.lineTo(x, -h); c.lineTo(SK_END, 60); c.closePath(); c.clip();
      if (!RPAT) RPAT = c.createPattern(RTEX, 'repeat'); const ts = 2; RPAT.setTransform(new DOMMatrix([ts, 0, 0, ts, 300, -H_TOP - 200]));
      c.globalCompositeOperation = 'overlay'; c.globalAlpha = .14; c.fillStyle = RPAT; c.fillRect(SK_X - SK_L + 300, -H_TOP - 60, SK_END - SK_X + SK_L, H_TOP + 120); c.restore(); }
    if (false) { if (!RPAT) RPAT = c.createPattern(RTEX, 'repeat'); const ts = 2.4; RPAT.setTransform(new DOMMatrix([ts, 0, 0, ts, 300, -H_TOP - 200]));
      c.globalCompositeOperation = "overlay"; c.globalAlpha = .14; c.fillStyle = RPAT; c.fillRect(x0, -H_TOP - 60, x1 - x0, H_TOP + 2100); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
    c.restore();
    // a thin edge of light along the crown, toward the sun (after dawn)
    if (gold > .01) {
      // one stroke with its strength along a gradient (short overlapping strokes with round caps showed as beads)
      c.save(); c.lineWidth = 2.4 / cam.z; c.lineCap = 'butt'; c.lineJoin = 'round';
      const ga = Math.max(x0, CROSS_X - 900), gb = Math.min(x1, CROSS_X + 900);
      if (gb > ga) { const g = c.createLinearGradient(CROSS_X - 900, 0, CROSS_X + 900, 0);
        for (let i = 0; i <= 12; i++) { const u = i / 12, k = Math.exp(-Math.pow((u - .5) * 1800 / 420, 2)) * gold; g.addColorStop(u, css([255, 214, 160], .7 * k)); }
        c.strokeStyle = g; c.beginPath(); for (const [x, y] of outline(ga, gb, step)) if (x >= ga && x <= gb) c.lineTo(x, y + .6 / cam.z); c.stroke(); }
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
    // kept inside the hill: at the bluff's foot its soft shadow must not spill into the sky (build 544)
    c.save(); c.beginPath(); c.moveTo(x - 320, 40); for (const [xx, yy] of outline(x - 320, x + 320, 6)) c.lineTo(xx, yy); c.lineTo(x + 320, 40); c.closePath(); c.clip();
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
    // they appear where they stand, one after another, and fade there when they go (owner: "the shining ones can just appear (not descend)")
    const a = shine * (1 - gone); if (a <= .01) return;
    c.save(); c.globalCompositeOperation = 'lighter';
    SH.forEach(([x, H, p], i) => {
      const k = clamp(shine * 3 - i * .6), up = 0, hh = gh(x) + up, al = a * sm(0, 1, k);
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
      const rx = lerp(hx, cxr, u), ry = lerp(hy, cyr, u) - Math.sin(Math.PI * u) * 26, a2 = rollShow * (1 - rollGone), sh = 0, df = 1 - .3 * u;
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
    blest = 0; tumbleT = 0; sepT = -1; memT = -1; memS = []; memUntil = 0; memQ = 0; tearT = -1; looked = false; Object.assign(Ch, { x: START, anim: 12, sd: QUIET[0], cf: -1, hop: 0, hops: 0, lastV: 0, fade: 0, hv: 0, face: 1, tv: null, run: 0, ranim: 0, cc: 0, lp: null, wo: null, wa: 0, kn: null, kup: false });
    bur = null; dawn = gold = goldTo = sun = robe = robeTo = mark = markTo = rollShow = rollGone = shine = shineTo = gone = goneTo = 0; wideK = 1; wideTo = 1;
    said = {}; hymn = null; silenceT = 0; tombT = 0; leapsLeft = 3; endT = 0; quietPad = 0; t = 0; rollFly = rollAt = null; closeK = topK = topTo = veil = 0; climb = null;
  }
  function start() {
    CR.on = true; SL.on = SL.show = false; HL.on = HL.show = false; RM.on = false; RM.stop(); preload(); MEMS.forEach(m => vox(m.who, m.txt));
    document.getElementById('title').style.display = 'none';
    document.getElementById('endc').className = 'card';
    document.body.classList.add('playing', 'slough'); G.opening = null; hush();
    Object.assign(G, { t: 0, capQ: [], cap: 0, hint: null, act: null, actT: 0, ring: null, auto: null, guard: 0, autoT: 0, taps: [], roll: { t: 999, x: 0, y: 0 }, ended: false, calm: 0 });
    downs.clear(); keys.r = keys.push = false;
    reset0(); ph = 'look';
    // it opens close on him between the walls of Salvation (owner, build 451): no wide first look at the cross
    wideK = wideTo = 0;
    const at = new URLSearchParams(location.search).get('at');
    if (typeof dropPlace === 'function') dropPlace();
    if (at === 'cross') { ph = 'walk'; Ch.x = STOP_X - 260; Ch.sd = null; wideK = wideTo = 0; said.open = said.ascend = said.cut = true; dawn = .6; memT = 2000; memS = MEMS.map(() => 0); }
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
  // THREE LEAPS FOR JOY: a rising note each time (G, B, D: no hymn); in the coat a real leap (the free clip, build 543),
  // else a hop of his standing picture
  function leap() {
    if (G.act !== 'leap' || Ch.hv || Ch.hop > 0 || Ch.lp != null) return;
    if (LEAPC.ready && robe >= .5) { Ch.lp = 0; Ch.lpLand = false; G.ring = null; } else Ch.hv = 3.4;
    note([67, 71, 74][3 - leapsLeft], .05, 2.2); leapsLeft--;
    if (!leapsLeft) { G.ring = null; G.act = null; if (Ch.lp == null) setTimeout(() => { if (CR.on) next(true); }, 900); }
  }

  function update() {
    // the game's clock G.t is moved on by the engine's update() before this is called; moving it here too made it run at
    // twice its speed in this level (build 470: lines were cut short and memories spoke over the storyteller)
    t++;
    if (G.act) G.actT++;
    if (G.roll) G.roll.t++;
    if (rollFly && ++rollFly.t >= ROLL_FLY + 20) {
      rollFly = null; const [x, y] = rollAt || [Ch.x, -gh(Ch.x) - 72]; G.roll = { t: 0, x: sx(x), y: cam.wl + y * cam.z, sealed: true }; rollGone = 1; next(true);
    }
    const want = G.state === 'play' && (keys.r || held());
    if (Ch.sd != null) Ch.sd += .4;
    // the leap clip: up at its own pace, a soft landing on the grass at frame 26, then on to standing
    if (Ch.lp != null) { Ch.lp += 16 / 60;
      if (Ch.lp >= 26 && !Ch.lpLand) { Ch.lpLand = true; if (audio()) groundStep(1, 0); }
      if (Ch.lp >= LEAPC.length - 1) { Ch.lp = null; Ch.cc = 0; if (!leapsLeft && G.act !== 'leap') setTimeout(() => { if (CR.on) next(true); }, 500); } }
    // the hop of a leap
    if (Ch.hv || Ch.hop > 0) { Ch.hop += Ch.hv; Ch.hv -= .2; if (Ch.hop <= 0) { Ch.hop = 0; Ch.hv = 0; if (audio()) groundStep(1, 0); } }
    dawn += ((ph === 'walk' || ph === 'look' ? .55 * sm(SLOPE0 - 400, CREST0, Ch.x) : .7) - dawn) * .01;
    if (robe >= .5) Ch.cc = (Ch.cc || 0) + 16 / 60;
    gold += (goldTo - gold) * .0032; robe = Math.min(1, robe + (robeTo > robe ? .01 : 0)); mark += (markTo - mark) * .03; shine += (shineTo - shine) * .012; gone += (goneTo - gone) * .012;
    // the sun rises slowly, about 14 s (owner, build 455: "sun can rise slower")
    if (goldTo > 0) sun = Math.min(1, sun + .0012);
    wideK += (wideTo - wideK) * .02;
    if (!climb) topK += (topTo - topK) * .022;
    hymnTick();
    if (tearT >= 0) tearT++;
    if (ph === 'gone' || ph === 'shine') closeK += ((ph === 'gone' && tearT >= 0 && tearT < 420 ? 1 : 0) - closeK) * .025;
    // the memories' own clock runs on whatever the phase, so the last one fades even once he is at the cross
    memQ = busy() ? 0 : memQ + 1;
    // each memory is tied to a place on the hill (owner, build 466: "tie memories to locations so that they are
    // sufficiently spaced out and don't overlap with other narrator text"): it comes when he reaches its place, and
    // only after a second of quiet since the last voice; if a voice is still sounding it waits, and comes a little later
    if (memT >= 0 && memT < memLast() + 420) { memT++; const i = memS.length; if (i < MEMS.length && Ch.x >= MEM_X[i] && (i === 0 || memT - memS[i - 1] >= MEM_GAP) && memQ >= 60) { memS.push(memT); memVoice(MEMS[i]); } }
    padTick(ph === 'fall' || ph === 'tumble' || ph === 'gone' ? 0 : gold > .1 ? 0 : 1);

    if (ph === 'look') {
      // the opening: close on him at the walls, the storyteller's first line, then the child may run
      wideTo = 0;
      if (t === 60 && !said.open) { said.open = true; caption(OPEN); }
      if (G.state === 'wait' && t > 150) { G.state = 'play'; G.calm = G.t; }
      if (G.state === 'play') ph = 'walk';
    } else if (ph === 'walk') {
      if (!said.open) { said.open = true; caption(OPEN); }
      if (climb) { climbTick(); return camTick(climb && climb.snap); }
      // his life remembered in the sky as he runs up the hill (owner: "the memories maybe happen as he runs up the hill
      // (too much overlapping dialogue at cross)"): once the storyteller's first line is said and he is on the slope;
      // Good-will's promise last, just before he comes to the cross
      if (memT < 0 && Ch.x > SLOPE0 && said.open && !busy()) memT = 0;
      // after the last memory, about three seconds of quiet before the storyteller speaks (owner, build 452)
      const memDone = memT >= memLast() + 300 && G.t >= memUntil + 180;
      if (!said.ascend && memDone && Ch.x > CREST0 - 900 && !busy()) { said.ascend = true; caption(ASCEND); sepT = 0; }
      // "and a little below, a sepulchre": the camera draws back and down to show it, then comes back up to him (owner,
      // build 452); he stands still while it looks
      if (sepT >= 0) { sepT++; if (sepT === 150) wideTo = 1; if (sepT === 430) wideTo = 0; }
      const sepLook = sepT >= 150 && (sepT < 430 || wideK > .08);
      closeK += (0 - closeK) * .03;
      if (topTo && topK > .9 && !busy() && G.t - (said.topT || 0) > 150) topTo = 0;
      // no cut any more (owner: "Since he's running you can probably not cut to top of hill"): he runs all the way up
      // to the cross, the book's "He ran thus till he came at a place somewhat ascending"
      // once he is up on the top near the cross he walks (owner, build 452: "once he's at the top with the cross he can walk")
      const onTop = Ch.x >= WALK_X;
      if (want && !sepLook && Ch.x < STOP_X - .5) {
        if (!onTop) run(true); else if (Ch.run > 0) run(false); else walk(MAXV * .9);
        if (Ch.x > STOP_X) Ch.x = STOP_X;
      } else { run(false); if (Ch.run <= 0 && Ch.sd == null) walk(0); }
      if (Ch.x >= STOP_X - .5 && Ch.sd != null && Ch.run <= 0 && said.ascend && !sepLook && !busy()) { ph = 'cross'; G.state = 'auto'; t = 0; }
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
      // when the storyteller begins the tumble line: the burden waits on the cave's lip until he is well into it
      if (t > 50 && !tumbleT && !G.capQ.length && saying()) tumbleT = G.t;
      burdenTick();
      if (bur.st === 'gone') { ph = 'gone'; t = 0; quietG = qRun = 0; if (KNC.ready) { Ch.kn = 0; Ch.knd = 1; Ch.kup = false; } }
    } else if (ph === 'gone') {
      if (Ch.kn != null) kneelTick(); else clipHold();
      // a silence; then the light comes up behind the cross, and the colour comes back from it outward
      // the silence is counted only once every voice is done, so the sun and the hymn never come over the words
      if (!busy()) { quietG++; qRun++; } else qRun = 0;
      if (quietG === 150 && !goldTo) { goldTo = 1; wideTo = .35; }
      if (quietG === 360 && !hymn) hymn = { t: 0, i: 0, b: 0 };
      // Christian speaks only after a breath of quiet once the burden is gone (owner, build 456)
      if (hymn && hymn.t >= 10 * BEATT && Ch.kn != null) Ch.kup = true;
      if (hymn && hymn.t >= 12 * BEATT && qRun >= 150 && Ch.kn == null && !said.glad) { said.glad = true; caption(GLAD); }
      if (said.glad && hymn && hymn.t >= 25 * BEATT && !looked) { caption(LOOKED); looked = true; }
      if (looked && tearT < 0 && !G.capQ.length) tearT = 0;
      if (hymn && hymn.t > 20 * BEATT) wideTo = 0;
      if (hymnDone() && !busy()) { ph = 'shine'; t = 0; shineTo = 1; hymn = null; }
    } else if (ph === 'shine') {
      clipHold();
      if (t === 150) talk(SHINE, () => { ph = 'leaps'; t = 0; });
    } else if (ph === 'leaps') {
      clipHold(true);
      if (t === 40) talk(LEAPS, () => { ph = 'end'; t = 0; });
    } else if (ph === 'end') {
      clipHold(true);
      if (t === 30) { [67, 71, 74, 79].forEach((m, i) => note(m, .04, 3.6, i * .3)); }
      // "and went on" ({94}): in the coat he walks on by himself past the cross, at his walk's own pace (build 543)
      if (t >= 90 && robe >= .5 && CWALK.ready) { if (Ch.wo == null) { Ch.wo = 0; Ch.wa = 0; }
        const f0 = Math.floor(Ch.wa) % CWALK.length; Ch.wa += 16 / 60; Ch.x += CWALK_META.vpx * CHR_K * 16 / 60; Ch.wo++;
        const f1 = Math.floor(Ch.wa) % CWALK.length; if (f1 !== f0 && (f1 === 0 || f1 === 14) && audio()) groundStep(1, .9);
        if (Ch.wo > 470 && G.state !== 'end') finish(); }
      else if (t > 200 && G.state !== 'end') finish();
    }
    // a breath of quiet between one speaker and the next in a talk, so each voice is heard as its own person (owner, build 458)
    if (G.state === 'dialog' && G.autoT > 0 && G.guardKey !== pauseKey) { pauseKey = G.guardKey; G.autoT += 45; }
    if (G.act === 'roll' && !rollFly && !G.ring && G.actT >= 90) G.ring = rollPt;
    if (G.act === 'leap' && !G.ring && G.actT >= 90 && Ch.lp == null) G.ring = chrPt;
    if (Ch.lp != null && G.ring === chrPt) G.ring = null;
    camTick(false);
  }
  // the cut over the climb: he keeps climbing while the picture dips softly toward dark (never fully), then he stands
  // near the top, the camera is wide from the top, and the picture comes up again; the child walks the last steps
  function climbTick() {
    const k = climb; k.t++; k.snap = false;
    if (k.t <= 50) { run(true); veil = .86 * smooth(0, 50, k.t); return; }
    if (k.t === 51) { Ch.x = SKIP_TO; Ch.sd = 0; Ch.run = 0; Ch.anim = 12; closeK = 0; topK = topTo = 1; k.snap = true; said.ascend = true; return; }
    if (k.t === 70) { caption(ASCEND); said.topT = G.t; }
    veil = .86 * (1 - smooth(52, 120, k.t));
    if (k.t >= 120) { veil = 0; climb = null; G.state = 'play'; G.calm = G.t; }
  }
  // the clip after the burden is gone: on to frame 52, then back and forth between 52 and 70 at the video's own pace,
  // eased at each end, so he stands looking up and never jumps
  function kneelTick() {
    const v = 16 / 60;
    if (Ch.kup) { Ch.kn -= v; if (Ch.kn <= 0) { Ch.kn = null; Ch.cf = 70; Ch.cfd = -1; } return; }
    if (Ch.kn < 48) { Ch.kn += v; return; }
    // kneeling, only breathing: the clip's last frames back and forth, eased
    Ch.kn += Ch.knd * v * .5 * (.25 + .75 * Math.sin(Math.PI * clamp((Ch.kn - 48) / 16)));
    if (Ch.kn >= 64) { Ch.kn = 64; Ch.knd = -1; } if (Ch.kn <= 48) { Ch.kn = 48; Ch.knd = 1; }
  }
  function clipHold(still) {
    if (Ch.cf < 52) { Ch.cf += 16 / 60; return; }
    if (still && (Ch.hop > 0 || Ch.lp != null)) return;
    Ch.cf += Ch.cfd * (16 / 60) * (.25 + .75 * Math.sin(Math.PI * clamp((Ch.cf - 52) / 18)));
    if (Ch.cf >= 70) { Ch.cf = 70; Ch.cfd = -1; } if (Ch.cf <= 52) { Ch.cf = 52; Ch.cfd = 1; }
  }

  // ---------- HIS LIFE REMEMBERED (owner: "in the sky is full of flash back images of his life - like his mind thinking of
  // the providence of God"; "6 memories but quickly almost overlapping in frequency and punch"). In the silence after the
  // burden falls, before the sun: "He looked therefore, and looked again" ({94}) shown as what he sees in his mind. Each
  // is a picture the child has played, soft, warm and faded at its edges, with its own voice: Evangelist and the light,
  // the run ("Life! Life!"), his wife at the door, Help's hand, Evangelist's God-speed, and last Good-will's promise,
  // heard as it comes true. Ours, not the book's.
  const MEM_GAP = 62, MEM0 = 24, MEMS = [
    { who: E, txt: 'Do you see that shining light?', at: [.2, .18] },
    { who: C, txt: 'Life! Life! Eternal life!', at: [.52, .13] },
    { who: W, txt: 'Come back! Come home to us!', at: [.3, .3] },
    { who: 'Help', txt: 'Give me your hand.', at: [.62, .26] },
    { who: E, txt: 'God-speed.', at: [.16, .4] },
    { who: 'Good-will', txt: 'Bear your burden a little longer. At the place of deliverance, it will fall from your back of itself.', from: 1, at: [.4, .2], last: true },
  ];
  const memC = [];
  let memT = -1, memS = [], memUntil = 0, memQ = 0;
  // where on the hill each memory comes: spread from the foot of the slope to the top
  const MEM_X = [SLOPE0 + 250, SLOPE0 + 700, SLOPE0 + 1150, SLOPE0 + 1600, SLOPE0 + 2000, WALK_X - 80];
  // THE RULE FOR THIS LEVEL: no line is spoken, and no memory speaks, while any voice is still sounding
  const busy = () => saying() || G.t < memUntil;
  const memLast = () => memS.length === MEMS.length ? memS[MEMS.length - 1] : Infinity;

  // where the second sentence begins in a recording: the end of the longest quiet stretch after the first second
  function memCut(buf) {
    if (buf.memCut != null) return buf.memCut;
    const d = buf.getChannelData(0), R = buf.sampleRate, win = Math.round(R * .02), n = Math.floor(d.length / win), e = [];
    let mx = 0; for (let i = 0; i < n; i++) { let q = 0; for (let j = i * win; j < (i + 1) * win; j++) q += d[j] * d[j]; e.push(Math.sqrt(q / win)); mx = Math.max(mx, e[i]); }
    let best = 0, bestEnd = 0, run = 0; const lo = mx * .04, a = Math.round(.8 / .02), b = n - Math.round(1 / .02);
    for (let i = a; i < b; i++) { if (e[i] < lo) { run++; if (run > best) { best = run; bestEnd = i + 1; } } else run = 0; }
    return (buf.memCut = best >= 6 ? Math.max(0, bestEnd * .02 - .06) : 0);
  }
  function memVoice(m) {
    if (!audio()) return;
    // a voice that comes late (slow to load on a phone) is not played at all, so it can never sound over the next one;
    // while it loads nothing else may speak (build 453)
    const t0 = G.t; memUntil = G.t + 600;
    voxBuf(vox(m.who, m.txt)).then(buf => {
      if (!buf || !AC || !CR.on || G.t - t0 > 90) { if (memUntil === t0 + 600) memUntil = 0; return; }
      const off = m.from ? memCut(buf) : 0, dur = buf.duration - off;
      memUntil = G.t + Math.ceil(dur * 60) + 20;
      const s = AC.createBufferSource(), g = AC.createGain(); g.gain.value = m.last ? .85 : .6; s.buffer = buf; s.connect(g); g.connect(VOICEG); s.start(0, off);
    }).catch(() => { memUntil = 0; });
    hiss(700, .7, .018, 1.1); note(m.last ? 55 : 50, .02, 2.2, 0, true);
  }
  // one memory painted once: dark figures against a soft warm light, then blurred a little and faded at every edge
  function memPic(i) {
    if (memC[i]) return memC[i];
    // drawn at 300 x 200 but baked at three times that, so it stays sharp on a phone
    const W = 300, H = 200, Z = 4, WZ = W * Z, HZ = H * Z, cv = mk(WZ, HZ), q = cv.getContext('2d'); q.scale(Z, Z);
    const glow = (x, y, r, a) => { const g = q.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(255,236,200,${a})`); g.addColorStop(1, 'rgba(255,236,200,0)'); q.fillStyle = g; q.fillRect(0, 0, W, H); };
    const fl = mk(WZ, HZ), fq = fl.getContext('2d'); fq.scale(Z, Z);
    const fig = (im, meta, x, h, flip, k = .5) => { if (!im) return false; const K = k * (h / 300); fq.save(); fq.translate(x, 178); fq.scale(flip ? -K : K, K); fq.drawImage(im, -meta.ax, -meta.ground); fq.restore(); return true; };
    glow(W / 2, H * .55, 170, .4);
    let ok = true;
    if (i === 0) { glow(250, 70, 40, .9); ok = fig(EVA[EVA.length - 1], EVA_META, 120, 300); }
    else if (i === 1) { const f = RUNP[6]; ok = fig(f, RUNP_META, 150, 300); }
    else if (i === 2) { q.fillStyle = 'rgba(255,220,160,.85)'; q.beginPath(); q.moveTo(115, 180); q.lineTo(115, 60); q.quadraticCurveTo(150, 34, 185, 60); q.lineTo(185, 180); q.fill(); ok = fig(MIM.wife, { ax: MIM.wife ? MIM.wife.width / 2 : 0, ground: MIM.wife ? MIM.wife.height : 0 }, 150, 260 * (MIM.wife ? 300 / MIM.wife.height : 1)); }
    else if (i === 3) { ok = fig(MLIFT[0], { ax: 300, ground: 330 }, 150, 300, false, .42); fq.fillStyle = 'rgba(40,34,32,.9)'; fq.fillRect(0, 150, W, 50); }
    else if (i === 4) { ok = fig(KNEEL[70], KNEEL_META, 120, 300) && fig(EVA[50], EVA_META, 200, 300, true); }
    else { glow(210, 110, 90, .9); ok = fig(STD[0], STD_META, 110, 300) && fig(MIM['goodwill-reach'], { ax: 62, ground: 299 }, 200, 300, true); }
    if (!ok) return null;
    // the figures dark and warm against the light, as a memory
    fq.globalCompositeOperation = 'source-atop'; fq.fillStyle = 'rgba(58,40,30,.82)'; fq.fillRect(0, 0, W, H);
    q.setTransform(1, 0, 0, 1, 0, 0); q.drawImage(fl, 0, 0);
    q.globalCompositeOperation = 'color'; q.fillStyle = 'rgb(150,112,80)'; q.fillRect(0, 0, WZ, HZ);
    // a soft breath over it (a little, so the figures stay crisp)
    // a smooth blur: halved three times and doubled back step by step (one big stretch showed blocks)
    let bl = cv; const steps = [];
    for (let d = 2; d <= 8; d *= 2) { const n = mk(WZ / d, HZ / d); n.getContext('2d').drawImage(bl, 0, 0, WZ / d, HZ / d); steps.push(n); bl = n; }
    for (let j = steps.length - 2; j >= 0; j--) { const n = mk(steps[j].width, steps[j].height); n.getContext('2d').drawImage(bl, 0, 0, n.width, n.height); bl = n; }
    q.globalCompositeOperation = 'source-over'; q.globalAlpha = .42; q.drawImage(bl, 0, 0, WZ, HZ); q.globalAlpha = 1;
    // faded at every edge over a long soft stretch, so it melts into the sky
    q.globalCompositeOperation = 'destination-in'; q.save(); q.translate(WZ / 2, HZ / 2); q.scale(1, H / W); const v = q.createRadialGradient(0, 0, 0, 0, 0, WZ / 2); [[0, 1], [.25, .92], [.45, .66], [.65, .3], [.82, .09], [1, 0]].forEach(([o, a]) => v.addColorStop(o, `rgba(0,0,0,${a})`)); q.fillStyle = v; q.fillRect(-WZ / 2, -WZ / 2, WZ, WZ); q.restore();
    q.globalCompositeOperation = 'source-over';
    return (memC[i] = cv);
  }
  function memories(c) {
    if (memT < 0) return;
    MEMS.forEach((m, i) => {
      if (memS[i] == null) return; const t0 = memS[i], lt = memT - t0, life = m.last ? 380 : 150;
      if (lt < 0 || lt > life) return;
      const im = memPic(i); if (!im) return;
      const a = smooth(0, 12, lt) * (1 - smooth(life - (m.last ? 140 : 70), life, lt)), k = 1.12 - .12 * smooth(0, 30, lt) + .03 * lt / life;
      const w = VW * .36 * k, h = w * im.height / im.width, x = VW * m.at[0] + Math.sin(lt / 90 + i) * 6, y = VH * m.at[1] - lt * .05;
      c.save(); c.globalAlpha = .74 * a; c.drawImage(im, x - w / 2, y - h / 2, w, h);
      // the punch as it comes: a brief brightening
      if (lt < 20) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = .25 * (1 - lt / 20); c.drawImage(im, x - w / 2, y - h / 2, w, h); }
      c.restore();
    });
  }

  function draw() {
    const c = ctx; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    sky(c); far(c); memories(c);
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
    peek: () => ({ ph, t, fly: rollFly ? rollFly.t : -1, x: Math.round(Ch.x), cf: +Ch.cf.toFixed(1), bur: bur ? { st: bur.st, x: Math.round(bur.x), a: +bur.a.toFixed(2), t: bur.t, H: Math.round(bur.H || 0), z: +(bur.z || 0).toFixed(1), r: +(bur.r || 0).toFixed(2), sq: +(bur.sq || 0).toFixed(2) } : null, gold: +gold.toFixed(2), shine: +shine.toFixed(2), leaps: leapsLeft, lp: Ch.lp == null ? -1 : +Ch.lp.toFixed(1), wo: Ch.wo == null ? -1 : Ch.wo, closeK: +closeK.toFixed(2), topK: +topK.toFixed(2), veil: +veil.toFixed(2), tear: tearT, sep: sepT, mem: memS.length, kn: Ch.kn == null ? -1 : +Ch.kn.toFixed(1), hb: hymn ? +(hymn.t / BEATT).toFixed(1) : -1 }),
    // A SHORT WORDLESS CHOIR FOR THE SHINING ONES (awe study): from their coming until Christian's song begins (index.html's music player, cue 'choir')
    choir: () => ph === 'shine' || (ph === 'leaps' && !blest) };
})();
