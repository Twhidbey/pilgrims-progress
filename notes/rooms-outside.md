# Outside and the ways between: the door, leaving, the passages (book `{70}` to `{72}`, `{91}` to `{92}`): `rooms-outside.js`

Chat: **PP House · Outside & passages**. Read `notes/house.md` first (shared rules, budgets, pushing). This chat also looks after the house cutaway and plan in `rooms.js` (`houseCut`, `housePlan`, `PLAN`, `passKind`), since they belong to the ways between rooms; change them with the room chats in mind.

## The book

`{70}` "Then he went on, till he came at the house of the Interpreter, where he knocked over and over"; one came to the door and asked who was there; he asked for the master of the house. `{71}`, `{72}` "Sir, I am a man that am come from the City of Destruction ... I was told by the man that stands at the gate ... that if I called here, you would show me excellent things, such as would be a help to me in my journey." The Interpreter: "Come in; I will show thee that which will be profitable to thee." Then he bid his man light the candle (room 1). `{91}` at the end: "Hast thou considered all these things?" "Yes, and they put me in hope and fear." "Well, keep all things so in thy mind that they may be as a goad in thy sides ... The Comforter be always with thee, good Christian, to guide thee in the way that leads to the City." `{92}` "Now I saw in my dream, that the highway up which Christian was to go, was fenced on either side with a wall, and that wall was called Salvation."

## How it plays now (build 507)

**The door** (`ROOMS.door`): the level comes up out of the dark on Christian (at 1880, .58 size) standing before the house at night. N: "Then he went on till he came to the house of the Interpreter, and knocked over and over."; TIP "Knock on the door." (three knocks, real recordings `knockDoor()`); the door opens on warm light (`doorLight`), the Interpreter comes into it; C: "Sir, the man at the gate said ..."; I: "Come in. I will show you what will help you." Then room 1.

**The passages** (`ROOMS.pass`, between every two rooms): TIP "Touch to follow the Interpreter."; one touch and they walk on by themselves, the Interpreter a step ahead with a candle in his hands, its light the only light (`darkWith`), each in his dark painted walk clip at its own pace (`walkFig`). The way follows the house (`passKind`): `hall` (a ground-floor corridor with beams, a doorway behind, the next room's door ajar ahead), `out` (the corridor to the back door, the night garden beyond: to room 5), `down` (the cellar stair: to room 6, or down from 7), `up` (the great stair: to room 7), `round` (outside along the back wall to the front: room 5 to leaving when the darker rooms are off). On stairs they walk on the steps (`floorAt`). A King James verse for each passage (`VERSES`, keyed by the room ahead), shown on the word strip; the storyteller reads three of them aloud (`READ`: going into room 2, room 5 and leaving). A small cutaway plan of the house in the corner (`housePlan`), the candle's dot moving between rooms. About 4 s each (longer when a verse is read).

**Leaving** (`ROOMS.leave`): the house's cutaway first, the rooms he has seen lighting one by one (`houseCut`, `SEEN_R`) while I: "Have you thought on all these things?"; C: "Yes, and they put me in hope and fear."; I: "The Comforter be always with you ..."; N: "The highway was fenced on either side with a wall, and that wall was called Salvation."; then hold to go on: he walks out past the lit door (the Interpreter in it) in his dark walk and fades; the end card, "Go on" to the Cross.

## What it looks like now

- **The door scene** (`bakeDoorScene(false)`, `HSE`; builds 435, 437, 439; after Rembrandt's *Rest on the Flight into Egypt*): night, two layered masses of dark trees over still water on the left with one tiny far fire mirrored in it; the house's front from `HSE.X0` 1680 running off the right and the top, at the rooms' own size (a floor about 640 at the visitors' .58), a string course marking the upper floor, the bedchamber's lit window upstairs (dims as the door opens), the parlour's tall window below, the cellar's barred grating at the foot; the arched door at `DOOR`.
- **Leaving** (`bakeDoorScene(true)`): the same, at the end of night: the low coursed wall called Salvation begins at 2760 in front of the house's foot and runs out of the picture, a first cold grey along the horizon there (toward Level 5's dawn).
- **Sound:** mood beds `night` (wind, a far owl) and `passage` (the candle's flutter, a low note); footsteps by the floor (wood, stone at the cellar's foot, grass outside).

## Open, and ideas (none agreed yet: ask the owner)

- **The door:** in the book someone comes to the door first and asks who is there; Christian asks for the master. Today the Interpreter himself opens. A servant opening, or keep it simple?
- **Animation:** the Interpreter appears in the doorway by fading in (`ia`); he could step into the light (his walk clip), and beckon him in (the free `interp-nod` clip may fit: check it starts from his dark build-351 figure). Christian walking in through the door at the end of the talk instead of a fade to room 1.
- **The passages:** each is a separate small scene; check they read as the same house as the rooms on either side (same beams, plaster, floor colour, lintel 763). The corner plan: does the owner want it, smaller, or only on the first passage?
- **Leaving:** "hold to go on" then he walks out: the book's next sentence has him run ("Up this way, therefore, did burdened Christian run"), which is how Level 5 opens; join the two (he begins to run as the scene fades)?
- **The Interpreter's last line** keeps only part of `{91}` ("keep all things so in thy mind that they may be as a goad in thy sides" left out).
- The wicket-gate and Good-will (book `{60}` to `{69}`) are still at the end of Level 3, not here (see CLAUDE.md "Level 4 opens at the Wicket-Gate"); the narrow way from the gate to this door is not shown.

## Log (newest first)

- Build 507: the door, leaving and the passages moved into their own file `rooms-outside.js` (no change on screen).
