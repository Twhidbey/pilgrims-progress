// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: ROOM 5, THE PALACE AND THE BRAVE MAN (book {82} to {83}).
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/room5.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { BR, BRAVE, EX, K, PAINTED, S, VO, WALK_FPT, clash, darkOn, fig, glow, goTo, loads, mkBake, near, noise, pic, pics, ring, rnd, rngR, scratch, sheetFrames, tone, u, v, visitor } = H;
  // ROOM 5, THE GARDEN AND THE PALACE (build 432; the book {82}: "a pleasant place ... a stately palace, beautiful to behold"; after the Night Watch):
  // the garden behind the house at night, deep blue; the house's back wall and lit back door on the left; the palace pale in the right half, its
  // door the brightest low thing, the people in gold on its top the brightest high things; the crowd one huddled dark mass; the writer at his
  // table with a small light; the armed men a dark mass by the door, their lances thin diagonals. Drawn live: the people, the lances, the lights.
  const R5 = { P0: 1520, P1: 3080, TOP: 300, DOOR: 2490, DW: 230, DH: 560 };
  function bakeR5() {
    const [cv, c] = mkBake();
    const FY = 1262, r = rngR(55);
    let g = c.createLinearGradient(0, EX.y0, 0, FY); g.addColorStop(0, '#070b14'); g.addColorStop(.7, '#16202e'); g.addColorStop(1, '#222c38'); c.fillStyle = g; c.fillRect(EX.x0, EX.y0, EX.x1 - EX.x0, EX.y1 - EX.y0);
    for (let i = 0; i < 160; i++) { c.fillStyle = `rgba(220,224,240,${(.2 + r() * .5).toFixed(2)})`; c.fillRect(EX.x0 + r() * (EX.x1 - EX.x0), EX.y0 + r() * 1300, 2.2, 2.2); }
    // far garden: a long low wall and round dark trees, one tone, softer with the haze
    c.fillStyle = '#141c24'; c.fillRect(EX.x0, FY - 260, EX.x1 - EX.x0, 260); for (let x = 300; x < 1700; x += 180 + r() * 160) { c.beginPath(); c.ellipse(x, FY - 300, 110 + r() * 80, 140 + r() * 70, 0, 0, 6.2832); c.fill(); }
    // the palace: pale stone in moonlight, a tower at its left, battlements, a few dim warm windows, the great door
    const { P0, P1, TOP, DOOR, DW, DH } = R5;
    g = c.createLinearGradient(0, TOP - 240, 0, FY); g.addColorStop(0, '#4a4842'); g.addColorStop(.5, '#3a3732'); g.addColorStop(1, '#2a2723'); c.fillStyle = g;
    c.fillRect(P0, TOP, P1 - P0, FY - TOP); c.fillRect(P0 - 30, TOP - 190, 250, 190 + 10);
    for (let x = P0; x < P1; x += 70) c.fillRect(x, TOP - 46, 42, 46); for (let x = P0 - 30; x < P0 + 220; x += 64) c.fillRect(x, TOP - 236, 38, 46);
    c.fillStyle = 'rgba(20,18,16,.35)'; c.fillRect(P0, TOP + 4, P1 - P0, 14); c.fillRect(P0 - 30, TOP - 186, 250, 10);
    { const gg = c.createRadialGradient(DOOR, FY - 200, 0, DOOR, FY - 200, 900); gg.addColorStop(0, 'rgba(255,190,110,.18)'); gg.addColorStop(1, 'rgba(255,190,110,0)'); c.save(); c.beginPath(); c.rect(P0, TOP, P1 - P0, FY - TOP); c.clip(); c.fillStyle = gg; c.fillRect(DOOR - 900, FY - 1100, 1800, 1100); c.restore(); }
    { const gg = c.createLinearGradient(P1 - 500, 0, P1, 0); gg.addColorStop(0, 'rgba(8,8,10,0)'); gg.addColorStop(1, 'rgba(8,8,10,.5)'); c.fillStyle = gg; c.fillRect(P1 - 500, TOP - 50, 500, FY - TOP + 50); }
    for (const [wx, wy] of [[P0 + 120, TOP + 160], [P0 + 520, TOP + 160], [P0 + 1300, TOP + 160], [P0 + 520, TOP + 470], [P0 + 1300, TOP + 470]]) { c.fillStyle = '#1a1612'; c.fillRect(wx - 34, wy - 70, 68, 140); c.fillStyle = 'rgba(240,190,110,.35)'; c.fillRect(wx - 24, wy - 60, 48, 120); }
    c.fillStyle = '#2a2622'; c.beginPath(); c.moveTo(DOOR - DW / 2 - 40, FY); c.lineTo(DOOR - DW / 2 - 40, FY - DH + 40); c.arc(DOOR, FY - DH + 40, DW / 2 + 40, Math.PI, 0); c.lineTo(DOOR + DW / 2 + 40, FY); c.fill();
    g = c.createLinearGradient(0, FY - DH, 0, FY); g.addColorStop(0, '#ffd98a'); g.addColorStop(1, '#f4b860'); c.fillStyle = g; c.beginPath(); c.moveTo(DOOR - DW / 2, FY); c.lineTo(DOOR - DW / 2, FY - DH + DW / 2); c.arc(DOOR, FY - DH + DW / 2, DW / 2, Math.PI, 0); c.lineTo(DOOR + DW / 2, FY); c.fill();
    // the house's back wall on the left, the lit back door they came out by
    c.fillStyle = '#1c1511'; c.fillRect(EX.x0, EX.y0, 300 - EX.x0, FY - EX.y0); c.fillStyle = '#0e0a07'; c.fillRect(126, FY - 680, 148, 680); g = c.createLinearGradient(0, FY - 660, 0, FY); g.addColorStop(0, '#8a5a30'); g.addColorStop(1, '#b07840'); c.fillStyle = g; c.fillRect(142, FY - 660, 116, 660);
    // the ground: dark grass, the door's light lying flat before it
    c.fillStyle = '#10150f'; c.fillRect(EX.x0, FY, EX.x1 - EX.x0, EX.y1 - FY);
    c.save(); c.beginPath(); c.rect(0, FY, 3168, 100); c.clip(); c.translate(DOOR, FY + 10); c.scale(1, .1); g = c.createRadialGradient(0, 0, 0, 0, 0, 900); g.addColorStop(0, 'rgba(255,200,110,.6)'); g.addColorStop(1, 'rgba(255,200,110,0)'); c.fillStyle = g; c.fillRect(-900, -900, 1800, 1800); c.restore();
    return cv;
  }
  // a standing person as a soft dark silhouette (crowd, writer, guards), height h, at x on the line y; a helmet if armed
  function sil(c, x, y, h, col, armed, lean = 0) {
    // a robed or armoured body narrowing to the shoulders, a neck, a small head (an adult is about seven heads tall)
    const sh = h * .12, hem = h * .1, hd = h * .062; c.fillStyle = col; c.beginPath(); c.moveTo(u(x - hem), v(y)); c.bezierCurveTo(u(x - hem * .9), v(y - h * .4), u(x - sh * 1.05 + lean), v(y - h * .6), u(x - sh + lean), v(y - h * .8));
    c.quadraticCurveTo(u(x - sh * .6 + lean), v(y - h * .845), u(x - hd * .55 + lean), v(y - h * .85)); c.lineTo(u(x + hd * .55 + lean), v(y - h * .85)); c.quadraticCurveTo(u(x + sh * .6 + lean), v(y - h * .845), u(x + sh + lean), v(y - h * .8));
    c.bezierCurveTo(u(x + sh * 1.05 + lean), v(y - h * .6), u(x + hem * .9), v(y - h * .4), u(x + hem), v(y)); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(u(x + lean * 1.1), v(y - h * .9), hd * .85 * S, hd * S, 0, 0, 6.2832); c.fill();
    if (armed) { c.beginPath(); c.ellipse(u(x + lean * 1.1), v(y - h * .925), hd * 1.25 * S, hd * .75 * S, 0, Math.PI, 0); c.fill(); c.fillRect(u(x + lean * 1.1 - hd * 1.6), v(y - h * .925), hd * 3.2 * S, Math.max(1, hd * .18 * S)); }
  }
  if (!PAINTED) { const n = 'room5-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR5())); }
  return {
    // 5 THE PALACE AND THE BRAVE MAN (after Rembrandt's Night Watch)
    r5: {
      pic: PAINTED ? 'room5' : 'room5-drawn', shell: PAINTED ? 0 : 1, FY: 1262, cam0: 0, tone: PAINTED ? [225, 205, 180] : [150, 140, 140], k: .58, sat: .45,
      enter() { this.bv = { a: 0, arm: 0, x: 1650, go: 0, face: -1, done: 0 }; this.gold = 0; this.spark = []; this.said = 0; this.bv.f = 0; pic('room5-brave'); pic('room5-brave-armed'); sheetFrames(BRAVE.clip); },
      run() { const self = this; talk([[C, 'May we go in there?'], [N, 'At the door stood many men who wished to go in, but dared not, for men in armour kept it.', null, () => { self.bv.show = 1; }], [BR, 'Set down my name, Sir.'], [TIP, 'Touch the book.', 'book']], () => { H.ph = 'write'; H.t = 0; G.state = 'auto'; scratch(); }); },
      act(sx, sy) { if (G.act === 'book' && (sx == null || near(sx, sy, 1508, 1040, 150))) next(true); if (G.act === 'gold' && (sx == null || sy < v(520))) next(true); },
      upd() {
        const b = this.bv;
        if (b.show) b.a = Math.min(1, b.a + .03);
        if (G.act === 'book' && G.actT >= 70 && !G.ring) G.ring = ring(1508, 1030); if (G.act === 'gold' && G.actT >= 70 && !G.ring) G.ring = ring(2050, 360);
        H.cam.to = smooth(1500, 2500, b.x) * (H.R.PW * S - VW) * (H.ph === 'won' ? .25 : .45);
        if (H.ph === 'write' && H.t === 70) { H.ph = 'arm'; H.t = 0; noise(2000, 3, .4, .08); }
        if (H.ph === 'arm' && sheetFrames(BRAVE.clip)) {
          // the clip: he turns to the palace, arms himself and strides on; the line is said as he does
          if (H.t === 1) talk([[N, 'He drew his sword, put a helmet on his head, cut his way through them all, and pressed on into the palace.']], () => { this.said = 1; });
          b.clip = 1; b.f = Math.min(BRAVE.clip.fr - 1, b.f + WALK_FPT); b.x += BRAVE.clip.vpx * .68 * BRAVE.clip.s / K * WALK_FPT * smooth(0, 8, b.f);
          if (b.f >= BRAVE.clip.fr - 1) { b.clip = 0; b.arm = 1; b.face = 1; H.ph = 'fight'; H.t = 0; }
        } else if (H.ph === 'arm') { b.arm = Math.min(1, b.arm + .03); if (b.arm > .5) b.face = 1; if (H.t === 50) { H.ph = 'fight'; H.t = 0; talk([[N, 'He drew his sword, put a helmet on his head, cut his way through them all, and pressed on into the palace.']], () => { this.said = 1; }); } }
        if (H.ph === 'fight') {
          const x0 = b.x; b.x = Math.min(2490, b.x + 2.2);
          for (const gx of [1900, 2110, 2280, 2470]) if (x0 < gx && b.x >= gx) { clash(); for (let i = 0; i < 5; i++) this.spark.push({ x: gx + 60, y: 880 + rnd() * 120, vx: 2 + rnd() * 6, vy: -rnd() * 5, l: 18 }); }
          if (b.x >= 2490) { b.show = 0; b.a = Math.max(0, b.a - .02); if (b.a <= 0 && this.said) { H.ph = 'won'; H.t = 0; } }
        }
        if (H.ph === 'won' && H.t === 20) talk([[TIP, 'Touch the people on the top of the palace.', 'gold'], [VO, 'Come in, come in; Eternal glory thou shalt win.', null, () => { this.gold = 1; if (H.AMB) H.AMB.swell = 2.4; tone(hz(76), 'sine', .03, 3); tone(hz(79), 'sine', .025, 3, .2); tone(hz(84), 'sine', .02, 3, .4); }], [C, 'I think I know the meaning of this.']], () => goTo(darkOn() ? 'r6' : 'leave'));
        for (const s of this.spark) { s.x += s.vx; s.y += s.vy; s.vy += .3; s.l--; }
        this.spark = this.spark.filter(s => s.l > 0);
      },
      people(c) {
        if (PAINTED) { visitor(c, 'I', 210, 1, .58); visitor(c, 'C', 30, 1, .58); } else { visitor(c, 'C', 380, 1, .58); visitor(c, 'I', 560, 1, .58); }
        const b = this.bv; if (b.a > .01) {
          const bob = H.ph === 'fight' && b.x < 2490 ? Math.abs(Math.sin(G.t / 7)) * 3 : 0;
          if (b.clip) { const q = BRAVE.clip; fig(c, q.n + '#' + Math.floor(b.f), q, b.x, H.R.FY, -1, .68, b.a, [150, 125, 100], BR, 2.3); }
          else if (b.arm < 1) fig(c, BRAVE.plain.n, BRAVE.plain, b.x, H.R.FY, b.face, .68, b.a * (1 - b.arm), [150, 125, 100], BR, 2.3, bob);
          else if (b.arm > 0) fig(c, BRAVE.armed.n, BRAVE.armed, b.x, H.R.FY, 1, .68, b.a * b.arm, [150, 125, 100], BR, 2.3, bob);
        }
      },
      under(c) {
        if (PAINTED) { glow(c, u(2490), v(1000), 140, [255, 210, 130], .16 + .05 * Math.sin(G.t / 30) + .25 * this.gold); for (let x = 1600; x <= 2900; x += 260) glow(c, u(x), v(180), 90, [255, 214, 120], (.1 + .05 * Math.sin(G.t / 25 + x)) * (1 + 2.5 * this.gold)); return; }
        const FY = this.FY, gk = 1 + 2 * this.gold;
        // the people in gold walking on the top of the palace: soft figures of light, pacing slowly
        for (let i = 0; i < 6; i++) { const x = R5.P0 + 120 + ((i * 260 + G.t * (.25 + .05 * i) * (i % 2 ? 1 : -1)) % 1300 + 1300) % 1300, y = R5.TOP - 40;
          c.save(); c.translate(u(x), v(y - 70)); c.scale(.42, 1); glow(c, 0, 0, 60, [255, 214, 130], .35 * gk); c.restore(); glow(c, u(x), v(y - 150), 16, [255, 232, 170], .5 * gk); }
        glow(c, u(R5.DOOR), v(FY - 220), 110, [255, 200, 120], .1 + .03 * Math.sin(G.t / 30) + .15 * this.gold);
        // the crowd who would go in but dared not: one huddled dark mass
        for (let i = 0; i < 9; i++) sil(c, 780 + i * 48 + (i % 2) * 14, FY, 430 + (i * 37 % 60), '#0b0a0d', false, (i % 3 - 1) * 6);
        // the writer at his table with his book and inkhorn, a small light
        c.fillStyle = '#0d0b0b'; c.fillRect(u(1420), v(FY - 230), 200 * S, 18 * S); c.fillRect(u(1430), v(FY - 230), 14 * S, 230 * S); c.fillRect(u(1596), v(FY - 230), 14 * S, 230 * S);
        sil(c, 1380, FY, 360, '#0d0b0b', false, 18); glow(c, u(1508), v(FY - 250), 50, [255, 220, 150], .55);
        // the armed men keeping the door: a dark mass either side of it, their lances thin dark diagonals across the light, swaying a little
        for (const [x, h] of [[2090, 470], [2200, 450], [2300, 480], [2690, 470], [2800, 455], [2900, 480]]) { sil(c, x, FY, h, '#09080a', true);
          const a = .18 * Math.sign(R5.DOOR - x) + .03 * Math.sin(G.t / 50 + x); c.strokeStyle = '#09080a'; c.lineWidth = Math.max(1, 6 * S); c.beginPath(); c.moveTo(u(x + 20), v(FY - 60)); c.lineTo(u(x + 20 + Math.sin(a) * 640), v(FY - 60 - Math.cos(a) * 640)); c.stroke(); }
      },
      over(c) { c.strokeStyle = 'rgba(255,170,80,.75)'; c.lineWidth = 1.2; for (const s of this.spark) { c.beginPath(); c.moveTo(u(s.x), v(s.y)); c.lineTo(u(s.x - s.vx * 1.6), v(s.y - s.vy * 1.6)); c.stroke(); } if (H.ph === 'write' || H.ph === 'arm') glow(c, u(1508), v(1040), 40, [255, 230, 160], .3 * Math.sin(Math.min(1, H.t / 60) * Math.PI)); },
    },
  };
});
