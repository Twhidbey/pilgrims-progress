# Room 4, the fire fed with oil (book `{80}` to `{82}`): `room4.js`

Chat: **PP House · Room 4 Fire**. Read `notes/house.md` first (shared rules, budgets, pushing).

## The book

`{80}` "a fire burning against a wall, and one standing by it, always casting much water upon it, to quench it; yet did the fire burn higher and hotter." `{81}` The fire is the work of grace in the heart; he that casts water on it is the Devil; "but in that thou seest the fire, notwithstanding, burn higher and hotter, thou shalt also see the reason of that." He takes him "about to the backside of the wall, where he saw a man with a vessel of oil in his hand, of the which he did also continually cast, but secretly, into the fire." `{82}` This is Christ, who with the oil of his grace maintains the work already begun in the heart; he stands behind the wall, "to teach thee that it is hard for the tempted to see how this work of grace is maintained in the soul". Bunyan's margin: 2 Cor. 12:9.

## How it plays now (build 523; the fireplace and colour as in the log)

1. The room opens on the fire (the storyteller's line was cut in build 431: the picture shows it). I: "This fire is the work of grace in the heart. He who casts water on it is the Devil. Come, and see why it burns on."
2. TIP "Touch to go round the back of the wall." (act `round`; a touch or a hold starts it, ring at 2050, 1000). The two then WALK round by themselves (`go`, `WK`): from where they stand (C 400, I 680) to the right, a little further back than the man and the fire (k .92, 14 up, darker, drawn before them), behind the chimney breast (redrawn over them) into the dark, the Interpreter carrying a cupped candle (`cupped()`, the La Tour quote) whose light is the one hole in the dark; about 11 s. They stop (C 2620, I 2860), turn to face the one pouring oil (a crossfade in the near-dark, `sw`), and the dark lifts (`rv`).
3. I: "This is Christ, who with the oil of his grace keeps the work going in the heart. He stands behind the wall, for it is hard for the tempted to see it." Then the passage out to the garden (room 5).

## What it looks like now

- **The room** (`bakeR4()`, `R4D`; builds 378, 426, 441): on the house's shell, a dark warm plaster wall lit in one soft pool by the fire at `FIRE` 1810; the chimney breast `PART0` 1925 to `PART1` 2175, floor to ceiling.
- **THE ARCH (build 516):** a low round-headed opening through the foot of the breast (`WK.ARCH0` 1955 to `ARCH1` 2150, 150 high), the fire's back burning in it, and one bed of embers from the hearth under the wall to behind it: so the oil poured behind the wall feeds the same fire. Ours (the book does not say how the oil reaches the fire).
- **The fire (build 516):** particles, not shapes (`puff`, `fireStep`, `fireDraw`, sprites `FSPR` in 8 colours from pale gold to deep red): five tongues each drawn back to its own root, shaken by a slow turbulence, a few sparks; it starts already burning. At each cast it sinks where the water strikes (fewer, lower puffs, a hiss) and then rises higher than before (`grow`).
- **The water (build 516):** from the bucket's lip (`WK.LIP`) in a falling arc down into the flames, drawn as short pale streaks; where it strikes: the hiss, the dip, a few wisps of steam, and a dark wet patch on the hearth that dries slowly (`wet`). No more steam blob over the fire.
- **The oil (build 516):** a thin golden thread and drops from the jug's spout (`WK.SPOUT`) straight down into the back of the fire, every drop a small flare; poured all along, unseen until the dark lifts.
- **The hidden side (build 516):** the dark behind the wall is .97 and starts inside the breast, so neither the hooded man, the small fire nor the oil shows before they go round.
- **The man casting water** (`room4-caster2.webp`) and **the one pouring oil** (`room4-pourer.webp`) are still pictures; two free clips are queued (`room4-cast`, `room4-pour` on the `clips` branch) to make them move.
- **Light on the visitors** from the fire (`light(x)`), from the small fire once behind the wall.
- **Sound:** the mood bed `fire`, the hiss at each cast, his footsteps on the boards as they walk round.
- `?painted` shows the old painting with the old fade (unchanged).

## Open, and ideas (none agreed yet: ask the owner)

- **Animation (clips queued build 516):** the caster is a still picture with drops coming from his bucket: a free clip of him swinging the bucket and casting (one loop, from his own picture as first and last frame) would make the room's main action real. The pourer likewise: a slow continual secret pour, a short loop.
- **Going round:** today the two visitors fade out on one side and in on the other. They could walk round (their dark walk clips exist: `VIS.C.walk`, `VIS.I.walk`), the camera following them past the chimney breast, so the child sees the way round.
- The room's ONE quoted detail (La Tour's *St Joseph the Carpenter*: a hand cupped round a light) is not in yet: perhaps the pourer's hand round his small fire, or the Interpreter's hand round a candle as they go round.
- "Higher and hotter": the fire growing after each cast is there; the owner has not yet seen whether it reads.
- The fire is code-drawn teardrops: check close up whether it looks like fire or like shapes (stills at twice the size); a free clip of real flame is a possible step up.
- Steam where the water meets the fire, and the dark wet patch on the hearth.

## Log (newest first)

- Build 533 (owner: "the top no longer needs angle"): the hearth wall's top edge is level again, along the ceiling line (`ft0` = `CY`); only its foot runs toward the vanishing point. Nothing spent.

- Build 531 (owner: "the black form the wall itself right so it should come down to near corner of fireplace face wall corner"): the cut chimney breast (the black column) now comes down to `FB`, the hearth wall's near foot, so the cut and the face meet at one corner; the glowing slot where the oil goes in ends flush with the column (it stuck out past it). Nothing spent.

- Build 530 (owner: "the arch is messed up - think perspective"): the opening was a flat outline on the face. Now it has depth (`PV.REV` 130 into the breast): its back edge is the same arch further in (`archPts(..., X)` takes the plane it lies in), so between the two the far jamb's inner face and the arch's underside show, as they would from where we look, in sooty stone lit by the fire (the near jamb's inner face is turned away, unseen); through the back edge the dark recess; its floor is a strip running back toward the vanishing point, and the logs, embers and fire lie along it (the fire's roots sheared to the floor's slope, `sl`). Nothing spent.

- Build 529 (owner: "the further corner of base of fireplace should be just slightly below the line where wall and floor meet. the other corner (closest to us) should be in the shadow where the black shadow starts"): the hearth wall's foot stands `PV.NEAR` (90) in front of the back wall's foot (`FB` = FY + 90, for the face, the arch, the fire, the water's target `FXS()`), and the eye is lower (`PV.Y` = FY - 100), so its far corner falls just below where the back wall meets the floor and its near corner down where the floor's dark shadow starts. The floor strip and boards of build 526 are gone (no longer needed). The water now falls in a downward arc into the lower opening. Nothing spent.

- Build 526 (owner: "i mean the perspective line along floor"): the vanishing point at chest height again (`PV.Y` = FY - 420), so the foot of the hearth wall runs up toward it as its top runs down; the strip of floor along the wall that this shows is the room's floor (warm near the hearth, darker going back) with floorboard seams running to the vanishing point, so it reads as floor and not a ramp. Nothing spent.

- Build 525 (owner: "the black column can be much thinner now... i'd make perspective line much steeper"): the cut chimney breast 140 wide (`PART1` 1880, was 2180), the one pouring oil moved in with it (`WK.PO` 2040, spout 1896); the face's top edge now runs down toward the vanishing point too (it was flat), and the foreshortening is stronger (`PV.GP` 700, was 900). Nothing spent.

- Build 523 (owner: "make the fireplace opening arched like a real old hearth and make it facing the man throwing on water (perspective kinda like that gate in level 3)"): the chimney breast's face toward the room is drawn in perspective (as the gate's wall in Level 3): it runs back from the section's cut at `PART0` toward a vanishing point on the left, low near the floor so its foot stays level (`PV`, `PQ`, `PP`); the hearth is set in that face, facing the man with the bucket: a low round-headed arch of dressed stones with radiating joints (`archPts`, `archAt`), its inner edge lit, a sooty recess inside glowing low, and the one fire drawn in it at its depth (smaller, `PV.FD`, `FXS()`); the firelight lies flat on the floor at its foot and warms the face round it. The cut breast is solid now but for a low glowing slot at its foot, the back of the same fire, where the oil goes in from behind the wall (pourer at `WK.PO` 2340). The man with the bucket stands at `WK.CX` 900 (the water arcs into the opening) and the two visitors start at 280 and 560. Nothing spent.

- Build 522 (owner: "the characters could be a little dimmer and monochromatic. also fire can be inside a fireplace and combined with the other fire embedded in wall. the interpreters light and body should always be behind the other characters"): (1) ONE fireplace right through the chimney breast (`FP0` 1790 to `FP1` 2160, a stone lintel `FPH` 520 above the floor, its throat narrowing into the flue, sooty dark inside, the logs and one bed of embers): the one fire burns in it (`FIRE` 1960); the water goes in at the front, the oil at the back (a root of the fire under the spout `WK.SPOUT` 2120); the breast is wider (`PART0` 1740, `PART1` 2180); the separate small fire and the low arch are gone. (2) The one pouring oil (`WK.PO` 2264) and his oil are unseen until the dark lifts (only the fire's flare at each drop shows); the dark behind the wall starts at the breast's back face, so the whole fire is seen. (3) Every figure in the room dimmer and nearly colourless: the room's tone [110, 94, 86] and a new core option `satK` .3 (a factor on every figure's colour, in `toneOf`); the fire's warmth on their near side weaker and less orange. (4) The Interpreter and his cupped candle are always drawn behind Christian (walking and standing: I, candle, C), and the two walking round are drawn behind everyone else. Nothing spent.

- Build 516 (owner: "let's try and fix them all"): all seven points of the first look fixed: the fire made of rising puffs (real-looking, sparks); the water arcs down into it (hiss, steam wisps, a wet patch); the oil falls into the back of the same fire through a low arch in the chimney breast; the hidden side really dark until they go round; the two walk round behind the man and the fire and behind the breast (one touch, then by themselves), the Interpreter's candle the only light in the dark; La Tour's cupped candle (light red through the fingers) in his hands; two free clips queued for the caster and the pourer. Nothing spent. Departures: the arch through the wall and the Interpreter's candle are ours.

- Build 507: the fire room moved into its own file `room4.js` (no change on screen).
