// node tools/mannequin/sheet.js out.png classic "[0,5,10,14,19,24,29,33]" 2  : the bare mannequin above, the clothed figure below, at chosen frames
const { chromium } = require('playwright');
(async () => {
  const [, , out, anim, picks, zz] = process.argv, Z = +(zz || 2);
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8123/mannequin.html'); await p.waitForTimeout(900);
  await p.evaluate(({ anim, picks, Z }) => {
    const W = 170, H = 310, cv = document.createElement('canvas'); cv.width = picks.length * W * Z; cv.height = H * Z * 2; cv.id = 'sheet'; document.body.appendChild(cv);
    const x = cv.getContext('2d'); x.fillStyle = '#7d8a96'; x.fillRect(0, 0, cv.width, cv.height); x.fillStyle = '#5f6a74'; x.fillRect(0, (H - 12) * Z, cv.width, 12 * Z); x.fillRect(0, (2 * H - 12) * Z, cv.width, 12 * Z);
    picks.forEach((f, i) => {
      const S = MQ.skelAt(anim, f), Q = MQ.clothAt(anim, f), ox = (i * W + 95) * Z;
      MQ.body(x, S, ox, (H - 12) * Z, 1, Z); MQ.figure(x, S, Q, ox, (2 * H - 12) * Z, 1, Z);
      x.fillStyle = '#fff'; x.font = '14px sans-serif'; x.fillText('frame ' + f, i * W * Z + 6, 16);
    });
  }, { anim, picks: JSON.parse(picks), Z });
  await (await p.$('#sheet')).screenshot({ path: out }); await b.close();
})();
