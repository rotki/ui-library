<script lang="ts" setup>
import { objectOmit } from '@vueuse/shared';
import { type ContextColorsType } from '@/consts/colors';
import Icon from '@/components/icons/Icon.vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    variant?: 'default' | 'filled' | 'outlined';
    color?: 'grey' | ContextColorsType;
    dense?: boolean;
    hint?: string;
    errorMessages?: string[];
    hideDetails?: boolean;
    prependIcon?: string;
    appendIcon?: string;
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: '',
    disabled: false,
    variant: 'default',
    color: 'grey',
    dense: false,
    hint: '',
    errorMessages: () => [],
    hideDetails: false,
    prependIcon: '',
    appendIcon: '',
  }
);

const { label } = toRefs(props);

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
}>();

const input = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
};

const labelWithQuote = computed(() => {
  const labelVal = get(label);
  if (!labelVal) {
    return '"\\200B"';
  }
  return `'  ${get(label)}  '`;
});

const wrapper = ref<HTMLDivElement>();
const innerWrapper = ref<HTMLDivElement>();

const { left: wrapperLeft, right: wrapperRight } = useElementBounding(wrapper);
const { left: innerWrapperLeft, right: innerWrapperRight } =
  useElementBounding(innerWrapper);

const prependLength = computed(
  () => `${get(innerWrapperLeft) - get(wrapperLeft)}px`
);
const appendLength = computed(
  () => `${get(wrapperRight) - get(innerWrapperRight)}px`
);

const css = useCssModule();
const attrs = useAttrs();
const slots = useSlots();
</script>

<template>
  <div :class="attrs.class">
    <div
      ref="wrapper"
      :class="[
        css.wrapper,
        css[color],
        css[variant],
        {
          [css.dense]: dense,
          [css['with-error']]: errorMessages.length > 0,
          [css['no-label']]: !label,
        },
      ]"
    >
      <div class="flex items-center">
        <div v-if="slots.prepend" :class="css.prepend">
          <slot name="prepend" />
        </div>
        <div v-else-if="prependIcon" :class="[css.icon, css.prepend]">
          <icon :name="prependIcon" />
        </div>
      </div>
      <div ref="innerWrapper" class="flex-grow">
        <input
          :value="modelValue"
          :placeholder="placeholder || ' '"
          :class="css.input"
          :disabled="disabled"
          v-bind="objectOmit(attrs, ['class'])"
          @input="input($event)"
        />
        <label :class="css.label">
          {{ label }}
        </label>
        <fieldset v-if="variant === 'outlined'" :class="css.fieldset">
          <legend />
        </fieldset>
      </div>
      <div class="flex items-center">
        <div v-if="slots.append" :class="css.append">
          <slot name="append" />
        </div>
        <div v-else-if="appendIcon" :class="[css.icon, css.append]">
          <icon :name="appendIcon" />
        </div>
      </div>
    </div>
    <div v-if="!hideDetails" class="details pt-1">
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
@use '@/styles/colors.scss' as c;

:global(.dark) {
  .wrapper {
    .input {
      @apply text-white;

      &:disabled {
        &,
        + .label {
          @apply text-white/[0.5];
        }
      }
    }

    .label {
      @apply text-white/[0.7] border-white/[0.42];

      &:after {
        @apply border-white;
      }
    }

    .icon {
      @apply text-white/[0.56];
    }

    &.filled {
      .input {
        &:focus {
          + .label {
            @apply bg-white/[0.13];
          }
        }
      }

      .label {
        @apply bg-white/[0.09];
      }
    }

    &.outlined {
      .fieldset {
        @apply border-white/[0.23];
      }

      .input {
        &:focus {
          ~ .fieldset {
            @apply border-white;
          }
        }
      }
    }
  }
}

.wrapper {
  @apply relative w-full min-w-[200px] flex items-center pt-3;

  .input {
    @apply leading-6 text-black/[0.87] w-full bg-transparent py-1.5 pr-3 outline-0 transition-all placeholder:opacity-0 focus:placeholder:opacity-100;

    &:focus {
      @apply outline-0;
      + .label {
        @apply after:scale-x-100;
      }
    }

    &:not(:placeholder-shown),
    &:focus {
      + .label {
        @apply text-xs leading-tight;
        padding-left: var(--x-padding);
        padding-right: var(--x-padding);
      }
    }

    &:disabled {
      @apply border-dotted;

      &,
      + .label {
        @apply text-black/[0.38];
      }

      ~ .fieldset {
        @apply border-dotted;
      }
    }
  }

  .label {
    @apply left-0 text-base leading-[3.75] text-black/[0.6] pointer-events-none absolute top-0 flex h-full w-full select-none transition-all border-b border-black/[0.42];

    --x-padding: 0px;

    padding-left: calc(var(--x-padding) + v-bind(prependLength));
    padding-right: calc(var(--x-padding) + v-bind(appendLength));

    &:after {
      content: '';
      @apply absolute bottom-0 left-0 block w-full scale-x-0 border-b-2 mb-[-1px] transition-transform duration-300 border-black;
    }
  }

  .icon {
    @apply text-black/[0.54];
  }

  .prepend {
    @apply mr-2;
  }

  .append {
    @apply ml-2;
  }

  @each $color in c.$context-colors {
    &.#{$color} {
      .input {
        &:focus {
          + .label {
            @apply text-rui-#{$color};
          }
        }
      }

      .label {
        @apply after:border-rui-#{$color};
      }

      &.outlined {
        .input {
          &:focus {
            ~ .fieldset {
              @apply border-rui-#{$color};
            }
          }
        }
      }
    }
  }

  &.with-error {
    .input {
      @apply border-rui-error #{!important};
    }

    .label {
      @apply text-rui-error after:border-rui-error #{!important};
    }

    .fieldset {
      @apply border-rui-error #{!important};
    }
  }

  &.dense {
    .input {
      @apply py-1;
    }

    .label {
      @apply leading-[3.5];
    }
  }

  &.filled,
  &.outlined {
    @apply pt-0;

    .prepend {
      @apply ml-3 mr-0;
    }

    .append {
      @apply mr-3 ml-0;
    }

    .input {
      @apply px-3;
    }

    .label {
      @apply leading-[3.5];
      --x-padding: 0.75rem;
    }
  }

  &.filled {
    .input {
      @apply pt-6 pb-2;

      &:focus {
        + .label {
          @apply bg-black/[0.09];
        }
      }

      &:not(:placeholder-shown),
      &:focus {
        + .label {
          @apply leading-[2.5];

          padding-left: calc(var(--x-padding) + v-bind(prependLength));
          padding-right: calc(var(--x-padding) + v-bind(appendLength));
        }
      }
    }

    .label {
      @apply rounded-t bg-black/[0.06];
    }

    &.dense {
      .input {
        @apply pt-5 pb-1;
      }

      .label {
        @apply leading-[3];
      }

      &:not(:placeholder-shown),
      &:focus {
        + .label {
          @apply leading-[2.25];
        }
      }
    }

    &.no-label {
      .input {
        @apply py-4;
      }

      &.dense {
        .input {
          @apply py-3;
        }
      }
    }
  }

  &.outlined {
    .input {
      @apply py-4 border-b-0;

      &:focus {
        ~ .fieldset {
          @apply border-2 border-black;
        }
      }

      &:not(:placeholder-shown),
      &:focus {
        @apply border-t-transparent;

        + .label {
          @apply leading-[0] pl-4;
        }

        ~ .fieldset {
          legend {
            &:after {
              content: v-bind(labelWithQuote);
            }
          }
        }
      }
    }

    .fieldset {
      @apply absolute w-full h-[calc(100%+0.5rem)] top-0 left-0 pointer-events-none rounded border border-black/[0.23] px-2 transition-all -mt-2;

      legend {
        @apply opacity-0 text-xs;

        &:after {
          @apply whitespace-break-spaces;
          content: '\200B';
        }
      }
    }

    .label {
      @apply border-0 border-transparent;

      &:after {
        content: none !important;
      }
    }

    &.dense {
      .input {
        @apply py-2;
      }

      .label {
        @apply leading-[2.5];
      }
    }
  }
}
</style>
