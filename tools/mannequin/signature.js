// node tools/mannequin/signature.js  (with python3 -m http.server 8123 running in the repo)
// How a walk FEELS, in numbers: the same measures read off the outlines of his old frames and of the mannequin, frame by
// frame (top of the head, front of the head, chest, back, hip, hem), each given as mean, range and its swing once (k1),
// twice (k2) ... a stride: size, then where in the stride it peaks. Use it to see where the mannequin is stiffer.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(), p = await b.newPage(); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8123/mannequin.html'); await p.waitForTimeout(1200);
  const out = await p.evaluate(async () => {
    const buf = await (await fetch('assets/christian-walk-nb.pack')).arrayBuffer(), dv = new DataView(buf), n = dv.getUint32(0, true), ims = []; let off = 4 + 4 * n;
    for (let i = 0; i < n; i++) { const len = dv.getUint32(4 + 4 * i, true); ims.push(await createImageBitmap(new Blob([buf.slice(off, off + len)], { type: 'image/webp' }))); off += len; }
    const W = 260, H = 320, OX = 40, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d', { willReadFrequently: true });
    const measure = () => {
      const d = x.getImageData(0, 0, W, H).data, on = (px, py) => d[(py * W + px) * 4 + 3] > 110;
      let top = -1; for (let py = 0; py < H && top < 0; py++) for (let px = 0; px < W; px++) if (on(px, py)) { top = py; break; }
      const ext = (y0, y1) => { let lo = 1e9, hi = -1e9; for (let py = y0; py < y1; py++) for (let px = 0; px < W; px++) if (on(px, py)) { if (px < lo) lo = px; if (px > hi) hi = px; } return [lo - OX, hi - OX]; };
      const head = ext(top + 6, top + 34), chest = ext(95, 135), back = ext(70, 140), hipb = ext(150, 185), hem = ext(232, 246);
      // the centroid of the upper body (above y 150), and of the head band
      let sx = 0, sy = 0, m = 0; for (let py = 0; py < 150; py++) for (let px = 0; px < W; px++) if (on(px, py)) { sx += px; sy += py; m++; }
      return { top, headF: head[1], headB: head[0], chestF: chest[1], backB: back[0], hipF: hipb[1], hipB: hipb[0], hemF: hem[1], hemB: hem[0], cx: sx / m - OX, cy: sy / m };
    };
    const res = { old: [], mq: [] };
    for (let i = 0; i < n; i++) { x.clearRect(0, 0, W, H); x.drawImage(ims[i], OX, 0); res.old.push(measure()); }
    for (let i = 0; i < 38; i++) { const f = (i - 7 + 38) % 38; x.clearRect(0, 0, W, H); MQ.figure(x, MQ.skelAt('classic', f), MQ.clothAt('classic', f), OX + MQ.K.ax, MQ.K.ground, 1, 1); res.mq.push(measure()); }
    return res;
  });
  const keys = Object.keys(out.old[0]), n = 38;
  const harm = (xs, k) => { let c = 0, s = 0; xs.forEach((v, i) => { c += v * Math.cos(2 * Math.PI * k * i / n); s += v * Math.sin(2 * Math.PI * k * i / n); }); c *= 2 / n; s *= 2 / n; return [Math.hypot(c, s).toFixed(2), ((Math.atan2(s, c) / (2 * Math.PI) + 1) % 1).toFixed(2)]; };
  for (const k of keys) { const row = w => { const xs = out[w].map(r => r[k]), mean = xs.reduce((a, b) => a + b, 0) / n; return w + ' mean ' + mean.toFixed(1) + ' range ' + (Math.max(...xs) - Math.min(...xs)).toFixed(1) + ' k1 ' + harm(xs, 1) + ' k2 ' + harm(xs, 2) + ' k3 ' + harm(xs, 3) + ' k4 ' + harm(xs, 4); }; console.log(k.padEnd(7), row('old'), '\n       ', row('mq')); }
  await b.close();
})();
