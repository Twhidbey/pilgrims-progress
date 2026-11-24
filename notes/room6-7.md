# Rooms 6 and 7, the darker rooms (book `{84}` to `{90}`): `room6.js`, `room7.js`

Chat: **PP House · Rooms 6–7 Darker**. Read `notes/house.md` first (shared rules, budgets, pushing). These two rooms play only when "Shew the darker rooms" is marked (`pp-dark`, the contents page and the pause menu); off by default. **How gently to tell them is the owner's ruling** (CLAUDE.md: the dark parts are ruled level by level).

## The book

**Room 6** (`{84}` to `{88}`): "a very dark room, where there sat a man in an iron cage. Now the man, to look on, seemed very sad; he sat with his eyes looking down to the ground, his hands folded together, and he sighed as if he would break his heart." "I am what I was not once." "I am now a man of despair, and am shut up in it, as in this iron cage. I cannot get out. Oh, now I cannot!" "I left off to watch and be sober ... I have so hardened my heart, that I cannot repent." "Is there no hope, but you must be kept in this iron cage of despair?" "No, none at all." "Why, the Son of the Blessed is very pitiful." "O eternity, eternity!" Christian: "this is fearful! God help me to watch and be sober, and to pray".
**Room 7** (`{89}` to `{90}`): "a chamber, where there was one rising out of bed; and as he put on his raiment, he shook and trembled." His dream: "the heavens grew exceeding black; also it thundered and lightened ... I heard a great sound of a trumpet, and saw also a Man sit upon a cloud ... I heard then a voice saying, Arise, ye dead, and come to judgment"; the pit and the burning lake (left out here); "I saw many catched up and carried away into the clouds, but I was left behind." "I was not ready for it."

## How they play now (build 650; neither room has changed since build 507)

**Room 6** (`bakeR6()`, `R6`; builds 430, 441): the cellar: dark rough stone under a stone barrel vault, the spiral stair they came down at the far left (Rembrandt's *Philosopher in Meditation*, the quoted detail), ONE thin grey shaft from a grating high on the left with dust in it; the caged man (`room6-caged.webp`, build 446, on a stool, facing the visitors) with the cage drawn in code over him (it shakes when touched); a drip now and then. Visitors at 860 and 1160 facing the cage. C "Now let me go on my way."; I "Stay, till I have shown you a little more."; TIP "Touch the cage." (act `cage`); C "What are you?"; the man's three lines; TIP "Touch the cage again."; C "How did you come to this?" and his answer; I "Is there no hope ...?"; "No, none at all."; I "Why, the Son of God is full of pity."; "Oh, eternity, eternity!"; C "This is fearful! ...". Mood bed `hollow`.

**Room 7** (`bakeR7()`, `R7`; builds 430, 441, 446): the bedchamber upstairs under the rafters, wine-brown plaster, the door to the stair on the right; a four-poster drawn in code (`drawBed7`) and the man rising from it pulling on his coat, trembling (`room7-rising.webp`); visitors at 2620 and 2880 facing left. C "Why does this man tremble so?"; TIP "Touch the man." (act `man`); his three lines, told only in light: a soft oval of black sky with clouds and lightning, thunder and a trumpet, one gold light high on the wall for the man on the cloud, pale lights rising into it, one left low by the bed, fading. Mood bed `dread`.

## Open, and ideas (none agreed yet: ask the owner)

- **Feet in the floor** (owner, build 534): not yet checked in either room.
- **How dark?** The owner has not yet ruled on these two rooms since they were drawn in code; show stills and ask before changing their weight.
- Room 6 has eleven lines with two touches: the rule is at most about five lines without an act.
- Room 7: the dreamer trembles by code (his picture shaken back and forth), against the house rule "no code breathing or swaying" (build 302); the owner allowed it then as a story act. A free clip of him trembling as he pulls on his coat would be truer.
- The dream's lights: does the "man upon a cloud" read? (CLAUDE.md: the light is the painting's, Belshazzar's Feast, not a hand.)
- Room 7's line keeps a `‘` quote: the voice tool decodes it since build 500.

## Log (newest first)

- Notes written after build 650 (no change to either room since build 507).
