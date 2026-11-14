# Pilgrim's Progress: handoff (read this first in a new chat)

The game is `index.html` (one file, no build step). `style-lab.html` is the art-style test page. `CLAUDE.md` maps the code and records the owner's decisions. Work on **`main`** and push after every change: pushing IS publishing (GitHub Pages, https://twhidbey.github.io/pilgrims-progress/). Bump the build stamp in both pages on every push and tell the owner when it is live (a phone may need `?v=N` on the link). Keep this file and `CLAUDE.md` updated. Public repo: no personal details.

## The owner and players
- Players: kids 7 to 10, mostly on a phone. Gentle: no lives, no game over, touch buttons, read-aloud dialogue.
- New art direction (Nov 14 2026): everything drawn in code; atmospheric layered silhouettes, one colour per depth layer, pale far and dark near, transparency and haze, soft rain on the left clearing to golden light on the right; calm and natural, not cartoonish, not video-game looking.
- Start small: settle the look in the style lab before touching the game.

## Built Nov 14, 2026 (build 4)
- `CLAUDE.md` and `HANDOFF.md` created.
- **`style-lab.html` rebuilt** as one screen in the layered-silhouette style, all code-drawn: a far ridge, a city of gabled houses and a steeple on the left, hills with groves, poplars and hedges on the right, flat ground with grass, a fence and puddles, an optional dark framing layer in front (trunk, hanging leaves, tall grass), heavy clouds and falling rain on the left, the shining light with soft beams and a few birds on the right, a little paper grain.
- Controls: 4 colour sets (Storm to gold, Violet dusk, Green morning, Ink and paper); Christian as Watercolour / Silhouette / Hidden; New scene; Framing in front; 13 sliders (Rain ↔ golden light, Rain, Golden glow, Mist between layers, How many layers, Pale far layers, See-through overlap, Soft edges, Countryside ↔ city, Hills, Trees, Lit windows, Walk along). The picture stays pinned at the top while the sliders scroll.
- The page link remembers the look (and shows it as a `look=...` line), so the owner can send back the one they like.
- Game: only the build stamp changed (build 4, slightly easier to read). The game itself is still the watercolour version.
- Checked in a headless browser at desktop and phone sizes: no errors, sliders and buttons change the picture. Not yet seen on a real phone.

## Built Nov 14, 2026 (build 5): owner's first feedback
- Owner: **"making him a silhouette is better"** → Christian is a silhouette by default in the lab (still the watercolour sprite tinted one colour; the four game poses can be tinted the same way).
- Owner: **"the hills in the background can be more realistic"** → hills now use fractal noise: a far mountain range with rounded peaks and shoulders plus a paler range behind it, and rolling hills with a rough wooded skyline in patches. Before, they were a few sine waves and one pointed peak.
- Owner's look is now the lab default: `look=45.57.44.100.4.80.37.77.46.51.55.48.0-0.1.1.3` (Storm to gold, 4 layers, mist 100, soft edges 77, framing on).
- Game unchanged apart from the build stamp.

## Built Nov 14, 2026 (build 6): the game gets the layered look
- Owner feedback on build 5: "pilgrim dwarfs the fence, the fence needs to be further back"; pale-blue spots on the silhouette were distracting; new look `look=50.60.65.29.4.80.30.66.41.19.55.35.0-0.1.1.3`; "ready to see game".
- **`index.html` rebuilt in the layered-silhouette style**: far mountains, two layers of city with lit windows, countryside past the gate, mist, rain that clears to golden light as Christian walks the level, light beams, grass and leafy boughs in front. Crates, barrels, cart, walls, market stall, gate and the other people are dark shapes. File went from 360 KB to about 158 KB (old background images removed).
- **Christian** is his four painted poses as solid silhouettes (no more spots). A code-drawn pilgrim was built and tried first; **the owner prefers sprites** and will make new ones with an AI image tool. A prompt was given in chat. The code-drawn `person()` is still used for Evangelist, Obstinate and Pliable until sprites exist for them.
- Fence moved onto the layer behind the ground, small, in both the lab and the game. Lab default is the new look; lab silhouette is solid too.
- Speed: first version ran at 12 frames a second in the test browser (old game: 60). Now about 50 to 60. See "Speed lessons" in `CLAUDE.md`.
- Tested in a headless browser only: title, start, all six stretches of the level, no errors. **Not yet played on a real phone**, and the neighbours scene and the barrels were not watched closely.

## Built Nov 14, 2026 (build 7)
- Owner: "the script covers the lower third of the scene". The words box moved to the top of the screen (the sky is empty there), a little narrower; the touch buttons and the sparks counter hide while people talk. Checked at iPhone landscape size.

## Built Nov 14, 2026 (build 8)
- Owner: "I still don't like the scene covered up ... make the script run in a small strip". The words are now a thin line of light text on the dark road under everyone's feet: no box, name in gold, wraps to two lines at most. Checked at iPhone landscape size with the longest line.
- **New Christian** from the owner's Nano Banana sheet (8 black silhouettes): cut out automatically with clean edges. Used: stand, walk 2 and 3 (starting off), run 1 and 2 (full speed), jump. **Not used: walk 1 and walk 4**, because they have a long robe while the others have a short tunic, so mixing them made the robe flicker. The two walk poses used are almost the same stride, so walking looks a little stiff; full-speed running looks good.
- Style lab uses the new walk pose too ("Watercolour" button renamed "Plain black").
- File is 71 KB now (the old painted sprites are gone).

## Built Nov 14, 2026 (build 9)
- Owner sent a second Nano Banana sheet: Evangelist pointing and standing with a staff, Obstinate hands on hips and walking (wide hat), Pliable standing and walking (short cloak). Cut out the same way and put in the game; **the code-drawn people (`person()`) are gone**.
- Evangelist stands until Christian reaches him, then points to the light while he speaks. Obstinate walks in, stands with hands on hips while arguing, walks home. Pliable walks (two poses taking turns) and follows Christian.
- Played through both scenes in a headless browser: no errors. Not yet seen on a phone.

## Built Nov 14, 2026 (build 10)
- Owner: "the transition between running and walking is clunky; maybe just walking, more intermediate sprites, super smooth and clean and elegant". Christian now **only walks** (run poses removed). Walk poses advance by distance walked (`WALK`, `STEP_PX`), so adding poses needs only the list changed.
- Still only two walk poses (nearly the same stride), so it is not smooth yet. **Waiting on an 8-pose walk cycle from the owner** (prompt given in chat): cut out, add as walk1..walk8, set `WALK` to all eight.

## Built Nov 14, 2026 (build 11)
- Owner sent an 8-pose walk-cycle sheet. Used six poses (2, 3, 4, 6, 7, 8) as `walk1..walk6`; poses 1 and 5 left out because their robe flares longer and would flash every step. Standing uses pose 3 (a passing pose), so the robe no longer changes when he stops. Old two-pose walk and old stand removed. Jump is still from the first sheet.
- Not yet watched at full frame rate on a phone; worth asking the owner if the walk is smooth enough, or whether to try all 8 poses.

## Built Nov 14, 2026 (build 12)
- Owner: "still looks jumpy, maybe slower transition?". Each walk pose now blends into the next as he moves (`drawBlend`), and starting and stopping blend between standing and walking (`P.move`). Walk poses re-lined up on the head and sack so the body doesn't shift sideways. If still not smooth enough: slow his top speed a little (`MAXV`, now 4.4) for a calmer walk, or ask for more in-between poses.

## Built Nov 14, 2026 (build 13): walk lab
- Owner: "still looks jumpy, and blending shows when he stops sometimes; need a more comprehensive plan".
- Measured the walk poses: they are not a real cycle (mostly one wide stride plus a snap to legs-together), so no blending can make them smooth.
- **Plan:** keep the AI picture for Christian's body (hood, sack, tunic, arms) and draw only his legs in code below the hem, following a correct walk (feet planted, no sliding, no snapping, natural stop, no blending ghosts). Built as `walk-lab.html` first, side by side with the current walk, game untouched.
- **Next, if the owner likes B:** move B into the game for Christian (replace `WALK` / `drawBlend` / the walk poses), then the same for Pliable and Obstinate. If not: ask Nano Banana for a proper cycle with the pose list from chat, and check the feet with the measuring script before using it.

## Open questions for the owner
1. How does the game feel on the phone: smooth? Anything hard to see (dark Christian against dark houses, crates, barrels)?
2. New sprites: when they arrive, which poses, and are Evangelist / Obstinate / Pliable included?
3. Weather across the whole level (rain in the city, gold at the gate): right, or should every screen show both?
4. Are lit windows welcome (a second colour inside a layer)?
5. Leafy boughs and tall grass in front: keep, or in the way?

## Next steps
- Swap in the owner's new sprites (cut each pose out, add to `SPR_SRC`, keep feet on the bottom edge; `loadSprites` makes the silhouettes).
- Replace the code-drawn Evangelist, Obstinate and Pliable with sprites if the owner makes them.
- Then Level 2: the Slough of Despond.

## Loose ends
- No `assets/` folder is in the repo (images are only base64 inside `index.html`). Upload it if the originals should be kept here.
- `README.md` is only a title.
