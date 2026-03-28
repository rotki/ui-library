import { type FloatingOptions, Placement, Strategy } from './floating';

/** @deprecated Use FloatingOptions instead */
export interface PopperOptions {
  locked?: boolean;
  overflowPadding?: number;
  offsetDistance?: number;
  offsetSkid?: number;
  placement?: Placement;
  strategy?: Strategy;
  gpuAcceleration?: boolean;
  adaptive?: boolean;
  scroll?: boolean;
  resize?: boolean;
}

/** @deprecated Use FloatingOptions directly. Will be removed in next major. */
export function toFloatingOptions(opts: PopperOptions): FloatingOptions {
  return {
    autoUpdate: {
      resize: opts.resize ?? true,
      scroll: opts.scroll ?? true,
    },
    flip: !(opts.locked ?? false),
    offset: {
      crossAxis: opts.offsetSkid ?? 0,
      mainAxis: opts.offsetDistance ?? 8,
    },
    placement: opts.placement ?? Placement.bottom,
    shiftPadding: opts.overflowPadding ?? 8,
    strategy: opts.strategy ?? Strategy.absolute,
  };
}
