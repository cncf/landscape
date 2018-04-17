import _ from 'lodash';
import colors from 'colors';
import rp from 'request-promise';
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
  const items = await getLandscapeItems();
  const errors= [];
  await Promise.map(items, async function(item) {
    try {
      const result = await rp({
        url: item.homepageUrl,
        simple: false,
        resolveWithFullResponse: true
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
