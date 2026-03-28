import {
  arrow,
  autoUpdate,
  computePosition,
  type ComputePositionReturn,
  flip,
  type VirtualElement as FloatingVirtualElement,
  type Middleware,
  offset,
  shift,
} from '@floating-ui/dom';
import { type MaybeElement, unrefElement } from '@vueuse/core';
import { type MaybeRefOrGetter, onMounted, type Ref, ref, watchEffect } from 'vue';
import { useTimeoutManager } from './timeout-manager';

type VirtualElement = FloatingVirtualElement;

export const Placement = {
  bottom: 'bottom',
  bottomEnd: 'bottom-end',
  bottomStart: 'bottom-start',
  left: 'left',
  leftEnd: 'left-end',
  leftStart: 'left-start',
  right: 'right',
  rightEnd: 'right-end',
  rightStart: 'right-start',
  top: 'top',
  topEnd: 'top-end',
  topStart: 'top-start',
} as const;

export type Placement = (typeof Placement)[keyof typeof Placement];

export const Strategy = {
  absolute: 'absolute',
  fixed: 'fixed',
} as const;

export type Strategy = (typeof Strategy)[keyof typeof Strategy];

export interface FloatingOptions {
  /** Preferred placement relative to the reference element. @default Placement.bottom */
  placement?: Placement;
  /** CSS positioning strategy. @default Strategy.absolute */
  strategy?: Strategy;
  /** Main-axis and/or cross-axis offset from the reference element. @default 2 */
  offset?: number | { mainAxis?: number; crossAxis?: number };
  /** Whether to flip to the opposite side when overflowing. @default true */
  flip?: boolean;
  /** Padding from viewport edges for shift middleware. @default 8 */
  shiftPadding?: number;
  /** Whether to auto-update position on scroll/resize. @default true */
  autoUpdate?: boolean | { scroll?: boolean; resize?: boolean };
}

export const DEFAULT_FLOATING_OPTIONS: Required<FloatingOptions> = {
  autoUpdate: true,
  flip: true,
  offset: 2,
  placement: Placement.bottom,
  shiftPadding: 8,
  strategy: Strategy.absolute,
};

export interface UseFloatingReturn {
  currentPlacement: Readonly<Ref<Placement>>;
  leavePending: Ref<boolean>;
  onClose: (immediate?: boolean) => void;
  onLeaveComplete: () => void;
  onLeavePending: () => void;
  onOpen: (immediate?: boolean) => void;
  open: Ref<boolean>;
  popover: Ref<MaybeElement>;
  reference: Ref<HTMLElement | undefined>;
  updatePosition: () => Promise<void>;
  visible: Ref<boolean>;
}

function buildMiddleware(opts: FloatingOptions, arrowEl: HTMLElement | null): Middleware[] {
  const mw: Middleware[] = [];

  const off = opts.offset ?? DEFAULT_FLOATING_OPTIONS.offset;
  if (typeof off === 'number') {
    mw.push(offset(off));
  }
  else {
    const defaultOffset = typeof DEFAULT_FLOATING_OPTIONS.offset === 'number' ? DEFAULT_FLOATING_OPTIONS.offset : 0;
    mw.push(offset({ mainAxis: off.mainAxis ?? defaultOffset, crossAxis: off.crossAxis ?? 0 }));
  }

  if (opts.flip !== false)
    mw.push(flip());

  mw.push(shift({ padding: opts.shiftPadding ?? DEFAULT_FLOATING_OPTIONS.shiftPadding }));

  if (arrowEl)
    mw.push(arrow({ element: arrowEl, padding: 4 }));

  return mw;
}

function applyArrowStyles(arrowEl: HTMLElement | null, result: ComputePositionReturn): void {
  const arrowData = result.middlewareData.arrow;
  if (!arrowEl || !arrowData)
    return;

  Object.assign(arrowEl.style, {
    left: arrowData.x != null ? `${arrowData.x}px` : '',
    top: arrowData.y != null ? `${arrowData.y}px` : '',
  });
}

export function useFloating(
  options: MaybeRefOrGetter<FloatingOptions>,
  disabled: MaybeRefOrGetter<boolean> = false,
  openDelay: MaybeRefOrGetter<number> = 0,
  closeDelay: MaybeRefOrGetter<number> = 0,
  virtualReference?: MaybeRefOrGetter<Element | VirtualElement | undefined>,
): UseFloatingReturn {
  const reference = ref<HTMLElement>();
  const popover = ref<MaybeElement>();
  const open = shallowRef<boolean>(false);
  const visible = shallowRef<boolean>(false);
  const leavePending = shallowRef<boolean>(false);
  const currentPlacement = shallowRef<Placement>(toValue(options).placement ?? DEFAULT_FLOATING_OPTIONS.placement);

  let cleanupAutoUpdate: (() => void) | null = null;

  const openTimeoutManager = useTimeoutManager();
  const closeTimeoutManager = useTimeoutManager();

  function onLeaveComplete(): void {
    set(visible, false);
  }

  function onOpen(immediate: boolean = false): void {
    if (toValue(disabled))
      return;

    closeTimeoutManager.clear();

    set(leavePending, false);
    if (!openTimeoutManager.isActive()) {
      set(visible, true);

      openTimeoutManager.create(
        () => {
          set(open, true);
        },
        immediate ? 0 : toValue(openDelay),
      );
    }
  }

  function onClose(immediate: boolean = false): void {
    if (toValue(disabled))
      return;

    openTimeoutManager.clear();

    if (!closeTimeoutManager.isActive()) {
      closeTimeoutManager.create(
        () => {
          if (!get(open))
            onLeaveComplete();

          set(open, false);
        },
        immediate ? 0 : toValue(closeDelay),
      );
    }
  }

  function onLeavePending(): void {
    set(leavePending, true);
  }

  function getValidElements(): { popoverEl: HTMLElement; referenceEl: Element | VirtualElement } | null {
    if (!get(popover) || (!get(reference) && !toValue(virtualReference)))
      return null;

    const popoverEl = unrefElement(popover);
    const referenceEl = toValue(virtualReference) || unrefElement(reference);

    if (!(popoverEl instanceof HTMLElement) || !referenceEl)
      return null;

    return { popoverEl, referenceEl };
  }

  async function updatePosition(): Promise<void> {
    const elements = getValidElements();
    if (!elements)
      return;

    const { popoverEl, referenceEl } = elements;
    const opts = toValue(options);
    const arrowEl = popoverEl.querySelector<HTMLElement>('[data-id="arrow"]');
    const strategy = opts.strategy ?? DEFAULT_FLOATING_OPTIONS.strategy;

    const result = await computePosition(referenceEl, popoverEl, {
      middleware: buildMiddleware(opts, arrowEl),
      placement: opts.placement ?? DEFAULT_FLOATING_OPTIONS.placement,
      strategy,
    });

    Object.assign(popoverEl.style, {
      left: `${result.x}px`,
      position: strategy,
      top: `${result.y}px`,
    });

    set(currentPlacement, result.placement);
    applyArrowStyles(arrowEl, result);
  }

  function startAutoUpdate(): void {
    stopAutoUpdate();
    const elements = getValidElements();
    if (!elements)
      return;

    const { popoverEl, referenceEl } = elements;
    const opts = toValue(options);
    const autoUpdateOpt = opts.autoUpdate ?? DEFAULT_FLOATING_OPTIONS.autoUpdate;

    if (autoUpdateOpt === false)
      return;

    const autoUpdateOptions = typeof autoUpdateOpt === 'object'
      ? {
          ancestorResize: autoUpdateOpt.resize ?? true,
          ancestorScroll: autoUpdateOpt.scroll ?? true,
          elementResize: true,
        }
      : undefined;

    cleanupAutoUpdate = autoUpdate(
      referenceEl,
      popoverEl,
      () => { updatePosition().catch(() => {}); },
      autoUpdateOptions,
    );
  }

  function stopAutoUpdate(): void {
    cleanupAutoUpdate?.();
    cleanupAutoUpdate = null;
  }

  onMounted(() => {
    watchEffect((onCleanup) => {
      startAutoUpdate();
      onCleanup(stopAutoUpdate);
    });
  });

  return {
    currentPlacement: readonly(currentPlacement),
    leavePending, // eslint-disable-line @rotki/composable-return-readonly -- written by consumer transition hooks
    onClose,
    onLeaveComplete,
    onLeavePending,
    onOpen,
    open, // eslint-disable-line @rotki/composable-return-readonly -- v-model bound by consumers
    popover, // eslint-disable-line @rotki/composable-return-readonly -- template ref bound by consumers
    reference, // eslint-disable-line @rotki/composable-return-readonly -- template ref bound by consumers
    updatePosition,
    visible, // eslint-disable-line @rotki/composable-return-readonly -- used as v-if condition by consumers
  };
}
