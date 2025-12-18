import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RuiAccordion from '@/components/accordions/accordion/RuiAccordion.vue';

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

    expect(wrapper.find('[data-accordion-trigger]').text()).toContain('Accordion header');
    expect(wrapper.find('[data-accordion-content]').text()).toContain('Accordion content');
  });

  it('should pass `open` and `eager` props', async () => {
    wrapper = createWrapper();

    expect(wrapper.find('[data-accordion-content]').exists()).toBeFalsy();
    expect(wrapper.find('[data-accordion]').attributes('data-state')).toBe('closed');

    await wrapper.setProps({
      open: true,
    });

    expect(wrapper.find('[data-accordion-content]').exists()).toBeTruthy();
    expect(wrapper.find('[data-accordion]').attributes('data-state')).toBe('open');

    await wrapper.setProps({
      eager: true,
      open: false,
    });

    expect(wrapper.find('[data-accordion-content]').exists()).toBeTruthy();
    expect(wrapper.find('[data-accordion]').attributes('data-state')).toBe('closed');
  });

  it('should pass `headerClass` and `contentClass` props', async () => {
    wrapper = createWrapper({
      props: {
        open: true,
      },
    });
    const customClass = 'custom-class';

    expect(wrapper.find('[data-accordion-trigger]').classes()).not.toContain(customClass);
    expect(wrapper.find('[data-accordion-content]').classes()).not.toContain(customClass);

    await wrapper.setProps({
      contentClass: customClass,
      headerClass: customClass,
    });

    expect(wrapper.find('[data-accordion-trigger]').classes()).toContain(customClass);
    expect(wrapper.find('[data-accordion-content]').classes()).toContain(customClass);
  });

  it('should have proper accessibility attributes', () => {
    wrapper = createWrapper({
      props: {
        open: true,
      },
    });

    const trigger = wrapper.find('[data-accordion-trigger]');
    const content = wrapper.find('[data-accordion-content]');

    expect(trigger.attributes('role')).toBe('button');
    expect(trigger.attributes('tabindex')).toBe('0');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(trigger.attributes('aria-controls')).toBe(content.attributes('id'));

    expect(content.attributes('role')).toBe('region');
    expect(content.attributes('aria-labelledby')).toBe(trigger.attributes('id'));
  });

  it('should toggle on keyboard events', async () => {
    wrapper = createWrapper();

    const trigger = wrapper.find('[data-accordion-trigger]');

    await trigger.trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('click')).toHaveLength(1);

    await trigger.trigger('keydown', { key: ' ' });
    expect(wrapper.emitted('click')).toHaveLength(2);

    // Other keys should not trigger
    await trigger.trigger('keydown', { key: 'Escape' });
    expect(wrapper.emitted('click')).toHaveLength(2);
  });
});
