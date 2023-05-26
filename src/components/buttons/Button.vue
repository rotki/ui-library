<script lang="ts" setup>
import { useAttrs, useCssModule } from 'vue';
import { type ContextColorsType } from '@/consts/colors';

withDefaults(
  defineProps<{
    disabled?: boolean;
    loading?: boolean;
    outlined?: boolean;
    color?: ContextColorsType;
    tile?: boolean;
    elevated?: boolean;
    text?: boolean;
    sm?: boolean;
    lg?: boolean;
  }>(),
  {
    disabled: false,
    loading: false,
    outlined: false,
    color: 'primary',
    tile: false,
    elevated: false,
    text: false,
    sm: false,
    lg: false,
  }
);

const attrs = useAttrs();
const css = useCssModule();
</script>

<template>
  <button
    :class="[
      css.btn,
      {
        [css[color]]: true,
        [css.outlined]: outlined,
        [css.disabled]: disabled,
        [css.elevated]: elevated,
        [css.loading]: loading,
        [css.tile]: tile,
        [css.text]: text,
        [css.sm]: sm,
        [css.lg]: lg,
      },
    ]"
    :disabled="disabled || loading"
    class="btn"
    v-bind="attrs"
  >
    <slot name="prepend" />
    <span class="btn-label"> <slot /> </span>
    <slot name="append" />
  </button>
</template>

<style lang="scss" module>
.btn {
  @apply text-sm font-medium border border-transparent flex items-center space-x-2;
  @apply dark:disabled:bg-white/[.12] dark:disabled:active:bg-white/[.12] disabled:bg-black/[.12] disabled:active:bg-black/[.12] disabled:text-black/[.26] dark:disabled:text-white/[.30] #{!important};
  @apply px-4 py-1.5 rounded-full transition-all duration-75 focus:outline-0 focus-within:outline-0;

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
    @apply border-current bg-transparent;
    @apply disabled:border-black/[.12] dark:disabled:border-white/[.12] #{!important};
  }

  &.text {
    @apply bg-transparent shadow-none;
  }

  &.primary {
    @apply bg-rui-primary hover:bg-rui-primary-darker active:bg-rui-primary-darker/90 text-white;

    &.outlined {
      @apply bg-transparent hover:bg-rui-primary-lighter/5 active:bg-rui-primary-lighter/10 text-rui-primary;
    }

    &.text {
      @apply bg-transparent text-rui-primary hover:bg-rui-primary/[.04] active:bg-rui-primary-lighter/10;
    }
  }

  &.secondary {
    @apply bg-rui-secondary hover:bg-rui-secondary-darker active:bg-rui-secondary-darker/90 text-white;

    &.outlined {
      @apply bg-transparent hover:bg-rui-secondary-lighter/5 active:bg-rui-secondary-lighter/25 text-rui-secondary;
    }

    &.text {
      @apply bg-transparent text-rui-secondary hover:bg-rui-secondary/[.04] active:bg-rui-secondary-lighter/25;
    }
  }

  &.error {
    @apply bg-rui-error hover:bg-rui-error-darker active:bg-rui-error-darker/90 text-white;

    &.outlined {
      @apply bg-transparent hover:bg-rui-error-lighter/5 active:bg-rui-error-lighter/10 text-rui-error;
    }

    &.text {
      @apply bg-transparent text-rui-error hover:bg-rui-error/[.04] active:bg-rui-error-lighter/10;
    }
  }

  &.warning {
    @apply bg-rui-warning hover:bg-rui-warning-darker active:bg-rui-warning-darker/90 text-white;

    &.outlined {
      @apply bg-transparent hover:bg-rui-warning-lighter/5 active:bg-rui-warning-lighter/10 text-rui-warning;
    }

    &.text {
      @apply bg-transparent text-rui-warning hover:bg-rui-warning/[.04] active:bg-rui-warning-lighter/10;
    }
  }

  &.info {
    @apply bg-rui-info hover:bg-rui-info-darker active:bg-rui-info-darker/90 text-white;

    &.outlined {
      @apply bg-transparent hover:bg-rui-info-lighter/5 active:bg-rui-info-lighter/10 text-rui-info;
    }

    &.text {
      @apply bg-transparent text-rui-info hover:bg-rui-info/[.04] active:bg-rui-info-lighter/10;
    }
  }

  &.success {
    @apply bg-rui-success hover:bg-rui-success-darker active:bg-rui-success-darker/90 text-white;

    &.outlined {
      @apply bg-transparent hover:bg-rui-success-lighter/5 active:bg-rui-success-lighter/10 text-rui-success;
    }

    &.text {
      @apply bg-transparent text-rui-success hover:bg-rui-success/[.04] active:bg-rui-success-lighter/10;
    }
  }
}
</style>
