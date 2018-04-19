import _ from 'lodash';
import colors from 'colors';
import rp from 'request-promise';
import Promise from 'bluebird';
const traverse = require('traverse');

const fatal = (x) => colors.red(colors.inverse(x));

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
  const items = await getLandscapeItems();
  const errors= [];
  await Promise.map(items, async function(item) {
    try {
      const result = await rp({
        followRedirect: false,
        url: item.homepageUrl,
        timeout: 15 * 1000,
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
        errors.push(`${item.name} has an url ${item.homepageUrl} and the response code is ${result.statusCode}`);
        require('process').stdout.write(fatal("F"));
      } else {
        require('process').stdout.write(".");
      }
    } catch (ex) {
        errors.push(`${item.name} has an url ${item.homepageUrl} and the reason is ${ex.message.substring(0, 200)}`);
        require('process').stdout.write(fatal("F"));
    }
  }, {concurrency: 20});
  errors.forEach((x) => console.info(x));
}
main();
