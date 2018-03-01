import Jimp from 'jimp';
import rp from 'request-promise';
import Promise from 'bluebird';
import fs from 'fs';

const fNameOrUrl = require('process').argv[2];
console.info(fNameOrUrl);

// x3 because we may have retina display
const sizes = [{
  name: 'large',
  width: 600 * 3,
  height: 200 * 3
}, {
  name: 'tile',
  width: 153 * 3,
  height: 100 * 3
}];

async function fetchImage() {
    var url = fNameOrUrl;
    if (url && url.indexOf('http') !== 0 && url.indexOf('.') !== 0) {
      console.info(`adding a prefix for ${url}`);
      url = 'http://' + url;
    }
    if (url && url.indexOf('//github.com/') !== -1) {
      url = url.replace('github.com', 'raw.githubusercontent.com');
      url = url.replace('blob/', '');
    }
    if (!url) {
      console.info('no');
    } else {
      const extWithQuery = url.split('.').slice(-1)[0];
      var ext='.' + extWithQuery.split('?')[0];
      if (['.jpg', '.png', '.gif', '.svg'].indexOf(ext) === -1 ) {
        ext = '.png';
      }
      const fileName = `tmp/t1.png`;
      try {
        // console.info(url);
        var response = null;
        if (url.indexOf('.') === 0) {
          response = fs.readFileSync(url);
        } else {
          try {
            response = await rp({
              encoding: null,
              uri: url,
              followRedirect: true,
              simple: true,
              timeout: 30 * 1000
            });
          } catch(ex) {
            console.info('failed to fetch ', url, ' attempting to use existing image');
          }
        }
        await normalizeImage({inputFile: response,outputFile: fileName});
      } catch(ex) {
        console.info(ex.message.substring(0, 100));
      }
    }
}

async function normalizeImage({inputFile, outputFile}) {
  const threshold  = 0.05;
  const maxValue = 255 - 255 * threshold;
  const image = await Jimp.read(inputFile);
  // console.info(image);
  await image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x,y, idx) {
    var red   = this.bitmap.data[ idx + 0 ];
    var green = this.bitmap.data[ idx + 1 ];
    var blue  = this.bitmap.data[ idx + 2 ];
    var alpha = this.bitmap.data[ idx + 3 ];
    if (red > maxValue && green > maxValue && blue > maxValue) {
      alpha = 0;
    }
    this.bitmap.data[idx + 3 ] = alpha;
  });
  console.info('Before autocrop', image);
  await image.autocrop();
  console.info('After autocrop', image);
  await Promise.map(sizes, async function(size) {
    var clone = image.clone();
    await clone.contain(size.width, size.height);
    console.info('Resize', image);
    await clone.write(outputFile.replace('.png', `-${size.name}.png`));
  });
}

async function main() {
  await fetchImage();
}
main();
