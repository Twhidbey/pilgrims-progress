// node tools/mannequin/compare.js christian-walk-nb walk out.png "[0,7,14]" 2
// render the mannequin for every frame of an animation beside its pack frame; report the overlap; save a sheet
const { chromium } = require('playwright');
(async () => {
  const [, , pack, anim, out, picks, zz] = process.argv, Z = +(zz || 2);
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8123/mannequin.html'); await p.waitForTimeout(800);
  const r = await p.evaluate(async ({ pack, anim, picks, Z }) => {
    const res = await fetch('assets/' + pack + '.pack'), buf = await res.arrayBuffer(), dv = new DataView(buf), n = dv.getUint32(0, true);
    const ims = []; let off = 4 + 4 * n;
    for (let i = 0; i < n; i++) { const len = dv.getUint32(4 + 4 * i, true); ims.push(await createImageBitmap(new Blob([buf.slice(off, off + len)], { type: 'image/webp' }))); off += len; }
    await MQ.load('assets/mannequin.json?' + Math.random());
    const C = MQ.costume, W = ims[0].width, H = ims[0].height, A = MQ.anims[anim];
    const ax = A.ax || C.ax, gr = A.ground || C.ground;
    const c1 = new OffscreenCanvas(W, H), x1 = c1.getContext('2d', { willReadFrequently: true }), c2 = new OffscreenCanvas(W, H), x2 = c2.getContext('2d', { willReadFrequently: true });
    const ious = [];
    for (let f = 0; f < n; f++) {
      x1.clearRect(0, 0, W, H); x1.drawImage(ims[f], 0, 0); x2.clearRect(0, 0, W, H); MQ.draw(x2, MQ.poseAt(anim, f), ax, gr, 1, 1);
      const a = x1.getImageData(0, 0, W, H).data, m = x2.getImageData(0, 0, W, H).data; let I = 0, U = 0;
      for (let i = 3; i < a.length; i += 4) { const p = a[i] > 127, q = m[i] > 127; if (p && q) I++; if (p || q) U++; }
      ious.push(I / U);
    }
    const cv = document.createElement('canvas'); cv.width = picks.length * W * Z; cv.height = H * Z * 2; document.body.appendChild(cv); cv.id = 'sheet';
    const x = cv.getContext('2d'); x.fillStyle = '#7d8a96'; x.fillRect(0, 0, cv.width, cv.height); x.imageSmoothingEnabled = true;
    picks.forEach((f, i) => {
      x.drawImage(ims[f], i * W * Z, 0, W * Z, H * Z);
      MQ.draw(x, MQ.poseAt(anim, f), i * W * Z + ax * Z, H * Z + gr * Z, 1, Z);
      x.fillStyle = '#fff'; x.font = '14px sans-serif'; x.fillText('frame ' + f + '  overlap ' + ious[f].toFixed(3), i * W * Z + 6, 16); x.fillText('drawn', i * W * Z + 6, H * Z + 16);
    });
    return ious;
  }, { pack, anim, picks: JSON.parse(picks), Z });
  console.log('overlap mean', (r.reduce((a, b) => a + b) / r.length).toFixed(3), 'min', Math.min(...r).toFixed(3), 'at', r.indexOf(Math.min(...r)));
  await (await p.$('#sheet')).screenshot({ path: out });
  await b.close();
})();
