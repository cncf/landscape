import colors from 'colors';
import rp from 'request-promise';
import Promise from 'bluebird';
import _ from 'lodash';
const cheerio = require('cheerio');
const debug = require('debug')('images');

const error = colors.red;
const fatal = (x) => colors.red(colors.inverse(x));
const cacheMiss = colors.green;


async function getLandscapeItems(crunchbaseEntries) {
  const source = require('js-yaml').safeLoad(require('fs').readFileSync('landscape.yml'));
  const traverse = require('traverse');
  const tree = traverse(source);
  const items = [];
  tree.map(function(node) {
    const getTwitter = function() {
      var crunchbaseEntry = _.find(crunchbaseEntries, {url: node.crunchbase});
      if (_.isUndefined(node.twitter)) {
        return (crunchbaseEntry || {}).twitter;
      }
      return node.twitter;
    };
    if (!node) {
      return;
    }
    if (node.item !== null) {
      return;
    }
    const twitter = getTwitter();
    if (!twitter) {
      return;
    }
    items.push({twitter: twitter, name: node.name});
  });
  return items;
}

export async function extractSavedTwitterEntries() {
  const traverse = require('traverse');
  let source = [];
  try {
    source =  require('js-yaml').safeLoad(require('fs').readFileSync('processed_landscape.yml'));
  } catch(_ex) {
    console.info('Cannot extract image entries from the processed_landscape.yml');
  }

  var items = [];
  const tree = traverse(source);
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.twitter_data) {
      items.push({...node.twitter_data, url: node.twitter});
    }
  });

  return _.uniq(items);
}



export async function fetchTwitterEntries({cache, preferCache, crunchbaseEntries}) {
  const items = (await getLandscapeItems(crunchbaseEntries));
  const errors = [];
  const result = await Promise.map(items, async function(item) {
    const cachedEntry = _.find(cache, {url: item.twitter});
    if (preferCache && cachedEntry) {
      debug(`Found cached entry for ${item.twitter}`);
      require('process').stdout.write(".");
      return cachedEntry;
    }
    console.info(item);
    debug(`Fetching data for ${item.twitter}`);
    try {
      var url = item.twitter;
      const response = await rp({
        uri: url,
        followRedirect: true,
        maxRedirects: 5,
        simple: true,
        timeout: 30 * 1000
      });
      const date = await getLatestTweetDate(response);
      require('process').stdout.write(cacheMiss("*"));
      return {
        latest_tweet_date: date,
        url: url
      };
    } catch(ex) {
      debug(`Cannot fetch twitter at ${url}`);
      if (cachedEntry) {
        require('process').stdout.write(error("E"));
        errors.push(error(`Using cached entry, because ${item.name} has issues with twitter: ${url}, ${ex.message.substring(0, 100)}`));
        return cachedEntry;
      } else {
        require('process').stdout.write(fatal("E"));
        errors.push(fatal(`No cached entry, and ${item.name} has issues with twitter: ${url}, ${ex.message.substring(0, 100)}`));
        return null;
      }
    }
  }, {concurrency: 10});
  require('process').stdout.write("\n");
  _.each(errors, console.info);
  return result;
}
async function getLatestTweetDate(html) {
  const doc = cheerio.load(html);
  const entries = doc('[data-time-ms]');
  const dates = entries.toArray().map( (entry) => (doc(entry).data('time-ms')));
  const latestDate = _.max(dates);
  if (!latestDate) {
    return null;
  }
  return new Date(latestDate);
}
