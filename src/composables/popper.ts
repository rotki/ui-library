import { createPopper, type Instance, type Placement, type PositioningStrategy, type VirtualElement } from '@popperjs/core';
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

interface UsePopperReturn {
  instance: Ref<Instance | null>;
  leavePending: Ref<boolean>;
  onClose: (immediate?: boolean) => void;
  onLeavePending: () => void;
  onOpen: (immediate?: boolean) => void;
  onPopperLeave: () => void;
  open: Ref<boolean, boolean>;
  popper: Ref<MaybeElement>;
  popperEnter: Ref<boolean>;
  reference: Ref<MaybeElement>;
  updatePopper: () => void;
}

export function usePopper(
  options: Ref<PopperOptions>,
  disabled: Ref<boolean> = ref(false),
  openDelay: Ref<number> = ref(0),
  closeDelay: Ref<number> = ref(0),
  virtualReference?: Ref<Element | VirtualElement>,
): UsePopperReturn {
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

  const modifiers = computed(() => {
    const {
      adaptive = DEFAULT_POPPER_OPTIONS.adaptive,
      gpuAcceleration = DEFAULT_POPPER_OPTIONS.gpuAcceleration,
      locked = DEFAULT_POPPER_OPTIONS.locked,
      offsetDistance = DEFAULT_POPPER_OPTIONS.offsetDistance,
      offsetSkid = DEFAULT_POPPER_OPTIONS.offsetSkid,
      overflowPadding = DEFAULT_POPPER_OPTIONS.overflowPadding,
      resize = DEFAULT_POPPER_OPTIONS.resize,
      scroll = DEFAULT_POPPER_OPTIONS.scroll,
    } = get(options);

    return [{
      enabled: false,
      name: 'hide',
    }, {
      enabled: !locked,
      name: 'flip',
    }, {
      name: 'preventOverflow',
      options: {
        padding: overflowPadding,
      },
    }, {
      name: 'offset',
      options: {
        offset: [offsetSkid, offsetDistance],
      },
    }, {
      name: 'computeStyles',
      options: {
        adaptive,
        gpuAcceleration,
      },
    }, {
      name: 'eventListeners',
      options: {
        resize,
        scroll,
      },
    }, {
      name: 'arrow',
      options: {
        padding: 4,
      },
    }];
  });

  const popperConfig = computed(() => {
    const {
      placement = DEFAULT_POPPER_OPTIONS.placement,
      strategy = DEFAULT_POPPER_OPTIONS.strategy,
    } = get(options);

    return {
      modifiers: get(modifiers),
      placement,
      strategy,
    };
  });

  function initializePopper(onInvalidate: (cleanupFn: () => void) => void) {
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

    const value = createPopper(referenceEl, popperEl, get(popperConfig));

    set(instance, value);
    onInvalidate(value.destroy);
  }

  useResizeObserver([reference, popper], async () => {
    const instanceVal = get(instance);
    if (get(open) && instanceVal)
      await instanceVal.update();
  });

  onMounted(() => {
    watchEffect((onInvalidate) => {
      initializePopper(onInvalidate);
    });
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
