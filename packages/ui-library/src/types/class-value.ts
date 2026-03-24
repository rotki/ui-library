/**
 * Type for Vue's `:class` binding values.
 * Matches what Vue's `normalizeClass()` accepts at runtime.
 */
export type VueClassValue =
  | string
  | Record<string, boolean | undefined>
  | (string | Record<string, boolean | undefined>)[];
