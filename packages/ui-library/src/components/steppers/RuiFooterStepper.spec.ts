import { type ComponentMountingOptions, mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RuiFooterStepper from '@/components/steppers/RuiFooterStepper.vue';
import { expectToHaveClass } from '~/tests/helpers/dom-helpers';

function createWrapper(
  options: ComponentMountingOptions<typeof RuiFooterStepper>,
): VueWrapper<InstanceType<typeof RuiFooterStepper>> {
  return mount(RuiFooterStepper, options);
}

describe('components/steppers/RuiFooterStepper.vue', () => {
  let wrapper: VueWrapper<InstanceType<typeof RuiFooterStepper>>;

  afterEach(() => {
    wrapper?.unmount();
  });

  it('should render properly', () => {
    wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
      },
    });
    expectToHaveClass(wrapper.element, /_footer-stepper_/);
    expectToHaveClass(wrapper.element, /_numeric_/);
  });

  it('should pass props correctly', async () => {
    wrapper = createWrapper({
      props: {
        modelValue: 1,
        pages: 5,
        variant: 'bullet',
      },
    });

    await wrapper.setProps({ variant: 'progress' });
    expectToHaveClass(wrapper.element, /_progress_/);

    const next = wrapper.find('button ~ button span[class*=_label] span');
    expect(next.exists()).toBeTruthy();

    await wrapper.setProps({ variant: 'pill' });
    expectToHaveClass(wrapper.element, /_pill_/);
  });
});
