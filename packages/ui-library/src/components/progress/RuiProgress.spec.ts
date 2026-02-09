import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiProgress from '@/components/progress/RuiProgress.vue';
import { expectWrapperToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options?: ComponentMountingOptions<typeof RuiProgress>,
): VueWrapper<InstanceType<typeof RuiProgress>> {
  return mount(RuiProgress, options);
}

describe('components/progress/RuiProgress.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiProgress>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        value: 50,
      },
    });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_progress_/);
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_inherit_/);
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_determinate_/);
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        color: 'secondary',
        value: 50,
        variant: 'indeterminate',
      },
    });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_secondary_/);
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_indeterminate_/);
    await wrapper.setProps({ color: 'primary' });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_primary_/);
    await wrapper.setProps({ color: 'inherit' });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_inherit_/);
    await wrapper.setProps({ circular: true });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_circular_/);
  });

  it('should have role="progressbar" with ARIA value attributes', () => {
    wrapper = createWrapper({
      props: {
        value: 50,
      },
    });

    const progressbar = wrapper.find('div[role=progressbar]');
    expect(progressbar.exists()).toBeTruthy();
    expect(progressbar.attributes('aria-valuemin')).toBe('0');
    expect(progressbar.attributes('aria-valuemax')).toBe('100');
    expect(progressbar.attributes('aria-valuenow')).toBe('50');
  });

  it('should update aria-valuenow when value changes', async () => {
    wrapper = createWrapper({
      props: {
        value: 25,
      },
    });

    expect(wrapper.find('div[role=progressbar]').attributes('aria-valuenow')).toBe('25');

    await wrapper.setProps({ value: 75 });
    expect(wrapper.find('div[role=progressbar]').attributes('aria-valuenow')).toBe('75');
  });

  it('should render circular variant', () => {
    wrapper = createWrapper({
      props: {
        circular: true,
        value: 50,
      },
    });

    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_circular_/);
    expect(wrapper.find('svg circle').exists()).toBeTruthy();
  });

  it('should show label when showLabel is true', () => {
    wrapper = createWrapper({
      props: {
        showLabel: true,
        value: 40,
      },
    });

    expect(wrapper.text()).toContain('40%');
  });

  it('should pass color props', async () => {
    wrapper = createWrapper({});
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_inherit_/);

    await wrapper.setProps({ color: 'primary' });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_primary_/);

    await wrapper.setProps({ color: 'secondary' });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_secondary_/);

    await wrapper.setProps({ color: 'error' });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_error_/);

    await wrapper.setProps({ color: 'success' });
    expectWrapperToHaveClass(wrapper, 'div[role=progressbar]', /_success_/);
  });
});
