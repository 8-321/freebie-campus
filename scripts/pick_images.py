import os, io, json, urllib.request, urllib.parse
from PIL import Image, ImageDraw, ImageFont

UA = {'User-Agent': 'BaijianDemo/1.0 (campus demo)'}
BASE = 'C:/Users/34137/AppData/Local/hermes/cache/scratch'
CAND = os.path.join(BASE, 'cand')
os.makedirs(CAND, exist_ok=True)

ITEMS = [
    ('bread',   'pretzel bakery bread'),
    ('plant',   'succulent potted plant'),
    ('lecture', 'lecture hall audience students'),
    ('cup',     'bubble tea cup'),
    ('book',    'stack of textbooks'),
    ('scissors','hairdressing scissors'),
    ('box',     'cardboard boxes'),
    ('eye',     'eye examination optometry'),
    ('cake',    'cake slices buffet'),
    ('doc',     'resume document desk'),
    ('notes',   'handwritten notebook notes'),
    ('shirt',   'blank t-shirt'),
    ('lab',     'computer lab desks'),
    ('orange',  'mandarin oranges'),
]

def search(q, n=4):
    url = ('https://commons.wikimedia.org/w/api.php?action=query&generator=search'
           '&gsrsearch=' + urllib.parse.quote(q + ' filetype:bitmap') +
           '&gsrnamespace=6&gsrlimit=%d&prop=imageinfo&iiprop=url|mime&iiurlwidth=520&format=json' % n)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        j = json.loads(r.read().decode())
    pages = (j.get('query') or {}).get('pages') or {}
    out = []
    for p in sorted(pages.values(), key=lambda x: x.get('index', 99)):
        ii = (p.get('imageinfo') or [{}])[0]
        u = ii.get('thumburl') or ii.get('url')
        if u:
            out.append((p['title'], u))
    return out

picked = {}
for key, q in ITEMS:
    try:
        got = search(q, 4)
    except Exception as e:
        print('ERR', key, e); continue
    paths = []
    for i, (t, u) in enumerate(got):
        p = os.path.join(CAND, '%s_%d.jpg' % (key, i))
        try:
            req = urllib.request.Request(u, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                data = r.read()
            im = Image.open(io.BytesIO(data)).convert('RGB')
            im.thumbnail((520, 520))
            im.save(p, 'JPEG', quality=82)
            paths.append((p, t))
        except Exception as e:
            print('dl fail', key, i, e)
    picked[key] = paths
    print(key, len(paths))

json.dump({k: [(p, t) for p, t in v] for k, v in picked.items()}, open(os.path.join(BASE, 'cand.json'), 'w'), ensure_ascii=False)

# contact sheet: 14 rows x 4 cols
CW, CH, PAD, LBL = 210, 158, 6, 26
cols = 4
rows = len(ITEMS)
W = PAD + cols * (CW + PAD)
H = PAD + rows * (CH + LBL + PAD)
sheet = Image.new('RGB', (W, H), '#FFFFFF')
d = ImageDraw.Draw(sheet)
f = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 13)
for r, (key, q) in enumerate(ITEMS):
    y = PAD + r * (CH + LBL + PAD)
    d.text((PAD, y), '%s  (%s)' % (key, q), font=f, fill='#111111')
    for c, (p, t) in enumerate(picked.get(key, [])):
        x = PAD + c * (CW + PAD)
        yy = y + LBL
        try:
            im = Image.open(p).convert('RGB')
        except Exception:
            continue
        im.thumbnail((CW, CH))
        sheet.paste(im, (x + (CW - im.width) // 2, yy + (CH - im.height) // 2))
        d.text((x + 2, yy + CH - 12), '%d' % c, font=f, fill='#FFFFFF')
sheet.save(os.path.join(BASE, 'cand-sheet.jpg'), 'JPEG', quality=86)
print('sheet', sheet.size)
