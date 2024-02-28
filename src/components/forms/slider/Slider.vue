<script setup lang="ts">
import { getNonRootAttrs, getRootAttrs } from '@/utils/helpers';
import FormTextDetail from '@/components/helpers/FormTextDetail.vue';
import type { ContextColorsType } from '~/src';

export interface Props {
  modelValue?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showThumbLabel?: boolean;
  showTicks?: boolean;
  hideTrack?: boolean;
  tickSize?: number;
  vertical?: boolean;
  color?: ContextColorsType;
  label?: string;
  hint?: string;
  errorMessages?: string | string[];
  successMessages?: string | string[];
  hideDetails?: boolean;
  sliderClass?: string;
  tickClass?: string;
}

defineOptions({
  name: 'RuiSlider',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
  showThumbLabel: false,
  showTicks: false,
  hideTrack: false,
  vertical: false,
  tickSize: 2,
  color: 'primary',
  label: '',
  hint: '',
  errorMessages: () => [],
  successMessages: () => [],
  hideDetails: false,
  sliderClass: '',
  tickClass: '',
});

const emit = defineEmits<{
  (e: 'update:model-value', value: number): void;
}>();

const { modelValue, max, min, step, errorMessages, successMessages, vertical, tickSize } = toRefs(props);

const vModel = computed({
  get() {
    return get(modelValue);
  },
  set(value: number) {
    emit('update:model-value', value);
  },
});

const css = useCssModule();
const attrs = useAttrs();

const ticksData = computed(() => {
  const minVal = get(min);
  const stepVal = get(step);
  const range = get(max) - minVal;
  const total = range / stepVal;
  const current = Math.round((get(modelValue) - minVal) / stepVal);

  return [current, total];
});

const trackWidth = computed(() => {
  const [current, total] = get(ticksData);
  const percentage = Math.min(100, Math.max(0, Math.round(current / total * 100)));
  return `${percentage}%`;
});

const { hasError, hasSuccess } = useFormTextDetail(
  errorMessages,
  successMessages,
);

const outer = ref<HTMLDivElement>();
const { width, height } = useElementBounding(outer);

const sliderWidth = computed(() => `${get(width)}px`);
const sliderHeight = computed(() => `${get(height)}px`);
const tickSizeInPx = computed(() => `${get(tickSize)}px`);
</script>

<template>
  <div v-bind="getRootAttrs(attrs)">
    <label
      :class="[
        css.wrapper,
        {
          [css.disabled]: disabled,
          [css.vertical]: vertical,
          [css[color]]: color,
          [css['hide-track']]: hideTrack,
          [css['big-tick']]: tickSize > 4,
          [css['with-error']]: hasError,
          [css['with-success']]: hasSuccess && !hasError,
        },
      ]"
    >
      <div
        v-if="label"
        :class="css.label"
        class="text-body-1"
      >
        {{ label }}
      </div>
      <div
        ref="outer"
        :class="css.outer"
      >
        <div :class="css.inner">
          <input
            v-model="vModel"
            :class="css.input"
            type="range"
            :max="max"
            :min="min"
            :step="step"
            :disabled="disabled"
            v-bind="getNonRootAttrs(attrs)"
          />
          <div :class="css.slider">
            <div :class="css.slider__inner">
              <div :class="[css.slider__container, sliderClass]">
                <div
                  v-if="!hideTrack"
                  :class="css.slider__container__track"
                />
                <div
                  v-if="showTicks && !disabled"
                  :class="css.slider__ticks"
                >
                  <span
                    v-for="i in (ticksData[1] + 1)"
                    :key="i"
                    :class="hideTrack ? [tickClass] : { [css.highlighted]: i - 1 <= ticksData[0], [tickClass]: i - 1 > ticksData[0] }"
                  />
                </div>
              </div>
              <div :class="css.slider__thumb" />
              <div
                v-if="showThumbLabel && !disabled"
                :class="css.slider__thumb_label"
              >
                {{ modelValue }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </label>
    <FormTextDetail
      v-if="!hideDetails"
      class="mt-1"
      :error-messages="errorMessages"
      :success-messages="successMessages"
      :hint="hint"
    />
  </div>
</template>

<style lang="scss" module>
@use '@/styles/colors.scss' as c;

:global(.dark) {
  .wrapper {
    &.disabled {
      .inner {
        .slider {
          &__container {
            @apply bg-rui-grey-800 #{!important};

            &__track {
              @apply bg-rui-grey-700 #{!important};
            }
          }

          &__thumb {
            @apply bg-rui-grey-700 #{!important};
          }
        }
      }
    }

    .inner {
      .slider {
        &__ticks {
          span {
            &.highlighted {
              @apply bg-[#121212];
            }
          }
        }
      }
    }
  }
}

.wrapper {
  @apply flex items-start gap-3;

  &.disabled {
    .label {
      @apply text-rui-text-disabled;
    }
    .inner {
      .slider {
        &__container {
          @apply bg-rui-grey-300 #{!important};

          &__track {
            @apply bg-rui-grey-400 #{!important};
          }
        }

        &__thumb {
          @apply bg-rui-grey-400 #{!important};
        }
      }
    }
  }

  @each $color in c.$context-colors {
    &.#{$color},
    &.with-#{$color} {
      .inner {
        .slider {
          &__container {
            @apply bg-rui-#{$color} bg-opacity-40;

            &__track {
              @apply bg-rui-#{$color};
            }
          }

          &__thumb {
            @apply bg-rui-#{$color};

            &:before {
              @apply bg-rui-#{$color};
            }
          }

          &__ticks {
            span {
              @apply bg-rui-#{$color};
            }
          }
        }
      }

      &.big-tick {
        .inner {
          .slider {
            &__ticks {
              span {
                @apply bg-rui-#{$color}-lighter;

                &.highlighted {
                  @apply bg-rui-#{$color};
                }
              }
            }
          }
        }
      }
    }
  }

  @each $color in ('error', 'success') {
    &.with-#{$color} {
      .label {
        @apply text-rui-#{$color};
      }
    }
  }

  &.vertical {
    @apply flex-col-reverse items-center h-full;

    .label {
      @apply mb-2 text-center;
    }

    .outer {
      @apply min-w-0 min-h-[120px] w-8;
    }

    .inner {
      width: v-bind(sliderHeight);
      height: v-bind(sliderWidth);
      @apply -rotate-90;
      transform-origin: 0 0;
      --tw-translate-y: v-bind(sliderHeight);

      .slider {
        &__thumb {
          &_label {
            @apply mt-6;
            @apply rotate-90 translate-x-0;
            transform-origin: 0 50%;
          }
        }
      }
    }
  }

  .label {
    @apply mt-1 text-rui-text;
  }

  .outer {
    @apply relative h-8 flex-1 min-w-[120px];
  }

  .inner {
    width: v-bind(sliderWidth);
    height: v-bind(sliderHeight);
    @apply relative;

    .input {
      @apply h-full w-full opacity-0 cursor-pointer;

      &:not(:disabled) {
        &:hover {
          ~ .slider {
            .slider {
              &__thumb {
                &:before {
                  @apply scale-100;
                }
              }
            }
          }
        }

        &:active {
          ~ .slider {
            .slider {
              &__thumb {
                &:before {
                  @apply scale-100 opacity-20;
                }

                &_label {
                  @apply opacity-100 visible;
                }
              }
            }
          }
        }
      }
    }

    .slider {
      @apply absolute h-full w-full top-0 px-2 pointer-events-none;

      &__inner {
        @apply relative h-full w-full cursor-pointer;
      }

      &__container {
        @apply absolute top-1/2 transform -translate-y-1/2;
        @apply w-full h-1 rounded-full;

        &__track {
          width: v-bind(trackWidth);
          @apply transition-all ease-linear duration-75 delay-0;
          @apply h-full rounded-full;
        }
      }

      &__ticks {
        @apply h-full absolute top-0;
        @apply flex justify-between items-center;
        margin: 0 calc(v-bind(tickSizeInPx) / -2);
        width: calc(100% + v-bind(tickSizeInPx));

        span {
          @apply rounded-full;
          width: calc(v-bind(tickSizeInPx));
          height: calc(v-bind(tickSizeInPx));

          &.highlighted {
            @apply bg-rui-grey-100;
          }
        }
      }

      &__thumb {
        @apply absolute top-1/2 transition-all ease-linear duration-75 delay-0 transform -translate-y-1/2 -translate-x-1/2;
        @apply w-3 h-3 rounded-full shadow-2;
        left: v-bind(trackWidth);

        &:before {
          @apply w-8 h-8 rounded-full absolute top-1/2 left-1/2;
          @apply opacity-10;
          @apply transition transform -translate-x-1/2 -translate-y-1/2 scale-0;
          content: '';
        }

        &_label {
          left: v-bind(trackWidth);
          @apply invisible opacity-0;
          @apply absolute -mt-7 transition-all ease-linear duration-75 delay-0 transform -translate-x-1/2;
          @apply px-2 py-1 text-xs font-normal;
          @apply bg-rui-grey-700/90 text-white rounded shadow;
        }
      }
    }
  }
}
</style>
