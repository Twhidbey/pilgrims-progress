// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: ROOM 6, THE MAN IN THE IRON CAGE, a darker room (book {84} to {88}).
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/room6-7.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { HOUSE, I, MAN, PAINTED, S, bakeShell, creak, darkWith, fig, glow, goTo, loads, near, pic, pics, ring, rnd, tone, u, v, visitor } = H;
  // ROOM 6, THE CELLAR (build 427; the book {84}: "a very dark room"): rubble stone, a low flat ceiling, the spiral stair they came down at the far left
  // (the room's quoted detail, after Rembrandt's Philosopher in Meditation), ONE thin shaft of grey light from a grating high on the left landing
  // on the floor a little short of the cage, so the man sits just outside the light. The cage and the man are drawn live (the cage shakes).
  const R6 = { GR: [520, 330], LAND: 1430, CAGE: [1700, 560, 2200], MAN: [1750, 600, 2250, 1262] };
  function bakeR6() {
    return bakeShell({ seed: 66, doors: 'L', roof: 'vault', ceil: -260, spring: 240, skirt: 0, wallC: '#1b1612', beamC: '#120e0b', floorC: '#15110e',
      lights: [{ x: R6.LAND, y: 1150, r: 900, lit: [70, 62, 50], half: [36, 30, 24], sx: 1.4, a: .9 }, { x: 1950, y: 760, r: 700, lit: [60, 46, 30], half: [30, 24, 18], a: .7 }],
      wall(c, r) {
        // rough stone: a few broad soft patches a shade lighter or darker (no courses, no tiles)
        for (let k = 0; k < 40; k++) { const x = r() * 3168, y = 330 + r() * 880, rr = 80 + r() * 220, g = c.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, r() < .5 ? 'rgba(60,50,40,.10)' : 'rgba(6,4,3,.14)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); }
        // the grating high on the left: a small barred opening, dim night-grey
        const [gx, gy] = R6.GR; c.fillStyle = '#2c3036'; c.fillRect(gx - 70, gy, 140, 70); c.fillStyle = '#0a0807'; for (let k = 0; k < 5; k++) c.fillRect(gx - 64 + k * 32, gy, 7, 70); c.fillRect(gx - 70, gy + 32, 140, 6);
      },
      near(c) {
        // the spiral stair at the far left, the way they came down: a turned newel post and wedge treads winding up round it into the dark
        const nx = 360, FY = HOUSE.FY; c.fillStyle = '#0c0907';
        for (let k = 0; k < 10; k++) { const y = FY - 40 - k * 92, left = k % 2 === 0, w = 230 - (k % 4 === 1 || k % 4 === 3 ? 120 : 0), x0 = left ? nx - w : nx;
          c.fillStyle = '#0d0a08'; c.fillRect(x0, y, w, 26); c.fillRect(x0 + (left ? 0 : w - 18), y + 26, 18, 66); c.fillStyle = 'rgba(120,96,66,.35)'; c.fillRect(x0, y, w, 3); }
        c.fillStyle = '#0a0806'; c.fillRect(nx - 14, -200, 28, FY + 200);
      } });
  }
  if (!PAINTED) { const n = 'room6-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR6())); }
  return {
    // 6 THE CELLAR, drawn on the house's shell (build 427): very dark; a thin shaft from the grating; the man in the iron cage, the bars drawn over him
    r6: PAINTED ? null : {
      pic: 'room6-drawn', shell: 1, FY: HOUSE.FY, tone: [120, 110, 100], k: 1, noShadow: 1,
      light(x) { return { x: R6.LAND, a: .12, col: [200, 200, 210] }; },
      enter() { this.shk = 0; this.motes = Array.from({ length: 26 }, () => ({ q: rnd(), o: rnd() * 7, s: .6 + rnd() * 1.4 })); pic('room6-caged'); },
      run() { talk([[C, 'Now let me go on my way.'], [I, 'Stay, till I have shown you a little more.'], [TIP, 'Touch the cage.', 'cage']], () => { creak(); this.shk = .6; H.ph = 'cage'; H.t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if ((G.act === 'cage' || G.act === 'cage2') && (sx == null || near(sx, sy, 1950, 900, 240))) next(true); },
      upd() {
        if ((G.act === 'cage' || G.act === 'cage2') && G.actT >= 70 && !G.ring) G.ring = ring(1950, 900);
        if (H.ph === 'cage' && H.t === 90) talk([[C, 'What are you?'], [MAN, 'I am what I was not once.'], [MAN, 'I am now a man of despair, shut up in it as in this iron cage. I cannot get out. Oh, now I cannot!'], [C, 'How did you come to this?'], [MAN, 'I left off to watch and be sober. I hardened my heart, so that I cannot repent.'], [TIP, 'Touch the cage again.', 'cage2']], () => { creak(); this.shk = 1; H.ph = 'nohope'; H.t = 0; G.state = 'auto'; });
        if (H.ph === 'nohope' && H.t === 60) talk([[I, 'Is there no hope, but you must be kept in this iron cage?'], [MAN, 'No, none at all.'], [I, 'Why, the Son of God is full of pity.'], [MAN, 'Oh, eternity, eternity!'], [C, 'This is fearful! God help me to watch and be sober, and to pray.']], () => goTo('r7'));
        this.shk *= .985;
        // a drip now and then, its ring on the stone floor
        if (rnd() < .004 && audio()) tone(1700 + rnd() * 300, 'sine', .01, .3, 0, 6000);
      },
      under(c) {
        const [x0, y0, x1] = R6.CAGE, FY = this.FY, dx = Math.sin(G.t * 2.3) * 6 * this.shk;
        // the shaft of grey light from the grating, falling to the floor short of the cage (soft, painted as a few faint layers), dust turning in it
        const [gx, gy] = R6.GR, L = R6.LAND; c.save(); c.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 5; k++) { const w0 = 50 + k * 22, w1 = 120 + k * 60; c.fillStyle = 'rgba(120,124,134,' + (.035 - k * .005).toFixed(3) + ')'; c.beginPath(); c.moveTo(u(gx - w0), v(gy + 40)); c.lineTo(u(gx + w0), v(gy + 40)); c.lineTo(u(L + w1), v(FY)); c.lineTo(u(L - w1), v(FY)); c.closePath(); c.fill(); }
        for (const m of this.motes) { const q = (m.q + G.t / 4000) % 1, mx = gx + (L - gx) * q + 40 * Math.sin(G.t / 90 + m.o), my = gy + 40 + (FY - gy - 40) * q; c.fillStyle = 'rgba(200,200,210,' + (.25 * Math.sin(q * Math.PI)).toFixed(3) + ')'; c.beginPath(); c.arc(u(mx), v(my), m.s, 0, 6.2832); c.fill(); }
        c.restore();
        // the man on a stool, head bowed, hands folded (his own figure, toned dark, build 442)
        if (pics['room6-caged']) fig(c, 'room6-caged', { ax: 153, g: 535, s: .8, ct: 1, mul: 1, sat: 1, noSh: 1 }, 1950, FY, -1, 1, 1, [255, 242, 228]);
        // the iron cage over him: a frame and bars, the bars' left edges barely caught by the faint light; it shakes when touched
        c.save(); c.translate(dx * S, 0); c.fillStyle = '#0b0908';
        c.fillRect(u(x0 - 10), v(y0 - 14), (x1 - x0 + 20) * S, 22 * S); c.fillRect(u(x0 - 10), v(FY - 18), (x1 - x0 + 20) * S, 20 * S);
        for (let x = x0; x <= x1; x += 55) { c.fillStyle = '#0b0908'; c.fillRect(u(x - 5), v(y0), 10 * S, (FY - y0) * S); c.fillStyle = 'rgba(120,104,80,.3)'; c.fillRect(u(x - 5), v(y0), Math.max(.6, 2 * S), (FY - y0) * S); }
        c.restore();
      },
      people(c) { visitor(c, 'C', 860, 1); visitor(c, 'I', 1160, 1); },
      over(c) { darkWith(c, [[u(R6.LAND), v(1100), 300, .5], [u(1950), v(900), 320, .35]], .35); },
    },
    // 6, the old painted cellar (kept: ?painted shows it)
    r6p: {
      pic: 'room6', FY: 1250, cam0: 244, tone: [255, 236, 214],
      enter() {},
      run() { talk([[C, 'Now let me go on my way.'], [I, 'Stay, till I have shown you a little more.'], [TIP, 'Touch the cage.', 'cage']], () => { creak(); this.shk = .6; H.ph = 'cage'; H.t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if ((G.act === 'cage' || G.act === 'cage2') && (sx == null || near(sx, sy, 1946, 900, 220))) next(true); },
      upd() {
        if ((G.act === 'cage' || G.act === 'cage2') && G.actT >= 70 && !G.ring) G.ring = ring(1946, 900);
        if (H.ph === 'cage' && H.t === 90) talk([[C, 'What are you?'], [MAN, 'I am what I was not once.'], [MAN, 'I am now a man of despair, shut up in it as in this iron cage. I cannot get out. Oh, now I cannot!'], [C, 'How did you come to this?'], [MAN, 'I left off to watch and be sober. I hardened my heart, so that I cannot repent.'], [TIP, 'Touch the cage again.', 'cage2']], () => { creak(); this.shk = 1; H.ph = 'nohope'; H.t = 0; G.state = 'auto'; });
        if (H.ph === 'nohope' && H.t === 60) talk([[I, 'Is there no hope, but you must be kept in this iron cage?'], [MAN, 'No, none at all.'], [I, 'Why, the Son of God is full of pity.'], [MAN, 'Oh, eternity, eternity!'], [C, 'This is fearful! God help me to watch and be sober, and to pray.']], () => goTo('r7'));
      },
      people(c) { visitor(c, 'I', 2880, -1); visitor(c, 'C', 3170, -1); },
      under(c) {
        glow(c, u(332), v(392), 180, [255, 200, 110], .14 + .03 * Math.sin(G.t / 50));
        // the cage rattles when it is touched: that part of the picture laid again a hair off, back and forth
        this.shk = (this.shk || 0) * .985; const im = pics.room6;
        if (im && this.shk > .02) { const k = im.width / H.R.PW, x0 = 1590, y0 = 300, w = 720, h = 980, dx = Math.sin(G.t * 2.3) * 1.4 * this.shk;
          c.save(); c.beginPath(); c.rect(u(x0), v(y0), w * S, h * S); c.clip(); c.drawImage(im, x0 * k, y0 * k, w * k, h * k, u(x0) + dx, v(y0), w * S, h * S); c.restore(); }
      },
    },
  };
});
