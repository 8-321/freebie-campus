import os, io, re, json, sys, urllib.request, urllib.parse, html
from PIL import Image, ImageDraw, ImageFont

BASE = 'C:/Users/34137/AppData/Local/hermes/cache/scratch'
CAND = os.path.join(BASE, 'cand2')
os.makedirs(CAND, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'}
BAD = ('dreamstime', 'shutterstock', 'vecteezy', 'istockphoto', 'gettyimages', 'alamy', '123rf',
       'adobe', 'freepik', 'depositphotos', 'pond5', 'stock', 'lookaside', 'fbcdn', 'pinimg', 'ytimg')

ITEMS = [
    ('bread',   'fresh bread rolls bakery tray'),
    ('plant',   'potted succulent plant table'),
    ('lecture', 'students lecture hall workshop'),
    ('cup',     'bubble tea cup takeaway'),
    ('book',    'used textbooks stack desk'),
    ('scissors','hairdressing scissors comb'),
    ('box',     'cardboard boxes moving house'),
    ('eye',     'eye exam optometrist clinic'),
    ('cake',    'cake slices table cafe'),
    ('doc',     'resume paper laptop desk'),
    ('notes',   'handwritten notes notebook study'),
    ('shirt',   'white t-shirt flat lay'),
    ('lab',     'university computer lab'),
    ('orange',  'mandarin oranges box'),
]

def bing_urls(q, n=14):
    url = ('https://www.bing.com/images/search?q=' + urllib.parse.quote(q) +
           '&qft=%2Bfilterui%3Aphoto-photo&form=IRFLTR&first=1')
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        h = r.read().decode('utf8', 'ignore')
    raw = re.findall(r'murl&quot;:&quot;(.*?)&quot;', h) + re.findall(r'"murl":"(.*?)"', h)
    out = []
    for u in raw:
        u = html.unescape(u)
        if not u.startswith('http'): continue
        low = u.lower()
        if any(b in low for b in BAD): continue
        if not re.search(r'\.(jpg|jpeg|png|webp)', low.split('?')[0]): continue
        if u not in out: out.append(u)
        if len(out) >= n: break
    return out

keys = sys.argv[1:] or [k for k, _ in ITEMS]
rows = []
for key, q in ITEMS:
    if key not in keys: continue
    got = []
    try:
        urls = bing_urls(q, 12)
    except Exception as e:
        print('search fail', key, e); continue
    for i, u in enumerate(urls):
        if len(got) >= 5: break
        p = os.path.join(CAND, '%s_%d.jpg' % (key, i))
        try:
            req = urllib.request.Request(u, headers=UA)
            with urllib.request.urlopen(req, timeout=12) as r:
                data = r.read()
            if len(data) < 8000: continue
            im = Image.open(io.BytesIO(data)).convert('RGB')
            if im.width < 320 or im.height < 220: continue
            im.thumbnail((900, 900))
            im.save(p, 'JPEG', quality=82)
            got.append(p)
        except Exception:
            continue
    rows.append((key, q, got))
    print(key, len(got), flush=True)

json.dump(rows, open(os.path.join(BASE, 'cand2.json'), 'w'), ensure_ascii=False)

CW, CH, PAD, LBL = 220, 165, 6, 24
cols = 5
W = PAD + cols * (CW + PAD)
H = PAD + len(rows) * (CH + LBL + PAD)
sheet = Image.new('RGB', (W, H), '#FFFFFF')
d = ImageDraw.Draw(sheet)
f = ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc', 12)
for r, (key, q, got) in enumerate(rows):
    y = PAD + r * (CH + LBL + PAD)
    d.text((PAD, y), key, font=f, fill='#111')
    for c, p in enumerate(got):
        x = PAD + c * (CW + PAD); yy = y + LBL
        im = Image.open(p).convert('RGB'); im.thumbnail((CW, CH))
        sheet.paste(im, (x + (CW - im.width) // 2, yy + (CH - im.height) // 2))
        d.rectangle([x + 2, yy + CH - 15, x + 16, yy + CH - 2], fill='#000000')
        d.text((x + 5, yy + CH - 15), str(c), font=f, fill='#FFFFFF')
out = os.path.join(BASE, 'cand-sheet2.jpg')
sheet.save(out, 'JPEG', quality=86)
print('sheet', sheet.size, out)
