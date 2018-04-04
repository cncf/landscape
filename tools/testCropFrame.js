import Jimp from 'jimp';
import './svgAutocrop';

async function main() {
  const fname = 'hosted_logos/anchore.png';
  const image = await Jimp.read(fname);
  console.info(image);
  const viewport = image.autocropSize();
  console.info(viewport);


}
main().catch(console.info);
