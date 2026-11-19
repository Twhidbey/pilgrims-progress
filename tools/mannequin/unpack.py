import sys, struct, io, os
from PIL import Image
import numpy as np
def frames(path):
    b = open(path,'rb').read(); n = struct.unpack_from('<I', b, 0)[0]
    lens = struct.unpack_from('<%dI'%n, b, 4); off = 4+4*n; out=[]
    for L in lens:
        out.append(Image.open(io.BytesIO(b[off:off+L])).convert('RGBA')); off += L
    return out
if __name__ == '__main__':
    name, out = sys.argv[1], sys.argv[2]
    fr = frames('assets/%s.pack'%name)
    print(name, len(fr), fr[0].size)
    cols = int(sys.argv[3]) if len(sys.argv)>3 else 10
    step = int(sys.argv[4]) if len(sys.argv)>4 else 1
    fr2 = fr[::step]
    w,h = fr[0].size; rows = (len(fr2)+cols-1)//cols
    sheet = Image.new('RGB',(w*cols,h*rows),(200,60,60))
    for i,f in enumerate(fr2):
        bg = Image.new('RGBA',f.size,(200,60,60,255)); bg.alpha_composite(f)
        sheet.paste(bg.convert('RGB'),((i%cols)*w,(i//cols)*h))
    sheet.save(out)
