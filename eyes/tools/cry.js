// node cry.js look -> cry-LOOK-N.png: the crying take (clip 2's wide open stretch, held, with the feeling laid over), in a tall band
const { chromium } = require('playwright'); const look = process.argv[2] || 'natural';
const FXSRC = require('fs').readFileSync(__dirname + '/cryfx.js', 'utf8') + ';window.cryFx = cryFx; window.cryF = cryF;';
(async () => { const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1650, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto(`http://localhost:8124/page2.html?data=c2`); await p.waitForFunction(() => document.title === 'done'); await p.evaluate(FXSRC); await p.evaluate(() => { cv.height = 580; drawEyes.cyK = 291 / 580; });
  let i = 0; for (const s of [0.2, 2.4, 4.5, 7, 9.5, 12, 15.1, 17.5, 20.5, 23.5]) { await p.evaluate(([s, l]) => { drawEyes.fx = cryFx(s); drawEyes(cx, cv.width, cv.height, cryF(s), l); }, [s, look]); await (await p.$('canvas')).screenshot({ path: `${__dirname}/cry-${look}-${i++}.png` }); }
  console.log(errs.join('|') || 'ok'); await b.close(); })();
