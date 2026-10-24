const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' });
  await p.click('.tab--pub'); await p.waitForTimeout(400);
  await p.screenshot({ path: 'C:/Users/34137/AppData/Local/hermes/cache/scratch/bj-form.png', fullPage: false });
  await p.fill('#titleInput, input[name=title], .field input', '社团招新剩下的帆布袋 15 个').catch(()=>{});
  const imgs = await p.$$eval('.pick, .form .ph', els => els.length);
  await p.click('.submit, .form button[type=submit]').catch(()=>{});
  await p.waitForTimeout(600);
  const first = await p.$eval('.card .ph', el => el.getAttribute('src')).catch(() => 'none');
  console.log(JSON.stringify({ errs, first, pickCount: imgs }));
  await b.close();
})();
