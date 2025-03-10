import type { Instance, Placement, PositioningStrategy } from '@popperjs/core';
import arrow from '@popperjs/core/lib/modifiers/arrow';
import computeStyles from '@popperjs/core/lib/modifiers/computeStyles';
import eventListeners from '@popperjs/core/lib/modifiers/eventListeners';
import flip from '@popperjs/core/lib/modifiers/flip';
import offset from '@popperjs/core/lib/modifiers/offset';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import {
  defaultModifiers,
  popperGenerator,
  type VirtualElement,
} from '@popperjs/core/lib/popper-lite';
import { type MaybeElement, unrefElement } from '@vueuse/core';
import { onMounted, type Ref, ref, watchEffect } from 'vue';

export interface PopperOptions {
  locked?: boolean;
  overflowPadding?: number;
  offsetDistance?: number;
  offsetSkid?: number;
  placement?: Placement;
  strategy?: PositioningStrategy;
  gpuAcceleration?: boolean;
  adaptive?: boolean;
  scroll?: boolean;
  resize?: boolean;
}

export const DEFAULT_POPPER_OPTIONS: PopperOptions = {
  adaptive: true,
  gpuAcceleration: true,
  locked: false,
  offsetDistance: 8,
  offsetSkid: 0,
  overflowPadding: 8,
  placement: 'bottom',
  resize: true,
  scroll: true,
  strategy: 'absolute',
};

export const createPopper = popperGenerator({
  defaultModifiers: [
    ...defaultModifiers,
    arrow,
    offset,
    flip,
    preventOverflow,
    computeStyles,
    eventListeners,
  ],
});

export function usePopper(options: Ref<PopperOptions>, disabled: Ref<boolean> = ref(false), openDelay: Ref<number> = ref(0), closeDelay: Ref<number> = ref(0), virtualReference?: Ref<Element | VirtualElement>) {
  const reference: Ref<MaybeElement | null> = ref(null);
  const popper: Ref<MaybeElement | null> = ref(null);
  const instance: Ref<Instance | null> = ref(null);
  const open: Ref<boolean> = ref(false);
  const openTimeout: Ref<NodeJS.Timeout | undefined> = ref();
  const closeTimeout: Ref<NodeJS.Timeout | undefined> = ref();
  const popperEnter: Ref<boolean> = ref(false);
  const leavePending = ref(false);

  const onPopperLeave = () => {
    set(popperEnter, false);
  };

  const updatePopper = () => {
    // todo: see making things async/await has any side-effects
    get(instance)?.update();
  };

  const onOpen = (immediate = false) => {
    if (get(disabled))
      return;

    if (get(closeTimeout)) {
      clearTimeout(get(closeTimeout));
      set(closeTimeout, undefined);
    }

    set(leavePending, false);
    if (!get(openTimeout)) {
      set(popperEnter, true);

      const timeout = setTimeout(() => {
        set(open, true);
        set(openTimeout, undefined);
      }, immediate ? 0 : get(openDelay));

      set(openTimeout, timeout);
    }
  };

  const onClose = (immediate = false) => {
    if (get(disabled))
      return;

    if (get(openTimeout)) {
      clearTimeout(get(openTimeout));
      set(openTimeout, undefined);
    }

    if (!get(closeTimeout)) {
      const timeout = setTimeout(() => {
        if (!get(open))
          onPopperLeave();

        set(open, false);
        set(closeTimeout, undefined);
      }, immediate ? 0 : get(closeDelay));

      set(closeTimeout, timeout);
    }
  };

  const onLeavePending = () => {
    set(leavePending, true);
  };

  onMounted(() => {
    watchEffect((onInvalidate) => {
      if (!get(popper))
        return;

      if (!get(reference) && !get(virtualReference))
        return;

      const popperEl = unrefElement(popper);
      const referenceEl = get(virtualReference) || unrefElement(reference);

      if (!(popperEl instanceof HTMLElement))
        return;

      if (!referenceEl)
        return;

      const {
        adaptive = DEFAULT_POPPER_OPTIONS.adaptive,
        gpuAcceleration = DEFAULT_POPPER_OPTIONS.gpuAcceleration,
        locked = DEFAULT_POPPER_OPTIONS.locked,
        offsetDistance = DEFAULT_POPPER_OPTIONS.offsetDistance,
        offsetSkid = DEFAULT_POPPER_OPTIONS.offsetSkid,
        overflowPadding = DEFAULT_POPPER_OPTIONS.overflowPadding,
        placement = DEFAULT_POPPER_OPTIONS.placement,
        resize = DEFAULT_POPPER_OPTIONS.resize,
        scroll = DEFAULT_POPPER_OPTIONS.scroll,
        strategy = DEFAULT_POPPER_OPTIONS.strategy,
      } = get(options);

      const value = createPopper(referenceEl, popperEl, {
        modifiers: [
          {
            enabled: !locked,
            name: 'flip',
          },
          {
            name: 'preventOverflow',
            options: {
              padding: overflowPadding,
            },
          },
          {
            name: 'offset',
            options: {
              offset: [offsetSkid, offsetDistance],
            },
          },
          {
            name: 'computeStyles',
            options: {
              adaptive,
              gpuAcceleration,
            },
          },
          {
            name: 'eventListeners',
            options: {
              resize,
              scroll,
            },
          },
          {
            name: 'arrow',
            options: {
              padding: 4,
            },
          },
        ],
        placement,
        strategy,
      });

      set(instance, value);

      onInvalidate(value.destroy);
    });
  });

  useResizeObserver([reference, popper], async () => {
    const instanceVal = get(instance);
    if (get(open) && instanceVal)
      await instanceVal.update();
  });

  return {
    instance,
    leavePending,
    onClose,
    onLeavePending,
    onOpen,
    onPopperLeave,
    open,
    popper,
    popperEnter,
    reference,
    updatePopper,
  };
}
