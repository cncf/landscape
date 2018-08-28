async function main() {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  page.setViewport({ width: 6120, height: 3960 })
  await page.goto('http://localhost:3000/landscape');
  await page.screenshot({ path: 'src/images/landscape.png', fullPage: false });
  await browser.close();
}
main().catch(console.info);
