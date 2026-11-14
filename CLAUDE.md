# Pilgrim's Progress: notes for Claude

A gentle side-scrolling game for kids ages 7 to 10, following Bunyan's *The Pilgrim's Progress*. **The game is one file, `index.html`** (HTML, CSS, one script). No build step, no dependencies. `style-lab.html` is a separate test page for the art style. `HANDOFF.md` says what was built last and what is next; read it first in a new chat.

## Working with the owner

- **Repo: `Twhidbey/pilgrims-progress`, branch `main`.** This repo IS the live game: GitHub Pages serves it at https://twhidbey.github.io/pilgrims-progress/ (style lab: `/style-lab.html`). Pushing `main` publishes it (Pages takes 1 to 2 minutes). Commit and push after every change, then tell the owner it is live. A phone may show an old copy, so suggest adding `?v=N` to the link.
- **Build stamp:** bottom-right corner of the game (`id="build"` in `index.html`) and of the style lab canvas (`id="build"` in `style-lab.html`): `build N · date`. Bump N on **every** push, in both files, so one number means one push. Currently **build 7**.
- **Keep `CLAUDE.md` and `HANDOFF.md` updated after every change.** The repo is public: no names, emails or other personal details in notes, code or commits.
- Players: kids 7 to 10, mostly on a phone. Gentle: **no lives, no game over**, on-screen touch buttons, read-aloud dialogue, short simple sentences.
- Sister project with the same habits: `Twhidbey/math-jump` (Math Ninja).

## Art direction (owner, Nov 14 2026)

- **Scenery is drawn in code** (canvas / vector) for full control. **People are sprites** (owner, Nov 14 2026: "I think the sprites are better", after trying a code-drawn pilgrim): painted or AI-made poses, shown as solid one-colour silhouettes.
- **Atmospheric layered silhouettes, not video-game looking.** Each depth layer is basically ONE colour. Layers overlap with transparency and haze so together they read like a painted scene. **Pale far layers, darker near layers.**
- **Soft rain on the left clearing to warm golden light on the right.**
- Simple, natural, calm. **Not cartoonish.**
- The look was settled in `style-lab.html` first, then moved into the game (build 6). Try new looks in the lab before changing the game.
- **Christian is a silhouette** (owner: "making him a silhouette is better"). His four painted poses are tinted one colour and made solid (thin paint used to let pale spots show through; owner found them distracting).
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

## `index.html` (the game, Level 1 "City of Destruction")

Layered silhouettes since build 6. **The scenery code is copied from the lab (no build step, so it lives in both files): keep the two in step.** Search for these names:

| Area | Search for |
|---|---|
| Christian's painted poses (base64 WebP: stand / walk / run / jump) and their silhouettes | `SPR_SRC`, `loadSprites`, `SIL` (each pose baked in the rain colour `.c` and golden colour `.w`) |
| Screen size and fit | `VW`, `VH`, `GY` (ground 440), `LEVEL_W`, `GATE`, `fit()` |
| The look: numbers from the lab, colours | `LOOK`, `PAL`, `layerCol(d)` |
| Weather: 0 rain .. 1 golden across the screen; `clearAt` moves with the camera so the level goes from rain to gold | `warm`, `clearAt` (set at the top of `draw()`), `hGrad` |
| Scenery shapes (same as the lab) | `mkNoise`, `house`, `tree`, `tuft`, `fence` |
| Building the scenery once at boot: 3 layers (far range, far city, near city; countryside past the gate), mist, grass tufts, framing in front (grass, leafy boughs), two skies, light beams, rain sheets | `buildScenery()`, `SCN`, `FRONT`, `bake` (each layer baked twice: rain colour and golden colour, with lit windows), `stencil`, `tinted` |
| Drawing baked pictures by weather, straight onto the screen in thin strips | `weatherSegs`, `SEG`, `strip`, `pair` (two colours mixed), `fade` (one picture, varying strength) |
| Vignette + paper grain, one baked overlay | `bakeFinish`, `finishC` |
| Level layout | `buildLevel()`: `SOL` (solid crates, barrels, cart, walls), `ONE` (one-way market awning), `MUD`, `SPARKS` (lights to gather), `TRIG` (story triggers) |
| Things on the road (dark shapes in the ground colour, faint hint lines, a pale line along each top so kids see where to land) | `thing`, `barrelShape`, `stall`, `gate`, `INK` / `SETC` / `HINT` |
| Other people, code-drawn for now (Evangelist, Obstinate, Pliable) | `person(c, o)` (poses stand / walk / jump; options hood, burden, robe, cloak, hat, hair, beard, point, hips, staff), `drawWho` |
| Story text | `INTRO`, `EVAN`, `NEIGH`, `END`; `talk()`, `show()`, `next()`; read-aloud `say()` (speechSynthesis). The words box `#dlg` sits at the **top, in the sky** (owner: at the bottom it covered the lower third, people included); while it shows, `body.talking` hides the touch buttons and the sparks counter (any tap moves the story on) |
| Movement | `update()`: `GRAV`, `JUMP`, `MAXV`, coyote time + jump buffer, mud slows, rolling barrels only bump Christian back (no harm) |
| Drawing a frame | `draw()`, `drawLight()` (the shining light, always visible, grows as he nears) |
| Input | `KMAP` (arrows / WASD / space), touch buttons `#tl #tr #tj` |
| Start and end | `start()`, `finish()`, `boot()` |

Story beats in order: intro, Evangelist points to the shining light, mud, barrels roll down the street, Obstinate goes home and Pliable follows, out through the city gate. Next level named on the end card: the Slough of Despond.

**Speed lessons (build 6):** never draw from a canvas that changed this frame into another canvas (a scratch canvas per layer per frame dropped the game to 12 frames a second in testing). Bake pictures once and only draw from them. Draw each layer only in the band of the screen it occupies (`Lr.top` to the ground). Leave `imageSmoothingQuality` at its default.

## Known loose ends

- There is **no `assets/` folder in the repo**; the images exist only as base64 inside `index.html`.
- The old watercolour background images (`ART_SRC`) and the unused `_old()` were removed in build 6.
