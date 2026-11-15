# Pilgrim's Progress: handoff (read this first in a new chat)

The game is `index.html` (one file, no build step). `style-lab.html` is the art-style test page. `CLAUDE.md` maps the code and records the owner's decisions. Work on **`main`** and push after every change: pushing IS publishing (GitHub Pages, https://twhidbey.github.io/pilgrims-progress/). Bump the build stamp in both pages on every push and tell the owner when it is live (a phone may need `?v=N` on the link). Keep this file and `CLAUDE.md` updated. Public repo: no personal details.

## START HERE (written at build 41, updated at build 43, Nov 15 2026, for a new chat)

**What is live.** https://twhidbey.github.io/pilgrims-progress/story-lab.html is the game being worked on: Level 1, "The City of Destruction", as a story walk. The main link (`index.html`) is still the OLD jumping game from build 24. Everything below is about `story-lab.html`; `CLAUDE.md` maps its code.

**What the level is now (in order, following the book):** title ("Open the book", a few quiet notes, "Begin") → a wheat field in the rain, Christian with his book and burden → hold to walk; lights on the road sing Amazing Grace one note each → Evangelist in the field: the child touches the far light → he runs → his own cottage: his wife and two children call from the lit doorway; the child holds to run on; he runs with his hands over his ears crying "Life! Life! Eternal life!" (the world goes muffled) → he tires and walks; neighbours' windows light → Obstinate and Pliable catch him; the child chooses "Go home" or "Go on to the light" → the road with Pliable → the child pushes the city gate open; the gold breaks through; they walk into the gate and the tune plays whole. All 31 lines are recorded voices (six designed voices).

**Build 48 (the last thing built in the game):** owner: "in pilgrims progress, he is in a field then meet evangelist then runs, and family calls out to him ... yes do both, field and the run order - at the end of this chapter it's pretty basked in light, maybe don't make it quite so light (still a tad dreary, though i do want progression and i love the effect!!) - can you put sticking close to story in the notes". Done: the level opens in a wheat field outside the city; Evangelist meets him there; he runs from the moment Evangelist finishes; the family scene at the door is unchanged except that he arrives running; the ending keeps some rain and less gold (`GOLD_MAX`); the gate stands in one continuous wall (owner asked while watching); "stay close to the story" is at the top of `CLAUDE.md`. The wheat took three tries: single stalks ("unrealistic"), a lively parting ("trying too hard"), now plain solid rows that bow softly. No money spent, no line of words changed. **Open with the owner:** in the book he never stops at his door or answers; I kept the stop because the framed picture there was the owner's own idea one build earlier. Ask whether he should run straight past instead. The level is 600 longer; every position after Evangelist moved (see the constants).

**Build 46:** the owner asked for the book in the files for reference, without other people's introductions: `book/pilgrims-progress-part-one.txt` (Bunyan's Part One with his own Apology; the distributor's header and licence text removed; section numbers `{n}`). Nothing in the game changed but the build stamp.

**Build 45 (the last thing built in the game):** owner: "the house could be smaller - also kids and wife float above light a little. when wife calls i'd like him to turn so his back facing viewer and his shadow formed by the light off to the right a little so we can see him and family framed in the door (powerful scene!) - really look at this from an artist point of view". Done: a new small one-room cottage painting; the family's feet on the doorstep where the light begins; Christian turns his back to us when his wife first calls (new picture `assets/christian-back.webp`) and turns away when the child holds to run on; a stronger flat pool of door light on the ground with his shadow in it; warm light on the side of him toward the door. About 60 cents spent (4 pictures). Prompts: back view = his standing frame as reference + "Paint the SAME man ... now seen FROM BEHIND: he has turned his back to us and stands still, looking away from us into the picture, his body turned very slightly toward the left ... the SAME single big round lumpy cloth sack ... NOT a rucksack: no pockets, no flaps, no buckles, no bedroll ... SOFT, LOOSE monochrome grey watercolour wash, very little line drawing"; cottage = the old cottage as reference + "a tiny one-room hut ... about 4 wide to 3 tall ... the stone wall only FOUR door-widths wide ... doorway TALL AND NARROW ... doorway and two window openings left as pure blank white paper ... completely FLAT elevation", asked for at 4:3. The cottage cutout (white outside and the three holes made see-through, sized so the doorway is 146 units, holes measured into `HOUSE_META`) was done with a throwaway script. **Waiting on the owner's verdict**; still unanswered from build 44: whether to remove the wall, cart and crates too.

**Build 44:** owner: "let's remove the barrels and the bench with the bowls - not a fan of those. need this to be pretty stripped down and elegant. if you have a few things it begs for more - what do you think?" The stall and the barrel are gone. My answer: agreed; I offered to remove the last three props too (wall, cart, crates) and keep only what the story uses (house, lamps, gate), with the cart's birds moved to the cottage roof. **Waiting on their answer.**

**Build 43, after the owner played build 42:** they did not like the nearest level ("just look black and don't add much"), the house level felt wrongly sized (the stall against the house), and the door light looked wrong; then, more exactly: "too much disunity between his level and the next level back ... to see horizon like we do things have to have less perspective" and "the light streaming is key to the problem - it sets up an angle of perspective that doesn't match the rest". Done: the black nearest level is gone; the house level is now close to Christian's (.88 of his size, was .72) and close to his tone; the level in front is 1.12 (was 1.25) and shows its painting; stall, cart and crates made smaller to agree with the house; the crates moved so they never hide him while people talk; the door's light is a low flat pool at the doorstep. The Google key was tested with a real call (works). **Waiting on the owner's verdict on build 43.** Not yet asked: the open gate's light is also a shape lying down the road and may bother them the same way. Test tip: in a fast-forward loop, do not call `next(true)` or `lightTouched()` on a line whose `G.act` is `'gate'` or `'walkon'` (it skips the gate push and the level never ends).

**Build 41:** the light from the cottage door no longer lies flat across the lane and road (owner: it "is running across multiple levels and flattening them when it should be making contours on ground"; they like the effect and asked for a way to keep it). It now lights each piece of ground in that ground's own colour, fades with distance, and leaves the step between lane and road dark.

**Done in build 40 (the last thing built):** lights stay by his head when he runs; Pliable stays gone after the gate; Enter skips a line; the speaker button removed; **depth levels on one perspective rule** (see `CLAUDE.md`, "DEPTH"); a low cottage on the middle level with the family in its doorway; few special things, one at a time; puddle discs replaced by a wet road with rings.

**The owner has seen stills of build 40 (and commented only on the door light, fixed in 41), but may not have played it.** Their last words were that the layers were "off by quite a bit" (that was the by-eye version before the rule) and "puddles look off". First thing in a new chat: ask how build 40 looks, and offer `story-lab.html?lines` (the guide lines) if anything still looks wrong.

**Open, in the order I would take them:**
1. **The owner's verdict on build 43's depth** (the doubts below are from build 40; `f2` is gone and the levels are flatter now). Known doubts: the far row of houses does not obey the rule (raised on purpose so it shows; amber in `?lines`); things on `f1` hide Christian's legs as he passes (true to perspective, but the owner may not like it); `f2` shows dark shapes low in the picture that may read as blobs (the owner asked "what's this?" about the old leafy boughs).
2. **Figures on the middle level** ("nice place for some figures", owner): neighbours watching from the lane. Needs new pictures (about 15 cents each) and the owner's go-ahead.
3. **Make the story walk the main game:** replace `index.html` with the story lab and delete the lab page (also removes 2.7 MB of pictures inside `index.html`). Waiting only on the owner confirming no other chat is still editing `index.html` (asked twice, not answered).
4. **Standing videos** for Obstinate and Pliable (they now dissolve into a painted standing pose; a video like Christian's would be smoother). The video model is on the owner's key (56 cents each).
5. **Level 2, the Slough of Despond:** the mud belongs there; Pliable turns back; the child reaches for Help's hand; ideas: the gathered lights show the stepping stones; a different hymn.
6. Housekeeping: `concept-2200.html` waits on the owner's choice; `style-lab.html` is no longer in step with the story lab's scenery.

**Working with this owner (what this chat learned):**
- They look at everything closely and answer fast. Show pictures; they notice faces, perspective, scale and anything that does not read.
- They want my opinion when they ask "what do you think?" and action when they say "do it". When they say "before you code", only talk.
- **Money:** pictures, videos and voices are made with the owner's Google key and cost them money (picture about 15 cents, video about 56 cents, a voice line about a cent). Their prepaid credit ran out once mid-build. **Say the cost before spending.** Roughly $1.85 was spent after their top-up.
- **The key** is saved in the `pilgrims-progress` cloud environment as the variable `GEMINI_API_KEY` (build 42; the tools read that name). A chat started on that environment has it: check with `[ -n "$GEMINI_API_KEY" ]`, never print it. It is NOT in the repo. The environment's Network secrets form does not suit Google's `x-goog-api-key` header (tried, it sent the key as a Bearer token and Google refused it); the owner found that form hard, so do not send them back to it. Tested with a real call in build 43: it works.
- I cannot hear sound or watch motion: everything was checked from still pictures and by machine (voices by transcription). Say so; the owner's ears and eyes decide.
- Rules they have set are collected in `CLAUDE.md`; the newest: one special thing in the picture at a time; props flat and quiet; faces plain but his profile must show; the hymn is discovered on the road, never played before; keep files trim.

**How to test without a phone:** serve the folder (`python3 -m http.server`), open `story-lab.html` in a headless browser (Playwright is installed), click `#open` then `#play`, wait for `G.state === 'dialog'`, then fast-forward by calling `update()` in a loop with `keys.r = true`; `next(true)` skips a line, `lightTouched()`, `keys.push = true` for the run and the gate, `pick(false)` for the choice. `?x=2000` starts further along; `?lines` shows the perspective guides. A full run ends with `G.state === 'end'` and 35 lights of 35.

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

## Built Nov 14, 2026 (build 14): smooth walk in the game
- Owner tried a fourth Nano Banana sheet drawn from my pose guide; measured, it was still mostly wide strides with two sudden narrow ones (and pose 1 was standing, pose 5 had a longer robe). Owner then: "use walk lab but make slightly more realistic using clips as guide".
- Legs re-made from measurements of the AI art (shin 22 wide at the knee to 14 at the ankle, shoe about 43 long with a heel, knee about 54 above the ground, wide strides): heel strike with the toe up, foot rolls flat, heel lifts and pushes off the toe, lower leg folds back in the swing, hip rises and falls with the planted leg.
- **In the game now** (`RIG`, `drawChristian`). Standing, walking and jumping are all the legs moving: no pictures swap, so nothing snaps or ghosts. Old walk, stand and jump pictures removed.
- **Slower pace:** `MAXV` 4.4 to 2.6 (mud 1.9 to 1.5), because at 4.4 even perfect legs take about 6 steps a second, which reads as frantic. A simulated playthrough still finishes (about 40 s of walking, 11 jumps). Tell the owner; easy to raise if it feels slow.
- Same speed as before (about 54 to 63 frames a second in the test browser). Not yet seen on a phone.
- Next: if the owner likes it, give Pliable and Obstinate the same treatment (their body pictures cut at the hem, drawn legs), so everyone walks the same way.

## Built Nov 14, 2026 (build 15): Christian rotoscoped from an AI video
- Owner on build 14: "going backwards, the blending steps look strange, we need a new vision, look online". Researched: smooth realistic game walks come from rotoscoping (tracing real movement frame by frame, Prince of Persia lineage); today indie developers do it from short AI videos, because AI image tools are unreliable at walk cycles.
- Owner made a 10 s Veo video of the original watercolour Christian walking (camera following him, white background). Measured: camera steady (head within 5 px), he is about 290 px tall, one step every 18 to 19 frames, planted foot slides back a steady 4.9 px per frame, so it is a true walk. Used frames 187 to 224 (the cleanest loop).
- Owner: "leave him as watercolor, make it more monochromatic". Frames made grey and tinted in the game: cool and dark in the rain, warm by the gate. Played by distance walked (feet stay put), pauses on a both-feet-down frame, holds a full stride in a jump. Old drawn legs and AI body removed from the game.
- Pace 2.6 to 2.2 (mud 1.5 to 1.3) so the steps aren't hurried. Simulated playthrough finishes (about 47 s of walking, 12 jumps). Same speed as before (about 47 to 63 frames a second in the test browser). Not yet seen on a phone.
- Next: the same video method for Pliable, Obstinate and Evangelist if the owner likes it (one video each, started from their pictures).

## Built Nov 14, 2026 (build 16): Pliable's video walk
- Owner loved Christian's video walk ("AMAZING, more like this for other characters"). Gave a step-by-step guide: Nano Banana paints each character in Christian's watercolour style, then Veo animates it. Owner then asked for **timeless clothes** (a post-apocalyptic version may come): prompts rewritten for worn, handmade, layered cloth.
- Pliable's video (8 s, 24 fps): camera steady (head within 3 px), about 290 px tall like Christian, planted foot 6 px per frame, stride width rises and falls evenly. Loop frames 115 to 146 (32 frames). In the game he walks in, stands (frame 0) while they talk, and follows Christian, frames stepped by how far he moved. Same monochrome tint as Christian. Old Pliable sprites removed.
- File is now about 780 KB (two video walks). Fine for now; if it grows too big, frames can move into separate files.
- **Waiting for the owner's videos:** Obstinate walking, Obstinate arguing (hands on hips), Evangelist pointing, Christian standing (optional). Prompts were given in chat; each about 8 s.

## Built Nov 14, 2026 (build 17): everyone from videos
- Owner sent: Obstinate walking, Evangelist pointing, Christian standing and breathing (and the same Pliable video again). No Obstinate arguing video.
- **Obstinate:** true walk (steady camera, foot 6 px per frame), loop frames 27 to 58. Runs in, pauses on a both-feet-down frame while arguing, walks home.
- **Evangelist:** still at first (a slow breath), then on "Do you see that shining light far away?" raises his arm and points, and keeps pointing with a gentle sway; fades after speaking. Fewer frames stored where he is still, to save space.
- **Christian standing:** his standing video begins with him walking to a stop, and its first frame matches walk frame 28 (stand frame 17 matches walk frame 1). So letting go, he finishes his step, slows to a stop, lifts his book and breathes; pressing again starts from walk frame 1. This also runs during dialogue, so he settles while people talk.
- Old black sprites and their code are gone. File about 2 MB. Simulated playthrough fine; about 50 frames a second in the test browser. Not yet seen on a phone.
- Optional next: Obstinate arguing video (hands on hips) for the argument; a jump for Christian (he holds a stride in the air now).

## Built Nov 14, 2026 (build 18)
- Owner: Christian's hands moving up and down while standing felt repetitive; "loop it once, then just standing breathing". No new video needed: the last 5 s of his standing video are quiet breathing with still hands. Now each stop plays: step into the stop, lift and lower the book once, then the quiet part back and forth.
- Owner: feet had a gap above the road. Everyone is now drawn 9 px lower (`FEET_SINK`), so feet overlap the road edge.
- A start-up bug in this build's first try (a value used before it was defined) stopped the game loading in testing; fixed before pushing. Test scripts now wait for the Begin button instead of a fixed time (the file is about 2.4 MB).

## Built Nov 14, 2026 (build 19)
- Owner: "shouldn't Evangelist face the pilgrim when talking, then turn and point?" He now faces Christian as he walks up and while they talk; on "Do you see that shining light far away?" he turns toward the light (a quick paper-figure turn), then raises his arm and points.

## Built Nov 14, 2026 (build 20)
- Owner made a turn-and-point video for Evangelist. First try (start picture only) turned him toward the camera and back, never facing the other way; mirroring couldn't fix it. Second try used a start picture (facing left) and an end picture (pointing right), with "keep his face blank" (Veo had added eyes): worked.
- In the game he now faces Christian while they talk, then on "Do you see that shining light far away?" really turns round (about 3.5 s, the video at 1.5 times speed), raises his arm and points. The paper-flip turn from build 19 is gone.
- File about 2.7 MB. If more clips come, consider moving frames into separate WebP sprite sheets.

## Built Nov 14, 2026 (build 22)
- Owner: "you can keep things slow, same with walk, I'm going for an atmospheric feel". Everything now plays at its video's own speed: Evangelist's turn (about 5.5 s), Christian's walk (`MAXV` 2.2 to 1.05, mud to .6), Obstinate walking home (1.25); the neighbours hurry after Christian at 2.2 (caught up about 2 s after appearing in testing).
- Simulated playthrough still finishes: every crate, wall and barrel still clearable; about 94 s of walking (was 47).

## Built Nov 14, 2026 (build 23)
- Owner: Evangelist's hand moving up and down while he waits was distracting. He now only breathes (calm frames 0 to 16 of his clip) while waiting; the turn continues smoothly from there.
- Owner: don't make him disappear after Christian moves on. He now stays, pointing toward the light.

## Built Nov 14, 2026 (build 24)
- Owner: Christian should hold relatively still when talking, not bob from breathing. During any dialogue he now finishes stepping to a stop, then holds still; his standing (book lift once, quiet breathing) carries on when the talk ends.

## Built Nov 14, 2026 (build 25): the story walk (`story-lab.html`)
- Owner: no more jumps and obstacles; an atmospheric, story-driven game like Myst and Riven but without wandering; keep the lights; frames in separate files so it is fast. "Let's do all these changes."
- **New page `story-lab.html`** (live at `/story-lab.html`): all of Level 1 as a story walk. `index.html` was left alone because other chats were changing the characters in it (only its build stamp changed).
  - **Hold to walk.** No buttons, no jump, nothing in the way. He always finishes his step, so feet never slide.
  - **The lights sing.** Each light is one note of Amazing Grace, spaced so that walking plays the tune in time, one phrase per stretch. Gathered lights drift round him like fireflies.
  - **The world answers a touch:** lamps light, windows light, birds fly off toward the light, church bells ring, puddles ripple, the far light pulses. Many set a light free that flies to him.
  - **The child does the story:** touches the light when Evangelist asks "Do you see that shining light?"; chooses "Go home" or "Go on to the light" (going home is a few dark steps, then he turns round by himself); holds the gate to push it open, and the gold breaks through.
  - **Words while walking:** the mud, the people at their windows, and Pliable's talk pass by as captions; nobody stops.
  - **Sound:** rain, a low hum, footsteps, mud, wings, bell, birdsong in the gold, the gate. At the open gate the whole tune plays once while the lights fly on ahead. All made in the browser.
  - **Fast start:** frames load from `assets/*.pack`; the page itself is 80 KB (the game is 2.7 MB). Ready in under a second in testing.
- New: `assets/` (five `.pack` files, 2 MB) and `tools/pack-frames.py` (re-run when frames in `index.html` change).
- Tested in a headless browser at phone size with real touch events: whole level both ways through the choice, no errors; same frame rate as the game in the same test. **Not heard** (the test browser has no speakers) **and not seen on a real phone.**
- **Next:** the owner tries it on a phone with sound. Then: move it into `index.html` once the other chats' character work is finished (re-run the pack tool first); a recorded voice instead of the phone's robot voice; Level 2, the Slough of Despond, in the same shape (the child reaches for Help's hand).
- Ideas not built yet: the bell and windows could tell tiny stories (a door opens, someone calls); the child's lights could light the stepping stones in the Slough; a different hymn for each level.

## Built Nov 14, 2026 (build 26): trimming
- Owner: "I would like to keep files trim." `walk-lab.html` deleted (nothing used it). Next to trim: the frames inside `index.html` when the story lab replaces the game, and `concept-2200.html` when a 2200 look is chosen.
- Owner asked about an AI recorded voice for the story. Advice given in chat: one sound file per line, made with an AI voice tool; a list of the lines by speaker is in `story-lab.html` (`INTRO`, `EVAN`, `NEIGH`, `HOME`, `ONWARD`, `PART`, `GATEWORDS`, `END`, `CAPS`). Not built yet: `say()` would play the file for a line and fall back to the phone's voice.

## Built Nov 15, 2026 (build 27): recorded voices in the story lab
- Owner wanted an AI voice ("deep like Tolkien reading", English accent), then separate voices for Christian and Evangelist ("really mature wise voice, it can be higher"), made through Google's API.
- **Three voices designed from descriptions** with Google's Gemini TTS voice design, in the owner's Google project:
  - Storyteller: "An elderly English man with a deep, low, gravelly voice, like an old professor reading his own tale aloud by the fire. Rich and resonant, slow and measured, with long, unhurried pauses. Grave but kind, with quiet wonder underneath. An old-fashioned, educated English accent. Never bright, light, sing-song or cartoonish."
  - Evangelist: "A very old, wise English man in his late seventies. A calm, kind, knowing voice, a little higher and lighter than a bass, slightly thin and papery with age but steady and clear. He speaks slowly, with certainty and gentleness, like a wise old teacher who has seen a great deal. An educated, old-fashioned English accent. Never booming, hurried or theatrical."
  - Christian: "An ordinary English working man in his thirties. A quiet, earnest, weary voice of middle pitch: troubled and heavy-hearted, but sincere and gentle. Soft-spoken, plain and natural, with a mild English accent. He speaks slowly and thoughtfully. Never bright, cheerful, hurried or theatrical."
  - Obstinate and Pliable use the storyteller's voice for now.
- The owner had designed a storyteller voice of their own in Google's Playground, but it belongs to a different Google project, so the key could not reach it; the storyteller above was made from the same description instead. **If the owner prefers their own:** make it again in the "pilgrims progress" project, send the ID, put it in `tools/make-voice.py` and run `--redo N` (and O, PL).
- **`tools/make-voice.py`** records each line into `assets/voice/` (one small MP3 per line, 25 lines, 650 KB), checks the words by transcription, and keeps the folder trim. `story-lab.html` plays the recording with each line; the voice button in the strip turns it off. The phone's robot voice is gone.
- **Nobody has listened to the finished lines in the game yet** (the words were checked by machine, the sound was not): the owner's ear decides. Samples of the three voices were sent in chat.
- The owner pasted the API key in chat; advised to delete it in AI Studio and make a new one when the voices are settled. It is not in the repo.

## Built Nov 15, 2026 (build 28)
- Owner: "make rain sound slightly quieter". Rain loudness is now one number, `RAIN_VOL` in `story-lab.html` (.05 to .032, about a third quieter).

## Built Nov 15, 2026 (build 29)
- Owner: "sometimes we accidentally skip to the next speech, how do we go back (or is this prevented)?" Chosen: prevent it. A tap does nothing until the line has been spoken; "tap ▸" only appears then. Lines heard once can be skipped on a second walk. No back button (it would add a control on the scene). If the owner wants more: a "say it again" tap on the speaker's name, or lines moving on by themselves like a film.

## Built Nov 15, 2026 (build 30)
- Owner: "can I get some opening music before I start game". The title now asks for one touch ("Open the book"), because a browser may not make sound before a touch; then quiet music plays (the hymn's chords like a slow harp, the first half of the tune above like a music box) with the rain, and "Begin" appears. Made in the browser, no sound file. Not heard by me: the owner's ear decides.
- Owner noticed the main game and the story lab are "out of sync". Asked the owner to confirm the other chats are finished before the story walk replaces `index.html` (see build 25's "Next").

## Built Nov 15, 2026 (build 31)
- Owner: "I think Amazing Grace should be discovered; let's open up with something else, very subtle." The title's music is now only single soft notes, far apart, at random (no tune), over the rain and hum. **Rule: don't play the hymn anywhere before the lights sing it on the road.**

## Built Nov 15, 2026 (build 32)
- Owner: "make them go into the gate, not next to it". Christian and then Pliable now walk into the open archway and fade into the golden light (a little smaller and higher as they go), and the end card follows. Before, they walked across in front of the gate and on along the road.
- Owner asked what I think of the level. Said in chat: the look, the gate and the choice are strong; the middle (Evangelist to the neighbours) is thin; Obstinate and Pliable need their own voices; the burden is told but not felt. **Suggested next: a moment in the middle where his family calls from a lit doorway and the child keeps walking** (from the book: he ran on, crying "Life! Life!"). Waiting for the owner's view.

## Built Nov 15, 2026 (build 33): the family at the door, own voices, the burden heard
- Owner said yes to all three suggestions, and "Pliable should have a boyish voice".
- **The family moment** (middle of the level, after the mud): Christian's own house stands at the back of the road. Its door opens as he passes; his wife and two children stand in the light and call him back. He answers "I cannot stay. I must find the way, for all of us." Then, while she calls "Christian! Come back!", **the child must hold to walk on**, slowly and heavily. Then "Life! Life! Eternal life!" and "He did not look back." The third phrase of the tune and the "people watched" words moved a little further on to make room; one lamp was removed there.
- **New voices**, designed from these descriptions:
  - Obstinate: "A stout, stubborn English countryman in his fifties. A gruff, blunt, loud voice of low-middle pitch, sure of himself and impatient, a little scornful, like a neighbour who thinks the whole idea is foolish. A plain rural English accent. Firm and hard-headed, but an ordinary man, never a villain; never cartoonish."
  - Pliable: "A boyish young English man of about eighteen. A light, bright, eager voice of higher pitch, quick to be excited and easily led, friendly and a little breathless. A plain English accent. Sounds young and hopeful, not childish, never cartoonish."
  - His wife: "A gentle English woman in her thirties, a wife and mother. A warm, soft voice of middle pitch, worried and pleading, calling after someone she loves. Tender and sad, never shrill, never angry, never theatrical. A plain English accent."
- **The burden can be heard:** every footstep has a low creak of the pack and a heavier tread, easing as he gathers light (never gone), heaviest as he walks away from his door.
- The family in the doorway are simple code-drawn shapes. The owner prefers painted people, so offer to swap in a watercolour picture (a woman and two children in a doorway, seen from the side, blank faces) if they want one.
- Tested in a headless browser: the scene plays, the act works with a held finger, no errors. Not heard by me.

## Built Nov 15, 2026 (build 34): painted family, a designed house, standing neighbours
- Owner: use Google's image model for the wife and children and to design the house; and "it would be nice if the other characters stood while talking (instead of freezing in walking state)".
- All four pictures made with `gemini-3-pro-image` and the owner's key. The shared style text: "Painted in exactly the same style as the reference figures: a soft monochrome grey watercolour wash with loose darker brush lines, on a pure white background, full body from head to feet, seen from the side. Faces stay blank: no eyes, no mouth, no facial features, just a soft plain wash. Clothes are timeless, worn, handmade, layered cloth (shawls, wraps, hoods, long skirts, sashes) that would suit the 1600s and a ruined far future alike; no lace, buttons, buckles, zips or gadgets. No ground, no shadow, no background, no text, no border."
  - **Family** (reference: a sheet of the five characters): "A mother and her two young children standing close together, as if in the doorway of their home, all turned toward the right and looking after someone who is walking away. The mother, in her thirties, wears a long skirt, an apron and a shawl over her head and shoulders; she reaches one arm out toward the right, pleading. A boy of about eight stands in front of her holding on to her skirt. A smaller girl of about five stands at her other side, one small hand raised. They are sad and gentle, not frightened. The three figures overlap as one group, feet on the same level." + style.
  - **House** (no reference): "A flat, solid black silhouette of the front of an old cottage seen straight on, on a pure white background. A timber-and-stone house with a steep gabled roof, a slightly sagging ridge, a leaning chimney and a small lean-to shed on the left side. ONE tall plain doorway in the lower middle of the wall, reaching down to the ground, and three small windows (two upstairs, one beside the door). The doorway and the windows are pure white holes cut cleanly out of the black shape. Weathered, handmade and timeless: it could be the 1600s or a ruined far future. Only pure black and pure white: no outlines, no grey, no texture, no shading, no ground, no plants, no text. The bottom edge of the house is one straight flat horizontal line. The house fills most of the picture." Then: black to a see-through stencil, the ground bar cut off, sized so the doorway is 146 units tall, holes measured into `HOUSE_META`.
  - **Obstinate standing** (reference: his walk frame 23): "This is one frame of a man walking. Paint the SAME man, in the same clothes (wide hat, scarf, heavy coat tied with a rope, baggy trousers, wrapped boots), the same size and the same painting style, now STANDING STILL, facing right: feet planted side by side, both fists on his hips, chest out, stubborn and sure of himself, as if arguing." + style.
  - **Pliable standing** (reference: his walk frame 0): "... the SAME young man, in the same clothes (short cloak, scarf, tunic with a satchel, baggy trousers, wrapped shoes) ... now STANDING STILL, facing right: feet side by side, standing upright and relaxed, arms loosely at his sides, listening eagerly." + style.
- In the game: the code-drawn house and stick family are gone. The neighbours now stand while they talk (Obstinate with fists on hips), and Pliable stands whenever Christian stops. Christian stops a step past his door so the family can be seen.
- Tested in a headless browser with screenshots: the whole level plays, no errors. The dissolve between walking and standing was only seen in stills; the owner should watch it move.

## Built Nov 15, 2026 (build 35): the book's order, the run, watercolour road, taller houses
- Owner asked for the book's order of events, then "do all the other changes too": house before the mud, Christian running with his ears plugged as he leaves his house, the house as a watercolour, wagon and barrel as watercolours, the first row of houses closer and taller ("you can raise second layer of houses so it's still visible"), props flatter.
- **Order now follows the book** (see `CLAUDE.md`). The mud is gone from this level (it is the Slough, next level). Layout: Evangelist 1150, house door 2250, run to 3500, third phrase of the tune from 3600, neighbours triggered at 4250, fourth phrase from 4700, gate 5236. 35 lights (the three low mud notes went).
- **The run:** start picture painted by the image model from his walk frame ("...now RUNNING to the right in the middle of a stride: leaning forward, one leg reaching ahead and one pushing off behind, and BOTH hands raised to his head with a finger pressed into each ear, elbows out..."), placed small on a white 1280 x 720 picture, then animated by the video model: "Animate this watercolour painting as a video about 8 seconds long. The hooded man with the huge sack on his back RUNS steadily to the right, a heavy but determined run, keeping a finger pressed into each ear the whole time with his elbows out. Seen exactly from the side. The camera moves along with him and does NOT zoom: he stays in the centre of the frame at exactly the size he is in the picture, small in the frame, with his WHOLE body always visible ... He runs on the spot in the frame. Even, regular strides at a steady pace, so the run can loop. Keep the picture's style exactly ... Silent." Measured: camera steady (torso within 11 px), one cycle = 24 frames, the foot goes back 28.7 px a frame; loop = video frames 39 to 62, scaled by 288/455, grey matched to the walk.
- **Watercolour things** (image model, style reference = the sheet of characters, "completely FLAT elevation, like a piece of stage scenery or a paper cut-out seen square-on at eye level: no perspective at all, no top surfaces visible, no side faces visible"): house, cart, barrel, crates; wall and lamp post from the first batch. The stall's table still showed its top, so the stall is left out for now.
- **Sound:** with his fingers in his ears the rain and his wife's voice go muffled; the lights and his own cry stay clear.
- **Not done, because the owner's Google credit ran out mid-build:** (1) a flatter market stall; (2) the recording of "The burden was heavy. He could not run for long." (the game shows that line only once the recording exists; `python3 tools/make-voice.py` will record it). Both are a few cents once the credit is topped up.
- Owner asked "does his face look funny in the game?": checked close up; walking and running his face is only a dark shadow inside the hood, the same in both.
- Tested in a headless browser with screenshots: whole level plays, both pictures of the run dissolve in and out; no errors. The run was only seen in stills.

## Built Nov 15, 2026 (build 36): quieter things
- Owner: "I think the items were better not as watercolor, distracts a bit ... mostly opaque and not nearly as much details as characters (and maybe house)". Agreed and done with no new pictures: the things on the road keep their hand-drawn outlines but are one solid tone with a fifth of the drawing showing (`PROP_DETAIL`); the house shows two thirds of its painting (`HOUSE_DETAIL`); people stay full watercolour.
- Still waiting on the owner's Google credit: a flatter market stall (left out), and the recording of "The burden was heavy. He could not run for long."

## Built Nov 15, 2026 (build 37): the run re-made, the stall back, the last line recorded
- Owner: "why is his face black as he runs away, doesn't seem right". Cause: the first run video turned his head toward the camera and filled the hood with black shadow (his walk is side-on, so the hood hides his face). I had wrongly said it looked fine. Owner topped up the Google credit.
- **Run re-made** from a new start picture: "...now RUNNING to the right in the middle of a stride, still seen EXACTLY FROM THE SIDE in strict profile like the reference ... His head is in profile facing right, with the hood pulled forward exactly as in the reference, so the hood hides his face: we see only the side of the hood, painted in the same pale grey wash as the rest of the cloak. There is NO dark opening, NO black shadow and NO face anywhere on the hood. Both hands are raised to the sides of his head, pressed flat over his ears on the outside of the hood, elbows out..." and a video prompt adding "his head stays in strict profile facing right and never turns toward the camera. The hood ... stays the same pale grey wash as in the picture: no dark opening, no black shadow, no face ever appears." Loop = video frames 67 to 90.
- **`tools/video-frames.py`** now holds the video-to-frames recipe (find the loop, cut out, grey, scale, pack, print META).
- **Stall back** with its table drawn edge-on ("the table is drawn ONLY as its front edge: one single thick horizontal plank line, with NO table-top surface visible at all"). **"The burden was heavy. He could not run for long." recorded.**
- Spent this build: 2 pictures, 1 video, 1 voice line (about a dollar).

## Built Nov 15, 2026 (build 38): the run's face, third time
- Owner on build 37's run: "his face looks like a blank instead of nondescript (like his nose shows in original)". Close-ups confirmed it: the walk shows his profile in the hood (nose, lips, chin in grey wash); my "hide the face" prompt had produced an empty wedge.
- Start picture re-painted with: "Look closely at his head: inside the hood we see his face in side profile, facing right: forehead, a clear nose, lips and bearded chin, painted simply in a mid-grey wash, with no eye detail. Paint the SAME man, with exactly that same head and the same profile face showing inside the hood (the nose and chin must be clearly visible in profile, facing right, in the same mid-grey wash: not hidden, not blank, not black) ... His near hand is raised and pressed flat over his ear, on the side of the hood BEHIND his face (the hand must not cover his face or his nose)". Video prompt adds: "His face stays just as it is in the picture: a simple side profile inside the hood, with his nose and bearded chin showing ... it never turns black, never disappears, and his hands never cover it."
- New loop: 29 frames (video frames 70 to 98), `vpx` 17.2, feet come down at frames 7 and 22. Spent: 1 picture, 1 video (about 70 cents).

## Built Nov 15, 2026 (build 39)
- Owner sent a screenshot of the dark blobs at the top of the screen: "what's this at the top?" They were the leafy boughs of the framing layer, which did not read as leaves. Removed from `story-lab.html` (the grass along the bottom stays). `index.html` still has them; they go when the story lab replaces it.

## Built Nov 15, 2026 (build 40): depth on one rule, a low cottage, a wet road
- Owner: "(1) make light dots stay close to head when he runs; (2) make Pliable stay disappeared after he goes thru gate; (3) need foreground items (between viewer and Christian) to build depth, maybe at least two levels ... House is big. I wonder if we should put wife and kids at an intermediate level? What about one more level between Christian and first row of houses; (4) I don't think there should be more than one special item in frame at same time". Then: "enter to skip dialogue", "remove speaker in bottom right", and, on seeing my first try, "it might be worth drawing some perspective lines to get the layers right (it is off by quite a bit right now) ... also puddles look off (love that his steps look like they are hitting water with the circles coming out from them)".
- First try placed the new levels by eye (too big, too low). Rebuilt on one rule: horizon 140 above the road; size = sliding speed = p; ground line = horizon + 140 p. Guides with `?lines`.
- New low cottage picture (15 cents): "The front of a small, LOW, one-storey cottage: a long low wall of rough stone and timber that is only a little taller than its doorway, and above it a low, shaggy thatched roof about as tall as the wall itself, with a short stubby chimney near one end ... ONE plain doorway in the middle ... two small square window openings, one on each side of the door. The doorway and the two window openings are left as pure blank white paper ..." + the flat-elevation style text.
- Pliable's bug: at the instant the level ended, his target changed and a negative step moved him back 48 px, half visible in the gateway.
- Tested in a headless browser: whole level plays, 35 lights, no errors; pictures looked at with the guides on. Not seen moving.

## Open questions for the owner
0. **Story lab (build 25):** is this the right shape for the game? How does it sound? Is "Go home" a good choice to offer? Should it replace the game now?
1. How does the game feel on the phone: smooth? Anything hard to see (dark Christian against dark houses, crates, barrels)?
2. New sprites: when they arrive, which poses, and are Evangelist / Obstinate / Pliable included?
3. Weather across the whole level (rain in the city, gold at the gate): right, or should every screen show both?
4. Are lit windows welcome (a second colour inside a layer)?
5. Leafy boughs and tall grass in front: keep, or in the way?

## Next steps
- **First: see build 25 above** (the story walk). The three older steps below were written before the characters became videos and before the story walk.
- Swap in the owner's new sprites (cut each pose out, add to `SPR_SRC`, keep feet on the bottom edge; `loadSprites` makes the silhouettes).
- Replace the code-drawn Evangelist, Obstinate and Pliable with sprites if the owner makes them.
- Then Level 2: the Slough of Despond.

## Built Nov 14, 2026 (build 21): year 2200 concept pictures
- Owner: "thinking of a post apocalyptic version like in year 2200 and updating the landscape to match", then "can you give concept art for me to choose from".
- New page **`concept-2200.html`** (live at `/concept-2200.html`): four directions in the game's own layered style, each with "Another version", "Walk along" and the rain/gold slider. A Fallen towers, B Rust and ash, C The green return, D Glass age. Details in `CLAUDE.md`.
- **Next: the owner picks one (or a mix)**; then move it into `style-lab.html` properly, then the game (`buildScenery()`), and restyle the things on the road (drums, tyres, dead car, bus-shelter roof, patched gate).
- Game and other labs unchanged apart from the build stamp.

## Loose ends
- No `assets/` folder is in the repo (images are only base64 inside `index.html`). Upload it if the originals should be kept here.
- `README.md` is only a title.
