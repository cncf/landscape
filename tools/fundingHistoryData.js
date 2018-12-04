// Calculates a json file which shows changes in funding of different companies
import _ from 'lodash';
import saneName from '../src/utils/saneName'
const base = `https://landscape.cncf.io`;
function getFileFromHistory(days) {
  const commit = require('child_process').execSync(`git rev-list -n 1 --author='CNCF-bot' --before='{${days} days ago}' master`).toString('utf-8').trim();
  const content = require('child_process').execSync(`git show ${commit}:processed_landscape.yml`).toString('utf-8');
  const source = require('js-yaml').safeLoad(content);
  return source;
}

function getFileFromFs() {
  const content = require('fs').readFileSync('./processed_landscape.yml', 'utf-8');
  const source = require('js-yaml').safeLoad(content);
  return source;
}

const getItems = function(yaml) {
  return _.flattenDeep( yaml.landscape.map( (category) => category.subcategories.map( (sc) => sc.items)));
}


function buildDiff({currentItems, prevItems, date, result}) {
  _.each(currentItems, function(item) {
    if (!item.crunchbase_data) {
      return;
    }
    if (!item.crunchbase_data.funding) {
      return;
    }
    if (_.find(result, {name: item.crunchbase_data.name})) {
      return;
    }
    const previousEntry = _.find(prevItems, (prevItem) => prevItem.crunchbase_data && prevItem.crunchbase_data.name === item.crunchbase_data.name);
    if (previousEntry && item.crunchbase_data.funding !== previousEntry.crunchbase_data.funding) {
      result.push({
        name: item.crunchbase_data.name,
        currentAmount: item.crunchbase_data.funding,
        previousAmount: previousEntry.crunchbase_data.funding,
        date: date,
        membership: item.cncf_membership_data.cncf_member,
        link: `${base}/grouping=organization&organization=${saneName(item.crunchbase_data.name)}`,
        url: item.crunchbase + '#section-funding-rounds'
      });
    }
  });
}

const result = [];
const maxEntries = 20;
_.range(1, 100).forEach(function(i) {
  if (result.length >= maxEntries) {
    return false;
  }
  const prev = getItems(getFileFromHistory(i));
  const current = getItems(getFileFromFs());
  buildDiff({
    currentItems: current,
    prevItems: prev,
    date: new Date( new Date().getTime() - 86400 * 1000 * i).toISOString().substring(0, 10),
    result: result
  });
});


require('fs').writeFileSync('dist/funding.json', JSON.stringify(result, null, 4));




