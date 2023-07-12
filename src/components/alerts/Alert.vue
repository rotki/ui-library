<script setup lang="ts">
import { type ContextColorsType } from '@/consts/colors';
import { default as RuiButton } from '@/components/buttons/Button.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    type?: ContextColorsType;
    icon?: string;
    variant?: 'default' | 'filled' | 'outlined';
    actionText?: string;
    closeable?: boolean;
  }>(),
  {
    description: '',
    type: 'primary',
    icon: '',
    variant: 'default',
    actionText: '',
    closeable: false,
  }
);

const emit = defineEmits<{
  (e: 'action'): void;
  (e: 'close'): void;
}>();

const { icon, type } = toRefs(props);

const usedIcon: ComputedRef<string> = computed(() => {
  const iconVal = get(icon);
  if (iconVal) {
    return iconVal;
  }

  const iconMap: Record<ContextColorsType, string> = {
    primary: '',
    secondary: '',
    warning: 'alert-line',
    info: 'information-line',
    error: 'error-warning-line',
    success: 'checkbox-circle-line',
  };

  return iconMap[get(type)] ?? '';
});

const css = useCssModule();
const attrs = useAttrs();
</script>

<template>
  <div :class="[css.alert, css[type], css[variant]]" v-bind="attrs">
    <div class="flex space-x-3 py-1 flex-grow">
      <div v-if="usedIcon" :class="css.icon">
        <rui-icon :name="usedIcon" size="22" />
      </div>
      <div class="space-y-1 flex-grow" :class="css.texts">
        <div class="font-medium">{{ title }}</div>
        <div class="text-body-2">{{ description }}</div>
      </div>
    </div>
    <div v-if="actionText">
      <rui-button
        variant="text"
        size="sm"
        :color="variant === 'filled' ? undefined : type"
        :class="css.action"
        @click="emit('action')"
      >
        {{ actionText }}
      </rui-button>
    </div>
    <div v-if="closeable">
      <rui-button
        :color="variant === 'filled' ? undefined : type"
        size="sm"
        icon
        variant="text"
        :class="css.close"
        @click="emit('close')"
      >
        <rui-icon name="close-fill" size="20" />
      </rui-button>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

:global(.dark) {
  .alert {
    @each $color in c.$context-colors {
      &.#{$color} {
        @apply bg-rui-dark-#{$color}-shade-90;

        .icon,
        .texts,
        .action,
        .close {
          @apply text-rui-dark-#{$color}-tint-60;
        }
      }
    }
  }
}

.alert {
  @apply px-4 py-2.5 rounded flex space-x-4;

  @each $color in c.$context-colors {
    &.#{$color} {
      @apply bg-rui-light-#{$color}-tint-90;

      .icon {
        @apply text-rui-#{$color};
      }

      .texts,
      .action,
      .close {
        @apply text-rui-light-#{$color}-shade-60;
      }
    }
  }

  &.filled {
    .icon,
    .texts,
    .action,
    .close {
      @apply text-white;
    }

    @each $color in c.$context-colors {
      &.#{$color} {
        @apply bg-rui-#{$color};
      }
    }
  }

  &.outlined {
    @apply bg-transparent;

    @each $color in c.$context-colors {
      &.#{$color} {
        @apply outline outline-1 outline-offset-[-1px] outline-rui-#{$color};
      }
    }
  }
}
</style>
