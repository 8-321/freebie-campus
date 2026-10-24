import io
def rd(p): return io.open(p, encoding='utf8').read()
def wr(p, s): io.open(p, 'w', encoding='utf8', newline='').write(s)
log = []
def rp(path, old, new, label=''):
    s = rd(path)
    if old not in s:
        log.append('FAIL  ' + label); return
    wr(path, s.replace(old, new, 1))
    log.append('ok    ' + label)

# ---- app.js 剩余两处 ----
lines = rd('app.js').split('\n')
for i, l in enumerate(lines):
    if 'claim__art tone-' in l and 'c.emoji' in l:
        lines[i] = "        return '<div class=\"claim\"><div class=\"claim__art\">' + svgIcon(c.icon || 'box') + '</div>' +"
        log.append('ok    app.js claim art')
    elif 'claim__art tone-' in l and 'it.emoji' in l:
        lines[i] = "      '<div class=\"sheet__owner\"><div class=\"claim__art\" style=\"width:34px;height:34px\">' + svgIcon(it.icon) + '</div>' +"
        log.append('ok    app.js owner art')
wr('app.js', '\n'.join(lines))

rp('app.js', """'<span class="pin">◉</span>'""", """svgIcon('pin')""", 'topbar pin -> svg')
rp('app.js', """return '<div class="chip ' +""", """return '<div class="chip ' +""", 'noop')

# ---- styles.css ----
s = rd('styles.css')
s = s.replace(":root{\n", ":root{\n  --art:#EFECE1;\n  --art-ink:#48542F;\n", 1)
s = s.replace(""".tone-warm{background:linear-gradient(145deg,#F7E2CC,#EFC9A8)}
.tone-green{background:linear-gradient(145deg,#E4EBD5,#CBD8B4)}
.tone-cool{background:linear-gradient(145deg,#DDE9EC,#BFD5DA)}
.tone-pink{background:linear-gradient(145deg,#F7DEE0,#EDC2C8)}
.tone-sand{background:linear-gradient(145deg,#F1E9D8,#E0D2B6)}""",
"""/* 统一图标底色：只有一种，靠排版和图标区分，不靠颜色 */
.mini__art,.card__art,.sheet__art,.claim__art{background:var(--art);color:var(--art-ink)}""", 1)
s = s.replace(""".mini__art::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.45),transparent 55%)}\n""", "", 1)
s = s.replace(""".card__art::after{content:"";position:absolute;inset:0;background:linear-gradient(140deg,rgba(255,255,255,.5),transparent 60%)}\n""", "", 1)
s = s.replace(""".sheet__art::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.28),transparent 40%,rgba(251,248,240,.9))}\n""", "", 1)
s = s.replace(""".sheet__art .big{position:relative;z-index:1;filter:drop-shadow(0 12px 20px rgba(0,0,0,.14));animation:float 5s ease-in-out infinite}""",
""".sheet__art .big{position:relative;z-index:1;animation:float 6s ease-in-out infinite}""", 1)
s = s.replace("""  flex:0 0 auto;padding:8px 13px;border-radius:999px;font-size:12.5px;font-weight:600;color:var(--ink2);""",
"""  flex:0 0 auto;display:inline-flex;align-items:center;gap:6px;padding:8px 13px;border-radius:999px;font-size:12.5px;font-weight:600;color:var(--ink2);""", 1)
s = s.replace(""".empty b{display:block;font-size:34px;margin-bottom:12px;opacity:.5}""",
""".empty .ic{width:30px;height:30px;margin:0 auto 12px;opacity:.32}""", 1)
# hero 里的红色光晕 -> 奶油光
s = s.replace("""background:radial-gradient(circle,rgba(200,85,47,.55),rgba(200,85,47,0) 70%)""",
"""background:radial-gradient(circle,rgba(244,241,227,.14),rgba(244,241,227,0) 70%)""", 1)
# 图标尺寸系统
s += """

/* ---------- 极简图标系统 ---------- */
.ic{display:block;flex:0 0 auto}
.chip .ic{width:13px;height:13px;opacity:.75}
.chip.on .ic{opacity:.95}
.card__art .ic{width:26px;height:26px}
.mini__art .ic{width:27px;height:27px}
.claim__art .ic{width:17px;height:17px}
.sheet__art .ic{width:58px;height:58px;stroke-width:1.15}
.sheet__art .big{display:grid;place-items:center}
.topbar__loc .ic{width:12px;height:12px;color:var(--clay);margin-right:-1px}
.sheet__meta .ic{width:12px;height:12px;opacity:.45}
.pick button{display:inline-flex;align-items:center;gap:5px}
.pick button .ic{width:13px;height:13px;opacity:.7}
.pick button.on .ic{opacity:.95}
.sheet__x .ic{width:14px;height:14px}
/* 顶部小圆点（替代字符 ●） */
.sec__t .fire{width:5px;height:5px;border-radius:50%;background:var(--clay);display:inline-block;flex:0 0 auto}
/* 左侧勾选用 CSS 画，不依赖字体符号 */
.checks li i{width:15px;height:15px;border-radius:50%;border:1px solid rgba(110,124,82,.45);position:relative;flex:0 0 auto;margin-top:1px;font-style:normal}
.checks li i::after{content:"";position:absolute;left:5px;top:3.4px;width:3.6px;height:6.4px;border:solid var(--olive);border-width:0 1.3px 1.3px 0;transform:rotate(40deg)}
"""
wr('styles.css', s)
log.append('ok    styles.css 图标与配色')

# ---- index.html：✓ -> CSS 勾 ----
h = rd('index.html')
h = h.replace('<li><i>✓</i>', '<li><i></i>')
wr('index.html', h)
log.append('ok    index.html ticks')

for l in log: print(l)
print('FAILS:', sum(1 for l in log if l.startswith('FAIL')))
