# Fit the mannequin to every frame of a pack: python3 tools/mannequin/fit.py walk out.npy [check.png]
# Each frame: the parts are moved until their own painted tones lie on the frame's tones and the outline covers the
# frame's outline; the legs stay bones (the knee a thigh's length from the hip); a hidden leg carries on as it was moving.
import sys, os, numpy as np, cv2
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from costume import build, BG, PIV, HIP, KNEE, THIGH
from rig import NP, ROWS, place as place0, prepare, rot
from skel import ik, hip_of, AREF, SHIN
from costume import HIPS
from scipy.optimize import least_squares
W, parts, edges = build()
H, Wd = W[0][0].shape
for i, p in enumerate(parts):
    p['id'] = i + 1; p['n'] = len(p['pts']); p['_p'] = np.concatenate([p['pts'], p['outline']]); prepare(p, edges)
STEP = np.array([.5, .5, .008] * 3 + [.5, .5, .012, .012] * 2 + [.02, .02] + [.5] * (ROWS * 2) + [.5, .5])
WT = np.array([.02, .02, 2.] + [.5, .5, 6.] * 2 + [.06, .06, 1.5, 1.5] * 2 + [.3, .3] + [.05] * (ROWS * 2) + [.1, .1])
cg = np.stack(np.meshgrid(np.arange(1, Wd, 3), np.arange(1, H, 3)), -1).reshape(-1, 2)
PT = np.array(PIV['torso'])
def expand(x):
    # the legs are bones: the shin's angle comes from hip, ankle and the bones' lengths (the knee forward); slots 11 and 15
    # hold only a small correction to it, which the frame may ask for where the shin shows
    P = x.copy(); c = rot(np.array(HIP)[None], PT, x[2])[0] + x[0:2]
    for o, k in ((9, 'F'), (13, 'N')):
        a_t, a_s = ik(hip_of(k, c, x[2]), np.array(PIV['leg' + k]) + x[o:o + 2], k); P[o + 2] = AREF[k] - (a_s + x[o + 2])
    return P
def place(p, x): return place0(p, x)
def target(k, s):
    g, a = W[k]; T = a * g + (1 - a) * BG
    return cv2.GaussianBlur(T, (0, 0), s), cv2.GaussianBlur((a > .5).astype(np.float32), (0, 0), s)
def render(x):
    lab = np.zeros((H, Wd), np.uint8); out = []; x = expand(x)
    for p in parts:
        q = place(p, x); out.append(q)
        cv2.fillPoly(lab, [np.round(q[p['n']:] - .5).astype(np.int32)], p['id'])
    return lab, out
def resid(x, T, A, s, prev):
    lab, out = render(x); r = []
    for p, q in zip(parts, out):
        q = q[:p['n']]
        xi = np.clip(q[:, 0].astype(int), 0, Wd - 1); yi = np.clip(q[:, 1].astype(int), 0, H - 1)
        vis = lab[yi, xi] == p['id']
        t = cv2.remap(T, (q[:, 0] - .5).astype(np.float32)[None], (q[:, 1] - .5).astype(np.float32)[None], cv2.INTER_LINEAR, borderValue=BG)[0]
        r.append(np.where(vis, t - p['pg'], 0.))
    M = cv2.GaussianBlur((lab > 0).astype(np.float32), (0, 0), s)
    r.append(1.2 * (M - A)[cg[:, 1], cg[:, 0]])
    L = x[19:27].reshape(ROWS, 2)      # the skirt hangs smoothly: no sudden change from one height to the next
    r.append(.06 * np.diff(np.concatenate([np.zeros((2, 2)), L]), n=2, axis=0).ravel())
    r.append(.02 * L.ravel()); r.append(.08 * x[27:29]); r.append(.3 * x[17:19])
    r.append(.35 * x[[3, 4, 6, 7]]); r.append(3. * x[[5, 8]])      # the hood and the burden sit on the torso: they shift and turn only a little
    if prev is not None: r.append(WT * (x - prev))
    r.append(4. * x[[11, 15]])
    r.append(.15 * np.maximum(0, -x[[10, 14]] - 18.))      # a walking foot is not lifted high
    return np.concatenate(r)
def jac(x, *a):
    J = []
    for i in range(NP):
        d = np.zeros(NP); d[i] = STEP[i]
        J.append((resid(x + d, *a) - resid(x - d, *a)) / (2 * STEP[i]))
    return np.stack(J, 1)
def fit(k, x0, prev, sig=(3., 1.5, .8)):
    x = x0.copy()
    for s in sig:
        T, A = target(k, s)
        x = least_squares(resid, x, jac=jac, args=(T, A, s, prev), loss='soft_l1', f_scale=.15, max_nfev=40, x_scale=STEP * 4).x
    return x
def iou(k, x):
    lab, _ = render(x); a = W[k][1] > .5; m = lab > 0
    return (a & m).sum() / (a | m).sum()
def show(k, x, z=3):
    g, a = W[k]; im = np.dstack([np.where(a > .5, g, .25)] * 3); im[a <= .5] = (.2, .2, .55)
    im = cv2.resize((im * 255).astype(np.uint8), None, fx=z, fy=z, interpolation=cv2.INTER_NEAREST)
    cols = [(0, 0, 255), (0, 80, 255), (0, 255, 0), (0, 255, 160), (255, 255, 0), (255, 140, 0), (255, 0, 255), (0, 255, 255)]
    _, out = render(x)
    for p, q, c in zip(parts, out, cols):
        cv2.polylines(im, [np.round(q[p['n']:] * z).astype(np.int32)], True, c, 1, cv2.LINE_AA)
    return im
if __name__ == '__main__':
    N = len(W); X = [None] * N; order = [(7 + i) % N for i in range(N)]
    x = np.zeros(NP); prev = None; p2 = None
    for k in order:
        x0 = x.copy(); pc = prev
        if p2 is not None:
            pc = prev.copy(); pc[9:17] += .7 * (prev[9:17] - p2[9:17]); x0[9:17] = pc[9:17]
        p2 = prev
        x = fit(k, x0, pc); X[k] = x.copy(); prev = x.copy()
        print(k, 'overlap %.3f' % iou(k, x), flush=True)
    for k in order[:3]:      # once more round the join, so the loop closes
        X[k] = fit(k, X[k], X[(k - 1) % N])
    render0 = render
    np.save(sys.argv[2], np.array([expand(x) for x in X]))
    if len(sys.argv) > 3: cv2.imwrite(sys.argv[3], np.hstack([show(k, X[k], 3) for k in [0, 7, 14, 18, 22, 26, 30, 34]]))
    I = [iou(k, X[k]) for k in range(N)]; print('mean overlap %.3f lowest %.3f' % (np.mean(I), np.min(I)))
