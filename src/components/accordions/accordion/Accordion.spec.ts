import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Accordion from '@/components/accordions/accordion/Accordion.vue';

function createWrapper(options?: any) {
  return mount(Accordion, {
    ...options,
    slots: {
      default: 'Accordion content',
      header: 'Accordion header',
    },
  });
}

describe('accordions/Accordion', () => {
  it('renders properly', async () => {
    const wrapper = createWrapper({
      propsData: {
        open: true,
      },
    });

    expect(wrapper.find('.accordion__header').text()).toContain('Accordion header');
    expect(wrapper.find('.accordion__content').text()).toContain('Accordion content');
  });

  it('pass `open` and `eager` props', async () => {
    const wrapper = createWrapper();

    expect(wrapper.find('.accordion__content').exists()).toBeFalsy();

    await wrapper.setProps({
      open: true,
    });

    expect(wrapper.find('.accordion__content').exists()).toBeTruthy();
    expect(wrapper.find('.accordion').classes()).toMatch(/_open_/);

    await wrapper.setProps({
      eager: true,
      open: false,
    });

    expect(wrapper.find('.accordion__content').exists()).toBeTruthy();
    expect(wrapper.find('.accordion').classes()).not.toMatch(/_open_/);
  });

  it('pass `headerClass` and `contentClass` props', async () => {
    const wrapper = createWrapper({
      propsData: {
        open: true,
      },
    });
    const customClass = 'custom-class';

    expect(wrapper.find('.accordion__header').classes()).not.toContain(customClass);
    expect(wrapper.find('.accordion__content').classes()).not.toContain(customClass);

    await wrapper.setProps({
      contentClass: customClass,
      headerClass: customClass,
    });

    expect(wrapper.find('.accordion__header').classes()).toContain(customClass);
    expect(wrapper.find('.accordion__content').classes()).toContain(customClass);
  });
});
