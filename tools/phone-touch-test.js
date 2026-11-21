// A phone test: an emulated iPhone, real touch input. Checks that holding a finger walks him in Level 2 even with a stale G.calm,
// and that every line is asked for at one size. Run: python3 -m http.server 8123 &  then  node tools/phone-touch-test.js
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ...devices['iPhone 13 landscape'] }); const pg = await ctx.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('http://localhost:8123/?level=2');
  await pg.waitForSelector('body.bookready'); await pg.waitForTimeout(600);
  await pg.tap('.tcover'); await pg.waitForTimeout(3300);
  await pg.evaluate(() => { G.calm = 99999; });      // as if Level 1 had just been played
  await pg.tap('.lv[data-lv="2"]'); await pg.waitForTimeout(4500);
  const x0 = await pg.evaluate(() => SL.peek().x);
  const cdp = await ctx.newCDPSession(pg);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 300, y: 150 }] });
  await pg.waitForTimeout(3000);
  const x1 = await pg.evaluate(() => SL.peek().x);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  console.log('with a stale clock: moved', Math.round(x1 - x0), 'units');
  // text sizes: a storyteller line and a character's line
  const sizes = await pg.evaluate(() => { const out = []; for (const [w, t] of [['', 'Then Christian and Pliable went talking over the plain.'], ['Pliable', 'Is this the happiness you have told me of? If I get out again with my life, you shall have the brave country alone for me!'], ['Christian', 'Truly, I do not know.']]) { words(w, t, 'cap'); const box = document.querySelector('#dlg .txt'); out.push([w || 'storyteller', box.style.fontSize, getComputedStyle(box.querySelector('.t')).fontSize, getComputedStyle(box.querySelector('.who')).fontSize]); } return out; });
  console.log(JSON.stringify(sizes), errs.slice(0, 2));
  // and the measuring: pretend the browser enlarges this block by 30%
  const fix = await pg.evaluate(() => { const st = document.createElement('style'); st.textContent = '#dlg .txt .t, #dlg .txt .who{font-size:130%}'; document.head.appendChild(st); words('Christian', 'Truly, I do not know.', 'cap'); const box = document.querySelector('#dlg .txt'); const r = [box.style.fontSize, Math.round(box.querySelector('.t').getClientRects()[0].height * 10) / 10]; st.remove(); words('Christian', 'Truly, I do not know.', 'cap'); return [r, Math.round(box.querySelector('.t').getClientRects()[0].height * 10) / 10]; });
  console.log('asked size when the block is enlarged 30%:', fix);
  await ctx.close(); await b.close();
})();
