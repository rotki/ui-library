const path = require('node:path');
const fs = require('fs-extra');
const dir = path.resolve(__dirname, '..', 'dist');

function loadModule(name) {
  try {
    return require(name);
  } catch {
    return undefined;
  }
}

function copy(version, pattern) {
  const src = path.join(dir, `v${version}`);
  const dest = path.join(dir);
  try {
    fs.copySync(src, dest, pattern, err => {
      console.log('[rotki-ui] An error occurred while copying', err);
    });
  } catch {}
}

function switchVersion(version) {
  copy(version, /\*.(m?js|css)/);
}

module.exports.loadModule = loadModule;
module.exports.switchVersion = switchVersion;
