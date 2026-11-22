// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: OUTSIDE AND THE WAYS BETWEEN: the door at night, leaving by the door, the passages between rooms.
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/rooms-outside.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { EX, I, PAINTED, PH, ROOMS, S, SEEN_R, VIS, WALK_FPT, darkWith, finish, glow, goTo, hold, housePlan, knockS, loads, mkBake, near, noise, passKind, pic, pics, ring, rngR, tone, u, v, visitor, walkFig, walkSpeed } = H;
  // THE DOOR AND LEAVING, drawn (build 432; after Rembrandt's Rest on the Flight into Egypt): night; two layered masses of dark trees on the left
  // over still water with one tiny far fire mirrored in it; the stone house in the right half, one lit window above, the arched door (DOOR);
  // leaving, the same picture at the end of night: the low coursed wall called Salvation begins on the right and the first cold grey lies
  // along the horizon there, so Level 5 (the Cross, before dawn) follows on.
  const HSE = { X0: 1680, WIN: [2620, 300] };
  function bakeDoorScene(leaving) {
    const [cv, c] = mkBake();
    const FY = 1200, r = rngR(leaving ? 91 : 90);
    let g = c.createLinearGradient(0, EX.y0, 0, FY); g.addColorStop(0, '#05070c'); g.addColorStop(1, '#151a24'); c.fillStyle = g; c.fillRect(EX.x0, EX.y0, EX.x1 - EX.x0, EX.y1 - EX.y0);
    if (leaving) { c.save(); c.translate(EX.x1, FY); c.scale(1, .45); g = c.createRadialGradient(0, 0, 0, 0, 0, 1100); g.addColorStop(0, 'rgba(70,78,96,.75)'); g.addColorStop(.5, 'rgba(50,58,76,.3)'); g.addColorStop(1, 'rgba(40,46,60,0)'); c.fillStyle = g; c.fillRect(-1100, -1100, 2200, 1100); c.restore(); }
    for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(220,224,240,${(.15 + r() * .45).toFixed(2)})`; c.fillRect(EX.x0 + r() * 1900, EX.y0 + r() * 1300, 2, 2); }
    // the trees: a far mass, paler with the haze, and a near mass, darker, both soft lumpy crowns on short trunks
    for (const [col, base, n, rr] of [['#141821', FY - 120, 9, 170], ['#0b0d12', FY - 40, 7, 230]]) { c.fillStyle = col;
      for (let i = 0; i < n; i++) { const x = 60 + i * (1500 / n) + r() * 90, y = base - 260 - r() * 160; for (let k = 0; k < 5; k++) { c.beginPath(); c.ellipse(x + (r() - .5) * rr, y + (r() - .5) * rr * .6, rr * (.5 + r() * .4), rr * (.4 + r() * .3), 0, 0, 6.2832); c.fill(); } c.fillRect(x - 14, y, 28, base - y + 40); } }
    // still water on the left, the far fire tiny and its broken reflection beneath
    c.fillStyle = '#0e121a'; c.fillRect(EX.x0, FY - 30, 1500 - EX.x0, 60); c.fillStyle = 'rgba(255,150,70,.9)'; c.beginPath(); c.ellipse(700, FY - 40, 9, 12, 0, 0, 6.2832); c.fill();
    for (let k = 0; k < 6; k++) { c.fillStyle = `rgba(255,150,70,${(.5 - k * .07).toFixed(2)})`; c.fillRect(700 - 12 + (k % 2) * 6, FY - 24 + k * 8, 24 - k * 2, 3); }
    // the house AT THE SAME SIZE AS ITS ROOMS (owner, build 436: "House on outside should have same size as house on inside"): inside, a floor is
    // 1100 high for a man 800 tall; out here a man is .58 of that, so a floor is about 640: the ground floor's ceiling at FY - 640 (a string course),
    // the upper floor above it running off the top of the picture, and the front running on off the right, as the five ground-floor rooms
    // and the stair need; the bedchamber's window lit upstairs, the parlour's tall window below, the cellar's grating at the wall's foot
    const { X0 } = HSE, X1 = EX.x1, ST = FY - 640; c.fillStyle = '#2a231e'; c.fillRect(X0, EX.y0, X1 - X0, FY - EX.y0);
    c.fillStyle = 'rgba(12,9,7,.55)'; c.fillRect(X0, ST - 10, X1 - X0, 22); c.fillStyle = 'rgba(90,78,64,.25)'; c.fillRect(X0, ST - 10, X1 - X0, 3);
    g = c.createLinearGradient(X0, 0, X0 + 700, 0); g.addColorStop(0, 'rgba(10,8,6,.55)'); g.addColorStop(1, 'rgba(10,8,6,0)'); c.fillStyle = g; c.fillRect(X0, EX.y0, 700, FY - EX.y0);
    c.fillStyle = 'rgba(40,46,60,.35)'; c.fillRect(X0, EX.y0, 10, FY - EX.y0);
    // the upper floor's string course and windows above (the roof is out of sight above the picture)
    c.fillStyle = 'rgba(12,9,7,.55)'; c.fillRect(X0, ST - 650, X1 - X0, 22);
    for (let k = 0; k < 40; k++) { const x = X0 + r() * (X1 - X0), y = EX.y0 + r() * (FY - EX.y0), rr = 60 + r() * 160, gg = c.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, r() < .5 ? 'rgba(70,58,46,.12)' : 'rgba(6,4,3,.14)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gg; c.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); }
    const win = (x, y, w, h, lit) => { c.fillStyle = '#120c08'; c.fillRect(x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32); c.fillStyle = lit ? '#e8a85a' : '#151820'; c.fillRect(x - w / 2, y - h / 2, w, h); c.fillStyle = '#120c08'; c.fillRect(x - 4, y - h / 2, 8, h); c.fillRect(x - w / 2, y - h * .1, w, 8); };
    const [wx, wy] = HSE.WIN; win(wx, wy, 130, 200, true); win(1880, wy, 130, 200, false); win(2900, 820, 150, 300, false);
    c.fillStyle = '#0c0806'; c.fillRect(2620, FY - 70, 140, 50); c.fillStyle = '#2a231e'; for (let k = 0; k < 4; k++) c.fillRect(2632 + k * 34, FY - 70, 8, 50);
    // the door's deep arched surround (the door's light itself is drawn live)
    const dx0 = DOOR.x - DOOR.w / 2 - 34, dx1 = DOOR.x + DOOR.w / 2 + 34, rr = (dx1 - dx0) / 2; c.fillStyle = '#3a302a'; c.beginPath(); c.moveTo(dx0, DOOR.bot); c.lineTo(dx0, DOOR.top + rr); c.arc(dx0 + rr, DOOR.top + rr, rr, Math.PI, 0); c.lineTo(dx1, DOOR.bot); c.fill();
    c.fillStyle = '#0c0806'; const ir = DOOR.w / 2; c.beginPath(); c.moveTo(DOOR.x - ir, DOOR.bot); c.lineTo(DOOR.x - ir, DOOR.top + ir); c.arc(DOOR.x, DOOR.top + ir, ir, Math.PI, 0); c.lineTo(DOOR.x + ir, DOOR.bot); c.fill();
    if (leaving) { // the low coursed wall called Salvation, beginning by the house and running on out of the picture beside the way
      c.fillStyle = '#1c1a1e'; c.fillRect(2760, FY - 150, EX.x1 - 2760, 150); c.fillStyle = 'rgba(120,126,140,.35)'; c.fillRect(2760, FY - 150, EX.x1 - 2760, 5); c.fillStyle = 'rgba(8,8,10,.6)'; for (let y = FY - 110; y < FY; y += 40) c.fillRect(2760, y, EX.x1 - 2760, 3); }
    // the path and the ground
    c.fillStyle = '#0e0d0c'; c.fillRect(EX.x0, FY, EX.x1 - EX.x0, EX.y1 - FY); c.fillStyle = 'rgba(90,80,70,.25)'; c.fillRect(1500, FY, EX.x1 - 1500, 3);
    return cv;
  }
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
  if (!PAINTED) { loads['door-drawn'] = new Promise(r => setTimeout(r, 0)).then(() => (pics['door-drawn'] = bakeDoorScene(false))); loads['leave-drawn'] = new Promise(r => setTimeout(r, 0)).then(() => (pics['leave-drawn'] = bakeDoorScene(true))); }
  return {
    door: {
      pic: PAINTED ? 'room-door' : 'door-drawn', shell: PAINTED ? 0 : 1, FY: 1200, cam0: 210, tone: [80, 74, 90], k: .58,
      light(x) { return x < DOOR.x - 100 ? { x: DOOR.x, a: .6 * this.d, col: [230, 140, 70] } : null; },
      enter() { this.d = 0; this.kn = 0; this.ia = 0; this.cut = 0; this.cw = 0; SEEN_R.clear(); },
      cutLit(id) { return id === 'door' ? .5 : 0; },
      run() { talk([[N, 'Then he went on till he came to the house of the Interpreter, and knocked over and over.']], () => { this.cw = 0; talk([[TIP, 'Knock on the door.', 'knock']], () => { H.ph = 'open'; H.t = 0; G.state = 'auto'; }); }); },
      act(sx, sy) { if (G.act === 'knock' && (sx == null || near(sx, sy, DOOR.x, 950, 150))) { knockS(); if (++this.kn >= 3) next(true); } },
      upd() {
        this.cut += ((this.cw ? 1 : 0) - this.cut) * (this.cw ? .03 : .05); if (this.cut < .003) this.cut = 0;
        if (G.act === 'knock' && G.actT >= 90 && !G.ring) G.ring = ring(DOOR.x, 950);
        if (H.ph === 'open') { this.d = Math.min(1, this.d + .012); if (H.t > 50) this.ia = Math.min(1, this.ia + .02); if (H.t === 1 && audio()) { tone(98, 'sine', .05, 2.2); noise(300, 3, 1.4, .05); }
          if (H.t === 150) talk([[C, 'Sir, the man at the gate said that if I called here, you would show me excellent things, to help me on my journey.'], [I, 'Come in. I will show you what will help you.']], () => goTo('r1')); }
      },
      under(c) { const self = this; doorLight(c, this.d, () => { if (self.ia > .01) visitor(c, 'I', DOOR.x, -1, .58, self.ia); }); if (PAINTED) { glow(c, u(2832), v(380), 120, [255, 190, 110], .1 + .03 * Math.sin(G.t / 40)); glow(c, u(470), v(1000), 70, [255, 160, 80], .2 + .08 * Math.sin(G.t / 7) * Math.sin(G.t / 13)); } else { glow(c, u(HSE.WIN[0]), v(HSE.WIN[1]), 120, [255, 190, 110], (.12 + .03 * Math.sin(G.t / 40)) * (1 - .5 * this.d)); glow(c, u(700), v(1160), 40, [255, 160, 80], .3 + .1 * Math.sin(G.t / 7) * Math.sin(G.t / 13)); } },
      people(c) { visitor(c, 'C', 1880, 1, .58); },
    },
    // LEAVING by the door (book {91}, {92}): he goes on his way
    leave: {
      pic: PAINTED ? 'room-door' : 'leave-drawn', shell: PAINTED ? 0 : 1, FY: 1200, cam0: 210, tone: [100, 94, 112], k: .58,
      light(x) { return x < DOOR.x - 100 ? { x: DOOR.x, a: .55, col: [230, 140, 70] } : null; },
      enter() { this.x = 1880; this.w = 0; this.fr = 0; this.a = 1; this.cut = 1; this.cw = 1; this.ct = 0; pic(VIS.C.walk.n); },
      cutLit(id) { return id === 'door' ? .6 : SEEN_R.has(id) ? .45 + .4 * smooth(0, 1, (this.ct - 30 - 25 * ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7'].indexOf(id)) / 60) : 0; },
      run() { talk([[I, 'Have you thought on all these things?'], [C, 'Yes, and they put me in hope and fear.'], [I, 'The Comforter be always with you, good Christian, to guide you in the way that leads to the City.'], [N, 'The highway was fenced on either side with a wall, and that wall was called Salvation.'], [TIP, 'Hold to go on your way.', 'walkout']], () => {}); },
      act() {},
      upd() {
        this.ct++; if (this.ct > 330) this.cw = 0; this.cut += ((this.cw ? 1 : 0) - this.cut) * (this.cw ? .03 : .04); if (this.cut < .003) this.cut = 0;
        if (G.act === 'walkout') { if (G.actT >= 60 && !hold() && !G.ring) G.ring = () => [u(this.x + 160), v(1000)]; if (hold()) { G.ring = null; this.w = Math.min(1, this.w + .05); } else this.w = Math.max(0, this.w - .05); }
        if (this.w > 0) {
          this.fr += WALK_FPT * this.w; this.x += walkSpeed('C', .58) * this.w;
          // build 492: his steps on the earth of the highway
          const st = Math.floor(this.fr * 2 / VIS.C.walk.fr); if (st !== this.lst) { this.lst = st; if (typeof stepOn === 'function') stepOn('dirt', 1); }
        }
        H.cam.to = Math.min(H.R.PW * S - VW, Math.max(H.R.cam0, u(this.x) + H.cam.x - 500));
        if (this.x > 2800) { this.a = Math.max(0, this.a - .03); if (G.act === 'walkout') { next(true); G.state = 'auto'; } }
        if (this.a <= 0 && H.ph !== 'end') { H.ph = 'end'; H.t = 0; }
        if (H.ph === 'end' && H.t === 40) finish();
      },
      under(c) { doorLight(c, 1, () => visitor(c, 'I', DOOR.x, -1, .58)); },
      people(c) { c.globalAlpha = this.a; if (this.w > 0 || this.fr > 0) walkFig(c, 'C', this.x, this.fr, .58); else visitor(c, 'C', this.x, 1, .58); c.globalAlpha = 1; },
    },
  // FOLLOW THE INTERPRETER (owner, build 267: "Ok to do 1"): between two rooms a dark passage; the child touches once (build 312) to follow
  // the Interpreter's candle ("he took him by the hand, and led him into ..."). Christian walks (his own walk pictures,
  // dark), the Interpreter goes a step ahead with a candle, its light moving along the wall and the floor.
      pass: {
    pic: null, FY: 1160, cam0: 0, tone: [120, 92, 74], k: .82, PW: 2526,
    enter() { this.p = 0; this.fr = 0; this.w = 0; this.st = 0; this.go = false; this.vt = 0; this.left = false; this.kind = passKind(this.from, this.to); pic(VIS.C.walk.n); pic(VIS.I.walk.n); if (this.to && ROOMS[this.to].pic) pic(ROOMS[this.to].pic); },
    // the standing line at x: level in a corridor, rising up the great stair, falling down the cellar stair (S0 to S1 the flight)
    S0: 760, S1: 1760, RISE: 250,
    floorAt(x) { const q = Math.max(0, Math.min(1, (x - this.S0) / (this.S1 - this.S0))); return this.kind === 'up' ? this.FY - this.RISE * q : this.kind === 'down' ? this.FY - this.RISE * (1 - q) : this.FY; },
    scene(c) {
      const K = this.kind, FY = this.FY, W2 = 2526, sky = K === 'out' || K === 'round';
      // the wall (stone and cooler in the cellar, plaster in the house) and the floor; one dark tone each, the candle reveals them
      const wallC = K === 'down' ? '#211b18' : '#2c1d13', floorC = K === 'down' ? '#15110e' : '#1d130c';
      c.fillStyle = wallC; c.fillRect(u(0), v(0), W2 * S, PH * S);
      if (K === 'hall' || K === 'out' || K === 'up' || K === 'down') {
        // a beam along the ceiling, and the doorway they came through on the left
        c.fillStyle = 'rgba(12,7,4,.8)'; c.fillRect(u(0), v(FY - 820), W2 * S, 36 * S);
        c.fillStyle = '#120a06'; c.fillRect(u(90), v((K === 'down' ? FY - this.RISE : FY) - 763), 210 * S, 763 * S);
      }
      if (K === 'up' || K === 'down') {
        // the stair: a flight of wooden steps in side view, a handrail with turned balusters, the landing beyond
        const n = 12, x0 = this.S0, x1 = this.S1, top = FY - this.RISE, up = K === 'up';
        c.fillStyle = '#24170e'; c.beginPath(); c.moveTo(u(x0), v(up ? FY : top));
        for (let i = 0; i < n; i++) { const xa = x0 + (x1 - x0) * i / n, xb = x0 + (x1 - x0) * (i + 1) / n, ya = up ? FY - this.RISE * i / n : top + this.RISE * i / n, yb = up ? FY - this.RISE * (i + 1) / n : top + this.RISE * (i + 1) / n;
          c.lineTo(u(xa), v(up ? yb : ya)); c.lineTo(u(xb), v(up ? yb : ya)); }
        c.lineTo(u(x1), v(up ? top : FY)); c.lineTo(u(W2), v(up ? top : FY)); c.lineTo(u(W2), v(PH)); c.lineTo(u(0), v(PH)); c.lineTo(u(0), v(up ? FY : top)); c.closePath(); c.fill();
        // the step nosings catch the candle a little
        c.strokeStyle = '#120a05'; c.lineWidth = Math.max(2, 26 * S); c.beginPath(); c.moveTo(u(x0), v((up ? FY : top) + 20)); c.lineTo(u(x1), v((up ? top : FY) + 20)); c.stroke();
        c.strokeStyle = 'rgba(150,100,56,.75)'; c.lineWidth = Math.max(1.2, 6 * S);
        for (let i = 1; i <= n; i++) { const xa = x0 + (x1 - x0) * (i - 1) / n, xb = x0 + (x1 - x0) * i / n, y = up ? FY - this.RISE * i / n : top + this.RISE * (i - 1) / n; c.beginPath(); c.moveTo(u(up ? xa : xa), v(y)); c.lineTo(u(xb), v(y)); c.stroke(); }
        c.strokeStyle = '#3a2614'; c.lineWidth = Math.max(1.5, 9 * S); c.beginPath(); c.moveTo(u(x0 - 60), v((up ? FY : top) - 300)); c.lineTo(u(x1 + 60), v((up ? top : FY) - 300)); c.stroke();
        c.lineWidth = Math.max(1, 5 * S); for (let i = 0; i <= n; i += 2) { const xa = x0 + (x1 - x0) * i / n, yb = up ? FY - this.RISE * i / n : top + this.RISE * i / n; c.beginPath(); c.moveTo(u(xa), v(yb)); c.lineTo(u(xa), v(yb - 300)); c.stroke(); }
        // the doorway at the end: the bedchamber's door upstairs, the cellar's low arch below
        c.fillStyle = '#0c0705'; if (up) c.fillRect(u(2150), v(top - 763), 220 * S, 763 * S); else { c.beginPath(); c.moveTo(u(2140), v(FY)); c.lineTo(u(2140), v(FY - 600)); c.arc(u(2255), v(FY - 600), 115 * S, Math.PI, 0); c.lineTo(u(2370), v(FY)); c.closePath(); c.fill(); }
      }
      if (K === 'hall') {
        // the next room's doorway on the right, its door ajar, a little of its light on the boards
        c.fillStyle = '#0d0805'; c.fillRect(u(2140), v(FY - 763), 230 * S, 763 * S);
        const g = c.createLinearGradient(u(2140), 0, u(2370), 0); g.addColorStop(0, 'rgba(255,190,110,0)'); g.addColorStop(1, 'rgba(255,190,110,.22)'); c.fillStyle = g; c.fillRect(u(2140), v(FY - 763), 230 * S, 763 * S);
        c.fillStyle = '#3a2416'; c.beginPath(); c.moveTo(u(2140), v(FY - 763)); c.lineTo(u(2210), v(FY - 733)); c.lineTo(u(2210), v(FY + 10)); c.lineTo(u(2140), v(FY)); c.closePath(); c.fill();
      }
      if (sky) {
        // out of doors at night: the sky, the garden wall, the dark shrubs; the house's back wall on the left (and its lit windows when going round)
        const x0 = K === 'out' ? 1560 : 0, g = c.createLinearGradient(0, v(0), 0, v(FY)); g.addColorStop(0, '#0b0f1c'); g.addColorStop(1, '#1b2132');
        c.fillStyle = g; c.fillRect(u(x0), v(0), (W2 - x0) * S, (FY + 4) * S);
        const r = rngR(4); c.fillStyle = 'rgba(230,230,255,.6)'; for (let i = 0; i < 40; i++) { const sx = x0 + r() * (W2 - x0), sy = r() * 600; c.fillRect(u(sx), v(sy), 1.2, 1.2); }
        c.fillStyle = '#121812'; c.fillRect(u(x0), v(FY - 150), (W2 - x0) * S, 150 * S);
        for (let x = x0 + 60; x < W2; x += 260 + r() * 200) { c.beginPath(); c.ellipse(u(x), v(FY - 120), (70 + r() * 60) * S, (90 + r() * 50) * S, 0, 0, 6.2832); c.fill(); }
        if (K === 'out') { c.fillStyle = '#0c0705'; c.fillRect(u(1460), v(FY - 763), 110 * S, 763 * S); c.fillStyle = '#2c1d13'; c.fillRect(u(1440), v(FY - 800), 20 * S, 800 * S); }
        if (K === 'round') { c.fillStyle = '#1a120c'; c.fillRect(u(0), v(FY - 900), 1200 * S, 900 * S); for (const wx of [240, 700]) { c.fillStyle = 'rgba(255,190,110,.55)'; c.fillRect(u(wx), v(FY - 560), 120 * S, 170 * S); }
          c.fillStyle = '#20140c'; c.fillRect(u(2200), v(FY - 340), 26 * S, 340 * S); c.fillRect(u(2380), v(FY - 340), 26 * S, 340 * S); }
      }
      c.fillStyle = sky ? (K === 'out' ? floorC : '#151a12') : floorC; c.fillRect(u(0), v(FY), W2 * S, (PH - FY) * S + 200);
      if (K === 'out') { c.fillStyle = '#151a12'; c.fillRect(u(1560), v(FY), (W2 - 1560) * S, (PH - FY) * S + 200); }
    },
    run() { talk([[TIP, 'Touch to follow the Interpreter.', 'follow']], () => {}); },
    // one touch and he follows to the end of the passage (owner, build 312: "make walks in dark room happen without holding down walk")
    act() { if (G.act === 'follow') this.start(); },
    // a verse in each passage (build 312, owner: "a verse for each transition"), King James text, checked word for word
    // against es-kjv and bible-kjv; shown quietly and read by the storyteller (build 315). Keyed by the room he goes to.
    READ: ['r2', 'r5', 'leave'],
    VERSES: {
      r2: [[N, 'Thy word is a lamp unto my feet, and a light unto my path.'], 'Psalm 119:105'],
      r3: [[N, 'But where sin abounded, grace did much more abound.'], 'Romans 5:20'],
      r4: [[N, 'Lay up for yourselves treasures in heaven.'], 'Matthew 6:20'],
      r5: [[N, 'My grace is sufficient for thee.'], '2 Corinthians 12:9'],
      r6: [[N, 'We must through much tribulation enter into the kingdom of God.'], 'Acts 14:22'],
      r7: [[N, 'What I say unto you I say unto all, Watch.'], 'Mark 13:37'],
      leave: [[N, 'We have a strong city; salvation will God appoint for walls and bulwarks.'], 'Isaiah 26:1'],
    },
    start() {
      if (this.go) return; this.go = true; G.ring = null; next(true); G.state = 'auto';
      const vs = this.VERSES[this.to]; this.need = 0;
      if (vs) {
        const txt = vs[0][1]; words('', txt + ' \u2014 ' + vs[1], 'cap hint'); document.body.classList.add('capped'); this.need = 60 + txt.length * 2.6;
        // the storyteller reads it (build 315); they arrive only once it has been said
        if (this.READ.includes(this.to)) { say(N, txt); voxBuf(vox(N, txt)).then(b => { if (b && this.go && !this.left) this.need = Math.max(this.need, Math.ceil(b.duration * 60) + 30); }); }
      }
    },
    x() { return 380 + this.p * 700; },
    upd() {
      if (G.act === 'follow') {
        if (hold()) this.start();
        if (G.actT >= 50 && !this.go && !G.ring) G.ring = () => [u(this.x() + 420), v(820)];
      }
      if (this.go) {
        this.w = Math.min(1, this.w + .04); this.vt++;
        // he arrives once the passage is walked and the verse has had time to be read
        if (this.p >= 1 && this.vt >= this.need && !this.left) { this.left = true; dlg.className = ''; document.body.classList.remove('capped'); goTo(this.to); }
      } else this.w = Math.max(0, this.w - .06);
      this.p = Math.min(1, this.p + walkSpeed('C', this.k) / 700 * this.w); this.fr += WALK_FPT * this.w;
      const step = Math.floor(this.fr * 2 / VIS.C.walk.fr); if (step !== this.st) {
        this.st = step;
        // build 492: the ground under his feet: boards in the house, the cellar's stone, the garden's grass out of doors
        const late = this.p > .72, surf = this.kind === 'round' ? 'grass' : this.kind === 'out' ? (late ? 'grass' : 'wood')
          : this.kind === 'down' ? (this.to === 'r6' ? (late ? 'stone' : 'wood') : 'wood') : 'wood';
        if (!(typeof stepOn === 'function' && audio() && (stepOn(surf, 1), true))) { noise(200, 1.5, .2, .06); noise(140, 1.2, .25, .04, .05); }
      }
    },
    draw(c) {
      const ix = 810 + this.p * 700 * walkSpeed('I', this.k) / walkSpeed('C', this.k), fl = 1 + .06 * Math.sin(G.t / 4.7) * Math.sin(G.t / 11), iy = this.floorAt(ix), cy = this.floorAt(this.x()), lx = u(ix) + 34, ly = v(iy) - 128;
      this.scene(c);
      // only what the candle reaches is seen (out of doors, a little of the night as well)
      const sky = this.kind === 'out' || this.kind === 'round'; darkWith(c, [[lx, ly, 520 * fl], [lx, v(iy) + 4, 640 * fl, .8]], sky ? .55 : .86);
      // the candle's light on the passage wall and, flat, on the floor
      glow(c, lx, ly, 330 * fl, [255, 170, 90], .2); c.save(); c.translate(lx, v(iy) + 2); c.scale(1, .12); glow(c, 0, 0, 380 * fl, [255, 170, 90], .32); c.restore();
      // both walk at their videos' own full pace, each moving at the floor speed that keeps his planted foot still (build 320)
      walkFig(c, 'I', ix, this.fr, this.k, 1, H.R.tone, iy);
      walkFig(c, 'C', this.x(), this.fr, this.k, 1, H.R.tone, cy);
      glow(c, lx, ly, 26 * fl, [255, 226, 160], .7); c.fillStyle = 'rgba(255,240,200,.95)'; c.beginPath(); c.ellipse(lx, ly - 2, 1.6, 3.4, 0, 0, 6.2832); c.fill();
      // where they are in the house: a small cutaway in the corner, the rooms seen faintly lit, the candle going from one to the next
      housePlan(c, VW - 170, 74, 1.5, this.from, this.to, this.p);
    },
  },
  };
});
