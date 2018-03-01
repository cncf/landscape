import {spawn} from 'child_process';

const requiresHarmonyFlag = parseInt(/^v(\d+)\./.exec(process.version)[1], 10) < 7;
const harmonyProxies = requiresHarmonyFlag ? ['--harmony_proxies'] : [];
const args = [
  ...harmonyProxies,
  'node_modules/jest/bin/jest',
  // First two args are always node and the script running, i.e. ['node', './tools/testCi.js', ...]
  ...process.argv.slice(2)
];

const testCi = spawn('node', args);
const consoleLogger = data => console.log(`${data}`); // eslint-disable-line no-console

testCi.stdout.on('data', consoleLogger);
testCi.stderr.on('data', consoleLogger);
