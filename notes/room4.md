# Room 4, the fire fed with oil (book `{80}` to `{82}`): `room4.js`

Chat: **PP House · Room 4 Fire**. Read `notes/house.md` first (shared rules, budgets, pushing).

## The book

`{80}` "a fire burning against a wall, and one standing by it, always casting much water upon it, to quench it; yet did the fire burn higher and hotter." `{81}` The fire is the work of grace in the heart; he that casts water on it is the Devil; "but in that thou seest the fire, notwithstanding, burn higher and hotter, thou shalt also see the reason of that." He takes him "about to the backside of the wall, where he saw a man with a vessel of oil in his hand, of the which he did also continually cast, but secretly, into the fire." `{82}` This is Christ, who with the oil of his grace maintains the work already begun in the heart; he stands behind the wall, "to teach thee that it is hard for the tempted to see how this work of grace is maintained in the soul". Bunyan's margin: 2 Cor. 12:9.

## How it plays now (build 507)

1. The room opens on the fire (the storyteller's line was cut in build 431: the picture shows it). I: "This fire is the work of grace in the heart. He who casts water on it is the Devil. Come, and see why it burns on."
2. TIP "Hold to go round the back of the wall." (act `round`, a hold; ring at 2172, 1000). While held, `rv` rises to 1 (about 3 s of holding): the two visitors fade out on the left (400, 680) and fade in behind the wall on the right (2700, 2930, facing left); the dark behind the wall lifts (it stays .82 dark until then, so the man pouring oil is only just to be made out).
3. I: "This is Christ, who with the oil of his grace keeps the work going in the heart. He stands behind the wall, for it is hard for the tempted to see it." Then the passage out to the garden (room 5).

## What it looks like now

- **The room** (`bakeR4()`, `R4D`; builds 378, 426, 441): on the house's shell (the beams ceiling, high), a dark warm plaster wall lit in one soft pool by the fire low on the floor at `FIRE` 1810, a second low light behind the wall; the chimney breast between `PART0` 1925 and `PART1` 2175 runs from floor up into the dark, its face toward the fire warmed; a low hearth step; logs.
- **The fire:** drawn live (`flame()`, soft stacked teardrops that sway), five tongues; at each cast it dips where the water strikes (a hiss) and then rises higher than before (`grow`, `dip`), its glow with it; a small fire behind the wall at `SMALL` 2225; steam rising.
- **The man casting water:** `room4-caster2.webp` (build 446: his own figure with his own bucket, toned onto the house's ramp), a still picture; every few seconds a stream of pale drops arcs from his bucket into the fire (`cast`, `water`). His picture does not move.
- **The one pouring oil** behind the wall: `room4-pourer.webp` (hooded, with a jug), a still; oil drops fall from the jug's spout (`oil`).
- **Light on the visitors** from the fire (`light(x)` lit side, flickering), from the small fire once behind the wall.
- **Sound:** the mood bed `fire` (a deep note, the fire's roar and crackle), the hiss at each cast.
- `?painted` shows the old painting (`room4.webp`) with the old positions.

## Open, and ideas (none agreed yet: ask the owner)

- **Animation:** the caster is a still picture with drops coming from his bucket: a free clip of him swinging the bucket and casting (one loop, from his own picture as first and last frame) would make the room's main action real. The pourer likewise: a slow continual secret pour, a short loop.
- **Going round:** today the two visitors fade out on one side and in on the other. They could walk round (their dark walk clips exist: `VIS.C.walk`, `VIS.I.walk`), the camera following them past the chimney breast, so the child sees the way round.
- The room's ONE quoted detail (La Tour's *St Joseph the Carpenter*: a hand cupped round a light) is not in yet: perhaps the pourer's hand round his small fire, or the Interpreter's hand round a candle as they go round.
- "Higher and hotter": the fire growing after each cast is there; the owner has not yet seen whether it reads.
- The fire is code-drawn teardrops: check close up whether it looks like fire or like shapes (stills at twice the size); a free clip of real flame is a possible step up.
- Steam where the water meets the fire, and the dark wet patch on the hearth.

## Log (newest first)

- Build 507: the fire room moved into its own file `room4.js` (no change on screen).
