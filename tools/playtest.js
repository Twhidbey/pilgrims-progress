// A machine play-through of the game in a headless browser (no sound is heard: see CLAUDE.md, build 64).
//   python3 -m http.server 8123 &          (in the repo)
//   node tools/playtest.js 3               (level 1, 1back, 2, 2back or 3; "back" = choose going home / going back; add a folder for stills: node tools/playtest.js 3 /tmp/shots)
// It opens the book, picks the level, holds to walk, passes every line, does every act, and stops at the end card.
// It prints the phases it went through and fails (exit 1) on any page error or if the end card is not reached.
const { chromium } = require('playwright');
const which = process.argv[2] || '3', shots = process.argv[3], lv = parseInt(which), q = process.argv[4] || '';
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: shots ? 2 : 1 });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
  await p.goto(`http://localhost:8123/index.html?level=${lv}${lv === 1 ? '&x=1' : ''}${q}`);
  await p.waitForSelector('body.bookready', { timeout: 60000 }); await p.click('.tcover'); await p.waitForTimeout(3000);
  if (shots) await p.screenshot({ path: `${shots}/title-${which}.png` });
  await p.click(`.lv[data-lv="${lv}"]`); await p.waitForTimeout(2500);
  let last = '', n = 0;
  for (let i = 0; i < 400; i++) {
    const r = await p.evaluate(back => {
      const M = CR.on ? CR : HL.on ? HL : SL.on ? SL : null;
      for (let k = 0; k < 240 && G.state !== 'end'; k++) {
        keys.r = G.state === 'play'; if (G.state === 'dialog' && G.act === 'gate') keys.push = true;
        if (G.state === 'dialog') { if (G.act === 'hand') SL.grip(); else if (G.act === 'light') lightTouched(); else if (HL.on && G.act) HL.key(); else if (CR.on && G.act) CR.key(); else if (G.act === 'walkon') keys.push = true; else if (!G.act) next(true); }
        if (G.state === 'choice') pick(back);
        update();
      }
      if (M) M.draw(); else draw();
      return { st: G.state, ph: M ? M.peek().ph : 'x' + Math.round(P.x / 500), txt: document.querySelector('#dlg .t').textContent.slice(0, 40) };
    }, which.endsWith('back'));
    const key = r.st + ':' + r.ph;
    if (key !== last) { console.log(key, '|', r.txt); last = key; if (shots) await p.screenshot({ path: `${shots}/${which}-${String(n++).padStart(2, '0')}-${r.ph}.png` }); }
    if (r.st === 'end') break;
  }
  const end = await p.evaluate(() => G.state);
  if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
  console.log(end === 'end' && !errs.length ? 'OK: reached the end card' : 'FAILED: state ' + end);
  await b.close(); process.exit(end === 'end' && !errs.length ? 0 : 1);
})();
