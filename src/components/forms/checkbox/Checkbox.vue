<script lang="ts" setup>
import { objectOmit } from '@vueuse/shared';
import { type ContextColorsType } from '@/consts/colors';
import Icon from '@/components/icons/Icon.vue';

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    color?: ContextColorsType;
    size?: 'sm' | 'lg';
    hint?: string;
    errorMessages?: string[];
    hideDetails?: boolean;
  }>(),
  {
    modelValue: false,
    indeterminate: false,
    disabled: false,
    color: 'primary',
    size: undefined,
    hint: '',
    errorMessages: () => [],
    hideDetails: false,
  }
);

const { size } = toRefs(props);

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void;
  (e: 'update:indeterminate', indeterminate: boolean): void;
}>();

const input = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    emit('update:indeterminate', false);
  }
  emit('update:modelValue', checked);
};

const iconSize: ComputedRef<number> = computed(() => {
  const sizeVal = get(size);
  if (sizeVal === 'lg') {
    return 28;
  }
  if (sizeVal === 'sm') {
    return 20;
  }
  return 24;
});

const css = useCssModule();
const attrs = useAttrs();
</script>

<template>
  <div :class="attrs.class">
    <label
      :class="[
        css.wrapper,
        {
          [css.disabled]: disabled,
          [css.lg]: size === 'lg',
          [css.sm]: size === 'sm',
        },
      ]"
    >
      <input
        :checked="modelValue"
        type="checkbox"
        :class="css.input"
        :disabled="disabled"
        v-bind="objectOmit(attrs, ['class'])"
        @input="input($event)"
      />
      <div
        :class="[
          css.checkbox,
          css[color],
          {
            [css.checked]: modelValue || indeterminate,
            [css.disabled]: disabled,
            [css.lg]: size === 'lg',
            [css.sm]: size === 'sm',
            [css['with-error']]: errorMessages.length > 0,
          },
        ]"
      >
        <icon
          v-if="indeterminate"
          name="checkbox-indeterminate-fill"
          :size="iconSize"
        />
        <icon v-else-if="modelValue" name="checkbox-fill" :size="iconSize" />
        <icon v-else name="checkbox-blank-line" :size="iconSize" />
      </div>
      <div :class="css.label" class="text-body-1">
        <slot />
      </div>
    </label>
    <div v-if="!hideDetails" class="details">
      <div v-if="errorMessages.length > 0" class="text-rui-error text-caption">
        {{ errorMessages[0] }}
      </div>
      <div
        v-else-if="hint"
        class="text-black/[0.6] dark:text-white text-caption"
      >
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

  .input {
    @apply appearance-none w-[1px] h-[1px] absolute z-[2] outline-none select-none;

    &:focus {
      + .checkbox {
        &:before {
          @apply opacity-5;
        }
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
      @apply text-rui-error #{!important};
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

    $colors: 'primary', 'secondary', 'error', 'warning', 'info', 'success';

    @each $color in $colors {
      &.#{$color} {
        @apply before:bg-rui-#{$color};
        &.checked {
          @apply text-rui-#{$color};
        }
      }
    }
  }

  .label {
    @apply flex-1 text-black/[.87];

    &:not(:empty) {
      @apply mt-[9px];
    }
  }

  &.sm {
    .label {
      &:not(:empty) {
        @apply mt-[7px];
      }
    }
  }

  &.lg {
    .label {
      &:not(:empty) {
        @apply mt-[11px];
      }
    }
  }
}

:global(.dark) {
  .wrapper {
    .checkbox {
      @apply relative text-white/[.70];
    }

    &.disabled {
      .checkbox {
        @apply text-white/[.30];
      }

      .label {
        @apply text-white/[.30];
      }
    }

    .label {
      @apply text-white;
    }
  }
}
</style>
