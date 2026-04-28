import type { InjectionKey, MaybeRefOrGetter } from 'vue';
import type { ContextColorsType } from '@/consts/colors';

export interface RuiCheckboxGroupContext {
  isChecked: (value: unknown) => boolean;
  toggle: (value: unknown, checked: boolean) => void;
  disabled: MaybeRefOrGetter<boolean>;
  color: MaybeRefOrGetter<ContextColorsType | undefined>;
  size: MaybeRefOrGetter<'sm' | 'lg' | undefined>;
}

export const RuiCheckboxGroupContextKey: InjectionKey<RuiCheckboxGroupContext>
  = Symbol('RuiCheckboxGroupContext');
