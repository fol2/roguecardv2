from PIL import Image
import collections, sys

def black_void_to_alpha(src, dst, thresh=28):
    im = Image.open(src).convert('RGBA')
    px = im.load()
    w, h = im.size
    def near_black(c):
        r,g,b,a = c
        return a > 0 and r <= thresh and g <= thresh and b <= thresh
    q = collections.deque()
    seen = set()
    for x in range(w):
        for y in (0, h-1):
            if near_black(px[x,y]):
                q.append((x,y)); seen.add((x,y))
    for y in range(h):
        for x in (0, w-1):
            if (x,y) not in seen and near_black(px[x,y]):
                q.append((x,y)); seen.add((x,y))
    while q:
        x,y = q.popleft()
        px[x,y] = (0,0,0,0)
        for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if 0<=nx<w and 0<=ny<h and (nx,ny) not in seen and near_black(px[nx,ny]):
                seen.add((nx,ny)); q.append((nx,ny))
    im.save(dst)
    print('alpha', dst, im.size)

def resize_to(src, dst, tw, th):
    im = Image.open(src).convert('RGBA')
    im = im.resize((tw, th), Image.Resampling.LANCZOS)
    im.save(dst)
    print('resize', dst, im.size)

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'alpha':
        black_void_to_alpha(sys.argv[2], sys.argv[3], int(sys.argv[4]) if len(sys.argv)>4 else 28)
    elif cmd == 'resize':
        resize_to(sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]))
    elif cmd == 'alpha_resize':
        tmp = sys.argv[3] + '.tmp.png'
        black_void_to_alpha(sys.argv[2], tmp, int(sys.argv[6]) if len(sys.argv)>6 else 28)
        resize_to(tmp, sys.argv[3], int(sys.argv[4]), int(sys.argv[5]))
    else:
        raise SystemExit(cmd)
