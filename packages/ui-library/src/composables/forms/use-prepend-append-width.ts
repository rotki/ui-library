import type { ShallowRef } from 'vue';
import { assert } from '@/utils/assert';

export interface PrependAppendWidth {
  prependWidth: Readonly<ShallowRef<string>>;
  appendWidth: Readonly<ShallowRef<string>>;
}

/**
 * Tracks how much room a field's prepend and append regions take.
 *
 * Each is measured by its outer border-box width, so a caller gets the whole
 * space the region occupies, both paddings included. The earlier
 * `contentRect.width + contentRect.left` form added padding-left but dropped
 * padding-right, so a prepend slot styled with `pr-3` alone reported 12px
 * short and the floated label landed under the icon's trailing padding
 * instead of aligned with the input text.
 *
 * @param prepend - the prepend region's element
 * @param append - the append region's element
 * @param offset - extra width to add to the prepend measurement
 * @returns both widths, in px, as CSS lengths
 */
export function usePrependAppendWidth(
  prepend: Readonly<ShallowRef<HTMLDivElement | null>>,
  append: Readonly<ShallowRef<HTMLDivElement | null>>,
  offset: number = 0,
): PrependAppendWidth {
  const prependWidth = shallowRef<string>('0px');
  const appendWidth = shallowRef<string>('0px');

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

  return {
    appendWidth: readonly(appendWidth),
    prependWidth: readonly(prependWidth),
  };
}
