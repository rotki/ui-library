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
  const prependWidth = ref<string>('0px');
  const appendWidth = ref<string>('0px');

  useResizeObserver(prepend, (entries) => {
    const [entry] = entries;
    assert(entry);
    const { width, left } = entry.contentRect;
    set(prependWidth, `${width + left + offset}px`);
  });

  useResizeObserver(append, (entries) => {
    const [entry] = entries;
    assert(entry);
    const { width, right } = entry.contentRect;
    set(appendWidth, `${width + right + offset}px`);
  });

  return { prependWidth, appendWidth };
}
