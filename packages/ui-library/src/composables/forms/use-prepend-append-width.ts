import type { Ref, ShallowRef } from 'vue';
import { assert } from '@/utils/assert';

export interface PrependAppendWidth {
  prependWidth: Ref<string>;
  appendWidth: Ref<string>;
}

export function usePrependAppendWidth(
  prepend: Readonly<ShallowRef<HTMLDivElement | null>>,
  append: Readonly<ShallowRef<HTMLDivElement | null>>,
  offset: number = 0,
): PrependAppendWidth {
  const prependWidth = shallowRef<string>('0px');
  const appendWidth = shallowRef<string>('0px');

  // Measure the element's outer (border-box) width so callers get the full
  // space the prepend/append region occupies — including both left and
  // right padding. The previous `contentRect.width + contentRect.left` form
  // added padding-left but silently dropped padding-right, so a prepend
  // slot styled with `pr-3` (only) reported 12px short of its real width
  // and the floated label landed under the icon's trailing padding instead
  // of aligned with the input text.
  useResizeObserver(prepend, () => {
    const target = get(prepend);
    assert(target);
    set(prependWidth, `${target.offsetWidth + offset}px`);
  });

  useResizeObserver(append, () => {
    const target = get(append);
    assert(target);
    set(appendWidth, `${target.offsetWidth + offset}px`);
  });

  return { prependWidth, appendWidth };
}
