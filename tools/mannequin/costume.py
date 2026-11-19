# The mannequin's costume: Christian cut into parts from two frames of his book-free walk
# (pack pixels of christian-walk-nb; frame 0 for the body, frame 7 for the legs, where both show below the hem).
import numpy as np, cv2
from unpack import frames
BG = 1.1
def load(name):
    out = []
    for f in frames('assets/%s.pack' % name):
        a = np.asarray(f).astype(np.float32) / 255
        out.append((a[..., :3].mean(-1), a[..., 3]))
    return out
def poly(shape, pts):
    m = np.zeros(shape, np.uint8); cv2.fillPoly(m, [np.array(pts, np.int32)], 1); return m.astype(bool)
def dil(m, r): return cv2.dilate(m.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))).astype(bool)
P_BURDEN = [(79,24),(79,33),(77,45),(74,54),(66,75),(60,95),(53,115),(47,138),(36,137),(0,130),(0,24)]
P_HOOD = [(79,24),(79,33),(77,45),(88,52),(100,56),(109,52),(125,50),(125,0),(79,0)]
P_LEGS0 = [(46,246),(55,249),(100,250),(110,246),(110,299),(46,299)]
P_LEGF = [(105,250),(127,243),(134,258),(162,258),(162,292),(100,292)]
P_LEGN = [(31,249),(51,247),(52,262),(46,272),(68,284),(68,295),(20,295),(20,268),(30,262)]
FLAP_LINE = [(150, 52.), (180, 46.), (205, 42.), (246, 40.)]      # (y, x): the dark fold where the cloak's back flap lies on the skirt
FLAP_TOP, FLAP_LEN = 140., 100.
PIV = dict(torso=(80., 150.), hood=(95., 54.), burden=(62., 62.), legF=(122., 273.), legN=(36., 274.), flap=(47., 140.))
HIP = (82., 157.); KNEE = dict(F=(109.4, 216.4), N=(49., 217.5)); THIGH = 62.
HIPS = dict(F=(82., 159.), N=(68., 159.))      # each leg's own hip joint (he is seen a little from behind: the near hip lies further back), calibrated from the frames where each leg shows
WAIST, HEM = 150., 246.
def build():
    W = load('christian-walk-nb'); g0, a0 = W[0]; g7, a7 = W[7]; sh = g0.shape
    yy, xx = np.mgrid[0:sh[0], 0:sh[1]]
    in0 = a0 > .5; in7 = a7 > .5
    burden = poly(sh, P_BURDEN) & in0
    hood = poly(sh, P_HOOD) & in0 & ~burden
    legs0 = poly(sh, P_LEGS0) & in0
    body = in0 & ~burden & ~hood & ~legs0
    fx = np.interp(yy, [p[0] for p in FLAP_LINE], [p[1] for p in FLAP_LINE])
    flap = body & (yy >= FLAP_TOP - 4) & (xx < fx + 2)
    robe = body & ~((yy >= FLAP_TOP + 6) & (xx < fx - 1))
    lf = poly(sh, P_LEGF) & in7; lf &= ~((g7 > .62) & (yy < 254))
    ln = poly(sh, P_LEGN) & in7; ln &= ~((g7 > .66) & (yy < 253))
    fF = lf & ((yy > 268) | (xx > 132)); sF = lf & ~fF      # shin / foot split through the ankle
    fN = ln & (yy > 270 + (xx - 22) * .07); sN = ln & ~fN
    parts = [  # far to near
        dict(name='shinF', mask=sF, g=g7, kind='leg', leg='F', seg=0),
        dict(name='footF', mask=fF, g=g7, kind='leg', leg='F', seg=1),
        dict(name='shinN', mask=sN, g=g7, kind='leg', leg='N', seg=0),
        dict(name='footN', mask=fN, g=g7, kind='leg', leg='N', seg=1),
        dict(name='robe', mask=robe, g=g0, kind='robe'),
        dict(name='flap', mask=flap, g=g0, kind='flap'),
        dict(name='burden', mask=burden, g=g0, kind='burden'),
        dict(name='hood', mask=hood, g=g0, kind='hood'),
    ]
    for p in parts:
        m = p['mask'].astype(np.uint8)
        n, lab, st, _ = cv2.connectedComponentsWithStats(m)      # keep the largest piece
        if n > 2: m = (lab == 1 + np.argmax(st[1:, 4])).astype(np.uint8)
        p['mask'] = m.astype(bool)
        cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        c = max(cs, key=cv2.contourArea)
        p['outline'] = cv2.approxPolyDP(c, .5, True)[:, 0, :].astype(np.float64) + .5
        er = cv2.erode(m, np.ones((3, 3), np.uint8)).astype(bool)
        ys, xs = np.nonzero(er & (yy % 2 == 0) & (xx % 2 == 0))
        p['pts'] = np.stack([xs + .5, ys + .5], 1).astype(np.float64); p['pg'] = p['g'][ys, xs].astype(np.float64)
    # the robe's own left and right edge by row, for (u, v)
    rm = next(p for p in parts if p['name'] == 'robe')['mask']; xl = np.zeros(sh[0]); xr = np.zeros(sh[0])
    for y in range(sh[0]):
        r = np.nonzero(rm[y])[0]
        if len(r): xl[y], xr[y] = r[0], r[-1] + 1
    k = np.ones(9) / 9; ok = xr > xl
    for arr in (xl, xr): arr[ok] = np.convolve(np.pad(arr[ok], 4, mode='edge'), k, 'valid')
    return W, parts, (xl, xr)
