import colors from 'colors';
import Promise from 'bluebird';
import _ from 'lodash';
import actualTwitter from './actualTwitter';
const debug = require('debug')('twitter');

const error = colors.red;
const fatal = (x) => colors.red(colors.inverse(x));
const cacheMiss = colors.green;

import retry from './retry';


async function getLandscapeItems(crunchbaseEntries) {
  const source = require('js-yaml').safeLoad(require('fs').readFileSync('landscape.yml'));
  const traverse = require('traverse');
  const tree = traverse(source);
  const items = [];
  tree.map(function(node) {
    const getTwitter = function() {
      var crunchbaseEntry = _.find(crunchbaseEntries, {url: node.crunchbase});
      return actualTwitter(node, crunchbaseEntry);
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
    console.info('Cannot extract twitter entries from the processed_landscape.yml');
  }

  var items = [];
  const tree = traverse(source);
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.twitter_data) {
      items.push({...node.twitter_data, url: actualTwitter(node, node.crunchbase_data)});
    }
  });

  return _.uniq(items);
}



export async function fetchTwitterEntries({cache, preferCache, crunchbaseEntries}) {
  const items = (await getLandscapeItems(crunchbaseEntries));
  const errors = [];
  const result = await Promise.map(items, async function(item) {
    const cachedEntry = _.find(cache, {url: item.twitter});
    if (preferCache && cachedEntry && cachedEntry.latest_tweet_date) {
      debug(`Found cached entry for ${item.twitter}`);
      require('process').stdout.write(".");
      return cachedEntry;
    }
    debug(`Fetching data for ${item.twitter}`);
    try {
      var url = item.twitter;
      const date = await retry(async function() {
        let browser;
        try {
          const puppeteer = require('puppeteer');
          browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
          const page = await browser.newPage();
          await page.goto(url);
          await Promise.delay(1000);
          const result = await getLatestTweetDate(page);
          await browser.close();
          return result;
        } catch (ex) {
          console.info(ex.message);
          await browser.close();
          throw ex;
        }
      });
      if (date) {
        require('process').stdout.write(cacheMiss("*"));
        return {
          latest_tweet_date: date,
          url: url
        };
      } else {
        require('process').stdout.write(fatal("E"));
        errors.push(fatal(`Empty twitter for ${item.name}: ${url}`));
        return {
          latest_tweet_date: date,
          url: url
        };
      }
    } catch(ex) {
      debug(`Cannot fetch twitter at ${url} ${ex.message}`);
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
  }, {concurrency: 3});
  require('process').stdout.write("\n");
  _.each(errors, (x) => console.info(x));
  return result;
}
async function getLatestTweetDate(page) {
  const dates = await page.evaluate( () => Array.prototype.slice.call(document.querySelectorAll('[data-time-ms')).map( (x) => +x.getAttribute('data-time-ms')));
  const latestDate = _.max(dates);
  if (!latestDate) {
    return null;
  }
  return new Date(latestDate);
}
