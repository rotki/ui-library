<script lang="ts" setup>
import { useAttrs, useCssModule } from 'vue-demi';

withDefaults(
  defineProps<{
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    outlined?: boolean;
    secondary?: boolean;
    error?: boolean;
    tile?: boolean;
    elevated?: boolean;
    text?: boolean;
    sm?: boolean;
    lg?: boolean;
  }>(),
  {
    label: '',
    disabled: false,
    loading: false,
    outlined: false,
    secondary: false,
    error: false,
    tile: false,
    elevated: false,
    text: false,
    sm: false,
    lg: false
  }
);

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>();

const attrs = useAttrs();
const css = useCssModule();
</script>

<template>
  <button
    :class="[
      css.btn,
      {
        [css.secondary]: secondary,
        [css.outlined]: outlined,
        [css.disabled]: disabled,
        [css.elevated]: elevated,
        [css.loading]: loading,
        [css.error]: error,
        [css.tile]: tile,
        [css.text]: text,
        [css.sm]: sm,
        [css.lg]: lg
      }
    ]"
    :disabled="disabled"
    class="btn"
    v-bind="attrs"
    @click="emit('click', $event)"
  >
    <slot name="prefix" />
    <span class="btn-label"> {{ label }} </span>
    <slot name="suffix" />
  </button>
</template>

<style lang="scss" module>
.btn {
  @apply bg-rui-primary-500 text-white text-sm font-medium hover:bg-rui-primary-600 border border-transparent;
  @apply dark:disabled:bg-white/[.12] dark:disabled:active:bg-white/[.12] disabled:bg-black/[.12] disabled:active:bg-black/[.12] disabled:text-black/[.26] dark:disabled:text-white/[.30] #{!important};
  @apply px-4 py-1.5 rounded-full transition-all duration-75 focus:outline-0 focus-within:outline-0 active:bg-rui-primary-600/90;

  &.tile {
    @apply rounded;
  }

  &.sm {
    @apply px-3 py-1 text-[.8125rem];
  }

  &.lg {
    @apply px-6 py-2 text-base;
  }

  &.elevated {
    @apply disabled:shadow-none;
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
      0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 13px rgba(0, 0, 0, 0.12);
  }

  &.outlined {
    @apply border-current bg-transparent hover:bg-rui-primary-300/5 active:bg-rui-primary-300/10 border-rui-primary-500 text-rui-primary-500;
    @apply disabled:border-black/[.12] dark:disabled:border-white/[.12] #{!important};
  }

  &.text {
    @apply bg-transparent text-rui-primary-500 hover:bg-rui-primary-500/[.04] active:bg-rui-primary-300/10 shadow-none;
  }

  &.secondary {
    @apply bg-rui-secondary-500 hover:bg-rui-secondary-600 active:bg-rui-secondary-600/90 text-white;

    &.outlined {
      @apply border bg-transparent border-rui-secondary-500 hover:bg-rui-secondary-300/5 active:bg-rui-secondary-300/25 text-rui-secondary-500;
    }

    &.text {
      @apply bg-transparent text-rui-secondary-500 hover:bg-rui-secondary-500/[.04] active:bg-rui-secondary-300/25;
    }
  }

  &.error {
    @apply bg-rui-error-500 hover:bg-rui-error-600 active:bg-rui-error-600/90 text-white;

    &.outlined {
      @apply border bg-transparent border-rui-error-500 hover:bg-rui-error-300/5 active:bg-rui-error-300/10 text-rui-error-500;
    }

    &.text {
      @apply bg-transparent text-rui-error-500 hover:bg-rui-error-500/[.04] active:bg-rui-error-300/10;
    }
  }
}
</style>
