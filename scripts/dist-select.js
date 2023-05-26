const fs = require('node:fs');
const { loadModule } = require('./utils');
const Vue = loadModule('vue');

if (!fs.existsSync('dist')) {
  return;
}

if (!Vue || typeof Vue.version !== 'string') {
  console.warn(
    '[rotki-ui] Vue is not found. Please run "pnpm install vue" to install.'
  );
} else if (Number(Vue.version) >= 3.3) {
  console.warn(`[rotki-ui] Vue version v${Vue.version} is not supported.`);
  process.exit(1);
}
