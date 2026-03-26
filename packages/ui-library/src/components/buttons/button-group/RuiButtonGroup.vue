<script lang="ts" generic="T = undefined" setup>
import type { ContextColorsType } from '@/consts/colors';
import { Fragment, isVNode } from 'vue';
import { tv } from '@/utils/tv';

export interface Props {
  vertical?: boolean;
  color?: ContextColorsType;
  activeColor?: ContextColorsType;
  variant?: 'default' | 'outlined' | 'text';
  size?: 'sm' | 'lg';
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
    root: 'inline-flex rounded divide-x divide-rui-grey-400 outline outline-1 outline-transparent outline-offset-[-1px]',
    button: 'border-0 outline-0 focus:z-[1]',
  },
  variants: {
    vertical: {
      true: {
        root: 'flex-col items-start divide-x-0 divide-y',
        button: 'w-full',
      },
      false: {},
    },
    gap: {
      none: {
        button: '!rounded-none',
      },
      sm: {
        root: 'divide-x-0 divide-y-0 outline-0 gap-2',
        button: 'outline-1',
      },
      md: {
        root: 'divide-x-0 divide-y-0 outline-0 gap-4',
        button: 'outline-1',
      },
      lg: {
        root: 'divide-x-0 divide-y-0 outline-0 gap-6',
        button: 'outline-1',
      },
    },
    variant: {
      default: {},
      outlined: {
        root: 'outline-rui-text divide-rui-text',
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
    { gap: 'none', vertical: false, class: { button: 'first:!rounded-l last:!rounded-r' } },
    { gap: 'none', vertical: true, class: { button: 'first:!rounded-t last:!rounded-b' } },

    // Color dividers (default variant)
    { color: 'primary', class: { root: 'divide-rui-primary-darker' } },
    { color: 'secondary', class: { root: 'divide-rui-secondary-darker' } },
    { color: 'error', class: { root: 'divide-rui-error-darker' } },
    { color: 'warning', class: { root: 'divide-rui-warning-darker' } },
    { color: 'info', class: { root: 'divide-rui-info-darker' } },
    { color: 'success', class: { root: 'divide-rui-success-darker' } },

    // Color dividers for outlined/text (overrides darker dividers above)
    { color: 'primary', variant: ['outlined', 'text'], class: { root: 'divide-rui-primary/[0.5]' } },
    { color: 'secondary', variant: ['outlined', 'text'], class: { root: 'divide-rui-secondary/[0.5]' } },
    { color: 'error', variant: ['outlined', 'text'], class: { root: 'divide-rui-error/[0.5]' } },
    { color: 'warning', variant: ['outlined', 'text'], class: { root: 'divide-rui-warning/[0.5]' } },
    { color: 'info', variant: ['outlined', 'text'], class: { root: 'divide-rui-info/[0.5]' } },
    { color: 'success', variant: ['outlined', 'text'], class: { root: 'divide-rui-success/[0.5]' } },

    // Color outline for outlined variant
    { color: 'primary', variant: 'outlined', class: { root: 'outline-rui-primary/[0.5]' } },
    { color: 'secondary', variant: 'outlined', class: { root: 'outline-rui-secondary/[0.5]' } },
    { color: 'error', variant: 'outlined', class: { root: 'outline-rui-error/[0.5]' } },
    { color: 'warning', variant: 'outlined', class: { root: 'outline-rui-warning/[0.5]' } },
    { color: 'info', variant: 'outlined', class: { root: 'outline-rui-info/[0.5]' } },
    { color: 'success', variant: 'outlined', class: { root: 'outline-rui-success/[0.5]' } },
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

const children = computed<VNode[]>(() => {
  const selectedValue: T | T[] | undefined = get(modelValue);
  const slotContent = slots.default?.() ?? [];
  const resolved = flattenSlotContent(slotContent);

  return resolved.map((child, i) => {
    // child props are in kebab-case
    const value = child.props?.['model-value'];
    const active = isActive(value ?? i, selectedValue);
    const resolvedColor = active && activeColor ? activeColor : color;

    child.props = {
      ...child.props,
      active,
      ...(disabled && { disabled: true }),
      ...(resolvedColor && { color: resolvedColor }),
    };

    return child;
  });
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
      :size="size"
      :variant="variant"
      @update:model-value="onClick($event ?? i)"
    />
  </div>
</template>
