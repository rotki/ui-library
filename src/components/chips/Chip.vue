<script lang="ts" setup>
import { type ContextColorsType } from '@/consts/colors';
import Icon from '@/components/icons/Icon.vue';

export interface Props {
  label: string;
  dismissible?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  variant?: 'filled' | 'outlined';
  color?: 'grey' | ContextColorsType;
}

defineOptions({
  name: 'RuiChip',
});

withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'grey',
  dismissible: false,
  disabled: false,
  variant: 'filled',
});

const emit = defineEmits<{ (event: 'remove'): void }>();

const css = useCssModule();
const slots = useSlots();
</script>

<template>
  <div
    :class="[
      css.chip,
      css[color ?? ''],
      css[size ?? ''],
      css[variant ?? ''],
      { [css.disabled]: disabled },
    ]"
    role="button"
    tabindex="0"
  >
    <div v-if="slots.prepend" :class="css.chip__prepend">
      <slot name="prepend" />
    </div>
    <span :class="css.chip__label">{{ label }}</span>
    <button
      v-if="dismissible"
      :class="css.chip__close"
      :disabled="disabled"
      @click.stop="emit('remove')"
    >
      <Icon
        :class="css.chip__close_icon"
        :size="size === 'sm' ? 16 : 24"
        name="close-circle-line"
      />
    </button>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.chip {
  @apply inline-flex items-center justify-between rounded-full px-1.5 py-[0.25rem] transition-all cursor-default;
  @apply max-w-full truncate;

  &.grey {
    @apply text-rui-text;

    &.filled {
      @apply bg-black/[0.08] hover:bg-black/[0.12] focus:bg-black/[0.20];
    }

    &.outlined {
      @apply border border-black/[0.26] bg-transparent hover:bg-black/[0.04] focus:bg-black/[0.12];
    }
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      &.filled {
        @apply text-rui-dark-text bg-rui-#{$color} hover:bg-rui-#{$color}-darker;
      }

      &.outlined {
        @apply border text-rui-#{$color} border-rui-#{$color}/50 bg-transparent hover:bg-rui-#{$color}/[0.04];
      }
    }
  }

  &__prepend {
    @apply rounded-full flex items-center justify-center pr-0 w-6 h-6;
    @apply text-[0.6rem] text-white bg-rui-grey-400 -ml-0.5 overflow-hidden;
  }

  &__label {
    @apply truncate px-[0.375rem] text-[0.8125rem];
  }

  &__close {
    @apply rounded-full flex items-center p-[0.13rem] pl-0;
    @apply inset-y-0 focus:outline-none -mr-1;

    &_icon {
      @apply opacity-50 hover:opacity-80 transition-opacity;
    }
  }

  &.md {
    @apply min-h-[2.26rem];
  }

  &.sm {
    @apply py-[0.19rem];

    &__prepend {
      @apply text-[0.5rem] p-[0.08rem] w-4 h-4 -ml-1;
    }

    &__label {
      @apply px-[0.3rem] text-[0.7rem];
    }

    &__close {
      @apply p-[0.08rem];
      @apply -mr-1.5;
    }
  }
}

.disabled {
  &.chip {
    @apply opacity-40 cursor-default;

    &.grey {
      &.filled {
        @apply hover:bg-black/[0.08] focus:bg-black/[0.08];
      }

      &.outlined {
        @apply hover:bg-transparent focus:bg-transparent;
      }
    }

    @each $color in c.$context-colors {
      &.#{$color} {
        &.filled {
          @apply hover:bg-rui-#{$color};
        }

        &.outlined {
          @apply hover:bg-transparent;
        }
      }
    }

    &__close {
      @apply cursor-default;

      &_icon {
        @apply opacity-50;
      }
    }
  }
}

:global(.dark) {
  .chip {
    &.grey {
      @apply bg-white/[0.16] hover:bg-white/[0.20] focus:bg-white/[0.24];
    }

    @each $color in 'warning', 'success' {
      &.#{$color} {
        &.filled {
          @apply text-rui-light-text;
        }
      }
    }

    &__prepend {
      @apply bg-rui-grey-700;
    }

    &__close {
      &_icon {
        @apply hover:text-rui-grey-300;
      }
    }
  }
}
</style>
