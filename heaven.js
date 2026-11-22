// THE FAR LIGHT, ONE LIGHT FOR THE WHOLE GAME (object HV; vision chat, the awe study, item 3; owner: "yes 1-3 please").
// The light Evangelist points to in Level 1 ({17}: "Keep that light in your eye") and that every later level answers.
// One drawn thing with fixed rules (vision/8-awe-light.md, section 2), so it is the same light in the rain of Level 1
// and in the gold of the last level:
//  - a white core, a gold body and a COOL SILVER REACH: the silver is what tells it from fire, lamps and the day's sun;
//  - no disc and no edge: the core melts into the body, the body into the reach;
//  - it breathes slowly (about 8 s, size about 6% each way), never flickers or flashes;
//  - laid on normally (never 'lighter', which burns to flat white on a bright sky, build 403; 'screen' was tried and
//    washed out to nothing on Level 1's grey rain); `opt.dark` adds the core with 'lighter' for near-black skies;
//  - never a reward or a pickup, never on a false light (Vanity Fair, the Flatterer).
// Each level calls HV.draw(ctx, x, y, r, a) instead of its own glow; r is the gold body's radius in that level's units,
// a its strength 0..1. Baked once (three small sprites), stretched; nothing is made per frame.
window.HV = (() => {
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  // a soft round sprite: colour [r,g,b], alpha falling from a0 at the centre to 0 at the edge as (1 - d)^pow
  function sprite(rgb, pow, a0) {
    const S = 128, c = mk(S, S), g = c.getContext('2d'), gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    for (let i = 0; i <= 12; i++) { const d = i / 12; gr.addColorStop(d, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(a0 * Math.pow(1 - d, pow)).toFixed(4)})`); }
    g.fillStyle = gr; g.fillRect(0, 0, S, S); return c;
  }
  const CORE = sprite([255, 253, 245], 1.6, 1), BODY = sprite([255, 228, 172], 1.8, .78), REACH = sprite([206, 212, 232], 2.2, .42);
  // how big each part is against the gold body's radius r: core about .9 r, body 1.5 r, the reach 4.4 r wide and 2.8 r high
  const K = { core: .42, body: 1.5, rw: 4.4, rh: 2.8 };
  // one breath: about 8 s at 60 ticks a second
  const breath = t => 1 + .06 * Math.sin(t / 76);
  function draw(c, x, y, r, a, opt) {
    if (!(a > .005) || !(r > .2)) return;
    opt = opt || {};
    const p = opt.still ? 1 : breath(opt.t != null ? opt.t : (window.G ? G.t : 0)), R = r * p;
    const op = c.globalCompositeOperation, ga = c.globalAlpha;
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = Math.min(1, a); c.drawImage(REACH, x - R * K.rw, y - R * K.rh, 2 * R * K.rw, 2 * R * K.rh);
    c.globalAlpha = Math.min(1, a); c.drawImage(BODY, x - R * K.body, y - R * K.body, 2 * R * K.body, 2 * R * K.body);
    c.globalAlpha = Math.min(1, a * .95); c.drawImage(CORE, x - R * K.core * 2.2, y - R * K.core * 2.2, 4.4 * R * K.core, 4.4 * R * K.core);
    if (opt.dark) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = Math.min(1, a * .5); c.drawImage(CORE, x - R * K.core * 2, y - R * K.core * 2, 4 * R * K.core, 4 * R * K.core); }
    c.globalCompositeOperation = op; c.globalAlpha = ga;
  }
  // the light's strength level by level (vision/8-awe-light.md 2.3): it only grows; what changes is how much is hidden
  const LEVEL = { 1: .55, 2: .6, 3: .65, 4: .7, 5: .85 };
  return { draw, LEVEL, sprites: { CORE, BODY, REACH }, K };
})();
