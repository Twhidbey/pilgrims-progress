# How art works in atmospheric narrative games, and what this game should take from them

Researcher 01 of the art deep dive. Topic: how the art does its job in atmospheric side-scrollers and narrative games. Looked at as an art-school critique, then turned into rules for *Pilgrim's Progress*.

**How far to trust it.** Searches were run on the web, but most primary pages could not be opened from this session. `gamedeveloper.com`, `blog.playdead.com` and `cgw.com` would not resolve here, so Playdead's two art essays and the Journey art talk write-up were read only through search snippets. Marks used below:
- **[V]**: checked in a search result this session (URL given).
- **[M]**: from memory of the game, talk or artbook. It is probably right but was not re-checked. Confirm it before quoting.

Nothing here repeats `vision/4-levels-1-5-art-and-engagement.md` (the 28 ranked fixes) except where a finding from other games makes one of its fixes stronger.

---

## 0. The thesis in one paragraph

In every game on this list that people call "art, not a video game", the art is doing the **design work**. It tells you where you are, where to go and what you feel, so that UI, text and instruction can disappear. Five tools carry nearly all of it:
1. a **value structure** where the player is always the most readable shape;
2. **depth by atmosphere**, not by detail;
3. **one goal drawn as light**;
4. **a colour script** written for the whole game before any level is painted;
5. **restraint**, meaning stillness, emptiness and few things on screen, so that each thing that happens has weight.

The game already has three of the five as written rules: layers of one tone, one far light, few things. What it lacks is the **whole-game colour script**, a **firm hierarchy of values** that holds in every level, and the **discipline to say "this level's job is X"** before drawing. Section 9 proposes all three.

---

## 1. Value structure and silhouette readability

**Limbo** set the template. Foreground objects are solid black silhouettes, the background falls away into grey fog, and depth comes from shade and focus instead of 3D detail. Jensen steered the art toward minimalism on purpose ("all selections and deselections ... made in order to make the experience more powerful", quoted from a Jyllands-Posten interview) [V: https://www.wikipedia.com/wiki/LIMBO, as summarised in search]. Two tones carry everything: the near world is black, the far world is fog. The boy's only feature is two white eyes, the single highest-contrast mark on the screen [M]. That is the first lesson: **the player's figure owns the most extreme contrast in the frame.**

**Inside** keeps Limbo's grey but adds one colour. The boy's red shirt "sticks out in sharp contrast"; he "is often the smallest thing on the screen, a fragile spot of red against a dark mass". Red is also used on a few handholds that might otherwise be missed [V: https://www.nme.com/gaming-features/colour-me-happy-colour-and-symbolism-in-video-games-2835574; review summaries via https://www.pcgamer.com/uk/inside-review]. So **saturation is reserved as a signal**. The world gets value; the player and a few vital things get hue. Playdead's essay "The Weight of Detail" argues that the sparse environments are what give each small detail its weight [V, snippet: https://blog.playdead.com/articles/the_weight_of_detail/weight_of_detail.html].

**Ori** shows the other way to do it: a lush, colourful, highly detailed painted world. Moon Studios held to readability as the rule over decoration. Detail, lighting and particles were "kept from undermining readability. It had to look nice, yes, but more importantly it had to remain functional" (Edge, "The Making Of") [V: https://www.pressreader.com/australia/edge/20161013/283407716237477]. In practice Ori is a glowing white point. The world can be as rich as it likes because the hero is the brightest, most saturated-cool thing, with a glow around it [M]. **Hollow Knight** does the same in reverse. The Knight's white mask is the brightest small shape in a desaturated, blue-grey hand-drawn world, and backgrounds are pushed down in value and saturation behind a blur band [M].

**The art-school rule** (Ansel Adams' zone system thinking applied to games): **decide a value ladder for the whole game and never break it.**
- Lightest: the goal (sky, far light).
- Next: the far layers.
- Then: the mid layers.
- Darkest: the near frame.
- The player is either the darkest shape against the light (Limbo and Inside's method) or the lightest shape against the dark (Ori and Hollow Knight's method), **never mid-grey against mid-grey**.

**This game's problem, measured against that rule.** The vision report already found Christian dark brown on dark brown at the foot of the mountain (L3), and pale against Evangelist in the field (L1). Both break the ladder. Most of the game is in Limbo and Inside's method: Christian is a dark figure against paler layers. When a scene goes dark (the mountain, the rooms, the dream), switch on purpose to the Ori method: a pale rim, a mist behind him, a warm edge. The game has tried versions of each (`RIM`, the mist bank of build 314, `RIM.gold`), but scene by scene. They should be one rule (section 10, rule 1).

---

## 2. Parallax and depth layering

Every game here builds depth from **stacked planes, each flatter and paler with distance**, which is exactly the owner's chosen look. What separates the best from the rest:

- **Alto's Adventure / Odyssey.** Harry Nesbitt, the art director, describes "a more minimalist, impressionistic approach" and an effort "to reduce the visual complexity" [V: https://www.pocketgamer.com/altos-odyssey/interview-a-closer-look-at-team-altos-stunning-sequel-altos-odyssey; https://www.gamedeveloper.com/business/road-to-the-igf-team-alto-s-i-alto-s-odyssey-i-]. The look is 4 to 6 flat silhouette ranges, each a flat colour shifted toward the sky's colour with distance, under a sky gradient that sets the whole picture's key. Time of day and weather re-key **every layer at once** from one sky colour [M; the full interviews were not read]. This is the nearest living relative of the game's look. **The lesson: the layers' colours should be derived from the sky (and the far light), not chosen one by one.** Then a change of weather or dawn changes the whole picture coherently. The game half-does this with `layerCol` and `GOLD_MAX` in Level 1. Levels 2 to 5 hand-set their tones.
- **Limbo / Inside.** Fewer layers, and they are separated **by fog, not by colour steps**. A volumetric haze sits between planes [V: search summary of Limbo; Playdead's lighting essay title https://blog.playdead.com/articles/the_lighting_of_inside/lighting_of_inside.html, content not read]. **Inside's camera never shows a hard far edge** [M]. The far plane always dissolves.
- **Old Man's Journey** (Broken Rules). Hand-drawn, layered pastoral landscapes. The core mechanic is literally *rearranging the depth layers* (pull a hill down so the old man can walk from one layer to another). The GDC talk "Happy Inside the Box" describes the limits they set themselves ("a box they had to think inside of") and a pipeline for drawings from 4K to phones [V: https://www.gdcvault.com/play/1024236/]. **The lesson: in a layered world, interaction can be *with the layers*.** Touching a far layer, bringing a near one forward or lifting a veil is more "art" than touching an object.
- **Planet of Lana.** A painterly layered world after Ghibli. Its creative director traces the whole look to one key image drawn in 2017 that "we still use as our main key art" [V: https://gamedeveloper.com/business/exploring-the-art-and-animation-behind-hand-painted-odyssey-i-planet-of-lana-i-, snippet]. **The lesson: one painted key frame per level, made first, is the reference every later decision is checked against.** The owner's "each level one stunning picture" rule is the same idea. It should be *drawn first* (a still) and kept beside the level as its key art.

**Foreground framing.** Inside, Little Nightmares, Planet of Lana and Ori all pass black or near-black shapes *in front* of the player now and then: branches, pipes, railings, grass. This does three things. It gives scale. It gives a sense of the camera being a watcher. And it gives rhythm, a dark beat that wipes the screen. The game has this in Level 3's near crags (builds 205, 237, 238). Rule: **use a near frame where the story is about being hemmed in or watched** (the city, the crags, Vanity Fair, the Valley of the Shadow, Doubting Castle). **Never use it where the story is about openness** (the Cross, the Delectable Mountains, Beulah). Absence of foreground is itself a signal of freedom.

**Avoid:** near layers with fine texture. In every exemplar the nearest layer is the *least* detailed, close to pure silhouette, because it moves fastest and detail there strobes. The game learned this in build 325 (the near rocks flickered). Make it a standing rule.

---

## 3. The colour script: an emotional arc across a whole game

A colour script is Pixar's tool: a strip of tiny paintings, one per sequence, made before production, so the whole film's arc of hue and value can be seen at a glance. Games that feel authored all have one, written or not.

- **Journey.** The palette "shifts and varies in the game based on a curve established by the artists that is reflective of the narrative", and Nava "tried to make the colors guide the players' emotions" [V, secondary: https://qa2.www.digitaltrends.com/gaming/behind-the-art-of-journey-the-most-beautiful-work-of-art-youll-play]. The structure, on the hero's journey arc Chen describes [V: https://www.theringer.com/2022/3/11/22966978/journey-jenova-chen-thatgamecompany-video-games-art]:
  - warm golden sand;
  - the sun-gold "sand surfing" peak of joy;
  - a descent into blue-green dark underground;
  - the tower climbing back toward light;
  - the snow, where "our color fades" [V: https://www.gamedeveloper.com/design/pixel-pilgrim-exploring-journey];
  - the collapse to near-white;
  - then a burst of saturated sky-blue and gold for the ascent. Reportedly the sky starts greenish, and Nava saved a true sky blue as the reward for the final stretch [V, Spanish secondary: https://www.vidaextra.com/aventura-plataformas/se-cumplen-10-anos-inolvidable-viaje-journey-su-director-artistico-comparte-artes-conceptuales-sus-paisajes].

  **Two lessons. (a) Withhold one colour for the climax** and do not use it before. **(b) The lowest point is drained of colour, not just darkened.** Note too that a Pixel Pilgrim essay reads Journey *as* a pilgrimage, and the game is often compared to Bunyan [V: https://www.gamedeveloper.com/design/pixel-pilgrim-exploring-journey].
- **GRIS.** The clearest case of colour *as* plot. The world starts white and grey. Each chapter restores one hue: red, then green, then blue, then yellow. These are commonly read as the stages of grief [V, critical readings only: https://agardenofstories.substack.com/p/gris; https://appshunter.io/editorials/1478596152; no developer statement found]. Colour returns *cumulatively*: each new hue is added to those already won, so the last level holds the whole spectrum. **The lesson for a pilgrimage: the Cross is the GRIS moment.** Everything before it should feel like a world with something withheld. The vision report's finding (the most colourful moment is the start of Level 3, the wrong way) is exactly a GRIS failure.
- **Ori, Hollow Knight.** Each region has a signature hue (Ori's blue Ginso Tree, red Mount Horu; Hollow Knight's blue Greenpath-to-teal, the pale Queen's Gardens). Regions are *recognisable* by colour alone [M]. **The lesson: each level needs one signature hue a child could name** ("the blue rainy one", "the silver bog", "the gold hill").
- **Monument Valley.** Each level's palette "evolved very organically ... the result of freeform tweaking as opposed to a formal plan" [V: https://www.creativebloq.com/computer-arts/making-monument-valley-71412213]. **A useful warning from the other side:** level-by-level tweaking gives a beautiful set of postcards but no arc. That suits a puzzle collection. A story walk needs the plan.
- **Spiritfarer** keys mood to a day-night cycle and to each spirit's own house colour; its art direction aims for "a simple style, yet not too much. Somewhat soothing for the eye, with a flare of melancholic nostalgia" [V: https://www.redbull.com/us-en/spiritfarer-developer-thunder-lotus-games-interview]. **Child of Light** (watercolour, a fairy-tale) and **Never Alone** (Iñupiaq stories, each chapter opening on a documentary "insight") show the same thing: a gentle children's game can carry real seriousness when the palette stays calm and the darkness is atmospheric, not graphic [M].

**What Bunyan gives the colour script for free.** The book is *already* a light script:
- the City of Destruction under wrath;
- the Slough's mire;
- the false gold of Morality and the fire of Sinai;
- night at the Interpreter's;
- the first sunrise at the Cross;
- "almost night" at the arbour and dark at the lions;
- the dawn view from Palace Beautiful;
- the Valley of Humiliation;
- the Shadow of Death ("the day broke" when he is through, `{136}` area);
- Vanity Fair's gaudy colour;
- Doubting Castle's dungeon;
- the clear air of the Delectable Mountains;
- the drowsy Enchanted Ground;
- Beulah's endless day;
- the dark River;
- the City "as the sun".

Section 9 turns that into a script.

---

## 4. Guiding the eye, and light as the goal

**Journey's mountain** is the purest example of the far goal in games. It is visible from the first screen, a shining peak with a beam of light, and it gets nearer through the whole game. It makes a map, a quest log and an objective marker unnecessary [M; well documented in the art talk https://gdcvault.com/play/1017799/The-Art-of, not reopened]. Three rules sit inside it:
1. **The goal is always the single brightest thing in the frame.**
2. **It is hidden only on purpose**, and its hiding is felt (underground, in the blizzard).
3. **It never moves away from its compass direction.**

**Sky** (thatgamecompany) extends this: light itself is what you carry and give away [M].

**Inside and Limbo** steer the eye by *contrast at the exit*. The way forward is usually where the fog is lightest. Mikkel Svendsen and the Playdead lighting essay describe hand-tuning effects because "knowing precisely where the camera was at any given time allowed us to tweak the effects with as much precision and subtlety as we liked" [V, snippet: https://blog.playdead.com/articles/the_lighting_of_inside/lighting_of_inside.html]. In a side-scroller the eye reads left to right, so **the right edge of the frame should usually be lighter than the left**. The owner's own Level 1 rule ("rain on the left clearing to warm golden light on the right") is this exactly. It should be stated as a rule for *every* level, with deliberate exceptions where he must turn back (Obstinate's "go home", the Slough's go-back path, Level 3's turning aside), where the light should *stay* on the right while he faces left.

**Art-school reading.** Rembrandt and Friedrich both put the light *behind* the subject, so the figure reads as a dark cut-out against hope. That is the "Rückenfigur" stance: the viewer stands with the figure and looks at what he looks at. Every one of the strongest stills in this game already uses it: the oak against the low sun, Good-will in the gate, the sun behind the cross. **Make "the far light behind and to the right of Christian, Christian dark against it" the default composition of the game.** Departures from it then mean something (the Valley of the Shadow, where the light is gone; Vanity Fair, where false lights surround him).

**One light, distinct from all others.** Inside has one red; Journey has one peak with one beam. The vision report (improvement 22) already calls for a rule for small warm lights. From the exemplars, **the far light should differ from every other light by kind, not just by size**: colour temperature, motion and halo. `heaven.js` (build 547) does this with the silver reach. The rule that follows: **no other light in the game may use the silver reach or the slow breath**. That includes lamps, fires, windows, glints, hymn lights and the Shining Ones' gold. Section 10.

---

## 5. Stillness and pacing

What makes these games feel like art and not product is largely **time**.
- **Journey** lets you stand and watch dunes for as long as you like, with nothing pressing.
- **Inside** has long stretches of plain walking where nothing happens; the walking is the dread.
- **Old Man's Journey** has the old man sit on a bench and *remember*, and a full illustration fades in.
- **Florence** is mostly tiny wordless acts: brushing teeth, scrolling a phone, the commute.

Ken Wong on Florence: "When you're communicating with visuals, music and gameplay scenarios then the player can interpret these events as they wish" [V: https://www.player.one/florence-game-ken-wong-interview-123975; https://www.pocketgamer.com/florence/monument-valleys-ken-wong-chats-about-his-most-recent-game-florence-and-its-pret].

**Three pacing patterns worth stealing:**
1. **The held breath before the reveal.** Journey stops the music before the summit; Inside goes silent before the blob. The game already does this at the Cross (silence, then the sun and the hymn). Make it a named beat in every level that has a reveal: the mountain, the gate's opening, Palace Beautiful at dawn, the first sight of the City.
2. **The beat of nothing after.** After a big moment, exemplars give 5 to 15 seconds of plain walking with no new input demanded: Journey's sliding after the tower, GRIS's slow walk after each colour returns. The vision report noticed Level 5 has the child stand through the hymn. A slow *walk* in the new lightness would be the exemplar answer (it is the report's improvement 16; the evidence from GRIS and Journey supports it strongly).
3. **Rhythm of dense and empty.** Count the beats per level as a pattern: walk (empty), moment (dense), walk (empty). Inside rarely puts two dense moments back to back. The owner's "no more than five lines in a row" rule is the text form of this. The visual form: **never two "stunning" pictures back to back without an empty walk between, or neither lands.**

**Avoid** filling empty walks with collectables or glints. Glints on every touchable thing (Level 3, build 369) start to read like a game's interface. Exemplars hide their secrets in the *composition* (a light in a crevice the eye finds) and do not mark them.

---

## 6. Scale: the tiny figure in the vast world

- **Journey, Inside, Little Nightmares, Sayonara** (in its quiet parts), **GRIS** and **Never Alone** all have shots where the hero is a few pixels high against an overwhelming form: a ruin, a whale, a factory, a storm.
- **Little Nightmares** inverts it: the child is tiny inside a world built for giants, so *furniture* is the vast thing.
- **The Pathless** and **Sky** use the giant creature or spirit seen at a distance as the awe object.

The exemplars share two rules:
- **The wide shot is earned and brief.** Inside cuts to extreme wide only at structural moments. The rest of the time the boy is around 1/8 to 1/6 of the frame height [M]. The game's notes reached this independently ("the child never steers in a shot where he is too small to see; the wide shot is a moment, not a walk").
- **Scale is shown by what does not fit, and by repetition.** One huge thing shown whole is less vast than a thing that runs out of frame (the owner's own rule from Level 3). Repetition helps too: a line of identical towers, a crowd, many lamps receding, each smaller.

**For a phone: measure the figure in screen pixels, not world units.** On an iPhone held sideways the picture is about 390 px high. Exemplar mobile games (Alto, Monument Valley, Old Man's Journey) rarely let the player figure fall below about 25 to 30 px tall, except in a brief wide shot [M]. Rule: **Christian at least 1/7 of the picture's height whenever the child steers; below that only in a wide shot of a few seconds.** The vision report found Level 4's palace people at about 25 px; that is the floor, not a target.

---

## 7. UI, text and the frame

- **Florence** makes text *into* art. Conversations are jigsaw puzzles of speech bubbles that get fewer and easier pieces as the couple grow close, and harder as they quarrel [M; widely described, cf. https://80.lv/articles/the-lead-designer-of-monument-valley-discusses-florence]. "Florence has no dialogue or text, so it plays out like a comic book" [V: Pocket Gamer above]. That is not quite literal, but text is minimal.
- **Kentucky Route Zero** treats every screen as theatre. Tamas Kemenczy describes its environments as *scenography*, drawing on Brecht and stage design [V: https://gamedeveloper.com/design/video-how-theater-influenced-the-design-of-i-kentucky-route-zero-i-; https://www.digitaltrends.com/gaming/exploring-the-magical-reality-of-cardboard-computers-kentucky-route-zero]. Its text sits in a plain box *outside* the scene, like a script beside the stage. Its rooms are black voids with a few lit props, so lighting *is* the set.
- **Journey, Inside, Limbo, GRIS** have zero text in play.
- **Child of Light** writes all its dialogue in rhyming verse, set in a storybook typeface, which turns text into part of the fairy-tale artwork [M].
- **Never Alone** frames the play with documentary "cultural insights" kept apart from it [M].

**For this game** (which must have words: a read-aloud book for 7 to 10 year olds), the exemplars say:
- **(a) The words belong to the book, not the world.** The game's book frame (IM Fell type, the 1678 title page) is the best-finished thing in it (vision report). Child of Light and KRZ suggest the word strip should feel like *the printed page of the book*: the same IM Fell, a hint of the red-ruled line of the title page, not a generic caption. That would join the frame and the play.
- **(b) Instruction is quiet and separate.** This is already the owner's rule (TIPs in italics, never spoken). Keep the gold "✦" prompts the only UI-coloured thing.
- **(c) Kentucky Route Zero's black stage** is a respectable precedent for Level 4's dark rooms. Rooms that are mostly darkness with one lit set and a few props are a tradition, not a failure, *provided the figure reads* (section 1).

**HUD-like overlays** (the corner house plan in the passages, build 389) are what exemplars avoid. Journey's map is a mural painted *on a wall in the world*. **If a map is needed, make it a picture in the world:** a carving, a painted cloth in the Interpreter's hall. The vision report independently recommended removing the corner map.

---

## 8. Art that carries story without words; what makes it "art, not video game"

Across the critical writing and the games themselves, these are the recurring markers:

1. **The mechanic is the metaphor.**
   - Florence's puzzles become easier as love deepens.
   - GRIS's new colours are new abilities.
   - Journey's scarf grows with company and withers in the cold.
   - Never Alone's girl and fox *need* each other to move.
   - In this game: holding to wade with each step a minor note; taking the hand; knocking; the burden falling of itself. These are the game's art-markers. The weak ones (touch an object to start the next line) are its video-game markers.
2. **The world reacts to the player emotionally, not mechanically.** GRIS's statue collapses into her grief. In Journey the music answers your chirp. Inside's crowd *follows* the boy. Rule for this game: every act should change the *picture* (light, colour, weather), not just advance text.
3. **Restraint in quantity.** Few enemies, few objects, few colours. Monument Valley's isometric palette works from essentially three tones per object [V: https://killscreen.com/monument-valley-elegance, snippet]. Limbo is grey. The owner's "if you have a few things it begs for more" is the same principle.
4. **Hand-made evidence.** Visible brush, grain, paper (GRIS, Old Man's Journey, Spiritfarer's woodblock-and-watercolour [V: https://www.destructoid.com/?p=275399]). The game's watercolour figures and paper title have it. Its code-flat layers sometimes lack it (the vision report: "Level 5 looks like an earlier draft"). A very faint paper grain and wash variation laid over *every* layer would unify Levels 1 to 5 more than any single scene fix.
5. **One language.** Each exemplar is consistent across its whole length. The vision report's main criticism ("five rendering languages") is the single biggest thing separating this game from the exemplars.
6. **Silence and sound are half the art.** Limbo's audio designer: "everything should be open to interpretation" [V: https://designingsound.org/2011/08/01/limbo-exclusive-interview-with-martin-stig-andersen/]. Journey's score is one theme building through the whole game [V: https://www.gamedeveloper.com/audio/in-depth-i-journey-i-s-rare-and-magical-success]. This game's equivalent is Amazing Grace, discovered in fragments and whole at the Cross: a Journey-grade idea already in place.

**Contrast case: Sayonara Wild Hearts.** It is a *pop album* game: saturated neon, constant motion, fast cuts, the screen never still, text and score as part of the style. It is art too, and shows that "art not video game" is not the same as "slow and muted". But everything it does (spectacle, rhythm, colour at full volume from the start) is the opposite of what this game needs. **The one lesson to take: it uses its full-saturation palette *as* the whole game's voice because it has no arc to save colour for. This game has an arc, so it must save colour.** Vanity Fair is the one place in Bunyan where a Sayonara-like gaudiness belongs, as the *false* colour.

---

## 9. A colour script for all 17 levels

Principles:
- **Value and saturation rise in steps to the Cross.**
- **After the Cross, colour is the norm, and darkness is a visit that ends in a better morning.**
- **One colour is withheld for the end:** a clear, high, saturated sky-blue with gold, used nowhere at full strength before the Delectable Mountains, and whole only at the City (Journey's rule).
- **The far light is the brightest thing in every picture where it is visible;** its *hiding* is marked (●hidden).
- **Each level has one signature hue** a child could name.

The values are rough (sat = saturation 0 to 1 of the picture's strongest area, key = overall brightness):

| # | Level | Signature hue | Key / sat | Far light | The one picture's colour idea |
|---|---|---|---|---|---|
| 1 | City of Destruction | cold slate blue-grey, one ochre doorway | dark-mid / .15 | small, low, right | rain-grey world; the only warmth the lit doorway and the faint light; ends a pale warm grey at the gate (`GOLD_MAX` low) |
| 2 | Slough of Despond | silver (Ansel Adams) | mid / .08 | through mist | nearly monochrome; colour only as a breath of gold on the steps; the plain's gold at the start kept *paler* than anything after the Cross |
| 3 | Worldly Wiseman, the hill | false gold → ember red-brown | bright → very dark / .35 → .3 | ● hidden behind Sinai | the fair plain a *thin, slightly sour* gold (cooler and paler than today), so it is pretty but not the game's best colour; Sinai the darkest, reddest picture so far; Rembrandt amber at the gate |
| 4 | Gate and Interpreter's House | Rembrandt umber with one warm pool per room | dark / .25 | ● absent (night); returns as the dawn grey on leaving | the house a run of single warm lights in the dark; each room a step lighter than the last where the story allows; leaving, the first cold grey of dawn on the right |
| 5 | The Cross | **dawn: rose, then gold, then the first green and blue** | rising to the brightest so far / .5 | rises behind the crossing | the GRIS moment: before, the coldest blue-violet in the game; after, the first *green* on the hill and the first *blue* in the high sky (both withheld until now) |
| 6 | Hill Difficulty, the roll, the lions | warm green and spring light → dusk violet | bright → dark / .45 → .2 | high, steady; ● lost with the roll in "almost night" | day on the hill, then the dusk and dark of the lost roll; the lions in near-black with the palace's windows the only warmth |
| 7 | Palace Beautiful | pearl and dawn rose, then a far blue | bright / .45 | over the Delectable Mountains, far | "the sun rising"; from the roof, the far blue hills: **a small first glimpse of the withheld blue, kept far and hazy** |
| 8 | Apollyon | bleached ochre, a shadow crossing the sun | bright-flat → dark | ● eclipsed by the shape | the fight as a shadow over a pale valley; light returns low and gold after |
| 9 | Valley of the Shadow | near-black blue-green, a single path of grey | darkest of the game / .05 | ● gone; "the day broke" at the end | the second GRIS drain (Journey's blizzard): almost no colour, then a dawn *greater* than the Cross's in value but quieter in hue |
| 10 | Faithful and Talkative | open amber road | mid-bright / .35 | steady ahead | companionship: two figures, warm open land; Talkative's colour a little too bright, like the fair plain |
| 11 | Vanity Fair | **gaudy false colours: magenta, acid yellow, gilt** | bright but cheap / .7 (false) | ● drowned by false lamps | the one Sayonara-like picture: saturated, busy, flickering, *every light a fake*; Faithful's death told in one cool shaft of true light; after it, a plain quiet evening by contrast |
| 12 | Hopeful, By-ends, the silver mine | sober olive and dove-grey, a cold silver glint | mid / .3 | steady | the mine's silver a cold, *metallic* light that is clearly not the far light (different temperature, no breath) |
| 13 | By-path Meadow, Doubting Castle | soft green meadow → stone dungeon black | mid → dark / .35 → .05 | ● hidden; returns as the key's glint becomes dawn | the dungeon the darkest *enclosed* space; the key's light the only warm thing; out, the morning |
| 14 | Delectable Mountains | **the first full clear blue sky and green** | bright / .6 | the City's gate seen faintly through the glass | the first time the withheld blue appears close and clear; Turner and Friedrich's clarity; after it the card "So I awoke ... and dreamed again" |
| 15 | Ignorance, the Flatterer | fading afternoon gold, a false white | mid / .35 | ● confused by the Flatterer's white light | the Flatterer's robe the *one fake of the far light* (a white glow without the silver reach), so the child who knows the real light sees it is wrong |
| 16 | Enchanted Ground | drowsy lilac and honey haze | soft, low contrast / .25 | soft and far | everything a little out of focus and warm: sleepiness as a picture; the near layers drift toward the mid layers (values collapse) |
| 17 | Beulah, the River, the City | Turner gold dissolving to white; the River dark | very bright → one dark band → white / .6 | **is** the City | Beulah the brightest, warmest land; the River a single cold dark band (it rhymes with the Slough: silver and black); beyond it the far light opens into the City; the withheld blue and gold whole |

**Checks the script makes possible:**
- No level before 5 outshines Level 5's dawn (today Level 3's plain does).
- Level 9's dawn outshines Level 5's in value.
- Level 14's blue outshines Level 7's glimpse.
- Level 17 outshines all.
- The darks rhyme: 2 ↔ 17's River, 3's Sinai ↔ 8's Apollyon, 9's Valley ↔ 13's dungeon.
- Writing this table into `CLAUDE.md` beside `GOLD_MAX` would let every level chat check its work against it.

---

## 10. Rules of thumb, ranked

1. **One value ladder for the whole game.** The far light is the lightest mark. Christian is never the same value as what is directly behind him. Define it as numbers: at least a 30% luminance step between his body and the layer behind, checked on a still at phone brightness. Where the scene is dark, he gets light *behind* him (mist, a pale band, a rim), not on him. This is the cheapest, widest fix available, and it is what Ori and Inside are built on.
2. **Write and keep the colour script (section 9), with a withheld blue.** Every level chat checks its strongest colour against its neighbours' before calling a level done. A strip of one still per level, side by side (a literal colour script image in `concept/`), should be updated whenever a level's key picture changes.
3. **The far light is unique by kind.** Silver reach, slow breath, the only rays. No lamp, fire, window, glint or hymn light may share those properties. Its hiding is an event and is shown (Sinai, Apollyon, the Valley, the dungeon, the Flatterer). The one sanctioned imitation is the Flatterer's, which must be *visibly* wrong.
4. **Default composition: Rückenfigur against the light, lighter to the right.** Christian dark against the far light, the way forward brighter than the way back. Break it only on purpose.
5. **Derive layer colours from the sky.** Per level, set the sky (top, horizon) and the far light. Compute each layer as that sky colour mixed toward a level's "near dark" by depth (as `layerCol` does). Then dawn, rain and night re-key the whole picture together (Alto's method), and adjacent levels match at their seams.
6. **The nearest layer is the least detailed.** Pure silhouette, no texture. Use it as a frame only where the story is about enclosure or being watched. Leave it out where the story is about freedom (the Cross, the Mountains, Beulah).
7. **One language of detail.** The same amount of detail per depth level everywhere (the notes' own "three levels of detail" rule, extended to Levels 3 to 5). Add a faint shared paper grain and wash variation over every code layer, so code-drawn levels and watercolour figures sit in one medium.
8. **Every act changes the picture.** An act that only advances text should also change light, colour or weather, however slightly (the GRIS principle). A touch on the candle lights the room; a knock opens light. Audit Level 4's touches against this.
9. **The held breath and the empty beat.** Before each reveal: silence and stillness for 1 to 3 s. After it: 5 to 15 s of plain walking with nothing new demanded. Never two "stunning" pictures without an empty walk between.
10. **Figure size floor.** Christian at least 1/7 of the picture's height while the child steers. Smaller only in wide shots of a few seconds, which the child does not steer.
11. **Words as the book's page.** The word strip in the book's own type (IM Fell), as part of the book frame. No maps or boxes floating in the scene; a needed map is an object in the world.
12. **Secrets in composition, not markers.** Fewer glints; let light and value lead the eye to the touchable thing.

---

## 11. Things to avoid

- **Colour peaks in the wrong place.** Any picture before Level 5 more saturated than Level 5's dawn. Any picture before Level 14 using clear saturated sky-blue at full strength.
- **Mid-value figures on mid-value grounds** (the foot of Sinai). It is the commonest failure in amateur silhouette games, and Ori's team named readability above beauty for this reason.
- **Detail in the foreground or on the moving layers** (strobing, flicker). Detail in the far layers that competes with the light.
- **Several lights of equal strength.** Rembrandt and Inside both rule one light at a time; the game learned this at the wicket-gate (build 142). Keep it everywhere.
- **Hard horizontal seams between layers,** and a far plane with a hard edge. Every exemplar dissolves the far plane into haze.
- **Spectacle without arc.** Sayonara's full-volume colour from the start; Monument Valley's postcard-by-postcard palettes.
- **HUD habits:** corner maps, counters, glints on everything, icons in the scene. Journey's map is a mural; make any map an object.
- **Mixing rendering languages between levels:** photographic paint beside flat code beside oil. The owner has already ruled against the painted look in Level 4; extend that rule to *every* new level. Pictures from the image model are templates, then quietened into the layer language.
- **Showing the monster whole.** Limbo's spider is mostly legs and shadow; Inside's horrors are half seen; Little Nightmares' giants are hands and bellies. Apollyon, Giant Despair and the Valley's fiends should be a shadow over the sun, a shape in fog, a sound.
- **Wide shots the child must steer through,** and long empty walks with nothing to see. Inside's empty walks work because the *background* changes and something is always half-seen.

---

## Sources (search results seen this session unless marked)

- Journey art talk, GDC Vault: https://gdcvault.com/play/1017799/The-Art-of
- Journey palette curve (secondary): https://qa2.www.digitaltrends.com/gaming/behind-the-art-of-journey-the-most-beautiful-work-of-art-youll-play
- Journey sky blue saved for the end (Spanish): https://www.vidaextra.com/aventura-plataformas/se-cumplen-10-anos-inolvidable-viaje-journey-su-director-artistico-comparte-artes-conceptuales-sus-paisajes
- "Pixel Pilgrim: Exploring Journey": https://www.gamedeveloper.com/design/pixel-pilgrim-exploring-journey
- Jenova Chen, hero's journey arc: https://www.theringer.com/2022/3/11/22966978/journey-jenova-chen-thatgamecompany-video-games-art
- Journey music: https://www.gamedeveloper.com/audio/in-depth-i-journey-i-s-rare-and-magical-success
- Limbo: https://www.wikipedia.com/wiki/LIMBO ; Martin Stig Andersen: https://designingsound.org/2011/08/01/limbo-exclusive-interview-with-martin-stig-andersen/
- Inside, colour: https://www.nme.com/gaming-features/colour-me-happy-colour-and-symbolism-in-video-games-2835574 ; https://www.pcgamer.com/uk/inside-review
- Playdead, "The Weight of Detail" (snippet only): https://blog.playdead.com/articles/the_weight_of_detail/weight_of_detail.html
- Playdead, "The Lighting of INSIDE" (snippet only): https://blog.playdead.com/articles/the_lighting_of_inside/lighting_of_inside.html
- GRIS readings (not developer statements): https://agardenofstories.substack.com/p/gris ; https://appshunter.io/editorials/1478596152
- Ori readability (Edge): https://www.pressreader.com/australia/edge/20161013/283407716237477
- Alto's Odyssey, Harry Nesbitt: https://www.pocketgamer.com/altos-odyssey/interview-a-closer-look-at-team-altos-stunning-sequel-altos-odyssey ; https://www.gamedeveloper.com/business/road-to-the-igf-team-alto-s-i-alto-s-odyssey-i-
- Old Man's Journey, GDC: https://www.gdcvault.com/play/1024236/
- Planet of Lana: https://gamedeveloper.com/business/exploring-the-art-and-animation-behind-hand-painted-odyssey-i-planet-of-lana-i-
- Monument Valley palettes: https://www.creativebloq.com/computer-arts/making-monument-valley-71412213 ; https://killscreen.com/monument-valley-elegance
- Florence, Ken Wong: https://www.player.one/florence-game-ken-wong-interview-123975 ; https://www.pocketgamer.com/florence/monument-valleys-ken-wong-chats-about-his-most-recent-game-florence-and-its-pret ; https://80.lv/articles/the-lead-designer-of-monument-valley-discusses-florence
- Spiritfarer: https://www.redbull.com/us-en/spiritfarer-developer-thunder-lotus-games-interview ; https://www.destructoid.com/?p=275399
- Kentucky Route Zero scenography: https://gamedeveloper.com/design/video-how-theater-influenced-the-design-of-i-kentucky-route-zero-i- ; https://www.digitaltrends.com/gaming/exploring-the-magical-reality-of-cardboard-computers-kentucky-route-zero

**Not reached** (blocked hosts or no source found): primary interviews for GRIS (Conrad Roset), Neva, Hollow Knight, Sky, Never Alone, Child of Light, Unravel, The Pathless, Little Nightmares, Sayonara Wild Hearts. Statements about those games are [M].
