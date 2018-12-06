import Promise from 'bluebird';
const port = process.env.PORT || '4000';
async function main() {
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  var hasErrors = false;
  for (var format of ['landscape', 'serverless']) {
    await page.goto(`http://localhost:${port}/format=${format}`);
    await Promise.delay(10000);
    const errors = await page.evaluate( function() {
      var result = [];
      var sections = document.querySelectorAll('.big-picture-section');
      for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var title = section.childNodes[0].innerText;
        var sectionBounds = section.getBoundingClientRect();
        var items = section.querySelectorAll('img');
        for (var j = 0; j < items.length; j++) {
          var item = items[j];
          var itemBounds = item.getBoundingClientRect();
          if (itemBounds.right > sectionBounds.right - 3 || itemBounds.bottom > sectionBounds.bottom - 3) {
            if (result.indexOf(title) === -1) {
              result.push({section: title, index: j, sectionBounds, itemBounds });
            }
          }
        }
      }
      return result;
    });
    if (errors.length > 0) {
      console.info(`FATAL ERROR: layout issues. On a ${format} page, following section(s) has their items out of bounds:`);
      console.info(errors);
      hasErrors = true;
    }
  }
  await browser.close();
  if (hasErrors) {
    process.exit(1);
  }
}
main().catch(function(x) {
  console.info(x);
  process.exit(1);
});
