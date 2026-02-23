<script lang="ts" generic="T = undefined" setup>
import type { ContextColorsType } from '@/consts/colors';
import RuiProgress from '@/components/progress/RuiProgress.vue';

export interface Props<T = undefined> {
  disabled?: boolean;
  loading?: boolean;
  color?: ContextColorsType;
  rounded?: boolean;
  elevation?: number | string | null;
  variant?: 'default' | 'outlined' | 'text' | 'fab' | 'list';
  icon?: boolean;
  active?: boolean;
  size?: 'sm' | 'lg';
  tag?: 'button' | 'a';
  type?: 'button' | 'submit';
  modelValue?: T;
  hideFocusIndicator?: boolean;
}

defineOptions({
  name: 'RuiButton',
  inheritAttrs: false,
});

const {
  disabled = false,
  loading = false,
  color = undefined,
  rounded = false,
  elevation = null,
  variant = 'default',
  icon = false,
  active = false,
  size = undefined,
  tag = 'button',
  type = 'button',
  modelValue = undefined,
  hideFocusIndicator = false,
} = defineProps<Props<T>>();

const emit = defineEmits<{
  'update:modelValue': [value?: T];
}>();

const slots = defineSlots<{
  prepend?: () => any;
  append?: () => any;
  default?: () => any;
}>();

const btnValue = computed<T | undefined>(() => modelValue);

const usedElevation = computed<number | string>(() => {
  if (disabled)
    return 0;

  if (elevation !== null)
    return elevation;

  if (variant === 'fab')
    return 6;

  return 0;
});

const spinnerSize = computed<number>(() => {
  if (size === 'lg')
    return 26;

  if (size === 'sm')
    return 18;

  return 22;
});
</script>

<template>
  <Component
    :is="tag"
    :class="[
      $style.btn,
      $style[color ?? 'grey'],
      $style[size ?? ''],
      $style[variant ?? ''],
      `shadow-${usedElevation}`,
      {
        [$style.loading]: loading,
        [$style._rounded]: rounded,
        [$style.icon]: icon,
        [$style.active]: active,
        [$style.text]: variant === 'list',
        [$style.flat]: hideFocusIndicator,
      },
    ]"
    :disabled="disabled || loading"
    :type="tag === 'button' ? type : undefined"
    v-bind="$attrs"
    @click="emit('update:modelValue', btnValue)"
  >
    <slot name="prepend" />
    <span
      v-if="slots.default"
      :class="$style.label"
    >
      <slot />
    </span>
    <slot name="append" />
    <RuiProgress
      v-if="loading"
      circular
      :class="$style.spinner"
      variant="indeterminate"
      thickness="2"
      :size="spinnerSize"
    />
  </Component>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;
@use 'sass:list';

.btn {
  @apply text-sm leading-[1.5rem] font-medium outline outline-1 outline-transparent outline-offset-[-1px] flex items-center justify-center gap-x-2 relative;
  @apply px-4 py-1.5 rounded transition-all;
  @apply disabled:bg-black/[.12] dark:disabled:bg-white/[.12] disabled:text-rui-text-disabled disabled:active:text-rui-text-disabled focus-visible:ring-2 #{!important};

  .label {
    @apply inline-block text-nowrap;
  }

  &.flat {
    @apply focus-visible:ring-0 #{!important};
  }

  &._rounded {
    @apply rounded-full;
  }

  &.sm {
    @apply px-2.5 py-1 text-[.8125rem] leading-[1.375rem];
  }

  &.lg {
    @apply px-6 py-2 text-base leading-[1.625rem];
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      @apply bg-rui-#{$color} hover:bg-rui-#{$color}-darker active:bg-rui-#{$color}-darker/90 text-rui-dark-text ring-rui-#{$color}/40 dark:text-rui-text dark:ring-rui-#{$color}/60;

      &.active {
        @apply bg-rui-#{$color}-darker;
      }

      &.outlined,
      &.text {
        @apply bg-transparent hover:bg-rui-#{$color}-lighter/[.04] active:bg-rui-#{$color}-lighter/10 text-rui-#{$color};

        &.active {
          @apply bg-rui-#{$color}-lighter/30;
        }
      }

      &.outlined {
        @apply outline-rui-#{$color}/[0.5];
      }

      @if list.index((warning, success, info), $color) {
        &.default {
          @apply dark:text-rui-light-text;
        }
      }

      @if list.index((primary, secondary), $color) {
        &.outlined,
        &.text {
          &.active {
            @apply dark:bg-rui-#{$color}-darker/60 dark:text-rui-#{$color}-lighter;
          }
        }
      }
    }
  }

  &.grey {
    @apply bg-rui-grey-200 hover:bg-rui-grey-100 active:bg-rui-grey-50 text-rui-text ring-rui-grey-400;
    @apply dark:bg-rui-grey-300 dark:text-rui-light-text dark:ring-rui-grey-600;

    &.active {
      @apply bg-rui-grey-50;
    }

    &.outlined,
    &.text {
      @apply bg-transparent hover:bg-black/[.04] active:bg-black/10;
      @apply dark:active:bg-white/10 dark:hover:bg-white/[.04] dark:text-rui-text;

      &.active {
        @apply bg-black/10 dark:bg-white/30;
      }
    }

    &.outlined {
      @apply outline-rui-text;
    }

    &.text {
      @apply text-rui-text-secondary;
    }
  }

  &.outlined,
  &.text {
    @apply disabled:bg-transparent disabled:active:bg-transparent #{!important};
  }

  &.outlined {
    @apply disabled:outline-rui-text-disabled;
  }

  &.text {
    @apply px-2;

    &.sm {
      @apply px-1.5;
    }

    &.lg {
      @apply px-2.5;
    }
  }

  &.fab {
    @apply rounded-full py-2;

    &.lg {
      @apply py-3;
    }

    &.sm {
      @apply py-1.5 px-2;
    }
  }

  &.list {
    @apply p-3 rounded-none w-full justify-start text-left;

    &.sm {
      @apply px-3 py-1;
    }

    .label {
      @apply w-full;
    }
  }

  &.icon {
    @apply rounded-full px-3 py-3;

    &.lg {
      @apply px-4 py-4;
    }

    &.sm {
      @apply px-1 py-1;
    }
  }

  &.fab.icon {
    &.sm {
      @apply px-2 py-2;
    }
  }

  &.loading {
    @apply space-x-0;

    > *:not(.spinner) {
      @apply opacity-0 invisible;
    }
  }

  .spinner {
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  }
}
</style>
