<script setup lang="ts">
import type { VueClassValue } from '@/types/class-value';
import { type FloatingOptions, useFloating } from '@/composables/floating';
import { cn, tv } from '@/utils/tv';
import { tooltipStyles } from './tooltip-styles';

export interface RuiTooltipClassNames {
  root?: VueClassValue;
  tooltip?: VueClassValue;
}

export interface Props {
  text?: string | null;
  disabled?: boolean;
  hideArrow?: boolean;
  openDelay?: number;
  closeDelay?: number;
  persistOnTooltipHover?: boolean;
  options?: FloatingOptions;
  classNames?: RuiTooltipClassNames;
}

defineOptions({
  name: 'RuiTooltip',
  inheritAttrs: false,
});

const {
  text = null,
  disabled = false,
  hideArrow = false,
  openDelay = 0,
  closeDelay = 500,
  persistOnTooltipHover = false,
  options,
  classNames,
} = defineProps<Props>();

defineSlots<{
  activator?: (props: { open: boolean; close: () => void }) => any;
  default?: () => any;
}>();

const rootStyle = tv({ base: 'relative inline-flex' });

// wraps at `--rui-tooltip-max-width`; a `max-w-*` in `classNames.tooltip` replaces it
const popoverStyle = tv({ base: 'w-max max-w-rui-tooltip z-rui-tooltip' });

const tooltipId = useId();

const {
  reference: activator,
  popover: tooltip,
  open,
  visible,
  currentPlacement,
  onOpen,
  onClose,
  onLeaveComplete,
  updatePosition,
} = useFloating(
  () => options ?? {},
  () => disabled,
  () => openDelay,
  () => closeDelay,
);

type PlacementSide = 'bottom' | 'left' | 'right' | 'top';

const placementSide = computed<PlacementSide>(() => {
  const placement = get(currentPlacement);
  if (placement.startsWith('top'))
    return 'top';
  if (placement.startsWith('left'))
    return 'left';
  if (placement.startsWith('right'))
    return 'right';
  return 'bottom';
});

defineExpose({
  onOpen,
  onClose,
});
</script>

<template>
  <div
    ref="activator"
    v-bind="{ ...$attrs, class: undefined }"
    :class="rootStyle({ class: cn($attrs.class) })"
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
        v-if="visible"
        :id="tooltipId"
        ref="tooltip"
        :class="popoverStyle({ class: cn(classNames?.tooltip) })"
        :role="open ? 'tooltip' : undefined"
        :data-placement="currentPlacement"
      >
        <TransitionGroup
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
          @before-enter="updatePosition()"
          @after-leave="onLeaveComplete()"
        >
          <div
            v-if="open"
            key="tooltip"
            class="px-2 py-1.5 text-xs font-normal wrap-break-word bg-rui-neutral-900 dark:bg-rui-neutral-700 text-white rounded-rui-control shadow-rui-tooltip"
            data-id="content"
            @mouseover="persistOnTooltipHover && onOpen()"
            @mouseleave="persistOnTooltipHover && onClose()"
          >
            <slot>
              {{ text }}
            </slot>
          </div>
          <span
            v-if="!hideArrow"
            key="arrow"
            :class="tooltipStyles({ open, side: placementSide }).arrow()"
            data-id="arrow"
          >
            <span :class="tooltipStyles({ open, side: placementSide }).diamond()" />
          </span>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>
