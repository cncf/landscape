import {createSitemap} from 'sitemap';
const items = JSON.parse(require('fs').readFileSync('src/data.json'));
import _ from 'lodash';

const sitemap = createSitemap({
  hostname: 'https://landscape.cncf.io',
  cacheTime: 600 * 1000,
  urls: _.flatten([
    { url: '/' },
    items.map(function(item) {
      return {
        url: `selected=${item.id}`,
        img: [{
          url: item.href,
          caption: `${item.name} logo`
        }]
      };
    })
  ])
});
require('fs').writeFileSync('dist/sitemap.xml', sitemap);
