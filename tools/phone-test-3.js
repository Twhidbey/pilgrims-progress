// Level 3 on an emulated iPhone with real touches only (no keys, no calls into the story): hold a finger to walk,
// tap to pass lines, touch the hill, knock on the gate. It also checks that he never moves while no finger is down
// (except the mist's jump to the gate and the cut from the brow to the rocky path), and prints where each phase began.
//   python3 -m http.server 8123 &   then   node tools/phone-test-3.js            (or: node tools/phone-test-3.js hill|evangelist|gate)
const { chromium, devices } = require('playwright');
const at = process.argv[2] || '';
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13 landscape'] }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://localhost:8123/?level=3' + (at ? '&at=' + at : ''));
  await pg.waitForSelector('body.bookready'); await pg.waitForTimeout(600);
  await pg.tap('.tcover'); await pg.waitForTimeout(3300);
  await pg.evaluate(() => { G.calm = 99999; });      // a stale clock, as if another level had just been played
  await pg.tap('.lv[data-lv="3"]'); await pg.waitForTimeout(2500);
  const cdp = await ctx.newCDPSession(pg);
  const toClient = ([sx, sy]) => pg.evaluate(([sx, sy]) => { const r = cv.getBoundingClientRect(); return [r.left + sx / VW * r.width, r.top + sy / VH * r.height]; }, [sx, sy]);
  let down = false;
  const press = async (x, y) => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] }); down = true; };
  const lift = async () => { await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); down = false; };
  const tap = async (x, y) => { await press(x, y); await pg.waitForTimeout(60); await lift(); };
  let last = '', lastX = null, lastStand = true, moved = [], t0 = Date.now();
  for (let i = 0; i < 2400 && Date.now() - t0 < 600000; i++) {
    const s = await pg.evaluate(() => ({ st: G.state, act: G.act, guard: G.guard > 0, ...HL.peek(), txt: document.querySelector('#dlg .t').textContent.slice(0, 50) }));
    if (s.st === 'end') { console.log('end card after', Math.round((Date.now() - t0) / 1000), 's'); break; }
    const key = s.st + ':' + s.ph;
    if (key !== last) { console.log(key.padEnd(16), 'x', s.x, '|', s.txt); last = key; }
    if (lastX != null && !down && lastStand && Math.abs(s.x - lastX) > 3 && s.ph !== 'gate' && s.ph !== 'mist' && !(s.ph === 'path' && lastX < 2900) && !(s.pull >= 0)) moved.push(`${s.ph} ${lastX} -> ${s.x}`);
    lastX = s.x; lastStand = s.stand;      // finishing a stride after the finger lifts is allowed; moving while standing is not (nor Good-will's pull at the gate, a story move the touch on his hand starts)
    if (s.st === 'play') { if (!down) await press(480, 200); await pg.waitForTimeout(250); continue; }
    if (down) await lift();
    if (s.st === 'dialog' && s.act === 'hill') { await pg.waitForTimeout(400); const pt = await pg.evaluate(() => HL.pt ? HL.pt('hill') : null); if (pt) await tap(...await toClient(pt)); else await pg.waitForTimeout(200); continue; }
    if (s.st === 'dialog' && s.act === 'ehand') { await pg.waitForTimeout(500); const pt = await pg.evaluate(() => HL.pt('hand')); await tap(...await toClient(pt)); continue; }
    if (s.st === 'dialog' && s.act === 'pull') { await pg.waitForTimeout(600); const pt = await pg.evaluate(() => HL.pt('pull')); if (pt) await tap(...await toClient(pt)); await pg.waitForTimeout(1800); continue; }
    if (s.st === 'dialog' && s.act === 'knock') { await pg.waitForTimeout(700); const pt = await pg.evaluate(() => HL.pt ? HL.pt('gate') : null); if (pt) await tap(...await toClient(pt)); continue; }
    if (s.st === 'dialog' && !s.act && !s.guard) { await tap(480, 120); await pg.waitForTimeout(150); continue; }
    await pg.waitForTimeout(250);
  }
  console.log(moved.length ? 'MOVED WITH NO FINGER DOWN:\n  ' + moved.join('\n  ') : 'never moved without a finger');
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'no page errors');
  await ctx.close(); await b.close();
})();
