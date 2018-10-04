import branch from 'git-branch';
const currentBranch = require('process').env['BRANCH'] ||  branch.sync();
const isMainBranch = currentBranch === 'master';

const content = isMainBranch ?
  `
User-agent: *
Disallow:

Sitemap: http://landscape.cncf.io/sitemap.xml
  `
  :
  `
User-agent: *
Disallow: /
  `
;

require('fs').writeFileSync('dist/robots.txt', content);
