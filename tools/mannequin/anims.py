# Write assets/mannequin.json: the movements MEASURED from his frame packs, as plain tracks for the skeleton.
#   python3 tools/mannequin/anims.py walk=tools/mannequin/walk.npy
# Only what the frames show reliably is kept, per frame: the hip's place and the body's lean, the head's nod, each
# ankle's place and each foot's pitch, the burden's tilt. The knees and thighs are worked out again in mannequin.js
# from the skeleton's own bones, so no measured fault (a knee bent backwards, a stretched thigh) comes through.
import sys, os, json, numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from costume import build, PIV, HIP
from rig import rot
from skel import sole_pitch
W, parts, edges = build(); pitch = sole_pitch(parts)
META = dict(walk=dict(pack='christian-walk-nb', loop=True, fps=24, vpx=4.9, strike=7))
anims = {}
for a in sys.argv[1:]:
    name, f = a.split('='); X = np.load(f); loop = META.get(name, {}).get('loop')
    def sm(c, k, n):
        for _ in range(n):
            A = np.concatenate([X[-1:], X, X[:1]]) if loop else np.concatenate([X[:1], X, X[-1:]])
            X[:, c] = k * A[:-2, c] + (1 - 2 * k) * A[1:-1, c] + k * A[2:, c]
    sm(slice(0, 9), .25, 1); sm(slice(9, 17), .12, 1)
    T = []
    for P in X:
        m = (P[3:5] + P[6:8]) / 2      # the hood and the burden agree on how the body moves
        c = rot(np.array(HIP)[None], np.array(PIV['torso']), P[2])[0] + P[0:2] + m
        row = [c[0] - HIP[0], c[1] - HIP[1], P[2], P[5]]
        for o, k in ((9, 'F'), (13, 'N')): row += [PIV['leg' + k][0] + P[o] - HIP[0], PIV['leg' + k][1] + P[o + 1], pitch[k] - P[o + 3]]
        T.append(row + [P[8]])
    T = np.array(T)
    for c, y in ((6, 5), (9, 8)):      # a foot flat on the ground has pitch 0
        flat = T[:, y] > np.percentile(T[:, y], 60); T[:, c] -= np.median(T[flat, c])
    anims[name] = dict(META.get(name, {}), track=[[round(float(v), 4 if i in (2, 3, 6, 9, 10) else 2) for i, v in enumerate(r)] for r in T])
    np.set_printoptions(precision=1, suppress=True, linewidth=250); print(name, 'hip dy', T[:, 1]); print('far ankle x', T[:, 4]); print('far ankle y', T[:, 5]); print('near ankle y', T[:, 8])
json.dump(dict(anims=anims), open('assets/mannequin.json', 'w'), separators=(',', ':'))
print('assets/mannequin.json', os.path.getsize('assets/mannequin.json'), 'bytes')
