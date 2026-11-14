# Pilgrim's Progress: handoff (read this first in a new chat)

The game is `index.html` (one file, no build step). `style-lab.html` is the art-style test page. `CLAUDE.md` maps the code and records the owner's decisions. Work on **`main`** and push after every change: pushing IS publishing (GitHub Pages, https://twhidbey.github.io/pilgrims-progress/). Bump the build stamp in both pages on every push and tell the owner when it is live (a phone may need `?v=N` on the link). Keep this file and `CLAUDE.md` updated. Public repo: no personal details.

## The owner and players
- Players: kids 7 to 10, mostly on a phone. Gentle: no lives, no game over, touch buttons, read-aloud dialogue.
- New art direction (Nov 14 2026): everything drawn in code; atmospheric layered silhouettes, one colour per depth layer, pale far and dark near, transparency and haze, soft rain on the left clearing to golden light on the right; calm and natural, not cartoonish, not video-game looking.
- Start small: settle the look in the style lab before touching the game.

## Built Nov 14, 2026 (build 4)
- `CLAUDE.md` and `HANDOFF.md` created.
- **`style-lab.html` rebuilt** as one screen in the layered-silhouette style, all code-drawn: a far ridge, a city of gabled houses and a steeple on the left, hills with groves, poplars and hedges on the right, flat ground with grass, a fence and puddles, an optional dark framing layer in front (trunk, hanging leaves, tall grass), heavy clouds and falling rain on the left, the shining light with soft beams and a few birds on the right, a little paper grain.
- Controls: 4 colour sets (Storm to gold, Violet dusk, Green morning, Ink and paper); Christian as Watercolour / Silhouette / Hidden; New scene; Framing in front; 13 sliders (Rain ↔ golden light, Rain, Golden glow, Mist between layers, How many layers, Pale far layers, See-through overlap, Soft edges, Countryside ↔ city, Hills, Trees, Lit windows, Walk along). The picture stays pinned at the top while the sliders scroll.
- The page link remembers the look (and shows it as a `look=...` line), so the owner can send back the one they like.
- Game: only the build stamp changed (build 4, slightly easier to read). The game itself is still the watercolour version.
- Checked in a headless browser at desktop and phone sizes: no errors, sliders and buttons change the picture. Not yet seen on a real phone.

## Open questions for the owner
1. **Christian: watercolour or silhouette?** The lab shows both. The silhouette is the watercolour sprite tinted one colour with a lit front edge; if silhouette wins he should be redrawn in code so he can animate cleanly.
2. Which colour set and slider look? (Send the `look=` line or the link.)
3. Are lit windows welcome (a second colour inside a layer), or strictly one colour per layer?
4. Framing layer in front (trunk, leaves, grass): keep it in the game, or is it in the way of play?
5. In the game, should the rain-to-gold change happen across the whole level (rain in the city, gold at the gate) rather than across one screen?
6. Other people (Evangelist, Obstinate, Pliable) and obstacles (barrels, crates, mud): silhouettes on the ground layer too?

## Next steps (after the owner picks a look)
- Move the chosen look into `index.html`: replace `paintSky/paintFar/paintMid/paintNear` and the `ART_SRC` images with layered code-drawn silhouettes built for the whole level width, weather following the level.
- Redraw obstacles and people in the same style; drop `ART_SRC` (and `SPR_SRC` if Christian becomes a silhouette) to shrink the file.
- Then Level 2: the Slough of Despond.

## Loose ends
- No `assets/` folder is in the repo (images are only base64 inside `index.html`). Upload it if the originals should be kept here.
- `README.md` is only a title.
