import json, numpy as np, sys, cv2
d = sys.argv[1]; N = int(sys.argv[2]) if len(sys.argv) > 2 else 6
T = json.load(open(d + '/track.json')); keys = ['up','lo','cr','ir','bu','bl','un']
X = np.array([np.concatenate([np.ravel(f[e][k]) for e in 'RL' for k in keys]) for f in T]); X = X - X.mean(0)
# smooth a little so a single noisy frame is not picked, then farthest-point sampling: the most different moments
k = np.ones(5) / 5; Xs = np.stack([np.convolve(np.pad(X[:, i], 2, mode='edge'), k, 'valid') for i in range(X.shape[1])], 1)
picks = [0]; 
while len(picks) < N:
    dm = np.min([np.linalg.norm(Xs - Xs[p], axis=1) for p in picks], 0)
    for p in picks: dm[max(0, p - 14):p + 15] = -1
    picks.append(int(dm.argmax()))
picks = sorted(picks); print(','.join(map(str, picks)))
for f in picks:
    im = cv2.imread(d + '/full/f%04d.jpg' % (f + 1)); ox, oy, D, ang = T[f]['px']; Wd, Hd = 1100, 347; S = Wd / 1.62 / D
    M = cv2.getRotationMatrix2D((ox, oy), np.degrees(ang), S); M[0, 2] += Wd / 2 - ox; M[1, 2] += Hd * .56 - oy
    cv2.imwrite(d + '/real-%03d.jpg' % f, cv2.warpAffine(im, M, (Wd, Hd), flags=cv2.INTER_CUBIC), [cv2.IMWRITE_JPEG_QUALITY, 92])
    bs = T[f]['bs']; print(' ', f, {k2: bs[k2] for k2 in ['eyeBlinkLeft', 'eyeWideLeft', 'eyeSquintLeft', 'browInnerUp', 'browDownLeft', 'browOuterUpLeft', 'eyeLookUpLeft', 'eyeLookDownLeft', 'eyeLookOutLeft', 'eyeLookInLeft', 'cheekSquintLeft'] if k2 in bs})
