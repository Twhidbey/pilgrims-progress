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
      // upright, the title fills the screen and the build number sits at the screen's foot (build 422)
      const r = document.body.classList.contains('portrait') ? { right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight } : document.getElementById('stage').getBoundingClientRect();
      if (e.clientX < r.right - r.width * .3 || e.clientY < r.bottom - r.height * .2) { taps = []; return; }
      const now = Date.now(); taps = taps.filter(t => now - t < 3000); taps.push(now);
      if (taps.length >= 5) { taps = []; const on = !mem.get(); mem.set(on); const u = new URL(location.href); u.searchParams.delete('edit'); if (on) u.searchParams.set('edit', ''); location.replace(u.pathname + (u.search ? u.search.replace('edit=&', 'edit&').replace(/edit=$/, 'edit') : '')); }
    }, true); }
  if (!(Q.has('edit') ? Q.get('edit') !== '0' : mem.get())) return { on: false };
  const st = document.createElement('style');
  st.textContent = `.edarrow{position:absolute;top:50%;width:clamp(36px,5.2vw,52px);height:clamp(36px,5.2vw,52px);margin-top:calc(clamp(36px,5.2vw,52px) / -2);border-radius:50%;border:1.5px solid rgba(232,194,124,.85);background:rgba(14,15,22,.62);color:#f0d9a8;font-size:clamp(16px,2.6vw,24px);line-height:1;cursor:pointer;z-index:30;display:none;box-shadow:0 0 10px rgba(0,0,0,.45);-webkit-tap-highlight-color:transparent}
.edarrow.r{right:1.2%}.edarrow.l{left:1.2%}
.edarrow:active{background:rgba(232,194,124,.35)}
#edjump{position:absolute;left:50%;top:5.5%;transform:translateX(-50%);font:13px Georgia,serif;color:#f0d9a8;background:rgba(14,15,22,.72);border:1.5px solid rgba(232,194,124,.8);padding:4px 12px;border-radius:14px;z-index:31;cursor:pointer;-webkit-tap-highlight-color:transparent}
#edlist{position:fixed;inset:6% 8%;background:rgba(14,12,12,.95);border:1.5px solid rgba(232,194,124,.7);border-radius:12px;z-index:60;overflow:auto;padding:10px 16px 16px;font:15px Georgia,serif;color:#f0d9a8;display:none;-webkit-overflow-scrolling:touch}
#edlist.on{display:block}#edlist h3{font:600 13px Georgia,serif;letter-spacing:.08em;color:#c9a46a;margin:14px 0 4px;text-transform:uppercase}
#edlist button{display:block;width:100%;text-align:left;font:15px Georgia,serif;color:#f0d9a8;background:none;border:0;border-bottom:1px solid rgba(232,194,124,.15);padding:9px 4px;cursor:pointer}
#edlist button:active{background:rgba(232,194,124,.2)}#edlist .x{position:sticky;top:0;float:right;width:auto;border:0;font-size:22px;padding:0 4px}
#edbusy{position:fixed;left:50%;top:45%;transform:translateX(-50%);font:16px Georgia,serif;color:#f0d9a8;background:rgba(14,15,22,.8);padding:6px 14px;border-radius:10px;z-index:61;display:none}
#edtag{position:absolute;left:50%;top:1%;transform:translateX(-50%);font:12px Georgia,serif;color:#f0d9a8;background:rgba(14,15,22,.55);padding:1px 8px;border-radius:8px;z-index:30;pointer-events:none;display:block}body.edit-on #edtag{display:block}`;
  document.head.appendChild(st);
  const stage = document.getElementById('stage'), mkB = (cls, txt) => { const b = document.createElement('button'); b.className = 'edarrow ' + cls; b.textContent = txt; stage.appendChild(b); return b; };
  const bl = mkB('l', '◂'), br = mkB('r', '▸'); bl.style.display = br.style.display = 'none'; const tag = document.createElement('div'); tag.id = 'edtag'; stage.appendChild(tag);
  let n = 0, busy = false;
  const lvl = () => CR.on ? 5 : RM.on ? 4 : HL.on ? 3 : SL.on ? 2 : 1;
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
        else if (CR.on && G.act) CR.key();
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
    if (lv === 5) go5(); else if (lv === 4) goRoom('door'); else if (lv === 3) go3(); else if (lv === 2) go2(); else start();
    n = 0;
    // a level begins after a short pause of its own ('wait'): come forward once it is under way
    const t0 = Date.now(), poll = setInterval(() => {
      if ((G.state === 'wait' || G.state === 'title') && Date.now() - t0 < 10000) return;
      clearInterval(poll); busy = false; seen = lvl(); if (want) fwd(want); else { settle(); quiet(false); }
    }, 50);
  }
  // THE JUMP LIST (build 474, owner: "instead of back and forward arrows maybe in editor mode we can get a short list of links
  // to jump to (key points described)"): one button opens a list of each level's key points; a choice begins that level
  // again and fast-forwards silently (as the play-through test does) until the point is reached. The arrows are gone; the
  // [ and ] keys still step one moment back and on.
  // (build 663) the list of key moments and the jump itself now live in moments.js (MO), shared with the contents page
  const POINTS = MO.POINTS;
  const jb = document.createElement('button'); jb.id = 'edjump'; jb.textContent = '☰ Jump to…'; stage.appendChild(jb);
  const list = document.createElement('div'); list.id = 'edlist'; document.body.appendChild(list);
  const busyEl = document.createElement('div'); busyEl.id = 'edbusy'; busyEl.textContent = 'Jumping…'; document.body.appendChild(busyEl);
  // rooms 6 and 7 are listed only while the darker rooms are switched on (otherwise they cannot be reached)
  const darkOn = () => { try { return localStorage.getItem('pp-dark') === '1'; } catch (e) { return false; } };
  // (build 479, owner: "Only include that levels key moments"): in a level only its own moments are listed; on the book, all
  const render = () => { const cur = G.state === 'title' ? 0 : lvl(); list.innerHTML = '<button class="x">✕</button>' + POINTS.map(([lv, name, ps], i) => cur && lv !== cur ? '' : `<h3>${lv} · ${name}</h3>` + ps.map((p, j) => /^[67] /.test(p[0]) && !darkOn() ? '' : `<button data-i="${i}" data-j="${j}">${p[0].replace(' (darker rooms on)', '')}</button>`).join('')).join(''); };
  list.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; e.stopPropagation(); list.classList.remove('on'); if (b.dataset.i != null) jumpTo(+b.dataset.i, +b.dataset.j); });
  for (const ev of ['pointerdown', 'touchstart']) { list.addEventListener(ev, e => e.stopPropagation()); jb.addEventListener(ev, e => e.stopPropagation()); }
  jb.onclick = e => { e.stopPropagation(); render(); list.classList.toggle('on'); };
  function jumpTo(i, j) { if (busy) return; busy = true; if (!MO.jumpTo(i, j, () => { busy = false; seen = lvl(); n = 0; settle(); label(); })) busy = false; }
  for (const [b, f] of [[bl, back], [br, () => fwd()]]) { b.addEventListener('pointerdown', e => e.stopPropagation()); b.onclick = e => { e.stopPropagation(); f(); }; }
  addEventListener('keydown', e => { if (e.key === ']') fwd(); if (e.key === '[') back(); });
  // the arrows show once a level has begun; a new level (from an end card or the menu) counts from 0 again
  let seen = 'title';
  setInterval(() => { const on = G.state !== 'title'; document.body.classList.toggle('edit-on', on); if (!on) label(); const k = on ? lvl() : 0; if (k !== seen && !busy) { seen = k; n = 0; label(); } }, 300);
  return { on: true, fwd, back, jumpTo, POINTS, get n() { return n; } };
})();
