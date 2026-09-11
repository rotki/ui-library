import { get, set } from '@vueuse/shared';
import { computed, type ComputedRef, type MaybeRefOrGetter, onScopeDispose, ref, toValue, watch } from 'vue';

/** One layer covering the page, and the way to ask it to go. */
interface OverlayLayer {
  readonly id: number;
  /**
   * Whether the layer is still showing. A getter rather than a boolean, so the
   * stack reads it live: a layer is asked to dismiss long before it leaves, and
   * between those two moments it is listed but no longer up.
   */
  readonly isOpen: () => boolean;
  readonly dismiss: () => void;
}

/**
 * Module scoped rather than per call. Layers stack in the window, not in a
 * component tree, and whatever pops them (a router guard, a hardware back
 * button) runs outside any component, so both sides have to read one list.
 *
 * Order is the order layers opened, not their `zIndex`: every RuiDialog carries
 * the same default z-index, so it says nothing about which is on top.
 */
const overlays = ref<OverlayLayer[]>([]);

let nextId = 0;

export interface UseOverlayStackReturn {
  /**
   * Whether any layer is still showing. Counts what is up rather than what is
   * registered, since a layer that was asked to dismiss stays listed until its
   * own open state says otherwise.
   */
  hasOverlay: ComputedRef<boolean>;
  /**
   * Asks the topmost layer still showing to dismiss itself, and reports whether
   * there was one. The caller needs that answer to tell a gesture it handled
   * from one it has to let through.
   *
   * Nothing is removed here. A layer leaves only when its own open state says
   * so, because dismissing is a request the layer may decline: a persistent
   * dialog refuses outright, and a dirty form may raise a discard prompt and
   * stay up. Dropping the layer here would deregister something still covering
   * the page, and the next gesture would sail past it.
   *
   * A layer that declines still counts as handled, so the gesture is swallowed
   * rather than passed through to whatever is underneath.
   */
  dismissTop: () => boolean;
  /** Adds a layer on top. Returns the handle it is removed with. */
  register: (isOpen: () => boolean, dismiss: () => void) => number;
  unregister: (id: number) => void;
}

export function useOverlayStack(): UseOverlayStackReturn {
  const hasOverlay = computed<boolean>(() => get(overlays).some(layer => layer.isOpen()));

  function register(isOpen: () => boolean, dismiss: () => void): number {
    const id = nextId++;
    set(overlays, [...get(overlays), { dismiss, id, isOpen }]);
    return id;
  }

  function unregister(id: number): void {
    set(overlays, get(overlays).filter(overlay => overlay.id !== id));
  }

  function dismissTop(): boolean {
    const layers = get(overlays);

    for (let index = layers.length - 1; index >= 0; index--) {
      const layer = layers[index];

      if (!layer?.isOpen())
        continue;

      layer.dismiss();
      return true;
    }

    return false;
  }

  return { dismissTop, hasOverlay, register, unregister };
}

/**
 * Declares something as a layer the stack should be able to take down.
 *
 * RuiDialog does this for itself, and RuiBottomSheet through it. Anything else
 * covering the page - a custom panel, a wrapper around RuiMenu - opts in here.
 *
 * @param open - whether the layer is showing; the registration follows it, so the
 * stack ends up ordered by when layers opened rather than when they were built
 * @param dismiss - what the gesture should do, which is whatever the layer's own
 * close control does. It may decline, and the layer then stays in the stack, so
 * the gesture keeps being swallowed for as long as the layer is up. Deciding
 * inside `dismiss` rather than by dropping out of `open` matters: a dialog that
 * turns persistent partway through its life would otherwise leave the stack
 * exactly when the gesture costs most.
 */
export function useDismissableOverlay(open: MaybeRefOrGetter<boolean>, dismiss: () => void): void {
  const { register, unregister } = useOverlayStack();

  let id: number | undefined;

  function drop(): void {
    if (id === undefined)
      return;

    unregister(id);
    id = undefined;
  }

  watch(() => toValue(open), (isOpen) => {
    if (isOpen && id === undefined)
      id = register(() => toValue(open), dismiss);
    else if (!isOpen)
      drop();
  }, { immediate: true });

  /**
   * A layer whose component is torn down never sets `open` back to false, and
   * would sit in the stack for the rest of the session swallowing every later
   * gesture.
   */
  onScopeDispose(drop);
}

/**
 * Empties the stack.
 *
 * The stack outlives any component, and the unit project runs on a pool that
 * shares one module registry across the files in a worker, so without this a
 * layer left behind by one spec is still listed in the next.
 */
export function resetOverlayStack(): void {
  set(overlays, []);
  nextId = 0;
}
