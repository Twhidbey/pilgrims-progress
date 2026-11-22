// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: ROOM 1, THE PICTURE (book {72} to {73}).
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/room1.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { EX, HOUSE, I, PAINTED, S, bakeShell, darkWith, fig, glow, goTo, loads, near, noise, pic, pics, ring, tone, u, v, visitor } = H;
  // ROOM 1, A PRIVATE ROOM ({72}): dark but for his man's taper; he lights the candle on its stand; he opens a door in the wall,
  // and there hangs the picture of the grave person, a crown of gold over his head. After Rembrandt: one candle in a great dark.
  const R1 = { CAN: [1290, 818], SERV: 1090, NICHE: [1576, 300, 2164, 1040], PIC: [1636, 360, 2104, 980], CROWN: [1899, 415] };
  function bakeR1() {
    const [nx0, ny0, nx1, ny1] = R1.NICHE;
    return bakeShell({ seed: 21, doors: 'LR', lights: [{ x: R1.CAN[0] + 120, y: 760, r: 1150, lit: [112, 78, 44], half: [58, 39, 25], sx: 1.15 }],
      wall(c) {
        // the deep recess in the wall where the picture hangs, behind its two doors (the doors are drawn live: they open)
        c.fillStyle = '#120a06'; c.fillRect(nx0 - 6, ny0 - 6, nx1 - nx0 + 12, ny1 - ny0 + 12);
        let g = c.createLinearGradient(nx0, 0, nx0 + 40, 0); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(nx0 - 6, ny0 - 6, 50, ny1 - ny0 + 12);
      },
      near(c) {
        // the candle stand: a tall turned wooden stand on three feet, one dark tone, lit a little on the side toward the room
        const [cx, cy] = R1.CAN, FY = HOUSE.FY; c.fillStyle = '#150c07';
        c.fillRect(cx - 9, cy + 18, 18, FY - cy - 40);
        for (const [y, w] of [[cy + 12, 54], [cy + 30, 30], [cy + 170, 26], [cy + 300, 30], [FY - 40, 40]]) { c.beginPath(); c.ellipse(cx, y, w / 2, 9, 0, 0, 6.2832); c.fill(); }
        c.beginPath(); c.moveTo(cx - 70, FY); c.lineTo(cx - 10, FY - 46); c.lineTo(cx + 10, FY - 46); c.lineTo(cx + 70, FY); c.lineTo(cx + 52, FY); c.lineTo(cx, FY - 26); c.lineTo(cx - 52, FY); c.closePath(); c.fill();
        c.fillStyle = 'rgba(200,140,80,.3)'; c.fillRect(cx - 27, cy + 9, 54, 2);
      } });
  }
  if (!PAINTED) { const n = 'room1-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR1())); }
  return {
    // 1 A PRIVATE ROOM, drawn in code (build 424). The book ({72}): "he commanded his man to light the candle ... and bid his man open a door;
    // the which when he had done, Christian saw the picture of a very grave person hang up against the wall". Three touches, each a story move:
    // the candle (his man lights it), the door in the wall (his man opens it), the crown (it shines as the Interpreter tells what it means).
    r1: PAINTED ? null : {
      pic: 'room1-drawn', shell: 1, FY: HOUSE.FY, tone: [150, 128, 108], toneC: [118, 100, 86], k: 1,
      light() { return { x: R1.CAN[0], a: .55 * smooth(.2, 1, this.lit) * (1 + .05 * Math.sin(G.t / 5)), col: [255, 190, 120] }; },
      enter() { this.lit = 0; this.door = 0; this.crown = 0; this.serv = 0; this.zin = 1; this.vx = 0; pic('room1-portrait2'); pic('room1-servant'); },
      run() { talk([[TIP, 'Touch the candle.', 'candle']], () => { H.ph = 'light'; H.t = 0; G.state = 'auto'; }); },
      act(sx, sy) {
        if (G.act === 'candle' && (sx == null || near(sx, sy, R1.CAN[0], R1.CAN[1], 170))) { next(true); if (audio()) { noise(2500, 2, .4, .06); note(72, .03, 2); } }
        if (G.act === 'opendoor' && (sx == null || near(sx, sy, 1870, 670, 300))) { next(true); if (audio()) { tone(140, 'sawtooth', .025, .9, 0, 400); noise(700, 6, .6, .03); } }
        if (G.act === 'crown' && (sx == null || near(sx, sy, R1.CROWN[0], R1.CROWN[1], 170))) { next(true); this.crown = 1; if (audio()) { note(88, .025, 2.4); note(95, .018, 2.4, .12); } }
      },
      upd() {
        if (G.act === 'candle' && G.actT >= 70 && !G.ring) G.ring = ring(R1.CAN[0], R1.CAN[1]);
        if (G.act === 'opendoor' && G.actT >= 70 && !G.ring) G.ring = ring(1870, 670);
        if (G.act === 'crown' && G.actT >= 70 && !G.ring) G.ring = ring(R1.CROWN[0], R1.CROWN[1]);
        if (H.ph === 'light') { this.lit = Math.min(1, this.lit + .006);
          if (H.t === 190) talk([[TIP, 'Touch the door in the wall.', 'opendoor']], () => { H.ph = 'open'; H.t = 0; G.state = 'auto'; }); }
        if (H.ph === 'open') { this.door = Math.min(1, this.door + .009); this.serv = Math.min(1, this.serv + .01);
          if (H.t === 170) talk([[C, 'What does this mean?'], [I, 'His eyes are lifted up to heaven, the best of books is in his hand, and the world is behind his back. A crown of gold hangs over his head.'], [TIP, 'Touch the crown.', 'crown']], () => { H.ph = 'crown'; H.t = 0; G.state = 'auto'; }); }
        if (H.ph === 'crown' && H.t === 70) talk([[I, 'He is the only man the Lord has sent to be your guide in hard places. Take good heed, lest you meet some who pretend to lead you right, but their way goes down to death.']], () => goTo('r2'));
        this.crown *= .995;
        // the view eases in a little on the picture once the door is open (VZ .64 -> .76, centred toward it)
        { const q = smooth(0, 1, this.door); this.zin = 1 + .3 * q; this.vx = -(R1.PIC[0] + R1.PIC[2] - 3168) / 2 * S * (VW / ((EX.x1 - EX.x0) * S)) * this.zin * q * .85; }
      },
      under(c) {
        const [px0, py0, px1, py1] = R1.PIC, [nx0, ny0, nx1, ny1] = R1.NICHE, im = pics['room1-portrait2'], L = smooth(0, 1, this.lit);
        // the picture in its frame, deep in the recess: lit from below and the side by the candle (darker toward its far edge and top)
        const q = smooth(0, 1, this.door);
        if (im) { c.drawImage(im, u(px0), v(py0), (px1 - px0) * S, (py1 - py0) * S);
          const g = c.createLinearGradient(u(px0), 0, u(px1), 0); g.addColorStop(0, 'rgba(10,6,4,0)'); g.addColorStop(1, 'rgba(10,6,4,.22)'); c.fillStyle = g; c.fillRect(u(px0), v(py0), (px1 - px0) * S, (py1 - py0) * S);
          c.save(); c.beginPath(); c.rect(u(px0), v(py0), (px1 - px0) * S, (py1 - py0) * S); c.clip(); glow(c, u(px0 + 120), v(py1 - 80), 520 * S, [255, 196, 120], .16 * q); c.restore(); }
        // the frame: a dark moulding, a lighter inner step, a worn gold line only on the candle side (left and foot)
        c.strokeStyle = '#2a1a0d'; c.lineWidth = 34 * S; c.strokeRect(u(px0 - 17), v(py0 - 17), (px1 - px0 + 34) * S, (py1 - py0 + 34) * S);
        c.strokeStyle = '#4a3018'; c.lineWidth = 10 * S; c.strokeRect(u(px0 - 5), v(py0 - 5), (px1 - px0 + 10) * S, (py1 - py0 + 10) * S);
        c.strokeStyle = 'rgba(214,160,80,.45)'; c.lineWidth = Math.max(1, 3 * S); c.beginPath(); c.moveTo(u(px0 - 1), v(py0 - 1)); c.lineTo(u(px0 - 1), v(py1 + 1)); c.lineTo(u(px1 + 1), v(py1 + 1)); c.stroke();
        // the crown shines when the child touches it, and once more as the Interpreter speaks of it
        glow(c, u(R1.CROWN[0]), v(R1.CROWN[1]), 80, [255, 214, 120], (.2 + .08 * Math.sin(G.t / 20) + .5 * this.crown) * smooth(.6, 1, this.door));
        // the two doors of the recess: oak planks with iron straps; they swing toward us on their hinges at the outer edges
        const half = (nx1 - nx0) / 2, dg = c.createLinearGradient(u(nx0), 0, u(nx1), 0); dg.addColorStop(0, '#3a2614'); dg.addColorStop(1, '#2a1a0e');
        for (const side of [-1, 1]) {
          const hx = side < 0 ? nx0 : nx1, w = half * Math.cos(q * 1.52), x0 = side < 0 ? hx : hx - w;
          if (w < 2) continue;
          c.fillStyle = q > .9 ? '#0e0805' : dg; c.fillRect(u(x0), v(ny0), w * S, (ny1 - ny0) * S);
          c.strokeStyle = 'rgba(10,6,3,.55)'; c.lineWidth = Math.max(.8, 3 * S); for (let k = 1; k < 4; k++) { const xx = x0 + w * k / 4; c.beginPath(); c.moveTo(u(xx), v(ny0)); c.lineTo(u(xx), v(ny1)); c.stroke(); }
          c.fillStyle = '#0d0805'; for (const y of [ny0 + 110, ny1 - 130]) c.fillRect(u(x0), v(y), w * S, 16 * S);
          c.fillStyle = 'rgba(0,0,0,' + (.5 * q).toFixed(3) + ')'; c.fillRect(u(x0), v(ny0), w * S, (ny1 - ny0) * S);
          // an iron ring handle on each leaf at the meeting edge
          if (q < .3) { c.strokeStyle = '#0d0805'; c.lineWidth = 5 * S; c.beginPath(); c.arc(u(side < 0 ? x0 + w - 30 : x0 + 30), v((ny0 + ny1) / 2 + 14), 14 * S, 0, 6.2832); c.stroke(); }
        }
        // the candle in its pricket: a pale stub, the flame (the taper's tiny flame before it is lit)
        const [cx, cy] = R1.CAN; c.fillStyle = '#d9cbb0'; c.fillRect(u(cx - 9), v(cy - 52), 18 * S, 52 * S);
        const fl = 1 + .08 * Math.sin(G.t / 4.7) * Math.sin(G.t / 11);
        if (L > .01) { glow(c, u(cx), v(cy - 74), 260 * S * fl, [255, 190, 110], .18 * L); glow(c, u(cx), v(cy - 74), 90 * fl * L, [255, 200, 120], .5 * L); c.fillStyle = `rgba(255,236,190,${(.95 * L).toFixed(3)})`; c.beginPath(); c.ellipse(u(cx), v(cy - 72), 7 * S * fl, 20 * S * fl, 0, 0, 6.2832); c.fill(); c.fillStyle = `rgba(255,246,220,${L.toFixed(3)})`; c.beginPath(); c.ellipse(u(cx), v(cy - 68), 3 * S, 10 * S, 0, 0, 6.2832); c.fill(); }
        if (this.lit < .02) { const [tx, ty] = this.tip || [cx - 14, cy + 6]; glow(c, u(tx), v(ty), 40, [255, 190, 110], .6); glow(c, u(tx), v(ty), 8, [255, 236, 190], .9); }
        // his man, holding up his taper; he steps back into the dark once the door is open (his own figure, toned dark, build 442)
        if (pics['room1-servant']) {
          const sx = R1.SERV + 270 * smooth(0, 1, this.serv);
          this.tip = [sx + 187, H.R.FY - 617];
          fig(c, 'room1-servant', { ax: 85, g: 780, s: .8, ct: 1, mul: 1, sat: 1, noSh: 1 }, sx, H.R.FY, -1, 1, 1, [150, 136, 124]);
        }
      },
      people(c) { visitor(c, 'C', 520, 1); visitor(c, 'I', 800, 1); },
      over(c) {
        const L = smooth(0, 1, this.lit), fl = 1 + .05 * Math.sin(G.t / 5) * Math.sin(G.t / 11), [cx, cy] = R1.CAN;
        // before the candle the room is nearly black but for the taper; as it catches, the dark lifts from the stand outward
        darkWith(c, [[u((this.tip || [cx - 14])[0]), v((this.tip || [0, cy + 6])[1]), 120, .9], [u(cx), v(cy - 60), (80 + 1500 * L) * fl * S / .38 * .38, Math.min(1, L * 2.5)]], .93 - .7 * L);
      },
    },
    // 1 THE PICTURE, the old painted room (kept: ?painted shows it)
    r1p: {
      pic: 'room1', FY: 1262, cam0: 244, tone: [205, 185, 165], k: 1.48,
      light() { return { x: 1478, a: .32 * smooth(.3, 1, this.lit) * (1 + .05 * Math.sin(G.t / 5)), col: [255, 196, 130] }; },
      enter() { this.lit = 0; },
      run() { talk([[TIP, 'Touch the candle.', 'candle']], () => { H.ph = 'light'; H.t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if (G.act === 'candle' && (sx == null || near(sx, sy, 1478, 760, 150))) { next(true); if (audio()) { noise(2500, 2, .4, .06); note(72, .03, 2); } } },
      upd() {
        if (G.act === 'candle' && G.actT >= 70 && !G.ring) G.ring = ring(1478, 760);
        if (H.ph === 'light') { this.lit = Math.min(1, this.lit + .0075); if (H.t === 160) talk([[C, 'What does this mean?'], [I, 'His eyes are lifted up to heaven, the best of books is in his hand, and the world is behind his back. A crown of gold hangs over his head.'], [I, 'He is the only man the Lord has sent to be your guide in hard places. Take good heed, lest you meet some who pretend to lead you right, but their way goes down to death.']], () => goTo('r2')); }
      },
      people(c) { visitor(c, 'I', 2490, -1); visitor(c, 'C', 2790, -1); },
      over(c) {
        const L = smooth(0, 1, this.lit), fl = 1 + .05 * Math.sin(G.t / 5) * Math.sin(G.t / 11);
        darkWith(c, [[u(1720), v(926), 70 + 40 * L, .9], [u(1478), v(716), (60 + 1100 * L) * fl, Math.min(1, L * 3)]], .9 - .62 * L);
        glow(c, u(1720), v(926), 26, [255, 200, 120], .5 * (1 - L) + .1);
        if (L > .01) { glow(c, u(1478), v(716), 60 * fl, [255, 210, 140], .45 * L); glow(c, u(815), v(302), 40 + 6 * Math.sin(G.t / 30), [255, 220, 120], .25 * smooth(.5, 1, this.lit)); }
      },
    },
  };
});
