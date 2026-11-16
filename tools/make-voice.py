#!/usr/bin/env python3
"""Record the story's spoken lines with Google's speech service (Gemini TTS) into assets/voice/*.mp3.

It reads every spoken line straight out of index.html and slough.js (Level 2) (anything written as [N, '...'], [C, '...'],
[E, '...'], [O, '...'], [PL, '...'], [W, '...'] or [H, '...']), so the words on screen and the recordings cannot drift apart. Each line becomes one small
MP3 named by a hash of who says it and the words; the game works out the same name (voiceName() in index.html).
Only missing lines are recorded; recordings of lines that no longer exist are deleted (keep the files trim).

  GEMINI_API_KEY=... python3 tools/make-voice.py            record what is missing
  GEMINI_API_KEY=... python3 tools/make-voice.py --redo C   record Christian's lines again (N, C, E, O, PL, W, H or all)

The key is never stored in the repo (it is public). Each recording is checked by having a Gemini model write down what
it hears; a recording with the wrong words is thrown away and made again.
VOICES are voices designed (POST /v1beta/voices with {"model": "models/gemini-3.8-flash-tts", "type": "prompted", "store": true, "prompted": {"input": description}}; GET /v1beta/voices lists them; they expire after a year) from a description in the owner's Google project (the descriptions are in HANDOFF.md).
"""
import base64, json, os, re, subprocess, sys, tempfile, time, urllib.error, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'assets', 'voice')
API = 'https://generativelanguage.googleapis.com/v1beta'
TTS, EAR = 'gemini-3.8-flash-tts', 'gemini-3.8-flash'
VOICES = {'N': 'voice_zqnt5xdln1kq', 'C': 'voice_xp9kua42jfe2', 'E': 'voice_x361phwkq8td',      # storyteller, Christian, Evangelist
          'O': 'voice_a69c9ezmlhxf', 'PL': 'voice_42c9jyj3oc93', 'W': 'voice_ttq297s4wa5y',     # Obstinate, Pliable (boyish), Christian's wife
          'H': 'voice_njlpqcyvcd0a'}      # Help (Level 2), designed in build 91 from the description in HANDOFF.md (build 87)
WHO = {'N': '', 'C': 'Christian', 'E': 'Evangelist', 'O': 'Obstinate', 'PL': 'Pliable', 'W': 'His wife', 'H': 'Help'}
KEY = os.environ.get('GEMINI_API_KEY', '')

def call(path, body):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(), headers={'x-goog-api-key': KEY, 'Content-Type': 'application/json'})
    for wait in (0, 25, 40, 60, 60, 60):                      # Google allows about 10 requests a minute: wait and try again
        time.sleep(wait)
        try: return json.load(urllib.request.urlopen(req, timeout=180))
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:400]
            if e.code != 429 or 'per_day' in msg: sys.exit(f'Google said {e.code}: {msg}')
    sys.exit('Google kept saying "too many requests". Try again later.')

def name(who, text):                      # FNV-1a, the same sum as voiceName() in index.html
    h = 0x811c9dc5
    for ch in who + '|' + text: h = ((h ^ ord(ch)) * 0x01000193) & 0xffffffff
    return f'{h:08x}'

SAME = {'towards': 'toward', 'neighbour': 'neighbor', 'colour': 'color'}
def words(s): return [SAME.get(w, w) for w in re.sub(r'[^a-z ]', '', s.lower().replace('-', ' ')).split()]
def close(a, b, attempt):           # from the second take, one misheard word (e.g. "No" heard as "Now") is let through
    return a == b or (attempt > 0 and len(a) == len(b) and sum(x != y for x, y in zip(a, b)) <= 1)

def record(code, text, dest):
    for attempt in range(4):
        g = call(f'/models/{TTS}:generateContent', {'contents': [{'parts': [{'text': text}]}], 'generationConfig': {'responseModalities': ['AUDIO'], 'speechConfig': {'voiceConfig': {'voice': VOICES[code]}}}})
        wav = base64.b64decode(g['candidates'][0]['content']['parts'][0]['inlineData']['data'])
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f: f.write(wav)
        # cut the silence off both ends, one channel, small MP3
        cut = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.04'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f.name, '-af', f'{cut},areverse,{cut},areverse,afade=t=in:d=0.02', '-ac', '1', '-ar', '24000', '-b:a', '48k', dest], check=True)
        os.unlink(f.name)
        heard = call(f'/models/{EAR}:generateContent', {'contents': [{'parts': [{'inlineData': {'mimeType': 'audio/mp3', 'data': base64.b64encode(open(dest, 'rb').read()).decode()}}, {'text': 'Write down exactly the words spoken in this recording, and nothing else.'}]}]})
        heard = heard['candidates'][0]['content']['parts'][0].get('text', '')
        if close(words(heard), words(text), attempt): return attempt + 1
        print(f'   heard "{heard.strip()}" - trying again')
    sys.exit(f'Could not get a clean recording of: {text}')

def main():
    redo = sys.argv[sys.argv.index('--redo') + 1] if '--redo' in sys.argv else ''
    src = ''.join(open(os.path.join(ROOT, f), encoding='utf-8').read() for f in ('index.html', 'slough.js'))
    lines = []
    for code, text in re.findall(r"\[(N|C|E|O|PL|W|H), '((?:[^'\\]|\\.)*)'", src):
        text = text.replace("\\'", "'")
        if (code, text) not in lines: lines.append((code, text))
    os.makedirs(OUT, exist_ok=True)
    keep = set()
    for code, text in lines:
        fn = name(WHO[code], text) + '.mp3'; keep.add(fn); dest = os.path.join(OUT, fn)
        if os.path.exists(dest) and redo not in (code, 'all'): continue
        if not KEY: sys.exit('Set GEMINI_API_KEY first.')
        if not VOICES[code]: print('no voice yet for', WHO[code], '(skipped):', text); continue
        n = record(code, text, dest)
        print(f'{fn}  {os.path.getsize(dest) // 1024:3d} KB  {WHO[code] or "Storyteller":11s} {text}' + (f'  (take {n})' if n > 1 else ''))
    for fn in os.listdir(OUT):
        if fn not in keep: os.unlink(os.path.join(OUT, fn)); print('deleted', fn)
    print(len(lines), 'lines,', sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT)) // 1024, 'KB in assets/voice')

main()
