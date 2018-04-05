import {Builder, Parser} from 'xml2js';
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
      const [ x, y, width, height ] = viewBox.split(' ').map( (x) => +x);
      // console.info(viewBox);
      return {x, y, width, height };
    }
  } catch(ex) {
    const viewBox = content.match(/viewBox="(.*?)"/)[1];
    if (viewBox) {
      const [ x, y, width, height ] = viewBox.split(' ').map( (x) => +x);
      // console.info(viewBox);
      return {x, y, width, height };
    }
  }
}

export async function updateViewport(content, {x, y, width, height}) {
  try {
    const js = await svg2js(content);
    if (!js.svg.$.viewBox) {
      // console.info('No viewbox');
      return content;
    } else {
      // console.info('building...');
      js.svg.$.viewBox = `${x} ${y} ${width} ${height}`;
      const builder = new Builder();
      return builder.buildObject(js);
    }
  } catch (ex) {
    const viewBox = content.match(/viewBox="(.*?)"/)[1];
    const newValue = `${x} ${y} ${width} ${height}`;
    if (viewBox) {
      return content.replace(/viewBox="(.*?)"/, `viewBox="${newValue}"`);
    }
  }
}

export async function autoCropSvg(svg) {
  // console.info('Processing: ', fname);
  // const svg = fs.readFileSync(fname, 'utf-8');
  const {x, y, width, height } = await getViewbox(svg);
  // console.info(x, y, width, height);
  if (x !== 0 || y !== 0) {
    console.info(`Warning - x and y are expected to be 0,0 but they are ${x} ${y}`);
  }
  const png = await convert(svg, {width, height, puppeteer: {args: ['--no-sandbox', '--disable-setuid-sandbox']}});
  const image = await Jimp.read(png);
  const viewport = image.autocropSize();
  // console.info(viewport);
  const newSvg = await updateViewport(svg, viewport);
  return newSvg;
  // const fname2 = fname.replace('.svg', '2.svg');
  // fs.writeFileSync(fname2, newSvg);
}
