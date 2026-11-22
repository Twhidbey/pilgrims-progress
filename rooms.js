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
  const knockS = () => { if (typeof knockDoor === 'function') knockDoor(1); else if (typeof knockWood === 'function') { knockWood(0, 1); knockWood(.17, .85); } else { noise(160, 2, .22, .5); noise(420, 3, .08, .25); } };      // (build 468) the solid knock shared with the wicket-gate
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
    const soft = R && R.soft || 0, satK = R && R.satK != null ? R.satK : 1, key = n + '|' + col.join(',') + '|' + ct + '|' + mul + '|' + sat0 + '|' + soft + '|' + satK; if (toned[key]) return toned[key];
    const im = pics[n]; if (!im) return null;
    const cv2 = document.createElement('canvas'); cv2.width = im.w || im.width; cv2.height = im.h || im.height; const x = cv2.getContext('2d');
    if (im.sheet) x.drawImage(im.sheet, im.sx, im.sy, im.w, im.h, 0, 0, im.w, im.h); else x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, cv2.width, cv2.height), p = d.data, sat = (sat0 != null ? sat0 : R && R.sat != null ? R.sat : .6) * satK;
    let m = 0, cnt = 0; for (let i = 0; i < p.length; i += 4) if (p[i + 3] > 128) { m += (p[i] + p[i + 1] + p[i + 2]) / 3; cnt++; } m /= cnt || 1;
    for (let i = 0; i < p.length; i += 4) { const l = (p[i] + p[i + 1] + p[i + 2]) / 3; for (let k = 0; k < 3; k++) { let c = l + (p[i + k] - l) * sat; c = (m + (c - m) * ct) * mul; p[i + k] = Math.max(0, Math.min(255, c * col[k] / 255)); } }
    x.putImageData(d, 0, 0);
    // a room may ask for less colour on every figure in it (R.satK, a factor on their colour; room 4 since build 522)
    // a room may ask for softer figures (R.soft 0..1, room 2 since build 520): a copy made a third of the size and stretched back is laid over
    // the figure, inside its own outline, so the oil's fine crisp detail melts toward the game's watercolour while its edge stays clean
    if (soft) { const w3 = Math.max(2, cv2.width / 3 | 0), h3 = Math.max(2, cv2.height / 3 | 0), sm = document.createElement('canvas'); sm.width = w3; sm.height = h3; sm.getContext('2d').drawImage(cv2, 0, 0, w3, h3); x.save(); x.globalCompositeOperation = 'source-atop'; x.globalAlpha = soft; x.drawImage(sm, 0, 0, cv2.width, cv2.height); x.restore(); }
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

  // ROOM 4 DRAWN IN CODE (a trial, after build 373; owner: "going back to computer drawn rooms like other levels"): only with ?drawn.
  // The game's own language: flat side view, each layer one tone, ONE light (the fire, after La Tour), most of the picture dark.
  // Baked once at half the painting's size (3168 x 1344 plate px); the fire, the water and the two men are drawn live in r4.under().
  const PAINTED = /[?&]painted\b/.test(location.search);
  const DRAWN = /[?&]drawn\b/.test(location.search), D4 = !/[?&]painted\b/.test(location.search);
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
  // every stage of the house: filled from the room files (room1.js ... room7.js, rooms-outside.js) near the end of this file
  const ROOMS = {};
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
    // (build 519) larger and a little lower, on an opaque night: nothing of the scene behind shows through
    const k = Math.min(VW * .8 / 122, VH * .8 / 86), x0 = VW / 2 - 50 * k, y0 = VH * .47 - 22 * k;
    c.save(); c.globalAlpha = a; c.fillStyle = '#07050a'; c.fillRect(0, 0, VW, VH);
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
    if (R && R.shell) { const XW = (EX.x1 - EX.x0) * S, Z = VW / XW * (R.zin || 1); VIEW.Z = Z; VIEW.ox = (VW - XW * Z) / 2 - EX.x0 * S * Z + (R.vx || 0); VIEW.oy = VH * .86 - 440 * Z - (R.FY - 1250) * 0; return; }
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
  // THE ROOMS FROM THEIR OWN FILES (after build 501): each room file (room1.js ... room7.js, rooms-outside.js), loaded before this
  // one, pushed a function onto window.RMR; each is handed this kit and returns its stages, which are laid into ROOMS.
  const KIT = { get AMB() { return AMB; }, set AMB(x) { AMB = x; }, BR, BRAVE, D4, DRAWN, DRM, EX, HOUSE, I, K, MAN, PAINTED, PH, get R() { return R; }, set R(x) { R = x; }, ROOMS, S, SEEN_R, VIS, VO, WALK_FPT, bakeShell, get cam() { return cam; }, set cam(x) { cam = x; }, clash, cough, creak, darkOn, darkWith, fig, finish, glow, goTo, hold, housePlan, knockS, loads, mkBake, near, noise, passKind, get ph() { return ph; }, set ph(x) { ph = x; }, pic, pics, ring, rnd, rngR, scratch, sheetFrames, get t() { return t; }, set t(x) { t = x; }, thunder, tone, trumpet, u, v, visitor, walkFig, walkSpeed };
  (window.RMR || []).forEach(f => Object.assign(ROOMS, f(KIT)));
  if (PAINTED) ROOMS.r1 = ROOMS.r1p; delete ROOMS.r1p; if (PAINTED) ROOMS.r6 = ROOMS.r6p; delete ROOMS.r6p; if (PAINTED) ROOMS.r7 = ROOMS.r7p; delete ROOMS.r7p; if (PAINTED) ROOMS.r3 = ROOMS.r3p; delete ROOMS.r3p;
  return { on: false, start, update, draw, touch, key, preload, HOLDS, seen: SEEN_R, stop: () => ambStop(), darkOn, setDark: on => { try { localStorage.setItem('pp-dark', on ? '1' : '0'); } catch (e) {} }, lines,
    peek: () => ({ room: R && R.id, ph, t, cam: Math.round(cam.x), fade: +fade.toFixed(2), r3: R && R.id === 'r3' ? { coins: R.coins.length, rags: +R.rags.toFixed(2) } : null, pass: R && R.id === 'pass' ? R.kind + '>' + R.to : null, pp: R && R.id === 'pass' ? +R.p.toFixed(2) : null, wx: R && (R.id === 'door' || R.id === 'leave') ? Math.round(R.id === 'door' ? R.cx : R.x) : null, bv: R && R.bv ? { x: Math.round(R.bv.x), f: +(R.bv.f || 0).toFixed(1), arm: R.bv.arm, clip: R.bv.clip || 0 } : null }) };
})();
