#!/usr/bin/env python3
"""Turn an AI picture of a person (grey watercolour on a white background) into a game figure.

  python3 tools/cutout.py picture.png 296 assets/name.webp

296 = how tall the figure should be in "video pixels" (Christian is about 288, Obstinate 296, Pliable 290; the game
shows them at 0.52 of that). It prints the META line for index.html (ax = the middle of the feet, ground = the feet).
The recipe matches the video frames: white that touches the picture's edge becomes see-through (white inside the figure
stays), grey = .2 + .62 * lightness, shrunk with clean edges, saved as WebP.
The standing poses and the family were made with Google's image model (prompts in HANDOFF.md, build 34).
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def cutout(src, height, out, pad=6):
    im = Image.open(src).convert('RGB'); L = im.convert('L')
    m = L.point(lambda v: 255 if v > 236 else 0); w, h = m.size
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if m.getpixel(xy) == 255: ImageDraw.floodfill(m, xy, 128)          # 128 = background
    fg = m.point(lambda v: 0 if v == 128 else 255).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.6))
    a = np.array(fg).astype(float) / 255
    ys = np.where((a > .3).any(1))[0]; xs = np.where((a > .3).any(0))[0]; y0, y1, x0, x1 = ys[0], ys[-1] + 1, xs[0], xs[-1] + 1
    g = .2 + .62 * np.array(L).astype(float) / 255
    pre = np.dstack([g * a * 255, a * 255])[y0:y1, x0:x1]                    # grey times alpha, so edges stay clean when shrunk
    k = height / (y1 - y0); W, H = round((x1 - x0) * k), round(height)
    small = np.dstack([np.array(Image.fromarray(pre[:, :, i].astype(np.uint8)).resize((W, H), Image.LANCZOS)).astype(float) for i in range(2)])
    al = small[:, :, 1]; gr = np.where(al > 0, small[:, :, 0] / np.maximum(al, 1) * 255, 0).clip(0, 255)
    rgba = np.zeros((H + pad * 2, W + pad * 2, 4), np.uint8)
    for i in range(3): rgba[pad:pad + H, pad:pad + W, i] = gr
    rgba[pad:pad + H, pad:pad + W, 3] = al
    Image.fromarray(rgba).save(out, 'WEBP', quality=82, method=6)
    feet = np.where((al[int(H * .9):] > 60).any(0))[0]
    print(f'{out}: {rgba.shape[1]} x {rgba.shape[0]}   META = {{"ax": {int(pad + (feet[0] + feet[-1]) / 2)}, "ground": {pad + H}}}')

if __name__ == '__main__': cutout(sys.argv[1], float(sys.argv[2]), sys.argv[3])
