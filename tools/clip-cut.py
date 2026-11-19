#!/usr/bin/env python3
"""clip-cut.py: one command from a video of a painted figure on white paper to a game sheet.

  python3 tools/clip-cut.py walk    clip.mp4 assets/name.webp [options]
  python3 tools/clip-cut.py gesture clip.mp4 assets/name.webp [options]

walk:    finds ONE WHOLE STRIDE (two steps) that loops cleanly, holds the body still
         (the clip's slow sideways drift evened out so the loop joins), measures the
         planted foot's slide (vpx) and writes the frames on one sheet.
gesture: every frame (or --frames a-b), nothing moved: the feet are planted.

Both cut the figure from its paper by the rules learned in builds 289, 320, 324:
  * paper is only what can be reached from the frame's edges through near-white;
  * white INSIDE the figure stays (a white beard, pale skin), except low down,
    between the feet and legs, where shut-in paper is cleared;
  * the soft edge has the paper's white taken out of its colour and is pulled in
    a little, so no pale rim shows on a dark ground.

It prints the META for rooms.js and writes two check pictures beside the sheet:
  name-strip.jpg  every frame on a dark and a light ground (rims, holes, stray paper)
  name-seam.jpg   the loop's last frames, then its first, enlarged (a jump shows here)

Options:
  --frames a-b    use only these video frames (walk: search only inside them)
  --stride n      walk: force the stride length in frames (otherwise found)
  --start n       walk: force the loop's first video frame
  --skip n        walk: ignore the first n frames (video models settle; default 16)
  --mirror        flip the result (room figures face LEFT; clips are made facing right)
  --feet f        clear shut-in paper only in the lowest f of the figure (default .24)
  --paper n       how far from the paper's colour still counts as paper (default 20)
  --pull n        pull the soft edge in by n pixels (default 1)
  --cols n        frames across the sheet (default 8)
  --scale k       resize the frames (default 1)
  --parts n       split the sheet into n files name-0.webp ... (large gestures)
"""
import sys, argparse, json, math
import numpy as np, cv2
from PIL import Image


def read(path, rng):
    cap = cv2.VideoCapture(path); fr = []
    while True:
        ok, f = cap.read()
        if not ok: break
        fr.append(cv2.cvtColor(f, cv2.COLOR_BGR2RGB))
    fps = cap.get(cv2.CAP_PROP_FPS)
    a, b = (0, len(fr) - 1) if not rng else rng
    return fr, max(0, a), min(len(fr) - 1, b), fps


def matte(rgb, a):
    """One frame to RGBA."""
    h, w = rgb.shape[:2]; f = rgb.astype(np.float32)
    edge = np.concatenate([f[:6].reshape(-1, 3), f[-6:].reshape(-1, 3), f[:, :6].reshape(-1, 3), f[:, -6:].reshape(-1, 3)])
    paper = np.median(edge, axis=0)
    d = np.max(np.abs(f - paper), axis=2)
    near = d < a.paper
    # paper = near-white that reaches the frame's edge
    n, lab = cv2.connectedComponents(near.astype(np.uint8), connectivity=4)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    outside = np.isin(lab, border[border > 0]) & near
    body = ~outside
    # keep the main figure only (specks of paper noise dropped)
    n, lab, st, _ = cv2.connectedComponentsWithStats(cv2.dilate(body.astype(np.uint8), np.ones((5, 5), np.uint8)), connectivity=8)
    if n > 1:
        big = 1 + int(np.argmax(st[1:, cv2.CC_STAT_AREA])); body &= lab == big
    ys = np.where(body.any(axis=1))[0]
    if not len(ys): return np.zeros((h, w, 4), np.uint8)
    top, bot = ys[0], ys[-1]
    # shut-in paper low down (between the feet and legs) is paper too
    inside_white = body & near
    cut = int(bot - a.feet * (bot - top))
    n, lab, st, _ = cv2.connectedComponentsWithStats(inside_white.astype(np.uint8), connectivity=4)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] >= 12 and st[i, cv2.CC_STAT_TOP] >= cut: body[lab == i] = False
        # higher up, only a patch that is the paper's very colour (a gap between hand and robe); a grey-white beard is not
        elif st[i, cv2.CC_STAT_AREA] >= 5 and float(d[lab == i].mean()) < a.paper * .3: body[lab == i] = False
    # alpha: solid inside; at the edge, by how far the pixel is from the paper's colour
    lo, hi = a.paper * .45, a.paper * 2.6
    soft = np.clip((d - lo) / (hi - lo), 0, 1)
    k = np.ones((3, 3), np.uint8)
    core = cv2.erode(body.astype(np.uint8), k, iterations=2).astype(bool)
    ring = cv2.dilate(body.astype(np.uint8), k, iterations=1).astype(bool) & ~core
    al = np.where(core, 1.0, np.where(ring, soft, 0.0)).astype(np.float32)
    # white inside the core that is really the figure stays at 1 (already); pull the edge in
    if a.pull > 0:
        al = np.minimum(al, cv2.erode(al, k, iterations=1) * .35 + al * .65) if a.pull < 1 else cv2.erode(al, k, iterations=int(a.pull))
        al = cv2.GaussianBlur(al, (0, 0), .6) * (al > 0)
    # take the paper out of the edge colours; then colour the faint edge from the body beside it
    aa = np.maximum(al, .05)[..., None]
    col = np.clip((f - (1 - aa) * paper) / aa, 0, 255)
    solid = (al > .8).astype(np.uint8)
    if solid.any():
        _, idx = cv2.distanceTransformWithLabels(1 - solid, cv2.DIST_L2, 3, labelType=cv2.DIST_LABEL_PIXEL)
        ys2, xs2 = np.where(solid > 0); lut = np.zeros((idx.max() + 1, 2), np.int32); lut[idx[ys2, xs2]] = np.stack([ys2, xs2], 1)
        src = lut[idx]; near_col = col[src[..., 0], src[..., 1]]
        t = np.clip((.8 - al) / .6, 0, 1)[..., None]; col = col * (1 - t) + near_col * t
    out = np.dstack([col, al * 255]).astype(np.uint8); out[al <= 0] = 0
    return out


def anchor(al):
    """Torso x (the upper body's middle) and the ground row."""
    ys = np.where(al.any(axis=1))[0]; top, bot = ys[0], ys[-1]
    y0, y1 = int(top + .18 * (bot - top)), int(top + .55 * (bot - top))
    xs = np.where(al[y0:y1].any(axis=0))[0]
    return (xs[0] + xs[-1]) / 2.0, bot, top


def place(im, dx, dy, W, H):
    M = np.float32([[1, 0, dx], [0, 1, dy]])
    return cv2.warpAffine(im, M, (W, H), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))


def premul(im):
    a = im[..., 3:4].astype(np.float32) / 255; return np.dstack([im[..., :3] * a, im[..., 3:4]]).astype(np.float32)


def diff(p, q):
    """How different two placed frames are: 0 the same, 1 nothing in common (shape and tone)."""
    a, b = p[..., 3] / 255, q[..., 3] / 255
    u = np.maximum(a, b).sum()
    if u < 1: return 1
    sh = np.abs(a - b).sum() / u
    tone = (np.abs(p[..., :3] - q[..., :3]).mean(axis=2) / 255 * np.minimum(a, b)).sum() / u
    return float(sh + tone)


def slide(P, a0, n):
    """Planted foot's slide in px a frame: the foot band's lowest pixels, tracked frame to frame."""
    sh = []
    for i in range(n - 1):
        A, B = P[a0 + i][..., 3] > 128, P[a0 + i + 1][..., 3] > 128
        ys = np.where(A.any(axis=1))[0]; bot = ys[-1]; band = slice(max(0, bot - 5), bot + 1)
        pa, pb = A[band].sum(axis=0).astype(np.float32), B[band].sum(axis=0).astype(np.float32)
        if pa.sum() < 4 or pb.sum() < 4: continue
        best, bs = None, 0
        for s in range(-16, 17):
            v = float((np.roll(pa, s) * pb).sum())
            if best is None or v > best: best, bs = v, s
        sh.append(bs)
    sh = np.array(sh, np.float32)
    # the planted foot goes steadily back (the commonest backward shift); forward jumps are foot changes
    back = sh[sh < -.5] if (sh < -.5).sum() >= (sh > .5).sum() else sh[sh > .5]
    return float(abs(np.median(back))) if len(back) else 0.0


def sheet(frames, cols, path, parts):
    H, W = frames[0].shape[:2]
    def one(fs, p):
        rows = math.ceil(len(fs) / cols); S = np.zeros((rows * H, cols * W, 4), np.uint8)
        for i, f in enumerate(fs): S[(i // cols) * H:(i // cols + 1) * H, (i % cols) * W:(i % cols + 1) * W] = f
        Image.fromarray(S, 'RGBA').save(p, quality=88, method=6)
    if parts > 1:
        per = math.ceil(len(frames) / parts)
        for i in range(parts): one(frames[i * per:(i + 1) * per], path.replace('.webp', '-%d.webp' % i))
        return per
    one(frames, path); return len(frames)


def over(f, bg):
    a = f[..., 3:4].astype(np.float32) / 255
    return (f[..., :3] * a + np.array(bg, np.float32) * (1 - a)).astype(np.uint8)


def checks(frames, path, loop):
    H, W = frames[0].shape[:2]; n = len(frames); cols = min(n, 16); rows = math.ceil(n / cols)
    k = min(1.0, 150 / H); w, h = int(W * k), int(H * k)
    S = np.zeros((rows * 2 * h, cols * w, 3), np.uint8)
    for i, f in enumerate(frames):
        r, c = i // cols, i % cols
        for j, bg in enumerate(((22, 16, 14), (188, 178, 160))):
            S[(r * 2 + j) * h:(r * 2 + j) * h + h, c * w:c * w + w] = cv2.resize(over(f, bg), (w, h), interpolation=cv2.INTER_AREA)
    Image.fromarray(S).save(path.replace('.webp', '-strip.jpg'), quality=86)
    if loop:
        idx = [n - 3, n - 2, n - 1, 0, 1, 2]; z = max(1, round(420 / H)) if H < 420 else 1
        S = np.concatenate([cv2.resize(over(frames[i], (22, 16, 14)), (W * z, H * z), interpolation=cv2.INTER_CUBIC) for i in idx], axis=1)
        x = 3 * W * z; S[:, x - 1:x + 1] = (200, 160, 60)
        Image.fromarray(S).save(path.replace('.webp', '-seam.jpg'), quality=88)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('mode', choices=['walk', 'gesture']); ap.add_argument('video'); ap.add_argument('out')
    ap.add_argument('--frames'); ap.add_argument('--stride', type=int); ap.add_argument('--start', type=int)
    ap.add_argument('--skip', type=int, default=16); ap.add_argument('--mirror', action='store_true')
    ap.add_argument('--feet', type=float, default=.24); ap.add_argument('--paper', type=float, default=20)
    ap.add_argument('--pull', type=float, default=1); ap.add_argument('--cols', type=int, default=8)
    ap.add_argument('--scale', type=float, default=1); ap.add_argument('--parts', type=int, default=1)
    a = ap.parse_args()
    rng = tuple(int(v) for v in a.frames.split('-')) if a.frames else None
    raw, f0, f1, fps = read(a.video, rng)
    print('%d frames, %dx%d, %.0f a second; using %d..%d' % (len(raw), raw[0].shape[1], raw[0].shape[0], fps, f0, f1))
    M = {i: matte(raw[i], a) for i in range(f0, f1 + 1)}
    info = {'frames': None}
    if a.mode == 'walk':
        A = {i: anchor(M[i][..., 3] > 128) for i in M}
        Hh, Ww = raw[0].shape[:2]; cx = Ww / 2
        gnd = float(np.percentile([A[i][1] for i in A], 90))
        P = {i: premul(place(M[i], cx - A[i][0], 0, Ww, Hh)) for i in M}
        lo = max(f0, a.skip if not rng else f0)
        ids = list(range(lo, f1 + 1))
        # the step: the first lag at which the figure comes back to itself; the stride is two steps
        if a.stride: stride = a.stride
        else:
            lag = {}
            for k in range(6, min(48, len(ids) - 2)):
                lag[k] = float(np.mean([diff(P[i], P[i + k]) for i in ids[:len(ids) - k:2]]))
            ks = sorted(lag); mins = [k for k in ks[1:-1] if lag[k] <= lag[k - 1] and lag[k] <= lag[k + 1]]
            if not mins: sys.exit('no repeat found: is this a walk? try --stride')
            step = mins[0]
            cand = [k for k in ks if abs(k - 2 * step) <= 3]
            if not cand: sys.exit('the clip is too short for a whole stride (step %d frames); try a longer clip' % step)
            stride = min(cand, key=lambda k: lag[k])
            print('step about %d frames (match %.3f); whole stride %d frames (match %.3f)' % (step, lag[step], stride, lag[stride]))
            if lag[step] < lag[stride] * .8: print('  note: a half stride matches better than the whole one; near and far legs still swap there, so the whole stride is kept')
        starts = [a.start] if a.start is not None else [i for i in ids if i + stride <= f1]
        if not starts: sys.exit('no room for a stride of %d in frames %d..%d' % (stride, lo, f1))
        sc = {s: diff(P[s], P[s + stride]) for s in starts}
        s0 = min(sc, key=sc.get)
        sel = list(range(s0, s0 + stride))
        adj = [diff(P[i], P[i + 1]) for i in sel[:-1]]
        seam = diff(P[sel[-1]], P[s0]); closing = sc[s0]
        print('loop: video frames %d..%d (%d frames)' % (s0, sel[-1], stride))
        print('seam: last to first %.3f; ordinary frame to frame %.3f (median), %.3f (largest)%s' % (seam, np.median(adj), max(adj), '   <-- LOOK AT THE SEAM' if seam > 1.6 * max(adj) else '   ok'))
        print('      frame %d against frame %d (should be the same pose): %.3f' % (s0, s0 + stride, closing))
        vpx = slide(P, s0, stride)
        # the body's own sway is kept, only a steady drift over the loop is evened out
        tops = [A[i][2] for i in sel]; bots = [A[i][1] for i in sel]
        dtop = A[s0 + stride][2] - A[s0][2]
        if abs(dtop) > 2: print('  note: the head is %.0f px %s at the loop\'s end than its start (a zoom or a bow): look at the seam' % (abs(dtop), 'lower' if dtop > 0 else 'higher'))
        frames = [place(M[i], cx - A[i][0], 0, Ww, Hh) for i in sel]
        info.update(loop=[s0, sel[-1]], seam=round(seam, 3), vpx=round(vpx, 1))
    else:
        sel = list(range(f0, f1 + 1)); frames = [M[i] for i in sel]; cx = None
        gnd = float(np.percentile([np.where((M[i][..., 3] > 128).any(axis=1))[0][-1] for i in sel], 90)); vpx = None
        ax0 = [anchor(M[i][..., 3] > 128)[0] for i in sel[:3]]; cx = float(np.mean(ax0))
        print('gesture: video frames %d..%d (%d frames)' % (sel[0], sel[-1], len(sel)))
    # one crop for all frames
    U = np.zeros(frames[0].shape[:2], bool)
    for f in frames: U |= f[..., 3] > 8
    ys, xs = np.where(U.any(axis=1))[0], np.where(U.any(axis=0))[0]
    x0, x1, y0, y1 = max(0, xs[0] - 3), xs[-1] + 4, max(0, ys[0] - 3), ys[-1] + 4
    frames = [f[y0:y1, x0:x1] for f in frames]; ax, g = cx - x0, gnd - y0
    if a.scale != 1:
        frames = [cv2.resize(f, None, fx=a.scale, fy=a.scale, interpolation=cv2.INTER_AREA if a.scale < 1 else cv2.INTER_CUBIC) for f in frames]
        ax *= a.scale; g *= a.scale
    H, W = frames[0].shape[:2]
    if a.mirror: frames = [np.ascontiguousarray(f[:, ::-1]) for f in frames]; ax = W - ax
    per = sheet(frames, a.cols, a.out, a.parts)
    checks(frames, a.out, a.mode == 'walk')
    name = a.out.split('/')[-1].replace('.webp', '')
    meta = "n: '%s', ax: %.1f, g: %.0f, cols: %d, fr: %d, W: %d, H: %d" % (name, ax, g, a.cols, len(frames), W, H)
    if vpx is not None: meta += ', vpx: %.1f' % (vpx * a.scale)
    if a.parts > 1: meta += ', parts: %d, per: %d' % (a.parts, per)
    fig_h = g - min(np.where((f[..., 3] > 128).any(axis=1))[0][0] for f in frames)
    print('META { %s }   (figure about %.0f px tall: s = his height in the room / %.0f)' % (meta, fig_h, fig_h))
    print('wrote %s, and for checking %s and %s' % (a.out, a.out.replace('.webp', '-strip.jpg'), a.out.replace('.webp', '-seam.jpg') if a.mode == 'walk' else '(no seam: a gesture)'))


if __name__ == '__main__':
    main()
