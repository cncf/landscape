import process from 'process';
const source = require('js-yaml').safeLoad(require('fs').readFileSync('landscape.yml'));
const traverse = require('traverse');
const _ = require('lodash');

const tree = traverse(source);
console.info('Processing the tree');
const errors = [];
const allowedKeys = [
  'name',
  'homepage_url',
  'logo',
  'twitter',
  'crunchbase',
  'repo_url',
  'stock_ticker',
  'description',
  'branch',
  'lfdl_project',
  'url_for_bestpractices'
];
tree.map(function(node) {
  if (node && node.item === null) {
    const keys = _.without(_.keys(node), 'item');

    const wrongKeys = keys.filter( function(key) {
      return allowedKeys.indexOf(key) === -1
    });
    wrongKeys.forEach(function(key) {
      errors.push(`entry ${node.name} has an unkown key: ${key}`);
    });
  }
});
errors.forEach(function(error) {
  console.info('FATAL: ', error);
});
if (errors.length > 0) {
  console.info('Valid keys are', JSON.stringify(allowedKeys));
  process.exit(1);
}
