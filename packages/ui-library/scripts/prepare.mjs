import { execSync } from 'node:child_process';
import process from 'node:process';
import consola from 'consola';

consola.info('Generating icons');
execSync('pnpm run generate-icons', { stdio: 'inherit' });

const env = process.env;
/*
 * INIT_CWD is where the install was invoked from. Matching PWD means a local
 * dev install, as does sitting under it, which is what an install run from a
 * project sub-folder looks like.
 */
if (env.INIT_CWD === env.PWD || env.INIT_CWD.indexOf(env.PWD) === 0) {
  consola.info('Skipping `prepare` script on local installs');
  process.exit(0);
}

consola.info('Running production build');
execSync('pnpm run build:prod', { stdio: 'inherit' });
