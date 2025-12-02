import type { ScanResult } from './types';

/**
 * Regex patterns to detect icon usage in source files
 */
const ICON_PATTERNS: RegExp[] = [
  // Static name attribute: <RuiIcon name="lu-star" /> or name='lu-star'
  /\bname=["'](lu-[\da-z-]+)["']/gi,

  // Dynamic bound name with string literal: :name="'lu-star'" or :name="`lu-star`"
  /:name=["']['`](lu-[\da-z-]+)['`]?["']/gi,

  // String literals that look like icon names: 'lu-star' or "lu-star"
  /["'`](lu-[\da-z-]+)["'`]/gi,
];

/**
 * Extracts all potential icon names from source code
 */
export function extractIconsFromSource(source: string): Set<string> {
  const icons = new Set<string>();

  for (const pattern of ICON_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;

    let match: RegExpExecArray | null = pattern.exec(source);
    while (match !== null) {
      const iconName = match[1];
      if (iconName) {
        icons.add(iconName);
      }
      match = pattern.exec(source);
    }
  }

  return icons;
}

/**
 * Validates detected icons against known valid icons
 */
export function validateIcons(
  detectedIcons: Set<string>,
  validIcons: Set<string>,
  filePath: string,
  result: ScanResult,
): void {
  for (const icon of detectedIcons) {
    if (validIcons.has(icon)) {
      result.icons.add(icon);
    }
    else {
      // Track invalid icons
      const files = result.invalidIcons.get(icon) || [];
      files.push(filePath);
      result.invalidIcons.set(icon, files);
    }
  }
}

/**
 * Converts icon name to export constant name
 * e.g., 'lu-arrow-down' -> 'LuArrowDown'
 */
export function iconNameToExportName(iconName: string): string {
  return iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Generates the virtual module content with detected icons
 */
export function generateVirtualModule(icons: Set<string>): string {
  if (icons.size === 0) {
    return `// No icons detected
export default [];
`;
  }

  const sortedIcons = [...icons].sort();
  const exports = sortedIcons.map(iconNameToExportName);

  const importStatement = `import {\n  ${exports.join(',\n  ')},\n} from '@rotki/ui-library';\n`;
  const exportStatement = `\nexport default [\n  ${exports.join(',\n  ')},\n];\n`;

  return importStatement + exportStatement;
}
