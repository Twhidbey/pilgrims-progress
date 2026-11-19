# The skeleton under the clothes. A skeleton pose is 17 numbers:
#   0,1  the hip's place (pack pixels)   2  the body's lean   3  the head's nod on the body
#   4..7  far leg: thigh stretch (hidden slack, 0 for made movements), thigh angle, knee bend, foot pitch (toe up +)
#   8..11 near leg: the same      12,13 far arm: shoulder, elbow      14,15 near arm      16 the burden's tilt on his back
# Angles: 0 hangs straight down, + swings forward (the way he faces).
# to_skeleton() reads a skeleton pose out of a fitted costume pose (rig.py); legs() and features() are mirrored in mannequin.js.
import numpy as np
from costume import PIV, HIP, HIPS, KNEE, THIGH, WAIST, HEM
from rig import ROWS, rot
SHIN = {k: float(np.hypot(PIV['leg' + k][0] - KNEE[k][0], PIV['leg' + k][1] - KNEE[k][1])) for k in 'FN'}
AREF = {k: float(np.arctan2(PIV['leg' + k][0] - KNEE[k][0], PIV['leg' + k][1] - KNEE[k][1])) for k in 'FN'}
ARM_REST = [.05, .3]
HOFF = {k: (HIPS[k][0] - HIP[0], HIPS[k][1] - HIP[1]) for k in 'FN'}
def ik(hip, ank, k):
    # two bones from hip to ankle, the knee forward: the thigh's and the shin's angles
    d = ank - hip; D = min(np.hypot(*d), THIGH + SHIN[k] - .01); base = np.arctan2(d[0], d[1])
    a_t = base + np.arccos(np.clip((THIGH**2 + D * D - SHIN[k]**2) / (2 * THIGH * D), -1, 1))
    a_s = base - np.arccos(np.clip((SHIN[k]**2 + D * D - THIGH**2) / (2 * SHIN[k] * D), -1, 1))
    return a_t, a_s
def hip_of(k, c, lean):      # a leg's hip joint, from the hip's centre and the body's lean
    o = HOFF[k]; s, co = np.sin(lean), np.cos(lean)
    return c + np.array([o[0] * co - o[1] * s, o[0] * s + o[1] * co])
def sole_pitch(parts):
    # each traced foot's own pitch in its reference frame: the direction of its sole (the lowest edge, a fitted line)
    out = {}
    for p in parts:
        if p['kind'] == 'leg' and p['seg'] == 1:
            m = p['mask']; xs = np.nonzero(m.any(0))[0]; xs = xs[2:-2]; ys = np.array([np.nonzero(m[:, x])[0].max() for x in xs])
            a = np.polyfit(xs, ys, 1)[0]; out[p['leg']] = float(-np.arctan(a))
    return out
def to_skeleton(P, pitch):
    P = P.copy(); m = (P[3:5] + P[6:8]) / 2      # the hood and the burden agree on how the body moves: the body follows them
    P[0:2] += m; P[3:5] -= m; P[6:8] -= m; P[27:29] -= m[1]
    c = rot(np.array(HIP)[None], np.array(PIV['torso']), P[2])[0] + P[0:2]
    S = np.zeros(17); S[0:2] = c; S[2] = P[2]; S[3] = P[5]; S[16] = P[8]
    for o, so, k in ((9, 4, 'F'), (13, 8, 'N')):
        hip = hip_of(k, c, P[2]); ank = np.array(PIV['leg' + k]) + P[o:o + 2]; a_s = AREF[k] - P[o + 2]
        knee = ank - SHIN[k] * np.array([np.sin(a_s), np.cos(a_s)]); d = knee - hip; a_t = np.arctan2(d[0], d[1])
        S[so:so + 4] = [np.hypot(*d) - THIGH, a_t, a_t - a_s, pitch[k] - P[o + 3]]
    S[12:14] = ARM_REST; S[14:16] = ARM_REST
    return S, P
def legs(S):
    out = {}
    for so, k in ((4, 'F'), (8, 'N')):
        hip = hip_of(k, S[0:2], S[2]); a_t = S[so + 1]; a_s = a_t - S[so + 2]
        knee = hip + (THIGH + S[so]) * np.array([np.sin(a_t), np.cos(a_t)]); ank = knee + SHIN[k] * np.array([np.sin(a_s), np.cos(a_s)])
        out[k] = (hip, knee, ank, a_s)
    return out
DEPTH = [(WAIST + (HEM - WAIST) * j / ROWS) - HIP[1] for j in range(1, ROWS + 1)]
def features(S):
    # at each height of the skirt: where the foremost leg and the hindmost leg cross that height, from the hip's centre
    # (a leg lifted above that height counts at its lowest point)
    L = legs(S); f = []; b = []
    for d in DEPTH:
        y = S[1] + d; xs = []
        for k in 'FN':
            h, kn, an = L[k][:3]; x = None
            for p, q in ((h, kn), (kn, an)):
                if x is None and (p[1] - y) * (q[1] - y) <= 0 and p[1] != q[1]: x = p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1])
            if x is None: x = an[0] if an[1] >= kn[1] else kn[0]
            xs.append(x)
        f.append(max(xs) - S[0]); b.append(min(xs) - S[0])
    return np.array(f), np.array(b)
