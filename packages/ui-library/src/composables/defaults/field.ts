import type { ComputedRef, InjectionKey, MaybeRef, MaybeRefOrGetter } from 'vue';

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
}

/** The app-wide default, set through `createRui({ defaults: { field } })`. */
export const FieldSymbol: InjectionKey<FieldOptions> = Symbol.for('rui:field');

/** A default for every field below a component, set with `provideFieldDefaults` or `RuiFieldDefaults`. */
const FieldScopeSymbol: InjectionKey<MaybeRefOrGetter<LabelPlacement | undefined>> = Symbol.for('rui:field-scope');

export function createFieldDefaults(options?: Partial<FieldOptions>): FieldOptions {
  return {
    labelPlacement: 'top',
    ...options,
  };
}

/** Sets the label placement for every field rendered below the calling component. */
export function provideFieldDefaults(labelPlacement: MaybeRefOrGetter<LabelPlacement | undefined>): void {
  provide(FieldScopeSymbol, labelPlacement);
}

/**
 * The placement a field uses: its own prop, then the nearest scope, then the
 * app default, then `top`.
 */
export function useLabelPlacement(placement: MaybeRefOrGetter<LabelPlacement | undefined>): ComputedRef<LabelPlacement> {
  const scope = inject(FieldScopeSymbol, undefined);
  const app = inject(FieldSymbol, undefined);

  return computed<LabelPlacement>(() =>
    toValue(placement)
    ?? toValue(scope)
    ?? (app ? toValue(app.labelPlacement) : undefined)
    ?? 'top',
  );
}
