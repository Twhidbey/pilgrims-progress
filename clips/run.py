#!/usr/bin/env python3
"""Make the next clips in the queue on a free Hugging Face Space (Wan 2.2 image-to-video on ZeroGPU).

  python3 clips/run.py [MAX_JOBS]        (run from the root of the `clips` branch checkout)

Reads clips/queue.json; for each job whose status is "todo" (in order): builds the first (and, if given, the last)
picture from the game's own figures, read from origin/main with `git show` (so this branch carries no game files),
calls the Space, and saves clips/out/<id>.mp4 and clips/out/<id>-sheet.jpg (eight frames, for a quick look). The job
becomes "done" (or "failed" with the error, after two tries). Stops early when the free daily GPU allowance is used
up: the rest wait for tomorrow. Appends a line per job to clips/log.md.

The Hugging Face token is NOT in this file or in any variable: the session's network proxy adds it to requests to
the Space's host. Nothing here costs money.

A picture is given as {"src": ..., "flip": bool, "h": figure height in px (of 720), "x": feet centre (of 1280)}.
src is "assets/<name>.webp" or "pack:<name>:<frame>" (a frame of assets/<name>.pack). Figures in the game face
right in their files, except the house's room figures (room-*.webp), which face left: set "flip" to turn them.
"""
import io, json, os, struct, subprocess, sys, time, datetime, traceback
from PIL import Image

SPACE = 'https://r3gm-wan2-2-fp8da-aoti-preview.hf.space/'
NEG = 'camera movement, zoom, pan, cut, extra limbs, extra people, text, watermark, fast motion, morphing, background scenery'
STYLE = (' A completely FLAT SIDE VIEW, like a shadow-puppet play: the figure is seen exactly from the side on plain white '
         'paper, with no ground, no floor and no shadow. Both feet always rest on the same level line; the far foot is never '
         'higher. The camera is completely still and does not zoom. Slow, calm, natural movement. Keep the painting style '
         'and colours of the picture exactly.')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Q = os.path.join(ROOT, 'clips', 'queue.json')
OUT = os.path.join(ROOT, 'clips', 'out')


def main_file(path):
    return subprocess.run(['git', 'show', 'origin/main:' + path], cwd=ROOT, capture_output=True, check=True).stdout


def figure(src):
    if src.startswith('pack:'):
        _, name, k = src.split(':')
        b = main_file('assets/' + name + '.pack'); n = struct.unpack_from('<I', b, 0)[0]
        lens = struct.unpack_from('<%dI' % n, b, 4); off = 4 + 4 * n + sum(lens[:int(k)])
        return Image.open(io.BytesIO(b[off:off + lens[int(k)]])).convert('RGBA')
    return Image.open(io.BytesIO(main_file(src))).convert('RGBA')


def picture(spec, path):
    im = figure(spec['src'])
    if spec.get('crop'):
        # a living part of a room painting: the crop (in the asset's pixels, about 16:9) fills the whole frame
        im.convert('RGB').crop(tuple(spec['crop'])).resize((1280, 720), Image.LANCZOS).save(path); return
    if spec.get('flip'): im = im.transpose(Image.FLIP_LEFT_RIGHT)
    a = im.split()[3]; bb = a.point(lambda v: 255 if v > 60 else 0).getbbox(); im = im.crop(bb)
    h = spec.get('h', 560); k = h / im.height; im = im.resize((max(1, round(im.width * k)), h), Image.LANCZOS)
    bg = Image.new('RGB', (1280, 720), 'white'); x = spec.get('x', 640)
    bg.paste(im, (round(x - im.width / 2), 690 - h), im); bg.save(path)


def sheet(mp4, path):
    import cv2
    v = cv2.VideoCapture(mp4); fr = []
    while True:
        ok, f = v.read()
        if not ok: break
        fr.append(f)
    if not fr: return 0
    idx = [round(i * (len(fr) - 1) / 7) for i in range(8)]
    ims = [Image.fromarray(cv2.cvtColor(fr[i], cv2.COLOR_BGR2RGB)) for i in idx]
    w, h = ims[0].size; s = Image.new('RGB', (w * 2, h))
    for j, im in enumerate(ims): s.paste(im.resize((w // 2, h // 2)), ((j % 4) * w // 2, (j // 4) * h // 2))
    s.save(path, quality=84); return len(fr)


def log(line):
    with open(os.path.join(ROOT, 'clips', 'log.md'), 'a') as f: f.write(line + '\n')


def run(maxjobs):
    from gradio_client import Client, handle_file
    q = json.load(open(Q)); os.makedirs(OUT, exist_ok=True)
    todo = [j for j in q['jobs'] if j.get('status', 'todo') == 'todo']
    if not todo: print('queue empty'); return
    c = Client(SPACE, verbose=False); made = 0
    for j in todo[:maxjobs]:
        f0, f1 = os.path.join(OUT, j['id'] + '-first.png'), os.path.join(OUT, j['id'] + '-last.png')
        picture(j['first'], f0); last = None
        if j.get('last'): picture(j['last'], f1); last = handle_file(f1)
        t = time.time()
        try:
            r = c.predict(handle_file(f0), last, j['prompt'] + STYLE, j.get('steps', 6), NEG, j.get('seconds', 3.5),
                          1, 1, j.get('seed', 42), False, 6, 'UniPCMultistep', 3.0, 16, True, True, True, api_name='/generate_video')
        except Exception as e:
            msg = str(e)[:300].replace('\n', ' ')
            if 'quota' in msg.lower() or 'zerogpu' in msg.lower() or 'exceeded' in msg.lower():
                log('- %s %s: stopped, the free daily GPU allowance is used up (%s)' % (stamp(), j['id'], msg)); print('quota:', msg); break
            j['tries'] = j.get('tries', 0) + 1; j['error'] = msg
            if j['tries'] >= 2: j['status'] = 'failed'
            log('- %s %s: error (%s)' % (stamp(), j['id'], msg)); print('error', j['id'], msg)
            json.dump(q, open(Q, 'w'), indent=1); continue
        v = r[1] if isinstance(r[1], str) else r[0]['video']
        mp4 = os.path.join(OUT, j['id'] + '.mp4')
        with open(v, 'rb') as a, open(mp4, 'wb') as b: b.write(a.read())
        n = sheet(mp4, os.path.join(OUT, j['id'] + '-sheet.jpg'))
        j['status'] = 'done'; j['made'] = stamp(); j['frames'] = n; j['secs'] = round(time.time() - t); j.pop('error', None)
        made += 1; log('- %s %s: done, %d frames, %d s' % (stamp(), j['id'], n, j['secs'])); print('done', j['id'])
        json.dump(q, open(Q, 'w'), indent=1)
    json.dump(q, open(Q, 'w'), indent=1); print('made', made)


def stamp():
    return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')


if __name__ == '__main__':
    try: run(int(sys.argv[1]) if len(sys.argv) > 1 else 6)
    except Exception: traceback.print_exc(); sys.exit(1)
