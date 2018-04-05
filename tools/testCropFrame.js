import Jimp from 'jimp';
import './svgAutocrop';
import  { getViewbox, updateViewport } from './processSvg';
const { convert } = require('convert-svg-to-png');

export async function process(svg) {
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

// export async function all() {
  // const files = fs.readdirSync('hosted_logos').filter((x) => x.indexOf('.svg') !== -1).filter( (x) => x >= 'singularity');
  // await Promise.mapSeries(files, async function(name) {
    // await process('hosted_logos/' + name);
  // });
// }

// all().catch(console.info);
