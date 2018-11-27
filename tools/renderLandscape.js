import Promise from 'bluebird';
import { getLastCommit } from 'git-last-commit';
const getLastCommitSync = function() {
  return new Promise(function(resolve) {
    getLastCommit(function(err, commit) {
      resolve(commit);
    });
  });
}
const port = process.env.PORT || '4000';
async function main() {
  const commit = await getLastCommitSync();
  const time = new Date().toISOString().slice(0, 19) + 'Z';
  const version = `${time} ${commit.shortHash}`;
  const puppeteer = require('puppeteer');
  const pages = [{
    url: `/landscape?preview&version=${version}`,
    size: {width: 4900, height: 2400, deviceScaleFactor: 1},
    fileName: 'src/images/landscape.png',
    pdfFileName: 'src/images/landscape.pdf'
  }];
  await Promise.mapSeries(pages, async function(pageInfo) {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    page.setViewport(pageInfo.size)
    console.info(`visiting http://localhost:${port}${pageInfo.url}`);
    await page.goto(`http://localhost:${port}${pageInfo.url}`);
    await Promise.delay(10000);
    await page.screenshot({ path: pageInfo.fileName, fullPage: false });
    if (pageInfo.pdfFileName) {
      await page.emulateMedia('screen');
      await page.pdf({path: pageInfo.pdfFileName, ...pageInfo.size, printBackground: true, pageRanges: '1' });
    }
    await browser.close();
  });
}
main().catch(console.info);
