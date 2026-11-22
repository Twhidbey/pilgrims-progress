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
// the game's watercolour figures coloured in the house's palette (room-christian.webp, Christian painted once in colour; the Interpreter's own two pictures,
// room-interpreter.webp standing and room-interpreter-say.webp explaining), placed in each room (upscaled with Real-ESRGAN in build 307, the gesture in four sheets; no code breathing since build 302). Everything that moves is code:
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
  const VIS = { C: { n: 'room-christian-p', ax: 191, g: 1357, s: 632 / 1344, who: 'Christian', ph: 0, ct: 1, mul: .78, sat: .9, warm: [1, 1, 1], walk: { n: 'room-christian-pwalk', ax: 124, g: 369, s: 632 / 365, ct: 1, mul: .78, sat: .9, cols: 8, fr: 30, W: 202, H: 375, vpx: 6 } }, I: { n: 'room-interpreter-p', ax: 176.5, g: 1352, s: 635 / 1339, who: I, ph: 1.7, ct: 1, mul: .8, sat: .9, walk: { n: 'room-interpreter-pwalk', ax: 98, g: 375, s: 635 / 372, ct: 1, mul: .8, sat: .9, cols: 8, fr: 35, W: 186, H: 381, vpx: 4 }, say: { n: 'room-interpreter-say-hd', ax: 235.2, g: 935.2, s: 635 / 331 / 2.8, ct: 1.15, mul: .66, sat: .45, cols: 7, fr: 56, W: 398, H: 941, parts: 4, per: 14, off: 1 } } };
  const BRAVE = { plain: { n: 'room5-brave', ax: 94, g: 519 }, armed: { n: 'room5-brave-armed', ax: 123, g: 536 },
    // his arming, one free clip (Modal, after build 367): helmet on, sword drawn, striding right; played once at the video's own pace
    clip: { n: 'room5-brave-arm', ax: 159.5, g: 426, s: 519 / 423, cols: 8, fr: 65, W: 387, H: 432, vpx: 4 } };

  let R = null, t = 0, ph = '', cam = { x: 0, to: 0 }, fade = 1, fadeTo = 0, after = null, toned = {}, startId = 'door', motes = [];
  const u = x => x * S - cam.x, v = y => y * S - (R.FY * S - FLOOR);
  const hold = () => keys.push || keys.r || downs.size > 0 || autoHeld();
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
  const knockS = () => { if (typeof knockWood === 'function') { knockWood(0, 1); knockWood(.17, .85); } else { noise(160, 2, .22, .5); noise(420, 3, .08, .25); } };      // (build 468) the solid knock shared with the wicket-gate
  const clash = () => { noise(3200, 6, .35, .16); tone(1567, 'triangle', .03, .5, 0, 5000); tone(2093, 'triangle', .02, .4, .01, 6000); };
  const cough = when => { noise(700, 1.2, .25, .22, when); noise(500, 1.2, .2, .16, when + .3); };
  const creak = () => { tone(70, 'sawtooth', .05, 1.6, 0, 300); noise(900, 8, 1.2, .05); };
  const thunder = () => { noise(80, .7, 3.2, .5); noise(160, .8, 1.6, .25, .1); };
  const trumpet = () => { [[60, 0], [67, .55], [72, 1.1], [72, 1.7]].forEach(([m, w]) => tone(hz(m), 'sawtooth', .045, w < 1.6 ? .7 : 2.2, w, 1400)); };
  // MOOD SOUND (owner, build 269: "you have mood music?" ... "Yes please"; no hymn): each room a very quiet bed of sound,
  // made here, that fades in with the room, out with it, and sinks while anyone speaks. Held notes and filtered noise,
  // each breathing slowly; a few small things now and then (an owl at the door, the fire's crackle, a drip by the cage).
  let AMB = null;
  function ambStop() { if (!AMB || !AC) return; const a = AMB; AMB = null; a.g.gain.cancelScheduledValues(AC.currentTime); a.g.gain.setTargetAtTime(0, AC.currentTime, .5); setTimeout(() => a.n.forEach(n => { try { n.stop(); } catch (e) {} }), 4000); }
  function lfo(rate, depth, into) { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = rate; g.gain.value = depth; o.connect(g); g.connect(into); o.start(); AMB.n.push(o); }
  function held(f, type, vol, lp = 1200, wob = .3) {
    const o = AC.createOscillator(), b = AC.createBiquadFilter(), g = AC.createGain(); o.type = type; o.frequency.value = f; b.type = 'lowpass'; b.frequency.value = lp; g.gain.value = vol;
    o.connect(b); b.connect(g); g.connect(AMB.g); o.start(); AMB.n.push(o); lfo(.05 + rnd() * .08, vol * wob, g.gain); lfo(.1 + rnd() * .1, f * .002, o.frequency);
  }
  function bed(type, f, q, vol, rate = .07) {
    const sN = AC.createBufferSource(), b = AC.createBiquadFilter(), g = AC.createGain(); sN.buffer = NOISE; sN.loop = true; b.type = type; b.frequency.value = f; b.Q.value = q; g.gain.value = vol;
    sN.connect(b); b.connect(g); g.connect(AMB.g); sN.start(0, rnd() * 2); AMB.n.push(sN); lfo(rate, f * .35, b.frequency); lfo(rate * 1.3, vol * .4, g.gain);
  }
  const MOODS = {
    night: () => { bed('bandpass', 420, .7, .05, .05); bed('highpass', 2600, .5, .008, .03); },
    candle: () => { [110, 164.8, 220].forEach((f, i) => held(f, 'triangle', [.018, .012, .008][i], 700)); },
    airy: () => { held(880, 'sine', .004, 3000, .6); held(1318.5, 'sine', .003, 3000, .6); bed('highpass', 3500, .5, .006, .02); },
    still: () => { held(196, 'sine', .012, 900, .9); held(246.9, 'sine', .01, 900, .9); },
    fire: () => { held(55, 'sine', .035, 200, .2); bed('lowpass', 320, .7, .03, .2); },
    palace: () => { [523.3, 659.3, 784].forEach(f => held(f, 'sine', .005, 2400, .5)); held(130.8, 'triangle', .008, 500); },
    hollow: () => { held(73.4, 'sine', .022, 300, .3); held(110.6, 'sine', .012, 300, .4); bed('bandpass', 180, 1.2, .012, .03); },
    dread: () => { held(49, 'sine', .04, 160, .1); const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = 98; g.gain.value = 0; o.connect(g); g.connect(AMB.g); o.start(); AMB.n.push(o); lfo(.75, .012, g.gain); },
    passage: () => { bed('bandpass', 900, 1, .006, .5); held(82.4, 'sine', .01, 300, .3); },
  };
  function ambStart(kind) {
    ambStop(); if (!kind || !audio() || !NOISE) return;
    const g = AC.createGain(); g.gain.value = 0; g.connect(CLEAR); AMB = { g, n: [], kind, lvl: 1, to: 1 };
    MOODS[kind](); g.gain.setTargetAtTime(1, AC.currentTime + .2, 1.5);
  }
  function ambTick() {
    if (!AMB || !AC) return;
    const to = (SPK ? .5 : 1) * (AMB.swell || 1); if (Math.abs(to - AMB.to) > .01) { AMB.to = to; AMB.g.gain.cancelScheduledValues(AC.currentTime); AMB.g.gain.setTargetAtTime(to, AC.currentTime, .4); }
    // small things now and then
    if (AMB.kind === 'night' && rnd() < .0011) { tone(410, 'sine', .012, .5); tone(392, 'sine', .012, .9, .55); }
    if (AMB.kind === 'fire' && rnd() < .06) noise(2400 + rnd() * 3000, 3, .05, .02 + rnd() * .03);
    if (AMB.kind === 'hollow' && rnd() < .0045) tone(1700 + rnd() * 300, 'sine', .01, .3, 0, 6000);
  }
  const scratch = () => { for (let i = 0; i < 6; i++) noise(5200 + rnd() * 1500, 4, .08, .06, i * .11 + rnd() * .04); };

  // ---------- figures ----------
  // each figure picture, coloured for the room it stands in (baked once per room: no canvas is touched while playing)
  function toneOf(n, col, ct = 1.2, mul = 1, sat0 = null) {
    const key = n + '|' + col.join(',') + '|' + ct + '|' + mul + '|' + sat0; if (toned[key]) return toned[key];
    const im = pics[n]; if (!im) return null;
    const cv2 = document.createElement('canvas'); cv2.width = im.w || im.width; cv2.height = im.h || im.height; const x = cv2.getContext('2d');
    if (im.sheet) x.drawImage(im.sheet, im.sx, im.sy, im.w, im.h, 0, 0, im.w, im.h); else x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, cv2.width, cv2.height), p = d.data, sat = sat0 != null ? sat0 : R && R.sat != null ? R.sat : .6;
    let m = 0, cnt = 0; for (let i = 0; i < p.length; i += 4) if (p[i + 3] > 128) { m += (p[i] + p[i + 1] + p[i + 2]) / 3; cnt++; } m /= cnt || 1;
    for (let i = 0; i < p.length; i += 4) { const l = (p[i] + p[i + 1] + p[i + 2]) / 3; for (let k = 0; k < 3; k++) { let c = l + (p[i + k] - l) * sat; c = (m + (c - m) * ct) * mul; p[i + k] = Math.max(0, Math.min(255, c * col[k] / 255)); } }
    x.putImageData(d, 0, 0);
    return toned[key] = cv2;
  }
  function fig(c, spec, meta, x, y, face, k = 1, a = 1, col = R.tone || [255, 255, 255], who = null, ph0 = 0, bob = 0) {
    const im = toneOf(spec, col, meta.ct, meta.mul, meta.sat); if (!im || a <= .01) return;
    const sc0 = S / K * k, sc = sc0 * (meta.s || 1), fx = u(x), fy = v(y);
    // no breathing or sway in code (owner, build 296: "i don't like the moving pic around to simulate breathing"): figures stand still
    const sy = 1;
    if (!meta.noSh && !R.noShadow) { c.globalAlpha = a; c.fillStyle = 'rgba(12,6,3,.18)'; c.beginPath(); c.ellipse(fx + 6 * face, fy - 1, 55 * sc0, 6 * sc0, 0, 0, 6.2832); c.fill(); }
    c.globalAlpha = a; c.save(); c.translate(fx, fy - bob); c.scale(-face, sy);
    c.drawImage(im, -meta.ax * sc, -meta.g * sc, im.width * sc, im.height * sc);
    // a strong light near them (the fire, the opened door, the candle) warms the side of the figure that faces it
    const L = R.light && R.light(x);
    if (L && L.a > .01) { const right = (L.x > x) === (face === -1), lit = litOf(im, right, L.col); c.globalAlpha = a * Math.min(1, L.a); c.drawImage(lit, -meta.ax * sc, -meta.g * sc, im.width * sc, im.height * sc); }
    c.restore(); c.globalAlpha = 1;
  }
  function litOf(im, right, col) {
    const key = 'lit' + right + col; if (im[key]) return im[key];
    const cv2 = document.createElement('canvas'); cv2.width = im.width; cv2.height = im.height; const x = cv2.getContext('2d'); x.drawImage(im, 0, 0);
    const g = x.createLinearGradient(right ? im.width : 0, 0, right ? im.width * .4 : im.width * .6, 0); g.addColorStop(0, css(col, .6)); g.addColorStop(.45, css(col, .18)); g.addColorStop(1, css(col, 0));
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = g; x.fillRect(0, 0, im.width, im.height);
    return im[key] = cv2;
  }
  // the Interpreter lifts his open hand while he speaks (his second picture), and folds his hands again after
  let sayK = 0;
  // cut a sheet of frames into one picture per frame, once (pics['name#i'])
  // a sheet may come in parts (name-0 .. name-(parts-1), per frames each: the Interpreter's gesture at full size, build 307);
  // frames are only described here and cut out when toned, so no extra copy of every frame is kept
  function sheetFrames(f) {
    if (pics[f.n + '#0']) return true;
    const names = f.parts ? Array.from({ length: f.parts }, (_, k) => f.n + '-' + k) : [f.n];
    if (!names.every(nm => pics[nm])) { names.forEach(pic); return false; }
    const per = f.per || f.fr;
    for (let i = 0; i < f.fr; i++) { const j = i % per; pics[f.n + '#' + i] = { sheet: pics[names[Math.floor(i / per)]], sx: (j % f.cols) * f.W, sy: Math.floor(j / f.cols) * f.H, w: f.W, h: f.H }; }
    return true;
  }
  const speaking = () => (SPK && SPK.who === I) || (G.state === 'dialog' && dWho.textContent === I);
  // where a visitor stands at or past the painting's edge, a faint floor goes on under his feet into the dark (build 333)
  function floorOut(c, x, k, a) {
    const out = Math.max(R.ext && R.ext.includes('L') ? 0 : smooth(260, -60, x), R.ext && R.ext.includes('R') ? 0 : smooth(R.PW - 260, R.PW + 60, x)); if (out <= .01 || R.id === 'pass') return;
    const fx = u(x), fy = v(R.FY), rx = 150 * S * k, g = c.createRadialGradient(fx, fy, 0, fx, fy, rx);
    g.addColorStop(0, 'rgba(74,54,38,' + (.5 * out * a).toFixed(3) + ')'); g.addColorStop(1, 'rgba(74,54,38,0)');
    c.save(); c.translate(0, fy); c.scale(1, .09); c.translate(0, -fy); c.fillStyle = g; c.fillRect(fx - rx, fy - rx, 2 * rx, 2 * rx); c.restore();
    c.fillStyle = 'rgba(8,4,2,' + (.45 * out * a).toFixed(3) + ')'; c.beginPath(); c.ellipse(fx, fy, 60 * S * k, 4 * S * k + 1, 0, 0, 6.2832); c.fill();
  }
  const visitor = (c, key, x, face, k = R.k || 1, a = 1, up = 0) => {
    const m = VIS[key]; floorOut(c, x, k, a);
    const col = key === 'C' ? (R.toneC || R.tone).map((v, i) => v * m.warm[i]) : R.tone;
    // the Interpreter's gesture: frames of one video (hands folded -> the open hand lifted as he explains), played at the video's own pace
    if (m.say && !m.say.off && m.say.cols && sheetFrames(m.say)) { const f = m.say, i = Math.round(sayK * (f.fr - 1)); fig(c, f.n + '#' + i, f, x, R.FY - up, face, k, a, col, m.who, m.ph); return; }
    if (m.say && !m.say.off && !m.say.cols && pics[m.say.n]) { const q = smooth(0, 1, sayK); if (q < 1) fig(c, m.n, m, x, R.FY - up, face, k, a, col, m.who, m.ph); if (q > 0) fig(c, m.say.n, m.say, x, R.FY - up, face, k, a * q, col, m.who, m.ph); return; }
    fig(c, m.n, m, x, R.FY - up, face, k, a, col, m.who, m.ph);
  };
  // a visitor walking (the free Hugging Face clips, build 279): frame f (any real number) of his walk sheet,
  // and the floor speed (plate px a tick) at which his planted foot stays put at the video's own pace
  const WALK_FPT = 16 / 60;
  function walkSpeed(key, k) { const w = VIS[key].walk; return w.vpx * k * w.s / K * WALK_FPT; }
  function walkFig(c, key, x, f, k, a = 1, col = R.tone, y = R.FY) {
    const w = VIS[key].walk; if (!sheetFrames(w)) { if (key === 'C') walker(c, x, Math.floor(f) % Math.max(1, CHR.length), k); return; }
    const i = ((Math.floor(f) % w.fr) + w.fr) % w.fr; fig(c, w.n + '#' + i, w, x, y, 1, k, a, col, null, 0, 0);
  }
  // Christian walking (leaving): the game's own walk pictures, dark against the night
  const WALKT = new Map();
  function walker(c, x, frame, k) {
    const src = CHR[frame]; if (!src) { visitor(c, 'C', x, 1, k); return; }
    let im = WALKT.get(src); if (!im) { im = document.createElement('canvas'); im.width = src.width; im.height = src.height; const q = im.getContext('2d'); q.drawImage(src, 0, 0); const d = q.getImageData(0, 0, im.width, im.height), p = d.data, col = [58, 44, 36]; for (let i = 0; i < p.length; i += 4) for (let j = 0; j < 3; j++) p[i + j] = p[i + j] * col[j] / 255; q.putImageData(d, 0, 0); WALKT.set(src, im); }
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
    if (a <= .003) return; const o = tintBuf(); const q = o.getContext('2d'), T = c.getTransform(); q.setTransform(1, 0, 0, 1, 0, 0); q.clearRect(0, 0, o.width, o.height); q.setTransform(T); q.globalCompositeOperation = 'source-over';
    q.fillStyle = css([10, 6, 4], a); q.fillRect(-VW, -VH, 3 * VW, 3 * VH); q.globalCompositeOperation = 'destination-out';
    for (const [x, y, r, s = 1] of holes) { const g = q.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(0,0,0,' + s + ')'); g.addColorStop(.55, 'rgba(0,0,0,' + (s * .6) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = g; q.fillRect(x - r, y - r, 2 * r, 2 * r); }
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(o, 0, 0); c.setTransform(T);
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
  // ROOM 4 DRAWN IN CODE (a trial, after build 373; owner: "going back to computer drawn rooms like other levels"): only with ?drawn.
  // The game's own language: flat side view, each layer one tone, ONE light (the fire, after La Tour), most of the picture dark.
  // Baked once at half the painting's size (3168 x 1344 plate px); the fire, the water and the two men are drawn live in r4.under().
  const PAINTED = /[?&]painted\b/.test(location.search);
  const DRAWN = /[?&]drawn\b/.test(location.search), D4 = !/[?&]painted\b/.test(location.search);
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
  // ROOM 2 DRAWN IN CODE (after build 378; owner: "can you draw the parlour"): Vermeer's one light, a tall window on the left,
  // the pale wall lit nearest it and dimming to the right, the floorboards a nearer, darker layer with the window's light lying flat on them,
  // a low band of pale tiles at the wall's foot (the Milkmaid's Delft tiles, the room's one quoted detail besides the stream from the jug)
  const R2D = { girl: { ax: 154, g: 618, s: 1, ct: 1, mul: 1, sat: 1, noSh: 1 }, SPOUT: [289 - 154, 237 - 618], sweeper: { ax: 290, g: 652, s: .92, ct: 1, mul: .96, sat: 1, noSh: 1 }, GX: 1716, SX: 2655, WIN: [90, 380, 170, 930] };
  function bakeR2() {
    const W = 1584, H = 672, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'); c.scale(.5, .5);
    const FY = 1262, r = rngR(11), soft = (draw, w, h) => { const a = document.createElement('canvas'); a.width = w; a.height = h; draw(a.getContext('2d'), w, h); return a; };
    let g;
    // THE BACK WALL, after the Milkmaid's plaster: warm cream where the light falls, cool grey-blue in the half-shade, a deep warm brown in the far corner
    g = c.createLinearGradient(0, 0, 3168, 0); g.addColorStop(0, '#8d7a60'); g.addColorStop(.12, '#d9c9a6'); g.addColorStop(.3, '#d2c3a2'); g.addColorStop(.55, '#b3a68c'); g.addColorStop(.8, '#8f8470'); g.addColorStop(1, '#5e5242');
    c.fillStyle = g; c.fillRect(0, 0, 3168, 1344);
    // cool half-shade patches (Vermeer's plaster is never one colour)
    const cool = soft((x, w, h) => { for (let i = 0; i < 26; i++) { const px = r() * w, py = r() * h, rr = 4 + r() * 10, gg = x.createRadialGradient(px, py, 0, px, py, rr); gg.addColorStop(0, `rgba(${120 + r() * 30 | 0},${135 + r() * 25 | 0},${150 + r() * 20 | 0},${.18 + r() * .14})`); gg.addColorStop(1, 'rgba(130,140,150,0)'); x.fillStyle = gg; x.fillRect(px - rr, py - rr, 2 * rr, 2 * rr); } }, 80, 34);
    c.save(); c.globalAlpha = .9; c.drawImage(cool, 600, 0, 2568, 1344); c.restore();
    // plaster at three sizes: broad washes, middle mottling, fine grain (all soft-light, so the light below still rules)
    for (const [nw, cnt, rmax, al] of [[40, 70, 6, .07], [120, 420, 5, .05], [420, 3800, 2.2, .045]]) {
      const nh = Math.round(nw * 1344 / 3168), t = soft((x, w, h) => { for (let i = 0; i < cnt; i++) { x.fillStyle = r() < .5 ? `rgba(70,52,34,${al + r() * al})` : `rgba(255,244,222,${al + r() * al})`; x.beginPath(); x.arc(r() * w, r() * h, .6 + r() * rmax, 0, 6.2832); x.fill(); } }, nw, nh);
      c.save(); c.globalCompositeOperation = 'soft-light'; c.drawImage(t, 0, 0, 3168, 1344); c.restore();
    }
    // the light from the window: one great soft slanting pool falling from the upper left down toward the floor (painted small, stretched up)
    const pool = soft((x, w, h) => { x.filter = 'none'; const gg = x.createLinearGradient(w * .1, 0, w * .62, h); gg.addColorStop(0, 'rgba(255,246,220,0)'); gg.addColorStop(.18, 'rgba(255,246,220,.75)'); gg.addColorStop(.6, 'rgba(255,240,205,.5)'); gg.addColorStop(1, 'rgba(255,236,200,0)'); x.fillStyle = gg; x.beginPath(); x.moveTo(w * .1, 0); x.lineTo(w * .34, 0); x.lineTo(w * .62, h); x.lineTo(w * .2, h); x.closePath(); x.fill(); }, 64, 27);
    c.save(); c.globalCompositeOperation = 'soft-light'; c.drawImage(pool, 0, 0, 3168, 1344); c.drawImage(pool, 0, 0, 3168, 1344); c.globalCompositeOperation = 'screen'; c.globalAlpha = .22; c.drawImage(pool, 0, 0, 3168, 1344); c.restore();
    // darker toward the top and into the right-hand corner
    g = c.createLinearGradient(0, 0, 0, FY); g.addColorStop(0, 'rgba(40,28,16,.45)'); g.addColorStop(.3, 'rgba(40,28,16,.1)'); g.addColorStop(1, 'rgba(40,28,16,0)'); c.fillStyle = g; c.fillRect(0, 0, 3168, FY);
    g = c.createLinearGradient(2300, 0, 3168, 0); g.addColorStop(0, 'rgba(30,22,14,0)'); g.addColorStop(1, 'rgba(30,22,14,.45)'); c.fillStyle = g; c.fillRect(2300, 0, 868, 1344);
    // a few hairline cracks and small chips, as old plaster has (thin, faint, wandering)
    c.lineCap = 'round';
    for (let i = 0; i < 9; i++) { let x0 = 700 + r() * 2200, y0 = 120 + r() * 700; c.strokeStyle = `rgba(62,46,30,${.18 + r() * .12})`; c.lineWidth = 1.1 + r(); c.beginPath(); c.moveTo(x0, y0); const n = 6 + r() * 10 | 0; for (let k = 0; k < n; k++) { x0 += (r() - .5) * 34; y0 += 10 + r() * 30; c.lineTo(x0, y0); } c.stroke(); }
    for (let i = 0; i < 26; i++) { const x0 = 650 + r() * 2300, y0 = 150 + r() * 950, rr = 2 + r() * 4; c.fillStyle = 'rgba(70,50,30,.42)'; c.beginPath(); c.arc(x0, y0, rr, 0, 6.2832); c.fill(); c.fillStyle = 'rgba(255,240,215,.35)'; c.beginPath(); c.arc(x0 - 1.5, y0 - 1.5, rr * .7, 0, 6.2832); c.fill(); }
    // THE SIDE WALL coming toward us on the left, in shade, with the window in it, seen a little from the side (as in the painting)
    const SX = 330, SB = 120;
    g = c.createLinearGradient(0, 0, SX, 0); g.addColorStop(0, '#3d2f22'); g.addColorStop(1, '#5a4733'); c.fillStyle = g; c.beginPath(); c.moveTo(0, -60); c.lineTo(SX, 40); c.lineTo(SX, FY); c.lineTo(0, FY + SB); c.closePath(); c.fill();
    // the window: deep reveal, the glass bright and a little green-grey, the leaded diamonds, the frame, the sill
    const wq = (t, s2) => [t * SX + (1 - t) * 30, 0], WT = (t) => 120 * (1 - t) + 170 * t, WB = (t) => 1040 * (1 - t) + 960 * t;
    const winPath = (k) => { c.beginPath(); c.moveTo(40 + k, WT(.1)); c.lineTo(SX - 50 - k, WT(.85)); c.lineTo(SX - 50 - k, WB(.85)); c.lineTo(40 + k, WB(.1)); c.closePath(); };
    c.fillStyle = '#2a1e14'; winPath(-16); c.fill();
    g = c.createLinearGradient(0, 150, 0, 1000); g.addColorStop(0, '#f6f3e6'); g.addColorStop(.6, '#dfe2d4'); g.addColorStop(1, '#c9cdbd'); c.fillStyle = g; winPath(0); c.fill();
    c.save(); winPath(0); c.clip(); c.strokeStyle = 'rgba(60,56,46,.42)'; c.lineWidth = 2;
    for (let d = -1000; d < 1000; d += 40) { c.beginPath(); c.moveTo(d, 0); c.lineTo(d + 600, 1100); c.stroke(); c.beginPath(); c.moveTo(d + 600, 0); c.lineTo(d, 1100); c.stroke(); }
    g = c.createLinearGradient(40, 0, SX - 50, 0); g.addColorStop(0, 'rgba(255,255,250,.35)'); g.addColorStop(1, 'rgba(255,255,250,0)'); c.fillStyle = g; c.fillRect(0, 0, SX, 1100); c.restore();
    c.fillStyle = '#35281b'; c.beginPath(); c.moveTo(178, WT(.5) - 4); c.lineTo(196, WT(.5) - 4); c.lineTo(196, WB(.5) + 4); c.lineTo(178, WB(.5) + 4); c.fill();
    for (const t of [.42]) { c.beginPath(); c.moveTo(40, WT(.1) + (WB(.1) - WT(.1)) * t - 7); c.lineTo(SX - 50, WT(.85) + (WB(.85) - WT(.85)) * t - 7); c.lineTo(SX - 50, WT(.85) + (WB(.85) - WT(.85)) * t + 7); c.lineTo(40, WT(.1) + (WB(.1) - WT(.1)) * t + 7); c.fill(); }
    c.fillStyle = '#6b5238'; c.beginPath(); c.moveTo(20, WB(0) + 20); c.lineTo(SX + 40, WB(1) + 10); c.lineTo(SX + 40, WB(1) + 34); c.lineTo(20, WB(0) + 52); c.closePath(); c.fill();
    // the corner where the two walls meet: a soft dark seam
    g = c.createLinearGradient(SX - 10, 0, SX + 70, 0); g.addColorStop(0, 'rgba(40,30,20,.55)'); g.addColorStop(1, 'rgba(40,30,20,0)'); c.fillStyle = g; c.fillRect(SX - 10, 40, 80, FY - 40);
    // THE BASKET AND THE BRASS PAIL on their nails, each with its soft shadow cast down and to the right by the window
    const shadow = (draw) => { const sh = soft((x, w, h) => { x.scale(w / 3168, h / 1344); x.fillStyle = 'rgba(40,28,18,.55)'; draw(x); }, 396, 168); c.save(); c.globalAlpha = .75; c.drawImage(sh, 70, 46, 3168, 1344); c.restore(); };
    const basket = (x) => { x.beginPath(); x.moveTo(780, 500); x.quadraticCurveTo(885, 528, 990, 500); x.bezierCurveTo(1000, 600, 960, 690, 885, 698); x.bezierCurveTo(810, 690, 770, 600, 780, 500); x.closePath(); x.fill(); x.lineWidth = 12; x.beginPath(); x.moveTo(800, 506); x.bezierCurveTo(815, 390, 955, 390, 970, 506); x.stroke(); };
    const pail = (x) => { x.beginPath(); x.moveTo(1015, 500); x.lineTo(1140, 500); x.lineTo(1125, 640); x.quadraticCurveTo(1078, 655, 1030, 640); x.closePath(); x.fill(); x.lineWidth = 6; x.beginPath(); x.moveTo(1020, 505); x.quadraticCurveTo(1078, 410, 1135, 505); x.stroke(); };
    shadow((x) => { x.strokeStyle = x.fillStyle; basket(x); pail(x); });
    c.fillStyle = '#2a1e12'; c.beginPath(); c.arc(887, 432, 6, 0, 6.2832); c.arc(1077, 450, 6, 0, 6.2832); c.fill();
    // the basket: dark wicker, its weave a few light strands, lit on the window's side
    g = c.createLinearGradient(780, 0, 990, 0); g.addColorStop(0, '#c49a5a'); g.addColorStop(.5, '#96703e'); g.addColorStop(1, '#5a3e20'); c.fillStyle = g; c.strokeStyle = '#8a6438'; basket(c);
    // the weave: rows of short slanting strokes, alternating, light on top and dark beneath (wicker, not a smooth bucket)
    c.save(); c.beginPath(); c.moveTo(780, 500); c.quadraticCurveTo(885, 528, 990, 500); c.bezierCurveTo(1000, 600, 960, 690, 885, 698); c.bezierCurveTo(810, 690, 770, 600, 780, 500); c.closePath(); c.clip();
    for (let y = 504, row = 0; y < 700; y += 24, row++) for (let x0 = 764 + (row % 2) * 18; x0 < 1004; x0 += 36) {
      c.fillStyle = 'rgba(46,28,12,.6)'; c.fillRect(x0, y + 17, 30, 7);
      c.strokeStyle = `rgba(246,216,156,${x0 < 900 ? .62 : .3})`; c.lineWidth = 7; c.beginPath(); c.moveTo(x0 + 4, y + 9); c.quadraticCurveTo(x0 + 16, y + 1, x0 + 28, y + 9); c.stroke(); }
    c.strokeStyle = 'rgba(46,28,12,.45)'; c.lineWidth = 4; for (let x0 = 782; x0 < 1000; x0 += 36) { c.beginPath(); c.moveTo(x0, 500); c.lineTo(x0 + (x0 - 885) * -.12, 700); c.stroke(); }
    c.restore(); c.strokeStyle = '#d8b070'; c.lineWidth = 9; c.beginPath(); c.moveTo(780, 501); c.quadraticCurveTo(885, 529, 990, 501); c.stroke();
    // the pail: brass, one bright gleam on the window's side, the rim's ring
    g = c.createLinearGradient(1015, 0, 1140, 0); g.addColorStop(0, '#c89c4c'); g.addColorStop(.18, '#fff0b8'); g.addColorStop(.32, '#d8ac58'); g.addColorStop(.62, '#8a6226'); g.addColorStop(1, '#3e2a10'); c.fillStyle = g; c.strokeStyle = '#3e2e18'; pail(c);
    c.fillStyle = '#6e5228'; c.beginPath(); c.ellipse(1077, 501, 63, 9, 0, 0, 6.2832); c.fill(); c.fillStyle = 'rgba(255,240,190,.55)'; c.fillRect(1036, 515, 7, 110);
    // THE TILES at the wall's foot (the Milkmaid's Delft tiles): pale, each with a small blue figure, the row shadowed toward the corner
    const T0 = FY - 48; c.fillStyle = '#e2dccb'; c.fillRect(SX, T0, 3168 - SX, 48);
    for (let x = SX; x < 3168; x += 48) { c.strokeStyle = 'rgba(50,70,120,.55)'; c.lineWidth = 2.2; const k = r(); c.beginPath(); if (k < .33) { c.arc(x + 24, T0 + 24, 9, 0, 6.2832); } else if (k < .66) { c.moveTo(x + 14, T0 + 34); c.quadraticCurveTo(x + 24, T0 + 8, x + 34, T0 + 34); c.moveTo(x + 24, T0 + 18); c.lineTo(x + 24, T0 + 38); } else { c.moveTo(x + 12, T0 + 30); c.lineTo(x + 36, T0 + 30); c.moveTo(x + 18, T0 + 30); c.lineTo(x + 22, T0 + 14); c.lineTo(x + 30, T0 + 30); } c.stroke();
      c.strokeStyle = 'rgba(50,70,120,.35)'; c.lineWidth = 1.2; c.strokeRect(x + 3, T0 + 3, 42, 42); c.fillStyle = 'rgba(80,70,60,.3)'; c.fillRect(x, T0, 1.5, 48); }
    g = c.createLinearGradient(SX, 0, 3168, 0); g.addColorStop(0, 'rgba(40,30,20,.05)'); g.addColorStop(.6, 'rgba(40,30,20,.25)'); g.addColorStop(1, 'rgba(40,30,20,.55)'); c.fillStyle = g; c.fillRect(SX, T0, 3168 - SX, 48);
    c.fillStyle = 'rgba(40,28,18,.6)'; c.fillRect(SX, T0 - 4, 3168 - SX, 4);
    // THE FOOT WARMER by the right wall: a small wooden box with holes in its lid, lit on its window side
    const fx0 = 2770, fx1 = 3030, ft = 1080; c.fillStyle = '#4a3220'; c.fillRect(fx0, ft, fx1 - fx0, FY - ft + 6); c.fillStyle = '#6e4c30'; c.fillRect(fx0, ft, 26, FY - ft + 6); c.fillRect(fx0 - 8, ft - 14, fx1 - fx0 + 16, 18);
    c.fillStyle = '#2a1a10'; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { c.beginPath(); c.arc(fx0 + 60 + i * 50, ft + 50 + j * 50, 8, 0, 6.2832); c.fill(); }
    g = c.createLinearGradient(fx1, 0, fx1 + 160, 0); g.addColorStop(0, 'rgba(30,20,12,.5)'); g.addColorStop(1, 'rgba(30,20,12,0)'); c.fillStyle = g; c.fillRect(fx1, ft + 20, 160, FY - ft - 14);
    // THE FLOOR: warm boards, a nearer and darker layer, each board its own tone with fine grain; the window's light lying flat across them
    g = c.createLinearGradient(0, FY, 0, 1344); g.addColorStop(0, '#7c5a3a'); g.addColorStop(1, '#4c3420'); c.fillStyle = g; c.fillRect(0, FY, 3168, 84);
    for (let x = 0; x < 3168; x += 150 + r() * 110) { c.fillStyle = `rgba(${r() < .5 ? '255,230,190' : '40,24,12'},${.04 + r() * .06})`; c.fillRect(x, FY, 140, 84); c.fillStyle = 'rgba(30,18,8,.55)'; c.fillRect(x, FY, 2, 84); }
    c.strokeStyle = 'rgba(40,24,12,.25)'; c.lineWidth = 1; for (let i = 0; i < 60; i++) { const y = FY + 4 + r() * 76, x0 = r() * 3168; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + 60 + r() * 160, y + (r() - .5) * 2); c.stroke(); }
    c.save(); c.beginPath(); c.rect(0, FY, 3168, 84); c.clip(); c.translate(1000, FY + 30); c.scale(1, .06); g = c.createRadialGradient(0, 0, 0, 0, 0, 1200); g.addColorStop(0, 'rgba(255,234,190,.5)'); g.addColorStop(1, 'rgba(255,234,190,0)'); c.fillStyle = g; c.fillRect(-1200, -1200, 2400, 2400); c.restore();
    g = c.createLinearGradient(0, FY, 0, FY + 14); g.addColorStop(0, 'rgba(30,20,10,.5)'); g.addColorStop(1, 'rgba(30,20,10,0)'); c.fillStyle = g; c.fillRect(0, FY, 3168, 14);
    return cv;
  }
  // a stand-in figure in colour, region by region over its own grey watercolour (the 'color' blend keeps its shading), lit on the window's side
  function colourFig(n, out, parts, lightRight) {
    const im = pics[n]; if (!im || pics[out]) return !!pics[out];
    const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height; const x = cv.getContext('2d'); x.drawImage(im, 0, 0);
    const d = x.getImageData(0, 0, cv.width, cv.height), p = d.data; for (let i = 0; i < p.length; i += 4) for (let k = 0; k < 3; k++) p[i + k] = Math.min(255, Math.max(0, (p[i + k] - 128) * 1.35 + 128));
    x.putImageData(d, 0, 0);
    // one colour map (each part over the last), laid once by 'color' and once by 'multiply' at part strength, so the clothes are rich, not pastel
    const map = document.createElement('canvas'); map.width = cv.width; map.height = cv.height; const mx = map.getContext('2d'); for (const [c0, x0, y0, x1, y1] of parts) { mx.fillStyle = c0; mx.fillRect(x0, y0, x1 - x0, y1 - y0); }
    // softened (made small and stretched back), so no colour ends in a hard straight line
    const sm = document.createElement('canvas'); sm.width = Math.max(4, cv.width / 7 | 0); sm.height = Math.max(4, cv.height / 7 | 0); sm.getContext('2d').drawImage(map, 0, 0, sm.width, sm.height); mx.clearRect(0, 0, map.width, map.height); mx.drawImage(sm, 0, 0, map.width, map.height);
    x.globalCompositeOperation = 'color'; x.drawImage(map, 0, 0); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .7; x.drawImage(map, 0, 0); x.globalAlpha = 1;
    x.globalCompositeOperation = 'soft-light'; const g = x.createLinearGradient(lightRight ? cv.width : 0, 0, lightRight ? 0 : cv.width, 0); g.addColorStop(0, 'rgba(255,248,225,.75)'); g.addColorStop(.6, 'rgba(128,128,128,0)'); g.addColorStop(1, 'rgba(20,14,8,.55)'); x.fillStyle = g; x.fillRect(0, 0, cv.width, cv.height);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(im, 0, 0);
    pics[out] = cv; return true;
  }
  // THE PARLOUR ON THE HOUSE'S SHELL (build 432; owner: "I want painting looks gone ... replace with drawn look across the board"): night, as in every
  // room; Vermeer's window becomes moonlight: the glass the brightest thing in the house, the plaster glowing cool beside it and dying to the
  // right, the shade warm umber; the basket and the brass pail on one nail; a low pale band of Delft tiles; the Milkmaid's colours only on the girl.
  const R2S = { WIN: [330, 300, 730, 930] };
  // THE PARLOUR LIKE A PAINTING, DRAWN (build 475; owner: "can you make the parlor look really cool like painting but drawn"): the Milkmaid's
  // wall in code. One window rules: its leaded glass the brightest thing, one casement standing a little open, a deep splayed reveal lit on its
  // far side; the moon's light lies down the wall as one broad soft slant and across the boards; the plaster has the painting's life (soft
  // patches of old repair, nail holes each with its little shadow, two hairline cracks), the basket and the brass pail on their nails with
  // their shadows thrown down and to the right, a row of real Delft tiles at the wall's foot, the foot warmer on the boards, a chair in the dark.
  function bakeR2s() {
    const [x0, y0, x1, y1] = R2S.WIN, FY = HOUSE.FY, WW = x1 - x0, WH = y1 - y0;
    const small = (w, h, f) => { const a = document.createElement('canvas'); a.width = w; a.height = h; f(a.getContext('2d'), w, h); return a; };
    // a shadow thrown by the window's light: the shape drawn small and dark, blurred by stretching, offset down and to the right
    const shadow = (c, draw, dx, dy, a) => { const t = small(120, 80, (q, w, h) => { q.scale(w / 3528, h / 2044); q.translate(360, 700); q.fillStyle = '#000'; draw(q); }); c.save(); c.globalAlpha = a; c.drawImage(t, EX.x0 + dx, EX.y0 + dy, EX.x1 - EX.x0, EX.y1 - EX.y0); c.restore(); };
    return bakeShell({ seed: 22, doors: 'LR', skirt: 0, wallC: '#3a3122', floorC: '#2a1a10',
      lights: [{ x: 640, y: 720, r: 1550, lit: [214, 206, 178], half: [104, 92, 66], sx: 1.35 }],
      wall(c, r) {
        // the plaster's life, laid softly: broad patches of old repair, a little lighter or darker, cool where the light falls, warm in the shade
        for (let i = 0; i < 26; i++) { const x = 100 + r() * 3200, y = -200 + r() * 1350, rad = 60 + r() * 220, lit = Math.max(0, 1 - Math.abs(x - 700) / 1500), g = c.createRadialGradient(x, y, 0, x, y, rad);
          const col = r() < .5 ? `rgba(${lit > .3 ? '176,186,184' : '160,132,90'},${(.06 + .06 * lit).toFixed(3)})` : 'rgba(40,26,10,.08)'; g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.save(); c.translate(x, y); c.scale(1.4, .8); c.translate(-x, -y); c.fillRect(x - rad, y - rad, 2 * rad, 2 * rad); c.restore(); }
        // two hairline cracks, wandering, broken, fainter at their ends
        for (const [sx, sy, n, ang] of [[900, 180, 26, 1.2], [2300, 420, 20, 1.7]]) { let x = sx, y = sy, a = ang; for (let k = 0; k < n; k++) { a += (r() - .5) * .7; const nx = x + Math.cos(a) * 14, ny = y + Math.sin(a) * 14; if (r() > .15) { c.strokeStyle = `rgba(16,10,6,${(.35 * Math.sin(Math.PI * k / n)).toFixed(3)})`; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(nx, ny); c.stroke(); c.strokeStyle = `rgba(200,200,190,${(.12 * Math.sin(Math.PI * k / n)).toFixed(3)})`; c.beginPath(); c.moveTo(x + 1.5, y + 1.5); c.lineTo(nx + 1.5, ny + 1.5); c.stroke(); } x = nx; y = ny; } }
        // nail holes, as Vermeer painted them: a dark speck, a lit lower lip
        for (let i = 0; i < 34; i++) { const x = 820 + r() * 1700, y = 260 + r() * 560; c.fillStyle = 'rgba(14,9,5,.6)'; c.beginPath(); c.arc(x, y, 2 + r() * 2.4, 0, 6.2832); c.fill(); c.fillStyle = 'rgba(210,208,196,.18)'; c.beginPath(); c.arc(x + 1.5, y + 2.5, 2, 0, 6.2832); c.fill(); }
        // THE WINDOW: the splayed reveal (its far side, toward the room, catches the light; its near side in shade), the glass, the lead
        c.fillStyle = '#17110b'; c.beginPath(); c.moveTo(x0 - 70, y0 - 60); c.lineTo(x1 + 70, y0 - 60); c.lineTo(x1, y0); c.lineTo(x0, y0); c.closePath(); c.fill();
        let g = c.createLinearGradient(x1, 0, x1 + 70, 0); g.addColorStop(0, '#d8cfb4'); g.addColorStop(1, '#8a7e62'); c.fillStyle = g; c.beginPath(); c.moveTo(x1, y0); c.lineTo(x1 + 70, y0 - 60); c.lineTo(x1 + 70, y1 + 60); c.lineTo(x1, y1); c.closePath(); c.fill();
        c.fillStyle = '#120d08'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 - 70, y0 - 60); c.lineTo(x0 - 70, y1 + 60); c.lineTo(x0, y1); c.closePath(); c.fill();
        // the glass: the sky beyond, pale silver to a little blue at the top, each small pane a shade apart (old glass is never even)
        g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#b9cdd2'); g.addColorStop(.5, '#e4ece4'); g.addColorStop(1, '#d8dcc8'); c.fillStyle = g; c.fillRect(x0, y0, WW, WH);
        c.save(); c.beginPath(); c.rect(x0, y0, WW, WH); c.clip();
        const dw = 44, dh = 64;
        for (let yy = y0 - dh; yy < y1 + dh; yy += dh / 2) for (let xx = x0 - dw; xx < x1 + dw; xx += dw) { const ox = ((yy - y0) / (dh / 2)) % 2 ? dw / 2 : 0, cx = xx + ox, v2 = r(); c.fillStyle = v2 < .5 ? `rgba(60,70,74,${(.04 + .08 * r()).toFixed(3)})` : `rgba(255,255,250,${(.05 + .1 * r()).toFixed(3)})`; c.beginPath(); c.moveTo(cx, yy - dh / 2); c.lineTo(cx + dw / 2, yy); c.lineTo(cx, yy + dh / 2); c.lineTo(cx - dw / 2, yy); c.closePath(); c.fill(); }
        c.strokeStyle = 'rgba(40,40,38,.55)'; c.lineWidth = 2.2;
        for (let d = -WH; d < WW + WH; d += dw) { c.beginPath(); c.moveTo(x0 + d, y0); c.lineTo(x0 + d - WH * dw / dh, y1); c.stroke(); c.beginPath(); c.moveTo(x0 + d - WH * dw / dh, y0); c.lineTo(x0 + d, y1); c.stroke(); }
        c.restore();
        // the frame: mullion and transom, the casement on the right standing a little open (its edge a bright sliver, the gap darker sky)
        c.fillStyle = '#2b2116'; c.fillRect(x0 - 8, y0 - 8, WW + 16, 16); c.fillRect(x0 - 8, y1 - 8, WW + 16, 16); c.fillRect(x0 - 8, y0, 16, WH); c.fillRect(x1 - 8, y0, 16, WH);
        const mx = x0 + WW / 2, ty = y0 + WH * .36; c.fillRect(mx - 10, y0, 20, WH); c.fillRect(x0, ty - 9, WW, 18);
        c.fillStyle = 'rgba(70,86,96,.5)'; c.fillRect(mx + 10, ty + 9, 26, y1 - ty - 17); c.fillStyle = '#e9eeea'; c.fillRect(mx + 36, ty + 9, 5, y1 - ty - 17); c.fillStyle = '#3a2d1e'; c.fillRect(mx + 41, ty + 9, 9, y1 - ty - 17);
        // the sill, deep, its top lit
        c.fillStyle = '#3c2e1e'; c.fillRect(x0 - 80, y1 + 52, WW + 160, 30); c.fillStyle = 'rgba(214,220,216,.55)'; c.fillRect(x0 - 80, y1 + 52, WW + 160, 4);
        // the window's glow on the plaster round it (it lights its own surround)
        c.save(); c.globalCompositeOperation = 'screen'; g = c.createRadialGradient((x0 + x1) / 2, (y0 + y1) / 2, WW * .4, (x0 + x1) / 2, (y0 + y1) / 2, WW * 1.4); g.addColorStop(0, 'rgba(150,144,118,.4)'); g.addColorStop(1, 'rgba(150,144,118,0)'); c.fillStyle = g; c.fillRect(x0 - WW, y0 - WW, WW * 3, WH + WW * 2); c.restore();
        // THE MOON'S LIGHT down the wall: one broad soft slant from the window toward the floor on the right, painted small and stretched
        const shaft = small(80, 46, (q) => { const sg = q.createLinearGradient(16, 22, 44, 44); sg.addColorStop(0, 'rgba(236,228,196,.7)'); sg.addColorStop(.6, 'rgba(236,228,196,.32)'); sg.addColorStop(1, 'rgba(236,228,196,0)'); q.fillStyle = sg; q.beginPath(); q.moveTo(15, 22); q.lineTo(22, 23); q.lineTo(52, 44); q.lineTo(30, 44); q.closePath(); q.fill(); });
        c.save(); c.globalCompositeOperation = 'soft-light'; c.drawImage(shaft, EX.x0, EX.y0, EX.x1 - EX.x0, EX.y1 - EX.y0); c.globalCompositeOperation = 'screen'; c.globalAlpha = .28; c.drawImage(shaft, EX.x0, EX.y0, EX.x1 - EX.x0, EX.y1 - EX.y0); c.restore();
        // THE BASKET AND THE BRASS PAIL on their nails, with their shadows thrown down and to the right
        const BX = 1300, BY = 560, PX = 1510, PY = 560;
        const basketShape = (q) => { q.beginPath(); q.moveTo(BX - 90, BY); q.quadraticCurveTo(BX, BY + 22, BX + 90, BY); q.bezierCurveTo(BX + 100, BY + 90, BX + 60, BY + 150, BX, BY + 156); q.bezierCurveTo(BX - 60, BY + 150, BX - 100, BY + 90, BX - 90, BY); q.closePath(); q.fill(); q.lineWidth = 12; q.strokeStyle = '#000'; q.beginPath(); q.moveTo(BX - 76, BY + 6); q.bezierCurveTo(BX - 66, BY - 110, BX + 66, BY - 110, BX + 76, BY + 6); q.stroke(); };
        const pailShape = (q) => { q.beginPath(); q.moveTo(PX - 62, PY); q.lineTo(PX + 62, PY); q.lineTo(PX + 50, PY + 140); q.quadraticCurveTo(PX, PY + 154, PX - 50, PY + 140); q.closePath(); q.fill(); };
        shadow(c, q => { basketShape(q); pailShape(q); }, 34, 40, .55);
        // the basket: wicker, rows of strands slanting over dark gaps, ribs, a lit rim toward the window, its handle up to the nail
        c.save(); c.fillStyle = '#261c12'; basketShape(c);
        c.beginPath(); c.moveTo(BX - 90, BY); c.quadraticCurveTo(BX, BY + 22, BX + 90, BY); c.bezierCurveTo(BX + 100, BY + 90, BX + 60, BY + 150, BX, BY + 156); c.bezierCurveTo(BX - 60, BY + 150, BX - 100, BY + 90, BX - 90, BY); c.closePath(); c.clip();
        for (let y = BY + 8, row = 0; y < BY + 160; y += 13, row++) for (let x = BX - 110 + (row % 2) * 9; x < BX + 110; x += 18) { const lit = .5 + .5 * (BX + 40 - x) / 150; c.fillStyle = `rgba(${104 + 46 * lit | 0},${86 + 36 * lit | 0},${60 + 26 * lit | 0},${(.45 + .3 * lit).toFixed(3)})`; c.beginPath(); c.ellipse(x, y, 8, 4.5, row % 2 ? .5 : -.5, 0, 6.2832); c.fill(); }
        g = c.createLinearGradient(BX - 100, 0, BX + 100, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,2,.55)'); c.fillStyle = g; c.fillRect(BX - 110, BY - 10, 220, 180); c.restore();
        c.strokeStyle = '#54452f'; c.lineWidth = 7; c.beginPath(); c.moveTo(BX - 90, BY + 1); c.quadraticCurveTo(BX, BY + 22, BX + 90, BY + 1); c.stroke();
        c.strokeStyle = '#3c3020'; c.lineWidth = 10; c.beginPath(); c.moveTo(BX - 76, BY + 6); c.bezierCurveTo(BX - 66, BY - 110, BX + 66, BY - 110, BX + 76, BY + 6); c.stroke(); c.strokeStyle = 'rgba(190,170,130,.4)'; c.lineWidth = 3; c.beginPath(); c.moveTo(BX - 79, BY + 2); c.bezierCurveTo(BX - 69, BY - 112, BX - 10, BY - 92, BX, BY - 88); c.stroke();
        // the brass pail: a warm gleam on the window's side, dark on the far side, a rim and a bail
        g = c.createLinearGradient(PX - 62, 0, PX + 62, 0); g.addColorStop(0, '#8a6e34'); g.addColorStop(.16, '#d2b868'); g.addColorStop(.3, '#8e6e30'); g.addColorStop(.75, '#4a3416'); g.addColorStop(1, '#22180a'); c.fillStyle = g; pailShape(c);
        c.fillStyle = '#54432a'; c.fillRect(PX - 66, PY - 6, 132, 12); c.fillStyle = 'rgba(220,210,170,.45)'; c.fillRect(PX - 64, PY - 6, 40, 3);
        c.strokeStyle = 'rgba(60,40,18,.55)'; c.lineWidth = 2; for (const y of [PY + 40, PY + 96]) { c.beginPath(); c.moveTo(PX - 58, y); c.lineTo(PX + 56, y); c.stroke(); }
        c.strokeStyle = '#3a2a14'; c.lineWidth = 5; c.beginPath(); c.moveTo(PX - 60, PY + 4); c.quadraticCurveTo(PX, PY - 70, PX + 60, PY + 4); c.stroke();
        for (const [nx, ny] of [[BX, BY - 84], [PX, PY - 46]]) { c.fillStyle = '#0e0905'; c.beginPath(); c.arc(nx, ny, 6, 0, 6.2832); c.fill(); c.fillStyle = 'rgba(220,210,190,.35)'; c.beginPath(); c.arc(nx - 1.5, ny - 1.5, 2, 0, 6.2832); c.fill(); }
      },
      near(c, r) {
        // THE DELFT TILES at the wall's foot: a row of real tiles, each off-white with its own small blue figure, grout between, the light on
        // those near the window, the rest falling into the shade
        const TH = 58, TY = FY - TH;
        c.fillStyle = '#1a120b'; c.fillRect(EX.x0, TY - 6, EX.x1 - EX.x0, TH + 6);
        let k = 0; for (let x = EX.x0 + 120; x < EX.x1 - 120; x += TH, k++) { const lit = Math.max(.12, 1 - Math.max(0, x - 500) / 2200), t0 = 70 + 120 * lit;
          c.fillStyle = `rgb(${t0 | 0},${t0 * .97 | 0},${t0 * .86 | 0})`; c.fillRect(x + 2, TY + 2, TH - 4, TH - 4);
          c.strokeStyle = `rgba(32,58,150,${(.6 * lit + .12).toFixed(3)})`; c.lineWidth = 2.6; const cx = x + TH / 2, cy = TY + TH / 2, f = k % 5;
          c.beginPath(); for (const [a, b] of [[x + 6, TY + 6], [x + TH - 6, TY + 6], [x + 6, TY + TH - 6], [x + TH - 6, TY + TH - 6]]) { c.moveTo(a - 3, b); c.lineTo(a + 3, b); c.moveTo(a, b - 3); c.lineTo(a, b + 3); } c.stroke();
          c.beginPath(); if (f === 0) { c.arc(cx, cy, 9, 0, 6.2832); } else if (f === 1) { c.moveTo(cx - 10, cy + 10); c.lineTo(cx - 10, cy - 2); c.lineTo(cx, cy - 11); c.lineTo(cx + 10, cy - 2); c.lineTo(cx + 10, cy + 10); } else if (f === 2) { c.moveTo(cx, cy + 12); c.lineTo(cx, cy - 4); c.moveTo(cx - 8, cy - 2); c.quadraticCurveTo(cx, cy - 16, cx + 8, cy - 2); } else if (f === 3) { c.moveTo(cx - 12, cy + 6); c.quadraticCurveTo(cx - 4, cy - 4, cx + 2, cy + 4); c.quadraticCurveTo(cx + 8, cy - 8, cx + 12, cy + 2); } else { c.moveTo(cx - 9, cy + 9); c.lineTo(cx, cy - 10); c.lineTo(cx + 9, cy + 9); c.moveTo(cx - 5, cy + 1); c.lineTo(cx + 5, cy + 1); } c.stroke();
          c.fillStyle = `rgba(0,0,0,${(.25 * (1 - lit)).toFixed(3)})`; c.fillRect(x + 2, TY + 2, TH - 4, TH - 4); }
        c.fillStyle = 'rgba(14,9,5,.7)'; c.fillRect(EX.x0, TY - 8, EX.x1 - EX.x0, 4);
        // the floorboards: each board its own tone, seams, a little grain, the moon's light lying flat on them near the window
        for (let x = EX.x0 + 110, i = 0; x < EX.x1 - 110; i++) { const w = 150 + r() * 120, t = .8 + r() * .35; c.fillStyle = `rgba(${74 * t | 0},${46 * t | 0},${26 * t | 0},.4)`; c.fillRect(x, FY + 3, w, EX.y1 - FY); c.fillStyle = 'rgba(6,4,2,.55)'; c.fillRect(x, FY + 3, 3, EX.y1 - FY); x += w; }
        const fl = small(60, 12, (q) => { const fg = q.createRadialGradient(18, 0, 0, 18, 0, 34); fg.addColorStop(0, 'rgba(230,214,170,.45)'); fg.addColorStop(1, 'rgba(230,214,170,0)'); q.fillStyle = fg; q.fillRect(0, 0, 60, 12); });
        c.save(); c.globalCompositeOperation = 'screen'; c.drawImage(fl, EX.x0, FY + 3, EX.x1 - EX.x0, 90); c.restore();
        // the foot warmer on the boards (the Milkmaid's little wooden box with its holes), lit on the window's side
        const FX = 2040, FW = 84, FH = 70; c.fillStyle = '#2e2014'; c.fillRect(FX, FY - FH, FW, FH); c.fillStyle = '#4a3620'; c.fillRect(FX, FY - FH, 7, FH); c.fillStyle = '#3a2a18'; c.fillRect(FX - 4, FY - FH - 6, FW + 8, 8);
        c.fillStyle = '#120b06'; for (let yy = FY - FH + 16; yy < FY - 8; yy += 18) for (let xx = FX + 16; xx < FX + FW - 8; xx += 18) { c.beginPath(); c.arc(xx, yy, 3.4, 0, 6.2832); c.fill(); }
        c.fillStyle = 'rgba(0,0,0,.45)'; c.beginPath(); c.ellipse(FX + FW / 2 + 30, FY + 4, 70, 7, 0, 0, 6.2832); c.fill();
        // a chair in the dark at the far right, against the wall: a turned high back with two finials, lost in the shade
        const CX = 3080; c.fillStyle = '#100a06'; c.fillRect(CX, FY - 430, 14, 430); c.fillRect(CX + 150, FY - 430, 14, 430); c.fillRect(CX - 10, FY - 230, 184, 26); c.fillRect(CX, FY - 400, 164, 70);
        for (const fx of [CX + 7, CX + 157]) { c.beginPath(); c.arc(fx, FY - 446, 15, 0, 6.2832); c.fill(); }
        c.fillStyle = 'rgba(120,126,120,.08)'; c.fillRect(CX, FY - 400, 4, 400);
        // Vermeer's ultramarine: a cushion on the seat and a cloth thrown over the chair's back, dim in the shade, a little lit on the window's side
        let cg = c.createLinearGradient(CX - 10, 0, CX + 180, 0); cg.addColorStop(0, '#24386a'); cg.addColorStop(1, '#0e1628'); c.fillStyle = cg; c.beginPath(); c.moveTo(CX - 14, FY - 232); c.quadraticCurveTo(CX + 80, FY - 262, CX + 178, FY - 232); c.lineTo(CX + 176, FY - 212); c.quadraticCurveTo(CX + 80, FY - 200, CX - 12, FY - 212); c.closePath(); c.fill();
        cg = c.createLinearGradient(CX, 0, CX + 170, 0); cg.addColorStop(0, '#2a4072'); cg.addColorStop(1, '#0f1a2e'); c.fillStyle = cg; c.beginPath(); c.moveTo(CX + 20, FY - 414); c.quadraticCurveTo(CX + 90, FY - 428, CX + 168, FY - 408); c.bezierCurveTo(CX + 176, FY - 360, CX + 170, FY - 300, CX + 160, FY - 250); c.bezierCurveTo(CX + 130, FY - 262, CX + 110, FY - 300, CX + 90, FY - 330); c.bezierCurveTo(CX + 60, FY - 350, CX + 30, FY - 380, CX + 20, FY - 414); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(10,16,34,.5)'; c.lineWidth = 3; for (const fx of [CX + 110, CX + 140]) { c.beginPath(); c.moveTo(fx, FY - 414); c.quadraticCurveTo(fx + 8, FY - 340, fx + 14, FY - 270); c.stroke(); }
        // a last glaze: the shade warmed, the far corners into the dark (the painting's own falling-off)
        let g = c.createRadialGradient(700, 720, 300, 700, 720, 3000); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(40,26,8,.12)'); g.addColorStop(1, 'rgba(14,9,3,.5)'); c.fillStyle = g; c.fillRect(EX.x0, EX.y0, EX.x1 - EX.x0, EX.y1 - EX.y0);
      } });
  }
  if (!PAINTED) { const n = 'room2-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = DRAWN ? bakeR2() : bakeR2s())); pic('room2-girl'); pic('room2-sweeper'); }
  if (D4) { const n = 'room4-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR4())); pic('room4-caster2'); pic('room4-pourer'); }
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
  // ============================================================
  // THE HOUSE DRAWN IN CODE (build 424; owner: "can you start to redo each room"). One shell for every room, so a beam,
  // a skirting board or a doorway in one room is the same in the next (a design critic's rule: no room draws its own wall).
  // The house is seen as a SECTION, flat: the back wall frontal, the two end walls cut edge-on at the picture's sides
  // (near-black, open below the lintel where there is a door), the beam one band under the ceiling, the floor one tone.
  // It is night in every room. Enter by the left door, leave by the right. Plate px (3168 x 1344), baked at half size.
  // Four darks shared by every room: frame #0c0705, beam #150d08, unlit plaster #2c1d13, floor #1d130c.
  // ============================================================
  const HOUSE = { FY: 1250, CEIL: -300, BEAM: 44, SKIRT: 28, LINTEL: 320, END: 110 };
  function lightPool(c, x, y, r, lit, half, a = 1) {
    // the gate's fall-off: full at the light, .4 at 30% of the radius, .12 at 55%, nothing beyond
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, css(lit, a)); g.addColorStop(.3, css(lit, .55 * a)); g.addColorStop(.42, css(half, .5 * a)); g.addColorStop(.55, css(half, .22 * a)); g.addColorStop(1, css(half, 0));
    c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  // HIGHER ROOMS (build 440; owner: "the characters are too big on screen - either enlarge room height (think arched or vaulted ceilings) or zoom
  // out", then "Let's do it"): every drawn room is baked on a canvas wider and much taller than the old plate (EX, in plate px; the old plate's
  // coordinates are unchanged), the view drawn back so the room still fills the width, and the space above the people is a great dark under a
  // ceiling shaped for the room: 'beams' (a high beamed ceiling), 'vault' (a stone barrel vault, the cellar), 'rafters' (an open roof, upstairs).
  const EX = { x0: -360, x1: 3528, y0: -700, y1: 1344 };
  function mkBake() {
    const cv = document.createElement('canvas'); cv.width = (EX.x1 - EX.x0) / 2; cv.height = (EX.y1 - EX.y0) / 2; cv.ex = true;
    const c = cv.getContext('2d'); c.scale(.5, .5); c.translate(-EX.x0, -EX.y0); return [cv, c];
  }
  function bakeShell(o) {
    const [cv, c] = mkBake(), X0 = EX.x0, XW = EX.x1 - EX.x0, Y0 = EX.y0, YH = EX.y1 - EX.y0;
    const { FY, BEAM, LINTEL, END } = HOUSE, CEIL = o.ceil != null ? o.ceil : HOUSE.CEIL, SKIRT = o.skirt === 0 ? 0 : HOUSE.SKIRT, r = rngR(o.seed || 7), soft = (draw, w, h) => { const a = document.createElement('canvas'); a.width = w; a.height = h; draw(a.getContext('2d'), w, h); return a; };
    // the back wall: unlit plaster, then the room's one light as a soft pool on it
    c.fillStyle = o.wallC || '#2c1d13'; c.fillRect(X0, Y0, XW, YH);
    c.save(); c.beginPath(); c.rect(X0, Y0, XW, FY - Y0); c.clip();
    for (const L of o.lights || []) { c.save(); c.translate(L.x, L.y); c.scale(L.sx || 1.25, 1); c.translate(-L.x, -L.y); lightPool(c, L.x, L.y, L.r, L.lit, L.half, L.a || 1); c.restore(); }
    // plaster grain at three sizes, the same strength in every room (soft-light, so the light still rules); no cracks, no stains with edges
    for (const [nw, cnt, rmax, al] of [[48, 90, 6, .03], [150, 600, 5, .022], [520, 5600, 2.2, .03]]) {
      const nh = Math.round(nw * YH / XW), t = soft((x, w, h) => { for (let i = 0; i < cnt; i++) { x.fillStyle = r() < .5 ? `rgba(40,26,14,${al + r() * al})` : `rgba(255,232,200,${al + r() * al})`; x.beginPath(); x.arc(r() * w, r() * h, .6 + r() * rmax, 0, 6.2832); x.fill(); } }, nw, nh);
      c.save(); c.globalCompositeOperation = 'soft-light'; c.drawImage(t, X0, Y0, XW, YH); c.restore();
    }
    c.restore();
    o.wall && o.wall(c, r);
    // THE CEILING, high above them, falling into the dark (a beam's warm arris only where the light reaches)
    const dk = '#0d0805', bm = o.beamC || '#150d08', roof = o.roof || 'beams';
    if (roof === 'vault') {
      // a stone barrel vault springing from the walls at SPR and rising to its crown at CEIL, the stone above it lost in the dark
      const SPR = o.spring || CEIL + 520, cx = (X0 + EX.x1) / 2, rx = XW / 2 + 40;
      c.fillStyle = dk; c.beginPath(); c.moveTo(X0, Y0); c.lineTo(X0, SPR); c.ellipse(cx, SPR, rx, SPR - CEIL, 0, Math.PI, 0); c.lineTo(EX.x1, Y0); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(110,92,70,.22)'; c.lineWidth = 5; c.beginPath(); c.ellipse(cx, SPR, rx, SPR - CEIL, 0, Math.PI, 0); c.stroke();
      // a faint line of voussoir joints along the arch's face
      c.strokeStyle = 'rgba(6,4,3,.4)'; c.lineWidth = 3; for (let k = 1; k < 26; k++) { const t = Math.PI + Math.PI * k / 26, x = cx + rx * Math.cos(t), y = SPR + (SPR - CEIL) * Math.sin(t); c.beginPath(); c.moveTo(x, y); c.lineTo(cx + (rx + 60) * Math.cos(t), SPR + (SPR - CEIL + 60) * Math.sin(t)); c.stroke(); }
    } else if (roof === 'rafters') {
      // an open timber roof: the wall-plate at CEIL, a tie-beam across, rafters rising to the ridge in the dark, braces in each bay
      const RID = Y0 + 40; c.fillStyle = dk; c.fillRect(X0, Y0, XW, CEIL - Y0);
      c.fillStyle = bm; c.fillRect(X0, CEIL, XW, BEAM); c.fillRect(X0, CEIL - 260, XW, 30);
      c.strokeStyle = bm; c.lineWidth = 26; for (let x = X0 + 200; x < EX.x1; x += 620) { c.beginPath(); c.moveTo(x, CEIL); c.lineTo(x + 300, RID); c.stroke(); c.beginPath(); c.moveTo(x + 600, CEIL); c.lineTo(x + 300, RID); c.stroke(); c.lineWidth = 16; c.beginPath(); c.moveTo(x + 300, CEIL - 260); c.lineTo(x + 300, RID); c.stroke(); c.lineWidth = 26; }
    } else {
      // a high beamed ceiling: the joists' underside a dark band, a great beam under it, beam ends every bay
      c.fillStyle = dk; c.fillRect(X0, Y0, XW, CEIL - Y0);
      c.fillStyle = bm; c.fillRect(X0, CEIL, XW, BEAM);
      for (let x = X0 + 140; x < EX.x1; x += 300) c.fillRect(x, CEIL - 70, 46, 70);
    }
    for (const L of o.lights || []) { const g = c.createLinearGradient(L.x - L.r * .7, 0, L.x + L.r * .7, 0); g.addColorStop(0, css(L.lit, 0)); g.addColorStop(.5, css(L.lit, .3 * (L.a || 1))); g.addColorStop(1, css(L.lit, 0)); c.fillStyle = g; if (roof !== 'vault') c.fillRect(L.x - L.r * .7, CEIL + BEAM - 3, L.r * 1.4, 3); }
    // the wall darkens upward into the high ceiling's dark (so the light stays a pool low round the people)
    let g = c.createLinearGradient(0, CEIL, 0, CEIL + 700); g.addColorStop(0, 'rgba(10,6,4,.65)'); g.addColorStop(1, 'rgba(10,6,4,0)'); c.fillStyle = g;
    if (roof === 'vault') { c.save(); const SPR = o.spring || CEIL + 520, cx = (X0 + EX.x1) / 2, rx = XW / 2 + 40; c.beginPath(); c.moveTo(X0, FY); c.lineTo(X0, SPR); c.ellipse(cx, SPR, rx, SPR - CEIL, 0, Math.PI, 0); c.lineTo(EX.x1, FY); c.closePath(); c.clip(); c.fillRect(X0, CEIL, XW, 700); c.restore(); }
    else c.fillRect(X0, CEIL + BEAM, XW, 700);
    // the skirting board, and the floor: one tone, a thin lighter top edge; the light lies on it flat
    if (SKIRT) { c.fillStyle = '#1a110b'; c.fillRect(X0, FY - SKIRT, XW, SKIRT); }
    c.fillStyle = o.floorC || '#1d130c'; c.fillRect(X0, FY, XW, EX.y1 - FY);
    c.fillStyle = 'rgba(120,84,52,.22)'; c.fillRect(X0, FY, XW, 3);
    for (const L of o.lights || []) { c.save(); c.beginPath(); c.rect(X0, FY - SKIRT, XW, EX.y1); c.clip(); c.translate(L.x, FY + 20); c.scale(1, .12); lightPool(c, 0, 0, L.r * 1.1, L.lit, L.half, .8 * (L.a || 1)); c.restore(); }
    // the end walls, cut edge-on, at the picture's sides: near-black, open below the lintel where there is a door
    for (const [side, x0] of [['L', X0], ['R', EX.x1 - END]]) {
      c.fillStyle = '#0c0705'; c.fillRect(x0, Y0, END, YH);
      if (o.doors && o.doors.includes(side)) { c.fillStyle = '#070403'; c.fillRect(x0, LINTEL, END, EX.y1 - LINTEL); c.fillStyle = '#3a2616'; c.fillRect(side === 'L' ? x0 + END - 6 : x0, LINTEL, 6, FY - LINTEL); c.fillRect(x0, LINTEL - 6, END, 6); }
    }
    o.near && o.near(c, r);
    return cv;
  }
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
  const R7 = { BED: [200, 331, 1450, 1281], MAN: [960, 840], WALL: [1600, 2500], GOLD: [2050, 420] };
  function bakeR7() {
    return bakeShell({ seed: 77, doors: 'R', roof: 'rafters', ceil: 120, wallC: '#24140f', floorC: '#1d120b',
      lights: [{ x: 2050, y: 820, r: 1100, lit: [70, 44, 34], half: [40, 24, 18], a: .7 }, { x: 760, y: 900, r: 800, lit: [64, 40, 30], half: [36, 22, 16], a: .6 }] });
  }
  if (!PAINTED) { const n = 'room7-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR7())); }
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
  if (!PAINTED) { const n = 'room3-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR3())); }
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
  if (!PAINTED) { const n = 'room5-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR5())); }
  // a standing person as a soft dark silhouette (crowd, writer, guards), height h, at x on the line y; a helmet if armed
  function sil(c, x, y, h, col, armed, lean = 0) {
    // a robed or armoured body narrowing to the shoulders, a neck, a small head (an adult is about seven heads tall)
    const sh = h * .12, hem = h * .1, hd = h * .062; c.fillStyle = col; c.beginPath(); c.moveTo(u(x - hem), v(y)); c.bezierCurveTo(u(x - hem * .9), v(y - h * .4), u(x - sh * 1.05 + lean), v(y - h * .6), u(x - sh + lean), v(y - h * .8));
    c.quadraticCurveTo(u(x - sh * .6 + lean), v(y - h * .845), u(x - hd * .55 + lean), v(y - h * .85)); c.lineTo(u(x + hd * .55 + lean), v(y - h * .85)); c.quadraticCurveTo(u(x + sh * .6 + lean), v(y - h * .845), u(x + sh + lean), v(y - h * .8));
    c.bezierCurveTo(u(x + sh * 1.05 + lean), v(y - h * .6), u(x + hem * .9), v(y - h * .4), u(x + hem), v(y)); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(u(x + lean * 1.1), v(y - h * .9), hd * .85 * S, hd * S, 0, 0, 6.2832); c.fill();
    if (armed) { c.beginPath(); c.ellipse(u(x + lean * 1.1), v(y - h * .925), hd * 1.25 * S, hd * .75 * S, 0, Math.PI, 0); c.fill(); c.fillRect(u(x + lean * 1.1 - hd * 1.6), v(y - h * .925), hd * 3.2 * S, Math.max(1, hd * .18 * S)); }
  }
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
  if (!PAINTED) { loads['door-drawn'] = new Promise(r => setTimeout(r, 0)).then(() => (pics['door-drawn'] = bakeDoorScene(false))); loads['leave-drawn'] = new Promise(r => setTimeout(r, 0)).then(() => (pics['leave-drawn'] = bakeDoorScene(true))); }
  if (!PAINTED) { const n = 'room1-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = bakeR1())); }
  const ROOMS = {
    door: {
      pic: PAINTED ? 'room-door' : 'door-drawn', shell: PAINTED ? 0 : 1, FY: 1200, cam0: 210, tone: [80, 74, 90], k: .58,
      light(x) { return x < DOOR.x - 100 ? { x: DOOR.x, a: .6 * this.d, col: [230, 140, 70] } : null; },
      enter() { this.d = 0; this.kn = 0; this.ia = 0; this.cut = 0; this.cw = 0; SEEN_R.clear(); },
      cutLit(id) { return id === 'door' ? .5 : 0; },
      run() { talk([[N, 'Then he went on till he came to the house of the Interpreter, and knocked over and over.']], () => { this.cw = 0; talk([[TIP, 'Knock on the door.', 'knock']], () => { ph = 'open'; t = 0; G.state = 'auto'; }); }); },
      act(sx, sy) { if (G.act === 'knock' && (sx == null || near(sx, sy, DOOR.x, 950, 150))) { knockS(); if (++this.kn >= 3) next(true); } },
      upd() {
        this.cut += ((this.cw ? 1 : 0) - this.cut) * (this.cw ? .03 : .05); if (this.cut < .003) this.cut = 0;
        if (G.act === 'knock' && G.actT >= 90 && !G.ring) G.ring = ring(DOOR.x, 950);
        if (ph === 'open') { this.d = Math.min(1, this.d + .012); if (t > 50) this.ia = Math.min(1, this.ia + .02); if (t === 1 && audio()) { tone(98, 'sine', .05, 2.2); noise(300, 3, 1.4, .05); }
          if (t === 150) talk([[C, 'Sir, the man at the gate said that if I called here, you would show me excellent things, to help me on my journey.'], [I, 'Come in. I will show you what will help you.']], () => goTo('r1')); }
      },
      under(c) { const self = this; doorLight(c, this.d, () => { if (self.ia > .01) visitor(c, 'I', DOOR.x, -1, .58, self.ia); }); if (PAINTED) { glow(c, u(2832), v(380), 120, [255, 190, 110], .1 + .03 * Math.sin(G.t / 40)); glow(c, u(470), v(1000), 70, [255, 160, 80], .2 + .08 * Math.sin(G.t / 7) * Math.sin(G.t / 13)); } else { glow(c, u(HSE.WIN[0]), v(HSE.WIN[1]), 120, [255, 190, 110], (.12 + .03 * Math.sin(G.t / 40)) * (1 - .5 * this.d)); glow(c, u(700), v(1160), 40, [255, 160, 80], .3 + .1 * Math.sin(G.t / 7) * Math.sin(G.t / 13)); } },
      people(c) { visitor(c, 'C', 1880, 1, .58); },
    },
    // 1 A PRIVATE ROOM, drawn in code (build 424). The book ({72}): "he commanded his man to light the candle ... and bid his man open a door;
    // the which when he had done, Christian saw the picture of a very grave person hang up against the wall". Three touches, each a story move:
    // the candle (his man lights it), the door in the wall (his man opens it), the crown (it shines as the Interpreter tells what it means).
    r1: PAINTED ? null : {
      pic: 'room1-drawn', shell: 1, FY: HOUSE.FY, tone: [150, 128, 108], toneC: [118, 100, 86], k: 1,
      light() { return { x: R1.CAN[0], a: .55 * smooth(.2, 1, this.lit) * (1 + .05 * Math.sin(G.t / 5)), col: [255, 190, 120] }; },
      enter() { this.lit = 0; this.door = 0; this.crown = 0; this.serv = 0; this.zin = 1; this.vx = 0; pic('room1-portrait2'); pic('room1-servant'); },
      run() { talk([[TIP, 'Touch the candle.', 'candle']], () => { ph = 'light'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) {
        if (G.act === 'candle' && (sx == null || near(sx, sy, R1.CAN[0], R1.CAN[1], 170))) { next(true); if (audio()) { noise(2500, 2, .4, .06); note(72, .03, 2); } }
        if (G.act === 'opendoor' && (sx == null || near(sx, sy, 1870, 670, 300))) { next(true); if (audio()) { tone(140, 'sawtooth', .025, .9, 0, 400); noise(700, 6, .6, .03); } }
        if (G.act === 'crown' && (sx == null || near(sx, sy, R1.CROWN[0], R1.CROWN[1], 170))) { next(true); this.crown = 1; if (audio()) { note(88, .025, 2.4); note(95, .018, 2.4, .12); } }
      },
      upd() {
        if (G.act === 'candle' && G.actT >= 70 && !G.ring) G.ring = ring(R1.CAN[0], R1.CAN[1]);
        if (G.act === 'opendoor' && G.actT >= 70 && !G.ring) G.ring = ring(1870, 670);
        if (G.act === 'crown' && G.actT >= 70 && !G.ring) G.ring = ring(R1.CROWN[0], R1.CROWN[1]);
        if (ph === 'light') { this.lit = Math.min(1, this.lit + .006);
          if (t === 190) talk([[TIP, 'Touch the door in the wall.', 'opendoor']], () => { ph = 'open'; t = 0; G.state = 'auto'; }); }
        if (ph === 'open') { this.door = Math.min(1, this.door + .009); this.serv = Math.min(1, this.serv + .01);
          if (t === 170) talk([[C, 'What does this mean?'], [I, 'His eyes are lifted up to heaven, the best of books is in his hand, and the world is behind his back. A crown of gold hangs over his head.'], [TIP, 'Touch the crown.', 'crown']], () => { ph = 'crown'; t = 0; G.state = 'auto'; }); }
        if (ph === 'crown' && t === 70) talk([[I, 'He is the only man the Lord has sent to be your guide in hard places. Take good heed, lest you meet some who pretend to lead you right, but their way goes down to death.']], () => goTo('r2'));
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
          this.tip = [sx + 187, R.FY - 617];
          fig(c, 'room1-servant', { ax: 85, g: 780, s: .8, ct: 1, mul: 1, sat: 1, noSh: 1 }, sx, R.FY, -1, 1, 1, [150, 136, 124]);
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
      run() { talk([[TIP, 'Touch the candle.', 'candle']], () => { ph = 'light'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if (G.act === 'candle' && (sx == null || near(sx, sy, 1478, 760, 150))) { next(true); if (audio()) { noise(2500, 2, .4, .06); note(72, .03, 2); } } },
      upd() {
        if (G.act === 'candle' && G.actT >= 70 && !G.ring) G.ring = ring(1478, 760);
        if (ph === 'light') { this.lit = Math.min(1, this.lit + .0075); if (t === 160) talk([[C, 'What does this mean?'], [I, 'His eyes are lifted up to heaven, the best of books is in his hand, and the world is behind his back. A crown of gold hangs over his head.'], [I, 'He is the only man the Lord has sent to be your guide in hard places. Take good heed, lest you meet some who pretend to lead you right, but their way goes down to death.']], () => goTo('r2')); }
      },
      people(c) { visitor(c, 'I', 2490, -1); visitor(c, 'C', 2790, -1); },
      over(c) {
        const L = smooth(0, 1, this.lit), fl = 1 + .05 * Math.sin(G.t / 5) * Math.sin(G.t / 11);
        darkWith(c, [[u(1720), v(926), 70 + 40 * L, .9], [u(1478), v(716), (60 + 1100 * L) * fl, Math.min(1, L * 3)]], .9 - .62 * L);
        glow(c, u(1720), v(926), 26, [255, 200, 120], .5 * (1 - L) + .1);
        if (L > .01) { glow(c, u(1478), v(716), 60 * fl, [255, 210, 140], .45 * L); glow(c, u(815), v(302), 40 + 6 * Math.sin(G.t / 30), [255, 220, 120], .25 * smooth(.5, 1, this.lit)); }
      },
    },
    // 2 THE DUSTY PARLOUR (after Vermeer's Milkmaid): the broom raises the dust; the water lays it
    r2: {
      pic: PAINTED ? 'room2-dry' : 'room2-drawn', shell: PAINTED || DRAWN ? 0 : 1, FY: PAINTED || DRAWN ? 1262 : HOUSE.FY, cam0: 140, tone: PAINTED ? [360, 346, 322] : [210, 206, 200], noShadow: 1,
      // the sweeper and the girl move by free clips laid back into the painting where they move (build 364): SW his sweep (a loop),
      // DM her jug from pouring (frame 0) to held upright (14), shown at 14 until she pours; x, y, W, H in the asset's own pixels, the sheets at .7 (the clip's own resolution)
      SW: { n: 'room2-sweep', x: 1770, y: 375, W: 417, H: 680, sw: 292, sh: 476, cols: 8, fr: 49 }, DM: { n: 'room2-damsel', x: 1261, y: 380, W: 359, H: 675, sw: 251, sh: 472, cols: 8, fr: 15 },
      ov(c, o, f) { const im = pics[o.n]; if (!im) return; f = Math.max(0, Math.min(o.fr - 1, Math.round(f))); c.drawImage(im, (f % o.cols) * o.sw, Math.floor(f / o.cols) * o.sh, o.sw, o.sh, u(o.x / K), v(o.y / K), o.W / K * S, o.H / K * S); },
      under(c) {
        if (PAINTED) { this.ov(c, this.DM, this.df); this.ov(c, this.SW, this.sf); return; }
        // the drawn room: the girl (stand-in: his wife's picture) holding the jug, which tips as she pours; the sweeper (stand-in: Help) and his broom
        const FY = this.FY + (this.shell ? 0 : 14), G2 = R2D.girl, SW2 = R2D.sweeper, col = this.shell ? [186, 186, 198] : [255, 255, 255];
        // the girl: cut straight out of the painting (build 382), so she is the painted Milkmaid herself, her jug already in her hands;
        // the water falls from its spout when the child has touched it
        if (pics['room2-girl']) fig(c, 'room2-girl', G2, R2D.GX, FY + 6, -1, 1, 1, col);
        this.spout = [R2D.GX + R2D.SPOUT[0] / K, FY + 6 + R2D.SPOUT[1] / K];
        // the sweeper: his own picture (build 384, the free FLUX Kontext model from the painted boy: a bearded servant in a linen cap
        // and brown doublet, bent to the broom with both hands on the handle), the broom's head where the dust rises
        if (pics['room2-sweeper']) fig(c, 'room2-sweeper', SW2, R2D.SX, FY, -1, 1, 1, col);
      },
      enter() { pic('room2-sweep'); pic('room2-damsel'); this.sf = 0; this.sweeps = 0; this.df = 14; this.dt = 14; this.dust = []; this.haze = .22; this.wet = []; const r = rngR(5); for (let i = 0; i < 70; i++) this.dust.push({ x: 300 + r() * 2800, y: 300 + r() * 900, vx: 0, vy: 0, s: 2 + r() * 5, a: .5 + r() * .5, p: r() * 7 }); },
      run() { talk([[N, 'He led him into a very large parlour, full of dust, because it was never swept.'], [TIP, 'Touch the broom.', 'broom']], () => { ph = 'sweep'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) {
        if (G.act === 'broom' && (sx == null || near(sx, sy, 2390, 1180, 160))) next(true);
        if (G.act === 'jug' && (sx == null || near(sx, sy, 1900, 860, 160))) next(true);
      },
      upd() {
        if (G.act === 'broom' && G.actT >= 70 && !G.ring) G.ring = ring(2390, 1200);
        if (G.act === 'jug' && G.actT >= 70 && !G.ring) G.ring = ring(1900, 840);
        // his strokes at the clip's own pace (16 a second); each sweep is whole loops, ending where it began
        if (this.sweeps > 0) { this.sf += 16 / 60; if (this.sf >= this.SW.fr - 1) { this.sf = 0; this.sweeps--; } }
        // her jug eases toward its target frame at 12 a second (14 held upright, 0 pouring)
        if (this.df !== this.dt) this.df += Math.sign(this.dt - this.df) * Math.min(12 / 60, Math.abs(this.dt - this.df));
        if (ph === 'sweep') {
          if (t === 1) this.sweeps = 2;
          if (t < 300 && this.sweeps > 0 && t % 2 === 0) for (let k = 0; k < 6; k++) this.dust.push({ x: 2390 + (rnd() - .5) * 120, y: 1240 - rnd() * 40, vx: -1 - rnd() * 6, vy: -.6 - rnd() * 2.2, s: 2 + rnd() * 6, a: .6 + rnd() * .4, p: rnd() * 7, life: 0 });
          if (t % 18 === 0 && t < 140) noise(1800, .8, .3, .06);
          this.haze = Math.min(.55, this.haze + .003);
          if (t === 120) cough(0); if (t === 200) cough(0);
          if (t === 270) talk([[I, 'Bring the water, and sprinkle the room.'], [TIP, 'Touch the jug.', 'jug']], () => { ph = 'sprinkle'; t = 0; G.state = 'auto'; });
        }
        if (ph === 'sprinkle') {
          // she tips the jug (the clip played backwards), pours while it is tipped, then holds it upright again; then he sweeps the room clean, no dust
          if (t === 1) this.dt = 0;
          if (t === 240) this.dt = 14;
          if (t === 260) this.sweeps = 1;
          const pour = this.df < 1.5 && t < 240;
          if (pour && t % 3 === 0) for (let k = 0; k < 2; k++) this.wet.push({ x: (!PAINTED && this.spout ? this.spout[0] : 1944) + rnd() * 14, y: !PAINTED && this.spout ? this.spout[1] : 842, vx: (rnd() - .5) * 1.2, vy: -rnd() * 1.5, l: 0 });
          if (pour && t % 24 === 0) noise(6000, 1, .4, .025);
          this.haze = Math.max(0, this.haze - .0028);
          for (const d of this.dust) { d.vy += .03; d.vx *= .96; }
          if (t === 330) talk([[C, 'What does this mean?'], [I, 'This parlour is the heart of a man. The dust is his sin. He who swept first is the Law: it stirs the dust up, but cannot make the heart clean.'], [I, 'She who brought the water is the Gospel. By it the heart is made clean, fit for the King of glory to live in.']], () => goTo('r3'));
        }
        for (const d of this.dust) { d.life = (d.life || 0) + 1; d.dr = d.dr || (.95 + rnd() * .04); d.vx *= d.dr; if (d.life > 120) d.a *= .99; if (Math.abs(d.x - 1900) < 160 && d.y < 1000) d.a *= .97; if (d.y < 1000) d.vy = Math.max(d.vy, 0); d.x += d.vx + Math.sin(G.t / 60 + d.p) * .4; d.y += d.vy; d.vx *= .985; d.vy = d.vy * .985 + (ph === 'sprinkle' ? .05 : -.004); if (ph === 'sprinkle' && d.y > 1240) d.a *= .9; }
        this.dust = this.dust.filter(d => d.a > .03 && d.y < 1400);
        for (const w of this.wet) { w.vy += .35; w.x += w.vx; w.y += w.vy; w.l++; }
        this.wet = this.wet.filter(w => w.y < 1260);
      },
      people(c) { if (PAINTED) { visitor(c, 'I', 690, 1, 1, 1, -48); visitor(c, 'C', 470, 1, 1, 1, -48); } else { visitor(c, 'C', 820, 1); visitor(c, 'I', 1100, 1); } },
      over(c) {
        const hz = Math.min(.2, this.haze * .75) * (this.shell ? .35 : 1), LS = R.lshape, im = pics[R.pic];
        if (LS && im) {
          const W2 = im.width / LS.k * S, H2 = im.height / LS.k * S, hc = this.hc || (this.hc = document.createElement('canvas')); hc.width = 160; hc.height = Math.round(160 * im.height / im.width);
          const hx = hc.getContext('2d'); hx.globalCompositeOperation = 'source-over'; hx.fillStyle = css([170, 150, 120], hz); hx.fillRect(0, 0, hc.width, hc.height); hx.globalCompositeOperation = 'destination-in'; hx.drawImage(im, 0, 0, hc.width, hc.height);
          c.restore(); c.drawImage(hc, u((LS.bx - LS.ox) / LS.k), v((LS.by - LS.oy) / LS.k), W2, H2); c.save();
        } else { c.fillStyle = css([170, 150, 120], hz); if (this.shell) c.fillRect(u(EX.x0), v(EX.y0), (EX.x1 - EX.x0) * S, (EX.y1 - EX.y0) * S); else c.fillRect(u(0), v(0), (R.PW || 3168) * S, PH * S); }
        for (const d of this.dust) { const a = Math.min(1, d.a * (.45 + this.haze)); const r = d.s * S * 3; const g = c.createRadialGradient(u(d.x), v(d.y), 0, u(d.x), v(d.y), r); g.addColorStop(0, css([206, 188, 160], a * .7)); g.addColorStop(1, css([196, 178, 150], 0)); c.fillStyle = g; c.fillRect(u(d.x) - r, v(d.y) - r, 2 * r, 2 * r); }
        c.fillStyle = 'rgba(200,215,225,.5)'; for (const w of this.wet) c.fillRect(u(w.x), v(w.y), 1.2, 2.4);
      },
    },
    // 3 A LITTLE ROOM, drawn on the house's shell (build 432): the boys cut from the old painting stand in their chairs on the drawn floor
    r3: PAINTED ? null : {
      pic: 'room3-drawn', shell: 1, FY: HOUSE.FY, tone: [190, 160, 130], k: 1, noShadow: 1,
      light(x) { return { x: R3.LANT[0], a: .3, col: [255, 200, 130] }; },
      enter() {
        this.bag = { show: false, a: 0, tip: 0, empty: 0 }; this.coins = []; this.bubbles = []; this.great = null; this.rags = 0; pic('room3-passion2'); pic('room3-patience2'); pic('room3-rags2');
      },
      run() {
        const self = this;
        talk([[N, 'In a little room sat two little children. The name of the eldest was Passion, and of the other, Patience.'], [C, 'Why is Passion so discontented?'], [I, 'He must wait for his best things till next year, but he will have all now. Patience is willing to wait.'], [N, 'Then one came to Passion, and brought him a bag of treasure.', null, () => { self.bag.show = true; }], [TIP, 'Touch the bag.', 'bag']], () => { ph = 'pour'; t = 0; G.state = 'auto'; if (audio()) note(79, .03, 1.6); });
      },
      act(sx, sy) { if (G.act === 'bag' && (sx == null || near(sx, sy, 1290 + R3.X, 1200, 160))) next(true); },
      upd() {
        const B = { x: 1290 + R3.X, y: 1244 }, HP = { x: 1120 + R3.X, y: 1248 }, bag = this.bag;
        if (bag.show) bag.a = Math.min(1, bag.a + .02);
        if (G.act === 'bag' && G.actT >= 70 && !G.ring) G.ring = ring(B.x, B.y - 30);
        if (ph === 'pour') {
          bag.tip = Math.min(1, bag.tip + .035);
          if (bag.tip > .6 && t < 120 && t % 2 === 0) for (let k = 0; k < 2; k++) this.coins.push({ x: B.x - 55, y: B.y - 30, vx: -1.6 - rnd() * 6.3, vy: -1.6 - rnd() * 3.7, rest: HP.y - 16 + rnd() * 26, on: false, rot: rnd() * 6, sp: (rnd() - .5) * .5, gl: rnd() * 300, gone: 0, a: 1 });
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
        talk([[N, 'In a little room sat two little children. The name of the eldest was Passion, and of the other, Patience.'], [C, 'Why is Passion so discontented?'], [I, 'He must wait for his best things till next year, but he will have all now. Patience is willing to wait.'], [N, 'Then one came to Passion, and brought him a bag of treasure.', null, () => { self.bag.show = true; }], [TIP, 'Touch the bag.', 'bag']], () => { ph = 'pour'; t = 0; G.state = 'auto'; if (audio()) note(79, .03, 1.6); });
      },
      act(sx, sy) { if (G.act === 'bag' && (sx == null || near(sx, sy, 1290, 1200, 160))) next(true); },
      upd() {
        const B = { x: 1290, y: 1230 }, HP = { x: 1120, y: 1234 }, bag = this.bag;
        if (bag.show) bag.a = Math.min(1, bag.a + .02);
        if (G.act === 'bag' && G.actT >= 70 && !G.ring) G.ring = ring(B.x, B.y - 30);
        if (ph === 'pour') {
          bag.tip = Math.min(1, bag.tip + .035);
          if (bag.tip > .6 && t < 120 && t % 2 === 0) for (let k = 0; k < 2; k++) this.coins.push({ x: B.x - 55, y: B.y - 30, vx: -1.6 - rnd() * 6.3, vy: -1.6 - rnd() * 3.7, rest: HP.y - 16 + rnd() * 26, on: false, rot: rnd() * 6, sp: (rnd() - .5) * .5, gl: rnd() * 300, gone: 0, a: 1 });
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
      under(c) { if (this.rags > 0 && pics['room3-rags']) { c.globalAlpha = smooth(0, 1, this.rags); c.drawImage(pics['room3-rags'], u(700), v(600), 570 * S, 720 * S); c.globalAlpha = 1; } },
      people(c) { visitor(c, 'I', 2420, -1, R.k, 1, 10); visitor(c, 'C', 2760, -1); },
      over(c) { drawBag(c, this.bag); drawCoins(c, this.coins); for (const b of this.bubbles) bubble(c, u(b.x), v(b.y), b.r * S, b.pop); if (this.great) bubble(c, u(this.great.x), v(this.great.y), this.great.r * S, this.great.pop); },
    },
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
        if (G.act === 'round') { if (G.actT >= 60 && !hold() && !G.ring) G.ring = ring(2172, 1000); if (hold()) { G.ring = null; this.rv = Math.min(1, this.rv + .0055); } if (this.rv >= 1) { next(true); G.state = 'auto'; ph = 'saw'; t = 0; } }
        cam.to = this.rv * (R.PW * S - VW);
        if (ph === 'saw' && t === 60) talk([[I, 'This is Christ, who with the oil of his grace keeps the work going in the heart. He stands behind the wall, for it is hard for the tempted to see it.']], () => goTo('r5'));
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
    // 5 THE PALACE AND THE BRAVE MAN (after Rembrandt's Night Watch)
    r5: {
      pic: PAINTED ? 'room5' : 'room5-drawn', shell: PAINTED ? 0 : 1, FY: 1262, cam0: 0, tone: PAINTED ? [225, 205, 180] : [150, 140, 140], k: .58, sat: .45,
      enter() { this.bv = { a: 0, arm: 0, x: 1650, go: 0, face: -1, done: 0 }; this.gold = 0; this.spark = []; this.said = 0; this.bv.f = 0; pic('room5-brave'); pic('room5-brave-armed'); sheetFrames(BRAVE.clip); },
      run() { const self = this; talk([[C, 'May we go in there?'], [N, 'At the door stood many men who wished to go in, but dared not, for men in armour kept it.', null, () => { self.bv.show = 1; }], [BR, 'Set down my name, Sir.'], [TIP, 'Touch the book.', 'book']], () => { ph = 'write'; t = 0; G.state = 'auto'; scratch(); }); },
      act(sx, sy) { if (G.act === 'book' && (sx == null || near(sx, sy, 1508, 1040, 150))) next(true); if (G.act === 'gold' && (sx == null || sy < v(520))) next(true); },
      upd() {
        const b = this.bv;
        if (b.show) b.a = Math.min(1, b.a + .03);
        if (G.act === 'book' && G.actT >= 70 && !G.ring) G.ring = ring(1508, 1030); if (G.act === 'gold' && G.actT >= 70 && !G.ring) G.ring = ring(2050, 360);
        cam.to = smooth(1500, 2500, b.x) * (R.PW * S - VW) * (ph === 'won' ? .25 : .45);
        if (ph === 'write' && t === 70) { ph = 'arm'; t = 0; noise(2000, 3, .4, .08); }
        if (ph === 'arm' && sheetFrames(BRAVE.clip)) {
          // the clip: he turns to the palace, arms himself and strides on; the line is said as he does
          if (t === 1) talk([[N, 'He drew his sword, put a helmet on his head, cut his way through them all, and pressed on into the palace.']], () => { this.said = 1; });
          b.clip = 1; b.f = Math.min(BRAVE.clip.fr - 1, b.f + WALK_FPT); b.x += BRAVE.clip.vpx * .68 * BRAVE.clip.s / K * WALK_FPT * smooth(0, 8, b.f);
          if (b.f >= BRAVE.clip.fr - 1) { b.clip = 0; b.arm = 1; b.face = 1; ph = 'fight'; t = 0; }
        } else if (ph === 'arm') { b.arm = Math.min(1, b.arm + .03); if (b.arm > .5) b.face = 1; if (t === 50) { ph = 'fight'; t = 0; talk([[N, 'He drew his sword, put a helmet on his head, cut his way through them all, and pressed on into the palace.']], () => { this.said = 1; }); } }
        if (ph === 'fight') {
          const x0 = b.x; b.x = Math.min(2490, b.x + 2.2);
          for (const gx of [1900, 2110, 2280, 2470]) if (x0 < gx && b.x >= gx) { clash(); for (let i = 0; i < 5; i++) this.spark.push({ x: gx + 60, y: 880 + rnd() * 120, vx: 2 + rnd() * 6, vy: -rnd() * 5, l: 18 }); }
          if (b.x >= 2490) { b.show = 0; b.a = Math.max(0, b.a - .02); if (b.a <= 0 && this.said) { ph = 'won'; t = 0; } }
        }
        if (ph === 'won' && t === 20) talk([[TIP, 'Touch the people on the top of the palace.', 'gold'], [VO, 'Come in, come in; Eternal glory thou shalt win.', null, () => { this.gold = 1; if (AMB) AMB.swell = 2.4; tone(hz(76), 'sine', .03, 3); tone(hz(79), 'sine', .025, 3, .2); tone(hz(84), 'sine', .02, 3, .4); }], [C, 'I think I know the meaning of this.']], () => goTo(darkOn() ? 'r6' : 'leave'));
        for (const s of this.spark) { s.x += s.vx; s.y += s.vy; s.vy += .3; s.l--; }
        this.spark = this.spark.filter(s => s.l > 0);
      },
      people(c) {
        if (PAINTED) { visitor(c, 'I', 210, 1, .58); visitor(c, 'C', 30, 1, .58); } else { visitor(c, 'C', 380, 1, .58); visitor(c, 'I', 560, 1, .58); }
        const b = this.bv; if (b.a > .01) {
          const bob = ph === 'fight' && b.x < 2490 ? Math.abs(Math.sin(G.t / 7)) * 3 : 0;
          if (b.clip) { const q = BRAVE.clip; fig(c, q.n + '#' + Math.floor(b.f), q, b.x, R.FY, -1, .68, b.a, [150, 125, 100], BR, 2.3); }
          else if (b.arm < 1) fig(c, BRAVE.plain.n, BRAVE.plain, b.x, R.FY, b.face, .68, b.a * (1 - b.arm), [150, 125, 100], BR, 2.3, bob);
          else if (b.arm > 0) fig(c, BRAVE.armed.n, BRAVE.armed, b.x, R.FY, 1, .68, b.a * b.arm, [150, 125, 100], BR, 2.3, bob);
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
      over(c) { c.strokeStyle = 'rgba(255,170,80,.75)'; c.lineWidth = 1.2; for (const s of this.spark) { c.beginPath(); c.moveTo(u(s.x), v(s.y)); c.lineTo(u(s.x - s.vx * 1.6), v(s.y - s.vy * 1.6)); c.stroke(); } if (ph === 'write' || ph === 'arm') glow(c, u(1508), v(1040), 40, [255, 230, 160], .3 * Math.sin(Math.min(1, t / 60) * Math.PI)); },
    },
    // 6 THE CELLAR, drawn on the house's shell (build 427): very dark; a thin shaft from the grating; the man in the iron cage, the bars drawn over him
    r6: PAINTED ? null : {
      pic: 'room6-drawn', shell: 1, FY: HOUSE.FY, tone: [120, 110, 100], k: 1, noShadow: 1,
      light(x) { return { x: R6.LAND, a: .12, col: [200, 200, 210] }; },
      enter() { this.shk = 0; this.motes = Array.from({ length: 26 }, () => ({ q: rnd(), o: rnd() * 7, s: .6 + rnd() * 1.4 })); pic('room6-caged'); },
      run() { talk([[C, 'Now let me go on my way.'], [I, 'Stay, till I have shown you a little more.'], [TIP, 'Touch the cage.', 'cage']], () => { creak(); this.shk = .6; ph = 'cage'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if ((G.act === 'cage' || G.act === 'cage2') && (sx == null || near(sx, sy, 1950, 900, 240))) next(true); },
      upd() {
        if ((G.act === 'cage' || G.act === 'cage2') && G.actT >= 70 && !G.ring) G.ring = ring(1950, 900);
        if (ph === 'cage' && t === 90) talk([[C, 'What are you?'], [MAN, 'I am what I was not once.'], [MAN, 'I am now a man of despair, shut up in it as in this iron cage. I cannot get out. Oh, now I cannot!'], [C, 'How did you come to this?'], [MAN, 'I left off to watch and be sober. I hardened my heart, so that I cannot repent.'], [TIP, 'Touch the cage again.', 'cage2']], () => { creak(); this.shk = 1; ph = 'nohope'; t = 0; G.state = 'auto'; });
        if (ph === 'nohope' && t === 60) talk([[I, 'Is there no hope, but you must be kept in this iron cage?'], [MAN, 'No, none at all.'], [I, 'Why, the Son of God is full of pity.'], [MAN, 'Oh, eternity, eternity!'], [C, 'This is fearful! God help me to watch and be sober, and to pray.']], () => goTo('r7'));
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
      run() { talk([[C, 'Now let me go on my way.'], [I, 'Stay, till I have shown you a little more.'], [TIP, 'Touch the cage.', 'cage']], () => { creak(); this.shk = .6; ph = 'cage'; t = 0; G.state = 'auto'; }); },
      act(sx, sy) { if ((G.act === 'cage' || G.act === 'cage2') && (sx == null || near(sx, sy, 1946, 900, 220))) next(true); },
      upd() {
        if ((G.act === 'cage' || G.act === 'cage2') && G.actT >= 70 && !G.ring) G.ring = ring(1946, 900);
        if (ph === 'cage' && t === 90) talk([[C, 'What are you?'], [MAN, 'I am what I was not once.'], [MAN, 'I am now a man of despair, shut up in it as in this iron cage. I cannot get out. Oh, now I cannot!'], [C, 'How did you come to this?'], [MAN, 'I left off to watch and be sober. I hardened my heart, so that I cannot repent.'], [TIP, 'Touch the cage again.', 'cage2']], () => { creak(); this.shk = 1; ph = 'nohope'; t = 0; G.state = 'auto'; });
        if (ph === 'nohope' && t === 60) talk([[I, 'Is there no hope, but you must be kept in this iron cage?'], [MAN, 'No, none at all.'], [I, 'Why, the Son of God is full of pity.'], [MAN, 'Oh, eternity, eternity!'], [C, 'This is fearful! God help me to watch and be sober, and to pray.']], () => goTo('r7'));
      },
      people(c) { visitor(c, 'I', 2880, -1); visitor(c, 'C', 3170, -1); },
      under(c) {
        glow(c, u(332), v(392), 180, [255, 200, 110], .14 + .03 * Math.sin(G.t / 50));
        // the cage rattles when it is touched: that part of the picture laid again a hair off, back and forth
        this.shk = (this.shk || 0) * .985; const im = pics.room6;
        if (im && this.shk > .02) { const k = im.width / R.PW, x0 = 1590, y0 = 300, w = 720, h = 980, dx = Math.sin(G.t * 2.3) * 1.4 * this.shk;
          c.save(); c.beginPath(); c.rect(u(x0), v(y0), w * S, h * S); c.clip(); c.drawImage(im, x0 * k, y0 * k, w * k, h * k, u(x0) + dx, v(y0), w * S, h * S); c.restore(); }
      },
    },
    // 7 THE BEDCHAMBER, drawn on the house's shell (build 427): the dream told in light on the bare wall
    r7: PAINTED ? null : {
      pic: 'room7-drawn', shell: 1, FY: HOUSE.FY, tone: [130, 110, 100], k: 1, noShadow: 1,
      enter() { this.blk = 0; this.fl = 0; this.lt = .2; this.lv = .2; this.sh = .35; this.cur = 0; this.up = []; this.upOn = 0; this.left = 0;
        this.clouds = Array.from({ length: 30 }, (_, i) => ({ x: 1500 + rnd() * 1100, y: 380 + rnd() * 400, r: 90 + rnd() * 160, v: (i % 2 ? 1 : -1) * (.15 + rnd() * .25) })); pic('room7-rising'); },
      run() { talk([[C, 'Why does this man tremble so?'], [TIP, 'Touch the man.', 'man']], () => { ph = 'tell'; t = 0; G.state = 'auto'; this.sh = 1; }); },
      act(sx, sy) { if (G.act === 'man' && (sx == null || near(sx, sy, R7.MAN[0], R7.MAN[1], 240))) next(true); },
      upd() {
        if (G.act === 'man' && G.actT >= 70 && !G.ring) G.ring = ring(R7.MAN[0], R7.MAN[1]);
        const self = this;
        if (ph === 'tell' && t === 30) talk([[DRM, 'This night I dreamed. The heavens grew black, it thundered, and I heard the great sound of a trumpet.', null, () => { self.blk = 1; self.lt = 0; self.thT = 54; self.trT = 156; }], [DRM, 'I saw a man sit upon a cloud, and heard a voice: \u2018Arise, ye dead, and come to judgement.\u2019', null, () => { self.lt = 1.6; }], [DRM, 'I saw many caught up into the clouds, but I was left behind. I was not ready.', null, () => { self.upOn = 1; self.left = 1; }]], () => { self.lt = .15; self.blk = .3; goTo('leave'); });
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
      run() { talk([[C, 'Why does this man tremble so?'], [TIP, 'Touch the man.', 'man']], () => { ph = 'tell'; t = 0; G.state = 'auto'; this.sh = 1; }); },
      act(sx, sy) { if (G.act === 'man' && (sx == null || near(sx, sy, 905, 860, 220))) next(true); },
      upd() {
        if (G.act === 'man' && G.actT >= 70 && !G.ring) G.ring = ring(905, 820);
        const self = this;
        if (ph === 'tell' && t === 30) talk([[DRM, 'This night I dreamed. The heavens grew black, it thundered, and I heard the great sound of a trumpet.', null, () => { self.blk = 1; self.lt = 0; setTimeout(() => { self.fl = 1; thunder(); }, 900); setTimeout(trumpet, 2600); }], [DRM, 'I saw a man sit upon a cloud, and heard a voice: ‘Arise, ye dead, and come to judgement.’', null, () => { self.lt = 1.6; }], [DRM, 'I saw many caught up into the clouds, but I was left behind. I was not ready.', null, () => { self.lt = .15; self.blk = .4; }]], () => goTo('leave'));
        this.cur = (this.cur || 0) + ((this.blk || 0) - (this.cur || 0)) * .02; this.fl *= .9; this.lv = (this.lv || .3) + (this.lt - (this.lv || .3)) * .015;
      },
      people(c) { visitor(c, 'I', 2640, -1, 1.22); visitor(c, 'C', 2900, -1, 1.22); },
      under(c) {
        // the man trembles: the part of the picture round him is laid again a hair off, back and forth
        const im = pics.room7; if (im) { const a = this.sh * (.6 + .4 * Math.sin(G.t / 9)), dx = Math.sin(G.t * 1.9) * .9 * a, dy = Math.sin(G.t * 2.7) * .5 * a, k = im.width / R.PW, x0 = 560, y0 = 440, w = 640, h = 820;
          c.save(); c.beginPath(); c.ellipse(u(x0 + w / 2), v(y0 + h / 2), w * S / 2, h * S / 2, 0, 0, 6.2832); c.clip(); c.drawImage(im, x0 * k, y0 * k, w * k, h * k, u(x0) + dx, v(y0) + dy, w * S, h * S); c.restore(); }
        glow(c, u(2202), v(422), 160 * this.lv, [255, 236, 170], .35 * this.lv);
      },
      over(c) { if (this.cur > .01) darkWith(c, [[u(905), v(820), 150, .55], [u(2200), v(395), 120 * this.lv, Math.min(1, this.lv)]], .85 * this.cur);
        if (this.lv > .5) { c.save(); c.translate(u(2200), v(520)); c.scale(1, 1.8); glow(c, 0, 0, Math.min(120, 150 * (this.lv - .3)), [255, 240, 190], .3 * (this.lv - .5)); c.restore(); }
        if (this.fl > .02) { const g = c.createLinearGradient(0, v(0), 0, v(800)); g.addColorStop(0, css([230, 230, 255], .25 * this.fl)); g.addColorStop(1, css([230, 230, 255], 0)); c.fillStyle = g; c.fillRect(u(0), v(0), 3168 * S, 800 * S); } },
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
        if (this.w > 0) { this.fr += WALK_FPT * this.w; this.x += walkSpeed('C', .58) * this.w; }
        cam.to = Math.min(R.PW * S - VW, Math.max(R.cam0, u(this.x) + cam.x - 500));
        if (this.x > 2800) { this.a = Math.max(0, this.a - .03); if (G.act === 'walkout') { next(true); G.state = 'auto'; } }
        if (this.a <= 0 && ph !== 'end') { ph = 'end'; t = 0; }
        if (ph === 'end' && t === 40) finish();
      },
      under(c) { doorLight(c, 1, () => visitor(c, 'I', DOOR.x, -1, .58)); },
      people(c) { c.globalAlpha = this.a; if (this.w > 0 || this.fr > 0) walkFig(c, 'C', this.x, this.fr, .58); else visitor(c, 'C', this.x, 1, .58); c.globalAlpha = 1; },
    },
  };
  if (PAINTED) ROOMS.r1 = ROOMS.r1p; delete ROOMS.r1p; if (PAINTED) ROOMS.r6 = ROOMS.r6p; delete ROOMS.r6p; if (PAINTED) ROOMS.r7 = ROOMS.r7p; delete ROOMS.r7p; if (PAINTED) ROOMS.r3 = ROOMS.r3p; delete ROOMS.r3p;
  // FOLLOW THE INTERPRETER (owner, build 267: "Ok to do 1"): between two rooms a dark passage; the child touches once (build 312) to follow
  // the Interpreter's candle ("he took him by the hand, and led him into ..."). Christian walks (his own walk pictures,
  // dark), the Interpreter goes a step ahead with a candle, its light moving along the wall and the floor.
  ROOMS.pass = {
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
      const step = Math.floor(this.fr * 2 / VIS.C.walk.fr); if (step !== this.st) { this.st = step; noise(200, 1.5, .2, .06); noise(140, 1.2, .25, .04, .05); }
    },
    draw(c) {
      const ix = 810 + this.p * 700 * walkSpeed('I', this.k) / walkSpeed('C', this.k), fl = 1 + .06 * Math.sin(G.t / 4.7) * Math.sin(G.t / 11), iy = this.floorAt(ix), cy = this.floorAt(this.x()), lx = u(ix) + 34, ly = v(iy) - 128;
      this.scene(c);
      // only what the candle reaches is seen (out of doors, a little of the night as well)
      const sky = this.kind === 'out' || this.kind === 'round'; darkWith(c, [[lx, ly, 520 * fl], [lx, v(iy) + 4, 640 * fl, .8]], sky ? .55 : .86);
      // the candle's light on the passage wall and, flat, on the floor
      glow(c, lx, ly, 330 * fl, [255, 170, 90], .2); c.save(); c.translate(lx, v(iy) + 2); c.scale(1, .12); glow(c, 0, 0, 380 * fl, [255, 170, 90], .32); c.restore();
      // both walk at their videos' own full pace, each moving at the floor speed that keeps his planted foot still (build 320)
      walkFig(c, 'I', ix, this.fr, this.k, 1, R.tone, iy);
      walkFig(c, 'C', this.x(), this.fr, this.k, 1, R.tone, cy);
      glow(c, lx, ly, 26 * fl, [255, 226, 160], .7); c.fillStyle = 'rgba(255,240,200,.95)'; c.beginPath(); c.ellipse(lx, ly - 2, 1.6, 3.4, 0, 0, 6.2832); c.fill();
      // where they are in the house: a small cutaway in the corner, the rooms seen faintly lit, the candle going from one to the next
      housePlan(c, VW - 170, 74, 1.5, this.from, this.to, this.p);
    },
  };
  const ORDER = ['door', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'leave'];
  // ONE HOUSE (build 387; owner: "i'd like the rooms to be part of a house and clearly connected - like which ones are upstairs (if so we need stairs
  // between them)"). Placed by the book's own words: ground floor 1 "a private room", 2 "a very large parlour", 3 "a little room", 4 the fire
  // "against a wall" (the kitchen hearth and its chimney); 5 "a pleasant place" with the palace, the garden behind the house; 6 "a very dark room",
  // the cellar; 7 "a chamber" with one rising out of bed, upstairs. Each passage is the real way between two of them.
  const SEEN_R = new Set();
  // the house as a small cutaway (in the passage's corner): each room's place [x, y, w, h] on a 100 x 62 plan
  const PLAN = { door: [0, 24, 12, 22], r1: [12, 24, 16, 22], r2: [28, 24, 24, 22], r3: [52, 24, 14, 22], r4: [66, 24, 20, 22], r5: [90, 30, 10, 16], r6: [0, 46, 30, 13], r7: [26, 4, 30, 20], leave: [0, 24, 12, 22] };
  function passKind(from, to) {
    if (to === 'r5') return 'out';
    if (to === 'r6') return 'down';
    if (to === 'r7') return 'up';
    if (to === 'leave') return from === 'r7' ? 'down' : from === 'r5' ? 'round' : 'hall';
    return 'hall';
  }
  function housePlan(c, x0, y0, k, from, to, p) {
    c.save(); c.translate(x0, y0); c.scale(k, k); c.globalAlpha = .85;
    c.fillStyle = 'rgba(40,28,18,.9)'; c.beginPath(); c.moveTo(-4, 24); c.lineTo(43, 0); c.lineTo(90, 24); c.closePath(); c.fill();
    c.fillStyle = 'rgba(30,22,16,.9)'; c.fillRect(0, 4, 86, 42); c.fillStyle = 'rgba(22,16,12,.9)'; c.fillRect(0, 46, 86, 13);
    c.fillStyle = 'rgba(30,44,26,.8)'; c.fillRect(86, 38, 14, 8);
    for (const id of ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7']) {
      if ((id === 'r6' || id === 'r7') && !darkOn()) continue;
      const [x, y, w, h] = PLAN[id], lit = id === to ? .35 + .55 * smooth(.3, 1, p) : id === from ? .9 - .5 * smooth(0, .6, p) : SEEN_R.has(id) ? .32 : .08;
      c.fillStyle = `rgba(255,196,110,${lit.toFixed(3)})`; c.fillRect(x + .8, y + .8, w - 1.6, h - 1.6);
    }
    // the candle's way: from the room they leave to the room they go to
    const a = PLAN[from] || PLAN.door, b = PLAN[to] || PLAN.door, ax = a[0] + a[2] / 2, ay = a[1] + a[3] - 3, bx = b[0] + b[2] / 2, by = b[1] + b[3] - 3;
    const q = smooth(0, 1, p), cx = ax + (bx - ax) * q, cy = ay + (by - ay) * q;
    c.globalAlpha = 1; glow(c, cx, cy, 7, [255, 200, 120], .9); c.fillStyle = '#fff2cc'; c.beginPath(); c.arc(cx, cy, 1.1, 0, 6.2832); c.fill();
    c.restore();
  }
  // THE HOUSE SEEN WHOLE (build 392): a cutaway of the house by night, as on a page of an old book: the front wall taken away, every room
  // seen in its place. At the door every room is dark but for the hearth (the fire "burned against a wall" all along); leaving, the rooms
  // he has seen are lit. Same plan as the corner map (PLAN), drawn larger, with its roof, chimney, stairs, cellar and the garden behind.
  function houseCut(c, a, lit) {
    if (a <= .005) return;
    const k = Math.min(VW * .62 / 112, VH * .7 / 84), x0 = VW / 2 - 50 * k, y0 = VH * .43 - 22 * k;
    c.save(); c.globalAlpha = .93 * a; c.fillStyle = '#07050a'; c.fillRect(0, 0, VW, VH);
    c.globalAlpha = a; c.translate(x0, y0); c.scale(k, k); c.lineJoin = 'round';
    const L = id => (id === 'r6' || id === 'r7') && !darkOn() ? 0 : lit(id);
    // night: a few stars, the ground and the earth under it
    for (let i = 0; i < 40; i++) { const sx = -10 + (i * 37.3) % 124, sy = -22 + (i * 17.9) % 30; c.fillStyle = `rgba(230,226,255,${(.25 + .25 * Math.sin(G.t / 60 + i)).toFixed(3)})`; c.fillRect(sx, sy, .35, .35); }
    c.fillStyle = '#1a130e'; c.fillRect(-10, 46, 124, 16);
    c.fillStyle = '#120d09'; c.fillRect(-10, 59.5, 124, 3);
    // the garden behind: its wall, dark shrubs, the palace small on its rise
    c.fillStyle = '#1c2318'; c.beginPath(); c.moveTo(86, 46); c.quadraticCurveTo(98, 40.5, 112, 43); c.lineTo(112, 46); c.closePath(); c.fill();
    c.fillStyle = '#2a2420'; c.fillRect(110, 39, 2, 7);
    for (const [sx, r] of [[88, 1.6], [92.5, 2.1], [108, 1.8]]) { c.fillStyle = '#141a12'; c.beginPath(); c.arc(sx, 45 - r * .4, r, 0, 6.2832); c.fill(); }
    const l5 = L('r5');
    { const px = 97, py = 42.6; c.fillStyle = l5 > .05 ? `rgb(${60 + 120 * l5 | 0},${48 + 90 * l5 | 0},${30 + 40 * l5 | 0})` : '#221c18';
      c.fillRect(px - 5, py - 7, 10, 7); c.fillRect(px - 6, py - 11, 2.4, 11); c.fillRect(px + 3.6, py - 11, 2.4, 11); c.fillRect(px - 1.5, py - 10, 3, 3);
      for (const tx of [px - 4.8, px + 4.8]) { c.beginPath(); c.moveTo(tx - 1.6, py - 11); c.lineTo(tx, py - 13.5); c.lineTo(tx + 1.6, py - 11); c.fill(); }
      if (l5 > .05) { glow(c, px, py - 6, 10, [255, 200, 120], .5 * l5); c.fillStyle = `rgba(255,230,170,${(.9 * l5).toFixed(3)})`; c.fillRect(px - .7, py - 3, 1.4, 3); } }
    // the house: its walls (the front taken away), the roof, the chimney over the kitchen hearth
    c.fillStyle = '#3a2c22'; c.fillRect(-1.5, 2.5, 89, 44.5);
    c.fillStyle = '#2b2019'; c.beginPath(); c.moveTo(-5, 3.5); c.lineTo(43, -17); c.lineTo(91, 3.5); c.closePath(); c.fill();
    c.strokeStyle = '#4a3a2c'; c.lineWidth = .5; c.stroke();
    c.strokeStyle = 'rgba(170,176,210,.35)'; c.lineWidth = .35; c.beginPath(); c.moveTo(-5, 3.5); c.lineTo(43, -17); c.stroke();
    c.strokeStyle = 'rgba(20,14,10,.5)'; c.lineWidth = .25; for (let i = 1; i < 6; i++) { const y = 3.5 - 20.5 * i / 6, h = (3.5 - y) / 20.5 * 48; c.beginPath(); c.moveTo(-5 + h, y); c.lineTo(91 - h, y); c.stroke(); }
    c.fillStyle = '#33271f'; c.fillRect(75, -13, 6, 17); c.fillRect(74.4, -14, 7.2, 1.6);
    for (let i = 0; i < 5; i++) { const q = ((G.t / 360) + i / 5) % 1, sx = 78 - 10 * q * q, sy = -15 - 13 * q, r = 1.5 + 4 * q, g = c.createRadialGradient(sx, sy, 0, sx, sy, r); g.addColorStop(0, `rgba(120,112,118,${(.12 * Math.sin(Math.PI * Math.min(1, q * 1.4))).toFixed(3)})`); g.addColorStop(1, 'rgba(120,112,118,0)'); c.fillStyle = g; c.fillRect(sx - r, sy - r, 2 * r, 2 * r); }
    // the upper floor's other rooms (not in the story): dark, each with a small window
    for (const [x, w] of [[0, 26], [56, 30]]) { c.fillStyle = '#100b08'; c.fillRect(x + .8, 4.8, w - 1.6, 18.4); c.fillStyle = '#1d1a24'; c.fillRect(x + w / 2 - 1.5, 9, 3, 5); }
    // the rooms of the story: dark until lit
    const ROOMLIST = ['door', 'r1', 'r2', 'r3', 'r4', 'r6', 'r7'];
    for (const id of ROOMLIST) {
      const [x, y, w, h] = PLAN[id], l = id === 'door' ? Math.max(.25, lit(id)) : L(id);
      const dk = (id === 'r6' || id === 'r7') && !darkOn();
      c.fillStyle = dk ? '#1a130e' : '#0e0907'; c.fillRect(x + .8, y + .8, w - 1.6, h - 1.6);
      if (l > .01) { const g = c.createRadialGradient(x + w / 2, y + h * .62, 0, x + w / 2, y + h * .62, Math.max(w, h) * .75); g.addColorStop(0, `rgba(255,200,120,${(.95 * l).toFixed(3)})`); g.addColorStop(1, `rgba(150,80,36,${(.55 * l).toFixed(3)})`); c.fillStyle = g; c.fillRect(x + .8, y + .8, w - 1.6, h - 1.6); }
    }
    // a few plain things in the rooms, in one dark tone: the picture, the parlour's window, two little chairs, the hearth (always burning),
    // the cage, the bed
    const ink = '#160e0a'; c.fillStyle = ink; c.strokeStyle = ink; c.lineWidth = .45;
    c.strokeRect(17.5, 30, 5, 6.5);
    c.fillRect(30.5, 30, 3.6, 7); c.fillStyle = L('r2') > .05 ? `rgba(255,236,190,${(.7 * L('r2')).toFixed(3)})` : '#1d1a24'; c.fillRect(31, 30.5, 2.6, 6); c.fillStyle = ink;
    for (const cx of [55.5, 61.5]) { c.fillRect(cx, 41, 2.4, .6); c.fillRect(cx, 41, .5, 4.2); c.fillRect(cx + 1.9, 41.6, .5, 3.6); c.fillRect(cx - .1, 37.5, .5, 4); }
    c.fillRect(73, 36, 8, 10); c.fillStyle = '#0a0605'; c.fillRect(74.5, 39.5, 5, 6.5);
    const fl = .75 + .25 * Math.sin(G.t / 6) * Math.sin(G.t / 17); glow(c, 77, 44, 6, [255, 150, 60], .8 * fl); c.fillStyle = `rgba(255,190,100,${fl.toFixed(3)})`; c.beginPath(); c.moveTo(75.5, 46); c.quadraticCurveTo(77, 41.5 - fl, 78.5, 46); c.fill();
    c.fillStyle = ink;
    if (darkOn()) { for (let i = 0; i < 6; i++) c.fillRect(3 + i * 1.6, 49.5, .4, 8); c.fillRect(2.5, 49, 9, .5); c.fillRect(2.5, 57.3, 9, .5);
      c.fillRect(42, 18.5, 10, 2.4); c.fillRect(42, 15, 1, 6); c.fillRect(51.2, 16.5, .8, 4.5); }
    // stairs: the great stair from the parlour up to the bedchamber; the cellar stair from the first room down
    c.fillStyle = '#2a1f17';
    for (let i = 0; i < 10; i++) c.fillRect(49 - i * 1.3, 45.2 - i * 2.2, 2.2, .8);
    c.fillRect(35, 23.4, 4, .8);
    for (let i = 0; i < 6; i++) c.fillRect(23 - i * 1.4, 47 + i * 2, 2.2, .7);
    // floors and inner walls
    c.fillStyle = '#4a3a2c'; c.fillRect(-1.5, 23.4, 89, 1.2); c.fillRect(-1.5, 45.6, 89, 1.2); c.fillRect(-1.5, 59, 33, 1);
    for (const x of [12, 28, 52, 66]) c.fillRect(x - .5, 24, 1, 22);
    c.fillRect(25.5, 4, 1, 20); c.fillRect(55.5, 4, 1, 20); c.fillRect(30, 46, 1, 13.5); c.fillRect(-1.5, 46, 1, 13.5);
    // the front door, open on its warm light, and the back door to the garden
    c.fillStyle = `rgba(255,200,120,${(.9 * Math.max(.4, lit('door'))).toFixed(3)})`; c.beginPath(); c.moveTo(-1.5, 46); c.lineTo(-1.5, 38); c.quadraticCurveTo(0, 36, 1.5, 38); c.lineTo(1.5, 46); c.fill();
    glow(c, -1, 43, 6, [255, 190, 110], .5);
    c.fillStyle = L('r5') > .05 ? `rgba(255,200,120,${(.7 * L('r5')).toFixed(3)})` : '#120c09'; c.fillRect(85.6, 39, 2, 7);
    c.restore(); c.globalAlpha = 1;
  }
  function rngR(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

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
      const tw = Math.sin(G.t / 9 + o.gl) * Math.sin(G.t / 23 + o.gl * 1.7), gl = Math.max(0, tw - .55) * (ph === 'glad' ? 2.2 : 1.2) + (o.gone ? (1 - o.a) * .8 : 0);
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

  // ---------- moving between rooms ----------
  function enterRoom(id) {
    R = ROOMS[id]; R.id = id; R.PW = R.PW || 3168; ph = 'in'; t = 0; cam.x = cam.to = id === 'pass' ? R.cam0 : 0;
    ambStart({ door: 'night', r1: 'candle', r2: 'airy', r3: 'still', r4: 'fire', r5: 'palace', r6: 'hollow', r7: 'dread', leave: 'night', pass: 'passage' }[id]);
    G.act = null; G.ring = null; G.actT = 0; downs.clear(); keys.r = keys.push = false; toned = {};
    R.enter && R.enter();
    const r = rngR(31); motes = Array.from({ length: 16 }, () => ({ x: r() * VW, y: 60 + r() * 330, s: .5 + r() * 1.1, p: r() * 7, v: .03 + r() * .06 }));
    const nx = ORDER[ORDER.indexOf(id) + 1]; if (nx) pic(ROOMS[nx].pic);
  }
  function goTo(id) {
    if (id === 'r6' && !darkOn()) id = 'leave';
    if (R && R.id !== 'door' && R.id !== 'pass' && id !== 'pass') { ROOMS.pass.to = id; ROOMS.pass.from = R.id; SEEN_R.add(R.id); id = 'pass'; }
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
    if (!VIS.I.say.off) sheetFrames(VIS.I.say); const need = [ROOMS[id].pic, VIS.C.n, VIS.I.n].concat(id === 'r3' ? ['room3-rags'] : []).concat(id === 'r5' ? [BRAVE.plain.n, BRAVE.armed.n] : []);
    Promise.all(need.map(pic)).then(() => { enterRoom(id); setTimeout(() => { if (RM.on && G.state === 'wait' && R && R.id === id) { ph = 'run'; R.run(); } }, 1200); });
  }
  function preload() { pic(ROOMS.door.pic); pic(VIS.C.n); pic(VIS.I.n); if (!VIS.I.say.off) sheetFrames(VIS.I.say); }

  function touch(sx, sy) { if (R) [sx, sy] = unview(sx, sy); if (R && G.act && R.act) { const a = G.act; R.act(sx, sy); if (G.act === a && !G.ring) G.actT = Math.max(G.actT, 95); } }
  function key() { if (R && G.act && R.act) R.act(null, null); }

  function update() {
    G.t++; t++;
    if (G.act) G.actT++;
    if (fadeTo === 1) { fade = Math.min(1, fade + .03); if (fade >= 1 && after) { const id = after; after = null; Promise.all([ROOMS[id].pic ? pic(ROOMS[id].pic) : null]).then(() => { enterRoom(id); fadeTo = 0; setTimeout(() => { if (RM.on && R && R.id === id) { ph = 'run'; R.run(); } }, 700); }); } }
    else fade = Math.max(0, fade - .025);
    if (!R) return;
    cam.x += (cam.to - cam.x) * .03;
    for (const m of motes) { m.x += m.v; m.y += Math.sin(G.t / 90 + m.p) * .05; if (m.x > VW) m.x = 0; }
    sayK = Math.max(0, Math.min(1, sayK + (speaking() ? 1 : -1) / 214));
    ambTick();
    R.upd && R.upd();
    if (R.id !== 'pass') cam.x = cam.to = 0;
  }
  function finish() {
    ambStop();
    G.state = 'end'; G.ended = false;
    const e = document.getElementById('endc');
    e.querySelector('h1').textContent = 'The Interpreter’s House';
    e.querySelectorAll('p')[0].textContent = 'He went on his way, and the highway was fenced on either side with a wall called Salvation.';
    e.querySelectorAll('p')[1].textContent = 'Next: the Cross';
    document.getElementById('on2').style.display = '';
  }

  // THE ROOM SEEN WHOLE (owner, build 271: "rooms feel too claustrophobic ... i'd like to be zoomed out a little - if you
  // want to you can frame the rooms in black"): each room's whole painting at once, a little smaller (VIEW.Z), hung on the
  // dark like a picture on a wall, its edges softened into the dark; nothing pans (cam.x stays 0). Everything in the room is
  // drawn in the same units as before through this one transform; touches are turned back through it (`unview`).
  const VZ = .64, VIEW = { Z: 1, ox: 0, oy: 0 };
  function setView() {
    // a room drawn on the house's shell fills the picture's width (critics, build 427: "fill the screen; answer claustrophobic by drawing more room"),
    // its floor line a little above the words; zin eases in on a thing, vx moves the view sideways
    if (R && R.shell && R.id !== 'pass') { const XW = (EX.x1 - EX.x0) * S, Z = VW / XW * (R.zin || 1); VIEW.Z = Z; VIEW.ox = (VW - XW * Z) / 2 - EX.x0 * S * Z + (R.vx || 0); VIEW.oy = VH * .86 - 440 * Z - (R.FY - 1250) * 0; return; }
    const vz = (R && R.vz) || VZ, Z = R && R.id === 'pass' ? 1 : vz * Math.min(1, 1204 / (R.PW * S)), top = 440 - R.FY * S;
    VIEW.Z = Z; VIEW.ox = R && R.id === 'pass' ? 0 : (VW - R.PW * S * Z) / 2 + (R.vx || 0); VIEW.oy = R && R.id === 'pass' ? 0 : 14 + PH * S * (Z / vz * .8 - Z) / 2 - top * Z + (R.vy || 0);
  }
  const unview = (sx, sy) => [(sx - VIEW.ox) / VIEW.Z, (sy - VIEW.oy) / VIEW.Z];
  // THE FLOOR GOES ON (build 341, owner: "not enlarge room picture but actually extend room floor"): on a side named in R.ext
  // the painting's floor band (from a little above the floor line to its foot) is mirrored outward past its edge, fading
  // into the dark, so the visitors can stand on the room's own floor out in the frame. Baked once per room and side.
  const EXT_L = 760, EXT_IN = 160, EXT_UP = 30, EXT_OFF = 170;
  function extBake(im, side) {
    const key = 'ext' + side; if (im[key]) return im[key];
    // the floor is taken from EXT_OFF in from the edge (the painting's own edge was darkened when it was made), mirrored outward,
    // and laid EXT_IN back over the painting, blending in, so there is no seam
    const sc = im.width / R.PW, y0 = (R.FY - EXT_UP) * sc, hh = im.height - y0, L = EXT_L * sc, IN = EXT_IN * sc, OFF = EXT_OFF * sc;
    const cv = document.createElement('canvas'); cv.width = Math.ceil(L + IN); cv.height = Math.ceil(hh); const x = cv.getContext('2d');
    if (side === 'L') { x.drawImage(im, OFF, y0, IN, hh, L, 0, IN, hh); x.save(); x.translate(L, 0); x.scale(-1, 1); x.drawImage(im, OFF, y0, L, hh, 0, 0, L, hh); x.restore(); }
    else { x.drawImage(im, im.width - OFF - IN, y0, IN, hh, 0, 0, IN, hh); x.save(); x.translate(IN + L, 0); x.scale(-1, 1); x.drawImage(im, im.width - OFF - L, y0, L, hh, 0, 0, L, hh); x.restore(); }
    x.globalCompositeOperation = 'destination-in';
    const a0 = side === 'L' ? 0 : cv.width, a1 = side === 'L' ? cv.width : 0, gx = x.createLinearGradient(a0, 0, a1, 0), e = L / cv.width;
    gx.addColorStop(0, 'rgba(0,0,0,0)'); gx.addColorStop(.3 * e, 'rgba(0,0,0,.8)'); gx.addColorStop(.55 * e, 'rgba(0,0,0,1)'); gx.addColorStop(e, 'rgba(0,0,0,1)'); gx.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gx; x.fillRect(0, 0, cv.width, cv.height);
    const gy = x.createLinearGradient(0, 0, 0, cv.height); gy.addColorStop(0, 'rgba(0,0,0,0)'); gy.addColorStop(Math.min(.5, EXT_UP * sc * 1.6 / cv.height), 'rgba(0,0,0,1)'); gy.addColorStop(.8, 'rgba(0,0,0,1)'); gy.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gy; x.fillRect(0, 0, cv.width, cv.height);
    return im[key] = { cv, sc };
  }
  function extFloor(c, im) {
    if (!R.ext || !im) return;
    for (const side of R.ext) {
      const e = extBake(im, side), w = e.cv.width / e.sc * S, h = e.cv.height / e.sc * S, y = v(R.FY - EXT_UP);
      c.drawImage(e.cv, side === 'L' ? u(-EXT_L) : u(R.PW - EXT_IN), y, w, h);
    }
  }
  // the painting's edges sink softly into the dark round it
  function edges(c, x0, y0, w, h) {
    for (const [ax, ay, bx, by, xx, yy, ww, hh] of [[x0, 0, x0 + 40, 0, x0, y0, 40, h], [x0 + w, 0, x0 + w - 40, 0, x0 + w - 40, y0, 40, h], [0, y0, 0, y0 + 30, x0, y0, w, 30], [0, y0 + h, 0, y0 + h - 30, x0, y0 + h - 30, w, 30]]) { const g = c.createLinearGradient(ax, ay, bx, by); g.addColorStop(0, 'rgba(13,8,6,.85)'); g.addColorStop(1, 'rgba(13,8,6,0)'); c.fillStyle = g; c.fillRect(xx, yy, ww, hh); }
  }
  function draw() {
    const c = ctx; c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.fillStyle = '#0d0806'; c.fillRect(0, 0, VW, VH);
    const im = R && pics[R.pic];
    if (R) setView();
    c.setTransform(DPR * VIEW.Z, 0, 0, DPR * VIEW.Z, DPR * VIEW.ox, DPR * VIEW.oy);
    if (R && R.id === 'pass') R.draw(c);
    else if (im) {
      const ex = im.ex, w = ex ? (EX.x1 - EX.x0) * S : R.PW * S, h = ex ? (EX.y1 - EX.y0) * S : PH * S, x0 = ex ? u(EX.x0) : u(0), y0 = ex ? v(EX.y0) : v(0);
      const LS = R.lshape; if (LS) c.drawImage(im, u((LS.bx - LS.ox) / LS.k), v((LS.by - LS.oy) / LS.k), im.width / LS.k * S, im.height / LS.k * S);
      c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip();
      if (!LS) c.drawImage(im, x0, y0, w, h);
      R.under && R.under(c);
      if (!LS) edges(c, x0, y0, w, h);
      // the two visitors may stand in or over the dark frame round the painting, out of the way (build 331)
      c.restore(); extFloor(c, im); R.people && R.people(c);
      if (!LS) for (const [e, d] of [[x0, -1], [x0 + w, 1]]) { const fl = R.ext && R.ext.includes(d < 0 ? 'L' : 'R') ? .2 : 1, g = c.createLinearGradient(e, 0, e + d * 150, 0); g.addColorStop(0, 'rgba(13,8,6,0)'); g.addColorStop(.35, 'rgba(13,8,6,' + (.35 * fl).toFixed(2) + ')'); g.addColorStop(1, 'rgba(13,8,6,' + (.72 * fl).toFixed(2) + ')'); c.fillStyle = g; c.fillRect(d < 0 ? e - 400 : e, y0 - 60, 400, h + 120); }
      c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip();
      R.over && R.over(c);
      if (R.id !== 'door' && R.id !== 'leave' && R.id !== 'r2') for (const m of motes) { const a = .08 * (.5 + .5 * Math.sin(G.t / 50 + m.p)); c.fillStyle = 'rgba(255,236,200,' + a.toFixed(3) + ')'; c.beginPath(); c.arc(m.x, m.y, m.s, 0, 6.2832); c.fill(); }
      c.restore();
    }
    if (G.ring) { const [x, y] = G.ring(); c.strokeStyle = '#ffe6ae'; c.lineWidth = 2 / VIEW.Z; for (const q0 of [0, .5]) { const q = (G.t / 80 + q0) % 1; c.globalAlpha = .65 * (1 - q); c.beginPath(); c.arc(x, y, (14 + q * 40) / VIEW.Z, 0, 6.2832); c.stroke(); } c.globalAlpha = 1; }
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (R && R.cut) houseCut(c, R.cut, id => R.cutLit ? R.cutLit(id) : 0);
    for (const tp of G.taps) { tp.t++; c.strokeStyle = css([247, 243, 233], .5 * (1 - tp.t / 40)); c.lineWidth = 1.2; c.beginPath(); c.arc(tp.x, tp.y, 6 + tp.t * .8, 0, 7); c.stroke(); }
    G.taps = G.taps.filter(tp => tp.t < 40);
    if (fade > .003) { c.fillStyle = css([10, 6, 4], smooth(0, 1, fade)); c.fillRect(0, 0, VW, VH); }
    drawItems();
  }

  const HOLDS = ['round', 'walkout', 'follow'];
  const lines = []; // for the voice tool: every room's lines are written out in full above
  return { on: false, start, update, draw, touch, key, preload, HOLDS, seen: SEEN_R, stop: () => ambStop(), darkOn, setDark: on => { try { localStorage.setItem('pp-dark', on ? '1' : '0'); } catch (e) {} }, lines,
    peek: () => ({ room: R && R.id, ph, t, cam: Math.round(cam.x), fade: +fade.toFixed(2), r3: R && R.id === 'r3' ? { coins: R.coins.length, rags: +R.rags.toFixed(2) } : null, pass: R && R.id === 'pass' ? R.kind + '>' + R.to : null, pp: R && R.id === 'pass' ? +R.p.toFixed(2) : null, bv: R && R.bv ? { x: Math.round(R.bv.x), f: +(R.bv.f || 0).toFixed(1), arm: R.bv.arm, clip: R.bv.clip || 0 } : null }) };
})();
