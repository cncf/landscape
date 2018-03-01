const rp = require('request-promise');
import { JSDOM } from 'jsdom';

async function readGithubStats({repo, branch}) {
  var url = `https://github.com/${repo}/commits/${branch}`;
  var response = await rp({
    uri: url,
    followRedirect: true,
    timeout: 10 * 1000,
    simple: true
  });
  const dom = new JSDOM(response);
  const doc = dom.window.document;
  const commitLinks = doc.querySelectorAll('.commits-list-item a.sha');
  const firstCommitLink = commitLinks[0].href;
  //nextPageLink may not present for small repos!
  const nextPageLink = (Array.from(doc.querySelectorAll('.paginate-container a')).filter(function(x) {
    return x.text === 'Older';
  })[0] || {}).href;
  if (!nextPageLink) {
    return {
      firstCommitLink,
      lastCommitLink: commitLinks[commitLinks.length - 1].href
    };
  }
  const [base, offset] = nextPageLink.split('+');
  // console.info(await getPageInfo(doc));
  return {
    base,
    offset,
    firstCommitLink
  }
}
async function getCommitDate(link) {
  var url = `https://github.com${link}`;
  var response = await rp({
    uri: url,
    followRedirect: true,
    timeout: 10 * 1000,
    simple: true
  });
  const dom = new JSDOM(response);
  const doc = dom.window.document;
  // console.info(doc.innerText, doc.text);
  const time = doc.querySelector('[datetime]').getAttribute('datetime');
  // console.info(time);
  return time;
}
async function getPageStats({base, offset}) {
  var response = await rp({
    uri: `${base}+${offset}`,
    followRedirect: true,
    timeout: 10 * 1000,
    simple: true
  });
  const dom = new JSDOM(response);
  const doc = dom.window.document;
  return await getPageInfo(doc);
}

async function getPageInfo(doc) {
  const firstCommitLink = doc.querySelector('.commits-list-item a.sha');
  if (!firstCommitLink) {
    return null;
  }
  const firstHref = firstCommitLink.href;
  const lastCommitLinks = doc.querySelectorAll('.commits-list-item a.sha');
  const lastCommitLink = lastCommitLinks[lastCommitLinks.length - 1];
  const lastHref = lastCommitLink.href;
  const nextPageLink = Array.from(doc.querySelectorAll('.paginate-container a')).filter(function(x) {
    return x.text === 'Older';
  })[0];
  const nextPageHref = nextPageLink ? nextPageLink.href : null;
  return {
    firstHref,
    lastHref,
    nextPageHref
  };
}

async function promiseBinarySearch(low, high, fn) {
  var mid = low + Math.floor((high - low) / 2);
  let scoreMid = await fn(mid);
  if (scoreMid === 0) {
    return await promiseBinarySearch(mid, high, fn);
  }
  if (scoreMid === 2) {
    return await promiseBinarySearch(low, mid, fn);
  }
  return mid;
}


export async function getRepoLatestDate({repo, branch}) {
  branch = branch || 'master';
  const info = await readGithubStats({repo, branch});
  // console.info(info);
  return {
    date: await getCommitDate(info.firstCommitLink), //first row on the page
    commitLink: info.firstCommitLink
  }
}
export async function getRepoStartDate({repo, branch}) {
  branch = branch || 'master';
  const info = await readGithubStats({repo, branch});
  if (info.lastCommitLink) {
    return {
      date: await getCommitDate(info.lastCommitLink),
      commitLink: info.lastCommitLink
    };
  }
  const getScore = async function(i) {
    const result = await getPageStats({base: info.base, offset: i});
    // console.info('result for ', i, ' is ', result);
    if (!result) {
      return 2;
    }
    if (result.nextPageHref) {
      return 0;
    }
    return 1;
  };
  const offset = await promiseBinarySearch(0, 256000, getScore);
  const stats = await getPageStats({base: info.base, offset: offset});
  const firstCommitDate = await getCommitDate(stats.lastHref); //last row on the page
  return { date: firstCommitDate, commitLink: stats.lastHref};
}
// getRepoStartDate({repo: 'rails/rails'}).then(console.info).catch(console.info);
// getRepoLatestDate({repo: 'theforeman/foreman', branch: 'develop'}).then(console.info).catch(console.info);
