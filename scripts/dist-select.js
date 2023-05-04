const fs = require('node:fs');
const { ArgumentParser } = require('argparse');
const { isVue3, isVue2 } = require('vue-demi');
const { switchVersion, loadModule } = require('./utils');
const Vue = loadModule('vue');

if (!fs.existsSync('dist')) {
  return;
}

const parser = new ArgumentParser();
parser.add_argument('--force-version', { type: 'str' });

const args = parser.parse_args();
const { force_version } = args;

if (force_version) {
  if (force_version === '3') {
    switchVersion(3);
  } else if (force_version === '2') {
    switchVersion(2);
  } else {
    console.warn(`[rotki-ui] Vue version v${Vue.version} is not supported.`);
    process.exit(1);
  }

  return;
}

if (!Vue || typeof Vue.version !== 'string') {
  console.warn(
    '[rotki-ui] Vue is not found. Please run "pnpm install vue" to install.'
  );
} else if (isVue3) {
  switchVersion(3);
} else if (isVue2) {
  switchVersion(2);
} else {
  console.warn(`[rotki-ui] Vue version v${Vue.version} is not supported.`);
  process.exit(1);
}
