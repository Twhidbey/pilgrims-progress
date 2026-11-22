# The Interpreter's House: shared notes for every house chat

Level 4 (book `{70}` to `{92}`). Since build 507 each room has its own file and its own chat. Read this file, then your room's notes, then the parts of `CLAUDE.md` they point to.

## Who has what

| Chat title | Files it owns | Notes |
|---|---|---|
| PP House · Outside & passages | `rooms-outside.js` (the door at night, leaving, the passages between rooms and their verses) | `notes/rooms-outside.md` |
| PP House · Room 1 Picture | `room1.js` | `notes/room1.md` (not started yet) |
| PP House · Room 2 Parlour | `room2.js` | `notes/room2.md` |
| PP House · Room 3 Passion & Patience | `room3.js` | `notes/room3.md` (not started yet) |
| PP House · Room 4 Fire | `room4.js` | `notes/room4.md` |
| PP House · Room 5 Palace | `room5.js` | `notes/room5.md` (not started yet) |
| PP House · Rooms 6–7 Darker | `room6.js`, `room7.js` | `notes/room6-7.md` (not started yet) |

**`rooms.js` is the shared core:** the house's shell (`HOUSE`, `bakeShell`, `EX`, `mkBake`, `lightPool`), the two visitors (`VIS`, `fig`, `visitor`, `walkFig`, `toneOf`), the view (`setView`), sounds, mood beds (`MOODS`), the house cutaway and plan (`houseCut`, `housePlan`, `PLAN`), the room order and moving between rooms. A room chat changes it only when its room truly needs it, keeps the change small, says so in "Changes to the core" below, and checks that the other rooms still look the same (stills of each room before and after).

## How a room file works

Each room file is loaded before `rooms.js` and pushes a function onto `window.RMR`. `rooms.js` calls it with a kit `H` and lays what it returns into `ROOMS`. Shared things are taken from the kit at the top of the file (`const { fig, visitor, ... } = H;`); add a name there if you need one more (and to `KIT` in `rooms.js` if it is not in it yet). Things that change while playing are read and set through the kit: `H.R` (the room now showing), `H.t` (its clock), `H.ph` (its phase), `H.cam`, `H.AMB`. The `?painted` variants of rooms 1, 3, 6, 7 (`r1p` ...) are swapped in by `rooms.js` after assembly.

Script tags at the end of `index.html` carry `?v=N`: set your room file's to the build that last changed it.

## Rules every house chat keeps (from CLAUDE.md)

- **One house:** a flat section, back wall seen straight on, end walls cut edge-on; ONE shell for every room (same beams, skirting, floor, doorways, lintel height 763); night in every room; enter by the left, leave by the right; the visitors stand left facing right, the room's subject centre and right.
- **One light per room**, a soft pool that falls off (the gate's fall-off); most of the picture dark. Each room keeps its master's light and ONE quoted detail.
- **People:** the room's own people as their own figures toned onto the house's dark warm ramp, plain-wash faces (profile kept). Christian and the Interpreter are the dark painted pair of build 351 (`room-christian-p`, `room-interpreter-p`) and their walks. No code breathing or swaying (owner, build 302): figures move only by real video frames. Something moving on its own spot = a clip; flat feet, soles on one line.
- **Play:** one act for the child in every room, no more than about five lines in a row without one; no line over another voice; the storyteller never describes what the picture shows.
- **Book:** Bunyan's words made plain, in his order. Every departure listed in your notes and told to the owner.
- **Before and after stills** for every change (`node tools/stills4.js OUT ROOM "COND"`, `DSF=2`), sent to the owner before above after.
- **Money:** ask before any paid call, say the cost, keep the total in `HANDOFF.md`. Free first: code, then the free clips (see below).

## Shared budgets: check before using

- **Free clips:** one queue on the `clips` branch (`clips/queue.json`, `clips/log.md`): the free Hugging Face Space at 19:41 UTC (about 3 short clips a day) and Modal at 07:17 UTC (at most 4 a day, stops at about $18 a month; Modal's own limit is $25). Several chats share it: add at most two jobs at a time, and look at what is already waiting.
- **Voices:** Google allows 100 requests a day per model across ALL chats (each line is two). Record only your own new lines, with the tool's `record()` for the one line (a full run of `tools/make-voice.py` deletes recordings it cannot match; see CLAUDE.md build 500).

## Pushing

Several chats push to `main`. Just before pushing: `git fetch`, rebase on `origin/main`, take the next build number after whatever is there (`index.html` and `story-lab.html`), syntax-check every file you touched (`new Function(source)`), then push and give the owner the two links (`?v=N` and `?edit&v=N&room=N`). Write what you did in your room's notes (newest at the top of "Log"), and one line in `HANDOFF.md`.

## Changes to the core (newest first)

- Build 520 (room 2 chat): `toneOf` takes a room's `soft` (0..1, default none): a softened copy laid over each figure inside its own outline. Only room 2 sets it; no other room changes (the cache key gained one field).
- Build 519 (Outside & passages): `houseCut` larger, lower and opaque; `RM.peek()` gives `wx` (the walker's place at the door and leaving).
- Build 514 (Outside & passages): `setView` lets a passage use the shell view (`if (R && R.shell)`, was `&& R.id !== 'pass'`); only the passage changes, every room has `shell` as before. `tools/stills4.js` takes `DARK=1`.
- Build 507: `rooms.js` split into the core and the room files (no visible change; every room checked against stills of build 506 with the same random numbers: only flickering fire and moving figures differ).

## Clips already made and not yet used (on the `clips` branch, `clips/out/`)

`interp-nod`, `interp-talk`, `christian-oil-look`, `christian-oil-turn` (check they start from the dark build-351 figures before using; otherwise they jump), `goodwill-pull` (Level 3's gate). `room2-living`, `room4-living`, `room7-living`, `brave-stride` animate the old paintings and probably do not fit the drawn rooms.
