#!/usr/bin/env python3
"""Record the story's spoken lines with Google's speech service (Gemini TTS) into assets/voice/*.mp3.

It reads every spoken line straight out of index.html, slough.js (Level 2) and hill.js (Level 3) (anything written as [N, '...'], [C, '...'],
[E, '...'], [O, '...'], [PL, '...'], [W, '...'], [H, '...'] or [WW, '...']), so the words on screen and the recordings cannot drift apart. Each line becomes one small
MP3 named by a hash of who says it and the words; the game works out the same name (voiceName() in index.html).
Only missing lines are recorded; recordings of lines that no longer exist are deleted (keep the files trim).

  GEMINI_API_KEY=... python3 tools/make-voice.py            record what is missing
  GEMINI_API_KEY=... python3 tools/make-voice.py --redo C   record Christian's lines again (N, C, E, O, PL, W, H, all, or styled = the lines with a direction in STYLE)

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
          'H': 'voice_njlpqcyvcd0a',      # Help (Level 2), designed in build 91 from the description in HANDOFF.md (build 87)
          'WW': 'voice_5pb813zhf90w',     # Mr. Worldly Wiseman (Level 3), designed in build 143 (description in HANDOFF.md)
          # Level 4, the Interpreter's House (rooms.js), designed overnight after build 261 (descriptions in HANDOFF.md)
          'I': 'voice_jjn83osdk67i', 'MAN': 'voice_bxeyrj0cbj0h', 'DRM': 'voice_m1731k2m6r6k', 'BR': 'voice_3r4cxjhyemkr', 'VO': 'voice_57t9upkd6uye',
          # Level 5, the Cross (cross.js): one voice for the three Shining Ones, designed after build 393 (description in HANDOFF.md)
          'SO': 'voice_s9z08ntibwpx', 'S1': 'voice_s9z08ntibwpx', 'S3': 'voice_s9z08ntibwpx',
          # Good-will at the wicket-gate (hill.js now; Level 4's gate scene later), designed in the vision chat (description in HANDOFF.md)
          'GW': 'voice_zpixol5qpz8t',
          'CH': 'voice_jwslar8d4ub3'}      # Christian's son (Level 5's climb, build 638); a voice described with a child's age was refused, so described without one
WHO = {'N': '', 'C': 'Christian', 'E': 'Evangelist', 'O': 'Obstinate', 'PL': 'Pliable', 'W': 'His wife', 'H': 'Help', 'WW': 'Mr. Worldly Wiseman', 'I': 'The Interpreter', 'MAN': 'The man in the cage', 'DRM': 'The trembling man', 'BR': 'The brave man', 'VO': 'Voices from the palace', 'SO': 'The Shining Ones', 'S1': 'The first Shining One', 'S3': 'The third Shining One', 'GW': 'Good-will', 'CH': 'His son'}
KEY = os.environ.get('GEMINI_API_KEY', '')
# HOW A LINE IS SAID (build 125, owner: "are him and Christian voices stressed as they sink ?? Seems like they would be more
# desperate"): a line listed here is recorded with these tags in square brackets in front of it. The speech model acts
# them and does not say them. (A direction written as a sentence, "Say this as a frightened boy: ...", was read out loud
# by a designed voice, and this model takes no system instruction; bracketed tags are what works.) An opening "Ah" may
# come out as a gasp: the check lets that pass. `--redo styled` records these again. Every other line is said plainly.
STYLE = {
    "Ah, neighbor Christian, where are you now?": "[alarmed, breathless, frightened]",
    "Truly, I do not know.": "[shaken, breathless, weary]",
    "Is this the happiness you told me of? If I ever get out, you can have your fine country all to yourself!": "[angry, frightened, breathless, almost shouting]",
    "No. I must struggle on, toward the gate.": "[straining, through gritted teeth, determined, out of breath]",
    "Sir, a man called Evangelist sent me this way to the gate, and I fell in here.": "[exhausted, out of breath, pleading]",
    "Fear followed me so hard that I fled the nearest way, and fell in.": "[exhausted, ashamed, out of breath]",
    # Level 3 (build 143): under the burning hill and before Evangelist
    "Woe is me, for I am undone!": "[crying out, broken, in tears]",
    "What does that mean?": "[startled, breathless]",
    "I rejoice, and tremble.": "[trembling, quietly glad, out of breath]",
    "Is this the happiness you told me of? You can have your fine country to yourself!": "[angry, frightened, breathless, almost shouting]",
    "To that little gate ahead. I cannot get this burden off myself.": "[weary, burdened, sincere]",
    "Bear your burden a little longer. At the place of deliverance, it will fall from your back of itself.": "[gentle, kind, slow, reassuring]",
    "Blest cross! Blest sepulchre! Blest rather be the Man that there was put to shame for me!": "[singing softly, joyful, in wonder, close to tears]",
    "Sir, is there hope? May I go back to the gate? I am sorry I listened to him. May I be forgiven?": "[trembling, pleading, close to tears]",
    "May I come in? Will he open to me, sorry as I am?": "[hopeful, humble, a little out of breath]",
    # Level 4, the Interpreter's House (after build 261)
    "I am now a man of despair, shut up in it as in this iron cage. I cannot get out. Oh, now I cannot!": "[hopeless, sorrowful, sighing, quiet]",
    "Oh, eternity, eternity!": "[anguished, quiet, a long sigh]",
    "This night I dreamed. The heavens grew black, it thundered, and I heard the great sound of a trumpet.": "[trembling, hushed, breathless, in awe]",
    "I saw many caught up into the clouds, but I was left behind. I was not ready.": "[trembling, close to tears, hushed]",
    "Come in, come in; Eternal glory thou shalt win.": "[joyful, gentle, calling from far above]",
    "Set down my name, Sir.": "[firm, brave, steady]",
    # Level 5, the Cross
    "He hath given me rest by his sorrow, and life by his death.": "[with a merry heart, quiet wonder, joyful, close to tears]",
}

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
def words(s): return [SAME.get(w, w) for w in re.sub(r'[^a-z ]', '', s.lower().replace('-', ' ')).split() if w not in ('ah', 'oh')]
def close(a, b, attempt):           # from the second take, one misheard word (e.g. "No" heard as "Now") is let through
    return a == b or ''.join(a) == ''.join(b) or (attempt > 0 and len(a) == len(b) and sum(x != y for x, y in zip(a, b)) <= 1)

def record(code, text, dest):
    for attempt in range(4):
        g = call(f'/models/{TTS}:generateContent', {'contents': [{'parts': [{'text': (STYLE[text] + ' ' + text) if text in STYLE else text}]}], 'generationConfig': {'responseModalities': ['AUDIO'], 'speechConfig': {'voiceConfig': {'voice': VOICES[code]}}}})
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
    src = ''.join(open(os.path.join(ROOT, f), encoding='utf-8').read() for f in ('index.html', 'slough.js', 'hill.js', 'rooms-outside.js', 'room1.js', 'room2.js', 'room3.js', 'room4.js', 'room5.js', 'room6.js', 'room7.js', 'rooms.js', 'cross.js'))
    lines = []
    for code, text in re.findall(r"\[(N|C|E|O|PL|WW|GW|CH|W|H|I|MAN|DRM|BR|VO|SO|S1|S3), '((?:[^'\\]|\\.)*)'", src):
        text = text.replace("\\'", "'")
        text = re.sub(r'\\u([0-9a-fA-F]{4})', lambda m: chr(int(m.group(1), 16)), text)      # \u2018 in the source is one character in the game: name the file as the game does
        if (code, text) not in lines: lines.append((code, text))
    os.makedirs(OUT, exist_ok=True)
    keep = set()
    for code, text in lines:
        fn = name(WHO[code], text) + '.mp3'; keep.add(fn); dest = os.path.join(OUT, fn)
        if os.path.exists(dest) and redo not in (code, 'all') and not (redo == 'styled' and text in STYLE): continue
        if not KEY: sys.exit('Set GEMINI_API_KEY first.')
        if not VOICES[code]: print('no voice yet for', WHO[code], '(skipped):', text); continue
        n = record(code, text, dest)
        print(f'{fn}  {os.path.getsize(dest) // 1024:3d} KB  {WHO[code] or "Storyteller":11s} {text}' + (f'  (take {n})' if n > 1 else ''))
    for fn in os.listdir(OUT):
        if fn not in keep: os.unlink(os.path.join(OUT, fn)); print('deleted', fn)
    print(len(lines), 'lines,', sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT)) // 1024, 'KB in assets/voice')

main()
