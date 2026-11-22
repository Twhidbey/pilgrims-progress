// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: ROOM 3, PASSION AND PATIENCE (book {77} to {79}).
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/room3.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { HOUSE, I, PAINTED, S, bakeShell, glow, goTo, loads, near, pic, pics, ring, rnd, u, v, visitor } = H;
  // ROOM 3, A LITTLE ROOM (build 432; after Chardin's Soap Bubbles): calm umber plaster, a small deep-set window high on the left showing only
  // the night, a horn lantern on a bracket the one light; the two boys (cut from the old painting) in their chairs, Passion by the lantern.
  const R3 = { X: 640, LANT: [1180, 520], WIN: [560, 300, 720, 520] };
  function bakeR3() {
    return bakeShell({ seed: 33, doors: 'LR', wallC: '#2a1c13',
      lights: [{ x: R3.LANT[0], y: 620, r: 1500, lit: [128, 96, 68], half: [64, 46, 32], sx: 1.35 }],
      wall(c) {
        const [x0, y0, x1, y1] = R3.WIN; c.fillStyle = '#120b07'; c.fillRect(x0 - 26, y0 - 26, x1 - x0 + 52, y1 - y0 + 52);
        c.fillStyle = '#151a26'; c.fillRect(x0, y0, x1 - x0, y1 - y0); c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip(); c.strokeStyle = 'rgba(10,8,6,.7)'; c.lineWidth = 3; for (let d = -300; d < 300; d += 34) { c.beginPath(); c.moveTo(x0 + d, y0); c.lineTo(x0 + d + 220, y1); c.stroke(); c.beginPath(); c.moveTo(x1 - d, y0); c.lineTo(x1 - d - 220, y1); c.stroke(); } c.restore();
        c.fillStyle = '#120b07'; c.fillRect((x0 + x1) / 2 - 5, y0, 10, y1 - y0); c.fillStyle = 'rgba(120,90,60,.4)'; c.fillRect(x0 - 26, y1 + 22, x1 - x0 + 52, 4);
        // the lantern's bracket and the lantern itself (a dark frame round a warm horn pane)
        const [lx, ly] = R3.LANT; c.fillStyle = '#120b07'; c.fillRect(lx - 4, ly - 120, 8, 60); c.fillRect(lx - 60, ly - 124, 64, 10);
        c.fillRect(lx - 28, ly - 64, 56, 12); c.fillRect(lx - 24, ly + 40, 48, 12); c.fillStyle = '#d9a35a'; c.fillRect(lx - 20, ly - 52, 40, 92); c.fillStyle = 'rgba(40,24,10,.5)'; c.fillRect(lx - 2, ly - 52, 4, 92);
      } });
  }
  // ---------- Room 3's things ----------
  function drawBag(c, bag, dx = 0) {
    if (bag.a <= .01) return;
    const k = smooth(0, 1, bag.tip), e = bag.empty;
    c.save(); c.globalAlpha = bag.a; c.translate(u(1290 + dx) + 12, v(1230 + (dx ? 14 : 0))); c.rotate(-1.35 * k); c.translate(-12, 0); c.scale(1.6 * (1 - .38 * e), 1.6 * (1 - .12 * e));
    c.fillStyle = 'rgba(12,6,3,.3)'; c.beginPath(); c.ellipse(2, 0, 16, 3, 0, 0, 6.2832); c.fill();
    const g = c.createLinearGradient(-15, 0, 15, 0); g.addColorStop(0, '#6e4b2e'); g.addColorStop(.5, '#4a301c'); g.addColorStop(1, '#24170c');
    c.fillStyle = g; c.beginPath(); c.moveTo(-5, -24); c.bezierCurveTo(-13, -21, -18, -12, -15, -4); c.quadraticCurveTo(-12, .5, 0, .5); c.quadraticCurveTo(12, .5, 15, -4); c.bezierCurveTo(18, -12, 13, -21, 5, -24); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(20,10,4,.55)'; c.lineWidth = .8; for (const d of [-3, 0, 3]) { c.beginPath(); c.moveTo(d * .9, -23); c.quadraticCurveTo(d * 2.2, -17, d * 2.6, -11); c.stroke(); }
    c.fillStyle = '#5a3b22'; c.beginPath(); c.moveTo(-5, -24); c.lineTo(-7.5, -29); c.lineTo(-3, -27.5); c.lineTo(0, -30); c.lineTo(3, -27.5); c.lineTo(7.5, -29); c.lineTo(5, -24); c.closePath(); c.fill();
    c.strokeStyle = '#a88a58'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(-5.5, -24); c.quadraticCurveTo(0, -22.5, 5.5, -24); c.stroke();
    c.lineWidth = .8; c.beginPath(); c.moveTo(4, -23.5); c.quadraticCurveTo(9, -20, 8, -14); c.moveTo(4, -23.5); c.quadraticCurveTo(11, -22, 12, -17); c.stroke();
    c.restore(); c.globalAlpha = 1;
  }
  function drawCoins(c, coins) {
    for (const o of coins) {
      if (o.a <= 0) continue;
      const x = u(o.x), y = v(o.y), flat = o.on ? 1 : Math.abs(Math.cos(o.rot)), w = 3.4, h = o.on ? 1.3 : 1 + 2.4 * (1 - flat);
      c.globalAlpha = o.a; c.fillStyle = 'rgb(126,96,50)'; c.beginPath(); c.ellipse(x, y, w, h, o.on ? 0 : o.rot * .3, 0, 6.2832); c.fill();
      c.fillStyle = 'rgb(176,146,92)'; c.beginPath(); c.ellipse(x - .6, y - .3, w * .7, h * .6, o.on ? 0 : o.rot * .3, 0, 6.2832); c.fill();
      const tw = Math.sin(G.t / 9 + o.gl) * Math.sin(G.t / 23 + o.gl * 1.7), gl = Math.max(0, tw - .55) * (H.ph === 'glad' ? 2.2 : 1.2) + (o.gone ? (1 - o.a) * .8 : 0);
      if (gl > .02) { const r = 1.5 + 3 * gl, gg = c.createRadialGradient(x - 1, y - 1, 0, x - 1, y - 1, r); gg.addColorStop(0, 'rgba(255,246,214,' + (.9 * Math.min(1, gl)).toFixed(3) + ')'); gg.addColorStop(1, 'rgba(255,230,160,0)'); c.fillStyle = gg; c.fillRect(x - 1 - r, y - 1 - r, 2 * r, 2 * r); }
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
  if (!PAINTED) { const n = 'room3-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR3())); }
  return {
    // 3 A LITTLE ROOM, drawn on the house's shell (build 432): the boys cut from the old painting stand in their chairs on the drawn floor
    r3: PAINTED ? null : {
      pic: 'room3-drawn', shell: 1, FY: HOUSE.FY, tone: [190, 160, 130], k: 1, noShadow: 1,
      light(x) { return { x: R3.LANT[0], a: .3, col: [255, 200, 130] }; },
      enter() {
        this.bag = { show: false, a: 0, tip: 0, empty: 0 }; this.coins = []; this.bubbles = []; this.great = null; this.rags = 0; pic('room3-passion2'); pic('room3-patience2'); pic('room3-rags2');
      },
      run() {
        const self = this;
        talk([[N, 'In a little room sat two little children. The name of the eldest was Passion, and of the other, Patience.'], [C, 'Why is Passion so discontented?'], [I, 'He must wait for his best things till next year, but he will have all now. Patience is willing to wait.'], [N, 'Then one came to Passion, and brought him a bag of treasure.', null, () => { self.bag.show = true; }], [TIP, 'Touch the bag.', 'bag']], () => { H.ph = 'pour'; H.t = 0; G.state = 'auto'; if (audio()) note(79, .03, 1.6); });
      },
      act(sx, sy) { if (G.act === 'bag' && (sx == null || near(sx, sy, 1290 + R3.X, 1200, 160))) next(true); },
      upd() {
        const B = { x: 1290 + R3.X, y: 1244 }, HP = { x: 1120 + R3.X, y: 1248 }, bag = this.bag;
        if (bag.show) bag.a = Math.min(1, bag.a + .02);
        if (G.act === 'bag' && G.actT >= 70 && !G.ring) G.ring = ring(B.x, B.y - 30);
        if (H.ph === 'pour') {
          bag.tip = Math.min(1, bag.tip + .035);
          if (bag.tip > .6 && H.t < 120 && H.t % 2 === 0) for (let k = 0; k < 2; k++) this.coins.push({ x: B.x - 55, y: B.y - 30, vx: -1.6 - rnd() * 6.3, vy: -1.6 - rnd() * 3.7, rest: HP.y - 16 + rnd() * 26, on: false, rot: rnd() * 6, sp: (rnd() - .5) * .5, gl: rnd() * 300, gone: 0, a: 1 });
          for (const o of this.coins) if (!o.on) { o.vy += .58; o.x += o.vx; o.y += o.vy; o.rot += o.sp; if (o.y >= o.rest) { if (o.vy > 3.7) { o.vy *= -.28; o.vx *= .5; o.y = o.rest; if (rnd() < .35) note(94 + Math.floor(rnd() * 9), .012, .35, 0, false); } else { o.on = true; o.y = o.rest; } } }
          bag.empty = smooth(20, 130, H.t);
          if (H.t > 260) { H.ph = 'glad'; H.t = 0; }
        }
        if (H.ph === 'glad' && H.t > 70) { H.ph = 'gone'; H.t = 0; bag.show = false; this.coins.forEach((o, i) => { o.at = 20 + i * 3 + rnd() * 40; }); }
        if (H.ph === 'gone') {
          for (const o of this.coins) if (!o.gone && H.t > o.at) { o.gone = 1; if (this.coins.indexOf(o) % 2) continue; this.bubbles.push({ x: o.x, y: o.y - 8, r: 0, R: 10 + rnd() * 12, vx: (rnd() - .5) * 1.3, vy: -.9 - rnd() * 1.45, life: 0, L: 130 + rnd() * 170, ph: rnd() * 7, pop: 0 }); }
          for (const o of this.coins) if (o.gone) o.a = Math.max(0, o.a - .05);
          if (H.t === 260) this.great = { x: HP.x + 50, y: HP.y - 26, r: 0, R: 68, life: 0, L: 320, pop: 0 };
          bag.a = Math.max(0, bag.a - (H.t > 150 ? .006 : 0));
          if (H.t > 200) this.rags = Math.min(1, this.rags + .0075);
          if (this.great && this.great.pop > 0 && this.rags >= 1 && H.t > 560) { H.ph = 'after'; H.t = 0; talk([[I, 'So are the men of this world: they must have all their good things now.'], [C, 'Then it is best to wait for things to come.'], [I, 'You say the truth. For the things which are seen are temporal; but the things which are not seen are eternal.']], () => goTo('r4')); }
        }
        for (const b of this.bubbles) { b.life++; b.r = Math.min(b.R, b.r + .66); b.x += b.vx + Math.sin(b.life / 30 + b.ph) * .66; b.y += b.vy; if (b.life > b.L && !b.pop) { b.pop = 1; if (rnd() < .4) note(98 + Math.floor(rnd() * 6), .006, .25, 0, false); } if (b.pop) b.pop++; }
        this.bubbles = this.bubbles.filter(b => b.pop < 14);
        const g = this.great; if (g) { g.life++; g.r = Math.min(g.R, g.r + .47); if (!g.pop) { g.y -= 1.45 * smooth(0, 60, g.life); g.x += Math.sin(g.life / 70) * .8; if (g.life > g.L) { g.pop = 1; note(91, .02, 1.4); } } else g.pop++; }
      },
      under(c) {
        // the two boys in their chairs (their own figures, toned dark into the game's figure look, faces a plain wash); Passion in rags fades in over the fine boy
        const q = smooth(0, 1, this.rags), dr = (n, x, y, w, h, a) => { const im = pics[n]; if (im && a > .01) { c.globalAlpha = a; c.drawImage(im, u(x + R3.X), v(y + 8), w * S, h * S); c.globalAlpha = 1; } };
        dr('room3-patience2', 1736, 712, 273, 530, 1); dr('room3-passion2', 783, 690, 406, 552, 1 - q); dr('room3-rags2', 783, 716, 356, 526, q);
        // the horn lantern on its bracket, the room's one light
        const [lx, ly] = R3.LANT, f = 1 + .04 * Math.sin(G.t / 6) * Math.sin(G.t / 13); glow(c, u(lx), v(ly), 220 * S / .38 * .38, [255, 200, 130], .22 * f); glow(c, u(lx), v(ly), 26, [255, 226, 170], .6 * f);
      },
      people(c) { visitor(c, 'C', 480, 1); visitor(c, 'I', 760, 1); },
      over(c) { drawBag(c, this.bag, R3.X); drawCoins(c, this.coins); for (const b of this.bubbles) bubble(c, u(b.x), v(b.y), b.r * S, b.pop); if (this.great) bubble(c, u(this.great.x), v(this.great.y), this.great.r * S, this.great.pop); },
    },
    // 3, the old painted room (kept: ?painted shows it)
    // 3 PASSION AND PATIENCE (after Chardin's Soap Bubbles): the bag, the gold, the bubbles, the rags
    r3p: {
      pic: 'room3', ext: 'R', FY: 1235, PW: 2561, cam0: 13, tone: [255, 255, 255], k: 1.3,
      enter() {
        this.bag = { show: false, a: 0, tip: 0, empty: 0 }; this.coins = []; this.bubbles = []; this.great = null; this.rags = 0; pic('room3-rags');
      },
      run() {
        const self = this;
        talk([[N, 'In a little room sat two little children. The name of the eldest was Passion, and of the other, Patience.'], [C, 'Why is Passion so discontented?'], [I, 'He must wait for his best things till next year, but he will have all now. Patience is willing to wait.'], [N, 'Then one came to Passion, and brought him a bag of treasure.', null, () => { self.bag.show = true; }], [TIP, 'Touch the bag.', 'bag']], () => { H.ph = 'pour'; H.t = 0; G.state = 'auto'; if (audio()) note(79, .03, 1.6); });
      },
      act(sx, sy) { if (G.act === 'bag' && (sx == null || near(sx, sy, 1290, 1200, 160))) next(true); },
      upd() {
        const B = { x: 1290, y: 1230 }, HP = { x: 1120, y: 1234 }, bag = this.bag;
        if (bag.show) bag.a = Math.min(1, bag.a + .02);
        if (G.act === 'bag' && G.actT >= 70 && !G.ring) G.ring = ring(B.x, B.y - 30);
        if (H.ph === 'pour') {
          bag.tip = Math.min(1, bag.tip + .035);
          if (bag.tip > .6 && H.t < 120 && H.t % 2 === 0) for (let k = 0; k < 2; k++) this.coins.push({ x: B.x - 55, y: B.y - 30, vx: -1.6 - rnd() * 6.3, vy: -1.6 - rnd() * 3.7, rest: HP.y - 16 + rnd() * 26, on: false, rot: rnd() * 6, sp: (rnd() - .5) * .5, gl: rnd() * 300, gone: 0, a: 1 });
          for (const o of this.coins) if (!o.on) { o.vy += .58; o.x += o.vx; o.y += o.vy; o.rot += o.sp; if (o.y >= o.rest) { if (o.vy > 3.7) { o.vy *= -.28; o.vx *= .5; o.y = o.rest; if (rnd() < .35) note(94 + Math.floor(rnd() * 9), .012, .35, 0, false); } else { o.on = true; o.y = o.rest; } } }
          bag.empty = smooth(20, 130, H.t);
          if (H.t > 260) { H.ph = 'glad'; H.t = 0; }
        }
        if (H.ph === 'glad' && H.t > 70) { H.ph = 'gone'; H.t = 0; bag.show = false; this.coins.forEach((o, i) => { o.at = 20 + i * 3 + rnd() * 40; }); }
        if (H.ph === 'gone') {
          for (const o of this.coins) if (!o.gone && H.t > o.at) { o.gone = 1; if (this.coins.indexOf(o) % 2) continue; this.bubbles.push({ x: o.x, y: o.y - 8, r: 0, R: 10 + rnd() * 12, vx: (rnd() - .5) * 1.3, vy: -.9 - rnd() * 1.45, life: 0, L: 130 + rnd() * 170, ph: rnd() * 7, pop: 0 }); }
          for (const o of this.coins) if (o.gone) o.a = Math.max(0, o.a - .05);
          if (H.t === 260) this.great = { x: HP.x + 50, y: HP.y - 26, r: 0, R: 68, life: 0, L: 320, pop: 0 };
          bag.a = Math.max(0, bag.a - (H.t > 150 ? .006 : 0));
          if (H.t > 200) this.rags = Math.min(1, this.rags + .0075);
          if (this.great && this.great.pop > 0 && this.rags >= 1 && H.t > 560) { H.ph = 'after'; H.t = 0; talk([[I, 'So are the men of this world: they must have all their good things now.'], [C, 'Then it is best to wait for things to come.'], [I, 'You say the truth. For the things which are seen are temporal; but the things which are not seen are eternal.']], () => goTo('r4')); }
        }
        for (const b of this.bubbles) { b.life++; b.r = Math.min(b.R, b.r + .66); b.x += b.vx + Math.sin(b.life / 30 + b.ph) * .66; b.y += b.vy; if (b.life > b.L && !b.pop) { b.pop = 1; if (rnd() < .4) note(98 + Math.floor(rnd() * 6), .006, .25, 0, false); } if (b.pop) b.pop++; }
        this.bubbles = this.bubbles.filter(b => b.pop < 14);
        const g = this.great; if (g) { g.life++; g.r = Math.min(g.R, g.r + .47); if (!g.pop) { g.y -= 1.45 * smooth(0, 60, g.life); g.x += Math.sin(g.life / 70) * .8; if (g.life > g.L) { g.pop = 1; note(91, .02, 1.4); } } else g.pop++; }
      },
      under(c) { if (this.rags > 0 && pics['room3-rags']) { c.globalAlpha = smooth(0, 1, this.rags); c.drawImage(pics['room3-rags'], u(700), v(600), 570 * S, 720 * S); c.globalAlpha = 1; } },
      people(c) { visitor(c, 'I', 2420, -1, H.R.k, 1, 10); visitor(c, 'C', 2760, -1); },
      over(c) { drawBag(c, this.bag); drawCoins(c, this.coins); for (const b of this.bubbles) bubble(c, u(b.x), v(b.y), b.r * S, b.pop); if (this.great) bubble(c, u(this.great.x), v(this.great.y), this.great.r * S, this.great.pop); },
    },
  };
});
