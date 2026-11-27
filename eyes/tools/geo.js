// node geo.js DIR look f1,f2 -> DIR/d-LOOK-FFF.png and DIR/geo-FFF.json (the drawing's lids and iris, in canvas pixels)
const { chromium } = require('playwright'); const fs = require('fs'); const [dir, look, fl] = [process.argv[2], process.argv[3], process.argv[4].split(',')];
(async () => { const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1650, height: 520 } });
  await p.goto(`http://localhost:8124/page2.html?data=${dir}`); await p.waitForFunction(() => document.title === 'done');
  for (const f of fl) { const g = await p.evaluate(([f, l]) => { drawEyes.geo = {}; drawEyes(cx, cv.width, cv.height, +f, l); const S = cv.width / 1.62, X = u => cv.width / 2 + u * S, Y = v => cv.height * .56 + v * S, o = {};
      const cur = P => { const out = []; for (let i = 0; i < P.length - 1; i++) { const a = P[Math.max(0, i - 1)], b = P[i], d = P[i + 1], e = P[Math.min(P.length - 1, i + 2)]; for (let t = 0; t < 1; t += .1) { const t2 = t * t, t3 = t2 * t; out.push([.5 * (2 * b[0] + (-a[0] + d[0]) * t + (2 * a[0] - 5 * b[0] + 4 * d[0] - e[0]) * t2 + (-a[0] + 3 * b[0] - 3 * d[0] + e[0]) * t3), .5 * (2 * b[1] + (-a[1] + d[1]) * t + (2 * a[1] - 5 * b[1] + 4 * d[1] - e[1]) * t2 + (-a[1] + 3 * b[1] - 3 * d[1] + e[1]) * t3)]); } } out.push(P[P.length - 1]); return out.map(q => [X(q[0]), Y(q[1])]); };
      for (const e of ['R', 'L']) { const G = drawEyes.geo[e]; if (G) o[e] = { up: cur(G.up), lo: cur(G.lo), ic: [X(G.ic[0]), Y(G.ic[1])], r: G.r * S }; } return o; }, [f, look]);
    fs.writeFileSync(`${__dirname}/${dir}/geo-${String(f).padStart(3, '0')}.json`, JSON.stringify(g)); await (await p.$('canvas')).screenshot({ path: `${__dirname}/${dir}/d-${look}-${String(f).padStart(3, '0')}.png` }); }
  await b.close(); })();
