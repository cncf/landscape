import fs from 'fs';
import  { autoCropSvg } from './processSvg';
async function testFile() {
  process.env.DEBUG_SVG=true;
  var fName = './hosted_logos/scipy.svg';
  const svg = fs.readFileSync(fName, 'utf-8');
  const processedSvg = await autoCropSvg(svg);
  require('fs').writeFileSync('/tmp/result.svg', processedSvg);
}

testFile();
