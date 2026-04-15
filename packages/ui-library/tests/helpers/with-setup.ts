import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

/**
 * Mount a composable inside a minimal host component so that Vue's
 * lifecycle (provide/inject, watchers, etc.) is available.
 *
 * @param composable — factory that calls the composable under test
 * @param options    — optional Vue Test Utils mounting options (e.g. `global.provide`)
 * @returns `{ result, unmount }` — the composable's return value and a teardown function
 */
export function withSetup<T>(
  composable: () => T,
  options?: ComponentMountingOptions<any>,
): { result: T; unmount: () => void } {
  let result!: T;
  const TestComponent = defineComponent({
    setup() {
      result = composable();
      return {};
    },
    template: '<div></div>',
  });
  const wrapper = mount(TestComponent, options);
  return { result, unmount: () => wrapper.unmount() };
}
