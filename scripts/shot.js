const { chromium } = require('playwright-core');
const OUT = 'C:/Users/34137/AppData/Local/hermes/cache/scratch';
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 940 }, deviceScaleFactor: 2 });
  await p.goto(process.env.BJ_URL || 'https://8-321.github.io/freebie-campus/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1400);
  await p.screenshot({ path: OUT + '/bj-desktop.png' });
  const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await m.goto(process.env.BJ_URL || 'https://8-321.github.io/freebie-campus/', { waitUntil: 'networkidle' });
  await m.waitForTimeout(1400);
  await m.screenshot({ path: OUT + '/bj-mobile.png' });
  console.log(JSON.stringify({
    desktop: await p.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, link: document.querySelector('.intro__foot') ? document.querySelector('.intro__foot').textContent.trim().slice(0, 80) : null })),
    mobile: await m.evaluate(() => ({ w: document.documentElement.scrollWidth, overflowX: document.documentElement.scrollWidth > 390 }))
  }));
  await b.close();
})();
