// THE CRYING TAKE: 24 seconds that end as they begin, so it loops with no cut. Most of it is the tears and the wet streaks they
// leave: the sorrow comes on quickly, a tear starts at 1.5 s (the other eye at 3.2 s) and runs slowly, leaving the picture about 9 to 11 s;
// the streaks stay, glinting, while he shuts his eyes slowly once (14 to 16.5 s); they dry from 18 to 22 s and the sorrow eases.
const CRY_LEN = 24;
function crySm(a, b, v) { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); }
function cryFx(s) { const out = 1 - crySm(20, 23.6, s), dry = 1 - crySm(18, 22, s);
  return { sorrow: .75 * crySm(0, 1.4, s) * out, droop: .004, wet: crySm(.3, 1.8, s) * (1 - crySm(18.5, 23, s)), tears: [{ e: 'R', t: s - 1.5, at: .84, a: dry, speed: .62 }, { e: 'L', t: s - 3.2, at: .82, a: dry, speed: .58 }] }; }
// which frame of the shock clip: its open stretch, drifting a little wider and narrower; one slow closing and opening (to frame 171 and back)
function cryF(s) { const open = 137 + 7 * Math.sin(s * .62 + .4) + 3 * Math.sin(s * 1.7), shutK = crySm(14, 15.1, s) * (1 - crySm(15.5, 16.7, s)), rest = 142, k = crySm(0, 1.2, s) * (1 - crySm(21.5, 24, s));
  const f = rest + (open - rest) * k; return f + (171 - f) * shutK; }
