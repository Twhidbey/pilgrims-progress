// ============================================================
// LEVEL 4, THE INTERPRETER'S HOUSE: OUTSIDE AND THE WAYS BETWEEN: the door at night, leaving by the door, the passages between rooms.
// Split out of rooms.js after build 501 so each room has its own file (notes: notes/rooms-outside.md).
// Loaded by index.html BEFORE rooms.js; rooms.js calls this with its shared kit (H) and lays what it returns into ROOMS.
// Shared things come from the kit: change them in rooms.js only with the other house chats in mind. Things that
// change while playing (R the room, t, ph, fade, toned, sayK ...) are read and set through H (H.R, H.t).
// ============================================================
(window.RMR = window.RMR || []).push(H => {
  const { EX, HOUSE, I, fig, sheetFrames, PAINTED, PH, ROOMS, S, SEEN_R, VIS, WALK_FPT, darkWith, finish, glow, goTo, hold, housePlan, bakeShell, knockS, loads, mkBake, near, noise, passKind, pic, pics, ring, rngR, tone, u, v, visitor, walkFig, walkSpeed } = H;
  // THE DOOR AND LEAVING, drawn (build 432; after Rembrandt's Rest on the Flight into Egypt): night; two layered masses of dark trees on the left
  // over still water with one tiny far fire mirrored in it; the stone house in the right half, one lit window above, the arched door (DOOR);
  // leaving, the same picture at the end of night: the low coursed wall called Salvation begins on the right and the first cold grey lies
  // along the horizon there, so Level 5 (the Cross, before dawn) follows on.
  const HSE = { X0: 1360, X1: 3260, WIN: [2660, 300] };
  function bakeDoorScene(leaving) {
    const [cv, c] = mkBake();
    const FY = 1200, r = rngR(leaving ? 91 : 90);
    let g = c.createLinearGradient(0, EX.y0, 0, FY); g.addColorStop(0, '#05070c'); g.addColorStop(1, '#151a24'); c.fillStyle = g; c.fillRect(EX.x0, EX.y0, EX.x1 - EX.x0, EX.y1 - EX.y0);
    if (leaving) { c.save(); c.translate(EX.x1, FY); c.scale(1, .45); g = c.createRadialGradient(0, 0, 0, 0, 0, 1100); g.addColorStop(0, 'rgba(70,78,96,.75)'); g.addColorStop(.5, 'rgba(50,58,76,.3)'); g.addColorStop(1, 'rgba(40,46,60,0)'); c.fillStyle = g; c.fillRect(-1100, -1100, 2200, 1100); c.restore(); }
    // (build 519) the end of night: the sky greys from the left toward the right, where the highway goes on (Level 5 opens in this grey)
    if (leaving) { g = c.createLinearGradient(1200, 0, EX.x1, 0); g.addColorStop(0, 'rgba(58,64,84,0)'); g.addColorStop(1, 'rgba(58,64,84,.55)'); c.fillStyle = g; c.fillRect(1200, EX.y0, EX.x1 - 1200, FY - EX.y0); c.save(); c.translate(EX.x1, FY); c.scale(1, .6); g = c.createRadialGradient(0, 0, 0, 0, 0, 1600); g.addColorStop(0, 'rgba(96,102,122,.6)'); g.addColorStop(1, 'rgba(96,102,122,0)'); c.fillStyle = g; c.fillRect(-1600, -1600, 3200, 1600); c.restore(); }
    for (let i = 0; i < 120; i++) { c.fillStyle = `rgba(220,224,240,${(.15 + r() * .45).toFixed(2)})`; c.fillRect(EX.x0 + r() * 1900, EX.y0 + r() * 1300, 2, 2); }
    // the trees (build 519): Level 1's plain field trees (oak, ash, elm; never a level's special tree), each in ONE flat tone: a far row,
    // paler in the haze, a band of low mist, then a nearer row, darker and larger, with sky between the crowns
    const tree = (key, x, h, col, flip) => { const im = TREE_IMS[key]; if (!im || !im.width) return; const w = im.width * h / im.height, t = document.createElement('canvas'); t.width = Math.ceil(w); t.height = Math.ceil(h);
      const q = t.getContext('2d'); if (flip) { q.translate(w, 0); q.scale(-1, 1); } q.drawImage(im, 0, 0, w, h); q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-in'; q.fillStyle = col; q.fillRect(0, 0, w, h);
      const bx = (flip ? 1 - TREE_META[key].bx : TREE_META[key].bx) * w; c.drawImage(t, x - bx, FY + 14 - h, w, h); };
    const KEYS = ['a', 'b', 'e'];
    for (let i = 0; i < 6; i++) tree(KEYS[i % 3], -200 + i * 300 + r() * 120, 560 + r() * 200, '#171c27', i % 2);
    { const g2 = c.createLinearGradient(0, FY - 340, 0, FY); g2.addColorStop(0, 'rgba(40,46,62,0)'); g2.addColorStop(.6, 'rgba(40,46,62,.45)'); g2.addColorStop(1, 'rgba(40,46,62,.2)'); c.fillStyle = g2; c.fillRect(EX.x0, FY - 340, 1700 - EX.x0, 340); }
    for (const [key, x, h, fl] of [['a', -120, 1250, 0], ['e', 520, 980, 1], ['b', 1180, 1120, 0]]) tree(key, x, h, '#0a0c11', fl);
    // still water on the left, the far fire tiny and its broken reflection beneath
    c.fillStyle = '#0e121a'; c.fillRect(EX.x0, FY - 30, 1500 - EX.x0, 60); c.fillStyle = 'rgba(255,150,70,.9)'; c.beginPath(); c.ellipse(700, FY - 40, 9, 12, 0, 0, 6.2832); c.fill();
    for (let k = 0; k < 6; k++) { c.fillStyle = `rgba(255,150,70,${(.5 - k * .07).toFixed(2)})`; c.fillRect(700 - 12 + (k % 2) * 6, FY - 24 + k * 8, 24 - k * 2, 3); }
    // the house AT THE SAME SIZE AS ITS ROOMS (owner, build 436: "House on outside should have same size as house on inside"): inside, a floor is
    // 1100 high for a man 800 tall; out here a man is .58 of that, so a floor is about 640: the ground floor's ceiling at FY - 640 (a string course),
    // the upper floor above it running off the top of the picture, and the front running on off the right, as the five ground-floor rooms
    // and the stair need; the bedchamber's window lit upstairs, the parlour's tall window below, the cellar's grating at the wall's foot
    // beyond the house's corner (build 519): open land under the sky, two low far ridges in haze, and the wall called Salvation behind the
    // highway, as Level 5 opens (a low coursed wall about half his height, its coping catching the sky); darker at night, greyer at dawn
    { const XC = HSE.X1, col = leaving ? [36, 36, 46] : [22, 23, 30];
      for (const [hy, a, cc] of [[300, .9, leaving ? '#2a2e3c' : '#141823'], [170, 1, leaving ? '#20232e' : '#0f121a']]) { c.fillStyle = cc; c.globalAlpha = a; c.beginPath(); c.moveTo(XC, FY); for (let x = XC; x <= EX.x1 + 20; x += 40) c.lineTo(x, FY - hy + 50 * Math.sin(x / 300 + hy) + 25 * Math.sin(x / 113)); c.lineTo(EX.x1 + 20, FY); c.fill(); c.globalAlpha = 1; }
      const WH = 210; c.fillStyle = css(col); c.beginPath(); c.moveTo(XC, FY + 4); let x = XC; while (x < EX.x1 + 40) { const w = 46 + r() * 40, hh = r() * 8; c.lineTo(x, FY - WH - hh); c.lineTo(x + w - 3, FY - WH - hh); x += w; } c.lineTo(EX.x1 + 40, FY + 4); c.closePath(); c.fill();
      c.strokeStyle = css(col.map(v => v * .8)); c.lineWidth = 3; for (let q = 1; q < 5; q++) { c.beginPath(); c.moveTo(XC, FY - WH + q * 42); c.lineTo(EX.x1 + 40, FY - WH + q * 42); c.stroke(); }
      c.fillStyle = leaving ? 'rgba(170,170,190,.22)' : 'rgba(120,124,150,.12)'; c.fillRect(XC, FY - WH - 10, EX.x1 + 40 - XC, 6); }
    const { X0 } = HSE, X1 = HSE.X1, ST = FY - 640, EV0 = ST - 660; c.fillStyle = '#2a231e'; c.fillRect(X0, EV0, X1 - X0, FY - EV0);
    c.fillStyle = 'rgba(12,9,7,.55)'; c.fillRect(X0, ST - 10, X1 - X0, 22); c.fillStyle = 'rgba(90,78,64,.25)'; c.fillRect(X0, ST - 10, X1 - X0, 3);
    g = c.createLinearGradient(X0, 0, X0 + 700, 0); g.addColorStop(0, 'rgba(10,8,6,.55)'); g.addColorStop(1, 'rgba(10,8,6,0)'); c.fillStyle = g; c.fillRect(X0, EV0, 700, FY - EV0);
    c.fillStyle = 'rgba(40,46,60,.35)'; c.fillRect(X0, EV0, 10, FY - EV0);
    // (build 528, owner: "the house is a little skinny now") a broad two-storey front round the door, under its roof: the eaves just above the
    // upper floor, the roof's tiled slope rising behind them to the ridge, the kitchen chimney over the hearth (as in the cutaway)
    // THE ROOF (build 532, owner: "roof should have more texture (can look more rectangular less change from top to bottom) but shingled as a
    // house of that time"): a steep gable roof of small clay plain tiles, as on English houses of the 1600s (Bunyan's Bedfordshire: peg tiles
    // hung on laths, staggered course over course, each tile a little different in tone, the lower edge of each course casting a thin
    // shadow on the one below; a row of half-round ridge tiles along the top). Seen from the front a gable roof is a rectangle: the ridge runs
    // nearly the house's full width, the verges at the gable ends a little inset and darker.
    { const EV = ST - 660, RG = EV - 440, x0 = X0 - 40, x1 = X1 + 40, CH = 24, TW = 40;
      const vg = 26, rx0 = x0 + vg, rx1 = x1 - vg;
      c.fillStyle = '#18120e'; c.beginPath(); c.moveTo(x0, EV); c.lineTo(rx0, RG); c.lineTo(rx1, RG); c.lineTo(x1, EV); c.closePath(); c.fill();
      c.save(); c.beginPath(); c.moveTo(x0, EV); c.lineTo(rx0, RG); c.lineTo(rx1, RG); c.lineTo(x1, EV); c.closePath(); c.clip();
      // the courses, from the ridge down so each lower course lies over the one above: each tile hangs a little crooked (its lower lip
      // uneven), the joints between tiles faint, and the top of every course lies in the shadow of the lip above it; the courses sag
      // a hair along their length, as old roofs do
      const sagAt = x => 5 * Math.sin((x - x0) / (x1 - x0) * Math.PI) + 2 * Math.sin(x / 230);
      for (let y = RG + 4, row = 0; y < EV + CH; y += CH, row++) {
        let x = x0 - (row % 2 ? TW / 2 : 0) - r() * 10;
        while (x < x1) { const w = TW * (.8 + r() * .4), t = r(), dl = (r() - .5) * 4, dr = (r() - .5) * 4, sy = y + sagAt(x + w / 2);
          const v = 26 + t * 10, rr = v + 6, gg = v - 2, bb = v - 7;
          c.fillStyle = `rgb(${rr | 0},${gg | 0},${bb | 0})`; c.beginPath(); c.moveTo(x + .8, sy - 2); c.lineTo(x + w - .8, sy - 2); c.lineTo(x + w - .8, sy + CH + dr); c.quadraticCurveTo(x + w / 2, sy + CH + 1.5 + (dl + dr) / 2, x + .8, sy + CH + dl); c.closePath(); c.fill();
          // the lip catches a breath of light; the joint is a fine dark line, fading down the tile
          c.fillStyle = 'rgba(130,104,80,.09)'; c.fillRect(x + 2, sy + CH - 2 + (dl + dr) / 2, w - 4, 2);
          c.fillStyle = 'rgba(6,4,3,.35)'; c.fillRect(x - .6, sy + 4, 1.2, CH - 6);
          if (r() < .05) { c.fillStyle = 'rgba(44,50,32,.22)'; c.fillRect(x + 3, sy + CH * .4, w * (.3 + r() * .4), CH * .55); }
          x += w; }
        // the course above overlaps this one: its lip throws a soft shadow across the top of this course
        const sh = c.createLinearGradient(0, y - 2, 0, y + CH * .55); sh.addColorStop(0, 'rgba(4,3,2,.75)'); sh.addColorStop(.35, 'rgba(4,3,2,.3)'); sh.addColorStop(1, 'rgba(4,3,2,0)');
        c.fillStyle = sh; for (let xx = x0; xx < x1; xx += 60) c.fillRect(xx, y - 2 + sagAt(xx + 30), 61, CH * .55 + 2);
      }
      // the roof darkens a little toward the ridge (further from the lamplight below) and toward its ends
      let g2 = c.createLinearGradient(0, RG, 0, EV); g2.addColorStop(0, 'rgba(8,6,5,.35)'); g2.addColorStop(1, 'rgba(8,6,5,0)'); c.fillStyle = g2; c.fillRect(x0, RG, x1 - x0, EV - RG);
      c.restore();
      // the verges at the gable ends, and the ridge tiles catching the sky
      c.fillStyle = '#0e0a08'; for (const [a, b] of [[x0, rx0], [x1, rx1]]) { c.beginPath(); c.moveTo(a, EV); c.lineTo(b, RG); c.lineTo(b + (a < b ? 14 : -14), RG); c.lineTo(a + (a < b ? 14 : -14), EV); c.closePath(); c.fill(); }
      c.fillStyle = '#1a1410'; c.fillRect(rx0 - 6, RG - 16, rx1 - rx0 + 12, 18);
      for (let x = rx0; x < rx1; x += 44) { c.fillStyle = 'rgba(6,4,3,.6)'; c.fillRect(x, RG - 16, 3, 18); }
      c.fillStyle = leaving ? 'rgba(130,136,160,.4)' : 'rgba(80,86,110,.32)'; c.fillRect(rx0 - 6, RG - 18, rx1 - rx0 + 12, 4);
      // the eaves: the bottom course's edge overhanging the wall, its shadow on the plaster
      c.fillStyle = '#100c09'; c.fillRect(x0, EV - 4, x1 - x0, 14); g2 = c.createLinearGradient(0, EV + 10, 0, EV + 60); g2.addColorStop(0, 'rgba(6,4,3,.5)'); g2.addColorStop(1, 'rgba(6,4,3,0)'); c.fillStyle = g2; c.fillRect(X0, EV + 10, X1 - X0, 50);
      // the kitchen chimney: a brick stack rising through the roof over the hearth, its cap
      c.fillStyle = '#1e1813'; c.fillRect(2900, RG - 90, 110, 250); c.fillRect(2885, RG - 110, 140, 26); c.fillStyle = 'rgba(6,4,3,.4)'; for (let y = RG - 80; y < RG + 150; y += 16) c.fillRect(2900, y, 110, 2); }
    for (let k = 0; k < 40; k++) { const x = X0 + r() * (X1 - X0), y = EV0 + 160 + r() * (FY - EV0 - 160), rr = 60 + r() * 140, gg = c.createRadialGradient(x, y, 0, x, y, rr); gg.addColorStop(0, r() < .5 ? 'rgba(70,58,46,.12)' : 'rgba(6,4,3,.14)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gg; c.fillRect(x - rr, y - rr, 2 * rr, 2 * rr); }
    const win = (x, y, w, h, lit) => { c.fillStyle = '#120c08'; c.fillRect(x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32); c.fillStyle = lit ? '#e8a85a' : '#151820'; c.fillRect(x - w / 2, y - h / 2, w, h); c.fillStyle = '#120c08'; c.fillRect(x - 4, y - h / 2, 8, h); c.fillRect(x - w / 2, y - h * .1, w, 8); };
    // five windows upstairs (the bedchamber's lit), two below either side of the door (the parlour's on the right)
    const [wx, wy] = HSE.WIN; for (const x of [1600, 1960, 2308, 3010]) win(x, wy, 130, 200, false); win(wx, wy, 130, 200, true); win(1600, 820, 150, 300, false); win(2960, 820, 150, 300, false);
    // the door's deep arched surround (the door's light itself is drawn live)
    const dx0 = DOOR.x - DOOR.w / 2 - 34, dx1 = DOOR.x + DOOR.w / 2 + 34, rr = (dx1 - dx0) / 2; c.fillStyle = '#3a302a'; c.beginPath(); c.moveTo(dx0, DOOR.bot); c.lineTo(dx0, DOOR.top + rr); c.arc(dx0 + rr, DOOR.top + rr, rr, Math.PI, 0); c.lineTo(dx1, DOOR.bot); c.fill();
    c.fillStyle = '#0c0806'; const ir = DOOR.w / 2; c.beginPath(); c.moveTo(DOOR.x - ir, DOOR.bot); c.lineTo(DOOR.x - ir, DOOR.top + ir); c.arc(DOOR.x, DOOR.top + ir, ir, Math.PI, 0); c.lineTo(DOOR.x + ir, DOOR.bot); c.fill();
    // the house's corner: a soft shadow on its front by the edge, and the edge itself catching the sky (greyer as dawn comes)
    { const g3 = c.createLinearGradient(X1 - 260, 0, X1, 0); g3.addColorStop(0, 'rgba(8,6,5,0)'); g3.addColorStop(1, 'rgba(8,6,5,.5)'); c.fillStyle = g3; c.fillRect(X1 - 260, EV0, 260, FY - EV0); c.fillStyle = leaving ? 'rgba(120,126,150,.4)' : 'rgba(60,66,90,.35)'; c.fillRect(X1 - 8, EV0, 8, FY - EV0); }
    // the path and the ground
    c.fillStyle = '#0e0d0c'; c.fillRect(EX.x0, FY, EX.x1 - EX.x0, EX.y1 - FY); c.fillStyle = 'rgba(90,80,70,.25)'; c.fillRect(1500, FY, EX.x1 - 1500, 3);
    // the worn path (build 519): a flat band of paler trodden earth along the ground from the left to the doorstep and on to the highway,
    // its edges soft and uneven (flat, never a shape running down the picture toward us)
    for (let k = 0; k < 4; k++) { c.fillStyle = `rgba(64,56,48,${(.16 - k * .03).toFixed(2)})`; c.beginPath(); c.moveTo(EX.x0, FY + 2); for (let x = EX.x0; x <= EX.x1; x += 60) c.lineTo(x, FY + 26 + k * 12 + 6 * Math.sin(x / 170 + k) + 4 * Math.sin(x / 61)); c.lineTo(EX.x1, FY + 2); c.fill(); }
    c.fillStyle = '#2a2420'; c.fillRect(DOOR.x - DOOR.w / 2 - 60, FY - 8, DOOR.w + 120, 16); c.fillStyle = 'rgba(110,96,80,.3)'; c.fillRect(DOOR.x - DOOR.w / 2 - 60, FY - 8, DOOR.w + 120, 3);
    return cv;
  }
  // his plain run (RUNP, Level 1's pictures, the same Level 5 runs him in), toned once per picture to a near-black warm silhouette (darker than the house's wall, so he reads against it), a trace of his watercolour left
  const RUNT = new Map();
  function runner(c, x, frame, k) {
    const src = RUNP[((frame % RUNP.length) + RUNP.length) % RUNP.length]; if (!src) return;
    // the watercolour's white paper inside the figure filled first (as Level 5 does), so he is solid, never see-through
    const base = typeof solidOf === 'function' ? solidOf(src) : src;
    let im = RUNT.get(src); if (!im) { im = document.createElement('canvas'); im.width = base.width; im.height = base.height; const q = im.getContext('2d'); q.drawImage(base, 0, 0); const d = q.getImageData(0, 0, im.width, im.height), p = d.data, base0 = [8, 6, 6], k0 = [.085, .075, .072]; for (let i = 0; i < p.length; i += 4) for (let j = 0; j < 3; j++) p[i + j] = base0[j] + p[i + j] * k0[j]; q.putImageData(d, 0, 0); RUNT.set(src, im); }
    const sc = (790 * k * S) / 300, fx = u(x), fy = v(H.R.FY); c.globalCompositeOperation = 'source-over';
    c.drawImage(im, fx - RUNP_META.ax * sc, fy - RUNP_META.ground * sc, im.width * sc, im.height * sc);
  }
  // THE DOOR, at night (after Rembrandt's Rest on the Flight into Egypt): he knocks; the door opens on the light within
  const DOOR = { x: 2308, top: 690, bot: 1196, w: 288 };
  // THE DOORWAY (build 536, owner: "light from house a bit strong (maybe little less intense with some shadows to give background texture
  // and realism) also needs a door to open inward"): an oak door, planked and strapped with iron, hinged on the right jamb, swinging IN
  // (seen edge-on as it turns, so it narrows toward its hinge, its free edge catching the light); behind it the entry hall, not a flat
  // glow: its back wall warm only near the candle out of sight on the left, falling into shadow up into the vault and to the right, an
  // inner doorway dark at the back, the floor's flagstones with the light lying on them, the reveals of the thick wall in shade.
  function doorLight(c, d, inside) {
    const x0 = u(DOOR.x - DOOR.w / 2), x1 = u(DOOR.x + DOOR.w / 2), y0 = v(DOOR.top), y1 = v(DOOR.bot), r = (x1 - x0) / 2, W = x1 - x0, H = y1 - y0;
    const e = d * d * (3 - 2 * d);
    c.save(); c.beginPath(); c.moveTo(x0, y1); c.lineTo(x0, y0 + r); c.arc(x0 + r, y0 + r, r, Math.PI, 0); c.lineTo(x1, y1); c.closePath(); c.clip();
    if (d > .003) {
      // the hall's back wall: a warm pool from the left, falling away
      c.fillStyle = css([24, 16, 11], 1); c.fillRect(x0, y0, W, H);
      let g = c.createRadialGradient(x0 + W * .2, y0 + H * .62, 0, x0 + W * .2, y0 + H * .62, W * 1.05);
      g.addColorStop(0, css([236, 168, 96], .72 * d)); g.addColorStop(.35, css([190, 116, 60], .5 * d)); g.addColorStop(.7, css([110, 62, 34], .3 * d)); g.addColorStop(1, css([60, 34, 20], 0));
      c.fillStyle = g; c.fillRect(x0, y0, W, H);
      // an inner doorway at the back, dark, a little right of the middle; the floor's flags with the light flat on them
      c.fillStyle = css([12, 8, 6], .8 * d); c.fillRect(x0 + W * .56, y0 + H * .34, W * .2, H * .54);
      c.fillStyle = css([40, 26, 16], d); c.fillRect(x0, y0 + H * .88, W, H * .12);
      c.save(); c.translate(x0 + W * .3, y0 + H * .93); c.scale(1, .12); g = c.createRadialGradient(0, 0, 0, 0, 0, W * .7); g.addColorStop(0, css([230, 160, 90], .45 * d)); g.addColorStop(1, css([230, 160, 90], 0)); c.fillStyle = g; c.fillRect(-W, -W, 2 * W, 2 * W); c.restore();
      c.fillStyle = css([8, 5, 4], .35 * d); for (let k = 1; k < 5; k++) c.fillRect(x0, y0 + H * (.88 + k * .03), W, 1);
      // shadow up into the arch's vault and down the reveals of the thick wall
      g = c.createLinearGradient(0, y0, 0, y0 + H * .45); g.addColorStop(0, 'rgba(8,5,3,.75)'); g.addColorStop(1, 'rgba(8,5,3,0)'); c.fillStyle = g; c.fillRect(x0, y0, W, H * .45);
      g = c.createLinearGradient(x0, 0, x0 + W * .14, 0); g.addColorStop(0, 'rgba(8,5,3,.6)'); g.addColorStop(1, 'rgba(8,5,3,0)'); c.fillStyle = g; c.fillRect(x0, y0, W * .14, H);
      g = c.createLinearGradient(x1, 0, x1 - W * .2, 0); g.addColorStop(0, 'rgba(8,5,3,.55)'); g.addColorStop(1, 'rgba(8,5,3,0)'); c.fillStyle = g; c.fillRect(x1 - W * .2, y0, W * .2, H);
      if (inside) inside();
    }
    // the door leaf: shut it fills the arch; as it swings in it narrows toward the hinge on the right
    const lw = W * (1 - .84 * e), lx = x1 - lw;
    c.fillStyle = css([36, 26, 19], 1); c.fillRect(lx, y0, lw, H);
    const shade = .25 + .45 * e; c.fillStyle = css([6, 4, 3], shade); c.fillRect(lx, y0, lw, H);
    c.fillStyle = 'rgba(6,4,3,.6)'; const n = 6; for (let k = 1; k < n; k++) c.fillRect(lx + lw * k / n - .6, y0, 1.2, H);
    c.fillStyle = 'rgba(10,8,8,.85)'; for (const f of [.3, .72]) c.fillRect(lx, y0 + H * f, lw, Math.max(2, H * .018));
    c.fillStyle = 'rgba(10,8,8,.9)'; c.beginPath(); c.arc(lx + lw * .16, y0 + H * .55, Math.max(1.5, W * .022), 0, 6.2832); c.fill();
    // its free edge, the thickness of the oak, catches the light from within as it opens
    if (d > .003) { c.fillStyle = css([210, 140, 80], .55 * d); c.fillRect(lx - Math.max(1.5, W * .035 * e), y0, Math.max(1.5, W * .035 * e), H); }
    c.restore();
    if (d <= .003) return;
    // the light lies out flat on the path before the door, and a breath of it in the air
    c.save(); c.translate((x0 + x1) / 2, y1 + 2); c.scale(1, .1); glow(c, 0, 0, 200, [255, 170, 90], .3 * d); c.restore();
    glow(c, (x0 + x1) / 2, (y0 + y1) / 2, 180, [255, 180, 100], .08 * d);
  }
  // Level 1's plain field trees for the night outside (loaded once; the scene is baked when they are in, or without them if they fail)
  const TREE_IMS = {}, treesIn = Promise.all(['a', 'b', 'e'].map(k => new Promise(res => { const im = new Image(); im.onload = im.onerror = () => res(); im.src = 'assets/tree-' + k + '.webp'; TREE_IMS[k] = im; })));
  if (!PAINTED) { loads['door-drawn'] = treesIn.then(() => (pics['door-drawn'] = bakeDoorScene(false))); loads['leave-drawn'] = treesIn.then(() => (pics['leave-drawn'] = bakeDoorScene(true))); }
  return {
    door: {
      pic: PAINTED ? 'room-door' : 'door-drawn', shell: PAINTED ? 0 : 1, FY: 1200, cam0: 210, tone: [80, 74, 90], k: .58,
      light(x) { return x < DOOR.x - 100 ? { x: DOOR.x, a: .45 * this.d, col: [230, 140, 70] } : null; },
      // (build 536) he comes up the way from the gate to the house himself (book {69}, {70}: "he went on till he came to the house of the
      // Interpreter"): the level opens with him on the path left of the house, and the child walks him up to the door; and on "Come in" the
      // Interpreter beckons him in with an open hand (the free clip interp-talk, made from his own dark figure: the hand lifted palm up,
      // then folded again)
      CX0: 1000, BK: { n: 'room-interpreter-beckon', ax: 132, g: 436, cols: 8, fr: 65, W: 208, H: 441, s: 635 / 433, ct: 1, mul: .8, sat: .9 },
      // (build 519) the Interpreter comes out of the light: he walks a few steps out onto the threshold in his own walk; after "Come in"
      // Christian walks in through the door himself (a story move, like Level 3's walk in through the gate) while the Interpreter goes
      // back into the light ahead of him; then room 1
      IX0: 2350, IX1: 2196,
      enter() { this.gone = false; this.d = 0; this.kn = 0; this.ia = 0; this.cut = 0; this.cw = 0; this.ix = this.IX0; this.ifr = 0; this.iw = 0; this.cx = this.CX0; this.uw = 0; this.bkT = -1; this.cfr = 0; this.cw2 = 0; this.ca = 1; this.inT = -1; pic(this.BK.n); SEEN_R.clear(); pic(VIS.I.walk.n); pic(VIS.C.walk.n); },
      cutLit(id) { return id === 'door' ? .5 : 0; },
      run() { talk([[TIP, 'Hold to walk on to the house.', 'walkup']], () => talk([[N, 'Then he went on till he came to the house of the Interpreter, and knocked over and over.']], () => { this.cw = 0; talk([[TIP, 'Knock on the door.', 'knock']], () => { H.ph = 'open'; H.t = 0; G.state = 'auto'; }); })); },
      act(sx, sy) { if (G.act === 'knock' && (sx == null || near(sx, sy, DOOR.x, 950, 150))) { knockS(); if (++this.kn >= 3) next(true); } },
      upd() {
        this.cut += ((this.cw ? 1 : 0) - this.cut) * (this.cw ? .03 : .05); if (this.cut < .003) this.cut = 0;
        if (G.act === 'knock' && G.actT >= 90 && !G.ring) G.ring = ring(DOOR.x, 950);
        // the walk up from the gate: hold to walk, he stops before the door
        if (G.act === 'walkup') { if (G.actT >= 60 && !hold() && !G.ring) G.ring = () => [u(this.cx + 160), v(1000)]; if (hold()) { G.ring = null; this.uw = Math.min(1, this.uw + .05); } else this.uw = Math.max(0, this.uw - .06); }
        if (this.uw > 0 && this.inT < 0) { this.cx += walkSpeed('C', .58) * this.uw; this.cfr += WALK_FPT * this.uw;
          const st = Math.floor(this.cfr * 2 / VIS.C.walk.fr); if (st !== this.lst) { this.lst = st; if (typeof stepOn === 'function') stepOn('dirt', 1); }
          if (this.cx >= 1880) { this.cx = 1880; this.uw = 0; if (G.act === 'walkup') next(true); } }
        if (this.bkT >= 0) this.bkT++;
        if (H.ph === 'open') { this.d = Math.min(1, this.d + .012); if (H.t === 1 && audio()) { tone(98, 'sine', .05, 2.2); noise(300, 3, 1.4, .05); }
          // he comes out of the light: fading in deep in the doorway, then walking out onto the threshold, and standing
          if (H.t > 50 && this.inT < 0) { this.ia = Math.min(1, this.ia + .03); if (this.ix > this.IX1) { this.iw = Math.min(1, this.iw + .05); this.ix = Math.max(this.IX1, this.ix - walkSpeed('I', .58) * this.iw); this.ifr += WALK_FPT * this.iw; } else this.iw = 0; }
          if (H.t === 170) talk([[C, 'Sir, the man at the gate said that if I called here, you would show me excellent things, to help me on my journey.'], [I, 'Come in. I will show you what will help you.', null, () => { this.bkT = 0; }]], () => { this.inT = 0; G.state = 'auto'; }); }
        // in: the Interpreter goes back into the light, Christian walks in after him and is lost in it
        if (this.inT >= 0) { this.inT++; this.ia = Math.max(0, this.ia - .03);
          if (this.inT > 20) { this.cw2 = Math.min(1, this.cw2 + .05); this.cx += walkSpeed('C', .58) * this.cw2; this.cfr += WALK_FPT * this.cw2;
            const st = Math.floor(this.cfr * 2 / VIS.C.walk.fr); if (st !== this.lst) { this.lst = st; if (typeof stepOn === 'function') stepOn(this.cx > DOOR.x - 160 ? 'wood' : 'dirt', 1); } }
          this.ca = 1 - smooth(DOOR.x - 120, DOOR.x + 10, this.cx);
          if (this.ca <= 0 && !this.gone) { this.gone = true; goTo('r1'); } }
      },
      under(c) { doorLight(c, this.d, () => {}); if (PAINTED) { glow(c, u(2832), v(380), 120, [255, 190, 110], .1 + .03 * Math.sin(G.t / 40)); glow(c, u(470), v(1000), 70, [255, 160, 80], .2 + .08 * Math.sin(G.t / 7) * Math.sin(G.t / 13)); } else { glow(c, u(HSE.WIN[0]), v(HSE.WIN[1]), 120, [255, 190, 110], (.12 + .03 * Math.sin(G.t / 40)) * (1 - .5 * this.d)); glow(c, u(700), v(1160), 40, [255, 160, 80], .3 + .1 * Math.sin(G.t / 7) * Math.sin(G.t / 13)); } },
      people(c) {
        // the Interpreter on the threshold, dark against the light within (walking: his own walk, facing out; standing: his standing figure)
        if (this.ia > .01) { const w = VIS.I.walk, B = this.BK, bf = Math.min(B.fr - 1, Math.floor(this.bkT * 16 / 60)); if (this.bkT >= 0 && bf < B.fr - 1 && sheetFrames(B)) fig(c, B.n + '#' + bf, B, this.ix, H.R.FY, -1, .58, this.ia, H.R.tone, null, 0, 0); else if (this.iw > 0 && sheetFrames(w)) { const i = ((Math.floor(this.ifr) % w.fr) + w.fr) % w.fr; fig(c, w.n + '#' + i, w, this.ix, H.R.FY, -1, .58, this.ia, H.R.tone, null, 0, 0); } else visitor(c, 'I', this.ix, -1, .58, this.ia); }
        if (this.ca > 0) { if (this.cw2 > 0 || this.uw > 0) walkFig(c, 'C', this.cx, this.cfr, .58, this.ca); else visitor(c, 'C', this.cx, 1, .58, this.ca); }
      },
    },
    // LEAVING by the door (book {91}, {92}): he goes on his way
    leave: {
      pic: PAINTED ? 'room-door' : 'leave-drawn', shell: PAINTED ? 0 : 1, FY: 1200, cam0: 210, tone: [100, 94, 112], k: .58,
      light(x) { return x < DOOR.x - 100 ? { x: DOOR.x, a: .55, col: [230, 140, 70] } : null; },
      // (build 519) he walks out past the door, and once clear of the house he RUNS on up the highway by himself, as the book's next
      // sentence has it ("Up this way, therefore, did burdened Christian run"), and as Level 5 opens; the run is his own plain run
      // (Level 1's, the same pictures Level 5 runs him in), dark against the dawn
      RUN0: 2440,
      enter() { this.x = 1880; this.w = 0; this.fr = 0; this.a = 1; this.cut = 1; this.cw = 1; this.ct = 0; this.rn = 0; this.ran = 0; pic(VIS.C.walk.n); if (typeof RUNP !== 'undefined' && !RUNP.ready && typeof loadPack === 'function') loadPack('christian-run-plain', RUNP).catch(() => {}); },
      cutLit(id) { return id === 'door' ? .6 : SEEN_R.has(id) ? .45 + .4 * smooth(0, 1, (this.ct - 30 - 25 * ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7'].indexOf(id)) / 60) : 0; },
      run() { talk([[I, 'Have you thought on all these things?'], [C, 'Yes, and they put me in hope and fear.'], [I, 'The Comforter be always with you, good Christian, to guide you in the way that leads to the City.'], [N, 'The highway was fenced on either side with a wall, and that wall was called Salvation.'], [TIP, 'Hold to go on your way.', 'walkout']], () => {}); },
      act() {},
      upd() {
        this.ct++; if (this.ct > 330) this.cw = 0; this.cut += ((this.cw ? 1 : 0) - this.cut) * (this.cw ? .03 : .04); if (this.cut < .003) this.cut = 0;
        if (G.act === 'walkout') { if (G.actT >= 60 && !hold() && !G.ring) G.ring = () => [u(this.x + 160), v(1000)]; if (hold()) { G.ring = null; this.w = Math.min(1, this.w + .05); } else this.w = Math.max(0, this.w - .05); }
        // past the door he breaks into a run and runs on by himself
        const canRun = typeof RUNP !== 'undefined' && RUNP.ready;
        if (this.x > this.RUN0 && canRun) { if (G.act === 'walkout') { next(true); G.state = 'auto'; } this.rn = Math.min(1, this.rn + .08); this.w = 1; }
        if (this.rn > 0) {
          const sp = walkSpeed('C', .58) + (RUNP_META.vpx * 790 * .58 / 300 * .4 - walkSpeed('C', .58)) * this.rn;
          this.x += sp; this.ran += .4; this.fr += WALK_FPT;
          const st = Math.floor(this.ran * 2 / RUNP.length); if (st !== this.lst) { this.lst = st; if (typeof stepOn === 'function') stepOn('dirt', STEP_RUN || 1.2); }
        } else if (this.w > 0) {
          this.fr += WALK_FPT * this.w; this.x += walkSpeed('C', .58) * this.w;
          // build 492: his steps on the earth of the highway
          const st = Math.floor(this.fr * 2 / VIS.C.walk.fr); if (st !== this.lst) { this.lst = st; if (typeof stepOn === 'function') stepOn('dirt', 1); }
        }
        H.cam.to = 0;
        if (this.x > 3330) { this.a = Math.max(0, this.a - .03); if (G.act === 'walkout') { next(true); G.state = 'auto'; } }
        if (this.a <= 0 && H.ph !== 'end') { H.ph = 'end'; H.t = 0; }
        if (H.ph === 'end' && H.t === 40) finish();
      },
      under(c) { doorLight(c, 1, () => visitor(c, 'I', DOOR.x, -1, .58)); },
      people(c) {
        c.globalAlpha = this.a;
        if (this.rn < 1) { c.globalAlpha = this.a * (1 - this.rn); if (this.w > 0 || this.fr > 0) walkFig(c, 'C', this.x, this.fr, .58); else visitor(c, 'C', this.x, 1, .58); }
        if (this.rn > 0) { c.globalAlpha = this.a * this.rn; runner(c, this.x, Math.floor(this.ran), .58); }
        c.globalAlpha = 1;
      },
    },
  // FOLLOW THE INTERPRETER (owner, build 267: "Ok to do 1"): between two rooms a dark passage; the child touches once (build 312) to follow
  // the Interpreter's candle ("he took him by the hand, and led him into ..."). Christian walks (his own walk pictures,
  // dark), the Interpreter goes a step ahead with a candle, its light moving along the wall and the floor.
      pass: {
    // THE SAME HOUSE AS ITS ROOMS (build 508, owner: "make the passages look like the same house as the rooms"): every passage is now baked on
    // the rooms' own shell (bakeShell: the same plaster, high beamed ceiling, skirting, floor, end walls cut edge-on, lintel height), seen at the
    // rooms' own view and the visitors at the rooms' own size (shell 1, k 1). The way is a short stretch of the house in section: the doorway
    // they came through in the left end wall, a partition (another wall cut edge-on, PX) with the next room's doorway, and beyond it the next
    // room itself, dim, its own light falling through the doorway. Out of doors (to the garden, round the house) the house's back wall is cut
    // at PX and the night garden lies beyond it.
    pic: null, shell: 1, FY: 1250, cam0: 0, tone: [120, 92, 74], k: 1, PW: 3168,
    PX: 1720, PW2: 110,
    enter() { this.p = 0; this.fr = 0; this.w = 0; this.st = 0; this.go = false; this.vt = 0; this.left = false; this.kind = passKind(this.from, this.to); this.bk = this.bakeKey(); if (!pics[this.bk]) pics[this.bk] = this.bake(this.bk); pic(VIS.C.walk.n); pic(VIS.I.walk.n); if (this.to && ROOMS[this.to] && ROOMS[this.to].pic) pic(ROOMS[this.to].pic); },
    bakeKey() { const K = this.kind; return 'pass-' + (K === 'down' && this.to !== 'r6' ? 'downH' : K); },
    // the standing line at x: level in a corridor, rising up the great stair, falling down the cellar stair (S0 to S1 the flight)
    S0: 560, S1: 1360, RISE: 300,
    floorAt(x) { const q = Math.max(0, Math.min(1, (x - this.S0) / (this.S1 - this.S0))); return this.kind === 'up' ? this.FY - this.RISE * q : this.kind === 'down' ? this.FY - this.RISE * (1 - q) : this.FY; },
    bake(key) {
      const K = key.slice(5), { FY, LINTEL, END } = HOUSE, DH = FY - LINTEL, PX = this.PX, PW2 = this.PW2, X1 = EX.x1, Y0 = EX.y0, Y1 = EX.y1, RISE = this.RISE, S0 = this.S0, S1 = this.S1;
      const outdoors = K === 'out' || K === 'round', cellar = K === 'down';
      // the next room beyond the partition: a faint pool of its own light on its wall
      const beyond = outdoors ? [] : [{ x: PX + 700, y: (K === 'up' ? FY - RISE : FY) - 380, r: 1200, lit: cellar ? [70, 62, 54] : [104, 70, 40], half: cellar ? [36, 30, 26] : [52, 34, 20], sx: 1.1, a: cellar ? .5 : .7 }];
      // a doorway cut in an end wall (or the partition), its floor at fy: dark within, a thin lit jamb on the side toward the light, a lintel
      const endDoor = (c, x0, fy, jambR, arch) => {
        c.fillStyle = '#070403';
        if (arch) { const r = END / 2; c.fillRect(x0, fy - DH + 40, END, DH - 40); }
        else c.fillRect(x0, fy - DH, END, DH);
        c.fillStyle = '#3a2616'; c.fillRect(jambR ? x0 + END - 6 : x0, fy - DH, 6, DH); c.fillRect(x0, fy - DH - 6, END, 6);
      };
      return bakeShell({
        seed: 50 + key.length, doors: K === 'down' || K === 'up' || K === 'downH' ? '' : 'L', lights: beyond,
        wallC: cellar ? '#251c16' : '#2c1d13', floorC: '#1d130c',
        near(c, r) {
          // the stair: a flight of boards in section, each tread's nosing catching a little light, a handrail with balusters, and under the
          // upper floor the dark mass of the house's structure
          if (K === 'up' || K === 'down' || K === 'downH') {
            const up = K === 'up', top = FY - RISE, n = 12;
            c.fillStyle = '#1a110b'; c.beginPath(); c.moveTo(up ? S0 : EX.x0, up ? FY : top);
            if (!up) c.lineTo(S0, top);
            for (let i = 0; i < n; i++) { const xa = S0 + (S1 - S0) * i / n, xb = S0 + (S1 - S0) * (i + 1) / n, y = up ? FY - RISE * (i + 1) / n : top + RISE * i / n, y2 = up ? y : top + RISE * (i + 1) / n;
              if (up) { c.lineTo(xa, y); c.lineTo(xb, y); } else { c.lineTo(xa, y2); c.lineTo(xb, y2); } }
            if (up) { c.lineTo(X1, top); c.lineTo(X1, Y1); c.lineTo(S0, Y1); } else { c.lineTo(S1, FY); c.lineTo(S1, Y1); c.lineTo(EX.x0, Y1); }
            c.closePath(); c.fill();
            // the nosings and the skirting along the flight
            c.fillStyle = 'rgba(120,84,52,.4)';
            for (let i = 0; i < n; i++) { const xa = S0 + (S1 - S0) * i / n, xb = S0 + (S1 - S0) * (i + 1) / n, y = up ? FY - RISE * (i + 1) / n : top + RISE * (i + 1) / n; c.fillRect(xa, y, xb - xa, 3); }
            c.fillStyle = 'rgba(120,84,52,.22)'; if (up) c.fillRect(S1, top, X1 - S1, 3); else c.fillRect(EX.x0, top, S0 - EX.x0, 3);
            c.strokeStyle = '#2a1a0f'; c.lineWidth = 12; const hy = 330;
            c.beginPath(); c.moveTo(S0 - 80, (up ? FY : top) - hy); c.lineTo(S1 + 80, (up ? top : FY) - hy); c.stroke();
            c.lineWidth = 6; for (let i = 0; i <= n; i += 2) { const xa = S0 + (S1 - S0) * i / n, yb = up ? FY - RISE * i / n : top + RISE * i / n; c.beginPath(); c.moveTo(xa, yb); c.lineTo(xa, yb - hy + (up ? -RISE / n * 0 : 0)); c.stroke(); }
            // the doorway they came through, in the left end wall, at its own floor's level
            endDoor(c, EX.x0, up ? FY : top, true);
          }
          // THE PARTITION: the next room's wall cut edge-on, floor to ceiling, with its doorway (the cellar's a low stone arch)
          const pf = K === 'up' ? FY - RISE : FY;
          if (!outdoors) {
            c.fillStyle = 'rgba(8,5,3,.35)'; c.fillRect(PX + PW2, Y0, X1 - PX - PW2, Y1 - Y0);
            c.fillStyle = '#0c0705'; c.fillRect(PX, Y0, PW2, Y1 - Y0);
            if (cellar) { c.fillStyle = '#070403'; c.beginPath(); c.moveTo(PX, pf); c.lineTo(PX, pf - DH + 160); c.lineTo(PX + PW2, pf - DH + 160); c.lineTo(PX + PW2, pf); c.fill(); c.fillStyle = 'rgba(110,92,70,.35)'; c.fillRect(PX, pf - DH + 154, PW2, 6); }
            else endDoor(c, PX, pf, false);
            // the opening lit from the room beyond, brighter toward it, so the doorway reads as the way on
            { const top = cellar ? pf - DH + 160 : pf - DH, g = c.createLinearGradient(PX, 0, PX + PW2, 0), col = cellar ? '120,112,100' : '214,150,86';
              g.addColorStop(0, `rgba(${col},.05)`); g.addColorStop(1, `rgba(${col},${cellar ? .22 : .34})`); c.fillStyle = g; c.fillRect(PX, top, PW2, pf - top);
              const gv = c.createLinearGradient(0, top, 0, pf); gv.addColorStop(0, 'rgba(7,4,3,.6)'); gv.addColorStop(.5, 'rgba(7,4,3,0)'); c.fillStyle = gv; c.fillRect(PX, top, PW2, pf - top); }
            // the next room's light through the doorway, flat on the boards
            c.save(); c.translate(PX + PW2, pf + 18); c.scale(1, .1); const g = c.createRadialGradient(0, 0, 0, 0, 0, 600); g.addColorStop(0, cellar ? 'rgba(120,110,96,.25)' : 'rgba(200,140,80,.32)'); g.addColorStop(1, 'rgba(200,140,80,0)'); c.fillStyle = g; c.fillRect(-600, -600, 1200, 1200); c.restore();
            return;
          }
          // OUT OF DOORS: the night beyond the house's back wall (cut at PX), the garden wall, dark shrubs, the grass
          const gx = K === 'out' ? PX + PW2 : EX.x0;
          let g = c.createLinearGradient(0, Y0, 0, FY); g.addColorStop(0, '#070a14'); g.addColorStop(1, '#1b2132'); c.fillStyle = g; c.fillRect(gx, Y0, X1 - gx, FY - Y0);
          for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(220,224,240,${(.15 + r() * .45).toFixed(2)})`; c.fillRect(gx + r() * (X1 - gx), Y0 + r() * 1000, 2.4, 2.4); }
          c.fillStyle = '#121812'; c.fillRect(gx, FY - 170, X1 - gx, 170); c.fillStyle = 'rgba(110,120,130,.18)'; c.fillRect(gx, FY - 170, X1 - gx, 4);
          c.fillStyle = '#0d120d'; for (let x = gx + 80; x < X1; x += 300 + r() * 220) { for (let k = 0; k < 4; k++) { c.beginPath(); c.ellipse(x + (r() - .5) * 140, FY - 190 - r() * 90, 90 + r() * 70, 70 + r() * 50, 0, 0, 6.2832); c.fill(); } }
          c.fillStyle = '#111710'; c.fillRect(gx, FY, X1 - gx, Y1 - FY); c.fillStyle = 'rgba(90,110,80,.18)'; c.fillRect(gx, FY, X1 - gx, 3);
          if (K === 'out') {
            // the back wall cut edge-on, its door standing open on the night
            c.fillStyle = '#0c0705'; c.fillRect(PX, Y0, PW2, Y1 - Y0); c.fillStyle = '#1b2132'; c.fillRect(PX, LINTEL, PW2, FY - LINTEL);
            c.fillStyle = '#3a2616'; c.fillRect(PX, LINTEL - 6, PW2, 6); c.fillStyle = '#2a1a0f'; c.fillRect(PX + PW2, LINTEL, 26, FY - LINTEL);
          } else {
            // going round: the house's back wall on the left, its plaster outside at night, two of its windows lit, its corner at PX
            c.fillStyle = '#231b16'; c.fillRect(EX.x0, Y0, PX - EX.x0, FY - Y0); c.fillStyle = 'rgba(40,46,60,.35)'; c.fillRect(PX - 10, Y0, 10, FY - Y0);
            c.fillStyle = 'rgba(12,9,7,.55)'; c.fillRect(EX.x0, FY - 1100, PX - EX.x0, 26);
            for (const wx of [100, 1000]) { c.fillStyle = '#120c08'; c.fillRect(wx - 16, FY - 780 - 16, 182, 292); c.fillStyle = '#c98a48'; c.fillRect(wx, FY - 780, 150, 260); c.fillStyle = '#120c08'; c.fillRect(wx + 71, FY - 780, 8, 260); c.fillRect(wx, FY - 655, 150, 8); }
            c.fillStyle = '#111710'; c.fillRect(EX.x0, FY, PX - EX.x0, Y1 - FY);
          }
        },
      });
    },
    scene(c) { const im = pics[this.bk]; if (im) c.drawImage(im, u(EX.x0), v(EX.y0), (EX.x1 - EX.x0) * S, (EX.y1 - EX.y0) * S); },
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
    // Christian from C0, the Interpreter from I0 (he walks slower in his clip, so he starts further on and ends in the next doorway)
    C0: 420, I0: 1120, LEN: 1000,
    x() { return this.C0 + this.p * this.LEN; },
    ix() { return this.I0 + this.p * this.LEN * walkSpeed('I', this.k) / walkSpeed('C', this.k); },
    upd() {
      if (G.act === 'follow') {
        if (hold()) this.start();
        if (G.actT >= 50 && !this.go && !G.ring) G.ring = () => [u(this.x() + 420), v(this.FY - 400)];
      }
      if (this.go) {
        this.w = Math.min(1, this.w + .04); this.vt++;
        // he arrives once the passage is walked and the verse has had time to be read
        if (this.p >= 1 && this.vt >= this.need && !this.left) { this.left = true; dlg.className = ''; document.body.classList.remove('capped'); goTo(this.to); }
      } else this.w = Math.max(0, this.w - .06);
      this.p = Math.min(1, this.p + walkSpeed('C', this.k) / this.LEN * this.w); this.fr += WALK_FPT * this.w;
      const step = Math.floor(this.fr * 2 / VIS.C.walk.fr); if (step !== this.st) {
        this.st = step;
        // build 492: the ground under his feet: boards in the house, the cellar's stone, the garden's grass out of doors
        const late = this.x() > this.PX + 40, surf = this.kind === 'round' ? 'grass' : this.kind === 'out' ? (late ? 'grass' : 'wood')
          : this.kind === 'down' ? (this.to === 'r6' ? (late ? 'stone' : 'wood') : 'wood') : 'wood';
        if (!(typeof stepOn === 'function' && audio() && (stepOn(surf, 1), true))) { noise(200, 1.5, .2, .06); noise(140, 1.2, .25, .04, .05); }
      }
    },
    draw(c) {
      const ix = this.ix(), fl = 1 + .06 * Math.sin(G.t / 4.7) * Math.sin(G.t / 11), iy = this.floorAt(ix), cy = this.floorAt(this.x()), lx = u(ix) + 41, ly = v(iy) - 156;
      this.scene(c);
      // only what the candle reaches is seen (out of doors, a little of the night as well)
      const sky = this.kind === 'out' || this.kind === 'round'; darkWith(c, [[lx, ly, 634 * fl], [lx, v(iy) + 4, 780 * fl, .8], [u(this.PX + 500), v(this.floorAt(this.PX + 500)) - 160, 520, .5]], sky ? .5 : .8);
      // the candle's light on the passage wall and, flat, on the floor
      glow(c, lx, ly, 402 * fl, [255, 170, 90], .2); c.save(); c.translate(lx, v(iy) + 2); c.scale(1, .12); glow(c, 0, 0, 463 * fl, [255, 170, 90], .32); c.restore();
      // both walk at their videos' own full pace, each moving at the floor speed that keeps his planted foot still (build 320)
      walkFig(c, 'I', ix, this.fr, this.k, 1, H.R.tone, iy);
      walkFig(c, 'C', this.x(), this.fr, this.k, 1, H.R.tone, cy);
      glow(c, lx, ly, 32 * fl, [255, 226, 160], .7); c.fillStyle = 'rgba(255,240,200,.95)'; c.beginPath(); c.ellipse(lx, ly - 2, 2, 4.1, 0, 0, 6.2832); c.fill();
      // where they are in the house: a small cutaway in the corner, the rooms seen faintly lit, the candle going from one to the next
      if (this.from === 'r1') { c.save(); c.setTransform(DPR, 0, 0, DPR, 0, 0); housePlan(c, VW - 170, 74, 1.5, this.from, this.to, this.p); c.restore(); }
    },
  },
  };
});
