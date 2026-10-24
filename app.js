/* 白捡 · 校园版 v1
   纯前端可运行：种子数据 + localStorage 持久化。
   交互链路：浏览 → 筛选 → 详情 → 领取（发码）→ 我的省钱账单 → 发布上新 */
(function () {
  'use strict';


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
    cake: '<path d="M4.4 20.2h15.2"/><path d="M6.2 20.2v-8a2.2 2.2 0 0 1 2.2-2.2h7.2a2.2 2.2 0 0 1 2.2 2.2v8"/><path d="M12 10V6.4"/><path d="M9.4 13.6h5.2"/>',
    calendar: '<rect x="3.4" y="5.4" width="17.2" height="15" rx="2"/><path d="M8 3.5v3.7M16 3.5v3.7M3.4 10.4h17.2"/><path d="M8.4 14.4h2M13.6 14.4h2M8.4 17.4h2"/>',
    doc: '<path d="M6.4 3.4h6.8l4.6 4.6v12a1.6 1.6 0 0 1-1.6 1.6H6.4a1.6 1.6 0 0 1-1.6-1.6V5a1.6 1.6 0 0 1 1.6-1.6z"/><path d="M13.2 3.4v4.6h4.6"/><path d="M8.4 13.4h7M8.4 16.6h4.4"/>',
    layers: '<path d="M12 3.2 3.6 7.4 12 11.6l8.4-4.2z"/><path d="m3.6 12 8.4 4.2 8.4-4.2M3.6 16.4 12 20.6l8.4-4.2"/>',
    shirt: '<path d="M8.6 4.2 12 6.2l3.4-2L20 6.4l-2 3.8-2.2-.8v9.4H8.2V9.4l-2.2.8L4 6.4z"/>',
    monitor: '<rect x="3.2" y="4.4" width="17.6" height="11.6" rx="1.8"/><path d="M9 20.4h6M12 16v4.4"/>',
    citrus: '<circle cx="12" cy="13.4" r="6.8"/><path d="M12 6.6V4.4"/><path d="M12 4.4c1.6-1.2 3.4-1.1 4.8-.4-.5 1.6-1.8 2.4-3.4 2.4"/>',
    pin: '<path d="M12 20.8s6.6-6 6.6-10.6a6.6 6.6 0 1 0-13.2 0C5.4 14.8 12 20.8 12 20.8z"/><circle cx="12" cy="10.2" r="2.5"/>',
    walk: '<circle cx="13.2" cy="4.6" r="1.7"/><path d="M13 8.2 10.6 12l2 2.2-1.4 6M10.6 12 7.4 14.2l-.8 3.6"/>',
    close: '<path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6"/>'
  };
  var CATPHOTO = { food: 'bread', stuff: 'box', slot: 'lecture', book: 'book', help: 'scissors' };
  /* 真实照片：t=卡片 4:3 / b=详情 16:9 */

  function guessPhoto(t, cat) {
    var s = String(t || '');
    if (/袋|布|衣|衫|帽/.test(s)) return 'shirt';
    if (/书|教材|资料|笔记|讲义/.test(s)) return 'book';
    if (/面包|蛋糕|饭|餐|食|水果|橘/.test(s)) return 'bread';
    if (/奶茶|咖啡|饮|水/.test(s)) return 'cup';
    if (/花|绿植|盆栽|植物/.test(s)) return 'plant';
    if (/电脑|显示器|机房/.test(s)) return 'lab';
    if (/简历|打印|文件/.test(s)) return 'doc';
    return (CATPHOTO && CATPHOTO[cat]) || 'box';
  }

  function photo(it, big) {
    var src = 'assets/photos/' + (it.photo || 'box') + (big ? '-b' : '-t') + '.jpg';
    return '<img class="ph" src="' + src + '" alt="" loading="lazy" decoding="async" onerror="this.style.opacity=0">';
  }
  function svgIcon(name, cls) {
    var p = ICONS[name] || ICONS.box;
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var LS = 'baijian.v5';
  var CATMAP = {};
  window.CATS.forEach(function (c) { CATMAP[c.id] = c; });

  var VALUE = { food: 14, stuff: 38, slot: 80, book: 46, help: 68 };
  var CAMPUSES = ['东华大学 · 松江', '东华大学 · 延安路', '全校 · 3 公里内'];

  var state = {
    tab: 'home', cat: 'all', q: '', searchOpen: false,
    items: [], claims: [], savedValue: 0, pro: false,
    pubCat: 'stuff', pubExp: 60, campus: 0, pulled: false
  };

  /* ---------------- 数据 ---------------- */
  function freshItems() {
    var t = Date.now(), out = [];
    window.SEED.forEach(function (s, i) {
      var o = {};
      for (var k in s) { if (Object.prototype.hasOwnProperty.call(s, k)) o[k] = s[k]; }
      o.exp = t + s.mins * 60000;
      o.born = t - (s.total - s.stock) * 45000 - i * 120000;
      out.push(o);
    });
    return out;
  }

  function load() {
    var raw = null;
    try { raw = localStorage.getItem(LS); } catch (e) { raw = null; }
    if (!raw) { state.items = freshItems(); return; }
    try {
      var d = JSON.parse(raw);
      state.items = (d.items && d.items.length) ? d.items : freshItems();
      state.claims = d.claims || [];
      state.savedValue = d.savedValue || 0;
      state.pro = !!d.pro;
      var live = state.items.filter(function (x) { return x.exp > Date.now(); });
      if (!live.length) {
        var newest = Math.max.apply(null, state.items.map(function (x) { return x.exp; }));
        if (Date.now() - newest > 43200000) state.items = freshItems();
      }
    } catch (e2) { state.items = freshItems(); }
  }

  function save() {
    try {
      localStorage.setItem(LS, JSON.stringify({
        items: state.items, claims: state.claims, savedValue: state.savedValue, pro: state.pro
      }));
    } catch (e) { /* 隐私模式忽略 */ }
  }

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function left(it) { return it.exp - Date.now(); }
  function mins(ms) { return Math.round(ms / 60000); }
  function fmt(ms) {
    if (ms <= 0) return '已结束';
    var m = Math.ceil(ms / 60000);
    if (m < 60) return '剩 ' + m + ' 分钟';
    var h = Math.floor(m / 60), r = m % 60;
    if (h < 24) return '剩 ' + h + ' 小时' + (r ? ' ' + r + ' 分' : '');
    return '剩 ' + Math.floor(h / 24) + ' 天';
  }
  function short(ms) {
    if (ms <= 0) return '已结束';
    var m = Math.ceil(ms / 60000);
    if (m < 60) return m + '′';
    return Math.floor(m / 60) + 'h' + (m % 60 ? (m % 60) + '′' : '');
  }
  function pct(it) { return Math.max(0, Math.min(100, Math.round(it.stock / Math.max(1, it.total) * 100))); }
  function liveOnly() { return state.items.filter(function (x) { return left(x) > 0; }); }
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }
  function buzz(ms) { if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} } }
  function catCount(id) {
    return liveOnly().filter(function (x) { return id === 'all' || x.cat === id; }).length;
  }
  function filtered() {
    var q = state.q.trim().toLowerCase();
    return liveOnly().filter(function (x) {
      var okCat = state.cat === 'all' || x.cat === state.cat;
      var okQ = !q || (x.title + x.place + x.desc).toLowerCase().indexOf(q) >= 0;
      return okCat && okQ;
    }).sort(function (a, b) {
      // 我发布的置顶（刚发要看得到），其余按距离 —— 和「离你最近」标题一致
      var am = a.mine ? 1 : 0, bm = b.mine ? 1 : 0;
      if (am !== bm) return bm - am;
      return a.dist - b.dist;
    });
  }
  function myClaim(id) {
    for (var i = 0; i < state.claims.length; i++) if (state.claims[i].id === id) return state.claims[i];
    return null;
  }

  /* ---------------- 顶栏 ---------------- */
  function renderTop() {
    var el = $('#topbar');
    var html = '';
    if (state.tab === 'home') {
      html = '<div><div class="topbar__loc" id="campusBtn">' + svgIcon('pin') +
        esc(CAMPUSES[state.campus]) + '<span class="chev">▾</span></div>' +
        '<div class="topbar__sub">已认证校园 · ' + liveOnly().length + ' 件在等</div></div>' +
        '<div class="topbar__spacer"></div>' +
        '<button class="icon-btn" id="btnSearch" aria-label="搜索"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.6" cy="10.6" r="6.6"/><path d="m15.6 15.6 4.2 4.2"/></svg></button>' +
        '<button class="icon-btn" id="btnBell" aria-label="提醒" style="position:relative"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8.6a6 6 0 1 0-12 0c0 6-2.2 7.4-2.2 7.4h16.4S18 14.6 18 8.6"/><path d="M10.4 20a1.8 1.8 0 0 0 3.2 0"/></svg><span class="dot"></span></button>';
    } else {
      var titles = { soon: '正在消失', publish: '发一条免费', me: '我的白捡' };
      var subs = { soon: '按剩余时间排序 · 越快越靠前', publish: '校园认证用户可直接发布', me: '' };
      html = '<div><div class="topbar__title">' + titles[state.tab] + '</div>' +
        (subs[state.tab] ? '<div class="topbar__sub">' + subs[state.tab] + '</div>' : '') + '</div>';
      if (state.tab === 'me') html += '<div class="topbar__spacer"></div><div class="topbar__sub" style="margin:0">' + (state.pro ? 'PRO 会员' : '普通用户') + '</div>';
    }
    el.className = 'topbar' + (state.tab === 'home' ? '' : ' topbar--plain');
    el.innerHTML = html;
    $$('#tabbar .tab').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === state.tab); });
  }

  /* ---------------- 首页 ---------------- */
  function chipsHTML() {
    return '<div class="cats">' + window.CATS.map(function (c) {
      return '<button class="chip ' + (state.cat === c.id ? 'on' : '') + '" data-cat="' + c.id + '">' +
        '<span>' + c.name + '</span>' +
        '<span style="opacity:.5;font-size:10.5px">' + catCount(c.id) + '</span></button>';
    }).join('') + '</div>';
  }

  function miniHTML(it) {
    var p = pct(it);
    return '<button class="mini" data-open="' + it.id + '">' +
      '<div class="mini__art">' + photo(it) + '</div>' +
      '<div class="mini__t">' + esc(it.title) + '</div>' +
      '<div class="mini__f"><span>剩 ' + it.stock + ' 份</span><span class="mini__cd" data-exp="' + it.exp + '">' + short(left(it)) + '</span></div>' +
      '<div class="bar"><i class="' + (p < 26 ? 'hot' : '') + '" style="width:' + p + '%"></i></div>' +
      '</button>';
  }

  function cardHTML(it, withNew) {
    var ms = left(it), dead = ms <= 0, c = myClaim(it.id);
    var tags = '';
    if (dead) tags += '<span class="tag sold">已结束</span>';
    else if (c) tags += '<span class="tag">已领取</span>';
    else if (it.stock <= 0) tags += '<span class="tag sold">已领完</span>';
    else tags += '<span class="tag">剩 ' + it.stock + ' 份</span>';
    if (!dead && ms < 30 * 60000) tags += '<span class="tag hot">快过期</span>';
    if (it.badge === '官方' || it.badge === '商家认证') tags += '<span class="tag" style="background:#EFECE2;color:#6B675C">' + it.badge + '</span>';
    return '<button class="card ' + (dead || it.stock <= 0 ? 'gone' : '') + (withNew ? ' card--new' : '') + '" data-open="' + it.id + '">' +
      '<div class="card__art">' + photo(it) + '</div>' +
      '<div class="card__body">' +
      '<div class="card__t">' + esc(it.title) + '</div>' +
      '<div class="card__m">' + esc(it.place) + (it.dist > 0 ? '<span class="sep"></span>' + it.dist + ' m' : '') + '</div>' +
      '<div class="card__f">' + tags + '<span class="card__go" data-exp="' + it.exp + '">' + short(ms) + ' →</span></div>' +
      '</div></button>';
  }

  function feedHTML() {
    var list = filtered();
    if (!list.length) {
      return '<div class="empty">' + svgIcon('box') + '这里现在空着<br>换个分类，或者你自己发一条</div>' +
        '<div style="padding:0 16px"><button class="submit" data-tab="publish">我去发一条</button></div>';
    }
    return list.map(function (it) { return cardHTML(it); }).join('');
  }

  function viewHome() {
    var live = liveOnly();
    var stockSum = live.reduce(function (n, x) { return n + x.stock; }, 0);
    var urgent = live.filter(function (x) { return left(x) < 45 * 60000; }).sort(function (a, b) { return a.exp - b.exp; });
    var soonCount = live.filter(function (x) { return left(x) < 30 * 60000; }).length;
    var saved = state.savedValue;

    var h = '';
    if (state.searchOpen) {
      h += '<div class="searchbar"><input id="q" placeholder="搜：面包 / 教材 / 名额" value="' + esc(state.q) + '" autocomplete="off"><button data-tab="home" id="qClose">取消</button></div>';
    }
    h += '<div class="hero">' +
      '<div class="hero__k">' + esc(CAMPUSES[state.campus]) + '</div>' +
      '<div class="hero__h"><b data-count="' + stockSum + '">' + stockSum + '</b>份免费<br>今天还没被领走</div>' +
      '<div class="hero__p"><span class="pulse"></span>' + soonCount + ' 份在 30 分钟内过期</div>' +
      '<div class="hero__row"><div class="hero__save">本月已省 <b>¥' + saved + '</b></div>' +
      '<div class="hero__go" data-tab="soon">看快过期的 →</div></div></div>';

    h += chipsHTML();

    if (!state.q && state.cat === 'all' && urgent.length) {
      h += '<div class="sec"><div class="sec__t"><span class="fire">●</span>手慢无</div>' +
        '<div class="sec__m">45 分钟内 · <b>' + urgent.length + '</b> 件</div></div>' +
        '<div class="hscroll">' + urgent.slice(0, 6).map(miniHTML).join('') + '</div>';
    }

    h += '<div class="sec"><div class="sec__t">' + (state.q ? '搜「' + esc(state.q) + '」' : '离你最近') + '</div>' +
      '<div class="sec__m">' + filtered().length + ' 件 · 按距离</div></div>';
    h += '<div class="feed" id="feedBox">' + feedHTML() + '</div>';
    return h;
  }

  /* ---------------- 快过期 ---------------- */
  function viewSoon() {
    var list = liveOnly().sort(function (a, b) { return a.exp - b.exp; });
    var h = '<div class="sec" style="padding-top:6px"><div class="sec__t">现在去还能拿到</div>' +
      '<div class="sec__m">平均 <b>' + Math.max(1, Math.round(list.reduce(function (n, x) { return n + mins(left(x)); }, 0) / Math.max(1, list.length))) + '</b> 分钟内消失</div></div>';
    if (!list.length) return h + '<div class="empty">' + svgIcon('calendar') + '今天都领完了<br>明天 9:00 会有一批新的</div>';
    h += '<div class="feed">' + list.map(function (it) { return cardHTML(it); }).join('') + '</div>';
    h += '<div class="formnote" style="margin-top:16px">倒计时是真实的：到点自动从列表消失</div>';
    return h;
  }

  /* ---------------- 发布 ---------------- */
  function viewPublish() {
    var cats = window.CATS.filter(function (c) { return c.id !== 'all'; });
    var exps = [{ v: 15, t: '15 分钟' }, { v: 30, t: '30 分钟' }, { v: 60, t: '1 小时' }, { v: 180, t: '3 小时' }, { v: 1440, t: '今天内' }];
    return '<form class="form" id="pubForm">' +
      '<div class="field"><label>这是什么</label><input name="title" maxlength="26" placeholder="例：社团活动剩的帆布袋 20 个" required></div>' +
      '<div class="field"><label>类型</label><div class="pick" id="catPick">' +
      cats.map(function (c) { return '<button type="button" data-pubcat="' + c.id + '" class="' + (state.pubCat === c.id ? 'on' : '') + '">' + c.name + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="field"><label>在哪拿</label><input name="place" maxlength="30" placeholder="例：二食堂门口 / 3 号宿舍楼下"></div>' +
      '<div class="field"><label>有多少份</label><input name="stock" type="number" min="1" max="99" value="5" inputmode="numeric"></div>' +
      '<div class="field"><label>多久内有效</label><div class="pick" id="expPick">' +
      exps.map(function (e) { return '<button type="button" data-pubexp="' + e.v + '" class="' + (state.pubExp === e.v ? 'on' : '') + '">' + e.t + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="field"><label>说清楚一点</label><textarea name="desc" maxlength="120" placeholder="为什么免费、怎么拿、有没有限制。写清楚能少一半纠纷。"></textarea></div>' +
      '<button class="submit" type="submit">发布 · 让同学来捡</button>' +
      '<div class="formnote">发布后会立刻出现在首页最上面。真实产品里这一步要过校园认证。</div>' +
      '</form>';
  }

  /* ---------------- 我的 ---------------- */
  function viewMe() {
    var n = state.claims.length;
    var kg = (n * 0.7).toFixed(1);
    var h = '<div class="me">' +
      '<div class="bill"><div class="bill__k">Saved this semester</div>' +
      '<div class="bill__n"><small>¥</small><span data-count="' + state.savedValue + '">' + state.savedValue + '</span></div>' +
      '<div class="bill__row"><div><span>领取次数</span><b>' + n + '</b></div>' +
      '<div><span>少扔东西</span><b>' + kg + ' kg</b></div>' +
      '<div><span>等级</span><b>' + (n >= 5 ? '老手' : n >= 1 ? '上道了' : '新人') + '</b></div></div></div>';

    h += '<div class="me__sec"><div class="me__h"><span>我领到的</span><span>' + n + ' 条</span></div>';
    if (!n) {
      h += '<div class="empty" style="padding:26px 20px">' + svgIcon('box') + '还没领过东西<br>首页那些都是真的，去拿一个</div>';
    } else {
      h += state.claims.slice(0, 8).map(function (c) {
        return '<div class="claim"><div class="claim__art">' + photo(c) + '</div>' +
          '<div><div class="claim__t">' + esc(c.title) + '</div>' +
          '<div class="claim__m">' + new Date(c.at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' · 省 ¥' + c.value + '</div></div>' +
          '<div class="code">' + esc(c.code) + '</div></div>';
      }).join('');
    }
    h += '</div>';

    h += '<div class="me__sec"><div class="me__h"><span>Pro</span><span>' + (state.pro ? '已开通' : '未开通') + '</span></div>' +
      '<div class="pro"><div class="pro__t">' + (state.pro ? '你是 Pro 了' : '别在最后一分钟才知道') + '</div>' +
      '<div class="pro__d">' + (state.pro ? '同类发布 10 秒内提醒你，并且永远比别人早 5 分钟看到。' : '开抢提醒、提前 5 分钟、每月省钱报告。学生价 ¥6/月，首月免费。') + '</div>' +
      '<button class="pro__b ' + (state.pro ? 'on' : '') + '" id="proBtn">' + (state.pro ? '已开通 · 管理' : '了解 Pro →') + '</button></div></div>';

    h += '<div class="me__sec"><div class="me__h"><span>设置</span></div>' +
      '<div class="list-line"><span>开抢提醒</span><div class="switch on" data-switch></div></div>' +
      '<div class="list-line"><span>校园认证</span><span class="r">东华大学 · 已认证</span></div>' +
      '<div class="list-line"><span>数据存在哪</span><span class="r">本机 localStorage</span></div>' +
      '<div class="list-line" id="resetBtn"><span>清空本机数据</span><span class="r">重置演示</span></div>' +
      '</div></div>';
    return h;
  }

  /* ---------------- 详情 ---------------- */
  function openItem(id) {
    var it = null;
    for (var i = 0; i < state.items.length; i++) if (state.items[i].id === id) it = state.items[i];
    if (!it) return;
    var c = myClaim(id), ms = left(it), dead = ms <= 0;
    var disabled = dead || it.stock <= 0 || !!c;
    var label = c ? '已领取 · ' + c.code : dead ? '已结束' : it.stock <= 0 ? '已领完' : '立即领取';

    var h = '<div class="sheet__grab"></div>' +
      '<div class="sheet__art">' + photo(it, true) +
      '<button class="sheet__x" data-close aria-label="关闭">' + svgIcon('close') + '</button></div>' +
      '<div class="sheet__body">' +
      '<div class="sheet__badges"><span class="tag">' + (CATMAP[it.cat] ? CATMAP[it.cat].name : '好物') + '</span>' +
      (it.badge ? '<span class="tag" style="background:#EFECE2;color:#6B675C">' + it.badge + '</span>' : '') +
      (dead ? '<span class="tag hot">已结束</span>' : ms < 30 * 60000 ? '<span class="tag hot">快过期</span>' : '') + '</div>' +
      '<h2 class="sheet__h">' + esc(it.title) + '</h2>' +
      '<div class="sheet__meta">' +
      '<span>' + svgIcon('pin') + esc(it.place) + '</span>' +
      '<span>' + svgIcon('walk') + (it.dist > 0 ? it.dist + ' 米 · 走路 ' + Math.max(1, Math.round(it.dist / 80)) + ' 分钟' : '线上领取') + '</span>' +
      '<span>' + svgIcon('box') + '剩 ' + it.stock + ' / ' + it.total + ' 份</span>' +
      '</div>' +
      '<div class="cdbar"><div class="cdbar__top"><span>' + (dead ? '已经结束' : '还能捡的时间') + '</span>' +
      '<b data-exp="' + it.exp + '">' + fmt(ms) + '</b></div>' +
      '<div class="bar"><i style="width:' + (dead ? 0 : Math.max(3, Math.min(100, ms / (it.mins * 60000) * 100))) + '%"></i></div></div>' +
      '<p class="sheet__p">' + esc(it.desc || '发布者没有写更多说明，到了问一声就行。') + '</p>' +
      '<div class="sheet__sub">领取规则</div>' +
      (it.rules || []).map(function (r) { return '<div class="rule"><i></i><span>' + esc(r) + '</span></div>'; }).join('') +
      '<div class="sheet__owner"><div class="claim__art claim__ini" style="width:34px;height:34px">' + esc(it.owner.slice(0, 1)) + '</div>' +
      '<div><div class="claim__t">' + esc(it.owner) + '</div><div class="claim__m">' + esc(it.badge || '校园用户') + ' · 历史发布 12 次 · 好评 98%</div></div></div>' +
      '</div>' +
      '<div class="sheet__foot"><div class="watchers"><b>' + (it.watched + (c ? 1 : 0)) + '</b> 人正在看这件<br>领到后请按时去拿</div>' +
      '<button class="claimbtn ' + (c ? 'done' : '') + '" data-claim="' + it.id + '" ' + (disabled ? 'disabled' : '') + '>' + label + '</button></div>';

    $('#sheet').innerHTML = h;
    $('#sheetWrap').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSheet() {
    $('#sheetWrap').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------------- 领取 ---------------- */
  function claim(id) {
    var it = null;
    for (var i = 0; i < state.items.length; i++) if (state.items[i].id === id) it = state.items[i];
    if (!it) return;
    if (left(it) <= 0) return toast('这件已经过期了');
    if (myClaim(id)) return toast('你已经领过了，出示领取码就行');
    if (it.stock <= 0) return toast('慢了一步，已经被领完');

    it.stock--;
    var code = Math.random().toString(32).slice(2, 6).toUpperCase();
    var value = VALUE[it.cat] || 20;
    state.claims.unshift({
      id: id, code: code, at: Date.now(), value: value,
      title: it.title, icon: it.icon, photo: it.photo
    });
    state.savedValue += value;
    save();
    boom();
    buzz(30);
    openItem(id);
    toast('领取成功 · 出示码 ' + code);
    render(true);
  }

  /* ---------------- 发布 ---------------- */
  function publish(form) {
    var fd = new FormData(form);
    var title = String(fd.get('title') || '').trim();
    if (!title) { toast('先写清楚这是什么'); return; }
    var stock = Math.max(1, Math.min(99, parseInt(fd.get('stock'), 10) || 1));
    var minsOpen = state.pubExp;
    var cat = state.pubCat;
    var it = {
      id: 'u' + Date.now().toString(36),
      cat: cat, icon: CATMAP[cat] ? CATMAP[cat].icon : 'box', photo: guessPhoto(title, cat),
      title: title,
      place: String(fd.get('place') || '').trim() || '校园内 · 私信问位置',
      dist: 60 + Math.floor(Math.random() * 380),
      stock: stock, total: stock, mins: minsOpen,
      owner: '我 · 刚发布', badge: '校园认证',
      desc: String(fd.get('desc') || '').trim() || '免费送，自己来拿。',
      rules: ['到点自取', '先到先得', '领到后请说一声'],
      watched: 0,
      exp: Date.now() + minsOpen * 60000,
      born: Date.now(), mine: true
    };
    state.items.unshift(it);
    state.pubExp = 60;
    save();
    state.tab = 'home'; state.cat = 'all'; state.q = ''; state.searchOpen = false;
    render();
    var first = $('#feedBox .card');
    if (first) first.classList.add('card--new');
    toast('已发布 · 3 公里内的同学现在能看到');
    buzz(20);
  }

  /* ---------------- 刷新（下拉 / 按钮） ---------------- */
  function pullRefresh() {
    var live = liveOnly();
    if (!state.pulled) {
      state.pulled = true;
      state.items.unshift({
        id: 'n1', cat: 'food', icon: 'bread', photo: 'bread',
        title: '刚出炉 · 咖啡社练习拉花免费送', place: '学生中心 · 一楼咖啡角', dist: 90,
        stock: 8, total: 8, mins: 25, owner: '咖啡社', badge: '社团认证',
        desc: '今天社团练习，做多了。拿铁、美式都有，自带杯子优先。',
        rules: ['自带杯优先', '一人 1 杯', '不额外加糖'], watched: 2,
        exp: Date.now() + 25 * 60000, born: Date.now()
      });
      save();
      render();
      toast('上新 1 件 · 就在你楼下');
      buzz(15);
    } else {
      var it = state.items[Math.floor(Math.random() * state.items.length)];
      if (it && it.stock > 0) { it.stock--; save(); render(true); }
      toast('已是最新 · 刚有人领走 1 份');
    }
  }

  /* ---------------- 商品动效 ---------------- */
  function boom() {
    var c = $('#fx');
    if (!c) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = window.innerWidth * dpr; c.height = window.innerHeight * dpr;
    c.style.width = window.innerWidth + 'px'; c.style.height = window.innerHeight + 'px';
    var ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var colors = ['#6E7C52', '#C8552F', '#B98A3C', '#DCE3C9', '#1C1B18', '#E9B44C'];
    var parts = [], n = 54, cx = window.innerWidth / 2, cy = window.innerHeight * 0.6;
    for (var i = 0; i < n; i++) {
      parts.push({
        x: cx, y: cy,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 12 - 3,
        s: 2 + Math.random() * 5,
        a: 1, r: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.34,
        c: colors[i % colors.length]
      });
    }
    var last = performance.now();
    function frame(t) {
      var dt = Math.min(34, t - last); last = t;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      var alive = 0;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.vy += 0.42 * dt / 16;
        p.x += p.vx * dt / 16;
        p.y += p.vy * dt / 16;
        p.r += p.vr;
        p.a -= 0.0075 * dt / 16;
        if (p.a > 0) {
          alive++;
          ctx.globalAlpha = Math.max(0, p.a);
          ctx.fillStyle = p.c;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 1.7);
          ctx.restore();
        }
      }
      if (alive) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    requestAnimationFrame(frame);
  }

  function countUp() {
    $$('[data-count]').forEach(function (el) {
      var to = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (to <= 0) { el.textContent = '0'; return; }
      var t0 = Date.now(), dur = 620;
      function step() {
        var p = (Date.now() - t0) / dur;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        var v = Math.round(to * (1 - Math.pow(1 - p, 3)));
        el.textContent = v;
        if (p < 1) requestAnimationFrame(step); else el.textContent = to;
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------------- 渲染 ---------------- */
  function render(keepScroll) {
    var v = $('#view');
    var top = keepScroll ? v.scrollTop : 0;
    renderTop();
    var map = { home: viewHome, soon: viewSoon, publish: viewPublish, me: viewMe };
    v.innerHTML = (map[state.tab] || viewHome)();
    v.scrollTop = top;
    // 进入动画：卡片 stagger
    $$('#view .card, #view .mini, #view .claim').forEach(function (el, i) {
      el.style.animation = 'rise .42s cubic-bezier(.2,.7,.2,1) both';
      el.style.animationDelay = Math.min(300, i * 34) + 'ms';
    });
    $$('#view .hero, #view .bill, #view .pro').forEach(function (el) {
      el.style.animation = 'rise .5s cubic-bezier(.2,.7,.2,1) both';
    });
    countUp();
    if (state.tab === 'home' && state.searchOpen) {
      var q = $('#q');
      if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
    }
  }

  /* ---------------- 倒计时 ---------------- */
  function tick() {
    var now = Date.now();
    $$('[data-exp]').forEach(function (el) {
      var exp = +el.getAttribute('data-exp');
      var ms = exp - now;
      el.textContent = el.classList.contains('mini__cd') || el.classList.contains('card__go') ? short(ms) : fmt(ms);
      if (ms <= 0) el.style.opacity = '.5';
    });
    if (now - tick._last > 15000) {
      tick._last = now;
      var anyDead = state.items.some(function (x) { return x.exp > 0 && x.exp <= now && !x._seen; });
      if (anyDead) {
        state.items.forEach(function (x) { if (x.exp <= now) x._seen = true; });
        if (!$('#sheetWrap').classList.contains('open')) render(true);
      }
    }
  }
  tick._last = 0;

  /* ---------------- 交互绑定 ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-tab]') : null;
    if (t) {
      var tb = t.getAttribute('data-tab');
      state.tab = tb;
      if (tb === 'home') { state.searchOpen = false; state.q = ''; }
      render();
      return;
    }
    var c = e.target.closest ? e.target.closest('[data-cat]') : null;
    if (c) {
      state.cat = c.getAttribute('data-cat');
      if (state.tab !== 'home') state.tab = 'home';
      render();
      return;
    }
    var o = e.target.closest ? e.target.closest('[data-open]') : null;
    if (o) { openItem(o.getAttribute('data-open')); return; }

    var cl = e.target.closest ? e.target.closest('[data-close]') : null;
    if (cl) { closeSheet(); return; }

    var clp = e.target.closest ? e.target.closest('[data-close-pro]') : null;
    if (clp) { $('#proWrap').classList.remove('open'); return; }

    var clm = e.target.closest ? e.target.closest('[data-claim]') : null;
    if (clm) { claim(clm.getAttribute('data-claim')); return; }

    var pc = e.target.closest ? e.target.closest('[data-pubcat]') : null;
    if (pc) {
      state.pubCat = pc.getAttribute('data-pubcat');
      $$('#catPick button').forEach(function (b) { b.classList.toggle('on', b === pc); });
      return;
    }
    var pe = e.target.closest ? e.target.closest('[data-pubexp]') : null;
    if (pe) {
      state.pubExp = parseInt(pe.getAttribute('data-pubexp'), 10);
      $$('#expPick button').forEach(function (b) { b.classList.toggle('on', b === pe); });
      return;
    }
    var sw = e.target.closest ? e.target.closest('[data-switch]') : null;
    if (sw) { sw.classList.toggle('on'); return; }

    if (e.target.id === 'btnSearch') {
      state.searchOpen = true; render(); return;
    }
    if (e.target.closest && e.target.closest('#qClose')) {
      state.searchOpen = false; state.q = ''; render(); return;
    }
    if (e.target.id === 'btnBell') {
      toast('3 条提醒 · 你关注的碱水包还剩 ' + (function () {
        var it = state.items.filter(function (x) { return x.cat === 'food' && left(x) > 0; })[0];
        return it ? mins(left(it)) : 0;
      })() + ' 分钟');
      return;
    }
    if (e.target.closest && e.target.closest('#campusBtn')) {
      state.campus = (state.campus + 1) % CAMPUSES.length;
      render(true);
      toast('已切到 ' + CAMPUSES[state.campus]);
      return;
    }
    if (e.target.id === 'proBtn' || e.target.id === 'proWrap') {
      $('#proWrap').classList.add('open');
      return;
    }
    if (e.target.id === 'proBuy') {
      state.pro = true; save();
      $('#proWrap').classList.remove('open');
      toast('Pro 已开通 · 首月 ¥0，下月自动续费 ¥6');
      render(true);
      return;
    }
    if (e.target.closest && e.target.closest('#resetBtn')) {
      try { localStorage.removeItem(LS); } catch (err) {}
      state.items = freshItems(); state.claims = []; state.savedValue = 0; state.pro = false; state.pulled = false;
      state.cat = 'all'; state.q = ''; state.tab = 'home';
      render();
      toast('演示数据已重置');
      return;
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'q') {
      state.q = e.target.value;
      var box = $('#feedBox');
      if (box) box.innerHTML = feedHTML();
    }
  });

  document.addEventListener('submit', function (e) {
    if (e.target.id === 'pubForm') { e.preventDefault(); publish(e.target); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSheet(); $('#proWrap').classList.remove('open'); }
  });

  /* 下拉刷新（触屏） */
  (function pullGesture() {
    var sc = $('#view'), startY = 0, active = false;
    sc.addEventListener('touchstart', function (e) {
      if (sc.scrollTop <= 0) { startY = e.touches[0].clientY; active = true; }
    }, { passive: true });
    sc.addEventListener('touchmove', function (e) {
      if (!active) return;
      var d = e.touches[0].clientY - startY;
      var ind = $('#refresh');
      if (d > 24) { ind.style.opacity = '1'; ind.textContent = d > 76 ? '松开刷新' : '↓ 下拉刷新'; }
      else { ind.style.opacity = '0'; }
    }, { passive: true });
    sc.addEventListener('touchend', function (e) {
      if (!active) return;
      active = false;
      var d = (e.changedTouches[0] ? e.changedTouches[0].clientY : 0) - startY;
      var ind = $('#refresh');
      ind.style.opacity = '1'; ind.textContent = '↑ 正在刷新';
      setTimeout(function () { ind.style.opacity = '0'; }, 500);
      if (d > 76) pullRefresh();
    }, { passive: true });
  })();

  /* ---------------- 启动 ---------------- */
  load();
  // 首屏骨架屏：真实产品不会瞬间全出来
  (function boot() {
    var v = $('#view');
    v.innerHTML = '<div class="skel__hero" style="height:148px"></div><div class="skel"><div class="skel__row"></div><div class="skel__row"></div><div class="skel__row"></div><div class="skel__row"></div></div>';
    renderTop();
    setTimeout(function () { render(); }, 420);
  })();

  setInterval(tick, 1000);

  // 把左侧演示区的实时数字接上
  document.addEventListener('DOMContentLoaded', function () {});
  setTimeout(function () {
    var s1 = $('#s1');
    if (s1) s1.textContent = liveOnly().reduce(function (n, x) { return n + x.stock; }, 0);
    var link = $('#repoLink');
    if (link && location.hostname.indexOf('github.io') > -1) {
      link.href = 'https://github.com/8-321/freebie-campus';
    }
  }, 600);

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
