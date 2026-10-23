import type { FormDetails } from '@/utils/form-text-detail';
import { type ComputedRef, hasInjectionContext, type InjectionKey, type MaybeRef, type MaybeRefOrGetter } from 'vue';

/**
 * Where a field shows its label.
 *
 * - `top`: a label above a bordered field (the default).
 * - `hidden`: no visible label; the label is still announced to screen readers.
 *   For search and filter fields whose placeholder and icon say what they are.
 */
export type LabelPlacement = 'top' | 'hidden';

export interface FieldOptions {
  labelPlacement: MaybeRef<LabelPlacement>;
  details: MaybeRef<FormDetails>;
}

/** What a `provideFieldDefaults` or `RuiFieldDefaults` scope sets; an unset key falls through to the scope above. */
export interface FieldScopeOptions {
  labelPlacement?: MaybeRefOrGetter<LabelPlacement | undefined>;
  details?: MaybeRefOrGetter<FormDetails | undefined>;
}

interface FieldScope {
  labelPlacement: () => LabelPlacement | undefined;
  details: () => FormDetails | undefined;
}

/** The app-wide default, set through `createRui({ defaults: { field } })`. */
export const FieldSymbol: InjectionKey<FieldOptions> = Symbol.for('rui:field');

/**
 * What 3.0 provided under the scope key: the placement itself. A 3.0 copy bundled into
 * another package still provides it, and `Symbol.for` hands it to this copy.
 */
type LegacyFieldScope = MaybeRefOrGetter<LabelPlacement | undefined>;

/**
 * A default for every field below a component, set with `provideFieldDefaults` or `RuiFieldDefaults`.
 * Every copy of the library on a page shares this key, so a change to what it holds must keep
 * reading every shape an older copy provides.
 */
const FieldScopeSymbol: InjectionKey<FieldScope | LegacyFieldScope | null> = Symbol.for('rui:field-scope');

function isFieldScope(scope: FieldScope | LegacyFieldScope): scope is FieldScope {
  return typeof scope === 'object' && !isRef(scope) && typeof scope.labelPlacement === 'function';
}

/** The nearest scope, read in either shape. */
function injectFieldScope(): FieldScope | undefined {
  const scope = inject(FieldScopeSymbol, undefined);
  if (scope === undefined || scope === null)
    return undefined;
  if (isFieldScope(scope))
    return scope;

  return {
    labelPlacement: () => toValue(scope),
    details: () => undefined,
  };
}

export function createFieldDefaults(options?: Partial<FieldOptions>): FieldOptions {
  return {
    labelPlacement: 'top',
    details: 'reserve',
    ...options,
  };
}

function isScopeOptions(
  options: FieldScopeOptions | MaybeRefOrGetter<LabelPlacement | undefined>,
): options is FieldScopeOptions {
  return typeof options === 'object' && !isRef(options);
}

/**
 * Sets defaults for every field rendered below the calling component. A key left unset
 * keeps what an enclosing scope set. Passing a placement alone is the 3.0 form.
 */
export function provideFieldDefaults(options: FieldScopeOptions | MaybeRefOrGetter<LabelPlacement | undefined>): void {
  const { labelPlacement, details } = isScopeOptions(options) ? options : { labelPlacement: options, details: undefined };
  const parent = injectFieldScope();

  provide(FieldScopeSymbol, {
    labelPlacement: () => toValue(labelPlacement) ?? parent?.labelPlacement(),
    details: () => toValue(details) ?? parent?.details(),
  });
}

/**
 * The placement a field uses: its own prop, then the nearest scope, then the
 * app default, then `top`.
 */
export function useLabelPlacement(placement: MaybeRefOrGetter<LabelPlacement | undefined>): ComputedRef<LabelPlacement> {
  const scope = injectFieldScope();
  const app = inject(FieldSymbol, undefined);

  return computed<LabelPlacement>(() =>
    toValue(placement)
    ?? scope?.labelPlacement()
    ?? (app ? toValue(app.labelPlacement) : undefined)
    ?? 'top',
  );
}

/**
 * The details mode the scope and app give a control that sets none itself: the nearest
 * scope, then the app default. `undefined` when neither sets one. Outside a component
 * setup there is nothing to inject, so it is always `undefined` there.
 */
export function useInheritedDetails(): () => FormDetails | undefined {
  if (!hasInjectionContext())
    return () => undefined;

  const scope = injectFieldScope();
  const app = inject(FieldSymbol, undefined);

  return () => scope?.details() ?? (app ? toValue(app.details) : undefined);
}
