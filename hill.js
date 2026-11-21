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
  const WW = 'Mr. Worldly Wiseman', GW = 'Good-will';
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
  const START = 220, MEET = 900, GATE_X = 9000, GATE_FROM = GATE_X - 480, GATE_STOP = GATE_X - 74;
  // INTO THE ROCKS (owner, build 185: "i don't like that hill looks initially - it looks fake ... after he decides to go
  // off path, pilgrim goes away from viewer and down the hill descending so his body disappear ... then scene shift to
  // him walking a mountain path rocky ... then when he reaches foot of mountain and narrator speaks we zoom out super
  // wide ... then back to zoomed in where evangelist meets him"; and "we need a surrounding of rockiness, not just
  // ground then big rock"). The hill is not seen at all until Wiseman points: the camera pans right across the plain
  // to it, far off (HILL_F, HSF). He turns aside, walks over a brow and down out of sight behind it (BROW0 to BROW1);
  // the picture goes dark and finds him on a stony path among crags (PATH0 to FOOT) that rise higher on every layer as
  // he goes; at the foot the camera pulls back to the whole mountain (HSN times the far hill's units: its foot's
  // left end at HX0), lightning at the widest, and comes back down to him for Evangelist.
  const BROW0 = MEET + 420, BROW1 = BROW0 + 300, PATH0 = 3330, FOOT = 4400, STILL = FOOT, HX0 = FOOT + 150;
  const PH = .3, HSF = .72, HILL_F = 4700, HILL_Y = -60, HSN = 8, VIL_W = 2400;      // the far hill: how much it slides with the camera, its place, its size; the mountain close to: its size
  const Z_NEAR = .8, Z_WIDE = .068;
  // the brow: the ground swells a little (crest, in road units) to CREST and falls away beyond it, out of sight
  const CREST = BROW0 + 70, crest = x => 52 * smooth(BROW0 - 330, CREST, x) * (1 - smooth(CREST + 30, CREST + 560, x));
  // build 282 (owner: "path should curve over crest of bump and disappear (same as christian's walk)"): how far below the
  // brow's top line the worn track (and his feet) run: 12 on the road, rising to 2 at the top, where both go over and out of sight
  const pathOff = x => 12 - 10 * smooth(CREST - 260, CREST, x);
  const EV_X = FOOT - 135;

  // ---------- the words: Bunyan's, shortened and made plain ----------
  // LESS WAITING, LEVEL 3 (owner, after build 364, chosen line by line in level3-cuts.html: "everything else as proposed",
  // keeping "So Christian turned out of his way"): 31 lines became 16, about 3 minutes of speech about 1 1/2. What the
  // words used to say is shown instead: the trickle of stones at the foot, Evangelist's hand (the child touches it to
  // raise him), the fire sinking, his farewell, stones falling behind him and the far light coming back, a glint on the
  // sign. The storyteller no longer names Wiseman (Evangelist names him later).
  const SEEN = [];      // {37}
  // build 175 (owner: say lines while walking): the greeting is said as the two come toward each other (GREET, captions
  // while he walks); the talk at the crossing begins with "Who sent you this way?"
  const GREET = [      // {38}
    [WW, 'How now, good fellow! Where are you going, with such a burden?'],
    [C, 'To that little gate ahead. I cannot get this burden off myself.'],      // vision chat: {39} "get it off myself, I cannot"
  ];
  const WISE = [      // {39} to {45}
    // THE WORLD ACTS OUT WHAT HE SAYS (owner, build 177: "the conversation with worldly wise lacks punch or interest
    // (kinda drags)"): a sweet, slightly too-sweet tune under his voice; the burden groans when he speaks of the
    // dangerous way; when he names the village, it glows warm on the plain far off and the camera drifts toward it
    // (`vil`), before the hill itself is shown
    [WW, 'There is no more dangerous way in all the world!', 0, () => { sweet(0); groan(); note(43, .045, 3.5); }],
    [WW, 'In that village, Morality, lives a gentleman named Legality. He can take burdens like yours away.', 0, () => { vilTo = 1; sweet(1); }],
    [WW, 'Do you see that hill? Go by it. The first house you come to is his.', 'hill', () => { panTo = 1; }],
  ];
  const TURNED = [[N, 'So Christian turned out of his way, to go to Mr. Legality\'s house for help.']];      // {46}
  const HIGH = [[N, 'The hill hung so far over the way that Christian was afraid it would fall on his head.']];      // {47}
  const STOOD = [];
  const COMING = [];
  const EVANW = [      // {48} to {59}
    [E, 'What are you doing here, Christian? You are out of the way.'],
    [C, 'Just after the Slough, I met a gentleman. He said a man in that village could take my burden off.'],
    // he falls at Evangelist's feet as he cries out (the kneel shows "fell down at his feet")
    [C, 'Woe is me, for I am undone!', 0, () => { C3.weep = true; C3.wt = 0; }],
    // "Evangelist caught him by the right hand": he reaches out his hand (the reach of his Level 1 pointing), and the
    // child touches it (an echo of Help's hand in the Slough); the warm light of mercy gathers on them (`EHAND`)
    [TIP, 'Touch Evangelist\'s hand.', 'ehand', () => { evan.gTo = 1; }],
    [E, 'All manner of sin shall be forgiven unto men. Be not faithless, but believing.'],
    // he revives and stands (the kneel played backward) as Evangelist speaks on
    [E, 'That man was Worldly Wiseman. No man was ever rid of his burden by Mr. Legality.', 0, () => { C3.weep = false; evan.gTo = 0; }],
    [C, 'Sir, is there hope? May I go back to the gate?'],      // {59}
    [E, 'Your sin is very great. Yet the man at the gate will receive you, for he has goodwill for men.', 0, () => { calmTo = 1; }],
    // "gave him one smile, and bid him God-speed": he lifts his hand a little as he says it; the light lingers where he stands
    [E, 'God-speed.', 0, () => { evan.gTo = .7; evan.bye = 1; }],
  ];
  const HASTE = [];      // {59}: shown (he runs, stones fall behind him, the far light comes back)
  const ATGATE = [];      // the sign over the gate glints; a touch opens it close up
  const KNOCK = [      // {60}
    [C, 'Knock, and it shall be opened unto you.'],      // vision chat: he reads the stone over the gate ({59}; on the owner's keep list)
    [TIP, 'Knock on the gate.', 'knock'],
    [C, 'May I come in? Will he open to me, sorry as I am?'],
    [N, 'At last there came a grave person to the gate, named Good-will.', 0, () => { doorTo = 1; sfx.chord(); }],
    // vision chat (owner: "isn't there arrows shot at him when he enters gate"; {62}): Good-will reaches out, the child
    // takes his hand, and he pulls Christian in as arrows from Beelzebub's castle hiss over the wall and fall short
    [TIP, 'Take Good-will\'s hand.', 'pull', () => { gwReachTo = 1; }],
    [C, 'What does that mean?'],
    [GW, 'A little way from this gate stands a strong castle. Beelzebub is its captain. From it they shoot arrows at those who come up to this gate.'],
    [C, 'I rejoice, and tremble.'],
    // vision chat: Good-will's promise ({68}), the set-up the Cross keeps, said in the doorway until Level 4's gate scene is built
    [GW, 'Bear your burden a little longer. At the place of deliverance, it will fall from your back of itself.'],
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
  const EVW = [], EVW_META = { ax: 210, ground: 476, frames: 39, vpx: 5.0, rest: [0, 20] }, EVW_V = EVW_META.vpx * CHR_K * .4, EV_FROM = 400;
  const wFig = () => WIS.ready ? { W: WIS, M: WIS_META, S: WIS_ST, SM: WIS_ST_META } : { W: OBS, M: OBS_META, S: OBS_ST, SM: OBS_ST_META };
  const WIS_V = WIS_META.vpx * CHR_K * .4;      // his video's own pace: 24 pictures a second, 60 ticks a second

  // ---------- state ----------
  let ph = 'plain', built = false, loading = null;
  const cam = { cx: 0, z: 1, wl: 440 };
  const C3 = { x: 0, face: 1, faceA: 1, anim: 12, sd: null, alpha: 1, run: 0, ranim: 0, weep: false, wt: 0, wa: 0, kf: 0, kp: 0, tv: null };
  // MERCY, AFTER REMBRANDT (build 159; agreed master for this moment: one warm light in a great dark). When Evangelist
  // takes him by the right hand a small warm light gathers on the two men and lies in a flat pool at their feet
  // (`mercy`), the only warm thing under the black hill; when he says the man at the gate will receive him, the
  // hill's fire sinks low and its flashes stop (`calm`). Both are ours, not the book's.
  let mercy = 0, mercyTo = 0, calm = 0, calmTo = 0;
  // THE HILL IS NOT SHOWN AT FIRST (owner, build 167: "Maybe don't show mountain at first, just some foothills, the reveal
  // will be cooler later"). `reveal` stays 0 across the plain and the talk: only foothills stand where it will be. At
  // "Do you see that hill?" the camera draws back and the hill comes out of the haze (about a second and a half).
  let reveal = 0, vil = 0, vilTo = 0;
  // (build 321; owner: "when he first mentions house can he just reference it ... then only zoom over when he mentions
  // mountain"): naming the village only warms its windows far off (`vil`); the camera stays on the two men and shifts
  // right to the village and the hill only at "Do you see that hill?" (`pan`)
  let pan = 0, panTo = 0;
  // stones and dust falling from the overhang when he stands beneath it (in the hill's own units, from its foot's
  // left end; y up is negative): each { x, y, vx, vy, r, t, dust }
  const ROCKS = [], DUST = [];
  // BOULDERS FALL IN THE BACKGROUND (owner, build 202: "more lightning please and boulders falling in background"): from high
  // on the mountain's body, right of the path (so they never land on him), a rough stone tumbles down its face with a thin
  // trail of dust and lands in a cloud of it; more at each flash. The dust is soft drifting clouds (`DUST`, a baked blob,
  // `DUSTC`), not flat ovals (owner, same build: "the dust puffs when christian is near mt look too geometric and not
  // realistic"); the stones are rough many-sided shapes, not rectangles.
  const rockShape = () => { const p = []; for (let i = 0; i < 7; i++) p.push(.65 + Math.random() * .45); return p; };
  function boulder() { if (!ROCKA) return; const x = 120 + Math.random() * 560, u = Math.round((x + HOX) / 5); let top = 0; for (let v = 0; v < HH / 5; v++) if (ROCKA[v * HW / 5 + u] > 200) { top = v * 5 - HOY; break; }
    if (top >= -40) return; ROCKS.push({ x, y: top * (.25 + .5 * Math.random()), vx: (Math.random() - .6) * .25, vy: 0, r: Math.random() < .2 ? 16 + Math.random() * 9 : 6 + Math.random() * 9, t: 0, s: Math.random() * 6, big: 1, sh: rockShape() }); }
  function dust(x, y, r, n, a = 1, big = 0) { for (let i = 0; i < n; i++) DUST.push({ big, x: x + (Math.random() - .5) * r * 2, y: y - Math.random() * r * .6, vx: (Math.random() - .5) * .25 * r / 4, vy: -.04 - Math.random() * .12, r: r * (.5 + Math.random() * .5), g: .03 + .02 * r / 4, t: 0, life: 120 + Math.random() * 120, a: a * (.5 + Math.random() * .5) }); }
  let DUSTC = null;
  // STONES ON THE WAY TO THE FOOT (owner, build 325: "a couple small rocks then later a couple some medium boulder fall as he
  // walks from left to right at base of mountain (to make walk interesting) maybe even a shake or two"). At fixed places
  // on the path, as he first passes them, stones come down off the heights ahead of him and land on the rocks just behind
  // the path, never on him: first two small ones, then one, then two medium boulders, each with a jolt of the ground
  // (`jolt`, added to the trembling in draw()). In world units (`PATHR`), drawn behind the figures.
  const PATHR = [], FALLS = [[3470, 2, 0], [3680, 1, 0], [3930, 1, 1], [4170, 1, 1.3]];
  let fallI = 0, jolt = 0, backFallT = 0;
  // (build 354, owner: "the rocks need to land and not float"): a stone comes to rest ON the ground under it: the top of the
  // path's broken stony far edge at that place (the same outline `road()` draws among the rocks), sunk in a little, never
  // at a fixed height in the air
  const edgeAt = x => smooth(PATH0 - 900, PATH0 - 300, x) * (1 - smooth(FOOT + 250, FOOT + 800, x)) * Math.max(0, 70 * (nz(x * .006, 3.1) - .44) + 22 * (nz(x * .03, 7.7) - .42) + 5 * (nz(x * .14, 1.3) - .5));
  const groundAt = (x, r) => { let h = 0; for (let d = -r; d <= r; d += Math.max(1, r / 3)) h = Math.max(h, edgeAt(x + d)); return -h + r * .2; };
  function pathFalls() { while (fallI < FALLS.length && ph === 'path' && C3.x > FALLS[fallI][0]) { const [, n, big] = FALLS[fallI++];
      for (let i = 0; i < n; i++) { const r = big ? 11 + 4 * big + Math.random() * 3 : 3 + Math.random() * 2.5;
        PATHR.push({ x: C3.x + 230 + Math.random() * 120 + i * 60, y: -560 - Math.random() * 120 - i * 90, vx: -(.5 + Math.random() * .6), vy: 0, r, big, b: 0, t: 0, s: Math.random() * 6, sh: rockShape() }); } }
    for (const r of PATHR) { r.t++; r.vy += .26; r.x += r.vx; r.y += r.vy;
      // (build 356, owner: "Can you make stones disappear behind blue layer"): a stone strikes the top of the path's stony far
      // edge (dust, a thud, the jolt) and then drops on behind it out of sight (the stones are drawn before the path, so the
      // blue-black path covers them); gone once wholly below the edge
      const rest = groundAt(r.x, r.r) - r.r * .2;
      if (!r.b && r.y >= rest) { r.b = 1; dustW(r.x, rest, r.big ? r.r * 2.6 : r.r * 2.2, r.big ? 7 : 3);
        if (r.big) { jolt = Math.max(jolt, r.big); if (audio()) { sweep(50, 30, 1.2, .1 * r.big); hiss(180, .7, .07 * r.big, 1.1, 'lowpass'); } }
        else if (audio()) hiss(900, 2, .03, .12, 'bandpass');
        r.vx *= .4; r.vy *= .5; }
      if (r.b && r.y > rest + r.r * 4) r.gone = 1; }
    for (let i = PATHR.length - 1; i >= 0; i--) if (PATHR[i].gone) PATHR.splice(i, 1);
    jolt *= .93; }
  // dust in world units, for the stones on the path
  const DUSTW = [];
  function dustW(x, y, r, n) { for (let i = 0; i < n; i++) DUSTW.push({ x: x + (Math.random() - .5) * r * 2, y: y - Math.random() * r * .5, vx: (Math.random() - .5) * .3, vy: -.05 - Math.random() * .15, r: r * (.6 + Math.random() * .6), t: 0, life: 110 + Math.random() * 110, a: .5 + Math.random() * .4 }); }
  // EASTER EGGS (owner, after build 366: "need new easter eggs and things to show (like dodging rocks or something ;)";
  // chose 1, 3, 4 and 7 of the ideas offered). Nothing here can be failed or missed for good; each is free to find.
  // (1) A STONE THAT MISSES HIM: twice on the rocky path a stone tumbles down off the heights onto the way AHEAD of him,
  // aimed where he will be a moment later plus a step: if the child keeps holding it crashes down just in front of him
  // and bounces off the near edge of the path toward us (a near miss); if they let go, it lands further ahead. Never on him.
  const ROLLX = [3580, 4050], ROLL = [];
  let rollI = 0;
  function rollers() {
    while (rollI < ROLLX.length && ph === 'path' && C3.x > ROLLX[rollI]) { rollI++;
      const T = 64, g = .22, v = Math.max(0, C3.lastV || 0), land = C3.x + v * T + 58 + Math.random() * 14;
      ROLL.push({ x: land + .9 * T, y: -.5 * g * T * T, vx: -.9, vy: 0, g, r: 10 + Math.random() * 4, b: 0, t: 0, s: Math.random() * 6, sh: rockShape() });
      if (audio()) hiss(420, .9, .04, 1.1, 'bandpass'); }
    for (const r of ROLL) { r.t++; r.vy += r.g; r.x += r.vx; r.y += r.vy;
      // it strikes the way once, hard (dust, a thud, the ground jolts), bounces high and drops off the path's near edge
      if (!r.b && r.y >= -r.r * .6) { r.b = 1; r.y = -r.r * .6; r.vy = -6.2; r.vx = -.3; dustW(r.x, 0, r.r * 2.6, 8); jolt = Math.max(jolt, 1.1);
        if (audio()) { sweep(48, 30, 1.1, .12); hiss(200, .7, .08, 1, 'lowpass'); hiss(1400, 2, .03, .15, 'bandpass'); } } }
    for (let i = ROLL.length - 1; i >= 0; i--) if (ROLL[i].y > 420) ROLL.splice(i, 1); }
  // (3) A LIZARD on the rocks: two along the path, on the top of its stony far edge, lit a little by the fire; one sits
  // still, bobbing its head now and then, until he comes near or the child touches it, then darts away along the edge
  // and is gone into a crack
  const LIZ = [];
  function lizards() {
    if (!LIZ.length && ph === 'path') for (const x0 of [PATH0 + 330, PATH0 + 790]) { let bx = x0, bh = -1; for (let x = x0 - 80; x <= x0 + 80; x += 4) { const h = edgeAt(x); if (h > bh) { bh = h; bx = x; } }
      LIZ.push({ x: bx, y: -bh + .5, st: 'sit', t: Math.random() * 200, a: 1, f: Math.random() < .5 ? 1 : -1, run: 0 }); }
    for (const L of LIZ) { L.t++;
      if (L.st === 'sit' && C3.x > L.x - 150 && C3.x < L.x + 60) scurry(L);
      if (L.st === 'run') { L.run++; L.x += 3.6 * L.f; L.y = -edgeAt(L.x) + .5; if (L.run > 22) L.a = Math.max(0, L.a - .05); } } }
  function scurry(L) { if (L.st !== 'sit') return; L.st = 'run'; L.f = 1; if (audio()) { hiss(3200, 1.5, .02, .08, 'bandpass'); hiss(2600, 1.5, .02, .08, 'bandpass', .07); hiss(3000, 1.5, .015, .08, 'bandpass', .14); } }
  // (4) THE OAK: a touch on its crown and a bird flies out with a chirp, and a few leaves come down
  const OBIRD = [], OLEAF = [];
  let oakT = 0;
  function oakTouch(sx, sy) { if (G.t - oakT < 70) return; oakT = G.t; const wx = (sx - VW / 2) / cam.z + cam.cx, wy = (sy - cam.wl) / cam.z;
    OBIRD.push({ x: wx, y: wy, vx: -(3 + Math.random() * .5), vy: -.3, t: 0, ph: Math.random() * 6 });
    for (let i = 0; i < 6; i++) OLEAF.push({ x: wx + (Math.random() - .5) * 60, y: wy + (Math.random() - .5) * 30, vy: .35 + Math.random() * .3, t: 0, s: Math.random() * 6, life: 260 + Math.random() * 120 });
    if (audio()) { for (let i = 0; i < 5; i++) hiss(900 + Math.random() * 300, 1, .03, .07, 'bandpass', i * .06); sweep(2900, 3700, .09, .025, false, .05); sweep(3100, 3900, .08, .022, false, .2); } }
  function oakLife() { for (const b of OBIRD) { b.t++; b.x += b.vx; b.y += b.vy; b.vy = Math.max(-.7, b.vy - .003); }
    for (let i = OBIRD.length - 1; i >= 0; i--) if (OBIRD[i].t > 420) OBIRD.splice(i, 1);
    for (const l of OLEAF) { l.t++; l.y += l.vy; l.x += .25 + .5 * Math.sin(l.t / 20 + l.s); }
    for (let i = OLEAF.length - 1; i >= 0; i--) if (OLEAF[i].t > OLEAF[i].life) OLEAF.splice(i, 1); }
  // (7) THREE HIDDEN NOTES: faint lights in crevices along the rocky path; a touch on one sings a note of the hymn's first
  // words ("A-maz-ing") bent flat, as the tune goes wrong off the right way, and the light drifts up and fades. Nothing more
  // when all three are found: the hymn comes right only at the Cross (owner, build 375).
  const HIDDEN = [[PATH0 + 170, 62, 61], [PATH0 + 560, 67, 66], [PATH0 + 900, 71, 70]].map(([x, m, f]) => ({ x, m, f, y: 0, got: 0, up: 0 }));
  function hiddenLife() { for (const h of HIDDEN) { if (!h.y) h.y = -edgeAt(h.x) - 3; if (h.got) h.up++; } }
  function hiddenTouch(sx, sy) { for (const h of HIDDEN) { if (h.got) continue; const px = (h.x - cam.cx) * cam.z + VW / 2, py = cam.wl + h.y * cam.z;
      if (Math.hypot(sx - px, sy - py) < 34 + 30 * cam.z) { h.got = 1; note(h.f - 12, .05, 3.4); note(h.f, .03, 3, .02);
        return true; } }
    return false; }
  // (7) A GLINT AT FIRST SIGHT: each thing that answers a touch (the oak, a lizard, a hidden light, the things he carries)
  // glints once, softly, the first time it comes well into the picture, with a tiny high chime, and once more a while
  // later if it has not been touched; so a child knows there is something to find. `pos` gives its place on the screen.
  const GLINTS = [], SEEN_G = {};
  function glint(key, pos, again = 0) { const g = SEEN_G[key] || (SEEN_G[key] = { n: 0, t: 0 }); if (g.n >= 1 + again || G.t - g.t < 600) return; g.n++; g.t = G.t; GLINTS.push({ pos, t: 0 }); note(98 - 12 * Math.random() | 0, .012, 1.2, 0, false); }
  function glints() {
    const inView = sx => sx > VW * .18 && sx < VW * .82;
    if ((ph === 'plain' || ph === 'meet') && OAKBOX && !oakT) { const p = () => OAKBOX ? [OAKBOX[0] + OAKBOX[2] * .3, OAKBOX[1] + OAKBOX[3] * .4] : [-99, -99]; if (inView(p()[0]) && C3.x > START + 120) glint('oak', p, 1); }
    if (ph === 'path') { for (let i = 0; i < LIZ.length; i++) { const L = LIZ[i]; if (L.st !== 'sit') continue; const p = () => [(L.x - cam.cx) * cam.z + VW / 2, cam.wl + (L.y - 4) * cam.z]; if (inView(p()[0])) glint('liz' + i, p); }
      HIDDEN.forEach((h, i) => { if (h.got || !h.y) return; const p = () => [(h.x - cam.cx) * cam.z + VW / 2, cam.wl + h.y * cam.z]; if (inView(p()[0])) glint('hid' + i, p, 1); }); }
    if (ph === 'plain' && C3.x > START + 60 && !SEEN_G.tray) { glint('tray', () => [27, 27]); G.trayGlint = 1; }
    for (const g of GLINTS) g.t++; for (let i = GLINTS.length - 1; i >= 0; i--) if (GLINTS[i].t > 60) GLINTS.splice(i, 1); }
  // (4) A MUSIC BED (owner: "music lights etc"): a very quiet held chord made in the browser, a few soft voices that glide
  // from one chord to the next as the story moves: warm on the plain (G major), uneasy as he turns aside (the B goes
  // flat), low and dark on the rocky path, growing as he nears the foot, a held tension under the mountain, opening into
  // warmth when Evangelist takes his hand, hopeful as he hurries back, quiet at the gate, swelling a little as the door
  // opens. It sinks under every spoken line and fades away whenever the level stops being played (a watchdog), so it
  // never hangs on into another level or the pause menu. I cannot hear it: the owner's ears decide its level.
  let PAD = null;
  const BED = { plain: [[43, 50, 55, 59], .016], meet: [[43, 50, 55, 59], .014], aside: [[43, 50, 55, 58], .018], down: [[43, 50, 55, 58], .01],
    path: [[38, 45, 50, 53], .02], still: [[37, 44, 50, 53], .028], come: [[38, 45, 50, 53], .02], evan: [[38, 45, 50, 53], .018],
    back: [[43, 50, 55, 59], .02], mist: [[43, 50, 55, 62], .012], gate: [[43, 50, 55, 62], .014], knock: [[43, 50, 55, 62], .014], open: [[43, 50, 59, 62], .026] };
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function padTick() {
    if (!audio() || typeof AC === 'undefined' || !AC) return;
    if (!PAD) { const g = AC.createGain(), f = AC.createBiquadFilter(); g.gain.value = 0; f.type = 'lowpass'; f.frequency.value = 700; f.Q.value = .4; g.connect(f); f.connect(OUT);
      const vs = [0, 1, 2, 3].map(i => { const a = AC.createOscillator(), b = AC.createOscillator(), vg = AC.createGain(); a.type = 'sine'; b.type = 'triangle'; b.detune.value = 5 + i; vg.gain.value = i ? .7 : 1; a.connect(vg); b.connect(vg); vg.connect(g); a.start(); b.start(); return { a, b }; });
      PAD = { g, f, vs, last: 0, key: '' };
      PAD.dog = setInterval(() => { if (!PAD) return; if (!HL.on || performance.now() - PAD.last > 400) { const P = PAD; PAD = null; clearInterval(P.dog); P.g.gain.setTargetAtTime(0, AC.currentTime, .4); setTimeout(() => P.vs.forEach(v => { try { v.a.stop(); v.b.stop(); } catch (e) {} }), 2500); } }, 250); }
    PAD.last = performance.now();
    let [ch, lv] = BED[ph] || BED.plain;
    if ((ph === 'evan' || ph === 'come') && mercy > .4) { ch = [43, 50, 59, 62]; lv = .024; }
    if (ph === 'path') lv *= .7 + .5 * smooth(PATH0, FOOT, C3.x);
    if (ph === 'still' && zs === 'hold') lv *= 1.3;
    if (ph === 'open') lv *= .6 + .4 * door;
    if (saying()) lv *= .5;
    const key = ch.join();
    if (key !== PAD.key) { PAD.key = key; ch.forEach((m, i) => { const f = hz(m); PAD.vs[i].a.frequency.setTargetAtTime(f, AC.currentTime, 1.2); PAD.vs[i].b.frequency.setTargetAtTime(f, AC.currentTime, 1.2); }); }
    PAD.g.gain.setTargetAtTime(lv, AC.currentTime, .9); }
  function shed(n, k = 1) { for (let i = 0; i < n; i++) { const h = 40 + Math.random() * 100; ROCKS.push({ x: faceX(h) - 2, y: -h, vx: -(.2 + Math.random() * .7) * k, vy: Math.random() * .4, r: .8 + Math.random() * 2.4 * k, t: 0, s: Math.random() * 6, sh: rockShape() }); } }
  // the sweet tune of his counsel: a pretty phrase in the major that goes nowhere (k 1: fuller, with a chord)
  function sweet(k) { const M = k ? [67, 71, 74, 79, 76, 74] : [72, 76, 79, 76]; M.forEach((m, i) => note(m, .028 + .008 * k, 2.4, i * .42)); if (k) [55, 59, 62].forEach(m => note(m, .02, 4.5, .1)); }
  // the burden groans: two heavy creaks of the pack
  function groan() { if (!audio()) return; sfx.step(false, 2.6); setTimeout(() => HL.on && sfx.step(false, 2.2), 520); }
  // ONE KEY WITH LEVEL 2 (vision chat, owner: "Level 3 can [be] more monochromatic ... the opening needs work with color - it should
  // follow level 2 - right now the color transition is too sharp"): on the plain and the way out to the hill the whole
  // picture is drawn in Level 2's warm silver key, colour held down to a breath (`mono`, eased by the game clock in
  // update(); laid in draw() before the glints), and the level opens out of Level 2's last mist, which thins as he walks
  // on (`MIST0`). Among the rocks and at the gate `mono` is 0: those are unchanged.
  let mono = 1;
  // THE PULL AT THE GATE ({62}): Good-will's reaching picture, the pull, the arrows (`ARW`, world units) and the far castle
  let GWRE = null, gwReach = 0, gwReachTo = 0, pullT = -1, pullX0 = 0, GWFX = null; const GWRE_META = { ax: 62, ground: 299 }, ARW = [];
  const MONO_SAT = .62, MONO_TONE = [226, 202, 158], MIST0 = 620;
  let wise = null, evan = null, dark = 0, hope = 0, flash = 0, flashT = 0, veil = 0, veilTo = 0, knocks = 0, knockT = 0, door = 0, doorTo = 0;
  let greeted = false, saidSeen = false, saidHigh = false, stillT = 0, hasteSaid = false, gateSaid = false, hintT = 0, noteI = 0, noteX = 0, lastFr = 0, hillSeen = false, signSeen = false;
  let OAKT = null, hillBox = [0, 0, 1];
  // the scene shift (`cut`: the picture goes dark, 0 .. 1) and the great pull back at the foot (`Zw`: 0 close .. 1 the
  // whole mountain; `zs` its stage: 'out', 'hold', 'in', 'done')
  let cut = 0, cutTo = 0, Zw = 0, zs = '', zT = 0;
  // ONE MORE LOOK (owner, build 202: "is there a way to view mountain in all its glory for longer or again"): the wide shot at
  // the foot holds about four seconds longer, and when he is back at the start of the path the camera pulls back once more
  // to the whole mountain behind him (`farewell`, ticks since it began) before the mist takes him to the gate
  let farewell = 0;

  // ---------- pictures baked once ----------
  let CLOUDW = null, CLOUDG = null, DECK = null;
  let HILL = null, SMOKE = null, CLOUD = null, TOWN = null, GDOOR = null, GSTONE = null, CAP = null, BEAMC = null, SIGNPIC = null, GWST = null, GWALL = null, SHC = null, CHRSH = null, CHRSH_N = null; const GWST_META = { ax: 61, ground: 306 }; const GWF = []; const CRACKS = [], STONES = [], SEAMS = [], PUFF = [];
  // the hill's outline: h = height above its foot, 0 to TOP; its left side hangs far out over the way
  const TOP = 520, HW = 1500, HH = 640, HOX = 300, HOY = 610;      // the baked picture's size and where the foot's left end lies in it
  const FACE = [[0, 0], [36, -30], [84, -62], [112, -44], [150, -70], [240, -138], [320, -182], [358, -176], [420, -116], [480, -44], [520, 36]];      // a second, lower overhang under the great one
  function faceX(h) { let i = 0; while (i + 2 < FACE.length && FACE[i + 1][0] <= h) i++; const [h0, x0] = FACE[i], [h1, x1] = FACE[i + 1]; return lerp(x0, x1, clamp((h - h0) / (h1 - h0))) + (nz(h * .03, 2) - .5) * 26 * smooth(0, 60, h); }
  const backX = h => 96 + 330 * Math.pow(1 - h / TOP, 1.2) + 560 * Math.pow(1 - h / TOP, 3.2) + (nz(h * .022, 9) - .5) * 64 * smooth(0, 50, h) + (nz(h * .09, 14) - .5) * 22 + 46 * smooth(330, 290, h) * smooth(210, 290, h) + 34 * smooth(170, 140, h) * smooth(90, 140, h);      // the long slope: shoulders, buttresses, a rough skyline
  // the overhanging face only: a band from `inset` to `w` hill units inside the face (w large: everything right of it)
  function facePath(c, hx, hy, k, inset, w, up = 0) {
    c.beginPath(); c.moveTo(hx + (-8 + inset) * k, hy + 12 * k);
    for (let h = 0; h <= TOP; h += 4) c.lineTo(hx + (faceX(h) + inset) * k, hy - h * k);
    c.lineTo(hx + (faceX(TOP) + inset) * k, hy - (TOP + up) * k); c.lineTo(hx + (faceX(TOP) + w) * k, hy - (TOP + up) * k);
    for (let h = TOP; h >= 0; h -= 4) c.lineTo(hx + (faceX(h) + w) * k, hy - h * k);
    c.lineTo(hx + (-8 + w) * k, hy + 12 * k); c.closePath();
  }
  // the hill's outline on the screen (its foot's left end at hx, hy; k screen px per hill unit), drawn `inset` hill units
  // inside its real edge
  function hillPath(c, hx, hy, k, inset) {
    c.beginPath(); c.moveTo(hx + (-8 + inset) * k, hy + 12 * k);
    for (let h = 0; h <= TOP - inset; h += 4) c.lineTo(hx + (faceX(h) + inset) * k, hy - h * k);
    for (const [sx, sy] of [[46, -529], [60, -524], [72, -537], [86, -527]]) c.lineTo(hx + sx * k, hy + (sy + inset) * k);
    for (let h = TOP - inset; h >= 0; h -= 4) c.lineTo(hx + (backX(h) - inset) * k, hy - h * k);
    c.lineTo(hx + (backX(0) + 30 - inset) * k, hy + 12 * k); c.closePath();
  }
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
    // ONE CLOUD CEILING (owner, build 218: "Should the smoke and cloud be more continuous and less varied (maybe more dark
    // overall?"): a storm deck baked as two tiles that repeat seamlessly across the sky (W wide, H high, its underside
    // near the bottom): one solid dark body, darkest at the top, its lower edge a long slow swell, a little ragged, with
    // a few soft tongues hanging from it. Each tile is baked dark, pale (the haze far off) and as the firelight on its
    // underside (a band along the lower edge only).
    { const W = 1200, H = 220, mkDeck = (seed, top, base, pale0, pale1) => { const n = noise2(seed), Rd = rngS(seed), m = new Float32Array(W * H), lit = new Float32Array(W * H);
        const per = (x, f, o) => n(o + Math.cos(2 * Math.PI * x / W) * f, o + Math.sin(2 * Math.PI * x / W) * f);
        // (build 221, owner: "slightly too wavy - what about wispier and layered but keeping color and the way the bottom
        // lights up"): the underside is nearly level, only a slow gentle swell; its edge is torn into long horizontal
        // streaks rather than lumps; and under it hang three thin layers of wisp, each fainter and lower, each broken into
        // long strands, lit from beneath like the deck itself
        const edge = new Float32Array(W); for (let x = 0; x < W; x++) edge[x] = H - 92 - 17 * (per(x, 1.3, 11) - .5) * 2 - 3 * (per(x, 4, 41) - .5) * 2;
        const tn = (x, y, fx, fy, o) => { const t = x / W; return (1 - t) * n(o + x * fx, o + y * fy) + t * n(o + (x - W) * fx, o + y * fy); };
        const WISP = [[14, 9, .55, 5], [32, 8, .36, 9], [54, 7, .22, 13]];
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const r = tn(x, y, .008, .06, 0);
          const d = edge[x] - y + 40 * (r - .5); let w = 0;
          for (const [off, th, al, o] of WISP) { const cy = edge[x] + off + 22 * (tn(x, 0, .003, 0, o) - .5) + 6 * (tn(x, 0, .02, 0, o + 1) - .5), u = (y - cy) / th; if (Math.abs(u) < 3) w = Math.max(w, Math.exp(-u * u) * al * smooth(.42, .7, tn(x, y, .008, .045, o + 3))); }
          const body = smooth(-14, 30, d); m[y * W + x] = Math.max(body, w); lit[y * W + x] = Math.max(smooth(-14, 6, d) * (1 - smooth(8, 64, d)), w * 1.3); }
        // (build 343, owner: "maybe make clouds themselves more detailed?"): inside the deck, rolling masses: a field of soft
        // noise at three sizes, stretched sideways (`sh`), lighter where a mass bulges, darker in broad soft hollows between them
        // (`cr`; thin crease lines were tried and read as marble veins), strongest toward the underside where the light comes from below, and the firelight follows the masses too
        const sh = new Float32Array(W * H), cr = new Float32Array(W * H);
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; if (m[i] < .01) continue;
          const V = yy => .62 * tn(x, yy, .011, .032, 50) + .38 * tn(x, yy, .026, .065, 60), v = V(y);
          // relief, lit from below: where the masses' value falls going down (each mass's underside) it catches light
          const dv = v - V(y + 5);
          sh[i] = clamp(smooth(.22, .78, v) + 2.6 * dv); cr[i] = 1 - smooth(.25, .5, tn(x, y, .016, .045, 80)); lit[i] *= .55 + .9 * sh[i]; }
        const shade = (col, x, y, i, k) => { const nb = 1 - clamp((edge[x] - y) / 170), f = (.78 + .44 * sh[i]) * (1 - .2 * cr[i] * (.4 + .6 * nb)), w = clamp((sh[i] - .55) * 2.5) * nb * .35;
          return mixc(col.map(v => v * (1 + (f - 1) * k)), [92, 66, 62], w * k); };
        const tile = (fn) => { const c = mk(W, H), q = c.getContext('2d'), im = q.createImageData(W, H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x, [r, g, b, a] = fn(x, y, i); im.data[i * 4] = r; im.data[i * 4 + 1] = g; im.data[i * 4 + 2] = b; im.data[i * 4 + 3] = a; } q.putImageData(im, 0, 0); return c; };
        const mixc = (a, b, t) => a.map((v, j) => v + (b[j] - v) * t);
        return { W, H, top, pale1,
          d: tile((x, y, i) => { const t = clamp((edge[x] - y) / 150); return [...shade(mixc(base, top, t), x, y, i, 1), 255 * m[i]]; }),
          h: tile((x, y, i) => { const t = clamp((edge[x] - y) / 150); return [...shade(mixc(pale0, pale1, t), x, y, i, .5), 255 * m[i]]; }),
          l: tile((x, y, i) => [255, 176, 120, 255 * lit[i]]) }; };
      DECK = [mkDeck(83, [26, 22, 27], [50, 40, 44], [150, 138, 142], [140, 130, 138]), mkDeck(97, [32, 27, 32], [60, 48, 52], [160, 148, 150], [146, 136, 144])]; }
    SMOKE = cloud(240, 80, 5, .4, .022, .05); CLOUD = cloud(400, 90, 31, .46, .014, .045);
    { const tintOf = col => { const t = mk(CLOUD.width, CLOUD.height), q = t.getContext('2d'); q.drawImage(CLOUD, 0, 0); q.globalCompositeOperation = 'source-in'; q.fillStyle = col; q.fillRect(0, 0, t.width, t.height); return t; }; CLOUDW = tintOf('rgb(255,226,176)'); CLOUDG = tintOf('rgb(168,160,176)'); }
    // billows of smoke: three soft round shapes, each baked dark and again as the light the fire lays on its underside
    for (const seed of [5, 17, 29]) { const base = mk(160, 160), b2 = base.getContext('2d'), Rp = rngS(seed);
      for (let j = 0; j < 10; j++) { const an = Rp() * 6.283, d = j ? 21 + Rp() * 22 : 0, r = j ? 26 + Rp() * 15 : 45, x = 80 + Math.cos(an) * d, y = 80 + Math.sin(an) * d * .8, g = b2.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.7)'); g.addColorStop(.45, 'rgba(255,255,255,.45)'); g.addColorStop(.8, 'rgba(255,255,255,.14)'); g.addColorStop(1, 'rgba(255,255,255,0)'); b2.fillStyle = g; b2.fillRect(x - r, y - r, 2 * r, 2 * r); }
      // (build 251, owner: "make em slightly wispier"; build 253, "too wispy": halfway back; build 256, "a bit more billowy": rounder lobes with fuller cores and a firmer rounded edge, fewer wisps, each billow lighter on top and darker beneath so it reads as a volume): a ragged fringe of small drawn-out wisps round the core, and a few
      // soft holes worn through it, so a billow's edge frays into the air instead of ending in a round outline
      // (build 308, owner: "make them less wide please - also maybe more wispy and diffuse"): softer lobes (cores .7, falling off from
      // the middle), more and longer wisps, more holes; drawn narrower than build 306 (2.2 by 1.6 of the radius)
      for (let j = 0; j < 18; j++) { const an = Rp() * 6.283, d = 34 + Rp() * 34, r = 7 + Rp() * 13, x = 80 + Math.cos(an) * d, y = 80 + Math.sin(an) * d * .7, g = b2.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)'); b2.save(); b2.translate(x, y); b2.rotate((Rp() - .5) * 1.4); b2.scale(2.2, .7); b2.fillStyle = g; b2.fillRect(-r, -r, 2 * r, 2 * r); b2.restore(); }
      b2.globalCompositeOperation = 'destination-out';
      for (let j = 0; j < 7; j++) { const an = Rp() * 6.283, d = 20 + Rp() * 40, r = 6 + Rp() * 9, x = 80 + Math.cos(an) * d, y = 80 + Math.sin(an) * d * .7, g = b2.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); b2.fillStyle = g; b2.fillRect(x - r, y - r, 2 * r, 2 * r); }
      b2.globalCompositeOperation = 'source-over';
      const tinted = fill => { const c2 = mk(160, 160), k2 = c2.getContext('2d'); k2.drawImage(base, 0, 0); k2.globalCompositeOperation = 'source-in'; k2.fillStyle = fill(k2); k2.fillRect(0, 0, 160, 160); return c2; };
      // (build 251, owner: "match billows color with clouds better - also lighten billows closer to mountain"): the dark is the
      // cloud's own underside colour (`DECK`), and a paler smoke-grey (`p`) for the billows just leaving the rock
      PUFF.push({ h: tinted(() => 'rgb(146,134,140)'), d: tinted(k2 => { const g = k2.createLinearGradient(0, 30, 0, 140); g.addColorStop(0, 'rgb(68,56,60)'); g.addColorStop(1, 'rgb(42,34,39)'); return g; }), p: tinted(k2 => { const g = k2.createLinearGradient(0, 30, 0, 140); g.addColorStop(0, 'rgb(124,106,104)'); g.addColorStop(1, 'rgb(90,76,78)'); return g; }), s: tinted(k2 => { const g = k2.createLinearGradient(0, 20, 0, 150); g.addColorStop(0, 'rgba(255,232,214,.45)'); g.addColorStop(1, 'rgba(255,214,186,1)'); return g; }), l: tinted(k2 => { const g = k2.createLinearGradient(130, 150, 60, 60); g.addColorStop(0, 'rgba(255,200,146,1)'); g.addColorStop(.5, 'rgba(240,150,100,.35)'); g.addColorStop(1, 'rgba(220,120,90,0)'); return g; }) }); }
    // (build 335, owner: "when i say diffuse i mean more guassian not wispy"): a soft blurred copy of every billow (`dB`, `pB`, `hB`),
    // made once on a wider canvas (240 for the billow's 160) by shrinking and enlarging twice (no ctx.filter on iPhone), so
    // a column's edge melts as a soft haze rather than fraying into wisps
    { const soft = im => { const o = mk(240, 240), q = o.getContext('2d'); q.drawImage(im, 40, 40); for (let pass = 0; pass < 3; pass++) { const t = mk(30, 30), tq = t.getContext('2d'); tq.drawImage(o, 0, 0, 30, 30); q.clearRect(0, 0, 240, 240); q.drawImage(t, 0, 0, 240, 240); } return o; };
      for (const P of PUFF) { P.dB = soft(P.d); P.pB = soft(P.p); P.hB = soft(P.h); } }
    // the wall's stones by the wicket-gate: rough courses, no two stones alike (shown only where light falls)
    { const Rs = rngS(71); for (let y = 0; y < 330;) { const h = 30 + Rs() * 24; for (let x = GATE_X - 560 - Rs() * 60; x < GATE_X + 560;) { const w = 44 + Rs() * 80; STONES.push({ x, y, w, h, t: Rs(), j: Rs() }); x += w; } y += h; } }
    // THE VILLAGE OF MORALITY (build 267; owner: "Town needs to look more polished and maybe closer to mt via story"):
    // a neat, comfortable little town at the near foot of the hill, right under its overhang ("Go by that hill. The
    // first house you come to is his"): first, nearest him, Legality's fine house (two gables, tall chimneys, a walled
    // garden and two round trees), then tidy cottages, the church with its tower and spire, a barn, more trees. One
    // silhouette (tinted where it is drawn), baked at twice the size it is seen; lit windows (`lit`) and the chimneys that
    // smoke (`ch`) in the same units (900 x 160, the ground at 160).
    { const W = 900, H = 170, c = mk(W, H), k = c.getContext('2d'), Rv = rngS(12); TOWN = c; k.fillStyle = '#fff';
      const lit = [], ch = [], gy = x => H - 6 - 16 * Math.sin(Math.PI * Math.min(1, Math.max(0, x / W))) ** 1.5;      // a gentle rise under the town
      const base = (x, w) => Math.max(gy(x), gy(x + w)) + 1;
      // a house: walls, a roof of its own pitch (gable to us or hipped), chimneys off the ridge's middle
      const house = (x, w, h, pitch, o = {}) => { const g0 = base(x, w), top = g0 - h; k.fillRect(x, top, w, H - top);
        k.beginPath(); if (o.hip) { k.moveTo(x - 2, top + 1); k.lineTo(x + w * .3, top - pitch); k.lineTo(x + w * .7, top - pitch); k.lineTo(x + w + 2, top + 1); } else { k.moveTo(x - 2, top + 1); k.lineTo(x + w / 2, top - pitch); k.lineTo(x + w + 2, top + 1); } k.fill();
        for (const cp of o.chim || []) { const px = x + w * cp, ry = top - pitch * (1 - Math.abs(cp - .5) * 2 * (o.hip ? .4 : 1)), hh = 8 + Rv() * 4; k.fillRect(px - 2.5, ry - hh, 5, hh + 3); k.fillRect(px - 3.5, ry - hh - 2, 7, 2.5); if (o.smoke) ch.push([px, ry - hh - 2]); }
        if (o.win) lit.push([x + w * o.win[0], top + h * o.win[1]]); };
      const tree = (x, r, h) => { const g0 = gy(x) + 1; k.fillRect(x - 2, g0 - h, 4, H); for (let i = 0; i < 11; i++) { const a2 = i * 2.4, rr = r * (.5 + .22 * Rv()); k.beginPath(); k.arc(x + Math.cos(a2) * r * .6, g0 - h - r * .55 + Math.sin(a2) * r * .5, rr, 0, 7); k.fill(); } };
      // first, nearest him: Legality's fine house, hipped, two tall chimneys, a garden wall and a great tree
      tree(18, 22, 26); house(48, 110, 44, 26, { hip: true, chim: [.2, .8], smoke: true, win: [.3, .45] }); house(158, 46, 30, 20, { chim: [.7] });
      // the cottages, each its own width, height and pitch, a few with smoke; a long barn among them
      let x = 222; const plan = [[52, 24, 19], [26, 13, 9, 'tree'], [84, 19, 13, 'barn'], [34, 27, 22], [60, 15, 9]];
      for (const [w, h, p, kind] of plan) { if (kind === 'tree') { tree(x + 12, 15, 17); x += 24; } house(x, w, h, p, { chim: kind === 'barn' ? [] : [.22 + Rv() * .56], smoke: x < 300 || kind === undefined && Rv() < .4, hip: kind === 'barn' }); x += w + 5 + Rv() * 7; }
      // the church: nave and a square tower with a short spire, set back a little
      const c0 = x + 8, cg = base(c0, 116); k.fillRect(c0, cg - 30, 84, H); k.beginPath(); k.moveTo(c0 - 2, cg - 29); k.lineTo(c0 + 42, cg - 47); k.lineTo(c0 + 86, cg - 29); k.fill();
      k.fillRect(c0 + 84, cg - 64, 26, H); for (let i = 0; i < 4; i++) k.fillRect(c0 + 84 + i * 7.3, cg - 68, 4, 5);
      k.beginPath(); k.moveTo(c0 + 86, cg - 66); k.lineTo(c0 + 97, cg - 122); k.lineTo(c0 + 108, cg - 66); k.fill(); k.fillRect(c0 + 96.2, cg - 131, 1.6, 10); k.fillRect(c0 + 93, cg - 127, 8, 1.4);
      lit.push([c0 + 30, cg - 15]);
      x = c0 + 124; tree(x + 12, 19, 20); x += 34;
      for (const [w, h, p] of [[46, 22, 20], [70, 16, 11], [28, 12, 14]]) { house(x, w, h, p, { chim: [.3 + Rv() * .4], smoke: w === 70, win: w === 46 ? [.6, .5] : null }); x += w + 6 + Rv() * 6; }
      tree(x + 14, 17, 18);
      // only a few windows lit, not in a row
      lit.push([270, base(250, 40) - 9], [345, base(330, 40) - 10]);
      TOWN.lit = lit; TOWN.ch = ch; TOWN.W = W; TOWN.H = H; }
  }
  // THE PAINTED OAK (build 163; owner: "maybe adjust how trunk interacts with ground to be more realistic - more detail on
  // trunk - can we have google image have a go at it?"). One picture from the image model (about 15 cents), given the
  // code-drawn oak as its shape: a gnarled trunk with a hollow, roots spreading into rough grass, the long limb
  // reaching right, feathery pads of leaves. assets/oak-leaf.webp, cut from its white paper. OAK_META: ax = the
  // trunk's middle, ground = the row that stands on the field's edge (the grass at its foot goes a little below, behind
  // the road), tw = sunlit leaves that twinkle. It is toned a little darker here to sit in the game's quiet tones,
  // and has an all-dark copy for when the sky darkens. Until it has loaded, the code-drawn oak (bakeOak) stands in.
  const OAK_META = { w: 1839, h: 1360, ax: 390, ground: 1328, k: .44 };
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
      { const g = k.createLinearGradient(0, OAK_META.ground - 52, 0, OAK_META.ground + 12); g.addColorStop(0, 'rgba(40,37,36,0)'); g.addColorStop(1, 'rgba(40,37,36,1)'); k.fillStyle = g; k.fillRect(0, OAK_META.ground - 52, W, H); }
      // build 309 (owner: "can you integrate roots of tree into ground a bit more"): the ragged strip of roots at its foot fades
      // out downward, so the roots go down into the road's earth instead of lying on it as a flat dark band
      // build 316 (owner: "now looks like a clean cut - a variable transition would be better"): the fade's line wanders along
      // the foot (slow waves and a little jitter, in 4-pixel strips): some roots reach deeper into the earth, some fade higher; below each strip's end NOTHING is left
      // (owner: "you can see roots of tree popping out below transition": a fade that stops at .9 leaves ghosts)
      { k.globalCompositeOperation = 'destination-out'; const G0 = OAK_META.ground, RJ = rngS(17);
        for (let x = 0; x < W; x += 4) { const n = .5 + .28 * Math.sin(x * .011 + 1.3) + .16 * Math.sin(x * .037 + 4) + .1 * (RJ() - .5), y0 = G0 - 34 + 40 * n, len = 14 + 22 * (1 - n), mx = .6 + .3 * n;
          const g = k.createLinearGradient(0, y0, 0, y0 + len); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.45, 'rgba(0,0,0,' + (mx * .4).toFixed(3) + ')'); g.addColorStop(.8, 'rgba(0,0,0,' + mx.toFixed(3) + ')'); g.addColorStop(1, 'rgba(0,0,0,1)'); k.fillStyle = g; k.fillRect(x, y0, 4, H - y0); } }
      k.globalCompositeOperation = 'source-over';
      // the leaves, drawn: one small touch wherever the painting has a leaf (a jittered grid), toned by how light that leaf was
      for (let y = 3; y < H * .7; y += 10) for (let x = 3; x < W; x += 10) { const xx = Math.min(W - 1, Math.max(0, Math.round(x + (R() - .5) * 10))), yy = Math.round(y + (R() - .5) * 10), i = (yy * W + xx) * 4;
        if (px[i + 3] < 190) continue; const r = px[i], g = px[i + 1], b = px[i + 2]; if (g < b * 1.22 || r > g * 1.22) continue;
        const l = clamp(((r + g) / 2 - 46) / 105); if (R() < .12) continue;
        // (build 275: the drawn touches are gone; at twice the size the painting's own leaves, toned dark, are finer than any dab)
        if (l > .6 && R() < .08 && tw.length < 70) tw.push([xx, yy]); }
      const d = mk(W, H), kd = d.getContext('2d'); kd.drawImage(c, 0, 0); kd.globalCompositeOperation = 'source-in'; kd.fillStyle = 'rgb(20,20,26)'; kd.fillRect(0, 0, W, H);
      // the trunk's bright edge toward the sun, one for each side (the sun passes from one side of it to the other as he walks)
      const rim = sgn => { const r = mk(W, H), q = r.getContext('2d'); q.drawImage(c, 0, 0); q.globalCompositeOperation = 'destination-out'; q.drawImage(c, -4 * sgn, 1); q.globalCompositeOperation = 'source-in'; q.fillStyle = 'rgb(255,224,168)'; q.fillRect(0, 0, W, H);
        q.globalCompositeOperation = 'destination-in'; const g = q.createLinearGradient(0, H * .52, 0, H * .66); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)'); q.fillStyle = g; q.fillRect(0, 0, W, H);
        q.globalCompositeOperation = 'destination-out'; const g2 = q.createLinearGradient(0, OAK_META.ground - 128, 0, OAK_META.ground - 68); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)'); q.fillStyle = g2; q.fillRect(0, OAK_META.ground - 128, W, H); // (build 202: softened a little, drawn at half size and back, so the hair-thin line does not shimmer as the camera glides)
        const h2 = mk(Math.ceil(W / 2), Math.ceil(H / 2)); h2.getContext('2d').drawImage(r, 0, 0, h2.width, h2.height); const r2 = mk(W, H), q2 = r2.getContext('2d'); q2.drawImage(h2, 0, 0, W, H); q2.globalAlpha = .6; q2.drawImage(r, 0, 0); q2.globalAlpha = 1; q2.globalCompositeOperation = 'destination-in'; q2.drawImage(c, 0, 0); return r2; };      // (build 275: kept inside the tree's own outline, so no pale halo round it)
      // its alpha at a quarter size, so a figure standing in front of it can tell the tree is behind him (no sun behind him there)
      const aw = Math.ceil(W / 4), ah = Math.ceil(H / 4), ac = mk(aw, ah), ak = ac.getContext('2d'); ak.drawImage(c, 0, 0, aw, ah); const ad = ak.getImageData(0, 0, aw, ah).data, am = new Uint8Array(aw * ah); for (let i = 0; i < am.length; i++) am[i] = ad[i * 4 + 3];
      OAKP = { c, d, tw, rimR: rim(1), rimL: rim(-1), am, aw, ah }; }).catch(() => {});
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
  let LAVA = null, LAVAB = null, HILLV = null, ROCKTEX = null, ROCKPAT = null, ROCKA = null;
  // how far inside the rock a point is (hill units from its foot's left end, y up negative): 0 outside or within m of the edge, 1 well inside
  const inRock = (x, y, m) => { if (!ROCKA) return 1; let lo = 255; for (const [dx, dy] of [[0, 0], [-m, 0], [m, 0], [0, -m], [-m * .7, -m * .7], [m * .7, -m * .7]]) { const u = Math.round((x + dx + HOX) / 5), v = Math.round((y + dy + HOY) / 5); lo = Math.min(lo, u < 0 || v < 0 || u >= HW / 5 || v >= HH / 5 ? 0 : ROCKA[v * HW / 5 + u]); } return smooth(120, 250, lo); };
  function paintHill(rock, fire) {
    // (build 183, owner: "Gotta increase resolution, no?": the painting was made again at the image model's highest
    // size, 6336 px wide, and kept at 3000 x 1280, twice the hill's own units, so the close-up and the summit stay
    // sharp on a phone; the baked hills take the picture's own size, R times the units)
    const R = rock.width / HW;
    HILL = [[[74, 62, 66], .74], [[22, 20, 26], .58]].map(([col, a]) => { const c = mk(HW * R, HH * R), k = c.getContext('2d'); k.drawImage(rock, 0, 0, HW * R, HH * R);
      k.globalCompositeOperation = 'source-atop'; k.globalAlpha = a; k.fillStyle = css(col); k.fillRect(0, 0, HW * R, HH * R); return c; });
    // the hill far off (build 185): the dark rock seen through the evening's air, its colours taken toward the sky behind
    // it at each height, and baked small so its edges and the painting's detail go soft, as a far mountain's do
    // (build 295, owner: "it looks funny to have decent resolution town next to low resolution edge of mountain"): baked
    // at 1.3 times the hill's units now (it was a third), so its outline is as crisp as the painted village beside it; the
    // haze colours keep it far off
    { const Q = 1.3, c = mk(HW * Q, HH * Q), k = c.getContext('2d'); k.drawImage(HILL[1], 0, 0, HW * Q, HH * Q); k.globalCompositeOperation = 'source-atop';
      const g = k.createLinearGradient(0, (HOY - TOP) * Q, 0, HOY * Q); g.addColorStop(0, 'rgba(112,112,134,.6)'); g.addColorStop(.6, 'rgba(150,132,138,.62)'); g.addColorStop(1, 'rgba(196,170,150,.78)'); k.fillStyle = g; k.fillRect(0, 0, HW * Q, HH * Q); HILLV = c; }
    // the mountain's own rock, as a texture for the crags (build 190): a piece from inside the painting, made grey about
    // a middle grey (so laid over in 'overlay' it only lightens and darkens the layer's tone) and mirrored into a 2 x 2
    // tile so it repeats without seams
    { const sx = 720, sy = 540, w = 780, h = 600, t = mk(w, h), q = t.getContext('2d'); q.drawImage(rock, sx, sy, w, h, 0, 0, w, h); const d = q.getImageData(0, 0, w, h), D = d.data; let m = 0;
      for (let i = 0; i < D.length; i += 4) m += D[i] * .3 + D[i + 1] * .59 + D[i + 2] * .11; m /= D.length / 4;
      for (let i = 0; i < D.length; i += 4) { const v = clamp(128 + (D[i] * .3 + D[i + 1] * .59 + D[i + 2] * .11 - m) * 1.15, 0, 255); D[i] = D[i + 1] = D[i + 2] = v; D[i + 3] = 255; } q.putImageData(d, 0, 0);
      ROCKTEX = mk(2 * w, 2 * h); const r = ROCKTEX.getContext('2d'); r.drawImage(t, 0, 0); r.save(); r.translate(2 * w, 0); r.scale(-1, 1); r.drawImage(t, 0, 0); r.restore(); r.save(); r.translate(0, 2 * h); r.scale(1, -1); r.drawImage(ROCKTEX, 0, 0, 2 * w, h, 0, 0, 2 * w, h); r.restore();
      ROCKPAT = ctx.createPattern(ROCKTEX, 'repeat'); }
    // where the rock is, at a fifth of the hill's units (build 197: the steam fades before it reaches the painting's edge)
    { const w = HW / 5, h = HH / 5, t = mk(w, h), q = t.getContext('2d'); q.drawImage(rock, 0, 0, w, h); const D = q.getImageData(0, 0, w, h).data; ROCKA = new Uint8Array(w * h); for (let i = 0; i < w * h; i++) ROCKA[i] = D[i * 4 + 3]; }
    if (fire) { LAVA = mk(HW, HH); LAVA.getContext('2d').drawImage(fire, 0, 0, HW, HH); LAVAB = mk(HW / 10, HH / 10); LAVAB.getContext('2d').drawImage(fire, 0, 0, HW / 10, HH / 10); }
  }
  function preload() {
    loadOak(); if (!VILP) loadImg('village-far.webp').then(im => { if (im) VILP = im; }).catch(() => {});
    if (!loading) loading = Promise.all([Promise.all([loadImg('hill-rock.webp'), loadImg('hill-fire.webp')]).then(([r, f]) => { if (r) { build(); paintHill(r, f); } }), loadPack('wiseman', WIS).catch(() => {}), loadImg('gate-door.webp').then(im => { if (im) GDOOR = soften(im, 4, .7, false, .22); }), loadImg('goodwill-stand.webp').then(im => { if (im) GWST = im; }), loadImg('goodwill-reach.webp').then(im => { if (im) GWRE = im; }), loadImg('gate-wall.webp').then(im => { if (im) GWALL = soften(im, 4, .7, true, .22); }), loadImg('gate-stone.webp').then(im => { if (im) GSTONE = im; }), loadPack('evangelist-walk', EVW).catch(() => {}), EVA.ready || loadPack('evangelist', EVA).catch(() => {}), loadImg('wiseman-stand.webp').then(im => { if (im) WIS_ST = im; }), OBS.ready || loadPack('obstinate', OBS).catch(() => {}), EVS.ready || loadPack('evangelist-stand', EVS).catch(() => {}), RUNP.ready || loadPack('christian-run-plain', RUNP).catch(() => {}),
      WEEP.ready || loadPack('christian-weep', WEEP).catch(() => {}), KNEEL.ready || loadPack('christian-kneel', KNEEL).catch(() => {}), TURN.ready || loadPack('christian-turn', TURN).then(() => bookLoaded('TURN')).catch(() => {}),
      OBS_ST ? 0 : loadImg('obstinate-stand.webp').then(im => { if (im && !OBS_ST) OBS_ST = im; }),
      loadImg('tree-a.webp').then(im => { if (!im) return; const c = mk(im.width, im.height), k = c.getContext('2d'); k.drawImage(im, 0, 0); k.globalCompositeOperation = 'source-in'; k.fillStyle = '#fff'; k.fillRect(0, 0, c.width, c.height); OAKT = c; })]).catch(() => {});
    return loading;
  }

  // one tinted figure, feet at world (x, 0) (each kind of figure has its own small canvas)
  // RIM: the low sun is behind the people (owner, build 172: "Characters should be darker matching tree also maybe outline
  // of glow from sun behind them"). RIM = { k: strength, x: where the light stands, in the world's units } while the
  // people are drawn; each figure then gets a thin warm edge on the side toward the light (the figure's own shape,
  // less the same shape moved a little toward the light: what is left is that edge).
  let RIM = null, HAZE = null, SUNSH = 0, FIRE = null, OAKBOX = null, VILP = null; const RIMC = {};
  // FK: a size correction for the picture being drawn (build 202: the kneel's video zoomed in about 1.2 times as he went
  // down, so the kneeling figure looked too big; `kneelK` undoes it frame by frame, anchored at his feet)
  let FK = 1;
  const kneelK = f => 1 / (1 + .12 * smooth(0, 30, f));
  const tintC = {};

  // (build 254, owner: "can you soften texture of rocks and door ever so slightly so it looks more watercolor and less
  // realistic"): a photograph is softened once as it loads: a copy made `f` times smaller (halving step by step, so no
  // pixels are skipped) and stretched back up is laid over it at `a`, so the stones and the planks keep their shapes but
  // lose the photograph's crisp grit; a repeating picture (`wrap`) is softened from a 3 x 3 tiling, so its edges still meet
  // (build 255, owner: "turn it up slightly more - still a bit too high contrast for me"): softer (a copy four times smaller,
  // at .7), and `flat` of the picture's own mean colour laid over it, so its darks and lights come closer together
  function soften(im, f, a, wrap, flat = 0) {
    const w = im.width, h = im.height, n = wrap ? 3 : 1, T = mk(w * n, h * n), t = T.getContext('2d');
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) t.drawImage(im, i * w, j * h);
    let src = T, sw = T.width, sh = T.height; const tw = Math.max(2, Math.round(T.width / f)), th = Math.max(2, Math.round(T.height / f));
    while (sw > tw) { const nw = Math.max(tw, Math.round(sw / 2)), nh = Math.max(th, Math.round(sh / 2)), q = mk(nw, nh); q.getContext('2d').drawImage(src, 0, 0, sw, sh, 0, 0, nw, nh); src = q; sw = nw; sh = nh; }
    const out = mk(w, h), o = out.getContext('2d'); o.drawImage(im, 0, 0); o.globalAlpha = a; o.imageSmoothingEnabled = true;
    o.drawImage(src, wrap ? sw / 3 : 0, wrap ? sh / 3 : 0, wrap ? sw / 3 : sw, wrap ? sh / 3 : sh, 0, 0, w, h); o.globalAlpha = 1;
    if (flat > 0) { const m = mk(1, 1), mq = m.getContext('2d'); mq.drawImage(src, 0, 0, 1, 1); const d = mq.getImageData(0, 0, 1, 1).data;
      o.globalCompositeOperation = 'source-atop'; o.fillStyle = `rgba(${d[0]},${d[1]},${d[2]},${flat})`; o.fillRect(0, 0, w, h); o.globalCompositeOperation = 'source-over'; }
    return out;
  }
  // the wall's photograph repeats along the wall: its right edge was blended into its left (offline), so there is no seam
  let WALLP = null;
  function wallPat(c) { if (!WALLP) WALLP = c.createPattern(GWALL, 'repeat'); return WALLP; }

  // ---------- THE LANTERN, DRAWN (build 222; owner: "lamp looks like wrong perspective can we redo with computer design using
  // this as design reference"). The photograph showed two sides and the roof from above; the game is a flat side view. So
  // it is drawn here straight on, after that 18th-century iron lantern: a ring to hang it by, a turned finial, a flared
  // stepped roof with a pierced band, one horn pane between two corner posts (horn, as in Bunyan's day: mottled amber with
  // the flame a soft brightness behind it), corner brackets, a pierced base and two small feet. Baked once at 5 pixels a
  // unit; 22 x 40 units; hung by the ring's top (`LANT.hx`, `LANT.hy`), the flame at `LANT.fy`.
  let LANT = null;
  function bakeLantern() {
    const S = 5, Wd = 22, Ht = 40, cv = mk(Wd * S, Ht * S), q = cv.getContext('2d'); q.scale(S, S); const cx = Wd / 2;
    const iron = (y0, y1) => { const g = q.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgb(40,33,28)'); g.addColorStop(1, 'rgb(14,11,10)'); return g; };
    const trap = (y0, y1, w0, w1) => { q.beginPath(); q.moveTo(cx - w0 / 2, y0); q.lineTo(cx + w0 / 2, y0); q.lineTo(cx + w1 / 2, y1); q.lineTo(cx - w1 / 2, y1); q.closePath(); };
    // the ring
    q.strokeStyle = 'rgb(30,24,20)'; q.lineWidth = 1.1; q.beginPath(); q.ellipse(cx, 3.6, 3, 3, 0, 0, 7); q.stroke();
    q.strokeStyle = 'rgba(150,110,70,.35)'; q.lineWidth = .35; q.beginPath(); q.arc(cx, 3.6, 3, Math.PI * 1.1, Math.PI * 1.6); q.stroke();
    // the finial: a small turned dome on a neck
    q.fillStyle = iron(6, 11); q.beginPath(); q.ellipse(cx, 8.4, 2.4, 1.9, 0, 0, 7); q.fill(); q.fillRect(cx - 1.1, 9.6, 2.2, 1.6); q.fillRect(cx - .5, 6, 1, 1);
    // the stepped roof: a cap, a flared hood, a pierced band (its holes glow)
    q.fillStyle = iron(11, 12.5); trap(11, 12.4, 6, 8); q.fill();
    q.fillStyle = iron(12.4, 17); trap(12.4, 16.8, 8, 19.5); q.fill();
    q.fillStyle = 'rgba(160,120,80,.28)'; trap(12.4, 13, 8, 9.4); q.fill();
    q.fillStyle = iron(16.8, 19); q.fillRect(cx - 9.8, 16.8, 19.6, 2.2);
    q.fillStyle = 'rgb(16,13,11)'; q.fillRect(cx - 9.8, 18.8, 19.6, .45);
    for (let k = -4; k <= 4; k++) { q.fillStyle = 'rgba(255,190,110,.85)'; q.fillRect(cx + k * 2 - .35, 17.4, .7, .9); }
    // the horn pane, glowing: mottled amber, the flame a soft brightness behind it
    const px0 = cx - 6, px1 = cx + 6, py0 = 19.2, py1 = 33;
    { const g = q.createRadialGradient(cx, 28.5, .5, cx, 27, 9.5); g.addColorStop(0, 'rgb(255,226,170)'); g.addColorStop(.22, 'rgb(236,160,84)'); g.addColorStop(.6, 'rgb(170,92,40)'); g.addColorStop(1, 'rgb(84,42,18)'); q.fillStyle = g; q.fillRect(px0, py0, px1 - px0, py1 - py0); }
    { const Rr = rngS(41); for (let k = 0; k < 110; k++) { const x = px0 + Rr() * 12, y = py0 + Rr() * 13.8, r = .6 + Rr() * 2.2; q.fillStyle = `rgba(${Rr() < .6 ? '90,40,12' : '255,220,160'},${.06 + Rr() * .12})`; q.beginPath(); q.ellipse(x, y, r, r * (.5 + Rr()), Rr() * 3, 0, 7); q.fill(); } }
    { const g = q.createRadialGradient(cx, 28.6, 0, cx, 28.6, 2.6); g.addColorStop(0, 'rgba(255,255,240,.95)'); g.addColorStop(1, 'rgba(255,240,200,0)'); q.fillStyle = g; q.beginPath(); q.ellipse(cx, 28.6, 1.4, 2.8, 0, 0, 7); q.fill(); }
    // the corner posts, lit on their inner edge by the flame; corner brackets
    for (const sx of [-1, 1]) { const x = cx + sx * 6.8; q.fillStyle = iron(19, 33); q.fillRect(x - .9, 19, 1.8, 14.2);
      q.fillStyle = 'rgba(255,170,90,.45)'; q.fillRect(sx < 0 ? x + .55 : x - .9, 19.4, .35, 13.4);
      q.fillStyle = 'rgb(26,21,18)'; q.beginPath(); q.moveTo(x - sx * .9, 19.4); q.lineTo(x - sx * 3.2, 19.4); q.lineTo(x - sx * .9, 21.6); q.fill(); q.beginPath(); q.moveTo(x - sx * .9, 32.8); q.lineTo(x - sx * 3.2, 32.8); q.lineTo(x - sx * .9, 30.6); q.fill(); }
    q.fillStyle = 'rgb(26,21,18)'; q.fillRect(px0, py0 - .2, 12, .6); q.fillRect(px0, py1 - .4, 12, .6);
    // the pierced base and two small feet
    q.fillStyle = iron(33, 35.5); trap(33, 34.6, 15.4, 16.6); q.fill(); q.fillRect(cx - 8.6, 34.6, 17.2, 1.6);
    for (let k = -3; k <= 3; k++) { q.fillStyle = 'rgba(255,190,110,.6)'; q.beginPath(); q.arc(cx + k * 2.1, 35.4, .3, 0, 7); q.fill(); }
    q.fillStyle = 'rgb(20,16,14)'; q.fillRect(cx - 8.2, 36.2, 2, 1.8); q.fillRect(cx + 6.2, 36.2, 2, 1.8);
    LANT = { cv, w: Wd, h: Ht, hx: cx, hy: .6, fx: cx, fy: 28.6 };
  }

  const CHR_SLOTS = ['chr', 'std', 'std2', 'turn', 'turn2', 'run', 'weep', 'weep2']; let gateHere = false;
  function figure(c, slot, im, meta, x, face, tint, alpha = 1, sy = 1) {
    if (!im || alpha <= .004) return;
    im = solidOf(im);      // build 202: no clear spots inside the figure (solidOf, in index.html)
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
    // (build 275, owner: "when christian goes in front of tree, he's shielded from sun, so the 'silver lining' should
    // disappear"): where the oak stands behind his head and shoulders it hides the low sun, so the edge of light fades
    // (sampled in the oak's own outline at three heights, eased so it comes and goes softly as he walks past)
    let rimK = RIM ? RIM.k : 0;
    if (RIM && !RIM.gold) { let cov = 0; if (OAKBOX && OAKP && OAKP.am) { const [bx, by, bw, bh] = OAKBOX, sx = (x - cam.cx) * cam.z + VW / 2;
        for (const hy of [-70, -105, -140]) { const sy = cam.wl + hy * cam.z, u = (sx - bx) / bw, v = (sy - by) / bh; if (u < 0 || u >= 1 || v < 0 || v >= 1) continue;
          let m = 0; for (const du of [-.012, 0, .012]) { const i = Math.floor(clamp(u + du, 0, .999) * OAKP.aw) + Math.floor(v * OAKP.ah) * OAKP.aw; m = Math.max(m, OAKP.am[i] / 255); } cov = Math.max(cov, m); } }
      const rc0 = RIMC[slot] == null ? cov : RIMC[slot]; RIMC[slot] = rc0 + (cov - rc0) * .08; rimK *= 1 - .92 * RIMC[slot]; }
    if (RIM && rimK > .02) {
      const W = im.width, H = im.height, dir = (RIM.x > x ? 1 : -1) * face;
      { const g = f.createLinearGradient(dir > 0 ? 0 : W, 0, dir > 0 ? W : 0, 0); g.addColorStop(0, 'rgba(70,84,110,' + (.07 * rimK) + ')'); g.addColorStop(.55, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(255,196,140,' + (.09 * rimK) + ')');
        f.globalCompositeOperation = 'source-atop'; f.fillStyle = g; f.fillRect(0, 0, W, H); }
      // build 217 (owner: "really dial in 'silver' sun lining in level 3 opening - I feel like it didn't look right"): the
      // old rim was the figure less itself moved 1.6 pixels, under one screen pixel at this size, so it read as a faint
      // smudge. Now, as a low sun behind someone looks: (1) a crisp line along the edges that face the sun (and a little
      // upward), about two and a half picture pixels deep; (2) the thin parts (hood fringe, hat brim, cane, ragged hems) glow
      // through, since light passes round them: a pixel is lit if every neighbour two pixels away in four directions is
      // outside; (3) a silvery warm white, strongest on the head and shoulders, fading down the body to a trace at the feet;
      // (4) a soft bloom round it
      const rc = tintC._rim || (tintC._rim = mk(8, 8)); if (rc.width !== W || rc.height !== H) { rc.width = W; rc.height = H; }
      const r = rc.getContext('2d'); r.globalCompositeOperation = 'source-over'; r.clearRect(0, 0, W, H); r.drawImage(im, 0, 0);
      const ul = Math.hypot(1, .4), ux = dir / ul, uy = -.4 / ul;
      const ro2 = RIM.gold ? 4.6 : 2.6; r.globalCompositeOperation = 'destination-out'; r.drawImage(im, -ro2 * ux, -ro2 * uy);
      const tc = tintC._thin || (tintC._thin = mk(8, 8)); if (tc.width !== W || tc.height !== H) { tc.width = W; tc.height = H; }
      const t = tc.getContext('2d'); t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, W, H); t.drawImage(im, 0, 0);
      t.globalCompositeOperation = 'destination-out'; for (const [ax, ay] of [[2.2, 0], [-2.2, 0], [0, 2.2], [0, -2.2]]) t.drawImage(im, ax, ay);
      r.globalCompositeOperation = 'source-over'; r.globalAlpha = .4; r.drawImage(tc, 0, 0); r.globalAlpha = 1;
      r.globalCompositeOperation = 'source-in'; if (RIM.gold) { const g = r.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgb(255,226,160)'); g.addColorStop(.6, 'rgba(255,206,130,.9)'); g.addColorStop(1, 'rgba(255,190,110,.6)'); r.fillStyle = g; } else { const g = r.createLinearGradient(0, H * .04, 0, H); g.addColorStop(0, 'rgb(255,248,232)'); g.addColorStop(.3, 'rgba(255,242,218,.85)'); g.addColorStop(.62, 'rgba(255,236,206,.42)'); g.addColorStop(1, 'rgba(250,228,196,.12)'); r.fillStyle = g; } r.fillRect(0, 0, W, H); r.globalCompositeOperation = 'source-over';
      const bc = tintC._bloom || (tintC._bloom = mk(8, 8)); bc.width = Math.ceil(W / 4); bc.height = Math.ceil(H / 4); const b = bc.getContext('2d'); b.clearRect(0, 0, bc.width, bc.height); b.drawImage(rc, 0, 0, bc.width, bc.height);
      f.globalCompositeOperation = 'source-over'; f.globalAlpha = Math.min(1, (RIM.gold ? .95 : .3) * rimK); f.drawImage(rc, 0, 0); f.globalAlpha = 1;
      if (RIM.gold) RIM.bloom = bc;
      else { const P = 36, S = 6, hc = tintC._halo || (tintC._halo = mk(8, 8)), hw = Math.ceil((W + 2 * P) / S), hh = Math.ceil((H + 2 * P) / S); if (hc.width !== hw || hc.height !== hh) { hc.width = hw; hc.height = hh; }
        const h = hc.getContext('2d'); h.globalCompositeOperation = 'source-over'; h.clearRect(0, 0, hw, hh); h.globalAlpha = .16;
        for (const [ox, oy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1.4, 1.4], [-1.4, 1.4], [1.4, -1.4], [-1.4, -1.4], [2.4, 0], [-2.4, 0], [0, 2.4], [0, -2.4]]) h.drawImage(im, (P + 11 * ux) / S + ox, (P + 11 * uy) / S + oy, W / S, H / S);
        h.globalAlpha = 1; h.globalCompositeOperation = 'source-in'; const g = h.createLinearGradient(0, 0, 0, hh); g.addColorStop(0, 'rgba(255,236,200,.95)'); g.addColorStop(.28, 'rgba(255,226,186,.5)'); g.addColorStop(.5, 'rgba(255,214,170,.12)'); g.addColorStop(1, 'rgba(255,210,170,0)'); h.fillStyle = g; h.fillRect(0, 0, hw, hh); h.globalCompositeOperation = 'source-over';
        RIM.halo = { c: hc, P, S }; } }
    // FIRELIGHT ON THE FIGURE (owner, build 202: "in level 3 when we are close to mountain, the sprite is a bit
    // monochromatic... is there a way to introduce some color variation (and keep the same palette"). Among the rocks the
    // one light is the fire ahead and above (`FIRE.x`): the side toward it takes a warm ember glow, strongest high on the
    // body, the side away a cool violet shade from the dusk sky, and the feet a little of the warm dust; the colours are
    // the scene's own (the crags' warm edges, the violet sky). A flash lifts the warm side.
    if (FIRE && FIRE.k > .02) {
      const W = im.width, H = im.height, dir = (FIRE.x > x ? 1 : -1) * face; f.globalCompositeOperation = 'soft-light';      // build 212: light and shade that keep the watercolour's detail (flat washes laid source-atop made him pale and ghostly)
      { const g = f.createLinearGradient(dir > 0 ? 0 : W, 0, dir > 0 ? W : 0, 0); const cw = FIRE.warm || [255, 146, 76], cc = FIRE.cool || [92, 96, 150]; g.addColorStop(0, 'rgba(' + cc + ',' + (.26 * FIRE.k) + ')'); g.addColorStop(.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(' + cw + ',' + Math.min(.55, (.34 + .25 * FIRE.f) * FIRE.k) + ')'); f.fillStyle = g; f.fillRect(0, 0, W, H); }
      { const g = f.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,170,110,' + (.1 * FIRE.k) + ')'); g.addColorStop(.55, 'rgba(0,0,0,0)'); g.addColorStop(.92, 'rgba(150,104,80,0)'); g.addColorStop(1, 'rgba(150,104,80,' + (.12 * FIRE.k) + ')'); f.fillStyle = g; f.fillRect(0, 0, W, H); }
      f.globalCompositeOperation = 'destination-in'; f.drawImage(im, 0, 0); f.globalCompositeOperation = 'source-over';
    }
    if (gateHere && CHR_SLOTS.includes(slot) && (!CHRSH_N || alpha >= CHRSH_N.a)) CHRSH_N = { fc, meta, x, face, k: CHR_K * FK, sy: sy * (TALKM ? TALKM.sy : 1), a: alpha };
    // build 282 (owner: "can we put some mist behind christian when he's in mountain scene so he stand out a little with
    // dark rocks"): among the rocks a soft pale haze stands behind each figure, tallest at the body, in the low sky's own
    // rose-grey, so the dark figure reads against the dark crags. Behind only, never over him (drawn before the figure).
    // SHADOW TOWARD US (build 306, owner: "can you make his shadow go our way since sun is behind him (relative to us)"):
    // on the fair plain the low sun stands behind everyone, so each shadow falls toward us: the figure's own outline turned
    // over at the feet and squashed flat (seen nearly edge-on), soft (made small and stretched), darkest at the feet and
    // fading as it comes forward
    // (build 329, owner: "should we elongate shadow?" ... "yes go ahead"): a third of the figure's height (was a quarter), fading
    // more gradually toward its far end, so it melts into the road for the low sun without reaching the words
    if (SUNSH > .02) { const W = im.width, H = im.height, sc = tintC['sh' + slot] || (tintC['sh' + slot] = mk(8, 8)), w2 = Math.ceil(W / 5), h2 = Math.ceil(H / 5);
      if (sc.width !== w2 || sc.height !== h2) { sc.width = w2; sc.height = h2; } const q = sc.getContext('2d'); q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, w2, h2); q.drawImage(fc, 0, 0, w2, h2);
      q.globalCompositeOperation = 'source-in'; const gq = q.createLinearGradient(0, 0, 0, h2); gq.addColorStop(0, 'rgba(14,12,10,0)'); gq.addColorStop(.35, 'rgba(14,12,10,.12)'); gq.addColorStop(.7, 'rgba(14,12,10,.5)'); gq.addColorStop(1, 'rgba(14,12,10,1)'); q.fillStyle = gq; q.fillRect(0, 0, w2, h2);
      c.save(); c.globalAlpha = alpha * .55 * SUNSH; c.translate(x, FY - 1); c.scale(face * CHR_K * FK, -CHR_K * FK * .36); c.drawImage(sc, -meta.ax, -meta.ground, W, H); c.restore(); }
    if (HAZE && HAZE.k > .02) { const hh = meta.ground * CHR_K * FK * sy; c.save(); c.globalAlpha = alpha; c.translate(x, FY - hh * .48); c.scale(hh * .62, hh * .72);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, css(HAZE.c, .5 * HAZE.k)); g.addColorStop(.45, css(HAZE.c, .3 * HAZE.k)); g.addColorStop(1, css(HAZE.c, 0)); c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore(); }
    // build 282 (owner: "still unsure about the look of the 'silver lining' ...would a light glow be better?"): on the fair
    // plain the low sun behind them is a soft warm glow round the head and shoulders, spreading a little past the outline
    // (drawn before the figure, so it lies behind), with only a faint trace of the old crisp line left on the edge
    if (RIM && RIM.halo && rimK > .02) { const H0 = RIM.halo; c.save(); c.globalAlpha = alpha * .22 * rimK; c.globalCompositeOperation = 'lighter'; c.translate(x, FY); c.scale(face * CHR_K * FK, CHR_K * FK * sy);
      c.drawImage(H0.c, -meta.ax - H0.P, -meta.ground - H0.P, im.width + 2 * H0.P, im.height + 2 * H0.P); c.restore(); RIM.halo = null; }
    c.save(); c.globalAlpha = alpha; c.translate(x, FY); if (TALKM) c.transform(1, 0, TALKM.sh, 1, 0, 0);
    c.scale(face * CHR_K * FK, CHR_K * FK * sy * (TALKM ? TALKM.sy : 1)); c.drawImage(fc, -meta.ax, -meta.ground);
    if (RIM && RIM.bloom && rimK > .02) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = alpha * (RIM.gold ? .9 : .5) * rimK; c.drawImage(RIM.bloom, -meta.ax, -meta.ground, im.width, im.height); c.globalCompositeOperation = 'source-over'; RIM.bloom = null; }
    c.restore();
  }
  // build 281 (owner: "both christian and worldly can be shifted down slightly so their shadows don't extend past ground"):
  // on the fair plain everyone stands a little lower in the road (FY 12, was 5) and the shadow is flatter, so it lies on
  // the road, never on the field behind. Among the rocks and at the gate the old depth (5) is kept. Set each frame in draw().
  let FY = 5;
  function foot(c, x, a = 1, rx = 46) { a *= 1 - clamp(SUNSH); const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, 'rgba(6,8,14,.5)'); g.addColorStop(.6, 'rgba(6,8,14,.26)'); g.addColorStop(1, 'rgba(6,8,14,0)'); c.save(); c.translate(x, FY + (FY > 5 ? 2 : -1)); c.scale(rx * (FY > 5 ? .62 : 1), FY > 5 ? 3.5 : 7); c.globalAlpha = a * (FY > 5 ? .7 : 1); c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore(); }

  // ---------- sound ----------
  // fire out of the hill: a flash and thunder (no words out of the mountain: left out for young children)
  let bolt = null, boltT = 99, boltTwice = false; const embers = [];
  // the rock's top at a hill x (hill units, y up negative), from the rock picture's alpha
  // the storm cloud's base, hill units above the summit; strikes begin a little inside it
  const STORM_Y = 120;
  const rockTopAt = x => { if (!ROCKA) return -TOP * .7; const u = Math.max(0, Math.min(HW / 5 - 1, Math.round((x + HOX) / 5))); for (let v = 0; v < HH / 5; v++) if (ROCKA[v * HW / 5 + u] > 200) return v * 5 - HOY; return 0; };
  const BOLTS = {big:[[0.134,0.032,1,0.141,0.043,1,0.141,0.055,1,0.136,0.062,1,0.136,0.071,1,0.139,0.076,1,0.156,0.089,1,0.168,0.094,1,0.177,0.103,1,0.182,0.113,1,0.181,0.12,1,0.184,0.139,1,0.181,0.147,1,0.181,0.154,1,0.189,0.163,1,0.196,0.175,1,0.194,0.181,1,0.188,0.188,1,0.188,0.201,1,0.193,0.215,1,0.204,0.22,1,0.207,0.224,1,0.209,0.234,1,0.208,0.252,1,0.215,0.27,1,0.215,0.289,1,0.221,0.308,1,0.215,0.319,1,0.215,0.347,1,0.219,0.349,1,0.23,0.349,1,0.24,0.358,1,0.239,0.398,1,0.237,0.41,1,0.223,0.429,1,0.221,0.439,1,0.222,0.45,1,0.229,0.461,1,0.23,0.47,1],[-0.073,0.73,1,-0.076,0.735,1,-0.08,0.753,1,-0.088,0.758,1,-0.089,0.768,1,-0.1,0.78,1,-0.101,0.788,0.9,-0.105,0.792,1,-0.11,0.79,1,-0.111,0.781,1,-0.122,0.773,1,-0.126,0.75,1,-0.131,0.745,1,-0.141,0.722,1,-0.139,0.713,1,-0.141,0.699,1,-0.139,0.676,1,-0.147,0.663,1,-0.147,0.655,1,-0.142,0.646,1,-0.142,0.63,1,-0.146,0.619,1,-0.146,0.6,1,-0.143,0.59,1,-0.146,0.585,1],[-0.028,0.19,1,-0.033,0.194,1,-0.044,0.194,1,-0.049,0.196,1,-0.055,0.196,1,-0.073,0.19,1,-0.081,0.19,1,-0.094,0.2,1,-0.116,0.201,1,-0.137,0.193,1,-0.15,0.183,1,-0.165,0.181,1,-0.172,0.176,1,-0.182,0.174,1,-0.188,0.169,1,-0.197,0.169,1,-0.206,0.163,1,-0.213,0.163,1,-0.218,0.159,1,-0.232,0.162,1,-0.24,0.168,1,-0.253,0.168,1,-0.258,0.171,0.9,-0.263,0.17,0.7],[-0.084,0.477,1,-0.081,0.488,1,-0.067,0.502,1,-0.061,0.515,1,-0.06,0.52,1,-0.067,0.534,1,-0.067,0.54,1,-0.059,0.559,1,-0.059,0.589,1,-0.054,0.598,1,-0.047,0.603,1,-0.045,0.609,1,-0.047,0.616,1,-0.054,0.631,1,-0.054,0.636,1,-0.068,0.658,1,-0.069,0.667,1,-0.076,0.684,1,-0.079,0.709,1,-0.071,0.728,1,-0.074,0.73,1],[0.283,0.287,1,0.284,0.296,1,0.295,0.307,1,0.301,0.308,1,0.305,0.312,1,0.325,0.312,1,0.337,0.304,1,0.346,0.303,1,0.351,0.298,1,0.367,0.301,1,0.374,0.307,1,0.387,0.328,1,0.397,0.337,1,0.399,0.342,1,0.404,0.344,1,0.414,0.343,1,0.424,0.335,1,0.434,0.335,0.6],[-0.027,0.383,1,-0.023,0.384,1,-0.012,0.396,1,-0.004,0.399,1,0.006,0.422,1,0.027,0.433,1,0.033,0.442,1,0.045,0.446,1,0.065,0.447,1,0.074,0.461,1,0.088,0.47,1,0.091,0.483,1,0.101,0.497,1,0.101,0.501,1,0.107,0.509,1,0.107,0.514,1,0.115,0.52,0.9,0.117,0.528,0.8],[-0.176,0.561,1,-0.184,0.565,1,-0.192,0.574,1,-0.192,0.598,1,-0.196,0.601,1,-0.204,0.604,1,-0.207,0.614,1,-0.215,0.624,1,-0.229,0.627,1,-0.257,0.653,1,-0.262,0.656,1,-0.281,0.653,1,-0.289,0.657,1,-0.321,0.66,1,-0.353,0.673,0.9,-0.362,0.673,0.7,-0.365,0.676,0.6],[-0.321,0.839,0.3,-0.324,0.848,1,-0.332,0.858,1,-0.341,0.858,1,-0.348,0.862,1,-0.365,0.876,1,-0.367,0.882,1,-0.374,0.889,1,-0.378,0.889,1,-0.385,0.896,1,-0.397,0.897,1,-0.403,0.904,1,-0.403,0.925,1,-0.407,0.932,1,-0.42,0.942,1,-0.422,0.952,1],[0.23,0.468,1,0.242,0.478,1,0.243,0.487,1,0.247,0.492,1,0.257,0.492,1,0.262,0.496,1,0.271,0.498,1,0.278,0.509,1,0.299,0.523,1,0.302,0.53,1,0.304,0.544,1,0.309,0.558,1,0.312,0.561,1,0.32,0.563,0.7],[-0.033,0.194,1,-0.03,0.206,1,-0.032,0.227,1,-0.029,0.23,1,-0.011,0.222,1,-0.001,0.231,1,0.002,0.236,1,0.019,0.241,1,0.027,0.247,1,0.023,0.261,1,0.017,0.26,1,0.009,0.25,0.9,-0.002,0.25,0.9,-0.006,0.253,0.6],[-0.194,0.77,1,-0.192,0.773,1,-0.192,0.785,1,-0.183,0.792,1,-0.182,0.799,1,-0.177,0.805,1,-0.177,0.831,1,-0.173,0.837,1,-0.179,0.863,1,-0.179,0.875,1,-0.183,0.879,1,-0.178,0.891,1,-0.178,0.896,1,-0.181,0.897,1],[0.227,0.229,1,0.238,0.235,1,0.244,0.248,1,0.244,0.255,1,0.238,0.265,1,0.24,0.27,1,0.247,0.271,1,0.253,0.276,1,0.275,0.278,1,0.283,0.287,1,0.296,0.284,1,0.301,0.286,1,0.309,0.276,1],[-0.073,0.321,1,-0.076,0.322,1,-0.081,0.329,0.9,-0.094,0.339,1,-0.101,0.355,1,-0.119,0.37,1,-0.136,0.369,1,-0.145,0.373,1,-0.153,0.373,1,-0.17,0.384,1,-0.196,0.383,1,-0.204,0.389,0.7,-0.209,0.399,0.9],[-0.032,0.227,1,-0.044,0.243,1,-0.052,0.258,1,-0.052,0.284,1,-0.061,0.289,1,-0.063,0.297,1,-0.071,0.308,1,-0.073,0.321,1,-0.069,0.327,1,-0.069,0.34,1,-0.08,0.35,1,-0.083,0.359,1],[-0.023,0.306,1,-0.008,0.322,1,-0.012,0.338,1,-0.017,0.345,1,-0.03,0.356,1,-0.03,0.363,1,-0.027,0.368,1,-0.027,0.383,1,-0.04,0.388,1,-0.052,0.398,1,-0.055,0.414,1,-0.06,0.419,1],[-0.109,0.791,1,-0.115,0.799,1,-0.114,0.807,1,-0.116,0.836,1,-0.114,0.841,1,-0.114,0.865,1,-0.12,0.876,1,-0.122,0.918,1,-0.121,0.929,1,-0.116,0.937,1,-0.117,0.944,0.8,-0.114,0.95,0.5],[-0.045,0.609,1,-0.027,0.61,1,-0.003,0.627,1,0.001,0.632,1,0.002,0.651,1,0.027,0.677,1,0.032,0.689,1,0.039,0.697,1,0.043,0.708,1,0.048,0.713,1,0.05,0.726,1,0.058,0.735,1],[0.033,0.442,1,0.032,0.452,1,0.037,0.471,1,0.05,0.474,1,0.057,0.481,1,0.069,0.486,1,0.08,0.496,1,0.083,0.506,1,0.092,0.512,1,0.119,0.539,1,0.124,0.565,1],[-0.201,0.753,1,-0.197,0.756,1,-0.194,0.77,1,-0.208,0.78,1,-0.207,0.789,1,-0.209,0.794,1,-0.209,0.81,1,-0.213,0.827,1,-0.209,0.835,1,-0.197,0.847,1,-0.194,0.853,0.6],[-0.332,0.858,1,-0.334,0.873,1,-0.344,0.883,1,-0.344,0.903,1,-0.355,0.918,1,-0.357,0.927,1,-0.357,0.932,1,-0.351,0.942,1,-0.351,0.953,1,-0.337,0.965,1,-0.337,0.968,1],[0.068,0.05,0.6,0.069,0.056,0.9,0.057,0.065,1,0.053,0.08,1,0.04,0.087,1,0.027,0.088,1,0.022,0.092,1,0.006,0.112,1,-0.007,0.117,1,-0.009,0.128,1],[-0.13,0.481,1,-0.137,0.492,1,-0.153,0.506,1,-0.157,0.529,1,-0.172,0.543,1,-0.174,0.548,1,-0.174,0.556,1,-0.171,0.56,1,-0.174,0.563,1,-0.176,0.559,1],[0.221,0.309,1,0.223,0.312,1,0.249,0.316,1,0.262,0.327,1,0.264,0.332,1,0.264,0.358,1,0.273,0.363,1,0.288,0.364,1,0.302,0.375,0.8],[-0.142,0.631,1,-0.135,0.626,0.8,-0.132,0.614,1,-0.129,0.608,1,-0.127,0.593,1,-0.122,0.58,1,-0.126,0.573,1,-0.137,0.567,0.4],[-0.071,0.728,1,-0.067,0.732,1,-0.064,0.744,1,-0.057,0.752,1,-0.052,0.753,1,-0.038,0.769,1,-0.034,0.783,1,-0.038,0.822,1],[0.276,0.508,1,0.275,0.517,0.9,0.283,0.524,1,0.284,0.53,1,0.283,0.545,1,0.285,0.56,1,0.28,0.57,0.9],[0.283,0.528,1,0.274,0.53,1,0.264,0.527,1,0.263,0.508,1,0.253,0.507,1,0.249,0.503,1,0.247,0.494,1],[0.124,0.564,1,0.129,0.568,1,0.129,0.579,1,0.122,0.59,1,0.122,0.604,1,0.129,0.604,1,0.134,0.596,1],[-0.09,0.371,1,-0.086,0.381,1,-0.086,0.403,1,-0.092,0.426,1,-0.102,0.45,1,-0.101,0.46,1,-0.096,0.461,0.7],[-0.081,0.774,1,-0.084,0.785,1,-0.081,0.791,1,-0.083,0.809,1,-0.079,0.821,1,-0.071,0.832,1,-0.069,0.85,0.6],[-0.274,0.829,0.9,-0.265,0.84,1,-0.265,0.867,1,-0.26,0.876,1,-0.26,0.882,1,-0.254,0.888,1,-0.253,0.907,0.3],[0.194,0.216,1,0.188,0.224,1,0.188,0.234,1,0.182,0.247,1,0.181,0.258,1,0.174,0.265,1],[0.189,0.191,1,0.213,0.194,1,0.219,0.19,0.9,0.226,0.19,1,0.242,0.194,1,0.259,0.203,0.9],[-0.009,0.127,1,-0.018,0.135,1,-0.018,0.164,1,-0.021,0.17,1,-0.028,0.176,1,-0.028,0.191,1],[-0.059,0.419,1,-0.067,0.426,1,-0.067,0.458,1,-0.071,0.463,1,-0.078,0.463,1,-0.086,0.47,0.6],[-0.319,0.873,0.9,-0.321,0.882,1,-0.32,0.894,1,-0.325,0.908,1,-0.324,0.929,1,-0.327,0.934,1],[0.151,0.0,1,0.152,0.006,1,0.147,0.022,1,0.134,0.032,1,0.12,0.036,0.4],[0.206,0.221,1,0.213,0.217,1,0.221,0.217,1,0.227,0.222,1,0.227,0.23,1],[0.182,0.113,1,0.186,0.114,1,0.194,0.108,1,0.197,0.098,1,0.193,0.094,1],[0.183,0.085,1,0.178,0.085,1,0.161,0.07,1,0.15,0.067,1,0.141,0.062,1],[0.124,0.605,1,0.12,0.612,1,0.13,0.631,0.9,0.13,0.637,0.8,0.127,0.641,0.8],[-0.102,0.451,1,-0.111,0.453,1,-0.121,0.461,1,-0.127,0.477,1,-0.131,0.481,1],[-0.09,0.77,1,-0.081,0.774,1,-0.08,0.773,1,-0.076,0.766,1,-0.079,0.755,1],[-0.183,0.616,1,-0.184,0.626,1,-0.182,0.633,1,-0.184,0.635,1,-0.186,0.631,1],[-0.198,0.658,0.5,-0.212,0.668,1,-0.219,0.668,0.9,-0.224,0.673,1,-0.229,0.684,0.7],[-0.417,0.938,1,-0.418,0.927,1,-0.415,0.918,1,-0.409,0.909,1,-0.406,0.909,1],[0.309,0.277,1,0.312,0.275,1,0.322,0.275,1,0.358,0.257,0.5],[0.194,0.094,1,0.191,0.091,1,0.184,0.089,1,0.182,0.076,1],[-0.203,0.603,1,-0.215,0.594,1,-0.247,0.594,0.7,-0.255,0.596,0.5],[-0.173,0.563,1,-0.176,0.57,1,-0.183,0.578,1,-0.186,0.586,0.6],[-0.089,0.412,1,-0.081,0.412,1,-0.081,0.407,1,-0.084,0.405,1],[-0.142,0.646,1,-0.14,0.647,1,-0.134,0.643,0.9,-0.134,0.636,0.6],[-0.116,0.501,0.5,-0.121,0.511,0.7,-0.132,0.524,1,-0.139,0.538,0.7],[-0.199,0.728,0.6,-0.198,0.734,1,-0.193,0.738,0.8,-0.193,0.748,0.3],[-0.178,0.893,1,-0.173,0.897,1,-0.171,0.906,1,-0.153,0.927,1],[-0.325,0.825,1,-0.342,0.836,1,-0.352,0.836,1,-0.357,0.834,1],[0.286,0.561,1,0.297,0.58,1,0.299,0.589,0.5],[0.139,0.057,1,0.125,0.05,1,0.114,0.052,1],[-0.13,0.369,1,-0.127,0.363,1,-0.117,0.364,1],[-0.052,0.284,1,-0.027,0.296,1,-0.023,0.307,1],[-0.171,0.559,1,-0.157,0.559,1,-0.152,0.561,0.6],[-0.114,0.807,1,-0.106,0.802,0.9,-0.105,0.795,1],[-0.101,0.52,0.3,-0.104,0.532,1,-0.112,0.55,0.2],[-0.181,0.66,0.5,-0.184,0.667,0.7,-0.187,0.684,0.3],[0.018,0.678,0.5,0.018,0.686,0.8,0.022,0.692,0.5],[-0.198,0.734,1,-0.203,0.744,0.7,-0.201,0.754,1],[-0.153,0.925,1,-0.14,0.942,1,-0.141,0.948,0.7],[-0.189,0.754,0.6,-0.182,0.759,1,-0.178,0.779,0.5],[-0.253,0.786,0.5,-0.248,0.797,0.6,-0.248,0.815,0.2],[-0.398,0.901,1,-0.394,0.903,1,-0.388,0.899,1],[-0.351,0.953,1,-0.353,0.958,1,-0.355,0.979,0.8],[-0.239,0.988,1,-0.238,0.995,1,-0.243,1.0,1],[0.132,0.032,1,0.112,0.014,1],[-0.115,0.822,1,-0.095,0.835,0.7],[-0.178,0.637,0.7,-0.179,0.651,0.6],[-0.422,0.95,1,-0.417,0.964,0.4],[-0.422,0.95,1,-0.434,0.962,0.8]],side:[[0.994,0.464,0.6,0.988,0.482,0.6,0.929,0.53,1,0.923,0.607,1,0.893,0.667,1,0.798,0.756,1,0.75,0.762,1,0.667,0.804,1,0.559,0.804,1,0.494,0.845,1,0.434,0.845,1,0.393,0.827,1,0.309,0.821,1,0.262,0.78,1,0.137,0.726,1,0.077,0.679,1,0.0,0.673,1,-0.066,0.637,1,-0.149,0.637,1,-0.202,0.613,1,-0.292,0.619,1,-0.316,0.649,1,-0.405,0.643,1,-0.452,0.667,1,-0.589,0.661,1,-0.625,0.684,1,-0.696,0.679,1,-0.732,0.655,0.9,-0.816,0.643,1,-0.893,0.714,1],[-1.101,0.905,1,-1.101,0.964,1,-1.173,1.0,1,-1.226,0.994,1,-1.256,0.958,1,-1.304,0.941,1,-1.339,0.952,1],[-0.887,0.714,1,-0.929,0.762,1,-0.982,0.768,1,-1.018,0.809,1,-1.054,0.792,1],[-1.018,0.809,1,-1.036,0.893,1,-1.054,0.911,1,-1.107,0.905,1],[1.339,0.0,0.9,1.28,0.048,0.9]],a:[[0.046,0.0,1,0.072,0.118,1,0.103,0.162,1,0.133,0.319,1,0.159,0.389,1,0.151,0.467,1,0.159,0.52,1,0.142,0.55,1,0.124,0.651,1,0.146,0.734,1,0.164,0.76,1,0.164,0.786,1,0.138,0.812,1,0.129,0.865,1,0.133,0.939,1,0.124,0.978,1,0.116,0.983,1],[-0.042,0.904,0.6,-0.063,0.917,1,-0.164,0.921,0.4],[0.015,0.991,0.9,0.068,0.996,0.2],[0.015,0.991,0.9,-0.046,1.0,0.5]],b:[[0.162,0.0,0.9,0.1,0.062,1,0.093,0.117,1,0.045,0.2,1,-0.093,0.303,1,-0.128,0.352,1,-0.162,0.441,1,-0.128,0.49,1,-0.093,0.579,1,-0.093,0.655,1,-0.114,0.71,1,-0.114,0.738,1,-0.1,0.752,1,-0.114,0.807,1,-0.107,0.862,1],[-0.038,0.883,1,-0.031,0.903,1,-0.066,1.0,1]]};
  function tintSmoke() { if (tintC.smoke) return; const tc = tintC.smoke = mk(SMOKE.width, SMOKE.height), t = tc.getContext('2d'); t.drawImage(SMOKE, 0, 0); t.globalCompositeOperation = 'source-in'; t.fillStyle = 'rgb(255,120,50)'; t.fillRect(0, 0, tc.width, tc.height); }
  // THE CRACKS BREATHE (owner, build 197: "Should smoke come from multiple cracks (but not obstructing any of the view of
  // the super cool mt)? I love how cracks light up so cool"; agreed as proposed). Not columns (build 153's threads of smoke
  // read as chimneys): a faint, ragged breath of steam seeps from each of the four brightest cracks of the painted fire
  // (`VENTS`, found in hill-fire.webp, in the hill's own units: x from its foot's left end, y up negative, and how far
  // down the crack runs), clings to the rock, spreads a little, lifts and thins within a short height. Warm where it
  // leaves the crack, grey as it rises; a flash makes each crack puff. It fades before it reaches the hill's outline
  // (`faceX`/`backX`), so it never blurs the silhouette, and it is see-through: the summit's plume stays the one big smoke.
  const VENTS = [[62, -374, 50], [238, -330, 80], [378, -313, 70], [637, -159, 45]], STEAMP = [];
  let STEAMC = null;
  function steamPuff(v, burst = 0) { const [x, y, len] = VENTS[v]; STEAMP.push({ x: x + (Math.random() - .5) * 8, y: y + Math.random() * len, vx: -.06 - Math.random() * .1, vy: -.28 - Math.random() * .18 - .15 * burst, r: 6 + Math.random() * 5 + 4 * burst, g: .12 + Math.random() * .08, t: 0, life: 240 + Math.random() * 160, s: Math.random() * 6.28 }); }
  function fire(k = 1, atX = null) { flash = Math.max(flash, k); for (let v = 0; v < VENTS.length; v++) steamPuff(v, k); if (dark > .6 && HL.on) for (let i = Math.floor(Math.random() * 2.4 * k); i > 0; i--) boulder(); if (dark > .5 && HL.on) shed(3 + Math.floor(4 * k), 1);
    // LIGHTNING, TRACED FROM PHOTOGRAPHS (owner, build 207: "Lightning looks too crazy and unrealistic - maybe look for
    // lightning shots on web (free pics) and trace them"). Each flash takes one of four strikes traced from public-domain
    // NOAA photographs (Wikimedia Commons: "Lightning NOAA.jpg", "Cloud-to-ground lightning stroke - NOAA.jpg"): the bright
    // channels were found by their contrast with the sky round them, thinned to one-pixel lines and stored as lines of
    // points (x and y in parts of the strike's height, and how thick the channel was there). `BOLTS.big` is a great
    // branching strike, `a` and `b` single strokes, `side` a stroke running through the cloud. A strike is placed out of
    // the cloud over the summit, its foot on the rock, sometimes mirrored; it flickers as real strikes do (a stroke, a dim
    // moment, often a second stroke), `boltT` its age.
    // (build 213, owner: "The vertical lightnings look great - the horizontal ones do not look too good ... just remove those
    // horiz ones - do we need dark clouds that they are emerging from and should we make sure strands always end on top of
    // mountain?"): the stroke through the cloud is gone; every strike now comes down out of a dark storm cloud gathered over
    // the mountain (`stormCloud` in draw()), its lowest point is set exactly on the rock's top (`rockTopAt`), and any branch
    // that would run on into the rock stops at its surface
    { const pick = Math.random(), name = pick < .5 ? 'big' : pick < .75 ? 'a' : 'b', src = BOLTS[name], fl = Math.random() < .5 ? -1 : 1;
      const hxT = atX != null ? Math.max(40, Math.min(640, atX)) : 40 + Math.random() * 520, ox = hxT - 60, drop = Math.max(200, rockTopAt(hxT) + TOP + STORM_Y + 70), H = name === 'big' ? drop / .62 : drop * 1.15;
      let lines = src.map(l => { const pts = [], w = []; for (let i = 0; i < l.length; i += 3) { pts.push([ox + fl * l[i] * H, -STORM_Y - 70 + l[i + 1] * H]); w.push(l[i + 2]); } pts.w = w.reduce((a, b) => a + b, 0) / w.length; return pts; });
      // the lowest point of the strike lands on the rock (bolt points are from the summit: hill x = bx + 60, hill y = by - TOP)
      // (the big branching strike is made taller than the drop, so the rock's top cuts through its lower part, where its
      // branches fan out: they end on the rock; single strokes are set with their lowest point on the rock)
      // (build 250, owner: "can we make it that lighting exits from cloud where viewer clicks"): a touched strike leaves the
      // cloud straight above the touch: its top is moved there and the rest leans to meet its landing on the rock, which
      // stays where it was (over the touch where there is rock below, else at the rock's nearest edge)
      if (atX != null) { let tp = null, lo = null; for (const l of lines) for (const p of l) { if (!tp || p[1] < tp[1]) tp = p; if (!lo || p[1] > lo[1]) lo = p; }
        const dx = atX - 60 - tp[0], ty = tp[1], ly = lo[1]; for (const l of lines) for (const p of l) p[0] += dx * clamp((ly - p[1]) / Math.max(1, ly - ty)); }
      if (name !== 'big') { let lo = null; for (const l of lines) for (const p of l) if (!lo || p[1] > lo[1]) lo = p;
        const dy = rockTopAt(lo[0] + 60) + TOP - lo[1]; for (const l of lines) for (const p of l) p[1] += dy; }
      // cut every line at the rock's surface
      const cuts = []; for (const l of lines) { const cut = []; for (const p of l) { const g = rockTopAt(p[0] + 60) + TOP; if (p[1] > g + 1) { if (cut.length) cut.push([p[0], g]); break; } cut.push(p); } cut.w = l.w; cuts.push(cut); }
      // A STRAND MUST END ON THE ROCK: each branch is joined to the line it forks from (its first point lies on that line); a
      // line is kept if it reaches the rock itself or leads to a branch that does; a kept line that does not reach the rock is
      // trimmed back to its last fork that does, so no strand ends in the air (tiny forks excepted)
      const onRock = l => { const e = l[l.length - 1]; return e[1] >= rockTopAt(e[0] + 60) + TOP - 18; };
      const par = cuts.map((l, i) => { if (l.length < 2) return null; let best = null, bd = H * .03; const [fx, fy] = l[0];
        cuts.forEach((m, j) => { if (j === i || m.length < 2) return; m.forEach((p, q) => { const d = Math.abs(p[0] - fx) + Math.abs(p[1] - fy); if (d < bd) { bd = d; best = [j, q]; } }); }); return best; });
      const keepTo = cuts.map(l => l.length >= 2 && onRock(l) ? l.length - 1 : -1);
      for (let pass = 0; pass < 6; pass++) cuts.forEach((l, i) => { if (keepTo[i] >= 0 && par[i]) { const [j, q] = par[i]; if (keepTo[j] < q) keepTo[j] = q; } });
      // (build 306, owner: "flashes of lightning that are super small should be removed. only the ones that go from clouds to
      // mt should be preserved"): the tiny forks are no longer kept, and a line is kept only if, following the forks back up,
      // it comes from a line that starts up in the cloud (a fragment whose root starts low was a small floating flash)
      const topY = Math.min(...cuts.filter(l => l.length).map(l => l[0][1])), rootOK = i => { let r = i, n = 0; while (par[r] && n++ < 20) r = par[r][0]; return cuts[r].length > 1 && cuts[r][0][1] < topY + H * .12; };
      bolt = []; cuts.forEach((l, i) => { if (l.length < 2) return;
        const k2 = keepTo[i] >= 0 && rootOK(i) ? keepTo[i] : -1;
        if (k2 >= 1) { const t = l.slice(0, k2 + 1); t.w = l.w; bolt.push(t); } });
      boltT = 0; boltTwice = Math.random() < .6; } if (audio()) { sweep(64, 30, 1.8, .09 * k); hiss(190, .7, .11 * k, 1.6, 'lowpass'); hiss(900, 1, .03 * k, .5, 'bandpass', .05); } }
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
    Object.assign(C3, { x: START, face: 1, faceA: 1, anim: 12, sd: QUIET[0], alpha: 1, run: 0, ranim: RUNP_META.start || 0, weep: false, wt: 0, wa: 0, kf: 0, kp: 0, tv: null, fired: false, saidAt: 0, tapZ: 0 }); FLARES.length = 0;
    mercy = mercyTo = calm = calmTo = 0;
    mono = 1; gwReach = gwReachTo = 0; pullT = -1; GWFX = null; ARW.length = 0; wise = null; evan = null; dark = 0; hope = 0; flash = 0; flashT = 200; veil = 0; veilTo = 0; knocks = 0; knockT = 0; door = 0; doorTo = 0;
    reveal = 0; vil = vilTo = 0; pan = panTo = 0; ROCKS.length = 0; DUST.length = 0; PATHR.length = 0; DUSTW.length = 0; fallI = 0; jolt = 0; ROLL.length = 0; rollI = 0; LIZ.length = 0; oakT = 0; GLINTS.length = 0; for (const k in SEEN_G) delete SEEN_G[k]; OBIRD.length = 0; OLEAF.length = 0; HIDDEN.forEach(h => { h.got = 0; h.up = 0; h.y = 0; }); STEAMP.length = 0; farewell = 0; C3.dy = 0; cut = cutTo = 0; Zw = 0; zs = ''; zT = 0;
    saidSeen = saidHigh = hasteSaid = gateSaid = hillSeen = greeted = signSeen = false; stillT = 0; hintT = 0; noteI = 0; noteX = 0;
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
    if (ph !== 'plain') mono = 0;      // skip links into the rocks or the gate start out of the silver key
    if (at) { cam.cx = C3.x + 150; reveal = 1; if (at !== 'gate') { cam.z = Z_NEAR; cam.wl = 440 - (1 - Z_NEAR) * 70; } }
    G.state = 'wait'; setTimeout(() => { if (HL.on && G.state === 'wait') { G.state = ph === 'still' ? 'auto' : 'play'; } }, 1400);
  }
  function finish() {
    G.state = 'end'; G.ended = false;
    const e = document.getElementById('endc');
    e.querySelector('h1').textContent = 'At the gate';
    e.querySelectorAll('p')[0].textContent = 'He knocked, and one came to the gate, named Good-will.';
    e.querySelectorAll('p')[1].textContent = 'Next: the Interpreter\u2019s House';
    document.getElementById('on2').style.display = '';
  }
  function turnC(d, k = 1) { if (C3.face === d) return; if (TURN.length) C3.tv = { t: d > 0 ? 0 : TURN.length - 1, d, k }; else C3.face = d; }

  // where to touch, on the screen
  const hillPt = () => [hillBox[0] + 70 * hillBox[2], hillBox[1] - 250 * hillBox[2]];
  const gatePt = () => [(GATE_X - cam.cx) * cam.z + VW / 2, cam.wl - 70 * cam.z];
  // the stone over the gate, on the screen (for a touch)
  const signPt = () => [(GATE_X - cam.cx) * cam.z + VW / 2, cam.wl - (126 + 40 + 23 + 13) * cam.z, 70 * cam.z, 26 * cam.z];
  function touch(sx, sy) {
    if (ph === 'still' && zs === 'hold') { wideTouch(sx, sy); return; }
    if (!G.act) {
      if (ph === 'path') { if (hiddenTouch(sx, sy)) return;
        for (const L of LIZ) { const px = (L.x - cam.cx) * cam.z + VW / 2, py = cam.wl + L.y * cam.z; if (L.st === 'sit' && Math.hypot(sx - px, sy - py) < 30 + 30 * cam.z) { scurry(L); return; } } }
      if ((ph === 'plain' || ph === 'meet') && OAKBOX) { const [bx, by, bw, bh] = OAKBOX; if (sx > bx + bw * .08 && sx < bx + bw * .95 && sy > by + bh * .04 && sy < by + bh * .62) { oakTouch(sx, sy); return; } } }
    if ((ph === 'gate' || ph === 'knock' || ph === 'open') && typeof KS !== 'undefined' && KS.look) { const [x, y, w, h] = signPt(); if (Math.abs(sx - x) < w && Math.abs(sy - y) < h) { showSign(); return; } }
    if (G.act === 'hill') { const [hx, hy] = hillPt(); if (Math.hypot(sx - hx, (sy - hy) * .7) < 230 * hillBox[2] + 40) sawHill(); else G.actT = Math.max(G.actT, 129); return; }
    if (G.act === 'pull') { const p = gwHandPt(); if (p && Math.hypot(sx - p[0], sy - p[1]) < 60 + 110 * cam.z) doPull(); else G.actT = Math.max(G.actT, 59); return; }
    if (G.act === 'knock') { const [gx, gy] = gatePt(); if (Math.hypot(sx - gx, sy - gy) < 130) knock(); else G.actT = Math.max(G.actT, 89); return; }
    if (G.act === 'ehand') { const [hx, hy] = handPt(); if (Math.hypot(sx - hx, sy - hy) < 60 + 120 * cam.z) takeHand(); else G.actT = Math.max(G.actT, 59); return; }
  }
  // EVANGELIST'S HAND (owner, after build 364, idea B): "Evangelist caught him by the right hand" ({55}) is no longer told:
  // Evangelist reaches out his hand (`evan.g`, the reach of his Level 1 pointing, frames 40 to 58), and the child touches it;
  // a warm chord, and the light of mercy gathers on the two (an echo of Help's hand in the Slough)
  const handPt = () => [(EV_X + 58 - cam.cx) * cam.z + VW / 2, cam.wl - 95 * cam.z];
  // Good-will's reaching hand on the screen (the reaching picture's hand at picture 163, 140, drawn mirrored at GWFX)
  const gwHandPt = () => GWFX == null ? null : [(GWFX - (163 - GWRE_META.ax) * CHR_K * .86 - cam.cx) * cam.z + VW / 2, cam.wl + (140 - GWRE_META.ground) * CHR_K * .86 * cam.z];
  function doPull() {
    if (G.act !== 'pull' || pullT >= 0) return; G.ring = null; pullT = 0; pullX0 = C3.x;
    note(62, .035, 3); note(66, .03, 3, .1);
    for (let i = 0; i < 4; i++) ARW.push({ t: -[4, 16, 30, 46][i], i, sx: GATE_X - 650 + 30 * Math.random(), sy: -210 - 30 * Math.random(), tx: C3.x - 64 - 46 * i - 16 * Math.random(), ty: i === 2 ? -1 : -(60 + 90 * Math.random()), stuck: false, q: 0 });
  }
  function takeHand() { if (G.act !== 'ehand') return; note(67, .04, 4); note(71, .035, 4, .12); note(74, .03, 4, .24); mercyTo = 1; next(true); }
  // the wide picture answers a touch (build 237): the sky above the rock = a strike there; the rock = its nearest crack flares
  const FLARES = [];
  function wideTouch(sx, sy) { const [hx, hy, k] = hillBox, ux = (sx - hx) / k + HOX - HOX, uy = (sy - hy) / k; C3.tapZ = zT; clearHint('wide');
    const top = rockTopAt(ux);
    if (ux > -60 && ux < 700 && uy > top - 10) { let bi = 0, bd = 1e9; VENTS.forEach(([x, y], i) => { const d = Math.hypot(x - ux, y - uy); if (d < bd) { bd = d; bi = i; } });
      const [vx, vy, len] = VENTS[bi]; FLARES.push({ x: vx, y: vy + len * .4, t: 0 }); for (let j = 0; j < 4; j++) steamPuff(bi, 1.6);
      for (let j = 0; j < 14; j++) embers.push({ x: vx - 60 + (Math.random() - .5) * 20, y: vy + TOP + len * .3, vx: (Math.random() - .5) * .9, vy: -.6 - Math.random() * .9, r: .7 + Math.random(), h: Math.random(), t: 0, life: 90 + Math.random() * 80 });
      if (audio()) sweep(46 + Math.random() * 6, 30, 1.1, .07); }
    else { fire(.8, ux); flashT = Math.max(flashT, 90); } }
  // THE WORDS OVER THE GATE, CLOSE UP (build 217): a dressed stone, weathered, lit from the left by the lantern, Bunyan's
  // words cut into it in Roman capitals (incised: the cut's wall toward the light in shadow, the far wall catching it),
  // and his own margin reference, Matt. 7. 8 ({59}: "Now, over the gate there was written, 'Knock, and it shall be opened
  // unto you.' [Matt 7:8]"). Made once, the first time it is touched.
  function signPic() {
    const W = 1500, H = 600, cv = mk(W, H), q = cv.getContext('2d');
    q.fillStyle = 'rgb(150,140,126)'; q.fillRect(0, 0, W, H);
    // the stone's grain: the wall's photograph at two sizes (soft mottling and a finer pitted surface), then fine speckle
    if (GSTONE) { q.globalCompositeOperation = 'multiply'; q.globalAlpha = .16; q.drawImage(GSTONE, 0, 0, 512, 205, 0, 0, W, H); q.globalAlpha = .2; q.drawImage(GSTONE, 0, 300, 512, 205, 0, 0, W, H); q.globalAlpha = .42;
      for (let x = 0; x < W; x += 360) for (let y = 0; y < H; y += 360) q.drawImage(GSTONE, x, y, 360, 360); q.globalAlpha = 1; q.globalCompositeOperation = 'source-over'; }
    { const d = q.getImageData(0, 0, W, H), D = d.data, R = rngS(17); for (let i = 0; i < D.length; i += 4) { const n = (R() - .5) * 26 + (R() < .015 ? -40 * R() : 0); D[i] += n; D[i + 1] += n; D[i + 2] += n; } q.putImageData(d, 0, 0); }
    // chamfered edges: the stone's face, then its bevel lit on the top and left
    const B = 34; q.fillStyle = 'rgba(255,230,190,.16)'; q.beginPath(); q.moveTo(0, 0); q.lineTo(W, 0); q.lineTo(W - B, B); q.lineTo(B, B); q.lineTo(B, H - B); q.lineTo(0, H); q.fill();
    q.fillStyle = 'rgba(20,12,8,.32)'; q.beginPath(); q.moveTo(W, 0); q.lineTo(W, H); q.lineTo(0, H); q.lineTo(B, H - B); q.lineTo(W - B, H - B); q.lineTo(W - B, B); q.fill();
    // weathering: a few chips and dark stains, darker toward the foot where the rain runs down
    { const R = rngS(29); for (let i = 0; i < 26; i++) { const x = R() * W, y = R() < .5 ? R() * B * 1.4 : R() * H, r = 3 + R() * 14; q.fillStyle = `rgba(30,20,14,${.12 + R() * .2})`; q.beginPath(); for (let k = 0; k < 7; k++) { const a = k / 7 * 6.283, rr = r * (.6 + R() * .6); k ? q.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : q.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } q.fill(); }
      const g = q.createLinearGradient(0, H * .55, 0, H); g.addColorStop(0, 'rgba(40,30,22,0)'); g.addColorStop(1, 'rgba(40,30,22,.28)'); q.fillStyle = g; q.fillRect(0, 0, W, H); }
    // the letters, cut in: a V-cut groove, its upper-left wall in shadow, its lower-right wall catching the lantern
    const cut = (t, x, y, px, maxW) => { const f = n => `${n}px 'IM Fell English', Georgia, serif`; q.font = f(px); try { q.letterSpacing = (px * .1) + 'px'; } catch (e) {}
      const w0 = q.measureText(t).width; if (w0 > maxW) px *= maxW / w0;
      const L = mk(W, H), l = L.getContext('2d'); l.font = f(px); l.textAlign = 'center'; try { l.letterSpacing = (px * .1) + 'px'; } catch (e) {}
      const d = Math.max(2, px * .045);
      l.fillStyle = 'rgb(214,186,150)'; l.fillText(t, x, y);
      l.globalCompositeOperation = 'source-atop'; l.fillStyle = 'rgb(38,26,18)'; l.fillText(t, x - d, y - d);
      l.fillStyle = 'rgb(92,70,52)'; l.fillText(t, x + d * .35, y + d * .35);
      q.drawImage(L, 0, 0); };
    q.font = `112px 'IM Fell English', Georgia, serif`; try { q.letterSpacing = '11.2px'; } catch (e) {} const P = 112 * Math.min(1, (W - 2 * B - 150) / q.measureText('KNOCK, AND IT SHALL BE').width);
    cut('KNOCK, AND IT SHALL BE', W / 2, 270, P, 1e4); cut('OPENED UNTO YOU.', W / 2, 270 + P * 1.45, P, 1e4); cut('MATT. VII. 8.', W - 250, H - 74, 42, 400);
    // the lantern's light from the left, falling away to the right
    { q.globalCompositeOperation = 'multiply'; const g = q.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgb(255,232,196)'); g.addColorStop(.55, 'rgb(220,188,150)'); g.addColorStop(1, 'rgb(118,96,80)'); q.fillStyle = g; q.fillRect(0, 0, W, H);
      const v = q.createRadialGradient(W * .3, H * .4, H * .3, W * .5, H * .5, W * .7); v.addColorStop(0, 'rgb(255,255,255)'); v.addColorStop(1, 'rgb(150,120,100)'); q.fillStyle = v; q.fillRect(0, 0, W, H); q.globalCompositeOperation = 'source-over'; }
    return cv.toDataURL('image/jpeg', .9);
  }
  function showSign() {
    signSeen = true; const go = () => { if (!SIGNPIC) SIGNPIC = signPic(); KS.look(SIGNPIC); if (audio()) hiss(500, .5, .02, .2, 'bandpass'); };
    if (SIGNPIC || !document.fonts || !document.fonts.load) go(); else document.fonts.load(`118px 'IM Fell English'`).then(go, go);
  }
  function key() { if (G.act === 'hill') sawHill(); else if (G.act === 'pull') doPull(); else if (G.act === 'knock') knock(); else if (G.act === 'ehand') takeHand(); }

  // ---------- each tick ----------
  const frameOf = a => ((Math.floor(a) % CHR.length) + CHR.length) % CHR.length;
  // Christian walks (dir 1 or -1) at v, or stops as in Level 1: he finishes his stride to walk frame 28 or 1, where
  // his own stopping video joins on
  function walk(dir, v, vmax = MAXV) {
    const fr0 = frameOf(C3.anim);
    if (v) { if (C3.sd != null) { C3.sd = null; C3.anim = 1; } }
    else if (C3.sd == null) { if (fr0 === 28 || fr0 === 1 || !STD.length) C3.sd = fr0 === 28 ? 0 : STAND_FROM_1; else v = Math.max(.45, vmax); }
    C3.x += dir * v; C3.lastV = dir * v; C3.anim = stepAnim(C3.anim, v, CHR_STEP, CHR_META);
    const fr1 = frameOf(C3.anim);
    if (v && fr1 !== fr0 && CHR_META.rest.includes(fr1) && audio()) sfx.step(false, 1 + dark * .8);
    return v;
  }
  function update() {
    if (ph === 'title') { G.t % 14 || embers.push({ x: 20 + Math.random() * 70, y: 10 - Math.random() * 40, vx: -.25 - Math.random() * .5, vy: -.5 - Math.random() * .7, r: .8 + Math.random() * 1.3, h: Math.random(), t: 0, life: 140 + Math.random() * 160 }); for (const e of embers) { e.t++; e.x += e.vx; e.y += e.vy; } for (let i = embers.length - 1; i >= 0; i--) if (embers[i].t >= embers[i].life) embers.splice(i, 1); flashT--; if (flashT < 0) { fire(.5 + Math.random() * .4); flashT = 300 + Math.random() * 500; } flash *= .9; return; }
    const want = G.state === 'play' && (keys.r || held());
    { const plainish = ph === 'plain' || ph === 'meet' || ph === 'aside' || ph === 'down'; mono += ((plainish ? 1 : 0) - mono) * (plainish ? .02 : .2); }
    if (C3.sd != null) C3.sd += .4;
    C3.faceA = clamp(C3.faceA + (C3.face - C3.faceA) * .06, -1, 1);
    if (C3.tv) { C3.tv.t += C3.tv.d * TURN_META.step * C3.tv.k; if (C3.tv.t >= TURN.length - 1 || C3.tv.t <= 0) { C3.face = C3.faceA = C3.tv.d; C3.tv = null; } }
    C3.wa = clamp(C3.wa + (C3.weep || (wantNB && C3.kf > .5) ? .05 : -.04)); if (C3.weep) C3.wt = Math.min(64, C3.wt + WEEP_META.step);
    // the kneel: down at the video's own speed, then its breathing part eased back and forth (never faster than its own
    // speed); when he stands up it plays backwards from wherever it is
    if (wantNB && KNEEL.ready) {
      const st = KNEEL_META.step, [h0, h1] = KNEEL_META.hold;
      if (!C3.weep) { C3.kf = Math.max(0, C3.kf - st); C3.kp = 0; }
      else if (C3.kf < h0 && !C3.kp) C3.kf = Math.min(h0, C3.kf + st);
      else { C3.kp += st / 1.6; C3.kf = h0 + (h1 - h0) * (1 - Math.cos(C3.kp * Math.PI / (h1 - h0))) / 2; }
    }
    mercy += (mercyTo - mercy) * .012; calm += (calmTo - calm) * .008; if (ph === 'back') mercyTo = Math.min(mercyTo, .55); if (ph === 'mist') mercyTo = 0;      // (idea E) the light lingers where Evangelist stands as Christian hurries off
    flash *= .93; boltT++; if (boltT === 8 && boltTwice) flash = Math.max(flash, .55); door += (doorTo - door) * .02; cut = clamp(cut + Math.sign(cutTo - cut) * (cutTo ? .022 : .016)); veil = clamp(veil + Math.sign(veilTo - veil) * (C3.mistRun && veilTo ? .008 : .018));      // (build 405) a slower veil while he runs on into it
    hintT++;
    // (build 212, owner: "when we zoom over to mountain while worldly is talking it still flickers - can we make it solid"): the
    // mountain no longer fades in while the camera pans (half-seen, the ridges and sky showed through it as it slid); it is
    // simply there, solid, off to the right, and the pan brings it into view
    // (build 267) the camera has already come to the village when Wiseman names it, so at "Do you see that hill?" the hill
    // comes slowly up out of the haze behind it (about two and a half seconds) instead of all at once
    // (build 275, owner: "hill should be there from the beginning": the hill is always shown, out to the right)
    reveal = 1; vil = Math.min(1, vil + (vilTo - vil) * .012 + (vilTo > vil ? .002 : 0)); pan = Math.min(1, pan + (panTo - pan) * .012 + (panTo > pan ? .002 : 0));
    if ((ph === 'still' || ph === 'come' || ph === 'evan') && dark > .5 && Math.random() < .035) shed(1, .7);
    if (dark > .8 && (ph === 'still' || ph === 'come' || ph === 'evan' || farewell) && Math.random() < (zs === 'hold' || farewell ? .02 : .008)) boulder();
    for (const r of ROCKS) { r.t++; r.vy += .09; r.x += r.vx; r.y += r.vy; if (r.big && r.t % 5 === 0) dust(r.x, r.y, r.r * .9, 1, .5, 1);
      if (r.y >= 0) { r.done = 1; dust(r.x, 0, r.big ? r.r * 2.2 : 2 + r.r, r.big ? 6 : 2, r.big ? 1 : .5, r.big); } }
    for (let i = ROCKS.length - 1; i >= 0; i--) if (ROCKS[i].done) ROCKS.splice(i, 1);
    pathFalls(); rollers(); lizards(); oakLife(); hiddenLife(); glints(); padTick(); for (const d of DUSTW) { d.t++; d.x += d.vx; d.y += d.vy; d.r += .04; } for (let i = DUSTW.length - 1; i >= 0; i--) if (DUSTW[i].t >= DUSTW[i].life) DUSTW.splice(i, 1);
    for (const d of DUST) { d.t++; d.x += d.vx; d.y += d.vy; d.vx *= .99; d.r += d.g; } for (let i = DUST.length - 1; i >= 0; i--) if (DUST[i].t >= DUST[i].life) DUST.splice(i, 1);
    if (dark > .4 && Math.random() < .07 * dark) embers.push({ x: 20 + Math.random() * 70, y: 10 - Math.random() * 40, vx: -.2 - Math.random() * .4, vy: -.35 - Math.random() * .5, r: .6 + Math.random() * .8, h: Math.random(), t: 0, life: 140 + Math.random() * 160 });
    if (dark > .3 && ph !== 'title') { for (let v = 0; v < VENTS.length; v++) if (Math.random() < (.035 + .015 * Math.sin(G.t / 47 + v * 1.7)) * dark) steamPuff(v); }
    for (const p of STEAMP) { p.t++; p.x += p.vx + .05 * Math.sin(p.t / 40 + p.s); p.y += p.vy; p.vy *= .997; p.r += p.g; }
    for (let i = STEAMP.length - 1; i >= 0; i--) if (STEAMP[i].t >= STEAMP[i].life) STEAMP.splice(i, 1);
    for (const f of FLARES) f.t++; for (let i = FLARES.length - 1; i >= 0; i--) if (FLARES[i].t > 150) FLARES.splice(i, 1);
    for (const e of embers) { e.t++; e.x += e.vx + .3 * Math.sin((e.t + e.life) / 23); e.y += e.vy; } for (let i = embers.length - 1; i >= 0; i--) if (embers[i].t >= embers[i].life) embers.splice(i, 1);

    if (ph === 'plain') {
      let v = want ? MAXV : 0; if (v && C3.x + v >= MEET) v = 0;
      v = walk(1, v);
      if (want) clearHint('walk'); else if (hintT === 400 && C3.x < START + 20) hint('walk', 'Hold to walk.');
      // build 149: Wiseman starts far enough off that he is seen coming across the field (before, he appeared already
      // past his meeting place and stood behind Christian's stopping place, so the two ended back to back)
      if (!saidSeen && C3.x > START + 30) { saidSeen = true; caption(SEEN); wise = { x: Math.max(cam.cx + VW / 2 / cam.z + 60, MEET + 508), anim: 0, mode: 'come', st: 0, alpha: 1 }; }
      if (wise && !greeted && wise.x - C3.x < 520) { greeted = true; caption(GREET); sweet(0); }
      if (wise && greeted && wise.mode === 'stand' && wise.st >= 1 && C3.x >= MEET - 30 && C3.sd != null && !saying()) { ph = 'meet'; talk(WISE, () => { ph = 'aside'; wise.mode = 'go'; hintT = 0; noteX = C3.x + 60; caption(TURNED); }); }
    } else if (ph === 'meet') {
      walk(1, 0);
    } else if (ph === 'aside') {
      // OVER THE BROW AND DOWN OUT OF SIGHT: past BROW0 the way falls away behind the near edge of the ground; he goes
      // down it, feet first, then his body, then his head (drawn lower by C3.dy, and the near ground drawn over him)
      let v = want ? MAXV * lerp(1, .8, smooth(BROW0, BROW1, C3.x)) : 0;
      v = walk(1, v);
      C3.dy = C3.x < CREST ? -crest(C3.x) - (12 - pathOff(C3.x)) : -crest(CREST) - 10 + 227 * Math.pow(smooth(CREST, BROW1, C3.x), 1.3);      // (build 202: one smooth descent from the top; see the near ground below)
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
      // (build 237, owner: "Can we speed up his pace a little - kinda takes awhile to get across screen"): a third quicker
      // on the path, and it slows less toward the foot
      const heavy = 1.3 * lerp(1, .7, smooth(FOOT - 700, FOOT - 20, C3.x));
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
      // (idea A) the overhang creaks and a few small stones come down beside him before the words, close up
      if (stillT === 6) { jolt = Math.max(jolt, .5); if (audio()) { sweep(40, 28, 1.6, .09); hiss(260, 1.2, .05, 1.2, 'lowpass'); } }
      if ([6, 28, 44, 66, 92].includes(stillT)) { const i = [6, 28, 44, 66, 92].indexOf(stillT);
        PATHR.push({ x: C3.x + 60 + i * 30 + Math.random() * 20, y: -330 - Math.random() * 40, vx: -(.15 + Math.random() * .25), vy: 0, r: 3.5 + Math.random() * 3, big: 0, b: 0, t: 0, s: Math.random() * 6, sh: rockShape() }); }
      if (stillT === 30 && !saidHigh) { saidHigh = true; caption(HIGH); }
      if (stillT > 9999) { stillT = 9999; zs = 'done'; }
      if (zs === '' && stillT >= 120) { zs = 'out'; zT = 0; }
      if (zs === 'out') { zT++; Zw = ease5(clamp(zT / 175)); if (zT === 162) fire(1.1); if (zT >= 175) { zs = 'hold'; zT = 0; } }
      else if (zs === 'hold') { zT++; const t = dlg.querySelector('.t').textContent, said = C3.fired && !saying() && G.cap <= 0 && !G.capQ.length;
        // (build 237, owner: "When we're zoomed out can we pause for a bit and viewer can click cloud or cracks of fire to make
        // effects"): once the words are said the wide picture waits (`tapZ`): at least about eight seconds more, longer
        // while the child keeps touching the cloud (a strike comes down there) or the burning rock (the nearest crack flares)
        if (said && !C3.saidAt) { C3.saidAt = zT; G.hint = 'wide'; words('', 'Touch the cloud, or the fire in the rock.', 'cap hint'); document.body.classList.add('capped'); }
        if (said && zT - C3.saidAt > 260 && zT - (C3.tapZ || 0) > 200 || said && zT - C3.saidAt > 1000 || zT > 2400) { zs = 'in'; zT = 0; clearHint('wide'); } }
      else if (zs === 'in') { zT++; Zw = 1 - ease5(clamp(zT / 140)); if (zT >= 140) { zs = 'done'; Zw = 0; } }
      // the lines' own happenings (captions carry no fn): the fire comes with its words
      if (dlg.querySelector('.t').textContent.startsWith('The hill hung') && !C3.fired) { C3.fired = true; fire(1); }
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
      if (want && !hasteSaid) { hasteSaid = true; caption(HASTE); backFallT = 40; }
      // (idea D) as he hurries back, stones come down behind him, where he has just been
      if (hasteSaid && go && --backFallT < 0) { backFallT = 70 + Math.random() * 90; const big = Math.random() < .3 ? 1 : 0;
        PATHR.push({ x: C3.x + 180 + Math.random() * 140, y: -520 - Math.random() * 120, vx: -(.3 + Math.random() * .4), vy: 0, r: big ? 12 + Math.random() * 4 : 3 + Math.random() * 3, big, b: 0, t: 0, s: Math.random() * 6, sh: rockShape() }); }
      if (go && RUNP.ready) { const st = RUNP_META.vpx * CHR_K; C3.x -= st * .4; C3.ranim += .4; C3.run = clamp(C3.run + .14); C3.sd = QUIET[0]; if (Math.floor(C3.ranim) % 14 === 0 && Math.floor(C3.ranim - .4) % 14 !== 0 && audio()) sfx.step(false, 1.3); }
      else { C3.run = clamp(C3.run - .1); if (go) walk(-1, MAXV); else if (C3.sd == null) walk(-1, 0); }
      if (want) clearHint('haste'); else if (hintT === 150) hint('haste', 'Hold to hurry back.');
      // (build 405, owner: "when Charles leaves mountain out zooms out again... please re[move] this zoom ... just have him running
      // and as he runs it fades out (don't let him stop running as it fades out)"): no second pull back (`farewell` is no
      // longer started); near the start of the path, while he runs, the veil of mist comes and he runs on into it by
      // himself (`C3.mistRun`) until it has covered everything; if he had stopped short of it, the mist comes as before
      if (C3.x <= PATH0 + 360 && (C3.run > .5 || (C3.x <= PATH0 + 120 && C3.run <= 0 && !saying() && G.cap <= 0))) { C3.mistRun = C3.run > .5; ph = 'mist'; veilTo = 1; G.state = 'auto'; clearHint('haste'); }
    } else if (ph === 'mist') {
      if (farewell) farewell++;
      if (C3.mistRun && RUNP.ready) { const st = RUNP_META.vpx * CHR_K; C3.x -= st * .4; C3.ranim += .4; C3.run = 1; C3.sd = QUIET[0]; if (Math.floor(C3.ranim) % 14 === 0 && Math.floor(C3.ranim - .4) % 14 !== 0 && audio()) sfx.step(false, 1.3); }
      if (veil >= 1) { C3.mistRun = false; C3.run = 0; Zw = 0; ph = 'gate'; C3.x = GATE_FROM; C3.face = C3.faceA = 1; C3.sd = QUIET[0]; cam.cx = C3.x + 150; cam.z = 1; cam.wl = 440; dark = 0; hope = 1; evan = null; wise = null; veilTo = 0; G.state = 'play'; hintT = 0; }
    } else if (ph === 'gate') {
      let v = want ? MAXV : 0; if (v && C3.x + v >= GATE_STOP) v = 0;
      if (v && saying() && !gateSaid) v = 0;
      v = walk(1, v);
      if (!gateSaid && C3.x > GATE_FROM + 140) { gateSaid = true; caption(ATGATE); }
      if (want) clearHint('walk'); else if (hintT === 400) hint('walk', 'Hold to walk.');
      if (C3.x >= GATE_STOP - 30 && C3.sd != null && gateSaid && !saying() && G.cap <= 0) { ph = 'knock'; clearHint('walk'); talk(KNOCK, () => { ph = 'open'; G.state = 'auto'; stillT = 0; }); }
    } else if (ph === 'knock') {
      walk(1, 0); knockT++;
      // the pull: Christian drawn a little way in through the gate, quickly, as by a strong hand
      if (pullT >= 0) { pullT++; C3.x = pullX0 + 14 * smooth(0, 1, Math.min(1, pullT / 22)); if (pullT === 90) { gwReachTo = 0; next(true); } }
      if (G.act === 'knock' && knocks >= 3 && knockT > 50) { RIGHT.forEach((m, i) => note(m, .04, 3, i * .34)); next(true); }
    } else if (ph === 'open') {
      if (++stillT > 280 && G.state !== 'end') finish();
    }

    // what the child is asked to do, shown after a while
    if (G.state === 'dialog' && G.act === 'hill') { G.actT++; if (G.actT === 130) { dMore.textContent = 'touch the hill ✦'; G.ring = hillPt; } }
    if (G.state === 'dialog' && G.act === 'knock') { G.actT++; if (G.actT === 90 && knocks < 3) { dMore.textContent = 'knock on the gate ✦'; G.ring = gatePt; } }
    if (G.state === 'dialog' && G.act === 'pull' && pullT < 0) { G.actT++; if (G.actT === 60) { dMore.textContent = 'take his hand ✦'; G.ring = gwHandPt; } }
    gwReach += Math.sign(gwReachTo - gwReach) * Math.min(Math.abs(gwReachTo - gwReach), 1 / 8);
    for (const a of ARW) { if (a.stuck) { a.q *= .9; continue; } if (++a.t === 0 && audio()) hiss(2600, 1.2, .03, .45, 'bandpass'); if (a.t >= 24) { a.stuck = true; a.q = 1; if (audio()) { sweep(240, 110, .07, .1); hiss(1400, 1.5, .04, .05); } } }
    if (G.state === 'dialog' && G.act === 'ehand') { G.actT++; if (G.actT === 60) { dMore.textContent = 'touch his hand ✦'; G.ring = handPt; } }
    // his hand comes out and goes back at the video's own pace (52 of its frames, about two seconds each way)
    if (evan) { evan.g = evan.g || 0; const gt = evan.gTo || 0; evan.g += Math.sign(gt - evan.g) * Math.min(Math.abs(gt - evan.g), 1 / 130);
      if (evan.bye && evan.g >= .69) { evan.gTo = 0; evan.bye = 0; } }

    // Mr. Worldly Wiseman crosses the field to meet him, stands, and afterwards goes on his own way
    if (wise) {
      const { M } = wFig(), v = WIS.ready ? WIS_V : 1.25, st = M.vpx * CHR_K;
      if (wise.mode === 'come') { if (wise.x > MEET + 135) { wise.x -= v; wise.anim = stepAnim(wise.anim, v, st, M); } else { wise.anim = stepAnim(wise.anim, 0, st, M); if (M.rest.includes(Math.floor(wise.anim) % M.frames)) wise.mode = 'stand'; } }
      else if (wise.mode === 'stand') wise.st = clamp(wise.st + .05);
      else if (wise.mode === 'go') { wise.st = clamp(wise.st - .06); if (wise.st <= 0) { wise.x -= v; wise.anim = stepAnim(wise.anim, v, st, M); wise.alpha = clamp((wise.x - (MEET - 760)) / 260); if (wise.alpha <= 0) wise = null; } }
    }

    // the sky darkens as he goes out of the way, and clears as he comes back; fire out of the hill while he stands under it
    const dTo = farewell && ph !== 'gate' && ph !== 'knock' && ph !== 'open' ? .9 : ph === 'aside' || ph === 'down' ? .35 * smooth(MEET + 150, BROW1, C3.x) : ph === 'path' ? lerp(.55, 1, smooth(PATH0, FOOT - 200, C3.x)) : ph === 'back' || ph === 'mist' ? lerp(.45, 1, smooth(PATH0, FOOT, C3.x)) : ph === 'still' || ph === 'come' || ph === 'evan' ? 1 : 0;
    dark += (dTo - dark) * .03;
    // (build 202, owner: "more lightning please"): flashes come every one to two and a half seconds while the whole mountain is
    // seen, every three to six at the foot
    if (ph === 'still' || ph === 'come' || ph === 'evan') { if (--flashT < 0 && (zs === 'done' || zs === 'hold') && calmTo < .5) { fire(ph === 'evan' ? .45 : .7 + Math.random() * .3); flashT = zs === 'hold' && ph === 'still' ? 60 + Math.random() * 90 : (ph === 'evan' ? 600 : 200) + Math.random() * 300; } }
    // far off too, while Wiseman points to it and as he turns aside toward it: now and then a distant flash over the summit
    if ((G.act === 'hill' || ph === 'aside' || ph === 'down') && --flashT < 0) { fire(.4 + Math.random() * .2); flashT = 160 + Math.random() * 220; }
    if (farewell && (ph === 'back' || ph === 'mist') && --flashT < 0) { fire(.55 + Math.random() * .3); flashT = 70 + Math.random() * 110; }

    // the camera
    let tx = C3.x + 150, tz = 1;
    if (ph === 'plain') tz = wise ? .84 : .9;
    if (ph === 'meet') { const e = pan * pan * (3 - 2 * pan); tx = lerp(C3.x + 60, HILL_F + 160, e); tz = lerp(.86, .6, e); }
    if (ph === 'aside' || ph === 'down') { tx = Math.min(C3.x + 180, BROW0 + 140); tz = .86; }
    if (ph === 'path') { tx = C3.x + 150; tz = Z_NEAR; }
    if (ph === 'still' || ph === 'come' || ph === 'evan') { tx = ph === 'still' ? FOOT + 150 : FOOT - 40; tz = Z_NEAR; }
    if (ph === 'back' || ph === 'mist') { tx = C3.x - 150; tz = Z_NEAR; }
    if (ph === 'gate' || ph === 'knock' || ph === 'open') { tx = Math.min(C3.x + 150, GATE_X - 215); tz = lerp(1, .96, smooth(GATE_X - 500, GATE_STOP, C3.x)); }
    cam.cx += (tx - cam.cx) * .035; cam.z += (tz - cam.z) * .03; cam.wl = 440 - (1 - cam.z) * 70 + (ph === 'meet' ? 64 * smooth(.84, .58, cam.z) : 0);      // (build 267: looking far off to the village and the hill, the road sinks so it no longer fills a quarter of the picture)
    // the pull back (see 'still'): the scale goes from close to the whole mountain in its logarithm; he slides a little
    // left of the middle; the road comes down so the summit and its cloud fit above
    if (farewell && (ph === 'back' || ph === 'mist')) { const Zf = ease5(clamp((farewell - 20) / 190)), zz = Math.exp(lerp(Math.log(Z_NEAR), Math.log(Z_WIDE), Zf)), sx = lerp(VW / 2 + 150 * Z_NEAR, VW * .2, Zf);
      Zw = Zf; cam.z = zz; cam.cx = C3.x - (sx - VW / 2) / zz; cam.wl = lerp(440 - (1 - Z_NEAR) * 70, 470, Zf); }
    if (ph === 'still' && Zw > 0) { const zz = Math.exp(lerp(Math.log(Z_NEAR), Math.log(Z_WIDE), Zw)), sx = lerp(VW / 2 - 150 * Z_NEAR, VW * .29, Zw);
      cam.z = zz; cam.cx = FOOT - (sx - VW / 2) / zz; cam.wl = lerp(440 - (1 - Z_NEAR) * 70, 470, Zw); }
  }

  // ---------- drawing ----------
  // Evangelist standing, or reaching out his hand (`evan.g` 0..1: frames 40 to 58 of his Level 1 pointing, facing right)
  function evFig(c, x, tint, a) {
    if (evan.g > .01 && EVA.ready) figure(c, 'evan', EVA[atTime(EVA_META, 130 + 52 * evan.g)], EVA_META, x, 1, tint, a);
    else figure(c, 'evan', EVS[Math.floor(G.t * .2) % EVS_META.frames], EVS_META, x, 1, tint, a); }
  function drawChr(c, tint) {
    if (ph === 'title') return;
    TALKM = talkMove(C);
    // he trembles beneath the hill (a small quick shiver while he stands under it, before Evangelist raises him)
    const trem = (ph === 'still' || ph === 'come') ? dark : 0, a = C3.alpha, x = C3.x + trem * (.55 * Math.sin(G.t * .9) + .3 * Math.sin(G.t * 2.1));
    // (build 282: the shadow thins away as he reaches the top of the brow, where the near ground starts to cover him)
    foot(c, C3.x, a * (ph === 'aside' || ph === 'down' ? 1 - smooth(CREST - 160, CREST - 10, C3.x) : 1));
    if (C3.tv && TURN.length) {
      const tf = clamp(C3.tv.t, 0, TURN.length - 1), f0 = Math.floor(tf);
      figure(c, 'turn', TURN[f0], TURN_META, x, 1, tint, a);
      if (f0 + 1 < TURN.length && tf - f0 > .02) figure(c, 'turn2', TURN[f0 + 1], TURN_META, x, 1, tint, a * (tf - f0));
      TALKM = null; return;
    }
    const wa = WEEP.ready || (wantNB && KNEEL.ready) ? smooth(0, 1, C3.wa) : 0, ra = RUNP.ready ? C3.run : 0, rest = a * (1 - ra);
    if (wa > 0 && wantNB && KNEEL.ready) {
      const kf = clamp(C3.kf, 0, KNEEL.length - 1), f0 = Math.floor(kf), ka = a * smooth(0, .6, wa);
      FK = kneelK(kf); figure(c, 'weep', KNEEL[f0], KNEEL_META, x, C3.face, tint, ka);
      if (f0 + 1 < KNEEL.length && kf - f0 > .02) figure(c, 'weep2', KNEEL[f0 + 1], KNEEL_META, x, C3.face, tint, ka * (kf - f0)); FK = 1;
    } else if (wa > 0 && wantNB && STD.length) {
      // build 267: no book after Level 1, so instead of opening his book and weeping he bows low and trembles at Evangelist's
      // feet: his quiet standing picture leaned forward from his feet and pressed down a little, shaking
      const bw = smooth(0, 1, wa), im = STD[atTime(STD_META, breathT(QUIET[0] + G.t * .4))];
      c.save(); c.translate(x, FY); c.rotate(C3.face * .3 * bw); c.translate(-x, -FY);
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
    // (build 245, owner: "the blue shale layer and other layers in the zoomed in view shouldn't continue across page when we
    // zoom out but taper off quickly"): the slate path and the haze over it lie only along his stretch of the path (`inPath`,
    // by where they are in the world); `alongPath` lays a drawing through a soft mask across the picture made from it
    const inPath = x => smooth(PATH0 - 900, PATH0 - 300, x) * (1 - smooth(FOOT + 250, FOOT + 800, x)), wxAt = sx => cx + (sx - VW / 2) / z;
    const alongPath = (fn, drawQ) => { const o = tintC.wb || (tintC.wb = mk(8, 8)); if (o.width !== Math.ceil(VW) || o.height !== Math.ceil(VH)) { o.width = Math.ceil(VW); o.height = Math.ceil(VH); }
      const q = o.getContext('2d'); q.globalCompositeOperation = 'source-over'; q.globalAlpha = 1; q.clearRect(0, 0, VW, VH); drawQ(q);
      const g = q.createLinearGradient(0, 0, VW, 0); for (let i = 0; i <= 48; i++) g.addColorStop(i / 48, 'rgba(0,0,0,' + clamp(fn(wxAt(VW * i / 48))).toFixed(3) + ')');
      q.globalCompositeOperation = 'destination-in'; q.fillStyle = g; q.fillRect(0, 0, VW, VH); q.globalCompositeOperation = 'source-over'; c.drawImage(o, 0, 0); };
    const gateish = smooth(0, 1, hope);
    // THE GROUND TREMBLES under the hill: a low steady rumble and a stronger jolt at each flash (the picture is drawn a
    // hair larger so its edges never show)
    { const near = (ph === 'still' || ph === 'come' || ph === 'evan') ? dark : 0, F0 = Math.min(1, flash) * near, sh = (.35 * near * (1 - calm) + 2.6 * F0) + 2.4 * jolt;
      if (sh > .05) { const shx = sh * (Math.sin(G.t * 1.7) + .6 * Math.sin(G.t * 3.1)) * .6, shy = sh * Math.sin(G.t * 2.3) * .5, m = 1.01; c.setTransform(S * m, 0, 0, S * m, S * (shx - VW * (m - 1) / 2), S * (shy - VH * (m - 1) / 2)); }
      else c.setTransform(S, 0, 0, S, 0, 0); }
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.imageSmoothingEnabled = true;
    // the sky: a fair day over the plain, a heavy red-brown dark by the hill, a warmer morning at the gate
    const top = mix(mix(mix([104, 134, 160], [15, 14, 20], gateish), [32, 32, 44], dark), [22, 11, 8], .75 * gateish), low = mix(mix(mix([255, 228, 168], [50, 40, 40], gateish), [124, 94, 88], dark), [74, 34, 22], .75 * gateish);
    { const g = c.createLinearGradient(0, 0, 0, hor), fairK = (1 - dark) * (1 - gateish); g.addColorStop(0, css(top)); g.addColorStop(.58, css(mix(mix(top, low, .62), [240, 208, 186], .5 * fairK))); g.addColorStop(1, css(low)); c.fillStyle = g; c.fillRect(0, 0, VW, hor + 2); }
    // clouds, pale by day and heavy near the hill
    { const off = ((cx * .05 + G.t * .02) % 800 + 800) % 800;
      for (let i = -1; i < 2; i++) { const x0 = i * 800 - off + 200;
        // (build 174: with the sun low behind them the clouds are grey-violet above and bright along their lower edges:
        // the warm copy is laid first, a little lower, and the grey one over it)
        { const fa = (1 - dark) * (1 - .9 * gateish); c.globalAlpha = Math.min(1, .8 * fa); c.drawImage(CLOUDW, x0, 39, 800, 180); c.globalAlpha = .62 * fa; c.drawImage(CLOUDG, x0, 30, 800, 180); }
        if (dark > .02) { c.globalAlpha = .55 * dark; c.globalCompositeOperation = 'multiply'; c.drawImage(CLOUD, x0 - 260, 0, 900, 230); c.globalCompositeOperation = 'source-over'; } }
      c.globalAlpha = 1; }
    // BIRDS (build 267): now and then a small loose flock crosses the evening sky, slowly, low over the far ridges; dark
    // little strokes, their wings beating and gliding. The one living touch in the sky, only on the fair plain.
    { const bk = (1 - dark) * (1 - gateish) * (ph === 'plain' ? 1 : 0); if (bk > .02) { const P = 1500, T = (G.t + 1150) % P, u = T / 1100;
        if (u < 1) { c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; const n = Math.floor((G.t + 1150) / P), bx = lerp(-80, VW + 80, u) - (cx * .03) % 40, by = hor - 150 * z - 40 * Math.sin(n * 2.3) * z - 18 * u * z;
          for (let i = 0; i < 3; i++) { const fx = bx - (i * 34 + 8 * Math.sin(i * 3.1 + n)) * z, fy = by + (i * 9 + 4 * Math.sin(i * 1.7 + n)) * z + 2 * Math.sin(G.t / 60 + i) * z, w = (3.4 + i * .5) * z * .8;
            const beat = .45 + .55 * Math.sin(G.t / 8 + i * 1.9), glide = Math.sin(G.t / 90 + i) > .2, f = glide ? .35 : beat;
            c.strokeStyle = css([52, 46, 50], .8 * bk * Math.min(1, 6 * u, 6 * (1 - u))); c.lineWidth = Math.max(.7, .95 * z);
            c.beginPath(); c.moveTo(fx - w, fy - f * w * .7); c.quadraticCurveTo(fx - w * .4, fy - w * .25, fx, fy); c.quadraticCurveTo(fx + w * .4, fy - w * .25, fx + w, fy - f * w * .7); c.stroke(); }
          c.restore(); } } }
    // the far light: ahead of him on the plain; over the gate at the end. The hill, drawn after it, comes between.
    const rocky = ph === 'path' || ph === 'still' || ph === 'come' || ph === 'evan' || ph === 'back' || ph === 'mist' || ph === 'title';
    FY = rocky || gateish > .5 ? 5 : 12;
    // (idea D) as he looks back from the start of the path, the far light he left shows again low on the left, the way back
    const fw = farewell && ph !== 'gate' ? smooth(100, 300, farewell) : 0;
    const lx = lerp(lerp(VW * .5, VW * .07, fw), clamp(X(GATE_X), 200, VW - 120), gateish), ly = lerp(lerp(hor - 96, hor - 30, fw), Y(-262), gateish), la = (1 - .35 * dark * (1 - fw)) * (1 - gateish) * (rocky ? .8 * fw : 1);
    // AMONG THE ROCKS (build 185; owner: "we need a surrounding of rockiness, not just ground then big rock"). Every layer
    // becomes rock, each one clean shape of one tone, pale far and dark near: the far ridges of the mountain's roots,
    // the crags behind the path, the stony path, and the nearest crags along the bottom of the picture, sliding past
    // faster than he does and now and then hiding his feet (owner: yes). The crags rise as he goes (low boulders and
    // open sky at first; rock up to the top of the picture at the foot); the edges that face the hidden fire ahead
    // catch a thin warm light.
    // THE CRAGS ARE THE MOUNTAIN'S OWN ROOTS (owner, build 190: "The crags might be a little sharp and too geometric - need a
    // little more natural flow to them - also more cohesion with mountain"). Each outline is a row of SPURS at uneven
    // places (`crag`), each one a small copy of the mountain's breaking wave: a steep face on the left, a rounded shoulder,
    // a long slope down to the right; they overlap, and a broad slow swell runs under them, so the line flows, with only
    // now and then a taller spur. They are filled with the painted mountain's own rock (`ROCKTEX`, laid over in
    // 'overlay', so faint cracks and blocks show in the layer's one tone) and coloured its warm brown-black. Only the
    // highest faces turned toward the fire catch a thin warm edge. At the foot the crags behind him run up into the
    // mountain as one long slope of fallen rock (`scree`).
    const crag = (L, seed, seg, pin, fl = 1, wk = 1) => { const i = Math.floor(L / seg), hs = (j, q) => { const v = Math.sin(j * 127.1 + seed * 311.7 + q * 74.7) * 43758.5453; return v - Math.floor(v); };
      let H = fl * (.34 + .3 * nz(L * .0011, seed + 5));
      for (let j = i - 4; j <= i + 1; j++) { const xc = (j + .15 + .7 * hs(j, 0)) * seg, h = (.42 + .5 * hs(j, 2)) * (pin && hs(j, 3) < .14 ? 1.25 : 1), w = seg * (1.8 + 2.2 * hs(j, 1)) * (.55 + .9 * h) * (wk < 1 ? wk * (.65 + .9 * hs(j, 6)) : 1), u = (L - xc) / w;
        if (u < -.12 || u > 1) continue;
        // a steep face on the left, a short rounded brow, then a long fall to the right broken by one or two ledges
        const ld = .4 + .3 * hs(j, 4), br = .14 + .14 * hs(j, 5) + (wk < 1 ? .04 + .12 * hs(j, 7) : 0), f = u < 0 ? Math.pow(smooth(-.12, 0, u), .6) : u < br ? 1 - (wk < 1 ? .32 : .1) * (u / br) * (u / br) : .9 * Math.pow(1 - (u - br) / (1 - br), 1.2) - .07 * smooth(ld - .03, ld + .03, u) * (1 - u) * 2;
        H = Math.max(H, h * f); }
      return H + (nz(L * .022, seed) - .5) * .05 + (nz(L * .06, seed + 2) - .5) * .035 + (nz(L * .2, seed + 4) - .5) * .012; };
    const burnR = clamp(dark) * (1 - .6 * calm);
    let MIDPTS = null;
    const crags = (p, seed, seg, base, hLo, hHi, col, edge, pin, tex, scree, clear, fl = 1, wk = 1) => {
      // (build 325, owner: "when it zooms out there's a parallax like effect with the rocks around him as they scale differently
      // than mountain on zoom"): while the camera pulls back every layer moves with the mountain (parallax 1)
      p = lerp(p, 1, smooth(0, .12, Zw));
      const Ls = FOOT + p * (PATH0 - 700 - FOOT), L0 = FOOT + p * (cx - FOOT), pts = [];
      // (build 325, owner: "the sharp dark rocks in foreground flicker some as christian walks"): the outline is sampled at
      // fixed places on the land (a step in whole powers of two), not at fixed places on the screen, so it does not shimmer
      const du = Math.pow(2, Math.round(Math.log2(4 / z))), La = Math.floor((L0 - (VW / 2 + 12) / z) / du) * du;
      for (let L = La; ; L += du) { const sx = VW / 2 + (L - L0) * z; if (sx > VW + 12 + du * z) break; const env = lerp(hLo, hHi, Math.pow(smooth(Ls, FOOT, L), 1.2));
        // (build 202, owner: "the rock around him only need to be around that little area not extend to the whole base of the
        // mountain. looks strange as a line"): the rocks stand only along the stretch of his path, by where they are in the
        // world (`wx`), dying away a little before the path's start and soon past the mountain's foot
        const wx = cx + (sx - VW / 2) / z, tl = smooth(PATH0 - 1700, PATH0 - 500, wx) * (1 - smooth(FOOT + 350, FOOT + 1300, wx));
        let h = env * crag(L, seed, seg, pin, fl, wk); if (scree) h = Math.max(h, scree * Math.pow(smooth(FOOT - 300, FOOT + 650, L), 1.6) * (.94 + .1 * nz(L * .01, seed)));
        h *= tl; if (clear) h *= lerp(.26, 1, smooth(170, 480, Math.abs(wx - clear)));
        pts.push([sx, Y(base) - h * z, h / Math.max(env, 1)]); }
      const path = () => { c.beginPath(); c.moveTo(-12, VH + 10); for (const [x, y] of pts) c.lineTo(x, y); c.lineTo(VW + 12, VH + 10); };
      if (scree) MIDPTS = pts;
      c.fillStyle = css(col); path(); c.fill();
      if (tex && ROCKPAT) { c.save(); path(); c.clip(); const ts = 2.2 * z, tw = ROCKTEX.width * ts; ROCKPAT.setTransform(new DOMMatrix([ts, 0, 0, ts, ((VW / 2 - L0 * z) % tw + tw) % tw, Y(base) - 900 * z]));
        c.globalCompositeOperation = 'overlay'; c.globalAlpha = tex; c.fillStyle = ROCKPAT; c.fillRect(0, 0, VW, VH); c.restore(); }
      // build 217 (owner: "The top of the rocks in the mountain scene have light lining - doesn't seem appropriate here"):
      // the warm line along the crag tops is off (the fire is hidden behind them: their tops face away from it)
      edge = 0;
      if (edge > .01) { c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round'; c.lineWidth = 1.2;
        for (let j = 1; j < pts.length; j++) { const [x0, y0, r0] = pts[j - 1], [x1, y1, r1] = pts[j], k2 = smooth(.62, .85, Math.min(r0, r1)) * clamp((y1 - y0 - .3) / 1.5); if (k2 < .05) continue;
          c.strokeStyle = css([236, 156, 100], edge * k2); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); } c.restore(); } };
    { const g = c.createRadialGradient(lx, ly, 0, lx, ly, 330); g.addColorStop(0, css([255, 236, 190], .85 * la)); g.addColorStop(.12, css([255, 222, 160], .5 * la)); g.addColorStop(.45, css([255, 214, 150], .16 * la)); g.addColorStop(1, css([255, 214, 150], 0));
      c.fillStyle = g; c.fillRect(lx - 330, ly - 330, 660, 660); c.fillStyle = css([255, 248, 226], la); c.beginPath(); c.arc(lx, ly, 7 + 1.2 * Math.sin(G.t / 40), 0, 7); c.fill(); }
    // the far ridge (among the rocks: the far crags instead, and the fire's light in the sky ahead)
    if (rocky) {
      { c.save(); c.globalCompositeOperation = 'screen'; const gx = VW * .8, gy = -40, rr = VW * .8, g = c.createRadialGradient(gx, gy, 0, gx, gy, rr), a = .34 * burnR * (1 - Zw);
        g.addColorStop(0, css([240, 150, 96], a)); g.addColorStop(.4, css([170, 80, 64], a * .45)); g.addColorStop(1, css([120, 50, 50], 0)); c.fillStyle = g; c.fillRect(0, 0, VW, VH); c.restore(); }
      crags(.35, 3, 300, -140, 50, 300, mix(mix(low, top, .35), [92, 72, 66], .45), .14 * burnR, false, .18);
    } else { const col = mix(mix(mix(low, top, .45), [150, 138, 160], .5 * (1 - dark) * (1 - gateish)), [60, 52, 60], dark * .6); c.fillStyle = css(col); c.beginPath(); c.moveTo(0, hor + 2);
      // (build 202, owner: "when you first see mountain it flickers"): the ridges' outline is sampled at fixed places on the
      // land (`ridge`), not at fixed places on the screen, so it no longer wobbles as the camera pans
      const ridge = (par, f) => { const du = 14, u0 = Math.floor((cx * par - VW / 2 / z) / du) * du; for (let u = u0; u <= cx * par + VW / 2 / z + du; u += du) c.lineTo(VW / 2 + (u - cx * par) * z, hor - f(u) * z * .8); };
      ridge(.1, u => 26 + 96 * nz(u * .0035, 5) + 22 * nz2(u * .02, 1));
      c.lineTo(VW, hor + 2); c.fill();
      // FOOTHILLS: a nearer, lower line of hills in front of the far ridge. At first they are all there is to see where
      // the hill will be (the hill is not shown until Wiseman points to it: see `reveal`)
      c.fillStyle = css(mix(col, mix([98, 112, 126], [44, 40, 48], dark), .5)); c.beginPath(); c.moveTo(0, hor + 2);
      ridge(.2, u => 6 + 50 * nz(u * .005, 9) + 12 * nz2(u * .026, 4));
      c.lineTo(VW, hor + 2); c.fill(); }
    // the plain, from the horizon down to the road
    { const far = mix(mix([214, 196, 138], [50, 48, 56], gateish), [78, 68, 70], dark), near = mix(mix([52, 54, 40], [24, 24, 32], gateish), [38, 36, 44], dark);
      // THE PLAIN IN LAYERS (build 267; owner: "opening is a little plain - what could we do to make this beautiful while
      // maintaining simplicity"). Not one smooth wash any more but the game's own layered look: three long low swells of
      // field one behind another, each a shade darker than the one behind, the low sun catching their crests in a thin
      // line of light, and a breath of haze lying in the hollow behind each. Sampled at fixed places on the land, so they
      // slide with the camera like the ridges and do not wobble. `plainFill(y0)` lays the plain below y0 (again below the
      // far mountain's foot, where its painting's flat bottom edge must be covered).
      const colAt = t => t < .35 ? mix(far, mix(far, near, .5), t / .35) : mix(mix(far, near, .5), near, (t - .35) / .65);
      const fairP = (1 - dark) * (1 - gateish), SW = [];
      const plainFill = y0 => { c.save(); c.beginPath(); c.rect(0, y0, VW, Y(0) - y0 + 2); c.clip();
        const g = c.createLinearGradient(0, hor, 0, Y(0)); g.addColorStop(0, css(far)); g.addColorStop(.35, css(mix(far, near, .5))); g.addColorStop(1, css(near)); c.fillStyle = g; c.fillRect(0, hor, VW, Y(0) - hor + 1);
        if (!rocky) for (const [t, par, amp, sd] of SW) { const by = lerp(hor, Y(0), t), du = 16, u0 = Math.floor((cx * par - VW / 2 / z) / du) * du - du, pts = [];
          for (let u = u0; u <= cx * par + VW / 2 / z + 2 * du; u += du) pts.push([VW / 2 + (u - cx * par) * z, by - amp * z * Math.max(-.4, 2.2 * (nz(u * .0011, sd) - .5) + .9 * (nz2(u * .0043, sd) - .5) + .3)]);
          // the haze lying in the hollow behind this swell
          if (fairP > .02) { const hh = 16 * z, mg = c.createLinearGradient(0, by - amp * z - hh, 0, by + 2 * z); mg.addColorStop(0, css(low, 0)); mg.addColorStop(.7, css(mix(low, far, .4), .34 * fairP)); mg.addColorStop(1, css(mix(low, far, .4), .38 * fairP)); c.fillStyle = mg; c.fillRect(0, by - amp * z - hh, VW, hh + amp * z + 2 * z); }
          const c0 = mix(colAt(t - .04), [20, 22, 16], .03 + .03 * t), c1 = mix(colAt(Math.min(1, t + .14)), [20, 22, 16], .03 + .03 * t), lg = c.createLinearGradient(0, by - amp * z, 0, by + (Y(0) - hor) * .2);
          lg.addColorStop(0, css(c0)); lg.addColorStop(1, css(c1)); c.fillStyle = lg; c.beginPath(); c.moveTo(pts[0][0], Y(0) + 2); for (const [x, y] of pts) c.lineTo(x, y); c.lineTo(pts[pts.length - 1][0], Y(0) + 2); c.fill();
          // the low sun on the crest: a thin warm line, brighter toward the sun and where the swell rises
          if (fairP > .02) { c.save(); c.globalCompositeOperation = 'lighter'; c.lineWidth = Math.max(.6, (1.3 - .5 * t) * z); c.lineJoin = 'round';
            const sg = c.createLinearGradient(0, 0, VW, 0); for (let i = 0; i <= 64; i++) { const sx = VW * i / 64, d2 = Math.abs(sx - lx) / VW, on = smooth(.46, .62, nz2((cx * par + (sx - VW / 2) / z) * .0024, sd + 4)); sg.addColorStop(i / 64, css([255, 220, 160], (.34 - .3 * t) * fairP * Math.max(0, 1 - 1.4 * d2) * on)); }
            c.strokeStyle = sg; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y + .6) : c.moveTo(x, y + .6)); c.stroke(); c.restore(); } }
        c.restore(); };
      plainFill(hor);
      { const fk = (1 - dark) * (1 - gateish); if (fk > .02) { const hg = c.createLinearGradient(0, hor - 64 * z, 0, hor + 30 * z); hg.addColorStop(0, css(low, 0)); hg.addColorStop(.4, css(low, .2 * fk)); hg.addColorStop(.68, css(low, .52 * fk)); hg.addColorStop(1, css(low, 0)); c.fillStyle = hg; c.fillRect(0, hor - 64 * z, VW, 94 * z); } }
      // THE HILL IS NOT SEEN UNTIL WISEMAN POINTS (owner, build 185: "let's hide it entirely till worldly wise tells him to
      // look and then screen pans right and we see it"). On the plain it stands far off to the right (HILL_F), out of the
      // picture until the camera pans to it at "Do you see that hill?", and comes out of the haze as it does (`reveal`).
      // Among the rocks it is the mountain itself, at its true size (HSN), its foot just beyond the end of the path.
      const ap = rocky ? 1 : 0;
      const hx = rocky ? X(HX0) : VW / 2 + (HILL_F - cx) * PH * z, hy = rocky ? Y(6) : Y(HILL_Y), k = rocky ? z * HSN : .6 * HSF;      // (build 275: on the plain the far mountain keeps one size as the camera moves, as a far thing does)
      HL.appr = ap;
      hillBox = [hx, hy, k];
      // THE VILLAGE BEHIND THE HILL (build 286, owner: "the little town looks too idylic ... smaller house (maintain scale
      // from when christian is near mountain) ... maybe put town beyond mountain, peaking out from behind mountain on the
      // left"): smaller, further off and hazier, drawn before the hill so the mountain's left foot hides its right part
      // ROCKY GROUND ROUND THE VILLAGE (build 297, owner: "can you put some rocky terrain around town to justify why christian
      // was going through rocky terrain to get there"): the mountain's own spurs (`crag`, the same breaking-wave outline as
      // the rocky path's crags), small and hazed far off: a back row rising behind the village toward the mountain, and a
      // lower, darker front row across its foot and out to the left, both hidden on the right by the mountain's foot
      // (build 300, owner: "a little more variety of rock and connecting to mountain"): three rows, each with spurs of uneven
      // width and now and then a taller one, rising toward the right and running on in under the mountain's foot
      const FR = [{ u0: -620, u1: 320, b: -40, h: 72, seg: 55, sd: 53, wk: .7, col: [108, 94, 100] }, { u0: -540, u1: 300, b: -20, h: 48, seg: 32, sd: 61, wk: .6, col: [96, 82, 88] }, { u0: -690, u1: 140, b: -2, h: 34, seg: 22, sd: 71, wk: .55, col: [82, 70, 76] },
        // (build 301, owner: "maybe a add the big rock on the left to what you have too. and some rocks to cover the left corner of town a little and blend into rock"): build 297's one broad rock on the left, behind everything, and a few rocks drawn over the village's left corner
        { u0: -600, u1: 20, b: -36, h: 80, seg: 70, sd: 53, wk: 1, col: [104, 90, 96], one: 1 }, { u0: -330, u1: -160, b: -50, h: 40, seg: 18, sd: 83, wk: .6, col: [100, 86, 92], one: 1, fade: 50 }];
      const farRocks = (li, va, hz) => { const L = FR[li], u0 = L.u0, u1 = L.u1, base = hy + L.b * k, hgt = L.h * k, seg = L.seg, sd = L.sd, front = li === 2, fl = L.one ? 0 : 1, fd = L.fade || 120;
        const col = mix(mix(L.col, hz, .2), mix([58, 50, 52], [30, 27, 32], dark), dark * .6), g = c.createLinearGradient(hx + u0 * k, 0, hx + u1 * k, 0);
        g.addColorStop(0, css(col, 0)); g.addColorStop(.2, css(col, va)); g.addColorStop(1, css(col, va)); c.fillStyle = g;
        c.beginPath(); c.moveTo(hx + u0 * k, base + 2 * k); for (let u = u0; u <= u1; u += 2) { const e = L.one ? smooth(u0, u0 + fd, u) * smooth(u1, u1 - fd, u) : smooth(u0, u0 + 120, u) * (.45 + .85 * smooth(u0, 60, u)) + (li === 2 ? 0 : .5 * smooth(-200, 200, u)); c.lineTo(hx + u * k, base - hgt * e * Math.max(crag(u + 4000, sd, seg, !L.one, .6, L.wk), li === 2 || L.one ? 0 : .85 * smooth(-280, -50, u))); }
        c.lineTo(hx + u1 * k, base + 2 * k); c.closePath(); c.fill();
        // the plain's haze over their foot, so they stand in it
        const fg = c.createLinearGradient(0, base - hgt * .3, 0, base + 2 * k), fc = colAt(clamp((base - hor) / (Y(0) - hor))); fg.addColorStop(0, css(fc, 0)); fg.addColorStop(1, css(fc, .7 * va));
        c.fillStyle = fg; c.fillRect(hx + u0 * k, base - hgt * .3, (u1 - u0) * k, hgt * .3 + 2 * k); };
      const villageBehind = () => { if (!rocky && VILP) { const W2 = VILP.width, H2 = VILP.height, tw = 388 * k, th = tw * H2 / W2, tx = hx - 309 * k, ty = hy - 6 * k, va = Math.max(reveal, vil);
        if (va > .01 && tx < VW && tx + tw > 0) { const tc = tintC.vil || (tintC.vil = mk(W2, H2)), t = tc.getContext('2d'), hz = mix(mix(far, low, .3), [60, 54, 62], dark * .7);
          t.globalCompositeOperation = 'source-over'; t.globalAlpha = 1; t.clearRect(0, 0, W2, H2); t.drawImage(VILP, 0, 0);
          t.globalCompositeOperation = 'source-atop'; t.fillStyle = css(hz, .5 + .2 * dark); t.fillRect(0, 0, W2, H2);
          const fh = t.createLinearGradient(0, H2 * .5, 0, H2); fh.addColorStop(0, css(colAt(clamp((ty - hor) / (Y(0) - hor))), 0)); fh.addColorStop(1, css(colAt(clamp((ty - hor) / (Y(0) - hor))), .85)); t.fillStyle = fh; t.fillRect(0, H2 * .5, W2, H2);
          farRocks(3, va, hz); farRocks(0, va, hz); farRocks(1, va, hz); t.globalCompositeOperation = 'source-over'; c.globalAlpha = va; c.drawImage(tc, tx, ty - th, tw, th); c.globalAlpha = 1; farRocks(4, va, hz); farRocks(2, va, hz); } } };
      if ((rocky || reveal > .002) && hx > -1300 * k && hx < VW + 400 * k) {
        // AWE FIRST (owner, build 135: "the burning hill can be frightening - but most importantly stunning - it should
        // awe first"). After John Martin's pictures of the sublime and the book's own Sinai (Exodus 19: fire at the top,
        // thick cloud, lightnings): the hill is far taller than the people, black against a fire that burns at its
        // summit inside a towering cloud; the fire lights the cloud from within, runs down the overhanging face as a
        // thin burning edge, and lies as a red sheen on the plain. A flash adds lightning in the cloud and fire in
        // the cracks. Everything grows with `dark` (0 far off on a fair day .. 1 beneath it).
        // (build 202, owner: "can we put more smoke from mountain when we first see and maybe some clouds in the sky above"): far off
        // on the fair plain the mountain already burns a little (`farK`): a faint glow, a fuller plume and cloud gathering over it
        const farK = rocky ? 0 : .4 * reveal, sx0 = hx + 60 * k, sy0 = hy - TOP * k, burn = Math.max(dark, farK) * (.72 + .18 * Math.sin(G.t / 53) + .1 * Math.sin(G.t / 17) * dark) * (1 - .6 * calm), F = Math.min(1, flash);
        let flames = null;
        // the fire behind the summit: the hill is cut out black against it
        if (burn > .01) { c.save(); c.globalCompositeOperation = 'screen';
          const g = c.createRadialGradient(sx0, sy0 + 40 * k, 0, sx0, sy0 + 40 * k, 620 * k); g.addColorStop(0, css([255, 224, 176], .8 * burn)); g.addColorStop(.12, css([246, 170, 110], .5 * burn)); g.addColorStop(.42, css([176, 92, 70], .24 * burn)); g.addColorStop(1, css([110, 50, 50], 0));
          c.fillStyle = g; c.fillRect(sx0 - 620 * k, sy0 - 580 * k, 1240 * k, 1240 * k); c.restore(); }
        // (build 218) the canopy of round billows (151) and the layers of smoke (203) are gone: one cloud ceiling, drawn after the strikes (below)
        // the hill: fair and far off at first, black under its own cloud when he stands by it
        const dx = hx - HOX * k, dy = hy - HOY * k;
        // A CRISP EDGE UP CLOSE (owner, build 192: "The faded edge of the mountain in background is kinda bothering me"):
        // the painting's own soft edge, with a pale rim the image model painted along it, was blown up about three times
        // among the rocks and read as a blurred halo. There the hill's outline is drawn from its own shape (`hillPath`)
        // in the dark rock's tone, sharp, and the painting is laid inside it, kept a few units in from the edge. Only the
        // overhanging face is done so (`facePath`): elsewhere the painting's own outline differs a little from the drawn one.
        if (rocky) { c.fillStyle = css(mix([46, 36, 36], [33, 25, 26], dark)); facePath(c, hx, hy, k, 0, 30); c.fill(); c.save(); facePath(c, hx, hy, k, 2, 3000, 400); c.clip(); }
        villageBehind();
        c.globalAlpha = reveal; c.drawImage(!rocky && HILLV ? HILLV : HILL[0], dx, dy, HW * k, HH * k); if (dark > .01) { c.globalAlpha = dark; c.drawImage(HILL[1], dx, dy, HW * k, HH * k); }
        if (rocky) c.restore(); c.globalAlpha = 1;
        // (build 295) a soft breath of mist where the village meets the mountain's left foot, so the two edges never meet bare
        if (!rocky && VILP) { const mx = hx + 10 * k, my = hy - 34 * k, mc = mix(mix(far, low, .3), [60, 54, 62], dark * .7); c.save(); c.translate(mx, my); c.scale(120 * k, 40 * k);
          const mg = c.createRadialGradient(0, 0, 0, 0, 0, 1); mg.addColorStop(0, css(mc, .55 * (1 - dark * .5))); mg.addColorStop(.5, css(mc, .3 * (1 - dark * .5))); mg.addColorStop(1, css(mc, 0)); c.fillStyle = mg; c.fillRect(-1, -1, 2, 2); c.restore(); }
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
          if (STEAMP.length) { if (!STEAMC) { const mkB = col => { const b = mk(64, 64), q = b.getContext('2d'), g = q.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, css(col, .5)); g.addColorStop(.45, css(col, .32)); g.addColorStop(1, css(col, 0)); q.fillStyle = g; q.fillRect(0, 0, 64, 64); return b; }; STEAMC = [mkB([226, 150, 104]), mkB([118, 106, 108])]; }
            c.save();
            for (const p of STEAMP) { const u = p.t / p.life, a = smooth(0, .3, u) * (1 - smooth(.45, 1, u)) * inRock(p.x, p.y, p.r * 1.4) * (burn * .38 + .12) * (rocky ? 1 : reveal * .6);
              if (a < .006) continue; const px = hx + p.x * k, py = hy + p.y * k, rr = p.r * k, rx = rr * (1.5 + .25 * Math.sin(p.s + p.t / 60)), w = smooth(.1, .5, u);
              c.globalAlpha = Math.min(1, a * .4 * (1 - w)); c.drawImage(STEAMC[0], px - rx, py - rr, 2 * rx, 2 * rr); c.globalAlpha = Math.min(1, a * .55 * w); c.drawImage(STEAMC[1], px - rx, py - rr, 2 * rx, 2 * rr); }
            c.restore(); }
          if (LAVA) { const al = Math.min(.75, (burn * .55 + .6 * F) * (.75 + .25 * Math.sin(G.t / 47))) * reveal; c.globalAlpha = al; c.drawImage(LAVA, dx, dy, HW * k, HH * k); c.globalAlpha = al * .7; c.drawImage(LAVAB, dx, dy, HW * k, HH * k); c.globalAlpha = 1; }
          // a touched crack flares (build 237): a hot bloom over it that swells and dies away in two and a half seconds
          for (const f of FLARES) { const u = f.t / 150, al = Math.sin(Math.PI * Math.min(1, u * 3)) * (1 - u) + (1 - u) * .25, px = hx + f.x * k, py = hy + f.y * k, rr = (30 + 40 * u) * k;
            c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(px, py, 0, px, py, rr); g.addColorStop(0, css([255, 230, 170], .9 * al)); g.addColorStop(.3, css([255, 160, 80], .5 * al)); g.addColorStop(1, css([240, 100, 50], 0)); c.fillStyle = g; c.fillRect(px - rr, py - rr, 2 * rr, 2 * rr); c.restore(); }
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
        c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
        if (flames) { c.save(); c.globalCompositeOperation = 'lighter'; flames(); c.restore(); }
        // lightning in the cloud, and sparks carried up
        c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = c.lineJoin = 'round';
        if (bolt && boltT < 40) { const t = boltT, vis = t < 4 ? 1 : t < 8 ? .18 : boltTwice && t < 13 ? .85 : boltTwice && t < 18 ? .35 : Math.max(0, .25 - (t - 18) * .02);
          if (vis > .02) for (const [w, al, col] of [[11, .06, [200, 170, 255]], [4, .16, [230, 210, 255]], [1.3, .95, [255, 252, 245]]]) for (const ln of bolt) { const lw = .35 + .65 * ln.w; c.strokeStyle = css(col, Math.min(1, al * vis * (.45 + .55 * ln.w))); c.lineWidth = Math.max(.6, w * lw * Math.min(k, 1.1)); c.beginPath(); ln.forEach(([bx, by], j) => j ? c.lineTo(sx0 + bx * k, sy0 + by * k) : c.moveTo(sx0 + bx * k, sy0 + by * k)); c.stroke(); } }
        // ONE CLOUD CEILING (build 218): the storm deck lies across the top of the sky, one continuous dark body with a slow
        // ragged underside; the summit's smoke rises into it, the strikes come down out of it (its base below where each
        // strike begins), the fire lights its underside above the summit and a strike lights it from within. The sky
        // below it stays open and glowing down to the horizon, so the black mountain reads (John Martin). Far off on the
        // fair plain it is a pale lid in the haze lying over the far mountain only; as he turns aside it darkens and
        // spreads over the whole sky. Two tiles, the nearer darker and a little lower, drift slowly left with the wind.
        let deckWisp = null;
        // the columns' shapes are also laid in `SMK` (builds 244, 248), so no light of the cloud shows through them
        const SMKC = tintC.smk || (tintC.smk = [mk(8, 8), mk(8, 8)]); for (const o of SMKC) if (o.width !== Math.ceil(VW) || o.height !== Math.ceil(VH)) { o.width = Math.ceil(VW); o.height = Math.ceil(VH); }
        const SMK = SMKC[0], SMK3 = SMKC[1], qs = SMK.getContext('2d'); qs.clearRect(0, 0, VW, VH);
        // (build 233, owner: "Can we make another column going up from other lit up spot at peak of mt"): a second, slimmer
        // column rises from the brightest fire just right of the summit (hill x 205, on the rock's top), a little out of step
        // (build 248) the billows are denser, so the glow behind them no longer shows through (`DENSE`)
        const DENSE = 1.9;
        // (build 306, owner: "tweak the billows a little and make a little elongated horizontally"): each billow drawn wider and
        // flatter (3.2 by 1.4 of its radius, was 2.6 by 1.6) and strayed a little further to the sides
        // (build 326, owner: "the interiors of the plumes of smoke look good but the edges could be a little more diffuse"): the
        // billows toward a column's sides (`eg`, by how far out each strays) are drawn larger and fainter, so the edge melts
        const EDGE = 1;
        // the columns: [hill x from the summit, billows, width, phase]; (build 326, owner: "maybe we add one more plume"): a
        // third, smaller and younger, from the right shoulder, so the three step down from the summit
        const PLUMES = [[0, 96, 1, 0], [145, 64, .78, .37], [255, 44, .6, .71, 1], [-48, 48, .62, .19, 1, 1.9]];
        // (build 332, owner: "the far left plume edges should be more diffuse"): a plume's 6th entry (`E`) widens the band of
        // billows counted as its edge; since build 335 those edge billows turn into soft blurred copies (`dB`), not larger wisps
        // (build 328, owner: "maybe one more plume to the left exiting near the light on the left of the top"): a fourth, small,
        // from the left shoulder just below the light at the left of the top, with its own small fire
        // (build 340, owner: "can detail in plumes extend a bit higher and can they light up (like the bottom of sky) when lightning
        // flashes"): the billows keep their shape further up (they fade from .56 of their rise, was .5; .62 in build 339 was too high), and a strike lights
        // them as it lights the cloud's underside: near the strike, more the higher they are (`sL`, `P.s`, laid on in 'lighter')
        const flS = bolt && boltT < 20 ? (boltT < 4 ? 1 : boltT < 8 ? .2 : boltTwice && boltT < 14 ? .8 : .1) : 0, bxS = bolt && bolt[0] ? sx0 + bolt[0][0][0] * k : 0;
        // (build 346, owner: "need more continuity and a little less detail - think big picture and maybe find some pictures of
        // smoke from forest fire (or volcano) and how it billows"; after the 1980 Mount St Helens photograph (USGS, public
        // domain): one continuous mass, big lobes made of smaller lumps, widening, then spreading flat under the overcast):
        // (1) a soft body under each column (`cols('body')`, the blurred billows, larger), so no sky shows between billows;
        // (2) fewer, larger billows (.78 of them, 1.15 the size), each part blurred (`gB` at least .3), so less fine detail;
        // (3) the columns lean together as they rise (toward the summit's, .88 of the way by .55 of the rise) and merge;
        // (4) near the top they spread wide (`um`, up to 2.2 times), the umbrella under the cloud
        const cols = mask => { for (const [ox, N, sp, ph0, gl, E = 1] of PLUMES) { const ps = [], kS = Math.min(k, 1), Dh = rocky ? 195 : 90 + 105 * clamp(dark * 1.5), bx0 = sx0 + ox * k, by0 = ox ? hy + (rockTopAt(60 + ox) + 6) * k : sy0, dTop = (by0 - sy0) / kS;
          for (let i = 0, N2 = Math.round(N * .78); i < N2; i++) { const h1 = Math.sin(i * 12.9898 + ox) * 43758.5453, h2 = Math.sin(i * 78.233 + ox) * 12543.123; ps.push([(i / N2 + G.t / 2600 + ph0) % 1, h1 - Math.floor(h1), h2 - Math.floor(h2), i]); }
          ps.sort((a, b) => b[0] - a[0]);
          // (build 326) the third column rises from a small fire of its own in a cleft of the shoulder
          if ((!mask || mask === 'body') && gl && burn + F > .02 && mask !== 'body') { const R = 16 * k, g = c.createRadialGradient(bx0, by0 + 4 * k, 0, bx0, by0 + 4 * k, R); g.addColorStop(0, css([255, 214, 150], .7 * (burn + .5 * F) * reveal)); g.addColorStop(.3, css([240, 140, 80], .35 * (burn + .5 * F) * reveal)); g.addColorStop(1, css([200, 90, 60], 0));
            c.globalCompositeOperation = 'lighter'; c.globalAlpha = 1; c.fillStyle = g; c.fillRect(bx0 - R, by0 + 4 * k - R, 2 * R, 2 * R); c.globalCompositeOperation = 'source-over'; }
          for (const [u, r1, r2, i] of ps) { const rise = 1 - Math.pow(1 - u, 1.6), um = smooth(.5, .9, u), spread = (24 + 120 * u) * kS * sp * (1 + 1.2 * um), px = bx0 - (50 * u + 110 * u * u) * kS + (sx0 - bx0) * .88 * smooth(.08, .55, u) + (r1 - .5) * spread * 1.2 + 12 * Math.sin(G.t / 300 + i) * u * kS, py = by0 - (14 + (Dh + 90 + dTop) * rise) * kS + (r2 - .5) * spread * .65, eg = Math.pow(Math.abs(r1 - .5) * 2, 1.5 / E) * EDGE, rr = (26 + 120 * u) * kS * sp * (.8 + .4 * r2) * (1 + .3 * E * eg) * 1.15, a = smooth(0, .05, u) * (1 - smooth(.56, .95, u)) * (1 - Math.min(.5, .25 * E * eg)), P = PUFF[i % 3], gB = P.dB ? Math.max(.3, Math.min(1, eg * E * 1.1)) : 0, X0 = px - rr * 1.65, Y0 = py - rr * 1.2, W0 = 3.3 * rr, H0 = 2.4 * rr;
            const hzP = rocky ? 0 : clamp(1 - dark * 1.6), aP = a * .7 * (.1 + .75 * Math.max(dark, farK * 1.3)) * reveal;
            // (build 342, owner: "the top where plumes meet clouds could use a little more detail (seems too monochromatic)"): the
            // upper billows are laid once more, faintly, over the front of the cloud: their dark rolls and a paler, warmer
            // underside a little below each, so the columns' shapes and a little colour carry on up into the cloud
            // (build 346) the body: every billow's blurred copy laid first, larger, so the column is one continuous mass
            if (mask === 'body') { if (!P.dB) continue; const A = Math.min(1, aP * DENSE) * (1 - hzP); c.globalCompositeOperation = 'source-over'; c.globalAlpha = A * .5; c.drawImage(P.dB, px - rr * 1.95, py - rr * 1.4, 3.9 * rr, 2.8 * rr); if (hzP > 0) { c.globalAlpha = aP * hzP * .5; c.drawImage(P.hB, px - rr * 1.95, py - rr * 1.4, 3.9 * rr, 2.8 * rr); } continue; }
            if (mask === 'top') { const t = smooth(.42, .56, u) * (1 - smooth(.66, .82, u)); if (t < .02) continue; const A = Math.min(1, aP * DENSE) * (1 - hzP) * t; c.globalCompositeOperation = 'source-over';
              c.globalAlpha = A * .34; c.drawImage(P.dB || P.d, X0, Y0, W0, H0);
              c.globalAlpha = A * .14; c.drawImage(P.pB || P.p, px - rr * 1.4, py - rr * .9, 2.8 * rr, 1.9 * rr);
              const lt = (burn * .35 + F * .4 + flS * Math.max(0, 1 - Math.abs(px - bxS) / (650 * k))) * t * a; if (lt > .01) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, lt * .3); c.drawImage(P.l, px - rr, py - rr * .7, 2 * rr, 1.6 * rr); }
              continue; }
            if (mask) { const mA = Math.min(1, aP * 3); qs.globalAlpha = mA * (1 - gB); qs.drawImage(P.d, px - rr * 1.1, py - rr * .8, 2.2 * rr, 1.6 * rr); if (gB > 0) { qs.globalAlpha = mA * gB; qs.drawImage(P.dB, X0, Y0, W0, H0); } continue; }
            c.globalCompositeOperation = 'source-over'; const dr = (im, imB, al) => { c.globalAlpha = al * (1 - gB); c.drawImage(im, px - rr * 1.1, py - rr * .8, 2.2 * rr, 1.6 * rr); if (gB > 0) { c.globalAlpha = al * gB; c.drawImage(imB, X0, Y0, W0, H0); } }; if (hzP > 0) dr(P.h, P.hB, aP * hzP); const lo = 1 - smooth(.04, .42, u), A = Math.min(1, aP * DENSE) * (1 - hzP); dr(P.d, P.dB, A * (1 - .4 * lo)); if (lo > .01) dr(P.p, P.pB, A * lo * .75);
            const la = a * (burn * (.3 + .7 * Math.pow(1 - u, 2)) + F * .3 * (1 - u)); if (la > .01) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = la; c.drawImage(P.l, px - rr, py - rr * .8, 2 * rr, 1.6 * rr); }
            const sL = flS * Math.min(1, a * 1.6) * Math.max(0, 1 - Math.abs(px - bxS) / (650 * k)) * (.4 + .6 * smooth(.1, .7, u)) * (rocky ? 1 : .6); if (sL > .01 && P.s) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, sL * .55); c.drawImage(P.s, px - rr * 1.1, py - rr * .8, 2.2 * rr, 1.6 * rr); } } } };
        // (build 248, owner: "The light still shines thru billows - don't like that"): the columns' shapes are laid in the mask
        // first, so the light on the cloud's underside behind them (fire and strike) is cut out where the smoke stands
        cols(true);
        { const sK = Math.min(1, Math.max(dark * (rocky ? 1.5 : 1), farK * 1.6)), hzS = rocky ? 0 : clamp(1 - dark * 1.6), spread = rocky ? 1 : clamp(dark * 1.8);
          if (sK > .03 && DECK) { c.globalCompositeOperation = 'source-over';
            // its base: above the summit by B; close among the rocks (the summit far above the picture) it hangs as a ceiling
            // across the top of the picture instead (`ceil`), and the two meet as the camera draws back
            const kD = Math.min(k, 2.2), B = (rocky ? 175 : 70 + 105 * clamp(dark * 1.5)) * k, ceil = rocky ? VH * .13 : -1e9, bx = bolt && bolt[0] ? sx0 + bolt[0][0][0] * k : 0;
            const fl = bolt && boltT < 20 ? (boltT < 4 ? 1 : boltT < 8 ? .2 : boltTwice && boltT < 14 ? .8 : .1) : 0;
            const OC = tintC.deck || (tintC.deck = [mk(8, 8), mk(8, 8)]), [D1, D2] = OC; for (const o of OC) if (o.width !== Math.ceil(VW) || o.height !== Math.ceil(VH)) { o.width = Math.ceil(VW); o.height = Math.ceil(VH); }
            const q1 = D1.getContext('2d'), q2 = D2.getContext('2d');
            // a soft mask across the picture, from a function of x (the lid far off; where the firelight falls)
            const across = (q, fn) => { const g = q.createLinearGradient(0, 0, VW, 0); for (let i = 0; i <= 32; i++) g.addColorStop(i / 32, 'rgba(0,0,0,' + clamp(fn(VW * i / 32)).toFixed(3) + ')'); q.globalCompositeOperation = 'destination-in'; q.fillStyle = g; q.fillRect(0, 0, VW, VH); q.globalCompositeOperation = 'source-over'; };
            const lid = x => spread + (1 - spread) * (1 - smooth(520 * k, 1250 * k, Math.abs(x - sx0)));
            const fireAt = x => (burn * .45 * Math.max(0, 1 - Math.abs(x - sx0) / (330 * k)) + .1 * F) * (1 - .5 * hzS), strikeAt = x => fl * .75 * Math.max(0, 1 - Math.abs(x - bx) / (420 * k)) * (1 - .5 * hzS), litAt = x => fireAt(x) + strikeAt(x);
            const layer = (T, j) => { const tw = T.W * kD * .9, th = T.H * kD * .9, base = Math.max(sy0 - B, ceil) - (1 - j) * 26 * kD, top = base - th + 92 * kD * .9, drift = (G.t * (j ? .045 : .03) * kD + j * 400 * kD) % tw;
              if (base < -10) return;
              q1.clearRect(0, 0, VW, VH); q2.clearRect(0, 0, VW, VH);
              for (let x = -drift; x < VW; x += tw) { if (hzS < 1) { q1.globalAlpha = 1 - hzS; q1.drawImage(T.d, x, top, tw + 1, th); } if (hzS > 0) { q1.globalAlpha = hzS; q1.drawImage(T.h, x, top, tw + 1, th); } q2.drawImage(T.l, x, top, tw + 1, th); }
              q1.globalAlpha = 1; if (top > 0) { q1.fillStyle = css([24 + 116 * hzS, 20 + 110 * hzS, 25 + 114 * hzS]); q1.fillRect(0, 0, VW, top + 1); }
              // among the rocks the near mountain stands in front of the cloud: cut its shape out of the deck
              if (rocky && HILL) for (const q of [q1, q2]) { q.globalCompositeOperation = 'destination-out'; q.globalAlpha = 1; q.drawImage(HILL[1], dx, dy, HW * k, HH * k); q.fillStyle = '#000'; facePath(q, hx, hy, k, 0, 30); q.fill(); q.globalCompositeOperation = 'source-over'; }
              if (spread < 1) across(q1, lid);
              c.globalCompositeOperation = 'source-over'; c.globalAlpha = Math.min(1, sK * (j ? .95 : .9)); c.drawImage(D1, 0, 0);
              // (build 244, owner: "I want the lighting up level of the clouds from lightning to be behind columns of smoke going
              // up"): on the front tile, drawn after the columns, a strike's light is cut out wherever the smoke stands (`SMK`,
              // the columns' shapes), so the smoke stays dark against the flash; the fire's glow on it is as before
              if (j && fl > .02) { const q3 = SMK3.getContext('2d'); q3.globalCompositeOperation = 'copy'; q3.globalAlpha = 1; q3.drawImage(D2, 0, 0); q3.globalCompositeOperation = 'source-over';
                across(q3, x => strikeAt(x) * lid(x)); q3.globalCompositeOperation = 'destination-out'; q3.drawImage(SMK, 0, 0); q3.drawImage(SMK, 0, 0); q3.globalCompositeOperation = 'source-over';
                c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, sK * .8); c.drawImage(SMK3, 0, 0); }
              if (burn + F + fl > .02) { across(q2, x => (j ? fireAt(x) : litAt(x)) * lid(x)); { q2.globalCompositeOperation = 'destination-out'; q2.globalAlpha = 1; q2.drawImage(SMK, 0, 0); q2.drawImage(SMK, 0, 0); q2.globalCompositeOperation = 'source-over'; } c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, sK * (j ? .8 : 1)); c.drawImage(D2, 0, 0); } };
            layer(DECK[0], 0);
            // (build 237, owner: "layers from bottom to top: (1) dark cloud backdrop across sky (2) 'light up' layer for lightning
            // flashes (3) billowing up smoke in front of light up layer (4) another cloud layer across sky providing foreground
            // cover and covering the upper part of billowing smoke so it's integrated into cloud layer above"): the back tile,
            // with its firelit and strike-lit underside, is drawn here; the front tile is drawn whole after the columns of smoke
            deckWisp = () => { layer(DECK[1], 1); c.globalAlpha = 1; };
            c.globalAlpha = 1; c.globalCompositeOperation = 'lighter'; } }
        // (build 232, owner: "Smoke going up from the top of mount can go above light layer of billowing smoke from light"):
        // the column of smoke is drawn after the cloud, so it rises in front of the cloud's firelit underside and on up
        // into the dark body of the cloud, melting away there
        c.save();
        cols('body'); cols(false);
        c.restore();
        // (build 233, owner: "still need another layer of wispy smoke to go over billowing up smoke so it's going into cloud
        // in front of lit up section"): the cloud's hanging wisps are drawn once more, in front of the columns, over the
        // stretch of sky where they rise, so the smoke goes up INTO the lit wisps rather than standing before them
        if (deckWisp) deckWisp();
        c.save(); cols('top'); c.restore(); c.globalCompositeOperation = 'lighter';
        for (const e of embers) { const al = Math.sin(Math.PI * e.t / e.life) * .9; c.fillStyle = css([255, 170 + 60 * e.h, 90], al); c.beginPath(); c.arc(sx0 + e.x * k, sy0 + e.y * k, Math.max(.7, e.r * k), 0, 7); c.fill(); }
        // the red sheen the fire lays on the plain
        if (burn > .01) { c.translate(hx - 120 * k, hy + 22 * z); c.scale(1, .1); const g = c.createRadialGradient(0, 0, 0, 0, 0, 640 * k); g.addColorStop(0, css([236, 130, 84], .2 * burn + .2 * F)); g.addColorStop(1, css([236, 130, 84], 0)); c.fillStyle = g; c.fillRect(-640 * k, -640 * k, 1280 * k, 1280 * k); }
        c.restore();
        // LOW CLOUD ACROSS ITS FOOT (build 169): on the fair day the mountain's foot is lost in the plain's haze and a long
        // level band of low cloud lies across its lower slopes, drifting very slowly; the mountain rises clear above
        // it. That band is what tells the eye how big it is. It thins away as the sky darkens and he comes near.
        { const fair = (1 - dark) * reveal; if (fair > .02) { const hz = mix(low, [226, 222, 214], .5);
            const bg = c.createLinearGradient(0, hy - 210 * k, 0, hy + 50 * k); bg.addColorStop(0, css(hz, 0)); bg.addColorStop(.45, css(hz, .16 * fair)); bg.addColorStop(.7, css(hz, .5 * fair)); bg.addColorStop(.86, css(hz, .78 * fair)); bg.addColorStop(1, css(hz, .78 * fair)); c.fillStyle = bg; c.fillRect(0, hy - 210 * k, VW, 260 * k);
            // (build 267: the four drifting cloud pictures here read as blotches on the rock; one level band of mist instead)
            // its shadow lies on the plain on our side of it: a flat band of shade, widest under the mass
            { c.save(); c.translate(hx + 260 * k, hy + 26 * z); c.scale(1, .1); const sg = c.createRadialGradient(0, 0, 0, 0, 0, 760 * k); sg.addColorStop(0, css([22, 26, 22], .46 * fair)); sg.addColorStop(.6, css([22, 26, 22], .26 * fair)); sg.addColorStop(1, css([22, 26, 22], 0)); c.fillStyle = sg; c.fillRect(-760 * k, -760 * k, 1520 * k, 1520 * k); c.restore(); } } }
        // the field's haze at its foot, so it stands in the plain and not on it
        if (!rocky) { const fg = c.createLinearGradient(0, hy - 34 * k, 0, hy + 14 * k), ft = clamp((hy - hor) / (Y(0) - hor)), fc = ft < .35 ? mix(far, mix(far, near, .5), ft / .35) : mix(mix(far, near, .5), near, (ft - .35) / .65);
        fg.addColorStop(0, css(fc, 0)); fg.addColorStop(.6, css(fc, .85 * reveal)); fg.addColorStop(1, css(fc, .85 * reveal)); c.fillStyle = fg; c.fillRect(0, hy - 34 * k, VW, 48 * k);
          // (build 202: the painting's flat bottom edge showed as a hard line under the far mountain): below its foot the plain
          // itself is laid again over it, so the mountain's foot is lost in the plain's own haze
          plainFill(hy + 14 * k - 1); }
      }
      // the village of Morality at the hill's near foot, under the overhang, in front of the haze at its foot. It shows
      // when Wiseman names it (`vil`), before the hill comes out of the haze above it at "Do you see that hill?"
      // (build 277, owner: "Village could look more polished too, maybe use image model"): one painted picture
      // (`assets/village.webp`, `VILP`: Legality's manor first, thatched and slate cottages, a barn, the church with its
      // spire, round trees, its own lit windows and threads of chimney smoke), toned into the evening haze at the hill's
      // foot; the drawn silhouette (`TOWN`) stands in until it loads
      if (!rocky && VILP) { /* (build 286) drawn before the hill now: see villageBehind() */ }
      else if (!rocky && TOWN.W) { const tw = 700 * k, th = tw * TOWN.H / TOWN.W, tx = hx - 220 * k, ty = hy + 20 * k, va = Math.max(reveal, vil);
        if (va > .01 && tx < VW && tx + tw > 0) { const tc = tintC.town || (tintC.town = mk(TOWN.W, TOWN.H)), t = tc.getContext('2d'), tint = mix(mix(mix(far, [44, 38, 44], .8), low, .05), [36, 32, 40], dark * .7);
          t.globalCompositeOperation = 'source-over'; t.clearRect(0, 0, TOWN.W, TOWN.H); t.drawImage(TOWN, 0, 0); t.globalCompositeOperation = 'source-in';
          const tg = t.createLinearGradient(0, 0, 0, TOWN.H); tg.addColorStop(0, css(tint)); tg.addColorStop(1, css(mix(tint, mix(far, near, .3), .35))); t.fillStyle = tg; t.fillRect(0, 0, TOWN.W, TOWN.H);
          // its foot fades into the haze of the plain (no hard straight base)
          t.globalCompositeOperation = 'source-atop'; const fh = t.createLinearGradient(0, TOWN.H - 44, 0, TOWN.H); fh.addColorStop(0, css(colAt(clamp((ty - hor) / (Y(0) - hor))), 0)); fh.addColorStop(1, css(colAt(clamp((ty - hor) / (Y(0) - hor))), .9)); t.fillStyle = fh; t.fillRect(0, TOWN.H - 44, TOWN.W, 44);
          c.globalAlpha = va; c.drawImage(tc, tx, ty - th, tw, th); c.globalAlpha = 1;
          // its chimneys smoke, thin threads leaning with the evening air
          c.save(); c.lineCap = 'round'; for (const [i, [wx, wy]] of TOWN.ch.entries()) { const px = tx + wx * tw / TOWN.W, py = ty - th + wy * th / TOWN.H, L = 38 * k;
            for (let j = 0; j < 12; j++) { const u0 = j / 12, u1 = (j + 1) / 12, sw = u => px - u * u * 5 * k + 1.5 * k * u * Math.sin(G.t / 80 + u * 4 + i);
              c.strokeStyle = css(mix(tint, [214, 204, 196], .5), .32 * va * (1 - u0) * (1 - dark * .5)); c.lineWidth = Math.max(.5, (1.4 + 4 * u0) * k); c.beginPath(); c.moveTo(sw(u0), py - u0 * L); c.lineTo(sw(u1), py - u1 * L); c.stroke(); } }
          c.restore();
          // its windows: soft lights, warmer when he hears of it
          for (const [wx, wy] of TOWN.lit) { const wa = Math.min(1, (.45 + .45 * dark) * va + .4 * vil * (1 - dark)), px = tx + wx * tw / TOWN.W, py = ty - th + wy * th / TOWN.H, rr = Math.max(1.2, 4.5 * k), g = c.createRadialGradient(px, py, 0, px, py, rr); g.addColorStop(0, css([255, 222, 150], wa)); g.addColorStop(.4, css([255, 206, 136], wa * .5)); g.addColorStop(1, css([255, 200, 130], 0)); c.fillStyle = g; c.fillRect(px - rr, py - rr, 2 * rr, 2 * rr); } } }
      {
      }
      // among the rocks: the crags behind the path, then the stones falling from the overhang
      if (rocky) {
        // (build 237, owner: "When we're down with Christian we remove mist that's between mountain and next layer up"): the
        // haze in the gully between the mountain and the crags behind the path is gone
        crags(.75, 11, 190, 0, 70, 470, mix([46, 37, 33], [31, 25, 23], dark), .5 * burnR, true, .8, 560);
        // (build 314; owner: "the mist around christian should maybe be replaced by mist localized to the layer behind him (so
        // he doesn't glow so much when he's near mountain) ... it is difficult to see him"): instead of a glow round each
        // figure (HAZE, now off), one low bank of mist lies in front of the crags behind the path, along his stretch of it,
        // thickest about his chest height and thinning upward, so his dark shape stands against a paler band
        if (Zw < .98) alongPath(inPath, q => { const mc = mix([158, 128, 124], [124, 100, 108], dark), y0 = Y(-330), g = q.createLinearGradient(0, y0, 0, Y(0)), A = (1 - Zw) * (.6 - .06 * dark);
          g.addColorStop(0, css(mc, 0)); g.addColorStop(.45, css(mc, .55 * A)); g.addColorStop(.72, css(mc, A)); g.addColorStop(1, css(mc, .8 * A)); q.fillStyle = g; q.fillRect(0, y0, VW, Y(0) - y0 + 2);
          // (build 325, owner: "the fog should go past the local rock layers at the left base part of the mountain so its framed by
          // the rock and doesn't extend over mountain at all"): the mist is cut away wherever the mountain stands
          if (HILL) { q.globalCompositeOperation = 'destination-out'; q.save(); facePath(q, hx, hy, k, 2, 3000, 400); q.clip(); q.drawImage(HILL[1], hx - HOX * k, hy - HOY * k, HW * k, HH * k); q.restore(); q.fillStyle = '#000'; facePath(q, hx, hy, k, 0, 30); q.fill();
            // and off the crags behind the path where they rise into the mountain's foot (their fallen-rock slope reads as the
            // mountain): fading in toward the foot, so the mist lies in the open gully, framed by rock
            if (MIDPTS) { const g2 = q.createLinearGradient(0, 0, VW, 0); for (let i = 0; i <= 32; i++) g2.addColorStop(i / 32, 'rgba(0,0,0,' + smooth(FOOT - 650, FOOT - 250, wxAt(VW * i / 32)).toFixed(3) + ')');
              q.fillStyle = g2; q.beginPath(); q.moveTo(-12, VH + 10); for (const [x, y] of MIDPTS) q.lineTo(x, y); q.lineTo(VW + 12, VH + 10); q.fill(); }
            q.globalCompositeOperation = 'source-over'; } });
        alongPath(inPath, q => { const g = q.createLinearGradient(0, Y(-70), 0, Y(0)); g.addColorStop(0, css([90, 66, 64], 0)); g.addColorStop(1, css([90, 66, 64], .3 * dark)); q.fillStyle = g; q.fillRect(0, Y(-70), VW, 72 * z); });
        // (build 325) the stones that fell on the way to the foot, and their dust
        if (!DUSTC) { DUSTC = mk(64, 64); const q = DUSTC.getContext('2d'), g = q.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(128,104,90,.55)'); g.addColorStop(.5, 'rgba(116,94,84,.3)'); g.addColorStop(1, 'rgba(110,90,80,0)'); q.fillStyle = g; q.fillRect(0, 0, 64, 64); }
        for (const r of PATHR) { const px = X(r.x), py = Y(r.y), rr = r.r * z; if (px < -60 || px > VW + 60) continue;
          c.save(); c.translate(px, py - rr * .7); c.rotate(r.b >= 3 ? r.s : r.t * (r.big ? .07 : .18) + r.s); c.fillStyle = css([20, 16, 17], .97); c.beginPath(); r.sh.forEach((q, i) => { const an = i / 7 * 6.283; i ? c.lineTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .8) : c.moveTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .8); }); c.closePath(); c.fill();
          if (r.big) { c.strokeStyle = css([236, 150, 96], .35 * burnR); c.lineWidth = Math.max(.6, rr * .1); c.beginPath(); for (let i = 5; i <= 7; i++) { const an = i / 7 * 6.283, q = r.sh[i % 7]; i === 5 ? c.moveTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .8) : c.lineTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .8); } c.stroke(); }
          c.restore(); }
        for (const d of DUSTW) { const u = d.t / d.life, al = d.a * smooth(0, .08, u) * Math.pow(1 - u, 1.4); if (al < .01) continue; const rr = d.r * z, rx = rr * 1.6; c.globalAlpha = Math.min(1, al); c.drawImage(DUSTC, X(d.x) - rx, Y(d.y) - rr, 2 * rx, 2 * rr); } c.globalAlpha = 1;
        // falling stones (dark, tumbling) and the dust where they land
        if (!DUSTC) { DUSTC = mk(64, 64); const q = DUSTC.getContext('2d'), g = q.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(128,104,90,.55)'); g.addColorStop(.5, 'rgba(116,94,84,.3)'); g.addColorStop(1, 'rgba(110,90,80,0)'); q.fillStyle = g; q.fillRect(0, 0, 64, 64); }
        // (build 232, owner: "Boulders too big when it's zoomed out. If zoomed in, they can be bigger"): the falling boulders and
        // their dust are drawn smaller the further the camera stands back (`bS`: a third of their size in the wide shot,
        // their full size once the mountain is seen close)
        const bS = clamp(k / 1.8, .3, 1);
        for (const d of DUST) { const u = d.t / d.life, al = d.a * smooth(0, .08, u) * Math.pow(1 - u, 1.4) * (.6 + .4 * dark); if (al < .01) continue; const rr = d.r * (d.big ? k * bS : Math.min(k, 1.8)), rx = rr * (d.big ? 1.4 : 2.4);
          c.globalAlpha = Math.min(1, al); c.drawImage(DUSTC, hx + d.x * k - rx, hy + d.y * k - rr, 2 * rx, 2 * rr); } c.globalAlpha = 1;
        for (const r of ROCKS) { const px = hx + r.x * k, py = hy + r.y * k, kk = r.big ? k * bS : Math.min(k, 1.8), rr = r.r * kk;
          c.save(); c.translate(px, py); c.rotate(r.t * (r.big ? .06 : .2) + r.s); c.fillStyle = css([22, 18, 19], .95); c.beginPath(); r.sh.forEach((q, i) => { const an = i / 7 * 6.283; i ? c.lineTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .8) : c.moveTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .8); }); c.closePath(); c.fill();
          if (r.big) { c.strokeStyle = css([236, 150, 96], .35 * burnR); c.lineWidth = Math.max(.6, rr * .12); c.beginPath(); for (let i = 5; i <= 7; i++) { const an = i / 7 * 6.283, q = r.sh[i % 7]; i === 5 ? c.moveTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .8) : c.lineTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .8); } c.stroke(); }
          c.restore(); }
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
    // THE GATE MADE OF PHOTOGRAPHS (build 212; owner: "The ending of level three is weak - need a nice door - maybe look
    // online for pics of old wooden doors . Also rocks could be picture based with more texture and more continuous (grout
    // lines too strong) . When door is opened can light stream out - is there a reason we don't see doorkeeper ?").
    // (1) The door is a photograph of an old plank door (`GDOOR`, assets/gate-door.webp), cut to the arch and lit by the
    // lantern; the arch is a little larger (`GR`, `GH`). (2) The wall is a photograph of old fieldstone (`GSTONE`, a
    // seamless tile, assets/gate-stone.webp) laid over the light by 'multiply': the stones show only where the light falls
    // and the joints are the photograph's own soft shadows, no drawn grout. (3) When Good-will comes the door swings in on
    // its hinge (right) and the light from within streams out: a bright gap, a soft wedge of light in the air spreading
    // left over him with dust turning in it, a long flat pool on the road and his shadow lying flat behind him.
    // (4) Good-will stands in the opening, a dark shape against the light (`GWF`: Evangelist's standing picture without
    // his staff, a stand-in until Level 4 gives Good-will his own figure).
    const GR = 40, GH = 126, SW = 104, SH = 26, SY = GH + GR + 23;
    const gateOn = !rocky && X(GATE_X - 1300) < VW, gx = X(GATE_X), r = GR * z, gy0 = Y(-GH), lnx = gx - 72 * z, lny = Y(-162), flick = .86 + .1 * Math.sin(G.t / 7) + .04 * Math.sin(G.t / 2.3);
    // (build 216, owner: "Doorkeeper maybe should be on right side and door opens on other side (so there's some natural space
    // between two figures)": the hinge is on the LEFT now, the leaf swings in on Christian's side and the opening is on the right)
    const open = smooth(0, 1, door), lw = 2 * r * (1 - .62 * open), gapL = gx - r + lw, ri = r + 5 * z, ro = r + 19 * z;
    // everything but the doorway (so the glow does not wash out Good-will standing in it)
    const notDoor = () => { c.beginPath(); c.rect(0, 0, VW, VH); c.moveTo(gx - r, Y(0)); c.lineTo(gx + r, Y(0)); c.lineTo(gx + r, gy0); c.arc(gx, gy0, r, 0, Math.PI, true); c.closePath(); c.clip('evenodd'); };
    if (gateOn) {
      const x0 = GATE_X - 1300;
      const WEND = GATE_X - 430, wend = x => { const e = (x - WEND) / 95; if (e <= 0) return 0; if (e >= 1) return 1; return clamp(Math.pow(e, .6) * .95 + .16 * (nz(x * .045, 9) - .5) * (1 - e * .7) + .07 * (nz(x * .16, 11) - .5) * (1 - e) + .05); };
      // (build 216, owner: "Top of wall can be little more rugged matching contours of rocks"): the top is a row of rough
      // cap stones of every width and height, each rounded and chipped, now and then one missing, over the slow swell
      if (!CAP) { CAP = []; const Rc = rngS(93); for (let x = x0 - 20; x < GATE_X + 920;) { const w = 14 + Rc() * 24, gone = Rc() < .05; CAP.push({ x, w, h: gone ? -2 - Rc() * 3 : 1 + Rc() * 4.5, l: Rc(), rr: Rc() }); x += w; } }
      const cap = x => { let lo = 0, hi = CAP.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (CAP[m].x <= x) lo = m; else hi = m - 1; } const q = CAP[lo], t = (x - q.x) / q.w, e = Math.max(0, 1 - Math.pow(Math.abs(2 * t - 1 + (q.l - .5) * .5), 3)); return q.h * Math.pow(e, .7) + (q.rr - .5) * 2 * (t - .5); };
      // BEELZEBUB'S CASTLE ({62}: "a little distance from this gate"), out on Christian's own side beyond the wall's end: a
      // dark keep and towers on a far rise on the horizon against the dusk, one dim ember of a window
      // the open land beyond the wall's end, at dusk: a hazy far ridge, then darker ground down to the road (it covers the
      // plain's daytime layers there)
      { const xe = X(WEND + 60); if (xe > 0) { c.save(); c.beginPath(); c.rect(0, Y(-240), xe, Y(4) - Y(-240)); c.clip();
          const rid = (y0, amp, f, sd) => { c.beginPath(); c.moveTo(0, Y(4)); for (let sx = 0; sx <= xe + 6; sx += 4) { const wx = cx + (sx - VW / 2) / z; c.lineTo(sx, Y(y0 - amp * nz(wx * f, sd))); } c.lineTo(xe + 6, Y(4)); c.closePath(); };
          rid(-172, 34, .006, 21); c.fillStyle = css([62, 34, 27]); c.fill();
          rid(-150, 26, .008, 24); c.fillStyle = css([46, 25, 20]); c.fill();
          rid(-124, 22, .01, 22); c.fillStyle = css([36, 20, 16]); c.fill();
          rid(-72, 16, .014, 23); { const g = c.createLinearGradient(0, Y(-80), 0, Y(4)); g.addColorStop(0, css([26, 15, 12])); g.addColorStop(1, css([16, 9, 7])); c.fillStyle = g; } c.fill(); c.restore(); } }
      { const bx = GATE_X - 650, P = (u, v) => [X(bx + .85 * u), Y(-140 - .85 * v)];
        { const [gx2, gy2] = P(0, 30), rr = 260 * z, g = c.createRadialGradient(gx2, gy2, 0, gx2, gy2, rr); g.addColorStop(0, css([120, 66, 44], .42)); g.addColorStop(.5, css([96, 52, 36], .16)); g.addColorStop(1, css([80, 40, 30], 0)); c.fillStyle = g; c.fillRect(gx2 - rr, gy2 - rr, 2 * rr, 2 * rr); }
        c.fillStyle = css([24, 13, 11]); c.beginPath(); c.moveTo(...P(-230, -40));
        // the rise, then the castle on it: a squat curtain wall between a tall round-topped keep and two thin towers
        const pts = [[-150, 6], [-70, 22], [-58, 22], [-58, 58], [-54, 58], [-54, 62], [-49, 62], [-49, 58], [-44, 58], [-44, 30], [-20, 30], [-20, 34], [-16, 34], [-16, 30], [-8, 30],
          [-8, 74], [-4, 74], [-4, 78], [1, 78], [1, 74], [6, 74], [6, 78], [11, 78], [11, 74], [14, 74], [14, 32], [30, 32], [30, 50], [33, 50], [33, 54], [38, 54], [38, 50], [41, 50], [41, 24], [70, 22], [160, 4], [240, -40]];
        for (const [u, v] of pts) c.lineTo(...P(u, v)); c.closePath(); c.fill();
        const fl = .6 + .4 * Math.sin(G.t / 37); c.fillStyle = css([160, 58, 28], .6 * fl); const [wx, wy] = P(1, 60); c.fillRect(wx, wy, 2.2 * z, 3.4 * z); }
      const wtop = x => 330 + (nz(x * .012, 3) - .5) * 26 + (nz(x * .05, 6) - .5) * 12 + cap(x);
      // (vision chat, owner: "the castle shooting over wall looks strange - which side is it on?"): the wall ENDS a little way
      // left of the gate in a broken, stepped end (`WEND`, courses fallen away unevenly), so the open land beyond shows and
      // the castle stands out there on Christian's own side, as in the book
      const wallPath = () => { c.beginPath(); c.moveTo(X(WEND), Y(2)); for (let x = WEND; x <= GATE_X + 900; x += 3) c.lineTo(X(x), Y(-wtop(x) * wend(x))); c.lineTo(X(GATE_X + 900), Y(2)); };
      const arch = (rr = r, y1 = gy0) => { c.beginPath(); c.moveTo(gx - rr, Y(1)); c.lineTo(gx - rr, y1); c.arc(gx, y1, rr, Math.PI, 0); c.lineTo(gx + rr, Y(1)); };
      // the stone surround: dressed jamb stones and voussoirs between ri and ro, the door set back in a reveal
      const frameP = () => { c.beginPath(); c.moveTo(gx - ro, Y(0)); c.lineTo(gx - ro, gy0); c.arc(gx, gy0, ro, Math.PI, 0); c.lineTo(gx + ro, Y(0)); c.closePath(); c.moveTo(gx - ri, Y(0)); c.lineTo(gx - ri, gy0); c.arc(gx, gy0, ri, Math.PI, 0); c.lineTo(gx + ri, Y(0)); c.closePath(); c.rect(gx - SW / 2 * z, Y(-SY - SH), SW * z, SH * z); };
      // the far light, behind the wall: only its glow over the top
      { const gy = Y(-330), g = c.createRadialGradient(gx, gy, 0, gx, gy, 340 * z); g.addColorStop(0, css([255, 220, 160], .42 * gateish)); g.addColorStop(.35, css([230, 160, 100], .16 * gateish)); g.addColorStop(1, css([200, 120, 80], 0)); c.fillStyle = g; c.fillRect(gx - 340 * z, gy - 340 * z, 680 * z, 680 * z); }
      wallPath(); c.fillStyle = css([22, 13, 10]); c.fill();
      // a few fallen stones at the wall's broken end
      { c.fillStyle = css([19, 11, 9]); for (let i = 0; i < 7; i++) { const u = WEND - 40 + i * 15 + 6 * nz(i * 1.7, 5), w = 7 + 9 * nz(i * 2.3, 6), h = 4 + 6 * nz(i * 3.1, 7); c.beginPath(); c.ellipse(X(u), Y(-h * .45), w * z * .5, h * z * .55, .2 * (nz(i, 8) - .5), 0, 7); c.fill(); } }
      c.save(); wallPath(); c.clip();
      // one soft pool of lantern light, and the open door's light
      const dx0 = GATE_X - 30, lxw = GATE_X - 72, tex = GSTONE ? 1.3 : 1;
      // (build 237, owner: "Too big of rocks need to find a much bigger swatch of rocks . Also need to go back to Rembrandt style
      // lighting that we had before !": the picture is now TWO photographs by the same photographer of the same kind of
      // Surrey stone-and-flint wall, Ash and Worplesdon (both CC0), joined and blended, its ends and its top and foot blended
      // so it repeats without a seam both ways (2052 x 750), laid 640 units wide, so the stones are smaller; the dusk fill
      // nearly gone and the lantern's and the door's pools falling off as steeply as the old lit stones did: most of the
      // wall is dark again)
      // (build 241, owner: "the rocks seem too big for wall is there a way to create more repetition or bring in other pictures so all
      // rocks can be much smaller ??": four photographs of Surrey and Sussex flint walls, each scaled so its stones are the same
      // small size and its tones matched to Ash's, laid two rows of two and blended at every seam (`assets/gate-wall.webp` 1002 x
      // 360), 470 units a tile: the stones are about 15 units, real size beside him)
      // THE WALL FROM ONE BIG PHOTOGRAPH (build 235; owner: "A ... Let's go for A for on wall for now !"): a stone-and-flint
      // churchyard wall (St Peter's, Ash, Surrey; Wikimedia Commons, CC0), its daylight shading evened out and its colour
      // quietened (`assets/gate-wall.webp`, 1400 x 1011), laid 560 units wide from the road up, its right edge blended
      // into its left so it repeats without a seam (`GWALL`, `wallPat`); the stones keep their own real relief. ONE SET OF LIGHTS for the
      // wall, the surround, the door and the figures (owner: "make the lighting here realistic and consistent among
      // figures and items"): the lantern (a warm pool, brightest just round it, falling off quickly), the door's light from
      // within (low, from the opening, as it opens), and a faint cool dusk over everything, so the stone is just there in
      // the dark and never a flat plane. The wall picture is laid over these lights by 'multiply'.
      c.globalCompositeOperation = 'lighter';
      { c.fillStyle = css([44, 42, 56], .12 * (1 - open)); c.fillRect(0, 0, VW, Y(2)); }
      // (build 246, the eye adjusting: as the door opens the lantern's pool sinks, so the doorway becomes the one bright thing)
      const lk = flick * (1 - .45 * open), LR = 230 * z;
      { const g = c.createRadialGradient(lnx, lny, 0, lnx, lny, LR); g.addColorStop(0, css([255, 200, 132], lk)); g.addColorStop(.12, css([250, 176, 108], .78 * lk)); g.addColorStop(.3, css([214, 116, 60], .4 * lk)); g.addColorStop(.55, css([150, 62, 32], .12 * lk)); g.addColorStop(.8, css([104, 38, 20], .03 * lk)); g.addColorStop(1, css([100, 56, 30], 0)); c.fillStyle = g; c.fillRect(lnx - LR, lny - LR, 2 * LR, 2 * LR); }
      if (open > .01) { const bx = gapL + (gx + r - gapL) * .5, by = Y(-60), rr = 210 * z, g = c.createRadialGradient(bx, by, 0, bx, by, rr); g.addColorStop(0, css([255, 226, 176], open)); g.addColorStop(.15, css([246, 184, 116], .62 * open)); g.addColorStop(.35, css([200, 104, 56], .2 * open)); g.addColorStop(.65, css([124, 48, 26], .03 * open)); g.addColorStop(1, css([120, 70, 40], 0)); c.fillStyle = g; c.fillRect(bx - rr, by - rr, 2 * rr, 2 * rr); }
      c.globalCompositeOperation = 'multiply';
      if (GWALL) { const P = wallPat(c), k = 470 / GWALL.width * z; P.setTransform(new DOMMatrix([k, 0, 0, k, X(x0), Y(0) - GWALL.height * k])); c.fillStyle = P; c.fillRect(0, 0, VW, Y(2)); }
      else if (GSTONE) { if (!GSTONE.pat) GSTONE.pat = c.createPattern(GSTONE, 'repeat'); const k = 380 / GSTONE.width * z; GSTONE.pat.setTransform(new DOMMatrix([k, 0, 0, k, X(x0), Y(0)])); c.fillStyle = GSTONE.pat; c.fillRect(0, 0, VW, Y(2)); }
      c.globalCompositeOperation = 'source-over';
      // (build 239, the light thought through as a whole, after Rembrandt: one light rules at a time, and the light behaves
      // as real light does.) The lantern's own roof stops its light going straight up, so a soft dark cone rises up the
      // wall above it, its edges softening as they go
      { const ry = lny - 16 * z, top = ry - 150 * z; for (const [w0, w1, a] of [[8, 70, .16], [6, 52, .16], [4, 36, .18]]) { c.beginPath(); c.moveTo(lnx - w0 * z, ry); c.lineTo(lnx + w0 * z, ry); c.lineTo(lnx + w1 * z, top); c.lineTo(lnx - w1 * z, top); c.closePath();
          const g = c.createLinearGradient(0, ry, 0, top); g.addColorStop(0, css([8, 6, 5], a * flick)); g.addColorStop(1, css([8, 6, 5], 0)); c.fillStyle = g; c.fill(); } }
      // when the door opens, its low light throws his shadow onto the wall behind him, larger than he is and soft, leaning
      // away from the light (the shadow is his own last drawn picture, darkened, made small and stretched up so it is soft)
      if (open > .05 && CHRSH) { const S = CHRSH, lx = GATE_X + 14, ly = 48, m = 1.5, sw = Math.ceil(S.fc.width / 7), shh = Math.ceil(S.fc.height / 7);
        if (!SHC) SHC = mk(8, 8); if (SHC.width !== sw || SHC.height !== shh) { SHC.width = sw; SHC.height = shh; }
        const q = SHC.getContext('2d'); q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, sw, shh); q.drawImage(S.fc, 0, 0, sw, shh); q.globalCompositeOperation = 'source-in'; q.fillStyle = '#060404'; q.fillRect(0, 0, sw, shh);
        c.save(); c.beginPath(); c.rect(0, 0, gx - ro, Y(0)); c.clip(); c.globalAlpha = .42 * open;
        c.translate(X(lx), Y(-ly)); c.scale(m, m); c.translate(-X(lx), -Y(-ly));
        c.translate(VW / 2 - cx * z, wl); c.scale(z, z); c.translate(S.x, 5); c.scale(S.face * S.k, S.k * S.sy); c.drawImage(SHC, -S.meta.ax, -S.meta.ground, S.fc.width, S.fc.height);
        c.restore(); }
      if (GSTONE) {
        // the surround's stones are dressed smooth and paler: the same lights, a little stronger, with only a fine grain
        if (!GSTONE.pat) GSTONE.pat = c.createPattern(GSTONE, 'repeat');
        { c.save(); frameP(); c.clip('evenodd'); c.fillStyle = css([24, 20, 19]); c.fillRect(gx - SW * z, Y(-SY - SH - 10), 2 * SW * z, (SY + SH + 12) * z);
          c.globalCompositeOperation = 'lighter';
          { const g = c.createRadialGradient(lnx, lny, 0, lnx, lny, 210 * z); g.addColorStop(0, css([236, 180, 118], .85 * flick)); g.addColorStop(.4, css([180, 120, 70], .35 * flick)); g.addColorStop(1, css([150, 90, 50], 0)); c.fillStyle = g; c.fillRect(gx - ro - 300 * z, gy0 - ro - 200 * z, 600 * z, 600 * z); }
          if (open > .01) { const g = c.createRadialGradient(gx + r * .4, Y(-70), 0, gx + r * .4, Y(-70), 190 * z); g.addColorStop(0, css([255, 214, 150], .7 * open)); g.addColorStop(1, css([170, 100, 56], 0)); c.fillStyle = g; c.fillRect(gx - 200 * z, Y(-270), 400 * z, 400 * z); }
          const k = 190 / GSTONE.width * z; GSTONE.pat.setTransform(new DOMMatrix([k, 0, 0, k, X(x0), Y(0)])); c.globalCompositeOperation = 'multiply'; c.globalAlpha = .8; c.fillStyle = GSTONE.pat; c.fillRect(gx - SW * z, Y(-SY - SH - 10), 2 * SW * z, (SY + SH + 12) * z);
          c.restore(); }
        // the joints of the surround: thin and soft, darker only where the light shows them
        c.save(); frameP(); c.clip('evenodd'); c.strokeStyle = css([12, 9, 8], .42); c.lineWidth = 1 * z; c.beginPath();
        for (let y = 0, i = 0; y < GH - 4; y += 21 + (i % 3) * 3, i++) { if (y) { c.moveTo(gx - ro, Y(-y)); c.lineTo(gx - ri, Y(-y)); c.moveTo(gx + ri, Y(-y - 6)); c.lineTo(gx + ro, Y(-y - 6)); } }
        for (let k = 1; k < 9; k++) { const a = Math.PI + k / 9 * Math.PI; c.moveTo(gx + Math.cos(a) * ri, gy0 + Math.sin(a) * ri); c.lineTo(gx + Math.cos(a) * (ro + 2 * z), gy0 + Math.sin(a) * (ro + 2 * z)); }
        c.stroke(); c.restore();
        // the surround stands a little proud of the wall: a soft shadow along its outer edge away from the lantern
        c.save(); c.strokeStyle = css([6, 5, 5], .35); c.lineWidth = 3 * z; c.beginPath(); c.arc(gx + 1.5 * z, gy0 + 1 * z, ro + 1.5 * z, -Math.PI * .55, 0); c.lineTo(gx + ro + 1.5 * z, Y(0)); c.stroke(); c.restore();
      } else {
        c.globalCompositeOperation = 'source-over';
        for (const s of STONES) { const cx2 = s.x + s.w / 2, cy2 = -(s.y + s.h / 2), l1 = Math.max(0, 1 - Math.hypot(cx2 - lxw, cy2 + 150) / 260), l2 = Math.max(0, 1 - Math.hypot(cx2 - dx0, (cy2 + 70) * .8) / 430);
          const a = Math.min(1, l1 * l1 * flick + l2 * l2 * 1.2 * open); if (a < .02) continue;
          c.fillStyle = s.t > .5 ? css([255, 226, 180], a * .16 * (s.t - .5)) : css([0, 0, 0], a * .5 * (.5 - s.t));
          c.fillRect(X(s.x), Y(-(s.y + s.h)), s.w * z, s.h * z); }
      }
      c.restore();
      // the reveal: the door is set back in the thickness of the wall; its far side catches the light from within
      arch(ri, gy0); c.fillStyle = css([16, 12, 11]); c.fill();
      if (door > .01) { c.save(); arch(ri, gy0); c.clip(); const g = c.createLinearGradient(gx + r, 0, gx + ri, 0); g.addColorStop(0, css([255, 214, 150], .7 * open)); g.addColorStop(1, css([200, 140, 90], .25 * open)); c.fillStyle = g; c.fillRect(gx + r, gy0 - ri, ri - r, GH * z + ri); c.restore(); }
      if (!GSTONE) { c.save(); c.lineWidth = 2.2 * z; c.strokeStyle = css([226, 170, 106], Math.min(1, .22 * flick + .45 * open)); c.beginPath(); c.moveTo(gx - r - 5 * z, Y(0)); c.lineTo(gx - r - 5 * z, gy0); c.arc(gx, gy0, r + 5 * z, Math.PI, 0); c.lineTo(gx + r + 5 * z, Y(0)); c.stroke(); c.restore(); }
      c.save(); arch(); c.clip();
      // within: the light he has followed, and Good-will standing in it
      if (door > .01) {
        const g = c.createLinearGradient(gapL, 0, gx + r, 0); g.addColorStop(0, css([255, 222, 160])); g.addColorStop(.55, css([255, 250, 236])); g.addColorStop(1, css([255, 236, 196]));
        c.fillStyle = g; c.fillRect(gapL - 1, gy0 - r, gx + r - gapL + 1, GH * z + r + 2);
        const gw = smooth(.4, .95, door);
        if (gw > .01 && (GWST || EVS.ready)) {
          if (!GWST && !GWF.length) for (let i = 0; i < EVS_META.frames; i += 4) { const im = solidOf(EVS[i]), w = mk(im.width, im.height), q = w.getContext('2d'); q.drawImage(im, 0, 0); q.clearRect(150, 0, im.width, im.height); GWF.push(w); }
          c.save(); c.translate(VW / 2 - cx * z, wl); c.scale(z, z);
          // (build 216, owner: "please make doorkeeper little smaller and less dark"): a little further in, so smaller,
          // and his robe faintly seen in the light round him
          const fx = GATE_X + GR - (gx + r - gapL) / z * .46;
          // (build 234: Good-will's own figure, `assets/goodwill-stand.webp`, the owner's "Looks good to me" in the other small-tweaks
          // chat: bare-headed, white-bearded, hands folded; one still, breathing in code; the stand-in `GWF` only until it loads)
          GWFX = fx;
          FK = .86; if (GWRE && gwReach > .5) figure(c, 'gw', GWRE, GWRE_META, fx, -1, [52, 44, 40], gw * .96); else if (GWST) figure(c, 'gw', GWST, GWST_META, fx, -1, [52, 44, 40], gw * .96, breath(3)); else figure(c, 'gw', GWF[Math.floor(G.t / 20) % GWF.length], EVS_META, fx, -1, [52, 44, 40], gw * .96); FK = 1;
          c.restore();
          // the light wraps round his edges
          c.save(); c.globalCompositeOperation = 'lighter'; const g2 = c.createLinearGradient(gapL, 0, gx + r, 0); g2.addColorStop(0, css([255, 214, 150], .35 * gw)); g2.addColorStop(.18, css([255, 214, 150], 0)); g2.addColorStop(.82, css([255, 214, 150], 0)); g2.addColorStop(1, css([255, 214, 150], .3 * gw)); c.fillStyle = g2; c.fillRect(gapL, gy0 - r, gx + r - gapL, GH * z + r); c.restore();
        }
      }
      // the door: a photograph of an old plank door, swinging in on its hinge at the left
      const dl = gx - r;
      if (GDOOR) {
        c.drawImage(GDOOR, dl, gy0 - r, lw, GH * z + r + 1 * z);
        const g = c.createLinearGradient(dl, 0, gx + r, 0); g.addColorStop(0, css([10, 7, 5], .3 - .12 * open)); g.addColorStop(1, css([10, 7, 5], .62 - .3 * open));
        c.globalAlpha = 1 - .18 * flick; c.fillStyle = g; c.fillRect(dl, gy0 - r, lw, GH * z + r + 1); c.globalAlpha = 1;
        { const g3 = c.createRadialGradient(lnx, lny, 0, lnx, lny, 150 * z); g3.addColorStop(0, css([255, 170, 90], .22 * flick * (1 - .6 * open))); g3.addColorStop(1, css([255, 170, 90], 0)); c.globalCompositeOperation = 'lighter'; c.fillStyle = g3; c.fillRect(dl, gy0 - r, lw, GH * z + r); c.globalCompositeOperation = 'source-over'; }
        // (build 225, owner: "Please lighten door as it opens as light hits it too"): the light from within falls on the
        // leaf as it swings in, strongest at its free edge, beside the opening
        if (open > .01) { const g4 = c.createLinearGradient(gapL, 0, dl, 0); g4.addColorStop(0, css([255, 214, 150], .55 * open)); g4.addColorStop(.6, css([235, 170, 100], .3 * open)); g4.addColorStop(1, css([200, 130, 70], .14 * open)); c.globalCompositeOperation = 'lighter'; c.fillStyle = g4; c.fillRect(dl, gy0 - r, lw, GH * z + r); c.globalCompositeOperation = 'source-over'; }
      } else {
        c.fillStyle = css(mix([30, 21, 15], [70, 46, 28], .5 * flick)); c.fillRect(dl, gy0 - r, lw, GH * z + r + 1);
        c.strokeStyle = css([10, 7, 6], .8); c.lineWidth = 1.2 * z; for (const d of [.2, .4, .6, .8]) { c.beginPath(); c.moveTo(dl + d * lw, gy0 - r); c.lineTo(dl + d * lw, Y(0)); c.stroke(); }
      }
      // the free edge of the door catches the light from within
      if (door > .01) { c.fillStyle = css([255, 206, 140], .7 * open); c.fillRect(gapL - 1.6 * z, gy0 - r, 1.6 * z, GH * z + r); }
      c.restore();
      if (door > .01) { c.save(); notDoor(); c.globalCompositeOperation = 'lighter'; const bx = gapL, by = Y(-84), rr = (80 + 200 * open) * z, g = c.createRadialGradient(bx, by, 0, bx, by, rr); g.addColorStop(0, css([255, 236, 190], .32 * open)); g.addColorStop(.3, css([255, 190, 110], .14 * open)); g.addColorStop(1, css([240, 150, 80], 0)); c.fillStyle = g; c.fillRect(bx - rr, by - rr, 2 * rr, 2 * rr); c.restore(); }
      // the writing on a stone over the gate, shown by the lantern
      // (build 217, owner: "The lattern and sign need redoing to make super realistic - how about we make sign clickable so one
      // click on it and zoom in (kinda like book)"): the stone over the gate carries Bunyan's words cut in real letters (too
      // small to read here: a touch on it opens the stone close up, `signPic()`, `KS.look()`), its edges chamfered
      if (GSTONE) { const sx0 = gx - SW / 2 * z, sy0 = Y(-SY - SH), sw = SW * z, sh = SH * z;
        c.strokeStyle = css([8, 6, 6], .5); c.lineWidth = 1 * z; c.strokeRect(sx0, sy0, sw, sh);
        c.strokeStyle = css([255, 210, 150], .16 * flick); c.beginPath(); c.moveTo(sx0 + 2.5 * z, sy0 + sh - 2.5 * z); c.lineTo(sx0 + 2.5 * z, sy0 + 2.5 * z); c.lineTo(sx0 + sw - 2.5 * z, sy0 + 2.5 * z); c.stroke();
        c.strokeStyle = css([8, 6, 6], .35); c.beginPath(); c.moveTo(sx0 + 2.5 * z, sy0 + sh - 2.5 * z); c.lineTo(sx0 + sw - 2.5 * z, sy0 + sh - 2.5 * z); c.lineTo(sx0 + sw - 2.5 * z, sy0 + 2.5 * z); c.stroke();
        c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `${6.2 * z}px 'IM Fell English', Georgia, serif`;
        for (const [t, dy] of [['KNOCK, AND IT SHALL BE', -.26], ['OPENED UNTO YOU.', .2]]) { const ty = sy0 + sh * (.5 + dy);
          c.fillStyle = css([20, 13, 9], .62); c.fillText(t, gx, ty); c.fillStyle = css([255, 214, 160], .14 * flick); c.fillText(t, gx + .5 * z, ty + .6 * z); }
        c.restore(); }
      else { c.fillStyle = css(mix([70, 54, 42], [222, 190, 142], .6 * flick)); c.fillRect(gx - 38 * z, Y(-GH - GR - 36), 76 * z, 13 * z); }
      // the lantern on its iron bracket (build 222: drawn straight on, `bakeLantern()`; hung by its ring from a wrought-iron
      // hook on a plate in the wall)
      // the lantern's glow in the evening air, laid before the iron so the iron stays dark against it (build 246)
      c.save(); c.globalCompositeOperation = 'lighter'; { const g = c.createRadialGradient(lnx, lny, 0, lnx, lny, 90 * z); g.addColorStop(0, css([255, 220, 160], .42 * flick)); g.addColorStop(1, css([255, 190, 110], 0)); c.fillStyle = g; c.fillRect(lnx - 90 * z, lny - 90 * z, 180 * z, 180 * z); }
        { const g = c.createRadialGradient(lnx, lny, 0, lnx, lny, 170 * z); g.addColorStop(0, css([255, 200, 140], .1 * flick * (1 - .5 * open))); g.addColorStop(1, css([255, 180, 110], 0)); c.fillStyle = g; c.fillRect(lnx - 170 * z, lny - 170 * z, 340 * z, 340 * z); } c.restore();
      if (!LANT) bakeLantern();
      { const k = z, lx0 = lnx - LANT.fx * k, ly0 = lny - LANT.fy * k, hx = lnx, hy = ly0 + LANT.hy * k;
        // (build 249, owner: "should we add a little piece of wood to hold lattern?": a wrought-iron arm; build 250, owner: "Can we
        // make wrought patterned holder come out at us instead of going right"): the arm stands straight out from the wall
        // toward us, seen a little from below and from the side, so it is short and grows thicker toward its near end: a
        // pierced rosette plate on the wall, the arm, a scrolled brace from lower on the wall, a curl at its near end, the
        // lantern hung from a hook there; the open door throws the lantern's shadow up and left onto the wall behind it
        { const iron = css([13, 11, 10]), P = [hx - 7 * z, hy - 25 * z], N = [hx + 1.5 * z, hy - 5 * z], B = [hx - 7 * z, hy - 9 * z];
          if (open > .02) { const ox = -10 * z, oy = -7 * z; c.save(); c.globalAlpha = .34 * open;
            // made small and stretched up, so its edges are soft
            const sc = tintC._lsh || (tintC._lsh = mk(8, 8)); if (!sc.done) { sc.width = 30; sc.height = 52; const q = sc.getContext('2d'); q.drawImage(LANT.cv, 2, 2, 26, 47); q.globalCompositeOperation = 'source-in'; q.fillStyle = '#060404'; q.fillRect(0, 0, 30, 52); sc.done = true; }
            c.drawImage(sc, lx0 + ox - 2 / 26 * LANT.w * k, ly0 + oy - 2 / 47 * LANT.h * k, 30 / 26 * LANT.w * k, 52 / 47 * LANT.h * k);
            c.strokeStyle = '#060404'; c.lineCap = 'round'; c.lineWidth = 2.6 * z; c.beginPath(); c.moveTo(P[0], P[1]); c.lineTo(N[0] + ox, N[1] + oy); c.lineTo(hx + ox, hy + oy); c.stroke(); c.restore(); }
          // the plate: a quatrefoil of iron with four rivets, its lower edges lit by the flame below
          c.fillStyle = iron; for (const [ox, oy] of [[0, -3.4], [0, 3.4], [-3.4, 0], [3.4, 0]]) { c.beginPath(); c.arc(P[0] + ox * z, P[1] + oy * z, 3 * z, 0, 7); c.fill(); }
          c.beginPath(); c.arc(P[0], P[1], 3.6 * z, 0, 7); c.fill();
          c.strokeStyle = css([255, 186, 110], .2 * flick); c.lineWidth = .6 * z; for (const [ox, oy] of [[0, 3.4], [-3.4, 0], [3.4, 0]]) { c.beginPath(); c.arc(P[0] + ox * z, P[1] + oy * z, 2.7 * z, .15 * Math.PI, .85 * Math.PI); c.stroke(); }
          c.fillStyle = css([40, 30, 24]); for (const [ox, oy] of [[0, -4.4], [0, 4.4], [-4.4, 0], [4.4, 0]]) { c.beginPath(); c.arc(P[0] + ox * z, P[1] + oy * z, .7 * z, 0, 7); c.fill(); }
          // the brace: from lower on the wall up and out to the arm, a scroll at its foot
          c.strokeStyle = iron; c.lineCap = 'round'; c.lineWidth = 1.3 * z; c.beginPath(); c.moveTo(B[0], B[1]); c.bezierCurveTo(B[0] + 1 * z, B[1] - 4 * z, N[0] - 4 * z, N[1] - 5 * z, (P[0] + N[0]) / 2 + 1 * z, (P[1] + N[1]) / 2 + 1 * z); c.stroke();
          c.beginPath(); c.moveTo(B[0], B[1]); c.bezierCurveTo(B[0] - 2.6 * z, B[1] + .4 * z, B[0] - 2.4 * z, B[1] - 2.8 * z, B[0] - .6 * z, B[1] - 2.4 * z); c.stroke();
          c.fillStyle = iron; c.beginPath(); c.arc(B[0], B[1] + .6 * z, 1.4 * z, 0, 7); c.fill();
          // the arm, thicker toward us, lit along its underside
          { const dx = N[0] - P[0], dy = N[1] - P[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, w0 = 1.1 * z, w1 = 1.9 * z;
            c.fillStyle = iron; c.beginPath(); c.moveTo(P[0] + nx * w0, P[1] + ny * w0); c.lineTo(N[0] + nx * w1, N[1] + ny * w1); c.lineTo(N[0] - nx * w1, N[1] - ny * w1); c.lineTo(P[0] - nx * w0, P[1] - ny * w0); c.closePath(); c.fill();
            c.strokeStyle = css([255, 186, 110], .26 * flick); c.lineWidth = .6 * z; c.beginPath(); c.moveTo(P[0] - nx * w0 * .6 + dx * .3, P[1] - ny * w0 * .6 + dy * .3); c.lineTo(N[0] - nx * w1 * .7, N[1] - ny * w1 * .7); c.stroke(); }
          // the curl at its near end, seen almost edge-on, so a narrow upright loop
          c.strokeStyle = iron; c.lineWidth = 1.8 * z; c.beginPath(); c.ellipse(N[0] + .4 * z, N[1] - 3.4 * z, 1.6 * z, 3.4 * z, 0, Math.PI * .5, Math.PI * 2.2); c.stroke();
          // the hook
          c.lineWidth = 1.3 * z; c.beginPath(); c.moveTo(N[0], N[1]); c.lineTo(hx, hy - 3 * z); c.bezierCurveTo(hx - 3 * z, hy - 2 * z, hx - 2.5 * z, hy + 1 * z, hx, hy + .8 * z); c.stroke(); c.lineCap = 'butt'; }
        c.drawImage(LANT.cv, lx0, ly0, LANT.w * k, LANT.h * k);
        c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.max(0, (flick - .82) * 2.2); c.drawImage(LANT.cv, lx0, ly0, LANT.w * k, LANT.h * k); c.restore();
        { const g = c.createRadialGradient(lnx, lny - 1 * z, 0, lnx, lny - 1 * z, 13 * z); g.addColorStop(0, css([255, 214, 150], .5 * flick)); g.addColorStop(.5, css([255, 170, 90], .16 * flick)); g.addColorStop(1, css([255, 150, 80], 0)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(lnx - 13 * z, lny - 14 * z, 26 * z, 26 * z); c.restore(); } }
      // (build 246: the stream of light is laid BEHIND him now, so he stands dark against it, as in Rembrandt; laid over
      // him it washed him pale)
    // the light streaming out of the open gate: a soft wedge in the evening air, widening and fading to the left, a few
    // slow rays breathing in it, and dust turning where the light is (laid on, over him; never down the picture at us)
      if (open > .02) {
      const x1 = (gapL + gx + r) / 2, top = Y(-GH - GR * .6), bot = Y(0), L = 560 * z;
      // painted small and stretched up, so the edges of the light are soft (a hard straight edge read as a drawn line)
      const BS = 8, bw = Math.ceil(VW / BS), bh = Math.ceil(VH / BS); if (!BEAMC) BEAMC = mk(bw, bh); if (BEAMC.width !== bw || BEAMC.height !== bh) { BEAMC.width = bw; BEAMC.height = bh; }
      const bq = BEAMC.getContext('2d'); bq.setTransform(1, 0, 0, 1, 0, 0); bq.clearRect(0, 0, bw, bh); bq.setTransform(1 / BS, 0, 0, 1 / BS, 0, 0); bq.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) {
        const sp = [.0, .35, .6, .9][i], br = .55 + .45 * Math.sin(G.t / (140 + 37 * i) + i * 1.7), a = (i ? .08 : .2) * open * br;
        const ty0 = lerp(top, bot, sp * .7), ty1 = ty0 - (60 + 50 * i) * z * (1 - sp), by0 = lerp(top, bot, Math.min(1, sp * .7 + (i ? .25 : 1))), by1 = by0 + 14 * z;
        const g = bq.createLinearGradient(x1, 0, x1 - L, 0); g.addColorStop(0, css([255, 222, 168], a)); g.addColorStop(.35, css([255, 200, 140], a * .55)); g.addColorStop(1, css([255, 190, 130], 0));
        bq.fillStyle = g; bq.beginPath(); bq.moveTo(x1, ty0); bq.lineTo(x1 - L, ty1); bq.lineTo(x1 - L, by1); bq.lineTo(x1, by0); bq.closePath(); bq.fill();
      }
      c.save(); notDoor(); c.globalCompositeOperation = 'lighter'; c.drawImage(BEAMC, 0, 0, bw * BS, bh * BS);
      for (let i = 0; i < 26; i++) { const T = 900 + i * 53, u = ((G.t + i * 377) % T) / T, px = x1 - (30 + (i * 97) % 380) * z - 40 * u * z, py = lerp(top, bot, ((i * 0.618) % 1) * .9) + Math.sin(u * 6.283 + i) * 10 * z - 30 * u * z;
        const fade = Math.sin(Math.PI * u) * (1 - (x1 - px) / L), al = .5 * open * fade; if (al < .02) continue;
        c.fillStyle = css([255, 234, 196], al); c.beginPath(); c.arc(px, py, (.8 + (i % 3) * .4) * z, 0, 7); c.fill(); }
      c.restore();
    }
      for (let i = 0; i < knocks; i++) { const q = clamp(knockT / 40); if (i === knocks - 1 && q < 1) { c.strokeStyle = css([255, 236, 190], .7 * (1 - q)); c.lineWidth = 2; c.beginPath(); c.arc(gx, Y(-70), (10 + 46 * q) * z, 0, 7); c.stroke(); } }
    }
    // the road under everyone's feet
    // (build 221, owner: "The blue path layer can have some contour (or ruggedness) to it to make it match surroundings"):
    // among the rocks the path is a blue-black slate (build 224, the owner's choice from four: the cool of the night
    // under the warm rock and rose sky; build 221's warm brown-black made the whole picture one colour); its far edge is a low broken line
    // of stones (a few units high, behind the feet, so the walking line stays level), and the rock's grain lies over it
    const road = again => { const g = c.createLinearGradient(0, Y(0), 0, VH); const rc = rocky ? mix([28, 29, 37], [21, 22, 29], dark) : mix(mix([46, 40, 36], [22, 22, 30], Math.max(dark, .9 * gateish)), [17, 9, 7], .75 * gateish);
      if (rocky) { const xl = cx - VW / 2 / z - 20, xr = cx + VW / 2 / z + 20; c.beginPath(); c.moveTo(X(xl), VH);
        for (let x = Math.floor(xl / 5) * 5; x <= xr; x += 5) { const h = inPath(x) * Math.max(0, 70 * (nz(x * .006, 3.1) - .44) + 22 * (nz(x * .03, 7.7) - .42) + 5 * (nz(x * .14, 1.3) - .5)); c.lineTo(X(x), Y(-h)); }
        c.lineTo(X(xr), VH); c.closePath(); c.fillStyle = css(rc); c.fill(); } const g0 = css(mix(rc, [120, 116, 100], rocky ? 0 : .25 * (1 - .8 * gateish))); g.addColorStop(0, g0); g.addColorStop(.08, css(rc)); g.addColorStop(1, css(mix(rc, [0, 0, 0], .35))); c.fillStyle = g; c.fillRect(0, Y(0), VW, VH);
      // build 323 (owner: "the bump has hard line between it and the ground below. also the path looks different as it
      // goes from one to the other"): the brow is the ROAD ITSELF bent up: column by column the road's own gradient (its
      // pale worn edge, then its earth, darkening down) is hung from the brow's top line instead of the road's, so there
      // is no seam at its foot and the road's worn edge runs on up and over the top as the path
      const HC = { list: [] };
      if (!rocky && gateish < .5 && X(BROW0 - 340) < VW && X(CREST + 580) > 0) { const x0 = Math.max(0, Math.floor(X(BROW0 - 340))), x1 = Math.min(VW, Math.ceil(X(CREST + 580))), H0 = VH - Y(0); HC.x0 = x0; HC.x1 = x0 + 3 * Math.ceil((x1 - x0) / 3);
        for (let xs = x0; xs < x1; xs += 3) { const h = crest(cx + (xs + 1.5 - VW / 2) / z); HC.list.push([xs, Math.max(0, h) * z]); if (h <= .05) continue; const ty = Y(-h), gc = c.createLinearGradient(0, ty, 0, ty + H0);
          gc.addColorStop(0, g0); gc.addColorStop(.08, css(rc)); gc.addColorStop(1, css(mix(rc, [0, 0, 0], .35))); c.fillStyle = gc; c.fillRect(xs, ty, 3.6, VH - ty); } }
      // (build 267) on the fair plain the road is warm earth: the low sun lies on it in one long flat sheen below the sun
      // (a worn track of two faint lines was tried and read as lane markings: taken out)
      if (!rocky && !again) { const fk = (1 - dark) * (1 - gateish); if (fk > .02) { c.save(); c.globalCompositeOperation = 'lighter';
          const pg = c.createRadialGradient(0, 0, 0, 0, 0, VW * .6); pg.addColorStop(0, css([150, 110, 70], .3 * fk)); pg.addColorStop(.5, css([120, 86, 56], .12 * fk)); pg.addColorStop(1, css([100, 70, 50], 0));
          const sheen = dy => { c.save(); c.translate(lx, Y(10) - dy); c.scale(1, .06); c.fillStyle = pg; c.fillRect(-VW * .6, -VW * .6, VW * 1.2, VW * 1.2); c.restore(); };
          // (build 327, owner: "it just need to be opaque so it doesn't look different over the transition") over the brow the
          // sheen is lifted with the road, column by column, so the brow is the same road surface as the flat road beside it
          if (HC.list.length) { c.save(); c.beginPath(); c.rect(0, 0, HC.x0, VH); c.rect(HC.x1, 0, VW - HC.x1, VH); c.clip(); sheen(0); c.restore();
            for (const [xs, dy] of HC.list) { c.save(); c.beginPath(); c.rect(xs, 0, 3, VH); c.clip(); sheen(dy); c.restore(); } }
          else sheen(0);
          c.restore(); } }
      if (rocky && ROCKPAT) { c.save(); c.clip(); const ts = 1.6 * z, tw = ROCKTEX.width * ts; ROCKPAT.setTransform(new DOMMatrix([ts, 0, 0, ts, ((VW / 2 - cx * z) % tw + tw) % tw, Y(-16)]));
        c.globalCompositeOperation = 'overlay'; c.globalAlpha = .55; c.fillStyle = ROCKPAT; c.fillRect(0, Y(-60), VW, VH); c.restore(); }
      // (build 245, owner: "merge the base of the mountain with the dark layer so they look continuous ... as is the fog and
      // blue make it feel distinct"): beyond his stretch of the path the ground is the mountain's own foot: a soft rise in the
      // tone of the rock's base, laid a little over the painting's lower edge, darkening down into the floor of the nearest
      // crags (their tone at their base line), so rock, ground and the dark band are one
      if (rocky) alongPath(x => 1 - inPath(x), q => { const t0 = Y(-34), t1 = Y(150), b = mix([40, 30, 29], [35, 26, 25], dark), g = q.createLinearGradient(0, t0, 0, t1), u = (Y(-4) - t0) / (t1 - t0);
        g.addColorStop(0, css(b, 0)); g.addColorStop(clamp(u), css(b)); g.addColorStop(clamp(u + (1 - u) * .45), css(mix(b, [15, 12, 11], .6))); g.addColorStop(1, css([15, 12, 11])); q.fillStyle = g; q.fillRect(0, t0, VW, VH - t0 + 2); }); };
    road();
    // (easter eggs 3 and 7) the lizards on the path's stony edge, and the three hidden lights in its crevices
    if (rocky && Zw < .5) {
      for (const L of LIZ) { if (L.a <= 0) continue; const px = X(L.x), py = Y(L.y), k = z * 1.7, f = L.f, run = L.st === 'run';
        if (px < -40 || px > VW + 40) continue;
        const bob = !run && (L.t % 260) < 24 ? Math.sin((L.t % 260) / 24 * Math.PI) * 1.2 : 0, step = run ? Math.sin(L.run * 1.6) : 0;
        c.save(); c.globalAlpha = L.a; c.translate(px, py); c.scale(f * k, k); c.fillStyle = css(mix([30, 25, 27], [24, 20, 23], dark)); c.strokeStyle = c.fillStyle; c.lineCap = 'round';
        // tail, body, head, and four short legs that scurry when it runs
        c.lineWidth = 2; c.beginPath(); c.moveTo(-4, -2); c.quadraticCurveTo(-10, -1.2 + step * .8, -14, -2.6); c.quadraticCurveTo(-16.5, -3.6, -17.5, -2.8); c.stroke();
        c.beginPath(); c.ellipse(0, -2.2, 5.2, 2.2, 0, 0, 7); c.fill();
        c.beginPath(); c.ellipse(5.8, -2.9 - bob, 2.4, 1.6, -.2 - bob * .1, 0, 7); c.fill();
        c.lineWidth = 1.1; for (const [lx, ph2] of [[2.6, 0], [-2.6, 1]]) for (const sd of [1, -1]) { const sw = run ? Math.sin(L.run * 1.6 + ph2 * 3 + (sd > 0 ? 0 : 1.5)) * 1.4 : 0; c.beginPath(); c.moveTo(lx, -1.2); c.lineTo(lx + sw + .8 * sd, 0); c.stroke(); }
        // the fire's warm light along its back
        c.strokeStyle = css([236, 150, 96], .45 * burnR); c.lineWidth = .55; c.beginPath(); c.moveTo(-4.5, -4); c.quadraticCurveTo(0, -4.7, 4, -4); c.quadraticCurveTo(6, -4.8, 7.6, -3.6); c.stroke();
        c.restore(); }
      for (const h of HIDDEN) { const u = h.up / 220; if (u >= 1) continue; const px = X(h.x), py = Y(h.y - (h.got ? 160 * Math.pow(u, 1.3) : 0)); if (px < -40 || px > VW + 40) continue;
        const k = h.got ? 1.4 * (1 - u) : .45 + .2 * Math.sin(G.t / 37 + h.x), r = (h.got ? 16 + 10 * u : 9) * z;
        const g = c.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, css([255, 236, 190], .55 * k)); g.addColorStop(.3, css([255, 214, 150], .22 * k)); g.addColorStop(1, css([255, 200, 140], 0));
        c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(px - r, py - r, 2 * r, 2 * r); c.fillStyle = css([255, 246, 220], .6 * k); c.beginPath(); c.arc(px, py, Math.max(.8, 1.3 * z), 0, 7); c.fill(); c.restore(); } }
    // the swell of the brow, on the road (only on the plain, where he goes out of sight over it)
    // build 323 (owner: "the bump has hard line between it and the ground below. also the path looks different as it goes
    // from one to the other"): the brow is now the ROAD ITSELF rising: column by column it is painted with the road's own
    // gradient hung from its top line (the road's pale worn edge, then its earth), and it runs down past the road's edge
    // to where that edge has faded, so there is no seam, and the worn edge of the road IS the path over the top
    // (the brow's body is drawn inside road(); here only its soft top edge, a hair higher and fainter each time)
    const humpDraw = () => { const rc = mix([46, 40, 36], [22, 22, 30], dark), top = mix(rc, [120, 116, 100], .25);
      // (build 327) only ABOVE the brow's outline, so the brow's body is the road's own surface, not lightened by these layers
      c.save(); c.beginPath(); c.moveTo(X(BROW0 - 340), 0); c.lineTo(X(BROW0 - 340), Y(0)); for (let x = BROW0 - 330; x <= CREST + 570; x += 10) c.lineTo(X(x), Y(-crest(x))); c.lineTo(X(CREST + 580), Y(0)); c.lineTo(X(CREST + 580), 0); c.closePath(); c.clip();
      c.fillStyle = css(top); for (const [up, al] of [[6, .14], [3.5, .3], [1.6, .55]]) { c.globalAlpha = al; c.beginPath(); c.moveTo(X(BROW0 - 340), Y(1)); for (let x = BROW0 - 330; x <= CREST + 570; x += 10) c.lineTo(X(x), Y(-crest(x) - up * (crest(x) / 52))); c.lineTo(X(CREST + 580), Y(1)); c.fill(); } c.globalAlpha = 1; c.restore();
    };
    if (!rocky && !gateish && X(BROW0 - 300) < VW && X(CREST + 600) > 0) humpDraw();
    // build 334 (owner: "can you put a gravelly path arcing from where he started over the hill (showing its a detour from
    // the flat path forward"); build 336 (owner: "the tip needs to transition over hill better (look like path going over) -
    // also please add a path going straight so it looks like fork in the road"): ONE worn gravel way runs along the road on
    // the fair plain, and where the brow begins it FORKS: the straight way goes on flat along the road (drawn last: it is
    // nearer than the brow), the turning climbs the brow exactly where his feet go and goes over its top, narrowing as it
    // tips away and vanishing behind the outline (clipped there), as he does. Pale trodden earth in soft layered bands with
    // fine stones set by place on the land (a fixed hash, so they slide with the ground and never shimmer).
    const gravel = () => { if (rocky || gateish >= .5) return;
      const bed = mix([104, 92, 76], [34, 33, 38], dark), bed2 = mix([126, 112, 92], [40, 39, 44], dark), lt = mix([176, 160, 132], [70, 68, 74], dark), dk = mix([28, 24, 22], [14, 14, 18], dark), hh = n => { const t = Math.sin(n * 127.1 + 31.7) * 43758.5453; return t - Math.floor(t); };
      const L = cx - VW / 2 / z - 12, Rr = cx + VW / 2 / z + 12, F0 = BROW0 - 330;
      // (build 338, owner: "the straight path should look a little less hard lines but have some slight bumpiness (wave) to it"):
      // the way wanders a little up and down and swells and narrows along its length, set by place on the land
      const wav = x => 1.7 * Math.sin(x * .0093 + .6) + 1.1 * Math.sin(x * .027 + 2.3) + .5 * Math.sin(x * .061 + 4.1), wid = x => .82 + .16 * Math.sin(x * .013 + 1.7) + .1 * Math.sin(x * .041 + .4);
      const way = (xa, xb, fy, wf, seed, T = 1) => { if (xb <= xa) return;
        for (const [up, dn, al, bc] of [[7, 9.5, .12, bed], [6, 8, .16, bed], [5, 6.5, .2, bed], [4, 5, .24, bed], [3, 3.6, .22, bed2], [2, 2.2, .2, bed2]]) { c.beginPath();
          for (let x = xa; x <= xb; x += 4) c.lineTo(X(x), fy(x) - up * T * z * wf(x)); c.lineTo(X(xb), fy(xb) - up * T * z * wf(xb)); for (let x = xb; x >= xa; x -= 4) c.lineTo(X(x), fy(x) + dn * T * z * wf(x)); c.lineTo(X(xa), fy(xa) + dn * T * z * wf(xa));
          c.closePath(); c.fillStyle = css(bc, al); c.fill(); }
        for (let x = Math.floor(xa / 1.4) * 1.4; x <= xb; x += 1.4) { const k0 = Math.round(x / 1.4) + seed, f = Math.min(1, wf(x)); if (f < .08) continue;
          for (let j = 0; j < 3; j++) { const r1 = hh(k0 * 3.1 + j * 17), r2 = hh(k0 * 7.7 + j * 5), r3 = hh(k0 * 1.3 + j * 11); if (r1 > .55 + .35 * (1 - f) || (T > 1 && j === 2 && r1 > .3)) continue;
            const px = X(x + r2 * 1.4), py = fy(x + r2 * 1.4) + (r3 * 11 - 5) * T * z * f, rr = (.3 + .6 * hh(k0 + j * 3)) * z * (.5 + .5 * f);
            c.fillStyle = css(dk, .4 * f); c.beginPath(); c.ellipse(px, py + rr * .25, rr * 1.15, rr * .6, 0, 0, 6.283); c.fill();
            c.fillStyle = css(lt, (.2 + .3 * r3) * f); c.beginPath(); c.ellipse(px - rr * .15, py - rr * .1, rr * .8, rr * .42, 0, 0, 6.283); c.fill(); } } };
      c.save();
      // the turning, clipped to the brow's body so it tips over the top and is lost behind it
      if (X(F0) < VW && X(CREST + 120) > 0) { c.save(); c.beginPath(); c.moveTo(X(F0 - 10), VH); c.lineTo(X(F0 - 10), Y(.5)); for (let x = F0; x <= CREST + 130; x += 6) c.lineTo(X(x), Y(-crest(x) + .3)); c.lineTo(X(CREST + 140), VH); c.closePath(); c.clip();
        way(Math.max(F0, L), Math.min(CREST + 120, Rr), x => Y(pathOff(x) - crest(x) + wav(x) * (1 - smooth(F0, F0 + 160, x))), x => (.35 + .65 * smooth(F0, F0 + 120, x)) * (1 - .95 * smooth(CREST - 60, CREST + 110, x)) * lerp(wid(x), 1, smooth(F0, F0 + 160, x)), 1); c.restore(); }
      // the straight way, on along the road: the true way, wider and more trodden than the turning (build 340, owner:
      // "can you make straight path a little wider")
      way(L, Rr, x => Y(12 + wav(x)), wid, 0, 1.4);
      c.restore(); };
    gravel();
    // the lantern's and the open door's light lie in flat pools on the road
    if (gateOn) { c.save(); c.globalCompositeOperation = 'lighter';
      for (const [px, rr, al, col] of [[lnx + 10 * z, 190 * z, .24 * flick * (1 - .4 * open), [255, 170, 90]], [gx - 110 * z, 300 * z, .5 * open, [255, 208, 134]], [gx - 10 * z, 110 * z, .55 * open, [255, 236, 190]]]) { if (al < .01) continue; c.save(); c.translate(px, Y(5)); c.scale(1, .09); const g = c.createRadialGradient(0, 0, 0, 0, 0, rr); g.addColorStop(0, css(col, al)); g.addColorStop(1, css(col, 0)); c.fillStyle = g; c.fillRect(-rr, -rr, 2 * rr, 2 * rr); c.restore(); }
      c.restore();
      // his shadow lies flat on the road, away from the open door
      if (open > .02 && C3.x > GATE_X - 400) { const sx = X(C3.x), len = 200 * z; c.save(); c.translate(sx - len * .5, Y(4)); c.scale(len, 7 * z); const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, css([2, 2, 4], .95 * open)); g.addColorStop(.55, css([2, 2, 4], .7 * open)); g.addColorStop(1, css([2, 2, 4], 0)); c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore(); }
    }
    // (build 170, owner: "The tree roots need to reach brown ground or they didn't look right": the oak is drawn AFTER the road now,
    // standing at the road's own edge and sliding with it, so its roots go down into the dark earth of the road)
    // THE OAK IN LEAF where the two ways cross (owner, build 158: "the tree at beginning needs redo - the color scheme too -
    // like the green but we need beautiful and intriguing entry - think about the artist we are using - maybe a
    // generated tree like slough but with leaves"). Grown by the Slough's own tree code with another seed, so it is
    // kin to the bare black oak over the mire, but alive: he is out of the slough. It stands as the great dark tree
    // of John Martin's quiet pictures (The Plains of Heaven), its long limb reaching over the place where the two
    // meet, with the light of late afternoon in the edge of its crown.
    OAKBOX = null;
    // (build 326, owner: "the oak tree should not be visible at all when you zoom out from mountain as it is back up the hill far
    // away"): it is never drawn among the rocks (it stands at the crossing; the wide shot's camera would show it)
    if (OAKP && !rocky) { const M = OAK_META, s = M.k * z, tx = VW / 2 + (MEET - 250 - cx) * z, ty = Y(7), x0 = tx - M.ax * s, y0 = ty - M.ground * s, w = M.w * s, h = M.h * s;
      if (x0 < VW && x0 + w > 0) { OAKBOX = [x0, y0, w, h];
        // build 309: a low swell of earth round its foot, the road's own colour rising softly into the field, so the ground
        // gathers up round the roots (and the road's pale edge is covered there)
        { const ec = mix([46, 40, 36], [22, 22, 30], dark); c.save(); c.translate(tx + 40 * z, Y(3)); c.scale(1, .035); const g = c.createRadialGradient(0, 0, 0, 0, 0, 300 * z); g.addColorStop(0, css(ec, .5)); g.addColorStop(.6, css(ec, .25)); g.addColorStop(1, css(ec, 0)); c.fillStyle = g; c.fillRect(-300 * z, -300 * z, 600 * z, 600 * z); c.restore(); }
        { c.save(); c.translate(tx + 70 * z, Y(-1)); c.scale(1, .09); const g = c.createRadialGradient(0, 0, 0, 0, 0, 360 * z); g.addColorStop(0, css([14, 26, 20], .46 * (1 - dark))); g.addColorStop(1, css([14, 26, 20], 0)); c.fillStyle = g; c.fillRect(-360 * z, -360 * z, 720 * z, 720 * z); c.restore(); }
        c.drawImage(OAKP.c, x0, y0, w, h);
        // (build 202, owner: "when the tree is shown, the light outline flickers on both side of tree"): the edge used to jump from
        // one side to the other the moment the sun passed the trunk (and back and forth while the camera settled); now the two
        // edges cross-fade as the sun passes behind the trunk, slowly
        // build 283 (owner: "yes remove lining from tree too please"): the oak's bright edge toward the sun is off (ra 0), as
        // the figures' crisp line went in build 282; the code stays in case it is wanted back
        { const ra = 0 * (1 - dark) * (1 - gateish) * .42, sR = smooth(-w * .1, w * .1, lx - tx); if (ra > .02) { if (sR > .01) { c.globalAlpha = ra * sR; c.drawImage(OAKP.rimR, x0, y0, w, h); } if (sR < .99) { c.globalAlpha = ra * (1 - sR); c.drawImage(OAKP.rimL, x0, y0, w, h); } c.globalAlpha = 1; } }
        if (dark < .5) { c.save(); c.globalCompositeOperation = 'lighter'; OAKP.tw.forEach(([px, py], i) => { const v = Math.sin(G.t / (26 + (i * 37) % 60) + i * 2.4); if (v < .55) return; const al = Math.pow((v - .55) / .45, 2) * .38 * (1 - 2 * dark);
            c.fillStyle = css([255, 238, 180], al); c.beginPath(); c.arc(x0 + px * s, y0 + py * s, (.6 + 1.2 * al) * z, 0, 7); c.fill(); }); c.restore(); }
        // THE SUN THROUGH THE LEAVES (owner, build 173): when the low sun stands behind the crown it breaks through the gaps: a
        // small flare, a few soft spokes of light that turn as he walks, and dapples of light in the oak's shade
        { const inX = smooth(x0 + w * .04, x0 + w * .22, lx) * (1 - smooth(x0 + w * .8, x0 + w * .98, lx)), inY = smooth(y0, y0 + h * .1, ly) * (1 - smooth(y0 + h * .62, y0 + h * .74, ly)), sun = inX * inY * (1 - dark) * (1 - gateish);
          if (sun > .02) { c.save(); c.globalCompositeOperation = 'lighter';
            const fl2 = .75 + .25 * Math.sin(cx * .05) * Math.sin(cx * .017 + 1), g = c.createRadialGradient(lx, ly, 0, lx, ly, 90 * z); g.addColorStop(0, css([255, 250, 228], .95 * sun * fl2)); g.addColorStop(.05, css([255, 236, 180], .7 * sun * fl2)); g.addColorStop(.22, css([255, 210, 140], .26 * sun * fl2)); g.addColorStop(1, css([255, 210, 140], 0)); c.fillStyle = g; c.fillRect(lx - 90 * z, ly - 90 * z, 180 * z, 180 * z);
            // (build 267: the turning spokes of a camera's star flare are gone; only the soft glow through the leaves, a little wider)
            c.restore(); }
          // (dapples of light in the shade were tried here and read as stepping stones: taken out)
        }
        if (dark > .02) { c.globalAlpha = Math.min(1, dark * .85); c.drawImage(OAKP.d, x0, y0, w, h); c.globalAlpha = 1; }
        if (dark < .6) for (let i = 0; i < 7; i++) { const T = 620 + i * 97, u = ((G.t + i * 233) % T) / T, lx2 = tx + (-90 + i * 60 + 34 * Math.sin(u * 7 + i)) * z + 50 * u * z, ly2 = ty - (260 - 30 * (i % 3)) * z * (1 - u), al = Math.sin(Math.PI * u) * .9 * (1 - dark);
          c.save(); c.translate(lx2, ly2); c.rotate(u * 9 + i); c.fillStyle = css([44, 50, 36], al); c.beginPath(); c.ellipse(0, 0, 3 * z, 1.3 * z, 0, 0, 7); c.fill(); c.restore(); } } }
    if (!OAKP && !OAKL && typeof SL !== 'undefined' && SL.grow) OAKL = bakeOak();
    if (!OAKP && OAKL && !rocky) { const s = .88 * z, tx = VW / 2 + (MEET - 185 - cx) * .92 * z, ty = Y(-6), w = OAKL.c.width * s, h = OAKL.c.height * s, x0 = tx + OAKL.x0 * s, y0 = ty + OAKL.y0 * s;
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
    // (easter egg 4) the bird that flew out of the oak, and the leaves it shook down
    if (!rocky) { c.save(); c.lineCap = 'round';
      for (const b of OBIRD) { const px = X(b.x), py = Y(b.y), w = 7 * z, beat = .45 + .55 * Math.sin(b.t / 3.2 + b.ph), al = Math.min(1, b.t / 6) * (1 - smooth(300, 420, b.t)) * (1 - dark);
        c.strokeStyle = css([40, 36, 38], .9 * al); c.lineWidth = Math.max(.8, 1.1 * z); c.beginPath(); c.moveTo(px - w, py - beat * w * .8); c.quadraticCurveTo(px - w * .4, py - w * .2, px, py); c.quadraticCurveTo(px + w * .4, py - w * .2, px + w, py - beat * w * .8); c.stroke(); }
      for (const l of OLEAF) { const u = l.t / l.life, al = Math.min(1, l.t / 10) * (1 - smooth(.75, 1, u)) * .9 * (1 - dark); c.save(); c.translate(X(l.x), Y(l.y)); c.rotate(l.t / 14 + l.s); c.fillStyle = css([40, 48, 40], al); c.beginPath(); c.ellipse(0, 0, 3 * z, 1.3 * z, 0, 0, 7); c.fill(); c.restore(); }
      c.restore(); }
    // the people (in the world's own units)
    c.save(); c.translate(VW / 2 - cx * z, wl); c.scale(z, z);
    RIM = { k: (1 - dark) * (1 - gateish) * .9, x: (lx - VW / 2) / z + cx };
    SUNSH = !rocky && gateish < .5 && ph !== 'title' ? (1 - dark) * (1 - gateish * 2) : 0;
    HAZE = false && rocky && ph !== 'title' && ph !== 'mist' ? { k: 1 - Zw, c: mix([156, 124, 120], [120, 96, 104], dark) } : null;
    FIRE = rocky && ph !== 'title' ? { k: clamp(dark) * (1 - .4 * calm), x: HX0 + 600, f: Math.min(1, flash) } : null;
    // (build 235, one set of lights at the gate: the door's light falls on the side of him that faces it, the lantern
    // above warms his head and shoulders; Good-will in the doorway is lit from behind, so he stays dark with a lit edge)
    if (!FIRE && gateish > .5) { const op = smooth(0, 1, door); FIRE = { k: smooth(.5, 1, gateish) * (.3 + .7 * op), x: op > .05 ? GATE_X + 14 : GATE_X - 72, f: 0, warm: [255, 206, 140], cool: [8, 6, 6] };
      // (build 246, after Rembrandt: once the door opens he is a dark figure with a gold edge on the side that faces the light)
      if (op > .05) RIM = { k: .95 * op * smooth(.5, 1, gateish), x: GATE_X + 40, gold: true }; }
    const tint = rocky ? mix([38, 35, 39], [30, 27, 32], dark) : mix([74, 68, 60], [52, 47, 52], dark), fl = Math.min(1, flash) * dark, lit = gateish * smooth(GATE_X - 330, GATE_X - 60, C3.x), tintF = mix(mix(mix(tint, [66, 62, 72], gateish), [255, 170, 110], fl * .35), [255, 188, 120], lit * (.24 + .26 * door));
    const tintM0 = mix(tintF, [255, 204, 150], (ph === 'back' ? 0 : mercy) * .42);
    // (build 225, owner: "Instead of shadow can you just make Christian super dark"): at the gate he is a near-black figure
    // against the lit wall and the light from within, like Good-will in the doorway (no light and shade laid on him)
    const tintM = mix(tintM0, [30, 15, 11], .86 * smooth(.5, 1, gateish));      // build 231, owner: "I think christian looks too dark": dark against the light, not black
    if (mercy > .01) { const mx = ph === 'back' ? EV_X + 20 : (C3.x + EV_X) / 2; c.save(); c.globalCompositeOperation = 'lighter';
      { c.save(); c.translate(mx, 5); c.scale(1, .1); const g = c.createRadialGradient(0, 0, 0, 0, 0, 210); g.addColorStop(0, css([255, 196, 126], .5 * mercy)); g.addColorStop(1, css([255, 180, 110], 0)); c.fillStyle = g; c.fillRect(-210, -210, 420, 420); c.restore(); }
      { const g = c.createRadialGradient(mx, -84, 0, mx, -84, 170); g.addColorStop(0, css([255, 206, 150], .2 * mercy)); g.addColorStop(1, css([255, 190, 130], 0)); c.fillStyle = g; c.fillRect(mx - 170, -254, 340, 340); }
      c.restore(); }
    // ONE KEY WITH LEVEL 2: Level 2's last mist still lies over the plain as the level opens and thins as he walks out of
    // it; laid before the figures, so it is behind and beside them, never between us and him (a picture rule)
    { const mist = mono * (1 - smooth(START, START + MIST0, C3.x)) * (1 - dark);
      if (mist > .005) { c.save(); c.setTransform(S, 0, 0, S, 0, 0); const g = c.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, css([240, 228, 200], .26 * mist)); g.addColorStop(.5, css([244, 232, 204], .66 * mist)); g.addColorStop(.82, css([232, 220, 196], .5 * mist)); g.addColorStop(1, css([214, 202, 182], .2 * mist)); c.fillStyle = g; c.fillRect(0, 0, VW, VH); c.restore(); } }
    // THE ARROWS ({62}): over the wall from the castle, falling short of him, into the wall and the road, and staying there
    if (ARW.length) { c.save(); c.setTransform(S, 0, 0, S, 0, 0); c.lineCap = 'round';
      for (const a of ARW) { if (a.t < 0) continue; const u = a.stuck ? 1 : a.t / 24, x = lerp(a.sx, a.tx, u), y = a.sy + (a.ty - a.sy) * Math.pow(u, 1.5) - 70 * Math.sin(Math.PI * u) * (1 - u);
        const dx = a.tx - a.sx, dy = (a.ty - a.sy) * 1.5 * Math.pow(Math.max(u, .05), .5) - 70 * Math.PI * Math.cos(Math.PI * u) * (1 - u), ang = Math.atan2(dy, dx) + (a.stuck ? .06 * a.q * Math.sin(G.t * 1.9) : 0);
        const L = 44 * z, vis = a.stuck ? .62 : 1, hx = X(x), hy = Y(y), tx = hx - Math.cos(ang) * L * vis, ty = hy - Math.sin(ang) * L * vis;
        c.strokeStyle = css([26, 16, 13], .95); c.lineWidth = Math.max(1, 1.5 * z); c.beginPath(); c.moveTo(tx, ty); c.lineTo(hx, hy); c.stroke();
        { const nx = -Math.sin(ang), ny = Math.cos(ang), o = -1.1 * z; c.strokeStyle = css([236, 196, 142], .55); c.lineWidth = Math.max(.7, .8 * z); c.beginPath(); c.moveTo(tx + nx * o, ty + ny * o); c.lineTo(hx + nx * o, hy + ny * o); c.stroke(); c.strokeStyle = css([26, 16, 13], .95); }
        c.lineWidth = Math.max(.8, 1.1 * z); for (const s2 of [-1, 1]) { c.beginPath(); c.moveTo(tx + Math.cos(ang) * 5 * z, ty + Math.sin(ang) * 5 * z); c.lineTo(tx - Math.cos(ang + s2 * .5) * 5 * z, ty - Math.sin(ang + s2 * .5) * 5 * z); c.stroke(); }
        if (!a.stuck) { c.fillStyle = css([26, 16, 13]); c.beginPath(); c.moveTo(hx + Math.cos(ang) * 4 * z, hy + Math.sin(ang) * 4 * z); c.lineTo(hx + Math.cos(ang + 2.5) * 3 * z, hy + Math.sin(ang + 2.5) * 3 * z); c.lineTo(hx + Math.cos(ang - 2.5) * 3 * z, hy + Math.sin(ang - 2.5) * 3 * z); c.fill(); } }
      c.restore(); }
    if (evan && evan.x != null && EVW.ready) {
      // walking in out of the haze, then his standing frames dissolve in over the walk frame
      const ex = evan.x, fa = smooth(EV_X - EV_FROM, EV_X - EV_FROM + 220, ex), st = evan.st; TALKM = talkMove(E); foot(c, ex, fa);
      // (build 355, owner: "when evangelist shows up, there some cropping needed on evangelists sprite"): no cross-fade from
      // his walk to his standing picture (both half see-through at once showed his arm and staff twice, a grey flap under the
      // sleeve): he walks in, stops on a planted step, and the standing picture takes his place whole
      // the walking picture is matched to the standing one: 1.048 times its size (measured: 292 against 306 picture pixels
      // from the feet to the head) and set 37.5 picture pixels right (where the standing picture's body stands from its `ax`),
      // so at the swap he neither grows nor jumps sideways
      if (st < .5 || !EVS.ready) { FK = 1.048; figure(c, 'evw', EVW[Math.floor(evan.anim) % EVW.length], EVW_META, ex + 37.5 * CHR_K, 1, tintM, fa); FK = 1; }
      else evFig(c, ex, tintM, 1);
      TALKM = null;
    } else if (evan && EVS.ready) { TALKM = talkMove(E); foot(c, EV_X, evan.a); evFig(c, EV_X, tintM, smooth(.25, 1, evan.a)); TALKM = null; }
    if (wise && (WIS.ready || OBS.ready)) {
      const wt = mix([80, 72, 62], [92, 82, 84], dark); TALKM = talkMove(WW); foot(c, wise.x, wise.alpha);
      const { W, M, S, SM } = wFig(), wim = W[Math.floor(wise.anim) % W.length];
      if (S && wise.st > 0) { figure(c, 'wst', S, SM, wise.x, -1, wt, wise.alpha * smooth(0, .6, wise.st), breath(2)); figure(c, 'wis', wim, M, wise.x, -1, wt, wise.alpha * (1 - smooth(.4, 1, wise.st))); }
      else figure(c, 'wis', wim, M, wise.x, -1, wt, wise.alpha);
      TALKM = null;
    }
    // in the wide shot he is a tiny dark figure: a faint warm light round him so the eye can find him
    if (Zw > .05) { const g = c.createRadialGradient(C3.x, -60, 0, C3.x, -60, 34 / z); g.addColorStop(0, css([255, 196, 130], .28 * Zw)); g.addColorStop(1, css([255, 170, 110], 0)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(C3.x - 34 / z, -60 - 34 / z, 68 / z, 68 / z); c.restore(); }
    gateHere = gateish > .5; CHRSH_N = null; c.save(); c.translate(0, C3.dy || 0); drawChr(c, tintM); c.restore(); RIM = null; HAZE = null; SUNSH = 0; FIRE = null; CHRSH = gateHere ? CHRSH_N : null; gateHere = false;
    c.restore();
    // over the brow: the near ground is drawn again over him as he goes down behind it
    // (build 202, owner: "when he goes down after talking with worldly wise, he flickers a little": the near ground used to be
    // drawn over him only once he was below the road line, so for a moment his feet sank into the slope and then were cut
    // off at once; now it covers him from the moment he passes the top)
    if ((ph === 'aside' || ph === 'down') && C3.x > CREST - 2) { c.save(); c.beginPath(); const xc0 = Math.round(X(CREST)); c.moveTo(xc0, VH); c.lineTo(xc0, Y(-crest(CREST))); for (let x = CREST + 10; x <= CREST + 700; x += 10) c.lineTo(X(x), Y(-crest(x))); c.lineTo(VW, Y(0)); c.lineTo(VW, VH); c.clip(); road(); humpDraw(); gravel(); c.restore(); }
    // the nearest crags, along the bottom of the picture, in front of everyone
    // (build 212, owner: "the layer in front of Christian as he walks toward mountain can be higher in point and fully go in
    // front of him - maybe make nice shapes like the layer behind him"): the nearest crags are the same leaning spurs as the
    // layer behind, wider, and now and then a tall one passes wholly in front of him; near the foot, where he and
    // Evangelist stand and talk, they stay low (`clear`)
    // (build 237, owner: "top layer of rock (dark) can be more varied up and down so we see his body go behind and then appear
    // quickly"): the nearest crags are narrow spurs (`wk`), tall ones all along the path, with deep dips between (a low floor, `fl`);
    // build 238 ("not quite so pointy and slightly more varied in shape and maybe not quite so much covering Christian"): each
    // spur's width varies (.65 to 1.55 of `wk`), its brow a little longer and rounded, and they are a little lower (210 to 430)
    // (easter egg 1) the stone that misses him: drawn nearer than the figures, so it crosses the way in front of him and
    // drops off the near edge behind the nearest crags
    for (const r of ROLL) { const px = X(r.x), py = Y(r.y), rr = r.r * z; if (px < -60 || px > VW + 60) continue;
      c.save(); c.translate(px, py); c.rotate(r.t * .16 + r.s); c.fillStyle = css([18, 14, 15], .98); c.beginPath(); r.sh.forEach((q, i) => { const an = i / 7 * 6.283; i ? c.lineTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .85) : c.moveTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .85); }); c.closePath(); c.fill();
      c.strokeStyle = css([236, 150, 96], .4 * burnR); c.lineWidth = Math.max(.6, rr * .1); c.beginPath(); for (let i = 5; i <= 7; i++) { const an = i / 7 * 6.283, q = r.sh[i % 7]; i === 5 ? c.moveTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .85) : c.lineTo(Math.cos(an) * q * rr, Math.sin(an) * q * rr * .85); } c.stroke(); c.restore(); }
    if (rocky) crags(1.3, 29, 240, 150, 210, 430, [15, 12, 11], .25 * burnR, true, .45, 0, FOOT - 70, .22, .62);
    // his hand held out, waiting for the child's touch: a faint warm light gathers round it
    if (G.act === 'ehand' && evan && evan.g > .5) { const [hx, hy] = handPt(), r = 26 + 40 * cam.z, k = (evan.g - .5) * 2 * (.75 + .25 * Math.sin(G.t / 30));
      const g = c.createRadialGradient(hx, hy, 0, hx, hy, r); g.addColorStop(0, css([255, 214, 160], .32 * k)); g.addColorStop(1, css([255, 190, 130], 0)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(hx - r, hy - r, 2 * r, 2 * r); c.restore(); }
    // (idea F) the stone over the gate glints now and then until it has been touched: a soft warm gleam passing along it
    if ((ph === 'gate' || ph === 'knock') && !signSeen && veil < .5) { const [sx, sy, sw] = signPt(), k = Math.pow(Math.max(0, Math.sin(G.t / 55)), 6), gx = sx + sw * .8 * Math.sin(G.t / 110);
      if (k > .02) { const g = c.createRadialGradient(gx, sy, 0, gx, sy, sw * .9); g.addColorStop(0, css([255, 226, 170], .45 * k)); g.addColorStop(1, css([255, 200, 140], 0)); c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(gx - sw, sy - sw, 2 * sw, 2 * sw); c.restore(); } }
    // the smoke Evangelist comes out of
    if (evan && evan.a < 1) { const ex = X(EV_X - 30), ey = Y(-90), a = Math.sin(Math.PI * clamp(evan.a * 1.1)) * .8 + (1 - evan.a) * .0; c.globalAlpha = a; for (let i = 0; i < 3; i++) c.drawImage(SMOKE, ex - (200 + i * 40) * z + 30 * Math.sin(G.t / 90 + i), ey - (110 - i * 30) * z, 400 * z, 200 * z); c.globalAlpha = 1; }
    // ONE KEY WITH LEVEL 2: the colour held down to Level 2's warm silver-gold (the mist is laid before the figures, below);
    // the flash and the dark of the turning aside still show through
    if (mono > .005) {
      c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = css([128, 128, 128], MONO_SAT * mono); c.fillRect(0, 0, VW, VH);
      c.globalCompositeOperation = 'color'; c.fillStyle = css(MONO_TONE, .34 * mono); c.fillRect(0, 0, VW, VH); c.restore();
    }
    // (7) the glints: a soft four-pointed sparkle that grows and fades in a second
    for (const g of GLINTS) { const [gx, gy] = g.pos(), u = g.t / 60, k = Math.sin(Math.PI * u), r = 16 * k + 3; c.save(); c.globalCompositeOperation = 'lighter'; c.translate(gx, gy); c.rotate(u * .6);
      c.fillStyle = css([255, 244, 214], .75 * k); for (const a of [0, Math.PI / 2]) { c.save(); c.rotate(a); c.beginPath(); c.moveTo(-r, 0); c.quadraticCurveTo(0, -1.2, r, 0); c.quadraticCurveTo(0, 1.2, -r, 0); c.fill(); c.restore(); }
      const gg = c.createRadialGradient(0, 0, 0, 0, 0, r * .9); gg.addColorStop(0, css([255, 236, 190], .5 * k)); gg.addColorStop(1, css([255, 220, 160], 0)); c.fillStyle = gg; c.fillRect(-r, -r, 2 * r, 2 * r); c.restore(); }
    // the flash over everything, the veil of mist between the hill and the gate, the burned edges
    if (flash > .02) { c.fillStyle = css([255, 176, 120], .07 * Math.min(1, flash)); c.fillRect(0, 0, VW, VH); }
    if (cut > .003) { c.fillStyle = css([10, 9, 12], smooth(0, 1, cut)); c.fillRect(0, 0, VW, VH); }
    if (veil > .003) { c.fillStyle = css(mix([226, 222, 214], [150, 146, 150], dark), smooth(0, 1, veil)); c.fillRect(0, 0, VW, VH); }
    { const g = c.createRadialGradient(VW * .5, VH * .5, VH * .42, VW * .5, VH * .5, VW * .78); g.addColorStop(0, 'rgba(12,12,18,0)'); g.addColorStop(1, css(mix([12, 12, 18], [16, 7, 5], gateish), .42 + .2 * dark + .22 * gateish)); c.fillStyle = g; c.fillRect(0, 0, VW, VH); }
    // touches, the ring that shows where to touch, the things he carries
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2; for (const k of [0, .5]) { const q = (G.t / 80 + k) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, 14 + q * 40, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    if (HL.on) drawItems();
  }

  // for testing: HL.peek() tells where the story is
  return { on: false, show: false, hillPics: () => HILL, title, start, update, draw, touch, key, preload, lines: ALL, pt: k => k === 'pull' ? gwHandPt() : k === 'hill' ? hillPt() : k === 'hand' ? handPt() : k === 'sign' ? signPt() : k === 'oak' ? (OAKBOX ? [OAKBOX[0] + OAKBOX[2] * .3, OAKBOX[1] + OAKBOX[3] * .45] : null) : k === 'hid' ? (h => h ? [(h.x - cam.cx) * cam.z + VW / 2, cam.wl + h.y * cam.z] : null)(HIDDEN.find(h => !h.got)) : gatePt(), peek: () => ({ pull: pullT, ph, x: Math.round(C3.x), eggs: { roll: ROLL.map(r => [Math.round(r.x), Math.round(r.y), r.b]), liz: LIZ.map(L => L.st), hid: HIDDEN.map(h => h.got), birds: OBIRD.length, bird: OBIRD.map(b => [Math.round(b.x), Math.round(b.y), b.t]) }, stones: PATHR.map(r => [Math.round(r.x), Math.round(r.y), r.b]), vil: +vil.toFixed(2), reveal: +reveal.toFixed(2), stillT, zs, zT, Zw: +Zw.toFixed(2), farewell, kf: +(C3.kf || 0).toFixed(1), stand: C3.sd != null, wx: wise && Math.round(wise.x), ex: evan && evan.x != null ? Math.round(evan.x) : null, dark: +dark.toFixed(2), wise: wise && wise.mode, evan: evan && +evan.a.toFixed(2), knocks, cam: { ...cam }, hb: hillBox.map(v => Math.round(v * 100) / 100), boltT, bolt: bolt && bolt.map(l => [l[0], l[l.length - 1]].map(p => p.map(Math.round))) }) };
})();
