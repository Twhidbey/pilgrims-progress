// THE EDITOR'S SKIP BUTTONS (owner, build 184: "need a skip ahead button (access game via link for editor that's slightly
// different) that allows me to jump back and forward (maybe on each side of screen) - i would like this to preview quickly").
// Only with ?edit in the address. Two arrows on the picture's left and right edges (or the [ and ] keys):
//   ▸ fast-forwards the game, silently, to the next story moment (a new line of words, a choice, or the end card),
//     holding to walk, passing lines, doing every act and picking the way on at a choice, as the play-through test does;
//   ◂ begins the level again and fast-forwards to the moment before.
// The game itself is not changed: without ?edit this file does nothing.
const ED = (() => {
  // EDITOR MODE REMEMBERED ON THE DEVICE (build 196; owner, on the iPhone: the Home Screen icon "somehow arrow keys
  // disappear" because the icon opened the game without ?edit). Five quick taps on the bottom-right corner of the book
  // cover (where the build number is) turn editor mode on or off; it is kept on the device (each Home Screen icon has its
  // own store), so the icon then always opens with the arrows. ?edit turns it on as before; ?edit=0 turns it off.
  const Q = new URLSearchParams(location.search), mem = { get() { try { return localStorage.getItem('pp-edit') === '1'; } catch (e) { return false; } }, set(v) { try { v ? localStorage.setItem('pp-edit', '1') : localStorage.removeItem('pp-edit'); } catch (e) {} } };
  if (Q.has('edit')) mem.set(Q.get('edit') !== '0');
  { let taps = [];
    document.getElementById('stage').addEventListener('pointerdown', e => {
      if (typeof G === 'undefined' || G.state !== 'title') return;
      const r = document.getElementById('stage').getBoundingClientRect();
      if (e.clientX < r.right - r.width * .3 || e.clientY < r.bottom - r.height * .2) { taps = []; return; }
      const now = Date.now(); taps = taps.filter(t => now - t < 3000); taps.push(now);
      if (taps.length >= 5) { taps = []; const on = !mem.get(); mem.set(on); const u = new URL(location.href); u.searchParams.delete('edit'); if (on) u.searchParams.set('edit', ''); location.replace(u.pathname + (u.search ? u.search.replace('edit=&', 'edit&').replace(/edit=$/, 'edit') : '')); }
    }, true); }
  if (!(Q.has('edit') ? Q.get('edit') !== '0' : mem.get())) return { on: false };
  const st = document.createElement('style');
  st.textContent = `.edarrow{position:absolute;top:50%;width:clamp(36px,5.2vw,52px);height:clamp(36px,5.2vw,52px);margin-top:calc(clamp(36px,5.2vw,52px) / -2);border-radius:50%;border:1.5px solid rgba(232,194,124,.85);background:rgba(14,15,22,.62);color:#f0d9a8;font-size:clamp(16px,2.6vw,24px);line-height:1;cursor:pointer;z-index:30;display:none;box-shadow:0 0 10px rgba(0,0,0,.45);-webkit-tap-highlight-color:transparent}
.edarrow.r{right:1.2%}.edarrow.l{left:1.2%}
.edarrow:active{background:rgba(232,194,124,.35)}body.edit-on .edarrow{display:block}
#edtag{position:absolute;left:50%;top:1%;transform:translateX(-50%);font:12px Georgia,serif;color:#f0d9a8;background:rgba(14,15,22,.55);padding:1px 8px;border-radius:8px;z-index:30;pointer-events:none;display:block}body.edit-on #edtag{display:block}`;
  document.head.appendChild(st);
  const stage = document.getElementById('stage'), mkB = (cls, txt) => { const b = document.createElement('button'); b.className = 'edarrow ' + cls; b.textContent = txt; stage.appendChild(b); return b; };
  const bl = mkB('l', '◂'), br = mkB('r', '▸'), tag = document.createElement('div'); tag.id = 'edtag'; stage.appendChild(tag);
  let n = 0, busy = false;
  const lvl = () => RM.on ? 4 : HL.on ? 3 : SL.on ? 2 : 1;
  const text = () => { const d = document.getElementById('dlg'); return d.classList.contains('on') && !d.classList.contains('hint') ? d.querySelector('.t').textContent : ''; };
  const quiet = on => { try { if (typeof AC !== 'undefined' && AC && MASTER) { MASTER.gain.cancelScheduledValues(AC.currentTime); MASTER.gain.setTargetAtTime(on ? 0 : 1, AC.currentTime, on ? .005 : .25); } } catch (e) {} };
  const label = () => { tag.textContent = G.state === 'title' ? 'editor on · tap build no. 5× to turn off' : 'editor · level ' + lvl() + ' · moment ' + n; };
  // one moment on: step the world until something new is said, a choice comes, or the level ends
  function step() {
    if (G.state === 'choice') pick(false);
    const t0 = text();
    for (let i = 0; i < 30000; i++) {
      if (G.state === 'end' || G.state === 'choice') return true;
      keys.r = G.state === 'play';
      if (G.state === 'dialog') {
        if (G.act === 'gate' || G.act === 'walkon' || (RM.on && RM.HOLDS.includes(G.act))) keys.push = true;
        else if (G.act === 'hand') SL.grip();
        else if (G.act === 'light') lightTouched();
        else if (RM.on && G.act) RM.key();
        else if (HL.on && G.act) HL.key();
        else if (!G.act) next(true);
      }
      update();
      const t = text(); if (t && t !== t0) return true;
    }
    return false;
  }
  function settle() { keys.r = keys.push = false; downs.clear(); G.calm = G.t; G.guard = 0; dlg.classList.remove('wait'); label(); }
  function fwd(k = 1) {
    if (busy || G.state === 'title' || KS.paused) return; busy = true; quiet(true);
    for (let j = 0; j < k && G.state !== 'end'; j++) { if (!step()) break; n++; }
    settle(); setTimeout(() => quiet(false), 60); busy = false;
  }
  // back: begin the level again (as the pause menu does) and come forward to the moment before
  function back() {
    if (busy || G.state === 'title' || KS.paused) return; busy = true; quiet(true);
    const want = Math.max(0, n - 1), lv = lvl();
    hush(); dlg.className = ''; choiceEl.className = ''; document.body.classList.remove('talking', 'capped', 'slough');
    G.capQ.length = 0; G.cap = 0; G.hint = null; G.act = null; G.ring = null; G.state = 'wait';
    document.getElementById('endc').className = 'card';
    if (lv === 4) goRoom('door'); else if (lv === 3) go3(); else if (lv === 2) go2(); else start();
    n = 0;
    // a level begins after a short pause of its own ('wait'): come forward once it is under way
    const t0 = Date.now(), poll = setInterval(() => {
      if ((G.state === 'wait' || G.state === 'title') && Date.now() - t0 < 10000) return;
      clearInterval(poll); busy = false; seen = lvl(); if (want) fwd(want); else { settle(); quiet(false); }
    }, 50);
  }
  for (const [b, f] of [[bl, back], [br, () => fwd()]]) { b.addEventListener('pointerdown', e => e.stopPropagation()); b.onclick = e => { e.stopPropagation(); f(); }; }
  addEventListener('keydown', e => { if (e.key === ']') fwd(); if (e.key === '[') back(); });
  // the arrows show once a level has begun; a new level (from an end card or the menu) counts from 0 again
  let seen = 'title';
  setInterval(() => { const on = G.state !== 'title'; document.body.classList.toggle('edit-on', on); if (!on) label(); const k = on ? lvl() : 0; if (k !== seen && !busy) { seen = k; n = 0; label(); } }, 300);
  return { on: true, fwd, back, get n() { return n; } };
})();
