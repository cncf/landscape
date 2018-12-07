import branch from 'git-branch';
const currentBranch = require('process').env['BRANCH'] ||  branch.sync();
const isMainBranch = currentBranch === 'master';

const content = isMainBranch ?
  `
User-agent: *
Disallow: *grouping=
Disallow: *sort=
Disallow: *landscape=
Disallow: *cncf=
Disallow: *license=
Disallow: *organization=
Disallow: *headquarters=
Disallow: *format=

Sitemap: http://landscape.cncf.io/sitemap.xml
  `
  :
  `
User-agent: *
Disallow: /
  `
;

require('fs').writeFileSync('dist/robots.txt', content);
