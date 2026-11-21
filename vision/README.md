# Vision for the game (vision chat, after build 393)

The owner asked: (1) mine how others have depicted the book, with ideas for every level; (2) go over the book and the whole game for ways it can be truer to the book, where it falls short, and how it can be more artistic and more compelling; and brainstorm the later levels. **Nothing in the game was changed and nothing was spent.** Five research passes were run in parallel; their full reports are in this folder:

| File | What it holds |
|---|---|
| `1-how-artists-drew-it.md` | 350 years of pictures: the first woodcuts, the road maps, Stothard, Blake, Martin, Palmer, the Victorians, the 1850 Moving Panorama, Strang, the Rheads, Byam Shaw, picture books, glass and bronze; ideas per level 1 to 17; free reference sets to study |
| `2-films-stage-games.md` | films (1912, 1950, 1978, Dangerous Journey 1985, 2019), Vaughan Williams's opera, panoramas and magic lanterns, radio, board games, the two video games; ideas per level; 25 ways gentle games hold children without challenge |
| `3-levels-1-5-against-the-book.md` | levels 1 to 5 read line by line against Bunyan: what is missing, new departures, plainer lines nearer his words, meaning risks, fixes ranked |
| `4-levels-1-5-art-and-engagement.md` | levels 1 to 5 played headless and looked at in stills: what is beautiful, what breaks the spell, pacing, 28 improvements ranked |
| `5-levels-6-onward.md` | levels 6 to the end from the book: beats, cuts, key lines, one picture and master, the child's acts, gentle and standard tellings of the dark parts, stand-ins, sound, easter eggs, cost |

**How far to trust it.** The book and the game were read directly. Much of the web could not be opened from here (Wikipedia, archive.org, several museum sites), so the research files mark each item as checked (✔ / [V]) or from memory (◇ / [M]); confirm a memory item before quoting it. Sound and motion were judged from code, not heard or watched. Every idea that is not in Bunyan is a departure and needs the owner's yes.

---

## The vision in one paragraph

**The game is a moving panorama with a child's hand on it.** Its true ancestor is the 1850 *Moving Panorama of Pilgrim's Progress*: one painted roll of the whole road, about 800 feet long, scrolled sideways past an audience with a narrator and music, scenes designed by the best landscape painters of the day (Church, Cropsey, Huntington). That is this game's form, 175 years early, and it never had what this game has: **the child carries the burden**. Every adaptation agrees the burden is the hook; every faithful version is criticised for preaching and trudging; every version that drew the fiends in detail was rated too old for seven-year-olds; both video games of the book turned it into combat and are forgotten. So the way is clear and empty: a gentle, beautiful walk where **the place frightens and the creature is hardly seen**, where **what the child does is what the story means** (take the hand, knock, look to the light, hold up the shield, turn the key), and where **light and colour are the plot**: rain at the start, the first true dawn at the Cross, three nights afterwards each ending in a better morning, and at the end the far light the child has followed since the first screen turns out to be the City itself.

---

## Ten things the research agrees on

1. **The burden is the game's spine.** Keep it literal and visible, and make its weight felt in the child's thumb: heavier off the way (book `{46}`), released at the Cross by itself. From the Cross on, Christian's outline must change for good (artists always give him three outlines: bent and ragged, upright in a smooth coat, armed). Today he looks the same after the Cross; that is the biggest visual gap in the story.
2. **The "why" sentences were cut.** Faithful in order and in words, the game lost most of the lines that explain: why he flees (the city will be destroyed, `{11}`), "get it off myself, I cannot" (`{39}`), why Legality cannot help (`{57}`), "it will fall from thy back of itself" (`{68}`, unbuilt gate scene), and whose cross it is (`{94}`). Without them the Cross can read as a reward for climbing a hill. Most can be put back by rewording an existing line, not adding one.
3. **Fear as place, sound and shadow.** Martin's Valley, Church's Valley, Palmer's dusk, the opera's offstage Apollyon, Inside and Limbo: the threat is a shape passing in front, a voice, a shadow over the sun, absence of light. Never draw Apollyon or the Giant whole.
4. **Light and colour should rise to the Cross and beyond.** Today the most colourful moment of the game is the start of Level 3, the wrong way, and the Cross's dawn is paler. Write one colour plan (as `GOLD_MAX` does for the weather) so each level's strongest colour sits where the story says.
5. **One far light, always the same thing.** It is in nearly every picture of the book since 1679 (top corner). In the game it is the best idea and should be unmistakable: the largest light, the only one with rays; its hiding (Sinai, the Valley, the dungeon, the Flatterer) is the event, its return the reward.
6. **Hands are the game's language of grace.** Help, Evangelist, (Good-will), then Faithful lifting him, the Shepherds taking them by the hand, Hopeful holding his head up in the River (the River rhymes with the Slough in the book and in the pictures), the Shining Ones leading them up. Keep it as one gesture across the whole game.
7. **Level 4 is the weak middle.** Over a third of the game; small paintings on a phone; a different-looking Christian who is no longer steered; about twelve "touch X" acts that only start the next line; adult doctrine; seven verses read aloud. The book-and-art passes both point the same way: **code-drawn rooms to the standard of Level 3's gate, the game's own Christian steered from room to room along the house's real plan**, each master kept as one light and one quoted object.
8. **Level 5 is a sketch around the right idea.** The automatic fall of the burden is exactly the book; protect it. But: the tomb is hidden behind the words as the burden rolls in; the slope, cross and Shining Ones need the care Level 2's oak got; no voices yet; the end card says "not yet built". Strongest single idea: **after the silence, the child touches the faint light behind the cross** (the act Evangelist asked for in Level 1), and the sun rises and the hymn begins: the burden still falls by itself; what the child does is look.
9. **Don't let the talky levels trudge.** Everyone who adapted the book cut Talkative, By-ends, Ignorance and most of Faithful's stories. In the game those are 10, 12 and 15: each needs one strong picture and one act or it becomes "the 2019 film's tiring trudge". Choose their cuts in a `script.html`-style chooser before any voice is recorded.
10. **Keep the faltering.** The opera cut the Slough and Doubting Castle and was called static. The Slough, the lost roll, the dungeon and the sinking in the River are where children care. Loss without failure: something taken, something returned.

---

## Levels 1 to 5: what to do, ranked

Free unless marked. Full lists: `3-...md` section (f) and `4-...md` section 3.

### Truer to the book (mostly rewording lines, about a cent each to record)
1. **Level 3, the greeting:** "To that little gate ahead. I cannot get this burden off myself." (`{39}`) Same length; sets up Legality, Good-will and the Cross. The single most valuable line change.
2. **Level 3, Evangelist:** "No man was ever rid of his burden by Mr. Legality." (`{57}`)
3. **Until the gate scene is built,** give Good-will's promise somewhere at the end of Level 3: "Bear your burden a little longer. At the place of deliverance it will fall from your back of itself." (`{68}`) This is the promise the Cross keeps.
4. **Level 5 (voiced in build 394, after this review; a cent a line to redo):** say why the cross eases him ("that the sight of the cross should ease him of his burden", `{94}`); plain versions of the four old-worded storyteller lines; after the leaps, Bunyan's couplet "Blest cross! blest sepulchre! blest rather be / The Man that there was put to shame for me!"
5. **Level 1:** "this book tells me our city will be destroyed" (`{11}`); at his door, "He had told them of the danger, but they would not believe him" (`{11}`, `{18}`): it mends the hardest picture in the game for a parent and child, the children crying at a father who runs; "the city gate", so it is not taken for the wicket-gate.
6. **Level 2:** "the Slough of Despond" in full; Pliable's "Is this the happiness you told me of?"
7. **"Knock, and it shall be opened unto you"** spoken again at the gate (on the owner's keep list; cut in build 366).
8. **Room 1:** the painted grave person looks at us, but the line says "his eyes lifted up to heaven": change the line or the picture.

### More artistic
1. **Level 5:** tomb above the words; a hewn cross with a slight lean, not a stick; the dotted rim fixed (check against build 394 and later); Shining Ones as three tall persons of light, each stepping forward for his gift; mist in the hollows lifting with the sun; green into the hill and blue into the sky after the sunrise, so it is the most coloured moment so far.
2. **Level 3:** lift the two men off the dark rock at the mountain's foot (a paler mist behind, as on the path), so the kneel and Evangelist's hand can be seen on a phone.
3. **Level 1:** rebuild the city-gate finale on the wicket-gate's model: light pouring low and flat through the arch, the two men dark against it, the camera closer.
4. **Level 2:** three seams (a pale column in the mire, a hard edge under the home bank, the fears' dark reading as a lit window).
5. **Christian without the burden, in his new coat, for good after the Cross** (paint out free as the book was, free clips, or the mannequin). Blocks every later level too.
6. **Level 4's look decided** (see 7 above).

### More compelling
1. **Level 5:** touch the light to bring the dawn; shorten the climb by a third and let holding do less and less as he nears the top (his weight felt in the thumb); after the burden falls, let the child walk him a few paces lighter (quicker step, no creak).
2. **Level 4:** one continuous walk through the house behind the Interpreter's candle; drop or silence the seven read-aloud verses (or keep one); one plain line of meaning per room; the fire room's going-round as a real discovery; the palace's pressing-in as a hold the child does.
3. **Build the gate scene** between 3 and 4 (Good-will, the pull, the narrow way): the hinge the child now falls through, and the far light back at Level 4's start.
4. **Take out the "touch the cloud, or the fire" toy at Sinai** (it makes the mountain a plaything just as Christian quakes) or keep it very short. Owner's call.
5. ~~Voices for Level 5~~ (done in build 394, by the Cross chat, after this review).

---

## Levels 6 onward: the proposed shape

Full plan: `5-levels-6-onward.md`. Recommended: **sixteen levels** (merge the Flatterer and the Enchanted Ground); the **lions open Level 7** (they lie a furlong from the Palace's lodge, `{110}`), so Level 6 ends on "a very stately palace before him, the name of which was Beautiful"; Level 12 ends at the River of Life; and **Bunyan's own interval** at `{306}`/`{307}`, "So I awoke from my dream ... And I slept, and dreamed again", as a quiet card after Level 14: a second finish line.

| # | Level | One picture, after | The child's key act (examples) | Fear handled by |
|---|---|---|---|---|
| 6 | Hill Difficulty, the arbour, the lost roll | Friedrich: a tall climb up the screen | hold to climb on hands and knees; read the roll; walk back for it, find it | loss without failure |
| 7 | The lions, Palace Beautiful | Rembrandt / La Tour: candlelit house by night, the Mountains seen from the roof at dawn | walk the narrow middle between the chained lions; open the shutters; take sword and shield | roar and shadow, the chains seen |
| 8 | Apollyon | Martin / Blake: wings running out of both sides of the frame, a shadow over the sun | hold up the shield; touch the fallen sword; lay the healing leaves on him | a voice and a shadow, never the whole beast |
| 9 | Valley of the Shadow | a Whistler nocturne, near-black, then the first sunrise he walks into | hold the light of All-prayer; follow a voice ahead in the dark (Psalm 23) | darkness, whispers, the narrow path between ditch and quag |
| 10 | Faithful (and Talkative) | Hiroshige / Hasui: two travellers on a long road | catch up to Faithful; Faithful lifts him up (a hand) | none; keep it short and warm |
| 11 | Vanity Fair | Hasui night, a Bruegel crowd; the trial as shadow play | walk through without buying (fingers in his ears, Level 1's run again); Faithful's chariot | the death not shown: the chariot rising through the crowd |
| 12 | By-ends, the silver mine, Lot's wife, the River of Life | Whistler silver, then Corot green | refuse Demas; "Remember Lot's wife" (answers Level 1's "look back"); rest by the river | none |
| 13 | By-path Meadow, Doubting Castle | Victor Hugo ink wash: days told by one slit of light | the key called Promise (in the tray since the Cross, never explained) turns three locks, the last one hard | the Giant as legs and shadow only; never his counsel of self-harm |
| 14 | The Delectable Mountains | Samuel Palmer / Claude: ridge beyond ridge | hold the perspective glass steady (it trembles) to glimpse the gate | the hill Error and Caution seen far off, softly |
| 15 | The Flatterer, the Enchanted Ground | Corot haze, a soft land that wants them to stay | the net cut by a Shining One; keep Hopeful talking to stay awake (drowsiness slows the game) | the net, not the whipping |
| 16 | Beulah, the River, the City | Turner: the far light fills the screen | wade (Level 2's clips again); Hopeful's hand holding his head up (Help's hand returned); give in the roll at the gate; play the trumpets | an ending given, not won |

**Across them:** light goes through three nights to a land with no night; companions go alone, a voice ahead, Faithful, Hopeful; hands carry on as above; the **roll** is read, lost, found, carried, given in at the gate (the tray's whole reason); a **key** lies unnoticed in the tray from the Cross until the dungeon. **Music:** Amazing Grace silent after the Cross except three single remembered phrases at moments of grace, then whole once more at the Celestial Gate on the King's trumpets; a second, walking tune for the road (an old free tune: Tallis's Canon, Old Hundredth, or the plain folk melody under "He who would valiant be", Bunyan's own words), Crimond for Psalm 23 in the Valley.

**Rough cost:** about $36 to $38 at the notes' own prices if nothing is free; much less with the free clip sources and the mannequin.

---

## Ideas from 350 years of depictions, the best few

- **The Moving Panorama (1850-51)**, owned by the Saco Museum, Maine: a photographic record of the whole roll may be on archive.org (`bunyanpanorama_combinedlarge`, not opened from here). Church painted its Valley of the Shadow, Cropsey its Beulah. Idea: at the very end, the whole road unrolls as one ribbon, every level the child walked in one long picture.
- **The 18th-century "Plan of the Road" maps** (Commons): the contents page as a road map that inks in as the child goes, with no numbers.
- **Blake's 28 watercolours (Frick):** the burden as a dark globe; Faithful's stories as small figures floating over the walkers (the "thought picture" the owner liked in Level 2); Sinai's fire pouring down like water.
- **The Barnard edition scans on Commons (`PProg NN`, about 70):** a full-length study for nearly every character still to design (Formalist, Timorous, Talkative, By-ends bowing, Giant Despair, Ignorance, Atheist laughing).
- **The 1978 film's doubling** (one actor for the helpers, one for the tempters): give the helpers one shared musical phrase and the tempters Level 3's too-sweet tune, so a child reads who is who without words.
- **Vaughan Williams's opera:** the River ended by trumpets from the far side; a bird singing on the Delectable Mountains (details from memory, to check).
- **Dangerous Journey (1985):** still watercolours, one narrator, short parts with a one-line recap, rated for six-year-olds: the game's tone is proven.
- **Faithful's death** in the woodcuts and on Bedford's bronze doors (Thrupp): the chariot rising through the clouds, not the fire.
- **Gentle games:** a far goal always in view (Journey); colour returning as the story heals (GRIS); the act is the meaning (Florence); a journal that fills by itself (Alba); short whole sessions, one level a night (Florence, A Short Hike); a changed world to walk again (after the Cross, the earlier levels without the burden, in tune, with one new thing to find).

---

## Decisions for the owner (in order of how much they block)

1. **Christian after the Cross:** how he is drawn without the burden, in a new coat, and later armed (paint out free / free clips / the mannequin). Blocks Level 5's finish and every later level.
2. **Level 4's look:** code-drawn rooms with the steered Christian (recommended), or the oil paintings kept.
3. **The dark parts:** one switch for all of them ("Shew the darker places", reusing `pp-dark`), or rulings level by level. Recommended always, whatever the switch: never the Giant's counsel of self-harm; the Flatterer's description reworded; Pope and Pagan's cave cut.
4. **Ignorance's end** (the way to hell "even from the gates of heaven"): the plan recommends keeping the book's place but quietly (no certificate, no answer, led toward the door in the hill).
5. **Sixteen levels or seventeen**, the lions moved to 7, Bunyan's "I awoke ... and dreamed again" as an interval.
6. **Music after the Cross:** the second tune, and Amazing Grace held back until the trumpets.
7. **The quick line fixes** for levels 1 to 5 above (a few cents of voices).
8. **Additions:** Faithful glimpsed at the gate; one closing line that his family followed (Part Two).
