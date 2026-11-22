# Room 4, the fire fed with oil (book `{80}` to `{82}`): `room4.js`

Chat: **PP House · Room 4 Fire**. Read `notes/house.md` first (shared rules, budgets, pushing).

## The book

`{80}` "a fire burning against a wall, and one standing by it, always casting much water upon it, to quench it; yet did the fire burn higher and hotter." `{81}` The fire is the work of grace in the heart; he that casts water on it is the Devil; "but in that thou seest the fire, notwithstanding, burn higher and hotter, thou shalt also see the reason of that." He takes him "about to the backside of the wall, where he saw a man with a vessel of oil in his hand, of the which he did also continually cast, but secretly, into the fire." `{82}` This is Christ, who with the oil of his grace maintains the work already begun in the heart; he stands behind the wall, "to teach thee that it is hard for the tempted to see how this work of grace is maintained in the soul". Bunyan's margin: 2 Cor. 12:9.

## How it plays now (build 516)

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

- Build 516 (owner: "let's try and fix them all"): all seven points of the first look fixed: the fire made of rising puffs (real-looking, sparks); the water arcs down into it (hiss, steam wisps, a wet patch); the oil falls into the back of the same fire through a low arch in the chimney breast; the hidden side really dark until they go round; the two walk round behind the man and the fire and behind the breast (one touch, then by themselves), the Interpreter's candle the only light in the dark; La Tour's cupped candle (light red through the fingers) in his hands; two free clips queued for the caster and the pourer. Nothing spent. Departures: the arch through the wall and the Interpreter's candle are ours.

- Build 507: the fire room moved into its own file `room4.js` (no change on screen).
