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

  it('should render a single root that keeps the class a parent passes', () => {
    wrapper = mount(RuiFormTextDetail, {
      attrs: { class: 'px-4' },
      global: { stubs: { 'transition': false, 'transition-group': false } },
    });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['details', 'px-4']));
  });

  it('should render a hint present on first render in place, without the enter transition', () => {
    wrapper = createWrapper({ hint: 'A hint' });

    const hint = wrapper.find('.text-rui-text-secondary');
    expect(hint.text()).toBe('A hint');
    expect(hint.classes()).not.toContain('opacity-0');
  });

  it('should reserve a 20px line while empty', () => {
    wrapper = createWrapper({});

    expect(wrapper.classes()).toContain('min-h-5');
    expect(wrapper.element.children).toHaveLength(0);
  });

  it('should take no space while empty with details auto', () => {
    wrapper = createWrapper({ details: 'auto' });

    expect(wrapper.classes()).not.toContain('min-h-5');
    expect(wrapper.element.children).toHaveLength(0);
  });

  it('should put the message on a 16px line 4px below the control', () => {
    wrapper = createWrapper({ details: 'auto', hint: 'A hint' });

    const hint = wrapper.find('.text-rui-text-secondary');
    expect(hint.classes()).toEqual(expect.arrayContaining(['pt-1', 'text-xs/4']));
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
