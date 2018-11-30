import _ from 'lodash';
import saneName from '../src/utils/saneName'
function getFileFromHistory(days) {
  const commit = require('child_process').execSync(`git rev-list -n 1 --before='{${days} days ago}' origin/master`).toString('utf-8').trim();
  const content = require('child_process').execSync(`git show ${commit}:processed_landscape.yml`).toString('utf-8');
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


function buildDiff({currentItems, prevItems, date, result}) {
  _.each(currentItems, function(item) {
    if (!item.crunchbase_data) {
      return;
    }
    if (!item.crunchbase_data.funding) {
      return;
    }
    if (_.find(result, {name: item.crunchbase_data.name})) {
      return;
    }
    const previousEntry = _.find(prevItems, (prevItem) => prevItem.crunchbase_data && prevItem.crunchbase_data.name === item.crunchbase_data.name);
    if (previousEntry && item.crunchbase_data.funding !== previousEntry.crunchbase_data.funding) {
      result.push({
        name: item.crunchbase_data.name,
        currentAmount: item.crunchbase_data.funding,
        previousAmount: previousEntry.crunchbase_data.funding,
        date: date,
        link: `https://l.cncf.io/organization=${saneName(item.crunchbase_data.name)}`,
        url: item.crunchbase
      });
    }
  });
}

const result = [];
const maxEntries = 20;
_.range(1, 100).forEach(function(i) {
  if (result.length >= maxEntries) {
    return false;
  }
  const prev = getItems(getFileFromHistory(i));
  const current = getItems(getFileFromHead());
  console.info('day #', i);
  console.info(prev.length);
  console.info(result.length);
  buildDiff({
    currentItems: current,
    prevItems: prev,
    date: new Date( new Date().getTime() - 86400 * 1000 * i).toISOString().substring(0, 10),
    result: result
  });
});

const page = `
<head>
  <title>Changes in funding</title>
  <style>
    table {min-width: 1200px; position: absolute; left: 50%; top: 40px; transform: translateX(-50%); }
    tr { line-height: 2; }
    thead { background: #ccc; font-weight: bold; }
    td { padding: 0px 3px }
  </style>
</head>
<body>
     <table>
     <thead>
       <tr>
         <td>Organization</td>
         <td>Current Funding</td>
         <td>Previous Funding</td>
         <td>Changing date</td>
         <td>l.cncf.io url</td>
         <td>Crunchbase url</td>
       </tr>
     </thead>
         ${result.map(function(item, index) {
           return `
               <tr style="${index % 2 === 0 ? '' : 'background: #eee'}">
                 <td>${item.name}</td>
                 <td style="color: green">${item.currentAmount}</td>
                 <td style="color: red">${item.previousAmount || ''}</td>
                 <td>${item.date}</td>
                 <td><a href="${item.link}" target="_blank">View at l.cncf.io</a></td>
                 <td><a href="${item.url}" target="_blank">View at crunchbase</a></td>
               </tr>
           `;
         }).join('')}
      </table>
</body>
`;
require('fs').writeFileSync('dist/funding.html', page);



console.info(result);




