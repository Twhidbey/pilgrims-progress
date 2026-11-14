#!/usr/bin/env python3
"""Move the characters' frames out of index.html into assets/*.pack (one file per character).

index.html keeps each character's frames as base64 WebP inside CHR_SRC, PLI_SRC, OBS_SRC, EVA_SRC, STD_SRC.
A .pack file is the very same WebP files end to end (nothing is re-compressed):
  4 bytes: how many frames (little-endian), then 4 bytes per frame: its length, then the frames.
story-lab.html reads them with loadPack(). Run this again whenever frames in index.html change:
  python3 tools/pack-frames.py
It also prints each character's META line, to copy into story-lab.html if it changed.
"""
import base64, os, re, struct
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(root, 'index.html'), encoding='utf-8').read()
names = {'CHR': 'christian-walk', 'STD': 'christian-stand', 'EVA': 'evangelist', 'OBS': 'obstinate', 'PLI': 'pliable'}
for key, name in names.items():
    body = re.search(r'const ' + key + r'_SRC=\[(.*?)\];\n', src, re.S).group(1)
    frames = [base64.b64decode(f) for f in re.findall(r'base64,([A-Za-z0-9+/=]+)', body)]
    out = os.path.join(root, 'assets', name + '.pack')
    with open(out, 'wb') as f:
        f.write(struct.pack('<I', len(frames)))
        for fr in frames: f.write(struct.pack('<I', len(fr)))
        for fr in frames: f.write(fr)
    meta = re.search(r'const ' + key + r'_META=(.*?);\n', src).group(1)
    print(f'{name}.pack: {len(frames)} frames, {os.path.getsize(out) // 1024} KB\n  {key}_META={meta}')
