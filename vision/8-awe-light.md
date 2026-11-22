# Awe (c): light from heaven, Levels 1 to 16

Researcher (c) of the awe brief (`vision/awe-brief.md`). Theme: where light from heaven breaks through in every level, one visual language for it, how it grows, and where it must NOT appear. Nothing in the game was changed and nothing was spent. Sketches are in `concept/awe/light-*.jpg` (drawn in code, free).

---

## 1. What the book actually says about light

Bunyan is sparing with light, and that is the lesson: he names it at a dozen places only, and almost every one is a turning point. Quoted from `book/pilgrims-progress-part-one.txt`:

| Level | Book | Bunyan's words (shortened) | Kind of light |
|---|---|---|---|
| 1 | `{17}` | "Do you see yonder shining light? ... I think I do. ... Keep that light in your eye, and go up directly thereto" (margin Ps. 119:105, 2 Pet. 1:19: "a lamp unto my feet", "a light that shineth in a dark place") | **the far light**, the one the game is built on |
| 2 | `{27}` | "garments that will make us shine like the sun in the firmament of heaven" | promised light (the city in the sky, build 370) |
| 3 | `{45}`, `{57}` | flashes of fire out of the hill | **fire**, not heaven: the false way |
| 4 | `{72}`, `{83}`, `{89}` | "commanded his man to light the candle"; "Eternal glory thou shalt win"; the man upon a cloud | lamplight; a glimpse of glory; judgment |
| 5 | `{94}` | "three Shining Ones came to him"; (the dawn is ours) | the first true dawn, persons of light |
| 6 | `{109}` | "gave thanks to God for directing his eye to the place where it lay ... before he got up, the sun went down upon Christian" | an eye directed; the sun lost |
| 7 | `{131}`, `{137}` | "a large upper chamber, whose window opened towards the sun-rising: the name of the chamber was Peace; where he slept till break of day"; from the roof "a most pleasant mountainous country" | dawn through a window; the first sight of Immanuel's Land |
| 8 | `{154}` | "there came to him a hand, with some of the leaves of the tree of life" | no light; a hand |
| 9 | `{164}` to `{167}` | "by and by the day broke; then said Christian, He hath turned 'the shadow of death into the morning'"; "he saw them more clearly now, because the light of the day made them conspicuous"; "the sun was rising, and this was another mercy"; "His candle shineth upon my head, and by his light I walk through darkness"; "In this light, therefore, he came to the end of the valley" | **the great daybreak of the game** |
| 10 | `{183}`, `{184}` | Faithful: "I had sunshine all the rest of the way"; Christian: "had no light for almost half the way ... but at last day broke, and the sun rose" | remembered light |
| 11 | `{242}` | "a chariot ... carried up through the clouds, with sound of trumpet, the nearest way to the Celestial Gate" | light through cloud over a dark crowd |
| 13 | `{289}`, `{292}` | Hopeful: "with thee I mourn without the light"; "on Saturday, about midnight, they began to pray, and continued in prayer till almost break of day" | **the answered prayer**: no light, then break of day |
| 14 | `{305}` | "they could not look steadily through the glass; yet they thought they saw something like the gate, and also some of the glory of the place" | the glimpse |
| 15 | `{329}`, `{350}` | the Flatterer "transformed himself into an angel of light"; Hopeful: "I thought I saw the Lord Jesus Christ look down from heaven upon me" | **false light**; a remembered vision |
| 16 | `{382}`, `{383}`, `{386}`, `{393}`, `{394}`, `{401}` | "the sun shineth night and day"; "the reflection of the sunbeams upon it"; "so extremely glorious that they could not, as yet, with open face behold it"; the River's "great darkness" then "Oh, I see him again!"; the city "higher than the clouds"; "the City shone like the sun" | the light fills everything |

Two things follow. **(a) Darkness before light is Bunyan's rhythm**, five times: the Valley (`{164}`), the dungeon (`{292}`), the River (`{393}`), the arbour's sunset then the Palace's sunrise (`{109}` to `{131}`), and the rain of the city before Evangelist's light. **(b) He warns of a counterfeit**: the Flatterer as "an angel of light" (`{329}`). So the game's heavenly light has to be recognisable, so a child can tell the true light from a false one without being told.

---

## 2. One visual language: "the far light"

The far light is already the game's best idea (vision README, point 5). The proposal is to make it ONE drawn thing with fixed rules, shared by every level (a small file, say `heaven.js`, object `HV`, as `KS` and `ED` are shared), so it is the same light in the rain of Level 1 and in the gold of Level 16. Sketch: `concept/awe/light-four-lights.jpg` sets it beside the three other lights of the game.

### 2.1 How it differs from the other lights

| | Firelight (Sinai, Apollyon) | Lamplight (gate, house, palace) | The day's sun | **Light from heaven** |
|---|---|---|---|---|
| Colour | red-amber, `[255,120,60]` | orange, `[214,116,60]` falling to red-brown | yellow-white | **white core `[255,253,245]`, gold body `[255,226,170]`, a cool silver reach `[200,206,228]`** |
| Where from | below (cloud lit from underneath) | a small flame at a man's height | a small disc high in the sky | **far ahead and a little above the horizon, beyond every layer; never on the ground, never held, never touchable at close range** |
| Edge | flickering glow | steep fall-off (Rembrandt) | a disc with an edge | **no disc and no edge: the core melts into the body, the body into the reach** |
| Shadow | lights edges red | one pool, shadows round it | casts shadows | **casts no shadow; it lifts the haze between it and us** (the far layers go paler and warmer toward it) |
| Motion | flickers, flashes | flickers slightly | none | **breathes slowly** (about 8 s, size ±6%); never flickers, never flashes |
| What moves toward it | smoke and sparks rise from it | moths | nothing | **motes rise TO it** (as Level 1's sung lights drift up to it) |
| Figures | a red edge | a warm edge on the side toward the flame | an even light | **a thin warm rim on the side facing it** (`RIM`), the figure stays dark |

The silver reach is the one new thing: fire and lamp are all warm; only heaven's light has a cool outer halo, as real dawn and real glory in the paintings do (Turner's late suns, Friedrich's dawns). A child sees "the white-gold one with the pale halo far away" and knows it.

### 2.2 How it is drawn in code

All of it is baked once and stretched, as the game already does (`GLOW`, `BEAMC`, `darkMist`):

1. **Three sprites**, baked once at 64 to 128 px: `HV.core` (white, radius 1), `HV.body` (gold, radius 4, `smooth` fall-off to the power 2), `HV.reach` (silver, radius 12, squashed 1.6 wide by 1 high, to the power 2.4). Drawn with `'screen'` on light skies (Level 5 learned that `'lighter'` burns to flat white on a bright dawn, build 403); `'lighter'` only for the core on near-black skies (Valley, dungeon).
2. **The haze it lifts**: one horizontal gradient laid over the far layers only (before the near layers are drawn), gold toward the light, gone by mid-screen; never over the near layer, so near shapes stay dark.
3. **The pool**: one radial gradient squashed to .06 in height on the ground line ahead of him (Level 1's lamp pool, build 95, at a seventh the strength). Flat, never a streak down the picture (picture rule).
4. **The rim**: `RIM` as in Level 3 (the figure's own outline, a hair thin, on the side toward the light), faded by `HV.k`.
5. **Rays**, rare (see 2.4): 5 to 9 soft wedges round the light, drawn into a canvas an eighth of the picture's size and stretched up (so their edges are soft; Level 3's `BEAMC` method), laid with `'screen'`, each slowly turning (`.05 * sin(t * .004 + i)`, Level 2's build 124 code is already this) and fading out well before the ground. Never crossing the child's figure as a hard band.
6. **Motes**: at most 30 small soft points that rise slowly toward the light and fade, only while it is unveiled; none while words are on screen.
7. **One strength per level**: `HV.k` (size and brightness) and `HV.cloud` (how much is hidden) from one table (2.3), next to `GOLD_MAX`, so the whole game's light can be read and tuned in one place. Every level calls `HV.draw(ctx, x, y)` instead of its own glow (today Level 1's `drawLight`, Level 2's disc and shafts, Level 3's far light behind the gate, Level 5's sun are four different codes with four different colours).

### 2.3 How it grows across the game (sketch: `concept/awe/light-grows-across-the-game.jpg`)

| # | Level | Light from heaven | `GOLD_MAX` (idea) | Rays allowed? |
|---|---|---|---|---|
| 1 | City | a pinpoint in the rain; grows only when the child touches it | .72 (now) | no |
| 2 | Slough | lost in mist; back ahead of him at the end | .75 | **yes, once** (already there: "light shining thru in cool way", build 124) |
| 3 | Wiseman, Sinai | hidden behind the burning hill the whole wrong way; seen again behind the wicket-gate (build 496) | .75 | no |
| 4 | House | absent indoors; a first grey on the horizon as he leaves | .75 | no |
| 5 | Cross | **the first dawn**: the far light rises as the sun behind where the beams cross | .85 | yes, once, as it clears the beam |
| 6 | Hill Difficulty | clear day; the sun goes down over the hill as he finds the roll | .8 | no (one low beam on the roll, see idea 6) |
| 7 | Palace | a window "towards the sun-rising"; Immanuel's Land from the roof | .85 | no |
| 8 | Apollyon | a shadow over it; it comes back after | .8 | no |
| 9 | Valley | **none, then the great daybreak** | .9 | **yes, the strongest of the middle game** |
| 10 | Faithful | warm afternoon, quiet | .88 | no |
| 11 | Vanity Fair | hidden behind a hundred false lights; through cloud above the crowd for Faithful's chariot | .88 | yes, once, straight up |
| 12 | River of Life | soft and green | .9 | no |
| 13 | Doubting Castle | **none for three days; a slit at break of day after the prayer** | .9 | one slit (a single soft shaft) |
| 14 | Delectable Mountains | far, high, through the trembling glass: "something like the gate" | .95 | no |
| 15 | Enchanted Ground | dimmed by haze, drowsy; the Flatterer's false white | .9 | no |
| 16 | Beulah, River, City | "the sun shineth night and day"; fills the screen at the gate | **1, uncapped** (Turner) | yes, the last |

The rule the table keeps: **its radius and brightness only grow from one level to the next; what changes is how much is hidden.** Levels can be darker (the Valley is black), but when the light shows it is larger than it was before.

### 2.4 Where it must NOT appear (to keep its power)

- **Never as a pickup or a reward for holding long enough.** The hymn's lights on the road drift TO it; they are not it.
- **Never on Sinai, at Apollyon, inside Doubting Castle before the prayer, in the River's darkness before "Oh, I see him again!"**: its absence is the event, its return the answer.
- **Never in Vanity Fair's lights.** The fair's lights are many, small, coloured, bobbing, at people's height (false lights); heaven's is one, white-gold, far, still.
- **Never on the Flatterer** (`{329}`, "an angel of light"). His "very light robe" (`{328}`) is a flat cold white with no gold body, no silver reach, no rim on others, no motes, and it stands at human height on the road, not far ahead. A child who has followed the true light for fourteen levels sees the difference. (A departure only in how it is drawn; the book gives no look.)
- **Not twice in one picture**, and never with the moon or a lamp equally bright: one light rules at a time (the gate's rule).
- **Rays at most once a level**, at the turning moment in the table, and never the whole time.
- **Not indoors** in Level 4's rooms (the candle is lamplight; the dream's "man upon a cloud" in room 7 is judgment and is better left as it is).

---

## 3. Ideas, level by level

Each: WHERE / WHAT the child sees, hears, does / WHY (book) / COST / RISK.

1. **Level 1, touch the light (exists) — make it the template.** `{17}`. Re-draw `drawLight()` as `HV.draw` with the three sprites and the silver reach; nothing else changes. Why: every later light must answer this one. Free. Risk: none; the change is small at this size.
2. **Level 2, the shafts on the way on (exists) — keep, mark as the first "rays" moment.** Build 124. Free. Risk: none; just note it in the table so no one adds rays earlier.
3. **Level 5, the sun clears the beam.** `{94}`. As the sun rises behind the crossing (build 456), the rays appear only for the moment the sun's core clears the crossbeam (about 4 s), then fade, leaving the plain glow and the colour coming back. The silver reach lies over the far ridges; nothing else changes. Why: the first dawn is the game's first grace; the first rays since the Slough. Free. Risk: overplay; keep it to those seconds.
4. **Level 6, the eye directed to the roll.** `{109}`: "gave thanks to God for directing his eye to the place where it lay." The sun is low over the hill as he comes back to the arbour; one low ray (not a fan) slides through the arbour's lattice and lies on the settle; a tiny glint where the roll is; the child touches it. Then "the sun went down upon Christian": the far light sinks behind the hill for the night walk to the Palace. Why: the book thanks God for it; the act is looking where the light points, as in Level 1. Free. Risk: making the roll a "find the sparkle" game; keep it one glint the child can't miss.
5. **Level 7, the chamber called Peace.** `{131}`: "whose window opened towards the sun-rising ... slept till break of day, and then he awoke and sang." A dark room, a bed, one tall window on the right; the window greys, then the far light rises in it and lays one long flat pool across the boards to the bed; he wakes. On the roof next morning (`{137}`) the Delectable Mountains far to the south, and the far light low over them: the first time it stands over a real place. Why: the book's own sunrise and the first sight of where the light leads. Free. Risk: two dawns in Levels 5 and 7 close together; make 7 a quiet window dawn, not a sky event.
6. **Level 8, the shadow off the sun.** `{153}`, `{154}`. Apollyon is a shadow over the sun (vision plan); when he spreads his wings and flies, the shadow slides off and ordinary daylight returns; then "a hand, with some of the leaves of the tree of life" reaches in from the right, with the faintest gold on its fingers. Why: deliverance shown as light returning, and the game's hands (vision README, point 6). Free. Risk: confusing heaven's light with the plain sun; the sun here is the day's sun (no silver reach), only the hand carries a trace of gold.
7. **Level 9, the great daybreak (TOP).** `{164}` to `{167}`. Sketch: `concept/awe/light-valley-daybreak.jpg`. The child walks in near-black between ditch and quag, holding All-prayer (a small lamplight of his own). After the voice ahead (Psalm 23), the cloud at the far end of the valley tears; a cold silver comes first, then the gold; rays fall into the valley; the path ahead lies in a long flat pool; he stops and turns to look back (`{165}`, "not out of desire to return, but to see"), and the camera draws back along the way he came, the ditch and the mire now plain in the light, the "hobgoblins ... all afar off" only as far grey shapes slipping away. Christian: "He hath turned the shadow of death into the morning." Later, at the end of the valley, the storyteller or Christian: "His candle shineth upon my head, and by his light I walk through darkness." One remembered phrase of Amazing Grace may sound here (one of the three allowed after the Cross). Why: Bunyan's fullest light passage. Free (code), two voice lines about 2 cents. Risk: fear before it; keep the dark quiet (sound and shadow), and the light slow (about 20 s from first grey to rays).
8. **Level 11, the chariot through the clouds.** `{242}`. Faithful's death is not shown (vision plan); over the dark fair a single break opens straight above the crowd, a narrow column of light comes down (the only straight-down rays in the game), a faint shape rises up it with a trumpet, and the break closes. The fair's coloured lights go dim while it is open. Why: Bunyan's own picture, and gentle. Free. Risk: the only sorrowful light; keep it brief and high above everyone.
9. **Level 13, the answered prayer (TOP).** `{289}` "I mourn without the light", `{292}` "on Saturday, about midnight, they began to pray ... till almost break of day." Three dungeon days are told by a slit in the wall that greys and darkens (vision plan, Victor Hugo); on the third night it stays black. The child holds (prayer: the kneel pack, both men) and the slit slowly greys while they pray: first silver, then one thin warm shaft through the slit lies on the floor between them, and only then does Christian remember the key ("I have a key in my bosom called Promise"). The light comes before the key. Why: the light answers the prayer in the book's order (prayer, then dawn, then the key). Free (the kneel exists; a second figure at Hopeful's size later). Risk: holding to pray could feel like a mechanic; let it run by itself after the first touch.
10. **Level 14, the glimpse through the glass (TOP).** `{304}`, `{305}`. On the hill Clear the child holds the glass to his eye; a round view (the only round frame in the game) shows the far light, larger than ever, and within it, for a breath at a time, the shape of a gate; the view trembles (hands shaking at what they have just been shown) and the gate is never steady; let go and it is only the far light again. Why: "they thought they saw something like the gate, and also some of the glory of the place." Free. Risk: frustration if the child thinks they failed; the shaking is the story, not a test, so it always ends in a clear second-long glimpse whatever the hand does.
11. **Level 15, the false light.** `{328}`, `{329}`. The Flatterer stands on the road in a flat cold white with no halo and no gold; when they follow him the true far light slips to their right and behind, so the child sees it going the wrong way (as on Sinai). When the net is rent the Shining One is drawn in the true language (the reach, the rim on them), and the far light is ahead again. Why: Bunyan's warning, shown and not said. Free. Risk: frightening if the Flatterer is shown as a deceiver too sharply; keep him a pleasant pale shape.
12. **Level 15, Hopeful's vision told as a memory.** `{350}`. When Hopeful tells how he "saw the Lord Jesus Christ look down from heaven upon me", it is shown as Level 5's memories in the sky (`memPic`): only a soft column of the far light in the drowsy haze, no figure, while he says it. Why: the Enchanted Ground's long talk needs one picture. Free. Risk: preaching; one line, one picture.
13. **Level 16, Beulah: no night.** `{382}`. For the first time the light does not move with the time of day: the sky is always gold-white, stars faintly in it and the light at once ("the sun shineth night and day"), and the far light is now a broad bright land on the horizon, the City's reflection (`{383}`, "the reflection of the sunbeams upon it"). Too bright to look at: the game draws it softened as if through gauze until the two men are led up (`{386}`, "could not ... with open face behold it, but through an instrument"). Free. Risk: losing contrast; keep the near layers warm brown so figures still read.
14. **Level 16, the River's darkness and the light again (TOP of the last level).** `{392}`, `{393}`. In the River the screen dims to the Slough's dark (the River rhymes with the Slough); Hopeful says "Brother, I see the gate"; on "Oh, I see him again!" the far light comes back all at once, full size, and the water is "as still as a stone". Why: the last darkness and the last return. Free (Level 2's dark mist and wading packs). Risk: the death is the River; keep it a crossing, not a drowning (the brief's gentleness).
15. **Level 16, the gate (Turner).** `{394}` to `{401}`. They go up "higher than the clouds"; the clouds sink below; the far light is no longer ahead but all round them; at the gate it opens and "the City shone like the sun": the screen goes to white-gold and the hymn plays whole on the trumpets (owner's ruling). The far light the child has followed since the first screen turns out to be the City itself. Free in code; an image-model reference (below) is optional.

---

## 4. My top three

1. **One shared far light (`HV`) with the rules of section 2**, used by Levels 1 to 5 now and every later level: the same white core, gold body and silver reach; only growing; hidden is the event; rays once a level at most; never as a reward, never in false lights. It costs nothing, unifies four different codes, and makes every later moment of grace legible. (Sketches: `light-four-lights.jpg`, `light-grows-across-the-game.jpg`.)
2. **Level 9's daybreak** (idea 7) as the middle of the game's great picture: black to silver to gold in one gap ahead, rays into the valley, the look back at the way he came in daylight, "He hath turned the shadow of death into the morning." (Sketch: `light-valley-daybreak.jpg`.)
3. **Level 13's answered prayer** (idea 9): the dawn comes through the slit while they pray, before the key is remembered, in the book's order. The game's plainest "answered prayer" and a quiet one.

(Close behind: the glimpse through the trembling glass, idea 10, and Level 6's eye directed to the roll, idea 4.)

---

## 5. Prompts written, not run

**Image reference for Level 16's gate (optional; about 15 cents on `gemini-3-pro-image`, 21:9 at 2K; or about 5 cents for a draft on `gemini-2.5-flash-image`). Not to be pasted into the game: a reference for the code drawing only.**

> A late J. M. W. Turner oil sketch, extremely simple and luminous: a wide flat composition, very low horizon. The whole upper picture is a soft white-gold light with no visible sun disc: the brightest point is a pale, almost white glow just above the horizon slightly right of centre, melting into warm gold, and at the far edges into a cool silvery grey-blue haze. Below it, a distant city on a great hill is only suggested: faint pale towers and walls dissolving into the light, higher than a bank of low clouds that lie below it like a sea. In the foreground, three or four long flat layers of land in warm brown and ochre, each paler toward the light, the nearest darkest. No people, no buildings in detail, no rays drawn as lines, no lens flare, no sparkles. Layered silhouettes, each layer nearly one tone, haze between them. Calm, reverent, vast. 21:9.

**Sound for the light (free, in code; no music piece needed):** when the far light unveils (Levels 5, 9, 13, 16) one very soft high open fifth (D and A an octave above the hymn's key), sine and a little noise through a high-pass, swelling over 3 s and fading over 6 s; never a tune, so the hymn's three remembered phrases keep their place.

---

## 6. Sketches (free, drawn in code with Python PIL and numpy; the game's own frames from `assets/` for the figure)

- `concept/awe/light-grows-across-the-game.jpg` (1600 x 896, about 150 KB): five strips, Level 1 (a pinpoint in the rain), Level 5 (the sun behind the crossing, him kneeling), Level 9 (no light, then one gap of day ahead), Level 14 (through the glass, something like the gate on the last ridge), Level 16 (the light fills the picture, the City dissolving in it). The same light every time, only larger. Christian is his book-free standing, walking and kneeling frames, toned per scene; in 9, 14 and 16 he still wears the burden because the new coat's frames do not exist yet.
- `concept/awe/light-valley-daybreak.jpg` (1600 x 900, about 100 KB): the Valley of the Shadow at the moment of daybreak (`{164}`): near-black walls from both sides, the cloud torn open in one gap ahead, a silver-to-gold light with no disc edge, a few soft rays (baked at an eighth of the size and stretched) falling behind the far ridges, the narrow way lit in a long flat pool, Christian small and dark with a thin warm rim, motes rising toward the light.
- `concept/awe/light-four-lights.jpg` (1600 x 940, about 135 KB): the vocabulary sheet: firelight (Sinai, red from below), lamplight (orange, one steep pool, Rembrandt), the day's sun (a disc, cast shadows), and light from heaven (white core, gold body, silver reach, no shadow, motes rising to it).

---

## 7. Departures this report would add (each needs the owner's yes)

The dawn at the Cross (already listed); the ray on the roll at the arbour (Level 6; the book says only that God directed his eye); the light through the slit while they pray (Level 13; the book says "till almost break of day"); the gate in the glass drawn as a shape in the light (Level 14); the Flatterer's light drawn cold (Level 15); Hopeful's vision shown as a column of light (Level 15); "His candle shineth upon my head" said aloud (Level 9; it is Christian's own line in the book, so not a departure if given to him).
