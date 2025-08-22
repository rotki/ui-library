<script setup lang="ts">
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import { logicAnd, logicOr } from '@vueuse/math';
import RuiIcon from '@/components/icons/RuiIcon.vue';

export interface Props {
  text?: string | null;
  icon?: RuiIcons | null;
  modelValue?: boolean;
  dot?: boolean;
  left?: boolean;
  offsetX?: string | number;
  offsetY?: string | number;
  placement?: 'top' | 'center' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  color?: 'default' | ContextColorsType;
}

defineOptions({
  name: 'RuiBadge',
});

const props = withDefaults(defineProps<Props>(), {
  text: null,
  icon: null,
  modelValue: true,
  dot: false,
  placement: 'top',
  left: false,
  size: 'md',
  rounded: 'full',
  color: 'primary',
  offsetX: 0,
  offsetY: 0,
});

const slots = useSlots();

const { modelValue, offsetX, offsetY, icon, text } = toRefs(props);

const hasIcon = logicOr(icon, slots.icon);

const hasText = logicOr(text, slots.badge);

const hasIconAndText = logicAnd(hasIcon, hasText);
</script>

<template>
  <div :class="$style.wrapper">
    <slot />
    <Transition
      appear
      enter-active-class="transform ease-out duration-200"
      enter-from-class="scale-0"
      enter-to-class="scale-100"
      leave-active-class="transform ease-in duration-150"
      leave-from-class="scale-100"
      leave-to-class="scale-0"
    >
      <div
        v-if="modelValue"
        :class="[
          $style.badge,
          $style[color ?? 'primary'],
          $style[`placement__${placement}`],
          $style[`rounded__${rounded}`],
          $style[`size__${size}`],
          { [$style.left]: left, [$style.dot]: dot },
        ]"
        aria-atomic="true"
        aria-label="Badge"
        aria-live="polite"
        role="status"
      >
        <span
          v-if="!dot"
          :class="[
            $style.content,
            {
              [$style.text_icon]: hasIconAndText,
            },
          ]"
        >
          <slot name="badge">
            <span>
              {{ text }}
            </span>
          </slot>
          <slot name="icon">
            <RuiIcon
              v-if="icon"
              :name="icon"
              size="16"
              :class="{ 'ml-0.5': hasText }"
            />
          </slot>
        </span>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;
@use 'sass:list';

$borders: full, sm, md, lg;
$sizes: sm, md, lg;

.wrapper {
  @apply relative inline-block;

  .badge {
    @apply flex items-center justify-center text-xs font-medium absolute;
    @apply bg-transparent text-rui-light-text;

    left: calc(100% - 0.5rem + v-bind(offsetX) * 0.0625rem);

    .content {
      @apply flex items-center px-1;

      &.text_icon {
        @apply px-2;
      }
    }

    @each $color in c.$context-colors {
      &.#{$color} {
        @apply text-white bg-rui-#{$color};
      }
    }

    @each $border in $borders {
      &.rounded__#{$border} {
        @apply rounded-#{$border};
      }
    }

    &.size__sm {
      @apply min-h-[1.25rem] min-w-[1.25rem];

      &.left {
        left: calc(-0.95rem + v-bind(offsetX) * 0.0625rem);
      }

      &.placement__center {
        top: calc(50% - 0.65rem - v-bind(offsetY) * 0.0625rem);
      }
    }

    &.size__md {
      @apply min-h-[1.5rem] min-w-[1.5rem];

      &.left {
        left: calc(-1.05rem + v-bind(offsetX) * 0.0625rem);
      }

      &.placement__center {
        top: calc(50% - 0.75rem - v-bind(offsetY) * 0.0625rem);
      }
    }

    &.size__lg {
      @apply min-h-[1.75rem] min-w-[1.75rem];

      &.left {
        left: calc(-1.15rem + v-bind(offsetX) * 0.0625rem);
      }

      &.placement__center {
        top: calc(50% - 0.85rem - v-bind(offsetY) * 0.0625rem);
      }
    }

    &.placement__top {
      bottom: calc(100% - 0.5rem - v-bind(offsetY) * 0.0625rem);
    }

    &.placement__bottom {
      top: calc(100% - 0.5rem - v-bind(offsetY) * 0.0625rem);
    }

    &.dot {
      left: calc(100% + 0.125rem + v-bind(offsetX) * 0.0625rem);

      &.default {
        @apply bg-gray-500;
      }

      &.size__sm {
        @apply min-w-[0.375rem] min-h-[0.375rem];
      }

      &.size__md {
        @apply min-w-[0.5rem] min-h-[0.5rem];
      }

      &.size__lg {
        @apply min-w-[0.625rem] min-h-[0.625rem];
      }

      &.left {
        left: calc(-0.65rem + v-bind(offsetX) * 0.0625rem);
      }

      &.placement__top {
        bottom: calc(100% + 0.25rem - v-bind(offsetY) * 0.0625rem);
      }

      &.placement__center {
        top: calc(50% - 0.25rem - v-bind(offsetY) * 0.0625rem);
      }

      &.placement__bottom {
        top: calc(100% + 0.25rem - v-bind(offsetY) * 0.0625rem);
      }
    }
  }
}

:global(.dark) {
  .wrapper {
    .badge {
      @apply text-rui-text;

      @each $color in c.$context-colors {
        @if list.index((warning, success, info), $color) {
          &.#{$color} {
            @apply text-rui-light-text;
          }
        }
      }
    }
  }
}
</style>
