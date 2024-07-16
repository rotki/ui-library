const consola = require('consola');

/**
 * Handles tsc-alias failing to remove aliases properly from specific files.
 *
 * @param orig the import
 * @param _file the file where the import comes from
 * @returns {*|string} the new import
 */
module.exports.default = ({ orig, _file }) => {
  if (orig.startsWith(`from '@/`)) {
    const importPath = orig.split('from \'')[1].slice(0, -1);
    const targetPath = importPath.replace('@/', '../');
    consola.warn(`found non-properly aliased import ${importPath}, replacing with ${targetPath}`);
    return `from '${targetPath}'`;
  }
  return orig;
};
