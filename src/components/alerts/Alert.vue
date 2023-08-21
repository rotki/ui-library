<script setup lang="ts">
import { type ContextColorsType } from '@/consts/colors';
import { default as RuiButton } from '@/components/buttons/button/Button.vue';
import { default as RuiIcon } from '@/components/icons/Icon.vue';
import { type RuiIcons } from '~/src';

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
});

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  type: 'primary',
  icon: undefined,
  variant: 'default',
  actionText: '',
  closeable: false,
});

const emit = defineEmits<{
  (e: 'action'): void;
  (e: 'close'): void;
}>();

const { icon, type } = toRefs(props);

const usedIcon: ComputedRef<RuiIcons | undefined> = computed(() => {
  const iconVal = get(icon);
  if (iconVal) {
    return iconVal;
  }

  const iconMap: Record<ContextColorsType, RuiIcons | undefined> = {
    primary: undefined,
    secondary: undefined,
    warning: 'alert-line',
    info: 'information-line',
    error: 'error-warning-line',
    success: 'checkbox-circle-line',
  };

  return iconMap[get(type)];
});

const css = useCssModule();
const attrs = useAttrs();

const slots = useSlots();
</script>

<template>
  <div :class="[css.alert, css[type], css[variant]]" v-bind="attrs">
    <div class="flex space-x-3 py-1 flex-grow">
      <div v-if="usedIcon" :class="css.icon">
        <RuiIcon :name="usedIcon" size="22" />
      </div>
      <div class="space-y-1 flex-grow" :class="css.texts">
        <div
          v-if="slots.title || title"
          :class="{
            'font-medium': !!title,
          }"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <div class="text-body-2">
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
        :class="css.action"
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
        :class="css.close"
        @click="emit('close')"
      >
        <RuiIcon name="close-fill" size="20" />
      </RuiButton>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

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
      @apply text-white #{!important};
    }
  }

  &.outlined {
    @apply border m-[-1px] bg-white;
  }
}
</style>
