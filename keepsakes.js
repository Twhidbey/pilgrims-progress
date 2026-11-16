// ============================================================
// KEEPSAKES AND THE PAUSE MENU (build 176; owner: "is there a way to get pause and get menu that allows us to navigate
// away and to the different levels ... if items in upper right corner could be clickable and you can see them up close.
// a) the one can be an open bible to a favorite passage (maybe romans 3 in old KJV with sin passages underlined in
// fountain pen (by christian of course)) and you can flip left and right a couple pages. b) the scroll can just be a
// piece of paper with a cool seal and the words from flee from the wrath to come written out in cool text").
//
// Loaded by index.html after the levels. Everything is inside KS. The hooks in index.html: loop() skips the world while
// KS.paused; the stage's pointerdown sends a touch on the tray's book or roll to KS.book() / KS.roll().
//  - The pause button (two bars, beside the sound button) opens a quiet menu: go on, or begin any level. Escape too.
//  - His book opens as a Bible at Romans 3 (King James text, 1769 spelling): two spreads, turned by the arrows, a swipe,
//    a tap on either page, or the arrow keys. The sin passages are underlined in iron-gall ink, as if by Christian, and in
//    the margin his own cry from the book ({10}: "What shall I do?").
//  - The roll is a sheet of parchment that unrolls: "Flee from the wrath to come." ({14}, with Bunyan's own margin
//    reference, Matt. 3.7) in blackletter, the first letter in red, and a red wax seal with the King's crown.
// While any of these is open the world stands still and the sound is lowered.
// ============================================================
const KS = (() => {
  const INK = '#2b1d12';
  const pen = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='97' height='8'><path d='M0 4.1 C11 3.3 22 5 34 4.3 S58 3.2 70 4.4 S88 4.6 97 4.1' fill='none' stroke='${INK}' stroke-width='1.35' stroke-linecap='round' opacity='.82'/></svg>`);
  const style = document.createElement('style');
  style.textContent = `
#pause{position:absolute;right:calc(1% + 2.6em);top:1.5%;width:2.2em;height:2.2em;border-radius:50%;border:none;background:rgba(20,22,30,.22);color:rgba(244,236,220,.8);font-size:clamp(14px,2vw,19px);cursor:pointer;display:none;padding:0}
#pause i{display:inline-block;width:.16em;height:.72em;background:currentColor;margin:0 .09em;border-radius:1px;vertical-align:middle}
body.playing #pause{display:block}
.kscover{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;background:rgba(12,12,18,.78);touch-action:none;-webkit-user-select:none;user-select:none}
.kscover.on{display:flex;animation:ksfade .45s ease both}
@keyframes ksfade{from{opacity:0}to{opacity:1}}
.ksx{position:absolute;right:max(14px,env(safe-area-inset-right));top:max(10px,env(safe-area-inset-top));width:2.3em;height:2.3em;border-radius:50%;border:1px solid rgba(244,236,220,.45);background:rgba(20,22,30,.4);color:#f4ecdc;font:20px Georgia,serif;cursor:pointer;line-height:1}
/* the menu */
#ksmenu .kscard{display:flex;flex-direction:column;align-items:center;font-family:Georgia,'Times New Roman',serif;color:#f4ecdc;text-shadow:0 1px 10px rgba(8,10,16,.75);text-align:center}
#ksmenu h1{font-weight:400;font-style:italic;font-size:clamp(26px,5.4vh,44px);margin:0 0 .3em}
#ksmenu p{margin:1.1em 0 .1em;font-size:clamp(12px,2.6vh,17px);letter-spacing:.14em;text-transform:uppercase;color:rgba(244,236,220,.7)}
#ksmenu .btn{font-size:clamp(14px,3.3vh,21px);min-width:13.5em;margin-top:.5em}
#ksmenu .btn i{font-style:normal;opacity:.6;margin-right:.5em}
#ksmenu .btn.here{border-color:#e8c27c}
#ksmenu .btn.here::after{content:' (here)';opacity:.6}
/* the Bible */
#ksbook .bible{position:relative;--W:min(92vw,calc(84vh * 1.52));width:var(--W);height:calc(var(--W) / 1.52);padding:calc(var(--W) * .012);box-sizing:border-box;border-radius:calc(var(--W) * .012);
  background:radial-gradient(ellipse at 30% 20%,#5a3524,#2c170e 75%);box-shadow:0 20px 60px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,220,170,.08);perspective:calc(var(--W) * 2.4)}
#ksbook .spread{position:relative;width:100%;height:100%}
#ksbook .page,#ksbook .face{position:absolute;top:0;bottom:0;width:50%;box-sizing:border-box;overflow:hidden;font-family:'IM Fell English',Georgia,'Times New Roman',serif;color:${INK};
  font-size:var(--bf,12px);line-height:1.28;background-color:#eadcbc}
#ksbook .L{left:0;border-radius:3px 0 0 3px;background-image:linear-gradient(to right,rgba(90,60,25,.12),rgba(90,60,25,0) 8%,rgba(90,60,25,0) 86%,rgba(70,45,15,.28)),radial-gradient(ellipse at 40% 45%,rgba(255,250,235,.5),rgba(150,110,60,.18))}
#ksbook .R{right:0;border-radius:0 3px 3px 0;background-image:linear-gradient(to left,rgba(90,60,25,.12),rgba(90,60,25,0) 8%,rgba(90,60,25,0) 86%,rgba(70,45,15,.28)),radial-gradient(ellipse at 60% 45%,rgba(255,250,235,.5),rgba(150,110,60,.18))}
#ksbook .in{position:absolute;inset:6% 8% 6.5% 8%;display:flex;flex-direction:column}
#ksbook .L .in{left:16%;right:9%}
#ksbook .R .in{left:9%;right:16%}
#ksbook .head{display:flex;justify-content:space-between;font-style:italic;font-size:.92em;border-bottom:1px solid rgba(43,29,18,.55);padding-bottom:.15em;margin-bottom:.55em}
#ksbook .foot{margin-top:auto;text-align:center;font-size:.85em;opacity:.75;padding-top:.3em}
#ksbook .chap{text-align:center;font-family:'IM Fell English SC','IM Fell English',Georgia,serif;letter-spacing:.12em;font-size:1.12em;margin:.1em 0 .45em}
#ksbook .v{margin:0 0 .18em;text-align:justify;position:relative;-webkit-hyphens:auto;hyphens:auto}
#ksbook .v b{font-weight:400;font-size:.72em;margin-right:.3em;position:relative;top:-.12em}
#ksbook .drop{float:left;font-size:3.05em;line-height:.82;margin:.06em .08em 0 0;color:#7c1b12;font-family:'IM Fell English',Georgia,serif}
#ksbook u{text-decoration:none;background:url("data:image/svg+xml,${pen}") repeat-x 0 100%;background-size:auto .5em;padding-bottom:.12em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
#ksbook .note{position:absolute;top:-.35em;width:3.7em;font-family:'La Belle Aurore','Bradley Hand',cursive;font-size:.98em;line-height:1.05;color:${INK};opacity:.88;text-align:center;transform:rotate(-7deg);pointer-events:none}
#ksbook .R .note{left:100%;margin-left:.45em}
#ksbook .L .note{right:100%;margin-right:.6em}
#ksbook .bar{position:absolute;top:.15em;bottom:.1em;width:.12em;border-radius:.1em;background:${INK};opacity:.75}
#ksbook .L .bar{left:-.7em}
#ksbook .R .bar{right:-.7em}
#ksbook .spine{position:absolute;left:50%;top:0;bottom:0;width:4%;margin-left:-2%;background:linear-gradient(to right,rgba(60,35,10,0),rgba(60,35,10,.32) 45%,rgba(20,10,0,.45) 50%,rgba(60,35,10,.32) 55%,rgba(60,35,10,0));pointer-events:none;z-index:3}
#ksbook .ribbon{position:absolute;left:51.2%;top:-1.5%;width:1.3%;height:103.5%;background:linear-gradient(to right,#5d0f0b,#9b2318 50%,#5d0f0b);z-index:4;clip-path:polygon(0 0,100% 0,100% 100%,50% 98.6%,0 100%);opacity:.94;pointer-events:none}
#ksbook .leaf{position:absolute;top:0;bottom:0;width:50%;transform-style:preserve-3d;z-index:5;display:none}
#ksbook .leaf.on{display:block}
#ksbook .leaf .face{width:100%;-webkit-backface-visibility:hidden;backface-visibility:hidden}
#ksbook .leaf .face.back{transform:rotateY(180deg)}
#ksbook .leaf .shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to right,rgba(40,20,0,.0),rgba(40,20,0,.25));opacity:0}
.ksarrow{position:absolute;top:50%;transform:translateY(-50%);width:2.2em;height:3.4em;border:none;background:none;color:rgba(244,236,220,.75);font:34px Georgia,serif;cursor:pointer;padding:0}
.ksarrow:disabled{opacity:.15}
.ksarrow.l{left:max(2px,env(safe-area-inset-left))}
.ksarrow.r{right:max(2px,env(safe-area-inset-right))}
/* the roll */
#ksroll .sheetw{position:relative;--H:min(84vh,calc(88vw * 1.25));height:var(--H);width:calc(var(--H) * .62);display:flex;flex-direction:column;align-items:stretch}
#ksroll .rod{height:calc(var(--H) * .055);margin:0 -5%;border-radius:999px;background:linear-gradient(#b89a6a,#efe0bd 35%,#c9ad7c 60%,#7d6340);box-shadow:0 4px 10px rgba(0,0,0,.35);position:relative;z-index:2}
#ksroll .body{flex:1;overflow:hidden;position:relative;margin:-1% 0;background:#ecdfbf;background-image:radial-gradient(ellipse at 50% 40%,rgba(255,251,238,.7),rgba(160,120,60,.22) 85%),linear-gradient(to right,rgba(120,85,40,.25),rgba(120,85,40,0) 8%,rgba(120,85,40,0) 92%,rgba(120,85,40,.25));animation:ksunroll 1.3s cubic-bezier(.3,.7,.3,1) both}
@keyframes ksunroll{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}
#ksroll .words{position:absolute;left:10%;right:10%;top:16%;text-align:center;font-family:'UnifrakturMaguntia','Old English Text MT',Georgia,serif;color:#24170e;font-size:calc(var(--H) * .074);line-height:1.32}
#ksroll .words .cap{color:#86190f;font-size:1.7em;line-height:.8;vertical-align:-.12em;margin-right:.03em}
#ksroll .ref{position:absolute;left:0;right:0;top:58%;text-align:center;font-family:'IM Fell English',Georgia,serif;font-style:italic;color:#4a3524;font-size:calc(var(--H) * .03)}
#ksroll .seal{position:absolute;left:50%;bottom:6%;width:34%;transform:translateX(-50%) rotate(-8deg);filter:drop-shadow(0 3px 3px rgba(60,10,5,.4))}
`;
  document.head.appendChild(style);

  // ---------- the words of the book: Romans 3 and the start of 4, King James Version (public domain) ----------
  // a verse: [number, text]; <u>..</u> = underlined by Christian; note / bar = his marks in the margin
  const V = (n, t, mark = '') => `<p class="v">${mark}<b>${n}</b>${t}</p>`;
  const SPREADS = [
    [{ head: ['ROMANS.', 'Chap. iii.'], foot: 312, body: `<div class="chap">CHAP. III.</div>` +
        `<p class="v"><span class="drop">W</span>HAT advantage then hath the Jew? or what profit is there of circumcision?</p>` +
        V(2, 'Much every way: chiefly, because that unto them were committed the oracles of God.') +
        V(3, 'For what if some did not believe? shall their unbelief make the faith of God without effect?') +
        V(4, 'God forbid: yea, let God be true, but every man a liar; as it is written, That thou mightest be justified in thy sayings, and mightest overcome when thou art judged.') +
        V(5, 'But if our unrighteousness commend the righteousness of God, what shall we say? Is God unrighteous who taketh vengeance? (I speak as a man)') +
        V(6, 'God forbid: for then how shall God judge the world?') +
        V(7, 'For if the truth of God hath more abounded through my lie unto his glory; why yet am I also judged as a sinner?') +
        V(8, 'And not rather, (as we be slandered, and as some affirm that we say,) Let us do evil, that good may come? whose damnation is just.') },
     { head: ['Chap. iii.', 'ROMANS.'], foot: 313, body:
        V(9, 'What then? are we better than they? No, in no wise: for we have before proved both Jews and Gentiles, that <u>they are all under sin</u>;') +
        V(10, 'As it is written, <u>There is none righteous, no, not one</u>:', '<span class="note">What shall I do?</span>') +
        V(11, 'There is none that understandeth, there is none that seeketh after God.') +
        V(12, '<u>They are all gone out of the way</u>, they are together become unprofitable; <u>there is none that doeth good, no, not one</u>.') +
        V(13, 'Their throat is an open sepulchre; with their tongues they have used deceit; the poison of asps is under their lips:') +
        V(14, 'Whose mouth is full of cursing and bitterness:') +
        V(15, 'Their feet are swift to shed blood:') +
        V(16, 'Destruction and misery are in their ways:') +
        V(17, 'And the way of peace have they not known:') +
        V(18, 'There is no fear of God before their eyes.') }],
    [{ head: ['ROMANS.', 'Chap. iii.'], foot: 314, body:
        V(19, 'Now we know that what things soever the law saith, it saith to them who are under the law: that every mouth may be stopped, and <u>all the world may become guilty before God</u>.') +
        V(20, 'Therefore by the deeds of the law there shall no flesh be justified in his sight: for <u>by the law is the knowledge of sin</u>.') +
        V(21, 'But now the righteousness of God without the law is manifested, being witnessed by the law and the prophets;') +
        V(22, 'Even the righteousness of God which is by faith of Jesus Christ unto all and upon all them that believe: for there is no difference:') +
        V(23, '<u>For all have sinned, and come short of the glory of God</u>;', '<span class="bar"></span><span class="note">and I.</span>') +
        V(24, 'Being justified freely by his grace through the redemption that is in Christ Jesus:') +
        V(25, 'Whom God hath set forth to be a propitiation through faith in his blood, to declare his righteousness for the remission of sins that are past, through the forbearance of God;') +
        V(26, 'To declare, I say, at this time his righteousness: that he might be just, and the justifier of him which believeth in Jesus.') },
     { head: ['Chap. iii. iv.', 'ROMANS.'], foot: 315, body:
        V(27, 'Where is boasting then? It is excluded. By what law? of works? Nay: but by the law of faith.') +
        V(28, 'Therefore we conclude that a man is justified by faith without the deeds of the law.') +
        V(29, 'Is he the God of the Jews only? is he not also of the Gentiles? Yes, of the Gentiles also:') +
        V(30, 'Seeing it is one God, which shall justify the circumcision by faith, and uncircumcision through faith.') +
        V(31, 'Do we then make void the law through faith? God forbid: yea, we establish the law.') +
        `<div class="chap" style="margin-top:.6em">CHAP. IV.</div>` +
        `<p class="v"><span class="drop">W</span>HAT shall we say then that Abraham our father, as pertaining to the flesh, hath found?</p>` +
        V(2, 'For if Abraham were justified by works, he hath whereof to glory; but not before God.') +
        V(3, 'For what saith the scripture? Abraham believed God, and it was counted unto him for righteousness.') }]];
  const pageHTML = p => `<div class="in"><div class="head"><span>${p.head[0]}</span><span>${p.head[1]}</span></div><div class="txt">${p.body}</div><div class="foot">${p.foot}</div></div>`;

  // ---------- the overlays ----------
  const mkEl = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };
  const pauseBtn = mkEl(`<button id="pause" aria-label="Pause"><i></i><i></i></button>`);
  document.getElementById('stage').appendChild(pauseBtn);
  const NAMES = ['The City of Destruction', 'The Slough of Despond', 'Mr. Worldly Wiseman'];
  const menu = mkEl(`<div id="ksmenu" class="kscover"><div class="kscard"><h1>Resting a while</h1><button class="btn" data-go="on">Go on</button>
    <p>or begin again at</p>${NAMES.map((n, i) => `<button class="btn" data-go="${i + 1}"><i>${i + 1}</i>${n}</button>`).join('')}</div></div>`);
  const book = mkEl(`<div id="ksbook" class="kscover"><div class="bible"><div class="spread"><div class="page L"></div><div class="page R"></div>
    <div class="leaf"><div class="face front"></div><div class="face back"></div></div><div class="spine"></div><div class="ribbon"></div></div></div>
    <button class="ksarrow l" aria-label="Turn back">‹</button><button class="ksarrow r" aria-label="Turn on">›</button><button class="ksx" aria-label="Close">×</button></div>`);
  const SEAL = `<svg class="seal" viewBox="0 0 120 150"><path d="M44 96 L30 148 L42 138 L50 149 L58 100 Z M76 96 L92 147 L80 139 L71 149 L62 100 Z" fill="#7a1810"/>
    <path d="M60 6 C74 5 84 10 93 17 C103 25 112 35 113 50 C115 64 110 78 102 88 C93 99 80 108 63 109 C47 110 33 104 23 94 C12 84 6 70 7 55 C8 40 15 27 26 18 C36 10 47 6 60 6 Z" fill="#9b2016"/>
    <circle cx="60" cy="57" r="35" fill="#8a1a12"/><circle cx="60" cy="57" r="35" fill="none" stroke="#5c0e09" stroke-width="2.4"/><circle cx="60" cy="57" r="29" fill="none" stroke="#c4473a" stroke-width="1" opacity=".5"/>
    <path d="M38 70 L36 46 L46 56 L52 40 L60 52 L68 40 L74 56 L84 46 L82 70 Z" fill="#6a110b"/><path d="M38 70 L36 46 L46 56 L52 40 L60 52 L68 40 L74 56 L84 46 L82 70" fill="none" stroke="#c9493b" stroke-width="1.1" opacity=".55"/>
    <rect x="37" y="72" width="46" height="6" rx="1.5" fill="#6a110b"/><circle cx="36" cy="44" r="3" fill="#6a110b"/><circle cx="52" cy="38" r="3" fill="#6a110b"/><circle cx="68" cy="38" r="3" fill="#6a110b"/><circle cx="84" cy="44" r="3" fill="#6a110b"/>
    <ellipse cx="44" cy="30" rx="12" ry="5" fill="#fff" opacity=".13" transform="rotate(-25 44 30)"/></svg>`;
  const roll = mkEl(`<div id="ksroll" class="kscover"><div class="sheetw"><div class="rod"></div><div class="body">
    <div class="words"><span class="cap">F</span>lee from the wrath to come.</div><div class="ref">Matt. iii. 7.</div>${SEAL}</div><div class="rod"></div></div>
    <button class="ksx" aria-label="Close">×</button></div>`);
  for (const e of [menu, book, roll]) document.body.appendChild(e);

  // ---------- pausing ----------
  let open = null;
  const vol = v => { if (typeof AC !== 'undefined' && AC && MASTER) MASTER.gain.setTargetAtTime(muted ? 0 : v, AC.currentTime, .15); };
  function show(el, v) {
    if (open) hide(true);
    open = el; KS.paused = true; el.classList.add('on'); vol(v);
    downs.clear(); keys.r = keys.push = false;
  }
  function hide(quick) {
    if (!open) return; open.classList.remove('on'); open = null; KS.paused = false; vol(1);
    downs.clear(); keys.r = keys.push = false; if (!quick) G.calm = Math.max(G.calm || 0, G.t + 10);
  }
  const rustle = (k = 1) => { if (typeof audio === 'function' && audio()) { hiss(2600, .7, .03 * k, .35); hiss(900, .9, .02 * k, .3, 'bandpass', .06); } };

  // the menu
  const curLv = () => HL.on ? 3 : SL.on ? 2 : 1;
  function openMenu() {
    if (G.state === 'title') return;
    for (const b of menu.querySelectorAll('[data-go]')) b.classList.toggle('here', b.dataset.go === String(curLv()));
    show(menu, .15);
  }
  pauseBtn.onclick = e => { e.stopPropagation(); openMenu(); };
  pauseBtn.addEventListener('pointerdown', e => e.stopPropagation());
  menu.addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (!b && e.target !== menu) return;
    const go = b ? b.dataset.go : 'on'; hide();
    if (go === 'on') return;
    // leave whatever was going on cleanly, then begin the chosen level from its start
    hush(); dlg.className = ''; choiceEl.className = ''; document.body.classList.remove('talking', 'capped', 'slough');
    G.capQ.length = 0; G.cap = 0; G.hint = null; G.act = null; G.ring = null; G.state = 'wait';
    document.getElementById('endc').className = 'card';
    if (go === '3') go3(); else if (go === '2') go2(); else start();
  });

  // the Bible
  const L = book.querySelector('.page.L'), R = book.querySelector('.page.R'), leaf = book.querySelector('.leaf'), front = leaf.querySelector('.front'), back = leaf.querySelector('.back');
  const bL = book.querySelector('.ksarrow.l'), bR = book.querySelector('.ksarrow.r');
  let sp = 0, turning = false, fitted = 0;
  function render() { L.innerHTML = pageHTML(SPREADS[sp][0]); R.innerHTML = pageHTML(SPREADS[sp][1]); bL.disabled = sp === 0; bR.disabled = sp === SPREADS.length - 1; }
  // one type size for every page: the largest at which the longest page fits
  function fit() {
    const bib = book.querySelector('.bible'), h0 = bib.clientHeight; if (!h0) return;
    let f = h0 * .036; const save = [L.innerHTML, R.innerHTML];
    const fits = () => { for (const s of SPREADS) for (const [el, p] of [[L, s[0]], [R, s[1]]]) { el.innerHTML = pageHTML(p); const t = el.querySelector('.txt'), inn = el.querySelector('.in'), hd = el.querySelector('.head'), ft = el.querySelector('.foot');
      if (t.scrollHeight + hd.offsetHeight + ft.offsetHeight + f * 1.2 > inn.clientHeight) return false; } return true; };
    for (; f > 7; f -= .25) { bib.style.setProperty('--bf', f + 'px'); if (fits()) break; }
    L.innerHTML = save[0]; R.innerHTML = save[1]; fitted = h0;
  }
  function openBook() { show(book, .45); render(); fit(); rustle(1.2); }
  function turn(d) {
    const to = sp + d; if (turning || to < 0 || to >= SPREADS.length) return;
    turning = true; rustle();
    const cur = SPREADS[sp], nx = SPREADS[to], fwd = d > 0;
    // the leaf lies over the page that turns; beneath it, the page that will be uncovered
    leaf.style.left = fwd ? '50%' : '0'; leaf.style.transformOrigin = fwd ? '0 50%' : '100% 50%';
    front.className = 'face front ' + (fwd ? 'R' : 'L'); back.className = 'face back ' + (fwd ? 'L' : 'R');
    front.innerHTML = pageHTML(fwd ? cur[1] : cur[0]); back.innerHTML = pageHTML(fwd ? nx[0] : nx[1]);
    (fwd ? R : L).innerHTML = pageHTML(fwd ? nx[1] : nx[0]);
    leaf.style.transition = 'none'; leaf.style.transform = 'rotateY(0deg)'; leaf.classList.add('on'); void leaf.offsetWidth;
    leaf.style.transition = 'transform .85s cubic-bezier(.45,.05,.3,1)'; leaf.style.transform = `rotateY(${fwd ? -180 : 180}deg)`;
    setTimeout(() => { sp = to; render(); leaf.classList.remove('on'); turning = false; }, 880);
  }
  bL.onclick = () => turn(-1); bR.onclick = () => turn(1);
  let sx0 = null;
  book.addEventListener('pointerdown', e => { sx0 = e.target.closest('button') ? null : [e.clientX, e.clientY, e.target === book]; });
  book.addEventListener('pointerup', e => {
    if (!sx0) return; const dx = e.clientX - sx0[0], dy = e.clientY - sx0[1], wasBack = sx0[2]; sx0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { turn(dx < 0 ? 1 : -1); return; }
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) { if (wasBack) { hide(); return; } const r = book.querySelector('.bible').getBoundingClientRect(); turn(e.clientX > r.left + r.width / 2 ? 1 : -1); }
  });
  book.querySelector('.ksx').onclick = () => hide();

  // the roll: unrolls each time it is opened
  function openRoll() { const b = roll.querySelector('.body'); b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; show(roll, .45); rustle(1.4); }
  roll.addEventListener('click', e => { if (e.target === roll || e.target.closest('.ksx')) hide(); });

  // keys: Escape pauses or closes; the arrows turn the pages; nothing reaches the game while something is open
  document.addEventListener('keydown', e => {
    if (!open) { if (e.code === 'Escape' && document.body.classList.contains('playing')) { openMenu(); e.preventDefault(); e.stopPropagation(); } return; }
    if (e.code === 'Escape') hide();
    else if (open === book && (e.code === 'ArrowRight' || e.code === 'ArrowLeft')) turn(e.code === 'ArrowRight' ? 1 : -1);
    else if (open === menu && e.code === 'Enter') hide();
    e.preventDefault(); e.stopPropagation();
  }, true);
  document.addEventListener('keyup', e => { if (open) { e.stopPropagation(); } }, true);
  addEventListener('resize', () => { if (open === book) fit(); });
  if (document.fonts) document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', () => { if (open === book) fit(); });
  // fetch the fonts early, so the book and the roll look right the first time
  setTimeout(() => { if (document.fonts && document.fonts.load) for (const f of ['16px "IM Fell English"', 'italic 16px "IM Fell English"', '16px "IM Fell English SC"', '16px "UnifrakturMaguntia"', '16px "La Belle Aurore"']) document.fonts.load(f).catch(() => {}); }, 2500);

  return { paused: false, book: openBook, roll: openRoll, menu: openMenu, close: () => hide(), turn, get page() { return sp; } };
})();
