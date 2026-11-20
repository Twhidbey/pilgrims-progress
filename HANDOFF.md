# Pilgrim's Progress: handoff (read this first in a new chat)

The game is `index.html` (Level 1 in the page, Level 2 in `slough.js`; no build step; until build 118 it was called `story-lab.html`: read that name below as `index.html`). `style-lab.html` is the art-style test page. `CLAUDE.md` maps the code and records the owner's decisions. Work on **`main`** and push after every change: pushing IS publishing (GitHub Pages, https://twhidbey.github.io/pilgrims-progress/). Bump the build stamp in both pages on every push and tell the owner when it is live (a phone may need `?v=N` on the link). Keep this file and `CLAUDE.md` updated. Public repo: no personal details.

## START HERE (rewritten at build 140, Nov 16 2026)

**Characters chat (after build 364, no game change): THE MANNEQUIN, a lab, rebuilt from first principles on the owner's word.** A skeleton that walks by the animators' and the gait laboratories' rules, cloth that hangs, is pushed by the legs and swings back late, and Christian's clothes drawn as simple shapes on the joints; nothing traced from his frames, nothing stretched (`mannequin.js`, `mannequin.html`, `tools/mannequin/`; see CLAUDE.md, "The mannequin"). The owner: "walk looks pretty good"; second pass of the look done on their word (a body by the art schools' proportions with a real side profile, clothes lying on it, dark quiet silhouettes); then "skeleton looks great" and a third pass on their word: a shoulder line and a hip line that turn against each other, arms that swing as a chain with real hands, the head tipping as measured in his old walk, feet with heel, arch, ball and toes at the true ankle height, and the clothes refitted as a monk's habit (wide sleeves, a knotted cord, a hood with its shoulder cape, the sack bound high); then a fourth pass on their word ("the original has more swagger and rocking", "deep dive into animation principles"): the feel of his old walk MEASURED off its outlines (`tools/mannequin/signature.js`) and rebuilt from its causes (the torso's rock, a once-a-stride roll, straight legs that vault, a back panel hung from the shoulders), elbows that flex, the foot's arch as a spring, a larger head with a real profile, a deep cowl whose cape ends on the shoulder; then a fifth and sixth pass on their word: the hood now starts above his eyes and follows his head, the head bowed (a tall hood from a misread tracing of his old frames was turned down, "awful": the long upright line at the front of his old head is his FACE, not the hood; Zurbaran's Capuchin cone was turned down too), his face a quiet profile like the painted one, the robe flared toward its hem, soft boots that bend at the ball and keep the shape of a foot (the painted frames' long upturned toe was tried and turned down: "clown like"), the lower leg as wide as in his painted frames; the hood standing off the back of his head a tad with a small beak over the brow ("Hoods look better"); the lab page now has SLIDERS for every key measure of him (53, in nine parts: hood, face, shoes, lower legs, build, robe, sleeves, burden, walk): the owner is choosing; when they send lines like `hood=8,0,3.6,0,9,0,0,0,1,0.27` or a link, put those numbers into the defaults at the top of `mannequin.js` (see CLAUDE.md, "HIS MEASURES AS SLIDERS"). Their choices so far (hood, face, shoes, lower legs, build, robe, sleeves, burden, and the walk too: since the seventh link his arms hardly swing and his torso rocks a little) are in as his defaults. The burden is now in two tiers (a bundle tied on top of the sack, with its own sliders). The hood now stops ON HIS TRAPS, a collar round the base of his neck, well before the shoulder (the owner: "have hood not go over shoulder", then "Hood should stop at his traps well before shoulders"; `cape` below 0, -12 = at the neck's base), its other measures from the owner's third and fourth links (its front comes down onto his chest, `bib` 21, on the owner's word "move down front to chest"; the near shoulder and arm are drawn over the hood, so the shoulder stays clear), and its tip above the forehead has five sliders of its own (sharp, hook, thick, sweep, cut). The hood's outline can also be SHAPED BY HAND in the lab (the owner: "Maybe draggable Bézier curves"): 22 draggable points on its edge, kept as offsets in `MQ.HAND.hood` and carried in the link as `hand=...`; when the owner sends such a link, put the offsets into `HAND.hood` at the top of `mannequin.js` (their first such shape is in). His near shoulder is now drawn as part of his body (a yoke from the neck, the robe's tone at the shoulder), not as a round cap on the arm (the owner: "rotates like a separate piece"). Then, on the owner's word: the pack sits back a little (`sack.back`, a slider), the bundle on top can be dragged by hand like the hood (`MQ.HAND.top`), five more face sliders (59 sliders in all), and the strap goes over his shoulder and in under his arm instead of showing on both sides of it. Arms a little shorter (.98, the fourth link). The lab page now updates itself and shows its number at the top (`const LAB` in `mannequin.html`, currently 24: bump it on every lab push and give the link with `?v=N`). The bundle on top has the owner's own dragged shape, and its cords, underside and shadow now follow that shape. A ninth link is in as his defaults (his face's five new measures, longer legs, `lean` 0 so he walks upright, a quieter walk), and his hands were drawn again on the owner's word ("make hands look more normal"): longer, narrower, a thumb in front, four fingers that curl back toward the palm instead of forward, with five sliders of their own (`hands=` in the link). Then his CAPE, on the owner's word and after his painted frames ("see how it looks on original sprite?"): one long band over the near shoulder, showing between his arm and the pack, hanging below the pack to a point behind, with five sliders (`cape=`; 69 sliders in all); it took the place of the old back panel. The owner allowed up to $5 for motion videos: nothing spent (running total for this job: $0).

**Build 362 (Level 4 videos chat): every frame pack checked; the gaps between Christian's legs (walk, turn, kneel, run) no longer filled in, and in Levels 2 and 3 no fill between Evangelist's boots or staff and robe, nor between Help's, Pliable's and Wiseman's legs. `tools/pack-check.py` added. Open: a white patch on the first frame of `?level=3&at=evangelist` (skip link only). Nothing spent.**

**Build 361 (Level 4 videos chat): Level 2's lift no longer has a grey or dark block between Help and Christian (the gap between the two men was being filled, in the pack and again by `solidOf`). Nothing spent.**

**Level 4 videos chat (after build 360, no game change): `tools/clip-cut.py`, one command from a free clip to a clean looping sheet with its META and two check pictures (see CLAUDE.md, Files, tools). Tried on the three past clips: matches the hand cuts. Next, on the owner's word: three free clips from the new dark paintings (the Interpreter's hand, both walks; about one day's free allowance), cut with this tool. Nothing spent.**

**The keepsakes have their own chat now** ("Pilgrim's Progress: the keepsakes (Bible, roll, title book)", https://claude.ai/code/session_017HrTSDUqJDSdrXPbhc33zT). Open question there: the wax seal on Evangelist's roll is ours, not the book's (`{14}` has no seal; the sealed roll is given at the Cross, `{94}`): take it off and keep `waxSeal()` for Level 5, or keep it as a departure.

**Build 356 (Level 3 art chat): the falling stones drop out of sight behind the blue path. Nothing spent.**

**Build 355 (Level 3 art chat): Evangelist trimmed (no pale fringe or paper by the staff) and no double picture as he arrives. Nothing spent.**

**Build 354 (Level 3 art chat): the stones that fall on the path land on the ground, not in the air. Nothing spent.**

**Build 340 (Level 3 art chat): the straight gravel way wider than the turning. Nothing spent.**

**Build 338 (Level 3 art chat): the straight gravel way wanders gently. Nothing spent.**

**Build 336 (Level 3 art chat): the gravel way forks: straight on along the road, or up and over the brow. Nothing spent.**

**Build 334 (Level 3 art chat): a gravel track from the oak over the brow, the way he turns aside. Nothing spent.**

**Build 329 (Level 3 art chat): the shadows toward us on the plain a little longer, fading gently. Nothing spent.**

**Build 327 (Level 3 art chat): the brow the same road surface as the road (no paler body), and only the shadow toward us under the figures on the plain. Nothing spent.**

**Build 323 (Level 3 art chat): the brow over which he leaves the plain is the road bent up, no seam at its foot, one path over it. Nothing spent.**

**Build 321 (Level 3 art chat): the camera moves to the village and hill only at "Do you see that hill?", not when the village is named. Nothing spent.**

**Build 319 (Level 2 chat):** owner: "still looks pixelated because of how it acts with the strips of mud". The wet shadow's own edges (the squashed outline) lined up with the thin mud strips and read as steps; it is now blurred smoothly in stages (painted at a third across and two thirds down, then down to a quarter and back up through a half, each step bilinear: `SHB`) into one soft darkening with no edges, laid at .5 (was .62). Nothing spent.

**Build 317 (Level 2 chat):** owner: "the shadow now looks kinda pixelized". The wet shadow under the figures (and the home bank) was painted at a sixth of the size both ways, so the squashed figure was a few rows tall and stepped when stretched; now a sixth across (soft) but two thirds down (`KX` 6, `KY` 1.5). Before and after stills of builds 305, 310 and this one were sent. Nothing spent.

**Build 314 (Level 3 art chat): among the rocks, a low bank of mist along the crags behind the path instead of a glow round the figures. Nothing spent.**

**Build 310 (Level 2 chat):** owner: "mud still acts little water - needs more viscosity". In mud (by `wetAt`; open water unchanged): a ring is one slow, thick, dull swell that eases to a stop close to where it began (no second ring, hardly any sheen); the surface swell travels half as fast, is damped more and settles more slowly (`fStep`); drops fewer again (60% skipped), lower and slower, and they leave rings only where there is water. Stills cannot show motion: the owner's eyes decide. Nothing spent.

**Build 363 (cover chat): the cover's pilgrim in the near ground's own brown, one tone with the land he walks on; icons to match. Nothing spent.**

**Build 360 (cover chat): the cover's two front hills made long and gradual (a soft swell behind, gently rising ground in front that the pilgrim climbs); icons to match. Nothing spent.**

**Build 359 (cover chat): the cover's pilgrim is now Christian's own traced outline (from his walk), not a drawn shape; icons to match. Nothing spent.**

**Build 358 (cover chat): a tiny pilgrim with his burden on the cover's nearest hill, walking toward the light; the board cleaner and warmer; the app icons remade to match. Nothing spent.**

**Build 357 (cover chat): the app icons (game and editor) now show the painted cover; the book fades in only once its cover is painted, so no plain brown board flashes first. Old Home Screen icons must be deleted and added again. Nothing spent.**

**Build 330: no "tap ▸" under the words any more (lines move on by themselves; a tap still skips sooner). Nothing spent.**

**Build 322: the auto-walk switch is a button beside the pause button (gold when on), no longer on the contents page. Nothing spent.**

**Build 309: auto-walk switch for every level** ("Let him walk on by himself" on the contents page, and in the pause menu; `pp-auto`; `autoHeld()` in `index.html`). Nothing spent.

**After build 347 (Level 3 smoke chat): a crisp, dark, single cauliflower column after real eruption photographs was built on the branch `smoke-column` and shown to the owner, who prefers the smoke as it is (build 347). Not merged; see CLAUDE.md, "TRIED AFTER BUILD 347 AND NOT KEPT". Nothing spent.**

**Build 346 (Level 3 art chat): the four plumes now merge into one continuous mass that spreads under the cloud (after a photograph of Mount St Helens, 1980), with softer, larger billows. Nothing spent.**

**Build 343 (Level 3 art chat): the storm cloud has its own rolling masses lit from below; the plumes' tops softer and no longer reaching too high. Nothing spent.**

**Build 342 (Level 3 art chat): more detail and a little colour where the plumes meet the cloud. Nothing spent.**

**Build 339 (Level 3 art chat): plume detail reaches higher; the plumes light up warm near a lightning strike, like the cloud's underside. Nothing spent.**

**Build 335 (Level 3 art chat): plume edges now a soft blur (gaussian), not wisps; most on the far-left plume. Nothing spent.**

**Build 332 (Level 3 art chat): the far-left plume's edges more diffuse. Nothing spent.**

**Build 328 (Level 3 art chat): a fourth plume from the left shoulder. Nothing spent.**

**Build 326 (Level 3 art chat): softer plume edges, a third plume from the right shoulder, the oak hidden in the wide shot. Nothing spent.**

**Build 325 (Level 3 art chat): stones and two boulders fall (with jolts) as he walks to the mountain; the rocks no longer slide in the pull back; the mist kept off the mountain; the near rocks steadier. Nothing spent.**

**Build 318 (Level 3 art chat): no ghost roots below the oak's fade; a new picture rule in CLAUDE.md: look at every seam enlarged, fades end fully clear, no straight blend lines. Nothing spent.**

**Build 316 (Level 3 art chat): the oak roots' fade wanders along the foot instead of a straight line. Nothing spent.**

**Build 313 (Level 3 art chat): build 311's root fade and earth swell made much subtler (they read as a dark smudge in the opening). Nothing spent.**

**Build 311 (Level 3 art chat): the oak's roots fade into the road's earth with a soft swell of ground round its foot; the brow shaded from olive into the road with a soft edge. Nothing spent.**

**Build 308 (Level 3 art chat): the billows narrower, softer, more wispy. Nothing spent.**

**Build 306 (Level 3 art chat): shadows toward us on the plain; only cloud-to-mountain lightning; billows wider and flatter. Nothing spent.**

**Build 304 (Level 3 art chat): the glow round Christian and Wiseman a little less. Nothing spent.**

**Build 301 (Level 3 art chat): the big rock on the left back behind the village; rocks over the village's left corner. Nothing spent.**

**Build 300 (Level 3 art chat): three rows of rock round the village, more varied, rising into the mountain's foot. Nothing spent.**

**Build 297 (Level 3 art chat): rocky ground round the village (a small spur of the mountain behind it, low rocks across its foot). Nothing spent.**

**Build 352 (Level 4 chat): in the parlour Christian moved right onto the floorboards, the Interpreter beside him. Nothing spent.**

**Build 353 (Level 4 chat): in the parlour the Interpreter moved a little left, clear of the basket. Nothing spent.**

**Build 364 (Level 4 chat): the parlour's sweeper and girl move, from two free clips. The girl first stands holding her jug upright (the water stream painted out: `room2-dry.webp`, was `room2.webp`); at the broom touch he sweeps (two whole strokes, a loop); at the jug touch she tips the jug and pours (her clip played backwards), then holds it upright again, and he sweeps once more with no dust (the book: "it was swept and cleansed with pleasure"). Only the moving parts of each clip are laid over the painting, colour-matched, soft-edged. THE CLIPS: the daily scheduled task's run of 18 Nov made six clips and lost them (its session had no write access to the repository, so the push was refused). Its prompt now attaches the repository with write access first and stops if it cannot; on 19 Nov the owner's Level 4 chat ran the batch itself (seven clips: the two parlour clips, the Interpreter's hand from his new painting, Good-will's pull, room 7, the brave man striding, room 4; checks in `clips/queue.json`). Nothing spent.**

**Build 351 (Level 4 chat): Christian and the Interpreter painted again for the house, dark and quiet (lighter in the bright parlour); the Interpreter's hand movement off until a new free clip is made from the new picture. Spent about 15 cents.**

**Build 350 (Level 4 chat): in the parlour both men's feet now stand on the floorboards. Nothing spent.**

**Build 349 (Level 4 chat): in the parlour Christian and the Interpreter both stand by the window. Nothing spent.**

**Build 348 (Level 4 chat): the parlour back to its original picture, Christian and the Interpreter standing inside the room as before (the widened-picture tries of builds 338 to 347 taken back). Nothing spent.**

**Build 347 (Level 4 chat): the parlour's window wall carried up its full height (no inner corner), and its edges now fall away into shadow instead of a crop. Nothing spent.**

**Build 345 (Level 4 chat): the parlour back to its old framing, with only a small piece of the new wall and floor at the bottom left for the two to stand on. Nothing spent.**

**Build 344 (Level 4 chat): the parlour painted wider by the image model (side walls coming toward us, a front floor); shown cut to the old painting's shape with the new floor open at the bottom left, where Christian and the Interpreter now stand. Spent about 13 cents.**

**Build 341 (Level 4 chat): the parlour and the boys' room back at the framed size; their floor now carries on out into the dark frame, and Christian stands on it. Nothing spent.**

**Build 337 (Level 4 chat): the parlour and Passion and Patience's room shown larger again, Christian and the Interpreter standing on their floors inside the painting. Nothing spent.**

**Build 333 (Level 4 chat): the house's visitors straddle the painting's edge instead of standing out in the black, the part outside falling into shadow, with a faint floor under their feet. Nothing spent.**

**Build 331 (Level 4 chat): the house's rooms shown smaller in a dark frame; Christian and the Interpreter moved out of the way, into or over the frame where the room allows (the parlour: Christian behind the Interpreter, in the frame). Nothing spent.**

**Build 324 (Level 4 chat): Christian's passage walk re-cut as a whole stride (it was half a stride, so his legs swapped at each repeat); the white wedge under the Interpreter's beard taken out. Nothing spent.**

**Build 320 (Level 4 chat): the Interpreter's walk in the passage re-cut as a clean loop with his head up (it snapped from raised to bowed each loop), at his video's full pace. Nothing spent.**

**Build 315 (Level 4 chat): the storyteller reads the seven passage verses. Spent about 7 cents (voices).**

**Build 312 (Level 4 chat): the dark passages between rooms go with one touch, a little shorter, each with a quiet King James verse (mostly Bunyan's own margin references). Nothing spent.**

**Build 307 (Level 4 chat): Christian and the Interpreter in the house upscaled (free, Real-ESRGAN on the CPU) to match the painted rooms' sharpness. Nothing spent.**

**Build 302 (Level 4 chat): no code breathing or voice sway on the figures in the Interpreter's House (owner disliked it). Nothing spent.**

**Build 295 (Level 3 art chat): the far mountain's outline as crisp as the village (its far copy made at full size), a soft breath of mist where they meet. Nothing spent.**

**Build 292 (Level 3 art chat): the village lower, melting into the mist at its foot, its ground edges softened, faint lanes running out of it. Nothing spent.**

**Build 290 (Level 3 art chat): the village is now the free model's picture (seen a little from above, no trees), its hard ground edges blended into the field, peeking out small from behind the mountain. Nothing spent.**

**Build 289 (room 3 chat): the Interpreter's lips and beard no longer cut away; rooms 1 and 3's children now child-sized beside the men; a talking clip queued for the free daily run. Nothing spent. See `CLAUDE.md`, "Build 289".**

**Build 286 (Level 3 art chat): a softer glow on the figures; the village smaller and peeking out from behind the mountain's left side (a new tree-less picture still to make). A free image model found: FLUX.1 Kontext on Hugging Face (see CLAUDE.md, build 286). Nothing spent.**

**Build 305 (Level 2 chat):** owner: "decrease the drips a little or make them more mud like (it looks like water now)". All drops go through `drop()` in `slough.js`: about half as many (45% skipped), thrown at .7 of the speed, 1.7 times thicker, stronger pull back down (`MUD_G` .27, was .21), drawn as short round globs (a third of the old streak), and fewer, smaller rings where they land. Nothing spent.

**Build 303 (Level 2 chat):** owner on build 299: "back up, instead of thickening strips can you just make more to cover white strips (the up and down of new one is too much)". The near mud's patches are back to build 298's gentle height (3 + .14 j); there are twice as many rows (37) with shorter gaps (`gk` .6), so they cover the white between them. Nothing spent.

**Build 299 (Level 2 chat):** owner on build 298: "look great! and little less stripy in the front (waves cohesively grey)". The near mud has fewer, taller, overlapping rows and shorter gaps (`lay(..., gk)`; 13 rows, height 6 + .3 j), so it is one wavy grey mass with a pool now and then, still opening into water toward the far bank. Nothing spent.

**Build 298 (Level 2 chat): the mud is one style, near and far: the wavy patches.** Owner on build 296 (far mud baked from the near mud's recipe): "no that looks bad i think we need to get mud from beyond in front not the other way around. it just needs to coalesce more on the left than the right". `FARC` is gone; the far mud is build 293's wavy patches again (`FARMUD`), and the near mud's map (`mudMap`, which hides the mirror) is now drawn from the same patches (`lay`, `wavy` in `slough.js`): rows of long flat shapes with wavy tops and bottoms, taller the nearer they are; by the home bank they are long and close and run together into one mass with slits of water, going right they shorten and part. The dark rims of the old noise pools (`mudDk`) are no longer drawn; the dull sheen (`mudLt`) still is. The level starts a little faster (about 2.1 s in the test browser). Nothing spent.

**Build 296 (Level 2 chat): the mud behind them is the near mud's own recipe.** Owner: "still doesn't match ... I like the blotchiness of the near mud though i don't like the pixelized edge ... I like the wavy of the far mud but it seems less cohesive". The hand-drawn far patches (`FARMUD`) are gone; `FARC` is baked once from the near mud's recipe (`poolN` against `poolT`, dark rims, wetter patches, sheen), stretched with distance (finer across and much finer in depth, so pools become long thin wavy slits), hazed, faded out past each bank, and drawn row by row after the far mist with nearer rows sliding more (`FAR_U0`, `FAR_W`, `FAR_K`, `FAR_R`). The near mud's edge threshold is softer (±.06, was ±.032) against the pixel steps. Baking the near maps at twice the detail was tried and dropped (about 8 s to start the level in the test browser, against 2.5 s; now 2.8 s). Nothing spent.

**Build 294 (Level 2 chat):** owner on build 293: "yes that's what i meant!! but make mud beyond match the style of the mud closer (or better yet mix styles - because i like the wavy look of mud beyond)". The far patches (`FARMUD`) keep their wavy shapes but are painted like the near mud: its grey, a dark wet rim along each edge (strongest on the near edge), broad wetter patches inside, small ragged pale pools in the bigger ones, a thin dull sheen on some; drawn after the far mist, with their own haze by distance. Nothing spent.

**Build 293 (Level 2 chat): the bog runs back BEHIND the figures.** Owner, twice: not heaps by the figures (287) and not a band at the back of the near water (291, undone here): "into picture on the other side of christian from the view into the screen ... if we have perspective right the mud should be over there". Between the horizon and the surface line, behind Christian and Pliable, 14 rows of long flat mud patches with wavy tops and bottoms (`FARMUD`, laid once in `build()`, drawn before the far mist): nearer rows taller, darker and sliding more with the camera, further ones thin and pale into the mist; more mud by the home bank, more open water toward the far bank (`wetAt`). Nothing spent.

**Build 291 (Level 2 chat):** the owner did not like build 287's mud heaps behind the sunk figures ("not what i meant"); taken out. What was meant: the grey mud should run along the FAR side of the pond too, its edge going back and forth like the near pools' edges. A band of mud now lies along the back of the pond up to the far bank (`farD(x)`, `poolRaw` in `slough.js`; the mud map, its dark rims and the mirror all follow it). Nothing spent.

**Build 288 (Level 2 chat):** a thin pale sliver left between Help's legs in `help-turn.pack` cleared (second, finer pass). Nothing spent.

**Build 287 (Level 2 chat), four things the owner asked, nothing spent:** (1) blank paper shut in between the legs cleaned out of `pliable-stop.pack` (frame 37), `lift.pack` (frame 56, both men), `help-walk.pack` and `help-turn.pack` (pale opaque patches in the lower half of each frame made see-through); `PACK_V` bumped. (2) [taken out in the next build: not what the owner meant] (3) Christian no longer lifts his head and arm as Help comes: he keeps heaving while they talk and reaches only at "Give me your hand" (`C2.handGo`); the touch ring waits until his hand is up (`C2.rt` 150, about 6 s). (4) Tests: `index.html?level=2` now opens the contents page; after "Open the book", press "II. The Slough of Despond".

**Build 285 (Level 2 chat): blank paper shut in between Pliable's legs as he climbs out of the Slough showed as a pale block (owner); cleaned in `assets/pliable-climb.pack` itself (pale opaque patches below row 250 made see-through, frames 4 to 95), `PACK_V` bumped. Nothing spent.**

**Build 284 (room 3 chat): the Interpreter and Christian really walk in the passage between rooms and when leaving, from the first day's free Hugging Face clips. Nothing spent. See `CLAUDE.md`, "Build 284".**

**Build 283 (Level 3 art chat): the oak's bright edge toward the sun taken off, as the figures' line was. Nothing spent.**

**Build 282 (Level 3 art chat): mist behind the figures among the rocks; the brow path goes over the top and out of sight; a soft glow instead of the crisp silver line on the plain. Nothing spent.**

**Build 281 (Level 3 art chat): figures on the plain stand lower in the road so their shadows stay on it; a faint path over the brow that his feet follow down. Nothing spent.**

**Build 280 (cover chat): the cover's hills back to build 276's, the second range from the front a little lower on the right. Nothing spent.**

**Build 279 (cover chat): the cover's hills recomposed to lead the eye to the far light. Nothing spent.**

**Build 278 (room 3 chat): free video from Hugging Face (Wan 2.2 on ZeroGPU, the owner's token saved as a network secret), a daily scheduled task working through the clip queue on the `clips` branch, and the Interpreter's raised hand as a real 57-frame gesture. Nothing spent. See `CLAUDE.md`, "Build 278".**

**Build 276 (cover chat): the book cover painted in code in the game's own watercolour language (arched window of layered hills under the far light), replacing the leather photograph; no more flicker on opening. See `CLAUDE.md`, "Build 276". Nothing spent.**

**Build 365 (Level 2 edits chat): Help's and Christian's turns in the Slough are quick pivots (under a second, eased); the stepping stones are drawn again, each light settling on its stone. See `CLAUDE.md`, "Build 365". Nothing spent.**

**Build 271 (Level 2 edits chat): Christian deep in the mire (shoulder-deep at the far bank), the reach one continuous play into the lift with no jump; then five critic subagents' agreed fixes (softer pools, no seam by the far bank, a clean reflection, no hard horizon line, Help out of the mist dark and whole). Their other ideas (word cuts, staging) are proposals in `CLAUDE.md`, "Build 271". Nothing spent.**

**Build 259 (Level 2 edits chat): the Slough's mud has its own tones (dark wet rims round the pools, wetter patches, dull sheen bands, a few foreground pools), a soft wet shadow under each man and under the home bank, and a flat mist along both shores. See `CLAUDE.md`, "Build 259". New: `tools/stills2.js`, and the owner's rule of before-and-after stills for every change. Nothing spent.**

**Build 255 (small-tweaks chat): the gate's wall and door softer still, with less contrast. See `CLAUDE.md`, "Build 255". Nothing spent.**

**Build 274 (room 3 chat): the house repainted in oil after its masters, real slender people, Christian and the Interpreter painted again in Rembrandt's manner and set in shadow, the brave man again; boxes left by build 273's view fixed. Eleven pictures, about $1.43 (the owner allowed about $1.40). See `CLAUDE.md`, "Build 274".**

**Build 273 (room 3 chat): each room of the house shown whole, smaller, framed in the dark. Nothing spent.**

**Build 270 (room 3 chat): mood sound for every room of the house (made in the browser, no hymn) and warm light on the two visitors by the fire, the open door and the candle. Nothing spent.**

**Build 268 (room 3 chat): room 3 repainted with child-sized boys, Christian painted once in colour for the house, a candle-lit passage between rooms (hold to follow the Interpreter). About 26 cents (the owner allowed up to 50).**

**Build 266 (room 3 chat): the visitors sized to each room's painted people (rooms 3 and 7 larger). Nothing spent.**

**Build 265 (room 3 chat, overnight): a second critique round on the house and its fixes (figures' tone and shadows, the Interpreter's pose swap, room 7's light, the leaving walk). Nothing spent.**

**Build 264 (room 3 chat, overnight): the Interpreter's own figure (two poses) and room 2 without painted visitors, about 26 cents.**

**Build 263 (room 3 chat, overnight): the house checked by three critic agents (book, pictures, a child's touches) and fixed; its 50 lines recorded in five new designed voices (about 55 cents). Voice descriptions: Interpreter "An old, grave and very kind English man in his late sixties, a wise teacher. A warm, soft, unhurried voice of middle-low pitch, with quiet wonder in it, like a grandfather showing a child something precious and explaining what it means. An educated, old-fashioned English accent. Gentle and clear; never booming, never theatrical."; the man in the cage "An English man of about forty, worn out and hollow. A low, flat, sorrowful voice, speaking slowly with heavy sighs, as if he has given up hope. Quiet and sad rather than frightening. A plain English accent. Never theatrical."; the trembling man "A young English man in his twenties, just woken from a terrible dream, shaken and trembling. A hushed, breathless voice of middle pitch, speaking in awe and fear of what he has seen. A plain English accent. Never shouting, never theatrical."; the brave man "A stout, strong, brave English man in his thirties, a plain working man. A firm, warm, resolute voice of low-middle pitch, saying few words, steady and sure of himself. A plain English accent. Never shouting, never theatrical."; the voices from the palace "A clear, bright, warm young voice, gentle and joyful, almost singing, as if calling softly from high above to welcome someone home. Tender and glad. An English accent. Never loud, never theatrical."**

**Build 261 (room 3 chat, overnight): the whole Interpreter's House is playable: contents line IV, the door, rooms 1 to 5, the darker rooms 6 and 7 behind "Shew the darker rooms", leaving. Six room pictures and the brave man painted (about 91 cents; the owner allowed up to $3 tonight). See `CLAUDE.md`, "THE INTERPRETER'S HOUSE IN THE GAME".**

**Build 257 (room 3 chat): room 3, Passion and Patience, playable by `?room=3` (`rooms.js`, object `RM`): the bag, the gold, the bubbles, Passion left in rags. See `CLAUDE.md`, "ROOM 3 IN THE GAME". Nothing spent.**

**Build 254 (small-tweaks chat): the gate's wall and door softened a little, toward watercolour. See `CLAUDE.md`, "Build 254". Nothing spent.**

**Build 252 (small-tweaks chat): the gate's darks warmed to Rembrandt's red-browns (sky, wall, road, edges, the light's falloff, Christian). See `CLAUDE.md`, "Build 252". Nothing spent.**

**Build 250 (small-tweaks chat): the lantern's iron arm now comes straight out of the wall at us, with its shadow on the wall when the door opens. See `CLAUDE.md`, "Build 250". Nothing spent.**

**Build 249 (small-tweaks chat): the gate after Rembrandt: the lantern on a wrought-iron arm, Christian dark with a gold edge toward the open door, the stream of light behind him, tighter pools that sink as the door opens. See `CLAUDE.md`, "Build 249". Nothing spent.**

**Build 247 (keepsakes chat): his Bible's ribbon in the same woven silk as the closed book's. Nothing spent.**

**Build 245 (keepsakes chat): the closed book's ribbon painted as woven silk (threads, a drifting sheen with a slight twist, a cut end with loose threads). Nothing spent.**

**Build 262 (Level 3 edits chat): the owner preferred build 256's smoke after all; restored, billows spread a little wider and a touch fuller. The painted plume and the masses are removed (in git history). Nothing spent.**

**Build 260 (Level 3 edits chat): the smoke is a PAINTED plume now (plan B; one picture, about 15 cents), swaying in code; see `CLAUDE.md`, "Build 260". Spent in this chat: about 15 cents.**

**Build 258 (Level 3 edits chat): the smoke rebuilt as rolling billow masses lit from the fire below (see `CLAUDE.md`, "Build 258"). If it still does not sing: plan B, a painted plume (about 15 to 25 cents, ask first). Nothing spent.**

**Build 256 (Level 3 edits chat): the smoke columns more billowy (rounder, fuller lobes, lighter on top, darker beneath). Nothing spent.**

**Build 253 (Level 3 edits chat): the smoke billows a little less wispy (the owner liked build 251's colour). Nothing spent.**

**Build 251 (Level 3 edits chat): the smoke columns in the cloud's colour, paler near the rock, with frayed wispy edges. See `CLAUDE.md`, "Build 252". Nothing spent.**

**Build 250 (Level 3 edits chat): a touched strike leaves the cloud straight above the touch; no glow on the smoke where it meets the cloud. See `CLAUDE.md`, "Build 250". Nothing spent.**

**Build 248 (Level 3 edits chat): the columns of smoke are dense and dark; no light from the cloud behind shows through them. See `CLAUDE.md`, "Build 248". Nothing spent.**

**Build 246 (Level 3 edits chat): in the wide view the blue slate path and the haze at the mountain's foot keep to his stretch of the path; elsewhere the mountain's base runs down into the dark ground as one. See `CLAUDE.md`, "Build 246". Nothing spent.**

**Build 244 (Level 3 edits chat): a strike now lights the cloud BEHIND the two columns of smoke (they stand dark against the flash); see `CLAUDE.md`, "Build 244". Nothing spent.**

**Build 243 (keepsakes chat): the title book's cover tooled as a 1670s English calf binding (blind fillets, a Cambridge panel, worn gilt flower tools at the corners and a centrepiece), in code over the photograph. Nothing spent.**

**Build 242 (keepsakes chat): the wax seal taken off Evangelist's roll (the book gives it none; the sealed roll is the Cross's, `{94}`); `waxSeal()` kept for Level 5. Still waiting on the owner: the Bible's turns and the roll on the iPhone, and the cover (brighter, darker or left; a leather rim round the open pages?). Nothing spent.**

**Build 240 (small-polish chat): the Bible's page turns and riffles on one clock, notes on the page as it lands, the ribbon fading instead of jumping; the roll waits closed until it has faded in. See `CLAUDE.md`, "Motion checked, build 240". The title book's cover checked in stills (twice size), waiting on the owner: more or less toning, and whether a thin leather rim should show round the open pages. Nothing spent.**

**HANDOVER FROM THE LEVEL 3 ART CHAT (builds 185 to 238, Nov 17 2026; the owner: "Looks fantastic - can we start a new chat for edits to level 3 after this keeping what we've done in notes"). Nothing in it spent money.** Every change is written up in `CLAUDE.md` under its build, in the Level 3 section (the entries from 218 on are not in number order: search "Build 2NN").
- **How Level 3 goes now (the owner likes it):** the golden plain and the painted oak → Wiseman points: the camera pans to the far mountain, a pale cloud lid over it, smoke rising → over the brow and out of sight → the rocky path (crags made from the mountain's own rock; a blue-black slate path, the owner's colour; near crags he passes behind, rounder since 238; no haze in the gully; he walks a third quicker) → at the foot the camera pulls back to the whole mountain: ONE cloud ceiling in two tiles (`DECK`, `layer()`), the back tile with its firelit, strike-lit underside, two columns of smoke rising into it (from the summit and the bright fire right of it), the front tile across the sky over the smoke's top; strikes traced from NOAA photographs come out of the cloud and end on the rock (`BOLTS`, `fire(k, atX)`); boulders smaller far off; the figures near-black among the rocks → **the wide shot waits and answers touches** (cloud = a strike there, rock = the nearest crack flares; `wideTouch`, `FLARES`; up to 25 s) → Evangelist, the kneel, back along the path, the second wide look (`farewell`), the mist, the gate (the gate belongs to the small-tweaks chat; see below).
- **Layer order in the hill's drawing (`draw()`, the hill block), bottom to top:** sky; far ridges; the hill painting (rock, fire `LAVA`, flares, steam); summit glow and the strike (`bolt`); the deck's back tile and its lit underside; the smoke columns; the front tile (`deckWisp` = `layer(DECK[1], 1)`); embers; then crags, path, figures, near crags.
- **To see a change before pushing:** `node tools/stills3.js OUT "COND" [N] [hold] [at]` (new in this handover: steps Level 3 to any moment with the page's loop paused and saves stills; examples in its head). Compare before and after side by side; look at close crops at twice the size. I cannot watch motion: the owner's eyes decide pace and movement.
- **Not yet checked by the owner on the phone (said as I pushed):** the pace of the smoke columns, the thickness of the front cloud over them, the new walking pace on the path, how long the wide shot waits.
- **Other chats, keep in step (the owner: "Make sure you sync across multiple chats !!"):** the small-tweaks chat (`session_017HrTSGe9xq7wi7eEH3o8gt`) owns the wicket-gate in `hill.js` (the gate block, the lantern, the wall photographs, Good-will, the figures' tint at the gate, Christian's shadow on the wall, `figure()`'s gate parts); it messages before and after each push and asks others to keep out of those lines. Level 4 has its own chat (below). Before every push: `git fetch`, rebase, and take the next build number after whatever is on `origin/main` (pushes crossed several times: 228, 230, 235 to 239); tell the other chats with `send_message` which lines you touched.
- **Build now 239** (the small-tweaks chat's gate change was renumbered from 238).

**Level 4 has its own chat now** ("Pilgrim's Progress: Level 4, the Interpreter's House rooms", https://claude.ai/code/session_017HrTSFLdkNMnsDJ1SXFeY8): the gate, the narrow way, the house and its seven rooms after paintings, the darker-rooms switch. Its plan is in `CLAUDE.md`, Level 4. The gate itself stays shared with Level 3 (see "THE GATE IS SHARED").

**Level 4, room 3 (this chat, Nov 17):** Passion and Patience painted after Chardin's Soap Bubbles, the boys in the same picture, plus Passion in rags for the ending (`concept/level4-room3-plate.jpg`, `concept/room3-passion-rags-painted.webp`; one picture, about 13 cents). The Level 4 chat keeps room 2. Then, reeled in toward the game (owner: "somewhere in between more watercolor"): the boys repainted as soft watercolour with a touch of colour and plain faces (`concept/level4-room3-plate-watercolour.jpg`, about 13 cents), and, at the owner's yes, the parlour's four people repainted the same way, the room kept (`concept/level4-room2-all-watercolour.jpg`, about 13 cents; the originals kept). Nothing built in the game yet.

**Level 4 chat (Nov 17):** the rooms' words agreed with the owner (in `CLAUDE.md`, "THE ROOMS' WORDS, AGREED"); room 2 sketched as a still in code; the owner asked for painting style, people too, with elements and colours from the painting. A free code collage of real Milkmaid pieces did not work (stickers on a wall). With the owner's yes, ONE draft on `gemini-2.5-flash-image` (about 4 cents), our layout + the Milkmaid as style: `concept/level4-room2-draft.jpg`. Then (owner: "Let's do it ... Can't wait to see Vermeer light") the room without people on `gemini-3-pro-image`, 21:9 at 2K (about 13 cents): `concept/level4-room2-plate.jpg`. **Spent in this chat: about 17 cents.** Found: the light is right, but it is more photograph than Vermeer, the side walls and floorboards go back in depth, and Christian's grey watercolour pictures look pasted on it even when coloured in its light (asked the owner how to bring the two together). The people's sheet (about 15 cents) is not made yet. **BOOKMARK: the owner loves `concept/level4-room2-plate.jpg`; keep it** (see "BOOKMARK: THE STUNNING ROOM" in `CLAUDE.md`); the free plan A was tried and did not beat it. Then a painted Christian standing (about 13 cents): `concept/christian-painted-stand.webp`, and the room's three people (about 13 cents), all four in the room: `concept/level4-room2-all.jpg`. **Spent in this chat: about 47 cents.** Then the owner turned toward the rest of the game: "tone down and move stylistically toward true rest of the game ... some Water color so we can bring rooms and rest of game together". A code watercolour filter over the stunning room looked like a photo filter (not kept); a watercolour draft on `gemini-2.5-flash-image` (about 4 cents) only copied the photograph with paper grain: a miss. Next if wanted: his painted walk, one video, about 56 cents.

**Good-will has his own figure (older small-tweaks chat, about 15 cents):** `assets/goodwill-stand.webp` and `assets/goodwill-reach.webp`, facing right, faces plain, feet level; see "GOOD-WILL'S OWN FIGURE" in `CLAUDE.md`. Not yet in the game; the gate's chat was asked to put the standing one in Level 3's doorway.

**Build 228 (older small-tweaks chat): the book cover toned down** (the leather photo calmer and a little darker, the page edges and ribbon muted). Level 3's voices: `tools/make-voice.py` found every line already recorded (89 of 89); nothing spent.

**Level 4 and the shared gate (small-tweaks chat):** the wicket-gate is ONE gate for Levels 3 and 4, still being changed in the Level 3 chat; Level 4 must reuse it, not copy it (see "THE GATE IS SHARED" in `CLAUDE.md`). Level 4's rooms each after a painting, two darker rooms behind a contents-page switch: mood boards in `concept/level4-moodboard*.jpg`, the gate in the Prodigal Son's colours `concept/level4-gate-prodigal.jpg`. Not built.

**HANDOVER FROM THE SMALL-TWEAKS CHAT (builds 143 to 211, Nov 17 2026), for the next Opus chat. Nothing in it spent money.**
- **What this chat did** (each written up in `CLAUDE.md` under its build): the title and end cards sized by the picture (144); an upright-iPhone check of every screen (178); a faster first load (178); chimney smoke on a touched roof (178); Christian turns at "Do you see that wicket gate?" and looks up at the light, and runs by himself to the lamp after "Run on" (180); **the editor link `?edit`** with skip arrows (184, round dark buttons since 190), its own Home Screen app (`edit.html`, 193 and 195), and editor mode switched on inside any icon by **tapping the build number on the book cover five times** (196); the title page as the book: the closed cover (188), since 206 **a photograph of a real 17th-century calf binding** (British Library, CC0 on Wikimedia Commons, arms removed), the 1678 title page and the contents (187); the app icons from the same photo; the keepsakes: the roll unrolls from the top with the lower roller travelling down (199), English black letter (UnifrakturCook), realistic parchment; his Bible opens at **Hebrews 9** where the ribbon lies (208), back to Romans 3-4, forward to Revelation 21:1-7, with riffles of pages between (201, 208), notes in a quill hand (Herr Von Muellerhoff), the ribbon coming out of the pages, not the binding (210, 211).
- **Rules the owner gave in this chat (now in `CLAUDE.md`):** always give two links per build (game and `?edit`); every new Bible verse checked word for word against two published KJV texts (npm `es-kjv`, `bible-kjv`); free images first (Wikimedia Commons is now allowed by the environment: `commons.wikimedia.org`, `upload.wikimedia.org`; `thumb.wikimedia.org` is not, so fetch originals, slowly).
- **Other chats at work when this one ended:** one on Level 2's mud (`slough.js`), one on Level 3's drawing (`hill.js`, "groundwork (Opus)"); keep out of those files unless the owner says otherwise, and send them findings with `send_message` (as done for Christian looking faint in Level 3, fixed by that chat in build 194).
- **Not confirmed on the real iPhone yet:** the editor icon (build 196's five taps), the riffles and the roll's unrolling in motion.

Older handovers (builds 41 to 137, with the picture and video prompts used for Help, Christian reaching, the grip and lift, the gate and the wall) were folded away in build 140; they are in git (`HANDOFF.md` at build 137). The voice descriptions and the first picture prompts are kept in the build notes below.

**Build 230: every Christian pack checked; his walk repaired in all three levels (no bite at the waist where his hand swings). Nothing spent.**

**Build 226: Christian's stop repaired in Levels 2 and 3 (no notch at his waist, no smudges or ghost where his hand swings back). Nothing spent.**

**Build 220: no cuts into Christian at the mud line while he wades or struggles (the paper between his hand and body is mud now). Nothing spent.**

**Build 217: the notch by his hand in the mire filled (a low heap of mud between arm and body), no light lining on the crag tops, and a real silver lining of low sun on the figures in Level 3's opening. Nothing spent.**

**Build 214: the two mire videos are in (about $1.12, both right first time): Christian wading through the mud (a loop), and stuck chest-deep, heaving, then reaching up until his hand meets Help's. See `CLAUDE.md`, "Build 214". I cannot watch motion: the owner's eyes decide.**

**Build 212: Christian always solid in Levels 2 and 3 (gaps to the outside filled in every Christian pack, no frame melting, the bog's mist veil no longer over him, more contrast in every figure; firelight laid as light and shade). Nothing spent. The owner said yes to the two mire videos (A and B, about $1.12): next.**

**Build 204: no grey discs under the men in the Slough (mist lens kept above the surface, churned patches fainter, rings flat). Nothing spent.**

**Build 200: the Slough recomposed, free (closer camera through the fall, the quarrel, the wading and "could not get out"; darker mud; no ghost outlines). WAITING ON THE OWNER: two mire videos made in deep mud, about $1.12 (see `CLAUDE.md`, "Build 200"). Nothing spent.**

**Build 197: a real kneel at Evangelist's feet (one video, about 56 cents, the owner said yes), made to serve many levels (the Cross, prayer; backwards = rising); see `CLAUDE.md`, "Build 197". The new rule: every video must earn its keep across the whole game (`CLAUDE.md`, "Making pictures, videos and voices"). Level 3's voices: the tool found NONE missing (all were recorded in build 164; the old "16 lines still to record" note was stale). Spent: about 56 cents.**

**Build 189: no book in Christian's hand after Level 1, done free: painted out of his walking, standing, turning and struggling pictures (the owner turned down about $2.95 of new videos); in Level 3 he bows low at Evangelist's feet instead of reading and weeping. Level 1 keeps the book (Bunyan's opening). The two mire videos (about $1.12, for smoother sequencing) are still only offered. Nothing spent.**

**Build 186: more of Christian at the far bank; his struggling videos never played faster than their own speed, eased, each picture melting into the next. WAITING ON THE OWNER: the book in his hand flips about in the mire's videos (it cannot be fixed in code); proposed two new videos made from book-less pictures, about $1.12: (A) a struggle loop in the mud, hands free; (B) at the far bank, struggling, lifting his head, reaching up into the grip pose, so wading runs into reaching with no dissolve. Also asked: keep the book in Level 1 (Bunyan's opening: 'a book in his hand')? Nothing spent.**

**Build 182: the mire's motion reviewed tick by tick: no more long double pictures as they fall in (a plunge to the hips under the splash), heavier drops, Pliable's struggle eased at its turns, a collar that no longer jumps. See `CLAUDE.md`, "MOTION REVIEW OF THE MIRE". Nothing spent.**

**Build 179: the keepsakes made period-true (owner: realistic wax, a Bible as in Bunyan's day, period lettering, paper textures): two red-ruled columns, long s, catchwords, laid paper, calf; rough parchment; a wax seal lit from a height map. Nothing spent.**

**Build 176: a pause menu (go on, or begin any level), and the two things he carries seen up close: his Bible open at Romans 3 (KJV) with his own underlinings and margin notes, two spreads that turn; the roll as unrolling parchment with a red wax seal. `keepsakes.js`; see `CLAUDE.md`, "Keepsakes and the pause menu". Nothing spent.**

**Build 155: Level 2's shores back to clean lines (the owner found build 152's grass too busy); the far shore only gently contoured, the oak's foot flared. Nothing spent.**

**Build 147: Level 2's mud answers the men's own pictures (surface swells, collars, plops, strings, wet mud; the two halves of each ring are one ring). See `CLAUDE.md`, "THE MUD ANSWERS THE FIGURES". Nothing spent. Waiting on the owner's look at `?level=2&at=bog`.**

**What is live (build 140):** the title page offers three levels and remembers the child's level. Level 1 (City of Destruction, `index.html`) and Level 2 (Slough of Despond, `slough.js`) are played and shaped by the owner; Level 3 (Mr. Worldly Wiseman and the hill, `hill.js`) is a first sketch with stand-in figures and no voices, not yet seen by the owner (another chat is reworking its hill, sky, gate and wall pictures). Level 4 is a plan in `CLAUDE.md`. Read `CLAUDE.md` before anything: its rules, lessons, departures from the book and code maps.

**Build 164: the owner's script choices are in** (27 lines cut, 31 reworded; see `CLAUDE.md`, "LESS WAITING"). **Build 175:** walking lines and quicker hand-offs done (owner said yes); `script.html` kept, `SCRIPT-CUTS.md` deleted.

**Waiting on the owner (they play on an iPhone):**
- From the picture chat, built while the owner slept (builds 157 to 159; nothing spent): Level 3's lines of fire down the rock (asked for); the new opening (a great oak in leaf grown by the Slough's tree code, late golden afternoon; agreed in words, not yet seen); the warm light of mercy when Evangelist takes his hand and the fire sinking at his promise (my own addition: ask if it stays); four concept sketches for Level 4 in `concept/level4-four-sketches.jpg` (which pictures to build).
- Build 136: Level 2 walks by touch again, and iPhone text should now stay one size; build 138: smaller words with the phone upright; build 139: Level 3's hill more of a mountain and the wicket-gate at dusk after Rembrandt (the picture chat); build 137: delete the old Home Screen icon and add a new one from the main link. Both need a check on the phone.
- Level 2: whether Help's hurried walk, Christian's turn, Pliable's new heave round in the mud (build 140) and where the pools open look right.
- Level 3: everything (the open questions are in `CLAUDE.md`, "Level 3"), including the departures from the book found in build 140's check; Wiseman's own walk and standing picture are in (build 149); Wiseman's voice (build 143); all lines recorded.
- Level 4 (agreed, build 149): no recap, and the wicket-gate opens the Interpreter's House level (17 levels now); still open: the castle's arrows shown or heard, Good-will's figure.
- Evangelist's walk (build 156): he now walks up to Christian at the hill, feet flat ("2d flat - NOT one leg higher"); his standing frames and Wiseman's standing picture were levelled too. Does it look right on the phone? Level 1's turn-and-point frames were levelled too (build 158).
- The concept art from the picture chat is not in the repo (it was only shown in that chat); ask that chat to put any keepers in a `concept/` folder.
- Earlier offers not answered: the sketch of Levels 3 to 6 as a first whole game; a child playing it; carrying the tune through the levels; Evangelist handing over the roll as an animation; repainting the three cottages with true door and window proportions (about 45 cents).

**Build 238: Level 3's near rocks on the path rounder, more varied and lower. See `CLAUDE.md`, "Build 238". Nothing spent.**

**Build 237: Level 3: the sky in four layers (cloud backdrop, its lit underside, the smoke, a front cloud over the smoke's top); no haze in the gully; narrower near rocks he passes behind; a quicker walk on the path; the wide shot waits and answers touches (cloud = a strike, rock = a crack flares). See `CLAUDE.md`, "Build 237". Nothing spent.**

**Build 233: Level 3: a second column of smoke from the fire right of the summit; the cloud's lit wisps drawn in front of both columns. See `CLAUDE.md`, "Build 233". Nothing spent.**

**Build 232: Level 3: falling boulders smaller in the wide shots; the summit's smoke rises over the cloud's lit underside into the cloud. See `CLAUDE.md`, "Build 232". Nothing spent.**

**Build 229: Level 3: figures near-black among the rocks; the summit's smoke rises as a column into the cloud ceiling. See `CLAUDE.md`, "Build 229". Nothing spent.**

**Build 224: Level 3's rocky path in blue-black slate (the owner's pick from four colour stills). See `CLAUDE.md`, "Build 224". Nothing spent.**

**Build 221: Level 3: the cloud ceiling flatter and wispier (thin lit layers under it), the rocky path a stony brown with an uneven edge (no more blue band), Christian and Wiseman lighter on the green plain. See `CLAUDE.md`, "Build 221". Nothing spent.**

**Build 218: Level 3's sky: one continuous dark cloud ceiling instead of billows, smoke layers and storm bank; pale lid far off, dark ceiling near, firelit underside, strikes out of it. See `CLAUDE.md`, "Build 217". Nothing spent.**

**Build 213: Level 3's lightning: no more strokes through cloud; every strike comes out of a dark storm bank over the mountain and its strands end on the rock. See `CLAUDE.md`, "Build 213". Nothing spent.**

**Build 241: the gate wall's stones much smaller (about real size), a patchwork of four CC0 flint-wall photographs (Ash, Worplesdon, Ripley, Nepcote). The owner said they liked build 236 "slightly more" than 239: asked which part. Nothing spent.**

**Build 239: the two wall photographs matched into one wall; the lantern's roof shadow; Christian's large soft shadow thrown on the wall by the open door; one light rules at a time. Nothing spent.**

**Build 236: the gate wall is two joined CC0 stone-and-flint photographs (Ash and Worplesdon), smaller stones, and the deep Rembrandt dark again. Nothing spent.**

**Build 235: the gate wall is ONE big photograph (A: stone and flint, St Peter's Ash, CC0), under one set of lights (dusk, lantern, door) shared with the surround, the door and the figures; the height-map bake removed. Nothing spent.**

**Build 234: Good-will's own figure (bare-headed, white-bearded, hands folded) stands in Level 3's doorway in place of Evangelist's stand-in. Nothing spent.**

**Build 231: the gate wall back to build 225's (the owner found 227's worse); Christian at the gate dark but not black. Nothing spent.**

**Build 227: the gate wall's three points from the other small-tweaks chat (owner-approved there): the door's light falls off quickly, larger rounder stones with deeper joints and longer shadows, the stone carries on across the whole wall. Nothing spent.**

**Build 225: at the gate Christian is near-black (build 222's light and shade on the figures taken out), the door leaf lightens as it opens, his road shadow darker. Nothing spent.**

**Build 222: Level 3's gate: the wall lit stone by stone from a height map of the stone photograph (plan A; plan B, one large wall photograph, is held), the lantern drawn in code straight on (the photograph removed), and light and shade laid on every Level 3 figure from the scene's lights. Nothing spent.**

**Build 219: Level 3's gate: a real old iron lantern (CC0 photograph) with glowing horn panes, the stone over the gate carved with Bunyan's words, and a touch on it opens it close up like the Bible (`KS.look`). Nothing spent. Offered, not built: ways to make the wall's rock less like an old computer game (see the chat's answer; ask the owner).**

**Build 216: the gate's second pass: a dressed stone surround with a reveal, the hinge on the left so Good-will stands on the right with the door between the two men, Good-will smaller and less dark, a rugged top to the wall, softer light. Nothing spent.**

**Build 215: Level 3's gate from photographs: a public-domain old oak door, a CC0 fieldstone wall with soft joints, light streaming out of the opened door, Good-will a dark figure in the doorway (a stand-in from Evangelist's frames). See `CLAUDE.md`, "Build 215". Nothing spent.**

**Build 209: Level 3's far smoke is pale with distance (never darker than the mountain), with more cloud layers about the far mountain. See `CLAUDE.md`, "Build 209". Nothing spent.**

**Build 207: Level 3's lightning traced from two public-domain NOAA photographs (a great branching strike and single strokes), landing on the mountain's shoulders, flickering like real strikes. See `CLAUDE.md`, "Build 207". Nothing spent.**

**Build 205: Level 3: the mountain solid in the pan, more and branching lightning (far off too), more smoke at the top, larger boulders, tall nearest crags that pass wholly in front of him on the path. See `CLAUDE.md`, "Build 205". Nothing spent.**

**Build 203: Level 3's smoke lies out in long soft layers like the mist at the mountain's foot, instead of round billows. See `CLAUDE.md`, "Build 203". Nothing spent.**

**Build 202: the owner's eleven Level 3 points (rocks only round his path; more lightning and falling boulders; no flicker over the brow, on the oak's edge, or at first sight of the mountain; the kneel's size; no see-through spots in Levels 2 and 3; firelight colour on him; a second wide look at the mountain; more smoke far off; soft dust). See `CLAUDE.md`, "Build 202". Nothing spent.**

**Build 198: steam breathes from the mountain's four glowing cracks, soft and see-through, never over its outline. See `CLAUDE.md`, "Build 198". Nothing spent.**

**Build 194: Christian and Wiseman read as solid figures on Level 3's fair plain (darker tint, a lighter across-wash). See `CLAUDE.md`, "Build 194". Nothing spent.**

**Build 192: the mountain's overhanging face has a crisp edge up close (the painting's soft, haloed edge was blown up three times). See `CLAUDE.md`, "Build 192". Nothing spent.**

**Build 191: Level 3's crags made natural and one with the mountain (overlapping leaning spurs with flat brows and ledges, the mountain's own rock texture and colour, warm edges only on the highest faces, a slope of fallen rock joining them to the mountain at the foot). See `CLAUDE.md`, "Build 191". Nothing spent.**

**Build 185: Level 3 into the rocks (owner's sequence): the hill hidden until Wiseman points (the camera pans right to it, far off and hazed); he goes over a brow and down out of sight; a dark cut to a rocky path among crags on every layer, the nearest passing in front; at the foot the camera pulls back to the whole mountain with lightning, then comes back to him for Evangelist. See `CLAUDE.md`, "Build 185: INTO THE ROCKS". Nothing spent. Waiting on the owner's eyes for the motion (pan, descent, pull back).**
**Build 211 (small tweaks): on the other spreads the ribbon's end comes out of the edge of the stack of leaves, not the page. Nothing spent.**

**Build 210 (small tweaks): the ribbon comes out of the pages on the closed book; inside, the crease shadow and the ribbon lie over the dotted page edges. Nothing spent.**

**Build 208 (small tweaks): his Bible opens at Hebrews 9 where the ribbon lies; back to Romans, on to Revelation 21:1-7; the ribbon hangs out of the pages, not the binding. Nothing spent.**

**Build 206 (small tweaks): the book cover on the title page and the app icon are now a photograph of a real 17th-century calf binding (British Library, CC0 on Wikimedia Commons), its coat of arms removed; Wikimedia hosts added to the environment. Nothing spent.**

**Build 201 (small tweaks): his Bible has more of Romans 4, a riffle of pages on to Hebrews 9 (verse 27, the judgment, Bunyan's own reference), more margin notes in a quill hand. Nothing spent.**

**Build 199 (small tweaks): the roll unrolls from the top with the lower roller travelling down and thinning, no dark gaps, English black letter, realistic parchment. Next: the Bible (more pages, a flip of several pages to a judgment passage, more margin notes in a period hand). Nothing spent.**

**Build 196 (small tweaks): editor mode can be switched on inside any browser or Home Screen icon by tapping the build number on the book cover five times, and is remembered there. Nothing spent.**

**Build 195 (small tweaks): an install page for the editor app, `edit.html`; the editor label shows on the book cover. Nothing spent.**

**Build 193 (small tweaks): the editor link can be its own Home Screen app ("PP Editor", own icon), opening straight into the editor and updating itself. Nothing spent.**

**Build 190 (small tweaks): the editor arrows are round dark buttons, visible on any background. Nothing spent.**

**Build 188 (small tweaks): the title opens on the closed book's cover (brown calf, like the app icon); opening it swings the cover over to show the title page and the contents. Nothing spent.**

**Build 187 (small tweaks): the title page is the 1678 title page of the book, which opens to a contents page listing the levels (no world shown before a level is chosen, so no flash of the old mountain); a new app icon, a closed calf-bound book. Nothing spent. The owner must delete the old Home Screen icon and add it again.**

**Build 184 (small tweaks): the editor's link `?edit`: skip arrows on each side of the picture to jump to the next or previous story moment (`editor.js`). Nothing spent.**

**Build 180 (small tweaks): Christian turns on "Do you see that wicket gate?" and a little faster, lifts his head toward the shining light, and after "Run on" runs on by himself to the lamp past his house. Nothing spent.**

**Build 178 (the small-tweaks chat): upright-iPhone check of all three levels (no overlaps found), a faster first load (the weeping no longer waited for), chimney smoke when a cottage roof is touched in Level 1. Nothing spent.**

**Build 144: the title page is sized by the picture, so it fits an iPhone held upright (`CLAUDE.md`, Phones). Nothing spent.**

**Spending since build 106 (the owner asked to keep it low): about $10.01.** (Build 277: the village painted, about 15 cents, the owner said yes. Build 272: two more oak pictures, about 30 cents, the owner said yes to each; the second is the one used. Build 267: the oak painted again whole, about 15 cents, the owner said yes. Build 261: six room pictures and the brave man, about 91 cents; build 263: the house's voices, about 55 cents. build 264: the Interpreter and room 2, about 26 cents. Tonight's budget from the owner: up to $3, so about $1.80 used; build 268: room 3 and Christian in colour, about 26 cents of a 50-cent allowance.) After build 228: Good-will, one picture of him in two poses, standing and reaching (about 15 cents, the owner said yes; right first time but for the standing pose facing right, to be mirrored, and small drawn eyes to be washed out; `concept/goodwill-two-poses.png`, not yet in the game). Build 214: the two mire videos (about $1.12). Build 197: the kneel video (about 56 cents, right first time). Build 183: the mountain painted again at the image model's highest size (one picture, roughly 25 cents; the exact price of a 4K picture is not known). Build 177: the painted mountain for Level 3 (one picture, about 15 cents). The oak painted again, whole (about 15 cents, the owner asked). Build 164: the shorter script recorded (32 reworded and missing Level 3 lines, with retakes, about 45 cents). The painted oak for Level 3's opening (one picture, about 15 cents, the owner asked for it; right first time). Build 156: Evangelist's walk video (about 56 cents, right first time) and two picture tries at levelling his feet (about 19 cents, both failed; done in code instead). A second reference study, of distant fire and smoke (about 15 cents, the owner said yes; shown to the owner, not in the repo; its lessons are in `CLAUDE.md`, Level 3). One reference painting of the burning hill for the fire's design (about 15 cents, the owner said yes; shown to the owner, not in the game or the repo; what it teaches is in `CLAUDE.md`, Level 3). Build 143 (the owner said yes to Level 3's small costs): Wiseman's voice designed and 37 lines recorded (about 40 cents), three pictures of Wiseman (one cheap draft and two on the pro model, about 35 cents). Build 149: Wiseman's walk video (about 56 cents, right first time). Build 143 (the owner said yes to Level 3's small costs): Wiseman's voice designed and 37 lines recorded (about 40 cents), three pictures of Wiseman (one cheap draft and two on the pro model, about 35 cents).

**Build 143, Level 3's paid parts:** the owner: "Level 3 let's do it all except big costs - maybe make some art requests with google image but check with me before the big video request". Wiseman's voice was designed from: "A prosperous, smooth-spoken English gentleman in his fifties. A rich, warm, confident voice of middle pitch, polished and persuasive, friendly on the surface and a little condescending, like a man used to being listened to and sure he knows best. Unhurried and well-spoken, with a plain educated English accent. Pleasant, never villainous or sinister." (All lines recorded since build 164; build 197 checked: none missing.) Wiseman's painting: `gemini-3-pro-image`, references Obstinate's and Pliable's standing pictures, prompt: the same loose grey watercolour; a well-to-do gentleman in his fifties, comfortably stout, strict side-on profile facing left, one gloved hand on a cane, the other open in easy advice, no burden, no mud; a long full cloak of fine wool with a deep soft fur collar over a long smooth coat tied with a broad smooth cloth sash (not a rope), fine leggings, tall polished riding boots, a broad-brimmed hat with a round crown; nothing ragged, no lace, ruffs, buckles, buttons, jewellery; a plain wash face (it still drew a faint eye, softened in code). The first pro try made him look poor (rope belt, wrapped legs): say "expensive and well kept". The picture is not in the repo until the owner likes it. **Next, after the owner's yes:** cut it out (`tools/cutout.py`), a walk video from it (about 56 cents), Evangelist's walk (about 56 cents). Say the cost and wait for a yes before every paid call.

**THE OVERNIGHT QUEUE (owner away; NOTHING to be spent on Google). Tick off as done:**
0. Read "ART DIRECTION FOR EVERY LEVEL" in `CLAUDE.md` first: every pass is judged by its stills at twice the size. The picture chat did Level 3's mountain, cloud, haze and the wicket-gate after Rembrandt in build 139.
1. ~~Level 3 in code~~ (build 134).
2. ~~Trim `CLAUDE.md` and the top of `HANDOFF.md`~~ (build 140: `CLAUDE.md` from 145 KB to about 45 KB).
3. ~~Level 3 book check, line by line~~ (build 140: five lines added or mended to follow `{40}`, `{44}`, `{46}`, `{58}`, `{59}`; departures listed in `CLAUDE.md`).
4. ~~Level 3 logic pass~~ (build 140: played with real touches on an emulated iPhone, `tools/phone-test-3.js`, and the skip-ahead links, "Walk again" and "Go on" from Level 2's end card checked; nothing wrong found; he only moves while a finger is down, apart from finishing his stride and the mist's jump to the gate).
5. ~~Level 2: Pliable's turn in the bog~~ (build 140: a heave round under a splash, from existing frames).
6. ~~Level 4 groundwork~~ (build 140: words, departures, moments and phases in `CLAUDE.md`; nothing built).
7. Still open: one more close-up pass on Level 2; Level 3's close looks once the picture chat is done.

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

## Build 63, Nov 15 2026: the level list (notes only, nothing in the game changed)
The owner asked what follows the Slough of Despond, what that level should hold, and how many levels the game will have at this pace; then asked for the list to be kept. It is in `CLAUDE.md` under "The whole game: about 18 levels", with the Level 3 proposal (Mr. Worldly Wiseman and the hill) and its three open questions. The owner has not yet answered those.

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
