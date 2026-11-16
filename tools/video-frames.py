#!/usr/bin/env python3
"""Turn an AI video of a figure moving on the spot (grey watercolour, white background, steady camera) into game frames.

  python3 tools/video-frames.py video.mp4 assets/christian-run.pack [--cycle 24] [--height 455] [--match assets/christian-walk.pack]

It finds the cleanest loop of one cycle, cuts each frame out of the white, makes it grey like the other frames
(g = .2 + .62 * lightness, then matched to the tone of --match), shrinks it so a figure --height pixels tall in the
video becomes 288 (Christian's height in his walk frames), and writes a .pack. It prints the META line for
index.html: ax, ground, frames, vpx (how far the ground moves per frame, so feet do not slide), down (frames with
a foot on the ground). Needs ffmpeg, numpy and Pillow. Look at the frames yourself before trusting it.
"""
import glob, io, json, os, struct, subprocess, sys, tempfile
from collections import deque
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def arg(name, default): return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
video, out = sys.argv[1], sys.argv[2]; P = arg('--cycle', 0); HEIGHT = arg('--height', 0.0); match = arg('--match', '')
tmp = tempfile.mkdtemp(); subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, tmp + '/%04d.png'], check=True)
fs = sorted(glob.glob(tmp + '/*.png')); n = len(fs); M = [np.array(Image.open(f).convert('L')) < 215 for f in fs]
cx, top, bot = [], [], []
for a in M:
    ys = np.where(a.any(1))[0]; t, b = ys[0], ys[-1]; up = a[t:t + int((b - t) * .45)]; cx.append(np.mean(np.where(up)[1])); top.append(t); bot.append(b)
cx, top, bot = np.array(cx), np.array(top), np.array(bot); ground = float(np.percentile(bot, 92))
print(f'{n} frames; body centre x {cx.min():.0f}..{cx.max():.0f}; top of head y {top.min()}..{top.max()}; ground about {ground:.0f}; tallest {ground - top.min():.0f}')
def sig(i):
    x = int(round(cx[i])); y0 = int(ground) - 250; c = M[i][max(0, y0):int(ground) + 12, x - 190:x + 190].astype(np.uint8) * 255
    return np.array(Image.fromarray(c).resize((48, 33), Image.BILINEAR)).astype(float) / 255
Sg = np.array([sig(i) for i in range(n)]); d = lambda i, j: np.abs(Sg[i] - Sg[j]).mean()
if not P: lags = {L: np.mean([d(i, i + L) for i in range(20, n - L)]) for L in range(14, 40)}; P = min(lags, key=lags.get)
i0 = min(range(30, n - P - 2), key=lambda i: d(i, i + P) + d(i + 1, i + P + 1) + d(i - 1, i + P - 1))
print(f'cycle {P} frames; loop = video frames {i0}..{i0 + P - 1} (difference {d(i0, i0 + P):.4f})')
foot = []
for i, a in enumerate(M):
    band = a[int(ground) - 10:int(ground) + 6]; xs = np.where(band.any(0))[0]; foot.append((xs.mean() - cx[i]) if len(xs) > 6 else None)
sl = [foot[i + 1] - foot[i] for i in range(i0, i0 + P - 1) if foot[i] is not None and foot[i + 1] is not None and -60 < foot[i + 1] - foot[i] < -8]
vpx = -float(np.median(sl)) if sl else 0
K = 288 / (HEIGHT or (ground - np.percentile(top, 10))); c0 = float(np.median(cx[i0:i0 + P]))
x0, x1, y0, y1 = int(c0 - 215), int(c0 + 215), max(0, int(ground - 488)), int(ground + 14)
def regions(mask, minarea):
    h, w = mask.shape; seen = np.zeros_like(mask, bool); res = []
    for y in range(0, h, 3):
        for x in range(0, w, 3):
            if mask[y, x] and not seen[y, x]:
                q = deque([(y, x)]); seen[y, x] = True; pts = []
                while q:
                    cy, cx_ = q.popleft(); pts.append((cy, cx_))
                    for ny, nx in ((cy + 1, cx_), (cy - 1, cx_), (cy, cx_ + 1), (cy, cx_ - 1)):
                        if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; q.append((ny, nx))
                if len(pts) >= minarea: res.append(np.array(pts))
    return res
def frame(i, gain):
    im = Image.open(fs[i]).convert('RGB').crop((x0, y0, x1, y1)); L = im.convert('L'); La = np.array(L).astype(float)
    m = L.point(lambda v: 255 if v > 232 else 0); w, h = m.size
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if m.getpixel(xy) == 255: ImageDraw.floodfill(m, xy, 128)
    bg = np.array(m) == 128
    for pts in regions((La > 243) & ~bg, 110):                  # blank paper showing between the legs
        if pts[:, 0].mean() > h * .55: bg[pts[:, 0], pts[:, 1]] = True
    fg = Image.fromarray((~bg * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    a = np.array(fg).astype(float) / 255; g = np.clip((.2 + .62 * La / 255) * gain, 0, 1)
    pre = np.dstack([g * a * 255, a * 255]); W, H = round(w * K), round(h * K)
    small = np.dstack([np.array(Image.fromarray(pre[:, :, c].astype(np.uint8)).resize((W, H), Image.LANCZOS)).astype(float) for c in range(2)])
    al = small[:, :, 1]; gr = np.where(al > 0, small[:, :, 0] / np.maximum(al, 1) * 255, 0).clip(0, 255)
    rgba = np.zeros((H, W, 4), np.uint8)
    for c in range(3): rgba[:, :, c] = gr
    rgba[:, :, 3] = al; return rgba
gain = 1.0
if match:
    b = open(match, 'rb').read(); nn = struct.unpack('<I', b[:4])[0]; ls = struct.unpack(f'<{nn}I', b[4:4 + 4 * nn])
    ref = np.array(Image.open(io.BytesIO(b[4 + 4 * nn:4 + 4 * nn + ls[0]])).convert('RGBA')).astype(float); t = frame(i0, 1).astype(float)
    gain = ref[:, :, 0][ref[:, :, 3] > 200].mean() / t[:, :, 0][t[:, :, 3] > 200].mean()
frames = []
for k in range(P): buf = io.BytesIO(); Image.fromarray(frame(i0 + k, gain)).save(buf, 'WEBP', quality=78, method=6); frames.append(buf.getvalue())
with open(out, 'wb') as f:
    f.write(struct.pack('<I', len(frames)))
    for fr in frames: f.write(struct.pack('<I', len(fr)))
    for fr in frames: f.write(fr)
meta = {'ax': round((c0 - x0) * K), 'ground': round((ground - y0) * K), 'frames': P, 'vpx': round(vpx * K, 1), 'down': [k for k in range(P) if foot[i0 + k] is not None]}
print(out, os.path.getsize(out) // 1024, 'KB; tone gain', round(gain, 2)); print('META =', json.dumps(meta))
