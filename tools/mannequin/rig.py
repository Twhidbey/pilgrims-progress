# The rig: how a pose moves the parts. mannequin.js does exactly the same.
# A pose is NP numbers:
#   0..2   torso: x, y, angle (about his waist)
#   3..5   hood: x, y, angle on the torso          6..8   burden: the same
#   9..12  far leg: ankle x, y, shin angle, foot angle      13..16  near leg: the same
#   17,18  the cloak's back flap: swing, curl
#   19..26 the skirt's sideways sway at four heights: back edge, front edge
#   27,28  the hem lifting: back, front
import numpy as np
from costume import PIV, WAIST, HEM, FLAP_TOP, FLAP_LEN
ROWS = 4
NP = 29
def rot(p, c, th):
    s, co = np.sin(th), np.cos(th); d = p - c
    return np.stack([d[:, 0] * co - d[:, 1] * s, d[:, 0] * s + d[:, 1] * co], 1) + c
def uv(p, edges):
    xl, xr = edges
    y = np.clip(p[:, 1], 0, len(xl) - 1.001); i = y.astype(int); f = y - i
    L = xl[i] * (1 - f) + xl[np.minimum(i + 1, len(xl) - 1)] * f; R = xr[i] * (1 - f) + xr[np.minimum(i + 1, len(xl) - 1)] * f
    return np.clip((p[:, 0] - L) / np.maximum(R - L, 1), 0, 1), np.clip((p[:, 1] - WAIST) / (HEM - WAIST), 0, 1)
def basis(v):
    # a smooth curve down the skirt through the rows' displacements (Catmull-Rom): no bend at the waist, straight on past the hem
    t = np.clip(v, 0, 1) * ROWS; i = np.minimum(np.floor(t), ROWS - 1).astype(int); s = t - i
    c = [(-s**3 + 2 * s**2 - s) / 2, (3 * s**3 - 5 * s**2 + 2) / 2, (-3 * s**3 + 4 * s**2 + s) / 2, (s**3 - s**2) / 2]
    w = np.zeros((ROWS + 2, len(v)))
    for n in range(4):
        k = i - 1 + n
        m = k == -1; w[1, m] += c[n][m]
        m = k == ROWS + 1; w[ROWS, m] += 2 * c[n][m]; w[ROWS - 1, m] -= c[n][m]
        for kk in range(0, ROWS + 1):
            m = k == kk; w[kk, m] += c[n][m]
    return [w[j] for j in range(1, ROWS + 1)]
def prepare(part, edges):
    p = part['_p']
    if part['kind'] == 'robe': part['_uv'] = uv(p, edges); part['_B'] = basis(part['_uv'][1])
    if part['kind'] == 'flap':
        s = np.clip((p[:, 1] - FLAP_TOP) / FLAP_LEN, 0, 1); e = np.clip(s / .35, 0, 1)
        part['_s1'] = e * e * (3 - 2 * e); part['_s2'] = s * s
def place(part, x):
    p = part['_p']; k = part['kind']
    torso = lambda q: rot(q, np.array(PIV['torso']), x[2]) + x[0:2]
    if k == 'robe':
        u, v = part['_uv']; B = part['_B']
        dx = sum(B[j] * ((1 - u) * x[19 + 2 * j] + u * x[20 + 2 * j]) for j in range(ROWS))
        dy = B[ROWS - 1] * ((1 - u) * x[27] + u * x[28])
        return torso(p + np.stack([dx, dy], 1))
    if k == 'flap':
        ph = x[17] * part['_s1'] + x[18] * part['_s2']; c = np.array(PIV['flap']); d = p - c; s, co = np.sin(ph), np.cos(ph)
        return torso(np.stack([d[:, 0] * co - d[:, 1] * s, d[:, 0] * s + d[:, 1] * co], 1) + c)
    if k == 'hood': return torso(rot(p, np.array(PIV['hood']), x[5]) + x[3:5])
    if k == 'burden': return torso(rot(p, np.array(PIV['burden']), x[8]) + x[6:8])
    o = 9 if part['leg'] == 'F' else 13
    return rot(p, np.array(PIV['leg' + part['leg']]), x[o + 2 + part['seg']]) + x[o:o + 2]
