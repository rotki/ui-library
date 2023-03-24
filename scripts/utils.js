const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve(__dirname, '..', 'dist');
function loadModule(name) {
  try {
    return require(name);
  } catch {
    return undefined;
  }
}

function copy(name, version) {
  const src = path.join(dir, `v${version}`, name);
  const dest = path.join(dir, name);
  const content = fs.readFileSync(src, 'utf-8');
  try {
    fs.unlinkSync(dest);
  } catch {}
  fs.writeFileSync(dest, content, 'utf-8');
}

function switchVersion(version) {
  copy('index.es.js', version);
  copy('index.umd.js', version);
}

module.exports.loadModule = loadModule;
module.exports.switchVersion = switchVersion;
