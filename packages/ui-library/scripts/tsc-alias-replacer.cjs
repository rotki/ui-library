const consola = require('consola');

/**
 * Handles tsc-alias failing to remove aliases properly from specific files.
 *
 * @param importInfo - the import and the file it comes from
 * @returns the new import
 */
module.exports.default = ({ orig, _file }) => {
  const prefix = 'from \'';
  if (orig.startsWith(`from '@/`)) {
    const importPath = orig.slice(orig.indexOf(prefix) + prefix.length, -1);
    const targetPath = importPath.replace('@/', '../');
    consola.warn(`found non-properly aliased import ${importPath}, replacing with ${targetPath}`);
    return `from '${targetPath}'`;
  }
  return orig;
};
