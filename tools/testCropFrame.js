import fs from 'fs';
import  { autoCropSvg } from './processSvg';
async function testFile() {
  var fName = './cached_logos/deep-framework.svg';
  const svg = fs.readFileSync(fName, 'utf-8');
  const processedSvg = await autoCropSvg(svg);
  require('fs').writeFileSync('cached_logos/result.svg', processedSvg);
}

testFile();
