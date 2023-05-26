function loadModule(name) {
  try {
    return require(name);
  } catch {
    return undefined;
  }
}

module.exports.loadModule = loadModule;
