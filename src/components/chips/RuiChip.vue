<script lang="ts" setup>
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import type { StyleValue } from 'vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';
import { logicNot, logicOr } from '@vueuse/math';
import { objectOmit } from '@vueuse/shared';

export interface Props {
  tile?: boolean;
  clickable?: boolean;
  closeable?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  variant?: 'filled' | 'outlined';
  color?: 'grey' | ContextColorsType;
  closeIcon?: RuiIcons;
  bgColor?: string;
  textColor?: string;
}

defineOptions({
  name: 'RuiChip',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  tile: false,
  size: 'md',
  color: 'grey',
  clickable: false,
  closeable: false,
  disabled: false,
  variant: 'filled',
  closeIcon: 'lu-circle-x',
  bgColor: undefined,
  textColor: undefined,
});

const emit = defineEmits<{
  (event: 'click:close'): void;
  (event: 'click', e: any): void;
}>();

const { clickable, disabled, bgColor, textColor } = toRefs(props);

function click(e: any) {
  if (get(logicOr(logicNot(clickable), disabled)))
    return;

  emit('click', e);
}

const style = computed<Partial<StyleValue>>(() => {
  const style: Partial<StyleValue> = {};
  const bg = get(bgColor);
  const text = get(textColor);
  if (bg)
    style.backgroundColor = bg;

  if (text)
    style.color = text;

  return style;
});
</script>

<template>
  <div
    :class="[
      $style.chip,
      $style[color ?? ''],
      $style[size ?? ''],
      $style[variant ?? ''],
      {
        [$style.disabled]: disabled,
        [$style.tile]: tile,
        [$style.readonly]: !clickable,
      },
    ]"
    :style="style"
    role="button"
    tabindex="0"
    v-bind="objectOmit($attrs, ['onClick'])"
    @click="click($event)"
  >
    <div
      v-if="$slots.prepend"
      :class="$style.chip__prepend"
    >
      <slot name="prepend" />
    </div>
    <span :class="$style.chip__label">
      <slot />
    </span>
    <button
      v-if="closeable"
      :class="$style.chip__close"
      :disabled="disabled"
      type="button"
      @click.stop="emit('click:close')"
    >
      <RuiIcon
        :class="$style.chip__close_icon"
        :size="size === 'sm' ? 16 : 24"
        :name="closeIcon"
      />
    </button>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.chip {
  @apply inline-flex items-center justify-between rounded-full px-1.5 py-[0.25rem] transition-all cursor-default outline-none;
  @apply max-w-full truncate;

  &.tile {
    @apply rounded-sm;
  }

  &:not(.readonly):not(.disabled) {
    @apply hover:brightness-90 focus:brightness-75;
  }

  &.grey {
    @apply text-rui-text;

    &.filled {
      @apply bg-rui-grey-200;
    }

    &.outlined {
      @apply border border-black/[0.26] bg-transparent;

      &:not(.readonly):not(.disabled) {
        @apply hover:bg-black/[0.04] focus:bg-black/[0.12];
      }
    }
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      &.filled {
        @apply text-rui-dark-text bg-rui-#{$color};
      }

      &.outlined {
        @apply border text-rui-#{$color} border-rui-#{$color}/50 bg-transparent;

        &:not(.readonly):not(.disabled) {
          @apply hover:bg-rui-#{$color}/[0.04] focus:bg-rui-#{$color}/[0.12];
        }
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

  &.disabled,
  &.readonly {
    @apply cursor-default;

    &__close {
      @apply cursor-default;

      &_icon {
        @apply opacity-50;
      }
    }
  }

  &.disabled {
    @apply opacity-40;
  }
}

:global(.dark) {
  .chip {
    &:not(.readonly):not(.disabled) {
      @apply hover:brightness-110 focus:brightness-75;
    }

    &.grey {
      &.filled {
        @apply bg-rui-grey-800;
      }

      &.outlined {
        @apply border-white/[0.26];

        &:not(.readonly):not(.disabled) {
          @apply hover:bg-white/[0.04] focus:bg-white/[0.12];
        }
      }
    }

    @each $color in (warning, success, info) {
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
