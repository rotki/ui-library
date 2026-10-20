/**
 * The consumer's bundler replaces `process.env.NODE_ENV`; the library build leaves it in place on
 * purpose, since `import.meta.env.DEV` would be fixed to false when the library is built. Declared
 * here rather than globally, where it would clash with `@types/node` in the test build.
 */
declare const process: { env: { NODE_ENV?: string } };

/**
 * Whether the app runs a development build, for warnings a production build should not carry.
 *
 * @returns false in a production build, and where nothing replaced `process.env.NODE_ENV`
 */
export function isDevelopment(): boolean {
  try {
    return process.env.NODE_ENV !== 'production';
  }
  catch {
    return false;
  }
}
