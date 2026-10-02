import type { InjectionKey } from 'vue';

/**
 * Returns the image URL for a named logo, or `undefined` to keep the bundled one.
 */
export type LogoResolver = (name: string) => string | undefined | Promise<string | undefined>;

export interface LogoOptions {
  /**
   * Resolves the `logo` prop of every `RuiLogo` to an image URL. It runs in the
   * browser after mount, never on the server. The library makes no request of
   * its own: fetching, caching and validating the URL are up to the app.
   */
  resolve: LogoResolver;
}

export const LogoSymbol: InjectionKey<LogoOptions> = Symbol.for('rui:logo');

/**
 * The logo options from `createRui`, or `undefined` when the app configured none.
 */
export function useLogoOptions(): LogoOptions | undefined {
  return inject(LogoSymbol, undefined);
}
