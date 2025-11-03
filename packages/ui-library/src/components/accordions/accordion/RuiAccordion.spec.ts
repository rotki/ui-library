import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiAccordion from '@/components/accordions/accordion/RuiAccordion.vue';
import { expectWrapperNotToHaveClass, expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiAccordion>,
): VueWrapper<InstanceType<typeof RuiAccordion>> {
  return mount(RuiAccordion, {
    ...options,
    slots: {
      default: 'Accordion content',
      header: 'Accordion header',
    },
  });
}

describe('components/accordions/accordion/RuiAccordion.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiAccordion>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        open: true,
      },
    });

    expect(wrapper.find('.accordion__header').text()).toContain('Accordion header');
    expect(wrapper.find('.accordion__content').text()).toContain('Accordion content');
  });

  it('should pass `open` and `eager` props', async () => {
    wrapper = createWrapper();

    expect(wrapper.find('.accordion__content').exists()).toBeFalsy();

    await wrapper.setProps({
      open: true,
    });

    expect(wrapper.find('.accordion__content').exists()).toBeTruthy();
    expectWrapperToHaveClass(wrapper, '.accordion', /_open_/);

    await wrapper.setProps({
      eager: true,
      open: false,
    });

    expect(wrapper.find('.accordion__content').exists()).toBeTruthy();
    expectWrapperNotToHaveClass(wrapper, '.accordion', /_open_/);
  });

  it('should pass `headerClass` and `contentClass` props', async () => {
    wrapper = createWrapper({
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
