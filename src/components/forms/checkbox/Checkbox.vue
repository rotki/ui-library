<script lang="ts" setup>
import { type ContextColorsType } from '@/consts/colors';
import Icon from '@/components/icons/Icon.vue';

const props = withDefaults(
  defineProps<{
    value?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    color?: ContextColorsType;
    sm?: boolean;
    lg?: boolean;
    hint?: string;
    errorMessages?: string[];
    hideDetails?: boolean;
  }>(),
  {
    value: false,
    indeterminate: false,
    disabled: false,
    color: 'primary',
    sm: false,
    lg: false,
    hint: '',
    errorMessages: () => [],
    hideDetails: false,
  }
);

const { sm, lg } = toRefs(props);

const emit = defineEmits<{
  (e: 'input', value: boolean): void;
}>();

const input = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  emit('input', checked);
};

const iconSize: ComputedRef<number> = computed(() => {
  if (get(lg)) {
    return 28;
  }
  if (get(sm)) {
    return 20;
  }
  return 24;
});

const css = useCssModule();
const attrs = useAttrs();
</script>

<template>
  <div>
    <label :class="[css.wrapper, { [css.disabled]: disabled }]">
      <input
        :checked="value"
        type="checkbox"
        class="hidden"
        :disabled="disabled"
        v-bind="attrs"
        @input="input($event)"
      />
      <div
        :class="[
          css.checkbox,
          css[color],
          {
            [css.checked]: value || indeterminate,
            [css.disabled]: disabled,
            [css.lg]: lg,
            [css.sm]: sm,
            [css['with-error']]: errorMessages.length > 0,
          },
        ]"
      >
        <icon
          v-if="indeterminate"
          name="checkbox-indeterminate-fill"
          :size="iconSize"
        />
        <icon v-else-if="value" name="checkbox-fill" :size="iconSize" />
        <icon v-else name="checkbox-blank-line" :size="iconSize" />
      </div>
      <div :class="css.label" class="text-body-1">
        <slot />
      </div>
    </label>
    <div v-if="!hideDetails">
      <div v-if="errorMessages.length > 0" class="text-rui-error text-body-2">
        {{ errorMessages[0] }}
      </div>
      <div v-else-if="hint" class="text-black/[0.6] text-body-2">
        {{ hint }}
      </div>
      <div v-else class="h-5" />
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  @apply relative flex items-start cursor-pointer -ml-[9px];

  &.disabled {
    @apply cursor-not-allowed;

    .checkbox {
      @apply text-black/[.26];

      &:before {
        content: none !important;
      }
    }

    .label {
      @apply text-black/[.26];
    }
  }
}
.checkbox {
  @apply relative text-black/[.60] p-[9px];

  &:before {
    content: '';
    @apply absolute top-1/2 left-1/2 block h-[42px] w-[42px] -translate-y-1/2 -translate-x-1/2 rounded-full opacity-0 transition-opacity;
  }

  &.with-error {
    @apply text-rui-error;
  }

  &:hover {
    &:before {
      @apply opacity-5;
    }
  }

  &:active {
    &:before {
      @apply opacity-30;
    }
  }

  &.lg {
    &:before {
      @apply h-[46px] w-[46px];
    }
  }

  &.sm {
    &:before {
      @apply h-[38px] w-[38px];
    }
  }

  $colors: primary, secondary, error, warning, info, success;

  &.primary {
    @apply before:bg-rui-primary;
    &.checked {
      @apply text-rui-primary;
    }
  }

  &.secondary {
    @apply before:bg-rui-secondary;
    &.checked {
      @apply text-rui-secondary;
    }
  }

  &.error {
    @apply before:bg-rui-error;
    &.checked {
      @apply text-rui-error;
    }
  }

  &.warning {
    @apply before:bg-rui-warning;
    &.checked {
      @apply text-rui-warning;
    }
  }

  &.info {
    @apply before:bg-rui-info;
    &.checked {
      @apply text-rui-info;
    }
  }

  &.success {
    @apply before:bg-rui-success;
    &.checked {
      @apply text-rui-success;
    }
  }
}

.label {
  @apply flex-1 text-black/[.87];

  &:not(:empty) {
    @apply mt-[9px];
  }
}

:global(.dark) {
  .checkbox {
    @apply relative text-white/[.70];
  }

  .wrapper {
    &.disabled {
      .checkbox {
        @apply text-white/[.30];
      }

      .label {
        @apply text-white/[.30];
      }
    }
  }

  .label {
    @apply text-white;
  }
}
</style>
