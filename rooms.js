// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: THE ROOMS (book {70} to {92}). Loaded by index.html after hill.js and run by the same
// engine (talk, caption, hint, voices). Everything of its own is inside RM.
//
// BUILD 257: ROOM 3 ONLY, Passion and Patience ({77} to {79}), as a first try of a painted room in play. Reached only by
// the preview link ?room=3 (open the book and it goes straight in); Level 4 itself (the gate, the narrow way, the other
// rooms, its contents line) is not built yet, and the other Level 4 chat may shape it: this file is meant to grow into it.
//
// The room is one still picture (after Chardin's Soap Bubbles, made by the image model and repainted toward the game's
// watercolour: concept/level4-room3-plate-watercolour.jpg, quietened in code: assets/room3.webp). The two boys are in
// the picture; Christian and the Interpreter (Good-will's picture stands in for him) are the game's watercolour figures
// coloured in the room's palette (assets/room3-christian.webp, room3-interpreter.webp), breathing in code. Passion in
// rags is a patch of the same picture (assets/room3-rags.webp) laid over the boy and his chair as the gold goes.
//
// How it goes: the storyteller names the boys; Christian asks; the Interpreter answers; one brings Passion a bag ->
// the child touches the bag: it tips, the gold pours at his feet and glints -> the gold rises away as soap bubbles (the
// homage to Chardin), one great bubble last, and Passion is left in rags -> the Interpreter tells what it means -> end.
// Departures: the child's touch on the bag is ours (in the book "one came to Passion, and brought him a bag"); Passion's
// rejoicing and his laughing Patience to scorn are not shown (the boys are painted, they cannot move); the bubbles are
// the painting's, not the book's ("he had lavished all away").
//
// Picture units: the painting's own pixels (P, 2566 x 1344) are laid at S units each, moved up OY so the floor where the
// boys sit is above the words; below the painting its last rows are stretched down as more dark floor.
// ============================================================
const RM = (() => {
  const I = 'The Interpreter';
  const S = .38, OX = 8, OY = 35, K = .8, PW = 2566, PH = 1344;
  const u = x => x * S - OX, v = y => y * S - OY;
  const pics = {};
  let loading = null;
  function preload() {
    if (!loading) loading = Promise.all(['room3', 'room3-rags', 'room3-christian', 'room3-interpreter'].map(n => loadImg(n + '.webp').then(im => { pics[n] = im; })));
    return loading;
  }
  // the people in the doorway: feet in painting pixels, and each sprite's own foot point and ground (sprite pixels)
  const MEN = [
    { n: 'room3-interpreter', who: I, x: 2320, y: 1236, ax: 90, g: 612, ph: 1.7 },
    { n: 'room3-christian', who: 'Christian', x: 2120, y: 1236, ax: 150, g: 624, ph: 0 }];
  const BAG = { x: u(1325), y: v(1240) }, HEAP = { x: u(1150), y: v(1246) };
  const RAGS = { x: u(720), y: v(580), w: 790 * S, h: 754 * S };

  const OPEN = [
    [N, 'In a little room sat two little children. The name of the eldest was Passion, and of the other, Patience.'],
    [C, 'Why is Passion so discontented?'],
    [I, 'He must wait for his best things till next year, but he will have all now. Patience is willing to wait.'],
    [N, 'Then one came to Passion, and brought him a bag of treasure.', null, () => { bag.show = true; }],
    [TIP, 'Touch the bag.', 'bag']];
  const AFTER = [
    [I, 'So are the men of this world: they must have all their good things now.'],
    [C, 'Then it is best to wait for things to come.'],
    [I, 'You say the truth. For the things which are seen are temporal; but the things which are not seen are eternal.']];

  let ph = 'wait', t = 0, bag, coins, bubbles, great, rags, motes;
  function reset0() {
    ph = 'wait'; t = 0; rags = 0; great = null;
    bag = { show: false, a: 0, tip: 0, empty: 0 };
    coins = []; bubbles = [];
    const r = rngR(31); motes = Array.from({ length: 18 }, () => ({ x: 40 + r() * 360, y: 60 + r() * 330, s: .5 + r() * 1.1, p: r() * 7, v: .04 + r() * .08 }));
  }
  function rngR(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  function start() {
    preload();
    RM.on = true; SL.on = SL.show = false; HL.on = HL.show = false;
    document.getElementById('title').style.display = 'none';
    document.getElementById('endc').className = 'card';
    document.body.classList.add('playing', 'slough'); G.opening = null; hush();
    Object.assign(G, { t: 0, capQ: [], cap: 0, hint: null, act: null, actT: 0, ring: null, auto: null, guard: 0, autoT: 0, taps: [], roll: { t: 999, x: 0, y: 0 }, ended: false, calm: 0 });
    downs.clear(); keys.r = keys.push = false;
    reset0();
    if (audio()) { AC.resume(); if (rainG) rainG.gain.setTargetAtTime(0, AC.currentTime, .8); }
    G.state = 'wait';
    preload().then(() => setTimeout(() => { if (RM.on && G.state === 'wait') { ph = 'talk'; talk(OPEN, () => { G.state = 'auto'; }); } }, 1200));
  }

  // the bag is touched: it tips over and the gold pours out at Passion's feet
  function pour() {
    if (G.act !== 'bag' || ph !== 'talk') return;
    ph = 'pour'; t = 0; G.ring = null; next(true); G.state = 'auto';
    if (audio()) note(79, .03, 1.6);
  }
  function touch(sx, sy) { if (G.act === 'bag' && Math.hypot(sx - BAG.x, sy - (BAG.y - 12)) < 150) pour(); }
  function key() { pour(); }

  function update() {
    G.t++; t++;
    for (const m of motes) { m.x += m.v; m.y += Math.sin(G.t / 90 + m.p) * .05; if (m.x > 420) m.x = 40; }
    if (bag.show) bag.a = Math.min(1, bag.a + .02);
    if (G.act === 'bag' && ++G.actT === 70) G.ring = () => [BAG.x, BAG.y - 12];
    if (ph === 'pour') {
      bag.tip = Math.min(1, bag.tip + .035);
      // the gold runs out of the bag's mouth for about a second and a half
      if (bag.tip > .6 && t < 120 && t % 2 === 0) for (let k = 0; k < 2; k++) {
        const r = Math.random;
        coins.push({ x: BAG.x - 14, y: BAG.y - 8, vx: -.6 - r() * 2.4, vy: -.6 - r() * 1.4, rest: HEAP.y - 6 + r() * 10, on: false, rot: r() * 6, sp: (r() - .5) * .5, gl: r() * 300, gone: 0, a: 1 });
      }
      for (const c of coins) if (!c.on) {
        c.vy += .22; c.x += c.vx; c.y += c.vy; c.rot += c.sp;
        if (c.y >= c.rest) { if (c.vy > 1.4) { c.vy *= -.28; c.vx *= .5; c.y = c.rest; if (audio() && Math.random() < .35) note(94 + Math.floor(Math.random() * 9), .012, .35, 0, false); } else { c.on = true; c.y = c.rest; } }
      }
      bag.empty = smooth(20, 130, t);
      if (t > 260) { ph = 'glad'; t = 0; }
    }
    // the gold lies and glints a while (he "took it up, and rejoiced therein")
    if (ph === 'glad' && t > 150) { ph = 'gone'; t = 0; bag.show = false; coins.forEach((c, i) => { c.at = 20 + i * 3 + Math.random() * 40; }); }
    // "he had lavished all away": each coin shimmers and rises as a soap bubble; the great one last; he is left in rags
    if (ph === 'gone') {
      for (const c of coins) if (!c.gone && t > c.at) {
        c.gone = 1; const r = Math.random;
        bubbles.push({ x: c.x, y: c.y - 3, r: 0, R: 2.5 + r() * 6, vx: (r() - .5) * .5, vy: -.35 - r() * .55, life: 0, L: 130 + r() * 170, ph: r() * 7, pop: 0 });
      }
      for (const c of coins) if (c.gone) c.a = Math.max(0, c.a - .05);
      if (t === 260) great = { x: HEAP.x + 20, y: HEAP.y - 10, r: 0, R: 26, life: 0, L: 470, pop: 0 };
      bag.a = Math.max(0, bag.a - (t > 150 ? .006 : 0));
      if (t > 240) rags = Math.min(1, rags + .006);
      if (great && great.pop > 0 && rags >= 1 && t > 780) { ph = 'after'; t = 0; talk(AFTER, () => { ph = 'end'; t = 0; G.state = 'auto'; }); }
    }
    for (const b of bubbles) { b.life++; b.r = Math.min(b.R, b.r + .25); b.x += b.vx + Math.sin(b.life / 30 + b.ph) * .25; b.y += b.vy; if (b.life > b.L && !b.pop) { b.pop = 1; if (audio() && Math.random() < .4) note(98 + Math.floor(Math.random() * 6), .006, .25, 0, false); } if (b.pop) b.pop++; }
    bubbles = bubbles.filter(b => b.pop < 14);
    if (great) { const g = great; g.life++; g.r = Math.min(g.R, g.r + .18); if (!g.pop) { g.y -= .55 * smooth(0, 60, g.life); g.x += Math.sin(g.life / 70) * .3; if (g.life > g.L) { g.pop = 1; if (audio()) note(91, .02, 1.4); } } else g.pop++; }
    if (ph === 'end' && t === 70) finish();
  }
  function finish() {
    G.state = 'end'; G.ended = false;
    const e = document.getElementById('endc');
    e.querySelector('h1').textContent = 'Passion and Patience';
    e.querySelectorAll('p')[0].textContent = 'The things which are seen are temporal; but the things which are not seen are eternal.';
    e.querySelectorAll('p')[1].textContent = 'A first room of the Interpreter’s House';
    document.getElementById('on2').style.display = 'none';
  }

  // ---------- drawing ----------
  function man(c, m) {
    const im = pics[m.n]; if (!im) return;
    const sc = S / K, fx = u(m.x), fy = v(m.y), mv = talkMove(m.who);
    const sy = (1 + .006 * Math.sin(G.t / 62 + m.ph)) * (mv ? mv.sy : 1);
    // a faint flat shadow on the boards, away from the window
    c.fillStyle = 'rgba(12,6,3,.28)'; c.beginPath(); c.ellipse(fx + 14, fy - 1, 40, 4.5, 0, 0, 6.2832); c.fill();
    c.save(); c.translate(fx, fy); if (mv) c.transform(1, 0, -mv.sh, 1, 0, 0); c.scale(1, sy);
    c.drawImage(im, -m.ax * sc, -m.g * sc, im.width * sc, im.height * sc); c.restore();
  }
  function drawBag(c) {
    if (bag.a <= .01) return;
    const k = smooth(0, 1, bag.tip), e = bag.empty;
    // a plump leather purse gathered at the neck by a cord; tipped over onto its side (it turns on its lower right) and
    // going slack as the gold runs out; lit from the window on the left
    c.save(); c.globalAlpha = bag.a; c.translate(BAG.x + 12, BAG.y); c.rotate(-1.35 * k); c.translate(-12, 0); c.scale(1 - .38 * e, 1 - .12 * e);
    c.fillStyle = 'rgba(12,6,3,.3)'; c.beginPath(); c.ellipse(2, 0, 16, 3, 0, 0, 6.2832); c.fill();
    const g = c.createLinearGradient(-15, 0, 15, 0); g.addColorStop(0, '#6e4b2e'); g.addColorStop(.5, '#4a301c'); g.addColorStop(1, '#24170c');
    c.fillStyle = g; c.beginPath(); c.moveTo(-5, -24); c.bezierCurveTo(-13, -21, -18, -12, -15, -4); c.quadraticCurveTo(-12, .5, 0, .5); c.quadraticCurveTo(12, .5, 15, -4); c.bezierCurveTo(18, -12, 13, -21, 5, -24); c.closePath(); c.fill();
    // folds where the neck is drawn in
    c.strokeStyle = 'rgba(20,10,4,.55)'; c.lineWidth = .8; for (const d of [-3, 0, 3]) { c.beginPath(); c.moveTo(d * .9, -23); c.quadraticCurveTo(d * 2.2, -17, d * 2.6, -11); c.stroke(); }
    // the ruffled mouth above the cord, the cord and its two ends
    c.fillStyle = '#5a3b22'; c.beginPath(); c.moveTo(-5, -24); c.lineTo(-7.5, -29); c.lineTo(-3, -27.5); c.lineTo(0, -30); c.lineTo(3, -27.5); c.lineTo(7.5, -29); c.lineTo(5, -24); c.closePath(); c.fill();
    c.strokeStyle = '#a88a58'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(-5.5, -24); c.quadraticCurveTo(0, -22.5, 5.5, -24); c.stroke();
    c.lineWidth = .8; c.beginPath(); c.moveTo(4, -23.5); c.quadraticCurveTo(9, -20, 8, -14); c.moveTo(4, -23.5); c.quadraticCurveTo(11, -22, 12, -17); c.stroke();
    c.restore(); c.globalAlpha = 1;
  }
  function drawCoins(c) {
    for (const o of coins) {
      if (o.a <= 0) continue;
      const flat = o.on ? 1 : Math.abs(Math.cos(o.rot)), w = 3.4, h = o.on ? 1.3 : 1 + 2.4 * (1 - flat);
      c.globalAlpha = o.a; c.fillStyle = '#7d5a26'; c.beginPath(); c.ellipse(o.x, o.y, w, h, o.on ? 0 : o.rot * .3, 0, 6.2832); c.fill();
      c.fillStyle = '#bf9a4e'; c.beginPath(); c.ellipse(o.x - .6, o.y - .3, w * .7, h * .6, o.on ? 0 : o.rot * .3, 0, 6.2832); c.fill();
      // a glint now and then, each coin in its own time (stronger while he rejoices; a shimmer as it goes)
      const tw = Math.sin(G.t / 9 + o.gl) * Math.sin(G.t / 23 + o.gl * 1.7), gl = Math.max(0, tw - .55) * (ph === 'glad' ? 2.2 : 1.2) + (o.gone ? (1 - o.a) * .8 : 0);
      if (gl > .02) { const r = 2 + 5 * gl, gg = c.createRadialGradient(o.x - 1, o.y - 1, 0, o.x - 1, o.y - 1, r); gg.addColorStop(0, 'rgba(255,246,214,' + (.9 * Math.min(1, gl)).toFixed(3) + ')'); gg.addColorStop(1, 'rgba(255,230,160,0)'); c.fillStyle = gg; c.fillRect(o.x - 1 - r, o.y - 1 - r, 2 * r, 2 * r); }
    }
    c.globalAlpha = 1;
  }
  // a soap bubble after Chardin: clear, a thin rim faintly coloured, a window caught on its upper left
  function bubble(c, x, y, r, pop) {
    if (r < .5) return;
    if (pop) { const q = pop / 14; c.strokeStyle = 'rgba(240,232,220,' + (.35 * (1 - q)).toFixed(3) + ')'; c.lineWidth = .6; c.beginPath(); c.arc(x, y, r * (1 + .5 * q), 0, 6.2832); c.stroke(); return; }
    const g = c.createRadialGradient(x, y, r * .55, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.8, 'rgba(236,226,210,.05)'); g.addColorStop(1, 'rgba(246,238,226,.32)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
    c.lineWidth = Math.max(.5, r * .05);
    c.strokeStyle = 'rgba(210,170,214,.22)'; c.beginPath(); c.arc(x, y, r * .97, 2.6, 4.2); c.stroke();
    c.strokeStyle = 'rgba(160,214,190,.18)'; c.beginPath(); c.arc(x, y, r * .97, 5.3, 6.9); c.stroke();
    c.fillStyle = 'rgba(255,250,238,.7)'; c.beginPath(); c.ellipse(x - r * .38, y - r * .42, r * .2, r * .12, -.7, 0, 6.2832); c.fill();
    c.fillStyle = 'rgba(255,248,230,.22)'; c.beginPath(); c.ellipse(x + r * .35, y + r * .4, r * .16, r * .08, -.7, 0, 6.2832); c.fill();
  }
  function draw() {
    const c = ctx; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.fillStyle = '#140c08'; c.fillRect(0, 0, VW, VH);
    const room = pics.room3;
    if (room) {
      const k = PW / room.width, bot = v(PH);
      c.drawImage(room, 0, 0, room.width, room.height, u(0), v(0), PW * S, PH * S);
      // more dark floor below the painting: its last rows stretched down and darkened
      c.drawImage(room, 0, room.height - 14, room.width, 14, u(0), bot - .5, PW * S, VH - bot + 1);
      const g = c.createLinearGradient(0, bot - 10, 0, VH); g.addColorStop(0, 'rgba(14,8,5,0)'); g.addColorStop(1, 'rgba(14,8,5,.55)'); c.fillStyle = g; c.fillRect(0, bot - 10, VW, VH - bot + 10);
      if (rags > 0 && pics['room3-rags']) { c.globalAlpha = smooth(0, 1, rags); c.drawImage(pics['room3-rags'], RAGS.x, RAGS.y, RAGS.w, RAGS.h); c.globalAlpha = 1; }
      void k;
    }
    // motes turning slowly in the window's light
    for (const m of motes) { const a = .12 * (.5 + .5 * Math.sin(G.t / 50 + m.p)) * (1 - smooth(260, 420, m.x)); c.fillStyle = 'rgba(255,236,200,' + a.toFixed(3) + ')'; c.beginPath(); c.arc(m.x, m.y, m.s, 0, 6.2832); c.fill(); }
    for (const m of MEN) man(c, m);
    drawBag(c); drawCoins(c);
    for (const b of bubbles) bubble(c, b.x, b.y, b.r, b.pop);
    if (great) bubble(c, great.x, great.y, great.r, great.pop);
    // the dark round the picture's edges
    { const g = c.createRadialGradient(VW * .45, VH * .5, VH * .45, VW * .45, VH * .5, VW * .75); g.addColorStop(0, 'rgba(14,8,5,0)'); g.addColorStop(1, 'rgba(14,8,5,.4)'); c.fillStyle = g; c.fillRect(0, 0, VW, VH); }
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2; for (const q0 of [0, .5]) { const q = (G.t / 80 + q0) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, 14 + q * 40, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    drawItems();
  }

  return { on: false, start, update, draw, touch, key, preload, lines: [...OPEN, ...AFTER], peek: () => ({ ph, t, coins: coins.length, bubbles: bubbles.length, rags: +rags.toFixed(2), great: great && { y: Math.round(great.y), pop: great.pop } }) };
})();
