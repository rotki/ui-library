import { execSync } from 'node:child_process';
import process from 'node:process';
import consola from 'consola';

consola.info('Generating icons');
execSync('pnpm run generate-icons');

const env = process.env;
if (
  // if INIT_CWD (yarn/npm/pnpm install invocation path) and PWD
  // are the same, then local (dev) install/add is taking place
  env.INIT_CWD === env.PWD
  // local (dev) yarn install may have been run
  // from a project sub-folder
  || env.INIT_CWD.indexOf(env.PWD) === 0
) {
  consola.info('Skipping `prepare` script on local installs');
  process.exit(0);
}

consola.info('Running production build');
execSync('pnpm run build:prod');
