// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: ROOM 4, THE FIRE FED WITH OIL (book {80} to {82}).
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/room4.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { D4, EX, HOUSE, I, PH, S, bakeShell, fig, glow, goTo, hold, loads, noise, pic, pics, ring, rnd, u, v, visitor } = H;
  const R4D = { caster: { ax: 35, g: 302, s: 2.1, ct: 1.3, mul: .42, sat: .5 }, pourer: { ax: 62, g: 299, s: 2.1, ct: 1.3, mul: .42, sat: .5 }, FIRE: 1810, PART0: 1925, PART1: 2175, SMALL: 2225 };
  function bakeR4() {
    // on the house's shell (build 425): the fire low on the floor at FIRE is the one light; the chimney breast between PART0 and PART1 is
    // the wall they go round (the end walls' own near-black, its face toward the fire warmed); behind it the small hidden fire's own low light
    const F = R4D.FIRE, P0 = R4D.PART0, P1 = R4D.PART1, FY = HOUSE.FY;
    return bakeShell({ seed: 44, doors: 'LR', lights: [{ x: F, y: 1120, r: 1500, lit: [184, 98, 42], half: [90, 40, 20], sx: 1.2 }, { x: R4D.SMALL + 160, y: 1150, r: 700, lit: [150, 84, 40], half: [70, 34, 18], sx: 1.1, a: .8 }],
      near(c) {
        // the chimney breast, floor to ceiling, and a short hood over the hearth on the fire's side
        c.fillStyle = '#0c0705'; c.fillRect(P0, EX.y0, P1 - P0, FY + 6 - EX.y0);
        let g = c.createLinearGradient(P0, 0, P0 + 46, 0); g.addColorStop(0, 'rgba(236,140,64,.5)'); g.addColorStop(.3, 'rgba(160,80,36,.22)'); g.addColorStop(1, 'rgba(160,80,36,0)');
        c.save(); c.beginPath(); c.rect(P0, 420, 46, FY - 420); c.clip(); c.fillStyle = g; c.fillRect(P0, 420, 46, FY - 420); c.restore();
        g = c.createLinearGradient(0, 380, 0, 900); g.addColorStop(0, 'rgba(12,7,5,1)'); g.addColorStop(1, 'rgba(12,7,5,0)'); c.fillStyle = g; c.fillRect(P0, 380, 50, 520);
        // the hearth: a low stone step under the fire, its top edge lit
        c.fillStyle = '#1c110a'; c.fillRect(F - 300, FY - 22, 600, 26); c.fillStyle = 'rgba(240,150,70,.4)'; c.fillRect(F - 300, FY - 22, 600, 3);
        // the logs of both fires, dark against their own light
        c.fillStyle = '#120805';
        for (const [x, w, a] of [[F - 120, 230, -.06], [F - 60, 200, .1], [F - 150, 120, .02]]) { c.save(); c.translate(x + w / 2, FY - 28); c.rotate(a); c.beginPath(); c.ellipse(0, 0, w / 2, 13, 0, 0, 6.2832); c.fill(); c.restore(); }
        for (const [x, w, a] of [[R4D.SMALL + 20, 90, -.05], [R4D.SMALL + 50, 70, .12]]) { c.save(); c.translate(x + w / 2, FY - 8); c.rotate(a); c.beginPath(); c.ellipse(0, 0, w / 2, 8, 0, 0, 6.2832); c.fill(); c.restore(); }
      } });
  }
  // a soft flame: stacked teardrops, the core pale gold, the edge amber, swaying and breathing (no hard tongues)
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
  if (D4) { const n = 'room4-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR4())); pic('room4-caster2'); pic('room4-pourer'); }
  return {
    // 4 THE FIRE FED WITH OIL (after La Tour's St Joseph the Carpenter): round the back of the wall
    r4: {
      pic: D4 ? 'room4-drawn' : 'room4', shell: D4 ? 1 : 0, FY: D4 ? HOUSE.FY : 1240, cam0: 0, tone: [150, 100, 80],
      light(x) { const f = .8 + .13 * Math.sin(G.t / 4.3) * Math.sin(G.t / 9.1) + .07 * Math.sin(G.t / 2.1); return x < 1900 ? { x: 1810, a: .75 * f, col: [240, 120, 50] } : { x: 2187, a: .3 * f * smooth(.4, 1, this.rv), col: [255, 160, 80] }; },
      enter() { this.rv = 0; this.steam = []; this.oil = []; this.water = []; this.cast = 0; this.grow = 0; this.dip = 0; },
      // drawn room only: the fire, the man casting water and the man pouring oil behind the wall, all live
      under(c) {
        if (!D4) return;
        const FY = this.FY, F = R4D.FIRE, cs = pics['room4-caster2'], po = pics['room4-pourer'];
        // the man casting water, dark against the firelit wall; his bucket swings up at each cast
        const cx = 1150;
        if (cs) fig(c, 'room4-caster2', { ax: 150, g: 781, s: .8, ct: 1, mul: 1, sat: 1, noSh: 1 }, cx, FY, -1, 1, 1, [165, 146, 132]);
        for (const w of this.water) { c.fillStyle = css([210, 220, 228], .55 * w.a); c.beginPath(); c.arc(u(w.x), v(w.y), Math.max(.8, 3 * S), 0, 6.2832); c.fill(); }
        // the fire: a soft heart and a few flames, higher and hotter in spite of the water
        // it shrinks a moment where the water strikes, then rises higher than before (the book: "yet did the fire burn higher and hotter")
        const gk = (1.05 + .4 * this.grow) * (1 - .28 * this.dip);
        for (const [dx, h, w, ph] of [[-95, 320, 130, 0], [0, 480, 170, 1.7], [85, 380, 140, 3.1], [-30, 240, 240, 4.4], [40, 200, 200, 2.6]]) flame(c, F + dx, FY - 24, h * gk, w * (.9 + .15 * this.grow), ph);
        // behind the wall: the man pouring oil and the small fire it feeds (the dark in over() hides them until they go round)
        flame(c, R4D.SMALL, FY - 8, 120, 60, 2.2, .9); flame(c, R4D.SMALL + 20, FY - 8, 80, 50, 5.1, .8);
        if (po) fig(c, 'room4-pourer', { ax: 157, g: 790, s: .8, ct: 1, mul: 1, sat: 1, noSh: 1 }, 2382, FY, -1, 1, 1, [255, 255, 255]);
      },
      run() { talk([[I, 'This fire is the work of grace in the heart. He who casts water on it is the Devil. Come, and see why it burns on.'], [TIP, 'Hold to go round the back of the wall.', 'round']], () => {}); },
      act() {},
      upd() {
        if (G.act === 'round') { if (G.actT >= 60 && !hold() && !G.ring) G.ring = ring(2172, 1000); if (hold()) { G.ring = null; this.rv = Math.min(1, this.rv + .0055); } if (this.rv >= 1) { next(true); G.state = 'auto'; H.ph = 'saw'; H.t = 0; } }
        H.cam.to = this.rv * (H.R.PW * S - VW);
        if (H.ph === 'saw' && H.t === 60) talk([[I, 'This is Christ, who with the oil of his grace keeps the work going in the heart. He stands behind the wall, for it is hard for the tempted to see it.']], () => goTo('r5'));
        if (D4) {
          const c0 = this.cast; this.cast += 1 / 70; if (this.cast >= 3.2) this.cast = 0;
          if (c0 < .95 && this.cast >= .95) { this.dip = 1; noise(3000, 1, .6, .05); noise(500, 2, .5, .04); }
          if (this.dip > 0) { this.dip = Math.max(0, this.dip - .02); if (this.dip < .5) this.grow = Math.min(1, this.grow + .004); }
          if (this.cast > .35 && this.cast < .7) for (let i = 0; i < 6; i++) this.water.push({ x: 1478 + rnd() * 20, y: 826 + rnd() * 16, vx: 4.6 + rnd() * 2, vy: -4 - rnd() * 1.6, a: 1 });
          for (const w of this.water) { w.vy += .16; w.x += w.vx; w.y += w.vy; if (w.x > R4D.FIRE - 90) w.a *= .82; }
          this.water = this.water.filter(w => w.a > .05 && w.y < this.FY);
        }
        if (G.t % 5 === 0) this.steam.push({ x: 1760 + rnd() * 80, y: 800 + rnd() * 60, vy: -.8 - rnd(), a: .5, s: 20 + rnd() * 30 });
        for (const s of this.steam) { s.y += s.vy; s.x -= .3; s.a *= .985; s.s += .5; }
        this.steam = this.steam.filter(s => s.a > .03);
        if (this.rv > .3 && G.t % 7 === 0) this.oil.push(D4 ? { x: 2226, y: 786, vy: 1 } : { x: 2217, y: 880, vy: 1 });
        for (const o of this.oil) { o.vy += .3; o.y += o.vy; o.x -= .4; }
        this.oil = this.oil.filter(o => o.y < (D4 ? 1200 : 1080));
      },
      people(c) { const q = smooth(0, .5, this.rv), r = smooth(.6, 1, this.rv); visitor(c, 'I', D4 ? 680 : 330, 1, 1, 1 - q); visitor(c, 'C', D4 ? 400 : 40, 1, 1, 1 - q); if (r > 0) { visitor(c, 'I', 2700, -1, 1, r); visitor(c, 'C', 2930, -1, 1, r); } },
      over(c) {
        const f = .75 + .15 * Math.sin(G.t / 4.3) * Math.sin(G.t / 9.1) + .1 * Math.sin(G.t / 2.1);
        const gw = D4 ? .8 + .3 * this.grow - .25 * this.dip : 1; glow(c, u(1810), v(1000), 260 * f * gw, [255, 140, 60], .32 * f * gw); glow(c, u(1810), v(1080), 90, [255, 220, 140], .25 * f);
        for (const s of this.steam) { const g = c.createRadialGradient(u(s.x), v(s.y), 0, u(s.x), v(s.y), s.s * S); g.addColorStop(0, css([220, 210, 205], s.a * (D4 ? .14 : .35))); g.addColorStop(1, css([220, 210, 205], 0)); c.fillStyle = g; c.fillRect(u(s.x) - s.s * S, v(s.y) - s.s * S, 2 * s.s * S, 2 * s.s * S); }
        // the dark behind the wall, lifting as they go round
        const hx = u(2168), hide = (D4 ? .82 : 1) * (1 - smooth(0, .8, this.rv));
        if (hide > .01) { const g = c.createLinearGradient(hx - 20, 0, hx + 60, 0); g.addColorStop(0, 'rgba(8,4,3,0)'); g.addColorStop(1, css([8, 4, 3], hide)); c.fillStyle = g; const yA = D4 ? v(EX.y0) : v(0), xB = D4 ? u(EX.x1) : u(3168); c.fillRect(hx - 20, yA, xB - hx + 20, (D4 ? EX.y1 - EX.y0 : PH) * S); }
        if (this.rv > .3) { c.fillStyle = css([255, 200, 90], .9); for (const o of this.oil) { c.beginPath(); c.arc(u(o.x), v(o.y), 1.3, 0, 6.2832); c.fill(); } glow(c, u(2190), v(1090), 60 * f, [255, 170, 80], .3 * smooth(.3, 1, this.rv)); }
      },
    },
  };
});
