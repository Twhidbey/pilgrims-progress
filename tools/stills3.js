// Level 3 stills at any story moment, for looking at a change before pushing (free; no sound, no waiting).
//   python3 -m http.server 8123 &      (in the repo)
//   node tools/stills3.js OUT "COND" [N] [hold] [at]
// Steps the level tick by tick (the page's own loop paused) until COND is true, then saves N pictures (default 1),
// one a tick, to the folder OUT (f000.png ...). COND is JavaScript with `s` = HL.peek(), e.g.
//   "G.act === 'hill' && G.actT > 150"              the far mountain as Wiseman points
//   "s.ph === 'path' && s.x > 3400"                 on the rocky path (with at = hill)
//   "s.ph === 'still' && s.zs === 'hold'"           the wide shot of the whole mountain (with at = hill)
//   "s.ph === 'evan'"                               at the foot with Evangelist (with at = hill)
// hold: 1 (default) keeps holding to walk while recording; 0 stands still. at: a skip place (hill | evangelist | gate).
// While stepping it holds to walk, passes lines, and touches the hill when asked. HL.peek().hb is the hill's
// [screen x of its foot, screen y of its foot, scale] at the last drawing, for placing touches (see wideTouch in hill.js).
const { chromium } = require('playwright'); const fs = require('fs');
const [out, cond, N, holdS, at] = [process.argv[2], process.argv[3], +process.argv[4] || 1, process.argv[5] || '1', process.argv[6] || ''];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: +(process.env.DSF || 1) });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('http://localhost:' + (process.env.PORT || 8123) + '/index.html?level=3' + (at ? '&at=' + at : '')); await p.waitForSelector('body.bookready'); await p.click('.tcover'); await p.waitForTimeout(3000);
  await p.click('.lv[data-lv="3"]'); await p.waitForTimeout(3500);
  await p.evaluate(() => { KS.paused = true; });
  const r = await p.evaluate(c => { let k = 0; for (; k < 60000; k++) { const s = HL.peek(); if (eval(c)) break; keys.r = G.state === 'play'; if (G.state === 'dialog') { if (G.act === 'hill') { if (G.actT > 170) HL.key(); } else if (G.act) { if (G.actT > 140) HL.key(); } else if (!G.act && G.guard <= 0) next(true); } update(); } return k; }, cond);
  console.log('reached after', r, 'ticks');
  fs.mkdirSync(out, { recursive: true });
  for (let i = 0; i < N; i++) {
    await p.evaluate(h => { keys.r = h && G.state === 'play'; if (G.state === 'dialog' && !G.act && G.guard <= 0) next(true); update(); HL.draw(); }, holdS === '1');
    const url = await p.evaluate(() => cv.toDataURL('image/png'));
    fs.writeFileSync(`${out}/f${String(i).padStart(3, '0')}.png`, Buffer.from(url.split(',')[1], 'base64'));
  }
  console.log(JSON.stringify(await p.evaluate(() => HL.peek())).slice(0, 300));
  console.log(errs.length ? errs : 'no page errors'); await b.close();
})();
