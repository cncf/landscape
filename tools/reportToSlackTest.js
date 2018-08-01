import rp from 'request-promise';

const url = `https://hooks.slack.com/services/${process.env.SLACK_CHANNEL}`;
const payload = {
  text: 'Test',
  attachments: [{
    title: 'Example log file',
    fields: [{
      title: 'Status',
      value: 'Warning'
    }, {
      title: 'Crunchbase warnings: ',
      value: '5'
    }, {
      title: 'Github warnings: ',
      value: '-'
    }, {
      title: 'Badge warnings: ',
      value: '-'
    }],
    text: `
    Fetching crunchbase entries
***E**E************************************************E***********************************************************************************E*************************************************E************
**********************************************************************************************************************************************************************************************************
*************************************************************************E**********************************************************************************
Using cached entry, because can not fetch: accenture Can't resolve stock ticker ACNN; please manually a 0 [ 'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please
 manually a',
  'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please manually a',
  'Using cached entry, because can not fetch: tencent Can\'t resolve stock ticker 0700; please manually a',
  'Using cached entry, because can not fetch: rackspace Cannot read property \'raw\' of undefined',
  'Using cached entry, because can not fetch: octo-technology Can\'t resolve stock ticker ALOCT; please manually ',
  'Using cached entry, because can not fetch: callidus-software Cannot read property \'raw\' of undefined' ]
Using cached entry, because can not fetch: accenture Can't resolve stock ticker ACNN; please manually a 1 [ 'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please
 manually a',
  'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please manually a',
  'Using cached entry, because can not fetch: tencent Can\'t resolve stock ticker 0700; please manually a',
  'Using cached entry, because can not fetch: rackspace Cannot read property \'raw\' of undefined',
  'Using cached entry, because can not fetch: octo-technology Can\'t resolve stock ticker ALOCT; please manually ',
  'Using cached entry, because can not fetch: callidus-software Cannot read property \'raw\' of undefined' ]
Using cached entry, because can not fetch: tencent Can't resolve stock ticker 0700; please manually a 2 [ 'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please m
anually a',
  'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please manually a',
  'Using cached entry, because can not fetch: tencent Can\'t resolve stock ticker 0700; please manually a',
  'Using cached entry, because can not fetch: rackspace Cannot read property \'raw\' of undefined',
  'Using cached entry, because can not fetch: octo-technology Can\'t resolve stock ticker ALOCT; please manually ',
  'Using cached entry, because can not fetch: callidus-software Cannot read property \'raw\' of undefined' ]
Using cached entry, because can not fetch: rackspace Cannot read property 'raw' of undefined 3 [ 'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please manually a
',
  'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please manually a',
  'Using cached entry, because can not fetch: tencent Can\'t resolve stock ticker 0700; please manually a',
  'Using cached entry, because can not fetch: rackspace Cannot read property \'raw\' of undefined',
  'Using cached entry, because can not fetch: octo-technology Can\'t resolve stock ticker ALOCT; please manually ',
  'Using cached entry, because can not fetch: callidus-software Cannot read property \'raw\' of undefined' ]
Using cached entry, because can not fetch: octo-technology Can't resolve stock ticker ALOCT; please manually  4 [ 'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN;
please manually a',
  'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please manually a',
  'Using cached entry, because can not fetch: tencent Can\'t resolve stock ticker 0700; please manually a',
  'Using cached entry, because can not fetch: rackspace Cannot read property \'raw\' of undefined',
  'Using cached entry, because can not fetch: octo-technology Can\'t resolve stock ticker ALOCT; please manually ',
  'Using cached entry, because can not fetch: callidus-software Cannot read property \'raw\' of undefined' ]
Using cached entry, because can not fetch: callidus-software Cannot read property 'raw' of undefined 5 [ 'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please ma
nually a',
  'Using cached entry, because can not fetch: accenture Can\'t resolve stock ticker ACNN; please manually a',
  'Using cached entry, because can not fetch: tencent Can\'t resolve stock ticker 0700; please manually a',
  'Using cached entry, because can not fetch: rackspace Cannot read property \'raw\' of undefined',
  'Using cached entry, because can not fetch: octo-technology Can\'t resolve stock ticker ALOCT; please manually ',
  'Using cached entry, because can not fetch: callidus-software Cannot read property \'raw\' of undefined' ]
    `
  }]
};

async function main() {
  const result = await rp({
    method: 'POST',
    json: payload,
    url: url
  });
  console.info(result);

}
main();
