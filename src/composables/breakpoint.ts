import { breakpointsTailwind } from '@vueuse/core';
import { camelCase } from 'scule';
import type { Ref } from 'vue';

export function useBreakpoint() {
  const { width } = useWindowSize();

  const breakpointList = {
    xs: 0,
    ...breakpointsTailwind,
  } as const;

  type Breakpoint = keyof typeof breakpointList;

  const breakpoints = useBreakpoints(breakpointList);

  const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

  const list = getKeys(breakpointList);

  const rawSizes: [Breakpoint, Ref<boolean>][] = list.map(
    (breakpoint, index) => [
      breakpoint,
      index < list.length - 1
        ? breakpoints.between(breakpoint, list[index + 1])
        : breakpoints[breakpoint],
    ],
  );

  const sizes = rawSizes.map(([breakpoint, value]) => [
    camelCase(`is_${breakpoint}`),
    value,
  ]);

  const sizesUp = list.map(breakpoint => [
    camelCase(`is_${breakpoint}_and_up`),
    breakpoints.greaterOrEqual(breakpoint),
  ]);

  const sizesDown = list.map(breakpoint => [
    camelCase(`is_${breakpoint}_and_down`),
    breakpoints.smaller(breakpoint),
  ]);

  const name = computed(() => rawSizes.find(item => get(item[1]))?.[0] || '');

  return {
    ...Object.fromEntries(sizes),
    ...Object.fromEntries(sizesUp),
    ...Object.fromEntries(sizesDown),
    name,
    width,
  };
}
