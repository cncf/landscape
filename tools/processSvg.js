import {Builder, Parser} from 'xml2js';

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
