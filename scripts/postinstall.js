const { spawn } = require('node:child_process');

const env = process.env;
if (
  // if INIT_CWD (yarn/npm/pnpm install invocation path) and PWD
  // are the same, then local (dev) install/add is taking place
  env.INIT_CWD === env.PWD ||
  // local (dev) yarn install may have been run
  // from a project subfolder
  env.INIT_CWD.indexOf(env.PWD) === 0
) {
  console.info('Skipping `postinstall` script on local installs');
  process.exit(0);
}

const prodBuild = spawn('pnpm', ['build:prod'], {
  stdio: [process.stdout, process.stderr],
});

prodBuild.on('close', (code) => {
  if (code !== 0) {
    console.error('[rotki-ui] build:prod failed');
    process.exit(code);
  }
});
