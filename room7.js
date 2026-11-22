// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: ROOM 7, THE MAN WHO DREAMED OF JUDGMENT, a darker room (book {89} to {90}).
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/room6-7.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { DRM, HOUSE, PAINTED, S, bakeShell, darkWith, fig, glow, goTo, loads, near, pic, pics, ring, rnd, thunder, trumpet, u, v, visitor } = H;
  const R7 = { BED: [200, 331, 1450, 1281], MAN: [960, 840], WALL: [1600, 2500], GOLD: [2050, 420] };
  // ROOM 7, THE BEDCHAMBER UPSTAIRS (build 427; the book {89}: "a chamber, where there was one rising out of bed"): wine-brown plaster, the
  // bed on the left (a dark crop of the old painting stands in for the man and his bed), the bare wall in the middle the dream's stage, lit
  // only by light (after Belshazzar's Feast: the light on the wall, no hand, no writing); the door to the stair on the right.
  function drawBed7(c, FY) {
    // a four-poster in the dark: a canopy, wine curtains drawn back and gathered at the posts, a dark coverlet thrown back (soft shapes, one quiet tone each)
    const x0 = 180, x1 = 760, top = 400, bed = 970, fill = (col, f) => { c.fillStyle = col; c.beginPath(); f(); c.fill(); };
    fill('#160909', () => { c.moveTo(u(x0 - 40), v(top - 50)); c.lineTo(u(x1 + 40), v(top - 50)); c.lineTo(u(x1 + 30), v(top + 20)); c.quadraticCurveTo(u((x0 + x1) / 2), v(top + 60), u(x0 - 30), v(top + 20)); });
    fill('#140a08', () => { c.moveTo(u(x0 + 6), v(bed - 150)); c.quadraticCurveTo(u(x0 + 60), v(bed - 220), u(x0 + 150), v(bed - 170)); c.lineTo(u(x0 + 150), v(bed + 20)); c.lineTo(u(x0 + 6), v(bed + 20)); });
    fill('#3a2a26', () => { c.ellipse(u(x0 + 110), v(bed - 30), 80 * S, 30 * S, -.12, 0, 6.2832); });
    fill('#2e1210', () => { c.moveTo(u(x0 + 10), v(bed + 4)); c.quadraticCurveTo(u(x0 + 200), v(bed - 46), u(x0 + 330), v(bed - 6)); c.quadraticCurveTo(u(x0 + 420), v(bed + 26), u(x1 - 10), v(bed - 10)); c.lineTo(u(x1 + 6), v(bed + 150)); c.quadraticCurveTo(u((x0 + x1) / 2), v(bed + 175), u(x0 + 4), v(bed + 150)); });
    fill('#3c1a16', () => { c.moveTo(u(x0 + 330), v(bed - 6)); c.quadraticCurveTo(u(x0 + 400), v(bed - 40), u(x0 + 470), v(bed - 20)); c.quadraticCurveTo(u(x0 + 420), v(bed + 26), u(x0 + 330), v(bed - 6)); });
    fill('#0f0706', () => { c.rect(u(x0 + 10), v(bed + 150), (x1 - x0 - 10) * S, (FY - bed - 150) * S); });
    fill('#0e0605', () => { for (const x of [x0, x1]) c.rect(u(x - 13), v(top - 50), 26 * S, (FY - top + 50) * S); });
    for (const [x, d] of [[x0, 1], [x1, -1]]) fill('#1c0b0a', () => { c.moveTo(u(x), v(top + 10)); c.quadraticCurveTo(u(x + d * 120), v(top + 200), u(x + d * 30), v(top + 380)); c.quadraticCurveTo(u(x + d * 70), v(FY - 300), u(x + d * 50), v(FY - 10)); c.lineTo(u(x + d * 8), v(FY - 10)); c.lineTo(u(x + d * 8), v(top + 10)); });
  }
  function bakeR7() {
    return bakeShell({ seed: 77, doors: 'R', roof: 'rafters', ceil: 120, wallC: '#24140f', floorC: '#1d120b',
      lights: [{ x: 2050, y: 820, r: 1100, lit: [70, 44, 34], half: [40, 24, 18], a: .7 }, { x: 760, y: 900, r: 800, lit: [64, 40, 30], half: [36, 22, 16], a: .6 }] });
  }
  if (!PAINTED) { const n = 'room7-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR7())); }
  return {
    // 7 THE BEDCHAMBER, drawn on the house's shell (build 427): the dream told in light on the bare wall
    r7: PAINTED ? null : {
      pic: 'room7-drawn', shell: 1, FY: HOUSE.FY, tone: [130, 110, 100], k: 1, noShadow: 1,
      enter() { this.blk = 0; this.fl = 0; this.lt = .2; this.lv = .2; this.sh = .35; this.cur = 0; this.up = []; this.upOn = 0; this.left = 0;
        this.clouds = Array.from({ length: 30 }, (_, i) => ({ x: 1500 + rnd() * 1100, y: 380 + rnd() * 400, r: 90 + rnd() * 160, v: (i % 2 ? 1 : -1) * (.15 + rnd() * .25) })); pic('room7-rising'); },
      run() { talk([[C, 'Why does this man tremble so?'], [TIP, 'Touch the man.', 'man']], () => { H.ph = 'tell'; H.t = 0; G.state = 'auto'; this.sh = 1; }); },
      act(sx, sy) { if (G.act === 'man' && (sx == null || near(sx, sy, R7.MAN[0], R7.MAN[1], 240))) next(true); },
      upd() {
        if (G.act === 'man' && G.actT >= 70 && !G.ring) G.ring = ring(R7.MAN[0], R7.MAN[1]);
        const self = this;
        if (H.ph === 'tell' && H.t === 30) talk([[DRM, 'This night I dreamed. The heavens grew black, it thundered, and I heard the great sound of a trumpet.', null, () => { self.blk = 1; self.lt = 0; self.thT = 54; self.trT = 156; }], [DRM, 'I saw a man sit upon a cloud, and heard a voice: \u2018Arise, ye dead, and come to judgement.\u2019', null, () => { self.lt = 1.6; }], [DRM, 'I saw many caught up into the clouds, but I was left behind. I was not ready.', null, () => { self.upOn = 1; self.left = 1; }]], () => { self.lt = .15; self.blk = .3; goTo('leave'); });
        // thunder and the trumpet on the game's own clock (they wait while paused)
        if (this.thT > 0 && --this.thT === 0) { this.fl = 1; thunder(); }
        if (this.trT > 0 && --this.trT === 0) trumpet();
        if (this.blk > .5 && rnd() < .006) this.fl = Math.max(this.fl, .6);
        this.cur += (this.blk - this.cur) * .02; this.fl *= .9; this.lv += (this.lt - this.lv) * .015;
        for (const cl of this.clouds) { cl.x += cl.v; if (cl.x < 1250) cl.x = 2850; if (cl.x > 2850) cl.x = 1250; }
        if (this.upOn && this.up.length < 14 && rnd() < .08) this.up.push({ x: 1650 + rnd() * 800, y: 1150, v: .9 + rnd() * .8, a: 0 });
        for (const q of this.up) { q.y -= q.v; q.x += (R7.GOLD[0] - q.x) * .004; q.a = Math.min(1, q.a + .02) * (q.y < 520 ? .97 : 1); }
        this.up = this.up.filter(q => q.a > .02);
      },
      under(c) {
        // the bed he has risen from, drawn in code (a four-poster in the dark, its curtains drawn back), and the man beside it pulling on his coat, trembling
        drawBed7(c, this.FY);
        { const a = this.sh * (.6 + .4 * Math.sin(G.t / 9)), dx = Math.sin(G.t * 1.9) * 1.2 * a / S, dy = Math.sin(G.t * 2.7) * .6 * a / S;
          if (pics['room7-rising']) fig(c, 'room7-rising', { ax: 167, g: 773, s: .8, ct: 1, mul: 1, sat: 1, noSh: 1 }, 960 + dx, this.FY + dy, -1, 1, 1, [175, 160, 150]); }
        // THE DREAM ON THE WALL: black sky, two layers of cloud sliding against each other, lightning inside them, one gold light, the lights rising
        const k = this.cur, [w0, w1] = R7.WALL; if (k < .01 && this.lv < .3) return;
        const cx = (w0 + w1) / 2, cy = 640, RX = 820, RY = 430;
        c.save(); c.translate(u(cx), v(cy)); c.scale(1, RY / RX); const g = c.createRadialGradient(0, 0, 0, 0, 0, RX * S); g.addColorStop(0, css([8, 7, 14], .92 * k)); g.addColorStop(.6, css([8, 7, 14], .8 * k)); g.addColorStop(1, 'rgba(8,7,14,0)'); c.fillStyle = g; c.fillRect(-RX * S, -RX * S, 2 * RX * S, 2 * RX * S); c.restore();
        for (const cl of this.clouds) { const e = Math.hypot((cl.x - cx) / RX, (cl.y - cy) / RY), fade = Math.max(0, Math.min(1, (1 - e) / .35)); if (fade <= 0) continue; const gg = c.createRadialGradient(u(cl.x), v(cl.y), 0, u(cl.x), v(cl.y), cl.r * S); const lit = this.fl * .5 + .12 * this.lv; gg.addColorStop(0, css([40 + 160 * lit, 38 + 160 * lit, 52 + 170 * lit], .55 * k * fade)); gg.addColorStop(1, 'rgba(20,18,30,0)'); c.fillStyle = gg; c.fillRect(u(cl.x - cl.r), v(cl.y - cl.r), 2 * cl.r * S, 2 * cl.r * S); }
        // the one gold light high on the wall (the man upon a cloud), and the lights caught up into it; one stays low by the man and fades
        if (this.lv > .05) { glow(c, u(R7.GOLD[0]), v(R7.GOLD[1]), 260 * this.lv * S / .38 * .38, [255, 214, 140], .4 * Math.min(1, this.lv)); glow(c, u(R7.GOLD[0]), v(R7.GOLD[1]), 60, [255, 240, 200], .5 * Math.min(1, this.lv)); }
        for (const q of this.up) glow(c, u(q.x), v(q.y), 22, [230, 236, 255], .6 * q.a);
        if (this.left) { this.left = Math.max(0, this.left - .002); glow(c, u(1150), v(1050), 26, [200, 206, 230], .5 * this.left); }
      },
      people(c) { visitor(c, 'I', 2620, -1); visitor(c, 'C', 2880, -1); },
      over(c) { if (this.fl > .02) { c.save(); c.translate(u(2050), v(520)); c.scale(1, .5); glow(c, 0, 0, 900 * S, [210, 214, 255], .22 * this.fl); c.restore(); }
        if (this.cur > .01) darkWith(c, [[u(R7.MAN[0]), v(R7.MAN[1]), 260, .6], [u(R7.GOLD[0]), v(R7.GOLD[1]), 300 * Math.max(.3, this.lv), .7]], .55 * this.cur); },
    },
    // 7, the old painted bedchamber (kept: ?painted shows it)
    r7p: {
      pic: 'room7', FY: 1240, cam0: 185, tone: [235, 215, 200],
      enter() { this.blk = 0; this.fl = 0; this.lt = .3; this.sh = .35; },
      run() { talk([[C, 'Why does this man tremble so?'], [TIP, 'Touch the man.', 'man']], () => { H.ph = 'tell'; H.t = 0; G.state = 'auto'; this.sh = 1; }); },
      act(sx, sy) { if (G.act === 'man' && (sx == null || near(sx, sy, 905, 860, 220))) next(true); },
      upd() {
        if (G.act === 'man' && G.actT >= 70 && !G.ring) G.ring = ring(905, 820);
        const self = this;
        if (H.ph === 'tell' && H.t === 30) talk([[DRM, 'This night I dreamed. The heavens grew black, it thundered, and I heard the great sound of a trumpet.', null, () => { self.blk = 1; self.lt = 0; setTimeout(() => { self.fl = 1; thunder(); }, 900); setTimeout(trumpet, 2600); }], [DRM, 'I saw a man sit upon a cloud, and heard a voice: ‘Arise, ye dead, and come to judgement.’', null, () => { self.lt = 1.6; }], [DRM, 'I saw many caught up into the clouds, but I was left behind. I was not ready.', null, () => { self.lt = .15; self.blk = .4; }]], () => goTo('leave'));
        this.cur = (this.cur || 0) + ((this.blk || 0) - (this.cur || 0)) * .02; this.fl *= .9; this.lv = (this.lv || .3) + (this.lt - (this.lv || .3)) * .015;
      },
      people(c) { visitor(c, 'I', 2640, -1, 1.22); visitor(c, 'C', 2900, -1, 1.22); },
      under(c) {
        // the man trembles: the part of the picture round him is laid again a hair off, back and forth
        const im = pics.room7; if (im) { const a = this.sh * (.6 + .4 * Math.sin(G.t / 9)), dx = Math.sin(G.t * 1.9) * .9 * a, dy = Math.sin(G.t * 2.7) * .5 * a, k = im.width / H.R.PW, x0 = 560, y0 = 440, w = 640, h = 820;
          c.save(); c.beginPath(); c.ellipse(u(x0 + w / 2), v(y0 + h / 2), w * S / 2, h * S / 2, 0, 0, 6.2832); c.clip(); c.drawImage(im, x0 * k, y0 * k, w * k, h * k, u(x0) + dx, v(y0) + dy, w * S, h * S); c.restore(); }
        glow(c, u(2202), v(422), 160 * this.lv, [255, 236, 170], .35 * this.lv);
      },
      over(c) { if (this.cur > .01) darkWith(c, [[u(905), v(820), 150, .55], [u(2200), v(395), 120 * this.lv, Math.min(1, this.lv)]], .85 * this.cur);
        if (this.lv > .5) { c.save(); c.translate(u(2200), v(520)); c.scale(1, 1.8); glow(c, 0, 0, Math.min(120, 150 * (this.lv - .3)), [255, 240, 190], .3 * (this.lv - .5)); c.restore(); }
        if (this.fl > .02) { const g = c.createLinearGradient(0, v(0), 0, v(800)); g.addColorStop(0, css([230, 230, 255], .25 * this.fl)); g.addColorStop(1, css([230, 230, 255], 0)); c.fillStyle = g; c.fillRect(u(0), v(0), 3168 * S, 800 * S); } },
    },
  };
});
