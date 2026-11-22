# 7. The Cross as the summit of reverence, and a choir

Researcher (b) of the awe brief (`vision/awe-brief.md`). The owner: "a choir singing at some point (or multiple pts) at the cross maybe him at his knees". Ideas only; nothing built, nothing spent, no game file touched.

## What the book gives, and what it does not

- **The Cross, `{93}` and `{94}`:** the burden falls by itself and tumbles into the sepulchre; "Then was Christian glad and lightsome, and said, with a merry heart, 'He hath given me rest by his sorrow, and life by his death.' Then he **stood still** awhile to look and wonder ... He looked therefore, and looked again, even till the springs that were in his head sent the waters down his cheeks. Now, **as he stood** looking and weeping, behold three Shining Ones came to him ..."; then the three leaps, and he "went on **singing**" his own verse.
- So the book **does not kneel him** and **has no choir at the Cross**. It says twice that he stood. It leaves one gap: the moment after "I saw it no more" and before "glad and lightsome" is silent in the book. That is where a kneel can live without contradicting a word.
- The only singing at the Cross is Christian's own. The only heavenly beings are the three Shining Ones, and the book gives them no music there. A choir at the Cross is therefore **ours**, and it is truest to the book when it is **the sound of the Shining Ones' coming** (at the River and the Gate the same beings come "with melodious noise ... as if heaven itself was come down", `{396}`, `{397}`).
- **Where the book really does have heavenly music:** the Celestial Gate (`{396}` to `{402}`: trumpeters "with melodious noises, and loud"; "all the bells in the city rang again for joy"; the men "sang with a loud voice, Blessing and honour, and glory, and power ..."; within, "Holy, holy, holy is the Lord"). Elsewhere: Faithful's chariot "with sound of trumpet" (`{242}`), the trumpet of the dream in room 7 (`{89}`), the palace top's "Come in, come in; Eternal glory thou shalt win" (`{83}`, already in Level 4 as spoken voices), the birds of Beulah (`{382}`), and Christian singing alone many times (the Cross, the chamber called Peace at sunrise `{131}`, after the Valley `{168}`, after the dungeon). The Shepherds (`{295}` to `{306}`) do not sing; the pilgrims sing after looking through the glass on the hill Clear (`{305}`).

## How Level 5 plays now (`cross.js`)

Burden loosens (`LOOSED`) → tumbles into the cave (`TUMBLE`, about 8 s) → `gone`: 150 quiet ticks (2.5 s), the sun begins (`goldTo`), 60 ticks later Amazing Grace starts, **synthesised note by note in the browser** (`hymn`, `hymnTick`, `TUNE`, `BASS`, `CHORDS`, G major, `BEATT` 34, about 27 s) → at beat 12 Christian's "rest by his sorrow" (`GLAD`), at beat 25 "stood still ... looked and looked again" (`LOOKED`) with the close-up and the tears → hymn ends, a three-note chime, the Shining Ones fade in (`shine`) → `SHINE` talk (about 8 lines, the roll touched) → `LEAPS` (three touches, G B D, then "Blest cross!") → walks on. He stands the whole time (the clip's frames 52 to 70, `clipHold`). There is no MP3 music in Level 5: `musCue()` in `index.html` returns null whenever `CR.on`.

## The idea list

### 1. THE KNEEL IN THE SILENCE (the heart of this report)

- **WHERE:** Level 5, phase `gone`, between "I saw it no more" (`{93}`) and "glad and lightsome" (`{94}`).
- **WHAT:** the burden is gone; a long quiet (about 6 s, up from 2.5): only the wind on the hill and, far off, one lark. A second into it, unasked, he sinks to his knees facing the cross (the kneel, frames 0 to 50 at its own pace, about 4 s) and stays there, clasped hands, bowed head, breathing (frames 50 to 95, played back and forth, as Level 3 does). On his knees the sun comes up exactly behind the crossing and the colour comes back; Amazing Grace begins, whole, the one plain line as now. About a third of the way through the hymn he **rises** (the same frames backwards, about 4 s) and, standing, says "He hath given me rest by his sorrow, and life by his death." Then "He stood still to wonder ..." is true to the letter: he is standing. Sketch: `concept/awe/cross-kneel-sunrise.jpg`.
- **WHY TRUE:** the book's silence is filled with a body, not a word; every spoken line keeps its order and its "stood"; kneeling is the oldest picture of what "glad and lightsome" costs before it comes. The kneel already exists (`KNEEL`, `KNEEL_META` in `index.html`, made in build 197 "versatile ... at foot of cross").
- **COST:** free, but the kneel pack still carries the burden. Two free ways: (a) paint the burden out of its 96 frames offline (OpenCV inpainting, as the book was painted out in build 189; the robe is plain there, about an evening's work); (b) one free Modal clip from the cross clip's burdenless frame 60 (first picture) to his kneeling (last picture: kneel frame 70 with the burden cut, as in the sketch), so the join is exact. (b) is cleaner because it starts from the very picture he stands in. **The new coat must NOT be on him yet** (the Shining Ones give it after), so this kneel is in his old rags, unburdened.
- **RISK:** too long without a voice (19 s from the cave to his first word). The sunrise and the hymn carry it; if it drags, shorten the silence to 4 s, never the kneel. Departure to list: the kneel is ours.
- **Alternative B, if the owner wants the knees and the choir at once:** he stands when the Shining Ones come (the book's "as he stood"), and **kneels to receive the mark on his forehead** (`{94}`, the third Shining One), rising in his new clothes to take the roll: a knight's accolade, under the choir's swell. Also no word contradicted. Weaker than A: the kneel then serves a ceremony, not the falling of the burden, and the Shining Ones' talk is already the busiest stretch of the level.

### 2. THE CHOIR AS THE SHINING ONES' COMING

- **WHERE:** Level 5, from the hymn's last chord through `SHINE`, ending at "So they went their way" (`{94}`).
- **WHAT:** the hymn ends on its G chord. Out of that last chord **one boy treble** sings a long "ah" on D, alone, soft. As it holds, the three Shining Ones begin to fade in where they stand, and with them **a wordless choir** (sopranos, altos, tenors, basses on "ah") blooms under the treble into a slow, wide G major. The choir is what their light sounds like: it comes as they come and goes as they go. It sinks under each spoken line (the music player already ducks to .42 under a voice, `SPK`), rises a little between them, swells once as they go up into the light, and dies away into the world's own quiet. The leaps then ring their three plain notes alone, and Christian's own spoken "Blest cross!" ends it: the sequence closes on his voice, as the book closes on his singing. Diagram: `concept/awe/cross-choir-timeline.jpg`.
- **THE ORDER (why it builds and does not compete):** silence → one line (the hymn, plain, no harmony to speak of) → one voice (the treble) → many voices (the choir with the Shining Ones) → his own voice (his song). Each step adds one thing. **The choir never sounds under the hymn and never sings the hymn's tune**, so Amazing Grace stays whole and alone here, and keeps its rule (whole only here and at the Celestial Gate).
- **Wordless or sung?** Wordless. (1) Sung text over the storyteller would be two sets of words at once, the thing build 450 made a rule against. (2) Any text is a theology the book did not put there (a Latin "Agnus Dei" or "Ave verum" is a Mass text in a Puritan's book; an English verse is a hymn we chose, not Bunyan). (3) "Ah" is what the Shining Ones' "melodious noise" sounds like to a child: heavenly, not churchy. (4) It saves sung words for the one place the book gives them: the Gate's "Holy, holy, holy".
- **The boy treble:** yes, but as the **first voice of the choir piece**, not a separate solo. A child hears a child's voice first; one voice before many is the clearest possible build. A treble singing words, or alone for long, would turn it into a church service.
- **WHY TRUE:** the Shining Ones are heaven's; at the River and the Gate heaven comes with music. Departure to list: music with the Shining Ones at the Cross is ours.
- **COST:** one paid piece (prompt A below, about 8 cents; budget 16 for one retake) or the free stand-in (idea 6).
- **RISK:** sentimentality (a big film choir). Keep it slow, a cappella, mostly quiet, one swell; at most about 45 s heard; level about .35 (`MUSV`).

### 3. A LONGER, BARER SILENCE

- **WHERE:** Level 5, `gone`, `quietG` 150 → about 360 ticks.
- **WHAT:** nothing but wind and one far lark while he goes down on his knees. No pad (it already fades in `padTick`), no chime.
- **WHY:** awe needs the quiet before it; the louder the end, the deeper the silence must be. **COST:** free. **RISK:** a child thinks it has stopped: he is moving (kneeling), so it reads as on purpose.

### 4. A GLIMPSE OF THE CHOIR FROM THE HILL CLEAR (Level 14)

- **WHERE:** Level 14, the Delectable Mountains, the perspective glass on the hill Clear (`{304}`, `{305}`): "they thought they saw something like the gate, and also some of the glory of the place", but their hands shook.
- **WHAT:** as the child holds the glass steady, the far gate shimmers, and very faintly, as if from miles off through mist, **the Cross's choir** is heard: the same treble's D and two bars of the chord. When the glass trembles (the book's shaking hands) it is lost, mid-breath. Then the pilgrims' own song (spoken).
- **WHY:** the child recognises the sound from the Cross without a word: the place the Shining Ones came from is the place they are going. **COST:** free (cut 8 to 10 s from the Cross piece, low-passed and given a long far reverb in code), or a Lyria clip (prompt B, about 4 cents). **RISK:** small; keep it under ten seconds.

### 5. THE CELESTIAL GATE, THE ONLY CHOIR WITH WORDS (Level 16)

- **WHERE:** `{396}` to `{402}`.
- **WHAT:** the order of the Cross, grown: the trumpeters on the far bank and round them (the owner's ruling: **Amazing Grace whole on the King's trumpets**), then, as they go in at the gate, **all the bells of the city ring** (`{400}`), and over the bells the choir, now with words, the Cross's motif returned in full: "Holy, holy, holy" (`{402}`), the pilgrims' "Blessing and honour" said by the storyteller over it (`{400}`). The treble begins it again, then the choir, then bells.
- **WHY:** the book itself puts singing, bells and trumpets here and nowhere else. **COST:** about 8 cents (prompt C) plus free bells (a CC0 peal on Wikimedia Commons or OpenGameArt, to find when the level is built). **RISK:** loudness. Even here, one great swell and then quiet light.

### 6. A CODE-MADE CHOIR AS A FREE STAND-IN

- **WHAT:** the game already sings its hymn note by note in the browser; a choir "ah" can be made the same way to time the whole sequence before anything is paid for: per voice a sawtooth at the note's pitch with a slow 5 Hz vibrato (about 0.4%) and a little random drift, three or four copies a part detuned a few cents, through three band-pass filters at the formants of "ah" (about 730, 1090, 2440 Hz for men; 850, 1220, 2810 for the treble and sopranos), a breath of band-passed noise, 2 to 3 s swells, and a made reverb (a `ConvolverNode` on a 3 s decaying noise burst). Chords: G, then C/G, Em, D/F#, G (slowly, a few seconds each).
- **COST:** free. **RISK:** it will sound like an organ stop or a synth pad, not people. Honest use: a stand-in for timing, and the fallback if the MP3 has not loaded. **I cannot hear it: the owner's ears decide.**

### 7. CHOIR MOMENTS CONSIDERED AND LEFT OUT

- **Palace Beautiful at dawn** (`{131}`): he "awoke and sang" alone in the chamber called Peace. A single voice, his; a choir would take his song from him. Keep it his (spoken, or one of the three remembered hymn phrases, as the vision chat ruled).
- **Faithful's chariot** (`{242}`): "with sound of trumpet": a far trumpet only.
- **The Interpreter's palace top** (`{83}`): already has the voices from the palace speaking "Come in, come in"; a faint "ah" under them would foreshadow the Cross, but it spends the choir before its moment. Leave it.
- **Beulah** (`{382}`): Shining Ones walk there; the birds sing. Birds, not choir; the choir is kept for the Gate a minute later.
- **The Valley's sunrise** (`{166}`): a remembered hymn phrase, not a choir (ruled).
- **Rule proposed: the choir sounds only where the Shining Ones or the City are present: the Cross, a breath through the glass on Clear, the Gate. Three times in the whole game, one of them under ten seconds.**

## Top three

1. **The kneel in the silence** (idea 1, with 3): he goes down on his knees in a long bare silence as the burden vanishes, the sun rises on him kneeling, Amazing Grace begins, he rises and only then speaks. Free (paint the burden out of the kneel, or one free Modal clip from cross-clip frame 60); keeps every "stood" in the book.
2. **The choir as the Shining Ones' coming** (idea 2): out of the hymn's last chord a single boy treble on "ah", then a wordless a cappella choir that comes and goes with the three Shining Ones, ducking under their words, swelling as they leave; then his own voice. One Lyria piece, about 8 cents (16 with a retake).
3. **One choir motif in three places only** (ideas 4, 5): the Cross; a ten-second glimpse through the glass on Clear (free, cut from the Cross piece); and in full, with "Holy, holy, holy" and the bells, at the Celestial Gate (about 8 cents).

## The music source: free recordings against Google's music model

### Free recordings checked (licences read on each file's page through the Commons API, Nov 22)

| File (Wikimedia Commons) | Licence as stated | Verdict |
|---|---|---|
| `File:Byrd - Ave Verum Corpus (Stile Antico).ogg` (4:18), https://upload.wikimedia.org/wikipedia/commons/1/11/Byrd_-_Ave_Verum_Corpus_%28Stile_Antico%29.ogg | CC0, set by the uploader "StPaulsIndy" from its Vimeo video of a concert | Beautiful, but doubtful: a professional ensemble's performance released by the venue's account; the performers' own rights are not shown. Latin eucharistic text, sung words. **Not for the Cross.** |
| `File:Byrd 4-Part Mass - Agnus Dei.ogg` (3:19), https://upload.wikimedia.org/wikipedia/commons/7/78/Byrd_4-Part_Mass_-_Agnus_Dei.ogg ; also `- Kyrie.ogg` (2:18) | CC BY 3.0, Ensemble Morales | Clean licence (credit in `assets/sfx/CREDITS.txt`, as the knocks are). Usable only as cut fragments: a held final cadence could be lifted, pitch-shifted to G and looped. Latin words show through. **The best free fallback, a poor fit.** |
| `File:Nunc Dimittis Stanford in A Trinity Church Boston.ogg` (5:06) and `File:Magnificat Stanford in A ...ogg` | CC BY 3.0, Trinity Church Boston | Victorian Anglican with organ and English words ("Lord, now lettest thou thy servant depart in peace"): the text would suit the River, but organ and words make it a church service. Not recommended. |
| `File:Thomas Tallis Lamentations I (The Tudor Consort).ogg` (8:58) | CC BY 2.5 | Lamentation (grief): not the Cross; perhaps a far murmur in the Valley, if ever. |
| `File:Les petits chanteurs de Montigny Cantique de Jean Racine (Gabriel Faure).ogg` | CC BY-SA 2.0 | A boys' choir, French words, with accompaniment; share-alike. Not recommended. |
| `File:AmicusMeus.ogg`, `File:CaligaveruntVictoria.ogg` (Victoria) | "Public domain", but the tag is about the 1585 music; the recording comes from a third-party site with no licence shown | **Do not use.** |
| `File:Victimae Paschali Laudes.ogg` | Public domain (the uploader's own 2007 recording) | Genuinely free, but one voice singing Latin chant, Easter sequence. Not a choir. |
| `File:Handel - messiah - 44 hallelujah.ogg` | CC BY-SA 2.0 | Overfamiliar and loud. No. |

OpenGameArt (searched "choir", "choral", "heavenly", "angelic"): `zodik-deep-choir` (CC0), `heavenly-loop` (CC0, Flixberry Entertainment), `ethereal` (CC0), `timeless-choir-ambient` (CC-BY 4.0), `solemn-place` (CC-BY-SA 4.0), `fantasy-choir-3-orchestral-pieces` (CC0). These are sample-library "game choirs": fine licences, but likely the video-game sound the owner has turned away from every time. Worth one listen by the owner, no more. Musopen: no choral recordings found (its catalogue is mostly instrumental). Old 78s (Internet Archive, the Library of Congress National Jukebox; US recordings published before 1926 are now public domain in the US): real choirs, but hiss and a parlour style; at most a "memory" texture, not the Cross.

**Why free fails here:** the moment needs a choir that (1) has no words, (2) is in G and begins on the synthesised hymn's last chord, (3) starts with one treble, (4) holds quietly for about 45 s under speech and swells once. No free recording does all four, and cutting Latin motets to fit would give fragments with words showing through.

### Google's music model (`lyria-3-pro-preview`, about 8 cents a piece; `lyria-3-clip-preview` about 4 cents for 30 s; prompts written, NOT run; it may refuse a prompt for "RECITATION": reword, nothing is charged)

**Prompt A: the Cross (lyria-3-pro-preview, about 8 cents; allow one retake, 16 cents in all)**

> A slow, sacred, wordless a cappella choir, about two minutes long. No instruments at all: no organ, no strings, no piano, no percussion, no synthesizer pads. No lyrics: every voice sings only an open "ah" vowel. Key of G major, very slow and free in time, about 50 beats a minute, no pulse.
> It begins in silence. Then ONE boy treble, alone, sings a long, pure, soft "ah" on the note D above middle C, held for about eight seconds, with almost no vibrato, as if in a large stone church at dawn. Under it, very quietly, a full mixed choir (sopranos, altos, tenors, basses) enters on a wide G major chord with the basses on a low G. Over the next minute the choir moves very slowly through a few simple chords (G major, C major over G, E minor, D major with F sharp in the bass, back to G major), each held for several seconds, mostly very quiet (pianissimo), the treble floating above on long notes. Around ninety seconds in there is ONE gentle swell to a warm, glowing forte, the treble rising to a high G, then it softens again. It ends on a long, held, perfectly tuned G major chord that slowly dies away to nothing, with a natural church reverberation of about four seconds and then complete silence.
> The feeling is awe, peace and gentleness, light breaking at sunrise, for children; reverent and simple, never dramatic, never epic or cinematic, no big film-trailer choir, no soloist showing off. Warm, intimate, clean recording, the voices close but in a resonant space.

**Prompt B (optional, Level 14's glimpse; lyria-3-clip-preview, about 4 cents; or free, cut from A):**

> Twenty seconds of a wordless choir heard from very far away, as if across miles of mountain air and mist: a single boy treble on a long soft "ah" on D, a faint mixed choir on a G major chord under it, very quiet, blurred, the high frequencies softened by distance, a long hazy reverberation. No instruments, no lyrics. It fades in from nothing and is cut off gently mid-breath.

**Prompt C (Level 16, the Celestial Gate; lyria-3-pro-preview, about 8 cents; write the level first):**

> A joyful sacred choir, about two and a half minutes, with church bells. It begins with one boy treble alone on a long "ah" on D in G major, then a full mixed choir joins on a wide G major chord. After about thirty seconds the choir sings, slowly and radiantly, only these words, repeated: "Holy, holy, holy." Under and around it, many large church bells begin to ring a joyful peal, as when every bell of a great city rings at once, ringing freely, not a tune. Gentle brass may add long held notes but no melody. One great climax around two minutes, glowing rather than loud, then the bells and voices slowly fade, leaving the bells ringing far away and then silence. Reverent, radiant, full of light, for children; not a film trailer, no drums, no pop production.

(If the model refuses words, use Prompt C with "ah" in place of the words and let the storyteller say "Holy, holy, holy is the Lord" over it.)

### How it would play in the game (for whoever builds it)

- The piece goes in `assets/music/` (for example `l5-choir.mp3`, 112 kbps like the others), `MUS.choir`, `MUSV.choir` about .35, `MUS_ONCE.choir` (played once, no loop).
- `musCue()` today returns null whenever `CR.on`; it would return `'choir'` while `CR.peek()` reports the hymn's last bar or the `shine` phase until "So they went their way", then null (the player fades it over about 1.4 s). It already sinks to .42 under every voice (`SPK`).
- The hymn stays the synthesised line in `cross.js`; the treble's D should start a beat before the hymn's last G chord dies (prompt A starts with silence, so measure its first sound and use `MUS_SKIP`).
- The chime that now marks the Shining Ones (`chime([79, 83, 86])`) would go: the choir replaces it.

### Recommendation: one path

**Google's music model, Prompt A, one piece (about 8 cents, 16 with a retake)**, after first timing the whole sequence with the free code-made choir (idea 6) and the kneel. Free recordings were searched first and none fits the moment without words showing, licence doubts or a church-service sound; the one clean free fallback is a cut and pitch-shifted cadence from the Byrd Agnus Dei (CC BY 3.0, Ensemble Morales), credited. Then reuse the bought piece for Level 14's glimpse for free, and pay once more (Prompt C) only when the Celestial Gate is built.

## Sketches (free, drawn in code)

- `concept/awe/cross-kneel-sunrise.jpg` (1600 x 900): the game's layered look at sunrise: pale far ridges in haze, the long dark slope rising to the crown in the right third, the plain cross with the sun just behind its crossing, a flat warm pool of light on the crown, a gold rim along it, and Christian kneeling on the crown facing the cross, hands clasped, head bowed: his own kneel frame 72 from `assets/christian-kneel.pack`, darkened to a silhouette, **the burden cut away roughly by hand for the sketch only** (the real frames need it painted out, idea 1).
- `concept/awe/cross-choir-timeline.jpg` (1600 x 900): the proposed Cross sequence in seconds from the burden's fall into the cave: picture, his pose (stand, down, kneel, up, stand, leaps), voices, the world's sound, the hymn, the treble, the choir, the leap notes; and the order "silence > one line > one voice > many voices > his own voice".

## Departures this would add (to list if built)

- He kneels at the Cross after the burden is gone (the book: he stood; the kneel falls in the book's silence, and he stands again before he speaks).
- A wordless choir, opened by one treble, sounds with the Shining Ones at the Cross (the book gives them no music there).
- The Cross's choir heard faintly through the glass on Clear (Level 14).
