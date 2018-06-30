import {Builder, Parser} from 'xml2js';
import _ from 'lodash';
import Jimp from 'jimp';
const { convert } = require('convert-svg-to-png');

async function svg2js(content) {
  return new Promise(function(resolve, reject) {
    var parser = new Parser();
    parser.parseString(content, function (err, result) {
      if (err) {
        reject(err);
      } else {
      resolve(result);
      }
    });
  })
}

export async function ensureViewBoxExists(content) {
  try {
    const js = await svg2js(content);
    if (!js.svg.$.viewBox) {
      js.svg.$.viewBox = `0 0 ${js.svg.$.width} ${js.svg.$.height}`;
      const builder = new Builder();
      return builder.buildObject(js);
    } else {
      return content;
    }
  } catch(ex) {
    // console.info('Error while processing SVG', ex.message);
    return content;
  }
}

export async function getViewbox(content) {
  try {
    const js = await svg2js(content);
    if (!js.svg.$.viewBox) {
      // console.info('oops');
      return null;
    } else {
      const viewBox =  js.svg.$.viewBox;
      const [ x, y, width, height ] = viewBox.replace(/,/g, '').split(' ').map( (x) => +x);
      // console.info(viewBox);
      return {x, y, width, height };
    }
  } catch(ex) {
    const viewBox = content.match(/viewBox="(.*?)"/)[1];
    if (viewBox) {
      const [ x, y, width, height ] = viewBox.replace(/,/g, '').split(' ').map( (x) => +x);
      // console.info(viewBox);
      return {x, y, width, height };
    }
  }
}

export async function updateViewbox(content, {x, y, width, height}) {
  const viewBox = content.match(/viewBox="(.*?)"/)[1];
  const newValue = `${x} ${y} ${width} ${height}`;
  if (viewBox) {
    return content.replace(/viewBox="(.*?)"/, `viewBox="${newValue}"`);
  } else {
    return content;
  }
}
export async function removeWidthAndHeight(svg) {
  const lines = svg.split('\n');
  const svgLine = _.find(lines, (x) => x.indexOf('<svg ') !== -1);
  if (!svgLine) {
    return svg; //strange
  }
  var js;
  try  {
    js = await svg2js(svg);
  } catch(ex) {
    return svg; //
  }
  if (!js.svg.$.width || !js.svg.$.height) {
    return svg;
  }
  const cleanLine = svgLine.replace(/width=".*?"/, '').replace(/height=".*?"/, '').replace(/preserveAspectRatio=".*?"/, '');
  const newLines = lines.map( (x) => x === svgLine ? cleanLine : x);
  return newLines.join('\n');
}

export async function autoCropSvg(svg) {
  // console.info('Processing: ', fname);
  // const svg = fs.readFileSync(fname, 'utf-8');
  svg = svg.toString();
  // get a maximum possible viewbox which covers the whole region;
  const {x, y, width, height } = await getViewbox(svg);
  const maxSizeX = Math.max(Math.abs(x), Math.abs(x + width));
  const maxSizeY = Math.max(Math.abs(y), Math.abs(y + height));

  //get an svg in that new viewbox
  svg = await updateViewbox(svg, {
    x: -maxSizeX,
    y: -maxSizeY,
    width: 2* maxSizeX,
    height: 2 * maxSizeY
  });
  // width and height attributes break the viewBox
  svg = await removeWidthAndHeight(svg);


  // attempt to convert it again if it fails
  var counter = 3;
  async function tryToConvert() {
    try {
      return await convert(svg, {width: 2 * maxSizeX,height: 2 * maxSizeY, puppeteer: {args: ['--no-sandbox', '--disable-setuid-sandbox']}});
    } catch(ex) {
      counter -= 1;
      if (counter <= 0) {
        return null;
      }
      return await tryToConvert();
    }
  }

  const png = await tryToConvert();
  if (!png) {
    throw new Error('Not a valid svg');
  }
  const image = await Jimp.read(png);

  // If anything is completely white - make it black
  await image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    // x, y is the position of this pixel on the image
    // idx is the position start position of this rgba tuple in the bitmap Buffer
    // this is the image

    var red   = this.bitmap.data[ idx + 0 ];
    var green = this.bitmap.data[ idx + 1 ];
    var blue  = this.bitmap.data[ idx + 2 ];

    if (red > 230 && green > 230 && blue > 230) {
      this.bitmap.data[idx + 0] = 0;
      this.bitmap.data[idx + 1] = 0;
      this.bitmap.data[idx + 2] = 0;
      this.bitmap.data[idx + 3] = 0;
    }
    if (red === 0 && green === 0 && blue === 0) {
      this.bitmap.data[idx + 0] = 0;
      this.bitmap.data[idx + 1] = 0;
      this.bitmap.data[idx + 2] = 0;
      this.bitmap.data[idx + 3] = 0;
    }
  });

  async function getCropRegion() {
    const oldCrop = image.crop;
    let newViewbox = { x: 0, y: 0, width: 2 * maxSizeX, height: 2 * maxSizeY };
    image.crop = function(a, b, c, d) {
      newViewbox = {x: a, y: b, width: c, height: d};
      return;
    }
    await image.autocrop(false);
    image.crop = oldCrop;
    return newViewbox;
  }

  const newViewbox = await getCropRegion();
  // add a bit of padding around the svg
  let extraRatio = 0.02;
  newViewbox.x = newViewbox.x - newViewbox.width * extraRatio;
  newViewbox.y = newViewbox.y - newViewbox.height * extraRatio;
  newViewbox.width = newViewbox.width * (1 + 2 * extraRatio);
  newViewbox.height = newViewbox.height * (1 + 2 * extraRatio);

  // translate to original coordinats
  newViewbox.x = newViewbox.x - maxSizeX;
  newViewbox.y = newViewbox.y - maxSizeY;
  // apply a new viewbox to the svg
  const newSvg = await updateViewbox(svg, newViewbox);
  return newSvg;
}
