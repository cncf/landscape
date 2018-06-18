import colors from 'colors';
import rp from 'request-promise';
import Promise from 'bluebird';
import _ from 'lodash';
const debug = require('debug')('bestPractices');

const error = colors.red;
const cacheMiss = colors.green;

async function getLandscapeItems() {
  const source = require('js-yaml').safeLoad(require('fs').readFileSync('landscape.yml'));
  const traverse = require('traverse');
  const tree = traverse(source);
  const items = [];
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.item !== null) {
      return;
    }
    items.push({repo_url: node.url_for_bestpractices || node.repo_url});
  });
  return items;
}

async function fetchEntries() {
  const maxNumber = 200;
  const items = await Promise.map(_.range(1, maxNumber), async function(number) {
    const result = await rp({
      json: true,
      url: `https://bestpractices.coreinfrastructure.org/en/projects.json?page=${number}`
    });
    return result.map(x => ({
      id: x.id,
      repo_url: x.repo_url,
      percentage: x.badge_percentage_0
    })).filter(x => !!x.repo_url);
  }, {concurrency: 10});
  return _.flatten(items);
}

export async function fetchBestPracticeEntries({cache, preferCache}) {
  const items = await getLandscapeItems();
  const errors = [];
  var fetchedEntries = null;
  const result = await Promise.mapSeries(items, async function(item) {
    const cachedEntry = _.find(cache, {repo_url: item.repo_url});
    if (cachedEntry && preferCache) {
      debug(`Cache found for ${item.repo_url}`);
      require('process').stdout.write(".");
      return cachedEntry;
    }
    debug(`Cache not found for ${item.repo_url}`);
    try {
      fetchedEntries = fetchedEntries || await fetchEntries();
      const badge = _.find(fetchedEntries, {repo_url: item.repo_url});
      require('process').stdout.write(cacheMiss("*"));
      return ({
        repo_url: item.repo_url,
        badge: badge ? badge.id : false,
        percentage: badge ? badge.percentage : null
      });
    } catch (ex) {
      debug(`Fetch failed for ${item.repo_url}, attempt to use a cached entry`);
      require('process').stdout.write(error("E"));
      errors.push(error(`Cannot fetch: ${item.repo_url} `, ex.message.substring(0, 50)));
      return cachedEntry || null;
    }
  });
  _.each(errors, function(error) {
    console.info('error: ', error);
  });
  return result;
}

export async function extractSavedBestPracticeEntries() {
  const traverse = require('traverse');
  let source = [];
  try {
    source =  require('js-yaml').safeLoad(require('fs').readFileSync('processed_landscape.yml'));
  } catch(_ex) {
    console.info('Cannot extract image entries from the processed_landscape.yml');
  }

  var entries = [];
  const tree = traverse(source);
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.best_practice_data) {
      entries.push({...node.best_practice_data, repo_url: node.url_for_bestpractices || node.repo_url});
    }
  });

  return _.uniq(entries);
}
