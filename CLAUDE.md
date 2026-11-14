# Pilgrim's Progress: notes for Claude

A gentle side-scrolling game for kids ages 7 to 10, following Bunyan's *The Pilgrim's Progress*. **The game is one file, `index.html`** (HTML, CSS, one script). No build step, no dependencies. `style-lab.html` is a separate test page for the art style. `HANDOFF.md` says what was built last and what is next; read it first in a new chat.

## Working with the owner

- **Repo: `Twhidbey/pilgrims-progress`, branch `main`.** This repo IS the live game: GitHub Pages serves it at https://twhidbey.github.io/pilgrims-progress/ (style lab: `/style-lab.html`). Pushing `main` publishes it (Pages takes 1 to 2 minutes). Commit and push after every change, then tell the owner it is live. A phone may show an old copy, so suggest adding `?v=N` to the link.
- **Build stamp:** bottom-right corner of the game (`id="build"` in `index.html`) and of the style lab canvas (`id="build"` in `style-lab.html`): `build N · date`. Bump N on **every** push, in both files, so one number means one push. Currently **build 5**.
- **Keep `CLAUDE.md` and `HANDOFF.md` updated after every change.** The repo is public: no names, emails or other personal details in notes, code or commits.
- Players: kids 7 to 10, mostly on a phone. Gentle: **no lives, no game over**, on-screen touch buttons, read-aloud dialogue, short simple sentences.
- Sister project with the same habits: `Twhidbey/math-jump` (Math Ninja).

## Art direction (owner, Nov 14 2026)

- **Draw everything in code** (canvas / vector) for full control. Moving away from embedded painted images.
- **Atmospheric layered silhouettes, not video-game looking.** Each depth layer is basically ONE colour. Layers overlap with transparency and haze so together they read like a painted scene. **Pale far layers, darker near layers.**
- **Soft rain on the left clearing to warm golden light on the right.**
- Simple, natural, calm. **Not cartoonish.**
- **Start small:** the look is being settled in `style-lab.html` first. Do not restyle the game until the owner picks a look there.
- **Christian is a silhouette** (owner, Nov 14 2026: "making him a silhouette is better"). For now it is the watercolour sprite tinted one colour; the lab still has the Watercolour button for comparison.
- **Background hills should look realistic** (owner, Nov 14 2026): natural ridgelines, not smooth waves or a single pointed peak.
- **The owner's chosen look** is the lab's default: Storm to gold, 4 layers, mist 100, soft edges 77 (`look=45.57.44.100.4.80.37.77.46.51.55.48.0-0.1.1.3`).

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
| Building the layers (shapes only): far ridge, city on the left, groves on the right, flat ground last, plus the framing layer in front | `build()`, `layers`, `front` |
| One colour per layer by depth | `layerCol(P, d)` (haze colour toward nearest colour) |
| Painting: sky, birds, each layer + lit windows + mist band, far rain sheets and light beams after the middle layer, puddles, Christian, framing, final rain-dull / gold-warm wash, vignette, paper grain | `paint()`, `paintSky()`, `paintLayer()` |
| Christian: watercolour sprite, or the same sprite tinted to a silhouette with a lit front edge | `SPR_SRC` (the walk pose, base64), `V.who`, `figSil` |
| Falling rain (the only thing redrawn every frame; the rest is cached in `sceneC`) | `frame()`, `drops` |
| Remembering a look in the link (`#sliders-palette.who.framing.seed`) | `save()`, `load()` |

How it stays cheap: `dirty = 2` rebuilds shapes, `dirty = 1` only repaints; the finished picture is kept in `sceneC` and only the rain streaks are drawn each frame. Layers scroll at different speeds with the "Walk along" slider (`par`, `PAN`).

## `index.html` (the game, Level 1 "City of Destruction")

Still the earlier watercolour look. Search for these names:

| Area | Search for |
|---|---|
| Embedded images (base64 WebP) | `SPR_SRC` (Christian: stand / walk / run / jump; faceless, hooded, burden on his back), `ART_SRC` (sky, far skyline, row of houses, road) |
| Screen size and fit | `VW`, `VH`, `GY` (ground 440), `LEVEL_W`, `fit()` |
| Watercolour kit (code-drawn washes and ink) | `rough`, `wash`, `ink`, `splats`, paper grain `paper` |
| Background layers, painted once at boot, scrolled by parallax | `paintSky`, `paintFar`, `paintMid`, `paintNear`, `PAR`, `layer()` |
| Level layout | `buildLevel()`: `SOL` (solid crates, barrels, cart, walls), `ONE` (one-way awning), `MUD`, `SPARKS` (lights to gather), `TRIG` (story triggers) |
| Other people (code-painted, faceless) | `figure()`, `paintPeople()`, `NPC` (Evangelist, Obstinate, Pliable, barrel) |
| Story text | `INTRO`, `EVAN`, `NEIGH`, `END`; `talk()`, `show()`, `next()`; read-aloud `say()` (speechSynthesis) |
| Movement | `update()`: `GRAV`, `JUMP`, `MAXV`, coyote time + jump buffer, mud slows, rolling barrels only bump Christian back (no harm) |
| Drawing | `draw()`, `drawPlayer()`, `drawLight()` (the shining light), `drawFig()` |
| Input | `KMAP` (arrows / WASD / space), touch buttons `#tl #tr #tj` |
| Start and end | `start()`, `finish()`, `boot()` |

Story beats in order: intro, Evangelist points to the shining light, mud, barrels roll down the street, Obstinate goes home and Pliable follows, out through the city gate. Next level named on the end card: the Slough of Despond.

## Known loose ends

- There is **no `assets/` folder in the repo**; the images exist only as base64 inside `index.html`.
- `_old()` in `index.html` is unused.
