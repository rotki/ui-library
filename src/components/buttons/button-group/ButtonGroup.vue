<script lang="ts" generic="T = undefined" setup>
import { type ContextColorsType } from '@/consts/colors';

export interface Props<T = undefined> {
  vertical?: boolean;
  color?: ContextColorsType;
  variant?: 'default' | 'outlined' | 'text';
  size?: 'sm' | 'lg';
  required?: boolean;
  modelValue?: T | T[];
  disabled?: boolean;
}

defineOptions({
  name: 'RuiButtonGroup',
});

const props = withDefaults(defineProps<Props<T>>(), {
  vertical: false,
  color: undefined,
  variant: 'default',
  size: undefined,
  modelValue: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: T | T[] | undefined): void;
}>();

const slots = useSlots();
const { modelValue, required } = toRefs(props);
const children = computed(() =>
  (slots.default?.() ?? []).map((child, i) => {
    child.props = {
      ...child.props,
      active: activeItem(child.props?.value ?? i),
    };

    return child;
  }),
);

const activeItem = (id: T) => {
  const selected = get(modelValue);
  if (Array.isArray(selected)) {
    return selected.includes(id);
  }

  return selected === id;
};

const onClick = (id: T) => {
  const selected = get(modelValue);
  const mandatory = get(required);
  if (Array.isArray(selected)) {
    const index = selected.indexOf(id);
    if (index >= 0) {
      if (!mandatory || selected.length !== 1) {
        selected.splice(index, 1);
      }
    } else {
      selected.push(id);
    }
    emit('update:modelValue', selected);
  } else if (mandatory) {
    emit('update:modelValue', id);
  } else {
    emit('update:modelValue', activeItem(id) ? undefined : id);
  }
};

const css = useCssModule();
</script>

<template>
  <div>
    <div
      :class="[
        css.wrapper,
        css[color ?? ''],
        css[variant],
        { [css.wrapper__vertical]: vertical },
      ]"
    >
      <Component
        :is="child"
        v-for="(child, i) in children"
        :key="i"
        :class="css.button"
        :color="color"
        :disabled="disabled"
        :size="size"
        :variant="variant"
        @update:value="onClick($event ?? i)"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.wrapper {
  @apply inline-flex rounded overflow-hidden divide-x divide-rui-grey-400;
  @apply outline outline-1 outline-transparent outline-offset-[-1px];

  &__vertical {
    @apply inline-flex flex-col items-start divide-x-0 divide-y;

    .button {
      @apply w-full;
    }
  }

  .button {
    @apply rounded-none border-0 outline-0;
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
