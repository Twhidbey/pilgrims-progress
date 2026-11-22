// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: ROOM 2, THE PARLOUR (book {74} to {76}).
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/room2.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { DRAWN, EX, HOUSE, I, K, PAINTED, PH, S, bakeShell, cough, fig, goTo, loads, near, noise, pic, pics, ring, rnd, rngR, sheetFrames, u, v, visitor } = H;
  // ROOM 2 DRAWN IN CODE (after build 378; owner: "can you draw the parlour"): Vermeer's one light, a tall window on the left,
  // the pale wall lit nearest it and dimming to the right, the floorboards a nearer, darker layer with the window's light lying flat on them,
  // a low band of pale tiles at the wall's foot (the Milkmaid's Delft tiles, the room's one quoted detail besides the stream from the jug)
  const R2D = { sweepV: { n: 'room2-sweeper-v', ax: 193.2, g: 375, cols: 8, fr: 108, W: 260, H: 382, s: 1.75, ct: 1, mul: .9, sat: 1, noSh: 1 }, girl: { ax: 154, g: 618, s: 1, ct: 1, mul: 1, sat: 1, noSh: 1 }, pourV: { n: 'room2-girl-pour', ax: 118, g: 448, cols: 8, fr: 103, W: 234, H: 453, s: 1.387, ct: 1, mul: 1, sat: 1, noSh: 1 }, LIPX: [203, 203, 202, 202, 202, 202, 202, 204, 206, 208, 211, 213, 215, 216, 217, 219, 220, 221, 222, 223, 223, 223, 221, 219, 216, 212, 210, 206, 205, 205, 207, 211, 215, 217, 220, 222, 223, 225, 226, 227, 228, 229, 230, 230, 231, 230, 229, 229, 228, 227, 224, 221, 218, 214, 211, 209, 208, 207, 206, 205, 204, 204, 204, 205, 205, 208, 211, 214, 216, 218, 220, 221, 222, 224, 225, 226, 227, 228, 228, 228, 228, 228, 228, 227, 226, 225, 223, 220, 217, 213, 211, 209, 208, 207, 206, 205, 203, 203, 203, 203, 203, 203, 203], LIPY: [176, 175, 177, 177, 176, 175, 173, 172, 162, 149, 153, 157, 161, 164, 167, 168, 170, 170, 170, 171, 171, 169, 167, 164, 160, 155, 150, 173, 171, 168, 168, 143, 146, 152, 156, 160, 165, 168, 170, 172, 172, 173, 172, 172, 172, 173, 171, 172, 171, 169, 165, 160, 155, 149, 172, 170, 169, 171, 172, 174, 176, 176, 175, 174, 171, 172, 148, 152, 156, 161, 164, 167, 169, 169, 170, 170, 169, 169, 168, 168, 168, 168, 168, 168, 167, 166, 163, 160, 155, 151, 175, 173, 172, 172, 173, 173, 176, 176, 176, 176, 176, 176, 176], SPOUT: [289 - 154, 237 - 618], sweeper: { ax: 290, g: 652, s: .92, ct: 1, mul: .96, sat: 1, noSh: 1 }, GX: 1716, SX: 2655, DROP: 46, WIN: [90, 380, 170, 930] };
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
    return bakeShell({ seed: 22, doors: 'LR', skirt: 0, wallC: '#74664e', floorC: '#4e3826',
      lights: [{ x: 640, y: 720, r: 2900, lit: [238, 230, 204], half: [176, 164, 132], sx: 1.35 }],
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
        for (let y = BY + 8, row = 0; y < BY + 160; y += 13, row++) for (let x = BX - 110 + (row % 2) * 9; x < BX + 110; x += 18) { const lit = .5 + .5 * (BX + 40 - x) / 150; c.fillStyle = `rgba(${104 + 46 * lit | 0},${86 + 36 * lit | 0},${60 + 26 * lit | 0},${(.3 + .22 * lit).toFixed(3)})`; c.beginPath(); c.ellipse(x, y, 8, 4.5, row % 2 ? .5 : -.5, 0, 6.2832); c.fill(); }
        g = c.createLinearGradient(BX - 100, 0, BX + 100, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,6,2,.55)'); c.fillStyle = g; c.fillRect(BX - 110, BY - 10, 220, 180); c.restore();
        c.strokeStyle = '#54452f'; c.lineWidth = 7; c.beginPath(); c.moveTo(BX - 90, BY + 1); c.quadraticCurveTo(BX, BY + 22, BX + 90, BY + 1); c.stroke();
        c.strokeStyle = '#3c3020'; c.lineWidth = 10; c.beginPath(); c.moveTo(BX - 76, BY + 6); c.bezierCurveTo(BX - 66, BY - 110, BX + 66, BY - 110, BX + 76, BY + 6); c.stroke(); c.strokeStyle = 'rgba(190,170,130,.4)'; c.lineWidth = 3; c.beginPath(); c.moveTo(BX - 79, BY + 2); c.bezierCurveTo(BX - 69, BY - 112, BX - 10, BY - 92, BX, BY - 88); c.stroke();
        // the brass pail: a warm gleam on the window's side, dark on the far side, a rim and a bail
        g = c.createLinearGradient(PX - 62, 0, PX + 62, 0); g.addColorStop(0, '#665226'); g.addColorStop(.16, '#a08848'); g.addColorStop(.3, '#665022'); g.addColorStop(.75, '#4a3416'); g.addColorStop(1, '#22180a'); c.fillStyle = g; pailShape(c);
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
        let k = 0; for (let x = EX.x0 + 120; x < EX.x1 - 120; x += TH, k++) { const lit = Math.max(.5, 1 - Math.max(0, x - 500) / 4400), t0 = 70 + 120 * lit;
          c.fillStyle = `rgb(${t0 | 0},${t0 * .97 | 0},${t0 * .86 | 0})`; c.fillRect(x + 2, TY + 2, TH - 4, TH - 4);
          c.strokeStyle = `rgba(32,58,150,${(.34 * lit + .05).toFixed(3)})`; c.lineWidth = 1.8; const cx = x + TH / 2, cy = TY + TH / 2, f = k % 5;
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
        let g = c.createRadialGradient(700, 720, 300, 700, 720, 3000); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.6, 'rgba(40,26,8,.04)'); g.addColorStop(1, 'rgba(14,9,3,.2)'); c.fillStyle = g; c.fillRect(EX.x0, EX.y0, EX.x1 - EX.x0, EX.y1 - EX.y0);
      } });
  }
  if (!PAINTED) { const n = 'room2-drawn'; loads[n] = new Promise(r => setTimeout(r, 0)).then(() => (pics[n] = DRAWN ? bakeR2() : bakeR2s())); pic('room2-girl'); pic('room2-girl-pour'); pic('room2-sweeper'); }
  return {
    // 2 THE DUSTY PARLOUR (after Vermeer's Milkmaid): the broom raises the dust; the water lays it
    r2: {
      pic: PAINTED ? 'room2-dry' : 'room2-drawn', shell: PAINTED || DRAWN ? 0 : 1, FY: PAINTED || DRAWN ? 1262 : HOUSE.FY, cam0: 140, tone: PAINTED ? [360, 346, 322] : [262, 254, 242], soft: PAINTED || DRAWN ? 0 : .6, noShadow: 1,
      // the sweeper and the girl move by free clips laid back into the painting where they move (build 364): SW his sweep (a loop),
      // DM her jug from pouring (frame 0) to held upright (14), shown at 14 until she pours; x, y, W, H in the asset's own pixels, the sheets at .7 (the clip's own resolution)
      SW: { n: 'room2-sweep', x: 1770, y: 375, W: 417, H: 680, sw: 292, sh: 476, cols: 8, fr: 49 }, DM: { n: 'room2-damsel', x: 1261, y: 380, W: 359, H: 675, sw: 251, sh: 472, cols: 8, fr: 15 },
      ov(c, o, f) { const im = pics[o.n]; if (!im) return; f = Math.max(0, Math.min(o.fr - 1, Math.round(f))); c.drawImage(im, (f % o.cols) * o.sw, Math.floor(f / o.cols) * o.sh, o.sw, o.sh, u(o.x / K), v(o.y / K), o.W / K * S, o.H / K * S); },
      under(c) {
        if (PAINTED) { this.ov(c, this.DM, this.df); this.ov(c, this.SW, this.sf); return; }
        // the drawn room: the girl (stand-in: his wife's picture) holding the jug, which tips as she pours; the sweeper (stand-in: Help) and his broom
        // build 512 (owner: "tone the girl and sweeper darker to match the visitors"): in the night parlour both are held down toward the visitors' dark, quiet tones
        const FY = this.FY + (this.shell ? 0 : 14), DK = this.shell ? { ct: 1, mul: .82, sat: .7 } : null, DROP = this.shell ? R2D.DROP : 0, G2 = R2D.girl, SW2 = DK ? { ...R2D.sweeper, ...DK } : R2D.sweeper, col = this.shell ? [236, 233, 228] : [255, 255, 255];
        if (this.shell && this.pud > 0) { const p = this.pud, px = R2D.GX + 300, py = FY + DROP + 12, rw = (160 + 1500 * p) * S; c.save(); c.translate(u(px), v(py)); c.scale(1, .05); const wg = c.createRadialGradient(0, 0, 0, 0, 0, rw); wg.addColorStop(0, `rgba(30,18,8,${(.5 * Math.min(1, p * 3)).toFixed(3)})`); wg.addColorStop(.7, `rgba(30,18,8,${(.34 * Math.min(1, p * 3)).toFixed(3)})`); wg.addColorStop(1, 'rgba(30,18,8,0)'); c.fillStyle = wg; c.fillRect(-rw, -rw, 2 * rw, 2 * rw); { const hg = c.createRadialGradient(-rw * .2, -rw * .3, 0, -rw * .2, -rw * .3, rw * .5); hg.addColorStop(0, `rgba(236,232,214,${(.16 * Math.min(1, p * 3)).toFixed(3)})`); hg.addColorStop(1, 'rgba(236,232,214,0)'); c.fillStyle = hg; c.fillRect(-rw, -rw, 2 * rw, 2 * rw); } c.restore(); }
        if (this.shell) for (const [sx, w] of [[820, 150], [1100, 130], [R2D.GX - 10, 140], [R2D.SX - 40, 190]]) { c.save(); c.translate(u(sx), v(FY + DROP + 4)); c.scale(1, .13); const sg = c.createRadialGradient(0, 0, 0, 0, 0, w * S); sg.addColorStop(0, 'rgba(14,8,4,.6)'); sg.addColorStop(.6, 'rgba(14,8,4,.3)'); sg.addColorStop(1, 'rgba(14,8,4,0)'); c.fillStyle = sg; c.fillRect(-w * S, -w * S, 2 * w * S, 2 * w * S); c.restore(); }
        // the girl: cut straight out of the painting (build 382), so she is the painted Milkmaid herself, her jug already in her hands;
        // the water falls from its spout when the child has touched it
        // she "stood by" (book {74}): in the bright parlour she is ONE video (Google, build 524, the owner's yes): from a new picture of her holding
        // a matte earthenware jug upright in both hands she tips it three times, as one sprinkles a floor, and brings it upright again where it
        // began (103 frames at 12 a second, first frame = last). She waits on frame 0; the touch on the jug plays it through once (gf).
        const PV = R2D.pourV, gfr = Math.min(PV.fr - 1, Math.floor(this.gf || 0));
        if (this.shell && sheetFrames(PV)) { fig(c, PV.n + '#' + gfr, PV, R2D.GX, FY + 6 + DROP, -1, 1, 1, col); this.lip = this.lipAt(); }
        else { if (pics['room2-girl']) fig(c, 'room2-girl', G2, R2D.GX, FY + 6 + DROP, -1, 1, 1, col); this.lip = null; }
        this.spout = [R2D.GX + R2D.SPOUT[0] / K, FY + 6 + DROP + R2D.SPOUT[1] / K];
        // the sweeper: his own picture (build 384, the free FLUX Kontext model from the painted boy: a bearded servant in a linen cap
        // and brown doublet, bent to the broom with both hands on the handle), the broom's head where the dust rises
        // build 482: the sweeper on video (Google, owner's yes): upright, hands apart on the pole; 108 frames at 12 a second, a loop that
        // starts and ends in his standing pose, played while he sweeps and held on frame 0 between
        const SV = DK ? (R2D.sweepVd = R2D.sweepVd || { ...R2D.sweepV, mul: .8, sat: .7 }) : R2D.sweepV;
        if (sheetFrames(SV)) fig(c, SV.n + '#' + (Math.floor(this.svf || 0) % SV.fr), SV, R2D.SX, FY + (this.shell ? 8 + DROP : 0), -1, 1, 1, col);
        else if (pics['room2-sweeper']) fig(c, 'room2-sweeper', SW2, R2D.SX, FY, -1, 1, 1, col);
      },
      // where the jug's lip is now (plate units), and whether the jug is tipped far enough to let water go: from the video's own frames, so the
      // water never depends on a picture having been drawn
      lipAt() { const PV = R2D.pourV, f = Math.min(PV.fr - 1, Math.floor(this.gf || 0)); return [R2D.GX + (R2D.LIPX[f] - 3 - PV.ax) * PV.s / K, HOUSE.FY + 6 + R2D.DROP + (R2D.LIPY[f] + 3 - PV.g) * PV.s / K, R2D.LIPX[f] >= 219]; },
      enter() { pic('room2-sweep'); pic('room2-damsel'); pic('room2-sweeper-v'); pic('room2-girl-pour'); this.gf = 0; this.pud = 0; this.spl = []; this.sf = 0; this.svf = 0; this.sweeps = 0; this.df = 14; this.dt = 14; this.dust = []; this.haze = this.shell ? .12 : .22; this.film = 1; this.wet = []; const r = rngR(5); for (let i = 0; i < (this.shell ? 0 : 70); i++) this.dust.push({ x: 300 + r() * 2800, y: 300 + r() * 900, vx: 0, vy: 0, s: 2 + r() * 5, a: .5 + r() * .5, p: r() * 7 }); },
      run() { talk([[N, 'He led him into a very large parlour, full of dust, because it was never swept.'], [TIP, 'Touch the broom.', 'broom']], () => { H.ph = 'sweep'; H.t = 0; G.state = 'auto'; }); },
      act(sx, sy) {
        if (G.act === 'broom' && (sx == null || near(sx, sy, 2390, 1180 + (this.shell ? 46 : 0), 160))) next(true);
        if (G.act === 'jug' && (sx == null || near(sx, sy, this.lip ? this.lip[0] - 40 : 1900, this.lip ? this.lip[1] + 30 : 860 + (this.shell ? 46 : 0), 170))) next(true);
      },
      upd() {
        if (G.act === 'broom' && G.actT >= 70 && !G.ring) G.ring = ring(2390, 1200 + (this.shell ? 46 : 0));
        if (G.act === 'jug' && G.actT >= 70 && !G.ring) G.ring = this.lip ? ring(this.lip[0] - 40, this.lip[1] + 30) : ring(1900, 840 + (this.shell ? 46 : 0));
        // his strokes at the clip's own pace (16 a second); each sweep is whole loops, ending where it began
        if (this.sweeps > 0) { this.sf += 16 / 60; if (this.sf >= this.SW.fr - 1) { this.sf = 0; this.sweeps--; } }
        if (this.sweeps > 0 || (this.svf || 0) % R2D.sweepV.fr > .5) this.svf = (this.svf || 0) + 12 / 60;
        // her jug eases toward its target frame at 12 a second (14 held upright, 0 pouring)
        if (this.df !== this.dt) this.df += Math.sign(this.dt - this.df) * Math.min(12 / 60, Math.abs(this.dt - this.df));
        // the night parlour: her tipping clip at its own pace (48 frames at 16 a second: 180 ticks each way); df follows it, so the water waits for the jug
        if (this.shell && this.gf > 0) { this.gf += 12 / 60; if (this.gf >= R2D.pourV.fr - 1) this.gf = 0; }
        if (this.shell) this.lip = this.lipAt();
        if (H.ph === 'sweep') {
          if (H.t === 1) this.sweeps = 2;
          if (H.t < 300 && this.sweeps > 0 && H.t % 2 === 0) for (let k = 0; k < 6; k++) this.dust.push({ x: 2390 + (rnd() - .5) * 120, y: 1240 + (this.shell ? 46 : 0) - rnd() * 40, vx: -1 - rnd() * 6, vy: -.6 - rnd() * 2.2, s: 2 + rnd() * 6, a: .6 + rnd() * .4, p: rnd() * 7, life: 0 });
          if (H.t % 18 === 0 && H.t < 140) noise(1800, .8, .3, .06);
          this.haze = Math.min(.55, this.haze + .003);
          if (H.t === 120) cough(0); if (H.t === 200) cough(0);
          if (H.t === 270) talk([[I, 'Bring the water, and sprinkle the room.'], [TIP, 'Touch the jug.', 'jug']], () => { H.ph = 'sprinkle'; H.t = 0; G.state = 'auto'; });
        }
        if (H.ph === 'sprinkle') {
          // she tips the jug (the clip played backwards), pours while it is tipped, then holds it upright again; then he sweeps the room clean, no dust
          if (H.t === 1) { this.dt = 0; if (this.shell) this.gf = .01; }
          if (H.t === 240) this.dt = 14;
          if (H.t === (this.shell ? 420 : 260)) this.sweeps = 1;
          const pour = this.shell ? !!(this.lip && this.lip[2] && this.gf > 0) : this.df < 1.5 && H.t < 240;
          // the night-or-day drawn parlour: she SPRINKLES: scattered drops leave the jug's lip while it is tipped, fly a little forward and fall to the boards
          if (pour && this.shell) { if (H.t % 2 === 0) for (let k = 0; k < 2; k++) this.wet.push({ x: this.lip[0] + rnd() * 8, y: this.lip[1] + rnd() * 6, vx: .6 + rnd() * 3.4, vy: -rnd() * 1.6, l: 0, fy: HOUSE.FY + R2D.DROP - 6 + rnd() * 34 }); }
          else if (pour && H.t % 3 === 0) for (let k = 0; k < 2; k++) this.wet.push({ x: (!PAINTED && this.spout ? this.spout[0] : 1944) + rnd() * 14, y: !PAINTED && this.spout ? this.spout[1] : 842, vx: (rnd() - .5) * 1.2, vy: -rnd() * 1.5, l: 0 });
          if (pour && H.t % 24 === 0) noise(6000, 1, .4, .025);
          if (!this.shell || this.pud > .02) this.haze = Math.max(0, this.haze - .0028);
          for (const d of this.dust) { d.vy += .03; d.vx *= .96; }
          if (H.t === (this.shell ? 520 : 330)) talk([[C, 'What does this mean?'], [I, 'This parlour is the heart of a man. The dust is his sin. He who swept first is the Law: it stirs the dust up, but cannot make the heart clean.'], [I, 'She who brought the water is the Gospel. By it the heart is made clean, fit for the King of glory to live in.']], () => goTo('r3'));
        }
        for (const d of this.dust) { d.life = (d.life || 0) + 1; d.dr = d.dr || (.95 + rnd() * .04); d.vx *= d.dr; if (d.life > 120) d.a *= .99; if (Math.abs(d.x - 1900) < 160 && d.y < 1000) d.a *= .97; if (d.y < 1000) d.vy = Math.max(d.vy, 0); d.x += d.vx + Math.sin(G.t / 60 + d.p) * .4; d.y += d.vy; d.vx *= .985; d.vy = d.vy * .985 + (H.ph === 'sprinkle' ? .05 : -.004); if (H.ph === 'sprinkle' && d.y > 1240) d.a *= .9; }
        this.dust = this.dust.filter(d => d.a > .03 && d.y < 1400);
        for (const w of this.wet) { w.vy += .35; w.x += w.vx; w.y += w.vy; w.l++; }
        // a drop that reaches the boards makes a tiny splash and wets them: the wet patch spreads from where she stands, and the film of dust clears with it
        if (this.shell) { for (const w of this.wet) if (w.y >= w.fy) { this.pud = Math.min(1, this.pud + .0034); if (rnd() < .5) this.spl.push({ x: w.x, y: w.fy, vx: (rnd() - .5) * 2.4, vy: -1.2 - rnd() * 1.6, l: 0 }); }
          this.wet = this.wet.filter(w => w.y < w.fy); for (const p of this.spl) { p.vy += .3; p.x += p.vx; p.y += p.vy; p.l++; } this.spl = this.spl.filter(p => p.l < 16);
          this.film = Math.max(0, 1 - this.pud * 1.15); }
        else this.wet = this.wet.filter(w => w.y < 1260);
      },
      people(c) { if (PAINTED) { visitor(c, 'I', 690, 1, 1, 1, -48); visitor(c, 'C', 470, 1, 1, 1, -48); } else { visitor(c, 'C', 820, 1, 1, 1, -R2D.DROP); visitor(c, 'I', 1100, 1, 1, 1, -R2D.DROP); } },
      over(c) {
        const hz = Math.min(.2, this.haze * .75) * (this.shell ? .35 : 1), LS = H.R.lshape, im = pics[H.R.pic];
        if (LS && im) {
          const W2 = im.width / LS.k * S, H2 = im.height / LS.k * S, hc = this.hc || (this.hc = document.createElement('canvas')); hc.width = 160; hc.height = Math.round(160 * im.height / im.width);
          const hx = hc.getContext('2d'); hx.globalCompositeOperation = 'source-over'; hx.fillStyle = css([170, 150, 120], hz); hx.fillRect(0, 0, hc.width, hc.height); hx.globalCompositeOperation = 'destination-in'; hx.drawImage(im, 0, 0, hc.width, hc.height);
          c.restore(); c.drawImage(hc, u((LS.bx - LS.ox) / LS.k), v((LS.by - LS.oy) / LS.k), W2, H2); c.save();
        } else { c.fillStyle = css([170, 150, 120], hz); if (this.shell) c.fillRect(u(EX.x0), v(EX.y0), (EX.x1 - EX.x0) * S, (EX.y1 - EX.y0) * S); else c.fillRect(u(0), v(0), (H.R.PW || 3168) * S, PH * S); }
        // the night parlour: the dust lies as a pale film on the boards until the water lays it; it flies only from the broom
        if (this.shell && this.film > 0) { const fy = v(HOUSE.FY + 3), g = c.createLinearGradient(0, fy, 0, fy + 70 * S); g.addColorStop(0, css([196, 182, 156], .2 * this.film)); g.addColorStop(1, css([196, 182, 156], 0)); c.fillStyle = g; c.fillRect(u(120), fy, 3170 * S, 70 * S); }
        for (const d of this.dust) { const a = Math.min(1, d.a * (.45 + this.haze)); const r = d.s * S * 3; const g = c.createRadialGradient(u(d.x), v(d.y), 0, u(d.x), v(d.y), r); g.addColorStop(0, css([206, 188, 160], a * .7)); g.addColorStop(1, css([196, 178, 150], 0)); c.fillStyle = g; c.fillRect(u(d.x) - r, v(d.y) - r, 2 * r, 2 * r); }
        if (this.shell) { c.fillStyle = 'rgba(236,244,250,.85)'; for (const w of this.wet) c.fillRect(u(w.x), v(w.y), 1.5, 2.8); c.fillStyle = 'rgba(40,58,78,.35)'; for (const w of this.wet) c.fillRect(u(w.x) + 1.5, v(w.y) + 1, .8, 2); c.fillStyle = 'rgba(236,244,250,.7)'; for (const p of this.spl || []) c.fillRect(u(p.x), v(p.y), 1.2, 1.2); }
        else { c.fillStyle = 'rgba(200,215,225,.5)'; for (const w of this.wet) c.fillRect(u(w.x), v(w.y), 1.2, 2.4); }
      },
    },
  };
});
