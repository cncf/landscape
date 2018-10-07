// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback';
import {chalkProcessing} from './chalkConfig';

/* eslint-disable no-console */


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
require('fs').writeFileSync('/tmp/ci.pid', process.pid);
export default result;
