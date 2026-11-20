// THE MANNEQUIN (object MQ): Christian drawn in code from first principles. No pictures, nothing traced, nothing stretched.
// 1. A SKELETON (hip, spine, head, legs, arms, hands, the burden), set up as the cut-out animators set up a figure: one
//    root (the hip), each part a child of the one before it, each turning about the middle of its joint, far limbs
//    drawn before near ones. A skeleton pose is 27 numbers:
//      0,1 the hip's place   2 the body's lean   3 the head's nod
//      4..7 far leg: (unused), thigh angle, knee bend, foot pitch (toe up +)   8..11 near leg
//      12,13 far arm: shoulder, elbow   14,15 near arm   16 the burden's tilt
//      17 the shoulder line's turn, 18 the hip line's turn (as seen from above; + = his near side forward)
//      19 the shoulder line's tip, 20 the hip line's tip (as seen from in front; + = his near side up)
//      21,22 far and near wrist (the hand's bend on the forearm)   23,24 far and near fingers (their curl; below 0 = back, toward the palm)
//      25,26 far and near arch of the foot (1 at rest; lower under his weight, higher as he pushes off)
//    Angles: 0 hangs straight down, + swings forward. Units: his walk pack's pixels (he is about 283 tall).
// 2. A BODY on the bones (BODY, body()), by the art schools' measures: seven and a half heads tall, the shoulders a head
//    and a half down, the hips at the middle, the knees two heads above the ground, the elbow at the waist, the wrist at
//    the fork, the fingertips at the middle of the thigh, a hand three quarters of a head long; each part has a real
//    side profile (chest, small of the back, buttock, thigh, calf, the thin ankle; brow, nose and chin; a hand with its
//    thumb and curled fingers; a foot with its heel pad, arch, ball and toes).
// 3. HOW HE WALKS: classic() builds the walk from the animators' four positions (contact, down, passing, up) and the
//    gait laboratories' measures: the hip line and the shoulder line turn against each other, the arms swing from the
//    shoulder as a chain (upper arm, forearm, hand, fingers, each a little later), and the head tips to keep his eyes
//    level; fromTrack() plays a walk measured from frames on the same bones (tools/mannequin/).
// 4. HOW CLOTH MOVES (clothStep): cloth hangs at rest; the body's own surfaces push it out and it cannot pass through
//    them; left alone it swings back like a weight on a string, late, the hem latest (follow-through, overlapping
//    action); going forward the air holds it back (drag); the burden sags a beat after the body.
// 5. THE CLOTHES (figure()) lie on that body with a little ease, as a habit sits on a man: a tunic hung from the
//    shoulders and girded with a knotted cord, wide sleeves, a hood with its shoulder cape, a back panel, the sack bound
//    high on his back, hose and soft shoes. Dark, quiet tones: he is a silhouette first.
const MQ = (() => {
  const K = { ax: 93, ground: 295, hip: [82, 150], neck: [94, 56], head: [104, 31], shoulder: [87, 68],
    thigh: 66, shin: 67, upper: 50, fore: 40, palm: 14, fing: 11.5, heel: [-9, 13], ball: [22, 13], shw: 30, hpw: 15 };      // shw, hpw: half the width between the shoulder joints, and between the hip joints
  const ANIMS = {}, LEGS = [['F', 4], ['N', 8]], DEG = 180 / Math.PI, TAU = 2 * Math.PI;
  // EVERY KEY MEASURE OF HIM IS A NUMBER (MQ.DIM; the lab's sliders set them). After changing build, robe, gait or the
  // hood's bow, call refresh(): his bones, the cloth's rest and the walk are made again.
  //   hood:   beak = how far its top comes forward over his brow, droop = how low the beak's tip hangs, top = room over the
  //           crown, peak = a point at the back of the crown, back = room behind his head, hang = how low the back hangs,
  //           rim = how far back the rim lies on his cheek, cape = how far the cape goes below the shoulder, head = the
  //           size of his head (1 = seven and a half heads), bow = how far his head is bowed, tilt = the whole hood tipped
  //           forward (+) or pushed back, rake = its opening slanted back toward the jaw, size = the whole hood larger
  //           or closer, tail = a tail hanging from the back of the crown, roll = a turned-back rim, bib = how far its
  //           front falls on his chest; and the tip above his forehead: sharp (round or a sharp point), hook (its end
  //           curled down, or flipped up), thick (how thick it is at its root), sweep (its top scooped or bulging),
  //           cut (how far the rim cuts back under it). cape below 0: the hood STOPS ON HIS TRAPS, a collar round
  //           the base of his neck, well before the shoulder (-12 = at the neck's base); above 0 it is a cape
  //           lying down over the shoulder.
  //   face:   nose, chin, brow (1 = as drawn)       shoe: toe = its length past the ball, point, lift (the tip turned up), bulk
  //   leg:    calf, ankle (widths), shaft (how far the boot stands off the leg)
  //   build:  legs, arms (lengths), girth (how deep his body is), lean (how far he leans in)
  //   robe:   hem (longer or shorter), flare, full       sleeve: width at the cuff, drop (how it hangs), len (over the hand)
  //   sack:   size, high (how low on his back it is tied), round (how far it stands out); the smaller bundle tied on top of
  //           it: top (its size, 0 = none), set (further back or forward), flat (a flat roll or a round ball)
  //   hands:  size, width, fingers (their length), curl (0 = straight; more = further back toward the palm), thumb
  //   gait:   step, bob, rock, swagger, arm (swing), bend (the elbow's flexing)
  const HOOD = { beak: 2, droop: -2.8, top: 2.1, peak: 0, back: 6.8, hang: 8.2, rim: -2.8, cape: -12, head: .99, bow: .38, tilt: .1, rake: .8, size: .96, tail: 0, roll: 0, bib: 20,
    sharp: .1, hook: -1, thick: 4.6, sweep: .2, cut: 0 };
  // THE OWNER'S OWN CHOICE (sent as links from the lab's sliders): the hood's first sixteen measures above, but cape, which
  // they asked to be drawn up off the shoulder (before any choice: 5.6, 0, 3.6, 0, 9, 0, 0, 0, 1, .27, then 0, 0, 1, 0, 0, 0), and face, shoe, leg, build, robe, sleeve and the sack's first three below.
  // Before it they were: face 1, 1, 1; shoe 1, 0, 0, 1; leg 1, 1, 1.2; build 1, 1, 1, .075; robe 0, 1, 1; sleeve 23, 1, 7; sack 1, 0, 1.
  const FACE = { nose: .75, chin: 1.1, brow: 1.5, tip: -.5, bridge: .3, lips: .65, jaw: .2, forehead: .2 }, SHOE = { toe: .86, point: .35, lift: .4, bulk: .88 }, LEG = { calf: 1.08, ankle: .92, shaft: 2.1 };
  const BUILD = { legs: 1.07, arms: .98, girth: .98, lean: 0 }, ROBE = { hem: -12, flare: 0, full: 1.17 }, SLEEVE = { width: 13, drop: 1.1, len: 0 };
  const SACK = { size: 1.5, high: -.05, round: 1.14, top: .8, set: 6.5, flat: 1.1, back: 7 }, GAIT = { step: 95, bob: 2.7, rock: .032, swagger: .016, arm: .02, bend: .16 };
  const HANDS = { size: 1, width: 1, fingers: 1, curl: 1, thumb: 1 };
  const DIM = { hood: HOOD, face: FACE, shoe: SHOE, leg: LEG, build: BUILD, robe: ROBE, sleeve: SLEEVE, hands: HANDS, sack: SACK, gait: GAIT };
  // SHAPED BY HAND: each named point of the hood's outline may carry an offset of its own, [dx, dy] in that point's own frame (his
  // head's, or his neck's), laid on top of what the measures give; so a shape drawn by hand goes with him as he moves. The lab's
  // draggable points set them. Names: r0..r5 the rim from under the jaw up to under the tip, tip, tt the tip's top, cf the front
  // of the crown, c1..c4 over the crown to its back, b1..b3 down the back, po where the back meets the collar, e0..e4 the lower
  // edge from the back of the neck to its foot on the chest. While REC is an array, figure() notes each point's place in it.
  // THE OWNER'S OWN SHAPE (sent as a link from the lab's draggable points): the back of the hood drawn in, its collar level and
  // further forward, its foot on the chest a little up and forward, the rim lower under his jaw.
  // HAND.top: the nine points round the bundle on top of his burden (u0 at its top, then round by the front), in the same way.
  const HAND = { hood: { b2: [-1.3, -5.2], b3: [-2.3, -3.8], e0: [-.9, 2.2], e1: [6.8, 1.1], e4: [4.1, -3.3], po: [-5, 1.7], r0: [2.3, 5.1] },
    // the owner's own bundle: taller, fuller, sagging onto the sack at the back
    top: { u0: [3.5, -2.5], u1: [2.5, -1.6], u2: [1.5, -3.8], u4: [1, .5], u5: [1, 2.7], u6: [-2.8, 6.4], u7: [-3.6, 3.3], u8: [-1.1, -2.2] } }; let REC = null;
  // the body's side profile: along each part (0 at its top joint, 1 at its lower), how far its front and its back stand from the bone
  const BODY = {
    thigh: [[0, 11, 13], [.25, 12, 12], [.55, 10.5, 10.5], [.85, 8.6, 8.4], [1, 8, 7.6]],
    shin: [[0, 7.6, 7.2], [.12, 7, 9.2], [.3, 6.6, 11.4], [.5, 6, 10], [.72, 5.4, 7.2], [.9, 5.2, 5.8], [1, 5.6, 6.2]],
    upper: [[0, 7.5, 7.5], [.4, 6.6, 7.2], [.8, 5.6, 6], [1, 5.4, 5.6]],
    fore: [[0, 5.6, 5.8], [.25, 6, 6], [.6, 4.8, 4.6], [1, 3.6, 3.4]],
    torso: [[0, 7, 9], [.08, 10.5, 13], [.18, 16, 17.5], [.3, 19.8, 19], [.42, 20, 17.5], [.55, 18.5, 14.5], [.68, 17, 12], [.8, 17.2, 12.8], [.9, 17, 15.5], [1, 15, 18.8], [1.08, 12.5, 18.5], [1.16, 9, 15], [1.22, 4.5, 9], [1.26, 1, 3]],
    // the head from the side, the middle of the head at 0,0 (a head is his height / 7.5, about 38 tall, three quarters as deep):
    // skull, forehead, brow ridge, the root of the nose, its bridge and tip, the upper lip, the mouth, the lower lip, the
    // hollow under it, the chin, the jaw back to its angle below the ear, the back of the skull
    skull: [[5.5, -18.6], [11.6, -14.6], [14.6, -9.4], [15.9, -5.2], [14.6, -2.2], [16.2, .8], [18.6, 3.4], [19.6, 5], [18.4, 6.3], [15.9, 6.6, 1], [16.9, 8.6], [15.6, 9.9, 1], [16.3, 11.4], [14.8, 13.2], [15.6, 15.6], [13.5, 18], [8, 17.4], [0, 15.4], [-6.6, 13.6], [-13.8, 6.6], [-15.4, -4.4], [-12.7, -14.3], [-3.3, -19.4]],
    // a foot from the side, the ankle joint at 0,0 and the ground at 13 (the ankle is about 4% of his height up, the
    // foot 15% of his height long, a quarter of it behind the ankle): the heel's round pad, the arch, the ball (the pad
    // under the joints of the toes, the lowest point), the crease behind the toes, the toe pad and tip, the toes'
    // knuckles, the instep. A 4th number: how much higher that point of the arch is on the foot's inner side (the far foot shows it)
    foot: [[-5.2, -3], [-9.2, 3], [-11.8, 8], [-10.8, 11.8], [-7, 13], [-2, 12.9], [3, 12, 0, 1], [8, 11.2, 0, 2], [13, 11.4, 0, 1.8], [17.5, 12.5, 0, .5], [21.5, 13], [24.6, 12.8], [26.2, 12.4], [28.4, 13], [30.3, 12.6], [31.4, 11], [30.4, 8], [26.5, 6.2], [21, 4.4], [14, 1.4], [8.6, -1.6], [5.2, -3.4]],
    // his shoe: a soft ankle boot that keeps the SHAPE OF THE FOOT inside it, as the drawing schools build a foot from the
    // side: a round heel, a wedge whose top falls evenly from the instep to the toes, the toes about a quarter of its
    // length ending in a rounded cap, a sole that lifts a little at the waist. Its shaft is one with the leg. It bends
    // where the foot bends. (A long toe drawn to an upturned point, as in his painted frames, read as a clown's shoe.)
    shoe: [[-6.4, -5], [-8.6, -1], [-10, 4], [-10, 8.6], [-8.6, 11.6], [-5.6, 13], [-1, 13], [3, 12.6, 0, 0], [9, 12.1, 0, 0], [14, 12.3, 0, 0], [18.5, 12.9], [22, 13], [26.5, 13], [30, 12.6], [32.4, 11.2], [33, 9.2], [31.6, 7.4], [27.5, 6], [22, 4.2], [16, 1.8], [11, -1.2], [8, -4], [6.4, -5.8], [0, -4.4]]
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
  // The shoulder line and the hip line run across the body, away from us. Seen from the side, an end of such a line
  // moves forward as the line turns and up as it tips: s = 1 his near end, -1 his far end.
  const lineEnd = (w, turn, tip, s) => [s * w * Math.sin(turn), -s * w * Math.sin(tip)];
  function joints(S) {
    const c = [S[0], S[1]], lean = S[2], J = { hip: c, lean }, g = i => S[i] || 0;
    J.neck = add(c, R(sub(K.neck, K.hip), lean)); J.nod = lean + S[3]; J.head = add(J.neck, R(sub(K.head, K.neck), J.nod));
    J.shoulder = add(c, R(sub(K.shoulder, K.hip), lean));      // the middle of the shoulder line
    [['F', -1, 12, 21, 23, 4], ['N', 1, 14, 22, 24, 8]].forEach(([k, s, o, ho, fo, so]) => {
      const sh = J['sh' + k] = add(J.shoulder, lineEnd(K.shw, g(17), g(19), s)), hk = J['hip' + k] = add(c, lineEnd(K.hpw, g(18), g(20), s));
      const a = lean + S[o], b = a + S[o + 1], hb = b + g(ho), fb = hb + g(fo), el = add(sh, dirv(a, K.upper)), wr = add(el, dirv(b, K.fore)), kn = add(wr, dirv(hb, K.palm));
      J['arm' + k] = { sh, el, wr, kn, hand: add(kn, dirv(fb, K.fing)), a, b, hb, fb };      // kn: the knuckles; hand: the fingertips
      const at = S[so + 1], as = at - S[so + 2], knee = add(hk, dirv(at, K.thigh)), ank = add(knee, dirv(as, K.shin)), p = S[so + 3];
      J['leg' + k] = { hip: hk, knee, ank, as, p, far: s < 0, arch: S[s < 0 ? 25 : 26] === undefined ? 1 : S[s < 0 ? 25 : 26], heel: add(ank, pitched(K.heel, p)), ball: add(ank, pitched(K.ball, p)) };
    });
    return J;
  }
  // a skeleton pose from the hip, the lean and where each foot is (ankle x, ankle y, pitch); G: the shoulder line's and the hip line's turn, then their tip
  function pose(hip, lean, nod, feet, tilt, G) {
    G = G || [0, 0, 0, 0]; const S = new Array(27).fill(0); S[0] = hip[0]; S[1] = hip[1]; S[2] = lean; S[3] = nod; S[16] = tilt || 0;
    for (let i = 0; i < 4; i++) S[17 + i] = G[i];
    LEGS.forEach(([k, so], i) => { const a = ik(add(hip, lineEnd(K.hpw, G[1], G[3], i ? 1 : -1)), feet[i]); S[so + 1] = a[0]; S[so + 2] = a[0] - a[1]; S[so + 3] = feet[i][2]; });
    S[12] = S[14] = .04; S[13] = S[15] = .32; S[21] = S[22] = -.14; S[23] = S[24] = -.24; S[25] = S[26] = 1;
    return S;
  }
  // a measured frame (tools/mannequin/anims.py) on these bones; his frames show his arms held still
  const AK = 20 - K.heel[1];      // the tracks were measured with the ankle 20 above the sole
  const fromTrack = t => pose([K.hip[0] + t[0], K.hip[1] + t[1]], t[2], t[3], [[K.hip[0] + t[4], t[5] + AK, t[6]], [K.hip[0] + t[7], t[8] + AK, t[9]]], t[10]);

  // ---------------------------------------------------------------- the classic walk
  // Richard Williams (The Animator's Survival Kit): every step is CONTACT, DOWN (the weight comes onto the front leg, the
  // body at its lowest), PASSING POSITION, UP (the push off, the body at its highest); a slow or heavy walk takes 16
  // frames a step or more (his takes 19). Gait laboratories: each foot is on the ground about 60% of a stride; the heel
  // strikes with the toe up, the foot rolls flat, the heel rises and it rolls over the ball of the foot; the arms swing
  // against the legs. A man under a load leans into it, keeps his knees a little bent and swings his arms little.
  // THE TWO LINES: seen from above, the hip line turns so that the hip of the striking leg is forward at its heel
  // strike, and the shoulder line turns the other way (so the arm opposite that leg is forward); seen from in front,
  // the hip of the leg in the air drops a little and the shoulders tip the other way.
  // THE ARMS (the animators' overlapping action, "successive breaking of joints"): the shoulder leads, the upper arm
  // follows and is furthest forward on the DOWN, not the contact (Williams); the elbow is never straight: it bends
  // more as the arm comes forward and opens as it goes back, later still; the hand trails the forearm and the fingers
  // trail the hand. The arms hang by their own weight, so they do not rock with the body.
  // THE TORSO ROCKS (measured in his own old walk, twice over: on his bones and on his outline): the whole torso tips
  // forward as each foot takes the weight (most at about a seventh of a stride after the heel strikes) and back as he
  // pushes off, about a degree and a quarter each way; and once a stride it rolls as much again, one step heavier than
  // the other (the SWAGGER: no real walker's two steps are alike, and the turning shoulders show from the side as a roll).
  // THE HEAD does not ride stiff on the body: it tips forward as the body rises and back as it drops, about a degree
  // and a half, so his eyes stay level.
  // THE LEGS: the leg is straight as its heel strikes, gives at the knee as the weight comes on (the DOWN), straightens
  // as he vaults over it (the UP; the body can rise no higher than a straight leg lets it), and the thigh goes back
  // behind the hip before the foot leaves the ground. A slow walk keeps each foot down longer (about 62% of the stride).
  // THE FOOT'S ARCH is a spring: it flattens as the weight comes onto it and is lowest in mid-stance; as the heel
  // rises and the toes bend back, the band under the foot is wound tight and the arch stands higher than at rest
  // (the anatomists' "windlass").
  // u: 0..1 round one stride (two steps), the far heel striking at 0. A foot's touching point never slides.
  const PITCH = [[0, 15], [.07, 0], [.36, 0], [.5, -14], [.62, -40], [.72, -56], [.83, -28], [.93, 3], [1, 15]];
  const ARCH = [[0, 1], [.1, .62], [.36, .55], [.5, 1.05], [.62, 1.3], [.76, 1.05], [1, 1]];
  function key(g, keys) { for (let i = 1; i < keys.length; i++) if (g <= keys[i][0]) { const a = keys[i - 1], b = keys[i], t = (g - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * (1 - Math.cos(Math.PI * t)) / 2; } return keys[keys.length - 1][1]; }
  function classic(u, o) {
    o = Object.assign({ step: 93, lift: 8, bob: 3.8, sink: 0, stance: .62, strike: 46, lean: .075, rock: .022, swagger: .018, head: .27, nod: .026,
      turn: .15, hipTurn: .1, tip: .05, hipTip: .07, hang: -.06, arm: .12, elbow: .3, bend: .25, wrist: .6 }, o);
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
    const sw = o.swagger / .018, hip = [K.hip[0] + 1.2 * Math.cos(TAU * (2 * u - .6)) + sw * Math.cos(TAU * (u - .71)), K.hip[1] + o.sink + o.bob + o.bob * Math.cos(TAU * (2 * u - .21)) + .6 * sw * Math.cos(TAU * (u - .06))];
    const L = K.thigh + K.shin - 1.2;      // the hip sinks as far as the legs need to reach their feet
    const G = [o.turn * Math.cos(TAU * (u - .02)), -o.hipTurn * Math.cos(TAU * u), o.tip * Math.cos(TAU * (u - .25)), -o.hipTip * Math.cos(TAU * (u - .25))];
    feet.forEach((f, i) => { const e = lineEnd(K.hpw, G[1], G[3], i ? 1 : -1), dx = f[0] - hip[0] - e[0]; if (Math.abs(dx) < L) hip[1] = Math.max(hip[1], f[1] - Math.sqrt(L * L - dx * dx) - e[1]); });
    const lean = o.lean + o.rock * Math.cos(TAU * (2 * u - .3)) + o.swagger * Math.cos(TAU * (u - .25)), nod = o.head - o.lean + o.nod * Math.cos(TAU * (2 * u - .62)) + .012 * sw * Math.cos(TAU * (u - .34)), S = pose(hip, lean, nod, feet, 0, G);
    S[25] = key(frac(u), ARCH); S[26] = key(frac(u + .5), ARCH);
    [[12, 21, 23, u + .5], [14, 22, 24, u]].forEach(([ai, hi, fi, p]) => {
      const trail = o.wrist * (o.arm * Math.sin(TAU * (p - .07)) + .5 * o.bend * Math.sin(TAU * (p - .13)));      // against the forearm's own swing
      S[ai] = o.hang - lean + o.arm * Math.cos(TAU * (p - .07)); S[ai + 1] = o.elbow + o.bend * (.5 + .5 * Math.cos(TAU * (p - .13)));
      // the hand hangs from the wrist by its own weight (more upright than the forearm) and the fingers curl back, toward the palm
      S[hi] = -.14 + trail; S[fi] = -.24 + .8 * trail;
    });
    return S;
  }

  // ---------------------------------------------------------------- how cloth moves
  const CL = {
    d: [24, 48, 72, 96],      // four heights down the skirt, below the hip; the last is the hem
    rf: [20.5, 21.5, 23, 24.5], rb: [-22, -24, -26.5, -29],      // where its front and back edge hang at rest: straight down from the belly and from the buttock
    ef: [4, 4.5, 5.5, 5], eb: [3, 3, 3, 2.5],      // how far heavy cloth stands off the leg that pushes it
    hz: [3.2, 2.5, 2.0, 1.7], zeta: .55,      // how fast each height swings back by itself (the hem slowest), and how soon it settles
    drag: [.1, .3, .6, .9],      // how far the air holds each height back, per pixel of his speed
    fd: [36, 62, 86], fr: [-26, -27, -27], fhz: [2.1, 1.6, 1.3], fzeta: .22, fdrag: [.3, .8, 1.3], fsh: [1, .9, .8]      // the cloak's back flap: looser, so it flies and settles later
  };
  // a leg's front and back surface at a height (a leg lifted above it counts at its lowest joint)
  const legSurf = (L, y) => {
    for (const [p, q, P] of [[L.hip, L.knee, BODY.thigh], [L.knee, L.ank, BODY.shin]]) if ((p[1] - y) * (q[1] - y) <= 0 && p[1] !== q[1]) {
      const t = (y - p[1]) / (q[1] - p[1]), x = p[0] + (q[0] - p[0]) * t, o = pr(P, t), c = Math.max(.5, Math.abs(q[1] - p[1]) / Math.hypot(q[0] - p[0], q[1] - p[1]));
      return [x + o[0] / c, x - o[1] / c];
    }
    const low = L.ank[1] >= L.knee[1] ? L.ank : L.knee; return [low[0] + 6, low[0] - 6];
  };
  const CL0 = JSON.parse(JSON.stringify(CL));
  function clothNew() { return { f: CL.rf.slice(), b: CL.rb.slice(), fv: [0, 0, 0, 0], bv: [0, 0, 0, 0], fl: CL.fr.slice(), flv: [0, 0, 0], lift: 0, liftV: 0, by: 0, byV: 0, bt: 0, btV: 0, shAvg: null, leanAvg: null, h1: null, h2: null }; }
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
    // the back panel hangs from the shoulders, so it is carried to and fro as the torso rocks and the shoulder line turns
    const shx = J.shN[0] - S[0]; if (E.shAvg === null) { E.shAvg = shx; E.leanAvg = S[2]; } else if (!E.fixed) { E.shAvg += (shx - E.shAvg) * .03 * n; E.leanAvg += (S[2] - E.leanAvg) * .03 * n; }
    const carry = shx - E.shAvg;
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
        const r = spring(E.fl[i], E.flv[i], CL.fr[i] - CL.fdrag[i] * vx + CL.fsh[i] * carry, CL.fhz[i], CL.fzeta, -ax * (.5 + .5 * i / 2)); E.fl[i] = r[0]; E.flv[i] = r[1];
        const lim = edgeAt(E.b, CL.rb, CL.fd[i]) - 3; if (E.fl[i] > lim) { E.fl[i] = lim; if (E.flv[i] > 0) E.flv[i] = 0; }
      }
      let r = spring(E.lift, E.liftV, 0, 2.6, .4, ay * .7); E.lift = r[0]; E.liftV = r[1];      // the hem lifts a little as the body drops
      r = spring(E.by, E.byV, 0, 3, .45, -ay * .6); E.by = r[0]; E.byV = r[1];      // the burden sags a beat after the body rises
      r = spring(E.bt, E.btV, -.4 * (S[2] - E.leanAvg), 2, .3, 0); E.bt = r[0]; E.btV = r[1];      // and as the torso rocks it hangs back, then follows
    }
    return E;
  }
  const clothPose = E => [...E.f, ...E.b, ...E.fl, E.lift, E.by, E.bt];
  // dress every pose of a movement once (three times round a loop, so the cloth has settled into its swing)
  function bake(name) {
    const A = ANIMS[name], n = A.skel.length, E = clothNew(); A.cloth = new Array(n);
    if (A.loop) { E.shAvg = A.skel.reduce((a, S) => a + joints(S).shN[0] - S[0], 0) / n; E.leanAvg = A.skel.reduce((a, S) => a + S[2], 0) / n; E.fixed = true; }
    for (let pass = 0; pass < (A.loop ? 3 : 1); pass++) for (let i = 0; i < n; i++) { clothStep(E, A.skel[i], joints(A.skel[i]), 1, A.vpx || 0); A.cloth[i] = clothPose(E); }
  }

  // ---------------------------------------------------------------- loading and playing
  function add_(name, A) { ANIMS[name] = A; if (A.track) A.skel = A.track.map(fromTrack); bake(name); return A; }
  function walk(o) {
    const n = 38, step = GAIT.step * BUILD.legs;
    o = Object.assign({ step, strike: step * 46 / 93, bob: GAIT.bob, rock: GAIT.rock, swagger: GAIT.swagger, arm: GAIT.arm, bend: GAIT.bend, head: HOOD.bow, lean: BUILD.lean }, o);
    return add_('classic', { label: 'A walk built from the principles', loop: true, fps: 24, vpx: 2 * o.step / n, skel: Array.from({ length: n }, (_, i) => classic(i / n, o)) });
  }
  const K0 = { thigh: 66, shin: 67, upper: 50, fore: 40, palm: 14, fing: 11.5, hip: 150, neck: 56, head: 31, shoulder: 68 };
  function refresh() {
    // his bones: longer legs lift everything above them; the arms keep their place on the shoulders
    K.thigh = K0.thigh * BUILD.legs; K.shin = K0.shin * BUILD.legs; K.upper = K0.upper * BUILD.arms; K.fore = K0.fore * BUILD.arms;
    K.palm = K0.palm * HANDS.size; K.fing = K0.fing * HANDS.size * HANDS.fingers;
    const dy = (K0.thigh + K0.shin) - (K.thigh + K.shin); K.hip[1] = K0.hip + dy; K.neck[1] = K0.neck + dy; K.head[1] = K0.head + dy; K.shoulder[1] = K0.shoulder + dy;
    // the cloth's rest: a longer or shorter robe, more or less flared, fuller or closer; it hangs from a deeper or a slighter body
    const k = (96 + ROBE.hem) / 96, w = ROBE.full * BUILD.girth;
    CL.d = CL0.d.map(v => v * k); CL.fd = CL0.fd.map(v => v * k); CL.fr = CL0.fr.map(v => v * w);
    CL.rf = CL0.rf.map(v => (CL0.rf[0] + (v - CL0.rf[0]) * ROBE.flare) * w); CL.rb = CL0.rb.map(v => (CL0.rb[0] + (v - CL0.rb[0]) * ROBE.flare) * w);
    walk(); for (const name in ANIMS) if (ANIMS[name].track) add_(name, ANIMS[name]);
    return ANIMS;
  }
  async function load(url) {
    refresh();
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
  const TONE = { robe: .2, robeSh: .165, robeDk: .156, robeLt: .226, flap: .178, hose: .128, hoseFar: .104, shoe: .15, shoeFar: .118, sack: .176, sackSh: .146, sackLt: .2, strap: .118, hood: .206, hoodSh: .17, hoodLt: .232, face: .262, hand: .25, handFar: .19, sleeve: .222, sleeveFar: .15, belt: .12 };
  const LOOK = { detail: 1, base: .185 };
  // his face by its measures: the nose stands out more or less from the line of the face, the brow and the chin likewise
  const skullPts = () => BODY.skull.map((v, i) => {
    let x = v[0];
    if (i >= 5 && i <= 8) x = 15.4 + (x - 15.4) * FACE.nose; else if (i === 3) x = 14.6 + (x - 14.6) * FACE.brow; else if (i === 2) x += (FACE.brow - 1) * .5;
    else if (i === 14) x += (FACE.chin - 1) * 2.6; else if (i === 15) x += (FACE.chin - 1) * 2; else if (i === 13) x += (FACE.chin - 1) * .8;
    // five more: the nose's tip turned up or hooked down, a hump on its bridge, fuller or thinner lips, a deeper jaw, and the
    // forehead sloping back or standing forward
    let y = v[1]; const F = FACE;
    if (i === 7) y += F.tip; else if (i === 8) y += .75 * F.tip; else if (i === 6) y += .3 * F.tip;
    if (i === 5) x += F.bridge; else if (i === 6) x += .7 * F.bridge;
    if (i === 10 || i === 12) x = 15.6 + (x - 15.6) * F.lips;
    if (i === 15 || i === 16) y += F.jaw; else if (i === 17) y += .8 * F.jaw; else if (i === 18) y += .45 * F.jaw; else if (i === 14) y += .5 * F.jaw;
    if (i === 1) x += F.forehead; else if (i === 2) x += .7 * F.forehead; else if (i === 0) x += .5 * F.forehead;
    return v[2] ? [x, y, 1] : [x, y];
  });
  // his lower leg: calf and ankle each wider or slighter
  const shinP = () => BODY.shin.map(([t, f, b]) => { const k = lerp(LEG.calf, LEG.ankle, Math.max(0, Math.min(1, (t - .4) / .4))); return [t, f * k, b * k]; });
  // his shoe: the toe longer or shorter past the ball, drawn to more or less of a point, its tip turned up, the upper fuller or lower
  const shoeV = v => {
    let x = v[0], y = v[1];
    if (x > 22) { x = 22 + (x - 22) * SHOE.toe; const u = Math.min(1.5, (x - 22) / 11); x += SHOE.point * 6 * u * u; if (y < 11.5) y += SHOE.point * 2 * u * u; y -= SHOE.lift * u * u; }
    if (v[0] > 2 && y < 13) y = 13 - (13 - y) * (1 + (SHOE.bulk - 1) * Math.max(0, Math.min(1, (v[0] - 2) / 10)));
    return v.length > 2 ? [x, y, v[2], v[3]] : [x, y];
  };
  const headPt = J => { const k = HOOD.head, c = add(J.head, R([0, -(k - 1) * 10], J.nod)); return v => add(c, R([v[0] * k, v[1] * k], J.nod)); };
  const closed = (ctx, F, Bk) => { ctx.beginPath(); curve(ctx, F); const r = Bk.slice().reverse(); ctx.lineTo(r[0][0], r[0][1]); curve(ctx, r, false, true); ctx.closePath(); ctx.fill(); };
  const disc = (ctx, c, r) => { ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, 7); ctx.fill(); };
  const part = (ctx, a, b, P, ease) => { const sd = sides(a, b, P, ease); closed(ctx, sd[0], sd[1]); };
  // a point of a foot (or of a shoe) on the leg: the foot bends at the ball. While the ball is on the ground the toes lie
  // flat; as it leaves the ground they straighten again over a few pixels of lift, so nothing snaps. The arch points
  // (those with a 4th number) rise and fall with the arch.
  const footPt = L => {
    const f = L.p < 0 ? Math.max(0, Math.min(1, 1 - (K.ground - L.ball[1]) / 6)) : 0, pt = L.p * (1 - f), ar = L.arch === undefined ? 1 : L.arch;
    return v => { const w = [v[0], v[3] === undefined ? v[1] : K.heel[1] - (K.heel[1] - v[1] + (L.far ? v[3] : 0)) * ar], q = v[0] > K.ball[0] ? add(L.ball, pitched(sub(w, K.ball), pt)) : add(L.ank, pitched(w, L.p)); return v[2] ? [q[0], q[1], 1] : q; };
  };
  const toeBend = L => L.p < 0 ? -L.p * Math.max(0, Math.min(1, 1 - (K.ground - L.ball[1]) / 6)) : 0;
  function foot(ctx, L) { ctx.beginPath(); curve(ctx, BODY.foot.map(footPt(L)), true); ctx.fill(); }
  // HIS HANDS (owner: "can you make hands look more normal too"). They were a broad mitten with small teeth for fingertips, and the
  // fingers curled FORWARD, toward the thumb, which no hand can do. Now, by the drawing schools' measures: the back of the hand and
  // the fingers about the same length, the whole about a third as wide as it is long (seen a little turned, as a hanging hand is);
  // it hangs from the wrist by its own weight; the back of the hand is toward us, the thumb in front of it and a little behind,
  // lying along the first finger; four fingers of unequal length (the middle longest, the little one shortest and set higher), each
  // bending at its three joints and curling BACK, toward the palm, the little finger most; a fine line between the fingers.
  // Points are (along the hand as a part of the palm's length, toward its front in units) from the wrist.
  const FINGERS = [[1, 3.4, .92, 1.42, .8], [1.03, 1.1, 1, 1.44, 1], [.99, -1.2, .93, 1.36, 1.1], [.9, -3.45, .75, 1.2, 1.25]];      // where it leaves the knuckles (along, across), its length, half its width, how much it curls
  function hand(ctx, A, col) {
    const w = A.wr, hb = A.hb, Lp = K.palm, wd = HANDS.size * HANDS.width, c1 = (A.fb - hb) * HANDS.curl, th = HANDS.thumb, s = Math.sin(hb), c = Math.cos(hb);
    const P = (t, m) => [w[0] + s * t * Lp + c * m * wd, w[1] + c * t * Lp - s * m * wd];
    ctx.fillStyle = col;
    // the thumb first: it lies on the palm's side of the hand, so the hand's front edge passes in front of it
    const to = Math.min(1.25, th), TH = [P(.06, 2.1), P(.06 + .32 * th, 2.4 + 2.6 * to), P(.06 + .66 * th, 3.2 + 3.1 * to), P(.06 + .96 * th, 3.2 + 3.2 * to)], tw = wd * Math.sqrt(th);
    stroke(ctx, TH, t => tw * (1.8 - .65 * t), col); ctx.fillStyle = col; disc(ctx, TH[3], tw * 1.15);
    // (the web between the thumb and the hand is filled, so no hairline of sky shows between them)
    ctx.beginPath(); [TH[0], TH[1], TH[2], TH[3], P(1, 4.8), P(.62, 4.3), P(.25, 3.5)].forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.closePath(); ctx.fill();
    // the back of the hand: narrow at the wrist, widening to the knuckles, the heel of the hand a soft swell behind
    ctx.beginPath(); curve(ctx, [P(-.14, 3.1), P(.25, 3.5), P(.62, 4.3), P(1, 4.8), P(1.07, 2.3), P(1.09, 0), P(1.02, -2.5), P(.9, -4.6), P(.6, -4.8), P(.28, -4.3), P(-.14, -3.2)], true); ctx.fill();
    // the fingers, each a line that thins a little to a round tip, bending at three joints
    const F = FINGERS.map(([t, m, len, hw, ck]) => { const L = K.fing * len, B = P(t - .12, m), a1 = hb + c1 * ck, a2 = hb + 1.9 * c1 * ck, a3 = hb + 2.6 * c1 * ck;
      const q0 = add(B, dirv(hb, .12 * Lp)), q1 = add(q0, dirv(a1, .45 * L)), q2 = add(q1, dirv(a2, .3 * L)), q3 = add(q2, dirv(a3, .25 * L)); return { pts: [B, q0, q1, q2, q3], hw: hw * wd }; });
    // (the fingers lie together: the space between the first and the last is filled, so no chink of sky shows between them)
    ctx.beginPath(); ctx.moveTo(F[0].pts[0][0], F[0].pts[0][1]); F[0].pts.forEach(q => ctx.lineTo(q[0], q[1])); ctx.lineTo(F[1].pts[4][0], F[1].pts[4][1]); ctx.lineTo(F[2].pts[4][0], F[2].pts[4][1]); F[3].pts.slice().reverse().forEach(q => ctx.lineTo(q[0], q[1])); ctx.closePath(); ctx.fill();
    F.forEach(f => { stroke(ctx, f.pts, t => f.hw * (1 - .2 * t), col); ctx.fillStyle = col; disc(ctx, f.pts[4], f.hw * .8); });
    // a trace of form inside: a fine line between each finger and the next, and where the hand's front edge lies over the thumb
    if (LOOK.detail > 0) {
      ctx.strokeStyle = 'rgba(0,0,0,' + (.2 * LOOK.detail) + ')'; ctx.lineWidth = .55 * HANDS.size; ctx.lineCap = 'round';
      const mid = (a, b, k) => [(a[0] + b[0]) / 2 + (b[0] - a[0]) * k, (a[1] + b[1]) / 2 + (b[1] - a[1]) * k];
      for (let i = 0; i < 3; i++) { const a = F[i].pts, b = F[i + 1].pts; ctx.beginPath(); const e = (q, r) => [q[0] + (r[0] - q[0]) * .55, q[1] + (r[1] - q[1]) * .55]; curve(ctx, [mid(a[1], b[1], 0), mid(a[2], b[2], 0), mid(a[3], b[3], 0), mid(e(a[3], a[4]), e(b[3], b[4]), 0)]); ctx.stroke(); }
      ctx.beginPath(); curve(ctx, [P(.3, 3.6), P(.62, 4.3), P(1, 4.8)]); ctx.stroke();
    }
  }

  // the clothed figure. (x, y) is the ground under him, face 1 right / -1 left, Kk the size; shade(tone) gives each tone's colour
  function figure(ctx, S, Q, x, y, face, Kk, shade) {
    shade = shade || grey; const J = joints(S), T = k => shade(LOOK.base + (TONE[k] - LOOK.base) * LOOK.detail);
    Q = Q || clothPose(clothNew());
    const f = Q.slice(0, 4), b = Q.slice(4, 8), fl = Q.slice(8, 11), lift = Q[11], by = Q[12], h = J.hip, n = J.neck;
    ctx.save(); ctx.translate(x, y); ctx.scale((face || 1) * Kk, Kk); ctx.translate(-K.ax, -K.ground); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    // a point of an outline with the offset set for it by hand, if any (and its place noted for the lab: p, and what one unit each way does)
    const plG = (G, v, n) => { const o = G[n]; return o ? [v[0] + o[0], v[1] + o[1]] : v; };
    const hptG = (grp, n, v, map, quiet) => { const w = plG(HAND[grp], v, n); if (REC && !quiet) { const q = map(w); REC.push({ name: n, grp, p: q, ex: sub(map([w[0] + 1, w[1]]), q), ey: sub(map([w[0], w[1] + 1]), q) }); } return w; };
    const sl = Math.hypot(h[0] - n[0], h[1] - n[1]), sd = [(h[0] - n[0]) / sl, (h[1] - n[1]) / sl], gi = BUILD.girth, st = (t, off) => [n[0] + (h[0] - n[0]) * t + sd[1] * off * gi, n[1] + (h[1] - n[1]) * t - sd[0] * off * gi];
    const fill = (pts, col, cl) => { ctx.fillStyle = col; ctx.beginPath(); curve(ctx, pts, cl !== false); ctx.fill(); };
    const hp = headPt(J), np = v => add(n, R(v, J.lean));

    // --- an arm in its sleeve. A habit's sleeve is a wide tube hung from the shoulder: it lies on the upper arm, its
    //     underside sags, and at the cuff the arm rests against whichever side of the tube it is pushing (the cloth
    //     trails behind a swinging arm and hangs below a raised one); the cuff covers the wrist
    // THE NEAR SHOULDER BELONGS TO HIS BODY, NOT TO HIS ARM (owner: "his shoulder doesn't seem cohesive with his torso (rotates like a
    // separate piece)"). It was a round cap on top of the arm, in the arm's lighter tone, standing up beside the hood: a paper doll's
    // pinned-on limb. Now (1) the cloth over the shoulder is a YOKE that hangs from the base of his neck down the slope of the
    // trapezius to the shoulder, fixed to the body, and the arm turns under it; (2) the sleeve fits closer at the shoulder, so its top
    // is lower than his collar; (3) the sleeve has the ROBE'S OWN TONE at the shoulder and grows lighter only down the arm, so the arm
    // comes out of the body instead of lying on it.
    const nearTone = (() => { const a = np([0, -2]), c = np([0, 30]), g = ctx.createLinearGradient(a[0], a[1], c[0], c[1]); g.addColorStop(0, T('robe')); g.addColorStop(.3, T('robe')); g.addColorStop(1, T('sleeve')); return g; })();
    const upperSleeve = BODY.upper.map(v => { const e = 1.3 + 1.9 * Math.min(1, v[0] / .4); return [v[0], v[1] + e, v[2] + e]; });
    const sN = J.armN.sh, yk = (dx, dy) => add(sN, R([dx, dy], J.lean));
    // from the back of his neck the cloth slopes down and rounds over the shoulder; the same in front, under the hood's fall
    const yokePath = () => { const q = (c, e) => ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]), l = e => ctx.lineTo(e[0], e[1]), m = np([-9.5, -1.5]);
      ctx.beginPath(); ctx.moveTo(m[0], m[1]); q(yk(-7.6, -7.4), yk(-8.8, -.4)); l(yk(-6, 4)); l(yk(6, 4)); l(yk(8.8, -.4)); q(yk(7.6, -7), np([6.5, 2])); l(np([-1, -3])); ctx.closePath(); };
    const yoke = () => { ctx.fillStyle = nearTone; yokePath(); ctx.fill(); };
    const arm = (A, far) => {
      hand(ctx, A, T(far ? 'handFar' : 'hand'));
      const W = SLEEVE.width, r = 5, s = Math.max(.06, Math.min(.86, .42 + 1.6 * (A.hb - A.b - .08) - .8 * Math.sin(A.b))), fd = r + 1.5 + s * (W - 2 * r - 3), ab = Math.abs(Math.sin(A.b));
      ctx.fillStyle = far ? T('sleeveFar') : nearTone; part(ctx, A.sh, A.el, upperSleeve, 0); disc(ctx, A.sh, 8.8); disc(ctx, A.el, 9.2);
      const sv = sides(A.el, add(A.wr, dirv(A.b, SLEEVE.len)), [[0, 8.6, 9], [1, fd, W - fd]], 0, 1, 8);
      sv[1].forEach((q, i) => { const t = i / 8; q[1] += SLEEVE.drop * ((3 + 6 * ab) * Math.sin(Math.PI * t) * .8 + (2 + 4 * ab) * t * t); });
      closed(ctx, sv[0], sv[1]);
      const d = dirv(A.b, 1.6), m = mix(sv[0][8], sv[1][8], .5); stroke(ctx, [sv[0][8], [m[0] + d[0], m[1] + d[1]], sv[1][8]], leaf(1.5), T('robeDk'));      // the cuff's mouth, in shade
    };
    arm(J.armF, true);

    // --- legs: hose on the body's own profile, and soft shoes (they show below the hem)
    const leg = (L, far) => {
      ctx.fillStyle = T(far ? 'hoseFar' : 'hose'); part(ctx, L.hip, L.knee, BODY.thigh, 0); part(ctx, L.knee, L.ank, shinP(), LEG.shaft); disc(ctx, L.knee, 8); disc(ctx, L.ank, (5.4 + LEG.shaft) * LEG.ankle);
      // his shoe, its sole, the fold at the ankle, and the creases across the toes where it bends
      const fp = footPt(L), bend = toeBend(L);
      ctx.fillStyle = T(far ? 'shoeFar' : 'shoe'); ctx.beginPath(); curve(ctx, BODY.shoe.map(shoeV).map(fp), true); ctx.fill();
      stroke(ctx, [[-8.6, 11.4], [-1, 12.1], [9, 11.4], [18.5, 12.1], [26.5, 12.2], [31.6, 11]].map(shoeV).map(fp), t => .55, T('belt'));
      if (bend > .12) { const w = Math.min(1, bend * 1.6); stroke(ctx, [[20.4, 4], [21.6, 6.6], [22.6, 9.6]].map(shoeV).map(fp), leaf(.9 * w), T('belt')); stroke(ctx, [[24.6, 5.4], [25.2, 7.6], [25.4, 10]].map(shoeV).map(fp), leaf(.7 * w), T('belt')); }
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
    fill([np([-11, -3.5]), np([-3, -5]), np([8.5, -3]), np([13, 6.5]), np([0, 10]), np([-14, 6.5])], T('robe'));      // the robe's neck, up round the base of his neck
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
    // the cord at his waist (a habit is girded with a cord, as a pilgrim is), knotted at his side; its long end hangs
    // with three knots in it, lying on the skirt and swinging with it
    ctx.strokeStyle = T('belt'); ctx.lineWidth = 2.2; ctx.beginPath(); curve(ctx, [st(.775, 19.6), st(.8, 8), st(.79, -4), st(.775, -14.6)]); ctx.stroke();
    const sk = (u, d) => [h[0] + lerp(edgeAt(b, CL.rb, d), edgeAt(f, CL.rf, d), u), h[1] + Math.min(d, CL.d[3] - 5)], knot = st(.8, 7);
    stroke(ctx, [knot, sk(.66, 4), sk(.67, 26), sk(.675, 48), sk(.68, 64)], t => 1.05 - .2 * t, T('belt'));
    ctx.fillStyle = T('belt'); disc(ctx, knot, 2.6); [36, 47, 58].forEach(d => disc(ctx, sk(.675, d), 1.8));

    // --- the back panel (a habit's scapular hangs from the shoulders, front and back; his shows below the sack): a loose panel hanging down his back, outside the skirt
    const inX = d => h[0] + lerp(edgeAt(b, CL.rb, d), edgeAt(f, CL.rf, d), .3), o0 = [h[0] + fl[0], h[1] + CL.fd[0]], o1 = [h[0] + fl[1], h[1] + CL.fd[1]], o2 = [h[0] + fl[2], h[1] + CL.fd[2], 1], hk = CL.d[3] / 96, ib = [inX(80 * hk), h[1] + 80 * hk, 1];
    fill([st(.62, -3), st(.6, -20), [h[0] + Math.min(b[0] - 2, fl[0] + 3), h[1] + 12], o0, o1, o2, [lerp(o2[0], ib[0], .35), o2[1] - 1.5], [lerp(o2[0], ib[0], .7), ib[1] + .5], ib, [inX(54 * hk), h[1] + 54 * hk], [inX(26 * hk), h[1] + 26 * hk]], T('flap'));
    stroke(ctx, [st(.66, -4), [inX(26 * hk), h[1] + 26 * hk], [inX(54 * hk), h[1] + 54 * hk], [ib[0], ib[1]]], t => 1.5 * Math.min(1, 3 * t) * (1 - .4 * t), T('robeDk'));      // the dark fold where it lies on the skirt

    // --- the burden, in two tiers as in his painted frames: a heavy sack bound on his back, and a smaller bundle tied on top
    //     of it behind his hood. The sack hangs from its tie behind his shoulders, its weight low, its inner side flat
    //     against him; it sags a beat after the body and spreads a little as it does; the bundle on top jolts a little more.
    const tilt = J.lean + S[16] + .05 + by * .004 + (Q[13] || 0), tie = add(st(.07 + SACK.high, -15), [-SACK.back, by]), sq = 1 + .012 * Math.max(-3, Math.min(4, by)), sp = v => add(tie, R([v[0] * sq * SACK.size * (v[0] < 0 ? SACK.round : 1), v[1] / sq * SACK.size], tilt));
    const sack = [[3, 3], [6.5, 20], [7, 45], [3.5, 62], [-9, 73.5], [-27, 70.5], [-38, 57], [-36.5, 39], [-28.5, 20], [-17, 7], [-8, 2]].map(sp);
    // where the pack sits back from him, its mouth is drawn up to his shoulders by what ties it: this closes the chink of sky
    // that would otherwise flicker between his neck, the sack and the bundle (drawn first, so everything else lies over it)
    fill([[...sp([-9, -1]), 1], [...sp([4, -2.5]), 1], [...np([-8, -3]), 1], [...np([-9, 9]), 1], [...sp([6.5, 14]), 1], [...sp([-4, 7]), 1]], T('sack'));
    fill(sack, T('sack'));
    ctx.save(); ctx.beginPath(); curve(ctx, sack, true); ctx.clip();
    fill([[-46, 38], [-37, 56], [-23, 65], [-5, 64], [8, 54], [12, 80], [-48, 80]].map(sp), T('sackSh'));      // its underside in shade
    stroke(ctx, [sp([-3, 5]), sp([-14, 18]), sp([-20, 36])], leaf(1.1), T('sackSh')); stroke(ctx, [sp([0, 6]), sp([-4, 24]), sp([-5, 44])], leaf(.9), T('sackSh'));      // creases where the weight pulls from the tie
    stroke(ctx, [sp([9, 30]), sp([-6, 36]), sp([-23, 36.5]), sp([-40, 30])], t => .9, T('sackSh'));      // the rope round its girth
    ctx.restore();
    // the sack's tie at its mouth: the bundle sits on it, so it is drawn first and shows only where the bundle leaves it clear
    stroke(ctx, [sp([-11, 3]), sp([-2, 1.5]), sp([5, 2.5])], leaf(1.7), T('strap'));
    if (SACK.top > 0) {
      const rx = 15 * SACK.top, ry = 11.5 * SACK.top * SACK.flat, c = [-11.5 + SACK.set, 3.5 - ry * .78 + by * .35], bp = v => sp([c[0] + v[0] * rx, c[1] + v[1] * ry]);
      // its outline: nine points, u0 at the top and round by the front (each may be moved by hand, HAND.top)
      const bm = w => sp([c[0] + w[0], c[1] + w[1]]), BL = [[0, -1], [.62, -.82], [.98, -.28], [.93, .42], [.5, .9], [-.42, .96], [-.92, .52], [-1, -.18], [-.68, -.78]].map((v, i) => hptG('top', 'u' + i, [v[0] * rx, v[1] * ry], bm)), bun = BL.map(bm);
      if (REC) (REC.outlines = REC.outlines || {}).top = bun;
      fill(bun, T('sackLt'));
      // WHAT IS DRAWN ON IT FOLLOWS ITS OUTLINE (owner: "adjust decor on top part of burden now that size has changed"): its underside,
      // the two cords that bind it and its shadow on the sack are all placed from the nine points, wherever they have been moved
      const mx = (a, b2, t) => [a[0] + (b2[0] - a[0]) * t, a[1] + (b2[1] - a[1]) * t], Cc = BL.reduce((a, v) => [a[0] + v[0] / 9, a[1] + v[1] / 9], [0, 0]), lowY = Math.max(...BL.map(v => v[1]));
      ctx.save(); ctx.beginPath(); curve(ctx, bun, true); ctx.clip();
      const ub = mx(BL[7], BL[6], .61), uf = mx(BL[2], BL[3], .83);
      fill([mx(Cc, ub, 1.25), mx(Cc, BL[5], .66), mx(Cc, BL[4], .7), mx(Cc, uf, 1.25), [uf[0] + .4 * rx, lowY + ry], [ub[0] - .4 * rx, lowY + ry]].map(bm), T('sack'));      // its underside, where it rests on the sack
      // a cord runs from a place on its top edge to a place on its bottom edge, bowed a little by the bundle's roundness
      const cord = (a0, a1, ta, b0, b1, tb, bow, wd) => { const pt = mx(BL[a0], BL[a1], ta), qb = mx(BL[b0], BL[b1], tb), m = mx(pt, qb, .5); stroke(ctx, [bm(mx(qb, pt, 1.12)), bm([m[0] + bow * rx, m[1]]), bm(mx(pt, qb, 1.12))], t => wd, T('sackSh')); };
      cord(0, 1, .3, 4, 5, .37, .09, .9); cord(8, 0, .32, 5, 6, .06, .08, .8);
      ctx.restore();
      stroke(ctx, [bm([BL[6][0], BL[6][1] + .1 * ry]), bm(add(mx(BL[5], BL[4], .25), [0, .05 * ry])), bm(add(mx(BL[4], BL[3], .5), [0, .06 * ry]))], leaf(1.3), T('sackSh'));      // its shadow on the sack, under its lower edge
    }

    // THE STRAP that holds it (owner: "the strap of his bag cuts through his arm": it ran down his chest and back to the sack, hidden
    // only where the arm lay over it, so it showed on both sides of the arm as if it went through it). Now it goes from the sack up
    // over the top of his shoulder, down in front of the shoulder, and in under his arm, where it ends out of sight; its last
    // points go with the arm, so the arm always covers its end. It is drawn here, under the arm, and again over the shoulder
    // itself once the arm is drawn (strapOn).
    const strap = () => { const A = J.armN, ul = Math.hypot(A.el[0] - A.sh[0], A.el[1] - A.sh[1]) || 1, u = [(A.el[0] - A.sh[0]) / ul, (A.el[1] - A.sh[1]) / ul], af = (d, o) => [A.sh[0] + u[0] * d + u[1] * o, A.sh[1] + u[1] * d - u[0] * o];
      ctx.strokeStyle = T('strap'); ctx.lineWidth = 1.8; ctx.beginPath(); curve(ctx, [sp([3, 2]), yk(-6.6, -7), yk(-.6, -9.5), yk(5.8, -6.8), yk(9.6, .4), af(8, 9.8), af(14, 5.5)]); ctx.stroke(); };
    const strapOn = a => { ctx.save(); ctx.globalAlpha = a; yokePath(); ctx.moveTo(sN[0] + 8.8, sN[1]); ctx.arc(sN[0], sN[1], 8.8, 0, 6.2832, true); ctx.clip(); strap(); ctx.restore(); };
    strap();
    // --- near arm; then his head. His face shows in the hood as a lit profile (brow, nose, lips, chin); the hood's rim
    //     throws its shadow down the cheek and into the hollow of the eye, and the neck is in shade under the jaw
    arm(J.armN, false); yoke();
    ctx.fillStyle = T('hoodSh'); part(ctx, n, hp([-2, 12]), [[0, 6.5, 7], [1, 6, 6.5]], 0); fill(skullPts().map(v => v[2] ? [...hp(v), 1] : hp(v)), T('face'));
    const HD = HOOD, bk = HD.beak, tipY = -9 + HD.droop, dt = HD.top - 3.6, dk = HD.back - 9, rm = HD.rim, cl = HD.cape, pk = HD.peak, hg = HD.hang, bib = HD.bib;
    // a point of the hood on his head: the whole hood may be larger or closer, and tipped forward or pushed back
    const hh = v => hp(R([v[0] * HD.size, v[1] * HD.size], HD.tilt));
    const HH = HAND.hood, pl = (v, n) => plG(HH, v, n), hpt = (n, v, map, quiet) => hptG('hood', n, v, map, quiet);
    // its rim, from under the jaw up to the tip of the beak (the opening may be raked back toward the jaw)
    const RIM = [[11.5 - .6 * rm, 21.5], [9.4 - rm, 17], [8.6 - rm, 11], [9.6 - rm, 4], [11.4 - .8 * rm - .5 * HD.cut, -2], [14 - .4 * rm - HD.cut, tipY + 2.8], [14.4 + .5 * bk, tipY + 1 + .3 * HD.hook], [14.8 + bk + 2 * HD.sharp, tipY + HD.hook]].map(v => [v[0] - HD.rake * Math.max(0, v[1] - tipY) / 30, v[1]]).map((v, i) => hpt(i < 6 ? 'r' + i : 'tip', v, hh, i === 6));
    // the tip's top: Tb where the beak leaves the hood, Cf the front of the crown; between them the top may be scooped or bulge
    const Tb = hpt('tt', [14.2 + .75 * bk, tipY - HD.thick + .3 * HD.hook], hh), Cf = hpt('cf', [13.4, -18.8 - .6 * dt], hh), Tl = Math.hypot(Tb[0] - Cf[0], Tb[1] - Cf[1]) || 1;
    const beakTop = Math.abs(HD.sweep) > .01 ? [hh(Tb), hh([(Tb[0] + Cf[0]) / 2 + (Tb[1] - Cf[1]) / Tl * HD.sweep, (Tb[1] + Cf[1]) / 2 - (Tb[0] - Cf[0]) / Tl * HD.sweep]), hh(Cf)] : [hh(Tb), hh(Cf)];
    const rimPts = RIM.map((v, i) => i === 7 && HD.sharp > .45 ? [...hh(v), 1] : hh(v));
    const off = (i, dx, dy) => [RIM[i][0] + dx, RIM[i][1] + (dy || 0)];
    ctx.save(); ctx.beginPath(); curve(ctx, skullPts().map(v => v[2] ? [...hp(v), 1] : hp(v)), true); ctx.clip();
    stroke(ctx, [off(7, -1.4, 1.6), off(5, 1.4, 1.6), off(4, 1.4, 2), off(3, 1.2, 2), off(2, 1.4, 1), off(1, 1.4, 1)].map(hh), t => 2.4, T('hoodSh'));      // the hood's shadow on his brow and down his cheek
    stroke(ctx, [hp([13.5, 17.6]), hp([8, 16.6]), hp([0, 14.6])], t => 1.3, T('hoodSh'));      // under the jaw
    ctx.restore();
    // --- THE HOOD starts above his eyes and follows his head: over the crown, standing off the back of his head a
    //     little (as a cloak's hood does), and hangs to his shoulders. At the front its top comes forward over his brow
    //     to a small beak above the eyes; its rim turns back under the beak and runs past the temple and the cheek to
    //     under the jaw, so his profile shows in front of it. In his painted frames the long upright line at the front
    //     IS his face, the head bowed. Its cape ends on the shoulder and rides with the near shoulder; the back sags a
    //     beat after the body. Every measure is in HOOD.
    const so = sub(J.shN, J.shoulder), cp = (v, k) => add(np(v), [so[0] * k, so[1] * k]), sg = by * .6, jaw = hh(RIM[0]), dn = (q, k) => add(q, [0, sg * k]);
    // ITS LOWER EDGE. Above 0 it is a cape lying down over the shoulder and riding with it. Below 0 the hood STOPS ON HIS TRAPS,
    // well before the shoulder: the edge is a collar round the base of his neck (at -12 about level with the neck's base, the
    // shoulder's top 4 lower and clear of it), it no longer rides with the shoulder, the back no longer bags out over his upper
    // back, and any fall of its front (bib) lies on the chest BEHIND the near shoulder and arm (see below). The collar slopes as
    // the base of a neck does: higher at the back, lower at the pit of the throat.
    const up = Math.min(1, Math.max(0, -cl) / 12), ce = cl < 0 ? cl * 1.42 : cl, ride = 1 - .85 * up, b4 = .25;
    const EDGE = [[[-16.5 - .4 * Math.min(0, ce), 13.5 + .8 * ce - 2.5 * up], .4], [[-7, 17.5 + ce - 2 * up], .7], [[4 + 2 * up, 18.6 + ce + 2 * up + b4 * bib], .9], [[13 - 4.5 * up, 16.8 + ce + 5.7 * up + (.7 - .15 * up) * bib], .7], [[19.5 - 5 * up, 13 + .9 * ce + 8.8 * up + bib], .3]];
    const pom = v => dn(cp(v, .2 * ride), .6 * (1 - .6 * up));
    const C1 = hpt('c1', [6, -22.2 - .9 * dt], hh), C2 = hpt('c2', [-3, -23 - dt - .3 * pk], hh), C3 = hpt('c3', [-12 - .3 * pk, -21 - .9 * dt - .7 * pk], hh), C4 = hpt('c4', [-19.5 - .5 * dk - .2 * pk, -15.4 - .3 * dt - .2 * pk], hh);
    const B1 = hpt('b1', [-24 - dk, -6.5], v => dn(hh(v), .4)), B2 = hpt('b2', [-25.4 - dk, 3 + .6 * hg], v => dn(hh(v), .8)), B3 = hpt('b3', [-23 - .8 * dk, 11 + hg], v => dn(hh(v), 1));
    const pouch = pom(hpt('po', [-19 - .3 * dk + up * (7 + .3 * dk), 5 + .5 * hg - up * (5.5 + .3 * hg)], pom));
    EDGE.forEach((e, i) => { e[0] = hpt('e' + i, e[0], v => cp(v, e[1] * ride)); });
    const hoodEdge = (i, dy) => cp([EDGE[i][0][0], EDGE[i][0][1] + (dy || 0)], EDGE[i][1] * ride);
    // its front edge, from under his jaw down to its foot on the chest: cloth hanging from the chin bellies forward a little
    const jw = add(jaw, [1.2, 4.5]), fe = hoodEdge(4), belly = up * Math.min(1, bib / 12) * 1.8;
    const hood = (belly > .05 ? [fe, [fe[0] + (jw[0] - fe[0]) * .42 + belly, fe[1] + (jw[1] - fe[1]) * .42], jw] : [fe, jw]).concat(rimPts, beakTop, [hh(C1), hh(C2), hh(C3), hh(C4), dn(hh(B1), .4), dn(hh(B2), .8), dn(hh(B3), 1), pouch, hoodEdge(0), hoodEdge(1), hoodEdge(2), hoodEdge(3)]);
    if (REC) (REC.outlines = REC.outlines || {}).hood = hood;
    // a tail from the back of the crown (the liripipe of an old hood): it hangs down his back and swings with the back panel
    if (HD.tail > 0) {
      const L = HD.tail, sw = (fl[1] - CL.fr[1]) * .5, r0 = hh(pl([-20 - .6 * dk - .3 * pk, -13.5 - .3 * dt - .4 * pk], 'c4'));
      const tl = [r0, add(r0, [-7 - .05 * L, 5 + .12 * L + sg * .3]), add(r0, [-10 - .08 * L + sw * .5, 8 + .55 * L + sg * .7]), add(r0, [-9 - .08 * L + sw, 8 + L + sg])];
      stroke(ctx, tl, t => 4.6 - 2.9 * t, T('hoodSh')); stroke(ctx, tl, t => 3.5 - 2.6 * t, T('hood'));
    }
    fill(hood, T('hood'));
    ctx.save(); ctx.beginPath(); curve(ctx, hood, true); ctx.clip();
    if (HD.roll > 0) {      // a turned-back rim: the hood's edge rolled over, its inside catching a little light
      const ro = HD.roll, IN = [off(0, -ro), off(1, -ro), off(2, -ro), off(3, -ro), off(4, -ro), off(5, -.8 * ro, -.3 * ro), off(6, -.5 * ro, -.7 * ro), off(7, -.9 * ro, -.5 * ro)];
      fill(RIM.map(hh).concat(IN.map(hh).reverse()), T('hoodLt')); stroke(ctx, IN.map(hh), t => .8, T('hoodSh'));
    } else stroke(ctx, [off(7, -1.8, -.6), off(6, -1.8 - .1 * bk), off(5, -2, 1.2), off(4, -1.2, 1), off(3, -.8), off(2, -.8), off(1, -.8)].map(hh), t => .9, T('hoodSh'));      // the rim's fold
    stroke(ctx, [hh(pl([-5, -23.5 - dt], 'c2')), hh(pl([-19 - .5 * dk, -12.5], 'c4')), dn(hh(pl([-23.5 - dk, 3 + .6 * hg], 'b2')), .8), dn(cp(pl([-17.5, 9 + .5 * hg], 'po'), .3), .6)], t => 4 * t + 1.2, T('hoodSh'));      // the back of the hood in shade
    stroke(ctx, [hoodEdge(0, 1), hoodEdge(1, .9), hoodEdge(2, .9), hoodEdge(3, .9), hoodEdge(4, .6)], t => 1.5, T('hoodSh'));      // the cape's hem
    ctx.restore();
    // drawn up to his neck, the hood lies on his neck and chest, and his near shoulder and arm are nearer to us than it:
    // they are drawn again over it, so the shoulder is clear and the hood's front shows on his chest in front of the arm
    if (up > 0) { ctx.globalAlpha = Math.min(1, up * 2.5); arm(J.armN, false); ctx.globalAlpha = 1; strapOn(Math.min(1, up * 2.5)); }
    ctx.restore();
  }

  // the bare mannequin: the body the clothes are built on (the art schools' lay figure, in profile)
  function body(ctx, S, x, y, face, Kk, o) {
    o = o || {}; const J = joints(S), far = o.far || '#857e72', near = o.near || '#bab3a4', mid = o.mid || '#a39c8e', jc = o.joint || '#6d675d';
    ctx.save(); ctx.translate(x, y); ctx.scale((face || 1) * Kk, Kk); ctx.translate(-K.ax, -K.ground); ctx.lineJoin = 'round';
    const hp = headPt(J), dot = (c, r) => { ctx.fillStyle = jc; disc(ctx, c, r); };
    const arm = (A, col) => { hand(ctx, A, col); ctx.fillStyle = col; disc(ctx, A.sh, 7.6); part(ctx, A.sh, A.el, BODY.upper, 0); part(ctx, A.el, A.wr, BODY.fore, 0); disc(ctx, A.el, 5.5); dot(A.el, 2.2); dot(A.wr, 1.8); dot(A.kn, 1.3); };
    const leg = (L, col) => { ctx.fillStyle = col; disc(ctx, L.hip, 11.5); part(ctx, L.hip, L.knee, BODY.thigh, 0); part(ctx, L.knee, L.ank, shinP(), 0); disc(ctx, L.knee, 7.4); disc(ctx, L.ank, 5.6 * LEG.ankle); foot(ctx, L); dot(L.knee, 3); dot(L.ank, 2.2); };
    arm(J.armF, far); leg(J.legF, far);
    ctx.fillStyle = mid; const t = sides(J.neck, J.hip, BODY.torso.map(v => [v[0], v[1] * BUILD.girth, v[2] * BUILD.girth]), 0, 1.26, 22); closed(ctx, t[0], t[1]);
    part(ctx, J.neck, hp([-2, 12]), [[0, 6.5, 7], [1, 6, 6.5]], 0); ctx.beginPath(); curve(ctx, skullPts().map(v => v[2] ? [...hp(v), 1] : hp(v)), true); ctx.fill();
    leg(J.legN, near); arm(J.armN, near); dot(J.shN, 2.8); dot(J.hipN, 3.4);
    ctx.restore();
  }
  // the bones as lines (for the lab, and for checking a pose): spine, limbs, and in green the shoulder line and the hip line
  function bones(ctx, S, x, y, face, Kk) {
    const J = joints(S); ctx.save(); ctx.translate(x, y); ctx.scale((face || 1) * Kk, Kk); ctx.translate(-K.ax, -K.ground); ctx.lineCap = ctx.lineJoin = 'round';
    const line = (pts, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w || 1.3; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.fillStyle = '#fff'; pts.forEach(p => disc(ctx, p, 1.5)); };
    const leg = (L, col) => line([L.hip, L.knee, L.ank, L.heel, L.ball], col), arm = (A, col) => line([A.sh, A.el, A.wr, A.kn, A.hand], col);
    arm(J.armF, '#b06a8f'); leg(J.legF, '#d9603a'); line([J.hip, J.neck, J.head], '#6fc3e8'); line([J.shF, J.shN], '#7fe39b', 2.2); line([J.hipF, J.hipN], '#7fe39b', 2.2); leg(J.legN, '#f0c24a'); arm(J.armN, '#e8a0c4');
    ctx.restore();
  }
  // the shoulder line (green) and the hip line (gold) seen from above: he walks to the right, his near side is at the
  // bottom (the white dots); k draws their turn larger so that it can be read
  function above(ctx, S, x, y, Kk, k) {
    k = k || 1; ctx.save(); ctx.translate(x, y); ctx.scale(Kk, Kk); ctx.lineCap = 'round';
    [[K.shw, S[17] || 0, '#7fe39b'], [K.hpw + 4, S[18] || 0, '#f0c24a']].forEach(([w, tw, col]) => { const s = Math.sin(tw * k) * w, c = Math.cos(tw * k) * w; ctx.strokeStyle = col; ctx.lineWidth = 3.2; ctx.beginPath(); ctx.moveTo(-s, -c); ctx.lineTo(s, c); ctx.stroke(); ctx.fillStyle = '#fff'; disc(ctx, [s, c], 2.2); });
    ctx.fillStyle = '#d8d2c6'; ctx.beginPath(); ctx.ellipse(1, 0, 9, 8, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(9, -3.2); ctx.lineTo(14.5, 0); ctx.lineTo(9, 3.2); ctx.fill();      // his head, the nose to the right
    ctx.restore();
  }
  return { K, CL, TONE, LOOK, HOOD, DIM, HAND, rec: a => { REC = a || null; }, curve, BODY, load, walk, refresh, figure, body, bones, above, joints, pose, fromTrack, classic, ik, clothNew, clothStep, clothPose, bake, add: add_, skelAt, clothAt, anims: ANIMS };
})();
