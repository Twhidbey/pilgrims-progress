// Level 4 (the Interpreter's House) stills at any story moment (free; no sound, no waiting).
//   python3 -m http.server 8123 &      (in the repo)
//   node tools/stills4.js OUT ROOM "COND" [N] [extra query]
// ROOM: door | 1..7 | leave. Steps the house tick by tick (the page's own loop paused, short real pauses so pictures
// load and rooms change) until COND is true, then saves N pictures, one every STEP ticks (env, default 1), to OUT.
// COND is JavaScript with `s` = RM.peek(), e.g.
//   "s.room === 'r1' && s.ph === 'run'"          room 1 as it opens
//   "s.room === 'r1' && s.ph === 'light' && s.t > 200"   the candle lit
//   "s.room === 'pass'"                          the passage after the room
// It passes lines, does every act (holds for the hold acts) and follows into the next rooms.
// extra query: e.g. "drawn" adds &drawn. DARK=1 turns the darker rooms on. DSF=2 for twice the size. PORTRAIT=1 for an upright phone.
const { chromium } = require('playwright'); const fs = require('fs');
const [out, room, cond, N, extra] = [process.argv[2], process.argv[3], process.argv[4], +process.argv[5] || 1, process.argv[6] || ''];
const STEP = +(process.env.STEP || 1);
(async () => {
  const b = await chromium.launch(); const vp = process.env.PORTRAIT ? { width: 390, height: 844 } : { width: 960, height: 540 };
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: +(process.env.DSF || 1) });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  if (process.env.DARK) await p.addInitScript(() => localStorage.setItem('pp-dark', '1'));
  await p.goto('http://localhost:' + (process.env.PORT || 8123) + '/index.html?room=' + room + (extra ? '&' + extra : ''));
  await p.waitForSelector('body.bookready'); await p.click('.tcover'); await p.waitForTimeout(2500);
  for (let i = 0; i < 40 && !(await p.evaluate(() => RM.on && RM.peek().room)); i++) await p.waitForTimeout(250);
  await p.evaluate(() => { KS.paused = true; });
  const step = n => p.evaluate(([c, n]) => {
    for (let k = 0; k < n; k++) {
      const s = RM.peek(); if (eval(c)) return true;
      keys.push = !!(G.act && RM.HOLDS.includes(G.act));
      if (G.state === 'dialog') { if (G.act) { if (!RM.HOLDS.includes(G.act) && G.actT > 100) RM.key(); } else if (G.guard <= 0) next(true); }
      update();
    }
    return false;
  }, [cond, n]);
  let ok = false, ticks = 0;
  for (; ticks < 200000 && !ok; ticks += 120) { ok = await step(120); await p.waitForTimeout(15); }
  console.log(ok ? 'reached' : 'NOT reached', JSON.stringify(await p.evaluate(() => RM.peek())));
  fs.mkdirSync(out, { recursive: true });
  for (let i = 0; i < N; i++) {
    if (i) await p.evaluate(n => { for (let k = 0; k < n; k++) { if (G.state === 'dialog' && !G.act && G.guard <= 0) next(true); update(); } }, STEP);
    await p.evaluate(() => RM.draw());
    const url = await p.evaluate(() => cv.toDataURL('image/png'));
    fs.writeFileSync(`${out}/f${String(i).padStart(3, '0')}.png`, Buffer.from(url.split(',')[1], 'base64'));
  }
  console.log(errs.length ? errs : 'no page errors'); await b.close();
})();
