import colors from 'colors';
import rp from 'request-promise';
import Promise from 'bluebird';
import saneName from '../src/utils/saneName';
import fs from 'fs';
import _ from 'lodash';
import { ensureViewBoxExists, autoCropSvg } from './processSvg';
const debug = require('debug')('images');

const error = colors.red;
const fatal = (x) => colors.red(colors.inverse(x));
const cacheMiss = colors.green;

const traverse = require('traverse');

async function getLandscapeItems() {
  const source = require('js-yaml').safeLoad(require('fs').readFileSync('landscape.yml'));
  const tree = traverse(source);
  const items = [];
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.item !== null) {
      return;
    }
    items.push({logo: node.logo, name: node.name, organization: node.organization});
  });
  _.each(items, function(item) {
    const otherItems = _.filter(items, {name: item.name});
    var id = item.name;
    if (otherItems.length > 1) {
      id = item.organization + ' ' + item.name;
    }
    item.id = id;
  });
  return items;
}

export async function extractSavedImageEntries() {
  const traverse = require('traverse');
  let source = [];
  try {
    source =  require('js-yaml').safeLoad(require('fs').readFileSync('processed_landscape.yml'));
  } catch(_ex) {
    console.info('Cannot extract image entries from the processed_landscape.yml');
  }

  var images = [];
  const tree = traverse(source);
  tree.map(function(node) {
    if (!node) {
      return;
    }
    if (node.image_data) {
      images.push({...node.image_data,name: node.name, logo: node.logo});
    }
  });

  return _.uniq(images);
}



function imageExist(entry) {
  const fileName = './cached_logos/' + entry.fileName ;
  return require('fs').existsSync(fileName);
}

function getItemHash(item) {
  if (item.logo && item.logo.indexOf('.') === 0) {
    // console.info(item.logo);
    const response = fs.readFileSync(item.logo);
    return require('crypto').createHash('sha256').update(response).digest('base64');
  }
  return;
}

export async function fetchImageEntries({cache, preferCache}) {
  const items = await getLandscapeItems();
  const errors = [];
  const result = await Promise.map(items, async function(item) {
    const hash = getItemHash(item);
    const searchOptions = {logo: item.logo, name: item.name};
    if (hash) {
      searchOptions.hash = hash;
    }
    // console.info(searchOptions);
    const cachedEntry = _.find(cache, searchOptions);
    if (preferCache && cachedEntry && imageExist(cachedEntry)) {
      debug(`Found cached entry for ${item.name} with logo ${item.logo}`);
      require('process').stdout.write(".");
      return cachedEntry;
    }
    debug(`Fetching data for ${item.name} with logo ${item.logo}`);
    var url = item.logo;
    if (url && url.indexOf('http') !== 0 && url.indexOf('.') !== 0) {
      console.info(`adding a prefix for ${url}`);
      url = 'http://' + url;
    }
    if (url && url.indexOf('//github.com/') !== -1) {
      url = url.replace('github.com', 'raw.githubusercontent.com');
      url = url.replace('blob/', '');
    }
    if (!url) {
      return null;
    } else {
      const extWithQuery = url.split('.').slice(-1)[0];
      var ext='.' + extWithQuery.split('?')[0];
      var outputExt = '';
      if (['.jpg', '.png', '.gif'].indexOf(ext) !== -1 ) {
        errors.push(fatal(`${item.name}: Only svg logos are supported`));
        return null;
      }

      outputExt = '.svg';
      const fileName = `${saneName(item.id)}${outputExt}`;
      try {
        var response = null;
        if (url.indexOf('.') === 0) {
          response = fs.readFileSync(url);
        } else {
          response = await rp({
            encoding: null,
            uri: url,
            followRedirect: true,
            maxRedirects: 5,
            simple: true,
            timeout: 30 * 1000
          });
        }
        const processedSvg = await ensureViewBoxExists(response);
        const croppedSvg = await autoCropSvg(processedSvg);
        require('fs').writeFileSync(`cached_logos/${fileName}`, croppedSvg);
        require('process').stdout.write(cacheMiss("*"));
        return {
          fileName: fileName,
          name: item.name,
          logo: item.logo,
          hash: hash
        };
      } catch(ex) {
        debug(`Cannot fetch ${url}`);
        if (cachedEntry && imageExist(cachedEntry)) {
          require('process').stdout.write(error("E"));
          errors.push(error(`Using cached entry, because ${item.name} has issues with logo: ${url}, ${ex.message.substring(0, 100)}`));
          return cachedEntry;
        } else {
          require('process').stdout.write(fatal("E"));
          errors.push(fatal(`No cached entry, and ${item.name} has issues with logo: ${url}, ${ex.message.substring(0, 100)}`));
          return null;
        }
      }
    }
  }, {concurrency: 5});
  require('process').stdout.write("\n");
  _.each(errors, function(error) {
    console.info('error: ', error);
  });
  return {
    imageEntries: result,
    imageErrors: errors
  }
}

export function removeNonReferencedImages(imageEntries) {
  const existingFiles = fs.readdirSync('./cached_logos');
  const allowedFiles = imageEntries.filter( (e) => !!e).map( (e) => e.fileName );
  _.each(existingFiles, function(existingFile) {
    if (allowedFiles.indexOf(existingFile) === -1){
      fs.unlinkSync('./cached_logos/' + existingFile);
    }
  })
}
