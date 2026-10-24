/* 白捡 · 本地端到端验收：分类筛选 / 详情 / 领取 / 发布上新 / tabbar 几何 */
const { chromium } = require('playwright-core');
const path = require('path');

const EXE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OUT = 'C:/Users/34137/AppData/Local/hermes/cache/scratch';
const URL = process.env.BJ_URL || 'http://127.0.0.1:5199/';

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1100);

  const report = { url: URL, title: await page.title(), steps: [] };

  // 0) 首屏
  await page.screenshot({ path: path.join(OUT, 'bj-home.png') });
  const heroNum = await page.textContent('.hero__h b');
  const cards0 = await page.$$eval('#feedBox .card', (n) => n.length);
  report.steps.push({ step: '首页渲染', hero: heroNum, cards: cards0 });

  // 1) tabbar 几何（每个 tab 是否都在视口内）
  const tabs = await page.$$eval('.tabbar .tab', (els) => els.map((el) => {
    const r = el.getBoundingClientRect();
    return { tab: el.dataset.tab, x: Math.round(r.x), w: Math.round(r.width), visible: r.x >= 0 && r.right <= window.innerWidth };
  }));
  report.steps.push({ step: 'tabbar 几何', tabs });

  // 2) 分类筛选
  await page.click('.chip[data-cat="food"]');
  await page.waitForTimeout(450);
  const cardsFood = await page.$$eval('#feedBox .card', (n) => n.length);
  const chipOn = await page.textContent('.chip.on');
  report.steps.push({ step: '点分类「吃的」', chip: chipOn.replace(/\s+/g, ' ').trim(), cards: cardsFood, changed: cardsFood !== cards0 });
  await page.screenshot({ path: path.join(OUT, 'bj-cat.png') });

  // 3) 打开详情
  await page.click('#feedBox .card');
  await page.waitForTimeout(600);
  const sheetOpen = await page.$eval('#sheetWrap', (el) => el.classList.contains('open'));
  const sheetTitle = await page.textContent('.sheet__h');
  report.steps.push({ step: '点卡片开详情', open: sheetOpen, title: sheetTitle.trim() });
  await page.screenshot({ path: path.join(OUT, 'bj-sheet.png') });

  // 4) 领取
  await page.click('[data-claim]');
  await page.waitForTimeout(900);
  const claimTxt = await page.textContent('#sheetWrap');
  const btnTxt = (await page.textContent('.claimbtn').catch(() => '')) || '';
  const gotCode = /已领取/.test(btnTxt) && /[0-9A-Z]{4}/.test(btnTxt);
  const codeMatch = claimTxt.match(/出示码\\s*([A-Z0-9]{4})/);
  report.steps.push({ step: '领取', code_shown: gotCode, code: codeMatch ? codeMatch[1] : null });
  await page.screenshot({ path: path.join(OUT, 'bj-claim.png') });

  // 关闭详情 → 我的
  await page.click('.sheet__x');
  await page.waitForTimeout(400);
  await page.click('.tab[data-tab="me"]');
  await page.waitForTimeout(600);
  const saved = await page.textContent('.bill__n');
  const claimRows = await page.$$eval('.claim', (n) => n.length);
  report.steps.push({ step: '我的 · 省钱账单', saved: saved.replace(/\s+/g, ''), claimRows });
  await page.screenshot({ path: path.join(OUT, 'bj-me.png') });

  // 5) 发布
  await page.click('.tab[data-tab="publish"]');
  await page.waitForTimeout(500);
  await page.fill('input[name="title"]', '社团招新剩下的帆布袋 15 个');
  await page.fill('input[name="place"]', '学生中心 · 一楼大厅');
  await page.fill('input[name="stock"]', '15');
  await page.fill('textarea[name="desc"]', '招新没用完，印了社团 logo，免费拿走。');
  await page.click('#pubForm button[type="submit"]');
  await page.waitForTimeout(900);
  const firstCard = await page.textContent('#feedBox .card .card__t');
  report.steps.push({ step: '发布后回到首页', first: firstCard.trim(), ok: firstCard.includes('帆布袋') });
  await page.screenshot({ path: path.join(OUT, 'bj-publish.png') });

  // 6) 快过期页
  await page.click('.tab[data-tab="soon"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, 'bj-soon.png') });

  report.errors = errors;
  report.ok = errors.length === 0 && tabs.every((t) => t.visible) && cardsFood !== cards0 && sheetOpen && gotCode && firstCard.includes('帆布袋');
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((e) => { console.error('FAIL', e); process.exit(1); });
