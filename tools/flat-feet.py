#!/usr/bin/env python3
"""Level a figure's feet: bring the far foot down onto the same ground line as the near one, for a flat side view
(owner, build 156: "2d flat - NOT one leg higher than other as one would have with perspective drawing").

  python3 tools/flat-feet.py frame.png out.png HEM_ROW GROUND_ROW      (prints the lowest and highest sole after)

Below the hem, each column is stretched down so its lowest point reaches the ground line; columns already on the line
(the near foot) are left alone, and the stretch is smoothed across the far foot so it moves as one piece. Used in
build 156 on Evangelist's standing frames and on the first picture of his walk video. Image models would not level
the feet when asked (two tries, cheap and pro); this does it for free. Look at the result: where one foot overlaps
the other, a small notch can show at the heel.
"""
import sys
import numpy as np
from PIL import Image
src, out, hem, line = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
im = np.array(Image.open(src).convert('RGBA')).astype(float); a = im[:, :, 3] > 80; h, w = a.shape
bot = np.array([np.where(a[hem:, x])[0].max() + hem if a[hem:, x].any() else -1 for x in range(w)])
need = np.where(bot > line - 20, line - bot, 0).astype(float)
k = np.exp(-np.arange(-12, 13) ** 2 / (2 * 4 ** 2)); k /= k.sum()
need = np.maximum(np.convolve(np.maximum.reduce([need, np.roll(need, 2), np.roll(need, -2)]), k, 'same'), 0)
# columns already on the ground (the near foot) stay as they are
need[bot >= line - 3] = 0
res = im.copy(); ys = np.arange(h).astype(float)
for x in range(w):
    if need[x] < .05 or bot[x] < 0: continue
    b = max(bot[x], hem + 1); sy = np.where(ys > hem, hem + (ys - hem) * (b - hem) / (b + need[x] - hem), ys)
    for c in range(4): res[:, x, c] = np.interp(sy, ys, im[:, x, c])
Image.fromarray(np.clip(res, 0, 255).astype(np.uint8)).save(out)
r = res[:, :, 3] > 80; nb = [np.where(r[:, x])[0].max() for x in range(w) if r[hem:, x].any() and np.where(r[:, x])[0].max() > line - 20]
print('soles now', min(nb), max(nb))
