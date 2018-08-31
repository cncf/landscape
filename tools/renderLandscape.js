import Promise from 'bluebird';
const port = process.env.PORT || '4000';
async function main() {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const pages = [{
    url: '/landscape?preview',
    size: {width: 6400, height: 3960, deviceScaleFactor: 0.25},
    fileName: 'src/images/landscape_preview.png'
  }, {
    url: '/serverless?preview',
    size: {width: 3450, height: 2100, deviceScaleFactor: 0.25},
    fileName: 'src/images/serverless_preview.png'
  }, {
    url: '/landscape',
    size: {width: 6400, height: 3960, deviceScaleFactor: 1},
    fileName: 'src/images/landscape.png'
  }, {
    url: '/serverless',
    size: {width: 3450, height: 2100, deviceScaleFactor: 1},
    fileName: 'src/images/serverless.png'
  }];
  await Promise.mapSeries(pages, async function(pageInfo) {
    page.setViewport(pageInfo.size)
    await page.goto(`http://localhost:${port}${pageInfo.url}`);
    await Promise.delay(10000);
    await page.screenshot({ path: pageInfo.fileName, fullPage: false });
  });
  await browser.close();
}
main().catch(console.info);
