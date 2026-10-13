import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import RuiFormTextDetail from '@/components/helpers/RuiFormTextDetail.vue';

describe('components/helpers/RuiFormTextDetail.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiFormTextDetail>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  /** Mounts with real transitions, so the enter classes are applied as they are in the app. */
  function createWrapper(props: InstanceType<typeof RuiFormTextDetail>['$props']): VueWrapper<InstanceType<typeof RuiFormTextDetail>> {
    return mount(RuiFormTextDetail, { global: { stubs: { 'transition': false, 'transition-group': false } }, props });
  }

  it('should render a hint present on first render in place, without the enter transition', () => {
    wrapper = createWrapper({ hint: 'A hint' });

    const hint = wrapper.find('.text-rui-text-secondary');
    expect(hint.text()).toBe('A hint');
    expect(hint.classes()).not.toContain('opacity-0');
  });

  it('should still animate a hint that turns into an error', async () => {
    wrapper = createWrapper({ hint: 'A hint' });

    await wrapper.setProps({ errorMessages: ['Required'] });
    await nextTick();

    const error = wrapper.find('.text-rui-error');
    expect(error.text()).toBe('Required');
    expect(error.classes()).toContain('opacity-0');
  });
});
