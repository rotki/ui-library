<script setup lang="ts">
import type { Reactive } from 'vue';
import type { VueClassValue } from '@/types/class-value';
import { ButtonGroupBoundary } from '@/components/buttons/button-group/button-group-context';
import { type FloatingOptions, useFloating, type UseFloatingReturn } from '@/composables/floating';
import { cn } from '@/utils/tv';
import { tooltipPopoverStyles, tooltipRootStyles, tooltipStyles } from './tooltip-styles';

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

const tooltipId = useId();
const activator = useTemplateRef<HTMLElement>('activator');
const tooltip = useTemplateRef<HTMLElement>('tooltip');
// Owned by this component, so a setup run on first use still stops on unmount
const setupScope = effectScope();
const floating = shallowRef<Reactive<UseFloatingReturn>>();

const open = computed<boolean>(() => get(floating)?.open ?? false);
const visible = computed<boolean>(() => get(floating)?.visible ?? false);

type PlacementSide = 'bottom' | 'left' | 'right' | 'top';

/**
 * Sets the floating state up on the first hover, focus or `onOpen`, so a
 * table with a tooltip on every row pays only for the tooltips it shows. An
 * event that reaches the activator after unmount gets nothing back.
 */
function setUp(): Reactive<UseFloatingReturn> | undefined {
  if (setupScope.active && !disabled && !get(floating)) {
    set(floating, setupScope.run(() => reactive(useFloating(
      () => options ?? {},
      () => disabled,
      () => openDelay,
      () => closeDelay,
      () => get(activator) ?? undefined,
      tooltip,
    ))));
  }
  return setupScope.active ? get(floating) : undefined;
}

function onOpen(immediate?: boolean): void {
  setUp()?.onOpen(immediate);
}

function onClose(immediate?: boolean): void {
  if (setupScope.active)
    get(floating)?.onClose(immediate);
}

function placementSide(placement: string): PlacementSide {
  if (placement.startsWith('top'))
    return 'top';
  if (placement.startsWith('left'))
    return 'left';
  if (placement.startsWith('right'))
    return 'right';
  return 'bottom';
}

defineExpose({
  onOpen,
  onClose,
});
</script>

<template>
  <div
    ref="activator"
    v-bind="{ ...$attrs, class: undefined }"
    :class="tooltipRootStyles({ class: cn($attrs.class) })"
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
      v-if="!disabled && floating"
      to="body"
    >
      <div
        v-if="visible"
        :id="tooltipId"
        ref="tooltip"
        :class="tooltipPopoverStyles({ class: cn(classNames?.tooltip) })"
        :role="open ? 'tooltip' : undefined"
        :data-placement="floating.currentPlacement"
      >
        <TransitionGroup
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
          @before-enter="floating?.updatePosition()"
          @after-leave="floating?.onLeaveComplete()"
        >
          <div
            v-if="open"
            key="tooltip"
            class="px-2 py-1.5 text-xs font-normal wrap-break-word bg-rui-neutral-900 dark:bg-rui-neutral-700 text-white rounded-rui-control shadow-rui-tooltip"
            data-id="content"
            @mouseover="persistOnTooltipHover && onOpen()"
            @mouseleave="persistOnTooltipHover && onClose()"
          >
            <ButtonGroupBoundary>
              <slot>
                {{ text }}
              </slot>
            </ButtonGroupBoundary>
          </div>
          <span
            v-if="!hideArrow"
            key="arrow"
            :class="tooltipStyles({ open, side: placementSide(floating.currentPlacement) }).arrow()"
            data-id="arrow"
          >
            <span :class="tooltipStyles({ open, side: placementSide(floating.currentPlacement) }).diamond()" />
          </span>
        </TransitionGroup>
      </div>
    </Teleport>
  </div>
</template>
