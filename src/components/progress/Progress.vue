<script lang="ts" setup>
import { type ContextColorsType } from '@/consts/colors';

export interface Props {
  /**
   * in percentage value, required when variant === determinate or buffer
   * @example - 0 <= value <= 100
   */
  value?: number;
  /**
   * in percentage value, required when variant === buffer
   * @example - 0 <= value <= 100
   */
  bufferValue?: number;
  variant?: 'determinate' | 'indeterminate' | 'buffer';
  color?: ContextColorsType | 'inherit';
  circular?: boolean;
  showLabel?: boolean;
  /**
   * Sets the stroke thickness in pixels
   */
  thickness?: number | string;
  /**
   * only used for circular progress
   */
  size?: number | string;
}

defineOptions({
  name: 'RuiProgress',
});

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  bufferValue: 0,
  variant: 'determinate',
  color: 'inherit',
  circular: false,
  showLabel: false,
  thickness: 4,
  size: 32,
});

const css = useCssModule();

const { variant, value, bufferValue, thickness, size } = toRefs(props);

const currentValue = computed(() =>
  Math.max(0, Math.min(get(value) ?? 100, 100)),
);

const label = computed(() => `${Math.floor(get(currentValue))}%`);

const progress = computed(() => -100 + get(currentValue));

const valuePercent = computed(() => `${get(progress)}%`);

const bufferPercent = computed(
  () => `${-100 + Math.max(0, Math.min(get(bufferValue) ?? 100, 100))}%`,
);

const circularScaledThickness = computed(
  () => (+get(thickness) * 32) / +get(size),
);

const circularViewSize = computed(() => 40 + get(circularScaledThickness));
</script>

<template>
  <div
    :class="[
      css.wrapper,
      circular ? 'inline-flex' : 'w-full',
      { [css['has-label']]: showLabel && variant !== 'indeterminate' },
    ]"
  >
    <div
      :aria-valuenow="value"
      :class="[
        circular && variant !== 'buffer' ? css.circular : css.progress,
        css[variant ?? ''],
        css[color ?? ''],
      ]"
      aria-valuemax="100"
      aria-valuemin="0"
      role="progressbar"
    >
      <svg
        v-if="circular && variant !== 'buffer'"
        :viewBox="`0 0 ${circularViewSize} ${circularViewSize}`"
      >
        <circle
          cx="50%"
          cy="50%"
          fill="none"
          r="20"
          :stroke-width="circularScaledThickness"
        />
      </svg>
      <template v-else>
        <div v-if="variant === 'buffer'" :class="css['buffer-dots']" />
        <div
          :class="[css.rail, { [css['buffer-rail']]: variant === 'buffer' }]"
        />
        <div :class="css[variant ?? '']" />
      </template>
    </div>
    <div v-if="showLabel && variant !== 'indeterminate'" :class="css.label">
      {{ label }}
    </div>
  </div>
</template>

<style lang="scss" module>
$colors: 'primary', 'secondary';

.wrapper {
  &.has-label {
    @apply inline-flex items-center relative;

    .label {
      @apply block text-sm ml-4;
    }

    .circular ~ .label {
      @apply absolute flex items-center justify-center text-[0.625rem] ml-0;
      width: calc(v-bind(size) * 1px);
      height: calc(v-bind(size) * 1px);
    }
  }

  .progress {
    @apply w-full overflow-hidden relative;
    height: calc(v-bind(thickness) * 1px);

    .rail {
      @apply w-full h-full;
    }

    .determinate,
    .buffer {
      @apply transition-all duration-150 ease-in-out absolute left-0 top-0 h-full w-full;
      transform: translateX(v-bind(valuePercent));
    }

    .indeterminate {
      @apply absolute left-0 top-0 h-full w-auto transition-transform duration-200 ease-linear delay-0 origin-left;
      animation: 1.6s cubic-bezier(0.65, 0.815, 0.735, 0.395) 0s infinite normal
        none running slide-rail;
    }

    .buffer-dots {
      @apply absolute h-0 w-[200%] -top-px -left-[100%] border-dashed border-y-[0.2rem];
      animation: 3s ease-in-out 3s infinite normal none running buffer-pulse;
    }

    .buffer-rail {
      @apply w-full transition-transform duration-200 ease-linear delay-0 origin-left;
      transform: translateX(v-bind(bufferPercent));
    }

    @each $color in $colors {
      &.#{$color} {
        .rail {
          @apply bg-rui-#{$color}/20;
        }

        .determinate,
        .indeterminate,
        .buffer {
          @apply bg-rui-#{$color};
        }

        .buffer-dots {
          @apply border-rui-#{$color}/20;
        }
      }
    }

    &.inherit {
      .rail {
        @apply bg-current opacity-20;
      }

      .determinate,
      .indeterminate,
      .buffer {
        @apply bg-current;
      }

      .buffer-dots {
        @apply border-current opacity-20;
      }
    }
  }

  .circular {
    @apply inline-block;
    width: calc(v-bind(size) * 1px);
    height: calc(v-bind(size) * 1px);

    @each $color in $colors {
      &.#{$color} {
        @apply text-rui-#{$color};
      }
    }

    &.indeterminate {
      @apply animate-[spin_1.4s_linear_infinite];

      svg {
        circle {
          stroke-dasharray: 80px, 200px;
          stroke-dashoffset: 0;
          stroke-linecap: round;
          -webkit-animation: collapse-stroke 1.4s ease-in-out infinite;
          animation: collapse-stroke 1.4s ease-in-out infinite;
        }
      }
    }

    &.determinate {
      @apply -rotate-90;

      svg {
        circle {
          stroke-dasharray: 126.92;
          stroke-dashoffset: calc(v-bind(progress) / 100 * -126.92);
          -webkit-transition: stroke-dashoffset 300ms
            cubic-bezier(0.4, 0, 0.2, 1) 0ms;
          transition: stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        }
      }
    }

    &.inherit {
      @apply text-current;
    }

    svg {
      @apply block;

      circle {
        stroke: currentColor;
      }
    }
  }
}

:global(.dark) {
  .wrapper {
    &.has-label {
      .label {
        @apply text-white;
      }
    }
  }
}

@-webkit-keyframes buffer-pulse {
  0% {
    opacity: 0.2;
    left: -100%;
  }
  50% {
    opacity: 1.5;
    left: -100%;
  }
  60% {
    opacity: 0.4;
    left: -75%;
  }
  100% {
    opacity: 0.2;
    left: -100%;
  }
}

@keyframes buffer-pulse {
  0% {
    opacity: 0.2;
    left: -100%;
  }
  50% {
    opacity: 1.5;
    left: -100%;
  }
  60% {
    opacity: 0.4;
    left: -75%;
  }
  100% {
    opacity: 0.2;
    left: -100%;
  }
}

@-webkit-keyframes slide-rail {
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
}

@keyframes slide-rail {
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
}

@-webkit-keyframes collapse-stroke {
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
}

@keyframes collapse-stroke {
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
}
</style>
