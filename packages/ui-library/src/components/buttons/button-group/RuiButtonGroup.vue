<script lang="ts" generic="T = undefined" setup>
import type { HTMLAttributes, Ref } from 'vue';
import type { ButtonSize } from '@/components/buttons/button/button-props';
import type { ContextColorsType } from '@/consts/colors';
import { type ButtonGroupContext, ButtonGroupKey } from '@/components/buttons/button-group/button-group-context';
import { type ModelValueEmits, usePropModel } from '@/composables/prop-model';
import { cn } from '@/utils/tv';
import { buttonGroupStyles } from './button-group-styles';

export interface Props {
  vertical?: boolean;
  color?: ContextColorsType;
  activeColor?: ContextColorsType;
  /**
   * `segmented` draws the options as `RuiTabs variant="segmented"` does: a neutral track whose active
   * option is a raised surface. It is neutral, so it ignores `color` and `activeColor`.
   */
  variant?: 'default' | 'outlined' | 'text' | 'segmented';
  size?: ButtonSize;
  gap?: 'sm' | 'md' | 'lg';
  required?: boolean;
  disabled?: boolean;
}

defineOptions({
  name: 'RuiButtonGroup',
  inheritAttrs: false,
});

const {
  vertical = false,
  color,
  activeColor,
  variant = 'default',
  size,
  gap,
  required = false,
  disabled = false,
  modelValue: modelValueProp,
} = defineProps<Props & {
  /**
   * The pressed button's value, or the pressed values in an array for a multiple select. `T` is the
   * bound value's type, so a `Ref<number[]>` takes the update as is. A single select that is not
   * `required` sets it to `undefined` when its button is pressed again: bind a type that allows it.
   */
  modelValue?: T;
} & /* @vue-ignore */ Omit<HTMLAttributes, keyof Props>>();

defineEmits<ModelValueEmits<T>>();

defineSlots<{
  default?: () => any;
}>();

/*
 * A prop and an event rather than `defineModel`, so the update is typed without `undefined` in the
 * modes that never send it. The buttons' values are their own generic, so the group handles the
 * model as values of unknown type.
 */
const modelValue: Ref<unknown> = usePropModel('modelValue', () => modelValueProp);

const ui = computed<ReturnType<typeof buttonGroupStyles>>(() => buttonGroupStyles({
  vertical,
  gap: gap ?? 'none',
  variant,
  color,
}));

/**
 * The color a button takes: the pressed one's `activeColor` when set, otherwise the group's. The
 * segmented variant is neutral, like the segmented tabs, so its buttons take none.
 *
 * @param active - whether the button is the pressed one
 * @returns the color to set, or undefined to leave the button grey
 */
function buttonColor(active: boolean): ContextColorsType | undefined {
  if (variant === 'segmented')
    return undefined;
  return active && activeColor ? activeColor : color;
}

function isActive(id: unknown, selected: unknown): boolean {
  if (Array.isArray(selected))
    return selected.includes(id);

  return selected === id;
}

function onClick(id: unknown): void {
  const selected = get(modelValue);

  if (Array.isArray(selected)) {
    const index = selected.indexOf(id);
    if (index >= 0) {
      if (required && selected.length === 1)
        return;

      set(modelValue, selected.filter((_, i) => i !== index));
    }
    else {
      set(modelValue, [...selected, id]);
    }
  }
  else if (required) {
    set(modelValue, id);
  }
  else {
    set(modelValue, isActive(id, selected) ? undefined : id);
  }
}

// a button that sets its own size keeps it; the rest take the group's
provide(ButtonGroupKey, {
  variant: () => variant === 'segmented' ? 'text' : variant,
  size: () => size,
  disabled: () => disabled,
  color: buttonColor,
  itemClass: () => get(ui).button(),
  isActive: (value: unknown) => isActive(value, get(modelValue)),
  toggle: onClick,
} satisfies ButtonGroupContext<unknown>);
</script>

<template>
  <div
    :class="ui.root({ class: cn($attrs.class) })"
    data-button-group
    v-bind="{ ...$attrs, class: undefined }"
  >
    <slot />
  </div>
</template>
