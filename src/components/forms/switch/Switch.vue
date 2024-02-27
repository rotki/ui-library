<script lang="ts" setup>
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';
import type { ContextColorsType } from '@/consts/colors';

export interface Props {
  modelValue?: boolean;
  disabled?: boolean;
  color?: ContextColorsType;
  size?: 'sm';
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
}

defineOptions({
  name: 'RuiSwitch',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
  color: undefined,
  size: undefined,
  label: '',
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void;
}>();

const { size, modelValue, errorMessages, successMessages } = toRefs(props);

function input(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  emit('update:modelValue', checked);
}

const css = useCssModule();
const attrs = useAttrs();

const { hasError, hasSuccess } = useFormTextDetail(
  errorMessages,
  successMessages,
);
</script>

<template>
  <div v-bind="getRootAttrs(attrs)">
    <label
      :class="[
        css.wrapper,
        css[size ?? ''],
        css[color ?? ''],
        {
          [css.checked]: modelValue,
          [css.disabled]: disabled,
          [css['with-error']]: hasError,
          [css['with-success']]: hasSuccess && !hasError,
        },
      ]"
    >
      <div :class="css.inner">
        <input
          :checked="modelValue"
          type="checkbox"
          :class="css.input"
          :disabled="disabled"
          v-bind="getNonRootAttrs(attrs)"
          @input="input($event)"
        />
        <div
          :class="css.toggle"
        />
      </div>
      <span
        v-if="label || $slots.default"
        :class="css.label"
        class="text-body-1"
      >
        <slot>{{ label }}</slot>
      </span>
    </label>
    <FormTextDetail
      v-if="!hideDetails"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

.wrapper {
  @apply relative flex gap-2 items-start cursor-pointer;

  &.disabled {
    @apply cursor-not-allowed;

    .input {
      @apply bg-rui-grey-300 cursor-not-allowed;
    }

    .label {
      @apply text-rui-text-disabled;
    }

    .toggle {
      @apply bg-rui-grey-500;
    }
  }

  &:hover {
    &:not(.disabled) {
      .toggle {
        @apply shadow-1;
      }
    }
  }

  &.checked {
    &:not(.disabled) {
      .input {
        @apply bg-black;
      }
    }

    .toggle {
      @apply left-[21px];
    }
  }

  &.sm {
    .inner {
      @apply w-10 h-5 mt-0.5;
    }
    .toggle {
      @apply w-4 h-4;

      &:before {
        @apply w-6 h-6;
      }
    }

    &.checked {
      .toggle {
        @apply left-[22px];
      }
    }
  }

  &.checked {
    &:not(.disabled) {
      @each $color in c.$context-colors {
        &.#{$color} {
          .input {
            @apply bg-rui-#{$color};
          }
        }
      }
    }
  }

  &.with-error {
    .input {
      @apply bg-rui-error #{!important};
    }

    .label {
      @apply text-rui-error;
    }
  }

  &.with-success {
    .input {
      @apply bg-rui-success #{!important};
    }

    .label {
      @apply text-rui-success;
    }
  }

  .inner {
    @apply relative w-[43px] h-[24px] shrink-0;
  }

  .input {
    @apply appearance-none relative w-full h-full rounded-full bg-rui-grey-400 transition-all duration-75 ease-in-out cursor-pointer;

    &:active {
      + .toggle {
        &:before {
          @apply opacity-20;
        }
      }
    }
  }

  .toggle {
    @apply absolute w-5 h-5 transition-all duration-75 ease-in-out transform -translate-y-1/2 top-1/2 rounded-full pointer-events-none;
    @apply bg-white left-[2px];

    &:before {
      content: '';
      @apply absolute w-10 h-10 bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all ease-in-out opacity-0;
    }
  }
}

:global(.dark) {
  .wrapper {
    &.disabled {
      .input {
        @apply bg-rui-grey-800;
      }

      .toggle {
        @apply bg-rui-grey-600;
      }
    }

    &.checked {
      &:not(.disabled) {
        .input {
          @apply bg-white;
        }
        .toggle {
          @apply bg-black;
        }
      }
    }

    &.checked {
      &:not(.disabled) {
        @each $color in c.$context-colors {
          &.#{$color} {
            .input {
              @apply bg-rui-#{$color}/[0.5];
            }
            .toggle {
              @apply bg-rui-#{$color};
            }
          }
        }
      }
    }

    &.with-error {
      .input {
        @apply bg-rui-error/[0.5] #{!important};
      }
      .toggle {
        @apply bg-rui-error #{!important};
      }
    }

    &.with-success {
      .input {
        @apply bg-rui-success/[0.5] #{!important};
      }
      .toggle {
        @apply bg-rui-success #{!important};
      }
    }
  }

  .input {
    @apply bg-rui-grey-700;
  }

  .toggle {
    &:before {
      @apply bg-white;
    }
  }
}
</style>
