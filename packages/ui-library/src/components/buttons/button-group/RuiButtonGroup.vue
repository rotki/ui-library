<script lang="ts" generic="T = undefined" setup>
import type { ContextColorsType } from '@/consts/colors';
import { Fragment, isVNode } from 'vue';

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

const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  color: undefined,
  activeColor: undefined,
  variant: 'default',
  size: undefined,
  gap: undefined,
  required: false,
  disabled: false,
});

const slots = useSlots();
const { required, disabled, color, variant, size } = toRefs(props);

// When using dynamic content with v-for the slot content can contain fragment,
// Go through the fragment and always return RuiButton only
function getChildren(children: VNode[]): VNode[] {
  return children.flatMap((item) => {
    if (item.type === Fragment && Array.isArray(item.children) && item.children.length > 0)
      return getChildren(item.children.filter(isVNode));

    return [item];
  }).flat();
}

const children = computed(() => {
  // if group is disabled, disable child buttons
  const isDisabled = get(disabled);
  const rootColor = get(color);
  const selectedValue: T | T[] | undefined = get(modelValue);

  const slotContent = slots.default?.() ?? [];

  // When using dynamic content with v-for the slot content is a single fragment
  // containing the children components.
  const children = getChildren(slotContent);

  return children.map((child, i) => {
    // child props are in kebab-case it seems
    const value = child.props?.['model-value'];

    child.props = {
      ...child.props,
      active: activeItem(value ?? i, selectedValue),
    };

    if (isDisabled)
      child.props.disabled = true;

    // if given root color, use it
    if (rootColor)
      child.props.color = rootColor;

    if (child.props.active && props.activeColor)
      child.props.color = props.activeColor;

    return child;
  });
});

function activeItem(id: T, selected?: T | T[]) {
  if (Array.isArray(selected))
    return selected.includes(id);

  return selected === id;
}

function onClick(id: T) {
  const selected = get(modelValue);
  const mandatory = get(required);
  if (Array.isArray(selected)) {
    const index = selected.indexOf(id);
    if (index >= 0) {
      if (!mandatory || selected.length !== 1)
        set(modelValue, selected.filter((_, i) => i !== index));
      else
        set(modelValue, [...selected]);
    }
    else {
      set(modelValue, [...selected, id]);
    }
  }
  else if (mandatory) {
    set(modelValue, id);
  }
  else {
    set(modelValue, activeItem(id, selected) ? undefined : id);
  }
}

const css = useCssModule();
const colorClass = computed(() => (props.color ? css[props.color] : undefined));
const variantClass = computed(() =>
  props.variant ? css[props.variant] : undefined,
);
</script>

<template>
  <div
    :class="[
      css.wrapper,
      colorClass,
      variantClass,
      {
        [css.wrapper__vertical ?? '']: vertical,
        [css.wrapper__horizontal ?? '']: !vertical,
        [css.separated ?? '']: !!gap,
        [css[`separated__${gap}`] ?? '']: !!gap,
      },
    ]"
    v-bind="$attrs"
  >
    <Component
      :is="child"
      v-for="(child, i) in children"
      :key="i"
      :class="css.button"
      :size="size"
      :variant="variant"
      @update:model-value="onClick($event ?? i)"
    />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.wrapper {
  @apply inline-flex rounded divide-x divide-rui-grey-400;
  @apply outline outline-1 outline-transparent outline-offset-[-1px];

  &:not(.separated) {
    .button {
      @apply rounded-none;
    }
  }

  &__vertical {
    @apply inline-flex flex-col items-start divide-x-0 divide-y;

    .button {
      @apply w-full;
    }

    &:not(.separated) .button {
      &:first-child {
        @apply rounded-t;
      }

      &:last-child {
        @apply rounded-b;
      }
    }
  }

  &__horizontal {
    &:not(.separated) .button {
      &:first-child {
        @apply rounded-l;
      }

      &:last-child {
        @apply rounded-r;
      }
    }
  }

  &.separated {
    @apply divide-x-0 divide-y-0 outline-0;
    &__sm {
      @apply gap-2;
    }

    &__md {
      @apply gap-4;
    }

    &__lg {
      @apply gap-6;
    }

    .button {
      @apply outline-1;
    }
  }

  .button {
    @apply border-0 outline-0;

    &:focus {
      @apply z-[1];
    }
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      @apply divide-rui-#{$color}-darker;

      &.outlined,
      &.text {
        @apply divide-rui-#{$color}/[0.5];
      }

      &.outlined {
        @apply outline-rui-#{$color}/[0.5];
      }
    }
  }

  &.outlined {
    @apply outline-rui-text divide-rui-text;
  }
}
</style>
