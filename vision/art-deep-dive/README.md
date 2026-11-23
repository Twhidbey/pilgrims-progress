# Art direction deep dive (after build 591)

The owner asked for an art-school-level deep dive: how the art of a game like this should *function*; depictions of the book; the art of Bunyan's own day; art from Japan and Russia to Europe, comics and science fiction; analysis of the story and how it maps onto real lives; music; and a way to dial in their own taste by marking pictures liked and disliked. Twelve research agents worked in parallel. **Nothing in the game was changed and nothing was spent.** This page is the synthesis; the reports hold the detail and the sources.

| File | What it holds |
|---|---|
| `01-game-art-function.md` | Journey, Inside, Limbo, GRIS, Ori, Alto, Florence, Spiritfarer and others, read as an art critic: value, depth, colour script, the light as goal, pacing, scale, UI; a colour script for 17 levels; 12 ranked rules; things to avoid |
| `02-animation-backgrounds.md` | Dudok de Wit (*Father and Daughter*), Reiniger, Earle, Tyrus Wong, Blair, Ghibli's Oga, Norstein, Cartoon Saloon, Pixar colour scripts; 11 edge and value rules a program can apply |
| `03-japanese-east-asian.md` | Hiroshige's road series, shin-hanga, Tōhaku's pines, Sesshū, Guo Xi's three distances, Raigō light, Bashō's haiga; Chinese editions of the book; code recipes; 28 pictures |
| `04-russian-eastern-european.md` | the Ladder of Divine Ascent, Rublev, Kuindzhi's light, Levitan's road, Vasnetsov's crossroads, Nesterov's pilgrims, Roerich, Bilibin, Norstein and Petrov, Tarkovsky; 32 pictures |
| `05-art-of-bunyans-day.md` | what a Bedfordshire tinker saw: the emblem, chapbooks, Dutch tonal landscape (van Goyen), Hollar, Ogilby's 1675 strip road maps; 23 pictures |
| `06-world-and-modern-depictions.md` | the book around the world: Gim Jun-geun's Korean pictures (1895), the Chinese editions, Japan, India, Africa; 20th to 21st century versions |
| `07-comics-scifi-fantasy.md` | Taniguchi, Shaun Tan, Moebius, Mignola, Toppi, Nihei, Doré, Nielsen, Sime, Stålenhag, *Nausicaä*; the gentle apocalypse for the 2200 idea; 21 pictures + 12 text cards |
| `08-story-analysis.md` | allegory and children, the dream frame, the book's emotional curve, the Puritan order of salvation, *Grace Abounding* behind each episode, the hard parts, an emotional colour script, themes to protect |
| `09-real-conversion-stories.md` | Bunyan, Newton, Augustine, Luther, Wesley, Cowper, Spurgeon, ten Boom, Lewis and others mapped to the road; how the book was read in real lives; William James and Rambo; ideas for the game |
| `10-music.md` | metrical psalms, Playford, Bunyan's own hymn (Monks Gate), Vaughan Williams, Amazing Grace and Sacred Harp, game scores (Outer Wilds, Journey), sacred minimalists; a cast of sounds and a sound script for 17 levels; free tunes; 10 Lyria prompts |
| `picker-round1.json` | the 90 pictures of the taste picker, round 1 (a private page: https://claude.ai/artifact/DP533kn7iQQ3N8HqV7pRiv), from 03, 04, 05 and 07; the owner's marks are saved in the page's own store (doc `picks/main`) and read back from there |

Every report marks claims **[V]** (seen this session) or **[M]** (from memory, check before quoting). Many sites could not be opened from this session; check before anything is quoted to a child.

---

## 1. The one-paragraph answer

In every game people call "art, not a video game", **the art does the design work**: it says where you are, where to go and what to feel, so words and buttons can disappear. The game already keeps three of the five tools these games share (layers of one tone, one far light, few things). What it lacks is (1) **a colour script for the whole game, written before Level 6**, (2) **one firm ladder of values** that holds in every level, so Christian always reads, and (3) a habit of saying "this level's job is X" before drawing. Every tradition the agents studied (Dutch tonal landscape, Hiroshige's road series, Norstein's fog, Father and Daughter, Kuindzhi's light, the icons) points the same way: **fewer things, one light, depth by air, a road that means something, colour held back for grace.**

---

## 2. Where the twelve reports agree (the strongest findings)

1. **Hold colour back for grace.** Journey saves its clear blue for the end; GRIS gives colour back one hue at a time; Tarkovsky's *Andrei Rublev* is grey until the icons; the Pixar balloon rule. Today **Level 3's opening is the most colourful picture in the game, brighter than the Cross's dawn**: the wrong way is the prettiest (true to the book, but it should be a *thin, slightly sour* gold, and never outshine Level 5). Proposed: full saturated gold only at 5 and 17; the first green and blue at the Cross; clear high blue withheld until the Delectable Mountains (14), seen once far and hazy from Palace Beautiful's roof (7). (01, 02, 04, 08)
2. **Design to the book's real curve: a rising saw-tooth, not a ramp.** The two deepest falls are AFTER the Cross (the Valley of the Shadow, Doubting Castle); Level 5 should feel like an ending so that what follows surprises; the River rhymes with the Slough. (08, 01)
3. **Christian must always read.** Never mid-grey on mid-grey (the foot of the mountain in Level 3 is the example). A 30 to 35% lightness step between him and what is directly behind him, made by light *behind* him (mist, a pale band), not on him. Ori's team ranked readability above beauty; Inside keeps its one colour for the boy. Add the check to the stills tools. (01, 02, 07)
4. **The far light is unique in kind.** The only rays, the silver reach, the slow breath; no lamp, fire, window or glint shares them; its *hiding* is the event (Sinai, Apollyon, the Valley, the dungeon); the one sanctioned imitation, the Flatterer's, must be visibly wrong. Already the rule of `heaven.js`; the reports make it the game's spine. (01, 02, 04, 08)
5. **A returning frame (the refrain).** *Father and Daughter*'s dyke, Taniguchi's and Shaun Tan's repeated panels: in every level one fixed composition, Christian small at the left third, the far light ahead at the right third, low horizon. Over 17 levels the child sees the same picture change (rain, mist, fire, night, dawn, black, glare, the mountains, the River). A camera rule, almost free. (02, 07, 01)
6. **The road has a shape-language.** The narrow way always one clean flat band; the wrong ways always crooked and wider and visibly easier (Wolfwalkers' square vs round; Vasnetsov's stone at the crossroads; Ogilby's strip maps marking the wrong turnings). A seven-year-old reads the moral without words. (02, 04, 05, 08)
7. **Never show the terror whole.** Limbo's spider is legs and shadow; the Ladder icon's demons are small and many; John Martin's people are tiny. Apollyon a shadow over the sun; Giant Despair a voice and a hand; the Valley's fiends a whisper from behind. (01, 04, 07, 08)
8. **The game's look already has ancestors; name them and borrow on purpose.** Van Goyen's tonal phase (1626 to 1650, Bunyan's boyhood) is almost word for word the game's settled look; Hiroshige's Tōkaidō is "one station, one weather, small travellers"; Norstein's fog layers on glass are the game's layers. (05, 03, 04)
9. **Silence is the ground; music is punctuation** (already the owner's rule): every report on sound agrees, and *Outer Wilds* (a tune found in pieces across a world, whole only at the end) is the best precedent for Amazing Grace as lights. (10)
10. **Help comes through a hand.** Help, Evangelist, Good-will, the Shepherds, Hopeful in the River: one gesture of grace repeated; and in nearly every real conversion story someone reached out. The game already makes the child take each hand: keep it as the one gesture. (08, 09)

---

## 3. A colour script for all 17 levels (merged from 01, 02 and 08: a sketch to argue over)

| # | Level | Feeling | Key / hue | Far light | The one picture |
|---|---|---|---|---|---|
| 1 | City of Destruction | dread, awakening | low-mid; rain slate, one ochre doorway | a pin, ahead | the man turned from his lit door toward a tiny far light |
| 2 | Slough of Despond | helplessness, rescue | mid; silver (Ansel Adams), near monochrome | through mist | Help's hand reaching down to a man sunk to the chest |
| 3 | Wiseman, Sinai, the gate | false ease, terror, mercy | a thin sour gold, then ember and black, then Rembrandt amber | ● hidden by the hill | a tiny man under a vast burning hill |
| 4 | Interpreter's House | welcome, wonder | dark; umber, one warm pool per room | ● night; dawn grey on leaving | a run of single warm lights in the dark |
| 5 | The Cross | release, joy | coldest blue-violet, then the **first dawn**: rose, gold, the first green and blue | rises behind the crossing | the burden falling by itself into the tomb |
| 6 | Hill Difficulty, the roll, the lions | effort, careless loss | warm morning, then dusk and almost night | high; ● lost with the roll | the roll found under the arbour seat at sunset |
| 7 | Palace Beautiful | rest, being armed | candle warm, then pearl dawn; a first far glimpse of blue | far, over the mountains | the chamber called Peace, its window open to the sunrise |
| 8 | Apollyon | fear met head-on | bleached ochre valley, a shadow over the sun | ● eclipsed | a vast shadow straddling the road |
| 9 | Valley of the Shadow | lonely darkness, daybreak | the darkest of the game, near-black blue-green | ● gone, then the day breaks | the sun rising behind him, showing the dangers passed |
| 10 | Faithful (Talkative) | companionship | ordinary amber daylight | steady | two pilgrims walking together, two shadows |
| 11 | Vanity Fair | glare, grief, glory | gaudy false colour; no true gold anywhere | ● drowned by false lamps | Faithful taken up in a chariot of light |
| 12 | Hopeful, By-ends, Demas | temptation by gain | olive and dove-grey; a cold metallic silver | steady | the mine's cold glint beside a pillar of salt |
| 13 | By-path Meadow, Doubting Castle | the deepest fall, the key | soft green lure, then dungeon black | ● none at all inside | a key turning and light through the opening door |
| 14 | Delectable Mountains | assurance glimpsed | **the first full clear blue and green** | the City's gate through the glass | the shepherds' glass |
| 15 | Ignorance, the Flatterer | deception | fading gold, a false white | ● confused by the false white | a white robe falling away to show a net |
| 16 | Enchanted Ground | drowsiness | honey and lilac haze, values collapsing | soft, far | two friends keeping each other awake |
| 17 | Beulah, the River, the City | sweetness, death, glory | the brightest land; the River one cold dark band; gold to white | **is** the City | Hopeful holding his head above the River, the City beyond |

**Checks:** nothing before 5 outshines 5's dawn; 9's dawn outshines 5's in value; 14's blue outshines 7's glimpse; 17 outshines all; neighbouring levels never share a key; the darks rhyme (2 and the River, Sinai and Apollyon, the Valley and the dungeon). Proposal: render this strip in code (17 thumbnails at 96 × 54 from each level's settings) and keep it in `concept/`, so every level chat checks its strongest colour against its neighbours. (01 §9, 02 §4.1, 08 §4)

---

## 4. Rules a program can check (from 01 §10 and 02 §4.5; proposals)

1. **One value ladder.** The far light is the lightest mark; Christian differs from the ground directly behind him by at least 30% lightness, warned in the stills tools.
2. **Layer steps.** Neighbouring depth layers differ by 8 to 20% lightness; 3 to 5 layers a scene (sky, far, middle, near, ground), each scene's palette five colours.
3. **Contrast and edge softness fall with distance**; outline detail on ridges about `(1 - d)^1.5` of the near layer's; the nearest layer the least detailed.
4. **Lose part of every long edge** (at least 10% of any edge longer than a third of the screen sinks into haze).
5. **The hardest edges only at the focus** (Christian, the far light, the act's target).
6. **Shadows cool and keep their colour**; light warm.
7. **One saturated accent per screen at most.**
8. **Derive the layers' colours from the sky** (as `layerCol` does), so dawn, rain and night re-key a picture together and levels meet at their seams.
9. **Thumbnail test**: every new scene must read at 96 × 54, blurred (three or four masses, the figure and the light findable).
10. **The held breath and the empty beat**: 1 to 3 s still before each reveal; 5 to 15 s of plain walking after; never two "stunning" pictures without an empty walk between.
11. **Figure size floor**: Christian at least 1/7 of the picture's height while the child steers.
12. **Every act changes the picture**, not only the words (GRIS).

---

## 5. Ideas worth bringing to the owner (each a choice, many departures)

**Look and frame**
- **The contents page as a road map** after Ogilby's *Britannia* (1675: scroll strips of English roads with every church, mill and turning drawn small, the same years Bunyan wrote), wrong turnings marked; or a ribbon of the whole journey in each level's key tones, dark to light (06's Norman Adams). (05, 06)
- **An emblem card between levels**, after the Puritans' one sanctioned picture (a picture held by a motto and a verse) and Bunyan's own children's emblem book of 1686; or a "haiga" page per level in a keepsake book: one small drawing and one Bunyan line (Bashō, Buson). (05, 03)
- **Transitions through mist bands** (Japanese *kasumi*) or a kept silhouette that paints into the next scene (Petrov), never black, the same way every time. (03, 04)
- **Kuindzhi's trick for holy light**: darken everything away from the light rather than brightening the light. (04)
- **A faint shared paper grain** over everything, felt not seen, so code, painted pictures and video figures sit in one medium (Cartoon Saloon). (01, 02)
- **"Pillow shots"** after a big moment: two seconds of one object with no figure (the burden at the tomb's mouth, the shut gate, the lantern). (07)
- **The Shining Ones**: keep them faceless light, perhaps with the long trailing sashes of Korean *seonnyeo* in Gim Jun-geun's pictures, gracious rather than ghostly; study Raigō paintings only for how light *arrives*. (06, 03)
- **Bedfordshire for the later levels**: timber-framed houses, post windmills, Elstow's bell tower standing apart from its church; local tradition ties Hill Difficulty to Ampthill and Palace Beautiful to Houghton House. (05)
- **Level references**: Hill Difficulty after Doré's *Burden of Pride*; the Delectable Mountains' glimpse after Nielsen's *Soria Moria Castle*; the Valley and the mountains by repeat-and-recede (Nihei, Harris); the Celestial City after Doré's *Paradiso* rose of light; the River after Sime. (07)

**Story**
- **End with Bunyan's waking line**, "So I awoke, and behold it was a dream", and have the game's last picture before waking rhyme with its first. (08)
- **Rhymes built on purpose**: the Slough and the River (same chest-deep framing, Help's hand and Hopeful's arm), the two gates, the two rolls, the two hills (Sinai not to be climbed, Difficulty to be climbed). (08)
- **The hard parts honestly**: keep Charity's question about his family (Level 7), keep Ignorance quietly, show Faithful's death as the chariot of light, leave out the Pope. (08)
- **Level 9**: the fiend's whispers as faint sound from behind, and one storyteller line that they were not his own thoughts: for a child, reassurance. (08)
- **Level 13**: no far light at all inside the castle; its return as the door opens is the moment. (08)

**Real lives (09)**
- An optional back page in the book, **"Others who walked the road"**: one quiet card per finished level, never interrupting the story: Bunyan (the tinker on the village green), Newton (the storm; "the song you heard along the road"), Luther, Augustine ("take up and read"), Spurgeon in the snow ("Look!") for the Cross. Each drawn in the game's own look, a few plain sentences, quotes checked against primary texts first (allow `gutenberg.org` to do that), living people left out.

**Sound (10)**
- **A cast of sounds, one meaning each, all game long**: helpers share one phrase (Old Hundredth's first line); tempters get too-sweet music; danger is the world falling silent and one deep sound; the Shining Ones a wordless choir led by one boy treble (three times only); companions two voices together.
- **A low drone under the burden in Levels 1 to 5, cut (not faded) at the Cross**, never to return: the child feels the loss of a sound they never noticed.
- **The second walking tune: Monks Gate**, the folk tune of Bunyan's own "Who would true valour see" (the melody is free; Vaughan Williams's harmony is in UK copyright until 2028), bare on a recorder, joined by a second voice when Faithful or Hopeful walks with him.
- **Lining out Psalm 23** in the Valley of the Shadow: a voice ahead in the dark, later revealed as Faithful's (in the book Christian hears a voice going before him).
- **Every touch pitched to the moment's key** (Journey).
- Playford's 1651 dance tunes for Vanity Fair, stopping dead at Faithful's arrest; bells only twice (Elstow's at the start, the City's at the end).

**2200 (07)**: if the gentle apocalypse is made, **"C · The green return"** fits the book best (*Nausicaä*'s healing forest: what looks like ruin is the healing, Bunyan's labourers mending the Slough); the far light must look exactly the same in 1678 and 2200. Beksiński and Bilal are the limits not to cross.

---

## 6. What the owner decides next

1. **Mark the taste picker.** About 100 pictures from every tradition; Love / Like / Not for this game, with a few words where something strikes. A second round will follow from what the marks show.
2. **The colour script** (section 3): accept as the plan for Levels 6 onward, and whether to quieten Level 3's opening gold so the Cross outshines it.
3. **The returning frame** and **the road's shape-language** (section 2, items 5 and 6) as rules for every level.
4. Whether to add **"Others who walked the road"**, the **burden's drone**, **Monks Gate** as the second tune.
