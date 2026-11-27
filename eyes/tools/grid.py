# grid.py DIR f [realprefix]: your frame and the drawing under the same grid, then the drawing's outlines traced on your frame, with measures
import cv2, numpy as np, json, sys
d, f = sys.argv[1], int(sys.argv[2]); W, H = 1650, 520
real = cv2.resize(cv2.imread((sys.argv[3] if len(sys.argv) > 3 else d + '/real-') + '%03d.jpg' % f), (W, H), interpolation=cv2.INTER_CUBIC); draw = cv2.imread(d + '/d-natural-%03d.png' % f); G = json.load(open(d + '/geo-%03d.json' % f))
S = W / 1.62; cx, cy = W / 2, H * .56
def grid(im):
    im = im.copy(); ov = im.copy()
    for k in range(-20, 21):
        x = int(round(cx + k * .05 * S)); y = int(round(cy + k * .05 * S)); c = (0, 255, 255) if k % 2 == 0 else (0, 160, 160)
        cv2.line(ov, (x, 0), (x, H), c, 1); cv2.line(ov, (0, y), (W, y), c, 1)
    return cv2.addWeighted(ov, .45, im, .55, 0)
def trace(im, col=(0, 255, 0)):
    im = im.copy()
    for e in G:
        g = G[e]; cv2.polylines(im, [np.array(g['up'], np.int32)], False, col, 2, cv2.LINE_AA); cv2.polylines(im, [np.array(g['lo'], np.int32)], False, (0, 200, 255), 2, cv2.LINE_AA); cv2.circle(im, (int(g['ic'][0]), int(g['ic'][1])), int(g['r']), (255, 80, 255), 2, cv2.LINE_AA)
    return im
# the true iris in your frame: the circle that best fits the dark-to-light edge round the tracked iris centre
gray = cv2.GaussianBlur(cv2.cvtColor(real, cv2.COLOR_BGR2GRAY), (0, 0), 2); out = []
tr = trace(real)
for e in G:
    g = G[e]; x0, y0, r0 = g['ic'][0], g['ic'][1], g['r']; best = None
    for dx in range(-14, 15, 2):
        for dy in range(-14, 15, 2):
            for r in np.arange(r0 * .6, r0 * 1.25, 1.5):
                # sample only the left and right arcs (the lids hide top and bottom): mean brightness just outside minus just inside
                a = np.concatenate([np.linspace(-.6, .6, 12), np.linspace(np.pi - .6, np.pi + .6, 12)]); xs, ys = x0 + dx + np.cos(a) * r, y0 + dy + np.sin(a) * r
                xo, yo = x0 + dx + np.cos(a) * (r + 4), y0 + dy + np.sin(a) * (r + 4); xi, yi = x0 + dx + np.cos(a) * (r - 4), y0 + dy + np.sin(a) * (r - 4)
                try: sc = gray[yo.astype(int), xo.astype(int)].mean() - gray[yi.astype(int), xi.astype(int)].mean()
                except IndexError: continue
                if best is None or sc > best[0]: best = (sc, x0 + dx, y0 + dy, r)
    _, bx, by, br = best; cv2.circle(tr, (int(bx), int(by)), int(br), (255, 255, 255), 1, cv2.LINE_AA)
    w = abs(g['up'][0][0] - g['up'][-1][0]); out.append('%s eye: iris in your frame %.0f px across, drawn %.0f px (drawn is %+.0f%%); eye width %.0f px; drawn iris centre off by %+.0f, %+.0f px' % ('near' if e == 'R' else 'far', 2 * br, 2 * r0, (r0 / br - 1) * 100, w, x0 - bx, y0 - by))
def lab(im, t):
    im = im.copy(); cv2.putText(im, t, (16, 34), cv2.FONT_HERSHEY_SIMPLEX, .9, (0, 0, 0), 5); cv2.putText(im, t, (16, 34), cv2.FONT_HERSHEY_SIMPLEX, .9, (255, 255, 255), 2); return im
sheet = np.vstack([lab(grid(real), 'your frame'), lab(grid(draw), 'the drawing, same grid'), lab(tr, "the drawing's lids (green, orange) and iris (pink) on your frame; white = iris found in your frame")])
cv2.imwrite('%s/grid-%03d.jpg' % (d, f), sheet, [cv2.IMWRITE_JPEG_QUALITY, 88]); print(d, f, '\n ' + '\n '.join(out))
