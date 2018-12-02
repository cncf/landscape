export function dump(content) {
  var dump = require('js-yaml').dump(content, {lineWidth: 160});
  dump = dump.replace(/(- \w+:) null/g, '$1');
  dump = dump.split("\n").filter((x) => x.indexOf('!<tag:yaml.org,2002:js/undefined>') === -1).join("\n");
  return dump;
}
