<script setup lang="ts">
import { type PopperOptions, usePopper } from '@/composables/popper';

export interface Props {
  text?: string | null;
  disabled?: boolean;
  hideArrow?: boolean;
  openDelay?: number;
  closeDelay?: number;
  popper?: PopperOptions;
}

defineOptions({
  name: 'RuiTooltip',
});

const props = withDefaults(defineProps<Props>(), {
  text: null,
  disabled: false,
  hideArrow: false,
  openDelay: 0,
  closeDelay: 500,
  popper: () => ({}),
});

const css = useCssModule();

const { closeDelay, openDelay, popper, disabled } = toRefs(props);

const {
  reference: trigger,
  popper: tooltip,
  open,
  onMouseOver,
  onMouseLeave,
} = usePopper(popper, disabled, openDelay, closeDelay);
</script>

<template>
  <div
    ref="trigger"
    :class="css.wrapper"
    :data-tooltip-disabled="disabled"
    @mouseover="onMouseOver()"
    @mouseleave="onMouseLeave()"
  >
    <div :class="css.trigger">
      <slot :open="open" />
    </div>
    <div
      v-if="open && !disabled"
      ref="tooltip"
      :class="css.tooltip"
      role="tooltip"
    >
      <Transition
        appear
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
        <div>
          <div :class="css.base">
            <slot name="text">
              {{ text }}
            </slot>
          </div>
          <span v-if="!hideArrow" data-popper-arrow :class="css.arrow" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  @apply relative inline-flex;

  .trigger {
    @apply inline;
  }

  .tooltip {
    @apply max-w-xs;
    @apply z-20;

    .base {
      @apply h-6 px-2 py-1 text-xs font-normal truncate;
      @apply bg-rui-grey-700/90 text-white rounded shadow;
    }

    .arrow {
      @apply w-2.5 h-2.5 absolute;

      &::before {
        @apply block border-[0.3125rem] origin-center;
        @apply border-l-transparent border-b-transparent border-t-rui-grey-700/90 border-r-rui-grey-700/90;

        content: '';
        border-radius: 0 0.125rem 0 0;
      }
    }

    &[data-popper-placement*='bottom'] .arrow {
      top: calc(0.5px + 0.625rem * -1 / 2);

      &::before {
        @apply -rotate-45;
      }
    }

    &[data-popper-placement*='top'] .arrow {
      bottom: calc(0.5px + 0.625rem * -1 / 2);

      &::before {
        @apply rotate-[135deg];
      }
    }

    &[data-popper-placement*='left'] .arrow {
      right: calc(0.5px + 0.625rem * -1 / 2);

      &::before {
        @apply rotate-45;
      }
    }

    &[data-popper-placement*='right'] .arrow {
      left: calc(0.5px + 0.625rem * -1 / 2);

      &::before {
        @apply -rotate-[135deg];
      }
    }
  }
}
</style>
