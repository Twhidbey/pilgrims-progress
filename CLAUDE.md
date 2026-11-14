# Pilgrim's Progress: notes for Claude

A gentle side-scrolling game for kids ages 7 to 10, following Bunyan's *The Pilgrim's Progress*. **The game is one file, `index.html`** (HTML, CSS, one script). No build step, no dependencies. `style-lab.html` is a separate test page for the art style. `HANDOFF.md` says what was built last and what is next; read it first in a new chat.

## Working with the owner

- **Repo: `Twhidbey/pilgrims-progress`, branch `main`.** This repo IS the live game: GitHub Pages serves it at https://twhidbey.github.io/pilgrims-progress/ (style lab: `/style-lab.html`). Pushing `main` publishes it (Pages takes 1 to 2 minutes). Commit and push after every change, then tell the owner it is live. A phone may show an old copy, so suggest adding `?v=N` to the link.
- **Build stamp:** bottom-right corner of the game (`id="build"` in `index.html`), the style lab canvas (`id="build"` in `style-lab.html`) and the walk lab (`id="build"` in `walk-lab.html`): `build N · date`. Bump N on **every** push, in both files, so one number means one push. Currently **build 13**.
- **Keep `CLAUDE.md` and `HANDOFF.md` updated after every change.** The repo is public: no names, emails or other personal details in notes, code or commits.
- Players: kids 7 to 10, mostly on a phone. Gentle: **no lives, no game over**, on-screen touch buttons, read-aloud dialogue, short simple sentences.
- Sister project with the same habits: `Twhidbey/math-jump` (Math Ninja).

## Art direction (owner, Nov 14 2026)

- **Scenery is drawn in code** (canvas / vector) for full control. **People are sprites** (owner, Nov 14 2026: "I think the sprites are better", after trying a code-drawn pilgrim): painted or AI-made poses, shown as solid one-colour silhouettes.
- **Atmospheric layered silhouettes, not video-game looking.** Each depth layer is basically ONE colour. Layers overlap with transparency and haze so together they read like a painted scene. **Pale far layers, darker near layers.**
- **Soft rain on the left clearing to warm golden light on the right.**
- Simple, natural, calm. **Not cartoonish.**
- The look was settled in `style-lab.html` first, then moved into the game (build 6). Try new looks in the lab before changing the game.
- **Christian is a silhouette** (owner: "making him a silhouette is better"). Since build 8 his poses are black silhouettes the owner made with an AI image tool (Nano Banana), cut out and embedded; they are tinted to the road colour in the game.
- **Don't cover the scene with words** (owner, twice): the dialogue is a thin strip of light text on the dark road under everyone's feet, no box.
- **Background hills should look realistic** (owner): natural ridgelines, not smooth waves or a single pointed peak.
- **Scale:** Christian must not dwarf things beside him (owner: "pilgrim dwarfs the fence"). Small things like fences go on a layer further back, sized for that distance.
- **The owner's chosen look** (lab default and the game's `LOOK`): `look=50.60.65.29.4.80.30.66.41.19.55.35.0-0.1.1.3` = Storm to gold, 4 layers, mist 29, soft edges 66, gentle hills.
- **Weather in the game runs across the whole level** (my choice, owner not yet asked): rain in the city, golden light by the gate.

## `style-lab.html` (the layered look, one screen)

Scene units are 960 × 540, ground line `GY = 455`. Search for these names:

| Area | Search for |
|---|---|
| Sliders and their defaults | `const CTRL` (group titles are one-item arrays), values live in `V` |
| Colour sets (rain side / golden side for sky, haze, nearest colour, cloud, light, windows) | `const PALS` |
| The weather across the screen (0 = rain, 1 = golden) | `warm(fx)`, `clearAt`, `hGrad` (a left-to-right gradient that follows the weather; used for every layer colour) |
| Soft drawing without `ctx.filter` (not reliable on iPhone): paint small on a scratch canvas, stretch back up | `soft(c, q, alpha, op, fn)` |
| Shapes (each is a filled outline, a `Path2D` pushed to the layer being built) | `poly`, `blob`, `house` (gable end / side roof / steeple, chimney, window spots), `tree` (0 round, 1 poplar, 2 bush), `tuft` |
| Hills | `mkNoise` (fractal value noise: `(x, wavelength, octaves, gain)`), and inside `build()`: `range` (far mountains: ridges with rounded tops, shoulders, small crags; a second paler range behind is `L.back`, drawn at half strength in `paintLayer`), `gy` (rolling hills with a rough wooded skyline in patches, flatter under the city) |
| Building the layers (shapes only): far ridge, city on the left, groves on the right, flat ground last, plus the framing layer in front. The fence sits on the layer just behind the ground (`fence`) | `build()`, `layers`, `front` |
| One colour per layer by depth | `layerCol(P, d)` (haze colour toward nearest colour) |
| Painting: sky, birds, each layer + lit windows + mist band, far rain sheets and light beams after the middle layer, puddles, Christian, framing, final rain-dull / gold-warm wash, vignette, paper grain | `paint()`, `paintSky()`, `paintLayer()` |
| Christian: watercolour sprite, or the same sprite tinted to a solid silhouette with a lit front edge | `SPR_SRC` (the walk pose, base64), `V.who`, `figSil` |
| Falling rain (the only thing redrawn every frame; the rest is cached in `sceneC`) | `frame()`, `drops` |
| Remembering a look in the link (`#sliders-palette.who.framing.seed`) | `save()`, `load()` |

How it stays cheap: `dirty = 2` rebuilds shapes, `dirty = 1` only repaints; the finished picture is kept in `sceneC` and only the rain streaks are drawn each frame. Layers scroll at different speeds with the "Walk along" slider (`par`, `PAN`).

## `walk-lab.html` (Christian's walk, side by side)

Built because the AI walk poses looked jumpy however they were blended. **Measured cause:** the AI "walk cycle" is mostly the same wide stride with a sudden legs-together pose every third frame (front foot at +34, 0, +24, +33, +3, +33 px from the body), so the legs snap open and shut; blending only smears it. Compares: A = the game's current blended AI poses; B = **the AI body cut at the tunic hem (`HEM` = 200 of 272 px) riding on legs drawn in code**: planted foot moves back at exactly ground speed (`footAt`, `STANCE` .6), swinging foot arcs forward, knees by two-bone reach (`leg`), hip height set by the planted leg so the body rises and falls naturally, standing and jumping eased in by moving the feet (no image blending). Sliders: speed, step length, leg thickness, bob; Stop/Walk, Jump, slow motion. Pale marks on the road show whether a planted foot slides.

## `index.html` (the game, Level 1 "City of Destruction")

Layered silhouettes since build 6. **The scenery code is copied from the lab (no build step, so it lives in both files): keep the two in step.** Search for these names:

| Area | Search for |
|---|---|
| Christian's poses (base64 WebP, black on transparent: walk1..walk6 from a dedicated walk-cycle sheet, stand = a passing pose from it, jump from the first sheet) and their tinted copies | `SPR_SRC`, `SPR_META` (per pose: anchor x and ground line y in the picture's pixels; walk poses are anchored on the head and sack so the body doesn't wobble), `loadSprites`, `SIL` (rain colour `.c`, golden colour `.w`). **One gait: he always walks** (owner: switching walk/run was clunky; wants it "super smooth, clean and elegant"). The walk cycle is the list `WALK`; `P.anim` advances one pose per `STEP_PX` walked (a full cycle = 140 px, the stride in the pictures) so feet keep pace at any speed. **Poses blend softly into each other** (owner: snapping looked jumpy): `drawBlend(mix, ...)` adds weighted poses on a small canvas with `'lighter'` so the body stays solid; `P.move` eases between standing and walking. Walk anchors were lined up by matching the head and sack (top 36% of each picture). **Watch for costume changes between AI poses** (robe length, flare): leave such poses out, they flash. Drawn at scale .56 (about 150 tall) |
| Screen size and fit | `VW`, `VH`, `GY` (ground 440), `LEVEL_W`, `GATE`, `fit()` |
| The look: numbers from the lab, colours | `LOOK`, `PAL`, `layerCol(d)` |
| Weather: 0 rain .. 1 golden across the screen; `clearAt` moves with the camera so the level goes from rain to gold | `warm`, `clearAt` (set at the top of `draw()`), `hGrad` |
| Scenery shapes (same as the lab) | `mkNoise`, `house`, `tree`, `tuft`, `fence` |
| Building the scenery once at boot: 3 layers (far range, far city, near city; countryside past the gate), mist, grass tufts, framing in front (grass, leafy boughs), two skies, light beams, rain sheets | `buildScenery()`, `SCN`, `FRONT`, `bake` (each layer baked twice: rain colour and golden colour, with lit windows), `stencil`, `tinted` |
| Drawing baked pictures by weather, straight onto the screen in thin strips | `weatherSegs`, `SEG`, `strip`, `pair` (two colours mixed), `fade` (one picture, varying strength) |
| Vignette + paper grain, one baked overlay | `bakeFinish`, `finishC` |
| Level layout | `buildLevel()`: `SOL` (solid crates, barrels, cart, walls), `ONE` (one-way market awning), `MUD`, `SPARKS` (lights to gather), `TRIG` (story triggers) |
| Things on the road (dark shapes in the ground colour, faint hint lines, a pale line along each top so kids see where to land) | `thing`, `barrelShape`, `stall`, `gate`, `INK` / `SETC` / `HINT` |
| Evangelist, Obstinate, Pliable: sprite poses from a second AI sheet (`evan`, `evan_point`, `obst` hands on hips, `obst_walk`, `pli`, `pli_walk`), anchored on the lower body so the staff and pointing arm don't shift them | `SPR_SRC` / `SPR_META` (same tables as Christian), `drawSpr(k, x, y, face, alpha, bob)`; Pliable steps by swapping `pli` / `pli_walk`, Obstinate walks with a bob |
| Story text | `INTRO`, `EVAN`, `NEIGH`, `END`; `talk()`, `show()`, `next()`; read-aloud `say()` (speechSynthesis). The words `#dlg` are a **thin strip on the dark road below everyone's feet** (top 82.5% of the stage to the bottom; light text, name in gold, faint dark fade, no box; owner didn't want the scene covered). `#dlg.on` shows it; `body.talking` hides the touch buttons, sparks counter and build stamp (any tap moves the story on) |
| Movement | `update()`: `GRAV`, `JUMP`, `MAXV`, coyote time + jump buffer, mud slows, rolling barrels only bump Christian back (no harm) |
| Drawing a frame | `draw()`, `drawLight()` (the shining light, always visible, grows as he nears) |
| Input | `KMAP` (arrows / WASD / space), touch buttons `#tl #tr #tj` |
| Start and end | `start()`, `finish()`, `boot()` |

Story beats in order: intro, Evangelist points to the shining light, mud, barrels roll down the street, Obstinate goes home and Pliable follows, out through the city gate. Next level named on the end card: the Slough of Despond.

**Speed lessons (build 6):** never draw from a canvas that changed this frame into another canvas (a scratch canvas per layer per frame dropped the game to 12 frames a second in testing). Bake pictures once and only draw from them. Draw each layer only in the band of the screen it occupies (`Lr.top` to the ground). Leave `imageSmoothingQuality` at its default.

## Known loose ends

- There is **no `assets/` folder in the repo**; the images exist only as base64 inside `index.html`.
- The old watercolour background images (`ART_SRC`) and the unused `_old()` were removed in build 6.
