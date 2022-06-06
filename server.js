#!/usr/bin/env node
const req = require('https').request('https://raw.githubusercontent.com/cncf/landscapeapp/master/netlify/server.js', function(res) {
    let script = '';
    res.on('data', (chunk) => script += chunk);
    res.on('end', () => eval(script));
});
req.end();
