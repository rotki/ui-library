import type { MaybeRefOrGetter, Ref } from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import { isDevelopment } from '@/utils/development';

/** Long enough for an opening accordion or tab panel to settle before the check reads its overflow. */
const CHECK_DELAY_MS = 1000;

/**
 * The nearest ancestor with `overflow: hidden` on either axis, which a `position: sticky` element
 * sticks to instead of the page. `hidden` never scrolls, so the element can never stick. `auto` and
 * `scroll` are left out: those can be real scrolling areas, like a dialog body. `clip` makes no
 * scroll container, so it never blocks. A box marked `data-clipped` clips only while it animates.
 *
 * @param element - where the walk up the tree starts; its own overflow does not count
 * @returns the blocking ancestor, or undefined when nothing blocks the element
 */
export function findStickyBlocker(element: HTMLElement): HTMLElement | undefined {
  let parent = element.parentElement;
  while (parent && parent !== document.body && parent !== document.documentElement) {
    const { overflowX, overflowY } = getComputedStyle(parent);
    if ((overflowX === 'hidden' || overflowY === 'hidden') && !parent.hasAttribute('data-clipped'))
      return parent;
    parent = parent.parentElement;
  }
  return undefined;
}

/**
 * A short, recognizable name for an element in a console message.
 *
 * @param element - the element to name
 * @returns its tag, `data-id` and first classes
 */
function describe(element: HTMLElement): string {
  const id = element.dataset.id ? `[data-id="${element.dataset.id}"]` : '';
  const classes = [...element.classList].slice(0, 3).map(name => `.${name}`).join('');
  return `<${element.tagName.toLowerCase()}${id}${classes}>`;
}

/**
 * In a development build, warns once when an ancestor keeps a sticky element from sticking to the
 * page. Silent in production, where the check does not run.
 *
 * @param element - the `position: sticky` box, checked once it is mounted
 * @param enabled - whether the element is meant to stick
 * @param name - what the element is, for the message
 */
export function useStickyBlockerWarning(
  element: Readonly<Ref<HTMLElement | null | undefined>>,
  enabled: MaybeRefOrGetter<boolean>,
  name: string,
): void {
  if (!isDevelopment())
    return;

  let warned = false;

  function check(): void {
    const target = get(element);
    if (warned || !toValue(enabled) || !target)
      return;
    const blocker = findStickyBlocker(target);
    if (!blocker)
      return;
    warned = true;
    console.warn(
      `[@rotki/ui-library] ${name} cannot stick to the page: the ancestor ${describe(blocker)} has overflow: hidden, `
      + 'so the bar sticks to it instead. Use overflow: clip there (it clips the same without creating a scroll container), '
      + 'or move the element out of it.',
      blocker,
    );
  }

  const { start } = useTimeoutFn(check, CHECK_DELAY_MS, { immediate: false });

  watch([element, () => toValue(enabled)], ([target, on]) => {
    if (target && on)
      start();
  }, { immediate: true });
}
