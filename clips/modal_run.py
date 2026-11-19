#!/usr/bin/env python3
"""Make the next clips in clips/queue.json on Modal (run by GitHub Actions; see clips/modal_video.py).

  python3 clips/modal_run.py [MAX_JOBS]

Same queue, same pictures and same checks as clips/run.py (the free Hugging Face runner); a job made here is marked
"via": "modal". MONEY: every call's whole wall time (cold start included) is charged in clips/modal-spend.json at
the GPU's rate, and nothing more is started once this month's estimate passes CAP. Modal's own workspace budget
is a second, outer guard.
"""
import datetime, json, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import run as R

CAP = 18.0                      # dollars a month, estimated; Modal's free credits are $30
RATE = 2.50 / 3600 + 0.0001     # A100-80GB per second (about $2.50 an hour), plus CPU and memory
SPEND = os.path.join(R.ROOT, 'clips', 'modal-spend.json')


def month():
    return datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m')


def main(maxjobs):
    import modal
    sp = json.load(open(SPEND)) if os.path.exists(SPEND) else {}
    m = month(); sp.setdefault(m, 0.0)
    if sp[m] >= CAP:
        print('monthly cap reached: $%.2f of $%.2f' % (sp[m], CAP)); return
    q = json.load(open(R.Q)); os.makedirs(R.OUT, exist_ok=True)
    todo = [j for j in q['jobs'] if j.get('status', 'todo') == 'todo'][:maxjobs]
    if not todo: print('queue empty'); return
    Video = modal.Cls.from_name('pp-video', 'Video')
    v = Video(); made = 0
    for j in todo:
        if sp[m] >= CAP:
            R.log('- %s modal: stopped, the monthly cap ($%.0f) is reached' % (R.stamp(), CAP)); break
        f0, f1 = os.path.join(R.OUT, j['id'] + '-first.png'), os.path.join(R.OUT, j['id'] + '-last.png')
        R.picture(j['first'], f0); body = {'first': open(f0, 'rb').read(), 'prompt': j['prompt'] + R.STYLE,
                                           'negative': R.NEG, 'seconds': j.get('seconds', 3.5), 'steps': j.get('steps', 6),
                                           'seed': j.get('seed', 42)}
        if j.get('last'):
            R.picture(j['last'], f1); body['last'] = open(f1, 'rb').read()
        t = time.time()
        try:
            mp4 = v.make.remote(body)
        except Exception as e:
            dt = time.time() - t; sp[m] += dt * RATE
            msg = str(e)[:300].replace('\n', ' ')
            j['tries'] = j.get('tries', 0) + 1; j['error'] = msg
            if j['tries'] >= 2: j['status'] = 'failed'
            R.log('- %s %s: modal error (%s)' % (R.stamp(), j['id'], msg)); print('error', j['id'], msg)
            json.dump(q, open(R.Q, 'w'), indent=1); json.dump(sp, open(SPEND, 'w'), indent=1)
            if 'budget' in msg.lower() or 'limit' in msg.lower() or 'billing' in msg.lower(): break
            continue
        dt = time.time() - t; sp[m] += dt * RATE
        out = os.path.join(R.OUT, j['id'] + '.mp4')
        open(out, 'wb').write(mp4)
        n = R.sheet(out, os.path.join(R.OUT, j['id'] + '-sheet.jpg'))
        j.update(status='done', via='modal', made=R.stamp(), frames=n, secs=round(dt)); j.pop('error', None)
        made += 1; R.log('- %s %s: done on modal, %d frames, %d s, about $%.2f' % (R.stamp(), j['id'], n, dt, dt * RATE))
        json.dump(q, open(R.Q, 'w'), indent=1); json.dump(sp, open(SPEND, 'w'), indent=1)
    print('made', made, 'this month about $%.2f' % sp[m])


if __name__ == '__main__':
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 8)
