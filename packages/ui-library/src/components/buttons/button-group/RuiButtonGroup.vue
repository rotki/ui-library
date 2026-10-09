<script lang="ts" generic="T = undefined" setup>
import type { ButtonSize } from '@/components/buttons/button/button-props';
import type { ContextColorsType } from '@/consts/colors';
import { Fragment, isVNode } from 'vue';
import { tv } from '@/utils/tv';

export interface Props {
  vertical?: boolean;
  color?: ContextColorsType;
  activeColor?: ContextColorsType;
  variant?: 'default' | 'outlined' | 'text';
  size?: ButtonSize;
  gap?: 'sm' | 'md' | 'lg';
  required?: boolean;
  disabled?: boolean;
}

defineOptions({
  name: 'RuiButtonGroup',
  inheritAttrs: false,
});

const modelValue = defineModel<T | T[]>();

const {
  vertical = false,
  color,
  activeColor,
  variant = 'default',
  size,
  gap,
  required = false,
  disabled = false,
} = defineProps<Props>();

const slots = useSlots();

const buttonGroupStyles = tv({
  slots: {
    root: 'inline-flex rounded-sm between:border-l between:border-r-0 between:border-rui-grey-400 outline-solid outline-1 outline-transparent -outline-offset-1',
    button: 'border-0 outline-0 focus:z-1',
  },
  variants: {
    vertical: {
      true: {
        root: 'flex-col items-start between:border-l-0 between:border-t between:border-b-0',
        button: 'w-full',
      },
      false: {},
    },
    gap: {
      none: {
        button: 'rounded-none!',
      },
      sm: {
        root: 'between:border-0 outline-0 gap-2',
        button: 'outline-1',
      },
      md: {
        root: 'between:border-0 outline-0 gap-4',
        button: 'outline-1',
      },
      lg: {
        root: 'between:border-0 outline-0 gap-6',
        button: 'outline-1',
      },
    },
    variant: {
      default: {},
      outlined: {
        // Material's 23% neutral edge, matching RuiButton's colourless outlined treatment
        root: 'outline-black/23 between:border-black/23 dark:outline-white/23 dark:between:border-white/23',
      },
      text: {},
    },
    color: {
      primary: {},
      secondary: {},
      error: {},
      warning: {},
      info: {},
      success: {},
    },
  },
  compoundVariants: [
    // First/last child rounding when not separated (! needed to override RuiButton's CSS module border-radius)
    { gap: 'none', vertical: false, class: { button: 'first:rounded-l! last:rounded-r!' } },
    { gap: 'none', vertical: true, class: { button: 'first:rounded-t! last:rounded-b!' } },

    // Color dividers (default variant)
    { color: 'primary', class: { root: 'between:border-rui-primary-darker' } },
    { color: 'secondary', class: { root: 'between:border-rui-secondary-darker' } },
    { color: 'error', class: { root: 'between:border-rui-error-darker' } },
    { color: 'warning', class: { root: 'between:border-rui-warning-darker' } },
    { color: 'info', class: { root: 'between:border-rui-info-darker' } },
    { color: 'success', class: { root: 'between:border-rui-success-darker' } },

    // Color dividers for outlined/text (overrides darker dividers above)
    { color: 'primary', variant: ['outlined', 'text'], class: { root: 'between:border-rui-primary/50' } },
    { color: 'secondary', variant: ['outlined', 'text'], class: { root: 'between:border-rui-secondary/50' } },
    { color: 'error', variant: ['outlined', 'text'], class: { root: 'between:border-rui-error/50' } },
    { color: 'warning', variant: ['outlined', 'text'], class: { root: 'between:border-rui-warning/50' } },
    { color: 'info', variant: ['outlined', 'text'], class: { root: 'between:border-rui-info/50' } },
    { color: 'success', variant: ['outlined', 'text'], class: { root: 'between:border-rui-success/50' } },

    // Color outline for outlined variant
    { color: 'primary', variant: 'outlined', class: { root: 'outline-rui-primary/50' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'outline-rui-secondary/50' } },
    { color: 'error', variant: 'outlined', class: { root: 'outline-rui-error/50' } },
    { color: 'warning', variant: 'outlined', class: { root: 'outline-rui-warning/50' } },
    { color: 'info', variant: 'outlined', class: { root: 'outline-rui-info/50' } },
    { color: 'success', variant: 'outlined', class: { root: 'outline-rui-success/50' } },
  ],
  defaultVariants: {
    vertical: false,
    gap: 'none',
    variant: 'default',
  },
});

const ui = computed<ReturnType<typeof buttonGroupStyles>>(() => buttonGroupStyles({
  vertical,
  gap: gap ?? 'none',
  variant,
  color,
}));

/**
 * Applies the group's state to one of its buttons: which button is active,
 * the group's disabled flag and colour, and the group's size, that last one
 * only when the button did not set a size of its own, so a consumer can still
 * size a single button.
 *
 * @param child - the button's vnode, whose props are keyed in kebab-case
 * @param index - its place in the group, which stands in for a missing value
 * @param selectedValue - what the group's model currently holds
 * @returns the same vnode, with the group's props written onto it
 */
function applyGroupProps(child: VNode, index: number, selectedValue: T | T[] | undefined): VNode {
  const value = child.props?.['model-value'];
  const active = isActive(value ?? index, selectedValue);
  const resolvedColor = active && activeColor ? activeColor : color;
  const childSize = child.props?.size;

  child.props = {
    ...child.props,
    active,
    ...(disabled && { disabled: true }),
    ...(resolvedColor && { color: resolvedColor }),
    ...(!childSize && size && { size }),
  };

  return child;
}

const children = computed<VNode[]>(() => {
  const selectedValue: T | T[] | undefined = get(modelValue);
  const slotContent = slots.default?.() ?? [];

  return flattenSlotContent(slotContent)
    .map((child, index) => applyGroupProps(child, index, selectedValue));
});

/**
 * Flattens slot content by unwrapping Fragments (created by v-for).
 * Returns only actual VNode children.
 */
function flattenSlotContent(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Fragment && Array.isArray(node.children) && node.children.length > 0)
      return flattenSlotContent(node.children.filter(isVNode));

    return [node];
  });
}

function isActive(id: T, selected?: T | T[]): boolean {
  if (Array.isArray(selected))
    return selected.includes(id);

  return selected === id;
}

function onClick(id: T): void {
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
</script>

<template>
  <div
    :class="ui.root()"
    v-bind="$attrs"
  >
    <Component
      :is="child"
      v-for="(child, i) in children"
      :key="i"
      :class="ui.button()"
      :variant="variant"
      @update:model-value="onClick($event ?? i)"
    />
  </div>
</template>
