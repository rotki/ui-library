/**
 * What a select sends when it is cleared, on top of its value: `TClear` (the `valueOnClear`, or
 * `undefined` without one) when `clearable` may be on, nothing when it is off. A multiple select
 * clears to an empty list, which its value type already holds.
 *
 * `TClearable` distributes, so a `:clearable` bound to a `boolean` counts as clearable.
 *
 * A wrapper that forwards `clearable` and `valueOnClear` types its update with this, and declares its
 * own `clearable` as `TClearable & boolean`: a bare type parameter leaves the prop without a `Boolean`
 * runtime type, so a bare `clearable` attribute arrives as `''` and the field is not clearable.
 */
export type ClearedValue<TValue, TClear, TClearable extends boolean> = [TValue] extends [readonly unknown[]]
  ? never
  : TClearable extends true ? TClear : never;
