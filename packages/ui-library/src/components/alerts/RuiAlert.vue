<script setup lang="ts">
import type { ContextColorsType } from '@/consts/colors';
import type { RuiIcons } from '@/icons';
import RuiButton from '@/components/buttons/button/RuiButton.vue';
import RuiIcon from '@/components/icons/RuiIcon.vue';

export interface Props {
  title?: string;
  description?: string;
  type?: ContextColorsType;
  icon?: RuiIcons;
  variant?: 'default' | 'filled' | 'outlined';
  actionText?: string;
  closeable?: boolean;
}

defineOptions({
  name: 'RuiAlert',
  inheritAttrs: false,
});

const {
  title = '',
  description = '',
  type = 'primary',
  icon = undefined,
  variant = 'default',
  actionText = '',
  closeable = false,
} = defineProps<Props>();

const emit = defineEmits<{
  action: [];
  close: [];
}>();

defineSlots<{
  title?: () => any;
  default?: () => any;
}>();

const usedIcon = computed<RuiIcons | undefined>(() => {
  if (icon)
    return icon;

  const iconMap: Record<ContextColorsType, RuiIcons | undefined> = {
    primary: undefined,
    secondary: undefined,
    warning: 'lu-triangle-alert',
    info: 'lu-info',
    error: 'lu-circle-alert',
    success: 'lu-circle-check',
  };

  return iconMap[type];
});
</script>

<template>
  <div
    :class="[$style.alert, $style[type], $style[variant]]"
    v-bind="$attrs"
  >
    <div class="flex space-x-3 py-1 flex-grow">
      <div
        v-if="usedIcon"
        :class="$style.icon"
      >
        <RuiIcon
          :name="usedIcon"
          size="22"
        />
      </div>
      <div
        class="space-y-1 flex-grow"
        :class="$style.texts"
      >
        <div
          v-if="$slots.title || title"
          :class="{
            'font-medium': !!title,
          }"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div
          v-if="$slots.default || description"
          class="text-body-2"
        >
          <slot>
            {{ description }}
          </slot>
        </div>
      </div>
    </div>
    <div v-if="actionText">
      <RuiButton
        variant="text"
        size="sm"
        :color="variant === 'filled' ? undefined : type"
        :class="$style.action"
        @click="emit('action')"
      >
        {{ actionText }}
      </RuiButton>
    </div>
    <div v-if="closeable">
      <RuiButton
        :color="variant === 'filled' ? undefined : type"
        size="sm"
        icon
        variant="text"
        :class="$style.close"
        @click="emit('close')"
      >
        <RuiIcon
          name="lu-x"
          size="20"
        />
      </RuiButton>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;
@use 'sass:list';

:global(.dark) {
  .alert {
    @each $color in c.$context-colors {
      &.#{$color} {
        &.default {
          @apply color-mix-supported:bg-rui-#{$color}-shade/[.9] bg-shade-[.9];
        }

        &.default,
        &.outlined {
          .icon,
          .texts,
          .action,
          .close {
            @apply color-mix-supported:text-rui-#{$color}-tint/[.6] text-tint-[.6];
          }

          .icon {
            @apply text-rui-#{$color};
          }
        }
      }

      @if list.index((warning, success, info), $color) {
        &.#{$color} {
          &.filled {
            .icon,
            .texts,
            .action,
            .close {
              @apply text-rui-light-text #{!important};
            }
          }
        }
      }
    }

    &.outlined {
      @apply bg-black;
    }
  }
}

.alert {
  @apply px-4 py-2.5 rounded flex space-x-4;

  @each $color in c.$context-colors {
    &.#{$color} {
      &.default {
        @apply color-mix-supported:bg-rui-#{$color}-tint/[.9];
        @apply bg-rui-#{$color} bg-tint-[.9];
      }

      &.filled {
        @apply bg-rui-#{$color};
      }

      &.outlined {
        @apply border-rui-#{$color};
      }

      &.default,
      &.outlined {
        .icon,
        .texts,
        .action,
        .close {
          @apply text-rui-#{$color} text-shade-[.6];
          @apply color-mix-supported:text-rui-#{$color}-shade/[.6] color-mix-supported:animate-none;
        }
      }
    }
  }

  &.filled {
    .icon,
    .texts,
    .action,
    .close {
      @apply text-rui-dark-text #{!important};
    }
  }

  &.outlined {
    @apply border m-[-1px] bg-white;
  }
}
</style>
