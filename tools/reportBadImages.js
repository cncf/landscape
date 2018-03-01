const traverse = require('traverse');
const source = require('js-yaml').safeLoad(require('fs').readFileSync('processed_landscape.yml'));
const tree = traverse(source);
tree.map(function(node) {
  if (node && node.image_data && node.image_data.low_res) {
    console.info(`Item ${node.name} of ${node.organization} has a low resolution image: ${node.image_data.low_res}`);
    return;
  }
});
