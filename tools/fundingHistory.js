import _ from 'lodash';
function getFileFromHistory() {
  const content = require('child_process').execSync('git show origin/master@{2018-11-21}:processed_landscape.yml').toString('utf-8');
  const source = require('js-yaml').safeLoad(content);
  return source;
}

function getFileFromHead() {
  const content = require('child_process').execSync('git show HEAD:processed_landscape.yml').toString('utf-8');
  const source = require('js-yaml').safeLoad(content);
  return source;
}

const getItems = function(yaml) {
  return _.flattenDeep( yaml.landscape.map( (category) => category.subcategories.map( (sc) => sc.items)));
}

const prev = getItems(getFileFromHistory());
const current = getItems(getFileFromHead());

function buildDiff(currentItems, prevItems) {
  const result = [];
  _.each(currentItems, function(item) {
    if (!item.crunchbase_data) {
      return;
    }
    if (!item.crunchbase_data.funding) {
      return;
    }
    const previousEntry = _.find(prevItems, (prevItem) => prevItem.crunchbase_data && prevItem.crunchbase_data.name === item.crunchbase_data.name);
    if (previousEntry && item.crunchbase_data.funding !== previousEntry.crunchbase_data.funding) {
      result.push({
        name: item.crunchbase_data.name,
        currentAmount: item.crunchbase_data.funding,
        previousAmount: previousEntry.crunchbase_data.funding,
        date: 'test',
        link: 'todo',
        url: item.crunchbase
      });
    } else if (!previousEntry) {
      result.push({
        name: item.crunchbase_data.name,
        currentAmount: item.crunchbase_data.funding,
        previousAmount: '',
        date: 'today',
        link: 'todo',
        url: item.crunchbase
      });
    }
  });
  return result;
}

const diff = buildDiff(current, prev);
console.info(diff);




