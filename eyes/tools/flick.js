// draws every frame, measures mean brightness in boxes over each upper lid and at each outer corner; prints frames where it jumps
const { chromium } = require('playwright'); const look = process.argv[2] || 'western';
(async () => { const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1650, height: 520 } });
  await p.goto(`http://localhost:8124/page.html?d=m&f=0&look=${look}`); await p.waitForFunction(() => document.title === 'done');
  const r = await p.evaluate(look => { const cv = document.getElementById('c'), c = cv.getContext('2d', { willReadFrequently: true }), W = cv.width, H = cv.height, S = W / 1.62, cx = W / 2, cy = H * .56, out = [];
    for (let f = 0; f < 254; f += .5) { drawEyes(c, W, H, f, look); const row = [];
      for (const e of ['R', 'L']) { const up = pts(e, 'up', f), cr = pts(e, 'cr', f); const x0 = cx + Math.min(up[0][0], up[8][0]) * S, x1 = cx + Math.max(up[0][0], up[8][0]) * S, y0 = cy + (cr[3][1] - .02) * S, y1 = cy + (up[4][1] + .0) * S;
        const d = c.getImageData(x0 | 0, y0 | 0, Math.max(2, (x1 - x0) | 0), Math.max(2, (y1 - y0) | 0)).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; row.push(s / d.length * 4 / 3); }
      out.push(row); } return out; }, look);
  const jumps = []; for (let i = 2; i < r.length; i++) for (const k of [0, 1]) { const d2 = Math.abs(r[i][k] - 2 * r[i - 1][k] + r[i - 2][k]); if (d2 > 2.5) jumps.push([(i / 2).toFixed(1), 'RL'[k], r[i - 2][k].toFixed(1), r[i - 1][k].toFixed(1), r[i][k].toFixed(1)]); }
  console.log(look, 'jumps:', jumps.length); console.log(jumps.slice(0, 40).map(j => j.join(' ')).join('\n')); await b.close(); })();
