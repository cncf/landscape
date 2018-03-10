const source = require('js-yaml').safeLoad(require('fs').readFileSync('processed_landscape.yml'));
const traverse = require('traverse');
const _ = require('lodash');
import saneName from '../src/utils/saneName';
import formatCity from '../src/utils/formatCity';

function sortFn(x) {
  if (_.isString(x)) {
    return x.trim().toLowerCase();
  }
  return x;
}

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
      if (_.isUndefined(node.twitter)) {
        return (node.crunchbase_data || {}).twitter;
      }
      return node.twitter;
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
      cncfProject: node.cncf_project,
      cncfMember: node.cncf_membership_data.cncf_member,
      cncfRelation: node.cncf_project || ( node.cncf_membership_data.cncf_member ? 'member' : false ),
      firstCommitDate: (node.github_start_commit_data || {}).start_date,
      firstCommitLink: getCommitLink((node.github_start_commit_data || {}).start_commit_link),
      latestCommitDate:(node.github_data || {}).latest_commit_date,
      latestCommitLink: getCommitLink((node.github_data || {}).latest_commit_link),
      releaseDate: (node.github_data || {}).release_date,
      releaseLink: (node.github_data || {}).release_link,
      contributorsCount: (node.github_data || {}).contributors_count,
      contributorsLink: (node.github_data || {}).contributors_link,
      stars: (node.github_data || {}).stars,
      license: getLicense(),
      headquarters: getHeadquarters(),
      twitter: getTwitter(),
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
      href: `/logos/${(node.image_data || {}).fileName}`
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
  if (item.crunnchbaseData) {
    delete item.crunchbaseData.num_employees_min;
    delete item.crunchbaseData.num_employees_max;
    delete item.crunchbaseData.ticker_symbol;
  }
  delete item.cncf_project;
  delete item.cncf_member;
  delete item.market_cap;
  delete item.first_commit_date;
  delete item.latest_commit_date;
  delete item.release_date;
  delete item.release_link;
  delete item.first_commit_link;
  delete item.latest_commit_link;
  delete item.item;
  const otherItems = _.filter(items, {name: item.name});
  var id = saneName(item.name);
  if (otherItems.length > 1) {
    id = saneName(item.organization + ' ' + item.name);
  }
  return {
    ...item,
    id: id,
  }
});

// protect us from duplicates
var hasDuplicates = false;
_.values(_.groupBy(itemsWithExtraFields, 'id')).forEach(function(duplicates) {
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
// ensure that crunchbase references are not wrong
var hasDifferentCrunchbasePerOrganization = false;
_.values(_.groupBy(itemsWithExtraFields, 'organization')).forEach(function(itemsInOrganization) {
  var crunchbaseEntries = _.uniq(_.map(itemsInOrganization, 'crunchbase'));
  if (crunchbaseEntries.length > 1) {
    hasDifferentCrunchbasePerOrganization = true;
    _.each(itemsInOrganization, function(item) {
      console.info(`FATAL ERROR: Entry ${item.name} of an organization ${item.organization} has crunchbase ${item.crunchbase}`);
    });
  }
});
if (hasDifferentCrunchbasePerOrganization) {
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
  return result;
};
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
  headquarters: extractOptions('headquarters'),
  vcFunder: extractOptions('vcFunder')
}
require('fs').writeFileSync('src/data.json', JSON.stringify(itemsWithExtraFields, null, 2));
require('fs').writeFileSync('src/lookup.json', JSON.stringify(lookups, null, 2));
