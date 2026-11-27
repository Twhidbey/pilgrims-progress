import mediapipe as mp, cv2, json, glob, numpy as np, sys
DIR = sys.argv[1]
from mediapipe.tasks import python as P
from mediapipe.tasks.python import vision as V
opt = V.FaceLandmarkerOptions(base_options=P.BaseOptions(model_asset_path='face_landmarker.task'), output_face_blendshapes=True, num_faces=1)
det = V.FaceLandmarker.create_from_options(opt)
R = dict(up=[33,246,161,160,159,158,157,173,133], lo=[33,7,163,144,145,153,154,155,133], cr=[247,30,29,27,28,56,190], ir=[468,469,470,471,472], bu=[70,63,105,66,107], bl=[46,53,52,65,55], un=[226,31,228,229,230,231,232,233,244])
L = dict(up=[263,466,388,387,386,385,384,398,362], lo=[263,249,390,373,374,380,381,382,362], cr=[467,260,259,257,258,286,414], ir=[473,474,475,476,477], bu=[300,293,334,296,336], bl=[276,283,282,295,285], un=[446,261,448,449,450,451,452,453,464])
out = []; bs_names = None
for f in sorted(glob.glob(DIR + '/full/*.jpg')):
    im = cv2.cvtColor(cv2.imread(f), cv2.COLOR_BGR2RGB); h, w = im.shape[:2]
    r = det.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=im))
    if not r.face_landmarks: out.append(None); continue
    lm = np.array([[p.x * w, p.y * h] for p in r.face_landmarks[0]])
    a, b = lm[33], lm[263]; d = b - a; D = np.hypot(*d); c, s = d / D
    o = (lm[133] + lm[362]) / 2
    def N(i):
        v = lm[i] - o; return [round(float((v[0] * c + v[1] * s) / D), 4), round(float((-v[0] * s + v[1] * c) / D), 4)]
    fr = {'R': {k: [N(i) for i in v] for k, v in R.items()}, 'L': {k: [N(i) for i in v] for k, v in L.items()}}
    fr['px'] = [float(o[0]), float(o[1]), float(D), float(np.arctan2(s, c))]
    fr['bs'] = {x.category_name: round(x.score, 3) for x in r.face_blendshapes[0] if x.category_name.startswith(('eye', 'brow', 'cheekSquint', 'mouthSmile'))}
    out.append(fr)
json.dump(out, open(DIR + '/track.json', 'w'))
ok = [f for f in out if f]; print(len(out), len(ok))
for i in range(0, len(out), 15):
    f = out[i]; print(i, {k: f['bs'][k] for k in ['eyeBlinkLeft','eyeWideLeft','eyeSquintLeft','browInnerUp','browDownLeft','eyeLookUpLeft','eyeLookInLeft']}, 'open', round(f['R']['lo'][4][1]-f['R']['up'][4][1],3), round(f['L']['lo'][4][1]-f['L']['up'][4][1],3))
