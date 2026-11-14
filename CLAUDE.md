# Pilgrim's Progress: notes for Claude

A gentle side-scrolling game for kids ages 7 to 10, following Bunyan's *The Pilgrim's Progress*. **The game is one file, `index.html`** (HTML, CSS, one script). No build step, no dependencies. `style-lab.html` is a separate test page for the art style. `HANDOFF.md` says what was built last and what is next; read it first in a new chat.

## Working with the owner

- **Repo: `Twhidbey/pilgrims-progress`, branch `main`.** This repo IS the live game: GitHub Pages serves it at https://twhidbey.github.io/pilgrims-progress/ (style lab: `/style-lab.html`). Pushing `main` publishes it (Pages takes 1 to 2 minutes). Commit and push after every change, then tell the owner it is live. A phone may show an old copy, so suggest adding `?v=N` to the link.
- **Build stamp:** bottom-right corner of the game (`id="build"` in `index.html`), the style lab canvas (`id="build"` in `style-lab.html`), the walk lab (`id="build"` in `walk-lab.html`), the 2200 concept page (`concept-2200.html`) and the story lab (`story-lab.html`): `build N · date`. Bump N on **every** push, in both files, so one number means one push. Currently **build 25**. Several chats may be pushing at once: `git fetch` and rebase on `origin/main` just before pushing, and take the next number after whatever is there.
- **Keep `CLAUDE.md` and `HANDOFF.md` updated after every change.** The repo is public: no names, emails or other personal details in notes, code or commits.
- Players: kids 7 to 10, mostly on a phone. Gentle: **no lives, no game over**, on-screen touch buttons, read-aloud dialogue, short simple sentences.
- Sister project with the same habits: `Twhidbey/math-jump` (Math Ninja).

## Art direction (owner, Nov 14 2026)

- **Scenery is drawn in code** (canvas / vector) for full control. **People are monochrome watercolour figures rotoscoped from AI videos** (since builds 15 to 17; earlier: black silhouette sprites).
- **Atmospheric layered silhouettes, not video-game looking.** Each depth layer is basically ONE colour. Layers overlap with transparency and haze so together they read like a painted scene. **Pale far layers, darker near layers.**
- **Soft rain on the left clearing to warm golden light on the right.**
- Simple, natural, calm. **Not cartoonish.**
- The look was settled in `style-lab.html` first, then moved into the game (build 6). Try new looks in the lab before changing the game.
- **Christian is a monochrome watercolour** (owner, build 15: "I'm cool leaving him as watercolor, which you can make more monochromatic"). His walk is **rotoscoped from an AI video** (Veo, started from the original watercolour Christian): 38 frames of one full walk cycle, made grey (the painting's light and dark only) and tinted in the game for the weather. Earlier tries, all rejected as jumpy or strange: AI pose sheets (never a true walk cycle, measured), blending poses, AI body on code-drawn legs (`walk-lab.html`). **Lesson: AI image tools can't make walk cycles; AI video can.** Owner on the result: "that walk looks AMAZING, more like this for other characters". Since build 17 **everyone** is a video character: Christian (walk, stop, stand breathing), Pliable (walk), Obstinate (walk), Evangelist (stand, raise arm and point).
- **Clothes must be timeless** (owner, Nov 14 2026: a post-apocalyptic version may come later): worn, handmade, layered cloth (hoods, cloaks, wraps, sashes, satchels, staffs) that suits the 1600s and a ruined future alike. No lace, ruffs, buckles or neat buttons; no zips, goggles or gadgets. Character prompts in `HANDOFF.md`.
- **How a video becomes frames** (scripts kept outside the repo, easy to redo): the owner makes a Veo video from a watercolour picture (white background; camera follows for walks, still for gestures), about 8 s. Check: camera steady (head x within a few px), height about 290 px, the planted foot slides back at a steady speed (`vpx`), stride width rises and falls evenly. Pick the loop whose first and last frames match best, cut a fixed window, white to transparent, grey `g = .2 + .62 * lightness`, crop, WebP q78.
- **Slow and atmospheric** (owner, build 21: "you can keep things slow, same with walk, I'm going for an atmospheric feel"): play every clip at its own video speed, never sped up. Christian walks at his video's pace: `MAXV` 1.05 (mud .6); the level takes about 1.5 minutes of walking. Neighbours hurry after him at 2.2, Obstinate walks home at 1.25 (his video's pace).
- **Faces stay blank** (like the original Christian): add "no eyes, no mouth, no facial features, just a soft plain wash" to video prompts, especially for turns (Veo added eyes once).
- **Video tip:** for a turn or any move with a fixed ending, give Veo a start picture **and** an end picture (first and last frame); with only a start picture it turned Evangelist the wrong way.
- **Feet overlap the road a little** (owner: a gap under the feet looks wrong; overlapping reads right, like perspective): `FEET_SINK` (9 px) in `drawFrame`.
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

## `walk-lab.html` (Christian's walk, side by side): kept for reference, no longer used by the game

Built because the AI walk poses looked jumpy however they were blended. **Measured cause:** the AI "walk cycles" are mostly the same wide stride with a sudden legs-together pose (front foot at +34, 0, +24, +33, +3, +33 px from the body), so the legs snap open and shut. Compares A = the old blended AI poses with B = the AI body on drawn legs (`RIG`, the same code as the game). Sliders: speed, step length, leg thickness, bob; Stop/Walk, Jump, slow motion. Pale marks on the road show whether a planted foot slides. It also rendered the pose guide given to Nano Banana (8 evenly spaced moments of one cycle).

## `index.html` (the game, Level 1 "City of Destruction")

Layered silhouettes since build 6. **The scenery code is copied from the lab (no build step, so it lives in both files): keep the two in step.** Search for these names:

| Area | Search for |
|---|---|
| Everyone else's video frames | `PLI_SRC`/`PLI_META` (Pliable, 32-frame walk, `vpx` 6, `rest` 0 and 18), `OBS_SRC`/`OBS_META` (Obstinate, 32-frame walk, `vpx` 6, `rest` 23; no arguing video yet, so he pauses on frame 23 while talking), `EVA_SRC`/`EVA_META` (Evangelist, from his turn-and-point video, made from a start picture facing left and an end picture pointing right: video 0 to 44 facing left toward Christian (**while waiting he only breathes on frames 0 to 16**, `G.evan.idle`; from about 20 his hand moves, owner found it distracting; the turn starts from wherever the breathing is), 46 to 178 turning all the way round, 180 to 210 raising his arm, 212 to 239 pointing; stored at varying steps, `src` = each stored frame's video frame, `atTime(meta, t)`. **He faces Christian while they talk** (owner asked); at `lines === EVAN && li >= 2` `G.evan.pt` plays 46 to 239 at the video's own speed, then sways on 212 to 239). **He never disappears** (owner): he stays pointing as Christian walks on (`G.evanGone` only marks the talk as over). Walkers' `anim` advances by how far they moved (`stepAnim`). All drawn with `drawFrame` |
| Christian: walk, stop, stand | Standing: `STD_SRC`/`STD_META` from his standing video, played once from the stop: video 0 to 16 he slows to a stop (continues walk frame 28), 17 to 95 he lifts his book and lowers it **once**, then video 120 to 215 (`QUIET`, hands still, just breathing) plays back and forth for as long as he stands (`breathT`; owner: the repeated hand movement felt repetitive). From walk frame 1 he enters at `STAND_FROM_1` (17). He starts the level already in the quiet part. **While anyone is talking he holds still** (owner: no breathing bob when talking): `P.stand.t` only advances in dialogue until he has finished stopping (t < 16), then pauses until the talk ends. `chrAnim()` (runs during dialogue too): walking advances `P.anim`; on letting go he finishes the step to walk frame 28 (then `P.stand = {t: 0}`) or 1 (then `t: 17`), then `P.stand.t` advances at 24 a second; pressing again starts from walk frame 1. Matches were measured (shape overlap) between the two videos. Walk: `CHR_SRC` (38 grey WebP frames, base64), `CHR_META` (`ax`, `ground`: his centre and ground line in each frame; `vpx`: ground movement per video frame, 4.9; `rest`: frames 12 and 29, both feet down; `leap`: frame 10, held in a jump), `loadChristian`, `CHR_K` (.52: video px to screen), `CHR_STEP` (screen px walked per frame, so the planted foot stays put), `chrFrame`, `drawChristian` → `drawFrame(im, meta, x, y, face, alpha)` (grey frame × the weather tint on a small canvas `figC`, cut back to the figure's shape; used for every video character), `loadFrames`, `stepAnim(anim, moved, step, meta)`. `P.anim` advances by distance walked; when he stops it plays on to the next `rest` frame and pauses. Tint is `mix(haze, near, .8)`: darker than the houses behind him. The gate and stall (`SETC`) were made paler (`layerCol(.66)`) so he shows in front of them |
| Screen size and fit | `VW`, `VH`, `GY` (ground 440), `LEVEL_W`, `GATE`, `fit()` |
| The look: numbers from the lab, colours | `LOOK`, `PAL`, `layerCol(d)` |
| Weather: 0 rain .. 1 golden across the screen; `clearAt` moves with the camera so the level goes from rain to gold | `warm`, `clearAt` (set at the top of `draw()`), `hGrad` |
| Scenery shapes (same as the lab) | `mkNoise`, `house`, `tree`, `tuft`, `fence` |
| Building the scenery once at boot: 3 layers (far range, far city, near city; countryside past the gate), mist, grass tufts, framing in front (grass, leafy boughs), two skies, light beams, rain sheets | `buildScenery()`, `SCN`, `FRONT`, `bake` (each layer baked twice: rain colour and golden colour, with lit windows), `stencil`, `tinted` |
| Drawing baked pictures by weather, straight onto the screen in thin strips | `weatherSegs`, `SEG`, `strip`, `pair` (two colours mixed), `fade` (one picture, varying strength) |
| Vignette + paper grain, one baked overlay | `bakeFinish`, `finishC` |
| Level layout | `buildLevel()`: `SOL` (solid crates, barrels, cart, walls), `ONE` (one-way market awning), `MUD`, `SPARKS` (lights to gather), `TRIG` (story triggers) |
| Things on the road (dark shapes in the ground colour, faint hint lines, a pale line along each top so kids see where to land) | `thing`, `barrelShape`, `stall`, `gate`, `INK` / `SETC` / `HINT` |
| Evangelist, Obstinate (until their videos come): black sprite poses from an AI sheet (`evan`, `evan_point`, `obst` hands on hips, `obst_walk`), anchored on the lower body | `SPR_SRC` / `SPR_META`, `drawSpr(k, x, y, face, alpha, bob)`; Obstinate walks with a bob |
| Story text | `INTRO`, `EVAN`, `NEIGH`, `END`; `talk()`, `show()`, `next()`; read-aloud `say()` (speechSynthesis). The words `#dlg` are a **thin strip on the dark road below everyone's feet** (top 82.5% of the stage to the bottom; light text, name in gold, faint dark fade, no box; owner didn't want the scene covered). `#dlg.on` shows it; `body.talking` hides the touch buttons, sparks counter and build stamp (any tap moves the story on) |
| Movement | `update()`: `GRAV`, `JUMP`, `MAXV`, coyote time + jump buffer, mud slows, rolling barrels only bump Christian back (no harm) |
| Drawing a frame | `draw()`, `drawLight()` (the shining light, always visible, grows as he nears) |
| Input | `KMAP` (arrows / WASD / space), touch buttons `#tl #tr #tj` |
| Start and end | `start()`, `finish()`, `boot()` |

Story beats in order: intro, Evangelist points to the shining light, mud, barrels roll down the street, Obstinate goes home and Pliable follows, out through the city gate. Next level named on the end card: the Slough of Despond.

**Speed lessons (build 6):** never draw from a canvas that changed this frame into another canvas (a scratch canvas per layer per frame dropped the game to 12 frames a second in testing). Bake pictures once and only draw from them. Draw each layer only in the band of the screen it occupies (`Lr.top` to the ground). Leave `imageSmoothingQuality` at its default.

## Game direction (owner, Nov 14 2026): a story walk, not a platformer

Owner: "leaning away from the mario style initial setup and toward atmospheric story driven game ... I don't want jumps and obstacles ... I like the old Riven and Myst games where visuals and story-telling take center (though I don't want the wandering) ... the light dots keep the character moving forward". Then: "let's do all these changes ... keep it super atmospheric, cool and beautiful". And: "putting some stuff in separate files and not all in index.html is good, game should be fast".

- **No jumps, no obstacles, no score, no counter.** One way to go. Walk, then a story moment, then walk.
- **Built in `story-lab.html` first** (below), because other chats were changing the characters in `index.html` at the same time. **When the owner approves it, it replaces the play code in `index.html`** (or becomes `index.html`).

## `story-lab.html` (Level 1 as a story walk, build 25)

Live at `/story-lab.html`. Its scenery code (setup to `bakeFinish`) is a copy of `index.html`'s: keep them in step. **The characters' frames are not inside it:** they load from `assets/*.pack`. Search for these names:

| Area | Search for |
|---|---|
| Frames in separate files | `loadPack(name, into)`, `PACK_V` (bump when packs change). A `.pack` is the same WebP frames end to end (4 bytes count, 4 bytes per frame length, then the frames; nothing re-compressed). Made by **`python3 tools/pack-frames.py`**, which reads `CHR_SRC` etc. out of `index.html`: **run it again whenever another chat changes frames in `index.html`**, and copy any changed `*_META` line into `story-lab.html`. Christian's two packs load before "Begin" shows; Evangelist, Obstinate and Pliable load while the child already plays (`EVA.ready` etc.; the story waits for them if needed) |
| Hold to walk | `downs` (fingers held), `held()` (a tap only touches; a finger held 9 ticks walks), `keys.r` (space / right arrow / D), `walkTick(dir, max)`. **He never stops mid-stride:** letting go, he walks on to walk frame 28 or 1 (where the standing video joins) so feet never slide. `P.turn` = turn round once he has stopped |
| Same speed on every screen | `loop()`: the world ticks 60 times a second whatever the screen's refresh rate (`STEPS`) |
| The lights are a tune | `PHRASES` (Amazing Grace, public domain, one phrase per stretch; `[beat, note]`), `BEAT` (58 px of road per beat, so walking plays it in time), `LIGHTS`, `gather()`. A higher note floats higher. Three low notes in the mud |
| Gathered lights stay with him | `G.motes`, `motes()`: a slow cloud of fireflies behind his shoulder, plus a soft warmth round him that grows (`glow`, `GLOW`). At the gate they help push, then fly on into the far light one per note |
| The world answers a touch | `touchAt(sx, sy)`: the far light (`pulseLight`), lamps (`LAMPS`, `lightLamp`, `lamp`), birds (`FLOCKS`, `scatter`, `birdSit`; they also fly when he walks near, always toward the light), puddles (`PUDDLES`, ripples), church bells (`SCN[1].steeples`, `toll`), windows (`nearWindow`, `lightWindow`, `G.litw`). Many set a light free (`free`) that flies to him and sings a harmony note (`HARM`). Small glints now and then show what can be touched (`G.glints`) |
| Words | `talk(lines, then)` stops and waits for taps. A line can be `[who, text, act, fn]`: `act` = `'light'` or `'gate'` waits for the child to do it; `fn` runs when the line appears. `caption(lines)` = said while walking, passes on its own (`CAPS` by road position). `hint(key, text)` = a quiet prompt until done. All in the same thin strip on the road |
| The acts | `acts()`, `G.ring` (soft rings showing where to touch). Evangelist asks "Do you see that shining light?" and the child touches it (`lightTouched`). At the gate the child holds the gate to push (`G.gateOpen`, `pushHeld`, `doors`, `gateOpened`) |
| The choice | `choose()`, `pick(home)`, `#choice`: "Go home" or "Go on to the light". Going home = a few steps back, rain harder, light dim (`G.gloom`, `G.gloomTo`), then he turns round by himself (`HOME`). Nothing is lost: the book treats wrong turns the same way |
| Story text | `INTRO`, `EVAN`, `NEIGH`, `HOME`, `ONWARD`, `PART`, `GATEWORDS`, `END`; triggers in `story()`; neighbours and Pliable following in `people()` |
| Weather | In `draw()`: rain through the city, clearing near the gate; **the gold breaks through as the gate is pushed open** (`clearAt` uses `G.gateOpen`); `G.gloom` pulls the rain back |
| Sound, all made in the browser (no files) | `audio()` (rain hiss, a low hum on G and D, a warm note in the gold, a dark note for gloom, an echo `ECHO`), `note(midi)`, `sfx` (footsteps, mud, splash, lamp, window, puddle, wings, bell, birdsong, gate), `ambience()`. Sound button `#snd`. At the open gate the whole tune plays once with bass notes (`TUNE`, `BASS`, `G.finale`) |
| Things at the back of the road (nothing blocks) | `DECOR`, `thing`, `STALL`, `gate`, `doors` |
| Testing | `story-lab.html?x=3600` starts further along the road. In a test, `update()` can be called in a loop to fast-forward; `next(true)` skips a line; `pick(true/false)`; `keys.r` / `keys.push` |

## `concept-2200.html` (year 2200 concept pictures, build 21)

The owner is thinking about a **post-apocalyptic version set in the year 2200** (asked Nov 14 2026 for ideas, then concept art to choose from). Agreed tone: a *quiet* apocalypse, long after, gentle for ages 7 to 10 (no skulls, weapons, mutants); rain to gold becomes dead world to living world; Bunyan's names and words stay; the people sprites stay.

The page is the style lab's painting code (copied) with new shapes and four directions on buttons (`V.pal`): **A Fallen towers**, **B Rust and ash**, **C The green return**, **D Glass age**. Link form `#A3` = direction + version number (`SEEDS` holds the default version of each). New shapes to search for: `holed` (outline with see-through holes), `bar`, `wire`, `dangle` (snapped wire / vine), `tower` (ruined block), `pylon`, `pole`, `overpass` (also the sky-rail), `turbine`, `cooling`, `stack`, `tank`, `crane`, `pipeline`, `shack`, `pod`, `car`, `spire`, `dome`, `arc`, `drum`, `tyre`. Scale rule used: things on the layer behind the ground are sized like the fence (about 12 units a metre), tall towers go on the layers further back. **Waiting on the owner's choice**; nothing in the game has changed.

## Known loose ends

- There is **no `assets/` folder in the repo**; the images exist only as base64 inside `index.html`, which is now about **2.7 MB** (five videos' frames). If it grows much more, move frames into separate WebP sprite sheets.
- The old watercolour background images (`ART_SRC`) and the unused `_old()` were removed in build 6.
