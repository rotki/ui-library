import { type ModelRef, useModel } from 'vue';

/** The event of a `modelValue` model, for a component that declares the model as a prop. */
export interface ModelValueEmits<T> {
  'update:modelValue': [value: T];
}

/**
 * The ref `defineModel` gives, for a model the component declares itself as a prop and an
 * `update:<name>` event.
 *
 * An optional `defineModel` gets an update typed `T | undefined` from the type checker, which a
 * consumer's `Ref<T>` cannot take, even when the component never sends `undefined`. Declaring the
 * prop and the event by hand types the update exactly; this then builds the same two-way ref,
 * through the `useModel` that `defineModel` compiles to. It needs the props object, which a
 * component that destructures its props does not have, so the prop is read through a getter.
 *
 * @param name - the model's prop, which the component must declare
 * @param value - reads that prop
 * @param modifiers - reads its `<name>Modifiers` prop, for a model that takes modifiers
 * @returns the model's ref, which also destructures into the ref and its modifiers
 */
export function usePropModel<T, M extends PropertyKey = string>(
  name: string,
  value: () => T | undefined,
  modifiers?: () => Partial<Record<M, true>> | undefined,
): ModelRef<T | undefined, M> {
  const props: Record<string, T | undefined> = {};
  Object.defineProperty(props, name, { get: value, enumerable: true });
  if (modifiers)
    Object.defineProperty(props, name === 'modelValue' ? 'modelModifiers' : `${name}Modifiers`, { get: modifiers, enumerable: true });

  return useModel<M, Record<string, T | undefined>, string>(props, name);
}
