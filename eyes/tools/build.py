# Tracked landmarks -> stable eye shapes. The raw track jitters (hand-held phone, landmark noise), so the shapes are
# rebuilt from a few slow "muscles": all points of both eyes, frame by frame, are reduced to their main ways of moving
# (PCA), and only those are kept, each smoothed in time: heavily while it is nearly still, lightly while it moves fast
# (so a blink keeps its speed). Then the two eyes are pulled halfway toward each other's mirror image.
import json, numpy as np, sys
DIR = sys.argv[1]
T = json.load(open(DIR + '/track.json')); SYM = 0.5; keys = ['up','lo','cr','ir','bu','bl','un']; n = len(T)
def gauss(a, s):
    r = int(s * 3 + 1); k = np.exp(-.5 * (np.arange(-r, r + 1) / s) ** 2); k /= k.sum()
    p = np.pad(a, [(r, r)] + [(0, 0)] * (a.ndim - 1), mode='edge'); return np.stack([np.convolve(p[:, i], k, 'valid') for i in range(a.shape[1])], 1)
X = np.concatenate([np.array([np.ravel(f[e][k]) for f in T]) for e in 'RL' for k in keys], 1)   # frames x dims
mu = X.mean(0); U, Sg, Vt = np.linalg.svd(X - mu, full_matrices=False); NC = 6
C = U[:, :NC] * Sg[:NC]
print('variance kept by', NC, 'components:', round(float((Sg[:NC] ** 2).sum() / (Sg ** 2).sum()), 4))
slow, fast = gauss(C, 4.0), gauss(C, 1.0)
v = np.abs(np.gradient(gauss(C, 1.5), axis=0)); v = gauss(v, 1.5); thr = np.percentile(v, 75, axis=0) + 1e-9
w = np.clip((v / thr - .8) / 1.6, 0, 1); w = gauss(w, 1.2)       # 0 = still (heavy smoothing), 1 = moving fast
Cs = slow + (fast - slow) * w
Y = Cs @ Vt[:NC] + mu
def jit(Z): d = np.diff(Z, 2, axis=0); return float(np.sqrt((d ** 2).mean()) * 1000)
print('jitter (2nd difference, x1000): raw', round(jit(X), 3), ' now', round(jit(Y), 3))
# unpack
A = {}; o = 0
for e in 'RL':
    for k in keys:
        m = len(T[0][e][k]) * 2; A[e + k] = Y[:, o:o + m].reshape(n, -1, 2); o += m
out = {'n': n, 'fps': 30, 'keys': keys}
for k in keys:
    r, l = A['R' + k], A['L' + k] * [-1, 1]; mean = (r + l) / 2
    out['R' + k] = np.round(r + (mean - r) * SYM, 4).reshape(n, -1).tolist(); out['L' + k] = np.round((l + (mean - l) * SYM) * [-1, 1], 4).reshape(n, -1).tolist()
# the face's own "muscle" readings from the tracker (how hard it squints, inner brows up, brows down, outer brows up, eyes wide, blink),
# both sides averaged and smoothed in time; and their level at rest (the clip's first third of a second), so wrinkles are driven by the change from rest
def ch(*names): return np.array([np.mean([f['bs'].get(nm, 0) for nm in names]) for f in T])
BS = np.stack([ch('eyeSquintLeft', 'eyeSquintRight'), ch('browInnerUp'), ch('browDownLeft', 'browDownRight'), ch('browOuterUpLeft', 'browOuterUpRight'), ch('eyeWideLeft', 'eyeWideRight'), ch('eyeBlinkLeft', 'eyeBlinkRight'), ch('mouthSmileLeft', 'mouthSmileRight')], 1)
BS = gauss(BS, 2.5); out['bs'] = np.round(BS, 3).tolist(); out['rest'] = np.round(BS[:10].mean(0), 3).tolist()
print('rest levels (squint, innerUp, browDown, outerUp, wide, blink):', out['rest'])
open(DIR + '/eyes-data.js', 'w').write('const EYES=' + json.dumps(out, separators=(',', ':')) + ';')
op = A['Rlo'][:, 4, 1] - A['Rup'][:, 4, 1]; print('openness min/max', round(float(op.min()), 3), round(float(op.max()), 3), 'blink frame', int(op.argmin()))
raw = X.reshape(n, -1); 
