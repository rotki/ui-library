import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiProgress from '@/components/progress/RuiProgress.vue';

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
    const progressbar = wrapper.find('div[role=progressbar]');
    expect(progressbar.attributes('data-variant')).toBe('determinate');
    expect(progressbar.attributes('data-color')).toBe('inherit');
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        color: 'secondary',
        value: 50,
        variant: 'indeterminate',
      },
    });
    const progressbar = wrapper.find('div[role=progressbar]');
    expect(progressbar.attributes('data-color')).toBe('secondary');
    expect(progressbar.attributes('data-variant')).toBe('indeterminate');

    await wrapper.setProps({ color: 'primary' });
    expect(progressbar.attributes('data-color')).toBe('primary');

    await wrapper.setProps({ color: 'inherit' });
    expect(progressbar.attributes('data-color')).toBe('inherit');

    await wrapper.setProps({ circular: true });
    expect(wrapper.find('div[role=progressbar] svg').exists()).toBeTruthy();
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

    expect(wrapper.find('div[role=progressbar] svg circle').exists()).toBeTruthy();
  });

  it('should render a track behind the arc for determinate circular progress', async () => {
    wrapper = createWrapper({
      props: {
        circular: true,
        value: 50,
      },
    });

    expect(wrapper.findAll('div[role=progressbar] svg circle')).toHaveLength(2);

    // the spinning variant has no track, a full ring would just sit there
    await wrapper.setProps({ variant: 'indeterminate' });
    expect(wrapper.findAll('div[role=progressbar] svg circle')).toHaveLength(1);
  });

  it('should scale the circular label with size and thickness', async () => {
    function labelFontSize(): number {
      const style = wrapper.find('div[role=progressbar] > div').attributes('style') ?? '';
      return Number.parseFloat(/font-size:\s*([\d.]+)px/.exec(style)?.[1] ?? '0');
    }

    wrapper = createWrapper({
      props: {
        circular: true,
        showLabel: true,
        size: 30,
        thickness: 2,
        value: 94,
      },
    });

    const label = wrapper.find('div[role=progressbar] > div');
    expect(label.text()).toBe('94%');
    // the value is already exposed through aria-valuenow
    expect(label.attributes('aria-hidden')).toBe('true');
    expect(labelFontSize()).toBeCloseTo(8.21, 2);

    // the label is sized for `100%`, so it does not jump as the value climbs
    await wrapper.setProps({ value: 100 });
    expect(labelFontSize()).toBeCloseTo(8.21, 2);

    // large rings are capped by the sublinear curve rather than the fit
    await wrapper.setProps({ size: 100 });
    expect(labelFontSize()).toBeCloseTo(21, 1);

    // a fatter stroke leaves less room inside, and the fit takes over again
    await wrapper.setProps({ size: 30, thickness: 10 });
    expect(labelFontSize()).toBeCloseTo(3.16, 1);
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
    expect(wrapper.find('div[role=progressbar]').attributes('data-color')).toBe('inherit');

    await wrapper.setProps({ color: 'primary' });
    expect(wrapper.find('div[role=progressbar]').attributes('data-color')).toBe('primary');

    await wrapper.setProps({ color: 'secondary' });
    expect(wrapper.find('div[role=progressbar]').attributes('data-color')).toBe('secondary');

    await wrapper.setProps({ color: 'error' });
    expect(wrapper.find('div[role=progressbar]').attributes('data-color')).toBe('error');

    await wrapper.setProps({ color: 'success' });
    expect(wrapper.find('div[role=progressbar]').attributes('data-color')).toBe('success');
  });
});
