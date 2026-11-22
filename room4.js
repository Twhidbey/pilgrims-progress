// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: ROOM 4, THE FIRE FED WITH OIL (book {80} to {82}).
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/room4.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { D4, EX, HOUSE, I, PH, S, bakeShell, fig, glow, goTo, hold, loads, noise, pic, pics, ring, rnd, u, v, visitor, VIS, WALK_FPT, walkFig, walkSpeed, sheetFrames } = H;
  const R4D = { caster: { ax: 35, g: 302, s: 2.1, ct: 1.3, mul: .42, sat: .5 }, pourer: { ax: 62, g: 299, s: 2.1, ct: 1.3, mul: .42, sat: .5 }, FIRE: 1960, PART0: 1740, PART1: 1880, FP0: 1790, FP1: 2160, FPH: 520 };
  function bakeR4() {
    // on the house's shell (build 425): the fire low on the floor at FIRE is the one light; the chimney breast between PART0 and PART1 is
    // the wall they go round (the end walls' own near-black, its face toward the fire warmed); behind it the small hidden fire's own low light
    const F = R4D.FIRE, P0 = R4D.PART0, P1 = R4D.PART1, FY = HOUSE.FY;
    return bakeShell({ seed: 44, doors: 'LR', lights: [{ x: 1500, y: 1120, r: 1500, lit: [184, 98, 42], half: [90, 40, 20], sx: 1.2 }, { x: P1 + 200, y: 1150, r: 700, lit: [150, 84, 40], half: [70, 34, 18], sx: 1.1, a: .8 }],
      near(c) {
        // the chimney breast, floor to ceiling, with ONE fireplace right through it (build 522): the fire burns in it, the man
        // with the bucket casts water in at the front, and from behind the wall the other pours oil in at the back
        c.fillStyle = '#0c0705'; c.fillRect(P0, EX.y0, P1 - P0, FY + 6 - EX.y0);
        let g = c.createLinearGradient(P0, 0, P0 + 46, 0); g.addColorStop(0, 'rgba(236,140,64,.5)'); g.addColorStop(.3, 'rgba(160,80,36,.22)'); g.addColorStop(1, 'rgba(160,80,36,0)');
        c.save(); c.beginPath(); c.rect(P0, 420, 46, FY - 420); c.clip(); c.fillStyle = g; c.fillRect(P0, 420, 46, FY - 420); c.restore();
        g = c.createLinearGradient(0, 380, 0, 900); g.addColorStop(0, 'rgba(12,7,5,1)'); g.addColorStop(1, 'rgba(12,7,5,0)'); c.fillStyle = g; c.fillRect(P0, 380, 50, 520);
      } });
  }
  // a soft flame: stacked teardrops (kept for the painted room, ?painted)
  function flame(c, x, y, h, w, ph, a = 1) {
    for (const [k, col, al] of [[1, [235, 110, 40], .32], [.78, [250, 160, 60], .45], [.52, [255, 210, 120], .6], [.3, [255, 240, 200], .7]]) {
      const hh = h * k * (1 + .12 * Math.sin(G.t / 5.3 + ph) + .08 * Math.sin(G.t / 2.3 + ph * 2)), ww = w * k, sway = 10 * k * Math.sin(G.t / 7 + ph);
      const g = c.createRadialGradient(u(x), v(y - hh * .25), 0, u(x), v(y - hh * .25), Math.max(ww, hh) * S * .7);
      g.addColorStop(0, css(col, al * a)); g.addColorStop(1, css(col, 0));
      c.fillStyle = g; c.beginPath(); c.moveTo(u(x - ww / 2), v(y)); c.bezierCurveTo(u(x - ww / 2), v(y - hh * .45), u(x + sway - ww * .1), v(y - hh * .8), u(x + sway), v(y - hh));
      c.bezierCurveTo(u(x + sway + ww * .1), v(y - hh * .8), u(x + ww / 2), v(y - hh * .45), u(x + ww / 2), v(y)); c.closePath();
      c.globalCompositeOperation = 'lighter'; c.fill(); c.globalCompositeOperation = 'source-over';
    }
  }
  // REAL-LOOKING FIRE (build 508): many soft glowing puffs rising from the logs, white-gold at the root, then gold, orange,
  // red, gone; drawn to each other as they rise (so they gather into tongues), shaken sideways by a slow turbulence;
  // a few sparks. Sprites baked once per colour (no per-frame gradients).
  const FCOL = [[255, 238, 190], [255, 206, 110], [255, 170, 70], [248, 132, 44], [232, 100, 32], [206, 74, 24], [160, 48, 18], [100, 28, 12]];
  const FSPR = FCOL.map(col => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const q = cv.getContext('2d'), g = q.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, css(col, 1)); g.addColorStop(.35, css(col, .55)); g.addColorStop(.7, css(col, .14)); g.addColorStop(1, css(col, 0)); q.fillStyle = g; q.fillRect(0, 0, 64, 64); return cv; });
  function puff(list, x, y, spread, up, size, life, pull) {
    list.push({ x: x + (rnd() + rnd() - 1) * spread, y, x0: x, vx: (rnd() - .5) * .5, vy: -up * (.75 + rnd() * .6), r0: size * (.7 + rnd() * .55), L: life * (.7 + rnd() * .6), a: 0, s: rnd() * 6.28, pull });
  }
  function fireStep(list) {
    for (const p of list) {
      p.a++; const q = p.a / p.L;
      p.x += p.vx + .55 * Math.sin(p.y * .018 + G.t * .09 + p.s) * q + (p.x0 - p.x) * p.pull;
      p.y += p.vy; p.vy *= .996;
    }
    return list.filter(p => p.a < p.L);
  }
  function fireDraw(c, list, k = 1) {
    c.globalCompositeOperation = 'lighter';
    for (const p of list) {
      const q = p.a / p.L, r = p.r0 * Math.pow(1 - q, .7) * S, i = Math.min(FCOL.length - 1, Math.floor(q * FCOL.length * .98));
      if (r < .3) continue; c.globalAlpha = Math.min(1, .26 * k * (q < .06 ? q / .06 : 1) * (1 - q * .5));
      c.drawImage(FSPR[i], u(p.x) - r, v(p.y) - r, 2 * r, 2 * r);
    }
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  }
  // the La Tour detail (St Joseph the Carpenter): a small flame cupped in a hand, the light glowing red through the fingers.
  // x, y = the hand in plate units; face 1 right, -1 left; a = strength.
  function cupped(c, x, y, face, k, a) {
    if (a <= .01) return; const fl = 1 + .08 * Math.sin(G.t / 3.7) * Math.sin(G.t / 8.3), X = u(x), Y = v(y), s = S * k;
    glow(c, X, Y - 14 * s, 150 * s * fl, [255, 150, 70], .22 * a);
    glow(c, X, Y - 14 * s, 40 * s * fl, [255, 220, 150], .55 * a);
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(255,244,214,.95)'; c.beginPath(); c.ellipse(X, Y - 15 * s, 3.2 * s, 8.5 * s * fl, 0, 0, 6.2832); c.fill();
    // the hand round it, toward us: dark, its upper edge glowing blood-red where the light comes through the fingers
    c.fillStyle = '#1a0c08'; c.beginPath(); c.moveTo(X - face * 12 * s, Y - 22 * s); c.quadraticCurveTo(X - face * 20 * s, Y + 4 * s, X + face * 2 * s, Y + 6 * s); c.quadraticCurveTo(X + face * 10 * s, Y + 2 * s, X + face * 9 * s, Y - 4 * s);
    c.quadraticCurveTo(X - face * 2 * s, Y - 6 * s, X - face * 7 * s, Y - 20 * s); c.closePath(); c.fill();
    c.globalCompositeOperation = 'lighter'; c.strokeStyle = css([220, 60, 24], .8); c.lineWidth = Math.max(1, 2.2 * s); c.beginPath(); c.moveTo(X - face * 11 * s, Y - 21 * s); c.quadraticCurveTo(X - face * 3 * s, Y - 7 * s, X + face * 8 * s, Y - 4 * s); c.stroke();
    c.restore(); c.globalCompositeOperation = 'source-over';
  }
  let DK = null; const dkBuf = () => { if (!DK) DK = document.createElement('canvas'); if (DK.width !== ctx.canvas.width || DK.height !== ctx.canvas.height) { DK.width = ctx.canvas.width; DK.height = ctx.canvas.height; } return DK; };
  if (D4) { const n = 'room4-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR4())); pic('room4-caster2'); pic('room4-pourer'); }
  // the walk round the wall (build 508): the two set off from where they stand, go BEHIND the man with the bucket and the fire (a
  // little further back: smaller, darker, standing a little higher), behind the chimney breast into the dark, the Interpreter's
  // cupped candle the only light there; they stop and turn to the one pouring oil, and the dark lifts
  const WK = { C0: 280, I0: 560, C1: 2620, I1: 2860, V: 3.4, k: .92, up: 14, PO: 2040, SPOUT: [1896, 790], CX: 900, LIP: [1282, 830] };
  // the perspective of the chimney breast's face (build 523; build 526: the eye at chest height again, so the floor line runs up too):
  // a vanishing point PV on the left, depth d into the
  // picture shrinks by PQ(d) (as the gate's wall in Level 3); the hearth's opening runs from depth a0 to a1, its arch springing at SPR
  // above the floor and rising RISE more; the fire sits FIN inside the face at depth FD
  const PV = { X: 600, Y: HOUSE.FY - 100, NEAR: 90, GP: 700, D: 520, a0: 110, a1: 430, SPR: 290, RISE: 120, FD: 270, FIN: 50, REV: 130 };
  // the hearth wall's foot stands NEAR in front of the back wall's foot (build 529; owner: its far corner just below where wall and
  // floor meet, its near corner down where the floor's dark shadow starts): its floor line is FB, the eye low enough for both
  const FB = HOUSE.FY + PV.NEAR;
  const PQ = d => 1 / (1 + d / PV.GP), PP = (X, Y, d) => { const q = PQ(d); return [PV.X + (X - PV.X) * q, PV.Y + (Y - PV.Y) * q]; };
  const archAt = (d0, d1, spr, rise, th, X = R4D.PART0) => { const m = (d0 + d1) / 2, r = (d1 - d0) / 2, s = Math.sin(th); return PP(X, FB - spr - rise * Math.pow(s, .7), m - r * Math.cos(th)); };
  const archPts = (d0, d1, spr, rise, X = R4D.PART0) => { const pts = [PP(X, FB, d1)]; for (let k = 0; k <= 24; k++) pts.push(archAt(d0, d1, spr, rise, Math.PI - Math.PI * k / 24, X)); pts.push(PP(X, FB, d0)); return pts; };
  // where the fire is seen on the picture (for the water, the light and the glow)
  const FXS = () => PP(R4D.PART0 + PV.FIN, FB, PV.FD);
  return {
    // 4 THE FIRE FED WITH OIL (after La Tour's St Joseph the Carpenter): round the back of the wall
    r4: {
      pic: D4 ? 'room4-drawn' : 'room4', shell: D4 ? 1 : 0, FY: D4 ? HOUSE.FY : 1240, cam0: 0, tone: D4 ? [110, 94, 86] : [150, 100, 80], satK: D4 ? .3 : 1,
      light(x) { const f = .8 + .13 * Math.sin(G.t / 4.3) * Math.sin(G.t / 9.1) + .07 * Math.sin(G.t / 2.1); return x < R4D.PART1 ? { x: D4 ? FXS()[0] : 1810, a: (D4 ? .28 : .75) * f, col: D4 ? [200, 130, 90] : [240, 120, 50] } : { x: R4D.PART1, a: .22 * f * smooth(.4, 1, this.rv), col: [210, 150, 100] }; },
      enter() {
        this.rv = 0; this.steam = []; this.oil = []; this.water = []; this.cast = 0; this.grow = 0; this.dip = 0; this.wet = 0;
        this.fire = []; this.small = []; this.sparks = []; this.go = false; this.w = 0; this.cx = WK.C0; this.ix = WK.I0; this.cf = 0; this.if = 0; this.st = -1; this.arr = 0; this.sw = 0; this.cand = 0;
        if (D4) { sheetFrames(VIS.C.walk); sheetFrames(VIS.I.walk); }
        // the fire already burning when the room comes up
        for (let n = 0; n < 70; n++) this.fireTick();
      },
      fireTick() {
        const F = R4D.FIRE, FY = this.FY, gk = (1.05 + .4 * this.grow) * (1 - .3 * this.dip);
        // five tongues, each drawn back to its own root, of different heights (as the old teardrops were)
        const n = (1 + .6 * this.grow) * (1 - .55 * this.dip);
        for (const [dx, h] of [[-95, .62], [0, .9], [85, .72], [-40, .5], [45, .45]]) if (rnd() < 1.3 * n) puff(this.fire, F + dx, FY - 34, 34, 2.9 * gk * (.7 + .3 * h), 56 * (.75 + .35 * h), 110 * h * gk, .02);
        if (rnd() < .4) puff(this.fire, F, FY - 30, 130, 1.1, 36, 26, .004);
        // the back of the same fire, under the spout where the oil goes in
        if (rnd() < .7 * n) puff(this.fire, F + 110, FY - 30, 26, 2.4 * gk, 40, 60 * gk, .02);
        if (rnd() < .06 + .06 * this.grow) this.sparks.push({ x: F + (rnd() - .5) * 120, y: FY - 120, vx: (rnd() - .5) * 1.2, vy: -3 - rnd() * 3, a: 0, L: 60 + rnd() * 70 });
        this.fire = fireStep(this.fire);
        for (const p of this.sparks) { p.a++; p.x += p.vx + .6 * Math.sin(p.y * .02 + p.L); p.y += p.vy; p.vy *= .985; }
        this.sparks = this.sparks.filter(p => p.a < p.L);
      },
      // drawn room only: the walkers, the man casting water, the fire, the arch through the wall, the man pouring oil behind it
      under(c) {
        if (!D4) return;
        const FY = this.FY, F = R4D.FIRE, cs = pics['room4-caster2'], po = pics['room4-pourer'], P0 = R4D.PART0, P1 = R4D.PART1;
        // the two walking round, further back than everyone else (drawn first): the Interpreter, his cupped candle, then Christian
        // in front of both (owner, build 522: the Interpreter and his light always behind the others)
        if (this.go && this.sw < 1) {
          const col = [100, 74, 62], a = 1 - this.sw, k = WK.k, [lx, ly, lf] = this.candlePt();
          walkFig(c, 'I', this.ix, this.if, k, a, col, FY - WK.up); cupped(c, lx, ly, lf, 1.4, this.cand * a); walkFig(c, 'C', this.cx, this.cf, k, a, col, FY - WK.up);
        }
        const fl = .85 + .1 * Math.sin(G.t / 4.3) * Math.sin(G.t / 9.1) + .05 * Math.sin(G.t / 2.1), gw = (.8 + .3 * this.grow - .25 * this.dip) * fl;
        const poly = (pts, close = true) => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(u(x), v(y)) : c.moveTo(u(x), v(y))); if (close) c.closePath(); };
        // THE CHIMNEY BREAST'S FACE IN PERSPECTIVE (build 523; owner: "make the fireplace opening arched like a real old hearth and make it facing
        // the man throwing on water (perspective kinda like that gate in level 3)"): the breast is cut by the section at P0..P1; its face toward
        // the room runs back from the cut to a vanishing point on the left (PV), as the gate's wall does, and the hearth is set in that face
        const D = PV.D, [fx0, fy0] = PP(P0, FB, D), CY = HOUSE.CEIL + 80, [, ft0] = PP(P0, CY, D);
        c.save(); c.beginPath(); c.rect(u(EX.x0), v(CY), (EX.x1 - EX.x0) * S, (EX.y1 - CY) * S); c.clip();
        // the face itself, dark stone, warmed round the hearth
        poly([[P0, CY], [fx0, ft0], [fx0, fy0], [P0, FB]]); c.fillStyle = '#150d09'; c.fill();
        c.save(); poly([[P0, CY], [fx0, ft0], [fx0, fy0], [P0, FB]]); c.clip();
        g = c.createLinearGradient(u(fx0), 0, u(P0), 0); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(u(fx0), v(ft0), (P0 - fx0) * S, (FB - ft0) * S);
        const [hx, hy] = PP(P0, FB - PV.SPR * .6, PV.FD);
        g = c.createRadialGradient(u(hx), v(hy), 0, u(hx), v(hy), 520 * S); g.addColorStop(0, css([220, 120, 50], .32 * gw)); g.addColorStop(.5, css([160, 80, 34], .12 * gw)); g.addColorStop(1, 'rgba(160,80,34,0)');
        c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(u(hx) - 520 * S, v(hy) - 520 * S, 1040 * S, 1040 * S); c.globalCompositeOperation = 'source-over';
        c.restore(); c.restore();
        // the firelight lying on the floor at the opening's foot
        { const [ax, ay] = PP(P0, FB, PV.FD), r = 240 * S; c.save(); c.translate(u(ax), v(ay)); c.scale(1, .08); const fg = c.createRadialGradient(0, 0, 0, 0, 0, r); fg.addColorStop(0, css([240, 130, 55], .45 * gw)); fg.addColorStop(1, 'rgba(240,130,55,0)'); c.globalCompositeOperation = 'lighter'; c.fillStyle = fg; c.fillRect(-r, -r, 2 * r, 2 * r); c.restore(); c.globalCompositeOperation = 'source-over'; }
        // the stone surround: a low four-centred arch, as old English hearths have, its dressed stones a shade lighter, joints radiating
        const out = archPts(PV.a0 - 46, PV.a1 + 46, PV.SPR, PV.RISE + 46), inn = archPts(PV.a0, PV.a1, PV.SPR, PV.RISE);
        poly(out); c.fillStyle = '#2b1e15'; c.fill();
        c.strokeStyle = 'rgba(8,5,3,.6)'; c.lineWidth = Math.max(.6, 1.4 * S);
        for (let k = 1; k < 8; k++) { const th = Math.PI * k / 8, a = archAt(PV.a0, PV.a1, PV.SPR, PV.RISE, th), b = archAt(PV.a0 - 46, PV.a1 + 46, PV.SPR, PV.RISE + 46, th); poly([a, b], false); c.stroke(); }
        for (const yy of [PV.SPR * .35, PV.SPR * .7]) for (const [d0, d1] of [[PV.a1, PV.a1 + 46], [PV.a0 - 46, PV.a0]]) { poly([PP(P0, FB - yy, d0), PP(P0, FB - yy, d1)], false); c.stroke(); }
        // the surround's inner edge catches the fire
        c.save(); poly(out); c.clip(); g = c.createRadialGradient(u(hx), v(hy), 0, u(hx), v(hy), 300 * S); g.addColorStop(0, css([255, 150, 70], .5 * gw)); g.addColorStop(1, 'rgba(255,150,70,0)');
        c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(u(hx) - 300 * S, v(hy) - 300 * S, 600 * S, 600 * S); c.restore(); c.globalCompositeOperation = 'source-over';
        // INSIDE THE OPENING, IN PERSPECTIVE (build 530; owner: "the arch is messed up - think perspective"): the opening has depth REV
        // into the breast. Its back edge is the same arch REV further in (X = P0 + REV), so between the two we see the reveal: the far
        // jamb's inner side and the arch's underside, in sooty stone lit by the fire; through the back edge the dark recess, its floor
        // running back toward the vanishing point, the logs and embers lying along it, the fire standing on it
        const REV = PV.REV, back = archPts(PV.a0, PV.a1, PV.SPR, PV.RISE, P0 + REV);
        c.save(); poly(inn); c.clip();
        g = c.createRadialGradient(u(hx), v(hy), 0, u(hx), v(hy), 260 * S); g.addColorStop(0, css([120, 62, 30], 1)); g.addColorStop(.6, '#3a2014'); g.addColorStop(1, '#1a0e08'); c.fillStyle = g; poly(inn); c.fill();
        // the jamb's inner face meets the arch's underside along a soft line: shade the underside a little darker
        poly(back); c.fillStyle = '#0a0503'; c.fill();
        c.save(); poly(back); c.clip();
        const [ix0, iy0] = PP(P0 + REV, FB - PV.SPR - PV.RISE, PV.FD);
        g = c.createLinearGradient(0, v(iy0), 0, v(FB)); g.addColorStop(0, '#060302'); g.addColorStop(.55, '#1a0b06'); g.addColorStop(1, css([120, 48, 20], 1)); c.fillStyle = g; poly(back); c.fill();
        // the recess floor: a strip of hearth running back from the near jamb to the far one, glowing with embers
        const fl0 = PP(P0 + 14, FB, PV.a0 + 14), fl1 = PP(P0 + 14, FB, PV.a1 - 14), fl2 = PP(P0 + REV, FB, PV.a1 - 14), fl3 = PP(P0 + REV, FB, PV.a0 + 14);
        poly([fl0, fl1, fl2, fl3]); c.fillStyle = css([150, 60, 22], .9 * gw); c.fill();
        // the fire stands on that floor: its roots spread along the floor's slope (a shear), at the recess's depth
        const qm = PQ(PV.FD), [sx, sy] = PP(P0 + REV * .55, FB, PV.FD), sl = (fl1[1] - fl0[1]) / (fl1[0] - fl0[0]);
        c.save(); c.translate(u(sx), v(sy)); c.transform(qm, qm * sl, 0, qm, 0, 0); c.translate(-u(F), -v(FY));
        g = c.createRadialGradient(u(F), v(FY - 120), 0, u(F), v(FY - 120), 320 * S); g.addColorStop(0, css([255, 150, 60], .55 * gw)); g.addColorStop(1, 'rgba(255,150,60,0)'); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(u(F - 320), v(FY - 440), 640 * S, 440 * S); c.globalCompositeOperation = 'source-over';
        c.fillStyle = '#120805';
        for (const [x, w, a] of [[F - 150, 230, -.06], [F - 80, 200, .1], [F - 170, 120, .02], [F + 60, 150, -.08]]) { c.save(); c.translate(u(x + w / 2), v(FY - 22)); c.rotate(a); c.beginPath(); c.ellipse(0, 0, w / 2 * S, 11 * S, 0, 0, 6.2832); c.fill(); c.restore(); }
        g = c.createLinearGradient(u(F - 220), 0, u(F + 220), 0); g.addColorStop(0, 'rgba(255,120,40,0)'); g.addColorStop(.12, 'rgba(255,140,50,.85)'); g.addColorStop(.88, 'rgba(255,130,45,.8)'); g.addColorStop(1, 'rgba(255,110,40,0)');
        c.fillStyle = g; c.fillRect(u(F - 220), v(FY - 14), 440 * S, 12 * S);
        fireDraw(c, this.fire, 1);
        c.globalCompositeOperation = 'lighter'; for (const p of this.sparks) { const q = p.a / p.L; c.fillStyle = css([255, 220, 150], (1 - q) * (.6 + .4 * Math.sin(p.a * .7))); c.fillRect(u(p.x), v(p.y), Math.max(1, 3 * S), Math.max(1, 3 * S)); } c.globalCompositeOperation = 'source-over';
        c.restore(); c.restore();
        // the fire's light on the reveal (the jamb's inner face and the underside), over everything in the opening
        g = c.createRadialGradient(u(sx), v(sy - 80), 0, u(sx), v(sy - 80), 240 * S); g.addColorStop(0, css([255, 150, 60], .28 * gw)); g.addColorStop(1, 'rgba(255,150,60,0)');
        c.save(); poly(inn); poly(back); c.clip('evenodd'); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(u(sx) - 240 * S, v(sy - 80) - 240 * S, 480 * S, 480 * S); c.restore();
        c.restore(); c.globalCompositeOperation = 'source-over';
        // the chimney breast cut by the section (down to the hearth wall's near foot, FB; build 531), over the walkers (they pass behind it); a low slot through its foot glows with the
        // back of the same fire, where from behind the wall the oil goes in
        c.fillStyle = '#0c0705'; c.fillRect(u(P0), v(EX.y0), (P1 - P0) * S, (FB - EX.y0) * S);
        g = c.createLinearGradient(0, v(380), 0, v(900)); g.addColorStop(0, 'rgba(12,7,5,1)'); g.addColorStop(1, 'rgba(12,7,5,0)'); c.fillStyle = g; c.fillRect(u(P0), v(380), 50 * S, 520 * S);
        g = c.createLinearGradient(0, v(FY - 46), 0, v(FY)); g.addColorStop(0, '#1a0904'); g.addColorStop(1, css([170, 66, 24], .9 * gw)); c.fillStyle = g; c.fillRect(u(P0 + 30), v(FY - 46), (P1 - P0 - 30) * S, 46 * S);
        // behind the wall: the one pouring oil, and the thin thread of oil into the slot
        // unseen until they have gone round (the book: "it is hard for the tempted to see"): only the fire's flare at each drop shows
        const pa = smooth(0, 1, this.rv);
        if (po && pa > 0) fig(c, 'room4-pourer', { ax: 157, g: 790, s: .8, ct: 1, mul: 1, sat: 1, noSh: 1 }, WK.PO, FY, -1, 1, pa, [200, 188, 176]);
        c.strokeStyle = css([255, 196, 90], .35 * pa); c.lineWidth = Math.max(.6, 1.6 * S); c.beginPath(); c.moveTo(u(WK.SPOUT[0]), v(WK.SPOUT[1])); c.lineTo(u(WK.SPOUT[0] - 3), v(FY - 40)); c.stroke();
        c.fillStyle = css([255, 210, 110], .9 * pa); for (const o of this.oil) { c.beginPath(); c.arc(u(o.x), v(o.y), Math.max(.8, 3 * S), 0, 6.2832); c.fill(); }
        // the man casting water (his own picture; a free clip of the swing is queued)
        const cx = WK.CX;
        if (cs) fig(c, 'room4-caster2', { ax: 150, g: 781, s: .8, ct: 1, mul: 1, sat: 1, noSh: 1 }, cx, FY, -1, 1, 1, [150, 132, 120]);
        // the wet on the hearth where the water falls, darkening and slowly drying
        if (this.wet > .01) { c.save(); c.translate(u(FXS()[0] - 200), v(FY - 12)); c.scale(1, .1); const wg = c.createRadialGradient(0, 0, 0, 0, 0, 120 * S); wg.addColorStop(0, css([12, 8, 8], .7 * this.wet)); wg.addColorStop(1, css([12, 8, 8], 0)); c.fillStyle = wg; c.fillRect(-120 * S, -120 * S, 240 * S, 240 * S); c.restore(); }
        c.lineCap = 'round'; c.lineWidth = Math.max(1, 2.6 * S);
        for (const w of this.water) { c.strokeStyle = css([200, 214, 226], .38 * w.a); c.beginPath(); c.moveTo(u(w.x - w.vx * 2.2), v(w.y - w.vy * 2.2)); c.lineTo(u(w.x), v(w.y)); c.stroke(); }
        c.lineCap = 'butt';
      },
      run() { talk([[I, 'This fire is the work of grace in the heart. He who casts water on it is the Devil. Come, and see why it burns on.'], [TIP, 'Touch to go round the back of the wall.', 'round']], () => {}); },
      act() { if (G.act === 'round' && D4) { this.go = true; G.ring = null; } },
      upd() {
        if (!D4) {
          if (G.act === 'round') { if (G.actT >= 60 && !hold() && !G.ring) G.ring = ring(2172, 1000); if (hold()) { G.ring = null; this.rv = Math.min(1, this.rv + .0055); } if (this.rv >= 1) { next(true); G.state = 'auto'; H.ph = 'saw'; H.t = 0; } }
          H.cam.to = this.rv * (H.R.PW * S - VW);
        } else {
          if (G.act === 'round' && !this.go) { if (hold()) this.go = true; else if (G.actT >= 60 && !G.ring) G.ring = ring(2050, 1000); }
          if (this.go && !this.arr) {
            // they walk by themselves once set off (owner, build 312: a touch, not a hold); Christian at his walk's own pace or slower,
            // the Interpreter's frames at his own pace
            this.w = Math.min(1, this.w + .04); const sp = WK.V * WK.k * this.w;
            if (this.ix < WK.I1) { this.ix = Math.min(WK.I1, this.ix + sp); this.if += WALK_FPT * this.w; }
            if (this.cx < WK.C1) { this.cx = Math.min(WK.C1, this.cx + sp); this.cf += WALK_FPT * this.w * Math.min(1, WK.V / walkSpeed('C', 1)); }
            const step = Math.floor(this.cf * 2 / VIS.C.walk.fr); if (step !== this.st) { this.st = step; if (typeof stepOn === 'function' && typeof audio === 'function' && audio()) stepOn('wood', .8); }
            this.cand = Math.min(1, this.cand + .03);
            if (this.ix >= WK.I1 && this.cx >= WK.C1) this.arr = 1;
          }
          // arrived: they turn to him (in the dark, a soft change), then the dark lifts and the Interpreter speaks
          if (this.arr) { this.sw = Math.min(1, this.sw + .03); if (this.sw >= 1) this.rv = Math.min(1, this.rv + .01); if (this.rv >= 1 && H.ph !== 'saw') { next(true); G.state = 'auto'; H.ph = 'saw'; H.t = 0; } }
        }
        if (H.ph === 'saw' && H.t === 60) talk([[I, 'This is Christ, who with the oil of his grace keeps the work going in the heart. He stands behind the wall, for it is hard for the tempted to see it.']], () => goTo('r5'));
        if (D4) {
          this.fireTick();
          // the cast: every few seconds water arcs from his bucket DOWN into the fire; where it strikes the fire sinks with a hiss
          // and a gust of steam, then rises higher than before (the book: "yet did the fire burn higher and hotter")
          this.cast += 1 / 70; if (this.cast >= 3.2) { this.cast = 0; this.hit = false; }
          if (this.cast > .3 && this.cast < .62) for (let i = 0; i < 3; i++) this.water.push({ x: WK.LIP[0] + rnd() * 14, y: WK.LIP[1] + rnd() * 10, vx: 3.3 + rnd() * .7, vy: 4.4 + rnd() * 1.4, a: 1 });
          for (const w of this.water) {
            w.vy += .16; w.x += w.vx; w.y += w.vy;
            if (w.x > FXS()[0] - 90 && w.y > FXS()[1] - 260 && w.a === 1) {
              w.a = .99; if (!this.hit) { this.hit = true; this.dip = 1; noise(3000, 1, .6, .05); noise(500, 2, .5, .04); }
              this.wet = Math.min(1, this.wet + .01); if (rnd() < .2) this.steam.push({ x: w.x + (rnd() - .5) * 60, y: w.y, vx: (rnd() - .5) * .8, vy: -1.6 - rnd() * 1.2, a: .5, s: 10 + rnd() * 14 });
            }
            if (w.a < 1) w.a *= .7;
          }
          this.water = this.water.filter(w => w.a > .05 && w.y < this.FY);
          if (this.dip > 0) { this.dip = Math.max(0, this.dip - .02); if (this.dip < .5) this.grow = Math.min(1, this.grow + .004); }
          this.wet = Math.max(0, this.wet - .0012);
          // the oil, poured continually, falls straight into the back of the fire; each drop makes it flare a little
          if (G.t % 6 === 0) this.oil.push({ x: WK.SPOUT[0] + rnd() * 3, y: WK.SPOUT[1], vy: 1 });
          for (const o of this.oil) { o.vy += .3; o.y += o.vy; if (o.y >= this.FY - 40) { o.done = 1; for (let i = 0; i < 3; i++) puff(this.fire, R4D.FIRE + 110, this.FY - 24, 14, 2.6, 34, 40, .02); } }
          this.oil = this.oil.filter(o => !o.done);
        }
        if (!D4 && G.t % 5 === 0) this.steam.push({ x: 1760 + rnd() * 80, y: 800 + rnd() * 60, vy: -.8 - rnd(), a: .4, s: 20 + rnd() * 30 });
        for (const s of this.steam) { s.y += s.vy; s.x += (s.vx || 0) - .3; s.a *= D4 ? .975 : .985; s.s += D4 ? .7 : .5; }
        this.steam = this.steam.filter(s => s.a > .03);
        if (!D4) {
          if (this.rv > .3 && G.t % 7 === 0) this.oil.push({ x: 2217, y: 880, vy: 1 });
          for (const o of this.oil) { o.vy += .3; o.y += o.vy; o.x -= .4; }
          this.oil = this.oil.filter(o => o.y < 1080);
        }
      },
      people(c) {
        if (!D4) { const q = smooth(0, .5, this.rv), r = smooth(.6, 1, this.rv); visitor(c, 'I', 330, 1, 1, 1 - q); visitor(c, 'C', 40, 1, 1, 1 - q); if (r > 0) { visitor(c, 'I', 2700, -1, 1, r); visitor(c, 'C', 2930, -1, 1, r); } return; }
        if (!this.go) { visitor(c, 'I', WK.I0, 1, 1, 1); visitor(c, 'C', WK.C0, 1, 1, 1); }
        // arrived: standing, turned toward the one pouring oil (Christian nearer him, the Interpreter behind, his candle in his hands)
        if (this.sw > 0) { const [lx, ly, lf] = this.candlePt(); visitor(c, 'I', WK.I1 + 70, -1, 1, this.sw); cupped(c, lx, ly, lf, 1.4, this.cand * this.sw); visitor(c, 'C', WK.C1 + 20, -1, 1, this.sw); }
      },
      candlePt() {
        // where the Interpreter's hands are: walking (his walk frames, k .92) or standing turned left
        const k = WK.k, wx = this.ix + 109 * k, wy = this.FY - WK.up - 411 * k, sx = WK.I1 + 70 - 71, sy = this.FY - 422, q = this.sw;
        return [wx + (sx - wx) * q, wy + (sy - wy) * q, q > .5 ? -1 : 1];
      },
      over(c) {
        const f = .75 + .15 * Math.sin(G.t / 4.3) * Math.sin(G.t / 9.1) + .1 * Math.sin(G.t / 2.1);
        const gw = D4 ? .8 + .3 * this.grow - .25 * this.dip : 1; const gx = D4 ? FXS()[0] : 1810; glow(c, u(gx), v(1000), 260 * f * gw, [255, 140, 60], (D4 ? .22 : .32) * f * gw); glow(c, u(gx), v(1080), 90, [255, 220, 140], .25 * f);
        for (const s of this.steam) { const g = c.createRadialGradient(u(s.x), v(s.y), 0, u(s.x), v(s.y), s.s * S); g.addColorStop(0, css([220, 210, 205], s.a * (D4 ? .09 : .35))); g.addColorStop(1, css([220, 210, 205], 0)); c.fillStyle = g; c.fillRect(u(s.x) - s.s * S, v(s.y) - s.s * S, 2 * s.s * S, 2 * s.s * S); }
        // the dark behind the wall, lifting once they stand there; while it is dark the Interpreter's cupped candle makes a hole in it
        const hx = u(2168);
        if (!D4) {
          const hide = 1 - smooth(0, .8, this.rv);
          if (hide > .01) { const g = c.createLinearGradient(hx - 20, 0, hx + 60, 0); g.addColorStop(0, 'rgba(8,4,3,0)'); g.addColorStop(1, css([8, 4, 3], hide)); c.fillStyle = g; c.fillRect(hx - 20, v(0), u(3168) - hx + 20, PH * S); }
          if (this.rv > .3) { c.fillStyle = css([255, 200, 90], .9); for (const o of this.oil) { c.beginPath(); c.arc(u(o.x), v(o.y), 1.3, 0, 6.2832); c.fill(); } glow(c, u(2190), v(1090), 60 * f, [255, 170, 80], .3 * smooth(.3, 1, this.rv)); }
          return;
        }
        const hide = .97 * (1 - smooth(0, 1, this.rv)), [lx, ly, lf] = this.candlePt();
        if (hide > .01) {
          const o = dkBuf(), q = o.getContext('2d'), T = c.getTransform(); q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, o.width, o.height); q.setTransform(T); q.globalCompositeOperation = 'source-over';
          const h0 = u(R4D.PART1 - 10), g = q.createLinearGradient(h0, 0, u(R4D.PART1 + 50), 0); g.addColorStop(0, 'rgba(8,4,3,0)'); g.addColorStop(1, css([8, 4, 3], hide)); q.fillStyle = g; q.fillRect(h0, v(EX.y0), u(EX.x1) - h0, (EX.y1 - EX.y0) * S);
          if (this.cand > 0) { q.globalCompositeOperation = 'destination-out'; const r = 300 * S, X = u(lx), Y = v(ly); const hg = q.createRadialGradient(X, Y, 0, X, Y, r); hg.addColorStop(0, css([0, 0, 0], this.cand)); hg.addColorStop(.3, css([0, 0, 0], .85 * this.cand)); hg.addColorStop(.6, css([0, 0, 0], .4 * this.cand)); hg.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = hg; q.fillRect(X - r, Y - r, 2 * r, 2 * r); q.globalCompositeOperation = 'source-over'; }
          c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(o, 0, 0); c.setTransform(T);
        }
      },
    },
  };
});
