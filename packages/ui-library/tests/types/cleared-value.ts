/*
 * Checked by `vue-tsc -p tsconfig.strict-templates.json`, never run. A wrapper around a select types
 * its update with `ClearedValue`, taken from the package entry.
 */
import type { ClearedValue } from '@/index';

export const notClearable: string | ClearedValue<string, undefined, false> = 'one';

// @ts-expect-error a select that is not clearable never sends undefined
export const notClearableUndefined: string | ClearedValue<string, undefined, false> = undefined;

export const clearable: string | ClearedValue<string, undefined, true> = undefined;

export const maybeClearable: string | ClearedValue<string, undefined, boolean> = undefined;

export const clearsToEmpty: string | ClearedValue<string, '', true> = '';

// @ts-expect-error a multiple select clears to an empty list, never undefined
export const multiple: string[] | ClearedValue<string[], undefined, true> = undefined;
