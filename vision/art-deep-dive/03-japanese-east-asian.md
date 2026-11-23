# 03. Japanese and East Asian art as a source for the game

Art-school deep dive, researcher 3 of 12. **Nothing in the game was changed and nothing was spent.**

**How far to trust it.** Marks: **[V]** checked this session (a web search result or the Wikimedia Commons API); **[M]** from memory or general art-historical knowledge, not checked here. Several hosts could not be reached from this session (metmuseum.org, the Yamanashi Prefectural University paper, archive.org). Every Commons file in section 9 was looked up through the Commons API this session: it exists, and its size and licence tag are as given.

---

## 1. Why this tradition fits this game

The game's settled look, "atmospheric layered silhouettes ... each depth layer basically one colour, overlapping with haze, pale far layers, darker near layers", is close to the grammar of East Asian landscape. That is no accident: the look was partly picked against Hasui and Yoshida. The fit goes deeper than style, though. Three points.

1. **The road series is a pilgrim's genre.** Hiroshige's *Fifty-three Stations of the Tōkaidō* (Hōeidō edition, 1833–34) and *Sixty-nine Stations of the Kisokaidō* (with Eisen, 1834–42) are journeys told as a run of places on one road. Each print is one station, one weather, one time of day and small travellers, and the series runs from dawn departure to arrival [M]. *The Pilgrim's Progress* has the same shape: a road, stations (the Slough, the Gate, the House, the Cross, the Hill), and weather that tells the story. The game's level-by-level weather (rain at the start, gold at the end, `GOLD_MAX` rising level by level) is already a Hiroshige idea.
2. **Pilgrimage was a mass practice in Japan, and art served it.** The Kumano pilgrimage mandalas (*Kumano sankei mandara*, 16th–17th c.) show the whole road to the shrines on one painted sheet, tiny pilgrims climbing through mist bands from the sea to the sacred falls, with sun and moon in the upper corners [M]. The related *Kanshin jikkai mandara* (Mind-Contemplation Ten Realms mandala), carried by Kumano nuns (*bikuni*), shows a life as an arch: a couple climb a "slope of age" from birth to old age, and below lie the hells and above the Pure Land [M]. Both are teaching pictures for ordinary and often illiterate people, which is what this game is for a 7-year-old. The 88-temple Shikoku pilgrimage (*henro*) adds the figure of the lone walker in white with a staff and sedge hat, whose clothes say "I walk with Kōbō Daishi" (*dōgyō ninin*, "two walking together") [M]. Its echo is Christian, never wholly alone on the road.
3. **East Asian painting treats emptiness and mist as material.** The game's rules come from the owner: "stripped down and elegant", "if you have a few things it begs for more", one special thing at a time, mist placed behind or beside a figure and never between. These are the working rules of ink painting. They have names there (*ma*, *yohaku*, the "three distances"). Those names give the owner and future chats a shared vocabulary.

---

## 2. The principles, and how each maps to code

### 2.1 Layered distance: Guo Xi's three distances

Guo Xi, Northern Song court painter, in *Linquan gaozhi* (*The Lofty Message of Forests and Streams*, compiled by his son Guo Si) names three ways of seeing mountains [M, a standard text]:
- **High distance (gāoyuǎn):** looking up from the foot at the peak. Fan Kuan's *Travellers among Mountains and Streams* (c. 1000) is the type: a huge central massif and tiny travellers with mules along the bottom.
- **Deep distance (shēnyuǎn):** looking from the front past mountains into the back, layer behind layer.
- **Level distance (píngyuǎn):** from a near hill across to far hills, the land flattening into haze.

**Mapping.** The game's flat side view is a **level distance** machine: `level(p)`, standing line = `HORIZON + 140 * p`, pale far and dark near. Level 3's camera pull-back under the burning hill, and the Cross hill of Level 5, are **high distance** moments. The rule "show a vast thing's size by what does not fit ... never by shrinking the person the child steers" is Fan Kuan's: the travellers are tiny, but they are at the bottom edge where the eye finds them first. The Level 4 gate cutaway with a vanishing point is the one place that drifts into Western linear perspective. That is fine, but it is the odd one out.

Code note: Guo Xi also wrote that mountains change "with every step" and with the seasons and hours [M]. Concretely: each `buildScenery` layer could take a small per-level **time-of-day tint** from a five-stop table (dawn, day, dusk, night, mist) rather than ad-hoc colours, so the whole game reads as one day-and-weather series, as Hiroshige's road does.

### 2.2 Mist as composition: *kasumi*, *yohaku*, Tōhaku's pines

In Japanese screens and scrolls, gold or pale **cloud bands** (*kasumi*, *suyari-gasumi*) cut across the scene. They hide what is not needed, join scenes that are far apart in space or time, and set the reading order [M]. Hasegawa Tōhaku's *Pine Trees* screens (late 16th c., Tokyo National Museum, National Treasure) are the most famous case of mist as the subject itself. Groups of pines in ink, some dark and crisp, some nearly gone; most of the paper bare; the eye fills the fog [V: Commons, both screens, 16,000 px wide]. The Japanese word *yohaku* ("left-over white") and the wider idea of **ma** (the interval, the pause that has its own weight) name this [M].

**Mapping.**
- The game already does Tōhaku in Level 2 (the oak and pale ghost trees) and in Level 3's veil of mist "in process of time". Make it a rule: **each level gets one Tōhaku passage, a stretch where most layers fade to the haze tone and only one or two shapes remain.** It is also a rest for the eye between story beats (the "LESS WAITING" rule says the stretches between stops should be short, and mist makes a short stretch feel spacious).
- **Cloud bands as transitions.** Level 3's mist to the gate and Level 4's passages are cuts. A *kasumi*-style band (a long, soft-edged horizontal band of pale tone sliding across the whole picture, its ends rounded, the way *Genji* scroll cloud bands are drawn) could be the game's single, recognisable **scene-join**: it rises from the bottom, holds, and draws away on the new place. In code: one baked soft-edged strip (`drawImage` stretched, never `ctx.filter`), animated in screen space.
- **Mist between depths, not on figures** is already the owner's rule. It matches ink practice: mist lies *between* planes, at the foot of the far plane, never across the subject.

### 2.3 Few colours, flat planes, gradient (*bokashi*)

Ukiyo-e colour is a few flat planes. The one luxury is **bokashi**, a gradient wiped onto the block by hand: Hiroshige's skies go from deep Prussian blue at the top to white, and his horizons glow with a band of red or yellow (*ichimonji bokashi*, the "one-line" gradient at the top edge) [M]. Shin-hanga (Hasui, Yoshida, Koson, c. 1915–1940) kept flat planes but added Western light: wet reflections, lamplight, moonlight, and many overprintings for depth. Yoshida's "*betsuzuri*" printed the same blocks in different colours to show the same place at different times of day [M; his *Sailing Boats* series, morning/forenoon/afternoon/evening/night, is the well-known case].

**Mapping.**
- Each layer is one tone (the game's rule) plus at most **one bokashi**: a vertical gradient (sky) or a gradient along the top edge of a hill layer (the "lit ridge"). This is already the "warm edge along the crag tops", and the owner turned it off in Level 3 build 217 because it did not fit there. The rule this gives: a lit edge only where the one light would really fall.
- **Yoshida's betsuzuri is a cheap, strong idea for the game:** reuse the same baked layer shapes under several palettes. A level revisited, or a scene shown at "dawn" and "dusk", costs one palette, not a redraw. The Cross (Level 5) already does a weak version (cold blue-grey to gold). Formalised, it gives **a palette table per moment, and every layer reads its tone from the table**.
- **Prussian blue**, the colour of the 1830s landscape boom, sits well with the game's cool shadows [M]. Its arrival is said to have made Hokusai's and Hiroshige's skies possible. As one accent colour, it would sit beside the owner's love of "nice color palettes" and the blue slate path of Level 3.

### 2.4 Asymmetry, diagonals, cropping

Ukiyo-e and Song painting avoid the centre: Ma Yuan ("One-Corner Ma") put the mass in one corner and left the rest to mist and water [M; *Walking on a Mountain Path in Spring*, Commons, verified]. Hiroshige cut a near tree or post with the picture's edge and set the far view through it. Van Gogh copied *Plum Park in Kameido* for exactly that framing [M]. Hokusai's *Great Wave* is a diagonal.

**Mapping.** The game's best stills already do this (the oak's long limb over the two men; the cross in the right third). Rule worth writing down: **the key object never at dead centre; a dark near shape cropped by the picture's edge frames the far view.** Code cost: one large near-layer silhouette (a trunk, post or eave) at parallax over 1, partly off-screen, at a story stop. This is the "near crags passing in front" of Level 3, used as a frame and not just as cover.

### 2.5 Notan

*Notan* (light-dark harmony, a term brought to the West by Arthur Wesley Dow's *Composition*, 1899, out of Japanese teaching) means designing the picture first as two or three flat values [M]. The game should be checked this way: **reduce any still to three greys. If it no longer reads, it will not read on a phone in sunlight.** This is a test, not a style. It fits the owner's "dark quiet silhouettes" and the lesson from the mannequin lab (the painting still won "when toned near-black, so most of the gap is the SILHOUETTE"). A tool idea: a `?notan` debug flag that posterises the drawn canvas to three levels for review stills.

### 2.6 Ink-wash and the brush (sumi-e, *haboku*)

Sesshū's *Haboku Sansui* ("splashed-ink landscape", 1495, Tokyo National Museum) builds a mountain, a tavern flag and two boatmen from a few wet blots and dry strokes [V: Commons]. His *View of Ama-no-Hashidate* (c. 1501–06) is a whole bay as a map-like long view [V]. The lesson for code drawing is that **edges should be "lost and found"**. Some edges dissolve into the paper and some are crisp, and the crisp ones are where the eye should go. The mannequin lab already found this ("lost and found edges", "a hand-made edge"). In code: draw each layer's outline as a soft fill, then one crisp stroke on part of it, chosen by where the light is. Never a uniform outline.

**Ōkami** (Clover Studio, 2006) is the only major game wholly in sumi-e, with a thick ink outline, parchment-paper filter and the "Celestial Brush" [M]. The lesson is a warning: its thick outlines suit an action game; a gentle walk wants Tōhaku's outline-less fog, not Ōkami's cartoon ink. What carries over: the **paper grain over everything** (one shared texture laid on all levels, at low strength) as the thread that makes every level look like one book. The game already does this on its title page (laid paper made in code) and could carry it into play.

### 2.7 Light descending: Raigō paintings and the Shining Ones

Japanese Pure Land Buddhism produced the **raigō** ("welcoming descent"): Amida Buddha and his bodhisattvas coming down on clouds to meet a dying believer [V: Columbia JAANUS and Kyoto National Museum pages found in search]. The *Hayaraigō* ("Swift Descent", Chion-in, Kyoto, 13th c.) is the great example. The cloud sweeps down a steep diagonal from the upper left across a mountain slope to a small house at lower right, and its trailing tail shows the speed [V: Commons "Rapid descent.jpg", 13th c., public domain]. Some raigō were hung at a deathbed with a five-coloured cord from the painting to the dying hand [V: search result, Columbia JAANUS].

This is a different religion and must not be quoted as itself. **Do not borrow figures, haloes or the cord.** What can be studied is the **pictorial mechanics of light arriving**, which apply to the Shining Ones (Level 5) and the Celestial City (Level 17):
- **Arrival by diagonal, not by appearance.** In the Hayaraigō, motion is carried by the cloud's long tail and the slope it runs down. The game's build 457 made the Shining Ones "just appear" by the owner's choice; keep that. But the **far light** (`HV`, heaven.js) could make one such diagonal descent, at the Celestial Gate only, the once-in-a-game event the awe critic asked for ("rays at most once a level").
- **Gold as light, not paint.** Raigō use cut gold leaf (*kirikane*) in fine lines so gold reads as shimmer. A code equivalent: a few hair-thin gold strokes laid with 'lighter' that breathe out of phase (as the oak's twinkles do), instead of a flat gold wash.
- **The welcoming party at the Celestial Gate** ({the River, Level 17}: "a company of the heavenly host came out to meet them") is Bunyan's own raigō-shaped scene. In Bunyan, though, the pilgrims cross the river themselves and are then met. The game should keep Bunyan's order.

### 2.8 Haiga and Bashō: the walk as a series of small stops

Bashō's *Oku no Hosomichi* (*Narrow Road to the Deep North*, 1689 journey) is prose with haiku at each stop. Yosa Buson later painted it as *haiga*, quick light pictures of the traveller beside the text, on scrolls and screens (1778–80) [V: Commons Met file "Scene from The Narrow Road to the Deep North", Buson, 1780]. Haiga keep the figure small, the line sparse, and leave the words room on the page.

**Mapping.** The game's words already sit "on the dark road under everyone's feet, no box". Bashō gives two things. (1) **Permission for silence between words.** One short line, then a long walk, is the haiku-journal rhythm, and it fits the "LESS WAITING" ruling (about two minutes of speech per level). (2) **The keepsake idea.** A haiga is a picture and a few words for one moment. The pause menu's keepsakes (`KS`) could add a page that fills up as he goes: one small ink drawing per level (the oak, the steps, the gate, the cross) with one line of Bunyan. It would be a "book of the road", a gentle reward that is not a score. It is close to the hymn's lights in spirit (discovered, never counted).

### 2.9 Modern descendants: Ghibli, Shinkai, Mushishi

- **Studio Ghibli** backgrounds (Kazuo Oga on *Totoro*; Nizo Yamamoto) hold the *Totoro* principle of **ma** as Miyazaki describes it: moments where nothing happens and the child just looks [M; Miyazaki's interview with Roger Ebert, 2002, is the usual source]. That supports the game's stillness rule.
- **Makoto Shinkai** (*The Garden of Words*, *Your Name*): light as the subject. Wet surfaces, lens bloom and backlit rain [M]. Too glossy for this game's watercolour, but one lesson fits Level 1: **rain is drawn as light**, falling lines catching the lamp and the door glow, brightest against dark. The game's rain could be brightest only near the lit doorways and the lamps (`LAMPS`), nearly invisible elsewhere.
- **Mushishi** (anime 2005) is quiet rural Japan, travelling healer, faint mist spirits [M]. It is the nearest tone match: wonder without spectacle, a lone walker, one strange light at a time.
- **Kintsugi** (gold-mended pottery) is a loose but child-legible picture of grace. The broken thing is mended with gold so the mend is the beauty [M]. It is a possible motif for the sealed roll or for the "new coat" moment, not a structural idea. It is Japanese craft, not scripture, so use it lightly, if at all.

---

## 3. *The Pilgrim's Progress* in Chinese and Japanese editions

- **Chinese.** William Chalmers Burns translated Part One into literary Chinese (Xiamen/Amoy, 1853), and versions followed in Mandarin and dialects [M, the 1853 date and Burns are standard]. Checked here: Commons holds scanned Harvard copies of a **1856 *Tian lu li cheng* (5 juan, [Hong Kong?])**, a **Shanghai 1869** edition, and the **Canton-vernacular *Tian lu li cheng tu hua* (天路歷程土話, Yangcheng: Hui shi li tang)** [V: Commons API metadata]. Library records date that last edition to 1871, translated by George Piercy for the Wesleyan Missionary Society [V: search, catalogue record]. A Shanghai 1906 edition is noted as illustrated [V: search, MDPI *Religions* 10/6/357]. Scholarship: Yao Dadui, *Translated Illustration and the Indigenization of Christianity in Late Qing Chinese Christian Novels* (Brill), on how the illustrations recast the story in Chinese religious and pictorial signs. The MDPI article says these missionary novels' woodcuts took "the stylistic features of Ming and Qing novel woodcuts in terms of lines, composition, character attire" [V: search snippets]. Widely reported but **not seen here [M/unverified]**: Christian drawn in Chinese robes, the Shining Ones as Chinese angels, the Celestial City as a Chinese walled city. **Worth a look by the owner:** the Canton edition's PDF on Commons (link in section 9). I could not render its pages here (the server rate-limited).
  - Lesson for us: the Chinese illustrators set Bunyan in **their own landscape conventions** (clouds as stylised bands, buildings in their own roofs, mountains in *cun* texture strokes). The game does the same with English trees and a 17th-century English town. It is a precedent that translating the *pictures* into a native idiom is faithful, not a departure.
- **Japanese.** The first Japanese translation came in the Meiji era. The Yamanashi paper gives it to Satō (Yoshimine/Kiho) in the 1870s, and gives Ike Kōkichi's 1904 version (Part One, Part Two in 1908) "four illustrations by Harold Copping" [V: search snippet of the Yamanashi Prefectural University paper, kgk2020004.pdf, not opened]. The National Diet Library lists W. J. White's translation, Christian Literature Society, 1893 [V: NDL record]. **I found no Japanese woodblock-style illustrated edition** (no confirmed Christian in Japanese dress). Treat any such claim as unverified until the Yamanashi paper is read; it examines the early editions' illustrations.

---

## 4. A short glossary for future chats

- *ma*: the meaningful interval
- *yohaku*: left-over white
- *kasumi*: mist or cloud bands
- *bokashi*: hand-wiped gradient
- *ichimonji bokashi*: a gradient band at the top edge
- *notan*: light-dark design
- *haboku*: splashed ink
- *cun*: Chinese texture strokes for rock
- *san yuan*: the three distances
- *shin-hanga*: "new prints", 1915–40
- *raigō*: welcoming descent
- *meisho-e*: pictures of famous places, the genre of Hiroshige's road series
- *betsuzuri*: alternative printing, one set of blocks in other colours

---

## 5. Concrete ideas, level by level

Each is free (code) unless marked. Each idea not in Bunyan is a departure and needs the owner's yes.

| # | Level | East Asian source | Idea |
|---|---|---|---|
| 1 | City of Destruction | Hiroshige *Shōno, Driving Rain*; *Kambara, Night Snow*; Hasui's lamplit rain | Rain as **slanting lines of two greys in overlapping sheets** (Shōno), not drops: brightest near the lit doors and lamps, nearly invisible on the dark. The city wall and gate seen as a Hiroshige *station*: one bold near post or eave cropped by the frame's edge, the gate through it. |
| 2 | Slough of Despond | Hiroshige *Mishima, Morning Mist*; Tōhaku pines | Already Tōhaku-like. Make the far ghost trees **three tones only, each fainter**, with whole stretches of bare mist (*yohaku*). Mishima's trick: near figures crisp, the next layer a flat pale silhouette with no detail, nothing beyond. |
| 3 | Worldly Wiseman, the hill | Fan Kuan; Hokusai *Shower below the Summit* (red Fuji over lightning) | The burning hill as **high distance**: the massif fills the upper picture, the tiny men at the bottom edge. Hokusai's *Sanka hakuu*: the peak calm and dark above, lightning only in the lower slopes. A model for "awe before fear" and for the owner's "restraint". The village of Morality as a Hiroshige station seen small at the foot. |
| 3 end | The wicket-gate | Hasui's night shrines and lantern-lit gates | One lantern and its pool (already done); Hasui's lesson is **the reflection**. A wet road at the gate mirrors only the lantern as a short vertical smear, a single shin-hanga touch. |
| 4 | Interpreter's House | Yoshida's interiors; Hasui's *Kiba evening* | The passages as **cloud-band transitions** (*kasumi*) instead of black fades: one recognisable join for the whole house. Room 2 (moonlit parlour) can borrow shin-hanga's flat shadow shapes on plaster. |
| 5 | The Cross | Raigō light; Ma Yuan's one corner; Hiroshige's *ichimonji* dawn | The hill in one corner (already right third), the rest open sky. Dawn as **ichimonji bokashi**: a band of warm colour along the top edge of the sky as well as at the horizon, the middle sky left pale. The Shining Ones: keep them as soft light. Study the Hayaraigō only for how gold reads as light (thin strokes, not a wash). |
| 6 | Hill Difficulty, the arbour, the lions | Hokusai *Kirifuri Falls* (pilgrims climbing beside a waterfall) | Vertical **high distance** for the hill: the path zig-zags up and the camera climbs beside it. The arbour as a small roofed shelter cropped at the frame's edge. The lions as two dark shapes in mist, chained (Tōhaku: hide most of them). |
| 7 | Palace Beautiful | Yoshida *Nigatsudō* (a hall at night, lit lantern, steps) | A great hall seen from below at dusk, one warm lit doorway at the top of steps; Hasui-style lamplight. |
| 8 | Apollyon | Hokusai *Great Wave* diagonal; Sesshū's *haboku* | Apollyon never drawn whole: a *haboku* blot of dark that grows across the valley on a diagonal like a wave's lip, darts as hair-thin lines. "The place frightens, the creature is hardly seen." |
| 9 | Valley of the Shadow | Tōhaku's pines in fog; Kumano mandala hells (only as layout) | Two dark walls with a narrow path; **mist as the whole picture**, only the near edge of the path and his figure crisp. The pit's mouth as one dark ink pool (yohaku reversed). |
| 10 | Faithful, Talkative | Bashō/Buson haiga | Two walkers small on a level-distance plain; a long walk with one line of talk at a time. |
| 11 | Vanity Fair | Hiroshige *Hundred Famous Views of Edo* (crowded night streets, lanterns) | The one level that should be busy: a woodblock night market with rows of lanterns in perspective. This is the owner's own note ("Vanity Fair at night"). Its false light must never use `HV` (critic's rule). |
| 12 | Hopeful, By-ends, the silver mine | Hiroshige mountain passes | Demas's mine as a single glint in a dark hillside, an ichimonji-like lit edge of silver along it. |
| 13 | By-path Meadow, Doubting Castle | Hiroshige *Shōno* rain; castle silhouettes | The storm that drives them in, as Shōno's slanting sheets; the castle a flat silhouette with one lit slit. |
| 14 | Delectable Mountains | Guo Xi *Early Spring*; Wang Ximeng *Thousand Li*; Yoshida *Lake Kawaguchi* | The game's most "shan shui" level: **deep distance**, layer after layer of mountains in turquoise and pale blue (Wang Ximeng's blue-green mode), shepherds tiny; the "perspective glass" view of the far City as a gold band at the horizon. |
| 15 | Ignorance, the Flatterer | Kasumi bands | The Flatterer's net as a flat pale band that closes across the picture like a cloud band, a false *kasumi*. |
| 16 | Enchanted Ground | Hasui moonlit scenes; Mushishi | A soft, drowsy, beautiful night: flat moonlit planes, almost no contrast, the only danger the loveliness. |
| 17 | Beulah, the River, the City | Raigō arrival; Hiroshige *Awa Naruto*; Turner (another chapter) | The river as Hiroshige's water, flat rows of curled crests in two tones, not a realistic surface; the far light's **one diagonal descent** (the critic's "rays at most once"): a long luminous band from upper right down to the far bank. |

Two cross-level ideas:
- **The game as a road series.** Each level's title card could be framed like a print in a series: a short title in a small cartouche at the picture's corner (as ukiyo-e put the series and station name in a coloured panel), e.g. "The Road to the Celestial City — The Third Station: The Hill". This is a light touch and needs the owner's yes. It sits with the contents page's book look.
- **A "Book of the Road" keepsake** (section 2.8): one haiga per level, ink drawing plus one Bunyan line, filled in as levels end.

---

## 6. What not to take

- **No Buddhist or Shinto iconography in the story's places.** No torii, Buddha figures, haloes or the raigō's five-coloured cord. Borrow composition and light only. The game is Bunyan's English Puritan world and stays English in its trees, houses and clothes ("plain English kinds only").
- **No thick ink outlines (Ōkami) and no anime faces.** The plain-face watercolour rule stands.
- **No Japanese cherry blossom, pagodas or bamboo** as decoration: the owner banned exotic trees ("don't [do] exotic ones").
- **Cloud bands must stay soft and pale**: the owner turned down stiff, opaque, "photographic" smoke and bands several times (Level 3 builds 258, 260, the crisp column). A kasumi band is soft-edged by nature, but test it at phone size.

---

## 7. Practical code recipes

1. **Bokashi sky:** one vertical `createLinearGradient` with 3 stops, plus an optional `ichimonji` band: a second gradient from the top edge, its colour 30–40% opacity, fading by 15% of height.
2. **Kasumi transition:** bake once a strip 4× the screen width × 0.35 height: a filled horizontal rounded shape with soft ends (draw it at 1/8 size and stretch up, the game's own soft-edge rule). Animate its y from below the picture to the middle and on up, over about 1.2 s, then reveal the new scene under it.
3. **Lost-and-found edge:** after filling a silhouette layer, stroke its outline once with a gradient stroke whose alpha follows the light direction (0 away, about .5 toward), 1 px. The rest of the edge stays the fill's own soft edge.
4. **Shōno rain:** two baked tiles of slanting lines (angle about 70°, two greys, alpha .15 and .25), scrolled at different speeds; mask them with a radial gradient round each lamp so the rain shows near lights. Cheap and clear on a phone.
5. **Hiroshige water:** flat bands with a repeating curled crest silhouette at their top edge in one lighter tone, scrolled slowly; never a mirror (keeps the owner's "a surface is never half mirror" rule).
6. **Notan check:** a `?notan` flag that draws the frame, reads it once per screenshot, and posterises to three greys for review stills (debug only, not every frame).

---

## 8. Sources consulted

- Commons API (file existence, sizes, licences): https://commons.wikimedia.org/w/api.php [V]
- Chinese editions, search results: Boston College Ricci catalogue https://web.bc.edu/ricci/indexSubject.php?id=19652 ; MDPI *Religions* 10(6):357 https://mdpi.com/2077-1444/10/6/357 ; Yao Dadui (Brill/HEP) https://journal.hep.com.cn/flsc/EN/10.3868/s010-005-016-0017-9 ; HathiTrust https://catalog.hathitrust.org/Record/100116148 [V, snippets only]
- Japanese editions: Yamanashi Prefectural University paper https://www.yamanashi-ken.ac.jp/media/kgk2020004.pdf (host blocked here; snippet via search) ; NDL https://ndlsearch.ndl.go.jp/en/books/R100000002-I000000874191 [V, snippets]
- Raigō: Columbia JAANUS https://projects.mcah.columbia.edu/jaanus/record/raig%C5%8Dzu ; Kyoto National Museum https://www.kyohaku.go.jp/eng/collection/meihin/butsuga/item06/ [V, snippets]
- Unreached here: metmuseum.org, archive.org (blocked in this session's network).
- From memory [M]: Guo Xi's *Linquan gaozhi*; Dow's *Composition*; Kumano mandalas; Shikoku *dōgyō ninin*; Ōkami; Miyazaki on *ma*; Burns 1853; Prussian blue in ukiyo-e.

---

## 9. Taste-picker: 26 public-domain images on Wikimedia Commons (all verified this session)

Every URL below was returned by the Commons API this session, with the licence tag shown. Notes on licences: the shin-hanga prints are all pre-1931 (public domain in the US); their artists died 1945–1957, so they are also public domain in Japan. The CC0 tags are museum releases (Met, Cleveland, Honolulu).

**Road series (ukiyo-e):**
1. *White Rain at Shōno* (Tōkaidō 46). Utagawa Hiroshige, 1833–34. CC0 (Met).
   https://upload.wikimedia.org/wikipedia/commons/1/11/Sh%C5%8Dno_Hakuu-%E6%9D%B1%E6%B5%B7%E9%81%93%E4%BA%94%E5%8D%81%E4%B8%89%E6%AC%A1%E4%B9%8B%E5%86%85_%E5%BA%84%E9%87%8E_%E7%99%BD%E9%9B%A8-White_Rain_at_Sh%C5%8Dno_MET_DP123230.jpg
2. *Kambara: Evening Snow* (Tōkaidō 16). Hiroshige, 1833–34. CC0 (Cleveland).
   https://upload.wikimedia.org/wikipedia/commons/b/b1/Ando_Hiroshige_-_Kambara-_Evening_Snow_-_1940.984_-_Cleveland_Museum_of_Art.jpg
3. *Mishima: Morning Mist* (Tōkaidō 12). Hiroshige, 1833–34. CC0 (Met).
   https://upload.wikimedia.org/wikipedia/commons/9/99/Mishima_Asa-Giri-%E6%9D%B1%E6%B5%B7%E9%81%93%E4%BA%94%E5%8D%81%E4%B8%89%E6%AC%A1%E4%B9%8B%E5%86%85_%E4%B8%89%E5%B3%B6_%E6%9C%9D%E9%9C%A7-Morning_Mist_MET_DP123235.jpg
4. *Hakone: View of the Lake* (Tōkaidō 11). Hiroshige, c. 1833–35. Public domain (MFA scan).
   https://upload.wikimedia.org/wikipedia/commons/f/f5/Hiroshige-53-Stations-Hoeido-11-Hakone-MFA-01.jpg
5. *Seba* (Kisokaidō, moonlit river). Hiroshige, 1834 [date per Library of Congress]. Public domain (Library of Congress).
   https://upload.wikimedia.org/wikipedia/commons/5/53/Seba_LCCN2008660647.jpg
6. *Moon Pine, Ueno* (100 Famous Views of Edo). Hiroshige, 1857. Public domain (Library of Congress).
   https://upload.wikimedia.org/wikipedia/commons/1/14/Ueno_sannai_tsuki_no_matsu_LCCN2008660968.jpg
7. *Naruto Whirlpool, Awa Province*. Hiroshige, c. 1853. CC0 (Met).
   https://upload.wikimedia.org/wikipedia/commons/6/67/%E5%85%AD%E5%8D%81%E4%BD%99%E5%B7%9E%E5%90%8D%E6%89%80%E5%9B%B3%E4%BC%9A_%E9%98%BF%E6%B3%A2_%E9%B3%B4%E9%96%80%E3%81%AE%E9%A2%A8%E6%B3%A2-Naruto_Whirlpool%2C_Awa_Province%2C_from_the_series_Views_of_Famous_Places_in_the_Sixty-Odd_Provinces_MET_DP122165.jpg
8. *Shower Below the Summit* (36 Views of Fuji). Katsushika Hokusai, c. 1830–32. Public domain.
   https://upload.wikimedia.org/wikipedia/commons/0/04/Katsushika_Hokusai_-_Shower_Below_the_Summit_%28Sanka_hakuu%29%2C_from_the_series_Thirty-six_Views_of_Mount_Fuji_%28Fugaku_sanjur..._-_Google_Art_Project.jpg
9. *Pilgrims at Kirifuri Waterfall*. Hokusai, c. 1831–32. Public domain.
   https://upload.wikimedia.org/wikipedia/commons/6/60/Katsushika_Hokusai%2C_Japanese_-_Pilgrims_at_Kirifuri_Waterfall_on_Mount_Kurokami_in_Shimotsuke_Province_-_Google_Art_Project.jpg

**Shin-hanga:**
10. *Matsushima in the Moonlight*. Kawase Hasui, 1919. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/f/f8/Tsuki_no_Matsushima_by_Kawase_Hasui.jpg
11. *Evening at Kiba* (Twelve Scenes of Tokyo). Hasui, 1920. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/1/13/T%C5%8Dky%C5%8D_j%C5%ABnidai%2C_Kiba_no_y%C5%ABgure_by_Kawase_Hasui.jpg
12. *Okane Path, Shiobara*. Hasui, 1918. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/0/07/Shiobara_okane-michi_by_Kawase_Hasui.jpg
13. *Yūhi Falls, Shiobara*. Hasui, 1920. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/8/84/Tabi_miyage_dai_issh%C5%AB%2C_Shiobara_Y%C5%ABhi_no_taki_by_Kawase_Hasui.jpg
14. *Lake Kawaguchi*. Yoshida Hiroshi, 1926. Public domain (Honolulu Museum of Art).
    https://upload.wikimedia.org/wikipedia/commons/9/90/Lake_Kawaguchi_by_Yoshida_Hiroshi%2C_1926%2C_woodblock_print%2C_Honolulu_Museum_of_Art.jpg
15. *Musashino*. Yoshida Hiroshi, 1928. Public domain (Honolulu).
    https://upload.wikimedia.org/wikipedia/commons/0/02/Musashino_by_Yoshida_Hiroshi%2C_1928%2C_woodblock_print%2C_Honolulu_Museum_of_Art.jpg
16. *Nigatsudō*. Yoshida Hiroshi, 1926. Public domain (Honolulu).
    https://upload.wikimedia.org/wikipedia/commons/8/8c/Nigatsud%C5%8D_by_Yoshida_Hiroshi%2C_1926%2C_woodblock_print%2C_Honolulu_Museum_of_Art.jpg
17. *Egrets in Snow*. Ohara Koson (Shōson), 1927. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/b/b6/Ohara_Shoson_%28Koson%29%2C_Egrets_in_Snow%2C_1927.jpg

**Ink and mist:**
18. *Pine Trees* (right-hand screen). Hasegawa Tōhaku, late 16th c. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/2/23/Hasegawa_Tohaku_-_Pine_Trees_%28Sh%C5%8Drin-zu_by%C5%8Dbu%29_-_right_hand_screen.jpg
19. *Pine Trees* (left-hand screen). Hasegawa Tōhaku, late 16th c. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/3/32/Hasegawa_Tohaku_-_Pine_Trees_%28Sh%C5%8Drin-zu_by%C5%8Dbu%29_-_left_hand_screen.jpg
20. *Haboku Sansui* (Splashed-ink Landscape). Sesshū Tōyō, 1495. Public domain. (Very tall file, 7183 × 31957.)
    https://upload.wikimedia.org/wikipedia/commons/8/8b/Sesshu_-_Haboku-Sansui_-_complete.jpg
21. *View of Ama-no-Hashidate*. Sesshū, c. 1501–06. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/7/7a/Sesshu_-_View_of_Ama-no-Hashidate.jpg
22. *Scene from The Narrow Road to the Deep North*. Yosa Buson, 1780. Public domain (Met).
    https://upload.wikimedia.org/wikipedia/commons/9/91/Yosa_Buson_-_Scene_from_The_Narrow_Road_to_the_Deep_North_%28Oku_no_hosomichi%29_-_2015.300.159_-_Metropolitan_Museum_of_Art.jpg

**Chinese shan shui:**
23. *Travellers among Mountains and Streams*. Fan Kuan, c. 1000. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/c/c2/Fan_Kuan_-_Travelers_Among_Mountains_and_Streams_-_Google_Art_Project.jpg
24. *Early Spring*. Guo Xi, 1072. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/8/86/Guo_Xi_-_Early_Spring_%28large%29.jpg
25. *Walking on a Mountain Path in Spring*. Ma Yuan, c. 1190–1225. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/c/c2/Ma_Yuan_Walking_on_Path_in_Spring.jpg
26. *A Thousand Li of Rivers and Mountains* (complete handscroll). Wang Ximeng, 1113. Public domain. (39974 × 1600: a picker should show a crop.)
    https://upload.wikimedia.org/wikipedia/commons/3/37/Wang_Ximeng._A_Thousand_Li_of_Rivers_and_Mountains._%28Complete%2C_51%2C3x1191%2C5_cm%29._1113._Palace_museum%2C_Beijing.jpg

**Light descending (for study of light only, not for quoting its figures):**
27. *Swift Descent of Amida* (*Hayaraigō*). Anonymous, Kamakura period, 13th c., Chion-in. Public domain.
    https://upload.wikimedia.org/wikipedia/commons/4/43/Rapid_descent.jpg
28. *Raigō of the Amida Triad and Twenty-five Bodhisattvas*. Anonymous woodblock, Muromachi, c. 15th–16th c. CC0 (Honolulu Museum of Art photo).
    https://upload.wikimedia.org/wikipedia/commons/b/b5/The_Raig%C5%8D_of_the_Amida_Triad_and_the_Twenty-five_Bodhisattvas%2C_Honolulu_Museum_of_Art.jpg

**Pilgrim's Progress in Chinese (scanned books, PDF, for looking at, not for the picker):**
- *Tian lu li cheng tu hua*, Canton vernacular, Yangcheng: Hui shi li tang (library-dated 1871). Public domain (Harvard scan). https://upload.wikimedia.org/wikipedia/commons/b/b0/Harvard_drs_428687561_%E5%A4%A9%E8%B7%AF%E6%AD%B7%E7%A8%8B_v.1.pdf
- *Tian lu li cheng*, [Hong Kong?] 1856. https://upload.wikimedia.org/wikipedia/commons/b/bb/Harvard_drs_432623137_%E5%A4%A9%E8%B7%AF%E6%AD%B7%E7%A8%8B.pdf
- *Tian lu li cheng*, Shanghai 1869. https://upload.wikimedia.org/wikipedia/commons/d/da/Harvard_drs_428687985_%E5%A4%A9%E8%B7%AF%E6%AD%B7%E7%A8%8B.pdf
- Whether these contain woodcuts was not checked (the server rate-limited the downloads).

**Picker suggestion:** ten that best divide the owner's taste: 1 (Shōno rain), 3 (Mishima mist), 8 (Hokusai summit), 10 (Hasui moonlight), 14 (Yoshida lake), 18 (Tōhaku pines), 20 (Sesshū haboku), 23 (Fan Kuan), 26 (Wang Ximeng crop), 27 (Hayaraigō). Each stands for a different direction: rain-as-line, mist-as-layer, distant-terror, lamplit night, calm colour planes, pure fog, wet ink, monumental height, blue-green distance, and descending light.
