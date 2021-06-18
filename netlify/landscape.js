// We will execute this script from a landscape build,
// "prepublish": "cp yarn.lock _yarn.lock",
// "postpublish": "rm _yarn.lock || true"
const LANDSCAPEAPP = process.env.LANDSCAPEAPP || "latest"
const remote = `root@${process.env.BUILD_SERVER}`;
const dockerImage = 'netlify/build:xenial';
const dockerHome = '/opt/buildhome';

const secrets = [
  process.env.CRUNCHBASE_KEY_4, process.env.TWITTER_KEYS, process.env.GITHUB_TOKEN, process.env.GITHUB_USER, process.env.GITHUB_KEY
].filter( (x) => !!x);

const  maskSecrets = function(x) {
  let result = x;
  const replaceAll = function(s, search, replacement) {
    var target = s;
    return target.split(search).join(replacement);
  };
  for (var secret of secrets) {
    const safeString = secret.substring(0, 2) + '***' + secret.substring(secret.length -2);
    result = replaceAll(result, secret, safeString);
  }
  return result;
}
for (var secret of secrets) {
  console.info(maskSecrets(`We have a secret: ${secret}`));
}
const debug = function() {
  if (process.env.DEBUG_BUILD) {
    console.info.apply(console, arguments);
  }
}

const runLocal = function(command, options = {}) {
  const { assignFn, showOutputFn } = options;

  // report the output once every 5 seconds
  let lastOutput = { s: '', time: new Date().getTime() };
  let displayIfRequired = function(text) {
    lastOutput.s = lastOutput.s + text;
    if (showOutputFn && showOutputFn()) {
      if (lastOutput.done || new Date().getTime() > lastOutput.time + 5 * 1000) {
        console.info(lastOutput.s);
        lastOutput.s = "";
        lastOutput.time = new Date().getTime();
      };
    }
  }
  return new Promise(function(resolve) {
    var spawn = require('child_process').spawn;
    var child = spawn('bash', ['-lc',`set -e \n${command}`]);
    if (assignFn) {
      assignFn(child);
    }
    let output = [];
    child.stdout.on('data', function(data) {
      const text = maskSecrets(data.toString('utf-8'));
      output.push(text);
      displayIfRequired(text);
      //Here is where the output goes
    });
    child.stderr.on('data', function(data) {
      const text = maskSecrets(data.toString('utf-8'));
      output.push(text);
      displayIfRequired(text);
      //Here is where the error output goes
    });
    child.on('close', function(exitCode) {
      lastOutput.done = true;
      displayIfRequired('');
      resolve({text: output.join(''), exitCode});
      //Here you can get the exit code of the script
    });
  });
}

const runLocalWithoutErrors = async function(command) {
  debug(command);
  const result = await runLocal(command);
  console.info(result.text);
  if (result.exitCode !== 0) {
    throw new Error(`Failed to execute ${command}, exit code: ${result.exitCode}`);
  }
  return result.text.trim();
}

let buildDone = false;
let localPid;
let remoteFailed = false;
let localFailed = false;

async function getPids() {
  const result = await runLocalWithoutErrors(`ps`);
  const lines = result.split('\n').map( (x) => x.trim()).filter( (x) => x).slice(1);
  const pids = lines.map( (line) => line.split(' ')[0]);
  console.info('pids:', pids);
  return pids;
}

let initialPids;

const makeLocalBuild = async function() {
  const localOutput = await runLocal(`
      # mkdir -p copy
      # rsync -az --exclude="copy" . copy
      # cd copy
      . ~/.nvm/nvm.sh
      npm pack interactive-landscape@${LANDSCAPEAPP}
      tar xzf interactive*
      cd package
      cp _yarn.lock yarn.lock
      nvm install \`cat .nvmrc\`
      nvm use \`cat .nvmrc\`
      npm install -g npm --no-progress
      npm install -g yarn@latest
      ~/.nvm/versions/node/\`cat .nvmrc\`/bin/yarn >/dev/null
      export NODE_OPTIONS="--unhandled-rejections=strict"
      export JEST_OPTIONS="-i"
      export USE_OLD_PUPPETEER=1
      PROJECT_PATH=.. ~/.nvm/versions/node/\`cat .nvmrc\`/bin/yarn build
    `, { assignFn: (x) => localPid = x, showOutputFn: () => remoteFailed });

  if (!buildDone) {
    console.info('Local build finished, exit code:', localOutput.exitCode);
    if (localOutput.exitCode !== 0) {
      console.info(localOutput.text);
      localFailed = true;
      if (!remoteFailed) {
        return;
      } else {
        process.exit(1);
      }
    }
    buildDone = true;
    await runLocalWithoutErrors(`
          rm -rf netlify/dist || true
          cp -r dist netlify
          mv netlify/dist/functions netlify/functions
        `);
    process.exit(0);
  } else {
    console.info('Ignore local build');
  }
}
const key = `
-----BEGIN OPENSSH PRIVATE KEY-----
${(process.env.BUILDBOT_KEY || '').replace(/\s/g,'\n')}
-----END OPENSSH PRIVATE KEY-----
  `.split('\n').slice(1).join('\n');
require('fs').writeFileSync('/tmp/buildbot', key);
require('fs').chmodSync('/tmp/buildbot', 0o600);

const runRemote = async function(command, options) {
  const bashCommand = `
    nocheck=" -o StrictHostKeyChecking=no "
    ssh -i /tmp/buildbot $nocheck ${remote} << 'EOSSH'
    set -e
    ${command}
EOSSH
`
  return await runLocal(bashCommand, options);
};
const runRemoteWithoutErrors = async function(command) {
  const result = await runRemote(command);
  console.info(result.text.trim());
  if (result.exitCode !== 0) {
    throw new Error(`Failed to execute remote ${command}, exit code: ${result.exitCode}`);
  }
}

const makeRemoteBuildWithCache = async function() {
  await runLocalWithoutErrors(`
    echo extracting
    mkdir tmpRemote
    cd tmpRemote
    rm -rf package || true
    npm pack interactive-landscape@${LANDSCAPEAPP}
    tar xzf interactive*.tgz
    cd ..
    mv tmpRemote/package packageRemote
    cp packageRemote/_yarn.lock packageRemote/yarn.lock
  `);

  //how to get a hash based on our files
  const getHash = function() {
    const crypto = require('crypto');
    const p0 = require('fs').readFileSync('packageRemote/.nvmrc', 'utf-8').trim();
    const p1 = crypto.createHash('sha256').update(require('fs').readFileSync('packageRemote/package.json')).digest('hex');
    const p2 = crypto.createHash('sha256').update(require('fs').readFileSync('packageRemote/yarn.lock')).digest('hex');
    const p3 = crypto.createHash('sha256').update(require('fs').readFileSync('packageRemote/.yarnrc.yml')).digest('hex');
    return p0 + p1 + p2 + p3;
  }

  const getTmpFile = () => new Date().getTime().toString() + Math.random();
  const nvmrc = require('fs').readFileSync('packageRemote/.nvmrc', 'utf-8').trim();
  console.info(`node version:`, nvmrc);
  // now our goal is to run this on a remote server. Step 1 - xcopy the repo
  const folder = getTmpFile();

  await runLocalWithoutErrors(`
      rm -rf remoteDist || true
      mkdir -p remoteDist
    `);
  await runRemoteWithoutErrors(`mkdir -p /root/builds`);
  await runRemoteWithoutErrors(`docker pull ${dockerImage}`);
  await runLocalWithoutErrors(`
      rsync --exclude="package" -az -e  "ssh -i /tmp/buildbot  -o StrictHostKeyChecking=no  " . ${remote}:/root/builds/${folder}
    `);
  await runRemoteWithoutErrors(`chmod -R 777 /root/builds/${folder}`);

  const hash = getHash();
  const tmpHash = require('crypto').createHash('sha256').update(getTmpFile()).digest('hex');
  // lets guarantee npm install for this folder first
  {
    const buildCommand = [
      "(ls . ~/.nvm/nvm.sh || (curl -s -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash >/dev/null))",
      ". ~/.nvm/nvm.sh",
      `nvm install ${nvmrc}`,
      `nvm use ${nvmrc}`,
      `npm install -g npm --no-progress`,
      `npm install -g yarn@latest`,
      `cd /opt/repo/packageRemote`,
      `yarn >/dev/null`
    ].join(' && ');
    const npmInstallCommand = `
      mkdir -p /root/builds/node_cache
      ls -l /root/builds/node_cache/${hash}/yarnLocal/unplugged 2>/dev/null || (
          mkdir -p /root/builds/node_cache/${tmpHash}/{yarnLocal,nvm,yarnGlobal}
          cp -r /root/builds/${folder}/packageRemote/.yarn/* /root/builds/node_cache/${tmpHash}/yarnLocal
          chmod -R 777 /root/builds/node_cache/${tmpHash}
          docker run --shm-size 1G --rm -t \
            -v /root/builds/node_cache/${tmpHash}/yarnLocal:/opt/repo/packageRemote/.yarn \
            -v /root/builds/node_cache/${tmpHash}/nvm:${dockerHome}/.nvm \
            -v /root/builds/node_cache/${tmpHash}/yarnGlobal:${dockerHome}/.yarn \
            -v /root/builds/${folder}:/opt/repo \
            ${dockerImage} /bin/bash -lc "${buildCommand}"

          ln -s /root/builds/node_cache/${tmpHash} /root/builds/node_cache/${hash} || (
            rm -rf /root/builds/node_cache/${tmpHash}
          )
          echo "packages for ${hash} had been installed"
      )
      chmod -R 777 /root/builds/node_cache/${hash}
    `;
    debug(npmInstallCommand);
    console.info(`Remote with cache: Installing npm packages if required`);
    const output = await runRemote(npmInstallCommand);
    console.info(`Remote with cache: Output from npm install: exit code: ${output.exitCode}`);
    if (output.exitCode !== 0) {
      console.info(output.text);
      throw new Error('Remote with cahce: npm install failed');
    }

    const lines = output.text.split('\n');
    const index = lines.indexOf(lines.filter( (line) => line.match(/added \d+ packages in/))[0]);
    const filteredLines = lines.slice(index !== -1 ? index : 0).join('\n');
    console.info(filteredLines || 'Reusing an existing folder for node');

  }

  // do not pass REVIEW_ID because on failure we will run it locally and report
  // from there
  const vars = [
    'CRUNCHBASE_KEY_4',
    'GITHUB_KEY',
    'TWITTER_KEYS',
    'GA',
    'BRANCH',
    'GITHUB_TOKEN',
    'GITHUB_USER',
    'REPOSITORY_URL'
  ];
  const outputFolder = 'landscape' + getTmpFile();
  const buildCommand = [
    `cd /opt/repo/packageRemote`,
    `. ~/.nvm/nvm.sh`,
    `nvm install ${nvmrc}`,
    `nvm use ${nvmrc}`,
    `yarn`,
    `export NODE_OPTIONS="--unhandled-rejections=strict"`,
    `PROJECT_PATH=.. yarn run build`,
    `cp -r /opt/repo/dist /dist`
  ].join(' && ');

  const dockerCommand = `
      mkdir -p /root/builds/${outputFolder}
      chmod -R 777 /root/builds/${outputFolder}
      chmod -R 777 /root/builds/${folder}
      chmod -R 777 /root/builds/node_cache/${hash}

      docker run --shm-size 1G --rm -t \
        ${vars.map( (v) => ` -e ${v}="${process.env[v]}" `).join(' ')} \
        -e NVM_NO_PROGRESS=1 \
        -e NETLIFY=1 \
        -e PARALLEL=TRUE \
        -v /root/builds/node_cache/${hash}/yarnLocal:/opt/repo/packageRemote/.yarn \
        -v /root/builds/node_cache/${hash}/nvm:${dockerHome}/.nvm \
        -v /root/builds/node_cache/${hash}/yarnGlobal:${dockerHome}/.yarn \
        -v /root/builds/${folder}:/opt/repo \
        -v /root/builds/${outputFolder}:/dist \
        ${dockerImage} /bin/bash -lc "${buildCommand}"

    `;

  debug(dockerCommand);

  // run a build command remotely for a given repo
  let output;
  output  = await runRemote(dockerCommand);
  console.info(`Output from remote build, exit code: ${output.exitCode}`);
  if (output.exitCode === 255) { // a single ssh failure
    console.info('SSH failure! Retrying ...');
    output  = await runRemote(dockerCommand);
    console.info(`Output from remote build, exit code: ${output.exitCode}`);
  } else if (output.exitCode !== 0) {
    console.info(output.text);
    throw new Error('Remote build failed');
    // console.info('Retrying with reinstalling npm');
    // output  = await runRemote(dockerCommandWithNpmInstall);
    // console.info(`Output from remote build, exit code: ${output.exitCode}`);
  }
  console.info(output.text);
  // a build is done
  console.info(await runLocalWithoutErrors(
    `
      mkdir -p distRemote
      rsync -az --chmod=a+r -p -e "ssh -i /tmp/buildbot  -o StrictHostKeyChecking=no " ${remote}:/root/builds/${outputFolder}/dist/* distRemote
    `
  ));
  await runRemoteWithoutErrors(
    `
      rm -rf /root/builds/${folder}
      rm -rf /root/builds/${outputFolder}
      `
  )
  if (!buildDone) {
    buildDone = true;
    const newPids = await getPids();
    const pidsToKill = newPids.filter( (x) => !initialPids.includes(x));
    console.info(await runLocal(`kill -9 ${pidsToKill.join(' ')}`));

    localPid.kill();

    const pause = function(i) {
      return new Promise(function(resolve) {
        setTimeout(resolve, 5 * 1000);
      })
    };
    await pause(); // allow the previous process to be killed
    await runLocalWithoutErrors(`ps`);

    console.info('Remote build done!');
    console.info(output.text);
    await runLocalWithoutErrors(`
      pwd
      rm -rf netlify/dist || true
      mkdir -p netlify/dist
      cp -r distRemote/* netlify/dist
      ls -al distRemote
      mv netlify/dist/functions netlify/functions
    `);
    process.exit(0);
  }
}

async function main() {
  const path = require('path');
  console.info('starting', process.cwd());
  process.chdir('..');
  await runLocal('rm package*.json');

  initialPids = await getPids();

  const cleanPromise = runRemoteWithoutErrors(`
    find builds/node_cache -maxdepth 1 -mtime +1 -exec rm -rf {} +;
    find builds/ -maxdepth 1 -not -path "builds/node_cache" -mtime +1 -exec rm -rf {} +;
  `).catch(function(ex) {
    console.info('Failed to clean up a builds folder');
  });

  await Promise.all([makeRemoteBuildWithCache().catch(function(ex) {
    console.info('Remote build failed! Continuing with a local build', ex);
    remoteFailed = true;
    if (localFailed) {
      process.exit(1);
    }
  }), makeLocalBuild(), cleanPromise]);

}

main().catch(function(ex) {
  console.info(ex);
  process.exit(1);
});

