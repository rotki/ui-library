<script setup lang="ts">
import type { VueClassValue } from '@/types/class-value';
import { type PopperOptions, usePopper } from '@/composables/popper';
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
  popper?: PopperOptions;
  classNames?: RuiTooltipClassNames;
  /** @deprecated Use `classNames.tooltip` instead */
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
  classNames,
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
  currentPlacement,
  onOpen,
  onClose,
  onPopperLeave,
  updatePopper,
} = usePopper(
  () => popper,
  () => disabled,
  () => openDelay,
  () => closeDelay,
);

type PlacementSide = 'top' | 'bottom' | 'left' | 'right';

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
    class="relative inline-flex"
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
        class="w-max z-[9999]"
        :class="[
          classNames?.tooltip ?? tooltipClass,
          popper?.strategy === 'fixed' ? 'fixed' : 'absolute',
        ]"
        role="tooltip"
        :data-placement="currentPlacement"
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
            class="px-2 py-2 text-xs font-normal bg-rui-grey-700/90 text-white rounded shadow"
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
