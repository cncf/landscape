import _ from 'lodash';
import rp from 'request-promise';
import Promise from 'bluebird';
const traverse = require('traverse');
import retry from './retry';

const rpWithRetry = async function(args) {
  return await retry(() => rp(args), 2, 1000);
}

process.setMaxListeners(0);



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
    items.push({homepageUrl: node.homepage_url, repo: node.repo_url, name: node.name});
  });
  return _.uniq(items);
}

async function checkUrl(url) {
  function getFullLocation(url, redirect) {
    if (redirect.indexOf('http') === 0) {
      return redirect;
    }
    const { URL } = require('url');
    const myURL = new URL(url);
    return `${myURL.protocol}//${myURL.host}${redirect}`;
  }

  async function checkViaPuppeteer() {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.resourceType() !== 'document')
        request.abort();
      else
        request.continue();
    });
    page.setDefaultNavigationTimeout(120 * 1000);
    let result = null;

    try {
      page.on('response', response => {
        const status = response.status()
        if (url === response.request().url() || url + '/' === response.request().url) {
          if ((status >= 300) && (status <= 399)) {
            result = {type: 'redirect', redirect: response.headers()['location']};
          }
          else if (status >= 400) {
            result = {type: 'error', status: status};
          }
        }
      })
      await page.goto(url);
      result = result || 'ok';
      await browser.close();
      return result;
    } catch(ex2) {
      await browser.close();
      return {type: 'error', message: ex2.message.substring(0, 200)};
    }
  }

  async function checkWithRequest() {
    const result = await rpWithRetry({
      followRedirect: false,
      url: url,
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
    if (result.statusCode === 200) {
      return 'ok';
    }
    else if (result.statusCode >= 300 && result.statusCode < 400) {
      return { type: 'redirect', location: getFullLocation(url, result.headers.location)};
    } else {
      return {type: 'error', status: result.statusCode};
    }
  }

  try {
    return await checkWithRequest();
  } catch (ex) {
    return await checkViaPuppeteer();
  }
}

async function main() {
  const items = await getLandscapeItems();
  const errors= [];
  await Promise.map(items, async function(item) {
    const result = await checkUrl(item.homepageUrl);
    if (result !== 'ok') {
      errors.push({'homepageUrl': item.homepageUrl,...result});
    }
  }, {concurrency: 25});
  await Promise.map(items, async function(item) {
    if (item.repo) {
      const result = await checkUrl(item.repo);
      if (result !== 'ok') {
        errors.push({'repo_url': item.repo, ...result});
      }
    }
  }, {concurrency: 25});
  _.uniq(errors).forEach((x) => console.info(x));
  process.exit(errors.length === 0 ? 0 : 1);
}
main();
