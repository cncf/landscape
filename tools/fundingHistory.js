function getFileFromHistory() {
  const content = require('child_process').execSync('git show master@{2018-11-28}:landscape.yml').toString('utf-8');
  console.info(content.length);
  const source = require('js-yaml').safeLoad(content);
  console.info(source);
  return source;
}

console.info(getFileFromHistory());
