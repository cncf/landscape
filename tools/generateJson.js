const source = require('js-yaml').safeLoad(require('fs').readFileSync('processed_landscape.yml'));
const traverse = require('traverse');
const _ = require('lodash');
import actualTwitter from './actualTwitter';
import saneName from '../src/utils/saneName';
import formatCity from '../src/utils/formatCity';

function sortFn(x) {
  if (_.isString(x)) {
    return x.trim().toLowerCase();
  }
  return x;
}

const formatDate = function(x) {
  let result;
  if (!x) {
    result =  x;
  }
  const delta = new Date().getTime() - new Date(x).getTime();
  const day = 86400 * 1000;
  if (delta < 7 * day) {
    result = {text: 'this week', value: '990'};
  }
  else if (delta < 14 * day) {
    result = {text: 'last week', value: '980'}
  }
  else if (delta < 21 * day) {
    result = {text: '3 weeks ago', value: '970'}
  }
  else if (delta < (30 * 1 + 15) * day) {
    result = {text: 'about a month', value: '960'}
  }
  else if (delta < (30 * 2 + 15) * day) {
    result = {text: '2 months ago', value: '950'}
  }
  else if (delta < (30 * 3 + 15) * day) {
    result = {text: '3 months ago', value: '940'}
  }
  else if (delta < (30 * 4 + 15) * day) {
    result = {text: '4 months ago', value: '930'}
  }
  else if (delta < (30 * 5 + 15) * day) {
    result = {text: '5 months ago', value: '920'}
  }
  else if (delta < (30 * 6 + 15) * day) {
    result = {text: '6 months ago', value: '910'}
  }
  else if (delta < (30 * 7 + 15)  * day) {
    result = {text: '7 months ago', value: '900'}
  }
  else if (delta < (30 * 8 + 15) * day) {
    result = {text: '8 months ago', value: '890'}
  }
  else if (delta < (30 * 9 + 15) * day) {
    result = {text: '9 months ago', value: '880'}
  }
  else if (delta < (30 * 10 + 15) * day) {
    result = {text: '10 months ago', value: '870'}
  }
  else if (delta < (30 * 11 + 15) * day) {
    result = {text: '11 months ago', value: '860'}
  } else {
    result = x;
  }
  if (result && result.text) {
    result.original = x;
  }
  return result;
};

const items = [];
const tree = traverse(source);
tree.map(function(node) {
  if (node && node.item === null) {
    const parts = this.parents.filter(function(p) {
      return p.node.category === null || p.node.subcategory === null;
    }).map(function(p) {
      return p.node.name;
    });
    const getHeadquarters = function() {
      let result = null;
      if (node.crunchbase_data) {
        result = formatCity(node.crunchbase_data);
      }
      if (!result) {
        result = 'N/A';
      }
      return result;
    };
    const getTwitter = function() {
      return actualTwitter(node, node.crunchbase_data);
    };
    const getDescription = function() {
      if (! _.isUndefined(node.description)) {
        return node.description;
      }
      if (node.github_data && node.github_data.description) {
        return node.github_data.description;
      }
      if (node.crunchbase_data && node.crunchbase_data.description) {
        return node.crunchbase_data.description;
      }
      return null;
    };
    const getLicense = function() {
      if (!node.github_data) {
        if (node.repo_url) {
          return 'Unknown License';
        }
        return 'NotOpenSource';
      }
      return node.github_data.license;
    }
    const getAmount = function() {
      if (node.yahoo_finance_data) {
        return node.yahoo_finance_data.market_cap;
      }
      if (node.crunchbase_data) {
        return node.crunchbase_data.funding;
      }
      return 'N/A';
    }
    const getTicker = function() {
      if (node.yahoo_finance_data) {
        return node.yahoo_finance_data.marketCap;
      }
      return (node.crunchbase_data || {}).effective_ticker;
    };

    const getCommitLink = function(link) {
      if (!link) {
        return null;
      }
      return 'https://github.com' + link;
    }

    items.push({...node,
      lfdlProject: node.lfdl_project,
      lfdlMember: node.lfdl_membership_data.lfdl_member,
      lfdlRelation: (node.lfdl_project === 'sandbox' ? 'member' : node.lfdl_project) || ( node.lfdl_membership_data.lfdl_member ? 'member' : false ),
      firstCommitDate: formatDate((node.github_start_commit_data || {}).start_date),
      firstCommitLink: getCommitLink((node.github_start_commit_data || {}).start_commit_link),
      latestCommitDate: formatDate((node.github_data || {}).latest_commit_date),
      latestCommitLink: getCommitLink((node.github_data || {}).latest_commit_link),
      releaseDate: formatDate((node.github_data || {}).release_date),
      releaseLink: (node.github_data || {}).release_link,
      contributorsCount: (node.github_data || {}).contributors_count,
      contributorsLink: (node.github_data || {}).contributors_link,
      stars: (node.github_data || {}).stars,
      license: getLicense(),
      headquarters: getHeadquarters(),
      twitter: getTwitter(),
      latestTweetDate: formatDate((node.twitter_data || {}).latest_tweet_date),
      description: getDescription(),
      organization: (node.crunchbase_data || {}).name || node.organization,
      crunchbaseData: node.crunchbase_data,
      path: parts.join(' / '),
      landscape: parts.join(' / '),
      category: parts[0],
      amountKind: (node.crunchbase_data || {}).kind,
      amount: getAmount(),
      ticker: getTicker(),
      oss: getLicense() !== 'NotOpenSource',
      href: `/logos/${(node.image_data || {}).fileName}`,
      bestPracticeBadgeId: (node.best_practice_data || {}).badge,
      bestPracticePercentage: (node.best_practice_data || {}).percentage
    });
  }
});
const itemsWithExtraFields = items.map(function(item) {
  if (item.crunchbase_data) {
    item.crunchbaseData.numEmployeesMin = item.crunchbaseData.num_employees_min;
    item.crunchbaseData.numEmployeesMax = item.crunchbaseData.num_employees_max;
    item.crunchbaseData.tickerSymbol = item.crunchbaseData.ticker_symbol;
  }
  delete item.crunchbase_data;
  delete item.twitter_data;
  if (item.crunchbaseData) {
    delete item.crunchbaseData.num_employees_min;
    delete item.crunchbaseData.num_employees_max;
    delete item.crunchbaseData.ticker_symbol;
  }
  delete item.best_practice_data;
  delete item.lfdl_project;
  delete item.lfdl_member;
  delete item.market_cap;
  delete item.first_commit_date;
  delete item.latest_commit_date;
  delete item.release_date;
  delete item.release_link;
  delete item.first_commit_link;
  delete item.latest_commit_link;
  delete item.item;
  const id = saneName(item.name);
  return {
    ...item,
    id: id,
  }
});


// Handle companies in a special way
const hasCompanyCategory = (function() {
  var result = false;
  tree.map(function(node) {
    if (node && node.category === null && node.name === 'LF DL Member Company') {
      result = true;
    }
  });
  return result;
})();
if (!hasCompanyCategory) {
  console.info(`FATAL: can not find a category with name: "LF DL Member Company". We use that category to get a list of member companies`);
  process.exit(1);
}

_.each(itemsWithExtraFields, function(item) {
  if (item.category === 'LF DL Member Company') {
    item.lfdlProject = 'company';
    item.lfdlRelation = 'company';
  }
});


// protect us from duplicates
var hasDuplicates = false;
_.values(_.groupBy(itemsWithExtraFields, 'name')).forEach(function(duplicates) {
  if (duplicates.length > 1) {
    hasDuplicates = true;
    _.each(duplicates, function(duplicate) {
      console.error(`FATAL ERROR: Duplicate item: ${duplicate.organization} ${duplicate.name} at path ${duplicate.path}`);
    });
  }
});
if (hasDuplicates) {
  require('process').exit(1);
}

// protect us from duplicate repo_urls
var hasDuplicateRepos = false;
_.values(_.groupBy(itemsWithExtraFields.filter( (x) => !!x.repo_url), 'repo_url')).forEach(function(duplicates) {
  if (duplicates.length > 1) {
    hasDuplicateRepos = true;
    _.each(duplicates, function(duplicate) {
      console.error(`FATAL ERROR: Duplicate repo: ${duplicate.repo_url} on ${duplicate.name} at path ${duplicate.path}`);
    });
  }
});
if (hasDuplicateRepos) {
  require('process').exit(1);
}

var hasEmptyCrunchbase = false;
_.each(itemsWithExtraFields, function(item) {
  if (!item.crunchbaseData) {
    hasEmptyCrunchbase = true;
    console.info(`FATAL ERROR: ${item.name} either has no crunchbase entry or it is invalid`);
  }
});
if (hasEmptyCrunchbase) {
  require('process').exit(1);
}

var hasBadCrunchbase = false;
_.each(itemsWithExtraFields, function(item) {
  if (item.crunchbase.indexOf('https://www.crunchbase.com/organization/') !== 0) {
    hasBadCrunchbase = true;
    console.info(`FATAL ERROR: ${item.name}  has a crunchbase ${item.crunchbase} which does not start with 'https://www.crunchbase.com/organization'`);
  }
});
if (hasBadCrunchbase) {
  require('process').exit(1);
}

var hasBadHomepage = false;
_.each(itemsWithExtraFields, function(item) {
  if (!item.homepage_url) {
    hasBadHomepage = true;
    console.info(`FATAL ERROR: ${item.name}  has an empty or missing homepage_url`);
  }
});
if (hasBadHomepage) {
  require('process').exit(1);
}

_.each(itemsWithExtraFields, function(item) {
  if (item.twitter && !item.latestTweetDate) {
    if (item.latestTweetDate === null) {
      console.info(`Warning: ${item.name} has a twitter ${item.twitter} with no entries`);
    } else {
      console.info(`Warning: ${item.name} has a twitter ${item.twitter} which is invalid or we just can not fetch its tweets`);
    }
  }
});

var hasWrongTwitterUrls = false;
_.each(itemsWithExtraFields, function(item) {
  if (item.twitter && item.twitter.split('/').slice(-1)[0] === '') {
    console.info(`Fatal: ${item.name} has a twitter ${item.twitter} which ends with /`);
    hasWrongTwitterUrls = true;
  }
});
if (hasWrongTwitterUrls) {
  require('process').exit(1);
}

var hasBadRepoUrl = false;
_.each(itemsWithExtraFields, function(item) {
  if (item.repo_url
    && (item.repo_url.indexOf('https://github.com') !== 0 || item.repo_url.split('/').filter( (x) => !!x).length !== 4)
  ) {
    hasBadRepoUrl = true;
    console.info(`FATAL ERROR: ${item.name}  has a repo_url ${item.repo_url} which does not look like a good github repo url`);
  }
});
if (hasBadRepoUrl) {
  require('process').exit(1);
}

var hasBadImages = false;
_.each(itemsWithExtraFields, function(item) {
  if (!item.image_data) {
    console.info(`FATAL ERROR: Item ${item.name} has no image_data`);
    hasBadImages = true;
  } else {
    const imageFileName = './cached_logos/' + item.image_data.fileName;
    if (!require('fs').existsSync(imageFileName)) {
      console.info(`FATAL ERROR: Item ${item.name} does not have a file ${imageFileName} on the disk`);
      hasBadImages = true;
    } else {
      const fileSize = require('fs').statSync(imageFileName).size;
      if (fileSize < 100) {
        console.info(`FATAL ERROR: Item ${item.name} has a file ${imageFileName} size less than 100 bytes`);
        hasBadImages = true;
      }
    }
  }
});
if(hasBadImages) {
  require('process').exit(-1);
}

var hasBadSvgImages = false;
_.each(itemsWithExtraFields, function(item) {
  const imageFileName = './cached_logos/' + item.image_data.fileName;
  const  content = require('fs').readFileSync(imageFileName, 'utf-8');
  if (content.indexOf('base64,') !== -1) {
    hasBadSvgImages = true;
    console.info(`FATAL ERROR: Item ${item.name} has a file ${imageFileName} which embeds a png. Please use a pure svg file`);
  }
  if (content.indexOf('<text') !== -1) {
    hasBadSvgImages = true;
    console.info(`FATAL ERROR: Item ${item.name} has a file ${imageFileName} which has a <text> element. Please convert it to the glyph first, because we can not render it the same way on all computers, especially on our render server`);
  }
  if (content.indexOf('<tspan') !== -1) {
    hasBadSvgImages = true;
    console.info(`FATAL ERROR: Item ${item.name} has a file ${imageFileName} which has a <tspan> element. Please convert it to the glyph first, because we can not render it the same way on all computers, especially on our render server`);
  }
});
if(hasBadSvgImages) {
  require('process').exit(-1);
}


function removeNonReferencedImages() {
  const fs = require('fs');
  const existingFiles = fs.readdirSync('./hosted_logos');
  const allowedFiles = itemsWithExtraFields.map( (e) => e.logo ).filter( (e) => !!e);
  _.each(existingFiles, function(existingFile) {
    const fileName = './hosted_logos/' + existingFile;
    if (allowedFiles.indexOf(fileName) === -1){
      fs.unlinkSync('./hosted_logos/' + existingFile);
    }
  })
}
removeNonReferencedImages();


const extractOptions = function(name) {
  return _.chain(itemsWithExtraFields).map(function(x) {
    return x[name];
  }).filter(function(x) {
    return !!x
  }).sortBy(sortFn).uniq().map(function(x) {
    return {
      id: x,
      label: x,
      url: saneName(x)
    };
  }).value();
};

const generateLandscapeHierarchy = function() {
  var result = [];
  tree.map(function(node) {
    if (node && node.category === null) {
      result.push({
        id: node.name,
        label: node.name,
        url: saneName(node.name),
        level: 1,
        children: []
      });
    }
    if (node && node.subcategory === null) {
      const category = this.parents.filter(function(p) {
        return p.node.category === null;
      }).map(function(p) {
        return p.node.name;
      })[0];
      const categoryEntry = _.find(result, {level: 1, id: category});
      const entry = {
        id: category + ' / ' + node.name,
        parentId: category,
        label: node.name,
        groupingLabel: category + ' - ' + node.name,
        url: saneName(node.name),
        level: 2
      }
      categoryEntry.children.push(entry.id);
      result.push(entry);
    }
  });
  // now ensure that subcategories in different categories but named equally
  // have different url
  const resultWithUniqueUrls = _.map(result, function(entry) {
    const otherEntry = _.find(result, (x) => x.url === entry.url && x !== entry && x.level === 2 && entry.level === 2);
    if (otherEntry) {
      const parentEntry = _.find(result, {id: entry.parentId});
      return { ...entry, url: parentEntry.url + '-' + entry.url}
    } else {
      return entry;
    }
  });
  return resultWithUniqueUrls;
};

const generateHeadquarters = function() {
  const values = _.uniq(itemsWithExtraFields.map(function(item) {
      return {headquarters: item.headquarters, country: item.crunchbaseData.country};
  }));
  const grouped  = _.groupBy(values, (x) => x.country);
  const keys = _.orderBy(_.keys(grouped));
  const result = [];
  _.each(keys, function(key) {
    const value = grouped[key];
    const children = _.uniqBy(value, (x) => x.headquarters);
    result.push({
      id: key,
      label: key,
      url: saneName(key),
      level: 1,
      children: children.map( (x) => (x.headquarters))
    });
    _.each(_.orderBy(children,  (x) => x.headquarters), function(record) {
      result.push({
        id: record.headquarters,
        label: record.country === 'United States' ? record.headquarters :  record.headquarters.split(', ')[0],
        groupingLabel: record.headquarters,
        url: saneName(record.headquarters),
        level: 2,
        parentId: key
      });
    });
  });
  return result;
}

const generateLicenses = function() {
  const otherLicenses = extractOptions('license').filter(function(x) {
    return x.id !== 'NotOpenSource';
  });
  return [{
    id: 'Open Source',
    label: 'Open Source',
    url: saneName('Open Source'),
    level: 1,
    children: _.map(otherLicenses, 'id')
  }].concat(otherLicenses.map(function(license){
    return {
      ...license,
      parentId: 'Open Source',
      level: 2
    };
  })).concat([{
      id: 'NotOpenSource',
      label: 'Not Open Source',
      url: saneName('NotOpenSource'),
      level: 1,
      children: []
    }
  ]);
};
const lookups = {
  organization: extractOptions('organization'),
  landscape: generateLandscapeHierarchy(),
  license: generateLicenses(),
  headquarters: generateHeadquarters()
}
const previewData = itemsWithExtraFields.filter(function(x) {
  return !!x.lfdlProject;
});
require('fs').writeFileSync('src/data.json', JSON.stringify(itemsWithExtraFields, null, 2));
require('fs').writeFileSync('src/preview.json', JSON.stringify(previewData, null, 2));
require('fs').writeFileSync('src/lookup.json', JSON.stringify(lookups, null, 2));
