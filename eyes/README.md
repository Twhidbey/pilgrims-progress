# The eyes lab (lab 21)

A close-up of a man's two eyes drawn in code (canvas 2D, no pictures loaded), moved by shapes tracked frame by frame
from short reference clips. **A lab, not used by the game.** It lives on this branch (`eyes`) only; `main` publishes the
game and does not carry it. The reference clips themselves are not kept anywhere: only the numbers tracked from them.

Open `eyes-lab.html` in a browser (it holds everything inline): Clip steps through the takes, Look through the three
looks, with pause, slow motion and a slider.

## Files

- `eyes-lab.html`: the lab page, self-contained (data at half frame rate, the drawing code, the crying take).
- `eyes-draw.js`: the drawing. No dependencies.
- `cryfx.js`: the crying take's script (a feeling laid over a clip, by time).
- `data/clip*.js`: one take each, as `const EYES = {...};`, 30 frames a second:
  - `clip1`: rest, a blink (about frame 45), a little wider (120), a hard squint (210). 255 frames.
  - `clip2`: rest, then shock, eyes wide and brows up (about 60 to 130), easing (140 on), shut at the end (170). 184 frames.
  - `clip3`: rest, then a broad smile, eyes narrowed, cheeks up (about 30 to 80), soft and open again (125). 161 frames.
  - `clip4`: rest, wide (about 30 to 80), then cheeks raised with the eyes open (about 200 to 235), closing (247). 256 frames.
  - `clip5`: rest, a half closing (about 130), open (167), **a slow closing, held shut (about 180 to 210), a slow opening (210 to 245)**. 278 frames.
- `tools/`: how the data and the stills were made (they expect a local web server and the reference clips' frames, which are not kept):
  `track.py` (face landmarks per frame with MediaPipe's face landmarker), `build.py` (stabilises and packs them),
  `pick.py`, `geo.js`, `grid.py`, `cry.js`, `flick.js`, `page2.html`.

## How it is called

```html
<canvas id="c" width="1650" height="520"></canvas>
<script src="data/clip5-closing.js"></script>   <!-- defines EYES -->
<script src="eyes-draw.js"></script>
<script>
  const cv = document.getElementById('c'), ctx = cv.getContext('2d');
  drawEyes(ctx, cv.width, cv.height, f, 'dusk');   // f = frame, may be fractional (it blends between frames)
</script>
```

- `drawEyes(ctx, W, H, f, lookName)` draws one frame of the global `EYES` and fills the whole canvas. Built at 1650 x 520
  (the eyes' distance sets the scale: `W / 1.62`); about 4 ms a frame. To change take, point `EYES` at another clip's data
  (in a page that loads several, rename each file's `const EYES` or wrap them as the lab does: `CLIPS[i].d`).
- **Looks:** `'dusk'` (the game's quiet warm grey, under a hat brim's shadow, hard light from the left), `'western'` (the
  same light, warm skin), `'natural'` (unshaded).
- **Opening from shut (waking):** play `clip5` forward from about frame 195 (shut) to 245 (open), at any pace:
  `drawEyes(ctx, W, H, 195 + 50 * ease(t), look)`. Any closing played backwards is an opening too (`clip1` 45 to 30,
  `clip2` 171 to 150).
- **A feeling laid over a clip:** set `drawEyes.fx = { sorrow, droop, wet, tears }` before drawing (or `null` for none):
  `sorrow` 0..1 lifts the inner brows; `wet` 0..1 stands water along the lower lids; `tears` is a list of
  `{ e: 'R' | 'L', t: seconds since it began, at: place along the lower lid (.84 = inner corner), a: 0..1 strength, speed }`.
  `cryfx.js` is a whole 24-second take built this way (`cryFx(s)`, `cryF(s)`, `CRY_LEN`), which ends as it begins.
- **A taller picture:** `drawEyes.cyK = eyeLine / H` moves the eye line (default .56 of the height); the crying take
  uses a 1650 x 580 canvas with `cyK = 291 / 580` so the tears have room under the eye bags.
- **Dials at the top of `eyes-draw.js`:** `LID_EASE` (.8: the lower lid eased toward the average eye; 0 = exactly as
  tracked), `WIDE_LIFT` (how far the upper lid draws back when the eyes go wide, so white shows above the iris),
  `WRINKLE` (.62: strength of crow's feet and creases).

## What drives it

Each frame holds, for each eye, the upper and lower lid margins (9 points each, outer corner to inner), the lid crease,
the iris, the brow's two edges and the fold under the eye, in units of the distance between the outer eye corners, with
the origin between the inner corners; plus the tracker's own muscle readings (`bs`: squint, inner brows up, brows down,
outer brows up, wide, blink, smile) and their level at rest (`rest`), which drive the wrinkles and the brows' slant.
The shapes are rebuilt from their six main ways of moving and smoothed (heavily while still, lightly while moving
fast), then each eye is pulled halfway toward the other's mirror image.

## Rules learned (the owner's)

- No red in the eyes (no veins, no pink whites).
- When the eyes go wide, white must show above the iris; not too much white left and right of it.
- The upper lid's overlap at the outer corner is carried by the outer lashes sweeping past the corner, not by a fold of skin.
- Tears: from the inner corner, a continuous glossy streak with a full drop; the eyes stay open; the picture is cropped
  just below the eye bags (no nose); a take spends most of its time on the tear and the streak it leaves.
- Faces in the game's levels stay plain (no eyes): this close-up is a separate thing, and whether the game uses it is
  the owner's decision.

## Cost

Everything here is code, free, except three draft reference pictures of tears from the image model (about 15 cents in
all, made from the drawn eyes; not kept in the repo).
