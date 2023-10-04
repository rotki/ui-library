import { onMounted, ref, watchEffect } from 'vue';
import {
  type VirtualElement,
  defaultModifiers,
  popperGenerator,
} from '@popperjs/core/lib/popper-lite';
import arrow from '@popperjs/core/lib/modifiers/arrow';
import flip from '@popperjs/core/lib/modifiers/flip';
import offset from '@popperjs/core/lib/modifiers/offset';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import computeStyles from '@popperjs/core/lib/modifiers/computeStyles';
import eventListeners from '@popperjs/core/lib/modifiers/eventListeners';
import { type MaybeElement, unrefElement } from '@vueuse/core';
import type { Instance, Placement, PositioningStrategy } from '@popperjs/core';
import type { Ref } from 'vue';

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
  locked: false,
  overflowPadding: 8,
  offsetDistance: 8,
  offsetSkid: 0,
  gpuAcceleration: true,
  adaptive: true,
  scroll: true,
  resize: true,
  placement: 'bottom',
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

export const usePopper = (
  options: Ref<PopperOptions>,
  disabled: Ref<boolean> = ref(false),
  openDelay: Ref<number> = ref(0),
  closeDelay: Ref<number> = ref(0),
  virtualReference?: Ref<Element | VirtualElement>,
) => {
  const reference: Ref<MaybeElement | null> = ref(null);
  const popper: Ref<MaybeElement | null> = ref(null);
  const instance: Ref<Instance | null> = ref(null);
  const open: Ref<boolean> = ref(false);
  const openTimeout: Ref<NodeJS.Timeout | undefined> = ref();
  const closeTimeout: Ref<NodeJS.Timeout | undefined> = ref();
  const popperEnter: Ref<boolean> = ref(false);

  const onPopperLeave = () => {
    set(popperEnter, false);
  };

  const updatePopper = () => {
    get(instance)?.update();
  };

  const onMouseOver = () => {
    if (get(disabled)) {
      return;
    }
    if (get(closeTimeout)) {
      clearTimeout(get(closeTimeout));
      set(closeTimeout, undefined);
    }

    set(popperEnter, true);

    if (!get(openTimeout)) {
      const timeout = setTimeout(() => {
        set(open, true);
        set(openTimeout, undefined);
      }, get(openDelay));

      set(openTimeout, timeout);
    }
  };

  const onMouseLeave = () => {
    if (get(disabled)) {
      return;
    }
    if (get(openTimeout)) {
      clearTimeout(get(openTimeout));
      set(openTimeout, undefined);
    }

    if (!get(closeTimeout)) {
      const timeout = setTimeout(() => {
        set(open, false);
        set(closeTimeout, undefined);
      }, get(closeDelay));

      set(closeTimeout, timeout);
    }
  };

  onMounted(() => {
    watchEffect((onInvalidate) => {
      if (!get(popper)) {
        return;
      }
      if (!get(reference) && !get(virtualReference)) {
        return;
      }

      const popperEl = unrefElement(popper);
      const referenceEl = get(virtualReference) || unrefElement(reference);

      if (!(popperEl instanceof HTMLElement)) {
        return;
      }
      if (!referenceEl) {
        return;
      }

      const {
        locked = DEFAULT_POPPER_OPTIONS.locked,
        overflowPadding = DEFAULT_POPPER_OPTIONS.overflowPadding,
        offsetDistance = DEFAULT_POPPER_OPTIONS.offsetDistance,
        offsetSkid = DEFAULT_POPPER_OPTIONS.offsetSkid,
        gpuAcceleration = DEFAULT_POPPER_OPTIONS.gpuAcceleration,
        adaptive = DEFAULT_POPPER_OPTIONS.adaptive,
        scroll = DEFAULT_POPPER_OPTIONS.scroll,
        resize = DEFAULT_POPPER_OPTIONS.resize,
        placement = DEFAULT_POPPER_OPTIONS.placement,
        strategy = DEFAULT_POPPER_OPTIONS.strategy,
      } = get(options);

      const value = createPopper(referenceEl, popperEl, {
        placement,
        strategy,
        modifiers: [
          {
            name: 'flip',
            enabled: !locked,
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
              scroll,
              resize,
            },
          },
          {
            name: 'arrow',
            options: {
              padding: 4,
            },
          },
        ],
      });

      set(instance, value);

      onInvalidate(value.destroy);
    });
  });

  return {
    reference,
    popper,
    instance,
    open,
    popperEnter,
    onMouseOver,
    onMouseLeave,
    onPopperLeave,
    updatePopper,
  };
};
