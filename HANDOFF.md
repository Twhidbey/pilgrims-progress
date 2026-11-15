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
