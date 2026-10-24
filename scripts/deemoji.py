import io, re, sys

def rd(p): return io.open(p, encoding='utf8').read()
def wr(p, s): io.open(p, 'w', encoding='utf8', newline='').write(s)
log = []
def rp(path, old, new, count=1):
    s = rd(path)
    if old not in s:
        log.append('FAIL  ' + path + ' :: ' + old[:60].replace('\n', ' '))
        return False
    s = s.replace(old, new, count)
    wr(path, s)
    log.append('ok    ' + path + ' :: ' + old[:48].replace('\n', ' '))
    return True

# ---------- data.js：emoji -> 线性图标 id，去掉彩色 tone ----------
MAP = [
    ("emoji: '🥨', tone: 'warm',", "icon: 'bread',"),
    ("emoji: '🪴', tone: 'green',", "icon: 'plant',"),
    ("emoji: '🎟️', tone: 'cool',", "icon: 'ticket',"),
    ("emoji: '🧋', tone: 'pink',", "icon: 'cup',"),
    ("emoji: '📘', tone: 'sand',", "icon: 'book',"),
    ("emoji: '✂️', tone: 'cool',", "icon: 'scissors',"),
    ("emoji: '📦', tone: 'warm',", "icon: 'box',"),
    ("emoji: '🩺', tone: 'green',", "icon: 'eye',"),
    ("emoji: '🍰', tone: 'pink',", "icon: 'cake',"),
    ("emoji: '📄', tone: 'sand',", "icon: 'doc',"),
    ("emoji: '🗂️', tone: 'cool',", "icon: 'layers',"),
    ("emoji: '🎽', tone: 'warm',", "icon: 'shirt',"),
    ("emoji: '💻', tone: 'green',", "icon: 'monitor',"),
    ("emoji: '🍊', tone: 'warm',", "icon: 'citrus',"),
    ("{ id: 'all',  name: '全部',   emoji: '✦' },", "{ id: 'all',  name: '全部',   icon: 'grid' },"),
    ("{ id: 'food', name: '吃的',   emoji: '🍱' },", "{ id: 'food', name: '吃的',   icon: 'bowl' },"),
    ("{ id: 'stuff',name: '好物',   emoji: '🎁' },", "{ id: 'stuff',name: '好物',   icon: 'box' },"),
    ("{ id: 'slot', name: '名额',   emoji: '🎟️' },", "{ id: 'slot', name: '名额',   icon: 'ticket' },"),
    ("{ id: 'book', name: '资料',   emoji: '📚' },", "{ id: 'book', name: '资料',   icon: 'book' },"),
    ("{ id: 'help', name: '服务',   emoji: '🛠️' }", "{ id: 'help', name: '服务',   icon: 'spark' }"),
]
for a, b in MAP:
    rp('data.js', a, b)

# ---------- app.js：图标系统 ----------
s = rd('app.js')
icons = """
  /* 极简线性图标集：统一 24 网格、1.55 描边、圆头圆角，全部 currentColor */
  var ICONS = {
    grid: '<rect x="3.6" y="3.6" width="7" height="7" rx="1.7"/><rect x="13.4" y="3.6" width="7" height="7" rx="1.7"/><rect x="3.6" y="13.4" width="7" height="7" rx="1.7"/><rect x="13.4" y="13.4" width="7" height="7" rx="1.7"/>',
    bowl: '<path d="M2.8 11.2h18.4"/><path d="M4.7 11.2c0 4 3.3 7.3 7.3 7.3s7.3-3.3 7.3-7.3"/><path d="M9.5 7.6c0-1.4 1.2-1.9 1.2-3.2"/><path d="M13.4 7.6c0-1.4 1.2-1.9 1.2-3.2"/>',
    box: '<path d="M3.4 7.6 12 3l8.6 4.6v8.8L12 21l-8.6-4.6z"/><path d="M3.4 7.6 12 12.2l8.6-4.6M12 12.2V21"/>',
    ticket: '<path d="M2.8 9.4V6.6a1.2 1.2 0 0 1 1.2-1.2h16a1.2 1.2 0 0 1 1.2 1.2v2.8a2.6 2.6 0 0 0 0 5.2v2.8a1.2 1.2 0 0 1-1.2 1.2H4a1.2 1.2 0 0 1-1.2-1.2v-2.8a2.6 2.6 0 0 0 0-5.2z"/><path d="M14.6 6.2v2.2M14.6 11.1v2.2M14.6 15.7v2.1"/>',
    book: '<path d="M11.2 6.3v13.5"/><path d="M11.2 6.3C9.8 5.1 7.6 4.5 4.4 4.5v13.3c3.2 0 5.4.6 6.8 1.8"/><path d="M11.2 6.3c1.4-1.2 3.6-1.8 6.8-1.8v13.3c-3.2 0-5.4.6-6.8 1.8"/>',
    spark: '<path d="M12 3.3l2.1 6.2 6.2 2.1-6.2 2.1-2.1 6.2-2.1-6.2-6.2-2.1 6.2-2.1z"/>',
    bread: '<path d="M4.4 10.3c0-3.4 3.4-6 7.6-6s7.6 2.6 7.6 6v6.1a2.2 2.2 0 0 1-2.2 2.2H6.6a2.2 2.2 0 0 1-2.2-2.2z"/><path d="M8.9 8.3 7.5 12.4M12 7.7v4.7M15.1 8.3l1.4 4.1"/>',
    plant: '<path d="M8 20.9h8l1-4.7H7z"/><path d="M12 16.2V8.5"/><path d="M12 12.5c-3.2 0-5-2.2-5-5 3.1 0 5 1.8 5 5z"/><path d="M12 10.7c0-3.2 2-5.4 5-5.4 0 3.2-1.9 5.4-5 5.4z"/>',
    cup: '<path d="M6.2 8.2h11.6l-1 11.1a1.6 1.6 0 0 1-1.6 1.5H8.8a1.6 1.6 0 0 1-1.6-1.5z"/><path d="M5 8.2h14"/><path d="M9.4 3.4 14.6 8.2"/>',
    scissors: '<circle cx="7" cy="17.6" r="2.4"/><circle cx="17" cy="17.6" r="2.4"/><path d="M8.7 15.9 18 3.7M15.3 15.9 6 3.7"/>',
    eye: '<path d="M2.6 12S6.1 6.4 12 6.4 21.4 12 21.4 12 17.9 17.6 12 17.6 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.9"/>',
    cake: '<path d="M3.6 20.4h16.8"/><path d="M5.4 20.4v-6a2 2 0 0 1 2-2h9.2a2 2 0 0 1 2 2v6"/><path d="M9.2 12.4V9.6M12 12.4V8.6M14.8 12.4V9.6"/>',
    doc: '<path d="M6.4 3.4h6.8l4.6 4.6v12a1.6 1.6 0 0 1-1.6 1.6H6.4a1.6 1.6 0 0 1-1.6-1.6V5a1.6 1.6 0 0 1 1.6-1.6z"/><path d="M13.2 3.4v4.6h4.6"/><path d="M8.4 13.4h7M8.4 16.6h4.4"/>',
    layers: '<path d="M12 3.2 3.6 7.4 12 11.6l8.4-4.2z"/><path d="m3.6 12 8.4 4.2 8.4-4.2M3.6 16.4 12 20.6l8.4-4.2"/>',
    shirt: '<path d="M8.6 4.2 12 6.2l3.4-2L20 6.4l-2 3.8-2.2-.8v9.4H8.2V9.4l-2.2.8L4 6.4z"/>',
    monitor: '<rect x="3.2" y="4.4" width="17.6" height="11.6" rx="1.8"/><path d="M9 20.4h6M12 16v4.4"/>',
    citrus: '<circle cx="12" cy="13.4" r="6.8"/><path d="M12 6.6V4.4"/><path d="M12 4.4c1.6-1.2 3.4-1.1 4.8-.4-.5 1.6-1.8 2.4-3.4 2.4"/>',
    pin: '<path d="M12 20.8s6.6-6 6.6-10.6a6.6 6.6 0 1 0-13.2 0C5.4 14.8 12 20.8 12 20.8z"/><circle cx="12" cy="10.2" r="2.5"/>',
    walk: '<circle cx="13.2" cy="4.6" r="1.7"/><path d="M13 8.2 10.6 12l2 2.2-1.4 6M10.6 12 7.4 14.2l-.8 3.6"/>',
    close: '<path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6"/>'
  };
  function svgIcon(name, cls) {
    var p = ICONS[name] || ICONS.box;
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }
"""
s = s.replace("  var $ = function (s, r)", icons + "\n  var $ = function (s, r)", 1)
s = s.replace("var LS = 'baijian.v1'", "var LS = 'baijian.v5'", 1)
s = s.replace("  var TONE = { food: 'warm', stuff: 'green', slot: 'cool', book: 'sand', help: 'pink' };\n", "", 1)

# 分类 chips
s = s.replace("""        '<span>' + c.emoji + '</span>' + c.name +""",
              """        svgIcon(c.icon) + '<span>' + c.name + '</span>' +""", 1)
# mini / card art
s = s.replace("""'<div class="mini__art tone-' + it.tone + '">' + it.emoji + '</div>' +""",
              """'<div class="mini__art">' + svgIcon(it.icon) + '</div>' +""", 1)
s = s.replace("""'<div class="card__art tone-' + it.tone + '">' + it.emoji + '</div>' +""",
              """'<div class="card__art">' + svgIcon(it.icon) + '</div>' +""", 1)
# 发布分类选择
s = s.replace("""'\">' + c.emoji + ' ' + c.name + '</button>'""",
              """'\">' + svgIcon(c.icon) + c.name + '</button>'""", 1)
# 我的领取记录
s = s.replace("""'<div class="claim__art tone-' + (c.tone || 'sand') + '">' + (c.emoji || '🎁') + '</div>' +""",
              """'<div class="claim__art">' + svgIcon(c.icon || 'box') + '</div>' +""", 1)
# 详情大图
s = s.replace("""'<div class="sheet__art tone-' + it.tone + '"><span class="big">' + it.emoji + '</span>' +""",
              """'<div class="sheet__art"><span class="big">' + svgIcon(it.icon) + '</span>' +""", 1)
# 详情发布者头像
s = s.replace("""'<div class="claim__art tone-' + it.tone + '" style="width:34px;height:34px;font-size:16px">' + it.emoji + '</div>' +""",
              """'<div class="claim__art" style="width:34px;height:34px">' + svgIcon(it.icon) + '</div>' +""", 1)
# 详情 meta 图标
s = s.replace("""'<span>📍 ' + esc(it.place) + '</span>' +""", """'<span>' + svgIcon('pin') + esc(it.place) + '</span>' +""", 1)
s = s.replace("""'<span>🚶 ' + (it.dist > 0""", """'<span>' + svgIcon('walk') + (it.dist > 0""", 1)
s = s.replace("""'<span>📦 剩 ' + it.stock""", """'<span>' + svgIcon('box') + '剩 ' + it.stock""", 1)
# 领取记录字段
s = s.replace("title: it.title, emoji: it.emoji, tone: it.tone", "title: it.title, icon: it.icon", 1)
# 发布新建条目
s = s.replace("cat: cat, emoji: CATMAP[cat] ? CATMAP[cat].emoji : '🎁', tone: TONE[cat] || 'sand',",
              "cat: cat, icon: CATMAP[cat] ? CATMAP[cat].icon : 'box',", 1)
# 下拉刷新示范条目
s = s.replace("id: 'n1', cat: 'food', emoji: '🥐', tone: 'warm',", "id: 'n1', cat: 'food', icon: 'bread',", 1)
# 空态
s = s.replace("""'<div class="empty"><b>🧺</b>这个分类现在空着<br>换个分类，或者你自己发一条</div>' +""",
              """'<div class="empty">' + svgIcon('box') + '这个分类现在空着<br>换个分类，或者你自己发一条</div>' +""", 1)
s = s.replace("""'<div class="empty" style="padding:26px 20px"><b>🧺</b>还没领过东西<br>首页那些都是真的，去拿一个</div>'""",
              """'<div class="empty" style="padding:26px 20px">' + svgIcon('box') + '还没领过东西<br>首页那些都是真的，去拿一个</div>'""", 1)
# 详情关闭按钮
s = s.replace("""'<button class="sheet__x" data-close aria-label="关闭">✕</button>'""",
              """'<button class="sheet__x" data-close aria-label="关闭">' + svgIcon('close') + '</button>'""", 1)
# hero 里的字符圆点
s = s.replace("""'<div class="sec__t"><span class="fire">●</span>手慢无</div>'""",
              """'<div class="sec__t"><span class="fire"></span>手慢无</div>'""", 1)
wr('app.js', s)
log.append('ok    app.js 图标与替换')

for l in log: print(l)
print('FAILS:', sum(1 for l in log if l.startswith('FAIL')))
