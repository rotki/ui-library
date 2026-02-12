import {
  createPopper,
  type Instance,
  type Placement,
  type PositioningStrategy,
  type StrictModifiers,
  type VirtualElement,
} from '@popperjs/core';
import { type MaybeElement, unrefElement } from '@vueuse/core';
import { onMounted, type Ref, ref, watchEffect } from 'vue';
import { useTimeoutManager } from './timeout-manager';

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
  instance: Ref<Instance | undefined>;
  leavePending: Ref<boolean>;
  onClose: (immediate?: boolean) => void;
  onLeavePending: () => void;
  onOpen: (immediate?: boolean) => void;
  onPopperLeave: () => void;
  open: Ref<boolean, boolean>;
  popper: Ref<MaybeElement>;
  popperEnter: Ref<boolean>;
  reference: Ref<HTMLElement | undefined>;
  updatePopper: () => Promise<void>;
}

export function usePopper(
  options: Ref<PopperOptions>,
  disabled: Ref<boolean> = ref(false),
  openDelay: Ref<number> = ref(0),
  closeDelay: Ref<number> = ref(0),
  virtualReference?: Ref<Element | VirtualElement>,
): UsePopperReturn {
  const reference = ref<HTMLElement>();
  const popper = ref<MaybeElement>();
  const instance = ref<Instance>();
  const open = ref<boolean>(false);
  const popperEnter = ref<boolean>(false);
  const leavePending = ref<boolean>(false);

  const openTimeoutManager = useTimeoutManager();
  const closeTimeoutManager = useTimeoutManager();

  const onPopperLeave = (): void => {
    set(popperEnter, false);
  };

  const updatePopper = async (): Promise<void> => {
    await get(instance)?.update();
  };

  const onOpen = (immediate: boolean = false): void => {
    if (get(disabled))
      return;

    closeTimeoutManager.clear();

    set(leavePending, false);
    if (!openTimeoutManager.isActive()) {
      set(popperEnter, true);

      openTimeoutManager.create(
        () => {
          set(open, true);
        },
        immediate ? 0 : get(openDelay),
      );
    }
  };

  const onClose = (immediate: boolean = false): void => {
    if (get(disabled))
      return;

    openTimeoutManager.clear();

    if (!closeTimeoutManager.isActive()) {
      closeTimeoutManager.create(
        () => {
          if (!get(open))
            onPopperLeave();

          set(open, false);
        },
        immediate ? 0 : get(closeDelay),
      );
    }
  };

  const onLeavePending = (): void => {
    set(leavePending, true);
  };

  const modifiers = computed<StrictModifiers[]>(() => {
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

    return [
      {
        enabled: false,
        name: 'hide',
      },
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
    ];
  });

  const popperConfig = computed<{
    modifiers: StrictModifiers[];
    placement: Placement | undefined;
    strategy: PositioningStrategy | undefined;
  }>(() => {
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

  function getValidElements(): {
    popperEl: HTMLElement;
    referenceEl: Element | VirtualElement;
  } | null {
    if (!get(popper) || (!get(reference) && !get(virtualReference))) {
      return null;
    }

    const popperEl = unrefElement(popper);
    const referenceEl = get(virtualReference) || unrefElement(reference);

    if (!(popperEl instanceof HTMLElement) || !referenceEl) {
      return null;
    }

    return { popperEl, referenceEl };
  }

  function initializePopper(onInvalidate: (cleanupFn: () => void) => void): void {
    const elements = getValidElements();
    if (!elements)
      return;

    const { popperEl, referenceEl } = elements;

    const value = createPopper(referenceEl, popperEl, get(popperConfig));

    set(instance, value);
    onInvalidate(value.destroy);
  }

  useResizeObserver([reference, popper], async () => {
    if (isDefined(instance))
      await get(instance).update();
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
