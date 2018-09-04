// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import {chalkProcessing} from './chalkConfig';

/* eslint-disable no-console */


require('child_process').execSync('kill $(lsof -t -i:4000 -sTCP:LISTEN) || true');
require('child_process').execSync('kill $(lsof -t -i:4001 -sTCP:LISTEN) || true');
console.log(chalkProcessing('running a dist server on http://localhost:4000 ...'));
// Run Browsersync
const result = browserSync({
  port: 4000,
  ui: {
    port: 4001
  },
  open: false,
  server: {
    baseDir: 'dist'
  },

  files: [
    'src/*.html'
  ],

  middleware: [historyApiFallback()]
});
setTimeout(function() {
  process.exit();
}, 120 * 1000);
export default result;
