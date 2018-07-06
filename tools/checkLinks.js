import _ from 'lodash';
import colors from 'colors';
import rp from './rpRetry';
import Promise from 'bluebird';
const traverse = require('traverse');

const fatal = (x) => colors.red(colors.inverse(x));

async function getLandscapeItems() {
  const source = require('js-yaml').safeLoad(require('fs').readFileSync('landscape.yml'));
  const tree = traverse(source);
  const items = [];
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.item !== null) {
      return;
    }
    items.push({homepageUrl: node.homepage_url, name: node.name});
  });
  return _.uniq(items);
}

async function main() {
  function getFullLocation(url, redirect) {
    if (redirect.indexOf('http') === 0) {
      return redirect;
    }
    const { URL } = require('url');
    const myURL = new URL(url);
    return `${myURL.protocol}//${myURL.host}${redirect}`;
  }
  const items = await getLandscapeItems();
  const errors= [];
  await Promise.map(items, async function(item) {
    try {
      const result = await rp({
        followRedirect: false,
        url: item.homepageUrl,
        timeout: 45 * 1000,
        simple: false,
        resolveWithFullResponse: true,
        headers: { // make them think we are a real browser from us
          accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9,es',
          'cache-control': 'no-cache',
          dnt: '1',
          pragma: 'no-cache',
          'upgrade-insecure-requests': 1,
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      });
      if (result.statusCode !== 200) {
        let extra = '';
        if (result.statusCode >= 300 && result.statusCode < 400) {
          extra = `to ${getFullLocation(item.homepageUrl, result.headers.location)}`;
        }
        errors.push(`${item.name} has an url ${item.homepageUrl} and the response code is ${result.statusCode} ${extra}`);
        require('process').stdout.write(fatal("F"));
      } else {
        require('process').stdout.write(".");
      }
    } catch (ex) {
      if (ex.message.indexOf('unable to verify the first certificate') !== -1) {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const itemCopy = item;
        page.on('response', async(response) => {
          if (itemCopy.processed) {
            return;
          }
          itemCopy.processed = true;
          if (response._status >= 200 && response._status < 300) {
            require('process').stdout.write(".");
          }
          else {
            errors.push(`${itemCopy.name} has an url ${itemCopy.homepageUrl} and the response code is ${response._status}`);
            require('process').stdout.write(fatal("F"));
          }
        });
        await page.goto(itemCopy.homepageUrl, { waitUntil: 'networkidle2' });
        await browser.close();
        return;
      }
      errors.push(`${item.name} has an url ${item.homepageUrl} and the reason is ${ex.message.substring(0, 200)}`);
      require('process').stdout.write(fatal("F"));
    }
  }, {concurrency: 20});
  _.uniq(errors).forEach((x) => console.info(x));
}
main();
