export interface RuiIconsPluginOptions {
  /**
   * Additional icons to always include (for dynamically used icons that can't be statically detected)
   * @example ['lu-custom-icon', 'lu-dynamic-icon']
   */
  include?: string[];

  /**
   * Glob patterns for files to scan
   * @default ['** /*.vue', '** /*.ts', '** /*.tsx'] (without spaces)
   */
  scanPatterns?: string[];

  /**
   * Strict mode - fail build on invalid icon names
   * @default false
   */
  strict?: boolean;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

export interface ScanResult {
  /** Set of detected icon names */
  icons: Set<string>;
  /** Map of invalid icons to the files they were found in */
  invalidIcons: Map<string, string[]>;
}
