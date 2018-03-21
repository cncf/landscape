import process from 'process';
const source = require('js-yaml').safeLoad(require('fs').readFileSync('landscape.yml'));
const traverse = require('traverse');
const _ = require('lodash');
import {dump} from './yaml';
// import formatCity from '../src/utils/formatCity';
import { fetchImageEntries, extractSavedImageEntries, removeNonReferencedImages } from './fetchImages';
import { fetchCrunchbaseEntries, extractSavedCrunchbaseEntries } from './crunchbase';
import { fetchGithubEntries, extractSavedGithubEntries } from './fetchGithubStats';
import { fetchStartDateEntries, extractSavedStartDateEntries } from './fetchGithubStartDate';

var useCrunchbaseCache = true;
var useImagesCache=true;
var useGithubCache=false;
var useGithubStartDatesCache=true;
var key = require('process').env.LEVEL || 'easy';
function reportOptions() {
  console.info(`Running with a level=${key}. Settings:
     Use cached crunchbase data: ${useCrunchbaseCache}
     Use cached images data: ${useImagesCache}
     Use cached github basic stats: ${useGithubCache}
     Use cached github start dates: ${useGithubStartDatesCache}
    `);
}
if (key.toLowerCase() === 'easy') {
  reportOptions();
}
else if (key.toLowerCase() === 'medium') {
  useGithubCache=false;
  useCrunchbaseCache=false;
  reportOptions();
}
else if (key.toLowerCase() === 'hard') {
  useCrunchbaseCache = false;
  useGithubCache=false;
  useGithubStartDatesCache=false;
  reportOptions();
}
else if (key.toLowerCase() === 'complete') {
  useCrunchbaseCache = false;
  useImagesCache=false;
  useGithubCache=false;
  useGithubStartDatesCache=false;
  try {
    require('fs').unlinkSync('processed_landscape.yml');
  } catch (_ex) { //eslint-disable no-empty

  }
  reportOptions();
} else {
  console.info('Unknown level. Should be one of easy, medium, hard or complete');
}

async function main() {

  var crunchbaseEntries;
  var savedCrunchbaseEntries = await extractSavedCrunchbaseEntries();
  if (process.env.CRUNCHBASE_KEY) {
    console.info('Fetching crunchbase entries');
    crunchbaseEntries = await fetchCrunchbaseEntries({
      cache: savedCrunchbaseEntries,
      preferCache: useCrunchbaseCache});
  } else {
    console.info('CRUNCHBASE_KEY is not set. Using processed_landscape.yml as a source for crunchbase info');
    crunchbaseEntries = savedCrunchbaseEntries;
  }

  console.info('Fetching github entries');
  const savedGithubEntries = await extractSavedGithubEntries();
  const githubEntries = await fetchGithubEntries({
    cache: savedGithubEntries,
    preferCache: useGithubCache
  });

  console.info('Fetching start date entries');
  const savedStartDateEntries = await extractSavedStartDateEntries();
  const startDateEntries = await fetchStartDateEntries({
    cache: savedStartDateEntries,
    preferCache: useGithubStartDatesCache
  });

  console.info('Fetching images');
  const savedImageEntries = await extractSavedImageEntries();
  const imageEntries = await fetchImageEntries({
    cache: savedImageEntries,
    preferCache: useImagesCache
  });
  removeNonReferencedImages(imageEntries);

  console.info('Fetching yaml members');
  const cncfMembers = require('js-yaml').safeLoad(require('fs').readFileSync('src/cncf_members.yml'));

  const tree = traverse(source);
  console.info('Processing the tree');
  const newSource = tree.map(function(node) {
    if (node && node.item === null) {
      //crunchbase
      var crunchbaseInfo = _.clone(_.find(crunchbaseEntries, {url: node.crunchbase}));
      if (crunchbaseInfo) {
        delete crunchbaseInfo.url;
      }
      node.crunchbase_data = crunchbaseInfo;
      //github
      var githubEntry = _.clone(_.find(githubEntries, {url: node.repo_url}));
      if (githubEntry) {
        node.github_data = githubEntry;
        delete node.github_data.url;
        delete node.github_data.branch;
      }
      //github start dates
      var dateEntry = _.clone(_.find(startDateEntries, {url: node.repo_url}));
      if (dateEntry) {
        node.github_start_commit_data = dateEntry;
        delete node.github_start_commit_data.url;
        delete node.github_start_commit_data.branch;
      }
      //cncf membership
      node.cncf_membership_data = {
        cncf_member: cncfMembers.indexOf(node.crunchbase) !== -1
      }
      //yahoo finance. we will just extract it
      if (node.crunchbase_data && node.crunchbase_data.effective_ticker) {
        node.yahoo_finance_data = {
          market_cap: node.crunchbase_data.market_cap,
          effective_ticker: node.crunchbase_data.effective_ticker
        }
        delete node.crunchbase_data.market_cap,
        delete node.crunchbase_data.effective_ticker
      }
      // images
      const imageEntry = _.clone(_.find(imageEntries, {
        logo: node.logo
      }));
      if (imageEntry) {
        node.image_data = imageEntry;
        delete node.image_data.logo;
      }

      // TODO: move this to yarn2yaml
      // choose twitter
      // choose organization
      // var description = node.description || (githubEntry || {}).description || (crunchbaseInfo || {})['Description'] || '';
      // description = description.replace(/\n/g, ' ');
    }
  });

  const newContent = "# THIS FILE IS GENERATED AUTOMATICALLY!\n" + dump(newSource);
  require('fs').writeFileSync('processed_landscape.yml', newContent);
}
main().catch(console.info);
