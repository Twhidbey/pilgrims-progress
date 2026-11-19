#!/usr/bin/env python3
"""pack-check.py: looks through every assets/*.pack for cutting faults, frame by frame.
  python3 tools/pack-check.py DIR      (DIR: a scratch folder; put older copies of packs in DIR/old/ to compare)
Per pack it counts frames with: fill (solid areas over 400 px that an older copy had clear), holes (shut-in clear
spaces over 120 px), ghost (soft pixels far from the body), pale (an edge much lighter than the body inside it),
jump (a frame unlike its neighbours). It only points: look at the flagged frames on a red ground before changing any."""
import struct, io, sys, glob, os, json, numpy as np, cv2
from PIL import Image
S=sys.argv[1]
def load(p):
    b=open(p,'rb').read(); n=struct.unpack('<I',b[:4])[0]; L=struct.unpack('<%dI'%n,b[4:4+4*n]); off=4+4*n; fr=[]
    for l in L: fr.append(np.array(Image.open(io.BytesIO(b[off:off+l])).convert('RGBA'))); off+=l
    return fr
rep={}
for p in sorted(glob.glob('assets/*.pack')):
    name=os.path.basename(p)[:-5]; fr=load(p); old=None
    if os.path.exists(S+'/old/'+name+'.pack') and os.path.getsize(S+'/old/'+name+'.pack')>100:
        try:
            old=load(S+'/old/'+name+'.pack')
            if len(old)!=len(fr) or old[0].shape!=fr[0].shape: old=None
        except Exception: old=None
    R={'n':len(fr),'size':fr[0].shape[:2],'fill':[],'holes':[],'ghost':[],'jump':[],'pale':[]}
    prev=None; ds=[]
    for i,f in enumerate(fr):
        a=f[...,3]; solid=(a>128)
        if old is not None:
            add=solid&(old[i][...,3]<60); n,lab,st,_=cv2.connectedComponentsWithStats(add.astype(np.uint8),connectivity=8)
            big=max([int(st[j,4]) for j in range(1,n)],default=0)
            if big>400: R['fill'].append((i,big))
        clear=(a<40).astype(np.uint8); n,lab,st,_=cv2.connectedComponentsWithStats(clear,connectivity=4)
        border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])).tolist())
        hs=[int(st[j,4]) for j in range(1,n) if j not in border and st[j,4]>120]
        if hs: R['holes'].append((i,sorted(hs,reverse=True)[:3]))
        # ghosts: soft pixels far (>4px) from the solid body
        dist=cv2.distanceTransform((~(a>200)).astype(np.uint8),cv2.DIST_L2,3)
        g=int(((a>25)&(a<=200)&(dist>4)).sum())
        if g>250: R['ghost'].append((i,g))
        # pale fringe: edge ring much lighter than the body just inside
        k=np.ones((3,3),np.uint8); er=cv2.erode(solid.astype(np.uint8),k,iterations=1).astype(bool); ring=solid&~er; inner=er&~cv2.erode(er.astype(np.uint8),k,iterations=3).astype(bool)
        lum=f[...,:3].mean(axis=2)
        if ring.sum()>50 and inner.sum()>50:
            d=float(lum[ring].mean()-lum[inner].mean())
            if d>22: R['pale'].append((i,round(d)))
        if prev is not None and prev.shape==solid.shape:
            u=(prev|solid).sum(); ds.append(float((prev^solid).sum()/max(1,u)))
        prev=solid
    if len(ds)>6:
        m=np.median(ds)
        R['jump']=[(i+1,round(d,2)) for i,d in enumerate(ds) if d>max(.3,3.2*m)]; R['med']=round(float(m),3)
    rep[name]=R
    print(name,R['n'],R['size'],'| fill',len(R['fill']),'| holes',len(R['holes']),'| ghost',len(R['ghost']),'| pale',len(R['pale']),'| jump',R['jump'][:6])
json.dump(rep,open(S+'/rep.json','w'))
