// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE (book {70} to {92}). Loaded by index.html after hill.js and run by the same engine
// (talk, voices, the tray). Everything of its own is inside RM.
//
// BUILD 258 (owner: "Let's build these into game ... continue through all seven rooms"): the whole house, in the book's
// order: the door at night (knock) -> 1 the picture of the grave person (the candle) -> 2 the dusty parlour (the broom,
// the jug) -> 3 Passion and Patience (the bag) -> 4 the fire fed with oil (go round the wall) -> 5 the palace and the
// brave man (the writer's book) -> [6 the man in the iron cage, 7 the man who dreamed of judgment: the darker rooms,
// only when "Shew the darker rooms" is marked on the contents page] -> leaving by the door (hold to go on).
// The wicket-gate (book {60} to {69}) is not here yet: the other Level 4 chat has it.
//
// Every room is ONE still picture, painted by the image model in the game's watercolour after its master (concept
// notes in CLAUDE.md, "THE INTERPRETER'S HOUSE IN THE GAME"), quietened in code: assets/room-door.webp, room1..7.webp
// (room3.webp is cut narrower). The people who belong to a room are in its picture; Christian and the Interpreter are
// the game's watercolour figures coloured in the house's palette (room3-christian.webp; the Interpreter's own two pictures,
// room-interpreter.webp standing and room-interpreter-say.webp explaining), placed in each room, breathing in code. Everything that moves is code:
// light, dust, water, gold, bubbles, fire, the brave man, the dreamer's trembling. 
//
// Picture units: a picture's own pixels (P, 3168 x 1344 at full size) are laid at S units each; the camera's left edge is
// cam.x units into the picture; each room's floor line (FY, in P) is laid at 440 so feet stand above the words; below
// the picture its last rows are stretched down as more floor.
// ============================================================
const RM = (() => {
  const I = 'The Interpreter', MAN = 'The man in the cage', DRM = 'The trembling man', BR = 'The brave man', VO = 'Voices from the palace';
  const S = .38, K = .8, PH = 1344, FLOOR = 440;
  const pics = {}, loads = {};
  const pic = n => loads[n] || (loads[n] = loadImg(n + '.webp').then(im => { pics[n] = im; return im; }));
  const darkOn = () => { try { return localStorage.getItem('pp-dark') === '1'; } catch (e) { return false; } };

  // the two visitors (sprites face LEFT as made; face 1 = turned to face right)
  const VIS = { C: { n: 'room3-christian', ax: 150, g: 624, who: 'Christian', ph: 0 }, I: { n: 'room-interpreter', ax: 86, g: 611, who: I, ph: 1.7, say: { n: 'room-interpreter-say', ax: 153, g: 611 } } };
  const BRAVE = { plain: { n: 'room5-brave', ax: 65, g: 519 }, armed: { n: 'room5-brave-armed', ax: 163, g: 519 } };

  let R = null, t = 0, ph = '', cam = { x: 0, to: 0 }, fade = 1, fadeTo = 0, after = null, toned = {}, startId = 'door', motes = [];
  const u = x => x * S - cam.x, v = y => y * S - (R.FY * S - FLOOR);
  const hold = () => keys.push || keys.r || downs.size > 0;
  const rnd = Math.random;

  // ---------- sound (made in the browser) ----------
  function noise(f, q, dur, vol, when = 0) {
    if (!audio() || !NOISE) return; const t0 = AC.currentTime + when, s = AC.createBufferSource(), b = AC.createBiquadFilter(), g = AC.createGain();
    s.buffer = NOISE; b.type = 'bandpass'; b.frequency.value = f; b.Q.value = q; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + .01); g.gain.exponentialRampToValueAtTime(.0005, t0 + dur);
    s.connect(b); b.connect(g); g.connect(CLEAR); s.start(t0, rnd() * 2); s.stop(t0 + dur + .05);
  }
  function tone(f, type, vol, dur, when = 0, lp = 1800) {
    if (!audio()) return; const t0 = AC.currentTime + when, o = AC.createOscillator(), b = AC.createBiquadFilter(), g = AC.createGain();
    o.type = type; o.frequency.value = f; b.type = 'lowpass'; b.frequency.value = lp; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + .08); g.gain.setValueAtTime(vol, t0 + dur * .7); g.gain.exponentialRampToValueAtTime(.0005, t0 + dur);
    o.connect(b); b.connect(g); g.connect(CLEAR); if (ECHO) g.connect(ECHO); o.start(t0); o.stop(t0 + dur + .05);
  }
  const knockS = () => { noise(160, 2, .22, .5); noise(420, 3, .08, .25); };
  const clash = () => { noise(3200, 6, .35, .16); tone(1567, 'triangle', .03, .5, 0, 5000); tone(2093, 'triangle', .02, .4, .01, 6000); };
  const cough = when => { noise(700, 1.2, .25, .22, when); noise(500, 1.2, .2, .16, when + .3); };
  const creak = () => { tone(70, 'sawtooth', .05, 1.6, 0, 300); noise(900, 8, 1.2, .05); };
  const thunder = () => { noise(80, .7, 3.2, .5); noise(160, .8, 1.6, .25, .1); };
  const trumpet = () => { [[60, 0], [67, .55], [72, 1.1], [72, 1.7]].forEach(([m, w]) => tone(hz(m), 'sawtooth', .045, w < 1.6 ? .7 : 2.2, w, 1400)); };
  const scratch = () => { for (let i = 0; i < 6; i++) noise(5200 + rnd() * 1500, 4, .08, .06, i * .11 + rnd() * .04); };

  // ---------- figures ----------
  // each figure picture, coloured for the room it stands in (baked once per room: no canvas is touched while playing)
  function toneOf(n, col) {
    const key = n + '|' + col.join(','); if (toned[key]) return toned[key];
    const im = pics[n]; if (!im) return null;
    const cv2 = document.createElement('canvas'); cv2.width = im.width; cv2.height = im.height; const x = cv2.getContext('2d');
    x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, im.width, im.height), p = d.data, sat = R && R.sat != null ? R.sat : .6;
    let m = 0, cnt = 0; for (let i = 0; i < p.length; i += 4) if (p[i + 3] > 128) { m += (p[i] + p[i + 1] + p[i + 2]) / 3; cnt++; } m /= cnt || 1;
    for (let i = 0; i < p.length; i += 4) { const l = (p[i] + p[i + 1] + p[i + 2]) / 3; for (let k = 0; k < 3; k++) { let c = l + (p[i + k] - l) * sat; c = m + (c - m) * 1.2; p[i + k] = Math.max(0, Math.min(255, c * col[k] / 255)); } }
    x.putImageData(d, 0, 0);
    return toned[key] = cv2;
  }
  function fig(c, spec, meta, x, y, face, k = 1, a = 1, col = R.tone || [255, 255, 255], who = null, ph0 = 0, bob = 0) {
    const im = toneOf(spec, col); if (!im || a <= .01) return;
    const sc = S / K * k, fx = u(x), fy = v(y), mv = who && talkMove(who);
    const sy = (1 + .006 * Math.sin(G.t / 62 + ph0)) * (mv ? mv.sy : 1);
    c.globalAlpha = a * .8; c.fillStyle = 'rgba(12,6,3,.32)'; c.beginPath(); c.ellipse(fx + 6 * face, fy - 1, 120 * sc, 12 * sc, 0, 0, 6.2832); c.fill();
    c.globalAlpha = a; c.save(); c.translate(fx, fy - bob); if (mv) c.transform(1, 0, -mv.sh * -face, 1, 0, 0); c.scale(-face, sy);
    c.drawImage(im, -meta.ax * sc, -meta.g * sc, im.width * sc, im.height * sc); c.restore(); c.globalAlpha = 1;
  }
  // the Interpreter lifts his open hand while he speaks (his second picture), and folds his hands again after
  let sayK = 0;
  const speaking = () => (SPK && SPK.who === I) || (G.state === 'dialog' && dWho.textContent === I);
  const visitor = (c, key, x, face, k = R.k || 1, a = 1, up = 0) => {
    const m = VIS[key];
    if (m.say && pics[m.say.n]) { const q = smooth(0, 1, sayK); if (q < 1) fig(c, m.n, m, x, R.FY - up, face, k, a * (1 - q), R.tone, m.who, m.ph); if (q > 0) fig(c, m.say.n, m.say, x, R.FY - up, face, k, a * q, R.tone, m.who, m.ph); return; }
    fig(c, m.n, m, x, R.FY - up, face, k, a, R.tone, m.who, m.ph);
  };
  // Christian walking (leaving): the game's own walk pictures, dark against the night
  const WALKT = new Map();
  function walker(c, x, frame, k) {
    const src = CHR[frame]; if (!src) { visitor(c, 'C', x, 1, k); return; }
    let im = WALKT.get(src); if (!im) { im = document.createElement('canvas'); im.width = src.width; im.height = src.height; const q = im.getContext('2d'); q.drawImage(src, 0, 0); const d = q.getImageData(0, 0, im.width, im.height), p = d.data, col = [62, 54, 56]; for (let i = 0; i < p.length; i += 4) for (let j = 0; j < 3; j++) p[i + j] = p[i + j] * col[j] / 255; q.putImageData(d, 0, 0); WALKT.set(src, im); }
    const sc = (790 * k * S) / 300, walkC = im;
    const fx = u(x), fy = v(R.FY);
    c.fillStyle = 'rgba(8,6,6,.35)'; c.beginPath(); c.ellipse(fx, fy - 1, 34, 4, 0, 0, 6.2832); c.fill();
    c.drawImage(walkC, fx - CHR_META.ax * sc, fy - CHR_META.ground * sc, im.width * sc, im.height * sc);
  }

  // ---------- the rooms ----------
  // a soft round light, laid on with 'lighter'
  function glow(c, x, y, r, col, a) { if (a <= .003) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, css(col, a)); g.addColorStop(.4, css(col, a * .35)); g.addColorStop(1, css(col, 0)); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.globalCompositeOperation = 'source-over'; }
  function darkWith(c, holes, a) {
    // the whole picture darkened except soft holes of light ([x, y, r] in screen units)
    if (a <= .003) return; const o = tintBuf(); const q = o.getContext('2d'); q.setTransform(DPR, 0, 0, DPR, 0, 0); q.globalCompositeOperation = 'source-over';
    q.clearRect(0, 0, VW, VH); q.fillStyle = css([10, 6, 4], a); q.fillRect(0, 0, VW, VH); q.globalCompositeOperation = 'destination-out';
    for (const [x, y, r, s = 1] of holes) { const g = q.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,' + s + ')'); g.addColorStop(.55, 'rgba(0,0,0,' + (s * .6) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = g; q.fillRect(x - r, y - r, 2 * r, 2 * r); }
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(o, 0, 0); c.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  let TB = null; const tintBuf = () => { if (!TB) TB = document.createElement('canvas'); if (TB.width !== ctx.canvas.width || TB.height !== ctx.canvas.height) { TB.width = ctx.canvas.width; TB.height = ctx.canvas.height; } return TB; };
  const ring = (x, y) => () => [u(x), v(y)];
  const near = (sx, sy, x, y, r) => Math.hypot(sx - u(x), sy - v(y)) < r;

  // THE DOOR, at night (after Rembrandt's Rest on the Flight into Egypt): he knocks; the door opens on the light within
  const DOOR = { x: 2308, top: 690, bot: 1196, w: 288 };
  function doorLight(c, d, inside) {
    if (d <= .003) return; const x0 = u(DOOR.x - DOOR.w / 2), x1 = u(DOOR.x + DOOR.w / 2), y0 = v(DOOR.top), y1 = v(DOOR.bot), r = (x1 - x0) / 2;
    c.save(); c.beginPath(); c.moveTo(x0, y1); c.lineTo(x0, y0 + r); c.arc(x0 + r, y0 + r, r, Math.PI, 0); c.lineTo(x1, y1); c.closePath(); c.clip();
    const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, css([255, 200, 120], .82 * d)); g.addColorStop(1, css([255, 170, 90], .95 * d)); c.fillStyle = g; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    if (inside) inside(); c.restore();
    // the light lies out flat on the path before the door
    c.save(); c.translate((x0 + x1) / 2, y1 + 2); c.scale(1, .1); glow(c, 0, 0, 220, [255, 170, 90], .5 * d); c.restore();
    glow(c, (x0 + x1) / 2, (y0 + y1) / 2, 200, [255, 180, 100], .18 * d);
  }
  const ROOMS = {
    door: {
      pic: 'room-door', FY: 1200, cam0: 210, tone: [100, 94, 112], k: .58,
      enter() { this.d = 0; this.kn = 0; this.ia = 0; },
      run() { talk([[N, 'Then he went on till he came to the house of the Interpreter, and knocked over and over.'], [TIP, 'Knock on the door.', 'knock']], () => { ph = 'open'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if (G.act === 'knock' && (sx == null || near(sx, sy, DOOR.x, 950, 150))) { knockS(); if (++this.kn >= 3) next(true); } },
      upd() {
        if (G.act === 'knock' && G.actT >= 90 && !G.ring) G.ring = ring(DOOR.x, 950);
        if (ph === 'open') { this.d = Math.min(1, this.d + .012); if (t > 50) this.ia = Math.min(1, this.ia + .02); if (t === 1 && audio()) { tone(98, 'sine', .05, 2.2); noise(300, 3, 1.4, .05); }
          if (t === 150) talk([[C, 'Sir, the man at the gate said that if I called here, you would show me excellent things, to help me on my journey.'], [I, 'Come in. I will show you what will help you.']], () => goTo('r1')); }
      },
      under(c) { const self = this; doorLight(c, this.d, () => { if (self.ia > .01) visitor(c, 'I', DOOR.x, -1, .58, self.ia); }); glow(c, u(2832), v(380), 120, [255, 190, 110], .1 + .03 * Math.sin(G.t / 40)); glow(c, u(470), v(1000), 70, [255, 160, 80], .2 + .08 * Math.sin(G.t / 7) * Math.sin(G.t / 13)); },
      people(c) { visitor(c, 'C', 1880, 1, .58); },
    },
    // 1 THE PICTURE (after Rembrandt's Apostle Paul): the room dark but for the servant's taper; he lights the candle
    r1: {
      pic: 'room1', FY: 1262, cam0: 244, tone: [205, 185, 165], k: 1.06,
      enter() { this.lit = 0; },
      run() { talk([[TIP, 'Touch the candle.', 'candle']], () => { ph = 'light'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if (G.act === 'candle' && (sx == null || near(sx, sy, 1478, 760, 150))) { next(true); if (audio()) { noise(2500, 2, .4, .06); note(72, .03, 2); } } },
      upd() {
        if (G.act === 'candle' && G.actT >= 70 && !G.ring) G.ring = ring(1478, 760);
        if (ph === 'light') { this.lit = Math.min(1, this.lit + .0075); if (t === 160) talk([[C, 'What does this mean?'], [I, 'His eyes are lifted up to heaven, the best of books is in his hand, and the world is behind his back. A crown of gold hangs over his head.'], [I, 'He is the only man the Lord has sent to be your guide in hard places. Take good heed, lest you meet some who pretend to lead you right, but their way goes down to death.']], () => goTo('r2')); }
      },
      people(c) { visitor(c, 'I', 2330, -1); visitor(c, 'C', 2720, -1); },
      over(c) {
        const L = smooth(0, 1, this.lit), fl = 1 + .05 * Math.sin(G.t / 5) * Math.sin(G.t / 11);
        darkWith(c, [[u(1720), v(926), 70 + 40 * L, .9], [u(1478), v(716), (60 + 1100 * L) * fl, Math.min(1, L * 3)]], .9 - .62 * L);
        glow(c, u(1720), v(926), 26, [255, 200, 120], .5 * (1 - L) + .1);
        if (L > .01) { glow(c, u(1478), v(716), 60 * fl, [255, 210, 140], .45 * L); glow(c, u(815), v(302), 40 + 6 * Math.sin(G.t / 30), [255, 220, 120], .25 * smooth(.5, 1, this.lit)); }
      },
    },
    // 2 THE DUSTY PARLOUR (after Vermeer's Milkmaid): the broom raises the dust; the water lays it
    r2: {
      pic: 'room2', FY: 1262, cam0: 140, tone: [300, 288, 268],
      enter() { this.dust = []; this.haze = .22; this.wet = []; const r = rngR(5); for (let i = 0; i < 70; i++) this.dust.push({ x: 300 + r() * 2800, y: 300 + r() * 900, vx: 0, vy: 0, s: 2 + r() * 5, a: .5 + r() * .5, p: r() * 7 }); },
      run() { talk([[N, 'He led him into a very large parlour, full of dust, because it was never swept.'], [TIP, 'Touch the broom.', 'broom']], () => { ph = 'sweep'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) {
        if (G.act === 'broom' && (sx == null || near(sx, sy, 2390, 1180, 160))) next(true);
        if (G.act === 'jug' && (sx == null || near(sx, sy, 1900, 860, 160))) next(true);
      },
      upd() {
        if (G.act === 'broom' && G.actT >= 70 && !G.ring) G.ring = ring(2390, 1200);
        if (G.act === 'jug' && G.actT >= 70 && !G.ring) G.ring = ring(1900, 840);
        if (ph === 'sweep') {
          if (t < 160 && t % 2 === 0) for (let k = 0; k < 6; k++) this.dust.push({ x: 2390 + (rnd() - .5) * 120, y: 1240 - rnd() * 40, vx: -1 - rnd() * 6, vy: -.6 - rnd() * 2.2, s: 2 + rnd() * 6, a: .6 + rnd() * .4, p: rnd() * 7, life: 0 });
          if (t % 18 === 0 && t < 140) noise(1800, .8, .3, .06);
          this.haze = Math.min(.55, this.haze + .003);
          if (t === 120) cough(0); if (t === 200) cough(0);
          if (t === 270) talk([[I, 'Bring the water, and sprinkle the room.'], [TIP, 'Touch the jug.', 'jug']], () => { ph = 'sprinkle'; t = 0; G.state = 'auto'; });
        }
        if (ph === 'sprinkle') {
          if (t < 220 && t % 3 === 0) for (let k = 0; k < 2; k++) this.wet.push({ x: 1910 + rnd() * 30, y: 850, vx: (rnd() - .5) * 1.2, vy: -rnd() * 1.5, l: 0 });
          if (t % 24 === 0 && t < 220) noise(6000, 1, .4, .025);
          this.haze = Math.max(0, this.haze - .0028);
          for (const d of this.dust) { d.vy += .03; d.vx *= .96; }
          if (t === 280) talk([[C, 'What does this mean?'], [I, 'This parlour is the heart of a man. The dust is his sin. He who swept first is the Law: it stirs the dust up, but cannot make the heart clean.'], [I, 'She who brought the water is the Gospel. By it the heart is made clean, fit for the King of glory to live in.']], () => goTo('r3'));
        }
        for (const d of this.dust) { d.life = (d.life || 0) + 1; d.dr = d.dr || (.95 + rnd() * .04); d.vx *= d.dr; if (d.life > 120) d.a *= .99; if (Math.abs(d.x - 1900) < 160 && d.y < 1000) d.a *= .97; if (d.y < 1000) d.vy = Math.max(d.vy, 0); d.x += d.vx + Math.sin(G.t / 60 + d.p) * .4; d.y += d.vy; d.vx *= .985; d.vy = d.vy * .985 + (ph === 'sprinkle' ? .05 : -.004); if (ph === 'sprinkle' && d.y > 1240) d.a *= .9; }
        this.dust = this.dust.filter(d => d.a > .03 && d.y < 1400);
        for (const w of this.wet) { w.vy += .35; w.x += w.vx; w.y += w.vy; w.l++; }
        this.wet = this.wet.filter(w => w.y < 1260);
      },
      people(c) { visitor(c, 'I', 560, 1); visitor(c, 'C', 1290, 1); },
      over(c) {
        c.fillStyle = css([170, 150, 120], this.haze * .75); c.fillRect(0, 0, VW, VH);
        for (const d of this.dust) { const a = Math.min(1, d.a * (.45 + this.haze)); const r = d.s * S * 3; const g = c.createRadialGradient(u(d.x), v(d.y), 0, u(d.x), v(d.y), r); g.addColorStop(0, css([206, 188, 160], a * .7)); g.addColorStop(1, css([196, 178, 150], 0)); c.fillStyle = g; c.fillRect(u(d.x) - r, v(d.y) - r, 2 * r, 2 * r); }
        c.fillStyle = 'rgba(200,215,225,.5)'; for (const w of this.wet) c.fillRect(u(w.x), v(w.y), 1.2, 2.4);
      },
    },
    // 3 PASSION AND PATIENCE (after Chardin's Soap Bubbles): the bag, the gold, the bubbles, the rags
    r3: {
      pic: 'room3', FY: 1250, PW: 2566, cam0: 8, tone: [255, 255, 255],
      enter() {
        this.bag = { show: false, a: 0, tip: 0, empty: 0 }; this.coins = []; this.bubbles = []; this.great = null; this.rags = 0; pic('room3-rags');
      },
      run() {
        const self = this;
        talk([[N, 'In a little room sat two little children. The name of the eldest was Passion, and of the other, Patience.'], [C, 'Why is Passion so discontented?'], [I, 'He must wait for his best things till next year, but he will have all now. Patience is willing to wait.'], [N, 'Then one came to Passion, and brought him a bag of treasure.', null, () => { self.bag.show = true; }], [TIP, 'Touch the bag.', 'bag']], () => { ph = 'pour'; t = 0; G.state = 'auto'; if (audio()) note(79, .03, 1.6); });
      },
      act(sx, sy) { if (G.act === 'bag' && (sx == null || near(sx, sy, 1325, 1210, 160))) next(true); },
      upd() {
        const B = { x: 1325, y: 1240 }, HP = { x: 1150, y: 1246 }, bag = this.bag;
        if (bag.show) bag.a = Math.min(1, bag.a + .02);
        if (G.act === 'bag' && G.actT >= 70 && !G.ring) G.ring = ring(B.x, B.y - 30);
        if (ph === 'pour') {
          bag.tip = Math.min(1, bag.tip + .035);
          if (bag.tip > .6 && t < 120 && t % 2 === 0) for (let k = 0; k < 2; k++) this.coins.push({ x: B.x - 37, y: B.y - 21, vx: -1.6 - rnd() * 6.3, vy: -1.6 - rnd() * 3.7, rest: HP.y - 16 + rnd() * 26, on: false, rot: rnd() * 6, sp: (rnd() - .5) * .5, gl: rnd() * 300, gone: 0, a: 1 });
          for (const o of this.coins) if (!o.on) { o.vy += .58; o.x += o.vx; o.y += o.vy; o.rot += o.sp; if (o.y >= o.rest) { if (o.vy > 3.7) { o.vy *= -.28; o.vx *= .5; o.y = o.rest; if (rnd() < .35) note(94 + Math.floor(rnd() * 9), .012, .35, 0, false); } else { o.on = true; o.y = o.rest; } } }
          bag.empty = smooth(20, 130, t);
          if (t > 260) { ph = 'glad'; t = 0; }
        }
        if (ph === 'glad' && t > 70) { ph = 'gone'; t = 0; bag.show = false; this.coins.forEach((o, i) => { o.at = 20 + i * 3 + rnd() * 40; }); }
        if (ph === 'gone') {
          for (const o of this.coins) if (!o.gone && t > o.at) { o.gone = 1; if (this.coins.indexOf(o) % 2) continue; this.bubbles.push({ x: o.x, y: o.y - 8, r: 0, R: 10 + rnd() * 12, vx: (rnd() - .5) * 1.3, vy: -.9 - rnd() * 1.45, life: 0, L: 130 + rnd() * 170, ph: rnd() * 7, pop: 0 }); }
          for (const o of this.coins) if (o.gone) o.a = Math.max(0, o.a - .05);
          if (t === 260) this.great = { x: HP.x + 50, y: HP.y - 26, r: 0, R: 68, life: 0, L: 320, pop: 0 };
          bag.a = Math.max(0, bag.a - (t > 150 ? .006 : 0));
          if (t > 200) this.rags = Math.min(1, this.rags + .0075);
          if (this.great && this.great.pop > 0 && this.rags >= 1 && t > 560) { ph = 'after'; t = 0; talk([[I, 'So are the men of this world: they must have all their good things now.'], [C, 'Then it is best to wait for things to come.'], [I, 'You say the truth. For the things which are seen are temporal; but the things which are not seen are eternal.']], () => goTo('r4')); }
        }
        for (const b of this.bubbles) { b.life++; b.r = Math.min(b.R, b.r + .66); b.x += b.vx + Math.sin(b.life / 30 + b.ph) * .66; b.y += b.vy; if (b.life > b.L && !b.pop) { b.pop = 1; if (rnd() < .4) note(98 + Math.floor(rnd() * 6), .006, .25, 0, false); } if (b.pop) b.pop++; }
        this.bubbles = this.bubbles.filter(b => b.pop < 14);
        const g = this.great; if (g) { g.life++; g.r = Math.min(g.R, g.r + .47); if (!g.pop) { g.y -= 1.45 * smooth(0, 60, g.life); g.x += Math.sin(g.life / 70) * .8; if (g.life > g.L) { g.pop = 1; note(91, .02, 1.4); } } else g.pop++; }
      },
      under(c) { if (this.rags > 0 && pics['room3-rags']) { c.globalAlpha = smooth(0, 1, this.rags); c.drawImage(pics['room3-rags'], u(720), v(580), 790 * S, 754 * S); c.globalAlpha = 1; } },
      people(c) { visitor(c, 'I', 2385, -1, .8, 1, 35); visitor(c, 'C', 2240, -1, .8, 1, 35); },
      over(c) { drawBag(c, this.bag); drawCoins(c, this.coins); for (const b of this.bubbles) bubble(c, u(b.x), v(b.y), b.r * S, b.pop); if (this.great) bubble(c, u(this.great.x), v(this.great.y), this.great.r * S, this.great.pop); },
    },
    // 4 THE FIRE FED WITH OIL (after La Tour's St Joseph the Carpenter): round the back of the wall
    r4: {
      pic: 'room4', FY: 1240, cam0: 0, tone: [185, 130, 105],
      enter() { this.rv = 0; this.steam = []; this.oil = []; },
      run() { talk([[N, 'A fire burned against a wall, and one stood by it, always casting water upon it. Yet the fire burned higher and hotter.'], [I, 'This fire is the work of grace in the heart. He who casts water on it is the Devil. Come, and see why it burns on.'], [TIP, 'Hold to go round the back of the wall.', 'round']], () => {}); },
      act() {},
      upd() {
        if (G.act === 'round') { if (G.actT >= 60 && !hold() && !G.ring) G.ring = ring(2172, 1000); if (hold()) { G.ring = null; this.rv = Math.min(1, this.rv + .0055); } if (this.rv >= 1) { next(true); G.state = 'auto'; ph = 'saw'; t = 0; } }
        cam.to = this.rv * (R.PW * S - VW);
        if (ph === 'saw' && t === 60) talk([[I, 'This is Christ, who with the oil of his grace keeps the work going in the heart. He stands behind the wall, for it is hard for the tempted to see it.']], () => goTo('r5'));
        if (G.t % 5 === 0) this.steam.push({ x: 1760 + rnd() * 80, y: 800 + rnd() * 60, vy: -.8 - rnd(), a: .5, s: 20 + rnd() * 30 });
        for (const s of this.steam) { s.y += s.vy; s.x -= .3; s.a *= .985; s.s += .5; }
        this.steam = this.steam.filter(s => s.a > .03);
        if (this.rv > .3 && G.t % 7 === 0) this.oil.push({ x: 2217, y: 880, vy: 1 });
        for (const o of this.oil) { o.vy += .3; o.y += o.vy; o.x -= .4; }
        this.oil = this.oil.filter(o => o.y < 1080);
      },
      people(c) { const q = smooth(0, .5, this.rv), r = smooth(.6, 1, this.rv); visitor(c, 'I', 260, 1, 1, 1 - q); visitor(c, 'C', 560, 1, 1, 1 - q); if (r > 0) { visitor(c, 'I', 2780, -1, 1, r); visitor(c, 'C', 3000, -1, 1, r); } },
      over(c) {
        const f = .75 + .15 * Math.sin(G.t / 4.3) * Math.sin(G.t / 9.1) + .1 * Math.sin(G.t / 2.1);
        glow(c, u(1810), v(1000), 260 * f, [255, 140, 60], .32 * f); glow(c, u(1810), v(1080), 90, [255, 220, 140], .25 * f);
        for (const s of this.steam) { const g = c.createRadialGradient(u(s.x), v(s.y), 0, u(s.x), v(s.y), s.s * S); g.addColorStop(0, css([220, 210, 205], s.a * .35)); g.addColorStop(1, css([220, 210, 205], 0)); c.fillStyle = g; c.fillRect(u(s.x) - s.s * S, v(s.y) - s.s * S, 2 * s.s * S, 2 * s.s * S); }
        // the dark behind the wall, lifting as they go round
        const hx = u(2168), hide = 1 - smooth(0, .8, this.rv);
        if (hide > .01) { const g = c.createLinearGradient(hx - 20, 0, hx + 60, 0); g.addColorStop(0, 'rgba(8,4,3,0)'); g.addColorStop(1, css([8, 4, 3], hide)); c.fillStyle = g; c.fillRect(hx - 20, 0, VW - hx + 40, VH); }
        if (this.rv > .3) { c.fillStyle = css([255, 200, 90], .9); for (const o of this.oil) { c.beginPath(); c.arc(u(o.x), v(o.y), 1.3, 0, 6.2832); c.fill(); } glow(c, u(2190), v(1090), 60 * f, [255, 170, 80], .3 * smooth(.3, 1, this.rv)); }
      },
    },
    // 5 THE PALACE AND THE BRAVE MAN (after Rembrandt's Night Watch)
    r5: {
      pic: 'room5', FY: 1262, cam0: 0, tone: [225, 205, 180], k: .58, sat: .45,
      enter() { this.bv = { a: 0, arm: 0, x: 1650, go: 0, face: -1, done: 0 }; this.gold = 0; this.spark = []; this.said = 0; pic('room5-brave'); pic('room5-brave-armed'); },
      run() { const self = this; talk([[C, 'May we go in there?'], [N, 'At the door stood many men who wished to go in, but dared not, for men in armour kept it.', null, () => { self.bv.show = 1; }], [BR, 'Set down my name, Sir.'], [TIP, 'Touch the book.', 'book']], () => { ph = 'write'; t = 0; G.state = 'auto'; scratch(); }); },
      act(sx, sy) { if (G.act === 'book' && (sx == null || near(sx, sy, 1508, 1040, 150))) next(true); if (G.act === 'gold' && (sx == null || sy < v(520))) next(true); },
      upd() {
        const b = this.bv;
        if (b.show) b.a = Math.min(1, b.a + .03);
        if (G.act === 'book' && G.actT >= 70 && !G.ring) G.ring = ring(1508, 1030); if (G.act === 'gold' && G.actT >= 70 && !G.ring) G.ring = ring(2300, 330);
        cam.to = smooth(1500, 2500, b.x) * (R.PW * S - VW) * .45;
        if (ph === 'write' && t === 70) { ph = 'arm'; t = 0; noise(2000, 3, .4, .08); }
        if (ph === 'arm') { b.arm = Math.min(1, b.arm + .03); if (b.arm > .5) b.face = 1; if (t === 50) { ph = 'fight'; t = 0; talk([[N, 'He drew his sword, put a helmet on his head, cut his way through them all, and pressed on into the palace.']], () => { this.said = 1; }); } }
        if (ph === 'fight') {
          const x0 = b.x; b.x = Math.min(2490, b.x + 2.2);
          for (const gx of [1900, 2110, 2280, 2470]) if (x0 < gx && b.x >= gx) { clash(); for (let i = 0; i < 5; i++) this.spark.push({ x: gx + 60, y: 880 + rnd() * 120, vx: 2 + rnd() * 6, vy: -rnd() * 5, l: 18 }); }
          if (b.x >= 2490) { b.show = 0; b.a = Math.max(0, b.a - .02); if (b.a <= 0 && this.said) { ph = 'won'; t = 0; } }
        }
        if (ph === 'won' && t === 20) talk([[TIP, 'Touch the people on the top of the palace.', 'gold'], [VO, 'Come in, come in; Eternal glory thou shalt win.', null, () => { this.gold = 1; tone(hz(76), 'sine', .03, 3); tone(hz(79), 'sine', .025, 3, .2); tone(hz(84), 'sine', .02, 3, .4); }], [C, 'I think I know the meaning of this.']], () => goTo(darkOn() ? 'r6' : 'leave'));
        for (const s of this.spark) { s.x += s.vx; s.y += s.vy; s.vy += .3; s.l--; }
        this.spark = this.spark.filter(s => s.l > 0);
      },
      people(c) {
        visitor(c, 'I', 230, 1, .58); visitor(c, 'C', 450, 1, .58);
        const b = this.bv; if (b.a > .01) {
          const bob = ph === 'fight' && b.x < 2490 ? Math.abs(Math.sin(G.t / 7)) * 3 : 0;
          if (b.arm < 1) fig(c, BRAVE.plain.n, BRAVE.plain, b.x, R.FY, b.face, .68, b.a * (1 - b.arm), [150, 125, 100], BR, 2.3, bob);
          if (b.arm > 0) fig(c, BRAVE.armed.n, BRAVE.armed, b.x, R.FY, 1, .68, b.a * b.arm, [150, 125, 100], BR, 2.3, bob);
        }
      },
      under(c) { glow(c, u(2490), v(1000), 140, [255, 210, 130], .16 + .05 * Math.sin(G.t / 30) + .25 * this.gold); for (let x = 1600; x <= 2900; x += 260) glow(c, u(x), v(180), 90, [255, 214, 120], (.1 + .05 * Math.sin(G.t / 25 + x)) * (1 + 2.5 * this.gold)); },
      over(c) { c.strokeStyle = 'rgba(255,170,80,.75)'; c.lineWidth = 1.2; for (const s of this.spark) { c.beginPath(); c.moveTo(u(s.x), v(s.y)); c.lineTo(u(s.x - s.vx * 1.6), v(s.y - s.vy * 1.6)); c.stroke(); } if (ph === 'write' || ph === 'arm') glow(c, u(1508), v(1040), 40, [255, 230, 160], .3 * Math.sin(Math.min(1, t / 60) * Math.PI)); },
    },
    // 6 THE MAN IN THE IRON CAGE (after Rembrandt's Philosopher in Meditation): a darker room
    r6: {
      pic: 'room6', FY: 1250, cam0: 244, tone: [255, 236, 214],
      enter() {},
      run() { talk([[C, 'Now let me go on my way.'], [I, 'Stay, till I have shown you a little more.'], [TIP, 'Touch the cage.', 'cage']], () => { creak(); this.shk = .6; ph = 'cage'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if ((G.act === 'cage' || G.act === 'cage2') && (sx == null || near(sx, sy, 1946, 900, 220))) next(true); },
      upd() {
        if ((G.act === 'cage' || G.act === 'cage2') && G.actT >= 70 && !G.ring) G.ring = ring(1946, 900);
        if (ph === 'cage' && t === 90) talk([[C, 'What are you?'], [MAN, 'I am what I was not once.'], [MAN, 'I am now a man of despair, shut up in it as in this iron cage. I cannot get out. Oh, now I cannot!'], [C, 'How did you come to this?'], [MAN, 'I left off to watch and be sober. I hardened my heart, so that I cannot repent.'], [TIP, 'Touch the cage again.', 'cage2']], () => { creak(); this.shk = 1; ph = 'nohope'; t = 0; G.state = 'auto'; });
        if (ph === 'nohope' && t === 60) talk([[I, 'Is there no hope, but you must be kept in this iron cage?'], [MAN, 'No, none at all.'], [I, 'Why, the Son of God is full of pity.'], [MAN, 'Oh, eternity, eternity!'], [C, 'This is fearful! God help me to watch and be sober, and to pray.']], () => goTo('r7'));
      },
      people(c) { visitor(c, 'I', 2560, -1); visitor(c, 'C', 2900, -1); },
      under(c) {
        glow(c, u(332), v(392), 180, [255, 200, 110], .14 + .03 * Math.sin(G.t / 50));
        // the cage rattles when it is touched: that part of the picture laid again a hair off, back and forth
        this.shk = (this.shk || 0) * .985; const im = pics.room6;
        if (im && this.shk > .02) { const k = im.width / R.PW, x0 = 1590, y0 = 300, w = 720, h = 980, dx = Math.sin(G.t * 2.3) * 1.4 * this.shk;
          c.save(); c.beginPath(); c.rect(u(x0), v(y0), w * S, h * S); c.clip(); c.drawImage(im, x0 * k, y0 * k, w * k, h * k, u(x0) + dx, v(y0), w * S, h * S); c.restore(); }
      },
    },
    // 7 THE DREAM OF JUDGMENT (after Rembrandt's Belshazzar's Feast): a darker room
    r7: {
      pic: 'room7', FY: 1240, cam0: 120, tone: [235, 215, 200],
      enter() { this.blk = 0; this.fl = 0; this.lt = .3; this.sh = .35; },
      run() { talk([[C, 'Why does this man tremble so?'], [TIP, 'Touch the man.', 'man']], () => { ph = 'tell'; t = 0; G.state = 'auto'; this.sh = 1; }); },
      act(sx, sy) { if (G.act === 'man' && (sx == null || near(sx, sy, 905, 860, 220))) next(true); },
      upd() {
        if (G.act === 'man' && G.actT >= 70 && !G.ring) G.ring = ring(905, 820);
        const self = this;
        if (ph === 'tell' && t === 30) talk([[DRM, 'This night I dreamed. The heavens grew black, it thundered, and I heard the great sound of a trumpet.', null, () => { self.blk = 1; setTimeout(() => { self.fl = 1; thunder(); }, 900); setTimeout(trumpet, 2600); }], [DRM, 'I saw a man sit upon a cloud, and heard a voice: ‘Arise, ye dead, and come to judgement.’', null, () => { self.lt = 1.6; }], [DRM, 'I saw many caught up into the clouds, but I was left behind. I was not ready.', null, () => { self.lt = .15; self.blk = .4; }]], () => goTo('leave'));
        this.cur = (this.cur || 0) + ((this.blk || 0) - (this.cur || 0)) * .02; this.fl *= .9; this.lv = (this.lv || .3) + (this.lt - (this.lv || .3)) * .015;
      },
      people(c) { visitor(c, 'I', 2330, -1); visitor(c, 'C', 2600, -1); },
      under(c) {
        // the man trembles: the part of the picture round him is laid again a hair off, back and forth
        const im = pics.room7; if (im) { const a = this.sh * (.6 + .4 * Math.sin(G.t / 9)), dx = Math.sin(G.t * 1.9) * .9 * a, dy = Math.sin(G.t * 2.7) * .5 * a, k = im.width / R.PW, x0 = 560, y0 = 440, w = 640, h = 820;
          c.save(); c.beginPath(); c.ellipse(u(x0 + w / 2), v(y0 + h / 2), w * S / 2, h * S / 2, 0, 0, 6.2832); c.clip(); c.drawImage(im, x0 * k, y0 * k, w * k, h * k, u(x0) + dx, v(y0) + dy, w * S, h * S); c.restore(); }
        glow(c, u(2202), v(422), 160 * this.lv, [255, 236, 170], .35 * this.lv);
      },
      over(c) { if (this.cur > .01) darkWith(c, [[u(905), v(820), 150, .55], [u(2202), v(422), 120 * this.lv, Math.min(1, this.lv)]], .85 * this.cur);
        if (this.lv > .5) { c.save(); c.translate(u(2202), v(560)); c.scale(1, 1.8); glow(c, 0, 0, 150 * (this.lv - .3), [255, 240, 190], .3 * (this.lv - .5)); c.restore(); }
        if (this.fl > .02) { const g = c.createLinearGradient(0, 0, 0, VH * .6); g.addColorStop(0, css([230, 230, 255], .25 * this.fl)); g.addColorStop(1, css([230, 230, 255], 0)); c.fillStyle = g; c.fillRect(0, 0, VW, VH * .6); } },
    },
    // LEAVING by the door (book {91}, {92}): he goes on his way
    leave: {
      pic: 'room-door', FY: 1200, cam0: 210, tone: [100, 94, 112], k: .58,
      enter() { this.x = 1880; this.w = 0; this.fr = 0; this.a = 1; },
      run() { talk([[I, 'Have you thought on all these things?'], [C, 'Yes, and they put me in hope and fear.'], [I, 'The Comforter be always with you, good Christian, to guide you in the way that leads to the City.'], [N, 'The highway was fenced on either side with a wall, and that wall was called Salvation.'], [TIP, 'Hold to go on your way.', 'walkout']], () => {}); },
      act() {},
      upd() {
        if (G.act === 'walkout') { if (G.actT >= 60 && !hold() && !G.ring) G.ring = () => [u(this.x + 160), v(1000)]; if (hold()) { G.ring = null; this.w = Math.min(1, this.w + .05); } else this.w = Math.max(0, this.w - .05); }
        if (this.w > 0) { this.fr += .3 * this.w; this.x += CHR_META.vpx * .3 * this.w * (790 * .58 * S / 300) / S; }
        cam.to = Math.min(R.PW * S - VW, Math.max(R.cam0, u(this.x) + cam.x - 500));
        if (this.x > 2780) { this.a = Math.max(0, this.a - .02); if (G.act === 'walkout') { next(true); G.state = 'auto'; } }
        if (this.a <= 0 && ph !== 'end') { ph = 'end'; t = 0; }
        if (ph === 'end' && t === 40) finish();
      },
      under(c) { doorLight(c, 1, () => visitor(c, 'I', DOOR.x, -1, .58)); },
      people(c) { c.globalAlpha = this.a; if (this.w > 0 || this.fr > 0) walker(c, this.x, Math.floor(this.fr) % Math.max(1, CHR.length), .58); else visitor(c, 'C', this.x, 1, .58); c.globalAlpha = 1; },
    },
  };
  const ORDER = ['door', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'leave'];
  function rngR(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  // ---------- Room 3's things ----------
  function drawBag(c, bag) {
    if (bag.a <= .01) return;
    const k = smooth(0, 1, bag.tip), e = bag.empty;
    c.save(); c.globalAlpha = bag.a; c.translate(u(1325) + 12, v(1240)); c.rotate(-1.35 * k); c.translate(-12, 0); c.scale(1 - .38 * e, 1 - .12 * e);
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
      const tw = Math.sin(G.t / 9 + o.gl) * Math.sin(G.t / 23 + o.gl * 1.7), gl = Math.max(0, tw - .55) * (ph === 'glad' ? 2.2 : 1.2) + (o.gone ? (1 - o.a) * .8 : 0);
      if (gl > .02) { const r = 2 + 5 * gl, gg = c.createRadialGradient(x - 1, y - 1, 0, x - 1, y - 1, r); gg.addColorStop(0, 'rgba(255,246,214,' + (.9 * Math.min(1, gl)).toFixed(3) + ')'); gg.addColorStop(1, 'rgba(255,230,160,0)'); c.fillStyle = gg; c.fillRect(x - 1 - r, y - 1 - r, 2 * r, 2 * r); }
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

  // ---------- moving between rooms ----------
  function enterRoom(id) {
    R = ROOMS[id]; R.id = id; R.PW = R.PW || 3168; ph = 'in'; t = 0; cam.x = cam.to = R.cam0;
    G.act = null; G.ring = null; G.actT = 0; downs.clear(); keys.r = keys.push = false;
    R.enter && R.enter();
    const r = rngR(31); motes = Array.from({ length: 16 }, () => ({ x: r() * VW, y: 60 + r() * 330, s: .5 + r() * 1.1, p: r() * 7, v: .03 + r() * .06 }));
    const nx = ORDER[ORDER.indexOf(id) + 1]; if (nx) pic(ROOMS[nx].pic);
  }
  function goTo(id) {
    if (id === 'r6' && !darkOn()) id = 'leave';
    after = id; fadeTo = 1; G.state = 'auto';
    if (audio()) { noise(220, 1.5, .25, .08, .2); noise(220, 1.5, .25, .07, .75); }
  }
  function start(id) {
    id = id && ROOMS[id] ? id : 'door'; startId = id;
    RM.on = true; SL.on = SL.show = false; HL.on = HL.show = false;
    document.getElementById('title').style.display = 'none';
    document.getElementById('endc').className = 'card';
    document.body.classList.add('playing', 'slough'); G.opening = null; hush();
    Object.assign(G, { t: 0, capQ: [], cap: 0, hint: null, act: null, actT: 0, ring: null, auto: null, guard: 0, autoT: 0, taps: [], roll: { t: 999, x: 0, y: 0 }, ended: false, calm: 0 });
    downs.clear(); keys.r = keys.push = false; toned = {};
    if (audio()) { AC.resume(); if (rainG) rainG.gain.setTargetAtTime(0, AC.currentTime, .8); }
    G.state = 'wait'; fade = 1; fadeTo = 0; after = null;
    pic(VIS.I.say.n); const need = [ROOMS[id].pic, VIS.C.n, VIS.I.n].concat(id === 'r3' ? ['room3-rags'] : []).concat(id === 'r5' ? [BRAVE.plain.n, BRAVE.armed.n] : []);
    Promise.all(need.map(pic)).then(() => { enterRoom(id); setTimeout(() => { if (RM.on && G.state === 'wait' && R && R.id === id) { ph = 'run'; R.run(); } }, 1200); });
  }
  function preload() { pic(ROOMS.door.pic); pic(VIS.C.n); pic(VIS.I.n); pic(VIS.I.say.n); }

  function touch(sx, sy) { if (R && G.act && R.act) { const a = G.act; R.act(sx, sy); if (G.act === a && !G.ring) G.actT = Math.max(G.actT, 95); } }
  function key() { if (R && G.act && R.act) R.act(null, null); }

  function update() {
    G.t++; t++;
    if (G.act) G.actT++;
    if (fadeTo === 1) { fade = Math.min(1, fade + .03); if (fade >= 1 && after) { const id = after; after = null; Promise.all([pic(ROOMS[id].pic)]).then(() => { enterRoom(id); fadeTo = 0; setTimeout(() => { if (RM.on && R && R.id === id) { ph = 'run'; R.run(); } }, 700); }); } }
    else fade = Math.max(0, fade - .025);
    if (!R) return;
    cam.x += (cam.to - cam.x) * .03;
    for (const m of motes) { m.x += m.v; m.y += Math.sin(G.t / 90 + m.p) * .05; if (m.x > VW) m.x = 0; }
    sayK = Math.max(0, Math.min(1, sayK + (speaking() ? .12 : -.08)));
    R.upd && R.upd();
  }
  function finish() {
    G.state = 'end'; G.ended = false;
    const e = document.getElementById('endc');
    e.querySelector('h1').textContent = 'The Interpreter’s House';
    e.querySelectorAll('p')[0].textContent = 'He went on his way, and the highway was fenced on either side with a wall called Salvation.';
    e.querySelectorAll('p')[1].textContent = 'Next: the Cross (not yet built)';
    document.getElementById('on2').style.display = 'none';
  }

  function draw() {
    const c = ctx; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.fillStyle = '#140c08'; c.fillRect(0, 0, VW, VH);
    const im = R && pics[R.pic];
    if (im) {
      const w = R.PW * S, h = PH * S, x0 = u(0), y0 = v(0), bot = y0 + h;
      c.drawImage(im, x0, y0, w, h);
      if (bot < VH) { const hh = 60 * im.height / PH; c.save(); c.translate(0, 2 * bot); c.scale(1, -1); c.drawImage(im, 0, im.height - hh, im.width, hh, x0, bot - 60 * S, w, 60 * S); c.restore(); const g = c.createLinearGradient(0, bot - 10, 0, VH); g.addColorStop(0, 'rgba(14,8,5,.15)'); g.addColorStop(1, 'rgba(14,8,5,.9)'); c.fillStyle = g; c.fillRect(0, bot - 10, VW, VH - bot + 10); }
      if (y0 > 0) { c.fillStyle = '#140c08'; c.fillRect(0, 0, VW, y0 + .5); }
      R.under && R.under(c);
      R.people && R.people(c);
      R.over && R.over(c);
      if (R.id !== 'door' && R.id !== 'leave' && R.id !== 'r2') for (const m of motes) { const a = .08 * (.5 + .5 * Math.sin(G.t / 50 + m.p)); c.fillStyle = 'rgba(255,236,200,' + a.toFixed(3) + ')'; c.beginPath(); c.arc(m.x, m.y, m.s, 0, 6.2832); c.fill(); }
    }
    { const g = c.createRadialGradient(VW * .5, VH * .5, VH * .45, VW * .5, VH * .5, VW * .75); g.addColorStop(0, 'rgba(14,8,5,0)'); g.addColorStop(1, 'rgba(14,8,5,.4)'); c.fillStyle = g; c.fillRect(0, 0, VW, VH); }
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2; for (const q0 of [0, .5]) { const q = (G.t / 80 + q0) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, 14 + q * 40, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    if (fade > .003) { c.fillStyle = css([10, 6, 4], smooth(0, 1, fade)); c.fillRect(0, 0, VW, VH); }
    drawItems();
  }

  const HOLDS = ['round', 'walkout'];
  const lines = []; // for the voice tool: every room's lines are written out in full above
  return { on: false, start, update, draw, touch, key, preload, HOLDS, darkOn, setDark: on => { try { localStorage.setItem('pp-dark', on ? '1' : '0'); } catch (e) {} }, lines,
    peek: () => ({ room: R && R.id, ph, t, cam: Math.round(cam.x), fade: +fade.toFixed(2), r3: R && R.id === 'r3' ? { coins: R.coins.length, rags: +R.rags.toFixed(2) } : null }) };
})();
