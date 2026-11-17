#!/usr/bin/env python3
"""Turn an AI video of a figure doing one movement on the spot (not a walk: a kneel, a reach, a climb) into game frames.

  python3 tools/gesture-frames.py video.mp4 (or a folder of frames) assets/help.pack --height 382 --to 300 --frames 0-40:4,42-132:2,136-236:4 [--match assets/christian-walk.pack] [--holes 400]

--height = how tall the standing figure is in the video, --to = how tall he should be in "video pixels" (Christian is
288, Help 300). --frames = which video frames to keep (from-to:step). --white N = how light paper is (default 232; a figure lit pale needs about 243 when the paper is 250 or more). --holes N = pure white patches of N pixels or more shut inside
the figures (the gap between two people, or under an arm) become see-through too. Every frame is cut from the same window, so the
figure does not jump. Same recipe as the other tools: white that touches the edge becomes see-through,
grey = .2 + .62 * lightness, matched to the tone of --match. Prints the META line: ground, ax (the middle of what stands
on the ground in the LAST frame), src (the video frame of each stored frame). Needs ffmpeg, numpy and Pillow.
"""
import glob, io, json, os, struct, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def arg(name, default): return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
video, out = sys.argv[1], sys.argv[2]; K = arg('--to', 300.0) / arg('--height', 382.0); match = arg('--match', ''); HOLES = arg('--holes', 0); WHITE = arg('--white', 232)
if os.path.isdir(video): tmp = video                           # a folder of frames already pulled out (0003.png = video frame 3)
else: tmp = tempfile.mkdtemp(); subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-start_number', '0', tmp + '/%04d.png'], check=True)
fs = {int(os.path.basename(f)[:-4]): f for f in glob.glob(tmp + '/*.png')}; keep = []
for part in arg('--frames', f'0-{max(fs)}:2').split(','):
    r, step = part.split(':'); a, b = r.split('-'); keep += [i for i in range(int(a), int(b) + 1, int(step)) if i in fs]
box = None
for i in keep:                                                    # one window that holds the figure in every kept frame
    m = np.array(Image.open(fs[i]).convert('L')) < 215; ys = np.where(m.any(1))[0]; xs = np.where(m.any(0))[0]
    b = (xs[0], ys[0], xs[-1], ys[-1]); box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
x0, y0, x1, y1 = box[0] - 12, box[1] - 12, box[2] + 13, box[3] + 13; ground = box[3] + 1
def frame(i, gain):
    im = Image.open(fs[i]).convert('RGB').crop((x0, y0, x1, y1)); L = im.convert('L'); La = np.array(L).astype(float)
    m = L.point(lambda v: 255 if v > WHITE else 0); w, h = m.size
    for xy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if m.getpixel(xy) == 255: ImageDraw.floodfill(m, xy, 128)
    bg = np.array(m) == 128
    if HOLES:                                                     # blank paper shut in between two figures or an arm and a body
        hm = Image.fromarray((((La > 243) & ~bg) * 255).astype(np.uint8)); side = int(HOLES ** .5) | 1
        core = np.array(hm.filter(ImageFilter.MinFilter(side))) == 255          # only patches with a solid middle count
        while core.any():
            y, x = np.unravel_index(np.argmax(core), core.shape); ImageDraw.floodfill(hm, (int(x), int(y)), 100)
            reg = np.array(hm) == 100; bg |= reg; core &= ~reg; hm = Image.fromarray(np.where(reg, 0, np.array(hm)).astype(np.uint8))
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
    ref = np.array(Image.open(io.BytesIO(b[4 + 4 * nn:4 + 4 * nn + ls[0]])).convert('RGBA')).astype(float); t = frame(keep[0], 1).astype(float)
    gain = ref[:, :, 0][ref[:, :, 3] > 200].mean() / t[:, :, 0][t[:, :, 3] > 200].mean()
frames = []; last = None
for i in keep: last = frame(i, gain); buf = io.BytesIO(); Image.fromarray(last).save(buf, 'WEBP', quality=78, method=6); frames.append(buf.getvalue())
with open(out, 'wb') as f:
    f.write(struct.pack('<I', len(frames)))
    for fr in frames: f.write(struct.pack('<I', len(fr)))
    for fr in frames: f.write(fr)
g = round((ground - y0) * K); feet = np.where((last[g - 8:g, :, 3] > 60).any(0))[0]
print(out, os.path.getsize(out) // 1024, 'KB;', len(frames), 'frames', last.shape[1], 'x', last.shape[0], '; tone gain', round(gain, 2))
print(f'window starts at video x {x0}, y {y0}; one stored pixel = {1 / K:.3f} video pixels')
print('META =', json.dumps({'ax': int((feet[0] + feet[-1]) / 2) if len(feet) else None, 'ground': g, 'frames': len(frames), 'src': keep}))
