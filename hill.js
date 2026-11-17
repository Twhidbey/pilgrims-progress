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
  const ease5 = t => t * t * t * (t * (t * 6 - 15) + 10);

  // ---------- the places ----------
  const START = 0, MEET = 900, GATE_X = 9000, GATE_FROM = GATE_X - 640, GATE_STOP = GATE_X - 58;
  // INTO THE ROCKS (owner, build 185: "i don't like that hill looks initially - it looks fake ... after he decides to go
  // off path, pilgrim goes away from viewer and down the hill descending so his body disappear ... then scene shift to
  // him walking a mountain path rocky ... then when he reaches foot of mountain and narrator speaks we zoom out super
  // wide ... then back to zoomed in where evangelist meets him"; and "we need a surrounding of rockiness, not just
  // ground then big rock"). The hill is not seen at all until Wiseman points: the camera pans right across the plain
  // to it, far off (HILL_F, HSF). He turns aside, walks over a brow and down out of sight behind it (BROW0 to BROW1);
  // the picture goes dark and finds him on a stony path among crags (PATH0 to FOOT) that rise higher on every layer as
  // he goes; at the foot the camera pulls back to the whole mountain (HSN times the far hill's units: its foot's
  // left end at HX0), lightning at the widest, and comes back down to him for Evangelist.
  const BROW0 = MEET + 520, BROW1 = BROW0 + 300, PATH0 = 3000, FOOT = 4400, STILL = FOOT, HX0 = FOOT + 150;
  const PH = .3, HSF = .72, HILL_F = 4700, HILL_Y = -60, HSN = 8, VIL_W = 2400;      // the far hill: how much it slides with the camera, its place, its size; the mountain close to: its size
  const Z_NEAR = .8, Z_WIDE = .085;
  // the brow: the ground swells a little (crest, in road units) to CREST and falls away beyond it, out of sight
  const CREST = BROW0 + 70, crest = x => 52 * smooth(BROW0 - 330, CREST, x) * (1 - smooth(CREST + 30, CREST + 560, x));
  const EV_X = FOOT - 135;

  // ---------- the words: Bunyan's, shortened and made plain ----------
  const SEEN = [      // {37}
    [N, 'His name was Mr. Worldly Wiseman, from the great town of Carnal Policy, near Christian\'s own city.'],
  ];
  // build 175 (owner: say lines while walking): the greeting is said as the two come toward each other (GREET, captions
  // while he walks); the talk at the crossing begins with "Who sent you this way?"
  const GREET = [      // {38}
    [WW, 'How now, good fellow! Where are you going, with such a burden?'],
    [C, 'Sir, I am going to that little gate ahead. There I will be shown how to be rid of my heavy burden.'],
  ];
  const WISE = [      // {39} to {45}
    // THE WORLD ACTS OUT WHAT HE SAYS (owner, build 177: "the conversation with worldly wise lacks punch or interest
    // (kinda drags)"): a sweet, slightly too-sweet tune under his voice; the burden groans when he speaks of the
    // dangerous way; when he names the village, it glows warm on the plain far off and the camera drifts toward it
    // (`vil`), before the hill itself is shown
    [WW, 'Who sent you this way?', 0, () => sweet(0)],
    [C, 'A great and good man, called Evangelist.'],
    [WW, 'There is no more dangerous way in all the world! I see the mud of the Slough of Despond is on you already.', 0, () => { groan(); note(43, .045, 3.5); }],
    [WW, 'In that village, Morality, lives a gentleman named Legality. He can take burdens like yours away.', 0, () => { vilTo = 1; sweet(1); }],
    [C, 'Sir, which way is his house?'],
    [WW, 'Do you see that hill?', 'hill'],
    [WW, 'Go by that hill. The first house you come to is his.'],
  ];
  const TURNED = [[N, 'So Christian turned out of his way, to go to Mr. Legality\'s house for help.']];      // {46}
  const HIGH = [[N, 'But close to, the hill was so high, and hung so far over the way, that Christian was afraid it would fall on his head.']];
  const STOOD = [
    [N, 'Flashes of fire came out of the hill, and Christian was afraid he would be burned.', 0, () => { fire(1); }],
    [N, 'Now he was sorry he had listened to Mr. Worldly Wiseman.'],      // {47}
  ];
  const COMING = [];
  const EVANW = [      // {48} to {59}
    [E, 'What are you doing here, Christian?'],
    [E, 'Why have you turned aside so soon? You are out of the way.'],
    [C, 'Just after the Slough, I met a gentleman. He said a man in that village could take my burden off.'],
    [N, 'Then Christian fell down at his feet, crying:', 0, () => { C3.weep = true; C3.wt = 0; }],
    [C, 'Woe is me, for I am undone!'],
    [N, 'At the sight of this, Evangelist caught him by the right hand.', 0, () => { note(67, .04, 4); note(71, .035, 4, .12); mercyTo = 1; }],
    [E, 'All manner of sin shall be forgiven unto men. Be not faithless, but believing.'],
    [N, 'Then Christian revived a little, and stood up trembling.', 0, () => { C3.weep = false; }],
    [E, 'That man was Worldly Wiseman. Mr. Legality cannot free you from your burden. No one was ever freed by him.'],
    [C, 'Sir, is there hope? May I go back to the gate? I am sorry I listened to him. May I be forgiven?'],      // {59}
    [E, 'Your sin is very great. Yet the man at the gate will receive you, for he has goodwill for men.', 0, () => { calmTo = 1; }],
    [N, 'Then Evangelist gave him one smile, and bid him God-speed.'],
  ];
  const HASTE = [      // {59}
    [N, 'He hurried like one treading on forbidden ground, and did not feel safe until he was back on the right way.'],
  ];
  const ATGATE = [[N, 'So, in time, Christian got up to the gate. Now over the gate there was written: Knock, and it shall be opened unto you.']];
  const KNOCK = [      // {60}
    [N, 'He knocked, more than once or twice, saying:', 'knock'],
    [C, 'May I come in? Will he open to me, sorry as I am?'],
    [N, 'At last there came a grave person to the gate, named Good-will.', 0, () => { doorTo = 1; sfx.chord(); }],
  ];
  const ALL = [...SEEN, ...GREET, ...WISE, ...TURNED, ...HIGH, ...STOOD, ...COMING, ...EVANW, ...HASTE, ...ATGATE, ...KNOCK];

  // MR. WORLDLY WISEMAN'S OWN FIGURE (build 149): a walk from one video (37 frames, walking right like Obstinate's, so it
  // is drawn mirrored to come from the right) and a standing painting; until they load, Obstinate's pictures stand in.
  const WIS = [], WIS_META = { ax: 142, ground: 322, frames: 37, vpx: 5.4, rest: [2, 19] }, WIS_ST_META = { ax: 86, ground: 296 };
  let WIS_ST = null;
  // EVANGELIST WALKS UP TO HIM (build 156; book {47}: "Evangelist drew nearer and nearer"): a walk from one video
  // (39 frames, facing right; flat side view, both soles on one line: owner, "2d flat - NOT one leg higher than other").
  // He comes out of the plain's haze from the left and stops at EV_X, where his standing frames take over.
  // Without the pack he appears out of the smoke as before.
  const EVW = [], EVW_META = { ax: 210, ground: 476, frames: 39, vpx: 5.0, rest: [0, 20] }, EVW_V = EVW_META.vpx * CHR_K * .4, EV_FROM = 640;
  const wFig = () => WIS.ready ? { W: WIS, M: WIS_META, S: WIS_ST, SM: WIS_ST_META } : { W: OBS, M: OBS_META, S: OBS_ST, SM: OBS_ST_META };
  const WIS_V = WIS_META.vpx * CHR_K * .4;      // his video's own pace: 24 pictures a second, 60 ticks a second

  // ---------- state ----------
  let ph = 'plain', built = false, loading = null;
  const cam = { cx: 0, z: 1, wl: 440 };
  const C3 = { x: 0, face: 1, faceA: 1, anim: 12, sd: null, alpha: 1, run: 0, ranim: 0, weep: false, wt: 0, wa: 0, tv: null };
  // MERCY, AFTER REMBRANDT (build 159; agreed master for this moment: one warm light in a great dark). When Evangelist
  // takes him by the right hand a small warm light gathers on the two men and lies in a flat pool at their feet
  // (`mercy`), the only warm thing under the black hill; when he says the man at the gate will receive him, the
  // hill's fire sinks low and its flashes stop (`calm`). Both are ours, not the book's.
  let mercy = 0, mercyTo = 0, calm = 0, calmTo = 0;
  // THE HILL IS NOT SHOWN AT FIRST (owner, build 167: "Maybe don't show mountain at first, just some foothills, the reveal
  // will be cooler later"). `reveal` stays 0 across the plain and the talk: only foothills stand where it will be. At
  // "Do you see that hill?" the camera draws back and the hill comes out of the haze (about a second and a half).
  let reveal = 0, vil = 0, vilTo = 0;
  // stones and dust falling from the overhang when he stands beneath it (in the hill's own units, from its foot's
  // left end; y up is negative): each { x, y, vx, vy, r, t, dust }
  const ROCKS = [];
  function shed(n, k = 1) { for (let i = 0; i < n; i++) { const h = 40 + Math.random() * 100; ROCKS.push({ x: faceX(h) - 2, y: -h, vx: -(.2 + Math.random() * .7) * k, vy: Math.random() * .4, r: .8 + Math.random() * 2.4 * k, t: 0, s: Math.random() * 6 }); } }
  // the sweet tune of his counsel: a pretty phrase in the major that goes nowhere (k 1: fuller, with a chord)
  function sweet(k) { const M = k ? [67, 71, 74, 79, 76, 74] : [72, 76, 79, 76]; M.forEach((m, i) => note(m, .028 + .008 * k, 2.4, i * .42)); if (k) [55, 59, 62].forEach(m => note(m, .02, 4.5, .1)); }
  // the burden groans: two heavy creaks of the pack
  function groan() { if (!audio()) return; sfx.step(false, 2.6); setTimeout(() => HL.on && sfx.step(false, 2.2), 520); }
  let wise = null, evan = null, dark = 0, hope = 0, flash = 0, flashT = 0, veil = 0, veilTo = 0, knocks = 0, knockT = 0, door = 0, doorTo = 0;
  let greeted = false, saidSeen = false, saidHigh = false, stillT = 0, hasteSaid = false, gateSaid = false, hintT = 0, noteI = 0, noteX = 0, lastFr = 0, hillSeen = false;
  let OAKT = null, hillBox = [0, 0, 1];
  // the scene shift (`cut`: the picture goes dark, 0 .. 1) and the great pull back at the foot (`Zw`: 0 close .. 1 the
  // whole mountain; `zs` its stage: 'out', 'hold', 'in', 'done')
  let cut = 0, cutTo = 0, Zw = 0, zs = '', zT = 0;

  // ---------- pictures baked once ----------
  let CLOUDW = null, CLOUDG = null;
  let HILL = null, SMOKE = null, CLOUD = null, TOWN = null; const CRACKS = [], STONES = [], SEAMS = [], PUFF = [];
  // the hill's outline: h = height above its foot, 0 to TOP; its left side hangs far out over the way
  const TOP = 520, HW = 1500, HH = 640, HOX = 300, HOY = 610;      // the baked picture's size and where the foot's left end lies in it
  const FACE = [[0, 0], [36, -30], [84, -62], [112, -44], [150, -70], [240, -138], [320, -182], [358, -176], [420, -116], [480, -44], [520, 36]];      // a second, lower overhang under the great one
  function faceX(h) { let i = 0; while (i + 2 < FACE.length && FACE[i + 1][0] <= h) i++; const [h0, x0] = FACE[i], [h1, x1] = FACE[i + 1]; return lerp(x0, x1, clamp((h - h0) / (h1 - h0))) + (nz(h * .03, 2) - .5) * 26 * smooth(0, 60, h); }
  const backX = h => 96 + 330 * Math.pow(1 - h / TOP, 1.2) + 560 * Math.pow(1 - h / TOP, 3.2) + (nz(h * .022, 9) - .5) * 64 * smooth(0, 50, h) + (nz(h * .09, 14) - .5) * 22 + 46 * smooth(330, 290, h) * smooth(210, 290, h) + 34 * smooth(170, 140, h) * smooth(90, 140, h);      // the long slope: shoulders, buttresses, a rough skyline
  function build() {
    if (built) return; built = true;
    // the hill, twice: in the fair day's far blue-grey, and nearly black under its own cloud
    // THE HILL FAR OFF, LIKE A GREAT MOUNTAIN SEEN ACROSS A PLAIN (owner, build 169: "Having it blue like hills far away
    // distant look right but I'm not sure what else to do? ... Maybe put some low fog to give it scale as it rises
    // above. I'm thinking like Mt Kilimanjaro"). What such a mountain looks like from far off: it stays the blue of
    // distance, but not one flat blue: deepest and clearest at the top, paling downward until its foot is lost in the
    // haze of the plain (so it seems to float); a little warm light on the side toward the low sun; and a long level
    // band of low cloud lying across its lower slopes, with the mountain rising clear above it. The cloud band and the
    // base haze are drawn in draw() (see "LOW CLOUD ACROSS ITS FOOT").
    // (build 171, owner: "blue doesn't look right": the far ridges keep the blue of distance, but the hill is a warm dusky
    // brown-grey, the colour of rock in evening light: it stands in front of those ridges, nearer and heavier than they)
    // ONE LIGHT, AND IT IS BEHIND EVERYTHING (owner, build 173: "Rock has sun behind it. Should it cast shadow and be more
    // dark? Think about any big picture things like this"). The low sun stands at the horizon in the middle of the
    // picture, beyond the tree, the men and the hill. So on the fair day: everything between us and it is DARK with a
    // bright edge toward it (the oak, the people, and now the hill: a darker dusky mass, no light on its face, a
    // bright rim down its sunward edge); the land is brightest far off, where the light skims it, and falls into
    // shadow toward us; shadows lie on our side of things, flat (the oak's shade, the hill's long shade on the plain).
    HILL = [[80, 68, 68], [24, 22, 30]].map((col, hi) => {
      const c = mk(HW, HH), k = c.getContext('2d'); k.translate(HOX, HOY);
      k.beginPath(); k.moveTo(-8, 12);
      for (let h = 0; h <= TOP; h += 6) k.lineTo(faceX(h), -h);
      for (const [sx, sy] of [[46, -529], [60, -524], [72, -537], [86, -527]]) k.lineTo(sx, sy);      // a broken summit (lost in its cloud)
      for (let h = TOP; h >= 0; h -= 6) k.lineTo(backX(h), -h);
      k.lineTo(backX(0) + 30, 12); k.closePath();
      // rocks that have fallen from the overhang lie at its foot
      { const Rr = rngS(23); for (const [bx, bw] of [[-236, 16], [-150, 30], [-128, 12], [-62, 44], [-20, 20]]) { const bh = bw * (.45 + Rr() * .25); k.moveTo(bx - bw / 2, 12); k.lineTo(bx - bw * .42, -bh * .6); k.lineTo(bx - bw * .1, -bh); k.lineTo(bx + bw * .3, -bh * .8); k.lineTo(bx + bw / 2, 12); k.closePath(); } }
      const g = k.createLinearGradient(0, -TOP, 0, 0); g.addColorStop(0, css(col)); if (hi === 0) { g.addColorStop(.5, css(mix(col, [150, 136, 128], .4))); g.addColorStop(1, css([184, 172, 158])); } else g.addColorStop(1, css(mix(col, [150, 150, 150], .1))); k.fillStyle = g; k.fill();
      if (hi === 0) { k.save(); k.clip(); k.lineJoin = k.lineCap = 'round'; for (const [w, a] of [[30, .06], [11, .13], [2.6, .42]]) { k.strokeStyle = 'rgba(255,222,172,' + a + ')'; k.lineWidth = w; k.beginPath(); k.moveTo(faceX(0), 0); for (let h = 6; h <= TOP; h += 6) k.lineTo(faceX(h), -h); for (const [sx, sy] of [[46, -529], [60, -524], [72, -537], [86, -527]]) k.lineTo(sx, sy); k.stroke(); } k.restore(); }
      // a few faint ledges across the face, so it reads as rock
      k.save(); k.clip(); k.fillStyle = css(mix(col, [0, 0, 0], .22), hi === 0 ? .5 : 1); k.beginPath(); k.moveTo(40, 14); for (let h = 0; h <= 330; h += 6) k.lineTo(150 + 150 * Math.pow(h / 330, .7) - 60 * smooth(200, 330, h) + (nz(h * .04, 21) - .5) * 30, -h); for (let h = 330; h >= 0; h -= 6) k.lineTo(330 + 420 * Math.pow(1 - h / 330, 1.6) + (nz(h * .05, 25) - .5) * 26, -h); k.lineTo(800, 14); k.fill(); k.strokeStyle = css(mix(col, [255, 255, 255], .5), .1); k.lineWidth = 2;
      for (let i = 0; i < 9; i++) { const h = 40 + i * 52; k.beginPath(); for (let x = -200; x <= 1100; x += 20) { const y = -h - (nz(x * .01, i) - .5) * 40 - x * .06; x === -200 ? k.moveTo(x, y) : k.lineTo(x, y); } k.stroke(); }
      k.restore(); return c;
    });
    // the cracks that the fire shows in (in the hill's own units, from its foot's left end)
    const R = rngS(11);
    // LINES OF FIRE DOWN THE ROCK (owner, build 157: "The lava lines were nice - more of those and glowing"). They all start
    // at the one light on the peak and run down the rock like slow streams: a few long ones, each throwing off short
    // branches; they wander, keep inside the rock, and thin as they go. Each has its own slow pulse of light.
    { const Rs = rngS(41), inside = (x, h) => Math.max(faceX(h) + 14, Math.min(backX(h) - 30, x));
      const run = (x, h, dir, h1, depth) => { const seam = [[x, -h]]; while (h > h1) { h -= 7 + Rs() * 7; dir += (Rs() - .5) * .5; dir *= .93; x = inside(x + dir * 9 + (Rs() - .5) * 7, h); seam.push([x, -h]);
          if (depth < 2 && Rs() < .11 && h > h1 + 50) run(x, h, dir + (Rs() < .5 ? -1.5 : 1.5), h - 40 - Rs() * 70, depth + 1); }
        SEAMS.push([seam, seam.length, Rs() * 60, depth]); };
      for (const [dir, h1] of [[-2.6, 150], [-1.5, 250], [-.7, 110], [.2, 300], [1.0, 200], [1.9, 330]]) run(58 + dir * 3, TOP - 4, dir, h1, 0); }
    for (let i = 0; i < 6; i++) { let x = -90 + R() * 200, y = -(150 + R() * 280); const p = [[x, y]]; for (let j = 0; j < 9; j++) { x += (R() - .4) * 30; y += 14 + R() * 22; if (y > -20) break; p.push([x, y]); } CRACKS.push(p); }
    // smoke and cloud: soft shapes from noise (white, laid in light or dark)
    const cloud = (w, h, seed, thr, sx, sy) => { const c = mk(w, h), k = c.getContext('2d'), im = k.createImageData(w, h), n = noise2(seed);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const e = Math.sin(Math.PI * y / h) * Math.min(1, x / 30, (w - x) / 30), v = smooth(thr, thr + .22, n(x * sx, y * sy)) * e; const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = 255 * v; }
      k.putImageData(im, 0, 0); return c; };
    SMOKE = cloud(240, 80, 5, .4, .022, .05); CLOUD = cloud(400, 90, 31, .46, .014, .045);
    { const tintOf = col => { const t = mk(CLOUD.width, CLOUD.height), q = t.getContext('2d'); q.drawImage(CLOUD, 0, 0); q.globalCompositeOperation = 'source-in'; q.fillStyle = col; q.fillRect(0, 0, t.width, t.height); return t; }; CLOUDW = tintOf('rgb(255,226,176)'); CLOUDG = tintOf('rgb(168,160,176)'); }
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
  // THE PAINTED OAK (build 163; owner: "maybe adjust how trunk interacts with ground to be more realistic - more detail on
  // trunk - can we have google image have a go at it?"). One picture from the image model (about 15 cents), given the
  // code-drawn oak as its shape: a gnarled trunk with a hollow, roots spreading into rough grass, the long limb
  // reaching right, feathery pads of leaves. assets/oak-leaf.webp, cut from its white paper. OAK_META: ax = the
  // trunk's middle, ground = the row that stands on the field's edge (the grass at its foot goes a little below, behind
  // the road), tw = sunlit leaves that twinkle. It is toned a little darker here to sit in the game's quiet tones,
  // and has an all-dark copy for when the sky darkens. Until it has loaded, the code-drawn oak (bakeOak) stands in.
  const OAK_META = { w: 662, h: 630, ax: 306.5, ground: 602, k: .86 };
  // OAK_SIL: how far the painting is pulled toward one dark tone (owner, build 165: "Tone it down to slightly more silhouette"): 0 = the painting, 1 = a flat silhouette
  const OAK_SIL = .8;
  let OAKP = null, oakLoading = null;
  // A DRAWN TREE ON THE PAINTING'S FORM (owner, build 166: "can you make it back into drawn tree using Google tree as
  // template (remove that branch that sticks way off to the right) and made it slightly bigger so it doesn't interfere
  // with heads of characters"). The painting (its long right limb taken out of the picture file) is only the
  // TEMPLATE: its outline gives the trunk, the roots in the grass and the boughs, laid in as one dark tone with a
  // faint trace of the bark; the leaves are then DRAWN over the crown as small touches in close dark olives,
  // lighter where the painting's own leaves were sunlit, and some of the lightest are kept to twinkle (tw).
  function loadOak() {
    if (!oakLoading) oakLoading = loadImg('oak-leaf.webp').then(im => { if (!im) return;
      const W = im.width, H = im.height, src = mk(W, H), sk = src.getContext('2d'); sk.drawImage(im, 0, 0);
      const px = sk.getImageData(0, 0, W, H).data, R = rngS(91), c = mk(W, H), k = c.getContext('2d'), tw = [];
      // the form: the painting's own shape in one dark tone, the bark and the roots showing through faintly
      k.drawImage(im, 0, 0); k.globalCompositeOperation = 'source-atop'; k.fillStyle = 'rgba(30,30,27,' + OAK_SIL + ')'; k.fillRect(0, 0, W, H);
      // its foot: the grass the painting put there is turned to the road's own dark earth, so the roots end in the ground
      { const g = k.createLinearGradient(0, OAK_META.ground - 26, 0, OAK_META.ground + 6); g.addColorStop(0, 'rgba(40,37,36,0)'); g.addColorStop(1, 'rgba(40,37,36,1)'); k.fillStyle = g; k.fillRect(0, OAK_META.ground - 26, W, H); }
      k.globalCompositeOperation = 'source-over';
      // the leaves, drawn: one small touch wherever the painting has a leaf (a jittered grid), toned by how light that leaf was
      for (let y = 3; y < H * .7; y += 5) for (let x = 3; x < W; x += 5) { const xx = Math.min(W - 1, Math.max(0, Math.round(x + (R() - .5) * 5))), yy = Math.round(y + (R() - .5) * 5), i = (yy * W + xx) * 4;
        if (px[i + 3] < 190) continue; const r = px[i], g = px[i + 1], b = px[i + 2]; if (g < b * 1.22 || r > g * 1.22) continue;
        const l = clamp(((r + g) / 2 - 46) / 105); if (R() < .12) continue;
        k.save(); k.translate(xx, yy); k.rotate(R() * 3.14); k.fillStyle = css(mix([30, 38, 29], [112, 112, 62], l * .62), .9); k.beginPath(); k.ellipse(0, 0, 2.3 + R() * 2.3, 1.3 + R() * 1.2, 0, 0, 7); k.fill(); k.restore();
        if (l > .55 && R() < .2 && tw.length < 320) tw.push([xx, yy]); }
      const d = mk(W, H), kd = d.getContext('2d'); kd.drawImage(c, 0, 0); kd.globalCompositeOperation = 'source-in'; kd.fillStyle = 'rgb(20,20,26)'; kd.fillRect(0, 0, W, H);
      // the trunk's bright edge toward the sun, one for each side (the sun passes from one side of it to the other as he walks)
      const rim = sgn => { const r = mk(W, H), q = r.getContext('2d'); q.drawImage(c, 0, 0); q.globalCompositeOperation = 'destination-out'; q.drawImage(c, -3 * sgn, 1); q.globalCompositeOperation = 'source-in'; q.fillStyle = 'rgb(255,224,168)'; q.fillRect(0, 0, W, H);
        q.globalCompositeOperation = 'destination-in'; const g = q.createLinearGradient(0, H * .52, 0, H * .66); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); q.fillStyle = g; q.fillRect(0, 0, W, H);
        q.globalCompositeOperation = 'destination-out'; const g2 = q.createLinearGradient(0, OAK_META.ground - 64, 0, OAK_META.ground - 34); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)'); q.fillStyle = g2; q.fillRect(0, OAK_META.ground - 64, W, H); return r; };
      OAKP = { c, d, tw, rimR: rim(1), rimL: rim(-1) }; }).catch(() => {});
    return oakLoading;
  }
  setTimeout(loadOak, 3500);
  // the oak in leaf, baked once: back leaves, the limbs, then the leaves toward us, lighter where the low sun reaches them
  let OAKL = null;
  function bakeOak() {
    const tree = SL.grow(27).map(p => p.map(([x, y, w]) => [-x, y, w])), R = rngS(77), pts = [];
    for (const p of tree) if (p[0][2] < 8) for (let i = 1; i < p.length; i += 2) pts.push([p[i][0], p[i][1]]);
    const step = Math.max(1, Math.floor(pts.length / 5200)), A = pts.filter((_, i) => i % step === 0);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, mx = 0, my = 0;
    for (const p of tree) for (const [x, y, w] of p) { x0 = Math.min(x0, x - w); x1 = Math.max(x1, x + w); y0 = Math.min(y0, y - w); y1 = Math.max(y1, y + w); }
    for (const [x, y] of A) { mx += x / A.length; my += y / A.length; }
    let rad = 1; for (const [x, y] of A) rad = Math.max(rad, Math.hypot(x - mx, y - my));
    x0 -= 26; x1 += 26; y0 -= 26; y1 += 8;
    const mkc = () => { const c = mk(Math.ceil(x1 - x0), Math.ceil(y1 - y0)), k = c.getContext('2d'); k.translate(-x0, -y0); return [c, k]; };
    const [c, k] = mkc(), [d, kd] = mkc();
    const dab = (g, x, y, r, col, al) => { g.save(); g.translate(x, y); g.rotate(R() * 3.14); g.fillStyle = css(col, al); g.beginPath(); g.ellipse(0, 0, r, r * .58, 0, 0, 7); g.fill(); g.restore(); };
    // THE CROWN, AS THE OLD MASTERS PAINTED TREES (owner, build 162: "Tree bigger, leaves slightly sparser more varied,
    // sunlight twinkling in leaves, think classic artistic rendering of tree from master painters"). After Claude
    // Lorrain, Constable and Corot: the foliage is not one mass but many separate feathery PADS at the ends of the
    // boughs, each a cloud of small touches, with sky between them and the limbs seen through; each pad is dark
    // beneath and a little lighter on the side of the low sun; the pads differ in size and depth of tone. All close
    // dark olive tones (never bright green). A few hundred of the sunlit touches are kept (tw) to twinkle.
    k.fillStyle = css([34, 28, 25]); SL.ribbons(k, tree);
    const tips = []; for (const p of tree) if (p[0][2] < 4.5 && p.length > 3) tips.push(p[p.length - 1]);
    const stepT = Math.max(1, Math.floor(tips.length / 190)), tw = [];
    tips.filter((_, i) => i % stepT === 0).forEach(([tx, ty]) => {
      if (R() < .07) return;
      const rx = 22 + R() * 34, ry = rx * (.46 + R() * .2), t = R(), n = 40 + Math.floor(R() * 70), px = tx + (R() - .5) * 16, py = ty + (R() - .5) * 12 - ry * .3;
      const base = mix([24, 32, 27], [52, 58, 38], t), ex = (px - mx) / rad, ey = (py - my) / rad, out = smooth(.3, 1, Math.hypot(ex, ey)), toSun = clamp(.45 + ex * .6 - ey * .4);
      for (let j = 0; j < n; j++) { const dx = (R() + R() + R() - 1.5) / 1.5 * rx * 1.25, dy = (R() + R() + R() - 1.5) / 1.5 * ry * 1.25, v = clamp(.5 + dx / rx * .45 - dy / ry * .65) * toSun * (.5 + .5 * out);
        dab(k, px + dx, py + dy, 2 + R() * 2.8, mix(base, [112, 114, 64], v * .5), .86 + .1 * R());
        if (v > .5 && R() < .16 && tw.length < 340) tw.push([px + dx, py + dy, R() * 6.283, 26 + R() * 60]); } });
    // a thin scatter of single leaves along the twigs, so the pads are joined to their boughs
    for (const [x, y] of A) if (R() < .1) dab(k, x + (R() - .5) * 10, y + (R() - .5) * 8, 1.8 + R() * 2, [30, 36, 29], .9);
    // the same shape all dark, to lay over it when the sky darkens
    kd.drawImage(c, x0, y0); kd.globalCompositeOperation = 'source-in'; kd.fillStyle = 'rgb(20,20,26)'; kd.fillRect(x0, y0, x1 - x0, y1 - y0);
    return { c, d, x0, y0, tw };
  }
  // THE PAINTED MOUNTAIN (owner, build 177: "the mountain cracks feel artificial. i need more realism"). One picture
  // from the image model (about 15 cents, right first time), painted over the code-drawn hill's own outline (given as
  // its template, so the breaking-wave shape is kept): dark fractured rock after John Martin, with fire glowing from
  // deep inside a few clefts. Cut into two layers: `hill-rock.webp` (the rock, the fire's glow taken out) and
  // `hill-fire.webp` (only the fire). The rock is toned twice (fair and far / dark under its cloud) into the same baked
  // pictures the code-drawn hill used (HILL, HW x HH, its foot's left end at HOX, HOY); the fire is laid on with
  // 'lighter', breathing, as strong as the hill burns (`LAVA`, `LAVAB` its soft bloom). The code-drawn seams and the
  // burning edge are no longer drawn once it has loaded. Until then the code-drawn hill stands in.
  let LAVA = null, LAVAB = null, HILLV = null;
  function paintHill(rock, fire) {
    // (build 183, owner: "Gotta increase resolution, no?": the painting was made again at the image model's highest
    // size, 6336 px wide, and kept at 3000 x 1280, twice the hill's own units, so the close-up and the summit stay
    // sharp on a phone; the baked hills take the picture's own size, R times the units)
    const R = rock.width / HW;
    HILL = [[[74, 62, 66], .74], [[22, 20, 26], .58]].map(([col, a]) => { const c = mk(HW * R, HH * R), k = c.getContext('2d'); k.drawImage(rock, 0, 0, HW * R, HH * R);
      k.globalCompositeOperation = 'source-atop'; k.globalAlpha = a; k.fillStyle = css(col); k.fillRect(0, 0, HW * R, HH * R); return c; });
    // the hill far off (build 185): the dark rock seen through the evening's air, its colours taken toward the sky behind
    // it at each height, and baked small so its edges and the painting's detail go soft, as a far mountain's do
    { const c = mk(HW / 3, HH / 3), k = c.getContext('2d'); k.drawImage(HILL[1], 0, 0, HW / 3, HH / 3); k.globalCompositeOperation = 'source-atop';
      const g = k.createLinearGradient(0, (HOY - TOP) / 3, 0, HOY / 3); g.addColorStop(0, 'rgba(112,112,134,.6)'); g.addColorStop(.6, 'rgba(150,132,138,.62)'); g.addColorStop(1, 'rgba(196,170,150,.78)'); k.fillStyle = g; k.fillRect(0, 0, HW, HH); HILLV = c; }
    if (fire) { LAVA = mk(HW, HH); LAVA.getContext('2d').drawImage(fire, 0, 0, HW, HH); LAVAB = mk(HW / 10, HH / 10); LAVAB.getContext('2d').drawImage(fire, 0, 0, HW / 10, HH / 10); }
  }
  function preload() {
    loadOak();
    if (!loading) loading = Promise.all([Promise.all([loadImg('hill-rock.webp'), loadImg('hill-fire.webp')]).then(([r, f]) => { if (r) { build(); paintHill(r, f); } }), loadPack('wiseman', WIS).catch(() => {}), loadPack('evangelist-walk', EVW).catch(() => {}), loadImg('wiseman-stand.webp').then(im => { if (im) WIS_ST = im; }), OBS.ready || loadPack('obstinate', OBS).catch(() => {}), EVS.ready || loadPack('evangelist-stand', EVS).catch(() => {}), RUNP.ready || loadPack('christian-run-plain', RUNP).catch(() => {}),
      WEEP.ready || loadPack('christian-weep', WEEP).catch(() => {}), TURN.ready || loadPack('christian-turn', TURN).then(() => bookLoaded('TURN')).catch(() => {}),
      OBS_ST ? 0 : loadImg('obstinate-stand.webp').then(im => { if (im && !OBS_ST) OBS_ST = im; }),
      loadImg('tree-a.webp').then(im => { if (!im) return; const c = mk(im.width, im.height), k = c.getContext('2d'); k.drawImage(im, 0, 0); k.globalCompositeOperation = 'source-in'; k.fillStyle = '#fff'; k.fillRect(0, 0, c.width, c.height); OAKT = c; })]).catch(() => {});
    return loading;
  }

  // one tinted figure, feet at world (x, 0) (each kind of figure has its own small canvas)
  // RIM: the low sun is behind the people (owner, build 172: "Characters should be darker matching tree also maybe outline
  // of glow from sun behind them"). RIM = { k: strength, x: where the light stands, in the world's units } while the
  // people are drawn; each figure then gets a thin warm edge on the side toward the light (the figure's own shape,
  // less the same shape moved a little toward the light: what is left is that edge).
  let RIM = null;
  const tintC = {};
  function figure(c, slot, im, meta, x, face, tint, alpha = 1, sy = 1) {
    if (!im || alpha <= .004) return;
    const fc = tintC[slot] || (tintC[slot] = mk(8, 8)); if (fc.width !== im.width || fc.height !== im.height) { fc.width = im.width; fc.height = im.height; }
    const f = fc.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, fc.width, fc.height);
    f.drawImage(im, 0, 0); f.globalCompositeOperation = 'multiply'; f.fillStyle = css(tint); f.fillRect(0, 0, im.width, im.height);
    f.globalCompositeOperation = 'destination-in'; f.drawImage(im, 0, 0); f.globalCompositeOperation = 'source-over';
    // LIGHT ON THE FIGURE (owner, build 177: the old warm edge "looks like a copy ... like i'm wearing 3d glasses or
    // things are out of focus. a more careful outline would be better"; and "the color of characters feels flat ...
    // less lifelike"). (1) The body is lit across: the side toward the low sun a little lighter and warmer, the far
    // side a little cooler, laid only on the figure (source-atop). (2) The rim is the figure's own outline, a hair thin,
    // only where the edge faces the sun or the sky above, brightest on the head and shoulders and gone by the knees,
    // with a soft bloom round it (the thin line drawn small and stretched up), so it reads as light wrapping round the
    // edge, not a second copy beside it.
    if (RIM && RIM.k > .02) {
      const W = im.width, H = im.height, dir = (RIM.x > x ? 1 : -1) * face;
      { const g = f.createLinearGradient(dir > 0 ? 0 : W, 0, dir > 0 ? W : 0, 0); g.addColorStop(0, 'rgba(70,84,110,' + (.16 * RIM.k) + ')'); g.addColorStop(.55, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(255,196,140,' + (.2 * RIM.k) + ')');
        f.globalCompositeOperation = 'source-atop'; f.fillStyle = g; f.fillRect(0, 0, W, H); }
      const rc = tintC._rim || (tintC._rim = mk(8, 8)); if (rc.width !== W || rc.height !== H) { rc.width = W; rc.height = H; }
      const r = rc.getContext('2d'); r.globalCompositeOperation = 'source-over'; r.clearRect(0, 0, W, H); r.drawImage(im, 0, 0);
      r.globalCompositeOperation = 'destination-out'; r.drawImage(im, -1.6 * dir, 1.3);
      r.globalCompositeOperation = 'source-in'; { const g = r.createLinearGradient(0, H * .05, 0, H * .72); g.addColorStop(0, 'rgba(255,232,186,1)'); g.addColorStop(.5, 'rgba(255,214,160,.55)'); g.addColorStop(1, 'rgba(255,200,150,0)'); r.fillStyle = g; } r.fillRect(0, 0, W, H);
      const bc = tintC._bloom || (tintC._bloom = mk(8, 8)); bc.width = Math.ceil(W / 5); bc.height = Math.ceil(H / 5); const b = bc.getContext('2d'); b.clearRect(0, 0, bc.width, bc.height); b.drawImage(rc, 0, 0, bc.width, bc.height);
      f.globalCompositeOperation = 'source-over'; f.globalAlpha = .85 * RIM.k; f.drawImage(rc, 0, 0); f.globalAlpha = 1;
      RIM.bloom = bc; }
    c.save(); c.globalAlpha = alpha; c.translate(x, 5); if (TALKM) c.transform(1, 0, TALKM.sh, 1, 0, 0);
    c.scale(face * CHR_K, CHR_K * sy * (TALKM ? TALKM.sy : 1)); c.drawImage(fc, -meta.ax, -meta.ground);
    if (RIM && RIM.bloom) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = alpha * .3 * RIM.k; c.drawImage(RIM.bloom, -meta.ax, -meta.ground, im.width, im.height); c.globalCompositeOperation = 'source-over'; RIM.bloom = null; }
    c.restore();
  }
  function foot(c, x, a = 1, rx = 46) { const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, 'rgba(6,8,14,.5)'); g.addColorStop(.6, 'rgba(6,8,14,.26)'); g.addColorStop(1, 'rgba(6,8,14,0)'); c.save(); c.translate(x, 4); c.scale(rx, 7); c.globalAlpha = a; c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore(); }

  // ---------- sound ----------
  // fire out of the hill: a flash and thunder (no words out of the mountain: left out for young children)
  let bolt = null; const embers = [];
  function tintSmoke() { if (tintC.smoke) return; const tc = tintC.smoke = mk(SMOKE.width, SMOKE.height), t = tc.getContext('2d'); t.drawImage(SMOKE, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = 'rgb(255,120,50)'; t.fillRect(0, 0, tc.width, tc.height); }
  function fire(k = 1) { flash = Math.max(flash, k); if (dark > .5 && HL.on) shed(3 + Math.floor(4 * k), 1);
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
    mercy = mercyTo = calm = calmTo = 0;
    wise = null; evan = null; dark = 0; hope = 0; flash = 0; flashT = 200; veil = 0; veilTo = 0; knocks = 0; knockT = 0; door = 0; doorTo = 0;
    reveal = 0; vil = vilTo = 0; ROCKS.length = 0; C3.dy = 0; cut = cutTo = 0; Zw = 0; zs = ''; zT = 0;
    saidSeen = saidHigh = hasteSaid = gateSaid = hillSeen = greeted = false; stillT = 0; hintT = 0; noteI = 0; noteX = 0;
  }
  // the picture behind the title page when Level 3 is the child's level: the hill hanging over the way, nobody there
  function title() { build(); preload(); HL.show = true; reset0(); ph = 'title'; dark = 1; reveal = 1; C3.x = FOOT; Object.assign(cam, { cx: FOOT + 2200, z: .1, wl: 480 }); }
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
    if (at === 'hill') { ph = 'path'; C3.x = PATH0; saidSeen = true; hillSeen = true; dark = .55; }
    if (at === 'evangelist') { ph = 'still'; C3.x = FOOT; saidSeen = saidHigh = true; dark = 1; stillT = 1e4; zs = 'done'; }
    if (at === 'gate') { ph = 'gate'; C3.x = GATE_FROM; saidSeen = true; hope = 1; }
    if (at) { cam.cx = C3.x + 150; reveal = 1; if (at !== 'gate') { cam.z = Z_NEAR; cam.wl = 440 - (1 - Z_NEAR) * 70; } }
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
    mercy += (mercyTo - mercy) * .012; calm += (calmTo - calm) * .008; if (ph === 'back' || ph === 'mist') mercyTo = 0;
    flash *= .93; door += (doorTo - door) * .02; cut = clamp(cut + Math.sign(cutTo - cut) * (cutTo ? .022 : .016)); veil = clamp(veil + Math.sign(veilTo - veil) * .012);
    hintT++;
    reveal = clamp(reveal + (G.act === 'hill' || (ph !== 'plain' && ph !== 'meet') ? .011 : 0)); vil += (vilTo - vil) * .02;
    if ((ph === 'still' || ph === 'come' || ph === 'evan') && dark > .5 && Math.random() < .035) shed(1, .7);
    for (const r of ROCKS) { r.t++; if (r.dust) continue; r.vy += .09; r.x += r.vx; r.y += r.vy; if (r.y >= 0) { r.y = 0; r.dust = 1; r.t = 0; } } for (let i = ROCKS.length - 1; i >= 0; i--) if (ROCKS[i].dust && ROCKS[i].t > 70) ROCKS.splice(i, 1);
    if (dark > .4 && Math.random() < .07 * dark) embers.push({ x: 20 + Math.random() * 70, y: 10 - Math.random() * 40, vx: -.2 - Math.random() * .4, vy: -.35 - Math.random() * .5, r: .6 + Math.random() * .8, h: Math.random(), t: 0, life: 140 + Math.random() * 160 });
    for (const e of embers) { e.t++; e.x += e.vx + .3 * Math.sin((e.t + e.life) / 23); e.y += e.vy; } for (let i = embers.length - 1; i >= 0; i--) if (embers[i].t >= embers[i].life) embers.splice(i, 1);

    if (ph === 'plain') {
      let v = want ? MAXV : 0; if (v && C3.x + v >= MEET) v = 0;
      v = walk(1, v);
      if (want) clearHint('walk'); else if (hintT === 400 && C3.x < START + 20) hint('walk', 'Hold to walk.');
      // build 149: Wiseman starts far enough off that he is seen coming across the field (before, he appeared already
      // past his meeting place and stood behind Christian's stopping place, so the two ended back to back)
      if (!saidSeen && C3.x > 220) { saidSeen = true; caption(SEEN); wise = { x: Math.max(cam.cx + VW / 2 / cam.z + 60, MEET + 508), anim: 0, mode: 'come', st: 0, alpha: 1 }; }
      if (wise && !greeted && wise.x - C3.x < 520) { greeted = true; caption(GREET); sweet(0); }
      if (wise && greeted && wise.mode === 'stand' && wise.st >= 1 && C3.x >= MEET - 30 && C3.sd != null && !saying()) { ph = 'meet'; talk(WISE, () => { ph = 'aside'; wise.mode = 'go'; hintT = 0; noteX = C3.x + 60; caption(TURNED); }); }
    } else if (ph === 'meet') {
      walk(1, 0);
    } else if (ph === 'aside') {
      // OVER THE BROW AND DOWN OUT OF SIGHT: past BROW0 the way falls away behind the near edge of the ground; he goes
      // down it, feet first, then his body, then his head (drawn lower by C3.dy, and the near ground drawn over him)
      let v = want ? MAXV * lerp(1, .8, smooth(BROW0, BROW1, C3.x)) : 0;
      v = walk(1, v);
      C3.dy = C3.x < CREST ? -crest(C3.x) : 175 * Math.pow(smooth(CREST, BROW1, C3.x), 1.3) - crest(CREST) * (1 - smooth(CREST, CREST + 60, C3.x));
      if (v && C3.x > noteX) { noteX = C3.x + 58 * 1.5; note(WRONG[noteI++ % WRONG.length], .04, 3.2); }
      if (!want && hintT === 500) hint('walk', 'Hold to walk.'); if (want) clearHint('walk');
      if (C3.x >= BROW1) { ph = 'down'; G.state = 'auto'; clearHint('walk'); cutTo = 1; }
    } else if (ph === 'down') {
      // the scene shifts: dark, and then the rocky path
      walk(1, 0);
      if (cut >= 1) { ph = 'path'; C3.x = PATH0; C3.dy = 0; C3.sd = QUIET[0]; Object.assign(cam, { cx: PATH0 + 150, z: Z_NEAR, wl: 440 - (1 - Z_NEAR) * 70 }); dark = .55; wise = null; cutTo = 0; noteX = PATH0 + 40;
        G.state = 'play'; hintT = 0; }
    } else if (ph === 'path') {
      // the rocky way: holding does less and less as the rock closes in
      const heavy = lerp(1, .5, smooth(FOOT - 700, FOOT - 20, C3.x));
      let v = want && cut < .3 ? MAXV * heavy : 0;
      v = walk(1, v, MAXV * heavy);
      if (v && C3.x > noteX) { noteX = C3.x + 58 * 1.5; note(WRONG[noteI++ % WRONG.length], .04, 3.2); }
      if (v && Math.random() < .012 * smooth(PATH0, FOOT, C3.x) && audio()) sweep(52 + Math.random() * 8, 34, 1.4, .05);
      if (!want && hintT === 400) hint('walk', 'Hold to walk.'); if (want) clearHint('walk');
      if (C3.x >= FOOT) { C3.x = FOOT; ph = 'still'; G.state = 'auto'; clearHint('walk'); stillT = 0; zs = ''; }
    } else if (ph === 'still') {
      walk(1, 0); stillT++;
      // AT THE FOOT, THE CAMERA PULLS BACK (owner, build 185: "we zoom out super wide (like one of those zooming out from
      // individual to city to world - fast but epic) and see entire mountain its is incredible glory with lightning ...
      // then back to zoomed in where evangelist meets him"). It starts slow, gathers speed and settles gently (about
      // three and a half seconds, eased in the scale's logarithm, so every moment of it shrinks the picture by the same
      // kind of step); lightning as it settles; it holds while the fire's line is said, then comes back down to him.
      if (stillT === 20 && !saidHigh) { saidHigh = true; caption(HIGH); caption(STOOD); }
      if (stillT > 9999) { stillT = 9999; zs = 'done'; }
      if (zs === '' && stillT >= 40) { zs = 'out'; zT = 0; }
      if (zs === 'out') { zT++; Zw = ease5(clamp(zT / 210)); if (zT === 196) fire(1.1); if (zT >= 210) { zs = 'hold'; zT = 0; } }
      else if (zs === 'hold') { zT++; const t = dlg.querySelector('.t').textContent; if (zT > 200 && C3.fired && !t.startsWith('Flashes of fire') && !t.startsWith('But close to')) { zs = 'in'; zT = 0; } }
      else if (zs === 'in') { zT++; Zw = 1 - ease5(clamp(zT / 170)); if (zT >= 170) { zs = 'done'; Zw = 0; } }
      // the lines' own happenings (captions carry no fn): the fire comes with its words
      if (dlg.querySelector('.t').textContent.startsWith('Flashes of fire came out of the hill') && !C3.fired) { C3.fired = true; fire(1); }
      if (zs === 'done' && !saying() && G.cap <= 0 && !G.capQ.length && C3.sd != null) { ph = 'come'; caption(COMING); evan = EVW.ready ? { a: 1, t: 0, x: EV_X - EV_FROM, anim: 0, walk: true, st: 0 } : { a: 0, t: 0 }; turnC(-1); }
    } else if (ph === 'come') {
      walk(1, 0);
      if (evan.walk) {
        if (evan.x < EV_X) { const v = Math.min(EVW_V, EV_X - evan.x); evan.x += v; evan.anim = stepAnim(evan.anim, v, EVW_META.vpx * CHR_K, EVW_META); }
        else { evan.anim = stepAnim(evan.anim, 0, EVW_META.vpx * CHR_K, EVW_META); if (EVW_META.rest.includes(Math.floor(evan.anim) % EVW_META.frames)) evan.walk = false; }
      } else if (evan.x != null) evan.st = clamp(evan.st + .04);
      else evan.a = clamp(evan.a + .006);
      if (evan.a >= 1 && (evan.x == null || (!evan.walk && evan.st >= 1)) && !C3.tv && !saying() && G.cap <= 0) { ph = 'evan'; talk(EVANW, () => { ph = 'back'; hintT = 0; }); }
    } else if (ph === 'evan') {
      walk(1, 0);
    } else if (ph === 'back') {
      // back with haste: he runs (his plain run from Level 1), to the place where he left the way
      let go = want && C3.x > PATH0 + 120;
      if (want && !hasteSaid) { hasteSaid = true; caption(HASTE); }
      if (go && RUNP.ready) { const st = RUNP_META.vpx * CHR_K; C3.x -= st * .4; C3.ranim += .4; C3.run = clamp(C3.run + .14); C3.sd = QUIET[0]; if (Math.floor(C3.ranim) % 14 === 0 && Math.floor(C3.ranim - .4) % 14 !== 0 && audio()) sfx.step(false, 1.3); }
      else { C3.run = clamp(C3.run - .1); if (go) walk(-1, MAXV); else if (C3.sd == null) walk(-1, 0); }
      if (want) clearHint('haste'); else if (hintT === 150) hint('haste', 'Hold to hurry back.');
      if (C3.x <= PATH0 + 120 && C3.run <= 0 && !saying() && G.cap <= 0) { ph = 'mist'; G.state = 'auto'; veilTo = 1; }
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
      const { M } = wFig(), v = WIS.ready ? WIS_V : 1.25, st = M.vpx * CHR_K;
      if (wise.mode === 'come') { if (wise.x > MEET + 135) { wise.x -= v; wise.anim = stepAnim(wise.anim, v, st, M); } else { wise.anim = stepAnim(wise.anim, 0, st, M); if (M.rest.includes(Math.floor(wise.anim) % M.frames)) wise.mode = 'stand'; } }
      else if (wise.mode === 'stand') wise.st = clamp(wise.st + .05);
      else if (wise.mode === 'go') { wise.st = clamp(wise.st - .06); if (wise.st <= 0) { wise.x -= v; wise.anim = stepAnim(wise.anim, v, st, M); wise.alpha = clamp((wise.x - (MEET - 760)) / 260); if (wise.alpha <= 0) wise = null; } }
    }

    // the sky darkens as he goes out of the way, and clears as he comes back; fire out of the hill while he stands under it
    const dTo = ph === 'aside' || ph === 'down' ? .35 * smooth(MEET + 150, BROW1, C3.x) : ph === 'path' ? lerp(.55, 1, smooth(PATH0, FOOT - 200, C3.x)) : ph === 'back' || ph === 'mist' ? lerp(.45, 1, smooth(PATH0, FOOT, C3.x)) : ph === 'still' || ph === 'come' || ph === 'evan' ? 1 : 0;
    dark += (dTo - dark) * .03;
    if (ph === 'still' || ph === 'come' || ph === 'evan') { if (--flashT < 0 && (zs === 'done' || zs === 'hold') && calmTo < .5) { fire(ph === 'evan' ? .45 : .7 + Math.random() * .3); flashT = (ph === 'evan' ? 700 : 330) + Math.random() * 500; } }

    // the camera
    let tx = C3.x + 150, tz = 1;
    if (ph === 'plain') tz = wise ? .84 : .9;
    if (ph === 'meet') { tx = C3.x + 60 + 330 * vil; tz = .86 - .14 * vil; if (G.act === 'hill') { tx = HILL_F + 260; tz = .55; } }
    if (ph === 'aside' || ph === 'down') { tx = Math.min(C3.x + 180, BROW0 + 140); tz = .86; }
    if (ph === 'path') { tx = C3.x + 150; tz = Z_NEAR; }
    if (ph === 'still' || ph === 'come' || ph === 'evan') { tx = ph === 'still' ? FOOT + 150 : FOOT - 40; tz = Z_NEAR; }
    if (ph === 'back' || ph === 'mist') { tx = C3.x - 150; tz = Z_NEAR; }
    if (ph === 'gate' || ph === 'knock' || ph === 'open') { tx = Math.min(C3.x + 150, GATE_X - 215); tz = lerp(1, .96, smooth(GATE_X - 500, GATE_STOP, C3.x)); }
    cam.cx += (tx - cam.cx) * .035; cam.z += (tz - cam.z) * .03; cam.wl = 440 - (1 - cam.z) * 70;
    // the pull back (see 'still'): the scale goes from close to the whole mountain in its logarithm; he slides a little
    // left of the middle; the road comes down so the summit and its cloud fit above
    if (ph === 'still' && Zw > 0) { const zz = Math.exp(lerp(Math.log(Z_NEAR), Math.log(Z_WIDE), Zw)), sx = lerp(VW / 2 - 150 * Z_NEAR, VW * .29, Zw);
      cam.z = zz; cam.cx = FOOT - (sx - VW / 2) / zz; cam.wl = lerp(440 - (1 - Z_NEAR) * 70, 470, Zw); }
  }

  // ---------- drawing ----------
  function drawChr(c, tint) {
    if (ph === 'title') return;
    TALKM = talkMove(C);
    // he trembles beneath the hill (a small quick shiver while he stands under it, before Evangelist raises him)
    const trem = (ph === 'still' || ph === 'come') ? dark : 0, a = C3.alpha, x = C3.x + trem * (.55 * Math.sin(G.t * .9) + .3 * Math.sin(G.t * 2.1));
    foot(c, C3.x, a);
    if (C3.tv && TURN.length) {
      const tf = clamp(C3.tv.t, 0, TURN.length - 1), f0 = Math.floor(tf);
      figure(c, 'turn', TURN[f0], TURN_META, x, 1, tint, a);
      if (f0 + 1 < TURN.length && tf - f0 > .02) figure(c, 'turn2', TURN[f0 + 1], TURN_META, x, 1, tint, a * (tf - f0));
      TALKM = null; return;
    }
    const wa = WEEP.ready ? smooth(0, 1, C3.wa) : 0, ra = RUNP.ready ? C3.run : 0, rest = a * (1 - ra);
    if (wa > 0 && wantNB && STD.length) {
      // build BNEXT: no book after Level 1, so instead of opening his book and weeping he bows low and trembles at Evangelist's
      // feet: his quiet standing picture leaned forward from his feet and pressed down a little, shaking
      const bw = smooth(0, 1, wa), im = STD[atTime(STD_META, breathT(QUIET[0] + G.t * .4))];
      c.save(); c.translate(x, 5); c.rotate(C3.face * .3 * bw); c.translate(-x, -5);
      figure(c, 'weep', im, STD_META, x + Math.sin(G.t * .9) * .5 * bw, C3.face, tint, a * smooth(0, .6, wa), 1 - .07 * bw); c.restore();
    } else if (wa > 0) figure(c, 'weep', WEEP[Math.min(WEEP.length - 1, Math.floor(C3.wt))], WEEP_META, x, C3.face, tint, a * smooth(0, .6, wa));
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
    // THE GROUND TREMBLES under the hill: a low steady rumble and a stronger jolt at each flash (the picture is drawn a
    // hair larger so its edges never show)
    { const near = (ph === 'still' || ph === 'come' || ph === 'evan') ? dark : 0, F0 = Math.min(1, flash) * near, sh = (.35 * near * (1 - calm) + 2.6 * F0);
      if (sh > .05) { const shx = sh * (Math.sin(G.t * 1.7) + .6 * Math.sin(G.t * 3.1)) * .6, shy = sh * Math.sin(G.t * 2.3) * .5, m = 1.01; c.setTransform(S * m, 0, 0, S * m, S * (shx - VW * (m - 1) / 2), S * (shy - VH * (m - 1) / 2)); }
      else c.setTransform(S, 0, 0, S, 0, 0); }
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.imageSmoothingEnabled = true;
    // the sky: a fair day over the plain, a heavy red-brown dark by the hill, a warmer morning at the gate
    const top = mix(mix([104, 134, 160], [15, 14, 20], gateish), [32, 32, 44], dark), low = mix(mix([255, 228, 168], [50, 40, 40], gateish), [124, 94, 88], dark);
    { const g = c.createLinearGradient(0, 0, 0, hor), fairK = (1 - dark) * (1 - gateish); g.addColorStop(0, css(top)); g.addColorStop(.58, css(mix(mix(top, low, .62), [240, 208, 186], .5 * fairK))); g.addColorStop(1, css(low)); c.fillStyle = g; c.fillRect(0, 0, VW, hor + 2); }
    // clouds, pale by day and heavy near the hill
    { const off = ((cx * .05 + G.t * .02) % 800 + 800) % 800;
      for (let i = -1; i < 2; i++) { const x0 = i * 800 - off + 200;
        // (build 174: with the sun low behind them the clouds are grey-violet above and bright along their lower edges:
        // the warm copy is laid first, a little lower, and the grey one over it)
        { const fa = (1 - dark) * (1 - .9 * gateish); c.globalAlpha = Math.min(1, .8 * fa); c.drawImage(CLOUDW, x0, 39, 800, 180); c.globalAlpha = .62 * fa; c.drawImage(CLOUDG, x0, 30, 800, 180); }
        if (dark > .02) { c.globalAlpha = .55 * dark; c.globalCompositeOperation = 'multiply'; c.drawImage(CLOUD, x0 - 260, 0, 900, 230); c.globalCompositeOperation = 'source-over'; } }
      c.globalAlpha = 1; }
    // the far light: ahead of him on the plain; over the gate at the end. The hill, drawn after it, comes between.
    const rocky = ph === 'path' || ph === 'still' || ph === 'come' || ph === 'evan' || ph === 'back' || ph === 'mist' || ph === 'title';
    const lx = lerp(VW * .5, clamp(X(GATE_X), 200, VW - 120), gateish), ly = lerp(hor - 96, Y(-262), gateish), la = (1 - .35 * dark) * (1 - gateish) * (rocky ? 0 : 1);
    // AMONG THE ROCKS (build 185; owner: "we need a surrounding of rockiness, not just ground then big rock"). Every layer
    // becomes rock, each one clean shape of one tone, pale far and dark near: the far ridges of the mountain's roots,
    // the crags behind the path, the stony path, and the nearest crags along the bottom of the picture, sliding past
    // faster than he does and now and then hiding his feet (owner: yes). The crags rise as he goes (low boulders and
    // open sky at first; rock up to the top of the picture at the foot); the edges that face the hidden fire ahead
    // catch a thin warm light. A crag's outline is straight runs with sharp breaks (`crag`), so it reads as rock.
    const crag = (L, seed, seg, pin) => { const i = Math.floor(L / seg), f = L / seg - i, hs = (j, q) => { const v = Math.sin(j * 127.1 + seed * 311.7 + q * 74.7) * 43758.5453; return v - Math.floor(v); };
      const hh = j => (.3 + .7 * Math.pow(hs(j, 0), .8)) * (pin && hs(j, 1) < .16 ? 1.35 : 1), a = hh(i), b = hh(i + 1), m = .25 + .5 * hs(i, 2), r = hs(i, 3), mid = r < .5 ? Math.min(a, b) * (.55 + .5 * r) : Math.max(a, b) * (.9 + .25 * (r - .5));
      return (f < m ? lerp(a, mid, f / m) : lerp(mid, b, (f - m) / (1 - m))) + (nz(L * .03, seed) - .5) * .07; };
    const burnR = clamp(dark) * (1 - .6 * calm);
    const crags = (p, seed, seg, base, hLo, hHi, col, edge, pin) => {
      const Ls = FOOT + p * (PATH0 - 700 - FOOT), pts = [];
      for (let sx = -12; sx <= VW + 12; sx += 5) { const L = FOOT + p * (cx - FOOT) + (sx - VW / 2) / z, e = Math.pow(smooth(Ls, FOOT, L), 1.2); pts.push([sx, Y(base) - lerp(hLo, hHi, e) * crag(L, seed, seg, pin) * z]); }
      c.fillStyle = css(col); c.beginPath(); c.moveTo(-12, VH + 10); for (const [x, y] of pts) c.lineTo(x, y); c.lineTo(VW + 12, VH + 10); c.fill();
      if (edge > .01) { c.save(); c.globalCompositeOperation = 'lighter'; c.strokeStyle = css([236, 150, 96], edge); c.lineWidth = 1.3; c.lineCap = 'round'; c.beginPath();
        for (let j = 1; j < pts.length; j++) { const [x0, y0] = pts[j - 1], [x1, y1] = pts[j]; if (y1 - y0 > 1.2) { c.moveTo(x0, y0); c.lineTo(x1, y1); } } c.stroke(); c.restore(); } };
    { const g = c.createRadialGradient(lx, ly, 0, lx, ly, 330); g.addColorStop(0, css([255, 236, 190], .85 * la)); g.addColorStop(.12, css([255, 222, 160], .5 * la)); g.addColorStop(.45, css([255, 214, 150], .16 * la)); g.addColorStop(1, css([255, 214, 150], 0));
      c.fillStyle = g; c.fillRect(lx - 330, ly - 330, 660, 660); c.fillStyle = css([255, 248, 226], la); c.beginPath(); c.arc(lx, ly, 7 + 1.2 * Math.sin(G.t / 40), 0, 7); c.fill(); }
    // the far ridge (among the rocks: the far crags instead, and the fire's light in the sky ahead)
    if (rocky) {
      { c.save(); c.globalCompositeOperation = 'screen'; const gx = VW * .8, gy = -40, rr = VW * .8, g = c.createRadialGradient(gx, gy, 0, gx, gy, rr), a = .34 * burnR * (1 - Zw);
        g.addColorStop(0, css([240, 150, 96], a)); g.addColorStop(.4, css([170, 80, 64], a * .45)); g.addColorStop(1, css([120, 50, 50], 0)); c.fillStyle = g; c.fillRect(0, 0, VW, VH); c.restore(); }
      crags(.35, 3, 260, -140, 40, 300, mix(mix(low, top, .35), [84, 64, 68], .45), .1 * burnR, false);
    } else { const col = mix(mix(mix(low, top, .45), [150, 138, 160], .5 * (1 - dark) * (1 - gateish)), [60, 52, 60], dark * .6); c.fillStyle = css(col); c.beginPath(); c.moveTo(0, hor + 2);
      for (let sx = 0; sx <= VW + 16; sx += 16) { const u = cx * .1 + (sx - VW / 2) / z; c.lineTo(sx, hor - (26 + 96 * nz(u * .0035, 5) + 22 * nz2(u * .02, 1)) * z * .8); }
      c.lineTo(VW, hor + 2); c.fill();
      // FOOTHILLS: a nearer, lower line of hills in front of the far ridge. At first they are all there is to see where
      // the hill will be (the hill is not shown until Wiseman points to it: see `reveal`)
      c.fillStyle = css(mix(col, mix([98, 112, 126], [44, 40, 48], dark), .5)); c.beginPath(); c.moveTo(0, hor + 2);
      for (let sx = 0; sx <= VW + 16; sx += 16) { const u = cx * .2 + (sx - VW / 2) / z; c.lineTo(sx, hor - (6 + 50 * nz(u * .005, 9) + 12 * nz2(u * .026, 4)) * z * .8); }
      c.lineTo(VW, hor + 2); c.fill(); }
    // the plain, from the horizon down to the road
    { const far = mix(mix([214, 196, 138], [50, 48, 56], gateish), [78, 68, 70], dark), near = mix(mix([52, 54, 40], [24, 24, 32], gateish), [38, 36, 44], dark);
      const g = c.createLinearGradient(0, hor, 0, Y(0)); g.addColorStop(0, css(far)); g.addColorStop(.35, css(mix(far, near, .5))); g.addColorStop(1, css(near)); c.fillStyle = g; c.fillRect(0, hor, VW, Y(0) - hor + 1);
      { const fk = (1 - dark) * (1 - gateish); if (fk > .02) { const hg = c.createLinearGradient(0, hor - 34 * z, 0, hor + 26 * z); hg.addColorStop(0, css(low, 0)); hg.addColorStop(.55, css(low, .62 * fk)); hg.addColorStop(1, css(low, 0)); c.fillStyle = hg; c.fillRect(0, hor - 34 * z, VW, 60 * z); } }
      // THE HILL IS NOT SEEN UNTIL WISEMAN POINTS (owner, build 185: "let's hide it entirely till worldly wise tells him to
      // look and then screen pans right and we see it"). On the plain it stands far off to the right (HILL_F), out of the
      // picture until the camera pans to it at "Do you see that hill?", and comes out of the haze as it does (`reveal`).
      // Among the rocks it is the mountain itself, at its true size (HSN), its foot just beyond the end of the path.
      const ap = rocky ? 1 : 0;
      const hx = rocky ? X(HX0) : VW / 2 + (HILL_F - cx) * PH * z, hy = rocky ? Y(6) : Y(HILL_Y), k = z * (rocky ? HSN : HSF);
      HL.appr = ap;
      hillBox = [hx, hy, k];
      // the village of Morality, small and far on the plain, nearer than the hill ("the first house you come to is his")
      if (!rocky) { const tw = 310 * z, th = 54 * z, tx = VW / 2 + (VIL_W - cx) * PH * z - tw / 2, ty = hy + 2 * z, va = Math.max(reveal, .9 * vil);
        if (va > .01 && tx < VW && tx + tw > 0) { const tc = tintC.town || (tintC.town = mk(400, 70)), t = tc.getContext('2d'); t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, 400, 70); t.drawImage(TOWN, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = css(mix(mix(mix(far, top, .4), [96, 84, 90], .6), [46, 42, 50], dark * .7)); t.fillRect(0, 0, 400, 70); c.globalAlpha = va; c.drawImage(tc, tx, ty - th, tw, th); c.globalAlpha = 1;
          for (const [wx, wy] of TOWN.lit) { c.fillStyle = css([255, 214, 140], Math.min(1, (.5 + .4 * dark) * va + .35 * vil * (1 - dark))); c.fillRect(tx + wx * tw / 400, ty - th + wy * th / 70, Math.max(1.5, 3.6 * z), Math.max(1.5, 3.6 * z)); } } }
      if ((rocky || reveal > .002) && hx > -1300 * k && hx < VW + 400 * k) {
        // AWE FIRST (owner, build 135: "the burning hill can be frightening - but most importantly stunning - it should
        // awe first"). After John Martin's pictures of the sublime and the book's own Sinai (Exodus 19: fire at the top,
        // thick cloud, lightnings): the hill is far taller than the people, black against a fire that burns at its
        // summit inside a towering cloud; the fire lights the cloud from within, runs down the overhanging face as a
        // thin burning edge, and lies as a red sheen on the plain. A flash adds lightning in the cloud and fire in
        // the cracks. Everything grows with `dark` (0 far off on a fair day .. 1 beneath it).
        const sx0 = hx + 60 * k, sy0 = hy - TOP * k, burn = dark * (.72 + .18 * Math.sin(G.t / 53) + .1 * Math.sin(G.t / 17)) * (1 - .6 * calm), F = Math.min(1, flash);
        let flames = null;
        // the fire behind the summit: the hill is cut out black against it
        if (burn > .01) { c.save(); c.globalCompositeOperation = 'screen';
          const g = c.createRadialGradient(sx0, sy0 + 40 * k, 0, sx0, sy0 + 40 * k, 620 * k); g.addColorStop(0, css([255, 224, 176], .8 * burn)); g.addColorStop(.12, css([246, 170, 110], .5 * burn)); g.addColorStop(.42, css([176, 92, 70], .24 * burn)); g.addColorStop(1, css([110, 50, 50], 0));
          c.fillStyle = g; c.fillRect(sx0 - 620 * k, sy0 - 580 * k, 1240 * k, 1240 * k); c.restore(); }
        // A CANOPY OF CLOUD, THE MIDDLE WAY (owner, build 151: asked for pros and cons of more cloud, chose the middle
        // way). The sky BEHIND THE HILL'S OUTLINE stays clear and glowing, so the black shape still reads; cloud
        // gathers only in the top of the sky and on the far left, where the plume flows into it. Dark billows,
        // those near the summit faintly lit from beneath; at a flash the light is inside the cloud. Drawn before
        // the hill, so nothing of it lies over the hill.
        if (dark > .02) { const kS = Math.min(k, 1); for (let i = 0; i < 34; i++) { const h1 = Math.sin(i * 39.3468) * 24634.6345, h2 = Math.sin(i * 11.135) * 7541.931, h3 = Math.sin(i * 73.156) * 3141.59, r1 = h1 - Math.floor(h1), r2 = h2 - Math.floor(h2), r3 = h3 - Math.floor(h3);
            const left = r1 * r1, px = sx0 + (420 - 2100 * r1) * kS + 26 * kS * Math.sin(G.t / 700 + i), py = sy0 - (60 + 250 * r2) * kS + left * 430 * r3 * kS, rr = (120 + 200 * r3) * kS, P = PUFF[i % 3];
            c.globalCompositeOperation = 'source-over'; c.globalAlpha = dark * (.5 + .3 * r2); c.drawImage(P.d, px - rr, py - rr * .62, 2 * rr, 1.24 * rr);
            const near = Math.max(0, 1 - Math.hypot(px - sx0, py - sy0) / (760 * k)), la = burn * (.13 + .36 * near * near) + F * .3 * near; if (la > .01) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = la; c.drawImage(P.l, px - rr, py - rr * .62, 2 * rr, 1.24 * rr); } }
          c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; }
        // the hill: fair and far off at first, black under its own cloud when he stands by it
        const dx = hx - HOX * k, dy = hy - HOY * k;
        c.globalAlpha = reveal; c.drawImage(!rocky && HILLV ? HILLV : HILL[0], dx, dy, HW * k, HH * k); if (dark > .01) { c.globalAlpha = dark; c.drawImage(HILL[1], dx, dy, HW * k, HH * k); } c.globalAlpha = 1;
        // IT IS THERE FROM THE START, VEILED (owner, build 181: "when you first see the hill it kinda appears out of
        // nowhere - it should be there already and to the right"): until Wiseman points to it, its lower slopes stand
        // pale in the plain's haze and its summit is lost in a bank of cloud; at "Do you see that hill?" the cloud draws
        // off (`reveal` 0 .. 1) and the fire can show
        // the burning edge down the overhanging face, and fire in the cracks when it flashes
        c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = c.lineJoin = 'round';
        if (!LAVA && (burn > .01 || F > .02)) {
          for (const [w, al, col] of [[6, .08, [236, 150, 84]], [1.6, .3, [255, 210, 150]]]) { c.strokeStyle = css(col, Math.min(1, al * (burn + 1.2 * F))); c.lineWidth = w * k; c.beginPath();
            for (let h = 150; h <= TOP; h += 10) { const px = hx + (faceX(h) + 2) * k, py = hy - h * k; h === 150 ? c.moveTo(px, py) : c.lineTo(px, py); } c.stroke(); } }
        // THE FIRE, WITH RESTRAINT (owner, build 145: "more subtle and nuanced and beautiful and awe inspiring in its
        // balance and restraint, like a good artist, not video game punch in the gut"). The fire itself is hardly
        // seen: what is seen is its LIGHT. One slender pillar of light stands on the summit and is lost in the
        // cloud; one seam of fire runs down from that same source inside the overhang and dies away; the cloud is
        // lit from within. No tongues of flame, no scattered burning cracks. A flash only makes these brighter.
        if (burn > .01) {
          // the pillar: soft lights along a slowly wavering line, widest and brightest at its foot
          // ONE SOFT LIGHT AT THE PEAK, THE SMOKE RISING STRAIGHT OUT OF IT (owner, build 154, with a picture of build 146 on
          // the phone: "This seemed to capture it better - something about your current plum[e]s is off"). Tried since
          // and taken out: tall golden flames (they made the mountain look small), then five small points of fire with a
          // thread of smoke (they read as candles and a chimney). What works: ONE source; no flame shapes at all, only a
          // small glow; the smoke begins at the glow as a full dark billow, lit from beneath, and partly hides it.
          for (let i = 0; i < 16; i++) { const u = i / 15, wob = (nz(G.t * .006 + u * 1.7, 12) - .5) * 50 * u * k, px = sx0 - 6 * k + wob - 26 * u * u * k, py = sy0 + (10 - 190 * u) * k, rr = (20 - 14 * u) * k, al = (.44 * (1 - u) * (1 - u) + .04) * (burn + .8 * F);
            const g = c.createRadialGradient(px, py, 0, px, py, rr); g.addColorStop(0, css([255, 232, 190], al)); g.addColorStop(.5, css([255, 170, 96], al * .45)); g.addColorStop(1, css([240, 110, 60], 0)); c.fillStyle = g; c.fillRect(px - rr, py - rr, 2 * rr, 2 * rr); }
          // the seam: fire from the same source, running down inside the overhang, thinning and dying away
          // the painted fire in the clefts, breathing; a soft bloom round it; brighter at a flash
          if (LAVA) { const al = Math.min(.75, (burn * .55 + .6 * F) * (.75 + .25 * Math.sin(G.t / 47))) * reveal; c.globalAlpha = al; c.drawImage(LAVA, dx, dy, HW * k, HH * k); c.globalAlpha = al * .7; c.drawImage(LAVAB, dx, dy, HW * k, HH * k); c.globalAlpha = 1; }
          if (!LAVA) for (const [seam, len, ph0, depth] of SEAMS) for (let j = 1; j < seam.length; j++) { const u = j / len, fade = Math.pow(1 - u, 1.25) * (depth ? .7 : 1), breathe = .55 + .45 * Math.sin(G.t / 58 - u * 6 + ph0), al = fade * breathe * (burn * 1.25 + F);
            if (al < .02) continue; const [x0, y0] = seam[j - 1], [x1, y1] = seam[j];
            for (const [w, a2, col] of [[9, .07, [236, 96, 50]], [4, .16, [250, 150, 80]], [.9 + 1.3 * fade, .9, [255, 224, 164]]]) { c.strokeStyle = css(col, Math.min(1, a2 * al)); c.lineWidth = w * k; c.beginPath(); c.moveTo(hx + x0 * k, hy + y0 * k); c.lineTo(hx + x1 * k, hy + y1 * k); c.stroke(); } }
        }
        if (F > .02) { const g = c.createRadialGradient(sx0, sy0, 0, sx0, sy0, 420 * k); g.addColorStop(0, css([255, 190, 120], .22 * F)); g.addColorStop(1, css([255, 150, 90], 0)); c.fillStyle = g; c.fillRect(sx0 - 420 * k, sy0 - 420 * k, 840 * k, 840 * k); }
        c.restore();
        // the cloud on the summit: a towering column that leans with the wind and spreads, dark, lit from within
        // THE SMOKE IN THE SKY (owner, build 146, of the reference painting: "the red ... was too much but I did like
        // smoke in sky - that was cool"). A great slow plume: it rises from the summit, bends with the wind and
        // rolls away across the sky over his head, growing and thinning as it goes. Soft round billows, dark, the
        // near ones lit from beneath by the fire (amber, never red). Each billow travels the whole way in about a
        // minute and melts away at the end; the far ones are drawn first.
        // (build 183: the smoke and the cloud keep the size they have from a distance, `kS`: stretched to the near hill's
        // size the soft billows became one huge blur filling the close-up)
        { const N = 46, ps = [], kS = Math.min(k, 1);
          for (let i = 0; i < N; i++) { const h1 = Math.sin(i * 12.9898) * 43758.5453, h2 = Math.sin(i * 78.233) * 12543.123; ps.push([(i / N + G.t / 3400) % 1, h1 - Math.floor(h1), h2 - Math.floor(h2), i]); }
          ps.sort((a, b) => b[0] - a[0]);
          for (const [u, r1, r2, i] of ps) { const rise = 1 - Math.pow(1 - u, 3), spread = (40 + 230 * u) * kS, px = sx0 - (240 * u + 900 * u * u) * kS + (r1 - .5) * spread, py = sy0 - (14 + 150 * rise - 60 * u * u) * kS + (r2 - .5) * spread * .7, rr = (40 + 210 * u) * kS * (.8 + .4 * r2), a = smooth(0, .05, u) * (1 - smooth(.72, 1, u)), P = PUFF[i % 3];
            c.globalCompositeOperation = 'source-over'; c.globalAlpha = a * (.07 + .73 * dark) * reveal; c.drawImage(P.d, px - rr, py - rr, 2 * rr, 2 * rr);
            const la = a * (burn * (.3 + .7 * Math.pow(1 - u, 2)) + F * .3 * (1 - u)); if (la > .01) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = la; c.drawImage(P.l, px - rr, py - rr, 2 * rr, 2 * rr); } } }
        c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
        if (flames) { c.save(); c.globalCompositeOperation = 'lighter'; flames(); c.restore(); }
        // lightning in the cloud, and sparks carried up
        c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = c.lineJoin = 'round';
        if (bolt && flash > .5) for (const [w, al] of [[7, .06], [1.2, .32]]) { c.strokeStyle = css([255, 240, 214], Math.min(1, al * flash)); c.lineWidth = w * k; c.beginPath(); bolt.forEach(([bx, by], j) => j ? c.lineTo(sx0 + bx * k, sy0 + by * k) : c.moveTo(sx0 + bx * k, sy0 + by * k)); c.stroke(); }
        for (const e of embers) { const al = Math.sin(Math.PI * e.t / e.life) * .9; c.fillStyle = css([255, 170 + 60 * e.h, 90], al); c.beginPath(); c.arc(sx0 + e.x * k, sy0 + e.y * k, Math.max(.7, e.r * k), 0, 7); c.fill(); }
        // the red sheen the fire lays on the plain
        if (burn > .01) { c.translate(hx - 120 * k, hy + 22 * z); c.scale(1, .1); const g = c.createRadialGradient(0, 0, 0, 0, 0, 640 * k); g.addColorStop(0, css([236, 130, 84], .2 * burn + .2 * F)); g.addColorStop(1, css([236, 130, 84], 0)); c.fillStyle = g; c.fillRect(-640 * k, -640 * k, 1280 * k, 1280 * k); }
        c.restore();
        // LOW CLOUD ACROSS ITS FOOT (build 169): on the fair day the mountain's foot is lost in the plain's haze and a long
        // level band of low cloud lies across its lower slopes, drifting very slowly; the mountain rises clear above
        // it. That band is what tells the eye how big it is. It thins away as the sky darkens and he comes near.
        { const fair = (1 - dark) * reveal; if (fair > .02) { const hz = mix(low, [226, 222, 214], .5);
            const bg = c.createLinearGradient(0, hy - 210 * k, 0, hy + 50 * k); bg.addColorStop(0, css(hz, 0)); bg.addColorStop(.55, css(hz, .26 * fair)); bg.addColorStop(.82, css(hz, .36 * fair)); bg.addColorStop(1, css(hz, 0)); c.fillStyle = bg; c.fillRect(0, hy - 210 * k, VW, 260 * k);
            for (let i = 0; i < 4; i++) { const w = (900 + i * 260) * k, h2 = (64 + i * 16) * k, xx = hx + (-420 + i * 190 + 60 * Math.sin(G.t / 1100 + i * 1.9)) * k, yy = hy - (70 + i * 36 + (i % 2) * 22) * k - h2 / 2;
              c.globalAlpha = (.3 - i * .05) * fair; c.drawImage(CLOUD, xx, yy, w, h2); }
            c.globalAlpha = 1;
            // its shadow lies on the plain on our side of it: a flat band of shade, widest under the mass
            { c.save(); c.translate(hx + 260 * k, hy + 26 * z); c.scale(1, .1); const sg = c.createRadialGradient(0, 0, 0, 0, 0, 760 * k); sg.addColorStop(0, css([22, 26, 22], .46 * fair)); sg.addColorStop(.6, css([22, 26, 22], .26 * fair)); sg.addColorStop(1, css([22, 26, 22], 0)); c.fillStyle = sg; c.fillRect(-760 * k, -760 * k, 1520 * k, 1520 * k); c.restore(); } } }
        // the field's haze at its foot, so it stands in the plain and not on it
        if (!rocky) { const fg = c.createLinearGradient(0, hy - 34 * k, 0, hy + 14 * k), ft = clamp((hy - hor) / (Y(0) - hor)), fc = ft < .35 ? mix(far, mix(far, near, .5), ft / .35) : mix(mix(far, near, .5), near, (ft - .35) / .65);
        fg.addColorStop(0, css(fc, 0)); fg.addColorStop(.6, css(fc, .85 * reveal)); fg.addColorStop(1, css(fc, 0)); c.fillStyle = fg; c.fillRect(0, hy - 34 * k, VW, 48 * k); }
      }
      // among the rocks: a haze in the gully, then the crags behind the path, then the stones falling from the overhang
      if (rocky) {
        { const hz = mix(mix(low, top, .3), [120, 84, 80], .3), g = c.createLinearGradient(0, Y(-220), 0, Y(0)); g.addColorStop(0, css(hz, 0)); g.addColorStop(1, css(hz, .42)); c.fillStyle = g; c.fillRect(0, Y(-220), VW, 222 * z); }
        crags(.75, 11, 150, 0, 70, 470, mix([40, 32, 36], [28, 23, 27], dark), .22 * burnR, true);
        { const g = c.createLinearGradient(0, Y(-70), 0, Y(0)); g.addColorStop(0, css([90, 66, 64], 0)); g.addColorStop(1, css([90, 66, 64], .3 * dark)); c.fillStyle = g; c.fillRect(0, Y(-70), VW, 72 * z); }
        // falling stones (dark, tumbling) and the dust where they land
        for (const r of ROCKS) { const px = hx + r.x * k, py = hy + r.y * k;
          if (r.dust) { const u = r.t / 70, rr = (4 + 22 * u) * k * (.5 + r.r * .3); c.fillStyle = css([92, 70, 62], .22 * (1 - u)); c.beginPath(); c.ellipse(px, py - rr * .3, rr, rr * .45, 0, 0, 7); c.fill(); continue; }
          c.save(); c.translate(px, py); c.rotate(r.t * .2 + r.s); c.fillStyle = css([20, 16, 18], .9); const kk = Math.min(k, 1.8); c.fillRect(-r.r * kk, -r.r * .7 * kk, 2 * r.r * kk, 1.4 * r.r * kk); c.restore(); }
      }
    }
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
    const gateOn = !rocky && X(GATE_X - 1300) < VW, gx = X(GATE_X), r = 30 * z, gy0 = Y(-120), lnx = gx - 58 * z, lny = Y(-150), flick = .86 + .1 * Math.sin(G.t / 7) + .04 * Math.sin(G.t / 2.3);
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
    const road = () => { const g = c.createLinearGradient(0, Y(0), 0, VH); const rc = mix(rocky ? [40, 35, 36] : [46, 40, 36], [22, 22, 30], Math.max(dark, .9 * gateish)); g.addColorStop(0, css(mix(rc, [120, 116, 100], .25))); g.addColorStop(.08, css(rc)); g.addColorStop(1, css(mix(rc, [0, 0, 0], .35))); c.fillStyle = g; c.fillRect(0, Y(0), VW, VH); };
    road();
    const humpC = css(mix(mix([46, 40, 36], [120, 116, 100], .25), [22, 22, 30], dark));
    // the swell of the brow, on the road (only on the plain, where he goes out of sight over it)
    if (!rocky && !gateish && X(BROW0 - 300) < VW && X(CREST + 600) > 0) { c.beginPath(); c.moveTo(X(BROW0 - 340), Y(1)); for (let x = BROW0 - 330; x <= CREST + 570; x += 10) c.lineTo(X(x), Y(-crest(x))); c.lineTo(X(CREST + 580), Y(1)); c.fillStyle = humpC; c.fill(); }
    // the lantern's and the open door's light lie in flat pools on the road
    if (gateOn) { c.save(); c.globalCompositeOperation = 'lighter';
      for (const [px, rr, al, col] of [[lnx + 10 * z, 230 * z, .26 * flick, [255, 170, 90]], [gx - 30 * z, 400 * z, .6 * door, [255, 208, 134]]]) { if (al < .01) continue; c.save(); c.translate(px, Y(5)); c.scale(1, .09); const g = c.createRadialGradient(0, 0, 0, 0, 0, rr); g.addColorStop(0, css(col, al)); g.addColorStop(1, css(col, 0)); c.fillStyle = g; c.fillRect(-rr, -rr, 2 * rr, 2 * rr); c.restore(); }
      c.restore(); }
    // (build 170, owner: "The tree roots need to reach brown ground or they didn't look right": the oak is drawn AFTER the road now,
    // standing at the road's own edge and sliding with it, so its roots go down into the dark earth of the road)
    // THE OAK IN LEAF where the two ways cross (owner, build 158: "the tree at beginning needs redo - the color scheme too -
    // like the green but we need beautiful and intriguing entry - think about the artist we are using - maybe a
    // generated tree like slough but with leaves"). Grown by the Slough's own tree code with another seed, so it is
    // kin to the bare black oak over the mire, but alive: he is out of the slough. It stands as the great dark tree
    // of John Martin's quiet pictures (The Plains of Heaven), its long limb reaching over the place where the two
    // meet, with the light of late afternoon in the edge of its crown.
    if (OAKP) { const M = OAK_META, s = M.k * z, tx = VW / 2 + (MEET - 150 - cx) * z, ty = Y(7), x0 = tx - M.ax * s, y0 = ty - M.ground * s, w = M.w * s, h = M.h * s;
      if (x0 < VW && x0 + w > 0) {
        { c.save(); c.translate(tx + 70 * z, Y(-1)); c.scale(1, .09); const g = c.createRadialGradient(0, 0, 0, 0, 0, 360 * z); g.addColorStop(0, css([14, 26, 20], .46 * (1 - dark))); g.addColorStop(1, css([14, 26, 20], 0)); c.fillStyle = g; c.fillRect(-360 * z, -360 * z, 720 * z, 720 * z); c.restore(); }
        c.drawImage(OAKP.c, x0, y0, w, h);
        { const ra = (1 - dark) * (1 - gateish) * .75; if (ra > .02) { c.globalAlpha = ra; c.drawImage(lx > tx ? OAKP.rimR : OAKP.rimL, x0, y0, w, h); c.globalAlpha = 1; } }
        if (dark < .5) { c.save(); c.globalCompositeOperation = 'lighter'; OAKP.tw.forEach(([px, py], i) => { const v = Math.sin(G.t / (26 + (i * 37) % 60) + i * 2.4); if (v < .55) return; const al = Math.pow((v - .55) / .45, 2) * .7 * (1 - 2 * dark);
            c.fillStyle = css([255, 238, 180], al); c.beginPath(); c.arc(x0 + px * s, y0 + py * s, (1 + 1.1 * al) * z, 0, 7); c.fill(); }); c.restore(); }
        // THE SUN THROUGH THE LEAVES (owner, build 173): when the low sun stands behind the crown it breaks through the gaps: a
        // small flare, a few soft spokes of light that turn as he walks, and dapples of light in the oak's shade
        { const inX = smooth(x0 + w * .04, x0 + w * .22, lx) * (1 - smooth(x0 + w * .8, x0 + w * .98, lx)), inY = smooth(y0, y0 + h * .1, ly) * (1 - smooth(y0 + h * .62, y0 + h * .74, ly)), sun = inX * inY * (1 - dark) * (1 - gateish);
          if (sun > .02) { c.save(); c.globalCompositeOperation = 'lighter';
            const fl2 = .75 + .25 * Math.sin(cx * .05) * Math.sin(cx * .017 + 1), g = c.createRadialGradient(lx, ly, 0, lx, ly, 70 * z); g.addColorStop(0, css([255, 244, 210], .75 * sun * fl2)); g.addColorStop(.3, css([255, 224, 160], .3 * sun * fl2)); g.addColorStop(1, css([255, 210, 140], 0)); c.fillStyle = g; c.fillRect(lx - 70 * z, ly - 70 * z, 140 * z, 140 * z);
            c.lineCap = 'round'; for (let i = 0; i < 9; i++) { const an = i * .698 + cx * .004 + .3 * Math.sin(i * 2.7), len = (70 + 80 * ((i * 37) % 10) / 10) * z * (.6 + .4 * Math.sin(cx * .03 + i * 1.3)), gr = c.createLinearGradient(lx, ly, lx + Math.cos(an) * len, ly + Math.sin(an) * len); gr.addColorStop(0, css([255, 236, 190], .34 * sun)); gr.addColorStop(1, css([255, 226, 170], 0));
              c.strokeStyle = gr; c.lineWidth = (2 + (i % 3)) * z; c.beginPath(); c.moveTo(lx, ly); c.lineTo(lx + Math.cos(an) * len, ly + Math.sin(an) * len); c.stroke(); }
            c.restore(); }
          // (dapples of light in the shade were tried here and read as stepping stones: taken out)
        }
        if (dark > .02) { c.globalAlpha = Math.min(1, dark * .85); c.drawImage(OAKP.d, x0, y0, w, h); c.globalAlpha = 1; }
        if (dark < .6) for (let i = 0; i < 7; i++) { const T = 620 + i * 97, u = ((G.t + i * 233) % T) / T, lx2 = tx + (-90 + i * 60 + 34 * Math.sin(u * 7 + i)) * z + 50 * u * z, ly2 = ty - (260 - 30 * (i % 3)) * z * (1 - u), al = Math.sin(Math.PI * u) * .9 * (1 - dark);
          c.save(); c.translate(lx2, ly2); c.rotate(u * 9 + i); c.fillStyle = css([44, 50, 36], al); c.beginPath(); c.ellipse(0, 0, 3 * z, 1.3 * z, 0, 0, 7); c.fill(); c.restore(); } } }
    if (!OAKP && !OAKL && typeof SL !== 'undefined' && SL.grow) OAKL = bakeOak();
    if (!OAKP && OAKL) { const s = .88 * z, tx = VW / 2 + (MEET - 185 - cx) * .92 * z, ty = Y(-6), w = OAKL.c.width * s, h = OAKL.c.height * s, x0 = tx + OAKL.x0 * s, y0 = ty + OAKL.y0 * s;
      if (x0 < VW && x0 + w > 0) {
        // its shade on the field, flat
        { c.save(); c.translate(tx + 60 * z, Y(-2)); c.scale(1, .1); const g = c.createRadialGradient(0, 0, 0, 0, 0, 330 * z); g.addColorStop(0, css([14, 30, 22], .42 * (1 - dark))); g.addColorStop(1, css([14, 30, 22], 0)); c.fillStyle = g; c.fillRect(-330 * z, -330 * z, 660 * z, 660 * z); c.restore(); }
        c.drawImage(OAKL.c, x0, y0, w, h);
        // sunlight twinkling in the leaves: each sunlit touch brightens for a moment in its own time
        if (dark < .5) { c.save(); c.globalCompositeOperation = 'lighter'; for (const [lx3, ly3, ph3, per] of OAKL.tw) { const v = Math.sin(G.t / per + ph3); if (v < .55) continue; const al = Math.pow((v - .55) / .45, 2) * .75 * (1 - 2 * dark);
            c.fillStyle = css([255, 238, 180], al); c.beginPath(); c.arc(tx + lx3 * s, ty + ly3 * s, (1.1 + 1.2 * al) * s, 0, 7); c.fill(); } c.restore(); }
        if (dark > .02) { c.globalAlpha = Math.min(1, dark * .85); c.drawImage(OAKL.d, x0, y0, w, h); c.globalAlpha = 1; }
        // a few leaves let go and drift down
        if (dark < .6) for (let i = 0; i < 7; i++) { const T = 620 + i * 97, u = ((G.t + i * 233) % T) / T, lx2 = tx + (-110 + i * 46 + 34 * Math.sin(u * 7 + i)) * z + 50 * u * z, ly2 = ty - (220 - 30 * (i % 3)) * z * (1 - u), al = Math.sin(Math.PI * u) * .9 * (1 - dark);
          c.save(); c.translate(lx2, ly2); c.rotate(u * 9 + i); c.fillStyle = css([40, 48, 40], al); c.beginPath(); c.ellipse(0, 0, 3 * z, 1.3 * z, 0, 0, 7); c.fill(); c.restore(); } } }
    // the people (in the world's own units)
    c.save(); c.translate(VW / 2 - cx * z, wl); c.scale(z, z);
    RIM = { k: (1 - dark) * (1 - gateish) * .9, x: (lx - VW / 2) / z + cx };
    const tint = mix([72, 66, 62], [78, 72, 82], dark), fl = Math.min(1, flash) * dark, lit = gateish * smooth(GATE_X - 330, GATE_X - 60, C3.x), tintF = mix(mix(mix(tint, [66, 62, 72], gateish), [255, 170, 110], fl * .35), [255, 188, 120], lit * (.3 + .4 * door));
    const tintM = mix(tintF, [255, 204, 150], mercy * .42);
    if (mercy > .01) { const mx = (C3.x + EV_X) / 2; c.save(); c.globalCompositeOperation = 'lighter';
      { c.save(); c.translate(mx, 5); c.scale(1, .1); const g = c.createRadialGradient(0, 0, 0, 0, 0, 210); g.addColorStop(0, css([255, 196, 126], .5 * mercy)); g.addColorStop(1, css([255, 180, 110], 0)); c.fillStyle = g; c.fillRect(-210, -210, 420, 420); c.restore(); }
      { const g = c.createRadialGradient(mx, -84, 0, mx, -84, 170); g.addColorStop(0, css([255, 206, 150], .2 * mercy)); g.addColorStop(1, css([255, 190, 130], 0)); c.fillStyle = g; c.fillRect(mx - 170, -254, 340, 340); }
      c.restore(); }
    if (evan && evan.x != null && EVW.ready) {
      // walking in out of the haze, then his standing frames dissolve in over the walk frame
      const ex = evan.x, fa = smooth(EV_X - EV_FROM, EV_X - EV_FROM + 220, ex), st = evan.st; TALKM = talkMove(E); foot(c, ex, fa);
      if (st < 1) figure(c, 'evw', EVW[Math.floor(evan.anim) % EVW.length], EVW_META, ex, 1, tintM, fa * (1 - smooth(.4, 1, st)));
      if (st > 0 && EVS.ready) figure(c, 'evan', EVS[Math.floor(G.t * .2) % EVS_META.frames], EVS_META, ex, 1, tintM, smooth(0, .6, st));
      TALKM = null;
    } else if (evan && EVS.ready) { TALKM = talkMove(E); foot(c, EV_X, evan.a); figure(c, 'evan', EVS[Math.floor(G.t * .2) % EVS_META.frames], EVS_META, EV_X, 1, tintM, smooth(.25, 1, evan.a)); TALKM = null; }
    if (wise && (WIS.ready || OBS.ready)) {
      const wt = mix([70, 64, 60], [92, 82, 84], dark); TALKM = talkMove(WW); foot(c, wise.x, wise.alpha);
      const { W, M, S, SM } = wFig(), wim = W[Math.floor(wise.anim) % W.length];
      if (S && wise.st > 0) { figure(c, 'wst', S, SM, wise.x, -1, wt, wise.alpha * smooth(0, .6, wise.st), breath(2)); figure(c, 'wis', wim, M, wise.x, -1, wt, wise.alpha * (1 - smooth(.4, 1, wise.st))); }
      else figure(c, 'wis', wim, M, wise.x, -1, wt, wise.alpha);
      TALKM = null;
    }
    // in the wide shot he is a tiny dark figure: a faint warm light round him so the eye can find him
    if (Zw > .05) { const g = c.createRadialGradient(C3.x, -60, 0, C3.x, -60, 34 / z); g.addColorStop(0, css([255, 196, 130], .28 * Zw)); g.addColorStop(1, css([255, 170, 110], 0)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(C3.x - 34 / z, -60 - 34 / z, 68 / z, 68 / z); c.restore(); }
    c.save(); c.translate(0, C3.dy || 0); drawChr(c, tintM); c.restore(); RIM = null;
    c.restore();
    // over the brow: the near ground is drawn again over him as he goes down behind it
    if (C3.dy > .5 && C3.x > CREST) { c.save(); c.beginPath(); c.moveTo(X(CREST), VH); for (let x = CREST; x <= CREST + 700; x += 10) c.lineTo(X(x), Y(-crest(x))); c.lineTo(VW, Y(0)); c.lineTo(VW, VH); c.clip(); road(); c.fillStyle = humpC; c.fillRect(0, 0, VW, Y(0) + 1); c.restore(); }
    // the nearest crags, along the bottom of the picture, in front of everyone
    if (rocky) crags(1.3, 29, 95, 150, 60, 175, [12, 10, 12], .1 * burnR, false);
    // the smoke Evangelist comes out of
    if (evan && evan.a < 1) { const ex = X(EV_X - 30), ey = Y(-90), a = Math.sin(Math.PI * clamp(evan.a * 1.1)) * .8 + (1 - evan.a) * .0; c.globalAlpha = a; for (let i = 0; i < 3; i++) c.drawImage(SMOKE, ex - (200 + i * 40) * z + 30 * Math.sin(G.t / 90 + i), ey - (110 - i * 30) * z, 400 * z, 200 * z); c.globalAlpha = 1; }
    // the flash over everything, the veil of mist between the hill and the gate, the burned edges
    if (flash > .02) { c.fillStyle = css([255, 176, 120], .07 * Math.min(1, flash)); c.fillRect(0, 0, VW, VH); }
    if (cut > .003) { c.fillStyle = css([10, 9, 12], smooth(0, 1, cut)); c.fillRect(0, 0, VW, VH); }
    if (veil > .003) { c.fillStyle = css(mix([226, 222, 214], [150, 146, 150], dark), smooth(0, 1, veil)); c.fillRect(0, 0, VW, VH); }
    { const g = c.createRadialGradient(VW * .5, VH * .5, VH * .42, VW * .5, VH * .5, VW * .78); g.addColorStop(0, 'rgba(12,12,18,0)'); g.addColorStop(1, css([12, 12, 18], .42 + .2 * dark + .22 * gateish)); c.fillStyle = g; c.fillRect(0, 0, VW, VH); }
    // touches, the ring that shows where to touch, the things he carries
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2; for (const k of [0, .5]) { const q = (G.t / 80 + k) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, 14 + q * 40, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    if (HL.on) drawItems();
  }

  // for testing: HL.peek() tells where the story is
  return { on: false, show: false, hillPics: () => HILL, title, start, update, draw, touch, key, preload, lines: ALL, pt: k => k === 'hill' ? hillPt() : gatePt(), peek: () => ({ ph, x: Math.round(C3.x), stillT, zs, zT, Zw: +Zw.toFixed(2), stand: C3.sd != null, wx: wise && Math.round(wise.x), ex: evan && evan.x != null ? Math.round(evan.x) : null, dark: +dark.toFixed(2), wise: wise && wise.mode, evan: evan && +evan.a.toFixed(2), knocks, cam: { ...cam } }) };
})();
