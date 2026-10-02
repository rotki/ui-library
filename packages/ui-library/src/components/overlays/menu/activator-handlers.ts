export interface ActivatorHandlers {
  onClick?: () => void;
  onMouseover?: () => void;
  onMouseleave?: () => void;
}

/**
 * Keeps only the event handlers of an activator slot's `attrs`. For an
 * activator that sets its own ARIA, or one rendered as an element that cannot
 * carry `aria-haspopup` and `aria-expanded`.
 */
export function activatorHandlers(attrs: ActivatorHandlers): ActivatorHandlers {
  const { onClick, onMouseover, onMouseleave } = attrs;
  return { onClick, onMouseover, onMouseleave };
}
