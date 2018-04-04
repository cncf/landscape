import Jimp from 'jimp';
import './svgAutocrop';
const { convert } = require('convert-svg-to-png');

async function main() {
  const fname = 'hosted_logos/apex.svg';
  const png = await convert(require('fs').readFileSync(fname, 'utf-8'), {width: 360, height: 122});
  const image = await Jimp.read(png);
  console.info(image);
  const viewport = image.autocropSize();
  console.info(viewport);


}
main().catch(console.info);
