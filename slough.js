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
  const OPEN = LEVEL2_OPENING;      // build 368: the storyteller's "went talking over the plain" cut (the picture shows it)      // {25} to {28}
  const NEAR = [];      // build 368: cut (the picture shows the bog coming)
  const FALL = [      // {29}, {30}
    [N, 'Not looking where they went, they fell into the bog. Its name was Despond.'],
    [PL, 'Ah, neighbor Christian, where are you now?'],
    [C, 'Truly, I do not know.'],
    [PL, 'Is this the happiness you told me of? You can have your fine country all to yourself!', null, () => { if (pli) pli.turn = 1; }],      // he turns from Christian toward his own side
    [N, 'He struggled out on his own side, and Christian saw him no more.', null, () => { pli.mode = 'climb'; pli.wal = false; pli.turn = 1; }],
  ];
  // the choice is ours, not the book's (as in Level 1): going back loses nothing
  const BACK = [
    [N, 'Christian turned back toward his own house. The mist grew thick and dark.'],
    [C, 'No. I must struggle on, toward the gate.', null, () => { gloomTo = 0; }],
  ];
  const ALONE = [[N, 'So Christian was left alone.']];      // {31}
  const FEARS = [[N, 'Many fears and doubts came over him, and settled in that place.']];      // {33}: the fears are sound only, and this one line
  const STUCK = [[N, 'But at the far side he could not get out, because of the burden on his back.']];      // {31}
  const HELP = [      // {31}, {32}
    [N, 'Then a man came to him, whose name was Help.'],
    [H, 'Why did you not look for the steps?'],      // build 368: "What are you doing there?" and Christian's answer cut
    [C, 'Fear followed me so hard that I fled the nearest way, and fell in.'],
    [H, 'Give me your hand.', 'hand', () => { mv = mv || { t: 0 }; mv.to = 150; C2.handGo = true; }],      // he is already down on his knee: now he holds out his hand
  ];
  const DRAWN = [];      // {32}
  const STEPS = [[N, 'There were good steps through the middle of the bog, but in the mist they were hard to see.']];      // {35}
  const ONWAY = [[H, 'Go on your way.']];      // {32}: "and bid him go on his way"
  const ALL = [...OPEN, ...NEAR, ...FALL, ...BACK, ...ALONE, ...FEARS, ...STUCK, ...HELP, ...DRAWN, ...STEPS, ...ONWAY];

  // one patch of mud seen edge-on: a long flat shape with a wavy top and bottom (build 293's far mud, used near and far)
  function wavy(c, sx, gy, w, hUp, hDn, s) {
    const N = Math.max(6, Math.round(w / 6)); c.moveTo(sx, gy);
    for (let i = 0; i <= N; i++) { const u = i / N; c.lineTo(sx + w * u, gy - hUp * Math.pow(Math.sin(Math.PI * u), .45) * (.65 + .35 * Math.sin(u * 9 + s))); }
    for (let i = N; i >= 0; i--) { const u = i / N; c.lineTo(sx + w * u, gy + hDn * Math.pow(Math.sin(Math.PI * u), .6) * (.6 + .4 * Math.sin(u * 13 + s * 2))); }
    c.closePath();
  }
  // ---------- the land ----------
  const bankN = noise2(4), cloudN = noise2(21);
  // how much standing water there is across the slough (0 by the home bank .. 1 by the far bank), and whether a place
  // (x along the level, yy down the picture from the surface line) is pool (1) or mud (0): see mudMap in build()
  const wetAt = x => smooth(-800, -215, x);
  // (the noise runs between about .3 and .7, so the threshold crosses that range slowly from one bank to the other: a few
  // small pools at first, more and bigger ones further on, open water at last; long across and thin down the picture,
  // since pools are seen edge-on)
  const BANK0 = -160, HOME0 = -1010;                       // where each bank meets the water
  const poolT = (x, yy) => { const w = smooth(-770, -225, x); return .86 - .52 * w - .13 * (1 - w) * smooth(30, 90, yy); };      // build 257: near the home bank a few pools open in the foreground too (the mud under the men stays mud)
  const poolN = (x, yy) => .72 * cloudN(x * .009, yy * .3 + 3) + .28 * cloudN(x * .024 + 9, yy * .55 + 1);      // build 260: less of the fine noise (fewer small islands: the critics' "camouflage")
  const poolAt = (x, yy) => { const T = poolT(x, yy), n = poolN(x, yy); return smooth(T - .06, T + .06, n) * mudEnd(x) + (1 - mudEnd(x)); };      // build 260: a softer edge (it stair-stepped)
  const MUD_X0 = -1250, MUD_W = 1450, MUD_H = 270, MUDK = 1;      // (build 296 tried 2: about 5 s more to bake, too slow)
  // build 260: the map runs on under the far bank and fades there (it ended in a straight upright seam at BANK0)
  const mudEnd = x => 1 - smooth(BANK0 - 40, BANK0 + 170, x);      // build 203: the map runs from where the water begins (WATER_L): by the home bank it is all mud, no mirror (a paler column showed under Pliable where the mirror faded in)
    const WATER_L = -1250;                                  // the water in front of everything begins here; to the left is the plain
  // build 121 (owner: "feet connecting with ground once Christian hits the right side is a continuous problem"): the far
  // bank rose steadily from its edge, so everyone on it stood and walked on a slope and one foot always hung in the
  // air. It now has a short face, then a LEVEL shelf where the two men stand, then only a slow rise to the oak.
  // (HOME0 was -905: the home bank is 105 further left, so they are well into the slough when they fall, and Pliable
  // has a way to struggle back: owner, "pliable should be further into slough before he exits")
  const bankY = x => x >= BANK0 - 12 ? -(8 * smooth(BANK0 - 12, BANK0 + 12, x) + (22 + (bankN(x * .012, 1) - .5) * 12) * smooth(BANK0 + 190, BANK0 + 600, x))
                   : x <= HOME0 + 55 ? -(20 * smooth(HOME0 + 55, HOME0 + 15, x) + (bankN(x * .012, 7) - .5) * 10 * smooth(HOME0 - 10, HOME0 - 130, x)) : 0;
  // build 118 (owner: "check the pliable leaving - making sure feet are always in contact with ground"): the home bank used
  // to rise slowly over 90 units, but Pliable's climbing video hauls him up a bank with a short steep face, so for a few
  // steps after he stood up his feet were in the air beyond the land's end. The bank now has that short face, standing
  // where the video's bank stood, at its full height by HOME0 + 15
  const hum = x => x > BANK0 ? smooth(BANK0 + 230, BANK0 + 480, x) * (4 + 16 * bankN(x * .0045, 9)) : smooth(HOME0 - 160, HOME0 - 380, x) * (3 + 12 * bankN(x * .0045, 3));
  const START = -2100, FALL_X = -760, PLI_FALL = -840, END_X = 470;      // build 368 (owner: "you can shorten walking path too"): START was -2750, END_X 660
  // the plain's light follows how far he has come (gold at the start, mist by the bog); shared by the walk and the skip link
  const PLAIN_GOLD = x => 1 - smooth(-1900, -1150, x), PLAIN_MIST = x => smooth(-1850, -1000, x);
  const WADE0 = FALL_X + 70;      // build 119: falling, Christian pitches on this much further, so the two are not on top of each other in the mire
  // Help kneels at the edge of the far bank; Christian must come to where his hand meets Help's (measured in slough-lab.html)
  const HX = BANK0 + 34, GRASP = { dx: -(82 - 15 + 129), dy: 283 - 55 };
  const HY = () => bankY(HX) + 4;
  const STUCK_X = HX + GRASP.dx * CHR_K, STUCK_Y = () => HY() + GRASP.dy * CHR_K;
  const MD_IN = 16, MD_FAR = 28, REACH_F = 88, REACH_X = HX - 82;      // build 260: see DEEP IN THE MIRE in update()
  const SINK = 100, PLI_SINK = 76, DEEP = 8, OAK_X = 110, OAK_S = 1.2;
  const C_SINK = 64;      // build 125 (owner: "Christian is too submerged at first ... it'd be nice to see more of him at start"): he falls in to the waist, and sinks from there to SINK + DEEP as he crosses
  // build 115 (owner, of them standing at the bog's edge: "still white space between feet and ground"): on the muddy flat at
  // the water's level they stand a little sunk in it, and every picture of them there is cut at the water line
  const MUDDY = x => 6 * smooth(-6, 0, bankY(x)) + (x <= FALL_X + 5 ? 13 * smooth(HOME0 + 60, FALL_X, x) : 0);      // build 121: walking out over the mire they go in deeper at every step, before the fall                        // how deep each stands in the mire when they fall (feet below the water line)
  // the fall is slow (owner, build 105: "go deeper ... drop more slow ... what it looks like to get [stuck in] mud"): a soft first
  // drop to the knees, then a slow sink over about 5 seconds that goes on while the words begin
  // build 180 (owner: "make sure motions look clean and not jerky or drawn out"): they plunge to the thigh at once, under the splash,
  // so the struggling pictures can take over there, then sink slowly on to the waist (it was .4 then .6: two seconds stiff and upright)
  const sunk = t => .8 * smooth(0, 42, t) + .2 * smooth(30, 330, t);
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
  let SHB = null, FARMUD = [], mudDk = null, mudLt = null, shC = null, mistC = null, fogC = null, SHN = [], SH0 = [];
  let SHORE = null, OAK = null, GHOSTS = null, skyMist = null, skyClear = null, paper = null, threads = null, puff = null, fogBank = null, mudMap = null, built = false;
  function build() {
    if (built) return; built = true;
    OAK = bakeTree(oak(18), tone(.02), 1.3);
    // THE SHORES ARE CONTOURED (owner: "the shore on the right side looks a little flat and unnatural"; then, of grass and
    // reeds: "too busy - I liked old clean lines - I meant right shore was just too flat (vs contoured slightly)"): the
    // land stays one clean silhouette; beyond where people stand it swells and dips gently, and the oak's foot flares.
    SHORE = true;
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
    // THE SLOUGH IS MUD WITH POOLS IN IT (build 132, owner: "maybe reflection can taper on as we go right. think pools and
    // mud and how they interact - really stress big picture thinking"). One map of the whole surface between the banks
    // says, for every place, mud (opaque, dull, nothing mirrored) or standing water (clear: it mirrors). By the home
    // bank it is all mud; going right, small flat pools open in it, grow, join, and by the far bank it is open water
    // with only a few tongues of mud. The mirror is never faded: a place either mirrors or it does not, and "more
    // reflection to the right" comes from more water. Pools are long and flat (we see them edge-on) and bigger toward
    // us. mudMap: 1 px to the unit across, MUD_H rows down from the surface line; white, its alpha = mud.
    // THE MUD IS ONE STYLE, FAR AND NEAR (build 298, owner: "i think we need to get mud from beyond in front not the other
    // way around. it just needs to coalesce more on the left than the right"; the far mud's wavy look was liked in build 293).
    // Both are rows of long flat patches with wavy tops and bottoms (lay, wavy). By the home bank the patches are long and
    // close, so they run together into one mass of mud with only slits of water; going right they shorten and part, and open
    // water lies between them. FARMUD: the rows running back from the surface line to the horizon (q = how near, drawn each
    // frame in draw()); the near mud is the same patches baked into mudMap, which hides the mirror wherever there is mud.
    const lay = (rnd, x0, x1, hk, gk = 1) => { const ps = [];
      for (let x = x0; x < x1;) { const c = 1 - .9 * wetAt(x), L = 110 + 640 * c * rnd() + 60 * rnd();
        if (rnd() < .3 + .7 * c) ps.push({ x, L, h: hk * (.8 + .5 * rnd()), s: rnd() * 9 }); x += L + 4 + 260 * gk * Math.pow(1 - c, 1.3) * rnd(); }
      return ps; };
    FARMUD = []; { let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      for (let k = 0; k < 14; k++) { const q = Math.pow((k + 1) / 14, 1.35); FARMUD.push({ q, ps: lay(rnd, WATER_L - 900, BANK0 + 900, 14) }); } }
    mudMap = mk(MUD_W, MUD_H); { const c = mudMap.getContext('2d'); let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      c.fillStyle = '#fff';
      // build 303 (owner: "little less stripy in the front ... instead of thickening strips can you just make more to cover
      // white strips (the up and down of new one is too much)"): the patches keep build 298's gentle height; there are just
      // twice as many rows, with shorter gaps, so they cover the white between them
      for (let k = 0; k <= 36; k++) { const j = 2 + 268 * Math.pow(k / 36, 1.6), hk = 3 + .14 * j;
        for (const m of lay(rnd, MUD_X0 - 300, MUD_X0 + MUD_W + 300, hk, .6)) { c.beginPath(); wavy(c, m.x - MUD_X0, j, m.L, m.h, m.h * .8, m.s); c.fill(); } }
      // fade out under the far bank as before (mudEnd)
      c.globalCompositeOperation = 'destination-in'; const g = c.createLinearGradient(0, 0, MUD_W, 0);
      for (let i = 0; i <= 20; i++) g.addColorStop(i / 20, 'rgba(255,255,255,' + mudEnd(MUD_X0 + MUD_W * i / 20).toFixed(3) + ')');
      c.fillStyle = g; c.fillRect(0, 0, MUD_W, MUD_H); c.globalCompositeOperation = 'source-over'; }
    // MUD THAT LOOKS LIKE MUD (build 257, owner: "I don't like that it's all grey underneath them ... more bog look like the
    // wavy edges closer to tree - it's too plain"). Two overlays baked once, the same size as mudMap, laid over the mud only:
    // mudDk darkens it (a dark wet rim round every pool, so the pools' wavy edges are drawn into the mud near and far; broad
    // flat patches of wetter mud), mudLt lightens it (a few long thin bands of dull sheen where the sky catches wet mud,
    // flat because we see them edge-on). One tone throughout, only darker and lighter.
    mudDk = mk(MUD_W * MUDK, MUD_H * MUDK); mudLt = mk(MUD_W * MUDK, MUD_H * MUDK);
    { const dd = mudDk.getContext('2d').createImageData(MUD_W * MUDK, MUD_H * MUDK), dl = mudLt.getContext('2d').createImageData(MUD_W * MUDK, MUD_H * MUDK), cd = tone(.12), cl = tone(.9);
      for (let j = 0; j < MUD_H * MUDK; j++) for (let i = 0; i < MUD_W * MUDK; i++) {
        const x = MUD_X0 + i / MUDK, yy = Math.pow(j / MUDK + 1, .82), T = poolT(x, yy), n = poolN(x, yy), a = (1 - smooth(T - .06, T + .06, n)) * mudEnd(x);      // build 296: a softer edge still (owner: "pixelized edge")
        const rim = smooth(T - .11, T - .015, n), patch = smooth(.46, .66, cloudN(x * .005 + 30, yy * .06 + 7)), streak = smooth(.56, .7, cloudN(x * .0022 + 70, yy * .75 + 11));
        const dk = clamp(.42 * rim + .2 * patch) * smooth(0, 6, yy + 2), lt = .2 * streak * (1 - rim) * (1 - .6 * patch);
        const o = (j * MUD_W * MUDK + i) * 4;
        dd.data[o] = cd[0]; dd.data[o + 1] = cd[1]; dd.data[o + 2] = cd[2]; dd.data[o + 3] = 255 * dk * a;
        dl.data[o] = cl[0]; dl.data[o + 1] = cl[1]; dl.data[o + 2] = cl[2]; dl.data[o + 3] = 255 * lt * a;
      }
      mudDk.getContext('2d').putImageData(dd, 0, 0); mudLt.getContext('2d').putImageData(dl, 0, 0); }
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
  const HELPF = [], REACH = [], LIFT = [], PLIC = [], WADE = [], STUCKP = [], PSTOP = [], HWALK = [], HTURN = [];
  const META = { help: { ax: 94, ground: 309 }, reach: { ax: 70, ground: 307 }, lift: { ax: 257, ground: 307 },
    climb: { ax: 363, ground: 342, top: 38, end: 440, sink: 39, c0: 168, top0: 143 },      // c0, top0: the middle and the head of him in the first frame (build 106)
    // Christian struggling through the mud (build 104): a loop, waist-deep in the video; ground = where his feet would be
    // build 214 (owner: two videos made in deep mud, about $1.12): WADE = wading through the mud, a loop (christian-wade.pack,
    // 48 pictures, he leans in, heaves, drags each leg); STUCKP = in the mud to the chest (christian-stuck.pack, 120 pictures:
    // 0..5 settling, 6..58 heaving and straining on the spot, played back and forth, 60..119 lifting his head and raising his
    // right arm high for help, held). Both are cut at the video's own mud line, 122 pictures-pixels (63 units) above his feet.
    wade: { ax: 85, ground: 298 }, stuck: { ax: 120, ground: 299 },
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
    hwalk: { ax: 92, ground: 317 },
    // HELP TURNS AND WALKS AWAY (build 120, owner: "should we have help walk away? i'm not sure i like him standing there
    // like a statue"; one video, about 56 cents, right first time: first frame his standing picture, last frame the same
    // mirrored; he turns on the spot with his back to us). assets/help-turn.pack: 80 frames (video 0..76 every 2nd,
    // 82..160 every 6th: he lingers with his back to us, 164..216 every 2nd). Frame 0 lies on HELPF[0]; his middle is on
    // ax in the first and the last frame, so his mirrored walk (HWALK frames 16..31, one full stride, a loop) joins on.
    hturn: { ax: 88, ground: 309 } };
  const HW_OFF = [1106.2, 1097.2, 1084.2, 1072.2, 1059.2, 1046.2, 1033.2, 1020.2, 1007.2, 994.2, 981.2, 968.2, 955.2, 944.7, 930.7, 916.2, 902.7, 890.7, 877.7, 864.7, 851.7, 838.7, 825.2, 812.2, 799.2, 786.2, 773.2, 760.2, 747.2, 733.7, 719.2, 705.7, 693.2, 680.2, 667.2, 654.2, 641.2, 627.2, 614.2, 601.2, 588.2, 575.2, 562.2, 549.2, 535.2, 521.2, 506.7, 493.7, 480.2, 469.7, 456.7, 443.7, 429.7, 414.7, 401.7, 388.7, 375.2, 362.7, 351.2, 338.2, 325.2, 313.2, 301.2, 290.2, 279.2, 269.2, 256.2, 243.2, 231.7, 218.7, 208.2, 196.7, 187.2, 177.2, 167.7, 158.7, 145.7, 132.7, 119.7, 106.7, 93.7, 80.7, 67.7, 54.7, 41.7, 28.7, 24.0, 18.0, 14.0, 11.0, 7.5, 5.0, 3.0, 1.5, 1.0, 0.0];
  // build 120: he comes from further off, out of the mist at the picture's right edge: one full stride of the walk
  // (frames 16..31, which join end to start) is walked three times over before the video's own frames 32..95
  const HW_LOOP = HW_OFF[16] - HW_OFF[32], HSEQ = [...Array(112).keys()].map(i => i < 48 ? [16 + i % 16, HW_OFF[16 + i % 16] + (2 - Math.floor(i / 16)) * HW_LOOP] : [i - 16, HW_OFF[i - 16]]);
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
    if (!loading) loading = Promise.all([loadPack('help', HELPF), loadPack('help-walk', HWALK).catch(() => {}), loadPack('help-turn', HTURN).catch(() => {}), loadPack('christian-reach', REACH), loadPack('lift', LIFT), loadPack('pliable-climb', PLIC).catch(() => {}), loadPack('christian-wade', WADE).catch(() => {}), loadPack('christian-stuck', STUCKP).catch(() => {}), loadPack('pliable-stop', PSTOP).catch(() => {})]).catch(() => {});
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
  const tintC = {}; let FIG_DIP = 0;
  // the last row of a picture that has body in it (some packs keep a few blank rows at the bottom); found once per picture
  const lastRows = new WeakMap();
  function lastRow(im, fc) { let r = lastRows.get(im); if (r !== undefined) return r; r = { r: im.height - 1, x0: 0, x1: 0 };
    try { const d = fc.getContext('2d').getImageData(0, 0, im.width, im.height).data, on = (x, y) => d[(y * im.width + x) * 4 + 3] > 128;
      for (; r.r > 0; r.r--) { let k = 0; for (let x = 0; x < im.width; x += 2) if (on(x, r.r)) k++; if (k > 8) break; }
      // the body is the longest unbroken run in that row (splashes the video painted beside him are shorter runs)
      let run = 0; for (let x = 0; x <= im.width; x++) { if (x < im.width && on(x, r.r)) run++; else { if (run > r.x1 - r.x0) { r.x0 = x - run; r.x1 = x; } run = 0; } } } catch (e) {}
    lastRows.set(im, r); return r; }
  function figure(c, slot, im, meta, x, y, face, tint, cut, alpha = 1) {
    if (!im || alpha <= 0) return;
    im = solidOf(im);      // build 202: no clear spots inside the figure (solidOf, in index.html)
    const fc = tintC[slot] || (tintC[slot] = mk(8, 8)); if (fc.width !== im.width || fc.height !== im.height) { fc.width = im.width; fc.height = im.height; }
    const f = fc.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, fc.width, fc.height);
    f.drawImage(im, 0, 0); f.globalCompositeOperation = 'multiply'; f.fillStyle = css(tint); f.fillRect(0, 0, im.width, im.height);
    // build 129: the wading and climbing videos painted PALE mud over the men's waists, which read as their bodies fading to
    // white above the surface. FIG_DIP (pack px, set by the caller) darkens that much of the figure above the mud line
    // to the tone of his own dark clothes, so he goes into the mire as a solid body.
    if (FIG_DIP && cut) { const r0 = meta.ground - y / CHR_K, g = f.createLinearGradient(0, r0 - FIG_DIP, 0, r0), d = [tint[0] * .34, tint[1] * .34, tint[2] * .34];
      g.addColorStop(0, css(d, 0)); g.addColorStop(.55, css(d, .8)); g.addColorStop(1, css(d, .96)); f.globalCompositeOperation = 'source-atop'; f.fillStyle = g; f.fillRect(0, r0 - FIG_DIP, im.width, FIG_DIP + 4); }
    // build 143: what has been under the mud stays dark and wet (FIG_WET: D = how far above the picture's ground line the
    // mud reached, or r = that row; x1 = only columns left of it; a = how dark)
    if (FIG_WET) { const W = FIG_WET, r = W.r ?? meta.ground - W.D / CHR_K, d = [tint[0] * .4, tint[1] * .38, tint[2] * .36];
      if (r < im.height) { const g = f.createLinearGradient(0, r - 9, 0, r + 5); g.addColorStop(0, css(d, 0)); g.addColorStop(1, css(d, W.a));
        f.globalCompositeOperation = 'source-atop'; f.fillStyle = g; f.fillRect(0, r - 9, W.x1 ?? im.width, im.height - r + 9); } }
    if (cut && alpha > .2 && y > -2) SHN.push({ im, meta, x, y, face, a: alpha });      // build 257: for the wet shadow under everyone standing in the mud (drawn the next frame)
    if (MREC && cut && alpha > .25 && (!RECS[MREC] || alpha >= RECS[MREC].a)) RECS[MREC] = { im, meta, x, y, face, a: alpha };
    f.globalCompositeOperation = 'destination-in'; f.drawImage(im, 0, 0); f.globalCompositeOperation = 'source-over';
    c.save(); c.globalAlpha = alpha;
    if (cut) { c.beginPath(); c.rect(-1e5, -1e5, 2e5, 1e5); c.clip(); }
    c.translate(x, y); if (TALKM) c.transform(1, 0, TALKM.sh, 1, 0, 0);      // build 118: whoever is speaking leans a hair with his own voice (talkMove in index.html)
    c.scale(face * CHR_K, CHR_K * (TALKM ? TALKM.sy : 1)); c.drawImage(fc, -meta.ax, -meta.ground);
    // build 141 (owner: "a flickering blank space between Christian and mud shortly after they enter"): the wading and
    // climbing pictures end at their own video's mud line (the waist). Whenever he stands higher than that (still sinking
    // after the fall, or heaving up), the picture ended above the surface and blank paper showed under him. The body's
    // own width at its last row is now carried straight down to the surface as one dark shape, so there is always body where
    // he enters the mud.
    if (FIG_DIP && cut) { const r0 = meta.ground - y / CHR_K, lr = lastRow(im, fc); if (r0 > lr.r - 1 && lr.x1 > lr.x0) { c.fillStyle = css([tint[0] * .34, tint[1] * .34, tint[2] * .34]); c.fillRect(lr.x0 - meta.ax, lr.r - 1 - meta.ground, lr.x1 - lr.x0, r0 - lr.r + 4); } }
    c.restore();
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
  const TURN_TICKS = 50, HTURN_TICKS = 44;      // build 365: Christian's and Help's turns, quick pivots (see A QUICK TURN in update())
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
  let prints = [], fogH = 1, fogS = 1, strain = 0, slipT = 0, fearT = 0, fearsSaid = false, goldT = 0, onwayT = 0, capsSaid = new Set(), nearSaid = true, pliGo = 0, cityT = -1, fearT2 = -1;
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
    // build 134 (owner: "level 2 opening - can't move on phone"): G.t starts again from 0 here, but G.calm (the moment
    // the last words ended; a finger only walks him if it went down after that) still held Level 1's clock, thousands
    // of ticks ahead, so no finger counted until the clock caught up. Keys were never affected, so the tests passed.
    G.calm = 0;
    C2.rt = 0; C2.handGo = false; C2.tv = null; C2.fy = null; C2.md = null; C2.rq0 = null; C2.q = 0; drops = []; churns = []; fReset(); strings = []; RECS = {}; for (const k in MS) delete MS[k]; C2.D = 0;
    ph = 'plain'; Object.assign(C2, { x: START, y: bankY(START) + 4, face: 1, anim: 12, alpha: 1, sink: 0, reach: 0, stand: 1, sd: QUIET[0], st: 0, faceA: 1, done: 0 });
    pli = { x: START - 80, y: 0, face: 1, anim: 0, alpha: 1, sink: 0, mode: 'follow', px: START - 80, stop: { t: 50, x0: START - 80 - 72.5 * CHR_K } };      // he starts standing (his stop video's breathing part)
    prints = []; fogH = 1; fogS = 1; help = null; mv = null; lift = null; rings = []; steps = []; gloom = gloomTo = 0; noteI = 0; strain = 0; slipT = 0; fearT = 300; fearsSaid = false; goldT = 0; onwayT = 0; capsSaid = new Set(); nearSaid = true; pliGo = 0; cityT = -1; fearT2 = -1;
    motes = [...Array(LAST.length)].map((_, i) => ({ ox: -30 - Math.random() * 50, oy: -112 - Math.random() * 40, x: START, y: -150, tw: Math.random() * 6, i }));
    // the steps through the bog, hidden until the lights settle on them: low flat stones, no two alike (from the approved still)
    const R = rngS(33); let sx = BANK0 - 6;
    LAST.forEach((nt, i) => { const w = 20 + R() * 20, h = 4 + R() * 4, lean = (R() - .5) * 10; sx -= w + 34 + R() * 34; steps.push({ x: sx, w, h, lean, nt, lit: 0, i }); sx -= w; });
    Object.assign(cam, { cx: START + 150, z: 1, wl: 440 });
    if (audio()) { AC.resume(); for (const [who, txt] of ALL) vox(who, txt); }
    // SKIP-AHEAD LINK (build 122, owner: "can you give me link to entrance into water"): ?level=2&at=bog starts the two on the
    // home bank a few steps from the mire, the talk on the plain already said, the mist already in
    const AT2 = { bog: -1090 }[new URLSearchParams(location.search).get('at')];
    if (AT2) {
      C2.x = AT2; C2.y = bankY(AT2) + 4; pli.x = pli.px = AT2 - 80; pli.stop = { t: 50, x0: AT2 - 80 - 72.5 * CHR_K };
      capsSaid = new Set(OPEN_AT.map((_, i) => i)); nearSaid = true;
      const f = smooth(-1350, FALL_X, AT2), mi = PLAIN_MIST(AT2);
      Object.assign(cam, { cx: lerp(AT2 + 150, -470, f), z: lerp(1, .8, f), wl: lerp(440, 392, f) });
      Object.assign(look, { mist: mi, veil: .84 * smooth(-1300, FALL_X, AT2), gold: PLAIN_GOLD(AT2), disc: lerp(1, .3, mi), sky: mi });
    }
    G.state = 'wait'; setTimeout(() => { if (SL.on && G.state === 'wait') { G.state = 'play';  } }, 1400);
  }
  // the Pliable talk is said while they walk, a line at a time, at places along the plain
  const OPEN_AT = [START - 1, -1880, -1640, -1400];      // build 368: the first line is said as the level opens (the storyteller's line before it was cut)
  function choose2() {
    document.getElementById('chHome').textContent = 'Go back, as Pliable did';
    document.getElementById('chOn').textContent = 'Struggle on to the gate';
    choose();
  }
  function pick(home) {
    if (!home) { note(55, .04, 3); wadeOn(); return; }
    ph = 'back'; gloomTo = 1; turnC(-1, 2); G.state = 'auto';
  }
  // SPLASHES (build 121, owner: "splashes are great - maybe crank that up a bit"): drops of mud thrown up from the water
  // line wherever someone heaves, falls or is hauled out; they rise, fall back and leave a small ring
  let drops = [], churns = [];
  function splash(x, n = 7, k = 1, still) { if (!still) churns.push({ x, a: Math.min(1, .5 + n * .05) }); for (let i = 0; i < n; i++) drop(x + (Math.random() - .5) * 30, 0, (Math.random() - .5) * 2 * k, -(1.1 + Math.random() * 2.1) * k, .7 + Math.random() * 1.1); }
  // ============================================================
  // THE MUD ANSWERS THE FIGURES (build 143; owner, build 141: "the way it acts does not look good - it doesn't stick to
  // character [or] act like coordinated response to their movements"). The figures move by their videos; the mud used to
  // move by its own random timers at each figure's middle. Now there is ONE mud surface, fed by the figures' own
  // pictures. Every picture of a figure in the mire is recorded as it is drawn (MREC, in figure()); sense() then reads,
  // in that very picture, where the body and each arm cross the mud line, and compares with the last picture:
  //  (1) the surface line is a slow heavy height field (fh, fv, fStep): a body edge moving out pushes the mud up ahead of
  //      it, an edge drawing back leaves a sag; sinking lifts the mud round the body, heaving up lets it fall;
  //  (2) a collar of mud hugs every crossing, heavier the more he is moving (coll() in draw);
  //  (3) an arm going in (a new crossing) makes a plop: a dip with a swell either side, a slow ring, a few heavy drops;
  //  (4) an arm coming out (a crossing gone) draws a string of mud up after the hand, followed in the picture itself
  //      until it is too long, when it breaks and falls back as drops (strings, handAt);
  //  (5) what has been under stays dark and wet (FIG_WET in figure(): Christian when he heaves up and after the lift,
  //      Pliable as he climbs out), drying very slowly.
  // ============================================================
  const FX0 = HOME0 - 30, FD = 3, FN = Math.ceil((BANK0 + 40 - FX0) / FD), fh = new Float32Array(FN), fv = new Float32Array(FN);
  const fAt = x => { const u = (x - FX0) / FD, i = Math.floor(u); return i < 0 || i >= FN - 1 ? 0 : lerp(fh[i], fh[i + 1], u - i); };
  // push the surface at x: amt raises (or, negative, lowers) it in a soft hump sig wide
  function fPush(x, amt, sig = 6) { const i0 = Math.max(1, Math.floor((x - 3 * sig - FX0) / FD)), i1 = Math.min(FN - 2, Math.ceil((x + 3 * sig - FX0) / FD));
    for (let i = i0; i <= i1; i++) { const q = (FX0 + i * FD - x) / sig; fh[i] += amt * Math.exp(-q * q); } }
  // heavy mud: the swell travels slowly and only a short way, and settles
  function fStep() { for (let i = 1; i < FN - 1; i++) fv[i] += .035 * (fh[i - 1] + fh[i + 1] - 2 * fh[i]) - .006 * fh[i] - .16 * fv[i];      // build 310: thicker
    for (let i = 1; i < FN - 1; i++) fh[i] = clamp(fh[i] + fv[i], -4, 9); }
  function fReset() { fh.fill(0); fv.fill(0); }
  // each picture's see-through mask, at half size, measured once (and its last row with body in it)
  const AM = new WeakMap();
  function amap(im) { let a = AM.get(im); if (a) return a;
    const w = Math.ceil(im.width / 2), h = Math.ceil(im.height / 2), A = new Uint8Array(w * h); a = { w, h, A: null, lr: h - 1 };
    try { const c = mk(w, h), k = c.getContext('2d'); k.drawImage(im, 0, 0, w, h); const d = k.getImageData(0, 0, w, h).data;
      for (let i = 0; i < w * h; i++) A[i] = d[i * 4 + 3] > 110 ? 1 : 0; a.A = A;
      for (; a.lr > 0; a.lr--) { let n = 0; for (let x = 0; x < w; x++) n += A[a.lr * w + x]; if (n > 4 && n < w * .9) break; } } catch (e) {}
    AM.set(im, a); return a; }
  // the crossings in one row of a mask: runs of body (a run across nearly the whole picture is a cutting edge, not body)
  function runsAt(a, row) { const out = []; if (!a.A || row < 0 || row >= a.h) return out; const o = row * a.w; let run = 0;
    for (let x = 0; x <= a.w; x++) { if (x < a.w && a.A[o + x]) run++; else { if (run >= 4 && run < a.w * .9) out.push([x - run, x]); run = 0; } } return out; }
  const wxOf = (r, c) => r.x + r.face * (c * 2 - r.meta.ax) * CHR_K, wyOf = (r, row) => r.y + (row * 2 - r.meta.ground) * CHR_K;
  let MREC = null, FIG_WET = null, RECS = {}, strings = [], sndT = 0;
  const MS = {};      // per figure: the last picture's crossings, how hard he is moving (act), cool-downs
  // build 305 (owner: "decrease the drips a little or make them more mud like (it looks like water now)"): fewer of them, and
  // heavy: thrown lower and slower, thicker, falling back sooner (MUD_G), drawn as short round globs
  const MUD_G = .27;
  function drop(x, y, vx, vy, r = 1) { if (Math.random() < .6) return; drops.push({ x, y, vx: vx * .55, vy: vy * .6, r: r * 1.8, t: 0 }); }
  // (3) an arm goes in: a dip where the hand enters and a swell either side, a slow ring, a few heavy drops, a thick sound
  function plop(x, w, S) { if (G.t - (S.pt ?? -99) < 6) return; S.pt = G.t;
    fPush(x, -1.8, 4); fPush(x - 9 - w * .3, 1, 5); fPush(x + 9 + w * .3, 1, 5);
    rings.push({ x, y: 0, t: 0, k: .42 }); churns.push({ x, a: .45 });
    for (let i = 0; i < 2 + (Math.random() * 2 | 0); i++) drop(x + (Math.random() - .5) * w, -1, (Math.random() - .5) * .9, -(.7 + Math.random() * .9), .8 + Math.random() * .6);
    if (G.t - sndT > 10 && audio()) { sndT = G.t; hiss(240, .7, .045, .3, 'lowpass'); sweep(125, 55, .26, .04); } }
  // (4) an arm comes out: the mud is drawn up after the hand in a string
  function pullOut(o, x, S) { if (G.t - (S.ot ?? -99) < 5) return; S.ot = G.t;
    fPush(x, 1.1, 5); churns.push({ x, a: .3 });
    if (strings.filter(s => s.o === o).length < 3) strings.push({ o, x, tx: x, ty: -1, t0: G.t });
    if (G.t - sndT > 10 && audio()) { sndT = G.t; hiss(650, 2.2, .018, .22); sweep(55, 120, .18, .025); } }
  function sense() {
    for (const o in RECS) {
      const r = RECS[o], a = r.am = amap(r.im); if (!a.A) continue;
      const r0 = (r.meta.ground - r.y / CHR_K) / 2; r.rs = Math.round(Math.min(r0 - 1.5, a.lr - 1));
      const runs = runsAt(a, r.rs).map(([c0, c1]) => { const p = wxOf(r, c0), q = wxOf(r, c1); return [Math.min(p, q), Math.max(p, q)]; })
        .filter(([p, q]) => (p + q) / 2 > HOME0 + 10 && (p + q) / 2 < BANK0 - 4);
      let bi = -1, bw = 0; runs.forEach((u, i) => { if (u[1] - u[0] > bw) { bw = u[1] - u[0]; bi = i; } });
      r.body = bi >= 0 ? runs[bi] : null; r.arms = runs.filter((_, i) => i !== bi);
      const S = MS[o] || (MS[o] = { act: 0, cd: 0, arms: [] }), dt = G.t - (S.t ?? -99);
      if (dt <= 0) continue;
      if (S.meta === r.meta && dt <= 10) {
        const k = Math.min(dt, 4), near = (u, list) => list.find(v => v[0] - 5 < u[1] && v[1] + 5 > u[0]);
        if (S.body && r.body) {
          const b = r.body, dL = clamp((b[0] - S.body[0]) / dt, -3, 3), dR = clamp((b[1] - S.body[1]) / dt, -3, 3), dy = clamp((r.y - S.y) / dt, -3, 3);
          // (1) ahead of an edge moving out the mud heaps up; behind one drawing back it sags; sinking lifts it, rising drops it
          fPush(b[1] + 7, (dR * .2 + dy * .12) * k, 6); fPush(b[0] - 7, (-dL * .2 + dy * .12) * k, 6);
          S.act = lerp(S.act, clamp((Math.abs(dL) + Math.abs(dR)) * .7 + Math.abs(dy) * .8), .15);
          // a hard lunge throws a few drops ahead of it
          if (S.cd <= 0 && Math.max(Math.abs(dL), Math.abs(dR)) > 1.3) { const right = Math.abs(dR) > Math.abs(dL), sx = right ? b[1] + 2 : b[0] - 2, dir = Math.sign(right ? dR : dL) || 1;
            for (let i = 0; i < 2 + (Math.random() * 2 | 0); i++) drop(sx, -1, dir * (.5 + Math.random() * 1.1), -(.9 + Math.random() * 1.4), .8 + Math.random() * .7); S.cd = 14; }
          if (S.act > .25 && G.t - (S.ct ?? -99) > 30) { S.ct = G.t; churns.push({ x: (b[0] + b[1]) / 2, a: .25 + .45 * S.act }); }
        } else if (S.body && !r.body) { pullOut(o, S.body[0] + 3, S); pullOut(o, S.body[1] - 3, S); }      // the whole body leaves the mud (hauled out): strings from both sides
        for (const u of r.arms) if (!near(u, S.arms)) plop((u[0] + u[1]) / 2, u[1] - u[0], S);
        for (const u of S.arms) if (!near(u, r.arms)) pullOut(o, (u[0] + u[1]) / 2, S);
      }
      // build 180: the collar's own shape follows the body softly (a run of body could jump 20 units in one picture when an
      // arm joined it, and the collar jumped with it); an arm's collar grows in as it enters and fades as it leaves
      const kk = 1 - Math.pow(.7, Math.min(dt, 6)), same = S.meta === r.meta && dt <= 10;
      if (r.body) { if (!S.sb || !same) S.sb = r.body.slice(); else { S.sb[0] += (r.body[0] - S.sb[0]) * kk; S.sb[1] += (r.body[1] - S.sb[1]) * kk; } } else S.sb = null;
      const prevA = same ? S.armRuns || [] : [];
      S.armRuns = r.arms.map(u => { const m = prevA.find(v => v[0] - 5 < u[1] && v[1] + 5 > u[0]); return [u[0], u[1], (m ? m[2] : 0) + dt]; });
      S.ghost = (S.ghost || []).map(g => [g[0], g[1], g[2] - dt * .1]).filter(g => g[2] > 0);
      for (const v of prevA) if (!S.armRuns.find(u => v[0] - 5 < u[1] && v[1] + 5 > u[0])) S.ghost.push([v[0], v[1], 1]);
      S.cd -= dt; S.t = G.t; S.meta = r.meta; S.body = r.body; S.arms = r.arms; S.y = r.y;
    }
    for (const o in MS) if (!RECS[o]) { MS[o].body = null; MS[o].arms = []; MS[o].act *= .9; MS[o].meta = null; }
  }
  // where a hand is now, above the place a string leaves the mud: the lowest body in the picture over that place, or 'in'
  // if the arm has gone back under, or null if nothing is there
  function handAt(r, wx) {
    const a = r.am, c = Math.round(((wx - r.x) / (r.face * CHR_K) + r.meta.ax) / 2), on = (x, y) => x >= 0 && x < a.w && y >= 0 && y < a.h && a.A[y * a.w + x];
    for (let x = c - 3; x <= c + 3; x++) if (on(x, r.rs) || on(x, r.rs - 1)) return 'in';
    for (let y = r.rs - 2; y > r.rs - 40; y--) { let best = null; for (let x = c - 6; x <= c + 6; x++) if (on(x, y) && (best == null || Math.abs(x - c) < Math.abs(best - c))) best = x; if (best != null) return [wxOf(r, best), wyOf(r, y + 1)]; }
    return null;
  }
  // the lift (both men in one picture): what was under is Christian below his chest, which rises with him. Measured in the
  // lift pack: the top of his head by frame, and a column left of which is Christian (Help is to the right)
  const LIFT_HEAD = [[0, 245], [12, 242], [18, 208], [24, 192], [30, 175], [36, 128], [42, 105], [48, 100], [54, 70], [60, 48], [66, 38], [72, 30], [78, 20], [86, 20]];
  const LIFT_SPLIT = [[0, 215], [18, 235], [36, 255], [48, 270], [60, 300], [72, 315], [86, 320]];
  const tab = (T, f) => { for (let i = 1; i < T.length; i++) if (f <= T[i][0]) return lerp(T[i - 1][1], T[i][1], (f - T[i - 1][0]) / (T[i][0] - T[i - 1][0])); return T[T.length - 1][1]; };
  const liftWet = (f, a = .78) => ({ r: tab(LIFT_HEAD, f) + 75, x1: tab(LIFT_SPLIT, f), a });
  // BUILD 183 (owner: "still feels a little jerky"): his struggling video was played at up to 1.3 times its own speed in
  // bursts and dropped to a fifth in an instant. Now it never runs faster than its own 12 pictures a second (.2 a tick),
  // and its speed eases from one pace to the next (waStep); each picture melts into the next (see drawChr).
  function waStep(to) { C2.waV = lerp(C2.waV ?? .1, to, .05); C2.wa = (C2.wa || 0) + C2.waV; }
  function wadeOn() { ph = 'wade'; G.state = 'play'; if (!C2.tv) heave(1); caption(ALONE); }
  // (E, build 368) a heave round in the mire, as Pliable's (build 140): he faces Pliable in the quarrel, and back toward the
  // far bank when he struggles on; the picture swaps under a splash (there are no frames of him turning in the mud)
  function heave(d) { if (C2.face === d) return; C2.face = C2.faceA = d; splash(C2.x, 12, 1.3); rings.push({ x: C2.x, y: 0, t: 0, k: 1.2 }); if (audio()) sfxS.wade(); }
  // CHRISTIAN REALLY TURNS (build 120, owner: "christian turns and looks a couple times and i don't like the flip back and
  // forth without body moving, could we use turns from other levels"): Level 1's turning video (TURN, left to right),
  // played backwards to turn him to the left. C2.tv = its clock; d = the way he will face; k = how fast (twice as fast in
  // the mire, where only his head and the sack show). Without the pack: the old dissolve.
  function turnC(d, k = 1) { if (C2.face === d) return; if (TURN.length) C2.tv = { t: d > 0 ? 0 : TURN.length - 1, d, k }; else C2.face = d; }
  function finish() {
    G.state = 'end'; G.ended = false;
    const e = document.getElementById('endc');
    e.querySelector('h1').textContent = 'Out of the Slough';
    e.querySelectorAll('p')[0].textContent = 'Help set him upon sound ground, and he went on his way.';
    e.querySelectorAll('p')[1].textContent = 'Next: Mr. Worldly Wiseman';
    document.getElementById('on2').style.display = '';
  }
  // a touch: on the water it makes rings; in the act, Help's hand takes his
  const handPt = () => [HX - 82 * CHR_K, HY() - 55 * CHR_K];
  function touch(sx, sy) {
    const wx = (sx - VW / 2) / cam.z + cam.cx, wy = (sy - cam.wl) / cam.z;
    if (G.act === 'hand') { const [hx, hy] = handPt(); if (mv && mv.t >= 150 && (C2.rt || 0) >= 150 && Math.hypot(wx - hx, wy - hy) * cam.z < 120) grip(); else G.actT = Math.max(G.actT, 60); return; }
    if (wy > 0 && wx > WATER_L) { rings.push({ x: wx, y: Math.max(0, wy), t: 0, k: .7 }); sfxS.wade(); }
  }
  function grip() {
    if (G.act !== 'hand' || lift || !mv || mv.t < 150 || (C2.rt || 0) < 150) return;
    lift = { t: 0 }; sfxS.grip(); splash(C2.x + 10, 12, 1.4, true); G.ring = null; next(true); caption(DRAWN);
  }

  // ---------- each tick ----------
  function update() {
    gloom += (gloomTo - gloom) * .02; if (C2.sd != null) C2.sd += .4; for (const pr of prints) pr.t++; C2.faceA = clamp((C2.faceA ?? 1) + (C2.face - (C2.faceA ?? 1)) * .06, -1, 1);
    const want = G.state === 'play' && (keys.r || held());
    fStep();
    // (5) how high the mud has reached on him, above his feet (it stays when he rises, and dries off very slowly)
    if (['fall', 'pli', 'back', 'backtalk', 'wade', 'stuck', 'help'].includes(ph) && !lift) C2.D = Math.max(C2.D || 0, C2.y);
    else if (ph === 'drawn' || ph === 'look' || ph === 'onway' || ph === 'on') C2.D = Math.max(48, (C2.D || 0) - .008);
    // A QUICK TURN (build 365, owner: "it'd be nice for help turning to be a quick turn and go instead of drawn out slow turn
    // with feet walking look ... much prefer a pivot on one foot or something quick ... christian also turns slow"): his
    // turn video is played through in TURN_TICKS ticks (under a second), eased in and out, instead of at its own speed
    // (over three seconds, the feet stepping round); the owner's own exception to "every clip at its own speed"
    if (C2.tv) { C2.tv.p = Math.min(1, (C2.tv.p || 0) + 1 / TURN_TICKS); const e = C2.tv.p * C2.tv.p * (3 - 2 * C2.tv.p), N1 = TURN.length - 1;
      C2.tv.t = C2.tv.d > 0 ? e * N1 : (1 - e) * N1;
      if (C2.tv.p >= 1 || (ph === 'on' && want)) { C2.face = C2.faceA = C2.tv.d; C2.tv = null; } }
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
        OPEN_AT.forEach((x, i) => { if (C2.x > x && !capsSaid.has(i)) { capsSaid.add(i); caption([LEVEL2_OPENING[i]]); if (i === 1) cityT = 0; } });
        if (C2.x > -1300 && !nearSaid) { nearSaid = true; caption(NEAR); }
        if (C2.x >= FALL_X) { C2.stand = 0; C2.sd = null; ph = 'fall'; G.state = 'auto'; G.capQ.length = 0; C2.fallT = 0; C2.fy = C2.y; sfxS.fall(); clearHint('walk'); splash(C2.x, 13, 1.15); if (pli) splash(pli.x, 11, 1.1); for (const fx of [C2.x, pli ? pli.x : null]) if (fx != null) { fPush(fx, -3, 9); fPush(fx - 20, 2.4, 8); fPush(fx + 20, 2.4, 8); } }
        if (!G.walked && G.t > 400 && C2.x < START + 20) { G.walked = true; hint('walk', 'Hold to walk.'); }
        if (want) clearHint('walk');
      } else {
        C2.stand = clamp(C2.stand + (want ? -.08 : .04));
        if (C2.x > END_X - 170) C2.alpha = clamp((END_X - C2.x) / 170);      // build 124: he lasts until he is well into the mist, which hides him first
        if (C2.x >= END_X && G.state === 'play') finish();
      }
    }
    if ((ph === 'fall' || ph === 'pli') && C2.fallT < 340) {
      C2.fallT++; const top = smooth(0, 40, C2.fallT), topP = smooth(4, 44, C2.fallT);
      C2.sink = C_SINK * sunk(C2.fallT); C2.y = lerp(C2.fy ?? bankY(FALL_X) + 4, C2.sink, top);
      C2.x = lerp(FALL_X, WADE0, smooth(6, 210, C2.fallT));
      if (pli && (pli.mode !== 'climb' || pli.wal)) { pli.sink = PLI_SINK * sunk(C2.fallT - 4); pli.sy = lerp(pli.fy ?? bankY(pli.wx ?? pli.x) + 4, pli.sink, topP); if (pli.mode !== 'climb') pli.y = pli.sy; }
      // THEY WALLOW (build 119; the book, {29}: "they wallowed for a time"; owner: "can we [have] some flailing from both?
      // the in water action seems a little stale"): from the fall on, Christian heaves in his wading loop and Pliable in
      // the opening of his climbing video, played back and forth, with rings and a slosh; each is nearly still while one
      // of them speaks. Pliable faces Christian until his angry speech, then turns toward his own side.
      if (pli && pli.mode === 'in' && PLIC.length && C2.fallT >= 24) { pli.mode = 'climb'; pli.wal = true; pli.wk = 0; pli.fa = 1; pli.wx = pli.x; pli.wf = Math.floor(pli.anim) % (PLI.length || 1); }
    }
    // DEEP IN THE MIRE (build 260, owner: "He doesn't sink enough in the slough - when he reaches toward help, animation has
    // to jump to put him at right level. I want Christian pretty far down"): the wading and stuck pictures are drawn MD units
    // deeper than their own mud line (C2.md): MD_IN where they fall in, going down as he wades to MD_FAR by the far bank,
    // which is exactly where the lift's first picture has him (shoulder-deep; measured by matching the stuck video's
    // high-arm frame REACH_F to the lift's frame 0), so the grip and lift follow on with no jump
    { const p = clamp((C2.x - WADE0) / (STUCK_X - WADE0)), to = ph === 'wade' ? lerp(MD_IN, MD_FAR, smooth(0, .9, p)) : ph === 'stuck' || ph === 'help' ? MD_FAR : MD_IN;
      C2.md = C2.md == null ? to : C2.md + (to - C2.md) * .04; }
    const calm = !!(SPK && SPK.who !== N);      // one of the two is speaking: they hold nearly still
    // build 121 (owner: "struggling feels a bit repetitive"): they struggle in bursts with a breath between, each at his own
    // changing pace (burst(k): 0 resting .. 1 heaving), so no two heaves fall alike; drops fly while they heave
    const burst = k => smooth(.3, .7, .5 + .5 * Math.sin(G.t / (52 + 9 * k) + 2.2 * Math.sin(G.t / (131 + 17 * k) + k)));
    if (['fall', 'pli', 'backtalk'].includes(ph)) { const b = burst(1); waStep(calm ? .06 : .07 + .13 * b); }      // (build 143: the mud's answer comes from his pictures: see sense())
    if (ph === 'fall') {
      if (C2.fallT === 8 || C2.fallT === 14) { rings.push({ x: C2.x, y: 0, t: 0, k: 1.3 }); rings.push({ x: pli.x, y: 0, t: 0, k: 1.1 }); }
      if (C2.fallT === 120) { ph = 'pli'; heave(-1); talk(FALL, () => { pliGo = 1; }); }
    } else if (ph === 'pli' && pliGo) {
      // build 368, STORY MOVES (owner: "less game and more intentional story building moves"): (D) the choice waits until
      // Pliable has climbed out and gone into the mist; Christian is seen alone in the bog first (the camera comes in on him)
      pliGo++; if ((!pli || pli.alpha < .25 || pliGo > 900) && G.state === 'play' && !saying()) { pliGo = 0; choose2(); }
    } else if (ph === 'back') {
      waStep(.2);
      if (!C2.tv) { C2.x -= .3; C2.anim += .3 / CHR_STEP * 2.6; C2.face = -1; footfall(); }
      if (C2.x <= WADE0 - 60) { ph = 'backtalk'; talk(BACK, () => { turnC(1, 2); wadeOn(); }); }
    } else if (ph === 'wade') {
      // build 120 (owner: "can we make christian move across possibly happen quicker? it's a bit of a slog"): he makes more
      // ground with each heave (.55 a tick, was .32: about 14 s of holding, was 24); the tune still has a note for each footfall
      const v = want && !C2.tv ? .7 : 0, p = clamp((C2.x - WADE0) / (STUCK_X - WADE0));      // (build 183: DEEP 8, was 22: more of him shows at the far bank, head, shoulders and chest; owner: "show a bit more of Christian at the far bank")
      C2.x = Math.min(STUCK_X, C2.x + v); if (!C2.tv) C2.face = 1;
      waStep(v ? .2 : .08);
      if (v) { C2.anim += v / CHR_STEP * 3; footfall(); } else C2.anim = stepAnim(C2.anim, 0, CHR_STEP, CHR_META);
      // build 114 (owner: "make christian sink even further as he moves from one end of pond to other (till just head is
      // barely above water)"): deeper and deeper as he wades (DEEP below where he fell in, by the far bank only his head
      // shows); reaching up for Help's hand he heaves back up to where the grip needs him (see drawChr, 'help')
      C2.y = C_SINK + (SINK + DEEP - C_SINK) * smooth(0, .9, p);
      if (p > .45 && !fearsSaid) { fearsSaid = true; caption(FEARS); fearT2 = 0; }
      if (--fearT <= 0) { fearT = 260 + Math.random() * 260; sfxS.fear(); }
      if (G.state === 'play' && !want && G.cap <= 0 && !G.capQ.length && G.t % 600 === 300) hint('wade', 'Hold to struggle on.');
      if (want) clearHint('wade');
      if (C2.x >= STUCK_X) { ph = 'stuck'; strain = 0; slipT = 0; }
    } else if (ph === 'stuck') {
      // (build 119: Help walks in while the storyteller says he came; he speaks when he has come)
      // THE HEART OF THE LEVEL: he cannot get out alone. Holding does nothing but strain; he slips back; then Help comes.
      slipT++;
      waStep(want ? .2 : .07);
      if (want) { strain++; C2.anim += .5; if (strain % 40 === 1) sfxS.strain(); }
      C2.x = STUCK_X - 4 * Math.max(0, Math.sin(slipT / 50)) * smooth(60, 160, slipT);
      if (strain > 120 || slipT > 220) { ph = 'help'; C2.x = STUCK_X; talk(STUCK, () => { help = { a: 0, t: 0, w: HWALK.length >= 96 ? 0 : 1e9 }; talk(HELP.slice(0, 1), () => {}); }); }
    } else if (ph === 'help') {
      if (help && C2.reach < 1) C2.reach = Math.min(1, C2.reach + .05);
      // build 121 (owner: "help should rush in a little fast (like he knows it's [an emergency] - not run but quick nonetheless)
      // and kneel right away ... maybe Christian raises arm right before help gets there?"): he comes at half as fast again
      // as his video walks (.3 a tick), goes straight down on one knee at the edge (mv to video frame 82: kneeling, his arm
      // still low) and asks his question from there; at "Give me your hand" he holds it out (mv.to 150). Christian sees
      // him coming, lifts his head and has his arm up as Help arrives (C2.rt, his own clock; the two used to share mv).
      if (help && help.w < HSEQ.length - 1) { help.w += .3; if (help.w >= HSEQ.length - 1) mv = { t: 40, to: 82 }; }
      else if (help && !mv) mv = { t: 40, to: 82 };
      // build 287 (owner: "can christian not extend his hand, until it prompts him to take hand?"): he keeps struggling
      // while they talk and only lifts his head and arm once Help says "Give me your hand" (C2.handGo)
      if (help && C2.handGo) C2.rt = Math.min(150, (C2.rt || 0) + .4);
      if (help && help.w >= HSEQ.length - 1 && !help.said && G.state === 'play') { help.said = true; talk(HELP.slice(1), () => {}); }
      if (lift) { lift.t = Math.min(236, lift.t + .4); if (lift.t >= 236) { ph = 'drawn'; C2.done = 0; C2.x = HX + (LIFT_CHR - META.lift.ax) * CHR_K; C2.y = bankY(C2.x) + 4; C2.D = (META.lift.ground - liftWet(LIFT.length - 1).r) * CHR_K; C2.face = 1; C2.faceA = 1; C2.stand = 1; C2.sd = QUIET[0]; } }
    } else if (ph === 'drawn') {
      // the lift's last picture dissolves into the two men standing apart, then he turns to look back
      C2.done = Math.min(1, C2.done + .03);
      // BUILD 106, the book's order ({32} then {35}): Help bids him go on his way first; only then is the dreamer told of
      // the steps, so he looks back and the lights settle on them after "Go on your way" (it was the other way round)
      if (C2.done >= 1 && ph === 'drawn' && G.state === 'play' && !saying()) { ph = 'onway'; talk(ONWAY, () => { turnC(-1, 1.5); ph = 'look'; goldT = 0; if (help && HTURN.length && HWALK.length) help.lv = { t: 0, w: 0, d: 0 }; }); }
    } else if (ph === 'look') {
      if (!C2.tv) goldT++;
      // the lights leave him one by one and settle on the steps, each a note of the last phrase
      motes.forEach((mo, i) => { if (!mo.to && goldT > 60 + i * 55) { mo.to = steps[i]; } });
      if (goldT === 60) caption(STEPS);
      if (goldT > 60 + LAST.length * 55 + 160 && !saying() && G.state === 'play') { turnC(1, 1.5); ph = 'on'; hint('walk2', 'Hold to go on your way.'); }
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
    if (help) {
      if (fogH === 1) hiss(260, .5, .05, 3.5, 'lowpass');
      // the mist thins once he has come; it gathers again as he walks back into it, and closes behind Christian at the end
      const to = ph === 'on' ? .28 : help.lv && help.lv.t >= HTURN.length - 1 ? .5 : 0;
      fogH = to < fogH ? Math.max(to, fogH - .0013) : Math.min(to, fogH + .004); help.a = 1;
      const lv = help.lv;
      if (lv && !help.gone) {
        if (lv.t < HTURN.length - 1) { lv.p = Math.min(1, (lv.p || 0) + 1 / HTURN_TICKS); lv.t = lv.p >= 1 ? HTURN.length - 1 : lv.p * lv.p * (3 - 2 * lv.p) * (HTURN.length - 1); }      // build 365: a quick pivot (it took nearly seven seconds, walking round), then he goes
        else { lv.w += .2; lv.d += 13.1 * .2 * CHR_K; if (lv.d > 640) help.gone = true; }      // 13.1 pack px of ground to each frame of his walk (HW_OFF)
      }
    }
    fogS = ph === 'look' ? 1 - smooth(60, 60 + LAST.length * 55 + 120, goldT) : ph === 'on' ? Math.max(0, fogS - .01) : fogS;
    if (mv) mv.t = Math.min(mv.to ?? 150, mv.t + .4);
    if (G.act === 'hand') { G.actT++; if (mv && mv.t >= 150 && (C2.rt || 0) >= 150 && !G.ring && G.actT > 20) { dMore.textContent = 'take his hand ✦'; const [hx, hy] = handPt(); G.ring = () => [(hx - cam.cx) * cam.z + VW / 2, cam.wl + hy * cam.z]; } }
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
        if (ph === 'fall') { pli.mode = 'in'; pli.fy = pli.y; pli.st = 0; pli.stop = null; pli.leave = null; }
      } else if (pli.mode === 'climb' && PLIC.length && !pli.out) {
        // the video: he wades crossly to the bank, climbs up it and steps off; raised to meet the game's bank as he climbs
        // BUILD 106 (owner: "when pliable gets out sprite jumps around (skips locations)"): two jumps fixed. (1) At the end
        // he jumped 80 sideways into his walk: the video is drawn mirrored, so his feet in its last frame are LEFT of the
        // bank's edge (endX had the wrong sign). (2) At the start the video's first frame stood him about 36 to the right
        // of where he had sunk, and a little lower: that difference (dx0, dy0, measured once when the climb begins) is
        // carried and faded out over the first quarter of the climb, so he wades from where he was into the video's path.
        const M = META.climb, last = PLIC.length - 1, endX = HOME0 + (M.ax - M.end) * CHR_K;
        if (pli.ct == null) { pli.dx0 = pli.x - (HOME0 + (M.ax - M.c0) * CHR_K); pli.dy0 = (pli.y - (PLI_META.ground - 5) * CHR_K) - (M.sink - (M.ground - M.top0) * CHR_K); pli.c0 = 0; }
        if (pli.dxo == null) pli.dxo = pli.dx0;
        const pong = () => { const L = 34; pli.ct = 2 + L * (1 - Math.cos(Math.PI * pli.wt / L)) / 2; pli.c0 = pli.ct; };      // build 180: eased at each turn (it reversed at full speed, a jerk)
        if (pli.wal) {      // wallowing: the video's first three seconds back and forth, in bursts, sinking with Christian
          const b = burst(4); pli.wtV = lerp(pli.wtV ?? .1, calm ? .04 : .05 + .09 * b, .05); pli.wt = (pli.wt || 0) + pli.wtV; pong();
          pli.dy0 = ((pli.sy ?? pli.y) - (PLI_META.ground - 5) * CHR_K) - (M.sink - (M.ground - M.top0) * CHR_K); pli.wk = Math.min(1, pli.wk + .11);
        } else if (pli.dxo > .5) {      // build 121: he is well out in the slough: he struggles back toward his own side first
          pli.dxo = Math.max(0, pli.dxo - 1); pli.wtV = lerp(pli.wtV ?? .2, .14, .05); pli.wt = (pli.wt || 0) + pli.wtV; pong();
        } else { pli.ct = Math.min(last, (pli.ct || 0) + .34); }      // build 371 (owner: "make pliable get out faster ... struggle once then rise out"): the climb .34 a tick (was .2), the struggle back 1 (was .32)
        // BUILD 140: HIS TURN IN THE MUD IS A HEAVE ROUND, not a slow dissolve between mirrored pictures (there are no
        // frames of him turning). He ducks into the mud with a splash; the picture swaps over a few ticks at the bottom of
        // the duck, under the splash; he comes up facing the other way. tq: 0 to 1 over about half a second.
        { const tgt = pli.turn ? -1 : 1;
          if (pli.tgt !== tgt) { pli.tgt = tgt; pli.from = pli.fa ?? -1; pli.tq = pli.from === tgt ? 1 : 0; }
          if (pli.tq < 1) { const q0 = pli.tq; pli.tq = Math.min(1, q0 + .03);
            if (q0 < .42 && pli.tq >= .42) { const sx = pli.x + (M.ax - M.c0) * CHR_K; splash(sx, 12, 1.3); rings.push({ x: sx, y: 0, t: 0, k: 1.2 }); if (audio()) sfxS.wade(); } }
          pli.fa = lerp(pli.from, tgt, smooth(.4, .6, pli.tq)); pli.duck = 16 * Math.sin(Math.PI * pli.tq); }
        const p = pli.ct / last, fade = 1 - smooth(0, .25, (pli.ct - pli.c0) / Math.max(1, last - pli.c0));
        pli.face = -1; pli.x = HOME0 + pli.dxo; const up = smooth(.68, .85, p); pli.y = (1 - up) * M.sink + up * (bankY(endX) + 4 + M.top * CHR_K) + pli.dy0 * fade + pli.duck; if (up < .05) pli.maxY = Math.max(pli.maxY || 0, pli.y);
        if (pli.ct >= last) { pli.out = true; pli.x = endX; pli.y = bankY(endX) + 4; pli.anim = 0; }
      } else if (pli.mode === 'climb') {
        // struggling back to the bank next to his own house, then out and away into the mist
        pli.face = -1; const v = pli.x > HOME0 + 10 ? .55 : 1.55;      /* build 125: once out he hurries away (half as fast again as a walk) and the mist takes him sooner */ pli.x -= v; pli.anim += v / PLI_STEP * (pli.x > HOME0 ? 2.2 : 1);
        if (pli.x > HOME0) pli.y = PLI_SINK * clamp((pli.x - HOME0) / (PLI_FALL - HOME0)) + (1 - clamp((pli.x - HOME0) / (PLI_FALL - HOME0))) * (bankY(HOME0 - 30) + 4);
        else pli.y = bankY(pli.x) + 4;
        if (pli.x < PLI_FALL - 20 && pli.x > HOME0 + 30 && G.t % 30 === 0) rings.push({ x: pli.x, y: 0, t: 0, k: .9 });
        pli.alpha = clamp((pli.x - (HOME0 - 190)) / 130);
        if (pli.alpha <= 0) pli = null;
      }
    }
    // --- THOUGHTS (build 370): what he sees in his mind; each comes, lingers and goes by itself ---
    if (cityT >= 0) cityT++;
    if (fearT2 >= 0) fearT2++;
    // --- the lights he gathered: a slow cloud behind his shoulder; at the end they fly to the steps ---
    for (const mo of motes) {
      mo.tw += .03;
      if (mo.to) {
        const tx = mo.to.x, ty = -(mo.to.h + 2.5);      // build 365: each light settles ON its stone (they used to stop in the air above it)
        mo.x += (tx - mo.x) * .04; mo.y += (ty - mo.y) * .04;
        if (!mo.to.lit && Math.hypot(tx - mo.x, ty - mo.y) < 6) { mo.to.lit = .01; note(mo.to.nt, .06, 4); rings.push({ x: tx, y: 0, t: 0, k: .6 }); }
      } else { mo.x += (C2.x + mo.ox * C2.face - mo.x) * .05; mo.y += (C2.y + mo.oy + Math.sin(mo.tw) * 6 - mo.y) * .05; }
    }
    for (const s of steps) if (s.lit) s.lit = Math.min(1, s.lit + .02);
    for (const r of rings) r.t++; rings = rings.filter(r => r.t < 150);
    for (const d of drops) { d.t++; d.x += d.vx * .97; d.y += d.vy; d.vy += MUD_G; if (d.y > 0 && Math.random() < .12 * wetAt(d.x)) rings.push({ x: d.x, y: 0, t: 70, k: .22 }); }
    drops = drops.filter(d => d.y <= 0 && d.t < 120);
    for (const c of churns) c.a -= .0045; churns = churns.filter(c => c.a > 0); if (churns.length > 40) churns.splice(0, churns.length - 40);
    // --- the camera draws back in the mire, and the look follows the story: gold on the plain, mist and grey in the bog ---
    let t, p = clamp((C2.x - FALL_X) / (STUCK_X - FALL_X));
    if (ph === 'plain') { const f = smooth(-1350, FALL_X, C2.x); t = { cx: lerp(C2.x + 150, -470, f), z: lerp(1, .8, f), wl: lerp(440, 392, f) }; }
    // build 202 (owner: the mire "just doesn't look right ... think very carefully about composition"): the struggle was a
    // twentieth of the picture's height, jammed in the bottom-left corner on the words, the right two-thirds empty sky. Now
    // the camera pushes in slowly as they fall (the plain's .8 eases to 1.05), the two men about a fifth of the picture's
    // height, their home bank at the left edge, the oak's long limb reaching in over them; the water line is higher so
    // a band of mud lies between them and the words
    else if (ph === 'pli' && (!pli || pli.alpha < .6 || pli.out)) t = { cx: C2.x + 40, z: 1.2, wl: 320 };      // build 368 (D): he is left alone
    else if (['fall', 'pli', 'back', 'backtalk'].includes(ph)) t = { cx: -740, z: 1.05, wl: 330 };
    // build 114: the oak is bigger, so at the far bank the camera draws back a little more and the water line sits lower,
    // so the whole crown is in the picture (the top of the screen must be above about 640 units over the water: wl / z)
    // build 202: wading he starts on the left third, close, with open mud ahead; the camera draws back as he nears the far
    // bank, so the oak comes into the picture as his goal
    else if (ph === 'wade' || ph === 'stuck') { const q = smooth(.45, 1, p); t = { cx: lerp(C2.x + 150, -290, q), z: lerp(1.05, .9, q), wl: lerp(335, 365, q) }; }      // build 183: a little closer at the far bank (was .6); Help's coming draws it back to .6 for the oak
    // build 202: "he could not get out" is seen close, as he struggles at the far bank; only when Help comes does the camera
    // draw back to the whole oak
    else if (ph === 'help' && !help) t = { cx: -290, z: .9, wl: 365 };
    else if (ph === 'help' || ph === 'drawn') t = { cx: -240, z: .6, wl: 392 };
    else if (ph === 'look' && goldT > 40) t = { cx: -480, z: .62, wl: 400 };      // build 368 (C): the camera draws back from bank to bank while the lights find the steps
    else t = { cx: Math.max(-330, C2.x + 120), z: .66, wl: 425 };
    const e = ph === 'plain' ? .06 : .02;
    cam.cx += (t.cx - cam.cx) * e; cam.z += (t.z - cam.z) * e; cam.wl += (t.wl - cam.wl) * e;
    let L;
    if (ph === 'plain') { const mi = PLAIN_MIST(C2.x); L = { mist: mi, veil: .84 * smooth(-1300, FALL_X, C2.x), gold: PLAIN_GOLD(C2.x), disc: lerp(1, .3, mi), sky: lerp(0, 1, mi) }; }
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
      sfxS.wade();
      if (ph === 'wade' && noteI < WADE_TUNE.length) bowed(WADE_TUNE[noteI++], .05, 1.9);
    }
    lastFoot = down ? f : -1;
  }

  // ---------- drawing ----------
  let nearC = null, mudC = null, mudGd = null, bandC = null, profC = null, chrLate = 0; const mudCh = [];
  function draw() {
    if (!nearC || nearC.width !== cv.width || nearC.height !== cv.height) nearC = mk(cv.width, cv.height);
    RECS = {}; chrLate = 0; SH0 = SHN; SHN = [];
    const { z, cx, wl } = cam, hor = wl - 140 * z, S = DPR;
    const X = x => (x - cx) * z + VW / 2, Y = y => wl + y * z;
    const warmth = look.gold, lightCol = mix(LIGHT, GOLD, warmth * .8);
    // the far light: in the oak's branches when he is near, far off over the plain before
    const near = smooth(-1300, -250, cx);
    // build 124: as he goes on his way the far light is ahead of him again, low in the mist on the right (ahead: 0 at the oak .. 1)
    const ahead = ph === 'on' ? smooth(-120, 360, C2.x) : 0;
    const discX = lerp(lerp(VW / 2 + (OAK_X + 72 * OAK_S - cx) * z * .12, X(OAK_X + 72 * OAK_S), near), VW * .8, ahead), discY = lerp(lerp(150, Y(-258 * OAK_S), near), hor - 105, ahead);      // the far light in the oak's branches
    ctx.setTransform(S, 0, 0, S, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    // sky: the clear one, the misty one over it
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(skyClear, 0, 0, VW, hor + 1);
    ctx.globalAlpha = clamp(look.sky * .6 + look.mist * .4); ctx.drawImage(skyMist, 0, 0, VW, hor + 1); ctx.globalAlpha = 1;
    // (1) THE PLACE HE TELLS OF, IN HIS MIND (build 370; owner: "it should be like what he sees in his mind - thoughts"):
    // on "We shall shine like the sun" a far city on a hill and tall shining ones stand faintly in the gold sky over the
    // far light, wavering as a thought does, and fade before the mist comes (the book, {27}, {28})
    if (cityT >= 0 && ph === 'plain') { const a = smooth(20, 150, cityT) * (1 - smooth(520, 760, cityT)) * (1 - look.mist);
      if (a > .01) { const T = thoughts(), c = T.city, w = 460 + 12 * Math.sin(G.t / 70), h = w * c.height / c.width, y = discY - h * .62 - 10 - cityT * .03;
        ctx.globalAlpha = a * (.6 + .06 * Math.sin(G.t / 47)); ctx.drawImage(c, discX - w / 2, y, w, h);
        ctx.globalAlpha = a * .2; ctx.drawImage(c, discX - w * .51 + 6 * Math.sin(G.t / 31), y - 4, w * 1.02, h * 1.02); ctx.globalAlpha = 1; } }
    if (warmth > .02) { ctx.globalCompositeOperation = 'soft-light'; const g = ctx.createRadialGradient(discX, discY, 10, discX, discY, 700); g.addColorStop(0, css(GOLD, .7 * warmth)); g.addColorStop(1, css(GOLD, .15 * warmth)); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, hor + 1); ctx.globalCompositeOperation = 'source-over'; }
    if (gloom > .01) { ctx.fillStyle = css(DARK, .3 * gloom); ctx.fillRect(0, 0, VW, hor + 1); }
    const disc = look.disc * (1 - .5 * gloom);
    glow(ctx, discX, discY, 210, lightCol, .5 * disc); glow(ctx, discX, discY, 70, lightCol, .7 * disc);
    { const R = 15 * z / .66, g = ctx.createRadialGradient(discX, discY, 0, discX, discY, R * 1.6), c0 = mix(LIGHT, GOLD, warmth * .35); g.addColorStop(0, css(c0, .9 * disc)); g.addColorStop(.5, css(c0, .8 * disc)); g.addColorStop(.68, css(c0, .25 * disc)); g.addColorStop(1, css(c0, 0)); ctx.fillStyle = g; ctx.fillRect(discX - 2 * R, discY - 2 * R, 4 * R, 4 * R); }      // build 260: a soft-edged sun (a hard disc in a soft sky)
    // the water (or, over the plain, the far fields): pale under the mist at the horizon, deeper toward us
    { const g = ctx.createLinearGradient(0, hor, 0, VH); g.addColorStop(0, css(tone(.95))); g.addColorStop(.3, css(tone(lerp(.84, .9, look.mist))));
      g.addColorStop(1, css(tone(lerp(.5, .66, look.mist)))); ctx.fillStyle = g; ctx.fillRect(0, hor, VW, VH - hor); }
    glow(ctx, discX, 2 * hor - discY + 30, 150, lightCol, .4 * disc);
    if (warmth > .3) { ctx.globalCompositeOperation = 'soft-light'; glow(ctx, discX, hor + 40, 520, GOLD, .5 * warmth); ctx.globalCompositeOperation = 'source-over'; }
    // far shore, and the ghost trees, each with a short reflection
    // build 260 (three critics: "a hard double line across the whole sky at the horizon"): the far shore is no longer a
    // flat band with a hard top; it is a low haze that thickens down to the water line and melts into it
    { const g = ctx.createLinearGradient(0, hor - 16 * z, 0, hor + 8 * z), c0 = tone(.86); g.addColorStop(0, css(c0, 0)); g.addColorStop(.6, css(c0, .55)); g.addColorStop(.72, css(c0, .6)); g.addColorStop(1, css(c0, 0));
      ctx.fillStyle = g; ctx.fillRect(0, hor - 16 * z, VW, 24 * z); }
    for (const g of GHOSTS) {
      const s = z * g.p * .9, gx = (g.x - cx * g.p) * z + VW / 2, gy = hor + (wl - hor) * g.p * .55;
      if (gx < -260 || gx > VW + 260) continue;
      putTree(ctx, g.b, gx, gy, s); ctx.globalAlpha = .3; putTree(ctx, g.b, gx, gy, s, -s * .7); ctx.globalAlpha = 1;
    }
    // the mire running back behind them (FARMUD): nearer rows slide more with the camera, are taller and darker
    for (const row of FARMUD) {
      const q = row.q, p = .3 + .7 * q, gy = hor + (wl - hor) * q, hz = (.2 + .8 * q) * z;
      ctx.fillStyle = css(mix(tone(.4), tone(.84), Math.pow(1 - q, 1.1)), .6 + .4 * q); ctx.beginPath();
      for (const m of row.ps) { const sx = (m.x - cx * p) * z + VW / 2, w = m.L * z; if (sx > VW + 20 || sx + w < -20) continue; wavy(ctx, sx, gy, w, m.h * hz, m.h * .35 * hz, m.s); }
      ctx.fill();
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
    if (SHORE) {
      n.fillStyle = css(land);
      // the trunk flares smoothly into the ground on both sides, as an old oak's foot does
      { const g0 = bankY(OAK_X) + 4;
        for (const sd of [-1, 1]) { const xa = OAK_X + sd * 30 * OAK_S, xb = OAK_X + sd * 115 * OAK_S, yb = bankY(xb) + 2;
          n.beginPath(); n.moveTo(OAK_X, g0 - 46); n.lineTo(xa, g0 - 40); n.bezierCurveTo(xa + sd * 10, g0 - 8, lerp(xa, xb, .5), yb - 2, xb, yb); n.lineTo(xb, yb + 3); n.lineTo(OAK_X, g0 + 3); n.closePath(); n.fill(); } }
      // beyond where people stand the shore is gently contoured: a few long, low swells and dips in one clean line
      // (drawn over the ground, which is unchanged)
      n.beginPath(); n.moveTo(x0, 2); for (let x = x0; x <= x1; x += 3 / z) n.lineTo(x, bankY(x) < -2 ? bankY(x) + 1 - hum(x) : 2); n.lineTo(x1, 2); n.closePath(); n.fill();
    }
    // Pliable. In the mire he is drawn later, straight onto the screen (pliMire): never mirrored, and after the mud
    // surface so its collar and strings lie on him (build 143)
    const pliIn = pli && PLIC.length && pli.mode === 'climb' && !pli.out;
    const pliMire = n => {
        // wallowing he faces Christian (the same frames, mirrored about his own middle), then turns to his own side
        const im = PLIC[Math.floor(pli.ct || 0)], wk = pli.wal ? pli.wk : 1, fl = (1 - (pli.fa ?? -1)) / 2, cw = 2 * (META.climb.ax - plCen(Math.floor(pli.ct || 0))) * CHR_K;
        if (wk < 1) figure(n, 'pli0', PLI[pli.wf || 0], PLI_META, pli.wx, pli.sy, 1, fig, true, pli.alpha * (1 - smooth(.5, 1, wk)));
        MREC = 'P'; FIG_WET = { D: pli.maxY || 0, a: .78 }; FIG_DIP = 60 * (1 - smooth(.6, .8, (pli.ct || 0) / 119));
        // build 183: each picture of his climbing video melts into the next (12 a second, each held five ticks, was steppy)
        const pc = pli.ct || 0, im2 = PLIC[Math.min(PLIC.length - 1, Math.floor(pc) + 1)], bk = 0 * pc;      // build 212: no melting of one picture into the next (two poses laid over each other read as a pale, see-through double outline)
        if (fl < .99) { const a2 = pli.alpha * smooth(0, .5, wk) * (1 - smooth(.5, 1, fl)); figure(n, 'pli2', im, META.climb, pli.x + cw, pli.y, 1, fig, true, a2); if (bk > .03) figure(n, 'pli2b', im2, META.climb, pli.x + cw, pli.y, 1, fig, true, a2 * bk); }
        if (fl > .01) { const a1 = pli.alpha * smooth(0, .5, wk) * smooth(0, .5, fl); figure(n, 'pli', im, META.climb, pli.x, pli.y, -1, fig, true, a1); if (bk > .03) figure(n, 'plib', im2, META.climb, pli.x, pli.y, -1, fig, true, a1 * bk); }
        FIG_DIP = 0; MREC = null; FIG_WET = null;
    };
    TALKM = talkMove(PL);
    if (pli && !pliIn) {
      if (pli.stop && pli.mode === 'follow' && PSTOP.length) {
        const t = pli.stop.t, L = PSTOP.length - 50, f = t < 50 ? Math.floor(t) : 50 + Math.floor(((u => u < L ? u : 2 * L - u))((t - 50) % (2 * L)));
        figure(n, 'plistop', PSTOP[Math.min(PSTOP.length - 1, f)], META.stop, pli.stop.x0, pli.y + FOOT_DROP * smooth(38, 49, t), pli.face, fig, pli.y > 2, pli.alpha);
      }
      else {
        if (pli.leave && pli.mode === 'follow') figure(n, 'plileave', PSTOP[pli.leave.f], META.stop, pli.leave.x, pli.y + FOOT_DROP * smooth(38, 49, pli.leave.f), pli.face, fig, pli.y > 2, pli.alpha * pli.leave.a);
        const st = pli.mode === 'follow' && PLI_ST ? pli.st || 0 : 0;
        if (pli.out) FIG_WET = { D: 58, a: .7 };      // out of the mire: wet to the waist
        if (st < 1) figure(n, 'pli', PLI[Math.floor(pli.anim) % (PLI.length || 1)], PLI_META, pli.x, pli.y, pli.face, fig, pli.y > 2 && !(PLIC.length && pli.mode === 'climb'), pli.alpha * (1 - smooth(.5, 1, st))); FIG_WET = null;
        if (st > 0) figure(n, 'plist', PLI_ST, PLI_ST_META, pli.x, pli.y, pli.face, fig, pli.y > 2, pli.alpha * smooth(0, .5, st));
      }
    }
    // Help: he comes out of the mist on the far bank, steps to the edge, kneels and holds out his hand
    TALKM = null;
    const vt = mv ? mv.t : 0, lt = lift ? lift.t : -1, mixIn = lift ? clamp(lt / 3.2) : 0, talkH = talkMove(H), talkC = talkMove(C);
    if (ph === 'drawn' || ph === 'look' || ph === 'onway' || ph === 'on') {
      const d = ph === 'drawn' ? C2.done : 1;
      FIG_WET = liftWet(LIFT.length - 1); if (d < 1) figure(n, 'lift', LIFT[LIFT.length - 1], META.lift, HX, HY(), 1, fig, true, 1 - d); FIG_WET = null;
      const hx0 = HX + (LIFT_HELP - META.lift.ax) * CHR_K, lv = help && help.lv;
      if (help && help.gone) {}
      else if (!lv) { TALKM = talkH || { sh: 0, sy: breath(3) }; figure(n, 'help', HELPF[0], META.help, hx0, HY(), 1, fig, false, d); }
      else if (lv.t < HTURN.length - 1) figure(n, 'help', HTURN[Math.floor(lv.t)], META.hturn, hx0, HY(), 1, fig, false, d);
      else {      // walking back the way he came, into the mist: his walk mirrored, one stride over and over
        const x = hx0 + lv.d, a = d * (1 - smooth(420, 640, lv.d));
        if (lv.w < 2) figure(n, 'help', HTURN[HTURN.length - 1], META.hturn, hx0, HY(), 1, fig, false, a * (1 - smooth(.6, 2, lv.w)));
        figure(n, 'helpw', HWALK[16 + Math.floor(lv.w) % 16], META.hwalk, x, bankY(x) + 4, -1, fig, false, a * smooth(0, .6, lv.w));
      }
      TALKM = talkC; FIG_WET = { D: C2.D || 0, a: .72 }; drawChr(n, fig, d); TALKM = null; FIG_WET = null;
    } else {
      TALKM = vt > 0 ? null : talkH || { sh: 0, sy: breath(3) };      // not while he kneels and reaches: his hand must stay where Christian's meets it; standing, he breathes (build 120)
      if (help && help.w < HSEQ.length - 1) { const [f, o] = HSEQ[Math.floor(help.w)], hx = HX + o * CHR_K; figure(n, 'help', HWALK[f], META.hwalk, hx, bankY(hx) + 4, 1, fig, false, help.a); }
      else if (help && mixIn < 1) figure(n, 'help', HELPF[at(HELP_SRC, vt)], META.help, HX, HY(), 1, fig, false, help.a * (1 - mixIn));
      TALKM = null;
      if (lift) { const lf = at(LIFT_SRC, lt); MREC = 'L'; FIG_WET = liftWet(lf); figure(n, 'lift', LIFT[lf], META.lift, HX, HY(), 1, fig, true, mixIn); MREC = null; FIG_WET = null; }
      chrLate = 0;
      if (!lift || mixIn < 1) { if (['fall', 'pli', 'back', 'backtalk', 'wade', 'stuck', 'help'].includes(ph)) chrLate = 1 - mixIn; else { TALKM = C2.reach > 0 ? null : talkC; drawChr(n, fig, 1 - mixIn); TALKM = null; } }
    }
    // the lights he gathered
    // FEET IN THE SOFT GROUND (owner, build 114: feet "floating above ground a little - maybe sink them in a bit", and
    // the idea of "mud prints or feet sinking slightly in mud"): the land's own edge is laid again over the bottom of
    // everyone standing on it, a little ragged, so feet sink slightly into the ground; and faint wet prints (a little
    // sky caught in them) are left in the soft ground near the bog
    n.fillStyle = css(land); n.beginPath(); n.moveTo(x0, 0); for (let x = x0; x <= x1; x += 3 / z) n.lineTo(x, bankY(x) < -2 ? bankY(x) - 1.2 - 1.6 * bankN(x * .09, 2) : 0);      // build 115: only on real ground (it ran as a dark line along the bog) n.lineTo(x1, 0); n.fill();
    // REALISM IN THE BOG (build 129): drops are small dark streaks along their own flight (drawn with the mud surface,
    // after the mirror, since build 143); the low heave of mud round each body (mound) is now the collar of the surface
    if (0) for (const pr of prints) { const a = .22 * (1 - smooth(900, 1600, pr.t)); if (a < .01) continue; n.fillStyle = css(LIGHT, a); n.beginPath(); n.ellipse(pr.x, bankY(pr.x) + 1.2, 6, .9, 0, 0, 7); n.fill(); }
    // build 114 (owner: "not sure about light dots above pliable's head"): the lights he gathered are no longer shown
    // following him; they first appear behind his shoulder when he looks back, and fly to the steps
    // THE STEPS (build 365, owner: "the stepping stones don't show up any more - how does this fit with story in the book?").
    // The stones were no longer drawn: only the mist over them thinned and the lights stopped in the air. In the book
    // ({35}) the King's labourers laid "good and substantial steps ... through the very midst of this slough", hard to see
    // in foul weather; Christian, fleeing in fear, never looked for them ({33}). So: low flat stones lying in a line across
    // the slough, hidden until his lights find them; each light settles on its stone and leaves a warm edge on its top
    for (const st of steps) { const c = smooth(0, .6, st.lit || 0); if (c < .01) continue;
      const x0s = st.x - st.w, x1s = st.x + st.w, top = -st.h, k = st.lean * .04;
      n.globalAlpha = c; n.fillStyle = css(mix(land, tone(.42), .22)); n.beginPath(); n.moveTo(x0s, 2);
      n.bezierCurveTo(x0s + 1, top * .4, x0s + st.w * .35, top - k, st.x, top - k * .3); n.bezierCurveTo(x1s - st.w * .35, top + k, x1s - 1, top * .4, x1s, 2); n.closePath(); n.fill();
      n.globalAlpha = c * (.35 + .4 * (1 - smooth(.6, 1, st.lit || 0))); n.strokeStyle = css(mix(GOLD, LIGHT, .4)); n.lineWidth = 1.1; n.beginPath(); n.moveTo(x0s + st.w * .25, top * .82); n.quadraticCurveTo(st.x, top - k * .3 - .6, x1s - st.w * .25, top * .82); n.stroke(); n.globalAlpha = 1; }
    for (const mo of motes) { if (!mo.to && ph !== 'look') continue; const a = (.55 + .3 * Math.sin(mo.tw * 1.7)) * (ph === 'look' ? smooth(0, 50, goldT) : 1); mote(n, mo.x, mo.y, mo.to ? 3 : 1.8, mo.to ? 1 : a); }
    // BEHIND THE PEOPLE, NOT ACROSS THEM (build 128, owner: "you don't think white mist between mud and the character looks
    // strange?"): the thin mist over the water and the low mist round the two in the bog were drawn over the figures, so a
    // white band lay between each body and the dark mud it stands in. Both are now laid BEFORE the near picture: the
    // mist lies behind and beside them and their bodies go straight down into the mud. (On the plain, at the bog's edge,
    // the thin mist still lies over their feet, as the owner chose in build 115: see further down.)
    const threadsNow = () => { ctx.globalAlpha = .55 * look.mist; const o = (G.t * .15) % VW; ctx.drawImage(threads, -o, wl - 22, VW, 40); ctx.drawImage(threads, VW - o, wl - 22, VW, 40); ctx.globalAlpha = 1; };
    // (build 129: the low mist over the hidden steps lay across the two men's waists as well; it is behind the near picture now)
    const bank = (xa, xb, y0, h, rad, a, n, seed, flat) => { if (a <= .01) return; const R = rngS(seed);
      for (let i = 0; i < n; i++) { const u = R(), v = R() * R(), r = (.6 + .5 * R()) * rad * z, e = flat ? .25 + .15 * R() : .55 + .3 * R(), ph = R() * 6, k = .35 + .3 * R();
        const x = X(xa + u * (xb - xa) + Math.sin(G.t * .003 + ph) * 8), y = Y(y0 - v * h);
        if (x + r < 0 || x - r > VW) continue;
        ctx.globalAlpha = Math.min(1, a * k); ctx.drawImage(puff, x - r, y - r * e, 2 * r, 2 * r * e); }
      ctx.globalAlpha = 1; };
    for (const st of steps) { const c = st.lit || 0; bank(st.x - 70 + c * 90, st.x + 70 + c * 90, 12, 10, 120, (1 - smooth(0, 1, c)) * (.55 + .3 * look.mist) * (ph === 'look' || ph === 'on' ? 1 : fogS), 6, 11 + st.i, true); }
    // RIPPLES GO ROUND THEM (build 130, owner: "how do we make circles go around them?"). Each ripple was drawn whole, on top
    // of everything, in front of the body, so it lay before him like a hoop on the ground. Now its FAR half is drawn
    // here, before the near picture (the body hides its middle), and its NEAR half later, in front of him: the ripple
    // passes behind his waist and comes round in front. Ripples in thick mud: two slow dull swells to each, a dark trough
    // with a faint light on the near lip (bright thin rings read as clear water; broken pieces looked like a target).
    // ONE RING, GOING ROUND (build 143, owner: "upper half of mud circle and lower half should really tie together -
    // currently they seem like distinct halves"). Both halves are now the same ring: the same curve, the same weight and
    // tone, the same light lip, ending at exactly the same two points; the far half is only a little fainter. And both
    // are laid over the same mud: the far half used to go down before the dark churned mud, which then covered it.
    // The far half is kept off the banks (it would lie across their faces).
    const ripples = far => {
      if (far) { ctx.save(); ctx.beginPath(); ctx.rect(X(HOME0 + 15), 0, X(BANK0 - 12) - X(HOME0 + 15), VH); ctx.clip(); }
      ctx.lineCap = 'butt';
      for (const r of rings) {
        const u = r.t / 150, cxr = X(r.x), cyr = wl + 1 + r.y * z, a0 = far ? Math.PI : 0, a1 = far ? 2 * Math.PI : Math.PI;
        const wet = wetAt(r.x);      // build 132: in mud a slow dark swell; the more water there is, the quicker, wider and brighter the ring
        // build 310 (owner: "mud still acts little water - needs more viscosity"): in mud a ring is one slow, thick, dull swell that
        // eases to a stop close to where it began (u ** .45), with hardly any sheen; the second ring and the bright lip only in water
        const vis = 1 - smooth(.25, .75, wet), ue = lerp(u, Math.pow(u, .45), vis), n = wet > .4 ? 2 : 1;
        for (let i = 1; i <= n; i++) { const rx = (14 + i * 18 + ue * lerp(18, 78, wet)) * z * r.k, ry = rx * .08, a = (1 - u) * (1 - i * .28) * (far ? .82 : 1);
          ctx.lineWidth = lerp(3.4, 2.4 * (1 - .45 * wet), 1 - vis); ctx.strokeStyle = css(DARK, .36 * a * (1 - .5 * wet)); ctx.beginPath(); ctx.ellipse(cxr, cyr, rx, ry, 0, a0, a1); ctx.stroke();
          ctx.lineWidth = 1; ctx.strokeStyle = css(LIGHT, (.24 + .4 * wet) * a * (1 - .8 * vis)); ctx.beginPath(); ctx.ellipse(cxr, cyr + 1.9, rx, ry, 0, a0, a1); ctx.stroke(); }
      }
      if (far) ctx.restore(); };
    if (ph !== 'plain') threadsNow();
    // LOW MIST ROUND THE TWO IN THE BOG (build 125, owner: "more fog beneath Christian and pliable when they're in [the] bog
    // but not as much near their faces"): a flat lens of mist hugs the surface round each of them, thickest at the mud
    // line and gone by chest height, so heads and shoulders stand clear above it
    { const low = (x, a, ry = 40) => { if (a <= .02) return; const mx = X(x), my = wl - 9 * z; if (mx < -200 || mx > VW + 200) return;
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, VW, wl); ctx.clip(); ctx.translate(mx, my); ctx.scale(150 * z, ry * z); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);      // build 203: only above the surface (below it, on the darker mud, it showed as a pale grey disc under each man)
        g.addColorStop(0, css(tone(.93), .5 * a)); g.addColorStop(.5, css(tone(.93), .3 * a)); g.addColorStop(1, css(tone(.93), 0));
        ctx.fillStyle = g; ctx.fillRect(-1, -1, 2, 2); ctx.restore(); };
      if (['fall', 'pli', 'back', 'backtalk', 'wade', 'stuck', 'help'].includes(ph)) { const deep = smooth(C_SINK + 10, SINK + DEEP, C2.y);      // the deeper he is, the lower and thinner it lies: his head must stay clear
        low(C2.x + 6, (ph === 'fall' ? smooth(20, 120, C2.fallT) : 1) * (lift ? 1 - clamp(lift.t / 60) : 1) * (1 - .45 * deep), lerp(40, 13, deep)); }
      if (pli && pli.mode === 'climb' && !pli.out) low(pli.x + (META.climb.ax - META.climb.c0) * CHR_K * (1 - .6 * smooth(.25, .7, (pli.ct || 0) / 119)), (pli.wk ?? 1) * (1 - smooth(.6, .85, (pli.ct || 0) / 119))); }
    ctx.drawImage(nearC, 0, 0, VW, VH);
    // --- the mirror: the near picture upside down under the water line, in thin strips that wander more the nearer they are ---
    const wx0 = Math.max(0, X(WATER_L));
    if (wx0 < VW) {
      // build 260: strips one picture-pixel high (they were two, each upright inside, so every slanting edge of the oak's
      // reflection came out as a staircase)
      for (let y = 0; y < VH - wl; y += 1) {
        const d = y / (VH - wl), dx = (wob(y * .045 + G.t * .004, 2) - .5) * (1 + 6 * d) + Math.sin(y * .12 + G.t * .02) * d * 1.2;      // build 260: a gentler, slower wander (the big per-row jitter tore the oak's reflection into sawteeth)
        ctx.globalAlpha = lerp(.9, .56, d);
        ctx.drawImage(nearC, wx0 * S, Math.max(0, (wl - y - 1)) * S, (VW - wx0) * S, S, wx0 + dx, wl + y, VW - wx0, 1.15);
      }
      ctx.globalAlpha = 1;
    }
    // MIRE, NOT A MIRROR, WHERE THEY FLOUNDER (build 123, owner: "the reflection [is] stunningly beautiful but i'm not sure it
    // works where characters are (maybe where tree is it could be watery-er)"). The clear mirror belongs to still water:
    // under the oak and along the far bank, where it is now a little stronger. Across the slough where they fall and wade
    // the surface is thick mud with only a dull sheen (mud(x): thickest by the home bank, clearing toward the far side),
    // and wherever someone has just heaved or splashed it is churned for a few seconds (churns, fed by splash()) and then
    // settles. It is laid over the mirror in narrow upright bands of the mire's own tones. The grip and the lift at the
    // far bank are left clear on purpose.
    if (wx0 < VW) {
      const g = ctx.createLinearGradient(0, hor, 0, VH); g.addColorStop(0, css(tone(.86))); g.addColorStop(.3, css(tone(lerp(.7, .78, look.mist)))); g.addColorStop(1, css(tone(lerp(.44, .56, look.mist))));
      // build 127 (owner: "let's see more of the mud instead"): the mire is a shade darker than the water, and where it has
      // just been churned a dark wet patch shows at the surface round whoever is struggling, with the rings lying on it
      const gd = ctx.createLinearGradient(0, wl, 0, wl + 44 * z); gd.addColorStop(0, css(tone(.24), .72)); gd.addColorStop(.4, css(tone(.3), .36)); gd.addColorStop(1, css(tone(.34), 0));      // build 143: from the surface down; above it the mud surface itself (collars) meets the bodies
      const bw = 5; mudCh.length = 0; mudGd = gd;
      // the mud, laid over the mirror through the map of mud and pools; wherever someone has just churned it, a pool is
      // stirred to mud for a few seconds (churns) and then clears again. (Christian in the mire is drawn after the mirror
      // is made, chrLate, so he never has a reflection: where he flounders no pool would stay clear.)
      if (!mudC || mudC.width !== cv.width || mudC.height !== cv.height) mudC = mk(cv.width, cv.height);
      { const mc = mudC.getContext('2d'); mc.setTransform(S, 0, 0, S, 0, 0); mc.globalCompositeOperation = 'source-over'; mc.globalAlpha = 1; mc.clearRect(0, 0, VW, VH);
        mc.imageSmoothingEnabled = true; mc.drawImage(mudMap, X(MUD_X0), wl + 1, MUD_W * z, MUD_H * z);
        for (const c of churns) { const a = Math.min(1, c.a * 2.2), mx = X(c.x); if (mx < -200 || mx > VW + 200) continue;
          mc.save(); mc.translate(mx, wl); mc.scale(105 * z, 95 * z); const q = mc.createRadialGradient(0, 0, 0, 0, 0, 1); q.addColorStop(0, 'rgba(255,255,255,' + a + ')'); q.addColorStop(.6, 'rgba(255,255,255,' + a * .85 + ')'); q.addColorStop(1, 'rgba(255,255,255,0)');
          mc.fillStyle = q; mc.fillRect(-1, 0, 2, 1); mc.restore(); }
        mc.globalCompositeOperation = 'source-in'; const q = mc.createLinearGradient(0, hor, 0, VH); q.addColorStop(0, css(tone(.64))); q.addColorStop(.3, css(tone(lerp(.5, .56, look.mist)))); q.addColorStop(1, css(tone(lerp(.3, .38, look.mist))));      // build 202: the mire a clear step darker than the sky (it was nearly the sky's own pale, and read as mist or water): heavy earth under a bright horizon, the pools bright in it
        mc.fillStyle = q; mc.fillRect(0, wl, VW, VH - wl);
        mc.globalCompositeOperation = 'source-atop'; mc.drawImage(mudLt, X(MUD_X0), wl + 1, MUD_W * z, MUD_H * z);      // build 257
        mc.globalCompositeOperation = 'source-over'; }
      ctx.drawImage(mudC, 0, 0, VW, VH);
      for (let sx = Math.floor(wx0 / bw) * bw; sx < VW; sx += bw) {
        const x = (sx + bw / 2 - VW / 2) / z + cx;
        let ch = 0;
        for (const c of churns) { const u = (x - c.x) / 75; if (u > -2.6 && u < 2.6) ch = Math.max(ch, Math.min(1, c.a * 2.2) * Math.exp(-u * u)); }      // the strongest one counts (summed, many churns made a flat slab with hard ends)
        if (ch > .01) mudCh.push([sx, Math.pow(ch, 1.4)]);
      }
      ctx.globalAlpha = 1;
    }
    // over the plain the near ground is land, not water: it ends in a soft edge where the bog begins
    if (wx0 > 0) { const g = ctx.createLinearGradient(wx0 - 10, 0, wx0 + 140 * z, 0); g.addColorStop(0, css(land)); g.addColorStop(1, css(land, 0)); ctx.fillStyle = g; ctx.fillRect(0, wl - 1, Math.min(VW, wx0 + 140 * z), VH - wl + 1); }
    // WET SHADOWS AND SHORE MIST (build 257, owner: "all grey underneath them - maybe we should put in some shadows ... the
    // dark shore on two sides is too thin and high contrast - maybe make it reflect or shadow down and maybe some mist to
    // blend in"). Under everyone standing in the mud, and under the home bank (which stands on mud, so has no mirror), wet
    // mud gives back a dull dark smear of what stands on it: the figure's (or the bank's) own outline turned down, squashed
    // and blurred (drawn small and stretched), dark at the surface and gone a short way down. Not a mirror (no detail, no
    // light), not a disc (it has the body's own lumpy shape). Then a thin low mist lies along both shores at the water line,
    // so the black banks melt into the slough instead of sitting on it as hard slivers.
    // build 317 (owner: "the shadow now looks kinda pixelized"): at a sixth of the size the squashed figure was only a few rows
    // tall and its edge stepped when stretched back up; now soft across (KX) but four times the rows down (KY)
    // build 319 (owner: "still looks pixelated because of how it acts with the strips of mud"): its own edges (the squashed
    // outline) lined up with the thin strips of mud and pools and read as steps; now it is blurred smoothly in stages (down to a
    // quarter and back up through a half, each step bilinear) into one soft darkening with no edges, and laid a little fainter
    { const KX = 3, KY = 1.5, W = Math.ceil(VW / KX) + 2, H = Math.ceil((VH - wl) / KY) + 2;
      if (!shC || shC.width !== W || shC.height !== H) shC = mk(W, H);
      const s = shC.getContext('2d'); s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-over'; s.globalAlpha = 1; s.clearRect(0, 0, W, H);
      s.setTransform(z / KX, 0, 0, z / KY, (VW / 2 - cx * z) / KX, 0);
      const hx1 = Math.min(x1, HOME0 + 60);
      if (hx1 > x0) { s.save(); s.scale(1, -1.5); s.fillStyle = '#000'; s.beginPath(); s.moveTo(x0, 0); for (let x = x0; x <= hx1; x += 4 / z) s.lineTo(x, bankY(x) < -2 ? bankY(x) - hum(x) : 0); s.lineTo(hx1, 0); s.fill(); s.restore(); }
      for (const r of SH0) { if (r.x < WATER_L - 40) continue; const r0 = r.meta.ground - r.y / CHR_K;
        s.save(); s.globalAlpha = r.a; s.translate(r.x, 0); s.scale(r.face * CHR_K, -CHR_K * .42); s.drawImage(r.im, -r.meta.ax, -r0); s.restore(); }
      s.setTransform(1, 0, 0, 1, 0, 0); s.globalAlpha = 1;
      s.globalCompositeOperation = 'source-in'; s.fillStyle = css(tone(.1)); s.fillRect(0, 0, W, H);
      s.globalCompositeOperation = 'destination-in'; { const g = s.createLinearGradient(0, 0, 0, 58 * z / KY); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.35, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); s.fillStyle = g; s.fillRect(0, 0, W, H); }
      s.globalCompositeOperation = 'source-over';
      const w2 = Math.ceil(W / 2), h2 = Math.ceil(H / 2), w4 = Math.ceil(W / 4), h4 = Math.ceil(H / 4);
      if (!SHB || SHB[0].width !== w2 || SHB[0].height !== h2) SHB = [mk(w2, h2), mk(w4, h4), mk(w2, h2)];
      const [b2, b4, u2] = SHB, c2 = b2.getContext('2d'), c4 = b4.getContext('2d'), cu = u2.getContext('2d');
      for (const c of [c2, c4, cu]) { c.imageSmoothingEnabled = true; c.globalCompositeOperation = 'copy'; }
      c2.drawImage(shC, 0, 0, w2, h2); c4.drawImage(b2, 0, 0, w4, h4); cu.drawImage(b4, 0, 0, w2, h2);
      ctx.imageSmoothingEnabled = true; ctx.globalAlpha = .5; ctx.drawImage(u2, 0, 0, w2, h2, 0, wl, w2 * 2 * KX, h2 * 2 * KY); ctx.globalAlpha = 1;
      // the mist along the shores: one long flat layer lying on the water line, thickest over the bank's foot, thinning
      // upward over the land and quickly downward over the mud; it fades in and out along the shore (no round puffs: they
      // read as pale discs)
      const MH = Math.ceil(44 * z), M = ctx.createLinearGradient(0, wl - 30 * z, 0, wl + 14 * z), ma = .34 + .22 * look.mist, mc0 = tone(.9);
      M.addColorStop(0, css(mc0, 0)); M.addColorStop(.45, css(mc0, ma * .55)); M.addColorStop(.7, css(mc0, ma)); M.addColorStop(.82, css(mc0, ma * .5)); M.addColorStop(1, css(mc0, 0));
      if (!mistC || mistC.width !== Math.ceil(VW) || mistC.height !== MH) mistC = mk(Math.ceil(VW), MH);
      const m = mistC.getContext('2d'); m.setTransform(1, 0, 0, 1, 0, -(wl - 30 * z)); m.globalCompositeOperation = 'source-over'; m.clearRect(0, wl - 30 * z, VW, MH);
      m.fillStyle = M; m.fillRect(0, wl - 30 * z, VW, MH);
      m.setTransform(1, 0, 0, 1, 0, 0); m.globalCompositeOperation = 'destination-in';
      { const hx = X(HOME0 + 50), bx = X(BANK0 - 4), g = m.createLinearGradient(0, 0, VW, 0), st = (sx, a) => { const u = sx / VW; if (u > 0 && u < 1) g.addColorStop(u, 'rgba(0,0,0,' + a + ')'); };
        const f = sx => Math.max(1 - smooth(hx - 90 * z, hx + 30 * z, sx), smooth(bx - 30 * z, bx + 120 * z, sx));
        g.addColorStop(0, 'rgba(0,0,0,' + f(0) + ')'); for (let k = 1; k < 24; k++) st(k * VW / 24, f(k * VW / 24)); g.addColorStop(1, 'rgba(0,0,0,' + f(VW) + ')');
        m.fillStyle = g; m.fillRect(0, 0, VW, MH); }
      m.globalCompositeOperation = 'source-over';
      ctx.drawImage(mistC, 0, wl - 30 * z, VW, MH);
    }
    // --- THE MIRE, IN FRONT OF THE MIRROR (build 143): the churned mud, the far half of every ring, the figures in the mire,
    // then the mud surface that answers them (see "THE MUD ANSWERS THE FIGURES"), the strings, the drops, and the near
    // half of every ring ---
    // build 203 (owner: "the grey circles (shadows) below Christian and pliable don't look right"): the churned patch only a faint, shallow darkening at the surface
    if (mudGd) { ctx.fillStyle = mudGd; for (const [sx, a] of mudCh) { ctx.globalAlpha = a * .35; ctx.fillRect(sx, wl, 5, 16 * z); } ctx.globalAlpha = 1; }
    ripples(true);
    ctx.setTransform(S * z, 0, 0, S * z, S * (VW / 2 - cx * z), S * wl);
    // (3) THE FEARS (build 370; owner: "the shapes in the bog can look a little like monsters or live blobs - very subtle
    // but alive looking"): on "Many fears and doubts came over him" dark soft shapes heave up out of the mud round him,
    // each a slow cluster of lobes that swell and turn, now and then two dim eyes opening, and sink again. Drawn before
    // him, never between us and him; cut at the surface
    if (fearT2 >= 0 && (ph === 'wade' || ph === 'stuck')) { const A = smooth(0, 150, fearT2) * (1 - smooth(620, 900, fearT2)); if (A > .01) fears(A); }
    if (pliIn) { TALKM = talkMove(PL); pliMire(ctx); TALKM = null; }
    if (chrLate > 0) { MREC = 'C'; FIG_WET = { D: C2.D || 0, a: .8 }; TALKM = C2.reach > 0 ? null : talkMove(C); drawChr(ctx, fig, chrLate); TALKM = null; MREC = null; FIG_WET = null; }
    sense();
    { // (1), (2): the surface line, lifted by the field and by a collar hugging every crossing; seen near the bodies and
      // wherever the mud has been moved, and only where there is mud
      const runs = [];
      for (const o in RECS) { const r = RECS[o], S = MS[o] || {}, act = S.act || 0, b = S.sb || r.body;
        if (b) runs.push([b[0], b[1], 3.2 + 4.5 * act]);
        for (const u of S.armRuns || []) runs.push([u[0], u[1], (2.2 + 2 * act) * smooth(0, 8, u[2])]);
        for (const g of S.ghost || []) runs.push([g[0], g[1], (2.2 + 2 * act) * g[2]]); }
      const coll = x => { let c = 0, p = 0;
        for (const [a, b, C] of runs) { const d = x < a ? a - x : x > b ? x - b : 0;
          if (!d) { c = Math.max(c, C * (.62 + .38 * Math.exp(-(((Math.min(x - a, b - x)) / 5) ** 2)))); p = 1; }
          else { c = Math.max(c, C * Math.exp(-((d / 7) ** 2))); p = Math.max(p, Math.exp(-((d / 26) ** 2))); } }
        return [c, p]; };
      // drawn as ONE shape on its own canvas (bandC), then faded along its length by a one-row picture of how much it
      // shows at each place (profC): narrow strips side by side showed as a comb
      const MUDK = mix(tone(.1), fig, .3), xa = Math.max(HOME0 + 12, cx - VW / 2 / z - 10), xb = Math.min(BANK0 - 4, cx + VW / 2 / z + 10), st = 2;
      if (xb > xa) {
        const N = Math.ceil((xb - xa) / st) + 1, tops = new Float32Array(N), al = new Uint8ClampedArray(N * 4); let any = false;
        for (let k = 0; k < N; k++) { const x = xa + k * st, [c, p] = coll(x), h = fAt(x); tops[k] = -(h + c);
          const a = clamp(p * .95 + Math.abs(h) * .22) * Math.max(1 - .75 * wetAt(x), p * .9); al[k * 4 + 3] = 255 * a; if (a > .02) any = true; }
        if (any) {
          const BH = Math.ceil(80 * S); if (!bandC || bandC.width !== cv.width || bandC.height !== BH) bandC = mk(cv.width, BH);      // a strip round the surface only
          if (!profC || profC.width !== N) { profC = mk(N, 1); }
          profC.getContext('2d').putImageData(new ImageData(al, N, 1), 0, 0);
          const b = bandC.getContext('2d'); b.setTransform(1, 0, 0, 1, 0, 0); b.globalCompositeOperation = 'source-over'; b.clearRect(0, 0, bandC.width, bandC.height);
          b.setTransform(S * z, 0, 0, S * z, S * (VW / 2 - cx * z), S * 60);
          b.beginPath(); b.moveTo(xa, 3.5); for (let k = 0; k < N; k++) b.lineTo(xa + k * st, tops[k]); b.lineTo(xa + (N - 1) * st, 3.5); b.closePath();
          b.fillStyle = css(MUDK); b.fill();
          const g = b.createLinearGradient(0, 3, 0, 9); g.addColorStop(0, css(MUDK, .7)); g.addColorStop(1, css(MUDK, 0)); b.fillStyle = g; b.fillRect(xa, 3, xb - xa, 6);
          // a faint wet light along the top of the mud where it is heaped up
          b.beginPath(); for (let k = 0; k < N; k++) b.lineTo(xa + k * st, tops[k] + .4); b.lineWidth = .8; b.strokeStyle = css(LIGHT, .16); b.stroke();
          b.globalCompositeOperation = 'destination-in'; b.imageSmoothingEnabled = true; b.drawImage(profC, xa - st / 2, -60, N * st, 80); b.globalCompositeOperation = 'source-over';
          ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bandC, 0, Math.round((wl - 60) * S)); ctx.setTransform(S * z, 0, 0, S * z, S * (VW / 2 - cx * z), S * wl);
        }
      }
      // (4) strings of mud after a hand that has come out: followed in the picture itself, until they are too long
      for (const sg of strings) {
        const r = RECS[sg.o]; if (!r || !r.am || !r.am.A) { sg.dead = 1; continue; }
        const hd = handAt(r, sg.tx), age = G.t - sg.t0;
        if (hd === 'in') { sg.dead = 1; continue; }
        const L = hd ? Math.hypot(hd[0] - sg.x, hd[1]) : 99;
        if (!hd || L > 30 || age > 70) { for (const k of [.3, .6, .85]) drop(lerp(sg.x, sg.tx, k), Math.min(-1, lerp(0, sg.ty, k)), (Math.random() - .5) * .3, .1, 1 + Math.random() * .5); fPush(sg.x, -.5, 4); sg.dead = 1; continue; }
        sg.tx = hd[0]; sg.ty = hd[1];
      }
      strings = strings.filter(sg => !sg.dead);
      for (const sg of strings) {
        const L = Math.hypot(sg.tx - sg.x, sg.ty), th = 1 - smooth(16, 30, L), b0 = -(fAt(sg.x) + coll(sg.x)[0]) + .5, my = (b0 + sg.ty) / 2 + 1.5 + L * .1;
        ctx.strokeStyle = css(MUDK, .9); ctx.lineCap = 'round';
        let px = sg.x, py = b0;
        for (let i = 1; i <= 6; i++) { const t = i / 6, x = (1 - t) * (1 - t) * sg.x + 2 * t * (1 - t) * (sg.x + sg.tx) / 2 + t * t * sg.tx, y = (1 - t) * (1 - t) * b0 + 2 * t * (1 - t) * my + t * t * sg.ty;
          ctx.lineWidth = lerp(2.8, .6, t) * (.55 + .45 * th); ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke(); px = x; py = y; }
      }
    }
    ctx.strokeStyle = css(fig); ctx.lineCap = 'round';
    for (const d of drops) { ctx.globalAlpha = clamp(1.4 - d.t / 60); ctx.lineWidth = d.r; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - d.vx * .45, d.y - d.vy * .45); ctx.stroke(); } ctx.globalAlpha = 1;
    ctx.setTransform(S, 0, 0, S, 0, 0);
    ripples(false);      // the near half of every ripple, in front of the figures
    // the banks of mist (see "MIST THAT HIDES" in update)
    // bank(from, to, base, height, size of each puff, strength, how many, seed, flat): soft rounds of mist laid between
    // two places along the level, thicker low down; each drifts a little
    // the mist round Help: one soft dense veil just to the right of where he stands (Christian, stuck close by on the
    // left, stays clear of it), with a few slow puffs in it; it drifts right as it thins
    // build 114 (owner: "fog hiding help is too localized - would be nice if it spread more to the right and looked more
    // natural"): a long bank of mist lies along the far shore from where Help will stand far off to the right, highest
    // and thickest at his place and lower and thinner further right, with slow soft rounds drifting in it; it all drifts
    // right as it thins
    // build 118: the long ragged bank (fogBank), laid twice so it is dense enough to hide him, the second a little wider
    // and slower so the two slide over each other as it moves off to the right and thins
    // build 120 (owner: "there doesn't need to be nearly as much mist around tree now that help is walking in"): the bank
    // is turned round and moved off to the right: its thick end lies beyond the oak at the picture's right edge, where
    // Help comes from and goes back to, and it has thinned to nothing before the trunk. It no longer slides away: it thins.
    // build 260 (three critics: Help "reads as a ghost ... a pale grey figure laid over the black trunk"): the bank was laid
    // OVER him as he walked out of it, so he came in pale. Now while he walks in it lies only behind and right of him (cut
    // away softly from his back), so he steps out of the mist whole and dark, as the rule says (mist never between a
    // figure and us)
    if (fogH > .01) { const a = smooth(0, .45, fogH), by = Y(64);
      if (!fogC || fogC.width !== cv.width || fogC.height !== cv.height) fogC = mk(cv.width, cv.height);
      const f = fogC.getContext('2d'); f.setTransform(S, 0, 0, S, 0, 0); f.globalCompositeOperation = 'source-over'; f.globalAlpha = 1; f.clearRect(0, 0, VW, VH); f.imageSmoothingEnabled = true;
      f.save(); f.translate(X(HX + 1000), 0); f.scale(-1, 1);
      f.globalAlpha = a; f.drawImage(fogBank, 0, by - 470 * z, 800 * z, 470 * z);
      f.globalAlpha = a * .8; f.drawImage(fogBank, (-50 + Math.sin(G.t * .004) * 10) * z, by - 410 * z, 900 * z, 410 * z);
      f.restore(); f.globalAlpha = 1;
      const hx = help && !help.lv && help.w < HSEQ.length - 1 ? HX + HSEQ[Math.floor(help.w)][1] * CHR_K : help && !help.lv ? HX : null;
      if (hx != null) { const x0 = X(hx + 30), g = f.createLinearGradient(x0, 0, x0 + 120 * z, 0); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        f.globalCompositeOperation = 'destination-out'; f.fillStyle = g; f.fillRect(0, 0, x0 + 120 * z, VH); f.globalCompositeOperation = 'source-over'; }
      ctx.drawImage(fogC, 0, 0, VW, VH); }
    // THE MIST HE WALKS INTO, AND THE LIGHT THROUGH IT (build 124, owner: "make fog get more and more on the right (but make
    // light shining thru in cool way)"): as he goes on his way the mist ahead thickens, more and more toward the right
    // (it stands in the world, from 380 to 840 and solid beyond, so he walks into it and it hides him), and the far
    // light, ahead of him again, glows through it and throws long soft shafts down across the mist, slowly shifting
    if (ph === 'on') {
      const s1 = smooth(-150, 260, C2.x), xa = X(380), xb = X(840), fogCol = mix(tone(.93), GOLD, .22 * warmth);
      if (s1 > .01 && xa < VW) { const g = ctx.createLinearGradient(xa, 0, xb, 0); g.addColorStop(0, css(fogCol, 0)); g.addColorStop(.45, css(fogCol, .5 * s1)); g.addColorStop(1, css(fogCol, .97 * s1));
        ctx.fillStyle = g; ctx.fillRect(Math.max(0, xa), 0, VW, VH); }
      if (ahead > .02) {
        ctx.save(); ctx.globalCompositeOperation = 'screen';
        glow(ctx, discX, discY, 380, mix(LIGHT, GOLD, .5), .55 * ahead); glow(ctx, discX, discY, 120, LIGHT, .6 * ahead);
        for (let i = 0; i < 9; i++) {
          const a0 = (i < 7 ? 1.75 + i * .2 : .95 - (i - 7) * .3) + .05 * Math.sin(G.t * .004 + i * 1.7), hw = .028 + .022 * ((i * 7) % 3), len = 1000;
          const k = .21 * ahead * (.55 + .45 * Math.sin(G.t * .007 + i * 2.3)), g = ctx.createRadialGradient(discX, discY, 30, discX, discY, len);
          g.addColorStop(0, css(mix(LIGHT, GOLD, .45), k)); g.addColorStop(.5, css(mix(LIGHT, GOLD, .45), k * .45)); g.addColorStop(1, css(GOLD, 0));
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(discX, discY); ctx.lineTo(discX + Math.cos(a0 - hw) * len, discY + Math.sin(a0 - hw) * len); ctx.lineTo(discX + Math.cos(a0 + hw) * len, discY + Math.sin(a0 + hw) * len); ctx.fill();
        }
        ctx.restore();
      }
    }
    // the low mist over the middle of the bog, where the steps are: wide, flat and smooth
    // build 115 (owner: "fog clears to reveal them instead of them appearing out of nowhere"): the low mist over the
    // steps is laid step by step; over each step it moves off to the right and thins as that step's light lands (s.lit),
    // so the stones are uncovered in place, one by one, from the far bank back toward the plain. Straight across, flat
    // (an arc toward us was offered and advised against: it would bring back the perspective the picture avoids)
    if (ph === 'plain') threadsNow();
    // rings in the mud, under the mist. Build 126 put them back under the low mist after build 125's heavy rings on top of it
    // "stuck out"; build 127 thins that mist at the surface, so the dark churned mud and its rings are seen together
    // build 212: the veil starts to the right of Christian (with the closer camera of build 200 he stood inside it and was washed pale)
    if (look.veil > .01) { const v0 = Math.min(VW * .8, Math.max(VW * .42, X(C2.x) + 150 * z)), g = ctx.createLinearGradient(v0, 0, Math.max(VW, v0 + 300), 0); g.addColorStop(0, css(LIGHT, 0)); g.addColorStop(.55, css(tone(.93), look.veil * .86)); g.addColorStop(1, css(tone(.93), look.veil)); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); }
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
  // THOUGHTS, baked once, small (so they are soft when stretched), every edge fading into a vignette like a memory
  let THK = null;
  function thoughts() {
    if (THK) return THK;
    const vign = (c, cx, cy, r) => { const g = c.getContext('2d'); g.globalCompositeOperation = 'destination-in'; const v = g.createRadialGradient(cx, cy, 0, cx, cy, r);
      v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(.55, 'rgba(0,0,0,.85)'); v.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = v; g.fillRect(0, 0, c.width, c.height); };
    const R = rngS(70);
    // the city on its hill and the shining ones, pale gold on nothing
    const city = mk(240, 150), g = city.getContext('2d'), P = [255, 240, 206];
    glow(g, 120, 92, 95, [255, 226, 160], .55);
    g.fillStyle = css(P, .55); g.beginPath(); g.moveTo(20, 150); g.bezierCurveTo(60, 116, 90, 100, 120, 100); g.bezierCurveTo(150, 100, 182, 116, 222, 150); g.fill();
    g.fillStyle = css(P, .8);
    for (let x = 84; x < 158; x += 4 + R() * 5) { const hh = 8 + R() * 16 * (1 - Math.abs(x - 120) / 44), w = 3 + R() * 3; g.fillRect(x, 101 - hh, w, hh + 2);
      if (R() < .5) { g.beginPath(); g.moveTo(x - .5, 101 - hh); g.lineTo(x + w / 2, 101 - hh - 4 - R() * 6); g.lineTo(x + w + .5, 101 - hh); g.fill(); }
      else { g.beginPath(); g.arc(x + w / 2, 101 - hh, w / 2 + .4, Math.PI, 0); g.fill(); } }
    g.fillRect(117, 64, 6, 38); g.beginPath(); g.moveTo(116, 64); g.lineTo(120, 44); g.lineTo(124, 64); g.fill();
    // (the shining ones round the city were taken out in build 372, owner: "light figures please remove")
    vign(city, 120, 92, 118);
    // home: his cottage far off in the mist, its door lit, his wife's dark shape in it
    const soft = (c, r) => { const m = mk(c.width, c.height), q = m.getContext('2d'); for (let i = 0; i < 16; i++) { const a = i * 2.4, d = r * Math.sqrt((i + .5) / 16); q.globalAlpha = 1 / (i + 1); q.drawImage(c, Math.cos(a) * d, Math.sin(a) * d); } return m; };      // a thought has no hard edges: kept small, so it is soft when stretched
    return THK = { city: soft(city, 2.4) };
  }
  // the fears: live dark shapes in the fog round him, in world units at the surface (see (3) in draw)
  const FEARS_AT = [[-300, 1.1, 0], [-170, .8, 1.7], [190, 1, 3.1], [330, .75, 4.4], [-460, .9, 5.6]];
  // (build 371, owner: "the shapes need to rise up as bulges from bog"): each fear is the mud itself swelling up, a dome
  // that heaves slowly out of the surface, its outline lumpy and moving like something breathing under it, lit a little on
  // top, now and then two dim eyes opening; then it sinks back. Mud-toned, faint, cut at the surface.
  function fears(A) {
    const MUDT = tone(.3), TOP = tone(.46);
    for (const [dx, k, ph0] of FEARS_AT) {
      const t = G.t / 60 + ph0, rise = smooth(.15, 1, .5 + .5 * Math.sin(t * .42 + ph0)) * A, x0 = C2.x + dx + 10 * Math.sin(t * .2), w = 46 * k;
      if (rise < .03) continue;
      const h = w * (.2 + .75 * rise), N = 32;
      const edge = (u, grow) => { const a = Math.PI * u, bump = 1 + .1 * Math.sin(u * 9 + t * 1.3 + ph0) + .06 * Math.sin(u * 17 - t * 2.1);
        return [x0 - Math.cos(a) * w * 1.5 * (1 + .1 * Math.sin(t * .8 + u * 3)) * grow, -Math.pow(Math.sin(a), 1.7) * h * bump * grow]; };      // a mound: low spreading flanks, a rounded crown
      // three passes, each a little larger and fainter, so its edge is soft, as mud seen through mist
      for (const [grow, al] of [[1.1, .14], [1.075, .2], [1.05, .28], [1.025, .38], [1, 1]]) {
        ctx.beginPath(); ctx.moveTo(x0 - w * 1.9 * grow, 2); for (let i = 0; i <= N; i++) { const [x, y] = edge(i / N, grow); ctx.lineTo(x, y); } ctx.lineTo(x0 + w * 1.9 * grow, 2); ctx.closePath();
        const g = ctx.createLinearGradient(0, -h, 0, 2); g.addColorStop(0, css(TOP, .38 * rise * al)); g.addColorStop(.5, css(MUDT, .45 * rise * al)); g.addColorStop(1, css(MUDT, .55 * rise * al));
        ctx.fillStyle = g; ctx.fill(); }
      // a wet sheen along its crown, so it reads as mud that has risen, not a shadow
      ctx.strokeStyle = css(tone(.62), .14 * rise); ctx.lineWidth = 1.2; ctx.beginPath();
      for (let i = 9; i <= N - 9; i++) { const [x, y] = edge(i / N, 1); i === 9 ? ctx.moveTo(x, y + 1.5) : ctx.lineTo(x, y + 1.5); }
      ctx.stroke();
      // now and then two dim eyes open near its top, look, and close
      const blink = Math.sin(t * .37 + ph0 * 2); if (blink > .55 && rise > .5) { const e = smooth(.55, .75, blink) * (1 - smooth(.9, 1, blink)) * rise, ex = x0 + (dx < 0 ? 6 : -6) * k, ey = -h * .62;
        ctx.fillStyle = css([230, 220, 194], .42 * e); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(ex + sd * 6 * k, ey, 2.2 * k, 1.3 * k * e + .2, 0, 0, 7); ctx.fill(); } }
    }
  }

  function glow(c, x, y, r, col, a) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, css(col, a)); g.addColorStop(.35, css(col, a * .45)); g.addColorStop(1, css(col, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function mote(c, x, y, r, a) { glow(c, x, y, r * 7, GOLD, a * .6); c.fillStyle = css(mix(GOLD, LIGHT, .5), a); c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  // Christian: walking (cut at the water line while he is in it), reaching up to Help, or standing on sound ground
  function drawChr(n, fig, alpha) {
    if (alpha <= 0) return;
    if (C2.tv && TURN.length) {      // his real turn; in the mire it comes in and goes out over his floundering
      const u = C2.tv.t / (TURN.length - 1), ta = C2.y > 2 ? smooth(0, .2, u) * (1 - smooth(.8, 1, u)) : 1;
      // build 121 (owner: "turning looks clunky"): the turn has only four pictures a second, so each one now melts into the next
      const tf = clamp(C2.tv.t, 0, TURN.length - 1), f0 = Math.floor(tf), ka = alpha * C2.alpha * smooth(0, .5, ta);
      figure(n, 'turn', TURN[f0], TURN_META, C2.x, C2.y, 1, fig, C2.y > 2, ka);
      if (f0 + 1 < TURN.length && tf - f0 > .02) figure(n, 'turn2', TURN[f0 + 1], TURN_META, C2.x, C2.y, 1, fig, C2.y > 2, ka * (tf - f0));
      if (ta >= 1) return; alpha *= 1 - smooth(.5, 1, ta);
    }
    let blendIm = null, blendK = 0;
    const inWater = C2.y > 2 && ph !== 'look' && ph !== 'onway' && ph !== 'on' && ph !== 'drawn';
    let walkIm = CHR[((Math.floor(C2.anim) % CHR.length) + CHR.length) % CHR.length], walkM = CHR_META;
    // in the mire he heaves and struggles (one video loop) instead of walking
    // build 141: his floundering picture ends at the waist, so it only comes in once he has sunk nearly that far (it came
    // in by the clock, while he was still knee-deep, and blank paper showed under him)
    // build 180: the struggling picture comes in quickly (about a sixth of a second) once he is in to the hips, under the
    // splash, instead of a long double picture while he sank from 44 to 57
    const wk = ph === 'fall' ? smooth(36, 46, C2.fallT) : smooth(36, 40, C2.y); let wa = 1;      // build 119: he flounders from the fall on
    if (WADE.length && inWater && wk > 0 && ['fall', 'pli', 'back', 'backtalk', 'wade', 'stuck', 'help'].includes(ph)) {
      if (wk < 1) figure(n, 'chr0', walkIm, CHR_META, C2.x, C2.y, C2.face, fig, true, alpha * C2.alpha * (1 - smooth(.5, 1, wk)));
      const wf = C2.wa || 0; walkIm = WADE[Math.floor(wf) % WADE.length]; walkM = META.wade;
      // build 214: heaving on the spot (the fall, Pliable's quarrel, going back, stuck at the far bank) is the stuck video;
      // only the wading forward is the wading video
      if (STUCKP.ready && ph !== 'wade') { const q = wf < 6 ? wf : 6 + 52 * (1 - Math.cos(Math.PI * (((wf - 6) / 52) % 2))) / 2; walkIm = STUCKP[Math.min(58, Math.floor(q))]; walkM = META.stuck; C2.q = Math.min(58, q); } wa = smooth(0, .5, wk); FIG_DIP = 46; blendIm = WADE[(Math.floor(wf) + 1) % WADE.length]; blendK = 0; }      // build 212: no melting (see Pliable's climb)
    // build 260: THE REACH IS ONE PLAY OF THE STUCK VIDEO. It used to cross-fade from his heaving picture to the reach
    // (two poses half see-through for a moment) and then end higher than the lift began, so he dropped at the grip. Now,
    // once he sees Help coming (C2.rt), the stuck video simply plays on from the picture he is in (C2.rq0) to its own
    // high-arm frame REACH_F, slower than or at its own speed, at the far bank's depth, drifting a step toward Help; then it
    // holds there breathing. REACH_F at REACH_X is where the lift's first picture has him, hand in Help's hand.
    if (ph === 'help' && STUCKP.ready && (C2.rt || 0) > 0) {
      if (C2.rq0 == null) C2.rq0 = C2.q || 6;
      const r = smooth(0, 150, C2.rt), e = r * r * (3 - 2 * r), f = r < 1 ? lerp(C2.rq0, REACH_F, e) : REACH_F + 1.6 * Math.sin(G.t / 45);
      FIG_DIP = 46; figure(n, 'reach', STUCKP[Math.round(f)], META.stuck, lerp(C2.x, REACH_X, e), 64 + (C2.md ?? MD_FAR), 1, fig, true, alpha); FIG_DIP = 0;
      return;
    }
    if (ph === 'help' && !STUCKP.ready && C2.reach > 0) {
      const gx = HX + GRASP.dx * CHR_K, gy = STUCK_Y() + (C2.y - STUCK_Y()) * (1 - smooth(20, 140, C2.rt || 0));      // the old reaching picture, only until the stuck video loads
      if (C2.reach < 1) figure(n, 'chr', walkIm, walkM, C2.x, C2.y, 1, fig, true, alpha * (1 - C2.reach)); FIG_DIP = 0;
      figure(n, 'reach', REACH[at(REACH_SRC, C2.rt || 0)], META.reach, gx, gy, 1, fig, true, alpha * C2.reach);
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
    // build 180: the struggling picture is never shown higher than its own mud line (58: five units of filled body, hidden by the
    // collar); while he is still shallower than that it stands a little deeper than his walking picture, under the splash
    const wy = walkM === META.wade || walkM === META.stuck ? 64 + (C2.md ?? MD_IN) : C2.y;      // build 214: the new videos carry their own depth (waist-deep wading, chest-deep stuck): their mud line lies on the surface
    figure(n, 'chr', walkIm, walkM, C2.x, wy, C2.face, fig, inWater, alpha * C2.alpha * wa);
    if (blendIm && blendK > .03) figure(n, 'chrB', blendIm, walkM, C2.x, wy, C2.face, fig, inWater, alpha * C2.alpha * wa * blendK);      // the next picture melts in over this one
    FIG_DIP = 0;
  }

  // for testing: SL.peek() tells where the story is
  // grow, ribbons: the tree grower and its painter, for Level 3's oak in leaf (hill.js, bakeOak): keep these exports
  // oakPic: the great oak baked small in one colour, for Level 1's far glimpse of the Slough (index.html, drawFarSlough)
  return { on: false, show: false, title, start, update, draw, touch, grip, pick, preload, lines: ALL, oakPic: (col, k) => bakeTree(oak(18), col, k), grow: (seed, hero, depth) => oak(seed, hero, depth), ribbons, peek: () => ({ ph, thk: { cityT, fearT2 }, x: C2.x, y: C2.y, mv: mv && mv.t, lift: lift && lift.t, pli: pli && pli.mode, plx: pli && Math.round(pli.x), plStop: !!(pli && pli.stop), cam, mud: { strings: strings.length, hmax: Math.max(...fh), hmin: Math.min(...fh), drops: drops.length, rings: rings.length, recs: Object.fromEntries(Object.entries(RECS).map(([o, r]) => [o, { body: r.body, arms: (r.arms || []).length, act: MS[o] ? MS[o].act : 0, y: r.y, a: r.a }])) }, c2: { wa: C2.wa, D: C2.D, rt: C2.rt, reach: C2.reach, fallT: C2.fallT }, pl: pli && { y: pli.y, ct: pli.ct, wk: pli.wk, wal: pli.wal, fa: pli.fa, wt: pli.wt, x: pli.x, duck: pli.duck, mode: pli.mode, out: pli.out } }) };
})();
