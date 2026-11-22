# Room 2, the parlour (book `{74}` to `{76}`): `room2.js`

Chat: **PP House · Room 2 Parlour**. Read `notes/house.md` first (shared rules, budgets, pushing).

## The book

`{74}` the Interpreter "took him by the hand, and led him into a very large parlour that was full of dust, because never swept"; he called a man to sweep, and "the dust began so abundantly to fly about, that Christian had almost therewith been choked"; then to a damsel that stood by, "Bring hither the water, and sprinkle the room"; it was "swept and cleansed with pleasure". `{75}`, `{76}`: the parlour is the heart of a man; the dust his original sin; the sweeper the Law, which stirs the dust but cannot cleanse; the damsel the Gospel, which makes the heart clean, "fit for the King of glory to inhabit".

## How it plays now (build 507)

1. N: "He led him into a very large parlour, full of dust, because it was never swept."; TIP "Touch the broom." (ring at plate 2390, 1200).
2. The sweeper sweeps two loops of his video; dust flies (particles from the broom's head), the haze thickens, Christian coughs twice (code sound `cough`).
3. I: "Bring the water, and sprinkle the room."; TIP "Touch the jug." (ring at 1900, 840).
4. The girl tips her jug, water falls from its spout for about 4 s, the haze clears, the dust settles; the sweeper sweeps one more loop.
5. C: "What does this mean?"; I: the heart and the dust, the Law; I: the Gospel, the heart made clean. Then the passage on to room 3.

## What it looks like now

- **The room** (`bakeR2s()`, `R2S`; builds 435, 475, 477): on the house's shell, the parlour by night after Vermeer's *Milkmaid*: one tall leaded window in the back wall (`R2S.WIN`), the moon's light a broad soft slant down to the floor, plaster with old repairs, cracks and nail holes, the basket and brass pail on their nails with thrown shadows, a row of Delft tiles at the wall's foot with faint blue figures, honey-brown floorboards, a foot warmer, a high-backed chair with an ultramarine cushion lost in the dark at the right; Vermeer's colours (cream light, olive-umber shade, cool grey-blue half-tones, lead-tin yellow brass, ultramarine).
- **The girl:** `room2-girl.webp` (build 383): cut from the old oil painting by GrabCut, her jug already tipped in her hands; drawn at the painting's own size. She does not move (the tipping is `df`, which only drives the water; her picture is one still). **She is NOT toned onto the house's dark warm ramp** like the other house people (build 446), so she may read as painted beside them.
- **The sweeper:** a real video (build 482, about 71 cents): `room2-sweeper-v.webp`, 108 frames at 12 a second (`R2D.sweepV`), an upright servant holding a long twig broom properly, sweeping in short strokes; the still `room2-sweeper.webp` stands in until the sheet loads (about 1.5 MB).
- **The visitors:** Christian at 820, the Interpreter at 1100, both at their own size, facing right (in the `?painted` room: 470 and 690).
- **The dust and haze:** particles drawn in `over()`, a warm haze laid over the room (a third as strong in the drawn room).
- **Sound:** the mood bed `airy` (rooms.js `MOODS`), sweeping noises, two coughs, the pour's hiss.

## Left in the file from earlier tries (can be removed once the owner agrees)

- `bakeR2()` and `colourFig()`: build 379/381's daylight parlour, shown only with `?drawn`.
- The painted room (`?painted`): `room2-dry.webp`, the clips `room2-sweep`, `room2-damsel` (`SW`, `DM`, `ov()`), and `lshape`/`ext` code in `rooms.js` for a widened picture.

## Open, and ideas (none agreed yet: ask the owner)

- The girl: tone her onto the house's ramp like the other people (free), or a new picture of her standing with her jug upright and a free clip of her sprinkling (she "stood by", then sprinkles: today she holds a tipped jug from the start and nothing moves).
- The water: real sprinkling over the floor in front of her (drops landing, darkening the boards, the dust settling where it lands), instead of a stream straight down from the spout.
- Christian choking on the dust (the book: "had almost therewith been choked"): today only two coughs; his own picture does not react. A free clip of him coughing, or the dust visibly reaching him.
- The dust: the owner has not said whether the haze and the flying dust look right in the drawn room.
- The room "cleansed with pleasure": a moment of the moonlight clear and still after the water, before the talk.
- The sweeper's sheet is large (1.5 MB): could be halved for phones.
- The words: four lines and two acts; within the rules.

## Log (newest first)

- Build 507: the parlour moved into its own file `room2.js` (no change on screen).
