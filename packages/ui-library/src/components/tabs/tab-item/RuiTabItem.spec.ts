import { afterEach, describe, expect, it } from 'vitest';
import RuiTabItem from '@/components/tabs/tab-item/RuiTabItem.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';
import { createMounter, type MountedWrapper } from '~/tests/helpers/mount-component';

const createWrapper = createMounter(RuiTabItem, {
  global: {
    stubs: {
      Transition: false,
    },
  },
  props: {
    value: 'value',
  },
});

describe('components/tabs/tab-item/RuiTabItem.vue', () => {
  let wrapper: MountedWrapper<typeof RuiTabItem>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should have role="tabpanel" on root', () => {
    wrapper = createWrapper();
    expect(wrapper.element.getAttribute('role')).toBe('tabpanel');
  });

  it('should not render if not active', () => {
    wrapper = createWrapper();

    expect(wrapper.find('div').find('div').exists()).toBeFalsy();
  });

  it('should render if it\'s active', async () => {
    wrapper = createWrapper({
      props: {
        active: true,
      },
    });

    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expectWrapperNotToHaveClass(wrapper, ':scope > div', /hidden/);

    await wrapper.setProps({
      eager: true,
    });
    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expectWrapperNotToHaveClass(wrapper, ':scope > div', /hidden/);

    await wrapper.setProps({
      active: false,
    });

    expect(wrapper.find('div').find('div').exists()).toBeTruthy();
    expectWrapperToHaveClass(wrapper, ':scope > div', /hidden/);
  });
});
