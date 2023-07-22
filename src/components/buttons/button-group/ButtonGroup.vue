<script lang="ts" setup>
import { type ContextColorsType } from '@/consts/colors';

export interface Props {
  vertical?: boolean;
  color?: ContextColorsType;
  variant?: 'default' | 'outlined' | 'text';
  size?: 'sm' | 'lg';
}

defineOptions({
  name: 'RuiButtonGroup',
});

withDefaults(defineProps<Props>(), {
  vertical: false,
  color: undefined,
  variant: 'default',
  size: undefined,
});

const slots = useSlots();
const children = computed(() => slots.default?.() ?? []);

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
        :color="color"
        :variant="variant"
        :size="size"
        :class="css.button"
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
