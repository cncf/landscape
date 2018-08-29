import Promise from 'bluebird';
async function main() {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  page.setViewport({ width: 3450, height: 2100 })
  await page.goto('http://localhost:4000/serverless');
  await Promise.delay(10000);
  await page.screenshot({ path: 'src/images/serverless.png', fullPage: false });
  await browser.close();
}
main().catch(console.info);
