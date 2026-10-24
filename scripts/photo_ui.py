import io, re
def rd(p): return io.open(p, encoding='utf8').read()
def wr(p, s): io.open(p, 'w', encoding='utf8', newline='').write(s)

# ---------------- data.js：每条加 photo ----------------
d = rd('data.js')
PH = {'f1': 'bread', 'f2': 'plant', 'f3': 'lecture', 'f4': 'cup', 'f5': 'book', 'f6': 'scissors',
      'f7': 'box', 'f8': 'eye', 'f9': 'cake', 'f10': 'doc', 'f11': 'notes', 'f12': 'shirt',
      'f13': 'lab', 'f14': 'orange'}
for k, v in PH.items():
    d = d.replace("id: '%s'," % k, "id: '%s', photo: '%s'," % (k, v), 1)
wr('data.js', d)

# ---------------- app.js ----------------
a = rd('app.js')
a = a.replace("""  function svgIcon(name, cls) {""",
"""  var CATPHOTO = { food: 'bread', stuff: 'box', slot: 'lecture', book: 'book', help: 'scissors' };
  /* 真实照片：t=卡片 4:3 / b=详情 16:9 */
  function photo(it, big) {
    var src = 'assets/photos/' + (it.photo || 'box') + (big ? '-b' : '-t') + '.jpg';
    return '<img class="ph" src="' + src + '" alt="" loading="lazy" decoding="async" onerror="this.style.opacity=0">';
  }
  function svgIcon(name, cls) {""", 1)

# 分类 chips 去图标
a = a.replace("""        svgIcon(c.icon) + '<span>' + c.name + '</span>' +""",
              """        '<span>' + c.name + '</span>' +""", 1)
# mini / card
a = a.replace("""'<div class="mini__art">' + svgIcon(it.icon) + '</div>' +""",
              """'<div class="mini__art">' + photo(it) + '</div>' +""", 1)
a = a.replace("""'<div class="card__art">' + svgIcon(it.icon) + '</div>' +""",
              """'<div class="card__art">' + photo(it) + '</div>' +""", 1)
# 发布分类选择：纯文字
a = a.replace("""'\">' + svgIcon(c.icon) + c.name + '</button>'""",
              """'\">' + c.name + '</button>'""", 1)
# 我的领取
a = a.replace("""'<div class="claim__art">' + svgIcon(c.icon || 'box') + '</div>' +""",
              """'<div class="claim__art">' + photo(c) + '</div>' +""", 1)
# 详情大图
a = a.replace("""'<div class="sheet__art"><span class="big">' + svgIcon(it.icon) + '</span>' +""",
              """'<div class="sheet__art">' + photo(it, true) +""", 1)
# 详情发布者头像
a = a.replace("""'<div class="claim__art" style="width:34px;height:34px">' + svgIcon(it.icon) + '</div>' +""",
              """'<div class="claim__art" style="width:36px;height:36px">' + photo(it) + '</div>' +""", 1)
# 领取记录 & 发布新建 带上 photo 字段
a = a.replace("title: it.title, icon: it.icon", "title: it.title, icon: it.icon, photo: it.photo", 1)
a = a.replace("cat: cat, icon: CATMAP[cat] ? CATMAP[cat].icon : 'box',",
              "cat: cat, icon: CATMAP[cat] ? CATMAP[cat].icon : 'box', photo: CATPHOTO[cat] || 'box',", 1)
a = a.replace("id: 'n1', cat: 'food', icon: 'bread',", "id: 'n1', cat: 'food', icon: 'bread', photo: 'bread',", 1)
wr('app.js', a)

# ---------------- styles.css：去圆角 / 去阴影 / 去渐变 ----------------
c = rd('styles.css')
# 圆角归零（保留 50% 的小圆点）
c = re.sub(r'border-radius:\s*(?!50%)[0-9.]+px', 'border-radius:0', c)
c = re.sub(r'border-radius:\s*999px', 'border-radius:0', c)
# 阴影全删（极简不用投影，靠 1px 线）
c = re.sub(r'box-shadow:[^;}]+;?', '', c)
# 渐变改纯色
c = c.replace("background:linear-gradient(150deg,#4A5533 0%,#38422A 60%,#2F3823 100%);color:#F4F1E3;",
              "background:#2F3823;color:#F4F1E3;")
c = c.replace("background:linear-gradient(150deg,#5B6840,#39432A);color:#F7F3E6;",
              "background:#39432A;color:#F7F3E6;")
c = c.replace("background:linear-gradient(140deg,#4A5533,#2F3823);", "background:#3A4429;")
c = c.replace("border-radius:22px;padding:18px;background:linear-gradient(140deg,#FBF3E2,#F6EAD3);",
              "padding:18px;background:#F7F1E4;")
# hero 装饰圆环/光晕删掉
c = re.sub(r'\.hero::before\{[^}]*\}\n', '', c)
c = re.sub(r'\.hero::after\{[^}]*\}\n', '', c)
# 卡片内边距与图片布局由追加块接管；先去掉旧的渐变高光残留
wr('styles.css', c)

# 追加硬边极简覆盖层
c = rd('styles.css')
c += """

/* ================= v2 · 硬边极简 + 真实照片 ================= */
:root{--line:rgba(28,27,24,.15);--line2:rgba(28,27,24,.09)}
.topbar{background:var(--paper);border-bottom:1px solid var(--line2)}
.hero{padding:22px 20px 18px}
.hero__k{letter-spacing:.2em;font-size:9px;opacity:.72}
.hero__h{font-size:33px;line-height:1.14;letter-spacing:-.03em}
.hero__h b{font-size:46px;letter-spacing:-.045em}
.hero__row{border-top:1px solid rgba(244,241,227,.16);padding-top:11px;margin-top:16px}
.hero__save,.hero__go{font-size:10.5px;letter-spacing:.02em}

/* 分类：纯文字方块，无图标、无胶囊 */
.chip{padding:7px 11px;border:1px solid var(--line);background:transparent;font-size:11.5px;letter-spacing:.02em;font-weight:600}
.chip.on{background:var(--ink);color:#F7F3E6;border-color:var(--ink)}
.chip span[style]{font-size:10px!important}

/* 列表卡：左图右文，通栏裁切 */
.card{grid-template-columns:96px 1fr;gap:0;padding:0;border:1px solid var(--line2);overflow:hidden}
.card__art{width:96px;height:100%;min-height:98px;padding:0;overflow:hidden}
.card__art .ph,.mini__art .ph,.claim__art .ph,.sheet__art .ph{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.94) contrast(1.02)}
.card__body{padding:11px 13px;display:flex;flex-direction:column;justify-content:center;gap:3px;min-width:0}
.card__t{font-size:13.5px;line-height:1.32;letter-spacing:-.01em}
.card__m{font-size:10.5px;margin:0}
.card__f{margin:0}
.tag{font-size:9.5px;letter-spacing:.03em;padding:3px 6px}
.card__go{font-size:10px;letter-spacing:.02em}

/* 手慢无：上图下文 */
.mini{flex:0 0 170px;padding:0;border:1px solid var(--line2);overflow:hidden}
.mini__art{height:106px;margin:0;padding:0;overflow:hidden}
.mini__t{padding:9px 10px 0;margin:0;font-size:12px;line-height:1.35}
.mini__f{padding:5px 10px 0;font-size:10px}
.mini .bar{margin:8px 10px 10px;height:2px}
.mini .bar i{background:var(--olive)}

/* 详情：顶部 16:9 大图 */
.sheet{border-radius:0}
.sheet__art{height:198px;display:block;padding:0;overflow:hidden}
.sheet__x{width:30px;height:30px;padding:0;background:rgba(251,248,240,.94);border:1px solid var(--line);backdrop-filter:none}
.sheet__body{padding:18px 20px 18px;margin:0}
.cdbar{background:#FBF2EC;border:1px solid rgba(200,85,47,.16);padding:11px 13px}
.sheet__h{font-size:20px;letter-spacing:-.02em}

/* 我的 */
.claim{padding:10px 0;border-bottom:1px solid var(--line2)}
.claim__art{width:44px;height:44px;overflow:hidden}
.bill{padding:20px}

/* 底部：方形凸起按钮 */
.pubbtn{width:52px;height:52px;margin-top:-22px;background:#39432A}
.tab{padding:7px 2px}

/* 照片统一质感、骨架屏保持 */
.sheet__art .ph{filter:saturate(.96)}
.empty .ic{opacity:.28}
"""
wr('styles.css', c)
print('patched all')
