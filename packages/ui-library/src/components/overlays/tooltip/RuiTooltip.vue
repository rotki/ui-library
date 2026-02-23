<script setup lang="ts">
import { type PopperOptions, usePopper } from '@/composables/popper';

export interface Props {
  text?: string | null;
  disabled?: boolean;
  hideArrow?: boolean;
  openDelay?: number;
  closeDelay?: number;
  persistOnTooltipHover?: boolean;
  popper?: PopperOptions;
  tooltipClass?: string;
}

defineOptions({
  name: 'RuiTooltip',
});

const {
  text = null,
  disabled = false,
  hideArrow = false,
  openDelay = 0,
  closeDelay = 500,
  persistOnTooltipHover = false,
  popper = {},
  tooltipClass = '',
} = defineProps<Props>();

defineSlots<{
  activator?: (props: { open: boolean; close: () => void }) => any;
  default?: () => any;
}>();

const tooltipId = useId();

const {
  reference: activator,
  popper: tooltip,
  open,
  popperEnter,
  onOpen,
  onClose,
  onPopperLeave,
  updatePopper,
} = usePopper(
  toRef(() => popper),
  toRef(() => disabled),
  toRef(() => openDelay),
  toRef(() => closeDelay),
);

defineExpose({
  onOpen,
  onClose,
});
</script>

<template>
  <div
    ref="activator"
    :class="$style.wrapper"
    :data-tooltip-disabled="disabled"
    :aria-describedby="!disabled && open ? tooltipId : undefined"
    @mouseover="onOpen()"
    @mouseleave="onClose()"
    @focusin="onOpen()"
    @focusout="onClose()"
  >
    <slot
      name="activator"
      :open="open"
      :close="onClose"
    />

    <Teleport
      v-if="!disabled"
      to="body"
    >
      <div
        v-if="popperEnter"
        :id="tooltipId"
        ref="tooltip"
        :class="[
          $style.tooltip,
          tooltipClass,
          $style[`tooltip__${popper?.strategy ?? 'absolute'}`],
        ]"
        role="tooltip"
      >
        <TransitionGroup
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
          @before-enter="updatePopper()"
          @after-leave="onPopperLeave()"
        >
          <div
            v-if="open"
            key="tooltip"
            :class="$style.base"
            role="tooltip-content"
            @mouseover="persistOnTooltipHover && onOpen()"
            @mouseleave="persistOnTooltipHover && onClose()"
          >
            <slot>
              {{ text }}
            </slot>
          </div>
          <span
            v-if="!hideArrow"
            :class="[$style.arrow, { [$style.arrow__open ?? '']: open }]"
            data-popper-arrow
          />
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" module>
$arrowSize: 0.625rem;
.wrapper {
  @apply relative inline-flex;
}

.tooltip {
  @apply w-max transform transition-opacity delay-0 z-[9999];

  &__fixed {
    @apply fixed;
  }

  &__absolute {
    @apply absolute;
  }

  .base {
    @apply px-2 py-1 text-xs font-normal;
    @apply bg-rui-grey-700/90 text-white rounded shadow;
  }

  .arrow {
    @apply w-2.5 h-2.5 transition-opacity opacity-0;

    &__open {
      @apply opacity-100;
    }

    &::before {
      @apply block border-[0.3125rem] origin-center;
      @apply border-l-transparent border-b-transparent border-t-rui-grey-700/90 border-r-rui-grey-700/90;

      content: '';
      border-radius: 0 0.125rem 0 0;
    }
  }

  &[data-popper-placement*='bottom'] .arrow {
    top: calc(0.5px - #{$arrowSize} / 2);

    &::before {
      @apply -rotate-45;
    }
  }

  &[data-popper-placement*='top'] .arrow {
    bottom: calc(0.5px - #{$arrowSize} / 2);

    &::before {
      @apply rotate-[135deg];
    }
  }

  &[data-popper-placement*='left'] .arrow {
    right: calc(0.5px - #{$arrowSize} / 2);

    &::before {
      @apply rotate-45;
    }
  }

  &[data-popper-placement*='right'] .arrow {
    left: calc(0.5px - #{$arrowSize} / 2);

    &::before {
      @apply -rotate-[135deg];
    }
  }
}
</style>
