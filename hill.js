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
  const PH = .3, HS = 1.35, HILL_A = STILL + 330, HILL_Y = -60;      // the hill: how much it slides with the camera, the place on the road it stands beside, its foot above the road line
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
    [WW, 'In the way you are going, you are like to meet with weariness, painfulness, hunger, perils, lions, dragons, darkness, and what not!'],
    [C, 'Sir, this burden upon my back is more terrible to me than all these things.'],
    [WW, 'In that village, named Morality, there lives a gentleman whose name is Legality. He has skill to help men off with such burdens as yours.'],
    [N, 'Now Christian stood a while in doubt. But soon he thought: if what this gentleman says is true, my wisest course is to take his advice.'],      // {44}
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
    [N, 'Here he sweated, and shook for fear.'],
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
    [N, 'Then Christian cried out, and called himself a thousand fools for listening to his counsel.'],      // {58}
    [C, 'Sir, what do you think? Is there hope? May I now go back, and go up to the wicket-gate? I am sorry I listened to this man. But may my sin be forgiven?'],      // {59}
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
  let HILL = null, SMOKE = null, CLOUD = null, TOWN = null; const CRACKS = [], STONES = [], SEAMS = [], PUFF = [];
  // the hill's outline: h = height above its foot, 0 to TOP; its left side hangs far out over the way
  const TOP = 520, HW = 1500, HH = 640, HOX = 300, HOY = 610;      // the baked picture's size and where the foot's left end lies in it
  const FACE = [[0, 0], [36, -30], [84, -62], [112, -44], [150, -70], [240, -138], [320, -182], [358, -176], [420, -116], [480, -44], [520, 36]];      // a second, lower overhang under the great one
  function faceX(h) { let i = 0; while (i + 2 < FACE.length && FACE[i + 1][0] <= h) i++; const [h0, x0] = FACE[i], [h1, x1] = FACE[i + 1]; return lerp(x0, x1, clamp((h - h0) / (h1 - h0))) + (nz(h * .03, 2) - .5) * 26 * smooth(0, 60, h); }
  const backX = h => 96 + 330 * Math.pow(1 - h / TOP, 1.2) + 560 * Math.pow(1 - h / TOP, 3.2) + (nz(h * .022, 9) - .5) * 64 * smooth(0, 50, h) + (nz(h * .09, 14) - .5) * 22 + 46 * smooth(330, 290, h) * smooth(210, 290, h) + 34 * smooth(170, 140, h) * smooth(90, 140, h);      // the long slope: shoulders, buttresses, a rough skyline
  function build() {
    if (built) return; built = true;
    // the hill, twice: in the fair day's far blue-grey, and nearly black under its own cloud
    HILL = [[94, 100, 118], [24, 22, 30]].map(col => {
      const c = mk(HW, HH), k = c.getContext('2d'); k.translate(HOX, HOY);
      k.beginPath(); k.moveTo(-8, 12);
      for (let h = 0; h <= TOP; h += 6) k.lineTo(faceX(h), -h);
      for (const [sx, sy] of [[46, -529], [60, -524], [72, -537], [86, -527]]) k.lineTo(sx, sy);      // a broken summit (lost in its cloud)
      for (let h = TOP; h >= 0; h -= 6) k.lineTo(backX(h), -h);
      k.lineTo(backX(0) + 30, 12); k.closePath();
      // rocks that have fallen from the overhang lie at its foot
      { const Rr = rngS(23); for (const [bx, bw] of [[-236, 16], [-150, 30], [-128, 12], [-62, 44], [-20, 20]]) { const bh = bw * (.45 + Rr() * .25); k.moveTo(bx - bw / 2, 12); k.lineTo(bx - bw * .42, -bh * .6); k.lineTo(bx - bw * .1, -bh); k.lineTo(bx + bw * .3, -bh * .8); k.lineTo(bx + bw / 2, 12); k.closePath(); } }
      const g = k.createLinearGradient(0, -TOP, 0, 0); g.addColorStop(0, css(col)); g.addColorStop(1, css(mix(col, [150, 150, 150], .1))); k.fillStyle = g; k.fill();
      // a few faint ledges across the face, so it reads as rock
      k.save(); k.clip(); k.fillStyle = css(mix(col, [0, 0, 0], .22)); k.beginPath(); k.moveTo(40, 14); for (let h = 0; h <= 330; h += 6) k.lineTo(150 + 150 * Math.pow(h / 330, .7) - 60 * smooth(200, 330, h) + (nz(h * .04, 21) - .5) * 30, -h); for (let h = 330; h >= 0; h -= 6) k.lineTo(330 + 420 * Math.pow(1 - h / 330, 1.6) + (nz(h * .05, 25) - .5) * 26, -h); k.lineTo(800, 14); k.fill(); k.strokeStyle = css(mix(col, [255, 255, 255], .5), .1); k.lineWidth = 2;
      for (let i = 0; i < 9; i++) { const h = 40 + i * 52; k.beginPath(); for (let x = -200; x <= 1100; x += 20) { const y = -h - (nz(x * .01, i) - .5) * 40 - x * .06; x === -200 ? k.moveTo(x, y) : k.lineTo(x, y); } k.stroke(); }
      k.restore(); return c;
    });
    // the cracks that the fire shows in (in the hill's own units, from its foot's left end)
    const R = rngS(11);
    for (const [dx, h1, sd] of [[52, 130, 5], [96, 310, 9]]) { const seam = []; for (let h = TOP - 4; h >= h1; h -= 9) { const u = (TOP - h) / (TOP - h1); seam.push([faceX(h) + dx * Math.min(1, u * 3 + .25) + 70 * u * (1 - u) + (nz(h * .06, sd) - .5) * 22 * Math.min(1, u * 4), -h]); } SEAMS.push([seam, seam.length]); }
    for (let i = 0; i < 6; i++) { let x = -90 + R() * 200, y = -(150 + R() * 280); const p = [[x, y]]; for (let j = 0; j < 9; j++) { x += (R() - .4) * 30; y += 14 + R() * 22; if (y > -20) break; p.push([x, y]); } CRACKS.push(p); }
    // smoke and cloud: soft shapes from noise (white, laid in light or dark)
    const cloud = (w, h, seed, thr, sx, sy) => { const c = mk(w, h), k = c.getContext('2d'), im = k.createImageData(w, h), n = noise2(seed);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const e = Math.sin(Math.PI * y / h) * Math.min(1, x / 30, (w - x) / 30), v = smooth(thr, thr + .22, n(x * sx, y * sy)) * e; const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = 255 * v; }
      k.putImageData(im, 0, 0); return c; };
    SMOKE = cloud(240, 80, 5, .4, .022, .05); CLOUD = cloud(400, 90, 31, .46, .014, .045);
    // billows of smoke: three soft round shapes, each baked dark and again as the light the fire lays on its underside
    for (const seed of [5, 17, 29]) { const base = mk(160, 160), b2 = base.getContext('2d'), Rp = rngS(seed);
      for (let j = 0; j < 8; j++) { const an = Rp() * 6.283, d = j ? 22 + Rp() * 22 : 0, r = j ? 30 + Rp() * 18 : 50, x = 80 + Math.cos(an) * d, y = 80 + Math.sin(an) * d * .8, g = b2.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.8)'); g.addColorStop(.55, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); b2.fillStyle = g; b2.fillRect(x - r, y - r, 2 * r, 2 * r); }
      const tinted = fill => { const c2 = mk(160, 160), k2 = c2.getContext('2d'); k2.drawImage(base, 0, 0); k2.globalCompositeOperation = 'source-in'; k2.fillStyle = fill(k2); k2.fillRect(0, 0, 160, 160); return c2; };
      PUFF.push({ d: tinted(() => 'rgb(62,46,50)'), l: tinted(k2 => { const g = k2.createLinearGradient(130, 150, 60, 60); g.addColorStop(0, 'rgba(255,200,146,1)'); g.addColorStop(.5, 'rgba(240,150,100,.35)'); g.addColorStop(1, 'rgba(220,120,90,0)'); return g; }) }); }
    // the wall's stones by the wicket-gate: rough courses, no two stones alike (shown only where light falls)
    { const Rs = rngS(71); for (let y = 0; y < 330;) { const h = 30 + Rs() * 24; for (let x = GATE_X - 560 - Rs() * 60; x < GATE_X + 560;) { const w = 44 + Rs() * 80; STONES.push({ x, y, w, h, t: Rs(), j: Rs() }); x += w; } y += h; } }
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
  let bolt = null; const embers = [];
  function tintSmoke() { if (tintC.smoke) return; const tc = tintC.smoke = mk(SMOKE.width, SMOKE.height), t = tc.getContext('2d'); t.drawImage(SMOKE, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = 'rgb(255,120,50)'; t.fillRect(0, 0, tc.width, tc.height); }
  function fire(k = 1) { flash = Math.max(flash, k);
    { let x = -40 + Math.random() * 120, y = -260 - Math.random() * 120; bolt = [[x, y]]; while (y < 60) { x += (Math.random() - .62) * 70; y += 22 + Math.random() * 40; bolt.push([x, y]); } } if (audio()) { sweep(64, 30, 1.8, .09 * k); hiss(190, .7, .11 * k, 1.6, 'lowpass'); hiss(900, 1, .03 * k, .5, 'bandpass', .05); } }
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
  function title() { build(); preload(); HL.show = true; reset0(); ph = 'title'; dark = 1; Object.assign(cam, { cx: STILL + 60, z: .42, wl: 399 }); }
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
    if (ph === 'title') { G.t % 14 || embers.push({ x: 20 + Math.random() * 70, y: 10 - Math.random() * 40, vx: -.25 - Math.random() * .5, vy: -.5 - Math.random() * .7, r: .8 + Math.random() * 1.3, h: Math.random(), t: 0, life: 140 + Math.random() * 160 }); for (const e of embers) { e.t++; e.x += e.vx; e.y += e.vy; } for (let i = embers.length - 1; i >= 0; i--) if (embers[i].t >= embers[i].life) embers.splice(i, 1); flashT--; if (flashT < 0) { fire(.5 + Math.random() * .4); flashT = 300 + Math.random() * 500; } flash *= .9; return; }
    const want = G.state === 'play' && (keys.r || held());
    if (C3.sd != null) C3.sd += .4;
    C3.faceA = clamp(C3.faceA + (C3.face - C3.faceA) * .06, -1, 1);
    if (C3.tv) { C3.tv.t += C3.tv.d * TURN_META.step * C3.tv.k; if (C3.tv.t >= TURN.length - 1 || C3.tv.t <= 0) { C3.face = C3.faceA = C3.tv.d; C3.tv = null; } }
    C3.wa = clamp(C3.wa + (C3.weep ? .05 : -.04)); if (C3.weep) C3.wt = Math.min(64, C3.wt + WEEP_META.step);
    flash *= .93; door += (doorTo - door) * .02; veil = clamp(veil + Math.sign(veilTo - veil) * .012);
    hintT++;
    if (dark > .4 && Math.random() < .13 * dark) embers.push({ x: 20 + Math.random() * 70, y: 10 - Math.random() * 40, vx: -.2 - Math.random() * .4, vy: -.35 - Math.random() * .5, r: .6 + Math.random() * .8, h: Math.random(), t: 0, life: 140 + Math.random() * 160 });
    for (const e of embers) { e.t++; e.x += e.vx + .3 * Math.sin((e.t + e.life) / 23); e.y += e.vy; } for (let i = embers.length - 1; i >= 0; i--) if (embers[i].t >= embers[i].life) embers.splice(i, 1);

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
    if (ph === 'aside') tz = lerp(1, .5, smooth(STILL - 1000, STILL - 100, C3.x));
    if (ph === 'still' || ph === 'come' || ph === 'evan') { tx = STILL + 60 - (ph === 'still' ? 0 : 50); tz = ph === 'evan' ? .6 : .4; }
    if (ph === 'back' || ph === 'mist') { tx = C3.x - 150; tz = lerp(1, .62, smooth(STILL - 900, STILL - 100, C3.x)); }
    if (ph === 'gate' || ph === 'knock' || ph === 'open') { tx = Math.min(C3.x + 150, GATE_X - 215); tz = lerp(1, .96, smooth(GATE_X - 500, GATE_STOP, C3.x)); }
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
    const top = mix(mix([124, 148, 176], [15, 14, 20], gateish), [32, 32, 44], dark), low = mix(mix([238, 226, 200], [50, 40, 40], gateish), [124, 94, 88], dark);
    { const g = c.createLinearGradient(0, 0, 0, hor); g.addColorStop(0, css(top)); g.addColorStop(1, css(low)); c.fillStyle = g; c.fillRect(0, 0, VW, hor + 2); }
    // clouds, pale by day and heavy near the hill
    { const off = ((cx * .05 + G.t * .02) % 800 + 800) % 800;
      for (let i = -1; i < 2; i++) { const x0 = i * 800 - off + 200;
        c.globalAlpha = .5 * (1 - dark) * (1 - .9 * gateish); c.drawImage(CLOUD, x0, 30, 800, 180);
        if (dark > .02) { c.globalAlpha = .55 * dark; c.globalCompositeOperation = 'multiply'; c.drawImage(CLOUD, x0 - 260, 0, 900, 230); c.globalCompositeOperation = 'source-over'; } }
      c.globalAlpha = 1; }
    // the far light: ahead of him on the plain; over the gate at the end. The hill, drawn after it, comes between.
    const lx = lerp(VW * .5, clamp(X(GATE_X), 200, VW - 120), gateish), ly = lerp(hor - 96, Y(-262), gateish), la = (1 - .35 * dark) * (1 - gateish);
    { const g = c.createRadialGradient(lx, ly, 0, lx, ly, 330); g.addColorStop(0, css([255, 236, 190], .85 * la)); g.addColorStop(.12, css([255, 222, 160], .5 * la)); g.addColorStop(.45, css([255, 214, 150], .16 * la)); g.addColorStop(1, css([255, 214, 150], 0));
      c.fillStyle = g; c.fillRect(lx - 330, ly - 330, 660, 660); c.fillStyle = css([255, 248, 226], la); c.beginPath(); c.arc(lx, ly, 7 + 1.2 * Math.sin(G.t / 40), 0, 7); c.fill(); }
    // the far ridge
    { const col = mix(mix(low, top, .45), [60, 52, 60], dark * .6); c.fillStyle = css(col); c.beginPath(); c.moveTo(0, hor + 2);
      for (let sx = 0; sx <= VW + 16; sx += 16) { const u = cx * .1 + (sx - VW / 2) / z; c.lineTo(sx, hor - (26 + 96 * nz(u * .0035, 5) + 22 * nz2(u * .02, 1)) * z * .8); }
      c.lineTo(VW, hor + 2); c.fill(); }
    // the plain, from the horizon down to the road
    { const far = mix(mix([176, 172, 140], [50, 48, 56], gateish), [78, 68, 70], dark), near = mix(mix([104, 108, 88], [24, 24, 32], gateish), [38, 36, 44], dark);
      const g = c.createLinearGradient(0, hor, 0, Y(0)); g.addColorStop(0, css(far)); g.addColorStop(1, css(near)); c.fillStyle = g; c.fillRect(0, hor, VW, Y(0) - hor + 1);
      // the village and the hill stand on the plain, further back
      const hx = VW / 2 + (HILL_A - cx) * PH * z, hy = Y(HILL_Y), k = z * HS;
      hillBox = [hx, hy, k];
      if (hx > -1300 * k && hx < VW + 400 * k) {
        // AWE FIRST (owner, build 135: "the burning hill can be frightening - but most importantly stunning - it should
        // awe first"). After John Martin's pictures of the sublime and the book's own Sinai (Exodus 19: fire at the top,
        // thick cloud, lightnings): the hill is far taller than the people, black against a fire that burns at its
        // summit inside a towering cloud; the fire lights the cloud from within, runs down the overhanging face as a
        // thin burning edge, and lies as a red sheen on the plain. A flash adds lightning in the cloud and fire in
        // the cracks. Everything grows with `dark` (0 far off on a fair day .. 1 beneath it).
        const sx0 = hx + 60 * k, sy0 = hy - TOP * k, burn = dark * (.72 + .18 * Math.sin(G.t / 53) + .1 * Math.sin(G.t / 17)), F = Math.min(1, flash);
        let flames = null;
        // the fire behind the summit: the hill is cut out black against it
        if (burn > .01) { c.save(); c.globalCompositeOperation = 'screen';
          const g = c.createRadialGradient(sx0, sy0 + 40 * k, 0, sx0, sy0 + 40 * k, 620 * k); g.addColorStop(0, css([255, 224, 176], .8 * burn)); g.addColorStop(.12, css([246, 170, 110], .5 * burn)); g.addColorStop(.42, css([176, 92, 70], .24 * burn)); g.addColorStop(1, css([110, 50, 50], 0));
          c.fillStyle = g; c.fillRect(sx0 - 620 * k, sy0 - 580 * k, 1240 * k, 1240 * k); c.restore(); }
        // the hill: fair and far off at first, black under its own cloud when he stands by it
        const dx = hx - HOX * k, dy = hy - HOY * k;
        c.globalAlpha = 1; c.drawImage(HILL[0], dx, dy, HW * k, HH * k); if (dark > .01) { c.globalAlpha = dark; c.drawImage(HILL[1], dx, dy, HW * k, HH * k); c.globalAlpha = 1; }
        // the burning edge down the overhanging face, and fire in the cracks when it flashes
        c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = c.lineJoin = 'round';
        if (burn > .01 || F > .02) {
          for (const [w, al, col] of [[6, .08, [236, 150, 84]], [1.6, .3, [255, 210, 150]]]) { c.strokeStyle = css(col, Math.min(1, al * (burn + 1.2 * F))); c.lineWidth = w * k; c.beginPath();
            for (let h = 150; h <= TOP; h += 10) { const px = hx + (faceX(h) + 2) * k, py = hy - h * k; h === 150 ? c.moveTo(px, py) : c.lineTo(px, py); } c.stroke(); } }
        // THE FIRE, WITH RESTRAINT (owner, build 145: "more subtle and nuanced and beautiful and awe inspiring in its
        // balance and restraint, like a good artist, not video game punch in the gut"). The fire itself is hardly
        // seen: what is seen is its LIGHT. One slender pillar of light stands on the summit and is lost in the
        // cloud; one seam of fire runs down from that same source inside the overhang and dies away; the cloud is
        // lit from within. No tongues of flame, no scattered burning cracks. A flash only makes these brighter.
        if (burn > .01) {
          // the pillar: soft lights along a slowly wavering line, widest and brightest at its foot
          // MORE FIRE, IN GOLD (owner, build 147: "I do want more fire ... just not the intense video game red").
          // A real fire stands on the summit now, but painted soft: a bright heart, and five strands of flame of
          // different heights, each a chain of soft lights along its own wavering line (no hard-edged tongues),
          // leaning with the wind into the smoke. White-gold at the heart, gold, then amber; nothing redder.
          { const hb = (80 + 10 * Math.sin(G.t / 9) + 6 * Math.sin(G.t / 3.7)) * k, hxm = sx0 - 4 * k, hym = sy0 + 4 * k, g = c.createRadialGradient(hxm, hym, 0, hxm, hym, hb); g.addColorStop(0, css([255, 240, 206], .32 * burn)); g.addColorStop(.3, css([255, 204, 128], .2 * burn)); g.addColorStop(1, css([226, 150, 80], 0)); c.fillStyle = g; c.fillRect(hxm - hb, hym - hb, 2 * hb, 2 * hb); }
          flames = () => { for (let s = 0; s < 5; s++) { const bx = sx0 + (-30 + s * 12 + 5 * Math.sin(s * 4.1)) * k, hgt = [120, 210, 150, 250, 100][s] * (.8 + .5 * nz(G.t * .011 + s * 9.3, 30 + s)) * k, n = 15;
            for (let i = 0; i < n; i++) { const u = i / (n - 1), wob = (nz(G.t * .016 + u * 2.1 + s * 5, 12 + s) - .5) * 70 * u * k, px = bx + wob - 60 * u * u * k, py = sy0 + 8 * k - hgt * u, rr = (30 - 19 * u) * k, al = (.26 * Math.pow(1 - u, 1.1) + .02) * (burn + .8 * F);
              const g = c.createRadialGradient(px, py, 0, px, py, rr); g.addColorStop(0, css([255, 240, 204], al)); g.addColorStop(.5, css([255, 200, 120], al * .5)); g.addColorStop(1, css([224, 146, 78], 0)); c.fillStyle = g; c.fillRect(px - rr, py - rr, 2 * rr, 2 * rr); } } };
          // the seam: fire from the same source, running down inside the overhang, thinning and dying away
          for (const [seam, len] of SEAMS) for (let j = 1; j < seam.length; j++) { const u = j / len, fade = (1 - u) * (1 - u), breathe = .62 + .38 * Math.sin(G.t / 61 - u * 5), al = fade * breathe * (burn * 1.4 + F);
            if (al < .02) continue; const [x0, y0] = seam[j - 1], [x1, y1] = seam[j];
            for (const [w, a2, col] of [[7 * fade + 2, .14, [240, 150, 78]], [1.1 + 2 * fade, .85, [255, 222, 160]]]) { c.strokeStyle = css(col, Math.min(1, a2 * al)); c.lineWidth = w * k; c.beginPath(); c.moveTo(hx + x0 * k, hy + y0 * k); c.lineTo(hx + x1 * k, hy + y1 * k); c.stroke(); } }
        }
        if (F > .02) { const g = c.createRadialGradient(sx0, sy0, 0, sx0, sy0, 420 * k); g.addColorStop(0, css([255, 190, 120], .22 * F)); g.addColorStop(1, css([255, 150, 90], 0)); c.fillStyle = g; c.fillRect(sx0 - 420 * k, sy0 - 420 * k, 840 * k, 840 * k); }
        c.restore();
        // the village of Morality, at the hill's long foot on its far side
        const tx = hx + 560 * k, ty = hy + 2 * z, tw = 480 * z, th = 84 * z;
        { const tc = tintC.town || (tintC.town = mk(400, 70)), t = tc.getContext('2d'); t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, 400, 70); t.drawImage(TOWN, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = css(mix(mix(far, top, .4), [46, 42, 50], dark * .7)); t.fillRect(0, 0, 400, 70); c.drawImage(tc, tx, ty - th, tw, th); }
        for (const [wx, wy] of TOWN.lit) { c.fillStyle = css([255, 214, 140], .5 + .4 * dark); c.fillRect(tx + wx * tw / 400, ty - th + wy * th / 70, Math.max(1.5, 3.6 * z), Math.max(1.5, 3.6 * z)); }
        // the cloud on the summit: a towering column that leans with the wind and spreads, dark, lit from within
        if (dark > .02) { c.globalCompositeOperation = 'multiply'; c.globalAlpha = .8 * dark; c.drawImage(CLOUD, sx0 - 1500 * k, sy0 - 520 * k, 2300 * k, 520 * k); c.globalAlpha = .55 * dark; c.drawImage(CLOUD, sx0 - 700 * k, sy0 - 400 * k, 1700 * k, 380 * k); }
        // THE SMOKE IN THE SKY (owner, build 146, of the reference painting: "the red ... was too much but I did like
        // smoke in sky - that was cool"). A great slow plume: it rises from the summit, bends with the wind and
        // rolls away across the sky over his head, growing and thinning as it goes. Soft round billows, dark, the
        // near ones lit from beneath by the fire (amber, never red). Each billow travels the whole way in about a
        // minute and melts away at the end; the far ones are drawn first.
        { const N = 46, ps = [];
          for (let i = 0; i < N; i++) { const h1 = Math.sin(i * 12.9898) * 43758.5453, h2 = Math.sin(i * 78.233) * 12543.123; ps.push([(i / N + G.t / 3400) % 1, h1 - Math.floor(h1), h2 - Math.floor(h2), i]); }
          ps.sort((a, b) => b[0] - a[0]);
          for (const [u, r1, r2, i] of ps) { const rise = 1 - Math.pow(1 - u, 3), spread = (40 + 230 * u) * k, px = sx0 - (240 * u + 900 * u * u) * k + (r1 - .5) * spread, py = sy0 - (14 + 150 * rise - 60 * u * u) * k + (r2 - .5) * spread * .7, rr = (40 + 210 * u) * k * (.8 + .4 * r2), a = smooth(.03, .22, u) * (1 - smooth(.72, 1, u)), P = PUFF[i % 3];
            c.globalCompositeOperation = 'source-over'; c.globalAlpha = a * (.22 + .58 * dark); c.drawImage(P.d, px - rr, py - rr, 2 * rr, 2 * rr);
            const la = a * (burn * (.36 + .9 * Math.pow(1 - u, 2)) + F * .3 * (1 - u)); if (la > .01) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = la; c.drawImage(P.l, px - rr, py - rr, 2 * rr, 2 * rr); } } }
        c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
        if (flames) { c.save(); c.globalCompositeOperation = 'lighter'; flames(); c.restore(); }
        // lightning in the cloud, and sparks carried up
        c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = c.lineJoin = 'round';
        if (bolt && flash > .5) for (const [w, al] of [[7, .06], [1.2, .32]]) { c.strokeStyle = css([255, 240, 214], Math.min(1, al * flash)); c.lineWidth = w * k; c.beginPath(); bolt.forEach(([bx, by], j) => j ? c.lineTo(sx0 + bx * k, sy0 + by * k) : c.moveTo(sx0 + bx * k, sy0 + by * k)); c.stroke(); }
        for (const e of embers) { const al = Math.sin(Math.PI * e.t / e.life) * .9; c.fillStyle = css([255, 170 + 60 * e.h, 90], al); c.beginPath(); c.arc(sx0 + e.x * k, sy0 + e.y * k, Math.max(.7, e.r * k), 0, 7); c.fill(); }
        // the red sheen the fire lays on the plain
        if (burn > .01) { c.translate(hx - 120 * k, hy + 22 * z); c.scale(1, .1); const g = c.createRadialGradient(0, 0, 0, 0, 0, 640 * k); g.addColorStop(0, css([236, 130, 84], .2 * burn + .2 * F)); g.addColorStop(1, css([236, 130, 84], 0)); c.fillStyle = g; c.fillRect(-640 * k, -640 * k, 1280 * k, 1280 * k); }
        c.restore();
        // the field's haze at its foot, so it stands in the plain and not on it
        const fg = c.createLinearGradient(0, hy - 34 * k, 0, hy + 14 * k), fc = mix(far, near, clamp((hy - hor) / (Y(0) - hor)));
        fg.addColorStop(0, css(fc, 0)); fg.addColorStop(.7, css(fc, .9)); fg.addColorStop(1, css(fc, 1)); c.fillStyle = fg; c.fillRect(0, hy - 34 * k, VW, 48 * k);
      }
    }
    // the lone tree where the two ways cross
    if (OAKT) { const tx = VW / 2 + (MEET - 70 - cx) * .92 * z, h = 330 * z, w = h * OAKT.width / OAKT.height;
      if (tx > -w && tx < VW + w) { const tc = tintC.oak || (tintC.oak = mk(OAKT.width, OAKT.height)), t = tc.getContext('2d'); t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, tc.width, tc.height); t.drawImage(OAKT, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = css(mix([70, 78, 74], [30, 30, 38], dark)); t.fillRect(0, 0, tc.width, tc.height);
        c.drawImage(tc, tx - w / 2, Y(-12) - h + 6 * z, w, h); } }
    // THE WICKET-GATE, AFTER REMBRANDT (builds 139, 140). Owner on build 139: "I like light on gate - bricks not doing it
    // for me - something about the light - door: not a fan - mountains ... their elevation compared to wall is distracting
    // - need artistic analysis especially regarding composition - think Rembrandt". What was wrong, and the rule kept
    // now: (1) THREE lights fought (the far light in the sky, the lantern, the door): now ONE at a time: the lantern
    // alone until the door opens, then the light from within, which IS the far light he has followed; behind the wall
    // it only glows over the top. (2) The wall was a low band with the ridge showing just above it: two level lines,
    // one over the other. Now the wall is high and runs out of the picture both ways: most of the picture is one
    // warm darkness. (3) A grid of even bricks, all visible: now rough stones of every size that come out of the
    // dark only where the light reaches them, and are lost again. (4) The door was a black slot, then a hard yellow
    // slab: now a plank door in a deep stone arch, with iron straps and a ring, and it opens on a light with soft
    // edges that blooms outward. (5) The gate stands off-centre, in the right third; the lantern, his face and the
    // doorstep make one slanting line of light. Evening has come ("in process of time").
    const gateOn = X(GATE_X - 1300) < VW, gx = X(GATE_X), r = 30 * z, gy0 = Y(-120), lnx = gx - 58 * z, lny = Y(-150), flick = .86 + .1 * Math.sin(G.t / 7) + .04 * Math.sin(G.t / 2.3);
    if (gateOn) {
      const x0 = GATE_X - 1300, wtop = x => 300 + (nz(x * .012, 3) - .5) * 26 + (nz(x * .09, 6) - .5) * 8;
      const wallPath = () => { c.beginPath(); c.moveTo(X(x0), Y(2)); for (let x = x0; x <= GATE_X + 900; x += 14) c.lineTo(X(x), Y(-wtop(x) * smooth(x0, x0 + 500, x))); c.lineTo(X(GATE_X + 900), Y(2)); };
      const arch = (rr = r, y1 = gy0) => { c.beginPath(); c.moveTo(gx - rr, Y(1)); c.lineTo(gx - rr, y1); c.arc(gx, y1, rr, Math.PI, 0); c.lineTo(gx + rr, Y(1)); };
      // the far light, behind the wall: only its glow over the top
      { const gy = Y(-300), g = c.createRadialGradient(gx, gy, 0, gx, gy, 340 * z); g.addColorStop(0, css([255, 220, 160], .42 * gateish)); g.addColorStop(.35, css([230, 160, 100], .16 * gateish)); g.addColorStop(1, css([200, 120, 80], 0)); c.fillStyle = g; c.fillRect(gx - 340 * z, gy - 340 * z, 680 * z, 680 * z); }
      wallPath(); c.fillStyle = css([19, 16, 17]); c.fill();
      c.save(); wallPath(); c.clip();
      // the stones: each shows only as much as the light that reaches it
      const open = smooth(0, 1, door), dx0 = GATE_X - 30, lxw = GATE_X - 58;
      // (build 140's stones were each lit as a tile and read as bricks: the owner, again, "bricks not doing it for me".
      // The light is one soft pool on a rough surface; the stones are only faint differences in it, and dark joints.)
      c.globalCompositeOperation = 'lighter';
      { const g = c.createRadialGradient(lnx, lny, 0, lnx, lny, 260 * z); g.addColorStop(0, css([236, 170, 100], .5 * flick)); g.addColorStop(.35, css([190, 120, 66], .22 * flick)); g.addColorStop(1, css([150, 90, 50], 0)); c.fillStyle = g; c.fillRect(lnx - 260 * z, lny - 260 * z, 520 * z, 520 * z); }
      if (door > .01) { const bx = gx - r, by = Y(-76), rr = 430 * z, g = c.createRadialGradient(bx, by, 0, bx, by, rr); g.addColorStop(0, css([255, 214, 150], .62 * open)); g.addColorStop(.3, css([226, 150, 86], .3 * open)); g.addColorStop(1, css([170, 100, 56], 0)); c.fillStyle = g; c.fillRect(bx - rr, by - rr, 2 * rr, 2 * rr); }
      c.globalCompositeOperation = 'source-over';
      for (const s of STONES) { const cx2 = s.x + s.w / 2, cy2 = -(s.y + s.h / 2), l1 = Math.max(0, 1 - Math.hypot(cx2 - lxw, cy2 + 150) / 260), l2 = Math.max(0, 1 - Math.hypot(cx2 - dx0, (cy2 + 70) * .8) / 430);
        const a = Math.min(1, l1 * l1 * flick + l2 * l2 * 1.2 * open); if (a < .02) continue;
        c.fillStyle = s.t > .5 ? css([255, 226, 180], a * .16 * (s.t - .5)) : css([0, 0, 0], a * .5 * (.5 - s.t));
        c.fillRect(X(s.x), Y(-(s.y + s.h)), s.w * z, s.h * z);
        c.strokeStyle = css([8, 6, 6], a * (.3 + .3 * s.j)); c.lineWidth = 1 + s.j; c.beginPath(); c.moveTo(X(s.x) + s.j * 3, Y(-s.y)); c.lineTo(X(s.x + s.w) - s.t * 4, Y(-s.y) + (s.j - .5) * 2); c.lineTo(X(s.x + s.w), Y(-(s.y + s.h * (.4 + .6 * s.t)))); c.stroke(); }
      c.restore();
      // the deep arch: its stones catch the light on their inner edge
      arch(r + 9 * z, gy0); c.fillStyle = css([12, 10, 10]); c.fill();
      c.save(); c.lineWidth = 2.2 * z; c.strokeStyle = css([226, 170, 106], Math.min(1, .28 * flick + .5 * open)); c.beginPath(); c.moveTo(gx - r - 5 * z, Y(0)); c.lineTo(gx - r - 5 * z, gy0); c.arc(gx, gy0, r + 5 * z, Math.PI, 0); c.lineTo(gx + r + 5 * z, Y(0)); c.stroke(); c.restore();
      // the door: heavy planks, two iron straps, a ring
      arch(); c.fillStyle = css(mix([30, 21, 15], [70, 46, 28], .5 * flick)); c.fill();
      c.save(); arch(); c.clip();
      c.strokeStyle = css([10, 7, 6], .8); c.lineWidth = 1.2 * z; for (const d of [-.6, -.2, .2, .6]) { c.beginPath(); c.moveTo(gx + d * r, gy0 - r); c.lineTo(gx + d * r, Y(0)); c.stroke(); }
      c.fillStyle = css([12, 10, 10]); for (const yy of [-116, -38]) c.fillRect(gx - r, Y(yy), 2 * r, 6 * z);
      { const g = c.createLinearGradient(gx - r, 0, gx + r, 0); g.addColorStop(0, css([255, 190, 110], .22 * flick)); g.addColorStop(.6, css([255, 190, 110], 0)); c.fillStyle = g; c.fillRect(gx - r, gy0 - r, 2 * r, 160 * z); }
      c.strokeStyle = css([210, 160, 96], .8 * flick); c.lineWidth = 1.6 * z; c.beginPath(); c.arc(gx + 9 * z, Y(-76), 5 * z, 0, 7); c.stroke();
      // it opens inward on the light: soft-edged, brightest at the jamb
      if (door > .01) { const w = 2 * r * (.1 + .26 * open); const g = c.createLinearGradient(gx - r, 0, gx - r + w * 1.5, 0); g.addColorStop(0, css([255, 250, 232], 1)); g.addColorStop(.5, css([255, 218, 146], .96)); g.addColorStop(.8, css([250, 180, 100], .5)); g.addColorStop(1, css([240, 160, 90], 0)); c.fillStyle = g; c.fillRect(gx - r, gy0 - r, w * 1.5, r + 124 * z); }
      c.restore();
      if (door > .01) { c.save(); c.globalCompositeOperation = 'lighter'; const bx = gx - r * .6, by = Y(-78), rr = (70 + 230 * open) * z, g = c.createRadialGradient(bx, by, 0, bx, by, rr); g.addColorStop(0, css([255, 236, 190], .7 * open)); g.addColorStop(.3, css([255, 190, 110], .28 * open)); g.addColorStop(1, css([240, 150, 80], 0)); c.fillStyle = g; c.fillRect(bx - rr, by - rr, 2 * rr, 2 * rr); c.restore(); }
      // the writing on a stone over the gate, shown by the lantern
      c.fillStyle = css(mix([70, 54, 42], [222, 190, 142], .6 * flick)); c.fillRect(gx - 34 * z, Y(-178), 68 * z, 13 * z); c.fillStyle = css([36, 26, 22], .85); for (let i = 0; i < 7; i++) c.fillRect(gx + (-29 + i * 8.6) * z, Y(-173), (4 + (i * 7) % 3) * z, 1.6 * z);
      // the lantern on its iron bracket
      c.strokeStyle = css([8, 7, 7]); c.lineWidth = 1.6 * z; c.beginPath(); c.moveTo(lnx - 12 * z, lny - 16 * z); c.lineTo(lnx, lny - 16 * z); c.lineTo(lnx, lny - 8 * z); c.stroke();
      c.fillStyle = css([8, 7, 7]); c.fillRect(lnx - 5 * z, lny - 9 * z, 10 * z, 15 * z); c.fillStyle = css([255, 214, 140], .95 * flick); c.fillRect(lnx - 3.2 * z, lny - 6 * z, 6.4 * z, 10 * z);
      c.save(); c.globalCompositeOperation = 'lighter'; { const g = c.createRadialGradient(lnx, lny, 0, lnx, lny, 90 * z); g.addColorStop(0, css([255, 220, 160], .55 * flick)); g.addColorStop(1, css([255, 190, 110], 0)); c.fillStyle = g; c.fillRect(lnx - 90 * z, lny - 90 * z, 180 * z, 180 * z); } c.restore();
      for (let i = 0; i < knocks; i++) { const q = clamp(knockT / 40); if (i === knocks - 1 && q < 1) { c.strokeStyle = css([255, 236, 190], .7 * (1 - q)); c.lineWidth = 2; c.beginPath(); c.arc(gx, Y(-70), (10 + 46 * q) * z, 0, 7); c.stroke(); } }
    }
    // the road under everyone's feet
    { const g = c.createLinearGradient(0, Y(0), 0, VH); const rc = mix([44, 44, 46], [22, 22, 30], Math.max(dark, .9 * gateish)); g.addColorStop(0, css(mix(rc, [120, 116, 100], .25))); g.addColorStop(.08, css(rc)); g.addColorStop(1, css(mix(rc, [0, 0, 0], .35))); c.fillStyle = g; c.fillRect(0, Y(0), VW, VH - Y(0)); }
    // the lantern's and the open door's light lie in flat pools on the road
    if (gateOn) { c.save(); c.globalCompositeOperation = 'lighter';
      for (const [px, rr, al, col] of [[lnx + 10 * z, 230 * z, .26 * flick, [255, 170, 90]], [gx - 30 * z, 400 * z, .6 * door, [255, 208, 134]]]) { if (al < .01) continue; c.save(); c.translate(px, Y(5)); c.scale(1, .09); const g = c.createRadialGradient(0, 0, 0, 0, 0, rr); g.addColorStop(0, css(col, al)); g.addColorStop(1, css(col, 0)); c.fillStyle = g; c.fillRect(-rr, -rr, 2 * rr, 2 * rr); c.restore(); }
      c.restore(); }
    // the people (in the world's own units)
    c.save(); c.translate(VW / 2 - cx * z, wl); c.scale(z, z);
    const tint = mix([122, 118, 122], [78, 72, 82], dark), fl = Math.min(1, flash) * dark, lit = gateish * smooth(GATE_X - 330, GATE_X - 60, C3.x), tintF = mix(mix(mix(tint, [66, 62, 72], gateish), [255, 170, 110], fl * .35), [255, 188, 120], lit * (.3 + .4 * door));
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
    if (flash > .02) { c.fillStyle = css([255, 176, 120], .07 * Math.min(1, flash)); c.fillRect(0, 0, VW, VH); }
    if (veil > .003) { c.fillStyle = css(mix([226, 222, 214], [150, 146, 150], dark), smooth(0, 1, veil)); c.fillRect(0, 0, VW, VH); }
    { const g = c.createRadialGradient(VW * .5, VH * .5, VH * .42, VW * .5, VH * .5, VW * .78); g.addColorStop(0, 'rgba(12,12,18,0)'); g.addColorStop(1, css([12, 12, 18], .42 + .2 * dark + .22 * gateish)); c.fillStyle = g; c.fillRect(0, 0, VW, VH); }
    // touches, the ring that shows where to touch, the things he carries
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2; for (const k of [0, .5]) { const q = (G.t / 80 + k) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, 14 + q * 40, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    if (HL.on) drawItems();
  }

  // for testing: HL.peek() tells where the story is
  return { on: false, show: false, title, start, update, draw, touch, key, preload, lines: ALL, pt: k => k === 'hill' ? hillPt() : gatePt(), peek: () => ({ ph, x: Math.round(C3.x), stand: C3.sd != null, dark: +dark.toFixed(2), wise: wise && wise.mode, evan: evan && +evan.a.toFixed(2), knocks, cam: { ...cam } }) };
})();
