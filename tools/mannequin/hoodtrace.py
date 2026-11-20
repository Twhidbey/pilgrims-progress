# the outline of his head and hood in his old walk: every frame laid on frame 16 (the head held still), averaged, and its edge read to a fraction of a pixel
import struct, io, sys, json
import numpy as np
from PIL import Image, ImageDraw
buf = open('assets/christian-walk-nb.pack', 'rb').read(); n = struct.unpack_from('<I', buf, 0)[0]; lens = struct.unpack_from('<%dI' % n, buf, 4); off = 4 + 4 * n; fr = []
for L in lens: fr.append(np.asarray(Image.open(io.BytesIO(buf[off:off + L])).convert('RGBA'), dtype=float)); off += L
X0, X1, Y0, Y1 = 55, 150, 0, 78
ref = fr[16][Y0:Y1, X0:X1, 3] / 255; acc = np.zeros_like(ref); rgb = np.zeros(ref.shape); shifts = []
for f in fr:
    best = (-1, 0, 0)
    for dy in range(-7, 8):
        for dx in range(-7, 8):
            a = f[Y0 + dy:Y1 + dy, X0 + dx:X1 + dx, 3] / 255
            if a.shape != ref.shape: continue
            s = (a * ref).sum() / (np.maximum(a, ref).sum() + 1e-6)
            if s > best[0]: best = (s, dx, dy)
    _, dx, dy = best; shifts.append((dx, dy)); acc += f[Y0 + dy:Y1 + dy, X0 + dx:X1 + dx, 3] / 255; rgb += f[Y0 + dy:Y1 + dy, X0 + dx:X1 + dx, 0] * (f[Y0 + dy:Y1 + dy, X0 + dx:X1 + dx, 3] / 255)
A = acc / len(fr); G = rgb / np.maximum(acc, 1e-6)
def cross(v, rev=False):      # where a line of the mean outline crosses one half, from outside in
    idx = range(len(v) - 1, 0, -1) if rev else range(0, len(v) - 1)
    for i in idx:
        a, b = (v[i], v[i - 1]) if rev else (v[i], v[i + 1])
        if a < .5 <= b: t = (.5 - a) / (b - a); return (i - t) if rev else (i + t)
    return None
front = [(y + Y0, round(cross(A[y], True) + X0, 2)) for y in range(4, Y1 - Y0) if cross(A[y], True) is not None]
top = [(x + X0, round(cross(A[:, x]) + Y0, 2)) for x in range(0, X1 - X0) if cross(A[:, x]) is not None]
back = [(y + Y0, round(cross(A[y]) + X0, 2)) for y in range(4, 40) if cross(A[y]) is not None]
print('front', front[::2]); print('top', top[::3]); print('back', back[::2]); print('shift range', min(shifts), max(shifts))
Z = 10; im = Image.fromarray(np.uint8(np.clip(G * A + 125 * (1 - A), 0, 255))).resize(((X1 - X0) * Z, (Y1 - Y0) * Z), Image.BICUBIC).convert('RGB'); d = ImageDraw.Draw(im)
for gx in range(X0, X1, 5): d.line(((gx - X0) * Z, 0, (gx - X0) * Z, im.height), fill=(255, 255, 255) if gx % 10 == 0 else (150, 150, 150)); (gx % 10 == 0) and d.text(((gx - X0) * Z + 2, 2), str(gx), fill=(255, 255, 0))
for gy in range(Y0, Y1, 5): d.line((0, (gy - Y0) * Z, im.width, (gy - Y0) * Z), fill=(255, 255, 255) if gy % 10 == 0 else (150, 150, 150)); (gy % 10 == 0) and d.text((2, (gy - Y0) * Z + 2), str(gy), fill=(255, 255, 0))
for y, x in front: d.ellipse(((x - X0) * Z - 2, (y - Y0 + .5) * Z - 2, (x - X0) * Z + 2, (y - Y0 + .5) * Z + 2), fill=(0, 255, 0))
for x, y in top: d.ellipse(((x - X0 + .5) * Z - 2, (y - Y0) * Z - 2, (x - X0 + .5) * Z + 2, (y - Y0) * Z + 2), fill=(255, 80, 80))
im.save(sys.argv[1]); json.dump({'front': front, 'top': top, 'back': back}, open(sys.argv[2], 'w'))
