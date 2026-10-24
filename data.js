/* 白捡 · 校园版种子数据
   真实产品里这些来自后端；首版前端用种子 + localStorage 模拟。 */
window.CATS = [
  { id: 'all',  name: '全部',   icon: 'grid' },
  { id: 'food', name: '吃的',   icon: 'bowl' },
  { id: 'stuff',name: '好物',   icon: 'box' },
  { id: 'slot', name: '名额',   icon: 'calendar' },
  { id: 'book', name: '资料',   icon: 'book' },
  { id: 'help', name: '服务',   icon: 'spark' }
];

window.SEED = [
  {
    id: 'f1', photo: 'bread', cat: 'food', icon: 'bread',
    title: '面包房今日剩余碱水包', place: '一食堂 · 西门面包房', dist: 120,
    stock: 6, total: 20, mins: 38, owner: '面包房 · 王姐', badge: '商家认证',
    desc: '每天 20:30 后当天没卖完的碱水包、可颂，免费自取，不隔夜。袋子自带，一人限 2 个。',
    rules: ['到店出示领取码', '一人限领 2 个', '请自带袋子'], watched: 12
  },
  {
    id: 'f2', photo: 'plant', cat: 'stuff', icon: 'plant',
    title: '毕业学姐的绿萝和多肉', place: '3 号宿舍楼 · 一楼大厅', dist: 260,
    stock: 4, total: 4, mins: 180, owner: '林同学 · 大四', badge: '校园认证',
    desc: '毕业搬家带不走，6 盆都好养。连盆一起送，只求别扔。可以顺手拿一包营养液。',
    rules: ['自提，不送宿舍', '先到先得', '请当面确认'], watched: 8
  },
  {
    id: 'f3', photo: 'lecture', cat: 'slot', icon: 'calendar',
    title: 'AI 产品工作坊 · 2 个空位', place: '创新创业学院 · B203', dist: 340,
    stock: 2, total: 30, mins: 26, owner: '创院学生会', badge: '组织认证',
    desc: '19:00 开始，有人临时来不了，空出 2 个名额。现场做可交互原型，带电脑。',
    rules: ['需本校学号', '开始前 10 分钟入场', '名额不可转让'], watched: 21
  },
  {
    id: 'f4', photo: 'cup', cat: 'food', icon: 'cup',
    title: '新店试营业 · 免费奶茶 30 杯', place: '北门 · 茶山令', dist: 480,
    stock: 18, total: 30, mins: 95, owner: '茶山令', badge: '商家认证',
    desc: '今天试营业，招牌茉莉奶绿免费送，需要帮忙写一句真实评价。不甜可以换。',
    rules: ['每人 1 杯', '需现场评价', '售完即止'], watched: 34
  },
  {
    id: 'f5', photo: 'book', cat: 'book', icon: 'book',
    title: '高数/线代教材 一批赠书', place: '图书馆 · 二楼漂流书架', dist: 190,
    stock: 11, total: 25, mins: 1440, owner: '图书馆志愿队', badge: '官方',
    desc: '上学期回收的教材，品相 7-9 成新，考研资料也在。自由取阅，不用登记。',
    rules: ['自由取阅', '一人最多 3 本', '请放回书架'], watched: 6
  },
  {
    id: 'f6', photo: 'scissors', cat: 'help', icon: 'scissors',
    title: '美妆社 · 免费修眉 + 编发', place: '学生活动中心 · 208', dist: 300,
    stock: 5, total: 12, mins: 210, owner: '美妆社', badge: '社团认证',
    desc: '社团开放日，免费修眉、编发、试色。工具一人一消毒，可自带眉笔。',
    rules: ['需预约时段', '一人 15 分钟', '可自带工具'], watched: 15
  },
  {
    id: 'f7', photo: 'box', cat: 'stuff', icon: 'box',
    title: '搬家剩下的纸箱 20 个', place: '5 号宿舍楼 · 楼下快递点', dist: 150,
    stock: 20, total: 20, mins: 240, owner: '周同学', badge: '校园认证',
    desc: '都是拆开的快递纸箱，大的能装被子。要搬家、寄快递的同学直接来拿。',
    rules: ['自取', '请叠好带走', '不限量'], watched: 3
  },
  {
    id: 'f8', photo: 'eye', cat: 'slot', icon: 'eye',
    title: '校医院 · 免费视力筛查 20 名', place: '校医院 · 一楼眼科', dist: 620,
    stock: 9, total: 20, mins: 320, owner: '校医院', badge: '官方',
    desc: '视力、眼压、干眼筛查，价值 80 元，本月免费。长期戴隐形眼镜的同学建议来。',
    rules: ['需带校园卡', '当天挂号', '建议提前 10 分钟'], watched: 7
  },
  {
    id: 'f9', photo: 'cake', cat: 'food', icon: 'cake',
    title: '讲座茶歇剩余 · 蛋糕和咖啡', place: '文科楼 · 报告厅门口', dist: 240,
    stock: 12, total: 40, mins: 14, owner: '会务组', badge: '组织认证',
    desc: '讲座结束剩的茶歇，蛋糕、三明治、瓶装咖啡。别浪费，打包带走。',
    rules: ['自取', '请勿进入会场', '带走垃圾'], watched: 26
  },
  {
    id: 'f10', photo: 'doc', cat: 'help', icon: 'doc',
    title: '免费简历诊断 · 今晚 8 点前', place: '线上 · 腾讯会议', dist: 0,
    stock: 3, total: 10, mins: 65, owner: '就业中心 · 学长团', badge: '官方',
    desc: '秋招简历一对一改，20 分钟一位，今天剩 3 个时段。发 PDF 即可。',
    rules: ['需上传简历', '一人一次', '20 分钟/位'], watched: 19
  },
  {
    id: 'f11', photo: 'notes', cat: 'book', icon: 'layers',
    title: '考研专业课笔记 · 电子版', place: '线上 · 网盘链接', dist: 0,
    stock: 99, total: 99, mins: 2880, owner: '陈学长 · 上岸', badge: '校园认证',
    desc: '专业课 3 本手写笔记扫描件 + 真题分类。免费给学弟学妹，不要转卖。',
    rules: ['仅限本校', '请勿商用', '链接 48 小时有效'], watched: 41
  },
  {
    id: 'f12', photo: 'shirt', cat: 'stuff', icon: 'shirt',
    title: '运动会剩下的文化衫（M/L）', place: '体育部 · 器材室', dist: 400,
    stock: 16, total: 60, mins: 1440, owner: '体育部', badge: '官方',
    desc: '印了校运会 logo 的文化衫，尺码 M/L 居多，免费领。当睡衣、当抹布都行。',
    rules: ['一人 1 件', '尺码随机', '不提供退换'], watched: 5
  },
  {
    id: 'f13', photo: 'lab', cat: 'slot', icon: 'monitor',
    title: '机房闲置时段 · 免费开放', place: '信息楼 · 305 机房', dist: 520,
    stock: 24, total: 40, mins: 150, owner: '信息学院', badge: '官方',
    desc: '今晚 18:00-22:00 机房空置，装了 MATLAB 和 Adobe 全家桶，自由上机。',
    rules: ['刷校园卡进入', '禁止饮食', '离开请关机'], watched: 9
  },
  {
    id: 'f14', photo: 'orange', cat: 'food', icon: 'citrus',
    title: '果园直送 · 试吃装 40 份', place: '南门 · 菜鸟驿站旁', dist: 700,
    stock: 31, total: 40, mins: 70, owner: '果然鲜', badge: '商家认证',
    desc: '产地直发的砂糖橘试吃装，一人一袋，扫码进群还能再拿一份。',
    rules: ['每人 1 袋', '需扫码', '送完为止'], watched: 11
  }
];
