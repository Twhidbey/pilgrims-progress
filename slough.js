// ============================================================
// LEVEL 2: THE SLOUGH OF DESPOND (book {25} to {35}). Loaded by index.html after its own script, and run by its
// engine: the words (talk, caption, hint), the voices, holding to walk, the sound. Everything of its own is inside SL,
// so nothing here can clash with Level 1's names. The look comes from slough-lab.html (approved by the owner):
// a silver picture with a breath of colour, still water that mirrors, one black twisted oak.
//
// The level, in the book's order: the plain in gold, Christian and Pliable talking ({25} to {28}) -> mist comes in, the
// colour drains -> they fall into the bog ({29}) -> Pliable's anger; he struggles out on the side next to his own house
// ({30}) -> the choice (ours, not the book's: going back loses nothing) -> Christian wades on alone toward the gate side,
// each step a note of the tune in the minor ({31}) -> at the far bank he cannot get out: holding does nothing -> Help
// comes ({31}, {32}); the child gives Help his hand -> Help draws him out -> looking back, the lights he gathered settle
// on the hidden steps ({35}), the last phrase of the tune in the major, the gold comes back -> "Go on your way".
//
// World units: x along the level (the oak stands at 0), y = 0 is the water line, up is negative. The camera has a width
// (z: 1 = Level 1's scale, smaller = drawn back), a centre (cx) and the water line's place on the screen (wl).
// ============================================================
const SL = (() => {
  const H = 'Help';
  const DARK = [17, 19, 27], LIGHT = [247, 243, 233], GOLD = [255, 205, 120];
  const tone = v => mix(DARK, LIGHT, clamp(v));
  function rngS(seed) { let s = seed >>> 0 || 1; return () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function noise2(seed) {
    const h = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7 + seed) * 43758.5453; return v - Math.floor(v); };
    const n = (x, y) => { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
      return lerp(lerp(h(i, j), h(i + 1, j), a), lerp(h(i, j + 1), h(i + 1, j + 1), a), b); };
    return (x, y) => { let s = 0, a = 1, t = 0; for (let k = 0; k < 5; k++) { s += a * n(x, y); t += a; a *= .5; x = x * 2.03 + 17; y = y * 2.03 + 9; } return s / t; };
  }

  // ---------- the words: Bunyan's, shortened and made plain ----------
  const OPEN = [[N, 'Then Christian and Pliable went talking over the plain.']].concat(LEVEL2_OPENING);      // {25} to {28}
  const NEAR = [[N, 'Just as they ended this talk, they drew near to a very miry bog in the middle of the plain.']];      // {29}
  const FALL = [      // {29}, {30}
    [N, 'Not looking where they went, they both fell suddenly into the bog. Its name was Despond.'],
    [N, 'Because of the burden on his back, Christian began to sink in the mire.'],
    [PL, 'Ah, neighbor Christian, where are you now?'],
    [C, 'Truly, I do not know.'],
    [PL, 'Is this the happiness you have told me of? If I get out again with my life, you shall have the brave country alone for me!', null, () => { if (pli) pli.turn = 1; }],      // he turns from Christian toward his own side
    [N, 'With a desperate struggle or two, he got out on the side next to his own house. So away he went, and Christian saw him no more.', null, () => { pli.mode = 'climb'; pli.wal = false; pli.turn = 1; }],
  ];
  // the choice is ours, not the book's (as in Level 1): going back loses nothing
  const BACK = [
    [N, 'Christian turned back toward his own house. The mist grew thick and dark.'],
    [C, 'No. I must struggle on, toward the gate.', null, () => { gloomTo = 0; }],
  ];
  const ALONE = [[N, 'So Christian was left to struggle in the Slough of Despond alone.']];      // {31}
  const FEARS = [[N, 'Many fears and doubts came over him, and settled in that place.']];      // {33}: the fears are sound only, and this one line
  const STUCK = [[N, 'He came to the far side. But he could not get out, because of the burden upon his back.']];      // {31}
  const HELP = [      // {31}, {32}
    [N, 'Then a man came to him, whose name was Help.'],
    [H, 'What are you doing there?'],
    [C, 'Sir, I was told to go this way by a man called Evangelist. As I was going to the gate, I fell in here.'],
    [H, 'But why did you not look for the steps?'],
    [C, 'Fear followed me so hard that I fled the nearest way, and fell in.'],
    [H, 'Give me your hand.', 'hand', () => { mv = mv || { t: 0 }; }],
  ];
  const DRAWN = [[N, 'So he gave him his hand. And Help drew him out, and set him upon sound ground.']];      // {32}
  const STEPS = [[N, 'There were good, strong steps through the very middle of the bog. But in the mist, they were hard to see.']];      // {35}
  const ONWAY = [[H, 'Go on your way.']];      // {32}: "and bid him go on his way"
  const ALL = [...OPEN, ...NEAR, ...FALL, ...BACK, ...ALONE, ...FEARS, ...STUCK, ...HELP, ...DRAWN, ...STEPS, ...ONWAY];

  // ---------- the land ----------
  const bankN = noise2(4), cloudN = noise2(21);
  const BANK0 = -160, HOME0 = -905;                       // where each bank meets the water
  const WATER_L = -1250;                                  // the water in front of everything begins here; to the left is the plain
  const bankY = x => x >= BANK0 ? -(30 * smooth(BANK0, BANK0 + 105, x) + (bankN(x * .012, 1) - .5) * 14 * smooth(BANK0, BANK0 + 150, x))
                   : x <= HOME0 + 55 ? -(20 * smooth(HOME0 + 55, HOME0 + 15, x) + (bankN(x * .012, 7) - .5) * 10 * smooth(HOME0 - 10, HOME0 - 130, x)) : 0;
  // build 118 (owner: "check the pliable leaving - making sure feet are always in contact with ground"): the home bank used
  // to rise slowly over 90 units, but Pliable's climbing video hauls him up a bank with a short steep face, so for a few
  // steps after he stood up his feet were in the air beyond the land's end. The bank now has that short face, standing
  // where the video's bank stood, at its full height by HOME0 + 15
  const START = -2750, FALL_X = -760, PLI_FALL = -840, END_X = 420;
  const WADE0 = FALL_X + 70;      // build 119: falling, Christian pitches on this much further, so the two are not on top of each other in the mire
  // Help kneels at the edge of the far bank; Christian must come to where his hand meets Help's (measured in slough-lab.html)
  const HX = BANK0 + 34, GRASP = { dx: -(82 - 15 + 129), dy: 283 - 55 };
  const HY = () => bankY(HX) + 4;
  const STUCK_X = HX + GRASP.dx * CHR_K, STUCK_Y = () => HY() + GRASP.dy * CHR_K;
  const SINK = 100, PLI_SINK = 76, DEEP = 22, OAK_X = 110, OAK_S = 1.2;
  // build 115 (owner, of them standing at the bog's edge: "still white space between feet and ground"): on the muddy flat at
  // the water's level they stand a little sunk in it, and every picture of them there is cut at the water line
  const MUDDY = x => 6 * smooth(-6, 0, bankY(x));                        // how deep each stands in the mire when they fall (feet below the water line)
  // the fall is slow (owner, build 105: "go deeper ... drop more slow ... what it looks like to get [stuck in] mud"): a soft first
  // drop to the knees, then a slow sink over about 5 seconds that goes on while the words begin
  const sunk = t => .4 * smooth(0, 40, t) + .6 * smooth(25, 330, t);
  // where each man stands when the lift is over, in the lift picture's own pixels (measured from its last frame)
  const LIFT_CHR = 260, LIFT_HELP = 399;

  // ---------- the oak (the same seed, 18, as the approved still) ----------
  function oak(seed, hero = true, depth = 4) {
    const R = rngS(seed), rr = (a, b) => a + (b - a) * R(), out = [];
    function grow(x, y, a, len, w, d, o = {}) {
      const step = Math.max(2.6, len / 24), n = Math.max(3, Math.round(len / step)), w0 = o.w0 ?? w, pts = [[x, y, Math.max(w, w0)]], taper = o.taper ?? .62;
      let nextKid = rr(.16, .34) * n, side = R() < .5 ? -1 : 1;
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        a += (R() - .5) * (o.wander ?? .36);
        if (R() < (o.elbow ?? .08)) a += (R() < .5 ? -1 : 1) * rr(.3, .65);
        const ga = o.guide ? o.guide(t) : null; if (ga != null) a += (ga - a) * .22; else a -= a * t * t * .13;
        if (y > -14 && !o.guide) a *= .8;
        x += Math.sin(a) * step; y -= Math.cos(a) * step;
        const ww = w * (1 - taper * t) + Math.max(0, w0 - w) * Math.exp(-i * step / (w0 * .6)); pts.push([x, y, ww]);
        if (d > 0 && i >= nextKid && i < n) {
          side = -side; if (R() < .25) side = -side;
          if (o.reach && R() < .75) side = 1;
          const ka = a + side * rr(.45, 1.15), kl = len * (1 - t * .6) * rr(.42, .78), kw = ww * rr(.5, .76);
          if (kl > 6 && kw > .3) grow(x, y, ka, kl, kw, d - 1, { w0: ww * .9 });
          nextKid = i + rr(.09, .22) * n;
        }
      }
      out.push(pts);
      if (d > 0 && !o.stub) { const ew = w * (1 - taper); grow(x, y, a - rr(.3, .7), len * .42, ew * .85, d - 1, { w0: ew }); grow(x, y, a + rr(.3, .7), len * .36, ew * .75, d - 1, { w0: ew }); }
      return [x, y, a];
    }
    if (!hero) {
      const [x, y] = grow(0, 0, rr(-.15, .15), 80, 20, 0, { taper: .3, wander: .12, elbow: 0 });
      for (const a of [-1.1, -.45, .2, .9]) grow(x, y, a + rr(-.2, .2), rr(150, 230), rr(9, 13), depth);
      return out;
    }
    const [tx, ty, ta] = grow(0, 0, -.06, 92, 58, 0, { wander: .1, elbow: 0, taper: .14, w0: 90, guide: t => lerp(-.06, -.24, t) });
    const limb = (dx, dy, to, len, w, o = {}) => grow(tx + dx, ty + dy, lerp(ta, to, .35), len, w, depth, { w0: 40, ...o,
      guide: t => t < .13 ? lerp(lerp(ta, to, .35), to, t / .13) : o.then ? o.then((t - .13) / .87) : null });
    limb(-8, 9, -1.0, 372, 25, { wander: .2, elbow: .03, taper: .7, reach: true, w0: 44, then: t => t < .6 ? lerp(-1.0, -1.3, t / .6) : lerp(-1.3, -1.08, (t - .6) / .4) });      // build 115 (owner: "helps head is in branch ... can you move branch up"): the long limb leaves higher and sags less (was -1.34, -1.61, -1.3)
    limb(-4, 2, -.74, 250, 24); limb(0, 0, -.1, 236, 22); limb(4, 2, .54, 262, 24);
    limb(9, 14, 1.24, 304, 23, { w0: 44 });
    grow(-2, -30, -2.4, 112, 14, 0, { wander: .12, elbow: 0, taper: .9, w0: 40, guide: t => lerp(-2.5, -1.72, t * 2) });
    grow(4, -30, 2.4, 124, 14, 0, { wander: .12, elbow: 0, taper: .9, w0: 40, guide: t => lerp(2.5, 1.7, t * 2) });
    return out;
  }
  function ribbons(c, tree) {
    c.beginPath();
    for (const p of tree) {
      const n = p.length, L = [], Rr = [];
      for (let i = 0; i < n; i++) {
        const a = p[Math.max(0, i - 1)], b = p[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = Math.max(.35, p[i][2]) / 2;
        L.push([p[i][0] - dy / l * w, p[i][1] + dx / l * w]); Rr.push([p[i][0] + dy / l * w, p[i][1] - dx / l * w]);
      }
      c.moveTo(L[0][0], L[0][1]); for (let i = 1; i < n; i++) c.lineTo(L[i][0], L[i][1]);
      for (let i = n - 1; i >= 0; i--) c.lineTo(Rr[i][0], Rr[i][1]); c.closePath();
    }
    c.fill();
    c.beginPath(); for (const p of tree) if (p[0][2] > 2 && p[0][1] < -30) { c.moveTo(p[0][0] + p[0][2] / 2, p[0][1]); c.arc(p[0][0], p[0][1], p[0][2] / 2, 0, 7); } c.fill();
  }
  // Trees are baked once into pictures (a tree is thousands of ribbons; drawing them every frame would be slow)
  function bakeTree(tree, col, k) {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of tree) for (const [x, y, w] of p) { x0 = Math.min(x0, x - w); x1 = Math.max(x1, x + w); y0 = Math.min(y0, y - w); y1 = Math.max(y1, y + w); }
    const c = mk(Math.ceil((x1 - x0) * k) + 4, Math.ceil((y1 - y0) * k) + 4), g = c.getContext('2d');
    g.setTransform(k, 0, 0, k, (2 - x0 * k), (2 - y0 * k)); g.fillStyle = css(col); ribbons(g, tree);
    return { c, x0: x0 - 2 / k, y0: y0 - 2 / k, k };
  }
  const putTree = (c, b, x, y, s, sy = s) => c.drawImage(b.c, x + b.x0 * s, y + b.y0 * sy, b.c.width / b.k * s, b.c.height / b.k * sy);
  let OAK = null, GHOSTS = null, skyMist = null, skyClear = null, paper = null, threads = null, puff = null, fogBank = null, built = false;
  function build() {
    if (built) return; built = true;
    OAK = bakeTree(oak(18), tone(.02), 1.3);
    GHOSTS = [[-760, .5, 3, .8], [-1500, .36, 5, .88], [560, .46, 8, .84], [-230, .3, 9, .9], [-2300, .42, 12, .86], [-3100, .4, 14, .85], [-1950, .52, 15, .83]]
      .map(g => ({ x: g[0], p: g[1], b: bakeTree(oak(g[2], false, 3), tone(g[3]), .7) }));
    // two skies baked once (misty and clear) and mixed by the mist; the far light is drawn over them live
    const sky = (skyV, mistV) => { const c = mk(240, 135), k = c.getContext('2d'), d = k.createImageData(240, 135);
      for (let j = 0; j < 135; j++) for (let i = 0; i < 240; i++) {
        const fy = j / 134, cl = cloudN(i * .016, j * .06), cl2 = cloudN(i * .05 + 40, j * .16 + 3);
        let v = lerp(skyV, .97, Math.pow(fy, 1.25)) + (smooth(.42, .72, cl) * .34 + (cl2 - .5) * .1) * (1 - fy * .75);
        v = lerp(v, .93, mistV * .62 + (1 - mistV) * .5 * smooth(.8, 1, fy));
        const col = tone(v), o = (j * 240 + i) * 4; d.data[o] = col[0]; d.data[o + 1] = col[1]; d.data[o + 2] = col[2]; d.data[o + 3] = 255;
      }
      k.putImageData(d, 0, 0); return c; };
    skyMist = sky(.36, 1); skyClear = sky(.24, .2);
    paper = mk(256, 256); { const c = paper.getContext('2d'), d = c.createImageData(256, 256), r = rngS(5);
      for (let i = 0; i < d.data.length; i += 4) { const v = 200 + r() * 55; d.data[i] = v; d.data[i + 1] = v - 1; d.data[i + 2] = v - 4; d.data[i + 3] = 255; }
      c.putImageData(d, 0, 0); }
    // thin mist lying low over the water: drawn small and stretched, so it is soft
    // one soft round of mist, drawn many times over for the banks of mist that hide Help and the steps (build 106)
    puff = mk(64, 64); { const c = puff.getContext('2d'), g = c.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, css(tone(.93), 1)); g.addColorStop(.5, css(tone(.93), .6)); g.addColorStop(1, css(tone(.93), 0)); c.fillStyle = g; c.fillRect(0, 0, 64, 64); }
    // THE MIST ROUND HELP, build 118 (owner: "make fog / mist around help less circular"): one long bank baked once from
    // cloud noise: a ragged top, tall and thick at its left end (where Help stands) and lower and thinner to the right,
    // torn into wisps, its left edge uneven. No round shapes. Drawn small and stretched, so it is soft.
    fogBank = mk(360, 96); { const c = fogBank.getContext('2d'), d = c.createImageData(360, 96), col = tone(.93);
      for (let j = 0; j < 96; j++) for (let i = 0; i < 360; i++) {
        const u = i / 359, up = 1 - j / 95;
        const top = (.92 - .5 * smooth(.05, .9, u)) * (.72 + .56 * cloudN(u * 7 + 3, 9.5)) ;
        let a = smooth(0, .3, top - up) * (.5 + .7 * cloudN(i * .035, j * .1 + 20)) * (.75 + .5 * cloudN(i * .09 + 50, j * .22));
        a *= smooth(0, .05 + .07 * cloudN(up * 5, 31), u) * (1 - smooth(.55, 1, u)) * smooth(0, .2, up);      // it melts away downward over the water too
        const o = (j * 360 + i) * 4; d.data[o] = col[0]; d.data[o + 1] = col[1]; d.data[o + 2] = col[2]; d.data[o + 3] = 255 * clamp(a * 1.25);
      }
      c.putImageData(d, 0, 0); }
    threads = mk(240, 40); { const c = threads.getContext('2d'); 
      for (let i = 0; i < 7; i++) { const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, css(LIGHT, .5)); g.addColorStop(1, css(LIGHT, 0)); c.save(); c.translate((i * 67 + 20) % 240, 14 + (i % 3) * 6); c.scale(48, 5); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 1, 0, 7); c.fill(); c.restore(); } }
  }

  // ---------- the people ----------
  const HELPF = [], REACH = [], LIFT = [], PLIC = [], WADE = [], PSTOP = [], HWALK = [];
  const META = { help: { ax: 94, ground: 309 }, reach: { ax: 70, ground: 307 }, lift: { ax: 257, ground: 307 },
    climb: { ax: 363, ground: 342, top: 38, end: 440, sink: 39, c0: 168, top0: 143 },      // c0, top0: the middle and the head of him in the first frame (build 106)
    // Christian struggling through the mud (build 104): a loop, waist-deep in the video; ground = where his feet would be
    wade: { ax: 174, ground: 294 },
    // Pliable coming to a stop (build 115, one video, about 56 cents: first frame his walk frame 0, last frame his standing
    // picture one step further on): pack frames 0..49 he slows over two or three steps and stops (video 0..98), 50..119 he
    // stands breathing (video 100..238, played back and forth). ax/ground = where walk frame 0's ax and ground fall in the
    // pack, so frame 0 lies exactly on the walk frame; at the end his feet are STOPD further on
    stop: { ax: 100.8, ground: 308 },
    // HELP WALKS IN (build 119, owner: "can bring in help by walking"; the book, {31}: "a man came to him"): one video
    // (about 56 cents, right first time; first frame a striding frame of his kneel video, last frame his standing
    // picture; the camera still, he walks across). assets/help-walk.pack: 96 frames (every second video frame), each cut
    // round his own middle, so the pack holds no travel: HW_OFF is how far (pack px) each frame stands from where he
    // stops. The video's feet slid (he walked faster than he travelled), so HW_OFF was worked out from the planted foot
    // instead (each foot stays where it lands), not from where the video put him. ax/ground: the last frame lies exactly
    // on HELPF[0].
    hwalk: { ax: 92, ground: 317 } };
  const HW_OFF = [1106.2, 1097.2, 1084.2, 1072.2, 1059.2, 1046.2, 1033.2, 1020.2, 1007.2, 994.2, 981.2, 968.2, 955.2, 944.7, 930.7, 916.2, 902.7, 890.7, 877.7, 864.7, 851.7, 838.7, 825.2, 812.2, 799.2, 786.2, 773.2, 760.2, 747.2, 733.7, 719.2, 705.7, 693.2, 680.2, 667.2, 654.2, 641.2, 627.2, 614.2, 601.2, 588.2, 575.2, 562.2, 549.2, 535.2, 521.2, 506.7, 493.7, 480.2, 469.7, 456.7, 443.7, 429.7, 414.7, 401.7, 388.7, 375.2, 362.7, 351.2, 338.2, 325.2, 313.2, 301.2, 290.2, 279.2, 269.2, 256.2, 243.2, 231.7, 218.7, 208.2, 196.7, 187.2, 177.2, 167.7, 158.7, 145.7, 132.7, 119.7, 106.7, 93.7, 80.7, 67.7, 54.7, 41.7, 28.7, 24.0, 18.0, 14.0, 11.0, 7.5, 5.0, 3.0, 1.5, 1.0, 0.0];
  // where the stop video can begin (build 115, measured by shape overlap): for each walk frame, the stop video frame that
  // matches it best and how far ahead (pack px) that frame's figure stands, or null (no good match: walk on a frame or
  // two); and how far each of the first 50 stop frames' figure has come from walk frame 0's place (pack px; 72.5 standing)
  const STOP_ENTRY = [[0, 0], [1, 1], [1, 1], null, null, [33, 69], [14, 25], null, [15, 28], [16, 31], [16, 31], null, null, null, null, [29, 57], [29, 57], [30, 61], [31, 65], [12, 22], [32, 68], [13, 24], [33, 70], [14, 26], [15, 29], [15, 28], [16, 31], [16, 30], [17, 33], [17, 33], [0, -1], [0, -1]];
  const STOP_OFFS = [0, 0.1, 2.1, 4.1, 4.7, 5.2, 7.4, 9.8, 12.3, 13.8, 14.8, 17.1, 20.2, 22.3, 24.6, 28.5, 31.7, 34.5, 36.3, 37, 37.4, 39.8, 41.2, 42.1, 44, 46.5, 49.7, 52.5, 54.8, 56.5, 59.2, 63.3, 66.2, 68.5, 71.2, 75.1, 77.5, 78.7, 79.2, 79.2, 77.6, 76.1, 75, 74.7, 74.3, 73.8, 73.4, 72.8, 72.5, 72.5];
  const stopOff = t => (t >= 49 ? 72.5 : STOP_OFFS[Math.floor(t)]) * CHR_K, STOPD = 72.5 * CHR_K;
  // build 116 (owner, with a picture: "see how theres space between foot and ground!"): standing, his front foot is drawn
  // 14 pack px higher than his back foot (the pose is seen a little from the front), so it hung above the ground. As he
  // comes to rest he is set FOOT_DROP lower: the front foot meets the ground and the back foot overlaps it a little,
  // which reads as nearer to us (the owner's rule: feet overlapping the ground look right, a gap looks wrong)
  const FOOT_DROP = 0;      // build 118: his raised leg was lengthened in the pictures themselves (stop frames 41 on, and his standing picture), so both feet are level and nothing is lowered
  const HELP_SRC = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 136, 140, 144, 148, 152, 156, 160, 164, 168, 172, 176, 180, 184, 188, 192, 196, 200, 204, 208, 212, 216, 220, 224, 228, 232, 236];
  const REACH_SRC = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 128, 134, 140, 146, 152, 158, 164, 170, 176, 182, 188, 194, 200, 206, 212, 218, 224, 230, 236];
  const LIFT_SRC = [...Array(76).keys()].map(i => i * 2).concat([...Array(11).keys()].map(i => 156 + i * 8));
  const at = (src, t) => { let k = 0; while (k + 1 < src.length && src[k + 1] <= t) k++; return k; };
  let loading = null;
  // Pliable climbing out (builds 97, 101): one video of him heaving through the mud, facing right, drawn mirrored. sink = how much
  // deeper (game units) he is drawn while wading, since the video kept him only knee-deep; cut at the water line. META.climb: ax = the bank's edge, ground = the water
  // line, top = how high the bank stands in the video (pack pixels), end = where his feet are in the last frame. Without the pack
  // he wades to his own bank and rises out of the water as he walks into the mist.
  function preload() {
    if (!loading) loading = Promise.all([loadPack('help', HELPF), loadPack('help-walk', HWALK).catch(() => {}), loadPack('christian-reach', REACH), loadPack('lift', LIFT), loadPack('pliable-climb', PLIC).catch(() => {}), loadPack('christian-wade', WADE).catch(() => {}), loadPack('pliable-stop', PSTOP).catch(() => {})]).catch(() => {});
    return loading;
  }
  // the middle of Pliable in a frame of his climbing video (measured once per frame, on a small copy), to mirror him about himself
  const plCenC = {};
  function plCen(f) {
    if (plCenC[f] != null) return plCenC[f];
    const im = PLIC[f], w = 64, h = Math.round(64 * im.height / im.width), c = mk(w, h), k = c.getContext('2d'); k.drawImage(im, 0, 0, w, h);
    const d = k.getImageData(0, 0, w, Math.round(h * .8)).data; let sx = 0, sa = 0;      // the lower fifth is left out: splashes
    for (let i = 0; i < d.length; i += 4) { sx += d[i + 3] * ((i / 4) % w + .5); sa += d[i + 3]; }
    return plCenC[f] = sa ? sx / sa * im.width / w : META.climb.c0;
  }
  // one tinted figure, feet at world (x, y); nothing below the water line when `cut` (each figure has its own small canvas)
  const tintC = {};
  function figure(c, slot, im, meta, x, y, face, tint, cut, alpha = 1) {
    if (!im || alpha <= 0) return;
    const fc = tintC[slot] || (tintC[slot] = mk(8, 8)); if (fc.width !== im.width || fc.height !== im.height) { fc.width = im.width; fc.height = im.height; }
    const f = fc.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, fc.width, fc.height);
    f.drawImage(im, 0, 0); f.globalCompositeOperation = 'multiply'; f.fillStyle = css(tint); f.fillRect(0, 0, im.width, im.height);
    f.globalCompositeOperation = 'destination-in'; f.drawImage(im, 0, 0); f.globalCompositeOperation = 'source-over';
    c.save(); c.globalAlpha = alpha;
    if (cut) { c.beginPath(); c.rect(-1e5, -1e5, 2e5, 1e5); c.clip(); }
    c.translate(x, y); if (TALKM) c.transform(1, 0, TALKM.sh, 1, 0, 0);      // build 118: whoever is speaking leans a hair with his own voice (talkMove in index.html)
    c.scale(face * CHR_K, CHR_K * (TALKM ? TALKM.sy : 1)); c.drawImage(fc, -meta.ax, -meta.ground); c.restore();
  }

  // ---------- sound: the tune in the minor, low and slow on bowed tones ----------
  function bowed(midi, v = .05, d = 1.8, when = 0) {
    if (!audio()) return;
    const t = AC.currentTime + when, f = hz(midi), g = AC.createGain(), lp = AC.createBiquadFilter(), vib = AC.createOscillator(), vg = AC.createGain();
    lp.type = 'lowpass'; lp.frequency.value = 700 + midi * 6; lp.Q.value = .7;
    vib.frequency.value = 4.6; vg.gain.value = f * .006; vib.connect(vg);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .35); g.gain.setTargetAtTime(v * .7, t + .4, .4); g.gain.setTargetAtTime(0, t + d, .35);
    for (const dt of [-3, 3]) { const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt; vg.connect(o.frequency); o.connect(lp); o.start(t); o.stop(t + d + 2); }
    lp.connect(g); g.connect(OUT); g.connect(ECHO); vib.start(t); vib.stop(t + d + 2);
  }
  // Amazing Grace, the first three phrases, a step for each note: in G minor (B -> B flat, E -> E flat), an octave down.
  // It breaks off one phrase short at the far bank; the last phrase comes in the major as the steps light up.
  const m = { D: 50, E: 51, G: 55, A: 57, B: 58, d: 62 };
  const WADE_TUNE = 'D G B G B A G E D D G B G B A d B d B d B G D E G G E D'.split(' ').map(k => m[k]);
  const LAST = [62, 67, 71, 67, 71, 69, 67];             // "was blind, but now I see", in the major, as Level 1 sings it
  const sfxS = {
    wade: () => { hiss(520, .8, .05, .5, 'lowpass'); hiss(1500, 1.5, .012, .3, 'bandpass', .05); },
    fall: () => { hiss(380, .7, .16, 1.2, 'lowpass'); hiss(1800, 1, .05, .7); sweep(90, 45, 1.2, .08); },
    fear: () => { const r = Math.random() * 3 | 0; bowed(38 + r, .022, 3.5); bowed(39 + r, .016, 3.2, .4); hiss(900 + Math.random() * 600, 3, .006, 2.2, 'bandpass', .3); },
    strain: () => { hiss(300, .8, .07, .7, 'lowpass'); sweep(70, 52, .9, .05); },
    grip: () => { bowed(55, .045, 4); bowed(59, .04, 4, .05); bowed(62, .04, 4, .1); note(71, .07, 5); },
  };

  // ---------- state ----------
  let ph = 'plain', cam = { cx: 0, z: 1, wl: 440 }, look = { mist: 0, veil: 0, gold: 1, disc: 1, sky: 0 };
  let pli = null, help = null, mv = null, lift = null, rings = [], motes = [], steps = [], gloom = 0, gloomTo = 0, noteI = 0, lastFoot = 0;
  let prints = [], fogH = 1, fogS = 1, strain = 0, slipT = 0, fearT = 0, fearsSaid = false, goldT = 0, onwayT = 0, capsSaid = new Set(), nearSaid = false;
  const C2 = { x: START, y: 0, face: 1, anim: 12, alpha: 1, sink: 0, reach: 0, stand: 0, st: 0 };

  // the picture behind the title page when Level 2 is the child's level (build 119): the oak over the bog, nobody in it
  function title() {
    build(); preload(); SL.show = true; ph = 'plain'; help = null; mv = null; lift = null; pli = null; fogH = 0; steps = []; rings = []; motes = [];
    Object.assign(cam, { cx: -240, z: .6, wl: 392 }); Object.assign(look, { mist: .55, veil: 0, gold: .12, disc: 1, sky: .5 });
  }
  function start() {
    SL.on = true; SL.show = false; build(); preload();
    document.getElementById('title').style.display = 'none';
    document.getElementById('endc').className = 'card';
    document.body.classList.add('playing', 'slough'); G.opening = null; hush();
    Object.assign(G, { t: 0, capQ: [], cap: 0, hint: null, act: null, actT: 0, ring: null, auto: null, guard: 0, autoT: 0, taps: [], roll: { t: 999, x: 0, y: 0 }, ended: false });
    downs.clear(); keys.r = keys.push = false;
    ph = 'plain'; Object.assign(C2, { x: START, y: bankY(START) + 4, face: 1, anim: 12, alpha: 1, sink: 0, reach: 0, stand: 1, sd: QUIET[0], st: 0, faceA: 1, done: 0 });
    pli = { x: START - 80, y: 0, face: 1, anim: 0, alpha: 1, sink: 0, mode: 'follow', px: START - 80, stop: { t: 50, x0: START - 80 - 72.5 * CHR_K } };      // he starts standing (his stop video's breathing part)
    prints = []; fogH = 1; fogS = 1; help = null; mv = null; lift = null; rings = []; steps = []; gloom = gloomTo = 0; noteI = 0; strain = 0; slipT = 0; fearT = 300; fearsSaid = false; goldT = 0; onwayT = 0; capsSaid = new Set(); nearSaid = false;
    motes = [...Array(LAST.length)].map((_, i) => ({ ox: -30 - Math.random() * 50, oy: -112 - Math.random() * 40, x: START, y: -150, tw: Math.random() * 6, i }));
    // the steps through the bog, hidden until the lights settle on them: low flat stones, no two alike (from the approved still)
    const R = rngS(33); let sx = BANK0 - 6;
    LAST.forEach((nt, i) => { const w = 20 + R() * 20, h = 4 + R() * 4, lean = (R() - .5) * 10; sx -= w + 34 + R() * 34; steps.push({ x: sx, w, h, lean, nt, lit: 0, i }); sx -= w; });
    Object.assign(cam, { cx: START + 150, z: 1, wl: 440 });
    if (audio()) { AC.resume(); for (const [who, txt] of ALL) vox(who, txt); }
    G.state = 'wait'; setTimeout(() => { if (SL.on && G.state === 'wait') { G.state = 'play'; caption(OPEN.slice(0, 1)); } }, 1400);
  }
  // the Pliable talk is said while they walk, a line at a time, at places along the plain
  const OPEN_AT = [-2500, -2280, -2000, -1760];
  function choose2() {
    document.getElementById('chHome').textContent = 'Go back with Pliable';
    document.getElementById('chOn').textContent = 'Struggle on to the gate';
    choose();
  }
  function pick(home) {
    if (!home) { note(55, .04, 3); wadeOn(); return; }
    ph = 'back'; gloomTo = 1; C2.face = -1; G.state = 'auto';
  }
  function wadeOn() { ph = 'wade'; C2.face = 1; G.state = 'play'; caption(ALONE); }
  function finish() {
    G.state = 'end'; G.ended = false;
    const e = document.getElementById('endc');
    e.querySelector('h1').textContent = 'Out of the Slough';
    e.querySelectorAll('p')[0].textContent = 'Help set him upon sound ground, and he went on his way.';
    e.querySelectorAll('p')[1].textContent = 'Next: Mr. Worldly Wiseman';
    document.getElementById('on2').style.display = 'none';
  }
  // a touch: on the water it makes rings; in the act, Help's hand takes his
  const handPt = () => [HX - 82 * CHR_K, HY() - 55 * CHR_K];
  function touch(sx, sy) {
    const wx = (sx - VW / 2) / cam.z + cam.cx, wy = (sy - cam.wl) / cam.z;
    if (G.act === 'hand') { const [hx, hy] = handPt(); if (mv && mv.t >= 150 && Math.hypot(wx - hx, wy - hy) * cam.z < 120) grip(); else G.actT = Math.max(G.actT, 60); return; }
    if (wy > 0 && wx > WATER_L) { rings.push({ x: wx, y: Math.max(0, wy), t: 0, k: .7 }); sfxS.wade(); }
  }
  function grip() {
    if (G.act !== 'hand' || lift || !mv || mv.t < 150) return;
    lift = { t: 0 }; sfxS.grip(); G.ring = null; next(true); caption(DRAWN);
  }

  // ---------- each tick ----------
  function update() {
    gloom += (gloomTo - gloom) * .02; if (C2.sd != null) C2.sd += .4; for (const pr of prints) pr.t++; C2.faceA = clamp((C2.faceA ?? 1) + (C2.face - (C2.faceA ?? 1)) * .06, -1, 1);
    const want = G.state === 'play' && (keys.r || held());
    // --- Christian ---
    if (ph === 'plain' || ph === 'on') {
      // stop points for the words (owner, build 106; as in Level 1): while the storyteller or the two of them are still
      // speaking, he cannot reach the next place where new words begin (so nothing is cut off by the fall, or said late)
      let v = want ? MAXV : 0;
      if (v && ph === 'plain' && saying()) { const nx = Math.min(...OPEN_AT.filter((x, i) => !capsSaid.has(i)), nearSaid ? Infinity : -1300, FALL_X); if (C2.x + v >= nx - 1) v = 0; }
      // STOPPING AS IN LEVEL 1 (owner, build 114: the dissolve into standing "is jerky"): letting go, he finishes his
      // stride to walk frame 28 or 1, where his own stopping video joins (STD from 0, or from STAND_FROM_1), and that video
      // plays on into his quiet breathing; holding again starts the walk from frame 1. No dissolve. (C2.sd = the standing
      // video's clock, null while walking.)
      const fr0 = ((Math.floor(C2.anim) % CHR.length) + CHR.length) % CHR.length;
      if (v) { if (C2.sd != null) { C2.sd = null; C2.anim = 1; } }
      else if (C2.sd == null) { if (fr0 === 28 || fr0 === 1 || !STD.length) C2.sd = fr0 === 28 ? 0 : STAND_FROM_1; else v = MAXV; }
      C2.x += v;
      C2.anim = stepAnim(C2.anim, v, CHR_STEP, CHR_META); C2.y = bankY(C2.x) + 4 + MUDDY(C2.x);
      C2.stand = C2.sd != null ? 1 : 0;
      // faint wet footprints in the soft ground near the bog (owner's idea, build 114: "mud prints or feet sinking slightly")
      const fr1 = ((Math.floor(C2.anim) % CHR.length) + CHR.length) % CHR.length;
      if (ph === 'plain' && v && fr1 !== fr0 && CHR_META.rest.includes(fr1) && C2.x > -1700) prints.push({ x: C2.x + 8 + (fr1 === CHR_META.rest[0] ? 0 : 5), t: 0 });
      if (ph === 'plain') {
        OPEN_AT.forEach((x, i) => { if (C2.x > x && !capsSaid.has(i)) { capsSaid.add(i); caption([LEVEL2_OPENING[i]]); } });
        if (C2.x > -1300 && !nearSaid) { nearSaid = true; caption(NEAR); }
        if (C2.x >= FALL_X) { C2.stand = 0; C2.sd = null; ph = 'fall'; G.state = 'auto'; G.capQ.length = 0; C2.fallT = 0; sfxS.fall(); clearHint('walk'); }
        if (!G.walked && G.t > 400 && C2.x < START + 20) { G.walked = true; hint('walk', 'Hold to walk.'); }
        if (want) clearHint('walk');
      } else {
        C2.stand = clamp(C2.stand + (want ? -.08 : .04));
        if (C2.x > END_X - 300) C2.alpha = clamp((END_X - C2.x) / 300);
        if (C2.x >= END_X && G.state === 'play') finish();
      }
    }
    if ((ph === 'fall' || ph === 'pli') && C2.fallT < 340) {
      C2.fallT++; const top = smooth(0, 40, C2.fallT), topP = smooth(4, 44, C2.fallT);
      C2.sink = SINK * sunk(C2.fallT); C2.y = lerp(bankY(FALL_X) + 4, C2.sink, top);
      C2.x = lerp(FALL_X, WADE0, smooth(6, 210, C2.fallT));
      if (pli && (pli.mode !== 'climb' || pli.wal)) { pli.sink = PLI_SINK * sunk(C2.fallT - 4); pli.sy = lerp(bankY(pli.wx ?? pli.x) + 4, pli.sink, topP); if (pli.mode !== 'climb') pli.y = pli.sy; }
      // THEY WALLOW (build 119; the book, {29}: "they wallowed for a time"; owner: "can we [have] some flailing from both?
      // the in water action seems a little stale"): from the fall on, Christian heaves in his wading loop and Pliable in
      // the opening of his climbing video, played back and forth, with rings and a slosh; each is nearly still while one
      // of them speaks. Pliable faces Christian until his angry speech, then turns toward his own side.
      if (pli && pli.mode === 'in' && PLIC.length && C2.fallT >= 24) { pli.mode = 'climb'; pli.wal = true; pli.wk = 0; pli.fa = 1; pli.wx = pli.x; pli.wf = Math.floor(pli.anim) % (PLI.length || 1); }
      if (C2.fallT % 50 === 0) { rings.push({ x: C2.x, y: 0, t: 0, k: .7 }); if (pli && pli.mode !== 'climb') rings.push({ x: pli.x, y: 0, t: 0, k: .6 }); }
    }
    const calm = !!(SPK && SPK.who !== N);      // one of the two is speaking: they hold nearly still
    if (['fall', 'pli', 'backtalk'].includes(ph)) { C2.wa = (C2.wa || 0) + (calm ? .04 : .2); if (!calm && C2.fallT > 70 && G.t % 46 === 0) { rings.push({ x: C2.x + 12, y: 0, t: 0, k: .8 }); sfxS.wade(); } }
    if (ph === 'fall') {
      if (C2.fallT === 8 || C2.fallT === 14) { rings.push({ x: C2.x, y: 0, t: 0, k: 1.3 }); rings.push({ x: pli.x, y: 0, t: 0, k: 1.1 }); }
      if (C2.fallT === 120) { ph = 'pli'; talk(FALL, choose2); }
    } else if (ph === 'back') {
      C2.x -= .3; C2.anim += .3 / CHR_STEP * 2.6; C2.face = -1; footfall(); C2.wa = (C2.wa || 0) + .2;
      if (C2.x <= WADE0 - 60) { ph = 'backtalk'; talk(BACK, () => { C2.face = 1; wadeOn(); }); }
    } else if (ph === 'wade') {
      const v = want ? .32 : 0, p = clamp((C2.x - WADE0) / (STUCK_X - WADE0));
      C2.x = Math.min(STUCK_X, C2.x + v); C2.face = 1;
      C2.wa = (C2.wa || 0) + (v ? .2 : .07);
      if (v) { C2.anim += v / CHR_STEP * 2.6; footfall(); } else C2.anim = stepAnim(C2.anim, 0, CHR_STEP, CHR_META);
      // build 114 (owner: "make christian sink even further as he moves from one end of pond to other (till just head is
      // barely above water)"): deeper and deeper as he wades (DEEP below where he fell in, by the far bank only his head
      // shows); reaching up for Help's hand he heaves back up to where the grip needs him (see drawChr, 'help')
      C2.y = SINK + DEEP * smooth(0, .85, p);
      if (p > .45 && !fearsSaid) { fearsSaid = true; caption(FEARS); }
      if (--fearT <= 0) { fearT = 260 + Math.random() * 260; sfxS.fear(); }
      if (G.state === 'play' && !want && G.cap <= 0 && !G.capQ.length && G.t % 600 === 300) hint('wade', 'Hold to struggle on.');
      if (want) clearHint('wade');
      if (C2.x >= STUCK_X) { ph = 'stuck'; strain = 0; slipT = 0; }
    } else if (ph === 'stuck') {
      // (build 119: Help walks in while the storyteller says he came; he speaks when he has come)
      // THE HEART OF THE LEVEL: he cannot get out alone. Holding does nothing but strain; he slips back; then Help comes.
      slipT++;
      C2.wa = (C2.wa || 0) + (want ? .26 : .06);
      if (want) { strain++; C2.anim += .5; if (strain % 40 === 1) { sfxS.strain(); rings.push({ x: C2.x, y: 0, t: 0, k: .8 }); } }
      C2.x = STUCK_X - 4 * Math.max(0, Math.sin(slipT / 50)) * smooth(60, 160, slipT);
      if (strain > 230 || slipT > 420) { ph = 'help'; C2.x = STUCK_X; talk(STUCK, () => { help = { a: 0, t: 0, w: HWALK.length ? 0 : 1e9 }; talk(HELP.slice(0, 1), () => {}); }); }
    } else if (ph === 'help') {
      if (help && C2.reach < 1) C2.reach = Math.min(1, C2.reach + .05);
      if (help && help.w < HWALK.length - 1) help.w += .2;
      else if (help && !help.said && G.state === 'play') { help.said = true; talk(HELP.slice(1), () => {}); }
      if (lift) { lift.t = Math.min(236, lift.t + .4); if (lift.t >= 236) { ph = 'drawn'; C2.done = 0; C2.x = HX + (LIFT_CHR - META.lift.ax) * CHR_K; C2.y = bankY(C2.x) + 4; C2.face = 1; C2.faceA = 1; C2.stand = 1; C2.sd = QUIET[0]; } }
    } else if (ph === 'drawn') {
      // the lift's last picture dissolves into the two men standing apart, then he turns to look back
      C2.done = Math.min(1, C2.done + .03);
      // BUILD 106, the book's order ({32} then {35}): Help bids him go on his way first; only then is the dreamer told of
      // the steps, so he looks back and the lights settle on them after "Go on your way" (it was the other way round)
      if (C2.done >= 1 && ph === 'drawn' && G.state === 'play' && !saying()) { ph = 'onway'; talk(ONWAY, () => { C2.face = -1; ph = 'look'; goldT = 0; }); }
    } else if (ph === 'look') {
      goldT++;
      // the lights leave him one by one and settle on the steps, each a note of the last phrase
      motes.forEach((mo, i) => { if (!mo.to && goldT > 60 + i * 55) { mo.to = steps[i]; } });
      if (goldT === 60) caption(STEPS);
      if (goldT > 60 + LAST.length * 55 + 160 && !saying() && G.state === 'play') { C2.face = 1; ph = 'on'; hint('walk2', 'Hold to go on your way.'); }
    }
    if (ph === 'on' && want) clearHint('walk2');
    // MIST THAT HIDES (owner, build 106: "help appears out of nowhere. it would be nice if there were mist there hiding him
    // and it blows away - justifying why you can't see him. for that matter mist over the stones would justify why
    // christian can't see them and falls in"). A bank of mist lies on the far bank, where Help will stand; when Help comes
    // it drifts away to the right and thins (about 4 s, with a breath of wind) and he is seen coming out of it. A low mist
    // lies over the middle of the bog where the steps are (the book, {35}: "these steps are hardly seen"); it thins as the
    // lights settle on the steps.
    // build 115 (owner: "instead of making help appear can you have [the fog] move to the right and then as it clears you can see
    // [him] ... has physical explanation"): Help is there from the first, whole, inside the fog; the fog bank moves off to the
    // right and uncovers him, and only thins once it has moved on
    if (help) { if (fogH === 1) hiss(260, .5, .05, 3.5, 'lowpass'); fogH = Math.max(0, fogH - .0013); help.a = 1; }
    fogS = ph === 'look' ? 1 - smooth(60, 60 + LAST.length * 55 + 120, goldT) : ph === 'on' ? Math.max(0, fogS - .01) : fogS;
    if (mv) mv.t = Math.min(150, mv.t + .4);
    if (G.act === 'hand') { G.actT++; if (mv && mv.t >= 150 && !G.ring && G.actT > 20) { dMore.textContent = 'take his hand ✦'; const [hx, hy] = handPt(); G.ring = () => [(hx - cam.cx) * cam.z + VW / 2, cam.wl + hy * cam.z]; } }
    // --- Pliable ---
    if (pli) {
      if (pli.mode === 'follow') {
        // PLIABLE STOPS IN HIS OWN VIDEO (owner, build 115: his "transition not great ... new video would be worth it"): when
        // Christian stands, Pliable walks on to walk frame 0 (where the video begins) and the video brings him to a stop, then
        // he breathes; when Christian walks again, his standing frame dissolves quickly into his walk, from where he stood
        const halt = C2.sd != null && PSTOP.length > 0;
        if (pli.stop && !halt) { const t = pli.stop.t; pli.x = pli.stop.x0 + stopOff(t); pli.leave = { f: Math.min(Math.floor(t), PSTOP.length - 1), x: pli.stop.x0, a: 1 }; pli.stop = null; pli.anim = 0; }
        if (pli.stop) { pli.stop.t += .2; pli.y = bankY(pli.x) + 4 + MUDDY(pli.x); pli.st = 0; }
        else {
        const tx = C2.x - 80 - (halt ? 30 : 0), fNow = ((Math.floor(pli.anim) % PLI_META.frames) + PLI_META.frames) % PLI_META.frames;
        let v = clamp(tx - pli.x, 0, MAXV * 1.05);
        if (halt && v < .05) { const e = STOP_ENTRY[fNow]; if (e) pli.stop = { t: e[0], x0: pli.x - e[1] * CHR_K }; else v = MAXV; }      // into the stop video at the frame that matches his step (or a step on to one that does)
        if (!pli.stop) { pli.x += v; pli.anim = stepAnim(pli.anim, v, PLI_STEP, PLI_META); }
        pli.y = bankY(pli.x) + 4 + MUDDY(pli.x); pli.face = 1;
        }
        if (pli.leave && (pli.leave.a -= .12) <= 0) pli.leave = null;
        if (!PSTOP.length && !pli.stop) { const atRest = PLI_META.rest.includes(Math.floor(pli.anim) % PLI_META.frames); pli.st = clamp((pli.st || 0) + (pli.x !== pli.px2 ? -.1 : atRest && PLI_ST ? .06 : -.1)); } pli.px2 = pli.x;      // (without the video: the old dissolve)      // he stands too (build 110); build 114: the standing picture comes in over the walk frame, then the walk frame goes (no see-through middle)
        if (ph === 'fall') { pli.mode = 'in'; pli.st = 0; pli.stop = null; pli.leave = null; }
      } else if (pli.mode === 'climb' && PLIC.length && !pli.out) {
        // the video: he wades crossly to the bank, climbs up it and steps off; raised to meet the game's bank as he climbs
        // BUILD 106 (owner: "when pliable gets out sprite jumps around (skips locations)"): two jumps fixed. (1) At the end
        // he jumped 80 sideways into his walk: the video is drawn mirrored, so his feet in its last frame are LEFT of the
        // bank's edge (endX had the wrong sign). (2) At the start the video's first frame stood him about 36 to the right
        // of where he had sunk, and a little lower: that difference (dx0, dy0, measured once when the climb begins) is
        // carried and faded out over the first quarter of the climb, so he wades from where he was into the video's path.
        const M = META.climb, last = PLIC.length - 1, endX = HOME0 + (M.ax - M.end) * CHR_K;
        if (pli.ct == null) { pli.dx0 = pli.x - (HOME0 + (M.ax - M.c0) * CHR_K); pli.dy0 = (pli.y - (PLI_META.ground - 5) * CHR_K) - (M.sink - (M.ground - M.top0) * CHR_K); pli.c0 = 0; }
        if (pli.wal) {      // wallowing: the video's first three seconds back and forth, sinking with Christian
          pli.wt = (pli.wt || 0) + (calm ? .03 : .16); const L = 34, u = pli.wt % (2 * L); pli.ct = 2 + (u < L ? u : 2 * L - u); pli.c0 = pli.ct;
          pli.dy0 = ((pli.sy ?? pli.y) - (PLI_META.ground - 5) * CHR_K) - (M.sink - (M.ground - M.top0) * CHR_K); pli.wk = Math.min(1, pli.wk + .04);
        } else pli.ct = Math.min(last, (pli.ct || 0) + .2);
        pli.fa = (pli.fa ?? -1) + ((pli.turn ? -1 : 1) - (pli.fa ?? -1)) * .035;
        const p = pli.ct / last, fade = 1 - smooth(0, .25, (pli.ct - pli.c0) / Math.max(1, last - pli.c0));
        pli.face = -1; pli.x = HOME0 + pli.dx0 * fade; const up = smooth(.68, .85, p); pli.y = (1 - up) * M.sink + up * (bankY(endX) + 4 + M.top * CHR_K) + pli.dy0 * fade;
        if (p < .75 && G.t % (pli.wal ? 30 : 18) === 0 && !(pli.wal && calm)) rings.push({ x: pli.x + (M.ax - M.c0) * CHR_K * (1 - .6 * smooth(.25, .7, p)) + 40 * (Math.random() - .5), y: 0, t: 0, k: .7 + .5 * Math.random() });      // round him, wherever he is
        if (pli.ct >= last) { pli.out = true; pli.x = endX; pli.y = bankY(endX) + 4; pli.anim = 0; }
      } else if (pli.mode === 'climb') {
        // struggling back to the bank next to his own house, then out and away into the mist
        pli.face = -1; const v = pli.x > HOME0 + 10 ? .55 : .9; pli.x -= v; pli.anim += v / PLI_STEP * (pli.x > HOME0 ? 2.2 : 1);
        if (pli.x > HOME0) pli.y = PLI_SINK * clamp((pli.x - HOME0) / (PLI_FALL - HOME0)) + (1 - clamp((pli.x - HOME0) / (PLI_FALL - HOME0))) * (bankY(HOME0 - 30) + 4);
        else pli.y = bankY(pli.x) + 4;
        if (pli.x < PLI_FALL - 20 && pli.x > HOME0 + 30 && G.t % 30 === 0) rings.push({ x: pli.x, y: 0, t: 0, k: .9 });
        pli.alpha = clamp((pli.x - (HOME0 - 260)) / 180);
        if (pli.alpha <= 0) pli = null;
      }
    }
    // --- the lights he gathered: a slow cloud behind his shoulder; at the end they fly to the steps ---
    for (const mo of motes) {
      mo.tw += .03;
      if (mo.to) {
        const tx = mo.to.x, ty = -40 - (mo.to.nt - 62) * 5;
        mo.x += (tx - mo.x) * .04; mo.y += (ty - mo.y) * .04;
        if (!mo.to.lit && Math.hypot(tx - mo.x, ty - mo.y) < 6) { mo.to.lit = .01; note(mo.to.nt, .06, 4); rings.push({ x: tx, y: 0, t: 0, k: .6 }); }
      } else { mo.x += (C2.x + mo.ox * C2.face - mo.x) * .05; mo.y += (C2.y + mo.oy + Math.sin(mo.tw) * 6 - mo.y) * .05; }
    }
    for (const s of steps) if (s.lit) s.lit = Math.min(1, s.lit + .02);
    for (const r of rings) r.t++; rings = rings.filter(r => r.t < 150);
    // --- the camera draws back in the mire, and the look follows the story: gold on the plain, mist and grey in the bog ---
    let t, p = clamp((C2.x - FALL_X) / (STUCK_X - FALL_X));
    if (ph === 'plain') { const f = smooth(-1350, FALL_X, C2.x); t = { cx: lerp(C2.x + 150, -470, f), z: lerp(1, .8, f), wl: lerp(440, 392, f) }; }
    else if (['fall', 'pli', 'back', 'backtalk'].includes(ph)) t = { cx: -470, z: .8, wl: 392 };
    // build 114: the oak is bigger, so at the far bank the camera draws back a little more and the water line sits lower,
    // so the whole crown is in the picture (the top of the screen must be above about 640 units over the water: wl / z)
    else if (ph === 'wade' || ph === 'stuck') t = { cx: lerp(-470, -240, p), z: lerp(.8, .6, p), wl: lerp(392, 392, p) };
    else if (ph === 'help' || ph === 'drawn') t = { cx: -240, z: .6, wl: 392 };
    else t = { cx: Math.max(-330, C2.x + 120), z: .66, wl: 425 };
    const e = ph === 'plain' ? .06 : .02;
    cam.cx += (t.cx - cam.cx) * e; cam.z += (t.z - cam.z) * e; cam.wl += (t.wl - cam.wl) * e;
    let L;
    if (ph === 'plain') { const mi = smooth(-2050, -1000, C2.x); L = { mist: mi, veil: .84 * smooth(-1300, FALL_X, C2.x), gold: 1 - smooth(-2150, -1150, C2.x), disc: lerp(1, .3, mi), sky: lerp(0, 1, mi) }; }
    else if (ph === 'fall' || ph === 'pli' || ph === 'back' || ph === 'backtalk') L = { mist: 1, veil: .84, gold: 0, disc: .3, sky: 1 };
    else if (ph === 'wade' || ph === 'stuck' || ph === 'help') L = { mist: lerp(1, .3, p), veil: lerp(.84, 0, smooth(.3, 1, p)), gold: .1 * p, disc: lerp(.3, 1, p), sky: lerp(1, .5, p) };
    else if (ph === 'drawn') L = { mist: .3, veil: 0, gold: .1, disc: 1, sky: .5 };
    else L = { mist: .25, veil: 0, gold: ph === 'look' ? lerp(.1, 1, smooth(60, 60 + LAST.length * 55 + 120, goldT)) : ph === 'onway' ? .1 : 1, disc: 1, sky: .4 };
    for (const k in L) look[k] += (L[k] - look[k]) * .03;
    // --- sound: no rain here; a dark hum in the mist, a warm one in the gold, the burden's creak while he strains ---
    if (AC && G.t % 8 === 0) {
      const now = AC.currentTime;
      rainG.gain.setTargetAtTime(0, now, .8); padG.gain.setTargetAtTime(.04, now, .8);
      warmG.gain.setTargetAtTime(.05 * look.gold, now, .8); gloomG.gain.setTargetAtTime(.05 * look.mist + .04 * gloom, now, .8);
      MUFF.frequency.setTargetAtTime(20000, now, .3);
      creakG.gain.setTargetAtTime(ph === 'stuck' && want ? .03 : 0, now, .08); creakO.frequency.setTargetAtTime(48 + 14 * Math.sin(G.t / 13), now, .1);
      if (look.gold > .6 && Math.random() < .03) sfx.chirp();
    }
  }
  // a footfall in the water: rings, a slosh, and the next note of the tune
  function footfall() {
    const f = Math.floor(C2.anim) % CHR_META.frames, down = CHR_META.rest.includes(f);
    if (down && lastFoot !== f) {
      rings.push({ x: C2.x + 10 * C2.face, y: 0, t: 0, k: .75 }); sfxS.wade();
      if (ph === 'wade' && noteI < WADE_TUNE.length) bowed(WADE_TUNE[noteI++], .05, 1.9);
    }
    lastFoot = down ? f : -1;
  }

  // ---------- drawing ----------
  let nearC = null;
  function draw() {
    if (!nearC || nearC.width !== cv.width || nearC.height !== cv.height) nearC = mk(cv.width, cv.height);
    const { z, cx, wl } = cam, hor = wl - 140 * z, S = DPR;
    const X = x => (x - cx) * z + VW / 2, Y = y => wl + y * z;
    const warmth = look.gold, lightCol = mix(LIGHT, GOLD, warmth * .8);
    // the far light: in the oak's branches when he is near, far off over the plain before
    const near = smooth(-1300, -250, cx);
    const discX = lerp(VW / 2 + (OAK_X + 72 * OAK_S - cx) * z * .12, X(OAK_X + 72 * OAK_S), near), discY = lerp(150, Y(-258 * OAK_S), near);      // the far light in the oak's branches
    ctx.setTransform(S, 0, 0, S, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // sky: the clear one, the misty one over it
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(skyClear, 0, 0, VW, hor + 1);
    ctx.globalAlpha = clamp(look.sky * .6 + look.mist * .4); ctx.drawImage(skyMist, 0, 0, VW, hor + 1); ctx.globalAlpha = 1;
    if (warmth > .02) { ctx.globalCompositeOperation = 'soft-light'; const g = ctx.createRadialGradient(discX, discY, 10, discX, discY, 700); g.addColorStop(0, css(GOLD, .7 * warmth)); g.addColorStop(1, css(GOLD, .15 * warmth)); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, hor + 1); ctx.globalCompositeOperation = 'source-over'; }
    if (gloom > .01) { ctx.fillStyle = css(DARK, .3 * gloom); ctx.fillRect(0, 0, VW, hor + 1); }
    const disc = look.disc * (1 - .5 * gloom);
    glow(ctx, discX, discY, 210, lightCol, .5 * disc); glow(ctx, discX, discY, 70, lightCol, .7 * disc);
    ctx.fillStyle = css(mix(LIGHT, GOLD, warmth * .35), .9 * disc); ctx.beginPath(); ctx.arc(discX, discY, 15 * z / .66, 0, 7); ctx.fill();
    // the water (or, over the plain, the far fields): pale under the mist at the horizon, deeper toward us
    { const g = ctx.createLinearGradient(0, hor, 0, VH); g.addColorStop(0, css(tone(.95))); g.addColorStop(.3, css(tone(lerp(.84, .9, look.mist))));
      g.addColorStop(1, css(tone(lerp(.5, .66, look.mist)))); ctx.fillStyle = g; ctx.fillRect(0, hor, VW, VH - hor); }
    glow(ctx, discX, 2 * hor - discY + 30, 150, lightCol, .4 * disc);
    if (warmth > .3) { ctx.globalCompositeOperation = 'soft-light'; glow(ctx, discX, hor + 40, 520, GOLD, .5 * warmth); ctx.globalCompositeOperation = 'source-over'; }
    // far shore, and the ghost trees, each with a short reflection
    ctx.fillStyle = css(tone(.86)); ctx.beginPath(); ctx.moveTo(0, hor + 1);
    for (let x = 0; x <= VW; x += 8) ctx.lineTo(x, hor - 3 - 9 * z * cloudN((x / z + cx * .3) * .004, 3)); ctx.lineTo(VW, hor + 1); ctx.fill();
    for (const g of GHOSTS) {
      const s = z * g.p * .9, gx = (g.x - cx * g.p) * z + VW / 2, gy = hor + (wl - hor) * g.p * .55;
      if (gx < -260 || gx > VW + 260) continue;
      putTree(ctx, g.b, gx, gy, s); ctx.globalAlpha = .3; putTree(ctx, g.b, gx, gy, s, -s * .7); ctx.globalAlpha = 1;
    }
    // mist lying on the far water, hiding the horizon
    { const g = ctx.createLinearGradient(0, hor - 90, 0, wl + 20); g.addColorStop(0, css(LIGHT, 0)); g.addColorStop(.5, css(LIGHT, .35 + .6 * look.mist)); g.addColorStop(.75, css(LIGHT, .25 + .5 * look.mist)); g.addColorStop(1, css(LIGHT, 0));
      ctx.fillStyle = g; ctx.fillRect(0, hor - 90, VW, wl + 110 - hor); }

    // --- everything near, painted apart so the water can mirror it: banks, oak, people, steps, lights ---
    const n = nearC.getContext('2d'); n.setTransform(1, 0, 0, 1, 0, 0); n.clearRect(0, 0, nearC.width, nearC.height);
    n.setTransform(S * z, 0, 0, S * z, S * (VW / 2 - cx * z), S * wl);
    const x0 = cx - VW / 2 / z - 20, x1 = cx + VW / 2 / z + 20, land = tone(.065), fig = mix(tone(.3 - .1 * warmth), [70, 54, 34], .25 * warmth);
    n.fillStyle = css(land); n.beginPath(); n.moveTo(x0, 0); for (let x = x0; x <= x1; x += 5 / z) n.lineTo(x, bankY(x)); n.lineTo(x1, 0); n.fill();
    // build 114 (owner: "tree trunk too close to help (and not tall enough?) his position is obscured slightly by trunk.
    // should tree be enlarged overall maybe"): the oak stands further right (OAK_X) and a little bigger (OAK_S)
    if (X(OAK_X - 420 * OAK_S) < VW + 50 && X(OAK_X + 330 * OAK_S) > -50) putTree(n, OAK, OAK_X, bankY(OAK_X) + 4, OAK_S);
    // the steps, once lit
    for (const s of steps) if (s.lit) { n.globalAlpha = s.lit; n.fillStyle = css(land); n.beginPath(); n.moveTo(s.x - s.w, 1); n.quadraticCurveTo(s.x - s.w * .8 + s.lean, -s.h * 1.5, s.x + s.lean, -s.h); n.quadraticCurveTo(s.x + s.w * .85, -s.h * .6, s.x + s.w, 1); n.fill(); n.globalAlpha = 1; }
    // Pliable
    TALKM = talkMove(PL);
    if (pli) {
      if (PLIC.length && pli.mode === 'climb' && !pli.out) {
        // wallowing he faces Christian (the same frames, mirrored about his own middle), then turns to his own side
        const im = PLIC[Math.floor(pli.ct || 0)], wk = pli.wal ? pli.wk : 1, fl = (1 - (pli.fa ?? -1)) / 2, cw = 2 * (META.climb.ax - plCen(Math.floor(pli.ct || 0))) * CHR_K;
        if (wk < 1) figure(n, 'pli0', PLI[pli.wf || 0], PLI_META, pli.wx, pli.sy, 1, fig, true, pli.alpha * (1 - smooth(.5, 1, wk)));
        if (fl < .99) figure(n, 'pli2', im, META.climb, pli.x + cw, pli.y, 1, fig, true, pli.alpha * smooth(0, .5, wk) * (1 - smooth(.5, 1, fl)));
        if (fl > .01) figure(n, 'pli', im, META.climb, pli.x, pli.y, -1, fig, true, pli.alpha * smooth(0, .5, wk) * smooth(0, .5, fl));
      }
      else if (pli.stop && pli.mode === 'follow' && PSTOP.length) {
        const t = pli.stop.t, L = PSTOP.length - 50, f = t < 50 ? Math.floor(t) : 50 + Math.floor(((u => u < L ? u : 2 * L - u))((t - 50) % (2 * L)));
        figure(n, 'plistop', PSTOP[Math.min(PSTOP.length - 1, f)], META.stop, pli.stop.x0, pli.y + FOOT_DROP * smooth(38, 49, t), pli.face, fig, pli.y > 2, pli.alpha);
      }
      else {
        if (pli.leave && pli.mode === 'follow') figure(n, 'plileave', PSTOP[pli.leave.f], META.stop, pli.leave.x, pli.y + FOOT_DROP * smooth(38, 49, pli.leave.f), pli.face, fig, pli.y > 2, pli.alpha * pli.leave.a);
        const st = pli.mode === 'follow' && PLI_ST ? pli.st || 0 : 0;
        if (st < 1) figure(n, 'pli', PLI[Math.floor(pli.anim) % (PLI.length || 1)], PLI_META, pli.x, pli.y, pli.face, fig, pli.y > 2 && !(PLIC.length && pli.mode === 'climb'), pli.alpha * (1 - smooth(.5, 1, st)));
        if (st > 0) figure(n, 'plist', PLI_ST, PLI_ST_META, pli.x, pli.y, pli.face, fig, pli.y > 2, pli.alpha * smooth(0, .5, st));
      }
    }
    // Help: he comes out of the mist on the far bank, steps to the edge, kneels and holds out his hand
    TALKM = null;
    const vt = mv ? mv.t : 0, lt = lift ? lift.t : -1, mixIn = lift ? clamp(lt / 3.2) : 0, talkH = talkMove(H), talkC = talkMove(C);
    if (ph === 'drawn' || ph === 'look' || ph === 'onway' || ph === 'on') {
      const d = ph === 'drawn' ? C2.done : 1;
      if (d < 1) figure(n, 'lift', LIFT[LIFT.length - 1], META.lift, HX, HY(), 1, fig, true, 1 - d);
      TALKM = talkH; figure(n, 'help', HELPF[0], META.help, HX + (LIFT_HELP - META.lift.ax) * CHR_K, HY(), 1, fig, false, d);
      TALKM = talkC; drawChr(n, fig, d); TALKM = null;
    } else {
      TALKM = vt > 0 ? null : talkH;      // not while he kneels and reaches: his hand must stay where Christian's meets it
      if (help && help.w < HWALK.length - 1) { const f = Math.floor(help.w), hx = HX + HW_OFF[f] * CHR_K; figure(n, 'help', HWALK[f], META.hwalk, hx, bankY(hx) + 4, 1, fig, false, help.a); }
      else if (help && mixIn < 1) figure(n, 'help', HELPF[at(HELP_SRC, vt)], META.help, HX, HY(), 1, fig, false, help.a * (1 - mixIn));
      TALKM = null;
      if (lift) figure(n, 'lift', LIFT[at(LIFT_SRC, lt)], META.lift, HX, HY(), 1, fig, true, mixIn);
      TALKM = C2.reach > 0 ? null : talkC; if (!lift || mixIn < 1) drawChr(n, fig, 1 - mixIn); TALKM = null;
    }
    // the lights he gathered
    // FEET IN THE SOFT GROUND (owner, build 114: feet "floating above ground a little - maybe sink them in a bit", and
    // the idea of "mud prints or feet sinking slightly in mud"): the land's own edge is laid again over the bottom of
    // everyone standing on it, a little ragged, so feet sink slightly into the ground; and faint wet prints (a little
    // sky caught in them) are left in the soft ground near the bog
    n.fillStyle = css(land); n.beginPath(); n.moveTo(x0, 0); for (let x = x0; x <= x1; x += 3 / z) n.lineTo(x, bankY(x) < -2 ? bankY(x) - 1.2 - 1.6 * bankN(x * .09, 2) : 0);      // build 115: only on real ground (it ran as a dark line along the bog) n.lineTo(x1, 0); n.fill();
    for (const pr of prints) { const a = .22 * (1 - smooth(900, 1600, pr.t)); if (a < .01) continue; n.fillStyle = css(LIGHT, a); n.beginPath(); n.ellipse(pr.x, bankY(pr.x) + 1.2, 6, .9, 0, 0, 7); n.fill(); }
    // build 114 (owner: "not sure about light dots above pliable's head"): the lights he gathered are no longer shown
    // following him; they first appear behind his shoulder when he looks back, and fly to the steps
    for (const mo of motes) { if (!mo.to && ph !== 'look') continue; const a = (.55 + .3 * Math.sin(mo.tw * 1.7)) * (ph === 'look' ? smooth(0, 50, goldT) : 1); mote(n, mo.x, mo.y, mo.to ? 3 : 1.8, mo.to ? 1 : a); }
    ctx.drawImage(nearC, 0, 0, VW, VH);
    // --- the mirror: the near picture upside down under the water line, in thin strips that wander more the nearer they are ---
    const wx0 = Math.max(0, X(WATER_L));
    if (wx0 < VW) {
      for (let y = 0; y < VH - wl; y += 2) {
        const d = y / (VH - wl), dx = (wob(y * .21 + G.t * .004, 2) - .5) * (1.5 + 13 * d) + Math.sin(y * .9 + G.t * .02) * d * 1.6;
        ctx.globalAlpha = lerp(.82, .5, d);
        ctx.drawImage(nearC, wx0 * S, Math.max(0, (wl - y - 2)) * S, (VW - wx0) * S, 2 * S, wx0 + dx, wl + y, VW - wx0, 2);
      }
      ctx.globalAlpha = 1;
    }
    // over the plain the near ground is land, not water: it ends in a soft edge where the bog begins
    if (wx0 > 0) { const g = ctx.createLinearGradient(wx0 - 10, 0, wx0 + 140 * z, 0); g.addColorStop(0, css(land)); g.addColorStop(1, css(land, 0)); ctx.fillStyle = g; ctx.fillRect(0, wl - 1, Math.min(VW, wx0 + 140 * z), VH - wl + 1); }
    // rings in the water
    for (const r of rings) {
      const u = r.t / 150, cxr = X(r.x), cyr = wl + 2 + r.y * z;
      for (let i = 1; i <= 2; i++) { const rx = (10 + i * 16 + u * 70) * z * r.k, a = (1 - u) * (1 - i * .3);
        ctx.lineWidth = 1.1; ctx.strokeStyle = css(LIGHT, .6 * a); ctx.beginPath(); ctx.ellipse(cxr, cyr, rx, rx * .11, 0, 0, 7); ctx.stroke();
        ctx.strokeStyle = css(DARK, .22 * a); ctx.beginPath(); ctx.ellipse(cxr, cyr + 1.6, rx, rx * .11, 0, 0, Math.PI); ctx.stroke(); }
    }
    // the banks of mist (see "MIST THAT HIDES" in update)
    // bank(from, to, base, height, size of each puff, strength, how many, seed, flat): soft rounds of mist laid between
    // two places along the level, thicker low down; each drifts a little
    const bank = (xa, xb, y0, h, rad, a, n, seed, flat) => { if (a <= .01) return; const R = rngS(seed);
      for (let i = 0; i < n; i++) { const u = R(), v = R() * R(), r = (.6 + .5 * R()) * rad * z, e = flat ? .25 + .15 * R() : .55 + .3 * R(), ph = R() * 6, k = .35 + .3 * R();
        const x = X(xa + u * (xb - xa) + Math.sin(G.t * .003 + ph) * 8), y = Y(y0 - v * h);
        if (x + r < 0 || x - r > VW) continue;
        ctx.globalAlpha = Math.min(1, a * k); ctx.drawImage(puff, x - r, y - r * e, 2 * r, 2 * r * e); }
      ctx.globalAlpha = 1; };
    // the mist round Help: one soft dense veil just to the right of where he stands (Christian, stuck close by on the
    // left, stays clear of it), with a few slow puffs in it; it drifts right as it thins
    // build 114 (owner: "fog hiding help is too localized - would be nice if it spread more to the right and looked more
    // natural"): a long bank of mist lies along the far shore from where Help will stand far off to the right, highest
    // and thickest at his place and lower and thinner further right, with slow soft rounds drifting in it; it all drifts
    // right as it thins
    // build 118: the long ragged bank (fogBank), laid twice so it is dense enough to hide him, the second a little wider
    // and slower so the two slide over each other as it moves off to the right and thins
    if (fogH > .01) { const go = smooth(0, .85, 1 - fogH) * 520, a = smooth(0, .45, fogH), by = Y(64);
      ctx.imageSmoothingEnabled = true;
      ctx.globalAlpha = a; ctx.drawImage(fogBank, X(HX - 105 + go), by - 345 * z, 1250 * z, 345 * z);
      ctx.globalAlpha = a * .8; ctx.drawImage(fogBank, X(HX - 95 + go * 1.25 + Math.sin(G.t * .004) * 10), by - 305 * z, 1500 * z, 305 * z);
      ctx.globalAlpha = 1; }
    // the low mist over the middle of the bog, where the steps are: wide, flat and smooth
    // build 115 (owner: "fog clears to reveal them instead of them appearing out of nowhere"): the low mist over the
    // steps is laid step by step; over each step it moves off to the right and thins as that step's light lands (s.lit),
    // so the stones are uncovered in place, one by one, from the far bank back toward the plain. Straight across, flat
    // (an arc toward us was offered and advised against: it would bring back the perspective the picture avoids)
    for (const st of steps) { const c = st.lit || 0; bank(st.x - 70 + c * 90, st.x + 70 + c * 90, 12, 10, 120, (1 - smooth(0, 1, c)) * (.55 + .3 * look.mist) * (ph === 'look' || ph === 'on' ? 1 : fogS), 6, 11 + st.i, true); }
    ctx.globalAlpha = .55 * look.mist; { const o = (G.t * .15) % VW; ctx.drawImage(threads, -o, wl - 22, VW, 40); ctx.drawImage(threads, VW - o, wl - 22, VW, 40); } ctx.globalAlpha = 1;
    if (look.veil > .01) { const g = ctx.createLinearGradient(VW * .42, 0, VW, 0); g.addColorStop(0, css(LIGHT, 0)); g.addColorStop(.55, css(tone(.93), look.veil * .86)); g.addColorStop(1, css(tone(.93), look.veil)); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); }
    // the gold coming back from the oak outward
    if (warmth > .01) { ctx.globalCompositeOperation = 'soft-light'; const g = ctx.createRadialGradient(discX, discY + 60, 20, discX, discY + 60, 760);
      g.addColorStop(0, css(GOLD, .8 * warmth)); g.addColorStop(.55, css(GOLD, .4 * warmth)); g.addColorStop(1, css(GOLD, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); ctx.globalCompositeOperation = 'source-over'; }
    // the edges burned in as in a darkroom print, and paper grain
    { const g = ctx.createRadialGradient(VW * .5, VH * .5, VH * .42, VW * .5, VH * .5, VW * .78); g.addColorStop(0, css(DARK, 0)); g.addColorStop(1, css(DARK, .5 + .2 * gloom)); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
      const t = ctx.createLinearGradient(0, 0, 0, VH * .3); t.addColorStop(0, css(DARK, .28)); t.addColorStop(1, css(DARK, 0)); ctx.fillStyle = t; ctx.fillRect(0, 0, VW, VH * .3); }
    ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .13; ctx.fillStyle = ctx.createPattern(paper, 'repeat'); ctx.fillRect(0, 0, VW, VH);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    // touches, the ring that shows where to touch, the things he carries
    for (const tp of G.taps) { tp.t++; ctx.strokeStyle = css(LIGHT, .5 * (1 - tp.t / 40)); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); ctx.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    if (G.ring) { const [x, y] = G.ring(); ctx.strokeStyle = '#ffe6ae'; ctx.lineWidth = 2; for (const k of [0, .5]) { const q = (G.t / 80 + k) % 1; ctx.globalAlpha = .65 * (1 - q); ctx.beginPath(); ctx.arc(x, y, 14 + q * 40, 0, 6.2832); ctx.stroke(); } ctx.globalAlpha = 1; }
    if (SL.on) drawItems();
  }
  const wob = noise2(9);
  function glow(c, x, y, r, col, a) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, css(col, a)); g.addColorStop(.35, css(col, a * .45)); g.addColorStop(1, css(col, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function mote(c, x, y, r, a) { glow(c, x, y, r * 7, GOLD, a * .6); c.fillStyle = css(mix(GOLD, LIGHT, .5), a); c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  // Christian: walking (cut at the water line while he is in it), reaching up to Help, or standing on sound ground
  function drawChr(n, fig, alpha) {
    if (alpha <= 0) return;
    const inWater = C2.y > 2 && ph !== 'look' && ph !== 'onway' && ph !== 'on' && ph !== 'drawn';
    let walkIm = CHR[((Math.floor(C2.anim) % CHR.length) + CHR.length) % CHR.length], walkM = CHR_META;
    // in the mire he heaves and struggles (one video loop) instead of walking
    const wk = ph === 'fall' ? smooth(20, 50, C2.fallT) : 1; let wa = 1;      // build 119: he flounders from the fall on
    if (WADE.length && inWater && wk > 0 && ['fall', 'pli', 'back', 'backtalk', 'wade', 'stuck', 'help'].includes(ph)) {
      if (wk < 1) figure(n, 'chr0', walkIm, CHR_META, C2.x, C2.y, C2.face, fig, true, alpha * C2.alpha * (1 - smooth(.5, 1, wk)));
      walkIm = WADE[Math.floor(C2.wa || 0) % WADE.length]; walkM = META.wade; wa = smooth(0, .5, wk); }
    if (ph === 'help' && C2.reach > 0) {
      const gx = HX + GRASP.dx * CHR_K, gy = STUCK_Y() + (C2.y - STUCK_Y()) * (1 - smooth(20, 140, mv ? mv.t : 0));      // he heaves up out of the deep as he reaches (build 114)
      if (C2.reach < 1) figure(n, 'chr', walkIm, walkM, C2.x, C2.y, 1, fig, true, alpha * (1 - C2.reach));
      figure(n, 'reach', REACH[at(REACH_SRC, mv ? mv.t : 0)], META.reach, gx, gy, 1, fig, true, alpha * C2.reach);
      return;
    }
    if (C2.stand > 0 && STD.length) {
      const im = STD[atTime(STD_META, breathT(C2.sd ?? QUIET[0] + G.t * .4))], fr = (1 + C2.faceA) / 2;
      const cutS = C2.y > 2;
      if (fr > .01) figure(n, 'std', im, STD_META, C2.x, C2.y, 1, fig, cutS, alpha * C2.stand * C2.alpha * fr);
      if (fr < .99) figure(n, 'std2', im, STD_META, C2.x, C2.y, -1, fig, cutS, alpha * C2.stand * C2.alpha * (1 - fr));
      if (C2.stand < 1) figure(n, 'chr', walkIm, CHR_META, C2.x, C2.y, C2.face, fig, false, alpha * (1 - C2.stand) * C2.alpha);
      return;
    }
    figure(n, 'chr', walkIm, walkM, C2.x, C2.y, C2.face, fig, inWater, alpha * C2.alpha * wa);
  }

  // for testing: SL.peek() tells where the story is
  // oakPic: the great oak baked small in one colour, for Level 1's far glimpse of the Slough (index.html, drawFarSlough)
  return { on: false, show: false, title, start, update, draw, touch, grip, pick, preload, lines: ALL, oakPic: (col, k) => bakeTree(oak(18), col, k), peek: () => ({ ph, x: C2.x, y: C2.y, mv: mv && mv.t, lift: lift && lift.t, pli: pli && pli.mode, plx: pli && Math.round(pli.x), plStop: !!(pli && pli.stop), cam }) };
})();
