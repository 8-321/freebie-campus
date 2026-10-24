import os, json
from PIL import Image, ImageEnhance

BASE = 'C:/Users/34137/AppData/Local/hermes/cache/scratch/cand2'
OUT = 'D:/freebie-campus/assets/photos'
os.makedirs(OUT, exist_ok=True)

# 选中的候选（vision 逐行挑出）
PICK = {
    'bread': 'bread_1', 'plant': 'plant_3', 'lecture': 'lecture_2', 'cup': 'cup_4',
    'book': 'book_1', 'scissors': 'scissors_2', 'box': 'box_3', 'eye': 'eye_2',
    'cake': 'cake_1', 'doc': 'doc_7', 'notes': 'notes_5', 'shirt': 'shirt_1',
    'lab': 'lab_2', 'orange': 'orange_7',
}

def crop_ratio(im, rw, rh):
    w, h = im.size
    target = rw / rh
    if w / h > target:
        nw = int(h * target); x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = int(w / target); y = max(0, int((h - nh) * 0.42))
    return im.crop((0, y, w, y + nh))

done = []
for name, f in PICK.items():
    p = os.path.join(BASE, f + '.jpg')
    if not os.path.exists(p):
        print('MISSING', name, p); continue
    im = Image.open(p).convert('RGB')
    # 统一观感：略降饱和、提一点对比，避免照片过艳打破体系
    im = ImageEnhance.Color(im).enhance(0.92)
    im = ImageEnhance.Contrast(im).enhance(1.02)
    t = crop_ratio(im, 4, 3).resize((480, 360), Image.LANCZOS)
    t.save(os.path.join(OUT, name + '-t.jpg'), 'JPEG', quality=82, optimize=True)
    b = crop_ratio(im, 16, 9).resize((1000, 563), Image.LANCZOS)
    b.save(os.path.join(OUT, name + '-b.jpg'), 'JPEG', quality=84, optimize=True)
    done.append(name)

print('photos:', len(done))
total = sum(os.path.getsize(os.path.join(OUT, x)) for x in os.listdir(OUT))
print('total KB:', total // 1024)
