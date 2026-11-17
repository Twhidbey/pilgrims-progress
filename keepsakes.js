// ============================================================
// KEEPSAKES AND THE PAUSE MENU (build 176; owner: "is there a way to get pause and get menu that allows us to navigate
// away and to the different levels ... if items in upper right corner could be clickable and you can see them up close.
// a) the one can be an open bible to a favorite passage (maybe romans 3 in old KJV with sin passages underlined in
// fountain pen (by christian of course)) and you can flip left and right a couple pages. b) the scroll can just be a
// piece of paper with a cool seal and the words from flee from the wrath to come written out in cool text").
// Build 177 (owner: "the seal should be super cool design and realistic wax. the book should be like what the[y] had in
// time of Pilgrims progress ... same with type set for the scroll ... use a cool texture for paper and scroll can be
// rough a little"): an English Bible as printed in the 1660s and 70s (dealers' descriptions of copies of the time: an
// octavo or duodecimo, the text in two columns of roman type, the whole page ruled in red, bound in brown or black
// calf): two columns with a red rule between, a red ruled frame, the long s, running heads, catchwords and a signature
// mark at the foot, laid paper with chain lines and foxing, a calf binding with blind-tooled lines and red-sprinkled page
// edges. The roll: rough-edged parchment, the words in an engrossing hand (the blackletter used for documents) with a
// flourished red initial, and a wax seal lit like real wax (a height map lit by one light: KS.waxSeal()).
//
// Loaded by index.html after the levels. Everything is inside KS. The hooks in index.html: loop() skips the world while
// KS.paused; the stage's pointerdown sends a touch on the tray's book or roll to KS.book() / KS.roll().
//  - The pause button (two bars, beside the sound button) opens a quiet menu: go on, or begin any level. Escape too.
//  - His book opens as a Bible at Romans 3 (King James text): two spreads, turned by the arrows, a swipe, a tap on
//    either page, or the arrow keys. The sin passages are underlined in iron-gall ink, as if by Christian, and in the
//    margin his own cry from the book ({10}: "What shall I do?").
//  - The roll unrolls: "Flee from the wrath to come." ({14}, with Bunyan's own margin reference, Matt. 3.7).
// While any of these is open the world stands still and the sound is lowered.
// ============================================================
const KS = (() => {
  const INK = '#2b1d12', RED = 'rgba(158,38,26,.62)';
  const pen = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='97' height='8'><path d='M0 4.1 C11 3.3 22 5 34 4.3 S58 3.2 70 4.4 S88 4.6 97 4.1' fill='none' stroke='${INK}' stroke-width='1.35' stroke-linecap='round' opacity='.82'/></svg>`);
  const style = document.createElement('style');
  style.textContent = `
#pause{position:absolute;right:calc(1% + 2.6em);top:1.5%;width:2.2em;height:2.2em;border-radius:50%;border:none;background:rgba(20,22,30,.22);color:rgba(244,236,220,.8);font-size:clamp(14px,2vw,19px);cursor:pointer;display:none;padding:0}
#pause i{display:inline-block;width:.16em;height:.72em;background:currentColor;margin:0 .09em;border-radius:1px;vertical-align:middle}
body.playing #pause{display:block}
.kscover{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 50%,rgba(22,18,14,.72),rgba(8,8,12,.9));touch-action:none;-webkit-user-select:none;user-select:none}
.kscover.on{display:flex;animation:ksfade .45s ease both}
@keyframes ksfade{from{opacity:0}to{opacity:1}}
.ksx{position:absolute;right:max(14px,env(safe-area-inset-right));top:max(10px,env(safe-area-inset-top));width:2.3em;height:2.3em;border-radius:50%;border:1px solid rgba(244,236,220,.45);background:rgba(20,22,30,.4);color:#f4ecdc;font:20px Georgia,serif;cursor:pointer;line-height:1;z-index:9}
/* the menu */
#ksmenu .kscard{display:flex;flex-direction:column;align-items:center;font-family:Georgia,'Times New Roman',serif;color:#f4ecdc;text-shadow:0 1px 10px rgba(8,10,16,.75);text-align:center}
#ksmenu h1{font-weight:400;font-style:italic;font-size:clamp(26px,5.4vh,44px);margin:0 0 .3em}
#ksmenu p{margin:1.1em 0 .1em;font-size:clamp(12px,2.6vh,17px);letter-spacing:.14em;text-transform:uppercase;color:rgba(244,236,220,.7)}
#ksmenu .btn{font-size:clamp(14px,3.3vh,21px);min-width:13.5em;margin-top:.5em}
#ksmenu .btn i{font-style:normal;opacity:.6;margin-right:.5em}
#ksmenu .btn.here{border-color:#e8c27c}
#ksmenu .btn.here::after{content:' (here)';opacity:.6}
/* the Bible: brown calf, blind-tooled, red-sprinkled edges, laid paper */
#ksbook .bible{position:relative;--W:min(93vw,calc(86vh * 1.5));width:var(--W);height:calc(var(--W) / 1.5);padding:calc(var(--W) * .026);box-sizing:border-box;border-radius:calc(var(--W) * .014);
  background-color:#4a2c1c;background-image:var(--calf);background-size:cover;box-shadow:0 22px 60px rgba(0,0,0,.65),inset 0 0 calc(var(--W) * .02) rgba(0,0,0,.55);perspective:calc(var(--W) * 2.4)}
#ksbook .bible::before{content:'';position:absolute;inset:calc(var(--W) * .007);border:1px solid rgba(0,0,0,.42);box-shadow:0 0 0 1px rgba(255,214,160,.07),inset 0 0 0 calc(var(--W) * .003) rgba(255,214,160,.06),inset 0 0 0 calc(var(--W) * .0045) rgba(0,0,0,.35);border-radius:calc(var(--W) * .01);pointer-events:none}
#ksbook .spread{position:relative;width:100%;height:100%}
#ksbook .edges{position:absolute;inset:calc(var(--W) * -.011);border-radius:3px;background:radial-gradient(circle,rgba(150,32,20,.75) 0 .55px,rgba(150,32,20,0) .9px) 0 0/5px 4px,radial-gradient(circle,rgba(120,25,15,.55) 0 .5px,rgba(120,25,15,0) .8px) 2px 2px/7px 6px,repeating-linear-gradient(0deg,#d9c79f 0 1px,#c9b48a 1px 2px);box-shadow:0 1px 2px rgba(0,0,0,.4)}
#ksbook .page,#ksbook .face{position:absolute;top:0;bottom:0;width:50%;box-sizing:border-box;overflow:hidden;font-family:'IM Fell English',Georgia,'Times New Roman',serif;color:${INK};
  font-size:var(--bf,12px);line-height:1.22;background-color:#e7d9b6;background-size:100% 100%,cover;-webkit-font-feature-settings:'liga','dlig';font-feature-settings:'liga','dlig'}
#ksbook .L{left:0;border-radius:3px 0 0 3px;background-image:linear-gradient(to right,rgba(90,60,25,.16),rgba(90,60,25,0) 7%,rgba(90,60,25,0) 84%,rgba(70,45,15,.32)),var(--paper)}
#ksbook .R{right:0;border-radius:0 3px 3px 0;background-image:linear-gradient(to left,rgba(90,60,25,.16),rgba(90,60,25,0) 7%,rgba(90,60,25,0) 84%,rgba(70,45,15,.32)),var(--paperR)}
#ksbook .in{position:absolute;top:6.5%;bottom:5.5%;display:flex;flex-direction:column}
#ksbook .L .in{left:15%;right:8%}
#ksbook .R .in{left:8%;right:15%}
#ksbook .in::before{content:'';position:absolute;inset:-.45em -.55em -.3em;border:1px solid ${RED};outline:1px solid ${RED};outline-offset:2px;pointer-events:none}
#ksbook .head{display:grid;grid-template-columns:1fr auto 1fr;align-items:baseline;font-size:.95em;border-bottom:1px solid ${RED};padding-bottom:.12em;margin-bottom:.4em}
#ksbook .head .c{font-style:italic;text-align:center}
#ksbook .head .r{text-align:right}
#ksbook .txt{flex:1;min-height:0;column-count:2;column-gap:1.25em;column-rule:1px solid ${RED};column-fill:balance}
#ksbook .foot{display:grid;grid-template-columns:1fr auto 1fr;font-size:.9em;padding-top:.2em}
#ksbook .foot .c{text-align:center;letter-spacing:.06em}
#ksbook .foot .r{text-align:right}
#ksbook .chap{text-align:center;font-family:'IM Fell English SC','IM Fell English',Georgia,serif;letter-spacing:.1em;font-size:1.05em;margin:.05em 0 .3em;break-after:avoid}
#ksbook .v{margin:0;text-indent:0;text-align:justify;position:relative;-webkit-hyphens:auto;hyphens:auto}
#ksbook .v b{font-weight:400;font-size:.78em;margin-right:.25em}
#ksbook .drop{float:left;font-size:2.75em;line-height:.8;margin:.05em .07em 0 0;color:#7c1b12;font-family:'IM Fell English',Georgia,serif}
#ksbook u{text-decoration:none;background:url("data:image/svg+xml,${pen}") repeat-x 0 100%;background-size:auto .5em;padding-bottom:.1em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
#ksbook .marg{position:absolute;width:11%;font-family:'Herr Von Muellerhoff','La Belle Aurore',cursive;font-size:1.5em;line-height:.85;color:#3b2412;opacity:.88;text-align:center;transform:rotate(-6deg);pointer-events:none;text-shadow:0 0 .5px rgba(59,36,18,.6)}
#ksbook .bar{position:absolute;width:.13em;border-radius:.1em;background:${INK};opacity:.75;pointer-events:none}
#ksbook .spine{position:absolute;left:50%;top:0;bottom:0;width:5%;margin-left:-2.5%;background:linear-gradient(to right,rgba(60,35,10,0),rgba(60,35,10,.3) 42%,rgba(20,10,0,.5) 50%,rgba(60,35,10,.3) 58%,rgba(60,35,10,0));pointer-events:none;z-index:3}
#ksbook .ribbon{position:absolute;left:51.2%;top:-2.6%;width:1.25%;height:105%;background:linear-gradient(to right,#4d0d09,#8f2016 35%,#a8301f 50%,#7a1a12 70%,#4d0d09);z-index:4;clip-path:polygon(0 0,100% 0,100% 100%,50% 98.6%,0 100%);opacity:.95;pointer-events:none}
#ksbook .leaf{position:absolute;top:0;bottom:0;width:50%;transform-style:preserve-3d;z-index:5;display:none}
#ksbook .leaf.on{display:block}
#ksbook .leaf .face{width:100%;-webkit-backface-visibility:hidden;backface-visibility:hidden}
#ksbook .leaf .face.back{transform:rotateY(180deg)}
.ksarrow{position:absolute;top:50%;transform:translateY(-50%);width:2.2em;height:3.4em;border:none;background:none;color:rgba(244,236,220,.75);font:34px Georgia,serif;cursor:pointer;padding:0;z-index:9}
.ksarrow:disabled{opacity:.15}
.ksarrow.l{left:max(2px,env(safe-area-inset-left))}
.ksarrow.r{right:max(2px,env(safe-area-inset-right))}
/* the roll: rough parchment between its own curled ends, an engrossing hand, a wax seal */
#ksroll .sheetw{position:relative;--H:min(86vh,calc(88vw * 1.3));height:var(--H);width:calc(var(--H) * .64);display:flex;flex-direction:column;align-items:stretch;filter:drop-shadow(0 14px 22px rgba(0,0,0,.5))}
#ksroll .curl{height:calc(var(--H) * .058);margin:0 -2.5%;border-radius:calc(var(--H) * .03);position:relative;z-index:2;flex:none;background-color:#cdb381;background-image:linear-gradient(rgba(70,45,15,.55),rgba(255,245,215,.25) 30%,rgba(255,245,215,.05) 55%,rgba(70,45,15,.6)),var(--parch);background-size:100% 100%,cover;box-shadow:0 calc(var(--H) * .006) calc(var(--H) * .01) rgba(60,38,14,.35)}
#ksroll .curl.b{position:absolute;left:-2.5%;right:-2.5%;margin:0;top:94.2%}
#ksroll .curl::after{content:'';position:absolute;top:8%;bottom:8%;width:calc(var(--H) * .04);border-radius:50%;right:-.3%;background:radial-gradient(ellipse at 45% 50%,#5b3f1e 0 22%,#b39363 30%,#8a6a3e 46%,#d4bb8d 58%,#7a5a30 80%)}
#ksroll .clip{flex:1;position:relative;margin:calc(var(--H) * -.02) 0 calc(var(--H) * .038)}
#ksroll .body{position:absolute;inset:0;background-color:#e2cc9c;background-image:radial-gradient(ellipse at 50% 42%,rgba(255,248,226,.35),rgba(120,80,30,.0) 60%,rgba(110,70,25,.28)),var(--parch);background-size:100% 100%,cover;clip-path:var(--deckle)}
#ksroll .words{position:absolute;left:11%;right:11%;top:13%;text-align:center;font-family:'UnifrakturCook','Old English Text MT',Georgia,serif;font-weight:700;color:#24160b;font-size:calc(var(--H) * .068);line-height:1.32;letter-spacing:.01em;text-shadow:0 0 .6px rgba(35,21,11,.55),0 0 2.5px rgba(60,35,12,.22)}
#ksroll .flour{position:absolute;left:4%;width:92%;top:5%;height:46%;pointer-events:none;overflow:visible}
#ksroll .ref{position:absolute;left:0;right:0;top:50%;text-align:center;font-family:'IM Fell English',Georgia,serif;font-style:italic;color:#46301c;font-size:calc(var(--H) * .031)}
#ksroll .sealw{position:absolute;left:50%;bottom:4%;width:40%;aspect-ratio:1/1.25;transform:translateX(-50%) rotate(-7deg)}
#ksroll .tails{position:absolute;left:0;top:0;width:100%;height:100%}
#ksroll .seal{position:absolute;left:0;top:0;width:100%;filter:drop-shadow(0 4px 4px rgba(50,8,4,.45)) drop-shadow(0 1px 1px rgba(50,8,4,.5))}
`;
  document.head.appendChild(style);

  // ---------- textures: laid paper, parchment and calf, made once in a canvas ----------
  function noiseFn(seed) {
    const h = (i, j) => { const v = Math.sin(i * 127.1 + j * 311.7 + seed * 17.3) * 43758.5453; return v - Math.floor(v); };
    return (x, y) => { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
      return (h(i, j) * (1 - a) + h(i + 1, j) * a) * (1 - b) + (h(i, j + 1) * (1 - a) + h(i + 1, j + 1) * a) * b; };
  }
  const R01 = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
  function texture(kind, W, H, seed = 1) {
    const c = mk(W, H), k = c.getContext('2d'), d = k.createImageData(W, H), n1 = noiseFn(seed), n2 = noiseFn(seed + 5), n3 = noiseFn(seed + 9);
    const base = kind === 'calf' ? [84, 50, 30] : kind === 'parch' ? [226, 203, 156] : [234, 220, 186];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const m = .5 * n1(x / 110, y / 110) + .3 * n1(x / 34 + 7, y / 34) + .2 * n2(x / 9, y / 9);
      let v;
      if (kind === 'paper') {      // laid paper: fine laid lines across, chain lines down, a little cloudiness in the pulp
        const laid = .5 + .5 * Math.sin(y * 2.2 + n3(x / 40, y / 3) * 2), cx = (x + 18) % 58, chain = Math.exp(-(((cx - 29) / 1.4) ** 2));
        v = 1 + (m - .5) * .1 + (laid - .5) * .018 - chain * .03 + (n3(x / 1.3, y / 9) - .5) * .035;
      } else if (kind === 'parch') {
        // parchment (build 199; owner: "paper texture should look really realistic"): large soft cloudiness of a skin,
        // in several sizes at once, thin darker veins where it was stretched, a fine grain, and the edges toned darker
        // by hands and years, unevenly
        const f = .42 * n1(x / 190, y / 190) + .26 * n2(x / 80 + 3, y / 80) + .17 * n1(x / 31 + 9, y / 31) + .1 * n3(x / 12, y / 12) + .05 * n2(x / 4, y / 4);
        const vein = Math.exp(-(((n3(x / 70 + 4, y / 26) - .5) / .012) ** 2)) * .06 + Math.exp(-(((n2(x / 45, y / 90 + 7) - .5) / .01) ** 2)) * .04;
        const ed = Math.min(x, W - x, y, H - y) / (W * (.07 + .07 * n1(x / 60 + y / 60, 3))), edge = Math.max(0, 1 - ed) ** 1.6;
        v = 1.03 + (f - .5) * .34 - vein * .15 + (n2(x / 1.4, y / 1.4) - .5) * .045 - edge * .2;
      } else {      // calf: grained and worn
        const grain = n3(x / 2.2, y / 2.2), scuff = n2(x / 70, y / 20); v = .82 + (m - .5) * .5 + (grain - .5) * .18 + Math.max(0, scuff - .72) * .9;
      }
      const o = (y * W + x) * 4; d.data[o] = base[0] * v; d.data[o + 1] = base[1] * v; d.data[o + 2] = base[2] * (kind === 'calf' ? v : v * .985); d.data[o + 3] = 255;
    }
    k.putImageData(d, 0, 0);
    if (kind === 'parch') {
      // fibres: many short fine hairs, a little lighter or darker than the skin, lying every way
      for (let i = 0; i < 2600; i++) { const x = R01() * W, y = R01() * H, a = R01() * Math.PI, l = 3 + R01() * 11, dk = R01() < .55;
        k.strokeStyle = dk ? `rgba(110,75,35,${.05 + .07 * R01()})` : `rgba(255,246,222,${.05 + .08 * R01()})`; k.lineWidth = .5 + R01() * .6;
        k.beginPath(); k.moveTo(x, y); k.quadraticCurveTo(x + Math.cos(a) * l * .5 + (R01() - .5) * 3, y + Math.sin(a) * l * .5 + (R01() - .5) * 3, x + Math.cos(a) * l, y + Math.sin(a) * l); k.stroke(); }
      // old water stains: pale inside, with the darker tide-line where the water dried
      for (let i = 0; i < 3; i++) { const x = R01() * W, y = R01() * H, r = 40 + R01() * 90, g = k.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(120,80,30,.025)'); g.addColorStop(.75, 'rgba(120,80,30,.05)'); g.addColorStop(.92, 'rgba(105,66,24,.09)'); g.addColorStop(1, 'rgba(105,66,24,0)');
        k.save(); k.translate(x, y); k.scale(1, .65 + R01() * .6); k.translate(-x, -y); k.fillStyle = g; k.fillRect(x - r, y - r, 2 * r, 2 * r); k.restore(); }
      // a few dark specks (ink and dirt), each tiny
      for (let i = 0; i < 70; i++) { k.fillStyle = `rgba(60,38,15,${.15 + .3 * R01()})`; k.beginPath(); k.arc(R01() * W, R01() * H, .4 + R01() * 1.1, 0, 7); k.fill(); }
    }
    // foxing and stains: a few soft brown spots, and the edges darkened by hands and years
    const spots = kind === 'paper' ? 14 : kind === 'parch' ? 10 : 0;
    for (let i = 0; i < spots; i++) { const x = R01() * W, y = R01() * H, r = (kind === 'parch' ? 18 : 3) + R01() * (kind === 'parch' ? 60 : 9), g = k.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${kind === 'parch' ? '120,80,30' : '150,95,40'},${kind === 'parch' ? .16 : .22 * R01() + .08})`); g.addColorStop(1, 'rgba(150,95,40,0)'); k.fillStyle = g; k.fillRect(x - r, y - r, 2 * r, 2 * r); }
    if (kind === 'parch') for (let i = 0; i < 7; i++) { const y = H * (.08 + .84 * R01()), a = .05 + .05 * R01(); k.fillStyle = `rgba(90,60,20,${a})`; k.fillRect(0, y, W, 1.4); k.fillStyle = `rgba(255,248,225,${a * 1.4})`; k.fillRect(0, y + 1.4, W, 1.2); }
    if (kind !== 'calf') { const g = k.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .75); g.addColorStop(0, 'rgba(110,70,25,0)'); g.addColorStop(1, `rgba(110,70,25,${kind === 'parch' ? .35 : .22})`); k.fillStyle = g; k.fillRect(0, 0, W, H); }
    return c.toDataURL('image/jpeg', .86);
  }
  // a rough edge for the parchment: a polygon a little torn all round (as clip-path)
  function deckle(n, amp, seed, sidesOnly) {
    const r = noiseFn(seed), pts = [], side = (fn) => { for (let i = 0; i <= n; i++) pts.push(fn(i / n)); };
    const j = (t, s) => sidesOnly && (s === 1 || s === 3) ? '0' : (amp * (.35 + .65 * r(t * 9 + s, s))).toFixed(2);
    side(t => `${(t * 100).toFixed(2)}% ${j(t, 1)}%`); side(t => `${(100 - j(t, 2) * .7).toFixed(2)}% ${(t * 100).toFixed(2)}%`);
    side(t => `${((1 - t) * 100).toFixed(2)}% ${(100 - j(t, 3)).toFixed(2)}%`); side(t => `${(j(t, 4) * .7).toFixed(2)}% ${((1 - t) * 100).toFixed(2)}%`);
    return `polygon(${pts.join(',')})`;
  }

  // ---------- THE WAX SEAL: a height map lit by one light, like real sealing wax ----------
  // The wax is a puddle with an uneven outline and a rounded edge; the matrix pressed into its middle leaves a sunken
  // field with a raised lip of pushed-up wax round it; in the field stand the raised device (the King's crown with a cross
  // above it), a ring of beads and the legend SIGILLVM REGIS ("the King's seal", Latin as on seals of the time). Each pixel's
  // slope gives its light (one light from the upper left), a sharp highlight on the polished tops, darker hollows, and a
  // warmer glow where the wax is thin at its edge.
  function waxSeal(S = 420) {
    const C = S / 2, nz = noiseFn(31);
    // each layer is drawn white on a canvas, read as numbers 0..1, and softened by a box blur done in floating point
    // (blurring the 8-bit picture left the slopes in steps, which the light showed as terraces)
    const lay = (draw, r) => { const L = mk(S, S), x = L.getContext('2d'); x.fillStyle = x.strokeStyle = '#fff'; draw(x);
      const d = x.getImageData(0, 0, S, S).data, a = new Float32Array(S * S); for (let p = 0; p < S * S; p++) a[p] = d[p * 4 + 3] / 255; return r ? soft(a, r) : a; };
    function soft(a, r) { r = Math.max(1, Math.round(r)); let src = a, dst = new Float32Array(S * S);
      for (let pass = 0; pass < 3; pass++) for (const horiz of [true, false]) {
        for (let line = 0; line < S; line++) { let acc = 0; const at = q => horiz ? line * S + Math.min(S - 1, Math.max(0, q)) : Math.min(S - 1, Math.max(0, q)) * S + line;
          for (let q = -r; q <= r; q++) acc += src[at(q)];
          for (let q = 0; q < S; q++) { dst[horiz ? line * S + q : q * S + line] = acc / (2 * r + 1); acc += src[at(q + r + 1)] - src[at(q - r)]; } }
        const t = src === a ? new Float32Array(S * S) : src; src = dst; dst = t; }
      return src; }
    const blob = x => { x.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2, r = S * .43 * (1 + .07 * (nz(Math.cos(a) * 2.2 + 3, Math.sin(a) * 2.2 + 3) - .5) * 2 + .035 * Math.sin(3 * a + 1) + .025 * Math.sin(5 * a + 2));
      x.lineTo(C + Math.cos(a) * r, C + 6 + Math.sin(a) * r * .97); } x.fill(); };
    const Ri = S * .3;
    const disc = (r, x) => { x.beginPath(); x.arc(C, C, r, 0, 7); x.fill(); };
    const device = x => {
      x.lineJoin = 'round'; x.lineCap = 'round';
      // ring of beads and a fine ring inside the legend
      for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2; x.beginPath(); x.arc(C + Math.cos(a) * Ri * .93, C + Math.sin(a) * Ri * .93, S * .0085, 0, 7); x.fill(); }
      x.lineWidth = S * .006; x.beginPath(); x.arc(C, C, Ri * .64, 0, 7); x.stroke();
      // the legend round the ring, and a cross at the foot
      const leg = 'SIGILLVM REGIS'; x.font = `bold ${Math.round(S * .074)}px 'IM Fell English SC','IM Fell English',Georgia,serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
      const span = 2.95, a0 = -Math.PI / 2 - span / 2;
      [...leg].forEach((ch, i) => { const a = a0 + span * (i + .5) / leg.length; x.save(); x.translate(C + Math.cos(a) * Ri * .785, C + Math.sin(a) * Ri * .785); x.rotate(a + Math.PI / 2); x.fillText(ch, 0, 0); x.restore(); });
      { const a = Math.PI / 2, px = C, py = C + Ri * .785, w = S * .016, l = S * .036; x.fillRect(px - w / 2, py - l, w, 2 * l); x.fillRect(px - l * .75, py - w / 2 - l * .25, l * 1.5, w); }
      for (const a of [Math.PI / 2 - .55, Math.PI / 2 + .55]) { x.beginPath(); x.arc(C + Math.cos(a) * Ri * .785, C + Math.sin(a) * Ri * .785, S * .012, 0, 7); x.fill(); }
      // the crown: a band with jewels, five points with pearls, arches to a cross on an orb
      const cw = Ri * .9, by = C + Ri * .26, bh = Ri * .17;
      x.fillRect(C - cw / 2, by, cw, bh);
      x.beginPath(); x.moveTo(C - cw / 2, by);
      const tips = [[-.5, -.42], [-.25, -.2], [0, -.5], [.25, -.2], [.5, -.42]];
      x.lineTo(C - cw / 2, by - Ri * .34); for (let i = 0; i < 5; i++) { const [tx, ty] = tips[i]; x.lineTo(C + tx * cw, by + ty * Ri); if (i < 4) x.lineTo(C + (tips[i][0] + tips[i + 1][0]) / 2 * cw, by - Ri * .08); }
      x.lineTo(C + cw / 2, by); x.closePath(); x.fill();
      for (const [tx, ty] of tips) { x.beginPath(); x.arc(C + tx * cw, by + ty * Ri - S * .012, S * .017, 0, 7); x.fill(); }
      x.beginPath(); x.arc(C, by - Ri * .62, S * .026, 0, 7); x.fill();
      x.fillRect(C - S * .007, by - Ri * .9, S * .014, Ri * .25); x.fillRect(C - S * .028, by - Ri * .82, S * .056, S * .013);
    };
    const jewels = x => { const by = C + Ri * .26, bh = Ri * .17; for (const t of [-.3, 0, .3]) { x.beginPath(); x.ellipse(C + t * Ri * .9, by + bh / 2, S * .016, S * .011, 0, 0, 7); x.fill(); } };
    const mask = lay(blob), dome = soft(mask, S * .035), domeS = soft(mask, S * .012), disc0 = lay(x => disc(Ri, x)), field = soft(disc0, S * .006),
      lip = lay(x => { x.lineWidth = S * .05; x.beginPath(); x.arc(C, C, Ri * 1.1, 0, 7); x.stroke(); }, S * .018), dev0 = lay(device), dev = soft(dev0, S * .003), devS = soft(dev0, S * .01),
      jw = lay(jewels, S * .003), fieldW = soft(disc0, S * .04);
    const N = S * S, h = new Float32Array(N), thin = new Float32Array(N);
    for (let p = 0; p < N; p++) {
      const x = p % S, y = (p / S) | 0, dm = dome[p], ds = domeS[p], f = field[p];
      const rr = Math.hypot(x - C, y - C) / (S * .43);
      h[p] = .55 * ds + .45 * dm + .18 * dm * (1 - rr * rr) - .5 * f + .2 * lip[p] * (1 - f) + f * (.3 * dev[p] + .12 * devS[p] + .1 * jw[p]) + (nz(x / 7, y / 7) - .5) * .02 + (nz(x / 30, y / 30) - .5) * .05;
      thin[p] = 1 - ds; }
    const c = mk(S, S), k = c.getContext('2d'), out = k.createImageData(S, S), o = out.data, K = S * .011;
    const L = [-.52, -.62, .58], ll = Math.hypot(...L); L[0] /= ll; L[1] /= ll; L[2] /= ll; const Hv = [L[0], L[1], L[2] + 1], hl = Math.hypot(...Hv); Hv[0] /= hl; Hv[1] /= hl; Hv[2] /= hl;
    const deep = [62, 5, 6], mid = [128, 14, 14], hi = [190, 34, 28];
    for (let y = 1; y < S - 1; y++) for (let x = 1; x < S - 1; x++) {
      const p = y * S + x, i = p * 4; if (mask[p] < .03) continue;
      const dx = (h[p + 1] - h[p - 1]) * K, dy = (h[p + S] - h[p - S]) * K, nl = Math.hypot(dx, dy, 1), nx = -dx / nl, ny = -dy / nl, nzz = 1 / nl;
      const diff = Math.max(0, nx * L[0] + ny * L[1] + nzz * L[2]), sh = Math.max(0, nx * Hv[0] + ny * Hv[1] + nzz * Hv[2]);
      const spec = Math.pow(sh, 70) * 1.1 + Math.pow(sh, 16) * .16, occ = 1 - .5 * Math.max(0, fieldW[p] - field[p]) - .22 * field[p] * (1 - dev[p]);
      const t = Math.min(1, diff * 1.15), base = t < .5 ? deep.map((v, q) => v + (mid[q] - v) * t * 2) : mid.map((v, q) => v + (hi[q] - v) * (t - .5) * 2);
      const glow = Math.max(0, thin[p] - .4) * 60;
      o[i] = Math.min(255, base[0] * (.5 + .62 * diff) * occ + glow + spec * 255); o[i + 1] = Math.min(255, base[1] * (.5 + .62 * diff) * occ + glow * .25 + spec * 225); o[i + 2] = Math.min(255, base[2] * (.5 + .62 * diff) * occ + spec * 210);
      o[i + 3] = 255 * mask[p];
    }
    k.putImageData(out, 0, 0);
    return c.toDataURL('image/png');
  }
  // two silk ribbon tails under the seal, with folds
  const TAILS = `<svg class="tails" viewBox="0 0 100 125" preserveAspectRatio="none"><defs>
    <linearGradient id="kst1" x1="0" x2="1"><stop offset="0" stop-color="#3c0c08"/><stop offset=".35" stop-color="#7d1a12"/><stop offset=".55" stop-color="#9a2a1c"/><stop offset=".8" stop-color="#5e130c"/><stop offset="1" stop-color="#3c0c08"/></linearGradient></defs>
    <path d="M38 62 C35 80 30 98 22 122 L31 115 L37 124 C42 102 46 82 50 64 Z" fill="url(#kst1)"/><path d="M62 62 C66 82 72 100 80 121 L71 115 L65 124 C61 103 56 84 52 64 Z" fill="url(#kst1)"/>
    <path d="M30 104 C33 100 36 101 38 98" stroke="#2a0805" stroke-width=".6" fill="none" opacity=".6"/><path d="M70 100 C68 98 66 99 64 96" stroke="#2a0805" stroke-width=".6" fill="none" opacity=".6"/></svg>`;
  // pen flourishes (cadels) round the red initial and under the words, as a writing master drew them
  const FLOUR = `<svg class="flour" viewBox="0 0 100 50" preserveAspectRatio="none"><g fill="#2a180c" opacity=".8"><path d="M26 45.6 C40 44.9 46 45 50 44.4 C54 45 60 44.9 74 45.6 C60 46.1 54 46 50 46.8 C46 46 40 46.1 26 45.6 Z"/><circle cx="50" cy="45.6" r=".9"/><circle cx="23.6" cy="45.6" r=".45"/><circle cx="76.4" cy="45.6" r=".45"/></g></svg>`;

  // ---------- the words of the book: Romans 3 and the start of 4, King James Version (public domain) ----------
  // set as the printers of Bunyan's day set it: the long s inside words, the round s at the end
  const longS = t => t.replace(/s(?=[a-z])/g, (m, i) => t[i + 1] === 'f' || t[i + 1] === 'b' || t[i + 1] === 'k' ? 's' : 'ſ');
  // a verse: [number, text]; <u>..</u> = underlined by Christian
  const V = (n, t) => `<p class="v" data-v="${n}"><b>${n}</b>${longS(t)}</p>`;
  const SPREADS = [
    [{ head: ['Chap.iij.', 'To the Romans.', ''], foot: ['', '', 'What'], body: `<div class="chap">CHAP. III.</div>` +
        `<p class="v"><span class="drop">W</span>${longS('HAT advantage then hath the Jew? or what profit is there of circumcision?')}</p>` +
        V(2, 'Much every way: chiefly, because that unto them were committed the oracles of God.') +
        V(3, 'For what if some did not believe? shall their unbelief make the faith of God without effect?') +
        V(4, 'God forbid: yea, let God be true, but every man a liar; as it is written, That thou mightest be justified in thy sayings, and mightest overcome when thou art judged.') +
        V(5, 'But if our unrighteousness commend the righteousness of God, what shall we say? Is God unrighteous who taketh vengeance? (I speak as a man)') +
        V(6, 'God forbid: for then how shall God judge the world?') +
        V(7, 'For if the truth of God hath more abounded through my lie unto his glory; why yet am I also judged as a sinner?') +
        V(8, 'And not rather, (as we be slandered, and as some affirm that we say,) Let us do evil, that good may come? whose damnation is just.') },
     { head: ['', 'To the Romans.', 'Chap.iij.'], foot: ['', 'Ee 3', 'Now'], marks: [[10, 'What shall I do?']], body:
        V(9, 'What then? are we better than they? No, in no wise: for we have before proved both Jews and Gentiles, that <u>they are all under sin</u>;') +
        V(10, 'As it is written, <u>There is none righteous, no, not one</u>:') +
        V(11, 'There is none that understandeth, there is none that seeketh after God.') +
        V(12, '<u>They are all gone out of the way</u>, they are together become unprofitable; <u>there is none that doeth good, no, not one</u>.') +
        V(13, 'Their throat is an open sepulchre; with their tongues they have used deceit; the poison of asps is under their lips:') +
        V(14, 'Whose mouth is full of cursing and bitterness:') +
        V(15, 'Their feet are swift to shed blood:') +
        V(16, 'Destruction and misery are in their ways:') +
        V(17, 'And the way of peace have they not known:') +
        V(18, 'There is no fear of God before their eyes.') }],
    [{ head: ['Chap.iij.', 'To the Romans.', ''], foot: ['', '', 'Where'], marks: [[23, '', true]], body:
        V(19, 'Now we know that what things soever the law saith, it saith to them who are under the law: that every mouth may be stopped, and <u>all the world may become guilty before God</u>.') +
        V(20, 'Therefore by the deeds of the law there shall no flesh be justified in his sight: for <u>by the law is the knowledge of sin</u>.') +
        V(21, 'But now the righteousness of God without the law is manifested, being witnessed by the law and the prophets;') +
        V(22, 'Even the righteousness of God which is by faith of Jesus Christ unto all and upon all them that believe: for there is no difference:') +
        V(23, '<u>For all have sinned, and come short of the glory of God</u>;') +
        V(24, 'Being justified freely by his grace through the redemption that is in Christ Jesus:') +
        V(25, 'Whom God hath set forth to be a propitiation through faith in his blood, to declare his righteousness for the remission of sins that are past, through the forbearance of God;') +
        V(26, 'To declare, I say, at this time his righteousness: that he might be just, and the justifier of him which believeth in Jesus.') },
     { head: ['', 'To the Romans.', 'Chap.iij.iiij.'], foot: ['', 'Ee 4', 'Now'], body:
        V(27, 'Where is boasting then? It is excluded. By what law? of works? Nay: but by the law of faith.') +
        V(28, 'Therefore we conclude that a man is justified by faith without the deeds of the law.') +
        V(29, 'Is he the God of the Jews only? is he not also of the Gentiles? Yes, of the Gentiles also:') +
        V(30, 'Seeing it is one God, which shall justify the circumcision by faith, and uncircumcision through faith.') +
        V(31, 'Do we then make void the law through faith? God forbid: yea, we establish the law.') +
        `<div class="chap" style="margin-top:.4em">CHAP. IIII.</div>` +
        `<p class="v"><span class="drop">W</span>${longS('HAT shall we say then that Abraham our father, as pertaining to the flesh, hath found?')}</p>` +
        V(2, 'For if Abraham were justified by works, he hath whereof to glory; but not before God.') +
        V(3, 'For what saith the scripture? Abraham believed God, and it was counted unto him for righteousness.') }],
    // build 201 (owner: "book (bible) can have more pages (more in romans) or another judgment passage (flipping several
    // pages animation to next passage). also more foot/margin notes"): the rest of Romans 4, then a riffle of pages on to
    // Hebrews 9, where verse 27 is the passage Bunyan's margin gives for "after that to come to judgement" ({14}).
    // The words were checked against two published KJV texts (the 1769 text in the es-kjv package and the bible-kjv
    // package): the same, but for Romans 4:18 "nations," (1769) / "nations;" and 4:19 "Sara's" (1769) / "Sarah's".
    [{ head: ['Chap.iiij.', 'To the Romans.', ''], foot: ['', '', 'Cometh'], marks: [[5, 'even me?'], [7, '', true]], body:
        V(4, 'Now to him that worketh is the reward not reckoned of grace, but of debt.') +
        V(5, 'But to him that worketh not, but <u>believeth on him that justifieth the ungodly</u>, his faith is counted for righteousness.') +
        V(6, 'Even as David also describeth the blessedness of the man, unto whom God imputeth righteousness without works,') +
        V(7, 'Saying, <u>Blessed are they whose iniquities are forgiven, and whose sins are covered</u>.') +
        V(8, 'Blessed is the man to whom the Lord will not impute sin.') },
     { head: ['', 'To the Romans.', 'Chap.iiij.'], foot: ['', 'Ee 5', 'For'], body:
        V(9, 'Cometh this blessedness then upon the circumcision only, or upon the uncircumcision also? for we say that faith was reckoned to Abraham for righteousness.') +
        V(10, 'How was it then reckoned? when he was in circumcision, or in uncircumcision? Not in circumcision, but in uncircumcision.') +
        V(11, 'And he received the sign of circumcision, a seal of the righteousness of the faith which he had yet being uncircumcised: that he might be the father of all them that believe, though they be not circumcised; that righteousness might be imputed unto them also:') +
        V(12, 'And the father of circumcision to them who are not of the circumcision only, but who also walk in the steps of that faith of our father Abraham, which he had being yet uncircumcised.') +
        V(13, 'For the promise, that he should be the heir of the world, was not to Abraham, or to his seed, through the law, but through the righteousness of faith.') }],
    [{ head: ['Chap.iiij.', 'To the Romans.', ''], foot: ['', '', 'He'], body:
        V(14, 'For if they which are of the law be heirs, faith is made void, and the promise made of none effect:') +
        V(15, 'Because the law worketh wrath: for where no law is, there is no transgression.') +
        V(16, 'Therefore it is of faith, that it might be by grace; to the end the promise might be sure to all the seed; not to that only which is of the law, but to that also which is of the faith of Abraham; who is the father of us all,') +
        V(17, '(As it is written, I have made thee a father of many nations,) before him whom he believed, even God, who quickeneth the dead, and calleth those things which be not as though they were.') +
        V(18, 'Who against hope believed in hope, that he might become the father of many nations, according to that which was spoken, So shall thy seed be.') +
        V(19, 'And being not weak in faith, he considered not his own body now dead, when he was about an hundred years old, neither yet the deadness of Sara\'s womb:') },
     { head: ['', 'To the Romans.', 'Chap.iiij.'], foot: ['', 'Ee 6', 'CHAP.'], marks: [[24, 'if I believe']], body:
        V(20, 'He staggered not at the promise of God through unbelief; but was strong in faith, giving glory to God;') +
        V(21, 'And being fully persuaded that, what he had promised, he was able also to perform.') +
        V(22, 'And therefore it was imputed to him for righteousness.') +
        V(23, 'Now it was not written for his sake alone, that it was imputed to him;') +
        V(24, 'But for us also, to whom it shall be imputed, <u>if we believe on him that raised up Jesus our Lord from the dead</u>;') +
        V(25, 'Who was delivered for our offences, and was raised again for our justification.') }],
    [{ jump: ['To the Corinthians.', 'To the Corinthians.', 'To the Galatians.', 'To the Ephesians.', 'To the Philippians.', 'To the Coloſſians.', 'To Timothy.', 'To Philemon.'],
       head: ['Chap.ix.', 'To the Hebrews.', ''], foot: ['', '', 'Nor'], marks: [[22, 'no remission']], body:
        V(18, 'Whereupon neither the first testament was dedicated without blood.') +
        V(19, 'For when Moses had spoken every precept to all the people according to the law, he took the blood of calves and of goats, with water, and scarlet wool, and hyssop, and sprinkled both the book, and all the people,') +
        V(20, 'Saying, This is the blood of the testament which God hath enjoined unto you.') +
        V(21, 'Moreover he sprinkled with blood both the tabernacle, and all the vessels of the ministry.') +
        V(22, 'And almost all things are by the law purged with blood; and <u>without shedding of blood is no remission</u>.') +
        V(23, 'It was therefore necessary that the patterns of things in the heavens should be purified with these; but the heavenly things themselves with better sacrifices than these.') +
        V(24, 'For Christ is not entered into the holy places made with hands, which are the figures of the true; but into heaven itself, now to appear in the presence of God for us:') },
     { head: ['', 'To the Hebrews.', 'Chap.ix.x.'], foot: ['', 'Kk 4', 'For'], marks: [[27, 'I fear it.', true], [28, 'O that it were so']], body:
        V(25, 'Nor yet that he should offer himself often, as the high priest entereth into the holy place every year with blood of others;') +
        V(26, 'For then must he often have suffered since the foundation of the world: but now once in the end of the world hath he appeared to put away sin by the sacrifice of himself.') +
        V(27, '<u>And as it is appointed unto men once to die, but after this the judgment</u>:') +
        V(28, 'So Christ was once offered to bear the sins of many; and unto them that look for him shall he appear the second time without sin <u>unto salvation</u>.') +
        `<div class="chap" style="margin-top:.4em">CHAP. X.</div>` +
        `<p class="v" data-v="1"><span class="drop">F</span>${longS('OR the law having a shadow of good things to come, and not the very image of the things, can never with those sacrifices which they offered year by year continually make the comers thereunto perfect.')}</p>` +
        V(2, 'For then would they not have ceased to be offered? because that the worshippers once purged should have had no more conscience of sins.') +
        V(3, 'But in those sacrifices there is a remembrance again made of sins every year.') }]];
  const pageHTML = p => `<div class="in"><div class="head"><span>${p.head[0]}</span><span class="c">${p.head[1]}</span><span class="r">${p.head[2]}</span></div><div class="txt">${p.body}</div><div class="foot"><span></span><span class="c">${p.foot[1]}</span><span class="r">${p.foot[2]}</span></div></div>`;
  // Christian's marks in the outer margin, placed beside their verse once the page is laid out (the verse may fall in
  // either column); a stroke down the margin beside the verse when asked
  function marks(el, p) {
    for (const old of el.querySelectorAll('.marg,.bar')) old.remove();
    if (!p.marks) return;
    const pr = el.getBoundingClientRect(), outerLeft = el.classList.contains('L');
    for (const [n, txt, bar] of p.marks) {
      const v = el.querySelector(`[data-v="${n}"]`); if (!v || !pr.width) continue;
      const r = v.getBoundingClientRect(), inn = el.querySelector('.in').getBoundingClientRect(), top = (r.top - pr.top) / pr.height * 100;
      if (txt) { const m = document.createElement('div'); m.className = 'marg'; m.textContent = txt; m.style.top = (top - 1.2) + '%';
        if (outerLeft) m.style.left = '1.2%'; else m.style.right = '1.2%'; el.appendChild(m); }
      if (bar) { const b = document.createElement('div'); b.className = 'bar'; b.style.top = top + '%'; b.style.height = (r.height / pr.height * 100) + '%';
        b.style.left = ((r.left - pr.left) / pr.width * 100 - 1) + '%'; el.appendChild(b); }      // a stroke down beside the verse itself
    }
  }

  // ---------- the overlays ----------
  const mkEl = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };
  const pauseBtn = mkEl(`<button id="pause" aria-label="Pause"><i></i><i></i></button>`);
  document.getElementById('stage').appendChild(pauseBtn);
  const NAMES = ['The City of Destruction', 'The Slough of Despond', 'Mr. Worldly Wiseman'];
  const menu = mkEl(`<div id="ksmenu" class="kscover"><div class="kscard"><h1>Resting a while</h1><button class="btn" data-go="on">Go on</button>
    <p>or begin again at</p>${NAMES.map((n, i) => `<button class="btn" data-go="${i + 1}"><i>${i + 1}</i>${n}</button>`).join('')}</div></div>`);
  const book = mkEl(`<div id="ksbook" class="kscover"><div class="bible"><div class="spread"><div class="edges"></div><div class="page L"></div><div class="page R"></div>
    <div class="leaf"><div class="face front"></div><div class="face back"></div></div><div class="spine"></div><div class="ribbon"></div></div></div>
    <button class="ksarrow l" aria-label="Turn back">‹</button><button class="ksarrow r" aria-label="Turn on">›</button><button class="ksx" aria-label="Close">×</button></div>`);
  const roll = mkEl(`<div id="ksroll" class="kscover"><div class="sheetw"><div class="curl"></div><div class="clip"><div class="body">
    ${FLOUR}<div class="words"><span style="color:#86190f;font-size:1.75em;line-height:.8;vertical-align:-.13em">F</span>lee from the wrath to come.</div><div class="ref">Matt. iii. 7.</div>
    <div class="sealw">${TAILS}<img class="seal" alt=""></div></div></div><div class="curl b"></div></div>
    <button class="ksx" aria-label="Close">×</button></div>`);
  for (const e of [menu, book, roll]) document.body.appendChild(e);
  // the textures and the seal are made the first time they are needed (each takes a moment)
  let made = { paper: false, parch: false, seal: false };
  function makePaper() { if (made.paper) return; made.paper = true; const b = book.querySelector('.bible');
    b.style.setProperty('--paper', `url(${texture('paper', 640, 860, 1)})`); b.style.setProperty('--paperR', `url(${texture('paper', 640, 860, 2)})`); b.style.setProperty('--calf', `url(${texture('calf', 512, 360, 3)})`); }
  function makeParch() { if (made.parch) return; made.parch = true; const w = roll.querySelector('.sheetw');
    w.style.setProperty('--parch', `url(${texture('parch', 700, 1080, 4)})`); w.style.setProperty('--deckle', deckle(40, 1.6, 5, true)); }
  function makeSeal() { if (made.seal) return Promise.resolve(); made.seal = true;
    const go = () => { roll.querySelector('.seal').src = waxSeal(); };
    return (document.fonts && document.fonts.load ? document.fonts.load(`30px 'IM Fell English SC'`).catch(() => {}) : Promise.resolve()).then(go, go); }

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
  let sp = 0, turning = false;
  const put = (el, p) => { el.innerHTML = pageHTML(p); marks(el, p); };
  function render() { put(L, SPREADS[sp][0]); put(R, SPREADS[sp][1]); bL.disabled = sp === 0; bR.disabled = sp === SPREADS.length - 1; }
  // one type size for every page: the largest at which every page fits in its two columns
  function fit() {
    const bib = book.querySelector('.bible'), h0 = bib.clientHeight; if (!h0) return;
    let f = h0 * .032;
    const fits = () => { for (const s of SPREADS) for (const [el, p] of [[L, s[0]], [R, s[1]]]) { el.innerHTML = pageHTML(p); const t = el.querySelector('.txt');
      if (t.scrollWidth > t.clientWidth + 2 || t.scrollHeight > t.clientHeight + 2) return false; } return true; };
    for (; f > 6; f -= .25) { bib.style.setProperty('--bf', f + 'px'); if (fits()) break; }
    render();
  }
  function openBook() { makePaper(); show(book, .45); render(); fit(); rustle(1.2); }
  function turn(d) {
    const to = sp + d; if (turning || to < 0 || to >= SPREADS.length) return;
    turning = true; rustle();
    const cur = SPREADS[sp], nx = SPREADS[to], fwd = d > 0;
    const jump = (fwd ? nx[0] : cur[0]).jump; if (jump) { riffle(fwd, cur, nx, to, fwd ? jump : jump.slice().reverse()); return; }
    // the leaf lies over the page that turns; beneath it, the page that will be uncovered
    leaf.style.left = fwd ? '50%' : '0'; leaf.style.transformOrigin = fwd ? '0 50%' : '100% 50%';
    front.className = 'face front ' + (fwd ? 'R' : 'L'); back.className = 'face back ' + (fwd ? 'L' : 'R');
    leaf.style.transition = 'none'; leaf.style.transform = 'rotateY(0deg)'; leaf.classList.add('on');
    put(front, fwd ? cur[1] : cur[0]); back.innerHTML = pageHTML(fwd ? nx[0] : nx[1]);
    put(fwd ? R : L, fwd ? nx[1] : nx[0]); void leaf.offsetWidth;
    leaf.style.transition = 'transform .85s cubic-bezier(.45,.05,.3,1)'; leaf.style.transform = `rotateY(${fwd ? -180 : 180}deg)`;
    setTimeout(() => { sp = to; render(); leaf.classList.remove('on'); turning = false; }, 880);
  }
  // RIFFLING ON TO ANOTHER BOOK (build 201): from Romans to Hebrews (or back) several leaves turn one after another, quick,
  // each a little behind the last; their running heads show the books passing (Corinthians, Galatians ...); the last
  // leaf brings the new page. Each leaf is a copy of the turning leaf, laid on top of those already turned.
  function riffle(fwd, cur, nx, to, heads) {
    const spread = book.querySelector('.spread'), n = heads.length, stag = 130, dur = 620, leaves = [];
    // the pages flicking past: other text, unmarked and a little soft (they pass too quickly to be read)
    const filler = h => pageHTML({ head: ['', h, ''], foot: ['', '', ''], body: SPREADS[0][1].body.replace(/<\/?u>/g, '') }).replace('<div class="in">', '<div class="in" style="filter:blur(.7px);opacity:.85">');
    put(fwd ? R : L, fwd ? nx[1] : nx[0]);
    for (let i = 0; i < n; i++) {
      const lf = leaf.cloneNode(true), fr = lf.querySelector('.front'), bk = lf.querySelector('.back');
      lf.style.left = fwd ? '50%' : '0'; lf.style.transformOrigin = fwd ? '0 50%' : '100% 50%'; lf.style.transition = 'none'; lf.style.transform = 'rotateY(0deg)';
      lf.classList.add('on'); lf.style.zIndex = 60 - i;
      fr.className = 'face front ' + (fwd ? 'R' : 'L'); bk.className = 'face back ' + (fwd ? 'L' : 'R');
      if (i === 0) put(fr, fwd ? cur[1] : cur[0]); else fr.innerHTML = filler(heads[i - 1]);
      bk.innerHTML = i === n - 1 ? pageHTML(fwd ? nx[0] : nx[1]) : filler(heads[i]);
      spread.appendChild(lf); leaves.push(lf);
    }
    void spread.offsetWidth;
    leaves.forEach((lf, i) => setTimeout(() => { lf.style.zIndex = 100 + i; lf.style.transition = `transform ${dur}ms cubic-bezier(.4,.05,.3,1)`; lf.style.transform = `rotateY(${fwd ? -180 : 180}deg)`; if (i % 2 === 0) rustle(.6); }, i * stag));
    setTimeout(() => { sp = to; render(); for (const lf of leaves) lf.remove(); turning = false; }, (n - 1) * stag + dur + 40);
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
  // the unrolling (build 199; owner: "when scroll unrolls we need the roll to start at top and get smaller as it goes
  // down"): the lower roller starts up beside the top one, fat with the rolled sheet, and travels down as the sheet comes
  // off it, thinning; the sheet is shown only down to the middle of that roller, so its edge is always inside the roll.
  // One clock drives both, measured in pixels, so they cannot drift apart.
  let unrollT = 0;
  function unroll() {
    const w = roll.querySelector('.sheetw'), cl = roll.querySelector('.clip'), rb = roll.querySelector('.curl.b'), t0 = performance.now(), run = ++unrollT;
    const step = now => { if (run !== unrollT) return;
      const H = w.clientHeight, u = Math.min(1, (now - t0) / 2100), p = 1 - Math.pow(1 - u, 2.6), h = H * (.12 - .062 * p), top = H * .04 + (H * .942 - H * .04) * p;
      rb.style.top = top + 'px'; rb.style.height = h + 'px'; rb.style.borderRadius = h / 2 + 'px';
      const edge = top + h * .5 - cl.offsetTop; cl.style.clipPath = `inset(0 0 ${Math.max(0, cl.clientHeight - edge)}px 0)`;
      if (u < 1) requestAnimationFrame(step); else cl.style.clipPath = ''; };
    requestAnimationFrame(step); }
  function openRoll() { makeParch(); makeSeal(); unroll(); show(roll, .45); rustle(1.4); }
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
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', () => { if (open === book) fit(); });
  // fetch the fonts early, so the book and the roll look right the first time
  setTimeout(() => { if (document.fonts && document.fonts.load) for (const f of ['16px "IM Fell English"', 'italic 16px "IM Fell English"', '16px "IM Fell English SC"', '16px "Herr Von Muellerhoff"', '700 16px "UnifrakturCook"', '16px "La Belle Aurore"']) document.fonts.load(f).catch(() => {}); }, 2500);

  return { paused: false, book: openBook, roll: openRoll, menu: openMenu, close: () => hide(), turn, waxSeal, get page() { return sp; } };
})();
