// ============================================================
// LEVEL 3: MR. WORLDLY WISEMAN AND THE HILL (book {37} to {60}). Loaded by index.html after slough.js and run by the
// same engine (talk, caption, hint, voices, holding to walk). Everything of its own is inside HL.
//
// BUILD 134: A FIRST SKETCH IN CODE. Nothing was paid for: Mr. Worldly Wiseman is a STAND-IN (Obstinate's pictures in
// a paler, warmer tone) until he has a painting and a walk of his own; Evangelist has no walk, so he comes out of the
// hill's smoke; Christian falling at Evangelist's feet is his weeping video from Level 1; none of the new lines is
// recorded yet (they are silent and pass by reading time).
//
// The level, in the book's order: alone on the plain, he sees one far off coming across the field ({37}) -> they meet
// where their ways cross; Wiseman's counsel ({38} to {45}); "Do you see that hill?": the child touches the hill -> he
// turns out of his way ({46}): the far light slips behind the hill, the tune goes wrong, the sky darkens -> close by,
// the hill hangs over the way; holding does less and less; he stands still; fire flashes out of the hill -> Evangelist
// comes ({47} to {59}); Christian falls at his feet; Evangelist takes him by the right hand -> back with haste ({59})
// -> (a veil of mist: "in process of time") -> the gate; the child knocks more than once or twice ({60}).
//
// World units: x along the way, y = 0 the road, up is negative. The camera has a centre (cx), a width (z: 1 = Level
// 1's scale, smaller = drawn back) and the road's place on the screen (wl). Things further back slide slower: the
// hill and the village behind it by PH of the camera's movement, the far ridge by a tenth.
// ============================================================
const HL = (() => {
  const WW = 'Mr. Worldly Wiseman';
  function rngS(seed) { let s = seed >>> 0 || 1; return () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function noise2(seed) {
    const h = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7 + seed) * 43758.5453; return v - Math.floor(v); };
    const n = (x, y) => { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
      return lerp(lerp(h(i, j), h(i + 1, j), a), lerp(h(i, j + 1), h(i + 1, j + 1), a), b); };
    return (x, y) => { let s = 0, a = 1, t = 0; for (let k = 0; k < 5; k++) { s += a * n(x, y); t += a; a *= .5; x = x * 2.03 + 17; y = y * 2.03 + 9; } return s / t; };
  }
  const nz = noise2(57), nz2 = noise2(3);

  // ---------- the places ----------
  const START = 0, MEET = 900, STILL = 2400, GATE_X = 9000, GATE_FROM = GATE_X - 640, GATE_STOP = GATE_X - 58;
  const PH = .3, HILL_A = STILL + 330, HILL_Y = -60;      // the hill: how much it slides with the camera, the place on the road it stands beside, its foot above the road line
  const EV_X = STILL - 135;

  // ---------- the words: Bunyan's, shortened and made plain ----------
  const SEEN = [      // {37}
    [N, 'Now as Christian was walking by himself, he saw one far off, coming across the field to meet him.'],
    [N, 'The gentleman\'s name was Mr. Worldly Wiseman. He lived in the town of Carnal Policy, a very great town, close by the city Christian came from.'],
  ];
  const WISE = [      // {38} to {45}
    [WW, 'How now, good fellow! Where are you going, with such a burden?'],
    [C, 'Sir, I am going to that wicket-gate before me. There I shall be put into a way to be rid of my heavy burden.'],
    [WW, 'Will you listen to me, if I give you counsel?'],
    [C, 'If it is good, I will. For I stand in need of good counsel.'],
    [WW, 'Who told you to go this way to be rid of your burden?'],
    [C, 'A man who seemed to me a very great and honourable person. His name, as I remember, is Evangelist.'],
    [WW, 'There is not a more dangerous and troublesome way in the world than the one he has sent you! I see the dirt of the Slough of Despond is upon you already.'],
    [C, 'Sir, this burden upon my back is more terrible to me than all these things.'],
    [WW, 'In that village, named Morality, there lives a gentleman whose name is Legality. He has skill to help men off with such burdens as yours.'],
    [N, 'Now Christian stood still a while. But soon he thought: if this is true, my wisest course is to take his advice.'],
    [C, 'Sir, which is my way to this honest man\'s house?'],
    [WW, 'Do you see that hill?', 'hill'],
    [C, 'Yes, very well.'],
    [WW, 'By that hill you must go, and the first house you come to is his.'],
  ];
  const TURNED = [[N, 'So Christian turned out of his way, to go to Mr. Legality\'s house for help.']];      // {46}
  const HIGH = [[N, 'But when he had come close to the hill, it seemed so high, and its side hung so far over the way, that Christian was afraid to go further, lest the hill should fall on his head.']];
  const STOOD = [
    [N, 'There he stood still, and did not know what to do.'],
    [N, 'Also his burden now seemed heavier to him than when he was in his way.'],
    [N, 'There came also flashes of fire out of the hill, and Christian was afraid that he should be burned.', 0, () => { fire(1); }],
    [N, 'And now he began to be sorry that he had taken Mr. Worldly Wiseman\'s counsel.'],      // {47}
  ];
  const COMING = [[N, 'With that he saw Evangelist coming to meet him, and he began to blush for shame.']];
  const EVANW = [      // {48} to {59}
    [E, 'What are you doing here, Christian?'],
    [N, 'At these words Christian did not know what to answer. He stood speechless before him.'],
    [E, 'Are you not the man that I found crying outside the walls of the City of Destruction?'],
    [C, 'Yes, dear sir, I am the man.'],
    [E, 'Did I not show you the way to the little wicket-gate?'],
    [C, 'Yes, dear sir.'],
    [E, 'How is it, then, that you are so quickly turned aside? For you are now out of the way.'],
    [C, 'I met a gentleman, as soon as I had got over the Slough of Despond. He persuaded me that in the village before me I might find a man who could take off my burden.'],
    [E, 'Stand still a little, that I may show you the words of God.'],
    [E, 'The just shall live by faith. You have begun to draw back your foot from the way of peace.'],
    [N, 'Then Christian fell down at his feet, crying:', 0, () => { C3.weep = true; C3.wt = 0; }],
    [C, 'Woe is me, for I am undone!'],
    [N, 'At the sight of this, Evangelist caught him by the right hand.', 0, () => { note(67, .04, 4); note(71, .035, 4, .12); }],
    [E, 'All manner of sin shall be forgiven unto men. Be not faithless, but believing.'],
    [N, 'Then Christian revived a little, and stood up trembling.', 0, () => { C3.weep = false; }],
    [E, 'The man that met you is one Worldly Wiseman. And Mr. Legality is not able to set you free from your burden. No man was ever yet rid of his burden by him.'],
    [N, 'With that there came fire out of the mountain under which poor Christian stood.', 0, () => { fire(1.4); }],
    [C, 'Sir, what do you think? Is there hope? May I now go back, and go up to the wicket-gate?'],
    [E, 'Your sin is very great. Yet the man at the gate will receive you, for he has goodwill for men.'],
    [E, 'Only take heed that you do not turn aside again.'],
    [N, 'Then Evangelist gave him one smile, and bid him God-speed.'],
  ];
  const HASTE = [      // {59}
    [N, 'So he went on with haste, and spoke to no man by the way.'],
    [N, 'He went like one treading on forbidden ground, and could not think himself safe till he was again in the way which he had left.'],
  ];
  const ATGATE = [[N, 'So, in time, Christian got up to the gate. Now over the gate there was written: Knock, and it shall be opened unto you.']];
  const KNOCK = [      // {60}
    [N, 'He knocked, therefore, more than once or twice, saying:', 'knock'],
    [C, 'May I now enter here? Will he within open to sorry me?'],
    [N, 'At last there came a grave person to the gate, named Good-will.', 0, () => { doorTo = 1; sfx.chord(); }],
  ];
  const ALL = [...SEEN, ...WISE, ...TURNED, ...HIGH, ...STOOD, ...COMING, ...EVANW, ...HASTE, ...ATGATE, ...KNOCK];

  // ---------- state ----------
  let ph = 'plain', built = false, loading = null;
  const cam = { cx: 0, z: 1, wl: 440 };
  const C3 = { x: 0, face: 1, faceA: 1, anim: 12, sd: null, alpha: 1, run: 0, ranim: 0, weep: false, wt: 0, wa: 0, tv: null };
  let wise = null, evan = null, dark = 0, hope = 0, flash = 0, flashT = 0, veil = 0, veilTo = 0, knocks = 0, knockT = 0, door = 0, doorTo = 0;
  let saidSeen = false, saidHigh = false, stillT = 0, hasteSaid = false, gateSaid = false, hintT = 0, noteI = 0, noteX = 0, lastFr = 0, hillSeen = false;
  let OAKT = null, hillBox = [0, 0, 1];

  // ---------- pictures baked once ----------
  let HILL = null, SMOKE = null, CLOUD = null, TOWN = null; const CRACKS = [];
  // the hill's outline: h = height above its foot, 0 to TOP; its left side hangs far out over the way
  const TOP = 520, HW = 1500, HH = 640, HOX = 300, HOY = 610;      // the baked picture's size and where the foot's left end lies in it
  const FACE = [[0, 0], [60, -22], [140, -66], [240, -138], [320, -182], [358, -176], [420, -116], [480, -44], [520, 36]];
  function faceX(h) { let i = 0; while (i + 2 < FACE.length && FACE[i + 1][0] <= h) i++; const [h0, x0] = FACE[i], [h1, x1] = FACE[i + 1]; return lerp(x0, x1, clamp((h - h0) / (h1 - h0))) + (nz(h * .03, 2) - .5) * 26 * smooth(0, 60, h); }
  const backX = h => 96 + 330 * Math.pow(1 - h / TOP, 1.2) + 560 * Math.pow(1 - h / TOP, 3.2) + (nz(h * .022, 9) - .5) * 44 * smooth(0, 50, h) + 26 * smooth(250, 190, h) * smooth(120, 190, h);
  function build() {
    if (built) return; built = true;
    // the hill, twice: in the fair day's far blue-grey, and nearly black under its own cloud
    HILL = [[94, 100, 118], [24, 22, 30]].map(col => {
      const c = mk(HW, HH), k = c.getContext('2d'); k.translate(HOX, HOY);
      k.beginPath(); k.moveTo(-8, 12);
      for (let h = 0; h <= TOP; h += 6) k.lineTo(faceX(h), -h);
      for (let h = TOP; h >= 0; h -= 6) k.lineTo(backX(h), -h - (h > TOP - 30 ? (nz(h * .2, 4) - .5) * 14 : 0));
      k.lineTo(backX(0) + 30, 12); k.closePath();
      const g = k.createLinearGradient(0, -TOP, 0, 0); g.addColorStop(0, css(col)); g.addColorStop(1, css(mix(col, [150, 150, 150], .1))); k.fillStyle = g; k.fill();
      // a few faint ledges across the face, so it reads as rock
      k.save(); k.clip(); k.strokeStyle = css(mix(col, [255, 255, 255], .5), .1); k.lineWidth = 2;
      for (let i = 0; i < 9; i++) { const h = 40 + i * 52; k.beginPath(); for (let x = -200; x <= 1100; x += 20) { const y = -h - (nz(x * .01, i) - .5) * 40 - x * .06; x === -200 ? k.moveTo(x, y) : k.lineTo(x, y); } k.stroke(); }
      k.restore(); return c;
    });
    // the cracks that the fire shows in (in the hill's own units, from its foot's left end)
    const R = rngS(11);
    for (let i = 0; i < 6; i++) { let x = -90 + R() * 200, y = -(150 + R() * 280); const p = [[x, y]]; for (let j = 0; j < 9; j++) { x += (R() - .4) * 30; y += 14 + R() * 22; if (y > -20) break; p.push([x, y]); } CRACKS.push(p); }
    // smoke and cloud: soft shapes from noise (white, laid in light or dark)
    const cloud = (w, h, seed, thr, sx, sy) => { const c = mk(w, h), k = c.getContext('2d'), im = k.createImageData(w, h), n = noise2(seed);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const e = Math.sin(Math.PI * y / h) * Math.min(1, x / 30, (w - x) / 30), v = smooth(thr, thr + .22, n(x * sx, y * sy)) * e; const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = 255 * v; }
      k.putImageData(im, 0, 0); return c; };
    SMOKE = cloud(240, 80, 5, .4, .022, .05); CLOUD = cloud(400, 90, 31, .46, .014, .045);
    // the village of Morality beyond the hill: low houses, pleasant, a lamp in some windows (never reached)
    { const c = mk(400, 70), k = c.getContext('2d'), Rv = rngS(8); TOWN = c; k.fillStyle = '#fff';
      const lit = [];
      for (let i = 0; i < 11; i++) { const x = 14 + i * 34 + Rv() * 10, w = 22 + Rv() * 16, h = 13 + Rv() * 9; k.fillRect(x, 70 - h, w, h); k.beginPath(); k.moveTo(x - 2, 70 - h); k.lineTo(x + w / 2, 70 - h - 9 - Rv() * 5); k.lineTo(x + w + 2, 70 - h); k.fill();
        if (i === 5) { k.fillRect(x + w / 2 - 4, 70 - h - 30, 8, 30); k.beginPath(); k.moveTo(x + w / 2 - 5, 70 - h - 30); k.lineTo(x + w / 2, 70 - h - 52); k.lineTo(x + w / 2 + 5, 70 - h - 30); k.fill(); }
        if (Rv() < .6) lit.push([x + 4 + Rv() * (w - 10), 70 - h + 4]); }
      TOWN.lit = lit; }
  }
  function preload() {
    if (!loading) loading = Promise.all([OBS.ready || loadPack('obstinate', OBS).catch(() => {}), EVS.ready || loadPack('evangelist-stand', EVS).catch(() => {}), RUNP.ready || loadPack('christian-run-plain', RUNP).catch(() => {}),
      WEEP.ready || loadPack('christian-weep', WEEP).catch(() => {}), TURN.ready || loadPack('christian-turn', TURN).catch(() => {}),
      OBS_ST ? 0 : loadImg('obstinate-stand.webp').then(im => { if (im && !OBS_ST) OBS_ST = im; }),
      loadImg('tree-a.webp').then(im => { if (!im) return; const c = mk(im.width, im.height), k = c.getContext('2d'); k.drawImage(im, 0, 0); k.globalCompositeOperation = 'source-in'; k.fillStyle = '#fff'; k.fillRect(0, 0, c.width, c.height); OAKT = c; })]).catch(() => {});
    return loading;
  }

  // one tinted figure, feet at world (x, 0) (each kind of figure has its own small canvas)
  const tintC = {};
  function figure(c, slot, im, meta, x, face, tint, alpha = 1, sy = 1) {
    if (!im || alpha <= .004) return;
    const fc = tintC[slot] || (tintC[slot] = mk(8, 8)); if (fc.width !== im.width || fc.height !== im.height) { fc.width = im.width; fc.height = im.height; }
    const f = fc.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, fc.width, fc.height);
    f.drawImage(im, 0, 0); f.globalCompositeOperation = 'multiply'; f.fillStyle = css(tint); f.fillRect(0, 0, im.width, im.height);
    f.globalCompositeOperation = 'destination-in'; f.drawImage(im, 0, 0); f.globalCompositeOperation = 'source-over';
    c.save(); c.globalAlpha = alpha; c.translate(x, 5); if (TALKM) c.transform(1, 0, TALKM.sh, 1, 0, 0);
    c.scale(face * CHR_K, CHR_K * sy * (TALKM ? TALKM.sy : 1)); c.drawImage(fc, -meta.ax, -meta.ground); c.restore();
  }
  function foot(c, x, a = 1, rx = 46) { const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, 'rgba(6,8,14,.5)'); g.addColorStop(.6, 'rgba(6,8,14,.26)'); g.addColorStop(1, 'rgba(6,8,14,0)'); c.save(); c.translate(x, 4); c.scale(rx, 7); c.globalAlpha = a; c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore(); }

  // ---------- sound ----------
  // fire out of the hill: a flash and thunder (no words out of the mountain: left out for young children)
  function fire(k = 1) { flash = Math.max(flash, k); if (audio()) { sweep(64, 30, 1.8, .09 * k); hiss(190, .7, .11 * k, 1.6, 'lowpass'); hiss(900, 1, .03 * k, .5, 'bandpass', .05); } }
  // the tune on the wrong path: Amazing Grace's first phrase with its bright notes bent flat, low and slow
  const WRONG = [62, 67, 70, 67, 70, 68, 67, 63, 62].map(m => m - 12);
  const RIGHT = [62, 67, 71, 67, 71, 69, 67];
  function knock() {
    if (G.act !== 'knock' || knocks >= 3) return;
    knocks++; knockT = 0; G.ring = null; G.actT = 20;
    if (audio()) { sweep(150, 90, .12, .2); hiss(700, 2, .08, .08, 'bandpass'); sweep(150, 90, .12, .16, true, .16); hiss(700, 2, .06, .08, 'bandpass', .16); }
  }
  function sawHill() { if (G.act !== 'hill') return; hillSeen = true; G.ring = null; note(50, .05, 4); note(57, .04, 4, .1); next(true); }

  // ---------- start, title, end ----------
  function reset0() {
    Object.assign(C3, { x: START, face: 1, faceA: 1, anim: 12, sd: QUIET[0], alpha: 1, run: 0, ranim: RUNP_META.start || 0, weep: false, wt: 0, wa: 0, tv: null, fired: false });
    wise = null; evan = null; dark = 0; hope = 0; flash = 0; flashT = 200; veil = 0; veilTo = 0; knocks = 0; knockT = 0; door = 0; doorTo = 0;
    saidSeen = saidHigh = hasteSaid = gateSaid = hillSeen = false; stillT = 0; hintT = 0; noteI = 0; noteX = 0;
  }
  // the picture behind the title page when Level 3 is the child's level: the hill hanging over the way, nobody there
  function title() { build(); preload(); HL.show = true; reset0(); ph = 'title'; dark = .75; Object.assign(cam, { cx: STILL + 60, z: .72, wl: 420 }); }
  function start() {
    HL.on = true; HL.show = false; build(); preload();
    document.getElementById('title').style.display = 'none';
    document.getElementById('endc').className = 'card';
    document.body.classList.add('playing', 'slough'); G.opening = null; hush();
    Object.assign(G, { t: 0, capQ: [], cap: 0, hint: null, act: null, actT: 0, ring: null, auto: null, guard: 0, autoT: 0, taps: [], roll: { t: 999, x: 0, y: 0 }, ended: false, calm: 0 });
    downs.clear(); keys.r = keys.push = false;
    reset0(); ph = 'plain'; Object.assign(cam, { cx: START + 150, z: 1, wl: 440 });
    if (audio()) { AC.resume(); if (rainG) rainG.gain.setTargetAtTime(0, AC.currentTime, .8); }
    // SKIP-AHEAD LINKS: ?level=3&at=hill (close to the hill), ?level=3&at=evangelist, ?level=3&at=gate
    const at = new URLSearchParams(location.search).get('at');
    if (at === 'hill') { ph = 'aside'; C3.x = STILL - 760; saidSeen = true; hillSeen = true; }
    if (at === 'evangelist') { ph = 'still'; C3.x = STILL; saidSeen = saidHigh = true; dark = 1; stillT = 1e4; }
    if (at === 'gate') { ph = 'gate'; C3.x = GATE_FROM; saidSeen = true; hope = 1; }
    if (at) { cam.cx = C3.x + 150; }
    G.state = 'wait'; setTimeout(() => { if (HL.on && G.state === 'wait') { G.state = ph === 'still' ? 'auto' : 'play'; } }, 1400);
  }
  function finish() {
    G.state = 'end'; G.ended = false;
    const e = document.getElementById('endc');
    e.querySelector('h1').textContent = 'At the gate';
    e.querySelectorAll('p')[0].textContent = 'He knocked, and one came to the gate, named Good-will.';
    e.querySelectorAll('p')[1].textContent = 'Next: the Wicket-Gate';
    document.getElementById('on2').style.display = 'none';
  }
  function turnC(d, k = 1) { if (C3.face === d) return; if (TURN.length) C3.tv = { t: d > 0 ? 0 : TURN.length - 1, d, k }; else C3.face = d; }

  // where to touch, on the screen
  const hillPt = () => [hillBox[0] + 70 * hillBox[2], hillBox[1] - 250 * hillBox[2]];
  const gatePt = () => [(GATE_X - cam.cx) * cam.z + VW / 2, cam.wl - 70 * cam.z];
  function touch(sx, sy) {
    if (G.act === 'hill') { const [hx, hy] = hillPt(); if (Math.hypot(sx - hx, (sy - hy) * .7) < 230 * hillBox[2] + 40) sawHill(); else G.actT = Math.max(G.actT, 129); return; }
    if (G.act === 'knock') { const [gx, gy] = gatePt(); if (Math.hypot(sx - gx, sy - gy) < 130) knock(); else G.actT = Math.max(G.actT, 89); return; }
  }
  function key() { if (G.act === 'hill') sawHill(); else if (G.act === 'knock') knock(); }

  // ---------- each tick ----------
  const frameOf = a => ((Math.floor(a) % CHR.length) + CHR.length) % CHR.length;
  // Christian walks (dir 1 or -1) at v, or stops as in Level 1: he finishes his stride to walk frame 28 or 1, where
  // his own stopping video joins on
  function walk(dir, v, vmax = MAXV) {
    const fr0 = frameOf(C3.anim);
    if (v) { if (C3.sd != null) { C3.sd = null; C3.anim = 1; } }
    else if (C3.sd == null) { if (fr0 === 28 || fr0 === 1 || !STD.length) C3.sd = fr0 === 28 ? 0 : STAND_FROM_1; else v = Math.max(.45, vmax); }
    C3.x += dir * v; C3.anim = stepAnim(C3.anim, v, CHR_STEP, CHR_META);
    const fr1 = frameOf(C3.anim);
    if (v && fr1 !== fr0 && CHR_META.rest.includes(fr1) && audio()) sfx.step(false, 1 + dark * .8);
    return v;
  }
  function update() {
    if (ph === 'title') { flashT--; if (flashT < 0) { flash = .5 + Math.random() * .4; flashT = 300 + Math.random() * 500; } flash *= .9; return; }
    const want = G.state === 'play' && (keys.r || held());
    if (C3.sd != null) C3.sd += .4;
    C3.faceA = clamp(C3.faceA + (C3.face - C3.faceA) * .06, -1, 1);
    if (C3.tv) { C3.tv.t += C3.tv.d * TURN_META.step * C3.tv.k; if (C3.tv.t >= TURN.length - 1 || C3.tv.t <= 0) { C3.face = C3.faceA = C3.tv.d; C3.tv = null; } }
    C3.wa = clamp(C3.wa + (C3.weep ? .05 : -.04)); if (C3.weep) C3.wt = Math.min(64, C3.wt + WEEP_META.step);
    flash *= .93; door += (doorTo - door) * .02; veil = clamp(veil + Math.sign(veilTo - veil) * .012);
    hintT++;

    if (ph === 'plain') {
      let v = want ? MAXV : 0; if (v && C3.x + v >= MEET) v = 0;
      v = walk(1, v);
      if (want) clearHint('walk'); else if (hintT === 400 && C3.x < START + 20) hint('walk', 'Hold to walk.');
      if (!saidSeen && C3.x > 220) { saidSeen = true; caption(SEEN); wise = { x: cam.cx + VW / 2 / cam.z + 60, anim: 0, mode: 'come', st: 0, alpha: 1 }; }
      if (wise && wise.mode === 'stand' && wise.st >= 1 && C3.x >= MEET - 30 && C3.sd != null && !saying()) { ph = 'meet'; talk(WISE, () => { ph = 'aside'; wise.mode = 'go'; hintT = 0; noteX = C3.x + 60; caption(TURNED); }); }
    } else if (ph === 'meet') {
      walk(1, 0);
    } else if (ph === 'aside') {
      const heavy = lerp(1, .45, smooth(STILL - 700, STILL - 40, C3.x));
      let v = want ? MAXV * heavy : 0;
      if (v && saying() && !saidHigh && C3.x + v >= STILL - 560) v = 0;      // the words keep with the place they tell of
      v = walk(1, v, MAXV * heavy);
      if (!saidHigh && C3.x > STILL - 550) { saidHigh = true; caption(HIGH); }
      if (v && C3.x > noteX) { noteX = C3.x + 58 * 1.5; note(WRONG[noteI++ % WRONG.length], .04, 3.2); }
      if (!want && hintT === 500) hint('walk', 'Hold to walk.'); if (want) clearHint('walk');
      if (C3.x >= STILL) { ph = 'still'; G.state = 'auto'; clearHint('walk'); stillT = 0; }
    } else if (ph === 'still') {
      walk(1, 0); stillT++;
      if (stillT === 60 || stillT > 9999) { stillT = 61; caption(STOOD); }
      // the lines' own happenings (captions carry no fn): the fire comes with its words
      if (dlg.querySelector('.t').textContent === STOOD[2][1] && !C3.fired) { C3.fired = true; fire(1); }
      if (stillT > 200 && !saying() && G.cap <= 0 && C3.sd != null) { ph = 'come'; caption(COMING); evan = { a: 0, t: 0 }; turnC(-1); }
    } else if (ph === 'come') {
      walk(1, 0); evan.a = clamp(evan.a + .006);
      if (evan.a >= 1 && !C3.tv && !saying() && G.cap <= 0) { ph = 'evan'; talk(EVANW, () => { ph = 'back'; hintT = 0; }); }
    } else if (ph === 'evan') {
      walk(1, 0);
    } else if (ph === 'back') {
      // back with haste: he runs (his plain run from Level 1), to the place where he left the way
      let go = want && C3.x > MEET + 40;
      if (want && !hasteSaid) { hasteSaid = true; caption(HASTE); }
      if (go && RUNP.ready) { const st = RUNP_META.vpx * CHR_K; C3.x -= st * .4; C3.ranim += .4; C3.run = clamp(C3.run + .14); C3.sd = QUIET[0]; if (Math.floor(C3.ranim) % 14 === 0 && Math.floor(C3.ranim - .4) % 14 !== 0 && audio()) sfx.step(false, 1.3); }
      else { C3.run = clamp(C3.run - .1); if (go) walk(-1, MAXV); else if (C3.sd == null) walk(-1, 0); }
      if (want) clearHint('haste'); else if (hintT === 150) hint('haste', 'Hold to hurry back.');
      if (C3.x <= MEET + 40 && C3.run <= 0 && !saying() && G.cap <= 0) { ph = 'mist'; G.state = 'auto'; veilTo = 1; }
    } else if (ph === 'mist') {
      if (veil >= 1) { ph = 'gate'; C3.x = GATE_FROM; C3.face = C3.faceA = 1; C3.sd = QUIET[0]; cam.cx = C3.x + 150; cam.z = 1; cam.wl = 440; dark = 0; hope = 1; evan = null; wise = null; veilTo = 0; G.state = 'play'; hintT = 0; }
    } else if (ph === 'gate') {
      let v = want ? MAXV : 0; if (v && C3.x + v >= GATE_STOP) v = 0;
      if (v && saying() && !gateSaid) v = 0;
      v = walk(1, v);
      if (!gateSaid && C3.x > GATE_FROM + 140) { gateSaid = true; caption(ATGATE); }
      if (want) clearHint('walk'); else if (hintT === 400) hint('walk', 'Hold to walk.');
      if (C3.x >= GATE_STOP - 30 && C3.sd != null && gateSaid && !saying() && G.cap <= 0) { ph = 'knock'; clearHint('walk'); talk(KNOCK, () => { ph = 'open'; G.state = 'auto'; stillT = 0; }); }
    } else if (ph === 'knock') {
      walk(1, 0); knockT++;
      if (G.act === 'knock' && knocks >= 3 && knockT > 50) { RIGHT.forEach((m, i) => note(m, .04, 3, i * .34)); next(true); }
    } else if (ph === 'open') {
      if (++stillT > 260 && G.state !== 'end') finish();
    }

    // what the child is asked to do, shown after a while
    if (G.state === 'dialog' && G.act === 'hill') { G.actT++; if (G.actT === 130) { dMore.textContent = 'touch the hill ✦'; G.ring = hillPt; } }
    if (G.state === 'dialog' && G.act === 'knock') { G.actT++; if (G.actT === 90 && knocks < 3) { dMore.textContent = 'knock on the gate ✦'; G.ring = gatePt; } }

    // Mr. Worldly Wiseman crosses the field to meet him, stands, and afterwards goes on his own way
    if (wise) {
      if (wise.mode === 'come') { if (wise.x > MEET + 108) { wise.x -= 1.25; wise.anim = stepAnim(wise.anim, 1.25, OBS_STEP, OBS_META); } else { wise.anim = stepAnim(wise.anim, 0, OBS_STEP, OBS_META); if (OBS_META.rest.includes(Math.floor(wise.anim) % OBS_META.frames)) wise.mode = 'stand'; } }
      else if (wise.mode === 'stand') wise.st = clamp(wise.st + .05);
      else if (wise.mode === 'go') { wise.st = clamp(wise.st - .06); if (wise.st <= 0) { wise.x -= 1.25; wise.anim = stepAnim(wise.anim, 1.25, OBS_STEP, OBS_META); wise.alpha = clamp((wise.x - (MEET - 760)) / 260); if (wise.alpha <= 0) wise = null; } }
    }

    // the sky darkens as he goes out of the way, and clears as he comes back; fire out of the hill while he stands under it
    const dTo = ph === 'aside' || ph === 'back' || ph === 'mist' ? smooth(MEET + 250, STILL - 150, C3.x) : ph === 'still' || ph === 'come' || ph === 'evan' ? 1 : 0;
    dark += (dTo - dark) * .03;
    if (ph === 'still' || ph === 'come' || ph === 'evan') { if (--flashT < 0 && stillT > 61) { fire(ph === 'evan' ? .45 : .7 + Math.random() * .3); flashT = (ph === 'evan' ? 700 : 330) + Math.random() * 500; } }

    // the camera
    let tx = C3.x + 150, tz = 1;
    if (ph === 'plain') tz = wise ? .86 : 1;
    if (ph === 'meet') { tx = C3.x + 60; tz = 1; if (G.act === 'hill') { tx = C3.x + 800; tz = .5; } }
    if (ph === 'aside') tz = lerp(1, .72, smooth(STILL - 900, STILL - 100, C3.x));
    if (ph === 'still' || ph === 'come' || ph === 'evan') { tx = STILL + 60 - (ph === 'still' ? 0 : 50); tz = .72; }
    if (ph === 'back' || ph === 'mist') { tx = C3.x - 150; tz = lerp(1, .8, smooth(STILL - 900, STILL - 100, C3.x)); }
    if (ph === 'gate' || ph === 'knock' || ph === 'open') { tx = Math.min(C3.x + 150, GATE_X - 120); tz = lerp(1, .9, smooth(GATE_X - 500, GATE_STOP, C3.x)); }
    cam.cx += (tx - cam.cx) * .035; cam.z += (tz - cam.z) * .03; cam.wl = 440 - (1 - cam.z) * 70;
  }

  // ---------- drawing ----------
  function drawChr(c, tint) {
    if (ph === 'title') return;
    TALKM = talkMove(C);
    const a = C3.alpha, x = C3.x;
    foot(c, x, a);
    if (C3.tv && TURN.length) {
      const tf = clamp(C3.tv.t, 0, TURN.length - 1), f0 = Math.floor(tf);
      figure(c, 'turn', TURN[f0], TURN_META, x, 1, tint, a);
      if (f0 + 1 < TURN.length && tf - f0 > .02) figure(c, 'turn2', TURN[f0 + 1], TURN_META, x, 1, tint, a * (tf - f0));
      TALKM = null; return;
    }
    const wa = WEEP.ready ? smooth(0, 1, C3.wa) : 0, ra = RUNP.ready ? C3.run : 0, rest = a * (1 - ra);
    if (wa > 0) figure(c, 'weep', WEEP[Math.min(WEEP.length - 1, Math.floor(C3.wt))], WEEP_META, x, C3.face, tint, a * smooth(0, .6, wa));
    if (ra > 0) figure(c, 'run', RUNP[((Math.floor(C3.ranim) % RUNP.length) + RUNP.length) % RUNP.length], RUNP_META, x, -1, tint, a * smooth(0, .5, ra));
    const sa = rest * (1 - smooth(.4, 1, wa)) * (1 - smooth(.5, 1, ra));
    if (sa > 0) {
      if (C3.sd != null && STD.length) {
        const im = STD[atTime(STD_META, breathT(C3.sd))], fr = (1 + C3.faceA) / 2;
        if (fr > .01) figure(c, 'std', im, STD_META, x, 1, tint, sa * fr);
        if (fr < .99) figure(c, 'std2', im, STD_META, x, -1, tint, sa * (1 - fr));
      } else figure(c, 'chr', CHR[frameOf(C3.anim)], CHR_META, x, C3.face, tint, sa);
    }
    TALKM = null;
  }
  function draw() {
    const { z, cx, wl } = cam, S = DPR, c = ctx;
    const X = x => (x - cx) * z + VW / 2, Y = y => wl + y * z, hor = Y(-140);
    const gateish = smooth(0, 1, hope);
    c.setTransform(S, 0, 0, S, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.imageSmoothingEnabled = true;
    // the sky: a fair day over the plain, a heavy red-brown dark by the hill, a warmer morning at the gate
    const top = mix(mix([124, 148, 176], [118, 142, 170], gateish), [32, 32, 44], dark), low = mix(mix([238, 226, 200], [252, 228, 172], gateish), [124, 94, 88], dark);
    { const g = c.createLinearGradient(0, 0, 0, hor); g.addColorStop(0, css(top)); g.addColorStop(1, css(low)); c.fillStyle = g; c.fillRect(0, 0, VW, hor + 2); }
    // clouds, pale by day and heavy near the hill
    { const off = ((cx * .05 + G.t * .02) % 800 + 800) % 800;
      for (let i = -1; i < 2; i++) { const x0 = i * 800 - off + 200;
        c.globalAlpha = .5 * (1 - dark); c.drawImage(CLOUD, x0, 30, 800, 180);
        if (dark > .02) { c.globalAlpha = .55 * dark; c.globalCompositeOperation = 'multiply'; c.drawImage(CLOUD, x0 - 260, 0, 900, 230); c.globalCompositeOperation = 'source-over'; } }
      c.globalAlpha = 1; }
    // the far light: ahead of him on the plain; over the gate at the end. The hill, drawn after it, comes between.
    const lx = lerp(VW * .5, clamp(X(GATE_X), 200, VW - 120), gateish), ly = lerp(hor - 96, Y(-262), gateish), la = 1 - .35 * dark;
    { const g = c.createRadialGradient(lx, ly, 0, lx, ly, 330); g.addColorStop(0, css([255, 236, 190], .85 * la)); g.addColorStop(.12, css([255, 222, 160], .5 * la)); g.addColorStop(.45, css([255, 214, 150], .16 * la)); g.addColorStop(1, css([255, 214, 150], 0));
      c.fillStyle = g; c.fillRect(lx - 330, ly - 330, 660, 660); c.fillStyle = css([255, 248, 226], la); c.beginPath(); c.arc(lx, ly, 7 + 1.2 * Math.sin(G.t / 40), 0, 7); c.fill(); }
    // the far ridge
    { const col = mix(mix(low, top, .45), [60, 52, 60], dark * .6); c.fillStyle = css(col); c.beginPath(); c.moveTo(0, hor + 2);
      for (let sx = 0; sx <= VW + 16; sx += 16) { const u = cx * .1 + (sx - VW / 2) / z; c.lineTo(sx, hor - (26 + 96 * nz(u * .0035, 5) + 22 * nz2(u * .02, 1)) * z * .8); }
      c.lineTo(VW, hor + 2); c.fill(); }
    // the plain, from the horizon down to the road
    { const far = mix(mix([176, 172, 140], [190, 180, 136], gateish), [78, 68, 70], dark), near = mix(mix([104, 108, 88], [112, 110, 82], gateish), [38, 36, 44], dark);
      const g = c.createLinearGradient(0, hor, 0, Y(0)); g.addColorStop(0, css(far)); g.addColorStop(1, css(near)); c.fillStyle = g; c.fillRect(0, hor, VW, Y(0) - hor + 1);
      // the village and the hill stand on the plain, further back
      const hx = VW / 2 + (HILL_A - cx) * PH * z, hy = Y(HILL_Y), k = z;
      hillBox = [hx, hy, k];
      if (hx > -1300 * k && hx < VW + 400 * k) {
        // the hill: fair and far off at first, black under its own cloud when he stands by it
        const dx = hx - HOX * k, dy = hy - HOY * k;
        c.globalAlpha = 1; c.drawImage(HILL[0], dx, dy, HW * k, HH * k); if (dark > .01) { c.globalAlpha = dark; c.drawImage(HILL[1], dx, dy, HW * k, HH * k); c.globalAlpha = 1; }
        // fire in its cracks
        if (flash > .02) { c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = c.lineJoin = 'round';
          for (const [w, a, col] of [[9, .12, [255, 90, 30]], [4, .4, [255, 150, 60]], [1.5, .9, [255, 236, 190]]]) { c.strokeStyle = css(col, Math.min(1, a * flash)); c.lineWidth = w * k;
            CRACKS.forEach((p, i) => { if (i % 2 === (flash > .9 ? i % 2 : Math.floor(G.t / 7) % 2)) { c.beginPath(); p.forEach(([px, py], j) => j ? c.lineTo(hx + px * k, hy + py * k) : c.moveTo(hx + px * k, hy + py * k)); c.stroke(); } }); }
          const g = c.createRadialGradient(hx - 40 * k, hy - 260 * k, 0, hx - 40 * k, hy - 260 * k, 420 * k); g.addColorStop(0, css([255, 130, 50], .34 * Math.min(1, flash))); g.addColorStop(1, css([255, 130, 50], 0)); c.fillStyle = g; c.fillRect(hx - 460 * k, hy - 680 * k, 880 * k, 840 * k);
          c.restore(); }
        // the village of Morality, at the hill's long foot on its far side
        const tx = hx + 560 * k, ty = hy + 2 * k, tw = 400 * k, th = 70 * k;
        c.save(); c.globalAlpha = 1; { const tc = tintC.town || (tintC.town = mk(400, 70)), t = tc.getContext('2d'); t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, 400, 70); t.drawImage(TOWN, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = css(mix(mix(far, top, .4), [46, 42, 50], dark * .7)); t.fillRect(0, 0, 400, 70); c.drawImage(tc, tx, ty - th, tw, th); }
        for (const [wx, wy] of TOWN.lit) { c.fillStyle = css([255, 214, 140], .5 + .4 * dark); c.fillRect(tx + wx * k, ty - th + wy * k, Math.max(1.5, 3 * k), Math.max(1.5, 3 * k)); }
        c.restore();
        // its own smoke along the top
        for (let i = 0; i < 3; i++) { const w = (520 + i * 120) * k, sxm = hx + (-60 + i * 70 + 40 * Math.sin(G.t / 300 + i * 2)) * k - w * .3; c.globalAlpha = (.25 + .5 * dark) * (1 - i * .22); c.globalCompositeOperation = 'multiply'; c.drawImage(SMOKE, sxm, hy - (TOP + 90 - i * 34) * k, w, w * .3); }
        c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
        // the field's haze at its foot, so it stands in the plain and not on it
        const fg = c.createLinearGradient(0, hy - 34 * k, 0, hy + 14 * k), fc = mix(far, near, clamp((hy - hor) / (Y(0) - hor)));
        fg.addColorStop(0, css(fc, 0)); fg.addColorStop(.7, css(fc, .9)); fg.addColorStop(1, css(fc, 1)); c.fillStyle = fg; c.fillRect(Math.max(0, hx - 260 * k), hy - 34 * k, 1700 * k, 48 * k);
      }
    }
    // the lone tree where the two ways cross
    if (OAKT) { const tx = VW / 2 + (MEET - 70 - cx) * .92 * z, h = 330 * z, w = h * OAKT.width / OAKT.height;
      if (tx > -w && tx < VW + w) { const tc = tintC.oak || (tintC.oak = mk(OAKT.width, OAKT.height)), t = tc.getContext('2d'); t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, tc.width, tc.height); t.drawImage(OAKT, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = css(mix([70, 78, 74], [30, 30, 38], dark)); t.fillRect(0, 0, tc.width, tc.height);
        c.drawImage(tc, tx - w / 2, Y(-12) - h + 6 * z, w, h); } }
    // the wall and the little wicket-gate
    if (X(GATE_X - 420) < VW) {
      const wallC = [104, 100, 100], x0 = GATE_X - 400;
      c.fillStyle = css(wallC); c.beginPath(); c.moveTo(X(x0 + 6), Y(2));
      for (let x = x0; x <= GATE_X + 900; x += 14) c.lineTo(X(x), Y(-(178 + (nz(x * .02, 3) - .5) * 14) + (x < x0 + 60 ? (nz(x * .3, 8) - .5) * 30 : 0)));
      c.lineTo(X(GATE_X + 900), Y(2)); c.fill();
      // courses of stone, faint
      c.strokeStyle = css([60, 58, 62], .22); c.lineWidth = 1; for (let i = 1; i < 6; i++) { c.beginPath(); c.moveTo(X(x0 + 20), Y(-i * 29)); c.lineTo(VW, Y(-i * 29)); c.stroke(); }
      // the gate: a narrow door under a round arch, the writing on a pale stone over it
      const gx = X(GATE_X), r = 30 * z, gy0 = Y(-120);
      c.fillStyle = css([34, 28, 26]); c.beginPath(); c.moveTo(gx - r, Y(1)); c.lineTo(gx - r, gy0); c.arc(gx, gy0, r, Math.PI, 0); c.lineTo(gx + r, Y(1)); c.fill();
      c.strokeStyle = css([70, 58, 50], .6); for (const d of [-.5, 0, .5]) { c.beginPath(); c.moveTo(gx + d * r, gy0 - r * .8); c.lineTo(gx + d * r, Y(0)); c.stroke(); }
      if (door > .01) { const w = 2 * r * .55 * door; c.save(); c.beginPath(); c.moveTo(gx - r, Y(1)); c.lineTo(gx - r, gy0); c.arc(gx, gy0, r, Math.PI, 0); c.lineTo(gx + r, Y(1)); c.clip(); c.fillStyle = css([255, 228, 160], .95); c.fillRect(gx - r, gy0 - r, w, r + 124 * z);
        c.restore(); const g = c.createRadialGradient(gx - r, Y(-70), 0, gx - r, Y(-70), 190 * z); g.addColorStop(0, css([255, 220, 150], .4 * door)); g.addColorStop(1, css([255, 220, 150], 0)); c.fillStyle = g; c.fillRect(gx - 220 * z, Y(-260), 440 * z, 280 * z); }
      c.fillStyle = css([190, 184, 170]); c.fillRect(gx - 34 * z, Y(-170), 68 * z, 13 * z); c.fillStyle = css([70, 66, 66], .8); for (let i = 0; i < 7; i++) c.fillRect(gx + (-29 + i * 8.6) * z, Y(-165), (4 + (i * 7) % 3) * z, 1.6 * z);
      for (let i = 0; i < knocks; i++) { const q = clamp((knockT - i * 0) / 40); if (i === knocks - 1 && q < 1) { c.strokeStyle = css([255, 236, 190], .7 * (1 - q)); c.lineWidth = 2; c.beginPath(); c.arc(gx, Y(-70), (10 + 46 * q) * z, 0, 7); c.stroke(); } }
    }
    // the road under everyone's feet
    { const g = c.createLinearGradient(0, Y(0), 0, VH); const rc = mix([44, 44, 46], [22, 22, 30], dark); g.addColorStop(0, css(mix(rc, [120, 116, 100], .25))); g.addColorStop(.08, css(rc)); g.addColorStop(1, css(mix(rc, [0, 0, 0], .35))); c.fillStyle = g; c.fillRect(0, Y(0), VW, VH - Y(0)); }
    // the people (in the world's own units)
    c.save(); c.translate(VW / 2 - cx * z, wl); c.scale(z, z);
    const tint = mix([122, 118, 122], [78, 72, 82], dark), fl = Math.min(1, flash) * dark, tintF = mix(tint, [255, 170, 110], fl * .35);
    if (evan && EVS.ready) { TALKM = talkMove(E); foot(c, EV_X, evan.a); figure(c, 'evan', EVS[Math.floor(G.t * .2) % EVS_META.frames], EVS_META, EV_X, 1, tintF, smooth(.25, 1, evan.a)); TALKM = null; }
    if (wise && OBS.ready) {
      const wt = mix([168, 150, 132], [120, 104, 100], dark); TALKM = talkMove(WW); foot(c, wise.x, wise.alpha);
      const wim = OBS[Math.floor(wise.anim) % OBS.length];
      if (OBS_ST && wise.st > 0) { figure(c, 'wst', OBS_ST, OBS_ST_META, wise.x, -1, wt, wise.alpha * smooth(0, .6, wise.st), breath(2)); figure(c, 'wis', wim, OBS_META, wise.x, -1, wt, wise.alpha * (1 - smooth(.4, 1, wise.st))); }
      else figure(c, 'wis', wim, OBS_META, wise.x, -1, wt, wise.alpha);
      TALKM = null;
    }
    drawChr(c, tintF);
    c.restore();
    // the smoke Evangelist comes out of
    if (evan && evan.a < 1) { const ex = X(EV_X - 30), ey = Y(-90), a = Math.sin(Math.PI * clamp(evan.a * 1.1)) * .8 + (1 - evan.a) * .0; c.globalAlpha = a; for (let i = 0; i < 3; i++) c.drawImage(SMOKE, ex - (200 + i * 40) * z + 30 * Math.sin(G.t / 90 + i), ey - (110 - i * 30) * z, 400 * z, 200 * z); c.globalAlpha = 1; }
    // the flash over everything, the veil of mist between the hill and the gate, the burned edges
    if (flash > .02) { c.fillStyle = css([255, 150, 80], .16 * Math.min(1, flash)); c.fillRect(0, 0, VW, VH); }
    if (veil > .003) { c.fillStyle = css(mix([226, 222, 214], [150, 146, 150], dark), smooth(0, 1, veil)); c.fillRect(0, 0, VW, VH); }
    { const g = c.createRadialGradient(VW * .5, VH * .5, VH * .42, VW * .5, VH * .5, VW * .78); g.addColorStop(0, 'rgba(12,12,18,0)'); g.addColorStop(1, css([12, 12, 18], .42 + .2 * dark)); c.fillStyle = g; c.fillRect(0, 0, VW, VH); }
    // touches, the ring that shows where to touch, the things he carries
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2; for (const k of [0, .5]) { const q = (G.t / 80 + k) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, 14 + q * 40, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    if (HL.on) drawItems();
  }

  // for testing: HL.peek() tells where the story is
  return { on: false, show: false, title, start, update, draw, touch, key, preload, lines: ALL, peek: () => ({ ph, x: Math.round(C3.x), dark: +dark.toFixed(2), wise: wise && wise.mode, evan: evan && +evan.a.toFixed(2), knocks, cam: { ...cam } }) };
})();
