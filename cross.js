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
  // THE NIGHT-TO-DAWN LOOK IS LIVE (build 643, owner: "Can you push live now? Save edits for potential changes down the road"):
  // the look built under ?look=f (builds 604 to 642) is now the default; ?look=old brings back build 601's level
  // (?look=r its Friedrich trial). Every older trial stays in the code behind its link.
  const LF = !/[?&]look=(old|r)\b/.test(location.search);
  const SO = 'The Shining Ones', S1 = 'The first Shining One', S3 = 'The third Shining One';
  // ---------- the land (world units: x along the way, h up from the foot of the slope) ----------
  // NEW HILL SHAPES TO TRY (owner: "we need new versions of the hill - can you [look] at how golgotha has been depicted in
  // art"): ?shape=dome (Bruegel's far round hill), plinth (Mantegna's flat-topped rock in hewn steps), wedge (Friedrich's
  // dark triangle), shoulder (a small rock knob on a grassy shoulder, the tomb in the rock band below); none = the skull
  const SHAPE = (new URLSearchParams(location.search).get('shape') || 'skullsteps').toLowerCase();
  const SHAPES = {
    skull: { tomb: .7, P: null },
    dome: { tomb: 1.02, P: [[0, 1], [.2, .97], [.4, .88], [.6, .72], [.78, .52], [.92, .34], [1.02, .2], [1.1, .1], [1.17, .04], [1.24, 0], [1.3, 0]] },
    plinth: { tomb: .93, P: [[0, 1], [.3, .995], [.42, .99], [.44, .84], [.47, .8], [.62, .79], [.645, .58], [.675, .55], [.82, .54], [.845, .3], [.875, .265], [1.02, .255], [1.045, .03], [1.06, 0], [1.13, 0]] },
    wedge: { tomb: .55, P: [[0, 1], [.06, .95], [.16, .82], [.27, .66], [.37, .5], [.46, .35], [.54, .23], [.62, .13], [.7, .06], [.77, .02], [.82, 0], [.9, 0]] },
    // the skull (the owner's favourite) borrowing from the others below its brow
    // (owner, build 559: "not quite that flat, maybe halfway in between what was and what is")
    skullsteps: { tomb: 1.005, P: [[0, 1], [.13, .997], [.26, .99], [.38, .978], [.47, .963], [0.545, 0.94], [0.625, 0.85], [0.675, 0.75], [0.7, 0.66], [0.69, 0.6], [0.71, 0.555], [0.745, 0.48], [0.785, 0.4], [0.825, 0.39], [0.845, 0.3], [0.925, 0.29], [0.945, 0.18], [1.045, 0.17], [1.065, 0.05], [1.125, 0.03], [1.175, 0], [1.245, 0]] },
    skullsoft: { tomb: .8, P: [[0, 1], [.2, .98], [.32, .93], [.4, .85], [.45, .75], [.475, .66], [.465, .6], [.485, .555], [.52, .48], [.6, .38], [.7, .28], [.8, .19], [.9, .11], [1, .05], [1.08, 0], [1.15, 0]] },
    skullwedge: { tomb: .66, P: [[0, 1], [.2, .98], [.32, .93], [.4, .85], [.45, .75], [.475, .66], [.465, .6], [.485, .555], [.52, .49], [.56, .4], [.62, .3], [.68, .21], [.74, .13], [.8, .06], [.86, .02], [.9, 0], [.97, 0]] },
    skullledge: { tomb: .78, P: [[0, 1], [.2, .98], [.32, .93], [.4, .85], [.45, .75], [.475, .66], [.465, .6], [.485, .555], [.55, .52], [.68, .5], [.72, .42], [.74, .3], [.78, .24], [.86, .15], [.92, .08], [.98, .03], [1.04, 0], [1.1, 0]] },
    // more skull-like right profiles on the stepped skull (owner, build 560: "a slight more skullesh shape to right profile")
    sk1: { tomb: 1.005, P: [[0, 1], [.13, .996], [.26, .988], [.38, .975], [.47, .958], [.545, .93], [.625, .85], [.675, .75], [.715, .66], [.735, .6], [.705, .565], [.69, .53], [.71, .49], [.745, .45], [.785, .4], [.825, .39], [.845, .3], [.925, .29], [.945, .18], [1.045, .17], [1.065, .05], [1.125, .03], [1.175, 0], [1.245, 0]] },
    sk2: { tomb: 1.005, P: [[0, 1], [.13, .996], [.26, .988], [.38, .975], [.47, .958], [.545, .93], [.625, .85], [.675, .75], [.715, .66], [.735, .6], [.705, .565], [.69, .53], [.71, .49], [.77, .44], [.8, .4], [.79, .37], [.82, .34], [.845, .3], [.925, .29], [.945, .18], [1.045, .17], [1.065, .05], [1.125, .03], [1.175, 0], [1.245, 0]] },
    sk3: { tomb: .74, P: [[0, 1], [.13, .996], [.26, .988], [.38, .975], [.47, .958], [.545, .93], [.625, .85], [.675, .75], [.715, .66], [.735, .6], [.705, .565], [.69, .53], [.71, .49], [.745, .42], [.78, .36], [.79, .32], [.77, .3], [.79, .27], [.86, .24], [.88, .2], [.84, .17], [.8, .15], [.82, .1], [.86, .05], [.9, .02], [.95, 0], [1.02, 0]] },
    sk4: { tomb: .64, P: [[0, 1], [.13, .996], [.26, .988], [.38, .975], [.47, .958], [.545, .93], [.625, .85], [.675, .75], [.715, .66], [.735, .6], [.7, .56], [.72, .52], [.75, .47], [.73, .44], [.76, .4], [.765, .36], [.75, .345], [.765, .33], [.76, .29], [.78, .25], [.74, .22], [.66, .21], [.68, .15], [.72, .08], [.78, .03], [.84, 0], [.9, 0]] },
    // skull-like profiles after a real skull's side view (owner, build 561: "look up skull profiles ... i think you are
    // thinking face profiles"): a big round braincase, the small face low at the front, the brow (glabella), the notch at
    // the root of the nose (nasion), a short nasal bone then the deep nose hole, the upper jaw jutting with its teeth, the
    // lower jaw's long straight edge running back to its corner (gonion). The eye socket is a hole, not on the outline.
    k1: { tomb: .86, P: [[0, 1], [.15, .99], [.3, .96], [.43, .9], [.54, .81], [.62, .71], [.67, .62], [.7, .55], [.69, .51], [.675, .49], [.7, .45], [.72, .415], [.695, .4], [.685, .37], [.7, .3], [.78, .29], [.8, .18], [.9, .17], [.92, .05], [.98, .03], [1.03, 0], [1.1, 0]] },
    k2: { tomb: .7, P: [[0, 1], [.15, .99], [.3, .96], [.43, .9], [.54, .81], [.62, .71], [.67, .62], [.7, .55], [.69, .51], [.675, .49], [.7, .45], [.72, .415], [.695, .4], [.685, .37], [.71, .355], [.72, .32], [.725, .285], [.721, .272], [.728, .262], [.72, .25], [.74, .2], [.77, .17], [.82, .12], [.87, .06], [.93, .02], [.99, 0], [1.06, 0]] },
    k3: { tomb: .38, P: [[0, 1], [.15, .99], [.3, .96], [.43, .9], [.54, .81], [.62, .71], [.67, .62], [.7, .55], [.69, .51], [.675, .49], [.7, .45], [.72, .415], [.695, .4], [.685, .37], [.71, .355], [.72, .32], [.725, .285], [.721, .272], [.728, .262], [.72, .25], [.73, .24], [.724, .23], [.73, .22], [.72, .2], [.735, .16], [.72, .13], [.69, .12], [.55, .125], [.47, .13], [.45, .09], [.47, .04], [.52, 0], [.6, 0]] },
    k4: { tomb: .4, P: [[0, 1], [.15, .99], [.3, .96], [.43, .9], [.54, .81], [.62, .71], [.67, .62], [.68, .6], [.72, .5], [.71, .46], [.695, .44], [.72, .4], [.745, .36], [.715, .34], [.7, .3], [.73, .28], [.745, .23], [.75, .18], [.745, .15], [.752, .12], [.742, .09], [.75, .06], [.73, .04], [.66, .035], [.6, .06], [.53, .05], [.5, .02], [.52, 0], [.6, 0]] },
    // (owner, build 562: "just the upper part of the skull, the eye sockets and nose and then end with top teeth on
    // ground"): no lower jaw; the braincase, brow, the notch at the root of the nose, the short nasal bone, the deep
    // nose hole, the upper jaw and its teeth resting on the ground; the eye socket a dark hollow in the rock (`ORBIT`)
    k5: { tomb: .4, orbit: [.585, .47, .078, .066], P: [[0, 1], [.15, .99], [.3, .955], [.42, .89], [.52, .8], [.6, .7], [.65, .62], [.68, .56], [.675, .53], [.66, .51], [.685, .46], [.705, .41], [.685, .39], [.67, .35], [.665, .31], [.69, .29], [.705, .24], [.715, .19], [.72, .15], [.713, .135], [.721, .12], [.714, .105], [.722, .09], [.715, .075], [.722, .06], [.715, .045], [.72, .03], [.71, .012], [.7, 0], [.8, 0]] },
    // after the owner's second drawing (build 564): a long top falling gently to the brink, then a steep, nearly upright
    // rounded face with the hollow of an eye in it, and a low ledge jutting at its foot with the sepulchre in it
    d2: { tomb: .75, orbit: [.53, .55, .06, .05], P: [[0, 1], [.15, 1.0], [.3, .995], [.42, .985], [.49, .955], [.57, .89], [.62, .79], [.64, .64], [.63, .52], [.65, .4], [.66, .26], [.645, .17], [.69, .13], [.78, .11], [.84, .07], [.88, .03], [.92, 0], [.99, 0]] },
    shoulder: { tomb: .74, P: [[0, 1], [.12, .97], [.2, .9], [.235, .79], [.27, .7], [.33, .64], [.5, .6], [.62, .57], [.655, .47], [.675, .34], [.7, .27], [.76, .2], [.84, .12], [.92, .05], [.98, 0], [1.05, 0]] },
  };
  const SH0 = SHAPES[SHAPE] || SHAPES.skull;
  // ?look=f with the painted hill (build 628): the sepulchre is the cave painted into the picture (owner: "the sepluchre is
  // built into picture so we don't need to draw one"): the burden goes into it, no cave is drawn
  const PCAVE = LF && !/[?&]hill=625\b/.test(location.search);
  // (owner, build 558: "the hill can be bigger and long flat space on top"): H_TOP 1050 (was 860)
  const H_TOP = +(new URLSearchParams(location.search).get('htop') || 1500), START = LF ? -520 : 480, WALL_END = 860, TOMB_X = PCAVE ? 5520 : 4380 + SH0.tomb * (H_TOP + 30), SLOPE0 = 1180, CREST0 = 4080, CROSS_X = 4820, CREST1 = 4400, FALL1 = 5340;
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
  // the crown as one even arch centred on the cross (owner: "even more rounded and the rounding should be symmetric
  // horizontally (not its sloped to the right)"): the same fall on both sides of CROSS_X, the ramp joining it on the
  // left at its own slope and the skull's face leaving it on the right
  const CAP = SHAPE === 'skullsteps', CAP_W = 600, CAP_D = .075;
  const cap = x => SK_H * (1 - CAP_D * Math.pow((x - CROSS_X) / CAP_W, 2));
  const capS = x => -2 * SK_H * CAP_D * (x - CROSS_X) / (CAP_W * CAP_W);
  function dome(x) { const u = (x - SK_X) / (x < SK_X ? SK_L : SK_R); if (Math.abs(u) >= 1) return 0; return x < SK_X ? SK_H * Math.pow(1 - Math.pow(Math.abs(u), 3), 1.1) : SK_H * Math.pow(1 - u * u, .55); }
  // ?look=f: THE HILL IS THE PAINTED CRAG'S OWN SHAPE (owner, build 607 to 609: "i liked the hill before with slight jags
  // but not the three pinnacles", then "the left side of hill can go down but should follow the contours of the picture"):
  // the painting's own skyline (PIN_TAB, painting units at SK_H 1080 from painting x 3160 every 8, from its alpha before
  // the left fade) is the land's outline (pinDraw) and, smoothed, the line he walks on (gh); toward the painting's left
  // end both blend into the drawn ramp over its fade (PIN_W)
  // ?hill=618: build 618's hill for comparing (owner: "i like the climbing on the 618 hill slightly better"): its painting,
  // its edge as painted, its walking line and its colours; ?figs=0 hides the figures on the hill
  const H618 = !/[?&]hill=625\b/.test(location.search), SUN_T = +((location.search.match(/[?&]suntone=([\d.]+)/) || [, .5])[1]), FIGS_OFF = /[?&]figs=0\b/.test(location.search),
    // (build 645, owner: "the images up the hill aren't working for now ... maybe scrap for [now]"): the dark figures on
    // the climb (his family, Help, Evangelist, Good-will) and their words are off; the stars on the flat still speak.
    // ?figs=1 brings them back.
    HILLFIGS_OFF = !/[?&]figs=1\b/.test(location.search);
  const PIN_ON = LF, HP_TOP = PIN_ON ? -1097.65 : -1089.42, HP_H = PIN_ON ? 1101.03 : 1093.75, HP_X = PIN_ON ? 2064.71 : 3149.64, HP_W = PIN_ON ? 3564.71 : 2478.34;
  const PIN_TAB = [0,0,0,0,0,0,0,0,0,0,0,0,8,0,8,9,9,10,12,12,15,19,20,25,28,30,33,35,37,38,40,42,45,48,56,60,63,66,69,69,71,74,78,81,83,86,89,93,97,100,107,111,114,116,120,128,130,129,140,146,152,159,156,159,163,165,170,170,173,178,186,186,194,195,197,204,206,212,219,223,228,235,245,251,255,262,266,272,271,275,283,285,288,294,299,305,309,311,309,323,326,327,334,341,342,348,360,377,393,422,432,435,437,440,441,442,443,443,444,455,460,464,469,473,474,477,479,482,485,488,491,496,502,507,514,527,529,533,538,540,547,555,563,567,574,575,578,583,586,595,600,608,612,617,623,628,634,637,642,646,652,654,659,666,674,676,681,691,697,698,700,705,722,731,751,758,757,760,781,802,810,813,815,817,819,820,821,823,832,838,841,843,846,847,850,852,853,856,859,862,865,868,869,874,877,880,883,887,887,894,896,898,901,904,911,911,918,921,922,928,931,937,938,943,944,950,953,959,960,963,968,972,975,980,982,983,986,990,992,999,999,1002,1003,1007,1008,1009,1010,1013,1016,1018,1024,1024,1028,1032,1034,1035,1036,1037,1041,1043,1043,1036,1040,1044,1045,1044,1045,1049,1047,1050,1053,1050,1054,1055,1055,1054,1055,1060,1059,1061,1064,1062,1067,1067,1067,1072,1070,1072,1070,1070,1070,1068,1070,1075,1076,1075,1075,1078,1077,1081,1083,1084,1084,1082,1081,1081,1084,1086,1085,1081,1081,1083,1081,1080,1084,1081,1076,1082,1082,1082,1084,1084,1083,1084,1084,1084,1084,1084,1084,1077,1073,1072,1072,1071,1067,1064,1066,1066,1064,1067,1065,1066,1065,1060,1056,1045,1014,994,974,975,969,1018,1021,1021,1019,1013,1010,1005,971,963,962,977,1001,1004,1004,1005,1000,989,944,927,915,928,928,923,909,894,882,862,802,778,760,744,726,630,622,613,604,585,551,523,520,515,469,469,454,445,435,434,433,425,413,405,395,372,330,327,329,330,331,330,324,314,305,296,287,269,254,237,209,203,200,200,201,200,194,186,159,146,118,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], PIN0 = 2073, PIN1 = PIN0 + 8 * (PIN_TAB.length - 1);
  // his walking line is ONE smooth curve (owner, build 618: "he can go behind rocks on the way - maintaining the smooth curve of
  // hill"): the skyline smoothed twice over about 160 painting units, then lowered only where the skyline dips under it (the
  // dip's depth, spread), so he never walks on air; where the painted rocks rise above it they are drawn again in front of
  // him (rocksFront), so he passes behind them
  const PIN_S = (() => { const T = PIN_TAB, sm = (A, R) => A.map((v, i) => { let a = 0, n = 0; for (let j = -R; j <= R; j++) { const q = A[i + j]; if (q != null) { a += q; n++; } } return a / n; });
    const S = sm(sm(T, 20), 20), D = S.map((v, i) => Math.max(0, v - T[i])), DM = D.map((v, i) => { let m = 0; for (let j = -14; j <= 14; j++) { const q = D[i + j]; if (q != null) m = Math.max(m, q); } return m; });
    const L = sm(sm(DM, 10), 10); return S.map((v, i) => v - L[i]); })();
  // the top edge, cropped clean in code (owner, build 619: "smooth the top of the rock a little or make it clean crop - edge
  // looks messy - maybe give me a couple options"): the rock picture (hill-crag-f) is solid a little above its own skyline,
  // so the game cuts it along a line of its choosing: ?edge=clean (default: the skyline lightly smoothed, the rocks kept),
  // ?edge=smooth (a rounder top), ?edge=line (just above his walking line: no rocks to pass behind), ?edge=raw (as painted)
  const EDGE_OPT = (location.search.match(/[?&]edge=(\w+)/) || [, H618 ? 'soft' : 'smooth'])[1];
  let EDGE_R = null, WALK = null;
  const EDGE = (() => { const T = PIN_TAB, sm = (A, R) => A.map((v, i) => { let a = 0, n = 0; for (let j = -R; j <= R; j++) { const q = A[i + j]; if (q != null) { a += q; n++; } } return a / n; });
    if (EDGE_OPT === 'raw') return T;
    const C = sm(sm(T, 2), 2), cr = (4380 + (CROSS_X - SK_X) / (SK_H / 1080) - PIN0) / 8;
    // (build 635, owner: "the edges on the mountain are a little too bumpy") ?edge=soft, now the default for 618's
    // painting: the painted skyline smoothed twice over about 50 painting units; small knobs cut off, small notches filled
    const E = EDGE_OPT === 'smooth' ? sm(sm(T, 8), 8) : EDGE_OPT === 'soft' ? sm(sm(T, 3), 3) : EDGE_OPT === 'line' ? PIN_S.map((v, i) => lerp(v + 3, C[i], smooth(cr - 4, cr + 8, i))) : C;
    // a little rockiness on the smooth top (owner, build 623: "while smooth can have a little more texture at the closest
    // frame - maybe slight rockiness"): small broken facets and chips laid along it, never below his walking line
    const hs = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return 2 * (v - Math.floor(v)) - 1; };
    const vn = u => { const i = Math.floor(u), f = u - i; return lerp(hs(i), hs(i + 1), f); };
    const R = EDGE_OPT === 'raw' ? () => 0 : i => 2.6 * vn(i / 2.7) + 1.3 * vn(i / 1.15 + 40) - .8 * Math.abs(vn(i / 5 + 90));
    // (build 624: chips only cut DOWN into the edge, never rise above it or below his line, so no rock is drawn again in
    // front of him; EDGE_R is the chipped edge, used only as the camera comes close, see ptop)
    const E0 = E.map((v, i) => T[i] > 0 ? Math.min(v, T[i] + 13) : T[i]);
    // (build 624) he walks on the smooth edge itself (WALK, 1.5 under it), so the edge's lit line never crosses him and his
    // shadow lies where he stands; the chips go at most 5 under the edge, hidden by his sunk feet (SINK 10)
    EDGE_R = E0.map((v, i) => T[i] > 0 ? v + Math.max(-5, 1.3 * Math.min(0, R(i) - .6)) : v);
    WALK = E0.map((v, i) => T[i] > 0 ? v - 1.5 : v);
    return E0; })();
  const pinS = () => SK_H / 1080, pinW = xp => pinS() * (xp - 4380) + SK_X;
  function pinAt(T, x) { const s = pinS(), xp = 4380 + (x - SK_X) / s; if (xp < PIN0) return -1; if (xp >= PIN1) return 0;
    const f = (xp - PIN0) / 8, i = Math.floor(f); return s * lerp(T[i], T[i + 1], f - i); }
  // smooth in the wide shots, a little rocky close up (owner, build 624: "I like the smoothness of the wide shots but the close
  // shots more texture")
  const ptop = x => { if (!PIN_ON) return pinAt(PIN_TAB, x); if (H618 || !EDGE_R) return pinAt(EDGE, x); const k = smooth(.45, .8, cam.z); const a = pinAt(EDGE, x); return k > .001 && a > 0 ? lerp(a, pinAt(EDGE_R, x), k) : a; };
  const PIN_W = x => x >= pinW(PIN0) ? 1 : 0;
  function pinDraw(x) { const w = PIN_W(x); if (w <= 0) return gh0(x); return lerp(gh0(x), ptop(x), w); }
  function crossH() { if (PIN_ON) { const t = ptop(CROSS_X); if (t > 0) return t; } return gh(CROSS_X); }
  // he walks the painted track (owner, build 612: "the figure now needs to walk the path"): traced by hand on build 611's
  // painting (world [x, h]), smoothed; it winds up across the face below the hill's top edge, and joins the top on the
  // crown (PATH_J), where the cross stands
  const PATH_ON = /[?&]track=1\b/.test(location.search);
  const PATH_P = [[1339,19],[1650,105],[1889,201],[2128,308],[2248,397],[2367,481],[2451,540],[2535,607],[2654,653],[2774,715],[2917,808],[3013,875],[3085,918],[3180,976],[3264,1038],[3360,1095],[3455,1138],[3527,1191],[3635,1262],[3754,1329],[3874,1372],[4017,1406],[4208,1444],[4448,1473],[4687,1497],[4878,1511]], PATH_J = [4250, 4450];
  const PATH_S = (() => { const T = []; for (let x = PATH_P[0][0]; x <= PATH_P[PATH_P.length - 1][0]; x += 8) { let i = 0; while (i < PATH_P.length - 2 && PATH_P[i + 1][0] < x) i++; const [a, b] = [PATH_P[i], PATH_P[i + 1]]; T.push(lerp(a[1], b[1], clamp((x - a[0]) / (b[0] - a[0])))); }
    return T.map((v, i) => { let a = 0, n = 0; for (let j = -6; j <= 6; j++) { const q = T[i + j]; if (q != null) { a += q; n++; } } return a / n; }); })();
  function pathH(x) { const f = (x - PATH_P[0][0]) / 8, i = Math.floor(f); if (i < 0) return -1; if (i >= PATH_S.length - 1) return -1; return lerp(PATH_S[i], PATH_S[i + 1], f - i); }
  function gh(x) { if (PIN_ON) { const w = PIN_W(x); if (w > 0) { const top = lerp(gh0(x), pinAt((H618 && EDGE_OPT === 'raw') || !WALK ? PIN_S : WALK, x), w), ph = PATH_ON ? pathH(x) : -1;
    if (!PATH_ON) return top;
    if (ph < 0) return x < PATH_P[0][0] ? Math.min(top, PATH_P[0][1] * clamp((x - SLOPE0) / (PATH_P[0][0] - SLOPE0))) : top;
    return lerp(Math.min(ph, top), top, smooth(PATH_J[0], PATH_J[1], x)); } } return gh0(x); }
  const topH = x => PIN_ON ? pinDraw(x) : gh(x);
  function gh0(x) {
    // the ramp: a smooth swoop (concave, steepening a little as it climbs) that runs up into the skull's crown with the
    // dome's own slope where they meet, so there is no notch; past the crown, the skull's round dome falling to the plain
    let h;
    if (x <= RAMP1) { const top = CAP ? cap(RAMP1) : dome(RAMP1), u = clamp((x - SLOPE0) / (RAMP1 - SLOPE0)), m0 = .15, m1 = CAP ? capS(RAMP1) * (RAMP1 - SLOPE0) / top : .52, u2 = u * u, u3 = u2 * u;
      h = top * ((u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) + (u3 - u2) * m1);
      h += (3 * Math.sin(x * .011) + 1.6 * Math.sin(x * .031 + 1)) * sm(SLOPE0, SLOPE0 + 300, x) * (1 - sm(RAMP1 - 400, RAMP1, x)); }
    else h = x <= SK_X ? (CAP ? cap(x) : dome(x)) : skTop(x);
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
    [.97, .012], [1, 0], [1.08, 0]].map(p => p);
  if (SH0.P) SKP.splice(0, SKP.length, ...SH0.P);
  // the skull's top follows the same arch up to its brow's shoulder
  // and turns down into the face round a soft shoulder (owner: "a bit of corner on upper right - can you smooth that
  // out"): a curve from where the arch ends to the face's first steep point, its control where the arch's tangent and
  // the face's line meet
  if (CAP) { const fi = SKP.findIndex(([u]) => u >= .67), F = SKP[fi], G = SKP[fi + 1], top = [], ue = .46;
    for (let u = 0; u < ue; u += .04) top.push([u, cap(SK_X + u * SK_H) / SK_H]);
    const v0 = cap(SK_X + ue * SK_H) / SK_H, m0 = capS(SK_X + ue * SK_H), m1 = (G[1] - F[1]) / (G[0] - F[0]);
    const cu = (F[1] - v0 + m0 * ue - m1 * F[0]) / (m0 - m1), C = [cu, v0 + m0 * (cu - ue)];
    for (let k = 0; k < 8; k++) { const t = k / 8, w = 1 - t; top.push([w * w * ue + 2 * w * t * C[0] + t * t * F[0], w * w * v0 + 2 * w * t * C[1] + t * t * F[1]]); }
    SKP.splice(0, fi, ...top); }
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
    // (build 657, owner: "the outline of the hill flicker as we zoom"): the outline was sampled from the picture's left
    // edge at a step that changed with the zoom, so its points slid along the bumpy edge as the camera moved; now it is
    // sampled at fixed places on the land (the skyline table's own points), whatever the camera does
    if (PIN_ON) { const S = 8 * pinS(), a = pinW(PIN0); for (let x = a + Math.floor((xa - a) / S) * S; x <= xb + S; x += S) O.push([x, -pinDraw(x)]); return O; }
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
  let BURT = null;
  let BURDEN = null, RTEX = null, RPAT = null, HPAINT = null, loaded = false;
  const HP_ON = new URLSearchParams(location.search).get('hp') !== '0';
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
    ['wife', 'family', 'goodwill-reach', 'room4-caster'].forEach(n => loadImg(n + '.webp').then(im => { MIM[n] = im; }).catch(() => {}));
    loadImg('cross-burden.webp').then(im => { BURDEN = im; }).catch(() => {});
    // (build 659, owner: "the new burden looks awful - prefer old"): the video's sack is used only with ?burt=1; the burden is its own old picture again
    if (/[?&]burt=1\b/.test(location.search)) loadImg('cross-burden-turn.webp?v=658').then(im => { BURT = im; }).catch(() => {});
    REL.forEach(m => loadImg(m.img + '.webp').then(im => { if (im) RIM[m.img] = im; }).catch(() => {}));
    // the hill painted by the image model (round 2 of the owner's hill): rounded weathered rock, toned dark grey, its left
    // end faded into the drawn ramp; cropped to the rock at 1.5 px a world unit (at SK_H 1080): world x 2834 to 5654, height 1089 down to 2 below the ground
    // ?look=f: the hill painted as Friedrich's crag (build 606), laid on the same outline as the old painting
    if (HP_ON) loadImg(LOOKF ? (H618 ? (/[?&]paint=618\b/.test(location.search) ? 'hill-crag.webp?v=618' : 'hill-crag-r.webp?v=638') : 'hill-crag-f.webp?v=623') : 'hill-cross.webp?v=601').then(im => { HPAINT = im; }).catch(() => {});
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
  let sunT = 0, sunGo = false, sunH = 0, sunYr = null, zoomP = 0;
  let night = 0, bur = null, dawn = 0, gold = 0, goldTo = 0, sun = 0, robe = 0, robeTo = 0, mark = 0, markTo = 0, rollShow = 0, rollGone = 0, shine = 0, shineTo = 0, gone = 0, goneTo = 0;
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
  // THE TELEPHOTO, second try (owner, of build 621's ridges zooming with the hill: "liked the old one best in terms of heights
  // of hills - I think what's more annoying is how the hills horizontal positions change relative to each other"): their
  // heights and sizes are as before build 621 (fixed on the screen), but the ridges no longer slide past one another as he
  // goes: as through a long lens from far off, every ridge slides at nearly ONE pace (`PAN`: each layer's old pace pulled
  // most of the way to the middle one). ?pan=1 keeps the old spread of paces; ?pan=0 slides them all exactly together.
  // ?tele=1 brings back build 621's zooming of the whole background.
  const QS = new URLSearchParams(location.search), BG_A = +(QS.get('tele') ?? 0), BG_Z0 = .8;
  const PAN_K = +(QS.get('pan') ?? .15), PAN_MID = .06, PAN = p => PAN_MID + (p - PAN_MID) * PAN_K;
  const bgS = () => Math.pow(cam.z / BG_Z0, BG_A), by = y => FOOTY + (y - FOOTY) * bgS();
  const TEARZ = /[?&]tearzoom=1\b/.test(location.search);
  const ZOOM_AT = 0, ZOOM_LEN = 3300, END_BACK = +((location.search.match(/[?&]endback=([\d.]+)/) || [, 1.5])[1]);
  const SEPLOOK = /[?&]seplook=1\b/.test(location.search);
  function camTick(snap) {
    const near = { cx: Ch.x + lerp(250, 150, closeK), z: lerp(.8, 1.15, closeK) };
    if (ph === 'cross' || ph === 'tumble' || ph === 'gone' || ph === 'after' || ph === 'shine' || ph === 'leaps' || ph === 'end') { near.cx = Math.max(CROSS_X - 130, Ch.x + 170); near.z = .86;
      // (build 658, owner: "let stay back a little bit and not zoom in all the way (maybe 1.5 times back from your original ending)")
      if (ph !== 'cross') near.z = .86 / END_BACK; }
    // ?look=f: the cross stands on the summit's highest pinnacle, well above him: draw back enough to keep it whole
    if (PIN_ON && Ch.x > CROSS_X - 1600) { const up = crossH() + CROSS_H + 20 - gh(Ch.x); if (up > 0) near.z = Math.min(near.z, (FOOTY - 34) / up); }
    const open = ph === 'look', fitT = (FOOTY - 30) / (crossH() + CROSS_H - tombSill() + 40);
    const wide = open ? { cx: (START + CROSS_X) / 2 + 420, z: Math.min(VW / (CROSS_X - START + 900), (FOOTY - 40) / (H_TOP + CROSS_H + 40)) } : { cx: (STOP_X + TOMB_X) / 2 + 40, z: Math.min(VW / (TOMB_X - STOP_X + 760), fitT) };
    let tcx = lerp(near.cx, wide.cx, wideK), tz = Math.exp(lerp(Math.log(near.z), Math.log(wide.z), wideK));
    const wh = open ? 40 : tombSill() - 14, fh = lerp(gh(Ch.x), wh, wideK);
    let twl = FOOTY + fh * tz + (open ? 28 : 0) * wideK;
    // the look from the top after the cut: wide, he and the cross high in the picture, the hill falling away below
    if (topK > .001) { const z2 = .4, wl2 = 250 + gh(Ch.x) * z2; tcx = lerp(tcx, Ch.x - 40, topK); twl = lerp(twl, wl2, topK); tz = Math.exp(lerp(Math.log(tz), Math.log(z2), topK)); }
    // ?look=f: never cut the cross's top off (it stands on the summit, well above him)
    if (PIN_ON && topK <= .001) { const c0 = (open ? 28 : 0) * wideK, up = crossH() + CROSS_H + 10 - fh;
      // (build 629) only as the cross comes into the picture, so the night walk starts close on him (owner: "we should
      // start zoomed in"), drawing back smoothly as it nears
      const away = Math.abs(CROSS_X - tcx) - VW / 2 / tz, kC = Math.max(wideK, 1 - smooth(0, 700, away));
      if (up > 0 && FOOTY + c0 - up * tz < 34 && kC > .001) { const z1 = Math.max(.05, (FOOTY + c0 - 34) / up); tz = Math.exp(lerp(Math.log(tz), Math.log(z1), kC)); twl = FOOTY + fh * tz + c0; } }
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
  const bend = () => LF ? sm(SLOPE0 + 250, WALK_X - 60, Ch.x) : 0;
  function run(go) {
    if (!RUNP.ready) return walk(go ? MAXV * .9 : 0);
    if (go) {
      // THE BURDEN GROWS HEAVIER UP THE HILL (owner, build 646: "let's do A and B"): he slows as the hill steepens (his
      // pictures turn slower with him, so his feet do not slide) and bends lower under it (`bend()`, in the drawing);
      // the child has to keep holding. Ours: the book says only that he ran "not without great difficulty" ({92}).
      const rk = .4 * (1 - .42 * bend()), st = RUNP_META.vpx * CHR_K * rk; Ch.x += st; Ch.lastV = st; Ch.ranim += rk; Ch.run = Math.min(1, Ch.run + .14); Ch.sd = null;
      if (Math.floor(Ch.ranim) % 14 === 0 && Math.floor(Ch.ranim - rk) % 14 !== 0 && audio()) groundStep(typeof STEP_RUN === 'number' ? STEP_RUN : 1.2, 1.3);
      return st;
    }
    Ch.lastV = 0; Ch.run = Math.max(0, Ch.run - .14); if (Ch.sd == null) Ch.sd = QUIET[0];
    return 0;
  }
  const tintNow = () => {
    const pre = LOOKF ? [54, 52, 56] : LOOKR ? [56, 48, 50] : [58, 58, 72], dw = LOOKF ? [66, 58, 56] : LOOKR ? [66, 52, 48] : [70, 62, 66], gd = LOOKF ? [88, 68, 54] : LOOKR ? [78, 58, 48] : [96, 78, 64], robeC = [150, 128, 100];
    let c = mix(pre, dw, dawn); c = mix(c, gd, gold);
    // (build 645, owner: "christian also looks pretty washed out and ghosly"): at night he was paler than the dark
    // behind him; now he is the darkest thing in the picture, a solid figure against the lighter wall, land and sky
    if (night > .01) c = mix(c, [24, 25, 33], night);
    // (build 650, owner: "yes do all three"): and he stays a dark figure the whole climb and at the cross until the sun
    // is up (he had turned pale grey again on the upper slope, lighter than the hill under him); at sunrise, lit from
    // behind, a dark warm figure, not a mid brown
    if (LF) c = mix(mix([24, 25, 33], [29, 26, 29], dawn), [56, 43, 36], gold);
    // in a memory he runs through he is a darker figure against it (pale, he showed like a ghost on the burning hill)
    const rd = REL_ON ? Math.max(...REL.map(m => m.a * (m.dark || 0))) * (1 - wideK) : 0; if (rd > 0) c = mix(c, [26, 22, 26], rd);
    return mix(c, robeC, robe * .6);
  };
  const figC = mk(8, 8);
  // running up the slope he leans a little back with the ground, so his feet land on it (owner: "tilt him ever so
  // slightly back so his feet land right as he runs up hill"): a part of the ground's own angle, about his feet
  let TILT = 0;
  const slopeTilt = x => -.6 * Math.atan((gh(x + 12) - gh(x - 12)) / 24);
  // his feet sink a little into the hill in every pose (owner: "so he doesn't look like he's floating")
  const SINK = 10, KNEEL_SINK = 5;
  const QP = (k, d) => { const m = location.search.match(new RegExp('[?&]' + k + '=([\\d.,]+)')); return m ? m[1].split(',').map(Number) : d; };
  const COATC = QP('coatc', [206, 142, 92]), COATK = QP('coatk', [.6])[0], COATCON = QP('coatcon', [.85])[0];
  let FIGCON = 0, FIGSH = 0; const rimC = document.createElement('canvas'), shC = document.createElement('canvas');
  function figure(c, im, meta, x, h, face, alpha, tint, rim) {
    if (!im || alpha <= .004) return;
    im = solidOf(im);
    const W = im.width, H = im.height; if (figC.width !== W || figC.height !== H) { figC.width = W; figC.height = H; }
    const f = figC.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, W, H); f.drawImage(im, 0, 0);
    f.globalCompositeOperation = 'multiply'; f.fillStyle = css(tint); f.fillRect(0, 0, W, H);
    // (build 657) the coat's own light and shade deepened (it read flat and washed out)
    if (FIGCON) { f.globalAlpha = FIGCON; f.drawImage(im, 0, 0); f.globalAlpha = 1; }
    if (rim > .01) { const g = f.createLinearGradient(face > 0 ? 0 : W, 0, face > 0 ? W : 0, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, css([255, 210, 150], .35 * rim)); f.globalCompositeOperation = 'source-atop'; f.fillStyle = g; f.fillRect(0, 0, W, H); }
    f.globalCompositeOperation = 'destination-in'; f.drawImage(im, 0, 0); f.globalCompositeOperation = 'source-over';
    const K = CHR_K;
    // a hair-thin edge of the sun's light along the tops of him (head, shoulders), the sun being behind
    if (LIT && rim > .01) { if (rimC.width !== W || rimC.height !== H) { rimC.width = W; rimC.height = H; } const q = rimC.getContext('2d');
      q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, W, H); q.drawImage(im, 0, 0); q.globalCompositeOperation = 'destination-out'; q.drawImage(im, 0, 3);
      q.globalCompositeOperation = 'source-in'; q.fillStyle = 'rgb(255,216,160)'; q.fillRect(0, 0, W, H);
      f.globalCompositeOperation = 'source-atop'; f.globalAlpha = Math.min(1, .8 * rim); f.drawImage(rimC, 0, 0); f.globalAlpha = 1; f.globalCompositeOperation = 'source-over'; }
    // his shadow toward us: his own shape turned over at his feet, lying down the hill's face, soft, fading toward its head
    const sa = FIGSH ? shA() * alpha : 0;
    if (sa > .01) { const sw = Math.ceil(W / 5), sh = Math.ceil(H / 5); if (shC.width !== sw || shC.height !== sh) { shC.width = sw; shC.height = sh; } const q = shC.getContext('2d');
      q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, sw, sh); q.drawImage(im, 0, 0, sw, sh); q.globalCompositeOperation = 'source-in';
      const g = q.createLinearGradient(0, sh * meta.ground / H, 0, 0); g.addColorStop(0, 'rgba(8,7,14,1)'); g.addColorStop(.5, 'rgba(8,7,14,.55)'); g.addColorStop(1, 'rgba(8,7,14,0)'); q.fillStyle = g; q.fillRect(0, 0, sw, sh);
      c.save(); landClip(c, x - 260, x + 260); c.translate(x, -h + SINK - 2); c.transform(1, 0, clamp((x - CROSS_X) / 1400, -.3, .3), 1, 0, 0); c.scale(face, -shLen()); c.globalAlpha = sa;
      c.drawImage(shC, -meta.ax * K, -meta.ground * K, W * K, H * K); c.restore(); }
    c.save(); c.translate(x, -h + SINK); if (TILT) c.rotate(TILT); c.scale(face, 1); c.globalAlpha = alpha;
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
  function contact(c, x, h, a = 1, rx = 34) { const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, 'rgba(6,6,12,.5)'); g.addColorStop(.6, 'rgba(6,6,12,.24)'); g.addColorStop(1, 'rgba(6,6,12,0)'); c.save(); c.beginPath(); c.moveTo(x - 80, 60); for (const [xx, yy] of outline(x - 80, x + 80, 4)) c.lineTo(xx, yy); c.lineTo(x + 80, 60); c.closePath(); c.clip(); c.translate(x, -h + SINK - 2); c.scale(rx, 5); c.globalAlpha = a; c.fillStyle = g; c.fillRect(-1, -1, 2, 2); c.restore(); }
  function drawChr(c) {
    FIGSH = 1; try { drawChr0(c); } finally { FIGSH = 0; }
  }
  function drawChr0(c) {
    const tint = tintNow(), rim = gold * (1 - wideK), x = Ch.x, h = gh(x) + Ch.hop;
    contact(c, x, gh(x), 1 - Math.min(1, Ch.hop / 40) * .6);
    const useClip = Ch.cf >= 0 && CLIP.ready, fc = Ch.face;
    if (Ch.tv && TURN.length) { const f0 = clamp(Math.round(Ch.tv.t), 0, TURN.length - 1); figure(c, TURN[f0], TURN_META, x, h, 1, 1, tint, rim); return; }
    if (useClip) {
      const f0 = clamp(Math.round(Ch.cf), 0, CLIP.length - 1);
      if (Ch.fade < 1 && STD.length) figure(c, STD[atTime(STD_META, breathT(Ch.sd || 0))], STD_META, x, h, fc, 1 - Ch.fade, tint, rim);
      // the new clothes come at the height of the light that wraps him (robe .5): a clean swap, no double picture
      const coat = robe >= .5 && COAT.ready;
      if (coat) { const ct = mix(tint, COATC, COATK); FIGCON = COATCON;
        if (Ch.lp != null && LEAPC.ready) figure(c, LEAPC[clamp(Math.round(Ch.lp), 0, LEAPC.length - 1)], LEAP_META, x, h, fc, 1, ct, rim);
        else if (Ch.wo != null && CWALK.ready) figure(c, CWALK[Math.floor(Ch.wa) % CWALK.length], CWALK_META, x, h, 1, 1, ct, rim);
        else { const k = (Ch.cc || 0) % 96, cf = clamp(Math.round(k < 48 ? k : 96 - k), 0, COAT.length - 1); figure(c, COAT[cf], COAT_META, x, h, fc, 1, ct, rim); Ch.coatF = cf; } FIGCON = 0; }
      else if (Ch.kn != null && KNC.ready) {
        // kneeling, he settles into the ground and with its slope, so his back leg rests on the hill (owner: "brought down
        // more so his back legs doesn't stick out")
        const kk = smooth(0, 40, Ch.kn); TILT = slopeTilt(x) / .6 * kk;
        figure(c, KNC[clamp(Math.round(Ch.kn), 0, KNC.length - 1)], KNC_META, x, h - KNEEL_SINK * kk, fc, 1, tint, rim); TILT = 0; }
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
        c.save(); c.translate(x, -h + SINK - 3); c.scale(fc, 1);
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
      // no mark drawn on his forehead (owner: "i don't like seal on his forehead"); the book's mark is told, not shown
    } else if (Ch.run > 0 && RUNP.ready) {
      TILT = (slopeTilt(x) + .2 * bend()) * Ch.run;
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
    // (build 658, owner: "the burden tumbling could use some animation when it flips (spend some $ on this)"): a video of
    // the sack turning over end on end (38 pictures, one whole turn), shown by how far it has turned
    if (BURT && bur.path) { const sq = clamp(bur.sq || 0, -.4, .25), N = 38, C = 128, fi = ((Math.floor((bur.ph || 0) / 6.2832 * N) % N) + N) % N, dw = hh * 1.68;
      if (figC.width !== C || figC.height !== C) { figC.width = C; figC.height = C; }
      const f = figC.getContext('2d'), sxs = (fi % 8) * C, sys = Math.floor(fi / 8) * C, tint = tintNow();
      f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, C, C); f.drawImage(BURT, sxs, sys, C, C, 0, 0, C, C);
      f.globalCompositeOperation = 'multiply'; f.fillStyle = css(mix(mix(tint, [176, 164, 162], .5 * (1 - bur.dk) + .2 * gl), [8, 7, 10], bur.dk)); f.fillRect(0, 0, C, C);
      f.globalCompositeOperation = 'destination-in'; f.drawImage(BURT, sxs, sys, C, C, 0, 0, C, C); f.globalCompositeOperation = 'source-over';
      c.save(); c.translate(bur.x, -h - hh / 2 + 2 + hh * (sq < 0 ? -sq * .5 : 0)); c.scale(1 - sq * .7, 1 + sq); c.rotate(bur.r || 0); c.globalAlpha = bur.a;
      c.drawImage(figC, -dw / 2, -dw / 2, dw, dw); c.restore(); return; }
    const sq = clamp(bur.sq || 0, -.4, .25), cp = Math.cos(bur.ph || 0), fy = (cp < 0 ? -1 : 1) * (.58 + .42 * Math.abs(cp)), fx = 1 + .07 * (1 - Math.abs(cp));
    c.save(); c.translate(bur.x, -h - hh / 2 + 2 + hh * (sq < 0 ? -sq * .5 : 0)); c.scale((1 - sq * .7) * fx, (1 + sq) * fy); c.rotate(bur.r); c.globalAlpha = bur.a;
    const tint = tintNow(), W = BURDEN.width, H = BURDEN.height;
    if (figC.width !== W || figC.height !== H) { figC.width = W; figC.height = H; }
    const f = figC.getContext('2d'); f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, W, H); f.drawImage(BURDEN, 0, 0); f.globalCompositeOperation = 'multiply'; f.fillStyle = css(mix(mix(tint, [176, 164, 162], bur.H != null ? .5 * (1 - bur.dk) + .2 * gl : 0), [8, 7, 10], bur.dk));       f.fillRect(0, 0, W, H); f.globalCompositeOperation = 'destination-in'; f.drawImage(BURDEN, 0, 0); f.globalCompositeOperation = 'source-over';
    c.drawImage(figC, -w / 2, -hh / 2, w, hh); c.restore();
    // its loosed ropes trailing behind it as it flies off his back (the fling only)
    if (FLING && bur.st === 'roll' && bur.t < 140) { const fa = (1 - bur.t / 140) * bur.a, vx = bur.vx || 0, vy = -(bur.vz || 0), L0 = Math.hypot(vx, vy) || 1, ux = -vx / L0, uy = -vy / L0;
      c.save(); c.strokeStyle = css(mix(tintNow(), [60, 48, 40], .5), .8 * fa); c.lineCap = 'round';
      for (let k = 0; k < 3; k++) { const ox = bur.x + (k - 1) * 6, oy = -h - hh / 2 + (k - 1) * 5, len = 34 + 12 * k; c.lineWidth = 1.6; c.beginPath(); c.moveTo(ox, oy);
        for (let j = 1; j <= 8; j++) { const u = j / 8, wv = Math.sin(bur.t * .35 + j * 1.3 + k * 2) * 6 * u; c.lineTo(ox + ux * len * u - uy * wv, oy + uy * len * u + ux * wv); } c.stroke(); }
      c.restore(); }
  }
  // the tumble, by simple physics (owner: "need a natural fall - think about physics of fall, it's not too important the
  // path it takes so long as it is natural"): it runs down the hill's face toward us, gathering speed under gravity with a
  // little friction; the rough face kicks it up now and then (more often and higher the faster it goes); in the air it
  // falls under gravity and bounces back a part of its speed; each bounce knocks it a little sideways and changes its
  // spin; it is drawn larger as it comes nearer. A seeded random, so it falls the same way each time
  // (build 658, owner: "can following the natural contours of the rock like its hitting and bouncing"): the ledges of the
  // painted cliff between him and the cave, marked on the painting ([x, height], world units): the sack drops from one
  // to the next under gravity, strikes (a thump, a squash, a puff of dust), rolls a moment along the ledge and goes
  // over; it turns faster the further it has fallen; last it drops off the shelf over the cave onto the cave's floor
  const LEDGES = [[4600, 1425], [4760, 1195], [4930, 1005], [5070, 790], [5210, 640], [5330, 498], [5425, 452], [5462, 84], [5440, 84]];
  const LEDGE_UP = [16, 30, 26, 34, 22, 20, 7, 12, 9], LG = .15;
  function burdenLedges() {
    if (!bur.path) { const x0 = bur.x, H0 = gh(bur.x) + 4; bur.path = [[x0, H0], ...LEDGES]; Object.assign(bur, { pi: 0, pt: 0, rest: 0, gl: 0, ph: 0, pw: .07, sq: 0, sqa: 0, sqv: 0, r: 0, z: null, rnd: rgen(77), dust: [], sx0: x0, sH0: H0 }); }
    const P = bur.path, R = bur.rnd, n = P.length - 1;
    bur.t++; bur.gl = Math.min(1, bur.gl + .02);
    for (const d of bur.dust) { d.x += d.vx; d.y += d.vy; d.vx *= .97; d.vy *= .97; d.r += .3; d.a -= .012; }
    bur.sqa += (-bur.sq) * .16; bur.sqa *= .8; bur.sq += bur.sqa + bur.sqv; bur.sqv = 0;
    bur.ph += bur.pw; bur.r = .1 * Math.sin(bur.ph * .5 + .7);
    bur.k = 1 + .3 * sm(0, n, bur.pi + (bur.rest > 0 ? 0 : .5));
    if (bur.rest > 0) {
      // on a ledge: it rolls a little way along it, slowing, then goes over
      bur.rest--; bur.x += bur.rv; bur.rv *= .9; bur.pw += (.045 - bur.pw) * .2; bur.sx0 = bur.x; bur.H = bur.sH0;
      return;
    }
    const xa = bur.sx0, Ha = bur.sH0, [xb, Hb] = P[bur.pi + 1], up = LEDGE_UP[bur.pi], v0 = Math.sqrt(2 * LG * up), T = (v0 + Math.sqrt(v0 * v0 + 2 * LG * Math.max(0, Ha - Hb))) / LG;
    bur.pt++; const tt = Math.min(bur.pt, T);
    bur.x = lerp(xa, xb, tt / T); bur.H = Ha + v0 * tt - LG * tt * tt / 2;
    // in the air it stretches a little and turns freely, faster after a longer drop
    bur.sq += (Math.min(.1, Math.abs(v0 - LG * tt) * .02) - bur.sq) * .05;
    if (bur.pt >= T) {
      const hit = Math.abs(v0 - LG * T); bur.H = Hb; bur.x = xb; bur.pi++; bur.pt = 0; bur.sx0 = xb; bur.sH0 = Hb;
      thump(Math.min(1.15, .22 + hit * .1)); bur.sqv -= Math.min(.42, hit * .045); bur.pw = .09 + .012 * hit + .03 * R();
      for (let i = 0; i < 3 + Math.round(hit * .5); i++) bur.dust.push({ x: xb + (R() - .5) * 40, y: Hb + R() * 8, vx: (R() - .5) * 1.2, vy: .2 + R() * .5, r: 8 + R() * 10, a: Math.min(1, .35 + hit * .07) });
      if (bur.pi >= n) { bur.st = 'in'; bur.t = 0; bur.x0 = bur.x; return; }
      bur.rest = bur.pi >= n - 2 ? 2 : 4 + Math.round(R() * 5); bur.rv = (P[bur.pi + 1][0] - xb > 0 ? 1 : -1) * (1 + R());
    }
  }
  // into the cave: it has landed on the cave's floor; it rolls on in with what speed it has left, smaller as it goes
  // deeper and darker as the dark takes it, until it cannot be told from the dark; then one dull fall far inside
  function burdenIn() {
    bur.t++; const tt = bur.t, sill = 84;
    for (const d of bur.dust) { d.x += d.vx; d.y += d.vy; d.vx *= .97; d.vy *= .97; d.r += .3; d.a -= .01; }
    bur.sqa += (-bur.sq) * .16; bur.sqa *= .8; bur.sq += bur.sqa;
    // it waits on the floor only if the storyteller has not yet reached "the mouth of the sepulchre"
    if (bur.go == null) { bur.pw += (.012 - bur.pw) * .1; bur.ph += bur.pw; bur.H = sill; if ((tumbleT && G.t - tumbleT > 300) || tt > 420) { bur.go = tt; bur.pw = .06; } else return; }
    const q = sm(0, 150, tt - bur.go);
    bur.pw += (.02 - bur.pw) * .02; bur.ph += bur.pw; bur.x = bur.x0 - 46 * q; bur.H = sill + 46 * q; bur.k = 1.3 - .62 * q;
    bur.dk = sm(.05, .7, q); bur.gl = 1 - sm(0, .5, q); bur.a = 1 - sm(.72, 1, q);
    if (tt - bur.go === 190) { thump(1.1); if (audio()) hiss(70, .6, .1, 1.6); }
    if (tt - bur.go > 250) { bur.st = 'gone'; tombT = t; }
  }
  function burdenTick() {
    if (!bur) return;
    if (bur.dust) for (const d of bur.dust) { d.x += d.vx; d.y += d.vy; d.vx *= .97; d.vy *= .97; d.r += .35; d.a -= .006; }
    if (bur.st === 'roll' && PCAVE) return burdenLedges();
    if (bur.st === 'in' && bur.path) return burdenIn();
    if (bur.st === 'roll') {
      if (bur.x0 == null) { Object.assign(bur, { x0: bur.x, H0: gh(bur.x), gl: 0, s: 0, vs: .6, z: 0, vz: 1.4, vx: .3, dx: 0, w: 0, ph: 0, pw: .05, sq: 0, sqa: 0, sqv: 0, rnd: rgen(77) }); if (FLING) Object.assign(bur, { vz: 5.2, vx: -2.3, vs: .2, w: -.09, z: 4 }); }
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
  // the sun's height on the screen: tied to the cross, but never lower than it has already been (the camera's slow
  // move in would otherwise slide it down the sky)
  function sunRest(y) { if (!sunGo) return y; sunYr = sunYr == null ? y : Math.min(sunYr, y); return sunYr; }
  function sky(c) {
    // ?look=r: the whole palette after Friedrich's Morning in the Riesengebirge (owner: "Make entire color palette match"):
    // a pale grey-blue upper sky, a lilac middle, peach and pale gold low down; never a deep navy
    const pre = LOOKF ? [[30, 36, 52], [70, 78, 94], [118, 120, 122]] : LOOKR ? [[40, 44, 60], [92, 90, 110], [150, 134, 140]] : [[26, 30, 44], [60, 66, 84], [118, 112, 120]],
      dw = LOOKF ? [[56, 70, 100], [128, 136, 148], [186, 176, 158]] : LOOKR ? [[62, 68, 90], [150, 138, 156], [222, 184, 164]] : [[30, 34, 50], [78, 74, 92], [168, 140, 134]],
      gd = LOOKF ? [[136, 144, 164], [226, 198, 176], [252, 220, 170]] : LOOKR ? [[132, 146, 168], [222, 200, 184], [250, 224, 182]] : [[84, 100, 132], [206, 172, 146], [246, 214, 164]];
    // the glory: how far the sun has climbed past the crossing (0..1); everything below grows with it
    const GL = sm(.96, 1.4, sunH), gl = LOOKF ? [[122, 152, 192], [222, 230, 222], [255, 246, 204]] : LOOKR ? [[118, 140, 172], [240, 196, 168], [255, 226, 176]] : [[64, 100, 162], [238, 168, 150], [255, 228, 172]];
    const st = [0, 1, 2].map(i => mix(mix(mix(mix(pre[i], dw[i], dawn), gd[i], gold), gl[i], GL * .85), NIGHTC[i], night));
    const g = c.createLinearGradient(0, Math.min(0, by(0)), 0, by(HY + 40)); g.addColorStop(0, css(st[0])); g.addColorStop(.6, css(st[1])); g.addColorStop(1, css(st[2]));
    c.fillStyle = g; c.fillRect(0, 0, VW, VH);
    // (build 650) FRIEDRICH'S BAND BEFORE THE SUN: through the grey stretch of the climb a thin band of rose with pale
    // lemon under it lies low on the horizon where the sun will rise, growing as the night goes, the blue kept above
    // it; it gives way to the sunrise itself
    if (LF) { const k = dawn * (1 - .85 * night) * (1 - gold); if (k > .01) { const hy0 = by(HY), B0 = bgS(), cx0 = sx(CROSS_X + SUN_DX);
      for (const [col, ry, a, dy] of [[[214, 142, 136], 180, .62, -40], [[244, 214, 158], 80, .7, -6]]) { c.save(); c.translate(cx0, hy0 + dy * B0); c.scale(VW * 1.05, ry * B0);
        const bg = c.createRadialGradient(0, 0, 0, 0, 0, 1); bg.addColorStop(0, css(col, a * k)); bg.addColorStop(.5, css(col, a * k * .45)); bg.addColorStop(1, css(col, 0)); c.fillStyle = bg; c.fillRect(-1, -1, 2, 2); c.restore(); } } }
    // (build 632) open sky: no clouds (owner: "the simplicity of stars and open sky is nice")
    if (night > .01) stars(c);
    // the far light, low behind the crown before dawn; the sun breaking behind the crown, rising behind where the
    // beams cross, and on up the sky (kept inside the picture)
    const cxs = sx(CROSS_X + SUN_DX), top = sy(crossH() + CROSS_BY + 4), y0 = sy(crossH()) + 40 * Math.min(1, cam.z / .86), sY = LOOKF && SUN_DX
      // ?look=f: as in the painting, the sun stays low, just over the farthest ranges, rising only a little
      ? by(HY - 96 - 60 * Math.min(1.3, sunH))
      : sunRest(Math.max(VH * .1, y0 + (top - y0) * sunH));
    if (LOOKF) {
      // the painting's bright lemon-cream horizon: a wide warm glow round the low sun and a pale band along the horizon
      const lk = Math.max(.35 * dawn, gold), lg = c.createRadialGradient(cxs, sY, 0, cxs, sY, VW * .75);
      // (build 653) warm amber as the sun breaks, clearing to lemon-cream as it climbs
      const wA = mix([255, 222, 168], [255, 250, 222], GL), wB = mix([255, 206, 150], [255, 244, 206], GL), wC = mix([250, 196, 146], [248, 238, 206], GL);
      lg.addColorStop(0, css(wA, .75 * lk)); lg.addColorStop(.25, css(wB, .4 * lk)); lg.addColorStop(.6, css(wC, .14 * lk)); lg.addColorStop(1, css(wC, 0));
      c.fillStyle = lg; c.fillRect(0, 0, VW, VH);
      const B = bgS(), hb = c.createLinearGradient(0, by(HY - 220), 0, by(HY + 40)); hb.addColorStop(0, css(wB, 0)); hb.addColorStop(.7, css(mix([255, 214, 160], [255, 246, 214], GL), .5 * lk)); hb.addColorStop(1, css(mix([255, 218, 166], [255, 248, 222], GL), .3 * lk));
      c.fillStyle = hb; c.fillRect(0, by(HY - 220), VW, 260 * B);
    }
    if (GL > .01) {
      // a long band of rose and gold lying along the horizon
      const B = bgS(), hb = c.createLinearGradient(0, by(HY - 150), 0, by(HY + 50)); hb.addColorStop(0, 'rgba(255,170,130,0)'); hb.addColorStop(.55, css([255, 176, 132], .22 * GL)); hb.addColorStop(.85, css([255, 222, 160], .3 * GL)); hb.addColorStop(1, 'rgba(255,222,160,0)');
      c.fillStyle = hb; c.fillRect(0, by(HY - 150), VW, 200 * B);
    }
    const glowR = 260 + 200 * gold + 320 * GL, gg = c.createRadialGradient(cxs, sY, 0, cxs, sY, glowR);
    gg.addColorStop(0, css([255, 226, 170], Math.min(.9, .18 + .5 * gold + .1 * dawn + .12 * GL) * (1 - .8 * night))); gg.addColorStop(.4, css([250, 196, 140], .08 + .22 * gold + .1 * GL)); gg.addColorStop(1, 'rgba(250,190,140,0)');
    c.fillStyle = gg; c.fillRect(0, 0, VW, VH);
    if (GL > .01) {
      // rays, once in the level: soft broad shafts fanning from the sun, turning very slowly, each fading outward
      c.save(); c.globalCompositeOperation = 'lighter'; c.translate(cxs, sY); const RL = VW * .9;
      for (let i = 0; i < 13; i++) {
        const a0 = i * 6.283 / 13 + G.t / 5200 + .5 * Math.sin(i * 2.7), w = .11 + .05 * Math.sin(i * 4.1 + 1), al = (.02 + .01 * Math.sin(i * 1.7 + G.t / 190)) * GL;
        const rg = c.createRadialGradient(0, 0, 20, 0, 0, RL); rg.addColorStop(0, css([255, 236, 190], 0)); rg.addColorStop(.12, css([255, 232, 184], al)); rg.addColorStop(1, 'rgba(255,220,170,0)');
        for (const k of [1, .78, .56, .34]) { c.fillStyle = rg; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a0 - w * k) * RL, Math.sin(a0 - w * k) * RL); c.lineTo(Math.cos(a0 + w * k) * RL, Math.sin(a0 + w * k) * RL); c.closePath(); c.fill(); }
      }
      c.restore();
    }
    // (build 654) the disc shows only as the camera comes back to him, so it is never seen sliding down behind the far hills
    const sunA = sun;
    if (sunA > .01) { const sun = sunA, R = (15 + 4 * cam.z) * (1 + .4 * GL), d = c.createRadialGradient(cxs, sY, 0, cxs, sY, R * 2.2); d.addColorStop(0, css([255, 252, 236], .95 * sun)); d.addColorStop(.45, css([255, 240, 200], .85 * sun)); d.addColorStop(.5, css([255, 226, 170], .35 * sun)); d.addColorStop(1, 'rgba(255,220,160,0)'); c.fillStyle = d; c.fillRect(cxs - R * 3, sY - R * 3, R * 6, R * 6); }
    // long thin clouds, lit from beneath after dawn; more of them catch fire as the sun climbs (the last five only then)
    const CLD = [[.16, .9, .1, .05, 0], [.27, .7, .08, .02, 0], [.36, 1.1, .07, .08, 0], [.08, .6, 0, .31, 1], [.21, .5, 0, .62, 1], [.31, .8, 0, .44, 1], [.42, .6, 0, .77, 1], [.13, 1.2, 0, .9, 1]];
    for (const [y, w, a, p, late] of CLD) {
      const CS = bgS(), yy = by(y * VH), xx = VW / 2 + (VW * (.45 * Math.sin(p * 9)) - (cam.cx * .02 + (late ? G.t * .004 : 0)) % 300) * CS, body = mix(mix([70, 74, 92], [255, 214, 170], gold), [226, 150, 150], GL * .6), al = late ? .2 * GL : a + .08 * gold + .1 * GL;
      if (al < .005) continue;
      c.save(); c.translate(xx, yy); c.scale(VW * w / 2 * CS, (7 + 3 * GL) * CS); const q = c.createRadialGradient(0, 0, 0, 0, 0, 1); q.addColorStop(0, css(body, al)); q.addColorStop(1, css(body, 0)); c.fillStyle = q; c.fillRect(-1, -1, 2, 2); c.restore();
      if (GL > .01) {
        // its underside burning gold
        c.save(); c.translate(xx, yy + (4 + 2 * GL) * CS); c.scale(VW * w / 2 * .8 * CS, 2.6 * CS); const q2 = c.createRadialGradient(0, 0, 0, 0, 0, 1); q2.addColorStop(0, css([255, 226, 160], (late ? .3 : .22) * GL)); q2.addColorStop(1, 'rgba(255,220,150,0)'); c.fillStyle = q2; c.fillRect(-1, -1, 2, 2); c.restore();
      }
    }
  }
  // THE NEW LOOK, A TRIAL (art direction, Nov 23; owner: "yes do 1 and 2"): only with ?look=r. After Friedrich's
  // *Morning in the Riesengebirge*, which the owner loved: layer after layer of misty ridges going back, each paler than the
  // one before, a band of mist lying in every valley, the sky pale and luminous low down; and Kuindzhi's trick for the
  // holy light (it glows because what is round it is darkened, not because it is brightened). Without ?look=r, unchanged.
  // ?look=f (owner: "yes make it match the painting. But I also really like what we currently have (so save it)"): the
  // painting itself: a pale blue to lemon-cream sky, white cool mist, blue-grey far ranges, grey-green middle hills, and
  // the hill the ONE warm thing, lit burnt orange from the side by a sun rising low just left of the cross. ?look=r (the
  // backlit version, build 603) is kept as it was. LOOKR is true for either (the shared ridges and their mist).
  const LOOKF = LF;
  const LOOKR = LOOKF || /[?&]look=r\b/.test(location.search);
  // with ?look=f the sun rises this far left of the cross (world units), so its light falls across the hill's face
  // (build 651, owner: "should sun be behind cross as before?" ... "yes move it back"): the sun is behind the cross
  // again: it breaks behind the crown at the cross's foot, stands behind where the beams cross as the hymn begins, and
  // climbs on above it. The far light he has followed since Level 1 is behind the cross, and now that the hill is dark
  // and backlit (build 650) the light and the cross share one line. ?sundx=-430 gives the old place, low and to the left.
  const SUN_DX = LOOKF ? +((location.search.match(/[?&]sundx=(-?\d+)/) || [, 0])[1]) : 0;
  const RR = [3, 4, 5, 6, 7, 8].map(seed => { const r = rgen(seed * 17 + 3); return [1, 2, 3, 4, 5, 6].map(k => [r() * 6.28, k, .6 + .8 * r()]); });
  const rrY = (i, X, base, amp) => { let y = base; for (const [p, k, a] of RR[i]) y += amp * a / k * Math.sin(X * k * k * .0007 + p); return y; };
  function farR(c) {
    const pre = LOOKF ? [[70, 78, 94], [118, 120, 122]] : [[92, 90, 110], [150, 134, 140]], dw = LOOKF ? [[128, 136, 148], [186, 176, 158]] : [[150, 138, 156], [222, 184, 164]], GL = sm(.96, 1.4, sunH), gd = LOOKF ? [mix([226, 198, 176], [212, 226, 226], GL), mix([252, 220, 170], [252, 246, 208], GL)] : [[222, 200, 184], [250, 224, 182]];
    const hz = mix(mix(pre[1], dw[1], dawn), gd[1], gold), up = mix(mix(pre[0], dw[0], dawn), gd[0], gold);
    // Friedrich's far ranges: lilac and blue-violet, cool against the warm mist
    const deep = LOOKF ? mix(mix([58, 66, 80], [88, 100, 116], dawn), mix([120, 108, 134], [104, 118, 134], GL), gold) : mix(mix([62, 62, 84], [92, 86, 112], dawn), [118, 112, 146], gold);
    const mistC = LOOKF ? mix(mix(mix([170, 176, 186], [86, 98, 130], night), [224, 228, 232], dawn), mix([255, 210, 168], [228, 234, 246], GL), gold) : mix(mix([150, 150, 164], [196, 176, 172], dawn), [255, 196, 150], gold);
    // far to near: base line (screen), height of its swells, parallax, how far toward the deep colour
    const L = [[HY - 64, 26, .03, .1], [HY - 44, 30, .06, .2], [HY - 24, 30, .1, .32], [HY - 4, 26, .15, .45], [HY + 18, 22, .22, .58], [HY + 40, 18, .3, .7]];
    const B = bgS();
    L.forEach(([base, amp, p, k], i) => {
      let col = mix(mix(hz, up, .25), deep, k);
      if (night > .01) col = mix(col, [18 + 4 * i, 20 + 4 * i, 32 + 3 * i], night * .75);
      // the nearer hills take the same burnt orange as the hill, fading into the cool distance
      // the nearer ridges stand dark and warm against the light (umber, not lit orange)
      if (i >= 2) col = LOOKF
        // the nearer hills: a hint of dark rust-red, kin to the hill, darker nearer
        ? (false ? mix(col, mix(mix([52, 58, 58], [76, 86, 82], dawn), [86, 98, 90], gold), (i - 1) / 5 * .75) : mix(col, mix(mix(mix([62, 44, 46], [88, 54, 50], dawn), [96, 60, 56], gold), [66, 72, 104], gold * GL * (i < 5 ? .85 : .8)), (i - 1) / 5 * .75))
        : mix(col, mix(mix([56, 44, 44], [70, 52, 48], dawn), [84, 56, 46], gold), (i - 1) / 5 * (.45 + .4 * gold));
      // (build 629) hills at night as Kuindzhi, Friedrich and Hasui paint them (owner: "the hills at night need to look more
      // like hills at night"): cool blue, each nearer range a step darker down to near black, no warm colour; the far ones
      // paler against the glowing horizon
      // (build 630, after Whistler's Nocturne, Millet's Starry Night and Kuindzhi's Night): flat silhouettes, the far one a
      // little lighter than the land, each nearer one darker, the near ones nearly black
      // (build 634, owner: "the hills look kinda green"): the far ridges in the sky's own greyed blue, deeper nearer, the
      // nearest almost black with a breath of warm umber, kin to the hill's dark rust; the far ones held well below the
      // horizon glow so it stays the lightest thing in the land
      // (build 645, owner: "i wonder if the hills are also distracting... the night sky and natural beauty should be the
      // focus"): lighter, and all six ranges close together in tone, so they read as one quiet band of far land
      if (night > .01) { const u = i / 5, nc = mix([56, 68, 92], [31, 37, 54], u); col = mix(col, nc, night); }
      c.beginPath(); c.moveTo(0, VH);
      // (at night their swells are lower too: long quiet lines under the stars)
      const ampN = amp * (1 - .45 * night);
      for (let X = 0; X <= VW + 8; X += 6) c.lineTo(X, by(rrY(i, VW / 2 + (X - VW / 2) / B + cam.cx * PAN(p) * 6, base, ampN)));
      c.lineTo(VW, VH); c.closePath(); c.fillStyle = css(col); c.fill();
      // at night the far ridges' tops catch a breath of starlight (a hair-thin cool line, fainter nearer)
      if (false && night > .05 && i < 4) { c.save(); c.strokeStyle = css([120, 134, 170], (.16 - .035 * i) * night); c.lineWidth = 1; c.beginPath();
        for (let X = 0; X <= VW + 8; X += 6) c.lineTo(X, by(rrY(i, VW / 2 + (X - VW / 2) / B + cam.cx * PAN(p) * 6, base, amp)) + .5); c.stroke(); c.restore(); }
      if (gold > .02) {
        // backlight on the ridge's top: brightest toward the sun, fading away from it
        const sxs = sx(CROSS_X + SUN_DX), g = c.createLinearGradient(0, 0, VW, 0);
        for (let q = 0; q <= 8; q++) { const X = q / 8 * VW, k = Math.exp(-Math.pow((X - sxs) / (VW * .45), 2)); g.addColorStop(q / 8, css(LOOKF ? [255, 196, 142] : [255, 150, 74], (.25 + .1 * i) * gold * k * (LOOKF ? .3 * (1 - .75 * GL) : 1))); }
        c.save(); c.strokeStyle = g; c.lineWidth = LOOKF ? 1.3 + .15 * i : 2.2 + .5 * i; c.beginPath();
        for (let X = 0; X <= VW + 8; X += 6) c.lineTo(X, by(rrY(i, VW / 2 + (X - VW / 2) / B + cam.cx * PAN(p) * 6, base, amp)) + 1); c.stroke(); c.restore();
      }
      // mist lying in the valley below this ridge: thickest low down, fading up the next ridge; strongest far off
      const mb = by(base + amp * .9), g = c.createLinearGradient(0, mb - 34 * B, 0, mb + 26 * B);
      const ma = (.62 - .07 * i) * (.75 + .25 * gold) * (LOOKF ? 1.2 : 1) * (1 - .9 * night);
      g.addColorStop(0, css(mistC, 0)); g.addColorStop(.62, css(mistC, ma)); g.addColorStop(1, css(mistC, ma * .5));
      c.fillStyle = g; c.fillRect(0, mb - 34 * B, VW, 60 * B);
      // (build 652) the mist takes the light's colour near the sun (lemon-peach), and stays cool away from it
      if (LOOKF && gold > .02) { const wa = ma * gold * .8; c.save(); c.beginPath(); c.rect(0, mb - 34 * B, VW, 60 * B); c.clip(); c.translate(sx(CROSS_X + SUN_DX), mb + 4 * B); c.scale(VW * .55, 34 * B);
        const wg = c.createRadialGradient(0, 0, 0, 0, 0, 1); wg.addColorStop(0, css([255, 232, 180], wa)); wg.addColorStop(.5, css([255, 226, 176], wa * .5)); wg.addColorStop(1, 'rgba(255,226,176,0)'); c.fillStyle = wg; c.fillRect(-1, -1, 2, 2); c.restore(); }
      if (i === 1 && night > .01) stormBolts(c);
    });
  }
  // Kuindzhi: once the sun is up, the picture darkens toward its edges and corners, away from the light
  function kuindzhi(c) {
    const k = LOOKR ? Math.max(gold, .5 * dawn) * (LOOKF ? .45 : 1) : 0; if (k < .02) return;
    const cxs = sx(CROSS_X + SUN_DX), cy = LOOKF ? by(HY - 120) : sy(crossH() + CROSS_BY), R = Math.hypot(VW, VH);
    const g = c.createRadialGradient(cxs, cy, R * .12, cxs, cy, R * .9);
    g.addColorStop(0, 'rgba(10,8,14,0)'); g.addColorStop(.45, css([14, 10, 18], .12 * k)); g.addColorStop(1, css([10, 8, 14], .42 * k));
    c.fillStyle = g; c.fillRect(0, 0, VW, VH);
  }
  function far(c) {
    if (LOOKR) return farR(c);
    const L = [[HY - 6, 10, .06, [92, 94, 110], [214, 190, 170], [120, 118, 132], [246, 216, 172]], [HY + 26, 14, .14, [74, 74, 90], [188, 162, 146], [104, 102, 118], [240, 206, 164]]];
    const B = bgS();
    L.forEach(([base, amp, p, c0, c1, h0, h1], i) => {
      const col = mix(mix(c0, mix(c0, c1, .4), dawn), c1, gold), hz0 = mix(mix(h0, mix(h0, h1, .4), dawn), h1, gold);
      c.beginPath(); c.moveTo(0, VH);
      for (let X = 0; X <= VW + 8; X += 8) c.lineTo(X, by(ridgeY(i, VW / 2 + (X - VW / 2) / B + cam.cx * PAN(p) * 6, base, amp)));
      c.lineTo(VW, VH); c.closePath(); c.fillStyle = css(col); c.fill();
      const g = c.createLinearGradient(0, by(base - 18), 0, by(base + 30)); g.addColorStop(0, css(hz0, 0)); g.addColorStop(.5, css(hz0, .45)); g.addColorStop(1, css(hz0, 0)); c.fillStyle = g; c.fillRect(0, by(base - 18), VW, 48 * B);
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
  // six trial ways to tie the skull's ledges into the slope (owner: "the bulging circular layers looks separate from slope"): ?hl=a..f
  // the burden bursting loose (owner, build 568, of a painting: "how burden was losed"): ?fling=1 to try
  const FLING = /[?&]fling=1/.test(location.search);
  const HL_OPT = (new URLSearchParams(location.search).get('hl') || 'g').toLowerCase();
  const ROCK_OPT = (new URLSearchParams(location.search).get('rock') || 'skull').toLowerCase();
  // the six trials (sketches for the owner; nothing here is used without ?hl=)
  function hillTrial(q, l, K, crag) {
    const xs = SLOPE0 - 100, WH = []; for (let x = xs; x < SK_X; x += 12) WH.push([x, gh(x)]); for (const p of SKO) WH.push(p);
    const clipW = c2 => { c2.beginPath(); c2.moveTo(xs, 60); WH.forEach(([x, h]) => c2.lineTo(x, -h)); c2.lineTo(SK_END, 60); c2.closePath(); };
    q.save(); clipW(q); q.clip(); l.save(); clipW(l); l.clip();
    const spur = (x, n, amp, seg) => amp * (crag(x + n * 613, 31 + n * 5, seg) - .45);
    // fill the region below an edge given as points [x, h], with a lit lip along it
    const band = (P, a, lip = .05) => { q.beginPath(); q.moveTo(P[0][0], 60); P.forEach(([x, h]) => q.lineTo(x, -h)); q.lineTo(P[P.length - 1][0], 60); q.closePath(); q.fillStyle = css([0, 0, 0], a); q.fill();
      l.strokeStyle = css([255, 255, 255], lip); l.lineWidth = 1.6; l.beginPath(); P.forEach(([x, h], i) => i ? l.lineTo(x, -h - 2) : l.moveTo(x, -h - 2)); l.stroke(); };
    const span = (f, x0 = xs, x1 = Math.max(SK_END, ...SKO.map(p => p[0])) + 40, st = 8) => { const P = []; for (let x = x0; x <= x1; x += st) P.push([x, f(x)]); return P; };
    if (K === 'a') {
      // A: the ledges run the WHOLE hill: nested copies of the whole outline, ramp and skull together, drawn in toward the tomb
      const cx0 = TOMB_X - 200;
      // (owner, build 557: "half circle bump is well defined but not connected to 'ramp' on the left"): the default now; each
      // band starts far down the ramp, faded in there, runs on under the ramp's line and over into the skull
      const fade = (a) => { const g = q.createLinearGradient(SLOPE0 + 200, 0, SLOPE0 + 1300, 0); g.addColorStop(0, css([0, 0, 0], 0)); g.addColorStop(1, css([0, 0, 0], a)); return g; };
      // (owner, build 558: "the levels don't have to be quite so parallel and evenly spaced. the hill can have more
      // character"): each band its own size, its own centre and a little tilt, unevenly spaced
      const LY = [[.93, 0, 0, .74], [.83, 220, .05, .82], [.75, -120, -.035, .66], [.56, 300, .06, .8], [.47, 60, -.02, .7], [.29, 340, .05, .84]];
      for (let n = 1; n <= LY.length; n++) { const [sc, dx, tl, xs] = LY[n - 1], cx = cx0 + dx;
        const P = WH.map(([x, h]) => { const X = cx + (x - cx) * (xs + (1 - xs) * sc), H = h * sc + tl * (X - cx) * smooth(10, 200, h * sc); return [X, H - spur(X, n, 80 + 12 * n, 150 + 30 * (n % 3)) * smooth(10, 90, H)]; });
        q.beginPath(); q.moveTo(P[0][0], 60); P.forEach(([x, h]) => q.lineTo(x, -h)); q.lineTo(P[P.length - 1][0], 60); q.closePath(); q.fillStyle = fade(.1); q.fill();
        l.strokeStyle = css([255, 255, 255], .05); l.lineWidth = 1.6; l.beginPath(); let pen = false;
        P.forEach(([x, h]) => { if (h < 20 || x < SLOPE0 + 900) { pen = false; return; } pen ? l.lineTo(x, -h - 2) : l.moveTo(x, -h - 2); pen = true; }); l.stroke(); }
    } else if (K === 'g') {
      // G, THE BEDS OF ROCK (owner, build 559: "the layers variability and shape should all have purpose -- think about
      // geometry of hill and how layers describe it"): the hill is a cuesta, a long gentle dip slope (the ramp) and a steep
      // scarp (the stepped face). Its beds lie parallel to the ramp under its surface (the slope IS the top bed), turn
      // level under the knoll, and are cut off by the scarp, where each hard bed stands out as one of the face's steps.
      // So each band's boundary: as deep under the ramp as its step is below the crown, level under the knoll at its
      // step's height, ending at that step; deeper beds darker; the boundary a little rough, a faint lit lip on the
      // harder bed's top
      const SH_ = SK_H, beds = [.75, .555, .39, .29, .17].map(v => v * SH_), seam = (a, b, k) => -k * Math.log(Math.exp(-a / k) + Math.exp(-b / k));
      beds.forEach((hk, n) => { const d = SH_ - hk, k = 40;
        const f = x => { const along = x <= SK_X ? gh(x) - d : SH_ - d + 2 * (x - SK_X); return seam(along, hk, k) + 3 * Math.sin(x * .013 + n * 2) + spur(x, n, 14, 90); };
        const P = span(f, xs, Math.max(SK_END, ...SKO.map(p => p[0])) + 40, 8).filter(([x, h]) => h > -40);
        if (P.length > 2) band(P, .085 + .01 * n, .06 - .006 * n); });
      // the eye socket: a shallow dark hollow in the rock behind the brow, its upper rim in shadow, its lower rim
      // catching a faint light, its edge a little rough
      if (SH0.orbit) { const [ou, ov, rx, ry] = SH0.orbit, ox = SK_X + ou * SK_H, oy = -ov * SK_H, RX = rx * SK_H, RY = ry * SK_H;
        const rim = (k2, grow) => { q.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2, r = 1 + .06 * Math.sin(a * 5 + 1) + .04 * Math.sin(a * 11) + grow, cs = Math.cos(a), sn = Math.sin(a), sq = Math.pow(Math.pow(Math.abs(cs), 3.2) + Math.pow(Math.abs(sn), 3.2), -1 / 3.2); const X = ox + cs * sq * RX * r, Y = oy + sn * sq * RY * r; i ? q.lineTo(X, Y) : q.moveTo(X, Y); } q.closePath(); };
        for (const [gr, a] of [[.35, .04], [.18, .07], [0, .13]]) { rim(0, gr); q.fillStyle = css([0, 0, 0], a); q.fill(); }
        q.save(); rim(0, 0); q.clip(); const g = q.createRadialGradient(ox, oy - RY * .35, RX * .1, ox, oy, RX * 1.1); g.addColorStop(0, css([0, 0, 0], .3)); g.addColorStop(1, css([0, 0, 0], .06)); q.fillStyle = g; q.fillRect(ox - RX * 1.3, oy - RY * 1.3, RX * 2.6, RY * 2.6); q.restore();
        l.strokeStyle = css([255, 255, 255], .08); l.lineWidth = 2; l.beginPath(); for (let i = 4; i <= 16; i++) { const a = i / 20 * Math.PI, X = ox + Math.cos(a) * RX * 1.02, Y = oy + Math.sin(a) * RY * 1.02; i > 4 ? l.lineTo(X, Y) : l.moveTo(X, Y); } l.stroke(); }
    } else if (K === 'h') {
      // H, CARVED ROCK (owner, build 568, of a painting: "the texture of hill"): no beds; the rock is many rounded
      // weathered masses, bulges and folds, each lit on its upper side and in shade beneath, with dark creases where
      // they meet; larger and bolder on the skull, smaller and fainter down the ramp
      const r = rgen(568), L = [];
      for (let i = 0; i < 140; i++) { const x = SLOPE0 + 400 + (SK_END - SLOPE0 - 300) * Math.pow(r(), .55), top = x <= SK_X ? gh(x) : skTop(x); if (top < 60) continue;
        const sk = smooth(SK_X - 900, SK_X, x), R = (40 + 70 * r()) * (.55 + .7 * sk), y = top * (.12 + .85 * r()); if (y + R * .4 > top) continue; L.push({ x, y, R, sk, sd: r() * 9 }); }
      L.sort((a, b) => b.y - a.y);
      for (const m of L) { const pts = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = m.R * (1 + .16 * Math.sin(a * 3 + m.sd) + .08 * Math.sin(a * 7 + m.sd * 2)); pts.push([m.x + Math.cos(a) * rr * 1.25, -m.y + Math.sin(a) * rr * .8]); }
        const path = c2 => { c2.beginPath(); pts.forEach(([x, y], i) => i ? c2.lineTo(x, y) : c2.moveTo(x, y)); c2.closePath(); };
        const st = .45 + .55 * m.sk;
        let g = q.createLinearGradient(m.x - m.R * .6, -m.y - m.R * .7, m.x + m.R * .7, -m.y + m.R * .8); g.addColorStop(0, css([0, 0, 0], 0)); g.addColorStop(.55, css([0, 0, 0], .05 * st)); g.addColorStop(1, css([0, 0, 0], .2 * st));
        path(q); q.fillStyle = g; q.fill();
        q.strokeStyle = css([0, 0, 0], .16 * st); q.lineWidth = 2.2; q.beginPath(); for (let i = 1; i <= 13; i++) { const [x, y] = pts[i]; i > 1 ? q.lineTo(x, y) : q.moveTo(x, y); } q.stroke();
        g = l.createLinearGradient(m.x - m.R * .7, -m.y - m.R * .8, m.x, -m.y); g.addColorStop(0, css([255, 255, 255], .07 * st)); g.addColorStop(1, css([255, 255, 255], 0));
        path(l); l.fillStyle = g; l.fill(); }
    } else if (K === 'b') {
      // B: tilted bedding: long rock shelves running down from the upper left across the whole hill to the lower right
      for (let n = 0; n < 7; n++) { const o = 980 - n * 150; band(span(x => o - .28 * (x - SLOPE0) + spur(x, n, 70, 160)), .075); }
    } else if (K === 'c') {
      // C: no ledges: one light falls from the sunrise over the crown; the ramp's top lit, the skull's face and foot in
      // deep shade, a soft turn between, so it is one mass in one light
      let g = q.createLinearGradient(SK_X - 300, 0, SK_END, 0); g.addColorStop(0, css([0, 0, 0], 0)); g.addColorStop(.55, css([0, 0, 0], .18)); g.addColorStop(1, css([0, 0, 0], .4));
      q.fillStyle = g; q.fillRect(xs, -SK_H - 60, SK_END - xs + 60, SK_H + 140);
      g = q.createLinearGradient(0, -SK_H, 0, 0); g.addColorStop(0, css([0, 0, 0], 0)); g.addColorStop(1, css([0, 0, 0], .22)); q.fillStyle = g; q.fillRect(xs, -SK_H - 60, SK_END - xs + 60, SK_H + 140);
      // the rugged face's own ledges only, near its edge
      for (let n = 1; n <= 3; n++) band(SKO.filter(([x, h]) => h < SK_H * .7).map(([x, h]) => [x - 40 * n, h - 30 * n + spur(x, n, 40, 90)]), .06, .03);
    } else if (K === 'd') {
      // D: ledges curving round the tomb, as if the whole hill had settled round the grave's mouth
      for (let n = 1; n <= 7; n++) { const R = 1500 - n * 190; band(span(x => { const u = (x - TOMB_X) / (R * 1.9); return Math.abs(u) >= 1 ? -50 : R * .62 * Math.sqrt(1 - u * u) + spur(x, n, 60, 150); }), .07); }
    } else if (K === 'e') {
      // E: the ramp's own shoulder runs on as ONE long ledge wrapping over the skull and down its face, with two below it
      for (let n = 1; n <= 3; n++) band(WH.map(([x, h]) => [x + 30 * n, h - 70 * n - spur(x, n, 50 + 10 * n, 200) * smooth(10, 90, h)]), .12, .07);
    } else if (K === 'f') {
      // F: level terraces: ledges at even heights across ramp and skull alike, darker below
      for (let n = 0; n < 6; n++) { const H0 = 760 - n * 135; band(span(x => H0 + spur(x, n, 60, 150)), .08); }
    }
    q.restore(); l.restore();
  }
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
    if (O === 'skull' && HL_OPT) hillTrial(q, l, HL_OPT, crag);
    if (O === 'skull' && !HL_OPT) {
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
  // the painted hill's light and shade spread to the full range of grey, made once (for ?look=f's modelled rock)
  let HPR = null;
  // (build 660, owner: "the sun is behind him so much of the hill should be shaded and there should be a shadow from him
  // coming our way"): the backlit scene. ?lit=0 gives the old light, to compare
  // (build 660, owner: "not a huge fan of the choir when the shining ones appear (save for later maybe?)"): only with ?choir=1
  const CHOIR_ON = /[?&]choir=1\b/.test(location.search);
  // (build 661, owner: "i don't like the shading on hill (at all) ... let's go back. the shadow on christian looks great"):
  // build 660's shaded face, lit ledge tops and violet-brown wash are off (only with ?shade=1); the shadows and the rim stay
  const SHADE = /[?&]shade=1\b/.test(location.search);
  const LIT = LF && !/[?&]lit=0\b/.test(location.search);
  // how long a shadow lies toward us (longest as the sun breaks, shorter as it climbs) and how strong
  const shLen = () => lerp(1.75, .6, sm(0, 1.2, sunH)), shA = () => LIT ? .66 * sun * (1 - night) : 0;
  const landClip = (c, xa, xb) => { c.beginPath(); c.moveTo(xa, 4000); for (const [xx, yy] of outline(xa, xb, 6)) c.lineTo(xx, yy); c.lineTo(xb, 4000); c.closePath(); c.clip(); };
  // the tops of the painted rock's ledges (where the painting is lighter than the rock round it), kept once as a soft
  // white mask at a quarter of its size: only these catch the sun; the faces toward us stay in shade
  let HPT = null, TOPT = null;
  function tintTops(tp) { const cv = mk(tp.width, tp.height), q = cv.getContext('2d'); q.drawImage(tp, 0, 0); q.globalCompositeOperation = 'source-in'; q.fillStyle = 'rgb(255,168,104)'; q.fillRect(0, 0, cv.width, cv.height); return cv; }
  function hpTops() {
    if (HPT || !HPAINT) return HPT;
    const W = Math.round(HPAINT.width / 4), H = Math.round(HPAINT.height / 4), cv = mk(W, H), q = cv.getContext('2d');
    q.drawImage(HPAINT, 0, 0, W, H); const d = q.getImageData(0, 0, W, H), p = d.data;
    const sm0 = mk(Math.ceil(W / 12), Math.ceil(H / 12)), q0 = sm0.getContext('2d'); q0.drawImage(cv, 0, 0, sm0.width, sm0.height);
    const bl = mk(W, H), qb = bl.getContext('2d'); qb.drawImage(sm0, 0, 0, W, H); const m = qb.getImageData(0, 0, W, H).data;
    for (let i = 0; i < p.length; i += 4) { const l = (p[i] + p[i + 1] + p[i + 2]) / 3, mm = (m[i] + m[i + 1] + m[i + 2]) / 3, a = Math.max(0, Math.min(1, (l - mm - 5) / 26));
      p[i] = p[i + 1] = p[i + 2] = 255; p[i + 3] = Math.round(255 * a * (p[i + 3] / 255)); }
    q.putImageData(d, 0, 0); return (HPT = cv);
  }
  // the cross's shadow, lying down the hill's face toward us: its own shape turned over at its foot, soft, fading
  function crossShadow(c) {
    const a = shA(); if (a < .01) return; const L = shLen(), x = CROSS_X, h = crossH(), T = 15, bw = 186;
    c.save(); landClip(c, x - 260, x + 260); c.translate(x, -h + 4);
    for (const [gw, ga] of [[1, .5], [1.9, .28], [3.2, .16]]) {
      const g = c.createLinearGradient(0, 0, 0, CROSS_H * L); g.addColorStop(0, css([8, 7, 14], a * ga)); g.addColorStop(.55, css([8, 7, 14], a * ga * .6)); g.addColorStop(1, css([8, 7, 14], 0));
      c.fillStyle = g; c.fillRect(-T / 2 * gw, 0, T * gw, CROSS_H * L);
      c.fillRect(-bw / 2 - (gw - 1) * 5, CROSS_BY * L - T * L / 2 * gw, bw + (gw - 1) * 10, T * L * gw); }
    c.restore();
  }
  function hpRelief() {
    if (HPR || !HPAINT) return HPR;
    const W = Math.round(HPAINT.width / 2), H = Math.round(HPAINT.height / 2), cv = mk(W, H), q = cv.getContext('2d');
    q.drawImage(HPAINT, 0, 0, W, H); const d = q.getImageData(0, 0, W, H), p = d.data;
    let lo = 255, hi = 0; for (let i = 0; i < p.length; i += 4) if (p[i + 3] > 200) { const l = (p[i] + p[i + 1] + p[i + 2]) / 3; if (l < lo) lo = l; if (l > hi) hi = l; }
    const sc = 255 / Math.max(1, hi - lo);
    for (let i = 0; i < p.length; i += 4) { const l = Math.max(0, Math.min(255, ((p[i] + p[i + 1] + p[i + 2]) / 3 - lo) * sc)); p[i] = p[i + 1] = p[i + 2] = l; }
    q.putImageData(d, 0, 0); return (HPR = cv);
  }
  // the ground's own tone, which the hill's foot goes over into
  // the darkening laid over the painted hill (build 650: darker at dawn, so the hill is a dark shape when the burden
  // falls, and darker at sunrise, so it is a backlit hill and the sun and sky carry the light)
  const landMul = () => H618 ? mix(mix(mix([40, 36, 44], [13, 14, 17], night), [60, 52, 52], dawn), [148, 130, 122], gold) : mix(mix(mix([60, 52, 58], [30, 28, 38], night), [112, 96, 90], dawn), [255, 246, 236], gold);
  const footCol = () => mix(mix(mix([24, 21, 24], [21, 21, 28], night), [25, 21, 23], dawn), [36, 27, 25], gold);
  function land(c) {
    const x0 = cam.cx - VW / 2 / cam.z - 40, x1 = cam.cx + VW / 2 / cam.z + 40, step = Math.max(4, 6 / cam.z);
    // (build 649) a low apron of ground at both feet: the hill's lowest 120 units, smoothed over a long stretch, drawn
    // first in the ground's tone, so where the hill met the flat in a sharp corner (the start of the climb, and the
    // cliff's foot on the far side) the ground now swells up to it in a soft curve
    if (LF) { const st = Math.max(16, 22 / cam.z), R = 290, lo = x => Math.min(120, Math.max(0, gh(x)));
      c.beginPath(); c.moveTo(x0 - R, 40);
      for (let x = x0 - R; x <= x1 + R; x += st) { let a = 0, w = 0; for (let k = -4; k <= 4; k++) { const ww = 1 - Math.abs(k) / 5; a += lo(x + k * R / 4) * ww; w += ww; } c.lineTo(x, -a / w); }
      c.lineTo(x1 + R, 40); c.closePath(); c.fillStyle = css(footCol()); c.fill(); }
    // with ?look=r the hill is warm umber (owner: "more like Morning in the Riesengebirge in that burnt orange look for the
    // hill and nearby hills", then "think about where sun is and if that's realistic" ... "yes do the realistic backlit
    // version"): the sun rises BEHIND the cross, so the face toward us is in its own shadow, a dark warm umber; the burnt
    // orange is only where backlight truly falls: a glowing rim along the crown and the sunlit mist and ridge tops
    const hc = LOOKF ? mix(mix([46, 38, 34], [92, 58, 40], dawn), [146, 80, 42], gold) : LOOKR ? mix(mix([40, 31, 28], [50, 36, 30], dawn), [62, 40, 30], gold) : mix(mix([30, 30, 38], [36, 32, 36], dawn), [44, 34, 30], gold);
    c.beginPath(); c.moveTo(x0, 2000);
    for (const [x, y] of outline(x0, x1, step)) c.lineTo(x, y);
    // (build 650, owner: "there's a dotted line along the hill border"): the land's own fill used to be the hill's
    // undarkened colour; everything darker was laid inside a clip, so the outline's soft edge pixels kept a speck of the
    // lighter colour, a dotted rust line along the hill's border. The fill now starts at the darkened colour.
    const hc0 = LF && HPAINT ? (m => hc.map((v, i) => v * m[i] / 255 * .75 + 17 * night))(landMul()) : hc;
    c.lineTo(x1, 2000); c.closePath(); c.fillStyle = css(hc0); c.fill();
    // a breath of form (owner: "shade hill a slight bit to get sense of its 3d"): the hill a touch lighter just under its
    // outline, darker toward its foot, and its rock in layers (rockTex)
    c.save(); c.clip();
    const lite = mix(hc, [150, 146, 160], .5), dark = mix(hc, [6, 5, 8], .6);
    let g = c.createLinearGradient(0, -H_TOP, 0, 40);
    g.addColorStop(0, css(lite, .1)); g.addColorStop(.3, css(lite, .03)); g.addColorStop(.6, css(dark, .05)); g.addColorStop(1, css(dark, .5));
    c.fillStyle = g; c.fillRect(x0, -H_TOP - 700, x1 - x0, H_TOP + 2740);
    // the beds of rock only when the painting is not there (their lines showed through it)
    const R = rockTex(); if (!HPAINT) c.drawImage(R.c, R.x, R.y, R.w, R.h);
    if (HPAINT) {
      const s = SK_H / 1080; c.save(); c.translate(SK_X, 0); c.scale(s, s); c.drawImage(HPAINT, HP_X - 4380, HP_TOP, HP_W, HP_H); c.restore();
      // the painting takes the hill's own colour through the dawn (its lightness kept); the crag of ?look=f keeps its own
      // painted colours and is only darkened before the sun is up
      if (LOOKF) { c.globalCompositeOperation = 'multiply'; c.fillStyle = css(landMul()); c.fillRect(x0, -H_TOP - 700, x1 - x0, H_TOP + 2800);
        // (build 645) moonlight on the land: a cool lift over the night's dark, so the ground and the hill can be seen
        if (night > .01) { c.globalCompositeOperation = 'lighter'; c.fillStyle = css([17, 21, 33], night); c.fillRect(x0, -H_TOP - 700, x1 - x0, H_TOP + 2800); c.globalCompositeOperation = 'multiply'; }
        // (build 627) 618's painting at sunrise held between its own colours and 625's one rust (owner: "too colorful ... the less
        // bright 625 is better though maybe a bit monochromatic"): darker (above) and pulled part way toward one rust hue
        // (build 650) its colour held back: nearly colourless until the sun is up (a dull umber laid over its own rust),
        // then a quieter rust than before
        if (LF && gold < 1) { c.globalCompositeOperation = 'color'; c.globalAlpha = .62 * (1 - gold); c.fillStyle = css(mix([74, 58, 54], [52, 52, 64], night)); c.fillRect(x0, -H_TOP - 700, x1 - x0, H_TOP + 2800); c.globalAlpha = 1; c.globalCompositeOperation = 'multiply'; }
        if (H618 && gold > 0) { c.globalCompositeOperation = 'color'; c.globalAlpha = Math.min(1, SUN_T * 1.5) * gold; c.fillStyle = SHADE ? 'rgb(112,80,84)' : 'rgb(126,76,56)'; c.fillRect(x0, -H_TOP - 700, x1 - x0, H_TOP + 2800); c.globalAlpha = 1; }
        // the face toward us in its own cool shade once the sun is up behind it; only the ledges' tops take the light
        if (SHADE && gold > .01) { c.globalCompositeOperation = 'multiply'; c.fillStyle = css(mix([255, 255, 255], [188, 176, 186], gold)); c.fillRect(x0, -H_TOP - 700, x1 - x0, H_TOP + 2800);
          const tp = hpTops(); if (tp) { const s2 = SK_H / 1080; c.save(); c.translate(SK_X, 0); c.scale(s2, s2); c.globalCompositeOperation = 'lighter'; c.globalAlpha = .34 * gold * sun;
            c.drawImage(TOPT || (TOPT = tintTops(tp)), HP_X - 4380, HP_TOP, HP_W, HP_H); c.restore(); } }
        c.globalCompositeOperation = 'source-over'; } else {
      c.globalCompositeOperation = 'color'; c.fillStyle = css(hc); c.fillRect(x0, -H_TOP - 700, x1 - x0, H_TOP + 2800); c.globalCompositeOperation = 'source-over'; }
      // THE HILL'S FOOT MELTS INTO THE GROUND (owner, build 649: "blend in the foot of mountain when christian first
      // encounters it and where it hits the ground on other side"): the painted rock used to stop at the ground's level
      // in a straight line, lighter above and darker below. Now the hill's lowest stretch goes over into the ground's
      // own tone, a little at 260 units up and wholly by the ground line, and the ground below is that same tone, so
      // there is no line at either foot.
      if (LF) { const fc = footCol(), fg = c.createLinearGradient(0, -260, 0, -4);
        fg.addColorStop(0, css(fc, 0)); fg.addColorStop(.45, css(fc, .22)); fg.addColorStop(.8, css(fc, .7)); fg.addColorStop(1, css(fc, 1)); c.fillStyle = fg; c.fillRect(x0, -260, x1 - x0, 3200); }
      // the foot sinks into the dark ground (owner: "blend edges and make everything super cohesive")
      if (false) {
        // the rock modelled: the painting's own light and shade, its tones spread to the full range once (hpRelief),
        // laid with 'soft-light' so the colour stays burnt orange while tops and faces read; strongest once the sun is up
        const rv = hpRelief(); if (rv) { c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = .45 + .45 * gold; c.translate(SK_X, 0); c.scale(s, s); c.drawImage(rv, HP_X - 4380, HP_TOP, HP_W, HP_H); c.restore(); }
        // and the side light: brighter on the sun's side (left), into shade toward the right
        const sl = c.createLinearGradient(CROSS_X - 1400, 0, CROSS_X + 900, 0);
        sl.addColorStop(0, css([255, 190, 120], .35 * gold)); sl.addColorStop(.55, 'rgba(255,190,120,0)'); sl.addColorStop(1, css([20, 12, 10], .4 * gold));
        c.globalCompositeOperation = 'soft-light'; c.fillStyle = sl; c.fillRect(x0, -H_TOP - 200, x1 - x0, H_TOP + 300); c.globalCompositeOperation = 'source-over';
      }
      if (false) {
        // the low sun from the left lights the hill's upper slopes and its top burnt orange, falling off down the hill
        const sg = c.createLinearGradient(0, -H_TOP - 40, 0, -H_TOP * .3);
        sg.addColorStop(0, css([255, 160, 80], .5 * gold)); sg.addColorStop(1, 'rgba(255,160,80,0)');
        c.globalCompositeOperation = 'soft-light'; c.fillStyle = sg; c.fillRect(x0, -H_TOP - 200, x1 - x0, H_TOP); c.globalCompositeOperation = 'source-over';
      }
      const fg = c.createLinearGradient(0, -260, 0, 8); fg.addColorStop(0, css(dark, 0)); fg.addColorStop(.6, css(dark, .22)); fg.addColorStop(1, css(dark, .5));
      c.fillStyle = fg; c.fillRect(x0, -260, x1 - x0, 2300);
      // ?look=f: a thin worn track along the edge where his feet go (owner: "put path next to edge so he can walk with sky
      // behind him"): a band of pale trodden earth just under his walking line, its width and strength wandering along it,
      // from the hill's foot to the crown, lit as the hill is lit. (build 631: taken out, owner: "the ground has some trace
      // light lines on it - maybe from the drawn path ... make the ground not draw attention")
      if (false && LOOKF) {
        const ta = Math.max(x0, SLOPE0 - 80), tb = Math.min(x1, CROSS_X - 60);
        if (tb > ta) {
          const wob = x => .5 + .3 * Math.sin(x * .013) + .2 * Math.sin(x * .041 + 1.7);
          const top = [], bot = [];
          for (let x = ta; x <= tb; x += 6) { const y = -gh(x); top.push([x, y + 3 + 2 * Math.sin(x * .03)]); bot.push([x, y + 9 + 9 * wob(x)]); }
          const tc = mix(mix([70, 62, 60], [120, 100, 84], dawn), [214, 176, 128], gold), tg = c.createLinearGradient(ta, 0, tb, 0);
          for (let i = 0; i <= 96; i++) { const x = ta + (tb - ta) * i / 96, e = Math.min(1, (x - SLOPE0 + 80) / 260, (CROSS_X - 60 - x) / 200) * (1 - smooth(4, 26, topH(x) - gh(x))); tg.addColorStop(i / 96, css(tc, Math.max(0, e) * (.16 + .2 * wob(x * 1.7)))); }
          c.beginPath(); c.moveTo(...top[0]); for (const p of top) c.lineTo(...p); for (let i = bot.length - 1; i >= 0; i--) c.lineTo(...bot[i]); c.closePath();
          c.fillStyle = tg; c.fill();
        }
      }
    }
    if (R.l && !HPAINT) { c.globalCompositeOperation = 'screen'; c.globalAlpha = .55 + .2 * dawn + .25 * gold; c.drawImage(R.l, R.x, R.y, R.w, R.h); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
    // the painted rock's grain over it all, as on Level 3's crags
    // the painted cliff texture from Level 3 is no longer laid on (owner, build 470: "there's lines on the hill now":
    // its upright cracks showed as stripes down the smooth hill)
    if (false && RTEX) {} if (RTEX && !HPAINT && ROCK_OPT === 'skull') {
      // the painted rock's grain, only on the skull, as on Level 3's crags
      c.save(); c.beginPath(); c.moveTo(SLOPE0, 60); for (let x = SLOPE0; x <= SK_X; x += 8) c.lineTo(x, -gh(x)); for (const [x, h] of SKO) c.lineTo(x, -h); c.lineTo(SK_END, 60); c.closePath(); c.clip();
      if (!RPAT) RPAT = c.createPattern(RTEX, 'repeat'); const ts = 2; RPAT.setTransform(new DOMMatrix([ts, 0, 0, ts, 300, -H_TOP - 200]));
      c.globalCompositeOperation = 'overlay'; c.globalAlpha = .08; c.fillStyle = RPAT; c.fillRect(SLOPE0, -H_TOP - 60, SK_END - SLOPE0, H_TOP + 120); c.restore(); }
    if (false) { if (!RPAT) RPAT = c.createPattern(RTEX, 'repeat'); const ts = 2.4; RPAT.setTransform(new DOMMatrix([ts, 0, 0, ts, 300, -H_TOP - 200]));
      c.globalCompositeOperation = "overlay"; c.globalAlpha = .14; c.fillStyle = RPAT; c.fillRect(x0, -H_TOP - 60, x1 - x0, H_TOP + 2100); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
    c.restore();
    // (the dotted line, its second cause: each thing laid inside the clip covers the outline's soft edge pixels only in
    // part, so a speck of the bright painted rock stayed there under the darkening. A hair-thin line in the darkened
    // colour along the outline covers those pixels.)
    // in the hill's own tone just under its edge at each hour (a darker line showed as a drawn outline)
    const edgeC = mix(mix(mix([40, 28, 30], [28, 28, 38], night), [33, 19, 17], dawn), [96, 58, 44], gold);
    if (LF && HPAINT) { c.save(); c.strokeStyle = css(edgeC); c.lineWidth = 1.15 / cam.z; c.lineJoin = 'round'; c.beginPath(); let f0 = true; for (const [x, y] of outline(x0, x1, step)) { f0 ? c.moveTo(x, y) : c.lineTo(x, y); f0 = false; } c.stroke(); c.restore(); }
    // a thin edge of light along the crown, toward the sun (after dawn)
    if (gold > .01) {
      // one stroke with its strength along a gradient (short overlapping strokes with round caps showed as beads)
      c.save(); c.lineCap = 'butt'; c.lineJoin = 'round';
      if (LOOKR) {
        // backlight: the sun behind the crown burns along its whole edge in orange, a soft glow under a bright core
        const ga = Math.max(x0, SLOPE0 + 600), gb = x1, pts = outline(ga, gb, step).filter(([x]) => x >= ga && x <= gb);
        const rim = (w, col, a) => { const g = c.createLinearGradient(CROSS_X - 2200, 0, CROSS_X + 1400, 0);
          for (let i = 0; i <= 14; i++) { const u = i / 14, wx = CROSS_X - 2200 + 3600 * u, k = Math.exp(-Math.pow((wx - CROSS_X) / 1100, 2)) * gold; g.addColorStop(u, css(col, a * k)); }
          c.strokeStyle = g; c.lineWidth = w / cam.z; c.beginPath(); for (const [x, y] of pts) c.lineTo(x, y + w * .35 / cam.z); c.stroke(); };
        const rk = LOOKF ? .45 : 1; rim(14, [255, 132, 60], .16 * rk); rim(6, [255, 160, 80], .38 * rk); rim(2.2, [255, 222, 170], .85 * rk);
      }
      c.lineWidth = 2.4 / cam.z;
      const ga = Math.max(x0, CROSS_X - 900), gb = Math.min(x1, CROSS_X + 900);
      if (gb > ga) { const g = c.createLinearGradient(CROSS_X - 900, 0, CROSS_X + 900, 0);
        for (let i = 0; i <= 12; i++) { const u = i / 12, k = Math.exp(-Math.pow((u - .5) * 1800 / 420, 2)) * gold; g.addColorStop(u, css([255, 214, 160], .7 * k)); }
        c.strokeStyle = g; c.beginPath(); for (const [x, y] of outline(ga, gb, step)) if (x >= ga && x <= gb) c.lineTo(x, y + .6 / cam.z); c.stroke(); }
      c.restore();
    }
  }
  // the wall of Salvation: a low coursed wall behind the way, ending where the land opens
  // the wall called Salvation in Level 1's own city-wall painting (owner, build 630: "wall doesn't look very good - level 1
  // night was much better - things are dark at night"): assets/wall.webp below its battlements (WALL_TOP rows, as index.html
  // cuts it), its top a worn coping that dips and rises with now and then a stone gone, the pieces laid end to end with
  // every other one mirrored, scaled so its stones sit right for a low wall. The book gives no height ({92}: "fenced on
  // either side with a wall"); men "come tumbling over" it later, so about chest-high to him. Dark at night, warm at sunrise.
  const WALL_H = 92, WALL_X0 = Math.min(-600, START - 900);
  let WALLC = null, WALLP = null;
  if (LF) loadImg('wall.webp').then(im => { if (im) { WALLP = im; WALLC = null; } }).catch(() => {});
  // (build 633, owner: "wall is getting better but i think it should be dark with a moonlit edge - think rocks piled on top
  // of each other"): a dry-stone wall in silhouette: rough rounded rocks of every size piled one on another, big ones low,
  // the wall nearly black, each rock read only by a thin cool rim of moonlight along its upper edge, strongest along the
  // top of the wall and fading toward its foot; at sunrise the same rocks warm
  function bakeWall(night) {
    const S = 2, L = WALL_END - WALL_X0, W = (L + 10) * S, H = (WALL_H + 30) * S, cv = mk(W, H), q = cv.getContext('2d'), r = rgen(633);
    q.scale(S, S); const G = WALL_H + 26;
    const body = night ? [13, 15, 20] : [70, 52, 42], rimC = night ? [150, 168, 196] : [246, 200, 150];
    const rock = (cx, cy, w, h) => { const n = 7 + Math.floor(r() * 4), P = [];
      for (let k = 0; k < n; k++) { const a = k / n * 6.2832 + r() * .45, rr = .66 + r() * .42; P.push([cx + Math.cos(a) * w / 2 * rr, cy + Math.sin(a) * h / 2 * rr * (Math.sin(a) > 0 ? .9 : 1)]); }
      return P; };
    const path = P => { q.beginPath(); const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; let s0 = m(P[P.length - 1], P[0]); q.moveTo(...s0);
      for (let k = 0; k < P.length; k++) { const e = m(P[k], P[(k + 1) % P.length]); q.quadraticCurveTo(P[k][0], P[k][1], e[0], e[1]); } q.closePath(); };
    // (build 645, owner: "the wall is too detailed and distracting ... the night sky and natural beauty should be the
    // focus"): no stones drawn. One plain quiet shape with a slightly uneven top, a soft breath of moonlight along its
    // top edge, a little darker toward its foot. ?wall=stones brings back the piled rocks.
    if (!/[?&]wall=stones\b/.test(location.search)) {
      const bodyP = night ? [27, 32, 47] : [78, 58, 46], rimP = night ? [124, 140, 170] : [246, 200, 150];
      // (its end is a rounded shoulder, not a square block)
      const topY = x => { const e = Math.max(0, Math.min(1, (L + 4 - x) / 34)), f = Math.pow(Math.sin(e * Math.PI / 2), .55); return G - (WALL_H - 2.2 * Math.sin(x * .021 + 1) - 1.4 * Math.sin(x * .057 + 2.3) - .7 * Math.sin(x * .13)) * f; };
      q.beginPath(); q.moveTo(-6, G + 4); for (let x = -6; x <= L + 12; x += 3) q.lineTo(x, topY(x)); q.lineTo(L + 12, G + 4); q.closePath();
      q.fillStyle = css(bodyP); q.fill(); q.save(); q.clip();
      // (build 647, owner: "the wall need a little texture"): a breath of its stones: rough uneven stones laid in
      // rough courses, big ones low, each only a shade lighter or darker than the wall, the joints between them a
      // shade darker; no rims, no lit edges, so it reads as stone close up and as one quiet shape at a glance
      q.fillStyle = css(bodyP.map(v => v - 3)); q.fillRect(-6, 0, L + 20, G + 6);
      for (let y = G + 2; y > G - WALL_H - 6;) { const hg = (G - y) / WALL_H, ch = (20 - 6 * hg) * (.85 + r() * .35);
        for (let x = -r() * 30; x < L + 14;) { const w = (42 - 12 * hg) * (.6 + r() * .9), h = ch * (.85 + r() * .35), v = (r() - .5) * 5;
          path(rock(x + w / 2, y - ch / 2 + (r() - .5) * 3, w * 1.04, h * 1.08)); q.fillStyle = css(bodyP.map(c => c + v)); q.fill(); x += w * .93; }
        y -= ch * .84; }
      const dg = q.createLinearGradient(0, G - WALL_H, 0, G); dg.addColorStop(0, 'rgba(0,0,0,0)'); dg.addColorStop(1, 'rgba(4,5,9,.42)'); q.fillStyle = dg; q.fillRect(-6, 0, L + 20, G + 6);
      for (let k = 0; k < 6; k++) { q.strokeStyle = css(rimP, .05); q.lineWidth = 1 + k * 1.6; q.beginPath(); for (let x = -6; x <= L + 12; x += 3) q.lineTo(x, topY(x)); q.stroke(); }
      q.restore();
      return { cv, S, G };
    }
    // piled from the ground up: each course's rocks sit in the hollows of the one below, smaller as it rises
    const rocks = []; let y = G;
    while (y > G - WALL_H + 4) { const hgt = (G - y) / WALL_H, ch = (19 - 7 * hgt) * (.8 + r() * .5);
      for (let x = -r() * 18; x < L + 10;) { const w = (38 - 14 * hgt) * (.55 + r() * .95), h = ch * (.75 + r() * .5);
        rocks.push([x + w / 2, y - h / 2 + (r() - .5) * 3, w, h, hgt]); x += w * (.82 + r() * .12); }
      y -= ch * .78; }
    // the top: a line of rounded cope rocks set close, irregular
    // (build 644, owner: "top of wall need [more] - what would be most realistic and natural?"): the traditional cope of a
    // dry-stone wall, "cock and hen": flat stones set upright on edge along the top, packed tight, a taller one every few,
    // each leaning a little the same way, so the crest is a ragged comb of stone, not a row of pebbles
    const tops = []; for (let x = -4, i = 0; x < L + 4; i++) { const tall = r() < .28, w = 5 + r() * 6, h = (tall ? 15 : 10) + r() * 5; tops.push([x + w / 2, G - WALL_H + 5 - h / 2, w, h, 1, .14 + (r() - .5) * .16]); x += w * .72; }
    const slab = (cx, cy, w, h, lean) => { const P = [], s1 = Math.sin(lean); for (const [u, v] of [[-.5, .5], [-.46, -.1], [-.5 + r() * .15, -.5], [.5 - r() * .2, -.5 + r() * .1], [.5, -.05], [.46, .5]]) P.push([cx + u * w - v * h * s1, cy + v * h]); return P; };
    const all = rocks.map(k => [...k, rock(k[0], k[1], k[2], k[3])]).concat(tops.map(k => [k[0], k[1], k[2], k[3], 1, slab(k[0], k[1], k[2], k[3], k[5])]));
    // the body: every rock filled dark (a breath of variation), drawn low to high so upper rocks sit on lower
    for (const [cx, cy, w, h, hg, P] of all) { path(P); const v = (r() - .5) * 6; q.fillStyle = css(body.map(c => Math.max(0, c + v))); q.fill(); }
    // the moonlit rims: the upper edge of each rock, a hair wide, brighter toward the top; the top line strongest
    for (const [cx, cy, w, h, hg, P] of all) {
      q.save(); path(P); q.clip();
      const top = hg >= 1, a = (top ? .15 : .04 + .14 * Math.pow(hg, 1.6)) * (night ? 1 : .8), g = q.createLinearGradient(0, cy - h / 2, 0, cy - h / 2 + (top ? 4 : 3));
      g.addColorStop(0, css(rimC, a)); g.addColorStop(1, css(rimC, 0)); q.fillStyle = g; q.fillRect(cx - w, cy - h, w * 2, h); q.restore();
    }
    return { cv, S, G };
  }
  function wall(c) {
    if (!WALLC) WALLC = [bakeWall(true), bakeWall(false)];
    const k = Math.max(gold, .35 * dawn);
    for (const [b, a] of [[WALLC[0], 1], [WALLC[1], k]]) { if (a < .01) continue; c.globalAlpha = a; c.drawImage(b.cv, WALL_X0, -b.G, b.cv.width / b.S, b.cv.height / b.S); }
    c.globalAlpha = 1;
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
  const tombSill = () => PCAVE ? 90 : 6;
  // the sepulchre: a cave in the hill's foot (owner: "more like a cave and more integrated into hill side and base (which
  // is darker color) (very subtle but beautiful)"): an uneven dark mouth with a soft deeper shadow round it, the rock's
  // brow over it catching a faint light, and the round stone half sunk beside it in the hill's own tone
  const MOUTH = (() => { const r = rgen(31), P = []; for (let i = 0; i <= 28; i++) { const u = i / 28, a = Math.PI * (1 - u);
    P.push([Math.cos(a) * (60 + (r() - .5) * 10) * (1 + .12 * Math.pow(1 - Math.sin(a), 2)) + 3 * Math.sin(u * 7), -Math.pow(Math.sin(a), .7) * (DOOR_H - 18 + (r() - .5) * 9) * (1 + .05 * Math.sin(u * 5 + 1))]); } return P; })();
  function tomb(c) {
    if (PCAVE && HPAINT) return;
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

  // FRIEDRICH'S CRAG (owner: "make the hill shaped more like his crag"), only with ?look=f: the cross stands on a broken
  // pinnacle of rock (CRAG_LIFT above the crown) with jagged towers stepping down to the right over the scarp, as in
  // Morning in the Riesengebirge; his walk up to the cross is unchanged (gh is not touched). Each tower is one rough
  // shape lit from the low sun on the left: its left faces warm and bright, its right faces in shade, a lit rim along
  // its tops, a few dark cracks; laid in the hill's own burnt orange so it grows out of the rock.
  const CRAG_LIFT = 78;
  // ONE broken mass, not separate towers (a row of separate towers read as standing stones): its height above the hill
  // is the highest of a few pinnacles (each a rough steep-sided peak) with a broken, stepped edge, fading out at both ends
  // into the hill. The cross stands on the first pinnacle.
  const CPK = [[0, CRAG_LIFT + 6, 150, 1.5], [-150, 20, 110, 1], [150, 58, 90, 1.3], [260, 40, 80, 1], [380, 64, 110, 1.4], [520, 34, 110, 1], [650, 44, 90, 1.2], [760, 18, 110, 1]];
  const CX0 = CROSS_X - 260, CX1 = CROSS_X + 860;
  let CRAGP = null;
  function cragShapes() {
    if (CRAGP) return CRAGP;
    const r = rgen(431), H = [];
    for (let x = CX0; x <= CX1; x += 4) {
      let h = 0;
      for (const [dx, ph, hw, p] of CPK) { const u = Math.abs(x - CROSS_X - dx) / hw; if (u < 1) h = Math.max(h, ph * (1 - Math.pow(u, p))); }
      // a small flat top under the cross's foot
      if (Math.abs(x - CROSS_X) < 22) h = Math.max(h, CRAG_LIFT);
      // a broken, stepped edge: flat ledges and sudden small drops
      // a rough, irregular edge: two slow wanders and a fine jag, stronger the higher the rock (no flat steps: they read
      // as a wall's battlements)
      const jg = 7 * Math.sin(x * .043 + 1.3) + 4 * Math.sin(x * .11 + .4) + 4 * (r() - .5);
      h = Math.max(0, h + jg * Math.min(1, h / 30) * smooth(24, 70, Math.abs(x - CROSS_X)));
      // gone at both ends, into the hill
      h *= smooth(CX0, CX0 + 120, x) * (1 - smooth(CX1 - 160, CX1, x));
      H.push([x, h]);
    }
    // a little smoothing so the steps are ledges, not saw teeth
    const S = H.map(([x], i) => [x, (H[Math.max(0, i - 1)][1] + 2 * H[i][1] + H[Math.min(H.length - 1, i + 1)][1]) / 4]);
    return (CRAGP = S);
  }
  function crag(c) {
    // the code-drawn crag only stands in until the painted crag has loaded
    if (!LOOKF || HPAINT) return;
    const S = cragShapes(), hc = mix(mix([46, 38, 34], [92, 58, 40], dawn), [146, 80, 42], gold);
    const lit = mix(hc, [255, 190, 124], .18 + .3 * gold), shade = mix(hc, [20, 12, 12], .5);
    c.save(); c.beginPath(); c.moveTo(S[0][0], -gh(S[0][0]) + 30);
    S.forEach(([x, h]) => c.lineTo(x, -(gh(x) + h)));
    for (let i = S.length - 1; i >= 0; i -= 4) c.lineTo(S[i][0], -gh(S[i][0]) + 30);
    c.closePath(); c.fillStyle = css(hc); c.fill(); c.clip();
    // each face lit by its slope: faces turned to the low sun on the left (rising to the right) warm and bright, faces
    // turned away in shade; strips four units wide, so the faces read as planes
    for (let i = 2; i < S.length - 2; i++) {
      const [x, h] = S[i], j0 = Math.max(0, i - 4), j1 = Math.min(S.length - 1, i + 4), sl = (S[j1][1] - S[j0][1]) / ((j1 - j0) * 4), top = gh(x) + h, k = sl > .12 ? 1 : sl < -.12 ? 0 : .5;
      const g = c.createLinearGradient(0, -top, 0, -gh(x) + 30);
      g.addColorStop(0, css(mix(shade, lit, k), .95)); g.addColorStop(.55, css(mix(shade, lit, k * .6), .7)); g.addColorStop(1, css(shade, .6));
      c.fillStyle = g; c.fillRect(x - 2, -top - 2, 4.6, top - gh(x) + 34);
    }
    c.restore();
    // the low sun along the edges that face it
    if (gold > .02) { c.save(); c.lineWidth = 2; c.lineCap = 'round';
      for (let i = 2; i < S.length - 2; i++) { const [x, h] = S[i], sl = (S[i + 2][1] - S[i - 2][1]) / 16; if (sl > .15 || (Math.abs(sl) < .1 && h > 20)) {
        c.strokeStyle = css([255, 218, 156], .6 * gold * Math.min(1, h / 30)); c.beginPath(); c.moveTo(x - 2, -(gh(x - 2) + S[i - 1][1])); c.lineTo(x + 2, -(gh(x + 2) + S[i + 1][1])); c.stroke(); } }
      c.restore(); }
  }
  function cross(c) {
    const x = CROSS_X, h = crossH() + (LOOKF && !HPAINT ? CRAG_LIFT : 0), col = LOOKF ? mix(mix([30, 21, 16], [36, 24, 17], dawn), [46, 29, 19], gold) : mix(mix([20, 20, 27], [22, 20, 24], dawn), [30, 22, 20], gold), H = CROSS_H, T = 14, bw = 186, by = CROSS_BY;
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
    // (build 638, owner: "the cross can be a very dark brown and maybe a slight (very very subtle wood texture)"): faint
    // grain along each beam, a hair lighter and darker than the wood, clipped to it
    if (LOOKF) { const gr = rgen(11); c.save(); c.beginPath(); UL.forEach(([px, py]) => c.lineTo(px, py)); for (let i = 40; i >= 0; i--) c.lineTo(UR[i][0], UR[i][1]); c.closePath();
      c.rect(-bw / 2, -by - T / 2 - 1.5, bw, T + 2); c.clip('nonzero'); c.lineWidth = .7;
      for (let i = 0; i < 9; i++) { const gx = -T / 2 + 1 + i * (T - 2) / 8 + (gr() - .5) * 1.2, li = i % 2 ? [70, 48, 33] : [14, 9, 7], ph = gr() * 6;
        c.strokeStyle = css(li, .16 + gr() * .1); c.beginPath(); for (let u = 0; u <= 1.001; u += .05) c.lineTo(gx + .5 * Math.sin(u * 9 + ph) + .3 * Math.sin(u * 23 + ph * 2), -H * u); c.stroke(); }
      for (let i = 0; i < 8; i++) { const gy = -by - T / 2 + 1.5 + i * (T - 3) / 7 + (gr() - .5), li = i % 2 ? [70, 48, 33] : [14, 9, 7], ph = gr() * 6;
        c.strokeStyle = css(li, .16 + gr() * .1); c.beginPath(); for (let u = 0; u <= 1.001; u += .04) c.lineTo(-bw / 2 + bw * u, gy + u + .45 * Math.sin(u * 11 + ph) + .25 * Math.sin(u * 29 + ph)); c.stroke(); }
      // a knot or two
      c.strokeStyle = css([12, 8, 6], .3); c.lineWidth = .6; for (const [kx, ky, kr] of [[1.5, -H * .62, 2.2], [-bw * .28, -by, 1.8]]) { c.beginPath(); c.ellipse(kx, ky, kr * (ky === -by ? 1.8 : .9), kr * (ky === -by ? .9 : 1.8), 0, 0, 6.2832); c.stroke(); }
      c.restore(); }
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
    if (robe > 0 && robe < 1) { const x = Ch.x, h = gh(x), g = c.createRadialGradient(x, -h - 55, 0, x, -h - 55, 95); g.addColorStop(0, css([255, 236, 200], .26 * Math.sin(Math.PI * robe))); g.addColorStop(1, 'rgba(255,230,190,0)'); c.fillStyle = g; c.fillRect(x - 120, -h - 200, 240, 220); }
    c.restore();
    // the sealed roll: a soft glowing light in the third one's hand, diffuse like the Shining Ones (owner: "How about the
    // scroll be glowing too and be diffuse until it's handed to Christian"); touched, it is carried to him, its glow
    // drawing in and its shape coming clear as it reaches his hands, then it goes into the tray
    if (rollShow > .01 && rollGone < 1) {
      const [x, H] = SH[2], hx = x - 6, hy = -gh(x) - H * .36 + Math.sin(t / 30) * 1.5;
      const u = rollFly ? smooth(0, 1, rollFly.t / ROLL_FLY) : 0, cxr = Ch.x + 24, cyr = -gh(Ch.x) - 62;
      const rx = lerp(hx, cxr, u), ry = lerp(hy, cyr, u) - Math.sin(Math.PI * u) * 26, a2 = rollShow * (1 - rollGone), sh = 0, df = 1 - .65 * u;
      c.save(); c.translate(rx, ry);
      c.globalCompositeOperation = 'screen';
      const br = 1 + .03 * Math.sin(t / 30);
      let g = c.createRadialGradient(0, 0, 0, 0, 0, 40 * br); g.addColorStop(0, css([255, 244, 214], a2 * (.6 * df + .12))); g.addColorStop(1, 'rgba(255,236,200,0)'); c.fillStyle = g; c.fillRect(-62, -62, 124, 124);
      if (df > .01) { c.save(); c.scale(2.3, 1); g = c.createRadialGradient(0, 0, 0, 0, 0, 16 * br); g.addColorStop(0, css([255, 252, 238], a2 * df)); g.addColorStop(.5, css([255, 240, 206], .5 * a2 * df)); g.addColorStop(1, 'rgba(255,236,200,0)'); c.fillStyle = g; c.fillRect(-17, -17, 34, 34); c.restore(); }
      if (df > .01) { c.globalCompositeOperation = 'source-over'; const pu = .7 + .06 * Math.sin(t / 30); g = c.createRadialGradient(0, 0, 0, 0, 0, 30); g.addColorStop(0, css([255, 200, 120], .95 * a2 * df * pu)); g.addColorStop(.45, css([255, 214, 150], .4 * a2 * df * pu)); g.addColorStop(1, 'rgba(255,214,140,0)'); c.save(); c.scale(1.7, 1); c.fillStyle = g; c.fillRect(-30, -30, 60, 60); c.restore(); c.globalCompositeOperation = 'screen'; g = c.createRadialGradient(0, 0, 0, 0, 0, 9); g.addColorStop(0, css([255, 255, 248], a2 * df)); g.addColorStop(1, 'rgba(255,250,230,0)'); c.save(); c.scale(2, 1); c.fillStyle = g; c.fillRect(-9, -9, 18, 18); c.restore(); }
      c.globalCompositeOperation = 'source-over';
      if (sh > .01) { c.globalAlpha = a2 * sh; c.scale(1.6, 1.6); c.fillStyle = 'rgb(236,222,190)'; c.fillRect(-9, -3.5, 18, 7); c.fillStyle = 'rgb(214,198,160)'; c.fillRect(-11, -4.5, 3, 9); c.fillRect(8, -4.5, 3, 9);
        c.fillStyle = 'rgb(150,24,26)'; c.beginPath(); c.arc(0, 4, 3, 0, 6.29); c.fill(); }
      c.restore();
      rollAt = [rx, ry];
    }
  }
  const rollPt = () => { const [x, H] = SH[2]; return [sx(x - 6), sy(gh(x) + H * .36)]; };
  const chrPt = () => [sx(Ch.x), sy(gh(Ch.x) + 80)];

  // ---------- the story ----------
  function reset0() {
    blest = 0; tumbleT = 0; sepT = -1; memT = -1; memS = []; memUntil = 0; memQ = 0; REL.forEach(m => { m.a = 0; m.said = false; m.cv = m.front = null; }); relGW = false; gwTop = false; FIGS.forEach(f => { f.a = 0; f.said = false; f.i = 0; }); CONST.forEach(k => { k.t = -1; k.said = false; k.f0 = null; k.nv = -1; }); night = NIGHT_ON ? 1 : 0; tearT = -1; looked = false; Object.assign(Ch, { x: START, anim: 12, sd: QUIET[0], cf: -1, hop: 0, hops: 0, lastV: 0, fade: 0, hv: 0, face: 1, tv: null, run: 0, ranim: 0, cc: 0, lp: null, wo: null, wa: 0, kn: null, kup: false });
    sunT = 0; sunGo = false; sunH = 0; sunYr = null; zoomP = 0;
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
    if (at === 'cross') { ph = 'walk'; Ch.x = STOP_X - 260; Ch.sd = null; wideK = wideTo = 0; said.open = said.ascend = said.cut = true; dawn = .6; memT = 2000; memS = MEMS.map(() => 0); REL.forEach(m => { m.said = true; }); relGW = true; gwTop = true; CONST.forEach(k => { k.said = true; k.t = 1000; k.f0 = 0; }); FIGS.forEach(f => { f.said = true; }); }
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
    if (!G.act) { constTouch(px, py); return; }
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
    // ?look=f: 3 in the morning at the walls, stars out; the night thins as he climbs (owner, build 625)
    night += ((NIGHT_ON && (ph === 'walk' || ph === 'look') ? 1 - sm(SLOPE0 + 300, CREST0 - 300, Ch.x) : 0) - night) * .02;
    figTick();
    if (robe >= .5) Ch.cc = (Ch.cc || 0) + 16 / 60;
    gold += (goldTo - gold) * .0032; robe = Math.min(1, robe + (robeTo > robe ? .01 : 0)); mark += (markTo - mark) * .03; shine += (shineTo - shine) * .012; gone += (goneTo - gone) * .012;
    // THE SUN BREAKS AS THE BURDEN FALLS AND KEEPS RISING (owner, build 600: "sun rise slower and keep rising - maybe
    // it breaks just as burden falls but gets higher and higher and the sunrise become more and more spectacular"):
    // `sunT` counts from the burden's coming off; `sun` is its brightness (full in about 25 s); `sunH` its height:
    // 0 under the crown, 1 behind where the beams cross (about 50 s on, as the hymn plays), then on up, slower and
    // slower, to a little under the picture's top by the level's end. The sky's glory (in `sky()`) grows with its height past the crossing.
    if (sunGo) { sunT++; sun = Math.min(1, sunT / 1500); const u = sunT / 3000; sunH = u < 1 ? u : 1 + .42 * (1 - Math.exp(-(u - 1) / 1.1)); }
    // (build 655, owner: "maybe start zooming after sun rise and just keep slow zooming until the rest"): the sun
    // rises over the whole hill in the wide shot; once it is up the camera comes in to him in ONE slow steady move
    // (about a minute, eased at both ends), never back and forth
    if (sunGo && sunT > ZOOM_AT) { zoomP = Math.min(1, zoomP + 1 / ZOOM_LEN); 
      // (build 658, owner: "when burden disappears that's when zoom should begin and can even faster at the beginning but
      // keep start slow pace after about zoomed halfway"): it sets off the moment the burden is gone, covers half the way
      // in about seven seconds, then keeps one slow steady pace the rest of the way
      const pA = .13; wideTo = zoomP < pA ? 1 - .5 * (1 - Math.pow(1 - zoomP / pA, 2)) : .5 * (1 - (zoomP - pA) / (1 - pA)); }
    // the sun never sinks on the screen: it keeps the highest place it has reached and drifts slowly up
    if (sunYr != null) sunYr = Math.max(VH * .1, sunYr - .02);
    wideK += (wideTo - wideK) * .02;
    if (!climb) topK += (topTo - topK) * .022;
    hymnTick();
    if (tearT >= 0) tearT++;
    if (ph === 'gone' || ph === 'shine') closeK += ((TEARZ && ph === 'gone' && tearT >= 0 && tearT < 420 ? 1 : 0) - closeK) * .025;
    // the memories' own clock runs on whatever the phase, so the last one fades even once he is at the cross
    memQ = busy() ? 0 : memQ + 1;
    // each memory is tied to a place on the hill (owner, build 466: "tie memories to locations so that they are
    // sufficiently spaced out and don't overlap with other narrator text"): it comes when he reaches its place, and
    // only after a second of quiet since the last voice; if a voice is still sounding it waits, and comes a little later
    if (memT >= 0 && memT < memLast() + 420) { memT++; const i = memS.length; if (i < MEMS.length && Ch.x >= MEM_X[i] && (i === 0 || memT - memS[i - 1] >= MEM_GAP) && memQ >= 60) { memS.push(memT); memVoice(MEMS[i]); } }
    relTick();
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
      if (!REL_ON && !NIGHT_ON && memT < 0 && Ch.x > SLOPE0 && said.open && !busy()) memT = 0;
      // after the last memory, about three seconds of quiet before the storyteller speaks (owner, build 452)
      const memDone = NIGHT_ON ? FIGS.every(f => f.said) && (gwTop || !HILLFIGS_OFF) && memQ >= 150 : REL_ON ? REL.every(m => m.said) && relGW && memQ >= 150 : memT >= memLast() + 300 && G.t >= memUntil + 180;
      if (!said.ascend && memDone && Ch.x > CREST0 - 900 && !busy()) { said.ascend = true; caption(ASCEND); sepT = 0; }
      // "and a little below, a sepulchre": the camera draws back and down to show it, then comes back up to him (owner,
      // build 452); he stands still while it looks
      // (build 654, owner: "there's a fair amount of zooming back and forth"): no look down at the sepulchre here; it is
      // seen once, when the burden tumbles into it (?seplook=1 brings the look back)
      if (sepT >= 0) { sepT++; if (SEPLOOK) { if (sepT === 150) wideTo = 1; if (sepT === 430) wideTo = 0; } }
      const sepLook = SEPLOOK && sepT >= 150 && (sepT < 430 || wideK > .08);
      closeK += (0 - closeK) * .03;
      if (topTo && topK > .9 && !busy() && G.t - (said.topT || 0) > 150) topTo = 0;
      // no cut any more (owner: "Since he's running you can probably not cut to top of hill"): he runs all the way up
      // to the cross, the book's "He ran thus till he came at a place somewhat ascending"
      // once he is up on the top near the cross he walks (owner, build 452: "once he's at the top with the cross he can walk")
      const onTop = Ch.x >= WALK_X;
      // (build 629) at the foot of the hill he stands and looks up while the three star pictures of the places he has left
      // come one after another and their lines are heard; then the child can run on
      const famHold = NIGHT_ON && !FIGS_OFF && !HILLFIGS_OFF && FIGS.some(f => f.seq && (!f.said || busy()) && f.a > .3 && Ch.x >= f.x - 420);
      const starHold = famHold || NIGHT_ON && Ch.x >= SLOPE0 - 80 && !CONST.every(k => k.said && (k.kind !== 'storm' || (k.f0 != null && k.t > k.f0 + 60)));
      if (want && !sepLook && !starHold && Ch.x < STOP_X - .5) {
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
        if (!goldTo) goldTo = .2;
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
      if (bur.st === 'gone') { ph = 'gone'; t = 0; quietG = qRun = 0; sunGo = true; if (KNC.ready) { Ch.kn = 0; Ch.knd = 1; Ch.kup = false; } }
    } else if (ph === 'gone') {
      if (Ch.kn != null) kneelTick(); else clipHold();
      // a silence; then the light comes up behind the cross, and the colour comes back from it outward
      // the silence is counted only once every voice is done, so the sun and the hymn never come over the words
      if (!busy()) { quietG++; qRun++; } else qRun = 0;
      if (quietG === 150 && goldTo < 1) { goldTo = 1; }
      if (quietG === 360 && !hymn) hymn = { t: 0, i: 0, b: 0 };
      // Christian speaks only after a breath of quiet once the burden is gone (owner, build 456)
      // (build 659, owner: "have him say his first line as he kneels, and then the narrator says stood as he stands"):
      // kneeling, he says "He hath given me rest ..."; once that is said and a breath has passed, the storyteller's
      // "He stood still to wonder ..." begins and he rises with it
      if (hymn && hymn.t >= 6 * BEATT && qRun >= 150 && (Ch.kn == null || Ch.kn >= 48) && !said.glad) { said.glad = G.t; caption(GLAD); }
      if (said.glad && !looked && G.t - said.glad > 150 && !busy() && qRun >= 80) { caption(LOOKED); looked = true; if (Ch.kn != null) Ch.kup = true; }
      if (looked && tearT < 0 && !G.capQ.length) tearT = 0;
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
    if (!m.q) { hiss(700, .7, .018, 1.1); note(m.last ? 55 : 50, .02, 2.2, 0, true); }
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

  // HIS WAY RELIVED ON THE SLOPE (owner, build 589: "instead of flashbacks in sky ... the entire scene can flashback to
  // him running in one of the other levels with a voiceover of thankfulness"; of the stills with the village standing on
  // the slope: "that dreamlike quality is cool"; "make slightly transparent but intense"). Three pictures of the game
  // itself (the street past his own door; the mire, Help and the oak; the burning hill), each a still taken from its
  // level, are laid ON the hill: every upright column of the picture is hung from the hill's own outline, so walls stay
  // upright and the ground climbs with the slope. Each is fixed to its stretch of the hill and shows while he is in it;
  // he runs through it. Baked once when he comes near (one canvas, freed after), drawn a little see-through with a
  // breathing light over it. In the mire the surface lies above the ground up to his waist and is drawn again in front
  // of him. ?skymem=1 brings back the old pictures in the sky. Ours, not the book's.
  const REL_ON = new URLSearchParams(location.search).get('skymem') !== '1' && !LF, REL_K = .625, REL_Z = 1.25, REL_A = .7, RIM = {};
  // img: the still (assets); R: its ground row; k: world units a picture pixel; x0: where its left edge lies on the hill;
  // on: he is in it from..to; up: it fades into the sky between these heights above the ground; lift: the mire's depth
  const REL = [
    { img: 'mem-village', R: 722, k: REL_K, x0: 1200, on: [1260, 2230], up: [250, 440], below: 60, glow: .1, dark: .45, ends: [520, 240] },
    { img: 'mem-slough', R: 776, k: REL_K * 1.3, x0: 1950, on: [2250, 3010], off: 2770, up: [350, 560], below: 80, glow: .07, dark: .5, fit: [[420, 70], [1000, 6]], lift: u => 74 * smooth(120, 420, u) * (1 - smooth(600, 820, u)) },
    { img: 'mem-hill-mono', R: 926, k: REL_K, x0: 2900, on: [3050, 3900], up: [400, 590], below: 60, glow: .2, dark: .8 },
  ];
  // what he hears in each is the voice he heard there (owner, build 595: "i wonder if other people's messages as we did
  // with the memories is better"): his wife at the door, Help, Evangelist's God-speed; and last, near the top, with no
  // picture, Good-will's promise, heard as it comes true. All existing recordings (MEMS), nothing new to record.
  REL.forEach((m, i) => { m.a = 0; m.said = false; m.voice = MEMS[[2, 3, 4][i]]; });
  const REL_GW_X = 4000; let relGW = false, gwTop = false;
  function relBake(m) {
    const im = RIM[m.img]; if (!im) return false;
    const k = m.k, Wu = im.width * k, Z = REL_Z, lift = m.lift || (() => 0);
    // TILTED, NOT SKEWED (owner, build 598: "tilting is fine no need to skew"): the whole picture is turned as one
    // piece to the slope it lies on (a straight line fitted to the hill, and the mire's depth, under his stretch of
    // it), about the middle of that stretch. Nothing in it is sheared; the fade into the hill follows the hill's own
    // line, so where the hill curves away from the straight picture it simply sits a little into the hillside.
    let sn = 0, su = 0, sh = 0, suu = 0, suh = 0;
    for (let u = m.on[0] - m.x0; u <= m.on[1] - m.x0; u += 10) { const h = gh(m.x0 + u) + lift(u); sn++; su += u; sh += h; suu += u * u; suh += u * h; }
    // (the mire names two places instead, `fit`: waist-deep where he wades, on the ground at Help's bank)
    const F = m.fit, sl = F ? (gh(m.x0 + F[1][0]) + F[1][1] - gh(m.x0 + F[0][0]) - F[0][1]) / (F[1][0] - F[0][0]) : (sn * suh - su * sh) / (sn * suu - su * su), up = (m.on[0] + m.on[1]) / 2 - m.x0, hp = F ? gh(m.x0 + F[0][0]) + F[0][1] + sl * (up - F[0][0]) : (sh - sl * su) / sn + sl * up, th = Math.atan(sl * (PIN_ON ? .55 : 1)), co = Math.cos(th), si = Math.sin(th);
    // a picture point (a across, b down from its ground row, world units) lands at
    const at = (a, b) => [up + (a - up) * co + b * si, -hp - (a - up) * si + b * co];
    let top = 1e9, bot = -1e9, left = 0, right = Wu;
    for (const [a, b] of [[0, -m.R * k], [Wu, -m.R * k], [0, (im.height - m.R) * k], [Wu, (im.height - m.R) * k]]) { const [x, y] = at(a, b); top = Math.min(top, y); bot = Math.max(bot, y); left = Math.min(left, x); right = Math.max(right, x); }
    // (the tilted picture reaches past its own width at its corners: the canvas takes all of it, so no upright cut shows)
    left = Math.floor(left) - 2; const n = Math.ceil((right - left + 2) * Z);
    for (let u = 0; u <= Wu; u += 8) { top = Math.min(top, -topH(m.x0 + u) - m.up[1]); bot = Math.max(bot, -topH(m.x0 + u) + m.below); }
    top = Math.floor(top) - 2; const Hu = Math.ceil(bot - top) + 2;
    const cv = mk(n, Math.ceil(Hu * Z)), q = cv.getContext('2d'), mask = mk(cv.width, cv.height), mq = mask.getContext('2d'), surf = [];
    const turn = c2 => { c2.translate((up - left) * Z, (-hp - top) * Z); c2.rotate(-th); c2.scale(Z, Z); c2.translate(-up, 0); };
    q.save(); turn(q); q.imageSmoothingEnabled = true; q.drawImage(im, 0, -m.R * k, Wu, im.height * k); q.restore();
    for (let i = 0; i < n; i += 4) {
      // it melts upward into the sky and downward into the hill, by the hill's own line
      // (owner, build 599: "where it hits mountain ... no fan edge but a clean smooth transition": it is whole down
      // to a little above the hill's line and gone just under it, so no strip of its ground fans out over the hill)
      const u = left + (i + .5) / Z, g = topH(m.x0 + u), yo = (-g - top) * Z, y0 = yo - m.up[1] * Z, y1 = yo + 12 * Z, span = y1 - y0;
      const gr = mq.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop((m.up[1] - m.up[0]) * Z / span, '#000'); gr.addColorStop((m.up[1] - (m.feet || 34)) * Z / span, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      mq.fillStyle = gr; mq.fillRect(i, y0, 4, span);
      const hs = hp + sl * (u - up) / 1;
      surf.push([i, (-hs - top) * Z, Math.max(0, hs - g) * Math.min(1, lift(u) / 40)]);
    }
    q.globalCompositeOperation = 'destination-in'; q.drawImage(mask, 0, 0);
    // and at both its ends and its top, by the picture's own edges (they are tilted too)
    const em = mk(cv.width, cv.height), eq = em.getContext('2d'); eq.save(); turn(eq);
    const eg = eq.createLinearGradient(0, 0, Wu, 0); eg.addColorStop(0, 'rgba(0,0,0,0)'); const EL = (m.ends || [240, 240]).map(v => PIN_ON ? Math.min(Wu * .42, v * 1.7) : v); eg.addColorStop(EL[0] * .35 / Wu, 'rgba(0,0,0,.22)'); eg.addColorStop(EL[0] * .7 / Wu, 'rgba(0,0,0,.7)'); eg.addColorStop(EL[0] / Wu, '#000'); eg.addColorStop(1 - EL[1] / Wu, '#000'); eg.addColorStop(1, 'rgba(0,0,0,0)');
    eq.fillStyle = eg; eq.fillRect(0, -m.R * k, Wu, im.height * k);
    eq.globalCompositeOperation = 'destination-in'; const TF = PIN_ON ? Math.max(150, (m.R * k) * .7) : 150, tg = eq.createLinearGradient(0, -m.R * k, 0, -m.R * k + TF); tg.addColorStop(0, 'rgba(0,0,0,0)'); if (PIN_ON) { tg.addColorStop(.35, 'rgba(0,0,0,.18)'); tg.addColorStop(.7, 'rgba(0,0,0,.65)'); } tg.addColorStop(1, '#000'); eq.fillStyle = tg; eq.fillRect(0, -m.R * k, Wu, im.height * k);
    if (PIN_ON) { const bb = (im.height - m.R) * k, bg = eq.createLinearGradient(0, Math.min(0, bb - 160), 0, bb); bg.addColorStop(0, '#000'); bg.addColorStop(1, 'rgba(0,0,0,0)'); eq.fillStyle = bg; eq.fillRect(0, -m.R * k, Wu, im.height * k); }
    eq.restore();
    q.drawImage(em, 0, 0); q.globalCompositeOperation = 'source-over';
    // ?look=f: the memory breathed into the morning mist (owner: "the memories are now framed a fair amount and might
    // need some more blending"): washed toward the mist's own pale blue-grey, so it reads as a vision in the air, not a
    // picture laid on it
    if (PIN_ON) { q.globalCompositeOperation = 'source-atop'; q.fillStyle = 'rgba(196,204,212,.38)'; q.fillRect(0, 0, cv.width, cv.height); q.globalCompositeOperation = 'source-over'; }
    m.cv = cv; m.top = top; m.left = left; m.Wu = cv.width / Z; m.Hu = cv.height / Z; m.front = null;
    if (m.lift) {
      // the mire in front of him: everything below its surface, where it has any depth
      const f = mk(cv.width, cv.height), fq = f.getContext('2d'), pts = surf.filter(p => p[2] > 2);
      if (pts.length > 2) { fq.beginPath(); fq.moveTo(pts[0][0], cv.height); pts.forEach(p => fq.lineTo(p[0], p[1])); fq.lineTo(pts[pts.length - 1][0], cv.height); fq.closePath(); fq.save(); fq.clip(); fq.drawImage(cv, 0, 0); fq.restore();
        // thinning away where the mire grows shallow, so it has no upright edge
        const tm = mk(cv.width, cv.height), tq = tm.getContext('2d'); surf.forEach(p => { tq.fillStyle = `rgba(0,0,0,${smooth(2, 45, p[2])})`; tq.fillRect(p[0], 0, 4, cv.height); });
        fq.globalCompositeOperation = 'destination-in'; fq.drawImage(tm, 0, 0); fq.globalCompositeOperation = 'source-over'; m.front = f; }
    }
    return true;
  }
  function relTick() {
    if (!REL_ON) return;
    // all three are made at the start, one a tick, while he stands between the walls (making one takes up to a fifth of a
    // second: on the slope that showed as a jolt as he ran)
    let made = false;
    REL.forEach(m => {
      if (!made && !m.cv && Ch.x < REL[0].on[0] - 300 && RIM[m.img]) { relBake(m); made = true; }
      // (`off`: the mire fades just as he reaches Help, owner, build 599)
      const inIt = ph === 'walk' && Ch.x >= m.on[0] && Ch.x < (m.off || m.on[1]) ? 1 : 0;
      m.a += (inIt - m.a) * (inIt ? .05 : m.off ? .07 : .04);
      // freed only once faded AND out of its stretch and its approach (it used to be freed every tick of the approach, where
      // it is made ahead of time, so it was made again and again: about 200 ms a tick, the stutter on the climb)
      const near = Ch.x < m.on[1];
      if (m.a < .004 && !inIt) { m.a = 0; if (!near) m.cv = m.front = null; }
      if ((inIt || Ch.x > m.on[0] - 260 && Ch.x < m.on[1] && ph === 'walk') && !m.cv && !made) { relBake(m); made = true; }
      // his thought, once he is well into it, and never over another voice
      if (inIt && !m.said && Ch.x >= m.on[0] + 110 && said.open && !busy() && memQ >= 40) { m.said = true; memVoice(m.voice); }
      // a memory he ran through before its words could be said keeps them unsaid no longer than its own stretch
      if (!m.said && Ch.x >= m.on[1]) m.said = true;
    });
    if (!relGW && ph === 'walk' && Ch.x >= REL_GW_X && REL.every(m => m.said) && said.open && !busy() && memQ >= 60) { relGW = true; memVoice(MEMS[5]); }
  }
  function relive(c, front) {
    if (!REL_ON) return;
    for (const m of REL) {
      const cv = front ? m.front : m.cv, a = m.a * (1 - wideK); if (!cv || a < .01) continue;
      c.save(); c.globalAlpha = REL_A * a * (PIN_ON ? .85 : 1); c.drawImage(cv, m.x0 + m.left, m.top, m.Wu, m.Hu);
      // intense: a breathing light over it, and a brightening as it comes
      if (!front) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = a * (m.glow * .7 * (.7 + .3 * Math.sin(G.t / 37)) + .16 * (1 - m.a)); c.drawImage(cv, m.x0 + m.left, m.top, m.Wu, m.Hu); }
      c.restore();
    }
  }

  // ---------- THE NIGHT, THE PLACES IN THE STARS, THE VOICES ON THE WAY (owner, build 625: "the first part of walk along
  // the straight part can be extended and should be in very early morning think 3am - you can still see stars in the sky.
  // Thinking it would be cool to put memories in the sky as constellations ... then when he starts up hill the memories
  // can just be shadowy figures with slight bit of mist around them ahead on him way down the path saying the lines -
  // remove the entire scene changes"; my advice, agreed: no lines between the stars, places in the sky, people on the
  // path). Only with ?look=f. Ours, not the book's (he leaves the Interpreter's house at night, so 3am fits).
  const NIGHT_ON = LF;
  // (build 645, owner: "the beginning of this levels is too dark - it's hard to see"): the same greyed blue, a clear step
  // lighter all the way down, the horizon the lightest thing
  const NIGHTC = [[13, 19, 37], [34, 47, 70], [108, 122, 138]];
  // the stars, plentiful and bright enough to be the picture at 3am (owner, build 629: "the starry sky should be more
  // prominent"): a scatter of many small ones, a few large, and a faint band of the Milky Way
  const STARS = (() => { const r = rgen(41), A = []; for (let i = 0; i < 380; i++) A.push({ x: r(), y: Math.pow(r(), 1.3) * .6, s: .4 + r() * r() * r() * 2.4, b: .3 + r() * .7, p: r() * 6.28, f: 30 + r() * 60 });
    // the Milky Way: dense faint dust along a slanting band
    for (let i = 0; i < 520; i++) { const u = r(), off = (r() + r() + r() - 1.5) * .07; A.push({ x: u, y: .05 + u * .32 + off, s: .3 + r() * .5, b: .12 + r() * .3, p: r() * 6.28, f: 40 + r() * 60, mw: 1 }); }
    return A; })();
  // three places he has left, drawn in the sky as scatterings of stars along their outlines (owner, build 629: "put the
  // mt and city of destrution and the tree form the slough in starry outlines (not perfect but scattering of stars as an
  // artistic homage to those locations) complete with lines from characters in those levels"), in the order he passed
  // them: the City of Destruction (its walls, roofs, towers and spires, one warm star for his own lit door), the great oak
  // over the Slough (traced from Level 2's own tree), the burning hill (traced from Level 3's own painting, a warm star at
  // its summit). Each brightens as he walks under it and its line is heard; after, it stays in the sky, fainter.
  const CITY = [[0, 1], [0, .66], [.05, .66], [.05, .4], [.09, .34], [.13, .4], [.13, .62], [.2, .62], [.24, .5], [.28, .62], [.31, .62], [.31, .44], [.33, .12], [.35, .44],
    [.35, .58], [.42, .58], [.46, .46], [.5, .58], [.55, .52], [.59, .38], [.63, .52], [.68, .6], [.7, .6], [.7, .3], [.74, .3], [.74, .6], [.8, .56], [.84, .44], [.88, .56],
    [.92, .56], [.92, .2], [.935, .06], [.95, .2], [.95, .6], [1, .64], [1, 1]];
  function polyStars(P, n, r) { const L = []; let tot = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(d); tot += d; }
    const out = []; for (let k = 0; k < n; k++) { let t = (k + .5 + (r() - .5) * .7) / n * tot, i = 0; while (i < L.length - 1 && t > L[i]) { t -= L[i]; i++; }
      const f = Math.min(1, t / L[i]), a = P[i], b = P[i + 1]; out.push([a[0] + (b[0] - a[0]) * f + (r() - .5) * .018, a[1] + (b[1] - a[1]) * f + (r() - .5) * .03]); }
    return out; }
  // the outline of a picture's alpha: its edge pixels, then spread out by keeping only points far enough apart
  function edgeStars(im, n, topOnly, r) {
    const W = 160, H = Math.round(160 * im.height / im.width), cv = mk(W, H), q = cv.getContext('2d'); q.drawImage(im, 0, 0, W, H);
    if (!topOnly) { const t = mk(W, H), tq = t.getContext('2d'); for (let k = 0; k < 3; k++) { tq.clearRect(0, 0, W, H); tq.filter = 'none'; for (const [dx, dy] of [[-2,0],[2,0],[0,-2],[0,2],[0,0]]) tq.drawImage(cv, dx, dy); q.clearRect(0, 0, W, H); q.drawImage(t, 0, 0); } }
    const d = q.getImageData(0, 0, W, H).data, A = (x, y) => x < 0 || y < 0 || x >= W || y >= H ? 0 : d[(y * W + x) * 4 + 3], E = [];
    if (topOnly) { for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (A(x, y) > 120) { E.push([x, y]); break; } }
    else for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (A(x, y) > 120 && (A(x - 1, y) <= 120 || A(x + 1, y) <= 120 || A(x, y - 1) <= 120 || A(x, y + 1) <= 120)) E.push([x, y]);
    const out = [], minD = Math.sqrt(W * H / n) * (topOnly ? .55 : .9);
    for (let k = 0; k < E.length * 3 && out.length < n; k++) { const p = E[Math.floor(r() * E.length)]; if (out.every(o => Math.hypot(o[0] - p[0], o[1] - p[1]) > minD)) out.push(p); }
    return out.map(([x, y]) => [x / W + (r() - .5) * .012, y / H + (r() - .5) * .02]);
  }
  // (build 630, owner: "the first set of stars should be rendition of arm/ hand reaching out (maybe his wive's reaching out
  // for him) - make it subtle (think classic constellation), the second constellation can be the beautiful tree overhanging
  // the slough - again subtle but clean , finally the last constellation can be lightning from the mountain in level
  // three"): each a classic constellation, a few stars at its points joined by the faintest lines, across the sky
  // (build 636, owner: "as he walks (before mountain) constellations appear and then a word from each - please don't draw
  // lines between stars - just use large and small stars in complentary manner to convey a shape. (first evagnelist pointing
  // out light ) then tree of slough with helps words , finally something reminiscient of mountain like maybe draw far off
  // lightning on horizon lighting up the sky"): two star pictures with no lines, then a far storm on the horizon
  const CONST = [
    { at: START + 150, cx: .52, cy: .3, w: .9, h: .54, kind: 'evan', voice: MEMS[0] },
    { at: START + 600, cx: .5, cy: .27, w: .6, h: .5, kind: 'oak', voice: MEMS[3] },
    { at: START + 1100, kind: 'storm', voice: { who: E, txt: 'What are you doing here, Christian? You are out of the way.' } },
  ];
  const CONST_HOLD = 420;
  CONST.forEach(k => { k.t = -1; k.said = false; k.P = null; k.f0 = null; k.nv = -1; });
  let HILLROCK = null; if (NIGHT_ON) loadImg('hill-rock.webp').then(im => { HILLROCK = im; }).catch(() => {});
  // the figures: points (x, y in the box, 0..1; a third number = a brighter star) and the lines between them
  // the figures, in stars only: points (x, y in the box, 0..1) and a size (0 a faint small star, 1 a middling one, 2 a great
  // one), the great and small set so the eye joins them into the shape (no lines)
  const SHAPES_C = {
    // Evangelist on the left, his staff in one hand, the other arm raised pointing far up to the right, at the one great
    // star there: the shining light
    evan: { V: [
      [.16, .14, 2], [.12, .27, 1], [.21, .26, 0],
      [.1, .4, 0], [.09, .54, 1], [.08, .68, 0], [.07, .82, 0], [.06, .96, 1],
      [.23, .4, 0], [.245, .55, 0], [.26, .7, 1], [.27, .84, 0], [.28, .97, 0], [.17, .98, 0],
      [.27, .22, 0], [.33, .18, 1], [.39, .145, 0], [.45, .11, 0], [.5, .085, 1],
      [.03, .2, 1], [.026, .4, 0], [.022, .6, 0], [.018, .8, 0], [.014, .99, 1],
      [.92, .05, 2] ] },
    // the great oak of the Slough: a short thick trunk, its limbs sweeping out, the long one nearly level over the water
    oak: { V: [
      [.44, 1, 1], [.45, .9, 0], [.45, .8, 1], [.46, .68, 0], [.46, .58, 2],
      [.38, .5, 0], [.3, .44, 1], [.22, .41, 0], [.14, .4, 1], [.08, .44, 0], [.04, .5, 1],
      [.4, .4, 0], [.34, .26, 1], [.3, .17, 0], [.26, .1, 1],
      [.5, .44, 0], [.52, .3, 1], [.53, .2, 0], [.54, .1, 1],
      [.56, .52, 0], [.64, .44, 1], [.72, .41, 0], [.8, .4, 1], [.88, .42, 0], [.98, .46, 2],
      [.7, .3, 0], [.8, .16, 1], [.88, .5, 0], [.9, .58, 0] ] },
  };
  function constPts(k) { return SHAPES_C[k.kind]; }
  // (build 642, owner: "I wonder if one could click on group of stars and it zoom in and the sky fills as zoom and then a
  // super nova like shape that fleshes out the image of a hand pointing"; "Touch and just evangelist first"): Evangelist's
  // star picture waits for a touch, a glint on its great star asking for it; touched, the sky draws in on it (EVZ: the
  // point c of the picture's box brought to t on the screen, z times larger), more stars come out, the great star bursts
  // like a nova, and out of its light his arm and pointing hand fill in, in starlight (his own pointing picture from
  // Level 1, EVA frame 79), and his "Do you see that shining light?" is heard; then it all fades and the sky draws back
  const EVZ = { c: [.6, .15], t: [.47, .3], z: 1.35 };
  const constFade = k => k.f0 == null ? 1 : 1 - smooth(k.f0, k.f0 + 110, k.t);
  const ease = u => u < .5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
  const STARS2 = (() => { const r = rgen(53), out = []; for (let i = 0; i < 260; i++) out.push({ x: r(), y: r() * .7, s: .5 + r() * .9, b: .25 + r() * .45, f: 30 + r() * 60, p: r() * 6.3 }); return out; })();
  // his arm in starlight: shoulder (120, 70) and fingertip (235, 20) in EVA's frame 79
  const EVARM = { f: 79, x0: 150, y0: 10, w: 90, h: 50, sh: [160, 47], tip: [235, 20], from: [.34, .175], to: [.66, .07] };
  // (build 644, owner: "you're sticking very close to arm/hand drawing in game - you can do something more generic and
  // fitting with stars"): the hand is no longer his painted arm: a simple pointing hand drawn as a constellation would be,
  // a faint cool nebula in its shape, small stars along its outline, brighter ones at the knuckle, the wrist and the
  // fingertip. Made once in its own frame: the wrist end at x 0, the fingertip at x 1 (units of its length).
  const HANDP = [[0, -.07], [.2, -.072], [.42, -.066], [.47, -.082], [.52, -.084], [.6, -.086], [.68, -.074], [.72, -.05],
    [.86, -.038], [.98, -.03], [1.01, -.016], [.99, -.002], [.86, -.006], [.77, -.002], [.75, .025], [.72, .052], [.66, .068],
    [.58, .066], [.52, .054], [.47, .062], [.42, .064], [.2, .066], [0, .066]];
  let EVG = null;
  function evGhost() {
    if (EVG) return EVG; const L = 560, M = 40, W = L + 2 * M, H = 160, cv = mk(W, H), q = cv.getContext('2d'), X = u => M + u * L, Y = v => H / 2 + v * L;
    q.beginPath(); HANDP.forEach(([u, v], i) => i ? q.lineTo(X(u), Y(v)) : q.moveTo(X(u), Y(v))); q.closePath();
    const g = q.createLinearGradient(X(0), 0, X(1), 0); g.addColorStop(0, 'rgba(170,186,236,0)'); g.addColorStop(.3, 'rgba(170,186,236,.7)'); g.addColorStop(1, 'rgba(206,216,250,1)');
    q.fillStyle = g; q.fill();
    // a nebula, not a picture: blurred well past its outline by halving and doubling back
    let cur = cv; for (const d of [2, 2, 2, 2]) { const t = mk(Math.ceil(cur.width / d), Math.ceil(cur.height / d)); t.getContext('2d').drawImage(cur, 0, 0, t.width, t.height); cur = t; }
    const glow = mk(W, H), qg = glow.getContext('2d'); let up = cur; while (up.width < W / 1.9) { const t = mk(up.width * 2, up.height * 2); t.getContext('2d').drawImage(up, 0, 0, t.width, t.height); up = t; } qg.drawImage(up, 0, 0, W, H);
    // stars along its outline, a few within; brighter at the fingertip, the knuckle and the wrist
    const r = rgen(11), pts = [], key = [[1.01, -.016, 2.6], [.68, -.074, 2], [.47, -.082, 1.6], [.72, .052, 1.4]];
    for (let i = 0; i < HANDP.length - 1; i++) { const [u0, v0] = HANDP[i], [u1, v1] = HANDP[i + 1], n = Math.max(1, Math.round(Math.hypot(u1 - u0, v1 - v0) * 34));
      for (let j = 0; j < n; j++) { if (r() < .35) continue; const t = (j + r()) / n, u = u0 + (u1 - u0) * t, v = v0 + (v1 - v0) * t; pts.push({ u, v: v + (r() - .5) * .006, s: .6 + r() * .9, p: r() * 6.3 }); } }
    for (let i = 0; i < 14; i++) { const u = .1 + r() * .82, v = (r() - .5) * .09 * (u > .72 ? .4 : 1); pts.push({ u, v, s: .4 + r() * .5, p: r() * 6.3 }); }
    for (const [u, v, s] of key) pts.push({ u, v, s, p: r() * 6.3, key: 1 });
    pts.forEach(q => { q.d = 1 - q.u; });
    return (EVG = { glow, pts, L, M, H });
  }
  function evNova(c, k, P, A0) {
    // waiting: a glint now and then on the great star, asking to be touched
    const [sx, sy] = P[P.length - 1];
    if (k.nv < 0) { if (k.t > 120 && k.f0 == null) { const u = (k.t - 120) % 170, g = u < 44 ? Math.sin(u / 44 * Math.PI) : 0;
        if (g > .01) { c.save(); c.translate(sx, sy); c.rotate(.3); for (const [w, l] of [[1.4, 26], [.8, 15]]) { c.fillStyle = css([246, 248, 255], .7 * g * A0); c.beginPath(); for (let i = 0; i < 4; i++) { c.rotate(Math.PI / 2); c.moveTo(0, -w); c.lineTo(l * g, 0); c.lineTo(0, w); } c.fill(); } c.restore(); } }
      return; }
    const n = k.nv;
    // the nova: a flash, a ring going out, four long spikes, then the light stays, larger and breathing
    const f = n - 100;
    if (f > 0) { const b = Math.exp(-Math.pow((f - 18) / 22, 2)), ring = f * 2.2, ra = Math.max(0, 1 - f / 150);
      const stay = smooth(10, 80, f), R = 18 + 60 * b + 26 * stay * (1 + .08 * Math.sin(G.t / 60));
      let g = c.createRadialGradient(sx, sy, 0, sx, sy, R); g.addColorStop(0, css([255, 255, 255], A0 * (.55 * b + .5 * stay))); g.addColorStop(.25, css([236, 238, 255], A0 * (.35 * b + .22 * stay))); g.addColorStop(1, 'rgba(220,226,255,0)');
      c.fillStyle = g; c.fillRect(sx - R, sy - R, R * 2, R * 2);
      if (ra > 0) { c.strokeStyle = css([214, 222, 255], .35 * ra * A0); c.lineWidth = 2 + 6 * ra; c.beginPath(); c.arc(sx, sy, ring, 0, 6.2832); c.stroke(); }
      const L = 30 + 120 * b + 30 * stay; c.save(); c.translate(sx, sy);
      for (let i = 0; i < 4; i++) { const sg = c.createLinearGradient(0, 0, L, 0); sg.addColorStop(0, css([255, 255, 255], A0 * (.7 * b + .3 * stay))); sg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = sg; c.beginPath(); c.moveTo(0, -1.4); c.lineTo(L, 0); c.lineTo(0, 1.4); c.fill(); c.rotate(Math.PI / 2); }
      c.restore();
      c.fillStyle = css([255, 255, 255], A0); c.beginPath(); c.arc(sx, sy, 2.6 + 2 * stay, 0, 6.2832); c.fill(); }
    // his arm and pointing hand, filling in out of the light from the fingertip back to the shoulder
    const E = evGhost(); if (!E || n < 130) return;
    const W = k.w * VW, Hh = k.h * VH, X0 = VW * k.cx, Y0 = VH * k.cy, at = (u, v) => [X0 + (u - .5) * W, Y0 + (v - .5) * Hh];
    const [ax, ay] = at(...EVARM.from), [bx, by2] = at(...EVARM.to), D = Math.hypot(bx - ax, by2 - ay), rv = smooth(130, 300, n);
    c.save(); c.translate(ax, ay); c.rotate(Math.atan2(by2 - ay, bx - ax));
    // the forearm's end melts into the sky
    c.globalAlpha = .26 * smooth(170, 330, n) * A0; c.drawImage(E.glow, -E.M * D / E.L, -E.H / 2 * D / E.L, (E.L + 2 * E.M) * D / E.L, E.H * D / E.L);
    c.globalAlpha = 1;
    for (const q of E.pts) { const a = smooth(q.d - .12, q.d + .02, rv * 1.12) * smooth(0, .22, q.u) * A0 * (.6 + .4 * Math.sin(G.t / 37 + q.p)); if (a < .01) continue;
      const x = q.u * D, y = q.v * D;
      if (q.key) { const R = q.s * 4.5, g = c.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, css([230, 236, 255], .3 * a)); g.addColorStop(1, 'rgba(230,236,255,0)'); c.fillStyle = g; c.fillRect(x - R, y - R, R * 2, R * 2); }
      c.fillStyle = css([244, 247, 255], .95 * a); c.beginPath(); c.arc(x, y, q.s * .9, 0, 6.2832); c.fill(); }
    c.restore();
  }
  // a touch on Evangelist's star picture (or anywhere near it in the sky) while it waits
  function constTouch(px, py) {
    const k = CONST[0]; if (!NIGHT_ON || k.kind !== 'evan' || k.t < 40 || k.nv >= 0 || k.f0 != null || k.said) return false;
    const W = k.w * VW, Hh = k.h * VH, X0 = VW * k.cx, Y0 = VH * k.cy;
    if (px < X0 - W * .55 || px > X0 + W * .55 || py > Y0 + Hh * .6) return false;
    k.nv = 0; clearHint('evstar'); note(74, .035, 3.2); note(79, .03, 3.2, .12); note(86, .025, 3.4, .26); return true;
  }

  // night clouds after Hasui's Full Moon at Magome and van der Neer's moonlit landscapes (owner, build 631: "here's a
  // couple other - any changes from these?"): long thin streaks low in the sky, each lit pale along its upper edge by the
  // hidden moon, and a few darker broken masses higher up; in front of the stars; baked once, drifting very slowly
  let NCL = null;
  function nightClouds(c) {
    const a0 = night * (1 - gold); if (a0 < .01) return;
    if (!NCL) { const r = rgen(77), W = 1600, H = 420, cv = mk(W, H), q = cv.getContext('2d');
      // dark broken masses up high (van der Neer), soft
      for (let i = 0; i < 14; i++) { const x = r() * W, y = 20 + r() * 110, w = 200 + r() * 300, h = 26 + r() * 34;
        const g = q.createRadialGradient(x, y, 0, x, y, w / 2); g.addColorStop(0, 'rgba(26,38,58,.5)'); g.addColorStop(.6, 'rgba(20,30,48,.3)'); g.addColorStop(1, 'rgba(20,30,48,0)'); q.save(); q.translate(x, y); q.scale(1, h / w * 2); q.translate(-x, -y); q.fillStyle = g; q.fillRect(x - w, y - w, w * 2, w * 2); q.restore(); }
      // thin streaks low down (Hasui): a body and a lit upper edge
      for (let i = 0; i < 9; i++) { const x = r() * W, y = 160 + r() * 80, w = 300 + r() * 420, t = 3 + r() * 5;
        q.save(); q.beginPath(); q.moveTo(x, y); for (let u = 0; u <= 1.001; u += .05) q.lineTo(x + u * w, y - Math.sin(u * Math.PI) * t * (1 + .4 * Math.sin(u * 9 + i))); for (let u = 1; u >= -.001; u -= .05) q.lineTo(x + u * w, y + Math.sin(u * Math.PI) * t * .5); q.closePath();
        const g = q.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, 'rgba(30,52,78,0)'); g.addColorStop(.3, 'rgba(34,56,82,.45)'); g.addColorStop(.7, 'rgba(34,56,82,.45)'); g.addColorStop(1, 'rgba(30,52,78,0)'); q.fillStyle = g; q.fill();
        q.strokeStyle = 'rgba(130,160,186,.16)'; q.lineWidth = 2.2; q.beginPath(); for (let u = .08; u <= .92; u += .04) { const X = x + u * w, Y = y - Math.sin(u * Math.PI) * t * (1 + .4 * Math.sin(u * 9 + i)) + .6; u < .09 ? q.moveTo(X, Y) : q.lineTo(X, Y); } q.stroke(); q.restore(); }
      NCL = cv; }
    const W = NCL.width, k = VW / 960, off = ((G.t * .04 + cam.cx * .006) % W + W) % W;
    c.save(); c.globalAlpha = a0; const y0 = by(HY - 330 * k); for (let x = -off * k; x < VW; x += W * k) c.drawImage(NCL, x, y0, W * k, NCL.height * k); c.restore();
  }
  const skyX = x0 => ((x0 * VW * 1.3 - cam.cx * .012) % (VW * 1.3) + VW * 1.3) % (VW * 1.3) - VW * .15;
  function stars(c) {
    const a0 = night * (1 - gold);
    if (a0 < .01) return;
    c.save();
    // the Milky Way's faint glow under its dust
    { c.save(); c.globalAlpha = .55 * a0; c.translate(VW * .5, VH * .2); c.rotate(Math.atan2(.32 * VH, VW * 1.3)); const gg = c.createLinearGradient(0, -VH * .07, 0, VH * .07);
      gg.addColorStop(0, 'rgba(120,130,170,0)'); gg.addColorStop(.5, 'rgba(120,130,170,.13)'); gg.addColorStop(1, 'rgba(120,130,170,0)'); c.fillStyle = gg; c.fillRect(-VW, -VH * .07, VW * 2, VH * .14); c.restore(); }
    // while a star picture shows, the other stars fall back so its shape stands out
    let ck = 0; for (const k of CONST) if (k.t >= 0 && k.kind !== 'storm') ck = Math.max(ck, smooth(0, 90, k.t) * (k.f0 == null ? 1 : 1 - smooth(k.f0, k.f0 + 110, k.t)));
    const fb = 1 - .6 * ck;
    // THE TOUCHED STAR PICTURE (build 642): the sky draws in on Evangelist's picture, more stars come out of the dark
    const ev = CONST[0], zk = ev.nv >= 0 ? ease(smooth(0, 130, ev.nv)) * constFade(ev) : 0;
    if (zk > .001) { const W = ev.w * VW, Hh = ev.h * VH, X0 = VW * ev.cx, Y0 = VH * ev.cy, Cx = X0 + (EVZ.c[0] - .5) * W, Cy = Y0 + (EVZ.c[1] - .5) * Hh, s1 = 1 + zk * (EVZ.z - 1);
      // (build 647, owner: "i don't like sky zooming when you click ... yes take out zoom"): the sky no longer draws
      // in or grows; the touch is answered only in light (the other stars fall back, more faint stars come out, the
      // great star bursts, the hand fills in)
      for (const s of STARS2) { const a = zk * a0 * s.b * (.7 + .3 * Math.sin(G.t / s.f + s.p)); c.fillStyle = `rgba(222,228,248,${a})`; c.fillRect(s.x * VW - s.s / 2, s.y * VH - s.s / 2, s.s, s.s); } }
    // THE STARS GO OUT ONE BY ONE AS HE CLIMBS (owner, build 646): each has its own moment in the fading night
    // (`s.o`: the small faint ones first, the great ones last) and goes out there over a breath, at its full
    // brightness until then, so the sky empties star by star instead of dimming all at once
    for (const s of STARS) { if (s.o == null) { const q = Math.min(1, s.s / 2.6) * .6 + (s.p / 6.2832) * .4; s.o = .9 - .78 * q; }
      const out = smooth(s.o - .035, s.o + .035, night); if (out < .01) continue;
      const x = skyX(s.x), y = s.y * VH, a = fb * (1 - gold) * out * s.b * (.75 + .25 * Math.sin(G.t / s.f + s.p)); c.fillStyle = `rgba(226,230,244,${a})`;
      if (s.s > 1.4) { c.beginPath(); c.arc(x, y, s.s * .6, 0, 6.2832); c.fill(); c.fillStyle = `rgba(200,210,240,${a * .18})`; c.beginPath(); c.arc(x, y, s.s * 2, 0, 6.2832); c.fill(); }
      else c.fillRect(x - s.s / 2, y - s.s / 2, s.s, s.s); }
    for (const k of CONST) {
      if (k.t < 0) continue; const SH = constPts(k); if (!SH) continue;
      const kk = smooth(0, 90, k.t) * (k.f0 == null ? 1 : 1 - smooth(k.f0, k.f0 + 110, k.t)); if (kk < .01) continue;
      const W = k.w * VW, Hh = k.h * VH, X0 = VW * k.cx, Y0 = VH * k.cy, P = SH.V.map(([u, v]) => [X0 + (u - .5) * W, Y0 + (v - .5) * Hh]);
      SH.V.forEach((v, j) => {
        const [x, y] = P[j], sz = v[2] || 0, tw = .8 + .2 * Math.sin(G.t / (40 + j % 9 * 7) + j), a = a0 * kk * smooth(j * 6, j * 6 + 40, k.t) * tw * [.72, .92, 1][sz], r = [1, 1.55, 2.3][sz], R = [4.5, 8, 16][sz];
        const g = c.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, css([226, 232, 250], [.18, .24, .32][sz] * a)); g.addColorStop(1, 'rgba(226,232,250,0)'); c.fillStyle = g; c.fillRect(x - R, y - R, R * 2, R * 2);
        c.fillStyle = css([236, 240, 255], a); c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
      });
      if (k === CONST[0]) evNova(c, k, P, a0 * kk);
    }
    c.restore();
    for (const k of CONST) if (k.kind === 'storm' && k.t >= 0) { storm(c, k, a0); storm2(c, k, a0); }
  }
  // the burning hill remembered: a far storm on the horizon, silent but for a far rumble, its flashes lighting the sky from
  // behind the far ridges (drawn before them), now and then a thin bolt down to the horizon
  let STORMR = null;
  function storm(c, k, a0) {
    const kk = smooth(0, 60, k.t) * (k.f0 == null ? 1 : 1 - smooth(k.f0, k.f0 + 110, k.t)); if (kk < .01) return;
    mkStorm(); }
  // (build 637, owner: "the lightning and storm can be even smaller on horizon but light up a little brighter - make sure
  // lightning is a real crackle not just a tiny strand"): each bolt a jagged channel made by midpoint displacement, with
  // forks that branch again, drawn as a white core in a violet glow; it flickers as a real strike does
  function crackle(r, x0, y0, len, dir, depth, out, w) {
    // a stepped leader: short straight steps mostly downward, each turned sharply, with forks that branch again
    const P = [[x0, y0]]; let x = x0, y = y0, a = dir;
    while (y - y0 < len && P.length < 120) { a = dir + (r() - .5) * 1.9; const st = .016 + r() * .03; x += Math.sin(a) * st; y += Math.max(.012, Math.cos(a) * st); P.push([x, y]);
      if (depth > 0 && P.length > 3 && r() < .12) crackle(r, x, y, (len - (y - y0)) * (.35 + r() * .4), dir + (r() < .5 ? -1 : 1) * (.5 + r() * .5), depth - 1, out, w * .55); }
    out.push({ P, w });
  }
  function mkStorm() { if (!STORMR) { const r = rgen(91); STORMR = []; let t = 30; for (let i = 0; i < 40; i++) {
      let bolt = null; if (i === 0 || r() < .55) { bolt = []; crackle(r, 0, 0, 1, (r() - .5) * .3, 2, bolt, 1); }
      STORMR.push({ t: Math.round(t), x: .24 + r() * .4, w: .7 + r() * .6, bolt, two: r() < .55 }); t += 55 + r() * 95; } } }
  let STORMC = null;
  const stormBox = () => { const B = bgS(), hy = by(HY); return { x: VW * .14, w: VW * .62, y: hy - 128 * B, h: 86 * B }; };
  function stormCloud() {
    if (STORMC) return STORMC;
    const W = 420, H = 120, r = rgen(207), mkc = col => { const cv = mk(W, H), q = cv.getContext('2d');
      // heaped soft lobes on a flat base, thicker in the middle, thinning to nothing at both ends
      for (let i = 0; i < 46; i++) { const u = r(), x = 40 + u * (W - 80), e = Math.sin(u * Math.PI), rad = 16 + r() * 26 * e + 8 * e, y = H - 22 - r() * 46 * e;
        const g = q.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, css(col, .34)); g.addColorStop(.6, css(col, .16)); g.addColorStop(1, css(col, 0));
        q.save(); q.translate(x, y); q.scale(1.9, 1); q.translate(-x, -y); q.fillStyle = g; q.fillRect(x - rad, y - rad, rad * 2, rad * 2); q.restore(); }
      // the flat base: everything below it fades away
      q.globalCompositeOperation = 'destination-in'; const fg = q.createLinearGradient(0, H - 34, 0, H - 8); fg.addColorStop(0, '#000'); fg.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = fg; q.fillRect(0, 0, W, H);
      return cv; };
    const r0 = rgen(207); const d = mkc([12, 15, 27]); STORMC = { d, l: null };
    // the lit copy uses the same lobes (the same seed)
    { const W2 = 420, H2 = 120, rr = rgen(207), cv = mk(W2, H2), q = cv.getContext('2d'); q.drawImage(d, 0, 0); q.globalCompositeOperation = 'source-in'; q.fillStyle = 'rgb(214,212,250)'; q.fillRect(0, 0, W2, H2); STORMC.l = cv; }
    return STORMC;
  }
  // the bolts themselves, drawn among the far ridges (called from farR after the two furthest): half their old size, each
  // comes down out of the cloud's base and strikes the land, so its foot lies over the far ridges and a nearer ridge
  // hides nothing of it but stands in front (owner, build 648: "overlap the striking lightning with a little overlap
  // of the land"; real: a strike lands on ground nearer than the furthest hills, and is seen against them)
  function stormBolts(c) {
    const k = CONST.find(q => q.kind === 'storm'); if (!k || k.t < 0 || !STORMR) return;
    const a0 = night * (1 - gold), kk = smooth(0, 60, k.t) * (k.f0 == null ? 1 : 1 - smooth(k.f0, k.f0 + 110, k.t)); if (kk * a0 < .01) return;
    const hy = by(HY), B = bgS();
    for (const f of STORMR) {
      const d = k.t - f.t; if (d < 0 || d > 15 || !f.bolt) continue;
      const on = d < 3 || (d >= 6 && d < 9) || (f.two && d >= 12 && d < 15); if (!on) continue;
      const A = kk * a0, x = VW * f.x, W = VW * .2 * f.w, Hh = 62 * B, X = x - W * .15, Y = hy - 96 * B;
      c.save(); c.lineJoin = c.lineCap = 'round';
      for (const [lw, al, col] of [[4, .2, [190, 186, 255]], [1.8, .45, [222, 218, 255]], [.9, 1, [255, 255, 255]]]) {
        for (const br of f.bolt) { const al2 = al * A * (br.w < 1 ? .75 : 1), sg = c.createLinearGradient(0, Y, 0, Y + .3 * Hh); sg.addColorStop(0, css(col, 0)); sg.addColorStop(1, css(col, al2)); c.strokeStyle = sg; c.lineWidth = lw * Math.max(.45, br.w) * Math.max(.7, B); c.beginPath();
          br.P.forEach(([u, v], i) => { const X1 = X + u * Hh, Y1 = Y + v * Hh; i ? c.lineTo(X1, Y1) : c.moveTo(X1, Y1); }); c.stroke(); } }
      // where it strikes: a small soft light on the land
      const main = f.bolt[f.bolt.length - 1].P, ft = main[main.length - 1], fx = X + ft[0] * Hh, fy = Y + ft[1] * Hh, g = c.createRadialGradient(fx, fy, 0, fx, fy, 16 * B);
      g.addColorStop(0, css([236, 232, 255], .5 * A)); g.addColorStop(1, 'rgba(200,200,255,0)'); c.fillStyle = g; c.fillRect(fx - 16 * B, fy - 16 * B, 32 * B, 32 * B);
      c.restore();
    }
  }
  function storm2(c, k, a0) {
    const kk = smooth(0, 60, k.t) * (k.f0 == null ? 1 : 1 - smooth(k.f0, k.f0 + 110, k.t)); if (kk < .01) return;
    const hy = by(HY), B = bgS();
    // (build 648, owner: "for the lighting to be realistic there needs to be faint storm cloud in the distance"): the
    // lightning has its cloud: one low faint storm bank far off over the ridges, a flat base and a soft heaped top, a
    // shade darker than the night, there while the storm is; each flash lights it from within
    const SC = stormCloud(), CL = stormBox(); c.globalAlpha = .62 * kk * a0; c.drawImage(SC.d, CL.x, CL.y, CL.w, CL.h); c.globalAlpha = 1;
    for (const f of STORMR) {
      const d = k.t - f.t; if (d < 0 || d > 40) continue;
      // a flash, a dark moment, often a second flash, then the glow dying
      const on = d < 3 || (d >= 6 && d < 9) || (f.two && d >= 12 && d < 15);
      const fl = (on ? 1 : .15) * (d < 15 ? 1 : 0) + (d >= 15 ? .4 * Math.exp(-(d - 15) / 7) : 0);
      const A = fl * kk * a0; if (A < .01) continue;
      // small and low on the horizon, but bright: the sky lit from behind the far ridges
      const x = VW * f.x, W = VW * .2 * f.w, gy = hy - 36 * B;
      c.save(); c.translate(x, gy); c.scale(1, .55);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, W); g.addColorStop(0, css([244, 240, 255], A)); g.addColorStop(.3, css([206, 202, 244], .58 * A)); g.addColorStop(1, 'rgba(160,164,214,0)');
      c.fillStyle = g; c.fillRect(-W, -W, W * 2, W * 2); c.restore();
      // its form lit from within by the flash
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, .3 * A); c.drawImage(SC.l, CL.x, CL.y, CL.w, CL.h); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    }
  }
  // the people he heard, standing a little ahead of him on the way up, dark, with a breath of mist round them: each speaks
  // the words he heard as he comes near, and thins into the mist before he reaches it (one voice at a time: busy())
  // the talk at home ({11}: "O my dear wife, said he, and you the children of my bowels ... this our city will be burned
  // with fire from heaven ... except some way of escape can be found"); his wife's questions are ours (build 639: the owner asked for her, not the son)
  const FAMLINES = [
    [W, 'Husband, why do you weep over that book?'],
    [C, 'Oh, my dear wife, and you my sweet babes, this city will be burned with fire from heaven.'],
    [W, 'Then what shall we do?'],
    [C, 'Some way of escape must be found. I will find it, for all of us.'],
  ];
  const FIGS = [
    // (build 638, owner: "as he climbs we could get a memory about a conversation he had with his child"; "need a couple lines
    // back and forth with kid"): his wife and children as in his own door, a few words back and forth; he stands to hear them
    { x: 2050, img: () => MIM.family, ax: 94, g: 254, H: 248, k: .92, flip: true, seq: FAMLINES.map(([who, txt], i) => ({ who, txt, q: i > 0 })) },
    { x: 2800, img: () => MIM['room4-caster'], ax: 34, g: 302, H: 302, k: 1, flip: false, voice: MEMS[3] },
    { x: 3550, img: () => EVS[0], ax: EVS_META.ax, g: EVS_META.ground, H: 300, k: 1, flip: true, voice: MEMS[4] },
    { x: 4350, img: () => MIM['goodwill-reach'], ax: 62, g: 299, H: 298, k: 1, flip: true, voice: MEMS[5] },
  ];
  FIGS.forEach(f => { f.a = 0; f.said = false; f.dk = null; f.i = 0; });
  function figTick() {
    // the one voice on the climb (build 646): Good-will's promise, heard near the top as the last stars go out, just
    // before it comes true; never over another voice
    if (NIGHT_ON && HILLFIGS_OFF && !gwTop && ph === 'walk' && Ch.x >= WALK_X - 380 && said.open && !busy() && memQ >= 60) { gwTop = true; memVoice(MEMS[5]); }
    if (!NIGHT_ON) return;
    CONST.forEach((k, i) => { const prev = CONST[i - 1]; if (k.t < 0 && Ch.x >= k.at && ph === 'walk' && night > .3 && (!prev || (prev.f0 != null && prev.t >= prev.f0))) k.t = 0; else if (k.t >= 0) k.t++;
      // it stays until its line has been heard, a breath more, then fades as the next comes
      if (k.nv >= 0) { k.nv++; if (k.nv === 100) { hiss(2400, 1.4, .02, 1.6); note(91, .03, 3.6); note(98, .018, 3.8, .1); } }
      if (k.said && k.f0 == null && k.t > (k.kind === 'storm' ? 480 : 240) && (k.nv < 0 || k.nv > 400) && G.t > memUntil + 40) k.f0 = k.t;
      // Evangelist's picture waits for a touch (a side message after a moment); the nova's light brings his words; if it is
      // never touched, his words come at last as before
      const waits = k === CONST[0] && k.kind === 'evan' && !FIGS_OFF && !k.said;
      if (waits && k.nv < 0 && k.t === 150) hint('evstar', 'Touch the stars.');
      if (waits && k.nv >= 150 && said.open && !busy() && memQ >= 20) { k.said = true; memVoice(k.voice); }
      // its line, once it has brightened, never over another voice; passed by if he is already far beyond it
      if (k.t > 40 && !k.said && FIGS_OFF) k.said = true;
      if (k.t > (waits ? 780 : 40) && !k.said && k.nv < 0 && said.open && !busy() && memQ >= 40 && !FIGS_OFF) { k.said = true; clearHint('evstar'); memVoice(k.voice); }
      if (!k.said && k.t < 0 && night <= .3) k.said = true;
      // the far storm's thunder, low and late (sound travels slower than light)
      if (k.kind === 'storm' && k.t >= 0 && audio()) { mkStorm(); const fade = k.f0 == null ? 1 : 1 - smooth(k.f0, k.f0 + 110, k.t);
        for (const f of STORMR) if (k.t === f.t + 50 && fade > .05) { hiss(55, .7, .05 * f.w * fade, 2.6); hiss(110, .9, .02 * f.w * fade, 1.6); } } });
    FIGS.forEach(f => {
      const tgt = ph === 'walk' ? sm(f.x - 920, f.x - 780, Ch.x) * (1 - sm(f.x - 270, f.x - 150, Ch.x)) : 0;
      f.a += (tgt - f.a) * .06;
      if (FIGS_OFF || HILLFIGS_OFF) { f.said = true; return; }
      if (f.seq) { if (!f.said && ph === 'walk' && f.a > .6 && said.open && !busy() && memQ >= (f.i ? 30 : 40)) { memVoice(f.seq[f.i]); if (++f.i >= f.seq.length) f.said = true; } return; }
      if (!f.said && ph === 'walk' && f.a > .6 && said.open && !busy() && memQ >= 40) { f.said = true; memVoice(f.voice); }
      // a figure he ran past before its words could be said keeps them unsaid no longer
      if (!f.said && Ch.x > f.x - 150) f.said = true;
    });
  }
  function figDark(f) {
    if (f.dk) return f.dk; const im = f.img(); if (!im) return null;
    const cv = mk(im.width, im.height), q = cv.getContext('2d'); q.drawImage(im, 0, 0);
    q.globalCompositeOperation = 'source-atop'; q.fillStyle = 'rgb(22,20,28)'; q.fillRect(0, 0, im.width, im.height);
    // the feet dissolve into the mist
    q.globalCompositeOperation = 'destination-out'; const gr = q.createLinearGradient(0, f.g - f.H * .2, 0, f.g); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.85)'); q.fillStyle = gr; q.fillRect(0, 0, im.width, im.height);
    return (f.dk = cv);
  }
  function figs(c) {
    if (!NIGHT_ON) return;
    for (const f of FIGS) {
      const a = f.a * (1 - wideK); if (a < .01) continue; const im = figDark(f); if (!im) continue;
      const K = CHR_K * 290 * f.k / f.H, h = gh(f.x), drift = (1 - f.a) * 18;
      // mist behind and beside, never in front
      const my = -h - f.H * K * .45, mg = c.createRadialGradient(f.x, my, 0, f.x, my, f.H * K * .9);
      mg.addColorStop(0, `rgba(176,184,200,${.26 * a})`); mg.addColorStop(.55, `rgba(160,168,188,${.1 * a})`); mg.addColorStop(1, 'rgba(160,168,188,0)');
      c.save(); c.translate(f.x, my); c.scale(.8, 1); c.translate(-f.x, -my); c.fillStyle = mg; c.fillRect(f.x - f.H, my - f.H, f.H * 2, f.H * 2); c.restore();
      c.save(); c.translate(f.x, -h + SINK - drift); c.scale(f.flip ? -K : K, K); c.globalAlpha = .78 * a; c.drawImage(im, -f.ax, -f.g); c.restore();
    }
  }

  // the painted rocks that rise above his smooth walking line stand in front of him: the hill drawn again (the same land(),
  // so the same shade and the same overlay), clipped to the band between its own outline and his line
  // (build 631) the hill as it stands before he is drawn, copied once a frame, so the rocks laid back over him are the very
  // same pixels (drawing the land a second time under a clip left a thin orange seam along the clip's edges)
  let SNAP = null;
  function snapLand(c) {
    if (!PIN_ON || !HPAINT) { SNAP = null; return; } const cv = c.canvas;
    if (!SNAP || SNAP.width !== cv.width || SNAP.height !== cv.height) SNAP = mk(cv.width, cv.height);
    const q = SNAP.getContext('2d'); q.clearRect(0, 0, cv.width, cv.height); q.drawImage(cv, 0, 0);
  }
  function rocksFront(c) {
    if (!PIN_ON || !HPAINT || /[?&]nofront\b/.test(location.search)) return;
    // (build 638) with the smoothed edge he walks on the edge itself, so no rock stands in front of him (and the falling
    // burden was hidden behind the band this drew)
    if (H618 && EDGE_OPT !== 'raw') return;
    const x0 = cam.cx - VW / 2 / cam.z - 40, x1 = cam.cx + VW / 2 / cam.z + 40, st = 4;
    const xa = Math.max(x0, pinW(PIN0)), xb = Math.min(x1, CROSS_X - 40); if (xb <= xa) return;
    c.save(); c.beginPath(); c.moveTo(xa, -gh(xa));
    // only where a rock stands up out of his line; there it covers his sunk feet too (down to SINK + 3 below the line)
    const up = x => H618 ? smooth(1, 10, topH(x) - gh(x)) : smooth(4, 12, topH(x) - gh(x));
    // (build 631) only where a rock really rises: a band of no width still drew a hairline seam all along his path (owner:
    // "the ground has some trace light lines on it")
    c.beginPath(); let run = null; const flush = () => { if (run && run.length > 1) { run.forEach(([x], i) => i ? c.lineTo(x, -gh(x) - (topH(x) - gh(x)) * up(x) - .5) : c.moveTo(x, -gh(x) - (topH(x) - gh(x)) * up(x) - .5));
      for (let i = run.length - 1; i >= 0; i--) { const x = run[i][0]; c.lineTo(x, -gh(x) + (SINK + 3) * up(x) - .5); } c.closePath(); } run = null; };
    for (let x = xa; x <= xb; x += st) { if (up(x) > .02) (run = run || []).push([x]); else flush(); } flush();
    c.clip(); if (SNAP) { c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(SNAP, 0, 0); } else land(c); c.restore();
  }
  function draw() {
    const c = ctx; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    sky(c); far(c); memories(c);
    c.setTransform(DPR * cam.z, 0, 0, DPR * cam.z, DPR * (VW / 2 - cam.cx * cam.z), DPR * cam.wl);
    wall(c); land(c); crag(c); tomb(c); crossShadow(c); cross(c); relive(c, false); if (!FIGS_OFF && !HILLFIGS_OFF) figs(c); snapLand(c);
    shining(c);
    drawBurden(c); drawChr(c); rocksFront(c); relive(c, true);
    // the nearest ground, a dark band along the foot of the picture, under the words
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    const g = c.createLinearGradient(0, FOOTY + 20, 0, VH); g.addColorStop(0, 'rgba(12,10,12,0)'); g.addColorStop(.5, css(mix([16, 15, 20], [26, 20, 18], gold), .7)); g.addColorStop(1, css(mix([12, 11, 16], [20, 15, 13], gold), .92)); c.fillStyle = g; c.fillRect(0, FOOTY + 20, VW, VH);
    kuindzhi(c);
    if (veil > .005) { c.fillStyle = css(mix([14, 14, 20], [24, 20, 26], dawn), veil); c.fillRect(0, 0, VW, VH); }
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2; for (const q0 of [0, .5]) { const q = (G.t / 80 + q0) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, 14 + q * 40, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    drawItems();
  }

  return { on: false, start, update, draw, touch, key, preload, lines: ALL, stop: () => padStop(), _pt: { roll: rollPt, chr: chrPt }, _turning: () => !!Ch.tv,
    _cst: CONST, _figs: () => FIGS, _busy: () => [busy(), memQ, said.open, ph], _storm: () => (mkStorm(), STORMR.map(f => f.t + (f.bolt ? "b" : ""))), _B: () => bgS(), peek: () => ({ ph, t, z: +cam.z.toFixed(3), cst: CONST.map(k => (k.said ? 'S' : '-') + k.t + (k.P ? 'p' : 'n')).join(' '), figs: FIGS.map(f => (f.said ? 'S' : '-') + f.a.toFixed(1)).join(' '), night: +night.toFixed(2), fly: rollFly ? rollFly.t : -1, x: Math.round(Ch.x), cf: +Ch.cf.toFixed(1), bur: bur ? { st: bur.st, x: Math.round(bur.x), a: +bur.a.toFixed(2), t: bur.t, H: Math.round(bur.H || 0), z: +(bur.z || 0).toFixed(1), r: +(bur.r || 0).toFixed(2), sq: +(bur.sq || 0).toFixed(2) } : null, gold: +gold.toFixed(2), shine: +shine.toFixed(2), leaps: leapsLeft, lp: Ch.lp == null ? -1 : +Ch.lp.toFixed(1), wo: Ch.wo == null ? -1 : Ch.wo, closeK: +closeK.toFixed(2), topK: +topK.toFixed(2), veil: +veil.toFixed(2), tear: tearT, sep: sepT, mem: memS.length, rel: REL.map(m => +m.a.toFixed(2)), kn: Ch.kn == null ? -1 : +Ch.kn.toFixed(1), hb: hymn ? +(hymn.t / BEATT).toFixed(1) : -1 }),
    // A SHORT WORDLESS CHOIR FOR THE SHINING ONES (awe study): from their coming until Christian's song begins (index.html's music player, cue 'choir')
    choir: () => CHOIR_ON && (ph === 'shine' || (ph === 'leaps' && !blest)),
    // the land's outline, for making pictures of the hill (tools)
    outlinePts: (a, b, st) => outline(a, b, st), SK: () => ({ SK_X, SK_END, SK_H, SLOPE0, CROSS_X, TOMB_X }) };
})();
