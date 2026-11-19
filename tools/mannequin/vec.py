# Turn the parts into drawn shapes and write assets/mannequin.json: python3 tools/mannequin/vec.py walk=poses.npy ...
# Each part becomes a stack of tone regions (lightest first, darker ones laid over), traced as outlines at three times
# the size. No pictures are stored: only outlines and the poses of each animation.
import sys, os, json, numpy as np, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from costume import build, dil, PIV, WAIST, HEM, HIP, KNEE, FLAP_TOP, FLAP_LEN
from rig import ROWS
W, parts, (xl, xr) = build()
P = {p['name']: p for p in parts}
g0 = W[0][0]; H, Wd = g0.shape
allg = np.concatenate([p['g'][p['mask']] for p in parts])
lo, hi = np.percentile(allg, [1.5, 98.5]); NT = 10
TONES = np.linspace(lo, hi, NT); Z = 3
def trace(mask, g):
    m = mask.astype(np.float32)
    num = cv2.GaussianBlur(g.astype(np.float32) * m, (0, 0), .55); den = cv2.GaussianBlur(m, (0, 0), .55)
    gs = np.where(den > 1e-3, num / np.maximum(den, 1e-3), 0)
    for _ in range(6):      # carry the tones a little past the edge, so the enlarged edge keeps its tone
        d = cv2.dilate(gs, np.ones((3, 3), np.uint8)); gs = np.where((gs == 0) & (d > 0), d, gs)
    G = cv2.resize(gs, None, fx=Z, fy=Z, interpolation=cv2.INTER_CUBIC)
    M = cv2.resize(cv2.GaussianBlur(m, (0, 0), .6), None, fx=Z, fy=Z, interpolation=cv2.INTER_CUBIC) > .5
    layers = []
    for k in range(NT - 1, -1, -1):
        R = M if k == NT - 1 else (M & (G < (TONES[k] + TONES[k + 1]) / 2))
        R = cv2.morphologyEx(R.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
        cs, _ = cv2.findContours(R, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE); paths = []
        for c in cs:
            if cv2.contourArea(c) < 3.5 * Z * Z: continue
            a = cv2.approxPolyDP(c, .6, True)[:, 0, :]
            if len(a) >= 3: paths.append([int(round(v * 10 / Z)) for v in (a + .5).ravel()])
        if paths: layers.append(dict(t=round(float(TONES[k]), 3), paths=paths))
    return layers
def under(g, hide):      # the tones of what lies beside a covered place, carried in under it
    return cv2.inpaint((g * 255).astype(np.uint8), dil(hide, 1).astype(np.uint8), 4, cv2.INPAINT_TELEA).astype(np.float32) / 255
def shin_up(mask, g, n=16):      # the shin carries on up under the robe, in its own tone
    m = mask.copy(); gg = g.copy(); ys = np.nonzero(m.any(1))[0]; y0 = ys[0] + 2
    xs = np.nonzero(m[y0])[0]; xs2 = np.nonzero(m[y0 + 8])[0]; sl = (xs.mean() - xs2.mean()) / 8; tone = float(np.median(g[m]))
    for i in range(1, n + 1):
        y = y0 - i
        if y < 0: break
        a = max(int(round(xs[0] + sl * i)), 0); b = int(round(xs[-1] + sl * i))
        gg[y, a:b + 1] = np.where(mask[y, a:b + 1], g[y, a:b + 1], tone); m[y, a:b + 1] = True
    return m, gg
out = []
hood, burden, robe, flap = P['hood']['mask'], P['burden']['mask'], P['robe']['mask'], P['flap']['mask']
for p in parts:
    m, g = p['mask'], p['g']
    # each part carries on a little under the part that lies over it, so no crack shows when they move
    if p['name'] == 'robe': hb = hood | burden; m, g = robe | (dil(robe, 11) & hb), np.where(robe, g0, under(g0, hb))
    if p['name'] == 'flap': m, g = flap | (dil(flap, 7) & burden), np.where(flap, g0, under(g0, burden))
    if p['name'] == 'burden': m, g = burden | (dil(burden, 6) & hood), np.where(burden, g0, under(g0, hood))
    if p['name'].startswith('shin'): m = m | (dil(m, 4) & P['foot' + p['leg']]['mask']); m, g = shin_up(m, g)
    d = dict(name=p['name'], kind=p['kind'], layers=trace(m, g))
    if p['kind'] == 'leg': d['leg'] = p['leg']; d['seg'] = p['seg']
    out.append(d)
    print(p['name'], sum(len(q) // 2 for l in d['layers'] for q in l['paths']), 'points', len(d['layers']), 'tones')
C = dict(W=Wd, H=H, ax=93, ground=295, piv=PIV, waist=WAIST, hem=HEM, rows=ROWS, flapTop=FLAP_TOP, flapLen=FLAP_LEN,
         xl=[round(float(v), 1) for v in xl], xr=[round(float(v), 1) for v in xr], hip=HIP, kneeF=KNEE['F'], kneeN=KNEE['N'], toe=dict(F=[36, -5], N=[28, 16]), parts=out)
META = dict(walk=dict(pack='christian-walk-nb', loop=True, fps=24, vpx=4.9, rest=[12, 29]))
ANG = [2, 5, 8, 11, 12, 15, 16, 17, 18]; anims = {}
for a in sys.argv[1:]:
    name, f = a.split('='); X = np.load(f); loop = META.get(name, {}).get('loop')
    # steady the measured poses a little from frame to frame: the cloth most, the body lightly, the legs hardly
    def sm(c, k, n):
        for _ in range(n):
            A = np.concatenate([X[-1:], X, X[:1]]) if loop else np.concatenate([X[:1], X, X[-1:]])
            X[:, c] = k * A[:-2, c] + (1 - 2 * k) * A[1:-1, c] + k * A[2:, c]
    sm(slice(17, 29), .25, 2); sm(slice(0, 9), .25, 1); sm(slice(9, 17), .12, 1)
    anims[name] = dict(META.get(name, {}), frames=[[round(float(v), 4 if i in ANG else 2) for i, v in enumerate(x)] for x in X])
json.dump(dict(costume=C, anims=anims), open('assets/mannequin.json', 'w'), separators=(',', ':'))
print('assets/mannequin.json', os.path.getsize('assets/mannequin.json'), 'bytes')
