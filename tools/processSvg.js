import {Builder, Parser} from 'xml2js';
import _ from 'lodash';
import Jimp from 'jimp';
import './svgAutocrop';
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

export async function updateViewport(content, {x, y, width, height}) {
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
  const js = await svg2js(svg);
  if (!js.svg.$.width || !js.svg.$.height) {
    return svg;
  }
  const cleanLine = svgLine.replace(/width=".*?"/, '').replace(/height=".*?"/, '');
  const newLines = lines.map( (x) => x === svgLine ? cleanLine : x);
  return newLines.join('\n');
}

export async function autoCropSvg(svg) {
  // console.info('Processing: ', fname);
  // const svg = fs.readFileSync(fname, 'utf-8');
  svg = svg.toString();
  const {x, y, width, height } = await getViewbox(svg);
  const maxSizeX = Math.max(Math.abs(x), Math.abs(x + width));
  const maxSizeY = Math.max(Math.abs(y), Math.abs(y + height));
  console.info('looking for a real viewport!', maxSizeX, maxSizeY);
  console.info(x, y, width, height);
  svg = await updateViewport(svg, {
    x: -maxSizeX,
    y: -maxSizeY,
    width: 2* maxSizeX,
    height: 2 * maxSizeY
  });
  svg = await removeWidthAndHeight(svg);
  async function tryToConvert() {
    try {
      return await convert(svg, {width: 2 * maxSizeX,height: 2 * maxSizeY, puppeteer: {args: ['--no-sandbox', '--disable-setuid-sandbox']}});
    } catch(ex) {
      console.info('Retrying to convert png 2 svg', ex);
      // return await tryToConvert();
    }
  }
  const png = await tryToConvert();
  const image = await Jimp.read(png);
  await image.write('./cached_logos/result.png');
  console.info(image);
  const oldCrop = image.crop;
  let newViewport = { x: 0, y: 0, width: 2 * maxSizeX, height: 2 * maxSizeY };
  let extraRatio = 0.02;
  image.crop = function(a, b, c, d) {
    newViewport = {x: a, y: b, width: c, height: d};
    return;
  }
  await image.autocrop(false);
  image.crop = oldCrop;
  newViewport.x = newViewport.x - newViewport.width * extraRatio;
  newViewport.y = newViewport.y - newViewport.height * extraRatio;
  newViewport.width = newViewport.width * (1 + 2 * extraRatio);
  newViewport.height = newViewport.height * (1 + 2 * extraRatio);

  console.info('our viewport originally was', newViewport);
  newViewport.x = newViewport.x - maxSizeX;
  newViewport.y = newViewport.y - maxSizeY;
  console.info('and now it is', newViewport);
  await image.autocrop();
  await image.write('./cached_logos/result2.png');
  console.info(newViewport);
  const newSvg = await updateViewport(svg, newViewport);
  return newSvg;
  // const fname2 = fname.replace('.svg', '2.svg');
  // fs.writeFileSync(fname2, newSvg);
}
