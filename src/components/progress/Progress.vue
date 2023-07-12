<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /**
     * required when variant === determinate or buffer
     * @example - 0 <= value <= 1
     */
    value?: number;
    /**
     * required when variant === buffer
     * @example - 0 <= value <= 1
     */
    bufferValue?: number;
    variant?: 'determinate' | 'indeterminate' | 'buffer';
    color?: 'primary' | 'secondary' | 'inherit';
    circular?: boolean;
    showLabel?: boolean;
  }>(),
  {
    value: 0,
    bufferValue: 0,
    variant: 'determinate',
    color: 'primary',
    circular: false,
    showLabel: false,
  }
);

const css = useCssModule();

const { variant, value, bufferValue } = toRefs(props);

const currentValue = computed(
  () => Math.max(0, Math.min(get(value) ?? 1, 1)) * 100
);

const label = computed(() => `${Math.floor(get(currentValue))}%`);

const progress = computed(() => -100 + get(currentValue));

const valuePercent = computed(() => `${get(progress)}%`);

const bufferPercent = computed(
  () => `${-100 + Math.max(0, Math.min(get(bufferValue) ?? 1, 1)) * 100}%`
);
</script>

<template>
  <div
    :class="[
      css.wrapper,
      circular ? 'w-8' : 'w-full',
      { [css['has-label']]: showLabel && variant !== 'indeterminate' },
    ]"
  >
    <div
      :aria-valuenow="value * 100"
      :class="[
        circular && variant !== 'buffer' ? css.circular : css.progress,
        css[variant ?? ''],
        css[color ?? ''],
      ]"
      aria-valuemax="100"
      aria-valuemin="0"
      role="progressbar"
    >
      <svg v-if="circular && variant !== 'buffer'" viewBox="22 22 44 44">
        <circle cx="44" cy="44" fill="none" r="20.2" stroke-width="4" />
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
      @apply absolute flex w-full h-full items-center justify-center text-[0.625rem] ml-0;
    }
  }

  .progress {
    @apply w-full overflow-hidden relative;

    .rail {
      @apply w-full h-1;
    }

    .determinate,
    .buffer {
      @apply transition-all duration-150 ease-in-out absolute left-0 top-0 h-1 w-full;
      transform: translateX(v-bind(valuePercent));
    }

    .indeterminate {
      @apply absolute left-0 top-0 h-1 w-auto transition-transform duration-200 ease-linear delay-0;
      transform-origin: left center;
      animation: 1.6s cubic-bezier(0.65, 0.815, 0.735, 0.395) 0s infinite normal
        none running slide-rail;
    }

    .buffer-dots {
      @apply absolute h-0 w-[200%] -top-px -left-[100%] border-dashed border-y-[0.2rem];
      animation: 3s ease-in-out 3s infinite normal none running buffer-pulse;
    }

    .buffer-rail {
      @apply w-full transition-transform duration-200 ease-linear delay-0;
      transform-origin: left center;
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
    @apply w-8 h-8 inline-block;

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
