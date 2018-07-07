import colors from 'colors';
const Promise = require('bluebird');
const traverse = require('traverse');
import _ from 'lodash';
import rp from './rpRetry';
import { JSDOM } from 'jsdom';
const debug = require('debug')('github');
import shortRepoName from '../src/utils/shortRepoName';

import { getRepoLatestDate ,getReleaseDate } from './githubDates';

const error = colors.red;
const fatal = (x) => colors.red(colors.inverse(x));
const cacheMiss = colors.green;

export async function extractSavedGithubEntries() {
  const result = [];
  const traverse = require('traverse');
  let source = [];
  try {
    source =  require('js-yaml').safeLoad(require('fs').readFileSync('processed_landscape.yml'));
  } catch(_ex) {
    console.info('Can not extract github entries from the processed_landscape.yml');
  }
  const tree = traverse(source);
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.github_data) {
      result.push({...node.github_data, url: node.repo_url, branch: node.branch || 'master'});
    }
  });
  return result;
}

async function getGithubRepos() {
  const source =  require('js-yaml').safeLoad(require('fs').readFileSync('landscape.yml'));
  const tree = traverse(source);
  const repos = [];
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.item !== null) {
      return;
    }
    if (node.repo_url && node.repo_url.indexOf('https://github.com') === 0) {
      repos.push({
        url: node.repo_url,
        branch: node.branch || 'master'
      });
    } /* else {
      if (!node.repo_url) {
        console.info(`item: ${node.name} has no repo url`)
      } else {
        console.info(`item: ${node.name} has a non github repo url`)
      }
    } */
  });
  return _.uniq(repos);
}


export async function fetchGithubEntries({cache, preferCache}) {
  const repos = await getGithubRepos();
  debug(cache);
  const errors = [];
  const result = await Promise.map(repos, async function(repo) {
    const cachedEntry = _.find(cache, {url: repo.url, branch: repo.branch});
    if (cachedEntry && preferCache) {
      debug(`Cache ${cachedEntry} found for ${repo.url}`);
      require('process').stdout.write(".");
      return cachedEntry;
    }
    debug(`No cache found for ${repo.url} ${repo.branch}`);
    await Promise.delay(1 * 1000);
    try {
      const url = repo.url;
      if (url.split('/').length !==  5 || !url.split('/')[4]) {
        result.push({url, stars: 'N/A', license: 'Unknown License'});
        console.info(url, ' does not look like a GitHub repo');
        return;
      }
      const repoName = shortRepoName(url);
      var response = await rp({
        uri: url,
        followRedirect: true,
        timeout: 30 * 1000,
        simple: true
      });
      const dom = new JSDOM(response);
      const doc = dom.window.document;
      var stars = 'N/A';
      var license = 'Unknown License';
      const starsElement = doc.querySelector('.js-social-count');
      if (starsElement) {
        stars = +starsElement.textContent.replace(/,/g,'');
      }
      const licenseElement = doc.querySelector('.octicon-law');
      if (stars !== 'N/A' && licenseElement) {
        license = licenseElement.nextSibling.textContent.replace(/\n/g, '').trim();
      }
      const descriptionElement = doc.querySelector('.repository-meta-content > [itemprop="about"]');
      var description = '';
      if (descriptionElement) {
        description = descriptionElement.textContent.replace(/\n/g, '').trim();
      }
      const releaseDate = await getReleaseDate({repo: repoName});
      const releaseLink = releaseDate && `${url}/releases`;
      const getContributorsCount = async function() {
        var response = await rp({
          uri: url,
          followRedirect: true,
          timeout: 30 * 1000,
          simple: true
        });
        const dom = new JSDOM(response);
        const doc = dom.window.document;
        var element = doc.querySelector('.numbers-summary .octicon-organization').parentElement.querySelector('span');
        var count = +element.textContent.replace(/\n/g, '').replace(',', '').trim();
        if (!count) {
          const puppeteer = require('puppeteer');
          const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
          const page = await browser.newPage();
          await page.goto(url);
          await Promise.delay(5000);
          const content = await page.evaluate( () => document.querySelector('.numbers-summary .octicon-organization+span').textContent );
          await browser.close();
          count = +content.replace(/\n/g, '').replace(',', '').trim();
          return count;
        }
        return count;
      };
      const contributorsCount = await getContributorsCount();
      const contributorsLink = `${url}/graphs/contributors`;
      // console.info(contributorsCount, contributorsLink);
      var date;
      var latestCommitLink;
      var latestDateResult = await getRepoLatestDate({repo:repoName, branch: repo.branch });
      // console.info(repo, latestDateResult);
      date = latestDateResult.date;
      latestCommitLink = latestDateResult.commitLink;
      require('process').stdout.write(cacheMiss("*"));
      return ({
        url: repo.url,
        stars,
        license,
        description,
        latest_commit_date: date,
        latest_commit_link: latestCommitLink,
        release_date: releaseDate,
        release_link: releaseLink,
        contributors_count: contributorsCount,
        contributors_link: contributorsLink
      });
    } catch (ex) {
      debug(`Fetch failed for ${repo.url}, attempt to use a cached entry`);
      if (cachedEntry) {
        require('process').stdout.write(error("E"));
        errors.push(error(`Using cached entry, and ${repo.url} has issues with stats fetching: ${ex.message.substring(0, 100)}`));
        return cachedEntry;
      } else {
        require('process').stdout.write(fatal("E"));
        errors.push(fatal(`No cached entry, and ${repo.url} has issues with stats fetching: ${ex.message.substring(0, 100)}`));
        return null;
      }
    }
  }, {concurrency: 10});
  require('process').stdout.write("\n");
  _.each(errors, console.info);
  return result;
}
