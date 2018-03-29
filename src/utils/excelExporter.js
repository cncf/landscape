import _ from 'lodash';
export default function exportItems(groupedItems) {
  const elements = _.flatten(_.map(groupedItems, 'items'));
  const fields = [{
    label: 'Name',
    value: 'name'
  }, {
    label: 'Organization',
    value: 'organization'
  }, {
    label: 'Homepage',
    value: 'homepage_url'
  }, {
    label: 'Logo',
    value: (row) => window.location.origin + '/logos/' + row.image_data.fileName
  }, {
    label: 'Twitter',
    value: 'twitter'
  }, {
    label: 'Crunchbase URL',
    value: 'crunchbase'
  }, {
    label: 'Market Cap',
    value: 'yahoo_finance_data.market_cap'
  }, {
    label: 'Ticker',
    value: 'yahoo_finance_data.effective_ticker'
  }, {
    label: 'Funding',
    value: 'crunchbaseData.funding'
  }, {
    label: 'CNCF Member',
    value: 'cncfMember'
  }, {
    label: 'CNCF Relation',
    value: 'cncfRelation'
  }, {
    label: 'License',
    value: 'license'
  }, {
    label: 'Headquarters',
    value: 'headquarters'
  }, {
    label: 'Latest Tweet Date',
    value: 'latestTweetDate.original'
  }, {
    label: 'Description',
    value: 'description'
  }, {
    label: 'Crunchbase Description',
    value: 'crunchbaseData.description'
  }, {
    label: 'Crunchbase Homepage',
    value: 'crunchbaseData.homepage'
  }, {
    label: 'Crunchbase City',
    value: 'crunchbaseData.city'
  }, {
    label: 'Crunchbase Region',
    value: 'crunchbaseData.region'
  }, {
    label: 'Crunchbase Country',
    value: 'crunchbaseData.country'
  }, {
    label: 'Crunchbase Twitter',
    value: 'crunchbaseData.twitter'
  }, {
    label: 'Crunchbase Linkedin',
    value: 'crunchbaseData.linkedin'
  }, {
    label: 'Crunchbase Ticker',
    value: 'crunchbaseData.ticker'
  }, {
    label: 'Crunchbase Kind',
    value: 'crunchbaseData.kind'
  }, {
    label: 'Crunchbase Min Employees',
    value: 'crunchbaseData.numEmployeesMin'
  }, {
    label: 'Crunchbase Max Employees',
    value: 'crunchbaseData.numEmployeesMax'
  }, {
    label: 'Category',
    value: 'category'
  }, {
    label: 'Subcategory',
    value: (row) => row.landscape.split(' / ')[1]
  }, {
    label: 'OSS',
    value: 'oss'
  }, {
    label: 'Github Repo',
    value: 'repo_url'
  }, {
    label: 'Github Stars',
    value: 'github_data.stars'
  }, {
    label: 'Github Description',
    value: 'github_data.description'
  }, {
    label: 'Github Latest Commit Date',
    value: 'latest_commit_date'
  }, {
    label: 'Github Latest Commit Link',
    value: (row) => row.github_data ? ('https://github.com' + row.github_data.latest_commit_link) : ''
  }, {
    label: 'Github Release Date',
    value: 'github_data.release_date'
  }, {
    label: 'Github Release Link',
    value: 'github_data.release_link'
  }, {
    label: 'Github Start Commit Date',
    value: 'github_start_commit_data.start_date'
  }, {
    label: 'Github Start Commit Link',
    value: (row) => row.github_start_commit_data ? ('https://github.com' + row.github_start_commit_data.start_commit_link) : ''
  }, {
    label: 'Github Contributors Count',
    value: 'github_data.contributors_count'
  }, {
    label: 'Github Contributors Link',
    value: 'github_data.contributors_link'
  }];

  const Json2csvParser = require('json2csv').Parser;
  const json2csvParser = new Json2csvParser({ fields });
  const csv = json2csvParser.parse(elements, { fields });


  downloadCSV(csv);
}
function downloadCSV(csv) {
  var data, filename, link;
  filename = 'interactive_landscape.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}
