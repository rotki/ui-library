import { type ComponentMountingOptions, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiAccordion from '@/components/accordions/accordion/RuiAccordion.vue';

function createWrapper(options?: ComponentMountingOptions<typeof RuiAccordion>) {
  return mount(RuiAccordion, {
    ...options,
    slots: {
      default: 'Accordion content',
      header: 'Accordion header',
    },
  });
}

describe('accordions/Accordion', () => {
  it('renders properly', () => {
    const wrapper = createWrapper({
      props: {
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
    expect(wrapper.find('.accordion').classes()).toEqual(
      expect.arrayContaining([expect.stringMatching(/_open_/)]),
    );

    await wrapper.setProps({
      eager: true,
      open: false,
    });

    expect(wrapper.find('.accordion__content').exists()).toBeTruthy();
    expect(wrapper.find('.accordion').classes()).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/_open_/)]),
    );
  });

  it('pass `headerClass` and `contentClass` props', async () => {
    const wrapper = createWrapper({
      props: {
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
