# 白捡 · 校园免费资源集市

把校园里正在被免费送掉的东西（食堂临期、活动剩料、毕业闲置、讲座空位）收拢到一个地方：**3 公里内、有倒计时、有真实库存。**

- 在线体验：见仓库 Pages 地址
- 产品文档：`docs/PRD.md`
- 开发提示词（可复用）：`docs/PROMPT.md`

## 技术

零依赖、零构建的单页应用。

```
index.html   结构 + 桌面双栏外壳
styles.css   视觉系统（奶油白 / 橄榄绿 / 砖红）
app.js       状态、渲染、倒计时、领取、发布、动效
data.js      14 条种子供给
sw.js        PWA 离线壳（网络优先）
```

数据存在 `localStorage`，刷新不丢；全部条目过期后自动补新一批。

## 本地跑

```bash
python -m http.server 5199 --bind 127.0.0.1
# 打开 http://127.0.0.1:5199/
```

（不要双击 `index.html`：service worker 和 manifest 需要 http 环境。）

## 端到端验收

```bash
npm i playwright-core
node scripts/audit.js
```

覆盖：首页渲染、tabbar 几何、分类筛选、详情弹层、领取发码、我的账单、发布置顶、快过期页，并输出 6 张截图到 `scratch/`。

## 接后端时要改的四处

1. `freshItems()` → `GET /api/items?lat=&lng=&radius=3`
2. `claim()` → `POST /api/claims`（服务端发码、扣库存、15 分钟未取释放）
3. `publish()` → `POST /api/items`（带学号认证）
4. `state.claims` → 登录态拉取

前端状态结构不变，替换数据层即可。
