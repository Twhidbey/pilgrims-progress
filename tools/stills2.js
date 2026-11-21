// Level 2 stills at any story moment, for before-and-after comparisons (free; no sound, no waiting).
//   python3 -m http.server 8123 &      (in the repo)
//   node tools/stills2.js OUT "COND" [N] [hold] [at]
// Steps the level tick by tick (the page's own loop paused) until COND is true, then saves N pictures (default 1),
// one a tick, to the folder OUT (f000.png ...). COND is JavaScript with `s` = SL.peek(), e.g.
//   "s.ph === 'pli' && s.pl && s.pl.ct > 40"       the quarrel in the mire (with at = bog)
//   "s.ph === 'wade' && s.x > -700"                  wading (with at = bog)
//   "s.ph === 'help' && s.mv > 150"                  Help kneeling, the whole oak (with at = bog)
// STEP=n (env): n ticks between pictures (default 1), for filmstrips.
// hold: 1 (default) keeps holding to walk while recording; 0 stands still. at: a skip place (bog). DSF=2 for twice the size.
// While stepping it holds to walk, passes lines, picks "struggle on", and takes Help's hand when asked.
const { chromium } = require('playwright'); const fs = require('fs');
const [out, cond, N, holdS, at] = [process.argv[2], process.argv[3], +process.argv[4] || 1, process.argv[5] || '1', process.argv[6] || ''];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: +(process.env.DSF || 1) });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('http://localhost:8123/index.html?level=2' + (at ? '&at=' + at : '')); await p.waitForSelector('body.bookready'); await p.click('.tcover'); await p.waitForTimeout(3000);
  await p.click('.lv[data-lv="2"]'); await p.waitForTimeout(3500);
  await p.evaluate(() => { KS.paused = true; });
  const r = await p.evaluate(c => { let k = 0; for (; k < 60000; k++) { const s = SL.peek(); if (eval(c)) break; keys.r = G.state === 'play'; if (G.state === 'choice') pick(false); if (G.state === 'dialog') { if (G.act === 'hand') { if (G.actT > 30) SL.grip(); } else if (!G.act && G.guard <= 0) next(true); } update(); } return k; }, cond);
  console.log('reached after', r, 'ticks');
  fs.mkdirSync(out, { recursive: true }); const log = [];
  for (let i = 0; i < N; i++) {
    await p.evaluate(([h, st]) => { for (let j = 0; j < st; j++) { keys.r = h && G.state === 'play'; if (G.state === 'choice') pick(false); if (G.state === 'dialog') { if (G.act === 'hand') { if (G.actT > 30) SL.grip(); } else if (!G.act && G.guard <= 0) next(true); } update(); } SL.draw(); SL.draw(); }, [holdS === '1', +(process.env.STEP || 1)]);      // drawn twice: the wet shadows use the last drawing's figures
    const url = await p.evaluate(() => cv.toDataURL('image/png'));
    fs.writeFileSync(`${out}/f${String(i).padStart(3, '0')}.png`, Buffer.from(url.split(',')[1], 'base64'));
    log.push(await p.evaluate(() => { const s = SL.peek(); return { ph: s.ph, x: s.x, y: s.y, sx: (s.x - s.cam.cx) * s.cam.z + VW / 2, sy: s.cam.wl, z: s.cam.z, rt: s.c2.rt, reach: s.c2.reach, lift: s.lift, line: document.querySelector('#dlg .t').textContent.slice(0, 50) }; }));
  }
  fs.writeFileSync(`${out}/log.json`, JSON.stringify(log));
  console.log(JSON.stringify(await p.evaluate(() => SL.peek())).slice(0, 200));
  console.log(errs.length ? errs : 'no page errors'); await b.close();
})();
